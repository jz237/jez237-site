(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Co="181",id=0,fc=1,sd=2,Vl=1,Gl=2,kn=3,ai=0,He=1,ue=2,Pn=0,Zi=1,$i=2,pc=3,mc=4,rd=5,_i=100,ad=101,od=102,cd=103,ld=104,hd=200,dd=201,ud=202,fd=203,Ia=204,Ua=205,pd=206,md=207,xd=208,gd=209,_d=210,vd=211,Md=212,Sd=213,yd=214,Na=0,Fa=1,Oa=2,ji=3,Ba=4,za=5,ka=6,Va=7,Ro=0,bd=1,wd=2,si=0,Hl=1,Wl=2,Xl=3,Po=4,ql=5,Yl=6,Zl=7,$l=300,Qi=301,ts=302,Ga=303,Ha=304,zr=306,hn=1e3,Gn=1001,Wa=1002,nn=1003,Td=1004,Zs=1005,ln=1006,Zr=1007,Mi=1008,Dn=1009,Kl=1010,Jl=1011,Us=1012,Lo=1013,bi=1014,Cn=1015,Ln=1016,Do=1017,Io=1018,Ns=1020,jl=35902,Ql=35899,th=1021,eh=1022,vn=1023,Fs=1026,Os=1027,Uo=1028,No=1029,Fo=1030,Oo=1031,Bo=1033,br=33776,wr=33777,Tr=33778,Er=33779,Xa=35840,qa=35841,Ya=35842,Za=35843,$a=36196,Ka=37492,Ja=37496,ja=37808,Qa=37809,to=37810,eo=37811,no=37812,io=37813,so=37814,ro=37815,ao=37816,oo=37817,co=37818,lo=37819,ho=37820,uo=37821,fo=36492,po=36494,mo=36495,xo=36283,go=36284,_o=36285,vo=36286,Ed=3200,Ad=3201,zo=0,Cd=1,ti="",be="srgb",es="srgb-linear",Dr="linear",fe="srgb",Pi=7680,xc=519,Rd=512,Pd=513,Ld=514,nh=515,Dd=516,Id=517,Ud=518,Nd=519,gc=35044,_c="300 es",Rn=2e3,Ir=2001;function ih(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ur(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Fd(){const i=Ur("canvas");return i.style.display="block",i}const vc={};function Mc(...i){const t="THREE."+i.shift();console.log(t,...i)}function Yt(...i){const t="THREE."+i.shift();console.warn(t,...i)}function Pe(...i){const t="THREE."+i.shift();console.error(t,...i)}function Bs(...i){const t=i.join(" ");t in vc||(vc[t]=!0,Yt(...i))}function Od(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}class as{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const ze=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Sc=1234567;const Ts=Math.PI/180,zs=180/Math.PI;function Ei(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ze[i&255]+ze[i>>8&255]+ze[i>>16&255]+ze[i>>24&255]+"-"+ze[t&255]+ze[t>>8&255]+"-"+ze[t>>16&15|64]+ze[t>>24&255]+"-"+ze[e&63|128]+ze[e>>8&255]+"-"+ze[e>>16&255]+ze[e>>24&255]+ze[n&255]+ze[n>>8&255]+ze[n>>16&255]+ze[n>>24&255]).toLowerCase()}function te(i,t,e){return Math.max(t,Math.min(e,i))}function ko(i,t){return(i%t+t)%t}function Bd(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function zd(i,t,e){return i!==t?(e-i)/(t-i):0}function Es(i,t,e){return(1-e)*i+e*t}function kd(i,t,e,n){return Es(i,t,1-Math.exp(-e*n))}function Vd(i,t=1){return t-Math.abs(ko(i,t*2)-t)}function Gd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Hd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Wd(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Xd(i,t){return i+Math.random()*(t-i)}function qd(i){return i*(.5-Math.random())}function Yd(i){i!==void 0&&(Sc=i);let t=Sc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Zd(i){return i*Ts}function $d(i){return i*zs}function Kd(i){return(i&i-1)===0&&i!==0}function Jd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function jd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Qd(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),d=a((t+n)/2),u=r((t-n)/2),f=a((t-n)/2),p=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*d,c*u,c*f,o*l);break;case"YZY":i.set(c*f,o*d,c*u,o*l);break;case"ZXZ":i.set(c*u,c*f,o*d,o*l);break;case"XZX":i.set(o*d,c*g,c*p,o*l);break;case"YXY":i.set(c*p,o*d,c*g,o*l);break;case"ZYZ":i.set(c*g,c*p,o*d,o*l);break;default:Yt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function qi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function qe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Nt={DEG2RAD:Ts,RAD2DEG:zs,generateUUID:Ei,clamp:te,euclideanModulo:ko,mapLinear:Bd,inverseLerp:zd,lerp:Es,damp:kd,pingpong:Vd,smoothstep:Gd,smootherstep:Hd,randInt:Wd,randFloat:Xd,randFloatSpread:qd,seededRandom:Yd,degToRad:Zd,radToDeg:$d,isPowerOfTwo:Kd,ceilPowerOfTwo:Jd,floorPowerOfTwo:jd,setQuaternionFromProperEuler:Qd,normalize:qe,denormalize:qi};class _t{constructor(t=0,e=0){_t.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],u=n[s+3],f=r[a+0],p=r[a+1],g=r[a+2],S=r[a+3];if(o<=0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u;return}if(o>=1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=S;return}if(u!==S||c!==f||l!==p||d!==g){let m=c*f+l*p+d*g+u*S;m<0&&(f=-f,p=-p,g=-g,S=-S,m=-m);let h=1-o;if(m<.9995){const M=Math.acos(m),v=Math.sin(M);h=Math.sin(h*M)/v,o=Math.sin(o*M)/v,c=c*h+f*o,l=l*h+p*o,d=d*h+g*o,u=u*h+S*o}else{c=c*h+f*o,l=l*h+p*o,d=d*h+g*o,u=u*h+S*o;const M=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=M,l*=M,d*=M,u*=M}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],u=r[a],f=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+d*u+c*p-l*f,t[e+1]=c*g+d*f+l*u-o*p,t[e+2]=l*g+d*p+o*f-c*u,t[e+3]=d*g-o*u-c*f-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),u=o(r/2),f=c(n/2),p=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=f*d*u+l*p*g,this._y=l*p*u-f*d*g,this._z=l*d*g+f*p*u,this._w=l*d*u-f*p*g;break;case"YXZ":this._x=f*d*u+l*p*g,this._y=l*p*u-f*d*g,this._z=l*d*g-f*p*u,this._w=l*d*u+f*p*g;break;case"ZXY":this._x=f*d*u-l*p*g,this._y=l*p*u+f*d*g,this._z=l*d*g+f*p*u,this._w=l*d*u-f*p*g;break;case"ZYX":this._x=f*d*u-l*p*g,this._y=l*p*u+f*d*g,this._z=l*d*g-f*p*u,this._w=l*d*u+f*p*g;break;case"YZX":this._x=f*d*u+l*p*g,this._y=l*p*u+f*d*g,this._z=l*d*g-f*p*u,this._w=l*d*u-f*p*g;break;case"XZY":this._x=f*d*u-l*p*g,this._y=l*p*u-f*d*g,this._z=l*d*g+f*p*u,this._w=l*d*u+f*p*g;break;default:Yt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],d=e[6],u=e[10],f=n+o+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(d-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(d-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+d)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(te(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,d=e._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e<=0)return this;if(e>=1)return this.copy(t);let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-e;if(o<.9995){const l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,e=Math.sin(e*l)/d,this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this._onChangeCallback()}else this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(t=0,e=0,n=0){I.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(yc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(yc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),d=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+c*l+a*u-o*d,this.y=n+c*d+o*l-r*u,this.z=s+c*u+r*d-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return $r.copy(this).projectOnVector(t),this.sub($r)}reflect(t){return this.sub($r.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const $r=new I,yc=new qn;class $t{constructor(t,e,n,s,r,a,o,c,l){$t.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){const d=this.elements;return d[0]=t,d[1]=s,d[2]=o,d[3]=e,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],u=n[7],f=n[2],p=n[5],g=n[8],S=s[0],m=s[3],h=s[6],M=s[1],v=s[4],y=s[7],E=s[2],T=s[5],P=s[8];return r[0]=a*S+o*M+c*E,r[3]=a*m+o*v+c*T,r[6]=a*h+o*y+c*P,r[1]=l*S+d*M+u*E,r[4]=l*m+d*v+u*T,r[7]=l*h+d*y+u*P,r[2]=f*S+p*M+g*E,r[5]=f*m+p*v+g*T,r[8]=f*h+p*y+g*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8];return e*a*d-e*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],u=d*a-o*l,f=o*c-d*r,p=l*r-a*c,g=e*u+n*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/g;return t[0]=u*S,t[1]=(s*l-d*n)*S,t[2]=(o*n-s*a)*S,t[3]=f*S,t[4]=(d*e-s*c)*S,t[5]=(s*r-o*e)*S,t[6]=p*S,t[7]=(n*c-l*e)*S,t[8]=(a*e-n*r)*S,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Kr.makeScale(t,e)),this}rotate(t){return this.premultiply(Kr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Kr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Kr=new $t,bc=new $t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),wc=new $t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function tu(){const i={enabled:!0,workingColorSpace:es,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===fe&&(s.r=Wn(s.r),s.g=Wn(s.g),s.b=Wn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===fe&&(s.r=Ki(s.r),s.g=Ki(s.g),s.b=Ki(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ti?Dr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Bs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Bs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[es]:{primaries:t,whitePoint:n,transfer:Dr,toXYZ:bc,fromXYZ:wc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:be},outputColorSpaceConfig:{drawingBufferColorSpace:be}},[be]:{primaries:t,whitePoint:n,transfer:fe,toXYZ:bc,fromXYZ:wc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:be}}}),i}const se=tu();function Wn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Li;class eu{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Li===void 0&&(Li=Ur("canvas")),Li.width=t.width,Li.height=t.height;const s=Li.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Li}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ur("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Wn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Wn(e[n]/255)*255):e[n]=Wn(e[n]);return{data:e,width:t.width,height:t.height}}else return Yt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let nu=0;class Vo{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nu++}),this.uuid=Ei(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Jr(s[a].image)):r.push(Jr(s[a]))}else r=Jr(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Jr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?eu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Yt("Texture: Unable to serialize Texture."),{})}let iu=0;const jr=new I;class We extends as{constructor(t=We.DEFAULT_IMAGE,e=We.DEFAULT_MAPPING,n=Gn,s=Gn,r=ln,a=Mi,o=vn,c=Dn,l=We.DEFAULT_ANISOTROPY,d=ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:iu++}),this.uuid=Ei(),this.name="",this.source=new Vo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new _t(0,0),this.repeat=new _t(1,1),this.center=new _t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(jr).x}get height(){return this.source.getSize(jr).y}get depth(){return this.source.getSize(jr).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Yt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Yt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==$l)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case hn:t.x=t.x-Math.floor(t.x);break;case Gn:t.x=t.x<0?0:1;break;case Wa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case hn:t.y=t.y-Math.floor(t.y);break;case Gn:t.y=t.y<0?0:1;break;case Wa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}We.DEFAULT_IMAGE=null;We.DEFAULT_MAPPING=$l;We.DEFAULT_ANISOTROPY=1;class ve{constructor(t=0,e=0,n=0,s=1){ve.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],d=c[4],u=c[8],f=c[1],p=c[5],g=c[9],S=c[2],m=c[6],h=c[10];if(Math.abs(d-f)<.01&&Math.abs(u-S)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(u+S)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+h-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(l+1)/2,y=(p+1)/2,E=(h+1)/2,T=(d+f)/4,P=(u+S)/4,C=(g+m)/4;return v>y&&v>E?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=T/n,r=P/n):y>E?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=T/s,r=C/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=P/r,s=C/r),this.set(n,s,r,e),this}let M=Math.sqrt((m-g)*(m-g)+(u-S)*(u-S)+(f-d)*(f-d));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-S)/M,this.z=(f-d)/M,this.w=Math.acos((l+p+h-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this.w=te(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this.w=te(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class su extends as{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ln,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new We(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:ln,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Vo(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Mn extends su{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class sh extends We{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=nn,this.minFilter=nn,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ru extends We{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=nn,this.minFilter=nn,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ai{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,un):un.fromBufferAttribute(r,a),un.applyMatrix4(t.matrixWorld),this.expandByPoint(un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),$s.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$s.copy(n.boundingBox)),$s.applyMatrix4(t.matrixWorld),this.union($s)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,un),un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(us),Ks.subVectors(this.max,us),Di.subVectors(t.a,us),Ii.subVectors(t.b,us),Ui.subVectors(t.c,us),Zn.subVectors(Ii,Di),$n.subVectors(Ui,Ii),li.subVectors(Di,Ui);let e=[0,-Zn.z,Zn.y,0,-$n.z,$n.y,0,-li.z,li.y,Zn.z,0,-Zn.x,$n.z,0,-$n.x,li.z,0,-li.x,-Zn.y,Zn.x,0,-$n.y,$n.x,0,-li.y,li.x,0];return!Qr(e,Di,Ii,Ui,Ks)||(e=[1,0,0,0,1,0,0,0,1],!Qr(e,Di,Ii,Ui,Ks))?!1:(Js.crossVectors(Zn,$n),e=[Js.x,Js.y,Js.z],Qr(e,Di,Ii,Ui,Ks))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Un),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Un=[new I,new I,new I,new I,new I,new I,new I,new I],un=new I,$s=new Ai,Di=new I,Ii=new I,Ui=new I,Zn=new I,$n=new I,li=new I,us=new I,Ks=new I,Js=new I,hi=new I;function Qr(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){hi.fromArray(i,r);const o=s.x*Math.abs(hi.x)+s.y*Math.abs(hi.y)+s.z*Math.abs(hi.z),c=t.dot(hi),l=e.dot(hi),d=n.dot(hi);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const au=new Ai,fs=new I,ta=new I;class os{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):au.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;fs.subVectors(t,this.center);const e=fs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(fs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ta.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(fs.copy(t.center).add(ta)),this.expandByPoint(fs.copy(t.center).sub(ta))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Nn=new I,ea=new I,js=new I,Kn=new I,na=new I,Qs=new I,ia=new I;class Go{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Nn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Nn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Nn.copy(this.origin).addScaledVector(this.direction,e),Nn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ea.copy(t).add(e).multiplyScalar(.5),js.copy(e).sub(t).normalize(),Kn.copy(this.origin).sub(ea);const r=t.distanceTo(e)*.5,a=-this.direction.dot(js),o=Kn.dot(this.direction),c=-Kn.dot(js),l=Kn.lengthSq(),d=Math.abs(1-a*a);let u,f,p,g;if(d>0)if(u=a*c-o,f=a*o-c,g=r*d,u>=0)if(f>=-g)if(f<=g){const S=1/d;u*=S,f*=S,p=u*(u+a*f+2*o)+f*(a*u+f+2*c)+l}else f=r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+l):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ea).addScaledVector(js,f),p}intersectSphere(t,e){Nn.subVectors(t.center,this.origin);const n=Nn.dot(this.direction),s=Nn.dot(Nn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),d>=0?(r=(t.min.y-f.y)*d,a=(t.max.y-f.y)*d):(r=(t.max.y-f.y)*d,a=(t.min.y-f.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Nn)!==null}intersectTriangle(t,e,n,s,r){na.subVectors(e,t),Qs.subVectors(n,t),ia.crossVectors(na,Qs);let a=this.direction.dot(ia),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Kn.subVectors(this.origin,t);const c=o*this.direction.dot(Qs.crossVectors(Kn,Qs));if(c<0)return null;const l=o*this.direction.dot(na.cross(Kn));if(l<0||c+l>a)return null;const d=-o*Kn.dot(ia);return d<0?null:this.at(d/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class he{constructor(t,e,n,s,r,a,o,c,l,d,u,f,p,g,S,m){he.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,d,u,f,p,g,S,m)}set(t,e,n,s,r,a,o,c,l,d,u,f,p,g,S,m){const h=this.elements;return h[0]=t,h[4]=e,h[8]=n,h[12]=s,h[1]=r,h[5]=a,h[9]=o,h[13]=c,h[2]=l,h[6]=d,h[10]=u,h[14]=f,h[3]=p,h[7]=g,h[11]=S,h[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new he().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ni.setFromMatrixColumn(t,0).length(),r=1/Ni.setFromMatrixColumn(t,1).length(),a=1/Ni.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*d,p=a*u,g=o*d,S=o*u;e[0]=c*d,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=f-S*l,e[9]=-o*c,e[2]=S-f*l,e[6]=g+p*l,e[10]=a*c}else if(t.order==="YXZ"){const f=c*d,p=c*u,g=l*d,S=l*u;e[0]=f+S*o,e[4]=g*o-p,e[8]=a*l,e[1]=a*u,e[5]=a*d,e[9]=-o,e[2]=p*o-g,e[6]=S+f*o,e[10]=a*c}else if(t.order==="ZXY"){const f=c*d,p=c*u,g=l*d,S=l*u;e[0]=f-S*o,e[4]=-a*u,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*d,e[9]=S-f*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const f=a*d,p=a*u,g=o*d,S=o*u;e[0]=c*d,e[4]=g*l-p,e[8]=f*l+S,e[1]=c*u,e[5]=S*l+f,e[9]=p*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,p=a*l,g=o*c,S=o*l;e[0]=c*d,e[4]=S-f*u,e[8]=g*u+p,e[1]=u,e[5]=a*d,e[9]=-o*d,e[2]=-l*d,e[6]=p*u+g,e[10]=f-S*u}else if(t.order==="XZY"){const f=a*c,p=a*l,g=o*c,S=o*l;e[0]=c*d,e[4]=-u,e[8]=l*d,e[1]=f*u+S,e[5]=a*d,e[9]=p*u-g,e[2]=g*u-p,e[6]=o*d,e[10]=S*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ou,t,cu)}lookAt(t,e,n){const s=this.elements;return je.subVectors(t,e),je.lengthSq()===0&&(je.z=1),je.normalize(),Jn.crossVectors(n,je),Jn.lengthSq()===0&&(Math.abs(n.z)===1?je.x+=1e-4:je.z+=1e-4,je.normalize(),Jn.crossVectors(n,je)),Jn.normalize(),tr.crossVectors(je,Jn),s[0]=Jn.x,s[4]=tr.x,s[8]=je.x,s[1]=Jn.y,s[5]=tr.y,s[9]=je.y,s[2]=Jn.z,s[6]=tr.z,s[10]=je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],u=n[5],f=n[9],p=n[13],g=n[2],S=n[6],m=n[10],h=n[14],M=n[3],v=n[7],y=n[11],E=n[15],T=s[0],P=s[4],C=s[8],b=s[12],_=s[1],A=s[5],D=s[9],F=s[13],k=s[2],V=s[6],H=s[10],tt=s[14],X=s[3],ht=s[7],dt=s[11],Lt=s[15];return r[0]=a*T+o*_+c*k+l*X,r[4]=a*P+o*A+c*V+l*ht,r[8]=a*C+o*D+c*H+l*dt,r[12]=a*b+o*F+c*tt+l*Lt,r[1]=d*T+u*_+f*k+p*X,r[5]=d*P+u*A+f*V+p*ht,r[9]=d*C+u*D+f*H+p*dt,r[13]=d*b+u*F+f*tt+p*Lt,r[2]=g*T+S*_+m*k+h*X,r[6]=g*P+S*A+m*V+h*ht,r[10]=g*C+S*D+m*H+h*dt,r[14]=g*b+S*F+m*tt+h*Lt,r[3]=M*T+v*_+y*k+E*X,r[7]=M*P+v*A+y*V+E*ht,r[11]=M*C+v*D+y*H+E*dt,r[15]=M*b+v*F+y*tt+E*Lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],d=t[2],u=t[6],f=t[10],p=t[14],g=t[3],S=t[7],m=t[11],h=t[15];return g*(+r*c*u-s*l*u-r*o*f+n*l*f+s*o*p-n*c*p)+S*(+e*c*p-e*l*f+r*a*f-s*a*p+s*l*d-r*c*d)+m*(+e*l*u-e*o*p-r*a*u+n*a*p+r*o*d-n*l*d)+h*(-s*o*d-e*c*u+e*o*f+s*a*u-n*a*f+n*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],u=t[9],f=t[10],p=t[11],g=t[12],S=t[13],m=t[14],h=t[15],M=u*m*l-S*f*l+S*c*p-o*m*p-u*c*h+o*f*h,v=g*f*l-d*m*l-g*c*p+a*m*p+d*c*h-a*f*h,y=d*S*l-g*u*l+g*o*p-a*S*p-d*o*h+a*u*h,E=g*u*c-d*S*c-g*o*f+a*S*f+d*o*m-a*u*m,T=e*M+n*v+s*y+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/T;return t[0]=M*P,t[1]=(S*f*r-u*m*r-S*s*p+n*m*p+u*s*h-n*f*h)*P,t[2]=(o*m*r-S*c*r+S*s*l-n*m*l-o*s*h+n*c*h)*P,t[3]=(u*c*r-o*f*r-u*s*l+n*f*l+o*s*p-n*c*p)*P,t[4]=v*P,t[5]=(d*m*r-g*f*r+g*s*p-e*m*p-d*s*h+e*f*h)*P,t[6]=(g*c*r-a*m*r-g*s*l+e*m*l+a*s*h-e*c*h)*P,t[7]=(a*f*r-d*c*r+d*s*l-e*f*l-a*s*p+e*c*p)*P,t[8]=y*P,t[9]=(g*u*r-d*S*r-g*n*p+e*S*p+d*n*h-e*u*h)*P,t[10]=(a*S*r-g*o*r+g*n*l-e*S*l-a*n*h+e*o*h)*P,t[11]=(d*o*r-a*u*r-d*n*l+e*u*l+a*n*p-e*o*p)*P,t[12]=E*P,t[13]=(d*S*s-g*u*s+g*n*f-e*S*f-d*n*m+e*u*m)*P,t[14]=(g*o*s-a*S*s-g*n*c+e*S*c+a*n*m-e*o*m)*P,t[15]=(a*u*s-d*o*s+d*n*c-e*u*c-a*n*f+e*o*f)*P,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,d=a+a,u=o+o,f=r*l,p=r*d,g=r*u,S=a*d,m=a*u,h=o*u,M=c*l,v=c*d,y=c*u,E=n.x,T=n.y,P=n.z;return s[0]=(1-(S+h))*E,s[1]=(p+y)*E,s[2]=(g-v)*E,s[3]=0,s[4]=(p-y)*T,s[5]=(1-(f+h))*T,s[6]=(m+M)*T,s[7]=0,s[8]=(g+v)*P,s[9]=(m-M)*P,s[10]=(1-(f+S))*P,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ni.set(s[0],s[1],s[2]).length();const a=Ni.set(s[4],s[5],s[6]).length(),o=Ni.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],fn.copy(this);const l=1/r,d=1/a,u=1/o;return fn.elements[0]*=l,fn.elements[1]*=l,fn.elements[2]*=l,fn.elements[4]*=d,fn.elements[5]*=d,fn.elements[6]*=d,fn.elements[8]*=u,fn.elements[9]*=u,fn.elements[10]*=u,e.setFromRotationMatrix(fn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Rn,c=!1){const l=this.elements,d=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),p=(n+s)/(n-s);let g,S;if(c)g=r/(a-r),S=a*r/(a-r);else if(o===Rn)g=-(a+r)/(a-r),S=-2*a*r/(a-r);else if(o===Ir)g=-a/(a-r),S=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=S,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Rn,c=!1){const l=this.elements,d=2/(e-t),u=2/(n-s),f=-(e+t)/(e-t),p=-(n+s)/(n-s);let g,S;if(c)g=1/(a-r),S=a/(a-r);else if(o===Rn)g=-2/(a-r),S=-(a+r)/(a-r);else if(o===Ir)g=-1/(a-r),S=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=S,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ni=new I,fn=new he,ou=new I(0,0,0),cu=new I(1,1,1),Jn=new I,tr=new I,je=new I,Tc=new he,Ec=new qn;class bn{constructor(t=0,e=0,n=0,s=bn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],u=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-te(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(te(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-te(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(te(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-te(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,p),this._y=0);break;default:Yt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Tc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Tc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ec.setFromEuler(this),this.setFromQuaternion(Ec,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bn.DEFAULT_ORDER="XYZ";class Ho{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let lu=0;const Ac=new I,Fi=new qn,Fn=new he,er=new I,ps=new I,hu=new I,du=new qn,Cc=new I(1,0,0),Rc=new I(0,1,0),Pc=new I(0,0,1),Lc={type:"added"},uu={type:"removed"},Oi={type:"childadded",child:null},sa={type:"childremoved",child:null};class Le extends as{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lu++}),this.uuid=Ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Le.DEFAULT_UP.clone();const t=new I,e=new bn,n=new qn,s=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new he},normalMatrix:{value:new $t}}),this.matrix=new he,this.matrixWorld=new he,this.matrixAutoUpdate=Le.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Le.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ho,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.multiply(Fi),this}rotateOnWorldAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.premultiply(Fi),this}rotateX(t){return this.rotateOnAxis(Cc,t)}rotateY(t){return this.rotateOnAxis(Rc,t)}rotateZ(t){return this.rotateOnAxis(Pc,t)}translateOnAxis(t,e){return Ac.copy(t).applyQuaternion(this.quaternion),this.position.add(Ac.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Cc,t)}translateY(t){return this.translateOnAxis(Rc,t)}translateZ(t){return this.translateOnAxis(Pc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Fn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?er.copy(t):er.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ps.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fn.lookAt(ps,er,this.up):Fn.lookAt(er,ps,this.up),this.quaternion.setFromRotationMatrix(Fn),s&&(Fn.extractRotation(s.matrixWorld),Fi.setFromRotationMatrix(Fn),this.quaternion.premultiply(Fi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Pe("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Lc),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null):Pe("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(uu),sa.child=t,this.dispatchEvent(sa),sa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Fn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Fn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Fn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Lc),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ps,t,hu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ps,du,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),d=a(t.images),u=a(t.shapes),f=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Le.DEFAULT_UP=new I(0,1,0);Le.DEFAULT_MATRIX_AUTO_UPDATE=!0;Le.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const pn=new I,On=new I,ra=new I,Bn=new I,Bi=new I,zi=new I,Dc=new I,aa=new I,oa=new I,ca=new I,la=new ve,ha=new ve,da=new ve;class _n{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),pn.subVectors(t,e),s.cross(pn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){pn.subVectors(s,e),On.subVectors(n,e),ra.subVectors(t,e);const a=pn.dot(pn),o=pn.dot(On),c=pn.dot(ra),l=On.dot(On),d=On.dot(ra),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(l*c-o*d)*f,g=(a*d-o*c)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Bn)===null?!1:Bn.x>=0&&Bn.y>=0&&Bn.x+Bn.y<=1}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,Bn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Bn.x),c.addScaledVector(a,Bn.y),c.addScaledVector(o,Bn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return la.setScalar(0),ha.setScalar(0),da.setScalar(0),la.fromBufferAttribute(t,e),ha.fromBufferAttribute(t,n),da.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(la,r.x),a.addScaledVector(ha,r.y),a.addScaledVector(da,r.z),a}static isFrontFacing(t,e,n,s){return pn.subVectors(n,e),On.subVectors(t,e),pn.cross(On).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pn.subVectors(this.c,this.b),On.subVectors(this.a,this.b),pn.cross(On).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return _n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return _n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return _n.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return _n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return _n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Bi.subVectors(s,n),zi.subVectors(r,n),aa.subVectors(t,n);const c=Bi.dot(aa),l=zi.dot(aa);if(c<=0&&l<=0)return e.copy(n);oa.subVectors(t,s);const d=Bi.dot(oa),u=zi.dot(oa);if(d>=0&&u<=d)return e.copy(s);const f=c*u-d*l;if(f<=0&&c>=0&&d<=0)return a=c/(c-d),e.copy(n).addScaledVector(Bi,a);ca.subVectors(t,r);const p=Bi.dot(ca),g=zi.dot(ca);if(g>=0&&p<=g)return e.copy(r);const S=p*l-c*g;if(S<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(zi,o);const m=d*g-p*u;if(m<=0&&u-d>=0&&p-g>=0)return Dc.subVectors(r,s),o=(u-d)/(u-d+(p-g)),e.copy(s).addScaledVector(Dc,o);const h=1/(m+S+f);return a=S*h,o=f*h,e.copy(n).addScaledVector(Bi,a).addScaledVector(zi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const rh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},nr={h:0,s:0,l:0};function ua(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Xt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=se.workingColorSpace){return this.r=t,this.g=e,this.b=n,se.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=se.workingColorSpace){if(t=ko(t,1),e=te(e,0,1),n=te(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=ua(a,r,t+1/3),this.g=ua(a,r,t),this.b=ua(a,r,t-1/3)}return se.colorSpaceToWorking(this,s),this}setStyle(t,e=be){function n(r){r!==void 0&&parseFloat(r)<1&&Yt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Yt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Yt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=be){const n=rh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Yt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Wn(t.r),this.g=Wn(t.g),this.b=Wn(t.b),this}copyLinearToSRGB(t){return this.r=Ki(t.r),this.g=Ki(t.g),this.b=Ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=be){return se.workingToColorSpace(ke.copy(this),t),Math.round(te(ke.r*255,0,255))*65536+Math.round(te(ke.g*255,0,255))*256+Math.round(te(ke.b*255,0,255))}getHexString(t=be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.workingToColorSpace(ke.copy(this),e);const n=ke.r,s=ke.g,r=ke.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=d<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=se.workingColorSpace){return se.workingToColorSpace(ke.copy(this),e),t.r=ke.r,t.g=ke.g,t.b=ke.b,t}getStyle(t=be){se.workingToColorSpace(ke.copy(this),t);const e=ke.r,n=ke.g,s=ke.b;return t!==be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(jn),this.setHSL(jn.h+t,jn.s+e,jn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(jn),t.getHSL(nr);const n=Es(jn.h,nr.h,e),s=Es(jn.s,nr.s,e),r=Es(jn.l,nr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ke=new Xt;Xt.NAMES=rh;let fu=0;class Ci extends as{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:fu++}),this.uuid=Ei(),this.name="",this.type="Material",this.blending=Zi,this.side=ai,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ia,this.blendDst=Ua,this.blendEquation=_i,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xt(0,0,0),this.blendAlpha=0,this.depthFunc=ji,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pi,this.stencilZFail=Pi,this.stencilZPass=Pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Yt(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Yt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Zi&&(n.blending=this.blending),this.side!==ai&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ia&&(n.blendSrc=this.blendSrc),this.blendDst!==Ua&&(n.blendDst=this.blendDst),this.blendEquation!==_i&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ji&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class we extends Ci{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=Ro,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ne=new I,ir=new _t;let pu=0;class Sn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:pu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=gc,this.updateRanges=[],this.gpuType=Cn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ir.fromBufferAttribute(this,e),ir.applyMatrix3(t),this.setXY(e,ir.x,ir.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.applyMatrix3(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.applyMatrix4(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.applyNormalMatrix(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ne.fromBufferAttribute(this,e),Ne.transformDirection(t),this.setXYZ(e,Ne.x,Ne.y,Ne.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=qi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=qe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=qi(e,this.array)),e}setX(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=qi(e,this.array)),e}setY(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=qi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=qi(e,this.array)),e}setW(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array),s=qe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array),s=qe(s,this.array),r=qe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==gc&&(t.usage=this.usage),t}}class ah extends Sn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class oh extends Sn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class re extends Sn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let mu=0;const an=new he,fa=new Le,ki=new I,Qe=new Ai,ms=new Ai,Be=new I;class Ie extends as{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:mu++}),this.uuid=Ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ih(t)?oh:ah)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new $t().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return an.makeRotationFromQuaternion(t),this.applyMatrix4(an),this}rotateX(t){return an.makeRotationX(t),this.applyMatrix4(an),this}rotateY(t){return an.makeRotationY(t),this.applyMatrix4(an),this}rotateZ(t){return an.makeRotationZ(t),this.applyMatrix4(an),this}translate(t,e,n){return an.makeTranslation(t,e,n),this.applyMatrix4(an),this}scale(t,e,n){return an.makeScale(t,e,n),this.applyMatrix4(an),this}lookAt(t){return fa.lookAt(t),fa.updateMatrix(),this.applyMatrix4(fa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new re(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Yt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ai);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Pe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Qe.setFromBufferAttribute(r),this.morphTargetsRelative?(Be.addVectors(this.boundingBox.min,Qe.min),this.boundingBox.expandByPoint(Be),Be.addVectors(this.boundingBox.max,Qe.max),this.boundingBox.expandByPoint(Be)):(this.boundingBox.expandByPoint(Qe.min),this.boundingBox.expandByPoint(Qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Pe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new os);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Pe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){const n=this.boundingSphere.center;if(Qe.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];ms.setFromBufferAttribute(o),this.morphTargetsRelative?(Be.addVectors(Qe.min,ms.min),Qe.expandByPoint(Be),Be.addVectors(Qe.max,ms.max),Qe.expandByPoint(Be)):(Qe.expandByPoint(ms.min),Qe.expandByPoint(ms.max))}Qe.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Be.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Be));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)Be.fromBufferAttribute(o,l),c&&(ki.fromBufferAttribute(t,l),Be.add(ki)),s=Math.max(s,n.distanceToSquared(Be))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Pe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Pe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Sn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let C=0;C<n.count;C++)o[C]=new I,c[C]=new I;const l=new I,d=new I,u=new I,f=new _t,p=new _t,g=new _t,S=new I,m=new I;function h(C,b,_){l.fromBufferAttribute(n,C),d.fromBufferAttribute(n,b),u.fromBufferAttribute(n,_),f.fromBufferAttribute(r,C),p.fromBufferAttribute(r,b),g.fromBufferAttribute(r,_),d.sub(l),u.sub(l),p.sub(f),g.sub(f);const A=1/(p.x*g.y-g.x*p.y);isFinite(A)&&(S.copy(d).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(A),m.copy(u).multiplyScalar(p.x).addScaledVector(d,-g.x).multiplyScalar(A),o[C].add(S),o[b].add(S),o[_].add(S),c[C].add(m),c[b].add(m),c[_].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let C=0,b=M.length;C<b;++C){const _=M[C],A=_.start,D=_.count;for(let F=A,k=A+D;F<k;F+=3)h(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const v=new I,y=new I,E=new I,T=new I;function P(C){E.fromBufferAttribute(s,C),T.copy(E);const b=o[C];v.copy(b),v.sub(E.multiplyScalar(E.dot(b))).normalize(),y.crossVectors(T,b);const A=y.dot(c[C])<0?-1:1;a.setXYZW(C,v.x,v.y,v.z,A)}for(let C=0,b=M.length;C<b;++C){const _=M[C],A=_.start,D=_.count;for(let F=A,k=A+D;F<k;F+=3)P(t.getX(F+0)),P(t.getX(F+1)),P(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Sn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new I,r=new I,a=new I,o=new I,c=new I,l=new I,d=new I,u=new I;if(t)for(let f=0,p=t.count;f<p;f+=3){const g=t.getX(f+0),S=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,S),a.fromBufferAttribute(e,m),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,S),l.fromBufferAttribute(n,m),o.add(d),c.add(d),l.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(S,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Be.fromBufferAttribute(t,e),Be.normalize(),t.setXYZ(e,Be.x,Be.y,Be.z)}toNonIndexed(){function t(o,c){const l=o.array,d=o.itemSize,u=o.normalized,f=new l.constructor(c.length*d);let p=0,g=0;for(let S=0,m=c.length;S<m;S++){o.isInterleavedBufferAttribute?p=c[S]*o.data.stride+o.offset:p=c[S]*d;for(let h=0;h<d;h++)f[g++]=l[p++]}return new Sn(f,d,u)}if(this.index===null)return Yt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ie,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,u=l.length;d<u;d++){const f=l[d],p=t(f,n);c.push(p)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,f=l.length;u<f;u++){const p=l[u];d.push(p.toJSON(t.data))}d.length>0&&(s[c]=d,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(e))}const r=t.morphAttributes;for(const l in r){const d=[],u=r[l];for(let f=0,p=u.length;f<p;f++)d.push(u[f].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,d=a.length;l<d;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ic=new he,di=new Go,sr=new os,Uc=new I,rr=new I,ar=new I,or=new I,pa=new I,cr=new I,Nc=new I,lr=new I;class Y extends Le{constructor(t=new Ie,e=new we){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){cr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],u=r[c];d!==0&&(pa.fromBufferAttribute(u,t),a?cr.addScaledVector(pa,d):cr.addScaledVector(pa.sub(e),d))}e.add(cr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),sr.copy(n.boundingSphere),sr.applyMatrix4(r),di.copy(t.ray).recast(t.near),!(sr.containsPoint(di.origin)===!1&&(di.intersectSphere(sr,Uc)===null||di.origin.distanceToSquared(Uc)>(t.far-t.near)**2))&&(Ic.copy(r).invert(),di.copy(t.ray).applyMatrix4(Ic),!(n.boundingBox!==null&&di.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,di)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,S=f.length;g<S;g++){const m=f[g],h=a[m.materialIndex],M=Math.max(m.start,p.start),v=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let y=M,E=v;y<E;y+=3){const T=o.getX(y),P=o.getX(y+1),C=o.getX(y+2);s=hr(this,h,t,n,l,d,u,T,P,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),S=Math.min(o.count,p.start+p.count);for(let m=g,h=S;m<h;m+=3){const M=o.getX(m),v=o.getX(m+1),y=o.getX(m+2);s=hr(this,a,t,n,l,d,u,M,v,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,S=f.length;g<S;g++){const m=f[g],h=a[m.materialIndex],M=Math.max(m.start,p.start),v=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let y=M,E=v;y<E;y+=3){const T=y,P=y+1,C=y+2;s=hr(this,h,t,n,l,d,u,T,P,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),S=Math.min(c.count,p.start+p.count);for(let m=g,h=S;m<h;m+=3){const M=m,v=m+1,y=m+2;s=hr(this,a,t,n,l,d,u,M,v,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function xu(i,t,e,n,s,r,a,o){let c;if(t.side===He?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===ai,o),c===null)return null;lr.copy(o),lr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(lr);return l<e.near||l>e.far?null:{distance:l,point:lr.clone(),object:i}}function hr(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,rr),i.getVertexPosition(c,ar),i.getVertexPosition(l,or);const d=xu(i,t,e,n,rr,ar,or,Nc);if(d){const u=new I;_n.getBarycoord(Nc,rr,ar,or,u),s&&(d.uv=_n.getInterpolatedAttribute(s,o,c,l,u,new _t)),r&&(d.uv1=_n.getInterpolatedAttribute(r,o,c,l,u,new _t)),a&&(d.normal=_n.getInterpolatedAttribute(a,o,c,l,u,new I),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new I,materialIndex:0};_n.getNormal(rr,ar,or,f.normal),d.face=f,d.barycoord=u}return d}class Vt extends Ie{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new re(l,3)),this.setAttribute("normal",new re(d,3)),this.setAttribute("uv",new re(u,2));function g(S,m,h,M,v,y,E,T,P,C,b){const _=y/P,A=E/C,D=y/2,F=E/2,k=T/2,V=P+1,H=C+1;let tt=0,X=0;const ht=new I;for(let dt=0;dt<H;dt++){const Lt=dt*A-F;for(let jt=0;jt<V;jt++){const ie=jt*_-D;ht[S]=ie*M,ht[m]=Lt*v,ht[h]=k,l.push(ht.x,ht.y,ht.z),ht[S]=0,ht[m]=0,ht[h]=T>0?1:-1,d.push(ht.x,ht.y,ht.z),u.push(jt/P),u.push(1-dt/C),tt+=1}}for(let dt=0;dt<C;dt++)for(let Lt=0;Lt<P;Lt++){const jt=f+Lt+V*dt,ie=f+Lt+V*(dt+1),me=f+(Lt+1)+V*(dt+1),xe=f+(Lt+1)+V*dt;c.push(jt,ie,xe),c.push(ie,me,xe),X+=6}o.addGroup(p,X,b),p+=X,f+=tt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vt(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ns(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Yt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ye(i){const t={};for(let e=0;e<i.length;e++){const n=ns(i[e]);for(const s in n)t[s]=n[s]}return t}function gu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function ch(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:se.workingColorSpace}const ks={clone:ns,merge:Ye};var _u=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ge extends Ci{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_u,this.fragmentShader=vu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ns(t.uniforms),this.uniformsGroups=gu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class lh extends Le{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new he,this.projectionMatrix=new he,this.projectionMatrixInverse=new he,this.coordinateSystem=Rn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Qn=new I,Fc=new _t,Oc=new _t;class tn extends lh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=zs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ts*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return zs*2*Math.atan(Math.tan(Ts*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Qn.x,Qn.y).multiplyScalar(-t/Qn.z),Qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Qn.x,Qn.y).multiplyScalar(-t/Qn.z)}getViewSize(t,e){return this.getViewBounds(t,Fc,Oc),e.subVectors(Oc,Fc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ts*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Vi=-90,Gi=1;class Mu extends Le{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new tn(Vi,Gi,t,e);s.layers=this.layers,this.add(s);const r=new tn(Vi,Gi,t,e);r.layers=this.layers,this.add(r);const a=new tn(Vi,Gi,t,e);a.layers=this.layers,this.add(a);const o=new tn(Vi,Gi,t,e);o.layers=this.layers,this.add(o);const c=new tn(Vi,Gi,t,e);c.layers=this.layers,this.add(c);const l=new tn(Vi,Gi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===Rn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ir)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=S,t.setRenderTarget(n,5,s),t.render(e,d),t.setRenderTarget(u,f,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class hh extends We{constructor(t=[],e=Qi,n,s,r,a,o,c,l,d){super(t,e,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Su extends Mn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new hh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Vt(5,5,5),r=new Ge({name:"CubemapFromEquirect",uniforms:ns(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:He,blending:Pn});r.uniforms.tEquirect.value=e;const a=new Y(s,r),o=e.minFilter;return e.minFilter===Mi&&(e.minFilter=ln),new Mu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class oe extends Le{constructor(){super(),this.isGroup=!0,this.type="Group"}}const yu={type:"move"};class ma{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new oe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new oe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new oe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const S of t.hand.values()){const m=e.getJointPose(S,n),h=this._getHandJoint(l,S);m!==null&&(h.matrix.fromArray(m.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=m.radius),h.visible=m!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=d.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&f>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(yu)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new oe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Wo{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Xt(t),this.near=e,this.far=n}clone(){return new Wo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class dh extends Le{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bn,this.environmentIntensity=1,this.environmentRotation=new bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class uh extends We{constructor(t=null,e=1,n=1,s,r,a,o,c,l=nn,d=nn,u,f){super(null,a,o,c,l,d,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Bc extends Sn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Hi=new he,zc=new he,dr=[],kc=new Ai,bu=new he,xs=new Y,gs=new os;class cn extends Y{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Bc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,bu)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ai),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Hi),kc.copy(t.boundingBox).applyMatrix4(Hi),this.boundingBox.union(kc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new os),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Hi),gs.copy(t.boundingSphere).applyMatrix4(Hi),this.boundingSphere.union(gs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(xs.geometry=this.geometry,xs.material=this.material,xs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),gs.copy(this.boundingSphere),gs.applyMatrix4(n),t.ray.intersectsSphere(gs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Hi),zc.multiplyMatrices(n,Hi),xs.matrixWorld=zc,xs.raycast(t,dr);for(let a=0,o=dr.length;a<o;a++){const c=dr[a];c.instanceId=r,c.object=this,e.push(c)}dr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Bc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new uh(new Float32Array(s*this.count),s,this.count,Uo,Cn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*t;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const xa=new I,wu=new I,Tu=new $t;class xi{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=xa.subVectors(n,e).cross(wu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(xa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Tu.getNormalMatrix(t),s=this.coplanarPoint(xa).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ui=new os,Eu=new _t(.5,.5),ur=new I;class Xo{constructor(t=new xi,e=new xi,n=new xi,s=new xi,r=new xi,a=new xi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Rn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],u=r[5],f=r[6],p=r[7],g=r[8],S=r[9],m=r[10],h=r[11],M=r[12],v=r[13],y=r[14],E=r[15];if(s[0].setComponents(l-a,p-d,h-g,E-M).normalize(),s[1].setComponents(l+a,p+d,h+g,E+M).normalize(),s[2].setComponents(l+o,p+u,h+S,E+v).normalize(),s[3].setComponents(l-o,p-u,h-S,E-v).normalize(),n)s[4].setComponents(c,f,m,y).normalize(),s[5].setComponents(l-c,p-f,h-m,E-y).normalize();else if(s[4].setComponents(l-c,p-f,h-m,E-y).normalize(),e===Rn)s[5].setComponents(l+c,p+f,h+m,E+y).normalize();else if(e===Ir)s[5].setComponents(c,f,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ui.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ui.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ui)}intersectsSprite(t){ui.center.set(0,0,0);const e=Eu.distanceTo(t.center);return ui.radius=.7071067811865476+e,ui.applyMatrix4(t.matrixWorld),this.intersectsSphere(ui)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(ur.x=s.normal.x>0?t.max.x:t.min.x,ur.y=s.normal.y>0?t.max.y:t.min.y,ur.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ur)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Mo extends Ci{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Nr=new I,Fr=new I,Vc=new he,_s=new Go,fr=new os,ga=new I,Gc=new I;class Hc extends Le{constructor(t=new Ie,e=new Mo){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Nr.fromBufferAttribute(e,s-1),Fr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Nr.distanceTo(Fr);t.setAttribute("lineDistance",new re(n,1))}else Yt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fr.copy(n.boundingSphere),fr.applyMatrix4(s),fr.radius+=r,t.ray.intersectsSphere(fr)===!1)return;Vc.copy(s).invert(),_s.copy(t.ray).applyMatrix4(Vc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,f=n.attributes.position;if(d!==null){const p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let S=p,m=g-1;S<m;S+=l){const h=d.getX(S),M=d.getX(S+1),v=pr(this,t,_s,c,h,M,S);v&&e.push(v)}if(this.isLineLoop){const S=d.getX(g-1),m=d.getX(p),h=pr(this,t,_s,c,S,m,g-1);h&&e.push(h)}}else{const p=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let S=p,m=g-1;S<m;S+=l){const h=pr(this,t,_s,c,S,S+1,S);h&&e.push(h)}if(this.isLineLoop){const S=pr(this,t,_s,c,g-1,p,g-1);S&&e.push(S)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function pr(i,t,e,n,s,r,a){const o=i.geometry.attributes.position;if(Nr.fromBufferAttribute(o,s),Fr.fromBufferAttribute(o,r),e.distanceSqToSegment(Nr,Fr,ga,Gc)>n)return;ga.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(ga);if(!(l<t.near||l>t.far))return{distance:l,point:Gc.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class Tn extends We{constructor(t,e,n,s,r,a,o,c,l){super(t,e,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class fh extends We{constructor(t,e,n=bi,s,r,a,o=nn,c=nn,l,d=Fs,u=1){if(d!==Fs&&d!==Os)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:u};super(f,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Vo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ph extends We{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class wn extends Ie{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],c=[],l=new I,d=new _t;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const p=n+u/e*s;l.x=t*Math.cos(p),l.y=t*Math.sin(p),a.push(l.x,l.y,l.z),o.push(0,0,1),d.x=(a[f]/t+1)/2,d.y=(a[f+1]/t+1)/2,c.push(d.x,d.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new re(a,3)),this.setAttribute("normal",new re(o,3)),this.setAttribute("uv",new re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wn(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class pe extends Ie{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],f=[],p=[];let g=0;const S=[],m=n/2;let h=0;M(),a===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new re(u,3)),this.setAttribute("normal",new re(f,3)),this.setAttribute("uv",new re(p,2));function M(){const y=new I,E=new I;let T=0;const P=(e-t)/n;for(let C=0;C<=r;C++){const b=[],_=C/r,A=_*(e-t)+t;for(let D=0;D<=s;D++){const F=D/s,k=F*c+o,V=Math.sin(k),H=Math.cos(k);E.x=A*V,E.y=-_*n+m,E.z=A*H,u.push(E.x,E.y,E.z),y.set(V,P,H).normalize(),f.push(y.x,y.y,y.z),p.push(F,1-_),b.push(g++)}S.push(b)}for(let C=0;C<s;C++)for(let b=0;b<r;b++){const _=S[b][C],A=S[b+1][C],D=S[b+1][C+1],F=S[b][C+1];(t>0||b!==0)&&(d.push(_,A,F),T+=3),(e>0||b!==r-1)&&(d.push(A,D,F),T+=3)}l.addGroup(h,T,0),h+=T}function v(y){const E=g,T=new _t,P=new I;let C=0;const b=y===!0?t:e,_=y===!0?1:-1;for(let D=1;D<=s;D++)u.push(0,m*_,0),f.push(0,_,0),p.push(.5,.5),g++;const A=g;for(let D=0;D<=s;D++){const k=D/s*c+o,V=Math.cos(k),H=Math.sin(k);P.x=b*H,P.y=m*_,P.z=b*V,u.push(P.x,P.y,P.z),f.push(0,_,0),T.x=V*.5+.5,T.y=H*.5*_+.5,p.push(T.x,T.y),g++}for(let D=0;D<s;D++){const F=E+D,k=A+D;y===!0?d.push(k,k+1,F):d.push(k+1,k,F),C+=3}l.addGroup(h,C,y===!0?1:2),h+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pe(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ri extends pe{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new ri(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class kr extends Ie{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),l(n),d(),this.setAttribute("position",new re(r,3)),this.setAttribute("normal",new re(r.slice(),3)),this.setAttribute("uv",new re(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(M){const v=new I,y=new I,E=new I;for(let T=0;T<e.length;T+=3)p(e[T+0],v),p(e[T+1],y),p(e[T+2],E),c(v,y,E,M)}function c(M,v,y,E){const T=E+1,P=[];for(let C=0;C<=T;C++){P[C]=[];const b=M.clone().lerp(y,C/T),_=v.clone().lerp(y,C/T),A=T-C;for(let D=0;D<=A;D++)D===0&&C===T?P[C][D]=b:P[C][D]=b.clone().lerp(_,D/A)}for(let C=0;C<T;C++)for(let b=0;b<2*(T-C)-1;b++){const _=Math.floor(b/2);b%2===0?(f(P[C][_+1]),f(P[C+1][_]),f(P[C][_])):(f(P[C][_+1]),f(P[C+1][_+1]),f(P[C+1][_]))}}function l(M){const v=new I;for(let y=0;y<r.length;y+=3)v.x=r[y+0],v.y=r[y+1],v.z=r[y+2],v.normalize().multiplyScalar(M),r[y+0]=v.x,r[y+1]=v.y,r[y+2]=v.z}function d(){const M=new I;for(let v=0;v<r.length;v+=3){M.x=r[v+0],M.y=r[v+1],M.z=r[v+2];const y=m(M)/2/Math.PI+.5,E=h(M)/Math.PI+.5;a.push(y,1-E)}g(),u()}function u(){for(let M=0;M<a.length;M+=6){const v=a[M+0],y=a[M+2],E=a[M+4],T=Math.max(v,y,E),P=Math.min(v,y,E);T>.9&&P<.1&&(v<.2&&(a[M+0]+=1),y<.2&&(a[M+2]+=1),E<.2&&(a[M+4]+=1))}}function f(M){r.push(M.x,M.y,M.z)}function p(M,v){const y=M*3;v.x=t[y+0],v.y=t[y+1],v.z=t[y+2]}function g(){const M=new I,v=new I,y=new I,E=new I,T=new _t,P=new _t,C=new _t;for(let b=0,_=0;b<r.length;b+=9,_+=6){M.set(r[b+0],r[b+1],r[b+2]),v.set(r[b+3],r[b+4],r[b+5]),y.set(r[b+6],r[b+7],r[b+8]),T.set(a[_+0],a[_+1]),P.set(a[_+2],a[_+3]),C.set(a[_+4],a[_+5]),E.copy(M).add(v).add(y).divideScalar(3);const A=m(E);S(T,_+0,M,A),S(P,_+2,v,A),S(C,_+4,y,A)}}function S(M,v,y,E){E<0&&M.x===1&&(a[v]=M.x-1),y.x===0&&y.z===0&&(a[v]=E/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function h(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kr(t.vertices,t.indices,t.radius,t.details)}}class qo extends kr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new qo(t.radius,t.detail)}}class In{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Yt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const d=n[s],f=n[s+1]-d,p=(a-d)/f;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new _t:new I);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new I,s=[],r=[],a=[],o=new I,c=new he;for(let p=0;p<=t;p++){const g=p/t;s[p]=this.getTangentAt(g,new I)}r[0]=new I,a[0]=new I;let l=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(te(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(te(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Yo extends In{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new _t){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,p=l-this.aY;c=f*d-p*u+this.aX,l=f*u+p*d+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Au extends Yo{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Zo(){let i=0,t=0,e=0,n=0;function s(r,a,o,c){i=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,d,u){let f=(a-r)/l-(o-r)/(l+d)+(o-a)/d,p=(o-a)/d-(c-a)/(d+u)+(c-o)/u;f*=d,p*=d,s(a,o,f,p)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const mr=new I,_a=new Zo,va=new Zo,Ma=new Zo;class Cu extends In{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new I){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,d;this.closed||o>0?l=s[(o-1)%r]:(mr.subVectors(s[0],s[1]).add(s[0]),l=mr);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(mr.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=mr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),p),S=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(d),p);S<1e-4&&(S=1),g<1e-4&&(g=S),m<1e-4&&(m=S),_a.initNonuniformCatmullRom(l.x,u.x,f.x,d.x,g,S,m),va.initNonuniformCatmullRom(l.y,u.y,f.y,d.y,g,S,m),Ma.initNonuniformCatmullRom(l.z,u.z,f.z,d.z,g,S,m)}else this.curveType==="catmullrom"&&(_a.initCatmullRom(l.x,u.x,f.x,d.x,this.tension),va.initCatmullRom(l.y,u.y,f.y,d.y,this.tension),Ma.initCatmullRom(l.z,u.z,f.z,d.z,this.tension));return n.set(_a.calc(c),va.calc(c),Ma.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new I().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Wc(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,c=i*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*i+e}function Ru(i,t){const e=1-i;return e*e*t}function Pu(i,t){return 2*(1-i)*i*t}function Lu(i,t){return i*i*t}function As(i,t,e,n){return Ru(i,t)+Pu(i,e)+Lu(i,n)}function Du(i,t){const e=1-i;return e*e*e*t}function Iu(i,t){const e=1-i;return 3*e*e*i*t}function Uu(i,t){return 3*(1-i)*i*i*t}function Nu(i,t){return i*i*i*t}function Cs(i,t,e,n,s){return Du(i,t)+Iu(i,e)+Uu(i,n)+Nu(i,s)}class mh extends In{constructor(t=new _t,e=new _t,n=new _t,s=new _t){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new _t){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Cs(t,s.x,r.x,a.x,o.x),Cs(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Fu extends In{constructor(t=new I,e=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Cs(t,s.x,r.x,a.x,o.x),Cs(t,s.y,r.y,a.y,o.y),Cs(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class xh extends In{constructor(t=new _t,e=new _t){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new _t){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new _t){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ou extends In{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class gh extends In{constructor(t=new _t,e=new _t,n=new _t){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new _t){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(As(t,s.x,r.x,a.x),As(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Bu extends In{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(As(t,s.x,r.x,a.x),As(t,s.y,r.y,a.y),As(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class _h extends In{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new _t){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Wc(o,c.x,l.x,d.x,u.x),Wc(o,c.y,l.y,d.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new _t().fromArray(s))}return this}}var Xc=Object.freeze({__proto__:null,ArcCurve:Au,CatmullRomCurve3:Cu,CubicBezierCurve:mh,CubicBezierCurve3:Fu,EllipseCurve:Yo,LineCurve:xh,LineCurve3:Ou,QuadraticBezierCurve:gh,QuadraticBezierCurve3:Bu,SplineCurve:_h});class zu extends In{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Xc[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const d=c[l];n&&n.equals(d)||(e.push(d),n=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Xc[s.type]().fromJSON(s))}return this}}class qc extends zu{constructor(t){super(),this.type="Path",this.currentPoint=new _t,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new xh(this.currentPoint.clone(),new _t(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new gh(this.currentPoint.clone(),new _t(t,e),new _t(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new mh(this.currentPoint.clone(),new _t(t,e),new _t(n,s),new _t(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new _h(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+l,e+d,n,s,r,a,o,c),this}absellipse(t,e,n,s,r,a,o,c){const l=new Yo(t,e,n,s,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class vh extends qc{constructor(t){super(t),this.uuid=Ei(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new qc().fromJSON(s))}return this}}function ku(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Mh(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=Xu(i,t,r,e)),i.length>80*e){o=i[0],c=i[1];let d=o,u=c;for(let f=e;f<s;f+=e){const p=i[f],g=i[f+1];p<o&&(o=p),g<c&&(c=g),p>d&&(d=p),g>u&&(u=g)}l=Math.max(d-o,u-c),l=l!==0?32767/l:0}return Vs(r,a,e,o,c,l,0),a}function Mh(i,t,e,n,s){let r;if(s===nf(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Yc(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Yc(a/n|0,i[a],i[a+1],r);return r&&is(r,r.next)&&(Hs(r),r=r.next),r}function wi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(is(e,e.next)||Ae(e.prev,e,e.next)===0)){if(Hs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Vs(i,t,e,n,s,r,a){if(!i)return;!a&&r&&Ku(i,n,s,r);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?Gu(i,n,s,r):Vu(i)){t.push(c.i,i.i,l.i),Hs(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=Hu(wi(i),t),Vs(i,t,e,n,s,r,2)):a===2&&Wu(i,t,e,n,s,r):Vs(wi(i),t,e,n,s,r,1);break}}}function Vu(i){const t=i.prev,e=i,n=i.next;if(Ae(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,c=e.y,l=n.y,d=Math.min(s,r,a),u=Math.min(o,c,l),f=Math.max(s,r,a),p=Math.max(o,c,l);let g=n.next;for(;g!==t;){if(g.x>=d&&g.x<=f&&g.y>=u&&g.y<=p&&ys(s,o,r,c,a,l,g.x,g.y)&&Ae(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Gu(i,t,e,n){const s=i.prev,r=i,a=i.next;if(Ae(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,d=s.y,u=r.y,f=a.y,p=Math.min(o,c,l),g=Math.min(d,u,f),S=Math.max(o,c,l),m=Math.max(d,u,f),h=So(p,g,t,e,n),M=So(S,m,t,e,n);let v=i.prevZ,y=i.nextZ;for(;v&&v.z>=h&&y&&y.z<=M;){if(v.x>=p&&v.x<=S&&v.y>=g&&v.y<=m&&v!==s&&v!==a&&ys(o,d,c,u,l,f,v.x,v.y)&&Ae(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=p&&y.x<=S&&y.y>=g&&y.y<=m&&y!==s&&y!==a&&ys(o,d,c,u,l,f,y.x,y.y)&&Ae(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=h;){if(v.x>=p&&v.x<=S&&v.y>=g&&v.y<=m&&v!==s&&v!==a&&ys(o,d,c,u,l,f,v.x,v.y)&&Ae(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=M;){if(y.x>=p&&y.x<=S&&y.y>=g&&y.y<=m&&y!==s&&y!==a&&ys(o,d,c,u,l,f,y.x,y.y)&&Ae(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Hu(i,t){let e=i;do{const n=e.prev,s=e.next.next;!is(n,s)&&yh(n,e,e.next,s)&&Gs(n,s)&&Gs(s,n)&&(t.push(n.i,e.i,s.i),Hs(e),Hs(e.next),e=i=s),e=e.next}while(e!==i);return wi(e)}function Wu(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Qu(a,o)){let c=bh(a,o);a=wi(a,a.next),c=wi(c,c.next),Vs(a,t,e,n,s,r,0),Vs(c,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Xu(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,c=r<a-1?t[r+1]*n:i.length,l=Mh(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(ju(l))}s.sort(qu);for(let r=0;r<s.length;r++)e=Yu(s[r],e);return e}function qu(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Yu(i,t){const e=Zu(i,t);if(!e)return t;const n=bh(e,i);return wi(n,n.next),wi(e,e.next)}function Zu(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(is(i,e))return e;do{if(is(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,a=e.x<e.next.x?e:e.next,u===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,c=a.x,l=a.y;let d=1/0;e=a;do{if(n>=e.x&&e.x>=c&&n!==e.x&&Sh(s<l?n:r,s,c,l,s<l?r:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);Gs(e,i)&&(u<d||u===d&&(e.x>a.x||e.x===a.x&&$u(a,e)))&&(a=e,d=u)}e=e.next}while(e!==o);return a}function $u(i,t){return Ae(i.prev,i,t.prev)<0&&Ae(t.next,i,i.next)<0}function Ku(i,t,e,n){let s=i;do s.z===0&&(s.z=So(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Ju(s)}function Ju(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function So(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function ju(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Sh(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function ys(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Sh(i,t,e,n,s,r,a,o)}function Qu(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!tf(i,t)&&(Gs(i,t)&&Gs(t,i)&&ef(i,t)&&(Ae(i.prev,i,t.prev)||Ae(i,t.prev,t))||is(i,t)&&Ae(i.prev,i,i.next)>0&&Ae(t.prev,t,t.next)>0)}function Ae(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function is(i,t){return i.x===t.x&&i.y===t.y}function yh(i,t,e,n){const s=gr(Ae(i,t,e)),r=gr(Ae(i,t,n)),a=gr(Ae(e,n,i)),o=gr(Ae(e,n,t));return!!(s!==r&&a!==o||s===0&&xr(i,e,t)||r===0&&xr(i,n,t)||a===0&&xr(e,i,n)||o===0&&xr(e,t,n))}function xr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function gr(i){return i>0?1:i<0?-1:0}function tf(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&yh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Gs(i,t){return Ae(i.prev,i,i.next)<0?Ae(i,t,i.next)>=0&&Ae(i,i.prev,t)>=0:Ae(i,t,i.prev)<0||Ae(i,i.next,t)<0}function ef(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function bh(i,t){const e=yo(i.i,i.x,i.y),n=yo(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Yc(i,t,e,n){const s=yo(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Hs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function yo(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function nf(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class sf{static triangulate(t,e,n=2){return ku(t,e,n)}}class Rs{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Rs.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Zc(t),$c(n,t);let a=t.length;e.forEach(Zc);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,$c(n,e[c]);const o=sf.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function Zc(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function $c(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class $o extends kr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new $o(t.radius,t.detail)}}class De extends Ie{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,u=t/o,f=e/c,p=[],g=[],S=[],m=[];for(let h=0;h<d;h++){const M=h*f-a;for(let v=0;v<l;v++){const y=v*u-r;g.push(y,-M,0),S.push(0,0,1),m.push(v/o),m.push(1-h/c)}}for(let h=0;h<c;h++)for(let M=0;M<o;M++){const v=M+l*h,y=M+l*(h+1),E=M+1+l*(h+1),T=M+1+l*h;p.push(v,y,T),p.push(y,E,T)}this.setIndex(p),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(S,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new De(t.width,t.height,t.widthSegments,t.heightSegments)}}class Ko extends Ie{constructor(t=new vh([new _t(0,.5),new _t(-.5,-.5),new _t(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let d=0;d<t.length;d++)l(t[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new re(s,3)),this.setAttribute("normal",new re(r,3)),this.setAttribute("uv",new re(a,2));function l(d){const u=s.length/3,f=d.extractPoints(e);let p=f.shape;const g=f.holes;Rs.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,h=g.length;m<h;m++){const M=g[m];Rs.isClockWise(M)===!0&&(g[m]=M.reverse())}const S=Rs.triangulateShape(p,g);for(let m=0,h=g.length;m<h;m++){const M=g[m];p=p.concat(M)}for(let m=0,h=p.length;m<h;m++){const M=p[m];s.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let m=0,h=S.length;m<h;m++){const M=S[m],v=M[0]+u,y=M[1]+u,E=M[2]+u;n.push(v,y,E),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return rf(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new Ko(n,t.curveSegments)}}function rf(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class en extends Ie{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const d=[],u=new I,f=new I,p=[],g=[],S=[],m=[];for(let h=0;h<=n;h++){const M=[],v=h/n;let y=0;h===0&&a===0?y=.5/e:h===n&&c===Math.PI&&(y=-.5/e);for(let E=0;E<=e;E++){const T=E/e;u.x=-t*Math.cos(s+T*r)*Math.sin(a+v*o),u.y=t*Math.cos(a+v*o),u.z=t*Math.sin(s+T*r)*Math.sin(a+v*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),S.push(f.x,f.y,f.z),m.push(T+y,1-v),M.push(l++)}d.push(M)}for(let h=0;h<n;h++)for(let M=0;M<e;M++){const v=d[h][M+1],y=d[h][M],E=d[h+1][M],T=d[h+1][M+1];(h!==0||a>0)&&p.push(v,y,T),(h!==n-1||c<Math.PI)&&p.push(y,E,T)}this.setIndex(p),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(S,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new en(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ws extends Ie{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],d=new I,u=new I,f=new I;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){const S=g/s*r,m=p/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(S),u.y=(t+e*Math.cos(m))*Math.sin(S),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),d.x=t*Math.cos(S),d.y=t*Math.sin(S),f.subVectors(u,d).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){const S=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,h=(s+1)*(p-1)+g,M=(s+1)*p+g;a.push(S,m,M),a.push(m,h,M)}this.setIndex(a),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ws(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class af extends Ge{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class J extends Ci{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zo,this.normalScale=new _t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class of extends Ci{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zo,this.normalScale=new _t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=Ro,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class cf extends Ci{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ed,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class lf extends Ci{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Jo extends Le{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Xt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class hf extends Jo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Le.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Sa=new he,Kc=new I,Jc=new I;class wh{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _t(512,512),this.mapType=Dn,this.map=null,this.mapPass=null,this.matrix=new he,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xo,this._frameExtents=new _t(1,1),this._viewportCount=1,this._viewports=[new ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Kc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Kc),Jc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Jc),e.updateMatrixWorld(),Sa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Sa,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Sa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const jc=new he,vs=new I,ya=new I;class df extends wh{constructor(){super(new tn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new _t(4,2),this._viewportCount=6,this._viewports=[new ve(2,1,1,1),new ve(0,1,1,1),new ve(3,1,1,1),new ve(1,1,1,1),new ve(3,0,1,1),new ve(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),vs.setFromMatrixPosition(t.matrixWorld),n.position.copy(vs),ya.copy(n.position),ya.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ya),n.updateMatrixWorld(),s.makeTranslation(-vs.x,-vs.y,-vs.z),jc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(jc,n.coordinateSystem,n.reversedDepth)}}class Th extends Jo{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new df}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class jo extends lh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class uf extends wh{constructor(){super(new jo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Qc extends Jo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Le.DEFAULT_UP),this.updateMatrix(),this.target=new Le,this.shadow=new uf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class ff extends tn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Eh{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const tl=new he;class pf{constructor(t,e,n=0,s=1/0){this.ray=new Go(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Ho,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Pe("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return tl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(tl),this}intersectObject(t,e=!0,n=[]){return bo(t,this,n,e),n.sort(el),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)bo(t[s],this,n,e);return n.sort(el),n}}function el(i,t){return i.distance-t.distance}function bo(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)bo(r[a],t,e,!0)}}function nl(i,t,e,n){const s=mf(n);switch(e){case th:return i*t;case Uo:return i*t/s.components*s.byteLength;case No:return i*t/s.components*s.byteLength;case Fo:return i*t*2/s.components*s.byteLength;case Oo:return i*t*2/s.components*s.byteLength;case eh:return i*t*3/s.components*s.byteLength;case vn:return i*t*4/s.components*s.byteLength;case Bo:return i*t*4/s.components*s.byteLength;case br:case wr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Tr:case Er:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case qa:case Za:return Math.max(i,16)*Math.max(t,8)/4;case Xa:case Ya:return Math.max(i,8)*Math.max(t,8)/2;case $a:case Ka:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ja:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ja:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Qa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case to:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case eo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case no:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case io:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case so:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case ro:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ao:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case oo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case co:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case lo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case ho:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case uo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case fo:case po:case mo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case xo:case go:return Math.ceil(i/4)*Math.ceil(t/4)*8;case _o:case vo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function mf(i){switch(i){case Dn:case Kl:return{byteLength:1,components:1};case Us:case Jl:case Ln:return{byteLength:2,components:1};case Do:case Io:return{byteLength:2,components:4};case bi:case Lo:case Cn:return{byteLength:4,components:1};case jl:case Ql:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Co}}));typeof window<"u"&&(window.__THREE__?Yt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Co);function Ah(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function xf(i){const t=new WeakMap;function e(o,c){const l=o.array,d=o.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,d),o.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const d=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,d);else{u.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<u.length;p++){const g=u[f],S=u[p];S.start<=g.start+g.count+1?g.count=Math.max(g.count,S.start+S.count-g.start):(++f,u[f]=S)}u.length=f+1;for(let p=0,g=u.length;p<g;p++){const S=u[p];i.bufferSubData(l,S.start*d.BYTES_PER_ELEMENT,d,S.start,S.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=t.get(o);(!d||d.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var gf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_f=`#ifdef USE_ALPHAHASH
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
#endif`,vf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Mf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,bf=`#ifdef USE_AOMAP
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
#endif`,wf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Tf=`#ifdef USE_BATCHING
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
#endif`,Ef=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Af=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Cf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Rf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Pf=`#ifdef USE_IRIDESCENCE
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
#endif`,Lf=`#ifdef USE_BUMPMAP
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
#endif`,Df=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,If=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Uf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Nf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ff=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Of=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Bf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,zf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,kf=`#define PI 3.141592653589793
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
} // validated`,Vf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Gf=`vec3 transformedNormal = objectNormal;
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
#endif`,Hf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Xf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Yf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,$f=`#ifdef USE_ENVMAP
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
#endif`,Kf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Jf=`#ifdef USE_ENVMAP
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
#endif`,jf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qf=`#ifdef USE_ENVMAP
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
#endif`,tp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ep=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,np=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ip=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sp=`#ifdef USE_GRADIENTMAP
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
}`,rp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ap=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,op=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,cp=`uniform bool receiveShadow;
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
#endif`,lp=`#ifdef USE_ENVMAP
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
#endif`,hp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,dp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,up=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,pp=`PhysicalMaterial material;
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
#endif`,mp=`uniform sampler2D dfgLUT;
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
}`,xp=`
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
#endif`,gp=`#if defined( RE_IndirectDiffuse )
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
#endif`,_p=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,vp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Mp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,bp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Tp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Ep=`#if defined( USE_POINTS_UV )
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
#endif`,Ap=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Rp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Pp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Lp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dp=`#ifdef USE_MORPHTARGETS
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
#endif`,Ip=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Up=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Np=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Fp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Op=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,zp=`#ifdef USE_NORMALMAP
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
#endif`,kp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Gp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Hp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Wp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Xp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,qp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Yp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Zp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,$p=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Kp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,jp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Qp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,t0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,e0=`float getShadowMask() {
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
}`,n0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,i0=`#ifdef USE_SKINNING
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
#endif`,s0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,r0=`#ifdef USE_SKINNING
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
#endif`,a0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,o0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,c0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,l0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,h0=`#ifdef USE_TRANSMISSION
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
#endif`,d0=`#ifdef USE_TRANSMISSION
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
#endif`,u0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,f0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,p0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,m0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const x0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,g0=`uniform sampler2D t2D;
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
}`,_0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,v0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,M0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,S0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,y0=`#include <common>
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
}`,b0=`#if DEPTH_PACKING == 3200
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
}`,w0=`#define DISTANCE
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
}`,T0=`#define DISTANCE
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
}`,E0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,A0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,C0=`uniform float scale;
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
}`,R0=`uniform vec3 diffuse;
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
}`,P0=`#include <common>
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
}`,L0=`uniform vec3 diffuse;
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
}`,D0=`#define LAMBERT
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
}`,I0=`#define LAMBERT
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
}`,U0=`#define MATCAP
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
}`,N0=`#define MATCAP
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
}`,F0=`#define NORMAL
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
}`,O0=`#define NORMAL
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
}`,B0=`#define PHONG
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
}`,z0=`#define PHONG
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
}`,k0=`#define STANDARD
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
}`,V0=`#define STANDARD
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
}`,G0=`#define TOON
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
}`,H0=`#define TOON
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
}`,W0=`uniform float size;
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
}`,X0=`uniform vec3 diffuse;
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
}`,q0=`#include <common>
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
}`,Y0=`uniform vec3 color;
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
}`,Z0=`uniform float rotation;
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
}`,$0=`uniform vec3 diffuse;
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
}`,Kt={alphahash_fragment:gf,alphahash_pars_fragment:_f,alphamap_fragment:vf,alphamap_pars_fragment:Mf,alphatest_fragment:Sf,alphatest_pars_fragment:yf,aomap_fragment:bf,aomap_pars_fragment:wf,batching_pars_vertex:Tf,batching_vertex:Ef,begin_vertex:Af,beginnormal_vertex:Cf,bsdfs:Rf,iridescence_fragment:Pf,bumpmap_pars_fragment:Lf,clipping_planes_fragment:Df,clipping_planes_pars_fragment:If,clipping_planes_pars_vertex:Uf,clipping_planes_vertex:Nf,color_fragment:Ff,color_pars_fragment:Of,color_pars_vertex:Bf,color_vertex:zf,common:kf,cube_uv_reflection_fragment:Vf,defaultnormal_vertex:Gf,displacementmap_pars_vertex:Hf,displacementmap_vertex:Wf,emissivemap_fragment:Xf,emissivemap_pars_fragment:qf,colorspace_fragment:Yf,colorspace_pars_fragment:Zf,envmap_fragment:$f,envmap_common_pars_fragment:Kf,envmap_pars_fragment:Jf,envmap_pars_vertex:jf,envmap_physical_pars_fragment:lp,envmap_vertex:Qf,fog_vertex:tp,fog_pars_vertex:ep,fog_fragment:np,fog_pars_fragment:ip,gradientmap_pars_fragment:sp,lightmap_pars_fragment:rp,lights_lambert_fragment:ap,lights_lambert_pars_fragment:op,lights_pars_begin:cp,lights_toon_fragment:hp,lights_toon_pars_fragment:dp,lights_phong_fragment:up,lights_phong_pars_fragment:fp,lights_physical_fragment:pp,lights_physical_pars_fragment:mp,lights_fragment_begin:xp,lights_fragment_maps:gp,lights_fragment_end:_p,logdepthbuf_fragment:vp,logdepthbuf_pars_fragment:Mp,logdepthbuf_pars_vertex:Sp,logdepthbuf_vertex:yp,map_fragment:bp,map_pars_fragment:wp,map_particle_fragment:Tp,map_particle_pars_fragment:Ep,metalnessmap_fragment:Ap,metalnessmap_pars_fragment:Cp,morphinstance_vertex:Rp,morphcolor_vertex:Pp,morphnormal_vertex:Lp,morphtarget_pars_vertex:Dp,morphtarget_vertex:Ip,normal_fragment_begin:Up,normal_fragment_maps:Np,normal_pars_fragment:Fp,normal_pars_vertex:Op,normal_vertex:Bp,normalmap_pars_fragment:zp,clearcoat_normal_fragment_begin:kp,clearcoat_normal_fragment_maps:Vp,clearcoat_pars_fragment:Gp,iridescence_pars_fragment:Hp,opaque_fragment:Wp,packing:Xp,premultiplied_alpha_fragment:qp,project_vertex:Yp,dithering_fragment:Zp,dithering_pars_fragment:$p,roughnessmap_fragment:Kp,roughnessmap_pars_fragment:Jp,shadowmap_pars_fragment:jp,shadowmap_pars_vertex:Qp,shadowmap_vertex:t0,shadowmask_pars_fragment:e0,skinbase_vertex:n0,skinning_pars_vertex:i0,skinning_vertex:s0,skinnormal_vertex:r0,specularmap_fragment:a0,specularmap_pars_fragment:o0,tonemapping_fragment:c0,tonemapping_pars_fragment:l0,transmission_fragment:h0,transmission_pars_fragment:d0,uv_pars_fragment:u0,uv_pars_vertex:f0,uv_vertex:p0,worldpos_vertex:m0,background_vert:x0,background_frag:g0,backgroundCube_vert:_0,backgroundCube_frag:v0,cube_vert:M0,cube_frag:S0,depth_vert:y0,depth_frag:b0,distanceRGBA_vert:w0,distanceRGBA_frag:T0,equirect_vert:E0,equirect_frag:A0,linedashed_vert:C0,linedashed_frag:R0,meshbasic_vert:P0,meshbasic_frag:L0,meshlambert_vert:D0,meshlambert_frag:I0,meshmatcap_vert:U0,meshmatcap_frag:N0,meshnormal_vert:F0,meshnormal_frag:O0,meshphong_vert:B0,meshphong_frag:z0,meshphysical_vert:k0,meshphysical_frag:V0,meshtoon_vert:G0,meshtoon_frag:H0,points_vert:W0,points_frag:X0,shadow_vert:q0,shadow_frag:Y0,sprite_vert:Z0,sprite_frag:$0},vt={common:{diffuse:{value:new Xt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $t}},envmap:{envMap:{value:null},envMapRotation:{value:new $t},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $t},normalScale:{value:new _t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0},uvTransform:{value:new $t}},sprite:{diffuse:{value:new Xt(16777215)},opacity:{value:1},center:{value:new _t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}}},An={basic:{uniforms:Ye([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:Ye([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Xt(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:Ye([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Xt(0)},specular:{value:new Xt(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:Ye([vt.common,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.roughnessmap,vt.metalnessmap,vt.fog,vt.lights,{emissive:{value:new Xt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:Ye([vt.common,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.gradientmap,vt.fog,vt.lights,{emissive:{value:new Xt(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:Ye([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:Ye([vt.points,vt.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:Ye([vt.common,vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:Ye([vt.common,vt.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:Ye([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:Ye([vt.sprite,vt.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new $t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $t}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:Ye([vt.common,vt.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:Ye([vt.lights,vt.fog,{color:{value:new Xt(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};An.physical={uniforms:Ye([An.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $t},clearcoatNormalScale:{value:new _t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $t},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $t},sheen:{value:0},sheenColor:{value:new Xt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $t},transmissionSamplerSize:{value:new _t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $t},attenuationDistance:{value:0},attenuationColor:{value:new Xt(0)},specularColor:{value:new Xt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $t},anisotropyVector:{value:new _t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $t}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const _r={r:0,b:0,g:0},fi=new bn,K0=new he;function J0(i,t,e,n,s,r,a){const o=new Xt(0);let c=r===!0?0:1,l,d,u=null,f=0,p=null;function g(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?e:t).get(y)),y}function S(v){let y=!1;const E=g(v);E===null?h(o,c):E&&E.isColor&&(h(E,1),y=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(v,y){const E=g(y);E&&(E.isCubeTexture||E.mapping===zr)?(d===void 0&&(d=new Y(new Vt(1,1,1),new Ge({name:"BackgroundCubeMaterial",uniforms:ns(An.backgroundCube.uniforms),vertexShader:An.backgroundCube.vertexShader,fragmentShader:An.backgroundCube.fragmentShader,side:He,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,P,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),fi.copy(y.backgroundRotation),fi.x*=-1,fi.y*=-1,fi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(fi.y*=-1,fi.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(K0.makeRotationFromEuler(fi)),d.material.toneMapped=se.getTransfer(E.colorSpace)!==fe,(u!==E||f!==E.version||p!==i.toneMapping)&&(d.material.needsUpdate=!0,u=E,f=E.version,p=i.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new Y(new De(2,2),new Ge({name:"BackgroundMaterial",uniforms:ns(An.background.uniforms),vertexShader:An.background.vertexShader,fragmentShader:An.background.fragmentShader,side:ai,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=se.getTransfer(E.colorSpace)!==fe,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||f!==E.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=E,f=E.version,p=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function h(v,y){v.getRGB(_r,ch(i)),n.buffers.color.setClear(_r.r,_r.g,_r.b,y,a)}function M(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,y=1){o.set(v),c=y,h(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,h(o,c)},render:S,addToRenderList:m,dispose:M}}function j0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(_,A,D,F,k){let V=!1;const H=u(F,D,A);r!==H&&(r=H,l(r.object)),V=p(_,F,D,k),V&&g(_,F,D,k),k!==null&&t.update(k,i.ELEMENT_ARRAY_BUFFER),(V||a)&&(a=!1,y(_,A,D,F),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function d(_){return i.deleteVertexArray(_)}function u(_,A,D){const F=D.wireframe===!0;let k=n[_.id];k===void 0&&(k={},n[_.id]=k);let V=k[A.id];V===void 0&&(V={},k[A.id]=V);let H=V[F];return H===void 0&&(H=f(c()),V[F]=H),H}function f(_){const A=[],D=[],F=[];for(let k=0;k<e;k++)A[k]=0,D[k]=0,F[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:D,attributeDivisors:F,object:_,attributes:{},index:null}}function p(_,A,D,F){const k=r.attributes,V=A.attributes;let H=0;const tt=D.getAttributes();for(const X in tt)if(tt[X].location>=0){const dt=k[X];let Lt=V[X];if(Lt===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(Lt=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(Lt=_.instanceColor)),dt===void 0||dt.attribute!==Lt||Lt&&dt.data!==Lt.data)return!0;H++}return r.attributesNum!==H||r.index!==F}function g(_,A,D,F){const k={},V=A.attributes;let H=0;const tt=D.getAttributes();for(const X in tt)if(tt[X].location>=0){let dt=V[X];dt===void 0&&(X==="instanceMatrix"&&_.instanceMatrix&&(dt=_.instanceMatrix),X==="instanceColor"&&_.instanceColor&&(dt=_.instanceColor));const Lt={};Lt.attribute=dt,dt&&dt.data&&(Lt.data=dt.data),k[X]=Lt,H++}r.attributes=k,r.attributesNum=H,r.index=F}function S(){const _=r.newAttributes;for(let A=0,D=_.length;A<D;A++)_[A]=0}function m(_){h(_,0)}function h(_,A){const D=r.newAttributes,F=r.enabledAttributes,k=r.attributeDivisors;D[_]=1,F[_]===0&&(i.enableVertexAttribArray(_),F[_]=1),k[_]!==A&&(i.vertexAttribDivisor(_,A),k[_]=A)}function M(){const _=r.newAttributes,A=r.enabledAttributes;for(let D=0,F=A.length;D<F;D++)A[D]!==_[D]&&(i.disableVertexAttribArray(D),A[D]=0)}function v(_,A,D,F,k,V,H){H===!0?i.vertexAttribIPointer(_,A,D,k,V):i.vertexAttribPointer(_,A,D,F,k,V)}function y(_,A,D,F){S();const k=F.attributes,V=D.getAttributes(),H=A.defaultAttributeValues;for(const tt in V){const X=V[tt];if(X.location>=0){let ht=k[tt];if(ht===void 0&&(tt==="instanceMatrix"&&_.instanceMatrix&&(ht=_.instanceMatrix),tt==="instanceColor"&&_.instanceColor&&(ht=_.instanceColor)),ht!==void 0){const dt=ht.normalized,Lt=ht.itemSize,jt=t.get(ht);if(jt===void 0)continue;const ie=jt.buffer,me=jt.type,xe=jt.bytesPerElement,j=me===i.INT||me===i.UNSIGNED_INT||ht.gpuType===Lo;if(ht.isInterleavedBufferAttribute){const it=ht.data,wt=it.stride,Gt=ht.offset;if(it.isInstancedInterleavedBuffer){for(let Dt=0;Dt<X.locationSize;Dt++)h(X.location+Dt,it.meshPerAttribute);_.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let Dt=0;Dt<X.locationSize;Dt++)m(X.location+Dt);i.bindBuffer(i.ARRAY_BUFFER,ie);for(let Dt=0;Dt<X.locationSize;Dt++)v(X.location+Dt,Lt/X.locationSize,me,dt,wt*xe,(Gt+Lt/X.locationSize*Dt)*xe,j)}else{if(ht.isInstancedBufferAttribute){for(let it=0;it<X.locationSize;it++)h(X.location+it,ht.meshPerAttribute);_.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ht.meshPerAttribute*ht.count)}else for(let it=0;it<X.locationSize;it++)m(X.location+it);i.bindBuffer(i.ARRAY_BUFFER,ie);for(let it=0;it<X.locationSize;it++)v(X.location+it,Lt/X.locationSize,me,dt,Lt*xe,Lt/X.locationSize*it*xe,j)}}else if(H!==void 0){const dt=H[tt];if(dt!==void 0)switch(dt.length){case 2:i.vertexAttrib2fv(X.location,dt);break;case 3:i.vertexAttrib3fv(X.location,dt);break;case 4:i.vertexAttrib4fv(X.location,dt);break;default:i.vertexAttrib1fv(X.location,dt)}}}}M()}function E(){C();for(const _ in n){const A=n[_];for(const D in A){const F=A[D];for(const k in F)d(F[k].object),delete F[k];delete A[D]}delete n[_]}}function T(_){if(n[_.id]===void 0)return;const A=n[_.id];for(const D in A){const F=A[D];for(const k in F)d(F[k].object),delete F[k];delete A[D]}delete n[_.id]}function P(_){for(const A in n){const D=n[A];if(D[_.id]===void 0)continue;const F=D[_.id];for(const k in F)d(F[k].object),delete F[k];delete D[_.id]}}function C(){b(),a=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:b,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:P,initAttributes:S,enableAttribute:m,disableUnusedAttributes:M}}function Q0(i,t,e){let n;function s(l){n=l}function r(l,d){i.drawArrays(n,l,d),e.update(d,n,1)}function a(l,d,u){u!==0&&(i.drawArraysInstanced(n,l,d,u),e.update(d,n,u))}function o(l,d,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,u);let p=0;for(let g=0;g<u;g++)p+=d[g];e.update(p,n,1)}function c(l,d,u,f){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)a(l[g],d[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,d,0,f,0,u);let g=0;for(let S=0;S<u;S++)g+=d[S]*f[S];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function tm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==vn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const C=P===Ln&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==Dn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Cn&&!C)}function c(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(Yt("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),h=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:S,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:M,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:E,maxSamples:T}}function em(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new xi,o=new $t,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=d(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,S=u.clipIntersection,m=u.clipShadows,h=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?d(null):l();else{const M=r?0:n,v=M*4;let y=h.clippingState||null;c.value=y,y=d(g,f,v,p);for(let E=0;E!==v;++E)y[E]=e[E];h.clippingState=y,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(u,f,p,g){const S=u!==null?u.length:0;let m=null;if(S!==0){if(m=c.value,g!==!0||m===null){const h=p+S*4,M=f.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<h)&&(m=new Float32Array(h));for(let v=0,y=p;v!==S;++v,y+=4)a.copy(u[v]).applyMatrix4(M,o),a.normal.toArray(m,y),m[y+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,m}}function nm(i){let t=new WeakMap;function e(a,o){return o===Ga?a.mapping=Qi:o===Ha&&(a.mapping=ts),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ga||o===Ha)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Su(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const ei=4,il=[.125,.215,.35,.446,.526,.582],vi=20,im=256,Ms=new jo,sl=new Xt;let ba=null,wa=0,Ta=0,Ea=!1;const sm=new I;class wo{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=sm}=r;ba=this._renderer.getRenderTarget(),wa=this._renderer.getActiveCubeFace(),Ta=this._renderer.getActiveMipmapLevel(),Ea=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ol(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=al(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(ba,wa,Ta),this._renderer.xr.enabled=Ea,t.scissorTest=!1,Wi(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Qi||t.mapping===ts?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ba=this._renderer.getRenderTarget(),wa=this._renderer.getActiveCubeFace(),Ta=this._renderer.getActiveMipmapLevel(),Ea=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ln,minFilter:ln,generateMipmaps:!1,type:Ln,format:vn,colorSpace:es,depthBuffer:!1},s=rl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=rl(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=rm(r)),this._blurMaterial=om(r,t,e),this._ggxMaterial=am(r,t,e)}return s}_compileMaterial(t){const e=new Y(new Ie,t);this._renderer.compile(e,Ms)}_sceneToCubeUV(t,e,n,s,r){const c=new tn(90,1,e,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(sl),u.toneMapping=si,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Y(new Vt,new we({name:"PMREM.Background",side:He,depthWrite:!1,depthTest:!1})));const S=this._backgroundBox,m=S.material;let h=!1;const M=t.background;M?M.isColor&&(m.color.copy(M),t.background=null,h=!0):(m.color.copy(sl),h=!0);for(let v=0;v<6;v++){const y=v%3;y===0?(c.up.set(0,l[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[v],r.y,r.z)):y===1?(c.up.set(0,0,l[v]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[v],r.z)):(c.up.set(0,l[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[v]));const E=this._cubeSize;Wi(s,y*E,v>2?E:0,E,E),u.setRenderTarget(s),h&&u.render(S,c),u.render(t,c)}u.toneMapping=p,u.autoClear=f,t.background=M}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Qi||t.mapping===ts;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ol()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=al());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;Wi(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Ms)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),d=e/(this._lodMeshes.length-1),u=Math.sqrt(l*l-d*d),f=.05+l*.95,p=u*f,{_lodMax:g}=this,S=this._sizeLods[n],m=3*S*(n>g-ei?n-g+ei:0),h=4*(this._cubeSize-S);c.envMap.value=t.texture,c.roughness.value=p,c.mipInt.value=g-e,Wi(r,m,h,3*S,2*S),s.setRenderTarget(r),s.render(o,Ms),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,Wi(t,m,h,3*S,2*S),s.setRenderTarget(t),s.render(o,Ms)}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Pe("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=l;const f=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*vi-1),S=r/g,m=isFinite(r)?1+Math.floor(d*S):vi;m>vi&&Yt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${vi}`);const h=[];let M=0;for(let P=0;P<vi;++P){const C=P/S,b=Math.exp(-C*C/2);h.push(b),P===0?M+=b:P<m&&(M+=2*b)}for(let P=0;P<h.length;P++)h[P]=h[P]/M;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=h,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-n;const y=this._sizeLods[s],E=3*y*(s>v-ei?s-v+ei:0),T=4*(this._cubeSize-y);Wi(e,E,T,3*y,2*y),c.setRenderTarget(e),c.render(u,Ms)}}function rm(i){const t=[],e=[],n=[];let s=i;const r=i-ei+1+il.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let c=1/o;a>i-ei?c=il[a-i+ei-1]:a===0&&(c=0),e.push(c);const l=1/(o-2),d=-l,u=1+l,f=[d,d,u,d,u,u,d,d,u,u,d,u],p=6,g=6,S=3,m=2,h=1,M=new Float32Array(S*g*p),v=new Float32Array(m*g*p),y=new Float32Array(h*g*p);for(let T=0;T<p;T++){const P=T%3*2/3-1,C=T>2?0:-1,b=[P,C,0,P+2/3,C,0,P+2/3,C+1,0,P,C,0,P+2/3,C+1,0,P,C+1,0];M.set(b,S*g*T),v.set(f,m*g*T);const _=[T,T,T,T,T,T];y.set(_,h*g*T)}const E=new Ie;E.setAttribute("position",new Sn(M,S)),E.setAttribute("uv",new Sn(v,m)),E.setAttribute("faceIndex",new Sn(y,h)),n.push(new Y(E,null)),s>ei&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function rl(i,t,e){const n=new Mn(i,t,e);return n.texture.mapping=zr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Wi(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function am(i,t,e){return new Ge({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:im,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Vr(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function om(i,t,e){const n=new Float32Array(vi),s=new I(0,1,0);return new Ge({name:"SphericalGaussianBlur",defines:{n:vi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Vr(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function al(){return new Ge({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Vr(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function ol(){return new Ge({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Vr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Vr(){return`

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
	`}function cm(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Ga||c===Ha,d=c===Qi||c===ts;if(l||d){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new wo(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return l&&p&&p.height>0||d&&p&&s(p)?(e===null&&(e=new wo(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function lm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];const s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Bs("WebGLRenderer: "+n+" extension not supported."),s}}}function hm(i,t,e,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete s[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const p in f)t.update(f[p],i.ARRAY_BUFFER)}function l(u){const f=[],p=u.index,g=u.attributes.position;let S=0;if(p!==null){const M=p.array;S=p.version;for(let v=0,y=M.length;v<y;v+=3){const E=M[v+0],T=M[v+1],P=M[v+2];f.push(E,T,T,P,P,E)}}else if(g!==void 0){const M=g.array;S=g.version;for(let v=0,y=M.length/3-1;v<y;v+=3){const E=v+0,T=v+1,P=v+2;f.push(E,T,T,P,P,E)}}else return;const m=new(ih(f)?oh:ah)(f,1);m.version=S;const h=r.get(u);h&&t.remove(h),r.set(u,m)}function d(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function dm(i,t,e){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,p){i.drawElements(n,p,r,f*a),e.update(p,n,1)}function l(f,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,f*a,g),e.update(p,n,g))}function d(f,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,g);let m=0;for(let h=0;h<g;h++)m+=p[h];e.update(m,n,1)}function u(f,p,g,S){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let h=0;h<f.length;h++)l(f[h]/a,p[h],S[h]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,S,0,g);let h=0;for(let M=0;M<g;M++)h+=p[M]*S[M];e.update(h,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function um(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Pe("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function fm(i,t,e){const n=new WeakMap,s=new ve;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let _=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",_)};var p=_;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,S=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),S===!0&&(y=2),m===!0&&(y=3);let E=o.attributes.position.count*y,T=1;E>t.maxTextureSize&&(T=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);const P=new Float32Array(E*T*4*u),C=new sh(P,E,T,u);C.type=Cn,C.needsUpdate=!0;const b=y*4;for(let A=0;A<u;A++){const D=h[A],F=M[A],k=v[A],V=E*T*4*A;for(let H=0;H<D.count;H++){const tt=H*b;g===!0&&(s.fromBufferAttribute(D,H),P[V+tt+0]=s.x,P[V+tt+1]=s.y,P[V+tt+2]=s.z,P[V+tt+3]=0),S===!0&&(s.fromBufferAttribute(F,H),P[V+tt+4]=s.x,P[V+tt+5]=s.y,P[V+tt+6]=s.z,P[V+tt+7]=0),m===!0&&(s.fromBufferAttribute(k,H),P[V+tt+8]=s.x,P[V+tt+9]=s.y,P[V+tt+10]=s.z,P[V+tt+11]=k.itemSize===4?s.w:1)}}f={count:u,texture:C,size:new _t(E,T)},n.set(o,f),o.addEventListener("dispose",_)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const S=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",S),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function pm(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,d=c.geometry,u=t.get(c,d);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}const Ch=new We,cl=new fh(1,1),Rh=new sh,Ph=new ru,Lh=new hh,ll=[],hl=[],dl=new Float32Array(16),ul=new Float32Array(9),fl=new Float32Array(4);function cs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=ll[s];if(r===void 0&&(r=new Float32Array(s),ll[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Fe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Oe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Gr(i,t){let e=hl[t];e===void 0&&(e=new Int32Array(t),hl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function mm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Fe(e,t))return;i.uniform2fv(this.addr,t),Oe(e,t)}}function gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Fe(e,t))return;i.uniform3fv(this.addr,t),Oe(e,t)}}function _m(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Fe(e,t))return;i.uniform4fv(this.addr,t),Oe(e,t)}}function vm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Fe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Oe(e,t)}else{if(Fe(e,n))return;fl.set(n),i.uniformMatrix2fv(this.addr,!1,fl),Oe(e,n)}}function Mm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Fe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Oe(e,t)}else{if(Fe(e,n))return;ul.set(n),i.uniformMatrix3fv(this.addr,!1,ul),Oe(e,n)}}function Sm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Fe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Oe(e,t)}else{if(Fe(e,n))return;dl.set(n),i.uniformMatrix4fv(this.addr,!1,dl),Oe(e,n)}}function ym(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function bm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Fe(e,t))return;i.uniform2iv(this.addr,t),Oe(e,t)}}function wm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Fe(e,t))return;i.uniform3iv(this.addr,t),Oe(e,t)}}function Tm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Fe(e,t))return;i.uniform4iv(this.addr,t),Oe(e,t)}}function Em(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Am(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Fe(e,t))return;i.uniform2uiv(this.addr,t),Oe(e,t)}}function Cm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Fe(e,t))return;i.uniform3uiv(this.addr,t),Oe(e,t)}}function Rm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Fe(e,t))return;i.uniform4uiv(this.addr,t),Oe(e,t)}}function Pm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(cl.compareFunction=nh,r=cl):r=Ch,e.setTexture2D(t||r,s)}function Lm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Ph,s)}function Dm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Lh,s)}function Im(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Rh,s)}function Um(i){switch(i){case 5126:return mm;case 35664:return xm;case 35665:return gm;case 35666:return _m;case 35674:return vm;case 35675:return Mm;case 35676:return Sm;case 5124:case 35670:return ym;case 35667:case 35671:return bm;case 35668:case 35672:return wm;case 35669:case 35673:return Tm;case 5125:return Em;case 36294:return Am;case 36295:return Cm;case 36296:return Rm;case 35678:case 36198:case 36298:case 36306:case 35682:return Pm;case 35679:case 36299:case 36307:return Lm;case 35680:case 36300:case 36308:case 36293:return Dm;case 36289:case 36303:case 36311:case 36292:return Im}}function Nm(i,t){i.uniform1fv(this.addr,t)}function Fm(i,t){const e=cs(t,this.size,2);i.uniform2fv(this.addr,e)}function Om(i,t){const e=cs(t,this.size,3);i.uniform3fv(this.addr,e)}function Bm(i,t){const e=cs(t,this.size,4);i.uniform4fv(this.addr,e)}function zm(i,t){const e=cs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function km(i,t){const e=cs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Vm(i,t){const e=cs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Gm(i,t){i.uniform1iv(this.addr,t)}function Hm(i,t){i.uniform2iv(this.addr,t)}function Wm(i,t){i.uniform3iv(this.addr,t)}function Xm(i,t){i.uniform4iv(this.addr,t)}function qm(i,t){i.uniform1uiv(this.addr,t)}function Ym(i,t){i.uniform2uiv(this.addr,t)}function Zm(i,t){i.uniform3uiv(this.addr,t)}function $m(i,t){i.uniform4uiv(this.addr,t)}function Km(i,t,e){const n=this.cache,s=t.length,r=Gr(e,s);Fe(n,r)||(i.uniform1iv(this.addr,r),Oe(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Ch,r[a])}function Jm(i,t,e){const n=this.cache,s=t.length,r=Gr(e,s);Fe(n,r)||(i.uniform1iv(this.addr,r),Oe(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Ph,r[a])}function jm(i,t,e){const n=this.cache,s=t.length,r=Gr(e,s);Fe(n,r)||(i.uniform1iv(this.addr,r),Oe(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Lh,r[a])}function Qm(i,t,e){const n=this.cache,s=t.length,r=Gr(e,s);Fe(n,r)||(i.uniform1iv(this.addr,r),Oe(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Rh,r[a])}function tx(i){switch(i){case 5126:return Nm;case 35664:return Fm;case 35665:return Om;case 35666:return Bm;case 35674:return zm;case 35675:return km;case 35676:return Vm;case 5124:case 35670:return Gm;case 35667:case 35671:return Hm;case 35668:case 35672:return Wm;case 35669:case 35673:return Xm;case 5125:return qm;case 36294:return Ym;case 36295:return Zm;case 36296:return $m;case 35678:case 36198:case 36298:case 36306:case 35682:return Km;case 35679:case 36299:case 36307:return Jm;case 35680:case 36300:case 36308:case 36293:return jm;case 36289:case 36303:case 36311:case 36292:return Qm}}class ex{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Um(e.type)}}class nx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=tx(e.type)}}class ix{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Aa=/(\w+)(\])?(\[|\.)?/g;function pl(i,t){i.seq.push(t),i.map[t.id]=t}function sx(i,t,e){const n=i.name,s=n.length;for(Aa.lastIndex=0;;){const r=Aa.exec(n),a=Aa.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){pl(e,l===void 0?new ex(o,i,t):new nx(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new ix(o),pl(e,u)),e=u}}}class Ar{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);sx(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function ml(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const rx=37297;let ax=0;function ox(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const xl=new $t;function cx(i){se._getMatrix(xl,se.workingColorSpace,i);const t=`mat3( ${xl.elements.map(e=>e.toFixed(4))} )`;switch(se.getTransfer(i)){case Dr:return[t,"LinearTransferOETF"];case fe:return[t,"sRGBTransferOETF"];default:return Yt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function gl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+ox(i.getShaderSource(t),o)}else return r}function lx(i,t){const e=cx(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function hx(i,t){let e;switch(t){case Hl:e="Linear";break;case Wl:e="Reinhard";break;case Xl:e="Cineon";break;case Po:e="ACESFilmic";break;case Yl:e="AgX";break;case Zl:e="Neutral";break;case ql:e="Custom";break;default:Yt("WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const vr=new I;function dx(){se.getLuminanceCoefficients(vr);const i=vr.x.toFixed(4),t=vr.y.toFixed(4),e=vr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ux(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(bs).join(`
`)}function fx(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function px(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function bs(i){return i!==""}function _l(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function vl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const mx=/^[ \t]*#include +<([\w\d./]+)>/gm;function To(i){return i.replace(mx,gx)}const xx=new Map;function gx(i,t){let e=Kt[t];if(e===void 0){const n=xx.get(t);if(n!==void 0)e=Kt[n],Yt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return To(e)}const _x=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ml(i){return i.replace(_x,vx)}function vx(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sl(i){let t=`precision ${i.precision} float;
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
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Mx(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Vl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Gl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===kn&&(t="SHADOWMAP_TYPE_VSM"),t}function Sx(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Qi:case ts:t="ENVMAP_TYPE_CUBE";break;case zr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function yx(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===ts&&(t="ENVMAP_MODE_REFRACTION"),t}function bx(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ro:t="ENVMAP_BLENDING_MULTIPLY";break;case bd:t="ENVMAP_BLENDING_MIX";break;case wd:t="ENVMAP_BLENDING_ADD";break}return t}function wx(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Tx(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=Mx(e),l=Sx(e),d=yx(e),u=bx(e),f=wx(e),p=ux(e),g=fx(r),S=s.createProgram();let m,h,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(bs).join(`
`),m.length>0&&(m+=`
`),h=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(bs).join(`
`),h.length>0&&(h+=`
`)):(m=[Sl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(bs).join(`
`),h=[Sl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==si?"#define TONE_MAPPING":"",e.toneMapping!==si?Kt.tonemapping_pars_fragment:"",e.toneMapping!==si?hx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,lx("linearToOutputTexel",e.outputColorSpace),dx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(bs).join(`
`)),a=To(a),a=_l(a,e),a=vl(a,e),o=To(o),o=_l(o,e),o=vl(o,e),a=Ml(a),o=Ml(o),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,h=["#define varying in",e.glslVersion===_c?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===_c?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const v=M+m+a,y=M+h+o,E=ml(s,s.VERTEX_SHADER,v),T=ml(s,s.FRAGMENT_SHADER,y);s.attachShader(S,E),s.attachShader(S,T),e.index0AttributeName!==void 0?s.bindAttribLocation(S,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function P(A){if(i.debug.checkShaderErrors){const D=s.getProgramInfoLog(S)||"",F=s.getShaderInfoLog(E)||"",k=s.getShaderInfoLog(T)||"",V=D.trim(),H=F.trim(),tt=k.trim();let X=!0,ht=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,S,E,T);else{const dt=gl(s,E,"vertex"),Lt=gl(s,T,"fragment");Pe("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+V+`
`+dt+`
`+Lt)}else V!==""?Yt("WebGLProgram: Program Info Log:",V):(H===""||tt==="")&&(ht=!1);ht&&(A.diagnostics={runnable:X,programLog:V,vertexShader:{log:H,prefix:m},fragmentShader:{log:tt,prefix:h}})}s.deleteShader(E),s.deleteShader(T),C=new Ar(s,S),b=px(s,S)}let C;this.getUniforms=function(){return C===void 0&&P(this),C};let b;this.getAttributes=function(){return b===void 0&&P(this),b};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(S,rx)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ax++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=E,this.fragmentShader=T,this}let Ex=0;class Ax{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Cx(t),e.set(t,n)),n}}class Cx{constructor(t){this.id=Ex++,this.code=t,this.usedTimes=0}}function Rx(i,t,e,n,s,r,a){const o=new Ho,c=new Ax,l=new Set,d=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function S(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,_,A,D,F){const k=D.fog,V=F.geometry,H=b.isMeshStandardMaterial?D.environment:null,tt=(b.isMeshStandardMaterial?e:t).get(b.envMap||H),X=tt&&tt.mapping===zr?tt.image.height:null,ht=g[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&Yt("WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));const dt=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Lt=dt!==void 0?dt.length:0;let jt=0;V.morphAttributes.position!==void 0&&(jt=1),V.morphAttributes.normal!==void 0&&(jt=2),V.morphAttributes.color!==void 0&&(jt=3);let ie,me,xe,j;if(ht){const ge=An[ht];ie=ge.vertexShader,me=ge.fragmentShader}else ie=b.vertexShader,me=b.fragmentShader,c.update(b),xe=c.getVertexShaderID(b),j=c.getFragmentShaderID(b);const it=i.getRenderTarget(),wt=i.state.buffers.depth.getReversed(),Gt=F.isInstancedMesh===!0,Dt=F.isBatchedMesh===!0,qt=!!b.map,Ue=!!b.matcap,Jt=!!tt,le=!!b.aoMap,U=!!b.lightMap,Q=!!b.bumpMap,Z=!!b.normalMap,lt=!!b.displacementMap,st=!!b.emissiveMap,xt=!!b.metalnessMap,ot=!!b.roughnessMap,St=b.anisotropy>0,L=b.clearcoat>0,w=b.dispersion>0,O=b.iridescence>0,$=b.sheen>0,nt=b.transmission>0,q=St&&!!b.anisotropyMap,Pt=L&&!!b.clearcoatMap,mt=L&&!!b.clearcoatNormalMap,Tt=L&&!!b.clearcoatRoughnessMap,Et=O&&!!b.iridescenceMap,rt=O&&!!b.iridescenceThicknessMap,ct=$&&!!b.sheenColorMap,Ft=$&&!!b.sheenRoughnessMap,It=!!b.specularMap,yt=!!b.specularColorMap,zt=!!b.specularIntensityMap,N=nt&&!!b.transmissionMap,gt=nt&&!!b.thicknessMap,pt=!!b.gradientMap,ut=!!b.alphaMap,at=b.alphaTest>0,et=!!b.alphaHash,Ct=!!b.extensions;let Zt=si;b.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Zt=i.toneMapping);const ye={shaderID:ht,shaderType:b.type,shaderName:b.name,vertexShader:ie,fragmentShader:me,defines:b.defines,customVertexShaderID:xe,customFragmentShaderID:j,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:Dt,batchingColor:Dt&&F._colorsTexture!==null,instancing:Gt,instancingColor:Gt&&F.instanceColor!==null,instancingMorph:Gt&&F.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:it===null?i.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:es,alphaToCoverage:!!b.alphaToCoverage,map:qt,matcap:Ue,envMap:Jt,envMapMode:Jt&&tt.mapping,envMapCubeUVHeight:X,aoMap:le,lightMap:U,bumpMap:Q,normalMap:Z,displacementMap:f&&lt,emissiveMap:st,normalMapObjectSpace:Z&&b.normalMapType===Cd,normalMapTangentSpace:Z&&b.normalMapType===zo,metalnessMap:xt,roughnessMap:ot,anisotropy:St,anisotropyMap:q,clearcoat:L,clearcoatMap:Pt,clearcoatNormalMap:mt,clearcoatRoughnessMap:Tt,dispersion:w,iridescence:O,iridescenceMap:Et,iridescenceThicknessMap:rt,sheen:$,sheenColorMap:ct,sheenRoughnessMap:Ft,specularMap:It,specularColorMap:yt,specularIntensityMap:zt,transmission:nt,transmissionMap:N,thicknessMap:gt,gradientMap:pt,opaque:b.transparent===!1&&b.blending===Zi&&b.alphaToCoverage===!1,alphaMap:ut,alphaTest:at,alphaHash:et,combine:b.combine,mapUv:qt&&S(b.map.channel),aoMapUv:le&&S(b.aoMap.channel),lightMapUv:U&&S(b.lightMap.channel),bumpMapUv:Q&&S(b.bumpMap.channel),normalMapUv:Z&&S(b.normalMap.channel),displacementMapUv:lt&&S(b.displacementMap.channel),emissiveMapUv:st&&S(b.emissiveMap.channel),metalnessMapUv:xt&&S(b.metalnessMap.channel),roughnessMapUv:ot&&S(b.roughnessMap.channel),anisotropyMapUv:q&&S(b.anisotropyMap.channel),clearcoatMapUv:Pt&&S(b.clearcoatMap.channel),clearcoatNormalMapUv:mt&&S(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Tt&&S(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Et&&S(b.iridescenceMap.channel),iridescenceThicknessMapUv:rt&&S(b.iridescenceThicknessMap.channel),sheenColorMapUv:ct&&S(b.sheenColorMap.channel),sheenRoughnessMapUv:Ft&&S(b.sheenRoughnessMap.channel),specularMapUv:It&&S(b.specularMap.channel),specularColorMapUv:yt&&S(b.specularColorMap.channel),specularIntensityMapUv:zt&&S(b.specularIntensityMap.channel),transmissionMapUv:N&&S(b.transmissionMap.channel),thicknessMapUv:gt&&S(b.thicknessMap.channel),alphaMapUv:ut&&S(b.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Z||St),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!V.attributes.uv&&(qt||ut),fog:!!k,useFog:b.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:wt,skinning:F.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Lt,morphTextureStride:jt,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:Zt,decodeVideoTexture:qt&&b.map.isVideoTexture===!0&&se.getTransfer(b.map.colorSpace)===fe,decodeVideoTextureEmissive:st&&b.emissiveMap.isVideoTexture===!0&&se.getTransfer(b.emissiveMap.colorSpace)===fe,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===ue,flipSided:b.side===He,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ct&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ct&&b.extensions.multiDraw===!0||Dt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ye.vertexUv1s=l.has(1),ye.vertexUv2s=l.has(2),ye.vertexUv3s=l.has(3),l.clear(),ye}function h(b){const _=[];if(b.shaderID?_.push(b.shaderID):(_.push(b.customVertexShaderID),_.push(b.customFragmentShaderID)),b.defines!==void 0)for(const A in b.defines)_.push(A),_.push(b.defines[A]);return b.isRawShaderMaterial===!1&&(M(_,b),v(_,b),_.push(i.outputColorSpace)),_.push(b.customProgramCacheKey),_.join()}function M(b,_){b.push(_.precision),b.push(_.outputColorSpace),b.push(_.envMapMode),b.push(_.envMapCubeUVHeight),b.push(_.mapUv),b.push(_.alphaMapUv),b.push(_.lightMapUv),b.push(_.aoMapUv),b.push(_.bumpMapUv),b.push(_.normalMapUv),b.push(_.displacementMapUv),b.push(_.emissiveMapUv),b.push(_.metalnessMapUv),b.push(_.roughnessMapUv),b.push(_.anisotropyMapUv),b.push(_.clearcoatMapUv),b.push(_.clearcoatNormalMapUv),b.push(_.clearcoatRoughnessMapUv),b.push(_.iridescenceMapUv),b.push(_.iridescenceThicknessMapUv),b.push(_.sheenColorMapUv),b.push(_.sheenRoughnessMapUv),b.push(_.specularMapUv),b.push(_.specularColorMapUv),b.push(_.specularIntensityMapUv),b.push(_.transmissionMapUv),b.push(_.thicknessMapUv),b.push(_.combine),b.push(_.fogExp2),b.push(_.sizeAttenuation),b.push(_.morphTargetsCount),b.push(_.morphAttributeCount),b.push(_.numDirLights),b.push(_.numPointLights),b.push(_.numSpotLights),b.push(_.numSpotLightMaps),b.push(_.numHemiLights),b.push(_.numRectAreaLights),b.push(_.numDirLightShadows),b.push(_.numPointLightShadows),b.push(_.numSpotLightShadows),b.push(_.numSpotLightShadowsWithMaps),b.push(_.numLightProbes),b.push(_.shadowMapType),b.push(_.toneMapping),b.push(_.numClippingPlanes),b.push(_.numClipIntersection),b.push(_.depthPacking)}function v(b,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),_.gradientMap&&o.enable(22),b.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.reversedDepthBuffer&&o.enable(4),_.skinning&&o.enable(5),_.morphTargets&&o.enable(6),_.morphNormals&&o.enable(7),_.morphColors&&o.enable(8),_.premultipliedAlpha&&o.enable(9),_.shadowMapEnabled&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.decodeVideoTextureEmissive&&o.enable(20),_.alphaToCoverage&&o.enable(21),b.push(o.mask)}function y(b){const _=g[b.type];let A;if(_){const D=An[_];A=ks.clone(D.uniforms)}else A=b.uniforms;return A}function E(b,_){let A;for(let D=0,F=d.length;D<F;D++){const k=d[D];if(k.cacheKey===_){A=k,++A.usedTimes;break}}return A===void 0&&(A=new Tx(i,_,b,r),d.push(A)),A}function T(b){if(--b.usedTimes===0){const _=d.indexOf(b);d[_]=d[d.length-1],d.pop(),b.destroy()}}function P(b){c.remove(b)}function C(){c.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:y,acquireProgram:E,releaseProgram:T,releaseShaderCache:P,programs:d,dispose:C}}function Px(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Lx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function yl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function bl(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,f,p,g,S,m){let h=i[t];return h===void 0?(h={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:S,group:m},i[t]=h):(h.id=u.id,h.object=u,h.geometry=f,h.material=p,h.groupOrder=g,h.renderOrder=u.renderOrder,h.z=S,h.group=m),t++,h}function o(u,f,p,g,S,m){const h=a(u,f,p,g,S,m);p.transmission>0?n.push(h):p.transparent===!0?s.push(h):e.push(h)}function c(u,f,p,g,S,m){const h=a(u,f,p,g,S,m);p.transmission>0?n.unshift(h):p.transparent===!0?s.unshift(h):e.unshift(h)}function l(u,f){e.length>1&&e.sort(u||Lx),n.length>1&&n.sort(f||yl),s.length>1&&s.sort(f||yl)}function d(){for(let u=t,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:d,sort:l}}function Dx(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new bl,i.set(n,[a])):s>=r.length?(a=new bl,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Ix(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new Xt};break;case"SpotLight":e={position:new I,direction:new I,color:new Xt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Xt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Xt,groundColor:new Xt};break;case"RectAreaLight":e={color:new Xt,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function Ux(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Nx=0;function Fx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Ox(i){const t=new Ix,e=Ux(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new I);const s=new I,r=new he,a=new he;function o(l){let d=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let p=0,g=0,S=0,m=0,h=0,M=0,v=0,y=0,E=0,T=0,P=0;l.sort(Fx);for(let b=0,_=l.length;b<_;b++){const A=l[b],D=A.color,F=A.intensity,k=A.distance,V=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)d+=D.r*F,u+=D.g*F,f+=D.b*F;else if(A.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(A.sh.coefficients[H],F);P++}else if(A.isDirectionalLight){const H=t.get(A);if(H.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const tt=A.shadow,X=e.get(A);X.shadowIntensity=tt.intensity,X.shadowBias=tt.bias,X.shadowNormalBias=tt.normalBias,X.shadowRadius=tt.radius,X.shadowMapSize=tt.mapSize,n.directionalShadow[p]=X,n.directionalShadowMap[p]=V,n.directionalShadowMatrix[p]=A.shadow.matrix,M++}n.directional[p]=H,p++}else if(A.isSpotLight){const H=t.get(A);H.position.setFromMatrixPosition(A.matrixWorld),H.color.copy(D).multiplyScalar(F),H.distance=k,H.coneCos=Math.cos(A.angle),H.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),H.decay=A.decay,n.spot[S]=H;const tt=A.shadow;if(A.map&&(n.spotLightMap[E]=A.map,E++,tt.updateMatrices(A),A.castShadow&&T++),n.spotLightMatrix[S]=tt.matrix,A.castShadow){const X=e.get(A);X.shadowIntensity=tt.intensity,X.shadowBias=tt.bias,X.shadowNormalBias=tt.normalBias,X.shadowRadius=tt.radius,X.shadowMapSize=tt.mapSize,n.spotShadow[S]=X,n.spotShadowMap[S]=V,y++}S++}else if(A.isRectAreaLight){const H=t.get(A);H.color.copy(D).multiplyScalar(F),H.halfWidth.set(A.width*.5,0,0),H.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=H,m++}else if(A.isPointLight){const H=t.get(A);if(H.color.copy(A.color).multiplyScalar(A.intensity),H.distance=A.distance,H.decay=A.decay,A.castShadow){const tt=A.shadow,X=e.get(A);X.shadowIntensity=tt.intensity,X.shadowBias=tt.bias,X.shadowNormalBias=tt.normalBias,X.shadowRadius=tt.radius,X.shadowMapSize=tt.mapSize,X.shadowCameraNear=tt.camera.near,X.shadowCameraFar=tt.camera.far,n.pointShadow[g]=X,n.pointShadowMap[g]=V,n.pointShadowMatrix[g]=A.shadow.matrix,v++}n.point[g]=H,g++}else if(A.isHemisphereLight){const H=t.get(A);H.skyColor.copy(A.color).multiplyScalar(F),H.groundColor.copy(A.groundColor).multiplyScalar(F),n.hemi[h]=H,h++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=vt.LTC_FLOAT_1,n.rectAreaLTC2=vt.LTC_FLOAT_2):(n.rectAreaLTC1=vt.LTC_HALF_1,n.rectAreaLTC2=vt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=f;const C=n.hash;(C.directionalLength!==p||C.pointLength!==g||C.spotLength!==S||C.rectAreaLength!==m||C.hemiLength!==h||C.numDirectionalShadows!==M||C.numPointShadows!==v||C.numSpotShadows!==y||C.numSpotMaps!==E||C.numLightProbes!==P)&&(n.directional.length=p,n.spot.length=S,n.rectArea.length=m,n.point.length=g,n.hemi.length=h,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=y+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=P,C.directionalLength=p,C.pointLength=g,C.spotLength=S,C.rectAreaLength=m,C.hemiLength=h,C.numDirectionalShadows=M,C.numPointShadows=v,C.numSpotShadows=y,C.numSpotMaps=E,C.numLightProbes=P,n.version=Nx++)}function c(l,d){let u=0,f=0,p=0,g=0,S=0;const m=d.matrixWorldInverse;for(let h=0,M=l.length;h<M;h++){const v=l[h];if(v.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(v.isSpotLight){const y=n.spot[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),p++}else if(v.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(v.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(v.isPointLight){const y=n.point[f];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){const y=n.hemi[S];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(m),S++}}}return{setup:o,setupView:c,state:n}}function wl(i){const t=new Ox(i),e=[],n=[];function s(d){l.camera=d,e.length=0,n.length=0}function r(d){e.push(d)}function a(d){n.push(d)}function o(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Bx(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new wl(i),t.set(s,[o])):r>=a.length?(o=new wl(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const zx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,kx=`uniform sampler2D shadow_pass;
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
}`;function Vx(i,t,e){let n=new Xo;const s=new _t,r=new _t,a=new ve,o=new cf({depthPacking:Ad}),c=new lf,l={},d=e.maxTextureSize,u={[ai]:He,[He]:ai,[ue]:ue},f=new Ge({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _t},radius:{value:4}},vertexShader:zx,fragmentShader:kx}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ie;g.setAttribute("position",new Sn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new Y(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vl;let h=this.type;this.render=function(T,P,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const b=i.getRenderTarget(),_=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),D=i.state;D.setBlending(Pn),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const F=h!==kn&&this.type===kn,k=h===kn&&this.type!==kn;for(let V=0,H=T.length;V<H;V++){const tt=T[V],X=tt.shadow;if(X===void 0){Yt("WebGLShadowMap:",tt,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);const ht=X.getFrameExtents();if(s.multiply(ht),r.copy(X.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/ht.x),s.x=r.x*ht.x,X.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/ht.y),s.y=r.y*ht.y,X.mapSize.y=r.y)),X.map===null||F===!0||k===!0){const Lt=this.type!==kn?{minFilter:nn,magFilter:nn}:{};X.map!==null&&X.map.dispose(),X.map=new Mn(s.x,s.y,Lt),X.map.texture.name=tt.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();const dt=X.getViewportCount();for(let Lt=0;Lt<dt;Lt++){const jt=X.getViewport(Lt);a.set(r.x*jt.x,r.y*jt.y,r.x*jt.z,r.y*jt.w),D.viewport(a),X.updateMatrices(tt,Lt),n=X.getFrustum(),y(P,C,X.camera,tt,this.type)}X.isPointLightShadow!==!0&&this.type===kn&&M(X,C),X.needsUpdate=!1}h=this.type,m.needsUpdate=!1,i.setRenderTarget(b,_,A)};function M(T,P){const C=t.update(S);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Mn(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(P,null,C,f,S,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(P,null,C,p,S,null)}function v(T,P,C,b){let _=null;const A=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(A!==void 0)_=A;else if(_=C.isPointLight===!0?c:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const D=_.uuid,F=P.uuid;let k=l[D];k===void 0&&(k={},l[D]=k);let V=k[F];V===void 0&&(V=_.clone(),k[F]=V,P.addEventListener("dispose",E)),_=V}if(_.visible=P.visible,_.wireframe=P.wireframe,b===kn?_.side=P.shadowSide!==null?P.shadowSide:P.side:_.side=P.shadowSide!==null?P.shadowSide:u[P.side],_.alphaMap=P.alphaMap,_.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,_.map=P.map,_.clipShadows=P.clipShadows,_.clippingPlanes=P.clippingPlanes,_.clipIntersection=P.clipIntersection,_.displacementMap=P.displacementMap,_.displacementScale=P.displacementScale,_.displacementBias=P.displacementBias,_.wireframeLinewidth=P.wireframeLinewidth,_.linewidth=P.linewidth,C.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const D=i.properties.get(_);D.light=C}return _}function y(T,P,C,b,_){if(T.visible===!1)return;if(T.layers.test(P.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&_===kn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const F=t.update(T),k=T.material;if(Array.isArray(k)){const V=F.groups;for(let H=0,tt=V.length;H<tt;H++){const X=V[H],ht=k[X.materialIndex];if(ht&&ht.visible){const dt=v(T,ht,b,_);T.onBeforeShadow(i,T,P,C,F,dt,X),i.renderBufferDirect(C,null,F,dt,T,X),T.onAfterShadow(i,T,P,C,F,dt,X)}}}else if(k.visible){const V=v(T,k,b,_);T.onBeforeShadow(i,T,P,C,F,V,null),i.renderBufferDirect(C,null,F,V,T,null),T.onAfterShadow(i,T,P,C,F,V,null)}}const D=T.children;for(let F=0,k=D.length;F<k;F++)y(D[F],P,C,b,_)}function E(T){T.target.removeEventListener("dispose",E);for(const C in l){const b=l[C],_=T.target.uuid;_ in b&&(b[_].dispose(),delete b[_])}}}const Gx={[Na]:Fa,[Oa]:ka,[Ba]:Va,[ji]:za,[Fa]:Na,[ka]:Oa,[Va]:Ba,[za]:ji};function Hx(i,t){function e(){let N=!1;const gt=new ve;let pt=null;const ut=new ve(0,0,0,0);return{setMask:function(at){pt!==at&&!N&&(i.colorMask(at,at,at,at),pt=at)},setLocked:function(at){N=at},setClear:function(at,et,Ct,Zt,ye){ye===!0&&(at*=Zt,et*=Zt,Ct*=Zt),gt.set(at,et,Ct,Zt),ut.equals(gt)===!1&&(i.clearColor(at,et,Ct,Zt),ut.copy(gt))},reset:function(){N=!1,pt=null,ut.set(-1,0,0,0)}}}function n(){let N=!1,gt=!1,pt=null,ut=null,at=null;return{setReversed:function(et){if(gt!==et){const Ct=t.get("EXT_clip_control");et?Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.ZERO_TO_ONE_EXT):Ct.clipControlEXT(Ct.LOWER_LEFT_EXT,Ct.NEGATIVE_ONE_TO_ONE_EXT),gt=et;const Zt=at;at=null,this.setClear(Zt)}},getReversed:function(){return gt},setTest:function(et){et?it(i.DEPTH_TEST):wt(i.DEPTH_TEST)},setMask:function(et){pt!==et&&!N&&(i.depthMask(et),pt=et)},setFunc:function(et){if(gt&&(et=Gx[et]),ut!==et){switch(et){case Na:i.depthFunc(i.NEVER);break;case Fa:i.depthFunc(i.ALWAYS);break;case Oa:i.depthFunc(i.LESS);break;case ji:i.depthFunc(i.LEQUAL);break;case Ba:i.depthFunc(i.EQUAL);break;case za:i.depthFunc(i.GEQUAL);break;case ka:i.depthFunc(i.GREATER);break;case Va:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ut=et}},setLocked:function(et){N=et},setClear:function(et){at!==et&&(gt&&(et=1-et),i.clearDepth(et),at=et)},reset:function(){N=!1,pt=null,ut=null,at=null,gt=!1}}}function s(){let N=!1,gt=null,pt=null,ut=null,at=null,et=null,Ct=null,Zt=null,ye=null;return{setTest:function(ge){N||(ge?it(i.STENCIL_TEST):wt(i.STENCIL_TEST))},setMask:function(ge){gt!==ge&&!N&&(i.stencilMask(ge),gt=ge)},setFunc:function(ge,En,dn){(pt!==ge||ut!==En||at!==dn)&&(i.stencilFunc(ge,En,dn),pt=ge,ut=En,at=dn)},setOp:function(ge,En,dn){(et!==ge||Ct!==En||Zt!==dn)&&(i.stencilOp(ge,En,dn),et=ge,Ct=En,Zt=dn)},setLocked:function(ge){N=ge},setClear:function(ge){ye!==ge&&(i.clearStencil(ge),ye=ge)},reset:function(){N=!1,gt=null,pt=null,ut=null,at=null,et=null,Ct=null,Zt=null,ye=null}}}const r=new e,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let d={},u={},f=new WeakMap,p=[],g=null,S=!1,m=null,h=null,M=null,v=null,y=null,E=null,T=null,P=new Xt(0,0,0),C=0,b=!1,_=null,A=null,D=null,F=null,k=null;const V=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,tt=0;const X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(tt=parseFloat(/^WebGL (\d)/.exec(X)[1]),H=tt>=1):X.indexOf("OpenGL ES")!==-1&&(tt=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),H=tt>=2);let ht=null,dt={};const Lt=i.getParameter(i.SCISSOR_BOX),jt=i.getParameter(i.VIEWPORT),ie=new ve().fromArray(Lt),me=new ve().fromArray(jt);function xe(N,gt,pt,ut){const at=new Uint8Array(4),et=i.createTexture();i.bindTexture(N,et),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ct=0;Ct<pt;Ct++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(gt,0,i.RGBA,1,1,ut,0,i.RGBA,i.UNSIGNED_BYTE,at):i.texImage2D(gt+Ct,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,at);return et}const j={};j[i.TEXTURE_2D]=xe(i.TEXTURE_2D,i.TEXTURE_2D,1),j[i.TEXTURE_CUBE_MAP]=xe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[i.TEXTURE_2D_ARRAY]=xe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),j[i.TEXTURE_3D]=xe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),it(i.DEPTH_TEST),a.setFunc(ji),Q(!1),Z(fc),it(i.CULL_FACE),le(Pn);function it(N){d[N]!==!0&&(i.enable(N),d[N]=!0)}function wt(N){d[N]!==!1&&(i.disable(N),d[N]=!1)}function Gt(N,gt){return u[N]!==gt?(i.bindFramebuffer(N,gt),u[N]=gt,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=gt),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=gt),!0):!1}function Dt(N,gt){let pt=p,ut=!1;if(N){pt=f.get(gt),pt===void 0&&(pt=[],f.set(gt,pt));const at=N.textures;if(pt.length!==at.length||pt[0]!==i.COLOR_ATTACHMENT0){for(let et=0,Ct=at.length;et<Ct;et++)pt[et]=i.COLOR_ATTACHMENT0+et;pt.length=at.length,ut=!0}}else pt[0]!==i.BACK&&(pt[0]=i.BACK,ut=!0);ut&&i.drawBuffers(pt)}function qt(N){return g!==N?(i.useProgram(N),g=N,!0):!1}const Ue={[_i]:i.FUNC_ADD,[ad]:i.FUNC_SUBTRACT,[od]:i.FUNC_REVERSE_SUBTRACT};Ue[cd]=i.MIN,Ue[ld]=i.MAX;const Jt={[hd]:i.ZERO,[dd]:i.ONE,[ud]:i.SRC_COLOR,[Ia]:i.SRC_ALPHA,[_d]:i.SRC_ALPHA_SATURATE,[xd]:i.DST_COLOR,[pd]:i.DST_ALPHA,[fd]:i.ONE_MINUS_SRC_COLOR,[Ua]:i.ONE_MINUS_SRC_ALPHA,[gd]:i.ONE_MINUS_DST_COLOR,[md]:i.ONE_MINUS_DST_ALPHA,[vd]:i.CONSTANT_COLOR,[Md]:i.ONE_MINUS_CONSTANT_COLOR,[Sd]:i.CONSTANT_ALPHA,[yd]:i.ONE_MINUS_CONSTANT_ALPHA};function le(N,gt,pt,ut,at,et,Ct,Zt,ye,ge){if(N===Pn){S===!0&&(wt(i.BLEND),S=!1);return}if(S===!1&&(it(i.BLEND),S=!0),N!==rd){if(N!==m||ge!==b){if((h!==_i||y!==_i)&&(i.blendEquation(i.FUNC_ADD),h=_i,y=_i),ge)switch(N){case Zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $i:i.blendFunc(i.ONE,i.ONE);break;case pc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Pe("WebGLState: Invalid blending: ",N);break}else switch(N){case Zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $i:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case pc:Pe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case mc:Pe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Pe("WebGLState: Invalid blending: ",N);break}M=null,v=null,E=null,T=null,P.set(0,0,0),C=0,m=N,b=ge}return}at=at||gt,et=et||pt,Ct=Ct||ut,(gt!==h||at!==y)&&(i.blendEquationSeparate(Ue[gt],Ue[at]),h=gt,y=at),(pt!==M||ut!==v||et!==E||Ct!==T)&&(i.blendFuncSeparate(Jt[pt],Jt[ut],Jt[et],Jt[Ct]),M=pt,v=ut,E=et,T=Ct),(Zt.equals(P)===!1||ye!==C)&&(i.blendColor(Zt.r,Zt.g,Zt.b,ye),P.copy(Zt),C=ye),m=N,b=!1}function U(N,gt){N.side===ue?wt(i.CULL_FACE):it(i.CULL_FACE);let pt=N.side===He;gt&&(pt=!pt),Q(pt),N.blending===Zi&&N.transparent===!1?le(Pn):le(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);const ut=N.stencilWrite;o.setTest(ut),ut&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),st(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?it(i.SAMPLE_ALPHA_TO_COVERAGE):wt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Q(N){_!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),_=N)}function Z(N){N!==id?(it(i.CULL_FACE),N!==A&&(N===fc?i.cullFace(i.BACK):N===sd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):wt(i.CULL_FACE),A=N}function lt(N){N!==D&&(H&&i.lineWidth(N),D=N)}function st(N,gt,pt){N?(it(i.POLYGON_OFFSET_FILL),(F!==gt||k!==pt)&&(i.polygonOffset(gt,pt),F=gt,k=pt)):wt(i.POLYGON_OFFSET_FILL)}function xt(N){N?it(i.SCISSOR_TEST):wt(i.SCISSOR_TEST)}function ot(N){N===void 0&&(N=i.TEXTURE0+V-1),ht!==N&&(i.activeTexture(N),ht=N)}function St(N,gt,pt){pt===void 0&&(ht===null?pt=i.TEXTURE0+V-1:pt=ht);let ut=dt[pt];ut===void 0&&(ut={type:void 0,texture:void 0},dt[pt]=ut),(ut.type!==N||ut.texture!==gt)&&(ht!==pt&&(i.activeTexture(pt),ht=pt),i.bindTexture(N,gt||j[N]),ut.type=N,ut.texture=gt)}function L(){const N=dt[ht];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function w(){try{i.compressedTexImage2D(...arguments)}catch(N){N("WebGLState:",N)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(N){N("WebGLState:",N)}}function $(){try{i.texSubImage2D(...arguments)}catch(N){N("WebGLState:",N)}}function nt(){try{i.texSubImage3D(...arguments)}catch(N){N("WebGLState:",N)}}function q(){try{i.compressedTexSubImage2D(...arguments)}catch(N){N("WebGLState:",N)}}function Pt(){try{i.compressedTexSubImage3D(...arguments)}catch(N){N("WebGLState:",N)}}function mt(){try{i.texStorage2D(...arguments)}catch(N){N("WebGLState:",N)}}function Tt(){try{i.texStorage3D(...arguments)}catch(N){N("WebGLState:",N)}}function Et(){try{i.texImage2D(...arguments)}catch(N){N("WebGLState:",N)}}function rt(){try{i.texImage3D(...arguments)}catch(N){N("WebGLState:",N)}}function ct(N){ie.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),ie.copy(N))}function Ft(N){me.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),me.copy(N))}function It(N,gt){let pt=l.get(gt);pt===void 0&&(pt=new WeakMap,l.set(gt,pt));let ut=pt.get(N);ut===void 0&&(ut=i.getUniformBlockIndex(gt,N.name),pt.set(N,ut))}function yt(N,gt){const ut=l.get(gt).get(N);c.get(gt)!==ut&&(i.uniformBlockBinding(gt,ut,N.__bindingPointIndex),c.set(gt,ut))}function zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},ht=null,dt={},u={},f=new WeakMap,p=[],g=null,S=!1,m=null,h=null,M=null,v=null,y=null,E=null,T=null,P=new Xt(0,0,0),C=0,b=!1,_=null,A=null,D=null,F=null,k=null,ie.set(0,0,i.canvas.width,i.canvas.height),me.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:it,disable:wt,bindFramebuffer:Gt,drawBuffers:Dt,useProgram:qt,setBlending:le,setMaterial:U,setFlipSided:Q,setCullFace:Z,setLineWidth:lt,setPolygonOffset:st,setScissorTest:xt,activeTexture:ot,bindTexture:St,unbindTexture:L,compressedTexImage2D:w,compressedTexImage3D:O,texImage2D:Et,texImage3D:rt,updateUBOMapping:It,uniformBlockBinding:yt,texStorage2D:mt,texStorage3D:Tt,texSubImage2D:$,texSubImage3D:nt,compressedTexSubImage2D:q,compressedTexSubImage3D:Pt,scissor:ct,viewport:Ft,reset:zt}}function Wx(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new _t,d=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(L,w){return p?new OffscreenCanvas(L,w):Ur("canvas")}function S(L,w,O){let $=1;const nt=St(L);if((nt.width>O||nt.height>O)&&($=O/Math.max(nt.width,nt.height)),$<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const q=Math.floor($*nt.width),Pt=Math.floor($*nt.height);u===void 0&&(u=g(q,Pt));const mt=w?g(q,Pt):u;return mt.width=q,mt.height=Pt,mt.getContext("2d").drawImage(L,0,0,q,Pt),Yt("WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+q+"x"+Pt+")."),mt}else return"data"in L&&Yt("WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),L;return L}function m(L){return L.generateMipmaps}function h(L){i.generateMipmap(L)}function M(L){return L.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?i.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(L,w,O,$,nt=!1){if(L!==null){if(i[L]!==void 0)return i[L];Yt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let q=w;if(w===i.RED&&(O===i.FLOAT&&(q=i.R32F),O===i.HALF_FLOAT&&(q=i.R16F),O===i.UNSIGNED_BYTE&&(q=i.R8)),w===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.R8UI),O===i.UNSIGNED_SHORT&&(q=i.R16UI),O===i.UNSIGNED_INT&&(q=i.R32UI),O===i.BYTE&&(q=i.R8I),O===i.SHORT&&(q=i.R16I),O===i.INT&&(q=i.R32I)),w===i.RG&&(O===i.FLOAT&&(q=i.RG32F),O===i.HALF_FLOAT&&(q=i.RG16F),O===i.UNSIGNED_BYTE&&(q=i.RG8)),w===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.RG8UI),O===i.UNSIGNED_SHORT&&(q=i.RG16UI),O===i.UNSIGNED_INT&&(q=i.RG32UI),O===i.BYTE&&(q=i.RG8I),O===i.SHORT&&(q=i.RG16I),O===i.INT&&(q=i.RG32I)),w===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.RGB8UI),O===i.UNSIGNED_SHORT&&(q=i.RGB16UI),O===i.UNSIGNED_INT&&(q=i.RGB32UI),O===i.BYTE&&(q=i.RGB8I),O===i.SHORT&&(q=i.RGB16I),O===i.INT&&(q=i.RGB32I)),w===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),O===i.UNSIGNED_INT&&(q=i.RGBA32UI),O===i.BYTE&&(q=i.RGBA8I),O===i.SHORT&&(q=i.RGBA16I),O===i.INT&&(q=i.RGBA32I)),w===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(q=i.R11F_G11F_B10F)),w===i.RGBA){const Pt=nt?Dr:se.getTransfer($);O===i.FLOAT&&(q=i.RGBA32F),O===i.HALF_FLOAT&&(q=i.RGBA16F),O===i.UNSIGNED_BYTE&&(q=Pt===fe?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function y(L,w){let O;return L?w===null||w===bi||w===Ns?O=i.DEPTH24_STENCIL8:w===Cn?O=i.DEPTH32F_STENCIL8:w===Us&&(O=i.DEPTH24_STENCIL8,Yt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===bi||w===Ns?O=i.DEPTH_COMPONENT24:w===Cn?O=i.DEPTH_COMPONENT32F:w===Us&&(O=i.DEPTH_COMPONENT16),O}function E(L,w){return m(L)===!0||L.isFramebufferTexture&&L.minFilter!==nn&&L.minFilter!==ln?Math.log2(Math.max(w.width,w.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?w.mipmaps.length:1}function T(L){const w=L.target;w.removeEventListener("dispose",T),C(w),w.isVideoTexture&&d.delete(w)}function P(L){const w=L.target;w.removeEventListener("dispose",P),_(w)}function C(L){const w=n.get(L);if(w.__webglInit===void 0)return;const O=L.source,$=f.get(O);if($){const nt=$[w.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&b(L),Object.keys($).length===0&&f.delete(O)}n.remove(L)}function b(L){const w=n.get(L);i.deleteTexture(w.__webglTexture);const O=L.source,$=f.get(O);delete $[w.__cacheKey],a.memory.textures--}function _(L){const w=n.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),n.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(w.__webglFramebuffer[$]))for(let nt=0;nt<w.__webglFramebuffer[$].length;nt++)i.deleteFramebuffer(w.__webglFramebuffer[$][nt]);else i.deleteFramebuffer(w.__webglFramebuffer[$]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[$])}else{if(Array.isArray(w.__webglFramebuffer))for(let $=0;$<w.__webglFramebuffer.length;$++)i.deleteFramebuffer(w.__webglFramebuffer[$]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let $=0;$<w.__webglColorRenderbuffer.length;$++)w.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[$]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const O=L.textures;for(let $=0,nt=O.length;$<nt;$++){const q=n.get(O[$]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),a.memory.textures--),n.remove(O[$])}n.remove(L)}let A=0;function D(){A=0}function F(){const L=A;return L>=s.maxTextures&&Yt("WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),A+=1,L}function k(L){const w=[];return w.push(L.wrapS),w.push(L.wrapT),w.push(L.wrapR||0),w.push(L.magFilter),w.push(L.minFilter),w.push(L.anisotropy),w.push(L.internalFormat),w.push(L.format),w.push(L.type),w.push(L.generateMipmaps),w.push(L.premultiplyAlpha),w.push(L.flipY),w.push(L.unpackAlignment),w.push(L.colorSpace),w.join()}function V(L,w){const O=n.get(L);if(L.isVideoTexture&&xt(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&O.__version!==L.version){const $=L.image;if($===null)Yt("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)Yt("WebGLRenderer: Texture marked for update but image is incomplete");else{j(O,L,w);return}}else L.isExternalTexture&&(O.__webglTexture=L.sourceTexture?L.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+w)}function H(L,w){const O=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&O.__version!==L.version){j(O,L,w);return}else L.isExternalTexture&&(O.__webglTexture=L.sourceTexture?L.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+w)}function tt(L,w){const O=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&O.__version!==L.version){j(O,L,w);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+w)}function X(L,w){const O=n.get(L);if(L.version>0&&O.__version!==L.version){it(O,L,w);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+w)}const ht={[hn]:i.REPEAT,[Gn]:i.CLAMP_TO_EDGE,[Wa]:i.MIRRORED_REPEAT},dt={[nn]:i.NEAREST,[Td]:i.NEAREST_MIPMAP_NEAREST,[Zs]:i.NEAREST_MIPMAP_LINEAR,[ln]:i.LINEAR,[Zr]:i.LINEAR_MIPMAP_NEAREST,[Mi]:i.LINEAR_MIPMAP_LINEAR},Lt={[Rd]:i.NEVER,[Nd]:i.ALWAYS,[Pd]:i.LESS,[nh]:i.LEQUAL,[Ld]:i.EQUAL,[Ud]:i.GEQUAL,[Dd]:i.GREATER,[Id]:i.NOTEQUAL};function jt(L,w){if(w.type===Cn&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===ln||w.magFilter===Zr||w.magFilter===Zs||w.magFilter===Mi||w.minFilter===ln||w.minFilter===Zr||w.minFilter===Zs||w.minFilter===Mi)&&Yt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(L,i.TEXTURE_WRAP_S,ht[w.wrapS]),i.texParameteri(L,i.TEXTURE_WRAP_T,ht[w.wrapT]),(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)&&i.texParameteri(L,i.TEXTURE_WRAP_R,ht[w.wrapR]),i.texParameteri(L,i.TEXTURE_MAG_FILTER,dt[w.magFilter]),i.texParameteri(L,i.TEXTURE_MIN_FILTER,dt[w.minFilter]),w.compareFunction&&(i.texParameteri(L,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(L,i.TEXTURE_COMPARE_FUNC,Lt[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===nn||w.minFilter!==Zs&&w.minFilter!==Mi||w.type===Cn&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");i.texParameterf(L,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function ie(L,w){let O=!1;L.__webglInit===void 0&&(L.__webglInit=!0,w.addEventListener("dispose",T));const $=w.source;let nt=f.get($);nt===void 0&&(nt={},f.set($,nt));const q=k(w);if(q!==L.__cacheKey){nt[q]===void 0&&(nt[q]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),nt[q].usedTimes++;const Pt=nt[L.__cacheKey];Pt!==void 0&&(nt[L.__cacheKey].usedTimes--,Pt.usedTimes===0&&b(w)),L.__cacheKey=q,L.__webglTexture=nt[q].texture}return O}function me(L,w,O){return Math.floor(Math.floor(L/O)/w)}function xe(L,w,O,$){const q=L.updateRanges;if(q.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,w.width,w.height,O,$,w.data);else{q.sort((rt,ct)=>rt.start-ct.start);let Pt=0;for(let rt=1;rt<q.length;rt++){const ct=q[Pt],Ft=q[rt],It=ct.start+ct.count,yt=me(Ft.start,w.width,4),zt=me(ct.start,w.width,4);Ft.start<=It+1&&yt===zt&&me(Ft.start+Ft.count-1,w.width,4)===yt?ct.count=Math.max(ct.count,Ft.start+Ft.count-ct.start):(++Pt,q[Pt]=Ft)}q.length=Pt+1;const mt=i.getParameter(i.UNPACK_ROW_LENGTH),Tt=i.getParameter(i.UNPACK_SKIP_PIXELS),Et=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,w.width);for(let rt=0,ct=q.length;rt<ct;rt++){const Ft=q[rt],It=Math.floor(Ft.start/4),yt=Math.ceil(Ft.count/4),zt=It%w.width,N=Math.floor(It/w.width),gt=yt,pt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,zt),i.pixelStorei(i.UNPACK_SKIP_ROWS,N),e.texSubImage2D(i.TEXTURE_2D,0,zt,N,gt,pt,O,$,w.data)}L.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,mt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Tt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Et)}}function j(L,w,O){let $=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&($=i.TEXTURE_3D);const nt=ie(L,w),q=w.source;e.bindTexture($,L.__webglTexture,i.TEXTURE0+O);const Pt=n.get(q);if(q.version!==Pt.__version||nt===!0){e.activeTexture(i.TEXTURE0+O);const mt=se.getPrimaries(se.workingColorSpace),Tt=w.colorSpace===ti?null:se.getPrimaries(w.colorSpace),Et=w.colorSpace===ti||mt===Tt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);let rt=S(w.image,!1,s.maxTextureSize);rt=ot(w,rt);const ct=r.convert(w.format,w.colorSpace),Ft=r.convert(w.type);let It=v(w.internalFormat,ct,Ft,w.colorSpace,w.isVideoTexture);jt($,w);let yt;const zt=w.mipmaps,N=w.isVideoTexture!==!0,gt=Pt.__version===void 0||nt===!0,pt=q.dataReady,ut=E(w,rt);if(w.isDepthTexture)It=y(w.format===Os,w.type),gt&&(N?e.texStorage2D(i.TEXTURE_2D,1,It,rt.width,rt.height):e.texImage2D(i.TEXTURE_2D,0,It,rt.width,rt.height,0,ct,Ft,null));else if(w.isDataTexture)if(zt.length>0){N&&gt&&e.texStorage2D(i.TEXTURE_2D,ut,It,zt[0].width,zt[0].height);for(let at=0,et=zt.length;at<et;at++)yt=zt[at],N?pt&&e.texSubImage2D(i.TEXTURE_2D,at,0,0,yt.width,yt.height,ct,Ft,yt.data):e.texImage2D(i.TEXTURE_2D,at,It,yt.width,yt.height,0,ct,Ft,yt.data);w.generateMipmaps=!1}else N?(gt&&e.texStorage2D(i.TEXTURE_2D,ut,It,rt.width,rt.height),pt&&xe(w,rt,ct,Ft)):e.texImage2D(i.TEXTURE_2D,0,It,rt.width,rt.height,0,ct,Ft,rt.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){N&&gt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ut,It,zt[0].width,zt[0].height,rt.depth);for(let at=0,et=zt.length;at<et;at++)if(yt=zt[at],w.format!==vn)if(ct!==null)if(N){if(pt)if(w.layerUpdates.size>0){const Ct=nl(yt.width,yt.height,w.format,w.type);for(const Zt of w.layerUpdates){const ye=yt.data.subarray(Zt*Ct/yt.data.BYTES_PER_ELEMENT,(Zt+1)*Ct/yt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,Zt,yt.width,yt.height,1,ct,ye)}w.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,0,yt.width,yt.height,rt.depth,ct,yt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,at,It,yt.width,yt.height,rt.depth,0,yt.data,0,0);else Yt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?pt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,0,yt.width,yt.height,rt.depth,ct,Ft,yt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,at,It,yt.width,yt.height,rt.depth,0,ct,Ft,yt.data)}else{N&&gt&&e.texStorage2D(i.TEXTURE_2D,ut,It,zt[0].width,zt[0].height);for(let at=0,et=zt.length;at<et;at++)yt=zt[at],w.format!==vn?ct!==null?N?pt&&e.compressedTexSubImage2D(i.TEXTURE_2D,at,0,0,yt.width,yt.height,ct,yt.data):e.compressedTexImage2D(i.TEXTURE_2D,at,It,yt.width,yt.height,0,yt.data):Yt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?pt&&e.texSubImage2D(i.TEXTURE_2D,at,0,0,yt.width,yt.height,ct,Ft,yt.data):e.texImage2D(i.TEXTURE_2D,at,It,yt.width,yt.height,0,ct,Ft,yt.data)}else if(w.isDataArrayTexture)if(N){if(gt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ut,It,rt.width,rt.height,rt.depth),pt)if(w.layerUpdates.size>0){const at=nl(rt.width,rt.height,w.format,w.type);for(const et of w.layerUpdates){const Ct=rt.data.subarray(et*at/rt.data.BYTES_PER_ELEMENT,(et+1)*at/rt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,et,rt.width,rt.height,1,ct,Ft,Ct)}w.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,ct,Ft,rt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,It,rt.width,rt.height,rt.depth,0,ct,Ft,rt.data);else if(w.isData3DTexture)N?(gt&&e.texStorage3D(i.TEXTURE_3D,ut,It,rt.width,rt.height,rt.depth),pt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,ct,Ft,rt.data)):e.texImage3D(i.TEXTURE_3D,0,It,rt.width,rt.height,rt.depth,0,ct,Ft,rt.data);else if(w.isFramebufferTexture){if(gt)if(N)e.texStorage2D(i.TEXTURE_2D,ut,It,rt.width,rt.height);else{let at=rt.width,et=rt.height;for(let Ct=0;Ct<ut;Ct++)e.texImage2D(i.TEXTURE_2D,Ct,It,at,et,0,ct,Ft,null),at>>=1,et>>=1}}else if(zt.length>0){if(N&&gt){const at=St(zt[0]);e.texStorage2D(i.TEXTURE_2D,ut,It,at.width,at.height)}for(let at=0,et=zt.length;at<et;at++)yt=zt[at],N?pt&&e.texSubImage2D(i.TEXTURE_2D,at,0,0,ct,Ft,yt):e.texImage2D(i.TEXTURE_2D,at,It,ct,Ft,yt);w.generateMipmaps=!1}else if(N){if(gt){const at=St(rt);e.texStorage2D(i.TEXTURE_2D,ut,It,at.width,at.height)}pt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ct,Ft,rt)}else e.texImage2D(i.TEXTURE_2D,0,It,ct,Ft,rt);m(w)&&h($),Pt.__version=q.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function it(L,w,O){if(w.image.length!==6)return;const $=ie(L,w),nt=w.source;e.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+O);const q=n.get(nt);if(nt.version!==q.__version||$===!0){e.activeTexture(i.TEXTURE0+O);const Pt=se.getPrimaries(se.workingColorSpace),mt=w.colorSpace===ti?null:se.getPrimaries(w.colorSpace),Tt=w.colorSpace===ti||Pt===mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);const Et=w.isCompressedTexture||w.image[0].isCompressedTexture,rt=w.image[0]&&w.image[0].isDataTexture,ct=[];for(let et=0;et<6;et++)!Et&&!rt?ct[et]=S(w.image[et],!0,s.maxCubemapSize):ct[et]=rt?w.image[et].image:w.image[et],ct[et]=ot(w,ct[et]);const Ft=ct[0],It=r.convert(w.format,w.colorSpace),yt=r.convert(w.type),zt=v(w.internalFormat,It,yt,w.colorSpace),N=w.isVideoTexture!==!0,gt=q.__version===void 0||$===!0,pt=nt.dataReady;let ut=E(w,Ft);jt(i.TEXTURE_CUBE_MAP,w);let at;if(Et){N&&gt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ut,zt,Ft.width,Ft.height);for(let et=0;et<6;et++){at=ct[et].mipmaps;for(let Ct=0;Ct<at.length;Ct++){const Zt=at[Ct];w.format!==vn?It!==null?N?pt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct,0,0,Zt.width,Zt.height,It,Zt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct,zt,Zt.width,Zt.height,0,Zt.data):Yt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct,0,0,Zt.width,Zt.height,It,yt,Zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct,zt,Zt.width,Zt.height,0,It,yt,Zt.data)}}}else{if(at=w.mipmaps,N&&gt){at.length>0&&ut++;const et=St(ct[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ut,zt,et.width,et.height)}for(let et=0;et<6;et++)if(rt){N?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,ct[et].width,ct[et].height,It,yt,ct[et].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,zt,ct[et].width,ct[et].height,0,It,yt,ct[et].data);for(let Ct=0;Ct<at.length;Ct++){const ye=at[Ct].image[et].image;N?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct+1,0,0,ye.width,ye.height,It,yt,ye.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct+1,zt,ye.width,ye.height,0,It,yt,ye.data)}}else{N?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,It,yt,ct[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,zt,It,yt,ct[et]);for(let Ct=0;Ct<at.length;Ct++){const Zt=at[Ct];N?pt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct+1,0,0,It,yt,Zt.image[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Ct+1,zt,It,yt,Zt.image[et])}}}m(w)&&h(i.TEXTURE_CUBE_MAP),q.__version=nt.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function wt(L,w,O,$,nt,q){const Pt=r.convert(O.format,O.colorSpace),mt=r.convert(O.type),Tt=v(O.internalFormat,Pt,mt,O.colorSpace),Et=n.get(w),rt=n.get(O);if(rt.__renderTarget=w,!Et.__hasExternalTextures){const ct=Math.max(1,w.width>>q),Ft=Math.max(1,w.height>>q);nt===i.TEXTURE_3D||nt===i.TEXTURE_2D_ARRAY?e.texImage3D(nt,q,Tt,ct,Ft,w.depth,0,Pt,mt,null):e.texImage2D(nt,q,Tt,ct,Ft,0,Pt,mt,null)}e.bindFramebuffer(i.FRAMEBUFFER,L),st(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,nt,rt.__webglTexture,0,lt(w)):(nt===i.TEXTURE_2D||nt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,nt,rt.__webglTexture,q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Gt(L,w,O){if(i.bindRenderbuffer(i.RENDERBUFFER,L),w.depthBuffer){const $=w.depthTexture,nt=$&&$.isDepthTexture?$.type:null,q=y(w.stencilBuffer,nt),Pt=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,mt=lt(w);st(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,mt,q,w.width,w.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,mt,q,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,q,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Pt,i.RENDERBUFFER,L)}else{const $=w.textures;for(let nt=0;nt<$.length;nt++){const q=$[nt],Pt=r.convert(q.format,q.colorSpace),mt=r.convert(q.type),Tt=v(q.internalFormat,Pt,mt,q.colorSpace),Et=lt(w);O&&st(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Et,Tt,w.width,w.height):st(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Et,Tt,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,Tt,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Dt(L,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,L),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(w.depthTexture);$.__renderTarget=w,(!$.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),V(w.depthTexture,0);const nt=$.__webglTexture,q=lt(w);if(w.depthTexture.format===Fs)st(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,nt,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,nt,0);else if(w.depthTexture.format===Os)st(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,nt,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,nt,0);else throw new Error("Unknown depthTexture format")}function qt(L){const w=n.get(L),O=L.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==L.depthTexture){const $=L.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),$){const nt=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,$.removeEventListener("dispose",nt)};$.addEventListener("dispose",nt),w.__depthDisposeCallback=nt}w.__boundDepthTexture=$}if(L.depthTexture&&!w.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const $=L.texture.mipmaps;$&&$.length>0?Dt(w.__webglFramebuffer[0],L):Dt(w.__webglFramebuffer,L)}else if(O){w.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[$]),w.__webglDepthbuffer[$]===void 0)w.__webglDepthbuffer[$]=i.createRenderbuffer(),Gt(w.__webglDepthbuffer[$],L,!1);else{const nt=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=w.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,nt,i.RENDERBUFFER,q)}}else{const $=L.texture.mipmaps;if($&&$.length>0?e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),Gt(w.__webglDepthbuffer,L,!1);else{const nt=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,nt,i.RENDERBUFFER,q)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ue(L,w,O){const $=n.get(L);w!==void 0&&wt($.__webglFramebuffer,L,L.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&qt(L)}function Jt(L){const w=L.texture,O=n.get(L),$=n.get(w);L.addEventListener("dispose",P);const nt=L.textures,q=L.isWebGLCubeRenderTarget===!0,Pt=nt.length>1;if(Pt||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=w.version,a.memory.textures++),q){O.__webglFramebuffer=[];for(let mt=0;mt<6;mt++)if(w.mipmaps&&w.mipmaps.length>0){O.__webglFramebuffer[mt]=[];for(let Tt=0;Tt<w.mipmaps.length;Tt++)O.__webglFramebuffer[mt][Tt]=i.createFramebuffer()}else O.__webglFramebuffer[mt]=i.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){O.__webglFramebuffer=[];for(let mt=0;mt<w.mipmaps.length;mt++)O.__webglFramebuffer[mt]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(Pt)for(let mt=0,Tt=nt.length;mt<Tt;mt++){const Et=n.get(nt[mt]);Et.__webglTexture===void 0&&(Et.__webglTexture=i.createTexture(),a.memory.textures++)}if(L.samples>0&&st(L)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let mt=0;mt<nt.length;mt++){const Tt=nt[mt];O.__webglColorRenderbuffer[mt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[mt]);const Et=r.convert(Tt.format,Tt.colorSpace),rt=r.convert(Tt.type),ct=v(Tt.internalFormat,Et,rt,Tt.colorSpace,L.isXRRenderTarget===!0),Ft=lt(L);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ft,ct,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,O.__webglColorRenderbuffer[mt])}i.bindRenderbuffer(i.RENDERBUFFER,null),L.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Gt(O.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),jt(i.TEXTURE_CUBE_MAP,w);for(let mt=0;mt<6;mt++)if(w.mipmaps&&w.mipmaps.length>0)for(let Tt=0;Tt<w.mipmaps.length;Tt++)wt(O.__webglFramebuffer[mt][Tt],L,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,Tt);else wt(O.__webglFramebuffer[mt],L,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0);m(w)&&h(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Pt){for(let mt=0,Tt=nt.length;mt<Tt;mt++){const Et=nt[mt],rt=n.get(Et);let ct=i.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ct=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ct,rt.__webglTexture),jt(ct,Et),wt(O.__webglFramebuffer,L,Et,i.COLOR_ATTACHMENT0+mt,ct,0),m(Et)&&h(ct)}e.unbindTexture()}else{let mt=i.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(mt=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(mt,$.__webglTexture),jt(mt,w),w.mipmaps&&w.mipmaps.length>0)for(let Tt=0;Tt<w.mipmaps.length;Tt++)wt(O.__webglFramebuffer[Tt],L,w,i.COLOR_ATTACHMENT0,mt,Tt);else wt(O.__webglFramebuffer,L,w,i.COLOR_ATTACHMENT0,mt,0);m(w)&&h(mt),e.unbindTexture()}L.depthBuffer&&qt(L)}function le(L){const w=L.textures;for(let O=0,$=w.length;O<$;O++){const nt=w[O];if(m(nt)){const q=M(L),Pt=n.get(nt).__webglTexture;e.bindTexture(q,Pt),h(q),e.unbindTexture()}}}const U=[],Q=[];function Z(L){if(L.samples>0){if(st(L)===!1){const w=L.textures,O=L.width,$=L.height;let nt=i.COLOR_BUFFER_BIT;const q=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Pt=n.get(L),mt=w.length>1;if(mt)for(let Et=0;Et<w.length;Et++)e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Pt.__webglMultisampledFramebuffer);const Tt=L.texture.mipmaps;Tt&&Tt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pt.__webglFramebuffer);for(let Et=0;Et<w.length;Et++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(nt|=i.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(nt|=i.STENCIL_BUFFER_BIT)),mt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Pt.__webglColorRenderbuffer[Et]);const rt=n.get(w[Et]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,rt,0)}i.blitFramebuffer(0,0,O,$,0,0,O,$,nt,i.NEAREST),c===!0&&(U.length=0,Q.length=0,U.push(i.COLOR_ATTACHMENT0+Et),L.depthBuffer&&L.resolveDepthBuffer===!1&&(U.push(q),Q.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Q)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,U))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),mt)for(let Et=0;Et<w.length;Et++){e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,Pt.__webglColorRenderbuffer[Et]);const rt=n.get(w[Et]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,rt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pt.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const w=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function lt(L){return Math.min(s.maxSamples,L.samples)}function st(L){const w=n.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function xt(L){const w=a.render.frame;d.get(L)!==w&&(d.set(L,w),L.update())}function ot(L,w){const O=L.colorSpace,$=L.format,nt=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||O!==es&&O!==ti&&(se.getTransfer(O)===fe?($!==vn||nt!==Dn)&&Yt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Pe("WebGLTextures: Unsupported texture color space:",O)),w}function St(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=F,this.resetTextureUnits=D,this.setTexture2D=V,this.setTexture2DArray=H,this.setTexture3D=tt,this.setTextureCube=X,this.rebindTextures=Ue,this.setupRenderTarget=Jt,this.updateRenderTargetMipmap=le,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=qt,this.setupFrameBufferTexture=wt,this.useMultisampledRTT=st}function Xx(i,t){function e(n,s=ti){let r;const a=se.getTransfer(s);if(n===Dn)return i.UNSIGNED_BYTE;if(n===Do)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Io)return i.UNSIGNED_SHORT_5_5_5_1;if(n===jl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ql)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Kl)return i.BYTE;if(n===Jl)return i.SHORT;if(n===Us)return i.UNSIGNED_SHORT;if(n===Lo)return i.INT;if(n===bi)return i.UNSIGNED_INT;if(n===Cn)return i.FLOAT;if(n===Ln)return i.HALF_FLOAT;if(n===th)return i.ALPHA;if(n===eh)return i.RGB;if(n===vn)return i.RGBA;if(n===Fs)return i.DEPTH_COMPONENT;if(n===Os)return i.DEPTH_STENCIL;if(n===Uo)return i.RED;if(n===No)return i.RED_INTEGER;if(n===Fo)return i.RG;if(n===Oo)return i.RG_INTEGER;if(n===Bo)return i.RGBA_INTEGER;if(n===br||n===wr||n===Tr||n===Er)if(a===fe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===br)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===br)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===wr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Tr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Er)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Xa||n===qa||n===Ya||n===Za)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Xa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===qa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ya)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Za)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===$a||n===Ka||n===Ja)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===$a||n===Ka)return a===fe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ja)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ja||n===Qa||n===to||n===eo||n===no||n===io||n===so||n===ro||n===ao||n===oo||n===co||n===lo||n===ho||n===uo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ja)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Qa)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===to)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===eo)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===no)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===io)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===so)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ro)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ao)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===oo)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===co)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===lo)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ho)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===uo)return a===fe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===fo||n===po||n===mo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===fo)return a===fe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===po)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===mo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===xo||n===go||n===_o||n===vo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===xo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===go)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===_o)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===vo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ns?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const qx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Yx=`
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

}`;class Zx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new ph(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Ge({vertexShader:qx,fragmentShader:Yx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Y(new De(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class $x extends as{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,u=null,f=null,p=null,g=null;const S=typeof XRWebGLBinding<"u",m=new Zx,h={},M=e.getContextAttributes();let v=null,y=null;const E=[],T=[],P=new _t;let C=null;const b=new tn;b.viewport=new ve;const _=new tn;_.viewport=new ve;const A=[b,_],D=new ff;let F=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let it=E[j];return it===void 0&&(it=new ma,E[j]=it),it.getTargetRaySpace()},this.getControllerGrip=function(j){let it=E[j];return it===void 0&&(it=new ma,E[j]=it),it.getGripSpace()},this.getHand=function(j){let it=E[j];return it===void 0&&(it=new ma,E[j]=it),it.getHandSpace()};function V(j){const it=T.indexOf(j.inputSource);if(it===-1)return;const wt=E[it];wt!==void 0&&(wt.update(j.inputSource,j.frame,l||a),wt.dispatchEvent({type:j.type,data:j.inputSource}))}function H(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",tt);for(let j=0;j<E.length;j++){const it=T[j];it!==null&&(T[j]=null,E[j].disconnect(it))}F=null,k=null,m.reset();for(const j in h)delete h[j];t.setRenderTarget(v),p=null,f=null,u=null,s=null,y=null,xe.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&Yt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,n.isPresenting===!0&&Yt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u===null&&S&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(v=t.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",H),s.addEventListener("inputsourceschange",tt),M.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(P),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let wt=null,Gt=null,Dt=null;M.depth&&(Dt=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,wt=M.stencil?Os:Fs,Gt=M.stencil?Ns:bi);const qt={colorFormat:e.RGBA8,depthFormat:Dt,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(qt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),y=new Mn(f.textureWidth,f.textureHeight,{format:vn,type:Dn,depthTexture:new fh(f.textureWidth,f.textureHeight,Gt,void 0,void 0,void 0,void 0,void 0,void 0,wt),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const wt={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,wt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new Mn(p.framebufferWidth,p.framebufferHeight,{format:vn,type:Dn,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),xe.setContext(s),xe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function tt(j){for(let it=0;it<j.removed.length;it++){const wt=j.removed[it],Gt=T.indexOf(wt);Gt>=0&&(T[Gt]=null,E[Gt].disconnect(wt))}for(let it=0;it<j.added.length;it++){const wt=j.added[it];let Gt=T.indexOf(wt);if(Gt===-1){for(let qt=0;qt<E.length;qt++)if(qt>=T.length){T.push(wt),Gt=qt;break}else if(T[qt]===null){T[qt]=wt,Gt=qt;break}if(Gt===-1)break}const Dt=E[Gt];Dt&&Dt.connect(wt)}}const X=new I,ht=new I;function dt(j,it,wt){X.setFromMatrixPosition(it.matrixWorld),ht.setFromMatrixPosition(wt.matrixWorld);const Gt=X.distanceTo(ht),Dt=it.projectionMatrix.elements,qt=wt.projectionMatrix.elements,Ue=Dt[14]/(Dt[10]-1),Jt=Dt[14]/(Dt[10]+1),le=(Dt[9]+1)/Dt[5],U=(Dt[9]-1)/Dt[5],Q=(Dt[8]-1)/Dt[0],Z=(qt[8]+1)/qt[0],lt=Ue*Q,st=Ue*Z,xt=Gt/(-Q+Z),ot=xt*-Q;if(it.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(ot),j.translateZ(xt),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Dt[10]===-1)j.projectionMatrix.copy(it.projectionMatrix),j.projectionMatrixInverse.copy(it.projectionMatrixInverse);else{const St=Ue+xt,L=Jt+xt,w=lt-ot,O=st+(Gt-ot),$=le*Jt/L*St,nt=U*Jt/L*St;j.projectionMatrix.makePerspective(w,O,$,nt,St,L),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function Lt(j,it){it===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(it.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let it=j.near,wt=j.far;m.texture!==null&&(m.depthNear>0&&(it=m.depthNear),m.depthFar>0&&(wt=m.depthFar)),D.near=_.near=b.near=it,D.far=_.far=b.far=wt,(F!==D.near||k!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),F=D.near,k=D.far),D.layers.mask=j.layers.mask|6,b.layers.mask=D.layers.mask&3,_.layers.mask=D.layers.mask&5;const Gt=j.parent,Dt=D.cameras;Lt(D,Gt);for(let qt=0;qt<Dt.length;qt++)Lt(Dt[qt],Gt);Dt.length===2?dt(D,b,_):D.projectionMatrix.copy(b.projectionMatrix),jt(j,D,Gt)};function jt(j,it,wt){wt===null?j.matrix.copy(it.matrixWorld):(j.matrix.copy(wt.matrixWorld),j.matrix.invert(),j.matrix.multiply(it.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(it.projectionMatrix),j.projectionMatrixInverse.copy(it.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=zs*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(j){c=j,f!==null&&(f.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(D)},this.getCameraTexture=function(j){return h[j]};let ie=null;function me(j,it){if(d=it.getViewerPose(l||a),g=it,d!==null){const wt=d.views;p!==null&&(t.setRenderTargetFramebuffer(y,p.framebuffer),t.setRenderTarget(y));let Gt=!1;wt.length!==D.cameras.length&&(D.cameras.length=0,Gt=!0);for(let Jt=0;Jt<wt.length;Jt++){const le=wt[Jt];let U=null;if(p!==null)U=p.getViewport(le);else{const Z=u.getViewSubImage(f,le);U=Z.viewport,Jt===0&&(t.setRenderTargetTextures(y,Z.colorTexture,Z.depthStencilTexture),t.setRenderTarget(y))}let Q=A[Jt];Q===void 0&&(Q=new tn,Q.layers.enable(Jt),Q.viewport=new ve,A[Jt]=Q),Q.matrix.fromArray(le.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(le.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(U.x,U.y,U.width,U.height),Jt===0&&(D.matrix.copy(Q.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),Gt===!0&&D.cameras.push(Q)}const Dt=s.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&S){u=n.getBinding();const Jt=u.getDepthInformation(wt[0]);Jt&&Jt.isValid&&Jt.texture&&m.init(Jt,s.renderState)}if(Dt&&Dt.includes("camera-access")&&S){t.state.unbindTexture(),u=n.getBinding();for(let Jt=0;Jt<wt.length;Jt++){const le=wt[Jt].camera;if(le){let U=h[le];U||(U=new ph,h[le]=U);const Q=u.getCameraImage(le);U.sourceTexture=Q}}}}for(let wt=0;wt<E.length;wt++){const Gt=T[wt],Dt=E[wt];Gt!==null&&Dt!==void 0&&Dt.update(Gt,it,l||a)}ie&&ie(j,it),it.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:it}),g=null}const xe=new Ah;xe.setAnimationLoop(me),this.setAnimationLoop=function(j){ie=j},this.dispose=function(){}}}const pi=new bn,Kx=new he;function Jx(i,t){function e(m,h){m.matrixAutoUpdate===!0&&m.updateMatrix(),h.value.copy(m.matrix)}function n(m,h){h.color.getRGB(m.fogColor.value,ch(i)),h.isFog?(m.fogNear.value=h.near,m.fogFar.value=h.far):h.isFogExp2&&(m.fogDensity.value=h.density)}function s(m,h,M,v,y){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(m,h):h.isMeshToonMaterial?(r(m,h),u(m,h)):h.isMeshPhongMaterial?(r(m,h),d(m,h)):h.isMeshStandardMaterial?(r(m,h),f(m,h),h.isMeshPhysicalMaterial&&p(m,h,y)):h.isMeshMatcapMaterial?(r(m,h),g(m,h)):h.isMeshDepthMaterial?r(m,h):h.isMeshDistanceMaterial?(r(m,h),S(m,h)):h.isMeshNormalMaterial?r(m,h):h.isLineBasicMaterial?(a(m,h),h.isLineDashedMaterial&&o(m,h)):h.isPointsMaterial?c(m,h,M,v):h.isSpriteMaterial?l(m,h):h.isShadowMaterial?(m.color.value.copy(h.color),m.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(m,h){m.opacity.value=h.opacity,h.color&&m.diffuse.value.copy(h.color),h.emissive&&m.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(m.map.value=h.map,e(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,e(h.alphaMap,m.alphaMapTransform)),h.bumpMap&&(m.bumpMap.value=h.bumpMap,e(h.bumpMap,m.bumpMapTransform),m.bumpScale.value=h.bumpScale,h.side===He&&(m.bumpScale.value*=-1)),h.normalMap&&(m.normalMap.value=h.normalMap,e(h.normalMap,m.normalMapTransform),m.normalScale.value.copy(h.normalScale),h.side===He&&m.normalScale.value.negate()),h.displacementMap&&(m.displacementMap.value=h.displacementMap,e(h.displacementMap,m.displacementMapTransform),m.displacementScale.value=h.displacementScale,m.displacementBias.value=h.displacementBias),h.emissiveMap&&(m.emissiveMap.value=h.emissiveMap,e(h.emissiveMap,m.emissiveMapTransform)),h.specularMap&&(m.specularMap.value=h.specularMap,e(h.specularMap,m.specularMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest);const M=t.get(h),v=M.envMap,y=M.envMapRotation;v&&(m.envMap.value=v,pi.copy(y),pi.x*=-1,pi.y*=-1,pi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),m.envMapRotation.value.setFromMatrix4(Kx.makeRotationFromEuler(pi)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=h.reflectivity,m.ior.value=h.ior,m.refractionRatio.value=h.refractionRatio),h.lightMap&&(m.lightMap.value=h.lightMap,m.lightMapIntensity.value=h.lightMapIntensity,e(h.lightMap,m.lightMapTransform)),h.aoMap&&(m.aoMap.value=h.aoMap,m.aoMapIntensity.value=h.aoMapIntensity,e(h.aoMap,m.aoMapTransform))}function a(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,h.map&&(m.map.value=h.map,e(h.map,m.mapTransform))}function o(m,h){m.dashSize.value=h.dashSize,m.totalSize.value=h.dashSize+h.gapSize,m.scale.value=h.scale}function c(m,h,M,v){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.size.value=h.size*M,m.scale.value=v*.5,h.map&&(m.map.value=h.map,e(h.map,m.uvTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,e(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function l(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.rotation.value=h.rotation,h.map&&(m.map.value=h.map,e(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,e(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function d(m,h){m.specular.value.copy(h.specular),m.shininess.value=Math.max(h.shininess,1e-4)}function u(m,h){h.gradientMap&&(m.gradientMap.value=h.gradientMap)}function f(m,h){m.metalness.value=h.metalness,h.metalnessMap&&(m.metalnessMap.value=h.metalnessMap,e(h.metalnessMap,m.metalnessMapTransform)),m.roughness.value=h.roughness,h.roughnessMap&&(m.roughnessMap.value=h.roughnessMap,e(h.roughnessMap,m.roughnessMapTransform)),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)}function p(m,h,M){m.ior.value=h.ior,h.sheen>0&&(m.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),m.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(m.sheenColorMap.value=h.sheenColorMap,e(h.sheenColorMap,m.sheenColorMapTransform)),h.sheenRoughnessMap&&(m.sheenRoughnessMap.value=h.sheenRoughnessMap,e(h.sheenRoughnessMap,m.sheenRoughnessMapTransform))),h.clearcoat>0&&(m.clearcoat.value=h.clearcoat,m.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(m.clearcoatMap.value=h.clearcoatMap,e(h.clearcoatMap,m.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,e(h.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(m.clearcoatNormalMap.value=h.clearcoatNormalMap,e(h.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===He&&m.clearcoatNormalScale.value.negate())),h.dispersion>0&&(m.dispersion.value=h.dispersion),h.iridescence>0&&(m.iridescence.value=h.iridescence,m.iridescenceIOR.value=h.iridescenceIOR,m.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(m.iridescenceMap.value=h.iridescenceMap,e(h.iridescenceMap,m.iridescenceMapTransform)),h.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=h.iridescenceThicknessMap,e(h.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),h.transmission>0&&(m.transmission.value=h.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),h.transmissionMap&&(m.transmissionMap.value=h.transmissionMap,e(h.transmissionMap,m.transmissionMapTransform)),m.thickness.value=h.thickness,h.thicknessMap&&(m.thicknessMap.value=h.thicknessMap,e(h.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=h.attenuationDistance,m.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(m.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(m.anisotropyMap.value=h.anisotropyMap,e(h.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=h.specularIntensity,m.specularColor.value.copy(h.specularColor),h.specularColorMap&&(m.specularColorMap.value=h.specularColorMap,e(h.specularColorMap,m.specularColorMapTransform)),h.specularIntensityMap&&(m.specularIntensityMap.value=h.specularIntensityMap,e(h.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,h){h.matcap&&(m.matcap.value=h.matcap)}function S(m,h){const M=t.get(h).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function jx(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,v){const y=v.program;n.uniformBlockBinding(M,y)}function l(M,v){let y=s[M.id];y===void 0&&(g(M),y=d(M),s[M.id]=y,M.addEventListener("dispose",m));const E=v.program;n.updateUBOMapping(M,E);const T=t.render.frame;r[M.id]!==T&&(f(M),r[M.id]=T)}function d(M){const v=u();M.__bindingPointIndex=v;const y=i.createBuffer(),E=M.__size,T=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,E,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,y),y}function u(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return Pe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){const v=s[M.id],y=M.uniforms,E=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let T=0,P=y.length;T<P;T++){const C=Array.isArray(y[T])?y[T]:[y[T]];for(let b=0,_=C.length;b<_;b++){const A=C[b];if(p(A,T,b,E)===!0){const D=A.__offset,F=Array.isArray(A.value)?A.value:[A.value];let k=0;for(let V=0;V<F.length;V++){const H=F[V],tt=S(H);typeof H=="number"||typeof H=="boolean"?(A.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,D+k,A.__data)):H.isMatrix3?(A.__data[0]=H.elements[0],A.__data[1]=H.elements[1],A.__data[2]=H.elements[2],A.__data[3]=0,A.__data[4]=H.elements[3],A.__data[5]=H.elements[4],A.__data[6]=H.elements[5],A.__data[7]=0,A.__data[8]=H.elements[6],A.__data[9]=H.elements[7],A.__data[10]=H.elements[8],A.__data[11]=0):(H.toArray(A.__data,k),k+=tt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,D,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(M,v,y,E){const T=M.value,P=v+"_"+y;if(E[P]===void 0)return typeof T=="number"||typeof T=="boolean"?E[P]=T:E[P]=T.clone(),!0;{const C=E[P];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return E[P]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(M){const v=M.uniforms;let y=0;const E=16;for(let P=0,C=v.length;P<C;P++){const b=Array.isArray(v[P])?v[P]:[v[P]];for(let _=0,A=b.length;_<A;_++){const D=b[_],F=Array.isArray(D.value)?D.value:[D.value];for(let k=0,V=F.length;k<V;k++){const H=F[k],tt=S(H),X=y%E,ht=X%tt.boundary,dt=X+ht;y+=ht,dt!==0&&E-dt<tt.storage&&(y+=E-dt),D.__data=new Float32Array(tt.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=y,y+=tt.storage}}}const T=y%E;return T>0&&(y+=E-T),M.__size=y,M.__cache={},this}function S(M){const v={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(v.boundary=4,v.storage=4):M.isVector2?(v.boundary=8,v.storage=8):M.isVector3||M.isColor?(v.boundary=16,v.storage=12):M.isVector4?(v.boundary=16,v.storage=16):M.isMatrix3?(v.boundary=48,v.storage=48):M.isMatrix4?(v.boundary=64,v.storage=64):M.isTexture?Yt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Yt("WebGLRenderer: Unsupported uniform value type.",M),v}function m(M){const v=M.target;v.removeEventListener("dispose",m);const y=a.indexOf(v.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function h(){for(const M in s)i.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:c,update:l,dispose:h}}const Qx=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let zn=null;function tg(){return zn===null&&(zn=new uh(Qx,32,32,Fo,Ln),zn.minFilter=ln,zn.magFilter=ln,zn.wrapS=Gn,zn.wrapT=Gn,zn.generateMipmaps=!1,zn.needsUpdate=!0),zn}class eg{constructor(t={}){const{canvas:e=Fd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=new Set([Bo,Oo,No]),S=new Set([Dn,bi,Us,Ns,Do,Io]),m=new Uint32Array(4),h=new Int32Array(4);let M=null,v=null;const y=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=si,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let P=!1;this._outputColorSpace=be;let C=0,b=0,_=null,A=-1,D=null;const F=new ve,k=new ve;let V=null;const H=new Xt(0);let tt=0,X=e.width,ht=e.height,dt=1,Lt=null,jt=null;const ie=new ve(0,0,X,ht),me=new ve(0,0,X,ht);let xe=!1;const j=new Xo;let it=!1,wt=!1;const Gt=new he,Dt=new I,qt=new ve,Ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Jt=!1;function le(){return _===null?dt:1}let U=n;function Q(R,B){return e.getContext(R,B)}try{const R={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Co}`),e.addEventListener("webglcontextlost",at,!1),e.addEventListener("webglcontextrestored",et,!1),e.addEventListener("webglcontextcreationerror",Ct,!1),U===null){const B="webgl2";if(U=Q(B,R),U===null)throw Q(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw R("WebGLRenderer: "+R.message),R}let Z,lt,st,xt,ot,St,L,w,O,$,nt,q,Pt,mt,Tt,Et,rt,ct,Ft,It,yt,zt,N,gt;function pt(){Z=new lm(U),Z.init(),zt=new Xx(U,Z),lt=new tm(U,Z,t,zt),st=new Hx(U,Z),lt.reversedDepthBuffer&&f&&st.buffers.depth.setReversed(!0),xt=new um(U),ot=new Px,St=new Wx(U,Z,st,ot,lt,zt,xt),L=new nm(T),w=new cm(T),O=new xf(U),N=new j0(U,O),$=new hm(U,O,xt,N),nt=new pm(U,$,O,xt),Ft=new fm(U,lt,St),Et=new em(ot),q=new Rx(T,L,w,Z,lt,N,Et),Pt=new Jx(T,ot),mt=new Dx,Tt=new Bx(Z),ct=new J0(T,L,w,st,nt,p,c),rt=new Vx(T,nt,lt),gt=new jx(U,xt,lt,st),It=new Q0(U,Z,xt),yt=new dm(U,Z,xt),xt.programs=q.programs,T.capabilities=lt,T.extensions=Z,T.properties=ot,T.renderLists=mt,T.shadowMap=rt,T.state=st,T.info=xt}pt();const ut=new $x(T,U);this.xr=ut,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const R=Z.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=Z.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return dt},this.setPixelRatio=function(R){R!==void 0&&(dt=R,this.setSize(X,ht,!1))},this.getSize=function(R){return R.set(X,ht)},this.setSize=function(R,B,G=!0){if(ut.isPresenting){Yt("WebGLRenderer: Can't change size while VR device is presenting.");return}X=R,ht=B,e.width=Math.floor(R*dt),e.height=Math.floor(B*dt),G===!0&&(e.style.width=R+"px",e.style.height=B+"px"),this.setViewport(0,0,R,B)},this.getDrawingBufferSize=function(R){return R.set(X*dt,ht*dt).floor()},this.setDrawingBufferSize=function(R,B,G){X=R,ht=B,dt=G,e.width=Math.floor(R*G),e.height=Math.floor(B*G),this.setViewport(0,0,R,B)},this.getCurrentViewport=function(R){return R.copy(F)},this.getViewport=function(R){return R.copy(ie)},this.setViewport=function(R,B,G,W){R.isVector4?ie.set(R.x,R.y,R.z,R.w):ie.set(R,B,G,W),st.viewport(F.copy(ie).multiplyScalar(dt).round())},this.getScissor=function(R){return R.copy(me)},this.setScissor=function(R,B,G,W){R.isVector4?me.set(R.x,R.y,R.z,R.w):me.set(R,B,G,W),st.scissor(k.copy(me).multiplyScalar(dt).round())},this.getScissorTest=function(){return xe},this.setScissorTest=function(R){st.setScissorTest(xe=R)},this.setOpaqueSort=function(R){Lt=R},this.setTransparentSort=function(R){jt=R},this.getClearColor=function(R){return R.copy(ct.getClearColor())},this.setClearColor=function(){ct.setClearColor(...arguments)},this.getClearAlpha=function(){return ct.getClearAlpha()},this.setClearAlpha=function(){ct.setClearAlpha(...arguments)},this.clear=function(R=!0,B=!0,G=!0){let W=0;if(R){let z=!1;if(_!==null){const ft=_.texture.format;z=g.has(ft)}if(z){const ft=_.texture.type,bt=S.has(ft),Rt=ct.getClearColor(),At=ct.getClearAlpha(),kt=Rt.r,Ht=Rt.g,Ut=Rt.b;bt?(m[0]=kt,m[1]=Ht,m[2]=Ut,m[3]=At,U.clearBufferuiv(U.COLOR,0,m)):(h[0]=kt,h[1]=Ht,h[2]=Ut,h[3]=At,U.clearBufferiv(U.COLOR,0,h))}else W|=U.COLOR_BUFFER_BIT}B&&(W|=U.DEPTH_BUFFER_BIT),G&&(W|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",at,!1),e.removeEventListener("webglcontextrestored",et,!1),e.removeEventListener("webglcontextcreationerror",Ct,!1),ct.dispose(),mt.dispose(),Tt.dispose(),ot.dispose(),L.dispose(),w.dispose(),nt.dispose(),N.dispose(),gt.dispose(),q.dispose(),ut.dispose(),ut.removeEventListener("sessionstart",ac),ut.removeEventListener("sessionend",oc),oi.stop()};function at(R){R.preventDefault(),Mc("WebGLRenderer: Context Lost."),P=!0}function et(){Mc("WebGLRenderer: Context Restored."),P=!1;const R=xt.autoReset,B=rt.enabled,G=rt.autoUpdate,W=rt.needsUpdate,z=rt.type;pt(),xt.autoReset=R,rt.enabled=B,rt.autoUpdate=G,rt.needsUpdate=W,rt.type=z}function Ct(R){Pe("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Zt(R){const B=R.target;B.removeEventListener("dispose",Zt),ye(B)}function ye(R){ge(R),ot.remove(R)}function ge(R){const B=ot.get(R).programs;B!==void 0&&(B.forEach(function(G){q.releaseProgram(G)}),R.isShaderMaterial&&q.releaseShaderCache(R))}this.renderBufferDirect=function(R,B,G,W,z,ft){B===null&&(B=Ue);const bt=z.isMesh&&z.matrixWorld.determinant()<0,Rt=Jh(R,B,G,W,z);st.setMaterial(W,bt);let At=G.index,kt=1;if(W.wireframe===!0){if(At=$.getWireframeAttribute(G),At===void 0)return;kt=2}const Ht=G.drawRange,Ut=G.attributes.position;let ne=Ht.start*kt,_e=(Ht.start+Ht.count)*kt;ft!==null&&(ne=Math.max(ne,ft.start*kt),_e=Math.min(_e,(ft.start+ft.count)*kt)),At!==null?(ne=Math.max(ne,0),_e=Math.min(_e,At.count)):Ut!=null&&(ne=Math.max(ne,0),_e=Math.min(_e,Ut.count));const Ce=_e-ne;if(Ce<0||Ce===1/0)return;N.setup(z,W,Rt,G,At);let Re,Me=It;if(At!==null&&(Re=O.get(At),Me=yt,Me.setIndex(Re)),z.isMesh)W.wireframe===!0?(st.setLineWidth(W.wireframeLinewidth*le()),Me.setMode(U.LINES)):Me.setMode(U.TRIANGLES);else if(z.isLine){let Ot=W.linewidth;Ot===void 0&&(Ot=1),st.setLineWidth(Ot*le()),z.isLineSegments?Me.setMode(U.LINES):z.isLineLoop?Me.setMode(U.LINE_LOOP):Me.setMode(U.LINE_STRIP)}else z.isPoints?Me.setMode(U.POINTS):z.isSprite&&Me.setMode(U.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)Bs("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Me.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(Z.get("WEBGL_multi_draw"))Me.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Ot=z._multiDrawStarts,Te=z._multiDrawCounts,ae=z._multiDrawCount,Ke=At?O.get(At).bytesPerElement:1,Ri=ot.get(W).currentProgram.getUniforms();for(let Je=0;Je<ae;Je++)Ri.setValue(U,"_gl_DrawID",Je),Me.render(Ot[Je]/Ke,Te[Je])}else if(z.isInstancedMesh)Me.renderInstances(ne,Ce,z.count);else if(G.isInstancedBufferGeometry){const Ot=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Te=Math.min(G.instanceCount,Ot);Me.renderInstances(ne,Ce,Te)}else Me.render(ne,Ce)};function En(R,B,G){R.transparent===!0&&R.side===ue&&R.forceSinglePass===!1?(R.side=He,R.needsUpdate=!0,Ys(R,B,G),R.side=ai,R.needsUpdate=!0,Ys(R,B,G),R.side=ue):Ys(R,B,G)}this.compile=function(R,B,G=null){G===null&&(G=R),v=Tt.get(G),v.init(B),E.push(v),G.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(v.pushLight(z),z.castShadow&&v.pushShadow(z))}),R!==G&&R.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(v.pushLight(z),z.castShadow&&v.pushShadow(z))}),v.setupLights();const W=new Set;return R.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const ft=z.material;if(ft)if(Array.isArray(ft))for(let bt=0;bt<ft.length;bt++){const Rt=ft[bt];En(Rt,G,z),W.add(Rt)}else En(ft,G,z),W.add(ft)}),v=E.pop(),W},this.compileAsync=function(R,B,G=null){const W=this.compile(R,B,G);return new Promise(z=>{function ft(){if(W.forEach(function(bt){ot.get(bt).currentProgram.isReady()&&W.delete(bt)}),W.size===0){z(R);return}setTimeout(ft,10)}Z.get("KHR_parallel_shader_compile")!==null?ft():setTimeout(ft,10)})};let dn=null;function Kh(R){dn&&dn(R)}function ac(){oi.stop()}function oc(){oi.start()}const oi=new Ah;oi.setAnimationLoop(Kh),typeof self<"u"&&oi.setContext(self),this.setAnimationLoop=function(R){dn=R,ut.setAnimationLoop(R),R===null?oi.stop():oi.start()},ut.addEventListener("sessionstart",ac),ut.addEventListener("sessionend",oc),this.render=function(R,B){if(B!==void 0&&B.isCamera!==!0){Pe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),ut.enabled===!0&&ut.isPresenting===!0&&(ut.cameraAutoUpdate===!0&&ut.updateCamera(B),B=ut.getCamera()),R.isScene===!0&&R.onBeforeRender(T,R,B,_),v=Tt.get(R,E.length),v.init(B),E.push(v),Gt.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),j.setFromProjectionMatrix(Gt,Rn,B.reversedDepth),wt=this.localClippingEnabled,it=Et.init(this.clippingPlanes,wt),M=mt.get(R,y.length),M.init(),y.push(M),ut.enabled===!0&&ut.isPresenting===!0){const ft=T.xr.getDepthSensingMesh();ft!==null&&qr(ft,B,-1/0,T.sortObjects)}qr(R,B,0,T.sortObjects),M.finish(),T.sortObjects===!0&&M.sort(Lt,jt),Jt=ut.enabled===!1||ut.isPresenting===!1||ut.hasDepthSensing()===!1,Jt&&ct.addToRenderList(M,R),this.info.render.frame++,it===!0&&Et.beginShadows();const G=v.state.shadowsArray;rt.render(G,R,B),it===!0&&Et.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=M.opaque,z=M.transmissive;if(v.setupLights(),B.isArrayCamera){const ft=B.cameras;if(z.length>0)for(let bt=0,Rt=ft.length;bt<Rt;bt++){const At=ft[bt];lc(W,z,R,At)}Jt&&ct.render(R);for(let bt=0,Rt=ft.length;bt<Rt;bt++){const At=ft[bt];cc(M,R,At,At.viewport)}}else z.length>0&&lc(W,z,R,B),Jt&&ct.render(R),cc(M,R,B);_!==null&&b===0&&(St.updateMultisampleRenderTarget(_),St.updateRenderTargetMipmap(_)),R.isScene===!0&&R.onAfterRender(T,R,B),N.resetDefaultState(),A=-1,D=null,E.pop(),E.length>0?(v=E[E.length-1],it===!0&&Et.setGlobalState(T.clippingPlanes,v.state.camera)):v=null,y.pop(),y.length>0?M=y[y.length-1]:M=null};function qr(R,B,G,W){if(R.visible===!1)return;if(R.layers.test(B.layers)){if(R.isGroup)G=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(B);else if(R.isLight)v.pushLight(R),R.castShadow&&v.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||j.intersectsSprite(R)){W&&qt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(Gt);const bt=nt.update(R),Rt=R.material;Rt.visible&&M.push(R,bt,Rt,G,qt.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||j.intersectsObject(R))){const bt=nt.update(R),Rt=R.material;if(W&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),qt.copy(R.boundingSphere.center)):(bt.boundingSphere===null&&bt.computeBoundingSphere(),qt.copy(bt.boundingSphere.center)),qt.applyMatrix4(R.matrixWorld).applyMatrix4(Gt)),Array.isArray(Rt)){const At=bt.groups;for(let kt=0,Ht=At.length;kt<Ht;kt++){const Ut=At[kt],ne=Rt[Ut.materialIndex];ne&&ne.visible&&M.push(R,bt,ne,G,qt.z,Ut)}}else Rt.visible&&M.push(R,bt,Rt,G,qt.z,null)}}const ft=R.children;for(let bt=0,Rt=ft.length;bt<Rt;bt++)qr(ft[bt],B,G,W)}function cc(R,B,G,W){const{opaque:z,transmissive:ft,transparent:bt}=R;v.setupLightsView(G),it===!0&&Et.setGlobalState(T.clippingPlanes,G),W&&st.viewport(F.copy(W)),z.length>0&&qs(z,B,G),ft.length>0&&qs(ft,B,G),bt.length>0&&qs(bt,B,G),st.buffers.depth.setTest(!0),st.buffers.depth.setMask(!0),st.buffers.color.setMask(!0),st.setPolygonOffset(!1)}function lc(R,B,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[W.id]===void 0&&(v.state.transmissionRenderTarget[W.id]=new Mn(1,1,{generateMipmaps:!0,type:Z.has("EXT_color_buffer_half_float")||Z.has("EXT_color_buffer_float")?Ln:Dn,minFilter:Mi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:se.workingColorSpace}));const ft=v.state.transmissionRenderTarget[W.id],bt=W.viewport||F;ft.setSize(bt.z*T.transmissionResolutionScale,bt.w*T.transmissionResolutionScale);const Rt=T.getRenderTarget(),At=T.getActiveCubeFace(),kt=T.getActiveMipmapLevel();T.setRenderTarget(ft),T.getClearColor(H),tt=T.getClearAlpha(),tt<1&&T.setClearColor(16777215,.5),T.clear(),Jt&&ct.render(G);const Ht=T.toneMapping;T.toneMapping=si;const Ut=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),v.setupLightsView(W),it===!0&&Et.setGlobalState(T.clippingPlanes,W),qs(R,G,W),St.updateMultisampleRenderTarget(ft),St.updateRenderTargetMipmap(ft),Z.has("WEBGL_multisampled_render_to_texture")===!1){let ne=!1;for(let _e=0,Ce=B.length;_e<Ce;_e++){const Re=B[_e],{object:Me,geometry:Ot,material:Te,group:ae}=Re;if(Te.side===ue&&Me.layers.test(W.layers)){const Ke=Te.side;Te.side=He,Te.needsUpdate=!0,hc(Me,G,W,Ot,Te,ae),Te.side=Ke,Te.needsUpdate=!0,ne=!0}}ne===!0&&(St.updateMultisampleRenderTarget(ft),St.updateRenderTargetMipmap(ft))}T.setRenderTarget(Rt,At,kt),T.setClearColor(H,tt),Ut!==void 0&&(W.viewport=Ut),T.toneMapping=Ht}function qs(R,B,G){const W=B.isScene===!0?B.overrideMaterial:null;for(let z=0,ft=R.length;z<ft;z++){const bt=R[z],{object:Rt,geometry:At,group:kt}=bt;let Ht=bt.material;Ht.allowOverride===!0&&W!==null&&(Ht=W),Rt.layers.test(G.layers)&&hc(Rt,B,G,At,Ht,kt)}}function hc(R,B,G,W,z,ft){R.onBeforeRender(T,B,G,W,z,ft),R.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),z.onBeforeRender(T,B,G,W,R,ft),z.transparent===!0&&z.side===ue&&z.forceSinglePass===!1?(z.side=He,z.needsUpdate=!0,T.renderBufferDirect(G,B,W,z,R,ft),z.side=ai,z.needsUpdate=!0,T.renderBufferDirect(G,B,W,z,R,ft),z.side=ue):T.renderBufferDirect(G,B,W,z,R,ft),R.onAfterRender(T,B,G,W,z,ft)}function Ys(R,B,G){B.isScene!==!0&&(B=Ue);const W=ot.get(R),z=v.state.lights,ft=v.state.shadowsArray,bt=z.state.version,Rt=q.getParameters(R,z.state,ft,B,G),At=q.getProgramCacheKey(Rt);let kt=W.programs;W.environment=R.isMeshStandardMaterial?B.environment:null,W.fog=B.fog,W.envMap=(R.isMeshStandardMaterial?w:L).get(R.envMap||W.environment),W.envMapRotation=W.environment!==null&&R.envMap===null?B.environmentRotation:R.envMapRotation,kt===void 0&&(R.addEventListener("dispose",Zt),kt=new Map,W.programs=kt);let Ht=kt.get(At);if(Ht!==void 0){if(W.currentProgram===Ht&&W.lightsStateVersion===bt)return uc(R,Rt),Ht}else Rt.uniforms=q.getUniforms(R),R.onBeforeCompile(Rt,T),Ht=q.acquireProgram(Rt,At),kt.set(At,Ht),W.uniforms=Rt.uniforms;const Ut=W.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ut.clippingPlanes=Et.uniform),uc(R,Rt),W.needsLights=Qh(R),W.lightsStateVersion=bt,W.needsLights&&(Ut.ambientLightColor.value=z.state.ambient,Ut.lightProbe.value=z.state.probe,Ut.directionalLights.value=z.state.directional,Ut.directionalLightShadows.value=z.state.directionalShadow,Ut.spotLights.value=z.state.spot,Ut.spotLightShadows.value=z.state.spotShadow,Ut.rectAreaLights.value=z.state.rectArea,Ut.ltc_1.value=z.state.rectAreaLTC1,Ut.ltc_2.value=z.state.rectAreaLTC2,Ut.pointLights.value=z.state.point,Ut.pointLightShadows.value=z.state.pointShadow,Ut.hemisphereLights.value=z.state.hemi,Ut.directionalShadowMap.value=z.state.directionalShadowMap,Ut.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ut.spotShadowMap.value=z.state.spotShadowMap,Ut.spotLightMatrix.value=z.state.spotLightMatrix,Ut.spotLightMap.value=z.state.spotLightMap,Ut.pointShadowMap.value=z.state.pointShadowMap,Ut.pointShadowMatrix.value=z.state.pointShadowMatrix),W.currentProgram=Ht,W.uniformsList=null,Ht}function dc(R){if(R.uniformsList===null){const B=R.currentProgram.getUniforms();R.uniformsList=Ar.seqWithValue(B.seq,R.uniforms)}return R.uniformsList}function uc(R,B){const G=ot.get(R);G.outputColorSpace=B.outputColorSpace,G.batching=B.batching,G.batchingColor=B.batchingColor,G.instancing=B.instancing,G.instancingColor=B.instancingColor,G.instancingMorph=B.instancingMorph,G.skinning=B.skinning,G.morphTargets=B.morphTargets,G.morphNormals=B.morphNormals,G.morphColors=B.morphColors,G.morphTargetsCount=B.morphTargetsCount,G.numClippingPlanes=B.numClippingPlanes,G.numIntersection=B.numClipIntersection,G.vertexAlphas=B.vertexAlphas,G.vertexTangents=B.vertexTangents,G.toneMapping=B.toneMapping}function Jh(R,B,G,W,z){B.isScene!==!0&&(B=Ue),St.resetTextureUnits();const ft=B.fog,bt=W.isMeshStandardMaterial?B.environment:null,Rt=_===null?T.outputColorSpace:_.isXRRenderTarget===!0?_.texture.colorSpace:es,At=(W.isMeshStandardMaterial?w:L).get(W.envMap||bt),kt=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Ht=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ut=!!G.morphAttributes.position,ne=!!G.morphAttributes.normal,_e=!!G.morphAttributes.color;let Ce=si;W.toneMapped&&(_===null||_.isXRRenderTarget===!0)&&(Ce=T.toneMapping);const Re=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Me=Re!==void 0?Re.length:0,Ot=ot.get(W),Te=v.state.lights;if(it===!0&&(wt===!0||R!==D)){const Xe=R===D&&W.id===A;Et.setState(W,R,Xe)}let ae=!1;W.version===Ot.__version?(Ot.needsLights&&Ot.lightsStateVersion!==Te.state.version||Ot.outputColorSpace!==Rt||z.isBatchedMesh&&Ot.batching===!1||!z.isBatchedMesh&&Ot.batching===!0||z.isBatchedMesh&&Ot.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Ot.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Ot.instancing===!1||!z.isInstancedMesh&&Ot.instancing===!0||z.isSkinnedMesh&&Ot.skinning===!1||!z.isSkinnedMesh&&Ot.skinning===!0||z.isInstancedMesh&&Ot.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Ot.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Ot.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Ot.instancingMorph===!1&&z.morphTexture!==null||Ot.envMap!==At||W.fog===!0&&Ot.fog!==ft||Ot.numClippingPlanes!==void 0&&(Ot.numClippingPlanes!==Et.numPlanes||Ot.numIntersection!==Et.numIntersection)||Ot.vertexAlphas!==kt||Ot.vertexTangents!==Ht||Ot.morphTargets!==Ut||Ot.morphNormals!==ne||Ot.morphColors!==_e||Ot.toneMapping!==Ce||Ot.morphTargetsCount!==Me)&&(ae=!0):(ae=!0,Ot.__version=W.version);let Ke=Ot.currentProgram;ae===!0&&(Ke=Ys(W,B,z));let Ri=!1,Je=!1,ds=!1;const Ee=Ke.getUniforms(),Ze=Ot.uniforms;if(st.useProgram(Ke.program)&&(Ri=!0,Je=!0,ds=!0),W.id!==A&&(A=W.id,Je=!0),Ri||D!==R){st.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Ee.setValue(U,"projectionMatrix",R.projectionMatrix),Ee.setValue(U,"viewMatrix",R.matrixWorldInverse);const $e=Ee.map.cameraPosition;$e!==void 0&&$e.setValue(U,Dt.setFromMatrixPosition(R.matrixWorld)),lt.logarithmicDepthBuffer&&Ee.setValue(U,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Ee.setValue(U,"isOrthographic",R.isOrthographicCamera===!0),D!==R&&(D=R,Je=!0,ds=!0)}if(z.isSkinnedMesh){Ee.setOptional(U,z,"bindMatrix"),Ee.setOptional(U,z,"bindMatrixInverse");const Xe=z.skeleton;Xe&&(Xe.boneTexture===null&&Xe.computeBoneTexture(),Ee.setValue(U,"boneTexture",Xe.boneTexture,St))}z.isBatchedMesh&&(Ee.setOptional(U,z,"batchingTexture"),Ee.setValue(U,"batchingTexture",z._matricesTexture,St),Ee.setOptional(U,z,"batchingIdTexture"),Ee.setValue(U,"batchingIdTexture",z._indirectTexture,St),Ee.setOptional(U,z,"batchingColorTexture"),z._colorsTexture!==null&&Ee.setValue(U,"batchingColorTexture",z._colorsTexture,St));const rn=G.morphAttributes;if((rn.position!==void 0||rn.normal!==void 0||rn.color!==void 0)&&Ft.update(z,G,Ke),(Je||Ot.receiveShadow!==z.receiveShadow)&&(Ot.receiveShadow=z.receiveShadow,Ee.setValue(U,"receiveShadow",z.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Ze.envMap.value=At,Ze.flipEnvMap.value=At.isCubeTexture&&At.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&B.environment!==null&&(Ze.envMapIntensity.value=B.environmentIntensity),Ze.dfgLUT!==void 0&&(Ze.dfgLUT.value=tg()),Je&&(Ee.setValue(U,"toneMappingExposure",T.toneMappingExposure),Ot.needsLights&&jh(Ze,ds),ft&&W.fog===!0&&Pt.refreshFogUniforms(Ze,ft),Pt.refreshMaterialUniforms(Ze,W,dt,ht,v.state.transmissionRenderTarget[R.id]),Ar.upload(U,dc(Ot),Ze,St)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Ar.upload(U,dc(Ot),Ze,St),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Ee.setValue(U,"center",z.center),Ee.setValue(U,"modelViewMatrix",z.modelViewMatrix),Ee.setValue(U,"normalMatrix",z.normalMatrix),Ee.setValue(U,"modelMatrix",z.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Xe=W.uniformsGroups;for(let $e=0,Yr=Xe.length;$e<Yr;$e++){const ci=Xe[$e];gt.update(ci,Ke),gt.bind(ci,Ke)}}return Ke}function jh(R,B){R.ambientLightColor.needsUpdate=B,R.lightProbe.needsUpdate=B,R.directionalLights.needsUpdate=B,R.directionalLightShadows.needsUpdate=B,R.pointLights.needsUpdate=B,R.pointLightShadows.needsUpdate=B,R.spotLights.needsUpdate=B,R.spotLightShadows.needsUpdate=B,R.rectAreaLights.needsUpdate=B,R.hemisphereLights.needsUpdate=B}function Qh(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return _},this.setRenderTargetTextures=function(R,B,G){const W=ot.get(R);W.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),ot.get(R.texture).__webglTexture=B,ot.get(R.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:G,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,B){const G=ot.get(R);G.__webglFramebuffer=B,G.__useDefaultFramebuffer=B===void 0};const td=U.createFramebuffer();this.setRenderTarget=function(R,B=0,G=0){_=R,C=B,b=G;let W=!0,z=null,ft=!1,bt=!1;if(R){const At=ot.get(R);if(At.__useDefaultFramebuffer!==void 0)st.bindFramebuffer(U.FRAMEBUFFER,null),W=!1;else if(At.__webglFramebuffer===void 0)St.setupRenderTarget(R);else if(At.__hasExternalTextures)St.rebindTextures(R,ot.get(R.texture).__webglTexture,ot.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Ut=R.depthTexture;if(At.__boundDepthTexture!==Ut){if(Ut!==null&&ot.has(Ut)&&(R.width!==Ut.image.width||R.height!==Ut.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");St.setupDepthRenderbuffer(R)}}const kt=R.texture;(kt.isData3DTexture||kt.isDataArrayTexture||kt.isCompressedArrayTexture)&&(bt=!0);const Ht=ot.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Ht[B])?z=Ht[B][G]:z=Ht[B],ft=!0):R.samples>0&&St.useMultisampledRTT(R)===!1?z=ot.get(R).__webglMultisampledFramebuffer:Array.isArray(Ht)?z=Ht[G]:z=Ht,F.copy(R.viewport),k.copy(R.scissor),V=R.scissorTest}else F.copy(ie).multiplyScalar(dt).floor(),k.copy(me).multiplyScalar(dt).floor(),V=xe;if(G!==0&&(z=td),st.bindFramebuffer(U.FRAMEBUFFER,z)&&W&&st.drawBuffers(R,z),st.viewport(F),st.scissor(k),st.setScissorTest(V),ft){const At=ot.get(R.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+B,At.__webglTexture,G)}else if(bt){const At=B;for(let kt=0;kt<R.textures.length;kt++){const Ht=ot.get(R.textures[kt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+kt,Ht.__webglTexture,G,At)}}else if(R!==null&&G!==0){const At=ot.get(R.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,At.__webglTexture,G)}A=-1},this.readRenderTargetPixels=function(R,B,G,W,z,ft,bt,Rt=0){if(!(R&&R.isWebGLRenderTarget)){Pe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let At=ot.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&bt!==void 0&&(At=At[bt]),At){st.bindFramebuffer(U.FRAMEBUFFER,At);try{const kt=R.textures[Rt],Ht=kt.format,Ut=kt.type;if(!lt.textureFormatReadable(Ht)){Pe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!lt.textureTypeReadable(Ut)){Pe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=R.width-W&&G>=0&&G<=R.height-z&&(R.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Rt),U.readPixels(B,G,W,z,zt.convert(Ht),zt.convert(Ut),ft))}finally{const kt=_!==null?ot.get(_).__webglFramebuffer:null;st.bindFramebuffer(U.FRAMEBUFFER,kt)}}},this.readRenderTargetPixelsAsync=async function(R,B,G,W,z,ft,bt,Rt=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let At=ot.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&bt!==void 0&&(At=At[bt]),At)if(B>=0&&B<=R.width-W&&G>=0&&G<=R.height-z){st.bindFramebuffer(U.FRAMEBUFFER,At);const kt=R.textures[Rt],Ht=kt.format,Ut=kt.type;if(!lt.textureFormatReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!lt.textureTypeReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ne=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,ne),U.bufferData(U.PIXEL_PACK_BUFFER,ft.byteLength,U.STREAM_READ),R.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Rt),U.readPixels(B,G,W,z,zt.convert(Ht),zt.convert(Ut),0);const _e=_!==null?ot.get(_).__webglFramebuffer:null;st.bindFramebuffer(U.FRAMEBUFFER,_e);const Ce=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Od(U,Ce,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,ne),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,ft),U.deleteBuffer(ne),U.deleteSync(Ce),ft}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,B=null,G=0){const W=Math.pow(2,-G),z=Math.floor(R.image.width*W),ft=Math.floor(R.image.height*W),bt=B!==null?B.x:0,Rt=B!==null?B.y:0;St.setTexture2D(R,0),U.copyTexSubImage2D(U.TEXTURE_2D,G,0,0,bt,Rt,z,ft),st.unbindTexture()};const ed=U.createFramebuffer(),nd=U.createFramebuffer();this.copyTextureToTexture=function(R,B,G=null,W=null,z=0,ft=null){ft===null&&(z!==0?(Bs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ft=z,z=0):ft=0);let bt,Rt,At,kt,Ht,Ut,ne,_e,Ce;const Re=R.isCompressedTexture?R.mipmaps[ft]:R.image;if(G!==null)bt=G.max.x-G.min.x,Rt=G.max.y-G.min.y,At=G.isBox3?G.max.z-G.min.z:1,kt=G.min.x,Ht=G.min.y,Ut=G.isBox3?G.min.z:0;else{const rn=Math.pow(2,-z);bt=Math.floor(Re.width*rn),Rt=Math.floor(Re.height*rn),R.isDataArrayTexture?At=Re.depth:R.isData3DTexture?At=Math.floor(Re.depth*rn):At=1,kt=0,Ht=0,Ut=0}W!==null?(ne=W.x,_e=W.y,Ce=W.z):(ne=0,_e=0,Ce=0);const Me=zt.convert(B.format),Ot=zt.convert(B.type);let Te;B.isData3DTexture?(St.setTexture3D(B,0),Te=U.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(St.setTexture2DArray(B,0),Te=U.TEXTURE_2D_ARRAY):(St.setTexture2D(B,0),Te=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,B.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,B.unpackAlignment);const ae=U.getParameter(U.UNPACK_ROW_LENGTH),Ke=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Ri=U.getParameter(U.UNPACK_SKIP_PIXELS),Je=U.getParameter(U.UNPACK_SKIP_ROWS),ds=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,Re.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Re.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,kt),U.pixelStorei(U.UNPACK_SKIP_ROWS,Ht),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ut);const Ee=R.isDataArrayTexture||R.isData3DTexture,Ze=B.isDataArrayTexture||B.isData3DTexture;if(R.isDepthTexture){const rn=ot.get(R),Xe=ot.get(B),$e=ot.get(rn.__renderTarget),Yr=ot.get(Xe.__renderTarget);st.bindFramebuffer(U.READ_FRAMEBUFFER,$e.__webglFramebuffer),st.bindFramebuffer(U.DRAW_FRAMEBUFFER,Yr.__webglFramebuffer);for(let ci=0;ci<At;ci++)Ee&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,ot.get(R).__webglTexture,z,Ut+ci),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,ot.get(B).__webglTexture,ft,Ce+ci)),U.blitFramebuffer(kt,Ht,bt,Rt,ne,_e,bt,Rt,U.DEPTH_BUFFER_BIT,U.NEAREST);st.bindFramebuffer(U.READ_FRAMEBUFFER,null),st.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(z!==0||R.isRenderTargetTexture||ot.has(R)){const rn=ot.get(R),Xe=ot.get(B);st.bindFramebuffer(U.READ_FRAMEBUFFER,ed),st.bindFramebuffer(U.DRAW_FRAMEBUFFER,nd);for(let $e=0;$e<At;$e++)Ee?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,rn.__webglTexture,z,Ut+$e):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,rn.__webglTexture,z),Ze?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Xe.__webglTexture,ft,Ce+$e):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Xe.__webglTexture,ft),z!==0?U.blitFramebuffer(kt,Ht,bt,Rt,ne,_e,bt,Rt,U.COLOR_BUFFER_BIT,U.NEAREST):Ze?U.copyTexSubImage3D(Te,ft,ne,_e,Ce+$e,kt,Ht,bt,Rt):U.copyTexSubImage2D(Te,ft,ne,_e,kt,Ht,bt,Rt);st.bindFramebuffer(U.READ_FRAMEBUFFER,null),st.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Ze?R.isDataTexture||R.isData3DTexture?U.texSubImage3D(Te,ft,ne,_e,Ce,bt,Rt,At,Me,Ot,Re.data):B.isCompressedArrayTexture?U.compressedTexSubImage3D(Te,ft,ne,_e,Ce,bt,Rt,At,Me,Re.data):U.texSubImage3D(Te,ft,ne,_e,Ce,bt,Rt,At,Me,Ot,Re):R.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,ft,ne,_e,bt,Rt,Me,Ot,Re.data):R.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,ft,ne,_e,Re.width,Re.height,Me,Re.data):U.texSubImage2D(U.TEXTURE_2D,ft,ne,_e,bt,Rt,Me,Ot,Re);U.pixelStorei(U.UNPACK_ROW_LENGTH,ae),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Ke),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ri),U.pixelStorei(U.UNPACK_SKIP_ROWS,Je),U.pixelStorei(U.UNPACK_SKIP_IMAGES,ds),ft===0&&B.generateMipmaps&&U.generateMipmap(Te),st.unbindTexture()},this.initRenderTarget=function(R){ot.get(R).__webglFramebuffer===void 0&&St.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?St.setTextureCube(R,0):R.isData3DTexture?St.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?St.setTexture2DArray(R,0):St.setTexture2D(R,0),st.unbindTexture()},this.resetState=function(){C=0,b=0,_=null,st.reset(),N.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=se._getDrawingBufferColorSpace(t),e.unpackColorSpace=se._getUnpackColorSpace()}}const Cr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class ls{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ng=new jo(-1,1,1,-1,0,1);class ig extends Ie{constructor(){super(),this.setAttribute("position",new re([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new re([0,2,0,0,2,0],2))}}const sg=new ig;class Qo{constructor(t){this._mesh=new Y(sg,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,ng)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Dh extends ls{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Ge?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=ks.clone(t.uniforms),this.material=new Ge({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Qo(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Tl extends ls{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class rg extends ls{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class ag{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new _t);this._width=n.width,this._height=n.height,e=new Mn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ln}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Dh(Cr),this.copyPass.material.blending=Pn,this.clock=new Eh}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Tl!==void 0&&(a instanceof Tl?n=!0:a instanceof rg&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new _t);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class og extends ls{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Xt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}const cg={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Xt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class ss extends ls{constructor(t,e=1,n,s){super(),this.strength=e,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new _t(t.x,t.y):new _t(256,256),this.clearColor=new Xt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Mn(r,a,{type:Ln}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new Mn(r,a,{type:Ln});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new Mn(r,a,{type:Ln});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=cg;this.highPassUniforms=ks.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ge({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new _t(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ks.clone(Cr.uniforms),this.blendMaterial=new Ge({uniforms:this.copyUniforms,vertexShader:Cr.vertexShader,fragmentShader:Cr.fragmentShader,blending:$i,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Xt,this._oldClearAlpha=1,this._basic=new we,this._fsQuad=new Qo(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new _t(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=ss.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=ss.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){const e=[],n=t/3;for(let s=0;s<t;s++)e.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new Ge({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new _t(.5,.5)},direction:{value:new _t(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(t){return new Ge({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}ss.BlurDirectionX=new _t(1,0);ss.BlurDirectionY=new _t(0,1);const Mr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class lg extends ls{constructor(){super(),this.uniforms=ks.clone(Mr.uniforms),this.material=new af({name:Mr.name,uniforms:this.uniforms,vertexShader:Mr.vertexShader,fragmentShader:Mr.fragmentShader}),this._fsQuad=new Qo(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},se.getTransfer(this._outputColorSpace)===fe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Hl?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Wl?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Xl?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Po?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Yl?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Zl?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ql&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class hg extends dh{constructor(){super();const t=new Vt;t.deleteAttribute("uv");const e=new J({side:He}),n=new J,s=new Th(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new Y(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new cn(t,n,6),o=new Le;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const c=new Y(t,Xi(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const l=new Y(t,Xi(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);const d=new Y(t,Xi(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new Y(t,Xi(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const f=new Y(t,Xi(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);const p=new Y(t,Xi(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function Xi(i){return new of({color:0,emissive:16777215,emissiveIntensity:i})}const Xs=document.querySelector("#game"),sn=new eg({canvas:Xs,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});sn.setPixelRatio(Math.min(window.devicePixelRatio,2));sn.setSize(window.innerWidth,window.innerHeight);sn.shadowMap.enabled=!0;sn.shadowMap.type=Gl;sn.outputColorSpace=be;sn.toneMapping=Po;sn.toneMappingExposure=.96;const Wt=new dh;Wt.background=new Xt(806802);Wt.fog=new Wo(2848949,105,1180);const Ih=new wo(sn);Ih.compileEquirectangularShader();Wt.environment=Ih.fromScene(new hg,.04).texture;Wt.environmentIntensity=.62;const Qt=new tn(69,window.innerWidth/window.innerHeight,.08,1800);Wt.add(Qt);const Bt={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const ee=new Set,Mt={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},dg=new Eh,Ve=new I(0,1,0),Uh=new I,Nh=new I,tc=new I,mn=new Le,Eo=1.2,ug=.78,Ji=.55,gi={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},rs=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],fg=Math.max(...rs.map(i=>i.width));let Rr=0,K=rs[0];const x={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamPos:new I,best:Number(localStorage.getItem("steel-ribbon-best")||0)};Bt.best.textContent=`Best score ${x.best}`;function pg(i){const t=Nt.clamp(i,0,1);return t*t*(3-2*t)}function mg(i){let t=0;for(const e of K.gaps){const n=e.start-e.approach,s=e.start+e.carry,r=e.end+e.settle;i>=n&&i<=s?t+=e.rise*Nt.clamp((i-n)/(e.approach+e.carry),0,1):i>s&&i<=e.end?t+=e.rise:i>e.end&&i<=r&&(t+=e.rise*(1-pg((i-e.end)/e.settle)))}return t}function Fh(i,t){const e=(t%i.length+i.length)%i.length,n=e/i.length*Math.PI*2,s=i.shape,r=Math.sin(n)*s.x1+Math.sin(n*2)*s.x2+Math.cos(n*3)*s.x3,a=Math.cos(n)*s.z1+Math.cos(n*2)*s.z2+Math.sin(n*3)*s.z3;return{x:r,z:a,t:n,n:e}}function Sr(i){const{x:t,z:e,t:n,n:s}=Fh(K,i),r=K.shape;let a=r.y0+Math.sin(n*2)*r.y2+Math.sin(n*3)*r.y3+Math.cos(n)*r.y1;for(const o of K.ramps){const c=xg(s-o.s);a+=o.amp*Math.exp(-(c*c)/(o.width*o.width))}return a+=mg(s),new I(t,a,e)}function xg(i){return i>K.length/2?i-K.length:i<-K.length/2?i+K.length:i}function ce(i){const t=(i%K.length+K.length)%K.length,e=Sr(t),s=Sr(t+2).sub(e).normalize(),r=Uh.crossVectors(Ve,s).normalize(),a=Sr(t-2).y,o=Sr(t+2).y,c=Math.atan2(o-a,4),l=Math.sin(t*.012)*.18+Math.sin(t*.032)*.08,d=K.gaps.find(u=>t>u.start&&t<u.end);return{s:t,p:e,tangent:s,side:r.clone(),grade:c,bank:l,gap:d}}function Ti(i){const t=(i%K.length+K.length)%K.length;return K.gaps.some(e=>t>e.start&&t<e.end)}function El(i){return Nt.clamp(i/(K.length*K.laps),0,1)}function gg(i,t,e){const n=Math.floor(i/K.length),s=Math.floor(t/K.length);for(let r=n;r<=s;r++){const a=r*K.length+e;if(i<a&&t>=a)return!0}return!1}function _g(i=256,t=8){const e=document.createElement("canvas");e.width=i,e.height=i;const n=e.getContext("2d"),s=i/t;for(let a=0;a<t;a++)for(let o=0;o<t;o++)n.fillStyle=(o+a)%2?"#101318":"#f5f1df",n.fillRect(o*s,a*s,s,s);const r=new Tn(e);return r.colorSpace=be,r.wrapS=hn,r.wrapT=hn,r.repeat.set(3,1),r}function vg(i=512){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,i,0);n.addColorStop(0,"#9c9b77"),n.addColorStop(.18,"#c9c69a"),n.addColorStop(.5,"#9f9f79"),n.addColorStop(.82,"#c0bd91"),n.addColorStop(1,"#858563"),e.fillStyle=n,e.fillRect(0,0,i,i),e.strokeStyle="rgba(38, 44, 36, 0.32)",e.lineWidth=2;for(let r=0;r<i;r+=64)e.beginPath(),e.moveTo(0,r+2),e.lineTo(i,r+2),e.stroke();e.strokeStyle="rgba(250, 242, 180, 0.22)",e.lineWidth=3;for(const r of[48,464])e.beginPath(),e.moveTo(r,0),e.lineTo(r,i),e.stroke();e.strokeStyle="rgba(28, 31, 30, 0.24)",e.lineWidth=3;for(let r=0;r<42;r++){const a=i*(.28+Math.random()*.44),o=Math.random()*i;e.beginPath(),e.moveTo(a,o),e.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),e.stroke()}e.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)e.beginPath(),e.ellipse(Math.random()*i,Math.random()*i,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),e.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);e.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,e.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new Tn(t);return s.colorSpace=be,s.wrapS=hn,s.wrapT=hn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),s}function Mg(i=1024){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,i,i);n.addColorStop(0,"#2e6a40"),n.addColorStop(.42,"#487443"),n.addColorStop(1,"#1f4a37"),e.fillStyle=n,e.fillRect(0,0,i,i);for(let r=0;r<3600;r++){const a=.035+Math.random()*.08,o=72+Math.floor(Math.random()*70);e.fillStyle=`rgba(${38+Math.random()*30}, ${o}, ${38+Math.random()*26}, ${a})`,e.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*4,1+Math.random()*4)}e.strokeStyle="rgba(210, 220, 150, 0.08)",e.lineWidth=2;for(let r=-i;r<i*1.5;r+=76)e.beginPath(),e.moveTo(r,0),e.lineTo(r+i*.65,i),e.stroke();const s=new Tn(t);return s.colorSpace=be,s.wrapS=hn,s.wrapT=hn,s.repeat.set(18,18),s.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),s}function Sg(i=1024){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,i,i);n.addColorStop(0,"#111a1f"),n.addColorStop(.45,"#252c31"),n.addColorStop(1,"#070d11"),e.fillStyle=n,e.fillRect(0,0,i,i),e.strokeStyle="rgba(180, 225, 255, 0.08)",e.lineWidth=1;for(let r=-i;r<i*2;r+=42)e.beginPath(),e.moveTo(r,0),e.lineTo(r+i*.7,i),e.stroke();for(let r=0;r<360;r++){const a=Math.random()*i,o=Math.random()*i,c=10+Math.random()*56,l=e.createRadialGradient(a,o,0,a,o,c);l.addColorStop(0,`rgba(145, 205, 255, ${.12+Math.random()*.15})`),l.addColorStop(.45,"rgba(80, 140, 180, 0.07)"),l.addColorStop(1,"rgba(10, 18, 24, 0)"),e.fillStyle=l,e.beginPath(),e.ellipse(a,o,c,c*(.16+Math.random()*.18),Math.random()*Math.PI,0,Math.PI*2),e.fill()}e.fillStyle="rgba(255, 214, 122, 0.12)";for(let r=0;r<48;r++){const a=Math.random()*i,o=Math.random()*i;e.beginPath(),e.ellipse(a,o,8+Math.random()*36,1.5+Math.random()*4,Math.random()*Math.PI,0,Math.PI*2),e.fill()}for(let r=0;r<5200;r++){const a=40+Math.floor(Math.random()*80);e.fillStyle=`rgba(${a}, ${a+4}, ${a+8}, ${.045+Math.random()*.08})`,e.fillRect(Math.random()*i,Math.random()*i,1,1)}const s=new Tn(t);return s.colorSpace=be,s.wrapS=hn,s.wrapT=hn,s.repeat.set(22,28),s.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),s}function Yi(i=128,t=256,e=.42){const n=document.createElement("canvas");n.width=i,n.height=t;const s=n.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,i,t);for(let a=10;a<t-8;a+=18)for(let o=9;o<i-9;o+=15)Math.random()<e?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<i;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,t),s.stroke();const r=new Tn(n);return r.colorSpace=be,r}function Al(i,t="#ff4fb7",e="rgba(12, 5, 30, 0.92)"){const n=document.createElement("canvas");n.width=128,n.height=384;const s=n.getContext("2d");s.fillStyle=e,s.fillRect(0,0,128,384),s.strokeStyle=t,s.lineWidth=5,s.strokeRect(8,8,112,368),s.save(),s.translate(64,196),s.rotate(-Math.PI/2),s.font="900 54px Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.shadowColor=t,s.shadowBlur=18,s.fillStyle=t,s.fillText(i,0,0),s.restore();const r=new Tn(n);return r.colorSpace=be,r}function de(i,t){return-7+Math.sin(i*.018)*4+Math.cos(t*.014)*5+Math.sin((i+t)*.006)*10}function ec(i,t,e=10){const{x0:n,x1:s,zNear:r,zFar:a,pitch:o,streetW:c}=gi;if(i<n-c||i>s+c||t<a-c||t>r+c)return!1;const l=Math.abs((i-n+o/2)%o-o/2),d=Math.abs((r-t+o/2)%o-o/2);return Math.min(l,d)<c*.5+e}const Pr=[],Ca=[],Oh=[];let Cl=0;function mi(i,t){return Oh.push({obj:i,update:t}),i}function yg(i){Cl+=i;for(const t of Oh)t.update(Cl,i)}function bg(){if(Ca.length===0)for(const i of rs)for(let t=0;t<i.length;t+=14){const e=Fh(i,t);Ca.push({x:e.x,z:e.z,s:t})}return Ca}function Vn(i,t,e=0){let n=null,s=1/0;for(const r of bg()){const a=i-r.x,o=t-r.z,c=Math.hypot(a,o);c<s&&(s=c,n=r)}return{clearance:s-e-fg*.58,distance:s,nearestS:n?.s??0}}function xn(i,t,e,n=96){for(let s=0;s<n;s++){const r=i(s);if(Vn(r.x,r.z,t).clearance>=e)return r}return null}function gn(i,t,e,n,s){const r=Vn(t,e,n);Pr.push({kind:i,x:Math.round(t),z:Math.round(e),radius:Math.round(n),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function wg(){const i=[...Pr].sort((t,e)=>t.clearance-e.clearance).slice(0,12);return{count:Pr.length,unsafe:Pr.filter(t=>t.clearance<t.margin),closest:i}}function on(i,t,e,n,s){const r=t.clone().add(e).multiplyScalar(.5),a=e.clone().sub(t),o=new Y(new pe(n,n,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors(Ve,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,i.add(o),o}function Tg(){const i=new hf(10475519,1055524,.82);Wt.add(i);const t=new Qc(5941759,1.15);t.position.set(260,145,-260),Wt.add(t);const e=new Qc(16766364,1.55);e.position.set(-240,270,180),e.castShadow=!0,e.shadow.mapSize.set(3072,3072),e.shadow.camera.left=-460,e.shadow.camera.right=460,e.shadow.camera.top=460,e.shadow.camera.bottom=-460,e.shadow.camera.near=50,e.shadow.camera.far=980,e.shadow.bias=-.0015,Wt.add(e);const n=new Th(5552383,58,820,2.1);n.position.set(0,88,-920),Wt.add(n)}function Eg(){const i=document.createElement("canvas");i.width=32,i.height=512;const t=i.getContext("2d"),e=t.createLinearGradient(0,0,0,i.height);e.addColorStop(0,"#052e72"),e.addColorStop(.34,"#126bc8"),e.addColorStop(.68,"#62baff"),e.addColorStop(1,"#ffb46f"),t.fillStyle=e,t.fillRect(0,0,i.width,i.height);const n=new Tn(i);n.colorSpace=be;const s=new Y(new en(1550,40,20),new we({map:n,side:He,depthWrite:!1}));s.position.set(0,-70,-700),Wt.add(s);const r=new we({color:16765316,transparent:!0,opacity:.22,depthWrite:!1}),a=new Y(new wn(58,48),r);a.position.set(-430,300,-650),a.lookAt(Qt.position),Wt.add(a);const o=new we({color:16762479,transparent:!0,opacity:.16,depthWrite:!1});for(const[l,d]of[[150,.05],[260,.025],[430,.012]]){const u=new Y(new wn(l,48),o.clone());u.material.opacity=d,u.position.copy(a.position).add(new I(0,0,2)),u.lookAt(Qt.position),Wt.add(u)}const c=new we({color:16769715,transparent:!0,opacity:.025,depthWrite:!1,side:ue});for(let l=0;l<3;l++){const d=new Y(new De(1800,42),c.clone());d.material.opacity=.015+l*.01,d.position.set(0,92+l*28,-1220-l*260),Wt.add(d)}}function Ag(){const i=new J({map:Mg(),color:10212492,roughness:.98,metalness:.02}),t=new Y(new De(4200,4200,300,300),i);t.rotation.x=-Math.PI/2,t.position.y=-7,t.receiveShadow=!0;const e=t.geometry.attributes.position;for(let S=0;S<e.count;S++){const m=e.getX(S),h=e.getY(S);e.setZ(S,de(m,-h)+7)}e.needsUpdate=!0,t.geometry.computeVertexNormals(),Wt.add(t);const n=new J({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.76});for(let S=0;S<3;S++){const m=new Y(new De(980,64+S*18,1,1),n.clone());m.rotation.x=-Math.PI/2,m.rotation.z=-.34+S*.03,m.position.set(150-S*190,-5.4+S*.03,-760-S*420),Wt.add(m)}const s=[new J({color:4352578,roughness:1}),new J({color:6910014,roughness:1}),new J({color:3562320,roughness:1})];for(let S=0;S<46;S++){const m=new Y(new wn(28+Math.random()*90,9),s[S%s.length]);m.rotation.x=-Math.PI/2,m.rotation.z=Math.random()*Math.PI,m.position.set(-900+Math.random()*1800,-5.6+Math.random()*.8,-260-Math.random()*1780),m.scale.y=.32+Math.random()*.5,m.receiveShadow=!0,Wt.add(m)}const r=new we({color:14217471,transparent:!0,opacity:.08,depthWrite:!1});for(let S=0;S<32;S++){const m=new Y(new wn(70+Math.random()*150,22),r.clone());m.material.opacity=.035+Math.random()*.055,m.rotation.x=-Math.PI/2,m.position.set(-1050+Math.random()*2100,-1.8+Math.random()*4,-240-Math.random()*1820),m.scale.y=.22+Math.random()*.26,Wt.add(m)}const a=[new J({color:5991785,roughness:1}),new J({color:7633254,roughness:1}),new J({color:4874865,roughness:1})],o=new J({color:15068905,roughness:.95});for(let S=0;S<52;S++){const m=78+Math.random()*180,h=52+Math.random()*115,M=xn(y=>{const E=S/52*Math.PI*2+y*1.77,T=1380+Math.random()*820+y*18;return{x:Math.cos(E)*T,z:Math.sin(E)*T-1180}},h,480);if(!M)continue;const v=new Y(new ri(h,m,5+Math.floor(Math.random()*2)),a[S%a.length]);if(v.position.set(M.x,-9,M.z),v.rotation.y=Math.random()*Math.PI,v.castShadow=!0,v.receiveShadow=!0,Wt.add(v),gn("mountain",M.x,M.z,h,480),m>160){const y=new Y(new ri(h*.34,m*.22,5),o);y.position.copy(v.position).add(new I(0,m*.39,0)),y.rotation.y=v.rotation.y,Wt.add(y)}}const c=new J({color:4926748,roughness:.9}),l=[new J({color:2055221,roughness:.92}),new J({color:3109954,roughness:.95}),new J({color:1589042,roughness:.9})];for(let S=0;S<185;S++){const m=.58+Math.random()*1.05,h=8*m,M=xn(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),h,145,40);if(!M)continue;const{x:v,z:y}=M;if(ec(v,y,18))continue;const E=de(v,y)+.8,T=new oe,P=2.2+Math.random()*3.8,C=new Y(new pe(.28,.42,P,6),c);C.position.y=P/2,T.add(C);const b=2+Math.floor(Math.random()*3);for(let _=0;_<b;_++){const A=new Y(new ri(2.2+Math.random()*1.7-_*.22,4.8+Math.random()*2.6,7),l[(S+_)%l.length]);A.position.y=P+_*1.45+1.6,A.rotation.y=Math.random()*Math.PI,T.add(A)}T.position.set(v,E,y),T.scale.setScalar(m),Wt.add(T),gn("tree",v,y,h,145)}const d=new J({color:16777215,roughness:.75,transparent:!0,opacity:.88});for(let S=0;S<38;S++){const m=new oe,h=4+Math.floor(Math.random()*5);for(let M=0;M<h;M++){const v=new Y(new en(12+Math.random()*18,14,8),d);v.position.set(M*18-h*9,Math.random()*8,Math.random()*12),v.scale.set(1.2+Math.random()*.9,.36+Math.random()*.2,.8+Math.random()*.5),m.add(v)}m.position.set(-760+Math.random()*1520,185+Math.random()*135,-130-Math.random()*1720),Wt.add(m)}const u=[new J({color:6186600,roughness:.68,metalness:.2}),new J({color:7829101,roughness:.72,metalness:.18}),new J({color:4544612,roughness:.62,metalness:.24})],f=new J({color:2962232,roughness:.65,metalness:.35});for(let S=0;S<44;S++){const m=new oe,h=20+Math.random()*95,M=8+Math.random()*18,v=8+Math.random()*18,y=new Y(new Vt(M,h,v),u[S%u.length]);y.position.y=h/2,y.castShadow=!0,y.receiveShadow=!0,m.add(y);const E=Yi(160,320,.28+Math.random()*.36),T=new J({map:E,color:10414079,roughness:.24,metalness:.12,emissive:1724259,emissiveIntensity:.22});for(const _ of[-1,1]){const A=new Y(new De(M*.82,h*.74),T);A.position.set(0,h*.53,_*(v/2+.08)),A.rotation.y=_<0?Math.PI:0,m.add(A)}const P=new Y(new Vt(M*1.08,1.2,v*1.08),f);if(P.position.y=h+.7,m.add(P),Math.random()<.32){const _=new Y(new pe(.18,.3,10+Math.random()*12,8),f);_.position.y=h+6.5,m.add(_)}const C=Math.hypot(M,v)*.65,b=xn(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),C,240,60);b&&(m.position.set(b.x,-5,b.z),m.rotation.y=Math.random()*Math.PI,Wt.add(m),gn("building",b.x,b.z,C,240))}const p=new J({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22}),g=new J({color:16766574,roughness:.32,metalness:.05,emissive:9061888,emissiveIntensity:.28});for(let S=0;S<12;S++){const m=new oe,h=new Y(new Vt(20+Math.random()*16,7+Math.random()*4,.5),g);h.position.y=10,m.add(h);for(const v of[-7,7]){const y=new Y(new pe(.24,.32,10,8),p);y.position.set(v,5,-.2),m.add(y)}const M=xn(()=>({x:-780+Math.random()*1560,z:-450-S*135+Math.random()*80-40}),22,175,50);M&&(m.position.set(M.x,de(M.x,M.z)+.5,M.z),m.rotation.y=-.35+Math.random()*.7,Wt.add(m),gn("billboard",M.x,M.z,22,175))}}function Cg(){for(let h=0;h<3;h++){const M=[9418953,10995926,12770278][h],v=new we({color:M,transparent:!0,opacity:.55-h*.12,depthWrite:!1,fog:!1}),y=60,E=5200,T=new De(E,360,y,1),P=T.attributes.position;for(let b=0;b<=y;b++){const _=b/y,A=(Math.sin(_*22+h*3)*.5+Math.sin(_*9+h)*.5)*70+120;P.setY(b,A),P.setY(b+y+1,-180)}P.needsUpdate=!0;const C=new Y(T,v);C.position.set(0,40,-2300-h*360),Wt.add(C)}const i=new J({color:5583649,roughness:.9}),t=[new J({color:3837754,roughness:.9}),new J({color:7319100,roughness:.92}),new J({color:13075258,roughness:.9}),new J({color:15182276,roughness:.88})];for(let h=0;h<48;h++){const M=.7+Math.random()*1.2,v=9*M,y=xn(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),v,150,36);if(!y)continue;const{x:E,z:T}=y;if(ec(E,T,18))continue;const P=de(E,T)+.6,C=new oe,b=2.6+Math.random()*3.4,_=new Y(new pe(.34,.5,b,6),i);_.position.y=b/2,C.add(_);const A=t[Math.floor(Math.random()*t.length)],D=3+Math.floor(Math.random()*3);for(let F=0;F<D;F++){const k=2.4+Math.random()*1.8,V=new Y(new en(k,9,7),A);V.position.set((Math.random()-.5)*3,b+1.6+Math.random()*2.2,(Math.random()-.5)*3),V.scale.y=.82+Math.random()*.3,C.add(V)}C.position.set(E,P,T),C.scale.setScalar(M),Wt.add(C),gn("tree",E,T,v,150)}const e=[new J({color:7762025,roughness:1,flatShading:!0,side:ue}),new J({color:9077368,roughness:1,flatShading:!0,side:ue}),new J({color:6249043,roughness:1,flatShading:!0,side:ue})];for(let h=0;h<70;h++){const M=2+Math.random()*7,v=xn(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),M,70,30);if(!v)continue;const{x:y,z:E}=v,T=new Y(new $o(M,0),e[h%e.length]),P=T.geometry.attributes.position;for(let C=0;C<P.count;C++)P.setXYZ(C,P.getX(C)*(.8+Math.random()*.4),P.getY(C)*(.6+Math.random()*.4),P.getZ(C)*(.8+Math.random()*.4));P.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(y,de(y,E)+M*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,Wt.add(T),Ps.push({kind:"rock",x:y,z:E,radius:M*1.12}),gn("rock",y,E,M,70)}const n=[11969084,9416262,7314255,13218138,8228670];for(let h=0;h<14;h++){const M=130+Math.random()*200,v=130+Math.random()*200,y=xn(()=>({x:-1500+Math.random()*3e3,z:-700-Math.random()*1700}),Math.max(M,v)*.5,40,24);if(!y)continue;const{x:E,z:T}=y,P=new oe,C=5+Math.floor(Math.random()*4),b=n[Math.floor(Math.random()*n.length)];for(let _=0;_<C;_++){const A=new J({color:_%2?b:n[Math.floor(Math.random()*n.length)],roughness:1}),D=new Y(new De(M,v/C),A);D.rotation.x=-Math.PI/2,D.position.set(0,.05,-v/2+(_+.5)*(v/C)),P.add(D)}P.position.set(E,de(E,T)+.05,T),P.rotation.y=Math.random()*Math.PI,Wt.add(P),gn("field",E,T,Math.max(M,v)*.5,40)}{const h=xn(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(h){const M=new J({color:4165552,roughness:.12,metalness:.35,transparent:!0,opacity:.88}),v=new Y(new wn(150,40),M);v.rotation.x=-Math.PI/2,v.position.set(h.x,-6.4,h.z),v.scale.set(1.5,1,1),Wt.add(v),gn("lake",h.x,h.z,170,60),mi(v,y=>{M.opacity=.84+Math.sin(y*.8)*.05,v.rotation.z=Math.sin(y*.2)*.02})}}const s=new J({color:15922422,roughness:.5,metalness:.2});for(let h=0;h<9;h++){const M=h/9*Math.PI*2+.6,v=1500+Math.random()*700,y=Math.cos(M)*v,E=Math.sin(M)*v-1150,T=60+Math.random()*40,P=new oe,C=new Y(new pe(1.1,2.2,T,10),s);C.position.y=T/2,P.add(C);const b=new oe;b.position.set(0,T,3);const _=new Y(new Vt(3,3,7),s);b.add(_);const A=new oe;A.position.z=3.5;for(let F=0;F<3;F++){const k=new Y(new Vt(1.1,26,.5),s);k.position.y=13;const V=new oe;V.add(k),V.rotation.z=F/3*Math.PI*2,A.add(V)}b.add(A),P.add(b),P.position.set(y,-8,E),P.rotation.y=Math.random()*Math.PI,Wt.add(P);const D=.5+Math.random()*.5;mi(A,F=>{A.rotation.z=F*D})}const r=new J({color:7041398,roughness:.6,metalness:.4}),a=new Mo({color:2764595,transparent:!0,opacity:.5});let o=null;for(let h=0;h<7;h++){const M=-1100+h*360,v=-1650-Math.sin(h*.7)*120,y=48,E=new oe,T=6;for(const C of[-1,1])for(const b of[-1,1]){const _=new Y(new pe(.4,.7,y,5),r);_.position.set(C*T,y/2,b*T),_.rotation.z=-C*.08,_.rotation.x=b*.08,E.add(_)}for(const C of[y*.6,y*.82,y]){const b=new Y(new Vt(T*4,.8,.8),r);b.position.y=C,E.add(b)}E.position.set(M,de(M,v)-2,v),Wt.add(E);const P=de(M,v)-2+y;if(o)for(const C of[-T*2,0,T*2]){const b=o.x+C,_=o.z,A=M+C,D=v,F=[],k=12;for(let H=0;H<=k;H++){const tt=H/k,X=Math.sin(tt*Math.PI)*6;F.push(new I(b+(A-b)*tt,o.y-X+(P-o.y)*tt,_+(D-_)*tt))}const V=new Hc(new Ie().setFromPoints(F),a);Wt.add(V)}o={x:M,y:P,z:v}}const c=new J({color:11680302,roughness:.6,metalness:.3}),l=new J({color:15263976,roughness:.6,metalness:.3});for(let h=0;h<5;h++){const M=xn(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!M)continue;const{x:v,z:y}=M,E=70+Math.random()*50,T=new oe,P=8;for(let A=0;A<P;A++){const D=new Y(new pe(.5,.7,E/P,4),A%2?l:c);D.position.y=(A+.5)*(E/P),D.rotation.y=Math.PI/4,T.add(D)}const C=new J({color:16722458,emissive:16718346,emissiveIntensity:2}),b=new Y(new en(1.1,10,8),C);b.position.y=E+1,T.add(b),T.position.set(v,de(v,y),y),Wt.add(T),gn("mast",v,y,8,120);const _=Math.random()*Math.PI*2;mi(b,A=>{C.emissiveIntensity=Math.sin(A*2.4+_)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let h=0;h<6;h++){const M=new oe,v=d[h%d.length],y=new J({map:Ig(v[0],v[1]),roughness:.5,metalness:.05,emissive:new Xt(v[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new Y(new en(11,20,16),y);E.scale.y=1.25,M.add(E);const T=new Y(new Vt(3.4,3,3.4),new J({color:8014371,roughness:.9}));T.position.y=-17,M.add(T);const P=new Mo({color:3811866});for(const D of[-1,1])for(const F of[-1,1]){const k=new Hc(new Ie().setFromPoints([new I(D*1.6,-15.5,F*1.6),new I(D*7,-3,F*7)]),P);M.add(k)}const C=-700+Math.random()*1400,b=-700-Math.random()*1200,_=280+Math.random()*100;M.position.set(C,_,b),Wt.add(M);const A=Math.random()*Math.PI*2;mi(M,D=>{M.position.y=_+Math.sin(D*.5+A)*6,M.position.x=C+Math.sin(D*.08+A)*90,M.rotation.z=Math.sin(D*.4+A)*.04})}const u=new we({color:2829104,side:ue,fog:!1});function f(){const h=new vh;return h.moveTo(0,0),h.lineTo(-2.6,1.1),h.lineTo(-2.2,.2),h.lineTo(0,.5),h.lineTo(2.2,.2),h.lineTo(2.6,1.1),h.lineTo(0,0),new Y(new Ko(h),u)}for(let h=0;h<5;h++){const M=new oe,v=5+Math.floor(Math.random()*5),y=[];for(let A=0;A<v;A++){const D=f(),F=A%2?1:-1,k=Math.ceil(A/2);D.position.set(F*k*5,-k*2.4,0),D.rotation.x=-Math.PI/2,M.add(D),y.push(D)}const E=150+Math.random()*120,T=-500-Math.random()*1400,P=18+Math.random()*14,C=1400,b=-700+Math.random()*1400;M.position.set(b,E,T),Wt.add(M);const _=Math.random()*Math.PI*2;mi(M,(A,D)=>{M.position.x+=P*D,M.position.x>C&&(M.position.x=-C);const F=Math.sin(A*6+_);for(const k of y)k.rotation.x=-Math.PI/2+F*.4})}{const h=new oe,M=new J({color:14673644,roughness:.4,metalness:.2}),v=new Y(new en(20,20,16),M);v.scale.set(2.6,1,1),h.add(v);const y=new J({color:13781835,roughness:.6});for(let b=0;b<3;b++){const _=new Y(new Vt(10,9,.6),y);_.position.x=-46,_.rotation.x=b/3*Math.PI*2,h.add(_)}const E=new Y(new Vt(10,4,4),new J({color:3356475,roughness:.7}));E.position.y=-19,h.add(E);const T=new Y(new De(40,10),new we({map:nc("STEEL RIBBON"),transparent:!0,side:ue}));T.position.set(60,0,0),h.add(T);const P=900,C=240;h.position.set(0,C,-1200),Wt.add(h),mi(h,b=>{const _=b*.05;h.position.x=Math.cos(_)*P,h.position.z=-1200+Math.sin(_)*P*.5,h.position.y=C+Math.sin(b*.3)*8,h.rotation.y=-_+Math.PI/2})}const p=new we({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let h=0;h<14;h++){const M=new Y(new De(220+Math.random()*360,16+Math.random()*22),p.clone());M.material.opacity=.12+Math.random()*.18,M.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),M.rotation.x=-Math.PI/2.1,M.rotation.z=Math.random()*Math.PI,M.scale.y=.3,Wt.add(M);const v=2+Math.random()*3;mi(M,(y,E)=>{M.position.x+=v*E,M.position.x>1400&&(M.position.x=-1400)})}const g=new J({color:13620954,roughness:.6,metalness:.2}),S=new we({map:Ug(),side:ue});for(let h=0;h<4;h++){const M=xn(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!M)continue;const{x:v,z:y}=M,E=new oe,T=60+Math.random()*40,P=new Y(new Vt(T,1.4,26),g);P.position.set(0,26,-4),P.rotation.x=-.32,E.add(P);const C=new Y(new De(T*.94,24),S);C.position.set(0,12,6),C.rotation.x=-.85,E.add(C);for(const b of[-T/2,T/2]){const _=new Y(new Vt(1.4,26,1.4),g);_.position.set(b,13,-8),E.add(_)}E.position.set(v,de(v,y),y),E.rotation.y=Math.atan2(-v,-y)+(Math.random()-.5)*.5,Wt.add(E),gn("grandstand",v,y,40,30)}const m=[16731486,16765503,16777215,11824127];for(let h=0;h<90;h++){const M=xn(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!M)continue;const{x:v,z:y}=M,E=new oe,T=m[Math.floor(Math.random()*m.length)],P=new we({color:T,side:ue}),C=5+Math.floor(Math.random()*6);for(let b=0;b<C;b++){const _=new Y(new wn(.5+Math.random()*.4,5),P);_.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),_.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,_.rotation.z=Math.random()*Math.PI,E.add(_)}E.position.set(v,de(v,y),y),Wt.add(E),gn("flowers",v,y,3,20)}}const ni=[],Hn=[],Ps=[],Hr=[];function Rg(){const i=new oe,t=new Le;new qn().setFromAxisAngle(new I(1,0,0),-Math.PI/2);const e=gi.x0,n=gi.x1,s=gi.zNear,r=gi.zFar,a=gi.pitch,o=gi.streetW,c=a-o,l=[];for(let Q=e;Q<=n+1;Q+=a)l.push({x0:Q,z0:s,x1:Q,z1:r});for(let Q=s;Q>=r-1;Q-=a)l.push({x0:e,z0:Q,x1:n,z1:Q});function d(Q,Z,lt){const st=[],xt=[];for(const St of Q){const L=St.x1-St.x0,w=St.z1-St.z0,O=Math.hypot(L,w),$=Math.max(1,Math.round(O/14)),nt=L/O,Pt=-(w/O),mt=nt;let Tt=null,Et=null;for(let rt=0;rt<=$;rt++){const ct=rt/$,Ft=ct*O/68,It=St.x0+L*ct,yt=St.z0+w*ct,zt=It+Pt*Z,N=yt+mt*Z,gt=It-Pt*Z,pt=yt-mt*Z,ut=[zt,de(zt,N)+lt,N,Ft],at=[gt,de(gt,pt)+lt,pt,Ft];Tt&&(st.push(Tt[0],Tt[1],Tt[2],Et[0],Et[1],Et[2],at[0],at[1],at[2]),st.push(Tt[0],Tt[1],Tt[2],at[0],at[1],at[2],ut[0],ut[1],ut[2]),xt.push(0,Tt[3],1,Et[3],1,at[3]),xt.push(0,Tt[3],1,at[3],0,ut[3])),Tt=ut,Et=at}}const ot=new Ie;return ot.setAttribute("position",new re(st,3)),ot.setAttribute("uv",new re(xt,2)),ot.computeVertexNormals(),ot}const u=new J({map:Sg(),color:13097186,roughness:.34,metalness:.24,envMapIntensity:1.25,side:ue}),f=new Y(d(l,o/2,.55),u);f.receiveShadow=!0,i.add(f);const p=new J({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:ue});i.add(new Y(d(l,.4,.62),p));const g=new we({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:ue,blending:$i}),S=new we({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:ue,blending:$i});for(let Q=0;Q<120;Q++){const Z=l[Math.random()*l.length|0],lt=Math.random(),st=Z.x0+(Z.x1-Z.x0)*lt,xt=Z.z0+(Z.z1-Z.z0)*lt;if(Vn(st,xt,4).clearance<2)continue;const ot=new Y(new wn(1,18),(Q%4===0?S:g).clone());ot.rotation.x=-Math.PI/2,ot.rotation.z=Math.atan2(Z.x1-Z.x0,Z.z1-Z.z0)+(Math.random()-.5)*.35,ot.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),ot.position.set(st+(Math.random()-.5)*o*.7,de(st,xt)+.66,xt+(Math.random()-.5)*o*.7),i.add(ot)}const m=[Yi(160,320,.5),Yi(160,320,.62),Yi(160,320,.42)],h=[new J({map:m[0],color:7042688,roughness:.42,metalness:.26,emissive:2315117,emissiveIntensity:.34}),new J({map:m[1],color:8550507,roughness:.46,metalness:.22,emissive:4860952,emissiveIntensity:.32}),new J({map:m[2],color:4414064,roughness:.4,metalness:.3,emissive:1523562,emissiveIntensity:.38})],M=new Vt(1,1,1),v=[[],[],[]],y=[],E=[],T=[],P=[],C=[],b=[],_=[],A=[12097375,13217930,10251087,11055285,13681832,9412234,12544602,8227475];function D(Q,Z,lt,st,xt){const ot=de(Q,Z)-1;if(t.position.set(Q,ot+xt/2,Z),t.quaternion.identity(),t.scale.set(lt,xt,st),t.updateMatrix(),v[Math.random()*3|0].push(t.matrix.clone()),t.position.set(Q,ot+xt+.6,Z),t.scale.set(lt*1.04,1.2,st*1.04),t.updateMatrix(),y.push(t.matrix.clone()),xt>26){const St=Math.random()<.72?3790847:16730294;for(const L of[-1,1])t.position.set(Q,ot+xt+1.35,Z+L*(st*.52+.12)),t.scale.set(lt*1.12,.22,.18),t.updateMatrix(),E.push(t.matrix.clone()),T.push(St);Math.random()<.34&&P.push({px:Q,pz:Z,w:lt,d:st,h:xt,gy:ot,zSide:Math.random()<.5?-1:1})}ni.push({x:Q,z:Z,hw:lt*.5,hd:st*.5,maxY:ot+xt+2})}function F(Q,Z,lt,st,xt){const ot=de(Q,Z)-.4,St=2+Math.random()*2.4;t.position.set(Q,ot+xt/2,Z),t.quaternion.identity(),t.scale.set(lt,xt,st),t.updateMatrix(),C.push(t.matrix.clone()),ni.push({x:Q,z:Z,hw:lt*.5,hd:st*.5,maxY:ot+xt+St+1.5}),b.push(A[Math.random()*A.length|0]),t.position.set(Q,ot+xt+St/2,Z),t.scale.set(lt*.82,St,st*.82),t.updateMatrix(),_.push(t.matrix.clone())}for(let Q=e+a/2;Q<=n-a/2;Q+=a)for(let Z=s-a/2;Z>=r+a/2;Z-=a){const lt=Vn(Q,Z,c*.5).clearance;if(!(lt<2))if(lt<90){const xt=c/3;for(let ot=0;ot<3;ot++)for(let St=0;St<3;St++){if(Math.random()<.14)continue;const L=Q-c/2+xt*(ot+.5)+(Math.random()-.5)*xt*.3,w=Z-c/2+xt*(St+.5)+(Math.random()-.5)*xt*.3;if(Vn(L,w,8).clearance<1)continue;const O=xt*(.5+Math.random()*.22),$=xt*(.5+Math.random()*.22);Math.random()<.16?D(L,w,O*.9,$*.9,12+Math.random()*12):F(L,w,O,$,5+Math.random()*4.5)}}else{const st=lt>230,xt=st?Nt.clamp(50+lt*1.1,60,175):Nt.clamp(22+lt*.3,22,62),ot=2+(Math.random()<.72?1:0)+(Math.random()<.42?1:0);for(let St=0;St<ot;St++){const L=13+Math.random()*Math.min(26,c*.44),w=13+Math.random()*Math.min(26,c*.44),O=Q+(Math.random()-.5)*(c-L),$=Z+(Math.random()-.5)*(c-w);if(Vn(O,$,Math.hypot(L,w)*.5).clearance<2)continue;const nt=(18+Math.random()*(xt-18))*(st&&Math.random()<.2?1.35:1);D(O,$,L,w,nt)}}}for(let Q=0;Q<3;Q++){if(!v[Q].length)continue;const Z=new cn(M,h[Q],v[Q].length);for(let lt=0;lt<v[Q].length;lt++)Z.setMatrixAt(lt,v[Q][lt]);Z.instanceMatrix.needsUpdate=!0,Z.castShadow=!0,Z.receiveShadow=!0,i.add(Z)}if(y.length){const Q=new J({color:2896696,roughness:.62,metalness:.34}),Z=new cn(M,Q,y.length);for(let lt=0;lt<y.length;lt++)Z.setMatrixAt(lt,y[lt]);Z.instanceMatrix.needsUpdate=!0,i.add(Z)}if(E.length){const Q=new J({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),Z=new cn(M,Q,E.length);for(let lt=0;lt<E.length;lt++)Z.setMatrixAt(lt,E[lt]),Z.setColorAt(lt,new Xt(T[lt]));Z.instanceMatrix.needsUpdate=!0,Z.instanceColor&&(Z.instanceColor.needsUpdate=!0),i.add(Z)}if(C.length){const Q=new J({roughness:.85,metalness:.04}),Z=new cn(M,Q,C.length);for(let ot=0;ot<C.length;ot++)Z.setMatrixAt(ot,C[ot]),Z.setColorAt(ot,new Xt(b[ot]));Z.instanceMatrix.needsUpdate=!0,Z.instanceColor&&(Z.instanceColor.needsUpdate=!0),Z.castShadow=!0,Z.receiveShadow=!0,i.add(Z);const lt=new ri(.72,1,4);lt.rotateY(Math.PI/4);const st=new J({color:7224112,roughness:.82}),xt=new cn(lt,st,_.length);for(let ot=0;ot<_.length;ot++)xt.setMatrixAt(ot,_[ot]);xt.instanceMatrix.needsUpdate=!0,xt.castShadow=!0,i.add(xt)}const k=["HOTEL","OPEN","AUTO","RACE","CAFE"];for(let Q=0;Q<Math.min(P.length,18);Q++){const Z=P[Q],lt=k[Q%k.length],st=Q%3===0?"#ff4fb7":Q%3===1?"#4ff3ff":"#ffd45b",xt=new we({map:Al(lt,st),transparent:!0,side:ue,depthWrite:!1}),ot=new Y(new De(8,24),xt);ot.position.set(Z.px,Z.gy+Math.max(14,Z.h*.58),Z.pz+Z.zSide*(Z.d*.5+.25)),ot.rotation.y=Z.zSide<0?Math.PI:0,i.add(ot)}const V=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],H=new Vt(2.2,1.4,4.6),tt=130,X=new cn(H,new J({roughness:.42,metalness:.36}),tt);let ht=0,dt=0;for(;ht<tt&&dt<tt*6;){dt++;const Q=Math.random()<.5,Z=Q?e+Math.round(Math.random()*((n-e)/a))*a+(Math.random()<.5?-1:1)*(o*.26):e+Math.random()*(n-e),lt=Q?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(Vn(Z,lt,4).clearance<2)continue;const st=de(Z,lt)+.7;t.position.set(Z,st,lt),t.quaternion.setFromAxisAngle(Ve,Q?0:Math.PI/2),t.scale.set(1,1,1),t.updateMatrix(),X.setMatrixAt(ht,t.matrix),X.setColorAt(ht,new Xt(V[Math.random()*V.length|0])),ht++}X.count=ht,X.instanceMatrix.needsUpdate=!0,X.instanceColor&&(X.instanceColor.needsUpdate=!0),i.add(X);const Lt=new pe(.12,.16,7.2,7),jt=new en(.46,10,8),ie=new De(2.8,13),me=new J({color:1581353,roughness:.42,metalness:.68}),xe=new J({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),j=new we({color:16760163,transparent:!0,opacity:.16,depthWrite:!1,side:ue,blending:$i}),it=132,wt=new cn(Lt,me,it),Gt=new cn(jt,xe,it),Dt=new cn(ie,j,it);let qt=0;for(let Q=0;Q<it*2&&qt<it;Q++){const Z=Math.random()<.5,lt=Z?e+Math.round(Math.random()*((n-e)/a))*a+(Math.random()<.5?-1:1)*(o*.58):e+Math.random()*(n-e),st=Z?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(Vn(lt,st,3).clearance<2)continue;const xt=de(lt,st);t.quaternion.identity(),t.position.set(lt,xt+3.6,st),t.scale.set(1,1,1),t.updateMatrix(),wt.setMatrixAt(qt,t.matrix),t.position.set(lt,xt+7.5,st),t.updateMatrix(),Gt.setMatrixAt(qt,t.matrix),t.position.set(lt,xt+.72,st),t.quaternion.setFromAxisAngle(new I(1,0,0),-Math.PI/2),t.rotateZ(Z?0:Math.PI/2),t.scale.set(1,1,1),t.updateMatrix(),Dt.setMatrixAt(qt,t.matrix),qt++}wt.count=qt,Gt.count=qt,Dt.count=qt,wt.instanceMatrix.needsUpdate=!0,Gt.instanceMatrix.needsUpdate=!0,Dt.instanceMatrix.needsUpdate=!0,i.add(wt,Gt,Dt);const Ue=new J({color:10397084,roughness:.58,metalness:.04}),Jt=new J({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12});i.add(new Y(d([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),Ue)),i.add(new Y(d([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),Ue)),i.add(new Y(d([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),Jt));function le(Q,Z,lt,st,xt,ot,St,L=null,w=0){const O=de(Q,Z)-.45,$=Q<80?1:-1,nt=new J({map:Yi(192,512,St),color:ot,roughness:.38,metalness:.26,emissive:1719900,emissiveIntensity:.44}),q=new Y(new Vt(lt,xt,st),nt);q.position.set(Q,O+xt/2,Z),q.castShadow=!0,q.receiveShadow=!0,i.add(q);const Pt=new J({map:Yi(220,620,Math.min(.86,St+.18)),color:16777215,roughness:.2,metalness:.14,emissive:1386040,emissiveIntensity:.12,transparent:!0,opacity:.94,side:ue}),mt=new Y(new De(st*.78,xt*.74),Pt);mt.position.set(Q+$*(lt/2+.09),O+xt*.54,Z),mt.rotation.y=$>0?Math.PI/2:-Math.PI/2,i.add(mt);const Tt=new Y(new Vt(lt*1.04,1.2,st*1.04),new J({color:1778733,roughness:.34,metalness:.38}));Tt.position.set(Q,O+xt+.7,Z),i.add(Tt);const Et=new J({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const rt of[-1,1]){const ct=new Y(new Vt(lt*1.1,.22,.18),Et);ct.position.set(Q,O+xt+1.4,Z+rt*(st/2+.18)),i.add(ct)}if(L&&w){const rt=new we({map:Al(L,L==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:ue,depthWrite:!1}),ct=new Y(new De(7.5,24),rt);ct.position.set(Q+w*(lt/2+.3),O+Math.min(xt-8,xt*.58),Z),ct.rotation.y=w>0?Math.PI/2:-Math.PI/2,i.add(ct)}ni.push({x:Q,z:Z,hw:lt*.5,hd:st*.5,maxY:O+xt+2})}function U(Q,Z,lt,st,xt,ot){const St=de(Q,Z)-.3,L=new Y(new Vt(lt,xt,st),new J({color:13682616,roughness:.62,metalness:.04}));L.position.set(Q,St+xt/2,Z),L.castShadow=!0,L.receiveShadow=!0,i.add(L);const w=new Y(new ri(.82,1,4),new J({color:ot,roughness:.48,metalness:.18,emissive:4000003,emissiveIntensity:.12}));w.geometry.rotateY(Math.PI/4),w.position.set(Q,St+xt+2.1,Z),w.scale.set(lt*.82,4.2,st*.82),w.castShadow=!0,i.add(w);const O=new Y(new Vt(5,7,.25),new J({color:16730669,roughness:.28,emissive:16719632,emissiveIntensity:.45}));O.position.set(Q,St+3.6,Z-st/2-.16),i.add(O),ni.push({x:Q,z:Z,hw:lt*.5,hd:st*.5,maxY:St+xt+5})}return le(-10,126,48,72,122,2569797,.7,null,0),le(166,86,56,82,78,2306624,.66,"HOTEL",-1),le(-34,-90,46,64,92,3424848,.58,"AUTO",1),le(178,-164,62,72,104,3030868,.62,null,0),le(-48,-360,54,86,148,2439765,.58,null,0),le(172,-430,50,80,132,3817032,.66,"OPEN",-1),U(-36,270,64,52,18,12927269),U(168,238,42,44,14,12546102),Wt.add(i),i}function Pg(i,t=1){const n=ce(16),s=new I(n.tangent.x,0,n.tangent.z).normalize(),r=new I().crossVectors(Ve,s).normalize(),a=n.p.clone().addScaledVector(n.side,t*K.width*.5),o=165,c=52,l=a.x-s.x*o+r.x*t*c,d=a.z-s.z*o+r.z*t*c,u=new I(l,de(l,d)+.4,d),f=26,p=[];for(let A=0;A<=f;A++){const D=A/f,F=D*D*(3-2*D);p.push(new I(Nt.lerp(u.x,a.x,D),Nt.lerp(u.y,a.y,F),Nt.lerp(u.z,a.z,D)))}const g=5.5,S=new I,m=new I,h=[],M=[];for(let A=0;A<=f;A++)m.subVectors(p[Math.min(f,A+1)],p[Math.max(0,A-1)]),m.y=0,m.normalize(),S.crossVectors(Ve,m).normalize(),h.push(p[A].clone().addScaledVector(S,-g)),M.push(p[A].clone().addScaledVector(S,g));const v={kind:"ramp",halfW:g,dirSel:t,mergeS:16,points:p.map(A=>A.clone()),segments:[]};for(let A=0;A<f;A++){const D=p[A],F=p[A+1],k=F.x-D.x,V=F.z-D.z,H=Math.max(1e-4,k*k+V*V);v.segments.push({a:D.clone(),b:F.clone(),abx:k,abz:V,lenSq:H,u0:A/f,u1:(A+1)/f})}Hr.push(v);const y=[];for(let A=0;A<f;A++){const D=h[A],F=M[A],k=h[A+1],V=M[A+1];y.push(D.x,D.y,D.z,F.x,F.y,F.z,V.x,V.y,V.z),y.push(D.x,D.y,D.z,V.x,V.y,V.z,k.x,k.y,k.z)}const E=new Ie;E.setAttribute("position",new re(y,3)),E.computeVertexNormals();const T=new J({color:2895665,roughness:.85,metalness:.05,side:ue});i.add(new Y(E,T));const P=new J({color:12107972,roughness:.5,metalness:.4});for(let A=0;A<f;A++)on(i,h[A].clone().setY(h[A].y+1),h[A+1].clone().setY(h[A+1].y+1),.16,P),on(i,M[A].clone().setY(M[A].y+1),M[A+1].clone().setY(M[A+1].y+1),.16,P);const C=new J({color:7173241,roughness:.82});for(let A=3;A<f;A+=3){const D=p[A],F=de(D.x,D.z),k=D.y-F;if(k<3)continue;const V=new Y(new pe(.9,1.15,k,8),C);V.position.set(D.x,F+k/2,D.z),i.add(V),Hn.push({x:D.x,z:D.z,hw:1.3,hd:1.3,maxY:D.y-.9})}const b=new we({map:nc("ON RAMP"),transparent:!0,side:ue}),_=new Y(new De(12,3),b);_.position.copy(u).add(new I(0,5.5,0)),_.rotation.y=Math.atan2(-s.x,-s.z),i.add(_);for(const A of[-1,1]){const D=new Y(new pe(.2,.26,6,6),C);D.position.set(u.x+r.x*A*5.4,u.y+3,u.z+r.z*A*5.4),i.add(D)}}function Lg(){const i=new oe,t=[],e=new Xt(14170671),n=new Xt(15922680),s=new J({color:3883336,roughness:.6,metalness:.3}),r=new we({map:Dg(),transparent:!0,side:ue}),a=new J({color:4926748,roughness:.9}),o=[new J({color:2055221,roughness:.92}),new J({color:3109954,roughness:.95}),new J({color:2583370,roughness:.9})],c=new J({color:7040883,roughness:.95,side:ue}),l=12,d=[],u=[];let f=0;for(let g=0;g<K.length;g+=l){if(Ti(g+l*.5)){f++;continue}const S=ce(g),m=ce(g+l),h=S.p.clone().add(m.p).multiplyScalar(.5),{sideways:M,normal:v,q:y}=ii(S,m);for(const E of[-1,1]){const T=h.clone().addScaledVector(M,E*K.width*.5).addScaledVector(v,.5);d.push(T),u.push(y),t.push(f%2===0?e:n)}if(f%16===8){const E=(f>>4)%2?1:-1,T=h.clone().addScaledVector(M,E*K.width*.52).addScaledVector(v,.4),P=new oe,C=new Y(new De(4.4,2.6),r);C.position.y=3.4,C.rotation.y=Math.PI,P.add(C);const b=new pe(.12,.16,3.4,5);for(const _ of[-1.5,1.5]){const A=new Y(b,s);A.position.set(_,1.7,0),P.add(A)}P.position.copy(T),P.quaternion.copy(y),i.add(P)}f++}for(let g=0;g<K.length;g+=16){const S=ce(g),m=1+(Math.random()<.5?1:0);for(let h=0;h<m;h++){const M=Math.random()<.5?-1:1,v=K.width/2+12+Math.random()*78,y=S.p.x+S.side.x*v*M+(Math.random()-.5)*16,E=S.p.z+S.side.z*v*M+(Math.random()-.5)*16;if(ec(y,E,18))continue;const T=de(y,E);if(Math.random()<.78){const P=.7+Math.random()*1.5,C=new oe,b=2.4+Math.random()*4.2,_=new Y(new pe(.26,.42,b,6),a);_.position.y=b/2,C.add(_);const A=2+Math.floor(Math.random()*3);for(let D=0;D<A;D++){const F=new Y(new ri(2.4+Math.random()*1.6-D*.2,4.6+Math.random()*2.4,7),o[(h+D+g)%o.length]);F.position.y=b+D*1.4+1.5,F.rotation.y=Math.random()*Math.PI,C.add(F)}C.position.set(y,T+.6,E),C.scale.setScalar(P),i.add(C)}else{const P=1.4+Math.random()*3.6,C=new Y(new qo(P,0),c);C.position.set(y,T+P*.35,E),C.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),C.scale.set(1,.7+Math.random()*.4,1),i.add(C),Hn.push({kind:"rock",x:y,z:E,radius:P*1.18})}}}const p=["START","SECTOR 2","SECTOR 3"];for(let g=0;g<3;g++){const S=K.length*g/3+6;if(Ti(S))continue;const m=ce(S),h=ce(S+l),M=m.p.clone().add(h.p).multiplyScalar(.5),{q:v}=ii(m,h),y=K.width*.5+1.2,E=9,T=new oe,P=new pe(.4,.55,E,7);for(const D of[-1,1]){const F=new Y(P,s);F.position.set(D*y,E/2,0),T.add(F)}const C=y*2,b=new Y(new Vt(C,1.1,1.1),s);b.position.y=E,T.add(b);const _=new we({map:nc(p[g]),transparent:!0,side:ue}),A=new Y(new De(C*.82,3),_);A.position.set(0,E-2,0),A.rotation.y=Math.PI,T.add(A),T.position.copy(M),T.quaternion.copy(v),i.add(T)}if(d.length){const g=new pe(.18,.24,3,6);g.translate(0,1.5,0);const S=new en(.34,8,6);S.translate(0,3.2,0);const m=new J({color:10134440,roughness:.7,metalness:.2}),h=new J({roughness:.55}),M=new cn(g,m,d.length),v=new cn(S,h,d.length),y=new Le;for(let E=0;E<d.length;E++)y.position.copy(d[E]),y.quaternion.copy(u[E]),y.updateMatrix(),M.setMatrixAt(E,y.matrix),v.setMatrixAt(E,y.matrix),v.setColorAt(E,t[E]);M.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),i.add(M),i.add(v)}return Pg(i),Wt.add(i),i}function Dg(){const i=document.createElement("canvas");i.width=256,i.height=160;const t=i.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,i.width,i.height),t.fillStyle="#ffd23f",t.lineWidth=0;for(let n=-1;n<4;n++){t.beginPath();const s=n*70;t.moveTo(s,16),t.lineTo(s+40,i.height/2),t.lineTo(s,i.height-16),t.lineTo(s+18,i.height-16),t.lineTo(s+58,i.height/2),t.lineTo(s+18,16),t.closePath(),t.fill()}const e=new Tn(i);return e.colorSpace=be,e}function nc(i){const t=document.createElement("canvas");t.width=512,t.height=128;const e=t.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,t.width,t.height),e.fillStyle="#ffd23f",e.fillRect(0,0,t.width,8),e.fillRect(0,t.height-8,t.width,8),e.fillStyle="#ffffff",e.font="bold 64px sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText(i,t.width/2,t.height/2);const n=new Tn(t);return n.colorSpace=be,n}function Ig(i,t){const e=document.createElement("canvas");e.width=128,e.height=64;const n=e.getContext("2d"),s="#"+i.toString(16).padStart(6,"0"),r="#"+t.toString(16).padStart(6,"0"),a=8;for(let c=0;c<a;c++)n.fillStyle=c%2?s:r,n.fillRect(c/a*e.width,0,e.width/a+1,e.height);const o=new Tn(e);return o.colorSpace=be,o}function Ug(){const i=document.createElement("canvas");i.width=256,i.height=128;const t=i.getContext("2d");t.fillStyle="#2a3138",t.fillRect(0,0,i.width,i.height);const e=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){t.fillStyle=e[Math.random()*e.length|0];const r=Math.random()*i.width,a=Math.random()*i.height;t.fillRect(r,a,2.4,2.4)}const n=new Tn(i);return n.colorSpace=be,n.wrapS=hn,n.repeat.set(3,1),n}function Se(i,t,e,n,s){const r=new Y(new Vt(t.x,t.y,t.z),s);return r.position.copy(e),r.quaternion.copy(n),r.castShadow=!1,r.receiveShadow=!0,i.add(r),r}function ii(i,t){const e=t.p.clone().sub(i.p).normalize(),n=Uh.crossVectors(Ve,e).normalize();let s=e.clone().cross(n).normalize();const r=(i.bank+t.bank)*.5;if(Math.abs(r)>.001){const c=new qn().setFromAxisAngle(e,r);n.applyQuaternion(c),s.applyQuaternion(c)}const a=new he().makeBasis(n,s,e),o=new qn().setFromRotationMatrix(a);return{tangent:e,sideways:n,normal:s,q:o}}function Rl(i,t,e,n){const r=[],a=[],o=[],c=K.width*.47;let l=0;for(let f=t;f<=e;f+=8){const p=ce(Math.min(f,e)),g=ii(p,ce(p.s+2)),S=Math.sin(f*.018)*.04,m=p.p.clone().addScaledVector(g.sideways,-c).addScaledVector(g.normal,.46+S),h=p.p.clone().addScaledVector(g.sideways,c).addScaledVector(g.normal,.46-S);r.push(m.x,m.y,m.z,h.x,h.y,h.z);const M=(f-t)/64;if(a.push(0,M,1,M),l>0){const v=(l-1)*2,y=l*2;o.push(v,v+1,y,v+1,y+1,y)}l++}const d=new Ie;d.setAttribute("position",new re(r,3)),d.setAttribute("uv",new re(a,2)),d.setIndex(o),d.computeVertexNormals();const u=new Y(d,n);u.receiveShadow=!0,i.add(u)}function Ng(i,t){let e=0;for(const n of K.gaps)Rl(i,e,Math.max(e,n.start-4),t),e=n.end+4;Rl(i,e,K.length,t)}function Fg(i,t,e){const n=ce(t.s+2),{normal:s,q:r}=ii(t,n),a=new oe;a.position.copy(t.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new Y(new Vt(.55,.12,5.2),e);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const c=new Y(new Vt(.55,.12,5.2),e);c.position.set(1.25,0,0),c.rotation.y=.62,a.add(c);const l=new Y(new Vt(.42,.1,3.8),e);l.position.set(0,.01,-1.9),a.add(l),i.add(a)}function Og(){const i=new oe;Wt.add(i);const t=new J({color:12171149,roughness:.72,metalness:.08}),e=new J({color:9869942,roughness:.78,metalness:.05}),n=new J({color:15255629,roughness:.28,metalness:.72}),s=new J({color:8204328,roughness:.3,metalness:.85}),r=new J({color:6120040,roughness:.5,metalness:.6}),a=new J({color:4080968,roughness:.58,metalness:.55}),o=new J({color:14270570,roughness:.35,metalness:.65}),c=new J({color:2435884,roughness:.48,metalness:.62}),l=new J({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new J({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new J({color:4935486,roughness:.92,metalness:.04}),f=new J({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),p=new J({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),g=new J({color:3159607,roughness:.7,metalness:.45}),S=new J({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),m=new J({color:15919561,roughness:.82,metalness:.02}),h=new J({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12}),M=new J({map:vg(),roughness:.74,metalness:.08}),v=new we({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),y=12;Ng(i,M);for(let E=0;E<K.length;E+=y){if(Ti(E+y*.5))continue;const T=ce(E),P=ce(E+y),C=T.p.clone().add(P.p).multiplyScalar(.5),{sideways:b,normal:_,q:A}=ii(T,P),D=T.p.distanceTo(P.p)+.45,F=Math.floor(E/(y*2))%2?t:e;Se(i,new I(K.width,.62,D),C.clone().addScaledVector(_,-.05),A,F),Se(i,new I(K.width-2.8,.08,D*.86),C.clone().addScaledVector(_,.36),A,u),Se(i,new I(.2,.1,D*.76),C.clone().addScaledVector(b,-K.width*.19).addScaledVector(_,.43),A,u),Se(i,new I(.2,.1,D*.76),C.clone().addScaledVector(b,K.width*.19).addScaledVector(_,.43),A,u),E%48===0&&(Se(i,new I(.14,.08,D*.62),C.clone().addScaledVector(b,-K.width*.08).addScaledVector(_,.51),A,S),Se(i,new I(.14,.08,D*.62),C.clone().addScaledVector(b,K.width*.08).addScaledVector(_,.51),A,S)),E%120===0&&Se(i,new I(K.width*.42,.07,.72),C.clone().addScaledVector(_,.55),A,m),Se(i,new I(K.width+1.2,.35,D*.94),C.clone().addScaledVector(_,-.56),A,a),Se(i,new I(.42,.42,D*.9),C.clone().addScaledVector(b,-K.width*.36).addScaledVector(_,-.78),A,g),Se(i,new I(.42,.42,D*.9),C.clone().addScaledVector(b,K.width*.36).addScaledVector(_,-.78),A,g);const k=C.clone().addScaledVector(b,-K.width*.51),V=C.clone().addScaledVector(b,K.width*.51);if(Se(i,new I(.32,.46,D),k.clone().addScaledVector(_,.28),A,n),Se(i,new I(.32,.46,D),V.clone().addScaledVector(_,.28),A,n),Se(i,new I(.26,.72,D*.94),k.clone().addScaledVector(_,-.22),A,a),Se(i,new I(.26,.72,D*.94),V.clone().addScaledVector(_,-.22),A,a),E%36===0)for(const H of[-K.width*.39,-K.width*.2,K.width*.2,K.width*.39]){const tt=new Y(new pe(.16,.2,.12,10),o);tt.position.copy(C).addScaledVector(b,H).addScaledVector(_,.46),tt.quaternion.copy(A),tt.castShadow=!1,i.add(tt)}if(E%72===0&&(Se(i,new I(.34,1.56,3.4),C.clone().addScaledVector(b,-K.width*.66).addScaledVector(_,1.16),A,s),Se(i,new I(.34,1.56,3.4),C.clone().addScaledVector(b,K.width*.66).addScaledVector(_,1.16),A,s),Se(i,new I(.18,.18,4.4),C.clone().addScaledVector(b,-K.width*.62).addScaledVector(_,1.94),A,s),Se(i,new I(.18,.18,4.4),C.clone().addScaledVector(b,K.width*.62).addScaledVector(_,1.94),A,s),Se(i,new I(.12,.12,4),C.clone().addScaledVector(b,-K.width*.62).addScaledVector(_,1.38),A,n),Se(i,new I(.12,.12,4),C.clone().addScaledVector(b,K.width*.62).addScaledVector(_,1.38),A,n),on(i,C.clone().addScaledVector(b,-K.width*.58).addScaledVector(_,-1.08),C.clone().addScaledVector(b,K.width*.58).addScaledVector(_,-1.08),.11,c),on(i,C.clone().addScaledVector(b,-K.width*.48).addScaledVector(_,-1),C.clone().addScaledVector(b,0).addScaledVector(_,-2.2),.09,c),on(i,C.clone().addScaledVector(b,K.width*.48).addScaledVector(_,-1),C.clone().addScaledVector(b,0).addScaledVector(_,-2.2),.09,c)),E%96===0){const H=new Y(new wn(1,28),v);H.rotation.x=-Math.PI/2,H.position.set(C.x,-4.72,C.z),H.scale.set(K.width*.9,Math.max(10,D*2.2),1),H.rotation.z=Math.atan2(ii(T,P).tangent.x,ii(T,P).tangent.z),i.add(H)}if(E%144===0){const H=C.clone().addScaledVector(b,-K.width*.74).addScaledVector(_,2),tt=C.clone().addScaledVector(b,K.width*.74).addScaledVector(_,2);on(i,H.clone().addScaledVector(_,-1.2),H.clone().addScaledVector(_,1.1),.12,s),on(i,tt.clone().addScaledVector(_,-1.2),tt.clone().addScaledVector(_,1.1),.12,s),Se(i,new I(.46,.72,.46),H.clone().addScaledVector(_,1.15),A,l),Se(i,new I(.46,.72,.46),tt.clone().addScaledVector(_,1.15),A,l)}if(E%288===0){const H=C.clone().addScaledVector(b,(Math.floor(E/144)%2?1:-1)*K.width*.92).addScaledVector(_,5.2);Se(i,new I(.44,.44,.44),H.clone(),A,f),on(i,H.clone().addScaledVector(_,-.2),C.clone().addScaledVector(_,1),.05,c)}if(E%168===0){const H=Math.max(18,C.y+8),tt=new I(C.x,C.y-H/2-.8,C.z),X=new Y(new pe(.8,1.3,H,8),r);X.position.copy(tt),X.castShadow=!0,X.receiveShadow=!0,i.add(X);const ht=new Y(new pe(2.2,2.7,.34,12),r);ht.position.set(C.x,C.y-H-.95,C.z),ht.receiveShadow=!0,i.add(ht),Hn.push({x:C.x,z:C.z,hw:2.6,hd:2.6,maxY:C.y-1.2});for(const jt of[-.35,-1.05]){const ie=new Y(new pe(.86,.92,.28,8),h);ie.position.set(C.x,C.y-H*.18+jt,C.z),ie.receiveShadow=!0,i.add(ie)}const dt=C.clone().addScaledVector(_,-.7),Lt=new I(C.x,C.y-H*.54,C.z);on(i,Lt.clone(),dt.clone().addScaledVector(b,-K.width*.38),.13,c),on(i,Lt.clone(),dt.clone().addScaledVector(b,K.width*.38),.13,c),on(i,Lt.clone().addScaledVector(b,-1.1),dt.clone().addScaledVector(b,.1).addScaledVector(_,-1.1),.08,c),on(i,Lt.clone().addScaledVector(b,1.1),dt.clone().addScaledVector(b,-.1).addScaledVector(_,-1.1),.08,c)}E%168===0&&!Ti(E+16)&&Fg(i,ce(E+5),d)}for(const E of K.gaps){const T=ce(E.start-3),P=ce(E.end+3);for(const C of[T,P]){const b=ce(C.s+2),{normal:_,q:A}=ii(C,b);Se(i,new I(K.width-1.2,.08,4.6),C.p.clone().addScaledVector(_,.54),A,l),Se(i,new I(K.width*.62,.09,1.3),C.p.clone().addScaledVector(_,.62).addScaledVector(C.tangent,C===T?-6.3:6.3),A,m);for(const D of[-K.width*.42,0,K.width*.42]){const F=C.p.clone().addScaledVector(C.side,D).addScaledVector(_,2.35);Se(i,new I(.46,.46,.46),F,A,D===0?p:l)}}}return i}function Bh(i=13710372,t=7740696){const e=new oe,n=new J({color:i,roughness:.32,metalness:.28}),s=new J({color:t,roughness:.42,metalness:.22}),r=new J({color:328965,roughness:.65}),a=new J({color:13621729,roughness:.18,metalness:.75}),o=new J({color:8840447,roughness:.08,metalness:.05,transparent:!0,opacity:.55}),c=new J({color:16722974,roughness:.18,metalness:.05,emissive:16719122,emissiveIntensity:1.1}),l=new J({color:16773285,roughness:.22,metalness:.05,emissive:16765019,emissiveIntensity:.7}),d=new J({color:16773820,roughness:.28,metalness:.2}),u=new J({color:2697513,roughness:.34,metalness:.72}),f=new Y(new wn(3.2,28),new we({color:0,transparent:!0,opacity:.22,depthWrite:!1}));f.rotation.x=-Math.PI/2,f.position.y=.08,f.scale.z=1.8,e.add(f);const p=new Y(new Vt(4.4,1,7.4),n);p.position.y=1,e.add(p);const g=new Y(new Vt(.72,.06,7.62),d);g.position.set(0,1.54,.05),e.add(g);for(const T of[-2.32,2.32]){const P=new Y(new Vt(.52,.54,3.2),s);P.position.set(T,.92,.85),e.add(P)}const S=new Y(new Vt(4.9,.28,7.8),r);S.position.set(0,.54,.15),e.add(S);const m=new Y(new Vt(2.7,.8,3.1),n);m.position.set(0,.82,-4.2),e.add(m);const h=new Y(new Vt(4.8,.14,.8),r);h.position.set(0,.42,-5.55),e.add(h);const M=new Y(new Vt(2.1,.78,1.9),o);M.position.set(0,1.72,-.72),M.rotation.x=-.08,e.add(M);const v=new Y(new Vt(2.14,.08,.08),a);v.position.set(0,2.04,-1.48),v.rotation.x=-.08,e.add(v);const y=new Y(new Vt(5.8,.22,1.1),s);y.position.set(0,1.84,3.9),e.add(y);for(const T of[-2.25,2.25]){const P=new Y(new Vt(.28,1.1,1.3),s);P.position.set(T,1.3,3.75),P.rotation.z=T<0?-.12:.12,e.add(P)}const E=[];for(const T of[-2.4,2.4])for(const P of[-2.3,2.6]){const C=new oe;C.position.set(T,.52,P);const b=new Y(new pe(.78,.78,.55,18),r);b.rotation.z=Math.PI/2,C.add(b);const _=new Y(new pe(.34,.34,.6,12),a);_.rotation.z=Math.PI/2,C.add(_);const A=new Y(new pe(.48,.48,.08,16),u);A.rotation.z=Math.PI/2,A.position.set(T>0?-.04:.04,0,0),C.add(A);const D=new Y(new Ws(.78,.055,8,20),r);D.rotation.y=Math.PI/2,C.add(D),e.add(C),P<0&&E.push(C)}e.userData.frontWheels=E;for(let T=0;T<4;T++){const P=new Y(new pe(.12,.12,2.4,10),a);P.rotation.x=Math.PI/2,P.position.set(-.9+T*.6,1.62,-2.7),e.add(P)}for(const T of[-1.35,1.35]){const P=new Y(new Vt(.62,.26,.16),c);P.position.set(T,1.05,3.82),e.add(P);const C=new Y(new Vt(.5,.22,.12),l);C.position.set(T,.86,-5.72),e.add(C)}return e.traverse(T=>{T.castShadow=!0,T.receiveShadow=!0}),Wt.add(e),e}function Bg(){const i=new oe,t=new J({color:9383205,roughness:.35,metalness:.55}),e=new J({color:460551,roughness:.55}),n=new J({color:12375772,roughness:.18,metalness:.9}),s=new J({color:16767297,roughness:.38,metalness:.25}),r=new J({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new J({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.16}),o=new J({color:1118995,roughness:.7,metalness:.05}),c=new Y(new Vt(2.2,.24,2.2),t);c.position.set(0,-.78,-2.2),i.add(c);const l=new Y(new Vt(.16,.028,1.92),n);l.position.set(0,-.64,-2.28),i.add(l);const d=new Y(new Vt(2.55,.18,.52),e);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,i.add(d);const u=new Y(new De(2.8,.82,1,1),a);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,i.add(u);const f=new Y(new Ws(.36,.035,12,48),o);f.position.set(0,-.46,-1.02),f.rotation.x=Math.PI/2.75,i.add(f);for(let p=0;p<3;p++){const g=new Y(new Vt(.34,.025,.035),n);g.position.copy(f.position),g.rotation.copy(f.rotation),g.rotation.z+=p/3*Math.PI*2,i.add(g)}for(let p=0;p<6;p++){const g=new Y(new pe(.16,.16,.56,18),n);g.rotation.z=Math.PI/2,g.position.set(-.78+p*.31,-.42+Math.sin(p)*.03,-2.12),i.add(g)}for(const p of[-1.08,1.08]){const g=new Y(new pe(.34,.34,.25,18),e);g.rotation.z=Math.PI/2,g.position.set(p,-.68,-1.58),i.add(g);const S=new Y(new Ws(.22,.035,8,28),s);S.scale.set(.72,1.25,.72),S.position.set(p*.8,-.48,-1.74),S.rotation.x=Math.PI/2,i.add(S)}for(const p of[-1.14,-.84,.84,1.14]){const g=new Y(new pe(.035,.04,.028,8),n);g.position.set(p,-.39,-1.28),g.rotation.x=Math.PI/2,i.add(g)}for(const p of[-.52,.52]){const g=new Y(new en(.045,12,8),r);g.position.set(p,-.34,-1.22),i.add(g)}i.position.set(0,0,0),Qt.add(i),Yn=i}function zg(){const i=new J({color:16119285,roughness:.35,metalness:.25}),t=new J({color:1184274,roughness:.45}),e=new J({map:_g(),roughness:.42,metalness:.05}),n=new J({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=ce(0),r=new he().makeBasis(s.side,Ve,s.tangent),a=new qn().setFromRotationMatrix(r),o=new oe;for(const d of[-K.width*.58,K.width*.58]){const u=new Y(new Vt(.8,11,.8),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(Ve,5.4),u.quaternion.copy(a),o.add(u)}const c=new Y(new Vt(K.width+3,.8,1),e);c.position.copy(s.p).addScaledVector(Ve,11.2),c.quaternion.copy(a),o.add(c);const l=new Y(new Vt(K.width+1.2,1.4,.18),t);l.position.copy(s.p).addScaledVector(Ve,12.5).addScaledVector(s.tangent,-.55),l.quaternion.copy(a),o.add(l);for(const d of[-K.width*.38,0,K.width*.38]){const u=new Y(new en(.32,16,10),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(Ve,10.25),o.add(u)}return Wt.add(o),o}const Ls=Bh(),yn=Bh(3108784,1916782);yn.visible=!1;Eg();Tg();Ag();Cg();Rg();let Pl=null,Ll=null,Dl=null,Yn=null;Bg();function Ra(i){i&&(i.traverse(t=>{if(t.geometry&&t.geometry.dispose(),t.material){const e=Array.isArray(t.material)?t.material:[t.material];for(const n of e)n.map&&n.map.dispose(),n.dispose()}}),Wt.remove(i))}function ic(i){return Rr=Nt.clamp(i,0,rs.length-1),K=rs[Rr],Hn.length=0,Hr.length=0,Ra(Pl),Ra(Ll),Ra(Dl),Pl=Og(),Ll=zg(),Dl=Lg(),Bt.trackName.textContent=K.name,Bt.courseName&&(Bt.courseName.textContent=K.name),Bt.courseButtons.forEach(t=>{t.classList.toggle("active",Number(t.dataset.course)===Rr)}),K.name}ic(0);const hs=new ag(sn);hs.addPass(new og(Wt,Qt));const zh=new ss(new _t(window.innerWidth,window.innerHeight),.34,.78,1);hs.addPass(zh);hs.addPass(new lg);const kg={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},ws=new Dh(kg);hs.addPass(ws);const Vg=new J({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),Lr=Array.from({length:72},()=>{const i=new Y(new en(.1,8,5),Vg);return i.visible=!1,Wt.add(i),{mesh:i,life:0,velocity:new I}});let Xn=null;function kh(){if(Xn)return;const i=new AudioContext,t=i.createOscillator(),e=i.createGain(),n=i.createBiquadFilter();t.type="sawtooth",n.type="lowpass",n.frequency.value=540,t.frequency.value=70,e.gain.value=1e-4,t.connect(n).connect(e).connect(i.destination),t.start(),Xn={ctx:i,engine:t,engineGain:e,filter:n,nextNote:0,beat:0}}function Or(){Xn||kh(),Xn?.ctx.state==="suspended"&&Xn.ctx.resume().catch(()=>{})}function Il(i){if(!Xn)return;const{ctx:t}=Xn,e=t.createOscillator(),n=t.createGain();e.type="sine",e.frequency.value=55+i*2.6,n.gain.setValueAtTime(Math.min(.34,i/55),t.currentTime),n.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+.23),e.connect(n).connect(t.destination),e.start(),e.stop(t.currentTime+.24)}function Ul(i,t=18){const e=Math.min(t,Lr.length);for(let n=0;n<e;n++){const s=Lr.find(r=>r.life<=0)||Lr[n];s.mesh.visible=!0,s.mesh.position.copy(i),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function Gg(i){for(const t of Lr){if(t.life<=0)continue;t.life-=i,t.velocity.y-=26*i,t.mesh.position.addScaledVector(t.velocity,i);const e=Math.max(.01,t.life*2.4);t.mesh.scale.setScalar(e),t.life<=0&&(t.mesh.visible=!1)}}function Hg(i){if(!Xn)return;const{ctx:t,engine:e,engineGain:n,filter:s}=Xn;e.frequency.setTargetAtTime(62+x.speed*2.9+(ee.has("ShiftLeft")||ee.has("ShiftRight")?60:0),t.currentTime,.04),s.frequency.setTargetAtTime(480+x.speed*9,t.currentTime,.08);const r=x.mode==="race"||x.mode==="roam";n.gain.setTargetAtTime(r?.036+Math.abs(x.speed)/4200:1e-4,t.currentTime,.08)}function Wr(i=!1,t=!1){kh(),ee.clear(),Br();const e=i||t;Object.assign(x,{mode:"race",practice:e,freeRun:t,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:e?-900:-28,rivalDistance:e?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:t?"Free run — course check":i?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:e?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const n=ce(x.s);x.y=n.p.y+2.1,x.yVel=0,Bt.menu.classList.add("hidden"),Bt.result.classList.add("hidden"),Bt.resultStats.innerHTML="",Bt.position.textContent=t?"FREE RUN":i?"PRACTICE":"DIV 4",Bt.trackName.textContent=K.name,yn.visible=!1,Yn&&(Yn.visible=!0),window.__freeCam=!1}function Vh(){Or(),x.mode="roam",x.practice=!0,x.freeRun=!1,ee.clear(),Br();let i=80,t=250;Vn(i,t,6).clearance<6&&(i=210,t=250),x.roamPos.set(i,de(i,t),t),x.roamYaw=0,x.camYaw=0,x.camLookYaw=0,x.camLookPitch=0,x.cameraZoom=0,Mt.zoom=0,x.wheelSteer=0,x.speed=0,x.boost=1,x.damage=0,x.cameraShake=0,x.message="Free roam — drive the city",x.messageTimer=2.4,Ls.visible=!1,yn.visible=!0,Yn&&(Yn.visible=!1),window.__freeCam=!1,Bt.menu.classList.add("hidden"),Bt.result.classList.add("hidden"),Bt.position.textContent="FREE ROAM",Bt.trackName.textContent="City Streets",Xr();const e=Math.sin(x.roamYaw),n=-Math.cos(x.roamYaw);Qt.position.set(x.roamPos.x-e*18,x.roamPos.y+8.5,x.roamPos.z-n*18),Qt.lookAt(x.roamPos.x+e*12,x.roamPos.y+2.6,x.roamPos.z+n*12),Qt.fov=70,Qt.updateProjectionMatrix()}function Xr(){yn.position.set(x.roamPos.x,x.roamPos.y+.3,x.roamPos.z),yn.quaternion.setFromAxisAngle(Ve,-x.roamYaw)}function Wg(i,t){let e=null;for(const s of Hr)for(const r of s.segments){const a=i-r.a.x,o=t-r.a.z,c=Nt.clamp((a*r.abx+o*r.abz)/r.lenSq,0,1),l=r.a.x+r.abx*c,d=r.a.z+r.abz*c,u=Math.hypot(i-l,t-d);if(u>s.halfW+Ds*.55)continue;const f=Nt.lerp(r.a.y,r.b.y,c),p=Nt.lerp(r.u0,r.u1,c),g=u+Math.max(0,de(i,t)-f)*.2;(!e||g<e.score)&&(e={kind:"ramp",y:f,u:p,ramp:s,mergeS:s.mergeS,dirSel:s.dirSel,tangentX:r.abx,tangentZ:r.abz,lateral:s.dirSel*K.width*.34,score:g})}if(!e)return null;const n=Math.max(1e-4,Math.hypot(e.tangentX,e.tangentZ));return e.tangentX/=n,e.tangentZ/=n,e}function Xg(i,t,e=de(i,t)){let n=null;const s=10;for(let a=0;a<K.length;a+=s){if(Ti(a+s*.5))continue;const o=ce(a),c=ce(a+s),l=c.p.x-o.p.x,d=c.p.z-o.p.z,u=Math.max(1e-4,l*l+d*d),f=Nt.clamp(((i-o.p.x)*l+(t-o.p.z)*d)/u,0,1),p=o.p.x+l*f,g=o.p.z+d*f,S=i-p,m=t-g,h=Math.hypot(S,m);if(h>K.width*.5+Ds*.45)continue;const M=Nt.lerp(o.p.y,c.p.y,f)+.58;if(e<M-5)continue;const v=new I(d,0,-l).normalize(),y=Nt.clamp(S*v.x+m*v.z,-K.width*.44,K.width*.44);(!n||h<n.dist)&&(n={kind:"track",y:M,s:a+s*f,lateral:y,tangentX:l,tangentZ:d,dist:h})}if(!n)return null;const r=Math.max(1e-4,Math.hypot(n.tangentX,n.tangentZ));return n.tangentX/=r,n.tangentZ/=r,n}function Si(i,t,e=x.roamPos.y){const n=de(i,t);let s={kind:"ground",y:n};const r=Wg(i,t);r&&r.y>=n-.6&&(s=r);const a=Xg(i,t,Math.max(e,s.y));return a&&a.y>=s.y-.8&&(s=a),s}function Nl(i){const t=Math.sin(x.roamYaw)*i.tangentX+-Math.cos(x.roamYaw)*i.tangentZ;if(x.speed<10||t<.22)return!1;const e=(i.mergeS??i.s??22)+8,n=ce(e);return x.mode="race",x.practice=!0,x.freeRun=!0,x.breakdownTimer=0,x.s=n.s,x.totalDistance=n.s,x.lastSafeS=n.s,x.lastSafeDistance=n.s,x.lateral=Nt.clamp(i.lateral??0,-K.width*.32,K.width*.32),x.lateralVel=-Math.sign(x.lateral)*Math.min(4,Math.abs(x.speed)*.04),x.speed=Nt.clamp(Math.max(28,x.speed),18,112),x.grounded=!0,x.y=n.p.y+2.1,x.yVel=0,x.airtime=0,x.rivalS=-900,x.rivalDistance=-900,x.leadState="SOLO",x.message="Merged onto the ribbon",x.messageTimer=1.6,x.cameraShake=Math.max(x.cameraShake,.35),Ls.visible=!1,yn.visible=!1,Yn&&(Yn.visible=!0),Bt.position.textContent="FREE RUN",Bt.trackName.textContent=K.name,Xr(),!0}function Gh(i){const t=Math.max(ee.has("KeyW")||ee.has("ArrowUp")?1:0,Mt.throttle),e=Math.max(ee.has("KeyS")||ee.has("ArrowDown")?1:0,Mt.brake),n=Nt.clamp((ee.has("KeyD")||ee.has("ArrowRight")?1:0)-(ee.has("KeyA")||ee.has("ArrowLeft")?1:0)+Mt.steer,-1,1),s=(ee.has("ShiftLeft")||ee.has("ShiftRight"))&&x.boost>.02&&t>.03;if(t>.03){const g=x.speed<0?38:0;x.speed+=((s?52:30)+g)*t*i}e>.03&&(x.speed-=(x.speed>1.2?64:30)*e*i),x.speed-=.0026*x.speed*Math.abs(x.speed)*i,Math.abs(x.speed)>.08?x.speed-=Math.sign(x.speed)*4.2*i:t<=.03&&e<=.03&&(x.speed=0),x.speed=Nt.clamp(x.speed,-22,120),x.boosting=s,s?x.boost=Math.max(0,x.boost-i*.22):x.boost=Math.min(1,x.boost+i*.05),x.wheelSteer+=(n-x.wheelSteer)*(1-Math.pow(1e-4,i));const r=-x.wheelSteer*.55,a=yn.userData.frontWheels;a&&(a[0].rotation.y=r,a[1].rotation.y=r);const o=Math.abs(x.speed);if(o>Eo){const g=Nt.clamp((o-Eo)/5,0,1),S=1-.45*Nt.clamp((o-28)/70,0,1),m=ug*g*S;x.roamYaw+=x.wheelSteer*m*i*Math.sign(x.speed)}const c=Math.sin(x.roamYaw),l=-Math.cos(x.roamYaw),d=Math.abs(x.speed)*i,u=Math.max(1,Math.ceil(d/1.2));let f=!1,p=Si(x.roamPos.x,x.roamPos.z,x.roamPos.y);for(let g=0;g<u;g++)x.roamPos.x+=c*x.speed*i/u,x.roamPos.z+=l*x.speed*i/u,p=Si(x.roamPos.x,x.roamPos.z,x.roamPos.y),x.roamPos.y=p.y+Ji,Yg(x.roamPos,p)&&(f=!0),p=Si(x.roamPos.x,x.roamPos.z,x.roamPos.y),x.roamPos.y=p.y+Ji;x.roamPos.x=Nt.clamp(x.roamPos.x,-820,820),x.roamPos.z=Nt.clamp(x.roamPos.z,-1620,480),f&&(x.speed*=.35),p=Si(x.roamPos.x,x.roamPos.z,x.roamPos.y),x.roamPos.y=p.y+Ji,!(p.kind==="ramp"&&p.u>.86&&Nl(p))&&(p.kind==="track"&&Nl(p)||(Xr(),ee.has("KeyR")&&(Vh(),ee.delete("KeyR"))))}const Ds=2.6;function Pa(i,t){let e=!1;for(let n=0;n<t.length;n++){const s=t[n];if(s.maxY!=null&&i.y>s.maxY+Ji+.45)continue;if(s.radius){const u=s.radius+Ds,f=i.x-s.x,p=i.z-s.z,g=f*f+p*p;if(g>=u*u)continue;e=!0;const S=Math.max(1e-4,Math.sqrt(g));i.x=s.x+f/S*u,i.z=s.z+p/S*u;continue}const r=s.hw+Ds,a=s.hd+Ds,o=i.x-s.x,c=i.z-s.z;if(Math.abs(o)>=r||Math.abs(c)>=a)continue;e=!0;const l=r-Math.abs(o),d=a-Math.abs(c);l<d?i.x=s.x+(o<0?-r:r):i.z=s.z+(c<0?-a:a)}return e}function qg(i,t,e=0){return t.maxY!=null&&i.y>t.maxY+Ji+.45?!1:t.radius?Math.hypot(i.x-t.x,i.z-t.z)<t.radius+e:Math.abs(i.x-t.x)<t.hw+e&&Math.abs(i.z-t.z)<t.hd+e}function Yg(i,t=null){let e=!1;for(let n=0;n<2;n++){const s=Pa(i,ni),r=t?.kind==="ground"?Pa(i,Hn):!1,a=Pa(i,Ps);if(!s&&!r&&!a)break;e=!0}return e}function Hh(i){const t=Mt.lookX*1.18,e=Mt.lookY*.58;x.camLookYaw+=(t-x.camLookYaw)*(1-Math.pow(.002,i)),x.camLookPitch+=(e-x.camLookPitch)*(1-Math.pow(.002,i)),x.cameraZoom+=(Mt.zoom-x.cameraZoom)*(1-Math.pow(.018,i))}function Wh(i){if(window.__freeCam)return;if(Hh(i),Math.abs(x.speed)>Eo){let u=x.roamYaw-x.camYaw;u=Math.atan2(Math.sin(u),Math.cos(u)),x.camYaw+=u*(1-Math.pow(.08,i))}const t=x.camYaw+x.camLookYaw,e=Math.sin(t),n=-Math.cos(t),s=x.roamPos,r=Nt.clamp(x.cameraZoom,-.42,.9),a=(18+Math.abs(x.speed)*.08)*(1+r*.72),o=8.5+Math.max(0,r)*4.4-Math.min(0,r)*2+x.camLookPitch*5.8,c=Nh.set(s.x-e*a,s.y+o,s.z-n*a);c.y=Math.max(c.y,de(c.x,c.z)+3.5),Qt.position.lerp(c,1-Math.pow(.0023,i));const l=tc.set(s.x+e*(12-Math.min(r,0)*6),s.y+2.6+x.camLookPitch*13.5,s.z+n*(12-Math.min(r,0)*6));mn.position.copy(Qt.position),mn.lookAt(l),mn.rotateY(Math.PI),Qt.quaternion.slerp(mn.quaternion,1-Math.pow(.05,i));const d=70+Math.min(8,Math.abs(x.speed)*.05)+r*10;Math.abs(Qt.fov-d)>.02&&(Qt.fov+=(d-Qt.fov)*(1-Math.pow(.01,i)),Qt.updateProjectionMatrix())}function Xh(i){if(x.mode==="result")return;x.mode="result";const t=Math.max(0,Math.round(x.score-x.damage*9+Math.max(0,220-x.time)*45));t>x.best&&(x.best=t,localStorage.setItem("steel-ribbon-best",String(t))),Bt.best.textContent=`Best score ${x.best}`,Bt.resultText.textContent=`${i} Score ${t}. Time ${Ao(x.time)}. Damage ${Math.round(x.damage)}%.`;const e=Number.isFinite(x.bestLap)?Ao(x.bestLap):"--:--.-";Bt.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${e}</b>
    <b>Clean landings: ${x.cleanLandings}</b>
    <b>Hard landings: ${x.hardLandings}</b>
    <b>Recoveries: ${x.recoveries}</b>
    <b>Near edges: ${Math.round(x.nearMisses)}</b>
  `,Bt.result.classList.remove("hidden")}function Fl(i="Craned back to the ribbon"){const t=ce(x.lastSafeS);x.s=x.lastSafeS,x.totalDistance=x.lastSafeDistance,x.lateral=0,x.lateralVel=0,x.y=t.p.y+2.1,x.yVel=0,x.speed=Math.max(16,x.speed*.32),x.grounded=!0,x.cameraShake=1.2,x.message=i,x.messageTimer=1.4,x.recoveries+=1}function sc(i,t){return Nt.clamp(t*i.tangent.y,-48,48)}function Zg(i=94){return K.gaps.map(t=>{const e=ce(t.start),n=ce(t.end+3),s=(t.end-t.start)/Math.max(1,i),r=sc(e,i),a=e.p.y+2.1+r*s-.5*31*s*s,o=n.p.y+2.1;return{name:t.name,start:t.start,end:t.end,length:t.end-t.start,lipGradeDeg:Math.round(Nt.radToDeg(e.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function Ol(i,t){x.grounded=!1,x.yVel=sc(i,x.speed),x.airtime=0,t&&(x.message=t)}window.__steelRibbonDebug={launchVelocityAt(i,t){return sc(ce(i),t)},gapJumpReport(i){return Zg(i)},sceneryClearanceReport(){return wg()},setSpeed(i){return x.speed=Nt.clamp(i,-14,156-x.damage*.42),Is(),x.speed},setTrackPosition(i,t=x.speed){const e=ce(i);return x.totalDistance=i,x.s=e.s,x.lastSafeS=e.s,x.lastSafeDistance=i,x.lateral=0,x.lateralVel=0,x.y=e.p.y+2.1,x.yVel=0,x.grounded=!0,x.speed=Nt.clamp(t,-14,156-x.damage*.42),Is(),{s:x.s,totalDistance:x.totalDistance,speed:x.speed,y:x.y}},setDamage(i){return x.damage=Nt.clamp(i,0,99),Is(),x.damage},setCourse(i){return ic(i)},flyCam(i,t,e,n,s,r){return window.__freeCam=!0,Qt.position.set(i,t,e),Qt.lookAt(n,s,r),Qt.fov=62,Qt.updateProjectionMatrix(),"freecam"},listCourses(){return rs.map((i,t)=>({index:t,name:i.name,length:i.length,width:i.width,laps:i.laps,gaps:i.gaps.length}))},courseInfo(){return{index:Rr,name:K.name,length:K.length,width:K.width,laps:K.laps}},probeDown(i,t){const n=new pf(new I(i,400,t),new I(0,-1,0),0,1e3).intersectObjects(Wt.children,!0).map(r=>({y:+r.point.y.toFixed(2),name:r.object.material?.color?"#"+r.object.material.color.getHexString():"?"})),s=Si(i,t,400);return{x:i,z:t,ground:+de(i,t).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:n.slice(0,5)}},rampSurfaceReport(){return Hr.map((i,t)=>{const e=i.points[0],n=i.points[i.points.length-1],s=i.points[i.points.length/2|0],r=i.segments[0],a=i.segments[i.segments.length-1],o=Math.atan2(r.abx,-r.abz);return{index:t,mergeS:i.mergeS,halfW:i.halfW,start:{x:+e.x.toFixed(2),y:+e.y.toFixed(2),z:+e.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2)},climb:+(n.y-e.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(a.abx,-a.abz).toFixed(4)}})},colliderSample(i=8){return ni.slice(0,i).map(t=>({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1)}))},pylonColliderSample(i=8){return Hn.filter(t=>t.hw).slice(0,i).map(t=>({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1)}))},rockColliderSample(i=8){return Ps.concat(Hn.filter(t=>t.kind==="rock")).slice(0,i).map(t=>({kind:t.kind||"prop",x:+t.x.toFixed(1),z:+t.z.toFixed(1),radius:t.radius?+t.radius.toFixed(1):null}))},setRoamPose(i,t,e){const n=Si(i,t,x.roamPos.y);x.roamPos.set(i,n.y+Ji,t),x.roamYaw=e,x.camYaw=e,x.camLookYaw=0,x.camLookPitch=0,x.wheelSteer=0,x.speed=0,Xr();const s=Math.sin(x.roamYaw),r=-Math.cos(x.roamYaw);return Qt.position.set(x.roamPos.x-s*18,x.roamPos.y+8.5,x.roamPos.z-r*18),Qt.lookAt(x.roamPos.x+s*12,x.roamPos.y+2.6,x.roamPos.z+r*12),Qt.fov=70,Qt.updateProjectionMatrix(),this.roamReport()},setTouchCamera(i=0,t=0,e=Mt.zoom,n=30){Mt.lookX=Nt.clamp(i,-1,1),Mt.lookY=Nt.clamp(t,-1,1),Mt.zoom=Nt.clamp(e,-.42,.9);for(let s=0;s<n;s++)x.mode==="roam"?Wh(1/60):rc(1/60);return this.roamReport()},simulateRoamDrive(i=1,t=0,e=0,n=0){if(x.mode!=="roam")return this.roamReport();const s={steer:Mt.steer,throttle:Mt.throttle,brake:Mt.brake};Mt.steer=Nt.clamp(t,-1,1),Mt.throttle=Nt.clamp(e,0,1),Mt.brake=Nt.clamp(n,0,1);const r=1/60;let a=Math.max(0,Math.min(i,8));for(;a>0;){const o=Math.min(r,a);if(Gh(o),x.mode!=="roam")break;a-=o}return Mt.steer=s.steer,Mt.throttle=s.throttle,Mt.brake=s.brake,this.roamReport()},roamReport(){const i=x.roamPos,t=Nh.set(0,0,-1).applyQuaternion(yn.quaternion).normalize(),e=tc.set(Math.sin(x.roamYaw),0,-Math.cos(x.roamYaw)).normalize(),n=Si(i.x,i.z,i.y);return{mode:x.mode,s:+x.s.toFixed(2),totalDistance:+x.totalDistance.toFixed(2),x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2),yaw:+x.roamYaw.toFixed(3),camYaw:+x.camYaw.toFixed(3),speed:+x.speed.toFixed(2),groundXZ:+de(i.x,i.z).toFixed(2),surface:n.kind,surfaceY:+n.y.toFixed(2),camX:+Qt.position.x.toFixed(2),camY:+Qt.position.y.toFixed(2),camZ:+Qt.position.z.toFixed(2),fov:+Qt.fov.toFixed(2),lookYaw:+x.camLookYaw.toFixed(3),lookPitch:+x.camLookPitch.toFixed(3),cameraZoom:+x.cameraZoom.toFixed(3),colliders:ni.length+Hn.length+Ps.length,insideBuilding:ni.concat(Hn,Ps).some(s=>qg(i,s)),carForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},driveForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},wheelRotY:yn.userData.frontWheels?+yn.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function $g(i){if(x.mode!=="race")return;x.time+=i,x.freeRun&&(x.damage=0);const t=x.breakdownTimer>0;t&&(x.breakdownTimer-=i,x.breakdownTimer<=0&&(x.damage=55,x.message="Patched up — back on it",x.messageTimer=1.2));const e=Math.max(ee.has("KeyW")||ee.has("ArrowUp")?1:0,Mt.throttle),n=Math.max(ee.has("KeyS")||ee.has("ArrowDown")?1:0,Mt.brake),s=Nt.clamp((ee.has("KeyD")||ee.has("ArrowRight")?1:0)-(ee.has("KeyA")||ee.has("ArrowLeft")?1:0)+Mt.steer,-1,1),r=e>.03&&!t,a=(ee.has("ShiftLeft")||ee.has("ShiftRight"))&&x.boost>.02&&r&&x.grounded,o=ce(x.s),c=o.p.y+2.1,l=Math.abs(x.speed);if(r){const h=x.speed<0?40:0;x.speed+=((a?68:40)+h)*e*i}if(n>.03){const h=x.speed>1.2?70:26;x.speed-=h*n*i}const d=x.grounded?.0024:.0011;x.speed-=d*x.speed*l*i,l>.08?x.speed-=Math.sign(x.speed)*(x.grounded?2.2:.3)*i:e<=.03&&n<=.03&&(x.speed=0),x.speed=Nt.clamp(x.speed,-16,156-x.damage*.8),t&&(x.speed=Math.min(x.speed,14)),x.boosting=a,a?(x.boost=Math.max(0,x.boost-i*.21),x.score+=28*i):x.boost=Math.min(1,x.boost+i*(x.grounded?.045:.018));const u=14+l*.12;x.lateralVel-=s*u*i,x.lateralVel-=x.lateralVel*(x.grounded?3.4:.7)*i,x.lateral+=x.lateralVel*i;const f=Ti(x.s),p=Math.abs(x.lateral)<K.width*.52,g=!f&&p;if(x.grounded&&(!g||Math.abs(x.lateral)>K.width*.5)&&Ol(o,p?"":"Edge slip"),x.grounded){const h=Math.sin(x.time*18)*Math.min(.22,Math.abs(x.speed)/700);x.y=Nt.lerp(x.y,c+h,.5),x.yVel=0,x.lastSafeS=x.s,x.lastSafeDistance=x.totalDistance,x.score+=Math.max(0,x.speed)*i*.34,Math.abs(x.lateral)>K.width*.42&&(x.damage+=i*(1.2+Math.abs(x.speed)*.035),x.cameraShake=Math.max(x.cameraShake,.24),x.nearMisses+=i*.8,Math.random()<i*5&&Ul(o.p.clone().addScaledVector(o.side,Math.sign(x.lateral)*K.width*.55).addScaledVector(Ve,1.2),4))}else{x.yVel-=31*i,x.y+=x.yVel*i,x.airtime+=i,x.score+=i*11;const h=ce(x.s),M=h.p.y+2.1;if(!Ti(x.s)&&Math.abs(x.lateral)<K.width*.55&&x.y<=M&&x.yVel<0){const y=-x.yVel,E=Math.abs(x.lateral)<K.width*.34&&y<30;x.y=M,x.grounded=!0,x.yVel=0,x.lastSafeS=x.s,x.lastSafeDistance=x.totalDistance,x.damage+=Math.max(0,y-17)*.82+Math.max(0,Math.abs(x.lateral)-K.width*.36)*1.8,x.score+=E?260+x.airtime*85:Math.max(30,120-y),x.cameraShake=Math.max(x.cameraShake,y/34),x.message=E?"Clean landing":"Hard landing",x.messageTimer=.9,E?x.cleanLandings+=1:x.hardLandings+=1,Il(y),Ul(h.p.clone().addScaledVector(h.side,x.lateral).addScaledVector(Ve,.7),E?7:24),x.airtime=0}x.y<-55&&(x.damage+=28,Fl("Track crew recovery"))}const S=x.totalDistance;x.totalDistance+=x.speed*i,x.s=(x.totalDistance%K.length+K.length)%K.length;const m=Math.floor(x.totalDistance/K.length)+1;if(m>x.lap){const h=x.time-x.lapStartTime;x.splitTimes.push(h),x.bestLap=Math.min(x.bestLap,h),x.lapStartTime=x.time,x.lap=m,x.score+=1200,x.message=x.practice?`Lap ${x.lap}`:x.lap<=K.laps?`Lap ${x.lap}`:"Season race complete",x.messageTimer=1.4,!x.practice&&x.lap>K.laps&&Xh(x.totalDistance>=x.rivalDistance?"You took the chequered gantry.":"You finished behind Crowther.")}for(const h of K.gaps)gg(S,x.totalDistance,h.start)&&(x.message=h.name,x.messageTimer=1.1,x.grounded&&Ol(ce(h.start),h.name));x.damage=Nt.clamp(x.damage,0,100),!x.freeRun&&x.damage>=90&&x.breakdownTimer<=0&&(x.breakdownTimer=2.6,x.message="Chassis cracked — limping to repair",x.messageTimer=1.6,x.cameraShake=Math.max(x.cameraShake,.8),Il(40),x.damage=90),ee.has("KeyR")&&(x.damage=Math.min(99,x.damage+8),Fl("Manual reset"),ee.delete("KeyR"))}function Kg(i){if(x.mode==="race"&&!x.practice){const r=x.totalDistance-x.rivalDistance,a=Nt.clamp(r*.06,-12,16),o=Math.sin(x.time*.6)*5;x.rivalSpeed=Nt.clamp(92+a+o,70,120),x.rivalDistance+=x.rivalSpeed*i,x.rivalDistance>=K.length*K.laps&&x.lap<=K.laps&&Xh("Crowther reached the gantry first.")}x.rivalS=(x.rivalDistance%K.length+K.length)%K.length;const t=ce(x.rivalS),e=t.p.clone().addScaledVector(Ve,1.4).addScaledVector(t.side,Math.sin(x.rivalS*.02)*1.4);Ls.position.copy(e);const n=new he().makeBasis(t.side,Ve,t.tangent);Ls.quaternion.setFromRotationMatrix(n);const s=Math.abs(x.rivalDistance-x.totalDistance)<26;Ls.visible=(x.mode==="race"||x.mode==="paused")&&!x.practice&&!s}function rc(i){if(window.__freeCam)return;Hh(i);const t=ce(x.s),e=t.side.clone().multiplyScalar(x.lateral),n=t.p.clone().add(e);n.y=x.y;const s=x.cameraShake;s>.01&&(n.x+=(Math.random()-.5)*s*.8,n.y+=(Math.random()-.5)*s*.45),Qt.position.copy(n);const r=Math.abs(x.speed),a=68+Math.min(10,r*.055)+(ee.has("ShiftLeft")||ee.has("ShiftRight")?3:0)+x.cameraZoom*12;Math.abs(Qt.fov-a)>.02&&(Qt.fov+=(a-Qt.fov)*(1-Math.pow(.004,i)),Qt.updateProjectionMatrix());const o=ce(x.s+34+x.speed*.16),c=o.p.clone().addScaledVector(o.side,x.lateral*.45);c.y+=1.7+x.camLookPitch*12+Math.sin(x.time*8)*Math.min(.2,r/680),mn.position.copy(Qt.position),mn.lookAt(c),mn.rotateY(Math.PI),mn.rotateY(-x.camLookYaw),mn.rotateZ(-t.bank*.72-x.lateralVel*.006),mn.rotateX(t.grade*.18+(x.grounded?0:Nt.clamp(x.yVel,-30,30)*-.006)),Qt.quaternion.slerp(mn.quaternion,1-Math.pow(8e-4,i)),x.cameraShake=Math.max(0,x.cameraShake-i*1.9);const l=tc.set(0,0,-1).applyQuaternion(Qt.quaternion).normalize();window.__steelRibbonTelemetry={mode:x.mode,s:x.s,totalDistance:x.totalDistance,rivalDistance:x.rivalDistance,speed:x.speed,lap:x.lap,score:x.score,damage:x.damage,y:x.y,yVel:x.yVel,grounded:x.grounded,input:{steer:Mt.steer,throttle:Mt.throttle,brake:Mt.brake},forwardWorld:{x:t.tangent.x,y:t.tangent.y,z:t.tangent.z},cameraWorld:{x:l.x,y:l.y,z:l.z}}}const yi={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},Ss=[28,54,82,110,134,156];function Jg(){const i=Math.abs(x.speed);let t=1;for(let o=0;o<Ss.length;o++)i>Ss[o]&&(t=o+2);t=Math.min(t,Ss.length);const e=t===1?0:Ss[t-2],n=Ss[t-1],s=n>e?Nt.clamp((i-e)/(n-e),0,1):0,r=t===1?yi.idle:yi.postShift;let a=r+s*(yi.shift-r);return i<.4&&(a=yi.idle),{gear:t,rpm:a}}let Bl=performance.now(),La=0,Da=0;function qh(i){const t=i.getContext("2d"),e=Math.min(2,window.devicePixelRatio||1),n=i.clientWidth||120,s=i.clientHeight||70;(i.width!==Math.round(n*e)||i.height!==Math.round(s*e))&&(i.width=Math.round(n*e),i.height=Math.round(s*e)),t.setTransform(e,0,0,e,0,0),t.clearRect(0,0,n,s);const r=n/2,a=s-s*.14,o=Math.min(n*.46,s*.9);return{ctx:t,w:n,h:s,cx:r,cy:a,R:o,aFor:d=>Math.PI-d*Math.PI,at:(d,u)=>[r+Math.cos(d)*u,a-Math.sin(d)*u]}}function jg(i,t){const e=Bt.speedo;if(!e)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=qh(e),l=360;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke(),n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let g=0;g<=l;g+=20){const S=g/l,m=o(S),h=g%80===0;n.strokeStyle="rgba(180, 230, 255, 0.85)",n.lineWidth=h?Math.max(1.4,a*.035):Math.max(1,a*.02);const M=c(m,a-a*.02),v=c(m,a-a*(h?.18:.1));if(n.beginPath(),n.moveTo(M[0],M[1]),n.lineTo(v[0],v[1]),n.stroke(),h){const y=c(m,a-a*.34);n.fillStyle="#cfeeff",n.fillText(String(g/10),y[0],y[1])}}const d=Nt.clamp(i/l,0,1),u=o(d),f=c(u,a-a*.06),p=c(u+Math.PI,a*.14);n.strokeStyle="#7df1ff",n.shadowColor="rgba(80, 220, 255, 0.9)",n.shadowBlur=a*.18,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(p[0],p[1]),n.lineTo(f[0],f[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("MPH",s,r-a*.26),n.fillStyle=t?"#ff8077":"#f2f8ff",n.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,n.fillText(t?`-${Math.round(i)}`:String(Math.round(i)),s,r+a*.02)}function Qg(i,t){const e=Bt.boostGauge;if(!e)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=qh(e),l=18;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.3)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke();const d=Nt.clamp(i,0,1),u=i<.25;n.strokeStyle=u?"#ff5436":t?"#ffb53a":"#46e0b0",n.shadowColor=t?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",n.shadowBlur=t?a*.25:a*.1,n.lineWidth=Math.max(2,a*.07),n.beginPath(),n.arc(s,r,a,o(d),o(0)),n.stroke(),n.shadowBlur=0,n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let S=0;S<=l;S+=3){const m=S/l,h=o(m),M=S%6===0;n.strokeStyle=S>=l*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",n.lineWidth=M?Math.max(1.3,a*.03):Math.max(1,a*.018);const v=c(h,a-a*.02),y=c(h,a-a*(M?.17:.1));if(n.beginPath(),n.moveTo(v[0],v[1]),n.lineTo(y[0],y[1]),n.stroke(),M){const E=c(h,a-a*.33);n.fillStyle="#cfeeff",n.fillText(String(S),E[0],E[1])}}const f=o(d),p=c(f,a-a*.06),g=c(f+Math.PI,a*.14);n.strokeStyle=u?"#ff5436":"#ffd23f",n.shadowColor="rgba(255, 200, 60, 0.8)",n.shadowBlur=a*.16,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(g[0],g[1]),n.lineTo(p[0],p[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("BOOST psi",s,r-a*.26),t&&(n.fillStyle="#ffce4a",n.shadowColor="rgba(255, 190, 60, 0.95)",n.shadowBlur=a*.3,n.beginPath(),n.arc(s,r+a*.02,a*.07,0,Math.PI*2),n.fill(),n.shadowBlur=0)}function t_(i,t){const e=Bt.tach;if(!e)return;const n=e.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=e.clientWidth||160,a=e.clientHeight||70;(e.width!==Math.round(r*s)||e.height!==Math.round(a*s))&&(e.width=Math.round(r*s),e.height=Math.round(a*s)),n.setTransform(s,0,0,s,0,0),n.clearRect(0,0,r,a);const o=r/2,c=a-a*.14,l=Math.min(r*.46,a*.9),d=yi.max,u=v=>Math.PI-v*Math.PI,f=(v,y)=>[o+Math.cos(v)*y,c-Math.sin(v)*y];n.lineCap="round",n.lineWidth=Math.max(2,l*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(o,c,l,u(1),u(0)),n.stroke();const p=yi.redline/d;n.strokeStyle="#ff3b30",n.beginPath(),n.arc(o,c,l,u(1),u(p)),n.stroke(),n.font=`700 ${Math.max(7,l*.17)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let v=0;v<=9;v++){const y=v/9,E=u(y),T=v*1e3>=yi.redline;n.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",n.lineWidth=Math.max(1.4,l*.035);const P=f(E,l-l*.02),C=f(E,l-l*.18);n.beginPath(),n.moveTo(P[0],P[1]),n.lineTo(C[0],C[1]),n.stroke();const b=f(E,l-l*.34);if(n.fillStyle=T?"#ff8077":"#cfeeff",n.fillText(String(v),b[0],b[1]),v<9){const _=u((v+.5)/9),A=f(_,l-l*.02),D=f(_,l-l*.1);n.strokeStyle="rgba(150, 210, 255, 0.5)",n.lineWidth=Math.max(1,l*.02),n.beginPath(),n.moveTo(A[0],A[1]),n.lineTo(D[0],D[1]),n.stroke()}}const g=Nt.clamp(i/d,0,1),S=u(g),m=f(S,l-l*.06),h=f(S+Math.PI,l*.14);n.strokeStyle="#ffdd48",n.shadowColor="rgba(255, 200, 60, 0.9)",n.shadowBlur=l*.18,n.lineWidth=Math.max(1.8,l*.05),n.beginPath(),n.moveTo(h[0],h[1]),n.lineTo(m[0],m[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,l*.03),n.beginPath(),n.arc(o,c,l*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,l*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("x1000 r/min",o,c-l*.26);const M=x.speed<-.5?"R":String(t);n.fillStyle="#f2f8ff",n.font=`800 ${Math.max(9,l*.22)}px "Courier New", monospace`,n.fillText(M,o,c+l*.02)}function Is(){K.length*K.laps;const i=El(x.practice?x.totalDistance%K.length:x.totalDistance),t=x.practice?0:El(x.rivalDistance),e=x.practice?"SOLO":x.totalDistance>=x.rivalDistance?"P1":"P2";e!==x.leadState&&x.mode==="race"&&(x.leadState=e,x.practice||(x.message=e==="P1"?"You took the lead":"Crowther ahead",x.messageTimer=.95)),Bt.damage.style.width=`${Math.round(x.damage)}%`,Bt.lap.textContent=x.practice?`LAP ${x.lap}`:`${Math.min(x.lap,K.laps)}/${K.laps}`,Bt.timer.textContent=Ao(x.time),Bt.score.textContent=`Score ${Math.round(x.score)}`;const n=x.mode==="roam",s=x.mode==="race"||x.mode==="paused"||n;Bt.position.textContent=n?"FREE ROAM":x.freeRun?"FREE RUN":x.practice?"PRACTICE":`${e} DIV 4`,Bt.hud.style.display=s?"flex":"none",Bt.raceStrip.style.display=x.mode==="race"||x.mode==="paused"?"grid":"none",Bt.touchControls.style.display=s?"":"none",Bt.playerProgress.style.width=`${Math.round(i*100)}%`,Bt.rivalProgress.style.width=`${Math.round(t*100)}%`;const r=Jg();x.gear=r.gear;const a=performance.now(),o=Math.min(.05,(a-Bl)/1e3);Bl=a;const c=1-Math.exp(-o*(r.rpm>x.tachRpm?10:6));x.tachRpm+=(r.rpm-x.tachRpm)*c,t_(x.tachRpm,r.gear);const l=Math.abs(x.speed)*2.25;La+=(l-La)*(1-Math.exp(-o*8)),Da+=(x.boost-Da)*(1-Math.exp(-o*9)),jg(La,x.speed<-.5),Qg(Da,x.boosting),Bt.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(x.speed)-44)/150)),Bt.damageFx.style.opacity=x.damage<18?0:Math.min(.72,(x.damage-18)/82),x.mode==="paused"?(Bt.centerMessage.textContent="Paused",Bt.centerMessage.classList.remove("hidden")):x.messageTimer>0?(Bt.centerMessage.textContent=x.message,Bt.centerMessage.classList.remove("hidden")):Bt.centerMessage.classList.add("hidden")}function Ao(i){const t=Math.floor(i/60),e=i-t*60;return`${String(t).padStart(2,"0")}:${e.toFixed(1).padStart(4,"0")}`}function Yh(){const i=dg.getDelta(),t=Math.min(.033,i);x.messageTimer>0&&(x.messageTimer-=t),x.mode==="roam"?(Gh(t),Wh(t)):($g(t),Kg(t),rc(t)),Gg(t),yg(t),Is(),Hg(),ws.uniforms.uTime.value+=t,ws.uniforms.uSpeed.value=Math.min(1,Math.abs(x.speed)/150);const e=(ee.has("ShiftLeft")||ee.has("ShiftRight"))&&x.boost>.02&&x.mode==="race";ws.uniforms.uBoost.value+=((e?1:0)-ws.uniforms.uBoost.value)*Math.min(1,t*6),hs.render(),requestAnimationFrame(Yh)}window.addEventListener("keydown",i=>{ee.add(i.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(i.code)&&i.preventDefault(),i.code==="KeyP"&&x.mode==="race"?(x.mode="paused",ee.clear(),Br()):i.code==="KeyP"&&x.mode==="paused"?x.mode="race":i.code==="Escape"&&(x.mode==="race"||x.mode==="paused"||x.mode==="roam")&&(x.mode="menu",Br(),yn.visible=!1,Yn&&(Yn.visible=!0),Bt.menu.classList.remove("hidden"))});window.addEventListener("keyup",i=>ee.delete(i.code));window.addEventListener("resize",()=>{Qt.aspect=window.innerWidth/window.innerHeight,Qt.updateProjectionMatrix(),sn.setSize(window.innerWidth,window.innerHeight),hs.setSize(window.innerWidth,window.innerHeight),zh.setSize(window.innerWidth,window.innerHeight)});Bt.startBtn.addEventListener("click",()=>Wr(!1));Bt.practiceBtn.addEventListener("click",()=>Wr(!0));Bt.freeRunBtn.addEventListener("click",()=>Wr(!0,!0));Bt.roamBtn.addEventListener("click",()=>Vh());Bt.againBtn.addEventListener("click",()=>Wr(!1));Bt.courseButtons.forEach(i=>{i.addEventListener("click",()=>ic(Number(i.dataset.course)))});function Zh(i){i&&(i.classList.remove("active"),i.style.setProperty("--stick-x","0px"),i.style.setProperty("--stick-y","0px"))}function Br(){Mt.steer=0,Mt.throttle=0,Mt.brake=0,Mt.lookX=0,Mt.lookY=0,Mt.zoom=0,Mt.lookPointer=null,Mt.drivePointer=null,Mt.pinchStartDistance=0,Mt.pinchStartZoom=0;for(const i of Bt.touchControls.querySelectorAll(".touch-stick"))Zh(i)}function yr(i,t){const e=i.getBoundingClientRect(),n=Math.min(e.width,e.height)*.36;if(!(n>0))return;const s=Nt.clamp(t.clientX-(e.left+e.width/2),-n,n),r=Nt.clamp(t.clientY-(e.top+e.height/2),-n,n),a=i.dataset.stick;if(i.classList.add("active"),a==="look")Mt.lookX=Nt.clamp(s/n,-1,1),Mt.lookY=Nt.clamp(-r/n,-1,1),i.style.setProperty("--stick-x",`${Math.round(Mt.lookX*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-Mt.lookY*n)}px`);else{const o=Nt.clamp(s/n,-1,1),c=Nt.clamp(-r/n,-1,1);Mt.steer=o,Mt.throttle=Math.max(0,c),Mt.brake=Math.max(0,-c),i.style.setProperty("--stick-x",`${Math.round(o*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-c*n)}px`)}}function zl(i,t){return Array.from(i.changedTouches).find(e=>e.identifier===t)}function kl(i,t){t==="look"?(Mt.lookX=0,Mt.lookY=0,Mt.lookPointer=null):(Mt.steer=0,Mt.throttle=0,Mt.brake=0,Mt.drivePointer=null),Zh(i)}function e_(i,t){return Math.hypot(i.clientX-t.clientX,i.clientY-t.clientY)}function $h(i,t=!1){if(i.touches.length<2){Mt.pinchStartDistance=0;return}const e=e_(i.touches[0],i.touches[1]);if(t||!(Mt.pinchStartDistance>0)){Mt.pinchStartDistance=e,Mt.pinchStartZoom=Mt.zoom;return}const n=Math.max(.2,e/Mt.pinchStartDistance);Mt.zoom=Nt.clamp(Mt.pinchStartZoom-Math.log(n)*1.15,-.42,.9)}for(const i of Bt.touchControls.querySelectorAll(".touch-stick")){const t=i.dataset.stick;i.addEventListener("pointerdown",s=>{s.preventDefault(),Or(),x.mode==="paused"&&(x.mode="race"),t==="look"&&(Mt.lookPointer=s.pointerId),t==="drive"&&(Mt.drivePointer=s.pointerId),yr(i,s)},{passive:!1}),i.addEventListener("pointermove",s=>{(t==="look"?Mt.lookPointer:Mt.drivePointer)===s.pointerId&&(s.preventDefault(),yr(i,s))},{passive:!1});const e=s=>{(t==="look"?Mt.lookPointer:Mt.drivePointer)===s.pointerId&&kl(i,t)};i.addEventListener("pointerup",e),i.addEventListener("pointercancel",e),i.addEventListener("touchstart",s=>{s.preventDefault(),Or(),x.mode==="paused"&&(x.mode="race");const r=s.changedTouches[0];r&&(t==="look"&&(Mt.lookPointer=r.identifier),t==="drive"&&(Mt.drivePointer=r.identifier),yr(i,r))},{passive:!1}),i.addEventListener("touchmove",s=>{const r=t==="look"?Mt.lookPointer:Mt.drivePointer,a=zl(s,r);a&&(s.preventDefault(),yr(i,a))},{passive:!1});const n=s=>{const r=t==="look"?Mt.lookPointer:Mt.drivePointer;zl(s,r)&&(s.preventDefault(),kl(i,t))};i.addEventListener("touchend",n,{passive:!1}),i.addEventListener("touchcancel",n,{passive:!1})}for(const i of Bt.touchControls.querySelectorAll("button")){const t=i.dataset.code;i.addEventListener("pointerdown",n=>{n.preventDefault(),Or(),ee.add(t),i.setPointerCapture(n.pointerId)});const e=()=>ee.delete(t);i.addEventListener("pointerup",e),i.addEventListener("pointercancel",e),i.addEventListener("lostpointercapture",e)}Xs.addEventListener("touchstart",i=>{i.touches.length>=2&&(i.preventDefault(),$h(i,!0))},{passive:!1});Xs.addEventListener("touchmove",i=>{i.touches.length>=2&&(i.preventDefault(),$h(i))},{passive:!1});Xs.addEventListener("touchend",i=>{i.touches.length<2&&(Mt.pinchStartDistance=0)},{passive:!1});Xs.addEventListener("touchcancel",()=>{Mt.pinchStartDistance=0},{passive:!1});const n_=ce(x.s);x.y=n_.p.y+2.1;x.lastSafeS=x.s;x.lastSafeDistance=x.totalDistance;rc(.016);Is();Yh();
