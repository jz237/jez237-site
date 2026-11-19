const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./pick-C4S3Hy7N.js","./rolldown-runtime-DK3Fl9T5.js","./mesh-BUPESk9o.js"])))=>i.map(i=>d[i]);
import{t as e}from"./betta-CXsHXnOC.js";import{t,u as n}from"./mesh-BUPESk9o.js";var r=1e3,i=1001,a=1002,o=1003,s=1004,c=1005,l=1006,u=1007,d=1008,f=1008,p=1009,m=1010,h=1011,g=1012,_=1013,v=1014,y=1015,b=1016,x=1017,S=1018,C=1020,w=35902,T=35899,E=1021,D=1022,O=1023,k=1026,A=1027,j=1028,M=1029,N=1030,P=1031,F=1032,ee=1033,te=33776,I=33777,ne=33778,re=33779,ie=35840,ae=35841,oe=35842,L=35843,R=36196,se=37492,ce=37496,le=37488,ue=37489,de=37490,fe=37491,pe=37808,me=37809,he=37810,ge=37811,_e=37812,ve=37813,ye=37814,be=37815,xe=37816,Se=37817,Ce=37818,we=37819,Te=37820,Ee=37821,De=36492,Oe=36494,ke=36495,z=36283,Ae=36284,je=36285,Me=36286,B=2300,Ne=2301,V=2302,Pe=2303,Fe=2400,Ie=2401,Le=2402,Re=3200,ze=`srgb`,Be=`srgb-linear`,Ve=`linear`,He=`srgb`,Ue=7680,We=7681,Ge=7682,Ke=7683,qe=34055,Je=34056,Ye=5386,Xe=35044,Ze=35048,Qe=2e3,$e=2001,et={COMPUTE:`compute`,RENDER:`render`},tt={PERSPECTIVE:`perspective`,LINEAR:`linear`,FLAT:`flat`},nt={NORMAL:`normal`,CENTROID:`centroid`,SAMPLE:`sample`,FIRST:`first`,EITHER:`either`},rt={TEXTURE_COMPARE:`depthTextureCompare`},it={NONE:0,SHARED:1,FULL:2};function at(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function ot(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function st(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function ct(){let e=st(`canvas`);return e.style.display=`block`,e}var lt={};function ut(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function dt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function H(...e){e=dt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function U(...e){e=dt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function ft(...e){let t=e.join(` `);t in lt||(lt[t]=!0,H(...e))}function pt(){return typeof self<`u`&&self.scheduler!==void 0&&self.scheduler.yield!==void 0?self.scheduler.yield():new Promise(e=>{requestAnimationFrame(e)})}function mt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var ht={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},gt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},_t=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),vt=1234567,yt=Math.PI/180,bt=180/Math.PI;function xt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(_t[e&255]+_t[e>>8&255]+_t[e>>16&255]+_t[e>>24&255]+`-`+_t[t&255]+_t[t>>8&255]+`-`+_t[t>>16&15|64]+_t[t>>24&255]+`-`+_t[n&63|128]+_t[n>>8&255]+`-`+_t[n>>16&255]+_t[n>>24&255]+_t[r&255]+_t[r>>8&255]+_t[r>>16&255]+_t[r>>24&255]).toLowerCase()}function W(e,t,n){return Math.max(t,Math.min(n,e))}function St(e,t){return(e%t+t)%t}function Ct(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function wt(e,t,n){return e===t?0:(n-e)/(t-e)}function Tt(e,t,n){return(1-n)*e+n*t}function Et(e,t,n,r){return Tt(e,t,1-Math.exp(-n*r))}function Dt(e,t=1){return t-Math.abs(St(e,t*2)-t)}function Ot(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function kt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function At(e,t){return e+Math.floor(Math.random()*(t-e+1))}function jt(e,t){return e+Math.random()*(t-e)}function Mt(e){return e*(.5-Math.random())}function Nt(e){e!==void 0&&(vt=e);let t=vt+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Pt(e){return e*yt}function Ft(e){return e*bt}function It(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Lt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Rt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function zt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:H(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Bt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function G(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Vt={DEG2RAD:yt,RAD2DEG:bt,generateUUID:xt,clamp:W,euclideanModulo:St,mapLinear:Ct,inverseLerp:wt,lerp:Tt,damp:Et,pingpong:Dt,smoothstep:Ot,smootherstep:kt,randInt:At,randFloat:jt,randFloatSpread:Mt,seededRandom:Nt,degToRad:Pt,radToDeg:Ft,isPowerOfTwo:It,ceilPowerOfTwo:Lt,floorPowerOfTwo:Rt,setQuaternionFromProperEuler:zt,normalize:G,denormalize:Bt},K=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=W(this.x,e.x,t.x),this.y=W(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=W(this.x,e,t),this.y=W(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(W(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(W(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ht=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:H(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(W(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},q=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Wt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Wt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=W(this.x,e.x,t.x),this.y=W(this.y,e.y,t.y),this.z=W(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=W(this.x,e,t),this.y=W(this.y,e,t),this.z=W(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(W(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ut.copy(this).projectOnVector(e),this.sub(Ut)}reflect(e){return this.sub(Ut.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(W(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ut=new q,Wt=new Ht,J=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return ft(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Gt.makeScale(e,t)),this}rotate(e){return ft(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Gt.makeRotation(-e)),this}translate(e,t){return ft(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Gt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Gt=new J,Kt=new J().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),qt=new J().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Jt(){let e={enabled:!0,workingColorSpace:Be,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Xt(e.r),e.g=Xt(e.g),e.b=Xt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Zt(e.r),e.g=Zt(e.g),e.b=Zt(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Ve:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return ft(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return ft(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Be]:{primaries:t,whitePoint:r,transfer:Ve,toXYZ:Kt,fromXYZ:qt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:ze},outputColorSpaceConfig:{drawingBufferColorSpace:ze}},[ze]:{primaries:t,whitePoint:r,transfer:He,toXYZ:Kt,fromXYZ:qt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:ze}}}),e}var Yt=Jt();function Xt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Zt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Qt,$t=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Qt===void 0&&(Qt=st(`canvas`)),Qt.width=e.width,Qt.height=e.height;let t=Qt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Qt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=st(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Xt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Xt(t[e]/255)*255):t[e]=Xt(t[e]);return{data:t,width:e.width,height:e.height}}return H(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},en=0,tn=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:en++}),this.uuid=xt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(nn(r[t].image)):e.push(nn(r[t]))}else e=nn(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function nn(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?$t.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(H(`Texture: Unable to serialize Texture.`),{})}var rn=0,an=new q,on=class e extends gt{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=i,a=i,o=l,s=d,c=O,u=p,f=e.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rn++}),this.uuid=xt(),this.name=``,this.source=new tn(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=o,this.minFilter=s,this.anisotropy=f,this.format=c,this.internalFormat=null,this.type=u,this.offset=new K(0,0),this.repeat=new K(1,1),this.center=new K(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new J,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(an).x}get height(){return this.source.getSize(an).y}get depth(){return this.source.getSize(an).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){H(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?H(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case r:e.x-=Math.floor(e.x);break;case i:e.x=e.x<0?0:1;break;case a:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case r:e.y-=Math.floor(e.y);break;case i:e.y=e.y<0?0:1;break;case a:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};on.DEFAULT_IMAGE=null,on.DEFAULT_MAPPING=300,on.DEFAULT_ANISOTROPY=1;var sn=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=W(this.x,e.x,t.x),this.y=W(this.y,e.y,t.y),this.z=W(this.z,e.z,t.z),this.w=W(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=W(this.x,e,t),this.y=W(this.y,e,t),this.z=W(this.z,e,t),this.w=W(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(W(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},cn=class extends gt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:l,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new sn(0,0,e,t),this.scissorTest=!1,this.viewport=new sn(0,0,e,t),this.textures=[];let r=new on({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:l,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new tn(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},ln=class extends cn{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},un=class extends on{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=o,this.minFilter=o,this.wrapR=i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},dn=class extends on{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=o,this.minFilter=o,this.wrapR=i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},fn=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/pn.setFromMatrixColumn(e,0).length(),i=1/pn.setFromMatrixColumn(e,1).length(),a=1/pn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(hn,e,gn)}lookAt(e,t,n){let r=this.elements;return yn.subVectors(e,t),yn.lengthSq()===0&&(yn.z=1),yn.normalize(),_n.crossVectors(n,yn),_n.lengthSq()===0&&(Math.abs(n.z)===1?yn.x+=1e-4:yn.z+=1e-4,yn.normalize(),_n.crossVectors(n,yn)),_n.normalize(),vn.crossVectors(yn,_n),r[0]=_n.x,r[4]=vn.x,r[8]=yn.x,r[1]=_n.y,r[5]=vn.y,r[9]=yn.y,r[2]=_n.z,r[6]=vn.z,r[10]=yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],F=r[11],ee=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*F,i[12]=a*w+o*O+s*M+c*ee,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*F,i[13]=l*w+u*O+d*M+f*ee,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*F,i[14]=p*w+m*O+h*M+g*ee,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*F,i[15]=_*w+v*O+y*M+b*ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=pn.set(r[0],r[1],r[2]).length(),o=pn.set(r[4],r[5],r[6]).length(),s=pn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),mn.copy(this);let c=1/a,l=1/o,u=1/s;return mn.elements[0]*=c,mn.elements[1]*=c,mn.elements[2]*=c,mn.elements[4]*=l,mn.elements[5]*=l,mn.elements[6]*=l,mn.elements[8]*=u,mn.elements[9]*=u,mn.elements[10]*=u,t.setFromRotationMatrix(mn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Qe,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Qe,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},pn=new q,mn=new fn,hn=new q(0,0,0),gn=new q(1,1,1),_n=new q,vn=new q,yn=new q,bn=new fn,xn=new Ht,Sn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(W(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-W(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(W(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-W(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(W(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-W(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:H(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return bn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(bn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return xn.setFromEuler(this),this.setFromQuaternion(xn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Sn.DEFAULT_ORDER=`XYZ`;var Cn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},wn=0,Tn=new q,En=new Ht,Dn=new fn,On=new q,kn=new q,An=new q,jn=new Ht,Mn=new q(1,0,0),Nn=new q(0,1,0),Pn=new q(0,0,1),Fn={type:`added`},In={type:`removed`},Ln={type:`childadded`,child:null},Rn={type:`childremoved`,child:null},zn=class e extends gt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wn++}),this.uuid=xt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new q,n=new Sn,r=new Ht,i=new q(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new fn},normalMatrix:{value:new J}}),this.matrix=new fn,this.matrixWorld=new fn,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Cn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return En.setFromAxisAngle(e,t),this.quaternion.multiply(En),this}rotateOnWorldAxis(e,t){return En.setFromAxisAngle(e,t),this.quaternion.premultiply(En),this}rotateX(e){return this.rotateOnAxis(Mn,e)}rotateY(e){return this.rotateOnAxis(Nn,e)}rotateZ(e){return this.rotateOnAxis(Pn,e)}translateOnAxis(e,t){return Tn.copy(e).applyQuaternion(this.quaternion),this.position.add(Tn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Mn,e)}translateY(e){return this.translateOnAxis(Nn,e)}translateZ(e){return this.translateOnAxis(Pn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?On.copy(e):On.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),kn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dn.lookAt(kn,On,this.up):Dn.lookAt(On,kn,this.up),this.quaternion.setFromRotationMatrix(Dn),r&&(Dn.extractRotation(r.matrixWorld),En.setFromRotationMatrix(Dn),this.quaternion.premultiply(En.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(U(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fn),Ln.child=e,this.dispatchEvent(Ln),Ln.child=null):U(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(In),Rn.child=e,this.dispatchEvent(Rn),Rn.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fn),Ln.child=e,this.dispatchEvent(Ln),Ln.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(kn,e,An),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(kn,jn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};zn.DEFAULT_UP=new q(0,1,0),zn.DEFAULT_MATRIX_AUTO_UPDATE=!0,zn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Bn=class extends zn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Vn={type:`move`},Hn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Vn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Bn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Un={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wn={h:0,s:0,l:0},Gn={h:0,s:0,l:0};function Kn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var Y=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ze){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Yt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Yt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Yt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Yt.workingColorSpace){if(e=St(e,1),t=W(t,0,1),n=W(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Kn(i,r,e+1/3),this.g=Kn(i,r,e),this.b=Kn(i,r,e-1/3)}return Yt.colorSpaceToWorking(this,r),this}setStyle(e,t=ze){function n(t){t!==void 0&&parseFloat(t)<1&&H(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:H(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);H(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ze){let n=Un[e.toLowerCase()];return n===void 0?H(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xt(e.r),this.g=Xt(e.g),this.b=Xt(e.b),this}copyLinearToSRGB(e){return this.r=Zt(e.r),this.g=Zt(e.g),this.b=Zt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ze){return Yt.workingToColorSpace(qn.copy(this),e),Math.round(W(qn.r*255,0,255))*65536+Math.round(W(qn.g*255,0,255))*256+Math.round(W(qn.b*255,0,255))}getHexString(e=ze){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Yt.workingColorSpace){Yt.workingToColorSpace(qn.copy(this),t);let n=qn.r,r=qn.g,i=qn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Yt.workingColorSpace){return Yt.workingToColorSpace(qn.copy(this),t),e.r=qn.r,e.g=qn.g,e.b=qn.b,e}getStyle(e=ze){Yt.workingToColorSpace(qn.copy(this),e);let t=qn.r,n=qn.g,r=qn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Wn),this.setHSL(Wn.h+e,Wn.s+t,Wn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Wn),e.getHSL(Gn);let n=Tt(Wn.h,Gn.h,t),r=Tt(Wn.s,Gn.s,t),i=Tt(Wn.l,Gn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},qn=new Y;Y.NAMES=Un;var Jn=class extends zn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sn,this.environmentIntensity=1,this.environmentRotation=new Sn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Yn=new q,Xn=new q,Zn=new q,Qn=new q,$n=new q,er=new q,tr=new q,nr=new q,rr=new q,ir=new q,ar=new sn,or=new sn,sr=new sn,cr=class e{constructor(e=new q,t=new q,n=new q){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Yn.subVectors(e,t),r.cross(Yn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Yn.subVectors(r,t),Xn.subVectors(n,t),Zn.subVectors(e,t);let a=Yn.dot(Yn),o=Yn.dot(Xn),s=Yn.dot(Zn),c=Xn.dot(Xn),l=Xn.dot(Zn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Qn)!==null&&Qn.x>=0&&Qn.y>=0&&Qn.x+Qn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Qn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Qn.x),s.addScaledVector(a,Qn.y),s.addScaledVector(o,Qn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return ar.setScalar(0),or.setScalar(0),sr.setScalar(0),ar.fromBufferAttribute(e,t),or.fromBufferAttribute(e,n),sr.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(ar,i.x),a.addScaledVector(or,i.y),a.addScaledVector(sr,i.z),a}static isFrontFacing(e,t,n,r){return Yn.subVectors(n,t),Xn.subVectors(e,t),Yn.cross(Xn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Yn.subVectors(this.c,this.b),Xn.subVectors(this.a,this.b),Yn.cross(Xn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;$n.subVectors(r,n),er.subVectors(i,n),nr.subVectors(e,n);let s=$n.dot(nr),c=er.dot(nr);if(s<=0&&c<=0)return t.copy(n);rr.subVectors(e,r);let l=$n.dot(rr),u=er.dot(rr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector($n,a);ir.subVectors(e,i);let f=$n.dot(ir),p=er.dot(ir);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(er,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return tr.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(tr,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector($n,a).addScaledVector(er,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},lr=class{constructor(e=new q(1/0,1/0,1/0),t=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(dr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(dr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=dr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,dr):dr.fromBufferAttribute(r,t),dr.applyMatrix4(e.matrixWorld),this.expandByPoint(dr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),fr.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),fr.copy(e.boundingBox)),fr.applyMatrix4(e.matrixWorld),this.union(fr)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,dr),dr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(yr),br.subVectors(this.max,yr),pr.subVectors(e.a,yr),mr.subVectors(e.b,yr),hr.subVectors(e.c,yr),gr.subVectors(mr,pr),_r.subVectors(hr,mr),vr.subVectors(pr,hr);let t=[0,-gr.z,gr.y,0,-_r.z,_r.y,0,-vr.z,vr.y,gr.z,0,-gr.x,_r.z,0,-_r.x,vr.z,0,-vr.x,-gr.y,gr.x,0,-_r.y,_r.x,0,-vr.y,vr.x,0];return!Cr(t,pr,mr,hr,br)||(t=[1,0,0,0,1,0,0,0,1],!Cr(t,pr,mr,hr,br))?!1:(xr.crossVectors(gr,_r),t=[xr.x,xr.y,xr.z],Cr(t,pr,mr,hr,br))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,dr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(dr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(ur[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ur[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ur[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ur[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ur[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ur[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ur[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ur[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ur)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ur=[new q,new q,new q,new q,new q,new q,new q,new q],dr=new q,fr=new lr,pr=new q,mr=new q,hr=new q,gr=new q,_r=new q,vr=new q,yr=new q,br=new q,xr=new q,Sr=new q;function Cr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Sr.fromArray(e,a);let o=i.x*Math.abs(Sr.x)+i.y*Math.abs(Sr.y)+i.z*Math.abs(Sr.z),s=t.dot(Sr),c=n.dot(Sr),l=r.dot(Sr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var wr=Tr();function Tr(){let e=new ArrayBuffer(4),t=new Float32Array(e),n=new Uint32Array(e),r=new Uint32Array(512),i=new Uint32Array(512);for(let e=0;e<256;++e){let t=e-127;t<-27?(r[e]=0,r[e|256]=32768,i[e]=24,i[e|256]=24):t<-14?(r[e]=1024>>-t-14,r[e|256]=1024>>-t-14|32768,i[e]=-t-1,i[e|256]=-t-1):t<=15?(r[e]=t+15<<10,r[e|256]=t+15<<10|32768,i[e]=13,i[e|256]=13):t<128?(r[e]=31744,r[e|256]=64512,i[e]=24,i[e|256]=24):(r[e]=31744,r[e|256]=64512,i[e]=13,i[e|256]=13)}let a=new Uint32Array(2048),o=new Uint32Array(64),s=new Uint32Array(64);for(let e=1;e<1024;++e){let t=e<<13,n=0;for(;!(t&8388608);)t<<=1,n-=8388608;t&=-8388609,n+=947912704,a[e]=t|n}for(let e=1024;e<2048;++e)a[e]=939524096+(e-1024<<13);for(let e=1;e<31;++e)o[e]=e<<23;o[31]=1199570944,o[32]=2147483648;for(let e=33;e<63;++e)o[e]=2147483648+(e-32<<23);o[63]=3347054592;for(let e=1;e<64;++e)e!==32&&(s[e]=1024);return{floatView:t,uint32View:n,baseTable:r,shiftTable:i,mantissaTable:a,exponentTable:o,offsetTable:s}}function Er(e){Math.abs(e)>65504&&H(`DataUtils.toHalfFloat(): Value out of range.`),e=W(e,-65504,65504),wr.floatView[0]=e;let t=wr.uint32View[0],n=t>>23&511;return wr.baseTable[n]+((t&8388607)>>wr.shiftTable[n])}function Dr(e){let t=e>>10;return wr.uint32View[0]=wr.mantissaTable[wr.offsetTable[t]+(e&1023)]+wr.exponentTable[t],wr.floatView[0]}var Or=class{static toHalfFloat(e){return Er(e)}static fromHalfFloat(e){return Dr(e)}},kr=new q,Ar=new K,jr=0,Mr=class extends gt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Xe,this.updateRanges=[],this.gpuType=y,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ar.fromBufferAttribute(this,t),Ar.applyMatrix3(e),this.setXY(t,Ar.x,Ar.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)kr.fromBufferAttribute(this,t),kr.applyMatrix3(e),this.setXYZ(t,kr.x,kr.y,kr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)kr.fromBufferAttribute(this,t),kr.applyMatrix4(e),this.setXYZ(t,kr.x,kr.y,kr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)kr.fromBufferAttribute(this,t),kr.applyNormalMatrix(e),this.setXYZ(t,kr.x,kr.y,kr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)kr.fromBufferAttribute(this,t),kr.transformDirection(e),this.setXYZ(t,kr.x,kr.y,kr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Bt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=G(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Bt(t,this.array)),t}setX(e,t){return this.normalized&&(t=G(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Bt(t,this.array)),t}setY(e,t){return this.normalized&&(t=G(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Bt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=G(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Bt(t,this.array)),t}setW(e,t){return this.normalized&&(t=G(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=G(t,this.array),n=G(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=G(t,this.array),n=G(n,this.array),r=G(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=G(t,this.array),n=G(n,this.array),r=G(r,this.array),i=G(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},Nr=class extends Mr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Pr=class extends Mr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Fr=class extends Mr{constructor(e,t,n){super(new Uint16Array(e),t,n),this.isFloat16BufferAttribute=!0}getX(e){let t=Dr(this.array[e*this.itemSize]);return this.normalized&&(t=Bt(t,this.array)),t}setX(e,t){return this.normalized&&(t=G(t,this.array)),this.array[e*this.itemSize]=Er(t),this}getY(e){let t=Dr(this.array[e*this.itemSize+1]);return this.normalized&&(t=Bt(t,this.array)),t}setY(e,t){return this.normalized&&(t=G(t,this.array)),this.array[e*this.itemSize+1]=Er(t),this}getZ(e){let t=Dr(this.array[e*this.itemSize+2]);return this.normalized&&(t=Bt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=G(t,this.array)),this.array[e*this.itemSize+2]=Er(t),this}getW(e){let t=Dr(this.array[e*this.itemSize+3]);return this.normalized&&(t=Bt(t,this.array)),t}setW(e,t){return this.normalized&&(t=G(t,this.array)),this.array[e*this.itemSize+3]=Er(t),this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=G(t,this.array),n=G(n,this.array)),this.array[e+0]=Er(t),this.array[e+1]=Er(n),this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=G(t,this.array),n=G(n,this.array),r=G(r,this.array)),this.array[e+0]=Er(t),this.array[e+1]=Er(n),this.array[e+2]=Er(r),this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=G(t,this.array),n=G(n,this.array),r=G(r,this.array),i=G(i,this.array)),this.array[e+0]=Er(t),this.array[e+1]=Er(n),this.array[e+2]=Er(r),this.array[e+3]=Er(i),this}},Ir=class extends Mr{constructor(e,t,n){super(new Float32Array(e),t,n)}},Lr=new lr,Rr=new q,zr=new q,Br=class{constructor(e=new q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Lr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Rr.subVectors(e,this.center);let t=Rr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Rr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(zr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Rr.copy(e.center).add(zr)),this.expandByPoint(Rr.copy(e.center).sub(zr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Vr=0,Hr=new fn,Ur=new zn,Wr=new q,Gr=new lr,Kr=new lr,qr=new q,Jr=class e extends gt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Vr++}),this.uuid=xt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(at(e)?Pr:Nr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new J().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Hr.makeRotationFromQuaternion(e),this.applyMatrix4(Hr),this}rotateX(e){return Hr.makeRotationX(e),this.applyMatrix4(Hr),this}rotateY(e){return Hr.makeRotationY(e),this.applyMatrix4(Hr),this}rotateZ(e){return Hr.makeRotationZ(e),this.applyMatrix4(Hr),this}translate(e,t,n){return Hr.makeTranslation(e,t,n),this.applyMatrix4(Hr),this}scale(e,t,n){return Hr.makeScale(e,t,n),this.applyMatrix4(Hr),this}lookAt(e){return Ur.lookAt(e),Ur.updateMatrix(),this.applyMatrix4(Ur.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wr).negate(),this.translate(Wr.x,Wr.y,Wr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Ir(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&H(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new lr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)U(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Gr.setFromBufferAttribute(n),this.morphTargetsRelative?(qr.addVectors(this.boundingBox.min,Gr.min),this.boundingBox.expandByPoint(qr),qr.addVectors(this.boundingBox.max,Gr.max),this.boundingBox.expandByPoint(qr)):(this.boundingBox.expandByPoint(Gr.min),this.boundingBox.expandByPoint(Gr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&U(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Br);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)U(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new q,1/0);else if(e){let n=this.boundingSphere.center;if(Gr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Kr.setFromBufferAttribute(n),this.morphTargetsRelative?(qr.addVectors(Gr.min,Kr.min),Gr.expandByPoint(qr),qr.addVectors(Gr.max,Kr.max),Gr.expandByPoint(qr)):(Gr.expandByPoint(Kr.min),Gr.expandByPoint(Kr.max))}Gr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)qr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(qr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)qr.fromBufferAttribute(a,t),o&&(Wr.fromBufferAttribute(e,t),qr.add(Wr)),r=Math.max(r,n.distanceToSquared(qr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&U(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){U(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Mr(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new q,s[e]=new q;let c=new q,l=new q,u=new q,d=new K,f=new K,p=new K,m=new q,h=new q;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new q,y=new q,b=new q,x=new q;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Mr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new q,i=new q,a=new q,o=new q,s=new q,c=new q,l=new q,u=new q;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)qr.fromBufferAttribute(e,t),qr.normalize(),e.setXYZ(t,qr.x,qr.y,qr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Mr(a,r,i)}if(this.index===null)return H(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Yr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=Xe,this.updateRanges=[],this.version=0,this.uuid=xt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Xr=new q,Zr=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Xr.fromBufferAttribute(this,t),Xr.applyMatrix4(e),this.setXYZ(t,Xr.x,Xr.y,Xr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Xr.fromBufferAttribute(this,t),Xr.applyNormalMatrix(e),this.setXYZ(t,Xr.x,Xr.y,Xr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Xr.fromBufferAttribute(this,t),Xr.transformDirection(e),this.setXYZ(t,Xr.x,Xr.y,Xr.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Bt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=G(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=G(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=G(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=G(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=G(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Bt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Bt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Bt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Bt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=G(t,this.array),n=G(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=G(t,this.array),n=G(n,this.array),r=G(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=G(t,this.array),n=G(n,this.array),r=G(r,this.array),i=G(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){ut(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new Mr(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ut(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Qr=new q,$r=new q,ei=new J,ti=class{constructor(e=new q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Qr.subVectors(n,t).cross($r.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Qr),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||ei.getNormalMatrix(e),r=this.coplanarPoint(Qr).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},ni=0,ri=class extends gt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ni++}),this.uuid=xt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Y(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ue,this.stencilZFail=Ue,this.stencilZPass=Ue,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){H(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?H(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Y().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new ti().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new K().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new K().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},ii=class extends ri{constructor(e){super(),this.isSpriteMaterial=!0,this.type=`SpriteMaterial`,this.color=new Y(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ai=new q,oi=new q,si=new q,ci=new q,li=class{constructor(e=new q,t=new q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ai)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ai.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ai.copy(this.origin).addScaledVector(this.direction,t),ai.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){oi.copy(e).add(t).multiplyScalar(.5),si.copy(t).sub(e).normalize(),ci.copy(this.origin).sub(oi);let i=e.distanceTo(t)*.5,a=-this.direction.dot(si),o=ci.dot(this.direction),s=-ci.dot(si),c=ci.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(oi).addScaledVector(si,d),f}intersectSphere(e,t){if(e.radius<0)return null;ai.subVectors(e.center,this.origin);let n=ai.dot(this.direction),r=ai.dot(ai)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,ai)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let P=S/w,F=C/w,ee=1/w,te=T-P*D,I=E-F*D,ne=O-P*A,re=k-F*A,ie=j-P*N,ae=M-F*N,oe=ie*re-ae*ne,L=te*ae-I*ie,R=ne*I-re*te;if(r){if(oe<0||L<0||R<0)return null}else if((oe<0||L<0||R<0)&&(oe>0||L>0||R>0))return null;let se=oe+L+R;if(se===0)return null;let ce=ee*(oe*D+L*A+R*N);return(se>0?ce<0:ce>0)?null:this.at(ce/se,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ui=class extends ri{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new Y(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},di=new fn,fi=new li,pi=new Br,mi=new q,hi=new q,gi=new q,_i=new q,vi=new q,yi=new q,bi=new q,xi=new q,Si=class extends zn{constructor(e=new Jr,t=new ui){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){yi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(vi.fromBufferAttribute(s,e),a?yi.addScaledVector(vi,r):yi.addScaledVector(vi.sub(t),r))}t.add(yi)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),pi.copy(n.boundingSphere),pi.applyMatrix4(i),fi.copy(e.ray).recast(e.near),!(pi.containsPoint(fi.origin)===!1&&(fi.intersectSphere(pi,mi)===null||fi.origin.distanceToSquared(mi)>(e.far-e.near)**2))&&(di.copy(i).invert(),fi.copy(e.ray).applyMatrix4(di),(n.boundingBox===null||fi.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,fi)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=wi(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=wi(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=wi(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=wi(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Ci(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;xi.copy(s),xi.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(xi);return l<n.near||l>n.far?null:{distance:l,point:xi.clone(),object:e}}function wi(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,hi),e.getVertexPosition(c,gi),e.getVertexPosition(l,_i);let u=Ci(e,t,n,r,hi,gi,_i,bi);if(u){let e=new q;cr.getBarycoord(bi,hi,gi,_i,e),i&&(u.uv=cr.getInterpolatedAttribute(i,s,c,l,e,new K)),a&&(u.uv1=cr.getInterpolatedAttribute(a,s,c,l,e,new K)),o&&(u.normal=cr.getInterpolatedAttribute(o,s,c,l,e,new q),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new q,materialIndex:0};cr.getNormal(hi,gi,_i,t.normal),u.face=t,u.barycoord=e}return u}var Ti=class extends on{constructor(e=null,t=1,n=1,r,i,a,s,c,l=o,u=o,d,f){super(null,a,s,c,l,u,r,i,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ei=class extends Mr{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Di=new fn,Oi=new fn,ki=[],Ai=new lr,ji=new fn,Mi=new Si,Ni=new Br,Pi=class extends Si{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ei(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,ji)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new lr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Di),Ai.copy(e.boundingBox).applyMatrix4(Di),this.boundingBox.union(Ai)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Br),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Di),Ni.copy(e.boundingSphere).applyMatrix4(Di),this.boundingSphere.union(Ni)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Mi.geometry=this.geometry,Mi.material=this.material,Mi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ni.copy(this.boundingSphere),Ni.applyMatrix4(n),e.ray.intersectsSphere(Ni)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Di),Oi.multiplyMatrices(n,Di),Mi.matrixWorld=Oi,Mi.raycast(e,ki);for(let e=0,n=ki.length;e<n;e++){let n=ki[e];n.instanceId=i,n.object=this,t.push(n)}ki.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ei(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ti(new Float32Array(r*this.count),r,this.count,j,y));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Fi=new Br,Ii=new K(.5,.5),Li=new q,Ri=class{constructor(e=new ti,t=new ti,n=new ti,r=new ti,i=new ti,a=new ti){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Qe,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Fi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Fi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Fi)}intersectsSprite(e){return Fi.center.set(0,0,0),Fi.radius=.7071067811865476+Ii.distanceTo(e.center),Fi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Fi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Li.x=r.normal.x>0?e.max.x:e.min.x,Li.y=r.normal.y>0?e.max.y:e.min.y,Li.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Li)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},zi=new fn,Bi=class e{constructor(){this.coordinateSystem=Qe,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let e=0;e<t.length;e++){let r=t[e];zi.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[e]===void 0&&(n[e]=new Ri),n[e].setFromProjectionMatrix(zi,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new Ri),t[r].copy(n[r]);return this._count=e._count,this}clone(){return new e().copy(this)}},Vi=class extends ri{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new Y(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Hi=class extends ri{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new Y(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ui=class extends on{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=o,this.minFilter=o,this.generateMipmaps=!1,this.needsUpdate=!0}},Wi=class extends on{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Gi=class extends on{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ki=class extends on{constructor(e,t,n=v,r,i,a,s=o,c=o,l,u=k,d=1){if(u!==1026&&u!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},r,i,a,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new tn(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},qi=class extends Ki{constructor(e,t=v,n=301,r,i,a=o,s=o,c,l=k){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,r,i,a,s,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Ji=class extends on{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Yi=class e extends Jr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Ir(c,3)),this.setAttribute(`normal`,new Ir(l,3)),this.setAttribute(`uv`,new Ir(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new q;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Xi=class e extends Jr{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new q,l=new K;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new Ir(a,3)),this.setAttribute(`normal`,new Ir(o,3)),this.setAttribute(`uv`,new Ir(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Zi=class e extends Jr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Ir(u,3)),this.setAttribute(`normal`,new Ir(d,3)),this.setAttribute(`uv`,new Ir(f,2));function _(){let a=new q,_=new q,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new K,m=new q,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Qi=class e extends Jr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Ir(p,3)),this.setAttribute(`normal`,new Ir(m,3)),this.setAttribute(`uv`,new Ir(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},$i=class e extends Jr{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new q,p=new K;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new Ir(s,3)),this.setAttribute(`normal`,new Ir(c,3)),this.setAttribute(`uv`,new Ir(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},ea=class e extends Jr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new q,d=new q,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Ir(p,3)),this.setAttribute(`normal`,new Ir(m,3)),this.setAttribute(`uv`,new Ir(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},ta=class e extends Jr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new q,f=new q,p=new q;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new Ir(c,3)),this.setAttribute(`normal`,new Ir(l,3)),this.setAttribute(`uv`,new Ir(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}},na=class extends ri{constructor(e){super(),this.isShadowMaterial=!0,this.type=`ShadowMaterial`,this.color=new Y(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};function ra(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(aa(i))i.isRenderTargetTexture?(H(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(aa(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function ia(e){let t={};for(let n=0;n<e.length;n++){let r=ra(e[n]);for(let e in r)t[e]=r[e]}return t}function aa(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function oa(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function sa(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}var ca={clone:ra,merge:ia},la=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ua=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,da=class extends ri{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=la,this.fragmentShader=ua,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ra(e.uniforms),this.uniformsGroups=oa(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new Y().setHex(r.value);break;case`v2`:this.uniforms[n].value=new K().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new q().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new sn().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new J().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new fn().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},fa=class extends da{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},pa=class extends ri{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new Y(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Y(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new K(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ma=class extends pa{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new K(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return W(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Y(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Y(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Y(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},ha=class extends ri{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type=`MeshPhongMaterial`,this.color=new Y(16777215),this.specular=new Y(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Y(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new K(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ga=class extends ri{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:``},this.type=`MeshToonMaterial`,this.color=new Y(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Y(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new K(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},_a=class extends ri{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type=`MeshNormalMaterial`,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new K(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}},va=class extends ri{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new Y(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Y(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new K(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ya=class extends ri{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Re,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},ba=class extends ri{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},xa=class extends ri{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:``},this.type=`MeshMatcapMaterial`,this.color=new Y(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new K(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:``},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this.fog=e.fog,this}},Sa=class extends Vi{constructor(e){super(),this.isLineDashedMaterial=!0,this.type=`LineDashedMaterial`,this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}};function Ca(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function wa(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Ta=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Ea=class extends Ta{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Fe,endingEnd:Fe}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ie:i=e,o=2*t-n;break;case Le:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Ie:a=e,s=2*n-t;break;case Le:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Da=class extends Ta{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Oa=class extends Ta{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},ka=class extends Ta{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Ma(n,t,g,y,r);i[p]=Aa(x,o,_,b,m)}return i}};function Aa(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function ja(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Ma(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Aa(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=ja(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Na=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Ca(t,this.TimeBufferType),this.values=Ca(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ca(e.times,Array),values:Ca(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),wa(e.settings)&&(n.settings={inTangents:Ca(e.settings.inTangents,Array),outTangents:Ca(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Oa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Da(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ea(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ka(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case B:t=this.InterpolantFactoryMethodDiscrete;break;case Ne:t=this.InterpolantFactoryMethodLinear;break;case V:t=this.InterpolantFactoryMethodSmooth;break;case Pe:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return H(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return B;case this.InterpolantFactoryMethodLinear:return Ne;case this.InterpolantFactoryMethodSmooth:return V;case this.InterpolantFactoryMethodBezier:return Pe}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;wa(this.settings)&&(Pa(this.settings.inTangents,e),Pa(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(U(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(U(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){U(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){U(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&ot(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){U(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===V,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,wa(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Pa(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Na.prototype.ValueTypeName=``,Na.prototype.TimeBufferType=Float32Array,Na.prototype.ValueBufferType=Float32Array,Na.prototype.DefaultInterpolation=Ne;var Fa=class extends Na{constructor(e,t,n){super(e,t,n)}};Fa.prototype.ValueTypeName=`bool`,Fa.prototype.ValueBufferType=Array,Fa.prototype.DefaultInterpolation=B,Fa.prototype.InterpolantFactoryMethodLinear=void 0,Fa.prototype.InterpolantFactoryMethodSmooth=void 0;var Ia=class extends Na{constructor(e,t,n,r){super(e,t,n,r)}};Ia.prototype.ValueTypeName=`color`;var La=class extends Na{constructor(e,t,n,r){super(e,t,n,r)}};La.prototype.ValueTypeName=`number`;var Ra=class extends Ta{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Ht.slerpFlat(i,0,a,c-o,a,c,s);return i}},za=class extends Na{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Ra(this.times,this.values,this.getValueSize(),e)}};za.prototype.ValueTypeName=`quaternion`,za.prototype.InterpolantFactoryMethodSmooth=void 0;var Ba=class extends Na{constructor(e,t,n){super(e,t,n)}};Ba.prototype.ValueTypeName=`string`,Ba.prototype.ValueBufferType=Array,Ba.prototype.DefaultInterpolation=B,Ba.prototype.InterpolantFactoryMethodLinear=void 0,Ba.prototype.InterpolantFactoryMethodSmooth=void 0;var Va=class extends Na{constructor(e,t,n,r){super(e,t,n,r)}};Va.prototype.ValueTypeName=`vector`;var Ha={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(Ua(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!Ua(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function Ua(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var Wa=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},Ga=class{constructor(e){this.manager=e===void 0?Wa:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Ga.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var Ka=new WeakMap,qa=class extends Ga{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Ha.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=Ka.get(a);e===void 0&&(e=[],Ka.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=st(`img`);function s(){l(),t&&t(this);let n=Ka.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}Ka.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),Ha.remove(`image:${e}`);let n=Ka.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}Ka.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Ha.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},Ja=class extends Ga{constructor(e){super(e)}load(e,t,n,r){let i=new on,a=new qa(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},Ya=class extends zn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new Y(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Xa=class extends Ya{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(zn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Y(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Za=new fn,Qa=new q,$a=new q,eo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new K(512,512),this.mapType=p,this.map=null,this.mapPass=null,this.matrix=new fn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ri,this._frameExtents=new K(1,1),this._viewportCount=1,this._viewports=[new sn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Qa.setFromMatrixPosition(e.matrixWorld),t.position.copy(Qa),$a.setFromMatrixPosition(e.target.matrixWorld),t.lookAt($a),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Za.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Za,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Za)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},to=new q,no=new Ht,ro=new q,io=class extends zn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new fn,this.projectionMatrix=new fn,this.projectionMatrixInverse=new fn,this.coordinateSystem=Qe,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(to,no,ro),ro.x===1&&ro.y===1&&ro.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(to,no,ro.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(to,no,ro),ro.x===1&&ro.y===1&&ro.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(to,no,ro.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ao=new q,oo=new K,so=new K,co=class extends io{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=bt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(yt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return bt*2*Math.atan(Math.tan(yt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ao.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ao.x,ao.y).multiplyScalar(-e/ao.z),ao.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ao.x,ao.y).multiplyScalar(-e/ao.z)}getViewSize(e,t){return this.getViewBounds(e,oo,so),t.subVectors(so,oo)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(yt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},lo=class extends eo{constructor(){super(new co(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=bt*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},uo=class extends Ya{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(zn.DEFAULT_UP),this.updateMatrix(),this.target=new zn,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new lo}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},fo=class extends eo{constructor(){super(new co(90,1,.5,500)),this.isPointLightShadow=!0}},po=class extends Ya{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new fo}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},mo=class extends io{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ho=class extends eo{constructor(){super(new mo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},go=class extends Ya{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(zn.DEFAULT_UP),this.updateMatrix(),this.target=new zn,this.shadow=new ho}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},_o=class extends Ya{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type=`AmbientLight`}},vo=class extends Ya{constructor(e,t,n=10,r=10){super(e,t),this.isRectAreaLight=!0,this.type=`RectAreaLight`,this.width=n,this.height=r}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){let t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}},yo=class{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new q)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){let n=e.x,r=e.y,i=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.282095),t.addScaledVector(a[1],.488603*r),t.addScaledVector(a[2],.488603*i),t.addScaledVector(a[3],.488603*n),t.addScaledVector(a[4],n*r*1.092548),t.addScaledVector(a[5],r*i*1.092548),t.addScaledVector(a[6],.315392*(3*i*i-1)),t.addScaledVector(a[7],n*i*1.092548),t.addScaledVector(a[8],.546274*(n*n-r*r)),t}getIrradianceAt(e,t){let n=e.x,r=e.y,i=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.886227),t.addScaledVector(a[1],1.023328*r),t.addScaledVector(a[2],1.023328*i),t.addScaledVector(a[3],1.023328*n),t.addScaledVector(a[4],.858086*n*r),t.addScaledVector(a[5],.858086*r*i),t.addScaledVector(a[6],.743125*i*i-.247708),t.addScaledVector(a[7],.858086*n*i),t.addScaledVector(a[8],.429043*(n*n-r*r)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(e.coefficients[n],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let n=0;n<9;n++)this.coefficients[n].lerp(e.coefficients[n],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){let n=this.coefficients;for(let r=0;r<9;r++)n[r].fromArray(e,t+r*3);return this}toArray(e=[],t=0){let n=this.coefficients;for(let r=0;r<9;r++)n[r].toArray(e,t+r*3);return e}static getBasisAt(e,t){let n=e.x,r=e.y,i=e.z;t[0]=.282095,t[1]=.488603*r,t[2]=.488603*i,t[3]=.488603*n,t[4]=1.092548*n*r,t[5]=1.092548*r*i,t[6]=.315392*(3*i*i-1),t[7]=1.092548*n*i,t[8]=.546274*(n*n-r*r)}},bo=class extends Ya{constructor(e=new yo,t=1){super(void 0,t),this.isLightProbe=!0,this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}toJSON(e){let t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}},xo=class extends Jr{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type=`InstancedBufferGeometry`,this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}},So=-90,Co=1,wo=class extends zn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new co(So,Co,e,t);r.layers=this.layers,this.add(r);let i=new co(So,Co,e,t);i.layers=this.layers,this.add(i);let a=new co(So,Co,e,t);a.layers=this.layers,this.add(a);let o=new co(So,Co,e,t);o.layers=this.layers,this.add(o);let s=new co(So,Co,e,t);s.layers=this.layers,this.add(s);let c=new co(So,Co,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},To=class extends co{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Eo=`\\[\\]\\.:\\/`,Do=RegExp(`[\\[\\]\\.:\\/]`,`g`),Oo=`[^\\[\\]\\.:\\/]`,ko=`[^`+Eo.replace(`\\.`,``)+`]`,Ao=`((?:WC+[\\/:])*)`.replace(`WC`,Oo),jo=`(WCOD+)?`.replace(`WCOD`,ko),Mo=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Oo),No=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Oo),Po=RegExp(`^`+Ao+jo+Mo+No+`$`),Fo=[`material`,`materials`,`bones`,`map`],Io=class{constructor(e,t,n){let r=n||Lo.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Lo=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Do,``)}static parseTrackName(e){let t=Po.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Fo.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){H(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){U(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){U(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){U(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){U(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){U(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){U(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){U(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;U(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){U(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){U(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Lo.Composite=Io,Lo.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Lo.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Lo.prototype.GetterByBindingType=[Lo.prototype._getValue_direct,Lo.prototype._getValue_array,Lo.prototype._getValue_arrayElement,Lo.prototype._getValue_toArray],Lo.prototype.SetterByBindingTypeAndVersioning=[[Lo.prototype._setValue_direct,Lo.prototype._setValue_direct_setNeedsUpdate,Lo.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Lo.prototype._setValue_array,Lo.prototype._setValue_array_setNeedsUpdate,Lo.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Lo.prototype._setValue_arrayElement,Lo.prototype._setValue_arrayElement_setNeedsUpdate,Lo.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Lo.prototype._setValue_fromArray,Lo.prototype._setValue_fromArray_setNeedsUpdate,Lo.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ro=class extends Yr{constructor(e,t,n=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}},zo=new fn,Bo=class{constructor(e,t,n=0,r=1/0){this.ray=new li(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Cn,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):U(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return zo.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(zo),this}intersectObject(e,t=!0,n=[]){return Ho(e,this,n,t),n.sort(Vo),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)Ho(e[r],this,n,t);return n.sort(Vo),n}};function Vo(e,t){return e.distance-t.distance}function Ho(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)Ho(r[e],t,n,!0)}}var Uo=class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function Wo(e,t,n,r){let i=Go(r);switch(n){case E:return e*t;case j:return e*t/i.components*i.byteLength;case M:return e*t/i.components*i.byteLength;case N:return e*t*2/i.components*i.byteLength;case P:return e*t*2/i.components*i.byteLength;case D:return e*t*3/i.components*i.byteLength;case O:return e*t*4/i.components*i.byteLength;case ee:return e*t*4/i.components*i.byteLength;case te:case I:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ne:case re:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ae:case L:return Math.max(e,16)*Math.max(t,8)/4;case ie:case oe:return Math.max(e,8)*Math.max(t,8)/2;case R:case se:case le:case ue:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ce:case de:case fe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case pe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case me:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case he:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case ge:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case _e:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ve:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case ye:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case be:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case xe:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Se:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Ce:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case we:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Te:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Ee:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case De:case Oe:case ke:return Math.ceil(e/4)*Math.ceil(t/4)*16;case z:case Ae:return Math.ceil(e/4)*Math.ceil(t/4)*8;case je:case Me:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Go(e){switch(e){case p:case m:return{byteLength:1,components:1};case g:case h:case b:return{byteLength:2,components:1};case x:case S:return{byteLength:2,components:4};case v:case _:case y:return{byteLength:4,components:1};case w:case T:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?H(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Ko(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function qo(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var X={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
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
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
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
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
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
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
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
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
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
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
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
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
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
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
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
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
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
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
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
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
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
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
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
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
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
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
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
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
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
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
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
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
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
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
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
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
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
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
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
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
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
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
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
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
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
		return 0.5 / max( gv + gl, EPSILON );
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
	vec3 f0 = material.specularColorBlended;
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
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
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
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
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
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
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
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
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
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
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
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
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
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
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
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#ifdef DOUBLE_SIDED
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
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
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
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
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
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
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
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
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
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
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
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
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
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
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
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
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
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
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
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
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
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
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
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
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
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
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
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
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
}`,depth_frag:`#if DEPTH_PACKING == 3200
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
}`,distance_vert:`#define DISTANCE
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
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
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
}`,linedashed_frag:`uniform vec3 diffuse;
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
}`,meshbasic_vert:`#include <common>
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
}`,meshbasic_frag:`uniform vec3 diffuse;
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
}`,meshlambert_vert:`#define LAMBERT
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
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,meshmatcap_vert:`#define MATCAP
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
}`,meshmatcap_frag:`#define MATCAP
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
}`,meshnormal_vert:`#define NORMAL
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
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
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
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
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
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,meshphysical_vert:`#define STANDARD
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
}`,meshphysical_frag:`#define STANDARD
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
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
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
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
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
}`,meshtoon_vert:`#define TOON
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
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
}`,points_vert:`uniform float size;
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
}`,points_frag:`uniform vec3 diffuse;
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
}`,shadow_vert:`#include <common>
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
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
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
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
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
}`,sprite_frag:`uniform vec3 diffuse;
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
}`},Z={common:{diffuse:{value:new Y(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new J},alphaMap:{value:null},alphaMapTransform:{value:new J},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new J}},envmap:{envMap:{value:null},envMapRotation:{value:new J},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new J}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new J}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new J},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new J},normalScale:{value:new K(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new J},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new J}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new J}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new J}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Y(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new q},probesMax:{value:new q},probesResolution:{value:new q}},points:{diffuse:{value:new Y(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new J},alphaTest:{value:0},uvTransform:{value:new J}},sprite:{diffuse:{value:new Y(16777215)},opacity:{value:1},center:{value:new K(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new J},alphaMap:{value:null},alphaMapTransform:{value:new J},alphaTest:{value:0}}},Jo={basic:{uniforms:ia([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.fog]),vertexShader:X.meshbasic_vert,fragmentShader:X.meshbasic_frag},lambert:{uniforms:ia([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new Y(0)},envMapIntensity:{value:1}}]),vertexShader:X.meshlambert_vert,fragmentShader:X.meshlambert_frag},phong:{uniforms:ia([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new Y(0)},specular:{value:new Y(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:X.meshphong_vert,fragmentShader:X.meshphong_frag},standard:{uniforms:ia([Z.common,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.roughnessmap,Z.metalnessmap,Z.fog,Z.lights,{emissive:{value:new Y(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag},toon:{uniforms:ia([Z.common,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.gradientmap,Z.fog,Z.lights,{emissive:{value:new Y(0)}}]),vertexShader:X.meshtoon_vert,fragmentShader:X.meshtoon_frag},matcap:{uniforms:ia([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,{matcap:{value:null}}]),vertexShader:X.meshmatcap_vert,fragmentShader:X.meshmatcap_frag},points:{uniforms:ia([Z.points,Z.fog]),vertexShader:X.points_vert,fragmentShader:X.points_frag},dashed:{uniforms:ia([Z.common,Z.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:X.linedashed_vert,fragmentShader:X.linedashed_frag},depth:{uniforms:ia([Z.common,Z.displacementmap]),vertexShader:X.depth_vert,fragmentShader:X.depth_frag},normal:{uniforms:ia([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,{opacity:{value:1}}]),vertexShader:X.meshnormal_vert,fragmentShader:X.meshnormal_frag},sprite:{uniforms:ia([Z.sprite,Z.fog]),vertexShader:X.sprite_vert,fragmentShader:X.sprite_frag},background:{uniforms:{uvTransform:{value:new J},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:X.background_vert,fragmentShader:X.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new J}},vertexShader:X.backgroundCube_vert,fragmentShader:X.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:X.cube_vert,fragmentShader:X.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:X.equirect_vert,fragmentShader:X.equirect_frag},distance:{uniforms:ia([Z.common,Z.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:X.distance_vert,fragmentShader:X.distance_frag},shadow:{uniforms:ia([Z.lights,Z.fog,{color:{value:new Y(0)},opacity:{value:1}}]),vertexShader:X.shadow_vert,fragmentShader:X.shadow_frag}};Jo.physical={uniforms:ia([Jo.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new J},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new J},clearcoatNormalScale:{value:new K(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new J},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new J},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new J},sheen:{value:0},sheenColor:{value:new Y(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new J},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new J},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new J},transmissionSamplerSize:{value:new K},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new J},attenuationDistance:{value:0},attenuationColor:{value:new Y(0)},specularColor:{value:new Y(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new J},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new J},anisotropyVector:{value:new K},anisotropyMap:{value:null},anisotropyMapTransform:{value:new J}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag};var Yo={r:0,b:0,g:0},Xo=new fn,Zo=new J;Zo.set(-1,0,0,0,1,0,0,0,1);function Qo(e,t,n,r,i,a){let o=new Y(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new Si(new Yi(1,1,1),new da({name:`BackgroundCubeMaterial`,uniforms:ra(Jo.backgroundCube.uniforms),vertexShader:Jo.backgroundCube.vertexShader,fragmentShader:Jo.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Xo.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Zo),l.material.toneMapped=Yt.getTransfer(i.colorSpace)!==He,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Si(new Qi(2,2),new da({name:`BackgroundMaterial`,uniforms:ra(Jo.background.uniforms),vertexShader:Jo.background.vertexShader,fragmentShader:Jo.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(i.colorSpace)!==He,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Yo,sa(e)),n.buffers.color.setClear(Yo.r,Yo.g,Yo.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function $o(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function es(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function ts(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(H(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&H(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function ns(e){let t=this,n=null,r=0,i=!1,a=!1,o=new ti,s=new J,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var rs=4,is=6,as=20,os=256,ss=new mo,cs=new Y,ls=null,us=0,ds=0,fs=!1,ps=new q,ms=new q,hs=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=ps}=i;ls=this._renderer.getRenderTarget(),us=this._renderer.getActiveCubeFace(),ds=this._renderer.getActiveMipmapLevel(),fs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ss(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xs(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ls,us,ds),this._renderer.xr.enabled=fs,e.scissorTest=!1,vs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ls=this._renderer.getRenderTarget(),us=this._renderer.getActiveCubeFace(),ds=this._renderer.getActiveMipmapLevel(),fs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:l,minFilter:l,generateMipmaps:!1,type:b,format:O,colorSpace:Be,depthBuffer:!1},r=_s(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_s(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=gs(r)),this._blurMaterial=bs(r,e,t),this._ggxMaterial=ys(r,e,t)}return r}_compileMaterial(e){let t=new Si(new Jr,e);this._renderer.compile(t,ss)}_sceneToCubeUV(e,t,n,r,i){let a=new co(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(cs),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Si(new Yi,new ui({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(cs),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;vs(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ss()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xs());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;vs(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,ss)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-rs?n-d+rs:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,vs(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,ss),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,vs(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,ss)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];vs(t,3*l*(r>this._lodMax-rs?r-this._lodMax+rs:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,ss)}};function gs(e){let t=[],n=[],r=e,i=e-rs+1+is;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?ms.set(1,r,n):e===1?ms.set(-n,1,-r):e===2?ms.set(-n,r,1):e===3?ms.set(-1,r,-n):e===4?ms.set(-n,-1,r):ms.set(n,r,-1),ms.toArray(l,(e*6+t)*3)}}let u=new Jr;u.setAttribute(`position`,new Mr(c,3)),u.setAttribute(`outputDirection`,new Mr(l,3)),n.push(new Si(u,null)),r>rs&&r--}return{lodMeshes:n,sizeLods:t}}function _s(e,t,n){let r=new ln(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function vs(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function ys(e,t,n){return new da({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:os,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Cs(),fragmentShader:`

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

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function bs(e,t,n){return new da({name:`SphericalGaussianBlur`,defines:{SAMPLES:as,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Cs(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function xs(){return new da({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Cs(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ss(){return new da({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Cs(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Cs(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var ws=class extends ln{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Wi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Yi(5,5,5),i=new da({name:`CubemapFromEquirect`,uniforms:ra(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Si(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=l),new wo(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Ts(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new ws(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new hs(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new hs(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Es(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&ft(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Ds(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Pr:Nr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Os(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function ks(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:U(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function As(e,t,n){let r=new WeakMap,i=new sn;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new un(h,p,m,u);g.type=y,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new K(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function js(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Ms={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Ns(e,t,n,r,i,a){let o=new ln(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Jr;l.setAttribute(`position`,new Ir([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Ir([0,2,0,0,2,0],2));let u=new fa({uniforms:{tDiffuse:{value:null}},vertexShader:`
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

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

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

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Si(l,u),f=new mo(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new ln(t,n,{type:b,depthBuffer:!1,stencilBuffer:!1}),c=new ln(t,n,{type:b,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Yt.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=Ms[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var Ps=new on,Fs=new Ki(1,1),Is=new un,Ls=new dn,Rs=new Wi,zs=[],Bs=[],Vs=new Float32Array(16),Hs=new Float32Array(9),Us=new Float32Array(4);function Ws(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=zs[i];if(a===void 0&&(a=new Float32Array(i),zs[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Gs(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Ks(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function qs(e,t){let n=Bs[t];n===void 0&&(n=new Int32Array(t),Bs[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Js(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Ys(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Gs(n,t))return;e.uniform2fv(this.addr,t),Ks(n,t)}}function Xs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Gs(n,t))return;e.uniform3fv(this.addr,t),Ks(n,t)}}function Zs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Gs(n,t))return;e.uniform4fv(this.addr,t),Ks(n,t)}}function Qs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Gs(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Ks(n,t)}else{if(Gs(n,r))return;Us.set(r),e.uniformMatrix2fv(this.addr,!1,Us),Ks(n,r)}}function $s(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Gs(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Ks(n,t)}else{if(Gs(n,r))return;Hs.set(r),e.uniformMatrix3fv(this.addr,!1,Hs),Ks(n,r)}}function ec(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Gs(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Ks(n,t)}else{if(Gs(n,r))return;Vs.set(r),e.uniformMatrix4fv(this.addr,!1,Vs),Ks(n,r)}}function tc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function nc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Gs(n,t))return;e.uniform2iv(this.addr,t),Ks(n,t)}}function rc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Gs(n,t))return;e.uniform3iv(this.addr,t),Ks(n,t)}}function ic(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Gs(n,t))return;e.uniform4iv(this.addr,t),Ks(n,t)}}function ac(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function oc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Gs(n,t))return;e.uniform2uiv(this.addr,t),Ks(n,t)}}function sc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Gs(n,t))return;e.uniform3uiv(this.addr,t),Ks(n,t)}}function cc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Gs(n,t))return;e.uniform4uiv(this.addr,t),Ks(n,t)}}function lc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Fs.compareFunction=n.isReversedDepthBuffer()?518:515,a=Fs):a=Ps,n.setTexture2D(t||a,i)}function uc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Ls,i)}function dc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Rs,i)}function fc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Is,i)}function pc(e){switch(e){case 5126:return Js;case 35664:return Ys;case 35665:return Xs;case 35666:return Zs;case 35674:return Qs;case 35675:return $s;case 35676:return ec;case 5124:case 35670:return tc;case 35667:case 35671:return nc;case 35668:case 35672:return rc;case 35669:case 35673:return ic;case 5125:return ac;case 36294:return oc;case 36295:return sc;case 36296:return cc;case 35678:case 36198:case 36298:case 36306:case 35682:return lc;case 35679:case 36299:case 36307:return uc;case 35680:case 36300:case 36308:case 36293:return dc;case 36289:case 36303:case 36311:case 36292:return fc}}function mc(e,t){e.uniform1fv(this.addr,t)}function hc(e,t){let n=Ws(t,this.size,2);e.uniform2fv(this.addr,n)}function gc(e,t){let n=Ws(t,this.size,3);e.uniform3fv(this.addr,n)}function _c(e,t){let n=Ws(t,this.size,4);e.uniform4fv(this.addr,n)}function vc(e,t){let n=Ws(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function yc(e,t){let n=Ws(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function bc(e,t){let n=Ws(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function xc(e,t){e.uniform1iv(this.addr,t)}function Sc(e,t){e.uniform2iv(this.addr,t)}function Cc(e,t){e.uniform3iv(this.addr,t)}function wc(e,t){e.uniform4iv(this.addr,t)}function Tc(e,t){e.uniform1uiv(this.addr,t)}function Ec(e,t){e.uniform2uiv(this.addr,t)}function Dc(e,t){e.uniform3uiv(this.addr,t)}function Oc(e,t){e.uniform4uiv(this.addr,t)}function kc(e,t,n){let r=this.cache,i=t.length,a=qs(n,i);Gs(r,a)||(e.uniform1iv(this.addr,a),Ks(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Fs:Ps;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Ac(e,t,n){let r=this.cache,i=t.length,a=qs(n,i);Gs(r,a)||(e.uniform1iv(this.addr,a),Ks(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Ls,a[e])}function jc(e,t,n){let r=this.cache,i=t.length,a=qs(n,i);Gs(r,a)||(e.uniform1iv(this.addr,a),Ks(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Rs,a[e])}function Mc(e,t,n){let r=this.cache,i=t.length,a=qs(n,i);Gs(r,a)||(e.uniform1iv(this.addr,a),Ks(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Is,a[e])}function Nc(e){switch(e){case 5126:return mc;case 35664:return hc;case 35665:return gc;case 35666:return _c;case 35674:return vc;case 35675:return yc;case 35676:return bc;case 5124:case 35670:return xc;case 35667:case 35671:return Sc;case 35668:case 35672:return Cc;case 35669:case 35673:return wc;case 5125:return Tc;case 36294:return Ec;case 36295:return Dc;case 36296:return Oc;case 35678:case 36198:case 36298:case 36306:case 35682:return kc;case 35679:case 36299:case 36307:return Ac;case 35680:case 36300:case 36308:case 36293:return jc;case 36289:case 36303:case 36311:case 36292:return Mc}}var Pc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=pc(t.type)}},Fc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Nc(t.type)}},Ic=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Lc=/(\w+)(\])?(\[|\.)?/g;function Rc(e,t){e.seq.push(t),e.map[t.id]=t}function zc(e,t,n){let r=e.name,i=r.length;for(Lc.lastIndex=0;;){let a=Lc.exec(r),o=Lc.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Rc(n,l===void 0?new Pc(s,e,t):new Fc(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Ic(s),Rc(n,e)),n=e}}}var Bc=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);zc(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Vc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Hc=37297,Uc=0;function Wc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Gc=new J;function Kc(e){Yt._getMatrix(Gc,Yt.workingColorSpace,e);let t=`mat3( ${Gc.elements.map(e=>e.toFixed(4))} )`;switch(Yt.getTransfer(e)){case Ve:return[t,`LinearTransferOETF`];case He:return[t,`sRGBTransferOETF`];default:return H(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function qc(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Wc(e.getShaderSource(t),r)}return i}function Jc(e,t){let n=Kc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Yc={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Xc(e,t){let n=Yc[t];return n===void 0?(H(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Zc=new q;function Qc(){return Yt.getLuminanceCoefficients(Zc),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Zc.x.toFixed(4)}, ${Zc.y.toFixed(4)}, ${Zc.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function $c(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(nl).join(`
`)}function el(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function tl(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function nl(e){return e!==``}function rl(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function il(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var al=/^[ \t]*#include +<([\w\d./]+)>/gm;function ol(e){return e.replace(al,cl)}var sl=new Map;function cl(e,t){let n=X[t];if(n===void 0){let e=sl.get(t);if(e!==void 0)n=X[e],H(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return ol(n)}var ll=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ul(e){return e.replace(ll,dl)}function dl(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function fl(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var pl={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function ml(e){return pl[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var hl={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function gl(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:hl[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var _l={302:`ENVMAP_MODE_REFRACTION`};function vl(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:_l[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var yl={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function bl(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:yl[e.combine]||`ENVMAP_BLENDING_NONE`}function xl(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Sl(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=ml(n),l=gl(n),u=vl(n),d=bl(n),f=xl(n),p=$c(n),m=el(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(nl).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(nl).join(`
`),_.length>0&&(_+=`
`)):(g=[fl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(nl).join(`
`),_=[fl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:X.tonemapping_pars_fragment,n.toneMapping===0?``:Xc(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,X.colorspace_pars_fragment,Jc(`linearToOutputTexel`,n.outputColorSpace),Qc(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(nl).join(`
`)),o=ol(o),o=rl(o,n),o=il(o,n),s=ol(s),s=rl(s,n),s=il(s,n),o=ul(o),s=ul(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Vc(i,i.VERTEX_SHADER,y),S=Vc(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=qc(i,x,`vertex`),n=qc(i,S,`fragment`);U(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):H(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Bc(i,h),T=tl(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Hc)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Uc++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Cl=0,wl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Tl(e),t.set(e,n)),n}},Tl=class{constructor(e){this.id=Cl++,this.code=e,this.usedTimes=0}};function El(e){return e===1030||e===37490||e===36285}function Dl(e,t,n,r,i,a){let o=new Cn,s=new wl,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&H(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Jo[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),M=e.state.buffers.depth.getReversed(),N=h.isInstancedMesh===!0,P=h.isBatchedMesh===!0,F=!!i.map,ee=!!i.matcap,te=!!x,I=!!i.aoMap,ne=!!i.lightMap,re=!!i.bumpMap&&i.wireframe===!1,ie=!!i.normalMap,ae=!!i.displacementMap,oe=!!i.emissiveMap,L=!!i.metalnessMap,R=!!i.roughnessMap,se=i.anisotropy>0,ce=i.clearcoat>0,le=i.dispersion>0,ue=i.retroreflectivity>0,de=i.iridescence>0,fe=i.sheen>0,pe=i.transmission>0,me=se&&!!i.anisotropyMap,he=ce&&!!i.clearcoatMap,ge=ce&&!!i.clearcoatNormalMap,_e=ce&&!!i.clearcoatRoughnessMap,ve=de&&!!i.iridescenceMap,ye=de&&!!i.iridescenceThicknessMap,be=fe&&!!i.sheenColorMap,xe=fe&&!!i.sheenRoughnessMap,Se=!!i.specularMap,Ce=!!i.specularColorMap,we=!!i.specularIntensityMap,Te=pe&&!!i.transmissionMap,Ee=pe&&!!i.thicknessMap,De=!!i.gradientMap,Oe=!!i.alphaMap,ke=i.alphaTest>0,z=!!i.alphaHash,Ae=!!i.extensions,je=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(je=e.toneMapping);let Me={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:P,batchingColor:P&&h._colorsTexture!==null,instancing:N,instancingColor:N&&h.instanceColor!==null,instancingMorph:N&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Yt.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:F,matcap:ee,envMap:te,envMapMode:te&&x.mapping,envMapCubeUVHeight:S,aoMap:I,lightMap:ne,bumpMap:re,normalMap:ie,displacementMap:ae,emissiveMap:oe,normalMapObjectSpace:ie&&i.normalMapType===1,normalMapTangentSpace:ie&&i.normalMapType===0,packedNormalMap:ie&&i.normalMapType===0&&El(i.normalMap.format),metalnessMap:L,roughnessMap:R,anisotropy:se,anisotropyMap:me,clearcoat:ce,clearcoatMap:he,clearcoatNormalMap:ge,clearcoatRoughnessMap:_e,dispersion:le,retroreflection:ue,iridescence:de,iridescenceMap:ve,iridescenceThicknessMap:ye,sheen:fe,sheenColorMap:be,sheenRoughnessMap:xe,specularMap:Se,specularColorMap:Ce,specularIntensityMap:we,transmission:pe,transmissionMap:Te,thicknessMap:Ee,gradientMap:De,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Oe,alphaTest:ke,alphaHash:z,combine:i.combine,mapUv:F&&m(i.map.channel),aoMapUv:I&&m(i.aoMap.channel),lightMapUv:ne&&m(i.lightMap.channel),bumpMapUv:re&&m(i.bumpMap.channel),normalMapUv:ie&&m(i.normalMap.channel),displacementMapUv:ae&&m(i.displacementMap.channel),emissiveMapUv:oe&&m(i.emissiveMap.channel),metalnessMapUv:L&&m(i.metalnessMap.channel),roughnessMapUv:R&&m(i.roughnessMap.channel),anisotropyMapUv:me&&m(i.anisotropyMap.channel),clearcoatMapUv:he&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:ge&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:_e&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:ve&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:ye&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:be&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:xe&&m(i.sheenRoughnessMap.channel),specularMapUv:Se&&m(i.specularMap.channel),specularColorMapUv:Ce&&m(i.specularColorMap.channel),specularIntensityMapUv:we&&m(i.specularIntensityMap.channel),transmissionMapUv:Te&&m(i.transmissionMap.channel),thicknessMapUv:Ee&&m(i.thicknessMap.channel),alphaMapUv:Oe&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(ie||se),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(F||Oe),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&ie===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:M,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:je,decodeVideoTexture:F&&i.map.isVideoTexture===!0&&Yt.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:oe&&i.emissiveMap.isVideoTexture===!0&&Yt.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Ae&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Ae&&i.extensions.multiDraw===!0||P)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Me.vertexUv1s=c.has(1),Me.vertexUv2s=c.has(2),Me.vertexUv3s=c.has(3),c.clear(),Me}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Jo[t];n=ca.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Sl(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Ol(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function kl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Al(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function jl(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||kl),r.length>1&&r.sort(t||Al),i.length>1&&i.sort(t||Al)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Ml(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new jl,e.set(t,[i])):n>=r.length?(i=new jl,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Nl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new q,color:new Y};break;case`SpotLight`:n={position:new q,direction:new q,color:new Y,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new q,color:new Y,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new q,skyColor:new Y,groundColor:new Y};break;case`RectAreaLight`:n={color:new Y,position:new q,halfWidth:new q,halfHeight:new q}}return e[t.id]=n,n}}}function Pl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Fl=0;function Il(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Ll(e){let t=new Nl,n=Pl(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new q);let i=new q,a=new fn,o=new fn;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Il);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Z.LTC_FLOAT_1,r.rectAreaLTC2=Z.LTC_FLOAT_2):(r.rectAreaLTC1=Z.LTC_HALF_1,r.rectAreaLTC2=Z.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Fl++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Rl(e){let t=new Ll(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function zl(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Rl(e),t.set(n,[a])):r>=i.length?(a=new Rl(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Bl=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vl=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Hl=[new q(1,0,0),new q(-1,0,0),new q(0,1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1)],Ul=[new q(0,-1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1),new q(0,-1,0),new q(0,-1,0)],Wl=new fn,Gl=new q,Kl=new q;function ql(e,t,n){let r=new Ri,i=new K,a=new K,s=new sn,c=new ya,u=new ba,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},m=new da({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new K},radius:{value:4}},vertexShader:Bl,fragmentShader:Vl}),h=m.clone();h.defines.HORIZONTAL_PASS=1;let g=new Jr;g.setAttribute(`position`,new Mr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Si(g,m),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,c){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(H(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.state;m.setBlending(0),m.buffers.depth.getReversed()===!0?m.buffers.color.setClear(0,0,0,0):m.buffers.color.setClear(1,1,1,1),m.buffers.depth.setTest(!0),m.setScissorTest(!1);let h=S!==this.type;h&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let u=0,d=t.length;u<d;u++){let d=t[u],p=d.shadow;if(p===void 0){H(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;i.copy(p.mapSize);let g=p.getFrameExtents();i.multiply(g),a.copy(p.mapSize),(i.x>f||i.y>f)&&(i.x>f&&(a.x=Math.floor(f/g.x),i.x=a.x*g.x,p.mapSize.x=a.x),i.y>f&&(a.y=Math.floor(f/g.y),i.y=a.y*g.y,p.mapSize.y=a.y));let _=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=_,p.map===null||h===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){H(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new ln(i.x,i.y,{format:N,type:b,minFilter:l,magFilter:l,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new Ki(i.x,i.y,y),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=k,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=o,p.map.depthTexture.magFilter=o}else d.isPointLight?(p.map=new ws(i.x),p.map.depthTexture=new qi(i.x,v)):(p.map=new ln(i.x,i.y),p.map.depthTexture=new Ki(i.x,i.y,v)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=k,this.type===1?(p.map.depthTexture.compareFunction=_?518:515,p.map.depthTexture.minFilter=l,p.map.depthTexture.magFilter=l):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=o,p.map.depthTexture.magFilter=o);p.camera.updateProjectionMatrix()}p.map.isWebGLCubeRenderTarget!==!0&&(p.map.width!==i.x||p.map.height!==i.y)&&p.map.setSize(i.x,i.y);let x=p.map.isWebGLCubeRenderTarget?6:p.getViewportCount();d.isPointLight!==!0&&p.updateMatrices(d,c);for(let t=0;t<x;t++){let i=p.getCamera(t);if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Gl.setFromMatrixPosition(d.matrixWorld),e.position.copy(Gl),Kl.copy(e.position),Kl.add(Hl[t]),e.up.copy(Ul[t]),e.lookAt(Kl),e.updateMatrixWorld(),n.makeTranslation(-Gl.x,-Gl.y,-Gl.z),Wl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(Wl,e.coordinateSystem,e.reversedDepth)}if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);s.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),m.viewport(s)}r=p.getFrustum(t),T(n,c,i,d,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,c),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(u,d,p)};function C(n,r){let a=t.update(_);m.defines.VSM_SAMPLES!==n.blurSamples&&(m.defines.VSM_SAMPLES=n.blurSamples,h.defines.VSM_SAMPLES=n.blurSamples,m.needsUpdate=!0,h.needsUpdate=!0),n.mapPass===null?n.mapPass=new ln(i.x,i.y,{format:N,type:b}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),m.uniforms.shadow_pass.value=n.map.depthTexture,m.uniforms.resolution.value.set(n.map.width,n.map.height),m.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,m,_,null),h.uniforms.shadow_pass.value=n.mapPass.texture,h.uniforms.resolution.value.set(n.map.width,n.map.height),h.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,h,_,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?u:c,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,E)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function T(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)T(c[e],i,a,o,s)}function E(e){e.target.removeEventListener(`dispose`,E);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Jl(e,t){function n(){let t=!1,n=new sn,r=null,i=new sn(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?L(e.DEPTH_TEST):R(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=ht[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?L(e.STENCIL_TEST):R(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Y(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,P=0,F=e.getParameter(e.VERSION);F.indexOf(`WebGL`)===-1?F.indexOf(`OpenGL ES`)!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),N=P>=2):(P=parseFloat(/^WebGL (\d)/.exec(F)[1]),N=P>=1);let ee=null,te={},I=e.getParameter(e.SCISSOR_BOX),ne=e.getParameter(e.VIEWPORT),re=new sn().fromArray(I),ie=new sn().fromArray(ne);function ae(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let oe={};oe[e.TEXTURE_2D]=ae(e.TEXTURE_2D,e.TEXTURE_2D,1),oe[e.TEXTURE_CUBE_MAP]=ae(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[e.TEXTURE_2D_ARRAY]=ae(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),oe[e.TEXTURE_3D]=ae(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),L(e.DEPTH_TEST),o.setFunc(3),me(!1),he(1),L(e.CULL_FACE),fe(0);function L(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function R(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function se(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ce(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function le(t){return h!==t&&(e.useProgram(t),h=t,!0)}let ue={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ue[103]=e.MIN,ue[104]=e.MAX;let de={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function fe(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(R(e.BLEND),g=!1);else if(g===!1&&(L(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:U(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:U(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:U(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:U(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(ue[n],ue[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(de[r],de[i],de[o],de[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function pe(t,n){t.side===2?R(e.CULL_FACE):L(e.CULL_FACE);let r=t.side===1;n&&(r=!r),me(r),t.blending===1&&t.transparent===!1?fe(0):fe(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),_e(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?L(e.SAMPLE_ALPHA_TO_COVERAGE):R(e.SAMPLE_ALPHA_TO_COVERAGE)}function me(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function he(t){t===0?R(e.CULL_FACE):(L(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ge(t){t!==k&&(N&&e.lineWidth(t),k=t)}function _e(t,n,r){t?(L(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):R(e.POLYGON_OFFSET_FILL)}function ve(t){t?L(e.SCISSOR_TEST):R(e.SCISSOR_TEST)}function ye(t){t===void 0&&(t=e.TEXTURE0+M-1),ee!==t&&(e.activeTexture(t),ee=t)}function be(t,n,r){r===void 0&&(r=ee===null?e.TEXTURE0+M-1:ee);let i=te[r];i===void 0&&(i={type:void 0,texture:void 0},te[r]=i),(i.type!==t||i.texture!==n)&&(ee!==r&&(e.activeTexture(r),ee=r),e.bindTexture(t,n||oe[t]),i.type=t,i.texture=n)}function xe(){let t=te[ee];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Se(){try{e.compressedTexImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ce(){try{e.compressedTexImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function we(){try{e.texSubImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Te(){try{e.texSubImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ee(){try{e.compressedTexSubImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function De(){try{e.compressedTexSubImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Oe(){try{e.texStorage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function ke(){try{e.texStorage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function z(){try{e.texImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ae(){try{e.texImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function je(t){return d[t]===void 0?e.getParameter(t):d[t]}function Me(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function B(t){re.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),re.copy(t))}function Ne(t){ie.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ie.copy(t))}function V(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Pe(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Fe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},ee=null,te={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Y(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,re.set(0,0,e.canvas.width,e.canvas.height),ie.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:L,disable:R,bindFramebuffer:se,drawBuffers:ce,useProgram:le,setBlending:fe,setMaterial:pe,setFlipSided:me,setCullFace:he,setLineWidth:ge,setPolygonOffset:_e,setScissorTest:ve,activeTexture:ye,bindTexture:be,unbindTexture:xe,compressedTexImage2D:Se,compressedTexImage3D:Ce,texImage2D:z,texImage3D:Ae,pixelStorei:Me,getParameter:je,updateUBOMapping:V,uniformBlockBinding:Pe,texStorage2D:Oe,texStorage3D:ke,texSubImage2D:we,texSubImage3D:Te,compressedTexSubImage2D:Ee,compressedTexSubImage3D:De,scissor:B,viewport:Ne,reset:Fe}}function Yl(e,t,n,f,p,m,h){let g=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new K,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):st(`canvas`)}function T(e,t,n){let r=1,i=je(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),H(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&H(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function E(e){return e.generateMipmaps}function D(t){e.generateMipmap(t)}function O(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function k(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];H(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||H(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Ve:Yt.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function j(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,H(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function M(e,t){return E(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function N(e){let t=e.target;t.removeEventListener(`dispose`,N),F(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function P(e){let t=e.target;t.removeEventListener(`dispose`,P),te(t)}function F(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=S.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&ee(e),Object.keys(r).length===0&&S.delete(n)}f.remove(e)}function ee(t){let n=f.get(t);e.deleteTexture(n.__webglTexture);let r=t.source,i=S.get(r);delete i[n.__cacheKey],h.memory.textures--}function te(t){let n=f.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),f.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let r=t.textures;for(let t=0,n=r.length;t<n;t++){let n=f.get(r[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),h.memory.textures--),f.remove(r[t])}f.remove(t)}let I=0;function ne(){I=0}function re(){return I}function ie(e){I=e}function ae(){let e=I;return e>=p.maxTextures&&H(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+p.maxTextures),I+=1,e}function oe(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function L(t,r){let i=f.get(t);if(t.isVideoTexture&&z(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&i.__version!==t.version){let e=t.image;if(e===null)H(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)H(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ge(i,t,r);return}}else t.isExternalTexture&&(i.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,i.__webglTexture,e.TEXTURE0+r)}function R(t,r){let i=f.get(t);t.isRenderTargetTexture===!1&&t.version>0&&i.__version!==t.version?ge(i,t,r):(t.isExternalTexture&&(i.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,i.__webglTexture,e.TEXTURE0+r))}function se(t,r){let i=f.get(t);t.isRenderTargetTexture===!1&&t.version>0&&i.__version!==t.version?ge(i,t,r):n.bindTexture(e.TEXTURE_3D,i.__webglTexture,e.TEXTURE0+r)}function ce(t,r){let i=f.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&i.__version!==t.version?_e(i,t,r):n.bindTexture(e.TEXTURE_CUBE_MAP,i.__webglTexture,e.TEXTURE0+r)}let le={[r]:e.REPEAT,[i]:e.CLAMP_TO_EDGE,[a]:e.MIRRORED_REPEAT},ue={[o]:e.NEAREST,[s]:e.NEAREST_MIPMAP_NEAREST,[c]:e.NEAREST_MIPMAP_LINEAR,[l]:e.LINEAR,[u]:e.LINEAR_MIPMAP_NEAREST,[d]:e.LINEAR_MIPMAP_LINEAR},de={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function fe(n,r){if(r.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(r.magFilter===1006||r.magFilter===1007||r.magFilter===1005||r.magFilter===1008||r.minFilter===1006||r.minFilter===1007||r.minFilter===1005||r.minFilter===1008)&&H(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,le[r.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,le[r.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,le[r.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ue[r.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ue[r.minFilter]),r.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,de[r.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(r.magFilter===1003||r.minFilter!==1005&&r.minFilter!==1008||r.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(r.anisotropy>1||f.get(r).__currentAnisotropy){let i=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,i.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(r.anisotropy,p.getMaxAnisotropy())),f.get(r).__currentAnisotropy=r.anisotropy}}}function pe(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,N));let i=n.source,a=S.get(i);a===void 0&&(a={},S.set(i,a));let o=oe(n);if(o!==t.__cacheKey){a[o]===void 0&&(a[o]={texture:e.createTexture(),usedTimes:0},h.memory.textures++,r=!0),a[o].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&ee(n)),t.__cacheKey=o,t.__webglTexture=a[o].texture}return r}function me(e,t,n){return Math.floor(Math.floor(e/n)/t)}function he(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=me(n.start,r.width,4),c=me(t.start,r.width,4);n.start<=i+1&&a===c&&me(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ge(t,r,i){let a=e.TEXTURE_2D;(r.isDataArrayTexture||r.isCompressedArrayTexture)&&(a=e.TEXTURE_2D_ARRAY),r.isData3DTexture&&(a=e.TEXTURE_3D);let o=pe(t,r),s=r.source;n.bindTexture(a,t.__webglTexture,e.TEXTURE0+i);let c=f.get(s);if(s.version!==c.__version||o===!0){if(n.activeTexture(e.TEXTURE0+i),!(typeof ImageBitmap<`u`&&r.image instanceof ImageBitmap)){let t=Yt.getPrimaries(Yt.workingColorSpace),i=r.colorSpace===``?null:Yt.getPrimaries(r.colorSpace),a=r.colorSpace===``||t===i?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,a)}n.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment);let t=T(r.image,!1,p.maxTextureSize);t=Ae(r,t);let l=m.convert(r.format,r.colorSpace),u=m.convert(r.type),d=k(r.internalFormat,l,u,r.normalized,r.colorSpace,r.isVideoTexture);fe(a,r);let f,h=r.mipmaps,g=r.isVideoTexture!==!0,_=c.__version===void 0||o===!0,v=s.dataReady,y=M(r,t);if(r.isDepthTexture)d=j(r.format===A,r.type),_&&(g?n.texStorage2D(e.TEXTURE_2D,1,d,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,d,t.width,t.height,0,l,u,null));else if(r.isDataTexture){if(h.length>0){g&&_&&n.texStorage2D(e.TEXTURE_2D,y,d,h[0].width,h[0].height);for(let t=0,r=h.length;t<r;t++)f=h[t],g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,l,u,f.data):n.texImage2D(e.TEXTURE_2D,t,d,f.width,f.height,0,l,u,f.data);r.generateMipmaps=!1}else g?(_&&n.texStorage2D(e.TEXTURE_2D,y,d,t.width,t.height),v&&he(r,t,l,u)):n.texImage2D(e.TEXTURE_2D,0,d,t.width,t.height,0,l,u,t.data)}else if(r.isCompressedTexture){if(r.isCompressedArrayTexture){g&&_&&n.texStorage3D(e.TEXTURE_2D_ARRAY,y,d,h[0].width,h[0].height,t.depth);for(let i=0,a=h.length;i<a;i++)if(f=h[i],r.format!==1023){if(l!==null){if(g){if(v){if(r.layerUpdates.size>0){let t=Wo(f.width,f.height,r.format,r.type);for(let a of r.layerUpdates){let r=f.data.subarray(a*t/f.data.BYTES_PER_ELEMENT,(a+1)*t/f.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,f.width,f.height,1,l,r)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,f.width,f.height,t.depth,l,f.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,d,f.width,f.height,t.depth,0,f.data,0,0)}else H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,f.width,f.height,t.depth,l,u,f.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,d,f.width,f.height,t.depth,0,l,u,f.data);r.layerUpdates.size>0&&r.clearLayerUpdates()}else{g&&_&&n.texStorage2D(e.TEXTURE_2D,y,d,h[0].width,h[0].height);for(let t=0,i=h.length;t<i;t++)f=h[t],r.format===1023?g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,l,u,f.data):n.texImage2D(e.TEXTURE_2D,t,d,f.width,f.height,0,l,u,f.data):l===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,l,f.data):n.compressedTexImage2D(e.TEXTURE_2D,t,d,f.width,f.height,0,f.data)}}else if(r.isDataArrayTexture){if(g){if(_&&n.texStorage3D(e.TEXTURE_2D_ARRAY,y,d,t.width,t.height,t.depth),v){if(r.layerUpdates.size>0){let i=Wo(t.width,t.height,r.format,r.type);for(let a of r.layerUpdates){let r=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,l,u,r)}r.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,l,u,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,d,t.width,t.height,t.depth,0,l,u,t.data)}else if(r.isData3DTexture)g?(_&&n.texStorage3D(e.TEXTURE_3D,y,d,t.width,t.height,t.depth),v&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,l,u,t.data)):n.texImage3D(e.TEXTURE_3D,0,d,t.width,t.height,t.depth,0,l,u,t.data);else if(r.isFramebufferTexture){if(_){if(g)n.texStorage2D(e.TEXTURE_2D,y,d,t.width,t.height);else{let r=t.width,i=t.height;for(let t=0;t<y;t++)n.texImage2D(e.TEXTURE_2D,t,d,r,i,0,l,u,null),r>>=1,i>>=1}}}else if(r.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),b.add(r),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let t=je(h[0]);n.texStorage2D(e.TEXTURE_2D,y,d,t.width,t.height)}for(let t=0,r=h.length;t<r;t++)f=h[t],g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,l,u,f):n.texImage2D(e.TEXTURE_2D,t,d,l,u,f);r.generateMipmaps=!1}else if(g){if(_){let r=je(t);n.texStorage2D(e.TEXTURE_2D,y,d,r.width,r.height)}v&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,l,u,t)}else n.texImage2D(e.TEXTURE_2D,0,d,l,u,t);E(r)&&D(a),c.__version=s.version,r.onUpdate&&r.onUpdate(r)}t.__version=r.version}function _e(t,r,i){if(r.image.length!==6)return;let a=pe(t,r),o=r.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+i);let s=f.get(o);if(o.version!==s.__version||a===!0){n.activeTexture(e.TEXTURE0+i);let t=Yt.getPrimaries(Yt.workingColorSpace),c=r.colorSpace===``?null:Yt.getPrimaries(r.colorSpace),l=r.colorSpace===``||t===c?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,l);let u=r.isCompressedTexture||r.image[0].isCompressedTexture,d=r.image[0]&&r.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!u&&!d?f[e]=T(r.image[e],!0,p.maxCubemapSize):f[e]=d?r.image[e].image:r.image[e],f[e]=Ae(r,f[e]);let h=f[0],g=m.convert(r.format,r.colorSpace),_=m.convert(r.type),v=k(r.internalFormat,g,_,r.normalized,r.colorSpace),y=r.isVideoTexture!==!0,b=s.__version===void 0||a===!0,x=o.dataReady,S=M(r,h);fe(e.TEXTURE_CUBE_MAP,r);let C;if(u){y&&b&&n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=f[t].mipmaps;for(let i=0;i<C.length;i++){let a=C[i];r.format===1023?y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,i,0,0,a.width,a.height,g,_,a.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,i,v,a.width,a.height,0,g,_,a.data):g===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,i,0,0,a.width,a.height,g,a.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,i,v,a.width,a.height,0,a.data)}}}else{if(C=r.mipmaps,y&&b){C.length>0&&S++;let t=je(f[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(d){y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,f[t].width,f[t].height,g,_,f[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,f[t].width,f[t].height,0,g,_,f[t].data);for(let r=0;r<C.length;r++){let i=C[r].image[t].image;y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,i.width,i.height,0,g,_,i.data)}}else{y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,f[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,f[t]);for(let r=0;r<C.length;r++){let i=C[r];y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,g,_,i.image[t])}}}E(r)&&D(e.TEXTURE_CUBE_MAP),s.__version=o.version,r.onUpdate&&r.onUpdate(r)}t.__version=r.version}function ve(t,r,i,a,o,s){let c=m.convert(i.format,i.colorSpace),l=m.convert(i.type),u=k(i.internalFormat,c,l,i.normalized,i.colorSpace),d=f.get(r),p=f.get(i);if(p.__renderTarget=r,!d.__hasExternalTextures){let t=Math.max(1,r.width>>s),i=Math.max(1,r.height>>s);o===e.TEXTURE_3D||o===e.TEXTURE_2D_ARRAY?n.texImage3D(o,s,u,t,i,r.depth,0,c,l,null):n.texImage2D(o,s,u,t,i,0,c,l,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),ke(r)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,a,o,p.__webglTexture,0,Oe(r)):(o===e.TEXTURE_2D||o>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&o<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,a,o,p.__webglTexture,s),n.bindFramebuffer(e.FRAMEBUFFER,null)}function ye(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=j(n.stencilBuffer,a),s=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;ke(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Oe(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Oe(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,s,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let a=t[i],o=m.convert(a.format,a.colorSpace),s=m.convert(a.type),c=k(a.internalFormat,o,s,a.normalized,a.colorSpace);ke(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Oe(n),c,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Oe(n),c,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,c,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function be(t,r,i){let a=r.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(r.depthTexture&&r.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let o=f.get(r.depthTexture);if(o.__renderTarget=r,(!o.__webglTexture||r.depthTexture.image.width!==r.width||r.depthTexture.image.height!==r.height)&&(r.depthTexture.image.width=r.width,r.depthTexture.image.height=r.height,r.depthTexture.needsUpdate=!0),a){if(o.__webglInit===void 0&&(o.__webglInit=!0,r.depthTexture.addEventListener(`dispose`,N)),o.__webglTexture===void 0){o.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,o.__webglTexture),fe(e.TEXTURE_CUBE_MAP,r.depthTexture);let t=m.convert(r.depthTexture.format),i=m.convert(r.depthTexture.type),a;r.depthTexture.format===1026?a=e.DEPTH_COMPONENT24:r.depthTexture.format===1027&&(a=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,a,r.width,r.height,0,t,i,null)}}else L(r.depthTexture,0);let s=o.__webglTexture,c=Oe(r),l=a?e.TEXTURE_CUBE_MAP_POSITIVE_X+i:e.TEXTURE_2D,u=r.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(r.depthTexture.format===1026)ke(r)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,u,l,s,0,c):e.framebufferTexture2D(e.FRAMEBUFFER,u,l,s,0);else if(r.depthTexture.format===1027)ke(r)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,u,l,s,0,c):e.framebufferTexture2D(e.FRAMEBUFFER,u,l,s,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function xe(t){let r=f.get(t),i=t.isWebGLCubeRenderTarget===!0;if(r.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(r.__depthDisposeCallback&&r.__depthDisposeCallback(),e){let t=()=>{delete r.__boundDepthTexture,delete r.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),r.__depthDisposeCallback=t}r.__boundDepthTexture=e}if(t.depthTexture&&!r.__autoAllocateDepthBuffer){if(i)for(let e=0;e<6;e++)be(r.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?be(r.__webglFramebuffer[0],t,0):be(r.__webglFramebuffer,t,0)}}else if(i){r.__webglDepthbuffer=[];for(let i=0;i<6;i++)if(n.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[i]),r.__webglDepthbuffer[i]===void 0)r.__webglDepthbuffer[i]=e.createRenderbuffer(),ye(r.__webglDepthbuffer[i],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=r.__webglDepthbuffer[i];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let i=t.texture.mipmaps;if(i&&i.length>0?n.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer),r.__webglDepthbuffer===void 0)r.__webglDepthbuffer=e.createRenderbuffer(),ye(r.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,i=r.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,i),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,i)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Se(t,n,r){let i=f.get(t);n!==void 0&&ve(i.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),r!==void 0&&xe(t)}function Ce(t){let r=t.texture,i=f.get(t),a=f.get(r);t.addEventListener(`dispose`,P);let o=t.textures,s=t.isWebGLCubeRenderTarget===!0,c=o.length>1;if(c||(a.__webglTexture===void 0&&(a.__webglTexture=e.createTexture()),a.__version=r.version,h.memory.textures++),s){i.__webglFramebuffer=[];for(let t=0;t<6;t++)if(r.mipmaps&&r.mipmaps.length>0){i.__webglFramebuffer[t]=[];for(let n=0;n<r.mipmaps.length;n++)i.__webglFramebuffer[t][n]=e.createFramebuffer()}else i.__webglFramebuffer[t]=e.createFramebuffer()}else{if(r.mipmaps&&r.mipmaps.length>0){i.__webglFramebuffer=[];for(let t=0;t<r.mipmaps.length;t++)i.__webglFramebuffer[t]=e.createFramebuffer()}else i.__webglFramebuffer=e.createFramebuffer();if(c)for(let t=0,n=o.length;t<n;t++){let n=f.get(o[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),h.memory.textures++)}if(t.samples>0&&ke(t)===!1){i.__webglMultisampledFramebuffer=e.createFramebuffer(),i.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,i.__webglMultisampledFramebuffer);for(let n=0;n<o.length;n++){let r=o[n];i.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,i.__webglColorRenderbuffer[n]);let a=m.convert(r.format,r.colorSpace),s=m.convert(r.type),c=k(r.internalFormat,a,s,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),l=Oe(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,l,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,i.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(i.__webglDepthRenderbuffer=e.createRenderbuffer(),ye(i.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(s){n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture),fe(e.TEXTURE_CUBE_MAP,r);for(let n=0;n<6;n++)if(r.mipmaps&&r.mipmaps.length>0)for(let a=0;a<r.mipmaps.length;a++)ve(i.__webglFramebuffer[n][a],t,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,a);else ve(i.__webglFramebuffer[n],t,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);E(r)&&D(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(c){for(let r=0,a=o.length;r<a;r++){let a=o[r],s=f.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,s.__webglTexture),fe(c,a),ve(i.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+r,c,0),E(a)&&D(c)}n.unbindTexture()}else{let o=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(o=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(o,a.__webglTexture),fe(o,r),r.mipmaps&&r.mipmaps.length>0)for(let n=0;n<r.mipmaps.length;n++)ve(i.__webglFramebuffer[n],t,r,e.COLOR_ATTACHMENT0,o,n);else ve(i.__webglFramebuffer,t,r,e.COLOR_ATTACHMENT0,o,0);E(r)&&D(o),n.unbindTexture()}t.depthBuffer&&xe(t)}function we(e){let t=e.textures;for(let r=0,i=t.length;r<i;r++){let i=t[r];if(E(i)){let t=O(e),r=f.get(i).__webglTexture;n.bindTexture(t,r),D(t),n.unbindTexture()}}}let Te=[],Ee=[];function De(t){if(t.samples>0){if(ke(t)===!1){let r=t.textures,i=t.width,a=t.height,o=e.COLOR_BUFFER_BIT,s=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,c=f.get(t),l=r.length>1;if(l)for(let t=0;t<r.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,c.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,c.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,c.__webglMultisampledFramebuffer);let u=t.texture.mipmaps;u&&u.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,c.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,c.__webglFramebuffer);for(let n=0;n<r.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(o|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(o|=e.STENCIL_BUFFER_BIT)),l){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,c.__webglColorRenderbuffer[n]);let t=f.get(r[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,i,a,0,0,i,a,o,e.NEAREST),_===!0&&(Te.length=0,Ee.length=0,Te.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(Te.push(s),Ee.push(s),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Ee)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Te))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),l)for(let t=0;t<r.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,c.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,c.__webglColorRenderbuffer[t]);let i=f.get(r[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,c.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,i,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,c.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&_){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Oe(e){return Math.min(p.maxSamples,e.samples)}function ke(e){let n=f.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function z(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Ae(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Yt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&H(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):U(`WebGLTextures: Unsupported texture color space:`,n)),t}function je(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=ae,this.resetTextureUnits=ne,this.getTextureUnits=re,this.setTextureUnits=ie,this.setTexture2D=L,this.setTexture2DArray=R,this.setTexture3D=se,this.setTextureCube=ce,this.rebindTextures=Se,this.setupRenderTarget=Ce,this.updateRenderTargetMipmap=we,this.updateMultisampleRenderTarget=De,this.setupDepthRenderbuffer=xe,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=ke,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Xl(e,t){function n(n,r=``){let i,a=Yt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Zl=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ql=`
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

}`,$l=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ji(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new da({vertexShader:Zl,fragmentShader:Ql,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Si(new Qi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},eu=class extends gt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,m=null,h=typeof XRWebGLBinding<`u`,g=new $l,_={},y=t.getContextAttributes(),b=null,x=null,S=[],w=[],T=new K,E=null,D=null,j=new co;j.viewport=new sn;let M=new co;M.viewport=new sn;let N=[j,M],P=new To,F=null,ee=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=S[e];return t===void 0&&(t=new Hn,S[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=S[e];return t===void 0&&(t=new Hn,S[e]=t),t.getGripSpace()},this.getHand=function(e){let t=S[e];return t===void 0&&(t=new Hn,S[e]=t),t.getHandSpace()};function te(e){let t=w.indexOf(e.inputSource);if(t===-1)return;let n=S[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function I(){r.removeEventListener(`select`,te),r.removeEventListener(`selectstart`,te),r.removeEventListener(`selectend`,te),r.removeEventListener(`squeeze`,te),r.removeEventListener(`squeezestart`,te),r.removeEventListener(`squeezeend`,te),r.removeEventListener(`end`,I),r.removeEventListener(`inputsourceschange`,ne);for(let e=0;e<S.length;e++){let t=w[e];t!==null&&(w[e]=null,S[e].disconnect(t))}F=null,ee=null,g.reset();for(let e in _)delete _[e];if(e.setRenderTarget(b),f=null,d=null,u=null,r=null,x=null,ce.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(T.width,T.height,!1),D!==null){let e=D.camera;e.fov=D.fov,e.zoom=D.zoom,e.updateProjectionMatrix(),D=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&h&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(b=e.getRenderTarget(),r.addEventListener(`select`,te),r.addEventListener(`selectstart`,te),r.addEventListener(`selectend`,te),r.addEventListener(`squeeze`,te),r.addEventListener(`squeezestart`,te),r.addEventListener(`squeezeend`,te),r.addEventListener(`end`,I),r.addEventListener(`inputsourceschange`,ne),y.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(T),h&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;y.depth&&(o=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=y.stencil?A:k,a=y.stencil?C:v);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new ln(d.textureWidth,d.textureHeight,{format:O,type:p,depthTexture:new Ki(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new ln(f.framebufferWidth,f.framebufferHeight,{format:O,type:p,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ce.setContext(r),ce.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ne(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=w.indexOf(n);r>=0&&(w[r]=null,S[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=w.indexOf(n);if(r===-1){for(let e=0;e<S.length;e++)if(e>=w.length){w.push(n),r=e;break}else if(w[e]===null){w[e]=n,r=e;break}if(r===-1)break}let i=S[r];i&&i.connect(n)}}let re=new q,ie=new q;function ae(e,t,n){re.setFromMatrixPosition(t.matrixWorld),ie.setFromMatrixPosition(n.matrixWorld);let r=re.distanceTo(ie),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function oe(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;g.texture!==null&&(g.depthNear>0&&(t=g.depthNear),g.depthFar>0&&(n=g.depthFar)),P.near=M.near=j.near=t,P.far=M.far=j.far=n,(F!==P.near||ee!==P.far)&&(r.updateRenderState({depthNear:P.near,depthFar:P.far}),F=P.near,ee=P.far),P.layers.mask=e.layers.mask|6,j.layers.mask=P.layers.mask&-5,M.layers.mask=P.layers.mask&-3;let i=e.parent,a=P.cameras;oe(P,i);for(let e=0;e<a.length;e++)oe(a[e],i);a.length===2?ae(P,j,M):P.projectionMatrix.copy(j.projectionMatrix),D===null&&e.isPerspectiveCamera&&(D={camera:e,fov:e.fov,zoom:e.zoom}),L(e,P,i)};function L(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=bt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(P)},this.getCameraTexture=function(e){return _[e]};let R=null;function se(t,i){if(l=i.getViewerPose(c||a),m=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let i=!1;t.length!==P.cameras.length&&(P.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(x,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(x))}let o=N[n];o===void 0&&(o=new co,o.layers.enable(n),o.viewport=new sn,N[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(P.matrix.copy(o.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),i===!0&&P.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&h){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&g.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&h){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=_[n];e||(e=new Ji,_[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<S.length;e++){let t=w[e],n=S[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}R&&R(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),m=null}let ce=new Ko;ce.setAnimationLoop(se),this.setAnimationLoop=function(e){R=e},this.dispose=function(){}}},tu=new fn,nu=new J;nu.set(-1,0,0,0,1,0,0,0,1);function ru(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,sa(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(tu.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(nu),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function iu(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return U(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?H(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):H(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var au=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ou=null;function su(){return ou===null&&(ou=new Ti(au,16,16,N,b),ou.name=`DFG_LUT`,ou.minFilter=l,ou.magFilter=l,ou.wrapS=i,ou.wrapT=i,ou.generateMipmaps=!1,ou.needsUpdate=!0),ou}var cu=class{constructor(e={}){let{canvas:t=ct(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:m=p}=e;this.isWebGLRenderer=!0;let h;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);h=n.getContextAttributes().alpha}else h=a;let _=m,y=new Set([ee,P,M]),w=new Set([p,v,g,C,x,S]),T=new Uint32Array(4),E=new Int32Array(4),D=new q,O=null,k=null,A=[],j=[],N=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let F=this,te=!1,I=null,ne=null,re=null,ie=null;this._outputColorSpace=ze;let ae=0,oe=0,L=null,R=-1,se=null,ce=new sn,le=new sn,ue=null,de=new Y(0),fe=0,pe=t.width,me=t.height,he=1,ge=null,_e=null,ve=new sn(0,0,pe,me),ye=new sn(0,0,pe,me),be=!1,xe=new Ri,Se=!1,Ce=!1,we=new fn,Te=new q,Ee=new sn,De={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Oe=!1;function ke(){return L===null?he:1}let z=n;function Ae(e,n){return t.getContext(e,n)}let je,Me,B,Ne,V,Pe,Fe,Ie,Le,Re,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,$e;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,nt,!1),t.addEventListener(`webglcontextrestored`,rt,!1),t.addEventListener(`webglcontextcreationerror`,it,!1),z===null){let t=`webgl2`;if(z=Ae(t,e),z===null)throw Ae(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}et()}catch(e){throw t.removeEventListener(`webglcontextlost`,nt,!1),t.removeEventListener(`webglcontextrestored`,rt,!1),t.removeEventListener(`webglcontextcreationerror`,it,!1),U(`WebGLRenderer: `+e.message),e}function et(){je=new Es(z),je.init(),Xe=new Xl(z,je),Me=new ts(z,je,e,Xe),B=new Jl(z,je),Me.reversedDepthBuffer&&f&&B.buffers.depth.setReversed(!0),ne=z.createFramebuffer(),re=z.createFramebuffer(),ie=z.createFramebuffer(),Ne=new ks(z),V=new Ol,Pe=new Yl(z,je,B,V,Me,Xe,Ne),Fe=new Ts(F),Ie=new qo(z),Ze=new $o(z,Ie),Le=new Ds(z,Ie,Ne,Ze),Re=new js(z,Le,Ie,Ze,Ne),qe=new As(z,Me,Pe),We=new ns(V),Be=new Dl(F,Fe,je,Me,Ze,We),Ve=new ru(F,V),He=new Ml,Ue=new zl(je),Ke=new Qo(F,Fe,B,Re,h,s),Ge=new ql(F,Re,Me),$e=new iu(z,Ne,Me,B),Je=new es(z,je,Ne),Ye=new Os(z,je,Ne),Ne.programs=Be.programs,F.capabilities=Me,F.extensions=je,F.properties=V,F.renderLists=He,F.shadowMap=Ge,F.state=B,F.info=Ne}_!==1009&&(N=new Ns(_,t.width,t.height,o,r,i));let tt=new eu(F,z);this.xr=tt,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let e=je.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=je.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return he},this.setPixelRatio=function(e){e!==void 0&&(he=e,this.setSize(pe,me,!1))},this.getSize=function(e){return e.set(pe,me)},this.setSize=function(e,n,r=!0){tt.isPresenting?H(`WebGLRenderer: Can't change size while VR device is presenting.`):(pe=e,me=n,t.width=Math.floor(e*he),t.height=Math.floor(n*he),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),N!==null&&N.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(pe*he,me*he).floor()},this.setDrawingBufferSize=function(e,n,r){pe=e,me=n,he=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(_===1009)U(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){H(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}N.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(ce)},this.getViewport=function(e){return e.copy(ve)},this.setViewport=function(e,t,n,r){e.isVector4?ve.set(e.x,e.y,e.z,e.w):ve.set(e,t,n,r),B.viewport(ce.copy(ve).multiplyScalar(he).round())},this.getScissor=function(e){return e.copy(ye)},this.setScissor=function(e,t,n,r){e.isVector4?ye.set(e.x,e.y,e.z,e.w):ye.set(e,t,n,r),B.scissor(le.copy(ye).multiplyScalar(he).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(e){B.setScissorTest(be=e)},this.setOpaqueSort=function(e){ge=e},this.setTransparentSort=function(e){_e=e},this.getClearColor=function(e){return e.copy(Ke.getClearColor())},this.setClearColor=function(){Ke.setClearColor(...arguments)},this.getClearAlpha=function(){return Ke.getClearAlpha()},this.setClearAlpha=function(){Ke.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(L!==null){let t=L.texture.format;e=y.has(t)}if(e){let e=L.texture.type,t=w.has(e),n=Ke.getClearColor(),r=Ke.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,z.clearBufferuiv(z.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,z.clearBufferiv(z.COLOR,0,E))}else r|=z.COLOR_BUFFER_BIT}t&&(r|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&z.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),I=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,nt,!1),t.removeEventListener(`webglcontextrestored`,rt,!1),t.removeEventListener(`webglcontextcreationerror`,it,!1),Ke.dispose(),He.dispose(),Ue.dispose(),V.dispose(),Fe.dispose(),Re.dispose(),Ze.dispose(),$e.dispose(),Be.dispose(),tt.dispose(),tt.removeEventListener(`sessionstart`,pt),tt.removeEventListener(`sessionend`,ht),gt.stop()};function nt(e){e.preventDefault(),ut(`WebGLRenderer: Context Lost.`),te=!0}function rt(){ut(`WebGLRenderer: Context Restored.`),te=!1;let e=Ne.autoReset,t=Ge.enabled,n=Ge.autoUpdate,r=Ge.needsUpdate,i=Ge.type;et(),Ne.autoReset=e,Ge.enabled=t,Ge.autoUpdate=n,Ge.needsUpdate=r,Ge.type=i}function it(e){U(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function at(e){let t=e.target;t.removeEventListener(`dispose`,at),ot(t)}function ot(e){st(e),V.remove(e)}function st(e){let t=V.get(e).programs;t!==void 0&&(t.forEach(function(e){Be.releaseProgram(e)}),e.isShaderMaterial&&Be.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=De);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Tt(e,t,n,r,i);B.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Le.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Ze.setup(i,r,s,n,c);let h,g=Je;if(c!==null&&(h=Ie.get(c),g=Ye,g.setIndex(h)),i.isMesh)r.wireframe===!0?(B.setLineWidth(r.wireframeLinewidth*ke()),g.setMode(z.LINES)):g.setMode(z.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),B.setLineWidth(e*ke()),i.isLineSegments?g.setMode(z.LINES):i.isLineLoop?g.setMode(z.LINE_LOOP):g.setMode(z.LINE_STRIP)}else i.isPoints?g.setMode(z.POINTS):i.isSprite&&g.setMode(z.TRIANGLES);if(i.isBatchedMesh){if(je.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ie.get(c).bytesPerElement:1,o=V.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(z,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function lt(e,t,n,r){I!==null&&e.isNodeMaterial&&I.setObject(r,e),Se===!0&&We.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,W(e,t,r),e.side=0,e.needsUpdate=!0,W(e,t,r),e.side=2):W(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),I!==null&&I.renderStart(e,t,n),k=Ue.get(n),k.init(t),j.push(k),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),k.setupLights(),I!==null&&I.updateLights(k.state.lightsArray),Ce=this.localClippingEnabled,Se=We.init(this.clippingPlanes,Ce),Se===!0&&We.setGlobalState(this.clippingPlanes,t),I!==null&&Ge.render(k.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];lt(o,n,t,e),r.add(o)}else lt(i,n,t,e),r.add(i)}}),k=j.pop(),I!==null&&I.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=V.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}je.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let dt=null;function ft(e){dt&&dt(e)}function pt(){gt.stop()}function ht(){gt.start()}let gt=new Ko;gt.setAnimationLoop(ft),typeof self<`u`&&gt.setContext(self),this.setAnimationLoop=function(e){dt=e,tt.setAnimationLoop(e),e===null?gt.stop():gt.start()},tt.addEventListener(`sessionstart`,pt),tt.addEventListener(`sessionend`,ht),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){U(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(te===!0)return;I!==null&&I.renderStart(e,t);let n=tt.enabled===!0&&tt.isPresenting===!0,r=N!==null&&(L===null||n)&&N.begin(F,L);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),tt.enabled===!0&&tt.isPresenting===!0&&(N===null||N.isCompositing()===!1)&&(tt.cameraAutoUpdate===!0&&tt.updateCamera(t),t=tt.getCamera()),e.isScene===!0&&e.onBeforeRender(F,e,t,L),k=Ue.get(e,j.length),k.init(t),k.state.textureUnits=Pe.getTextureUnits(),j.push(k),we.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),xe.setFromProjectionMatrix(we,Qe,t.reversedDepth),Ce=this.localClippingEnabled,Se=We.init(this.clippingPlanes,Ce),O=He.get(e,A.length),O.init(),A.push(O),tt.enabled===!0&&tt.isPresenting===!0){let e=F.xr.getDepthSensingMesh();e!==null&&_t(e,t,-1/0,F.sortObjects)}_t(e,t,0,F.sortObjects),O.finish(),I!==null&&I.updateLights(k.state.lightsArray),F.sortObjects===!0&&O.sort(ge,_e),Oe=tt.enabled===!1||tt.isPresenting===!1||tt.hasDepthSensing()===!1,Oe&&Ke.addToRenderList(O,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Se===!0&&We.beginShadows();let i=k.state.shadowsArray;if(Ge.render(i,e,t),Se===!0&&We.endShadows(),(r&&N.hasRenderPass())===!1){let n=O.opaque,r=O.transmissive;if(k.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];yt(n,r,e,a)}Oe&&Ke.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];vt(O,e,n,n.viewport)}}else r.length>0&&yt(n,r,e,t),Oe&&Ke.render(e),vt(O,e,t)}L!==null&&oe===0&&(Pe.updateMultisampleRenderTarget(L),Pe.updateRenderTargetMipmap(L)),r&&N.end(F),e.isScene===!0&&e.onAfterRender(F,e,t),Ze.resetDefaultState(),R=-1,se=null,j.pop(),j.length>0?(k=j[j.length-1],Pe.setTextureUnits(k.state.textureUnits),Se===!0&&We.setGlobalState(F.clippingPlanes,k.state.camera)):k=null,A.pop(),O=A.length>0?A[A.length-1]:null,I!==null&&I.renderEnd()};function _t(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)k.pushLightProbeGrid(e);else if(e.isLight)k.pushLight(e),e.castShadow&&k.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(xe)){r&&Ee.setFromMatrixPosition(e.matrixWorld).applyMatrix4(we);let i=Re.update(e),a=e.material;a.visible&&O.push(e,i,a,n,Ee.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(xe))){let i=Re.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Ee.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Ee.copy(e.boundingSphere.center)),Ee.applyMatrix4(e.matrixWorld).applyMatrix4(we)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&O.push(e,i,c,n,Ee.z,s,t)}}else a.visible&&O.push(e,i,a,n,Ee.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)_t(i[e],t,n,r)}function vt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;k.setupLightsView(n),Se===!0&&We.setGlobalState(F.clippingPlanes,n),r&&B.viewport(ce.copy(r)),i.length>0&&bt(i,t,n),a.length>0&&bt(a,t,n),o.length>0&&bt(o,t,n),B.buffers.depth.setTest(!0),B.buffers.depth.setMask(!0),B.buffers.color.setMask(!0),B.setPolygonOffset(!1)}function yt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(k.state.transmissionRenderTarget[r.id]===void 0){let e=je.has(`EXT_color_buffer_half_float`)||je.has(`EXT_color_buffer_float`);k.state.transmissionRenderTarget[r.id]=new ln(1,1,{generateMipmaps:!0,type:e?b:p,minFilter:d,samples:Math.max(4,Me.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Yt.workingColorSpace})}let a=k.state.transmissionRenderTarget[r.id],o=r.viewport||ce;a.setSize(o.z*F.transmissionResolutionScale,o.w*F.transmissionResolutionScale);let s=F.getRenderTarget(),c=F.getActiveCubeFace(),l=F.getActiveMipmapLevel();F.setRenderTarget(a),F.getClearColor(de),fe=F.getClearAlpha(),fe<1&&F.setClearColor(16777215,.5),F.clear(),Oe&&Ke.render(n);let u=F.toneMapping;F.toneMapping=0;let f=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),k.setupLightsView(r),Se===!0&&We.setGlobalState(F.clippingPlanes,r),bt(e,n,r),Pe.updateMultisampleRenderTarget(a),Pe.updateRenderTargetMipmap(a),je.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,xt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(Pe.updateMultisampleRenderTarget(a),Pe.updateRenderTargetMipmap(a))}F.setRenderTarget(s,c,l),F.setClearColor(de,fe),f!==void 0&&(r.viewport=f),F.toneMapping=u}function bt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&xt(o,t,n,s,l,c)}}function xt(e,t,n,r,i,a){I!==null&&i.isNodeMaterial&&I.setObject(e,i),e.onBeforeRender(F,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(F,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,F.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,F.renderBufferDirect(n,t,r,i,e,a),i.side=2):F.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(F,t,n,r,i,a)}function W(e,t,n){t.isScene!==!0&&(t=De);let r=V.get(e),i=k.state.lights,a=k.state.shadowsArray,o=i.state.version,s=Be.getParameters(e,i.state,a,t,n,k.state.lightProbeGridArray),c=Be.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Fe.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,at),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Ct(e,s),d}else s.uniforms=Be.getUniforms(e),I!==null&&e.isNodeMaterial&&I.build(e,n,s),e.onBeforeCompile(s,F),d=Be.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=We.uniform),Ct(e,s),r.needsLights=Dt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=k.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function St(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Bc.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Ct(e,t){let n=V.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function wt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function Tt(e,t,n,r,i){t.isScene!==!0&&(t=De),Pe.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=L===null?F.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Yt.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Fe.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(h=F.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=V.get(r),y=k.state.lights;if(Se===!0&&(Ce===!0||e!==se)){let t=e===se&&r.id===R;We.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==We.numPlanes||v.numIntersection!==We.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=k.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=W(r,t,i),I&&r.isNodeMaterial&&I.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(B.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==R&&(R=r.id,C=!0),v.needsLights){let e=wt(k.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||se!==e){B.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(z,`projectionMatrix`,e.projectionMatrix),T.setValue(z,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(z,Te.setFromMatrixPosition(e.matrixWorld)),Me.logarithmicDepthBuffer&&T.setValue(z,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(z,`isOrthographic`,e.isOrthographicCamera===!0),se!==e&&(se=e,C=!0,w=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&T.setValue(z,`sunShadowMap`,y.state.sunShadowMap,Pe),y.state.directionalShadowMap.length>0&&T.setValue(z,`directionalShadowMap`,y.state.directionalShadowMap,Pe),y.state.spotShadowMap.length>0&&T.setValue(z,`spotShadowMap`,y.state.spotShadowMap,Pe),y.state.pointShadowMap.length>0&&T.setValue(z,`pointShadowMap`,y.state.pointShadowMap,Pe)),i.isSkinnedMesh){T.setOptional(z,i,`bindMatrix`),T.setOptional(z,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(z,`boneTexture`,e.boneTexture,Pe))}i.isBatchedMesh&&(T.setOptional(z,i,`batchingTexture`),T.setValue(z,`batchingTexture`,i._matricesTexture,Pe),T.setOptional(z,i,`batchingIdTexture`),T.setValue(z,`batchingIdTexture`,i._indirectTexture,Pe),T.setOptional(z,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(z,`batchingColorTexture`,i._colorsTexture,Pe));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&qe.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(z,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=su()),C){if(T.setValue(z,`toneMappingExposure`,F.toneMappingExposure),v.needsLights&&Et(E,w),a&&r.fog===!0&&Ve.refreshFogUniforms(E,a),Ve.refreshMaterialUniforms(E,r,he,me,k.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}Bc.upload(z,St(v),E,Pe)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Bc.upload(z,St(v),E,Pe),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(z,`center`,i.center),T.setValue(z,`modelViewMatrix`,i.modelViewMatrix),T.setValue(z,`normalMatrix`,i.normalMatrix),T.setValue(z,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];$e.update(n,x),$e.bind(n,x)}}return x}function Et(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Dt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ae},this.getActiveMipmapLevel=function(){return oe},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(e,t,n){let r=V.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),V.get(e.texture).__webglTexture=t,V.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=V.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){L=e,ae=t,oe=n;let r=null,i=!1,a=!1;if(e){let o=V.get(e);if(o.__useDefaultFramebuffer!==void 0){B.bindFramebuffer(z.FRAMEBUFFER,o.__webglFramebuffer),ce.copy(e.viewport),le.copy(e.scissor),ue=e.scissorTest,B.viewport(ce),B.scissor(le),B.setScissorTest(ue),R=-1;return}if(o.__webglFramebuffer===void 0)Pe.setupRenderTarget(e);else if(o.__hasExternalTextures)Pe.rebindTextures(e,V.get(e.texture).__webglTexture,V.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&V.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);Pe.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=V.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&Pe.useMultisampledRTT(e)===!1?V.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,ce.copy(e.viewport),le.copy(e.scissor),ue=e.scissorTest}else ce.copy(ve).multiplyScalar(he).floor(),le.copy(ye).multiplyScalar(he).floor(),ue=be;if(n!==0&&(r=ne),B.bindFramebuffer(z.FRAMEBUFFER,r)&&B.drawBuffers(e,r),B.viewport(ce),B.scissor(le),B.setScissorTest(ue),i){let r=V.get(e.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=V.get(e.textures[t]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=V.get(e.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,t.__webglTexture,n)}R=-1};function Ot(e){let t=V.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Me.textureFormatReadable(e.format),t.__typeReadable=Me.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=V.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){B.bindFramebuffer(z.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+s);let u=Ot(o);if(u.__formatReadable===!1){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&z.readPixels(t,n,r,i,Xe.convert(c),Xe.convert(l),a)}finally{let e=L===null?null:V.get(L).__webglFramebuffer;B.bindFramebuffer(z.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=V.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){B.bindFramebuffer(z.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+s);let d=Ot(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,f),z.bufferData(z.PIXEL_PACK_BUFFER,a.byteLength,z.STREAM_READ),z.readPixels(t,n,r,i,Xe.convert(l),Xe.convert(u),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);let p=L===null?null:V.get(L).__webglFramebuffer;B.bindFramebuffer(z.FRAMEBUFFER,p);let m=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await mt(z,m,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,f),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,a),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer(f),z.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Pe.setTexture2D(e,0),z.copyTexSubImage2D(z.TEXTURE_2D,n,0,0,o,s,i,a),B.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Xe.convert(t.format),_=Xe.convert(t.type),v;t.isData3DTexture?(Pe.setTexture3D(t,0),v=z.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Pe.setTexture2DArray(t,0),v=z.TEXTURE_2D_ARRAY):(Pe.setTexture2D(t,0),v=z.TEXTURE_2D),B.activeTexture(z.TEXTURE0),B.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,t.flipY),B.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),B.pixelStorei(z.UNPACK_ALIGNMENT,t.unpackAlignment);let y=B.getParameter(z.UNPACK_ROW_LENGTH),b=B.getParameter(z.UNPACK_IMAGE_HEIGHT),x=B.getParameter(z.UNPACK_SKIP_PIXELS),S=B.getParameter(z.UNPACK_SKIP_ROWS),C=B.getParameter(z.UNPACK_SKIP_IMAGES);B.pixelStorei(z.UNPACK_ROW_LENGTH,h.width),B.pixelStorei(z.UNPACK_IMAGE_HEIGHT,h.height),B.pixelStorei(z.UNPACK_SKIP_PIXELS,l),B.pixelStorei(z.UNPACK_SKIP_ROWS,u),B.pixelStorei(z.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=V.get(e),r=V.get(t),h=V.get(n.__renderTarget),g=V.get(r.__renderTarget);B.bindFramebuffer(z.READ_FRAMEBUFFER,h.__webglFramebuffer),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,V.get(e).__webglTexture,i,d+n),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,V.get(t).__webglTexture,a,m+n)),z.blitFramebuffer(l,u,o,s,f,p,o,s,z.DEPTH_BUFFER_BIT,z.NEAREST);B.bindFramebuffer(z.READ_FRAMEBUFFER,null),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||V.has(e)){let n=V.get(e),r=V.get(t);B.bindFramebuffer(z.READ_FRAMEBUFFER,re),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,ie);for(let e=0;e<c;e++)w?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,n.__webglTexture,i),T?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,r.__webglTexture,a),i===0?T?z.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):z.copyTexSubImage2D(v,a,f,p,l,u,o,s):z.blitFramebuffer(l,u,o,s,f,p,o,s,z.COLOR_BUFFER_BIT,z.NEAREST);B.bindFramebuffer(z.READ_FRAMEBUFFER,null),B.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?z.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?z.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):z.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):z.texSubImage2D(z.TEXTURE_2D,a,f,p,o,s,g,_,h);B.pixelStorei(z.UNPACK_ROW_LENGTH,y),B.pixelStorei(z.UNPACK_IMAGE_HEIGHT,b),B.pixelStorei(z.UNPACK_SKIP_PIXELS,x),B.pixelStorei(z.UNPACK_SKIP_ROWS,S),B.pixelStorei(z.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&z.generateMipmap(v),B.unbindTexture()},this.initRenderTarget=function(e){V.get(e).__webglFramebuffer===void 0&&Pe.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Pe.setTextureCube(e,0):e.isData3DTexture?Pe.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Pe.setTexture2DArray(e,0):Pe.setTexture2D(e,0),B.unbindTexture()},this.resetState=function(){ae=0,oe=0,L=null,B.reset(),Ze.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Qe}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Yt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Yt._getUnpackColorSpace()}},lu=676,uu=52,du=1.4,fu=3,pu=.8,mu=4,hu=6,gu=1.5,_u=1e-4,vu=.001,yu=e=>e*e*e*(10-15*e+6*e*e),bu=e=>30*e*e*(1-e)*(1-e),xu=2.8,Su=14,Cu=.5,wu=2.5,Tu=9*Math.PI/180,Eu=[0,-Math.sin(Tu),-Math.cos(Tu)],Du=new q(0,-.12,0),Ou=class{canvas;camera;cfg;theta=0;lean=0;twist=0;center=new q;rotation=new J;omega=[0,0,0];thetaVel=0;targetTheta=0;leanVel=0;targetLean=0;twistVel=0;targetTwist=0;centerVel=new q;centerAccel=new q;pivot;grabbing=!1;spinning=!1;spinButton=!1;grabPointer=-1;last=new K;touches=new Map;pinchDistance=0;pinchBearing=0;pinchMid=new K;twoFinger=!1;distance=6.6;targetDistance=6.6;followEye=new q;followShare=0;followZoom=1;zoomEnabled=!0;get locked(){return this.lockedNow}set locked(e){this.lockedNow=e,e&&(this.endGrab(),this.twoFinger=!1)}lockedNow=!1;get settled(){return!this.grabbing&&!this.twoFinger&&!this.glide&&Math.abs(this.theta)<.03&&Math.abs(this.lean)<.03&&Math.abs(this.thetaVel)<.05&&Math.abs(this.leanVel)<.05&&Math.abs(this.twistVel)<.05}rolling=!1;stageX=0;stageVel=0;pan=0;jumps=0;glide=null;tmp=new q;tmp2=new q;prevVel=new q;rot4=new fn;turn4=new fn;constructor(e,t,n){this.canvas=e,this.camera=t,this.cfg=n,this.pivot=new q(0,-n.pivotDepth,0),this.updateKinematics(0),this.placeCamera(),e.addEventListener(`pointerdown`,this.onPointerDown),e.addEventListener(`pointermove`,this.onPointerMove),e.addEventListener(`pointerup`,this.onPointerUp),e.addEventListener(`pointercancel`,this.onPointerUp),e.addEventListener(`wheel`,this.onWheel,{passive:!1}),e.addEventListener(`contextmenu`,e=>e.preventDefault())}placeAt(e,t=0){this.glide=null,this.stageX=e,this.stageVel=0,this.pan=t,this.updateKinematics(0),this.placeCamera()}glideTo(e,t,n,r=0){this.glide={from:this.stageX,delta:e-this.stageX,panFrom:this.pan,panDelta:r-this.pan,seconds:t,t:0,wrap:0,panWrap:0,wrapped:!1,onDone:n}}swipe(e,t,n,r,i,a){let o=e*t;this.glide={from:this.stageX,delta:r*o,panFrom:this.pan,panDelta:-(1-r)*o,seconds:n,t:0,wrap:-r*o,panWrap:(1-r)*o,wrapped:!1,onWrap:i,onDone:a}}get crossing(){let e=Math.tan(this.camera.fov*Math.PI/360)*this.camera.aspect;return 2*(this.targetDistance*e+this.cfg.outerRadius*Math.sqrt(1+e*e))}get moving(){return this.glide!==null}get stagePosition(){return this.stageX}get velocity(){return this.centerVel}get holding(){return this.grabbing||this.twoFinger}get turning(){return this.grabbing&&this.spinning||this.twoFinger}resetTurn(){this.lean=this.leanVel=this.targetLean=0,this.twist=this.twistVel=this.targetTwist=0,this.updateKinematics(0)}get panJumps(){return this.jumps}zoomTo(e,t=!1){this.targetDistance=Vt.clamp(e,xu,Su),t&&(this.distance=this.targetDistance,this.placeCamera())}screenCircle(){let e=this.toScreen(this.center,new K);return{x:e.x,y:e.y,r:this.globeScreenRadius(e)}}restCircle(){let e=new q(this.pan,0,0),t=this.toScreen(e,new K),n=new q().setFromMatrixColumn(this.camera.matrixWorld,0),r=this.toScreen(n.multiplyScalar(this.cfg.outerRadius).add(e),new K);return{x:t.x,y:t.y,r:r.distanceTo(t)}}screenOutline(){let e=this.camera,t=new q().copy(this.center).applyMatrix4(e.matrixWorldInverse),n=t.length(),r=this.cfg.outerRadius;if(n<=r*1.001){let e=this.screenCircle();return{x:e.x,y:e.y,rx:e.r,ry:e.r,angle:0}}let i=t.divideScalar(n),a=r/n,o=Math.sqrt(1-a*a),s=new q(0,0,-1).addScaledVector(i,i.z);s.lengthSq()<1e-10&&s.set(1,0,0),s.normalize();let c=new q().crossVectors(i,s),l=this.canvas.getBoundingClientRect(),u=e.projectionMatrix.elements,d=new q,f=e=>(d.copy(i).multiplyScalar(o).addScaledVector(s,a*Math.cos(e)).addScaledVector(c,a*Math.sin(e)).multiplyScalar(n*o),new K((.5+.5*u[0]*d.x/-d.z)*l.width,(.5-.5*u[5]*d.y/-d.z)*l.height)),p=f(0),m=f(Math.PI),h=p.clone().add(m).multiplyScalar(.5),g=m.clone().sub(p),_=g.length()/2;g.normalize();let v=0;for(let e=1;e<24;e++){let t=f(e/24*Math.PI).sub(h);v=Math.max(v,Math.abs(t.x*g.y-t.y*g.x))}return{x:h.x,y:h.y,rx:_,ry:v,angle:Math.atan2(g.y,g.x)}}bodyAccel(e){let t=this.centerAccel;return[-t.x,-e-t.y,-t.z]}update(e,t){if(e<=0)return;this.prevVel.copy(this.centerVel);let n=Math.max(1,Math.ceil(e*480)),r=e/n,i=this.grabbing&&!this.spinning,a=this.grabbing&&this.spinning,o=a||this.twoFinger,s=this.cfg.maxTilt,c=Math.exp(-(this.rolling?mu:pu)*r);for(let e=0;e<n;e++){let e;e=i?lu*(this.targetTheta-this.theta)-uu*this.thetaVel:-14*this.theta-du*this.thetaVel,this.thetaVel+=e*r,this.theta+=this.thetaVel*r,Math.abs(this.theta)>s&&(this.theta=Math.sign(this.theta)*s,this.thetaVel*this.theta>0&&(this.thetaVel=0)),e=a?lu*(this.targetLean-this.lean)-uu*this.leanVel:-14*this.lean-du*this.leanVel,this.leanVel=Vt.clamp(this.leanVel+e*r,-6,hu),this.lean+=this.leanVel*r,Math.abs(this.lean)>s&&(this.lean=Math.sign(this.lean)*s,this.leanVel*this.lean>0&&(this.leanVel=0)),o?this.twistVel+=(lu*(this.targetTwist-this.twist)-uu*this.twistVel)*r:this.twistVel*=c,this.twistVel=Vt.clamp(this.twistVel,-6,hu),this.twist+=this.twistVel*r}!i&&Math.abs(this.theta)<_u&&Math.abs(this.thetaVel)<vu&&(this.theta=this.thetaVel=0),!a&&Math.abs(this.lean)<_u&&Math.abs(this.leanVel)<vu&&(this.lean=this.leanVel=0),!o&&Math.abs(this.twistVel)<vu&&(this.twistVel=0),i||(this.targetTheta=this.theta),a||(this.targetLean=this.lean),o||(this.targetTwist=this.twist);let l=Math.round(this.twist/(2*Math.PI));l!==0&&(this.twist-=l*2*Math.PI,this.targetTwist-=l*2*Math.PI),this.advanceGlide(e),this.updateKinematics(e),this.centerAccel.subVectors(this.centerVel,this.prevVel).divideScalar(e);let u=fu*t;this.centerAccel.length()>u&&this.centerAccel.setLength(u),this.distance+=(this.targetDistance-this.distance)*(1-Math.exp(-10*e)),this.placeCamera()}advanceGlide(e){let t=this.glide;if(!t)return;t.t=Math.min(t.t+e,t.seconds);let n=t.t/t.seconds;!t.wrapped&&t.wrap!==0&&n>=.5&&(t.wrapped=!0,this.jumps+=t.panWrap,t.onWrap?.()),this.stageX=t.from+t.delta*yu(n)+(t.wrapped?t.wrap:0),this.pan=t.panFrom+t.panDelta*yu(n)+(t.wrapped?t.panWrap:0),this.stageVel=t.delta*bu(n)/t.seconds,t.t>=t.seconds&&(this.stageVel=0,this.glide=null,t.onDone?.())}updateKinematics(e){let t=this.cfg.pivotDepth,n=Math.sin(this.theta),r=Math.cos(this.theta);this.rolling?(this.pivot.set(this.stageX-t*this.theta,-t,t*this.lean),this.center.set(this.pivot.x,0,this.pivot.z),e>0&&this.centerVel.set(-t*this.thetaVel+this.stageVel,0,t*this.leanVel)):(this.pivot.x=this.stageX,this.center.set(this.pivot.x-t*n,this.pivot.y+t*r,0),e>0&&this.centerVel.set(-t*r*this.thetaVel+this.stageVel,-t*n*this.thetaVel,0)),this.rot4.makeRotationZ(this.theta),this.rot4.multiply(this.turn4.makeRotationX(this.lean)),this.rot4.multiply(this.turn4.makeRotationY(this.twist)),this.rotation.setFromMatrix4(this.rot4);let i=this.leanVel,a=this.twistVel*Math.cos(this.lean);this.omega[0]=r*i-n*a,this.omega[1]=n*i+r*a,this.omega[2]=this.thetaVel+this.twistVel*Math.sin(this.lean)}placeCamera(){let e=this.camera,t=this.tmp.copy(Du);t.x+=this.pan,e.position.set(t.x,t.y+this.distance*Math.sin(Tu),t.z+this.distance*Math.cos(Tu)),this.followShare>0&&(e.position.lerp(this.followEye,this.followShare),t.set(e.position.x+Eu[0],e.position.y+Eu[1],e.position.z+Eu[2])),e.lookAt(t),e.updateMatrixWorld()}pointerPos(e,t){let n=this.canvas.getBoundingClientRect();return t.set(e.clientX-n.left,e.clientY-n.top)}toScreen(e,t){let n=this.tmp.copy(e).project(this.camera),r=this.canvas.getBoundingClientRect();return t.set((n.x*.5+.5)*r.width,(.5-n.y*.5)*r.height)}globeScreenRadius(e){let t=this.tmp2.setFromMatrixColumn(this.camera.matrixWorld,0);return this.toScreen(t.multiplyScalar(this.cfg.outerRadius).add(this.center),new K).distanceTo(e)}overGlobe(e){let t=this.toScreen(this.center,new K);return e.distanceTo(t)<=this.globeScreenRadius(t)*1.06}onPointerDown=e=>{let t=this.pointerPos(e,new K);e.pointerType===`touch`&&(this.touches.set(e.pointerId,t.clone()),this.touches.size===2)?(this.endGrab(),this.pinchDistance=this.touchSpread(),this.pinchBearing=this.touchBearing(),this.touchMid(this.pinchMid),this.twoFinger=!this.lockedNow,this.targetTwist=this.twist):this.grabbing||this.lockedNow||e.pointerType===`mouse`&&e.button!==0&&e.button!==2||this.overGlobe(t)&&(this.grabbing=!0,this.grabPointer=e.pointerId,this.spinButton=e.pointerType===`mouse`&&e.button===2,this.spinning=e.ctrlKey||this.spinButton,this.targetTheta=this.theta,this.targetLean=this.lean,this.targetTwist=this.twist,this.last.copy(t),this.canvas.setPointerCapture(e.pointerId),this.canvas.style.cursor=`grabbing`,e.preventDefault())};onPointerMove=e=>{let t=this.pointerPos(e,new K);if(e.pointerType===`touch`&&this.touches.has(e.pointerId)&&(this.touches.get(e.pointerId).copy(t),this.touches.size===2)){let e=this.touchSpread();if(this.zoomEnabled&&this.pinchDistance>0&&e>0&&this.zoomBy(this.pinchDistance/e),this.pinchDistance=e,this.twoFinger){let e=this.touchBearing(),t=this.touchMid(new K),n=e-this.pinchBearing;n-=2*Math.PI*Math.round(n/(2*Math.PI));let r=this.globeScreenRadius(this.toScreen(this.center,new K));this.targetTwist=Vt.clamp(this.targetTwist+(t.x-this.pinchMid.x)/r-n,this.twist-gu,this.twist+gu),this.pinchBearing=e,this.pinchMid.copy(t)}}else if(this.grabbing&&e.pointerId===this.grabPointer){if((e.ctrlKey||this.spinButton)!==this.spinning&&(this.spinning=e.ctrlKey||this.spinButton,this.targetTheta=this.theta,this.targetLean=this.lean,this.targetTwist=this.twist),this.spinning){let e=this.globeScreenRadius(this.toScreen(this.center,new K)),n=this.cfg.maxTilt;this.targetTwist=Vt.clamp(this.targetTwist+(t.x-this.last.x)/e,this.twist-gu,this.twist+gu),this.targetLean=Vt.clamp(this.targetLean+(t.y-this.last.y)/e,-n,n),this.last.copy(t);return}let n=this.toScreen(this.pivot,new K),r=t.x-n.x,i=-(t.y-n.y),a=t.x-this.last.x,o=-(t.y-this.last.y),s=this.toScreen(this.center,new K),c=.6*this.globeScreenRadius(s),l=Math.max(r*r+i*i,c*c),u=this.cfg.maxTilt;this.targetTheta=Vt.clamp(this.targetTheta+(r*o-i*a)/l,-u,u),this.last.copy(t)}else e.pointerType===`mouse`&&(this.canvas.style.cursor=this.overGlobe(t)&&!this.lockedNow?`grab`:``)};onPointerUp=e=>{this.touches.delete(e.pointerId),this.touches.size<2&&(this.pinchDistance=0,this.twoFinger=!1),e.pointerId===this.grabPointer&&this.endGrab()};endGrab(){this.grabbing&&(this.canvas.hasPointerCapture(this.grabPointer)&&this.canvas.releasePointerCapture(this.grabPointer),this.grabbing=!1,this.spinning=!1,this.spinButton=!1,this.grabPointer=-1,this.canvas.style.cursor=``)}touchSpread(){let e=[...this.touches.values()];return e.length>=2?e[0].distanceTo(e[1]):0}touchBearing(){let[e,t]=[...this.touches.values()];return t?Math.atan2(t.y-e.y,t.x-e.x):0}touchMid(e){let[t,n]=[...this.touches.values()];return n?e.copy(t).add(n).multiplyScalar(.5):e.copy(t??e)}onWheel=e=>{if(e.preventDefault(),!this.zoomEnabled)return;let t=e.deltaMode===1?.04:e.deltaMode===2?.8:.0012;this.zoomBy(Math.exp(e.deltaY*t))};zoomBy(e){this.followShare>.5?this.followZoom=Vt.clamp(this.followZoom*e,Cu,wu):this.targetDistance=Vt.clamp(this.targetDistance*e,xu,Su)}},ku={mouth:.88,beadRadius:.016,beadSink:.004,lidRadius:.53,lidThickness:.032,rimWidth:.075,rimProud:.004,knobRadius:.05,knobHeight:.05,puckRadius:.042,puckDepth:.012,collarWall:.008,collarDepth:.035,collarClearance:.008,vents:8,ventRing:.3,ventRadius:.013,waterCeiling:.85};function Au(e){return e===`specks`?1:e===`nan`?2:0}function ju(e,t=!1,n=0){let r=ku.mouth,i=(Math.sqrt(e.outerRadius**2-r*r)+Math.sqrt(e.innerRadius**2-r*r))/2,a=r-ku.beadSink,o=ku.lidThickness+ku.knobHeight;return{bead:i,beadY:a,seat:a+ku.beadRadius,collar:i-ku.beadRadius-ku.collarClearance-ku.collarWall/2,top:o,rimIn:ku.lidRadius-ku.rimWidth,lite:t,debug:n}}function Mu(e,t){let n=Math.hypot(t.x,t.z),r=(e,r,i)=>Math.hypot(n+e,Math.max(i-t.y,t.y-r));return Math.max(r(ku.lidRadius+ku.rimProud,-ku.collarDepth,ku.lidThickness+ku.rimProud),r(ku.knobRadius,0,e.top))}var Nu={bloom:1.5,tannin:[.05,1.7,3.6],tintPower:.6,bloomLost:.35},Pu=`, bowlLid: mat4x4f, bowlState: vec4f, bowlLife: mat4x4f, bowlDetail: vec4f, bowlWater: vec4f, bowlBetta: mat4x4f`,Fu=e=>e.toFixed(6);function Iu(e){return`
// ---- the betta bowl (src/render/bowl.ts) -----------------------------------------------
const BOWL_MOUTH: f32 = ${Fu(ku.mouth)};
const BOWL_BEAD_R: f32 = ${Fu(e.bead)};
const BOWL_BEAD_Y: f32 = ${Fu(e.beadY)};
const BOWL_BEAD_T: f32 = ${Fu(ku.beadRadius)};
const BOWL_LID_R: f32 = ${Fu(ku.lidRadius)};
const BOWL_LID_T: f32 = ${Fu(ku.lidThickness)};
const BOWL_RIM_IN: f32 = ${Fu(e.rimIn)};
const BOWL_RIM_PROUD: f32 = ${Fu(ku.rimProud)};
const BOWL_KNOB_R: f32 = ${Fu(ku.knobRadius)};
const BOWL_KNOB_H: f32 = ${Fu(ku.knobHeight)};
const BOWL_PUCK_R: f32 = ${Fu(ku.puckRadius)};
const BOWL_PUCK_D: f32 = ${Fu(ku.puckDepth)};
// The lamp's face: radiance at full brightness by day (warm white, HDR; studioLamp tints it for its
// night mode, studioBeam its beam), and its light's cone (the cosine of its half-angle at the edge,
// and inside which it is full).
const BOWL_LAMP: vec3f = vec3f(60.0, 52.0, 40.0);
const BOWL_LAMP_COS_OUT: f32 = 0.55;
const BOWL_LAMP_COS_IN: f32 = 0.9;
const BOWL_COLLAR_R: f32 = ${Fu(e.collar)};
const BOWL_COLLAR_W: f32 = ${Fu(ku.collarWall)};
const BOWL_COLLAR_D: f32 = ${Fu(ku.collarDepth)};
const BOWL_VENTS: f32 = ${Fu(ku.vents)};
const BOWL_VENT_RING: f32 = ${Fu(ku.ventRing)};
const BOWL_VENT_R: f32 = ${Fu(ku.ventRadius)};
const BOWL_LID_TOP: f32 = ${Fu(e.top)};
const BOWL_IOR: f32 = 1.5;
// A surface is met within this of it (world units); and a step inside the glass, at least.
const BOWL_EPS: f32 = 1.5e-4;

// Set by globes_shade: the globe's turn (its frame to the translating one), the lid's pose (the
// translating frame to the lid's) and whether the lid is there.
var<private> bowlRot: mat3x3f;
var<private> bowlM: mat4x4f;
var<private> bowlLidOn: bool;
// The lamp (set with the lid): its face's middle and the way it shines (the translating frame),
// and its brightness (0..1). Its colour, by day or in its night mode, is studioLamp's (studio.ts);
// bowlSun, the light the photons carry (GLOBES_SUN_IRR) in that colour, set by globes_shade.
var<private> bowlLampP: vec3f;
var<private> bowlLampD: vec3f;
var<private> bowlLamp: f32;
var<private> bowlSun: vec3f;

// In the open mouth (a point on or in the glass's sphere): above the plane the glass is cut at.
fn bowl_inMouth(p: vec3f) -> bool {
  return dot(p, bowlRot[1]) > BOWL_MOUTH;
}

fn bowl_smin(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// The rim's bead (the globe's frame).
fn bowl_beadSdf(q: vec3f) -> f32 {
  return length(vec2f(length(q.xz) - BOWL_BEAD_R, q.y - BOWL_BEAD_Y)) - BOWL_BEAD_T;
}

// A rounded box in a plane (centred, half-size h, its corners rounded by k).
fn bowl_box2(p: vec2f, h: vec2f, k: f32) -> f32 {
  let w = abs(p) - h + vec2f(k);
  return min(max(w.x, w.y), 0.0) + length(max(w, vec2f(0.0))) - k;
}

// The lid's glass (its own frame: its underside's middle at the origin): the disc, its edge
// rounded right over (hidden in the rim), and its vents through it.
fn bowl_lidSdf(q: vec3f) -> f32 {
  let r = length(q.xz);
  let th = 0.5 * BOWL_LID_T;
  var d = length(vec2f(max(r - (BOWL_LID_R - th), 0.0), q.y - th)) - th;
  // (It runs a little way into the rim, so no face of it shows there.)
  d = max(d, r - (BOWL_RIM_IN + 0.003));
  let sector = 6.2831853 / BOWL_VENTS;
  // (atan2 given an angle on the axis too, where a GPU that follows SPIR-V's rules need not.)
  let a = (fract(atan2(q.z, select(q.x, 1e-20, q.x == 0.0 && q.z == 0.0)) / sector + 0.5) - 0.5) * sector;
  return max(d, BOWL_VENT_R - length(vec2f(r * cos(a) - BOWL_VENT_RING, r * sin(a))));
}

// The lid's black parts (its own frame): the rim round the glass's edge, the knob, the collar under
// it and the lamp's puck under its middle.
fn bowl_lidBlackSdf(q: vec3f) -> f32 {
  let r = length(q.xz);
  let rim = bowl_box2(vec2f(r - 0.5 * (BOWL_RIM_IN + BOWL_LID_R + BOWL_RIM_PROUD), q.y - 0.5 * BOWL_LID_T), vec2f(0.5 * (BOWL_LID_R + BOWL_RIM_PROUD - BOWL_RIM_IN), 0.5 * BOWL_LID_T + BOWL_RIM_PROUD), 0.006);
  let knob = bowl_box2(vec2f(r, q.y - (BOWL_LID_T + 0.5 * BOWL_KNOB_H - 0.002)), vec2f(BOWL_KNOB_R, 0.5 * BOWL_KNOB_H + 0.002), 0.008);
  let wc = vec2f(abs(r - BOWL_COLLAR_R) - 0.5 * BOWL_COLLAR_W + 0.0015, abs(q.y + 0.5 * BOWL_COLLAR_D) - 0.5 * BOWL_COLLAR_D);
  let collar = min(max(wc.x, wc.y), 0.0) + length(max(wc, vec2f(0.0))) - 0.0015;
  let puck = bowl_box2(vec2f(r, q.y + 0.5 * BOWL_PUCK_D - 0.001), vec2f(BOWL_PUCK_R, 0.5 * BOWL_PUCK_D + 0.001), 0.003);
  return min(min(bowl_smin(rim, collar, 0.004), knob), puck);
}

// part 1: the bead (q in the globe's frame); 2: the lid's glass, 3: its black parts (q in its own).
fn bowl_sdf(part: u32, q: vec3f) -> f32 {
  if (part == 1u) { return bowl_beadSdf(q); }
  if (part == 3u) { return bowl_lidBlackSdf(q); }
  return bowl_lidSdf(q);
}

// (The field at a tetrahedron's corners round q in turn, e.xyy, e.yyx, e.yxy and e.xxx, from one
// place: see shaders.ts globesZero.)
fn bowl_normal(part: u32, q: vec3f) -> vec3f {
  let e = vec2f(1.0, -1.0) * BOWL_EPS;
  var g = vec3f(0.0);
  for (var k = globesZero; k < 4; k++) {
    let o = select(e.yyy, e.xxx, vec3<bool>((k & 1) == (k >> 1u), k > 1, (k & 1) == 1));
    g += o * bowl_sdf(part, q + o);
  }
  return normalize(g);
}

// Where a ray is within the upright cylinder r <= rad, lo <= y <= hi, ahead of its origin:
// (t0, t1), t0 > t1 if nowhere.
fn bowl_span(o: vec3f, d: vec3f, rad: f32, lo: f32, hi: f32) -> vec2f {
  var t0 = 0.0;
  var t1 = 1e9;
  if (abs(d.y) < 1e-7) {
    if (o.y < lo || o.y > hi) { return vec2f(1.0, 0.0); }
  } else {
    let a = (lo - o.y) / d.y;
    let b = (hi - o.y) / d.y;
    t0 = max(t0, min(a, b));
    t1 = min(t1, max(a, b));
  }
  let A = dot(d.xz, d.xz);
  let B = dot(o.xz, d.xz);
  let C = dot(o.xz, o.xz) - rad * rad;
  if (A < 1e-12) {
    if (C > 0.0) { return vec2f(1.0, 0.0); }
  } else {
    let disc = B * B - A * C;
    if (disc < 0.0) { return vec2f(1.0, 0.0); }
    let sq = sqrt(disc);
    t0 = max(t0, (-B - sq) / A);
    t1 = min(t1, (-B + sq) / A);
  }
  return vec2f(t0, t1);
}

// A piece of the bowl's glass met along a ray: where (t, along the ray in the translating frame),
// which (0: none), and the ray in that piece's frame.
struct BowlHit {
  t: f32,
  part: u32,
  o: vec3f,
  d: vec3f,
}

fn bowl_march(part: u32, o: vec3f, d: vec3f, span: vec2f) -> f32 {
  if (span.x > span.y) { return 1e9; }
  var t = span.x;
  for (var i = 0; i < 80; i++) {
    let s = bowl_sdf(part, o + d * t);
    if (s < BOWL_EPS) { return t; }
    t += max(0.9 * s, 0.5 * BOWL_EPS);
    if (t > span.y) { break; }
  }
  return 1e9;
}

// Whether a point is within the upright cylinder r <= rad, lo <= y <= hi.
fn bowl_within(q: vec3f, rad: f32, lo: f32, hi: f32) -> bool {
  return dot(q.xz, q.xz) <= rad * rad && q.y >= lo && q.y <= hi;
}

// The nearest of the bowl's glass along a ray (o, d in the translating frame; d of unit length).
// A ray that starts inside a piece is in it at t = 0. (Each piece lies within its cylinder, so a
// ray can start inside it only from there.)
fn bowl_hit(o: vec3f, d: vec3f) -> BowlHit {
  var best = BowlHit(1e9, 0u, vec3f(0.0), vec3f(0.0));
  let ob = transpose(bowlRot) * o;
  let db = transpose(bowlRot) * d;
  let pad = 2.0 * BOWL_EPS;
  let beadR = BOWL_BEAD_R + BOWL_BEAD_T + pad;
  let beadLo = BOWL_BEAD_Y - BOWL_BEAD_T - pad;
  let beadHi = BOWL_BEAD_Y + BOWL_BEAD_T + pad;
  if (bowl_within(ob, beadR, beadLo, beadHi) && bowl_beadSdf(ob) < 0.0) { return BowlHit(0.0, 1u, ob, db); }
  let tb = bowl_march(1u, ob, db, bowl_span(ob, db, beadR, beadLo, beadHi));
  if (tb < best.t) { best = BowlHit(tb, 1u, ob, db); }
  if (bowlLidOn) {
    let r = mat3x3f(bowlM[0].xyz, bowlM[1].xyz, bowlM[2].xyz);
    let ol = (bowlM * vec4f(o, 1.0)).xyz;
    let dl = r * d;
    let lidR = BOWL_LID_R + BOWL_RIM_PROUD + pad;
    let lidLo = -BOWL_COLLAR_D - pad;
    let lidHi = BOWL_LID_TOP + pad;
    if (bowl_within(ol, lidR, lidLo, lidHi)) {
      if (bowl_lidBlackSdf(ol) < 0.0) { return BowlHit(0.0, 3u, ol, dl); }
      if (bowl_lidSdf(ol) < 0.0) { return BowlHit(0.0, 2u, ol, dl); }
    }
    let span = bowl_span(ol, dl, lidR, lidLo, lidHi);
    let tl = bowl_march(2u, ol, dl, span);
    if (tl < best.t) { best = BowlHit(tl, 2u, ol, dl); }
    let tk = bowl_march(3u, ol, dl, span);
    if (tk < best.t) { best = BowlHit(tk, 3u, ol, dl); }
  }
  return best;
}

// A piece's frame back to the translating frame (a direction).
fn bowl_toWorld(part: u32, v: vec3f) -> vec3f {
  if (part == 1u) { return bowlRot * v; }
  return transpose(mat3x3f(bowlM[0].xyz, bowlM[1].xyz, bowlM[2].xyz)) * v;
}

fn bowl_pointToWorld(part: u32, q: vec3f) -> vec3f {
  if (part == 1u) { return bowlRot * q; }
  return transpose(mat3x3f(bowlM[0].xyz, bowlM[1].xyz, bowlM[2].xyz)) * (q - bowlM[3].xyz);
}

// The light a black part of the lid sends back along the ray that met it (h): glossy black
// plastic mirroring the studio, or the lamp's glowing face.
fn bowl_blackShade(h: BowlHit, bgTex: texture_2d<f32>, bgSamp: sampler) -> vec3f {
  let q = h.o + h.d * h.t;
  let nl = bowl_normal(3u, q);
  let r = length(q.xz);
  if (nl.y < -0.7 && r < BOWL_PUCK_R - 0.003 && q.y < -BOWL_PUCK_D + 0.002) {
    // (Its diffuser: brightest in its middle, a dimmer ring round it.)
    return BOWL_LAMP * studioLamp * bowlLamp * (1.0 - 0.4 * smoothstep(0.25 * BOWL_PUCK_R, BOWL_PUCK_R, r)) + vec3f(0.02);
  }
  let n = bowl_toWorld(3u, nl);
  let d = bowl_toWorld(3u, h.d);
  let cosI = clamp(-dot(d, n), 0.0, 1.0);
  let F = 0.045 + 0.955 * pow(1.0 - cosI, 5.0);
  let up = max(dot(n, GLOBES_SUN_DIR), 0.0);
  return F * globes_bg(bgTex, bgSamp, bowl_pointToWorld(3u, q), reflect(d, n)) + vec3f(0.006, 0.0065, 0.008) * studioAmbient * (0.4 + 0.6 * up);
}

// The lamp's light at x (the translating frame), along the way it shines: its cone, falling off
// with the square of the distance (irradiance, at full brightness 1 at 0.4 from its face).
fn bowl_lampAt(x: vec3f) -> f32 {
  let v = x - bowlLampP;
  let d2 = max(dot(v, v), 1e-4);
  let c = dot(v, bowlLampD) * inverseSqrt(d2);
  return bowlLamp * smoothstep(BOWL_LAMP_COS_OUT, BOWL_LAMP_COS_IN, c) * 0.16 / d2;
}

// The lamp's light scattered towards the eye along a stretch of ray (p, dir, to tEnd): the haze of
// its cone in the air or the water, streaked like light through a lid's diffuser (sigma: how much
// the medium scatters; T: how much it lets through a unit of path). The rays.
fn bowl_lampAlong(p: vec3f, dir: vec3f, tEnd: f32, sigma: f32, ext: vec3f) -> vec3f {
  if (bowlLamp <= 0.0) { return vec3f(0.0); }
  let n = ${e.lite?4:10};
  let dt = tEnd / f32(n);
  var s = vec3f(0.0);
  let side = normalize(cross(bowlLampD, select(vec3f(1.0, 0.0, 0.0), vec3f(0.0, 0.0, 1.0), abs(bowlLampD.x) > 0.9)));
  let side2 = cross(bowlLampD, side);
  // (Dimmed by the medium on its way back to p: a step's worth more at each sample.)
  var T = exp(-ext * (0.5 * dt));
  let Tstep = exp(-ext * dt);
  for (var i = 0; i < n; i++) {
    let x = p + dir * ((f32(i) + 0.5) * dt);
    let v = x - bowlLampP;
    let ay = dot(v, side2);
    let ax = dot(v, side);
    let a = atan2(ay, select(ax, 1e-20, ax == 0.0 && ay == 0.0));
    let rays = 0.55 + 0.45 * sin(a * 17.0 + 1.7 * sin(a * 5.0)) * sin(a * 29.0 + 0.6);
    s += bowl_lampAt(x) * rays * T;
    T *= Tstep;
  }
  return ${e.debug?`dbg_chk(`:``}vec3f(1.0, 0.88, 0.70) * studioBeam * s * sigma * dt${e.debug?`, select(DBG_LAMP_WATER, DBG_LAMP_AIR, sigma < 0.3))`:``};
}

// The water's state (water/effects.ts; set by globes_shade): a bloom of bacteria clouding it, whose
// milky haze scatters the light (bowlCloud: its dimming, per unit of path), and the tannins that
// the almond leaf and the wood give it, tea-brown (BOWL_WATER); bowlMurk: either (0: clear). The
// light the haze sends back for each unit of its dimming, where the light comes in (at the film);
// the light the tea sends back (the water's own glow, the light in it amber), per unit of path at
// full strength; and how much brighter the haze shows the lamp's beam. bowlGlow: the clear water's
// glow, for its dimming, and the tea's; bowlSunExt: the light's dimming on its way down.
const BOWL_BLOOM_LOST: f32 = ${Fu(Nu.bloomLost)};
const BOWL_TANNIN: vec3f = vec3f(${Nu.tannin.map(Fu).join(`, `)});
const BOWL_HAZE: vec3f = vec3f(0.2, 0.2, 0.2);
const BOWL_TEA: vec3f = vec3f(0.047, 0.056, 0.006);
const BOWL_BLOOM_LAMP: f32 = 0.8;
var<private> bowlCloud: f32;
var<private> bowlMurk: f32;
var<private> bowlGlow: vec3f;
var<private> bowlSunExt: vec3f;

// Through the piece a ray has met (h): the light its face reflects to the ray, how much of the
// ray's light comes through it (absorbed on the way, a share reflected at each face), and where
// and which way the ray leaves it (the translating frame). Inside, a ray that meets a face past
// the critical angle is turned back in (the glass's edges carry light round); after a few such
// turns it is let out as it is.
struct BowlPass {
  col: vec3f,
  T: vec3f,
  p: vec3f,
  d: vec3f,
}

fn bowl_through(h: BowlHit, bgTex: texture_2d<f32>, bgSamp: sampler) -> BowlPass {
  let part = h.part;
  var q = h.o + h.d * h.t;
  var d = h.d;
  var col = vec3f(0.0);
  var T = vec3f(1.0);
  let pw = bowl_pointToWorld(part, q);
  if (bowl_sdf(part, q) > -BOWL_EPS) {
    // In through the face it meets.
    let n = bowl_normal(part, q);
    let F = globes_fresnel(clamp(-dot(d, n), 0.0, 1.0), 1.0, BOWL_IOR);
    col = F * globes_bg(bgTex, bgSamp, pw, bowl_toWorld(part, reflect(d, n)));
    T = vec3f(1.0 - F);
    let dIn = refract(d, n, 1.0 / BOWL_IOR);
    if (dot(dIn, dIn) > 0.5) { d = dIn; }
    q -= n * (2.0 * BOWL_EPS);
  }
  var len = 0.0;
  var turns = 0;
  for (var i = 0; i < ${e.lite?64:128}; i++) {
    let s = -bowl_sdf(part, q);
    if (s < BOWL_EPS) {
      // A face, from inside: out through it, or back in.
      let m = bowl_normal(part, q);
      let out = refract(d, -m, BOWL_IOR);
      if (dot(out, out) < 0.5 && turns < 4) {
        d = reflect(d, m);
        q -= m * (2.0 * BOWL_EPS);
        turns++;
        continue;
      }
      var leave = d;
      var Fo = 0.0;
      if (dot(out, out) > 0.5) {
        leave = out;
        Fo = globes_fresnel(clamp(dot(d, m), 0.0, 1.0), BOWL_IOR, 1.0);
      }
      T *= (1.0 - Fo) * exp(-GLOBES_GLASS_ABS * len);
      return BowlPass(col, T, bowl_pointToWorld(part, q + m * (2.0 * BOWL_EPS)), normalize(bowl_toWorld(part, leave)));
    }
    let step = max(s, BOWL_EPS);
    q += d * step;
    len += step;
  }
  // (Still inside after all that, carried along the glass: out as it goes.)
  return BowlPass(col, T * exp(-GLOBES_GLASS_ABS * len), bowl_pointToWorld(part, q), normalize(bowl_toWorld(part, d)));
}
`}var Lu=2.2,Ru=.07,zu=new q(1.2,2.7,.45),Bu=new Sn(.35,.25,-.6),Vu=(e,t,n)=>{let r=Vt.clamp((n-e)/(t-e),0,1);return r*r*(3-2*r)},Hu=class{shape;u=0;wantOn=!0;toLid=new fn;pose=new fn;at=new q;centre=new q;turn=new Ht;tip=new Ht;tmp=new fn;tipping=new Sn;one=new q(1,1,1);ray=new li;constructor(e){this.shape=e,this.update(0,new J)}get on(){return this.wantOn}get shown(){return this.u<1}get reach(){return Mu(this.shape,this.centre.setFromMatrixPosition(this.toLid))}get seated(){return this.u===0}get lamp(){return Math.max(0,1-this.u/.08)}get clear(){return this.u>.45}set(e){this.wantOn=e}update(e,t){let n=e/Lu;this.u=this.wantOn?Math.max(0,this.u-n):Math.min(1,this.u+n);let r=Vu(.24,1,this.u);this.at.set(0,this.shape.seat+Ru*Vu(0,.3,this.u),0).applyMatrix3(t).addScaledVector(zu,r),this.turn.setFromRotationMatrix(this.tmp.setFromMatrix3(t)),this.tip.setFromEuler(this.tipping.set(Bu.x*r,Bu.y*r,Bu.z*r)),this.turn.premultiply(this.tip),this.pose.compose(this.at,this.turn,this.one),this.toLid.copy(this.pose).invert()}hits(e,t){if(!this.shown)return!1;let n=this.ray.set(e,t).applyMatrix4(this.toLid);return this.span(n,ku.lidRadius+.01,-ku.collarDepth,this.shape.top+.01)}span(e,t,n,r){let i=e.origin,a=e.direction,o=0,s=1/0;if(Math.abs(a.y)<1e-9){if(i.y<n||i.y>r)return!1}else{let e=(n-i.y)/a.y,t=(r-i.y)/a.y;o=Math.max(o,Math.min(e,t)),s=Math.min(s,Math.max(e,t))}let c=a.x*a.x+a.z*a.z,l=i.x*a.x+i.z*a.z,u=i.x*i.x+i.z*i.z-t*t;if(c<1e-12)return u<=0&&o<=s;let d=l*l-c*u;if(d<0)return!1;let f=Math.sqrt(d);return o=Math.max(o,(-l-f)/c),s=Math.min(s,(-l+f)/c),o<=s}},Uu=3,Wu=.45,Gu=[.07,.72,.1],Ku=.08,qu=1.8,Ju=30,Yu=8,Xu=class{lid;controller;state=`idle`;onChange=null;onDrop=null;clock=0;dropped=0;emptyFor=0;constructor(e,t){this.lid=e,this.controller=t}request(){this.state===`idle`?(this.controller.locked=!0,this.set(`waiting`)):(this.state===`waiting`||this.state===`opening`||this.state===`feeding`)&&this.close()}update(e,t,n){if(this.clock+=e,this.state===`waiting`)this.controller.settled?(this.lid.set(!1),this.set(`opening`)):this.clock>Yu&&(this.controller.locked=!1,this.set(`idle`));else if(this.state===`opening`)this.lid.clear&&(this.dropped=0,this.emptyFor=0,this.set(`feeding`));else if(this.state===`feeding`){for(;this.dropped<Uu&&this.clock>=this.dropped*Wu;){let e=this.dropped*2.4+.7,n=Ku*Math.sqrt((this.dropped+.5)/Uu);if(!t([Gu[0]+n*Math.cos(e),Gu[1],Gu[2]+n*Math.sin(e)]))break;this.dropped++,this.onDrop?.()}let r=this.dropped>=Uu;this.emptyFor=r&&n===0?this.emptyFor+e:0,(this.emptyFor>qu||this.clock>Ju)&&this.close()}else this.state===`closing`&&this.lid.seated&&(this.controller.locked=!1,this.set(`idle`))}close(){this.lid.set(!0),this.set(`closing`)}set(e){this.state=e,this.clock=0,this.onChange?.()}},Zu={sunDirection:[-.32,1,.38],sunIrradiance:[3.3,3.05,2.7],causticRays:1024,shaftScatter:1,waterAbsorption:[1.9,.62,.32]},Qu={length:.525,seed:7},$u={outerRadius:1,innerRadius:.99125,pivotDepth:1,maxTilt:60*Math.PI/180,capillaryLength:.0225,contactAngle:20*Math.PI/180},ed={gridRes:128,particlesPerCell:8,fillFraction:.61,gravity:24,flipRatio:.95,affineStrength:0,pressureIterations:50,sor:1.85,driftCorrection:.15,damping:.18,minSubsteps:2,maxSubsteps:8,maxSubstepDt:1/150,minSubstepDt:1/240,stepReach:.04,renderScale:2,seedJitter:0,ghostBand:3.5,minOpenFace:.6,sandLevel:-.55,sandResolution:192,sandReposeDeg:30,sandFlowSpeed:2,sandCreepSpeed:.25,particleShift:.3,sandActiveLayer:.05,sandMaxThickness:.75,sandSubsteps:16,causticResolution:256,lightResolution:80,motes:3e3,moteGrid:48};function td(e){let t=new URLSearchParams(location.search),n=e=>{let n=t.get(e);return n===null||n===``||Number.isNaN(Number(n))?void 0:Number(n)},r={...e},i=n(`res`);return i!==void 0&&(r.gridRes=Math.max(16,Math.round(i/2)*2)),r.particlesPerCell=n(`ppc`)??r.particlesPerCell,r.pressureIterations=n(`iters`)??r.pressureIterations,r.flipRatio=n(`flip`)??r.flipRatio,r.fillFraction=n(`fill`)??r.fillFraction,r.gravity=n(`g`)??r.gravity,r.driftCorrection=n(`drift`)??r.driftCorrection,r.sor=n(`sor`)??r.sor,r.affineStrength=n(`affine`)??r.affineStrength,r.damping=n(`damp`)??r.damping,r.seedJitter=n(`jitter`)??r.seedJitter,r.ghostBand=n(`ghost`)??r.ghostBand,r.minOpenFace=n(`minw`)??r.minOpenFace,r.sandLevel=n(`sand`)??r.sandLevel,r.sandReposeDeg=n(`repose`)??r.sandReposeDeg,r.sandFlowSpeed=n(`sandflow`)??r.sandFlowSpeed,r.sandCreepSpeed=n(`creep`)??r.sandCreepSpeed,r.particleShift=n(`shift`)??r.particleShift,r}var nd={root:16,up:17,bound:18,dorsal:19,caudal:20,anal:21,misc:22,fins:24,barbels:36,box:44},rd=[128,64,64],id={tail:.6,pectoral:.34,pelvic:.18,pectoralAt:[.25,-.055,.07],pelvicAt:[.5,-.1,.035]};function ad(){let e=nd;return`
const KOI_N: i32 = 16;
const KOI_ROOT: i32 = ${e.root};
const KOI_UP: i32 = ${e.up};
const KOI_BOUND: i32 = ${e.bound};
const KOI_DORSAL: i32 = ${e.dorsal};
const KOI_CAUDAL: i32 = ${e.caudal};
const KOI_ANAL: i32 = ${e.anal};
const KOI_MISC: i32 = ${e.misc};
const KOI_FINS: i32 = ${e.fins};
const KOI_BARBELS: i32 = ${e.barbels};
const KOI_TAIL: f32 = ${id.tail.toFixed(4)};
const KOI_EYE_OUT: f32 = 0.078448; // body half-width at the eye (s = 0.115), x 0.92
const KOI_BOX: i32 = ${e.box};
const KOI_FIELD_N: vec3u = vec3u(${rd.join(`u, `)}u);

fn koi_tex(pose: texture_2d<f32>, i: i32) -> vec4f {
  return textureLoad(pose, vec2i(i, 0), 0);
}

// The box the shape is baked into (koi_bake.wgsl): its centre (w: largest voxel size) and
// axes (w: half extents).
struct KoiBox {
  c: vec4f,
  x: vec4f,
  y: vec4f,
  z: vec4f,
};

fn koi_box(pose: texture_2d<f32>) -> KoiBox {
  return KoiBox(koi_tex(pose, KOI_BOX), koi_tex(pose, KOI_BOX + 1), koi_tex(pose, KOI_BOX + 2), koi_tex(pose, KOI_BOX + 3));
}

// The stretch [x, y] of the ray p + dir t inside the box (x > y: it misses).
fn koi_boxClip(b: KoiBox, p: vec3f, dir: vec3f) -> vec2f {
  let r = p - b.c.xyz;
  let o = vec3f(dot(r, b.x.xyz), dot(r, b.y.xyz), dot(r, b.z.xyz));
  let d = vec3f(dot(dir, b.x.xyz), dot(dir, b.y.xyz), dot(dir, b.z.xyz));
  let e = vec3f(b.x.w, b.y.w, b.z.w);
  let inv = 1.0 / select(d, vec3f(1e-12), abs(d) < vec3f(1e-12));
  let ta = (-e - o) * inv;
  let tb = (e - o) * inv;
  let lo = min(ta, tb);
  let hi = max(ta, tb);
  return vec2f(max(max(lo.x, lo.y), lo.z), min(min(hi.x, hi.y), hi.z));
}

// Where x falls in the baked field (texture coordinates).
fn koi_boxUVW(b: KoiBox, x: vec3f) -> vec3f {
  let r = x - b.c.xyz;
  return vec3f(dot(r, b.x.xyz) / b.x.w, dot(r, b.y.xyz) / b.y.w, dot(r, b.z.xyz) / b.z.w) * 0.5 + 0.5;
}

// The stretch of spine nearest a point (root relative), found over the whole spine:
// x = segment index + how far along it, y = distance.
fn koi_nearest(pose: texture_2d<f32>, q: vec3f) -> vec2f {
  var best = 1e20;
  var bs = 0.0;
  var a = koi_tex(pose, 0).xyz;
  for (var i = 0; i < KOI_N - 1; i++) {
    let b = koi_tex(pose, i + 1).xyz;
    let ab = b - a;
    let t = clamp(dot(q - a, ab) / max(dot(ab, ab), 1e-12), 0.0, 1.0);
    let d = q - (a + ab * t);
    let dd = dot(d, d);
    if (dd < best) { best = dd; bs = f32(i) + min(t, 0.999); }
    a = b;
  }
  return vec2f(bs, sqrt(best));
}

// Body coordinates of a point (root relative) on the nearest stretch of spine.
struct KoiCoord {
  u: f32,   // arc length from the snout
  v: f32,   // lateral, towards the fish's right
  w: f32,   // up
  lat: f32, // lateral speed of the spine there (for the fins' lag)
};

// Where to look for the nearest stretch of spine: -1 searches the whole spine; otherwise only
// the segments round this one. Set it from the baked field (its z) or to -1 before evaluating
// at a new place; successive evaluations close together then follow on from each other.
var<private> koiHint: i32 = -1;
// How far its lips are pushed out and open (misc.x: feeding, 0..1), for koi_lips.
var<private> koiGape: f32 = 0.0;

fn koi_coord(pose: texture_2d<f32>, q: vec3f, up: vec3f, seg: f32) -> KoiCoord {
  var best = 1e20;
  var bi = 0;
  var bt = 0.0;
  let lo = select(0, max(koiHint - 2, 0), koiHint >= 0);
  let n = select(KOI_N - 1, min(koiHint + 2, KOI_N - 2) - lo + 1, koiHint >= 0);
  for (var k = 0; k < n; k++) {
    let i = lo + k;
    let a = koi_tex(pose, i).xyz;
    let b = koi_tex(pose, i + 1).xyz;
    let ab = b - a;
    let t = clamp(dot(q - a, ab) / max(dot(ab, ab), 1e-12), 0.0, 1.0);
    let d = q - (a + ab * t);
    let dd = dot(d, d);
    if (dd < best) { best = dd; bi = i; bt = t; }
  }
  koiHint = bi;
  let p0 = koi_tex(pose, bi);
  let p1 = koi_tex(pose, bi + 1);
  let ts = normalize(p1.xyz - p0.xyz);
  var t0 = ts;
  var t1 = ts;
  if (bi > 0) { t0 = normalize(ts + normalize(p0.xyz - koi_tex(pose, bi - 1).xyz)); }
  if (bi < KOI_N - 2) { t1 = normalize(ts + normalize(koi_tex(pose, bi + 2).xyz - p1.xyz)); }
  let T = normalize(mix(t0, t1, bt));
  let c = mix(p0.xyz, p1.xyz, bt);
  let U = normalize(up - dot(up, T) * T);
  let N = cross(U, T); // T runs tailwards, so this is the fish's right
  let r = q - c;
  return KoiCoord((f32(bi) + bt) * seg + dot(r, T), dot(r, N), dot(r, U), mix(p0.w, p1.w, bt));
}

// Direction along the spine (towards the tail) nearest a point (root relative).
fn koi_tangent(pose: texture_2d<f32>, q: vec3f) -> vec3f {
  var best = 1e20;
  var bi = 0;
  var a = koi_tex(pose, 0).xyz;
  for (var i = 0; i < KOI_N - 1; i++) {
    let b = koi_tex(pose, i + 1).xyz;
    let ab = b - a;
    let t = clamp(dot(q - a, ab) / max(dot(ab, ab), 1e-12), 0.0, 1.0);
    let d = q - (a + ab * t);
    let dd = dot(d, d);
    if (dd < best) { best = dd; bi = i; }
    a = b;
  }
  return normalize(koi_tex(pose, bi + 1).xyz - koi_tex(pose, bi).xyz);
}

// A smooth profile along the body (s = 0 snout .. 1 tail base): a blunt rise from the snout
// to its peak m at s = p, a cosine fall to e at the tail base, then the tail stalk running on
// into the root of the tail fin, easing down to tip times e by KOI_END. (It flattens sideways
// faster than it narrows, so the body thins smoothly into the fin, which is fleshy and opaque
// at its root, rather than ending in a cap.) Returns (value, d value / ds).
const KOI_END: f32 = 1.16;
fn koi_prof(s: f32, m: f32, p: f32, e: f32, tip: f32) -> vec2f {
  if (s <= 0.0) { return vec2f(0.0, 0.0); }
  if (s < p) {
    let x = s / p;
    let q = max(x * (2.0 - x), 1e-5);
    let r = pow(q, 0.42);
    return vec2f(m * r, m * 0.42 * pow(q, -0.58) * (2.0 - 2.0 * x) / p);
  }
  if (s < 1.0) {
    let y = (s - p) / (1.0 - p);
    return vec2f(e + (m - e) * 0.5 * (1.0 + cos(3.14159265 * y)), -(m - e) * 1.5707963 * sin(3.14159265 * y) / (1.0 - p));
  }
  let z = clamp((s - 1.0) / (KOI_END - 1.0), 0.0, 1.0);
  let k = 1.0 - tip;
  return vec2f(e * (1.0 - k * z * z * (3.0 - 2.0 * z)), -e * k * 6.0 * z * (1.0 - z) / (KOI_END - 1.0));
}

// Body outline at s: x = half width, y = half height, z = centre height, w = steepest slope.
fn koi_section(s: f32) -> vec4f {
  let top = koi_prof(s, 0.152, 0.36, 0.052, 0.4);
  let bot = koi_prof(s, 0.122, 0.44, 0.048, 0.4);
  let wid = koi_prof(s, 0.102, 0.28, 0.024, 0.1);
  return vec4f(wid.x, 0.5 * (top.x + bot.x), 0.5 * (top.x - bot.x), max(max(abs(top.y), abs(bot.y)), abs(wid.y)));
}

fn koi_ellipse(p: vec2f, r: vec2f) -> f32 {
  let k0 = length(p / r);
  let k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / max(k1, 1e-6);
}

// Smooth minimum (quadratic; exact min beyond k apart, so a far-away 1e9 stays harmless).
fn koi_smin(a: f32, b: f32, k: f32) -> f32 {
  let h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

// The body, in body coordinates (lb: body length).
fn koi_body(c: KoiCoord, lb: f32, secN: vec4f) -> f32 {
  let s = c.u / lb;
  let sec = secN * vec4f(lb, lb, lb, 1.0);
  let A = max(sec.x, 1e-4);
  let B = max(sec.y, 1e-4);
  // An egg-shaped oval: taller than wide, fuller towards the belly, narrower over the back.
  let wn = clamp((c.w - sec.z) / B, -1.0, 1.0);
  let egg = 1.0 - 0.13 * wn;
  var d = koi_ellipse(vec2f(c.v / egg, c.w - sec.z), vec2f(A, B)) * min(egg, 1.0) / sqrt(1.0 + sec.w * sec.w);
  // Snout and the end of the tail stalk (inside the tail fin's root).
  let ax = max(-c.u, c.u - KOI_END * lb);
  if (ax > 0.0) { d = length(vec2f(max(d, 0.0), ax)) + min(d, 0.0); }
  // Lips: a fleshy ring round the mouth at the front of the snout, opening forward and a
  // little down.
  if (s > 0.09) { return d; }
  return koi_smin(d, koi_lips(c, lb).x, 0.016 * lb);
}

// The lips (x: distance) and how far into the mouth's opening a point is (y: 0..1).
// Feeding (koiGape), the lips push forward into a short open tube (a carp's mouth protrudes)
// and the opening widens.
fn koi_lips(c: KoiCoord, lb: f32) -> vec2f {
  let g = koiGape;
  let axis = vec3f(-0.9, 0.0, -0.44);
  let mp = vec3f(c.u - 0.012 * lb, c.v * 1.15, c.w + 0.036 * lb) - axis * (0.022 * lb * g);
  let along = dot(mp, axis);
  let radial = length(mp - axis * along);
  let ring = 0.018 * lb * (1.0 + 0.45 * g);
  // (Pushed out, the ring is drawn back along the axis into a short tube to the snout.)
  let back = clamp(along, -0.024 * lb * g, 0.0);
  let lip = length(vec2f(radial - ring, (along - back) * 1.3)) - 0.0085 * lb * (1.0 - 0.15 * g);
  let open = ring - 0.002 * lb;
  return vec2f(lip, smoothstep(open, open - 0.008 * lb, radial) * smoothstep(-0.006 * lb - 0.024 * lb * g, 0.004 * lb, along));
}

// Signed distance to a polygon (Inigo Quilez), here for fin outlines.
fn koi_poly5(p: vec2f, v0: vec2f, v1: vec2f, v2: vec2f, v3: vec2f, v4: vec2f) -> f32 {
  var v = array<vec2f, 5>(v0, v1, v2, v3, v4);
  var d = dot(p - v[0], p - v[0]);
  var s = 1.0;
  var j = 4;
  for (var i = 0; i < 5; i++) {
    let e = v[j] - v[i];
    let w = p - v[i];
    let b = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
    d = min(d, dot(b, b));
    let c0 = p.y >= v[i].y;
    let c1 = p.y < v[j].y;
    let c2 = e.x * w.y > e.y * w.x;
    if ((c0 && c1 && c2) || (!c0 && !c1 && !c2)) { s = -s; }
    j = i;
  }
  return s * sqrt(d);
}

fn koi_poly7(p: vec2f, v0: vec2f, v1: vec2f, v2: vec2f, v3: vec2f, v4: vec2f, v5: vec2f, v6: vec2f) -> f32 {
  var v = array<vec2f, 7>(v0, v1, v2, v3, v4, v5, v6);
  var d = dot(p - v[0], p - v[0]);
  var s = 1.0;
  var j = 6;
  for (var i = 0; i < 7; i++) {
    let e = v[j] - v[i];
    let w = p - v[i];
    let b = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
    d = min(d, dot(b, b));
    let c0 = p.y >= v[i].y;
    let c1 = p.y < v[j].y;
    let c2 = e.x * w.y > e.y * w.x;
    if ((c0 && c1 && c2) || (!c0 && !c1 && !c2)) { s = -s; }
    j = i;
  }
  return s * sqrt(d);
}

// A thin membrane: outline distance o (in its plane), offset n from its (bent) plane.
fn koi_membrane(o: f32, n: f32, th: f32) -> f32 {
  let q = vec2f(o, abs(n) - th);
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0);
}

// Median fins (dorsal, anal, tail) in body coordinates: they bend with the spine, and their
// free edges trail behind its sideways motion like cloth (lean against the spine's lateral
// speed, growing with distance from the base) with a travelling ripple on top.
fn koi_dorsal(pose: texture_2d<f32>, c: KoiCoord, lb: f32, secN: vec4f, dBest: f32) -> f32 {
  let prm = koi_tex(pose, KOI_DORSAL);
  let s = c.u / lb;
  let sec = secN * lb;
  let h = (c.w - sec.z - sec.y) / lb; // height above the back
  if (s < 0.30 || s > 1.02 || h > 0.3 || h < -0.06) { return 1e9; }
  // Its plane is already farther than what we have: skip the outline.
  if (abs(c.v) - abs(prm.y * c.lat) - (prm.w + 0.006) * lb > dBest) { return 1e9; }
  let k = 0.35 + 0.65 * prm.x; // raised .. folded back along the body
  let f = 1.0 - k;
  let o = koi_poly7(vec2f(s, h),
    vec2f(0.37, -0.03), vec2f(0.38 + 0.03 * f, 0.1 * k), vec2f(0.41 + 0.06 * f, 0.2 * k), vec2f(0.49 + 0.06 * f, 0.21 * k),
    vec2f(0.66 + 0.05 * f, 0.14 * k), vec2f(0.88 + 0.04 * f, 0.07 * k), vec2f(0.8, -0.03)) * lb - 0.008 * lb;
  let hh = max(h, 0.0) / 0.21;
  let flex = -prm.y * c.lat * pow(hh, 1.5) + prm.w * hh * sin(prm.z - 18.0 * s) * lb;
  return koi_membrane(o, c.v - flex, mix(0.0045, 0.0012, clamp(hh, 0.0, 1.0)) * lb);
}

fn koi_anal(pose: texture_2d<f32>, c: KoiCoord, lb: f32, secN: vec4f, dBest: f32) -> f32 {
  let prm = koi_tex(pose, KOI_ANAL);
  let s = c.u / lb;
  let sec = secN * lb;
  let h = (sec.z - sec.y - c.w) / lb; // depth below the belly
  if (s < 0.72 || s > 1.1 || h > 0.19 || h < -0.05) { return 1e9; }
  if (abs(c.v) - abs(prm.y * c.lat) - (prm.w + 0.006) * lb > dBest) { return 1e9; }
  let k = 0.5 + 0.5 * prm.x;
  let o = koi_poly7(vec2f(s, h),
    vec2f(0.76, -0.03), vec2f(0.772, 0.075 * k), vec2f(0.80, 0.14 * k), vec2f(0.87, 0.145 * k),
    vec2f(0.97, 0.08 * k), vec2f(1.01, 0.04 * k), vec2f(0.89, -0.03)) * lb - 0.006 * lb;
  let hh = max(h, 0.0) / 0.13;
  let flex = -prm.y * c.lat * pow(hh, 1.5) + prm.w * hh * sin(prm.z - 20.0 * s) * lb;
  return koi_membrane(o, c.v - flex, mix(0.004, 0.0012, clamp(hh, 0.0, 1.0)) * lb);
}

fn koi_caudal(pose: texture_2d<f32>, c: KoiCoord, lb: f32, dBest: f32) -> f32 {
  let prm = koi_tex(pose, KOI_CAUDAL);
  let s = c.u / lb;
  if (s < 0.9 || s > 1.0 + KOI_TAIL + 0.05) { return 1e9; }
  if (abs(c.v) - abs(prm.y * c.lat) - (prm.w + 0.008) * lb > dBest + 0.02 * lb) { return 1e9; }
  let k = 0.7 + 0.3 * prm.x; // fork spread
  let w = c.w / lb;
  if (abs(w) > 0.36) { return 1e9; }
  // Two broad, rounded lobes over a moderate fork.
  let o = koi_poly7(vec2f(s, w),
    vec2f(0.93, 0.045), vec2f(1.0 + KOI_TAIL * 0.72, 0.285 * k), vec2f(1.0 + KOI_TAIL - 0.03, 0.24 * k),
    vec2f(1.0 + KOI_TAIL * 0.5, 0.0), vec2f(1.0 + KOI_TAIL - 0.03, -0.23 * k), vec2f(1.0 + KOI_TAIL * 0.72, -0.275 * k),
    vec2f(0.93, -0.043)) * lb - 0.018 * lb;
  let along = clamp((s - 0.96) / KOI_TAIL, 0.0, 1.0);
  // The middle of the fin trails a little more than the lobes (the fin cups), and the lobe
  // tips lag the stroke (a twist), so it flows rather than flaps.
  let cup = 1.0 - 0.35 * clamp(abs(w) / 0.25, 0.0, 1.0);
  let flex = -prm.y * c.lat * along * along * cup + prm.w * along * sin(prm.z - 9.0 * along - 6.0 * abs(w)) * lb;
  return koi_membrane(o, c.v - flex, mix(0.006, 0.0011, along) * lb);
}

// Paired fins: membranes in their own frames (origin, span, chord), hinged at the body.
// The outline is a long rounded paddle; it bends along its span (a cantilever: tip deflection
// times (r/R)^2, from the fin's spring-damper in Koi.ts) and ripples from root to edge.
fn koi_paired(pose: texture_2d<f32>, q: vec3f, i: i32, dMax: f32) -> f32 {
  let o = koi_tex(pose, KOI_FINS + 3 * i);
  let sp = koi_tex(pose, KOI_FINS + 3 * i + 1);
  let ch = koi_tex(pose, KOI_FINS + 3 * i + 2);
  let F = o.w;
  if (F <= 0.0) { return 1e9; }
  let r = q - o.xyz;
  if (dot(r, r) > (1.3 * F + dMax) * (1.3 * F + dMax)) { return length(r) - 1.3 * F; }
  let nrm = cross(sp.xyz, ch.xyz);
  if (abs(dot(r, nrm)) - (abs(sp.w) * 1.44 + 0.1) * F > dMax) { return 1e9; }
  let a = dot(r, sp.xyz) / F;
  let b = dot(r, ch.xyz) / F;
  let rr = clamp(a, 0.0, 1.2);
  let flex = (sp.w * rr * rr + 0.06 * rr * sin(ch.w - 5.0 * a - 2.5 * b)) * F;
  let out = koi_poly7(vec2f(a, b),
    vec2f(-0.04, -0.05), vec2f(0.55, -0.07), vec2f(0.93, 0.03), vec2f(0.98, 0.25),
    vec2f(0.74, 0.47), vec2f(0.3, 0.44), vec2f(-0.03, 0.27)) * F;
  return koi_membrane(out - 0.05 * F, dot(r, nrm) - flex, mix(0.035, 0.008, clamp(a, 0.0, 1.0)) * F);
}

fn koi_capsule(p: vec3f, a: vec3f, b: vec3f, r: f32) -> f32 {
  let pa = p - a;
  let ba = b - a;
  let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

// Distance to the koi from a point in the sim frame, and what was hit:
// x = distance, y = material (0 skin, 1 eye, 2 fin, 3 barbel).
fn koi_map(pose: texture_2d<f32>, x: vec3f) -> vec2f {
  let root = koi_tex(pose, KOI_ROOT);
  let upl = koi_tex(pose, KOI_UP);
  let q = x - root.xyz;
  let bnd = koi_tex(pose, KOI_BOUND);
  let db = length(q - bnd.xyz) - bnd.w;
  if (db > 0.02) { return vec2f(db, 0.0); }
  let lb = upl.w;
  let seg = root.w / f32(KOI_N - 1);
  let c = koi_coord(pose, q, upl.xyz, seg);
  koiGape = koi_tex(pose, KOI_MISC).x;

  let secN = koi_section(clamp(c.u / lb, 0.0, KOI_END));
  var d = koi_body(c, lb, secN);
  var m = 0.0;

  // Eyes: slightly domed, set into the sides of the head.
  if (c.u < 0.2 * lb) {
    let er = 0.022 * lb;
    let de = length(vec3f(c.u - 0.11 * lb, abs(c.v) - (KOI_EYE_OUT * lb - 0.3 * er), c.w - 0.036 * lb)) - er;
    if (de < d) { d = de; m = 1.0; }
  }

  // Barbels: two pairs of short whiskers at the corners of the mouth.
  for (var i = 0; i < select(0, 4, c.u < 0.16 * lb); i++) {
    let a = koi_tex(pose, KOI_BARBELS + 2 * i);
    let b = koi_tex(pose, KOI_BARBELS + 2 * i + 1);
    let dbb = koi_capsule(q, a.xyz, b.xyz, 0.0035 * lb);
    if (dbb < d) { d = dbb; m = 3.0; }
  }

  // Fins (translucent): blended onto the body at their roots; the tail fin with a broader
  // fillet, so the stalk flows into it.
  let dcf = koi_caudal(pose, c, lb, d);
  var df = min(koi_dorsal(pose, c, lb, secN, d), koi_anal(pose, c, lb, secN, d));
  for (var i = 0; i < 4; i++) { df = min(df, koi_paired(pose, q, i, min(d, df))); }
  let isFin = min(df, dcf) < d;
  let body = koi_smin(d, dcf, 0.02 * lb);
  return vec2f(koi_smin(body, df, 0.006 * lb), select(m, 2.0, isFin));
}

fn koi_normal(pose: texture_2d<f32>, x: vec3f) -> vec3f {
  let e = 0.0006;
  let k = vec2f(1.0, -1.0);
  return normalize(
    k.xyy * koi_map(pose, x + k.xyy * e).x + k.yyx * koi_map(pose, x + k.yyx * e).x +
    k.yxy * koi_map(pose, x + k.yxy * e).x + k.xxx * koi_map(pose, x + k.xxx * e).x);
}
`}var od=.19,sd=.155,cd=.016,ld=.03,ud=[[.014,3,.5],[.008,5,2],[.005,7,4.1]],dd=[[.02,5,1.1],[.011,8,.3],[.005,13,2]],fd=.285,pd=(e,t)=>e.reduce((e,[n,r,i])=>e+n*Math.sin(r*t+i),0);function md(e){return fd+pd(ud,e)}function hd(e){return od+pd(dd,e)}function gd(e,t){let n=md(t);return hd(t)-ld*(1-Math.min(e/n,1)**1.6)}var _d=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)};function vd(e,t){let n=sd+.052*_d(0,.55,e)-.012*_d(.45,.8,e),r=(md(t)-n)*_d(.7,1,e)**1.4,i=(.008*e**1.5*Math.sin(9*t+1.7+.5*Math.sin(2*t+.3))+.004*e*e*Math.sin(15*t+.4))*(1-_d(.86,1,e));return n+r+i}var yd=.006;function bd(e,t,n){let r=Math.atan2(n,e),i=md(r),a=hd(r),o=Math.hypot(e,n),s=t-gd(Math.min(o,i),r)+yd,c=Math.min(Math.max(t/a,0),1),l=Math.max(c-.02,0),u=Math.min(c+.02,1),d=(vd(u,r)-vd(l,r))/((u-l)*a),f=Math.sqrt(1+d*d),p=(o-vd(c,r))/f+yd,m=Math.max(s,0),h=Math.max(p,0),g=Math.hypot(m,h)+Math.min(Math.max(s,p),0)-yd,_=o>1e-5?[e/o,n/o]:[1,0],v=[_[0]/f,-d/f,_[1]/f],y=s>p?[0,1,0]:v;if(m+h>1e-7){let e=[h*v[0],m+h*v[1],h*v[2]],t=Math.hypot(e[0],e[1],e[2]);y=[e[0]/t,e[1]/t,e[2]/t]}return{d:g,n:y}}var xd=e=>e.toFixed(6),Sd=e=>e.map(([e,t,n])=>`${xd(e)} * sin(${t}.0 * th + ${xd(n)})`).join(` + `);function Cd(){return`
const REEF_BODY_HEIGHT: f32 = ${xd(od)};
const REEF_FOOT_RADIUS: f32 = ${xd(sd)};
const REEF_MOUTH_RADIUS: f32 = ${xd(cd)};
const REEF_DISH: f32 = ${xd(ld)};
const REEF_MARGIN_RADIUS: f32 = ${xd(fd)};

fn reef_marginRadius(th: f32) -> f32 {
  return REEF_MARGIN_RADIUS + ${Sd(ud)};
}

fn reef_marginHeight(th: f32) -> f32 {
  return REEF_BODY_HEIGHT + ${Sd(dd)};
}

fn reef_discHeight(rho: f32, th: f32) -> f32 {
  let f = min(rho / reef_marginRadius(th), 1.0);
  return reef_marginHeight(th) - REEF_DISH * (1.0 - pow(f, 1.6));
}

fn reef_columnRadius(u: f32, th: f32) -> f32 {
  let swell = REEF_FOOT_RADIUS + 0.052 * smoothstep(0.0, 0.55, u) - 0.012 * smoothstep(0.45, 0.8, u);
  let flare = (reef_marginRadius(th) - swell) * pow(smoothstep(0.7, 1.0, u), 1.4);
  let pleats = (0.008 * pow(u, 1.5) * sin(9.0 * th + 1.7 + 0.5 * sin(2.0 * th + 0.3)) + 0.004 * u * u * sin(15.0 * th + 0.4)) * (1.0 - smoothstep(0.86, 1.0, u));
  return swell + flare + pleats;
}

// How far q (the anemone's frame) is from its body, and the way out (bodyDistance): xyz the way
// out, w the distance.
fn reef_bodyDistance(q: vec3f) -> vec4f {
  let th = atan2(q.z, q.x);
  let rm = reef_marginRadius(th);
  let hm = reef_marginHeight(th);
  let rho = length(q.xz);
  let dTop = q.y - reef_discHeight(min(rho, rm), th) + ${xd(yd)};
  let u = clamp(q.y / hm, 0.0, 1.0);
  let u0 = max(u - 0.02, 0.0);
  let u1 = min(u + 0.02, 1.0);
  let slope = (reef_columnRadius(u1, th) - reef_columnRadius(u0, th)) / ((u1 - u0) * hm);
  let across = sqrt(1.0 + slope * slope);
  let dSide = (rho - reef_columnRadius(u, th)) / across + ${xd(yd)};
  let a = max(dTop, 0.0);
  let b = max(dSide, 0.0);
  let d = length(vec2f(a, b)) + min(max(dTop, dSide), 0.0) - ${xd(yd)};
  let out = select(vec2f(1.0, 0.0), q.xz / rho, rho > 1e-5);
  let side = vec3f(out.x, -slope, out.y) / across;
  var n = select(side, vec3f(0.0, 1.0, 0.0), dTop > dSide);
  if (a + b > 1e-7) { n = normalize(vec3f(0.0, a, 0.0) + b * side); }
  return vec4f(n, d);
}
`}var wd=[{x:0,z:-.06,top:-.425,curve:4,flat:.13},{x:-.34,z:-.3,top:-.41,curve:6,flat:.04},{x:.36,z:-.16,top:-.387,curve:12,flat:.035},{x:-.25,z:.22,top:-.515,curve:10,flat:0},{x:.22,z:-.45,top:-.425,curve:9,flat:0}],Td=.05,Ed=[wd[0].x,wd[0].z],Dd=[wd[2].x,wd[2].z,.12],Od={level:-.47,heap:.07,fall:.2,reach:.8},kd=(e,t,n)=>{let r=Math.max(n-Math.abs(e-t),0)/n;return Math.max(e,t)+r*r*n*.25};function Ad(e,t){let n=-10;for(let r of wd){let i=Math.max(Math.hypot(e-r.x,t-r.z)-r.flat,0);n=kd(n,r.top-r.curve*i*i,Td)}return n+Nd(e,t)}var jd=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)};function Md(e,t){let n=e-Ed[0],r=t-Ed[1],i=Math.atan2(r,n+1e-9),a=Math.hypot(n,r),o=a/(1+.1*Math.sin(i+.6)+.05*Math.sin(2*i-1.1)),s=Od.heap*(1+.12*Math.sin(3*i+.4)*jd(.1,.2,a))*Math.exp(-Math.max(o-sd,0)/Od.fall)*(1-jd(.3,Od.reach,o));return Od.level+s+.004*Math.sin(5.3*e+1.1)*Math.sin(4.7*t+.4)}function Nd(e,t){return .009*Math.sin(13.1*e+1.7)*Math.sin(11.3*t-.6)+.006*Math.sin(21.7*e-16.9*t+2.3)+.004*Math.sin(37.1*t+29.3*e+.8)}var Pd=e=>e.toFixed(6);function Fd(){return`
fn reef_smax(a: f32, b: f32, k: f32) -> f32 {
  let h = max(k - abs(a - b), 0.0) / k;
  return max(a, b) + h * h * k * 0.25;
}

// Height of the reef rock's surface over the floor point xz (globe frame).
fn reef_rockHeight(xz: vec2f) -> f32 {
  var y = -10.0;
${wd.map(e=>`  { let d = max(length(xz - vec2f(${Pd(e.x)}, ${Pd(e.z)})) - ${Pd(e.flat)}, 0.0); y = reef_smax(y, ${Pd(e.top)} - ${Pd(e.curve)} * d * d, ${Pd(Td)}); }`).join(`
`)}
  let x = xz.x;
  let z = xz.y;
  return y + 0.009 * sin(13.1 * x + 1.7) * sin(11.3 * z - 0.6) + 0.006 * sin(21.7 * x - 16.9 * z + 2.3) + 0.004 * sin(37.1 * z + 29.3 * x + 0.8);
}

// Height of the sand's resting surface over the floor point xz (globe frame).
fn reef_sandRest(xz: vec2f) -> f32 {
  let q = xz - vec2f(${Pd(Ed[0])}, ${Pd(Ed[1])});
  let th = atan2(q.y, q.x + 1e-9);
  let r = length(q);
  let d = r / (1.0 + 0.1 * sin(th + 0.6) + 0.05 * sin(2.0 * th - 1.1));
  let heap = ${Pd(Od.heap)} * (1.0 + 0.12 * sin(3.0 * th + 0.4) * smoothstep(0.1, 0.2, r))
    * exp(-max(d - ${Pd(sd)}, 0.0) / ${Pd(Od.fall)}) * (1.0 - smoothstep(0.3, ${Pd(Od.reach)}, d));
  return ${Pd(Od.level)} + heap + 0.004 * sin(5.3 * xz.x + 1.1) * sin(4.7 * xz.y + 0.4);
}
`}var Id=[{x:-.335,z:-.3,branches:6,forks:3,reach:.03,radius:.0085,seed:3},{x:.215,z:-.44,branches:4,forks:2,reach:.026,radius:.0075,seed:9}];function Ld(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var Rd=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],zd=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],Bd=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],Vd=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],Hd=e=>zd(e,1/Math.max(Math.hypot(e[0],e[1],e[2]),1e-9)),Ud=(e,t,n)=>{let r=Math.cos(n),i=Math.sin(n);return Rd(Rd(zd(e,r),zd(Vd(t,e),i)),zd(t,Bd(t,e)*(1-r)))};function Wd(){let e=[],t=[];return Id.forEach((n,r)=>{let i=Ld(n.seed),a=[n.x,Ad(n.x,n.z)-.006,n.z],o=n.forks+1,s=(n,a,c,l,u)=>{let d=Rd(n,zd(a,c)),f=l*.82;if(e.push(n[0],n[1],n[2],l,d[0],d[1],d[2],f),t.push(r,u/o,(u+1)/o,i()),u+1>=o)return;let p=i()<.25?3:2,m=Hd(Vd(a,Math.abs(a[1])<.9?[0,1,0]:[1,0,0])),h=i()*Math.PI*2;for(let e=0;e<p;e++){let t=Ud(a,Ud(m,a,h+e/p*Math.PI*2),.38+.3*i());t=Hd(Rd(t,[0,.35,0])),s(d,t,c*(.74+.18*i()),f,u+1)}},c=i()*Math.PI*2;for(let e=0;e<n.branches;e++){let t=c+e/n.branches*Math.PI*2+(i()-.5)*.7,r=e===0?.1+.15*i():.45+.4*i();s(a,Hd([Math.sin(r)*Math.cos(t),Math.cos(r),Math.sin(r)*Math.sin(t)]),n.reach*(.8+.4*i()),n.radius*(.85+.3*i()),0)}}),{count:t.length/4,segs:new Float32Array(e),info:new Float32Array(t)}}var Gd=15,Kd=.0105,qd=.011,Jd=.3,Yd=1.4,Xd=.0085,Zd=45,Qd=.6,$d=.72,ef=.6,tf=.5,nf=.6,rf=(e,t)=>[e[0]+t[0],e[1]+t[1],e[2]+t[2]],af=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],Q=(e,t)=>[e[0]*t,e[1]*t,e[2]*t],of=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],sf=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],cf=e=>Math.hypot(e[0],e[1],e[2]),lf=(e,t=[0,1,0])=>{let n=cf(e);return n>1e-9?Q(e,1/n):t},uf=(e,t,n)=>{let r=Math.cos(n),i=Math.sin(n);return rf(rf(Q(e,r),Q(sf(t,e),i)),Q(t,of(t,e)*(1-r)))},df=(e,t)=>[e[0]*t[0]+e[3]*t[1]+e[6]*t[2],e[1]*t[0]+e[4]*t[1]+e[7]*t[2],e[2]*t[0]+e[5]*t[1]+e[8]*t[2]],ff=(e,t)=>[e[0]*t[0]+e[1]*t[1]+e[2]*t[2],e[3]*t[0]+e[4]*t[1]+e[5]*t[2],e[6]*t[0]+e[7]*t[1]+e[8]*t[2]],pf=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)},mf=(e,t,n)=>{let r=n.appetite??1;return r>=1||!e.taste.length?e.age>=e.notice[t]:e.age>=e.notice[t]*(1+3*(1-r))&&e.taste[t]<pf(0,ef,r)&&!e.spat[t]},hf=()=>{let e=2*Math.random()-1,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e*e);return[n*Math.cos(t),e,n*Math.sin(t)]},gf=class{crown;segs;count;constructor(e){this.crown=e;let t=Wd();this.segs=t.segs,this.count=t.count}contact(e,t){let n=this.crown.foot,r=Math.hypot(e[0]-n[0],e[2]-n[2]);if(r<.44){let t=n[1]+this.crown.height(r)+.004;if(e[1]<t&&e[1]>t-.03)return{at:[e[0],t,e[2]],normal:[0,1,0]}}let i=Ad(e[0],e[2])+.002;if(e[1]<i)return{at:[e[0],i,e[2]],normal:[0,1,0]};let a=this.segs;for(let n=0;n<this.count;n++){let r=[a[8*n],a[8*n+1],a[8*n+2]],i=af([a[8*n+4],a[8*n+5],a[8*n+6]],r),o=Math.min(Math.max(of(af(e,r),i)/Math.max(of(i,i),1e-12),0),1),s=rf(r,Q(i,o)),c=a[8*n+3]+(a[8*n+7]-a[8*n+3])*o,l=af(e,s);if(cf(l)<c+.25*t){let e=lf(l);return{at:rf(s,Q(e,c+.25*t)),normal:e}}}return null}},_f=class{slots=Array(7).fill(null);ground=null;data=new Float32Array(60);enabled=!1;eatenCount=0;pellets=!1;landings=0;splashes=[];setReef(e){this.ground=e?new gf(e):null}clear(){this.slots.fill(null)}get flakes(){return this.slots.filter(e=>e!==null)}get count(){return this.slots.reduce((e,t)=>e+(t&&t.left===null?1:0),0)}get landed(){return this.slots.reduce((e,t)=>e+(t?.landed&&t.eater<0&&!t.laid?1:0),0)}spawn(e,t){let n=this.slots.indexOf(null);if(!this.enabled||n<0)return!1;let r=Q(hf(),.05);return r[1]=Math.abs(r[1])*.6+.01,this.pellets&&(r[1]=-.05),this.slots[n]={pos:[...e],vel:r,normal:hf(),turn:Math.random()*Math.PI*2,spin:Q(hf(),7),size:this.pellets?.85+.3*Math.random():.8+.45*Math.random(),seed:Math.random(),age:0,wet:!this.pellets,landed:null,notice:Array.from({length:t},()=>Math.random()<.9?.35+1.1*Math.random():1.5+2.5*Math.random()),taste:this.pellets?Array.from({length:t},Math.random):[],spit:this.pellets?Array.from({length:t},Math.random):[],spat:[],eater:-1,eaten:0,wander:Q(hf(),.8),soak:Zd*(1+Math.random()),left:null,laid:!1,settled:0},!0}leave(e=0){let t=[];return this.slots.forEach((n,r)=>{n?.landed&&n.eater<0&&n.left===null&&n.settled>e&&(n.left=1,t.push(r))}),t}lay(e){let t=this.slots.indexOf(null);if(t<0||!this.spawn(e,0))return-1;let n=this.slots[t];return n.vel=[0,0,0],n.wet=!0,n.soak=0,n.left=1,n.laid=!0,t}rot(e,t){let n=this.slots[e];n&&n.left!==null&&(n.left=Math.min(Math.max(t,0),1))}isLeft(e){return(this.slots[e]?.left??null)!==null}take(e){this.isLeft(e)&&(this.slots[e]=null)}probePoints(){let e=new Float32Array(28);return this.slots.forEach((t,n)=>{t&&e.set([t.pos[0],t.pos[1],t.pos[2],0],4*n)}),e}aim(e){e.forEach((e,t)=>{if(e.food=null,e.gapeWant=0,e.busy())return;let n=e.mouthAt(),r=null,i=1/0;for(let a of this.flakes){if(a.eater>=0||a.left!==null||!mf(a,t,e))continue;let o=cf(af(a.pos,n));o<i&&(r=a,i=o)}r&&(e.food={pos:[...r.pos],vel:[...r.vel],landed:r.landed!==null},i<2.2*e.reach&&(e.gapeWant=.6))});for(let t of this.flakes)t.eater>=0&&e[t.eater]&&(e[t.eater].gapeWant=1)}update(e,t,n,r,i,a){let o=Math.ceil(e*30-1e-6);for(let s=0;s<o;s++)this.tick(e/o,t,n,r,i,a)}tick(e,t,n,r,i,a){let o=cf([i.gravity[0],i.gravity[1],i.gravity[2]]),s=o>1e-6?[i.gravity[0]/o,i.gravity[1]/o,i.gravity[2]/o]:[0,-1,0],c=Q(s,-1);for(let e of this.flakes)e.eater>=0||e.left!==null||a.forEach((t,n)=>{if(e.eater>=0||t.busy()||!mf(e,n,t))return;let r=af(e.pos,t.mouthAt()),i=e.landed&&r[1]<0?Math.hypot(r[0],.4*r[1],r[2]):cf(r);i<t.reach&&(i<.35*t.reach||of(t.ahead(),r)>-.15*cf(r))&&(e.eater=n,e.eaten=0)});this.slots=this.slots.map((l,u)=>l&&this.step(l,u,e,t,n,r,i,a,c,s,o)?l:null)}step(e,t,n,r,i,a,o,s,c,l,u){let d=o.rotation;{e.age+=n;let f=r&&e.age>.12?(a+t)*4:-1;if(e.eater>=0){let t=s[e.eater];e.eaten+=n;let r=af(rf(t.mouthAt(),Q(t.ahead(),-.15*t.reach)),e.pos),i=cf(r),a=Math.max(.025,.11-.3*e.eaten),o=Q(r,1-Math.exp(-n/a));e.vel=Q(o,1/n),e.pos=rf(e.pos,o);let c=lf(r,t.ahead());if(e.normal=lf(af(e.normal,Q(c,of(e.normal,c)*(1-Math.exp(-n/.05)))),e.normal),i<.004||e.eaten>.45){let n=t.appetite??1;return n<tf&&e.spit.length&&e.spit[e.eater]<nf*(1-n/tf)?(e.spat[e.eater]=!0,e.eater=-1,e.soak=Math.min(e.soak,e.age),e.vel=Q(t.ahead(),.1),e.pos=rf(t.mouthAt(),Q(t.ahead(),.6*t.reach)),!0):(this.eatenCount++,!1)}return!0}if(e.landed){e.pos=df(d,e.landed.at);let t=df(d,e.landed.normal);return e.normal=lf(rf(e.normal,Q(af(of(e.normal,t)<0?Q(t,-1):t,e.normal),1-Math.exp(-n/.25))),t),e.vel=[0,0,0],e.spin=[0,0,0],!0}let p=[0,0,0],m=e.wet,h=+!!e.wet;f>=0&&r&&(h=r[f+3],m=h>o.iso,p=[r[f],r[f+1],r[f+2]]);let g=this.pellets&&e.age<e.soak&&(m||e.wet&&h>.04);if(m&&!e.wet&&(e.vel=Q(e.vel,.3),this.pellets&&this.splashes.push([...e.pos])),e.wet=m||g,g){let t=rf(af(p,Q(c,of(p,c))),Q(c,Qd*(h-o.iso)));e.vel=rf(e.vel,Q(af(t,e.vel),1-Math.exp(-n/.12))),e.spin=Q(e.spin,Math.exp(-n*2))}else if(m){let t=Q(af(e.normal,Q(c,of(e.normal,c))),.6*qd*Math.sin(e.age*2.3+e.seed*9)),r=rf(rf(p,Q(l,qd*(.85+.3*e.seed))),t);e.vel=rf(e.vel,Q(af(r,e.vel),1-Math.exp(-n/Jd))),Math.random()<n*.4&&(e.wander=Q(hf(),.5+.7*Math.random()));let i=Q(sf(e.normal,of(e.normal,c)>=0?c:l),1.2),a=rf(e.wander,i);e.spin=rf(e.spin,Q(af(a,e.spin),1-Math.exp(-n/.5)))}else{e.vel=rf(e.vel,Q(l,u*n));let t=cf(e.vel);t>Yd&&(e.vel=Q(e.vel,Yd/t)),e.spin=Q(e.spin,Math.exp(-n*.5))}e.pos=rf(e.pos,Q(e.vel,n));let _=cf(e.spin);if(_>1e-6){let t=Q(e.spin,1/_);e.turn+=of(t,e.normal)*_*n,e.normal=lf(uf(e.normal,t,_*n),e.normal)}let v=(this.pellets?Xd:Kd)*e.size;if(g){let t=af(e.pos,Q(c,of(e.pos,c))),n=cf(t);if(n>$d){e.pos=rf(e.pos,Q(t,$d/n-1));let r=Q(t,1/n),i=of(e.vel,r);i>0&&(e.vel=af(e.vel,Q(r,i)))}}let y=cf(e.pos),b=o.radius-v-.004;if(y>b){let t=Q(e.pos,1/y);e.pos=Q(t,b);let n=of(e.vel,t);n>0&&(e.vel=af(e.vel,Q(t,n)))}if(f>=0&&i&&e.pos[1]-.25*v<i[a+t])e.landed={at:ff(d,[e.pos[0],i[a+t]+.002,e.pos[2]]),normal:ff(d,c)},e.settled=++this.landings;else if(this.ground){let t=this.ground.contact(ff(d,e.pos),v);t&&(e.landed=t,e.settled=++this.landings)}return!0}}renderData(){let e=this.data;return e.fill(0),e[0]=this.flakes.length,this.flakes.forEach((t,n)=>{let r=this.pellets?1:1-Math.exp(-t.age/.06)*Math.cos(t.age*19),i=t.eater>=0?1-.3*Math.min(t.eaten/.3,1):1,a=t.left===null?1:Math.cbrt(t.left),o=(this.pellets?Xd:Kd)*t.size*r*i*a,s=4*(1+2*n);e.set([t.pos[0],t.pos[1],t.pos[2],Math.max(o,1e-5)],s);let c=(t.turn/(Math.PI*2)%1+1)%1,l=1+Math.min(c,.999);e.set([t.normal[0]*l,t.normal[1]*l,t.normal[2]*l,t.seed],s+4)}),e}write(e,t){e.queue.writeTexture({texture:t,origin:[48,0]},this.renderData(),{bytesPerRow:240},[Gd,1])}};function vf(e=!1){return`
const FOOD_TEXEL: i32 = 48;
const FOOD_MAX: i32 = 7;

struct FoodHit {
  t: f32,
  k: i32,
  near: bool, // passing within a couple of pixels of one (its outline: an edge)
}

fn food_tex(pose: texture_2d<f32>, i: i32) -> vec4f {
  return textureLoad(pose, vec2i(i, 0), 0);
}

// A flake's ragged outline: its radius (fraction of the full one) at angle a round it.
fn food_outline(a: f32, seed: f32) -> f32 {
  return 0.8 + 0.1 * sin(3.0 * a + seed * 6.1) + 0.06 * sin(5.0 * a + seed * 13.7) + 0.04 * sin(9.0 * a + seed * 29.3) + 0.025 * sin(14.0 * a + seed * 41.9);
}

// Two directions across a flake with face normal n.
fn food_across(n: vec3f) -> mat2x3f {
  let t = normalize(cross(n, select(vec3f(1.0, 0.0, 0.0), vec3f(0.0, 0.0, 1.0), abs(n.x) > 0.8)));
  return mat2x3f(t, cross(n, t));
}

// The nearest flake along p + dir t, t in (0, tMax). foot: a pixel's size per unit distance;
// path0: the distance to p.
fn food_trace(pose: texture_2d<f32>, p: vec3f, dir: vec3f, tMax: f32, foot: f32, path0: f32) -> FoodHit {
  var hit = FoodHit(1e9, -1, false);
  let n = min(i32(food_tex(pose, FOOD_TEXEL).x + 0.5), FOOD_MAX);
  for (var k = 0; k < n; k++) {
    let A = food_tex(pose, FOOD_TEXEL + 1 + 2 * k);
    let B = food_tex(pose, FOOD_TEXEL + 2 + 2 * k);
    let r = A.w;
    let oc = A.xyz - p;
    let tc = dot(oc, dir);
    if (tc < -r || tc - r > min(tMax, hit.t)) { continue; }
    let miss2 = max(dot(oc, oc) - tc * tc, 0.0);
    let px = foot * (path0 + max(tc, 0.0));
    if (miss2 > (r + 2.0 * px) * (r + 2.0 * px)) { continue; }
    hit.near = true;${e?`
    // (A pellet: a ball.)
    let tb = tc - sqrt(max(r * r - miss2, 0.0));
    if (miss2 < r * r && tb > 0.0 && tb < min(tMax, hit.t)) {
      hit.t = tb;
      hit.k = k;
    }
    continue;`:``}
    let bl = length(B.xyz);
    let nrm = B.xyz / bl;
    let dn = dot(dir, nrm);
    if (abs(dn) < 1e-5) { continue; }
    let t = dot(oc, nrm) / dn;
    if (t <= 0.0 || t >= min(tMax, hit.t)) { continue; }
    let q = p + dir * t - A.xyz;
    let ax = food_across(nrm);
    let uv = vec2f(dot(q, ax[0]), dot(q, ax[1]));
    let a = atan2(uv.y, uv.x) - (bl - 1.0) * 6.2831853;
    if (length(uv) < r * food_outline(a, B.w)) {
      hit.t = t;
      hit.k = k;
    }
  }
  return hit;
}

// A flake's colour: the usual flake-food mix (red, orange, yellow, green, brown, tan), each a
// little different.
fn food_colour(seed: f32) -> vec3f {
  let i = i32(floor(seed * 6.0)) % 6;
  var c = vec3f(0.6, 0.12, 0.06);
  if (i == 1) { c = vec3f(0.8, 0.36, 0.07); }
  if (i == 2) { c = vec3f(0.82, 0.64, 0.16); }
  if (i == 3) { c = vec3f(0.3, 0.46, 0.12); }
  if (i == 4) { c = vec3f(0.42, 0.23, 0.09); }
  if (i == 5) { c = vec3f(0.72, 0.55, 0.34); }
  let j = fract(seed * 37.17);
  let h = fract(seed * 91.3);
  return c * (0.82 + 0.3 * j) * mix(vec3f(1.0), vec3f(1.08, 0.96, 0.9), h);
}

// The flake k's light at x (on it), seen along dir.
fn food_shade(pose: texture_2d<f32>, k: i32, x: vec3f, dir: vec3f, inWater: bool, lit: vec4f, lightTex: texture_3d<f32>, lightSamp: sampler) -> vec3f {
  let A = food_tex(pose, FOOD_TEXEL + 1 + 2 * k);
  let B = food_tex(pose, FOOD_TEXEL + 2 + 2 * k);${e?`
  // A pellet: a glossy little ball of pressed meal, reddish brown, flecked.
  let nb = normalize(x - A.xyz);
  let qb = nb * 3.0 + vec3f(B.w * 23.0);
  var pc = mix(vec3f(0.30, 0.075, 0.03), vec3f(0.42, 0.16, 0.05), fract(B.w * 7.3)) * (0.8 + 0.35 * globes_noise3(qb * 2.0));
  pc = mix(pc, vec3f(0.55, 0.38, 0.16), 0.6 * smoothstep(0.8, 0.92, globes_noise3(qb * 5.0)));
  let Lb = select(GLOBES_SUN_DIR, GLOBES_SUN_DIR_WATER, inWater);
  var Eb = bowlSun * 0.86;
  if (inWater) { Eb = globes_sunIn(lightTex, lightSamp, x + Lb * 0.02, lit); }
  let ab = select(vec3f(0.42, 0.42, 0.46), mix(vec3f(0.035, 0.05, 0.045), vec3f(0.15, 0.25, 0.28), 0.5 + 0.5 * nb.y), inWater) * studioAmbient;
  let hb = normalize(Lb - dir);
  return pc * (Eb * max(dot(nb, Lb), 0.0) + ab) / 3.14159265 + Eb * 0.06 * pow(max(dot(nb, hb), 0.0), 40.0);`:`
  var n = B.xyz / length(B.xyz);
  if (dot(n, dir) > 0.0) { n = -n; }
  // Mottled: the crumbs it is pressed from, darker and lighter, a few pale specks.
  let q = (x - A.xyz) / max(A.w, 1e-4);
  let mott = globes_noise3(q * 3.1 + vec3f(B.w * 17.0));
  let fine = globes_noise3(q * 9.0 + vec3f(B.w * 5.0));
  var albedo = food_colour(B.w) * (0.75 + 0.35 * mott) * (0.9 + 0.2 * fine);
  albedo = mix(albedo, vec3f(0.85, 0.8, 0.62), 0.5 * smoothstep(0.78, 0.9, fine));
  // Thinner, paler and more translucent towards its edge.
  let rim = smoothstep(0.55, 1.0, length(q));
  albedo *= 1.0 + 0.15 * rim;
  let trans = albedo * (0.45 + 0.35 * rim);
  let L = select(GLOBES_SUN_DIR, GLOBES_SUN_DIR_WATER, inWater);
  var E = GLOBES_SUN_IRR * 0.86;
  if (inWater) { E = globes_sunIn(lightTex, lightSamp, x + L * 0.02, lit); }
  let amb = select(vec3f(0.42, 0.42, 0.46), mix(vec3f(0.035, 0.05, 0.045), vec3f(0.15, 0.25, 0.28), 0.5 + 0.5 * n.y), inWater);
  let ndl = dot(n, L);
  var c = (albedo * (E * max(ndl, 0.0) + amb) + trans * E * max(-ndl, 0.0)) / 3.14159265;
  // A faint waxy sheen.
  let hv = normalize(L - dir);
  c += E * 0.04 * pow(max(dot(n, hv), 0.0), 24.0) * max(ndl, 0.0);
  return c;`}
}
`}var yf=.22,bf=.14;function xf(){let e=n(9013),t=[];for(let n=0;n<4e4&&t.length<170;n++){let n=(e()*2-1)*yf,r=e()*bf,i=(n/yf)**2+(r/bf)**2;if(i>1||e()>1.1-i)continue;let a=.006+.011*e()**2.2,o=r+a+.002;t.some(([e,t,r,i])=>r===0&&Math.hypot(e-n,t-o)<(i+a)*.92)||t.push([n,o,0,a])}let r=t.length;for(let n=0;n<2e4&&t.length<170;n++){let n=(e()*2-1)*yf*.55,i=e()*bf*.55,a=.006+.008*e()**2,o=i+a+.002,s=t.slice(0,r).filter(([e,t,,r])=>Math.hypot(e-n,t-o)<r+a);if(s.length<2||t.slice(r).some(([e,t,,r])=>Math.hypot(e-n,t-o)<(r+a)*.92))continue;let c=Math.max(...s.map(([e,t,,r])=>Math.sqrt(Math.max(0,(r+a)**2-(e-n)**2-(t-o)**2))-.25*r));t.push([n,o,c,a])}return t.map(t=>({b:t,key:Math.hypot(t[0]/yf,t[1]/bf)+(t[2]>0?.35:0)+.25*e()})).sort((e,t)=>e.key-t.key).map(e=>e.b)}var Sf=null;function Cf(){return Sf??=xf(),Sf}function wf(){return Float32Array.from(Cf().flat(),e=>Number(e.toFixed(6)))}function Tf(e){return e.set(wf(),4*e[15]),e}var Ef=Cf(),Df=null;function Of(e){Df=e}var kf={level:t},Af={length:.42,width:.115,cup:.012,arch:.016},jf=e=>e.toFixed(6);function Mf(e,t=!1){if(Df===null)throw Error(`bowlScape: the furnishings' shader is not loaded (setScapeShader)`);return`
// ---- the betta bowl's contents (src/render/bowlScape.ts) -------------------------------------
const SCAPE_LEAF_L: f32 = ${jf(Af.length)};
const SCAPE_LEAF_W: f32 = ${jf(Af.width)};
const SCAPE_LEAF_CUP: f32 = ${jf(Af.cup)};
const SCAPE_LEAF_ARCH: f32 = ${jf(Af.arch)};
const SCAPE_NEST_N: u32 = ${Ef.length}u;
const SCAPE_R: f32 = ${jf(e)};

// Set by globes_shade: the bowl's turn, and what moves (BowlLife.ts): columns 0 and 1 the leaf (its
// middle, its heading; the film's slope under it, x: 1 when it is there), 2 and 3 the nest (its
// heart on the glass at the waterline, its bearing; how many bubbles it has).
var<private> scapeRot: mat3x3f;
var<private> scapeLife: mat4x4f;

// ---- helpers ------------------------------------------------------------------------------
fn scape_hash3v(p: vec3f) -> vec3f {
  return vec3f(globes_hash3(p), globes_hash3(p + vec3f(17.13, 3.71, 9.27)), globes_hash3(p + vec3f(41.9, 27.3, 5.83)));
}

// A ray (o, d; d of unit length) against a capsule: the distance to it ahead, or -1.
fn scape_capsule(o: vec3f, d: vec3f, pa: vec3f, pb: vec3f, r: f32) -> f32 {
  let ba = pb - pa;
  let oa = o - pa;
  let baba = dot(ba, ba);
  let bard = dot(ba, d);
  let baoa = dot(ba, oa);
  let rdoa = dot(d, oa);
  let oaoa = dot(oa, oa);
  let a = baba - bard * bard;
  let b = baba * rdoa - baoa * bard;
  let c = baba * oaoa - baoa * baoa - r * r * baba;
  let h = b * b - a * c;
  if (h < 0.0) { return -1.0; }
  let t = (-b - sqrt(h)) / max(a, 1e-12);
  let y = baoa + t * bard;
  if (y > 0.0 && y < baba && t > 0.0) { return t; }
  // (The caps.)
  let oc = select(o - pb, oa, y <= 0.0);
  let b2 = dot(d, oc);
  let c2 = dot(oc, oc) - r * r;
  let h2 = b2 * b2 - c2;
  if (h2 > 0.0) {
    let t2 = -b2 - sqrt(h2);
    if (t2 > 0.0) { return t2; }
  }
  return -1.0;
}

fn scape_capNormal(p: vec3f, pa: vec3f, pb: vec3f) -> vec3f {
  let ba = pb - pa;
  let h = clamp(dot(p - pa, ba) / dot(ba, ba), 0.0, 1.0);
  return normalize(p - pa - ba * h);
}

fn scape_box(o: vec3f, d: vec3f, lo: vec3f, hi: vec3f, tEnd: f32) -> bool {
  let inv = 1.0 / select(d, vec3f(1e-8), abs(d) < vec3f(1e-8));
  let a = (lo - o) * inv;
  let b = (hi - o) * inv;
  let mn = min(a, b);
  let mx = max(a, b);
  return max(max(mn.x, mn.y), max(mn.z, 0.0)) <= min(min(mx.x, mx.y), min(mx.z, tEnd));
}

// A curved blade (its base at the origin, u along it, v across, w off its face): its surface
// w = arch (u / L)^2 + cup (v / W)^2, inside its outline (half-width at s = u / L: shape, 0..1).
// The nearer crossing ahead of a ray in its frame (o, d), before tEnd: (t, u, v), t < 0 if none.
fn scape_bladeCross(o: vec3f, d: vec3f, L: f32, W: f32, arch: f32, cup: f32, tEnd: f32, almond: bool) -> vec3f {
  let ka = arch / (L * L);
  let kc = cup / (W * W);
  // (The almond leaf curls up at both ends: its arch is about its middle.)
  let ou = select(o.x, o.x - 0.5 * L, almond);
  let A = ka * d.x * d.x + kc * d.z * d.z;
  let B = 2.0 * (ka * ou * d.x + kc * o.z * d.z) - d.y;
  let C = ka * ou * ou + kc * o.z * o.z - o.y;
  var t0 = -1.0;
  var t1 = -1.0;
  if (abs(A) < 1e-9) {
    if (abs(B) > 1e-12) { t0 = -C / B; }
  } else {
    let h = B * B - 4.0 * A * C;
    if (h < 0.0) { return vec3f(-1.0, 0.0, 0.0); }
    let sq = sqrt(h);
    let q = -0.5 * (B + select(-sq, sq, B >= 0.0));
    let ta = q / A;
    let tb = select(C / q, ta, abs(q) < 1e-12);
    t0 = min(ta, tb);
    t1 = max(ta, tb);
  }
  for (var k = 0; k < 2; k++) {
    let t = select(t1, t0, k == 0);
    if (t <= 1e-5 || t >= tEnd) { continue; }
    let u = o.x + d.x * t;
    let v = o.z + d.z * t;
    let s = u / L;
    if (s <= 0.0 || s >= 1.0) { continue; }
    if (abs(v) < W * scape_outline(s, almond)) { return vec3f(t, u, v); }
  }
  return vec3f(-1.0, 0.0, 0.0);
}

// A blade's half-width along it (0..1 of the widest): the anubias' ovate leaf, rounded at its
// base and pointed at its tip; the almond leaf's obovate one, widest two thirds of the way out.
fn scape_outline(s: f32, almond: bool) -> f32 {
  if (almond) {
    return 1.72 * pow(s, 0.8) * pow(max(1.0 - s * s * s, 0.0), 0.6);
  }
  if (s < 0.4) { return sqrt(max(1.0 - pow((0.4 - s) / 0.4, 2.0), 0.0)); }
  return pow(max(1.0 - pow((s - 0.4) / 0.6, 1.7), 0.0), 0.75);
}

// ---- what is met ----------------------------------------------------------------------------
struct ScapeHit {
  t: f32,
  // 0: none; 6: the floating leaf; 7: a furnishing (scape/: id its triangle, uv where on it).
  kind: u32,
  id: u32,
  // On the leaf: along it and across it (its own units); the point's normal (translating frame).
  uv: vec2f,
  n: vec3f,
}

// ---- the floating leaf --------------------------------------------------------------------
// Its frame (translating): x along it from its base, y off its top face, z across; and its base.
fn scape_leafFrame() -> mat3x3f {
  let slope = scapeLife[1].yz;
  let n = normalize(vec3f(-slope.x, 1.0, -slope.y));
  let h = vec3f(cos(scapeLife[0].w), 0.0, sin(scapeLife[0].w));
  let along = normalize(h - n * dot(h, n));
  return mat3x3f(along, n, normalize(cross(along, n)));
}

fn scape_leafBase(ax: mat3x3f) -> vec3f {
  return scapeLife[0].xyz - ax[0] * (0.5 * SCAPE_LEAF_L);
}

fn scape_leaf(p: vec3f, dir: vec3f, tEnd: f32) -> ScapeHit {
  var hit = ScapeHit(1e9, 0u, 0u, vec2f(0.0), vec3f(0.0, 1.0, 0.0));
  if (scapeLife[1].x < 0.5) { return hit; }
  // (Its bounding sphere first.)
  let oc = scapeLife[0].xyz - p;
  let tc = dot(oc, dir);
  let rr = 0.5 * SCAPE_LEAF_L + 0.02;
  if (dot(oc, oc) - tc * tc > rr * rr || tc + rr < 0.0 || tc - rr > tEnd) { return hit; }
  let ax = scape_leafFrame();
  let base = scape_leafBase(ax);
  let ol = transpose(ax) * (p - base);
  let dl = transpose(ax) * dir;
  let c = scape_bladeCross(ol, dl, SCAPE_LEAF_L, SCAPE_LEAF_W, SCAPE_LEAF_ARCH, SCAPE_LEAF_CUP, tEnd, true);
  if (c.x > 0.0) {
    let gu = 2.0 * SCAPE_LEAF_ARCH * (c.y - 0.5 * SCAPE_LEAF_L) / (SCAPE_LEAF_L * SCAPE_LEAF_L);
    let gv = 2.0 * SCAPE_LEAF_CUP * c.z / (SCAPE_LEAF_W * SCAPE_LEAF_W);
    hit = ScapeHit(c.x, 6u, 0u, vec2f(c.y / SCAPE_LEAF_L, c.z / SCAPE_LEAF_W), ax * normalize(vec3f(-gu, 1.0, -gv)));
  }
  // Its stalk, a stub at its base.
  let tb = scape_capsule(p, dir, base - ax[0] * 0.045 + ax[1] * 0.004, base + ax[1] * 0.002, 0.0045);
  if (tb > 0.0 && tb < min(hit.t, tEnd)) {
    hit = ScapeHit(tb, 6u, 1u, vec2f(-0.05, 0.0), scape_capNormal(p + dir * tb, base - ax[0] * 0.045 + ax[1] * 0.004, base + ax[1] * 0.002));
  }
  return hit;
}

// The leaf's shadow on what lies under it (x, towards the sun L): how much light gets by.
fn scape_leafShadow(x: vec3f, L: vec3f) -> vec3f {
  if (scapeLife[1].x < 0.5) { return vec3f(1.0); }
  let ax = scape_leafFrame();
  let dn = dot(L, ax[1]);
  if (dn < 0.05) { return vec3f(1.0); }
  let t = dot(scapeLife[0].xyz - x, ax[1]) / dn;
  if (t <= 0.0) { return vec3f(1.0); }
  let q = transpose(ax) * (x + L * t - scape_leafBase(ax));
  let s = q.x / SCAPE_LEAF_L;
  let w = SCAPE_LEAF_W * scape_outline(clamp(s, 0.0, 1.0), true);
  // (Softer the further it falls: the sun's disc, and the film's ripples.)
  let soft = 0.006 + 0.05 * t;
  let inside = smoothstep(-soft, soft, w - abs(q.z)) * smoothstep(-soft, soft, min(q.x, SCAPE_LEAF_L - q.x));
  return mix(vec3f(1.0), vec3f(0.10, 0.045, 0.02), inside);
}

// ---- the nest -----------------------------------------------------------------------------
// Its bubbles along a stretch of ray in the air (p, dir, t in [0, tEnd)): their films reflect a
// little of the sky to it, each crossing (rgb), and let the rest through (a, the share). (tex: the
// furnishings' texture, where its bubbles are rows: scape/nest.mjs. Read there rather than from a
// constant array, which the loop's index would make a private copy of in every invocation.)
fn scape_nestAlong(tex: texture_2d<f32>, p: vec3f, dir: vec3f, tEnd: f32, bgTex: texture_2d<f32>, bgSamp: sampler) -> vec4f {
  let count = min(u32(scapeLife[3].x + 0.5), SCAPE_NEST_N);
  if (count == 0u) { return vec4f(0.0, 0.0, 0.0, 1.0); }
  let heart = scapeLife[2].xyz;
  let a = scapeLife[2].w;
  let out = vec3f(cos(a), 0.0, sin(a));
  let along = vec3f(-out.z, 0.0, out.x);
  let lo = heart - vec3f(0.24, 0.02, 0.24);
  let hi = heart + vec3f(0.24, 0.05, 0.24);
  if (!scape_box(p, dir, lo, hi, tEnd)) { return vec4f(0.0, 0.0, 0.0, 1.0); }
  var col = vec3f(0.0);
  var thr = vec3f(1.0);
  let rows = u32(scape_meshTexel(tex, 3u).w);
  for (var k = 0u; k < count; k++) {
    let b = scape_meshTexel(tex, rows + k);
    // (Its heart sits a little in the film: a floating bubble is a little less than half a sphere.)
    let c = heart + along * b.x - out * b.y + vec3f(0.0, b.z - 0.3 * b.w, 0.0);
    let oc = p - c;
    let bq = dot(oc, dir);
    let cq = dot(oc, oc) - b.w * b.w;
    let h = bq * bq - cq;
    if (h <= 0.0) { continue; }
    let sq = sqrt(h);
    for (var e = 0; e < 2; e++) {
      let t = select(-bq + sq, -bq - sq, e == 0);
      if (t <= 0.0 || t >= tEnd) { continue; }
      let x = p + dir * t;
      // (Only its dome above the film.)
      if (x.y < heart.y - 0.001) { continue; }
      let n = normalize(x - c);
      let ci = abs(dot(dir, n));
      let F = globes_fresnel(ci, 1.0, GLOBES_IOR_WATER);
      // Two faces of a thin film, its thickness different bubble to bubble: faint colours.
      let R = 2.0 * F / (1.0 + F);
      let phase = fract(b.x * 37.1 + b.y * 91.7) * 2.0 + 1.6 * sqrt(max(1.0 - ci * ci * 0.56, 0.0));
      let tint = 0.62 + 0.38 * cos(6.2831853 * (phase + vec3f(0.0, 0.33, 0.67)));
      let Rc = R * tint;
      // (A nest's films are thickened with the fish's mucus: each scatters a little of the light
      // falling on it, the sun's and the sky's, so the raft reads white.)
      let sunGlint = bowlSun * (0.5 * pow(max(dot(reflect(dir, n), GLOBES_SUN_DIR), 0.0), 300.0) + 0.012);
      col += thr * (Rc * (globes_bg(bgTex, bgSamp, x, reflect(dir, n)) + sunGlint) + vec3f(0.085, 0.09, 0.095) * studioLamp);
      thr *= (1.0 - Rc) * 0.88;
    }
  }
  return vec4f(col, (thr.x + thr.y + thr.z) / 3.0);
}

// What falls on the bed from above (x, in the medium inWater says): the furnishings' shadows and
// the floating leaf's (tex: the furnishings' BVH).
fn scape_bedShadow(tex: texture_2d<f32>, x: vec3f, inWater: bool) -> vec3f {
  let towards = select(GLOBES_SUN_DIR, GLOBES_SUN_DIR_WATER, inWater);
  let rotT = transpose(scapeRot);
  return ${t?``:`scape_meshShadow(tex, rotT * (x + vec3f(0.0, 0.003, 0.0)), rotT * towards, 3.0) * `}scape_leafShadow(x, towards);
}

// ---- tracing and shading ------------------------------------------------------------------
// The nearest of the furnishings and the floating leaf along a ray (translating frame) before
// tEnd (tex: the furnishings' BVH).
fn scape_trace(tex: texture_2d<f32>, p: vec3f, dir: vec3f, tEnd: f32) -> ScapeHit {
  let rotT = transpose(scapeRot);
  let m = scape_meshHit(tex, rotT * p, rotT * dir, tEnd);
  var a = ScapeHit(1e9, 0u, 0u, vec2f(0.0), vec3f(0.0, 1.0, 0.0));
  if (m.tri != 0xffffffffu) { a = ScapeHit(m.t, 7u, m.tri, m.bary, vec3f(0.0, 1.0, 0.0)); }
  let b = scape_leaf(p, dir, min(a.t, tEnd));
  if (b.kind != 0u && b.t < a.t) { return b; }
  return a;
}

// A furnishing's surface where a ray (dir, translating frame) met it at x: its material, lit by the
// lamp through the water and the film's ripples (in the shadows of all the furnishings and of the
// floating leaf), the blue room's light (shut out of its crevices), a glossy or waxy highlight,
// light let through a leaf from behind, and the light it gives off (the heater's lamp).
fn scape_shadeMesh(tex: texture_2d<f32>, h: ScapeHit, x: vec3f, dir: vec3f, inWater: bool, lit: vec4f, lightTex: texture_3d<f32>, lightSamp: sampler, time: f32, foot: f32) -> vec3f {
  let rotT = transpose(scapeRot);
  let s = scape_meshSurface(tex, ScapeMeshHit(h.t, h.id, h.uv));
  let db = rotT * dir;
  let front = dot(db, s.ng) < 0.0;
  var mat = scape_meshMaterial(s, rotT * x, foot, front);
  // (The plants' green leaves and stalks: at night their green reflects little of the lamp's blue,
  // a dark teal-green, greyer and dimmer, light through them too. By day as they are: studio.ts.)
  if (s.material >= SCAPE_MAT_LEAF_BIG && s.material <= SCAPE_MAT_STEM) {
    mat.albedo = mix(mat.albedo, vec3f(dot(mat.albedo, vec3f(0.2126, 0.7152, 0.0722))), studioLeafGrey) * studioLeafDim;
    mat.trans = mix(mat.trans, vec3f(dot(mat.trans, vec3f(0.2126, 0.7152, 0.0722))), studioLeafGrey) * studioLeafDim;
  }
  // (The shading normal on the side the ray met, by the triangle's own face; where it still leans
  // away, as smooth normals do near an outline, bent back into view rather than turned over.)
  var n = scapeRot * mat.n;
  let ngv = scapeRot * select(-s.ng, s.ng, front);
  if (dot(n, ngv) < 0.0) { n = -n; }
  let away = dot(n, dir);
  if (away > 0.0) { n = normalize(n - dir * (away + 1e-3)); }
  let L = select(GLOBES_SUN_DIR, GLOBES_SUN_DIR_WATER, inWater);
  var E = bowlSun * 0.86;
  if (inWater) { E = globes_sunIn(lightTex, lightSamp, x + n * 0.01, lit) * betta_dapple(x, lit, lightTex, lightSamp, time); }
  // (Its shadows: from just off the side facing the light, so a leaf lit from behind is not
  // shadowed by itself.)
  let ndl = dot(n, L);
  let off = x + select(-n, n, ndl > 0.0) * 0.0015;
  let S = ${t?``:`scape_meshShadow(tex, rotT * off, rotT * L, 3.0) * `}scape_leafShadow(off, L);
  let up = n.y * 0.5 + 0.5;
  let ambient = select(vec3f(0.30, 0.31, 0.34), mix(vec3f(0.045, 0.06, 0.075), vec3f(0.15, 0.18, 0.21), up), inWater) * studioAmbient * mat.ao;
  let hv = normalize(L - dir);
  let ndh = max(dot(n, hv), 0.0);
  let ndv = clamp(dot(n, -dir), 0.0, 1.0);
  let F = mat.spec + (1.0 - mat.spec) * pow(1.0 - ndv, 5.0);
  let r2 = max(mat.rough * mat.rough, 0.002);
  let shine = max(2.0 / (r2 * r2) - 2.0, 1.0);
  let spec = F * (shine + 8.0) / 25.13274 * pow(ndh, shine) * max(ndl, 0.0);
  let through = mat.trans * max(-ndl, 0.0);
  // The studio's key light (its soft box high on the left in front: studio.ts), come in through
  // the glass: it lights the faces turned to the viewer and draws out their relief (soft, so its
  // shadows are left to the occlusion).
  let K = normalize(vec3f(-0.5, 0.62, 0.62));
  let nk = dot(n, K);
  let key = vec3f(1.15, 1.04, 0.90) * studioKey * mat.ao;
  let hk = normalize(K - dir);
  let keySpec = F * (shine + 8.0) / 25.13274 * pow(max(dot(n, hk), 0.0), shine) * max(nk, 0.0);
  return mat.albedo * (E * S * max(ndl, 0.0) + key * max(nk, 0.0) + ambient) / 3.14159265 + E * S * (spec + through / 3.14159265) + key * (keySpec + mat.trans * max(-nk, 0.0) * 0.3 / 3.14159265) + F * ambient * 0.25 + mat.glow;
}

// The light a hit sends back along dir (x: the point; inWater: the medium the ray is in; tex: the
// furnishings' BVH).
fn scape_shade(tex: texture_2d<f32>, h: ScapeHit, x: vec3f, dir: vec3f, inWater: bool, lit: vec4f, lightTex: texture_3d<f32>, lightSamp: sampler, time: f32, bgTex: texture_2d<f32>, bgSamp: sampler, foot: f32) -> vec3f {
  if (h.kind == 7u) { return scape_shadeMesh(tex, h, x, dir, inWater, lit, lightTex, lightSamp, time, foot); }
  var n = h.n;
  let back = dot(n, dir) > 0.0;
  if (back) { n = -n; }
  let L = select(GLOBES_SUN_DIR, GLOBES_SUN_DIR_WATER, inWater);
  var E = bowlSun * 0.86;
  var dapple = 1.0;
  if (inWater) {
    dapple = betta_dapple(x, lit, lightTex, lightSamp, time);
    E = globes_sunIn(lightTex, lightSamp, x + n * 0.01, lit) * dapple;
  }
  let ambient = select(vec3f(0.36, 0.37, 0.40), mix(vec3f(0.10, 0.13, 0.15), vec3f(0.30, 0.38, 0.44), n.y * 0.5 + 0.5), inWater) * studioAmbient;
  let ndl = dot(n, L);
  let hv = normalize(L - dir);
  let ndh = max(dot(n, hv), 0.0);
  let ndv = clamp(dot(n, -dir), 0.0, 1.0);
  let fres = pow(1.0 - ndv, 5.0);
  let pb = transpose(scapeRot) * x;
  if (h.kind == 6u) {
    // The almond leaf, dried: tan to reddish brown, darker at its edge, its midrib and veins paler;
    // underneath paler still. Lit from behind it glows a deep amber through.
    let s = h.uv.x;
    let v = h.uv.y;
    let q = vec3f(s * 9.0, v * 3.0, 0.0);
    var c = mix(vec3f(0.12, 0.05, 0.02), vec3f(0.2, 0.09, 0.035), globes_noise3(q * 1.3 + vec3f(3.1)));
    c = mix(c, vec3f(0.27, 0.15, 0.065), 0.45 * smoothstep(0.55, 0.85, globes_noise3(q * 0.7 + vec3f(8.0))));
    c *= 0.85 + 0.25 * globes_noise3(vec3f(s * 60.0, v * 22.0, 1.7));
    c *= mix(1.0, 0.62, smoothstep(0.7, 1.0, abs(v) / max(scape_outline(clamp(s, 0.0, 1.0), true), 0.05)));
    let midrib = 1.0 - smoothstep(0.012, 0.035, abs(v));
    let lateral = smoothstep(0.9, 0.99, abs(fract(s * 9.0 - abs(v) * 2.2 + 0.15 * globes_noise3(vec3f(s * 20.0, v * 8.0, 0.0))) * 2.0 - 1.0)) * smoothstep(0.03, 0.12, abs(v)) * (1.0 - smoothstep(0.7, 0.92, abs(v)));
    let vein = max(midrib, 0.35 * lateral) * smoothstep(0.0, 2.0, 0.004 / max(foot, 1e-6));
    c = mix(c, vec3f(0.3, 0.17, 0.075), vein);
    if (h.id == 1u) { c = vec3f(0.20, 0.10, 0.04); }
    if (back) { c = mix(c, vec3f(0.42, 0.27, 0.13), 0.45); }
    let through = c * vec3f(0.9, 0.55, 0.25) * max(-ndl, 0.0) * 0.4;
    let wet = select(0.02, 0.06, inWater || back);
    return (c * (E * max(ndl, 0.0) + ambient) + E * through) / 3.14159265 + E * wet * pow(ndh, 30.0) + fres * 0.04 * ambient;
  }
  return vec3f(0.0);
}
${Df}
`}var Nf={cruise:`cruise`,hover:`hover`,rise:`air`,gulp:`air`,dive:`air`,mirror:`mirror`,lap:`lap`,rest:`rest`,startle:`startle`,feed:`feed`},Pf={cruise:2.5,hover:1.2,air:1,mirror:2.5,lap:3,rest:3,startle:0,feed:.8},Ff={cruise:900,hover:900},If=class{constructor(){this.key=null,this.since=0,this.said=new Map,this.freeAt=-1/0}ready(e,t){let n=this.said.get(e);return n===void 0||t-n>=(Ff[e]??300)}watch(e,t){e!==this.key&&(this.key=e,this.since=t)}due(e,t){let n=this.key;return n===null||t||e<this.freeAt||e-this.since<(Pf[n]??0)||!this.ready(n,e)?null:(this.said.set(n,e),n)}event(e,t,n,r=!1){return!this.ready(e,t)||!r&&(n||t<this.freeAt)?!1:(this.said.set(e,t),!0)}told(e,t){this.said.set(e,t)}closed(e){this.freeAt=e+20}},Lf=`In the bowl`,Rf=`The fish`,zf=`Keep males alone: two will fight.`,Bf={classic:{kicker:Rf,title:`Betta splendens, the Siamese fighting fish`,body:`Wild bettas live in warm, shallow, plant-thick water in Thailand and nearby. This red and blue halfmoon’s red is pigment; its blue is light reflected by crystals in its skin cells (iridophores). ${zf}`},"super-red":{kicker:Rf,title:`Betta splendens: Super Red`,body:`Bred to be red from fin to fin. Red is a pigment, held in skin cells called erythrophores, where a betta’s blue is reflected light. ${zf} With good care they live 3 to 5 years.`},"royal-blue":{kicker:Rf,title:`Betta splendens: Royal Blue`,body:`No betta has a blue pigment: its blue is light reflected by tiny crystal plates in cells called iridophores, so it shifts as the fish turns. ${zf} With good care they live 3 to 5 years.`},"black-samurai":{kicker:Rf,title:`Betta splendens: Black Samurai`,body:`A dragon scale on a black base. Dragon scales carry a thick, reflective layer of iridophores over each scale; on a black fish, each metallic scale is edged in black, like armour. ${zf}`},"mustard-gas":{kicker:Rf,title:`Betta splendens: Mustard Gas`,body:`A bicolour: a blue-green body, and fins dark blue near it and mustard yellow towards their edges. The yellow is a pigment; the blue is light reflected by the skin. ${zf}`},butterfly:{kicker:Rf,title:`Betta splendens: Butterfly`,body:`Each fin is coloured near the body and edged in a sharp pale band. The bands often shift as a butterfly matures, the colour creeping out or drawing back. ${zf} With good care they live 3 to 5 years.`},koi:{kicker:Rf,title:`Betta splendens: Koi (marble)`,body:`Marble and koi bettas are thought to carry a “jumping gene”, a transposon that turns colour cells on and off as it moves, so their patches change through life: this one may look quite different in a year. ${zf}`},platinum:{kicker:Rf,title:`Betta splendens: Platinum White`,body:`Its white is not pigment but a dense layer of reflective cells (iridophores) over every scale, which makes it opaque and metallic. ${zf} With good care they live 3 to 5 years.`},copper:{kicker:Rf,title:`Betta splendens: Copper`,body:`Its sheen is reflective cells (iridophores) laid thickly over a dark base: copper or gold by turns, it shifts with the angle of the light. ${zf} With good care they live 3 to 5 years.`},pineapple:{kicker:Rf,title:`Betta splendens: Pineapple`,body:`A yellow betta whose scales are each edged in dark brown, like a pineapple’s skin. Yellow is a pigment, held in cells called xanthophores. ${zf} With good care they live 3 to 5 years.`},"galaxy-koi":{kicker:Rf,title:`Betta splendens: Galaxy Koi`,body:`A koi on a dark blue base, speckled with metallic flecks like stars. Like every marble, it is thought to carry a “jumping gene”, so its patches and stars change through its life. ${zf}`}},Vf={fish:Bf.classic,driftwood:{kicker:Lf,title:`Driftwood`,body:`Soaked hardwood gives cover and places to rest. Long betta fins tear easily, so choose wood and decor with no sharp points or rough edges. New wood can tint the water tea-brown with tannins, which is harmless.`},rock:{kicker:Lf,title:`Rocks`,body:`Smooth, rounded aquarium stone is safe for long fins. Avoid jagged rock, and limestone or shells, which slowly harden the water and raise its pH.`},anubias:{kicker:Lf,title:`Anubias (Anubias barteri)`,body:`A tough, slow-growing plant from West Africa that does well in low light. Its rhizome, the thick stem the leaves rise from, rots if buried: rest it on the sand or tie it to wood or rock. Bettas like to rest on its broad leaves.`},rosette:{kicker:Lf,title:`A rosette plant`,body:`Leaves rising from one crown in the sand. It is not modelled on one species; Cryptocoryne wendtii grows much like this. Java fern is easy too, tied to wood: it rots if buried. Live plants use up fish waste and give a betta cover.`},sand:{kicker:Lf,title:`Sand`,body:`A fine, smooth bed is kind to a fish that rests on the bottom, and plants root in it. Leftover food and waste settle here: siphon a little away with each water change.`},leaf:{kicker:Lf,title:`Indian almond leaf (catappa)`,body:`A dried leaf of Terminalia catappa. As it soaks it releases tannins that tint the water tea-brown and can lower the pH a little, like the leaf-stained waters bettas come from. Males often nest under one. Replace it as it breaks down.`},nest:{kicker:Lf,title:`The bubble nest`,body:`Male bettas blow saliva-coated bubbles into a floating raft against cover or the glass, to guard eggs and fry in. Settled males often build one, even alone; some seldom do. This one adds to it after trips for air.`},lid:{kicker:Lf,title:`Lid and LED lamp`,body:`Bettas jump, so a tank needs a cover; this one has air holes, as the fish breathes at the surface. Its LED lights the fish and plants: 8 to 12 hours a day, then dark so it can sleep. Feed lifts the lid.`},water:{kicker:Lf,title:`The water`,body:`Keep it at 78 to 80\xA0°F (25.5 to 27\xA0°C), and treat tap water with a dechlorinator. In a cycled tank, bacteria turn the fish’s toxic ammonia into nitrite, then into milder nitrate, which weekly water changes remove. The Water button simulates it.`},glass:{kicker:Lf,title:`The bowl`,body:`A glass bowl about 24\xA0cm (9.5\xA0in) across, holding about a gallon (4\xA0L): the size bettas are often sold in. It has a heater and filter, but a betta does far better in 5 gallons (19\xA0L) or more: steadier warmth, cleaner water, room to swim.`},heater:{kicker:Lf,title:`Heater`,body:`Most rooms are too cool for a betta. A small heater with a thermostat holds the water at 78 to 80\xA0°F (25.5 to 27\xA0°C); its light shows when it is heating. Check it with a thermometer.`},filter:{kicker:Lf,title:`Sponge filter`,body:`Air bubbling up the tube draws water through the sponge, where helpful bacteria break down waste. The flow is gentle: long fins tire in a strong current. Rinse the sponge in old tank water, never tap water, so the bacteria survive.`}},Hf=`What it’s doing`,Uf={cruise:{kicker:Hf,title:`Exploring`,body:`It swims slowly round its territory, looking over the plants and the wood. Bettas are curious and learn their surroundings well.`},hover:{kicker:Hf,title:`Hovering`,body:`It holds still in mid-water, its small clear pectoral fins fanning to keep it in place while it looks around.`},air:{kicker:Hf,title:`A gulp of air`,body:`Bettas have a labyrinth organ, folds above the gills that take oxygen from air. That lets them live in still, warm water short of oxygen, but they must always be able to reach the surface.`},nest:{kicker:Hf,title:`Tending the bubble nest`,body:`Back from the surface, it adds bubbles to its nest by the glass. Males often build when they are settled and comfortable.`},mirror:{kicker:Hf,title:`Flaring at its reflection`,body:`It takes its reflection in the glass for a rival male: gill covers out, fins spread. A short display is natural, even good exercise; flaring all day (a mirror left in, another male in view) stresses it.`},flare:{kicker:Hf,title:`Flaring`,body:`Gill covers out, fins spread wide: how a male warns off a rival. A mirror held up for a minute now and then is fine; never leave one up.`},lap:{kicker:Hf,title:`Patrolling`,body:`A slow lap of the bowl along the glass. Bettas are territorial and keep checking the edges of their space.`},rest:{kicker:Hf,title:`Resting on the bottom`,body:`Bettas rest often, on the bottom or on a broad leaf, and long-finned males tire easily. It is normal. Lying there all the time, with clamped fins or no appetite, can mean the water is too cold or dirty.`},startle:{kicker:Hf,title:`Startled`,body:`A sudden jolt of the water sets off its escape reflex: it bends and darts away. Keep a bowl where it won’t be knocked, and don’t tap the glass.`},feed:{kicker:Hf,title:`Taking food at the surface`,body:`Bettas feed at the surface: their upturned mouths are made for snatching insects and larvae off the water. It rises under each pellet and takes it lips first.`},sunk:{kicker:`Care`,title:`Food on the sand`,body:`A pellet has sunk uneaten. In a real tank, net or siphon out leftovers after a few minutes: rotting food fouls the water.`}},Wf={rule:{kicker:`Care`,title:`Feeding a betta`,body:`Two or three pellets, once or twice a day, is plenty: its stomach is about the size of its eye. Watch it take them: bettas feed at the surface, rising under each pellet lips first. Uneaten food rots and fouls the water.`},again:(e,t)=>({kicker:`Care`,title:`Already fed`,body:`It had ${qf(e)} ${Yf(t)}. One or two small meals a day, spaced out, suit a betta best; it will gladly wait.`}),over:(e,t)=>({kicker:`Care`,title:`That’s a lot of food`,body:`${Jf(qf(e))} in ${Xf(t)} is ${e>6?`more than a`:`a whole`} day’s food for a betta. Overfed bettas get bloated, and leftovers foul the water. In a real tank, it would wait until tomorrow.`})},Gf={kicker:`Care`,title:`Bettas sleep at night`,body:`In the dark a betta rests on the bottom or on a broad leaf, barely moving. A real bowl needs a long night: light 8 to 12\xA0hours a day, dark the rest. A dim blue night light is for viewing, not for leaving on all night.`},Kf={kicker:`Learn`,title:`Learn mode`,body:`Captions explain what the fish does as it does it. Tap anything in the bowl (the fish, a plant, the lid) to learn about it.`},qf=e=>e===1?`one pellet`:`${e} pellets`,Jf=e=>e.charAt(0).toUpperCase()+e.slice(1),Yf=e=>e<1?`just now`:e<90?`${Math.round(e)} min ago`:`${Math.round(e/60)} hours ago`,Xf=e=>e<2?`a minute or two`:e<90?`${Math.round(e)} minutes`:`${Math.round(e/60)} hours`,Zf=43200,Qf=60,$f=class{constructor(){this.times=[]}drop(e){for(this.times.push(e);this.times[0]<e-Zf;)this.times.shift()}recent(e){return this.times.filter(t=>t>e-43200&&t<=e).length}lastMeal(e){let t=this.times.filter(t=>t>e-43200&&t<=e);if(!t.length)return null;let n=t.length-1;for(;n>0&&t[n]-t[n-1]<Qf;)n--;return{pellets:t.length-n,at:t[t.length-1]}}advise(e){let t=this.recent(e);if(t>=6)return{advice:`over`,pellets:t,minutes:(e-this.times.find(t=>t>e-Zf))/60};let n=this.lastMeal(e);return n&&e-n.at<14400?{advice:`again`,pellets:n.pellets,minutes:(e-n.at)/60}:{advice:`rule`,pellets:0,minutes:0}}},ep=`betta.learn`,tp=[5,.12],np=[8,.2],rp=500,ip=8,ap=class{host;on=!1;meals=null;button;card;text;close;clock=new If;log=new $f;scape=null;picking=null;pickBowl=null;raycaster=new Bo;ndc=new K;origin=new q;dir=new q;until=0;held=!1;clearing=0;feedState=`idle`;flared=!1;bubbles=0;constructor(e,t,n,r){this.host=n;let i=this.button=document.createElement(`button`);i.type=`button`,i.dataset.action=`learn`,i.textContent=`Learn`,i.title=`Explain what the fish does, and what is in the bowl (tap anything)`,i.setAttribute(`aria-pressed`,`false`),i.addEventListener(`click`,()=>this.set(!this.on)),e.append(i);let a=this.card=document.createElement(`div`);a.className=r?`learn-card beside-stats`:`learn-card`,a.innerHTML=`<button type="button" class="learn-close" aria-label="Close" inert><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg></button><div class="learn-text" role="status" aria-live="polite" aria-atomic="true"></div>`,this.text=a.querySelector(`.learn-text`),this.close=a.querySelector(`.learn-close`),this.close.addEventListener(`click`,()=>this.hide()),a.addEventListener(`pointerenter`,()=>this.held=!0),a.addEventListener(`pointerleave`,()=>this.held=a.contains(document.activeElement)),a.addEventListener(`focusin`,()=>this.held=!0),a.addEventListener(`focusout`,()=>this.held=a.matches(`:hover`)),t.append(a),window.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.until>0&&this.hide()}),n.feeding.onDrop=()=>{this.log.drop(performance.now()/1e3),this.meals?.drop()};let o=!1;try{o=localStorage.getItem(ep)===`1`}catch{}o&&this.set(!0,!1)}setScape(e,t){this.scape={data:e,parts:t}}set(t,n=!0){this.on=t,this.button.setAttribute(`aria-pressed`,String(t));try{localStorage.setItem(ep,t?`1`:`0`)}catch{}if(!t){this.hide();return}`pickTopic`in this.host||(this.picking??=e(()=>import(`./pick-C4S3Hy7N.js`).then(e=>e.i).then(e=>{this.pickBowl=e.pickBowl},e=>console.warn(`[globes] Learn mode: taps unavailable:`,e)),__vite__mapDeps([0,1,2]),import.meta.url));let r=this.host;this.feedState=r.feeding.state,this.flared=r.betta.flared,this.bubbles=r.life.bubbles,n?this.show(Kf,!0):this.clock.closed(performance.now()/1e3)}frame(){let e=performance.now()/1e3,t=this.host,n=t.feeding.state;n!==this.feedState&&(this.feedState===`idle`&&this.advise(e),this.feedState=n);let r=t.betta.flared;r&&!this.flared&&this.clock.event(`flare`,e,this.busy,!0)&&this.caption(`flare`),this.flared=r;let i=t.life.bubbles;i>this.bubbles&&this.clock.event(`nest`,e,this.busy)&&this.caption(`nest`),this.bubbles=i,t.food.landed>0&&this.clock.event(`sunk`,e,this.busy)&&this.caption(`sunk`),this.clock.watch(Nf[t.betta.swim.mode]??null,e);let a=this.clock.due(e,this.busy);a&&this.caption(a),this.until>0&&e>this.until&&!this.held&&this.hide()}atNight(){this.on&&this.show(Gf,!0)}aboutFish(){this.on&&this.show(Bf[this.host.variety()]??Vf.fish,!0)}tap(e,t){if(!this.on)return!1;if(!(`pickTopic`in this.host)&&!this.pickBowl)return this.picking?.then(()=>{this.pickBowl&&this.tap(e,t)}),!0;let n=this.pick(e,t);return n===`fish`?this.aboutFish():n?this.show(Vf[n],!0):this.hide(),!0}pick(e,t){let n=this.host;if(`pickTopic`in n)return n.pickTopic(e,t);let r=this.pickBowl;if(!r)return null;let i=n.canvas.getBoundingClientRect();this.raycaster.setFromCamera(this.ndc.set((e-i.left)/i.width*2-1,1-(t-i.top)/i.height*2),n.camera);let a=this.raycaster.ray,o=n.life.matrix.elements;return r(a.origin.clone().sub(n.controller.center).toArray(),a.direction.toArray(),{outer:n.glass.outerRadius,inner:n.glass.innerRadius,mouth:ku.mouth,rotation:n.controller.rotation.elements,level:n.level(),bed:kf.level,scape:this.scape,fish:n.betta.active?n.betta.probePoints():null,leaf:o[4]>.5?{at:[o[0],o[1],o[2]],yaw:o[3],length:Af.length,width:Af.width}:null,nest:o[12]>=ip?{at:[o[8],o[9],o[10]],bearing:o[11]}:null,lid:(e,t)=>n.lid.hits(this.origin.fromArray(e),this.dir.fromArray(t))})?.topic??null}get busy(){return this.until>0}advise(e){let t=this.meals?this.meals.log.advise(this.meals.now()):this.log.advise(e);this.show(t.advice===`over`?Wf.over(t.pellets,t.minutes):t.advice===`again`?Wf.again(t.pellets,t.minutes):Wf.rule,!0),this.clock.told(`feed`,e)}caption(e){this.show(Uf[e],!1)}show(e,t){window.clearTimeout(this.clearing);let n=(e,t)=>{let n=document.createElement(`p`);return n.className=e,n.textContent=t,n};this.text.replaceChildren(n(`learn-kicker`,e.kicker),n(`learn-title`,e.title),n(`learn-body`,e.body));let[r,i]=t?np:tp;this.until=performance.now()/1e3+r+i*`${e.title} ${e.body}`.split(/\s+/).length,this.card.classList.add(`is-on`),this.close.inert=!1}hide(){this.until!==0&&(this.until=0,this.held=!1,this.card.contains(document.activeElement)&&this.button.focus(),this.card.classList.remove(`is-on`),this.close.inert=!0,this.clock.closed(performance.now()/1e3),this.clearing=window.setTimeout(()=>this.text.replaceChildren(),rp))}},op=4,sp=86400,cp=3600,lp=600,up=60,dp=.128,fp=.9,pp=.55,mp=.2,hp=8/24,gp=.04,_p=.7,vp=.08,yp=60,bp=[.7,.25,.05],xp=[40,15,3],Sp={growth:.75,ks:.006,loss:.56},Cp={growth:.65,ks:.004,loss:.45},wp=1.07,Tp=6.45,Ep=.15,Dp=.07,Op=.02,kp=.2,Ap=4,jp=2,Mp=17.9,Np=17.9/50.04,Pp=7.14,Fp=.6,Ip=.004,Lp=3,Rp=10**-6.35,zp=4,Bp=.08,Vp=.15,Hp=14/71*.5,Up={growth:6,ks:.3,loss:.7,yield:.6},Wp=[.4,4],Gp=.06,Kp=21.1,qp=.6,Jp=3.5,Yp=10,Xp=op*4186,Zp=79,Qp=.5,$p=[`ammonia`,`nitrite`,`nitrate`,`cold`,`chlorine`,`acid`,`swing`],em={lethargy:[.9,.9,.7,1,.8,.6,.6],gasp:[.8,1,.1,0,.7,.2,.2],clamp:[.9,.6,.6,.6,.9,.8,.8],pale:[.7,.6,.6,.4,.8,.6,.7],appetite:[1,.9,.7,.8,1,.6,.6]},tm=2,nm=[36,36,48,3,18,24,24],rm=2,im=.12,am=[24,3],om=[.12,.35,.65],sm=Object.freeze({lethargy:0,gasp:0,clamp:0,pale:0,appetite:1,nest:1,cloud:0,tint:0,heaterLamp:1}),cm=.01,lm=[`tap`,`rinse`,`change`,`untreated`,`feast`],um={0:[],1:[9],2:[9,19],4:[8,12,16,20]},dm={none:null,weekly:{days:[0],fraction:.25},twice:{days:[3,0],fraction:.5},test:{days:[0,1,2,3,4,5,6],fraction:.5,reads:.5}},fm=10,pm=9,mm=3*cp,hm=120,gm=e=>e<0?0:e>1?1:e,_m=(e,t,n)=>e<=t?0:gm(.7*Math.log(e/t)/Math.log(n/t)),vm=e=>e*1.8+32,ym=e=>(e-32)/1.8,bm=(e,t)=>1/(1+10**(.09018+2729.92/(t+273.15)-e));function xm(){return{t:pm*cp,tan:0,no2:0,no3:0,detritus:0,gut:0,pellets:[],nextPellet:1,aob:bp.map(e=>e*.02),nob:bp.map(e=>e*.01),kh:Ap,tannin:0,chlorine:0,doc:2,leach:3,bloom:1e-4,tempC:ym(Zp),heater:!0,heating:!1,lamp:1,dechlor:!0,feel:$p.map(()=>0),phUsed:0,nest:1,owed:0,event:null,eventAt:0,given:[],cycled:!1,history:[]}}var Sm=class e{constructor(e=null){this.s={...xm(),...e??{}},this.s.phUsed||(this.s.phUsed=this.ph),this.fx={...sm},this.lampWindow=0,this.effects()}static restore(t){if(!t||typeof t!=`object`)return null;let n=xm(),r=(e,t=0)=>typeof e==`number`&&Number.isFinite(e)&&e>=t,i=(e,t,n=0)=>Array.isArray(e)&&(t<0||e.length===t)&&e.every(e=>r(e,n));for(let[e,i]of Object.entries(n)){let n=t[e];if(typeof i==`number`&&!r(n,e===`phUsed`?-1/0:0)||typeof i==`boolean`&&typeof n!=`boolean`)return null}return i(t.aob,3)&&i(t.nob,3)&&i(t.feel,$p.length)&&t.feel.every(e=>e<=1)&&Array.isArray(t.pellets)&&t.pellets.length<=yp&&t.pellets.every(e=>i(e,2))&&Array.isArray(t.given)&&t.given.every(e=>i(e,2))&&Array.isArray(t.history)&&t.history.length<=hm*86400/mm&&t.history.every(e=>i(e,4))&&(t.event===null||lm.includes(t.event))?new e(t):null}static start(t){let n=new e;if(t===`new`)return n.sample(),n;let r=n.s;return r.aob=bp.map(e=>e*1),r.nob=bp.map(e=>e*1),r.detritus=2.2,r.no3=2.5*op,r.kh=2.8,r.tannin=1,r.doc=.05,r.leach=0,r.bloom=.01,r.cycled=!0,n.advance(28*sp,{meals:2,change:`weekly`}),t===`neglected`&&n.advance(120*sp,{meals:2,change:`none`}),r.t=pm*cp,r.history=[],r.given=[],r.event=null,r.phUsed=n.ph,n.sample(),n}get ph(){let e=this.s,t=(e.kh*Np-Bp*e.tannin)/1e3,n=Lp/44010,r=(-t+Math.sqrt(t*t+4*Rp*n))/2;return-Math.log10(r)}readings(){let e=this.s,t=this.ph,n=e.tan/op;return{ammonia:17/14*n,nitrite:e.no2/op*(46/14),nitrate:e.no3/op*(62/14),ph:t,kh:e.kh,tempF:vm(e.tempC),tempC:e.tempC,chlorine:e.chlorine,freeAmmonia:17/14*n*bm(t,e.tempC)}}get bacteria(){let e=e=>e[0]+e[1]+e[2];return{aob:e(this.s.aob),nob:e(this.s.nob)}}get stress(){return 1-this.s.feel.reduce((e,t)=>e*(1-t),1)}condition(){let e=this.stress,t=om.filter(t=>e>=t).length;if(t===0)return{level:t,cause:null};let n=this.s.feel;return{level:t,cause:$p[n.indexOf(Math.max(...n))]}}happening(){let e=this.s,t=this.readings(),n=e.t-e.eventAt;return e.chlorine>.05?`chlorine`:e.heater?t.tempF<76?`warming`:e.event===`tap`&&n<259200?`tapRinse`:e.event===`feast`&&n<86400?`feast`:t.ph<6.6&&e.kh<1?`acid`:this.fx.cloud>.25?e.cycled?`bloomFood`:`bloomNew`:t.ammonia>=.1&&t.nitrite<.1?e.cycled?`ammoniaBack`:`stage1`:t.ammonia>=.1?`stage2`:t.nitrite>=.1?`stage3`:e.cycled?t.nitrate>=40?`nitrate`:e.kh<1.5?`kh`:e.pellets.length>0?`rotting`:e.event===`rinse`&&n<86400?`rinsed`:e.event===`change`&&n<86400?`changed`:`cycled`:`uncycled`:t.tempF<76?`cold`:`cooling`}eat(e){this.s.gut+=e*dp*.75,this.fed(e)}leave(){let e=this.s,t=e.nextPellet++;if(e.pellets.length>=yp){let[,t]=e.pellets.shift();e.tan+=t*_p,e.detritus+=t*.30000000000000004}return e.pellets.push([t,dp]),this.fed(1),t}meal(e=3){let t=this.s;t.owed+=e*this.fx.appetite;let n=Math.min(Math.floor(t.owed+1e-9),e);t.owed=Math.min(t.owed-n,1),n&&this.eat(n);let r=[];for(let t=n;t<e;t++)r.push(this.leave());return r}reads(e){let t=this.readings();return t.ammonia>=e||t.nitrite>=e}waterChange(e){let t=this.s,n=1-e;t.tan*=n,t.no2*=n,t.no3*=n,t.doc*=n,t.bloom*=n,t.tannin*=n,t.kh=t.kh*n+Ap*e,t.chlorine=t.dechlor?0:t.chlorine*n+jp*e,t.detritus*=1-Math.min(1.2*e,.8),t.pellets=[],t.aob[1]*=1-.15*e,t.nob[1]*=1-.15*e,this.mark(t.dechlor?`change`:`untreated`)}rinseSponge(e){let t=this.s,n=e?.03:.9;t.aob[0]*=n,t.nob[0]*=n,t.detritus*=.85,this.mark(e?`tap`:`rinse`)}set heater(e){this.s.heater=e}get heater(){return this.s.heater}set dechlor(e){this.s.dechlor=e}get dechlor(){return this.s.dechlor}static nextEvent(e,t){let n=Math.floor(e/sp),r=null;for(let i=n;i<=n+7&&!r;i++){let n=[];for(let e of um[t.meals]??[])n.push({t:i*sp+e*cp,kind:`meal`});let a=dm[t.change];a&&a.days.includes((i+1)%7)&&n.push({t:i*sp+fm*cp,kind:`change`,fraction:a.fraction,reads:a.reads??0});for(let t of n)t.t>e&&(!r||t.t<r.t)&&(r=t)}return r}advance(t,n,r=()=>this.meal()){if(!(t>0))return;let i=this.s.t+t;for(;;){let t=e.nextEvent(this.s.t,n);if(!t||t.t>i)break;this.runTo(t.t),t.kind===`meal`?r():this.reads(t.reads)&&this.waterChange(t.fraction)}this.runTo(i)}step(e){e>0&&this.runTo(this.s.t+e)}runTo(e){let t=this.s,n=e-t.t;if(!(n>0))return;let r=Math.max(1,Math.ceil(n/lp-1e-9)),i=0;for(let a=0;a<r;a++)i+=this.substep(a===r-1?e-t.t:n/r);t.t=e;let a=Math.min(Math.max(i/n,0),1);t.lamp=this.lampWindow>0?t.lamp+(a-t.lamp)*(1-Math.exp(-n/this.lampWindow)):a,this.effects()}substep(e){let t=this.s,n=e/sp,r=t.t;t.t+=e;let i=r/cp%24,a=Kp+qp*Math.cos((i-15)/24*2*Math.PI),o=Math.max(1,Math.ceil(e/up)),s=e/o,c=0;for(let e=0;e<o;e++){let e=vm(t.tempC);t.heater?e<Zp-Qp/2?t.heating=!0:e>79.25&&(t.heating=!1):t.heating=!1,t.tempC+=(a-t.tempC)*(1-Math.exp(-s/(Jp*cp)))+(t.heating?Yp*s/Xp:0),t.heating&&(c+=s)}let l=wp**(t.tempC-25),u=this.ph,d=1/(1+Math.exp(-(u-Tp)/Ep)),f=t.gut*(1-Math.exp(-n/hp));t.gut-=f;let p=pp/.75*f+gp*l*n;t.kh+=p*Fp*(Pp/2)/op/Mp;let m=p,h=f/dp*fp*.15+t.leach*n;t.leach*=Math.exp(-n/2);let g=t.detritus*(1-Math.exp(-.07*l*n));t.detritus+=mp/.75*f-g,m+=g,h+=g*2;let _=1-Math.exp(-1.3*l*n);for(let e=t.pellets.length-1;e>=0;e--){let n=t.pellets[e],r=n[1]*_;n[1]-=r,n[1]<vp*.128&&(t.detritus+=n[1],t.pellets.splice(e,1)),m+=r*_p,t.detritus+=r*.30000000000000004,h+=r/dp*fp}if(t.chlorine>0){let e=t.chlorine;t.chlorine*=Math.exp(-3*n),m+=(e-t.chlorine)*op*Hp;let r=Math.exp(-.7*((e+t.chlorine)/2)*n);for(let e=0;e<3;e++)t.aob[e]*=r,t.nob[e]*=r;t.bloom*=r*r,t.chlorine<1e-4&&(t.chlorine=0)}t.tan+=m;let v=Dp*n*(t.tan/op)/(Op+t.tan/op);t.tan-=v;let y=Dp*n-v,b=Math.min(y*(t.no3/op)/(kp+t.no3/op),t.no3);t.no3-=b,t.kh+=Pp/2*b/op/Mp+Ap*Ip*n;let x=t.aob[0]+t.aob[1]+t.aob[2],S=t.nob[0]+t.nob[1]+t.nob[2],C=Cm(t.tan,x*l*d*n,Sp.ks);t.tan-=C,t.no2+=C;let w=Cm(t.no2,S*l*d*n,Cp.ks);t.no2-=w,t.no3+=w,t.kh=Math.max(t.kh-C*Pp/op/Mp,0),wm(t.aob,x,C,Sp,l*(.1+.9*d),n),wm(t.nob,S,w,Cp,l*(.1+.9*d),n);let T=t.doc+h/op,E=Math.min(x/.6,1),D=T-T*(1-Math.exp(-(Wp[0]+(Wp[1]-Wp[0])*E)*n)),O=Math.min(Up.growth*l*(D/(Up.ks+D))*t.bloom*n,D*Up.yield);return t.doc=Math.max(D-O/Up.yield,0),t.bloom=Math.max(t.bloom+O-t.bloom*(1-Math.exp(-Up.loss*n)),1e-5),t.tannin+=(1-t.tannin)*(1-Math.exp(-n/zp)),this.feel(e,u),!t.cycled&&x>.3&&S>.3&&t.tan/op<.05&&t.no2/op<.02&&(t.cycled=!0),Math.floor(t.t/mm)>Math.floor(r/mm)&&this.sample(),c}feel(e,t){let n=this.s,r=this.readings();n.phUsed+=(t-n.phUsed)*(1-Math.exp(-e/(rm*sp)));let i=[_m(r.freeAmmonia,.004,.05),_m(r.nitrite,.25,2),_m(r.nitrate,40,160),gm((76.5-r.tempF)/6.5*.55),_m(r.chlorine,.02,.2),gm((5.6-t)/.6*.7),gm((Math.abs(t-n.phUsed)-.5)/.6*.7)];for(let t=0;t<i.length;t++){let r=i[t]>n.feel[t]?tm:nm[t];n.feel[t]+=(i[t]-n.feel[t])*(1-Math.exp(-e/(r*cp)))}let a=+(this.stress<im&&r.tempF>=77);n.nest+=(a-n.nest)*(1-Math.exp(-e/(am[+!a]*cp)))}effects(){let e=this.s,t=t=>1-e.feel.reduce((e,n,r)=>e*(1-t[r]*n),1),n=this.fx;n.lethargy=t(em.lethargy),n.gasp=t(em.gasp),n.clamp=t(em.clamp),n.pale=t(em.pale),n.appetite=1-.95*t(em.appetite),n.nest=e.nest,n.cloud=(e.bloom-Gp)/.94,n.tint=Vp*e.tannin,n.heaterLamp=e.lamp;for(let e in n){let t=Number.isFinite(n[e])?gm(n[e]):sm[e];n[e]=Math.abs(t-sm[e])<cm?sm[e]:t}}sample(){let e=this.s,t=this.readings(),n=e=>Math.round(e*1e3)/1e3;e.history.push([Math.round(e.t),n(t.ammonia),n(t.nitrite),n(t.nitrate)]);let r=hm*sp/mm;e.history.length>r&&e.history.splice(0,e.history.length-r)}fed(e){let t=this.s;for(t.given.push([t.t,e]);t.given.length&&t.given[0][0]<t.t-86400;)t.given.shift();t.given.reduce((e,t)=>e+t[1],0)>=20&&!(t.event===`feast`&&t.t-t.eventAt<86400)&&this.mark(`feast`)}mark(e){this.s.event=e,this.s.eventAt=this.s.t}toJSON(){return this.s}};function Cm(e,t,n){return e<=0||t<=0?0:e-e/(1+t/(op*(n+e/op)))}function wm(e,t,n,r,i,a){let o=Math.exp(-r.loss*i*a);for(let i=0;i<3;i++){let a=t>0?e[i]/t:bp[i];e[i]=Math.min(e[i]*o+r.growth*n*a,xp[i])}}var Tm={pause:0,play:1800,fast:6*cp},Em=.15,Dm={x:[-.3,.3],z:[.28,.56],above:.015},Om={meals:[0,1,2,4],change:[`none`,`weekly`,`twice`,`test`]};function km(e){let t=Math.floor(e%sp/600)*10,n=Math.floor(t/60);return`Day ${Math.floor(e/sp)+1} · ${n%12||12}:${String(t%60).padStart(2,`0`)} ${n<12?`am`:`pm`}`}var Am=class{constructor(e){this.host=e,this.on=!1,this.bowl=Sm.start(`new`),this.speed=`play`,this.routine={meals:2,change:`none`},this.mealAt=0,this.meals={log:new $f,now:()=>this.bowl.s.t,drop:()=>this.meals.log.drop(this.mealAt)},this.feedState=e.feeding.state,this.eaten=0,this.since=0,this.shown=new Map}set(e){this.on=e;let t=this.host;if(e)t.water.fx=this.bowl.fx,this.eaten=t.food.eatenCount,this.since=t.food.landings,this.feedState=t.feeding.state,this.mealAt=this.bowl.s.t,this.sync();else{t.water.fx=t.idle;for(let e of this.shown.values())t.food.take(e);this.shown.clear()}}frame(e,t=!1){let n=this.host,r=n.feeding.state;r!==this.feedState&&(this.feedState===`idle`&&(this.mealAt=this.bowl.s.t),this.feedState=r);let i=n.food.eatenCount-this.eaten;this.eaten=n.food.eatenCount,i>0&&this.bowl.eat(i);for(let e of n.food.leave(this.since))this.shown.set(this.bowl.leave(),e);let a=t?0:e*Tm[this.speed];a>0&&(this.bowl.lampWindow=Em*Tm[this.speed],this.bowl.advance(a,this.routine,()=>this.meal()))}meal(){for(let e=0;e<3;e++)this.meals.log.drop(this.bowl.s.t);this.bowl.meal(3)}sync(){let e=this.host.food,t=this.bowl.s.pellets.slice(-4);for(let[n,r]of this.shown)(!t.some(e=>e[0]===n)||!e.isLeft(r))&&(e.take(r),this.shown.delete(n));for(let[n,r]of t){let t=this.shown.get(n)??e.lay(this.spot(n));t<0||(this.shown.set(n,t),e.rot(t,r/dp))}}spot(e){let t=e*.618034%1,n=(e*.754878+.5)%1,r=[Dm.x[0]+t*(Dm.x[1]-Dm.x[0]),this.host.bed+Dm.above,Dm.z[0]+n*(Dm.z[1]-Dm.z[0])],i=this.host.rotation();return[0,1,2].map(e=>i[e]*r[0]+i[3+e]*r[1]+i[6+e]*r[2])}startOver(e){this.bowl=Sm.start(e),this.meals.log=new $f,this.mealAt=this.bowl.s.t,this.on&&(this.host.water.fx=this.bowl.fx),this.sync()}forward(e){this.bowl.advance(e*sp,this.routine,()=>this.meal()),this.sync()}toJSON(){return{v:1,bowl:this.bowl,speed:this.speed,meals:this.routine.meals,change:this.routine.change}}restore(e){if(!e||e.v!==1)return!1;let t=Sm.restore(e.bowl);return t?(this.bowl=t,Object.hasOwn(Tm,e.speed)&&(this.speed=e.speed),Om.meals.includes(e.meals)&&(this.routine.meals=e.meals),Om.change.includes(e.change)&&(this.routine.change=e.change),!0):!1}},jm=Object.freeze({lethargy:0,gasp:0,clamp:0,pale:0,appetite:1,nest:1,cloud:0,tint:0,heaterLamp:1});function Mm(e){if(e===null)return null;let t={...jm};for(let n of e.split(`,`)){let[e,r]=n.split(`:`);e in t&&Number.isFinite(Number(r))&&(t[e]=Math.min(Math.max(Number(r),0),1))}return t}var Nm={kicker:`Water`,title:`Water mode`,body:`This bowl’s water, simulated: the fish’s waste, the bacteria that clear it, the heater, the pH. Time runs fast, about a day a minute. Try a water change, or skip a few and watch the readings.`},Pm={ammonia:{name:`Ammonia`,unit:` ppm`,about:`Ammonia (NH3/NH4+, in ppm) comes from the fish’s gills and rotting food. It should read 0. It is most toxic in warm, alkaline water.`},nitrite:{name:`Nitrite`,unit:` ppm`,about:`Nitrite (NO2-, in ppm) is what the first bacteria make of ammonia. It should read 0: it stops the blood carrying oxygen.`},nitrate:{name:`Nitrate`,unit:` ppm`,about:`Nitrate (NO3-, in ppm) is the end of the cycle, far milder. Water changes keep it under 20 to 40\xA0ppm.`},ph:{name:`pH`,unit:``,about:`Bettas come from soft, acid water and do well from about 6.0 to 7.5. A steady pH matters more than the number: avoid sudden swings.`},temp:{name:`Temp`,unit:``,about:`Keep a betta at 78 to 80\xA0°F (25.5 to 27\xA0°C). This room is 70\xA0°F: the heater makes up the rest.`}},Fm=[`Thriving`,`Uncomfortable`,`Stressed`,`In danger`],Im={ammonia:`ammonia burns its gills`,nitrite:`nitrite stops its blood carrying oxygen`,nitrate:`nitrate is high`,cold:`the water is too cold`,chlorine:`chlorine burns its gills`,acid:`the water is far too acid`,swing:`the pH changed too fast`},Lm={ammonia:`In a real bowl this much ammonia would likely kill it. Change half the water now, and again each day until ammonia reads 0.`,nitrite:`In a real bowl this much nitrite would likely kill it. Change half the water now, and again each day until nitrite reads 0.`,nitrate:`Nitrate this high wears a fish down. Change a quarter of the water every day or two until it is under 40\xA0ppm.`,cold:`This cold for long, a betta stops eating and falls ill. Turn the heater back on.`,chlorine:`In a real bowl chlorine this strong could kill it. Change water again with dechlorinator, which also neutralizes what is left.`,acid:`Water this acid harms a betta. Change a quarter of the water a day so the pH rises slowly.`,swing:`A sudden pH change shocks a fish. Change smaller amounts, more often, so the pH moves slowly.`},Rm={chlorine:`Untreated tap water: its chlorine is burning the fish’s gills and killing the filter’s bacteria. Always dechlorinate new water.`,cooling:`The heater is off. The water is cooling toward the room’s 70\xA0°F.`,cold:`The water is too cold. At 70\xA0°F a betta is sluggish, eats little and falls ill more easily.`,warming:`The heater is warming the water back up to 79\xA0°F.`,tapRinse:`Rinsing the sponge under the tap killed most of its bacteria. Expect ammonia and nitrite for a week or two: test and change water.`,feast:`That is far more food than a betta can eat. Uneaten pellets rot into ammonia and feed a cloud of bacteria.`,acid:`Old water: the buffer is spent and nitrate high. Change 25% a day or so apart until nitrate is under 40. One big change would jolt the pH.`,bloomNew:`A bacterial bloom: free-floating bacteria feeding on a new bowl’s organics cloud the water. It clears by itself in a few days.`,bloomFood:`Rotting food is feeding a bloom of bacteria that clouds the water. Siphon out leftovers and feed less.`,stage1:`Stage 1: ammonia builds up while the bacteria that eat it are few. A bowl this small needs a test, and often a change, every day.`,ammoniaBack:`Ammonia in a cycled bowl: more waste than its bacteria can keep up with. Change water and go easy on food.`,stage2:`Stage 2: bacteria turn ammonia into nitrite, just as toxic. In a bowl this small, test and change water daily until both read 0.`,stage3:`Stage 3: ammonia is cleared, and nitrite lingers until the second bacteria catch up. Keep testing daily, changing water when it reads 0.5.`,uncycled:`A new bowl: no bacteria yet to clear the fish’s waste, so ammonia will build up over the first days.`,nitrate:`Nitrate is building up. Only water changes (and the plants, a little) take it away.`,kh:`The bacteria use up the water’s buffer (KH) as they work. Water changes bring it back.`,rotting:`Uneaten pellets are rotting on the sand into ammonia. A water change siphons them out.`,rinsed:`The sponge was rinsed in a cup of the bowl’s own water: the muck is out and its bacteria are safe.`,changed:`Fresh, dechlorinated water: ammonia, nitrite and nitrate diluted, the buffer topped up.`,cycled:`The bowl is cycled: bacteria turn ammonia into nitrite and nitrite into nitrate as fast as they come.`},zm={label:`Water`,readings:`Test readings`,clock:`Clock`,care:`Care`,routine:`Routine`,start:`Start over`,sure:`Tap again to start over`,close:`Close`},Bm={open:{label:`Water`,title:`Simulate the bowl’s water: test readings, water changes, the heater and the filter`},expand:{label:`More`,title:`Show the chart and the care controls`},collapse:{label:`Less`,title:`Hide the chart and the care controls`},pause:{label:`Pause`,title:`Stop the clock`},play:{label:`Play`,title:`Run the clock: half an hour a second`},fast:{label:`Fast`,title:`Run the clock fast: six hours a second`},change25:{label:`Change 25%`,title:`Siphon a quarter of the water out, with the debris on the sand, and refill with tap water`},change50:{label:`Change 50%`,title:`Siphon half the water out, with the debris on the sand, and refill with tap water`},rinseTank:{label:`Rinse sponge in bowl water`,title:`Squeeze the filter sponge out in a cup of the bowl’s own water`},rinseTap:{label:`Rinse sponge under tap`,title:`Rinse the filter sponge under the tap`},heater:{label:`Heater`,title:`Switch the heater on or off`},dechlor:{label:`Dechlorinator`,title:`Treat the new water of each change with dechlorinator`},meals:{label:`Meals a day`,title:`Three pellets a meal on time, counted without opening the lid (the Feed button gives a real one)`},routine:{label:`Water changes`,title:`Water changes done for you at 10\xA0am; or the water tested daily, half changed when ammonia or nitrite reads 0.5\xA0ppm or more`}},Vm=[{value:0,label:`None`},{value:1,label:`Once`},{value:2,label:`Twice`},{value:4,label:`Four times`}],Hm=[{value:`none`,label:`None`},{value:`weekly`,label:`25% weekly`},{value:`twice`,label:`50% twice a week`},{value:`test`,label:`When the test says so`}],Um=[{value:`new`,label:`New bowl`,title:`Set up today, the fish in today: no bacteria yet`},{value:`cycled`,label:`Cycled bowl`,title:`Its bacteria grown, kept well with weekly changes`},{value:`neglected`,label:`Neglected bowl`,title:`Cycled, then four months without a water change`}],Wm={title:`The nitrogen cycle, day by day`,unit:`all in ppm`,top:`Ammonia and nitrite (ppm)`,bottom:`Nitrate (ppm)`,day:`Day`},Gm=[{key:1,name:`Ammonia`,colour:`#28a679`},{key:2,name:`Nitrite`,colour:`#9085e9`},{key:3,name:`Nitrate`,colour:`#e66767`}],Km=`#94c9ce`,qm=`rgba(148, 201, 206, 0.16)`,Jm=`#0a2c39`,Ym=74,Xm=46,Zm=26,Qm=8;function $m(e){let t=10**Math.floor(Math.log10(e));for(let n of[1,2,2.5,5,10])if(n*t>=e)return n*t;return 10*t}var eh=class{canvas;ctx;tip;history=[];hover=null;width=0;constructor(e){let t=this.canvas=document.createElement(`canvas`);t.className=`water-chart-plot`,t.style.height=`164px`,t.setAttribute(`role`,`img`),t.setAttribute(`aria-label`,Wm.title),this.ctx=t.getContext(`2d`);let n=this.tip=document.createElement(`p`);n.className=`water-chart-tip`,n.setAttribute(`aria-hidden`,`true`),e.append(t,n);let r=e=>{this.hover=e.clientX-t.getBoundingClientRect().left,this.draw()};t.addEventListener(`pointerdown`,r),t.addEventListener(`pointermove`,r);let i=()=>{this.hover=null,this.draw()};t.addEventListener(`pointerleave`,i),t.addEventListener(`pointercancel`,i),new ResizeObserver(([e])=>{this.width=e.contentRect.width,this.draw()}).observe(t)}set(e){this.history=e,this.draw()}draw(){let e=this.canvas,t=this.width;if(t===0)return;let n=Math.min(window.devicePixelRatio||1,3),r=Math.round(t*n),i=Math.round(164*n);(e.width!==r||e.height!==i)&&(e.width=r,e.height=i);let a=this.ctx;a.setTransform(n,0,0,n,0,0),a.clearRect(0,0,t,164);let o=this.history,s=o.length?Math.floor(o[0][0]/sp):0,c=Math.max(7,o.length?o[o.length-1][0]/sp-s:0),l=Zm,u=t-Qm,d=e=>l+(e/sp-s)/c*(u-l),f=1,p=20;for(let e of o)f=Math.max(f,e[1],e[2]),p=Math.max(p,e[3]);f=$m(f),p=$m(p);let m=[{y:6,height:Ym,max:f,series:[Gm[0],Gm[1]]},{y:102,height:Xm,max:p,series:[Gm[2]]}];a.font=`10px Inter Variable, Inter, system-ui, sans-serif`,a.lineWidth=1;for(let e of m){let t=t=>e.y+e.height-t/e.max*e.height;a.textAlign=`right`,a.textBaseline=`middle`;for(let n of[0,e.max/2,e.max]){let e=Math.round(t(n))+.5;a.strokeStyle=qm,a.beginPath(),a.moveTo(l,e),a.lineTo(u,e),a.stroke(),a.fillStyle=Km,a.fillText(String(Math.round(n*100)/100),21,e)}a.lineWidth=2,a.lineJoin=`round`,a.lineCap=`round`;for(let n of e.series)a.strokeStyle=n.colour,a.beginPath(),o.forEach((e,r)=>r?a.lineTo(d(e[0]),t(e[n.key])):a.moveTo(d(e[0]),t(e[n.key]))),a.stroke();let n=o[o.length-1];if(n)for(let r of e.series)a.beginPath(),a.arc(d(n[0]),t(n[r.key]),4,0,Math.PI*2),a.fillStyle=r.colour,a.strokeStyle=Jm,a.lineWidth=2,a.fill(),a.stroke();a.lineWidth=1}let h=[1,2,7,14,28,56].find(e=>(u-l)/c*e>=34)??56;a.textAlign=`center`,a.textBaseline=`top`,a.fillStyle=Km;for(let e=0;e<=c;e+=h)a.fillText(String(s+e+1),Math.min(Math.max(d((s+e)*sp),34),u-8),152);if(a.textAlign=`right`,a.fillText(Wm.day,21,152),this.hover!==null&&o.length){let e=(s+(this.hover-l)/(u-l)*c)*sp,t=0;for(let n=1;n<o.length;n++)Math.abs(o[n][0]-e)<Math.abs(o[t][0]-e)&&(t=n);let n=o[t],r=Math.round(d(n[0]))+.5;a.strokeStyle=Km,a.beginPath(),a.moveTo(r,6),a.lineTo(r,148),a.stroke(),this.tip.textContent=`${km(n[0])} · ${Gm.map(e=>`${e.name} ${n[e.key].toFixed(e.key===3?1:2)}`).join(` · `)}`,this.tip.classList.add(`is-on`)}else this.tip.classList.remove(`is-on`);if(o.length){let t=o[o.length-1],n=e=>Math.max(...o.map(t=>t[e])).toFixed(e===3?0:2);e.setAttribute(`aria-label`,`${Wm.title}: day ${Math.floor(t[0]/sp)+1}. Ammonia ${t[1].toFixed(2)} ppm (peak ${n(1)}), nitrite ${t[2].toFixed(2)} (peak ${n(2)}), nitrate ${t[3].toFixed(0)} (peak ${n(3)}).`)}}},th={ammonia:[[0,`#efe04b`],[.25,`#d9df4d`],[.5,`#bdd653`],[1,`#9fca5b`],[2,`#78b65d`],[4,`#4f9b58`],[8,`#2f7c4f`]],nitrite:[[0,`#80c4e6`],[.25,`#8fa9e0`],[.5,`#9b8fd8`],[1,`#a174cc`],[2,`#9a58b9`],[5,`#7f3a9d`]],nitrate:[[0,`#f2e35a`],[5,`#f4cc4a`],[10,`#f2a83f`],[20,`#ee8436`],[40,`#e2552f`],[80,`#c8332a`],[160,`#951d25`]],ph:[[6,`#e9d84b`],[6.4,`#c8cf55`],[6.6,`#a9c46a`],[6.8,`#86b67e`],[7,`#66a693`],[7.2,`#4d93a6`],[7.6,`#3b7bb5`]]};function nh(e,t){let n=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16));if(t<=e[0][0])return e[0][1];for(let r=1;r<e.length;r++)if(t<=e[r][0]){let i=(t-e[r-1][0])/(e[r][0]-e[r-1][0]),a=n(e[r-1][1]),o=n(e[r][1]);return`rgb(${a.map((e,t)=>Math.round(e+(o[t]-e)*i)).join(`, `)})`}return e[e.length-1][1]}var rh=(e,t)=>e<t?`0`:e<1?e.toFixed(2):e<10?e.toFixed(1):Math.round(e).toString();function ih(e,t){e.getAttribute(`aria-pressed`)===`true`!==t&&e.setAttribute(`aria-pressed`,String(t))}var ah={pause:`<path d="M8 6v12M16 6v12"/>`,play:`<path d="M8 5.5l11 6.5-11 6.5z"/>`,fast:`<path d="M4 6l8 6-8 6zM12 6l8 6-8 6z"/>`},oh=class{act;root;chart;expanded=!1;values=new Map;chips=new Map;clockEl;conditionEl;whyEl;whatEl;moreEl;intro;speedEls;heaterEl;dechlorEl;mealsEl;changeEl;shown=new Map;aboutUntil=0;about=``;sure=null;constructor(e,t){this.act=t;let n=this.root=document.createElement(`section`);n.className=`water-panel`,n.setAttribute(`aria-label`,zm.label),n.hidden=!0;let r=(e,t,n,r=``)=>{let i=document.createElement(e);return i.className=t,r&&(i.textContent=r),n.append(i),i},i=(e,t,n,i)=>{let a=r(`button`,e,t,n.label);return a.type=`button`,n.title&&(a.title=n.title),a.addEventListener(`click`,i),a},a=this.intro=r(`div`,`water-intro`,n);a.hidden=!0;let o=r(`button`,`learn-close`,a);o.type=`button`,o.setAttribute(`aria-label`,zm.close),o.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>`;let s=()=>{a.hidden=!0,t.introClosed()};o.addEventListener(`click`,s),window.addEventListener(`keydown`,e=>{e.key===`Escape`&&!a.hidden&&!n.hidden&&s()});let c=r(`div`,`learn-text`,a);r(`p`,`learn-kicker`,c,Nm.kicker),r(`p`,`learn-title`,c,Nm.title),r(`p`,`learn-body`,c,Nm.body);let l=r(`div`,`water-strip`,n),u=r(`div`,`water-readings`,l);u.setAttribute(`role`,`group`),u.setAttribute(`aria-label`,zm.readings);for(let[e,t]of Object.entries(Pm)){let n=r(`button`,`water-reading`,u);n.type=`button`,n.title=t.about,n.dataset.reading=e;let i=r(`span`,`water-name`,n,t.name);e===`temp`&&this.values.set(`tempC`,r(`span`,`water-sub`,i));let a=r(`span`,`water-value`,n);if(th[e]){let t=r(`i`,`water-chip`,a);t.setAttribute(`aria-hidden`,`true`),this.chips.set(e,t)}this.values.set(e,r(`span`,``,a)),n.addEventListener(`click`,()=>{this.about=t.about,this.aboutUntil=performance.now()+6e3,this.write(this.whyEl,t.about),this.write(this.whatEl,``)})}let d=r(`div`,`water-bar`,l);this.conditionEl=r(`span`,`water-condition`,d),this.clockEl=r(`span`,`water-clock`,d);let f=r(`div`,`water-speed`,d);f.setAttribute(`role`,`group`),f.setAttribute(`aria-label`,zm.clock),this.speedEls=[`pause`,`play`,`fast`].map(e=>{let n=i(``,f,{label:``,title:Bm[e].title},()=>t.speed(e));return n.dataset.speed=e,n.setAttribute(`aria-label`,Bm[e].label),n.setAttribute(`aria-pressed`,`false`),n.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${ah[e]}</svg>`,n}),this.moreEl=i(`water-more`,d,Bm.expand,()=>this.expand(!this.expanded)),this.moreEl.setAttribute(`aria-controls`,`water-body`),this.moreEl.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>`;let p=r(`p`,`water-news`,l);p.setAttribute(`role`,`status`),p.setAttribute(`aria-live`,`polite`),this.whyEl=r(`span`,`water-why`,p),this.whatEl=r(`span`,`water-what`,p);let m=r(`div`,`water-body`,n);m.id=`water-body`;let h=r(`figure`,`water-chart`,m),g=r(`figcaption`,`water-legend`,h);for(let e of Gm)r(`span`,`water-key`,g,e.name).style.setProperty(`--key`,e.colour);r(`span`,`water-units`,g,Wm.unit),this.chart=new eh(h);let _=r(`div`,`water-group`,m);r(`h3`,`water-heading`,_,zm.care);let v=r(`div`,`water-actions`,_);i(`water-action`,v,Bm.change25,()=>t.change(.25)),i(`water-action`,v,Bm.change50,()=>t.change(.5)),i(`water-action water-wide`,v,Bm.rinseTank,()=>t.rinse(!1)),i(`water-action water-wide`,v,Bm.rinseTap,()=>t.rinse(!0)),this.heaterEl=i(`water-action water-toggle`,v,Bm.heater,()=>t.heater(this.heaterEl.getAttribute(`aria-pressed`)!==`true`)),this.dechlorEl=i(`water-action water-toggle`,v,Bm.dechlor,()=>t.dechlor(this.dechlorEl.getAttribute(`aria-pressed`)!==`true`));for(let e of[this.heaterEl,this.dechlorEl])e.setAttribute(`aria-pressed`,`true`);let y=r(`div`,`water-group`,m);r(`h3`,`water-heading`,y,zm.routine);let b=(e,t,n)=>{let i=r(`label`,`water-select`,y);i.title=e.title,r(`span`,``,i,e.label);let a=r(`select`,``,i);for(let e of t){let t=r(`option`,``,a,e.label);t.value=String(e.value)}return a.addEventListener(`change`,()=>n(a.value)),a};this.mealsEl=b(Bm.meals,Vm,e=>t.meals(Number(e))),this.changeEl=b(Bm.routine,Hm,e=>t.routine(e));let x=r(`div`,`water-group`,m);r(`h3`,`water-heading`,x,zm.start);let S=r(`div`,`water-actions water-starts`,x);for(let e of Um){let n=i(`water-action`,S,e,()=>{this.sure?.kind===e.value&&performance.now()<this.sure.until?(this.sure=null,n.textContent=e.label,t.start(e.value)):(this.sure={kind:e.value,until:performance.now()+3e3},n.textContent=zm.sure,window.setTimeout(()=>{n.textContent===zm.sure&&(n.textContent=e.label)},3e3))});n.dataset.start=e.value}n.addEventListener(`pointerdown`,e=>e.stopPropagation()),e.append(n)}show(e){this.root.hidden=!e}showIntro(e){this.intro.hidden=!e}expand(e,t=!0){this.expanded=e,this.root.classList.toggle(`is-open`,e),this.moreEl.setAttribute(`aria-expanded`,String(e));let n=e?Bm.collapse:Bm.expand;this.moreEl.title=n.title,this.moreEl.setAttribute(`aria-label`,n.label),t&&this.act.expanded(e)}update(e){this.write(this.clockEl,e.clock),this.reading(`ammonia`,rh(e.ammonia,.05),e.ammonia),this.reading(`nitrite`,rh(e.nitrite,.05),e.nitrite),this.reading(`nitrate`,rh(e.nitrate,.5),e.nitrate),this.reading(`ph`,e.ph.toFixed(1),e.ph),this.reading(`temp`,`${e.tempF.toFixed(1)}\u00a0°F`,e.tempF),this.write(this.values.get(`tempC`),` ${e.tempC.toFixed(1)}\u00a0°C`);let t=Fm[e.level],n=e.cause?`${t}: ${Im[e.cause]}`:t;this.conditionEl.title!==n&&(this.conditionEl.title=n,this.conditionEl.dataset.level=String(e.level)),this.write(this.conditionEl,t);let r=performance.now()<this.aboutUntil;this.write(this.whyEl,r?this.about:e.level>=3&&e.cause?Lm[e.cause]:e.cause?`${t}: ${Im[e.cause]}.`:``),this.write(this.whatEl,r||e.level>=3?``:e.news);for(let t of this.speedEls)ih(t,t.dataset.speed===e.speed);ih(this.heaterEl,e.heater),ih(this.dechlorEl,e.dechlor),this.mealsEl.value!==String(e.meals)&&(this.mealsEl.value=String(e.meals)),this.changeEl.value!==e.change&&(this.changeEl.value=e.change)}reading(e,t,n){let r=this.values.get(e);this.shown.get(r)!==t&&r.closest(`button`).setAttribute(`aria-label`,`${Pm[e].name} ${t}${Pm[e].unit}`),this.write(r,t);let i=this.chips.get(e),a=th[e];if(i&&a){let e=nh(a,n);this.shown.get(i)!==e&&(this.shown.set(i,e),i.style.background=e)}}write(e,t){this.shown.get(e)!==t&&(this.shown.set(e,t),e.textContent=t)}},sh=`betta.water`,ch=`betta.water.state`,lh=.25,uh=.5,dh=5,fh=class{stage;host;care;panel;button;panelDue=0;chartDue=0;saveDue=dh;charted=-1;open=null;introSeen=!1;constructor(e,t,n){this.stage=t,this.host=n;let r=this.care=new Am({water:n.water,idle:n.forced??jm,feeding:n.feeding,food:n.food,rotation:n.rotation,bed:kf.level}),i=this.button=document.createElement(`button`);i.type=`button`,i.dataset.action=`water`,i.textContent=Bm.open.label,i.title=Bm.open.title,i.setAttribute(`aria-pressed`,`false`),i.addEventListener(`click`,()=>this.set(!this.on)),e.append(i);let a=e=>{e(),this.changed()};this.panel=new oh(t,{speed:e=>a(()=>r.speed=e),change:e=>a(()=>{r.bowl.waterChange(e),r.bowl.sample()}),rinse:e=>a(()=>r.bowl.rinseSponge(e)),heater:e=>a(()=>r.bowl.heater=e),dechlor:e=>a(()=>r.bowl.dechlor=e),meals:e=>a(()=>r.routine.meals=e),routine:e=>a(()=>r.routine.change=e),start:e=>this.startOver(e),expanded:e=>{this.open=e,this.charted=-1,this.chartDue=0,this.save()},introClosed:()=>{this.introSeen=!0,this.save()}});let o=()=>{this.on&&this.save()};addEventListener(`pagehide`,o),document.addEventListener(`visibilitychange`,()=>{document.hidden&&o()});try{let e=JSON.parse(localStorage.getItem(ch)??`null`);r.restore(e)&&(this.open=typeof e?.open==`boolean`?e.open:null,this.introSeen=e?.intro===!0),localStorage.getItem(sh)===`1`&&this.set(!0,!1)}catch(e){console.warn(`[globes] Water mode: starting with a new bowl:`,e),r.startOver(`new`),r.on&&this.render()}}get on(){return this.care.on}set(e,t=!0){this.care.set(e),this.button.setAttribute(`aria-pressed`,String(e)),this.stage.classList.toggle(`water-on`,e),this.panel.show(e),this.host.learn&&(this.host.learn.meals=e?this.care.meals:null);try{localStorage.setItem(sh,e?`1`:`0`)}catch{}e?(this.panel.expand(this.open??!matchMedia(`(max-width: 500px), (max-height: 500px)`).matches,!1),this.panel.showIntro(t&&!this.introSeen),this.render(),this.charted=-1,this.chartDue=0):this.save()}frame(e){this.care.frame(e,document.hidden),(this.panelDue-=e)<=0&&(this.panelDue=lh,this.care.sync(),this.render()),(this.chartDue-=e)<=0&&(this.chartDue=uh,this.chart()),(this.saveDue-=e)<=0&&(this.saveDue=dh,this.save())}startOver(e){this.care.startOver(e),this.changed()}forward(e){this.care.forward(e),this.changed()}render(){let{bowl:e,routine:t,speed:n}=this.care,r=e.readings(),i=e.condition();this.panel.update({clock:km(e.s.t),speed:n,ammonia:r.ammonia,nitrite:r.nitrite,nitrate:r.nitrate,ph:r.ph,tempF:r.tempF,tempC:r.tempC,level:i.level,cause:i.cause,news:Rm[e.happening()],heater:e.heater,dechlor:e.dechlor,meals:t.meals,change:t.change})}chart(){let e=this.care.bowl.s.history,t=e.length?e[e.length-1][0]:0;this.panel.expanded&&t!==this.charted&&(this.charted=t,this.panel.chart.set(e))}changed(){this.care.sync(),this.render(),this.charted=-1,this.chart(),this.save()}save(){try{localStorage.setItem(ch,JSON.stringify({...this.care.toJSON(),open:this.open,intro:this.introSeen}))}catch{}}};function ph(e,t,{fin:n=!1,caudal:r=!1,eye:i=!1}={}){let a=e.onBeforeCompile,o=e.customProgramCacheKey();return e.onBeforeCompile=e=>{a(e),Object.assign(e.uniforms,{macroHead:{value:t.head},macroScales:{value:t.scales},macroFin:{value:t.fin}}),e.fragmentShader=`uniform sampler2D macroHead, macroScales, macroFin;
`+e.fragmentShader,n&&(e.vertexShader=`varying vec2 vMacroFinUV;
`+e.vertexShader,e.vertexShader=e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
vMacroFinUV=finUV;`),e.fragmentShader=`varying vec2 vMacroFinUV;
`+e.fragmentShader);let o=`
vec2 headCoord(vec2 uv){vec2 pixel=vec2(uv.x*1536.,(1.-uv.y)*1024.);return vec2((pixel.x-145.)/290.+.017,1.-(pixel.y-300.)/250.-.034);}
vec2 scaleCoord(vec2 uv){vec2 pixel=vec2(uv.x*1536.,(1.-uv.y)*1024.);return vec2((pixel.x-430.)/400.,1.-(pixel.y-278.)/250.);}
float flankMask(vec2 uv){return smoothstep(400.,465.,uv.x*1536.);}
vec3 scalePigment(vec2 uv){
 vec2 q=scaleCoord(uv);float x=fract(q.x);float w=smoothstep(0.,.08,x)*(1.-smoothstep(.92,1.,x));
 vec3 a=texture2D(macroScales,vec2(x,clamp(q.y,.015,.985))).rgb;
 vec3 b=texture2D(macroScales,vec2(fract(q.x+.5),clamp(q.y,.015,.985))).rgb;
 return mix(b,a,w);
}
vec3 sectionPigment(vec2 uv){
 vec3 base=basePigment(uv);vec2 h=headCoord(uv),s=scaleCoord(uv);
 vec3 head=texture2D(macroHead,clamp(h,0.,1.)).rgb;
 float headMask=patchMask(h,.13);base=mix(base,head,headMask*.97);
 vec3 scales=scalePigment(uv);
 base=mix(base,scales,flankMask(uv)*.98);
 ${i?``:`// Conceal the painted eye beneath the moving globe so a glance cannot
 // reveal a second stationary pupil. The original source texture is unchanged.
 vec2 socket=(vec2(uv.x*1536.,(1.-uv.y)*1024.)-vec2(240.,400.))*.0032;
 base=mix(base,vec3(.018,.025,.027),1.-smoothstep(.062,.082,length(socket)));`}
 return base;
}
float microHeight(vec2 uv){
 vec2 h=headCoord(uv),s=scaleCoord(uv);
 float head=luminanceBetta(texture2D(macroHead,clamp(h,0.,1.)).rgb);
 float scales=luminanceBetta(scalePigment(uv));
 float original=luminanceBetta(basePigment(uv));
 float relief=mix(original,head,patchMask(h,.12));
 relief=mix(relief,scales,flankMask(uv));return relief;
}
`,s=`
vec2 membraneCoord(vec2 uv){
 ${r?`vec2 pixel=vec2(uv.x*1225.,(1.-uv.y)*1284.);return vec2((pixel.x-700.)/300.,1.-(pixel.y-360.)/340.);`:`return uv*vec2(7.,5.);`}
}
vec3 fineTissue(vec2 uv){vec2 q=membraneCoord(uv);q=vec2(1.)-abs(fract(q*.5)*2.-1.);return texture2D(macroFin,q).rgb-textureLod(macroFin,q,1.8).rgb;}
vec3 sectionPigment(vec2 uv){
 vec3 base=basePigment(uv);float edge=1.-smoothstep(.84,.99,vMacroFinUV.y);
 float grain=clamp(luminanceBetta(fineTissue(uv))*1.5,-.10,.10);return base*(1.+grain*edge);
}
float microHeight(vec2 uv){return luminanceBetta(basePigment(uv))+luminanceBetta(fineTissue(uv))*.20;}
// Fin rays against the membrane between them: 0 membrane, 1 ray. One ray period is
// 1/28 of u (matching the sculpted ridges); the pattern fades once a pixel spans a
// fraction of it, so zoomed-out views do not shimmer. Branching rays near the fringe.
float finRays(vec2 f){
 float px=fwidth(f.x)*28.;
 float r1=smoothstep(.7,1.,sin(f.x*175.929))*(1.-smoothstep(.25,.65,px));
 float r2=smoothstep(.4,.85,f.y)*.65*smoothstep(.7,1.,sin(f.x*351.858+1.3))*(1.-smoothstep(.25,.65,px*2.));
 return max(r1,r2);
}
`;e.fragmentShader=e.fragmentShader.replace(`#include <bumpmap_pars_fragment>`,`
float luminanceBetta(vec3 c){return dot(c,vec3(.2126,.7152,.0722));}
float patchMask(vec2 p,float margin){vec2 lo=smoothstep(vec2(0.),vec2(margin),p);vec2 hi=1.-smoothstep(vec2(1.-margin),vec2(1.),p);return lo.x*lo.y*hi.x*hi.y;}
vec3 basePigment(vec2 uv){return texture2D(map,uv).rgb;}
`+(n?s:o)+X.bumpmap_pars_fragment.replaceAll(`texture2D( bumpMap, vBumpMapUv ).x`,`microHeight(vBumpMapUv)`).replaceAll(`texture2D( bumpMap, vBumpMapUv + dSTdx ).x`,`microHeight(vBumpMapUv + dSTdx)`).replaceAll(`texture2D( bumpMap, vBumpMapUv + dSTdy ).x`,`microHeight(vBumpMapUv + dSTdy)`)),e.fragmentShader=e.fragmentShader.replace(`#include <map_fragment>`,`diffuseColor *= vec4(sectionPigment(vMapUv),1.);`),i||(e.fragmentShader=e.fragmentShader.replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
roughnessFactor=clamp(roughnessFactor+(1.-microHeight(vMapUv))*.10-.045,.28,.88);`));let c=n?`
 float rays=finRays(vMacroFinUV);
 {
  vec3 viewDir=normalize(vViewPosition);
  float ndv=clamp(dot(normal,viewDir),0.,1.);
  vec2 dH=vec2(dFdx(rays),dFdy(rays))*.0035;
  normal=perturbNormalArb(-vViewPosition,normal,dH,faceDirection);
  float shape=mix(.94,.74,smoothstep(.2,1.,vMacroFinUV.y));
  shape=mix(shape,.97,rays);
  diffuseColor.a=1.-pow(1.-shape,1./max(ndv,.34));
  vec3 hue=pow(diffuseColor.rgb,vec3(.8));
  vec3 through=vec3(0.);
  #if NUM_DIR_LIGHTS > 0
  for(int i=0;i<NUM_DIR_LIGHTS;i++) through+=directionalLights[i].color*max(-dot(normal,directionalLights[i].direction),0.);
  #endif
  totalEmissiveRadiance+=hue*through*.2*(1.-.55*rays)*(.55+.45*vMacroFinUV.y);
 }`:i?``:`
 {
  float ndv=clamp(dot(normal,normalize(vViewPosition)),0.,1.);
  float phase=(1.-ndv)*4.2+diffuseColor.b*.8;
  vec3 irid=.5+.5*cos(6.2831853*(phase+vec3(0.,.33,.67)));
  diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*(.6+.8*irid),.3*flankMask(vMapUv));
 }`;c&&(e.fragmentShader=e.fragmentShader.replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
`+c))},e.customProgramCacheKey=()=>`betta-macro-1.8-${n}-${r}-${i}-${o}`,e}var mh=new Ti(new Uint8Array([255,255,255,255]),1,1);mh.needsUpdate=!0;var hh={uLook:{value:new fn().fromArray([0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,-8])},uLookProfile:{value:mh},uLookCaudal:{value:mh}};function gh(e,{fin:t=!1,caudal:n=!1}={}){let r=e.onBeforeCompile,i=e.customProgramCacheKey();return e.onBeforeCompile=(e,i)=>{r(e,i),e.uniforms.uLook=hh.uLook,e.uniforms.uLookMap=n?hh.uLookCaudal:hh.uLookProfile,t&&(e.vertexShader=`varying vec2 vLookFin;
`+e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
vLookFin=finUV;`)),e.fragmentShader=`${t?`#define LOOK_FIN
varying vec2 vLookFin;
`:`#define LOOK_SKIN
`}uniform mat4 uLook;uniform sampler2D uLookMap;
// The rays as the band's edge follows them (one every 1/28 of the fin's width, as sculpted).
float lookRays(vec2 f){return smoothstep(.7,1.,sin(f.x*175.929));}
`+e.fragmentShader,e.fragmentShader=e.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
 float lookLum=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
 float lookCoat=0.;
 if(uLook[0].x>0.){
  diffuseColor.rgb=mix(diffuseColor.rgb,texture2D(uLookMap,vMapUv).rgb*pow(max(lookLum,1e-6),uLook[0].z)*uLook[0].y,uLook[0].x);
  #ifdef LOOK_FIN
  // The outer band: a crisp edge, the inner colour running a little further out along the rays,
  // the edge wandering along the fin.
  float band=smoothstep(-.012,.012,vLookFin.y-uLook[2].w-.045*lookRays(vLookFin)+.018*sin(vLookFin.x*37.)+.01*sin(vLookFin.x*103.+1.7));
  // (No whiter than white membrane: a pale band lit through from behind would bloom into a halo.)
  diffuseColor.rgb=mix(diffuseColor.rgb,min(uLook[2].xyz*lookLum,vec3(.62)),band);
  #else
  // The metallic coat over each flank scale's bright face, the base colour left at the edges; on
  // the head (closer here than in the bowl) a lighter coat, fading out toward the snout.
  float lookX=vMapUv.x*1536.;
  lookCoat=smoothstep(1.2,3.,lookLum*uLook[0].w+uLook[3].w)*mix(.55*smoothstep(160.,360.,lookX),1.,smoothstep(400.,465.,lookX));
  diffuseColor.rgb=mix(diffuseColor.rgb,uLook[3].xyz*min(pow(max(lookLum*uLook[0].w,1e-6),uLook[0].z),1.6),lookCoat);
  #endif
  // (No paler than white tissue: a platinum or pineapple fish facing the key light would bloom.)
  diffuseColor.rgb=min(diffuseColor.rgb,vec3(.7));
 }`),e.fragmentShader=e.fragmentShader.replace(`#include <metalnessmap_fragment>`,`#include <metalnessmap_fragment>
roughnessFactor=mix(roughnessFactor,.34,lookCoat);metalnessFactor=mix(metalnessFactor,.3,lookCoat);`),e.fragmentShader=e.fragmentShader.replace(`vec3 irid=.5+.5*cos(6.2831853*(phase+vec3(0.,.33,.67)));`,`vec3 irid=.5+.5*cos(6.2831853*(phase+vec3(0.,.33,.67)));
  if(uLook[0].x>0.)irid=mix(irid,uLook[1].xyz*(.3+1.4*irid),uLook[1].w);`)},e.customProgramCacheKey=()=>`${i}-look-${t}-${n}`,e}var _h=(e,t,n)=>Math.max(t,Math.min(n,e)),vh={strength:0,direction:`changing`};function yh(e,t,n,r,i,a,o){let s=0,c=0,l=0;switch(a){case`right`:s=1;break;case`left`:s=-1;break;case`front`:l=1;break;case`back`:l=-1;break;case`up`:c=1;break;case`down`:c=-1;break;default:s=Math.cos(e*.19),l=Math.sin(e*.19),c=.32*Math.sin(e*.31+.8)}let u=i*(.82+.18*Math.sin(e*.73));return o[0]=u*(s+.16*Math.sin(n*1.4+r*.7-e*1.1)),o[1]=u*(c+.12*Math.sin(r*1.2+t*.8+e*.83)),o[2]=u*(l+.17*Math.sin(t*1.6-n*.6-e*.91)),o}var bh={step:1/120,passScale:1,maxFrame:.07},xh=[.62,.68,.62],Sh=.12,Ch=1.05,wh=.6,Th=class{constructor({point:e,kind:t,side:n,columns:r=29,rows:i=17}){Object.assign(this,{kind:t,side:n,columns:r,rows:i}),this.count=r*i,this.rest=new Float32Array(this.count*3),this.roots=new Float32Array(r*3),this.position=new Float32Array(this.count*3),this.previous=new Float32Array(this.count*3),this.target=new Float32Array(this.count*3),this.lastTarget=new Float32Array(this.count*3),this.frameTarget=new Float32Array(this.count*3),this.displayTarget=new Float32Array(this.count*3),this.previousFlare=null,this.weights=new Float32Array(this.count),this.displacement=new Float32Array(this.count*4),this.accumulator=0,this.initialized=!1,this.steps=0,this.flow=[0,0,0],this.scratch=[0,0,0];for(let t=0;t<i;t++)for(let n=0;n<r;n++){let a=t*r+n,o=e(n/(r-1),t/(i-1));this.rest.set(o,a*3),t===0&&this.roots.set(o,n*3),this.weights[a]=t===0?0:.25+.75*t/(i-1)}let a=[],o=[],s=(e,t,n,r=!1)=>{let i=Math.hypot(...[0,1,2].map(n=>this.rest[e*3+n]-this.rest[t*3+n]));i>1e-5&&(a.push(e,t,i,n),o.push(+!!r))};for(let e=0;e<i;e++)for(let n=0;n<r;n++){let i=e*r+n;e&&s(i-r,i,.96),n&&s(i-1,i,t<3?.45:.65,!0),e&&n&&(s(i-r-1,i,t<3?.15:.22,!0),s(i-r,i-1,t<3?.15:.22,!0)),e>1&&s(i-r*2,i,t<3?.075:.12)}this.links=new Float32Array(a),this.folding=new Uint8Array(o),this.linkLengths=new Float32Array(o.length);let c=o.length;this.linkEnds=new Int32Array(c*2),this.linkTerms=new Float64Array(c*4);let l=[];for(let e=0;e<c;e++){let n=a[e*4],r=a[e*4+1];this.linkEnds[e*2]=n*3,this.linkEnds[e*2+1]=r*3,this.linkTerms.set([this.links[e*4+3],this.weights[n]+this.weights[r],this.weights[n],this.weights[r]],e*4),t<3&&o[e]?l.push(e):this.linkLengths[e]=this.links[e*4+2]}this.refolding=Int32Array.from(l),this.rayRest=new Float64Array(this.count),this.restOffset=new Float64Array(this.count*3),this.restAngle=new Float64Array(this.count),this.restSpan=new Float64Array(this.count);for(let e=0;e<i;e++)for(let t=0;t<r;t++){let n=e*r+t,i=n*3,a=i-r*3,o=t*3;e&&(this.rayRest[n]=Math.hypot(this.rest[i]-this.rest[a],this.rest[i+1]-this.rest[a+1],this.rest[i+2]-this.rest[a+2]));let s=this.rest[i]-this.roots[o],c=this.rest[i+1]-this.roots[o+1],l=this.rest[i+2]-this.roots[o+2];this.restOffset[i]=s,this.restOffset[i+1]=c,this.restOffset[i+2]=l,this.restAngle[n]=Math.atan2(c,s),this.restSpan[n]=Math.hypot(s,c)}this.rowStiffness=new Float64Array(i),this.rowTerms=new Float64Array(i*4),this.rootFrames=new Float64Array(r*4),this.carried=new Float64Array(this.count*3),this.carriedBy=null,this.carriedAt=-1}makeTargets(e){let{time:t,phase:n,drive:r,turn:i,flare:a,pectoralPhase:o,body:s}=e,c=s.turnBend??Math.tanh(i*.95),{columns:l,rows:u,kind:d,side:f,roots:p,target:m,scratch:h,restOffset:g,rowTerms:_}=this,v=d===0?.58:d===1?.55:.72,y=e.clamp??0,b=1-.6*y,x=(v+(1-v)*a-r*.12)*(1-(xh[d]??0)*y),S=d===0?.1*(1-a)+Sh*y:0,C=0,w=0;if(d===3){let t=o+(f<0?Math.PI:0),n=e.tuck??0,i=(.62+.36*(e.pectoralEffort??e.effort??r)+.05*(e.pectoralScull??e.scull??0))*(1-.25*n);for(let e=0;e<u;e++){let r=e/(u-1),a=f*(i*(.48*Math.sin(t)+.18*Math.sin(t-r*1.5)*r)-.12-.1*n),o=f*(.18+.72*Math.max(0,Math.cos(t)))*r;_[e*4]=Math.cos(a),_[e*4+1]=Math.sin(a),_[e*4+2]=Math.cos(o),_[e*4+3]=Math.sin(o)}}else if(d===4){let e=-.02-a*.16-r*.4+.055*Math.sin(n*.55+f)+Ch*y;C=Math.cos(e),w=Math.sin(e);for(let e=0;e<u;e++){let n=e/(u-1);_[e*4]=f*n*n*.035*Math.sin(t*1.2-n*2+f)}}for(let e=0;e<l;e++){let i=e/(l-1),o=e*3;s.pitchFrame(p[o],h);let f=h[1],v=h[2];s.frame(p[o],h);let T=h[2],E=h[3];s.transform(p[o],p[o+1],p[o+2],h);let D=h[0],O=h[1],k=h[2];for(let o=0;o<u;o++){let s=o/(u-1),p=o*l+e,h=p*3,A=g[h],j=g[h+1],M=g[h+2];if(d<3){let e=this.restAngle[p]*x-S,o=this.restSpan[p];A=o*Math.cos(e),j=o*Math.sin(e);let l=((d===0?(.012+r*.2)*Math.sin(n-2.5-s*.8):(.025+r*.13)*Math.sin(n*.8-i*3.7-s*.7+d*1.8)+c*(.2+i*.2))+(1-a*.7)*(.05+r*.095)*b*Math.sin(t*1.7-i*5.5-s*2.2+d*1.8))*(.22+.78*s),u=Math.hypot(A,j),f=Math.cos(l);if(A*=f,j*=f,M+=u*Math.sin(l),d===0){let e=c*.3*s,t=Math.cos(e),n=Math.sin(e),r=A*t-M*n;M=A*n+M*t,A=r}}else if(d===3){let e=A*_[o*4]-M*_[o*4+1];M=A*_[o*4+1]+M*_[o*4],A=e;let t=j*_[o*4+2]-M*_[o*4+3];M=j*_[o*4+3]+M*_[o*4+2],j=t}else{let e=A*C-j*w;j=A*w+j*C,A=e,M=M*(1-wh*y)+_[o*4]}let N=A*f-j*v;j=A*v+j*f,m[h]=D+N*T-M*E,m[h+1]=O+j,m[h+2]=k+N*E+M*T}}}advance(e,t){this.lastTarget.set(this.target);let n=e>0&&this.initialized&&this.kind<3&&Math.abs(t.flare-this.previousFlare)>1e-8;if(n&&(this.makeTargets({...t,flare:this.previousFlare}),this.displayTarget.set(this.target)),this.makeTargets(t),n)for(let e=this.columns*3;e<this.position.length;e++){let t=this.target[e]-this.displayTarget[e];this.position[e]+=t,this.previous[e]+=t,this.lastTarget[e]+=t}(e>0||!this.initialized)&&(this.previousFlare=t.flare),this.initialized||=(this.position.set(this.target),this.previous.set(this.target),this.lastTarget.set(this.target),!0),this.frameTarget.set(this.target),this.accumulator+=Math.min(e,bh.maxFrame);let r=bh.step,i=Math.floor((this.accumulator+1e-10)/r),a=0,{target:o,lastTarget:s,frameTarget:c}=this;for(;a<i;){let e=++a/i;for(let t=0;t<o.length;t++)o[t]=s[t]+(c[t]-s[t])*e;this.integrate(r,t),this.accumulator=Math.max(0,this.accumulator-r),this.steps++}if(o.set(c),!a&&this.steps)return;let{position:l,rest:u,scratch:d,displacement:f,carried:p}=this;for(let e=0;e<this.count;e++){t.body.transform(u[e*3],u[e*3+1],u[e*3+2],d);for(let t=0;t<3;t++)p[e*3+t]=d[t],f[e*4+t]=l[e*3+t]-d[t]}this.carriedBy=t.body,this.carriedAt=t.body.revision}integrate(e,t){let{position:n,previous:r,target:i,columns:a,rows:o,flow:s,linkLengths:c,linkEnds:l,linkTerms:u}=this,{heading:d,velocity:f,angularVelocity:p,origin:m,strength:h,direction:g,time:_,localHydrodynamics:v}=t,y=Math.cos(d),b=Math.sin(d),x=e*e,S=this.rowStiffness,C=t.clamp??0;for(let e=1;e<o;e++){let n=e/(o-1);S[e]=this.kind<3?3.8+36*(1-n)**2.4+t.flare*(5+22*(1-n)**2)+C*(6+20*(1-n)**2):(this.kind===4?2+12*C:5)+(this.kind===3?160:110)*(1-n)**3}for(let e=0;e<a*3;e++)n[e]=r[e]=i[e];for(let c=1;c<o;c++)for(let l=0;l<a;l++){let u=(c*a+l)*3,d=(c*a+Math.max(0,l-1))*3,C=(c*a+Math.min(a-1,l+1))*3,w=((c-1)*a+l)*3,T=(Math.min(o-1,c+1)*a+l)*3,E=n[C]-n[d],D=n[C+1]-n[d+1],O=n[C+2]-n[d+2],k=n[T]-n[w],A=n[T+1]-n[w+1],j=n[T+2]-n[w+2],M=D*j-O*A,N=O*k-E*j,P=E*A-D*k,F=Math.sqrt(M*M+N*N+P*P)||1;M/=F,N/=F,P/=F;let ee,te,I;if(v){let{flow:t,velocity:i,angular:a}=v;ee=t[0]-i[0]-(a[1]*n[u+2]-a[2]*n[u+1])-(n[u]-r[u])/e,te=t[1]-i[1]-(a[2]*n[u]-a[0]*n[u+2])-(n[u+1]-r[u+1])/e,I=t[2]-i[2]-(a[0]*n[u+1]-a[1]*n[u])-(n[u+2]-r[u+2])/e}else{let i=y*n[u]+b*n[u+2],a=-b*n[u]+y*n[u+2];if(t.externalFlow)for(let e=0;e<3;e++)s[e]=t.externalFlow[e];else yh(_,i+m[0],n[u+1]+m[1],a+m[2],h,g,s);let o=s[0]-f[0],c=s[2]-f[2];ee=y*o-b*c-p*n[u+2]-(n[u]-r[u])/e,te=s[1]-f[1]-(n[u+1]-r[u+1])/e,I=b*o+y*c+p*n[u]-(n[u+2]-r[u+2])/e}let ne=_h(ee*M+te*N+I*P,-2,2),re=ne*(2+Math.abs(ne)*3.5),ie=S[c],ae=M*re+ee*.9,oe=N*re+te*.9,L=P*re+I*.9,R=n[u],se=_h((i[u]-R)*ie+ae,-45,45);n[u]+=(R-r[u])*.982+se*x,r[u]=R,R=n[u+1],se=_h((i[u+1]-R)*ie+oe,-45,45),n[u+1]+=(R-r[u+1])*.982+se*x,r[u+1]=R,R=n[u+2],se=_h((i[u+2]-R)*ie+L,-45,45),n[u+2]+=(R-r[u+2])*.982+se*x,r[u+2]=R}for(let e=0;e<this.refolding.length;e++){let t=this.refolding[e],n=l[t*2],r=l[t*2+1];c[t]=Math.hypot(i[r]-i[n],i[r+1]-i[n+1],i[r+2]-i[n+2])}let w=Math.max(3,Math.round((this.kind===3?12:8)*bh.passScale)),T=c.length;for(let e=0;e<w;e++){if(this.kind===3&&e<4)for(let e=1;e<o;e++){let t=_h((e/(o-1)-.22)/.55,0,1),r=.5*(1-t*t*(3-2*t));for(let t=0;t<a;t++)for(let o=0;o<3;o++){let s=(e*a+t)*3+o;n[s]+=(i[s]-n[s])*r}}let t=e%2==1;for(let e=0;e<T;e++){let r=t?T-1-e:e,i=l[r*2],a=l[r*2+1],o=n[a]-n[i],s=n[a+1]-n[i+1],d=n[a+2]-n[i+2],f=Math.sqrt(o*o+s*s+d*d),p=u[r*4+1];if(f<1e-7||!p)continue;let m=(f-c[r])/f*u[r*4]/p,h=m*u[r*4+2],g=m*u[r*4+3];n[i]+=o*h,n[i+1]+=s*h,n[i+2]+=d*h,n[a]-=o*g,n[a+1]-=s*g,n[a+2]-=d*g}}if(this.kind!==3)for(let e=1;e<o;e++)for(let t=0;t<a;t++){let r=e*a+t,i=r*3,o=i-a*3,s=n[i]-n[o],c=n[i+1]-n[o+1],l=n[i+2]-n[o+2],u=Math.hypot(s,c,l),d=this.rayRest[r];if(u>1e-7&&d>1e-7){let e=_h(u,d*.94,d*1.06)/u;n[i]=n[o]+s*e,n[i+1]=n[o+1]+c*e,n[i+2]=n[o+2]+l*e}}if(t.bodyRadius&&this.side){let e=this.rootFrames,i=this.scratch;for(let n=0;n<a;n++)t.body.frame(this.roots[n*3],i),e[n*4]=i[0],e[n*4+1]=i[1],e[n*4+2]=i[2],e[n*4+3]=i[3];for(let o=a;o<this.count;o++){let s=o*3,c=o%a,l=this.roots[c*3],u=e[c*4],d=e[c*4+1],f=e[c*4+2],p=e[c*4+3],m=l+(n[s]-u)*f+(n[s+2]-d)*p,h=t.bodyRadius(m,n[s+1]-t.body.pitchFrame(m,i)[0]);t.body.frame(m,i);let g=i[0],_=i[1],v=i[2],y=i[3],b=-(n[s]-g)*y+(n[s+2]-_)*v;if(h>0&&b*this.side<h+.009){let e=this.side*(h+.009)-b;n[s]-=y*e,n[s+2]+=v*e,r[s]=n[s],r[s+2]=n[s+2]}}}}metrics(){let e=0,t=0,n=0;for(let t=0;t<this.count;t++)if(e=Math.max(e,Math.hypot(...this.displacement.subarray(t*4,t*4+3))),t<this.columns)for(let e=0;e<3;e++)n=Math.max(n,Math.abs(this.position[t*3+e]-this.target[t*3+e]));for(let e=this.columns;e<this.count;e++){let n=(e-this.columns)*3,r=e*3,i=Math.hypot(...[0,1,2].map(e=>this.rest[n+e]-this.rest[r+e]));i>.005&&(t=Math.max(t,Math.abs(Math.hypot(...[0,1,2].map(e=>this.position[n+e]-this.position[r+e]))/i-1)))}return{kind:this.kind,side:this.side,maxDisplacement:e,maxRayStrain:t,anchorError:n,steps:this.steps}}},Eh=(e,t,n)=>Math.max(t,Math.min(n,e)),Dh=(e,t,n)=>{let r=Eh((n-e)/(t-e),0,1);return r*r*(3-2*r)},Oh=3.8,kh=e=>.006+e*.24,Ah=e=>.5+2.3*e,jh=Ah(1)*kh(1),Mh=class{constructor(){this.effort=this.tailEffort=this.phase=this.pectoralPhase=this.breathPhase=0,this.scull=this.tuck=this.tuckRate=0,this.pectoralEffort=this.pectoralScull=0,this.bodyHz=Ah(0),this.pectoralHz=1.6}advance(e,t,n,r=0,i={}){if(e<=0)return;this.scull+=((i.scull??0)-this.scull)*(1-Math.exp(-5*e));{let t=i.tuck?11:4.5,n=this.tuck-(i.tuck??0),r=this.tuckRate+t*n,a=Math.exp(-t*e);this.tuck=Eh((i.tuck??0)+(n+r*e)*a,0,1),this.tuckRate=(this.tuckRate-t*r*e)*a}let a=Dh(.065,.4,t),o=Eh(n*1.05,0,1),s=Eh(a*.82+o*.92+Math.abs(r)*.12,0,1);this.effort+=(s-this.effort)*(1-Math.exp(-3*e));let c=Eh(a*.82+Eh(n*.45,0,1)*.92+Math.abs(r)*.12,0,1);this.tailEffort+=(c-this.tailEffort)*(1-Math.exp(-3*e)),this.bodyHz=Ah(this.tailEffort),this.pectoralEffort+=(this.effort-this.pectoralEffort)*(1-Math.exp(-1.1*e)),this.pectoralScull+=(this.scull-this.pectoralScull)*(1-Math.exp(-2.2*e));let l=2.8+1.8*this.pectoralEffort;this.pectoralHz=l+(Math.max(l,Oh)-l)*this.pectoralScull,this.phase+=e*Math.PI*2*this.bodyHz,this.pectoralPhase+=e*Math.PI*2*this.pectoralHz,this.breathPhase+=e*(3.6+this.effort*3.4)}get stroke(){return Eh(Math.max(this.bodyHz*kh(this.tailEffort)/jh,.15*this.scull),0,1)}},Nh=(e,t,n)=>Math.max(t,Math.min(n,e)),Ph=(e,t,n)=>{let r=Nh((n-e)/(t-e),0,1);return r*r*(3-2*r)},Fh=-1.22,Ih=Math.PI,Lh=.5,Rh=class{constructor(){this.texels=new Float32Array(1288),this.data=this.texels.subarray(0,644),this.pitchData=this.texels.subarray(644),this.turnAngles=this.pitchAngles=null,this.mouth=this.gill=0,this.revision=0,this.update(0,0,0,0)}advanceTurn(e,t,n){if(this.turnAngles??=new Float64Array(25),!(e>0))return;let r=this.turnAngles,i=2.276/(r.length-1),a=Math.min(e,.07);for(;a>1e-9;){let e=Math.min(a,1/120),o=.1+Math.min(2.5,Math.abs(n)),s=1-Math.exp(-o*e/i),c=Math.exp(-e*(Math.abs(t)>.15?.12:1.5));for(let n=r.length-1;n>0;n--)r[n]=Nh((r[n]+t*e)*c,-Ih,Ih),r[n]+=(r[n-1]-r[n])*s;for(let e=1;e<r.length;e++)r[e]=Nh(r[e],r[e-1]-i*1.65,r[e-1]+i*1.65);a-=e}}advancePitch(e,t,n){if(this.pitchAngles??=new Float64Array(25),!(e>0))return;let r=this.pitchAngles,i=2.276/(r.length-1),a=Math.min(e,.07);for(;a>1e-9;){let e=Math.min(a,1/120),o=1-Math.exp(-(.1+Math.min(2.5,Math.abs(n)))*e/i),s=Math.exp(-e*(Math.abs(t)>.1?.15:.5));for(let n=r.length-1;n>0;n--)r[n]=Nh((r[n]+t*e)*s,-.5,Lh),r[n]+=(r[n-1]-r[n])*o;for(let e=1;e<r.length;e++)r[e]=Nh(r[e],r[e-1]-i*.5,r[e-1]+i*.5);a-=e}}update(e,t,n,r,i=0,a=0){this.revision++,this.effort=t,this.turnBend=this.turnAngles?Nh(this.turnAngles.at(-1)/2.95,-1,1):Math.tanh(n*.8),this.mouth=Math.max(i,Math.max(0,Math.sin(r))**1.4*(.8+t*.2)),this.gill=Math.max(a,Math.max(0,Math.sin(r-1.05))**1.3*(.8+t*.2));let o=3.87/160,s=Fh,c=0,l=0,u=1,d=0,f=1,p=0,m=this.data,h=this.pitchData,g=this.pitchAngles;for(let n=0;n<161;n++){let r=Nh((Fh+n*o+1.22)/2.276,0,1),i=Ph(0,.3,r)*(.3+.7*r),a=Ph(.03,1,r)*this.turnBend*2.95;if(this.turnAngles){let e=r*(this.turnAngles.length-1),t=Math.floor(e),n=Math.min(t+1,this.turnAngles.length-1);a=this.turnAngles[t]+(this.turnAngles[n]-this.turnAngles[t])*(e-t)}let _=a+i*kh(t)*(1-Math.abs(a)/3.2)*Math.sin(e-r*4.4),v=0;if(g){let e=r*(g.length-1),t=Math.floor(e),n=Math.min(t+1,g.length-1);v=g[t]+(g[n]-g[t])*(e-t)}let y=Math.cos(_),b=Math.sin(_),x=Math.cos(v),S=Math.sin(v);n&&(s+=o*(u*f+y*x)*.5,c+=o*(d*f+b*x)*.5,l+=o*(p+S)*.5),m[n*4]=s,m[n*4+1]=c,m[n*4+2]=y,m[n*4+3]=b,h[n*4]=l,h[n*4+1]=x,h[n*4+2]=S,u=y,d=b,f=x,p=S}}frame(e,t){if(e<=-1.22)return t[0]=e,t[1]=0,t[2]=1,t[3]=0,t;let n=Nh((e-Fh)/3.87,0,1)*160,r=Math.floor(n),i=Math.min(r+1,160),a=n-r;for(let e=0;e<4;e++)t[e]=this.data[r*4+e]*(1-a)+this.data[i*4+e]*a;return t}pitchFrame(e,t){if(e<=-1.22)return t[0]=0,t[1]=1,t[2]=0,t;let n=Nh((e-Fh)/3.87,0,1)*160,r=Math.floor(n),i=Math.min(r+1,160),a=n-r;for(let e=0;e<3;e++)t[e]=this.pitchData[r*4+e]*(1-a)+this.pitchData[i*4+e]*a;return t}transform(e,t,n,r){this.pitchFrame(e,r);let i=r[0],a=r[1],o=r[2];this.frame(e,r);let s=r[0],c=r[1],l=r[2],u=r[3],d=Math.exp(-(((e+1.03)/.17)**2)-((t+.01)/.29)**2);n+=Math.sign(n)*d*(.004+.018*this.gill);let f=1-Ph(-1.68,-1.48,e),p=1-Ph(-1.67,-1.28,e);t=.0832+(t-.0832)*(1-f*(.78-.78*this.mouth)),t-=p*(1-Ph(.045,.105,t))*(.003+.047*this.mouth);let m=-t*o;return r[0]=s+m*l-n*u,r[1]=i+t*a,r[2]=c+m*u+n*l,r}},zh=`
uniform sampler2D uSpine;
uniform float uMouth,uGill;
vec4 spineFrame(float x) {
 if(x<=${Fh}) return vec4(x,0.,1.,0.);
 float g=clamp((x-(${Fh}))/3.87,0.,1.)*160.;
 int a=int(floor(g)), b=min(a+1,160);
 return mix(texelFetch(uSpine,ivec2(a,0),0),texelFetch(uSpine,ivec2(b,0),0),fract(g));
}
vec4 spinePitch(float x) {
 if(x<=${Fh}) return vec4(0.,1.,0.,0.);
 float g=clamp((x-(${Fh}))/3.87,0.,1.)*160.;
 int a=int(floor(g)), b=min(a+1,160);
 return mix(texelFetch(uSpine,ivec2(a,1),0),texelFetch(uSpine,ivec2(b,1),0),fract(g));
}
vec3 swim(vec3 p) {
 vec4 f=spineFrame(p.x), v=spinePitch(p.x);
 float cheek=exp(-pow((p.x+1.03)/.17,2.)-pow((p.y+.01)/.29,2.));
 p.z+=sign(p.z)*cheek*(.004+.018*uGill);
 float lip=1.-smoothstep(-1.68,-1.48,p.x),jaw=1.-smoothstep(-1.67,-1.28,p.x);
 p.y=.0832+(p.y-.0832)*(1.-lip*(.78-.78*uMouth));
 p.y-=jaw*(1.-smoothstep(.045,.105,p.y))*(.003+.047*uMouth);
 float along=-p.y*v.z;
 return vec3(f.x+along*f.z-p.z*f.w,v.x+p.y*v.y,f.y+along*f.w+p.z*f.z);
}
`,Bh=class{constructor(){this.flare=0,this.requested=!1,this.target=!1,this.from=0,this.elapsed=1,this.clamp=0}advance(e){if(e<=0)return;this.requested!==this.target&&(this.target=this.requested,this.from=this.flare,this.elapsed=0),this.elapsed=Math.min(1,this.elapsed+e/(this.target?1:.35));let t=this.elapsed,n=t*t*(3-2*t);this.flare=this.from+(+!!this.target-this.from)*n}},Vh=class{constructor(){this.time=0,this.yaw=0,this.pitch=0}advance(e,t=0,n=0){if(e<=0)return;this.time+=e;let r=this.time,i=Math.floor(r/2.35),a=r%2.35,o=e=>[Math.sin(e*2.399+.35)*.24,Math.sin(e*1.73+.6)*.13],s=o(i),c=o(i+1),l=Math.max(0,Math.min(1,(a-2.18)/.17)),u=l*l*(3-2*l),d=(s[0]+(c[0]-s[0])*u)*(1-n*.65)-n*.13-Math.max(-.04,Math.min(.04,t*.04)),f=(s[1]+(c[1]-s[1])*u)*(1-n*.65),p=1-Math.exp(-35*e);this.yaw+=(d-this.yaw)*p,this.pitch+=(f-this.pitch)*p}},Hh=(e,t,n)=>Math.max(t,Math.min(n,e)),Uh=(e,t,n)=>{let r=Hh((n-e)/(t-e),0,1);return r*r*(3-2*r)},Wh=1.5,Gh=.03,Kh=.85,qh=16,Jh=[1.4,4.2],Yh=4.5,Xh=[6.4,9.2],Zh=e=>1.1*(Uh(0,.28,e)-Uh(.62,.95,e)),Qh=e=>Math.sin(Math.PI*Hh((e-.8)/.8,0,1))**1.2;function $h(e,t){if(!e)return{mouth:0,gill:0,phase:`none`,clock:-1};let n=Uh(.9,1,t),r=e.phase===`gulp`&&t>=.95;return{mouth:e.mouth*n,gill:e.gill*n,phase:e.phase===`gulp`&&!r?`hold`:e.phase,clock:r?e.clock:-1}}function eg(e){let t=(e%96+96)%96-qh;if(t<Jh[0]||t>=Xh[1])return{lift:0,clock:-1,mouth:0,gill:0,swim:0,phase:`none`};if(t<Jh[1]){let e=(t-Jh[0])/(Jh[1]-Jh[0]);return{lift:Uh(0,1,e),clock:-1,mouth:0,gill:0,swim:Math.sin(Math.PI*e),phase:`rise`}}if(t<Xh[0]){let e=t-Yh,n=e>=0&&e<1.6;return{lift:1,clock:n?e:-1,mouth:n?Zh(e):0,gill:n?Qh(e):0,swim:0,phase:n?`gulp`:`hold`}}let n=(t-Xh[0])/(Xh[1]-Xh[0]);return{lift:1-Uh(0,1,n),clock:-1,mouth:0,gill:0,swim:Math.sin(Math.PI*n),phase:`dive`}}var tg=Math.PI,ng=Vt.lerp,rg=Vt.clamp,ig=.0032,ag={hover:{scull:1},surface:{scull:1},gulp:{scull:1},rise:{scull:.7},dive:{scull:.5},glide:{scull:.3},startle:{tuck:1},mirror:{scull:1},lap:{scull:.15},rest:{scull:.25}},og=([e,t])=>[(e-680)*ig,(420-t)*ig],sg=([e,t])=>[e/1536,1-t/1024],cg={uTime:{value:0},uFlare:{value:0},uMotion:{value:1},uPhase:{value:0},uDrive:{value:.12},uTurn:{value:0},uFold:{value:0},uSpine:{value:null},uMouth:{value:0},uGill:{value:0}},lg=`uniform float uTime,uFlare,uMotion,uPhase,uDrive,uTurn,uFold;
`+zh;function ug(e,t=null,n=!1){return e.userData.bettaDeform={dynamics:t,operculum:n},e.onBeforeCompile=e=>{Object.assign(e.uniforms,cg),t&&(e.uniforms.uFinDisplacement={value:t.texture},e.uniforms.uFinGrid={value:new K(t.columns,t.rows)}),e.vertexShader=lg+(n?`attribute float coverLift;
`:``)+(t?`
attribute vec2 finUV;
uniform sampler2D uFinDisplacement;
uniform vec2 uFinGrid;
// Explicit bilinear interpolation works without float-linear texture extensions.
vec3 wetFin(vec2 uv) {
  vec2 grid=clamp(uv,0.,1.)*(uFinGrid-1.);
  ivec2 a=ivec2(floor(grid)), b=min(a+ivec2(1),ivec2(uFinGrid)-1);
  vec2 f=fract(grid);
  return mix(mix(texelFetch(uFinDisplacement,a,0).xyz,texelFetch(uFinDisplacement,ivec2(b.x,a.y),0).xyz,f.x),
             mix(texelFetch(uFinDisplacement,ivec2(a.x,b.y),0).xyz,texelFetch(uFinDisplacement,b,0).xyz,f.x),f.y);
}
`:``)+e.vertexShader,e.vertexShader=e.vertexShader.replace(`#include <project_vertex>`,`vec3 anatomical=transformed;${n?`anatomical.z+=coverLift*(uGill*.046+uFlare*.085);`:``}
       vec4 mvPosition=vec4(swim(anatomical)${t?`+wetFin(finUV)`:``},1.);
       mvPosition=modelViewMatrix*mvPosition;gl_Position=projectionMatrix*mvPosition;`),e.fragmentShader=e.fragmentShader.replace(`#include <normal_fragment_begin>`,`#include <normal_fragment_begin>
normal=normalize(cross(dFdx(vViewPosition),dFdy(vViewPosition)))*faceDirection;`)},e.customProgramCacheKey=()=>`wet-betta-1.6-${!!t}-${n}`,e}var dg=[[155,387,401,8],[175,378,429,19],[200,369,456,32],[240,351,482,47],[300,327,500,68],[360,307,517,84],[420,290,528,86],[500,280,528,80],[580,278,521,72],[660,283,513,64],[740,309,506,55],[820,342,501,45],[900,371,492,33],[960,392,482,26],[1010,409,471,20]];function fg(e,t=[0,0,0,0]){let n=0;for(;n<dg.length-2&&dg[n+1][0]<e;)n++;let r=dg[n],i=dg[n+1],a=rg((e-r[0])/(i[0]-r[0]),0,1),o=dg[Math.max(0,n-1)],s=dg[Math.min(dg.length-1,n+2)];t[0]=e;for(let e=1;e<4;e++){let n=i[0]-r[0],c=(i[e]-o[e])/(i[0]-o[0])*n,l=(s[e]-r[e])/(s[0]-r[0])*n;t[e]=(2*a**3-3*a*a+1)*r[e]+(a**3-2*a*a+a)*c+(-2*a**3+3*a*a)*i[e]+(a**3-a*a)*l}return t}function pg(e=!1){let t=[],n=[],r=[],i=e?64:220,a=e?24:96;for(let e=0;e<=i;e++){let r=ng(155,1010,e/i),[,o,s,c]=fg(r),l=(o+s)/2;for(let e=0;e<=a;e++){let i=e/a*2*tg,u=l+(s-o)*.5*Math.cos(i),[d,f]=og([r,u]);t.push(d,f,Math.sin(i)*c*ig);let p=l+(s-o)*Math.asin(Math.cos(i))/tg,m=Vt.smoothstep(r,390,520)*.85;n.push(...sg([r,ng(u,p,m)]))}}for(let e=0;e<i;e++)for(let t=0;t<a;t++){let n=e*(a+1)+t,i=n+a+1;r.push(n,i,n+1,i,i+1,n+1)}for(let e of[i]){let i=e?1010:155,[,o,s]=fg(i),[c,l]=og([i,(o+s)/2]),u=t.length/3;t.push(c,l,0),n.push(...sg([i,(o+s)/2]));for(let t=0;t<a;t++){let n=e*(a+1)+t;e?r.push(u,n+1,n):r.push(u,n,n+1)}}let o=new Jr;return o.setAttribute(`position`,new Ir(t,3)),o.setAttribute(`uv`,new Ir(n,2)),o.setIndex(r),o.computeVertexNormals(),o}function mg(e,t){let n=(e,t,n,r=null)=>{let i=new Jr;return i.setAttribute(`position`,new Ir(e,3)),i.setAttribute(`uv`,new Ir(t,2)),r&&i.setAttribute(`coverLift`,new Ir(r,1)),i.setIndex(n),i.computeVertexNormals(),i},r=ug(new ma({color:1051148,roughness:.82,side:2})),i=e.userData.compact,a=[],o=[],s=[],c=i?4:12,l=i?24:64;for(let e=0;e<=c;e++)for(let t=0;t<=l;t++){let n=e/c,r=t/l*tg*2;if(a.push(-1.68+n*.15,.0832+ng(.0224,.012,n)*Math.cos(r),ng(.0256,.012,n)*Math.sin(r)),o.push(t/l,n),e<c&&t<l){let n=e*(l+1)+t;s.push(n,n+1,n+l+1,n+1,n+l+2,n+l+1)}}let u=a.length/3;a.push(-1.53,.0832,0),o.push(.5,.5);for(let e=0;e<l;e++)s.push(u,c*(l+1)+e,c*(l+1)+e+1);let d=new Si(n(a,o,s),r);d.name=`Recessed breathing mouth`,e.add(d);let f=[],p=[],m=[],h=i?4:10;for(let e=0;e<=l;e++)for(let t=0;t<=h;t++){let n=e/l*tg*2,r=t/h*tg*2,i=.0028,a=-1.68+i*Math.sin(r),o=.0832+(.0224+i*Math.cos(r))*Math.cos(n),s=(.0256+i*Math.cos(r))*Math.sin(n);if(f.push(a,o,s),p.push(...sg([a/ig+680,420-o/ig])),e<l&&t<h){let n=e*(h+1)+t;m.push(n,n+h+1,n+1,n+1,n+h+1,n+h+2)}}let g=new Si(n(f,p,m),t);g.name=`Flexible upper and lower lips`,e.add(g);for(let a of[-1,1]){let o=[],s=[],c=[],l=[],u=[],d=[],f=[],p=i?20:60,m=i?8:24;for(let e=0;e<=p;e++){let t=e/p,n=Math.sin(tg*t),r=ng(332,502,t),i=330+12*n,h=330+76*n,g=(e,t)=>{let[,n,i,o]=fg(e),s=(r-(n+i)/2)/((i-n)/2);return a*(o*ig*Math.sqrt(Math.max(0,1-s*s))+t)};for(let t=0;t<=m;t++){let u=t/m,d=ng(i,h,u),[f,_]=og([d,r]);if(o.push(f,_,g(d,.0025)),s.push(...sg([d,r])),l.push(a*u*u*n**.7),e<p&&t<m){let n=e*(m+1)+t;c.push(n,n+1,n+m+1,n+1,n+m+2,n+m+1)}}for(let e=0;e<2;e++){let i=h-(e?0:5*n),[a,o]=og([i,r]);u.push(a,o,g(i,.001)),d.push(t,e)}if(e<p){let t=e*2;f.push(t,t+1,t+2,t+1,t+3,t+2)}}if(a>0)for(let e=0;e<c.length;e+=3)[c[e+1],c[e+2]]=[c[e+2],c[e+1]];let h=gh(ph(ug(t.clone(),null,!0),e.userData.macroTextures));h.side=2;let g=new Si(n(o,s,c,l),h);g.name=`Hinged operculum ${a>0?`left`:`right`}`,e.add(g);let _=new Si(n(u,d,f),r);_.name=`Gill outlet ${a}`,e.add(_)}}function hg(e,t){let n=rg(t,0,1)*(e.length-1),r=Math.min(e.length-2,Math.floor(n)),i=n-r,a=e[Math.max(0,r-1)],o=e[r],s=e[r+1],c=e[Math.min(e.length-1,r+2)];return o.map((e,t)=>.5*(2*e+(-a[t]+s[t])*i+(2*a[t]-5*e+4*s[t]-c[t])*i*i+(-a[t]+3*e-3*s[t]+c[t])*i*i*i))}var gg=[[361,523],[378,529],[400,534]],_g=[[369,543],[385,610],[403,685],[444,775],[483,860],[535,917]],vg=[[397,439],[399,454],[401,468]],yg=[[410,406],[445,393],[482,400],[504,430],[505,467],[493,500],[461,525],[435,524]],bg=.045,xg=.19,Sg=.014;function Cg(e){let[,t,n,r]=fg(e[0]),i=Math.sqrt(Math.max(0,1-(bg/(r*ig))**2));return[e[0],(t+n)/2+(n-t)/2*i-Sg/ig]}function wg(e,t,n,r,i,a){let o=hg(e,i),s=hg(t,i),c=n===4?Cg(o):o,l=a*(1-.004*(.5+.5*Math.sin(i*tg*142))-.002*(.5+.5*Math.sin(i*tg*57))),[u,d]=og([ng(c[0],s[0],l),ng(c[1],s[1],l)]),f=Math.sin(i*tg*56)*.006+Math.sin(i*tg*9+a*3)*.055,p=a**1.5*f;n===3?p=r*(.267+a*.19)+a*.006*Math.sin(i*70):n===4&&(p=r*ng(bg,xg,a)+a*f*.4);let[m,h]=og(c);return{x:u,y:d,z:p,rx:m,ry:h,rz:n===3?r*.267:n===4?r*bg:0,px:ng(o[0],s[0],l),py:ng(o[1],s[1],l),vv:l}}function Tg(e,t,n,r,i=0,a=0,o=null){let s=[],c=[],l=[],u=[],d=[],f=e.userData.compact?28:180,p=e.userData.compact?16:52;for(let e=0;e<=f;e++){let t=e/f;for(let e=0;e<=p;e++){let d=e/p,{x:f,y:m,z:h,rx:g,ry:_,rz:v,px:y,py:b,vv:x}=wg(n,r,i,a,t,d);if(s.push(f,m,h),u.push(g,_,v),o){let e=hg(o.roots,t),n=hg(o.edge,t);c.push(ng(e[0],n[0],x)/o.width,1-ng(e[1],n[1],x)/o.height)}else c.push(...sg([y,b]));l.push(t,d)}}for(let e=0;e<f;e++)for(let t=0;t<p;t++){let n=e*(p+1)+t,r=n+p+1;d.push(n,r,n+1,r,r+1,n+1)}let m=new Jr;for(let[e,t,n]of[[`position`,s,3],[`uv`,c,2],[`finUV`,l,2],[`root`,u,3]])m.setAttribute(e,new Ir(t,n));m.setIndex(d),m.computeVertexNormals();let h=new Th({kind:i,side:a,point(e,t){let{x:o,y:s,z:c}=wg(n,r,i,a,e,t);return[o,s,c]}});h.texture=new Ti(h.displacement,h.columns,h.rows,O,y),h.texture.needsUpdate=!0,e.userData.finDynamics.push(h);let g=ug(new ma({map:t,color:16777215,side:2,roughness:.76,metalness:0,clearcoat:.08,clearcoatRoughness:.6,iridescence:.06,iridescenceThicknessRange:[180,260],transparent:!0,opacity:i===3?.7:.94,depthWrite:!0,bumpMap:t,bumpScale:.006}),h),_=new Si(m,gh(i<3?ph(g,e.userData.macroTextures,{fin:!0,caudal:i===0}):g,{fin:!0,caudal:i===0}));return _.frustumCulled=!1,_.userData.kind=i,_.name=[`Caudal`,`Dorsal`,`Anal`,`Pectoral`,`Pelvic`][i]+(a?a>0?` left`:` right`:``),e.add(_),_}function Eg({compact:e=!1,textures:t=!0}={}){let n=new Bn;n.userData.compact=e;let r=(e,n,r)=>t?new Ja().load(e,n,void 0,r):(n(),new on),i=[],a=new Rh,o=new Ti(a.texels,161,2,O,y);o.needsUpdate=!0,cg.uSpine.value=o,n.userData.finDynamics=i,n.name=`Betta splendens — volumetric reference-textured specimen`;let s,c,l=new Promise((e,t)=>{s=e,c=t}),u=r(`https://media.jez237.com/demos/betta-atelier/references/2026-10-22/01-profile.jpg?v=69e062016b32`,()=>s(),c);u.colorSpace=ze,u.anisotropy=8;let d,f,p=new Promise((e,t)=>{d=e,f=t}),m=r(`https://media.jez237.com/demos/betta-atelier/references/2026-10-22/03-fin-material.jpg?v=11641b5eba25`,()=>d(),f);m.colorSpace=ze,m.anisotropy=8;let h=[],g={"04-head-macro":`https://media.jez237.com/demos/betta-atelier/macro-v1.2/04-head-macro.jpg?v=73e1f70901a5`,"05-scale-macro":`https://media.jez237.com/demos/betta-atelier/macro-v1.2/05-scale-macro.jpg?v=63089308e453`,"06-membrane-macro":`https://media.jez237.com/demos/betta-atelier/macro-v1.2/06-membrane-macro.jpg?v=684f8aabab14`},_=e=>{let t,n;h.push(new Promise((e,r)=>{t=e,n=r}));let i=r(g[e],t,n);return i.colorSpace=ze,i.anisotropy=8,i},v={head:_(`04-head-macro`),scales:_(`05-scale-macro`),fin:_(`06-membrane-macro`)};n.userData.macroTextures=v;let b=gh(ph(ug(new ma({map:u,color:16777215,metalness:.03,roughness:.72,clearcoat:.06,clearcoatRoughness:.35,iridescence:.08,iridescenceThicknessRange:[190,300],bumpMap:u,bumpScale:.011})),v)),x=new Si(pg(e),b);x.name=`Arc-length muscular trunk with open buccal cavity`,n.add(x),mg(n,b),Tg(n,m,[[1e3,402],[1006,420],[1008,444],[1005,463],[995,478]],[[1078,45],[1100,43],[1137,40],[1197,76],[1250,126],[1302,181],[1351,241],[1380,302],[1396,370],[1410,436],[1398,507],[1387,579],[1370,646],[1340,706],[1301,762],[1244,808],[1180,844],[1116,864],[1054,836]],0,0,{width:1225,height:1284,roots:[[500,472],[505,490],[508,510],[507,535],[500,553]],edge:[[651,55],[717,52],[789,69],[856,105],[914,159],[977,193],[1034,244],[1094,298],[1140,369],[1162,445],[1167,531],[1165,624],[1155,710],[1132,784],[1078,848],[1018,922],[955,1013],[857,1080],[755,1138]]}),Tg(n,u,[[620,282],[648,282],[675,288],[708,300],[735,315]],[[624,272],[657,196],[705,126],[772,89],[841,64],[918,66],[985,72],[1047,76],[1043,123],[1027,180],[1022,239],[1006,299],[981,347]],1),Tg(n,u,[[451,524],[510,525],[595,516],[680,509],[765,502],[850,498],[928,486],[991,476]],[[454,537],[504,571],[552,679],[602,768],[665,820],[736,863],[808,916],[878,946],[948,956],[1022,942],[1070,919],[1043,874],[1002,780],[984,641],[991,479]],2);let S=[],C=[],w=new Bh,T=new Vh;for(let t of[-1,1]){Tg(n,u,gg,_g,4,t),S.push(Tg(n,u,vg,yg,3,t));let r=new ea(.083,e?20:48,e?12:32),i=r.attributes.position,a=r.attributes.uv;for(let e=0;e<i.count;e++)a.setXY(e,(240+i.getX(e)/ig)/1536,1-(400-i.getY(e)/ig)/1024);let o=new Si(r,ph(new ma({map:u,bumpMap:u,bumpScale:5e-4,roughness:.48,metalness:0,clearcoat:.06,clearcoatRoughness:.15,envMapIntensity:.025}),v,{eye:!0})),[s,c]=og([240,400]),l=new Bn;l.name=`Eye socket pivot ${t}`,l.position.set(s,c,t*.12);let d=T;C.push({pivot:l,motion:d,side:t}),o.position.set(0,0,t*.02),o.scale.set(1,1,.5),l.add(o);let f=new Si(new ea(.045,e?16:40,e?10:28),new ma({color:66308,roughness:.22,clearcoat:.06,envMapIntensity:.025}));f.scale.z=.1,f.position.set(0,.006,t*.063),l.add(f),n.add(l)}let E=new Mh,D=0,k=vh.strength,A=.045,j=.12,M=.3,N=0,P=0,F=0,ee=0,te=0,I=[0,0,0,0],ne=new q,re=[0,0,0,0];return n.userData={ready:Promise.all([l,p,...h]),macroTextures:v,scaleCount:0,finCount:7,revision:`1.13`,gulp:{lift:0,phase:`none`,clock:-1,lip:[0,0,0],surfaceY:Wh},display:w,eyes:C,gait:E,bodyMotion:a,finDynamics:i,water:vh,mode:`hover`,update(e,t=!1){let r=rg(e-D,0,.07);D=e,w.advance(r),cg.uFlare.value=w.flare,T.advance(r,P,w.flare);for(let{pivot:e,motion:t,side:n}of C)e.rotation.set(-t.pitch*n,t.yaw*n,0);cg.uTime.value=e;let s=e%32,c=.045,l=.12,u=0,d=0,f=`hover`,p=(e,t,n)=>Vt.smoothstep(n,e,t);if(s<10)u=.3,d=.004*Math.sin(e*.8);else if(s<13){let e=p(10,13,s);c=.36*Math.sin(tg*e)+.07,u=ng(.3,-.38,e),d=ng(0,.09,e),l=.12-.13*Math.sin(tg*e),f=`glide`}else if(s<16){let e=p(13,16,s);u=-.38,d=.09,l=.12+tg*e,c=.07+.12*Math.sin(tg*e),f=`turn`}else if(s<26)u=-.38,d=.09,l=tg+.12,c=.045,f=`hover`;else if(s<29){let e=p(26,29,s);u=ng(-.38,.3,e),d=ng(.09,-.03,e),l=tg+.12-.12*Math.sin(tg*e),c=.32*Math.sin(tg*e)+.07,f=`glide`}else{let e=p(29,32,s);u=.3,d=ng(-.03,0,e),l=tg+.12+tg*e,c=.07+.12*Math.sin(tg*e),f=`turn`}t&&(u=0,d=0,l=.1,c=.045,f=`hover`);let m=n.userData.locomotion,h=m||t?null:eg(e);F=Vt.damp(F,h?h.lift:0,6,r),F<1e-4&&!h?.lift&&(F=0);let g=$h(h,F);ee=Vt.damp(ee,g.mouth,25,r),te=Vt.damp(te,g.gill,25,r),h&&h.phase!==`none`&&(c+=.14*h.swim,f=`surface`),m&&(c=m.drive,f=m.mode),A=Vt.damp(A,c,3,r);let _=j;j+=Math.atan2(Math.sin(l-j),Math.cos(l-j))*(1-Math.exp(-3*r)),m&&(j=m.heading);let v=m?m.angularVelocity:r?(j-_)/r:0;P=Vt.damp(P,m?m.steerRate??v:v,4,r),M=Vt.damp(M,u,2,r),N=Vt.damp(N,d,2,r),k=Vt.damp(k,vh.strength,1.8,r);let y=n.position.clone(),b=m?n.quaternion.clone():null;if(n.position.set(M+.325*(1-Math.cos(j)),N+.003*Math.sin(e*1.31),.325*Math.sin(j)),n.rotation.set(.004*Math.sin(e*.57),j,.004*Math.sin(e*.71)-A*.025-F*Kh),F>1e-4){n.updateMatrixWorld(!0),a.transform(-1.68,.0832,0,I),n.localToWorld(ne.set(I[0],I[1],I[2]));let e=F*(Wh-Gh-ne.y);n.position.y+=e,ne.y+=e}m&&(n.position.fromArray(m.position),n.rotation.set(m.roll??0,j,-m.pitch,`YZX`));let x=m?m.velocity:r?n.position.clone().sub(y).multiplyScalar(1/r).toArray():[0,0,0],S=n.userData.externalFlow??yh(e,n.position.x,n.position.y,n.position.z,k,vh.direction,[]),O;if(m){let e=n.quaternion.clone().invert(),t=e.clone().multiply(b).invert();t.w<0&&(t.x*=-1,t.y*=-1,t.z*=-1,t.w*=-1);let i=Math.hypot(t.x,t.y,t.z),a=r>0&&i>1e-8?2*Math.atan2(i,t.w)/(i*r):0;O={flow:new q().fromArray(S).applyQuaternion(e).toArray(),velocity:new q().fromArray(x).applyQuaternion(e).toArray(),angular:[t.x*a,t.y*a,t.z*a]}}let ie=Math.hypot(...S.map((e,t)=>e-x[t]));E.advance(r,A,ie,P,ag[f]??{});let{phase:ae,effort:oe,breathPhase:L,pectoralPhase:R,scull:se,tuck:ce,pectoralEffort:le,pectoralScull:ue}=E;if(a.advanceTurn(r,m?m.steerRate??v:P,m?m.speed??0:Math.hypot(...x)),a.advancePitch(r,m?.pitchSpeed??0,m?m.speed??0:Math.hypot(...x)),a.update(ae,E.tailEffort,P,L,m?.gulp??ee,m?.gulpGill??te),F>0||n.userData.gulp.lift>0){let e=n.userData.gulp;e.lift=F,e.phase=g.phase,e.clock=g.clock,ne.toArray(e.lip)}o.needsUpdate=r>0,cg.uPhase.value=ae,cg.uDrive.value=A,cg.uTurn.value=P,cg.uFold.value=A,cg.uMouth.value=a.mouth,cg.uGill.value=a.gill;let de={body:a,time:e,phase:ae,pectoralPhase:R,scull:se,tuck:ce,pectoralEffort:le,pectoralScull:ue,drive:oe*.55,effort:oe,turn:P,flare:cg.uFlare.value,clamp:w.clamp,heading:j,angularVelocity:v,velocity:x,origin:n.position.toArray(),localHydrodynamics:O,strength:k,direction:vh.direction,externalFlow:n.userData.externalFlow,bodyRadius(e,t){let n=e/ig+680;if(n<155||n>1010)return 0;fg(n,re);let r=re[1],i=re[2],a=re[3],o=(420-(r+i)/2)*ig,s=(i-r)*.5*ig,c=(t-o)/s;return Math.abs(c)>=1?0:Math.sqrt(1-c*c)*a*ig}};for(let e of i)e.advance(r,de),e.texture.needsUpdate=r>0;n.userData.flowStrength=k,n.userData.mode=f,n.userData.drive=A,n.userData.effort=oe,n.userData.stroke=E.stroke,n.userData.breathPhase=L,n.userData.turn=P}},n}var Dg=`betta.variety`,Og=[{id:`classic`,name:`Classic`,swatch:[`#2b6f97`,`#b3202b`]},{id:`super-red`,name:`Super Red`,body:{back:`#64070c`,side:`#a20f15`,belly:`#b92519`,head:`#740a0d`},fins:{root:`#8c0910`,edge:`#b8161b`},sheen:{tint:`#ff3a2c`,share:.75},swatch:[`#a20f15`,`#b8161b`]},{id:`royal-blue`,name:`Royal Blue`,amount:.9,detail:.6,body:{back:`#0b2a78`,side:`#1c4fc0`,belly:`#2558bd`,head:`#0e2464`},fins:{root:`#123c9c`,edge:`#2054c8`},sheen:{tint:`#3d7bff`,share:.6},coat:{colour:`#5a8cff`,reach:.15},swatch:[`#1c4fc0`,`#2054c8`]},{id:`black-samurai`,name:`Black Samurai`,detail:.75,body:{back:`#08090c`,side:`#0b0c10`,belly:`#101116`,head:`#07080a`},fins:{root:`#07080b`,edge:`#121318`},sheen:{tint:`#6f9cff`,share:.6},coat:{colour:`#aac3ea`,reach:.85},swatch:[`#9fb3d1`,`#0c0d11`]},{id:`mustard-gas`,name:`Mustard Gas`,detail:.75,body:{back:`#0d3042`,side:`#17605f`,belly:`#1d6a63`,head:`#0d2a38`},fins:{root:`#102f6a`,edge:`#173d78`},sheen:{tint:`#2fd0b0`,share:.45},band:{colour:`#c8941f`,from:.52},swatch:[`#17605f`,`#c8941f`]},{id:`butterfly`,name:`Butterfly`,detail:.6,body:{back:`#0b2a78`,side:`#1c4fc0`,belly:`#2558bd`,head:`#0e2464`},fins:{root:`#133e9e`,edge:`#1d4fbe`},sheen:{tint:`#3d7bff`,share:.6},band:{colour:`#e9edf0`,from:.58},swatch:[`#1c4fc0`,`#e9edf0`]},{id:`koi`,name:`Koi Marble`,detail:.5,body:{back:`#d8d4cc`,side:`#e6e2da`,belly:`#ece8e0`,head:`#ddd8cf`},fins:{root:`#d9d6d0`,edge:`#cfcdca`},patches:{colours:[[`#e2481a`,.46,230],[`#0b0b0d`,.16,140]],seed:7},sheen:{tint:`#e8f0ff`,share:.5},swatch:[`#e6e2da`,`#e2481a`]},{id:`platinum`,name:`Platinum White`,detail:.45,body:{back:`#e3e3e0`,side:`#eeeeeb`,belly:`#f2f2ef`,head:`#e6e6e2`},fins:{root:`#e4e5e4`,edge:`#d6d8d9`},sheen:{tint:`#eef4ff`,share:.7},coat:{colour:`#f4f6f9`,reach:.8},swatch:[`#eeeeeb`,`#d6d8d9`]},{id:`copper`,name:`Copper`,detail:.9,body:{back:`#4a1a0a`,side:`#7a3414`,belly:`#86401c`,head:`#4f1d0c`},fins:{root:`#6e2810`,edge:`#4c1b0b`},sheen:{tint:`#ffb057`,share:.7},coat:{colour:`#e39a52`,reach:.75},swatch:[`#c27a3e`,`#6e2810`]},{id:`pineapple`,name:`Pineapple`,body:{back:`#3a2706`,side:`#4a320a`,belly:`#6a4c12`,head:`#b88a1e`},fins:{root:`#c99418`,edge:`#ddb036`},sheen:{tint:`#ffd24a`,share:.7},coat:{colour:`#e9b52a`,reach:.9},swatch:[`#e9b52a`,`#ddb036`]},{id:`galaxy-koi`,name:`Galaxy Koi`,detail:.8,body:{back:`#0b1a3c`,side:`#13285a`,belly:`#1b3266`,head:`#0c1a38`},fins:{root:`#132a62`,edge:`#1a3878`},patches:{colours:[[`#b4ccff`,.16,26],[`#e2481a`,.34,200],[`#e1e4ea`,.08,150]],seed:3},sheen:{tint:`#5d8dff`,share:.6},swatch:[`#13285a`,`#e2481a`]}];function kg(e){return Og.some(t=>t.id===e)?e:`koi`}function Ag(e){try{return kg(e().getItem(Dg))}catch{return`koi`}}function jg(e,t){try{e().setItem(Dg,kg(t))}catch{}}function Mg(e){return Og.find(t=>t.id===e)??Og.find(e=>e.id===`koi`)??Og[0]}function Ng(e){return[1,3,5].map(t=>{let n=parseInt(e.slice(t,t+2),16)/255;return n>.04045?((n+.055)/1.055)**2.4:n/12.92})}var Pg=2,Fg=-8;function Ig(e,t,n=new Float32Array(16)){if(n.fill(0),n[11]=Pg,n[15]=Fg,e.id===`classic`)return n;let r=e.detail??1;return n.set([e.amount??1,t.gain**r,r,1/t.body],0),e.sheen&&n.set([...Ng(e.sheen.tint),e.sheen.share],4),e.band&&n.set([...Ng(e.band.colour).map(e=>e/t.fins),e.band.from],8),e.coat&&n.set([...Ng(e.coat.colour),1.4*e.coat.reach+.1],12),n}var Lg={w:192,h:128,width:1536,height:1024},Rg={w:128,h:128,width:1225,height:1284},zg={body:.85,fins:.6},Bg=4,Vg=(e,t,n)=>{let r=Math.min(Math.max((n-e)/(t-e),0),1);return r*r*(3-2*r)};function Hg(){let{w:e,h:t,width:n,height:r}=Lg,i=new Uint8Array(e*t),a=new Float32Array(e*t),o=new Float32Array(e*t),s=new Float32Array(e*t),c=[0,0,0,0];for(let l=0;l<t;l++)for(let u=0;u<e;u++){let d=l*e+u,f=(u+.5)*n/e,p=(l+.5)*r/t,[,m,h]=fg(Math.min(Math.max(f,155),1010),c),g=330+76*Math.sin(Math.PI*Math.min(Math.max((p-332)/170,0),1));o[d]=1-Vg(g-30,g+8,f),f<155?i[d]=4:p>=m&&p<=h&&f<=1010?(i[d]=0,a[d]=(p-m)/(h-m)):p<m?(i[d]=1,s[d]=Math.min((m-p)/230,1)):(i[d]=f<440?3:2,s[d]=Math.min((p-(f<440?530:h))/(f<440?390:420),1))}return{kind:i,q:a,head:o,out:s}}function Ug(){let{w:e,h:t,width:n,height:r}=Rg,i=new Float32Array(e*t);for(let a=0;a<t;a++)for(let o=0;o<e;o++)i[a*e+o]=Math.min(Math.hypot((o+.5)*n/e-505,(a+.5)*r/t-512)/620,1.2);return i}function Wg(e){let t=new Float32Array(e.length/4),n=e=>{let t=e/255;return t>.04045?((t+.055)/1.055)**2.4:t/12.92},r=Float32Array.from({length:256},(e,t)=>n(t));for(let n=0;n<t.length;n++)t[n]=.2126*r[e[4*n]]+.7152*r[e[4*n+1]]+.0722*r[e[4*n+2]];return t}function Gg(e,t,n,r){let i=Math.min(Math.max(n*t-.5,0),t-1),a=Math.min(Math.max(r*t-.5,0),t-1),o=Math.min(Math.floor(i),t-2),s=Math.min(Math.floor(a),t-2),c=i-o,l=a-s,u=s*t+o;return(e[u]*(1-c)+e[u+1]*c)*(1-l)+(e[u+t]*(1-c)+e[u+t+1]*c)*l}function Kg(e,t,n,r,i){let a=new Float32Array(e.length),o=Float32Array.from(t);for(let n=0;n<a.length;n++)a[n]=e[n]*t[n];let s=new Float32Array(Math.max(n,r)),c=(e,t)=>{let a=t?n:r,o=t?r:n,c=t?1:n;for(let r=0;r<o;r++){let o=t?r*n:r;for(let t=0;t<a;t++)s[t]=e[o+t*c];let l=0;for(let e=-i;e<=i;e++)l+=s[Math.min(Math.max(e,0),a-1)];for(let t=0;t<a;t++)e[o+t*c]=l/(2*i+1),l+=s[Math.min(t+i+1,a-1)]-s[Math.max(t-i,0)]}};for(let e=0;e<3;e++)for(let e of[a,o])c(e,!0),c(e,!1);for(let e=0;e<a.length;e++)a[e]=o[e]>1e-4?a[e]/o[e]:0;return a}function qg(e,t){let{w:n,h:r,width:i,height:a}=Lg,o=n*r,s=Rg.w*Rg.h,c=Float32Array.from(e.profile),l=new Float32Array(o),u=new Float32Array(o),d=new Float32Array(s),f=e=>Vg(.006,.016,e);for(let o=0;o<r;o++)for(let s=0;s<n;s++){let d=o*n+s;if(t.kind[d]!==0){u[d]=f(c[d]);continue}let p=(s+.5)*i/n,m=(o+.5)*a/r,h=(p-145)/290+.017,g=(m-300)/250+.034,_=Vg(0,.13,h)*Vg(0,.13,1-g)*(1-Vg(.87,1,h))*(1-Vg(.87,1,1-g)),v=c[d]+(Gg(e.head,64,h,g)-c[d])*_*.97,y=(p-430)/400;v+=(Gg(e.scales,64,y-Math.floor(y),(m-278)/250)-v)*Vg(400,465,p)*.98,c[d]=v,l[d]=1}for(let t=0;t<s;t++)d[t]=f(e.caudal[t]);let p=0,m=0,h=0,g=0;for(let e=0;e<o;e++)p+=c[e]*l[e],m+=l[e],h+=c[e]*u[e],g+=u[e];for(let t=0;t<s;t++)h+=e.caudal[t]*d[t],g+=d[t];let _=p/m,v=h/g,y=Kg(c,l,n,r,3),b=Kg(c,u,n,r,3),x=Kg(e.caudal,d,Rg.w,Rg.h,3),S=(e,t,n)=>Math.min(Math.max(e/Math.max(t,1e-4),1/Bg),Bg)**n/e,C=new Float32Array(o),w=new Float32Array(s),T=0;for(let e=0;e<o;e++)C[e]=l[e]?S(_,y[e],zg.body):S(v,b[e]||v,zg.fins),T=Math.max(T,C[e]);for(let e=0;e<s;e++)w[e]=S(v,x[e]||v,zg.fins),T=Math.max(T,w[e]);for(let e=0;e<o;e++)C[e]/=T;for(let e=0;e<s;e++)w[e]/=T;let E={profile:new Uint8Array(o),caudal:new Uint8Array(s)};for(let e=0;e<o;e++)E.profile[e]=l[e]||u[e]>.05?1:0;for(let e=0;e<s;e++)E.caudal[e]=+(d[e]>.05);return Jg(E.profile,n,r),Jg(E.caudal,Rg.w,Rg.h),{profile:C,caudal:w,gain:T,body:_,fins:v,fish:E}}function Jg(e,t,n){let r=new Uint8Array(Math.max(t,n));for(let[i,a,o,s]of[[t,n,1,t],[n,t,t,1]])for(let t=0;t<a;t++){let n=t*s;for(let t=0;t<i;t++)r[t]=e[n+t*o];for(let t=0;t<i;t++)e[n+t*o]=r[Math.max(t-2,0)]|r[Math.max(t-1,0)]|r[t]|r[Math.min(t+1,i-1)]|r[Math.min(t+2,i-1)]}}function Yg(e,t,n){let r=Math.imul(e,374761393)+Math.imul(t,668265263)+Math.imul(n,982451653);return r=Math.imul(r^r>>>13,1274126177),((r^r>>>16)>>>0)/4294967296}function Xg(e,t,n){let r=Math.floor(e),i=Math.floor(t),a=e-r,o=t-i,s=a*a*(3-2*a),c=o*o*(3-2*o),l=Yg(r,i,n),u=Yg(r+1,i,n),d=Yg(r,i+1,n),f=Yg(r+1,i+1,n);return l+(u-l)*s+(d-l)*c+(l-u-d+f)*s*c}var Zg=200;function Qg(e,t,n,r){let i=e/Zg,a=t/Zg;return r[0]=e+.8*Zg*(Xg(i*.7,a*.7,n+11)-.5),r[1]=t+.8*Zg*(Xg(i*.7+5.3,a*.7,n+12)-.5),r}function $g(e,t,n,r){let i=e/n,a=t/n;return .58*Xg(i,a,r)+.26*Xg(i*2.1,a*2.1,r+1)+.1*Xg(i*4.3,a*4.3,r+2)+.06*Xg(i*9.1,a*9.1,r+3)}var e_=new Map;function t_(e,t,n){let r=`${e} ${t} ${n}`;if(!e_.has(r)){let i=[],a=[0,0];for(let n=0;n<32;n++)for(let r=0;r<48;r++)i.push($g(...Qg(r*32,n*32,t,a),e,t));i.sort((e,t)=>e-t),e_.set(r,i[Math.min(Math.floor((1-n)*i.length),i.length-1)])}return e_.get(r)}function n_(e){for(let t of e)for(let e of r_(t));}function r_(e){return(e.patches?.colours??[]).map(([t,n,r],i)=>{let a=e.patches.seed*31+i*7;return{colour:Ng(t),size:r,seed:a,from:t_(r,a,n)}})}var i_=Uint8ClampedArray.from({length:4096},(e,t)=>{let n=t/4095;return Math.round(255*(n>.0031308?1.055*n**(1/2.4)-.055:12.92*n))}),a_=e=>i_[Math.min(Math.max(e*4095+.5|0,0),4095)];function*o_(e,t){let n={profile:new Uint8ClampedArray(Lg.w*Lg.h*4),caudal:new Uint8ClampedArray(Rg.w*Rg.h*4)},[r,i,a,o,s,c]=[e.body.back,e.body.side,e.body.belly,e.body.head,e.fins.root,e.fins.edge].map(Ng),l=r_(e),u=e.detail??1,d=[0,0,0],f=[0,0],p=(e,t,n,r,i,a)=>{if(r&&l.length){Qg(i,a,l[0].seed,f);for(let e of l){let t=Vg(e.from-.018,e.from+.018,$g(f[0],f[1],e.size,e.seed));for(let n=0;n<3;n++)d[n]+=(e.colour[n]-d[n])*t}}let o=u===1?n:n**u;e[4*t]=a_(d[0]*o),e[4*t+1]=a_(d[1]*o),e[4*t+2]=a_(d[2]*o),e[4*t+3]=255},{kind:m,q:h,head:g,out:_}=t.cells;for(let e=0;e<Lg.h;e++){for(let l=0;l<Lg.w;l++){let u=e*Lg.w+l;if(m[u]===0){let e=Vg(0,.5,h[u]),t=Vg(.55,1,h[u]),n=g[u];for(let s=0;s<3;s++)d[s]=(r[s]+(i[s]-r[s])*e)*(1-t)*(1-n)+a[s]*t*(1-n)+o[s]*n}else if(m[u]===4)d.splice(0,3,...o);else{let e=Vg(.1,.9,_[u]);for(let t=0;t<3;t++)d[t]=s[t]+(c[t]-s[t])*e}p(n.profile,u,t.profile[u],t.fish.profile[u],(l+.5)*Lg.width/Lg.w,(e+.5)*Lg.height/Lg.h)}yield}for(let e=0;e<Rg.h;e++){for(let r=0;r<Rg.w;r++){let i=e*Rg.w+r,a=Vg(.1,.9,t.caudalOut[i]);for(let e=0;e<3;e++)d[e]=s[e]+(c[e]-s[e])*a;p(n.caudal,i,t.caudal[i],t.fish.caudal[i],(r+.5)*Rg.width/Rg.w+2e3,(e+.5)*Rg.height/Rg.h)}yield}return n}var $=(e,t,n)=>Math.max(t,Math.min(n,e)),s_=(e,t,n,r)=>e+(t-e)*(1-Math.exp(-n*r)),c_=e=>Math.atan2(Math.sin(e),Math.cos(e)),l_=(e,t,n)=>{let r=$((n-e)/(t-e),0,1);return r*r*(3-2*r)};function u_(e,t,n=0,r=e.length,i=3){let a=Math.hypot(t[0],t[1],t[2]);if(!(a>0))return;let o=t[0]/a,s=t[1]/a,c=t[2]/a,l=Math.cos(a),u=Math.sin(a);for(let t=n;t<r;t+=i){let n=e[t],r=e[t+1],i=e[t+2],a=(o*n+s*r+c*i)*(1-l);e[t]=n*l+(s*i-c*r)*u+o*a,e[t+1]=r*l+(c*n-o*i)*u+s*a,e[t+2]=i*l+(o*r-s*n)*u+c*a}}var d_=(e,t,n)=>{let r=[n[0]-t[0],n[1]-t[1],n[2]-t[2]],i=$(((e[0]-t[0])*r[0]+(e[1]-t[1])*r[1]+(e[2]-t[2])*r[2])/Math.max(r[0]**2+r[1]**2+r[2]**2,1e-12),0,1);return[t[0]+r[0]*i,t[1]+r[1]*i,t[2]+r[2]*i]},f_=.084;function p_(e){let t=e.heading,n=e.pitch,r=1.22*f_,i=[r*Math.cos(t)*Math.cos(n),-.10248*Math.sin(n),-.10248*Math.sin(t)*Math.cos(n)],a=[-.10248*(Math.sin(t)*Math.cos(n)*e.angularVelocity+Math.cos(t)*Math.sin(n)*e.pitchRate),-.10248*Math.cos(n)*e.pitchRate,r*(-Math.cos(t)*Math.cos(n)*e.angularVelocity+Math.sin(t)*Math.sin(n)*e.pitchRate)];return{...e,speed:e.speed/f_,position:e.position.map((e,t)=>(e+i[t])/f_),velocity:e.velocity.map((e,t)=>(e+a[t])/f_)}}var m_=f_/.105,h_=.85,g_=1.5,__=.003,v_=.048*m_,y_=.0087*m_,b_=Math.hypot(v_,y_),x_=Math.atan2(y_,v_),S_=(e,t)=>e+v_*Math.sin(t)+y_*Math.cos(t),C_=(e,t,n)=>{let r=v_*Math.cos(n)-y_*Math.sin(n);return[e[0]-Math.cos(t)*r,S_(e[1],n),e[2]+Math.sin(t)*r]},w_=(e,t)=>Math.asin($((t-e)/b_,-1,1))-x_,T_=e=>1.1*(l_(0,.28,e)-l_(.62,.95,e)),E_=e=>Math.sin(Math.PI*$((e-.8)/.8,0,1))**1.2,D_=new Set([`rise`,`gulp`,`dive`]),O_=.05*m_,k_=.08*m_,A_=.1,j_=1.9,M_=2.5,N_=2.276*f_,P_=.046*m_,F_=.06,I_=1.24*f_,L_=[.45,.9,1.35,1.8],R_=[.14,.22,.32],z_=[0,.07,-.07],B_=.4,V_=new Set([`mirror`,`lap`,`rest`]),H_=.074*m_,U_=.058,W_=.025*m_,G_=.78,K_=.55,q_=[G_,.66,.54,.42],J_=.6,Y_=.01,X_=.03,Z_=.85,Q_=.5,$_=.12,ev=1.1,tv=1.6*Math.PI,nv=.1,rv=1.3,iv=1.6,av=class{constructor(e=237){this.seed=e,this.position=[.2,-.17,.12],this.velocity=[0,0,0],this.target=[-.34,-.23,-.18],this.heading=-.35,this.pitch=this.angularVelocity=this.speed=this.time=0,this.steerRate=this.roll=this.rollRate=this.pitchRate=this.pitchSpeed=this.fold=0,this.sharpTurn=!1,this.yawAccum=0,this.spinBreaks=0,this.waterSpin=[0,0,0],this.drive=.045,this.mode=`cruise`,this.timer=7,this.cruiseSpeed=.09,this.drift=[0,0,0],this.compensateDrift=!1,this.initialized=!1,this.gulpSeed=(e^2654435769)>>>0,this.behaviorSeed=(e^2246822507)>>>0,this.nextGulp=22+this.gulpRandom()*14,this.mirrorReady=30+this.behaviorRandom()*25,this.lapReady=70+this.behaviorRandom()*40,this.restReady=50+this.behaviorRandom()*35,this.behaviorClock=this.holdClock=0,this.flaring=!1,this.mirrorPoint=[0,0,0],this.mirrorFace=0,this.mirrorSide=1,this.mirrorHold=5,this.mirrorArrived=!1,this.lapDir=1,this.lapY=0,this.lapAngle=this.lapTravelled=0,this.lapLength=2*Math.PI,this.restY=0,this.restHold=8,this.restSettled=!1,this.gulpClock=0,this.gulp=this.gulpGill=0,this.surfaceY=NaN,this.flowRef=this.spinRef=null,this.jolt=0,this.joltVector=[0,0,0],this.startleReady=4,this.startleClock=0,this.startleHeading=0,this.startleDive=!1,this.food=null,this.gape=0,this.feedHold=0,this.feedRetry=0,this.feedBearing=null,this.obstacles=[],this.detour=null,this.detourSide=0,this.detourAgain=0,this.gulpUrge=0,this.lethargy=0,this.gasp=0,this.gulpFrom=0,this.gulps=0,this.gulpsLeft=0,this.restSide=1}get slump(){return Math.min(1,2*this.lethargy)}gulpDue(){return this.gasp>0?this.gulpFrom+(this.nextGulp-this.gulpFrom)/(1+5*$(this.gasp,0,1)):this.nextGulp}turnWith(e){for(let t of[this.position,this.velocity,this.target,this.mirrorPoint])u_(t,e);if(this.detour)for(let t of[this.detour.point,this.detour.goal])u_(t,e);let t=e[1];this.heading=c_(this.heading+t),this.mirrorFace=c_(this.mirrorFace+t),this.startleHeading=c_(this.startleHeading+t),this.lapAngle=c_(this.lapAngle-t),this.feedBearing!==null&&(this.feedBearing=c_(this.feedBearing-t))}obstacleGap(e){let t=1/0,n=[0,0,0];for(let r of this.obstacles){let i=d_(e,r.a,r.b),a=[e[0]-i[0],e[1]-i[1],e[2]-i[2]],o=Math.hypot(...a);o-r.r<t&&(t=o-r.r,n=o>1e-9?a.map(e=>e/o):[0,1,0])}return{gap:t,away:n}}clearWay(e,t){if(!this.obstacles.length)return!0;for(let n=1;n<=6;n++){let r=n/6;if(this.obstacleGap(this.position.map((t,n)=>t+(e[n]-t)*r)).gap<t)return!1}return!0}leafGap(e){let t=1/0;for(let n of this.obstacles){if(!n.leaf)continue;let r=d_(e,n.a,n.b);t=Math.min(t,Math.hypot(e[0]-r[0],e[1]-r[1],e[2]-r[2])-n.r)}return t}leafClear(e,t,n,r=!1){let i=Math.hypot(t[0]-e[0],t[1]-e[1],t[2]-e[2]),a=Math.max(2,Math.ceil(i/.05)),o=this.leafGap(e);for(let s=1;s<=a;s++){let c=s/a;if(this.leafGap([e[0]+(t[0]-e[0])*c,e[1]+(t[1]-e[1])*c,e[2]+(t[2]-e[2])*c])<Math.min(n,r?o+.7*i*c:Math.max(0,o)+i*c))return!1}return!0}wayRound(e,t){let n=this.detour;if(n){let t=Math.hypot(...n.point.map((e,t)=>e-this.position[t]))<.07,r=Math.hypot(...n.goal.map((t,n)=>t-e[n]))>.2;if(t||r||this.time>n.until||this.leafClear(this.position,e,.08))this.detour=null;else if(this.time>=this.detourAgain&&!this.leafClear(this.position,n.point,.03,!0))this.detour=null;else return n.point}if(this.time<this.detourAgain||this.leafClear(this.position,e,.06))return e;this.detourAgain=this.time+.25;let[r,i,a]=this.position,o=Math.atan2(e[2]-a,-(e[0]-r)),s=null,c=1/0,l=0;for(let n of L_)for(let u of[-1,1])for(let d of R_)for(let f of z_){let p=o+u*n,m=$(i+f,t.low,t.high),h=[r-Math.cos(p)*d,m,a+Math.sin(p)*d];if(Math.hypot(h[0],h[2])>.9*Math.sqrt(Math.max(0,t.radius**2-m*m)))continue;let g=d+Math.hypot(e[0]-h[0],e[1]-h[1],e[2]-h[2])+.06*n+.05*Math.abs(c_(p-this.heading))+.6*Math.abs(m-i)+(this.detourSide&&u!==this.detourSide?.12:0);if(g>=c||!this.leafClear(this.position,h,.06,!0)||this.obstacleGap(h).gap<.05||!this.clearWay(h,.03))continue;let _=g+(this.leafClear(h,e,.06)?0:.3);_<c&&(c=_,s=h,l=u)}return s?(this.detourSide=l,this.detour={point:s,goal:[...e],until:this.time+5},s):e}clearUp(){let e=this.surfaceY-this.position[1],t=-Math.cos(this.heading),n=Math.sin(this.heading);return this.leafClear(this.position,[this.position[0]+t*.5*e,this.surfaceY-.02,this.position[2]+n*.5*e],F_)}readJolt(e,t,n){let r=t?.flow,i=t?.angular;if(!r||!i||n<.9)return this.flowRef=this.spinRef=null,this.joltVector=[0,0,0],0;this.flowRef||(this.flowRef=[...r],this.spinRef=[...i]);let a=r.map((e,t)=>e-this.flowRef[t]),o=Math.hypot(...i.map((e,t)=>e-this.spinRef[t])),s=1-Math.exp(-1.5*e);for(let e=0;e<3;e++)this.flowRef[e]+=a[e]*s,this.spinRef[e]+=(i[e]-this.spinRef[e])*s;return this.joltVector=a,Math.max(Math.hypot(...a),.5*o)}startStartle(e){this.closeBehavior();let t=this.bounds(e),[n,r,i]=this.joltVector,a=Math.hypot(n,i)>.3*Math.hypot(n,r,i),o=c_((a?Math.atan2(i,-n):this.heading+(this.random()<.5?-1.4:1.4))-this.heading);Math.abs(o)<.8&&(o=(o<0?-1:1)*.8),o=$(o,-2.6,2.6);let s=e=>Math.hypot(this.position[0]-Math.cos(e)*.32,this.position[1],this.position[2]+Math.sin(e)*.32)<=t.radius;!a&&!s(this.heading+o)&&(o=-o);let c=null;for(let e of[0,.45,-.45,.9,-.9,1.35,-1.35]){let t=this.heading+o+e;if(s(t)){c=t;break}}this.startleHeading=c_(c??Math.atan2(-this.position[2],this.position[0])),this.startleDive=Number.isFinite(this.surfaceY)&&this.surfaceY-this.position[1]<.1,this.mode=`startle`,this.startleClock=0,this.timer=99,this.sharpTurn=!1,this.startleReady=this.time+10,this.nextGulp=Math.max(this.nextGulp,this.time+30+this.gulpRandom()*30)}streamRandom(e){let t=this.seed;this.seed=this[e];let n=this.random();return this[e]=this.seed,this.seed=t,n}gulpRandom(){return this.streamRandom(`gulpSeed`)}behaviorRandom(){return this.streamRandom(`behaviorSeed`)}behaviorOk(e,t,n){return!!e&&n&&t>.99&&(e.airAbove??0)<.1&&Number.isFinite(e.sand)}tryMirror(e,t){if(!t||this.lethargy>=.4||this.time<this.mirrorReady)return!1;let[n,r,i]=this.position,a=Math.hypot(n,i),o=Math.sqrt(Math.max(0,(e.radius+W_)**2-r*r));if(a<.5*o||o-a>.22)return!1;let s=n/a,c=i/a;return s*-Math.cos(this.heading)+c*Math.sin(this.heading)<-.5||!this.clearWay([s*o,r,c*o],.05)||this.behaviorRandom()>.6*(1-this.lethargy/.4)?!1:(this.mode=`mirror`,this.timer=99,this.sharpTurn=!1,this.behaviorClock=this.holdClock=0,this.mirrorArrived=!1,this.mirrorPoint=[s*o,r,c*o],this.mirrorFace=Math.atan2(c,-s),this.mirrorSide=this.behaviorRandom()<.5?-1:1,this.mirrorHold=4.5+this.behaviorRandom()*3.5,!0)}tryLap(e,t){if(!t||this.lethargy>=.4||this.time<this.lapReady)return!1;let[n,r,i]=this.position;return Math.hypot(n,i)<.2||this.behaviorRandom()>.5*(1-this.lethargy/.4)?!1:(this.mode=`lap`,this.timer=99,this.sharpTurn=!1,this.behaviorClock=0,this.cruiseSpeed=U_,this.lapDir=this.behaviorRandom()<.5?-1:1,this.lapLength=Math.PI*(1.5+this.behaviorRandom()),this.lapY=$(r,e.low+.02,e.high-.04),this.lapAngle=Math.atan2(i,n),this.lapTravelled=0,!0)}tryRest(e,t,n){if(!n)return!1;if(this.slumpDown(e,t,n))return!0;let r=t.sand+H_;return this.time<this.restReady||!this.restRoom(e,this.position[0],r,this.position[2])||this.behaviorRandom()>.5||this.obstacleGap([this.position[0],r,this.position[2]]).gap<.1||!this.leavesClearDown(this.position,this.heading,r)?!1:this.lieDown(r)}slumpDown(e,t,n){if(!n||!(this.lethargy>0)||this.behaviorRandom()>=this.slump)return!1;let r=t.sand+H_;return!!this.restLanding(e,this.position,this.heading,r)&&this.lieDown(r)}lieDown(e){return this.mode=`rest`,this.timer=99,this.sharpTurn=!1,this.behaviorClock=this.holdClock=0,this.restSettled=!1,this.restY=e,this.restHold=(7+this.behaviorRandom()*7)*(1+5*this.lethargy),this.lethargy>0&&(this.restSide=this.behaviorRandom()<.5?-1:1),!0}restRoom(e,t,n,r){return Math.hypot(t,r,n)<=e.radius-.05+.08*this.lethargy}restRun(e){let t=(e-.012)/6;return Array.from({length:6},(n,r)=>t>0?t/Math.tan(Math.min(.72,.12+2.5*(e-(r+.5)*t)))*(1-Z_*this.slump):0)}leavesClearDown(e,t,n){let r=-Math.cos(t),i=Math.sin(t),a=[e[0],e[1],e[2]];for(let t of this.restRun(e[1]-n))if(a[0]+=r*t,a[1]-=(e[1]-n-.012)/6,a[2]+=i*t,this.leafGap(a)<.06)return!1;return this.leafGap([a[0]-r*I_,n,a[2]-i*I_])>=F_}restLanding(e,t,n,r){let i=-Math.cos(n),a=Math.sin(n),o=[t[0],t[1],t[2]],s=this.restRun(t[1]-r),c=.12*this.lethargy;for(let e of s)if(o[0]+=i*e,o[1]-=(t[1]-r-.012)/6,o[2]+=a*e,this.obstacleGap(o).gap<.05-c)return null;o[1]=r;let l=[o[0]-i*I_,r,o[2]-a*I_];return this.restRoom(e,o[0],r,o[2])&&this.obstacleGap(o).gap>=.1-c&&this.leafGap(o)>=.06&&this.leafGap(l)>=.06?o:null}seekRest(e,t,n){if(!n||this.behaviorRandom()>=this.slump)return!1;let r=t.sand+H_,[i,a,o]=this.position,s=$(a-.08,e.low,e.high),c=null,l=1/0;for(let t=0;t<12;t++){let t=.45*Math.sqrt(this.behaviorRandom()),n=2*Math.PI*this.behaviorRandom(),a=t*Math.cos(n),u=t*Math.sin(n),d=Math.hypot(a-i,u-o);if(d>=l||!this.restRoom(e,a,r,u)||this.obstacleGap([a,r,u]).gap<.1-.12*this.lethargy)continue;let f=Math.atan2(u-o,-(a-i)),p=this.restRun(s-r).reduce((e,t)=>e+t,0);if(d<p+.15)continue;let m=[a-(a-i)/d*p,s,u-(u-o)/d*p];Math.hypot(m[0],m[2])>Math.sqrt(Math.max(0,e.radius**2-s*s))||!this.clearWay(m,.06)||!this.restLanding(e,m,f,r)||(c=m,l=d)}return c?(this.mode=`cruise`,this.timer=15,this.sharpTurn=!1,this.target=c,this.cruiseSpeed=.06*(1-.55*this.lethargy),!0):!1}lapGoal(e){let t=this.lapY+.035*Math.sin(2*Math.PI*this.behaviorClock/11),n=Math.sqrt(Math.max(0,e.radius**2-t*t)),r=Math.atan2(this.position[2],this.position[0])+this.lapDir*K_,i;for(let e of q_)if(i=[e*n*Math.cos(r),t,e*n*Math.sin(r)],this.leafGap(i)>=.12)break;return i}stepBehavior(e,t,n,r,i){if(!this.behaviorOk(n,r,i)){this.endBehavior(t);return}this.behaviorClock+=e;let[a,o,s]=this.position;if(this.mode===`mirror`){let n=Math.hypot(...this.mirrorPoint.map((e,t)=>e-this.position[t]));n<.16&&(this.flaring=!0),!this.mirrorArrived&&n<.05&&(this.mirrorArrived=!0,this.holdClock=0),this.mirrorArrived&&(this.holdClock+=e),(this.mirrorArrived&&this.holdClock>=this.mirrorHold||this.behaviorClock>16)&&this.endBehavior(t)}else if(this.mode===`lap`){let e=Math.atan2(s,a);this.lapTravelled+=this.lapDir*c_(e-this.lapAngle),this.lapAngle=e,(this.lapTravelled>=this.lapLength||this.behaviorClock>90)&&this.endBehavior(t)}else this.mode===`rest`&&(this.restY=n.sand+H_,!this.restSettled&&(o-this.restY<.012||this.behaviorClock>14)&&(this.restSettled=!0,this.holdClock=0),this.restSettled&&(this.holdClock+=e),(this.restSettled&&this.holdClock>=this.restHold||this.behaviorClock>40*(1+5*this.lethargy))&&this.endBehavior(t))}closeBehavior(){if(!V_.has(this.mode))return;let e=this.behaviorRandom();this.mode===`mirror`?this.mirrorReady=this.time+60+e*60:this.mode===`lap`?this.lapReady=this.time+120+e*80:this.restReady=this.time+70+e*60-.6*this.lethargy*(70+e*60),this.mirrorReady=Math.max(this.mirrorReady,this.time+15),this.lapReady=Math.max(this.lapReady,this.time+20),this.restReady=Math.max(this.restReady,this.time+20),this.flaring=!1,this.mirrorArrived=!1}endBehavior(e){this.closeBehavior(),this.mode=`glide`,this.timer=1.1+this.random()*.8,this.sharpTurn=!1,this.chooseTarget(e)}random(){this.seed=this.seed+1831565813>>>0;let e=Math.imul(this.seed^this.seed>>>15,1|this.seed);return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}bounds(e){let t=e.sandLevel+.22,n=e.level-.2;return{radius:Math.max(.1,e.radius-.34),low:Math.min(t,n),high:n}}chooseTarget(e){let t=this.bounds(e),n=this.random()<.18,r=this.lethargy,i=.45*(1-.45*r),a=-1/0,o=!1;for(let e=0;e<16;e++){let e=t.low+(t.high-t.low)*(.08+.84*this.random()),s=Math.sqrt(Math.max(0,t.radius**2-e*e))*Math.sqrt(this.random())*.86,c=this.random()*Math.PI*2,l=[s*Math.cos(c),e,s*Math.sin(c)],u=l.map((e,t)=>e-this.position[t]),d=Math.hypot(...u),f=(-u[0]*Math.cos(this.heading)+u[2]*Math.sin(this.heading))/Math.max(d,1e-6)*(n?-.7:.8)+this.random()*.45-Math.abs(d-i)-(d<.22?2:0);r>0&&(f-=r*(1.5*(e-t.low)/Math.max(t.high-t.low,1e-6)+3*Math.max(0,s-.22)));let p=Math.hypot(u[0],u[2]);p<.22||Math.abs(u[1])>.32*p+.05||!this.clearWay(l,.06)||this.leafGap(l)<.12||f>a&&(a=f,this.target=l,o=!0)}o||(this.target=this.targetAhead(t,.4)),this.cruiseSpeed=(.065+this.random()*.045)*(1-.55*r)}feedPlan(e,t,n){let[r,i,a]=this.food,o=C_(this.position,this.heading,this.pitch),s=r-o[0],c=a-o[2],l=Math.hypot(s,c),u=Math.atan2(c,-s);if(!this.foodAtFilm())return{goal:[r-t*v_,i-y_,a-n*v_],yaw:u,plan:l,strike:!1};let d=this.surfaceY-__-o[1],f=Math.cos(u-this.heading),p=rv*Math.max(0,d-.01);if(this.time>=this.feedRetry&&(l<.03||f>.85&&l<p+.05&&l>.6*p-.02))return{goal:[r-t*v_,e,a-n*v_],yaw:u,plan:l,strike:!0};let m=r-this.position[0],h=a-this.position[2],g=.1684,_=Math.min(e,this.surfaceY-nv),v=this.feedApproach(r,a,Math.atan2(h,m),g,_,e),y=[r-Math.cos(v)*g,_,a-Math.sin(v)*g],b=y[0]-this.position[0],x=y[2]-this.position[2];return{goal:y,yaw:Math.hypot(b,x)<.05?u:Math.atan2(x,-b),plan:Math.max(l,Math.hypot(b,x)),strike:!1}}feedApproach(e,t,n,r,i,a){let o=n=>{let o=[e-Math.cos(n)*r,i,t-Math.sin(n)*r];return this.leafGap(o)>=.06&&this.leafClear(o,[e-Math.cos(n)*v_,a,t-Math.sin(n)*v_],.03)};if(!this.obstacles.some(e=>e.leaf)||o(n))return this.feedBearing=null,n;if(this.feedBearing!==null&&o(this.feedBearing))return this.feedBearing;for(let e of[.6,-.6,1.2,-1.2,1.8,-1.8,2.4,-2.4,Math.PI])if(o(n+e))return this.feedBearing=n+e;return this.feedBearing=null,n}foodAtFilm(){return!!this.food&&Number.isFinite(this.surfaceY)&&this.food[1]>this.surfaceY-.03}targetAhead(e,t){let n=this.position[0]-Math.cos(this.heading)*t,r=this.position[2]+Math.sin(this.heading)*t,i=$(this.position[1],e.low,e.high),a=Math.sqrt(Math.max(0,e.radius**2-i*i))*.86,o=Math.hypot(n,r);return o>a&&(n*=a/o,r*=a/o),[n,i,r]}advance(e,t,n,r=!0,i=null,a=null){if(!(e>0))return;let o=Math.min(e,.07);for(;o>1e-8;){let e=Math.min(1/60,o);this.step(e,t,n,r,i,a),o-=e}}step(e,t,n,r,i,a=null){let o=this.bounds(n);this.initialized||=(this.position[1]=$(this.position[1],o.low,o.high),this.target[1]=$(this.target[1],o.low,o.high),!0),this.time+=e,this.timer-=e;let s=n.gravity??[0,-24,0],c=Math.hypot(...s),l=i?.surface,u=c>1&&-s[1]>.985*c,d=Number.isFinite(l)&&Math.abs(l-n.level)<.04&&u;d&&(this.surfaceY=Number.isFinite(this.surfaceY)?s_(this.surfaceY,l,e,6):l);let f=i?.submerged??+!!r;this.jolt=this.readJolt(e,i,f),this.mode!==`startle`&&this.jolt>1.25*(1+1.5*this.lethargy)&&this.time>=this.startleReady&&(i.airAbove??0)<.6&&this.startStartle(n),this.mode===`startle`&&(this.startleClock+=e,this.startleClock>=.9&&(this.mode=`glide`,this.timer=1.2+this.random()*.8,this.sharpTurn=!1,this.chooseTarget(n)));let p=this.mode===`startle`;if(this.food&&!p&&this.mode!==`feed`&&f>.9)this.closeBehavior(),this.mode=`feed`,this.timer=99,this.sharpTurn=!1;else if(this.mode===`feed`&&!this.food&&this.gape<.5){let e=Number.isFinite(this.surfaceY)&&this.surfaceY-this.position[1]<.1;this.mode=e?`dive`:`glide`,this.timer=e?g_:1+this.random()*.6,e||this.chooseTarget(n)}let m=this.mode===`feed`,h=D_.has(this.mode),g=this.gulpDue();!h&&!m&&this.time>=g&&d&&this.surfaceY-this.position[1]>.07&&f>.99&&(i.airAbove??0)<.25&&this.mode!==`burst`&&!this.sharpTurn&&this.clearUp()&&(this.closeBehavior(),this.mode=`rise`,this.gulpClock=0,this.timer=9,h=!0),V_.has(this.mode)&&this.stepBehavior(e,n,i,f,u);let _=V_.has(this.mode),v=this.behaviorOk(i,f,u),y=d?g-this.time:1/0,b=this.lethargy,x=1-.8*b,S=this.surfaceY-__-S_(0,$(this.pitch,0,.95)),C=S-this.position[1];h&&(this.gulpClock+=e,this.mode!==`dive`&&(!d||f<.5)?(this.mode=`dive`,this.timer=g_):this.mode===`rise`&&(Math.abs(C)<.012&&this.pitch>.7||this.timer<=0)?Math.abs(C)<.04?(this.mode=`gulp`,this.gulpClock=0,this.gulps++,this.gulpsLeft=this.gasp>.4?Math.round(8*(this.gasp-B_)/.6*(.4+.6*this.gulpRandom())):0):(this.mode=`dive`,this.timer=g_):this.mode===`gulp`&&this.gulpClock>=1.6?this.gulpsLeft>0?(this.gulpsLeft--,this.gulps++,this.gulpClock=-.7*(1+this.gulpRandom())):(this.mode=`dive`,this.timer=g_):this.mode===`dive`&&this.timer<=0&&(this.mode=`cruise`,this.timer=(6+this.random()*5)*(1-.8*$(this.lethargy,0,1)),this.nextGulp=this.time+(60+this.gulpRandom()*50)*(1-.75*$(this.gulpUrge,0,1)),this.gulpFrom=this.time,this.chooseTarget(n),h=!1));let w=this.target.map((e,t)=>e-this.position[t]),T=Math.hypot(...w),E=T<.075||Math.hypot(w[0],w[2])<.05,D=this.timer<=0&&(this.mode===`hover`||this.mode===`burst`||this.leafGap(this.position)>=.06);!h&&!p&&!_&&!m&&(D||this.mode!==`hover`&&E)&&(this.mode===`hover`?!this.tryLap(o,v&&y>25)&&!this.slumpDown(o,i,v&&y>30*x)&&(this.mode=this.random()<.18*(1-b)?`burst`:`cruise`,this.timer=this.mode===`burst`?.65+this.random()*.45:6+this.random()*5,this.chooseTarget(n)):this.mode===`burst`?(this.mode=`glide`,this.timer=1.2+this.random()):!this.tryMirror(o,v&&y>16)&&!this.tryRest(o,i,v&&y>30*x)&&!(b>0&&this.seekRest(o,i,v&&y>30*x))&&(this.mode=`hover`,this.timer=(1.8+this.random()*3)*(1+2*b)));let O=-Math.cos(this.heading),k=Math.sin(this.heading),A=this.position.map((e,t)=>e+(t===0?O:t===2?k:0)*(.1+this.speed*.8)),j=m&&!this.food,M=m&&this.food?this.feedPlan(S,O,k):null;M?.strike&&C<.006?this.feedHold+=e:this.feedHold=0,this.feedHold>.8&&(this.feedHold=0,this.feedRetry=this.time+iv,M=this.feedPlan(S,O,k));let N=!!M?.strike,P=this.mode===`rise`||this.mode===`gulp`||N,F=!P&&(!r||(i?.airAbove??0)>.25),ee=this.mode===`rest`?this.position[1]-this.restY:0,te=this.mode===`rest`&&!F&&ee>.007,I=te&&b>0,ne=this.mode!==`mirror`&&!m&&(this.mode!==`rest`||te)&&Math.hypot(...A)>o.radius,re=this.obstacles.length&&!F&&this.mode!==`rest`?this.obstacleGap(A):null,ie=re&&!ne?l_(.12000000000000001,.04,re.gap):0,ae=this.target;M?ae=M.goal:j?ae=[...this.position]:P?ae=[this.position[0]+O*.3,S,this.position[2]+k*.3]:this.mode===`dive`?ae=[this.position[0]+O*.2,$(this.position[1]-.25,o.low,o.high),this.position[2]+k*.2]:this.mode===`mirror`?ae=this.mirrorPoint:this.mode===`lap`?ae=this.lapGoal(o):this.mode===`rest`&&(ae=[this.position[0]+O*.3,this.restY,this.position[2]+k*.3]);let oe=ae;!p&&!F&&!P&&!j&&(M||this.mode===`cruise`||this.mode===`glide`||this.mode===`burst`||this.mode===`mirror`||this.mode===`lap`)?ae=this.wayRound(ae,o):this.detour=null;let L=ae!==oe;if(L&&(ie=0),p)ae=[this.position[0]-Math.cos(this.startleHeading)*.3,this.position[1],this.position[2]+Math.sin(this.startleHeading)*.3];else if(ne)ae=[-this.position[0]*.45,$(this.position[1],o.low,o.high),-this.position[2]*.45];else if(ie>0){let e=[this.position[0]+re.away[0]*.3+O*.1,this.position[1]+Math.max(re.away[1],0)*.15,this.position[2]+re.away[2]*.3+k*.1];ae=ae.map((t,n)=>t+(e[n]-t)*ie)}F&&(ae=i?[i.centroid[0],i.centroid[1]-.06,i.centroid[2]]:[this.position[0]*.6,o.low+.025,this.position[2]*.6]);let R=ae.map((e,t)=>e-this.position[t]);T=Math.hypot(...R);let se=c_(Math.atan2(R[2],-R[0])-this.heading)*l_(.03,.12,Math.hypot(R[0],R[2]));if(this.compensateDrift&&!ne&&!ie&&!L&&!F&&(this.mode===`cruise`||this.mode===`glide`||this.mode===`burst`)&&!M&&!j){let e=Math.hypot(R[0],R[2]);if(e>.12){let t=(R[0]*this.drift[2]-R[2]*this.drift[0])/e;se=c_(se+$(Math.atan2(t,Math.max(.08,this.speed)),-.85,.85))}}M&&!L&&(se=c_(M.yaw-this.heading)*l_(.004,.02,M.plan));let ce=this.mode===`mirror`&&this.mirrorArrived&&!F;ce&&(se=c_(this.mirrorFace+this.mirrorSide*.5+.2*Math.sin(2*Math.PI*.55*this.holdClock)-this.heading));let le=(this.mode===`hover`||this.mode===`gulp`||j||this.mode===`rest`&&!te)&&!ne&&!F,ue=le||ce;p||le||Math.abs(se)<.3?this.sharpTurn=!1:Math.abs(se)>1.9&&(this.sharpTurn=!0);let de=p?9:this.sharpTurn?3:.9+this.speed*3,fe=le?0:$(se*(p?10:this.sharpTurn?3.5:1.8),-de,de);for(let t=0;t<3;t++)this.waterSpin[t]=s_(this.waterSpin[t],i?.angular[t]??0,e,5);let pe=p?80:this.sharpTurn?9:3;if(this.steerRate+=$(fe-this.steerRate,-pe*e,pe*e),!p&&!ce&&(this.steerRate=$(this.steerRate,-Math.abs(this.speed)/O_,Math.abs(this.speed)/O_)),!p&&!ce&&this.fold*this.steerRate>0){let e=Math.abs(this.fold),t=l_(j_,M_,e),n=Math.abs(this.speed)*((1-t)/O_+t*$(M_-3*(e-M_),0,M_)/N_);this.steerRate=$(this.steerRate,-n,n)}this.angularVelocity=this.steerRate+this.waterSpin[1]*.8,this.heading+=this.angularVelocity*e,p||h||_?this.yawAccum=0:(this.yawAccum=this.yawAccum*Math.exp(-e/6)+this.steerRate*e,Math.abs(this.yawAccum)>tv&&(this.spinBreaks++,this.yawAccum=0,this.sharpTurn=!1,this.target=this.targetAhead(o,.4)));let me=F||m?0:.2,he=ue?0:$(Math.atan2(R[1],Math.max(me,Math.hypot(R[0],R[2]))),F||m?-.6:-.32,m?.85:.32);te&&(he=-$(.12+2.5*ee,0,.72)*(1-.65*this.slump));let ge=$(w_(this.position[1],this.surfaceY-__),h_-.1/m_,.95);this.mode===`rise`?he=C>.1?.62:ge:this.mode===`gulp`?he=ge:this.mode===`dive`&&(he=-.55),N&&(he=C>.06?.62:ge),p&&this.startleDive&&(he=-.45);let _e=this.pitch,ve=this.roll,ye=-this.waterSpin[2]*Math.cos(this.heading)-this.waterSpin[0]*Math.sin(this.heading),be=p||this.mode===`dive`||P||h||m,xe=this.mode===`dive`&&!p,Se=p?8:xe?3:be?2.4:1.3,Ce=Math.min(Math.abs(this.speed)/k_,be?1/0:.5),we=$((he-this.pitch)*Se,-Ce,Ce),Te=(we-this.pitchSpeed)*this.pitchSpeed<0,Ee=(p?80:xe?4:be?6:Te?2.4:1.2)*e;this.pitchSpeed=$(this.pitchSpeed+$(we-this.pitchSpeed,-Ee,Ee),-Ce,Ce),this.pitch=$(this.pitch+this.pitchSpeed*e+ye*e*.8,-.75,h||N?.95:.75);let De=this.waterSpin[0]*Math.cos(this.heading)-this.waterSpin[2]*Math.sin(this.heading),Oe=b>0&&this.mode===`rest`&&this.restSettled?.32*b*this.restSide*l_(0,3,this.holdClock):0;this.roll=$(s_(this.roll,Oe,e,2.6)+De*e*.8,-.65,.65),this.pitchRate=(this.pitch-_e)/e,this.rollRate=(this.roll-ve)/e;let ke=Math.min(.09,$(1.2*(ee-.004),0,.06)/Math.max(.1,Math.sin(-he))),z=te?ke*(1-Z_*this.slump):this.mode===`burst`?.19*(1-.4*b):this.mode===`glide`?.04:m?.21*(1-.5*b):this.cruiseSpeed;ue?z=0:z*=(.12+.88*Math.max(0,Math.cos(se)))*$((L?Math.hypot(...oe.map((e,t)=>e-this.position[t])):T)/.14,.25,1),this.mode===`rise`?z=C>0?$(C*2.5,.006,.2):0:this.mode===`gulp`?z=C>.002?$(C*3,0,.03):0:this.mode===`dive`?z=this.pitch>.12?-.13*$((this.pitch-.12)/.35,.2,1):.17:N&&(z=C>0?$(C*2.5,.01,.14):0),p&&(z=Q_*Math.max(0,Math.cos(se))**2*Math.exp(-Math.max(0,this.startleClock-.12)/.45)*(1-.5*b)),F&&(z=Math.max(z,.16));let Ae=this.mode===`rest`&&!te;!p&&z>=0&&!P&&this.mode!==`gulp`&&!j&&!Ae&&!ce&&(z=Math.max(z,Math.min(A_,Math.max(Math.abs(fe)*O_,Math.abs(he-this.pitch)*Se*k_))));let je=z,Me=s_(this.speed,z,e,p?14:z>this.speed?2.8:3.5);!p&&a!==null&&Me>this.speed&&(Me=Math.min(Me,this.speed+ev*$(a,0,1)*e)),this.speed=Me;let B=i?.submerged??+!!r;if(B>0)for(let n=0;n<3;n++)this.drift[n]=s_(this.drift[n],t[n],e,1/.9);let Ne=Math.hypot(...this.drift),V=Math.max(0,Ne-.063);if(B>.99&&V>0)for(let t=0;t<3;t++)this.drift[t]*=1-Math.min(1,1.6*e*V/Ne);let Pe=l_(.35,.9,1-B);if(i&&Pe>0)for(let t=0;t<3;t++)this.drift[t]+=(n.gravity?.[t]??(t===1?-24:0))*Pe*e;let Fe=Math.hypot(...this.drift);if(Fe>1.2)for(let e=0;e<3;e++)this.drift[e]*=1.2/Fe;let Ie=[-Math.cos(this.heading)*Math.cos(this.pitch),Math.sin(this.pitch),Math.sin(this.heading)*Math.cos(this.pitch)],Le=[...this.position];for(let t=0;t<3;t++)this.position[t]+=(Ie[t]*this.speed+this.drift[t])*e;if(I&&(this.position[1]-=this.slump*$(J_*ee,Y_,X_)*e),this.mode===`rest`&&this.restSettled)for(let t=0;t<3;t++)this.drift[t]*=Math.exp(-4*e);else if(ue&&B>.99&&Math.hypot(...t)<$_)for(let t=0;t<3;t++)this.drift[t]*=Math.exp(-3*e);let Re=this.mode===`gulp`?T_(this.gulpClock):m?this.gape:0,ze=this.mode===`gulp`?E_(this.gulpClock):0;this.gulp=s_(this.gulp,Re,e,25),this.gulpGill=s_(this.gulpGill,ze,e,25);let Be=i?i.sand+.07*m_:o.low;this.position[1]=$(this.position[1],Be,i?n.radius-.25:o.high),this.position[1]<=Be&&this.drift[1]<0&&(this.drift[1]=0);let Ve=Math.hypot(this.position[0],this.position[2]),He=i?n.radius-(m?.2:.29):o.radius;this.position[1]=$(this.position[1],-He,He);let Ue=Math.sqrt(Math.max(0,He**2-this.position[1]**2));if(Ve>Ue){this.position[0]*=Ue/Ve,this.position[2]*=Ue/Ve;let e=Math.hypot(...this.position),t=this.drift.reduce((t,n,r)=>t+n*this.position[r]/e,0);if(t>0)for(let n=0;n<3;n++)this.drift[n]-=t*this.position[n]/e}for(let e of this.obstacles){let t=d_(this.position,e.a,e.b),n=this.position.map((e,n)=>e-t[n]),r=Math.hypot(...n),i=e.r*.6;if(r>=i||r<1e-9)continue;let a=n.map(e=>e/r),o=this.drift.reduce((e,t,n)=>e+t*a[n],0);for(let e=0;e<3;e++)this.position[e]=t[e]+a[e]*i,o<0&&(this.drift[e]-=o*a[e])}let We=[-Math.cos(this.heading)*Math.cos(this.pitch),Math.sin(this.pitch),Math.sin(this.heading)*Math.cos(this.pitch)].map(e=>e*P_);for(let e of this.obstacles){if(!e.leaf)continue;let t=this.position.map((e,t)=>e+We[t]),n=d_(t,e.a,e.b),r=t.map((e,t)=>e-n[t]),i=Math.hypot(...r),a=e.r*.6;if(i>=a||i<1e-9)continue;let o=r.map(e=>e/i),s=this.drift.reduce((e,t,n)=>e+t*o[n],0);for(let e=0;e<3;e++)this.position[e]+=o[e]*(a-i),s<0&&(this.drift[e]-=s*o[e])}this.velocity=this.position.map((t,n)=>(t-Le[n])/e);let Ge=p?Math.max(this.speed,je):je,Ke=je>.004&&(le||this.mode===`glide`);this.drive=this.mode===`glide`&&!Ke?.065:ce?.08:Ae?.03:le&&!Ke?.045:$(.07+Ge*1.4+Math.abs(this.steerRate)*.06+Math.abs(this.pitchSpeed)*.3,.045,.4)}},ov=[[-1.4,0,0],[-1,0,0],[-.5,0,0],[0,0,0],[.5,0,0],[1,0,0],[-.3,.5,0],[.5,.5,0],[2,-.15,0],[-1.9,0,0],[-2.3,0,0],[-1.7,.6,0],[-1.7,-.5,0],[-.4,0,.6],[-.4,0,-.6],[0,1.2,0]],sv=.016,cv=(e,t=new Float32Array(8))=>{for(let n=0;n<8;n++)t[n]=e+(n-7/2)*sv;return t},lv=(e,t,n)=>Math.max(t,Math.min(n,e)),uv=(e,t)=>{let n=Math.hypot(...e);return n>t?e.map(e=>e*t/n):e};function dv(e,t,n,r){let i={flow:[0,0,0],angular:[0,0,0],submerged:1,airAbove:0,surface:null,sand:n.sandLevel,centroid:[0,(n.sandLevel+n.level)/2,0]};if(!e)return i;i.centroid=[...e.centroid],i.surface=r===void 0?fv(e,n):r;let a=[],o=[0,0,0],s=[0,0,0],c=0,l=-1/0;for(let r=0;r<16;r++){let u=r*4,d=e.probes[u+3];if(r<6&&(d>=n.iso&&c++,Number.isFinite(e.sand[r])&&(l=Math.max(l,e.sand[r]))),(r===6||r===7||r===15)&&(i.airAbove=Math.max(i.airAbove,lv(1-d/n.iso,0,1)*(r===15?.6:1))),!(d<n.iso||![0,1,2].every(t=>Number.isFinite(e.probes[u+t])))){a.push(r);for(let n=0;n<3;n++)o[n]+=t[u+n],s[n]+=e.probes[u+n]}}if(i.submerged=c/6,Number.isFinite(l)&&(i.sand=l),!a.length)return i;for(let e=0;e<3;e++)o[e]/=a.length,s[e]/=a.length;i.flow=uv(s,3);let u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;for(let n of a){let r=n*4,i=t[r]-o[0],a=t[r+1]-o[1],c=t[r+2]-o[2],l=e.probes[r]-s[0],y=e.probes[r+1]-s[1],b=e.probes[r+2]-s[2];u+=a*a+c*c,d-=i*a,f-=i*c,p+=i*i+c*c,m-=a*c,h+=i*i+a*a,g+=a*b-c*y,_+=c*l-i*b,v+=i*y-a*l}let y=u*(p*h-m*m)-d*(d*h-f*m)+f*(d*m-f*p);return Math.abs(y)>1e-12&&(i.angular=uv([((p*h-m*m)*g+(f*m-d*h)*_+(d*m-f*p)*v)/y,((f*m-d*h)*g+(u*h-f*f)*_+(d*f-u*m)*v)/y,((d*m-f*p)*g+(d*f-u*m)*_+(u*p-d*d)*v)/y],5)),i}function fv(e,t){let n=cv(t.level),r=NaN;for(let i=0;i<8;i++){let a=e.probes[(16+i)*4+3];if(!Number.isFinite(a)||i===0&&a<t.iso)return null;if(i>0&&r>=t.iso&&a<t.iso){let e=(r-t.iso)/Math.max(1e-6,r-a);return n[i-1]+(n[i]-n[i-1])*e}r=a}return null}var pv=1e3/60,mv=4,hv=4,gv=class{due=-1/0;seen=-1/0;calls=0;refresh=pv;frameMs=pv;draw(e){let t=e-this.seen;if(this.seen=e,++this.calls>2&&t>=hv&&(this.refresh=Math.min(t,this.refresh*1.01)),e<this.due-mv)return!1;let n=e-this.due>this.frameMs||t>1.5*this.refresh&&e-this.refresh>=this.due-mv;return this.due=(n?e:this.due)+this.frameMs,!0}},_v=class{variety;onChange=null;button;name;menu;constructor(e){this.variety=Ag(()=>localStorage);let t=this.button=document.createElement(`button`);t.type=`button`,t.className=`variety-button`,t.setAttribute(`aria-haspopup`,`dialog`),t.setAttribute(`aria-expanded`,`false`),t.title=`Choose the fish’s colours`,t.innerHTML=`Living Silk · <span class="variety-name"></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`,this.name=t.querySelector(`.variety-name`),t.addEventListener(`click`,()=>this.toggle()),e.prepend(t);let n=this.menu=document.createElement(`div`);n.className=`variety-menu`,n.setAttribute(`role`,`dialog`),n.setAttribute(`aria-label`,`Variety`),n.hidden=!0;let r=document.createElement(`div`);r.className=`variety-list`,r.setAttribute(`role`,`radiogroup`),r.setAttribute(`aria-label`,`Variety`);for(let e of Og){let t=document.createElement(`label`);t.className=`variety-option`;let n=document.createElement(`input`);n.type=`radio`,n.name=`variety`,n.value=e.id,n.addEventListener(`change`,()=>this.set(e.id)),t.addEventListener(`click`,e=>{e.detail>0&&this.close(!1)});let i=document.createElement(`span`);i.className=`variety-swatch`,i.style.setProperty(`--body`,e.swatch[0]),i.style.setProperty(`--fins`,e.swatch[1]);let a=document.createElement(`span`);a.textContent=e.name,t.append(n,i,a),r.append(t)}n.append(r),e.append(n),document.addEventListener(`pointerdown`,e=>{!n.hidden&&!n.contains(e.target)&&!t.contains(e.target)&&this.close(!1)}),window.addEventListener(`keydown`,e=>{e.key!==`Escape`||n.hidden||(e.stopPropagation(),this.close(!0))},!0),this.label()}toggle(){this.menu.hidden?this.open():this.close(!1)}open(){for(let e of this.menu.querySelectorAll(`input`))e.checked=e.value===this.variety;this.menu.hidden=!1,this.button.setAttribute(`aria-expanded`,`true`),this.menu.querySelector(`input:checked`)?.focus()}close(e){this.menu.hidden=!0,this.button.setAttribute(`aria-expanded`,`false`),e&&this.button.focus()}set(e){this.variety=e,jg(()=>localStorage,e),this.label(),this.onChange?.(e)}label(){let e=Mg(this.variety).name;this.name.textContent=e,this.button.setAttribute(`aria-label`,`Living Silk, ${e}: choose the variety`)}},vv=`betta.night`,yv=.3;function bv(e){try{return e().getItem(vv)===`1`}catch{return!1}}function xv(e,t){try{e().setItem(vv,t?`1`:`0`)}catch{}}var Sv=class{constructor(e=!1){this.on=e,this.progress=+!!e}set(e){this.on=e}step(e){let t=(this.on?1:-1)*Math.max(e,0)/2;return this.progress=Math.min(Math.max(this.progress+t,0),1),this.value}get value(){let e=this.progress;return e*e*(3-2*e)}};function Cv(e,t,n){let r=yv*t;return r>e.lethargy?(Object.assign(n,e),n.lethargy=r,n):e}var wv=class{on;onChange=null;button;constructor(e,t){this.on=t;let n=this.button=document.createElement(`button`);n.type=`button`,n.className=`night-button`,n.title=`Turn the room’s lights off: the lamp’s blue night light, the fish asleep`,n.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5a8.6 8.6 0 1 0 10.8 10.8z"/></svg><span class="pill-text">Night</span>`,n.setAttribute(`aria-label`,`Night`),n.setAttribute(`aria-pressed`,String(t)),n.addEventListener(`click`,()=>this.set(!this.on)),e.append(n)}set(e){this.on=e,this.button.setAttribute(`aria-pressed`,String(e)),xv(()=>localStorage,e),this.onChange?.(e)}},Tv=class{on=!1;onChange=null;button;constructor(e){let t=this.button=document.createElement(`button`);t.type=`button`,t.className=`follow-button`,t.title=`Zoom in close on the fish and follow it as it swims`,t.setAttribute(`aria-label`,`Follow the fish`),t.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="1.6"/><path d="M12 2.5v3.2M12 18.3v3.2M2.5 12h3.2M18.3 12h3.2"/></svg><span class="pill-text">Follow</span>`,t.setAttribute(`aria-pressed`,`false`),t.addEventListener(`click`,()=>this.set(!this.on)),e.append(t),window.addEventListener(`keydown`,e=>{e.key===`Escape`&&this.on&&this.set(!1)})}set(e){e!==this.on&&(this.on=e,this.button.setAttribute(`aria-pressed`,String(e)),this.onChange?.(e))}},Ev=-3.4,Dv={wallEdge:[.003,.014,.04],wallMid:[.014,.07,.16],wallCore:[.045,.17,.33],wallFoot:[.03,.04,.05],wallTop:.6,roomLow:[.01,.026,.046],roomHigh:[.02,.045,.075],softbox:[1,.97,.92],strip:[.85,.92,1],top:[.9,.92,.95],pool:[1,.44,.09],poolMottle:1,grain:0,leafDim:1,leafGrey:0,tableRoom:[.18,.3,.42],tableEdge:[.05,.08,.11],lamp:[1,1,1],beam:[1,1,1],ambient:[1,1,1],key:[1,1,1]},Ov={wallEdge:[9e-4,.003,.012],wallMid:[.002,.0065,.022],wallCore:[.0045,.014,.042],wallFoot:[.003,.006,.014],wallTop:.45,roomLow:[.0012,.0025,.0055],roomHigh:[.0022,.0045,.0095],softbox:[.03,.034,.042],strip:[.026,.031,.04],top:[.03,.034,.042],pool:[.05,.11,.28],poolMottle:2.5,grain:.12,leafDim:.62,leafGrey:.38,tableRoom:[.006,.01,.02],tableEdge:[.004,.007,.013],lamp:[.17,.23,.6],beam:[.4,.56,1],ambient:[.02,.034,.07],key:[.03,.036,.05]},kv=[`wallEdge`,`wallMid`,`wallCore`,`wallFoot`,`roomLow`,`roomHigh`,`softbox`,`strip`,`top`,`pool`,`tableRoom`,`tableEdge`,`lamp`,`beam`,`ambient`,`key`],Av=[`wallTop`,`poolMottle`,`grain`,`leafDim`,`leafGrey`];function jv(e,t){let n=(t,n)=>t>0?t*(n/t)**e:n*e;return kv.forEach((e,r)=>{for(let i=0;i<3;i++)t[4*r+i]=n(Dv[e][i],Ov[e][i])}),Av.forEach((e,r)=>t[4*r+3]=n(Dv[e],Ov[e])),t}var Mv=e=>`studio${e[0].toUpperCase()}${e.slice(1)}`,Nv=`, studioLight0: mat4x4f, studioLight1: mat4x4f, studioLight2: mat4x4f, studioLight3: mat4x4f`,Pv=`studioLight0, studioLight1, studioLight2, studioLight3`,Fv=`
const STUDIO_TABLE_Y: f32 = ${(-1).toFixed(4)};
const STUDIO_WALL_Z: f32 = ${Ev.toFixed(4)};

// Where the bowl stands (its centre, world): the table's pool of lamp light and its shade under
// the glass follow it.
var<private> studioBowl: vec3f = vec3f(0.0);

// The studio's light (studio.ts StudioLight: by day, by night, or on the way between), set by each
// entry point from its uniforms (studio_light). (Read where literals were: each of these functions is
// copied into every place it is called from, and a name is shorter.)
${kv.map(e=>`var<private> ${Mv(e)}: vec3f;`).join(`
`)}
${Av.map(e=>`var<private> ${Mv(e)}: f32;`).join(`
`)}

fn studio_light(a: mat4x4f, b: mat4x4f, c: mat4x4f, d: mat4x4f) {
${kv.map((e,t)=>`  ${Mv(e)} = ${`abcd`[t>>2]}[${t&3}].xyz;`).join(`
`)}
${Av.map((e,t)=>`  ${Mv(e)} = ${`abcd`[t>>2]}[${t&3}].w;`).join(`
`)}
}

// atan2(y, x), given an angle where both are 0 (straight up; right under the bowl's middle): a GPU
// that follows SPIR-V's rules need not give a number there. (Nor for a smoothstep whose edges run
// the wrong way round: those falling here are 1 - a rising one.)
fn studio_atan2(y: f32, x: f32) -> f32 {
  return atan2(y, select(x, 1e-20, x == 0.0 && y == 0.0));
}

// The backdrop: blue paper, lit brightest behind the bowl a little above it, falling off to the
// sides and darker towards the top.
fn studio_wall(x: vec3f) -> vec3f {
  let q = vec2f((x.x - studioBowl.x * 0.35) / 4.6, (x.y - 0.35) / 2.9);
  let glow = exp(-dot(q, q));
  var c = mix(studioWallEdge, studioWallMid, smoothstep(0.0, 0.55, glow));
  c = mix(c, studioWallCore, smoothstep(0.5, 1.0, glow));
  // (Where the paper sweeps down into the table, the table's own glow lifts it a little.)
  let foot = exp(-max(x.y - STUDIO_TABLE_Y, 0.0) * 3.0);
  c += studioWallFoot * foot * exp(-x.x * x.x / 9.0);
  return c * mix(1.0, studioWallTop, smoothstep(1.2, 4.0, x.y));
}

// A rectangular soft box seen along d: 1 inside it (half-size: its half-width and half-height, in
// radians about), its edges soft; axis: where it is, upright.
fn studio_softbox(d: vec3f, axis: vec3f, half: vec2f) -> f32 {
  let ahead = dot(d, axis);
  if (ahead <= 0.0) { return 0.0; }
  let right = normalize(cross(axis, vec3f(0.0, 1.0, 0.0)));
  let up = cross(right, axis);
  let q = vec2f(dot(d, right), dot(d, up)) / ahead;
  return (1.0 - smoothstep(half.x * 0.45, half.x, abs(q.x))) * (1.0 - smoothstep(half.y * 0.45, half.y, abs(q.y)));
}

// The studio round the set, away from the backdrop: dim blue, with the soft boxes whose
// reflections give the glass its sheen (a broad one high on the left in front, a strip on the
// right, one overhead).
fn studio_room(d: vec3f) -> vec3f {
  var c = mix(studioRoomLow, studioRoomHigh, clamp(d.y * 0.5 + 0.5, 0.0, 1.0));
  c += studioSoftbox * (2.6 * studio_softbox(d, normalize(vec3f(-0.6, 0.7, 0.4)), vec2f(0.12, 0.2)) + 0.08 * pow(max(dot(d, normalize(vec3f(-0.55, 0.62, 0.56))), 0.0), 8.0));
  // (The strip: a narrow band of bearing on the right towards the front, most of the way up.)
  let bearing = studio_atan2(d.x, d.z);
  c += studioStrip * 1.8 * (1.0 - smoothstep(0.035, 0.07, abs(bearing - 1.15))) * (1.0 - smoothstep(0.55, 0.75, abs(d.y - 0.1)));
  let top = max(d.y, 0.0);
  c += studioTop * 0.45 * pow(top, 24.0);
  return c;
}

// Light falling on the table at x: the lamp's light the bowl gathers and spills round its foot (a
// pool, warm by day and blue by night, brightest in a ring just outside the glass, mottled by the
// water's caustics), the
// glass's foot shading the table right under it, and the room's dim blue.
fn studio_tableLight(x: vec3f) -> vec3f {
  let d = x.xz - studioBowl.xz;
  let r = length(d);
  let a = studio_atan2(d.y, d.x);
  let mottle = 0.85 + 0.15 * sin(a * 5.0 + 2.0 * sin(r * 9.0)) * sin(r * 13.0 - a * 3.0);
  let k = (r - 0.6) / 0.26;
  let ring = exp(-k * k);
  let core = exp(-r * r / 0.2);
  let fade = exp(-max(r - 0.9, 0.0) * 2.5);
  var e = studioPool * (30.0 * ring * mix(1.0, mottle, studioPoolMottle) + 16.0 * core) * fade;
  e *= mix(0.4, 1.0, smoothstep(0.02, 0.2, r));
  return e + studioTableRoom;
}

// The table at x: a dark blue-grey lacquer lit by the pool and the room (what its gloss mirrors,
// studio_view adds; the app's table adds the bowl's own reflection over it: StudioBackdrop.ts).
fn studio_table(x: vec3f) -> vec3f {
  let albedo = vec3f(0.034, 0.040, 0.050);
  var c = albedo * studio_tableLight(x) / 3.14159265;
  // (Its far edge, where it meets the backdrop, catches a thin line of light.)
  c += studioTableEdge * (1.0 - smoothstep(0.0, 0.06, x.z - STUDIO_WALL_Z));
  return c;
}

// What lies beyond the table along d from o: the backdrop, or the room.
fn studio_far(o: vec3f, d: vec3f) -> vec3f {
  if (d.z < -1e-4) {
    let t = (STUDIO_WALL_Z - o.z) / d.z;
    let x = o + d * t;
    if (x.y >= STUDIO_TABLE_Y) { return studio_wall(x); }
  }
  return studio_room(d);
}

// What a ray from o (world) heading along d sees of the studio: the table, and when gloss what it
// mirrors of the backdrop and the room; or what lies beyond it. (One look beyond, either way: a
// shader holds a copy of this for every place it is called from, shaders.ts globesZero.)
fn studio_view(o: vec3f, d: vec3f, gloss: bool) -> vec3f {
  var c = vec3f(0.0);
  var w = 1.0;
  var fo = o;
  var fd = d;
  if (d.y < -1e-5 && o.y > STUDIO_TABLE_Y) {
    let t = (STUDIO_TABLE_Y - o.y) / d.y;
    let x = o + d * t;
    if (x.z > STUDIO_WALL_Z) {
      c = studio_table(x);
      w = select(0.0, 0.04 + 0.96 * pow(1.0 - clamp(-d.y, 0.0, 1.0), 5.0), gloss);
      fo = x;
      fd = vec3f(d.x, -d.y, d.z);
    }
  }
  if (w > 0.0) { c += w * studio_far(fo, fd); }
  return c;
}
`,Iv=8,Lv=.016,Rv=.15,zv=.08,Bv=.9,Vv=.006,Hv=.5,Uv=1.25,Wv=.08,Gv=.25,Kv=1.2,qv=9,Jv=9,Yv=.5,Xv=.6,Zv=(e,t,n,r)=>e+(t-e)*(1-Math.exp(-r*n)),Qv=class{radius;matrix=new fn;points=new Float32Array(128);leaf={x:-.2,z:.34,y:NaN,yaw:.4,vx:0,vz:0,spin:0,sx:0,sz:0};nestCount=Math.round(Ef.length*.85);nestY=NaN;nestAz=0;lastMode=``;rand=.5;tending=1;constructor(e){this.radius=e}get bubbles(){return Math.round(this.nestCount)}get nestNeed(){return this.tending<Yv?0:Math.max(0,Math.min(1,1-this.nestCount/(Ef.length*.85)))}update(e,t,n,r,i,a,o){if(!(e>0)){this.write(n);return}let s=this.leaf,c=e=>t?$v(t.probes,24+e*Iv,n,r):null,l=i[0]*Math.cos(Uv)+i[6]*Math.sin(Uv),u=i[2]*Math.cos(Uv)+i[8]*Math.sin(Uv);this.nestAz=Math.atan2(u,l);let d=c(3);a>Kv&&(this.nestCount=Math.max(0,this.nestCount-qv*(a-Kv)*e)),d!==null&&(this.nestY=Number.isFinite(this.nestY)?Zv(this.nestY,d,e,10):d),this.tending<Yv?this.nestCount=Math.max(0,this.nestCount-Xv*e):this.lastMode===`gulp`&&o===`dive`&&(this.nestCount=Math.min(Ef.length,this.nestCount+Jv)),this.lastMode=o;let f=c(0);if(f!==null){s.y=Number.isFinite(s.y)?Zv(s.y,f,e,10):f;let t=c(1),n=c(2),r=Math.cos(s.yaw),i=Math.sin(s.yaw),a=t===null?0:(t-f)/Rv,o=n===null?0:(n-f)/zv;s.sx=Zv(s.sx,Vt.clamp(r*a-i*o,-.6,.6),e,8),s.sz=Zv(s.sz,Vt.clamp(i*a+r*o,-.6,.6),e,8)}Number.isFinite(s.y)||(s.y=n);let p=t?ey(t.probes,24,r):null,m=p?p[0]:0,h=p?p[2]:0,g=Math.hypot(s.x,s.z),_=g>1e-6?s.x/g:1,v=g>1e-6?s.z/g:0;s.vx=Zv(s.vx,m+_*Vv,e,1/Bv),s.vz=Zv(s.vz,h+v*Vv,e,1/Bv),s.x+=s.vx*e,s.z+=s.vz*e,this.rand=(this.rand*9301+49297)%233280,s.spin=Zv(s.spin,(this.rand/233280-.5)*.12,e,.4),s.yaw+=s.spin*e;let y=Math.sqrt(Math.max(.01,this.radius*this.radius-s.y*s.y))-.012,b=(e,t)=>Math.abs(e*Math.cos(s.yaw)+t*Math.sin(s.yaw))*.5*Af.length+Math.abs(-e*Math.sin(s.yaw)+t*Math.cos(s.yaw))*Af.width,x=Math.hypot(s.x,s.z),S=x>1e-6?s.x/x:1,C=x>1e-6?s.z/x:0,w=y-b(S,C);if(x>w){s.x=S*w,s.z=C*w;let t=s.vx*S+s.vz*C;t>0&&(s.vx-=t*S,s.vz-=t*C);let n=Math.atan2(S,-C),r=Math.atan2(Math.sin(2*(n-s.yaw)),Math.cos(2*(n-s.yaw)))/2;s.spin=Zv(s.spin,r*Hv*2,e,2)}let T=Number.isFinite(this.nestY)?this.nestY:n,E=Math.sqrt(Math.max(.01,this.radius*this.radius-T*T)),D=Math.cos(this.nestAz)*(E-Gv*.5),O=Math.sin(this.nestAz)*(E-Gv*.5),k=s.x-D,A=s.z-O,j=Math.hypot(k,A),M=Gv+.5*b(j>1e-6?k/j:1,j>1e-6?A/j:0);if(this.nestCount>4&&j<M){let e=j>1e-6?(M-j)/j:0;s.x+=k*e,s.z+=A*e}this.write(n)}probePoints(){return this.points}write(e){let t=this.leaf,n=Math.cos(t.yaw),r=Math.sin(t.yaw),i=Number.isFinite(this.nestY)?this.nestY:e,a=Math.sqrt(Math.max(.01,this.radius*this.radius-i*i)),o=Math.cos(this.nestAz)*(a-.003),s=Math.sin(this.nestAz)*(a-.003);[[t.x,t.z],[t.x+n*Rv,t.z+r*Rv],[t.x-r*zv,t.z+n*zv],[o-Math.cos(this.nestAz)*Wv,s-Math.sin(this.nestAz)*Wv]].forEach(([t,n],r)=>{for(let i=0;i<Iv;i++)this.points.set([t,e+(i-7/2)*Lv,n,0],(r*Iv+i)*4)});let c=this.matrix.elements;c.fill(0),c[0]=t.x,c[1]=Number.isFinite(t.y)?t.y:e,c[2]=t.z,c[3]=t.yaw,c[4]=1,c[5]=t.sx,c[6]=t.sz,c[8]=o,c[9]=i,c[10]=s,c[11]=this.nestAz,c[12]=this.nestCount}};function $v(e,t,n,r){let i=NaN;for(let a=0;a<Iv;a++){let o=e[(t+a)*4+3];if(!Number.isFinite(o)||a===0&&o<r)return null;if(a>0&&i>=r&&o<r)return n+(a-1-7/2)*Lv+Lv*((i-r)/Math.max(1e-6,i-o));i=o}return null}function ey(e,t,n){let r=-1;for(let i=0;i<Iv;i++)e[(t+i)*4+3]>=n&&(r=(t+i)*4);return r<0?null:[e[r],e[r+1],e[r+2]]}export{Dd as $,a as $n,M as $r,Ke as $t,qg as A,w as Ai,bo as An,ye as Ar,cu as At,fh as B,$e as Bi,Vt as Bn,F as Br,Xi as Bt,C_ as C,ta as Ci,_ as Cn,Ee as Cr,Pu as Ct,Lg as D,p as Di,tt as Dn,ge as Dr,Iu as Dt,Rg as E,ca as Ei,nt as En,he as Er,ju as Et,Ig as F,K as Fi,d as Fn,oe as Fr,Yi as Ft,Af as G,ot as Gi,ui as Gn,ae as Gr,wo as Gt,Mm as H,ct as Hi,J as Hn,ke as Hr,Y as Ht,Mg as I,q as Ii,u as In,I as Ir,Mr as It,Of as J,ft as Ji,_a as Jn,N as Jr,Zi as Jt,Ef as K,ut as Ki,va as Kn,ie as Kr,qi as Kt,Eg as L,sn as Li,Be as Ln,ne as Lr,Jr as Lt,n_ as M,x as Mi,Sa as Mn,De as Mr,_o as Mt,Hg as N,S as Ni,l as Nn,ce as Nr,To as Nt,Ug as O,T as Oi,Ye as On,_e as Or,Eu as Ot,Og as P,g as Pi,f as Pn,L as Pr,lr as Pt,Wd as Q,ga as Qn,j as Qr,Or as Qt,bh as R,Qe as Ri,Ve as Rn,re as Rr,m as Rt,av as S,et as Si,Pi as Sn,Te as Sr,ku as St,u_ as T,Pr as Ti,Zr as Tn,me as Tr,Au as Tt,ap as U,U as Ui,fn as Un,R as Ur,Yt as Ut,jm as V,Hn as Vi,Uo as Vn,Oe as Vr,i as Vt,kf as W,Wo as Wi,Si as Wn,se as Wr,rt as Wt,_f as X,ma as Xn,Bo as Xr,un as Xt,Tf as Y,pt as Yi,ha as Yn,P as Yr,dn as Yt,vf as Z,pa as Zn,vo as Zr,Ti as Zt,gv as _,ea as _i,Ge as _n,ee as _r,$u as _t,Ov as a,$i as ai,Ze as an,co as ar,fd as at,dv as b,Xe as bi,xo as bn,Se as br,Xu as bt,jv as c,Ae as ci,Fr as cn,po as cr,bd as ct,yv as d,He as di,Ui as dn,le as dr,rd as dt,it as ei,Je as en,o as er,Ed as et,Sv as f,Jn as fi,Ri as fn,bt as fr,id as ft,pv as g,Br as gi,Xa as gn,O as gr,Qu as gt,_v as h,h as hi,b as hn,de as hr,td as ht,Nv as i,ht as ii,go as in,mo as ir,od as it,o_ as j,v as ji,Vi as jn,be as jr,E as jt,Wg as k,C as ki,Ue as kn,ve as kr,Ou as kt,Tv as l,fe as li,Ir as ln,Hi as lr,gd as lt,bv as m,na as mi,Bn as mn,z as mr,ad as mt,Dv as n,r as ni,A as nn,s as nr,Fd as nt,Ev as o,ue as oi,gt as on,ti as or,cd as ot,Cv as p,da as pi,Bi as pn,je as pr,nd as pt,Mf as q,H as qi,xa as qn,te as qr,Wi as qt,Pv as r,We as ri,Ki as rn,zn as rr,Md as rt,Fv as s,Me as si,Ji as sn,Qi as sr,Cd as st,Qv as t,cn as ti,k as tn,c as tr,Ad as tt,wv as u,ze as ui,y as un,Ht as ur,md as ut,ov as v,uo as vi,qe as vn,we as vr,Zu as vt,p_ as w,Nr as wi,Yr as wn,pe as wr,Nu as wt,f_ as x,on as xi,Ro as xn,Ce as xr,Hu as xt,cv as y,ii as yi,Ei as yn,xe as yr,ed as yt,hh as z,ln as zi,ri as zn,D as zr,Gi as zt};