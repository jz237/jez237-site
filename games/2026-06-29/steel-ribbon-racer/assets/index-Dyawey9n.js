(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Lo="181",id=0,pc=1,sd=2,Gl=1,Hl=2,Wn=3,hi=0,qe=1,me=2,In=0,ji=1,Qi=2,mc=3,xc=4,rd=5,Si=100,ad=101,od=102,cd=103,ld=104,hd=200,dd=201,ud=202,fd=203,Fa=204,Oa=205,pd=206,md=207,xd=208,gd=209,_d=210,vd=211,Md=212,Sd=213,yd=214,Ba=0,za=1,ka=2,ns=3,Va=4,Ga=5,Ha=6,Wa=7,Do=0,bd=1,wd=2,li=0,Wl=1,Xl=2,ql=3,Io=4,Yl=5,Zl=6,$l=7,Kl=300,is=301,ss=302,Xa=303,qa=304,Hr=306,Ze=1e3,qn=1001,Ya=1002,un=1003,Td=1004,js=1005,xn=1006,Jr=1007,bi=1008,Nn=1009,Jl=1010,jl=1011,Bs=1012,Uo=1013,Ai=1014,Ln=1015,Un=1016,No=1017,Fo=1018,zs=1020,Ql=35902,th=35899,eh=1021,nh=1022,wn=1023,ks=1026,Vs=1027,Oo=1028,Bo=1029,zo=1030,ko=1031,Vo=1033,Ar=33776,Cr=33777,Rr=33778,Pr=33779,Za=35840,$a=35841,Ka=35842,Ja=35843,ja=36196,Qa=37492,to=37496,eo=37808,no=37809,io=37810,so=37811,ro=37812,ao=37813,oo=37814,co=37815,lo=37816,ho=37817,uo=37818,fo=37819,po=37820,mo=37821,xo=36492,go=36494,_o=36495,vo=36283,Mo=36284,So=36285,yo=36286,Ed=3200,Ad=3201,Go=0,Cd=1,ri="",Se="srgb",rs="srgb-linear",Fr="linear",xe="srgb",Ui=7680,gc=519,Rd=512,Pd=513,Ld=514,ih=515,Dd=516,Id=517,Ud=518,Nd=519,_c=35044,vc="300 es",Dn=2e3,Or=2001;function sh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Br(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Fd(){const i=Br("canvas");return i.style.display="block",i}const Mc={};function Sc(...i){const t="THREE."+i.shift();console.log(t,...i)}function Gt(...i){const t="THREE."+i.shift();console.warn(t,...i)}function Pe(...i){const t="THREE."+i.shift();console.error(t,...i)}function Gs(...i){const t=i.join(" ");t in Mc||(Mc[t]=!0,Gt(...i))}function Od(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}class hs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ve=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let yc=1234567;const Rs=Math.PI/180,Hs=180/Math.PI;function Pi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ve[i&255]+Ve[i>>8&255]+Ve[i>>16&255]+Ve[i>>24&255]+"-"+Ve[t&255]+Ve[t>>8&255]+"-"+Ve[t>>16&15|64]+Ve[t>>24&255]+"-"+Ve[e&63|128]+Ve[e>>8&255]+"-"+Ve[e>>16&255]+Ve[e>>24&255]+Ve[n&255]+Ve[n>>8&255]+Ve[n>>16&255]+Ve[n>>24&255]).toLowerCase()}function jt(i,t,e){return Math.max(t,Math.min(e,i))}function Ho(i,t){return(i%t+t)%t}function Bd(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function zd(i,t,e){return i!==t?(e-i)/(t-i):0}function Ps(i,t,e){return(1-e)*i+e*t}function kd(i,t,e,n){return Ps(i,t,1-Math.exp(-e*n))}function Vd(i,t=1){return t-Math.abs(Ho(i,t*2)-t)}function Gd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Hd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Wd(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Xd(i,t){return i+Math.random()*(t-i)}function qd(i){return i*(.5-Math.random())}function Yd(i){i!==void 0&&(yc=i);let t=yc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Zd(i){return i*Rs}function $d(i){return i*Hs}function Kd(i){return(i&i-1)===0&&i!==0}function Jd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function jd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Qd(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),d=a((t+n)/2),u=r((t-n)/2),f=a((t-n)/2),p=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*d,c*u,c*f,o*l);break;case"YZY":i.set(c*f,o*d,c*u,o*l);break;case"ZXZ":i.set(c*u,c*f,o*d,o*l);break;case"XZX":i.set(o*d,c*g,c*p,o*l);break;case"YXY":i.set(c*p,o*d,c*g,o*l);break;case"ZYZ":i.set(c*g,c*p,o*d,o*l);break;default:Gt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ki(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ke(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const It={DEG2RAD:Rs,RAD2DEG:Hs,generateUUID:Pi,clamp:jt,euclideanModulo:Ho,mapLinear:Bd,inverseLerp:zd,lerp:Ps,damp:kd,pingpong:Vd,smoothstep:Gd,smootherstep:Hd,randInt:Wd,randFloat:Xd,randFloatSpread:qd,seededRandom:Yd,degToRad:Zd,radToDeg:$d,isPowerOfTwo:Kd,ceilPowerOfTwo:Jd,floorPowerOfTwo:jd,setQuaternionFromProperEuler:Qd,normalize:Ke,denormalize:Ki};class xt{constructor(t=0,e=0){xt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Kn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],u=n[s+3],f=r[a+0],p=r[a+1],g=r[a+2],y=r[a+3];if(o<=0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u;return}if(o>=1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=y;return}if(u!==y||c!==f||l!==p||d!==g){let m=c*f+l*p+d*g+u*y;m<0&&(f=-f,p=-p,g=-g,y=-y,m=-m);let h=1-o;if(m<.9995){const S=Math.acos(m),M=Math.sin(S);h=Math.sin(h*S)/M,o=Math.sin(o*S)/M,c=c*h+f*o,l=l*h+p*o,d=d*h+g*o,u=u*h+y*o}else{c=c*h+f*o,l=l*h+p*o,d=d*h+g*o,u=u*h+y*o;const S=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=S,l*=S,d*=S,u*=S}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],u=r[a],f=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+d*u+c*p-l*f,t[e+1]=c*g+d*f+l*u-o*p,t[e+2]=l*g+d*p+o*f-c*u,t[e+3]=d*g-o*u-c*f-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),u=o(r/2),f=c(n/2),p=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=f*d*u+l*p*g,this._y=l*p*u-f*d*g,this._z=l*d*g+f*p*u,this._w=l*d*u-f*p*g;break;case"YXZ":this._x=f*d*u+l*p*g,this._y=l*p*u-f*d*g,this._z=l*d*g-f*p*u,this._w=l*d*u+f*p*g;break;case"ZXY":this._x=f*d*u-l*p*g,this._y=l*p*u+f*d*g,this._z=l*d*g+f*p*u,this._w=l*d*u-f*p*g;break;case"ZYX":this._x=f*d*u-l*p*g,this._y=l*p*u+f*d*g,this._z=l*d*g-f*p*u,this._w=l*d*u+f*p*g;break;case"YZX":this._x=f*d*u+l*p*g,this._y=l*p*u+f*d*g,this._z=l*d*g-f*p*u,this._w=l*d*u-f*p*g;break;case"XZY":this._x=f*d*u-l*p*g,this._y=l*p*u-f*d*g,this._z=l*d*g+f*p*u,this._w=l*d*u+f*p*g;break;default:Gt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],d=e[6],u=e[10],f=n+o+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(d-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(d-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+d)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(jt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,d=e._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e<=0)return this;if(e>=1)return this.copy(t);let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-e;if(o<.9995){const l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,e=Math.sin(e*l)/d,this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this._onChangeCallback()}else this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(t=0,e=0,n=0){U.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(bc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(bc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),d=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+c*l+a*u-o*d,this.y=n+c*d+o*l-r*u,this.z=s+c*u+r*d-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this.z=jt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this.z=jt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return jr.copy(this).projectOnVector(t),this.sub(jr)}reflect(t){return this.sub(jr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const jr=new U,bc=new Kn;class qt{constructor(t,e,n,s,r,a,o,c,l){qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){const d=this.elements;return d[0]=t,d[1]=s,d[2]=o,d[3]=e,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],u=n[7],f=n[2],p=n[5],g=n[8],y=s[0],m=s[3],h=s[6],S=s[1],M=s[4],b=s[7],E=s[2],T=s[5],P=s[8];return r[0]=a*y+o*S+c*E,r[3]=a*m+o*M+c*T,r[6]=a*h+o*b+c*P,r[1]=l*y+d*S+u*E,r[4]=l*m+d*M+u*T,r[7]=l*h+d*b+u*P,r[2]=f*y+p*S+g*E,r[5]=f*m+p*M+g*T,r[8]=f*h+p*b+g*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8];return e*a*d-e*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],u=d*a-o*l,f=o*c-d*r,p=l*r-a*c,g=e*u+n*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return t[0]=u*y,t[1]=(s*l-d*n)*y,t[2]=(o*n-s*a)*y,t[3]=f*y,t[4]=(d*e-s*c)*y,t[5]=(s*r-o*e)*y,t[6]=p*y,t[7]=(n*c-l*e)*y,t[8]=(a*e-n*r)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Qr.makeScale(t,e)),this}rotate(t){return this.premultiply(Qr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Qr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Qr=new qt,wc=new qt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Tc=new qt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function tu(){const i={enabled:!0,workingColorSpace:rs,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===xe&&(s.r=Zn(s.r),s.g=Zn(s.g),s.b=Zn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===xe&&(s.r=ts(s.r),s.g=ts(s.g),s.b=ts(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ri?Fr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Gs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Gs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[rs]:{primaries:t,whitePoint:n,transfer:Fr,toXYZ:wc,fromXYZ:Tc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Se},outputColorSpaceConfig:{drawingBufferColorSpace:Se}},[Se]:{primaries:t,whitePoint:n,transfer:xe,toXYZ:wc,fromXYZ:Tc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Se}}}),i}const oe=tu();function Zn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ts(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ni;class eu{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ni===void 0&&(Ni=Br("canvas")),Ni.width=t.width,Ni.height=t.height;const s=Ni.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ni}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Br("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Zn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Zn(e[n]/255)*255):e[n]=Zn(e[n]);return{data:e,width:t.width,height:t.height}}else return Gt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let nu=0;class Wo{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nu++}),this.uuid=Pi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ta(s[a].image)):r.push(ta(s[a]))}else r=ta(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ta(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?eu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Gt("Texture: Unable to serialize Texture."),{})}let iu=0;const ea=new U;class Ye extends hs{constructor(t=Ye.DEFAULT_IMAGE,e=Ye.DEFAULT_MAPPING,n=qn,s=qn,r=xn,a=bi,o=wn,c=Nn,l=Ye.DEFAULT_ANISOTROPY,d=ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:iu++}),this.uuid=Pi(),this.name="",this.source=new Wo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ea).x}get height(){return this.source.getSize(ea).y}get depth(){return this.source.getSize(ea).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Gt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Gt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Kl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ze:t.x=t.x-Math.floor(t.x);break;case qn:t.x=t.x<0?0:1;break;case Ya:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ze:t.y=t.y-Math.floor(t.y);break;case qn:t.y=t.y<0?0:1;break;case Ya:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ye.DEFAULT_IMAGE=null;Ye.DEFAULT_MAPPING=Kl;Ye.DEFAULT_ANISOTROPY=1;class ve{constructor(t=0,e=0,n=0,s=1){ve.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],d=c[4],u=c[8],f=c[1],p=c[5],g=c[9],y=c[2],m=c[6],h=c[10];if(Math.abs(d-f)<.01&&Math.abs(u-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(u+y)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+h-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,b=(p+1)/2,E=(h+1)/2,T=(d+f)/4,P=(u+y)/4,C=(g+m)/4;return M>b&&M>E?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=T/n,r=P/n):b>E?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=T/s,r=C/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=P/r,s=C/r),this.set(n,s,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(u-y)*(u-y)+(f-d)*(f-d));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-y)/S,this.z=(f-d)/S,this.w=Math.acos((l+p+h-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this.z=jt(this.z,t.z,e.z),this.w=jt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this.z=jt(this.z,t,e),this.w=jt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class su extends hs{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new Ye(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:xn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Wo(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tn extends su{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class rh extends Ye{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=un,this.minFilter=un,this.wrapR=qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ru extends Ye{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=un,this.minFilter=un,this.wrapR=qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Li{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(gn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(gn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=gn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,gn):gn.fromBufferAttribute(r,a),gn.applyMatrix4(t.matrixWorld),this.expandByPoint(gn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Qs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Qs.copy(n.boundingBox)),Qs.applyMatrix4(t.matrixWorld),this.union(Qs)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,gn),gn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(xs),tr.subVectors(this.max,xs),Fi.subVectors(t.a,xs),Oi.subVectors(t.b,xs),Bi.subVectors(t.c,xs),Qn.subVectors(Oi,Fi),ti.subVectors(Bi,Oi),ui.subVectors(Fi,Bi);let e=[0,-Qn.z,Qn.y,0,-ti.z,ti.y,0,-ui.z,ui.y,Qn.z,0,-Qn.x,ti.z,0,-ti.x,ui.z,0,-ui.x,-Qn.y,Qn.x,0,-ti.y,ti.x,0,-ui.y,ui.x,0];return!na(e,Fi,Oi,Bi,tr)||(e=[1,0,0,0,1,0,0,0,1],!na(e,Fi,Oi,Bi,tr))?!1:(er.crossVectors(Qn,ti),e=[er.x,er.y,er.z],na(e,Fi,Oi,Bi,tr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,gn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(gn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Bn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Bn=[new U,new U,new U,new U,new U,new U,new U,new U],gn=new U,Qs=new Li,Fi=new U,Oi=new U,Bi=new U,Qn=new U,ti=new U,ui=new U,xs=new U,tr=new U,er=new U,fi=new U;function na(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){fi.fromArray(i,r);const o=s.x*Math.abs(fi.x)+s.y*Math.abs(fi.y)+s.z*Math.abs(fi.z),c=t.dot(fi),l=e.dot(fi),d=n.dot(fi);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const au=new Li,gs=new U,ia=new U;class ds{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):au.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;gs.subVectors(t,this.center);const e=gs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(gs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ia.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(gs.copy(t.center).add(ia)),this.expandByPoint(gs.copy(t.center).sub(ia))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const zn=new U,sa=new U,nr=new U,ei=new U,ra=new U,ir=new U,aa=new U;class Xo{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,zn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=zn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(zn.copy(this.origin).addScaledVector(this.direction,e),zn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){sa.copy(t).add(e).multiplyScalar(.5),nr.copy(e).sub(t).normalize(),ei.copy(this.origin).sub(sa);const r=t.distanceTo(e)*.5,a=-this.direction.dot(nr),o=ei.dot(this.direction),c=-ei.dot(nr),l=ei.lengthSq(),d=Math.abs(1-a*a);let u,f,p,g;if(d>0)if(u=a*c-o,f=a*o-c,g=r*d,u>=0)if(f>=-g)if(f<=g){const y=1/d;u*=y,f*=y,p=u*(u+a*f+2*o)+f*(a*u+f+2*c)+l}else f=r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+l):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(sa).addScaledVector(nr,f),p}intersectSphere(t,e){zn.subVectors(t.center,this.origin);const n=zn.dot(this.direction),s=zn.dot(zn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),d>=0?(r=(t.min.y-f.y)*d,a=(t.max.y-f.y)*d):(r=(t.max.y-f.y)*d,a=(t.min.y-f.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,zn)!==null}intersectTriangle(t,e,n,s,r){ra.subVectors(e,t),ir.subVectors(n,t),aa.crossVectors(ra,ir);let a=this.direction.dot(aa),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ei.subVectors(this.origin,t);const c=o*this.direction.dot(ir.crossVectors(ei,ir));if(c<0)return null;const l=o*this.direction.dot(ra.cross(ei));if(l<0||c+l>a)return null;const d=-o*ei.dot(aa);return d<0?null:this.at(d/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ue{constructor(t,e,n,s,r,a,o,c,l,d,u,f,p,g,y,m){ue.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,d,u,f,p,g,y,m)}set(t,e,n,s,r,a,o,c,l,d,u,f,p,g,y,m){const h=this.elements;return h[0]=t,h[4]=e,h[8]=n,h[12]=s,h[1]=r,h[5]=a,h[9]=o,h[13]=c,h[2]=l,h[6]=d,h[10]=u,h[14]=f,h[3]=p,h[7]=g,h[11]=y,h[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ue().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/zi.setFromMatrixColumn(t,0).length(),r=1/zi.setFromMatrixColumn(t,1).length(),a=1/zi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*d,p=a*u,g=o*d,y=o*u;e[0]=c*d,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=f-y*l,e[9]=-o*c,e[2]=y-f*l,e[6]=g+p*l,e[10]=a*c}else if(t.order==="YXZ"){const f=c*d,p=c*u,g=l*d,y=l*u;e[0]=f+y*o,e[4]=g*o-p,e[8]=a*l,e[1]=a*u,e[5]=a*d,e[9]=-o,e[2]=p*o-g,e[6]=y+f*o,e[10]=a*c}else if(t.order==="ZXY"){const f=c*d,p=c*u,g=l*d,y=l*u;e[0]=f-y*o,e[4]=-a*u,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*d,e[9]=y-f*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const f=a*d,p=a*u,g=o*d,y=o*u;e[0]=c*d,e[4]=g*l-p,e[8]=f*l+y,e[1]=c*u,e[5]=y*l+f,e[9]=p*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,p=a*l,g=o*c,y=o*l;e[0]=c*d,e[4]=y-f*u,e[8]=g*u+p,e[1]=u,e[5]=a*d,e[9]=-o*d,e[2]=-l*d,e[6]=p*u+g,e[10]=f-y*u}else if(t.order==="XZY"){const f=a*c,p=a*l,g=o*c,y=o*l;e[0]=c*d,e[4]=-u,e[8]=l*d,e[1]=f*u+y,e[5]=a*d,e[9]=p*u-g,e[2]=g*u-p,e[6]=o*d,e[10]=y*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ou,t,cu)}lookAt(t,e,n){const s=this.elements;return ln.subVectors(t,e),ln.lengthSq()===0&&(ln.z=1),ln.normalize(),ni.crossVectors(n,ln),ni.lengthSq()===0&&(Math.abs(n.z)===1?ln.x+=1e-4:ln.z+=1e-4,ln.normalize(),ni.crossVectors(n,ln)),ni.normalize(),sr.crossVectors(ln,ni),s[0]=ni.x,s[4]=sr.x,s[8]=ln.x,s[1]=ni.y,s[5]=sr.y,s[9]=ln.y,s[2]=ni.z,s[6]=sr.z,s[10]=ln.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],u=n[5],f=n[9],p=n[13],g=n[2],y=n[6],m=n[10],h=n[14],S=n[3],M=n[7],b=n[11],E=n[15],T=s[0],P=s[4],C=s[8],w=s[12],v=s[1],A=s[5],I=s[9],z=s[13],H=s[2],W=s[6],Y=s[10],st=s[14],K=s[3],ut=s[7],ft=s[11],Ct=s[15];return r[0]=a*T+o*v+c*H+l*K,r[4]=a*P+o*A+c*W+l*ut,r[8]=a*C+o*I+c*Y+l*ft,r[12]=a*w+o*z+c*st+l*Ct,r[1]=d*T+u*v+f*H+p*K,r[5]=d*P+u*A+f*W+p*ut,r[9]=d*C+u*I+f*Y+p*ft,r[13]=d*w+u*z+f*st+p*Ct,r[2]=g*T+y*v+m*H+h*K,r[6]=g*P+y*A+m*W+h*ut,r[10]=g*C+y*I+m*Y+h*ft,r[14]=g*w+y*z+m*st+h*Ct,r[3]=S*T+M*v+b*H+E*K,r[7]=S*P+M*A+b*W+E*ut,r[11]=S*C+M*I+b*Y+E*ft,r[15]=S*w+M*z+b*st+E*Ct,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],d=t[2],u=t[6],f=t[10],p=t[14],g=t[3],y=t[7],m=t[11],h=t[15];return g*(+r*c*u-s*l*u-r*o*f+n*l*f+s*o*p-n*c*p)+y*(+e*c*p-e*l*f+r*a*f-s*a*p+s*l*d-r*c*d)+m*(+e*l*u-e*o*p-r*a*u+n*a*p+r*o*d-n*l*d)+h*(-s*o*d-e*c*u+e*o*f+s*a*u-n*a*f+n*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],u=t[9],f=t[10],p=t[11],g=t[12],y=t[13],m=t[14],h=t[15],S=u*m*l-y*f*l+y*c*p-o*m*p-u*c*h+o*f*h,M=g*f*l-d*m*l-g*c*p+a*m*p+d*c*h-a*f*h,b=d*y*l-g*u*l+g*o*p-a*y*p-d*o*h+a*u*h,E=g*u*c-d*y*c-g*o*f+a*y*f+d*o*m-a*u*m,T=e*S+n*M+s*b+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/T;return t[0]=S*P,t[1]=(y*f*r-u*m*r-y*s*p+n*m*p+u*s*h-n*f*h)*P,t[2]=(o*m*r-y*c*r+y*s*l-n*m*l-o*s*h+n*c*h)*P,t[3]=(u*c*r-o*f*r-u*s*l+n*f*l+o*s*p-n*c*p)*P,t[4]=M*P,t[5]=(d*m*r-g*f*r+g*s*p-e*m*p-d*s*h+e*f*h)*P,t[6]=(g*c*r-a*m*r-g*s*l+e*m*l+a*s*h-e*c*h)*P,t[7]=(a*f*r-d*c*r+d*s*l-e*f*l-a*s*p+e*c*p)*P,t[8]=b*P,t[9]=(g*u*r-d*y*r-g*n*p+e*y*p+d*n*h-e*u*h)*P,t[10]=(a*y*r-g*o*r+g*n*l-e*y*l-a*n*h+e*o*h)*P,t[11]=(d*o*r-a*u*r-d*n*l+e*u*l+a*n*p-e*o*p)*P,t[12]=E*P,t[13]=(d*y*s-g*u*s+g*n*f-e*y*f-d*n*m+e*u*m)*P,t[14]=(g*o*s-a*y*s-g*n*c+e*y*c+a*n*m-e*o*m)*P,t[15]=(a*u*s-d*o*s+d*n*c-e*u*c-a*n*f+e*o*f)*P,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,d=a+a,u=o+o,f=r*l,p=r*d,g=r*u,y=a*d,m=a*u,h=o*u,S=c*l,M=c*d,b=c*u,E=n.x,T=n.y,P=n.z;return s[0]=(1-(y+h))*E,s[1]=(p+b)*E,s[2]=(g-M)*E,s[3]=0,s[4]=(p-b)*T,s[5]=(1-(f+h))*T,s[6]=(m+S)*T,s[7]=0,s[8]=(g+M)*P,s[9]=(m-S)*P,s[10]=(1-(f+y))*P,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=zi.set(s[0],s[1],s[2]).length();const a=zi.set(s[4],s[5],s[6]).length(),o=zi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],_n.copy(this);const l=1/r,d=1/a,u=1/o;return _n.elements[0]*=l,_n.elements[1]*=l,_n.elements[2]*=l,_n.elements[4]*=d,_n.elements[5]*=d,_n.elements[6]*=d,_n.elements[8]*=u,_n.elements[9]*=u,_n.elements[10]*=u,e.setFromRotationMatrix(_n),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Dn,c=!1){const l=this.elements,d=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),p=(n+s)/(n-s);let g,y;if(c)g=r/(a-r),y=a*r/(a-r);else if(o===Dn)g=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===Or)g=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Dn,c=!1){const l=this.elements,d=2/(e-t),u=2/(n-s),f=-(e+t)/(e-t),p=-(n+s)/(n-s);let g,y;if(c)g=1/(a-r),y=a/(a-r);else if(o===Dn)g=-2/(a-r),y=-(a+r)/(a-r);else if(o===Or)g=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const zi=new U,_n=new ue,ou=new U(0,0,0),cu=new U(1,1,1),ni=new U,sr=new U,ln=new U,Ec=new ue,Ac=new Kn;class Cn{constructor(t=0,e=0,n=0,s=Cn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],u=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(jt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-jt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(jt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-jt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(jt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,p),this._y=0);break;default:Gt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ec.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ec,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ac.setFromEuler(this),this.setFromQuaternion(Ac,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Cn.DEFAULT_ORDER="XYZ";class qo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let lu=0;const Cc=new U,ki=new Kn,kn=new ue,rr=new U,_s=new U,hu=new U,du=new Kn,Rc=new U(1,0,0),Pc=new U(0,1,0),Lc=new U(0,0,1),Dc={type:"added"},uu={type:"removed"},Vi={type:"childadded",child:null},oa={type:"childremoved",child:null};class Le extends hs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lu++}),this.uuid=Pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Le.DEFAULT_UP.clone();const t=new U,e=new Cn,n=new Kn,s=new U(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ue},normalMatrix:{value:new qt}}),this.matrix=new ue,this.matrixWorld=new ue,this.matrixAutoUpdate=Le.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Le.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ki.setFromAxisAngle(t,e),this.quaternion.multiply(ki),this}rotateOnWorldAxis(t,e){return ki.setFromAxisAngle(t,e),this.quaternion.premultiply(ki),this}rotateX(t){return this.rotateOnAxis(Rc,t)}rotateY(t){return this.rotateOnAxis(Pc,t)}rotateZ(t){return this.rotateOnAxis(Lc,t)}translateOnAxis(t,e){return Cc.copy(t).applyQuaternion(this.quaternion),this.position.add(Cc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Rc,t)}translateY(t){return this.translateOnAxis(Pc,t)}translateZ(t){return this.translateOnAxis(Lc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(kn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?rr.copy(t):rr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),_s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?kn.lookAt(_s,rr,this.up):kn.lookAt(rr,_s,this.up),this.quaternion.setFromRotationMatrix(kn),s&&(kn.extractRotation(s.matrixWorld),ki.setFromRotationMatrix(kn),this.quaternion.premultiply(ki.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Pe("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Dc),Vi.child=t,this.dispatchEvent(Vi),Vi.child=null):Pe("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(uu),oa.child=t,this.dispatchEvent(oa),oa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),kn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),kn.multiply(t.parent.matrixWorld)),t.applyMatrix4(kn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Dc),Vi.child=t,this.dispatchEvent(Vi),Vi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,t,hu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,du,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),d=a(t.images),u=a(t.shapes),f=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Le.DEFAULT_UP=new U(0,1,0);Le.DEFAULT_MATRIX_AUTO_UPDATE=!0;Le.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const vn=new U,Vn=new U,ca=new U,Gn=new U,Gi=new U,Hi=new U,Ic=new U,la=new U,ha=new U,da=new U,ua=new ve,fa=new ve,pa=new ve;class bn{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),vn.subVectors(t,e),s.cross(vn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){vn.subVectors(s,e),Vn.subVectors(n,e),ca.subVectors(t,e);const a=vn.dot(vn),o=vn.dot(Vn),c=vn.dot(ca),l=Vn.dot(Vn),d=Vn.dot(ca),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(l*c-o*d)*f,g=(a*d-o*c)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Gn)===null?!1:Gn.x>=0&&Gn.y>=0&&Gn.x+Gn.y<=1}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,Gn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Gn.x),c.addScaledVector(a,Gn.y),c.addScaledVector(o,Gn.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return ua.setScalar(0),fa.setScalar(0),pa.setScalar(0),ua.fromBufferAttribute(t,e),fa.fromBufferAttribute(t,n),pa.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(ua,r.x),a.addScaledVector(fa,r.y),a.addScaledVector(pa,r.z),a}static isFrontFacing(t,e,n,s){return vn.subVectors(n,e),Vn.subVectors(t,e),vn.cross(Vn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return vn.subVectors(this.c,this.b),Vn.subVectors(this.a,this.b),vn.cross(Vn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return bn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return bn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return bn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return bn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return bn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Gi.subVectors(s,n),Hi.subVectors(r,n),la.subVectors(t,n);const c=Gi.dot(la),l=Hi.dot(la);if(c<=0&&l<=0)return e.copy(n);ha.subVectors(t,s);const d=Gi.dot(ha),u=Hi.dot(ha);if(d>=0&&u<=d)return e.copy(s);const f=c*u-d*l;if(f<=0&&c>=0&&d<=0)return a=c/(c-d),e.copy(n).addScaledVector(Gi,a);da.subVectors(t,r);const p=Gi.dot(da),g=Hi.dot(da);if(g>=0&&p<=g)return e.copy(r);const y=p*l-c*g;if(y<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(Hi,o);const m=d*g-p*u;if(m<=0&&u-d>=0&&p-g>=0)return Ic.subVectors(r,s),o=(u-d)/(u-d+(p-g)),e.copy(s).addScaledVector(Ic,o);const h=1/(m+y+f);return a=y*h,o=f*h,e.copy(n).addScaledVector(Gi,a).addScaledVector(Hi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ah={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ii={h:0,s:0,l:0},ar={h:0,s:0,l:0};function ma(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class kt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Se){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,oe.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=oe.workingColorSpace){return this.r=t,this.g=e,this.b=n,oe.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=oe.workingColorSpace){if(t=Ho(t,1),e=jt(e,0,1),n=jt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=ma(a,r,t+1/3),this.g=ma(a,r,t),this.b=ma(a,r,t-1/3)}return oe.colorSpaceToWorking(this,s),this}setStyle(t,e=Se){function n(r){r!==void 0&&parseFloat(r)<1&&Gt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Gt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Gt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Se){const n=ah[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Gt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Zn(t.r),this.g=Zn(t.g),this.b=Zn(t.b),this}copyLinearToSRGB(t){return this.r=ts(t.r),this.g=ts(t.g),this.b=ts(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Se){return oe.workingToColorSpace(Ge.copy(this),t),Math.round(jt(Ge.r*255,0,255))*65536+Math.round(jt(Ge.g*255,0,255))*256+Math.round(jt(Ge.b*255,0,255))}getHexString(t=Se){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=oe.workingColorSpace){oe.workingToColorSpace(Ge.copy(this),e);const n=Ge.r,s=Ge.g,r=Ge.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=d<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=oe.workingColorSpace){return oe.workingToColorSpace(Ge.copy(this),e),t.r=Ge.r,t.g=Ge.g,t.b=Ge.b,t}getStyle(t=Se){oe.workingToColorSpace(Ge.copy(this),t);const e=Ge.r,n=Ge.g,s=Ge.b;return t!==Se?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ii),this.setHSL(ii.h+t,ii.s+e,ii.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ii),t.getHSL(ar);const n=Ps(ii.h,ar.h,e),s=Ps(ii.s,ar.s,e),r=Ps(ii.l,ar.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ge=new kt;kt.NAMES=ah;let fu=0;class Di extends hs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:fu++}),this.uuid=Pi(),this.name="",this.type="Material",this.blending=ji,this.side=hi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fa,this.blendDst=Oa,this.blendEquation=Si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new kt(0,0,0),this.blendAlpha=0,this.depthFunc=ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=gc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ui,this.stencilZFail=Ui,this.stencilZPass=Ui,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Gt(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Gt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ji&&(n.blending=this.blending),this.side!==hi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Fa&&(n.blendSrc=this.blendSrc),this.blendDst!==Oa&&(n.blendDst=this.blendDst),this.blendEquation!==Si&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ns&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==gc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ui&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ui&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ui&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class we extends Di{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=Do,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ue=new U,or=new xt;let pu=0;class En{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:pu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=_c,this.updateRanges=[],this.gpuType=Ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)or.fromBufferAttribute(this,e),or.applyMatrix3(t),this.setXY(e,or.x,or.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix3(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix4(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyNormalMatrix(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.transformDirection(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ki(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ke(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ki(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ke(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ki(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ke(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ki(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ke(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ki(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ke(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ke(e,this.array),n=Ke(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ke(e,this.array),n=Ke(n,this.array),s=Ke(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ke(e,this.array),n=Ke(n,this.array),s=Ke(s,this.array),r=Ke(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==_c&&(t.usage=this.usage),t}}class oh extends En{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ch extends En{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class re extends En{constructor(t,e,n){super(new Float32Array(t),e,n)}}let mu=0;const pn=new ue,xa=new Le,Wi=new U,hn=new Li,vs=new Li,ke=new U;class De extends hs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:mu++}),this.uuid=Pi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(sh(t)?ch:oh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new qt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return pn.makeRotationFromQuaternion(t),this.applyMatrix4(pn),this}rotateX(t){return pn.makeRotationX(t),this.applyMatrix4(pn),this}rotateY(t){return pn.makeRotationY(t),this.applyMatrix4(pn),this}rotateZ(t){return pn.makeRotationZ(t),this.applyMatrix4(pn),this}translate(t,e,n){return pn.makeTranslation(t,e,n),this.applyMatrix4(pn),this}scale(t,e,n){return pn.makeScale(t,e,n),this.applyMatrix4(pn),this}lookAt(t){return xa.lookAt(t),xa.updateMatrix(),this.applyMatrix4(xa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wi).negate(),this.translate(Wi.x,Wi.y,Wi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new re(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Gt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Li);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Pe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];hn.setFromBufferAttribute(r),this.morphTargetsRelative?(ke.addVectors(this.boundingBox.min,hn.min),this.boundingBox.expandByPoint(ke),ke.addVectors(this.boundingBox.max,hn.max),this.boundingBox.expandByPoint(ke)):(this.boundingBox.expandByPoint(hn.min),this.boundingBox.expandByPoint(hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Pe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ds);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Pe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){const n=this.boundingSphere.center;if(hn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];vs.setFromBufferAttribute(o),this.morphTargetsRelative?(ke.addVectors(hn.min,vs.min),hn.expandByPoint(ke),ke.addVectors(hn.max,vs.max),hn.expandByPoint(ke)):(hn.expandByPoint(vs.min),hn.expandByPoint(vs.max))}hn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)ke.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ke));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)ke.fromBufferAttribute(o,l),c&&(Wi.fromBufferAttribute(t,l),ke.add(Wi)),s=Math.max(s,n.distanceToSquared(ke))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Pe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Pe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new En(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let C=0;C<n.count;C++)o[C]=new U,c[C]=new U;const l=new U,d=new U,u=new U,f=new xt,p=new xt,g=new xt,y=new U,m=new U;function h(C,w,v){l.fromBufferAttribute(n,C),d.fromBufferAttribute(n,w),u.fromBufferAttribute(n,v),f.fromBufferAttribute(r,C),p.fromBufferAttribute(r,w),g.fromBufferAttribute(r,v),d.sub(l),u.sub(l),p.sub(f),g.sub(f);const A=1/(p.x*g.y-g.x*p.y);isFinite(A)&&(y.copy(d).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(A),m.copy(u).multiplyScalar(p.x).addScaledVector(d,-g.x).multiplyScalar(A),o[C].add(y),o[w].add(y),o[v].add(y),c[C].add(m),c[w].add(m),c[v].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let C=0,w=S.length;C<w;++C){const v=S[C],A=v.start,I=v.count;for(let z=A,H=A+I;z<H;z+=3)h(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const M=new U,b=new U,E=new U,T=new U;function P(C){E.fromBufferAttribute(s,C),T.copy(E);const w=o[C];M.copy(w),M.sub(E.multiplyScalar(E.dot(w))).normalize(),b.crossVectors(T,w);const A=b.dot(c[C])<0?-1:1;a.setXYZW(C,M.x,M.y,M.z,A)}for(let C=0,w=S.length;C<w;++C){const v=S[C],A=v.start,I=v.count;for(let z=A,H=A+I;z<H;z+=3)P(t.getX(z+0)),P(t.getX(z+1)),P(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new En(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new U,r=new U,a=new U,o=new U,c=new U,l=new U,d=new U,u=new U;if(t)for(let f=0,p=t.count;f<p;f+=3){const g=t.getX(f+0),y=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,y),a.fromBufferAttribute(e,m),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,y),l.fromBufferAttribute(n,m),o.add(d),c.add(d),l.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ke.fromBufferAttribute(t,e),ke.normalize(),t.setXYZ(e,ke.x,ke.y,ke.z)}toNonIndexed(){function t(o,c){const l=o.array,d=o.itemSize,u=o.normalized,f=new l.constructor(c.length*d);let p=0,g=0;for(let y=0,m=c.length;y<m;y++){o.isInterleavedBufferAttribute?p=c[y]*o.data.stride+o.offset:p=c[y]*d;for(let h=0;h<d;h++)f[g++]=l[p++]}return new En(f,d,u)}if(this.index===null)return Gt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new De,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,u=l.length;d<u;d++){const f=l[d],p=t(f,n);c.push(p)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,f=l.length;u<f;u++){const p=l[u];d.push(p.toJSON(t.data))}d.length>0&&(s[c]=d,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(e))}const r=t.morphAttributes;for(const l in r){const d=[],u=r[l];for(let f=0,p=u.length;f<p;f++)d.push(u[f].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,d=a.length;l<d;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Uc=new ue,pi=new Xo,cr=new ds,Nc=new U,lr=new U,hr=new U,dr=new U,ga=new U,ur=new U,Fc=new U,fr=new U;class X extends Le{constructor(t=new De,e=new we){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){ur.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],u=r[c];d!==0&&(ga.fromBufferAttribute(u,t),a?ur.addScaledVector(ga,d):ur.addScaledVector(ga.sub(e),d))}e.add(ur)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),cr.copy(n.boundingSphere),cr.applyMatrix4(r),pi.copy(t.ray).recast(t.near),!(cr.containsPoint(pi.origin)===!1&&(pi.intersectSphere(cr,Nc)===null||pi.origin.distanceToSquared(Nc)>(t.far-t.near)**2))&&(Uc.copy(r).invert(),pi.copy(t.ray).applyMatrix4(Uc),!(n.boundingBox!==null&&pi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,pi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,y=f.length;g<y;g++){const m=f[g],h=a[m.materialIndex],S=Math.max(m.start,p.start),M=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let b=S,E=M;b<E;b+=3){const T=o.getX(b),P=o.getX(b+1),C=o.getX(b+2);s=pr(this,h,t,n,l,d,u,T,P,C),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);for(let m=g,h=y;m<h;m+=3){const S=o.getX(m),M=o.getX(m+1),b=o.getX(m+2);s=pr(this,a,t,n,l,d,u,S,M,b),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,y=f.length;g<y;g++){const m=f[g],h=a[m.materialIndex],S=Math.max(m.start,p.start),M=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let b=S,E=M;b<E;b+=3){const T=b,P=b+1,C=b+2;s=pr(this,h,t,n,l,d,u,T,P,C),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),y=Math.min(c.count,p.start+p.count);for(let m=g,h=y;m<h;m+=3){const S=m,M=m+1,b=m+2;s=pr(this,a,t,n,l,d,u,S,M,b),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function xu(i,t,e,n,s,r,a,o){let c;if(t.side===qe?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===hi,o),c===null)return null;fr.copy(o),fr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(fr);return l<e.near||l>e.far?null:{distance:l,point:fr.clone(),object:i}}function pr(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,lr),i.getVertexPosition(c,hr),i.getVertexPosition(l,dr);const d=xu(i,t,e,n,lr,hr,dr,Fc);if(d){const u=new U;bn.getBarycoord(Fc,lr,hr,dr,u),s&&(d.uv=bn.getInterpolatedAttribute(s,o,c,l,u,new xt)),r&&(d.uv1=bn.getInterpolatedAttribute(r,o,c,l,u,new xt)),a&&(d.normal=bn.getInterpolatedAttribute(a,o,c,l,u,new U),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new U,materialIndex:0};bn.getNormal(lr,hr,dr,f.normal),d.face=f,d.barycoord=u}return d}class Lt extends De{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new re(l,3)),this.setAttribute("normal",new re(d,3)),this.setAttribute("uv",new re(u,2));function g(y,m,h,S,M,b,E,T,P,C,w){const v=b/P,A=E/C,I=b/2,z=E/2,H=T/2,W=P+1,Y=C+1;let st=0,K=0;const ut=new U;for(let ft=0;ft<Y;ft++){const Ct=ft*A-z;for(let Zt=0;Zt<W;Zt++){const ie=Zt*v-I;ut[y]=ie*S,ut[m]=Ct*M,ut[h]=H,l.push(ut.x,ut.y,ut.z),ut[y]=0,ut[m]=0,ut[h]=T>0?1:-1,d.push(ut.x,ut.y,ut.z),u.push(Zt/P),u.push(1-ft/C),st+=1}}for(let ft=0;ft<C;ft++)for(let Ct=0;Ct<P;Ct++){const Zt=f+Ct+W*ft,ie=f+Ct+W*(ft+1),fe=f+(Ct+1)+W*(ft+1),se=f+(Ct+1)+W*ft;c.push(Zt,ie,se),c.push(ie,fe,se),K+=6}o.addGroup(p,K,w),p+=K,f+=st}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Lt(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function as(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Gt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Je(i){const t={};for(let e=0;e<i.length;e++){const n=as(i[e]);for(const s in n)t[s]=n[s]}return t}function gu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function lh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:oe.workingColorSpace}const Ws={clone:as,merge:Je};var _u=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Xe extends Di{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_u,this.fragmentShader=vu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=as(t.uniforms),this.uniformsGroups=gu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class hh extends Le{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ue,this.projectionMatrix=new ue,this.projectionMatrixInverse=new ue,this.coordinateSystem=Dn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const si=new U,Oc=new xt,Bc=new xt;class dn extends hh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Hs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Rs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Hs*2*Math.atan(Math.tan(Rs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(si.x,si.y).multiplyScalar(-t/si.z),si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(si.x,si.y).multiplyScalar(-t/si.z)}getViewSize(t,e){return this.getViewBounds(t,Oc,Bc),e.subVectors(Bc,Oc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Rs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Xi=-90,qi=1;class Mu extends Le{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new dn(Xi,qi,t,e);s.layers=this.layers,this.add(s);const r=new dn(Xi,qi,t,e);r.layers=this.layers,this.add(r);const a=new dn(Xi,qi,t,e);a.layers=this.layers,this.add(a);const o=new dn(Xi,qi,t,e);o.layers=this.layers,this.add(o);const c=new dn(Xi,qi,t,e);c.layers=this.layers,this.add(c);const l=new dn(Xi,qi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===Dn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Or)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,s),t.render(e,d),t.setRenderTarget(u,f,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class dh extends Ye{constructor(t=[],e=is,n,s,r,a,o,c,l,d){super(t,e,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Su extends Tn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new dh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Lt(5,5,5),r=new Xe({name:"CubemapFromEquirect",uniforms:as(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qe,blending:In});r.uniforms.tEquirect.value=e;const a=new X(s,r),o=e.minFilter;return e.minFilter===bi&&(e.minFilter=xn),new Mu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class le extends Le{constructor(){super(),this.isGroup=!0,this.type="Group"}}const yu={type:"move"};class _a{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new le,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new le,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new le,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const y of t.hand.values()){const m=e.getJointPose(y,n),h=this._getHandJoint(l,y);m!==null&&(h.matrix.fromArray(m.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=m.radius),h.visible=m!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=d.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&f>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(yu)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new le;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Yo{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new kt(t),this.near=e,this.far=n}clone(){return new Yo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class uh extends Le{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cn,this.environmentIntensity=1,this.environmentRotation=new Cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class fh extends Ye{constructor(t=null,e=1,n=1,s,r,a,o,c,l=un,d=un,u,f){super(null,a,o,c,l,d,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class zc extends En{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Yi=new ue,kc=new ue,mr=[],Vc=new Li,bu=new ue,Ms=new X,Ss=new ds;class He extends X{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new zc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,bu)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Li),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Yi),Vc.copy(t.boundingBox).applyMatrix4(Yi),this.boundingBox.union(Vc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ds),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Yi),Ss.copy(t.boundingSphere).applyMatrix4(Yi),this.boundingSphere.union(Ss)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Ms.geometry=this.geometry,Ms.material=this.material,Ms.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ss.copy(this.boundingSphere),Ss.applyMatrix4(n),t.ray.intersectsSphere(Ss)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Yi),kc.multiplyMatrices(n,Yi),Ms.matrixWorld=kc,Ms.raycast(t,mr);for(let a=0,o=mr.length;a<o;a++){const c=mr[a];c.instanceId=r,c.object=this,e.push(c)}mr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new zc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new fh(new Float32Array(s*this.count),s,this.count,Oo,Ln));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*t;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const va=new U,wu=new U,Tu=new qt;class vi{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=va.subVectors(n,e).cross(wu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(va),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Tu.getNormalMatrix(t),s=this.coplanarPoint(va).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const mi=new ds,Eu=new xt(.5,.5),xr=new U;class Zo{constructor(t=new vi,e=new vi,n=new vi,s=new vi,r=new vi,a=new vi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Dn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],u=r[5],f=r[6],p=r[7],g=r[8],y=r[9],m=r[10],h=r[11],S=r[12],M=r[13],b=r[14],E=r[15];if(s[0].setComponents(l-a,p-d,h-g,E-S).normalize(),s[1].setComponents(l+a,p+d,h+g,E+S).normalize(),s[2].setComponents(l+o,p+u,h+y,E+M).normalize(),s[3].setComponents(l-o,p-u,h-y,E-M).normalize(),n)s[4].setComponents(c,f,m,b).normalize(),s[5].setComponents(l-c,p-f,h-m,E-b).normalize();else if(s[4].setComponents(l-c,p-f,h-m,E-b).normalize(),e===Dn)s[5].setComponents(l+c,p+f,h+m,E+b).normalize();else if(e===Or)s[5].setComponents(c,f,m,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),mi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),mi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(mi)}intersectsSprite(t){mi.center.set(0,0,0);const e=Eu.distanceTo(t.center);return mi.radius=.7071067811865476+e,mi.applyMatrix4(t.matrixWorld),this.intersectsSphere(mi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(xr.x=s.normal.x>0?t.max.x:t.min.x,xr.y=s.normal.y>0?t.max.y:t.min.y,xr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(xr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class bo extends Di{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new kt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const zr=new U,kr=new U,Gc=new ue,ys=new Xo,gr=new ds,Ma=new U,Hc=new U;class Wc extends Le{constructor(t=new De,e=new bo){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)zr.fromBufferAttribute(e,s-1),kr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=zr.distanceTo(kr);t.setAttribute("lineDistance",new re(n,1))}else Gt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),gr.copy(n.boundingSphere),gr.applyMatrix4(s),gr.radius+=r,t.ray.intersectsSphere(gr)===!1)return;Gc.copy(s).invert(),ys.copy(t.ray).applyMatrix4(Gc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,f=n.attributes.position;if(d!==null){const p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let y=p,m=g-1;y<m;y+=l){const h=d.getX(y),S=d.getX(y+1),M=_r(this,t,ys,c,h,S,y);M&&e.push(M)}if(this.isLineLoop){const y=d.getX(g-1),m=d.getX(p),h=_r(this,t,ys,c,y,m,g-1);h&&e.push(h)}}else{const p=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let y=p,m=g-1;y<m;y+=l){const h=_r(this,t,ys,c,y,y+1,y);h&&e.push(h)}if(this.isLineLoop){const y=_r(this,t,ys,c,g-1,p,g-1);y&&e.push(y)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function _r(i,t,e,n,s,r,a){const o=i.geometry.attributes.position;if(zr.fromBufferAttribute(o,s),kr.fromBufferAttribute(o,r),e.distanceSqToSegment(zr,kr,Ma,Hc)>n)return;Ma.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Ma);if(!(l<t.near||l>t.far))return{distance:l,point:Hc.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class rn extends Ye{constructor(t,e,n,s,r,a,o,c,l){super(t,e,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ph extends Ye{constructor(t,e,n=Ai,s,r,a,o=un,c=un,l,d=ks,u=1){if(d!==ks&&d!==Vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:u};super(f,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Wo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class mh extends Ye{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Rn extends De{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],c=[],l=new U,d=new xt;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const p=n+u/e*s;l.x=t*Math.cos(p),l.y=t*Math.sin(p),a.push(l.x,l.y,l.z),o.push(0,0,1),d.x=(a[f]/t+1)/2,d.y=(a[f+1]/t+1)/2,c.push(d.x,d.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new re(a,3)),this.setAttribute("normal",new re(o,3)),this.setAttribute("uv",new re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rn(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class ge extends De{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],f=[],p=[];let g=0;const y=[],m=n/2;let h=0;S(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(d),this.setAttribute("position",new re(u,3)),this.setAttribute("normal",new re(f,3)),this.setAttribute("uv",new re(p,2));function S(){const b=new U,E=new U;let T=0;const P=(e-t)/n;for(let C=0;C<=r;C++){const w=[],v=C/r,A=v*(e-t)+t;for(let I=0;I<=s;I++){const z=I/s,H=z*c+o,W=Math.sin(H),Y=Math.cos(H);E.x=A*W,E.y=-v*n+m,E.z=A*Y,u.push(E.x,E.y,E.z),b.set(W,P,Y).normalize(),f.push(b.x,b.y,b.z),p.push(z,1-v),w.push(g++)}y.push(w)}for(let C=0;C<s;C++)for(let w=0;w<r;w++){const v=y[w][C],A=y[w+1][C],I=y[w+1][C+1],z=y[w][C+1];(t>0||w!==0)&&(d.push(v,A,z),T+=3),(e>0||w!==r-1)&&(d.push(A,I,z),T+=3)}l.addGroup(h,T,0),h+=T}function M(b){const E=g,T=new xt,P=new U;let C=0;const w=b===!0?t:e,v=b===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,m*v,0),f.push(0,v,0),p.push(.5,.5),g++;const A=g;for(let I=0;I<=s;I++){const H=I/s*c+o,W=Math.cos(H),Y=Math.sin(H);P.x=w*Y,P.y=m*v,P.z=w*W,u.push(P.x,P.y,P.z),f.push(0,v,0),T.x=W*.5+.5,T.y=Y*.5*v+.5,p.push(T.x,T.y),g++}for(let I=0;I<s;I++){const z=E+I,H=A+I;b===!0?d.push(H,H+1,z):d.push(H+1,H,z),C+=3}l.addGroup(h,C,b===!0?1:2),h+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ge(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ei extends ge{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Ei(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Wr extends De{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),l(n),d(),this.setAttribute("position",new re(r,3)),this.setAttribute("normal",new re(r.slice(),3)),this.setAttribute("uv",new re(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(S){const M=new U,b=new U,E=new U;for(let T=0;T<e.length;T+=3)p(e[T+0],M),p(e[T+1],b),p(e[T+2],E),c(M,b,E,S)}function c(S,M,b,E){const T=E+1,P=[];for(let C=0;C<=T;C++){P[C]=[];const w=S.clone().lerp(b,C/T),v=M.clone().lerp(b,C/T),A=T-C;for(let I=0;I<=A;I++)I===0&&C===T?P[C][I]=w:P[C][I]=w.clone().lerp(v,I/A)}for(let C=0;C<T;C++)for(let w=0;w<2*(T-C)-1;w++){const v=Math.floor(w/2);w%2===0?(f(P[C][v+1]),f(P[C+1][v]),f(P[C][v])):(f(P[C][v+1]),f(P[C+1][v+1]),f(P[C+1][v]))}}function l(S){const M=new U;for(let b=0;b<r.length;b+=3)M.x=r[b+0],M.y=r[b+1],M.z=r[b+2],M.normalize().multiplyScalar(S),r[b+0]=M.x,r[b+1]=M.y,r[b+2]=M.z}function d(){const S=new U;for(let M=0;M<r.length;M+=3){S.x=r[M+0],S.y=r[M+1],S.z=r[M+2];const b=m(S)/2/Math.PI+.5,E=h(S)/Math.PI+.5;a.push(b,1-E)}g(),u()}function u(){for(let S=0;S<a.length;S+=6){const M=a[S+0],b=a[S+2],E=a[S+4],T=Math.max(M,b,E),P=Math.min(M,b,E);T>.9&&P<.1&&(M<.2&&(a[S+0]+=1),b<.2&&(a[S+2]+=1),E<.2&&(a[S+4]+=1))}}function f(S){r.push(S.x,S.y,S.z)}function p(S,M){const b=S*3;M.x=t[b+0],M.y=t[b+1],M.z=t[b+2]}function g(){const S=new U,M=new U,b=new U,E=new U,T=new xt,P=new xt,C=new xt;for(let w=0,v=0;w<r.length;w+=9,v+=6){S.set(r[w+0],r[w+1],r[w+2]),M.set(r[w+3],r[w+4],r[w+5]),b.set(r[w+6],r[w+7],r[w+8]),T.set(a[v+0],a[v+1]),P.set(a[v+2],a[v+3]),C.set(a[v+4],a[v+5]),E.copy(S).add(M).add(b).divideScalar(3);const A=m(E);y(T,v+0,S,A),y(P,v+2,M,A),y(C,v+4,b,A)}}function y(S,M,b,E){E<0&&S.x===1&&(a[M]=S.x-1),b.x===0&&b.z===0&&(a[M]=E/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function h(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wr(t.vertices,t.indices,t.radius,t.details)}}class $o extends Wr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new $o(t.radius,t.detail)}}class Fn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Gt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const d=n[s],f=n[s+1]-d,p=(a-d)/f;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new xt:new U);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new U,s=[],r=[],a=[],o=new U,c=new ue;for(let p=0;p<=t;p++){const g=p/t;s[p]=this.getTangentAt(g,new U)}r[0]=new U,a[0]=new U;let l=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(jt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(jt(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ko extends Fn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new xt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,p=l-this.aY;c=f*d-p*u+this.aX,l=f*u+p*d+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Au extends Ko{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Jo(){let i=0,t=0,e=0,n=0;function s(r,a,o,c){i=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,d,u){let f=(a-r)/l-(o-r)/(l+d)+(o-a)/d,p=(o-a)/d-(c-a)/(d+u)+(c-o)/u;f*=d,p*=d,s(a,o,f,p)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const vr=new U,Sa=new Jo,ya=new Jo,ba=new Jo;class Cu extends Fn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new U){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,d;this.closed||o>0?l=s[(o-1)%r]:(vr.subVectors(s[0],s[1]).add(s[0]),l=vr);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(vr.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=vr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),p),y=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(d),p);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),Sa.initNonuniformCatmullRom(l.x,u.x,f.x,d.x,g,y,m),ya.initNonuniformCatmullRom(l.y,u.y,f.y,d.y,g,y,m),ba.initNonuniformCatmullRom(l.z,u.z,f.z,d.z,g,y,m)}else this.curveType==="catmullrom"&&(Sa.initCatmullRom(l.x,u.x,f.x,d.x,this.tension),ya.initCatmullRom(l.y,u.y,f.y,d.y,this.tension),ba.initCatmullRom(l.z,u.z,f.z,d.z,this.tension));return n.set(Sa.calc(c),ya.calc(c),ba.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new U().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Xc(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,c=i*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*i+e}function Ru(i,t){const e=1-i;return e*e*t}function Pu(i,t){return 2*(1-i)*i*t}function Lu(i,t){return i*i*t}function Ls(i,t,e,n){return Ru(i,t)+Pu(i,e)+Lu(i,n)}function Du(i,t){const e=1-i;return e*e*e*t}function Iu(i,t){const e=1-i;return 3*e*e*i*t}function Uu(i,t){return 3*(1-i)*i*i*t}function Nu(i,t){return i*i*i*t}function Ds(i,t,e,n,s){return Du(i,t)+Iu(i,e)+Uu(i,n)+Nu(i,s)}class xh extends Fn{constructor(t=new xt,e=new xt,n=new xt,s=new xt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new xt){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ds(t,s.x,r.x,a.x,o.x),Ds(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Fu extends Fn{constructor(t=new U,e=new U,n=new U,s=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new U){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ds(t,s.x,r.x,a.x,o.x),Ds(t,s.y,r.y,a.y,o.y),Ds(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class gh extends Fn{constructor(t=new xt,e=new xt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new xt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new xt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ou extends Fn{constructor(t=new U,e=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new U){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new U){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class _h extends Fn{constructor(t=new xt,e=new xt,n=new xt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new xt){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ls(t,s.x,r.x,a.x),Ls(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Bu extends Fn{constructor(t=new U,e=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new U){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ls(t,s.x,r.x,a.x),Ls(t,s.y,r.y,a.y),Ls(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class vh extends Fn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new xt){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Xc(o,c.x,l.x,d.x,u.x),Xc(o,c.y,l.y,d.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new xt().fromArray(s))}return this}}var qc=Object.freeze({__proto__:null,ArcCurve:Au,CatmullRomCurve3:Cu,CubicBezierCurve:xh,CubicBezierCurve3:Fu,EllipseCurve:Ko,LineCurve:gh,LineCurve3:Ou,QuadraticBezierCurve:_h,QuadraticBezierCurve3:Bu,SplineCurve:vh});class zu extends Fn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new qc[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const d=c[l];n&&n.equals(d)||(e.push(d),n=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new qc[s.type]().fromJSON(s))}return this}}class Yc extends zu{constructor(t){super(),this.type="Path",this.currentPoint=new xt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new gh(this.currentPoint.clone(),new xt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new _h(this.currentPoint.clone(),new xt(t,e),new xt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new xh(this.currentPoint.clone(),new xt(t,e),new xt(n,s),new xt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new vh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+l,e+d,n,s,r,a,o,c),this}absellipse(t,e,n,s,r,a,o,c){const l=new Ko(t,e,n,s,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Mh extends Yc{constructor(t){super(t),this.uuid=Pi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Yc().fromJSON(s))}return this}}function ku(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Sh(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=Xu(i,t,r,e)),i.length>80*e){o=i[0],c=i[1];let d=o,u=c;for(let f=e;f<s;f+=e){const p=i[f],g=i[f+1];p<o&&(o=p),g<c&&(c=g),p>d&&(d=p),g>u&&(u=g)}l=Math.max(d-o,u-c),l=l!==0?32767/l:0}return Xs(r,a,e,o,c,l,0),a}function Sh(i,t,e,n,s){let r;if(s===nf(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Zc(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Zc(a/n|0,i[a],i[a+1],r);return r&&os(r,r.next)&&(Ys(r),r=r.next),r}function Ci(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(os(e,e.next)||Ae(e.prev,e,e.next)===0)){if(Ys(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Xs(i,t,e,n,s,r,a){if(!i)return;!a&&r&&Ku(i,n,s,r);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?Gu(i,n,s,r):Vu(i)){t.push(c.i,i.i,l.i),Ys(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=Hu(Ci(i),t),Xs(i,t,e,n,s,r,2)):a===2&&Wu(i,t,e,n,s,r):Xs(Ci(i),t,e,n,s,r,1);break}}}function Vu(i){const t=i.prev,e=i,n=i.next;if(Ae(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,c=e.y,l=n.y,d=Math.min(s,r,a),u=Math.min(o,c,l),f=Math.max(s,r,a),p=Math.max(o,c,l);let g=n.next;for(;g!==t;){if(g.x>=d&&g.x<=f&&g.y>=u&&g.y<=p&&Es(s,o,r,c,a,l,g.x,g.y)&&Ae(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Gu(i,t,e,n){const s=i.prev,r=i,a=i.next;if(Ae(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,d=s.y,u=r.y,f=a.y,p=Math.min(o,c,l),g=Math.min(d,u,f),y=Math.max(o,c,l),m=Math.max(d,u,f),h=wo(p,g,t,e,n),S=wo(y,m,t,e,n);let M=i.prevZ,b=i.nextZ;for(;M&&M.z>=h&&b&&b.z<=S;){if(M.x>=p&&M.x<=y&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&Es(o,d,c,u,l,f,M.x,M.y)&&Ae(M.prev,M,M.next)>=0||(M=M.prevZ,b.x>=p&&b.x<=y&&b.y>=g&&b.y<=m&&b!==s&&b!==a&&Es(o,d,c,u,l,f,b.x,b.y)&&Ae(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;M&&M.z>=h;){if(M.x>=p&&M.x<=y&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&Es(o,d,c,u,l,f,M.x,M.y)&&Ae(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;b&&b.z<=S;){if(b.x>=p&&b.x<=y&&b.y>=g&&b.y<=m&&b!==s&&b!==a&&Es(o,d,c,u,l,f,b.x,b.y)&&Ae(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Hu(i,t){let e=i;do{const n=e.prev,s=e.next.next;!os(n,s)&&bh(n,e,e.next,s)&&qs(n,s)&&qs(s,n)&&(t.push(n.i,e.i,s.i),Ys(e),Ys(e.next),e=i=s),e=e.next}while(e!==i);return Ci(e)}function Wu(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Qu(a,o)){let c=wh(a,o);a=Ci(a,a.next),c=Ci(c,c.next),Xs(a,t,e,n,s,r,0),Xs(c,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Xu(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,c=r<a-1?t[r+1]*n:i.length,l=Sh(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(ju(l))}s.sort(qu);for(let r=0;r<s.length;r++)e=Yu(s[r],e);return e}function qu(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Yu(i,t){const e=Zu(i,t);if(!e)return t;const n=wh(e,i);return Ci(n,n.next),Ci(e,e.next)}function Zu(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(os(i,e))return e;do{if(os(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,a=e.x<e.next.x?e:e.next,u===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,c=a.x,l=a.y;let d=1/0;e=a;do{if(n>=e.x&&e.x>=c&&n!==e.x&&yh(s<l?n:r,s,c,l,s<l?r:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);qs(e,i)&&(u<d||u===d&&(e.x>a.x||e.x===a.x&&$u(a,e)))&&(a=e,d=u)}e=e.next}while(e!==o);return a}function $u(i,t){return Ae(i.prev,i,t.prev)<0&&Ae(t.next,i,i.next)<0}function Ku(i,t,e,n){let s=i;do s.z===0&&(s.z=wo(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Ju(s)}function Ju(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function wo(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function ju(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function yh(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function Es(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&yh(i,t,e,n,s,r,a,o)}function Qu(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!tf(i,t)&&(qs(i,t)&&qs(t,i)&&ef(i,t)&&(Ae(i.prev,i,t.prev)||Ae(i,t.prev,t))||os(i,t)&&Ae(i.prev,i,i.next)>0&&Ae(t.prev,t,t.next)>0)}function Ae(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function os(i,t){return i.x===t.x&&i.y===t.y}function bh(i,t,e,n){const s=Sr(Ae(i,t,e)),r=Sr(Ae(i,t,n)),a=Sr(Ae(e,n,i)),o=Sr(Ae(e,n,t));return!!(s!==r&&a!==o||s===0&&Mr(i,e,t)||r===0&&Mr(i,n,t)||a===0&&Mr(e,i,n)||o===0&&Mr(e,t,n))}function Mr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Sr(i){return i>0?1:i<0?-1:0}function tf(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&bh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function qs(i,t){return Ae(i.prev,i,i.next)<0?Ae(i,t,i.next)>=0&&Ae(i,i.prev,t)>=0:Ae(i,t,i.prev)<0||Ae(i,i.next,t)<0}function ef(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function wh(i,t){const e=To(i.i,i.x,i.y),n=To(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Zc(i,t,e,n){const s=To(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ys(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function To(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function nf(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class sf{static triangulate(t,e,n=2){return ku(t,e,n)}}class Is{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Is.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];$c(t),Kc(n,t);let a=t.length;e.forEach($c);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,Kc(n,e[c]);const o=sf.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function $c(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Kc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class jo extends Wr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new jo(t.radius,t.detail)}}class Ie extends De{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,u=t/o,f=e/c,p=[],g=[],y=[],m=[];for(let h=0;h<d;h++){const S=h*f-a;for(let M=0;M<l;M++){const b=M*u-r;g.push(b,-S,0),y.push(0,0,1),m.push(M/o),m.push(1-h/c)}}for(let h=0;h<c;h++)for(let S=0;S<o;S++){const M=S+l*h,b=S+l*(h+1),E=S+1+l*(h+1),T=S+1+l*h;p.push(M,b,T),p.push(b,E,T)}this.setIndex(p),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(y,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ie(t.width,t.height,t.widthSegments,t.heightSegments)}}class Qo extends De{constructor(t=new Mh([new xt(0,.5),new xt(-.5,-.5),new xt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let d=0;d<t.length;d++)l(t[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new re(s,3)),this.setAttribute("normal",new re(r,3)),this.setAttribute("uv",new re(a,2));function l(d){const u=s.length/3,f=d.extractPoints(e);let p=f.shape;const g=f.holes;Is.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,h=g.length;m<h;m++){const S=g[m];Is.isClockWise(S)===!0&&(g[m]=S.reverse())}const y=Is.triangulateShape(p,g);for(let m=0,h=g.length;m<h;m++){const S=g[m];p=p.concat(S)}for(let m=0,h=p.length;m<h;m++){const S=p[m];s.push(S.x,S.y,0),r.push(0,0,1),a.push(S.x,S.y)}for(let m=0,h=y.length;m<h;m++){const S=y[m],M=S[0]+u,b=S[1]+u,E=S[2]+u;n.push(M,b,E),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return rf(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new Qo(n,t.curveSegments)}}function rf(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class je extends De{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const d=[],u=new U,f=new U,p=[],g=[],y=[],m=[];for(let h=0;h<=n;h++){const S=[],M=h/n;let b=0;h===0&&a===0?b=.5/e:h===n&&c===Math.PI&&(b=-.5/e);for(let E=0;E<=e;E++){const T=E/e;u.x=-t*Math.cos(s+T*r)*Math.sin(a+M*o),u.y=t*Math.cos(a+M*o),u.z=t*Math.sin(s+T*r)*Math.sin(a+M*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),y.push(f.x,f.y,f.z),m.push(T+b,1-M),S.push(l++)}d.push(S)}for(let h=0;h<n;h++)for(let S=0;S<e;S++){const M=d[h][S+1],b=d[h][S],E=d[h+1][S],T=d[h+1][S+1];(h!==0||a>0)&&p.push(M,b,T),(h!==n-1||c<Math.PI)&&p.push(b,E,T)}this.setIndex(p),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(y,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new je(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Zs extends De{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],d=new U,u=new U,f=new U;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){const y=g/s*r,m=p/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(y),u.y=(t+e*Math.cos(m))*Math.sin(y),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),d.x=t*Math.cos(y),d.y=t*Math.sin(y),f.subVectors(u,d).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){const y=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,h=(s+1)*(p-1)+g,S=(s+1)*p+g;a.push(y,m,S),a.push(m,h,S)}this.setIndex(a),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zs(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class af extends Xe{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class J extends Di{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new kt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Go,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class of extends Di{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Go,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=Do,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class cf extends Di{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ed,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class lf extends Di{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class tc extends Le{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new kt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class hf extends tc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Le.DEFAULT_UP),this.updateMatrix(),this.groundColor=new kt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const wa=new ue,Jc=new U,jc=new U;class Th{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xt(512,512),this.mapType=Nn,this.map=null,this.mapPass=null,this.matrix=new ue,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Zo,this._frameExtents=new xt(1,1),this._viewportCount=1,this._viewports=[new ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Jc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Jc),jc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(jc),e.updateMatrixWorld(),wa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wa,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(wa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Qc=new ue,bs=new U,Ta=new U;class df extends Th{constructor(){super(new dn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new xt(4,2),this._viewportCount=6,this._viewports=[new ve(2,1,1,1),new ve(0,1,1,1),new ve(3,1,1,1),new ve(1,1,1,1),new ve(3,0,1,1),new ve(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),bs.setFromMatrixPosition(t.matrixWorld),n.position.copy(bs),Ta.copy(n.position),Ta.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Ta),n.updateMatrixWorld(),s.makeTranslation(-bs.x,-bs.y,-bs.z),Qc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Qc,n.coordinateSystem,n.reversedDepth)}}class Eh extends tc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new df}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class ec extends hh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class uf extends Th{constructor(){super(new ec(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class tl extends tc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Le.DEFAULT_UP),this.updateMatrix(),this.target=new Le,this.shadow=new uf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class ff extends dn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Ah{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const el=new ue;class pf{constructor(t,e,n=0,s=1/0){this.ray=new Xo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new qo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Pe("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return el.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(el),this}intersectObject(t,e=!0,n=[]){return Eo(t,this,n,e),n.sort(nl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Eo(t[s],this,n,e);return n.sort(nl),n}}function nl(i,t){return i.distance-t.distance}function Eo(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)Eo(r[a],t,e,!0)}}function il(i,t,e,n){const s=mf(n);switch(e){case eh:return i*t;case Oo:return i*t/s.components*s.byteLength;case Bo:return i*t/s.components*s.byteLength;case zo:return i*t*2/s.components*s.byteLength;case ko:return i*t*2/s.components*s.byteLength;case nh:return i*t*3/s.components*s.byteLength;case wn:return i*t*4/s.components*s.byteLength;case Vo:return i*t*4/s.components*s.byteLength;case Ar:case Cr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Rr:case Pr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case $a:case Ja:return Math.max(i,16)*Math.max(t,8)/4;case Za:case Ka:return Math.max(i,8)*Math.max(t,8)/2;case ja:case Qa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case to:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case eo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case no:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case io:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case so:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case ro:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ao:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case oo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case co:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case lo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case ho:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case uo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case fo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case po:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case mo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case xo:case go:case _o:return Math.ceil(i/4)*Math.ceil(t/4)*16;case vo:case Mo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case So:case yo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function mf(i){switch(i){case Nn:case Jl:return{byteLength:1,components:1};case Bs:case jl:case Un:return{byteLength:2,components:1};case No:case Fo:return{byteLength:2,components:4};case Ai:case Uo:case Ln:return{byteLength:4,components:1};case Ql:case th:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Lo}}));typeof window<"u"&&(window.__THREE__?Gt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Lo);function Ch(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function xf(i){const t=new WeakMap;function e(o,c){const l=o.array,d=o.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,d),o.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const d=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,d);else{u.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<u.length;p++){const g=u[f],y=u[p];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++f,u[f]=y)}u.length=f+1;for(let p=0,g=u.length;p<g;p++){const y=u[p];i.bufferSubData(l,y.start*d.BYTES_PER_ELEMENT,d,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=t.get(o);(!d||d.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var gf=`#ifdef USE_ALPHAHASH
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
#endif`,t0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,e0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,n0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,i0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,s0=`#ifdef USE_GRADIENTMAP
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
}`,r0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,a0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,o0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,c0=`uniform bool receiveShadow;
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
#endif`,l0=`#ifdef USE_ENVMAP
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
#endif`,h0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,d0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,u0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,f0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,p0=`PhysicalMaterial material;
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
#endif`,m0=`uniform sampler2D dfgLUT;
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
}`,x0=`
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
#endif`,g0=`#if defined( RE_IndirectDiffuse )
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
#endif`,_0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,v0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,M0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,S0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,y0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,b0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,w0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,T0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,E0=`#if defined( USE_POINTS_UV )
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
#endif`,A0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,C0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,R0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,P0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,L0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,D0=`#ifdef USE_MORPHTARGETS
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
#endif`,I0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,U0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,N0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,F0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,O0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,B0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,z0=`#ifdef USE_NORMALMAP
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
#endif`,k0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,V0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,G0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,H0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,W0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,X0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,q0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Y0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Z0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,$0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,K0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,J0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,j0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Q0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,tp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ep=`float getShadowMask() {
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
}`,np=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ip=`#ifdef USE_SKINNING
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
#endif`,sp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,rp=`#ifdef USE_SKINNING
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
#endif`,ap=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,op=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,cp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,lp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,hp=`#ifdef USE_TRANSMISSION
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
#endif`,dp=`#ifdef USE_TRANSMISSION
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
#endif`,up=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const xp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,gp=`uniform sampler2D t2D;
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
}`,_p=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Mp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yp=`#include <common>
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
}`,bp=`#if DEPTH_PACKING == 3200
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
}`,wp=`#define DISTANCE
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
}`,Tp=`#define DISTANCE
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
}`,Ep=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ap=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cp=`uniform float scale;
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
}`,Rp=`uniform vec3 diffuse;
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
}`,Pp=`#include <common>
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
}`,Lp=`uniform vec3 diffuse;
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
}`,Dp=`#define LAMBERT
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
}`,Ip=`#define LAMBERT
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
}`,Up=`#define MATCAP
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
}`,Np=`#define MATCAP
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
}`,Fp=`#define NORMAL
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
}`,Op=`#define NORMAL
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
}`,Bp=`#define PHONG
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
}`,zp=`#define PHONG
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
}`,kp=`#define STANDARD
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
}`,Vp=`#define STANDARD
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
}`,Gp=`#define TOON
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
}`,Hp=`#define TOON
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
}`,Wp=`uniform float size;
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
}`,Xp=`uniform vec3 diffuse;
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
}`,qp=`#include <common>
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
}`,Yp=`uniform vec3 color;
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
}`,Zp=`uniform float rotation;
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
}`,$p=`uniform vec3 diffuse;
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
}`,Yt={alphahash_fragment:gf,alphahash_pars_fragment:_f,alphamap_fragment:vf,alphamap_pars_fragment:Mf,alphatest_fragment:Sf,alphatest_pars_fragment:yf,aomap_fragment:bf,aomap_pars_fragment:wf,batching_pars_vertex:Tf,batching_vertex:Ef,begin_vertex:Af,beginnormal_vertex:Cf,bsdfs:Rf,iridescence_fragment:Pf,bumpmap_pars_fragment:Lf,clipping_planes_fragment:Df,clipping_planes_pars_fragment:If,clipping_planes_pars_vertex:Uf,clipping_planes_vertex:Nf,color_fragment:Ff,color_pars_fragment:Of,color_pars_vertex:Bf,color_vertex:zf,common:kf,cube_uv_reflection_fragment:Vf,defaultnormal_vertex:Gf,displacementmap_pars_vertex:Hf,displacementmap_vertex:Wf,emissivemap_fragment:Xf,emissivemap_pars_fragment:qf,colorspace_fragment:Yf,colorspace_pars_fragment:Zf,envmap_fragment:$f,envmap_common_pars_fragment:Kf,envmap_pars_fragment:Jf,envmap_pars_vertex:jf,envmap_physical_pars_fragment:l0,envmap_vertex:Qf,fog_vertex:t0,fog_pars_vertex:e0,fog_fragment:n0,fog_pars_fragment:i0,gradientmap_pars_fragment:s0,lightmap_pars_fragment:r0,lights_lambert_fragment:a0,lights_lambert_pars_fragment:o0,lights_pars_begin:c0,lights_toon_fragment:h0,lights_toon_pars_fragment:d0,lights_phong_fragment:u0,lights_phong_pars_fragment:f0,lights_physical_fragment:p0,lights_physical_pars_fragment:m0,lights_fragment_begin:x0,lights_fragment_maps:g0,lights_fragment_end:_0,logdepthbuf_fragment:v0,logdepthbuf_pars_fragment:M0,logdepthbuf_pars_vertex:S0,logdepthbuf_vertex:y0,map_fragment:b0,map_pars_fragment:w0,map_particle_fragment:T0,map_particle_pars_fragment:E0,metalnessmap_fragment:A0,metalnessmap_pars_fragment:C0,morphinstance_vertex:R0,morphcolor_vertex:P0,morphnormal_vertex:L0,morphtarget_pars_vertex:D0,morphtarget_vertex:I0,normal_fragment_begin:U0,normal_fragment_maps:N0,normal_pars_fragment:F0,normal_pars_vertex:O0,normal_vertex:B0,normalmap_pars_fragment:z0,clearcoat_normal_fragment_begin:k0,clearcoat_normal_fragment_maps:V0,clearcoat_pars_fragment:G0,iridescence_pars_fragment:H0,opaque_fragment:W0,packing:X0,premultiplied_alpha_fragment:q0,project_vertex:Y0,dithering_fragment:Z0,dithering_pars_fragment:$0,roughnessmap_fragment:K0,roughnessmap_pars_fragment:J0,shadowmap_pars_fragment:j0,shadowmap_pars_vertex:Q0,shadowmap_vertex:tp,shadowmask_pars_fragment:ep,skinbase_vertex:np,skinning_pars_vertex:ip,skinning_vertex:sp,skinnormal_vertex:rp,specularmap_fragment:ap,specularmap_pars_fragment:op,tonemapping_fragment:cp,tonemapping_pars_fragment:lp,transmission_fragment:hp,transmission_pars_fragment:dp,uv_pars_fragment:up,uv_pars_vertex:fp,uv_vertex:pp,worldpos_vertex:mp,background_vert:xp,background_frag:gp,backgroundCube_vert:_p,backgroundCube_frag:vp,cube_vert:Mp,cube_frag:Sp,depth_vert:yp,depth_frag:bp,distanceRGBA_vert:wp,distanceRGBA_frag:Tp,equirect_vert:Ep,equirect_frag:Ap,linedashed_vert:Cp,linedashed_frag:Rp,meshbasic_vert:Pp,meshbasic_frag:Lp,meshlambert_vert:Dp,meshlambert_frag:Ip,meshmatcap_vert:Up,meshmatcap_frag:Np,meshnormal_vert:Fp,meshnormal_frag:Op,meshphong_vert:Bp,meshphong_frag:zp,meshphysical_vert:kp,meshphysical_frag:Vp,meshtoon_vert:Gp,meshtoon_frag:Hp,points_vert:Wp,points_frag:Xp,shadow_vert:qp,shadow_frag:Yp,sprite_vert:Zp,sprite_frag:$p},gt={common:{diffuse:{value:new kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qt}},envmap:{envMap:{value:null},envMapRotation:{value:new qt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qt},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0},uvTransform:{value:new qt}},sprite:{diffuse:{value:new kt(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qt},alphaMap:{value:null},alphaMapTransform:{value:new qt},alphaTest:{value:0}}},Pn={basic:{uniforms:Je([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:Je([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new kt(0)}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:Je([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new kt(0)},specular:{value:new kt(1118481)},shininess:{value:30}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:Je([gt.common,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.roughnessmap,gt.metalnessmap,gt.fog,gt.lights,{emissive:{value:new kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:Je([gt.common,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.gradientmap,gt.fog,gt.lights,{emissive:{value:new kt(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:Je([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:Je([gt.points,gt.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:Je([gt.common,gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:Je([gt.common,gt.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:Je([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:Je([gt.sprite,gt.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qt}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distanceRGBA:{uniforms:Je([gt.common,gt.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distanceRGBA_vert,fragmentShader:Yt.distanceRGBA_frag},shadow:{uniforms:Je([gt.lights,gt.fog,{color:{value:new kt(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};Pn.physical={uniforms:Je([Pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qt},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qt},sheen:{value:0},sheenColor:{value:new kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qt},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qt},attenuationDistance:{value:0},attenuationColor:{value:new kt(0)},specularColor:{value:new kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qt},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qt}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};const yr={r:0,b:0,g:0},xi=new Cn,Kp=new ue;function Jp(i,t,e,n,s,r,a){const o=new kt(0);let c=r===!0?0:1,l,d,u=null,f=0,p=null;function g(M){let b=M.isScene===!0?M.background:null;return b&&b.isTexture&&(b=(M.backgroundBlurriness>0?e:t).get(b)),b}function y(M){let b=!1;const E=g(M);E===null?h(o,c):E&&E.isColor&&(h(E,1),b=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,b){const E=g(b);E&&(E.isCubeTexture||E.mapping===Hr)?(d===void 0&&(d=new X(new Lt(1,1,1),new Xe({name:"BackgroundCubeMaterial",uniforms:as(Pn.backgroundCube.uniforms),vertexShader:Pn.backgroundCube.vertexShader,fragmentShader:Pn.backgroundCube.fragmentShader,side:qe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,P,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),xi.copy(b.backgroundRotation),xi.x*=-1,xi.y*=-1,xi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(xi.y*=-1,xi.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Kp.makeRotationFromEuler(xi)),d.material.toneMapped=oe.getTransfer(E.colorSpace)!==xe,(u!==E||f!==E.version||p!==i.toneMapping)&&(d.material.needsUpdate=!0,u=E,f=E.version,p=i.toneMapping),d.layers.enableAll(),M.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new X(new Ie(2,2),new Xe({name:"BackgroundMaterial",uniforms:as(Pn.background.uniforms),vertexShader:Pn.background.vertexShader,fragmentShader:Pn.background.fragmentShader,side:hi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=oe.getTransfer(E.colorSpace)!==xe,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||f!==E.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=E,f=E.version,p=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function h(M,b){M.getRGB(yr,lh(i)),n.buffers.color.setClear(yr.r,yr.g,yr.b,b,a)}function S(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,b=1){o.set(M),c=b,h(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,h(o,c)},render:y,addToRenderList:m,dispose:S}}function jp(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(v,A,I,z,H){let W=!1;const Y=u(z,I,A);r!==Y&&(r=Y,l(r.object)),W=p(v,z,I,H),W&&g(v,z,I,H),H!==null&&t.update(H,i.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,b(v,A,I,z),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function c(){return i.createVertexArray()}function l(v){return i.bindVertexArray(v)}function d(v){return i.deleteVertexArray(v)}function u(v,A,I){const z=I.wireframe===!0;let H=n[v.id];H===void 0&&(H={},n[v.id]=H);let W=H[A.id];W===void 0&&(W={},H[A.id]=W);let Y=W[z];return Y===void 0&&(Y=f(c()),W[z]=Y),Y}function f(v){const A=[],I=[],z=[];for(let H=0;H<e;H++)A[H]=0,I[H]=0,z[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:I,attributeDivisors:z,object:v,attributes:{},index:null}}function p(v,A,I,z){const H=r.attributes,W=A.attributes;let Y=0;const st=I.getAttributes();for(const K in st)if(st[K].location>=0){const ft=H[K];let Ct=W[K];if(Ct===void 0&&(K==="instanceMatrix"&&v.instanceMatrix&&(Ct=v.instanceMatrix),K==="instanceColor"&&v.instanceColor&&(Ct=v.instanceColor)),ft===void 0||ft.attribute!==Ct||Ct&&ft.data!==Ct.data)return!0;Y++}return r.attributesNum!==Y||r.index!==z}function g(v,A,I,z){const H={},W=A.attributes;let Y=0;const st=I.getAttributes();for(const K in st)if(st[K].location>=0){let ft=W[K];ft===void 0&&(K==="instanceMatrix"&&v.instanceMatrix&&(ft=v.instanceMatrix),K==="instanceColor"&&v.instanceColor&&(ft=v.instanceColor));const Ct={};Ct.attribute=ft,ft&&ft.data&&(Ct.data=ft.data),H[K]=Ct,Y++}r.attributes=H,r.attributesNum=Y,r.index=z}function y(){const v=r.newAttributes;for(let A=0,I=v.length;A<I;A++)v[A]=0}function m(v){h(v,0)}function h(v,A){const I=r.newAttributes,z=r.enabledAttributes,H=r.attributeDivisors;I[v]=1,z[v]===0&&(i.enableVertexAttribArray(v),z[v]=1),H[v]!==A&&(i.vertexAttribDivisor(v,A),H[v]=A)}function S(){const v=r.newAttributes,A=r.enabledAttributes;for(let I=0,z=A.length;I<z;I++)A[I]!==v[I]&&(i.disableVertexAttribArray(I),A[I]=0)}function M(v,A,I,z,H,W,Y){Y===!0?i.vertexAttribIPointer(v,A,I,H,W):i.vertexAttribPointer(v,A,I,z,H,W)}function b(v,A,I,z){y();const H=z.attributes,W=I.getAttributes(),Y=A.defaultAttributeValues;for(const st in W){const K=W[st];if(K.location>=0){let ut=H[st];if(ut===void 0&&(st==="instanceMatrix"&&v.instanceMatrix&&(ut=v.instanceMatrix),st==="instanceColor"&&v.instanceColor&&(ut=v.instanceColor)),ut!==void 0){const ft=ut.normalized,Ct=ut.itemSize,Zt=t.get(ut);if(Zt===void 0)continue;const ie=Zt.buffer,fe=Zt.type,se=Zt.bytesPerElement,et=fe===i.INT||fe===i.UNSIGNED_INT||ut.gpuType===Uo;if(ut.isInterleavedBufferAttribute){const at=ut.data,bt=at.stride,Ht=ut.offset;if(at.isInstancedInterleavedBuffer){for(let Rt=0;Rt<K.locationSize;Rt++)h(K.location+Rt,at.meshPerAttribute);v.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Rt=0;Rt<K.locationSize;Rt++)m(K.location+Rt);i.bindBuffer(i.ARRAY_BUFFER,ie);for(let Rt=0;Rt<K.locationSize;Rt++)M(K.location+Rt,Ct/K.locationSize,fe,ft,bt*se,(Ht+Ct/K.locationSize*Rt)*se,et)}else{if(ut.isInstancedBufferAttribute){for(let at=0;at<K.locationSize;at++)h(K.location+at,ut.meshPerAttribute);v.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let at=0;at<K.locationSize;at++)m(K.location+at);i.bindBuffer(i.ARRAY_BUFFER,ie);for(let at=0;at<K.locationSize;at++)M(K.location+at,Ct/K.locationSize,fe,ft,Ct*se,Ct/K.locationSize*at*se,et)}}else if(Y!==void 0){const ft=Y[st];if(ft!==void 0)switch(ft.length){case 2:i.vertexAttrib2fv(K.location,ft);break;case 3:i.vertexAttrib3fv(K.location,ft);break;case 4:i.vertexAttrib4fv(K.location,ft);break;default:i.vertexAttrib1fv(K.location,ft)}}}}S()}function E(){C();for(const v in n){const A=n[v];for(const I in A){const z=A[I];for(const H in z)d(z[H].object),delete z[H];delete A[I]}delete n[v]}}function T(v){if(n[v.id]===void 0)return;const A=n[v.id];for(const I in A){const z=A[I];for(const H in z)d(z[H].object),delete z[H];delete A[I]}delete n[v.id]}function P(v){for(const A in n){const I=n[A];if(I[v.id]===void 0)continue;const z=I[v.id];for(const H in z)d(z[H].object),delete z[H];delete I[v.id]}}function C(){w(),a=!0,r!==s&&(r=s,l(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:w,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:P,initAttributes:y,enableAttribute:m,disableUnusedAttributes:S}}function Qp(i,t,e){let n;function s(l){n=l}function r(l,d){i.drawArrays(n,l,d),e.update(d,n,1)}function a(l,d,u){u!==0&&(i.drawArraysInstanced(n,l,d,u),e.update(d,n,u))}function o(l,d,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,u);let p=0;for(let g=0;g<u;g++)p+=d[g];e.update(p,n,1)}function c(l,d,u,f){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)a(l[g],d[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,d,0,f,0,u);let g=0;for(let y=0;y<u;y++)g+=d[y]*f[y];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function tm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==wn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const C=P===Un&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==Nn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Ln&&!C)}function c(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(Gt("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),h=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:S,maxVaryings:M,maxFragmentUniforms:b,vertexTextures:E,maxSamples:T}}function em(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new vi,o=new qt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=d(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,h=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?d(null):l();else{const S=r?0:n,M=S*4;let b=h.clippingState||null;c.value=b,b=d(g,f,M,p);for(let E=0;E!==M;++E)b[E]=e[E];h.clippingState=b,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(u,f,p,g){const y=u!==null?u.length:0;let m=null;if(y!==0){if(m=c.value,g!==!0||m===null){const h=p+y*4,S=f.matrixWorldInverse;o.getNormalMatrix(S),(m===null||m.length<h)&&(m=new Float32Array(h));for(let M=0,b=p;M!==y;++M,b+=4)a.copy(u[M]).applyMatrix4(S,o),a.normal.toArray(m,b),m[b+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,m}}function nm(i){let t=new WeakMap;function e(a,o){return o===Xa?a.mapping=is:o===qa&&(a.mapping=ss),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Xa||o===qa)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Su(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const ai=4,sl=[.125,.215,.35,.446,.526,.582],yi=20,im=256,ws=new ec,rl=new kt;let Ea=null,Aa=0,Ca=0,Ra=!1;const sm=new U;class Ao{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=sm}=r;Ea=this._renderer.getRenderTarget(),Aa=this._renderer.getActiveCubeFace(),Ca=this._renderer.getActiveMipmapLevel(),Ra=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ol(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Ea,Aa,Ca),this._renderer.xr.enabled=Ra,t.scissorTest=!1,Zi(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===is||t.mapping===ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ea=this._renderer.getRenderTarget(),Aa=this._renderer.getActiveCubeFace(),Ca=this._renderer.getActiveMipmapLevel(),Ra=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:xn,minFilter:xn,generateMipmaps:!1,type:Un,format:wn,colorSpace:rs,depthBuffer:!1},s=al(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=al(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=rm(r)),this._blurMaterial=om(r,t,e),this._ggxMaterial=am(r,t,e)}return s}_compileMaterial(t){const e=new X(new De,t);this._renderer.compile(e,ws)}_sceneToCubeUV(t,e,n,s,r){const c=new dn(90,1,e,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(rl),u.toneMapping=li,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new X(new Lt,new we({name:"PMREM.Background",side:qe,depthWrite:!1,depthTest:!1})));const y=this._backgroundBox,m=y.material;let h=!1;const S=t.background;S?S.isColor&&(m.color.copy(S),t.background=null,h=!0):(m.color.copy(rl),h=!0);for(let M=0;M<6;M++){const b=M%3;b===0?(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[M],r.y,r.z)):b===1?(c.up.set(0,0,l[M]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[M],r.z)):(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[M]));const E=this._cubeSize;Zi(s,b*E,M>2?E:0,E,E),u.setRenderTarget(s),h&&u.render(y,c),u.render(t,c)}u.toneMapping=p,u.autoClear=f,t.background=S}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===is||t.mapping===ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=cl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ol());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;Zi(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,ws)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),d=e/(this._lodMeshes.length-1),u=Math.sqrt(l*l-d*d),f=.05+l*.95,p=u*f,{_lodMax:g}=this,y=this._sizeLods[n],m=3*y*(n>g-ai?n-g+ai:0),h=4*(this._cubeSize-y);c.envMap.value=t.texture,c.roughness.value=p,c.mipInt.value=g-e,Zi(r,m,h,3*y,2*y),s.setRenderTarget(r),s.render(o,ws),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,Zi(t,m,h,3*y,2*y),s.setRenderTarget(t),s.render(o,ws)}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Pe("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=l;const f=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*yi-1),y=r/g,m=isFinite(r)?1+Math.floor(d*y):yi;m>yi&&Gt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${yi}`);const h=[];let S=0;for(let P=0;P<yi;++P){const C=P/y,w=Math.exp(-C*C/2);h.push(w),P===0?S+=w:P<m&&(S+=2*w)}for(let P=0;P<h.length;P++)h[P]=h[P]/S;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=h,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:M}=this;f.dTheta.value=g,f.mipInt.value=M-n;const b=this._sizeLods[s],E=3*b*(s>M-ai?s-M+ai:0),T=4*(this._cubeSize-b);Zi(e,E,T,3*b,2*b),c.setRenderTarget(e),c.render(u,ws)}}function rm(i){const t=[],e=[],n=[];let s=i;const r=i-ai+1+sl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let c=1/o;a>i-ai?c=sl[a-i+ai-1]:a===0&&(c=0),e.push(c);const l=1/(o-2),d=-l,u=1+l,f=[d,d,u,d,u,u,d,d,u,u,d,u],p=6,g=6,y=3,m=2,h=1,S=new Float32Array(y*g*p),M=new Float32Array(m*g*p),b=new Float32Array(h*g*p);for(let T=0;T<p;T++){const P=T%3*2/3-1,C=T>2?0:-1,w=[P,C,0,P+2/3,C,0,P+2/3,C+1,0,P,C,0,P+2/3,C+1,0,P,C+1,0];S.set(w,y*g*T),M.set(f,m*g*T);const v=[T,T,T,T,T,T];b.set(v,h*g*T)}const E=new De;E.setAttribute("position",new En(S,y)),E.setAttribute("uv",new En(M,m)),E.setAttribute("faceIndex",new En(b,h)),n.push(new X(E,null)),s>ai&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function al(i,t,e){const n=new Tn(i,t,e);return n.texture.mapping=Hr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Zi(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function am(i,t,e){return new Xe({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:im,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Xr(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function om(i,t,e){const n=new Float32Array(yi),s=new U(0,1,0);return new Xe({name:"SphericalGaussianBlur",defines:{n:yi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Xr(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function ol(){return new Xe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Xr(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function cl(){return new Xe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Xr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:In,depthTest:!1,depthWrite:!1})}function Xr(){return`

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
	`}function cm(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Xa||c===qa,d=c===is||c===ss;if(l||d){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new Ao(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return l&&p&&p.height>0||d&&p&&s(p)?(e===null&&(e=new Ao(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function lm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];const s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Gs("WebGLRenderer: "+n+" extension not supported."),s}}}function hm(i,t,e,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete s[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const p in f)t.update(f[p],i.ARRAY_BUFFER)}function l(u){const f=[],p=u.index,g=u.attributes.position;let y=0;if(p!==null){const S=p.array;y=p.version;for(let M=0,b=S.length;M<b;M+=3){const E=S[M+0],T=S[M+1],P=S[M+2];f.push(E,T,T,P,P,E)}}else if(g!==void 0){const S=g.array;y=g.version;for(let M=0,b=S.length/3-1;M<b;M+=3){const E=M+0,T=M+1,P=M+2;f.push(E,T,T,P,P,E)}}else return;const m=new(sh(f)?ch:oh)(f,1);m.version=y;const h=r.get(u);h&&t.remove(h),r.set(u,m)}function d(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function dm(i,t,e){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,p){i.drawElements(n,p,r,f*a),e.update(p,n,1)}function l(f,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,f*a,g),e.update(p,n,g))}function d(f,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,g);let m=0;for(let h=0;h<g;h++)m+=p[h];e.update(m,n,1)}function u(f,p,g,y){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let h=0;h<f.length;h++)l(f[h]/a,p[h],y[h]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,y,0,g);let h=0;for(let S=0;S<g;S++)h+=p[S]*y[S];e.update(h,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function um(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Pe("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function fm(i,t,e){const n=new WeakMap,s=new ve;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let v=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",v)};var p=v;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let b=0;g===!0&&(b=1),y===!0&&(b=2),m===!0&&(b=3);let E=o.attributes.position.count*b,T=1;E>t.maxTextureSize&&(T=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);const P=new Float32Array(E*T*4*u),C=new rh(P,E,T,u);C.type=Ln,C.needsUpdate=!0;const w=b*4;for(let A=0;A<u;A++){const I=h[A],z=S[A],H=M[A],W=E*T*4*A;for(let Y=0;Y<I.count;Y++){const st=Y*w;g===!0&&(s.fromBufferAttribute(I,Y),P[W+st+0]=s.x,P[W+st+1]=s.y,P[W+st+2]=s.z,P[W+st+3]=0),y===!0&&(s.fromBufferAttribute(z,Y),P[W+st+4]=s.x,P[W+st+5]=s.y,P[W+st+6]=s.z,P[W+st+7]=0),m===!0&&(s.fromBufferAttribute(H,Y),P[W+st+8]=s.x,P[W+st+9]=s.y,P[W+st+10]=s.z,P[W+st+11]=H.itemSize===4?s.w:1)}}f={count:u,texture:C,size:new xt(E,T)},n.set(o,f),o.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const y=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",y),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function pm(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,d=c.geometry,u=t.get(c,d);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}const Rh=new Ye,ll=new ph(1,1),Ph=new rh,Lh=new ru,Dh=new dh,hl=[],dl=[],ul=new Float32Array(16),fl=new Float32Array(9),pl=new Float32Array(4);function us(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=hl[s];if(r===void 0&&(r=new Float32Array(s),hl[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Oe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Be(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function qr(i,t){let e=dl[t];e===void 0&&(e=new Int32Array(t),dl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function mm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;i.uniform2fv(this.addr,t),Be(e,t)}}function gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Oe(e,t))return;i.uniform3fv(this.addr,t),Be(e,t)}}function _m(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;i.uniform4fv(this.addr,t),Be(e,t)}}function vm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Oe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Be(e,t)}else{if(Oe(e,n))return;pl.set(n),i.uniformMatrix2fv(this.addr,!1,pl),Be(e,n)}}function Mm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Oe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Be(e,t)}else{if(Oe(e,n))return;fl.set(n),i.uniformMatrix3fv(this.addr,!1,fl),Be(e,n)}}function Sm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Oe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Be(e,t)}else{if(Oe(e,n))return;ul.set(n),i.uniformMatrix4fv(this.addr,!1,ul),Be(e,n)}}function ym(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function bm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;i.uniform2iv(this.addr,t),Be(e,t)}}function wm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Oe(e,t))return;i.uniform3iv(this.addr,t),Be(e,t)}}function Tm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;i.uniform4iv(this.addr,t),Be(e,t)}}function Em(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Am(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Oe(e,t))return;i.uniform2uiv(this.addr,t),Be(e,t)}}function Cm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Oe(e,t))return;i.uniform3uiv(this.addr,t),Be(e,t)}}function Rm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Oe(e,t))return;i.uniform4uiv(this.addr,t),Be(e,t)}}function Pm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(ll.compareFunction=ih,r=ll):r=Rh,e.setTexture2D(t||r,s)}function Lm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Lh,s)}function Dm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Dh,s)}function Im(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Ph,s)}function Um(i){switch(i){case 5126:return mm;case 35664:return xm;case 35665:return gm;case 35666:return _m;case 35674:return vm;case 35675:return Mm;case 35676:return Sm;case 5124:case 35670:return ym;case 35667:case 35671:return bm;case 35668:case 35672:return wm;case 35669:case 35673:return Tm;case 5125:return Em;case 36294:return Am;case 36295:return Cm;case 36296:return Rm;case 35678:case 36198:case 36298:case 36306:case 35682:return Pm;case 35679:case 36299:case 36307:return Lm;case 35680:case 36300:case 36308:case 36293:return Dm;case 36289:case 36303:case 36311:case 36292:return Im}}function Nm(i,t){i.uniform1fv(this.addr,t)}function Fm(i,t){const e=us(t,this.size,2);i.uniform2fv(this.addr,e)}function Om(i,t){const e=us(t,this.size,3);i.uniform3fv(this.addr,e)}function Bm(i,t){const e=us(t,this.size,4);i.uniform4fv(this.addr,e)}function zm(i,t){const e=us(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function km(i,t){const e=us(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Vm(i,t){const e=us(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Gm(i,t){i.uniform1iv(this.addr,t)}function Hm(i,t){i.uniform2iv(this.addr,t)}function Wm(i,t){i.uniform3iv(this.addr,t)}function Xm(i,t){i.uniform4iv(this.addr,t)}function qm(i,t){i.uniform1uiv(this.addr,t)}function Ym(i,t){i.uniform2uiv(this.addr,t)}function Zm(i,t){i.uniform3uiv(this.addr,t)}function $m(i,t){i.uniform4uiv(this.addr,t)}function Km(i,t,e){const n=this.cache,s=t.length,r=qr(e,s);Oe(n,r)||(i.uniform1iv(this.addr,r),Be(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Rh,r[a])}function Jm(i,t,e){const n=this.cache,s=t.length,r=qr(e,s);Oe(n,r)||(i.uniform1iv(this.addr,r),Be(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Lh,r[a])}function jm(i,t,e){const n=this.cache,s=t.length,r=qr(e,s);Oe(n,r)||(i.uniform1iv(this.addr,r),Be(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Dh,r[a])}function Qm(i,t,e){const n=this.cache,s=t.length,r=qr(e,s);Oe(n,r)||(i.uniform1iv(this.addr,r),Be(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Ph,r[a])}function tx(i){switch(i){case 5126:return Nm;case 35664:return Fm;case 35665:return Om;case 35666:return Bm;case 35674:return zm;case 35675:return km;case 35676:return Vm;case 5124:case 35670:return Gm;case 35667:case 35671:return Hm;case 35668:case 35672:return Wm;case 35669:case 35673:return Xm;case 5125:return qm;case 36294:return Ym;case 36295:return Zm;case 36296:return $m;case 35678:case 36198:case 36298:case 36306:case 35682:return Km;case 35679:case 36299:case 36307:return Jm;case 35680:case 36300:case 36308:case 36293:return jm;case 36289:case 36303:case 36311:case 36292:return Qm}}class ex{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Um(e.type)}}class nx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=tx(e.type)}}class ix{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Pa=/(\w+)(\])?(\[|\.)?/g;function ml(i,t){i.seq.push(t),i.map[t.id]=t}function sx(i,t,e){const n=i.name,s=n.length;for(Pa.lastIndex=0;;){const r=Pa.exec(n),a=Pa.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){ml(e,l===void 0?new ex(o,i,t):new nx(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new ix(o),ml(e,u)),e=u}}}class Lr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);sx(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function xl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const rx=37297;let ax=0;function ox(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const gl=new qt;function cx(i){oe._getMatrix(gl,oe.workingColorSpace,i);const t=`mat3( ${gl.elements.map(e=>e.toFixed(4))} )`;switch(oe.getTransfer(i)){case Fr:return[t,"LinearTransferOETF"];case xe:return[t,"sRGBTransferOETF"];default:return Gt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function _l(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+ox(i.getShaderSource(t),o)}else return r}function lx(i,t){const e=cx(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function hx(i,t){let e;switch(t){case Wl:e="Linear";break;case Xl:e="Reinhard";break;case ql:e="Cineon";break;case Io:e="ACESFilmic";break;case Zl:e="AgX";break;case $l:e="Neutral";break;case Yl:e="Custom";break;default:Gt("WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const br=new U;function dx(){oe.getLuminanceCoefficients(br);const i=br.x.toFixed(4),t=br.y.toFixed(4),e=br.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ux(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(As).join(`
`)}function fx(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function px(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function As(i){return i!==""}function vl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ml(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const mx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Co(i){return i.replace(mx,gx)}const xx=new Map;function gx(i,t){let e=Yt[t];if(e===void 0){const n=xx.get(t);if(n!==void 0)e=Yt[n],Gt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Co(e)}const _x=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sl(i){return i.replace(_x,vx)}function vx(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function yl(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function Mx(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Gl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Hl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Wn&&(t="SHADOWMAP_TYPE_VSM"),t}function Sx(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case is:case ss:t="ENVMAP_TYPE_CUBE";break;case Hr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function yx(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===ss&&(t="ENVMAP_MODE_REFRACTION"),t}function bx(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Do:t="ENVMAP_BLENDING_MULTIPLY";break;case bd:t="ENVMAP_BLENDING_MIX";break;case wd:t="ENVMAP_BLENDING_ADD";break}return t}function wx(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Tx(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=Mx(e),l=Sx(e),d=yx(e),u=bx(e),f=wx(e),p=ux(e),g=fx(r),y=s.createProgram();let m,h,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(As).join(`
`),m.length>0&&(m+=`
`),h=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(As).join(`
`),h.length>0&&(h+=`
`)):(m=[yl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(As).join(`
`),h=[yl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==li?"#define TONE_MAPPING":"",e.toneMapping!==li?Yt.tonemapping_pars_fragment:"",e.toneMapping!==li?hx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,lx("linearToOutputTexel",e.outputColorSpace),dx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(As).join(`
`)),a=Co(a),a=vl(a,e),a=Ml(a,e),o=Co(o),o=vl(o,e),o=Ml(o,e),a=Sl(a),o=Sl(o),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,h=["#define varying in",e.glslVersion===vc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===vc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const M=S+m+a,b=S+h+o,E=xl(s,s.VERTEX_SHADER,M),T=xl(s,s.FRAGMENT_SHADER,b);s.attachShader(y,E),s.attachShader(y,T),e.index0AttributeName!==void 0?s.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function P(A){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(y)||"",z=s.getShaderInfoLog(E)||"",H=s.getShaderInfoLog(T)||"",W=I.trim(),Y=z.trim(),st=H.trim();let K=!0,ut=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,E,T);else{const ft=_l(s,E,"vertex"),Ct=_l(s,T,"fragment");Pe("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+W+`
`+ft+`
`+Ct)}else W!==""?Gt("WebGLProgram: Program Info Log:",W):(Y===""||st==="")&&(ut=!1);ut&&(A.diagnostics={runnable:K,programLog:W,vertexShader:{log:Y,prefix:m},fragmentShader:{log:st,prefix:h}})}s.deleteShader(E),s.deleteShader(T),C=new Lr(s,y),w=px(s,y)}let C;this.getUniforms=function(){return C===void 0&&P(this),C};let w;this.getAttributes=function(){return w===void 0&&P(this),w};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(y,rx)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ax++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=E,this.fragmentShader=T,this}let Ex=0;class Ax{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Cx(t),e.set(t,n)),n}}class Cx{constructor(t){this.id=Ex++,this.code=t,this.usedTimes=0}}function Rx(i,t,e,n,s,r,a){const o=new qo,c=new Ax,l=new Set,d=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(w){return l.add(w),w===0?"uv":`uv${w}`}function m(w,v,A,I,z){const H=I.fog,W=z.geometry,Y=w.isMeshStandardMaterial?I.environment:null,st=(w.isMeshStandardMaterial?e:t).get(w.envMap||Y),K=st&&st.mapping===Hr?st.image.height:null,ut=g[w.type];w.precision!==null&&(p=s.getMaxPrecision(w.precision),p!==w.precision&&Gt("WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const ft=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Ct=ft!==void 0?ft.length:0;let Zt=0;W.morphAttributes.position!==void 0&&(Zt=1),W.morphAttributes.normal!==void 0&&(Zt=2),W.morphAttributes.color!==void 0&&(Zt=3);let ie,fe,se,et;if(ut){const ae=Pn[ut];ie=ae.vertexShader,fe=ae.fragmentShader}else ie=w.vertexShader,fe=w.fragmentShader,c.update(w),se=c.getVertexShaderID(w),et=c.getFragmentShaderID(w);const at=i.getRenderTarget(),bt=i.state.buffers.depth.getReversed(),Ht=z.isInstancedMesh===!0,Rt=z.isBatchedMesh===!0,Kt=!!w.map,Ne=!!w.matcap,$t=!!st,pe=!!w.aoMap,F=!!w.lightMap,Wt=!!w.bumpMap,Xt=!!w.normalMap,ne=!!w.displacementMap,Tt=!!w.emissiveMap,be=!!w.metalnessMap,Pt=!!w.roughnessMap,Vt=w.anisotropy>0,D=w.clearcoat>0,_=w.dispersion>0,L=w.iridescence>0,O=w.sheen>0,V=w.transmission>0,B=Vt&&!!w.anisotropyMap,j=D&&!!w.clearcoatMap,Q=D&&!!w.clearcoatNormalMap,pt=D&&!!w.clearcoatRoughnessMap,lt=L&&!!w.iridescenceMap,$=L&&!!w.iridescenceThicknessMap,rt=O&&!!w.sheenColorMap,St=O&&!!w.sheenRoughnessMap,vt=!!w.specularMap,nt=!!w.specularColorMap,At=!!w.specularIntensityMap,N=V&&!!w.transmissionMap,dt=V&&!!w.thicknessMap,ct=!!w.gradientMap,ht=!!w.alphaMap,ot=w.alphaTest>0,it=!!w.alphaHash,yt=!!w.extensions;let Ft=li;w.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(Ft=i.toneMapping);const de={shaderID:ut,shaderType:w.type,shaderName:w.name,vertexShader:ie,fragmentShader:fe,defines:w.defines,customVertexShaderID:se,customFragmentShaderID:et,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Rt,batchingColor:Rt&&z._colorsTexture!==null,instancing:Ht,instancingColor:Ht&&z.instanceColor!==null,instancingMorph:Ht&&z.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:at===null?i.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:rs,alphaToCoverage:!!w.alphaToCoverage,map:Kt,matcap:Ne,envMap:$t,envMapMode:$t&&st.mapping,envMapCubeUVHeight:K,aoMap:pe,lightMap:F,bumpMap:Wt,normalMap:Xt,displacementMap:f&&ne,emissiveMap:Tt,normalMapObjectSpace:Xt&&w.normalMapType===Cd,normalMapTangentSpace:Xt&&w.normalMapType===Go,metalnessMap:be,roughnessMap:Pt,anisotropy:Vt,anisotropyMap:B,clearcoat:D,clearcoatMap:j,clearcoatNormalMap:Q,clearcoatRoughnessMap:pt,dispersion:_,iridescence:L,iridescenceMap:lt,iridescenceThicknessMap:$,sheen:O,sheenColorMap:rt,sheenRoughnessMap:St,specularMap:vt,specularColorMap:nt,specularIntensityMap:At,transmission:V,transmissionMap:N,thicknessMap:dt,gradientMap:ct,opaque:w.transparent===!1&&w.blending===ji&&w.alphaToCoverage===!1,alphaMap:ht,alphaTest:ot,alphaHash:it,combine:w.combine,mapUv:Kt&&y(w.map.channel),aoMapUv:pe&&y(w.aoMap.channel),lightMapUv:F&&y(w.lightMap.channel),bumpMapUv:Wt&&y(w.bumpMap.channel),normalMapUv:Xt&&y(w.normalMap.channel),displacementMapUv:ne&&y(w.displacementMap.channel),emissiveMapUv:Tt&&y(w.emissiveMap.channel),metalnessMapUv:be&&y(w.metalnessMap.channel),roughnessMapUv:Pt&&y(w.roughnessMap.channel),anisotropyMapUv:B&&y(w.anisotropyMap.channel),clearcoatMapUv:j&&y(w.clearcoatMap.channel),clearcoatNormalMapUv:Q&&y(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:pt&&y(w.clearcoatRoughnessMap.channel),iridescenceMapUv:lt&&y(w.iridescenceMap.channel),iridescenceThicknessMapUv:$&&y(w.iridescenceThicknessMap.channel),sheenColorMapUv:rt&&y(w.sheenColorMap.channel),sheenRoughnessMapUv:St&&y(w.sheenRoughnessMap.channel),specularMapUv:vt&&y(w.specularMap.channel),specularColorMapUv:nt&&y(w.specularColorMap.channel),specularIntensityMapUv:At&&y(w.specularIntensityMap.channel),transmissionMapUv:N&&y(w.transmissionMap.channel),thicknessMapUv:dt&&y(w.thicknessMap.channel),alphaMapUv:ht&&y(w.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(Xt||Vt),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!W.attributes.uv&&(Kt||ht),fog:!!H,useFog:w.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:bt,skinning:z.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Ct,morphTextureStride:Zt,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ft,decodeVideoTexture:Kt&&w.map.isVideoTexture===!0&&oe.getTransfer(w.map.colorSpace)===xe,decodeVideoTextureEmissive:Tt&&w.emissiveMap.isVideoTexture===!0&&oe.getTransfer(w.emissiveMap.colorSpace)===xe,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===me,flipSided:w.side===qe,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:yt&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(yt&&w.extensions.multiDraw===!0||Rt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return de.vertexUv1s=l.has(1),de.vertexUv2s=l.has(2),de.vertexUv3s=l.has(3),l.clear(),de}function h(w){const v=[];if(w.shaderID?v.push(w.shaderID):(v.push(w.customVertexShaderID),v.push(w.customFragmentShaderID)),w.defines!==void 0)for(const A in w.defines)v.push(A),v.push(w.defines[A]);return w.isRawShaderMaterial===!1&&(S(v,w),M(v,w),v.push(i.outputColorSpace)),v.push(w.customProgramCacheKey),v.join()}function S(w,v){w.push(v.precision),w.push(v.outputColorSpace),w.push(v.envMapMode),w.push(v.envMapCubeUVHeight),w.push(v.mapUv),w.push(v.alphaMapUv),w.push(v.lightMapUv),w.push(v.aoMapUv),w.push(v.bumpMapUv),w.push(v.normalMapUv),w.push(v.displacementMapUv),w.push(v.emissiveMapUv),w.push(v.metalnessMapUv),w.push(v.roughnessMapUv),w.push(v.anisotropyMapUv),w.push(v.clearcoatMapUv),w.push(v.clearcoatNormalMapUv),w.push(v.clearcoatRoughnessMapUv),w.push(v.iridescenceMapUv),w.push(v.iridescenceThicknessMapUv),w.push(v.sheenColorMapUv),w.push(v.sheenRoughnessMapUv),w.push(v.specularMapUv),w.push(v.specularColorMapUv),w.push(v.specularIntensityMapUv),w.push(v.transmissionMapUv),w.push(v.thicknessMapUv),w.push(v.combine),w.push(v.fogExp2),w.push(v.sizeAttenuation),w.push(v.morphTargetsCount),w.push(v.morphAttributeCount),w.push(v.numDirLights),w.push(v.numPointLights),w.push(v.numSpotLights),w.push(v.numSpotLightMaps),w.push(v.numHemiLights),w.push(v.numRectAreaLights),w.push(v.numDirLightShadows),w.push(v.numPointLightShadows),w.push(v.numSpotLightShadows),w.push(v.numSpotLightShadowsWithMaps),w.push(v.numLightProbes),w.push(v.shadowMapType),w.push(v.toneMapping),w.push(v.numClippingPlanes),w.push(v.numClipIntersection),w.push(v.depthPacking)}function M(w,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),v.gradientMap&&o.enable(22),w.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reversedDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),w.push(o.mask)}function b(w){const v=g[w.type];let A;if(v){const I=Pn[v];A=Ws.clone(I.uniforms)}else A=w.uniforms;return A}function E(w,v){let A;for(let I=0,z=d.length;I<z;I++){const H=d[I];if(H.cacheKey===v){A=H,++A.usedTimes;break}}return A===void 0&&(A=new Tx(i,v,w,r),d.push(A)),A}function T(w){if(--w.usedTimes===0){const v=d.indexOf(w);d[v]=d[d.length-1],d.pop(),w.destroy()}}function P(w){c.remove(w)}function C(){c.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:b,acquireProgram:E,releaseProgram:T,releaseShaderCache:P,programs:d,dispose:C}}function Px(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Lx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function bl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function wl(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,f,p,g,y,m){let h=i[t];return h===void 0?(h={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:y,group:m},i[t]=h):(h.id=u.id,h.object=u,h.geometry=f,h.material=p,h.groupOrder=g,h.renderOrder=u.renderOrder,h.z=y,h.group=m),t++,h}function o(u,f,p,g,y,m){const h=a(u,f,p,g,y,m);p.transmission>0?n.push(h):p.transparent===!0?s.push(h):e.push(h)}function c(u,f,p,g,y,m){const h=a(u,f,p,g,y,m);p.transmission>0?n.unshift(h):p.transparent===!0?s.unshift(h):e.unshift(h)}function l(u,f){e.length>1&&e.sort(u||Lx),n.length>1&&n.sort(f||bl),s.length>1&&s.sort(f||bl)}function d(){for(let u=t,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:d,sort:l}}function Dx(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new wl,i.set(n,[a])):s>=r.length?(a=new wl,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Ix(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new kt};break;case"SpotLight":e={position:new U,direction:new U,color:new kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new kt,groundColor:new kt};break;case"RectAreaLight":e={color:new kt,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function Ux(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Nx=0;function Fx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Ox(i){const t=new Ix,e=Ux(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);const s=new U,r=new ue,a=new ue;function o(l){let d=0,u=0,f=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let p=0,g=0,y=0,m=0,h=0,S=0,M=0,b=0,E=0,T=0,P=0;l.sort(Fx);for(let w=0,v=l.length;w<v;w++){const A=l[w],I=A.color,z=A.intensity,H=A.distance,W=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)d+=I.r*z,u+=I.g*z,f+=I.b*z;else if(A.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(A.sh.coefficients[Y],z);P++}else if(A.isDirectionalLight){const Y=t.get(A);if(Y.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const st=A.shadow,K=e.get(A);K.shadowIntensity=st.intensity,K.shadowBias=st.bias,K.shadowNormalBias=st.normalBias,K.shadowRadius=st.radius,K.shadowMapSize=st.mapSize,n.directionalShadow[p]=K,n.directionalShadowMap[p]=W,n.directionalShadowMatrix[p]=A.shadow.matrix,S++}n.directional[p]=Y,p++}else if(A.isSpotLight){const Y=t.get(A);Y.position.setFromMatrixPosition(A.matrixWorld),Y.color.copy(I).multiplyScalar(z),Y.distance=H,Y.coneCos=Math.cos(A.angle),Y.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),Y.decay=A.decay,n.spot[y]=Y;const st=A.shadow;if(A.map&&(n.spotLightMap[E]=A.map,E++,st.updateMatrices(A),A.castShadow&&T++),n.spotLightMatrix[y]=st.matrix,A.castShadow){const K=e.get(A);K.shadowIntensity=st.intensity,K.shadowBias=st.bias,K.shadowNormalBias=st.normalBias,K.shadowRadius=st.radius,K.shadowMapSize=st.mapSize,n.spotShadow[y]=K,n.spotShadowMap[y]=W,b++}y++}else if(A.isRectAreaLight){const Y=t.get(A);Y.color.copy(I).multiplyScalar(z),Y.halfWidth.set(A.width*.5,0,0),Y.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=Y,m++}else if(A.isPointLight){const Y=t.get(A);if(Y.color.copy(A.color).multiplyScalar(A.intensity),Y.distance=A.distance,Y.decay=A.decay,A.castShadow){const st=A.shadow,K=e.get(A);K.shadowIntensity=st.intensity,K.shadowBias=st.bias,K.shadowNormalBias=st.normalBias,K.shadowRadius=st.radius,K.shadowMapSize=st.mapSize,K.shadowCameraNear=st.camera.near,K.shadowCameraFar=st.camera.far,n.pointShadow[g]=K,n.pointShadowMap[g]=W,n.pointShadowMatrix[g]=A.shadow.matrix,M++}n.point[g]=Y,g++}else if(A.isHemisphereLight){const Y=t.get(A);Y.skyColor.copy(A.color).multiplyScalar(z),Y.groundColor.copy(A.groundColor).multiplyScalar(z),n.hemi[h]=Y,h++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=gt.LTC_FLOAT_1,n.rectAreaLTC2=gt.LTC_FLOAT_2):(n.rectAreaLTC1=gt.LTC_HALF_1,n.rectAreaLTC2=gt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=f;const C=n.hash;(C.directionalLength!==p||C.pointLength!==g||C.spotLength!==y||C.rectAreaLength!==m||C.hemiLength!==h||C.numDirectionalShadows!==S||C.numPointShadows!==M||C.numSpotShadows!==b||C.numSpotMaps!==E||C.numLightProbes!==P)&&(n.directional.length=p,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=h,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=b+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=P,C.directionalLength=p,C.pointLength=g,C.spotLength=y,C.rectAreaLength=m,C.hemiLength=h,C.numDirectionalShadows=S,C.numPointShadows=M,C.numSpotShadows=b,C.numSpotMaps=E,C.numLightProbes=P,n.version=Nx++)}function c(l,d){let u=0,f=0,p=0,g=0,y=0;const m=d.matrixWorldInverse;for(let h=0,S=l.length;h<S;h++){const M=l[h];if(M.isDirectionalLight){const b=n.directional[u];b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),u++}else if(M.isSpotLight){const b=n.spot[p];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),p++}else if(M.isRectAreaLight){const b=n.rectArea[g];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),a.identity(),r.copy(M.matrixWorld),r.premultiply(m),a.extractRotation(r),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){const b=n.point[f];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(m),f++}else if(M.isHemisphereLight){const b=n.hemi[y];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(m),y++}}}return{setup:o,setupView:c,state:n}}function Tl(i){const t=new Ox(i),e=[],n=[];function s(d){l.camera=d,e.length=0,n.length=0}function r(d){e.push(d)}function a(d){n.push(d)}function o(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Bx(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Tl(i),t.set(s,[o])):r>=a.length?(o=new Tl(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const zx=`void main() {
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
}`;function Vx(i,t,e){let n=new Zo;const s=new xt,r=new xt,a=new ve,o=new cf({depthPacking:Ad}),c=new lf,l={},d=e.maxTextureSize,u={[hi]:qe,[qe]:hi,[me]:me},f=new Xe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:zx,fragmentShader:kx}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new De;g.setAttribute("position",new En(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new X(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Gl;let h=this.type;this.render=function(T,P,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const w=i.getRenderTarget(),v=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),I=i.state;I.setBlending(In),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const z=h!==Wn&&this.type===Wn,H=h===Wn&&this.type!==Wn;for(let W=0,Y=T.length;W<Y;W++){const st=T[W],K=st.shadow;if(K===void 0){Gt("WebGLShadowMap:",st,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;s.copy(K.mapSize);const ut=K.getFrameExtents();if(s.multiply(ut),r.copy(K.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/ut.x),s.x=r.x*ut.x,K.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/ut.y),s.y=r.y*ut.y,K.mapSize.y=r.y)),K.map===null||z===!0||H===!0){const Ct=this.type!==Wn?{minFilter:un,magFilter:un}:{};K.map!==null&&K.map.dispose(),K.map=new Tn(s.x,s.y,Ct),K.map.texture.name=st.name+".shadowMap",K.camera.updateProjectionMatrix()}i.setRenderTarget(K.map),i.clear();const ft=K.getViewportCount();for(let Ct=0;Ct<ft;Ct++){const Zt=K.getViewport(Ct);a.set(r.x*Zt.x,r.y*Zt.y,r.x*Zt.z,r.y*Zt.w),I.viewport(a),K.updateMatrices(st,Ct),n=K.getFrustum(),b(P,C,K.camera,st,this.type)}K.isPointLightShadow!==!0&&this.type===Wn&&S(K,C),K.needsUpdate=!1}h=this.type,m.needsUpdate=!1,i.setRenderTarget(w,v,A)};function S(T,P){const C=t.update(y);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Tn(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(P,null,C,f,y,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(P,null,C,p,y,null)}function M(T,P,C,w){let v=null;const A=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(A!==void 0)v=A;else if(v=C.isPointLight===!0?c:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const I=v.uuid,z=P.uuid;let H=l[I];H===void 0&&(H={},l[I]=H);let W=H[z];W===void 0&&(W=v.clone(),H[z]=W,P.addEventListener("dispose",E)),v=W}if(v.visible=P.visible,v.wireframe=P.wireframe,w===Wn?v.side=P.shadowSide!==null?P.shadowSide:P.side:v.side=P.shadowSide!==null?P.shadowSide:u[P.side],v.alphaMap=P.alphaMap,v.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,v.map=P.map,v.clipShadows=P.clipShadows,v.clippingPlanes=P.clippingPlanes,v.clipIntersection=P.clipIntersection,v.displacementMap=P.displacementMap,v.displacementScale=P.displacementScale,v.displacementBias=P.displacementBias,v.wireframeLinewidth=P.wireframeLinewidth,v.linewidth=P.linewidth,C.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const I=i.properties.get(v);I.light=C}return v}function b(T,P,C,w,v){if(T.visible===!1)return;if(T.layers.test(P.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&v===Wn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const z=t.update(T),H=T.material;if(Array.isArray(H)){const W=z.groups;for(let Y=0,st=W.length;Y<st;Y++){const K=W[Y],ut=H[K.materialIndex];if(ut&&ut.visible){const ft=M(T,ut,w,v);T.onBeforeShadow(i,T,P,C,z,ft,K),i.renderBufferDirect(C,null,z,ft,T,K),T.onAfterShadow(i,T,P,C,z,ft,K)}}}else if(H.visible){const W=M(T,H,w,v);T.onBeforeShadow(i,T,P,C,z,W,null),i.renderBufferDirect(C,null,z,W,T,null),T.onAfterShadow(i,T,P,C,z,W,null)}}const I=T.children;for(let z=0,H=I.length;z<H;z++)b(I[z],P,C,w,v)}function E(T){T.target.removeEventListener("dispose",E);for(const C in l){const w=l[C],v=T.target.uuid;v in w&&(w[v].dispose(),delete w[v])}}}const Gx={[Ba]:za,[ka]:Ha,[Va]:Wa,[ns]:Ga,[za]:Ba,[Ha]:ka,[Wa]:Va,[Ga]:ns};function Hx(i,t){function e(){let N=!1;const dt=new ve;let ct=null;const ht=new ve(0,0,0,0);return{setMask:function(ot){ct!==ot&&!N&&(i.colorMask(ot,ot,ot,ot),ct=ot)},setLocked:function(ot){N=ot},setClear:function(ot,it,yt,Ft,de){de===!0&&(ot*=Ft,it*=Ft,yt*=Ft),dt.set(ot,it,yt,Ft),ht.equals(dt)===!1&&(i.clearColor(ot,it,yt,Ft),ht.copy(dt))},reset:function(){N=!1,ct=null,ht.set(-1,0,0,0)}}}function n(){let N=!1,dt=!1,ct=null,ht=null,ot=null;return{setReversed:function(it){if(dt!==it){const yt=t.get("EXT_clip_control");it?yt.clipControlEXT(yt.LOWER_LEFT_EXT,yt.ZERO_TO_ONE_EXT):yt.clipControlEXT(yt.LOWER_LEFT_EXT,yt.NEGATIVE_ONE_TO_ONE_EXT),dt=it;const Ft=ot;ot=null,this.setClear(Ft)}},getReversed:function(){return dt},setTest:function(it){it?at(i.DEPTH_TEST):bt(i.DEPTH_TEST)},setMask:function(it){ct!==it&&!N&&(i.depthMask(it),ct=it)},setFunc:function(it){if(dt&&(it=Gx[it]),ht!==it){switch(it){case Ba:i.depthFunc(i.NEVER);break;case za:i.depthFunc(i.ALWAYS);break;case ka:i.depthFunc(i.LESS);break;case ns:i.depthFunc(i.LEQUAL);break;case Va:i.depthFunc(i.EQUAL);break;case Ga:i.depthFunc(i.GEQUAL);break;case Ha:i.depthFunc(i.GREATER);break;case Wa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ht=it}},setLocked:function(it){N=it},setClear:function(it){ot!==it&&(dt&&(it=1-it),i.clearDepth(it),ot=it)},reset:function(){N=!1,ct=null,ht=null,ot=null,dt=!1}}}function s(){let N=!1,dt=null,ct=null,ht=null,ot=null,it=null,yt=null,Ft=null,de=null;return{setTest:function(ae){N||(ae?at(i.STENCIL_TEST):bt(i.STENCIL_TEST))},setMask:function(ae){dt!==ae&&!N&&(i.stencilMask(ae),dt=ae)},setFunc:function(ae,ze,Fe){(ct!==ae||ht!==ze||ot!==Fe)&&(i.stencilFunc(ae,ze,Fe),ct=ae,ht=ze,ot=Fe)},setOp:function(ae,ze,Fe){(it!==ae||yt!==ze||Ft!==Fe)&&(i.stencilOp(ae,ze,Fe),it=ae,yt=ze,Ft=Fe)},setLocked:function(ae){N=ae},setClear:function(ae){de!==ae&&(i.clearStencil(ae),de=ae)},reset:function(){N=!1,dt=null,ct=null,ht=null,ot=null,it=null,yt=null,Ft=null,de=null}}}const r=new e,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let d={},u={},f=new WeakMap,p=[],g=null,y=!1,m=null,h=null,S=null,M=null,b=null,E=null,T=null,P=new kt(0,0,0),C=0,w=!1,v=null,A=null,I=null,z=null,H=null;const W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,st=0;const K=i.getParameter(i.VERSION);K.indexOf("WebGL")!==-1?(st=parseFloat(/^WebGL (\d)/.exec(K)[1]),Y=st>=1):K.indexOf("OpenGL ES")!==-1&&(st=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),Y=st>=2);let ut=null,ft={};const Ct=i.getParameter(i.SCISSOR_BOX),Zt=i.getParameter(i.VIEWPORT),ie=new ve().fromArray(Ct),fe=new ve().fromArray(Zt);function se(N,dt,ct,ht){const ot=new Uint8Array(4),it=i.createTexture();i.bindTexture(N,it),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let yt=0;yt<ct;yt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(dt,0,i.RGBA,1,1,ht,0,i.RGBA,i.UNSIGNED_BYTE,ot):i.texImage2D(dt+yt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ot);return it}const et={};et[i.TEXTURE_2D]=se(i.TEXTURE_2D,i.TEXTURE_2D,1),et[i.TEXTURE_CUBE_MAP]=se(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),et[i.TEXTURE_2D_ARRAY]=se(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),et[i.TEXTURE_3D]=se(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),at(i.DEPTH_TEST),a.setFunc(ns),Wt(!1),Xt(pc),at(i.CULL_FACE),pe(In);function at(N){d[N]!==!0&&(i.enable(N),d[N]=!0)}function bt(N){d[N]!==!1&&(i.disable(N),d[N]=!1)}function Ht(N,dt){return u[N]!==dt?(i.bindFramebuffer(N,dt),u[N]=dt,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=dt),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=dt),!0):!1}function Rt(N,dt){let ct=p,ht=!1;if(N){ct=f.get(dt),ct===void 0&&(ct=[],f.set(dt,ct));const ot=N.textures;if(ct.length!==ot.length||ct[0]!==i.COLOR_ATTACHMENT0){for(let it=0,yt=ot.length;it<yt;it++)ct[it]=i.COLOR_ATTACHMENT0+it;ct.length=ot.length,ht=!0}}else ct[0]!==i.BACK&&(ct[0]=i.BACK,ht=!0);ht&&i.drawBuffers(ct)}function Kt(N){return g!==N?(i.useProgram(N),g=N,!0):!1}const Ne={[Si]:i.FUNC_ADD,[ad]:i.FUNC_SUBTRACT,[od]:i.FUNC_REVERSE_SUBTRACT};Ne[cd]=i.MIN,Ne[ld]=i.MAX;const $t={[hd]:i.ZERO,[dd]:i.ONE,[ud]:i.SRC_COLOR,[Fa]:i.SRC_ALPHA,[_d]:i.SRC_ALPHA_SATURATE,[xd]:i.DST_COLOR,[pd]:i.DST_ALPHA,[fd]:i.ONE_MINUS_SRC_COLOR,[Oa]:i.ONE_MINUS_SRC_ALPHA,[gd]:i.ONE_MINUS_DST_COLOR,[md]:i.ONE_MINUS_DST_ALPHA,[vd]:i.CONSTANT_COLOR,[Md]:i.ONE_MINUS_CONSTANT_COLOR,[Sd]:i.CONSTANT_ALPHA,[yd]:i.ONE_MINUS_CONSTANT_ALPHA};function pe(N,dt,ct,ht,ot,it,yt,Ft,de,ae){if(N===In){y===!0&&(bt(i.BLEND),y=!1);return}if(y===!1&&(at(i.BLEND),y=!0),N!==rd){if(N!==m||ae!==w){if((h!==Si||b!==Si)&&(i.blendEquation(i.FUNC_ADD),h=Si,b=Si),ae)switch(N){case ji:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Qi:i.blendFunc(i.ONE,i.ONE);break;case mc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case xc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Pe("WebGLState: Invalid blending: ",N);break}else switch(N){case ji:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Qi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case mc:Pe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case xc:Pe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Pe("WebGLState: Invalid blending: ",N);break}S=null,M=null,E=null,T=null,P.set(0,0,0),C=0,m=N,w=ae}return}ot=ot||dt,it=it||ct,yt=yt||ht,(dt!==h||ot!==b)&&(i.blendEquationSeparate(Ne[dt],Ne[ot]),h=dt,b=ot),(ct!==S||ht!==M||it!==E||yt!==T)&&(i.blendFuncSeparate($t[ct],$t[ht],$t[it],$t[yt]),S=ct,M=ht,E=it,T=yt),(Ft.equals(P)===!1||de!==C)&&(i.blendColor(Ft.r,Ft.g,Ft.b,de),P.copy(Ft),C=de),m=N,w=!1}function F(N,dt){N.side===me?bt(i.CULL_FACE):at(i.CULL_FACE);let ct=N.side===qe;dt&&(ct=!ct),Wt(ct),N.blending===ji&&N.transparent===!1?pe(In):pe(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);const ht=N.stencilWrite;o.setTest(ht),ht&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Tt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?at(i.SAMPLE_ALPHA_TO_COVERAGE):bt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Wt(N){v!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),v=N)}function Xt(N){N!==id?(at(i.CULL_FACE),N!==A&&(N===pc?i.cullFace(i.BACK):N===sd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):bt(i.CULL_FACE),A=N}function ne(N){N!==I&&(Y&&i.lineWidth(N),I=N)}function Tt(N,dt,ct){N?(at(i.POLYGON_OFFSET_FILL),(z!==dt||H!==ct)&&(i.polygonOffset(dt,ct),z=dt,H=ct)):bt(i.POLYGON_OFFSET_FILL)}function be(N){N?at(i.SCISSOR_TEST):bt(i.SCISSOR_TEST)}function Pt(N){N===void 0&&(N=i.TEXTURE0+W-1),ut!==N&&(i.activeTexture(N),ut=N)}function Vt(N,dt,ct){ct===void 0&&(ut===null?ct=i.TEXTURE0+W-1:ct=ut);let ht=ft[ct];ht===void 0&&(ht={type:void 0,texture:void 0},ft[ct]=ht),(ht.type!==N||ht.texture!==dt)&&(ut!==ct&&(i.activeTexture(ct),ut=ct),i.bindTexture(N,dt||et[N]),ht.type=N,ht.texture=dt)}function D(){const N=ft[ut];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(N){N("WebGLState:",N)}}function L(){try{i.compressedTexImage3D(...arguments)}catch(N){N("WebGLState:",N)}}function O(){try{i.texSubImage2D(...arguments)}catch(N){N("WebGLState:",N)}}function V(){try{i.texSubImage3D(...arguments)}catch(N){N("WebGLState:",N)}}function B(){try{i.compressedTexSubImage2D(...arguments)}catch(N){N("WebGLState:",N)}}function j(){try{i.compressedTexSubImage3D(...arguments)}catch(N){N("WebGLState:",N)}}function Q(){try{i.texStorage2D(...arguments)}catch(N){N("WebGLState:",N)}}function pt(){try{i.texStorage3D(...arguments)}catch(N){N("WebGLState:",N)}}function lt(){try{i.texImage2D(...arguments)}catch(N){N("WebGLState:",N)}}function $(){try{i.texImage3D(...arguments)}catch(N){N("WebGLState:",N)}}function rt(N){ie.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),ie.copy(N))}function St(N){fe.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),fe.copy(N))}function vt(N,dt){let ct=l.get(dt);ct===void 0&&(ct=new WeakMap,l.set(dt,ct));let ht=ct.get(N);ht===void 0&&(ht=i.getUniformBlockIndex(dt,N.name),ct.set(N,ht))}function nt(N,dt){const ht=l.get(dt).get(N);c.get(dt)!==ht&&(i.uniformBlockBinding(dt,ht,N.__bindingPointIndex),c.set(dt,ht))}function At(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},ut=null,ft={},u={},f=new WeakMap,p=[],g=null,y=!1,m=null,h=null,S=null,M=null,b=null,E=null,T=null,P=new kt(0,0,0),C=0,w=!1,v=null,A=null,I=null,z=null,H=null,ie.set(0,0,i.canvas.width,i.canvas.height),fe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:at,disable:bt,bindFramebuffer:Ht,drawBuffers:Rt,useProgram:Kt,setBlending:pe,setMaterial:F,setFlipSided:Wt,setCullFace:Xt,setLineWidth:ne,setPolygonOffset:Tt,setScissorTest:be,activeTexture:Pt,bindTexture:Vt,unbindTexture:D,compressedTexImage2D:_,compressedTexImage3D:L,texImage2D:lt,texImage3D:$,updateUBOMapping:vt,uniformBlockBinding:nt,texStorage2D:Q,texStorage3D:pt,texSubImage2D:O,texSubImage3D:V,compressedTexSubImage2D:B,compressedTexSubImage3D:j,scissor:rt,viewport:St,reset:At}}function Wx(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new xt,d=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,_){return p?new OffscreenCanvas(D,_):Br("canvas")}function y(D,_,L){let O=1;const V=Vt(D);if((V.width>L||V.height>L)&&(O=L/Math.max(V.width,V.height)),O<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const B=Math.floor(O*V.width),j=Math.floor(O*V.height);u===void 0&&(u=g(B,j));const Q=_?g(B,j):u;return Q.width=B,Q.height=j,Q.getContext("2d").drawImage(D,0,0,B,j),Gt("WebGLRenderer: Texture has been resized from ("+V.width+"x"+V.height+") to ("+B+"x"+j+")."),Q}else return"data"in D&&Gt("WebGLRenderer: Image in DataTexture is too big ("+V.width+"x"+V.height+")."),D;return D}function m(D){return D.generateMipmaps}function h(D){i.generateMipmap(D)}function S(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(D,_,L,O,V=!1){if(D!==null){if(i[D]!==void 0)return i[D];Gt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let B=_;if(_===i.RED&&(L===i.FLOAT&&(B=i.R32F),L===i.HALF_FLOAT&&(B=i.R16F),L===i.UNSIGNED_BYTE&&(B=i.R8)),_===i.RED_INTEGER&&(L===i.UNSIGNED_BYTE&&(B=i.R8UI),L===i.UNSIGNED_SHORT&&(B=i.R16UI),L===i.UNSIGNED_INT&&(B=i.R32UI),L===i.BYTE&&(B=i.R8I),L===i.SHORT&&(B=i.R16I),L===i.INT&&(B=i.R32I)),_===i.RG&&(L===i.FLOAT&&(B=i.RG32F),L===i.HALF_FLOAT&&(B=i.RG16F),L===i.UNSIGNED_BYTE&&(B=i.RG8)),_===i.RG_INTEGER&&(L===i.UNSIGNED_BYTE&&(B=i.RG8UI),L===i.UNSIGNED_SHORT&&(B=i.RG16UI),L===i.UNSIGNED_INT&&(B=i.RG32UI),L===i.BYTE&&(B=i.RG8I),L===i.SHORT&&(B=i.RG16I),L===i.INT&&(B=i.RG32I)),_===i.RGB_INTEGER&&(L===i.UNSIGNED_BYTE&&(B=i.RGB8UI),L===i.UNSIGNED_SHORT&&(B=i.RGB16UI),L===i.UNSIGNED_INT&&(B=i.RGB32UI),L===i.BYTE&&(B=i.RGB8I),L===i.SHORT&&(B=i.RGB16I),L===i.INT&&(B=i.RGB32I)),_===i.RGBA_INTEGER&&(L===i.UNSIGNED_BYTE&&(B=i.RGBA8UI),L===i.UNSIGNED_SHORT&&(B=i.RGBA16UI),L===i.UNSIGNED_INT&&(B=i.RGBA32UI),L===i.BYTE&&(B=i.RGBA8I),L===i.SHORT&&(B=i.RGBA16I),L===i.INT&&(B=i.RGBA32I)),_===i.RGB&&(L===i.UNSIGNED_INT_5_9_9_9_REV&&(B=i.RGB9_E5),L===i.UNSIGNED_INT_10F_11F_11F_REV&&(B=i.R11F_G11F_B10F)),_===i.RGBA){const j=V?Fr:oe.getTransfer(O);L===i.FLOAT&&(B=i.RGBA32F),L===i.HALF_FLOAT&&(B=i.RGBA16F),L===i.UNSIGNED_BYTE&&(B=j===xe?i.SRGB8_ALPHA8:i.RGBA8),L===i.UNSIGNED_SHORT_4_4_4_4&&(B=i.RGBA4),L===i.UNSIGNED_SHORT_5_5_5_1&&(B=i.RGB5_A1)}return(B===i.R16F||B===i.R32F||B===i.RG16F||B===i.RG32F||B===i.RGBA16F||B===i.RGBA32F)&&t.get("EXT_color_buffer_float"),B}function b(D,_){let L;return D?_===null||_===Ai||_===zs?L=i.DEPTH24_STENCIL8:_===Ln?L=i.DEPTH32F_STENCIL8:_===Bs&&(L=i.DEPTH24_STENCIL8,Gt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Ai||_===zs?L=i.DEPTH_COMPONENT24:_===Ln?L=i.DEPTH_COMPONENT32F:_===Bs&&(L=i.DEPTH_COMPONENT16),L}function E(D,_){return m(D)===!0||D.isFramebufferTexture&&D.minFilter!==un&&D.minFilter!==xn?Math.log2(Math.max(_.width,_.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?_.mipmaps.length:1}function T(D){const _=D.target;_.removeEventListener("dispose",T),C(_),_.isVideoTexture&&d.delete(_)}function P(D){const _=D.target;_.removeEventListener("dispose",P),v(_)}function C(D){const _=n.get(D);if(_.__webglInit===void 0)return;const L=D.source,O=f.get(L);if(O){const V=O[_.__cacheKey];V.usedTimes--,V.usedTimes===0&&w(D),Object.keys(O).length===0&&f.delete(L)}n.remove(D)}function w(D){const _=n.get(D);i.deleteTexture(_.__webglTexture);const L=D.source,O=f.get(L);delete O[_.__cacheKey],a.memory.textures--}function v(D){const _=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let O=0;O<6;O++){if(Array.isArray(_.__webglFramebuffer[O]))for(let V=0;V<_.__webglFramebuffer[O].length;V++)i.deleteFramebuffer(_.__webglFramebuffer[O][V]);else i.deleteFramebuffer(_.__webglFramebuffer[O]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[O])}else{if(Array.isArray(_.__webglFramebuffer))for(let O=0;O<_.__webglFramebuffer.length;O++)i.deleteFramebuffer(_.__webglFramebuffer[O]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let O=0;O<_.__webglColorRenderbuffer.length;O++)_.__webglColorRenderbuffer[O]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[O]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const L=D.textures;for(let O=0,V=L.length;O<V;O++){const B=n.get(L[O]);B.__webglTexture&&(i.deleteTexture(B.__webglTexture),a.memory.textures--),n.remove(L[O])}n.remove(D)}let A=0;function I(){A=0}function z(){const D=A;return D>=s.maxTextures&&Gt("WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),A+=1,D}function H(D){const _=[];return _.push(D.wrapS),_.push(D.wrapT),_.push(D.wrapR||0),_.push(D.magFilter),_.push(D.minFilter),_.push(D.anisotropy),_.push(D.internalFormat),_.push(D.format),_.push(D.type),_.push(D.generateMipmaps),_.push(D.premultiplyAlpha),_.push(D.flipY),_.push(D.unpackAlignment),_.push(D.colorSpace),_.join()}function W(D,_){const L=n.get(D);if(D.isVideoTexture&&be(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&L.__version!==D.version){const O=D.image;if(O===null)Gt("WebGLRenderer: Texture marked for update but no image data found.");else if(O.complete===!1)Gt("WebGLRenderer: Texture marked for update but image is incomplete");else{et(L,D,_);return}}else D.isExternalTexture&&(L.__webglTexture=D.sourceTexture?D.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,L.__webglTexture,i.TEXTURE0+_)}function Y(D,_){const L=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&L.__version!==D.version){et(L,D,_);return}else D.isExternalTexture&&(L.__webglTexture=D.sourceTexture?D.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,L.__webglTexture,i.TEXTURE0+_)}function st(D,_){const L=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&L.__version!==D.version){et(L,D,_);return}e.bindTexture(i.TEXTURE_3D,L.__webglTexture,i.TEXTURE0+_)}function K(D,_){const L=n.get(D);if(D.version>0&&L.__version!==D.version){at(L,D,_);return}e.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+_)}const ut={[Ze]:i.REPEAT,[qn]:i.CLAMP_TO_EDGE,[Ya]:i.MIRRORED_REPEAT},ft={[un]:i.NEAREST,[Td]:i.NEAREST_MIPMAP_NEAREST,[js]:i.NEAREST_MIPMAP_LINEAR,[xn]:i.LINEAR,[Jr]:i.LINEAR_MIPMAP_NEAREST,[bi]:i.LINEAR_MIPMAP_LINEAR},Ct={[Rd]:i.NEVER,[Nd]:i.ALWAYS,[Pd]:i.LESS,[ih]:i.LEQUAL,[Ld]:i.EQUAL,[Ud]:i.GEQUAL,[Dd]:i.GREATER,[Id]:i.NOTEQUAL};function Zt(D,_){if(_.type===Ln&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===xn||_.magFilter===Jr||_.magFilter===js||_.magFilter===bi||_.minFilter===xn||_.minFilter===Jr||_.minFilter===js||_.minFilter===bi)&&Gt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,ut[_.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,ut[_.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,ut[_.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,ft[_.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,ft[_.minFilter]),_.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,Ct[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===un||_.minFilter!==js&&_.minFilter!==bi||_.type===Ln&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const L=t.get("EXT_texture_filter_anisotropic");i.texParameterf(D,L.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function ie(D,_){let L=!1;D.__webglInit===void 0&&(D.__webglInit=!0,_.addEventListener("dispose",T));const O=_.source;let V=f.get(O);V===void 0&&(V={},f.set(O,V));const B=H(_);if(B!==D.__cacheKey){V[B]===void 0&&(V[B]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,L=!0),V[B].usedTimes++;const j=V[D.__cacheKey];j!==void 0&&(V[D.__cacheKey].usedTimes--,j.usedTimes===0&&w(_)),D.__cacheKey=B,D.__webglTexture=V[B].texture}return L}function fe(D,_,L){return Math.floor(Math.floor(D/L)/_)}function se(D,_,L,O){const B=D.updateRanges;if(B.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,L,O,_.data);else{B.sort(($,rt)=>$.start-rt.start);let j=0;for(let $=1;$<B.length;$++){const rt=B[j],St=B[$],vt=rt.start+rt.count,nt=fe(St.start,_.width,4),At=fe(rt.start,_.width,4);St.start<=vt+1&&nt===At&&fe(St.start+St.count-1,_.width,4)===nt?rt.count=Math.max(rt.count,St.start+St.count-rt.start):(++j,B[j]=St)}B.length=j+1;const Q=i.getParameter(i.UNPACK_ROW_LENGTH),pt=i.getParameter(i.UNPACK_SKIP_PIXELS),lt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let $=0,rt=B.length;$<rt;$++){const St=B[$],vt=Math.floor(St.start/4),nt=Math.ceil(St.count/4),At=vt%_.width,N=Math.floor(vt/_.width),dt=nt,ct=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,At),i.pixelStorei(i.UNPACK_SKIP_ROWS,N),e.texSubImage2D(i.TEXTURE_2D,0,At,N,dt,ct,L,O,_.data)}D.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Q),i.pixelStorei(i.UNPACK_SKIP_PIXELS,pt),i.pixelStorei(i.UNPACK_SKIP_ROWS,lt)}}function et(D,_,L){let O=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(O=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(O=i.TEXTURE_3D);const V=ie(D,_),B=_.source;e.bindTexture(O,D.__webglTexture,i.TEXTURE0+L);const j=n.get(B);if(B.version!==j.__version||V===!0){e.activeTexture(i.TEXTURE0+L);const Q=oe.getPrimaries(oe.workingColorSpace),pt=_.colorSpace===ri?null:oe.getPrimaries(_.colorSpace),lt=_.colorSpace===ri||Q===pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,lt);let $=y(_.image,!1,s.maxTextureSize);$=Pt(_,$);const rt=r.convert(_.format,_.colorSpace),St=r.convert(_.type);let vt=M(_.internalFormat,rt,St,_.colorSpace,_.isVideoTexture);Zt(O,_);let nt;const At=_.mipmaps,N=_.isVideoTexture!==!0,dt=j.__version===void 0||V===!0,ct=B.dataReady,ht=E(_,$);if(_.isDepthTexture)vt=b(_.format===Vs,_.type),dt&&(N?e.texStorage2D(i.TEXTURE_2D,1,vt,$.width,$.height):e.texImage2D(i.TEXTURE_2D,0,vt,$.width,$.height,0,rt,St,null));else if(_.isDataTexture)if(At.length>0){N&&dt&&e.texStorage2D(i.TEXTURE_2D,ht,vt,At[0].width,At[0].height);for(let ot=0,it=At.length;ot<it;ot++)nt=At[ot],N?ct&&e.texSubImage2D(i.TEXTURE_2D,ot,0,0,nt.width,nt.height,rt,St,nt.data):e.texImage2D(i.TEXTURE_2D,ot,vt,nt.width,nt.height,0,rt,St,nt.data);_.generateMipmaps=!1}else N?(dt&&e.texStorage2D(i.TEXTURE_2D,ht,vt,$.width,$.height),ct&&se(_,$,rt,St)):e.texImage2D(i.TEXTURE_2D,0,vt,$.width,$.height,0,rt,St,$.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){N&&dt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ht,vt,At[0].width,At[0].height,$.depth);for(let ot=0,it=At.length;ot<it;ot++)if(nt=At[ot],_.format!==wn)if(rt!==null)if(N){if(ct)if(_.layerUpdates.size>0){const yt=il(nt.width,nt.height,_.format,_.type);for(const Ft of _.layerUpdates){const de=nt.data.subarray(Ft*yt/nt.data.BYTES_PER_ELEMENT,(Ft+1)*yt/nt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ot,0,0,Ft,nt.width,nt.height,1,rt,de)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ot,0,0,0,nt.width,nt.height,$.depth,rt,nt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ot,vt,nt.width,nt.height,$.depth,0,nt.data,0,0);else Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?ct&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,ot,0,0,0,nt.width,nt.height,$.depth,rt,St,nt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ot,vt,nt.width,nt.height,$.depth,0,rt,St,nt.data)}else{N&&dt&&e.texStorage2D(i.TEXTURE_2D,ht,vt,At[0].width,At[0].height);for(let ot=0,it=At.length;ot<it;ot++)nt=At[ot],_.format!==wn?rt!==null?N?ct&&e.compressedTexSubImage2D(i.TEXTURE_2D,ot,0,0,nt.width,nt.height,rt,nt.data):e.compressedTexImage2D(i.TEXTURE_2D,ot,vt,nt.width,nt.height,0,nt.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?ct&&e.texSubImage2D(i.TEXTURE_2D,ot,0,0,nt.width,nt.height,rt,St,nt.data):e.texImage2D(i.TEXTURE_2D,ot,vt,nt.width,nt.height,0,rt,St,nt.data)}else if(_.isDataArrayTexture)if(N){if(dt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ht,vt,$.width,$.height,$.depth),ct)if(_.layerUpdates.size>0){const ot=il($.width,$.height,_.format,_.type);for(const it of _.layerUpdates){const yt=$.data.subarray(it*ot/$.data.BYTES_PER_ELEMENT,(it+1)*ot/$.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,it,$.width,$.height,1,rt,St,yt)}_.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,rt,St,$.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,vt,$.width,$.height,$.depth,0,rt,St,$.data);else if(_.isData3DTexture)N?(dt&&e.texStorage3D(i.TEXTURE_3D,ht,vt,$.width,$.height,$.depth),ct&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,rt,St,$.data)):e.texImage3D(i.TEXTURE_3D,0,vt,$.width,$.height,$.depth,0,rt,St,$.data);else if(_.isFramebufferTexture){if(dt)if(N)e.texStorage2D(i.TEXTURE_2D,ht,vt,$.width,$.height);else{let ot=$.width,it=$.height;for(let yt=0;yt<ht;yt++)e.texImage2D(i.TEXTURE_2D,yt,vt,ot,it,0,rt,St,null),ot>>=1,it>>=1}}else if(At.length>0){if(N&&dt){const ot=Vt(At[0]);e.texStorage2D(i.TEXTURE_2D,ht,vt,ot.width,ot.height)}for(let ot=0,it=At.length;ot<it;ot++)nt=At[ot],N?ct&&e.texSubImage2D(i.TEXTURE_2D,ot,0,0,rt,St,nt):e.texImage2D(i.TEXTURE_2D,ot,vt,rt,St,nt);_.generateMipmaps=!1}else if(N){if(dt){const ot=Vt($);e.texStorage2D(i.TEXTURE_2D,ht,vt,ot.width,ot.height)}ct&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,rt,St,$)}else e.texImage2D(i.TEXTURE_2D,0,vt,rt,St,$);m(_)&&h(O),j.__version=B.version,_.onUpdate&&_.onUpdate(_)}D.__version=_.version}function at(D,_,L){if(_.image.length!==6)return;const O=ie(D,_),V=_.source;e.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+L);const B=n.get(V);if(V.version!==B.__version||O===!0){e.activeTexture(i.TEXTURE0+L);const j=oe.getPrimaries(oe.workingColorSpace),Q=_.colorSpace===ri?null:oe.getPrimaries(_.colorSpace),pt=_.colorSpace===ri||j===Q?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt);const lt=_.isCompressedTexture||_.image[0].isCompressedTexture,$=_.image[0]&&_.image[0].isDataTexture,rt=[];for(let it=0;it<6;it++)!lt&&!$?rt[it]=y(_.image[it],!0,s.maxCubemapSize):rt[it]=$?_.image[it].image:_.image[it],rt[it]=Pt(_,rt[it]);const St=rt[0],vt=r.convert(_.format,_.colorSpace),nt=r.convert(_.type),At=M(_.internalFormat,vt,nt,_.colorSpace),N=_.isVideoTexture!==!0,dt=B.__version===void 0||O===!0,ct=V.dataReady;let ht=E(_,St);Zt(i.TEXTURE_CUBE_MAP,_);let ot;if(lt){N&&dt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ht,At,St.width,St.height);for(let it=0;it<6;it++){ot=rt[it].mipmaps;for(let yt=0;yt<ot.length;yt++){const Ft=ot[yt];_.format!==wn?vt!==null?N?ct&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,yt,0,0,Ft.width,Ft.height,vt,Ft.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,yt,At,Ft.width,Ft.height,0,Ft.data):Gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?ct&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,yt,0,0,Ft.width,Ft.height,vt,nt,Ft.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,yt,At,Ft.width,Ft.height,0,vt,nt,Ft.data)}}}else{if(ot=_.mipmaps,N&&dt){ot.length>0&&ht++;const it=Vt(rt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ht,At,it.width,it.height)}for(let it=0;it<6;it++)if($){N?ct&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,rt[it].width,rt[it].height,vt,nt,rt[it].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,At,rt[it].width,rt[it].height,0,vt,nt,rt[it].data);for(let yt=0;yt<ot.length;yt++){const de=ot[yt].image[it].image;N?ct&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,yt+1,0,0,de.width,de.height,vt,nt,de.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,yt+1,At,de.width,de.height,0,vt,nt,de.data)}}else{N?ct&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,vt,nt,rt[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,At,vt,nt,rt[it]);for(let yt=0;yt<ot.length;yt++){const Ft=ot[yt];N?ct&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,yt+1,0,0,vt,nt,Ft.image[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,yt+1,At,vt,nt,Ft.image[it])}}}m(_)&&h(i.TEXTURE_CUBE_MAP),B.__version=V.version,_.onUpdate&&_.onUpdate(_)}D.__version=_.version}function bt(D,_,L,O,V,B){const j=r.convert(L.format,L.colorSpace),Q=r.convert(L.type),pt=M(L.internalFormat,j,Q,L.colorSpace),lt=n.get(_),$=n.get(L);if($.__renderTarget=_,!lt.__hasExternalTextures){const rt=Math.max(1,_.width>>B),St=Math.max(1,_.height>>B);V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?e.texImage3D(V,B,pt,rt,St,_.depth,0,j,Q,null):e.texImage2D(V,B,pt,rt,St,0,j,Q,null)}e.bindFramebuffer(i.FRAMEBUFFER,D),Tt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,O,V,$.__webglTexture,0,ne(_)):(V===i.TEXTURE_2D||V>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&V<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,O,V,$.__webglTexture,B),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ht(D,_,L){if(i.bindRenderbuffer(i.RENDERBUFFER,D),_.depthBuffer){const O=_.depthTexture,V=O&&O.isDepthTexture?O.type:null,B=b(_.stencilBuffer,V),j=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=ne(_);Tt(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Q,B,_.width,_.height):L?i.renderbufferStorageMultisample(i.RENDERBUFFER,Q,B,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,B,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,D)}else{const O=_.textures;for(let V=0;V<O.length;V++){const B=O[V],j=r.convert(B.format,B.colorSpace),Q=r.convert(B.type),pt=M(B.internalFormat,j,Q,B.colorSpace),lt=ne(_);L&&Tt(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,lt,pt,_.width,_.height):Tt(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,lt,pt,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,pt,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Rt(D,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,D),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const O=n.get(_.depthTexture);O.__renderTarget=_,(!O.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),W(_.depthTexture,0);const V=O.__webglTexture,B=ne(_);if(_.depthTexture.format===ks)Tt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,V,0,B):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,V,0);else if(_.depthTexture.format===Vs)Tt(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,V,0,B):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,V,0);else throw new Error("Unknown depthTexture format")}function Kt(D){const _=n.get(D),L=D.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==D.depthTexture){const O=D.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),O){const V=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,O.removeEventListener("dispose",V)};O.addEventListener("dispose",V),_.__depthDisposeCallback=V}_.__boundDepthTexture=O}if(D.depthTexture&&!_.__autoAllocateDepthBuffer){if(L)throw new Error("target.depthTexture not supported in Cube render targets");const O=D.texture.mipmaps;O&&O.length>0?Rt(_.__webglFramebuffer[0],D):Rt(_.__webglFramebuffer,D)}else if(L){_.__webglDepthbuffer=[];for(let O=0;O<6;O++)if(e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[O]),_.__webglDepthbuffer[O]===void 0)_.__webglDepthbuffer[O]=i.createRenderbuffer(),Ht(_.__webglDepthbuffer[O],D,!1);else{const V=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,B=_.__webglDepthbuffer[O];i.bindRenderbuffer(i.RENDERBUFFER,B),i.framebufferRenderbuffer(i.FRAMEBUFFER,V,i.RENDERBUFFER,B)}}else{const O=D.texture.mipmaps;if(O&&O.length>0?e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Ht(_.__webglDepthbuffer,D,!1);else{const V=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,B=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,B),i.framebufferRenderbuffer(i.FRAMEBUFFER,V,i.RENDERBUFFER,B)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ne(D,_,L){const O=n.get(D);_!==void 0&&bt(O.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),L!==void 0&&Kt(D)}function $t(D){const _=D.texture,L=n.get(D),O=n.get(_);D.addEventListener("dispose",P);const V=D.textures,B=D.isWebGLCubeRenderTarget===!0,j=V.length>1;if(j||(O.__webglTexture===void 0&&(O.__webglTexture=i.createTexture()),O.__version=_.version,a.memory.textures++),B){L.__webglFramebuffer=[];for(let Q=0;Q<6;Q++)if(_.mipmaps&&_.mipmaps.length>0){L.__webglFramebuffer[Q]=[];for(let pt=0;pt<_.mipmaps.length;pt++)L.__webglFramebuffer[Q][pt]=i.createFramebuffer()}else L.__webglFramebuffer[Q]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){L.__webglFramebuffer=[];for(let Q=0;Q<_.mipmaps.length;Q++)L.__webglFramebuffer[Q]=i.createFramebuffer()}else L.__webglFramebuffer=i.createFramebuffer();if(j)for(let Q=0,pt=V.length;Q<pt;Q++){const lt=n.get(V[Q]);lt.__webglTexture===void 0&&(lt.__webglTexture=i.createTexture(),a.memory.textures++)}if(D.samples>0&&Tt(D)===!1){L.__webglMultisampledFramebuffer=i.createFramebuffer(),L.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,L.__webglMultisampledFramebuffer);for(let Q=0;Q<V.length;Q++){const pt=V[Q];L.__webglColorRenderbuffer[Q]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,L.__webglColorRenderbuffer[Q]);const lt=r.convert(pt.format,pt.colorSpace),$=r.convert(pt.type),rt=M(pt.internalFormat,lt,$,pt.colorSpace,D.isXRRenderTarget===!0),St=ne(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,St,rt,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Q,i.RENDERBUFFER,L.__webglColorRenderbuffer[Q])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(L.__webglDepthRenderbuffer=i.createRenderbuffer(),Ht(L.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(B){e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture),Zt(i.TEXTURE_CUBE_MAP,_);for(let Q=0;Q<6;Q++)if(_.mipmaps&&_.mipmaps.length>0)for(let pt=0;pt<_.mipmaps.length;pt++)bt(L.__webglFramebuffer[Q][pt],D,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,pt);else bt(L.__webglFramebuffer[Q],D,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0);m(_)&&h(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(j){for(let Q=0,pt=V.length;Q<pt;Q++){const lt=V[Q],$=n.get(lt);let rt=i.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(rt=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(rt,$.__webglTexture),Zt(rt,lt),bt(L.__webglFramebuffer,D,lt,i.COLOR_ATTACHMENT0+Q,rt,0),m(lt)&&h(rt)}e.unbindTexture()}else{let Q=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Q=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Q,O.__webglTexture),Zt(Q,_),_.mipmaps&&_.mipmaps.length>0)for(let pt=0;pt<_.mipmaps.length;pt++)bt(L.__webglFramebuffer[pt],D,_,i.COLOR_ATTACHMENT0,Q,pt);else bt(L.__webglFramebuffer,D,_,i.COLOR_ATTACHMENT0,Q,0);m(_)&&h(Q),e.unbindTexture()}D.depthBuffer&&Kt(D)}function pe(D){const _=D.textures;for(let L=0,O=_.length;L<O;L++){const V=_[L];if(m(V)){const B=S(D),j=n.get(V).__webglTexture;e.bindTexture(B,j),h(B),e.unbindTexture()}}}const F=[],Wt=[];function Xt(D){if(D.samples>0){if(Tt(D)===!1){const _=D.textures,L=D.width,O=D.height;let V=i.COLOR_BUFFER_BIT;const B=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=n.get(D),Q=_.length>1;if(Q)for(let lt=0;lt<_.length;lt++)e.bindFramebuffer(i.FRAMEBUFFER,j.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+lt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,j.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+lt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,j.__webglMultisampledFramebuffer);const pt=D.texture.mipmaps;pt&&pt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,j.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,j.__webglFramebuffer);for(let lt=0;lt<_.length;lt++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(V|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(V|=i.STENCIL_BUFFER_BIT)),Q){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,j.__webglColorRenderbuffer[lt]);const $=n.get(_[lt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,$,0)}i.blitFramebuffer(0,0,L,O,0,0,L,O,V,i.NEAREST),c===!0&&(F.length=0,Wt.length=0,F.push(i.COLOR_ATTACHMENT0+lt),D.depthBuffer&&D.resolveDepthBuffer===!1&&(F.push(B),Wt.push(B),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Wt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,F))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Q)for(let lt=0;lt<_.length;lt++){e.bindFramebuffer(i.FRAMEBUFFER,j.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+lt,i.RENDERBUFFER,j.__webglColorRenderbuffer[lt]);const $=n.get(_[lt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,j.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+lt,i.TEXTURE_2D,$,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,j.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const _=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function ne(D){return Math.min(s.maxSamples,D.samples)}function Tt(D){const _=n.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function be(D){const _=a.render.frame;d.get(D)!==_&&(d.set(D,_),D.update())}function Pt(D,_){const L=D.colorSpace,O=D.format,V=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||L!==rs&&L!==ri&&(oe.getTransfer(L)===xe?(O!==wn||V!==Nn)&&Gt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Pe("WebGLTextures: Unsupported texture color space:",L)),_}function Vt(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(l.width=D.naturalWidth||D.width,l.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(l.width=D.displayWidth,l.height=D.displayHeight):(l.width=D.width,l.height=D.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=I,this.setTexture2D=W,this.setTexture2DArray=Y,this.setTexture3D=st,this.setTextureCube=K,this.rebindTextures=Ne,this.setupRenderTarget=$t,this.updateRenderTargetMipmap=pe,this.updateMultisampleRenderTarget=Xt,this.setupDepthRenderbuffer=Kt,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=Tt}function Xx(i,t){function e(n,s=ri){let r;const a=oe.getTransfer(s);if(n===Nn)return i.UNSIGNED_BYTE;if(n===No)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Fo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ql)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===th)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Jl)return i.BYTE;if(n===jl)return i.SHORT;if(n===Bs)return i.UNSIGNED_SHORT;if(n===Uo)return i.INT;if(n===Ai)return i.UNSIGNED_INT;if(n===Ln)return i.FLOAT;if(n===Un)return i.HALF_FLOAT;if(n===eh)return i.ALPHA;if(n===nh)return i.RGB;if(n===wn)return i.RGBA;if(n===ks)return i.DEPTH_COMPONENT;if(n===Vs)return i.DEPTH_STENCIL;if(n===Oo)return i.RED;if(n===Bo)return i.RED_INTEGER;if(n===zo)return i.RG;if(n===ko)return i.RG_INTEGER;if(n===Vo)return i.RGBA_INTEGER;if(n===Ar||n===Cr||n===Rr||n===Pr)if(a===xe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ar)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Pr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ar)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Rr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Pr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Za||n===$a||n===Ka||n===Ja)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Za)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===$a)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ka)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ja)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ja||n===Qa||n===to)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ja||n===Qa)return a===xe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===to)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===eo||n===no||n===io||n===so||n===ro||n===ao||n===oo||n===co||n===lo||n===ho||n===uo||n===fo||n===po||n===mo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===eo)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===no)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===io)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===so)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ro)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ao)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===oo)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===co)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===lo)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ho)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===uo)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===fo)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===po)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===mo)return a===xe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===xo||n===go||n===_o)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===xo)return a===xe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===go)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===_o)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===vo||n===Mo||n===So||n===yo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===vo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Mo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===So)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===yo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===zs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const qx=`
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

}`;class Zx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new mh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Xe({vertexShader:qx,fragmentShader:Yx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new X(new Ie(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class $x extends hs{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,u=null,f=null,p=null,g=null;const y=typeof XRWebGLBinding<"u",m=new Zx,h={},S=e.getContextAttributes();let M=null,b=null;const E=[],T=[],P=new xt;let C=null;const w=new dn;w.viewport=new ve;const v=new dn;v.viewport=new ve;const A=[w,v],I=new ff;let z=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(et){let at=E[et];return at===void 0&&(at=new _a,E[et]=at),at.getTargetRaySpace()},this.getControllerGrip=function(et){let at=E[et];return at===void 0&&(at=new _a,E[et]=at),at.getGripSpace()},this.getHand=function(et){let at=E[et];return at===void 0&&(at=new _a,E[et]=at),at.getHandSpace()};function W(et){const at=T.indexOf(et.inputSource);if(at===-1)return;const bt=E[at];bt!==void 0&&(bt.update(et.inputSource,et.frame,l||a),bt.dispatchEvent({type:et.type,data:et.inputSource}))}function Y(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",st);for(let et=0;et<E.length;et++){const at=T[et];at!==null&&(T[et]=null,E[et].disconnect(at))}z=null,H=null,m.reset();for(const et in h)delete h[et];t.setRenderTarget(M),p=null,f=null,u=null,s=null,b=null,se.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(et){r=et,n.isPresenting===!0&&Gt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(et){o=et,n.isPresenting===!0&&Gt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(et){l=et},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u===null&&y&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(et){if(s=et,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",st),S.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(P),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let bt=null,Ht=null,Rt=null;S.depth&&(Rt=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,bt=S.stencil?Vs:ks,Ht=S.stencil?zs:Ai);const Kt={colorFormat:e.RGBA8,depthFormat:Rt,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Kt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),b=new Tn(f.textureWidth,f.textureHeight,{format:wn,type:Nn,depthTexture:new ph(f.textureWidth,f.textureHeight,Ht,void 0,void 0,void 0,void 0,void 0,void 0,bt),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const bt={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,bt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new Tn(p.framebufferWidth,p.framebufferHeight,{format:wn,type:Nn,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),se.setContext(s),se.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function st(et){for(let at=0;at<et.removed.length;at++){const bt=et.removed[at],Ht=T.indexOf(bt);Ht>=0&&(T[Ht]=null,E[Ht].disconnect(bt))}for(let at=0;at<et.added.length;at++){const bt=et.added[at];let Ht=T.indexOf(bt);if(Ht===-1){for(let Kt=0;Kt<E.length;Kt++)if(Kt>=T.length){T.push(bt),Ht=Kt;break}else if(T[Kt]===null){T[Kt]=bt,Ht=Kt;break}if(Ht===-1)break}const Rt=E[Ht];Rt&&Rt.connect(bt)}}const K=new U,ut=new U;function ft(et,at,bt){K.setFromMatrixPosition(at.matrixWorld),ut.setFromMatrixPosition(bt.matrixWorld);const Ht=K.distanceTo(ut),Rt=at.projectionMatrix.elements,Kt=bt.projectionMatrix.elements,Ne=Rt[14]/(Rt[10]-1),$t=Rt[14]/(Rt[10]+1),pe=(Rt[9]+1)/Rt[5],F=(Rt[9]-1)/Rt[5],Wt=(Rt[8]-1)/Rt[0],Xt=(Kt[8]+1)/Kt[0],ne=Ne*Wt,Tt=Ne*Xt,be=Ht/(-Wt+Xt),Pt=be*-Wt;if(at.matrixWorld.decompose(et.position,et.quaternion,et.scale),et.translateX(Pt),et.translateZ(be),et.matrixWorld.compose(et.position,et.quaternion,et.scale),et.matrixWorldInverse.copy(et.matrixWorld).invert(),Rt[10]===-1)et.projectionMatrix.copy(at.projectionMatrix),et.projectionMatrixInverse.copy(at.projectionMatrixInverse);else{const Vt=Ne+be,D=$t+be,_=ne-Pt,L=Tt+(Ht-Pt),O=pe*$t/D*Vt,V=F*$t/D*Vt;et.projectionMatrix.makePerspective(_,L,O,V,Vt,D),et.projectionMatrixInverse.copy(et.projectionMatrix).invert()}}function Ct(et,at){at===null?et.matrixWorld.copy(et.matrix):et.matrixWorld.multiplyMatrices(at.matrixWorld,et.matrix),et.matrixWorldInverse.copy(et.matrixWorld).invert()}this.updateCamera=function(et){if(s===null)return;let at=et.near,bt=et.far;m.texture!==null&&(m.depthNear>0&&(at=m.depthNear),m.depthFar>0&&(bt=m.depthFar)),I.near=v.near=w.near=at,I.far=v.far=w.far=bt,(z!==I.near||H!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),z=I.near,H=I.far),I.layers.mask=et.layers.mask|6,w.layers.mask=I.layers.mask&3,v.layers.mask=I.layers.mask&5;const Ht=et.parent,Rt=I.cameras;Ct(I,Ht);for(let Kt=0;Kt<Rt.length;Kt++)Ct(Rt[Kt],Ht);Rt.length===2?ft(I,w,v):I.projectionMatrix.copy(w.projectionMatrix),Zt(et,I,Ht)};function Zt(et,at,bt){bt===null?et.matrix.copy(at.matrixWorld):(et.matrix.copy(bt.matrixWorld),et.matrix.invert(),et.matrix.multiply(at.matrixWorld)),et.matrix.decompose(et.position,et.quaternion,et.scale),et.updateMatrixWorld(!0),et.projectionMatrix.copy(at.projectionMatrix),et.projectionMatrixInverse.copy(at.projectionMatrixInverse),et.isPerspectiveCamera&&(et.fov=Hs*2*Math.atan(1/et.projectionMatrix.elements[5]),et.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(et){c=et,f!==null&&(f.fixedFoveation=et),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=et)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(et){return h[et]};let ie=null;function fe(et,at){if(d=at.getViewerPose(l||a),g=at,d!==null){const bt=d.views;p!==null&&(t.setRenderTargetFramebuffer(b,p.framebuffer),t.setRenderTarget(b));let Ht=!1;bt.length!==I.cameras.length&&(I.cameras.length=0,Ht=!0);for(let $t=0;$t<bt.length;$t++){const pe=bt[$t];let F=null;if(p!==null)F=p.getViewport(pe);else{const Xt=u.getViewSubImage(f,pe);F=Xt.viewport,$t===0&&(t.setRenderTargetTextures(b,Xt.colorTexture,Xt.depthStencilTexture),t.setRenderTarget(b))}let Wt=A[$t];Wt===void 0&&(Wt=new dn,Wt.layers.enable($t),Wt.viewport=new ve,A[$t]=Wt),Wt.matrix.fromArray(pe.transform.matrix),Wt.matrix.decompose(Wt.position,Wt.quaternion,Wt.scale),Wt.projectionMatrix.fromArray(pe.projectionMatrix),Wt.projectionMatrixInverse.copy(Wt.projectionMatrix).invert(),Wt.viewport.set(F.x,F.y,F.width,F.height),$t===0&&(I.matrix.copy(Wt.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Ht===!0&&I.cameras.push(Wt)}const Rt=s.enabledFeatures;if(Rt&&Rt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){u=n.getBinding();const $t=u.getDepthInformation(bt[0]);$t&&$t.isValid&&$t.texture&&m.init($t,s.renderState)}if(Rt&&Rt.includes("camera-access")&&y){t.state.unbindTexture(),u=n.getBinding();for(let $t=0;$t<bt.length;$t++){const pe=bt[$t].camera;if(pe){let F=h[pe];F||(F=new mh,h[pe]=F);const Wt=u.getCameraImage(pe);F.sourceTexture=Wt}}}}for(let bt=0;bt<E.length;bt++){const Ht=T[bt],Rt=E[bt];Ht!==null&&Rt!==void 0&&Rt.update(Ht,at,l||a)}ie&&ie(et,at),at.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:at}),g=null}const se=new Ch;se.setAnimationLoop(fe),this.setAnimationLoop=function(et){ie=et},this.dispose=function(){}}}const gi=new Cn,Kx=new ue;function Jx(i,t){function e(m,h){m.matrixAutoUpdate===!0&&m.updateMatrix(),h.value.copy(m.matrix)}function n(m,h){h.color.getRGB(m.fogColor.value,lh(i)),h.isFog?(m.fogNear.value=h.near,m.fogFar.value=h.far):h.isFogExp2&&(m.fogDensity.value=h.density)}function s(m,h,S,M,b){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(m,h):h.isMeshToonMaterial?(r(m,h),u(m,h)):h.isMeshPhongMaterial?(r(m,h),d(m,h)):h.isMeshStandardMaterial?(r(m,h),f(m,h),h.isMeshPhysicalMaterial&&p(m,h,b)):h.isMeshMatcapMaterial?(r(m,h),g(m,h)):h.isMeshDepthMaterial?r(m,h):h.isMeshDistanceMaterial?(r(m,h),y(m,h)):h.isMeshNormalMaterial?r(m,h):h.isLineBasicMaterial?(a(m,h),h.isLineDashedMaterial&&o(m,h)):h.isPointsMaterial?c(m,h,S,M):h.isSpriteMaterial?l(m,h):h.isShadowMaterial?(m.color.value.copy(h.color),m.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(m,h){m.opacity.value=h.opacity,h.color&&m.diffuse.value.copy(h.color),h.emissive&&m.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(m.map.value=h.map,e(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,e(h.alphaMap,m.alphaMapTransform)),h.bumpMap&&(m.bumpMap.value=h.bumpMap,e(h.bumpMap,m.bumpMapTransform),m.bumpScale.value=h.bumpScale,h.side===qe&&(m.bumpScale.value*=-1)),h.normalMap&&(m.normalMap.value=h.normalMap,e(h.normalMap,m.normalMapTransform),m.normalScale.value.copy(h.normalScale),h.side===qe&&m.normalScale.value.negate()),h.displacementMap&&(m.displacementMap.value=h.displacementMap,e(h.displacementMap,m.displacementMapTransform),m.displacementScale.value=h.displacementScale,m.displacementBias.value=h.displacementBias),h.emissiveMap&&(m.emissiveMap.value=h.emissiveMap,e(h.emissiveMap,m.emissiveMapTransform)),h.specularMap&&(m.specularMap.value=h.specularMap,e(h.specularMap,m.specularMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest);const S=t.get(h),M=S.envMap,b=S.envMapRotation;M&&(m.envMap.value=M,gi.copy(b),gi.x*=-1,gi.y*=-1,gi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(gi.y*=-1,gi.z*=-1),m.envMapRotation.value.setFromMatrix4(Kx.makeRotationFromEuler(gi)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=h.reflectivity,m.ior.value=h.ior,m.refractionRatio.value=h.refractionRatio),h.lightMap&&(m.lightMap.value=h.lightMap,m.lightMapIntensity.value=h.lightMapIntensity,e(h.lightMap,m.lightMapTransform)),h.aoMap&&(m.aoMap.value=h.aoMap,m.aoMapIntensity.value=h.aoMapIntensity,e(h.aoMap,m.aoMapTransform))}function a(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,h.map&&(m.map.value=h.map,e(h.map,m.mapTransform))}function o(m,h){m.dashSize.value=h.dashSize,m.totalSize.value=h.dashSize+h.gapSize,m.scale.value=h.scale}function c(m,h,S,M){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.size.value=h.size*S,m.scale.value=M*.5,h.map&&(m.map.value=h.map,e(h.map,m.uvTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,e(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function l(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.rotation.value=h.rotation,h.map&&(m.map.value=h.map,e(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,e(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function d(m,h){m.specular.value.copy(h.specular),m.shininess.value=Math.max(h.shininess,1e-4)}function u(m,h){h.gradientMap&&(m.gradientMap.value=h.gradientMap)}function f(m,h){m.metalness.value=h.metalness,h.metalnessMap&&(m.metalnessMap.value=h.metalnessMap,e(h.metalnessMap,m.metalnessMapTransform)),m.roughness.value=h.roughness,h.roughnessMap&&(m.roughnessMap.value=h.roughnessMap,e(h.roughnessMap,m.roughnessMapTransform)),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)}function p(m,h,S){m.ior.value=h.ior,h.sheen>0&&(m.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),m.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(m.sheenColorMap.value=h.sheenColorMap,e(h.sheenColorMap,m.sheenColorMapTransform)),h.sheenRoughnessMap&&(m.sheenRoughnessMap.value=h.sheenRoughnessMap,e(h.sheenRoughnessMap,m.sheenRoughnessMapTransform))),h.clearcoat>0&&(m.clearcoat.value=h.clearcoat,m.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(m.clearcoatMap.value=h.clearcoatMap,e(h.clearcoatMap,m.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,e(h.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(m.clearcoatNormalMap.value=h.clearcoatNormalMap,e(h.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===qe&&m.clearcoatNormalScale.value.negate())),h.dispersion>0&&(m.dispersion.value=h.dispersion),h.iridescence>0&&(m.iridescence.value=h.iridescence,m.iridescenceIOR.value=h.iridescenceIOR,m.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(m.iridescenceMap.value=h.iridescenceMap,e(h.iridescenceMap,m.iridescenceMapTransform)),h.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=h.iridescenceThicknessMap,e(h.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),h.transmission>0&&(m.transmission.value=h.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),h.transmissionMap&&(m.transmissionMap.value=h.transmissionMap,e(h.transmissionMap,m.transmissionMapTransform)),m.thickness.value=h.thickness,h.thicknessMap&&(m.thicknessMap.value=h.thicknessMap,e(h.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=h.attenuationDistance,m.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(m.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(m.anisotropyMap.value=h.anisotropyMap,e(h.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=h.specularIntensity,m.specularColor.value.copy(h.specularColor),h.specularColorMap&&(m.specularColorMap.value=h.specularColorMap,e(h.specularColorMap,m.specularColorMapTransform)),h.specularIntensityMap&&(m.specularIntensityMap.value=h.specularIntensityMap,e(h.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,h){h.matcap&&(m.matcap.value=h.matcap)}function y(m,h){const S=t.get(h).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function jx(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,M){const b=M.program;n.uniformBlockBinding(S,b)}function l(S,M){let b=s[S.id];b===void 0&&(g(S),b=d(S),s[S.id]=b,S.addEventListener("dispose",m));const E=M.program;n.updateUBOMapping(S,E);const T=t.render.frame;r[S.id]!==T&&(f(S),r[S.id]=T)}function d(S){const M=u();S.__bindingPointIndex=M;const b=i.createBuffer(),E=S.__size,T=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,E,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,b),b}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return Pe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){const M=s[S.id],b=S.uniforms,E=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let T=0,P=b.length;T<P;T++){const C=Array.isArray(b[T])?b[T]:[b[T]];for(let w=0,v=C.length;w<v;w++){const A=C[w];if(p(A,T,w,E)===!0){const I=A.__offset,z=Array.isArray(A.value)?A.value:[A.value];let H=0;for(let W=0;W<z.length;W++){const Y=z[W],st=y(Y);typeof Y=="number"||typeof Y=="boolean"?(A.__data[0]=Y,i.bufferSubData(i.UNIFORM_BUFFER,I+H,A.__data)):Y.isMatrix3?(A.__data[0]=Y.elements[0],A.__data[1]=Y.elements[1],A.__data[2]=Y.elements[2],A.__data[3]=0,A.__data[4]=Y.elements[3],A.__data[5]=Y.elements[4],A.__data[6]=Y.elements[5],A.__data[7]=0,A.__data[8]=Y.elements[6],A.__data[9]=Y.elements[7],A.__data[10]=Y.elements[8],A.__data[11]=0):(Y.toArray(A.__data,H),H+=st.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(S,M,b,E){const T=S.value,P=M+"_"+b;if(E[P]===void 0)return typeof T=="number"||typeof T=="boolean"?E[P]=T:E[P]=T.clone(),!0;{const C=E[P];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return E[P]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(S){const M=S.uniforms;let b=0;const E=16;for(let P=0,C=M.length;P<C;P++){const w=Array.isArray(M[P])?M[P]:[M[P]];for(let v=0,A=w.length;v<A;v++){const I=w[v],z=Array.isArray(I.value)?I.value:[I.value];for(let H=0,W=z.length;H<W;H++){const Y=z[H],st=y(Y),K=b%E,ut=K%st.boundary,ft=K+ut;b+=ut,ft!==0&&E-ft<st.storage&&(b+=E-ft),I.__data=new Float32Array(st.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=b,b+=st.storage}}}const T=b%E;return T>0&&(b+=E-T),S.__size=b,S.__cache={},this}function y(S){const M={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(M.boundary=4,M.storage=4):S.isVector2?(M.boundary=8,M.storage=8):S.isVector3||S.isColor?(M.boundary=16,M.storage=12):S.isVector4?(M.boundary=16,M.storage=16):S.isMatrix3?(M.boundary=48,M.storage=48):S.isMatrix4?(M.boundary=64,M.storage=64):S.isTexture?Gt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Gt("WebGLRenderer: Unsupported uniform value type.",S),M}function m(S){const M=S.target;M.removeEventListener("dispose",m);const b=a.indexOf(M.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function h(){for(const S in s)i.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:c,update:l,dispose:h}}const Qx=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let Hn=null;function tg(){return Hn===null&&(Hn=new fh(Qx,32,32,zo,Un),Hn.minFilter=xn,Hn.magFilter=xn,Hn.wrapS=qn,Hn.wrapT=qn,Hn.generateMipmaps=!1,Hn.needsUpdate=!0),Hn}class eg{constructor(t={}){const{canvas:e=Fd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=new Set([Vo,ko,Bo]),y=new Set([Nn,Ai,Bs,zs,No,Fo]),m=new Uint32Array(4),h=new Int32Array(4);let S=null,M=null;const b=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=li,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let P=!1;this._outputColorSpace=Se;let C=0,w=0,v=null,A=-1,I=null;const z=new ve,H=new ve;let W=null;const Y=new kt(0);let st=0,K=e.width,ut=e.height,ft=1,Ct=null,Zt=null;const ie=new ve(0,0,K,ut),fe=new ve(0,0,K,ut);let se=!1;const et=new Zo;let at=!1,bt=!1;const Ht=new ue,Rt=new U,Kt=new ve,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let $t=!1;function pe(){return v===null?ft:1}let F=n;function Wt(R,k){return e.getContext(R,k)}try{const R={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Lo}`),e.addEventListener("webglcontextlost",ot,!1),e.addEventListener("webglcontextrestored",it,!1),e.addEventListener("webglcontextcreationerror",yt,!1),F===null){const k="webgl2";if(F=Wt(k,R),F===null)throw Wt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw R("WebGLRenderer: "+R.message),R}let Xt,ne,Tt,be,Pt,Vt,D,_,L,O,V,B,j,Q,pt,lt,$,rt,St,vt,nt,At,N,dt;function ct(){Xt=new lm(F),Xt.init(),At=new Xx(F,Xt),ne=new tm(F,Xt,t,At),Tt=new Hx(F,Xt),ne.reversedDepthBuffer&&f&&Tt.buffers.depth.setReversed(!0),be=new um(F),Pt=new Px,Vt=new Wx(F,Xt,Tt,Pt,ne,At,be),D=new nm(T),_=new cm(T),L=new xf(F),N=new jp(F,L),O=new hm(F,L,be,N),V=new pm(F,O,L,be),St=new fm(F,ne,Vt),lt=new em(Pt),B=new Rx(T,D,_,Xt,ne,N,lt),j=new Jx(T,Pt),Q=new Dx,pt=new Bx(Xt),rt=new Jp(T,D,_,Tt,V,p,c),$=new Vx(T,V,ne),dt=new jx(F,be,ne,Tt),vt=new Qp(F,Xt,be),nt=new dm(F,Xt,be),be.programs=B.programs,T.capabilities=ne,T.extensions=Xt,T.properties=Pt,T.renderLists=Q,T.shadowMap=$,T.state=Tt,T.info=be}ct();const ht=new $x(T,F);this.xr=ht,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const R=Xt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=Xt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return ft},this.setPixelRatio=function(R){R!==void 0&&(ft=R,this.setSize(K,ut,!1))},this.getSize=function(R){return R.set(K,ut)},this.setSize=function(R,k,q=!0){if(ht.isPresenting){Gt("WebGLRenderer: Can't change size while VR device is presenting.");return}K=R,ut=k,e.width=Math.floor(R*ft),e.height=Math.floor(k*ft),q===!0&&(e.style.width=R+"px",e.style.height=k+"px"),this.setViewport(0,0,R,k)},this.getDrawingBufferSize=function(R){return R.set(K*ft,ut*ft).floor()},this.setDrawingBufferSize=function(R,k,q){K=R,ut=k,ft=q,e.width=Math.floor(R*q),e.height=Math.floor(k*q),this.setViewport(0,0,R,k)},this.getCurrentViewport=function(R){return R.copy(z)},this.getViewport=function(R){return R.copy(ie)},this.setViewport=function(R,k,q,Z){R.isVector4?ie.set(R.x,R.y,R.z,R.w):ie.set(R,k,q,Z),Tt.viewport(z.copy(ie).multiplyScalar(ft).round())},this.getScissor=function(R){return R.copy(fe)},this.setScissor=function(R,k,q,Z){R.isVector4?fe.set(R.x,R.y,R.z,R.w):fe.set(R,k,q,Z),Tt.scissor(H.copy(fe).multiplyScalar(ft).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(R){Tt.setScissorTest(se=R)},this.setOpaqueSort=function(R){Ct=R},this.setTransparentSort=function(R){Zt=R},this.getClearColor=function(R){return R.copy(rt.getClearColor())},this.setClearColor=function(){rt.setClearColor(...arguments)},this.getClearAlpha=function(){return rt.getClearAlpha()},this.setClearAlpha=function(){rt.setClearAlpha(...arguments)},this.clear=function(R=!0,k=!0,q=!0){let Z=0;if(R){let G=!1;if(v!==null){const mt=v.texture.format;G=g.has(mt)}if(G){const mt=v.texture.type,Mt=y.has(mt),Et=rt.getClearColor(),wt=rt.getClearAlpha(),Ot=Et.r,Bt=Et.g,Dt=Et.b;Mt?(m[0]=Ot,m[1]=Bt,m[2]=Dt,m[3]=wt,F.clearBufferuiv(F.COLOR,0,m)):(h[0]=Ot,h[1]=Bt,h[2]=Dt,h[3]=wt,F.clearBufferiv(F.COLOR,0,h))}else Z|=F.COLOR_BUFFER_BIT}k&&(Z|=F.DEPTH_BUFFER_BIT),q&&(Z|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ot,!1),e.removeEventListener("webglcontextrestored",it,!1),e.removeEventListener("webglcontextcreationerror",yt,!1),rt.dispose(),Q.dispose(),pt.dispose(),Pt.dispose(),D.dispose(),_.dispose(),V.dispose(),N.dispose(),dt.dispose(),B.dispose(),ht.dispose(),ht.removeEventListener("sessionstart",an),ht.removeEventListener("sessionend",On),en.stop()};function ot(R){R.preventDefault(),Sc("WebGLRenderer: Context Lost."),P=!0}function it(){Sc("WebGLRenderer: Context Restored."),P=!1;const R=be.autoReset,k=$.enabled,q=$.autoUpdate,Z=$.needsUpdate,G=$.type;ct(),be.autoReset=R,$.enabled=k,$.autoUpdate=q,$.needsUpdate=Z,$.type=G}function yt(R){Pe("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Ft(R){const k=R.target;k.removeEventListener("dispose",Ft),de(k)}function de(R){ae(R),Pt.remove(R)}function ae(R){const k=Pt.get(R).programs;k!==void 0&&(k.forEach(function(q){B.releaseProgram(q)}),R.isShaderMaterial&&B.releaseShaderCache(R))}this.renderBufferDirect=function(R,k,q,Z,G,mt){k===null&&(k=Ne);const Mt=G.isMesh&&G.matrixWorld.determinant()<0,Et=Jh(R,k,q,Z,G);Tt.setMaterial(Z,Mt);let wt=q.index,Ot=1;if(Z.wireframe===!0){if(wt=O.getWireframeAttribute(q),wt===void 0)return;Ot=2}const Bt=q.drawRange,Dt=q.attributes.position;let te=Bt.start*Ot,_e=(Bt.start+Bt.count)*Ot;mt!==null&&(te=Math.max(te,mt.start*Ot),_e=Math.min(_e,(mt.start+mt.count)*Ot)),wt!==null?(te=Math.max(te,0),_e=Math.min(_e,wt.count)):Dt!=null&&(te=Math.max(te,0),_e=Math.min(_e,Dt.count));const Ce=_e-te;if(Ce<0||Ce===1/0)return;N.setup(G,Z,Et,q,wt);let Re,Me=vt;if(wt!==null&&(Re=L.get(wt),Me=nt,Me.setIndex(Re)),G.isMesh)Z.wireframe===!0?(Tt.setLineWidth(Z.wireframeLinewidth*pe()),Me.setMode(F.LINES)):Me.setMode(F.TRIANGLES);else if(G.isLine){let Ut=Z.linewidth;Ut===void 0&&(Ut=1),Tt.setLineWidth(Ut*pe()),G.isLineSegments?Me.setMode(F.LINES):G.isLineLoop?Me.setMode(F.LINE_LOOP):Me.setMode(F.LINE_STRIP)}else G.isPoints?Me.setMode(F.POINTS):G.isSprite&&Me.setMode(F.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Gs("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Me.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(Xt.get("WEBGL_multi_draw"))Me.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Ut=G._multiDrawStarts,Te=G._multiDrawCounts,ce=G._multiDrawCount,on=wt?L.get(wt).bytesPerElement:1,Ii=Pt.get(Z).currentProgram.getUniforms();for(let cn=0;cn<ce;cn++)Ii.setValue(F,"_gl_DrawID",cn),Me.render(Ut[cn]/on,Te[cn])}else if(G.isInstancedMesh)Me.renderInstances(te,Ce,G.count);else if(q.isInstancedBufferGeometry){const Ut=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Te=Math.min(q.instanceCount,Ut);Me.renderInstances(te,Ce,Te)}else Me.render(te,Ce)};function ze(R,k,q){R.transparent===!0&&R.side===me&&R.forceSinglePass===!1?(R.side=qe,R.needsUpdate=!0,Js(R,k,q),R.side=hi,R.needsUpdate=!0,Js(R,k,q),R.side=me):Js(R,k,q)}this.compile=function(R,k,q=null){q===null&&(q=R),M=pt.get(q),M.init(k),E.push(M),q.traverseVisible(function(G){G.isLight&&G.layers.test(k.layers)&&(M.pushLight(G),G.castShadow&&M.pushShadow(G))}),R!==q&&R.traverseVisible(function(G){G.isLight&&G.layers.test(k.layers)&&(M.pushLight(G),G.castShadow&&M.pushShadow(G))}),M.setupLights();const Z=new Set;return R.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const mt=G.material;if(mt)if(Array.isArray(mt))for(let Mt=0;Mt<mt.length;Mt++){const Et=mt[Mt];ze(Et,q,G),Z.add(Et)}else ze(mt,q,G),Z.add(mt)}),M=E.pop(),Z},this.compileAsync=function(R,k,q=null){const Z=this.compile(R,k,q);return new Promise(G=>{function mt(){if(Z.forEach(function(Mt){Pt.get(Mt).currentProgram.isReady()&&Z.delete(Mt)}),Z.size===0){G(R);return}setTimeout(mt,10)}Xt.get("KHR_parallel_shader_compile")!==null?mt():setTimeout(mt,10)})};let Fe=null;function tn(R){Fe&&Fe(R)}function an(){en.stop()}function On(){en.start()}const en=new Ch;en.setAnimationLoop(tn),typeof self<"u"&&en.setContext(self),this.setAnimationLoop=function(R){Fe=R,ht.setAnimationLoop(R),R===null?en.stop():en.start()},ht.addEventListener("sessionstart",an),ht.addEventListener("sessionend",On),this.render=function(R,k){if(k!==void 0&&k.isCamera!==!0){Pe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),ht.enabled===!0&&ht.isPresenting===!0&&(ht.cameraAutoUpdate===!0&&ht.updateCamera(k),k=ht.getCamera()),R.isScene===!0&&R.onBeforeRender(T,R,k,v),M=pt.get(R,E.length),M.init(k),E.push(M),Ht.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),et.setFromProjectionMatrix(Ht,Dn,k.reversedDepth),bt=this.localClippingEnabled,at=lt.init(this.clippingPlanes,bt),S=Q.get(R,b.length),S.init(),b.push(S),ht.enabled===!0&&ht.isPresenting===!0){const mt=T.xr.getDepthSensingMesh();mt!==null&&jn(mt,k,-1/0,T.sortObjects)}jn(R,k,0,T.sortObjects),S.finish(),T.sortObjects===!0&&S.sort(Ct,Zt),$t=ht.enabled===!1||ht.isPresenting===!1||ht.hasDepthSensing()===!1,$t&&rt.addToRenderList(S,R),this.info.render.frame++,at===!0&&lt.beginShadows();const q=M.state.shadowsArray;$.render(q,R,k),at===!0&&lt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Z=S.opaque,G=S.transmissive;if(M.setupLights(),k.isArrayCamera){const mt=k.cameras;if(G.length>0)for(let Mt=0,Et=mt.length;Mt<Et;Mt++){const wt=mt[Mt];hc(Z,G,R,wt)}$t&&rt.render(R);for(let Mt=0,Et=mt.length;Mt<Et;Mt++){const wt=mt[Mt];lc(S,R,wt,wt.viewport)}}else G.length>0&&hc(Z,G,R,k),$t&&rt.render(R),lc(S,R,k);v!==null&&w===0&&(Vt.updateMultisampleRenderTarget(v),Vt.updateRenderTargetMipmap(v)),R.isScene===!0&&R.onAfterRender(T,R,k),N.resetDefaultState(),A=-1,I=null,E.pop(),E.length>0?(M=E[E.length-1],at===!0&&lt.setGlobalState(T.clippingPlanes,M.state.camera)):M=null,b.pop(),b.length>0?S=b[b.length-1]:S=null};function jn(R,k,q,Z){if(R.visible===!1)return;if(R.layers.test(k.layers)){if(R.isGroup)q=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(k);else if(R.isLight)M.pushLight(R),R.castShadow&&M.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||et.intersectsSprite(R)){Z&&Kt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(Ht);const Mt=V.update(R),Et=R.material;Et.visible&&S.push(R,Mt,Et,q,Kt.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||et.intersectsObject(R))){const Mt=V.update(R),Et=R.material;if(Z&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Kt.copy(R.boundingSphere.center)):(Mt.boundingSphere===null&&Mt.computeBoundingSphere(),Kt.copy(Mt.boundingSphere.center)),Kt.applyMatrix4(R.matrixWorld).applyMatrix4(Ht)),Array.isArray(Et)){const wt=Mt.groups;for(let Ot=0,Bt=wt.length;Ot<Bt;Ot++){const Dt=wt[Ot],te=Et[Dt.materialIndex];te&&te.visible&&S.push(R,Mt,te,q,Kt.z,Dt)}}else Et.visible&&S.push(R,Mt,Et,q,Kt.z,null)}}const mt=R.children;for(let Mt=0,Et=mt.length;Mt<Et;Mt++)jn(mt[Mt],k,q,Z)}function lc(R,k,q,Z){const{opaque:G,transmissive:mt,transparent:Mt}=R;M.setupLightsView(q),at===!0&&lt.setGlobalState(T.clippingPlanes,q),Z&&Tt.viewport(z.copy(Z)),G.length>0&&Ks(G,k,q),mt.length>0&&Ks(mt,k,q),Mt.length>0&&Ks(Mt,k,q),Tt.buffers.depth.setTest(!0),Tt.buffers.depth.setMask(!0),Tt.buffers.color.setMask(!0),Tt.setPolygonOffset(!1)}function hc(R,k,q,Z){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;M.state.transmissionRenderTarget[Z.id]===void 0&&(M.state.transmissionRenderTarget[Z.id]=new Tn(1,1,{generateMipmaps:!0,type:Xt.has("EXT_color_buffer_half_float")||Xt.has("EXT_color_buffer_float")?Un:Nn,minFilter:bi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:oe.workingColorSpace}));const mt=M.state.transmissionRenderTarget[Z.id],Mt=Z.viewport||z;mt.setSize(Mt.z*T.transmissionResolutionScale,Mt.w*T.transmissionResolutionScale);const Et=T.getRenderTarget(),wt=T.getActiveCubeFace(),Ot=T.getActiveMipmapLevel();T.setRenderTarget(mt),T.getClearColor(Y),st=T.getClearAlpha(),st<1&&T.setClearColor(16777215,.5),T.clear(),$t&&rt.render(q);const Bt=T.toneMapping;T.toneMapping=li;const Dt=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),M.setupLightsView(Z),at===!0&&lt.setGlobalState(T.clippingPlanes,Z),Ks(R,q,Z),Vt.updateMultisampleRenderTarget(mt),Vt.updateRenderTargetMipmap(mt),Xt.has("WEBGL_multisampled_render_to_texture")===!1){let te=!1;for(let _e=0,Ce=k.length;_e<Ce;_e++){const Re=k[_e],{object:Me,geometry:Ut,material:Te,group:ce}=Re;if(Te.side===me&&Me.layers.test(Z.layers)){const on=Te.side;Te.side=qe,Te.needsUpdate=!0,dc(Me,q,Z,Ut,Te,ce),Te.side=on,Te.needsUpdate=!0,te=!0}}te===!0&&(Vt.updateMultisampleRenderTarget(mt),Vt.updateRenderTargetMipmap(mt))}T.setRenderTarget(Et,wt,Ot),T.setClearColor(Y,st),Dt!==void 0&&(Z.viewport=Dt),T.toneMapping=Bt}function Ks(R,k,q){const Z=k.isScene===!0?k.overrideMaterial:null;for(let G=0,mt=R.length;G<mt;G++){const Mt=R[G],{object:Et,geometry:wt,group:Ot}=Mt;let Bt=Mt.material;Bt.allowOverride===!0&&Z!==null&&(Bt=Z),Et.layers.test(q.layers)&&dc(Et,k,q,wt,Bt,Ot)}}function dc(R,k,q,Z,G,mt){R.onBeforeRender(T,k,q,Z,G,mt),R.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),G.onBeforeRender(T,k,q,Z,R,mt),G.transparent===!0&&G.side===me&&G.forceSinglePass===!1?(G.side=qe,G.needsUpdate=!0,T.renderBufferDirect(q,k,Z,G,R,mt),G.side=hi,G.needsUpdate=!0,T.renderBufferDirect(q,k,Z,G,R,mt),G.side=me):T.renderBufferDirect(q,k,Z,G,R,mt),R.onAfterRender(T,k,q,Z,G,mt)}function Js(R,k,q){k.isScene!==!0&&(k=Ne);const Z=Pt.get(R),G=M.state.lights,mt=M.state.shadowsArray,Mt=G.state.version,Et=B.getParameters(R,G.state,mt,k,q),wt=B.getProgramCacheKey(Et);let Ot=Z.programs;Z.environment=R.isMeshStandardMaterial?k.environment:null,Z.fog=k.fog,Z.envMap=(R.isMeshStandardMaterial?_:D).get(R.envMap||Z.environment),Z.envMapRotation=Z.environment!==null&&R.envMap===null?k.environmentRotation:R.envMapRotation,Ot===void 0&&(R.addEventListener("dispose",Ft),Ot=new Map,Z.programs=Ot);let Bt=Ot.get(wt);if(Bt!==void 0){if(Z.currentProgram===Bt&&Z.lightsStateVersion===Mt)return fc(R,Et),Bt}else Et.uniforms=B.getUniforms(R),R.onBeforeCompile(Et,T),Bt=B.acquireProgram(Et,wt),Ot.set(wt,Bt),Z.uniforms=Et.uniforms;const Dt=Z.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Dt.clippingPlanes=lt.uniform),fc(R,Et),Z.needsLights=Qh(R),Z.lightsStateVersion=Mt,Z.needsLights&&(Dt.ambientLightColor.value=G.state.ambient,Dt.lightProbe.value=G.state.probe,Dt.directionalLights.value=G.state.directional,Dt.directionalLightShadows.value=G.state.directionalShadow,Dt.spotLights.value=G.state.spot,Dt.spotLightShadows.value=G.state.spotShadow,Dt.rectAreaLights.value=G.state.rectArea,Dt.ltc_1.value=G.state.rectAreaLTC1,Dt.ltc_2.value=G.state.rectAreaLTC2,Dt.pointLights.value=G.state.point,Dt.pointLightShadows.value=G.state.pointShadow,Dt.hemisphereLights.value=G.state.hemi,Dt.directionalShadowMap.value=G.state.directionalShadowMap,Dt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Dt.spotShadowMap.value=G.state.spotShadowMap,Dt.spotLightMatrix.value=G.state.spotLightMatrix,Dt.spotLightMap.value=G.state.spotLightMap,Dt.pointShadowMap.value=G.state.pointShadowMap,Dt.pointShadowMatrix.value=G.state.pointShadowMatrix),Z.currentProgram=Bt,Z.uniformsList=null,Bt}function uc(R){if(R.uniformsList===null){const k=R.currentProgram.getUniforms();R.uniformsList=Lr.seqWithValue(k.seq,R.uniforms)}return R.uniformsList}function fc(R,k){const q=Pt.get(R);q.outputColorSpace=k.outputColorSpace,q.batching=k.batching,q.batchingColor=k.batchingColor,q.instancing=k.instancing,q.instancingColor=k.instancingColor,q.instancingMorph=k.instancingMorph,q.skinning=k.skinning,q.morphTargets=k.morphTargets,q.morphNormals=k.morphNormals,q.morphColors=k.morphColors,q.morphTargetsCount=k.morphTargetsCount,q.numClippingPlanes=k.numClippingPlanes,q.numIntersection=k.numClipIntersection,q.vertexAlphas=k.vertexAlphas,q.vertexTangents=k.vertexTangents,q.toneMapping=k.toneMapping}function Jh(R,k,q,Z,G){k.isScene!==!0&&(k=Ne),Vt.resetTextureUnits();const mt=k.fog,Mt=Z.isMeshStandardMaterial?k.environment:null,Et=v===null?T.outputColorSpace:v.isXRRenderTarget===!0?v.texture.colorSpace:rs,wt=(Z.isMeshStandardMaterial?_:D).get(Z.envMap||Mt),Ot=Z.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Bt=!!q.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Dt=!!q.morphAttributes.position,te=!!q.morphAttributes.normal,_e=!!q.morphAttributes.color;let Ce=li;Z.toneMapped&&(v===null||v.isXRRenderTarget===!0)&&(Ce=T.toneMapping);const Re=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Me=Re!==void 0?Re.length:0,Ut=Pt.get(Z),Te=M.state.lights;if(at===!0&&(bt===!0||R!==I)){const $e=R===I&&Z.id===A;lt.setState(Z,R,$e)}let ce=!1;Z.version===Ut.__version?(Ut.needsLights&&Ut.lightsStateVersion!==Te.state.version||Ut.outputColorSpace!==Et||G.isBatchedMesh&&Ut.batching===!1||!G.isBatchedMesh&&Ut.batching===!0||G.isBatchedMesh&&Ut.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Ut.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Ut.instancing===!1||!G.isInstancedMesh&&Ut.instancing===!0||G.isSkinnedMesh&&Ut.skinning===!1||!G.isSkinnedMesh&&Ut.skinning===!0||G.isInstancedMesh&&Ut.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ut.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ut.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ut.instancingMorph===!1&&G.morphTexture!==null||Ut.envMap!==wt||Z.fog===!0&&Ut.fog!==mt||Ut.numClippingPlanes!==void 0&&(Ut.numClippingPlanes!==lt.numPlanes||Ut.numIntersection!==lt.numIntersection)||Ut.vertexAlphas!==Ot||Ut.vertexTangents!==Bt||Ut.morphTargets!==Dt||Ut.morphNormals!==te||Ut.morphColors!==_e||Ut.toneMapping!==Ce||Ut.morphTargetsCount!==Me)&&(ce=!0):(ce=!0,Ut.__version=Z.version);let on=Ut.currentProgram;ce===!0&&(on=Js(Z,k,G));let Ii=!1,cn=!1,ms=!1;const Ee=on.getUniforms(),nn=Ut.uniforms;if(Tt.useProgram(on.program)&&(Ii=!0,cn=!0,ms=!0),Z.id!==A&&(A=Z.id,cn=!0),Ii||I!==R){Tt.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Ee.setValue(F,"projectionMatrix",R.projectionMatrix),Ee.setValue(F,"viewMatrix",R.matrixWorldInverse);const sn=Ee.map.cameraPosition;sn!==void 0&&sn.setValue(F,Rt.setFromMatrixPosition(R.matrixWorld)),ne.logarithmicDepthBuffer&&Ee.setValue(F,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&Ee.setValue(F,"isOrthographic",R.isOrthographicCamera===!0),I!==R&&(I=R,cn=!0,ms=!0)}if(G.isSkinnedMesh){Ee.setOptional(F,G,"bindMatrix"),Ee.setOptional(F,G,"bindMatrixInverse");const $e=G.skeleton;$e&&($e.boneTexture===null&&$e.computeBoneTexture(),Ee.setValue(F,"boneTexture",$e.boneTexture,Vt))}G.isBatchedMesh&&(Ee.setOptional(F,G,"batchingTexture"),Ee.setValue(F,"batchingTexture",G._matricesTexture,Vt),Ee.setOptional(F,G,"batchingIdTexture"),Ee.setValue(F,"batchingIdTexture",G._indirectTexture,Vt),Ee.setOptional(F,G,"batchingColorTexture"),G._colorsTexture!==null&&Ee.setValue(F,"batchingColorTexture",G._colorsTexture,Vt));const fn=q.morphAttributes;if((fn.position!==void 0||fn.normal!==void 0||fn.color!==void 0)&&St.update(G,q,on),(cn||Ut.receiveShadow!==G.receiveShadow)&&(Ut.receiveShadow=G.receiveShadow,Ee.setValue(F,"receiveShadow",G.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&(nn.envMap.value=wt,nn.flipEnvMap.value=wt.isCubeTexture&&wt.isRenderTargetTexture===!1?-1:1),Z.isMeshStandardMaterial&&Z.envMap===null&&k.environment!==null&&(nn.envMapIntensity.value=k.environmentIntensity),nn.dfgLUT!==void 0&&(nn.dfgLUT.value=tg()),cn&&(Ee.setValue(F,"toneMappingExposure",T.toneMappingExposure),Ut.needsLights&&jh(nn,ms),mt&&Z.fog===!0&&j.refreshFogUniforms(nn,mt),j.refreshMaterialUniforms(nn,Z,ft,ut,M.state.transmissionRenderTarget[R.id]),Lr.upload(F,uc(Ut),nn,Vt)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(Lr.upload(F,uc(Ut),nn,Vt),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&Ee.setValue(F,"center",G.center),Ee.setValue(F,"modelViewMatrix",G.modelViewMatrix),Ee.setValue(F,"normalMatrix",G.normalMatrix),Ee.setValue(F,"modelMatrix",G.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){const $e=Z.uniformsGroups;for(let sn=0,Kr=$e.length;sn<Kr;sn++){const di=$e[sn];dt.update(di,on),dt.bind(di,on)}}return on}function jh(R,k){R.ambientLightColor.needsUpdate=k,R.lightProbe.needsUpdate=k,R.directionalLights.needsUpdate=k,R.directionalLightShadows.needsUpdate=k,R.pointLights.needsUpdate=k,R.pointLightShadows.needsUpdate=k,R.spotLights.needsUpdate=k,R.spotLightShadows.needsUpdate=k,R.rectAreaLights.needsUpdate=k,R.hemisphereLights.needsUpdate=k}function Qh(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return v},this.setRenderTargetTextures=function(R,k,q){const Z=Pt.get(R);Z.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,Z.__autoAllocateDepthBuffer===!1&&(Z.__useRenderToTexture=!1),Pt.get(R.texture).__webglTexture=k,Pt.get(R.depthTexture).__webglTexture=Z.__autoAllocateDepthBuffer?void 0:q,Z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,k){const q=Pt.get(R);q.__webglFramebuffer=k,q.__useDefaultFramebuffer=k===void 0};const td=F.createFramebuffer();this.setRenderTarget=function(R,k=0,q=0){v=R,C=k,w=q;let Z=!0,G=null,mt=!1,Mt=!1;if(R){const wt=Pt.get(R);if(wt.__useDefaultFramebuffer!==void 0)Tt.bindFramebuffer(F.FRAMEBUFFER,null),Z=!1;else if(wt.__webglFramebuffer===void 0)Vt.setupRenderTarget(R);else if(wt.__hasExternalTextures)Vt.rebindTextures(R,Pt.get(R.texture).__webglTexture,Pt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Dt=R.depthTexture;if(wt.__boundDepthTexture!==Dt){if(Dt!==null&&Pt.has(Dt)&&(R.width!==Dt.image.width||R.height!==Dt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Vt.setupDepthRenderbuffer(R)}}const Ot=R.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(Mt=!0);const Bt=Pt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Bt[k])?G=Bt[k][q]:G=Bt[k],mt=!0):R.samples>0&&Vt.useMultisampledRTT(R)===!1?G=Pt.get(R).__webglMultisampledFramebuffer:Array.isArray(Bt)?G=Bt[q]:G=Bt,z.copy(R.viewport),H.copy(R.scissor),W=R.scissorTest}else z.copy(ie).multiplyScalar(ft).floor(),H.copy(fe).multiplyScalar(ft).floor(),W=se;if(q!==0&&(G=td),Tt.bindFramebuffer(F.FRAMEBUFFER,G)&&Z&&Tt.drawBuffers(R,G),Tt.viewport(z),Tt.scissor(H),Tt.setScissorTest(W),mt){const wt=Pt.get(R.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+k,wt.__webglTexture,q)}else if(Mt){const wt=k;for(let Ot=0;Ot<R.textures.length;Ot++){const Bt=Pt.get(R.textures[Ot]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Ot,Bt.__webglTexture,q,wt)}}else if(R!==null&&q!==0){const wt=Pt.get(R.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,wt.__webglTexture,q)}A=-1},this.readRenderTargetPixels=function(R,k,q,Z,G,mt,Mt,Et=0){if(!(R&&R.isWebGLRenderTarget)){Pe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let wt=Pt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Mt!==void 0&&(wt=wt[Mt]),wt){Tt.bindFramebuffer(F.FRAMEBUFFER,wt);try{const Ot=R.textures[Et],Bt=Ot.format,Dt=Ot.type;if(!ne.textureFormatReadable(Bt)){Pe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ne.textureTypeReadable(Dt)){Pe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=R.width-Z&&q>=0&&q<=R.height-G&&(R.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Et),F.readPixels(k,q,Z,G,At.convert(Bt),At.convert(Dt),mt))}finally{const Ot=v!==null?Pt.get(v).__webglFramebuffer:null;Tt.bindFramebuffer(F.FRAMEBUFFER,Ot)}}},this.readRenderTargetPixelsAsync=async function(R,k,q,Z,G,mt,Mt,Et=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let wt=Pt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Mt!==void 0&&(wt=wt[Mt]),wt)if(k>=0&&k<=R.width-Z&&q>=0&&q<=R.height-G){Tt.bindFramebuffer(F.FRAMEBUFFER,wt);const Ot=R.textures[Et],Bt=Ot.format,Dt=Ot.type;if(!ne.textureFormatReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ne.textureTypeReadable(Dt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const te=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,te),F.bufferData(F.PIXEL_PACK_BUFFER,mt.byteLength,F.STREAM_READ),R.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Et),F.readPixels(k,q,Z,G,At.convert(Bt),At.convert(Dt),0);const _e=v!==null?Pt.get(v).__webglFramebuffer:null;Tt.bindFramebuffer(F.FRAMEBUFFER,_e);const Ce=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Od(F,Ce,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,te),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,mt),F.deleteBuffer(te),F.deleteSync(Ce),mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,k=null,q=0){const Z=Math.pow(2,-q),G=Math.floor(R.image.width*Z),mt=Math.floor(R.image.height*Z),Mt=k!==null?k.x:0,Et=k!==null?k.y:0;Vt.setTexture2D(R,0),F.copyTexSubImage2D(F.TEXTURE_2D,q,0,0,Mt,Et,G,mt),Tt.unbindTexture()};const ed=F.createFramebuffer(),nd=F.createFramebuffer();this.copyTextureToTexture=function(R,k,q=null,Z=null,G=0,mt=null){mt===null&&(G!==0?(Gs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),mt=G,G=0):mt=0);let Mt,Et,wt,Ot,Bt,Dt,te,_e,Ce;const Re=R.isCompressedTexture?R.mipmaps[mt]:R.image;if(q!==null)Mt=q.max.x-q.min.x,Et=q.max.y-q.min.y,wt=q.isBox3?q.max.z-q.min.z:1,Ot=q.min.x,Bt=q.min.y,Dt=q.isBox3?q.min.z:0;else{const fn=Math.pow(2,-G);Mt=Math.floor(Re.width*fn),Et=Math.floor(Re.height*fn),R.isDataArrayTexture?wt=Re.depth:R.isData3DTexture?wt=Math.floor(Re.depth*fn):wt=1,Ot=0,Bt=0,Dt=0}Z!==null?(te=Z.x,_e=Z.y,Ce=Z.z):(te=0,_e=0,Ce=0);const Me=At.convert(k.format),Ut=At.convert(k.type);let Te;k.isData3DTexture?(Vt.setTexture3D(k,0),Te=F.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(Vt.setTexture2DArray(k,0),Te=F.TEXTURE_2D_ARRAY):(Vt.setTexture2D(k,0),Te=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,k.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,k.unpackAlignment);const ce=F.getParameter(F.UNPACK_ROW_LENGTH),on=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Ii=F.getParameter(F.UNPACK_SKIP_PIXELS),cn=F.getParameter(F.UNPACK_SKIP_ROWS),ms=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,Re.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Re.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ot),F.pixelStorei(F.UNPACK_SKIP_ROWS,Bt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Dt);const Ee=R.isDataArrayTexture||R.isData3DTexture,nn=k.isDataArrayTexture||k.isData3DTexture;if(R.isDepthTexture){const fn=Pt.get(R),$e=Pt.get(k),sn=Pt.get(fn.__renderTarget),Kr=Pt.get($e.__renderTarget);Tt.bindFramebuffer(F.READ_FRAMEBUFFER,sn.__webglFramebuffer),Tt.bindFramebuffer(F.DRAW_FRAMEBUFFER,Kr.__webglFramebuffer);for(let di=0;di<wt;di++)Ee&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Pt.get(R).__webglTexture,G,Dt+di),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Pt.get(k).__webglTexture,mt,Ce+di)),F.blitFramebuffer(Ot,Bt,Mt,Et,te,_e,Mt,Et,F.DEPTH_BUFFER_BIT,F.NEAREST);Tt.bindFramebuffer(F.READ_FRAMEBUFFER,null),Tt.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(G!==0||R.isRenderTargetTexture||Pt.has(R)){const fn=Pt.get(R),$e=Pt.get(k);Tt.bindFramebuffer(F.READ_FRAMEBUFFER,ed),Tt.bindFramebuffer(F.DRAW_FRAMEBUFFER,nd);for(let sn=0;sn<wt;sn++)Ee?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,fn.__webglTexture,G,Dt+sn):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,fn.__webglTexture,G),nn?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,$e.__webglTexture,mt,Ce+sn):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,$e.__webglTexture,mt),G!==0?F.blitFramebuffer(Ot,Bt,Mt,Et,te,_e,Mt,Et,F.COLOR_BUFFER_BIT,F.NEAREST):nn?F.copyTexSubImage3D(Te,mt,te,_e,Ce+sn,Ot,Bt,Mt,Et):F.copyTexSubImage2D(Te,mt,te,_e,Ot,Bt,Mt,Et);Tt.bindFramebuffer(F.READ_FRAMEBUFFER,null),Tt.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else nn?R.isDataTexture||R.isData3DTexture?F.texSubImage3D(Te,mt,te,_e,Ce,Mt,Et,wt,Me,Ut,Re.data):k.isCompressedArrayTexture?F.compressedTexSubImage3D(Te,mt,te,_e,Ce,Mt,Et,wt,Me,Re.data):F.texSubImage3D(Te,mt,te,_e,Ce,Mt,Et,wt,Me,Ut,Re):R.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,mt,te,_e,Mt,Et,Me,Ut,Re.data):R.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,mt,te,_e,Re.width,Re.height,Me,Re.data):F.texSubImage2D(F.TEXTURE_2D,mt,te,_e,Mt,Et,Me,Ut,Re);F.pixelStorei(F.UNPACK_ROW_LENGTH,ce),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,on),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ii),F.pixelStorei(F.UNPACK_SKIP_ROWS,cn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,ms),mt===0&&k.generateMipmaps&&F.generateMipmap(Te),Tt.unbindTexture()},this.initRenderTarget=function(R){Pt.get(R).__webglFramebuffer===void 0&&Vt.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?Vt.setTextureCube(R,0):R.isData3DTexture?Vt.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?Vt.setTexture2DArray(R,0):Vt.setTexture2D(R,0),Tt.unbindTexture()},this.resetState=function(){C=0,w=0,v=null,Tt.reset(),N.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=oe._getDrawingBufferColorSpace(t),e.unpackColorSpace=oe._getUnpackColorSpace()}}const Dr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class fs{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ng=new ec(-1,1,1,-1,0,1);class ig extends De{constructor(){super(),this.setAttribute("position",new re([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new re([0,2,0,0,2,0],2))}}const sg=new ig;class nc{constructor(t){this._mesh=new X(sg,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,ng)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Ih extends fs{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Xe?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Ws.clone(t.uniforms),this.material=new Xe({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new nc(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class El extends fs{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class rg extends fs{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class ag{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new xt);this._width=n.width,this._height=n.height,e=new Tn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Un}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ih(Dr),this.copyPass.material.blending=In,this.clock=new Ah}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}El!==void 0&&(a instanceof El?n=!0:a instanceof rg&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new xt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class og extends fs{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new kt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}const cg={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new kt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class cs extends fs{constructor(t,e=1,n,s){super(),this.strength=e,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new xt(t.x,t.y):new xt(256,256),this.clearColor=new kt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Tn(r,a,{type:Un}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new Tn(r,a,{type:Un});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new Tn(r,a,{type:Un});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=cg;this.highPassUniforms=Ws.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Xe({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new xt(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new U(1,1,1),new U(1,1,1),new U(1,1,1),new U(1,1,1),new U(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Ws.clone(Dr.uniforms),this.blendMaterial=new Xe({uniforms:this.copyUniforms,vertexShader:Dr.vertexShader,fragmentShader:Dr.fragmentShader,blending:Qi,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new kt,this._oldClearAlpha=1,this._basic=new we,this._fsQuad=new nc(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new xt(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=cs.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=cs.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){const e=[],n=t/3;for(let s=0;s<t;s++)e.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new Xe({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new xt(.5,.5)},direction:{value:new xt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(t){return new Xe({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}cs.BlurDirectionX=new xt(1,0);cs.BlurDirectionY=new xt(0,1);const wr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class lg extends fs{constructor(){super(),this.uniforms=Ws.clone(wr.uniforms),this.material=new af({name:wr.name,uniforms:this.uniforms,vertexShader:wr.vertexShader,fragmentShader:wr.fragmentShader}),this._fsQuad=new nc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},oe.getTransfer(this._outputColorSpace)===xe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Wl?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Xl?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ql?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Io?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Zl?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===$l?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Yl&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class hg extends uh{constructor(){super();const t=new Lt;t.deleteAttribute("uv");const e=new J({side:qe}),n=new J,s=new Eh(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new X(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new He(t,n,6),o=new Le;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const c=new X(t,$i(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const l=new X(t,$i(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);const d=new X(t,$i(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new X(t,$i(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const f=new X(t,$i(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);const p=new X(t,$i(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function $i(i){return new of({color:0,emissive:16777215,emissiveIntensity:i})}const $s=document.querySelector("#game"),Qe=new eg({canvas:$s,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});Qe.setPixelRatio(Math.min(window.devicePixelRatio,2));Qe.setSize(window.innerWidth,window.innerHeight);Qe.shadowMap.enabled=!0;Qe.shadowMap.type=Hl;Qe.outputColorSpace=Se;Qe.toneMapping=Io;Qe.toneMappingExposure=1.08;const zt=new uh;zt.background=new kt(5814015);zt.fog=new Yo(9293045,165,1380);const Uh=new Ao(Qe);Uh.compileEquirectangularShader();zt.environment=Uh.fromScene(new hg,.04).texture;zt.environmentIntensity=.62;const Jt=new dn(69,window.innerWidth/window.innerHeight,.08,1800);zt.add(Jt);const Nt={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const Qt=new Set,_t={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},dg=new Ah,We=new U(0,1,0),Nh=new U,Fh=new U,ic=new U,Mn=new Le,Ro=1.2,ug=.78,es=.55,Mi={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},ls=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],fg=Math.max(...ls.map(i=>i.width));let Ir=0,tt=ls[0];const x={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamPos:new U,best:Number(localStorage.getItem("steel-ribbon-best")||0)};Nt.best.textContent=`Best score ${x.best}`;function pg(i){const t=It.clamp(i,0,1);return t*t*(3-2*t)}function mg(i){let t=0;for(const e of tt.gaps){const n=e.start-e.approach,s=e.start+e.carry,r=e.end+e.settle;i>=n&&i<=s?t+=e.rise*It.clamp((i-n)/(e.approach+e.carry),0,1):i>s&&i<=e.end?t+=e.rise:i>e.end&&i<=r&&(t+=e.rise*(1-pg((i-e.end)/e.settle)))}return t}function Oh(i,t){const e=(t%i.length+i.length)%i.length,n=e/i.length*Math.PI*2,s=i.shape,r=Math.sin(n)*s.x1+Math.sin(n*2)*s.x2+Math.cos(n*3)*s.x3,a=Math.cos(n)*s.z1+Math.cos(n*2)*s.z2+Math.sin(n*3)*s.z3;return{x:r,z:a,t:n,n:e}}function Tr(i){const{x:t,z:e,t:n,n:s}=Oh(tt,i),r=tt.shape;let a=r.y0+Math.sin(n*2)*r.y2+Math.sin(n*3)*r.y3+Math.cos(n)*r.y1;for(const o of tt.ramps){const c=xg(s-o.s);a+=o.amp*Math.exp(-(c*c)/(o.width*o.width))}return a+=mg(s),new U(t,a,e)}function xg(i){return i>tt.length/2?i-tt.length:i<-tt.length/2?i+tt.length:i}function he(i){const t=(i%tt.length+tt.length)%tt.length,e=Tr(t),s=Tr(t+2).sub(e).normalize(),r=Nh.crossVectors(We,s).normalize(),a=Tr(t-2).y,o=Tr(t+2).y,c=Math.atan2(o-a,4),l=Math.sin(t*.012)*.18+Math.sin(t*.032)*.08,d=tt.gaps.find(u=>t>u.start&&t<u.end);return{s:t,p:e,tangent:s,side:r.clone(),grade:c,bank:l,gap:d}}function Ri(i){const t=(i%tt.length+tt.length)%tt.length;return tt.gaps.some(e=>t>e.start&&t<e.end)}function Al(i){return It.clamp(i/(tt.length*tt.laps),0,1)}function gg(i,t,e){const n=Math.floor(i/tt.length),s=Math.floor(t/tt.length);for(let r=n;r<=s;r++){const a=r*tt.length+e;if(i<a&&t>=a)return!0}return!1}function _g(i=256,t=8){const e=document.createElement("canvas");e.width=i,e.height=i;const n=e.getContext("2d"),s=i/t;for(let a=0;a<t;a++)for(let o=0;o<t;o++)n.fillStyle=(o+a)%2?"#101318":"#f5f1df",n.fillRect(o*s,a*s,s,s);const r=new rn(e);return r.colorSpace=Se,r.wrapS=Ze,r.wrapT=Ze,r.repeat.set(3,1),r}function vg(i=512){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,i,0);n.addColorStop(0,"#9c9b77"),n.addColorStop(.18,"#c9c69a"),n.addColorStop(.5,"#9f9f79"),n.addColorStop(.82,"#c0bd91"),n.addColorStop(1,"#858563"),e.fillStyle=n,e.fillRect(0,0,i,i),e.strokeStyle="rgba(38, 44, 36, 0.32)",e.lineWidth=2;for(let r=0;r<i;r+=64)e.beginPath(),e.moveTo(0,r+2),e.lineTo(i,r+2),e.stroke();e.strokeStyle="rgba(250, 242, 180, 0.22)",e.lineWidth=3;for(const r of[48,464])e.beginPath(),e.moveTo(r,0),e.lineTo(r,i),e.stroke();e.strokeStyle="rgba(28, 31, 30, 0.24)",e.lineWidth=3;for(let r=0;r<42;r++){const a=i*(.28+Math.random()*.44),o=Math.random()*i;e.beginPath(),e.moveTo(a,o),e.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),e.stroke()}e.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)e.beginPath(),e.ellipse(Math.random()*i,Math.random()*i,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),e.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);e.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,e.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new rn(t);return s.colorSpace=Se,s.wrapS=Ze,s.wrapT=Ze,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,Qe.capabilities.getMaxAnisotropy()),s}function Mg(i=1024){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,i,i);n.addColorStop(0,"#2e6a40"),n.addColorStop(.42,"#487443"),n.addColorStop(1,"#1f4a37"),e.fillStyle=n,e.fillRect(0,0,i,i);for(let r=0;r<3600;r++){const a=.035+Math.random()*.08,o=72+Math.floor(Math.random()*70);e.fillStyle=`rgba(${38+Math.random()*30}, ${o}, ${38+Math.random()*26}, ${a})`,e.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*4,1+Math.random()*4)}e.strokeStyle="rgba(210, 220, 150, 0.08)",e.lineWidth=2;for(let r=-i;r<i*1.5;r+=76)e.beginPath(),e.moveTo(r,0),e.lineTo(r+i*.65,i),e.stroke();const s=new rn(t);return s.colorSpace=Se,s.wrapS=Ze,s.wrapT=Ze,s.repeat.set(18,18),s.anisotropy=Math.min(16,Qe.capabilities.getMaxAnisotropy()),s}function Sg(i=1024){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,i,i);n.addColorStop(0,"#111a1f"),n.addColorStop(.45,"#252c31"),n.addColorStop(1,"#070d11"),e.fillStyle=n,e.fillRect(0,0,i,i),e.strokeStyle="rgba(180, 225, 255, 0.08)",e.lineWidth=1;for(let r=-i;r<i*2;r+=42)e.beginPath(),e.moveTo(r,0),e.lineTo(r+i*.7,i),e.stroke();for(let r=0;r<360;r++){const a=Math.random()*i,o=Math.random()*i,c=10+Math.random()*56,l=e.createRadialGradient(a,o,0,a,o,c);l.addColorStop(0,`rgba(145, 205, 255, ${.12+Math.random()*.15})`),l.addColorStop(.45,"rgba(80, 140, 180, 0.07)"),l.addColorStop(1,"rgba(10, 18, 24, 0)"),e.fillStyle=l,e.beginPath(),e.ellipse(a,o,c,c*(.16+Math.random()*.18),Math.random()*Math.PI,0,Math.PI*2),e.fill()}e.fillStyle="rgba(255, 214, 122, 0.12)";for(let r=0;r<48;r++){const a=Math.random()*i,o=Math.random()*i;e.beginPath(),e.ellipse(a,o,8+Math.random()*36,1.5+Math.random()*4,Math.random()*Math.PI,0,Math.PI*2),e.fill()}for(let r=0;r<5200;r++){const a=40+Math.floor(Math.random()*80);e.fillStyle=`rgba(${a}, ${a+4}, ${a+8}, ${.045+Math.random()*.08})`,e.fillRect(Math.random()*i,Math.random()*i,1,1)}const s=new rn(t);return s.colorSpace=Se,s.wrapS=Ze,s.wrapT=Ze,s.repeat.set(22,28),s.anisotropy=Math.min(16,Qe.capabilities.getMaxAnisotropy()),s}function Ji(i=128,t=256,e=.42){const n=document.createElement("canvas");n.width=i,n.height=t;const s=n.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,i,t);for(let a=10;a<t-8;a+=18)for(let o=9;o<i-9;o+=15)Math.random()<e?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<i;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,t),s.stroke();const r=new rn(n);return r.colorSpace=Se,r}function yg(i=256,t=256,e="#d9d0bd"){const n=document.createElement("canvas");n.width=i,n.height=t;const s=n.getContext("2d"),r=s.createLinearGradient(0,0,i,t);r.addColorStop(0,e),r.addColorStop(.58,"#f0e5d2"),r.addColorStop(1,"#b9b0a1"),s.fillStyle=r,s.fillRect(0,0,i,t),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const l=180+Math.random()*60;s.fillStyle=`rgba(${l}, ${l}, ${l-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*i,Math.random()*t,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,t*.77,i,t*.2);const a=(c,l,d,u)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,l,d,u),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,l,d,u),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,l+2),s.lineTo(c+d*.5,l+u-2),s.moveTo(c+2,l+u*.52),s.lineTo(c+d-2,l+u*.52),s.stroke()};a(i*.12,t*.24,i*.19,t*.2),a(i*.68,t*.25,i*.2,t*.2),a(i*.43,t*.5,i*.16,t*.16),s.fillStyle="#4b3d34",s.fillRect(i*.43,t*.62,i*.16,t*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(i*.55,t*.76,3,0,Math.PI*2),s.fill();const o=new rn(n);return o.colorSpace=Se,o.wrapS=Ze,o.wrapT=Ze,o.anisotropy=Math.min(16,Qe.capabilities.getMaxAnisotropy()),o}function bg(i=512){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,i,i);n.addColorStop(0,"#e77b36"),n.addColorStop(.45,"#a63f24"),n.addColorStop(1,"#6b271d"),e.fillStyle=n,e.fillRect(0,0,i,i),e.strokeStyle="rgba(255, 185, 104, 0.28)",e.lineWidth=2;for(let r=-20;r<i+20;r+=26){e.beginPath();for(let a=-10;a<i+10;a+=12){const o=r+Math.sin((a+r)*.045)*3;a===-10?e.moveTo(a,o):e.lineTo(a,o)}e.stroke()}e.strokeStyle="rgba(75, 24, 18, 0.34)",e.lineWidth=1.5;for(let r=0;r<i;r+=20)e.beginPath(),e.moveTo(r,0),e.bezierCurveTo(r+8,i*.24,r-8,i*.58,r+7,i),e.stroke();for(let r=0;r<1400;r++){const a=112+Math.random()*110;e.fillStyle=`rgba(${a}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,e.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new rn(t);return s.colorSpace=Se,s.wrapS=Ze,s.wrapT=Ze,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,Qe.capabilities.getMaxAnisotropy()),s}function wg(i=256,t=160){const e=document.createElement("canvas");e.width=i,e.height=t;const n=e.getContext("2d"),s=n.createLinearGradient(0,0,0,t);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),n.fillStyle=s,n.fillRect(0,0,i,t),n.strokeStyle="rgba(210, 225, 232, 0.18)",n.lineWidth=3;for(let a=18;a<t;a+=24)n.beginPath(),n.moveTo(8,a),n.lineTo(i-8,a),n.stroke();n.strokeStyle="rgba(8, 10, 12, 0.72)",n.lineWidth=8,n.strokeRect(4,4,i-8,t-8);const r=new rn(e);return r.colorSpace=Se,r}function Cl(i,t="#ff4fb7",e="rgba(12, 5, 30, 0.92)"){const n=document.createElement("canvas");n.width=128,n.height=384;const s=n.getContext("2d");s.fillStyle=e,s.fillRect(0,0,128,384),s.strokeStyle=t,s.lineWidth=5,s.strokeRect(8,8,112,368),s.save(),s.translate(64,196),s.rotate(-Math.PI/2),s.font="900 54px Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.shadowColor=t,s.shadowBlur=18,s.fillStyle=t,s.fillText(i,0,0),s.restore();const r=new rn(n);return r.colorSpace=Se,r}function ee(i,t){return-7+Math.sin(i*.018)*4+Math.cos(t*.014)*5+Math.sin((i+t)*.006)*10}function sc(i,t,e=10){const{x0:n,x1:s,zNear:r,zFar:a,pitch:o,streetW:c}=Mi;if(i<n-c||i>s+c||t<a-c||t>r+c)return!1;const l=Math.abs((i-n+o/2)%o-o/2),d=Math.abs((r-t+o/2)%o-o/2);return Math.min(l,d)<c*.5+e}const Ur=[],La=[],Bh=[];let Rl=0;function _i(i,t){return Bh.push({obj:i,update:t}),i}function Tg(i){Rl+=i;for(const t of Bh)t.update(Rl,i)}function Eg(){if(La.length===0)for(const i of ls)for(let t=0;t<i.length;t+=14){const e=Oh(i,t);La.push({x:e.x,z:e.z,s:t})}return La}function Xn(i,t,e=0){let n=null,s=1/0;for(const r of Eg()){const a=i-r.x,o=t-r.z,c=Math.hypot(a,o);c<s&&(s=c,n=r)}return{clearance:s-e-fg*.58,distance:s,nearestS:n?.s??0}}function Sn(i,t,e,n=96){for(let s=0;s<n;s++){const r=i(s);if(Xn(r.x,r.z,t).clearance>=e)return r}return null}function yn(i,t,e,n,s){const r=Xn(t,e,n);Ur.push({kind:i,x:Math.round(t),z:Math.round(e),radius:Math.round(n),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function Ag(){const i=[...Ur].sort((t,e)=>t.clearance-e.clearance).slice(0,12);return{count:Ur.length,unsafe:Ur.filter(t=>t.clearance<t.margin),closest:i}}function mn(i,t,e,n,s){const r=t.clone().add(e).multiplyScalar(.5),a=e.clone().sub(t),o=new X(new ge(n,n,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors(We,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,i.add(o),o}function Cg(){const i=new hf(10475519,1055524,.82);zt.add(i);const t=new tl(5941759,1.15);t.position.set(260,145,-260),zt.add(t);const e=new tl(16766364,1.55);e.position.set(-240,270,180),e.castShadow=!0,e.shadow.mapSize.set(3072,3072),e.shadow.camera.left=-460,e.shadow.camera.right=460,e.shadow.camera.top=460,e.shadow.camera.bottom=-460,e.shadow.camera.near=50,e.shadow.camera.far=980,e.shadow.bias=-.0015,zt.add(e);const n=new Eh(5552383,58,820,2.1);n.position.set(0,88,-920),zt.add(n)}function Rg(){const i=document.createElement("canvas");i.width=32,i.height=512;const t=i.getContext("2d"),e=t.createLinearGradient(0,0,0,i.height);e.addColorStop(0,"#03569f"),e.addColorStop(.34,"#1689e6"),e.addColorStop(.72,"#86d3ff"),e.addColorStop(1,"#fff1c4"),t.fillStyle=e,t.fillRect(0,0,i.width,i.height);const n=new rn(i);n.colorSpace=Se;const s=new X(new je(1550,40,20),new we({map:n,side:qe,depthWrite:!1}));s.position.set(0,-70,-700),zt.add(s);const r=new we({color:16765316,transparent:!0,opacity:.22,depthWrite:!1}),a=new X(new Rn(58,48),r);a.position.set(-430,300,-650),a.lookAt(Jt.position),zt.add(a);const o=new we({color:16762479,transparent:!0,opacity:.16,depthWrite:!1});for(const[l,d]of[[150,.05],[260,.025],[430,.012]]){const u=new X(new Rn(l,48),o.clone());u.material.opacity=d,u.position.copy(a.position).add(new U(0,0,2)),u.lookAt(Jt.position),zt.add(u)}const c=new we({color:16769715,transparent:!0,opacity:.025,depthWrite:!1,side:me});for(let l=0;l<3;l++){const d=new X(new Ie(1800,42),c.clone());d.material.opacity=.015+l*.01,d.position.set(0,92+l*28,-1220-l*260),zt.add(d)}}function Pg(){const i=new J({map:Mg(),color:10212492,roughness:.98,metalness:.02}),t=new X(new Ie(4200,4200,300,300),i);t.rotation.x=-Math.PI/2,t.position.y=-7,t.receiveShadow=!0;const e=t.geometry.attributes.position;for(let y=0;y<e.count;y++){const m=e.getX(y),h=e.getY(y);e.setZ(y,ee(m,-h)+7)}e.needsUpdate=!0,t.geometry.computeVertexNormals(),zt.add(t);const n=new J({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.76});for(let y=0;y<3;y++){const m=new X(new Ie(980,64+y*18,1,1),n.clone());m.rotation.x=-Math.PI/2,m.rotation.z=-.34+y*.03,m.position.set(150-y*190,-5.4+y*.03,-760-y*420),zt.add(m)}const s=[new J({color:4352578,roughness:1}),new J({color:6910014,roughness:1}),new J({color:3562320,roughness:1})];for(let y=0;y<46;y++){const m=new X(new Rn(28+Math.random()*90,9),s[y%s.length]);m.rotation.x=-Math.PI/2,m.rotation.z=Math.random()*Math.PI,m.position.set(-900+Math.random()*1800,-5.6+Math.random()*.8,-260-Math.random()*1780),m.scale.y=.32+Math.random()*.5,m.receiveShadow=!0,zt.add(m)}const r=new we({color:14217471,transparent:!0,opacity:.08,depthWrite:!1});for(let y=0;y<32;y++){const m=new X(new Rn(70+Math.random()*150,22),r.clone());m.material.opacity=.035+Math.random()*.055,m.rotation.x=-Math.PI/2,m.position.set(-1050+Math.random()*2100,-1.8+Math.random()*4,-240-Math.random()*1820),m.scale.y=.22+Math.random()*.26,zt.add(m)}const a=[new J({color:5991785,roughness:1}),new J({color:7633254,roughness:1}),new J({color:4874865,roughness:1})],o=new J({color:15068905,roughness:.95});for(let y=0;y<52;y++){const m=78+Math.random()*180,h=52+Math.random()*115,S=Sn(b=>{const E=y/52*Math.PI*2+b*1.77,T=1380+Math.random()*820+b*18;return{x:Math.cos(E)*T,z:Math.sin(E)*T-1180}},h,480);if(!S)continue;const M=new X(new Ei(h,m,5+Math.floor(Math.random()*2)),a[y%a.length]);if(M.position.set(S.x,-9,S.z),M.rotation.y=Math.random()*Math.PI,M.castShadow=!0,M.receiveShadow=!0,zt.add(M),yn("mountain",S.x,S.z,h,480),m>160){const b=new X(new Ei(h*.34,m*.22,5),o);b.position.copy(M.position).add(new U(0,m*.39,0)),b.rotation.y=M.rotation.y,zt.add(b)}}const c=new J({color:4926748,roughness:.9}),l=[new J({color:2055221,roughness:.92}),new J({color:3109954,roughness:.95}),new J({color:1589042,roughness:.9})];for(let y=0;y<185;y++){const m=.58+Math.random()*1.05,h=8*m,S=Sn(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),h,145,40);if(!S)continue;const{x:M,z:b}=S;if(sc(M,b,18))continue;const E=ee(M,b)+.8,T=new le,P=2.2+Math.random()*3.8,C=new X(new ge(.28,.42,P,6),c);C.position.y=P/2,T.add(C);const w=2+Math.floor(Math.random()*3);for(let v=0;v<w;v++){const A=new X(new Ei(2.2+Math.random()*1.7-v*.22,4.8+Math.random()*2.6,7),l[(y+v)%l.length]);A.position.y=P+v*1.45+1.6,A.rotation.y=Math.random()*Math.PI,T.add(A)}T.position.set(M,E,b),T.scale.setScalar(m),zt.add(T),yn("tree",M,b,h,145)}const d=new J({color:16777215,roughness:.75,transparent:!0,opacity:.88});for(let y=0;y<38;y++){const m=new le,h=4+Math.floor(Math.random()*5);for(let S=0;S<h;S++){const M=new X(new je(12+Math.random()*18,14,8),d);M.position.set(S*18-h*9,Math.random()*8,Math.random()*12),M.scale.set(1.2+Math.random()*.9,.36+Math.random()*.2,.8+Math.random()*.5),m.add(M)}m.position.set(-760+Math.random()*1520,185+Math.random()*135,-130-Math.random()*1720),zt.add(m)}const u=[new J({color:6186600,roughness:.68,metalness:.2}),new J({color:7829101,roughness:.72,metalness:.18}),new J({color:4544612,roughness:.62,metalness:.24})],f=new J({color:2962232,roughness:.65,metalness:.35});for(let y=0;y<44;y++){const m=new le,h=20+Math.random()*95,S=8+Math.random()*18,M=8+Math.random()*18,b=new X(new Lt(S,h,M),u[y%u.length]);b.position.y=h/2,b.castShadow=!0,b.receiveShadow=!0,m.add(b);const E=Ji(160,320,.28+Math.random()*.36),T=new J({map:E,color:10414079,roughness:.24,metalness:.12,emissive:1724259,emissiveIntensity:.22});for(const v of[-1,1]){const A=new X(new Ie(S*.82,h*.74),T);A.position.set(0,h*.53,v*(M/2+.08)),A.rotation.y=v<0?Math.PI:0,m.add(A)}const P=new X(new Lt(S*1.08,1.2,M*1.08),f);if(P.position.y=h+.7,m.add(P),Math.random()<.32){const v=new X(new ge(.18,.3,10+Math.random()*12,8),f);v.position.y=h+6.5,m.add(v)}const C=Math.hypot(S,M)*.65,w=Sn(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),C,240,60);w&&(m.position.set(w.x,-5,w.z),m.rotation.y=Math.random()*Math.PI,zt.add(m),yn("building",w.x,w.z,C,240))}const p=new J({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22}),g=new J({color:16766574,roughness:.32,metalness:.05,emissive:9061888,emissiveIntensity:.28});for(let y=0;y<12;y++){const m=new le,h=new X(new Lt(20+Math.random()*16,7+Math.random()*4,.5),g);h.position.y=10,m.add(h);for(const M of[-7,7]){const b=new X(new ge(.24,.32,10,8),p);b.position.set(M,5,-.2),m.add(b)}const S=Sn(()=>({x:-780+Math.random()*1560,z:-450-y*135+Math.random()*80-40}),22,175,50);S&&(m.position.set(S.x,ee(S.x,S.z)+.5,S.z),m.rotation.y=-.35+Math.random()*.7,zt.add(m),yn("billboard",S.x,S.z,22,175))}}function Lg(){for(let h=0;h<3;h++){const S=[9418953,10995926,12770278][h],M=new we({color:S,transparent:!0,opacity:.55-h*.12,depthWrite:!1,fog:!1}),b=60,E=5200,T=new Ie(E,360,b,1),P=T.attributes.position;for(let w=0;w<=b;w++){const v=w/b,A=(Math.sin(v*22+h*3)*.5+Math.sin(v*9+h)*.5)*70+120;P.setY(w,A),P.setY(w+b+1,-180)}P.needsUpdate=!0;const C=new X(T,M);C.position.set(0,40,-2300-h*360),zt.add(C)}const i=new J({color:5583649,roughness:.9}),t=[new J({color:3837754,roughness:.9}),new J({color:7319100,roughness:.92}),new J({color:13075258,roughness:.9}),new J({color:15182276,roughness:.88})];for(let h=0;h<48;h++){const S=.7+Math.random()*1.2,M=9*S,b=Sn(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),M,150,36);if(!b)continue;const{x:E,z:T}=b;if(sc(E,T,18))continue;const P=ee(E,T)+.6,C=new le,w=2.6+Math.random()*3.4,v=new X(new ge(.34,.5,w,6),i);v.position.y=w/2,C.add(v);const A=t[Math.floor(Math.random()*t.length)],I=3+Math.floor(Math.random()*3);for(let z=0;z<I;z++){const H=2.4+Math.random()*1.8,W=new X(new je(H,9,7),A);W.position.set((Math.random()-.5)*3,w+1.6+Math.random()*2.2,(Math.random()-.5)*3),W.scale.y=.82+Math.random()*.3,C.add(W)}C.position.set(E,P,T),C.scale.setScalar(S),zt.add(C),yn("tree",E,T,M,150)}const e=[new J({color:7762025,roughness:1,flatShading:!0,side:me}),new J({color:9077368,roughness:1,flatShading:!0,side:me}),new J({color:6249043,roughness:1,flatShading:!0,side:me})];for(let h=0;h<70;h++){const S=2+Math.random()*7,M=Sn(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),S,70,30);if(!M)continue;const{x:b,z:E}=M,T=new X(new jo(S,0),e[h%e.length]),P=T.geometry.attributes.position;for(let C=0;C<P.count;C++)P.setXYZ(C,P.getX(C)*(.8+Math.random()*.4),P.getY(C)*(.6+Math.random()*.4),P.getZ(C)*(.8+Math.random()*.4));P.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(b,ee(b,E)+S*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,zt.add(T),Us.push({kind:"rock",x:b,z:E,radius:S*1.12}),yn("rock",b,E,S,70)}const n=[11969084,9416262,7314255,13218138,8228670];for(let h=0;h<14;h++){const S=130+Math.random()*200,M=130+Math.random()*200,b=Sn(()=>({x:-1500+Math.random()*3e3,z:-700-Math.random()*1700}),Math.max(S,M)*.5,40,24);if(!b)continue;const{x:E,z:T}=b,P=new le,C=5+Math.floor(Math.random()*4),w=n[Math.floor(Math.random()*n.length)];for(let v=0;v<C;v++){const A=new J({color:v%2?w:n[Math.floor(Math.random()*n.length)],roughness:1}),I=new X(new Ie(S,M/C),A);I.rotation.x=-Math.PI/2,I.position.set(0,.05,-M/2+(v+.5)*(M/C)),P.add(I)}P.position.set(E,ee(E,T)+.05,T),P.rotation.y=Math.random()*Math.PI,zt.add(P),yn("field",E,T,Math.max(S,M)*.5,40)}{const h=Sn(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(h){const S=new J({color:4165552,roughness:.12,metalness:.35,transparent:!0,opacity:.88}),M=new X(new Rn(150,40),S);M.rotation.x=-Math.PI/2,M.position.set(h.x,-6.4,h.z),M.scale.set(1.5,1,1),zt.add(M),yn("lake",h.x,h.z,170,60),_i(M,b=>{S.opacity=.84+Math.sin(b*.8)*.05,M.rotation.z=Math.sin(b*.2)*.02})}}const s=new J({color:15922422,roughness:.5,metalness:.2});for(let h=0;h<9;h++){const S=h/9*Math.PI*2+.6,M=1500+Math.random()*700,b=Math.cos(S)*M,E=Math.sin(S)*M-1150,T=60+Math.random()*40,P=new le,C=new X(new ge(1.1,2.2,T,10),s);C.position.y=T/2,P.add(C);const w=new le;w.position.set(0,T,3);const v=new X(new Lt(3,3,7),s);w.add(v);const A=new le;A.position.z=3.5;for(let z=0;z<3;z++){const H=new X(new Lt(1.1,26,.5),s);H.position.y=13;const W=new le;W.add(H),W.rotation.z=z/3*Math.PI*2,A.add(W)}w.add(A),P.add(w),P.position.set(b,-8,E),P.rotation.y=Math.random()*Math.PI,zt.add(P);const I=.5+Math.random()*.5;_i(A,z=>{A.rotation.z=z*I})}const r=new J({color:7041398,roughness:.6,metalness:.4}),a=new bo({color:2764595,transparent:!0,opacity:.5});let o=null;for(let h=0;h<7;h++){const S=-1100+h*360,M=-1650-Math.sin(h*.7)*120,b=48,E=new le,T=6;for(const C of[-1,1])for(const w of[-1,1]){const v=new X(new ge(.4,.7,b,5),r);v.position.set(C*T,b/2,w*T),v.rotation.z=-C*.08,v.rotation.x=w*.08,E.add(v)}for(const C of[b*.6,b*.82,b]){const w=new X(new Lt(T*4,.8,.8),r);w.position.y=C,E.add(w)}E.position.set(S,ee(S,M)-2,M),zt.add(E);const P=ee(S,M)-2+b;if(o)for(const C of[-T*2,0,T*2]){const w=o.x+C,v=o.z,A=S+C,I=M,z=[],H=12;for(let Y=0;Y<=H;Y++){const st=Y/H,K=Math.sin(st*Math.PI)*6;z.push(new U(w+(A-w)*st,o.y-K+(P-o.y)*st,v+(I-v)*st))}const W=new Wc(new De().setFromPoints(z),a);zt.add(W)}o={x:S,y:P,z:M}}const c=new J({color:11680302,roughness:.6,metalness:.3}),l=new J({color:15263976,roughness:.6,metalness:.3});for(let h=0;h<5;h++){const S=Sn(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!S)continue;const{x:M,z:b}=S,E=70+Math.random()*50,T=new le,P=8;for(let A=0;A<P;A++){const I=new X(new ge(.5,.7,E/P,4),A%2?l:c);I.position.y=(A+.5)*(E/P),I.rotation.y=Math.PI/4,T.add(I)}const C=new J({color:16722458,emissive:16718346,emissiveIntensity:2}),w=new X(new je(1.1,10,8),C);w.position.y=E+1,T.add(w),T.position.set(M,ee(M,b),b),zt.add(T),yn("mast",M,b,8,120);const v=Math.random()*Math.PI*2;_i(w,A=>{C.emissiveIntensity=Math.sin(A*2.4+v)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let h=0;h<6;h++){const S=new le,M=d[h%d.length],b=new J({map:Fg(M[0],M[1]),roughness:.5,metalness:.05,emissive:new kt(M[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new X(new je(11,20,16),b);E.scale.y=1.25,S.add(E);const T=new X(new Lt(3.4,3,3.4),new J({color:8014371,roughness:.9}));T.position.y=-17,S.add(T);const P=new bo({color:3811866});for(const I of[-1,1])for(const z of[-1,1]){const H=new Wc(new De().setFromPoints([new U(I*1.6,-15.5,z*1.6),new U(I*7,-3,z*7)]),P);S.add(H)}const C=-700+Math.random()*1400,w=-700-Math.random()*1200,v=280+Math.random()*100;S.position.set(C,v,w),zt.add(S);const A=Math.random()*Math.PI*2;_i(S,I=>{S.position.y=v+Math.sin(I*.5+A)*6,S.position.x=C+Math.sin(I*.08+A)*90,S.rotation.z=Math.sin(I*.4+A)*.04})}const u=new we({color:2829104,side:me,fog:!1});function f(){const h=new Mh;return h.moveTo(0,0),h.lineTo(-2.6,1.1),h.lineTo(-2.2,.2),h.lineTo(0,.5),h.lineTo(2.2,.2),h.lineTo(2.6,1.1),h.lineTo(0,0),new X(new Qo(h),u)}for(let h=0;h<5;h++){const S=new le,M=5+Math.floor(Math.random()*5),b=[];for(let A=0;A<M;A++){const I=f(),z=A%2?1:-1,H=Math.ceil(A/2);I.position.set(z*H*5,-H*2.4,0),I.rotation.x=-Math.PI/2,S.add(I),b.push(I)}const E=150+Math.random()*120,T=-500-Math.random()*1400,P=18+Math.random()*14,C=1400,w=-700+Math.random()*1400;S.position.set(w,E,T),zt.add(S);const v=Math.random()*Math.PI*2;_i(S,(A,I)=>{S.position.x+=P*I,S.position.x>C&&(S.position.x=-C);const z=Math.sin(A*6+v);for(const H of b)H.rotation.x=-Math.PI/2+z*.4})}{const h=new le,S=new J({color:14673644,roughness:.4,metalness:.2}),M=new X(new je(20,20,16),S);M.scale.set(2.6,1,1),h.add(M);const b=new J({color:13781835,roughness:.6});for(let w=0;w<3;w++){const v=new X(new Lt(10,9,.6),b);v.position.x=-46,v.rotation.x=w/3*Math.PI*2,h.add(v)}const E=new X(new Lt(10,4,4),new J({color:3356475,roughness:.7}));E.position.y=-19,h.add(E);const T=new X(new Ie(40,10),new we({map:rc("STEEL RIBBON"),transparent:!0,side:me}));T.position.set(60,0,0),h.add(T);const P=900,C=240;h.position.set(0,C,-1200),zt.add(h),_i(h,w=>{const v=w*.05;h.position.x=Math.cos(v)*P,h.position.z=-1200+Math.sin(v)*P*.5,h.position.y=C+Math.sin(w*.3)*8,h.rotation.y=-v+Math.PI/2})}const p=new we({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let h=0;h<14;h++){const S=new X(new Ie(220+Math.random()*360,16+Math.random()*22),p.clone());S.material.opacity=.12+Math.random()*.18,S.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),S.rotation.x=-Math.PI/2.1,S.rotation.z=Math.random()*Math.PI,S.scale.y=.3,zt.add(S);const M=2+Math.random()*3;_i(S,(b,E)=>{S.position.x+=M*E,S.position.x>1400&&(S.position.x=-1400)})}const g=new J({color:13620954,roughness:.6,metalness:.2}),y=new we({map:Og(),side:me});for(let h=0;h<4;h++){const S=Sn(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!S)continue;const{x:M,z:b}=S,E=new le,T=60+Math.random()*40,P=new X(new Lt(T,1.4,26),g);P.position.set(0,26,-4),P.rotation.x=-.32,E.add(P);const C=new X(new Ie(T*.94,24),y);C.position.set(0,12,6),C.rotation.x=-.85,E.add(C);for(const w of[-T/2,T/2]){const v=new X(new Lt(1.4,26,1.4),g);v.position.set(w,13,-8),E.add(v)}E.position.set(M,ee(M,b),b),E.rotation.y=Math.atan2(-M,-b)+(Math.random()-.5)*.5,zt.add(E),yn("grandstand",M,b,40,30)}const m=[16731486,16765503,16777215,11824127];for(let h=0;h<90;h++){const S=Sn(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!S)continue;const{x:M,z:b}=S,E=new le,T=m[Math.floor(Math.random()*m.length)],P=new we({color:T,side:me}),C=5+Math.floor(Math.random()*6);for(let w=0;w<C;w++){const v=new X(new Rn(.5+Math.random()*.4,5),P);v.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),v.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,v.rotation.z=Math.random()*Math.PI,E.add(v)}E.position.set(M,ee(M,b),b),zt.add(E),yn("flowers",M,b,3,20)}}const oi=[],Yn=[],Us=[],Yr=[];function Dg(){const i=new le,t=new Le;new Kn().setFromAxisAngle(new U(1,0,0),-Math.PI/2);const e=Mi.x0,n=Mi.x1,s=Mi.zNear,r=Mi.zFar,a=Mi.pitch,o=Mi.streetW,c=a-o,l=[];for(let _=e;_<=n+1;_+=a)l.push({x0:_,z0:s,x1:_,z1:r});for(let _=s;_>=r-1;_-=a)l.push({x0:e,z0:_,x1:n,z1:_});function d(_,L,O){const V=[],B=[];for(const Q of _){const pt=Q.x1-Q.x0,lt=Q.z1-Q.z0,$=Math.hypot(pt,lt),rt=Math.max(1,Math.round($/14)),St=pt/$,nt=-(lt/$),At=St;let N=null,dt=null;for(let ct=0;ct<=rt;ct++){const ht=ct/rt,ot=ht*$/68,it=Q.x0+pt*ht,yt=Q.z0+lt*ht,Ft=it+nt*L,de=yt+At*L,ae=it-nt*L,ze=yt-At*L,Fe=[Ft,ee(Ft,de)+O,de,ot],tn=[ae,ee(ae,ze)+O,ze,ot];N&&(V.push(N[0],N[1],N[2],dt[0],dt[1],dt[2],tn[0],tn[1],tn[2]),V.push(N[0],N[1],N[2],tn[0],tn[1],tn[2],Fe[0],Fe[1],Fe[2]),B.push(0,N[3],1,dt[3],1,tn[3]),B.push(0,N[3],1,tn[3],0,Fe[3])),N=Fe,dt=tn}}const j=new De;return j.setAttribute("position",new re(V,3)),j.setAttribute("uv",new re(B,2)),j.computeVertexNormals(),j}const u=new J({map:Sg(),color:13097186,roughness:.34,metalness:.24,envMapIntensity:1.25,side:me}),f=new X(d(l,o/2,.55),u);f.receiveShadow=!0,i.add(f);const p=new J({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:me});i.add(new X(d(l,.4,.62),p));const g=new we({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:me,blending:Qi}),y=new we({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:me,blending:Qi});for(let _=0;_<120;_++){const L=l[Math.random()*l.length|0],O=Math.random(),V=L.x0+(L.x1-L.x0)*O,B=L.z0+(L.z1-L.z0)*O;if(Xn(V,B,4).clearance<2)continue;const j=new X(new Rn(1,18),(_%4===0?y:g).clone());j.rotation.x=-Math.PI/2,j.rotation.z=Math.atan2(L.x1-L.x0,L.z1-L.z0)+(Math.random()-.5)*.35,j.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),j.position.set(V+(Math.random()-.5)*o*.7,ee(V,B)+.66,B+(Math.random()-.5)*o*.7),i.add(j)}const m=[Ji(160,320,.5),Ji(160,320,.62),Ji(160,320,.42)],h=[new J({map:m[0],color:7042688,roughness:.42,metalness:.26,emissive:2315117,emissiveIntensity:.34}),new J({map:m[1],color:8550507,roughness:.46,metalness:.22,emissive:4860952,emissiveIntensity:.32}),new J({map:m[2],color:4414064,roughness:.4,metalness:.3,emissive:1523562,emissiveIntensity:.38})],S=new Lt(1,1,1),M=[[],[],[]],b=[],E=[],T=[],P=[],C=[],w=[],v=[],A=[],I=[],z=[],H=[],W=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],Y=yg(256,256,"#dbcdb8"),st=bg(),K=wg();function ut(_,L,O,V,B){const j=ee(_,L)-1;if(t.position.set(_,j+B/2,L),t.quaternion.identity(),t.scale.set(O,B,V),t.updateMatrix(),M[Math.random()*3|0].push(t.matrix.clone()),t.position.set(_,j+B+.6,L),t.scale.set(O*1.04,1.2,V*1.04),t.updateMatrix(),b.push(t.matrix.clone()),B>26){const Q=Math.random()<.72?3790847:16730294;for(const pt of[-1,1])t.position.set(_,j+B+1.35,L+pt*(V*.52+.12)),t.scale.set(O*1.12,.22,.18),t.updateMatrix(),E.push(t.matrix.clone()),T.push(Q);Math.random()<.34&&P.push({px:_,pz:L,w:O,d:V,h:B,gy:j,zSide:Math.random()<.5?-1:1})}oi.push({x:_,z:L,hw:O*.5,hd:V*.5,maxY:j+B+2})}function ft(_,L,O,V,B){const j=ee(_,L)-.4,Q=2+Math.random()*2.4;t.position.set(_,j+B/2,L),t.quaternion.identity(),t.scale.set(O,B,V),t.updateMatrix(),C.push(t.matrix.clone()),oi.push({x:_,z:L,hw:O*.5,hd:V*.5,maxY:j+B+Q+1.5}),w.push(W[Math.random()*W.length|0]),t.position.set(_,j+B+Q/2,L),t.scale.set(O*.82,Q,V*.82),t.updateMatrix(),v.push(t.matrix.clone());const pt=e+Math.round((_-e)/a)*a,lt=s-Math.round((s-L)/a)*a,$=Math.abs(_-pt)<Math.abs(L-lt),rt=$?pt>_?1:-1:lt>L?1:-1,St=Math.min($?V*.46:O*.46,8.5),vt=Math.min(B*.58,4.6),nt=Math.min(24,Math.max(8,$?Math.abs(pt-_)-O*.5-o*.35:Math.abs(lt-L)-V*.5-o*.35));t.quaternion.identity(),$?(t.position.set(_+rt*(O*.5+.1),j+vt*.5+.1,L-V*.16),t.scale.set(.24,vt,St),t.updateMatrix(),A.push(t.matrix.clone()),t.position.set(_+rt*(O*.5+nt*.5),ee(_+rt*(O*.5+nt*.5),L)+.08,L-V*.16),t.scale.set(nt,.08,St*1.18)):(t.position.set(_-O*.16,j+vt*.5+.1,L+rt*(V*.5+.1)),t.scale.set(St,vt,.24),t.updateMatrix(),A.push(t.matrix.clone()),t.position.set(_-O*.16,ee(_,L+rt*(V*.5+nt*.5))+.08,L+rt*(V*.5+nt*.5)),t.scale.set(St*1.18,.08,nt)),t.updateMatrix(),I.push(t.matrix.clone()),t.position.set(_,j+.02,L),t.scale.set(O*1.58,.05,V*1.58),t.updateMatrix(),z.push(t.matrix.clone());for(let At=0;At<3;At++){const N=$?_+rt*(O*.55):_+(At-1)*O*.25,dt=$?L+(At-1)*V*.28:L+rt*(V*.55);t.position.set(N,ee(N,dt)+.55,dt);const ct=.85+Math.random()*.75;t.scale.set(ct*1.35,ct,ct*1.35),t.updateMatrix(),H.push(t.matrix.clone())}}for(let _=e+a/2;_<=n-a/2;_+=a)for(let L=s-a/2;L>=r+a/2;L-=a){const O=Xn(_,L,c*.5).clearance;if(O<2)continue;const V=L>40&&L<380&&_>-360&&_<360;if(O<90||V){const j=c/3;for(let Q=0;Q<3;Q++)for(let pt=0;pt<3;pt++){if(Math.random()<.14)continue;const lt=_-c/2+j*(Q+.5)+(Math.random()-.5)*j*.3,$=L-c/2+j*(pt+.5)+(Math.random()-.5)*j*.3;if(Xn(lt,$,8).clearance<1)continue;const rt=j*(.5+Math.random()*.22),St=j*(.5+Math.random()*.22);!V&&Math.random()<.16?ut(lt,$,rt*.9,St*.9,12+Math.random()*12):ft(lt,$,rt,St,5+Math.random()*4.5)}}else{const B=O>230,j=B?It.clamp(50+O*1.1,60,175):It.clamp(22+O*.3,22,62),Q=2+(Math.random()<.72?1:0)+(Math.random()<.42?1:0);for(let pt=0;pt<Q;pt++){const lt=13+Math.random()*Math.min(26,c*.44),$=13+Math.random()*Math.min(26,c*.44),rt=_+(Math.random()-.5)*(c-lt),St=L+(Math.random()-.5)*(c-$);if(Xn(rt,St,Math.hypot(lt,$)*.5).clearance<2)continue;const vt=(18+Math.random()*(j-18))*(B&&Math.random()<.2?1.35:1);ut(rt,St,lt,$,vt)}}}for(let _=0;_<3;_++){if(!M[_].length)continue;const L=new He(S,h[_],M[_].length);for(let O=0;O<M[_].length;O++)L.setMatrixAt(O,M[_][O]);L.instanceMatrix.needsUpdate=!0,L.castShadow=!0,L.receiveShadow=!0,i.add(L)}if(b.length){const _=new J({color:2896696,roughness:.62,metalness:.34}),L=new He(S,_,b.length);for(let O=0;O<b.length;O++)L.setMatrixAt(O,b[O]);L.instanceMatrix.needsUpdate=!0,i.add(L)}if(E.length){const _=new J({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),L=new He(S,_,E.length);for(let O=0;O<E.length;O++)L.setMatrixAt(O,E[O]),L.setColorAt(O,new kt(T[O]));L.instanceMatrix.needsUpdate=!0,L.instanceColor&&(L.instanceColor.needsUpdate=!0),i.add(L)}if(C.length){const _=new J({color:4891451,roughness:.88,metalness:.02}),L=new He(S,_,z.length);for(let nt=0;nt<z.length;nt++)L.setMatrixAt(nt,z[nt]);L.instanceMatrix.needsUpdate=!0,L.receiveShadow=!0,i.add(L);const O=new J({color:12040883,roughness:.48,metalness:.05}),V=new He(S,O,I.length);for(let nt=0;nt<I.length;nt++)V.setMatrixAt(nt,I[nt]);V.instanceMatrix.needsUpdate=!0,V.receiveShadow=!0,i.add(V);const B=new J({map:Y,roughness:.78,metalness:.03}),j=new He(S,B,C.length);for(let nt=0;nt<C.length;nt++)j.setMatrixAt(nt,C[nt]),j.setColorAt(nt,new kt(w[nt]));j.instanceMatrix.needsUpdate=!0,j.instanceColor&&(j.instanceColor.needsUpdate=!0),j.castShadow=!0,j.receiveShadow=!0,i.add(j);const Q=new Ei(.72,1,4);Q.rotateY(Math.PI/4);const pt=new J({map:st,color:14314033,roughness:.72}),lt=new He(Q,pt,v.length);for(let nt=0;nt<v.length;nt++)lt.setMatrixAt(nt,v[nt]);lt.instanceMatrix.needsUpdate=!0,lt.castShadow=!0,i.add(lt);const $=new J({map:K,roughness:.38,metalness:.18}),rt=new He(S,$,A.length);for(let nt=0;nt<A.length;nt++)rt.setMatrixAt(nt,A[nt]);rt.instanceMatrix.needsUpdate=!0,i.add(rt);const St=new J({color:3112239,roughness:.88,metalness:.02}),vt=new He(new je(1,8,6),St,H.length);for(let nt=0;nt<H.length;nt++)vt.setMatrixAt(nt,H[nt]);vt.instanceMatrix.needsUpdate=!0,vt.castShadow=!0,vt.receiveShadow=!0,i.add(vt)}const Ct=["HOTEL","OPEN","AUTO","RACE","CAFE"];for(let _=0;_<Math.min(P.length,18);_++){const L=P[_],O=Ct[_%Ct.length],V=_%3===0?"#ff4fb7":_%3===1?"#4ff3ff":"#ffd45b",B=new we({map:Cl(O,V),transparent:!0,side:me,depthWrite:!1}),j=new X(new Ie(8,24),B);j.position.set(L.px,L.gy+Math.max(14,L.h*.58),L.pz+L.zSide*(L.d*.5+.25)),j.rotation.y=L.zSide<0?Math.PI:0,i.add(j)}const Zt=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],ie=new Lt(2.2,1.4,4.6),fe=130,se=new He(ie,new J({roughness:.42,metalness:.36}),fe);let et=0,at=0;for(;et<fe&&at<fe*6;){at++;const _=Math.random()<.5,L=_?e+Math.round(Math.random()*((n-e)/a))*a+(Math.random()<.5?-1:1)*(o*.26):e+Math.random()*(n-e),O=_?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(Xn(L,O,4).clearance<2)continue;const V=ee(L,O)+.7;t.position.set(L,V,O),t.quaternion.setFromAxisAngle(We,_?0:Math.PI/2),t.scale.set(1,1,1),t.updateMatrix(),se.setMatrixAt(et,t.matrix),se.setColorAt(et,new kt(Zt[Math.random()*Zt.length|0])),et++}se.count=et,se.instanceMatrix.needsUpdate=!0,se.instanceColor&&(se.instanceColor.needsUpdate=!0),i.add(se);const bt=new ge(.12,.16,7.2,7),Ht=new je(.46,10,8),Rt=new Ie(2.8,13),Kt=new J({color:1581353,roughness:.42,metalness:.68}),Ne=new J({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),$t=new we({color:16760163,transparent:!0,opacity:.16,depthWrite:!1,side:me,blending:Qi}),pe=132,F=new He(bt,Kt,pe),Wt=new He(Ht,Ne,pe),Xt=new He(Rt,$t,pe);let ne=0;for(let _=0;_<pe*2&&ne<pe;_++){const L=Math.random()<.5,O=L?e+Math.round(Math.random()*((n-e)/a))*a+(Math.random()<.5?-1:1)*(o*.58):e+Math.random()*(n-e),V=L?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(Xn(O,V,3).clearance<2)continue;const B=ee(O,V);t.quaternion.identity(),t.position.set(O,B+3.6,V),t.scale.set(1,1,1),t.updateMatrix(),F.setMatrixAt(ne,t.matrix),t.position.set(O,B+7.5,V),t.updateMatrix(),Wt.setMatrixAt(ne,t.matrix),t.position.set(O,B+.72,V),t.quaternion.setFromAxisAngle(new U(1,0,0),-Math.PI/2),t.rotateZ(L?0:Math.PI/2),t.scale.set(1,1,1),t.updateMatrix(),Xt.setMatrixAt(ne,t.matrix),ne++}F.count=ne,Wt.count=ne,Xt.count=ne,F.instanceMatrix.needsUpdate=!0,Wt.instanceMatrix.needsUpdate=!0,Xt.instanceMatrix.needsUpdate=!0,i.add(F,Wt,Xt);const Tt=new J({color:10397084,roughness:.58,metalness:.04}),be=new J({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12});i.add(new X(d([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),Tt)),i.add(new X(d([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),Tt)),i.add(new X(d([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),be));function Pt(_,L,O,V,B,j,Q,pt=null,lt=0){const $=ee(_,L)-.45,rt=_<80?1:-1,St=new J({map:Ji(192,512,Q),color:j,roughness:.38,metalness:.26,emissive:1719900,emissiveIntensity:.44}),vt=new X(new Lt(O,B,V),St);vt.position.set(_,$+B/2,L),vt.castShadow=!0,vt.receiveShadow=!0,i.add(vt);const nt=new J({map:Ji(220,620,Math.min(.86,Q+.18)),color:16777215,roughness:.2,metalness:.14,emissive:1386040,emissiveIntensity:.12,transparent:!0,opacity:.94,side:me}),At=new X(new Ie(V*.78,B*.74),nt);At.position.set(_+rt*(O/2+.09),$+B*.54,L),At.rotation.y=rt>0?Math.PI/2:-Math.PI/2,i.add(At);const N=new X(new Lt(O*1.04,1.2,V*1.04),new J({color:1778733,roughness:.34,metalness:.38}));N.position.set(_,$+B+.7,L),i.add(N);const dt=new J({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const ct of[-1,1]){const ht=new X(new Lt(O*1.1,.22,.18),dt);ht.position.set(_,$+B+1.4,L+ct*(V/2+.18)),i.add(ht)}if(pt&&lt){const ct=new we({map:Cl(pt,pt==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:me,depthWrite:!1}),ht=new X(new Ie(7.5,24),ct);ht.position.set(_+lt*(O/2+.3),$+Math.min(B-8,B*.58),L),ht.rotation.y=lt>0?Math.PI/2:-Math.PI/2,i.add(ht)}oi.push({x:_,z:L,hw:O*.5,hd:V*.5,maxY:$+B+2})}function Vt(_,L,O,V=3.2){const B=_*.5+V,j=L*.5+V,Q=Math.max(2,Math.abs(B-j)*.72),lt=_>=L?[-B,0,-j,B,0,-j,Q,O,0,-B,0,-j,Q,O,0,-Q,O,0,B,0,-j,B,0,j,Q,O,0,B,0,j,-B,0,j,-Q,O,0,B,0,j,Q,O,0,-Q,O,0,-B,0,j,-B,0,-j,-Q,O,0]:[-B,0,-j,B,0,-j,0,O,-Q,B,0,-j,B,0,j,0,O,Q,B,0,-j,0,O,Q,0,O,-Q,B,0,j,-B,0,j,0,O,Q,-B,0,j,-B,0,-j,0,O,-Q,-B,0,j,0,O,-Q,0,O,Q],$=new De;return $.setAttribute("position",new re(lt,3)),$.computeVertexNormals(),$}function D(_,L,O,V,B,j,Q={}){const pt=ee(_,L)-.3,lt=Q.frontZ??-1,$=new J({map:Y,color:Q.wallColor??14734788,roughness:.68,metalness:.03}),rt=new X(new Lt(O,B,V),$);rt.position.set(_,pt+B/2,L),rt.castShadow=!0,rt.receiveShadow=!0,i.add(rt);const St=new J({map:st,color:j,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),vt=Q.roofH??8.2,nt=new X(Vt(O,V,vt),St);nt.position.set(_,pt+B,L),nt.castShadow=!0,nt.receiveShadow=!0,i.add(nt);const At=new J({color:15985112,roughness:.42,metalness:.05}),N=new X(new Lt(O+7,.42,1.2),At);N.position.set(_,pt+B+.12,L+lt*(V*.5+1.4)),i.add(N);const dt=N.clone();dt.position.z=L-lt*(V*.5+1.4),i.add(dt);const ct=Math.min(18,O*.38),ht=new X(new Lt(ct,B*.55,.32),new J({map:K,roughness:.34,metalness:.2}));ht.position.set(_+O*.18,pt+B*.33,L+lt*(V*.5+.22)),i.add(ht);const ot=new X(new Lt(5.2,7.2,.28),new J({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));ot.position.set(_-O*.25,pt+3.7,L+lt*(V/2+.24)),i.add(ot);const it=new J({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),yt=new J({color:3353638,roughness:.38});for(const an of[-O*.36,-O*.05,O*.38]){if(Math.abs(an-O*.18)<ct*.45)continue;const On=new X(new Lt(6.2,4.8,.26),yt);On.position.set(_+an,pt+B*.58,L+lt*(V*.5+.28)),i.add(On);const en=new X(new Lt(4.8,3.4,.3),it);en.position.copy(On.position),en.position.z+=lt*.04,i.add(en)}const Ft=new J({color:12370619,roughness:.44,metalness:.04}),de=new X(new Lt(ct*1.18,.12,34),Ft);de.position.set(_+O*.18,ee(_+O*.18,L+lt*(V*.5+17))+.11,L+lt*(V*.5+17)),i.add(de);const ae=new J({color:5679925,roughness:.86,metalness:.01}),ze=new X(new Lt(O+28,.1,V+30),ae);ze.position.set(_,ee(_,L)+.03,L),ze.receiveShadow=!0,i.add(ze),ze.renderOrder=-1;const Fe=new J({color:3042609,roughness:.84}),tn=[new J({color:16766544,roughness:.58}),new J({color:16738974,roughness:.58}),new J({color:16314584,roughness:.58})];for(let an=0;an<9;an++){const On=_-O*.44+an*(O*.11),en=L+lt*(V*.5+2.2+an%2*1.5),jn=new X(new je(1.35+an%3*.22,10,7),an%4===0?tn[an%tn.length]:Fe);jn.position.set(On,ee(On,en)+.95,en),jn.scale.y=.72,jn.castShadow=!0,i.add(jn)}oi.push({x:_,z:L,hw:O*.5,hd:V*.5,maxY:pt+B+5})}return D(-8,286,92,58,18,14244903,{wallColor:15063235,frontZ:1,roofH:8.8}),D(168,238,54,46,15,12536356,{wallColor:13946041,frontZ:1,roofH:7.2}),D(-188,316,48,42,14,12995115,{wallColor:14274744,frontZ:1,roofH:6.8}),D(262,304,58,46,15,13788715,{wallColor:14799288,frontZ:1,roofH:7.4}),D(-230,152,54,44,14,12272168,{wallColor:13616562,frontZ:1,roofH:6.8}),D(282,120,50,42,13,12801063,{wallColor:14275524,frontZ:1,roofH:6.5}),Pt(-48,-360,54,86,148,2439765,.58,null,0),Pt(172,-430,50,80,132,3817032,.66,"OPEN",-1),zt.add(i),i}function Ig(i,t=1){const n=he(16),s=new U(n.tangent.x,0,n.tangent.z).normalize(),r=new U().crossVectors(We,s).normalize(),a=n.p.clone().addScaledVector(n.side,t*tt.width*.5),o=165,c=52,l=a.x-s.x*o+r.x*t*c,d=a.z-s.z*o+r.z*t*c,u=new U(l,ee(l,d)+.4,d),f=26,p=[];for(let A=0;A<=f;A++){const I=A/f,z=I*I*(3-2*I);p.push(new U(It.lerp(u.x,a.x,I),It.lerp(u.y,a.y,z),It.lerp(u.z,a.z,I)))}const g=5.5,y=new U,m=new U,h=[],S=[];for(let A=0;A<=f;A++)m.subVectors(p[Math.min(f,A+1)],p[Math.max(0,A-1)]),m.y=0,m.normalize(),y.crossVectors(We,m).normalize(),h.push(p[A].clone().addScaledVector(y,-g)),S.push(p[A].clone().addScaledVector(y,g));const M={kind:"ramp",halfW:g,dirSel:t,mergeS:16,points:p.map(A=>A.clone()),segments:[]};for(let A=0;A<f;A++){const I=p[A],z=p[A+1],H=z.x-I.x,W=z.z-I.z,Y=Math.max(1e-4,H*H+W*W);M.segments.push({a:I.clone(),b:z.clone(),abx:H,abz:W,lenSq:Y,u0:A/f,u1:(A+1)/f})}Yr.push(M);const b=[];for(let A=0;A<f;A++){const I=h[A],z=S[A],H=h[A+1],W=S[A+1];b.push(I.x,I.y,I.z,z.x,z.y,z.z,W.x,W.y,W.z),b.push(I.x,I.y,I.z,W.x,W.y,W.z,H.x,H.y,H.z)}const E=new De;E.setAttribute("position",new re(b,3)),E.computeVertexNormals();const T=new J({color:2895665,roughness:.85,metalness:.05,side:me});i.add(new X(E,T));const P=new J({color:12107972,roughness:.5,metalness:.4});for(let A=0;A<f;A++)mn(i,h[A].clone().setY(h[A].y+1),h[A+1].clone().setY(h[A+1].y+1),.16,P),mn(i,S[A].clone().setY(S[A].y+1),S[A+1].clone().setY(S[A+1].y+1),.16,P);const C=new J({color:7173241,roughness:.82});for(let A=3;A<f;A+=3){const I=p[A],z=ee(I.x,I.z),H=I.y-z;if(H<3)continue;const W=new X(new ge(.9,1.15,H,8),C);W.position.set(I.x,z+H/2,I.z),i.add(W),Yn.push({x:I.x,z:I.z,hw:1.3,hd:1.3,maxY:I.y-.9})}const w=new we({map:rc("ON RAMP"),transparent:!0,side:me}),v=new X(new Ie(12,3),w);v.position.copy(u).add(new U(0,5.5,0)),v.rotation.y=Math.atan2(-s.x,-s.z),i.add(v);for(const A of[-1,1]){const I=new X(new ge(.2,.26,6,6),C);I.position.set(u.x+r.x*A*5.4,u.y+3,u.z+r.z*A*5.4),i.add(I)}}function Ug(){const i=new le,t=[],e=new kt(14170671),n=new kt(15922680),s=new J({color:3883336,roughness:.6,metalness:.3}),r=new we({map:Ng(),transparent:!0,side:me}),a=new J({color:4926748,roughness:.9}),o=[new J({color:2055221,roughness:.92}),new J({color:3109954,roughness:.95}),new J({color:2583370,roughness:.9})],c=new J({color:7040883,roughness:.95,side:me}),l=12,d=[],u=[];let f=0;for(let g=0;g<tt.length;g+=l){if(Ri(g+l*.5)){f++;continue}const y=he(g),m=he(g+l),h=y.p.clone().add(m.p).multiplyScalar(.5),{sideways:S,normal:M,q:b}=ci(y,m);for(const E of[-1,1]){const T=h.clone().addScaledVector(S,E*tt.width*.5).addScaledVector(M,.5);d.push(T),u.push(b),t.push(f%2===0?e:n)}if(f%16===8){const E=(f>>4)%2?1:-1,T=h.clone().addScaledVector(S,E*tt.width*.52).addScaledVector(M,.4),P=new le,C=new X(new Ie(4.4,2.6),r);C.position.y=3.4,C.rotation.y=Math.PI,P.add(C);const w=new ge(.12,.16,3.4,5);for(const v of[-1.5,1.5]){const A=new X(w,s);A.position.set(v,1.7,0),P.add(A)}P.position.copy(T),P.quaternion.copy(b),i.add(P)}f++}for(let g=0;g<tt.length;g+=16){const y=he(g),m=1+(Math.random()<.5?1:0);for(let h=0;h<m;h++){const S=Math.random()<.5?-1:1,M=tt.width/2+12+Math.random()*78,b=y.p.x+y.side.x*M*S+(Math.random()-.5)*16,E=y.p.z+y.side.z*M*S+(Math.random()-.5)*16;if(sc(b,E,18))continue;const T=ee(b,E);if(Math.random()<.78){const P=.7+Math.random()*1.5,C=new le,w=2.4+Math.random()*4.2,v=new X(new ge(.26,.42,w,6),a);v.position.y=w/2,C.add(v);const A=2+Math.floor(Math.random()*3);for(let I=0;I<A;I++){const z=new X(new Ei(2.4+Math.random()*1.6-I*.2,4.6+Math.random()*2.4,7),o[(h+I+g)%o.length]);z.position.y=w+I*1.4+1.5,z.rotation.y=Math.random()*Math.PI,C.add(z)}C.position.set(b,T+.6,E),C.scale.setScalar(P),i.add(C)}else{const P=1.4+Math.random()*3.6,C=new X(new $o(P,0),c);C.position.set(b,T+P*.35,E),C.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),C.scale.set(1,.7+Math.random()*.4,1),i.add(C),Yn.push({kind:"rock",x:b,z:E,radius:P*1.18})}}}const p=["START","SECTOR 2","SECTOR 3"];for(let g=0;g<3;g++){const y=tt.length*g/3+6;if(Ri(y))continue;const m=he(y),h=he(y+l),S=m.p.clone().add(h.p).multiplyScalar(.5),{q:M}=ci(m,h),b=tt.width*.5+1.2,E=9,T=new le,P=new ge(.4,.55,E,7);for(const I of[-1,1]){const z=new X(P,s);z.position.set(I*b,E/2,0),T.add(z)}const C=b*2,w=new X(new Lt(C,1.1,1.1),s);w.position.y=E,T.add(w);const v=new we({map:rc(p[g]),transparent:!0,side:me}),A=new X(new Ie(C*.82,3),v);A.position.set(0,E-2,0),A.rotation.y=Math.PI,T.add(A),T.position.copy(S),T.quaternion.copy(M),i.add(T)}if(d.length){const g=new ge(.18,.24,3,6);g.translate(0,1.5,0);const y=new je(.34,8,6);y.translate(0,3.2,0);const m=new J({color:10134440,roughness:.7,metalness:.2}),h=new J({roughness:.55}),S=new He(g,m,d.length),M=new He(y,h,d.length),b=new Le;for(let E=0;E<d.length;E++)b.position.copy(d[E]),b.quaternion.copy(u[E]),b.updateMatrix(),S.setMatrixAt(E,b.matrix),M.setMatrixAt(E,b.matrix),M.setColorAt(E,t[E]);S.instanceMatrix.needsUpdate=!0,M.instanceMatrix.needsUpdate=!0,M.instanceColor&&(M.instanceColor.needsUpdate=!0),i.add(S),i.add(M)}return Ig(i),zt.add(i),i}function Ng(){const i=document.createElement("canvas");i.width=256,i.height=160;const t=i.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,i.width,i.height),t.fillStyle="#ffd23f",t.lineWidth=0;for(let n=-1;n<4;n++){t.beginPath();const s=n*70;t.moveTo(s,16),t.lineTo(s+40,i.height/2),t.lineTo(s,i.height-16),t.lineTo(s+18,i.height-16),t.lineTo(s+58,i.height/2),t.lineTo(s+18,16),t.closePath(),t.fill()}const e=new rn(i);return e.colorSpace=Se,e}function rc(i){const t=document.createElement("canvas");t.width=512,t.height=128;const e=t.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,t.width,t.height),e.fillStyle="#ffd23f",e.fillRect(0,0,t.width,8),e.fillRect(0,t.height-8,t.width,8),e.fillStyle="#ffffff",e.font="bold 64px sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText(i,t.width/2,t.height/2);const n=new rn(t);return n.colorSpace=Se,n}function Fg(i,t){const e=document.createElement("canvas");e.width=128,e.height=64;const n=e.getContext("2d"),s="#"+i.toString(16).padStart(6,"0"),r="#"+t.toString(16).padStart(6,"0"),a=8;for(let c=0;c<a;c++)n.fillStyle=c%2?s:r,n.fillRect(c/a*e.width,0,e.width/a+1,e.height);const o=new rn(e);return o.colorSpace=Se,o}function Og(){const i=document.createElement("canvas");i.width=256,i.height=128;const t=i.getContext("2d");t.fillStyle="#2a3138",t.fillRect(0,0,i.width,i.height);const e=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){t.fillStyle=e[Math.random()*e.length|0];const r=Math.random()*i.width,a=Math.random()*i.height;t.fillRect(r,a,2.4,2.4)}const n=new rn(i);return n.colorSpace=Se,n.wrapS=Ze,n.repeat.set(3,1),n}function ye(i,t,e,n,s){const r=new X(new Lt(t.x,t.y,t.z),s);return r.position.copy(e),r.quaternion.copy(n),r.castShadow=!1,r.receiveShadow=!0,i.add(r),r}function ci(i,t){const e=t.p.clone().sub(i.p).normalize(),n=Nh.crossVectors(We,e).normalize();let s=e.clone().cross(n).normalize();const r=(i.bank+t.bank)*.5;if(Math.abs(r)>.001){const c=new Kn().setFromAxisAngle(e,r);n.applyQuaternion(c),s.applyQuaternion(c)}const a=new ue().makeBasis(n,s,e),o=new Kn().setFromRotationMatrix(a);return{tangent:e,sideways:n,normal:s,q:o}}function Pl(i,t,e,n){const r=[],a=[],o=[],c=tt.width*.47;let l=0;for(let f=t;f<=e;f+=8){const p=he(Math.min(f,e)),g=ci(p,he(p.s+2)),y=Math.sin(f*.018)*.04,m=p.p.clone().addScaledVector(g.sideways,-c).addScaledVector(g.normal,.46+y),h=p.p.clone().addScaledVector(g.sideways,c).addScaledVector(g.normal,.46-y);r.push(m.x,m.y,m.z,h.x,h.y,h.z);const S=(f-t)/64;if(a.push(0,S,1,S),l>0){const M=(l-1)*2,b=l*2;o.push(M,M+1,b,M+1,b+1,b)}l++}const d=new De;d.setAttribute("position",new re(r,3)),d.setAttribute("uv",new re(a,2)),d.setIndex(o),d.computeVertexNormals();const u=new X(d,n);u.receiveShadow=!0,i.add(u)}function Bg(i,t){let e=0;for(const n of tt.gaps)Pl(i,e,Math.max(e,n.start-4),t),e=n.end+4;Pl(i,e,tt.length,t)}function zg(i,t,e){const n=he(t.s+2),{normal:s,q:r}=ci(t,n),a=new le;a.position.copy(t.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new X(new Lt(.55,.12,5.2),e);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const c=new X(new Lt(.55,.12,5.2),e);c.position.set(1.25,0,0),c.rotation.y=.62,a.add(c);const l=new X(new Lt(.42,.1,3.8),e);l.position.set(0,.01,-1.9),a.add(l),i.add(a)}function kg(){const i=new le;zt.add(i);const t=new J({color:12171149,roughness:.72,metalness:.08}),e=new J({color:9869942,roughness:.78,metalness:.05}),n=new J({color:15255629,roughness:.28,metalness:.72}),s=new J({color:8204328,roughness:.3,metalness:.85}),r=new J({color:6120040,roughness:.5,metalness:.6}),a=new J({color:4080968,roughness:.58,metalness:.55}),o=new J({color:14270570,roughness:.35,metalness:.65}),c=new J({color:2435884,roughness:.48,metalness:.62}),l=new J({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new J({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new J({color:4935486,roughness:.92,metalness:.04}),f=new J({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),p=new J({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),g=new J({color:3159607,roughness:.7,metalness:.45}),y=new J({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),m=new J({color:15919561,roughness:.82,metalness:.02}),h=new J({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12}),S=new J({map:vg(),roughness:.74,metalness:.08}),M=new we({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),b=12;Bg(i,S);for(let E=0;E<tt.length;E+=b){if(Ri(E+b*.5))continue;const T=he(E),P=he(E+b),C=T.p.clone().add(P.p).multiplyScalar(.5),{sideways:w,normal:v,q:A}=ci(T,P),I=T.p.distanceTo(P.p)+.45,z=Math.floor(E/(b*2))%2?t:e;ye(i,new U(tt.width,.62,I),C.clone().addScaledVector(v,-.05),A,z),ye(i,new U(tt.width-2.8,.08,I*.86),C.clone().addScaledVector(v,.36),A,u),ye(i,new U(.2,.1,I*.76),C.clone().addScaledVector(w,-tt.width*.19).addScaledVector(v,.43),A,u),ye(i,new U(.2,.1,I*.76),C.clone().addScaledVector(w,tt.width*.19).addScaledVector(v,.43),A,u),E%48===0&&(ye(i,new U(.14,.08,I*.62),C.clone().addScaledVector(w,-tt.width*.08).addScaledVector(v,.51),A,y),ye(i,new U(.14,.08,I*.62),C.clone().addScaledVector(w,tt.width*.08).addScaledVector(v,.51),A,y)),E%120===0&&ye(i,new U(tt.width*.42,.07,.72),C.clone().addScaledVector(v,.55),A,m),ye(i,new U(tt.width+1.2,.35,I*.94),C.clone().addScaledVector(v,-.56),A,a),ye(i,new U(.42,.42,I*.9),C.clone().addScaledVector(w,-tt.width*.36).addScaledVector(v,-.78),A,g),ye(i,new U(.42,.42,I*.9),C.clone().addScaledVector(w,tt.width*.36).addScaledVector(v,-.78),A,g);const H=C.clone().addScaledVector(w,-tt.width*.51),W=C.clone().addScaledVector(w,tt.width*.51);if(ye(i,new U(.32,.46,I),H.clone().addScaledVector(v,.28),A,n),ye(i,new U(.32,.46,I),W.clone().addScaledVector(v,.28),A,n),ye(i,new U(.26,.72,I*.94),H.clone().addScaledVector(v,-.22),A,a),ye(i,new U(.26,.72,I*.94),W.clone().addScaledVector(v,-.22),A,a),E%36===0)for(const Y of[-tt.width*.39,-tt.width*.2,tt.width*.2,tt.width*.39]){const st=new X(new ge(.16,.2,.12,10),o);st.position.copy(C).addScaledVector(w,Y).addScaledVector(v,.46),st.quaternion.copy(A),st.castShadow=!1,i.add(st)}if(E%72===0&&(ye(i,new U(.34,1.56,3.4),C.clone().addScaledVector(w,-tt.width*.66).addScaledVector(v,1.16),A,s),ye(i,new U(.34,1.56,3.4),C.clone().addScaledVector(w,tt.width*.66).addScaledVector(v,1.16),A,s),ye(i,new U(.18,.18,4.4),C.clone().addScaledVector(w,-tt.width*.62).addScaledVector(v,1.94),A,s),ye(i,new U(.18,.18,4.4),C.clone().addScaledVector(w,tt.width*.62).addScaledVector(v,1.94),A,s),ye(i,new U(.12,.12,4),C.clone().addScaledVector(w,-tt.width*.62).addScaledVector(v,1.38),A,n),ye(i,new U(.12,.12,4),C.clone().addScaledVector(w,tt.width*.62).addScaledVector(v,1.38),A,n),mn(i,C.clone().addScaledVector(w,-tt.width*.58).addScaledVector(v,-1.08),C.clone().addScaledVector(w,tt.width*.58).addScaledVector(v,-1.08),.11,c),mn(i,C.clone().addScaledVector(w,-tt.width*.48).addScaledVector(v,-1),C.clone().addScaledVector(w,0).addScaledVector(v,-2.2),.09,c),mn(i,C.clone().addScaledVector(w,tt.width*.48).addScaledVector(v,-1),C.clone().addScaledVector(w,0).addScaledVector(v,-2.2),.09,c)),E%96===0){const Y=new X(new Rn(1,28),M);Y.rotation.x=-Math.PI/2,Y.position.set(C.x,-4.72,C.z),Y.scale.set(tt.width*.9,Math.max(10,I*2.2),1),Y.rotation.z=Math.atan2(ci(T,P).tangent.x,ci(T,P).tangent.z),i.add(Y)}if(E%144===0){const Y=C.clone().addScaledVector(w,-tt.width*.74).addScaledVector(v,2),st=C.clone().addScaledVector(w,tt.width*.74).addScaledVector(v,2);mn(i,Y.clone().addScaledVector(v,-1.2),Y.clone().addScaledVector(v,1.1),.12,s),mn(i,st.clone().addScaledVector(v,-1.2),st.clone().addScaledVector(v,1.1),.12,s),ye(i,new U(.46,.72,.46),Y.clone().addScaledVector(v,1.15),A,l),ye(i,new U(.46,.72,.46),st.clone().addScaledVector(v,1.15),A,l)}if(E%288===0){const Y=C.clone().addScaledVector(w,(Math.floor(E/144)%2?1:-1)*tt.width*.92).addScaledVector(v,5.2);ye(i,new U(.44,.44,.44),Y.clone(),A,f),mn(i,Y.clone().addScaledVector(v,-.2),C.clone().addScaledVector(v,1),.05,c)}if(E%168===0){const Y=Math.max(18,C.y+8),st=new U(C.x,C.y-Y/2-.8,C.z),K=new X(new ge(.8,1.3,Y,8),r);K.position.copy(st),K.castShadow=!0,K.receiveShadow=!0,i.add(K);const ut=new X(new ge(2.2,2.7,.34,12),r);ut.position.set(C.x,C.y-Y-.95,C.z),ut.receiveShadow=!0,i.add(ut),Yn.push({x:C.x,z:C.z,hw:2.6,hd:2.6,maxY:C.y-1.2});for(const Zt of[-.35,-1.05]){const ie=new X(new ge(.86,.92,.28,8),h);ie.position.set(C.x,C.y-Y*.18+Zt,C.z),ie.receiveShadow=!0,i.add(ie)}const ft=C.clone().addScaledVector(v,-.7),Ct=new U(C.x,C.y-Y*.54,C.z);mn(i,Ct.clone(),ft.clone().addScaledVector(w,-tt.width*.38),.13,c),mn(i,Ct.clone(),ft.clone().addScaledVector(w,tt.width*.38),.13,c),mn(i,Ct.clone().addScaledVector(w,-1.1),ft.clone().addScaledVector(w,.1).addScaledVector(v,-1.1),.08,c),mn(i,Ct.clone().addScaledVector(w,1.1),ft.clone().addScaledVector(w,-.1).addScaledVector(v,-1.1),.08,c)}E%168===0&&!Ri(E+16)&&zg(i,he(E+5),d)}for(const E of tt.gaps){const T=he(E.start-3),P=he(E.end+3);for(const C of[T,P]){const w=he(C.s+2),{normal:v,q:A}=ci(C,w);ye(i,new U(tt.width-1.2,.08,4.6),C.p.clone().addScaledVector(v,.54),A,l),ye(i,new U(tt.width*.62,.09,1.3),C.p.clone().addScaledVector(v,.62).addScaledVector(C.tangent,C===T?-6.3:6.3),A,m);for(const I of[-tt.width*.42,0,tt.width*.42]){const z=C.p.clone().addScaledVector(C.side,I).addScaledVector(v,2.35);ye(i,new U(.46,.46,.46),z,A,I===0?p:l)}}}return i}function zh(i=13710372,t=7740696){const e=new le,n=new J({color:i,roughness:.32,metalness:.28}),s=new J({color:t,roughness:.42,metalness:.22}),r=new J({color:328965,roughness:.65}),a=new J({color:13621729,roughness:.18,metalness:.75}),o=new J({color:8840447,roughness:.08,metalness:.05,transparent:!0,opacity:.55}),c=new J({color:16722974,roughness:.18,metalness:.05,emissive:16719122,emissiveIntensity:1.1}),l=new J({color:16773285,roughness:.22,metalness:.05,emissive:16765019,emissiveIntensity:.7}),d=new J({color:16773820,roughness:.28,metalness:.2}),u=new J({color:2697513,roughness:.34,metalness:.72}),f=new X(new Rn(3.2,28),new we({color:0,transparent:!0,opacity:.22,depthWrite:!1}));f.rotation.x=-Math.PI/2,f.position.y=.08,f.scale.z=1.8,e.add(f);const p=new X(new Lt(4.4,1,7.4),n);p.position.y=1,e.add(p);const g=new X(new Lt(.72,.06,7.62),d);g.position.set(0,1.54,.05),e.add(g);for(const T of[-2.32,2.32]){const P=new X(new Lt(.52,.54,3.2),s);P.position.set(T,.92,.85),e.add(P)}const y=new X(new Lt(4.9,.28,7.8),r);y.position.set(0,.54,.15),e.add(y);const m=new X(new Lt(2.7,.8,3.1),n);m.position.set(0,.82,-4.2),e.add(m);const h=new X(new Lt(4.8,.14,.8),r);h.position.set(0,.42,-5.55),e.add(h);const S=new X(new Lt(2.1,.78,1.9),o);S.position.set(0,1.72,-.72),S.rotation.x=-.08,e.add(S);const M=new X(new Lt(2.14,.08,.08),a);M.position.set(0,2.04,-1.48),M.rotation.x=-.08,e.add(M);const b=new X(new Lt(5.8,.22,1.1),s);b.position.set(0,1.84,3.9),e.add(b);for(const T of[-2.25,2.25]){const P=new X(new Lt(.28,1.1,1.3),s);P.position.set(T,1.3,3.75),P.rotation.z=T<0?-.12:.12,e.add(P)}const E=[];for(const T of[-2.4,2.4])for(const P of[-2.3,2.6]){const C=new le;C.position.set(T,.52,P);const w=new X(new ge(.78,.78,.55,18),r);w.rotation.z=Math.PI/2,C.add(w);const v=new X(new ge(.34,.34,.6,12),a);v.rotation.z=Math.PI/2,C.add(v);const A=new X(new ge(.48,.48,.08,16),u);A.rotation.z=Math.PI/2,A.position.set(T>0?-.04:.04,0,0),C.add(A);const I=new X(new Zs(.78,.055,8,20),r);I.rotation.y=Math.PI/2,C.add(I),e.add(C),P<0&&E.push(C)}e.userData.frontWheels=E;for(let T=0;T<4;T++){const P=new X(new ge(.12,.12,2.4,10),a);P.rotation.x=Math.PI/2,P.position.set(-.9+T*.6,1.62,-2.7),e.add(P)}for(const T of[-1.35,1.35]){const P=new X(new Lt(.62,.26,.16),c);P.position.set(T,1.05,3.82),e.add(P);const C=new X(new Lt(.5,.22,.12),l);C.position.set(T,.86,-5.72),e.add(C)}return e.traverse(T=>{T.castShadow=!0,T.receiveShadow=!0}),zt.add(e),e}function Vg(){const i=new le,t=new J({color:9383205,roughness:.35,metalness:.55}),e=new J({color:460551,roughness:.55}),n=new J({color:12375772,roughness:.18,metalness:.9}),s=new J({color:16767297,roughness:.38,metalness:.25}),r=new J({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new J({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.16}),o=new J({color:1118995,roughness:.7,metalness:.05}),c=new X(new Lt(2.2,.24,2.2),t);c.position.set(0,-.78,-2.2),i.add(c);const l=new X(new Lt(.16,.028,1.92),n);l.position.set(0,-.64,-2.28),i.add(l);const d=new X(new Lt(2.55,.18,.52),e);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,i.add(d);const u=new X(new Ie(2.8,.82,1,1),a);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,i.add(u);const f=new X(new Zs(.36,.035,12,48),o);f.position.set(0,-.46,-1.02),f.rotation.x=Math.PI/2.75,i.add(f);for(let p=0;p<3;p++){const g=new X(new Lt(.34,.025,.035),n);g.position.copy(f.position),g.rotation.copy(f.rotation),g.rotation.z+=p/3*Math.PI*2,i.add(g)}for(let p=0;p<6;p++){const g=new X(new ge(.16,.16,.56,18),n);g.rotation.z=Math.PI/2,g.position.set(-.78+p*.31,-.42+Math.sin(p)*.03,-2.12),i.add(g)}for(const p of[-1.08,1.08]){const g=new X(new ge(.34,.34,.25,18),e);g.rotation.z=Math.PI/2,g.position.set(p,-.68,-1.58),i.add(g);const y=new X(new Zs(.22,.035,8,28),s);y.scale.set(.72,1.25,.72),y.position.set(p*.8,-.48,-1.74),y.rotation.x=Math.PI/2,i.add(y)}for(const p of[-1.14,-.84,.84,1.14]){const g=new X(new ge(.035,.04,.028,8),n);g.position.set(p,-.39,-1.28),g.rotation.x=Math.PI/2,i.add(g)}for(const p of[-.52,.52]){const g=new X(new je(.045,12,8),r);g.position.set(p,-.34,-1.22),i.add(g)}i.position.set(0,0,0),Jt.add(i),Jn=i}function Gg(){const i=new J({color:16119285,roughness:.35,metalness:.25}),t=new J({color:1184274,roughness:.45}),e=new J({map:_g(),roughness:.42,metalness:.05}),n=new J({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=he(0),r=new ue().makeBasis(s.side,We,s.tangent),a=new Kn().setFromRotationMatrix(r),o=new le;for(const d of[-tt.width*.58,tt.width*.58]){const u=new X(new Lt(.8,11,.8),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(We,5.4),u.quaternion.copy(a),o.add(u)}const c=new X(new Lt(tt.width+3,.8,1),e);c.position.copy(s.p).addScaledVector(We,11.2),c.quaternion.copy(a),o.add(c);const l=new X(new Lt(tt.width+1.2,1.4,.18),t);l.position.copy(s.p).addScaledVector(We,12.5).addScaledVector(s.tangent,-.55),l.quaternion.copy(a),o.add(l);for(const d of[-tt.width*.38,0,tt.width*.38]){const u=new X(new je(.32,16,10),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(We,10.25),o.add(u)}return zt.add(o),o}const Ns=zh(),An=zh(3108784,1916782);An.visible=!1;Rg();Cg();Pg();Lg();Dg();let Ll=null,Dl=null,Il=null,Jn=null;Vg();function Da(i){i&&(i.traverse(t=>{if(t.geometry&&t.geometry.dispose(),t.material){const e=Array.isArray(t.material)?t.material:[t.material];for(const n of e)n.map&&n.map.dispose(),n.dispose()}}),zt.remove(i))}function ac(i){return Ir=It.clamp(i,0,ls.length-1),tt=ls[Ir],Yn.length=0,Yr.length=0,Da(Ll),Da(Dl),Da(Il),Ll=kg(),Dl=Gg(),Il=Ug(),Nt.trackName.textContent=tt.name,Nt.courseName&&(Nt.courseName.textContent=tt.name),Nt.courseButtons.forEach(t=>{t.classList.toggle("active",Number(t.dataset.course)===Ir)}),tt.name}ac(0);const ps=new ag(Qe);ps.addPass(new og(zt,Jt));const kh=new cs(new xt(window.innerWidth,window.innerHeight),.34,.78,1);ps.addPass(kh);ps.addPass(new lg);const Hg={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},Cs=new Ih(Hg);ps.addPass(Cs);const Wg=new J({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),Nr=Array.from({length:72},()=>{const i=new X(new je(.1,8,5),Wg);return i.visible=!1,zt.add(i),{mesh:i,life:0,velocity:new U}});let $n=null;function Vh(){if($n)return;const i=new AudioContext,t=i.createOscillator(),e=i.createGain(),n=i.createBiquadFilter();t.type="sawtooth",n.type="lowpass",n.frequency.value=540,t.frequency.value=70,e.gain.value=1e-4,t.connect(n).connect(e).connect(i.destination),t.start(),$n={ctx:i,engine:t,engineGain:e,filter:n,nextNote:0,beat:0}}function Vr(){$n||Vh(),$n?.ctx.state==="suspended"&&$n.ctx.resume().catch(()=>{})}function Ul(i){if(!$n)return;const{ctx:t}=$n,e=t.createOscillator(),n=t.createGain();e.type="sine",e.frequency.value=55+i*2.6,n.gain.setValueAtTime(Math.min(.34,i/55),t.currentTime),n.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+.23),e.connect(n).connect(t.destination),e.start(),e.stop(t.currentTime+.24)}function Nl(i,t=18){const e=Math.min(t,Nr.length);for(let n=0;n<e;n++){const s=Nr.find(r=>r.life<=0)||Nr[n];s.mesh.visible=!0,s.mesh.position.copy(i),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function Xg(i){for(const t of Nr){if(t.life<=0)continue;t.life-=i,t.velocity.y-=26*i,t.mesh.position.addScaledVector(t.velocity,i);const e=Math.max(.01,t.life*2.4);t.mesh.scale.setScalar(e),t.life<=0&&(t.mesh.visible=!1)}}function qg(i){if(!$n)return;const{ctx:t,engine:e,engineGain:n,filter:s}=$n;e.frequency.setTargetAtTime(62+x.speed*2.9+(Qt.has("ShiftLeft")||Qt.has("ShiftRight")?60:0),t.currentTime,.04),s.frequency.setTargetAtTime(480+x.speed*9,t.currentTime,.08);const r=x.mode==="race"||x.mode==="roam";n.gain.setTargetAtTime(r?.036+Math.abs(x.speed)/4200:1e-4,t.currentTime,.08)}function Zr(i=!1,t=!1){Vh(),Qt.clear(),Gr();const e=i||t;Object.assign(x,{mode:"race",practice:e,freeRun:t,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:e?-900:-28,rivalDistance:e?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:t?"Free run — course check":i?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:e?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const n=he(x.s);x.y=n.p.y+2.1,x.yVel=0,Nt.menu.classList.add("hidden"),Nt.result.classList.add("hidden"),Nt.resultStats.innerHTML="",Nt.position.textContent=t?"FREE RUN":i?"PRACTICE":"DIV 4",Nt.trackName.textContent=tt.name,An.visible=!1,Jn&&(Jn.visible=!0),window.__freeCam=!1}function Gh(){Vr(),x.mode="roam",x.practice=!0,x.freeRun=!1,Qt.clear(),Gr();let i=118,t=402;Xn(i,t,6).clearance<6&&(i=92,t=392),x.roamPos.set(i,ee(i,t),t),x.roamYaw=-.05,x.camYaw=x.roamYaw,x.camLookYaw=0,x.camLookPitch=0,x.cameraZoom=0,_t.zoom=0,x.wheelSteer=0,x.speed=0,x.boost=1,x.damage=0,x.cameraShake=0,x.message="",x.messageTimer=0,Ns.visible=!1,An.visible=!0,Jn&&(Jn.visible=!1),window.__freeCam=!1,Nt.menu.classList.add("hidden"),Nt.result.classList.add("hidden"),Nt.position.textContent="FREE ROAM",Nt.trackName.textContent="City Streets",$r();const e=Math.sin(x.roamYaw),n=-Math.cos(x.roamYaw);Jt.position.set(x.roamPos.x-e*18,x.roamPos.y+8.5,x.roamPos.z-n*18),Jt.lookAt(x.roamPos.x+e*12,x.roamPos.y+2.6,x.roamPos.z+n*12),Jt.fov=70,Jt.updateProjectionMatrix()}function $r(){An.position.set(x.roamPos.x,x.roamPos.y+.3,x.roamPos.z),An.quaternion.setFromAxisAngle(We,-x.roamYaw)}function Yg(i,t){let e=null;for(const s of Yr)for(const r of s.segments){const a=i-r.a.x,o=t-r.a.z,c=It.clamp((a*r.abx+o*r.abz)/r.lenSq,0,1),l=r.a.x+r.abx*c,d=r.a.z+r.abz*c,u=Math.hypot(i-l,t-d);if(u>s.halfW+Fs*.55)continue;const f=It.lerp(r.a.y,r.b.y,c),p=It.lerp(r.u0,r.u1,c),g=u+Math.max(0,ee(i,t)-f)*.2;(!e||g<e.score)&&(e={kind:"ramp",y:f,u:p,ramp:s,mergeS:s.mergeS,dirSel:s.dirSel,tangentX:r.abx,tangentZ:r.abz,lateral:s.dirSel*tt.width*.34,score:g})}if(!e)return null;const n=Math.max(1e-4,Math.hypot(e.tangentX,e.tangentZ));return e.tangentX/=n,e.tangentZ/=n,e}function Zg(i,t,e=ee(i,t)){let n=null;const s=10;for(let a=0;a<tt.length;a+=s){if(Ri(a+s*.5))continue;const o=he(a),c=he(a+s),l=c.p.x-o.p.x,d=c.p.z-o.p.z,u=Math.max(1e-4,l*l+d*d),f=It.clamp(((i-o.p.x)*l+(t-o.p.z)*d)/u,0,1),p=o.p.x+l*f,g=o.p.z+d*f,y=i-p,m=t-g,h=Math.hypot(y,m);if(h>tt.width*.5+Fs*.45)continue;const S=It.lerp(o.p.y,c.p.y,f)+.58;if(e<S-5)continue;const M=new U(d,0,-l).normalize(),b=It.clamp(y*M.x+m*M.z,-tt.width*.44,tt.width*.44);(!n||h<n.dist)&&(n={kind:"track",y:S,s:a+s*f,lateral:b,tangentX:l,tangentZ:d,dist:h})}if(!n)return null;const r=Math.max(1e-4,Math.hypot(n.tangentX,n.tangentZ));return n.tangentX/=r,n.tangentZ/=r,n}function wi(i,t,e=x.roamPos.y){const n=ee(i,t);let s={kind:"ground",y:n};const r=Yg(i,t);r&&r.y>=n-.6&&(s=r);const a=Zg(i,t,Math.max(e,s.y));return a&&a.y>=s.y-.8&&(s=a),s}function Fl(i){const t=Math.sin(x.roamYaw)*i.tangentX+-Math.cos(x.roamYaw)*i.tangentZ;if(x.speed<10||t<.22)return!1;const e=(i.mergeS??i.s??22)+8,n=he(e);return x.mode="race",x.practice=!0,x.freeRun=!0,x.breakdownTimer=0,x.s=n.s,x.totalDistance=n.s,x.lastSafeS=n.s,x.lastSafeDistance=n.s,x.lateral=It.clamp(i.lateral??0,-tt.width*.32,tt.width*.32),x.lateralVel=-Math.sign(x.lateral)*Math.min(4,Math.abs(x.speed)*.04),x.speed=It.clamp(Math.max(28,x.speed),18,112),x.grounded=!0,x.y=n.p.y+2.1,x.yVel=0,x.airtime=0,x.rivalS=-900,x.rivalDistance=-900,x.leadState="SOLO",x.message="Merged onto the ribbon",x.messageTimer=1.6,x.cameraShake=Math.max(x.cameraShake,.35),Ns.visible=!1,An.visible=!1,Jn&&(Jn.visible=!0),Nt.position.textContent="FREE RUN",Nt.trackName.textContent=tt.name,$r(),!0}function Hh(i){const t=Math.max(Qt.has("KeyW")||Qt.has("ArrowUp")?1:0,_t.throttle),e=Math.max(Qt.has("KeyS")||Qt.has("ArrowDown")?1:0,_t.brake),n=It.clamp((Qt.has("KeyD")||Qt.has("ArrowRight")?1:0)-(Qt.has("KeyA")||Qt.has("ArrowLeft")?1:0)+_t.steer,-1,1),s=(Qt.has("ShiftLeft")||Qt.has("ShiftRight"))&&x.boost>.02&&t>.03;if(t>.03){const g=x.speed<0?38:0;x.speed+=((s?52:30)+g)*t*i}e>.03&&(x.speed-=(x.speed>1.2?64:30)*e*i),x.speed-=.0026*x.speed*Math.abs(x.speed)*i,Math.abs(x.speed)>.08?x.speed-=Math.sign(x.speed)*4.2*i:t<=.03&&e<=.03&&(x.speed=0),x.speed=It.clamp(x.speed,-22,120),x.boosting=s,s?x.boost=Math.max(0,x.boost-i*.22):x.boost=Math.min(1,x.boost+i*.05),x.wheelSteer+=(n-x.wheelSteer)*(1-Math.pow(1e-5,i));const r=-x.wheelSteer*.55,a=An.userData.frontWheels;a&&(a[0].rotation.y=r,a[1].rotation.y=r);const o=Math.abs(x.speed);if(o>Ro){const g=It.clamp((o-Ro)/5,0,1),y=1-.45*It.clamp((o-28)/70,0,1),m=ug*g*y;x.roamYaw+=x.wheelSteer*m*i*Math.sign(x.speed)}const c=Math.sin(x.roamYaw),l=-Math.cos(x.roamYaw),d=Math.abs(x.speed)*i,u=Math.max(1,Math.ceil(d/1.2));let f=!1,p=wi(x.roamPos.x,x.roamPos.z,x.roamPos.y);for(let g=0;g<u;g++)x.roamPos.x+=c*x.speed*i/u,x.roamPos.z+=l*x.speed*i/u,p=wi(x.roamPos.x,x.roamPos.z,x.roamPos.y),x.roamPos.y=p.y+es,Kg(x.roamPos,p)&&(f=!0),p=wi(x.roamPos.x,x.roamPos.z,x.roamPos.y),x.roamPos.y=p.y+es;x.roamPos.x=It.clamp(x.roamPos.x,-820,820),x.roamPos.z=It.clamp(x.roamPos.z,-1620,480),f&&(x.speed*=.35),p=wi(x.roamPos.x,x.roamPos.z,x.roamPos.y),x.roamPos.y=p.y+es,!(p.kind==="ramp"&&p.u>.86&&Fl(p))&&(p.kind==="track"&&Fl(p)||($r(),Qt.has("KeyR")&&(Gh(),Qt.delete("KeyR"))))}const Fs=2.6;function Ia(i,t){let e=!1;for(let n=0;n<t.length;n++){const s=t[n];if(s.maxY!=null&&i.y>s.maxY+es+.45)continue;if(s.radius){const u=s.radius+Fs,f=i.x-s.x,p=i.z-s.z,g=f*f+p*p;if(g>=u*u)continue;e=!0;const y=Math.max(1e-4,Math.sqrt(g));i.x=s.x+f/y*u,i.z=s.z+p/y*u;continue}const r=s.hw+Fs,a=s.hd+Fs,o=i.x-s.x,c=i.z-s.z;if(Math.abs(o)>=r||Math.abs(c)>=a)continue;e=!0;const l=r-Math.abs(o),d=a-Math.abs(c);l<d?i.x=s.x+(o<0?-r:r):i.z=s.z+(c<0?-a:a)}return e}function $g(i,t,e=0){return t.maxY!=null&&i.y>t.maxY+es+.45?!1:t.radius?Math.hypot(i.x-t.x,i.z-t.z)<t.radius+e:Math.abs(i.x-t.x)<t.hw+e&&Math.abs(i.z-t.z)<t.hd+e}function Kg(i,t=null){let e=!1;for(let n=0;n<2;n++){const s=Ia(i,oi),r=t?.kind==="ground"?Ia(i,Yn):!1,a=Ia(i,Us);if(!s&&!r&&!a)break;e=!0}return e}function Wh(i){const t=_t.lookX*1.18,e=_t.lookY*.58;x.camLookYaw+=(t-x.camLookYaw)*(1-Math.pow(.002,i)),x.camLookPitch+=(e-x.camLookPitch)*(1-Math.pow(.002,i)),x.cameraZoom+=(_t.zoom-x.cameraZoom)*(1-Math.pow(.018,i))}function Xh(i){if(window.__freeCam)return;if(Wh(i),Math.abs(x.speed)>Ro){let u=x.roamYaw-x.camYaw;u=Math.atan2(Math.sin(u),Math.cos(u)),x.camYaw+=u*(1-Math.pow(.08,i))}const t=x.camYaw+x.camLookYaw,e=Math.sin(t),n=-Math.cos(t),s=x.roamPos,r=It.clamp(x.cameraZoom,-.42,.9),a=(18+Math.abs(x.speed)*.08)*(1+r*.72),o=8.5+Math.max(0,r)*4.4-Math.min(0,r)*2+x.camLookPitch*5.8,c=Fh.set(s.x-e*a,s.y+o,s.z-n*a);c.y=Math.max(c.y,ee(c.x,c.z)+3.5),Jt.position.lerp(c,1-Math.pow(.0023,i));const l=ic.set(s.x+e*(12-Math.min(r,0)*6),s.y+2.6+x.camLookPitch*13.5,s.z+n*(12-Math.min(r,0)*6));Mn.position.copy(Jt.position),Mn.lookAt(l),Mn.rotateY(Math.PI),Jt.quaternion.slerp(Mn.quaternion,1-Math.pow(.05,i));const d=70+Math.min(8,Math.abs(x.speed)*.05)+r*10;Math.abs(Jt.fov-d)>.02&&(Jt.fov+=(d-Jt.fov)*(1-Math.pow(.01,i)),Jt.updateProjectionMatrix())}function qh(i){if(x.mode==="result")return;x.mode="result";const t=Math.max(0,Math.round(x.score-x.damage*9+Math.max(0,220-x.time)*45));t>x.best&&(x.best=t,localStorage.setItem("steel-ribbon-best",String(t))),Nt.best.textContent=`Best score ${x.best}`,Nt.resultText.textContent=`${i} Score ${t}. Time ${Po(x.time)}. Damage ${Math.round(x.damage)}%.`;const e=Number.isFinite(x.bestLap)?Po(x.bestLap):"--:--.-";Nt.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${e}</b>
    <b>Clean landings: ${x.cleanLandings}</b>
    <b>Hard landings: ${x.hardLandings}</b>
    <b>Recoveries: ${x.recoveries}</b>
    <b>Near edges: ${Math.round(x.nearMisses)}</b>
  `,Nt.result.classList.remove("hidden")}function Ol(i="Craned back to the ribbon"){const t=he(x.lastSafeS);x.s=x.lastSafeS,x.totalDistance=x.lastSafeDistance,x.lateral=0,x.lateralVel=0,x.y=t.p.y+2.1,x.yVel=0,x.speed=Math.max(16,x.speed*.32),x.grounded=!0,x.cameraShake=1.2,x.message=i,x.messageTimer=1.4,x.recoveries+=1}function oc(i,t){return It.clamp(t*i.tangent.y,-48,48)}function Jg(i=94){return tt.gaps.map(t=>{const e=he(t.start),n=he(t.end+3),s=(t.end-t.start)/Math.max(1,i),r=oc(e,i),a=e.p.y+2.1+r*s-.5*31*s*s,o=n.p.y+2.1;return{name:t.name,start:t.start,end:t.end,length:t.end-t.start,lipGradeDeg:Math.round(It.radToDeg(e.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function Bl(i,t){x.grounded=!1,x.yVel=oc(i,x.speed),x.airtime=0,t&&(x.message=t)}window.__steelRibbonDebug={launchVelocityAt(i,t){return oc(he(i),t)},gapJumpReport(i){return Jg(i)},sceneryClearanceReport(){return Ag()},setSpeed(i){return x.speed=It.clamp(i,-14,156-x.damage*.42),Os(),x.speed},setTrackPosition(i,t=x.speed){const e=he(i);return x.totalDistance=i,x.s=e.s,x.lastSafeS=e.s,x.lastSafeDistance=i,x.lateral=0,x.lateralVel=0,x.y=e.p.y+2.1,x.yVel=0,x.grounded=!0,x.speed=It.clamp(t,-14,156-x.damage*.42),Os(),{s:x.s,totalDistance:x.totalDistance,speed:x.speed,y:x.y}},setDamage(i){return x.damage=It.clamp(i,0,99),Os(),x.damage},setCourse(i){return ac(i)},flyCam(i,t,e,n,s,r){return window.__freeCam=!0,Jt.position.set(i,t,e),Jt.lookAt(n,s,r),Jt.fov=62,Jt.updateProjectionMatrix(),"freecam"},listCourses(){return ls.map((i,t)=>({index:t,name:i.name,length:i.length,width:i.width,laps:i.laps,gaps:i.gaps.length}))},courseInfo(){return{index:Ir,name:tt.name,length:tt.length,width:tt.width,laps:tt.laps}},probeDown(i,t){const n=new pf(new U(i,400,t),new U(0,-1,0),0,1e3).intersectObjects(zt.children,!0).map(r=>({y:+r.point.y.toFixed(2),name:r.object.material?.color?"#"+r.object.material.color.getHexString():"?"})),s=wi(i,t,400);return{x:i,z:t,ground:+ee(i,t).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:n.slice(0,5)}},rampSurfaceReport(){return Yr.map((i,t)=>{const e=i.points[0],n=i.points[i.points.length-1],s=i.points[i.points.length/2|0],r=i.segments[0],a=i.segments[i.segments.length-1],o=Math.atan2(r.abx,-r.abz);return{index:t,mergeS:i.mergeS,halfW:i.halfW,start:{x:+e.x.toFixed(2),y:+e.y.toFixed(2),z:+e.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2)},climb:+(n.y-e.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(a.abx,-a.abz).toFixed(4)}})},colliderSample(i=8){return oi.slice(0,i).map(t=>({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1)}))},pylonColliderSample(i=8){return Yn.filter(t=>t.hw).slice(0,i).map(t=>({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1)}))},rockColliderSample(i=8){return Us.concat(Yn.filter(t=>t.kind==="rock")).slice(0,i).map(t=>({kind:t.kind||"prop",x:+t.x.toFixed(1),z:+t.z.toFixed(1),radius:t.radius?+t.radius.toFixed(1):null}))},setRoamPose(i,t,e){const n=wi(i,t,x.roamPos.y);x.roamPos.set(i,n.y+es,t),x.roamYaw=e,x.camYaw=e,x.camLookYaw=0,x.camLookPitch=0,x.wheelSteer=0,x.speed=0,$r();const s=Math.sin(x.roamYaw),r=-Math.cos(x.roamYaw);return Jt.position.set(x.roamPos.x-s*18,x.roamPos.y+8.5,x.roamPos.z-r*18),Jt.lookAt(x.roamPos.x+s*12,x.roamPos.y+2.6,x.roamPos.z+r*12),Jt.fov=70,Jt.updateProjectionMatrix(),this.roamReport()},setTouchCamera(i=0,t=0,e=_t.zoom,n=30){_t.lookX=It.clamp(i,-1,1),_t.lookY=It.clamp(t,-1,1),_t.zoom=It.clamp(e,-.42,.9);for(let s=0;s<n;s++)x.mode==="roam"?Xh(1/60):cc(1/60);return this.roamReport()},simulateRoamDrive(i=1,t=0,e=0,n=0){if(x.mode!=="roam")return this.roamReport();const s={steer:_t.steer,throttle:_t.throttle,brake:_t.brake};_t.steer=It.clamp(t,-1,1),_t.throttle=It.clamp(e,0,1),_t.brake=It.clamp(n,0,1);const r=1/60;let a=Math.max(0,Math.min(i,8));for(;a>0;){const o=Math.min(r,a);if(Hh(o),x.mode!=="roam")break;a-=o}return _t.steer=s.steer,_t.throttle=s.throttle,_t.brake=s.brake,this.roamReport()},roamReport(){const i=x.roamPos,t=Fh.set(0,0,-1).applyQuaternion(An.quaternion).normalize(),e=ic.set(Math.sin(x.roamYaw),0,-Math.cos(x.roamYaw)).normalize(),n=wi(i.x,i.z,i.y);return{mode:x.mode,s:+x.s.toFixed(2),totalDistance:+x.totalDistance.toFixed(2),x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2),yaw:+x.roamYaw.toFixed(3),camYaw:+x.camYaw.toFixed(3),speed:+x.speed.toFixed(2),groundXZ:+ee(i.x,i.z).toFixed(2),surface:n.kind,surfaceY:+n.y.toFixed(2),camX:+Jt.position.x.toFixed(2),camY:+Jt.position.y.toFixed(2),camZ:+Jt.position.z.toFixed(2),fov:+Jt.fov.toFixed(2),lookYaw:+x.camLookYaw.toFixed(3),lookPitch:+x.camLookPitch.toFixed(3),cameraZoom:+x.cameraZoom.toFixed(3),colliders:oi.length+Yn.length+Us.length,insideBuilding:oi.concat(Yn,Us).some(s=>$g(i,s)),carForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},driveForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},wheelRotY:An.userData.frontWheels?+An.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function jg(i){if(x.mode!=="race")return;x.time+=i,x.freeRun&&(x.damage=0);const t=x.breakdownTimer>0;t&&(x.breakdownTimer-=i,x.breakdownTimer<=0&&(x.damage=55,x.message="Patched up — back on it",x.messageTimer=1.2));const e=Math.max(Qt.has("KeyW")||Qt.has("ArrowUp")?1:0,_t.throttle),n=Math.max(Qt.has("KeyS")||Qt.has("ArrowDown")?1:0,_t.brake),s=It.clamp((Qt.has("KeyD")||Qt.has("ArrowRight")?1:0)-(Qt.has("KeyA")||Qt.has("ArrowLeft")?1:0)+_t.steer,-1,1),r=e>.03&&!t,a=(Qt.has("ShiftLeft")||Qt.has("ShiftRight"))&&x.boost>.02&&r&&x.grounded,o=he(x.s),c=o.p.y+2.1,l=Math.abs(x.speed);if(r){const h=x.speed<0?40:0;x.speed+=((a?68:40)+h)*e*i}if(n>.03){const h=x.speed>1.2?70:26;x.speed-=h*n*i}const d=x.grounded?.0024:.0011;x.speed-=d*x.speed*l*i,l>.08?x.speed-=Math.sign(x.speed)*(x.grounded?2.2:.3)*i:e<=.03&&n<=.03&&(x.speed=0),x.speed=It.clamp(x.speed,-16,156-x.damage*.8),t&&(x.speed=Math.min(x.speed,14)),x.boosting=a,a?(x.boost=Math.max(0,x.boost-i*.21),x.score+=28*i):x.boost=Math.min(1,x.boost+i*(x.grounded?.045:.018));const u=14+l*.12;x.lateralVel-=s*u*i,x.lateralVel-=x.lateralVel*(x.grounded?3.4:.7)*i,x.lateral+=x.lateralVel*i;const f=Ri(x.s),p=Math.abs(x.lateral)<tt.width*.52,g=!f&&p;if(x.grounded&&(!g||Math.abs(x.lateral)>tt.width*.5)&&Bl(o,p?"":"Edge slip"),x.grounded){const h=Math.sin(x.time*18)*Math.min(.22,Math.abs(x.speed)/700);x.y=It.lerp(x.y,c+h,.5),x.yVel=0,x.lastSafeS=x.s,x.lastSafeDistance=x.totalDistance,x.score+=Math.max(0,x.speed)*i*.34,Math.abs(x.lateral)>tt.width*.42&&(x.damage+=i*(1.2+Math.abs(x.speed)*.035),x.cameraShake=Math.max(x.cameraShake,.24),x.nearMisses+=i*.8,Math.random()<i*5&&Nl(o.p.clone().addScaledVector(o.side,Math.sign(x.lateral)*tt.width*.55).addScaledVector(We,1.2),4))}else{x.yVel-=31*i,x.y+=x.yVel*i,x.airtime+=i,x.score+=i*11;const h=he(x.s),S=h.p.y+2.1;if(!Ri(x.s)&&Math.abs(x.lateral)<tt.width*.55&&x.y<=S&&x.yVel<0){const b=-x.yVel,E=Math.abs(x.lateral)<tt.width*.34&&b<30;x.y=S,x.grounded=!0,x.yVel=0,x.lastSafeS=x.s,x.lastSafeDistance=x.totalDistance,x.damage+=Math.max(0,b-17)*.82+Math.max(0,Math.abs(x.lateral)-tt.width*.36)*1.8,x.score+=E?260+x.airtime*85:Math.max(30,120-b),x.cameraShake=Math.max(x.cameraShake,b/34),x.message=E?"Clean landing":"Hard landing",x.messageTimer=.9,E?x.cleanLandings+=1:x.hardLandings+=1,Ul(b),Nl(h.p.clone().addScaledVector(h.side,x.lateral).addScaledVector(We,.7),E?7:24),x.airtime=0}x.y<-55&&(x.damage+=28,Ol("Track crew recovery"))}const y=x.totalDistance;x.totalDistance+=x.speed*i,x.s=(x.totalDistance%tt.length+tt.length)%tt.length;const m=Math.floor(x.totalDistance/tt.length)+1;if(m>x.lap){const h=x.time-x.lapStartTime;x.splitTimes.push(h),x.bestLap=Math.min(x.bestLap,h),x.lapStartTime=x.time,x.lap=m,x.score+=1200,x.message=x.practice?`Lap ${x.lap}`:x.lap<=tt.laps?`Lap ${x.lap}`:"Season race complete",x.messageTimer=1.4,!x.practice&&x.lap>tt.laps&&qh(x.totalDistance>=x.rivalDistance?"You took the chequered gantry.":"You finished behind Crowther.")}for(const h of tt.gaps)gg(y,x.totalDistance,h.start)&&(x.message=h.name,x.messageTimer=1.1,x.grounded&&Bl(he(h.start),h.name));x.damage=It.clamp(x.damage,0,100),!x.freeRun&&x.damage>=90&&x.breakdownTimer<=0&&(x.breakdownTimer=2.6,x.message="Chassis cracked — limping to repair",x.messageTimer=1.6,x.cameraShake=Math.max(x.cameraShake,.8),Ul(40),x.damage=90),Qt.has("KeyR")&&(x.damage=Math.min(99,x.damage+8),Ol("Manual reset"),Qt.delete("KeyR"))}function Qg(i){if(x.mode==="race"&&!x.practice){const r=x.totalDistance-x.rivalDistance,a=It.clamp(r*.06,-12,16),o=Math.sin(x.time*.6)*5;x.rivalSpeed=It.clamp(92+a+o,70,120),x.rivalDistance+=x.rivalSpeed*i,x.rivalDistance>=tt.length*tt.laps&&x.lap<=tt.laps&&qh("Crowther reached the gantry first.")}x.rivalS=(x.rivalDistance%tt.length+tt.length)%tt.length;const t=he(x.rivalS),e=t.p.clone().addScaledVector(We,1.4).addScaledVector(t.side,Math.sin(x.rivalS*.02)*1.4);Ns.position.copy(e);const n=new ue().makeBasis(t.side,We,t.tangent);Ns.quaternion.setFromRotationMatrix(n);const s=Math.abs(x.rivalDistance-x.totalDistance)<26;Ns.visible=(x.mode==="race"||x.mode==="paused")&&!x.practice&&!s}function cc(i){if(window.__freeCam)return;Wh(i);const t=he(x.s),e=t.side.clone().multiplyScalar(x.lateral),n=t.p.clone().add(e);n.y=x.y;const s=x.cameraShake;s>.01&&(n.x+=(Math.random()-.5)*s*.8,n.y+=(Math.random()-.5)*s*.45),Jt.position.copy(n);const r=Math.abs(x.speed),a=68+Math.min(10,r*.055)+(Qt.has("ShiftLeft")||Qt.has("ShiftRight")?3:0)+x.cameraZoom*12;Math.abs(Jt.fov-a)>.02&&(Jt.fov+=(a-Jt.fov)*(1-Math.pow(.004,i)),Jt.updateProjectionMatrix());const o=he(x.s+34+x.speed*.16),c=o.p.clone().addScaledVector(o.side,x.lateral*.45);c.y+=1.7+x.camLookPitch*12+Math.sin(x.time*8)*Math.min(.2,r/680),Mn.position.copy(Jt.position),Mn.lookAt(c),Mn.rotateY(Math.PI),Mn.rotateY(-x.camLookYaw),Mn.rotateZ(-t.bank*.72-x.lateralVel*.006),Mn.rotateX(t.grade*.18+(x.grounded?0:It.clamp(x.yVel,-30,30)*-.006)),Jt.quaternion.slerp(Mn.quaternion,1-Math.pow(8e-4,i)),x.cameraShake=Math.max(0,x.cameraShake-i*1.9);const l=ic.set(0,0,-1).applyQuaternion(Jt.quaternion).normalize();window.__steelRibbonTelemetry={mode:x.mode,s:x.s,totalDistance:x.totalDistance,rivalDistance:x.rivalDistance,speed:x.speed,lap:x.lap,score:x.score,damage:x.damage,y:x.y,yVel:x.yVel,grounded:x.grounded,input:{steer:_t.steer,throttle:_t.throttle,brake:_t.brake},forwardWorld:{x:t.tangent.x,y:t.tangent.y,z:t.tangent.z},cameraWorld:{x:l.x,y:l.y,z:l.z}}}const Ti={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},Ts=[28,54,82,110,134,156];function t_(){const i=Math.abs(x.speed);let t=1;for(let o=0;o<Ts.length;o++)i>Ts[o]&&(t=o+2);t=Math.min(t,Ts.length);const e=t===1?0:Ts[t-2],n=Ts[t-1],s=n>e?It.clamp((i-e)/(n-e),0,1):0,r=t===1?Ti.idle:Ti.postShift;let a=r+s*(Ti.shift-r);return i<.4&&(a=Ti.idle),{gear:t,rpm:a}}let zl=performance.now(),Ua=0,Na=0;function Yh(i){const t=i.getContext("2d"),e=Math.min(2,window.devicePixelRatio||1),n=i.clientWidth||120,s=i.clientHeight||70;(i.width!==Math.round(n*e)||i.height!==Math.round(s*e))&&(i.width=Math.round(n*e),i.height=Math.round(s*e)),t.setTransform(e,0,0,e,0,0),t.clearRect(0,0,n,s);const r=n/2,a=s-s*.14,o=Math.min(n*.46,s*.9);return{ctx:t,w:n,h:s,cx:r,cy:a,R:o,aFor:d=>Math.PI-d*Math.PI,at:(d,u)=>[r+Math.cos(d)*u,a-Math.sin(d)*u]}}function e_(i,t){const e=Nt.speedo;if(!e)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=Yh(e),l=360;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke(),n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let g=0;g<=l;g+=20){const y=g/l,m=o(y),h=g%80===0;n.strokeStyle="rgba(180, 230, 255, 0.85)",n.lineWidth=h?Math.max(1.4,a*.035):Math.max(1,a*.02);const S=c(m,a-a*.02),M=c(m,a-a*(h?.18:.1));if(n.beginPath(),n.moveTo(S[0],S[1]),n.lineTo(M[0],M[1]),n.stroke(),h){const b=c(m,a-a*.34);n.fillStyle="#cfeeff",n.fillText(String(g/10),b[0],b[1])}}const d=It.clamp(i/l,0,1),u=o(d),f=c(u,a-a*.06),p=c(u+Math.PI,a*.14);n.strokeStyle="#7df1ff",n.shadowColor="rgba(80, 220, 255, 0.9)",n.shadowBlur=a*.18,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(p[0],p[1]),n.lineTo(f[0],f[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("MPH",s,r-a*.26),n.fillStyle=t?"#ff8077":"#f2f8ff",n.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,n.fillText(t?`-${Math.round(i)}`:String(Math.round(i)),s,r+a*.02)}function n_(i,t){const e=Nt.boostGauge;if(!e)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=Yh(e),l=18;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.3)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke();const d=It.clamp(i,0,1),u=i<.25;n.strokeStyle=u?"#ff5436":t?"#ffb53a":"#46e0b0",n.shadowColor=t?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",n.shadowBlur=t?a*.25:a*.1,n.lineWidth=Math.max(2,a*.07),n.beginPath(),n.arc(s,r,a,o(d),o(0)),n.stroke(),n.shadowBlur=0,n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let y=0;y<=l;y+=3){const m=y/l,h=o(m),S=y%6===0;n.strokeStyle=y>=l*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",n.lineWidth=S?Math.max(1.3,a*.03):Math.max(1,a*.018);const M=c(h,a-a*.02),b=c(h,a-a*(S?.17:.1));if(n.beginPath(),n.moveTo(M[0],M[1]),n.lineTo(b[0],b[1]),n.stroke(),S){const E=c(h,a-a*.33);n.fillStyle="#cfeeff",n.fillText(String(y),E[0],E[1])}}const f=o(d),p=c(f,a-a*.06),g=c(f+Math.PI,a*.14);n.strokeStyle=u?"#ff5436":"#ffd23f",n.shadowColor="rgba(255, 200, 60, 0.8)",n.shadowBlur=a*.16,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(g[0],g[1]),n.lineTo(p[0],p[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("BOOST psi",s,r-a*.26),t&&(n.fillStyle="#ffce4a",n.shadowColor="rgba(255, 190, 60, 0.95)",n.shadowBlur=a*.3,n.beginPath(),n.arc(s,r+a*.02,a*.07,0,Math.PI*2),n.fill(),n.shadowBlur=0)}function i_(i,t){const e=Nt.tach;if(!e)return;const n=e.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=e.clientWidth||160,a=e.clientHeight||70;(e.width!==Math.round(r*s)||e.height!==Math.round(a*s))&&(e.width=Math.round(r*s),e.height=Math.round(a*s)),n.setTransform(s,0,0,s,0,0),n.clearRect(0,0,r,a);const o=r/2,c=a-a*.14,l=Math.min(r*.46,a*.9),d=Ti.max,u=M=>Math.PI-M*Math.PI,f=(M,b)=>[o+Math.cos(M)*b,c-Math.sin(M)*b];n.lineCap="round",n.lineWidth=Math.max(2,l*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(o,c,l,u(1),u(0)),n.stroke();const p=Ti.redline/d;n.strokeStyle="#ff3b30",n.beginPath(),n.arc(o,c,l,u(1),u(p)),n.stroke(),n.font=`700 ${Math.max(7,l*.17)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let M=0;M<=9;M++){const b=M/9,E=u(b),T=M*1e3>=Ti.redline;n.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",n.lineWidth=Math.max(1.4,l*.035);const P=f(E,l-l*.02),C=f(E,l-l*.18);n.beginPath(),n.moveTo(P[0],P[1]),n.lineTo(C[0],C[1]),n.stroke();const w=f(E,l-l*.34);if(n.fillStyle=T?"#ff8077":"#cfeeff",n.fillText(String(M),w[0],w[1]),M<9){const v=u((M+.5)/9),A=f(v,l-l*.02),I=f(v,l-l*.1);n.strokeStyle="rgba(150, 210, 255, 0.5)",n.lineWidth=Math.max(1,l*.02),n.beginPath(),n.moveTo(A[0],A[1]),n.lineTo(I[0],I[1]),n.stroke()}}const g=It.clamp(i/d,0,1),y=u(g),m=f(y,l-l*.06),h=f(y+Math.PI,l*.14);n.strokeStyle="#ffdd48",n.shadowColor="rgba(255, 200, 60, 0.9)",n.shadowBlur=l*.18,n.lineWidth=Math.max(1.8,l*.05),n.beginPath(),n.moveTo(h[0],h[1]),n.lineTo(m[0],m[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,l*.03),n.beginPath(),n.arc(o,c,l*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,l*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("x1000 r/min",o,c-l*.26);const S=x.speed<-.5?"R":String(t);n.fillStyle="#f2f8ff",n.font=`800 ${Math.max(9,l*.22)}px "Courier New", monospace`,n.fillText(S,o,c+l*.02)}function Os(){tt.length*tt.laps;const i=Al(x.practice?x.totalDistance%tt.length:x.totalDistance),t=x.practice?0:Al(x.rivalDistance),e=x.practice?"SOLO":x.totalDistance>=x.rivalDistance?"P1":"P2";e!==x.leadState&&x.mode==="race"&&(x.leadState=e,x.practice||(x.message=e==="P1"?"You took the lead":"Crowther ahead",x.messageTimer=.95)),Nt.damage.style.width=`${Math.round(x.damage)}%`,Nt.lap.textContent=x.practice?`LAP ${x.lap}`:`${Math.min(x.lap,tt.laps)}/${tt.laps}`,Nt.timer.textContent=Po(x.time),Nt.score.textContent=`Score ${Math.round(x.score)}`;const n=x.mode==="roam",s=x.mode==="race"||x.mode==="paused"||n;Nt.position.textContent=n?"FREE ROAM":x.freeRun?"FREE RUN":x.practice?"PRACTICE":`${e} DIV 4`,Nt.hud.style.display=s?"flex":"none",Nt.raceStrip.style.display=x.mode==="race"||x.mode==="paused"?"grid":"none",Nt.touchControls.style.display=s?"":"none",Nt.playerProgress.style.width=`${Math.round(i*100)}%`,Nt.rivalProgress.style.width=`${Math.round(t*100)}%`;const r=t_();x.gear=r.gear;const a=performance.now(),o=Math.min(.05,(a-zl)/1e3);zl=a;const c=1-Math.exp(-o*(r.rpm>x.tachRpm?10:6));x.tachRpm+=(r.rpm-x.tachRpm)*c,i_(x.tachRpm,r.gear);const l=Math.abs(x.speed)*2.25;Ua+=(l-Ua)*(1-Math.exp(-o*8)),Na+=(x.boost-Na)*(1-Math.exp(-o*9)),e_(Ua,x.speed<-.5),n_(Na,x.boosting),Nt.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(x.speed)-44)/150)),Nt.damageFx.style.opacity=x.damage<18?0:Math.min(.72,(x.damage-18)/82),x.mode==="paused"?(Nt.centerMessage.textContent="Paused",Nt.centerMessage.classList.remove("hidden")):x.messageTimer>0?(Nt.centerMessage.textContent=x.message,Nt.centerMessage.classList.remove("hidden")):Nt.centerMessage.classList.add("hidden")}function Po(i){const t=Math.floor(i/60),e=i-t*60;return`${String(t).padStart(2,"0")}:${e.toFixed(1).padStart(4,"0")}`}function Zh(){const i=dg.getDelta(),t=Math.min(.033,i);x.messageTimer>0&&(x.messageTimer-=t),x.mode==="roam"?(Hh(t),Xh(t)):(jg(t),Qg(t),cc(t)),Xg(t),Tg(t),Os(),qg(),Cs.uniforms.uTime.value+=t,Cs.uniforms.uSpeed.value=Math.min(1,Math.abs(x.speed)/150);const e=(Qt.has("ShiftLeft")||Qt.has("ShiftRight"))&&x.boost>.02&&x.mode==="race";Cs.uniforms.uBoost.value+=((e?1:0)-Cs.uniforms.uBoost.value)*Math.min(1,t*6),ps.render(),requestAnimationFrame(Zh)}window.addEventListener("keydown",i=>{Qt.add(i.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(i.code)&&i.preventDefault(),i.code==="KeyP"&&x.mode==="race"?(x.mode="paused",Qt.clear(),Gr()):i.code==="KeyP"&&x.mode==="paused"?x.mode="race":i.code==="Escape"&&(x.mode==="race"||x.mode==="paused"||x.mode==="roam")&&(x.mode="menu",Gr(),An.visible=!1,Jn&&(Jn.visible=!0),Nt.menu.classList.remove("hidden"))});window.addEventListener("keyup",i=>Qt.delete(i.code));window.addEventListener("resize",()=>{Jt.aspect=window.innerWidth/window.innerHeight,Jt.updateProjectionMatrix(),Qe.setSize(window.innerWidth,window.innerHeight),ps.setSize(window.innerWidth,window.innerHeight),kh.setSize(window.innerWidth,window.innerHeight)});Nt.startBtn.addEventListener("click",()=>Zr(!1));Nt.practiceBtn.addEventListener("click",()=>Zr(!0));Nt.freeRunBtn.addEventListener("click",()=>Zr(!0,!0));Nt.roamBtn.addEventListener("click",()=>Gh());Nt.againBtn.addEventListener("click",()=>Zr(!1));Nt.courseButtons.forEach(i=>{i.addEventListener("click",()=>ac(Number(i.dataset.course)))});function $h(i){i&&(i.classList.remove("active"),i.style.setProperty("--stick-x","0px"),i.style.setProperty("--stick-y","0px"))}function Gr(){_t.steer=0,_t.throttle=0,_t.brake=0,_t.lookX=0,_t.lookY=0,_t.zoom=0,_t.lookPointer=null,_t.drivePointer=null,_t.pinchStartDistance=0,_t.pinchStartZoom=0;for(const i of Nt.touchControls.querySelectorAll(".touch-stick"))$h(i)}function Er(i,t){const e=i.getBoundingClientRect(),n=Math.min(e.width,e.height)*.36;if(!(n>0))return;const s=It.clamp(t.clientX-(e.left+e.width/2),-n,n),r=It.clamp(t.clientY-(e.top+e.height/2),-n,n),a=i.dataset.stick;if(i.classList.add("active"),a==="look")_t.lookX=It.clamp(s/n,-1,1),_t.lookY=It.clamp(-r/n,-1,1),i.style.setProperty("--stick-x",`${Math.round(_t.lookX*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-_t.lookY*n)}px`);else{const o=It.clamp(s/n,-1,1),c=It.clamp(-r/n,-1,1);_t.steer=o,_t.throttle=Math.max(0,c),_t.brake=Math.max(0,-c),i.style.setProperty("--stick-x",`${Math.round(o*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-c*n)}px`)}}function kl(i,t){return Array.from(i.changedTouches).find(e=>e.identifier===t)}function Vl(i,t){t==="look"?(_t.lookX=0,_t.lookY=0,_t.lookPointer=null):(_t.steer=0,_t.throttle=0,_t.brake=0,_t.drivePointer=null),$h(i)}function s_(i,t){return Math.hypot(i.clientX-t.clientX,i.clientY-t.clientY)}function Kh(i,t=!1){if(i.touches.length<2){_t.pinchStartDistance=0;return}const e=s_(i.touches[0],i.touches[1]);if(t||!(_t.pinchStartDistance>0)){_t.pinchStartDistance=e,_t.pinchStartZoom=_t.zoom;return}const n=Math.max(.2,e/_t.pinchStartDistance);_t.zoom=It.clamp(_t.pinchStartZoom-Math.log(n)*1.15,-.42,.9)}for(const i of Nt.touchControls.querySelectorAll(".touch-stick")){const t=i.dataset.stick;i.addEventListener("pointerdown",s=>{s.preventDefault(),Vr(),x.mode==="paused"&&(x.mode="race"),t==="look"&&(_t.lookPointer=s.pointerId),t==="drive"&&(_t.drivePointer=s.pointerId),Er(i,s)},{passive:!1}),i.addEventListener("pointermove",s=>{(t==="look"?_t.lookPointer:_t.drivePointer)===s.pointerId&&(s.preventDefault(),Er(i,s))},{passive:!1});const e=s=>{(t==="look"?_t.lookPointer:_t.drivePointer)===s.pointerId&&Vl(i,t)};i.addEventListener("pointerup",e),i.addEventListener("pointercancel",e),i.addEventListener("touchstart",s=>{s.preventDefault(),Vr(),x.mode==="paused"&&(x.mode="race");const r=s.changedTouches[0];r&&(t==="look"&&(_t.lookPointer=r.identifier),t==="drive"&&(_t.drivePointer=r.identifier),Er(i,r))},{passive:!1}),i.addEventListener("touchmove",s=>{const r=t==="look"?_t.lookPointer:_t.drivePointer,a=kl(s,r);a&&(s.preventDefault(),Er(i,a))},{passive:!1});const n=s=>{const r=t==="look"?_t.lookPointer:_t.drivePointer;kl(s,r)&&(s.preventDefault(),Vl(i,t))};i.addEventListener("touchend",n,{passive:!1}),i.addEventListener("touchcancel",n,{passive:!1})}for(const i of Nt.touchControls.querySelectorAll("button")){const t=i.dataset.code;i.addEventListener("pointerdown",n=>{n.preventDefault(),Vr(),Qt.add(t),i.setPointerCapture(n.pointerId)});const e=()=>Qt.delete(t);i.addEventListener("pointerup",e),i.addEventListener("pointercancel",e),i.addEventListener("lostpointercapture",e)}$s.addEventListener("touchstart",i=>{i.touches.length>=2&&(i.preventDefault(),Kh(i,!0))},{passive:!1});$s.addEventListener("touchmove",i=>{i.touches.length>=2&&(i.preventDefault(),Kh(i))},{passive:!1});$s.addEventListener("touchend",i=>{i.touches.length<2&&(_t.pinchStartDistance=0)},{passive:!1});$s.addEventListener("touchcancel",()=>{_t.pinchStartDistance=0},{passive:!1});const r_=he(x.s);x.y=r_.p.y+2.1;x.lastSafeS=x.s;x.lastSafeDistance=x.totalDistance;cc(.016);Os();Zh();
