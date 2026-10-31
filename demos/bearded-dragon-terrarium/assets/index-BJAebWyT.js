(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},t={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},n=`attached`,r=`detached`,i=1e3,a=1001,o=1002,s=1003,c=1004,l=1005,u=1006,d=1007,f=1008,p=1009,m=1010,h=1011,g=1012,_=1013,v=1014,y=1015,b=1016,x=1017,S=1018,C=1020,w=35902,T=35899,E=1021,D=1022,O=1023,k=1026,A=1027,j=1028,ee=1029,M=1030,N=1031,te=1033,P=33776,ne=33777,F=33778,re=33779,ie=35840,ae=35841,oe=35842,se=35843,I=36196,ce=37492,le=37496,ue=37488,de=37489,fe=37490,pe=37491,me=37808,he=37809,ge=37810,_e=37811,ve=37812,ye=37813,be=37814,xe=37815,Se=37816,Ce=37817,we=37818,Te=37819,Ee=37820,De=37821,Oe=36492,ke=36494,Ae=36495,je=36283,L=36284,Me=36285,Ne=36286,Pe=2300,R=2301,Fe=2302,z=2303,Ie=2400,Le=2401,Re=2402,ze=3200,Be=`srgb`,Ve=`srgb-linear`,He=`linear`,Ue=`srgb`,We=7680,Ge=35044,Ke=35048,qe=2e3;function Je(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Ye(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Xe(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Ze(){let e=Xe(`canvas`);return e.style.display=`block`,e}var Qe={};function $e(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function et(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function B(...e){e=et(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function V(...e){e=et(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function tt(...e){let t=e.join(` `);t in Qe||(Qe[t]=!0,B(...e))}function nt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var rt={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},it=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},at=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),ot=1234567,st=Math.PI/180,ct=180/Math.PI;function lt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(at[e&255]+at[e>>8&255]+at[e>>16&255]+at[e>>24&255]+`-`+at[t&255]+at[t>>8&255]+`-`+at[t>>16&15|64]+at[t>>24&255]+`-`+at[n&63|128]+at[n>>8&255]+`-`+at[n>>16&255]+at[n>>24&255]+at[r&255]+at[r>>8&255]+at[r>>16&255]+at[r>>24&255]).toLowerCase()}function H(e,t,n){return Math.max(t,Math.min(n,e))}function ut(e,t){return(e%t+t)%t}function dt(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function ft(e,t,n){return e===t?0:(n-e)/(t-e)}function pt(e,t,n){return(1-n)*e+n*t}function mt(e,t,n,r){return pt(e,t,1-Math.exp(-n*r))}function ht(e,t=1){return t-Math.abs(ut(e,t*2)-t)}function gt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function _t(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function vt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function yt(e,t){return e+Math.random()*(t-e)}function bt(e){return e*(.5-Math.random())}function xt(e){e!==void 0&&(ot=e);let t=ot+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function St(e){return e*st}function Ct(e){return e*ct}function wt(e){return!(e&e-1)&&e!==0}function Tt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Et(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Dt(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:B(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Ot(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function kt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var U={DEG2RAD:st,RAD2DEG:ct,generateUUID:lt,clamp:H,euclideanModulo:ut,mapLinear:dt,inverseLerp:ft,lerp:pt,damp:mt,pingpong:ht,smoothstep:gt,smootherstep:_t,randInt:vt,randFloat:yt,randFloatSpread:bt,seededRandom:xt,degToRad:St,radToDeg:Ct,isPowerOfTwo:wt,ceilPowerOfTwo:Tt,floorPowerOfTwo:Et,setQuaternionFromProperEuler:Dt,normalize:kt,denormalize:Ot},W=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=H(this.x,e.x,t.x),this.y=H(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=H(this.x,e,t),this.y=H(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(H(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(H(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},At=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:B(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(H(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},G=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Mt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Mt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=H(this.x,e.x,t.x),this.y=H(this.y,e.y,t.y),this.z=H(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=H(this.x,e,t),this.y=H(this.y,e,t),this.z=H(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(H(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return jt.copy(this).projectOnVector(e),this.sub(jt)}reflect(e){return this.sub(jt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(H(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},jt=new G,Mt=new At,Nt=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return tt(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Pt.makeScale(e,t)),this}rotate(e){return tt(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Pt.makeRotation(-e)),this}translate(e,t){return tt(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Pt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Pt=new Nt,Ft=new Nt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),It=new Nt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Lt(){let e={enabled:!0,workingColorSpace:Ve,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=zt(e.r),e.g=zt(e.g),e.b=zt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Bt(e.r),e.g=Bt(e.g),e.b=Bt(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?He:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return tt(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return tt(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Ve]:{primaries:t,whitePoint:r,transfer:He,toXYZ:Ft,fromXYZ:It,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:t,whitePoint:r,transfer:Ue,toXYZ:Ft,fromXYZ:It,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}}),e}var Rt=Lt();function zt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Bt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Vt,Ht=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Vt===void 0&&(Vt=Xe(`canvas`)),Vt.width=e.width,Vt.height=e.height;let t=Vt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Vt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Xe(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=zt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(zt(t[e]/255)*255):t[e]=zt(t[e]);return{data:t,width:e.width,height:e.height}}return B(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Ut=0,Wt=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ut++}),this.uuid=lt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Gt(r[t].image)):e.push(Gt(r[t]))}else e=Gt(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Gt(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Ht.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(B(`Texture: Unable to serialize Texture.`),{})}var Kt=0,qt=new G,Jt=class e extends it{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=a,i=a,o=u,s=f,c=O,l=p,d=e.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Kt++}),this.uuid=lt(),this.name=``,this.source=new Wt(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=o,this.minFilter=s,this.anisotropy=d,this.format=c,this.internalFormat=null,this.type=l,this.offset=new W(0,0),this.repeat=new W(1,1),this.center=new W(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Nt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(qt).x}get height(){return this.source.getSize(qt).y}get depth(){return this.source.getSize(qt).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){B(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?B(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case i:e.x-=Math.floor(e.x);break;case a:e.x=e.x<0?0:1;break;case o:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case i:e.y-=Math.floor(e.y);break;case a:e.y=e.y<0?0:1;break;case o:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Jt.DEFAULT_IMAGE=null,Jt.DEFAULT_MAPPING=300,Jt.DEFAULT_ANISOTROPY=1;var Yt=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=H(this.x,e.x,t.x),this.y=H(this.y,e.y,t.y),this.z=H(this.z,e.z,t.z),this.w=H(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=H(this.x,e,t),this.y=H(this.y,e,t),this.z=H(this.z,e,t),this.w=H(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(H(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Xt=class extends it{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:u,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Yt(0,0,e,t),this.scissorTest=!1,this.viewport=new Yt(0,0,e,t),this.textures=[];let r=new Jt({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:u,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Wt(n)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Zt=class extends Xt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Qt=class extends Jt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=s,this.minFilter=s,this.wrapR=a,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},$t=class extends Jt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=s,this.minFilter=s,this.wrapR=a,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},K=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/en.setFromMatrixColumn(e,0).length(),i=1/en.setFromMatrixColumn(e,1).length(),a=1/en.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(nn,e,rn)}lookAt(e,t,n){let r=this.elements;return sn.subVectors(e,t),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),an.crossVectors(n,sn),an.lengthSq()===0&&(Math.abs(n.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),an.crossVectors(n,sn)),an.normalize(),on.crossVectors(sn,an),r[0]=an.x,r[4]=on.x,r[8]=sn.x,r[1]=an.y,r[5]=on.y,r[9]=sn.y,r[2]=an.z,r[6]=on.z,r[10]=sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],ee=r[14],M=r[3],N=r[7],te=r[11],P=r[15];return i[0]=a*x+o*T+s*k+c*M,i[4]=a*S+o*E+s*A+c*N,i[8]=a*C+o*D+s*j+c*te,i[12]=a*w+o*O+s*ee+c*P,i[1]=l*x+u*T+d*k+f*M,i[5]=l*S+u*E+d*A+f*N,i[9]=l*C+u*D+d*j+f*te,i[13]=l*w+u*O+d*ee+f*P,i[2]=p*x+m*T+h*k+g*M,i[6]=p*S+m*E+h*A+g*N,i[10]=p*C+m*D+h*j+g*te,i[14]=p*w+m*O+h*ee+g*P,i[3]=_*x+v*T+y*k+b*M,i[7]=_*S+v*E+y*A+b*N,i[11]=_*C+v*D+y*j+b*te,i[15]=_*w+v*O+y*ee+b*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=en.set(r[0],r[1],r[2]).length(),o=en.set(r[4],r[5],r[6]).length(),s=en.set(r[8],r[9],r[10]).length();i<0&&(a=-a),tn.copy(this);let c=1/a,l=1/o,u=1/s;return tn.elements[0]*=c,tn.elements[1]*=c,tn.elements[2]*=c,tn.elements[4]*=l,tn.elements[5]*=l,tn.elements[6]*=l,tn.elements[8]*=u,tn.elements[9]*=u,tn.elements[10]*=u,t.setFromRotationMatrix(tn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=qe,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=qe,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},en=new G,tn=new K,nn=new G(0,0,0),rn=new G(1,1,1),an=new G,on=new G,sn=new G,cn=new K,ln=new At,un=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(H(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-H(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(H(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-H(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(H(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-H(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:B(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return cn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(cn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ln.setFromEuler(this),this.setFromQuaternion(ln,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};un.DEFAULT_ORDER=`XYZ`;var dn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},fn=0,pn=new G,mn=new At,hn=new K,gn=new G,_n=new G,vn=new G,yn=new At,bn=new G(1,0,0),xn=new G(0,1,0),Sn=new G(0,0,1),Cn={type:`added`},wn={type:`removed`},Tn={type:`childadded`,child:null},En={type:`childremoved`,child:null},Dn=class e extends it{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fn++}),this.uuid=lt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new G,n=new un,r=new At,i=new G(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new K},normalMatrix:{value:new Nt}}),this.matrix=new K,this.matrixWorld=new K,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return mn.setFromAxisAngle(e,t),this.quaternion.multiply(mn),this}rotateOnWorldAxis(e,t){return mn.setFromAxisAngle(e,t),this.quaternion.premultiply(mn),this}rotateX(e){return this.rotateOnAxis(bn,e)}rotateY(e){return this.rotateOnAxis(xn,e)}rotateZ(e){return this.rotateOnAxis(Sn,e)}translateOnAxis(e,t){return pn.copy(e).applyQuaternion(this.quaternion),this.position.add(pn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(bn,e)}translateY(e){return this.translateOnAxis(xn,e)}translateZ(e){return this.translateOnAxis(Sn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(hn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?gn.copy(e):gn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),_n.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hn.lookAt(_n,gn,this.up):hn.lookAt(gn,_n,this.up),this.quaternion.setFromRotationMatrix(hn),r&&(hn.extractRotation(r.matrixWorld),mn.setFromRotationMatrix(hn),this.quaternion.premultiply(mn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(V(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Cn),Tn.child=e,this.dispatchEvent(Tn),Tn.child=null):V(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(wn),En.child=e,this.dispatchEvent(En),En.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),hn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),hn.multiply(e.parent.matrixWorld)),e.applyMatrix4(hn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Cn),Tn.child=e,this.dispatchEvent(Tn),Tn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_n,e,vn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_n,yn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==``&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}};Dn.DEFAULT_UP=new G(0,1,0),Dn.DEFAULT_MATRIX_AUTO_UPDATE=!0,Dn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var On=class extends Dn{constructor(){super(),this.isGroup=!0,this.type=`Group`}},kn={type:`move`},An=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new On,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new On,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new On,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(kn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new On;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},jn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Mn={h:0,s:0,l:0},Nn={h:0,s:0,l:0};function Pn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var q=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Be){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Rt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Rt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Rt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Rt.workingColorSpace){if(e=ut(e,1),t=H(t,0,1),n=H(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Pn(i,r,e+1/3),this.g=Pn(i,r,e),this.b=Pn(i,r,e-1/3)}return Rt.colorSpaceToWorking(this,r),this}setStyle(e,t=Be){function n(t){t!==void 0&&parseFloat(t)<1&&B(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:B(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);B(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Be){let n=jn[e.toLowerCase()];return n===void 0?B(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zt(e.r),this.g=zt(e.g),this.b=zt(e.b),this}copyLinearToSRGB(e){return this.r=Bt(e.r),this.g=Bt(e.g),this.b=Bt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Be){return Rt.workingToColorSpace(Fn.copy(this),e),Math.round(H(Fn.r*255,0,255))*65536+Math.round(H(Fn.g*255,0,255))*256+Math.round(H(Fn.b*255,0,255))}getHexString(e=Be){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Rt.workingColorSpace){Rt.workingToColorSpace(Fn.copy(this),t);let n=Fn.r,r=Fn.g,i=Fn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Rt.workingColorSpace){return Rt.workingToColorSpace(Fn.copy(this),t),e.r=Fn.r,e.g=Fn.g,e.b=Fn.b,e}getStyle(e=Be){Rt.workingToColorSpace(Fn.copy(this),e);let t=Fn.r,n=Fn.g,r=Fn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Mn),this.setHSL(Mn.h+e,Mn.s+t,Mn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Mn),e.getHSL(Nn);let n=pt(Mn.h,Nn.h,t),r=pt(Mn.s,Nn.s,t),i=pt(Mn.l,Nn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Fn=new q;q.NAMES=jn;var In=class extends Dn{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new un,this.environmentIntensity=1,this.environmentRotation=new un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Ln=new G,Rn=new G,zn=new G,Bn=new G,Vn=new G,Hn=new G,Un=new G,Wn=new G,Gn=new G,Kn=new G,qn=new Yt,Jn=new Yt,Yn=new Yt,Xn=class e{constructor(e=new G,t=new G,n=new G){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Ln.subVectors(e,t),r.cross(Ln);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Ln.subVectors(r,t),Rn.subVectors(n,t),zn.subVectors(e,t);let a=Ln.dot(Ln),o=Ln.dot(Rn),s=Ln.dot(zn),c=Rn.dot(Rn),l=Rn.dot(zn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Bn)!==null&&Bn.x>=0&&Bn.y>=0&&Bn.x+Bn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Bn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Bn.x),s.addScaledVector(a,Bn.y),s.addScaledVector(o,Bn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return qn.setScalar(0),Jn.setScalar(0),Yn.setScalar(0),qn.fromBufferAttribute(e,t),Jn.fromBufferAttribute(e,n),Yn.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(qn,i.x),a.addScaledVector(Jn,i.y),a.addScaledVector(Yn,i.z),a}static isFrontFacing(e,t,n,r){return Ln.subVectors(n,t),Rn.subVectors(e,t),Ln.cross(Rn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ln.subVectors(this.c,this.b),Rn.subVectors(this.a,this.b),Ln.cross(Rn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Vn.subVectors(r,n),Hn.subVectors(i,n),Wn.subVectors(e,n);let s=Vn.dot(Wn),c=Hn.dot(Wn);if(s<=0&&c<=0)return t.copy(n);Gn.subVectors(e,r);let l=Vn.dot(Gn),u=Hn.dot(Gn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Vn,a);Kn.subVectors(e,i);let f=Vn.dot(Kn),p=Hn.dot(Kn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Hn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Un.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Un,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Vn,a).addScaledVector(Hn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Zn=class{constructor(e=new G(1/0,1/0,1/0),t=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint($n.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint($n.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=$n.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,$n):$n.fromBufferAttribute(r,t),$n.applyMatrix4(e.matrixWorld),this.expandByPoint($n);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),er.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),er.copy(e.boundingBox)),er.applyMatrix4(e.matrixWorld),this.union(er)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,$n),$n.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(sr),cr.subVectors(this.max,sr),tr.subVectors(e.a,sr),nr.subVectors(e.b,sr),rr.subVectors(e.c,sr),ir.subVectors(nr,tr),ar.subVectors(rr,nr),or.subVectors(tr,rr);let t=[0,-ir.z,ir.y,0,-ar.z,ar.y,0,-or.z,or.y,ir.z,0,-ir.x,ar.z,0,-ar.x,or.z,0,-or.x,-ir.y,ir.x,0,-ar.y,ar.x,0,-or.y,or.x,0];return!dr(t,tr,nr,rr,cr)||(t=[1,0,0,0,1,0,0,0,1],!dr(t,tr,nr,rr,cr))?!1:(lr.crossVectors(ir,ar),t=[lr.x,lr.y,lr.z],dr(t,tr,nr,rr,cr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,$n).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize($n).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qn)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Qn=[new G,new G,new G,new G,new G,new G,new G,new G],$n=new G,er=new Zn,tr=new G,nr=new G,rr=new G,ir=new G,ar=new G,or=new G,sr=new G,cr=new G,lr=new G,ur=new G;function dr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){ur.fromArray(e,a);let o=i.x*Math.abs(ur.x)+i.y*Math.abs(ur.y)+i.z*Math.abs(ur.z),s=t.dot(ur),c=n.dot(ur),l=r.dot(ur);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var fr=pr();function pr(){let e=new ArrayBuffer(4),t=new Float32Array(e),n=new Uint32Array(e),r=new Uint32Array(512),i=new Uint32Array(512);for(let e=0;e<256;++e){let t=e-127;t<-27?(r[e]=0,r[e|256]=32768,i[e]=24,i[e|256]=24):t<-14?(r[e]=1024>>-t-14,r[e|256]=1024>>-t-14|32768,i[e]=-t-1,i[e|256]=-t-1):t<=15?(r[e]=t+15<<10,r[e|256]=t+15<<10|32768,i[e]=13,i[e|256]=13):t<128?(r[e]=31744,r[e|256]=64512,i[e]=24,i[e|256]=24):(r[e]=31744,r[e|256]=64512,i[e]=13,i[e|256]=13)}let a=new Uint32Array(2048),o=new Uint32Array(64),s=new Uint32Array(64);for(let e=1;e<1024;++e){let t=e<<13,n=0;for(;!(t&8388608);)t<<=1,n-=8388608;t&=-8388609,n+=947912704,a[e]=t|n}for(let e=1024;e<2048;++e)a[e]=939524096+(e-1024<<13);for(let e=1;e<31;++e)o[e]=e<<23;o[31]=1199570944,o[32]=2147483648;for(let e=33;e<63;++e)o[e]=2147483648+(e-32<<23);o[63]=3347054592;for(let e=1;e<64;++e)e!==32&&(s[e]=1024);return{floatView:t,uint32View:n,baseTable:r,shiftTable:i,mantissaTable:a,exponentTable:o,offsetTable:s}}function mr(e){Math.abs(e)>65504&&B(`DataUtils.toHalfFloat(): Value out of range.`),e=H(e,-65504,65504),fr.floatView[0]=e;let t=fr.uint32View[0],n=t>>23&511;return fr.baseTable[n]+((t&8388607)>>fr.shiftTable[n])}function hr(e){let t=e>>10;return fr.uint32View[0]=fr.mantissaTable[fr.offsetTable[t]+(e&1023)]+fr.exponentTable[t],fr.floatView[0]}var gr=class{static toHalfFloat(e){return mr(e)}static fromHalfFloat(e){return hr(e)}},_r=new G,vr=new W,yr=0,br=class extends it{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:yr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Ge,this.updateRanges=[],this.gpuType=y,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)vr.fromBufferAttribute(this,t),vr.applyMatrix3(e),this.setXY(t,vr.x,vr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyMatrix3(e),this.setXYZ(t,_r.x,_r.y,_r.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyMatrix4(e),this.setXYZ(t,_r.x,_r.y,_r.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.applyNormalMatrix(e),this.setXYZ(t,_r.x,_r.y,_r.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_r.fromBufferAttribute(this,t),_r.transformDirection(e),this.setXYZ(t,_r.x,_r.y,_r.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ot(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=kt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ot(t,this.array)),t}setX(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ot(t,this.array)),t}setY(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ot(t,this.array)),t}setZ(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ot(t,this.array)),t}setW(e,t){return this.normalized&&(t=kt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array),r=kt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array),r=kt(r,this.array),i=kt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==``&&(e.name=this.name),this.usage!==35044&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:`dispose`})}},xr=class extends br{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Sr=class extends br{constructor(e,t,n){super(new Uint32Array(e),t,n)}},J=class extends br{constructor(e,t,n){super(new Float32Array(e),t,n)}},Cr=new Zn,wr=new G,Tr=new G,Er=class{constructor(e=new G,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Cr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;wr.subVectors(e,this.center);let t=wr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(wr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Tr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(wr.copy(e.center).add(Tr)),this.expandByPoint(wr.copy(e.center).sub(Tr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Dr=0,Or=new K,kr=new Dn,Ar=new G,jr=new Zn,Mr=new Zn,Nr=new G,Pr=class e extends it{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dr++}),this.uuid=lt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Je(e)?Sr:xr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new Nt().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Or.makeRotationFromQuaternion(e),this.applyMatrix4(Or),this}rotateX(e){return Or.makeRotationX(e),this.applyMatrix4(Or),this}rotateY(e){return Or.makeRotationY(e),this.applyMatrix4(Or),this}rotateZ(e){return Or.makeRotationZ(e),this.applyMatrix4(Or),this}translate(e,t,n){return Or.makeTranslation(e,t,n),this.applyMatrix4(Or),this}scale(e,t,n){return Or.makeScale(e,t,n),this.applyMatrix4(Or),this}lookAt(e){return kr.lookAt(e),kr.updateMatrix(),this.applyMatrix4(kr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ar).negate(),this.translate(Ar.x,Ar.y,Ar.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new J(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&B(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)V(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];jr.setFromBufferAttribute(n),this.morphTargetsRelative?(Nr.addVectors(this.boundingBox.min,jr.min),this.boundingBox.expandByPoint(Nr),Nr.addVectors(this.boundingBox.max,jr.max),this.boundingBox.expandByPoint(Nr)):(this.boundingBox.expandByPoint(jr.min),this.boundingBox.expandByPoint(jr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&V(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Er);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)V(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new G,1/0);else if(e){let n=this.boundingSphere.center;if(jr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Mr.setFromBufferAttribute(n),this.morphTargetsRelative?(Nr.addVectors(jr.min,Mr.min),jr.expandByPoint(Nr),Nr.addVectors(jr.max,Mr.max),jr.expandByPoint(Nr)):(jr.expandByPoint(Mr.min),jr.expandByPoint(Mr.max))}jr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Nr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Nr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Nr.fromBufferAttribute(a,t),o&&(Ar.fromBufferAttribute(e,t),Nr.add(Ar)),r=Math.max(r,n.distanceToSquared(Nr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&V(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){V(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new br(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new G,s[e]=new G;let c=new G,l=new G,u=new G,d=new W,f=new W,p=new W,m=new G,h=new G;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new G,y=new G,b=new G,x=new G;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new br(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new G,i=new G,a=new G,o=new G,s=new G,c=new G,l=new G,u=new G;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Nr.fromBufferAttribute(e,t),Nr.normalize(),e.setXYZ(t,Nr.x,Nr.y,Nr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new br(a,r,i)}if(this.index===null)return B(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,this.name!==``&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Fr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=Ge,this.updateRanges=[],this.version=0,this.uuid=lt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=lt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=lt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},Ir=new G,Lr=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ir.fromBufferAttribute(this,t),Ir.applyMatrix4(e),this.setXYZ(t,Ir.x,Ir.y,Ir.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ir.fromBufferAttribute(this,t),Ir.applyNormalMatrix(e),this.setXYZ(t,Ir.x,Ir.y,Ir.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ir.fromBufferAttribute(this,t),Ir.transformDirection(e),this.setXYZ(t,Ir.x,Ir.y,Ir.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Ot(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=kt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=kt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=kt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=kt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=kt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Ot(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Ot(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Ot(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Ot(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array),r=kt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=kt(t,this.array),n=kt(n,this.array),r=kt(r,this.array),i=kt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){$e(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new br(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){$e(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Rr=0,zr=class extends it{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Rr++}),this.uuid=lt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new q(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=We,this.stencilZFail=We,this.stencilZPass=We,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){B(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?B(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,this.name!==``&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==`round`&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==`round`&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new q().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new W().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new W().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Br=new G,Vr=new G,Hr=new G,Ur=new G,Wr=new G,Gr=new G,Kr=new G,qr=class{constructor(e=new G,t=new G(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Br)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Br.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Br.copy(this.origin).addScaledVector(this.direction,t),Br.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Vr.copy(e).add(t).multiplyScalar(.5),Hr.copy(t).sub(e).normalize(),Ur.copy(this.origin).sub(Vr);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Hr),o=Ur.dot(this.direction),s=-Ur.dot(Hr),c=Ur.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Vr).addScaledVector(Hr,d),f}intersectSphere(e,t){Br.subVectors(e.center,this.origin);let n=Br.dot(this.direction),r=Br.dot(Br)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Br)!==null}intersectTriangle(e,t,n,r,i){Wr.subVectors(t,e),Gr.subVectors(n,e),Kr.crossVectors(Wr,Gr);let a=this.direction.dot(Kr),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ur.subVectors(this.origin,e);let s=o*this.direction.dot(Gr.crossVectors(Ur,Gr));if(s<0)return null;let c=o*this.direction.dot(Wr.cross(Ur));if(c<0||s+c>a)return null;let l=-o*Ur.dot(Kr);return l<0?null:this.at(l/a,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Jr=class extends zr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new un,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Yr=new K,Xr=new qr,Zr=new Er,Qr=new G,$r=new G,ei=new G,ti=new G,ni=new G,ri=new G,ii=new G,ai=new G,Y=class extends Dn{constructor(e=new Pr,t=new Jr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){ri.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(ni.fromBufferAttribute(s,e),a?ri.addScaledVector(ni,r):ri.addScaledVector(ni.sub(t),r))}t.add(ri)}return t}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Zr.copy(n.boundingSphere),Zr.applyMatrix4(i),Xr.copy(e.ray).recast(e.near),!(Zr.containsPoint(Xr.origin)===!1&&(Xr.intersectSphere(Zr,Qr)===null||Xr.origin.distanceToSquared(Qr)>(e.far-e.near)**2))&&(Yr.copy(i).invert(),Xr.copy(e.ray).applyMatrix4(Yr),(n.boundingBox===null||Xr.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Xr)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=si(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=si(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=si(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=si(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function oi(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;ai.copy(s),ai.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(ai);return l<n.near||l>n.far?null:{distance:l,point:ai.clone(),object:e}}function si(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,$r),e.getVertexPosition(c,ei),e.getVertexPosition(l,ti);let u=oi(e,t,n,r,$r,ei,ti,ii);if(u){let e=new G;Xn.getBarycoord(ii,$r,ei,ti,e),i&&(u.uv=Xn.getInterpolatedAttribute(i,s,c,l,e,new W)),a&&(u.uv1=Xn.getInterpolatedAttribute(a,s,c,l,e,new W)),o&&(u.normal=Xn.getInterpolatedAttribute(o,s,c,l,e,new G),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new G,materialIndex:0};Xn.getNormal($r,ei,ti,t.normal),u.face=t,u.barycoord=e}return u}var ci=new Yt,li=new Yt,ui=new Yt,di=new Yt,fi=new K,pi=new G,mi=new Er,hi=new K,gi=new qr,_i=class extends Y{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type=`SkinnedMesh`,this.bindMode=n,this.bindMatrix=new K,this.bindMatrixInverse=new K,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Zn),this.boundingBox.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,pi),this.boundingBox.expandByPoint(pi)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Er),this.boundingSphere.makeEmpty();let t=e.getAttribute(`position`);for(let e=0;e<t.count;e++)this.getVertexPosition(e,pi),this.boundingSphere.expandByPoint(pi)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),mi.copy(this.boundingSphere),mi.applyMatrix4(r),e.ray.intersectsSphere(mi)!==!1&&(hi.copy(r).invert(),gi.copy(e.ray).applyMatrix4(hi),(this.boundingBox===null||gi.intersectsBox(this.boundingBox)!==!1)&&this._computeIntersections(e,t,gi)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Yt,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r===1/0?e.set(1,0,0,0):e.multiplyScalar(r),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===`attached`?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===`detached`?this.bindMatrixInverse.copy(this.bindMatrix).invert():B(`SkinnedMesh: Unrecognized bindMode: `+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,r=this.geometry;li.fromBufferAttribute(r.attributes.skinIndex,e),ui.fromBufferAttribute(r.attributes.skinWeight,e),t.isVector4?(ci.copy(t),t.set(0,0,0,0)):(ci.set(...t,1),t.set(0,0,0)),ci.applyMatrix4(this.bindMatrix);for(let e=0;e<4;e++){let r=ui.getComponent(e);if(r!==0){let i=li.getComponent(e);fi.multiplyMatrices(n.bones[i].matrixWorld,n.boneInverses[i]),t.addScaledVector(di.copy(ci).applyMatrix4(fi),r)}}return t.isVector4&&(t.w=ci.w),t.applyMatrix4(this.bindMatrixInverse)}},vi=class extends Dn{constructor(){super(),this.isBone=!0,this.type=`Bone`}},yi=class extends Jt{constructor(e=null,t=1,n=1,r,i,a,o,c,l=s,u=s,d,f){super(null,a,o,c,l,u,r,i,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},bi=new K,xi=new K,Si=class e{constructor(e=[],t=[]){this.uuid=lt(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){B(`Skeleton: Number of inverse bone matrices does not match amount of bones.`),this.boneInverses=[];for(let e=0,t=this.bones.length;e<t;e++)this.boneInverses.push(new K)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let t=new K;this.bones[e]&&t.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(t)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&t.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let t=this.bones[e];t&&(t.parent&&t.parent.isBone?(t.matrix.copy(t.parent.matrixWorld).invert(),t.matrix.multiply(t.matrixWorld)):t.matrix.copy(t.matrixWorld),t.matrix.decompose(t.position,t.quaternion,t.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let r=0,i=e.length;r<i;r++){let i=e[r]?e[r].matrixWorld:xi;bi.multiplyMatrices(i,t[r]),bi.toArray(n,r*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new e(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new yi(t,e,e,O,y);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){let r=e.bones[n],i=t[r];i===void 0&&(B(`Skeleton: No bone found with UUID:`,r),i=new vi),this.bones.push(i),this.boneInverses.push(new K().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:`Skeleton`,generator:`Skeleton.toJSON`},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let r=0,i=t.length;r<i;r++){let i=t[r];e.bones.push(i.uuid);let a=n[r];e.boneInverses.push(a.toArray())}return e}},Ci=class extends br{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},wi=new K,Ti=new K,Ei=[],Di=new Zn,Oi=new K,ki=new Y,Ai=new Er,ji=class extends Y{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ci(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Oi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Zn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,wi),Di.copy(e.boundingBox).applyMatrix4(wi),this.boundingBox.union(Di)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Er),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,wi),Ai.copy(e.boundingSphere).applyMatrix4(wi),this.boundingSphere.union(Ai)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(ki.geometry=this.geometry,ki.material=this.material,ki.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ai.copy(this.boundingSphere),Ai.applyMatrix4(n),e.ray.intersectsSphere(Ai)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,wi),Ti.multiplyMatrices(n,wi),ki.matrixWorld=Ti,ki.raycast(e,Ei);for(let e=0,n=Ei.length;e<n;e++){let n=Ei[e];n.instanceId=i,n.object=this,t.push(n)}Ei.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ci(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new yi(new Float32Array(r*this.count),r,this.count,j,y));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:`dispose`}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Mi=new G,Ni=new G,Pi=new Nt,Fi=class{constructor(e=new G(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Mi.subVectors(n,t).cross(Ni.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Mi),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Pi.getNormalMatrix(e),r=this.coplanarPoint(Mi).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ii=new Er,Li=new W(.5,.5),Ri=new G,zi=class{constructor(e=new Fi,t=new Fi,n=new Fi,r=new Fi,i=new Fi,a=new Fi){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=qe,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ii.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ii.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ii)}intersectsSprite(e){return Ii.center.set(0,0,0),Ii.radius=.7071067811865476+Li.distanceTo(e.center),Ii.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ii)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Ri.x=r.normal.x>0?e.max.x:e.min.x,Ri.y=r.normal.y>0?e.max.y:e.min.y,Ri.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ri)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Bi=new K,Vi=class e{constructor(){this.coordinateSystem=qe,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let e=0;e<t.length;e++){let r=t[e];Bi.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[e]===void 0&&(n[e]=new zi),n[e].setFromProjectionMatrix(Bi,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new zi),t[r].copy(n[r]);return this._count=e._count,this}clone(){return new e().copy(this)}};function Hi(e,t){return e-t}function Ui(e,t){return e.z-t.z}function Wi(e,t){return t.z-e.z}var Gi=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,r){let i=this.pool,a=this.list;this.index>=i.length&&i.push({start:-1,count:-1,z:-1,index:-1});let o=i[this.index];a.push(o),this.index++,o.start=e,o.count=t,o.z=n,o.index=r}reset(){this.list.length=0,this.index=0}},Ki=new K,qi=new q(1,1,1),Ji=new zi,Yi=new Vi,Xi=new Zn,Zi=new Er,Qi=new G,$i=new G,ea=new G,ta=new Gi,na=new Y,ra=[];function ia(e,t,n=0){let r=t.itemSize;if(e.isInterleavedBufferAttribute||e.array.constructor!==t.array.constructor){let i=e.count;for(let a=0;a<i;a++)for(let i=0;i<r;i++)t.setComponent(a+n,i,e.getComponent(a,i))}else t.array.set(e.array,n*r);t.needsUpdate=!0}function aa(e,t){if(e.constructor!==t.constructor){let n=Math.min(e.length,t.length);for(let r=0;r<n;r++)t[r]=e[r]}else{let n=Math.min(e.length,t.length);t.set(new e.constructor(e.buffer,0,n))}}var oa=class extends Y{constructor(e,t,n=t*2,r){super(new Pr,r),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new yi(new Float32Array(e*e*4),e,e,O,y);this._matricesTexture=t}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new yi(new Uint32Array(e*e),e,e,ee,v);this._indirectTexture=t}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new yi(new Float32Array(e*e*4).fill(1),e,e,O,y);t.colorSpace=Rt.workingColorSpace,this._colorsTexture=t}_initializeGeometry(e){let t=this.geometry,n=this._maxVertexCount,r=this._maxIndexCount;if(this._geometryInitialized===!1){for(let r in e.attributes){let{array:i,itemSize:a,normalized:o}=e.getAttribute(r),s=new br(new i.constructor(n*a),a,o);t.setAttribute(r,s)}if(e.getIndex()!==null){let e=n>65535?new Uint32Array(r):new Uint16Array(r);t.setIndex(new br(e,1))}this._geometryInitialized=!0}}_validateGeometry(e){let t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw Error(`THREE.BatchedMesh: All geometries must consistently have "index".`);for(let n in t.attributes){if(!e.hasAttribute(n))throw Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);let r=e.getAttribute(n),i=t.getAttribute(n);if(r.itemSize!==i.itemSize||r.normalized!==i.normalized)throw Error(`THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.`)}}validateInstanceId(e){let t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){let t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zn);let e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let n=0,r=t.length;n<r;n++){if(t[n].active===!1)continue;let r=t[n].geometryIndex;this.getMatrixAt(n,Ki),this.getBoundingBoxAt(r,Xi).applyMatrix4(Ki),e.union(Xi)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Er);let e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let n=0,r=t.length;n<r;n++){if(t[n].active===!1)continue;let r=t[n].geometryIndex;this.getMatrixAt(n,Ki),this.getBoundingSphereAt(r,Zi).applyMatrix4(Ki),e.union(Zi)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw Error(`THREE.BatchedMesh: Maximum item count reached.`);let t={visible:!0,active:!0,geometryIndex:e},n=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Hi),n=this._availableInstanceIds.shift(),this._instanceInfo[n]=t):(n=this._instanceInfo.length,this._instanceInfo.push(t));let r=this._matricesTexture;Ki.identity().toArray(r.image.data,n*16),r.needsUpdate=!0;let i=this._colorsTexture;return i&&(qi.toArray(i.image.data,n*4),i.needsUpdate=!0),this._visibilityChanged=!0,n}addGeometry(e,t=-1,n=-1){this._initializeGeometry(e),this._validateGeometry(e);let r={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},i=this._geometryInfo;r.vertexStart=this._nextVertexStart,r.reservedVertexCount=t===-1?e.getAttribute(`position`).count:t;let a=e.getIndex();if(a!==null&&(r.indexStart=this._nextIndexStart,r.reservedIndexCount=n===-1?a.count:n),r.indexStart!==-1&&r.indexStart+r.reservedIndexCount>this._maxIndexCount||r.vertexStart+r.reservedVertexCount>this._maxVertexCount)throw Error(`THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.`);let o;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Hi),o=this._availableGeometryIds.shift(),i[o]=r):(o=this._geometryCount,this._geometryCount++,i.push(r)),this.setGeometryAt(o,e),this._nextIndexStart=r.indexStart+r.reservedIndexCount,this._nextVertexStart=r.vertexStart+r.reservedVertexCount,o}setGeometryAt(e,t){if(e>=this._geometryCount)throw Error(`THREE.BatchedMesh: Maximum geometry count reached.`);this._validateGeometry(t);let n=this.geometry,r=n.getIndex()!==null,i=n.getIndex(),a=t.getIndex(),o=this._geometryInfo[e];if(r&&a.count>o.reservedIndexCount||t.attributes.position.count>o.reservedVertexCount)throw Error(`THREE.BatchedMesh: Reserved space not large enough for provided geometry.`);let s=o.vertexStart,c=o.reservedVertexCount;o.vertexCount=t.getAttribute(`position`).count;for(let e in n.attributes){let r=t.getAttribute(e),i=n.getAttribute(e);ia(r,i,s);let a=r.itemSize;for(let e=r.count,t=c;e<t;e++){let t=s+e;for(let e=0;e<a;e++)i.setComponent(t,e,0)}i.needsUpdate=!0,i.addUpdateRange(s*a,c*a)}if(r){let e=o.indexStart,n=o.reservedIndexCount;o.indexCount=t.getIndex().count;for(let t=0;t<a.count;t++)i.setX(e+t,s+a.getX(t));for(let t=a.count,r=n;t<r;t++)i.setX(e+t,s);i.needsUpdate=!0,i.addUpdateRange(e,o.reservedIndexCount)}return o.start=r?o.indexStart:o.vertexStart,o.count=r?o.indexCount:o.vertexCount,o.boundingBox=null,t.boundingBox!==null&&(o.boundingBox=t.boundingBox.clone()),o.boundingSphere=null,t.boundingSphere!==null&&(o.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){let t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;let n=this._instanceInfo;for(let t=0,r=n.length;t<r;t++)n[t].active&&n[t].geometryIndex===e&&this.deleteInstance(t);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0,n=this._geometryInfo,r=n.map((e,t)=>t).sort((e,t)=>n[e].vertexStart-n[t].vertexStart),i=this.geometry;for(let a=0,o=n.length;a<o;a++){let o=n[r[a]];if(o.active!==!1){if(i.index!==null){if(o.indexStart!==t){let{indexStart:n,vertexStart:r,reservedIndexCount:a}=o,s=i.index,c=s.array,l=e-r;for(let e=n;e<n+a;e++)c[e]=c[e]+l;s.array.copyWithin(t,n,n+a),s.addUpdateRange(t,a),s.needsUpdate=!0,o.indexStart=t}t+=o.reservedIndexCount}if(o.vertexStart!==e){let{vertexStart:t,reservedVertexCount:n}=o,r=i.attributes;for(let i in r){let a=r[i],{array:o,itemSize:s}=a;o.copyWithin(e*s,t*s,(t+n)*s),a.addUpdateRange(e*s,n*s),a.needsUpdate=!0}o.vertexStart=e}e+=o.reservedVertexCount,o.start=i.index?o.indexStart:o.vertexStart}}return this._nextIndexStart=t,this._nextVertexStart=e,this._visibilityChanged=!0,this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,r=this._geometryInfo[e];if(r.boundingBox===null){let e=new Zn,t=n.index,i=n.attributes.position;for(let n=r.start,a=r.start+r.count;n<a;n++){let r=n;t&&(r=t.getX(r)),e.expandByPoint(Qi.fromBufferAttribute(i,r))}r.boundingBox=e}return t.copy(r.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,r=this._geometryInfo[e];if(r.boundingSphere===null){let t=new Er;this.getBoundingBoxAt(e,Xi),Xi.getCenter(t.center);let i=n.index,a=n.attributes.position,o=0;for(let e=r.start,n=r.start+r.count;e<n;e++){let n=e;i&&(n=i.getX(n)),Qi.fromBufferAttribute(a,n),o=Math.max(o,t.center.distanceToSquared(Qi))}t.radius=Math.sqrt(o),r.boundingSphere=t}return t.copy(r.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);let n=this._matricesTexture,r=this._matricesTexture.image.data;return t.toArray(r,e*16),n.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null?t.isVector4?t.set(1,1,1,1):t.setRGB(1,1,1):t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t||(this._instanceInfo[e].visible=t,this._visibilityChanged=!0),this}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);let n=this._geometryInfo[e];return t.vertexStart=n.vertexStart,t.vertexCount=n.vertexCount,t.reservedVertexCount=n.reservedVertexCount,t.indexStart=n.indexStart,t.indexCount=n.indexCount,t.reservedIndexCount=n.reservedIndexCount,t.start=n.start,t.count=n.count,t}setInstanceCount(e){let t=this._availableInstanceIds,n=this._instanceInfo;for(t.sort(Hi);t[t.length-1]===n.length-1;)n.pop(),t.pop();if(e<n.length)throw Error(`THREE.BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);let r=new Int32Array(e),i=new Int32Array(e);aa(this._multiDrawCounts,r),aa(this._multiDrawStarts,i),this._multiDrawCounts=r,this._multiDrawStarts=i,this._maxInstanceCount=e;let a=this._indirectTexture,o=this._matricesTexture,s=this._colorsTexture;a.dispose(),this._initIndirectTexture(),aa(a.image.data,this._indirectTexture.image.data),o.dispose(),this._initMatricesTexture(),aa(o.image.data,this._matricesTexture.image.data),s&&(s.dispose(),this._initColorsTexture(),aa(s.image.data,this._colorsTexture.image.data))}setGeometrySize(e,t){let n=[...this._geometryInfo].filter(e=>e.active);if(Math.max(...n.map(e=>e.vertexStart+e.reservedVertexCount))>e)throw Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(e=>e.indexStart+e.reservedIndexCount))>t)throw Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);let r=this.geometry;r.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new Pr,this._initializeGeometry(r));let i=this.geometry;r.index&&aa(r.index.array,i.index.array);for(let e in r.attributes)aa(r.attributes[e].array,i.attributes[e].array)}raycast(e,t){let n=this._instanceInfo,r=this._geometryInfo,i=this.matrixWorld,a=this.geometry;na.material=this.material,na.geometry.index=a.index,na.geometry.attributes=a.attributes,na.geometry.boundingBox===null&&(na.geometry.boundingBox=new Zn),na.geometry.boundingSphere===null&&(na.geometry.boundingSphere=new Er);for(let a=0,o=n.length;a<o;a++){if(!n[a].visible||!n[a].active)continue;let o=n[a].geometryIndex,s=r[o];na.geometry.setDrawRange(s.start,s.count),this.getMatrixAt(a,na.matrixWorld).premultiply(i),this.getBoundingBoxAt(o,na.geometry.boundingBox),this.getBoundingSphereAt(o,na.geometry.boundingSphere),na.raycast(e,ra);for(let e=0,n=ra.length;e<n;e++){let n=ra[e];n.object=this,n.batchId=a,t.push(n)}ra.length=0}na.material=null,na.geometry.index=null,na.geometry.attributes={},na.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox===null?null:e.boundingBox.clone(),this.boundingSphere=e.boundingSphere===null?null:e.boundingSphere.clone(),this._geometryInfo=e._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox===null?null:e.boundingBox.clone(),boundingSphere:e.boundingSphere===null?null:e.boundingSphere.clone()})),this._instanceInfo=e._instanceInfo.map(e=>({...e})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(e,t,n,r,i){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let a=r.getIndex(),o=a===null?1:a.array.BYTES_PER_ELEMENT,s=1;i.wireframe&&(s=2,o=r.attributes.position.count>65535?4:2);let c=this._instanceInfo,l=this._multiDrawStarts,u=this._multiDrawCounts,d=this._geometryInfo,f=this.perObjectFrustumCulled,p=this._indirectTexture,m=p.image.data,h=n.isArrayCamera?Yi:Ji;f&&(n.isArrayCamera?h.setFromArrayCamera(n):(Ki.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),h.setFromProjectionMatrix(Ki,n.coordinateSystem,n.reversedDepth)));let g=0;if(this.sortObjects){Ki.copy(this.matrixWorld).invert(),Qi.setFromMatrixPosition(n.matrixWorld).applyMatrix4(Ki),$i.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(Ki);for(let e=0,t=c.length;e<t;e++)if(c[e].visible&&c[e].active){let t=c[e].geometryIndex;this.getMatrixAt(e,Ki),this.getBoundingSphereAt(t,Zi).applyMatrix4(Ki);let n=!1;if(f&&(n=!h.intersectsSphere(Zi)),!n){let n=d[t],r=ea.subVectors(Zi.center,Qi).dot($i);ta.push(n.start,n.count,r,e)}}let e=ta.list,t=this.customSort;t===null?e.sort(i.transparent?Wi:Ui):t.call(this,e,n);for(let t=0,n=e.length;t<n;t++){let n=e[t];l[g]=n.start*o*s,u[g]=n.count*s,m[g]=n.index,g++}ta.reset()}else for(let e=0,t=c.length;e<t;e++)if(c[e].visible&&c[e].active){let t=c[e].geometryIndex,n=!1;if(f&&(this.getMatrixAt(e,Ki),this.getBoundingSphereAt(t,Zi).applyMatrix4(Ki),n=!h.intersectsSphere(Zi)),!n){let n=d[t];l[g]=n.start*o*s,u[g]=n.count*s,m[g]=e,g++}}p.needsUpdate=!0,this._multiDrawCount=g,this._visibilityChanged=!1}onBeforeShadow(e,t,n,r,i,a){this.onBeforeRender(e,null,r,i,a)}},sa=class extends zr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new q(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ca=new G,la=new G,ua=new K,da=new qr,fa=new Er,pa=new G,ma=new G,ha=class extends Dn{constructor(e=new Pr,t=new sa){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)ca.fromBufferAttribute(t,e-1),la.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=ca.distanceTo(la);e.setAttribute(`lineDistance`,new J(n,1))}else B(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fa.copy(n.boundingSphere),fa.applyMatrix4(r),fa.radius+=i,e.ray.intersectsSphere(fa)===!1)return;ua.copy(r).invert(),da.copy(e.ray).applyMatrix4(ua);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=ga(this,e,da,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=ga(this,e,da,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=ga(this,e,da,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=ga(this,e,da,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function ga(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(ca.fromBufferAttribute(s,i),la.fromBufferAttribute(s,a),n.distanceSqToSegment(ca,la,pa,ma)>r)return;pa.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(pa);if(!(c<t.near||c>t.far))return{distance:c,point:ma.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var _a=new G,va=new G,ya=class extends ha{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)_a.fromBufferAttribute(t,e),va.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+_a.distanceTo(va);e.setAttribute(`lineDistance`,new J(n,1))}else B(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},ba=class extends ha{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type=`LineLoop`}},xa=class extends zr{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new q(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Sa=new K,Ca=new qr,wa=new Er,Ta=new G,Ea=class extends Dn{constructor(e=new Pr,t=new xa){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),wa.copy(n.boundingSphere),wa.applyMatrix4(r),wa.radius+=i,e.ray.intersectsSphere(wa)===!1)return;Sa.copy(r).invert(),Ca.copy(e.ray).applyMatrix4(Sa);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Ta.fromBufferAttribute(l,n),Da(Ta,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Ta.fromBufferAttribute(l,a),Da(Ta,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Da(e,t,n,r,i,a,o){let s=Ca.distanceSqToPoint(e);if(s<n){let n=new G;Ca.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Oa=class extends Jt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ka=class extends Jt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Aa=class extends Jt{constructor(e,t,n=v,r,i,a,o=s,c=s,l,u=k,d=1){if(u!==1026&&u!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},r,i,a,o,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Wt(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ja=class extends Aa{constructor(e,t=v,n=301,r,i,a=s,o=s,c,l=k){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,r,i,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Ma=class extends Jt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Na=class e extends Pr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new J(c,3)),this.setAttribute(`normal`,new J(l,3)),this.setAttribute(`uv`,new J(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new G;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Pa=class e extends Pr{constructor(e=1,t=1,n=4,r=8,i=1){super(),this.type=`CapsuleGeometry`,this.parameters={radius:e,height:t,capSegments:n,radialSegments:r,heightSegments:i},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),i=Math.max(1,Math.floor(i));let a=[],o=[],s=[],c=[],l=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+i,m=r+1,h=new G,g=new G;for(let _=0;_<=p;_++){let v=0,y=0,b=0,x=0;if(_<=n){let t=_/n,r=t*Math.PI/2;y=-l-e*Math.cos(r),b=e*Math.sin(r),x=-e*Math.cos(r),v=t*u}else if(_<=n+i){let r=(_-n)/i;y=-l+r*t,b=e,x=0,v=u+r*d}else{let t=(_-n-i)/n,r=t*Math.PI/2;y=l+e*Math.sin(r),b=e*Math.cos(r),x=e*Math.sin(r),v=u+d+t*u}let S=Math.max(0,Math.min(1,v/f)),C=0;_===0?C=.5/r:_===p&&(C=-.5/r);for(let e=0;e<=r;e++){let t=e/r,n=t*Math.PI*2,i=Math.sin(n),a=Math.cos(n);g.x=-b*a,g.y=y,g.z=b*i,o.push(g.x,g.y,g.z),h.set(-b*a,x,b*i),h.normalize(),s.push(h.x,h.y,h.z),c.push(t+C,S)}if(_>0){let e=(_-1)*m;for(let t=0;t<r;t++){let n=e+t,r=e+t+1,i=_*m+t,o=_*m+t+1;a.push(n,r,i),a.push(r,o,i)}}}this.setIndex(a),this.setAttribute(`position`,new J(o,3)),this.setAttribute(`normal`,new J(s,3)),this.setAttribute(`uv`,new J(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Fa=class e extends Pr{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new G,l=new W;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new J(a,3)),this.setAttribute(`normal`,new J(o,3)),this.setAttribute(`uv`,new J(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Ia=class e extends Pr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new J(u,3)),this.setAttribute(`normal`,new J(d,3)),this.setAttribute(`uv`,new J(f,2));function _(){let a=new G,_=new G,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new W,m=new G,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},La=class e extends Ia{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ra=class e extends Pr{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new J(i,3)),this.setAttribute(`normal`,new J(i.slice(),3)),this.setAttribute(`uv`,new J(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new G,r=new G,i=new G;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new G;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new G;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new G,t=new G,n=new G,r=new G,o=new W,s=new W,c=new W;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},za=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){B(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new W:new G);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new G,r=[],i=[],a=[],o=new G,s=new K;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new G)}i[0]=new G,a[0]=new G;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(H(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(H(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ba=class extends za{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new W){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Va=class extends Ba{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function Ha(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Ua=new G,Wa=new G,Ga=new Ha,Ka=new Ha,qa=new Ha,Ja=class extends za{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new G){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Wa.subVectors(r[0],r[1]).add(r[0]),c=Wa);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Ua.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Ua),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Ga.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Ka.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),qa.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Ga.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Ka.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),qa.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Ga.calc(s),Ka.calc(s),qa.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new G().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Ya(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function Xa(e,t){let n=1-e;return n*n*t}function Za(e,t){return 2*(1-e)*e*t}function Qa(e,t){return e*e*t}function $a(e,t,n,r){return Xa(e,t)+Za(e,n)+Qa(e,r)}function eo(e,t){let n=1-e;return n*n*n*t}function to(e,t){let n=1-e;return 3*n*n*e*t}function no(e,t){return 3*(1-e)*e*e*t}function ro(e,t){return e*e*e*t}function io(e,t,n,r,i){return eo(e,t)+to(e,n)+no(e,r)+ro(e,i)}var ao=class extends za{constructor(e=new W,t=new W,n=new W,r=new W){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new W){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(io(e,r.x,i.x,a.x,o.x),io(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},oo=class extends za{constructor(e=new G,t=new G,n=new G,r=new G){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new G){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(io(e,r.x,i.x,a.x,o.x),io(e,r.y,i.y,a.y,o.y),io(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},so=class extends za{constructor(e=new W,t=new W){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new W){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new W){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},co=class extends za{constructor(e=new G,t=new G){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new G){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new G){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},lo=class extends za{constructor(e=new W,t=new W,n=new W){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new W){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set($a(e,r.x,i.x,a.x),$a(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},uo=class extends za{constructor(e=new G,t=new G,n=new G){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new G){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set($a(e,r.x,i.x,a.x),$a(e,r.y,i.y,a.y),$a(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fo=class extends za{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new W){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Ya(o,s.x,c.x,l.x,u.x),Ya(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new W().fromArray(n))}return this}},po=Object.freeze({__proto__:null,ArcCurve:Va,CatmullRomCurve3:Ja,CubicBezierCurve:ao,CubicBezierCurve3:oo,EllipseCurve:Ba,LineCurve:so,LineCurve3:co,QuadraticBezierCurve:lo,QuadraticBezierCurve3:uo,SplineCurve:fo}),mo=class extends za{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new po[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new po[n.type]().fromJSON(n))}return this}},ho=class extends mo{constructor(e){super(),this.type=`Path`,this.currentPoint=new W,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new so(this.currentPoint.clone(),new W(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new lo(this.currentPoint.clone(),new W(e,t),new W(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new ao(this.currentPoint.clone(),new W(e,t),new W(n,r),new W(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new fo([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new Ba(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},go=class extends ho{constructor(e){super(e),this.uuid=lt(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new ho().fromJSON(n))}return this}};function _o(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=vo(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=To(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return bo(a,o,n,s,c,l,0),o}function vo(e,t,n,r,i){let a;if(i===Yo(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=Ko(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=Ko(i/r|0,e[i],e[i+1],a);return a&&Ro(a,a.next)&&(qo(a),a=a.next),a}function yo(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(Ro(n,n.next)||Lo(n.prev,n,n.next)===0)){if(qo(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function bo(e,t,n,r,i,a,o){if(!e)return;!o&&a&&Ao(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?So(e,r,i,a):xo(e))t.push(c.i,e.i,l.i),qo(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=Co(yo(e),t),bo(e,t,n,r,i,a,2)):o===2&&wo(e,t,n,r,i,a):bo(yo(e),t,n,r,i,a,1);break}}}function xo(e){let t=e.prev,n=e,r=e.next;if(Lo(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&Fo(i,s,a,c,o,l,m.x,m.y)&&Lo(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function So(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Lo(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=Mo(p,m,t,n,r),v=Mo(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Fo(s,u,c,d,l,f,y.x,y.y)&&Lo(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Fo(s,u,c,d,l,f,b.x,b.y)&&Lo(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Fo(s,u,c,d,l,f,y.x,y.y)&&Lo(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Fo(s,u,c,d,l,f,b.x,b.y)&&Lo(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Co(e,t){let n=e;do{let r=n.prev,i=n.next.next;!Ro(r,i)&&zo(r,n,n.next,i)&&Uo(r,i)&&Uo(i,r)&&(t.push(r.i,n.i,i.i),qo(n),qo(n.next),n=e=i),n=n.next}while(n!==e);return yo(n)}function wo(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&Io(o,e)){let s=Go(o,e);o=yo(o,o.next),s=yo(s,s.next),bo(o,t,n,r,i,a,0),bo(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function To(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=vo(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(No(o))}i.sort(Eo);for(let e=0;e<i.length;e++)n=Do(i[e],n);return n}function Eo(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function Do(e,t){let n=Oo(e,t);if(!n)return t;let r=Go(n,e);return yo(r,r.next),yo(n,n.next)}function Oo(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(Ro(e,n))return n;do{if(Ro(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&Po(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);Uo(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&ko(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function ko(e,t){return Lo(e.prev,e,t.prev)<0&&Lo(t.next,e,e.next)<0}function Ao(e,t,n,r){let i=e;do i.z===0&&(i.z=Mo(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,jo(i)}function jo(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function Mo(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function No(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function Po(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function Fo(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&Po(e,t,n,r,i,a,o,s)}function Io(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!Ho(e,t)&&(Uo(e,t)&&Uo(t,e)&&Wo(e,t)&&(Lo(e.prev,e,t.prev)||Lo(e,t.prev,t))||Ro(e,t)&&Lo(e.prev,e,e.next)>0&&Lo(t.prev,t,t.next)>0)}function Lo(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function Ro(e,t){return e.x===t.x&&e.y===t.y}function zo(e,t,n,r){let i=Vo(Lo(e,t,n)),a=Vo(Lo(e,t,r)),o=Vo(Lo(n,r,e)),s=Vo(Lo(n,r,t));return!!(i!==a&&o!==s||i===0&&Bo(e,n,t)||a===0&&Bo(e,r,t)||o===0&&Bo(n,e,r)||s===0&&Bo(n,t,r))}function Bo(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function Vo(e){return e>0?1:e<0?-1:0}function Ho(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&zo(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function Uo(e,t){return Lo(e.prev,e,e.next)<0?Lo(e,t,e.next)>=0&&Lo(e,e.prev,t)>=0:Lo(e,t,e.prev)<0||Lo(e,e.next,t)<0}function Wo(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Go(e,t){let n=Jo(e.i,e.x,e.y),r=Jo(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function Ko(e,t,n,r){let i=Jo(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function qo(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Jo(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Yo(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var Xo=class{static triangulate(e,t,n=2){return _o(e,t,n)}},Zo=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];Qo(e),$o(n,e);let a=e.length;t.forEach(Qo);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,$o(n,t[e]);let o=Xo.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function Qo(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function $o(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var es=class e extends Pr{constructor(e=new go([new W(.5,.5),new W(-.5,.5),new W(-.5,-.5),new W(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new J(r,3)),this.setAttribute(`uv`,new J(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?ts:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new G,b=new G,x=new G}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!Zo.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];Zo.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));s<=10000000000000001e-36*c*c?(e.splice(r,1),n--):t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function O(e,t,n){return t||V(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let k=C.length;function A(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new W(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new W(r/a,i/a)}let j=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),j[e]=A(D[e],D[n],D[r]);let ee=[],M,N=j.concat();for(let e=0,t=E;e<t;e++){let t=w[e];M=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),M[e]=A(t[e],t[r],t[i]);ee.push(M),N=N.concat(M)}let te;if(p===0)te=Zo.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=O(D[t],j[t],a);ae(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];M=ee[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=O(n[e],M[e],a);ae(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}te=Zo.triangulateShape(e,t)}let P=te.length,ne=d+f;for(let e=0;e<k;e++){let t=l?O(C[e],N[e],ne):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),ae(x.x,x.y,x.z)):ae(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<k;t++){let n=l?O(C[t],N[t],ne):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),ae(x.x,x.y,x.z)):ae(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=O(D[e],j[e],r);ae(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];M=ee[e];for(let e=0,i=t.length;e<i;e++){let i=O(t[e],M[e],r);_?ae(i.x,i.y+g[s-1].y,g[s-1].x+n):ae(i.x,i.y,c+n)}}}F(),re();function F(){let e=r.length/3;if(l){let e=0,t=k*e;for(let e=0;e<P;e++){let n=te[e];oe(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=k*e;for(let e=0;e<P;e++){let n=te[e];oe(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<P;e++){let t=te[e];oe(t[2],t[1],t[0])}for(let e=0;e<P;e++){let t=te[e];oe(t[0]+k*s,t[1]+k*s,t[2]+k*s)}}n.addGroup(e,r.length/3-e,0)}function re(){let e=r.length/3,t=0;ie(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];ie(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function ie(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=k*e,a=k*(e+1);se(t+r+n,t+i+n,t+i+a,t+r+a)}}}function ae(e,t,n){a.push(e),a.push(t),a.push(n)}function oe(e,t,i){I(e),I(t),I(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);ce(o[0]),ce(o[1]),ce(o[2])}function se(e,t,i,a){I(e),I(t),I(a),I(t),I(i),I(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);ce(s[0]),ce(s[1]),ce(s[3]),ce(s[1]),ce(s[2]),ce(s[3])}function I(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function ce(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return ns(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new po[i.type]().fromJSON(i)),new e(r,t.options)}},ts={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new W(a,o),new W(s,c),new W(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new W(o,1-c),new W(l,1-d),new W(f,1-m),new W(h,1-_)]:[new W(s,1-c),new W(u,1-d),new W(p,1-m),new W(g,1-_)]}};function ns(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var rs=class e extends Ra{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},is=class e extends Pr{constructor(e=[new W(0,-.5),new W(.5,0),new W(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=H(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new G,d=new W,f=new G,p=new G,m=new G,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new J(a,3)),this.setAttribute(`uv`,new J(o,2)),this.setAttribute(`normal`,new J(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},as=class e extends Pr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new J(p,3)),this.setAttribute(`normal`,new J(m,3)),this.setAttribute(`uv`,new J(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},os=class e extends Pr{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new G,p=new W;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new J(s,3)),this.setAttribute(`normal`,new J(c,3)),this.setAttribute(`uv`,new J(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},ss=class e extends Pr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new G,d=new G,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new J(p,3)),this.setAttribute(`normal`,new J(m,3)),this.setAttribute(`uv`,new J(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},cs=class e extends Pr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new G,f=new G,p=new G;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new J(c,3)),this.setAttribute(`normal`,new J(l,3)),this.setAttribute(`uv`,new J(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}},ls=class e extends Pr{constructor(e=new uo(new G(-1,-1,0),new G(-1,1,0),new G(1,1,0)),t=64,n=1,r=8,i=!1){super(),this.type=`TubeGeometry`,this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:i};let a=e.computeFrenetFrames(t,i);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new G,s=new G,c=new W,l=new G,u=[],d=[],f=[],p=[];m(),this.setIndex(p),this.setAttribute(`position`,new J(u,3)),this.setAttribute(`normal`,new J(d,3)),this.setAttribute(`uv`,new J(f,2));function m(){for(let e=0;e<t;e++)h(e);h(i===!1?t:0),_(),g()}function h(i){l=e.getPointAt(i/t,l);let c=a.normals[i],f=a.binormals[i];for(let e=0;e<=r;e++){let t=e/r*Math.PI*2,i=Math.sin(t),a=-Math.cos(t);s.x=a*c.x+i*f.x,s.y=a*c.y+i*f.y,s.z=a*c.z+i*f.z,s.normalize(),d.push(s.x,s.y,s.z),o.x=l.x+n*s.x,o.y=l.y+n*s.y,o.z=l.z+n*s.z,u.push(o.x,o.y,o.z)}}function g(){for(let e=1;e<=t;e++)for(let t=1;t<=r;t++){let n=(r+1)*(e-1)+(t-1),i=(r+1)*e+(t-1),a=(r+1)*e+t,o=(r+1)*(e-1)+t;p.push(n,i,o),p.push(i,a,o)}}function _(){for(let e=0;e<=t;e++)for(let n=0;n<=r;n++)c.x=e/t,c.y=n/r,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(t){return new e(new po[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function us(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(fs(i))i.isRenderTargetTexture?(B(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(fs(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function ds(e){let t={};for(let n=0;n<e.length;n++){let r=us(e[n]);for(let e in r)t[e]=r[e]}return t}function fs(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function ps(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function ms(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Rt.workingColorSpace}var hs={clone:us,merge:ds},gs=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_s=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,vs=class extends zr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gs,this.fragmentShader=_s,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=us(e.uniforms),this.uniformsGroups=ps(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new q().setHex(r.value);break;case`v2`:this.uniforms[n].value=new W().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new G().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Yt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new Nt().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new K().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},ys=class extends vs{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},bs=class extends zr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new q(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new un,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},xs=class extends bs{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new W(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return H(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new q(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new q(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new q(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},Ss=class extends zr{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type=`MeshNormalMaterial`,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}},Cs=class extends zr{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new W(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new un,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ws=class extends zr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=ze,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ts=class extends zr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Es(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}var Ds=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Os=class extends Ds{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ie,endingEnd:Ie}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Le:i=e,o=2*t-n;break;case Re:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Le:a=e,s=2*n-t;break;case Re:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},ks=class extends Ds{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},As=class extends Ds{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},js=class extends Ds{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=(n-t)/(r-t),S,C,w,T,E;for(let e=0;e<8;e++){S=x*x,C=S*x,w=1-x,T=w*w,E=T*w;let e=E*t+3*T*x*g+3*w*S*y+C*r-n;if(Math.abs(e)<1e-10)break;let i=3*T*(g-t)+6*w*x*(y-g)+3*S*(r-y);if(Math.abs(i)<1e-10)break;x-=e/i,x=Math.max(0,Math.min(1,x))}i[p]=E*o+3*T*x*_+3*w*S*b+C*m}return i}},Ms=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Es(t,this.TimeBufferType),this.values=Es(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Es(e.times,Array),values:Es(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new As(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ks(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Os(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new js(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Pe:t=this.InterpolantFactoryMethodDiscrete;break;case R:t=this.InterpolantFactoryMethodLinear;break;case Fe:t=this.InterpolantFactoryMethodSmooth;break;case z:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return B(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Pe;case this.InterpolantFactoryMethodLinear:return R;case this.InterpolantFactoryMethodSmooth:return Fe;case this.InterpolantFactoryMethodBezier:return z}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(V(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(V(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){V(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){V(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Ye(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){V(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Fe,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}};Ms.prototype.ValueTypeName=``,Ms.prototype.TimeBufferType=Float32Array,Ms.prototype.ValueBufferType=Float32Array,Ms.prototype.DefaultInterpolation=R;var Ns=class extends Ms{constructor(e,t,n){super(e,t,n)}};Ns.prototype.ValueTypeName=`bool`,Ns.prototype.ValueBufferType=Array,Ns.prototype.DefaultInterpolation=Pe,Ns.prototype.InterpolantFactoryMethodLinear=void 0,Ns.prototype.InterpolantFactoryMethodSmooth=void 0;var Ps=class extends Ms{constructor(e,t,n,r){super(e,t,n,r)}};Ps.prototype.ValueTypeName=`color`;var Fs=class extends Ms{constructor(e,t,n,r){super(e,t,n,r)}};Fs.prototype.ValueTypeName=`number`;var Is=class extends Ds{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)At.slerpFlat(i,0,a,c-o,a,c,s);return i}},Ls=class extends Ms{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Is(this.times,this.values,this.getValueSize(),e)}};Ls.prototype.ValueTypeName=`quaternion`,Ls.prototype.InterpolantFactoryMethodSmooth=void 0;var Rs=class extends Ms{constructor(e,t,n){super(e,t,n)}};Rs.prototype.ValueTypeName=`string`,Rs.prototype.ValueBufferType=Array,Rs.prototype.DefaultInterpolation=Pe,Rs.prototype.InterpolantFactoryMethodLinear=void 0,Rs.prototype.InterpolantFactoryMethodSmooth=void 0;var zs=class extends Ms{constructor(e,t,n,r){super(e,t,n,r)}};zs.prototype.ValueTypeName=`vector`;var Bs={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(Vs(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!Vs(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function Vs(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var Hs=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},Us=class{constructor(e){this.manager=e===void 0?Hs:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Us.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var Ws=new WeakMap,Gs=class extends Us{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Bs.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=Ws.get(a);e===void 0&&(e=[],Ws.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=Xe(`img`);function s(){l(),t&&t(this);let n=Ws.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}Ws.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),Bs.remove(`image:${e}`);let n=Ws.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}Ws.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Bs.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},Ks=class extends Us{constructor(e){super(e)}load(e,t,n,r){let i=new Jt,a=new Gs(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},qs=class extends Dn{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new q(e),this.intensity=t}dispose(){this.dispatchEvent({type:`dispose`})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Js=class extends qs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(Dn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new q(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Ys=new K,Xs=new G,Zs=new G,Qs=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new W(512,512),this.mapType=p,this.map=null,this.mapPass=null,this.matrix=new K,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zi,this._frameExtents=new W(1,1),this._viewportCount=1,this._viewports=[new Yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Xs.setFromMatrixPosition(e.matrixWorld),t.position.copy(Xs),Zs.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Zs),t.updateMatrixWorld(),Ys.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ys,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===2001||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ys)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},$s=new G,ec=new At,tc=new G,nc=class extends Dn{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new K,this.projectionMatrix=new K,this.projectionMatrixInverse=new K,this.coordinateSystem=qe,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose($s,ec,tc),tc.x===1&&tc.y===1&&tc.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose($s,ec,tc.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose($s,ec,tc),tc.x===1&&tc.y===1&&tc.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose($s,ec,tc.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},rc=new G,ic=new W,ac=new W,oc=class extends nc{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ct*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(st*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ct*2*Math.atan(Math.tan(st*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){rc.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(rc.x,rc.y).multiplyScalar(-e/rc.z),rc.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(rc.x,rc.y).multiplyScalar(-e/rc.z)}getViewSize(e,t){return this.getViewBounds(e,ic,ac),t.subVectors(ac,ic)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(st*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},sc=class extends Qs{constructor(){super(new oc(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=ct*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},cc=class extends qs{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(Dn.DEFAULT_UP),this.updateMatrix(),this.target=new Dn,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new sc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},lc=class extends Qs{constructor(){super(new oc(90,1,.5,500)),this.isPointLightShadow=!0}},uc=class extends qs{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new lc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},dc=class extends nc{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},fc=class extends Qs{constructor(){super(new dc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},pc=class extends qs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Dn.DEFAULT_UP),this.updateMatrix(),this.target=new Dn,this.shadow=new fc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},mc=-90,hc=1,gc=class extends Dn{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new oc(mc,hc,e,t);r.layers=this.layers,this.add(r);let i=new oc(mc,hc,e,t);i.layers=this.layers,this.add(i);let a=new oc(mc,hc,e,t);a.layers=this.layers,this.add(a);let o=new oc(mc,hc,e,t);o.layers=this.layers,this.add(o);let s=new oc(mc,hc,e,t);s.layers=this.layers,this.add(s);let c=new oc(mc,hc,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},_c=class extends oc{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},vc=`\\[\\]\\.:\\/`,yc=RegExp(`[\\[\\]\\.:\\/]`,`g`),bc=`[^\\[\\]\\.:\\/]`,xc=`[^`+vc.replace(`\\.`,``)+`]`,Sc=`((?:WC+[\\/:])*)`.replace(`WC`,bc),Cc=`(WCOD+)?`.replace(`WCOD`,xc),wc=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,bc),Tc=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,bc),Ec=RegExp(`^`+Sc+Cc+wc+Tc+`$`),Dc=[`material`,`materials`,`bones`,`map`],Oc=class{constructor(e,t,n){let r=n||kc.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},kc=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(yc,``)}static parseTrackName(e){let t=Ec.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Dc.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){B(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){V(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){V(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){V(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){V(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){V(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){V(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){V(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;V(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){V(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){V(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};kc.Composite=Oc,kc.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},kc.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},kc.prototype.GetterByBindingType=[kc.prototype._getValue_direct,kc.prototype._getValue_array,kc.prototype._getValue_arrayElement,kc.prototype._getValue_toArray],kc.prototype.SetterByBindingTypeAndVersioning=[[kc.prototype._setValue_direct,kc.prototype._setValue_direct_setNeedsUpdate,kc.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[kc.prototype._setValue_array,kc.prototype._setValue_array_setNeedsUpdate,kc.prototype._setValue_array_setMatrixWorldNeedsUpdate],[kc.prototype._setValue_arrayElement,kc.prototype._setValue_arrayElement_setNeedsUpdate,kc.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[kc.prototype._setValue_fromArray,kc.prototype._setValue_fromArray_setNeedsUpdate,kc.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ac=new K,jc=class{constructor(e,t,n=0,r=1/0){this.ray=new qr(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new dn,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):V(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return Ac.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ac),this}intersectObject(e,t=!0,n=[]){return Nc(e,this,n,t),n.sort(Mc),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)Nc(e[r],this,n,t);return n.sort(Mc),n}};function Mc(e,t){return e.distance-t.distance}function Nc(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)Nc(r[e],t,n,!0)}}var Pc=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){let e=1e-6;return this.phi=H(this.phi,e,Math.PI-e),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(H(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});var Fc=new G,Ic=new G,Lc=new G,Rc=new G,zc=new G,Bc=new G,Vc=new G,Hc=class{constructor(e=new G,t=new G){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Fc.subVectors(e,this.start),Ic.subVectors(this.end,this.start);let n=Ic.dot(Ic);if(n===0)return 0;let r=Ic.dot(Fc)/n;return t&&(r=H(r,0,1)),r}closestPointToPoint(e,t,n){let r=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(r).add(this.start)}distanceSqToLine3(e,t=Bc,n=Vc){let r=1e-8*1e-8,i,a,o=this.start,s=e.start,c=this.end,l=e.end;Lc.subVectors(c,o),Rc.subVectors(l,s),zc.subVectors(o,s);let u=Lc.dot(Lc),d=Rc.dot(Rc),f=Rc.dot(zc);if(u<=r&&d<=r)return t.copy(o),n.copy(s),t.sub(n),t.dot(t);if(u<=r)i=0,a=f/d,a=H(a,0,1);else{let e=Lc.dot(zc);if(d<=r)a=0,i=H(-e/u,0,1);else{let t=Lc.dot(Rc),n=u*d-t*t;i=n===0?0:H((t*f-e*d)/n,0,1),a=(t*i+f)/d,a<0?(a=0,i=H(-e/u,0,1)):a>1&&(a=1,i=H((t-e)/u,0,1))}}return t.copy(o).addScaledVector(Lc,i),n.copy(s).addScaledVector(Rc,a),t.distanceToSquared(n)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}},Uc=class extends it{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){e===void 0?B(`Controls: connect() now requires an element.`):(this.domElement!==null&&this.disconnect(),this.domElement=e)}disconnect(){}dispose(){}update(){}};function Wc(e,t,n,r){let i=Gc(r);switch(n){case E:return e*t;case j:return e*t/i.components*i.byteLength;case ee:return e*t/i.components*i.byteLength;case M:return e*t*2/i.components*i.byteLength;case N:return e*t*2/i.components*i.byteLength;case D:return e*t*3/i.components*i.byteLength;case O:return e*t*4/i.components*i.byteLength;case te:return e*t*4/i.components*i.byteLength;case P:case ne:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case F:case re:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ae:case se:return Math.max(e,16)*Math.max(t,8)/4;case ie:case oe:return Math.max(e,8)*Math.max(t,8)/2;case I:case ce:case ue:case de:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case le:case fe:case pe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case me:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case he:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case ge:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case _e:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case ve:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ye:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case be:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case xe:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Se:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Ce:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case we:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Te:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ee:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case De:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Oe:case ke:case Ae:return Math.ceil(e/4)*Math.ceil(t/4)*16;case je:case L:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Me:case Ne:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Gc(e){switch(e){case p:case m:return{byteLength:1,components:1};case g:case h:case b:return{byteLength:2,components:1};case x:case S:return{byteLength:2,components:4};case v:case _:case y:return{byteLength:4,components:1};case w:case T:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`185`}})),typeof window<`u`&&(window.__THREE__?B(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`185`);function Kc(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function qc(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Jc={alphahash_fragment:`#ifdef USE_ALPHAHASH
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
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
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
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
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
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
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
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
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
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
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
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
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
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
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
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
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
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
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
}`},X={common:{diffuse:{value:new q(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Nt}},envmap:{envMap:{value:null},envMapRotation:{value:new Nt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Nt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Nt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Nt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Nt},normalScale:{value:new W(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Nt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Nt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Nt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Nt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new q(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new q(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0},uvTransform:{value:new Nt}},sprite:{diffuse:{value:new q(16777215)},opacity:{value:1},center:{value:new W(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}}},Yc={basic:{uniforms:ds([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.fog]),vertexShader:Jc.meshbasic_vert,fragmentShader:Jc.meshbasic_frag},lambert:{uniforms:ds([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.fog,X.lights,{emissive:{value:new q(0)},envMapIntensity:{value:1}}]),vertexShader:Jc.meshlambert_vert,fragmentShader:Jc.meshlambert_frag},phong:{uniforms:ds([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.fog,X.lights,{emissive:{value:new q(0)},specular:{value:new q(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Jc.meshphong_vert,fragmentShader:Jc.meshphong_frag},standard:{uniforms:ds([X.common,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.roughnessmap,X.metalnessmap,X.fog,X.lights,{emissive:{value:new q(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Jc.meshphysical_vert,fragmentShader:Jc.meshphysical_frag},toon:{uniforms:ds([X.common,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.gradientmap,X.fog,X.lights,{emissive:{value:new q(0)}}]),vertexShader:Jc.meshtoon_vert,fragmentShader:Jc.meshtoon_frag},matcap:{uniforms:ds([X.common,X.bumpmap,X.normalmap,X.displacementmap,X.fog,{matcap:{value:null}}]),vertexShader:Jc.meshmatcap_vert,fragmentShader:Jc.meshmatcap_frag},points:{uniforms:ds([X.points,X.fog]),vertexShader:Jc.points_vert,fragmentShader:Jc.points_frag},dashed:{uniforms:ds([X.common,X.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Jc.linedashed_vert,fragmentShader:Jc.linedashed_frag},depth:{uniforms:ds([X.common,X.displacementmap]),vertexShader:Jc.depth_vert,fragmentShader:Jc.depth_frag},normal:{uniforms:ds([X.common,X.bumpmap,X.normalmap,X.displacementmap,{opacity:{value:1}}]),vertexShader:Jc.meshnormal_vert,fragmentShader:Jc.meshnormal_frag},sprite:{uniforms:ds([X.sprite,X.fog]),vertexShader:Jc.sprite_vert,fragmentShader:Jc.sprite_frag},background:{uniforms:{uvTransform:{value:new Nt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Jc.background_vert,fragmentShader:Jc.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Nt}},vertexShader:Jc.backgroundCube_vert,fragmentShader:Jc.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Jc.cube_vert,fragmentShader:Jc.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Jc.equirect_vert,fragmentShader:Jc.equirect_frag},distance:{uniforms:ds([X.common,X.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Jc.distance_vert,fragmentShader:Jc.distance_frag},shadow:{uniforms:ds([X.lights,X.fog,{color:{value:new q(0)},opacity:{value:1}}]),vertexShader:Jc.shadow_vert,fragmentShader:Jc.shadow_frag}};Yc.physical={uniforms:ds([Yc.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Nt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Nt},clearcoatNormalScale:{value:new W(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Nt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Nt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Nt},sheen:{value:0},sheenColor:{value:new q(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Nt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Nt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Nt},transmissionSamplerSize:{value:new W},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Nt},attenuationDistance:{value:0},attenuationColor:{value:new q(0)},specularColor:{value:new q(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Nt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Nt},anisotropyVector:{value:new W},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Nt}}]),vertexShader:Jc.meshphysical_vert,fragmentShader:Jc.meshphysical_frag};var Xc={r:0,b:0,g:0},Zc=new K,Qc=new Nt;Qc.set(-1,0,0,0,1,0,0,0,1);function $c(e,t,n,r,i,a){let o=new q(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new Y(new Na(1,1,1),new vs({name:`BackgroundCubeMaterial`,uniforms:us(Yc.backgroundCube.uniforms),vertexShader:Yc.backgroundCube.vertexShader,fragmentShader:Yc.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Zc.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Qc),l.material.toneMapped=Rt.getTransfer(i.colorSpace)!==Ue,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Y(new as(2,2),new vs({name:`BackgroundMaterial`,uniforms:us(Yc.background.uniforms),vertexShader:Yc.background.vertexShader,fragmentShader:Yc.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Rt.getTransfer(i.colorSpace)!==Ue,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Xc,ms(e)),n.buffers.color.setClear(Xc.r,Xc.g,Xc.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function el(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function tl(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function nl(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(B(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&B(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function rl(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Fi,s=new Nt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var il=4,al=[.125,.215,.35,.446,.526,.582],ol=20,sl=256,cl=new dc,ll=new q,ul=null,dl=0,fl=0,pl=!1,ml=new G,hl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=ml}=i;ul=this._renderer.getRenderTarget(),dl=this._renderer.getActiveCubeFace(),fl=this._renderer.getActiveMipmapLevel(),pl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ul,dl,fl),this._renderer.xr.enabled=pl,e.scissorTest=!1,vl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ul=this._renderer.getRenderTarget(),dl=this._renderer.getActiveCubeFace(),fl=this._renderer.getActiveMipmapLevel(),pl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:u,minFilter:u,generateMipmaps:!1,type:b,format:O,colorSpace:Ve,depthBuffer:!1},r=_l(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_l(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=gl(r)),this._blurMaterial=bl(r,e,t),this._ggxMaterial=yl(r,e,t)}return r}_compileMaterial(e){let t=new Y(new Pr,e);this._renderer.compile(t,cl)}_sceneToCubeUV(e,t,n,r,i){let a=new oc(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(ll),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Y(new Na,new Jr({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(ll),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;vl(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xl());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;vl(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,cl)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-il?n-d+il:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,vl(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,cl),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,vl(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,cl)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&V(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):ol;m>ol&&B(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ol}`);let h=[],g=0;for(let e=0;e<ol;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];vl(t,3*v*(r>_-il?r-_+il:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,cl)}};function gl(e){let t=[],n=[],r=[],i=e,a=e-il+1+al.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-il?s=al[o-e+il-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new Pr;h.setAttribute(`position`,new br(f,3)),h.setAttribute(`uv`,new br(p,2)),h.setAttribute(`faceIndex`,new br(m,1)),r.push(new Y(h,null)),i>il&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function _l(e,t,n){let r=new Zt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function vl(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function yl(e,t,n){return new vs({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:sl,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Cl(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function bl(e,t,n){let r=new Float32Array(ol),i=new G(0,1,0);return new vs({name:`SphericalGaussianBlur`,defines:{n:ol,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Cl(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function xl(){return new vs({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Cl(),fragmentShader:`

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
		`,blending:0,depthTest:!1,depthWrite:!1})}function Sl(){return new vs({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Cl(){return`

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
	`}var wl=class extends Zt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Oa(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Na(5,5,5),i=new vs({name:`CubemapFromEquirect`,uniforms:us(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Y(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=u),new gc(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Tl(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new wl(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new hl(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new hl(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function El(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&tt(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Dl(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Sr:xr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Ol(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function kl(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:V(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Al(e,t,n){let r=new WeakMap,i=new Yt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Qt(h,p,m,u);g.type=y,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new W(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function jl(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Ml={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Nl(e,t,n,r,i,a){let o=new Zt(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,depthTexture:i?new Aa(t,n):void 0}),s=new Zt(t,n,{type:b,depthBuffer:!1,stencilBuffer:!1}),c=new Pr;c.setAttribute(`position`,new J([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute(`uv`,new J([0,2,0,0,2,0],2));let l=new ys({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new Y(c,l),d=new dc(-1,1,1,-1,0,1),f=null,p=null,m=!1,h,g=null,_=[],v=!1;this.setSize=function(e,t){o.setSize(e,t),s.setSize(e,t);for(let n=0;n<_.length;n++){let r=_[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){_=e,v=_.length>0&&_[0].isRenderPass===!0;let t=o.width,n=o.height;for(let e=0;e<_.length;e++){let r=_[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(m||e.toneMapping===0&&_.length===0)return!1;if(g=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return v===!1&&e.setRenderTarget(o),h=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return v},this.end=function(e,t){e.toneMapping=h,m=!0;let n=o,r=s;for(let i=0;i<_.length;i++){let a=_[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(f!==e.outputColorSpace||p!==e.toneMapping){f=e.outputColorSpace,p=e.toneMapping,l.defines={},Rt.getTransfer(f)===`srgb`&&(l.defines.SRGB_TRANSFER=``);let t=Ml[p];t&&(l.defines[t]=``),l.needsUpdate=!0}l.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(g),e.render(u,d),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){o.depthTexture&&o.depthTexture.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose()}}var Pl=new Jt,Fl=new Aa(1,1),Il=new Qt,Ll=new $t,Rl=new Oa,zl=[],Bl=[],Vl=new Float32Array(16),Hl=new Float32Array(9),Ul=new Float32Array(4);function Wl(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=zl[i];if(a===void 0&&(a=new Float32Array(i),zl[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Gl(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Kl(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function ql(e,t){let n=Bl[t];n===void 0&&(n=new Int32Array(t),Bl[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Jl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Yl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Gl(n,t))return;e.uniform2fv(this.addr,t),Kl(n,t)}}function Xl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Gl(n,t))return;e.uniform3fv(this.addr,t),Kl(n,t)}}function Zl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Gl(n,t))return;e.uniform4fv(this.addr,t),Kl(n,t)}}function Ql(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Gl(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Kl(n,t)}else{if(Gl(n,r))return;Ul.set(r),e.uniformMatrix2fv(this.addr,!1,Ul),Kl(n,r)}}function $l(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Gl(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Kl(n,t)}else{if(Gl(n,r))return;Hl.set(r),e.uniformMatrix3fv(this.addr,!1,Hl),Kl(n,r)}}function eu(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Gl(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Kl(n,t)}else{if(Gl(n,r))return;Vl.set(r),e.uniformMatrix4fv(this.addr,!1,Vl),Kl(n,r)}}function tu(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function nu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Gl(n,t))return;e.uniform2iv(this.addr,t),Kl(n,t)}}function ru(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Gl(n,t))return;e.uniform3iv(this.addr,t),Kl(n,t)}}function iu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Gl(n,t))return;e.uniform4iv(this.addr,t),Kl(n,t)}}function au(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function ou(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Gl(n,t))return;e.uniform2uiv(this.addr,t),Kl(n,t)}}function su(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Gl(n,t))return;e.uniform3uiv(this.addr,t),Kl(n,t)}}function cu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Gl(n,t))return;e.uniform4uiv(this.addr,t),Kl(n,t)}}function lu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Fl.compareFunction=n.isReversedDepthBuffer()?518:515,a=Fl):a=Pl,n.setTexture2D(t||a,i)}function uu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Ll,i)}function du(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Rl,i)}function fu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Il,i)}function pu(e){switch(e){case 5126:return Jl;case 35664:return Yl;case 35665:return Xl;case 35666:return Zl;case 35674:return Ql;case 35675:return $l;case 35676:return eu;case 5124:case 35670:return tu;case 35667:case 35671:return nu;case 35668:case 35672:return ru;case 35669:case 35673:return iu;case 5125:return au;case 36294:return ou;case 36295:return su;case 36296:return cu;case 35678:case 36198:case 36298:case 36306:case 35682:return lu;case 35679:case 36299:case 36307:return uu;case 35680:case 36300:case 36308:case 36293:return du;case 36289:case 36303:case 36311:case 36292:return fu}}function mu(e,t){e.uniform1fv(this.addr,t)}function hu(e,t){let n=Wl(t,this.size,2);e.uniform2fv(this.addr,n)}function gu(e,t){let n=Wl(t,this.size,3);e.uniform3fv(this.addr,n)}function _u(e,t){let n=Wl(t,this.size,4);e.uniform4fv(this.addr,n)}function vu(e,t){let n=Wl(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function yu(e,t){let n=Wl(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function bu(e,t){let n=Wl(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function xu(e,t){e.uniform1iv(this.addr,t)}function Su(e,t){e.uniform2iv(this.addr,t)}function Cu(e,t){e.uniform3iv(this.addr,t)}function wu(e,t){e.uniform4iv(this.addr,t)}function Tu(e,t){e.uniform1uiv(this.addr,t)}function Eu(e,t){e.uniform2uiv(this.addr,t)}function Du(e,t){e.uniform3uiv(this.addr,t)}function Ou(e,t){e.uniform4uiv(this.addr,t)}function ku(e,t,n){let r=this.cache,i=t.length,a=ql(n,i);Gl(r,a)||(e.uniform1iv(this.addr,a),Kl(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Fl:Pl;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Au(e,t,n){let r=this.cache,i=t.length,a=ql(n,i);Gl(r,a)||(e.uniform1iv(this.addr,a),Kl(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Ll,a[e])}function ju(e,t,n){let r=this.cache,i=t.length,a=ql(n,i);Gl(r,a)||(e.uniform1iv(this.addr,a),Kl(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Rl,a[e])}function Mu(e,t,n){let r=this.cache,i=t.length,a=ql(n,i);Gl(r,a)||(e.uniform1iv(this.addr,a),Kl(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Il,a[e])}function Nu(e){switch(e){case 5126:return mu;case 35664:return hu;case 35665:return gu;case 35666:return _u;case 35674:return vu;case 35675:return yu;case 35676:return bu;case 5124:case 35670:return xu;case 35667:case 35671:return Su;case 35668:case 35672:return Cu;case 35669:case 35673:return wu;case 5125:return Tu;case 36294:return Eu;case 36295:return Du;case 36296:return Ou;case 35678:case 36198:case 36298:case 36306:case 35682:return ku;case 35679:case 36299:case 36307:return Au;case 35680:case 36300:case 36308:case 36293:return ju;case 36289:case 36303:case 36311:case 36292:return Mu}}var Pu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=pu(t.type)}},Fu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Nu(t.type)}},Iu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Lu=/(\w+)(\])?(\[|\.)?/g;function Ru(e,t){e.seq.push(t),e.map[t.id]=t}function zu(e,t,n){let r=e.name,i=r.length;for(Lu.lastIndex=0;;){let a=Lu.exec(r),o=Lu.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Ru(n,l===void 0?new Pu(s,e,t):new Fu(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Iu(s),Ru(n,e)),n=e}}}var Bu=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);zu(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Vu(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Hu=37297,Uu=0;function Wu(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Gu=new Nt;function Ku(e){Rt._getMatrix(Gu,Rt.workingColorSpace,e);let t=`mat3( ${Gu.elements.map(e=>e.toFixed(4))} )`;switch(Rt.getTransfer(e)){case He:return[t,`LinearTransferOETF`];case Ue:return[t,`sRGBTransferOETF`];default:return B(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function qu(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Wu(e.getShaderSource(t),r)}return i}function Ju(e,t){let n=Ku(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Yu={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Xu(e,t){let n=Yu[t];return n===void 0?(B(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Zu=new G;function Qu(){return Rt.getLuminanceCoefficients(Zu),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Zu.x.toFixed(4)}, ${Zu.y.toFixed(4)}, ${Zu.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function $u(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(nd).join(`
`)}function ed(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function td(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function nd(e){return e!==``}function rd(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function id(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var ad=/^[ \t]*#include +<([\w\d./]+)>/gm;function od(e){return e.replace(ad,cd)}var sd=new Map;function cd(e,t){let n=Jc[t];if(n===void 0){let e=sd.get(t);if(e!==void 0)n=Jc[e],B(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return od(n)}var ld=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ud(e){return e.replace(ld,dd)}function dd(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function fd(e){let t=`precision ${e.precision} float;
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
#define LOW_PRECISION`),t}var pd={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function md(e){return pd[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var hd={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function gd(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:hd[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var _d={302:`ENVMAP_MODE_REFRACTION`};function vd(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:_d[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var yd={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function bd(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:yd[e.combine]||`ENVMAP_BLENDING_NONE`}function xd(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Sd(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=md(n),l=gd(n),u=vd(n),d=bd(n),f=xd(n),p=$u(n),m=ed(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(nd).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(nd).join(`
`),_.length>0&&(_+=`
`)):(g=[fd(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(nd).join(`
`),_=[fd(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Jc.tonemapping_pars_fragment,n.toneMapping===0?``:Xu(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Jc.colorspace_pars_fragment,Ju(`linearToOutputTexel`,n.outputColorSpace),Qu(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(nd).join(`
`)),o=od(o),o=rd(o,n),o=id(o,n),s=od(s),s=rd(s,n),s=id(s,n),o=ud(o),s=ud(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Vu(i,i.VERTEX_SHADER,y),S=Vu(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=qu(i,x,`vertex`),n=qu(i,S,`fragment`);V(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):B(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Bu(i,h),T=td(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Hu)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Uu++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Cd=0,wd=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Td(e),t.set(e,n)),n}},Td=class{constructor(e){this.id=Cd++,this.code=e,this.usedTimes=0}};function Ed(e){return e===1030||e===37490||e===36285}function Dd(e,t,n,r,i,a){let o=new dn,s=new wd,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&B(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Yc[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),ee=e.state.buffers.depth.getReversed(),M=h.isInstancedMesh===!0,N=h.isBatchedMesh===!0,te=!!i.map,P=!!i.matcap,ne=!!x,F=!!i.aoMap,re=!!i.lightMap,ie=!!i.bumpMap&&i.wireframe===!1,ae=!!i.normalMap,oe=!!i.displacementMap,se=!!i.emissiveMap,I=!!i.metalnessMap,ce=!!i.roughnessMap,le=i.anisotropy>0,ue=i.clearcoat>0,de=i.dispersion>0,fe=i.iridescence>0,pe=i.sheen>0,me=i.transmission>0,he=le&&!!i.anisotropyMap,ge=ue&&!!i.clearcoatMap,_e=ue&&!!i.clearcoatNormalMap,ve=ue&&!!i.clearcoatRoughnessMap,ye=fe&&!!i.iridescenceMap,be=fe&&!!i.iridescenceThicknessMap,xe=pe&&!!i.sheenColorMap,Se=pe&&!!i.sheenRoughnessMap,Ce=!!i.specularMap,we=!!i.specularColorMap,Te=!!i.specularIntensityMap,Ee=me&&!!i.transmissionMap,De=me&&!!i.thicknessMap,Oe=!!i.gradientMap,ke=!!i.alphaMap,Ae=i.alphaTest>0,je=!!i.alphaHash,L=!!i.extensions,Me=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Me=e.toneMapping);let Ne={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:N,batchingColor:N&&h._colorsTexture!==null,instancing:M,instancingColor:M&&h.instanceColor!==null,instancingMorph:M&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Rt.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:te,matcap:P,envMap:ne,envMapMode:ne&&x.mapping,envMapCubeUVHeight:S,aoMap:F,lightMap:re,bumpMap:ie,normalMap:ae,displacementMap:oe,emissiveMap:se,normalMapObjectSpace:ae&&i.normalMapType===1,normalMapTangentSpace:ae&&i.normalMapType===0,packedNormalMap:ae&&i.normalMapType===0&&Ed(i.normalMap.format),metalnessMap:I,roughnessMap:ce,anisotropy:le,anisotropyMap:he,clearcoat:ue,clearcoatMap:ge,clearcoatNormalMap:_e,clearcoatRoughnessMap:ve,dispersion:de,iridescence:fe,iridescenceMap:ye,iridescenceThicknessMap:be,sheen:pe,sheenColorMap:xe,sheenRoughnessMap:Se,specularMap:Ce,specularColorMap:we,specularIntensityMap:Te,transmission:me,transmissionMap:Ee,thicknessMap:De,gradientMap:Oe,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:ke,alphaTest:Ae,alphaHash:je,combine:i.combine,mapUv:te&&m(i.map.channel),aoMapUv:F&&m(i.aoMap.channel),lightMapUv:re&&m(i.lightMap.channel),bumpMapUv:ie&&m(i.bumpMap.channel),normalMapUv:ae&&m(i.normalMap.channel),displacementMapUv:oe&&m(i.displacementMap.channel),emissiveMapUv:se&&m(i.emissiveMap.channel),metalnessMapUv:I&&m(i.metalnessMap.channel),roughnessMapUv:ce&&m(i.roughnessMap.channel),anisotropyMapUv:he&&m(i.anisotropyMap.channel),clearcoatMapUv:ge&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:_e&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ve&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:ye&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:be&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Se&&m(i.sheenRoughnessMap.channel),specularMapUv:Ce&&m(i.specularMap.channel),specularColorMapUv:we&&m(i.specularColorMap.channel),specularIntensityMapUv:Te&&m(i.specularIntensityMap.channel),transmissionMapUv:Ee&&m(i.transmissionMap.channel),thicknessMapUv:De&&m(i.thicknessMap.channel),alphaMapUv:ke&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(ae||le),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(te||ke),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&ae===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ee,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Me,decodeVideoTexture:te&&i.map.isVideoTexture===!0&&Rt.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:se&&i.emissiveMap.isVideoTexture===!0&&Rt.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:L&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(L&&i.extensions.multiDraw===!0||N)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ne.vertexUv1s=c.has(1),Ne.vertexUv2s=c.has(2),Ne.vertexUv3s=c.has(3),c.clear(),Ne}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Yc[t];n=hs.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Sd(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Od(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function kd(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Ad(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function jd(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t,a){n.length>1&&n.sort(e||kd),r.length>1&&r.sort(t||Ad),i.length>1&&i.sort(t||Ad),a&&(n.reverse(),r.reverse(),i.reverse())}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Md(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new jd,e.set(t,[i])):n>=r.length?(i=new jd,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Nd(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new G,color:new q};break;case`SpotLight`:n={position:new G,direction:new G,color:new q,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new G,color:new q,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new G,skyColor:new q,groundColor:new q};break;case`RectAreaLight`:n={color:new q,position:new G,halfWidth:new G,halfHeight:new G}}return e[t.id]=n,n}}}function Pd(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new W,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Fd=0;function Id(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Ld(e){let t=new Nd,n=Pd(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new G);let i=new G,a=new K,o=new K;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(Id);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=X.LTC_FLOAT_1,r.rectAreaLTC2=X.LTC_FLOAT_2):(r.rectAreaLTC1=X.LTC_HALF_1,r.rectAreaLTC2=X.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=Fd++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function Rd(e){let t=new Ld(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function zd(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Rd(e),t.set(n,[a])):r>=i.length?(a=new Rd(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Bd=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vd=`uniform sampler2D shadow_pass;
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
}`,Hd=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],Ud=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],Wd=new K,Gd=new G,Kd=new G;function qd(e,t,n){let r=new zi,i=new W,a=new W,o=new Yt,c=new ws,l=new Ts,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},m=new vs({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new W},radius:{value:4}},vertexShader:Bd,fragmentShader:Vd}),h=m.clone();h.defines.HORIZONTAL_PASS=1;let g=new Pr;g.setAttribute(`position`,new br(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Y(g,m),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,c){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(B(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let l=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.state;m.setBlending(0),m.buffers.depth.getReversed()===!0?m.buffers.color.setClear(0,0,0,0):m.buffers.color.setClear(1,1,1,1),m.buffers.depth.setTest(!0),m.setScissorTest(!1);let h=S!==this.type;h&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let l=0,d=t.length;l<d;l++){let d=t[l],p=d.shadow;if(p===void 0){B(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;i.copy(p.mapSize);let g=p.getFrameExtents();i.multiply(g),a.copy(p.mapSize),(i.x>f||i.y>f)&&(i.x>f&&(a.x=Math.floor(f/g.x),i.x=a.x*g.x,p.mapSize.x=a.x),i.y>f&&(a.y=Math.floor(f/g.y),i.y=a.y*g.y,p.mapSize.y=a.y));let _=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=_,p.map===null||h===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){B(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new Zt(i.x,i.y,{format:M,type:b,minFilter:u,magFilter:u,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new Aa(i.x,i.y,y),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=k,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=s,p.map.depthTexture.magFilter=s}else d.isPointLight?(p.map=new wl(i.x),p.map.depthTexture=new ja(i.x,v)):(p.map=new Zt(i.x,i.y),p.map.depthTexture=new Aa(i.x,i.y,v)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=k,this.type===1?(p.map.depthTexture.compareFunction=_?518:515,p.map.depthTexture.minFilter=u,p.map.depthTexture.magFilter=u):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=s,p.map.depthTexture.magFilter=s);p.camera.updateProjectionMatrix()}let x=p.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<x;t++){if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),m.viewport(o)}if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Gd.setFromMatrixPosition(d.matrixWorld),e.position.copy(Gd),Kd.copy(e.position),Kd.add(Hd[t]),e.up.copy(Ud[t]),e.lookAt(Kd),e.updateMatrixWorld(),n.makeTranslation(-Gd.x,-Gd.y,-Gd.z),Wd.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(Wd,e.coordinateSystem,e.reversedDepth)}else p.updateMatrices(d);r=p.getFrustum(),T(n,c,p.camera,d,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,c),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(l,d,p)};function C(n,r){let a=t.update(_);m.defines.VSM_SAMPLES!==n.blurSamples&&(m.defines.VSM_SAMPLES=n.blurSamples,h.defines.VSM_SAMPLES=n.blurSamples,m.needsUpdate=!0,h.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new Zt(i.x,i.y,{format:M,type:b})),m.uniforms.shadow_pass.value=n.map.depthTexture,m.uniforms.resolution.value=n.mapSize,m.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,m,_,null),h.uniforms.shadow_pass.value=n.mapPass.texture,h.uniforms.resolution.value=n.mapSize,h.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,h,_,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?l:c,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,E)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function T(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)T(c[e],i,a,o,s)}function E(e){e.target.removeEventListener(`dispose`,E);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Jd(e,t){function n(){let t=!1,n=new Yt,r=null,i=new Yt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?I(e.DEPTH_TEST):ce(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=rt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?I(e.STENCIL_TEST):ce(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ee=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),M=!1,N=0,te=e.getParameter(e.VERSION);te.indexOf(`WebGL`)===-1?te.indexOf(`OpenGL ES`)!==-1&&(N=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),M=N>=2):(N=parseFloat(/^WebGL (\d)/.exec(te)[1]),M=N>=1);let P=null,ne={},F=e.getParameter(e.SCISSOR_BOX),re=e.getParameter(e.VIEWPORT),ie=new Yt().fromArray(F),ae=new Yt().fromArray(re);function oe(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let se={};se[e.TEXTURE_2D]=oe(e.TEXTURE_2D,e.TEXTURE_2D,1),se[e.TEXTURE_CUBE_MAP]=oe(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[e.TEXTURE_2D_ARRAY]=oe(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),se[e.TEXTURE_3D]=oe(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),I(e.DEPTH_TEST),o.setFunc(3),ge(!1),_e(1),I(e.CULL_FACE),me(0);function I(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ce(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function le(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ue(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function de(t){return h!==t&&(e.useProgram(t),h=t,!0)}let fe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};fe[103]=e.MIN,fe[104]=e.MAX;let pe={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function me(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(ce(e.BLEND),g=!1);else if(g===!1&&(I(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:V(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:V(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:V(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:V(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(fe[n],fe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(pe[r],pe[i],pe[o],pe[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function he(t,n){t.side===2?ce(e.CULL_FACE):I(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ge(r),t.blending===1&&t.transparent===!1?me(0):me(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ye(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?I(e.SAMPLE_ALPHA_TO_COVERAGE):ce(e.SAMPLE_ALPHA_TO_COVERAGE)}function ge(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function _e(t){t===0?ce(e.CULL_FACE):(I(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ve(t){t!==k&&(M&&e.lineWidth(t),k=t)}function ye(t,n,r){t?(I(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):ce(e.POLYGON_OFFSET_FILL)}function be(t){t?I(e.SCISSOR_TEST):ce(e.SCISSOR_TEST)}function xe(t){t===void 0&&(t=e.TEXTURE0+ee-1),P!==t&&(e.activeTexture(t),P=t)}function Se(t,n,r){r===void 0&&(r=P===null?e.TEXTURE0+ee-1:P);let i=ne[r];i===void 0&&(i={type:void 0,texture:void 0},ne[r]=i),(i.type!==t||i.texture!==n)&&(P!==r&&(e.activeTexture(r),P=r),e.bindTexture(t,n||se[t]),i.type=t,i.texture=n)}function Ce(){let t=ne[P];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function we(){try{e.compressedTexImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Te(){try{e.compressedTexImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Ee(){try{e.texSubImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function De(){try{e.texSubImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function ke(){try{e.compressedTexSubImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Ae(){try{e.texStorage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function je(){try{e.texStorage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function L(){try{e.texImage2D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Me(){try{e.texImage3D(...arguments)}catch(e){V(`WebGLState:`,e)}}function Ne(t){return d[t]===void 0?e.getParameter(t):d[t]}function Pe(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function R(t){ie.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ie.copy(t))}function Fe(t){ae.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ae.copy(t))}function z(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ie(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Le(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},P=null,ne={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ie.set(0,0,e.canvas.width,e.canvas.height),ae.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:I,disable:ce,bindFramebuffer:le,drawBuffers:ue,useProgram:de,setBlending:me,setMaterial:he,setFlipSided:ge,setCullFace:_e,setLineWidth:ve,setPolygonOffset:ye,setScissorTest:be,activeTexture:xe,bindTexture:Se,unbindTexture:Ce,compressedTexImage2D:we,compressedTexImage3D:Te,texImage2D:L,texImage3D:Me,pixelStorei:Pe,getParameter:Ne,updateUBOMapping:z,uniformBlockBinding:Ie,texStorage2D:Ae,texStorage3D:je,texSubImage2D:Ee,texSubImage3D:De,compressedTexSubImage2D:Oe,compressedTexSubImage3D:ke,scissor:R,viewport:Fe,reset:Le}}function Yd(e,t,n,r,p,m,h){let g=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new W,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):Xe(`canvas`)}function T(e,t,n){let r=1,i=Ne(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),B(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&B(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function E(e){return e.generateMipmaps}function D(t){e.generateMipmap(t)}function O(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function k(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];B(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||B(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?He:Rt.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function j(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,B(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function ee(e,t){return E(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function M(e){let t=e.target;t.removeEventListener(`dispose`,M),te(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function N(e){let t=e.target;t.removeEventListener(`dispose`,N),ne(t)}function te(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=S.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&P(e),Object.keys(i).length===0&&S.delete(n)}r.remove(e)}function P(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=S.get(i);delete a[n.__cacheKey],h.memory.textures--}function ne(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),h.memory.textures--),r.remove(i[t])}r.remove(t)}let F=0;function re(){F=0}function ie(){return F}function ae(e){F=e}function oe(){let e=F;return e>=p.maxTextures&&B(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+p.maxTextures),F+=1,e}function se(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function I(t,i){let a=r.get(t);if(t.isVideoTexture&&L(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)B(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)B(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ve(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ce(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ve(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function le(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ve(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ue(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?ye(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let de={[i]:e.REPEAT,[a]:e.CLAMP_TO_EDGE,[o]:e.MIRRORED_REPEAT},fe={[s]:e.NEAREST,[c]:e.NEAREST_MIPMAP_NEAREST,[l]:e.NEAREST_MIPMAP_LINEAR,[u]:e.LINEAR,[d]:e.LINEAR_MIPMAP_NEAREST,[f]:e.LINEAR_MIPMAP_LINEAR},pe={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function me(n,i){if(i.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(i.magFilter===1006||i.magFilter===1007||i.magFilter===1005||i.magFilter===1008||i.minFilter===1006||i.minFilter===1007||i.minFilter===1005||i.minFilter===1008)&&B(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,de[i.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,de[i.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,de[i.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,fe[i.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,fe[i.minFilter]),i.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,pe[i.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(i.magFilter===1003||i.minFilter!==1005&&i.minFilter!==1008||i.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(i.anisotropy>1||r.get(i).__currentAnisotropy){let a=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,a.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(i.anisotropy,p.getMaxAnisotropy())),r.get(i).__currentAnisotropy=i.anisotropy}}}function he(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,M));let i=n.source,a=S.get(i);a===void 0&&(a={},S.set(i,a));let o=se(n);if(o!==t.__cacheKey){a[o]===void 0&&(a[o]={texture:e.createTexture(),usedTimes:0},h.memory.textures++,r=!0),a[o].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&P(n)),t.__cacheKey=o,t.__webglTexture=a[o].texture}return r}function ge(e,t,n){return Math.floor(Math.floor(e/n)/t)}function _e(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=ge(n.start,r.width,4),c=ge(t.start,r.width,4);n.start<=i+1&&a===c&&ge(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ve(t,i,a){let o=e.TEXTURE_2D;(i.isDataArrayTexture||i.isCompressedArrayTexture)&&(o=e.TEXTURE_2D_ARRAY),i.isData3DTexture&&(o=e.TEXTURE_3D);let s=he(t,i),c=i.source;n.bindTexture(o,t.__webglTexture,e.TEXTURE0+a);let l=r.get(c);if(c.version!==l.__version||s===!0){if(n.activeTexture(e.TEXTURE0+a),!(typeof ImageBitmap<`u`&&i.image instanceof ImageBitmap)){let t=Rt.getPrimaries(Rt.workingColorSpace),r=i.colorSpace===``?null:Rt.getPrimaries(i.colorSpace),a=i.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,i.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,i.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,a)}n.pixelStorei(e.UNPACK_ALIGNMENT,i.unpackAlignment);let t=T(i.image,!1,p.maxTextureSize);t=Me(i,t);let r=m.convert(i.format,i.colorSpace),u=m.convert(i.type),d=k(i.internalFormat,r,u,i.normalized,i.colorSpace,i.isVideoTexture);me(o,i);let f,h=i.mipmaps,g=i.isVideoTexture!==!0,_=l.__version===void 0||s===!0,v=c.dataReady,y=ee(i,t);if(i.isDepthTexture)d=j(i.format===A,i.type),_&&(g?n.texStorage2D(e.TEXTURE_2D,1,d,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,d,t.width,t.height,0,r,u,null));else if(i.isDataTexture){if(h.length>0){g&&_&&n.texStorage2D(e.TEXTURE_2D,y,d,h[0].width,h[0].height);for(let t=0,i=h.length;t<i;t++)f=h[t],g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,r,u,f.data):n.texImage2D(e.TEXTURE_2D,t,d,f.width,f.height,0,r,u,f.data);i.generateMipmaps=!1}else g?(_&&n.texStorage2D(e.TEXTURE_2D,y,d,t.width,t.height),v&&_e(i,t,r,u)):n.texImage2D(e.TEXTURE_2D,0,d,t.width,t.height,0,r,u,t.data)}else if(i.isCompressedTexture){if(i.isCompressedArrayTexture){g&&_&&n.texStorage3D(e.TEXTURE_2D_ARRAY,y,d,h[0].width,h[0].height,t.depth);for(let a=0,o=h.length;a<o;a++)if(f=h[a],i.format!==1023){if(r!==null){if(g){if(v){if(i.layerUpdates.size>0){let t=Wc(f.width,f.height,i.format,i.type);for(let o of i.layerUpdates){let i=f.data.subarray(o*t/f.data.BYTES_PER_ELEMENT,(o+1)*t/f.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,a,0,0,o,f.width,f.height,1,r,i)}i.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,a,0,0,0,f.width,f.height,t.depth,r,f.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,a,d,f.width,f.height,t.depth,0,f.data,0,0)}else B(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,a,0,0,0,f.width,f.height,t.depth,r,u,f.data):n.texImage3D(e.TEXTURE_2D_ARRAY,a,d,f.width,f.height,t.depth,0,r,u,f.data)}else{g&&_&&n.texStorage2D(e.TEXTURE_2D,y,d,h[0].width,h[0].height);for(let t=0,a=h.length;t<a;t++)f=h[t],i.format===1023?g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,r,u,f.data):n.texImage2D(e.TEXTURE_2D,t,d,f.width,f.height,0,r,u,f.data):r===null?B(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,f.width,f.height,r,f.data):n.compressedTexImage2D(e.TEXTURE_2D,t,d,f.width,f.height,0,f.data)}}else if(i.isDataArrayTexture){if(g){if(_&&n.texStorage3D(e.TEXTURE_2D_ARRAY,y,d,t.width,t.height,t.depth),v){if(i.layerUpdates.size>0){let a=Wc(t.width,t.height,i.format,i.type);for(let o of i.layerUpdates){let i=t.data.subarray(o*a/t.data.BYTES_PER_ELEMENT,(o+1)*a/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,o,t.width,t.height,1,r,u,i)}i.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,u,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,d,t.width,t.height,t.depth,0,r,u,t.data)}else if(i.isData3DTexture)g?(_&&n.texStorage3D(e.TEXTURE_3D,y,d,t.width,t.height,t.depth),v&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,u,t.data)):n.texImage3D(e.TEXTURE_3D,0,d,t.width,t.height,t.depth,0,r,u,t.data);else if(i.isFramebufferTexture){if(_){if(g)n.texStorage2D(e.TEXTURE_2D,y,d,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<y;t++)n.texImage2D(e.TEXTURE_2D,t,d,i,a,0,r,u,null),i>>=1,a>>=1}}}else if(i.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),b.add(i),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let t=Ne(h[0]);n.texStorage2D(e.TEXTURE_2D,y,d,t.width,t.height)}for(let t=0,i=h.length;t<i;t++)f=h[t],g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,u,f):n.texImage2D(e.TEXTURE_2D,t,d,r,u,f);i.generateMipmaps=!1}else if(g){if(_){let r=Ne(t);n.texStorage2D(e.TEXTURE_2D,y,d,r.width,r.height)}v&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,u,t)}else n.texImage2D(e.TEXTURE_2D,0,d,r,u,t);E(i)&&D(o),l.__version=c.version,i.onUpdate&&i.onUpdate(i)}t.__version=i.version}function ye(t,i,a){if(i.image.length!==6)return;let o=he(t,i),s=i.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+a);let c=r.get(s);if(s.version!==c.__version||o===!0){n.activeTexture(e.TEXTURE0+a);let t=Rt.getPrimaries(Rt.workingColorSpace),r=i.colorSpace===``?null:Rt.getPrimaries(i.colorSpace),l=i.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,i.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,i.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,i.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,l);let u=i.isCompressedTexture||i.image[0].isCompressedTexture,d=i.image[0]&&i.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!u&&!d?f[e]=T(i.image[e],!0,p.maxCubemapSize):f[e]=d?i.image[e].image:i.image[e],f[e]=Me(i,f[e]);let h=f[0],g=m.convert(i.format,i.colorSpace),_=m.convert(i.type),v=k(i.internalFormat,g,_,i.normalized,i.colorSpace),y=i.isVideoTexture!==!0,b=c.__version===void 0||o===!0,x=s.dataReady,S=ee(i,h);me(e.TEXTURE_CUBE_MAP,i);let C;if(u){y&&b&&n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=f[t].mipmaps;for(let r=0;r<C.length;r++){let a=C[r];i.format===1023?y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,a.width,a.height,g,_,a.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,a.width,a.height,0,g,_,a.data):g===null?B(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,a.width,a.height,g,a.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,a.width,a.height,0,a.data)}}}else{if(C=i.mipmaps,y&&b){C.length>0&&S++;let t=Ne(f[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(d){y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,f[t].width,f[t].height,g,_,f[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,f[t].width,f[t].height,0,g,_,f[t].data);for(let r=0;r<C.length;r++){let i=C[r].image[t].image;y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,i.width,i.height,0,g,_,i.data)}}else{y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,f[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,f[t]);for(let r=0;r<C.length;r++){let i=C[r];y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,g,_,i.image[t])}}}E(i)&&D(e.TEXTURE_CUBE_MAP),c.__version=s.version,i.onUpdate&&i.onUpdate(i)}t.__version=i.version}function be(t,i,a,o,s,c){let l=m.convert(a.format,a.colorSpace),u=m.convert(a.type),d=k(a.internalFormat,l,u,a.normalized,a.colorSpace),f=r.get(i),p=r.get(a);if(p.__renderTarget=i,!f.__hasExternalTextures){let t=Math.max(1,i.width>>c),r=Math.max(1,i.height>>c);s===e.TEXTURE_3D||s===e.TEXTURE_2D_ARRAY?n.texImage3D(s,c,d,t,r,i.depth,0,l,u,null):n.texImage2D(s,c,d,t,r,0,l,u,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),je(i)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,o,s,p.__webglTexture,0,Ae(i)):(s===e.TEXTURE_2D||s>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&s<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,o,s,p.__webglTexture,c),n.bindFramebuffer(e.FRAMEBUFFER,null)}function xe(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=j(n.stencilBuffer,a),s=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;je(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ae(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ae(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,s,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let a=t[i],o=m.convert(a.format,a.colorSpace),s=m.convert(a.type),c=k(a.internalFormat,o,s,a.normalized,a.colorSpace);je(n)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ae(n),c,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ae(n),c,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,c,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Se(t,i,a){let o=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let s=r.get(i.depthTexture);if(s.__renderTarget=i,(!s.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),o){if(s.__webglInit===void 0&&(s.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,M)),s.__webglTexture===void 0){s.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,s.__webglTexture),me(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=m.convert(i.depthTexture.format),r=m.convert(i.depthTexture.type),a;i.depthTexture.format===1026?a=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(a=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,a,i.width,i.height,0,t,r,null)}}else I(i.depthTexture,0);let c=s.__webglTexture,l=Ae(i),u=o?e.TEXTURE_CUBE_MAP_POSITIVE_X+a:e.TEXTURE_2D,d=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)je(i)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,d,u,c,0,l):e.framebufferTexture2D(e.FRAMEBUFFER,d,u,c,0);else if(i.depthTexture.format===1027)je(i)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,d,u,c,0,l):e.framebufferTexture2D(e.FRAMEBUFFER,d,u,c,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Ce(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)Se(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?Se(i.__webglFramebuffer[0],t,0):Se(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),xe(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),xe(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function we(t,n,i){let a=r.get(t);n!==void 0&&be(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&Ce(t)}function Te(t){let i=t.texture,a=r.get(t),o=r.get(i);t.addEventListener(`dispose`,N);let s=t.textures,c=t.isWebGLCubeRenderTarget===!0,l=s.length>1;if(l||(o.__webglTexture===void 0&&(o.__webglTexture=e.createTexture()),o.__version=i.version,h.memory.textures++),c){a.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){a.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)a.__webglFramebuffer[t][n]=e.createFramebuffer()}else a.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){a.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)a.__webglFramebuffer[t]=e.createFramebuffer()}else a.__webglFramebuffer=e.createFramebuffer();if(l)for(let t=0,n=s.length;t<n;t++){let n=r.get(s[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),h.memory.textures++)}if(t.samples>0&&je(t)===!1){a.__webglMultisampledFramebuffer=e.createFramebuffer(),a.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,a.__webglMultisampledFramebuffer);for(let n=0;n<s.length;n++){let r=s[n];a.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,a.__webglColorRenderbuffer[n]);let i=m.convert(r.format,r.colorSpace),o=m.convert(r.type),c=k(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),l=Ae(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,l,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,a.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(a.__webglDepthRenderbuffer=e.createRenderbuffer(),xe(a.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(c){n.bindTexture(e.TEXTURE_CUBE_MAP,o.__webglTexture),me(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)be(a.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else be(a.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);E(i)&&D(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(l){for(let i=0,o=s.length;i<o;i++){let o=s[i],c=r.get(o),l=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(l=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(l,c.__webglTexture),me(l,o),be(a.__webglFramebuffer,t,o,e.COLOR_ATTACHMENT0+i,l,0),E(o)&&D(l)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,o.__webglTexture),me(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)be(a.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else be(a.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);E(i)&&D(r),n.unbindTexture()}t.depthBuffer&&Ce(t)}function Ee(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(E(a)){let t=O(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),D(t),n.unbindTexture()}}}let De=[],Oe=[];function ke(t){if(t.samples>0){if(je(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,c=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,l=r.get(t),u=i.length>1;if(u)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,l.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,l.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,l.__webglMultisampledFramebuffer);let d=t.texture.mipmaps;d&&d.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,l.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,l.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),u){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,l.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),_===!0&&(De.length=0,Oe.length=0,De.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(De.push(c),Oe.push(c),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Oe)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,De))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),u)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,l.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,l.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,l.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,l.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&_){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ae(e){return Math.min(p.maxSamples,e.samples)}function je(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function L(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Me(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Rt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&B(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):V(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ne(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=oe,this.resetTextureUnits=re,this.getTextureUnits=ie,this.setTextureUnits=ae,this.setTexture2D=I,this.setTexture2DArray=ce,this.setTexture3D=le,this.setTextureCube=ue,this.rebindTextures=we,this.setupRenderTarget=Te,this.updateRenderTargetMipmap=Ee,this.updateMultisampleRenderTarget=ke,this.setupDepthRenderbuffer=Ce,this.setupFrameBufferTexture=be,this.useMultisampledRTT=je,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Xd(e,t){function n(n,r=``){let i,a=Rt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Zd=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Qd=`
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

}`,$d=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ma(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new vs({vertexShader:Zd,fragmentShader:Qd,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Y(new as(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ef=class extends it{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,m=null,h=typeof XRWebGLBinding<`u`,g=new $d,_={},y=t.getContextAttributes(),b=null,x=null,S=[],w=[],T=new W,E=null,D=new oc;D.viewport=new Yt;let j=new oc;j.viewport=new Yt;let ee=[D,j],M=new _c,N=null,te=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=S[e];return t===void 0&&(t=new An,S[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=S[e];return t===void 0&&(t=new An,S[e]=t),t.getGripSpace()},this.getHand=function(e){let t=S[e];return t===void 0&&(t=new An,S[e]=t),t.getHandSpace()};function P(e){let t=w.indexOf(e.inputSource);if(t===-1)return;let n=S[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ne(){r.removeEventListener(`select`,P),r.removeEventListener(`selectstart`,P),r.removeEventListener(`selectend`,P),r.removeEventListener(`squeeze`,P),r.removeEventListener(`squeezestart`,P),r.removeEventListener(`squeezeend`,P),r.removeEventListener(`end`,ne),r.removeEventListener(`inputsourceschange`,F);for(let e=0;e<S.length;e++){let t=w[e];t!==null&&(w[e]=null,S[e].disconnect(t))}N=null,te=null,g.reset();for(let e in _)delete _[e];e.setRenderTarget(b),f=null,d=null,u=null,r=null,x=null,le.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(T.width,T.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&B(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&B(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&h&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(b=e.getRenderTarget(),r.addEventListener(`select`,P),r.addEventListener(`selectstart`,P),r.addEventListener(`selectend`,P),r.addEventListener(`squeeze`,P),r.addEventListener(`squeezestart`,P),r.addEventListener(`squeezeend`,P),r.addEventListener(`end`,ne),r.addEventListener(`inputsourceschange`,F),y.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(T),h&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;y.depth&&(o=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=y.stencil?A:k,a=y.stencil?C:v);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Zt(d.textureWidth,d.textureHeight,{format:O,type:p,depthTexture:new Aa(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Zt(f.framebufferWidth,f.framebufferHeight,{format:O,type:p,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),le.setContext(r),le.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function F(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=w.indexOf(n);r>=0&&(w[r]=null,S[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=w.indexOf(n);if(r===-1){for(let e=0;e<S.length;e++)if(e>=w.length){w.push(n),r=e;break}else if(w[e]===null){w[e]=n,r=e;break}if(r===-1)break}let i=S[r];i&&i.connect(n)}}let re=new G,ie=new G;function ae(e,t,n){re.setFromMatrixPosition(t.matrixWorld),ie.setFromMatrixPosition(n.matrixWorld);let r=re.distanceTo(ie),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function oe(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;g.texture!==null&&(g.depthNear>0&&(t=g.depthNear),g.depthFar>0&&(n=g.depthFar)),M.near=j.near=D.near=t,M.far=j.far=D.far=n,(N!==M.near||te!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),N=M.near,te=M.far),M.layers.mask=e.layers.mask|6,D.layers.mask=M.layers.mask&-5,j.layers.mask=M.layers.mask&-3;let i=e.parent,a=M.cameras;oe(M,i);for(let e=0;e<a.length;e++)oe(a[e],i);a.length===2?ae(M,D,j):M.projectionMatrix.copy(D.projectionMatrix),se(e,M,i)};function se(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=ct*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(M)},this.getCameraTexture=function(e){return _[e]};let I=null;function ce(t,i){if(l=i.getViewerPose(c||a),m=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let i=!1;t.length!==M.cameras.length&&(M.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(x,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(x))}let o=ee[n];o===void 0&&(o=new oc,o.layers.enable(n),o.viewport=new Yt,ee[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(M.matrix.copy(o.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),i===!0&&M.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&h){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&g.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&h){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=_[n];e||(e=new Ma,_[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<S.length;e++){let t=w[e],n=S[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}I&&I(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),m=null}let le=new Kc;le.setAnimationLoop(ce),this.setAnimationLoop=function(e){I=e},this.dispose=function(){}}},tf=new K,nf=new Nt;nf.set(-1,0,0,0,1,0,0,0,1);function rf(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,ms(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(tf.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(nf),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function af(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return V(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?B(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):B(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var of=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),sf=null;function cf(){return sf===null&&(sf=new yi(of,16,16,M,b),sf.name=`DFG_LUT`,sf.minFilter=u,sf.magFilter=u,sf.wrapS=a,sf.wrapT=a,sf.generateMipmaps=!1,sf.needsUpdate=!0),sf}var lf=class{constructor(e={}){let{canvas:t=Ze(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:m=p}=e;this.isWebGLRenderer=!0;let h;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);h=n.getContextAttributes().alpha}else h=a;let _=m,y=new Set([te,N,ee]),w=new Set([p,v,g,C,x,S]),T=new Uint32Array(4),E=new Int32Array(4),D=new G,O=null,k=null,A=[],j=[],M=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,ne=!1,F=null,re=null,ie=null,ae=null;this._outputColorSpace=Be;let oe=0,se=0,I=null,ce=-1,le=null,ue=new Yt,de=new Yt,fe=null,pe=new q(0),me=0,he=t.width,ge=t.height,_e=1,ve=null,ye=null,be=new Yt(0,0,he,ge),xe=new Yt(0,0,he,ge),Se=!1,Ce=new zi,we=!1,Te=!1,Ee=new K,De=new G,Oe=new Yt,ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ae=!1;function je(){return I===null?_e:1}let L=n;function Me(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r185`),t.addEventListener(`webglcontextlost`,st,!1),t.addEventListener(`webglcontextrestored`,ct,!1),t.addEventListener(`webglcontextcreationerror`,lt,!1),L===null){let t=`webgl2`;if(L=Me(t,e),L===null)throw Me(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}}catch(e){throw V(`WebGLRenderer: `+e.message),e}let Ne,Pe,R,Fe,z,Ie,Le,Re,ze,Ve,He,Ue,We,Ge,Ke,Je,Ye,Xe,Qe,et,tt,rt,it;function at(){Ne=new El(L),Ne.init(),tt=new Xd(L,Ne),Pe=new nl(L,Ne,e,tt),R=new Jd(L,Ne),Pe.reversedDepthBuffer&&d&&R.buffers.depth.setReversed(!0),re=L.createFramebuffer(),ie=L.createFramebuffer(),ae=L.createFramebuffer(),Fe=new kl(L),z=new Od,Ie=new Yd(L,Ne,R,z,Pe,tt,Fe),Le=new Tl(P),Re=new qc(L),rt=new el(L,Re),ze=new Dl(L,Re,Fe,rt),Ve=new jl(L,ze,Re,rt,Fe),Xe=new Al(L,Pe,Ie),Ke=new rl(z),He=new Dd(P,Le,Ne,Pe,rt,Ke),Ue=new rf(P,z),We=new Md,Ge=new zd(Ne),Ye=new $c(P,Le,R,Ve,h,s),Je=new qd(P,Ve,Pe),it=new af(L,Fe,Pe,R),Qe=new tl(L,Ne,Fe),et=new Ol(L,Ne,Fe),Fe.programs=He.programs,P.capabilities=Pe,P.extensions=Ne,P.properties=z,P.renderLists=We,P.shadowMap=Je,P.state=R,P.info=Fe}at(),_!==1009&&(M=new Nl(_,t.width,t.height,o,r,i));let ot=new ef(P,L);this.xr=ot,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let e=Ne.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Ne.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return _e},this.setPixelRatio=function(e){e!==void 0&&(_e=e,this.setSize(he,ge,!1))},this.getSize=function(e){return e.set(he,ge)},this.setSize=function(e,n,r=!0){ot.isPresenting?B(`WebGLRenderer: Can't change size while VR device is presenting.`):(he=e,ge=n,t.width=Math.floor(e*_e),t.height=Math.floor(n*_e),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),M!==null&&M.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(he*_e,ge*_e).floor()},this.setDrawingBufferSize=function(e,n,r){he=e,ge=n,_e=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(_===1009)V(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){B(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}M.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(ue)},this.getViewport=function(e){return e.copy(be)},this.setViewport=function(e,t,n,r){e.isVector4?be.set(e.x,e.y,e.z,e.w):be.set(e,t,n,r),R.viewport(ue.copy(be).multiplyScalar(_e).round())},this.getScissor=function(e){return e.copy(xe)},this.setScissor=function(e,t,n,r){e.isVector4?xe.set(e.x,e.y,e.z,e.w):xe.set(e,t,n,r),R.scissor(de.copy(xe).multiplyScalar(_e).round())},this.getScissorTest=function(){return Se},this.setScissorTest=function(e){R.setScissorTest(Se=e)},this.setOpaqueSort=function(e){ve=e},this.setTransparentSort=function(e){ye=e},this.getClearColor=function(e){return e.copy(Ye.getClearColor())},this.setClearColor=function(){Ye.setClearColor(...arguments)},this.getClearAlpha=function(){return Ye.getClearAlpha()},this.setClearAlpha=function(){Ye.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(I!==null){let t=I.texture.format;e=y.has(t)}if(e){let e=I.texture.type,t=w.has(e),n=Ye.getClearColor(),r=Ye.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,L.clearBufferuiv(L.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,L.clearBufferiv(L.COLOR,0,E))}else r|=L.COLOR_BUFFER_BIT}t&&(r|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&L.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),F=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,st,!1),t.removeEventListener(`webglcontextrestored`,ct,!1),t.removeEventListener(`webglcontextcreationerror`,lt,!1),Ye.dispose(),We.dispose(),Ge.dispose(),z.dispose(),Le.dispose(),Ve.dispose(),rt.dispose(),it.dispose(),He.dispose(),ot.dispose(),ot.removeEventListener(`sessionstart`,ht),ot.removeEventListener(`sessionend`,gt),_t.stop()};function st(e){e.preventDefault(),$e(`WebGLRenderer: Context Lost.`),ne=!0}function ct(){$e(`WebGLRenderer: Context Restored.`),ne=!1;let e=Fe.autoReset,t=Je.enabled,n=Je.autoUpdate,r=Je.needsUpdate,i=Je.type;at(),Fe.autoReset=e,Je.enabled=t,Je.autoUpdate=n,Je.needsUpdate=r,Je.type=i}function lt(e){V(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function H(e){let t=e.target;t.removeEventListener(`dispose`,H),ut(t)}function ut(e){dt(e),z.remove(e)}function dt(e){let t=z.get(e).programs;t!==void 0&&(t.forEach(function(e){He.releaseProgram(e)}),e.isShaderMaterial&&He.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ke);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Dt(e,t,n,r,i);R.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=ze.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;rt.setup(i,r,s,n,c);let h,g=Qe;if(c!==null&&(h=Re.get(c),g=et,g.setIndex(h)),i.isMesh)r.wireframe===!0?(R.setLineWidth(r.wireframeLinewidth*je()),g.setMode(L.LINES)):g.setMode(L.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),R.setLineWidth(e*je()),i.isLineSegments?g.setMode(L.LINES):i.isLineLoop?g.setMode(L.LINE_LOOP):g.setMode(L.LINE_STRIP)}else i.isPoints?g.setMode(L.POINTS):i.isSprite&&g.setMode(L.TRIANGLES);if(i.isBatchedMesh){if(Ne.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Re.get(c).bytesPerElement:1,o=z.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(L,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ft(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Ct(e,t,n),e.side=0,e.needsUpdate=!0,Ct(e,t,n),e.side=2):Ct(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),k=Ge.get(n),k.init(t),j.push(k),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(k.pushLight(e),e.castShadow&&k.pushShadow(e))}),k.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];ft(a,n,e),r.add(a)}else ft(t,n,e),r.add(t)}}),k=j.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){z.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Ne.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let pt=null;function mt(e){pt&&pt(e)}function ht(){_t.stop()}function gt(){_t.start()}let _t=new Kc;_t.setAnimationLoop(mt),typeof self<`u`&&_t.setContext(self),this.setAnimationLoop=function(e){pt=e,ot.setAnimationLoop(e),e===null?_t.stop():_t.start()},ot.addEventListener(`sessionstart`,ht),ot.addEventListener(`sessionend`,gt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){V(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(ne===!0)return;F!==null&&F.renderStart(e,t);let n=ot.enabled===!0&&ot.isPresenting===!0,r=M!==null&&(I===null||n)&&M.begin(P,I);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ot.enabled===!0&&ot.isPresenting===!0&&(M===null||M.isCompositing()===!1)&&(ot.cameraAutoUpdate===!0&&ot.updateCamera(t),t=ot.getCamera()),e.isScene===!0&&e.onBeforeRender(P,e,t,I),k=Ge.get(e,j.length),k.init(t),k.state.textureUnits=Ie.getTextureUnits(),j.push(k),Ee.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Ce.setFromProjectionMatrix(Ee,qe,t.reversedDepth),Te=this.localClippingEnabled,we=Ke.init(this.clippingPlanes,Te),O=We.get(e,A.length),O.init(),A.push(O),ot.enabled===!0&&ot.isPresenting===!0){let e=P.xr.getDepthSensingMesh();e!==null&&vt(e,t,-1/0,P.sortObjects)}vt(e,t,0,P.sortObjects),O.finish(),P.sortObjects===!0&&O.sort(ve,ye,t.reversedDepth),Ae=ot.enabled===!1||ot.isPresenting===!1||ot.hasDepthSensing()===!1,Ae&&Ye.addToRenderList(O,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),we===!0&&Ke.beginShadows();let i=k.state.shadowsArray;if(Je.render(i,e,t),we===!0&&Ke.endShadows(),(r&&M.hasRenderPass())===!1){let n=O.opaque,r=O.transmissive;if(k.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];bt(n,r,e,a)}Ae&&Ye.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];yt(O,e,n,n.viewport)}}else r.length>0&&bt(n,r,e,t),Ae&&Ye.render(e),yt(O,e,t)}I!==null&&se===0&&(Ie.updateMultisampleRenderTarget(I),Ie.updateRenderTargetMipmap(I)),r&&M.end(P),e.isScene===!0&&e.onAfterRender(P,e,t),rt.resetDefaultState(),ce=-1,le=null,j.pop(),j.length>0?(k=j[j.length-1],Ie.setTextureUnits(k.state.textureUnits),we===!0&&Ke.setGlobalState(P.clippingPlanes,k.state.camera)):k=null,A.pop(),O=A.length>0?A[A.length-1]:null,F!==null&&F.renderEnd()};function vt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)k.pushLightProbeGrid(e);else if(e.isLight)k.pushLight(e),e.castShadow&&k.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||Ce.intersectsSprite(e)){r&&Oe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Ee);let t=Ve.update(e),i=e.material;i.visible&&O.push(e,t,i,n,Oe.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||Ce.intersectsObject(e))){let t=Ve.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),Oe.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Oe.copy(e.boundingSphere.center)),Oe.applyMatrix4(e.matrixWorld).applyMatrix4(Ee)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&O.push(e,t,s,n,Oe.z,o)}}else i.visible&&O.push(e,t,i,n,Oe.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)vt(i[e],t,n,r)}function yt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;k.setupLightsView(n),we===!0&&Ke.setGlobalState(P.clippingPlanes,n),r&&R.viewport(ue.copy(r)),i.length>0&&xt(i,t,n),a.length>0&&xt(a,t,n),o.length>0&&xt(o,t,n),R.buffers.depth.setTest(!0),R.buffers.depth.setMask(!0),R.buffers.color.setMask(!0),R.setPolygonOffset(!1)}function bt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(k.state.transmissionRenderTarget[r.id]===void 0){let e=Ne.has(`EXT_color_buffer_half_float`)||Ne.has(`EXT_color_buffer_float`);k.state.transmissionRenderTarget[r.id]=new Zt(1,1,{generateMipmaps:!0,type:e?b:p,minFilter:f,samples:Math.max(4,Pe.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Rt.workingColorSpace})}let a=k.state.transmissionRenderTarget[r.id],o=r.viewport||ue;a.setSize(o.z*P.transmissionResolutionScale,o.w*P.transmissionResolutionScale);let s=P.getRenderTarget(),c=P.getActiveCubeFace(),l=P.getActiveMipmapLevel();P.setRenderTarget(a),P.getClearColor(pe),me=P.getClearAlpha(),me<1&&P.setClearColor(16777215,.5),P.clear(),Ae&&Ye.render(n);let u=P.toneMapping;P.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),k.setupLightsView(r),we===!0&&Ke.setGlobalState(P.clippingPlanes,r),xt(e,n,r),Ie.updateMultisampleRenderTarget(a),Ie.updateRenderTargetMipmap(a),Ne.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,St(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(Ie.updateMultisampleRenderTarget(a),Ie.updateRenderTargetMipmap(a))}P.setRenderTarget(s,c,l),P.setClearColor(pe,me),d!==void 0&&(r.viewport=d),P.toneMapping=u}function xt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&St(o,t,n,s,l,c)}}function St(e,t,n,r,i,a){e.onBeforeRender(P,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(P,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,P.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,P.renderBufferDirect(n,t,r,i,e,a),i.side=2):P.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(P,t,n,r,i,a)}function Ct(e,t,n){t.isScene!==!0&&(t=ke);let r=z.get(e),i=k.state.lights,a=k.state.shadowsArray,o=i.state.version,s=He.getParameters(e,i.state,a,t,n,k.state.lightProbeGridArray),c=He.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Le.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,H),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Tt(e,s),d}else s.uniforms=He.getUniforms(e),F!==null&&e.isNodeMaterial&&F.build(e,n,s),e.onBeforeCompile(s,P),d=He.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ke.uniform),Tt(e,s),r.needsLights=kt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=k.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function wt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Bu.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Tt(e,t){let n=z.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Et(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function Dt(e,t,n,r,i){t.isScene!==!0&&(t=ke),Ie.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=I===null?P.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Rt.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Le.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(h=P.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=z.get(r),y=k.state.lights;if(we===!0&&(Te===!0||e!==le)){let t=e===le&&r.id===ce;Ke.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ke.numPlanes||v.numIntersection!==Ke.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=k.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=Ct(r,t,i),F&&r.isNodeMaterial&&F.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(R.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==ce&&(ce=r.id,C=!0),v.needsLights){let e=Et(k.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||le!==e){R.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(L,`projectionMatrix`,e.projectionMatrix),T.setValue(L,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(L,De.setFromMatrixPosition(e.matrixWorld)),Pe.logarithmicDepthBuffer&&T.setValue(L,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(L,`isOrthographic`,e.isOrthographicCamera===!0),le!==e&&(le=e,C=!0,w=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&T.setValue(L,`directionalShadowMap`,y.state.directionalShadowMap,Ie),y.state.spotShadowMap.length>0&&T.setValue(L,`spotShadowMap`,y.state.spotShadowMap,Ie),y.state.pointShadowMap.length>0&&T.setValue(L,`pointShadowMap`,y.state.pointShadowMap,Ie)),i.isSkinnedMesh){T.setOptional(L,i,`bindMatrix`),T.setOptional(L,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(L,`boneTexture`,e.boneTexture,Ie))}i.isBatchedMesh&&(T.setOptional(L,i,`batchingTexture`),T.setValue(L,`batchingTexture`,i._matricesTexture,Ie),T.setOptional(L,i,`batchingIdTexture`),T.setValue(L,`batchingIdTexture`,i._indirectTexture,Ie),T.setOptional(L,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(L,`batchingColorTexture`,i._colorsTexture,Ie));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&Xe.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(L,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=cf()),C){if(T.setValue(L,`toneMappingExposure`,P.toneMappingExposure),v.needsLights&&Ot(E,w),a&&r.fog===!0&&Ue.refreshFogUniforms(E,a),Ue.refreshMaterialUniforms(E,r,_e,ge,k.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}Bu.upload(L,wt(v),E,Ie)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Bu.upload(L,wt(v),E,Ie),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(L,`center`,i.center),T.setValue(L,`modelViewMatrix`,i.modelViewMatrix),T.setValue(L,`normalMatrix`,i.normalMatrix),T.setValue(L,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];it.update(n,x),it.bind(n,x)}}return x}function Ot(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function kt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return oe},this.getActiveMipmapLevel=function(){return se},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(e,t,n){let r=z.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),z.get(e.texture).__webglTexture=t,z.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=z.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){I=e,oe=t,se=n;let r=null,i=!1,a=!1;if(e){let o=z.get(e);if(o.__useDefaultFramebuffer!==void 0){R.bindFramebuffer(L.FRAMEBUFFER,o.__webglFramebuffer),ue.copy(e.viewport),de.copy(e.scissor),fe=e.scissorTest,R.viewport(ue),R.scissor(de),R.setScissorTest(fe),ce=-1;return}if(o.__webglFramebuffer===void 0)Ie.setupRenderTarget(e);else if(o.__hasExternalTextures)Ie.rebindTextures(e,z.get(e.texture).__webglTexture,z.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&z.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);Ie.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=z.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&Ie.useMultisampledRTT(e)===!1?z.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,ue.copy(e.viewport),de.copy(e.scissor),fe=e.scissorTest}else ue.copy(be).multiplyScalar(_e).floor(),de.copy(xe).multiplyScalar(_e).floor(),fe=Se;if(n!==0&&(r=re),R.bindFramebuffer(L.FRAMEBUFFER,r)&&R.drawBuffers(e,r),R.viewport(ue),R.scissor(de),R.setScissorTest(fe),i){let r=z.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=z.get(e.textures[t]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=z.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,t.__webglTexture,n)}ce=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){V(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){R.bindFramebuffer(L.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s),!Pe.textureFormatReadable(c)){V(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!Pe.textureTypeReadable(l)){V(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&L.readPixels(t,n,r,i,tt.convert(c),tt.convert(l),a)}finally{let e=I===null?null:z.get(I).__webglFramebuffer;R.bindFramebuffer(L.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){R.bindFramebuffer(L.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s),!Pe.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!Pe.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,d),L.bufferData(L.PIXEL_PACK_BUFFER,a.byteLength,L.STREAM_READ),L.readPixels(t,n,r,i,tt.convert(l),tt.convert(u),0);let f=I===null?null:z.get(I).__webglFramebuffer;R.bindFramebuffer(L.FRAMEBUFFER,f);let p=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await nt(L,p,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,d),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,a),L.deleteBuffer(d),L.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Ie.setTexture2D(e,0),L.copyTexSubImage2D(L.TEXTURE_2D,n,0,0,o,s,i,a),R.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=tt.convert(t.format),_=tt.convert(t.type),v;t.isData3DTexture?(Ie.setTexture3D(t,0),v=L.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Ie.setTexture2DArray(t,0),v=L.TEXTURE_2D_ARRAY):(Ie.setTexture2D(t,0),v=L.TEXTURE_2D),R.activeTexture(L.TEXTURE0),R.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,t.flipY),R.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),R.pixelStorei(L.UNPACK_ALIGNMENT,t.unpackAlignment);let y=R.getParameter(L.UNPACK_ROW_LENGTH),b=R.getParameter(L.UNPACK_IMAGE_HEIGHT),x=R.getParameter(L.UNPACK_SKIP_PIXELS),S=R.getParameter(L.UNPACK_SKIP_ROWS),C=R.getParameter(L.UNPACK_SKIP_IMAGES);R.pixelStorei(L.UNPACK_ROW_LENGTH,h.width),R.pixelStorei(L.UNPACK_IMAGE_HEIGHT,h.height),R.pixelStorei(L.UNPACK_SKIP_PIXELS,l),R.pixelStorei(L.UNPACK_SKIP_ROWS,u),R.pixelStorei(L.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=z.get(e),r=z.get(t),h=z.get(n.__renderTarget),g=z.get(r.__renderTarget);R.bindFramebuffer(L.READ_FRAMEBUFFER,h.__webglFramebuffer),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(e).__webglTexture,i,d+n),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(t).__webglTexture,a,m+n)),L.blitFramebuffer(l,u,o,s,f,p,o,s,L.DEPTH_BUFFER_BIT,L.NEAREST);R.bindFramebuffer(L.READ_FRAMEBUFFER,null),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||z.has(e)){let n=z.get(e),r=z.get(t);R.bindFramebuffer(L.READ_FRAMEBUFFER,ie),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,ae);for(let e=0;e<c;e++)w?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,n.__webglTexture,i),T?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,r.__webglTexture,a),i===0?T?L.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):L.copyTexSubImage2D(v,a,f,p,l,u,o,s):L.blitFramebuffer(l,u,o,s,f,p,o,s,L.COLOR_BUFFER_BIT,L.NEAREST);R.bindFramebuffer(L.READ_FRAMEBUFFER,null),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?L.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h);R.pixelStorei(L.UNPACK_ROW_LENGTH,y),R.pixelStorei(L.UNPACK_IMAGE_HEIGHT,b),R.pixelStorei(L.UNPACK_SKIP_PIXELS,x),R.pixelStorei(L.UNPACK_SKIP_ROWS,S),R.pixelStorei(L.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&L.generateMipmap(v),R.unbindTexture()},this.initRenderTarget=function(e){z.get(e).__webglFramebuffer===void 0&&Ie.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Ie.setTextureCube(e,0):e.isData3DTexture?Ie.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Ie.setTexture2DArray(e,0):Ie.setTexture2D(e,0),R.unbindTexture()},this.resetState=function(){oe=0,se=0,I=null,R.reset(),rt.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return qe}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Rt._getUnpackColorSpace()}},uf={type:`change`},df={type:`start`},ff={type:`end`},pf=new qr,mf=new Fi,hf=Math.cos(70*U.DEG2RAD),gf=new G,_f=2*Math.PI,vf={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},yf=1e-6,bf=class extends Uc{constructor(n,r=null){super(n,r),this.state=vf.NONE,this.target=new G,this.cursor=new G,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:`ArrowLeft`,UP:`ArrowUp`,RIGHT:`ArrowRight`,BOTTOM:`ArrowDown`},this.mouseButtons={LEFT:e.ROTATE,MIDDLE:e.DOLLY,RIGHT:e.PAN},this.touches={ONE:t.ROTATE,TWO:t.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle=`auto`,this._domElementKeyEvents=null,this._lastPosition=new G,this._lastQuaternion=new At,this._lastTargetPosition=new G,this._quat=new At().setFromUnitVectors(n.up,new G(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Pc,this._sphericalDelta=new Pc,this._scale=1,this._panOffset=new G,this._rotateStart=new W,this._rotateEnd=new W,this._rotateDelta=new W,this._panStart=new W,this._panEnd=new W,this._panDelta=new W,this._dollyStart=new W,this._dollyEnd=new W,this._dollyDelta=new W,this._dollyDirection=new G,this._mouse=new W,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Sf.bind(this),this._onPointerDown=xf.bind(this),this._onPointerUp=Cf.bind(this),this._onContextMenu=Af.bind(this),this._onMouseWheel=Ef.bind(this),this._onKeyDown=Df.bind(this),this._onTouchStart=Of.bind(this),this._onTouchMove=kf.bind(this),this._onMouseDown=wf.bind(this),this._onMouseMove=Tf.bind(this),this._interceptControlDown=jf.bind(this),this._interceptControlUp=Mf.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e===`grab`?this.domElement.style.cursor=`grab`:this.domElement.style.cursor=`auto`}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener(`pointerdown`,this._onPointerDown),this.domElement.addEventListener(`pointercancel`,this._onPointerUp),this.domElement.addEventListener(`contextmenu`,this._onContextMenu),this.domElement.addEventListener(`wheel`,this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener(`keydown`,this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction=`none`}disconnect(){this.domElement.removeEventListener(`pointerdown`,this._onPointerDown),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.domElement.removeEventListener(`pointercancel`,this._onPointerUp),this.domElement.removeEventListener(`wheel`,this._onMouseWheel),this.domElement.removeEventListener(`contextmenu`,this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener(`keydown`,this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=``}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener(`keydown`,this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(uf),this.update(),this.state=vf.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){let t=this.object.position;gf.copy(t).sub(this.target),gf.applyQuaternion(this._quat),this._spherical.setFromVector3(gf),this.autoRotate&&this.state===vf.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=_f:n>Math.PI&&(n-=_f),r<-Math.PI?r+=_f:r>Math.PI&&(r-=_f),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let i=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let e=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),i=e!=this._spherical.radius}if(gf.setFromSpherical(this._spherical),gf.applyQuaternion(this._quatInverse),t.copy(this.target).add(gf),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let e=null;if(this.object.isPerspectiveCamera){let t=gf.length();e=this._clampDistance(t*this._scale);let n=t-e;this.object.position.addScaledVector(this._dollyDirection,n),this.object.updateMatrixWorld(),i=!!n}else if(this.object.isOrthographicCamera){let t=new G(this._mouse.x,this._mouse.y,0);t.unproject(this.object);let n=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),i=n!==this.object.zoom;let r=new G(this._mouse.x,this._mouse.y,0);r.unproject(this.object),this.object.position.sub(r).add(t),this.object.updateMatrixWorld(),e=gf.length()}else console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.`),this.zoomToCursor=!1;e!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position):(pf.origin.copy(this.object.position),pf.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(pf.direction))<hf?this.object.lookAt(this.target):(mf.setFromNormalAndCoplanarPoint(this.object.up,this.target),pf.intersectPlane(mf,this.target))))}else if(this.object.isOrthographicCamera){let e=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),e!==this.object.zoom&&(this.object.updateProjectionMatrix(),i=!0)}return this._scale=1,this._performCursorZoom=!1,i||this._lastPosition.distanceToSquared(this.object.position)>yf||8*(1-this._lastQuaternion.dot(this.object.quaternion))>yf||this._lastTargetPosition.distanceToSquared(this.target)>yf?(this.dispatchEvent(uf),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e===null?_f/60/60*this.autoRotateSpeed:_f/60*this.autoRotateSpeed*e}_getZoomScale(e){let t=Math.abs(e*.01);return .95**(this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){gf.setFromMatrixColumn(t,0),gf.multiplyScalar(-e),this._panOffset.add(gf)}_panUp(e,t){this.screenSpacePanning===!0?gf.setFromMatrixColumn(t,1):(gf.setFromMatrixColumn(t,0),gf.crossVectors(this.object.up,gf)),gf.multiplyScalar(e),this._panOffset.add(gf)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let r=this.object.position;gf.copy(r).sub(this.target);let i=gf.length();i*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*i/n.clientHeight,this.object.matrix),this._panUp(2*t*i/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.`),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),r=e-n.left,i=t-n.top,a=n.width,o=n.height;this._mouse.x=r/a*2-1,this._mouse.y=-(i/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(_f*this._rotateDelta.x/t.clientHeight),this._rotateUp(_f*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(_f*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-_f*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(_f*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-_f*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyStart.set(0,i)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateEnd.set(n,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(_f*this._rotateDelta.x/t.clientHeight),this._rotateUp(_f*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,i=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,i),this._dollyDelta.set(0,(this._dollyEnd.y/this._dollyStart.y)**+this.zoomSpeed),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new W,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function xf(e){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(e.pointerId),this.domElement.ownerDocument.addEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.addEventListener(`pointerup`,this._onPointerUp)),!this._isTrackingPointer(e)&&(this._addPointer(e),e.pointerType===`touch`?this._onTouchStart(e):this._onMouseDown(e),this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grabbing`)))}function Sf(e){this.enabled!==!1&&(e.pointerType===`touch`?this._onTouchMove(e):this._onMouseMove(e))}function Cf(e){switch(this._removePointer(e),this._pointers.length){case 0:this.domElement.releasePointerCapture(e.pointerId),this.domElement.ownerDocument.removeEventListener(`pointermove`,this._onPointerMove),this.domElement.ownerDocument.removeEventListener(`pointerup`,this._onPointerUp),this.dispatchEvent(ff),this.state=vf.NONE,this._cursorStyle===`grab`&&(this.domElement.style.cursor=`grab`);break;case 1:let t=this._pointers[0],n=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:n.x,pageY:n.y})}}function wf(t){let n;switch(t.button){case 0:n=this.mouseButtons.LEFT;break;case 1:n=this.mouseButtons.MIDDLE;break;case 2:n=this.mouseButtons.RIGHT;break;default:n=-1}switch(n){case e.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=vf.DOLLY;break;case e.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=vf.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=vf.ROTATE}break;case e.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=vf.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=vf.PAN}break;default:this.state=vf.NONE}this.state!==vf.NONE&&this.dispatchEvent(df)}function Tf(e){switch(this.state){case vf.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(e);break;case vf.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(e);break;case vf.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(e)}}function Ef(e){this.enabled!==!1&&this.enableZoom!==!1&&this.state===vf.NONE&&(e.preventDefault(),this.dispatchEvent(df),this._handleMouseWheel(this._customWheelEvent(e)),this.dispatchEvent(ff))}function Df(e){this.enabled!==!1&&this._handleKeyDown(e)}function Of(e){switch(this._trackPointer(e),this._pointers.length){case 1:switch(this.touches.ONE){case t.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(e),this.state=vf.TOUCH_ROTATE;break;case t.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(e),this.state=vf.TOUCH_PAN;break;default:this.state=vf.NONE}break;case 2:switch(this.touches.TWO){case t.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(e),this.state=vf.TOUCH_DOLLY_PAN;break;case t.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(e),this.state=vf.TOUCH_DOLLY_ROTATE;break;default:this.state=vf.NONE}break;default:this.state=vf.NONE}this.state!==vf.NONE&&this.dispatchEvent(df)}function kf(e){switch(this._trackPointer(e),this.state){case vf.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(e),this.update();break;case vf.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(e),this.update();break;case vf.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(e),this.update();break;case vf.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(e),this.update();break;default:this.state=vf.NONE}}function Af(e){this.enabled!==!1&&e.preventDefault()}function jf(e){e.key===`Control`&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}function Mf(e){e.key===`Control`&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener(`keyup`,this._interceptControlUp,{passive:!0,capture:!0}))}var Nf=class extends In{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new Na;e.deleteAttribute(`uv`);let t=new bs({side:1}),n=new bs,r=new uc(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new Y(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new ji(e,n,6),o=new Dn;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new Y(e,Pf(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let c=new Y(e,Pf(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let l=new Y(e,Pf(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let u=new Y(e,Pf(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new Y(e,Pf(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new Y(e,Pf(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Pf(e){return new Cs({color:0,emissive:16777215,emissiveIntensity:e})}var Ff=new G;function If(e,t,n,r,i,a){let o=2*Math.PI*i/4,s=Math.max(a-2*i,0),c=Math.PI/4;Ff.copy(t),Ff[r]=0,Ff.normalize();let l=.5*o/(o+s),u=1-Ff.angleTo(e)/c;return Math.sign(Ff[n])===1?u*l:s/(o+s)+l+l*(1-u)}var Lf=class e extends Na{constructor(e=1,t=1,n=1,r=2,i=.1){let a=r*2+1;if(i=Math.min(e/2,t/2,n/2,i),super(1,1,1,a,a,a),this.type=`RoundedBoxGeometry`,this.parameters={width:e,height:t,depth:n,segments:r,radius:i},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let s=new G,c=new G,l=new G(e,t,n).divideScalar(2).subScalar(i),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,m=new G,h=.5/a;for(let r=0,a=0;r<u.length;r+=3,a+=2)switch(s.fromArray(u,r),c.copy(s),c.x-=Math.sign(c.x)*h,c.y-=Math.sign(c.y)*h,c.z-=Math.sign(c.z)*h,c.normalize(),u[r+0]=l.x*Math.sign(s.x)+c.x*i,u[r+1]=l.y*Math.sign(s.y)+c.y*i,u[r+2]=l.z*Math.sign(s.z)+c.z*i,d[r+0]=c.x,d[r+1]=c.y,d[r+2]=c.z,Math.floor(r/p)){case 0:m.set(1,0,0),f[a+0]=If(m,c,`z`,`y`,i,n),f[a+1]=1-If(m,c,`y`,`z`,i,t);break;case 1:m.set(-1,0,0),f[a+0]=1-If(m,c,`z`,`y`,i,n),f[a+1]=1-If(m,c,`y`,`z`,i,t);break;case 2:m.set(0,1,0),f[a+0]=1-If(m,c,`x`,`z`,i,e),f[a+1]=If(m,c,`z`,`x`,i,n);break;case 3:m.set(0,-1,0),f[a+0]=1-If(m,c,`x`,`z`,i,e),f[a+1]=1-If(m,c,`z`,`x`,i,n);break;case 4:m.set(0,0,1),f[a+0]=1-If(m,c,`x`,`y`,i,e),f[a+1]=1-If(m,c,`y`,`x`,i,t);break;case 5:m.set(0,0,-1),f[a+0]=If(m,c,`x`,`y`,i,e),f[a+1]=1-If(m,c,`y`,`x`,i,t)}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.segments,t.radius)}},Z={w:1.6,d:.9,h:.64};function Rf(e){return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function zf(e,t,n){let r=Math.imul(e,374761393)+Math.imul(t,668265263)+Math.imul(n,1442695041)|0;return r=Math.imul(r^r>>>13,1274126177),((r^r>>>16)>>>0)/4294967295}function Bf(e,t,n,r=0){let i=Math.floor(e),a=Math.floor(t),o=e-i,s=t-a,c=o*o*(3-2*o),l=s*s*(3-2*s),u=e=>(e%n+n)%n,d=zf(u(i),u(a),r),f=zf(u(i+1),u(a),r),p=zf(u(i),u(a+1),r),m=zf(u(i+1),u(a+1),r);return d+(f-d)*c+(p-d)*l+(d-f-p+m)*c*l}function Vf(e,t,n,r=4,i=0){let a=0,o=.5,s=1,c=0;for(let l=0;l<r;l++)a+=o*Bf(e*s,t*s,n*s,i+l*17),c+=o,o*=.5,s*=2;return a/c}function Hf(e,t,n,r=!0){let a=new Uint8Array(e*t*4),o=[0,0,0,255];for(let r=0;r<t;r++)for(let t=0;t<e;t++){o[3]=255,n(t,r,o);let i=(r*e+t)*4;a[i]=o[0],a[i+1]=o[1],a[i+2]=o[2],a[i+3]=o[3]}let s=new yi(a,e,t);return s.wrapS=s.wrapT=i,s.magFilter=u,s.minFilter=f,s.generateMipmaps=!0,s.anisotropy=8,r&&(s.colorSpace=Be),s.needsUpdate=!0,s}var Uf={cx:.64,cz:Z.d/2-.075,rx:.079,rz:.054},Wf=.095,Gf=.08825,Kf={x:.475,z:-.055,floor:.073,rx:.14,rz:.11,h:.075,mouth:{x:.46,z:.09,rx:.088,rz:.06,h:.075},den:{x:.46,z:-.06},approach:{x:.46,z:.13},view:{x:.46,y:.18,z:Z.d/2+.1}},qf={x:-.46,z:.04,y:.277};function Jf(e,t){return Math.hypot((e-Uf.cx)/Uf.rx,(t-Uf.cz)/Uf.rz)-1}function Yf(e,t){return Jf(e,t)<0?.085:.073+.014*Math.exp(-(((t+Z.d/2-.065)/.07)**2))*(.6+.4*Math.sin(e*11+2))+.0025*(Vf((e+2)*12,(t+2)*12,48,3,14)-.5)}function Xf(e,t){return Math.abs(e-Kf.x)<.18&&t<.15&&t>-.2}var Zf=1.25,Qf=65535,$f=2**-24,ep=Symbol(`SKIP_GENERATION`),tp={strategy:0,maxDepth:40,targetLeafSize:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null,[ep]:!1};function np(e,t,n){return n.min.x=t[e],n.min.y=t[e+1],n.min.z=t[e+2],n.max.x=t[e+3],n.max.y=t[e+4],n.max.z=t[e+5],n}function rp(e){let t=-1,n=-1/0;for(let r=0;r<3;r++){let i=e[r+3]-e[r];i>n&&(n=i,t=r)}return t}function ip(e,t){t.set(e)}function ap(e,t,n){let r,i;for(let a=0;a<3;a++){let o=a+3;r=e[a],i=t[a],n[a]=r<i?r:i,r=e[o],i=t[o],n[o]=r>i?r:i}}function op(e,t,n){for(let r=0;r<3;r++){let i=t[e+2*r],a=t[e+2*r+1],o=i-a,s=i+a;o<n[r]&&(n[r]=o),s>n[r+3]&&(n[r+3]=s)}}function sp(e){let t=e[3]-e[0],n=e[4]-e[1],r=e[5]-e[2];return 2*(t*n+n*r+r*t)}function cp(e,t){return t[e+15]===Qf}function lp(e,t){return t[e+6]}function up(e,t){return t[e+14]}function dp(e){return e+8}function fp(e,t){return e+t[e+6]*8}function pp(e,t){return t[e+7]}function mp(e){return e}function hp(e,t,n,r,i){let a=1/0,o=1/0,s=1/0,c=-1/0,l=-1/0,u=-1/0,d=1/0,f=1/0,p=1/0,m=-1/0,h=-1/0,g=-1/0,_=e.offset||0;for(let r=(t-_)*6,i=(t+n-_)*6;r<i;r+=6){let t=e[r+0],n=e[r+1],i=t-n,_=t+n;i<a&&(a=i),_>c&&(c=_),t<d&&(d=t),t>m&&(m=t);let v=e[r+2],y=e[r+3],b=v-y,x=v+y;b<o&&(o=b),x>l&&(l=x),v<f&&(f=v),v>h&&(h=v);let S=e[r+4],C=e[r+5],w=S-C,T=S+C;w<s&&(s=w),T>u&&(u=T),S<p&&(p=S),S>g&&(g=S)}r[0]=a,r[1]=o,r[2]=s,r[3]=c,r[4]=l,r[5]=u,i[0]=d,i[1]=f,i[2]=p,i[3]=m,i[4]=h,i[5]=g}var gp=32,_p=(e,t)=>e.candidate-t.candidate,vp=Array(gp).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),yp=new Float32Array(6);function bp(e,t,n,r,i,a){let o=-1,s=0;if(a===0)o=rp(t),o!==-1&&(s=(t[o]+t[o+3])/2);else if(a===1)o=rp(e),o!==-1&&(s=xp(n,r,i,o));else if(a===2){let a=sp(e),c=Zf*i,l=n.offset||0,u=(r-l)*6,d=(r+i-l)*6;for(let e=0;e<3;e++){let r=t[e],l=(t[e+3]-r)/gp;if(i<gp/4){let t=[...vp];t.length=i;let r=0;for(let i=u;i<d;i+=6,r++){let a=t[r];a.candidate=n[i+2*e],a.count=0;let{bounds:o,leftCacheBounds:s,rightCacheBounds:c}=a;for(let e=0;e<3;e++)c[e]=1/0,c[e+3]=-1/0,s[e]=1/0,s[e+3]=-1/0,o[e]=1/0,o[e+3]=-1/0;op(i,n,o)}t.sort(_p);let l=i;for(let e=0;e<l;e++){let n=t[e];for(;e+1<l&&t[e+1].candidate===n.candidate;)t.splice(e+1,1),l--}for(let r=u;r<d;r+=6){let i=n[r+2*e];for(let e=0;e<l;e++){let a=t[e];i>=a.candidate?op(r,n,a.rightCacheBounds):(op(r,n,a.leftCacheBounds),a.count++)}}for(let n=0;n<l;n++){let r=t[n],l=r.count,u=i-r.count,d=r.leftCacheBounds,f=r.rightCacheBounds,p=0;l!==0&&(p=sp(d)/a);let m=0;u!==0&&(m=sp(f)/a);let h=1+Zf*(p*l+m*u);h<c&&(o=e,c=h,s=r.candidate)}}else{for(let e=0;e<gp;e++){let t=vp[e];t.count=0,t.candidate=r+l+e*l;let n=t.bounds;for(let e=0;e<3;e++)n[e]=1/0,n[e+3]=-1/0}for(let t=u;t<d;t+=6){let i=~~((n[t+2*e]-r)/l);i>=gp&&(i=31);let a=vp[i];a.count++,op(t,n,a.bounds)}let t=vp[31];ip(t.bounds,t.rightCacheBounds);for(let e=30;e>=0;e--){let t=vp[e],n=vp[e+1];ap(t.bounds,n.rightCacheBounds,t.rightCacheBounds)}let f=0;for(let t=0;t<31;t++){let n=vp[t],r=n.count,l=n.bounds,u=vp[t+1].rightCacheBounds;r!==0&&(f===0?ip(l,yp):ap(l,yp,yp)),f+=r;let d=0,p=0;f!==0&&(d=sp(yp)/a);let m=i-f;m!==0&&(p=sp(u)/a);let h=1+Zf*(d*f+p*m);h<c&&(o=e,c=h,s=n.candidate)}}}}else console.warn(`BVH: Invalid build strategy value ${a} used.`);return{axis:o,pos:s}}function xp(e,t,n,r){let i=0,a=e.offset;for(let o=t,s=t+n;o<s;o++)i+=e[(o-a)*6+r*2];return i/n}var Sp=class{constructor(){this.boundingData=new Float32Array(6)}};function Cp(e,t,n,r,i,a){let o=r,s=r+i-1,c=a.pos,l=a.axis*2,u=n.offset||0;for(;;){for(;o<=s&&n[(o-u)*6+l]<c;)o++;for(;o<=s&&n[(s-u)*6+l]>=c;)s--;if(o<s){for(let n=0;n<t;n++){let r=e[o*t+n];e[o*t+n]=e[s*t+n],e[s*t+n]=r}for(let e=0;e<6;e++){let t=o-u,r=s-u,i=n[t*6+e];n[t*6+e]=n[r*6+e],n[r*6+e]=i}o++,s--}else return o}}var wp,Tp,Ep,Dp,Op=2**32;function kp(e){return`count`in e?1:1+kp(e.left)+kp(e.right)}function Ap(e,t,n){return wp=new Float32Array(n),Tp=new Uint32Array(n),Ep=new Uint16Array(n),Dp=new Uint8Array(n),jp(e,t)}function jp(e,t){let n=e/4,r=e/2,i=`count`in t,a=t.boundingData;for(let e=0;e<6;e++)wp[n+e]=a[e];if(i)return t.buffer?(Dp.set(new Uint8Array(t.buffer),e),e+t.buffer.byteLength):(Tp[n+6]=t.offset,Ep[r+14]=t.count,Ep[r+15]=Qf,e+32);{let{left:r,right:i,splitAxis:a}=t,o=jp(e+32,r),s=e/32,c=o/32-s;if(c>Op)throw Error(`MeshBVH: Cannot store relative child node offset greater than 32 bits.`);return Tp[n+6]=c,Tp[n+7]=a,jp(o,i)}}function Mp(e,t,n,r,i,a){let{maxDepth:o,verbose:s,targetLeafSize:c,_strictLeafSize:l=1/0,strategy:u,onProgress:d}=i,f=e.primitiveBuffer,p=e.primitiveBufferStride,m=new Float32Array(6),h=!1,g=new Sp;return hp(t,n,r,g.boundingData,m),v(g,n,r,m),g;function _(e){d&&d((e-a.offset)/a.count)}function v(e,n,r,i=null,a=0){!h&&a>=o&&(h=!0,s&&console.warn(`BVH: Max depth of ${o} reached when generating BVH. Consider increasing maxDepth.`));let d=r>l;if(r<=c&&!d||a>=o)return _(n+r),e.offset=n,e.count=r,e;let g=bp(e.boundingData,i,t,n,r,u),y=g.axis===-1?-1:Cp(f,p,t,n,r,g);if(g.axis===-1||y===n||y===n+r){if(!d)return _(n+r),e.offset=n,e.count=r,e;g.axis=Math.max(0,rp(e.boundingData)),y=n+Math.max(1,Math.floor(r/2))}e.splitAxis=g.axis;let b=new Sp,x=n,S=y-n;e.left=b,hp(t,x,S,b.boundingData,m),v(b,x,S,m,a+1);let C=new Sp,w=y,T=r-S;return e.right=C,hp(t,w,T,C.boundingData,m),v(C,w,T,m,a+1),e}}function Np(e,t){let n=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,r=e.getRootRanges(t.range),i=r[0],a=r[r.length-1],o={offset:i.offset,count:a.offset+a.count-i.offset},s=new Float32Array(6*o.count);s.offset=o.offset,e.computePrimitiveBounds(o.offset,o.count,s),e._roots=r.map(r=>{let i=Mp(e,s,r.offset,r.count,t,o),a=kp(i),c=new n(32*a);return Ap(0,i,c),c})}var Pp=class{constructor(e){this._getNewPrimitive=e,this._primitives=[]}getPrimitive(){let e=this._primitives;return e.length===0?this._getNewPrimitive():e.pop()}releasePrimitive(e){this._primitives.push(e)}},Fp=new class{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;let e=[],t=null;this.setBuffer=n=>{t&&e.push(t),t=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{t=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,e.length!==0&&this.setBuffer(e.pop())}}},Ip,Lp,Rp=[],zp=new Pp(()=>new Zn);function Bp(e,t,n,r,i,a){Ip=zp.getPrimitive(),Lp=zp.getPrimitive(),Rp.push(Ip,Lp),Fp.setBuffer(e._roots[t]);let o=Vp(0,e.geometry,n,r,i,a);Fp.clearBuffer(),zp.releasePrimitive(Ip),zp.releasePrimitive(Lp),Rp.pop(),Rp.pop();let s=Rp.length;return s>0&&(Lp=Rp[s-1],Ip=Rp[s-2]),o}function Vp(e,t,n,r,i=null,a=0,o=0){let{float32Array:s,uint16Array:c,uint32Array:l}=Fp,u=e*2;if(cp(u,c)){let t=lp(e,l),n=up(u,c);return np(mp(e),s,Ip),r(t,n,!1,o,a+e/8,Ip)}{let u=dp(e),d=fp(e,l),f=u,p=d,m,h,g,_;if(i&&(g=Ip,_=Lp,np(mp(f),s,g),np(mp(p),s,_),m=i(g),h=i(_),h<m)){f=d,p=u;let e=m;m=h,h=e,g=_}g||(g=Ip,np(mp(f),s,g));let v=cp(f*2,c),y=n(g,v,m,o+1,a+f/8),b;if(y===2){let e=w(f);b=r(e,T(f)-e,!0,o+1,a+f/8,g)}else b=y&&Vp(f,t,n,r,i,a,o+1);if(b)return!0;_=Lp,np(mp(p),s,_);let x=cp(p*2,c),S=n(_,x,h,o+1,a+p/8),C;if(S===2){let e=w(p);C=r(e,T(p)-e,!0,o+1,a+p/8,_)}else C=S&&Vp(p,t,n,r,i,a,o+1);return!!C;function w(e){let{uint16Array:t,uint32Array:n}=Fp,r=e*2;for(;!cp(r,t);)e=dp(e),r=e*2;return lp(e,n)}function T(e){let{uint16Array:t,uint32Array:n}=Fp,r=e*2;for(;!cp(r,t);)e=fp(e,n),r=e*2;return lp(e,n)+up(r,t)}}}var Hp=new Fp.constructor,Up=new Fp.constructor,Wp=new Pp(()=>new Zn),Gp=new Zn,Kp=new Zn,qp=new Zn,Jp=new Zn,Yp=!1;function Xp(e,t,n,r){if(Yp)throw Error(`MeshBVH: Recursive calls to bvhcast not supported.`);Yp=!0;let i=e._roots,a=t._roots,o,s=0,c=0,l=new K().copy(n).invert();for(let e=0,t=i.length;e<t;e++){Hp.setBuffer(i[e]),c=0;let t=Wp.getPrimitive();np(mp(0),Hp.float32Array,t),t.applyMatrix4(l);for(let e=0,i=a.length;e<i&&(Up.setBuffer(a[e]),o=Zp(0,0,n,l,r,s,c,0,0,t),Up.clearBuffer(),c+=a[e].byteLength/32,!o);e++);if(Wp.releasePrimitive(t),Hp.clearBuffer(),s+=i[e].byteLength/32,o)break}return Yp=!1,o}function Zp(e,t,n,r,i,a=0,o=0,s=0,c=0,l=null,u=!1){let d,f;u?(d=Up,f=Hp):(d=Hp,f=Up);let p=d.float32Array,m=d.uint32Array,h=d.uint16Array,g=f.float32Array,_=f.uint32Array,v=f.uint16Array,y=e*2,b=t*2,x=cp(y,h),S=cp(b,v),C=!1;if(S&&x)C=u?i(lp(t,_),up(t*2,v),lp(e,m),up(e*2,h),c,o+t/8,s,a+e/8):i(lp(e,m),up(e*2,h),lp(t,_),up(t*2,v),s,a+e/8,c,o+t/8);else if(S){let l=Wp.getPrimitive();np(mp(t),g,l),l.applyMatrix4(n);let d=dp(e),f=fp(e,m);np(mp(d),p,Gp),np(mp(f),p,Kp);let h=l.intersectsBox(Gp),_=l.intersectsBox(Kp);C=h&&Zp(t,d,r,n,i,o,a,c,s+1,l,!u)||_&&Zp(t,f,r,n,i,o,a,c,s+1,l,!u),Wp.releasePrimitive(l)}else{let d=dp(t),f=fp(t,_);np(mp(d),g,qp),np(mp(f),g,Jp);let h=l.intersectsBox(qp),v=l.intersectsBox(Jp);if(h&&v)C=Zp(e,d,n,r,i,a,o,s,c+1,l,u)||Zp(e,f,n,r,i,a,o,s,c+1,l,u);else if(h){if(x)C=Zp(e,d,n,r,i,a,o,s,c+1,l,u);else{let t=Wp.getPrimitive();t.copy(qp).applyMatrix4(n);let l=dp(e),f=fp(e,m);np(mp(l),p,Gp),np(mp(f),p,Kp);let h=t.intersectsBox(Gp),g=t.intersectsBox(Kp);C=h&&Zp(d,l,r,n,i,o,a,c,s+1,t,!u)||g&&Zp(d,f,r,n,i,o,a,c,s+1,t,!u),Wp.releasePrimitive(t)}}else if(v){if(x)C=Zp(e,f,n,r,i,a,o,s,c+1,l,u);else{let t=Wp.getPrimitive();t.copy(Jp).applyMatrix4(n);let l=dp(e),d=fp(e,m);np(mp(l),p,Gp),np(mp(d),p,Kp);let h=t.intersectsBox(Gp),g=t.intersectsBox(Kp);C=h&&Zp(f,l,r,n,i,o,a,c,s+1,t,!u)||g&&Zp(f,d,r,n,i,o,a,c,s+1,t,!u),Wp.releasePrimitive(t)}}}return C}var Qp=new class{constructor(){let e=null,t=null,n=null,r=!1;this.root=null,this.buffer=null,this.uint32Array=null,this.uint16Array=null,this.setBVH=(i,a)=>{if(r)throw Error(`BVHTraversalHelper: cannot call setBVH during an active traversal.`);this.root=a,this.buffer=e=i._roots[a],this.uint16Array=n=new Uint16Array(e),this.uint32Array=t=new Uint32Array(e)},this.reset=()=>{this.root=null,this.buffer=e=null,this.uint16Array=n=null,this.uint32Array=t=null},this.getRangeStart=e=>{let r=e*2;for(;!cp(r,n);)e=dp(e),r=e*2;return lp(e,t)},this.getRangeEnd=e=>{let r=e*2;for(;!cp(r,n);)e=fp(e,t),r=e*2;return lp(e,t)+up(r,n)};let i=(e,r,a)=>{let o=cp(r*2,n);if(!e(a,o,r)&&!o){let n=dp(r),o=fp(r,t);i(e,n,a+1),i(e,o,a+1)}};this.traverseBuffer=e=>{if(r)throw Error(`BVHTraversalHelper: cannot start a traversal during an active traversal.`);r=!0;try{i(e,0,0)}finally{r=!1}},this.traverse=r=>{this.traverseBuffer((i,a,o)=>{if(a){let s=o*2,c=t[o+6],l=n[s+14];return r(i,a,new Float32Array(e,o*4,6),c,l)}{let n=pp(o,t);return r(i,a,new Float32Array(e,o*4,6),n)}})}}},$p=new Zn,em=new Float32Array(6),tm=class{constructor(){this._roots=null,this.primitiveBuffer=null,this.primitiveBufferStride=null}init(e){e={...tp,...e},`maxLeafSize`in e&&(console.warn(`BVH: "maxLeafSize" option has been deprecated. Use "targetLeafSize", instead.`),e={...e,targetLeafSize:e.maxLeafSize}),Np(this,e)}getRootRanges(){throw Error(`BVH: getRootRanges() not implemented`)}writePrimitiveBounds(){throw Error(`BVH: writePrimitiveBounds() not implemented`)}writePrimitiveRangeBounds(e,t,n,r){let i=1/0,a=1/0,o=1/0,s=-1/0,c=-1/0,l=-1/0;for(let n=e,r=e+t;n<r;n++){this.writePrimitiveBounds(n,em,0);let[e,t,r,u,d,f]=em;e<i&&(i=e),u>s&&(s=u),t<a&&(a=t),d>c&&(c=d),r<o&&(o=r),f>l&&(l=f)}return n[r+0]=i,n[r+1]=a,n[r+2]=o,n[r+3]=s,n[r+4]=c,n[r+5]=l,n}computePrimitiveBounds(e,t,n){let r=n.offset||0;for(let i=e,a=e+t;i<a;i++){this.writePrimitiveBounds(i,em,0);let[e,t,a,o,s,c]=em,l=(e+o)/2,u=(t+s)/2,d=(a+c)/2,f=(o-e)/2,p=(s-t)/2,m=(c-a)/2,h=(i-r)*6;n[h+0]=l,n[h+1]=f+(Math.abs(l)+f)*$f,n[h+2]=u,n[h+3]=p+(Math.abs(u)+p)*$f,n[h+4]=d,n[h+5]=m+(Math.abs(d)+m)*$f}return n}shiftPrimitiveOffsets(e){let t=this._indirectBuffer;if(t)for(let n=0,r=t.length;n<r;n++)t[n]+=e;else{let t=this._roots;for(let n=0;n<t.length;n++){let r=t[n],i=new Uint32Array(r),a=new Uint16Array(r),o=r.byteLength/32;for(let t=0;t<o;t++){let n=8*t;cp(2*n,a)&&(i[n+6]+=e)}}}}traverse(e,t=0){Qp.setBVH(this,t),Qp.traverse(e),Qp.reset()}refit(){let e=this._roots;for(let t=0,n=e.length;t<n;t++){let n=e[t],r=new Uint32Array(n),i=new Uint16Array(n),a=new Float32Array(n),o=n.byteLength/32;for(let e=o-1;e>=0;e--){let t=e*8,n=t*2;if(cp(n,i)){let e=lp(t,r),o=up(n,i);this.writePrimitiveRangeBounds(e,o,em,0),a.set(em,t)}else{let e=dp(t),n=fp(t,r);for(let r=0;r<3;r++){let i=a[e+r],o=a[e+r+3],s=a[n+r],c=a[n+r+3];a[t+r]=i<s?i:s,a[t+r+3]=o>c?o:c}}}}}getBoundingBox(e){return e.makeEmpty(),this._roots.forEach(t=>{np(0,new Float32Array(t),$p),e.union($p)}),e}shapecast(e){let{boundsTraverseOrder:t,intersectsBounds:n,intersectsRange:r,intersectsPrimitive:i,scratchPrimitive:a,iterate:o}=e;if(r&&i){let e=r;r=(t,n,r,s,c)=>e(t,n,r,s,c)?!0:o(t,n,this,i,r,s,a)}else r||=i?(e,t,n,r)=>o(e,t,this,i,n,r,a):(e,t,n)=>n;let s=!1,c=0,l=this._roots;for(let e=0,i=l.length;e<i;e++){let i=l[e];if(s=Bp(this,e,n,r,t,c),s)break;c+=i.byteLength/32}return s}bvhcast(e,t,n){let{intersectsRanges:r}=n;return Xp(this,e,t,r)}};function nm(){return typeof SharedArrayBuffer<`u`}function rm(e){return e.index?e.index.count:e.attributes.position.count}function im(e){return rm(e)/3}function am(e,t=ArrayBuffer){return e>65535?new Uint32Array(new t(4*e)):new Uint16Array(new t(2*e))}function om(e,t){if(!e.index){let n=e.attributes.position.count,r=am(n,t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer);e.setIndex(new br(r,1));for(let e=0;e<n;e++)r[e]=e}}function sm(e,t,n){let r=rm(e)/n,i=t||e.drawRange,a=i.start/n,o=(i.start+i.count)/n,s=Math.max(0,a),c=Math.min(r,o)-s;return{offset:Math.floor(s),count:Math.floor(c)}}function cm(e,t){return e.groups.map(e=>({offset:e.start/t,count:e.count/t}))}function lm(e,t,n){let r=sm(e,t,n),i=cm(e,n);if(!i.length)return[r];let a=[],o=r.offset,s=r.offset+r.count,c=rm(e)/n,l=[];for(let e of i){let{offset:t,count:n}=e,r=t,i=t+(isFinite(n)?n:c-t);r<s&&i>o&&(l.push({pos:Math.max(o,r),isStart:!0}),l.push({pos:Math.min(s,i),isStart:!1}))}l.sort((e,t)=>e.pos===t.pos?e.type===`end`?-1:1:e.pos-t.pos);let u=0,d=null;for(let e of l){let t=e.pos;u!==0&&t!==d&&a.push({offset:d,count:t-d}),u+=e.isStart?1:-1,d=t}return a}function um(e,t){let n=e[e.length-1],r=n.offset+n.count>2**16,i=e.reduce((e,t)=>e+t.count,0),a=r?4:2,o=t?new SharedArrayBuffer(i*a):new ArrayBuffer(i*a),s=r?new Uint32Array(o):new Uint16Array(o),c=0;for(let t=0;t<e.length;t++){let{offset:n,count:r}=e[t];for(let e=0;e<r;e++)s[c+e]=n+e;c+=r}return s}var dm=class extends tm{get indirect(){return!!this._indirectBuffer}get primitiveStride(){return null}get primitiveBufferStride(){return this.indirect?1:this.primitiveStride}set primitiveBufferStride(e){}get primitiveBuffer(){return this.indirect?this._indirectBuffer:this.geometry.index.array}set primitiveBuffer(e){}constructor(e,t={}){if(!e.isBufferGeometry)throw Error(`BVH: Only BufferGeometries are supported.`);if(e.index&&e.index.isInterleavedBufferAttribute)throw Error(`BVH: InterleavedBufferAttribute is not supported for the index attribute.`);if(t.useSharedArrayBuffer&&!nm())throw Error(`BVH: SharedArrayBuffer is not available.`);super(),this.geometry=e,this.resolvePrimitiveIndex=t.indirect?e=>this._indirectBuffer[e]:e=>e,this.primitiveBuffer=null,this.primitiveBufferStride=null,this._indirectBuffer=null,t={...tp,...t},t[ep]||this.init(t)}init(e){let{geometry:t,primitiveStride:n}=this;if(e.indirect){let r=um(lm(t,e.range,n),e.useSharedArrayBuffer);this._indirectBuffer=r}else om(t,e);super.init(e),!t.boundingBox&&e.setBoundingBox&&(t.boundingBox=this.getBoundingBox(new Zn))}getRootRanges(e){return this.indirect?[{offset:0,count:this._indirectBuffer.length}]:lm(this.geometry,e,this.primitiveStride)}raycastObject3D(){throw Error(`BVH: raycastObject3D() not implemented`)}},fm=class{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(e,t){let n=1/0,r=-1/0;for(let i=0,a=e.length;i<a;i++){let a=e[i][t];n=a<n?a:n,r=a>r?a:r}this.min=n,this.max=r}setFromPoints(e,t){let n=1/0,r=-1/0;for(let i=0,a=t.length;i<a;i++){let a=t[i],o=e.dot(a);n=o<n?o:n,r=o>r?o:r}this.min=n,this.max=r}isSeparated(e){return this.min>e.max||e.min>this.max}};fm.prototype.setFromBox=(function(){let e=new G;return function(t,n){let r=n.min,i=n.max,a=1/0,o=-1/0;for(let n=0;n<=1;n++)for(let s=0;s<=1;s++)for(let c=0;c<=1;c++){e.x=r.x*n+i.x*(1-n),e.y=r.y*s+i.y*(1-s),e.z=r.z*c+i.z*(1-c);let l=t.dot(e);a=Math.min(l,a),o=Math.max(l,o)}this.min=a,this.max=o}})();var pm=(function(){let e=new G,t=new G,n=new G;return function(r,i,a){let o=r.start,s=e,c=i.start,l=t;n.subVectors(o,c),e.subVectors(r.end,r.start),t.subVectors(i.end,i.start);let u=n.dot(l),d=l.dot(s),f=l.dot(l),p=n.dot(s),m=s.dot(s)*f-d*d,h,g;h=m===0?0:(u*d-p*f)/m,g=(u+h*d)/f,a.x=h,a.y=g}})(),mm=(function(){let e=new W,t=new G,n=new G;return function(r,i,a,o){pm(r,i,e);let s=e.x,c=e.y;if(s>=0&&s<=1&&c>=0&&c<=1)r.at(s,a),i.at(c,o);else if(s>=0&&s<=1)c<0?i.at(0,o):i.at(1,o),r.closestPointToPoint(o,!0,a);else if(c>=0&&c<=1)s<0?r.at(0,a):r.at(1,a),i.closestPointToPoint(a,!0,o);else{let e;e=s<0?r.start:r.end;let l;l=c<0?i.start:i.end;let u=t,d=n;if(r.closestPointToPoint(l,!0,t),i.closestPointToPoint(e,!0,n),u.distanceToSquared(l)<=d.distanceToSquared(e)){a.copy(u),o.copy(l);return}a.copy(e),o.copy(d);return}}})(),hm=(function(){let e=new G,t=new G,n=new Fi,r=new Hc;return function(i,a){let{radius:o,center:s}=i,{a:c,b:l,c:u}=a;if(r.start=c,r.end=l,r.closestPointToPoint(s,!0,e).distanceTo(s)<=o||(r.start=c,r.end=u,r.closestPointToPoint(s,!0,e).distanceTo(s)<=o)||(r.start=l,r.end=u,r.closestPointToPoint(s,!0,e).distanceTo(s)<=o))return!0;let d=a.getPlane(n);if(Math.abs(d.distanceToPoint(s))<=o){let e=d.projectPoint(s,t);if(a.containsPoint(e))return!0}return!1}})(),gm=[`x`,`y`,`z`],_m=1e-15,vm=_m*_m;function ym(e){return Math.abs(e)<_m}var bm=class extends Xn{constructor(...e){super(...e),this.isExtendedTriangle=!0,this.satAxes=[,,,,].fill().map(()=>new G),this.satBounds=[,,,,].fill().map(()=>new fm),this.points=[this.a,this.b,this.c],this.plane=new Fi,this.isDegenerateIntoSegment=!1,this.isDegenerateIntoPoint=!1,this.degenerateSegment=new Hc,this.needsUpdate=!0}intersectsSphere(e){return hm(e,this)}update(){let e=this.a,t=this.b,n=this.c,r=this.points,i=this.satAxes,a=this.satBounds,o=i[0],s=a[0];this.getNormal(o),s.setFromPoints(o,r);let c=i[1],l=a[1];c.subVectors(e,t),l.setFromPoints(c,r);let u=i[2],d=a[2];u.subVectors(t,n),d.setFromPoints(u,r);let f=i[3],p=a[3];f.subVectors(n,e),p.setFromPoints(f,r);let m=c.length(),h=u.length(),g=f.length();this.isDegenerateIntoPoint=!1,this.isDegenerateIntoSegment=!1,m<_m?h<_m||g<_m?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(e),this.degenerateSegment.end.copy(n)):h<_m?g<_m?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(t),this.degenerateSegment.end.copy(e)):g<_m&&(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(n),this.degenerateSegment.end.copy(t)),this.plane.setFromNormalAndCoplanarPoint(o,e),this.needsUpdate=!1}};bm.prototype.closestPointToSegment=(function(){let e=new G,t=new G,n=new Hc;return function(r,i=null,a=null){let{start:o,end:s}=r,c=this.points,l,u=1/0;for(let o=0;o<3;o++){let s=(o+1)%3;n.start.copy(c[o]),n.end.copy(c[s]),mm(n,r,e,t),l=e.distanceToSquared(t),l<u&&(u=l,i&&i.copy(e),a&&a.copy(t))}return this.closestPointToPoint(o,e),l=o.distanceToSquared(e),l<u&&(u=l,i&&i.copy(e),a&&a.copy(o)),this.closestPointToPoint(s,e),l=s.distanceToSquared(e),l<u&&(u=l,i&&i.copy(e),a&&a.copy(s)),Math.sqrt(u)}})(),bm.prototype.intersectsTriangle=(function(){let e=new bm,t=new fm,n=new fm,r=new G,i=new G,a=new G,o=new G,s=new Hc,c=new Hc,l=new G,u=new W,d=new W;function f(e,i,a,s){let c=r;!e.isDegenerateIntoPoint&&!e.isDegenerateIntoSegment?c.copy(e.plane.normal):c.copy(i.plane.normal);let l=e.satBounds,u=e.satAxes;for(let r=1;r<4;r++){let a=l[r],s=u[r];if(t.setFromPoints(s,i.points),a.isSeparated(t)||(o.copy(c).cross(s),t.setFromPoints(o,e.points),n.setFromPoints(o,i.points),t.isSeparated(n)))return!1}let d=i.satBounds,f=i.satAxes;for(let r=1;r<4;r++){let a=d[r],s=f[r];if(t.setFromPoints(s,e.points),a.isSeparated(t)||(o.crossVectors(c,s),t.setFromPoints(o,e.points),n.setFromPoints(o,i.points),t.isSeparated(n)))return!1}return a&&(s||console.warn(`ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0.`),a.start.set(0,0,0),a.end.set(0,0,0)),!0}function p(e,t,n,r,i,a,o,s,c,l,u){let d=o/(o-s);l.x=r+(i-r)*d,u.start.subVectors(t,e).multiplyScalar(d).add(e),d=o/(o-c),l.y=r+(a-r)*d,u.end.subVectors(n,e).multiplyScalar(d).add(e)}function m(e,t,n,r,i,a,o,s,c,l,u){if(i>0)p(e.c,e.a,e.b,r,t,n,c,o,s,l,u);else if(a>0)p(e.b,e.a,e.c,n,t,r,s,o,c,l,u);else if(s*c>0||o!=0)p(e.a,e.b,e.c,t,n,r,o,s,c,l,u);else if(s!=0)p(e.b,e.a,e.c,n,t,r,s,o,c,l,u);else if(c!=0)p(e.c,e.a,e.b,r,t,n,c,o,s,l,u);else return!0;return!1}function h(e,t,n,i){let a=t.degenerateSegment,o=e.plane.distanceToPoint(a.start),s=e.plane.distanceToPoint(a.end);return ym(o)?ym(s)?f(e,t,n,i):(n&&(n.start.copy(a.start),n.end.copy(a.start)),e.containsPoint(a.start)):ym(s)?(n&&(n.start.copy(a.end),n.end.copy(a.end)),e.containsPoint(a.end)):e.plane.intersectLine(a,r)!=null&&(n&&(n.start.copy(r),n.end.copy(r)),e.containsPoint(r))}function g(e,t,n){let r=t.a;return ym(e.plane.distanceToPoint(r))&&e.containsPoint(r)?(n&&(n.start.copy(r),n.end.copy(r)),!0):!1}function _(e,t,n){let i=e.degenerateSegment,a=t.a;return i.closestPointToPoint(a,!0,r),a.distanceToSquared(r)<vm&&(n&&(n.start.copy(a),n.end.copy(a)),!0)}function v(e,t,n,o){if(e.isDegenerateIntoSegment){if(t.isDegenerateIntoSegment){let o=e.degenerateSegment,s=t.degenerateSegment,c=i,l=a;o.delta(c),s.delta(l);let u=r.subVectors(s.start,o.start),d=c.x*l.y-c.y*l.x;if(ym(d))return!1;let f=(u.x*l.y-u.y*l.x)/d,p=-(c.x*u.y-c.y*u.x)/d;return f<0||f>1||p<0||p>1?!1:ym(o.start.z+c.z*f-(s.start.z+l.z*p))?(n&&(n.start.copy(o.start).addScaledVector(c,f),n.end.copy(o.start).addScaledVector(c,f)),!0):!1}return t.isDegenerateIntoPoint?_(e,t,n):h(t,e,n,o)}if(e.isDegenerateIntoPoint)return t.isDegenerateIntoPoint?t.a.distanceToSquared(e.a)<vm&&(n&&(n.start.copy(e.a),n.end.copy(e.a)),!0):t.isDegenerateIntoSegment?_(t,e,n):g(t,e,n);if(t.isDegenerateIntoPoint)return g(e,t,n);if(t.isDegenerateIntoSegment)return h(e,t,n,o)}return function(t,n=null,r=!1){this.needsUpdate&&this.update(),t.isExtendedTriangle?t.needsUpdate&&t.update():(e.copy(t),e.update(),t=e);let o=v(this,t,n,r);if(o!==void 0)return o;let p=this.plane,h=t.plane,g=h.distanceToPoint(this.a),_=h.distanceToPoint(this.b),y=h.distanceToPoint(this.c);ym(g)&&(g=0),ym(_)&&(_=0),ym(y)&&(y=0);let b=g*_,x=g*y;if(b>0&&x>0)return!1;let S=p.distanceToPoint(t.a),C=p.distanceToPoint(t.b),w=p.distanceToPoint(t.c);ym(S)&&(S=0),ym(C)&&(C=0),ym(w)&&(w=0);let T=S*C,E=S*w;if(T>0&&E>0)return!1;i.copy(p.normal),a.copy(h.normal);let D=i.cross(a),O=0,k=Math.abs(D.x),A=Math.abs(D.y);A>k&&(k=A,O=1),Math.abs(D.z)>k&&(O=2);let j=gm[O],ee=this.a[j],M=this.b[j],N=this.c[j],te=t.a[j],P=t.b[j],ne=t.c[j];if(m(this,ee,M,N,b,x,g,_,y,u,s)||m(t,te,P,ne,T,E,S,C,w,d,c))return f(this,t,n,r);if(u.y<u.x){let e=u.y;u.y=u.x,u.x=e,l.copy(s.start),s.start.copy(s.end),s.end.copy(l)}if(d.y<d.x){let e=d.y;d.y=d.x,d.x=e,l.copy(c.start),c.start.copy(c.end),c.end.copy(l)}return u.y<d.x||d.y<u.x?!1:(n&&(d.x>u.x?n.start.copy(c.start):n.start.copy(s.start),d.y<u.y?n.end.copy(c.end):n.end.copy(s.end)),!0)}})(),bm.prototype.distanceToPoint=(function(){let e=new G;return function(t){return this.closestPointToPoint(t,e),t.distanceTo(e)}})(),bm.prototype.distanceToTriangle=(function(){let e=new G,t=new G,n=[`a`,`b`,`c`],r=new Hc,i=new Hc;return function(a,o=null,s=null){let c=o||s?r:null;if(this.intersectsTriangle(a,c,!0))return(o||s)&&(o&&c.getCenter(o),s&&c.getCenter(s)),0;let l=1/0;for(let t=0;t<3;t++){let r,i=n[t],c=a[i];this.closestPointToPoint(c,e),r=c.distanceToSquared(e),r<l&&(l=r,o&&o.copy(e),s&&s.copy(c));let u=this[i];a.closestPointToPoint(u,e),r=u.distanceToSquared(e),r<l&&(l=r,o&&o.copy(u),s&&s.copy(e))}for(let c=0;c<3;c++){let u=n[c],d=n[(c+1)%3];r.set(this[u],this[d]);for(let c=0;c<3;c++){let u=n[c],d=n[(c+1)%3];i.set(a[u],a[d]),mm(r,i,e,t);let f=e.distanceToSquared(t);f<l&&(l=f,o&&o.copy(e),s&&s.copy(t))}}return Math.sqrt(l)}})();var xm=class{constructor(e,t,n){this.isOrientedBox=!0,this.min=new G,this.max=new G,this.matrix=new K,this.invMatrix=new K,this.points=Array(8).fill().map(()=>new G),this.satAxes=[,,,].fill().map(()=>new G),this.satBounds=[,,,].fill().map(()=>new fm),this.alignedSatBounds=[,,,].fill().map(()=>new fm),this.needsUpdate=!1,e&&this.min.copy(e),t&&this.max.copy(t),n&&this.matrix.copy(n)}set(e,t,n){this.min.copy(e),this.max.copy(t),this.matrix.copy(n),this.needsUpdate=!0}copy(e){this.min.copy(e.min),this.max.copy(e.max),this.matrix.copy(e.matrix),this.needsUpdate=!0}};xm.prototype.update=(function(){return function(){let e=this.matrix,t=this.min,n=this.max,r=this.points;for(let i=0;i<=1;i++)for(let a=0;a<=1;a++)for(let o=0;o<=1;o++){let s=r[1*i|2*a|4*o];s.x=i?n.x:t.x,s.y=a?n.y:t.y,s.z=o?n.z:t.z,s.applyMatrix4(e)}let i=this.satBounds,a=this.satAxes,o=r[0];for(let e=0;e<3;e++){let t=a[e],n=i[e],s=r[1<<e];t.subVectors(o,s),n.setFromPoints(t,r)}let s=this.alignedSatBounds;s[0].setFromPointsField(r,`x`),s[1].setFromPointsField(r,`y`),s[2].setFromPointsField(r,`z`),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}})(),xm.prototype.intersectsBox=(function(){let e=new fm;return function(t){this.needsUpdate&&this.update();let n=t.min,r=t.max,i=this.satBounds,a=this.satAxes,o=this.alignedSatBounds;if(e.min=n.x,e.max=r.x,o[0].isSeparated(e)||(e.min=n.y,e.max=r.y,o[1].isSeparated(e))||(e.min=n.z,e.max=r.z,o[2].isSeparated(e)))return!1;for(let n=0;n<3;n++){let r=a[n],o=i[n];if(e.setFromBox(r,t),o.isSeparated(e))return!1}return!0}})(),xm.prototype.intersectsTriangle=(function(){let e=new bm,t=[,,,],n=new fm,r=new fm,i=new G;return function(a){this.needsUpdate&&this.update(),a.isExtendedTriangle?a.needsUpdate&&a.update():(e.copy(a),e.update(),a=e);let o=this.satBounds,s=this.satAxes;t[0]=a.a,t[1]=a.b,t[2]=a.c;for(let e=0;e<3;e++){let r=o[e],i=s[e];if(n.setFromPoints(i,t),r.isSeparated(n))return!1}let c=a.satBounds,l=a.satAxes,u=this.points;for(let e=0;e<3;e++){let t=c[e],r=l[e];if(n.setFromPoints(r,u),t.isSeparated(n))return!1}for(let e=0;e<3;e++){let a=s[e];for(let e=0;e<4;e++){let o=l[e];if(i.crossVectors(a,o),n.setFromPoints(i,t),r.setFromPoints(i,u),n.isSeparated(r))return!1}}return!0}})(),xm.prototype.closestPointToPoint=(function(){return function(e,t){return this.needsUpdate&&this.update(),t.copy(e).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),t}})(),xm.prototype.distanceToPoint=(function(){let e=new G;return function(t){return this.closestPointToPoint(t,e),t.distanceTo(e)}})(),xm.prototype.distanceToBox=(function(){let e=[`x`,`y`,`z`],t=Array(12).fill().map(()=>new Hc),n=Array(12).fill().map(()=>new Hc),r=new G,i=new G;return function(a,o=0,s=null,c=null){if(this.needsUpdate&&this.update(),this.intersectsBox(a))return(s||c)&&(a.getCenter(i),this.closestPointToPoint(i,r),a.closestPointToPoint(r,i),s&&s.copy(r),c&&c.copy(i)),0;let l=o*o,u=a.min,d=a.max,f=this.points,p=1/0;for(let e=0;e<8;e++){let t=f[e];i.copy(t).clamp(u,d);let n=t.distanceToSquared(i);if(n<p&&(p=n,s&&s.copy(t),c&&c.copy(i),n<l))return Math.sqrt(n)}let m=0;for(let r=0;r<3;r++)for(let i=0;i<=1;i++)for(let a=0;a<=1;a++){let o=(r+1)%3,s=(r+2)%3,c=i<<o|a<<s,l=1<<r|i<<o|a<<s,p=f[c],h=f[l];t[m].set(p,h);let g=e[r],_=e[o],v=e[s],y=n[m],b=y.start,x=y.end;b[g]=u[g],b[_]=i?u[_]:d[_],b[v]=a?u[v]:d[_],x[g]=d[g],x[_]=i?u[_]:d[_],x[v]=a?u[v]:d[_],m++}for(let e=0;e<=1;e++)for(let t=0;t<=1;t++)for(let n=0;n<=1;n++){i.x=e?d.x:u.x,i.y=t?d.y:u.y,i.z=n?d.z:u.z,this.closestPointToPoint(i,r);let a=i.distanceToSquared(r);if(a<p&&(p=a,s&&s.copy(r),c&&c.copy(i),a<l))return Math.sqrt(a)}for(let e=0;e<12;e++){let a=t[e];for(let e=0;e<12;e++){let t=n[e];mm(a,t,r,i);let o=r.distanceToSquared(i);if(o<p&&(p=o,s&&s.copy(r),c&&c.copy(i),o<l))return Math.sqrt(o)}}return Math.sqrt(p)}})();var Sm=new class extends Pp{constructor(){super(()=>new bm)}},Cm=new G,wm=new G;function Tm(e,t,n={},r=0,i=1/0){let a=r*r,o=i*i,s=1/0,c=null;if(e.shapecast({boundsTraverseOrder:e=>(Cm.copy(t).clamp(e.min,e.max),Cm.distanceToSquared(t)),intersectsBounds:(e,t,n)=>n<s&&n<o,intersectsTriangle:(e,n)=>{e.closestPointToPoint(t,Cm);let r=t.distanceToSquared(Cm);return r<s&&(wm.copy(Cm),s=r,c=n),r<a}}),s===1/0)return null;let l=Math.sqrt(s);return n.point?n.point.copy(wm):n.point=wm.clone(),n.distance=l,n.faceIndex=c,n}var Em=!0,Dm=new G,Om=new G,km=new G,Am=new W,jm=new W,Mm=new W,Nm=new G,Pm=new G,Fm=new G,Im=new G;function Lm(e,t,n,r,i,a,o,s){let c;if(c=a===1?e.intersectTriangle(r,n,t,!0,i):e.intersectTriangle(t,n,r,a!==2,i),c===null)return null;let l=e.origin.distanceTo(i);return l<o||l>s?null:{distance:l,point:i.clone()}}function Rm(e,t,n,r,i,a,o,s,c,l,u){Dm.fromBufferAttribute(t,a),Om.fromBufferAttribute(t,o),km.fromBufferAttribute(t,s);let d=Lm(e,Dm,Om,km,Im,c,l,u);if(d){if(r){Am.fromBufferAttribute(r,a),jm.fromBufferAttribute(r,o),Mm.fromBufferAttribute(r,s),d.uv=new W;let e=Xn.getInterpolation(Im,Dm,Om,km,Am,jm,Mm,d.uv);Em||(d.uv=e)}if(i){Am.fromBufferAttribute(i,a),jm.fromBufferAttribute(i,o),Mm.fromBufferAttribute(i,s),d.uv1=new W;let e=Xn.getInterpolation(Im,Dm,Om,km,Am,jm,Mm,d.uv1);Em||(d.uv1=e)}if(n){Nm.fromBufferAttribute(n,a),Pm.fromBufferAttribute(n,o),Fm.fromBufferAttribute(n,s),d.normal=new G;let t=Xn.getInterpolation(Im,Dm,Om,km,Nm,Pm,Fm,d.normal);d.normal.dot(e.direction)>0&&d.normal.multiplyScalar(-1),Em||(d.normal=t)}let t={a,b:o,c:s,normal:new G,materialIndex:0};if(Xn.getNormal(Dm,Om,km,t.normal),d.face=t,d.faceIndex=a,Em){let e=new G;Xn.getBarycoord(Im,Dm,Om,km,e),d.barycoord=e}}return d}function zm(e){return e&&e.isMaterial?e.side:e}function Bm(e,t,n,r,i,a,o){let s=r*3,c=s+0,l=s+1,u=s+2,{index:d,groups:f}=e;e.index&&(c=d.getX(c),l=d.getX(l),u=d.getX(u));let{position:p,normal:m,uv:h,uv1:g}=e.attributes;if(Array.isArray(t)){let e=r*3;for(let s=0,d=f.length;s<d;s++){let{start:d,count:_,materialIndex:v}=f[s];if(e>=d&&e<d+_){let e=zm(t[v]),s=Rm(n,p,m,h,g,c,l,u,e,a,o);if(s){if(s.faceIndex=r,s.face.materialIndex=v,i)i.push(s);else return s}}}}else{let e=zm(t),s=Rm(n,p,m,h,g,c,l,u,e,a,o);if(s){if(s.faceIndex=r,s.face.materialIndex=0,i)i.push(s);else return s}}return null}function Vm(e,t,n,r){let i=e.a,a=e.b,o=e.c,s=t,c=t+1,l=t+2;n&&(s=n.getX(s),c=n.getX(c),l=n.getX(l)),i.x=r.getX(s),i.y=r.getY(s),i.z=r.getZ(s),a.x=r.getX(c),a.y=r.getY(c),a.z=r.getZ(c),o.x=r.getX(l),o.y=r.getY(l),o.z=r.getZ(l)}function Hm(e,t,n,r,i,a,o,s){let{geometry:c,_indirectBuffer:l}=e;for(let e=r,l=r+i;e<l;e++)Bm(c,t,n,e,a,o,s)}function Um(e,t,n,r,i,a,o){let{geometry:s,_indirectBuffer:c}=e,l=1/0,u=null;for(let e=r,c=r+i;e<c;e++){let r;r=Bm(s,t,n,e,null,a,o),r&&r.distance<l&&(u=r,l=r.distance)}return u}function Wm(e,t,n,r,i,a,o){let{geometry:s}=n,{index:c}=s,l=s.attributes.position;for(let n=e,s=t+e;n<s;n++){let e;if(e=n,Vm(o,e*3,c,l),o.needsUpdate=!0,r(o,e,i,a))return!0}return!1}function Gm(e,t=null){t&&Array.isArray(t)&&(t=new Set(t));let n=e.geometry,r=n.index?n.index.array:null,i=n.attributes.position,a,o,s,c,l=0,u=e._roots;for(let e=0,t=u.length;e<t;e++)a=u[e],o=new Uint32Array(a),s=new Uint16Array(a),c=new Float32Array(a),d(0,l),l+=a.byteLength;function d(e,n,a=!1){let l=e*2;if(cp(l,s)){let t=lp(e,o),n=up(l,s),a=1/0,u=1/0,d=1/0,f=-1/0,p=-1/0,m=-1/0;for(let e=3*t,o=3*(t+n);e<o;e++){let t=r[e],n=i.getX(t),o=i.getY(t),s=i.getZ(t);n<a&&(a=n),n>f&&(f=n),o<u&&(u=o),o>p&&(p=o),s<d&&(d=s),s>m&&(m=s)}return c[e+0]!==a||c[e+1]!==u||c[e+2]!==d||c[e+3]!==f||c[e+4]!==p||c[e+5]!==m?(c[e+0]=a,c[e+1]=u,c[e+2]=d,c[e+3]=f,c[e+4]=p,c[e+5]=m,!0):!1}{let r=dp(e),i=fp(e,o),s=a,l=!1,u=!1;if(t){if(!s){let e=r/8+n/32,a=i/8+n/32;l=t.has(e),u=t.has(a),s=!l&&!u}}else l=!0,u=!0;let f=s||l,p=s||u,m=!1;f&&(m=d(r,n,s));let h=!1;p&&(h=d(i,n,s));let g=m||h;if(g)for(let t=0;t<3;t++){let n=r+t,a=i+t,o=c[n],s=c[n+3],l=c[a],u=c[a+3];c[e+t]=o<l?o:l,c[e+t+3]=s>u?s:u}return g}}}function Km(e,t,n,r,i){let a,o,s,c,l,u,d=1/n.direction.x,f=1/n.direction.y,p=1/n.direction.z,m=n.origin.x,h=n.origin.y,g=n.origin.z,_=t[e],v=t[e+3],y=t[e+1],b=t[e+3+1],x=t[e+2],S=t[e+3+2];return d>=0?(a=(_-m)*d,o=(v-m)*d):(a=(v-m)*d,o=(_-m)*d),f>=0?(s=(y-h)*f,c=(b-h)*f):(s=(b-h)*f,c=(y-h)*f),a>c||s>o||((s>a||isNaN(a))&&(a=s),(c<o||isNaN(o))&&(o=c),p>=0?(l=(x-g)*p,u=(S-g)*p):(l=(S-g)*p,u=(x-g)*p),a>u||l>o)?!1:((l>a||a!==a)&&(a=l),(u<o||o!==o)&&(o=u),a<=i&&o>=r)}function qm(e,t,n,r,i,a,o,s){let{geometry:c,_indirectBuffer:l}=e;for(let e=r,u=r+i;e<u;e++)Bm(c,t,n,l?l[e]:e,a,o,s)}function Jm(e,t,n,r,i,a,o){let{geometry:s,_indirectBuffer:c}=e,l=1/0,u=null;for(let e=r,d=r+i;e<d;e++){let r;r=Bm(s,t,n,c?c[e]:e,null,a,o),r&&r.distance<l&&(u=r,l=r.distance)}return u}function Ym(e,t,n,r,i,a,o){let{geometry:s}=n,{index:c}=s,l=s.attributes.position;for(let s=e,u=t+e;s<u;s++){let e;if(e=n.resolveTriangleIndex(s),Vm(o,e*3,c,l),o.needsUpdate=!0,r(o,e,i,a))return!0}return!1}function Xm(e,t,n,r,i,a,o){Fp.setBuffer(e._roots[t]),Zm(0,e,n,r,i,a,o),Fp.clearBuffer()}function Zm(e,t,n,r,i,a,o){let{float32Array:s,uint16Array:c,uint32Array:l}=Fp,u=e*2;if(cp(u,c))Hm(t,n,r,lp(e,l),up(u,c),i,a,o);else{let c=dp(e);Km(c,s,r,a,o)&&Zm(c,t,n,r,i,a,o);let u=fp(e,l);Km(u,s,r,a,o)&&Zm(u,t,n,r,i,a,o)}}var Qm=[`x`,`y`,`z`];function $m(e,t,n,r,i,a){Fp.setBuffer(e._roots[t]);let o=eh(0,e,n,r,i,a);return Fp.clearBuffer(),o}function eh(e,t,n,r,i,a){let{float32Array:o,uint16Array:s,uint32Array:c}=Fp,l=e*2;if(cp(l,s))return Um(t,n,r,lp(e,c),up(l,s),i,a);{let s=pp(e,c),l=Qm[s],u=r.direction[l]>=0,d,f;u?(d=dp(e),f=fp(e,c)):(d=fp(e,c),f=dp(e));let p=Km(d,o,r,i,a)?eh(d,t,n,r,i,a):null;if(p){let e=p.point[l];if(u?e<=o[f+s]:e>=o[f+s+3])return p}let m=Km(f,o,r,i,a)?eh(f,t,n,r,i,a):null;return p&&m?p.distance<=m.distance?p:m:p||m||null}}var th=new Zn,nh=new bm,rh=new bm,ih=new K,ah=new xm,oh=new xm;function sh(e,t,n,r){Fp.setBuffer(e._roots[t]);let i=ch(0,e,n,r);return Fp.clearBuffer(),i}function ch(e,t,n,r,i=null){let{float32Array:a,uint16Array:o,uint32Array:s}=Fp,c=e*2;if(i===null&&(n.boundingBox||n.computeBoundingBox(),ah.set(n.boundingBox.min,n.boundingBox.max,r),i=ah),cp(c,o)){let i=t.geometry,l=i.index,u=i.attributes.position,d=n.index,f=n.attributes.position,p=lp(e,s),m=up(c,o);if(ih.copy(r).invert(),n.boundsTree)return np(mp(e),a,oh),oh.matrix.copy(ih),oh.needsUpdate=!0,n.boundsTree.shapecast({intersectsBounds:e=>oh.intersectsBox(e),intersectsTriangle:e=>{e.a.applyMatrix4(r),e.b.applyMatrix4(r),e.c.applyMatrix4(r),e.needsUpdate=!0;for(let t=p*3,n=(m+p)*3;t<n;t+=3)if(Vm(rh,t,l,u),rh.needsUpdate=!0,e.intersectsTriangle(rh))return!0;return!1}});{let e=im(n);for(let t=p*3,n=(m+p)*3;t<n;t+=3){Vm(nh,t,l,u),nh.a.applyMatrix4(ih),nh.b.applyMatrix4(ih),nh.c.applyMatrix4(ih),nh.needsUpdate=!0;for(let t=0,n=e*3;t<n;t+=3)if(Vm(rh,t,d,f),rh.needsUpdate=!0,nh.intersectsTriangle(rh))return!0}}}else{let o=dp(e),c=fp(e,s);return np(mp(o),a,th),!!(i.intersectsBox(th)&&ch(o,t,n,r,i)||(np(mp(c),a,th),i.intersectsBox(th)&&ch(c,t,n,r,i)))}}var lh=new K,uh=new xm,dh=new xm,fh=new G,ph=new G,mh=new G,hh=new G;function gh(e,t,n,r={},i={},a=0,o=1/0){t.boundingBox||t.computeBoundingBox(),uh.set(t.boundingBox.min,t.boundingBox.max,n),uh.needsUpdate=!0;let s=e.geometry,c=s.attributes.position,l=s.index,u=t.attributes.position,d=t.index,f=Sm.getPrimitive(),p=Sm.getPrimitive(),m=fh,h=ph,g=null,_=null;i&&(g=mh,_=hh);let v=1/0,y=null,b=null;return lh.copy(n).invert(),dh.matrix.copy(lh),e.shapecast({boundsTraverseOrder:e=>uh.distanceToBox(e),intersectsBounds:(e,t,n)=>n<v&&n<o&&(t&&(dh.min.copy(e.min),dh.max.copy(e.max),dh.needsUpdate=!0),!0),intersectsRange:(e,r)=>{if(t.boundsTree)return t.boundsTree.shapecast({boundsTraverseOrder:e=>dh.distanceToBox(e),intersectsBounds:(e,t,n)=>n<v&&n<o,intersectsRange:(t,i)=>{for(let o=t,s=t+i;o<s;o++){Vm(p,3*o,d,u),p.a.applyMatrix4(n),p.b.applyMatrix4(n),p.c.applyMatrix4(n),p.needsUpdate=!0;for(let t=e,n=e+r;t<n;t++){Vm(f,3*t,l,c),f.needsUpdate=!0;let e=f.distanceToTriangle(p,m,g);if(e<v&&(h.copy(m),_&&_.copy(g),v=e,y=t,b=o),e<a)return!0}}}});{let i=im(t);for(let t=0,o=i;t<o;t++){Vm(p,3*t,d,u),p.a.applyMatrix4(n),p.b.applyMatrix4(n),p.c.applyMatrix4(n),p.needsUpdate=!0;for(let n=e,i=e+r;n<i;n++){Vm(f,3*n,l,c),f.needsUpdate=!0;let e=f.distanceToTriangle(p,m,g);if(e<v&&(h.copy(m),_&&_.copy(g),v=e,y=n,b=t),e<a)return!0}}}}}),Sm.releasePrimitive(f),Sm.releasePrimitive(p),v===1/0?null:(r.point?r.point.copy(h):r.point=h.clone(),r.distance=v,r.faceIndex=y,i&&(i.point?i.point.copy(_):i.point=_.clone(),i.point.applyMatrix4(lh),h.applyMatrix4(lh),i.distance=h.sub(i.point).length(),i.faceIndex=b),r)}function _h(e,t=null){t&&Array.isArray(t)&&(t=new Set(t));let n=e.geometry,r=n.index?n.index.array:null,i=n.attributes.position,a,o,s,c,l=0,u=e._roots;for(let e=0,t=u.length;e<t;e++)a=u[e],o=new Uint32Array(a),s=new Uint16Array(a),c=new Float32Array(a),d(0,l),l+=a.byteLength;function d(n,a,l=!1){let u=n*2;if(cp(u,s)){let t=lp(n,o),a=up(u,s),l=1/0,d=1/0,f=1/0,p=-1/0,m=-1/0,h=-1/0;for(let n=t,o=t+a;n<o;n++){let t=3*e.resolveTriangleIndex(n);for(let e=0;e<3;e++){let n=t+e;n=r?r[n]:n;let a=i.getX(n),o=i.getY(n),s=i.getZ(n);a<l&&(l=a),a>p&&(p=a),o<d&&(d=o),o>m&&(m=o),s<f&&(f=s),s>h&&(h=s)}}return c[n+0]!==l||c[n+1]!==d||c[n+2]!==f||c[n+3]!==p||c[n+4]!==m||c[n+5]!==h?(c[n+0]=l,c[n+1]=d,c[n+2]=f,c[n+3]=p,c[n+4]=m,c[n+5]=h,!0):!1}{let e=dp(n),r=fp(n,o),i=l,s=!1,u=!1;if(t){if(!i){let n=e/8+a/32,o=r/8+a/32;s=t.has(n),u=t.has(o),i=!s&&!u}}else s=!0,u=!0;let f=i||s,p=i||u,m=!1;f&&(m=d(e,a,i));let h=!1;p&&(h=d(r,a,i));let g=m||h;if(g)for(let t=0;t<3;t++){let i=e+t,a=r+t,o=c[i],s=c[i+3],l=c[a],u=c[a+3];c[n+t]=o<l?o:l,c[n+t+3]=s>u?s:u}return g}}}function vh(e,t,n,r,i,a,o){Fp.setBuffer(e._roots[t]),yh(0,e,n,r,i,a,o),Fp.clearBuffer()}function yh(e,t,n,r,i,a,o){let{float32Array:s,uint16Array:c,uint32Array:l}=Fp,u=e*2;if(cp(u,c))qm(t,n,r,lp(e,l),up(u,c),i,a,o);else{let c=dp(e);Km(c,s,r,a,o)&&yh(c,t,n,r,i,a,o);let u=fp(e,l);Km(u,s,r,a,o)&&yh(u,t,n,r,i,a,o)}}var bh=[`x`,`y`,`z`];function xh(e,t,n,r,i,a){Fp.setBuffer(e._roots[t]);let o=Sh(0,e,n,r,i,a);return Fp.clearBuffer(),o}function Sh(e,t,n,r,i,a){let{float32Array:o,uint16Array:s,uint32Array:c}=Fp,l=e*2;if(cp(l,s))return Jm(t,n,r,lp(e,c),up(l,s),i,a);{let s=pp(e,c),l=bh[s],u=r.direction[l]>=0,d,f;u?(d=dp(e),f=fp(e,c)):(d=fp(e,c),f=dp(e));let p=Km(d,o,r,i,a)?Sh(d,t,n,r,i,a):null;if(p){let e=p.point[l];if(u?e<=o[f+s]:e>=o[f+s+3])return p}let m=Km(f,o,r,i,a)?Sh(f,t,n,r,i,a):null;return p&&m?p.distance<=m.distance?p:m:p||m||null}}var Ch=new Zn,wh=new bm,Th=new bm,Eh=new K,Dh=new xm,Oh=new xm;function kh(e,t,n,r){Fp.setBuffer(e._roots[t]);let i=Ah(0,e,n,r);return Fp.clearBuffer(),i}function Ah(e,t,n,r,i=null){let{float32Array:a,uint16Array:o,uint32Array:s}=Fp,c=e*2;if(i===null&&(n.boundingBox||n.computeBoundingBox(),Dh.set(n.boundingBox.min,n.boundingBox.max,r),i=Dh),cp(c,o)){let i=t.geometry,l=i.index,u=i.attributes.position,d=n.index,f=n.attributes.position,p=lp(e,s),m=up(c,o);if(Eh.copy(r).invert(),n.boundsTree)return np(mp(e),a,Oh),Oh.matrix.copy(Eh),Oh.needsUpdate=!0,n.boundsTree.shapecast({intersectsBounds:e=>Oh.intersectsBox(e),intersectsTriangle:e=>{e.a.applyMatrix4(r),e.b.applyMatrix4(r),e.c.applyMatrix4(r),e.needsUpdate=!0;for(let n=p,r=m+p;n<r;n++)if(Vm(Th,3*t.resolveTriangleIndex(n),l,u),Th.needsUpdate=!0,e.intersectsTriangle(Th))return!0;return!1}});{let e=im(n);for(let n=p,r=m+p;n<r;n++){Vm(wh,3*t.resolveTriangleIndex(n),l,u),wh.a.applyMatrix4(Eh),wh.b.applyMatrix4(Eh),wh.c.applyMatrix4(Eh),wh.needsUpdate=!0;for(let t=0,n=e*3;t<n;t+=3)if(Vm(Th,t,d,f),Th.needsUpdate=!0,wh.intersectsTriangle(Th))return!0}}}else{let o=dp(e),c=fp(e,s);return np(mp(o),a,Ch),!!(i.intersectsBox(Ch)&&Ah(o,t,n,r,i)||(np(mp(c),a,Ch),i.intersectsBox(Ch)&&Ah(c,t,n,r,i)))}}var jh=new K,Mh=new xm,Nh=new xm,Ph=new G,Fh=new G,Ih=new G,Lh=new G;function Rh(e,t,n,r={},i={},a=0,o=1/0){t.boundingBox||t.computeBoundingBox(),Mh.set(t.boundingBox.min,t.boundingBox.max,n),Mh.needsUpdate=!0;let s=e.geometry,c=s.attributes.position,l=s.index,u=t.attributes.position,d=t.index,f=Sm.getPrimitive(),p=Sm.getPrimitive(),m=Ph,h=Fh,g=null,_=null;i&&(g=Ih,_=Lh);let v=1/0,y=null,b=null;return jh.copy(n).invert(),Nh.matrix.copy(jh),e.shapecast({boundsTraverseOrder:e=>Mh.distanceToBox(e),intersectsBounds:(e,t,n)=>n<v&&n<o&&(t&&(Nh.min.copy(e.min),Nh.max.copy(e.max),Nh.needsUpdate=!0),!0),intersectsRange:(r,i)=>{if(t.boundsTree){let s=t.boundsTree;return s.shapecast({boundsTraverseOrder:e=>Nh.distanceToBox(e),intersectsBounds:(e,t,n)=>n<v&&n<o,intersectsRange:(t,o)=>{for(let x=t,S=t+o;x<S;x++){let t=s.resolveTriangleIndex(x);Vm(p,3*t,d,u),p.a.applyMatrix4(n),p.b.applyMatrix4(n),p.c.applyMatrix4(n),p.needsUpdate=!0;for(let t=r,n=r+i;t<n;t++){let n=e.resolveTriangleIndex(t);Vm(f,3*n,l,c),f.needsUpdate=!0;let r=f.distanceToTriangle(p,m,g);if(r<v&&(h.copy(m),_&&_.copy(g),v=r,y=t,b=x),r<a)return!0}}}})}{let o=im(t);for(let t=0,s=o;t<s;t++){Vm(p,3*t,d,u),p.a.applyMatrix4(n),p.b.applyMatrix4(n),p.c.applyMatrix4(n),p.needsUpdate=!0;for(let n=r,o=r+i;n<o;n++){let r=e.resolveTriangleIndex(n);Vm(f,3*r,l,c),f.needsUpdate=!0;let i=f.distanceToTriangle(p,m,g);if(i<v&&(h.copy(m),_&&_.copy(g),v=i,y=n,b=t),i<a)return!0}}}}}),Sm.releasePrimitive(f),Sm.releasePrimitive(p),v===1/0?null:(r.point?r.point.copy(h):r.point=h.clone(),r.distance=v,r.faceIndex=y,i&&(i.point?i.point.copy(_):i.point=_.clone(),i.point.applyMatrix4(jh),h.applyMatrix4(jh),i.distance=h.sub(i.point).length(),i.faceIndex=b),r)}function zh(e,t,n){return e===null?null:(e.point.applyMatrix4(t.matrixWorld),e.distance=e.point.distanceTo(n.ray.origin),e.object=t,e)}var Bh=new xm,Vh=new qr,Hh=new G,Uh=new K,Wh=new G,Gh=[`getX`,`getY`,`getZ`],Kh=class e extends dm{static serialize(e,t={}){t={cloneBuffers:!0,...t};let n=e.geometry,r=e._roots,i=e._indirectBuffer,a=n.getIndex(),o={version:1,roots:null,index:null,indirectBuffer:null};return t.cloneBuffers?(o.roots=r.map(e=>e.slice()),o.index=a?a.array.slice():null,o.indirectBuffer=i?i.slice():null):(o.roots=r,o.index=a?a.array:null,o.indirectBuffer=i),o}static deserialize(t,n,r={}){r={setIndex:!0,indirect:!!t.indirectBuffer,...r};let{index:i,roots:a,indirectBuffer:o}=t;t.version||(console.warn(`MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data.`),c(a));let s=new e(n,{...r,[ep]:!0});if(s._roots=a,s._indirectBuffer=o||null,r.setIndex){let e=n.getIndex();if(e===null){let e=new br(t.index,1,!1);n.setIndex(e)}else e.array!==i&&(e.array.set(i),e.needsUpdate=!0)}return s;function c(e){for(let t=0;t<e.length;t++){let n=e[t],r=new Uint32Array(n),i=new Uint16Array(n);for(let e=0,t=n.byteLength/32;e<t;e++){let t=8*e;cp(2*t,i)||(r[t+6]=r[t+6]/8-e)}}}}get primitiveStride(){return 3}get resolveTriangleIndex(){return this.resolvePrimitiveIndex}constructor(e,t={}){t.maxLeafTris&&(console.warn(`MeshBVH: "maxLeafTris" option has been deprecated. Use "targetLeafSize", instead.`),t={...t,targetLeafSize:t.maxLeafTris}),super(e,t)}shiftTriangleOffsets(e){return super.shiftPrimitiveOffsets(e)}writePrimitiveBounds(e,t,n){let r=this.geometry,i=this._indirectBuffer,a=r.attributes.position,o=r.index?r.index.array:null,s=(i?i[e]:e)*3,c=s+0,l=s+1,u=s+2;o&&(c=o[c],l=o[l],u=o[u]);for(let e=0;e<3;e++){let r=a[Gh[e]](c),i=a[Gh[e]](l),o=a[Gh[e]](u),s=r;i<s&&(s=i),o<s&&(s=o);let d=r;i>d&&(d=i),o>d&&(d=o),t[n+e]=s,t[n+e+3]=d}return t}computePrimitiveBounds(e,t,n){let r=this.geometry,i=this._indirectBuffer,a=r.attributes.position,o=r.index?r.index.array:null,s=a.normalized;if(e<0||t+e-n.offset>n.length/6)throw Error(`MeshBVH: compute triangle bounds range is invalid.`);let c=a.array,l=a.offset||0,u=3;a.isInterleavedBufferAttribute&&(u=a.data.stride);let d=[`getX`,`getY`,`getZ`],f=n.offset;for(let r=e,p=e+t;r<p;r++){let e=(i?i[r]:r)*3,t=(r-f)*6,p=e+0,m=e+1,h=e+2;o&&(p=o[p],m=o[m],h=o[h]),s||(p=p*u+l,m=m*u+l,h=h*u+l);for(let e=0;e<3;e++){let r,i,o;s?(r=a[d[e]](p),i=a[d[e]](m),o=a[d[e]](h)):(r=c[p+e],i=c[m+e],o=c[h+e]);let l=r;i<l&&(l=i),o<l&&(l=o);let u=r;i>u&&(u=i),o>u&&(u=o);let f=(u-l)/2,g=e*2;n[t+g+0]=l+f,n[t+g+1]=f+(Math.abs(l)+f)*$f}}return n}raycastObject3D(e,t,n=[]){let{material:r}=e;if(r===void 0)return;Uh.copy(e.matrixWorld).invert(),Vh.copy(t.ray).applyMatrix4(Uh),Wh.setFromMatrixScale(e.matrixWorld),Hh.copy(Vh.direction).multiply(Wh);let i=Hh.length(),a=t.near/i,o=t.far/i;if(t.firstHitOnly===!0){let i=this.raycastFirst(Vh,r,a,o);i=zh(i,e,t),i&&n.push(i)}else{let i=this.raycast(Vh,r,a,o);for(let r=0,a=i.length;r<a;r++){let a=zh(i[r],e,t);a&&n.push(a)}}return n}refit(e=null){return(this.indirect?_h:Gm)(this,e)}raycast(e,t=0,n=0,r=1/0){let i=this._roots,a=[],o=this.indirect?vh:Xm;for(let s=0,c=i.length;s<c;s++)o(this,s,t,e,a,n,r);return a}raycastFirst(e,t=0,n=0,r=1/0){let i=this._roots,a=null,o=this.indirect?xh:$m;for(let s=0,c=i.length;s<c;s++){let i=o(this,s,t,e,n,r);i!=null&&(a==null||i.distance<a.distance)&&(a=i)}return a}intersectsGeometry(e,t){let n=!1,r=this._roots,i=this.indirect?kh:sh;for(let a=0,o=r.length;a<o&&(n=i(this,a,e,t),!n);a++);return n}shapecast(e){let t=Sm.getPrimitive(),n=super.shapecast({...e,intersectsPrimitive:e.intersectsTriangle,scratchPrimitive:t,iterate:this.indirect?Ym:Wm});return Sm.releasePrimitive(t),n}bvhcast(t,n,r){let{intersectsRanges:i,intersectsTriangles:a}=r,o=Sm.getPrimitive(),s=this.geometry.index,c=this.geometry.attributes.position,l=this.indirect?e=>{let t=this.resolveTriangleIndex(e);Vm(o,t*3,s,c)}:e=>{Vm(o,e*3,s,c)},u=Sm.getPrimitive(),d=t.geometry.index,f=t.geometry.attributes.position,p=t.indirect?e=>{let n=t.resolveTriangleIndex(e);Vm(u,n*3,d,f)}:e=>{Vm(u,e*3,d,f)};if(a){if(!(t instanceof e))throw Error(`MeshBVH: "intersectsTriangles" callback can only be used with another MeshBVH.`);let r=(e,t,r,i,s,c,d,f)=>{for(let m=r,h=r+i;m<h;m++){p(m),u.a.applyMatrix4(n),u.b.applyMatrix4(n),u.c.applyMatrix4(n),u.needsUpdate=!0;for(let n=e,r=e+t;n<r;n++)if(l(n),o.needsUpdate=!0,a(o,u,n,m,s,c,d,f))return!0}return!1};if(i){let e=i;i=function(t,n,i,a,o,s,c,l){return e(t,n,i,a,o,s,c,l)?!0:r(t,n,i,a,o,s,c,l)}}else i=r}return super.bvhcast(t,n,{intersectsRanges:i})}intersectsBox(e,t){return Bh.set(e.min,e.max,t),Bh.needsUpdate=!0,this.shapecast({intersectsBounds:e=>Bh.intersectsBox(e),intersectsTriangle:e=>Bh.intersectsTriangle(e)})}intersectsSphere(e){return this.shapecast({intersectsBounds:t=>e.intersectsBox(t),intersectsTriangle:t=>t.intersectsSphere(e)})}closestPointToGeometry(e,t,n={},r={},i=0,a=1/0){return(this.indirect?Rh:gh)(this,e,t,n,r,i,a)}closestPointToPoint(e,t={},n=0,r=1/0){return Tm(this,e,t,n,r)}},qh={Mesh:Y.prototype.raycast,Line:ha.prototype.raycast,LineSegments:ya.prototype.raycast,LineLoop:ba.prototype.raycast,Points:Ea.prototype.raycast,BatchedMesh:oa.prototype.raycast},Jh=new Y,Yh=[];function Xh(e,t){if(this.isBatchedMesh)Zh.call(this,e,t);else{let{geometry:n}=this;if(n.boundsTree)n.boundsTree.raycastObject3D(this,e,t);else{let n;if(this instanceof Y)n=qh.Mesh;else if(this instanceof ya)n=qh.LineSegments;else if(this instanceof ba)n=qh.LineLoop;else if(this instanceof ha)n=qh.Line;else if(this instanceof Ea)n=qh.Points;else throw Error(`BVH: Fallback raycast function not found.`);n.call(this,e,t)}}}function Zh(e,t){if(this.boundsTrees){let n=this.boundsTrees,r=this._drawInfo||this._instanceInfo,i=this._drawRanges||this._geometryInfo,a=this.matrixWorld;Jh.material=this.material,Jh.geometry=this.geometry;let o=Jh.geometry.boundsTree,s=Jh.geometry.drawRange;Jh.geometry.boundingSphere===null&&(Jh.geometry.boundingSphere=new Er);for(let o=0,s=r.length;o<s;o++){if(!this.getVisibleAt(o))continue;let s=r[o].geometryIndex;if(Jh.geometry.boundsTree=n[s],this.getMatrixAt(o,Jh.matrixWorld).premultiply(a),!Jh.geometry.boundsTree){this.getBoundingBoxAt(s,Jh.geometry.boundingBox),this.getBoundingSphereAt(s,Jh.geometry.boundingSphere);let e=i[s];Jh.geometry.setDrawRange(e.start,e.count)}Jh.raycast(e,Yh);for(let e=0,n=Yh.length;e<n;e++){let n=Yh[e];n.object=this,n.batchId=o,t.push(n)}Yh.length=0}Jh.geometry.boundsTree=o,Jh.geometry.drawRange=s,Jh.material=null,Jh.geometry=null}else qh.BatchedMesh.call(this,e,t)}function Qh(e={}){let{type:t=Kh}=e;return this.boundsTree=new t(this,e),this.boundsTree}var $h=.006,eg=class{floor;floorCeiling;touchesSolid=!1;solids;ray=new qr;insideRay=new qr;insideChecks=[new G(0,1,0),new G(.91,.21,.35).normalize(),new G(-.35,.31,-.89).normalize()];line=new Hc;box=new Zn;closest={point:new G,distance:0,faceIndex:0};surfacePoint=new G;axisPoint=new G;direction=new G;faceNormal=new G;tri=new Xn;candidate=new G;bestPoint=new G;bestNormal=new G;escapes=Array.from({length:8},(e,t)=>new G(Math.cos(t*Math.PI/4),0,Math.sin(t*Math.PI/4))).concat(new G(0,1,0));samplePoint=new G;sampleBefore=new G;sampleNormal=new G;sampleCorrection=new G;segmentNormal=new G;constructor(e,t,n=1/0){this.floor=t,this.floorCeiling=n,this.solids=e.map(e=>{e.updateMatrixWorld(!0);let t=e.geometry.clone().applyMatrix4(e.matrixWorld),n=new Kh(t);t.computeBoundingBox();let r=t.boundingBox.clone();return{geometry:t,tree:n,box:r,nearby:new Map,nx:Math.ceil((r.max.x-r.min.x)/$h)+1,ny:Math.ceil((r.max.y-r.min.y)/$h)+1}})}beginStep(){this.touchesSolid=!1}overlapsSolid(e,t=.002){for(let n of this.solids){if(n.box.distanceToPoint(e)>t)continue;let r=n.tree.closestPointToPoint(e,this.closest,0,n.box.containsPoint(e)?1/0:t+1e-8);if(r&&(r.distance<t||n.box.containsPoint(e)&&this.contains(n.tree,e)))return!0}return!1}contains(e,t){let n=0;for(let r of this.insideChecks){this.insideRay.set(t,r);let i=e.raycastFirst(this.insideRay,2);i&&i.face.normal.dot(r)>1e-5&&n++}return n>=2}exitAboveFloor(e,t,n){let r=1/0;for(let i of this.escapes){this.ray.set(t,i);let a=e.raycastFirst(this.ray,2);if(!a||a.face.normal.dot(i)<=0||(this.candidate.copy(a.point).addScaledVector(a.face.normal,n),this.candidate.y=Math.max(this.candidate.y,this.floor(this.candidate.x,this.candidate.z)+n),this.contains(e,this.candidate)))continue;let o=t.distanceToSquared(this.candidate);o>=r||(r=o,this.bestPoint.copy(this.candidate),this.bestNormal.copy(a.face.normal))}return Number.isFinite(r)}triangle(e,t){let n=e.attributes.position,r=e.index,i=e=>r?r.getX(t*3+e):t*3+e;return this.tri.a.fromBufferAttribute(n,i(0)),this.tri.b.fromBufferAttribute(n,i(1)),this.tri.c.fromBufferAttribute(n,i(2)),this.tri}projectPoint(e,t,n,r){let i=!1,a=n+5e-4,o=Z.w/2-.009-a,s=Z.d/2-.009-a;t.x<-o&&(t.x=-o,r.x+=1,i=!0),t.x>o&&(t.x=o,--r.x,i=!0),t.z<-s&&(t.z=-s,r.z+=1,i=!0),t.z>s&&(t.z=s,--r.z,i=!0),i&&(this.touchesSolid=!0),this.box.makeEmpty().expandByPoint(e).expandByPoint(t).expandByScalar(a);for(let n of this.solids){if(!n.box.intersectsBox(this.box))continue;this.direction.subVectors(t,e);let o=this.direction.length();if(o>1e-5){this.ray.set(e,this.direction.divideScalar(o));let s=n.tree.raycastFirst(this.ray,2,0,o);s&&s.face.normal.dot(this.direction)<-1e-5&&(t.copy(s.point).addScaledVector(s.face.normal,a),r.add(s.face.normal),i=!0,this.touchesSolid=!0,this.box.makeEmpty().expandByPoint(e).expandByPoint(t).expandByScalar(a))}let s=n.box.containsPoint(t),c=s?.08:Math.min(.08,a),l=-1,u=0,d;if(s){let e=(t.x-n.box.min.x)/$h,r=(t.y-n.box.min.y)/$h,i=(t.z-n.box.min.z)/$h,o=Math.floor(e),s=Math.floor(r),f=Math.floor(i);if(l=o+n.nx*(s+n.ny*f),d=n.nearby.get(l),d&&d.clearance>=a)continue;u=$h*Math.hypot(.5+Math.abs(e-o-.5),.5+Math.abs(r-s-.5),.5+Math.abs(i-f-.5)),d&&(this.triangle(n.geometry,d.face).closestPointToPoint(t,this.surfacePoint),c=Math.min(c,t.distanceTo(this.surfacePoint)+1e-8))}let f=n.tree.closestPointToPoint(t,this.closest,0,c);if(!f)continue;let p=this.triangle(n.geometry,f.faceIndex).getNormal(this.faceNormal);this.direction.subVectors(t,f.point);let m=!1;if(s&&this.direction.dot(p)<-1e-5&&(m=this.contains(n.tree,t)),l>=0){n.nearby.size>=32768&&n.nearby.clear();let e=m?0:Math.max(0,f.distance-u);e>(d?.clearance??0)&&this.contains(n.tree,t)&&(e=0),d?(d.face=f.faceIndex,d.clearance=Math.max(d.clearance,e)):n.nearby.set(l,{face:f.faceIndex,clearance:e})}if(!m&&f.distance>=a)continue;!m&&f.distance>1e-6?this.direction.divideScalar(f.distance):this.direction.copy(p);let h=m?a+f.distance:a-f.distance;this.candidate.copy(t).addScaledVector(this.direction,h),m&&this.candidate.y<this.floorCeiling+a&&this.candidate.y<this.floor(this.candidate.x,this.candidate.z)+a&&this.exitAboveFloor(n.tree,t,a)?(t.copy(this.bestPoint),this.direction.copy(this.bestNormal)):t.addScaledVector(this.direction,h),r.add(this.direction),i=!0,this.touchesSolid=!0,this.box.makeEmpty().expandByPoint(e).expandByPoint(t).expandByScalar(a)}if(t.y<this.floorCeiling+a){let e=this.floor(t.x,t.z)+a;t.y<e&&(t.y=e,r.y+=1,i=!0)}return i}projectSegment(e,t,n,r,i,a,o){let s=!1,c=7e-4;this.line.set(e,t),this.box.makeEmpty().expandByPoint(e).expandByPoint(t).expandByScalar(Math.max(n,r)+c);for(let l of this.solids){if(!l.box.intersectsBox(this.box))continue;this.direction.subVectors(t,e);let u=this.direction.length();if(u>1e-5){this.ray.set(e,this.direction.divideScalar(u));let d=l.tree.raycastFirst(this.ray,2,1e-5,u);if(d&&d.face.normal.dot(this.direction)<-1e-5){this.direction.copy(d.face.normal);let l=this.axisPoint.subVectors(e,d.point).dot(this.direction),u=this.surfacePoint.subVectors(t,d.point).dot(this.direction),f=Math.min(.025,Math.max(n,r)+c-Math.min(l,u));i||(e.addScaledVector(this.direction,f),a.add(this.direction)),t.addScaledVector(this.direction,f),o.add(this.direction),this.line.set(e,t),this.box.makeEmpty().expandByPoint(e).expandByPoint(t).expandByScalar(Math.max(n,r)+c),s=this.touchesSolid=!0}}let d=0,f=0,p=0;l.tree.shapecast({intersectsBounds:e=>e.intersectsBox(this.box),intersectsTriangle:e=>{let t=e.closestPointToSegment(this.line,this.surfacePoint,this.axisPoint),a=this.line.closestPointToPointParameter(this.axisPoint,!0),o=U.lerp(n,r,a)+c;if(t>=o)return!1;this.direction.subVectors(this.axisPoint,this.surfacePoint),t>1e-6?this.direction.divideScalar(t):e.getNormal(this.direction),e.getNormal(this.faceNormal),this.direction.dot(this.faceNormal)<-1e-5&&l.box.containsPoint(this.axisPoint)&&this.contains(l.tree,this.axisPoint)&&this.direction.copy(this.faceNormal);let s=i?0:1-a,u=a,m=s*(1-a)+u*a;if(m<.04)return!1;let h=Math.min(.025,(o-t)/m);return h>d&&(d=h,f=s,p=u,this.segmentNormal.copy(this.direction)),!1}}),d>0&&(e.addScaledVector(this.segmentNormal,d*f),t.addScaledVector(this.segmentNormal,d*p),this.line.set(e,t),this.box.makeEmpty().expandByPoint(e).expandByPoint(t).expandByScalar(Math.max(n,r)+c),a.addScaledVector(this.segmentNormal,f),o.addScaledVector(this.segmentNormal,p),s=this.touchesSolid=!0)}if(s)for(let s of[.25,.5,.75]){this.samplePoint.lerpVectors(e,t,s),this.sampleBefore.copy(this.samplePoint),this.sampleNormal.set(0,0,0),this.projectPoint(this.sampleBefore,this.samplePoint,U.lerp(n,r,s),this.sampleNormal),this.sampleCorrection.subVectors(this.samplePoint,this.sampleBefore);let c=i?0:1-s,l=s,u=c*(1-s)+l*s;this.sampleCorrection.divideScalar(u).clampLength(0,.025),e.addScaledVector(this.sampleCorrection,c),t.addScaledVector(this.sampleCorrection,l),a.addScaledVector(this.sampleNormal,c),o.addScaledVector(this.sampleNormal,l)}return s}};Pr.prototype.computeBoundsTree=Qh,Y.prototype.raycast=Xh;var tg=function(e){return e[e.Ground=0]=`Ground`,e[e.Rock=1]=`Rock`,e[e.Wood=2]=`Wood`,e[e.Water=3]=`Water`,e[e.Cave=4]=`Cave`,e}({}),ng=class{tailContacts;nx;nz;height;top;roof;normal;kind;x0=-Z.w/2+.002;z0=-Z.d/2+.002;cell;ray=new jc;upward=new jc;sight=new jc;meshes;constructor(e,t,n=.004){this.cell=n,this.nx=Math.floor((Z.w-.004)/n)+1,this.nz=Math.floor((Z.d-.004)/n)+1,this.height=new Float32Array(this.nx*this.nz),this.top=new Float32Array(this.nx*this.nz),this.roof=new Uint8Array(this.nx*this.nz),this.normal=new Float32Array(this.nx*this.nz*3),this.kind=new Uint8Array(this.nx*this.nz);for(let e of t)e.mesh.updateMatrixWorld(!0),e.mesh.geometry.boundsTree||e.mesh.geometry.computeBoundsTree();this.meshes=t.map(e=>({...e,box:new Zn().setFromObject(e.mesh),normalMatrix:new Nt().getNormalMatrix(e.mesh.matrixWorld)})),this.ray.firstHitOnly=!0;let r=t.map(e=>new Zn().setFromObject(e.mesh)),i=new G,a=new G(0,-1,0),o=new Nt;for(let e=0;e<this.nz;e++)for(let s=0;s<this.nx;s++){let c=this.x0+s*n,l=this.z0+e*n,u=e*this.nx+s,d=Yf(c,l),f=Jf(c,l)<0?3:0,p=.002,m=new G(Yf(c-p,l)-Yf(c+p,l),2*p,Yf(c,l-p)-Yf(c,l+p)).normalize();for(let e=0;e<t.length;e++){let n=r[e];if(c<n.min.x||c>n.max.x||l<n.min.z||l>n.max.z||n.max.y<d)continue;i.set(c,n.max.y+.01,l),this.ray.set(i,a);let s=this.ray.intersectObject(t[e].mesh,!1)[0];s&&s.point.y>d&&(d=s.point.y,f=t[e].kind,o.getNormalMatrix(t[e].mesh.matrixWorld),m=s.face.normal.clone().applyMatrix3(o).normalize(),m.y<0&&m.negate())}this.height[u]=d,this.top[u]=d,this.normal.set([m.x,m.y,m.z],u*3),this.kind[u]=f}this.findCave(),this.tailContacts=new eg(t.map(e=>e.mesh),Yf,Gf)}findCave(){let e=new G(0,1,0),t=new G,n=Kf.x-Kf.rx-.03,r=Kf.x+Kf.rx+.03,i=Kf.z-Kf.rz-.03,a=Kf.mouth.z+Kf.mouth.rz+.03,o=.002;for(let s=0;s<this.nz;s++)for(let c=0;c<this.nx;c++){let l=this.x0+c*this.cell,u=this.z0+s*this.cell;if(l<n||l>r||u<i||u>a)continue;let d=Yf(l,u);t.set(l,d+.004,u),this.ray.set(t,e),this.ray.far=.19;let f=1/0;for(let e of this.meshes){if(e.kind===2)continue;let t=this.ray.intersectObject(e.mesh,!1)[0];t&&t.point.y<f&&(f=t.point.y)}if(this.ray.far=1/0,!Number.isFinite(f))continue;let p=s*this.nx+c;if(this.roof[p]=1,f-d<.026)continue;this.height[p]=d,this.kind[p]=4;let m=new G(Yf(l-o,u)-Yf(l+o,u),2*o,Yf(l,u-o)-Yf(l,u+o)).normalize();this.normal.set([m.x,m.y,m.z],p*3)}}idx(e,t){let n=Math.min(this.nx-1,Math.max(0,Math.round((e-this.x0)/this.cell)));return Math.min(this.nz-1,Math.max(0,Math.round((t-this.z0)/this.cell)))*this.nx+n}bilinear(e,t,n){let r=Math.min(this.nx-1.001,Math.max(0,(t-this.x0)/this.cell)),i=Math.min(this.nz-1.001,Math.max(0,(n-this.z0)/this.cell)),a=Math.floor(r),o=Math.floor(i),s=r-a,c=i-o,l=this.nx,u=e[o*l+a],d=e[o*l+a+1],f=e[(o+1)*l+a],p=e[(o+1)*l+a+1];return u+(d-u)*s+(f-u)*c+(u-d-f+p)*s*c}heightAt(e,t){return this.bilinear(this.height,e,t)}heightBelow(e,t,n){let r=this.heightAt(e,t);return r<=n||this.kindAt(e,t)===4?r:this.cast(e,t,n,{y:0,normal:new G}).y}topAt(e,t){return this.bilinear(this.top,e,t)}roofed(e,t){return this.roof[this.idx(e,t)]===1}normalAt(e,t,n=new G){let r=this.idx(e,t)*3;return n.set(this.normal[r],this.normal[r+1],this.normal[r+2])}kindAt(e,t){return this.kind[this.idx(e,t)]}supportAt(e,t,n,r){return this.cast(e,t,n,r)}cast(e,t,n,r){let i=Yf(e,t),a=.0015;r.normal.set(Yf(e-a,t)-Yf(e+a,t),2*a,Yf(e,t-a)-Yf(e,t+a)).normalize(),this.ray.set(new G(e,n,t),new G(0,-1,0)),this.ray.far=n-i+.001;for(let a of this.meshes){if(e<a.box.min.x||e>a.box.max.x||t<a.box.min.z||t>a.box.max.z||a.box.max.y<i)continue;let o=this.ray.intersectObject(a.mesh,!1)[0],s=e=>e.face.normal.clone().applyNormalMatrix(a.normalMatrix);if(o&&s(o).y<=.05){this.upward.set(new G(e,n,t),new G(0,1,0));let r=this.upward.intersectObject(a.mesh,!1)[0];o=r&&s(r).y>.05?r:void 0}o&&o.point.y>i&&(i=o.point.y,r.normal.copy(s(o)).normalize())}return this.ray.far=1/0,r.y=i,r}slopeAt(e,t){return 1-this.normalAt(e,t).y}visibleFrom(e,t){let n=t.clone().sub(e),r=n.length();return r<.006||(this.sight.set(e,n.divideScalar(r)),this.sight.near=.002,this.sight.far=r-.003,!this.meshes.some(e=>this.sight.ray.intersectsBox(e.box)&&this.sight.intersectObject(e.mesh,!1).length>0))}};function rg(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Pr,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=ig(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=ig(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function ig(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new br(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var ag={uKeyDirView:{value:new G(0,1,0)},uKeyColor:{value:new q(1,.85,.65)}},og=new WeakMap,sg=e=>og.get(e);function cg(e,t,n){let r=e.getAttribute(`position`).count;e.setAttribute(`plantShoot`,new J(new Float32Array(r).fill(t),1)),e.setAttribute(`plantFlex`,new J(Array.from({length:r},(e,t)=>n(t)),1))}var lg=class{group;shoots;bends;meshes=[];decorations;contacts=[];rotations;point=new G;closest=new G;direction=new G;q=new At;matrix=new K;position=new G;orientation=new At;scale=new G;bounds=new Zn;contactBounds=new Zn;reach=0;bendLimits;drawnBends;constructor(e,t,n=[]){this.group=e,this.shoots=t,this.bends=t.map(()=>0),this.drawnBends=t.map(()=>0),this.bendLimits=t.map(e=>e.maxBend),this.rotations=t.map(()=>new At);for(let t of e.children){if(!(t instanceof Y)||t instanceof ji)continue;let e=t.geometry,n=e.getAttribute(`plantFlex`),r=e.getAttribute(`plantShoot`);if(!n||!r)continue;let i=e.getAttribute(`position`),a=e.getAttribute(`normal`);this.meshes.push({mesh:t,rest:Float32Array.from(i.array),weights:n,shoots:r}),i.setUsage(Ke),a.setUsage(Ke);for(let e=0;e<i.count;e++)this.reach=Math.max(this.reach,this.point.fromBufferAttribute(i,e).length());e.boundingSphere=new Er(new G,this.reach+.01)}this.decorations=n.map(e=>({binding:e,rest:Array.from({length:e.mesh.count},(t,n)=>{let r=new K;return e.mesh.getMatrixAt(n,r),r})})),og.set(e,this)}weight(e){return U.smoothstep(e,.015,.22)}constrainToHardscape(e){let t=this.shoots.map(()=>new Map),n=(e,n,r)=>{let i=`${Math.round(n.x/.002)},${Math.round(n.y/.002)},${Math.round(n.z/.002)}`;t[e].set(i,{point:n.clone(),weight:this.weight(r)})};for(let e of this.meshes)for(let t=0;t<e.rest.length/3;t++)n(e.shoots.getX(t),this.point.fromArray(e.rest,t*3),e.weights.getX(t));for(let{binding:e,rest:t}of this.decorations)for(let r=0;r<t.length;r++)n(e.shoots[r],this.point.setFromMatrixPosition(t[r]),e.weights[r]);let r=0;for(let n=0;n<this.shoots.length;n++){let i=this.shoots[n],a=[...t[n].values()],o=t=>a.some(n=>(this.q.setFromAxisAngle(i.axis,t*n.weight),this.point.copy(n.point).applyQuaternion(this.q),this.point.y=Math.max(Math.min(.001,n.point.y),this.point.y),this.point.add(this.group.position),e(this.point,.0035)));if(o(0)){this.bendLimits[n]=0,r++;continue}let s=0,c=Math.ceil(i.maxBend/(Math.PI/180));for(let e=1;e<=c;e++){let t=i.maxBend*e/c;if(o(t))break;s=t}this.bendLimits[n]=s}return r}intersects(e,t){for(let n of this.contacts){this.direction.subVectors(n.b,n.a);let r=n.radius/(n.verticalRadius??n.radius);this.direction.y*=r;let i=this.direction.lengthSq();this.closest.subVectors(e,n.a),this.closest.y*=r;let a=i>1e-10?U.clamp(this.closest.dot(this.direction)/i,0,1):0;if(this.closest.addScaledVector(this.direction,-a),this.closest.lengthSq()<(n.radius+t)**2)return!0}return!1}update(e,t){if(!(e>0)||!Number.isFinite(e))return;this.contacts.length=0,this.bounds.setFromCenterAndSize(this.group.position,this.point.setScalar((this.reach+.025)*2));for(let e of t)this.contactBounds.makeEmpty().expandByPoint(e.a).expandByPoint(e.b).expandByScalar(e.radius+.012),this.bounds.intersectsBox(this.contactBounds)&&this.contacts.push({a:e.a.clone().sub(this.group.position),b:e.b.clone().sub(this.group.position),radius:e.radius,verticalRadius:e.verticalRadius});let n=!1;for(let t=0;t<this.shoots.length;t++){let r=this.shoots[t],i=0;if(this.contacts.length)for(let e=0;e<=24;e++){i=this.bendLimits[t]*e/24;let n=!1;for(let e=1;e<r.samples.length;e++)if(this.q.setFromAxisAngle(r.axis,i*this.weight(r.sampleWeights?.[e]??e/(r.samples.length-1))),this.point.copy(r.samples[e]).applyQuaternion(this.q),this.intersects(this.point,.008)){n=!0;break}if(!n)break}let a=this.bends[t],o=i>a?45:2.6;this.bends[t]=U.lerp(a,i,1-Math.exp(-o*e)),this.bends[t]<3e-5&&i===0&&(this.bends[t]=0),n||=Math.abs(this.bends[t]-this.drawnBends[t])>1e-6||this.bends[t]===0&&this.drawnBends[t]!==0,this.rotations[t].setFromAxisAngle(r.axis,this.bends[t])}if(n){this.drawnBends.splice(0,this.drawnBends.length,...this.bends);for(let e of this.meshes){let t=e.mesh.geometry,n=t.getAttribute(`position`),r=t.getAttribute(`normal`);for(let t=0;t<n.count;t++)this.q.identity().slerp(this.rotations[e.shoots.getX(t)],this.weight(e.weights.getX(t))),this.point.fromArray(e.rest,t*3).applyQuaternion(this.q),this.point.y=Math.max(Math.min(.001,e.rest[t*3+1]),this.point.y),n.setXYZ(t,this.point.x,this.point.y,this.point.z);t.computeVertexNormals(),n.needsUpdate=r.needsUpdate=!0}for(let{binding:e,rest:t}of this.decorations){for(let n=0;n<t.length;n++)t[n].decompose(this.position,this.orientation,this.scale),this.q.identity().slerp(this.rotations[e.shoots[n]],this.weight(e.weights[n])),this.position.applyQuaternion(this.q),this.position.y=Math.max(.001,this.position.y),this.orientation.premultiply(this.q),this.matrix.compose(this.position,this.orientation,this.scale),e.mesh.setMatrixAt(n,this.matrix);e.mesh.instanceMatrix.needsUpdate=!0,e.mesh.computeBoundingSphere()}}}},ug=Math.PI*2,dg=new G(0,1,0),fg={value:0};function pg(){let e=-Z.d/2,t=Z.d/2;return[wg(-.712,e+.17,.128,21),wg(.715,.23,.11,22),wg(-.015,e+.086,.108,23),wg(-.725,.28,.055,24),wg(.228,t-.116,.055,26),Og(-.74,0,.12,61),Og(-.066,e+.13,.174,62),Og(-.244,e+.093,.12,63),Eg(.682,e+.142,.278,.03,41),Eg(.741,-.31,.22,.025,42),Eg(.613,e+.087,.181,.022,43),Eg(.75,.16,.053,.027,44,!0)]}var mg={value:new Jt},hg={value:new Jt};async function gg(){let e=new Ks,t=await Promise.all([`aloe`,`cactus`].map(t=>e.loadAsync(`./plants/${t}-reference.png`)));for(let e of t)e.colorSpace=Be,e.anisotropy=8;mg.value=t[0],hg.value=t[1]}function _g(e){let t=new xs({map:Hf(512,1024,(t,n,r)=>{let i=t/512,a=n/1024,o=Vf(i*8,a*16,8,3,38),s=Bf(i*256,a*512,256,87),c=Math.sin(i*ug*48+o*3)*.014,l=.91+o*.16+c+(s-.5)*.07,u=e===`aloe`?U.smoothstep(Bf(i*45,a*90,45,14),.8,.97)*.2:0,d=e===`aloe`?[103,136,87]:e===`cactus`?[73,108,70]:[130,137,102];for(let e=0;e<3;e++)r[e]=d[e]*l+u*185}),bumpMap:Hf(256,512,(e,t,n)=>{let r=e/256,i=t/512;n[0]=n[1]=n[2]=126+(Bf(r*128,i*256,128,65)-.5)*36+Math.sin(r*ug*48)*5},!1),bumpScale:e===`sage`?11e-5:8e-5,roughness:e===`sage`?.96:.81,clearcoat:e===`sage`?0:.055,clearcoatRoughness:.77,vertexColors:!0,side:2});return e!==`sage`&&(t.onBeforeCompile=t=>{t.uniforms.uPlantPhoto=e===`aloe`?mg:hg,t.uniforms.uPlantLight=fg,t.uniforms.uPlantKeyDir=ag.uKeyDirView,t.uniforms.uPlantKeyColor=ag.uKeyColor,t.vertexShader=t.vertexShader.replace(`#include <common>`,`#include <common>
varying vec2 vPlantUv;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vPlantUv=uv;`);let n=e===`aloe`?`vec4(.7422,.1016,.1465,.1465)`:`vec4(.6087,.5410,.0944,.0830)`;t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec2 vPlantUv;
uniform sampler2D uPlantPhoto;
uniform float uPlantLight;
uniform vec3 uPlantKeyDir;
uniform vec3 uPlantKeyColor;`).replace(`#include <color_fragment>`,`#include <color_fragment>
vec4 plantRoi=${n};
vec3 plantPhoto=texture2D(uPlantPhoto,plantRoi.xy+vPlantUv*plantRoi.zw).rgb;
diffuseColor.rgb=mix(diffuseColor.rgb,plantPhoto*vColor.rgb,${e===`aloe`?`.64`:`.52`});`),e===`aloe`&&(t.fragmentShader=t.fragmentShader.replace(`#include <lights_fragment_end>`,`#include <lights_fragment_end>
float throughLeaf=pow(max(0.,dot(-normal,uPlantKeyDir)),2.);
reflectedLight.indirectDiffuse+=diffuseColor.rgb*uPlantKeyColor*throughLeaf*uPlantLight*.14;`))},t.customProgramCacheKey=()=>`desert-${e}-photo-surface-v1`),t}var vg;function yg(){let e=Hf(128,256,(e,t,n)=>{let r=.75+Vf(e/16,t/32,8,3,12)*.35+Math.sin(e*2.8+t*.04)*.065;n[0]=129*r,n[1]=113*r,n[2]=87*r});return{aloe:_g(`aloe`),cactus:_g(`cactus`),sage:_g(`sage`),bark:new bs({map:e,roughness:.97}),teeth:new bs({color:14274466,roughness:.89}),areoles:new bs({color:13682091,roughness:1}),needles:new bs({color:12164718,roughness:.78}),seeds:new bs({color:10389083,roughness:.94})}}var bg=()=>vg??=yg();function xg(e,t,n,r){if(!e.length)return;let i=new Y(rg(e),t);i.name=r,i.castShadow=i.receiveShadow=!0,n.add(i);for(let t of e)t.dispose();return i}function Sg(e,t,n,r,i){if(!n.length){e.dispose();return}let a=new ji(e,t,n.length);return a.name=i,n.forEach((e,t)=>a.setMatrixAt(t,e)),a.castShadow=a.receiveShadow=!0,r.add(a),a}function Cg(e,t,n){return new K().compose(e,new At().setFromUnitVectors(dg,t.clone().normalize()),n)}function wg(e,t,n,r){let i=new On,a=Rf(r),o=[],s=[],c=[],l=[],u=[];i.name=`photographic-aloe-rosette`,i.position.set(e,Yf(e,t),t);let d=n>.09?22:17;for(let i=0;i<d;i++){let f=i/d,p=i*2.39996+r*.2+(a()-.5)*.2,m=n*(.66+f*.28)*(.88+a()*.14),h=.28+f*.91+(a()-.5)*.12,g=m*Math.cos(h),_=Math.cos(p),v=Math.sin(p),y=.009;_>0&&(g=Math.min(g,(Z.w/2-y-e)/_)),_<0&&(g=Math.min(g,(-Z.w/2+y-e)/_)),v>0&&(g=Math.min(g,(Z.d/2-y-t)/v)),v<0&&(g=Math.min(g,(-Z.d/2+y-t)/v));let b=m*(.105+a()*.027),x=m*.044,S=f<.3&&a()<.65,C=.89+a()*.12,w=(e,t,n=!1)=>{let r=Math.max(35e-6,Math.sin(Math.PI*(.05+e*.95))**.7*b*(1-e*.52)),i=.003*(1-f)+g*e,a=.003+f*.006+m*Math.sin(h)*e-m*(1-f)*.16*e*e,o=x*(.3+.7*Math.sin(Math.PI*e))*(1-e*.92),s=n?-o*Math.sqrt(Math.max(0,1-t*t)):r*t*t*.23+o*.2;return new G(_*i-v*r*t,a+s,v*i+_*r*t)},T=[],E=[],D=[],O=[];for(let e of[!1,!0])for(let t=0;t<=22;t++)for(let n=0;n<=6;n++){let r=t/22,i=w(r,n/6*2-1,e);T.push(i.x,i.y,i.z),E.push(n/6,r);let a=S?U.smoothstep(r,.87,1):0;D.push(C*(1-a*.08),C*(1-a*.36),C*(1-a*.63))}for(let e=0;e<22;e++)for(let t=0;t<6;t++){let n=e*7+t,r=n+7;O.push(n,n+1,r,n+1,r+1,r),O.push(n+161,r+161,n+1+161,n+1+161,r+161,r+1+161)}for(let e=0;e<22;e++)for(let t of[0,6]){let n=e*7+t,r=n+7;t===0?O.push(n,r,n+161,r,r+161,n+161):O.push(n,n+161,r,r,n+161,r+161)}for(let e of[0,22])for(let t=0;t<6;t++){let n=e*7+t;e===0?O.push(n,n+161,n+1,n+1,n+161,n+161+1):O.push(n,n+1,n+161,n+1,n+161+1,n+161)}let k=new Pr;k.setAttribute(`position`,new J(T,3)),k.setAttribute(`uv`,new J(E,2)),k.setAttribute(`color`,new J(D,3)),k.setIndex(O),k.computeVertexNormals(),o.push(k),cg(k,i,e=>k.getAttribute(`uv`).getY(e)),c.push({axis:new G(v,0,-_),samples:Array.from({length:15},(e,t)=>w(t/14,0)),maxBend:h+.07});for(let e=0;e<10;e++)for(let t of[-1,1]){let r=.14+e*.075,o=w(r,t),c=new G(-v*t,.3,_*t).normalize(),d=n*(.01+a()*.004)*(1-r*.4);s.push(Cg(o.addScaledVector(c,d*.45),c,new G(1,d,1))),l.push(i),u.push(r)}}return xg(o,bg().aloe,i,`fleshy-curved-aloe-leaves`),new lg(i,c,[{mesh:Sg(new La(n*.0018,1,5),bg().teeth,s,i,`fine-aloe-margin-teeth`),shoots:l,weights:u}]),i}function Tg(e,t,n,r){let i=[],a=new xs({color:12274849,roughness:.75,side:2});for(let n=0;n<32;n++){let r=Math.floor(n/11),a=n*2.39996,o=e*(.87-r*.15),s=[],c=[],l=[];for(let n=0;n<=12;n++)for(let i of[-1,0,1]){let l=n/12,u=Math.sin(l*Math.PI)**.75*e*.15,d=e*.12+o*l;s.push(Math.cos(a)*d-Math.sin(a)*u*i,t+.002+l*o*(.28+r*.38)+u*i*i*.2,Math.sin(a)*d+Math.cos(a)*u*i),c.push(i*.5+.5,l)}for(let e=0;e<12;e++)for(let t=0;t<2;t++){let n=e*3+t;l.push(n,n+1,n+3,n+1,n+4,n+3)}let u=new Pr;u.setAttribute(`position`,new J(s,3)),u.setAttribute(`uv`,new J(c,2)),u.setIndex(l),u.computeVertexNormals(),i.push(u)}xg(i,a,n,`layered-cactus-flower-petals`);let o=[];for(let n=0;n<28;n++){let i=n*2.4,a=Math.sqrt(r())*e*.18;o.push(Cg(new G(Math.cos(i)*a,t+.006,Math.sin(i)*a),dg,new G(1,.003+r()*.002,1)))}Sg(new La(3e-4,1,5),new bs({color:14992750,roughness:.8}),o,n,`golden-flower-stamens`)}function Eg(e,t,n,r,i,a=!1){let o=new On,s=Rf(i),c=a?13:12;o.name=`photographic-ribbed-cactus`,o.position.set(e,Yf(e,t),t);let l=i*.13,u=(s()-.5)*.009,d=(s()-.5)*.007,f=e=>Math.sqrt(Math.max(4e-4,1-Math.max(0,(e-.78)/.22)**2))*(.92+.055*Math.sin(e*3.5+i)),p=(e,t)=>{let i=r*f(e)*(1+.115*Math.cos((t-l)*c));return new G(Math.cos(t)*i+u*e*e,e*n,Math.sin(t)*i+d*e*e)},m=[],h=[],g=[],_=[];for(let e=0;e<=56;e++)for(let t=0;t<=96;t++){let n=e/56,r=(t===96?0:t/96)*ug,a=p(n,r);m.push(a.x,a.y,a.z),h.push(t/96,n);let o=(1-U.smoothstep(n,.025,.16))*(.25+.4*Math.max(0,Math.sin(r*5+i))),s=.91+Math.sin(r*3+i)*.055;g.push(s*(1+o*.48),s*(1-o*.1),s*(1-o*.39))}for(let e=0;e<56;e++)for(let t=0;t<96;t++){let n=e*97+t;_.push(n,n+96+1,n+1,n+1,n+96+1,n+96+2)}let v=new Pr;v.setAttribute(`position`,new J(m,3)),v.setAttribute(`uv`,new J(h,2)),v.setAttribute(`color`,new J(g,3)),v.setIndex(_),v.computeVertexNormals();let y=new Y(v,bg().cactus);y.name=`rounded-cactus-ribs`,y.castShadow=y.receiveShadow=!0,o.add(y);let b=[],x=[],S=Math.max(5,Math.round(n/.014));for(let e=0;e<c;e++)for(let t=1;t<S;t++){let n=(t+e%2*.28+(s()-.5)*.12)/S;if(n>.98)continue;let r=e/c*ug+l,i=p(n,r),o=new G(Math.cos(r),U.smoothstep(n,.82,1)*1.3,Math.sin(r)).normalize();b.push(Cg(i.clone().addScaledVector(o,55e-5),o,new G(.0012,65e-5,.00145)));let u=new G(0,1,0).addScaledVector(o,-o.y).normalize(),d=new G().crossVectors(o,u).normalize();for(let e=0;e<7;e++){let t=e/6*ug+s()*.15,n=e===6?o.clone():o.clone().multiplyScalar(.45).addScaledVector(u,Math.cos(t)).addScaledVector(d,Math.sin(t)).normalize(),r=(.0038+s()*.0027)*(a?.8:1);x.push(Cg(i.clone().addScaledVector(o,.001).addScaledVector(n,r*.48),n,new G(1,r,1)))}}return Sg(new rs(1,0),bg().areoles,b,o,`woolly-cactus-areoles`),Sg(new La(14e-5,1,5),bg().needles,x,o,`straw-radial-cactus-spines`),a&&Tg(r,n,o,s),o}function Dg(e,t){let n=new ls(e,9,t,5,!1),r=n.getAttribute(`position`);for(let t=0;t<=9;t++){let n=e.getPoint(t/9),i=1-t/9*.75;for(let e=0;e<=5;e++){let a=t*6+e;r.setXYZ(a,n.x+(r.getX(a)-n.x)*i,n.y+(r.getY(a)-n.y)*i,n.z+(r.getZ(a)-n.z)*i)}}return n.computeVertexNormals(),n}function Og(e,t,n,r){let i=new On,a=Rf(r),o=[],s=[],c=[],l=[],u=[],d=[];i.name=`photographic-desert-shrub`,i.position.set(e,Yf(e,t),t);let f=(e,t,n,r)=>{let i=[],a=[],o=[],c=[],l=new G().crossVectors(t,dg).normalize();for(let s=0;s<=10;s++)for(let c of[-1,0,1]){let u=s/10,d=Math.sin(Math.PI*u)**.65*n*.09,f=e.clone().addScaledVector(t,n*u).addScaledVector(l,d*c);f.y+=Math.sin(u*Math.PI)*n*.16+d*c*c*.38,i.push(f.x,f.y,f.z),a.push(c*.5+.5,u),o.push(r?.98:.83,r?.78:.88,r?.48:.81)}for(let e=0;e<10;e++)for(let t=0;t<2;t++){let n=e*3+t;c.push(n,n+1,n+3,n+1,n+4,n+3)}let u=new Pr;u.setAttribute(`position`,new J(i,3)),u.setAttribute(`uv`,new J(a,2)),u.setAttribute(`color`,new J(o,3)),u.setIndex(c),u.computeVertexNormals(),s.push(u)};for(let e=0;e<18;e++){let t=o.length,r=s.length,i=e*2.4+a()*.5,p=n*(.38+a()*.62),m=p*(.27+a()*.16),h=new Ja([new G((a()-.5)*.009,0,(a()-.5)*.009),new G(Math.cos(i)*m*.3,p*.48,Math.sin(i)*m*.3),new G(Math.cos(i)*m,p,Math.sin(i)*m)]),g=h.getPoints(14);o.push(Dg(h,8e-4+a()*4e-4));for(let t=0;t<4;t++){let r=.27+t*.17,l=h.getPoint(r),m=i+(t%2?1:-1)*(.65+a()*.7),_=new G(Math.cos(m)*.72,.52+a()*.4,Math.sin(m)*.72).normalize(),v=n*(.1+a()*.13),y=l.clone().addScaledVector(_,v),b=new Ja([l,l.clone().lerp(y,.5).add(new G(0,.003,0)),y]);g.push(y.clone()),o.push(Dg(b,42e-5));for(let e=0;e<3;e++){let t=b.getPoint(.25+e*.25),n=m+(e%2?.7:-.7);f(t,new G(Math.cos(n),.24+a()*.5,Math.sin(n)).normalize(),.009+a()*.008,a()<.35);let r=s[s.length-1].getAttribute(`position`);g.push(new G().fromBufferAttribute(r,r.count-2))}if(a()<.45)for(let t=0;t<5;t++){let t=y.clone().add(new G((a()-.5)*.004,a()*.009,(a()-.5)*.004));c.push(Cg(t,_,new G(8e-4,.0014,8e-4))),u.push(e),d.push(t.y/p)}}for(let n of[...o.slice(t),...s.slice(r)])cg(n,e,e=>n.getAttribute(`position`).getY(e)/p);l.push({axis:new G(Math.sin(i),0,-Math.cos(i)),samples:g,sampleWeights:g.map(e=>e.y/p),maxBend:Math.atan2(p,m)+.07})}return xg(o,bg().bark,i,`tapered-branching-dry-twigs`),xg(s,bg().sage,i,`curled-silver-olive-leaves`),new lg(i,l,[{mesh:Sg(new rs(1,0),bg().seeds,c,i,`papery-dry-seed-clusters`),shoots:u,weights:d}]),i}var kg=Math.PI*2,Ag=e=>e-Math.floor(e);function jg(e){let t=e.image,n=document.createElement(`canvas`);n.width=t.width,n.height=t.height;let r=n.getContext(`2d`,{willReadFrequently:!0});r.drawImage(t,0,0);let{data:i,width:a,height:o}=r.getImageData(0,0,n.width,n.height);return(e,t)=>{let n=Ag(e)*a-.5,r=(1-Ag(t))*o-.5,s=Math.floor(n),c=Math.floor(r),l=n-s,u=r-c,d=(e,t)=>i[((t%o+o)%o*a+(e%a+a)%a)*4]/255;return U.lerp(U.lerp(d(s,c),d(s+1,c),l),U.lerp(d(s,c+1),d(s+1,c+1),l),u)}}function Mg(){let e=(e,t)=>{let n=e/512,r=t/512,i=n-.43,a=(r-.56)*1.08,o=Math.hypot(i,a),s=Math.atan2(a,i),c=Vf(n*8,r*8,8,3,71);return{rings:Math.sin(o*218+c*5+Math.sin(s*3)*.7),split:Math.max(0,Math.cos(s*5+c*.7))**160*U.smoothstep(o,.16,.44),fibres:Vf(n*128,r*128,128,2,19)}};return new bs({map:Hf(512,512,(t,n,r)=>{let i=e(t,n),a=.92+i.rings*.05+(i.fibres-.5)*.15-i.split*.56;r[0]=157*a,r[1]=142*a,r[2]=120*a}),bumpMap:Hf(512,512,(t,n,r)=>{let i=e(t,n);r[0]=r[1]=r[2]=150+i.rings*9+i.fibres*26-i.split*108},!1),bumpScale:7e-4,roughness:.87})}function Ng(e,t=()=>1){let n=[],r=Mg(),i=(e,t,n)=>new G(e,t,n),a=(i,a,o,s,c=!1)=>{let l=new Ja(i),u=Math.max(40,Math.ceil(l.getLength()/.0035)),d=l.computeFrenetFrames(u,!1),f=[],p=[],m=[],h=0,g=l.getPoint(0);for(let e=0;e<=u;e++){let n=e/u,r=l.getPoint(n);h+=r.distanceTo(g),g=r;let i=U.lerp(a,o,n)*(c?1+.07*Math.exp(-(((n-.65)/.15)**2)):U.lerp(.42,1,U.smoothstep(n,0,.18))+.07*Math.exp(-(((n-.2)/.09)**2)))*(1+.07*Math.sin(n*9+s)+.03*Math.sin(n*23+s*1.7)),m=h/.26+s*.173,_=U.smoothstep(n,.91,1);for(let a=0;a<=80;a++){let c=(a===80?0:a/80)*kg,l=a/80+s*.137,u=i*(1+.022*Math.sin(c*5+n*3+s)+.014*Math.sin(c*11-n*4))-(1-t(l,m))*Math.min(.0022,o*.12),h=(.4*Math.sin(c*7+s)+.28*Math.sin(c*13-s)+.2*Math.sin(c*23+s*.3))*Math.min(.01,o*.5)*_,g=r.clone().addScaledVector(d.normals[e],Math.cos(c)*u).addScaledVector(d.binormals[e],Math.sin(c)*u).addScaledVector(d.tangents[e],h);f.push(g.x,g.y,g.z),p.push(l,m)}}for(let e=0;e<u;e++)for(let t=0;t<80;t++){let n=e*81+t;m.push(n,n+1,n+80+1,n+1,n+80+2,n+80+1)}let _=m.length;for(let e of[0,u]){let t=l.getPoint(e/u).addScaledVector(d.tangents[e],e?-.003:0),n=f.length/3,r=s*1.37;f.push(t.x,t.y,t.z),p.push(.5,.5);let i=f.length/3;for(let n=1;n<=5;n++)for(let i=0;i<=80;i++){let a=(e*81+i)*3,o=n/5,s=t.clone().lerp(new G(f[a],f[a+1],f[a+2]),o),c=(i===80?0:i/80)*kg+r;f.push(s.x,s.y,s.z),p.push(.5+Math.cos(c)*o*.47,.5+Math.sin(c)*o*.47)}let a=(t,n,r)=>e?m.push(t,n,r):m.push(t,r,n);for(let e=0;e<80;e++)a(n,i+e,i+e+1);for(let e=0;e<4;e++)for(let t=0;t<80;t++){let n=i+e*81+t,r=n+80+1;a(n,r,r+1),a(n,r+1,n+1)}}let v=new Pr;v.setAttribute(`position`,new J(f,3)),v.setAttribute(`uv`,new J(p,2)),v.setIndex(m),v.addGroup(0,_,0),v.addGroup(_,m.length-_,1),v.computeVertexNormals();let y=v.getAttribute(`normal`),b=new G;for(let e=0;e<=u;e++){let t=e*81,n=t+80;b.fromBufferAttribute(y,t).add(new G().fromBufferAttribute(y,n)).normalize(),y.setXYZ(t,b.x,b.y,b.z),y.setXYZ(n,b.x,b.y,b.z)}let x=new Y(v,[e,r]);x.castShadow=x.receiveShadow=!0,x.name=`weathered-solid-driftwood`,n.push(x)};return a([i(.33,.089,.153),i(.2,.171,.1),i(.08,.277,.01),i(-.07,.371,-.082),i(-.12,.507,-.108)],.046,.022,11,!0),a([i(.03,.315,-.02),i(.1,.376,-.075),i(.245,.402,-.094)],.033,.019,15),a([i(-.041,.349,-.064),i(-.188,.435,-.092),i(-.227,.489,-.111)],.032,.012,16),a([i(-.085,.402,-.082),i(-.035,.466,-.105),i(.029,.501,-.113)],.024,.01,17),a([i(.132,.23,.049),i(.221,.12,.048),i(.352,.077,.061)],.031,.012,18),a([i(.272,.122,.135),i(.395,.084,.176),i(.432,.076,.163)],.024,.008,19),n}async function Pg(){let e=new Ks,[t,n,r,a]=await Promise.all([`diff`,`nor_gl`,`arm`,`disp`].map(t=>e.loadAsync(`./materials/rough_wood/rough_wood_${t}_2k.jpg`)));for(let e of[t,n,r])e.wrapS=e.wrapT=i,e.anisotropy=8;t.colorSpace=Be,n.colorSpace=r.colorSpace=a.colorSpace=``,r.channel=0;let o=new bs({map:t,normalMap:n,normalScale:new W(.65,.65),roughnessMap:r,roughness:1,aoMap:r,aoMapIntensity:.75,metalness:0});o.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
roughnessFactor = 0.68 + roughnessFactor * 0.30;`)},o.customProgramCacheKey=()=>`dry-weathered-wood-pbr-v1`;let s=Ng(o,jg(a));return a.dispose(),s}var Fg=(e,t,n)=>Math.sin(e*37+n*19+t*63)*Math.sin(e*71-n*43+t*97);function Ig(e,t,n,r,i,a){let o=new go,s=e/2,c=n/2;o.moveTo(-c,0),o.lineTo(-s,0);for(let e=0;e<=48;e++){let n=Math.PI-e/48*Math.PI,r=1+.022*Math.sin(n*17+a)+.012*Math.sin(n*31);o.lineTo(Math.cos(n)*s*r,Math.sin(n)*t*r)}o.lineTo(c,0);for(let e=0;e<=48;e++){let t=e/48*Math.PI;o.lineTo(Math.cos(t)*c,Math.sin(t)*r)}let l=new es(o,{depth:i,steps:12,bevelEnabled:!0,bevelThickness:.004,bevelSize:.004,bevelSegments:2}),u=l.attributes.position;for(let e=0;e<u.count;e++){let t=u.getX(e),n=u.getY(e),r=u.getZ(e),i=Fg(t*2+a,n*2,r*2)*.009,o=.004*Math.sin(t*141+n*103+a);u.setXYZ(e,t+i,n+Math.min(1,n/.02)*i*.55,r+i*.5+o)}return l.computeVertexNormals(),l}function Lg(e,t){let n=new go,r=e/2+.015,i=t+.012;n.moveTo(-r,0);for(let e=0;e<=48;e++){let t=Math.PI-e/48*Math.PI;n.lineTo(Math.cos(t)*r,Math.sin(t)*i)}return n.lineTo(-r,0),new es(n,{depth:.008,steps:1,bevelEnabled:!1})}function Rg(){let e=[],t=[],n=new W(-.4,.055),r=new W(.075,.23).clone().sub(n),i=new W(-r.y,r.x).normalize();for(let t=0;t<2;t++)for(let a=0;a<=64;a++)for(let o=0;o<=20;o++){let s=a/64,c=o/20*2-1,l=(.119-.021*s)*(1+.035*Math.sin(s*27)+.018*Math.sin(s*63)),u=n.x+r.x*s+i.x*c*l,d=n.y+r.y*s+i.y*c*l,f=Yf(u,d),p=s*s*(3-2*s),m=.273*(1-p)+(f-.002)*p,h=Math.max(0,(Math.abs(c)-.82)/.18),g=m+65e-5*Math.sin(s*91+c*9)*Math.sin(s*35-c*7)*Math.sin(Math.PI*s)-h*h*Math.min(.008,(m-f)*.35);e.push(u,t?Math.max(.062,g-.027):g,d)}let a=1365;for(let e=0;e<64;e++)for(let n=0;n<20;n++){let r=e*21+n,i=r+21,o=i+1,s=r+1;t.push(r,s,i,i,s,o,r+a,i+a,s+a,i+a,o+a,s+a)}let o=[];for(let e=0;e<=64;e++)o.push(e*21);for(let e=1;e<=20;e++)o.push(1344+e);for(let e=63;e>=0;e--)o.push(e*21+20);for(let e=19;e>0;e--)o.push(e);for(let e=0;e<o.length;e++){let n=o[e],r=o[(e+1)%o.length];t.push(n,r,n+a,r,r+a,n+a)}let s=new Pr;return s.setAttribute(`position`,new J(e,3)),s.setIndex(t),s.computeVertexNormals(),s}new G(0,1,0);var zg=(e,t,n)=>Math.sin(e*37+n*19+t*63)*Math.sin(e*71-n*43+t*97);function Bg(){let e=new bs({color:13674361,roughness:.93,side:2}),t;return e.userData.ready=new Promise((e,n)=>{t=new Ks().load(`./sandstone-v2.png`,()=>e(),void 0,n),t.colorSpace=Be,t.wrapS=t.wrapT=i,t.anisotropy=8}),e.userData.photo=t,e.onBeforeCompile=e=>{e.uniforms.uStonePhoto={value:t},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vStone; varying vec3 vStoneNormal;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vStone = position; vStoneNormal=normal;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vStone;
varying vec3 vStoneNormal;
uniform sampler2D uStonePhoto;
float sh(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float sn(vec3 p){vec3 i=floor(p), f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(sh(i),sh(i+vec3(1,0,0)),f.x),mix(sh(i+vec3(0,1,0)),sh(i+vec3(1,1,0)),f.x),f.y),mix(mix(sh(i+vec3(0,0,1)),sh(i+vec3(1,0,1)),f.x),mix(sh(i+vec3(0,1,1)),sh(i+vec3(1,1,1)),f.x),f.y),f.z);}
`).replace(`#include <color_fragment>`,`#include <color_fragment>
float strata = sin(vStone.y*610. + sn(vStone*70.)*3.4);
float grain = sn(vStone*1500.);
float pit = smoothstep(.77,.96,sh(floor(vStone*2200.)));
diffuseColor.rgb *= .81 + .20*sn(vStone*48.) + .035*grain + .045*strata - .08*pit;
diffuseColor.rgb = mix(diffuseColor.rgb,vec3(.30,.16,.07),smoothstep(.86,.99,sn(vStone*130.))*.22);
vec3 sw=pow(abs(normalize(vStoneNormal)),vec3(4.));sw/=max(.001,sw.x+sw.y+sw.z);
vec3 stonePhoto=texture2D(uStonePhoto,vStone.yz*4.).rgb*sw.x+texture2D(uStonePhoto,vStone.xz*4.).rgb*sw.y+texture2D(uStonePhoto,vStone.xy*4.).rgb*sw.z;
diffuseColor.rgb=mix(diffuseColor.rgb,stonePhoto,.86);
`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
vec3 sx=dFdx(-vViewPosition), sy=dFdy(-vViewPosition);
float bump=sn(vStone*330.)*.0011 + grain*.0001 + strata*.00016;
vec3 bx=cross(sy,normal), by=cross(normal,sx);
float bd=dot(sx,bx);
normal=normalize(abs(bd)*normal-sign(bd)*(dFdx(bump)*bx+dFdy(bump)*by));`)},e.customProgramCacheKey=()=>`desert-sandstone-v1`,e}function Vg(e,t,n,r){let i=Rf(r),a=[],o=[],s=Array.from({length:12},()=>.82+i()*.18),c=Array.from({length:56},(e,t)=>{let n=t/56*s.length,r=Math.floor(n),i=n-r;return s[r]*(1-i)+s[(r+1)%s.length]*i});for(let i=0;i<=8;i++)for(let o=0;o<56;o++){let s=o*Math.PI*2/56,l=i/8,u=.88+.1*Math.sin(l*Math.PI)+.03*Math.sin(s*7+r)+.045*Math.sin(i*3.1+s*9),d=c[o]*u,f=Math.cos(s),p=Math.sin(s);a.push(Math.sign(f)*Math.abs(f)**.76*e*d,(l-.5)*n+(i===8?.002*Math.sin(s*11+r):.003*Math.sin(s*5+i*1.7)),Math.sign(p)*Math.abs(p)**.78*t*d)}for(let e=0;e<8;e++)for(let t=0;t<56;t++){let n=e*56+t,r=e*56+(t+1)%56,i=n+56,a=r+56;o.push(n,i,r,r,i,a)}let l=a.length/3;a.push(0,n/2,0);let u=a.length/3;a.push(0,-n/2,0);for(let e=0;e<56;e++)o.push(l,448+(e+1)%56,448+e),o.push(u,e,(e+1)%56);let d=new Pr;return d.setAttribute(`position`,new J(a,3)),d.setIndex(o),d.computeVertexNormals(),d}var Hg=class{group=new On;panes=new On;hard=[];plants=[];obstacles=[{x:-.075,z:-.085,r:.066},{x:.018,z:-.035,r:.049},{x:.68,z:-Z.d/2+.14,r:.05}];ground;warm;daylight;bulbs=[];readout;water;stonePhoto;ready;ripples=[];constructor(){let e=this.group,t=Z.d/2,n=-Z.d/2,r=new bs({color:1185303,roughness:.3,metalness:.72}),i=new bs({color:4344139,roughness:.35,metalness:.9}),a=Bg();this.stonePhoto=a.userData.photo;let o=(t,n,i,a,o,s,c=r)=>{let l=new Y(new Lf(t,n,i,2,.003),c);return l.position.set(a,o,s),l.castShadow=l.receiveShadow=!0,e.add(l),l};o(Z.w+.045,.064,Z.d+.035,0,.011,0);for(let e of[-Z.d/2,Z.d/2])o(Z.w+.045,.026,.025,0,Z.h,e);for(let e of[-Z.w/2,Z.w/2])o(.025,.026,Z.d,e,Z.h,0);for(let e of[-Z.w/2,Z.w/2])for(let t of[-Z.d/2,Z.d/2])o(.015,Z.h,.015,e,Z.h/2,t);for(let e of[-Z.d/2,Z.d/2])o(Z.w,.019,.012,0,.045,e),o(Z.w,.02,.018,0,Z.h-.027,e);let s=new xs({color:8428712,transparent:!0,opacity:.07,roughness:.08,metalness:0,side:2,depthWrite:!1});for(let e of[-Z.w/2,Z.w/2]){let t=new Y(new as(Z.d,Z.h-.08),s);t.rotation.y=Math.PI/2,t.position.set(e,Z.h/2+.014,0),this.panes.add(t)}let c=new Y(new as(Z.w-.023,Z.h-.08),s);c.position.set(0,Z.h/2+.014,Z.d/2),c.material=s.clone(),c.material.opacity=.015,this.panes.add(c);let l=new sa({color:2435886,transparent:!0,opacity:.65}),u=[];for(let e=-Z.w/2;e<Z.w/2;e+=.012)u.push(e,Z.h-.012,-Z.d/2,e,Z.h-.012,Z.d/2);for(let e=-Z.d/2;e<Z.d/2;e+=.012)u.push(-Z.w/2,Z.h-.012,e,Z.w/2,Z.h-.012,e);let d=new Pr;d.setAttribute(`position`,new J(u,3)),e.add(new ya(d,l));let f=new Y(new as(Z.w-.021,Z.h-.06),new bs({color:9542289,roughness:1}));f.position.set(0,Z.h/2+.007,-Z.d/2+.004),e.add(f);let p=new Ks().loadAsync(`./desert-panorama-v2.png`).then(t=>{t.colorSpace=Be,t.anisotropy=8,f.material=new bs({map:t,roughness:1,color:15064784});for(let n of[-1,1]){let r=t.clone();r.repeat.set(.15,1),r.offset.set(n<0?0:.85,0);let i=new Y(new as(Z.d-.012,Z.h-.06),new bs({map:r,roughness:1,color:13091509}));i.rotation.y=n<0?Math.PI/2:-Math.PI/2,i.position.set(n*(Z.w/2-.01),Z.h/2+.007,-.003),e.add(i)}}),m=Hf(512,512,(e,t,n)=>{let r=.86+Vf(e/32,t/32,16,4,32)*.17+zg(e,t,3)*.07;n[0]=213*r,n[1]=177*r,n[2]=126*r});m.repeat.set(12,Z.d/.12);let h=Hf(512,512,(e,t,n)=>{n[0]=n[1]=n[2]=100+Math.sin(e*127.1+t*311.7)*55},!1);h.repeat.set(13,Z.d/.12);let g=new bs({map:m,bumpMap:h,bumpScale:.0012,roughness:.97}),_=new as(Z.w-.014,Z.d-.014,220,Math.ceil((Z.d-.014)/.0072));_.rotateX(-Math.PI/2);let v=_.attributes.position;for(let e=0;e<v.count;e++)v.setY(e,Yf(v.getX(e),v.getZ(e)));_.computeVertexNormals(),this.ground=new Y(_,g),this.ground.receiveShadow=!0,e.add(this.ground),o(Z.w-.018,.035,Z.d-.018,0,.058,0,g);let y=(t,n,r,i,o,s,c,l=!0,u=0)=>{let d=Vg(i,o,s,c);if(u){let e=d.attributes.position;for(let t=0;t<e.count;t++)e.setY(t,e.getY(t)+e.getX(t)*u);d.computeVertexNormals()}let f=new Y(d,a);return f.position.set(t,n,r),f.castShadow=f.receiveShadow=!0,e.add(f),l&&this.hard.push({mesh:f,kind:tg.Rock}),f},b=new Y(Ig(.42,.15,.22,.112,.24,5),a);b.position.set(-.46,.073,-.072),b.castShadow=b.receiveShadow=!0,e.add(b),this.hard.push({mesh:b,kind:tg.Rock});let x=new bs({color:3614488,roughness:1}),S=(t,n,r)=>{let i=new Y(Lg(n,r),x);i.name=`inset-curved-cave-back`,i.position.copy(t.position),i.position.z+=.006,i.castShadow=i.receiveShadow=!0,e.add(i),this.hard.push({mesh:i,kind:tg.Rock})};S(b,.22,.112),y(-.46,.226,.048,.253,.168,.049,3),y(-.48,.262,.025,.232,.147,.025,83),y(-.655,.108,.155,.085,.098,.045,13);let C=new Y(Rg(),a);C.name=`worn-climbing-sandstone`,C.castShadow=C.receiveShadow=!0,e.add(C),this.hard.push({mesh:C,kind:tg.Rock}),y(-.59,.191,-.096,.12,.087,.03,17);let w=new Y(Ig(.38,.205,.218,.143,.23,41),a);w.position.set(.475,.073,-.16),w.castShadow=w.receiveShadow=!0,e.add(w),this.hard.push({mesh:w,kind:tg.Rock}),S(w,.218,.143),y(.45,.269,-.045,.155,.124,.043,29);for(let[t,n,r,i]of[[-.46,.033,.215,.2],[.475,-.045,.205,.21]]){let a=new Y(new as(r,i),x);a.rotation.x=-Math.PI/2,a.position.set(t,Yf(t,n)+.001,n),a.receiveShadow=!0,e.add(a)}y(.659,.093,.058,.069,.078,.029,72),y(-.709,.089,t-.049,.077,.047,.026,18),y(.72,.087,-.25,.063,.029,.025,67);let T=Rf(51),E=Math.round(290*Z.d/.6),D=new ji(new rs(1,1),a,E),O=new K,k=new At;for(let e=0;e<E;e++){let t=(T()-.5)*(Z.w-.04),n=(T()-.5)*(Z.d-.05),r=.0012+T()*.0038;O.compose(new G(t,Yf(t,n)+r*.28,n),k.setFromEuler(new un(T()*3,T()*3,T()*3)),new G(r,r*.52,r*.8)),D.setMatrixAt(e,O)}D.receiveShadow=!0,e.add(D);for(let t of pg()){e.add(t);let n=sg(t);n&&this.plants.push(n)}let A=[];for(let[e,t]of[[0,.075],[.078,.075],[.086,.082],[.088,.099],[.078,.105],[.071,.096],[.068,.085],[0,.085]])A.push(new W(e,t));let j=new Y(new is(A,64),a);j.position.set(Uf.cx,0,Uf.cz),j.scale.z=.72,j.castShadow=j.receiveShadow=!0,e.add(j),this.hard.push({mesh:j,kind:tg.Rock}),this.water=new Y(new Fa(.071,64),new xs({color:5010026,transparent:!0,opacity:.68,roughness:.12,metalness:.1,clearcoat:1})),this.water.rotation.x=-Math.PI/2,this.water.scale.y=.72,this.water.position.set(Uf.cx,Wf,Uf.cz),e.add(this.water);for(let t=0;t<4;t++){let t=new Y(new os(.018,.019,64),new Jr({color:14869957,transparent:!0,opacity:.1,depthWrite:!1,side:2}));t.rotation.x=-Math.PI/2,t.scale.y=.72,t.position.set(Uf.cx,Wf+3e-4,Uf.cz),t.visible=!1,e.add(t),this.ripples.push(t)}this.warm=this.lamp(-.46,.05,16761725,!0),this.daylight=this.lamp(.52,-.035,13626111,!1),o(.72,.013,.032,-.27,Z.h-.026,n+.035,i);let ee=new bs({color:15070207,emissive:13232127,emissiveIntensity:.45,roughness:.3});this.bulbs.push(ee);let M=new Y(new Ia(.003,.003,.67,16),ee);M.rotation.z=Math.PI/2,M.position.set(-.27,Z.h-.032,n+.037),e.add(M);let N=document.createElement(`canvas`);N.width=256,N.height=256;let te=new ka(N);te.colorSpace=Be,this.readout={canvas:N,texture:te},o(.088,.107,.023,.715,.521,t-.018,r);let P=new Y(new as(.074,.088),new Jr({map:te}));P.position.set(.715,.521,t-.003),e.add(P),this.drawReadout(41,24,34);let ne=new Y(new as(15,15),new bs({color:7827818,roughness:.43,metalness:.1}));ne.rotation.x=-Math.PI/2,ne.position.y=-.025,ne.receiveShadow=!0,e.add(ne);let F=new Y(new as(14,8),new bs({color:5789523,roughness:1}));F.position.set(0,3,-3),e.add(F),this.ready=Promise.all([this.loadLog(),gg(),p,a.userData.ready]).then(()=>{})}lamp(e,t,n,r){let i=new Y(new is([[.014,.144],[.028,.145],[.03,.105],[.034,.094],[.065,.082],[.086,.056],[.104,.021],[.107,.007]].map(([e,t])=>new W(e,t)),48),new bs({color:1120542,metalness:.88,roughness:.25,side:2}));i.position.set(e,Z.h+.013,t),i.castShadow=!0,this.group.add(i);let a=new bs({color:n,emissive:n,emissiveIntensity:2.5,roughness:.5,side:2});this.bulbs.push(a);let o=new Y(new Fa(.093,64),a);o.rotation.x=Math.PI/2,o.position.set(e,Z.h-.009,t),this.group.add(o);let s=new Y(new cs(.014,.0027,8,24),new bs({color:1120539,roughness:.3,metalness:.7}));s.position.set(e,Z.h+.167,t),this.group.add(s);for(let n of[-1,1]){let r=new Y(new Ia(.0024,.0024,.146,8),new bs({color:1382943,metalness:.7,roughness:.4}));r.position.set(e+n*.075,Z.h+.057,t-.024),r.rotation.z=n*.48,this.group.add(r)}let c=new Ja([new G(e,Z.h+.116,t),new G(e+.014,Z.h+.13,t-.03),new G(e+.022,Z.h+.1,t-.105),new G(e+.035,Z.h+.025,-Z.d/2-.01)]);this.group.add(new Y(new ls(c,20,.0028,6,!1),new bs({color:527118,roughness:.6})));let l=new cc(n,r?2.4:1.65,2,r?.67:1,.75,2);return l.position.set(e,Z.h-.014,t),l.target.position.set(e,.09,t),l.castShadow=!0,l.shadow.mapSize.setScalar(2048),l.shadow.bias=-12e-5,l.shadow.normalBias=9e-4,l.shadow.camera.near=.03,l.shadow.camera.far=2,this.group.add(l,l.target),l}bendPlants(e,t){for(let n of this.plants)n.update(e,t)}async loadLog(){for(let e of await Pg())this.group.add(e),this.hard.push({mesh:e,kind:tg.Wood})}drawReadout(e,t,n){let r=this.readout.canvas.getContext(`2d`);r.fillStyle=`#071117`,r.fillRect(0,0,256,256),r.textAlign=`center`,r.fillStyle=`#aed8ee`,r.font=`62px monospace`,r.fillText(`${e.toFixed(1)}°`,128,92),r.font=`65px monospace`,r.fillText(`${n.toFixed(0)}%`,128,191),r.font=`15px monospace`,r.fillText(`COOL ${t.toFixed(0)}°`,128,232),this.readout.texture.needsUpdate=!0}ripple(e){for(let t=0;t<this.ripples.length;t++)this.ripples[t].visible=e>0,this.ripples[t].scale.set(1+t*.63,.72*(1+t*.63),1),this.ripples[t].material.opacity=e*.19/(t+1)}},Ug=[[-.4,.055],[-.31,.09],[-.2,.13],[-.08,.17],[.075,.23]];function Wg(e){let t=Ug[0][1];for(let n=1;n<Ug.length;n++)if(e>=Ug[n-1][0]){let r=Math.min(1,Math.max(0,(e-Ug[n-1][0])/(Ug[n][0]-Ug[n-1][0])));t=Ug[n-1][1]+(Ug[n][1]-Ug[n-1][1])*r}return t}var Gg=class{surface;cell=.01;nx;nz;x0=-Z.w/2+.005;z0=-Z.d/2+.005;cost;wet;region;mainRegion=0;constructor(e,t){this.surface=e,this.nx=Math.floor((Z.w-.01)/this.cell)+1,this.nz=Math.floor((Z.d-.01)/this.cell)+1;let n=this.nx*this.nz;this.cost=new Float32Array(n),this.wet=new Uint8Array(n);for(let n=0;n<this.nz;n++)for(let r=0;r<this.nx;r++){let i=this.x0+r*this.cell,a=this.z0+n*this.cell,o=1;(Math.min(i+Z.w/2,Z.w/2-i,a+Z.d/2)<.142||Z.d/2-a<.085)&&(o=1/0);let s=e.kindAt(i,a),c=e.heightAt(i,a);if(s===tg.Water){let e=Wf-c;e>.021?o=1/0:(o+=2.5+e*120,this.wet[n*this.nx+r]=1)}let l=.012,u=(t,n)=>s!==tg.Wood&&e.kindAt(t,n)===tg.Wood?Yf(t,n):e.heightAt(t,n),d=u(i+l,a)-u(i-l,a),f=u(i,a+l)-u(i,a-l),p=Math.hypot(d,f)/(2*l);p>(s===tg.Wood?1.7:s===tg.Rock?2.4:.9)?o=1/0:o+=Math.min(p,1.5)*3,s===tg.Rock&&(o=c>.335?1/0:o+2),s===tg.Wood&&c>.25&&(o=1/0),s===tg.Ground&&i>-.38&&i<.01&&a>.28&&a<.355&&(o=1/0),s===tg.Rock&&c>.11&&i>-.38&&i<-.105&&a>Wg(i)+.025&&(o=1/0),s===tg.Rock&&i>-.12&&i<.025&&a<Wg(i)-.035&&(o=1/0);for(let t=0;t<8&&Number.isFinite(o);t++){let n=t*Math.PI/4,r=i+Math.cos(n)*.034,s=a+Math.sin(n)*.034;e.heightAt(r,s)-c>(e.kindAt(r,s)===tg.Wood?.12:.075)&&(o=1/0)}if(s===tg.Ground)for(let t=0;t<24&&Number.isFinite(o);t++){let n=t*Math.PI/12,r=i+Math.cos(n)*.105,s=a+Math.sin(n)*.105;e.kindAt(r,s)===tg.Wood&&e.heightAt(r,s)>c+.03&&(o=1/0)}if(s===tg.Ground)for(let t=0;t<8;t++){let n=t*Math.PI/4,r=i+Math.cos(n)*.09,s=a+Math.sin(n)*.09;e.heightAt(r,s)>c+.03&&(o+=2)}for(let e of t){let t=Math.hypot(i-e.x,a-e.z);t<e.r*1.3&&(o+=6*(1-t/(e.r*1.3)))}this.cost[n*this.nx+r]=o}let r=this.distanceField();for(let e=0;e<n;e++){if(!Number.isFinite(this.cost[e]))continue;let t=r[e];t<3&&(this.cost[e]+=(3-t)*1.2)}this.region=new Int32Array(n).fill(-1);let i=0,a=0;for(let e=0;e<n;e++){if(this.region[e]>=0||!Number.isFinite(this.cost[e]))continue;let t=[e];this.region[e]=i;let n=0;for(;t.length;){let e=t.pop();n++;let r=e%this.nx,a=(e-r)/this.nx;for(let e=-1;e<=1;e++)for(let n=-1;n<=1;n++){let o=r+n,s=a+e;if(o<0||s<0||o>=this.nx||s>=this.nz||n&&e&&(!Number.isFinite(this.cost[a*this.nx+o])||!Number.isFinite(this.cost[s*this.nx+r])))continue;let c=s*this.nx+o;this.canTraverse(this.x0+r*this.cell,this.z0+a*this.cell,this.x0+o*this.cell,this.z0+s*this.cell)&&this.canTraverse(this.x0+o*this.cell,this.z0+s*this.cell,this.x0+r*this.cell,this.z0+a*this.cell)&&this.region[c]<0&&Number.isFinite(this.cost[c])&&(this.region[c]=i,t.push(c))}}n>a&&(a=n,this.mainRegion=i),i++}}distanceField(){let e=this.nx*this.nz,t=new Float32Array(e);for(let n=0;n<e;n++)t[n]=Number.isFinite(this.cost[n])?1e6:0;let n=(e,n,r,i,a,o)=>{for(let s=i;s!==a;s+=o)for(let i=e;i!==n;i+=r){let e=s*this.nx+i;if(t[e]===0)continue;let n=t[e],a=i-r,c=s-o;a>=0&&a<this.nx&&(n=Math.min(n,t[s*this.nx+a]+1)),c>=0&&c<this.nz&&(n=Math.min(n,t[c*this.nx+i]+1)),a>=0&&a<this.nx&&c>=0&&c<this.nz&&(n=Math.min(n,t[c*this.nx+a]+1.414)),t[e]=n}};return n(0,this.nx,1,0,this.nz,1),n(this.nx-1,-1,-1,this.nz-1,-1,-1),n(this.nx-1,-1,-1,0,this.nz,1),n(0,this.nx,1,this.nz-1,-1,-1),t}idx(e,t){let n=Math.round((e-this.x0)/this.cell),r=Math.round((t-this.z0)/this.cell);return n<0||r<0||n>=this.nx||r>=this.nz?-1:r*this.nx+n}walkable(e,t){let n=this.idx(e,t);return n>=0&&Number.isFinite(this.cost[n])}canTraverse(e,t,n,r){let i=this.surface.heightAt(n,r)-this.surface.heightAt(e,t);return i<=.036&&i>=-.04}reachable(e,t){let n=this.idx(e,t);return n>=0&&this.region[n]===this.mainRegion}dry(e,t){let n=this.idx(e,t);return n>=0&&Number.isFinite(this.cost[n])&&!this.wet[n]}isWet(e,t){let n=this.idx(e,t);return n>=0&&this.wet[n]===1}costAt(e,t){let n=this.idx(e,t);return n>=0?this.cost[n]:1/0}avoidApproach(e,t,n){let r=e+Math.cos(n)*.045,i=t-Math.sin(n)*.045;for(let n=0;n<this.nz;n++)for(let a=0;a<this.nx;a++){let o=this.x0+a*this.cell,s=this.z0+n*this.cell,c=n*this.nx+a;Math.hypot(o-r,s-i)<.027&&Math.hypot(o-e,s-t)>.025&&Number.isFinite(this.cost[c])&&(this.cost[c]=Math.max(this.cost[c],50))}}nearestWalkable(e,t,n=-1){for(let r=0;r<40;r++){let i=null,a=1/0;for(let o=-r;o<=r;o++)for(let s=-r;s<=r;s++){if(Math.max(Math.abs(s),Math.abs(o))!==r)continue;let c=e+s*this.cell,l=t+o*this.cell,u=this.idx(c,l);if(u<0||!Number.isFinite(this.cost[u])||n>=0&&this.region[u]!==n)continue;let d=s*s+o*o;d<a&&(a=d,i=[c,l])}if(i)return i}return null}lineClear(e,t,n,r,i=2.3){let a=Math.max(1,Math.ceil(Math.hypot(n-e,r-t)/(this.cell*.5))),o=-1;for(let s=0;s<=a;s++){let c=s/a,l=this.idx(e+(n-e)*c,t+(r-t)*c);if(l<0||!Number.isFinite(this.cost[l])||this.cost[l]>i)return!1;if(o>=0){let e=o%this.nx,t=Math.floor(o/this.nx),n=l%this.nx,r=Math.floor(l/this.nx);if(n!==e&&r!==t&&(!Number.isFinite(this.cost[t*this.nx+n])||!Number.isFinite(this.cost[r*this.nx+e])))return!1}if(s>0&&!this.canTraverse(e+(n-e)*(s-1)/a,t+(r-t)*(s-1)/a,e+(n-e)*c,t+(r-t)*c))return!1;o=l}return!0}path(e,t,n,r){let i=e<.05&&this.surface.heightAt(e,t)>.11,a=n<-.22&&this.surface.heightAt(n,r)>.2,o=this.surface.heightAt(e,t)<.12,s=this.surface.heightAt(n,r)<.12,c=Ug,l=i&&s?c.filter(([t])=>e<t-.012):[];if(a&&(e>n+.04||o)){let r=i&&t>Wg(e)+.035,a=c.reduce((n,r)=>Math.hypot(n[0]-e,n[1]-t)<Math.hypot(r[0]-e,r[1]-t)?n:r);o&&e<.04&&l.push([.16,.34]);for(let t of[...c].reverse()){let i=r?t[0]<=a[0]+.012:e>t[0]+.012||o;t[0]>=n-.012&&i&&l.push(t)}}o&&s&&e>-.08&&n<-.38&&l.push([-.04,.365],[-.38,.365]),o&&s&&e<-.38&&n>-.08&&l.push([-.38,.365],[-.04,.365]),o&&a&&e<-.38&&l.unshift([-.38,.365],[-.04,.365]);let u=Math.abs(e-.475)<.11&&t<.11&&this.surface.heightAt(e,t)<.12,d=Math.abs(n-.475)<.11&&r<.11&&this.surface.heightAt(n,r)<.12;if(u&&!d&&l.unshift([.485,.28]),d&&!u&&l.push([.485,.28]),e>.45&&e<.52&&t>=.11&&t<.23&&n<.45&&l.unshift([.36,.29]),l.length){let i=[[e,t],...l,[n,r]],a=[];for(let e=1;e<i.length;e++){let t=this.directPath(...i[e-1],...i[e]);if(!t)return null;a.push(...e===1?t:t.slice(1))}return this.connectStart(a,e,t)}let f=this.directPath(e,t,n,r);return f?this.connectStart(f,e,t):null}connectStart(e,t,n){return e.length>1&&!this.lineClear(t,n,...e[1],1/0)?e.unshift([t,n]):e[0]=[t,n],e}directPath(e,t,n,r){let i=this.nearestWalkable(e,t);if(!i)return null;let a=this.idx(i[0],i[1]),o=this.nearestWalkable(n,r,this.region[a]);if(!o)return null;let s=this.idx(o[0],o[1]),c=this.nx*this.nz,l=new Float32Array(c).fill(1/0),u=new Int32Array(c).fill(-1),d=new Uint8Array(c);l[a]=0;let f=s%this.nx,p=Math.floor(s/this.nx),m=e=>Math.hypot(e%this.nx-f,Math.floor(e/this.nx)-p),h=[],g=[],_=(e,t)=>{let n=h.length;for(h.push(e),g.push(t);n>0;){let t=n-1>>1;if(h[t]<=e)break;h[n]=h[t],g[n]=g[t],n=t}h[n]=e,g[n]=t},v=()=>{let e=g[0],t=h.pop(),n=g.pop();if(h.length){let e=0;for(;;){let n=e*2+1,r=n+1,i=e,a=t;if(n<h.length&&h[n]<a&&(i=n,a=h[n]),r<h.length&&h[r]<a&&(i=r,a=h[r]),i===e)break;h[e]=h[i],g[e]=g[i],e=i}h[e]=t,g[e]=n}return e};_(m(a),a);let y=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];for(;h.length;){let e=v();if(d[e])continue;if(e===s)break;d[e]=1;let t=e%this.nx,n=(e-t)/this.nx;for(let[r,i,a]of y){let o=t+r,s=n+i;if(o<0||s<0||o>=this.nx||s>=this.nz)continue;let c=s*this.nx+o;if(d[c]||!Number.isFinite(this.cost[c])||!this.canTraverse(this.x0+t*this.cell,this.z0+n*this.cell,this.x0+o*this.cell,this.z0+s*this.cell)||r&&i&&(!Number.isFinite(this.cost[n*this.nx+o])||!Number.isFinite(this.cost[s*this.nx+t])))continue;let f=l[e]+a*(this.cost[c]+this.cost[e])*.5;f<l[c]&&(l[c]=f,u[c]=e,_(f+m(c),c))}}if(u[s]<0&&s!==a)return null;let b=[];for(let e=s;e>=0&&(b.push([this.x0+e%this.nx*this.cell,this.z0+Math.floor(e/this.nx)*this.cell]),e!==a);e=u[e]);b.reverse(),b.length===1&&b.push([b[0][0],b[0][1]]);let x=[b[0]],S=0;for(let e=2;e<b.length;e++)this.lineClear(b[S][0],b[S][1],b[e][0],b[e][1])||(x.push(b[e-1]),S=e-1);return x.push(b[b.length-1]),x}randomPoint(e,t,n=!0){for(let r=0;r<300;r++){let r=t?t.x0+e()*(t.x1-t.x0):-Z.w/2+e()*Z.w,i=t?t.z0+e()*(t.z1-t.z0):-Z.d/2+e()*Z.d,a=this.idx(r,i);if(a>=0&&this.region[a]===this.mainRegion&&this.cost[a]<3&&(!n||!this.wet[a]))return[r,i]}return null}},Kg=.027;function qg(e){let t=e*1.13,n=new is([[0,-.003],[t*.65,-.003],[t*.9,-.002],[t*.98,0],[t*.99,.005],[t*.98,.011],[t,.018],[t*.99,.023],[t*.96,.026],[t*.87,.0255],[t*.82,.023],[t*.8,.019],[t*.77,.012],[t*.7,.0065],[t*.52,.006],[t*.28,.006],[0,.006]].map(([e,t])=>new W(e,t)),96),r=n.getAttribute(`position`),i=[1,.98,1.045,1.015,.97,1.03,.985,1.04,.975,1.01,.98,1.03];for(let e=0;e<r.count;e++){let n=r.getX(e),a=r.getZ(e),o=r.getY(e),s=Math.atan2(a,n),c=Math.hypot(n,a),l=(s+Math.PI)/(Math.PI*2)*i.length,u=Math.floor(l)%i.length,d=l-Math.floor(l),f=U.lerp(i[u],i[(u+1)%i.length],d)+.006*Math.sin(s*23+.4),p=U.smoothstep(c,t*.78,t*.96)*(8e-4*Math.sin(s*17+o*470)+5e-4*Math.sin(s*31-o*320)),m=U.smoothstep(o,.01,.021),h=.0013*Math.max(0,Math.sin(s*13+.7))**6;r.setXYZ(e,(n*f+Math.cos(s)*p)*1.08,o+m*(6e-4*Math.sin(s*9)+45e-5*Math.sin(s*21)-h),(a*f+Math.sin(s)*p)*.86)}return n.computeVertexNormals(),n}function Jg(e){let t=new bs({color:10787980,roughness:.94,bumpMap:Hf(256,256,(e,t,n)=>{let r=Vf(e/18,t/18,16,3,39),i=Math.sin(e*127.1+t*311.7)*.07;n[0]=n[1]=n[2]=105+r*66+i*55},!1),bumpScale:65e-5,flatShading:!0});return t.onBeforeCompile=t=>{e&&(t.uniforms.uTrayStone={value:e}),t.vertexShader=t.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vTrayP; varying vec3 vTrayN;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vTrayP=position;vTrayN=normal;`),t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vTrayP;varying vec3 vTrayN;
${e?`uniform sampler2D uTrayStone;`:``}`).replace(`#include <color_fragment>`,`#include <color_fragment>
${e?`vec3 weights=pow(abs(normalize(vTrayN)),vec3(4.));weights/=max(.001,weights.x+weights.y+weights.z);
vec3 stone=texture2D(uTrayStone,vTrayP.yz*13.).rgb*weights.x+texture2D(uTrayStone,vTrayP.xz*13.).rgb*weights.y+texture2D(uTrayStone,vTrayP.xy*13.).rgb*weights.z;
stone=mix(vec3(dot(stone,vec3(.2126,.7152,.0722))),stone,.35);
diffuseColor.rgb*=mix(vec3(1.),stone*1.8,.76);`:``}
float strata=sin(vTrayP.y*1500.+sin(vTrayP.x*410.+vTrayP.z*390.)*2.);
diffuseColor.rgb*=.94+.055*strata;
diffuseColor.rgb*=mix(.86,1.08,smoothstep(.012,.024,vTrayP.y));`)},t.customProgramCacheKey=()=>`carved-food-tray-${!!e}-v1`,t}function Yg(e,t,n){let r=Rf(n),i=[],a=[],o=[],s=[],c=new q([3304736,4357925,5671469,2646314][n%4]),l=r()*6.28;for(let n=0;n<=20;n++)for(let s=0;s<=8;s++){let u=n/20,d=s/8*2-1,f=.88+.1*Math.sin(u*39+l)+.04*Math.sin(u*83),p=Math.sin(Math.PI*u)**.64*t*.5*f,m=.0016*Math.sin(u*Math.PI)-8e-4*d*d+9e-4*Math.sin(u*21+d*8+l)*Math.abs(d)+.0013*(u-.5)**2;i.push((u-.5)*e,m,d*p),a.push(s/8,u);let h=Math.exp(-d*d*130),g=.88+r()*.1+h*.34;o.push(c.r*g+h*.015,c.g*g+h*.025,c.b*g)}for(let e=0;e<20;e++)for(let t=0;t<8;t++){let n=e*9+t,r=n+8+1;s.push(n,r,n+1,n+1,r,r+1)}let u=new Pr;return u.setAttribute(`position`,new J(i,3)),u.setAttribute(`uv`,new J(a,2)),u.setAttribute(`color`,new J(o,3)),u.setIndex(s),u.computeVertexNormals(),u}function Xg(){let e=new xs({color:16777215,vertexColors:!0,roughness:.72,side:2,clearcoat:.05,clearcoatRoughness:.65});return e.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec2 vSaladUv;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vSaladUv=uv;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec2 vSaladUv;`).replace(`#include <color_fragment>`,`#include <color_fragment>
float mid=exp(-abs(vSaladUv.x-.5)*190.);
float branches=pow(max(0.,cos((vSaladUv.y+abs(vSaladUv.x-.5)*.55)*95.)),28.)*(1.-smoothstep(.34,.50,abs(vSaladUv.x-.5)));
diffuseColor.rgb*=1.+mid*.22+branches*.13;`)},e.customProgramCacheKey=()=>`torn-salad-leaf-v1`,e}function Zg(e,t,n){let r=new Y(qg(t),Jg(n));r.name=`chipped-oval-stone-food-tray`,r.position.copy(e),r.castShadow=r.receiveShadow=!0;let i=Rf(23714),a=Xg(),o=Hf(128,128,(e,t,n)=>{let r=Vf(e/12,t/12,12,3,72),i=Math.sin(e*.55+Math.sin(t*.1)*2);n[0]=n[1]=n[2]=226+r*23+i*4}),s=[14721841,14125351,15842644].map(e=>new bs({color:e,map:o,bumpMap:o,bumpScale:8e-5,roughness:.69})),c=[];for(let n=0;n<14;n++){let r=new On,o=n*2.39996+.3,l=Math.sqrt((n+.5)/14)*t*.6;r.name=`salad-bite-portion`,r.position.set(e.x+Math.cos(o)*l*1.08,e.y+.012+(1-l/(t*.68))*.007,e.z+Math.sin(o)*l*.86);for(let e=0;e<4;e++){let t=new Y(Yg(.017+i()*.009,.008+i()*.005,n*7+e+11),a);t.position.set((i()-.5)*.011,e*.0023,(i()-.5)*.01),t.rotation.set((i()-.5)*.4,i()*Math.PI*2,(i()-.5)*.35),t.castShadow=t.receiveShadow=!0,r.add(t)}for(let e=0;e<2;e++){let t=.005+i()*.0035,a=.004+i()*.003,o=.005+i()*.003,c=(n+e)%4==0?new Ia(t*.43,t*.48,a*.75,18):new Lf(t,a,o,3,.001),l=c.getAttribute(`position`);for(let e=0;e<l.count;e++){let n=l.getX(e),r=l.getY(e),i=l.getZ(e);l.setXYZ(e,n*(1+r/a*.22)+r*.1,r,i*(1-n/t*.13))}c.computeVertexNormals();let u=new Y(c,s[(n+e)%3]);u.position.set((i()-.5)*.017,.01+a*.5+e*.0018,(i()-.5)*.015),u.rotation.set((i()-.5)*.35,i()*Math.PI*2,(i()-.5)*.35),u.castShadow=u.receiveShadow=!0,r.add(u)}c.push(r)}return{bowl:r,portions:c}}var Qg=class{group=new On;bowl;centre=new G;radius=.057;pieces=[];left=14;foodHeight=Kg;static findSpot(e,t){let n=[-.2,.17],r=-1/0;for(let i=-.5;i<=0;i+=.01)for(let a=.13;a<=Z.d/2-.05;a+=.01){if(e.kindAt(i,a)!==tg.Ground||Xf(i,a)||Jf(i,a)<.12||e.normalAt(i,a).y<.93)continue;let o=1/0;for(let e of t)o=Math.min(o,Math.hypot(i-e.x,a-e.z)-e.r);let s=Math.min(o,.09)-Math.abs(i+.22)*.05;s>r&&(r=s,n=[i,a])}return n}constructor(e,t,n,r){this.centre.set(t,e.heightAt(t,n),n);let{bowl:i,portions:a}=Zg(this.centre,this.radius,r);this.bowl=i,this.group.add(i,...a),this.pieces=a,this.group.name=`greens-dish`}get remaining(){return this.left}take(e){let t=null,n=1/0;for(let r of this.pieces)if(r.visible){let i=r.position.distanceTo(e);i<n&&(n=i,t=r)}return t?(t.visible=!1,this.left--,t.position.clone()):null}hit(e){return Math.hypot(e.x-this.centre.x,e.z-this.centre.z)<this.radius*1.3&&Math.abs(e.y-this.centre.y)<.03}refill(){for(let e of this.pieces)e.visible=!0;this.left=14}},$g=new G;new G;var e_=new At,t_=new G(0,1,0);function n_(e,t,n,r){$g.subVectors(n,t);let i=$g.length();e.position.copy(t),e.quaternion.copy(e_.setFromUnitVectors(t_,$g.multiplyScalar(1/Math.max(i,1e-6)))),e.scale.set(r,i,r)}var r_=class{group=new On;pos=new G;vel=new G;heading=Math.random()*Math.PI*2;airborne=!0;caught=!1;eaten=!1;struggle=0;consumed=0;hopT=.5+Math.random();walkT=0;walking=!1;gait=0;hopPose=0;t=Math.random()*10;legs=[];antennae=[];cerci=[];body=new On;age=0;splashed=!1;startle(e){this.caught||this.airborne||(this.heading=Math.atan2(-(this.pos.z-e.z),this.pos.x-e.x)+(Math.random()-.5)*.8,this.hopT=0)}constructor(e,t){this.pos.copy(e);let n=Math.random()<.5,r=.85+Math.random()*.3;this.group.add(this.body);let i=(e,t,n=this.body)=>{let r=new Y(e,t);return r.castShadow=!0,n.add(r),r};i(t.body,t.mats.body);for(let e of[-1,1]){let n=i(t.wing,t.mats.wing);n.scale.z=e,i(t.eye,t.mats.eye).position.set(.0074,.0043,.0017*e);let r=new On;r.position.set(.0086,.0044,7e-4*e),i(t.antenna,t.mats.dark,r).scale.set(.024,.024,.024*e),this.body.add(r),this.antennae.push(r);let a=new On;a.position.set(-.0088,.0031,6e-4*e),i(t.cercus,t.mats.leg,a).scale.set(.0058,.0058,.0058*e),this.body.add(a),this.cerci.push(a)}n&&i(t.ovipositor,t.mats.dark).position.set(-.0086,.0029,0),this.body.scale.setScalar(r>1.05?1.05:.95+Math.random()*.1);let a=[[.0054,.0011,.0092,.0042,.0014,!1,0],[.0034,.0015,.0038,.0055,.002,!1,1],[.0016,.0016,-.0058,.0034,.0055,!0,0]];for(let e of[-1,1])for(let[n,r,o,s,c,l,u]of a){let a=l?[i(t.femur,t.mats.femur),i(t.seg,t.mats.leg),i(t.seg,t.mats.leg)]:[i(t.seg,t.mats.leg),i(t.seg,t.mats.leg),i(t.seg,t.mats.leg)],d=l?i(t.spines,t.mats.dark):null;d&&(d.scale.z=e),this.legs.push({spurs:d,hip:new G(n,.0018,r*e),foot:new G(o,0,s*e),lift:c,segs:a,radii:l?[1,34e-5,24e-5]:[36e-5,3e-4,21e-5],group:e>0?u:1-u,hind:l,kick:new G})}this.updateLegs(0)}updateLegs(e){let t=new G,n=new G,r=new G,i=new G;for(let e of this.legs){n.copy(e.foot);let a=e.lift;if(this.walking&&!this.airborne&&!this.caught){let t=this.gait*Math.PI*2+e.group*Math.PI;n.x+=Math.sin(t)*(e.hind?.001:.0016),n.y+=Math.max(0,Math.cos(t))*.0012}if(this.airborne&&(e.hind?(n.x-=.004*this.hopPose,n.y+=.002*(1-this.hopPose),a*=1-.75*this.hopPose):(n.y+=.002,n.x-=.001)),this.caught){let t=this.struggle;e.kick.set(Math.sin(this.t*(19+e.radii[1]*9e3)+e.hip.x*900)*.0025*t,Math.sin(this.t*23+e.hip.z*1500)*.002*t+.0025,Math.cos(this.t*17+e.hip.x*700)*.0015*t),n.add(e.kick)}i.copy(e.hip).lerp(n,e.hind?.42:.45),e.hind?t.set(-.0047+.003*(1-a/e.lift),e.hip.y+a*.78,e.hip.z*1.65):t.copy(i).add(new G(4e-4,a,e.hip.z*.9));let o=new G(e.hind?-1:.5,0,Math.sign(e.hip.z)*.6).normalize();r.copy(n).addScaledVector(o,e.hind?.0034:.0024),r.y=Math.min(r.y,n.y),e.hind?(n_(e.segs[0],e.hip,t,1),e.segs[0].scale.set(1,e.hip.distanceTo(t)/.0085,1)):n_(e.segs[0],e.hip,t,e.radii[0]),n_(e.segs[1],t,n,e.radii[1]),n_(e.segs[2],n,r,e.radii[2]),e.spurs&&(e.spurs.position.copy(t),e.spurs.quaternion.copy(e.segs[1].quaternion),e.spurs.scale.y=t.distanceTo(n)/.0085)}}update(e,t,n){this.t+=e,this.age+=e;let r=this.caught?1+2*this.struggle:1;if(this.antennae.forEach((e,t)=>e.rotation.set(Math.sin(this.t*3.1*r+t)*.25,Math.sin(this.t*2.3*r+t*2)*.35+(t?.25:-.25),Math.sin(this.t*1.7+t)*.2-.1)),this.cerci.forEach((e,t)=>e.rotation.set(0,(t?-.35:.35)+Math.sin(this.t*5+t)*.08,.15+Math.sin(this.t*3.7+t)*.06)),this.caught){this.walking=!1,this.updateLegs(e),this.body.scale.x=Math.max(.05,1-this.consumed*.95);return}let i=t.heightAt(this.pos.x,this.pos.z);if(this.hopPose=Math.max(0,this.hopPose-e*4),this.airborne){this.vel.y-=9.8*e,this.pos.addScaledVector(this.vel,e);let t=Z.w/2-.01,n=Z.d/2-.01;Math.abs(this.pos.x)>t&&(this.pos.x=Math.sign(this.pos.x)*t,this.vel.x*=-.3),Math.abs(this.pos.z)>n&&(this.pos.z=Math.sign(this.pos.z)*n,this.vel.z*=-.3),this.pos.y<=i&&(this.pos.y=i,this.airborne=!1,this.vel.set(0,0,0),Jf(this.pos.x,this.pos.z)<0&&i<=.096&&(this.splashed=!0,this.vel.set(-Math.cos(this.heading)*.6,1.2,Math.sin(this.heading)*.6),this.airborne=!0,this.hopPose=1))}else if(this.hopT-=e,this.walkT-=e,this.walking=!1,this.hopT<0){this.hopT=1.5+Math.random()*4;let e=.35+Math.random()*.45;for(let t=0;t<8;t++){let r=this.heading+(Math.random()-.5)*2.2*(t+1)*.5,i=this.pos.x+Math.cos(r)*e*.3,a=this.pos.z-Math.sin(r)*e*.3;if(n.dry(i,a)){this.heading=r;break}t===7&&(e=.15)}this.vel.set(Math.cos(this.heading)*e,.9+Math.random()*.5,-Math.sin(this.heading)*e),this.airborne=!0,this.hopPose=1}else if(this.walkT<.4){this.walking=!0,this.gait=(this.gait+e*9)%1;let r=Math.cos(this.heading),i=-Math.sin(this.heading),a=this.pos.x+r*.03*e,o=this.pos.z+i*.03*e;n.dry(a,o)?(this.pos.x=a,this.pos.z=o):this.heading+=1.5,this.pos.y=t.heightAt(this.pos.x,this.pos.z),this.walkT<0&&(this.walkT=.8+Math.random()*1.5)}this.group.position.copy(this.pos),this.group.rotation.set(0,this.heading,this.airborne?.3*Math.sign(this.vel.y):0),this.updateLegs(e)}};function i_(){let e=(e,t,n,r,i,a,o,s=16,c=12)=>{let l=new ss(e,s,c);return l.scale(t,n,r),l.translate(i,a,o),l},t=[],n=e(.0023,1,1.08,1,0,0,0);n.rotateZ(-.35),n.translate(.0071,.0036,0),t.push(n);for(let e of[-1,1]){let n=new Ia(22e-5,16e-5,.0022,5);n.rotateZ(.5),n.translate(.0083,.0016,8e-4*e),t.push(n)}let r=e(.0026,1.05,.72,1,.0042,.0037,0);t.push(r),t.push(e(.0023,1.1,.75,1,.0028,.0026,0));for(let n=0;n<8;n++){let r=n/7,i=.0024*(1-.45*r*r);t.push(e(i,.62,.78,1,.0012-r*.0094,.0026-r*4e-4,0,14,10))}let i=rg(t.map(e=>e.toNonIndexed()));{let e=i.attributes.position,t=new Float32Array(e.count*3);for(let n=0;n<e.count;n++){let r=e.getX(n),i=e.getY(n),a=e.getZ(n),o=.3,s=.19,c=.08;if(r>.0062){let e=Math.exp(-(((i-.0045)/9e-4)**2));o-=.28*e,s-=.2*e,c-=.1*e}if(r>.0018&&r<.0066&&i>.0044){let e=.5+.5*Math.sin(a*1800);o-=.18*e,s-=.13*e,c-=.06*e}if(r<.0014){let e=Math.abs(Math.sin((r-.0012)/.00134*Math.PI))**6;o-=.12*e,s-=.09*e,c-=.04*e}i<.0018&&(o+=.06,s+=.05,c+=.03),o=Math.max(.03,o),s=Math.max(.02,s),c=Math.max(.01,c),t.set([o,s,c],n*3)}i.setAttribute(`color`,new br(t,3))}let a=new as(1,1,12,4);{let e=a.attributes.position;for(let t=0;t<e.count;t++){let n=e.getX(t)+.5,r=e.getY(t)+.5,i=.0028-n*.0098,a=.15+r*1.45,o=.0021*(1-.3*n*n)+3e-4;e.setXYZ(t,i,.0028+Math.cos(a)*o-4e-4*n,Math.sin(a)*o)}a.computeVertexNormals()}let o=new ss(85e-5,12,10);o.scale(.9,1.2,.8);let s=new Ia(.8,1,1,6,1);s.translate(0,.5,0);let c=new is([0,55e-5,9e-4,.00105,.001,8e-4,55e-5,4e-4,3e-4,28e-5,0].map((e,t,n)=>new W(e,t/(n.length-1)*.0085)),8),l=[];for(let e=0;e<6;e++)for(let t of[-1,1]){let n=new La(11e-5,7e-4,4);n.translate(0,35e-5,0),n.rotateX(-.9*t),n.rotateZ(.5),n.translate(12e-5,.0018+e*.0012,2e-4*t),l.push(n.toNonIndexed())}let u=rg(l),d=new Ja([new G(0,0,0),new G(.1,.08,.03),new G(.16,.15,.1),new G(.1,.2,.22),new G(-.1,.2,.32),new G(-.35,.15,.36),new G(-.6,.1,.34)]),f=new ls(d,32,.006,4,!1);{let e=f.attributes.position,t=f.attributes.uv,n=new G,r=new G;for(let i=0;i<e.count;i++){let a=t.getX(i);d.getPointAt(a,n),r.set(e.getX(i),e.getY(i),e.getZ(i)).sub(n).multiplyScalar(1-.75*a),e.setXYZ(i,n.x+r.x,n.y+r.y,n.z+r.z)}f.computeVertexNormals()}let p=new La(.035,1,5);p.rotateZ(Math.PI/2),p.translate(-.5,0,0);let m=new Ia(28e-5,14e-5,.0085,5);m.rotateZ(Math.PI/2-.12),m.translate(-.0042,5e-4,0);let h=(()=>{let e=document.createElement(`canvas`);e.width=256,e.height=64;let t=e.getContext(`2d`);t.fillStyle=`#7a5a34`,t.fillRect(0,0,256,64);let n=t.createLinearGradient(0,0,0,64);n.addColorStop(0,`rgba(60,40,20,0)`),n.addColorStop(1,`rgba(40,25,10,0.6)`),t.fillStyle=n,t.fillRect(0,0,256,64),t.strokeStyle=`rgba(35,22,10,0.85)`,t.lineWidth=1.4;for(let e=0;e<7;e++){t.beginPath();let n=4+e*9;t.moveTo(0,n);for(let r=0;r<=256;r+=16)t.lineTo(r,n+Math.sin(r*.03+e)*2.5);t.stroke()}t.lineWidth=.8;for(let e=6;e<256;e+=7+Math.random()*6)t.beginPath(),t.moveTo(e,Math.random()*6),t.lineTo(e+(Math.random()-.5)*6,64),t.stroke();let r=new ka(e);return r.colorSpace=Be,r})(),g=(e,t,n=!1)=>new xs({color:e,roughness:t,clearcoat:.5,clearcoatRoughness:.35,vertexColors:n});return{body:i,wing:a,eye:o,seg:s,femur:c,spines:u,antenna:f,cercus:p,ovipositor:m,mats:{body:g(new q(1,1,1),.42,!0),wing:new xs({map:h,color:new q(.75,.68,.6),roughness:.35,clearcoat:.6,clearcoatRoughness:.2,side:2,transparent:!0,opacity:.94}),eye:new xs({color:new q(.02,.015,.012),roughness:.2,clearcoat:1,clearcoatRoughness:.05}),leg:g(new q(.27,.17,.08),.5),femur:g(new q(.3,.19,.085),.42),dark:g(new q(.12,.08,.05),.5)}}}var a_=class{surface;nav;group=new On;crickets=[];parts=i_();constructor(e,t){this.surface=e,this.nav=t}onSplash;scatter(e,t){for(let n of this.crickets)n.pos.distanceTo(e)<t&&n.startle(e)}release(){let e=(Math.random()-.5)*(Z.w*.6),t=(Math.random()-.5)*(Z.d*.4)+.04,n=new r_(new G(e,Z.h-.03,t),this.parts);return this.crickets.push(n),this.group.add(n.group),n}update(e){for(let t of this.crickets)t.update(e,this.surface,this.nav),t.splashed&&(t.splashed=!1,this.onSplash?.(t.pos.x,t.pos.z));for(let e of this.crickets.filter(e=>e.eaten))this.group.remove(e.group);for(let e=this.crickets.length-1;e>=0;e--)this.crickets[e].eaten&&this.crickets.splice(e,1)}nearest(e){let t=null,n=1/0;for(let r of this.crickets){if(r.caught||r.airborne&&r.pos.y>.4)continue;let i=r.pos.distanceTo(e);i<n&&(n=i,t=r)}return t}},o_=`
vec3 lzHash3(vec3 p){
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453123);
}
float lzHash1(vec3 p){ return fract(sin(dot(p, vec3(17.13, 91.71, 47.37))) * 43758.5453); }
// Returns: x = distance to nearest feature, y = distance to the cell border,
// z = cell random id. grad1 = d(x)/dp, gradB = d(y)/dp.
vec3 lzVoronoi(vec3 p, float jitter, out vec3 grad1, out vec3 gradB){
  vec3 ip = floor(p), fp = fract(p);
  vec3 mg, mr; float md = 8.0;
  for(int k=-1;k<=1;k++) for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec3 g = vec3(float(i), float(j), float(k));
    vec3 o = 0.5 + (lzHash3(ip + g) - 0.5) * jitter;
    vec3 r = g + o - fp;
    float d = dot(r, r);
    if(d < md){ md = d; mr = r; mg = g; }
  }
  float bd = 8.0; vec3 bn = vec3(0.0, 1.0, 0.0);
  for(int k=-1;k<=1;k++) for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec3 g = mg + vec3(float(i), float(j), float(k));
    vec3 o = 0.5 + (lzHash3(ip + g) - 0.5) * jitter;
    vec3 r = g + o - fp;
    vec3 dr = r - mr;
    float l2 = dot(dr, dr);
    if(l2 > 1e-5){
      vec3 n = dr * inversesqrt(l2);
      float d = dot(0.5 * (mr + r), n);
      if(d < bd){ bd = d; bn = n; }
    }
  }
  float d1 = sqrt(md);
  grad1 = -mr / max(d1, 1e-4);
  gradB = -bn;
  return vec3(d1, bd, lzHash1(ip + mg));
}
// Domed scale: height and gradient in cell units.
float lzScale(vec3 p, float jitter, float edge, float dome, out vec3 grad, out vec3 cell){
  vec3 g1, gb;
  vec3 v = lzVoronoi(p, jitter, g1, gb);
  float t = clamp(v.y / edge, 0.0, 1.0);
  float s = t * t * (3.0 - 2.0 * t);
  float ds = 6.0 * t * (1.0 - t) / edge;
  float dm = 1.0 - dome * v.x * v.x;
  grad = ds * gb * dm + s * (-2.0 * dome * v.x) * g1;
  cell = v;
  return s * dm;
}
`,s_={normal:[[.29,.195,.1],[.5,.38,.22],[.07,.046,.027],[.17,.112,.062],[.58,.5,.37],[.5,.24,.07],[.62,.54,.4],[.018,.015,.013]],red:[[.42,.11,.03],[.62,.25,.07],[.12,.03,.012],[.28,.07,.025],[.62,.42,.26],[.72,.12,.02],[.66,.48,.3],[.02,.014,.012]],citrus:[[.5,.33,.04],[.68,.52,.1],[.16,.1,.02],[.34,.2,.04],[.66,.56,.3],[.7,.38,.03],[.7,.6,.36],[.03,.022,.015]],hypo:[[.5,.38,.22],[.7,.58,.38],[.28,.19,.1],[.42,.3,.17],[.72,.64,.5],[.66,.36,.14],[.76,.68,.54],[.5,.45,.38]]},c_=.016;function l_(){let e=new Uint8Array(262144),t=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453;return t-Math.floor(t)},n=new Float32Array(256);for(let e=0;e<256;e++)n[e]=.6*t(e)+.4*t(Math.floor(e/3)+999);for(let r=0;r<256;r++){let i=(255-r)/255*Math.PI;for(let a=0;a<256;a++){let o=n[a]*.7+n[(a+1)%256]*.3,s,c,l,u=t(a*7+Math.floor(i*40)*131)>.93?.6:1;if(i<.29)s=3,c=2,l=2;else if(i<.36){let e=(i-.29)/.07;s=226-60*e,c=168-62*e,l=72-38*e}else if(i<1){let e=(i-.36)/.64;s=(132-66*e+34*(o-.5))*u,c=(78-44*e+20*(o-.5))*u,l=(30-16*e+8*(o-.5))*u}else if(i<1.14){let e=(i-1)/.14;s=66-50*e,c=34-24*e,l=14-8*e}else s=14,c=10,l=8;let d=(r*256+a)*4;e[d]=s,e[d+1]=c,e[d+2]=l,e[d+3]=255}}let r=new yi(e,256,256);return r.colorSpace=Be,r.wrapS=i,r.magFilter=u,r.minFilter=f,r.generateMipmaps=!0,r.needsUpdate=!0,r}function u_(e,t,n,r){let i=new xs({color:16777215,roughness:.6,metalness:0,sheen:.15,sheenRoughness:.6,sheenColor:new q(.5,.4,.3),specularIntensity:.55}),a={uProfile:{value:e},uDisplay:{value:0},uTone:{value:0},uBeardDark:{value:0},uPal:{value:s_.normal.map(e=>new q(...e))},uWet:{value:0},uDust:{value:.08},uScaleMeters:{value:c_},uScaleDir:{value:t},uEye:{value:n},uNostril:{value:r}};return i.onBeforeCompile=e=>{Object.assign(e.uniforms,a),e.uniforms.uKeyDirView=ag.uKeyDirView,e.uniforms.uKeyColor=ag.uKeyColor,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
attribute vec4 aux;
uniform vec3 uScaleDir[${t.length}];
varying vec3 vRest; varying vec3 vRestN; varying vec4 vAux; varying mat3 vSkinN; varying vec3 vScaleDir; varying float vScaleK;`).replace(`#include <skinnormal_vertex>`,`#include <skinnormal_vertex>
#ifdef USE_SKINNING
  vSkinN = normalMatrix * mat3(skinMatrix);
#else
  vSkinN = normalMatrix;
#endif`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vRest = position; vRestN = normal; vAux = aux;
#ifdef USE_SKINNING
// the way the scales point (towards the free edges): down the limbs, back along the body
vScaleDir = uScaleDir[int(skinIndex.x)] * skinWeight.x + uScaleDir[int(skinIndex.y)] * skinWeight.y + uScaleDir[int(skinIndex.z)] * skinWeight.z + uScaleDir[int(skinIndex.w)] * skinWeight.w;
// how much one bone has this skin to itself (its scales point one way)
vScaleK = max(max(skinWeight.x, skinWeight.y), max(skinWeight.z, skinWeight.w));
#else
vScaleDir = vec3(-1.0, 0.0, 0.0);
vScaleK = 1.0;
#endif`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform vec3 uKeyDirView; uniform vec3 uKeyColor; uniform vec3 uNostril;
uniform sampler2D uProfile; uniform vec3 uEye; uniform float uDisplay; uniform float uTone; uniform float uBeardDark; uniform vec3 uPal[8]; uniform float uWet; uniform float uDust; uniform float uScaleMeters;
varying vec3 vRest; varying vec3 vRestN; varying vec4 vAux; varying mat3 vSkinN; varying vec3 vScaleDir; varying float vScaleK;
${o_}
float lzNoise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  float n000 = lzHash1(i), n100 = lzHash1(i+vec3(1,0,0)), n010 = lzHash1(i+vec3(0,1,0)), n110 = lzHash1(i+vec3(1,1,0));
  float n001 = lzHash1(i+vec3(0,0,1)), n101 = lzHash1(i+vec3(1,0,1)), n011 = lzHash1(i+vec3(0,1,1)), n111 = lzHash1(i+vec3(1,1,1));
  return mix(mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y), mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y), f.z);
}
float lzFbm(vec3 p){ return 0.55*lzNoise(p) + 0.3*lzNoise(p*2.03+7.1) + 0.15*lzNoise(p*4.1+3.3); }
vec4 lzProfile(float x){ float u = ((clamp(x, -17.2, 13.3) + 17.2) / 0.5 + 0.5) / 62.0; return texture2D(uProfile, vec2(u, 0.5)); }
`).replace(`#include <color_fragment>`,`#include <color_fragment>
vec3 P = vRest;
vec4 pr = lzProfile(P.x);
float yn = (P.y - pr.w) / (P.y > pr.w ? pr.y : pr.z);
float zn = abs(P.z) / max(pr.x, 0.05);
// (a 4-norm: the loft's cross-sections are superellipses, boxy at the crown)
float onLoft = 1.0 - smoothstep(1.05, 1.3, pow(pow(zn, 4.0) + pow(abs(yn), 4.0), 0.25));
vec3 nR = normalize(vRestN);
float up = mix(smoothstep(-0.35, 0.65, nR.y), smoothstep(-0.25, 0.55, yn), onLoft);
float belly = mix((1.0 - smoothstep(-0.8, -0.2, nR.y)), (1.0 - smoothstep(-0.75, -0.25, yn)) * (1.0 - smoothstep(-0.6, -0.1, nR.y)), onLoft);
float headW = smoothstep(9.2, 9.8, P.x);
float tailW = (1.0 - smoothstep(-1.6, -0.3, P.x));
// --- scales: one field whose size, shape and overlap follow the body ---
// Limbs and tail carry large keeled scales overlapping toward the toes and the
// tail tip; the belly small smooth overlapping ones; the head fine granular
// beads; the lips a row of rectangular plates.
vec3 sdir = normalize(vScaleDir + vec3(1e-4));
float clawK = smoothstep(0.25, 0.6, vAux.y);
float limb = (1.0 - onLoft) * (1.0 - clawK) * (1.0 - smoothstep(9.0, 9.4, P.x));
float headK = headW * (1.0 - limb); // granular beads all over the head, jaw and throat
float freq = mix(12.5, 10.0, belly);
// (a limb's scales are small and overlap like roof tiles: drawn larger, they read as
// a tortoise's cobbles)
freq = mix(freq, 8.6, limb);
freq = mix(freq, 8.4, tailW * (1.0 - limb));
freq = mix(freq, 15.0, headK);
float elong = mix(0.85, 0.66, max(limb, tailW));
elong = mix(elong, 0.7, belly);
elong = mix(elong, 1.0, headK);
// (where bones share the skin the scales' direction turns within a few
// millimetres, and stretching along it would squeeze the cells into streaks)
elong = mix(1.0, elong, smoothstep(0.6, 0.9, vScaleK));
float keelK = mix(0.25, 0.8, max(limb, tailW)) * (1.0 - belly) * (1.0 - headK);
float overlap = mix(0.7, 1.0, max(limb, max(tailW, belly))) * (1.0 - headK);
vec3 sp = P * freq;
sp += sdir * dot(sp, sdir) * (elong - 1.0);
vec3 vg1, vgb;
// (limb scales lie in fairly regular diagonal rows; the body's are more irregular)
vec3 vc = lzVoronoi(sp, mix(mix(0.55, 0.3, limb), 0.9, headK), vg1, vgb);
vec3 rel = vg1 * vc.x; // from the scale's centre to here, in cell units
float alongS = dot(rel, sdir);
float ew = mix(0.12, 0.3, headK);
float et = clamp(vc.y / ew, 0.0, 1.0);
float edgeS = et * et * (3.0 - 2.0 * et);
vec3 gEdge = vgb * (6.0 * et * (1.0 - et) / ew);
// imbricate scales rise toward their free edge and drop onto the next one
float rampR = 0.5 + alongS * 1.15;
float ramp = clamp(rampR, 0.0, 1.0);
vec3 gRamp = sdir * (rampR > 0.0 && rampR < 1.0 ? 1.15 : 0.0);
float dk = mix(1.3, 2.2, headK); // granular beads are round
float domeS = 1.0 - clamp(vc.x * vc.x * dk, 0.0, 1.0);
vec3 gDome = vg1 * (vc.x * vc.x * dk < 1.0 ? -2.0 * dk * vc.x : 0.0);
vec3 perp = rel - sdir * alongS;
float keelG = keelK * exp(-dot(perp, perp) / 0.0144) * smoothstep(-0.45, 0.25, alongS);
vec3 gKeel = perp * (-2.0 / 0.0144) * keelG;
float M = mix(domeS, ramp * 0.8 + 0.2 * domeS, overlap);
vec3 gM = mix(gDome, gRamp * 0.8 + gDome * 0.2, overlap);
float sH = edgeS * (M + keelG);
vec3 sGrad = gEdge * (M + keelG) + edgeS * (gM + gKeel);
// back from scale space to the body (cm)
sGrad = freq * (sGrad + (elong - 1.0) * sdir * dot(sdir, sGrad));
vec3 sCell = vc;
// aux.w: 0 skin, 0.02..0.45 a tubercle (base..tip), 0.55..1 a spine (base..tip)
float isSpike = step(0.5, vAux.w);
float isTuber = step(0.005, vAux.w) * (1.0 - isSpike);
float spikeT = isSpike > 0.5 ? (vAux.w - 0.55) / 0.45 : (vAux.w - 0.02) / 0.43;
float pix = length(fwidth(P)) * freq;
float detail = (1.0 - smoothstep(0.5, 1.6, pix)) * (1.0 - max(isSpike, isTuber) * smoothstep(0.02, 0.15, spikeT));
// the mouth line and the labial plates either side of it
float mY = pr.w - 0.04 - 0.24 * (1.0 - smoothstep(10.0, 12.7, P.x)) + 0.1 * exp(-(((P.x - 10.3) / 0.45) * ((P.x - 10.3) / 0.45)));
float dyM = P.y - mY;
float lipW = dyM > 0.0 ? 0.085 : 0.1;
float lipBand = headW * smoothstep(0.8, 0.93, zn) * smoothstep(0.02, 0.04, abs(dyM)) * (1.0 - smoothstep(lipW - 0.03, lipW, abs(dyM))) * smoothstep(10.2, 10.45, P.x);
float lcOff = dyM > 0.0 ? 0.0 : 0.5;
float lc = fract(P.x * 5.6 + lcOff), lc2 = fract((P.x + 0.004) * 5.6 + lcOff);
float plate = smoothstep(0.0, 0.12, lc) * (1.0 - smoothstep(0.88, 1.0, lc));
float plate2 = smoothstep(0.0, 0.12, lc2) * (1.0 - smoothstep(0.88, 1.0, lc2));
sH = mix(sH, plate * 0.9, lipBand);
sGrad = mix(sGrad, vec3((plate2 - plate) / 0.004 * 0.9, 0.0, 0.0), lipBand);
// the ear: a deep, dark opening behind the corner of the mouth
vec3 earC = vec3(9.92, pr.w + 0.04, sign(P.z) * (pr.x + 0.02));
float earD = length((P - earC) / vec3(0.2, 0.27, 0.24));
float ear = (1.0 - smoothstep(0.75, 1.15, earD)) * smoothstep(9.4, 9.7, P.x) * (1.0 - smoothstep(10.3, 10.5, P.x));
// --- colour pattern (linear): Pogona vitticeps, sandy tan with dark reticulated blotches ---
// the palette comes from the colour morph (normal, red, citrus, hypo)
vec3 cBase = uPal[0], cLight = uPal[1], cDark = uPal[2], cMid = uPal[3], cBelly = uPal[4], cOrange = uPal[5], cCream = uPal[6];
float mott = lzFbm(P * 0.9 + vec3(2.0, 0.0, 5.0));
vec3 col = cBase * (0.86 + 0.28 * mott);
float torso = smoothstep(-0.2, 0.8, P.x) * (1.0 - smoothstep(8.4, 9.3, P.x));
float back = up * torso;
// Dorsal pattern of Pogona vitticeps: a pale vertebral stripe flanked by two
// rows of irregular dark blotches, pale dorsolateral stripes, and reticulated
// darker flanks; the whole back a shade browner than the face.
vec3 g0, g1;
float edgeN = (lzFbm(P * 2.6) - 0.5) * 0.55;
col = mix(col, mix(cBase, cMid, 0.45), back * 0.55);
float midline = 1.0 - smoothstep(0.06, 0.16, zn + edgeN * 0.08);
// paravertebral blotches: a row each side, roughly every 0.9 cm along the body
float rowBand = smoothstep(0.1, 0.2, zn + edgeN * 0.1) * (1.0 - smoothstep(0.6, 0.78, zn + edgeN * 0.12));
float along = sin(P.x * 6.2 + sign(P.z) * 0.9 + edgeN * 5.0 + mott * 2.5 + lzNoise(P * vec3(0.8, 1.0, 4.0)) * 2.0);
float breakup = smoothstep(0.32, 0.58, lzFbm(P * vec3(1.7, 2.4, 3.2) + vec3(9.0)));
float blotch = smoothstep(-0.25, 0.45, along) * rowBand * mix(0.35, 1.0, breakup);
col = mix(col, cDark, blotch * back * 0.95);
// blotch rims a little darker still, interiors broken by pale scales
col = mix(col, cLight * 0.9, back * blotch * smoothstep(0.75, 0.95, lzNoise(P * 9.0)) * 0.35);
col = mix(col, cLight, midline * back * 0.55);
// dorsolateral pale stripe with dark spots below it
float dl = exp(-(((zn - 0.7 + edgeN * 0.08) / 0.06) * ((zn - 0.7 + edgeN * 0.08) / 0.06)));
col = mix(col, cLight, dl * back * 0.45);
// flanks: dark reticulum with pale spots, under the fringe
float flank = smoothstep(0.62, 0.85, zn) * onLoft * torso * smoothstep(-0.7, 0.3, yn) * (1.0 - belly);
vec3 fb = lzVoronoi(vec3(P.x * 2.4, P.y * 2.4, P.z * 0.6), 0.85, g0, g1);
float net = 1.0 - smoothstep(0.04, 0.12, fb.y);
col = mix(col, cMid * 0.8, flank * 0.55);
col = mix(col, cDark, flank * net * 0.7);
col = mix(col, cLight, flank * (1.0 - smoothstep(0.12, 0.24, fb.x)) * step(0.5, fb.z) * 0.55);
// the neck and nape: dark lateral bars behind the head
float nape = smoothstep(7.8, 8.4, P.x) * (1.0 - smoothstep(9.2, 9.6, P.x)) * up;
col = mix(col, cDark * 1.3, nape * smoothstep(0.2, 0.6, sin(P.x * 9.0 + 1.0)) * smoothstep(0.3, 0.6, zn) * 0.6);
// fine dark speckling everywhere above
float speck = smoothstep(0.72, 0.88, lzNoise(P * 8.5 + 3.0));
col = mix(col, cDark * 1.4, speck * up * 0.4);
// tail: dark bands that fade toward the tip, speckled
// (bold dark and pale rings in photographs, running nearly to the tip)
float tb = smoothstep(0.1, 0.45, sin(P.x * 2.7 + mott * 1.4));
float tailUp = tailW * mix(0.45, 1.0, up);
col = mix(col, mix(col, cMid, 0.5), tailUp * 0.4);
col = mix(col, cDark * 1.4, tb * tailUp * 0.82 * smoothstep(-17.0, -11.0, P.x));
col = mix(col, cLight, (1.0 - tb) * tailUp * 0.3);
// head: orange flush on the jowls, the beard's base and around the eyes
float jowl = smoothstep(8.9, 9.5, P.x) * (1.0 - smoothstep(10.9, 11.6, P.x)) * smoothstep(0.5, 0.9, zn) * (1.0 - belly * 0.5);
col = mix(col, cOrange, jowl * 0.65);
// the crown: browner, mottled, with darker scales among the pale ones
float crownM = smoothstep(0.42, 0.62, lzFbm(P * 3.6 + vec3(5.0)));
col = mix(col, mix(cMid, cBase, 0.25), headW * up * (0.45 + 0.5 * crownM) * (1.0 - jowl));
vec3 eyeC = vec3(uEye.x, uEye.y, sign(P.z) * uEye.z);
float eyeD = length(P - eyeC);
float eyeRing = exp(-((eyeD / 0.6) * (eyeD / 0.6))) * headW;
col = mix(col, cOrange * 1.1, eyeRing * 0.55);
// the scaly turret around the eye: darker orange-brown
col = mix(col, vec3(0.2, 0.085, 0.025), (1.0 - smoothstep(0.3, 0.42, eyeD)) * headW * 0.6);
// dark stripe from the eye back to the ear
float streak = headW * exp(-(((P.y - (pr.w + 0.2 + (P.x - 10.75) * 0.12)) / 0.12) * ((P.y - (pr.w + 0.2 + (P.x - 10.75) * 0.12)) / 0.12))) * smoothstep(9.75, 10.3, P.x) * (1.0 - smoothstep(10.75, 11.1, P.x)) * smoothstep(0.6, 0.95, zn);
col = mix(col, cDark, streak * 0.6);
// head top: finer, warmer
col = mix(col, col * vec3(1.05, 0.95, 0.85), headW * up * 0.5);
// pale lips and labial scales
col = mix(col, cCream * (0.78 + 0.22 * plate), lipBand * 0.42);
// cream belly, faint grey barring
col = mix(col, cBelly * (0.9 + 0.2 * mott) * (1.0 - 0.12 * smoothstep(0.4, 0.9, sin(P.x * 2.2))), belly);
// beard: orange-tan, turning sooty black when displayed
float beard = smoothstep(8.7, 9.3, P.x) * (1.0 - smoothstep(10.8, 11.3, P.x)) * (1.0 - smoothstep(-0.6, -0.15, yn));
float beardBlack = max(uDisplay, uBeardDark);
vec3 cBeard = mix(mix(cMid * 1.5, cBelly * 0.75, 0.4), vec3(0.02, 0.018, 0.016), beardBlack);
col = mix(col, cBeard, beard * (0.6 + 0.4 * beardBlack));
// limbs: tan with darker blotches and banding
col = mix(col, mix(col, cMid, 0.4), limb * up * 0.6);
col = mix(col, cDark * 1.4, limb * smoothstep(0.25, 0.75, sin((P.y + P.x * 0.4) * 5.0 + mott * 3.0)) * up * 0.6);
// the nostrils: small dark openings near the tip of the snout
float nosD = length((P - vec3(uNostril.x, uNostril.y, sign(P.z) * uNostril.z)) / vec3(0.075, 0.06, 0.07));
float nostril = 1.0 - smoothstep(0.55, 1.0, nosD);
col = mix(col, vec3(0.02, 0.012, 0.01), nostril * 0.9);
// broad warm/cool drifts in hue, pale cream-tan legs, a duller tail, and scale-to-scale hue jitter
float hueN = lzFbm(P * 0.55 + vec3(11.0, 3.0, 7.0)) - 0.5;
col *= vec3(1.0 + 0.09 * hueN, 1.0 + 0.02 * hueN, 1.0 - 0.1 * hueN);
col = mix(col, mix(col, cLight * (0.85 + 0.3 * mott), 0.35), limb);
col = mix(col, vec3(dot(col, vec3(0.33))) * vec3(1.05, 1.0, 0.92), tailW * 0.18);
col *= mix(vec3(1.0), vec3(1.0 + 0.1 * (sCell.z - 0.5), 1.0, 1.0 - 0.14 * (sCell.z - 0.5)), detail);
// Thermoregulation: a cold dragon darkens its back to soak up heat, a hot one pales.
float toneK = (1.0 - belly) * (0.35 + 0.65 * up) * (1.0 - isSpike * 0.5);
col = mix(col, col * vec3(0.4, 0.37, 0.36), max(uTone, 0.0) * 0.8 * toneK);
col = mix(col, col * 1.28 + vec3(0.03, 0.022, 0.01), max(-uTone, 0.0) * 0.55 * toneK);
// Per-scale tint and crevices.
float tint = 0.93 + 0.14 * sCell.z;
// salt-and-pepper: occasional dark and pale scales
float sp1 = fract(sCell.z * 17.31);
tint *= sp1 < mix(0.07, 0.16, headW * up) ? 0.6 : (sp1 > 0.92 ? 1.3 : 1.0);
col *= mix(1.0, tint, detail);
// keeled limb and tail scales: darker at the base, pale at the free tip, so a leg
// reads as a pinecone of overlapping scales
float tipK = smoothstep(-0.45, 0.45, alongS);
col *= mix(1.0, mix(0.68, 1.22, tipK), max(limb, tailW * (1.0 - belly)) * detail);
col *= mix(1.0, mix(0.84 + 0.16 * smoothstep(0.0, 0.6, sH), 0.83 + 0.26 * smoothstep(0.1, 0.9, sH), headK), detail);
// far away: the average of scale tops and darker crevices, plus fine mottling
col = mix(col, col * (0.8 + 0.12 * lzNoise(P * 9.0)), (1.0 - detail) * 0.9);
// Spines: horn the colour of the skin at the base, paling toward the tip, some
// paler than others (a uniform ivory reads as rows of white dots), and faintly
// amber where the very tip is thin
float spikePale = mix(0.3, 0.75, smoothstep(0.25, 0.75, lzNoise(P * 3.1 + 4.0)));
col = mix(col, mix(col * 1.25, cCream * 0.92, 0.6), isSpike * smoothstep(0.1, 0.75, spikeT) * spikePale);
// tubercles: dark brown over the back, where their rows make much of the pattern;
// elsewhere the skin's own colour, a little paler and worn at the tip
col = mix(col, col * 0.45, isTuber * back * smoothstep(0.1, 0.6, spikeT) * 0.75);
col = mix(col, col * 1.18 + vec3(0.02, 0.015, 0.008), isTuber * (1.0 - back) * smoothstep(0.4, 1.0, spikeT) * 0.6);
col = mix(col, vec3(0.42, 0.26, 0.12), isSpike * smoothstep(0.8, 1.0, spikeT) * 0.45);
// the ear opening
col = mix(col, vec3(0.025, 0.016, 0.012), ear * 0.92);
// Claws and mouth.
vec3 claw = uPal[7];
col = mix(col, claw, smoothstep(0.25, 0.6, vAux.y));
float deep = (1.0 - smoothstep(0.15, 0.4, zn));
col = mix(col, mix(vec3(0.07, 0.035, 0.03), vec3(0.5, 0.19, 0.16), deep), vAux.z);
// Dust on the dry skin.
col = mix(col, vec3(0.45, 0.37, 0.27), uDust * up * (0.5 + 0.5 * lzNoise(P * 6.0)) * (1.0 - uWet));
diffuseColor.rgb = col;
`).replace(`#include <roughnessmap_fragment>`,`
float roughnessFactor = mix(0.66, 0.5, smoothstep(0.3, 0.9, sH) * detail);
roughnessFactor = mix(roughnessFactor, 0.78, (1.0 - smoothstep(0.0, 0.25, sH)) * detail);
roughnessFactor = mix(roughnessFactor, 0.4, smoothstep(0.25, 0.6, vAux.y));
roughnessFactor = mix(roughnessFactor, 0.28, vAux.z);
roughnessFactor = mix(roughnessFactor, 0.48, isSpike);
roughnessFactor = mix(roughnessFactor, 0.55, isTuber);
roughnessFactor = mix(roughnessFactor, 0.22, uWet * 0.8);
`).replace(`#include <normal_fragment_maps>`,`
{
  // bump from the scale height field's gradient (rest space, cm)
  vec3 nRest = normalize(vRestN);
  float amp = mix(0.011, 0.022, max(limb, tailW)) * mix(1.0, 0.7, belly * (1.0 - headK)) * mix(1.0, 1.5, headK) * mix(1.0, 0.8, lipBand);
  vec3 g = sGrad * amp * detail * (1.0 - clawK) * (1.0 - vAux.z) * (1.0 - ear);
  vec3 nP = normalize(nRest - (g - dot(g, nRest) * nRest));
  normal = normalize(vSkinN * nP);
}
`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
{
  // the lamp glowing through thin parts: spines, the beard's fringe and claws
  float thin = isSpike * (0.35 + 0.65 * spikeT) + clawK * 0.5 + beard * 0.25 + lipBand * 0.1;
  vec3 nV = normalize(normal);
  float backL = max(0.0, dot(-nV, uKeyDirView));
  float through = pow(max(0.0, dot(-normalize(vViewPosition), uKeyDirView)), 3.0);
  totalEmissiveRadiance += diffuseColor.rgb * vec3(1.0, 0.62, 0.36) * uKeyColor * thin * (backL * 0.55 + through * 1.1) * 0.8;
}`).replace(`#include <aomap_fragment>`,`
{
  float ao = vAux.x;
  float micro = mix(1.0, mix(0.55, 0.8, headK) + mix(0.45, 0.2, headK) * smoothstep(0.0, 0.45, sH), detail) * (1.0 - ear * 0.8);
  reflectedLight.indirectDiffuse *= ao * micro;
  reflectedLight.indirectSpecular *= ao * micro;
  reflectedLight.directDiffuse *= mix(1.0, ao, 0.45) * mix(1.0, micro, 0.5);
}
`)},i.customProgramCacheKey=()=>`lizard-skin-v11`,{material:i,uniforms:a}}function d_(){let e={value:1},t=new xs({color:new q(.5,.34,.2),roughness:.62,sheen:.3,sheenColor:new q(.5,.42,.32)});return t.onBeforeCompile=t=>{t.uniforms.uOpen=e,t.vertexShader=t.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vLid;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vLid = position;`),t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>
uniform float uOpen; varying vec3 vLid;
${o_}`).replace(`#include <clipping_planes_fragment>`,`#include <clipping_planes_fragment>
vec3 q = normalize(vLid);
float h = atan(q.x, q.y);
float v = atan(q.z, q.y);
float o = max(uOpen, 0.0);
float c = -0.16 * (1.0 - o);
float e = ((h / 0.66) * (h / 0.66)) + (((v - c) / max(0.56 * o, 1e-3)) * ((v - c) / max(0.56 * o, 1e-3)));
if (o > 0.02 && e < 1.0) discard;
float margin = o > 0.02 ? 1.0 - smoothstep(1.0, 1.5, e) : 0.0;
`).replace(`#include <color_fragment>`,`#include <color_fragment>
// rings of small scales around the opening, finer at the margin
float ringR = sqrt(max(e, 0.0));
float ri = (ringR - 1.0) * 9.0;
float ang = atan(v - c, h);
float nAround = 26.0 + floor(max(ri, 0.0)) * 3.0;
vec2 rc = vec2(fract(ri), fract(ang / 6.2832 * nAround + floor(ri) * 0.5));
float bead = (1.0 - smoothstep(0.25, 0.62, length(rc - 0.5)));
// dark at the margin, then rings of orange-brown scales fading to the face's tan
vec3 lid = mix(vec3(0.16, 0.07, 0.025), vec3(0.42, 0.19, 0.055), smoothstep(1.0, 1.35, ringR));
lid = mix(lid, vec3(0.36, 0.2, 0.07), smoothstep(1.6, 2.6, ringR));
diffuseColor.rgb = lid * (0.62 + 0.45 * bead) * (0.9 + 0.2 * fract(sin(dot(floor(vec2(ri, ang / 6.2832 * nAround)), vec2(12.9, 78.2))) * 43758.5));
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.03, 0.022, 0.016), margin * 0.9);
`)},t.customProgramCacheKey=()=>`lizard-lid-v3`,{material:t,open:e}}var f_=class e{data;root=new On;mesh;bones=[];bind=[];boneIndex=new Map;skin;eyes=[];tongue;tongueOut=0;tongueReach=0;tongueTarget=null;tongueTip=new G;tongueRest=new K;tmp=new K;tmp2=new K;constructor(e,t){this.data=e;let{offsets:n,vertexCount:i,indexCount:a}=e,o=new Pr;o.setAttribute(`position`,new br(new Float32Array(t,n.position,i*3),3));let s=new Fr(new Int8Array(t,n.normal,i*4),4);o.setAttribute(`normal`,new Lr(s,3,0,!0)),o.setAttribute(`skinIndex`,new br(new Uint8Array(t,n.skinIndex,i*4),4)),o.setAttribute(`skinWeight`,new br(new Uint8Array(t,n.skinWeight,i*4),4,!0)),o.setAttribute(`aux`,new br(new Uint8Array(t,n.aux,i*4),4,!0)),o.setIndex(new br(new Uint32Array(t,n.index,a),1)),o.boundingSphere=new Er(new G,1e3);let c=new Uint16Array(e.profile.length*4);e.profile.forEach((e,t)=>c.set([e[1],e[2],e[3],e[4]].map(e=>gr.toHalfFloat(e)),t*4));let l=new yi(c,e.profile.length,1,O,b);l.magFilter=u,l.minFilter=u,l.needsUpdate=!0;let d=e.bones.map(e=>/upper|lower|hand|_d\d/.test(e.name)?new G(...e.axes[0]).normalize():new G(-1,0,0)),f=e.nostril??[12.42,2.5,.45],{material:p,uniforms:m}=u_(l,d,new G(e.eye.centre[0],e.eye.centre[1],Math.abs(e.eye.centre[2])),new G(f[0],f[1],Math.abs(f[2])));this.skin=m,e.bones.forEach((e,t)=>{let n=new vi;n.name=e.name,n.matrixAutoUpdate=!1;let r=new K().makeBasis(new G(...e.axes[0]),new G(...e.axes[1]),new G(...e.axes[2]));r.setPosition(e.origin[0],e.origin[1],e.origin[2]),this.bind.push(r),this.bones.push(n),this.boneIndex.set(e.name,t),this.root.add(n)});let h=new Si(this.bones,this.bind.map(e=>e.clone().invert()));this.mesh=new _i(o,p),this.mesh.frustumCulled=!1,this.mesh.castShadow=!0,this.mesh.receiveShadow=!0,this.root.add(this.mesh),this.mesh.bind(h,new K),this.mesh.bindMode=r;let g=new xs({map:l_(),roughness:.5,clearcoat:1,clearcoatRoughness:.03,specularIntensity:.6,ior:1.38,envMapIntensity:.3}),_=e.eye.radius;for(let t of[1,-1]){let n=new G(e.eye.centre[0],e.eye.centre[1],e.eye.centre[2]*t),r=new G(e.eye.axis[0],e.eye.axis[1],e.eye.axis[2]*t).normalize(),i=new G(1,0,0).addScaledVector(r,-r.x).normalize(),a=new G().crossVectors(i,r);a.y<0&&a.negate();let o=new K().makeBasis(i,r,a).setPosition(n),s=new On;s.matrixAutoUpdate=!1;let c=new Y(new ss(_,40,32),g);c.castShadow=!1;let l=d_(),u=new Y(new ss(_*1.15,48,28,0,Math.PI*2,0,1.75),l.material);u.castShadow=!1,u.receiveShadow=!0,s.add(c,u),this.root.add(s),this.eyes.push({group:s,eyeball:c,lid:u,open:l.open,rest:o,side:t,look:new un})}let v=new Pa(.14,.62,6,16);v.rotateZ(Math.PI/2),v.scale(1,.55,1);let y=new xs({color:new q(.62,.24,.22),roughness:.25,clearcoat:.6,clearcoatRoughness:.2,sheen:.4,sheenColor:new q(.9,.5,.5)});this.tongue=new Y(v,y),this.tongue.matrixAutoUpdate=!1;let x=e.mouth.find(e=>e[0]<=11.8)[1];this.tongueRest.makeTranslation(10.95,x-.1,0),this.root.add(this.tongue),this.setBindPose(new K)}static async load(t){let n=await(await fetch(`${t}lizard.json`)).json(),r=await(await fetch(`${t}${n.file}`)).arrayBuffer();return new e(n,r)}bone(e){return this.boneIndex.get(e)}setMorph(e){(s_[e]??s_.normal).forEach((e,t)=>this.skin.uPal.value[t].setRGB(e[0],e[1],e[2])),this.morph=s_[e]?e:`normal`}morph=`normal`;setBindPose(e){let t=new K().makeScale(c_,c_,c_);this.bones.forEach((n,r)=>n.matrix.copy(e).multiply(t).multiply(this.bind[r])),this.syncAttachments()}syncAttachments(){let e=this.bone(`head`),t=this.bone(`jaw`),n=this.tmp.copy(this.bones[e].matrix).multiply(this.tmp2.copy(this.bind[e]).invert());for(let e of this.eyes){e.group.matrix.copy(n).multiply(e.rest);let t=new K().makeRotationFromEuler(e.look);e.eyeball.matrixAutoUpdate=!1,e.eyeball.matrix.copy(t)}let r=new K().copy(this.bones[t].matrix).multiply(new K().copy(this.bind[t]).invert()),i=this.tongueOut,a=this.tongueReach,o=new G().setFromMatrixPosition(this.tongueRest).applyMatrix4(r),s=new G(1,0,0).transformDirection(r),c=new G(0,1,0).transformDirection(r);if(this.tongueTarget&&a>0){let e=this.tongueTarget.clone().sub(o).normalize(),t=s.angleTo(e),n=new At().setFromUnitVectors(s,e);s.applyQuaternion(new At().slerp(n,Math.min(1,.7/Math.max(t,.001))))}let l=new G().crossVectors(s,c).normalize();c.crossVectors(l,s).normalize();let u=o.addScaledVector(s,(i*.95+a*2.5)*c_);this.tongue.matrix.makeBasis(s,c,l).setPosition(u).multiply(new K().makeScale(c_*(1+i*.3+a),c_*(1-a*.15),c_*(1-i*.15))),this.tongueTip.set(.46,0,0).applyMatrix4(this.tongue.matrix),this.tongue.visible=!0}},p_=class{lengths;radii;collision;points;previous;before;beforeSegments;normals;root=new G;anchor=new G;delta=new G;velocity=new G;baseTarget=new G;time=0;remainder=0;constructor(e,t,n){this.lengths=e,this.radii=t,this.collision=n,this.points=e.map(()=>new G),this.previous=e.map(()=>new G),this.before=e.map(()=>new G),this.beforeSegments=e.map(()=>new G),this.normals=e.map(()=>new G)}reset(e,t){this.root.copy(e),this.anchor.copy(e),this.time=0,this.remainder=0;let n=e;for(let e=0;e<this.points.length;e++)this.points[e].copy(n).addScaledVector(t,this.lengths[e]),this.previous[e].copy(this.points[e]),n=this.points[e];for(let n=0;n<45;n++)this.update(1/120,e,t,0);for(let e=0;e<this.points.length;e++)this.previous[e].copy(this.points[e])}update(e,t,n,r){if(!(e>0)||!Number.isFinite(e))return;let i=1/120,a=i-this.remainder,o=e+this.remainder,s=Math.floor((o+1e-10)/i);this.remainder=Math.max(0,o-s*i);let c=this.root.clone();for(let o=1;o<=s;o++){this.time+=i,this.collision.beginStep?.(),this.anchor.lerpVectors(c,t,Math.min(1,(a+(o-1)*i)/e));let s=Math.exp(-9*i);for(let e=0;e<this.points.length;e++){let t=this.points[e];if(this.before[e].copy(t),this.normals[e].set(0,0,0),this.velocity.subVectors(t,this.previous[e]).multiplyScalar(s),this.velocity.clampLength(0,.8*i),this.previous[e].copy(t),t.add(this.velocity),t.y-=9.81*i*i,r>0&&e>6){let a=Math.sin(this.time*19+e*1.3)*r*.25*i*i;t.x+=-n.z*a,t.z+=n.x*a}}this.baseTarget.copy(this.anchor).addScaledVector(n,this.lengths[0]),this.contacts();for(let e=0;e<12;e++){this.points[0].lerp(this.baseTarget,.12);for(let e=0;e<this.points.length;e++)this.lengthConstraint(e);for(let e=this.points.length-1;e>=0;e--)this.lengthConstraint(e);for(let e=0;e<this.points.length-1;e++){let t=e===0?this.anchor:this.points[e-1],n=this.points[e+1],r=.991-e*.0014,i=(this.lengths[e]+this.lengths[e+1])*r;this.delta.subVectors(n,t);let a=this.delta.length();a>=i||a<1e-6||(this.delta.multiplyScalar((i-a)/a*(this.collision.touchesSolid?.5:.9)),e===0?n.add(this.delta):(t.addScaledVector(this.delta,-.5),n.addScaledVector(this.delta,.5)))}this.limitFold(n),e%3==2&&this.contacts()}for(let e=0;e<30;e++){for(let e=this.points.length-1;e>=0;e--)this.lengthConstraint(e);for(let e=0;e<this.points.length;e++)this.lengthConstraint(e);if(e%3==2&&(this.contacts(),this.points.every((e,t)=>Math.abs(e.distanceTo(t===0?this.anchor:this.points[t-1])-this.lengths[t])<.001)))break}for(let e=0;e<this.points.length;e++){let t=this.normals[e];this.velocity.subVectors(this.points[e],this.previous[e]).clampLength(0,.8*i),t.lengthSq()>1e-6&&(t.normalize(),this.velocity.addScaledVector(t,-Math.min(0,this.velocity.dot(t))),this.velocity.multiplyScalar(Math.exp(-24*i))),this.previous[e].copy(this.points[e]).sub(this.velocity)}}this.root.copy(t)}lengthConstraint(e){let t=e===0?this.anchor:this.points[e-1],n=this.points[e];this.delta.subVectors(n,t);let r=this.delta.length();r<1e-6||(this.delta.multiplyScalar((r-this.lengths[e])/r),e===0?n.sub(this.delta):(t.addScaledVector(this.delta,.5),n.addScaledVector(this.delta,-.5)))}limitFold(e){if(this.collision.touchesSolid)return;let t=Math.atan2(e.z,e.x);for(let e=0;e<this.points.length;e++){let n=e===0?this.anchor:this.points[e-1],r=this.points[e],i=r.x-n.x,a=r.z-n.z,o=Math.atan2(a,i)-t,s=Math.atan2(Math.sin(o),Math.cos(o));if(Math.abs(s)<=1.5)continue;let c=t+Math.sign(s)*1.5,l=Math.hypot(i,a);r.x=n.x+Math.cos(c)*l,r.z=n.z+Math.sin(c)*l}}contacts(){for(let e=0;e<this.points.length;e++)this.collision.projectPoint(this.before[e],this.points[e],this.radii[e],this.normals[e]),this.beforeSegments[e].copy(this.points[e]);if(this.collision.projectSegment){let e=new G;for(let t=0;t<this.points.length;t++){let n=t===0?this.anchor:this.points[t-1];this.collision.projectSegment(n,this.points[t],t===0?this.radii[0]*.7:this.radii[t-1],this.radii[t],t===0,t===0?e:this.normals[t-1],this.normals[t])}}for(let e=0;e<this.points.length;e++)this.collision.projectPoint(this.beforeSegments[e],this.points[e],this.radii[e],this.normals[e]),this.before[e].copy(this.points[e])}},m_=U.clamp,h_=e=>(e=m_(e,0,1),e*e*(3-2*e));function g_(e,t,n){let r=t-e,i=Math.abs(r)>.008||n>Math.min(e,t)+.008;return{raised:i,liftEnd:r>.008?.32:r<-.008?.2:.28,lowerStart:r>.008?.8:r<-.008?.68:.72,duration:r<-.008?.38:i?.34:0}}function __(e,t,n,r,i,a=!1,o=new G){let s=g_(e.y,t.y,n),c=!a&&s.raised,{liftEnd:l,lowerStart:u}=s,d=t.y-e.y,f=d<-.008?0:l,p=d>.008?1:u;if(o.lerpVectors(e,t,h_(c?(r-f)/(p-f):r)),c){let i=Math.max(n,e.y,t.y)+.012;o.y=r<l?U.lerp(e.y,i,h_(r/l)):r>u?U.lerp(i,t.y,h_((r-u)/(1-u))):i}else a||(o.y+=i*Math.sin(Math.PI*r)**2);return o}var v_=class{ground;constructor(e){this.ground=e}support(e,t,n){let r={y:0,normal:new G};return this.ground.supportAt?this.ground.supportAt(e,t,n,r):(r.y=this.ground.heightAt(e,t),this.ground.normalAt(e,t,r.normal),r)}find(...e){let t=this.search(...e),n=t.next();for(;!n.done;)n=t.next();return n.value}*search(e,t,n,r,i,a,o=[],s=r,c=1/0,l=r,u,d=.025,f=.055,p=.012){let m=new G(Math.cos(r),0,-Math.sin(r)),h=new G(-m.z,0,m.x),g=null,_=1/0;for(let r of[0,.008,.016,.024,.032,.04,.048,.056,.064,.072]){if(g&&r*r>_+1e-12)break;for(let m=0;m<(r?24:1);m++){yield;let v=m*Math.PI/12,y=e.x+r*Math.cos(v),b=e.z+r*Math.sin(v),x=this.support(y,b,t.y+.035);if(x.y>c)continue;let S=new G(y,x.y,b),C=S.distanceToSquared(e)+Math.abs(S.y-e.y)*.006;if(C>=_)continue;let w=S.clone().addScaledVector(x.normal,.0075).distanceTo(t);if(w>n*.92||w<n*.31||x.normal.y<.48||S.clone().sub(t).dot(h)*i<.009)continue;let T=.007,E=this.support(y-T,b,x.y+.012).y,D=this.support(y+T,b,x.y+.012).y,O=this.support(y,b-T,x.y+.012).y,k=this.support(y,b+T,x.y+.012).y;if(Math.max(E,D,O,k)-Math.min(E,D,O,k)>.016)continue;let A=new G(E-D,2*T,O-k).normalize();if(A.y<.55)continue;let j=!0,ee=new G(Math.cos(l),0,-Math.sin(l)),M=new G(-ee.z,0,ee.x);for(let e of o){let t=ee.x*e.x+M.x*e.z,n=ee.z*e.x+M.z*e.z;if(Math.abs(y+t)>Z.w/2-.014||Math.abs(b+n)>Z.d/2-.014){j=!1;break}let r=S.y-(A.x*t+A.z*n)/A.y;if(this.support(y+t,b+n,Math.max(r,S.y)+.025).y>r+.002){j=!1;break}if(this.ground.tailContacts){let e=new G(y+t,r+.0015,b+n),i=e.clone();if(this.ground.tailContacts.projectPoint(e,i,.001,new G),e.distanceTo(i)>.002){j=!1;break}}}if(!j)continue;let N=S.y;if(a){if(Math.abs(S.y-a.y)>n*1.15)continue;let e=Math.max(2,Math.ceil(a.distanceTo(S)/.005));for(let t=0;t<=e;t++)for(let n of[-.008,0,.008]){let r=a.clone().lerp(S,t/e).addScaledVector(h,n);N=Math.max(N,this.support(r.x,r.z,Math.max(a.y,S.y)+f).y)}let t=Math.atan2(Math.sin(l-s),Math.cos(l-s));for(let n=0;n<=e;n++){let r=a.clone().lerp(S,n/e),i=s+t*n/e,c=Math.cos(i),l=Math.sin(i);for(let e of o){let t=c*e.x+l*e.z,n=-l*e.x+c*e.z;N=Math.max(N,this.support(r.x+t,r.z+n,Math.max(a.y,S.y)+f).y)}}if(N>Math.max(a.y,S.y)+d)continue;if(f<.055){if(!this.ground.tailContacts)continue;let n=this.support(a.x,a.z,a.y+.012).normal;for(let r=0;r<=Math.max(12,e*2)&&j;r++){let i=r/Math.max(12,e*2),c=__(a,S,N,i,p),l=h_(i),u=s+t*l,d=Math.cos(u),f=Math.sin(u),m=n.clone().lerp(A,l).normalize();for(let e of[new G,...o]){let t=d*e.x+f*e.z,n=-f*e.x+d*e.z,r=new G(c.x+t,c.y-(m.x*t+m.z*n)/Math.max(.4,m.y)+.0015,c.z+n),i=r.clone();if(this.ground.tailContacts.projectPoint(r,i,.001,new G),r.distanceTo(i)>.002){j=!1;break}}}if(!j)continue}}let te={point:S,normal:A,top:N};C<_&&(!u||u(te))&&(_=C,g=te)}if(g&&r>=.016)break}let v=Math.min(.045,n*.65);if(!g&&a&&d<v)return yield*this.search(e,t,n,r,i,a,o,s,c,l,u,v,f,p);if(!g&&a&&f>.018&&this.ground.tailContacts){let d=Math.cos(s),f=Math.sin(s);if([new G,...o].some(e=>{let t=a.x+d*e.x+f*e.z,n=a.z-f*e.x+d*e.z,r=this.support(t,n,a.y+.018).y;if(this.support(t,n,a.y+.055).y-r<.025||r>a.y+.004)return!1;let i=new G(t,a.y+.0015,n),o=i.clone();return this.ground.tailContacts.projectPoint(i,o,.001,new G),i.distanceTo(o)<.002}))return yield*this.search(e,t,n,r,i,a,o,s,c,l,u,v,.018,p)}return g}};function y_(e,t){let n=Z.w/2-.004-t,r=Z.d/2-.004-t;return e.x=Math.max(-n,Math.min(n,e.x)),e.z=Math.max(-r,Math.min(r,e.z)),e}var b_=.0015,Q=c_,x_=new G(0,1,0),S_=new G,C_=new G,w_=new G,T_=new K,E_=new K,D_=new At,$=(e,t,n)=>Math.min(n,Math.max(t,e)),O_=(e,t,n,r)=>e+(t-e)*(1-Math.exp(-n*r)),k_=e=>Math.atan2(Math.sin(e),Math.cos(e)),A_=e=>e*e*(3-2*e);function j_(e,t,n){let r=S_.copy(e).normalize(),i=C_.crossVectors(r,t);i.lengthSq()<1e-8&&i.crossVectors(r,new G(0,0,1)),i.normalize();let a=w_.crossVectors(i,r).normalize();return n.makeBasis(r,a,i)}var M_=class{model;inputs={tracking:!1,restAdjustment:!1,x:0,z:0,heading:0,speed:0,turnRate:0,clearance:.7,chestLift:0,headPitch:0,look:null,jaw:0,tongue:0,display:0,lid:1,breath:1,lunge:0,bob:0,wave:0,sideLean:0,tailTwitch:0,shake:0,swallow:0,headTilt:0,flatten:0,tone:0,beardDark:0,tongueReach:0};phase=0;bend=0;bodyY=0;bodyPitch=0;bodyRoll=0;legs=[];spineNames=[`head`,`neck`,`chest`,`spine2`,`spine1`,`pelvis`];spineIdx;flankSkin=[];flankPatches=[];flankPoints=[];flankMatrices=Array.from({length:6},()=>new K);flankScratch={v:new G,q:new G,n:new G,center:new G,scale:new G};spineBindX;spineBindY;tailIdx;tailBind;tailPts=[];tailDynamics;tailLen=[];tailRadius=[];bindTilt=[];boneWorld;headLift=[0,0];headYaw=0;headPitchCur=0;headRollCur=0;headGoalYaw=0;headGoalPitch=0;headHold=0;blinkT=2;blink=0;time=0;gularT=0;eyeLook=new un;eyeGoal=new un;eyeHold=0;rootX=4.1;snout=new G;headForward=new G(1,0,0);mouth=new G;moving=!1;sprint=0;walkExtension=0;strideHz=.85;initialised=!1;hasPose=!1;poseDt=1/60;footholds;stepSearch=null;stepWorkRemaining=48;collision;accepted=null;blocked=!1;climbing=!1;carefulTurn=!1;rebalancePoint=null;nextComfortStep=0;nextTransferTime=0;maneuver=`walk`;motionSpeed=0;jawOpen=0;previousHead={yaw:0,pitch:0};headPitchFloor=-1.15;headSkin=[];get placingFoot(){return this.climbing&&this.legs.some(e=>e.swing)}get canRedirect(){return!this.legs.some(e=>e.swing)&&Math.abs(this.bodyPitch)<.2&&Math.max(...this.legs.map(e=>e.planted.y))-Math.min(...this.legs.map(e=>e.planted.y))<.012}get needsRecovery(){return this.legs.some(e=>e.swing&&e.returning&&(e.swingElapsed??0)>.8)}get canPickUpPrey(){return this.legs.filter(e=>!e.swing).length>=3&&this.legs.every(e=>!e.front||!e.swing)&&!this.needsRecovery&&Math.abs(this.motionSpeed)<.035}recoveryCost(e,t,n=0){let r=this.inputs,i=r.x,a=r.z,o=r.heading;try{return r.x+=.001*(Math.cos(r.heading)*e+Math.sin(r.heading)*t),r.z+=.001*(-Math.sin(r.heading)*e+Math.cos(r.heading)*t),r.heading+=n*.01,this.composeBody(),this.solveSpine(0),this.supportError()}finally{r.x=i,r.z=a,r.heading=o,this.composeBody(),this.solveSpine(0)}}supportedTransferShoulder(e,t){let n=this.inputs,r=n.x,i=n.z;try{return n.x+=this.bodyFwd.x*t,n.z+=this.bodyFwd.z*t,this.composeBody(),this.solveSpine(0),this.supportError(1e-4,void 0,void 0,e)<=1e-4?this.shoulder(e):null}finally{n.x=r,n.z=i,this.composeBody(),this.solveSpine(0)}}motion={speed:0,turnRate:0,blocked:!1,transferring:!1};ground;onFootDown;constructor(e,t){this.model=e;let n=()=>this.initialised?this.bodyY+.055:t.heightAt(this.inputs.x,this.inputs.z)+.055,r=(e,r)=>t.heightBelow?t.heightBelow(e,r,n()):t.heightAt(e,r);this.ground={heightAt:r,tailContacts:t.tailContacts,kindAt:t.kindAt?.bind(t),supportAt:t.supportAt?.bind(t),normalAt:(e,i,a=new G)=>{if(t.heightBelow&&t.heightAt(e,i)>n()){let t=.002;return a.set(r(e-t,i)-r(e+t,i),2*t,r(e,i-t)-r(e,i+t)).normalize()}return t.normalAt(e,i,a)}},this.footholds=new v_(this.ground),this.collision=t.tailContacts;let i=e.data;for(let t of[`head`,`neck`,`jaw`]){let n=e.bone(t),r=e.mesh.geometry,i=r.attributes.position,a=r.attributes.skinIndex,o=r.attributes.skinWeight,s=e.bind[n].clone().invert(),c=[];for(let e=0;e<i.count;e++)for(let t=0;t<4;t++)if(a.getComponent(e,t)===n&&o.getComponent(e,t)>.7){c.push(new G().fromBufferAttribute(i,e).applyMatrix4(s));break}let l=new Map,u=new Set;for(let e of c){let t=e.toArray().map(e=>Math.floor(e/.16)).join(`,`);if(u.has(t))continue;u.add(t);let n=e.toArray().map(e=>Math.floor(e/.6)).join(`,`),r=l.get(n)??[];r.push(e),l.set(n,r)}let d=[...l.values()].map(e=>{let t=new Zn().setFromPoints(e).getCenter(new G);return{center:t,radius:Math.max(...e.map(e=>e.distanceTo(t)))*Q,points:e}});this.headSkin.push({bone:n,patches:d})}this.spineIdx=this.spineNames.map(t=>e.bone(t));{let t=e.mesh.geometry,n=t.attributes.position,r=t.attributes.skinIndex,i=t.attributes.skinWeight,a=new Map,o=this.spineIdx.map(t=>e.bind[t].clone().invert());for(let e=0;e<n.count;e++){if(Math.abs(n.getZ(e))<1.6)continue;let t=!0;for(let n=0;n<4;n++)if(i.getComponent(e,n)>.001&&this.spineIdx.indexOf(r.getComponent(e,n))<2){t=!1;break}if(!t)continue;let o=[Math.floor(n.getX(e)/.4),Math.floor(n.getY(e)/.4),Math.sign(n.getZ(e))].join(`,`),s=a.get(o);(s===void 0||Math.abs(n.getZ(e))>Math.abs(n.getZ(s)))&&a.set(o,e)}let s=new Map;for(let e of a.values()){let t=[];for(let a=0;a<4;a++)if(i.getComponent(e,a)>.001){let s=this.spineIdx.indexOf(r.getComponent(e,a));t.push({k:s,local:new G().fromBufferAttribute(n,e).applyMatrix4(o[s]),weight:i.getComponent(e,a)})}let a=[Math.floor(n.getX(e)/1.2),Math.floor(n.getY(e)/1.2),Math.sign(n.getZ(e))].join(`,`),c=s.get(a)??[];c.push(this.flankSkin.length),s.set(a,c),this.flankSkin.push({parts:t})}this.flankPatches=[...s.values()],this.flankPoints=this.flankSkin.map(()=>new G)}this.spineBindX=this.spineIdx.map(e=>i.bones[e].origin[0]),this.spineBindY=this.spineIdx.map(e=>i.bones[e].origin[1]),this.tailIdx=Array.from({length:10},(t,n)=>e.bone(`tail${n+1}`)),this.tailBind=this.tailIdx.map(e=>new G(...i.bones[e].origin)),this.tailBind.push(new G(-16.3,.23,0)),this.boneWorld=i.bones.map(()=>new K);let a=[...this.spineBindX,...this.tailBind.map(e=>e.x)],o=[...this.spineBindY,...this.tailBind.map(e=>e.y)];[...this.spineIdx,...this.tailIdx].forEach((e,t)=>{let n=Math.max(0,t-1),r=t===5?5:Math.min(a.length-1,t+1),i=new G(a[n]-a[r],o[n]-o[r],0).normalize();this.bindTilt[e]=j_(i,x_,new K).clone()});let s=i.bones[e.bone(`pelvis`)].origin[0],c=new G(s,i.bones[e.bone(`pelvis`)].origin[1],0);for(let e of this.tailBind)this.tailLen.push(c.distanceTo(e)*Q),c=e;let l=i.profile,u=e=>{let t=$(Math.round((e+17.2)/.5),0,l.length-1);return Math.max(l[t][1],l[t][3])};this.tailRadius=this.tailBind.map(e=>u(e.x)*Q*1.06+4e-4);let d=t.tailContacts??{projectPoint:(e,n,r,i)=>{y_(n,r+.01);let a=(t.heightBelow?t.heightBelow(n.x,n.z,n.y+r):t.heightAt(n.x,n.z))+r;return n.y>=a?!1:(n.y=a,i.y+=1,!0)}};this.tailDynamics=new p_(this.tailLen,this.tailRadius,d);let f={"front-1":0,hind1:.06,front1:.5,"hind-1":.56};for(let t of i.limbs){let n=e.bind[t.bones.hand],r=t.kind===`front`,i={data:t,front:r,side:t.side,offset:f[`${t.kind}${t.side}`]??0,planted:new G,plantedYaw:0,normal:new G(0,1,0),swing:!1,swingT:0,swingDur:.2,swingStall:0,avoiding:!1,returning:!1,settling:!1,failedStep:null,failedUntil:0,from:new G,to:new G,fromYaw:0,toYaw:0,toNormal:new G(0,1,0),fromNormal:new G(0,1,0),heel:0,homeLocal:new G(t.wrist[0]+t.forward[0]*.05,0,t.wrist[2]*1.02),lastPhase:0,liftScale:r?.55:.75,wristAbove:t.wrist[1]-.13,digitRel:t.bones.digits.map(t=>n.clone().invert().multiply(e.bind[t])),handBindInv:n.clone().invert(),bindUpper:e.bind[t.bones.upper].clone(),bindLower:e.bind[t.bones.lower].clone(),reach:(t.upperLength+t.lowerLength)*Q,stepDue:!1,stepTop:0,bendDirection:new G,wristDirection:new G,handForward:new G,handNormal:new G,nextPlanTime:0,footprint:t.digits.flatMap(e=>[e.base,e.tip]).map(e=>new G((e[0]-t.wrist[0])*Q,0,(e[2]-t.wrist[2])*Q)),digitHand:null,limbSkin:[t.bones.upper,t.bones.lower].map(t=>{let n=e.mesh.geometry,r=n.attributes.position,i=n.attributes.skinIndex,a=n.attributes.skinWeight,o=e.bind[t].clone().invert(),s=[];for(let e=0;e<r.count;e++)for(let n=0;n<4;n++)if(i.getComponent(e,n)===t&&a.getComponent(e,n)>.7){s.push(new G().fromBufferAttribute(r,e).applyMatrix4(o).multiplyScalar(Q));break}let c=new Set;for(let e=0;e<=8;e++)for(let t=0;t<16;t++){let n=e*Math.PI/8,r=t*Math.PI/8,i=new G(Math.cos(n),Math.sin(n)*Math.cos(r),Math.sin(n)*Math.sin(r)),a=s[0],o=-1/0;for(let e of s){let t=e.dot(i);t>o&&(o=t,a=e)}c.add(a)}let l=Math.min(...s.map(e=>e.x)),u=Math.max(...s.map(e=>e.x));for(let e=0;e<6;e++)for(let t=0;t<8;t++){let n=Math.cos(t*Math.PI/4),r=Math.sin(t*Math.PI/4),i,a=-1/0;for(let t of s)if(Math.min(5,Math.floor((t.x-l)/(u-l)*6))===e){let e=t.y*n+t.z*r;e>a&&(a=e,i=t)}i&&c.add(i)}return[...c]})},a=e.mesh.geometry,o=a.attributes.position,s=a.attributes.skinIndex,c=a.attributes.skinWeight,l=new Map;for(let e=0;e<o.count;e++)for(let n=0;n<4;n++)if(s.getComponent(e,n)===t.bones.hand&&c.getComponent(e,n)>.7){let n=`${Math.floor((o.getX(e)-t.wrist[0])/.25)},${Math.floor((o.getZ(e)-t.wrist[2])/.25)}`,r=l.get(n);(r===void 0||o.getY(e)<o.getY(r))&&l.set(n,e);break}for(let e of l.values())i.footprint.push(new G((o.getX(e)-t.wrist[0])*Q,0,(o.getZ(e)-t.wrist[2])*Q));this.legs.push(i)}}body=new K;bodyFwd=new G;bodyUp=new G;bodyRight=new G;bodyToWorld(e,t){return t.set((e.x-this.rootX)*Q,e.y*Q,e.z*Q).applyMatrix4(this.body)}footSupport(e,t,n={y:0,normal:new G}){let r=this.footholds.support(e,t,this.bodyY+.055);return n.y=r.y,n.normal.copy(r.normal),n}shoulder(e){let t=e.front?2:5,n=this.model.data.bones[this.spineIdx[t]].origin,r=1+.035*(Math.sin(this.time*Math.PI*2/2.6)*.5+.5)*this.inputs.breath,i=this.inputs.flatten*(t===5?.5:1),a=(t===2?1+(r-1)*.6:1)*(1-.14*i),o=(t===2?r:1)*(1+.17*i);return new G(e.data.root[0]-n[0],e.data.root[1]-n[1],e.data.root[2]-n[2]).multiply(new G(Q,Q*a,Q*o)).applyMatrix4(this.spineFrame[t]).add(this.spinePos[t])}homeWorld(e,t,n=0){let r=e.homeLocal,i=this.inputs,a=this.ground.heightAt(i.x,i.z),o=i.x+this.bodyRight.x*r.z*Q,s=i.z+this.bodyRight.z*r.z*Q,c=this.ground.heightAt(o,s),l=this.ground.kindAt?.(i.x,i.z),u=a<.12&&c>a+.03,d=(l===1||l===2)&&c<a-.025,f=Math.min(Z.w/2-Math.abs(i.x),Z.d/2-Math.abs(i.z))<.12,p=!!this.ground.kindAt&&Math.abs(i.x-.475)<.11&&i.z<.18&&a<.12,m=f||p||d?.55:u?.7:1-.15*this.walkExtension;return t.copy(this.bodyFwd).multiplyScalar((r.x-this.rootX)*Q+n).addScaledVector(this.bodyRight,r.z*Q*m*(1-this.walkExtension*.045)),t.applyAxisAngle(x_,this.turnLead()),t.x+=this.inputs.x,t.z+=this.inputs.z,y_(t,.028),t.y=this.footSupport(t.x,t.z).y,t}turnLead(){return this.carefulTurn||this.climbing?$(this.inputs.turnRate*.18,-.18,.18):0}footYaw(e){let t=this.inputs,n=Math.min(Z.w/2-Math.abs(t.x),Z.d/2-Math.abs(t.z))<.12||!!this.ground.kindAt&&Math.abs(t.x-.475)<.11&&t.z<.18&&this.ground.heightAt(t.x,t.z)<.12||this.ground.kindAt?.(t.x,t.z)===1||this.ground.kindAt?.(t.x,t.z)===2,r=Math.atan2(-e.data.forward[2],e.data.forward[0]);return t.heading+this.turnLead()-(n?r*.9:0)}poseState(){let e=this.inputs;return{x:e.x,z:e.z,heading:e.heading,y:this.bodyY,pitch:this.bodyPitch,roll:this.bodyRoll,bend:this.bend,lift:e.chestLift,lunge:e.lunge}}composeBody(){let e=this.inputs,t=new At().setFromEuler(new un(this.bodyRoll,e.heading,this.bodyPitch,`YZX`)),n=e.lunge*1.6*Q;this.body.compose(new G(e.x+Math.cos(e.heading)*n,this.bodyY-this.spineBindYAt(this.rootX)*Q,e.z-Math.sin(e.heading)*n),t,new G(1,1,1)),this.bodyFwd.set(1,0,0).applyQuaternion(t),this.bodyUp.set(0,1,0).applyQuaternion(t),this.bodyRight.set(0,0,1).applyQuaternion(t)}supportError(e=1/0,t,n,r){let i=0,a=(e,r)=>(r=Math.max(0,r),n&&(n[e]=r),r-(t?.[e]??0));for(let[n,o]of this.legs.entries()){if(o===r)continue;if(this.collision){let e=this.shoulder(o),t=e.clone();this.collision.projectPoint(e,t,o.front?.012:.016,new G),i=Math.max(i,a(n*3,e.distanceTo(t)-.0015))}if(o.front&&o.side<0&&this.inputs.wave>.01)continue;let s=o.swing&&o.returning&&!o.settling,c=s?this.transferPose(o,o.swingT).W:(o.swing?o.to.clone():o.planted.clone()).addScaledVector(o.swing?o.toNormal:o.normal,(.12+o.wristAbove)*Q),l=this.shoulder(o),u=l.distanceTo(c),d=s?(o.data.upperLength+o.data.lowerLength)*Q*.999:o.reach*(o.swing?.94:.96),f=s&&!o.front?this.minimumTransferReach(o):o.reach*(o.front?.4:.3),p=Math.max(100*(u-d),100*(f-u));if(o.swing&&o.supportArc)for(let e of o.supportArc){let t=l.distanceTo(e);p=Math.max(p,100*(t-o.reach*.98),100*(this.minimumTransferReach(o)-t))}if(o.swing&&!o.returning){let e=this.transferPose(o,o.swingT);p=Math.max(p,100*(o.reach*.4-e.distance))}if(i=Math.max(i,a(n*3+1,p)),i>e)return i;if(this.collision&&o.bendDirection.lengthSq()>.5){let r=o.swing?this.transferPose(o,o.swingT):this.transferPoseFor(o,o.planted,o.normal,l);i=Math.max(i,a(n*3+2,this.limbObstruction(o,l,r.W,r.plane,e+b_+(t?.[n*3+2]??0))-b_))}if(i>e)return i}for(let t of[2,3,4,5])for(let n of[-1,0,1]){let r=12+(t-2)*6+(n+1)*2,o=this.spinePos[t].clone().addScaledVector(this.bodyRight,n*(t===3||t===4?.016:.01)),s=t===2||t===3||t===4?.016:.012;if(this.collision){let e=o.clone();this.collision.projectPoint(o,e,s,new G),i=Math.max(i,a(r,o.distanceTo(e)-.0015))}else i=Math.max(i,a(r,this.ground.heightAt(o.x,o.z)+s-o.y-.0015));let c=y_(o.clone(),s+.004);if(i=Math.max(i,a(r+1,c.distanceTo(o))),i>e)return i}for(let t of[2,3,4])for(let n of[-1,0,1]){let r=37+(t-2)*3+n+1,o=t===2?.013:t===3?.016:.013,s=this.spinePos[t].clone().lerp(this.spinePos[t+1],.5).addScaledVector(this.bodyRight,n*o);if(this.collision){let e=s.clone();this.collision.projectPoint(s,e,.016,new G),i=Math.max(i,a(r,s.distanceTo(e)-.0015))}else i=Math.max(i,a(r,this.ground.heightAt(s.x,s.z)+.016-s.y-.0015));if(i>e)return i}if(this.collision){let t=this.flankMatrices,n=this.flankPoints,{v:r,q:o,n:s,center:c,scale:l}=this.flankScratch;for(let e=0;e<6;e++)t[e].copy(this.spineFrame[e]).scale(this.spineScale(e,l)).setPosition(this.spinePos[e]);for(let e=0;e<n.length;e++){let i=n[e].set(0,0,0);for(let n of this.flankSkin[e].parts)i.addScaledVector(r.copy(n.local).applyMatrix4(t[n.k]),n.weight)}for(let t of this.flankPatches){c.set(0,0,0);for(let e of t)c.add(n[e]);c.divideScalar(t.length);let r=.002;for(let e of t)r=Math.max(r,n[e].distanceTo(c)+.002);if(o.copy(c),this.collision.projectPoint(c,o,r,s.set(0,0,0)),!(c.distanceToSquared(o)<1e-16))for(let r of t){let t=n[r];if(o.copy(t),this.collision.projectPoint(t,o,.002,s.set(0,0,0)),i=Math.max(i,a(46+r,t.distanceTo(o)-.0015)),i>e)return i}}}return Math.max(i,a(36,this.headContactDepth(e+.001+(t?.[36]??0))-.001))}supportPose(){let e=this.poseState(),t=this.accepted;if(this.blocked=!1,!t){this.accepted=e;return}let n=new Map,r=(e=1/0)=>{let t=this.poseState(),r=Object.values(t).join(`,`),i=n.get(r);if(i!==void 0)return i;let a=this.supportError(e);return a<=e&&n.set(r,a),a},i=this.legs.filter(e=>e.swing&&(e.avoiding||e.swingStall>.05)),a=()=>{let e=r();if(e>1e-4)return 1+e*100;let t=0;for(let e of i){let n=this.transferPose(e,Math.min(1,e.swingT+this.poseDt/e.swingDur)),r=this.minimumTransferReach(e);t=Math.max(t,this.limbObstruction(e,n.S,n.W,n.plane)-b_,100*(r-n.distance))}return t},o=e=>{Object.assign(this.inputs,{x:e.x,z:e.z,heading:e.heading,chestLift:e.lift,lunge:e.lunge}),this.bodyY=e.y,this.bodyPitch=e.pitch,this.bodyRoll=e.roll,this.bend=e.bend,this.composeBody(),this.solveSpine(0)};if(this.legs.some(e=>e.swing&&e.supportArc)&&!this.legs.some(e=>e.swing&&(e.returning||e.swingStall>.05))){if(o(t),r(1e-4)<=1e-4){this.accepted=this.poseState();return}o(e)}let s=$(e.lunge,t.lunge-8*this.poseDt,t.lunge+12*this.poseDt);if(s!==e.lunge&&(e.lunge=s,o(e)),!this.moving&&!this.legs.some(e=>e.swing)&&Math.hypot(e.x-t.x,e.z-t.z)<1e-5&&Math.abs(k_(e.heading-t.heading))<1e-4&&Math.abs(e.lift-t.lift)<1e-4&&Math.abs(e.lunge-t.lunge)<1e-4&&Math.abs(e.y-t.y)<.0015&&Math.abs(e.pitch-t.pitch)<.015&&Math.abs(e.roll-t.roll)<.015){if(o({...e,y:t.y,pitch:t.pitch,roll:t.roll}),r(1e-4)<=1e-4){this.accepted=this.poseState();return}o(e)}let c=()=>{let e=this.poseState(),n=a(),s={...e},c=[[`y`,.085],[`pitch`,.9],[`roll`,.65]],l=!this.climbing||Math.abs(t.pitch)<.2&&Math.max(...this.legs.map(e=>e.planted.y))-Math.min(...this.legs.map(e=>e.planted.y))<.025;this.moving&&l&&Math.abs(t.roll)>.3&&Math.abs(this.motion.speed)<.01&&!this.rebalancePoint&&(this.rebalancePoint=new W(t.x,t.z)),this.rebalancePoint&&Math.hypot(this.inputs.x-this.rebalancePoint.x,this.inputs.z-this.rebalancePoint.y)>.1&&(this.rebalancePoint=null);let u=this.moving&&l&&this.rebalancePoint!==null,d=i.length||u?[[`x`,.03],[`z`,.03]]:[],f=u?[...d,...c]:[...c,...d];for(let r=0;r<3&&n>1e-4;r++)for(let[r,i]of f){if(n<=1e-4)break;for(let c of[-1,1]){let l=u&&(r===`x`||r===`z`)?s[r]:t[r],d={...e,[r]:$(e[r]+c*i*this.poseDt,l-i*this.poseDt,l+i*this.poseDt)};o(d);let f=a();f<n-1e-7&&(n=f,e=d)}o(e)}if(n>1e-4&&this.moving){let r={...e};for(let i of[-1,0,1])for(let s of[-1,0,1])for(let c of[-1,0,1]){if(Number(i!==0)+Number(s!==0)+Number(c!==0)<2)continue;let l={...r,y:$(r.y+i*.085*this.poseDt,t.y-.085*this.poseDt,t.y+.085*this.poseDt),pitch:$(r.pitch+s*.9*this.poseDt,t.pitch-.9*this.poseDt,t.pitch+.9*this.poseDt),roll:$(r.roll+c*.65*this.poseDt,t.roll-.65*this.poseDt,t.roll+.65*this.poseDt)};o(l);let u=a();u<n-1e-7&&(n=u,e=l)}o(e)}let p=this.ground.heightAt(this.inputs.x,this.inputs.z)>.12||this.legs.some(e=>e.planted.y>.12);if(n>1e-4&&this.moving&&p&&(i.some(e=>(e.swingElapsed??0)>.3)||Math.abs(this.motion.speed)<.001&&Math.abs(this.motion.turnRate)<.03)){let r=[[`x`,.03],[`z`,.03],[`y`,.085],[`pitch`,.9],[`roll`,.65]],s={...e},c=()=>{let e=[];this.supportError(1/0,void 0,e);for(let t of i){let n=this.transferPose(t,Math.min(1,t.swingT+this.poseDt/t.swingDur));e.push(Math.max(0,this.limbObstruction(t,n.S,n.W,n.plane)-b_)),e.push(Math.max(0,100*(this.minimumTransferReach(t)-n.distance)))}return Array.from({length:e.length},(t,n)=>e[n]??0)},l=c(),u=l.map(()=>Array(r.length).fill(0));for(let[e,[t,n]]of r.entries()){let r=n*this.poseDt;o({...s,[t]:s[t]+r});let i=c();o({...s,[t]:s[t]-r});let a=c();for(let t=0;t<l.length;t++)u[t][e]=((i[t]??0)-(a[t]??0))*.5}let d=Array(r.length).fill(0);for(let e=0;e<16;e++)for(let e=0;e<l.length;e++){let t=u[e],n=t.reduce((e,t)=>e+t*t,0);if(n<1e-16)continue;let i=l[e]+t.reduce((e,t,n)=>e+t*d[n],0)-5e-5;if(!(i<=0))for(let e=0;e<r.length;e++)d[e]=$(d[e]-t[e]*i/n,-1,1)}for(let i of[1,.5,.25]){let c={...s};for(let[e,[n,a]]of r.entries())c[n]=$(s[n]+d[e]*a*this.poseDt*i,t[n]-a*this.poseDt,t[n]+a*this.poseDt);o(c);let l=a();l<n-1e-7&&(n=l,e=c)}o(e)}if(n<=1e-4&&!this.moving){let t=0,i=1;for(let n=0;n<6;n++){let n=(t+i)/2;o({...e,y:U.lerp(s.y,e.y,n),pitch:U.lerp(s.pitch,e.pitch,n),roll:U.lerp(s.roll,e.roll,n)}),r(1e-4)<=1e-4?i=n:t=n}o({...e,y:U.lerp(s.y,e.y,i),pitch:U.lerp(s.pitch,e.pitch,i),roll:U.lerp(s.roll,e.roll,i)}),n=r()}return r()};if(this.moving&&r(1e-4)>1e-4){let e=this.poseState(),n=r(),i=this.ground.heightAt(this.inputs.x,this.inputs.z)<.12&&this.legs.every(e=>e.planted.y<.12&&(!e.swing||e.to.y<.12));o({...e,y:t.y,pitch:t.pitch,roll:t.roll,bend:t.bend,lift:i?t.lift:e.lift,lunge:i?t.lunge:e.lunge}),r()>n&&o(e)}(r(1e-4)>1e-4||i.length)&&c(),e=this.poseState();let l=(n,r=n)=>{let i=this.inputs;i.x=U.lerp(t.x,e.x,r),i.z=U.lerp(t.z,e.z,r),i.heading=t.heading+k_(e.heading-t.heading)*r,this.bodyY=U.lerp(t.y,e.y,n),this.bodyPitch=U.lerp(t.pitch,e.pitch,n),this.bodyRoll=U.lerp(t.roll,e.roll,n),this.bend=U.lerp(t.bend,e.bend,n),i.chestLift=U.lerp(t.lift,e.lift,n),i.lunge=U.lerp(t.lunge,e.lunge,n),this.composeBody(),this.solveSpine(0)};if(r(1e-4)>1e-4){l(0);let t=[];this.supportError(1/0,void 0,t);for(let e=0;e<t.length;e++)t[e]=Math.max(0,(t[e]??0)-11e-5);let n=()=>this.supportError(1e-4,t)<=1e-4;if(l(1,0),c(),!n()){let e=0,t=1;for(let r=0;r<8;r++){let r=(e+t)/2;l(r),n()?e=r:t=r}l(e)}this.blocked=Math.hypot(this.inputs.x-e.x,this.inputs.z-e.z)>5e-5||Math.abs(k_(this.inputs.heading-e.heading))>.001}this.accepted=this.poseState()}reset(){this.rebalancePoint=null;let e=this.inputs;this.initialised=!1,this.hasPose=!1,this.accepted=null,this.motionSpeed=0,this.headPitchFloor=-1.15,this.stepSearch=null,this.nextTransferTime=0,this.computeBodyFrame(1,!0),this.solveSpine(0);for(let t of this.legs){this.homeWorld(t,t.planted);let n=this.footholds.find(t.planted,this.shoulder(t),t.reach,e.heading,t.side,void 0,t.footprint);n&&(t.planted.copy(n.point),t.normal.copy(n.normal)),t.from.copy(t.planted),t.to.copy(t.planted),t.toNormal.copy(t.normal),t.fromNormal.copy(t.normal),t.plantedYaw=e.heading,t.swing=!1,t.swingStall=0,t.swingElapsed=0,t.avoiding=!1,t.returning=!1,t.supportArc=null,t.failedStep=null,t.failedUntil=0,t.settling=!1,t.stepDue=!1,t.nextPlanTime=0,t.bendDirection.set(0,0,0),t.wristDirection.set(0,0,0),t.handForward.set(0,0,0),t.handNormal.set(0,0,0),t.lastPhase=(this.phase+t.offset)%1,t.digitHand=null,t.normal.copy(this.footSupport(t.planted.x,t.planted.z).normal)}let t=this.bodyToWorld(new G(.9,this.spineBindY[5],0),new G);this.tailDynamics.reset(t,this.bodyFwd.clone().negate()),this.tailPts=this.tailDynamics.points,this.initialised=!0,this.accepted=this.poseState()}computeBodyFrame(e,t=!1){let n=this.inputs,r=new G(Math.cos(n.heading),0,-Math.sin(n.heading)),i=new G(-r.z,0,r.x),a=(e,t=0)=>this.ground.heightAt(n.x+r.x*e+i.x*t,n.z+r.z*e+i.z*t),o=(a(.045)+a(.065))/2,s=(a(-.035)+a(-.055))/2,c=$(Math.atan2(o-s,.1),-.65,.65),l=$(Math.atan2(a(0,-.025)-a(0,.025),.05),-.22,.22)+n.sideLean,u=A_($(this.motionSpeed/.04,0,1)),d=this.moving?Math.abs(Math.sin(this.phase*Math.PI*2))*.1*u:0,f=a(0)+(n.clearance+1.05+d+this.sprint*.6)*Q;for(let e of[-.055,-.035,-.015,.015,.035,.055])f=Math.max(f,a(e)+.018-e*Math.sin(c));if(t)this.bodyY=f,this.bodyPitch=c,this.bodyRoll=l;else{let t=this.accepted;this.bodyY=O_(this.bodyY,f,8,e),this.bodyPitch=O_(this.bodyPitch,c,7,e),this.bodyRoll=O_(this.bodyRoll,l,6,e),t&&(this.bodyY=$(this.bodyY,t.y-.085*e,t.y+.085*e),this.bodyPitch=$(this.bodyPitch,t.pitch-.9*e,t.pitch+.9*e),this.bodyRoll=$(this.bodyRoll,t.roll-.65*e,t.roll+.65*e))}this.composeBody()}fitBodyHeight(e){let t=-1/0,n=1/0;for(let e of this.legs){if(e.swing&&e.returning&&!e.settling)continue;let r=this.shoulder(e),i=(e.swing?e.to.clone():e.planted.clone()).addScaledVector(e.swing?e.toNormal:e.normal,(.12+e.wristAbove)*Q),a=(r.x-i.x)**2+(r.z-i.z)**2,o=e.reach*.94;if(a>=o*o)continue;let s=Math.sqrt(o*o-a),c=r.y-this.bodyY;t=Math.max(t,i.y-s-c),n=Math.min(n,i.y+s-c)}if(t<=n){let r=$(this.bodyY,t,n),i=this.accepted;this.bodyY=i?$(r,i.y-.085*e,i.y+.085*e):r,this.composeBody(),this.solveSpine(0)}}spineBindYAt(e){let t=this.model.data.profile;return t[$(Math.round((e+17.2)/.5),0,t.length-1)][4]}update(e){this.initialised||this.reset(),e=Math.min(e,1/20),this.poseDt=e,this.previousHead={yaw:this.headYaw,pitch:this.headPitchCur},this.stepWorkRemaining=48,this.time+=e;let t=this.inputs;this.jawOpen=O_(this.jawOpen,t.jaw,25,e);let n=Math.hypot(t.speed,t.lateralSpeed??0)/Q,r=this.legs.map(e=>e.planted.y),i=this.ground.kindAt?.(t.x,t.z);this.climbing=i===1||i===2||!!this.ground.kindAt&&Math.abs(t.x-.475)<.11&&t.z<.18&&this.ground.heightAt(t.x,t.z)<.12||Math.max(...r)-Math.min(...r)>.009||Math.abs(this.ground.heightAt(t.x+Math.cos(t.heading)*.06,t.z-Math.sin(t.heading)*.06)-this.ground.heightAt(t.x,t.z))>.008;let a=this.moving;if(this.moving=n>.45||Math.abs(t.turnRate)>.12,this.moving&&!a)for(let e of this.legs)e.swing||(e.nextPlanTime=Math.min(e.nextPlanTime,this.time)),e.failedUntil=Math.min(e.failedUntil,this.time+1);this.carefulTurn=Math.abs(t.turnRate)>.55&&Math.abs(t.speed)<.04||Math.abs(t.lateralSpeed??0)>.002,this.maneuver=this.climbing?`climb`:this.carefulTurn?`turn`:`walk`,this.sprint=O_(this.sprint,A_($((n-12)/14,0,1)),6,e),this.walkExtension=O_(this.walkExtension,+!!this.moving,5,e);let o=this.ground.kindAt?.(t.x,t.z),s=o===0?1.03:o===1?1.07:1,c=$((.6+n/6.6+Math.max(0,n-7.5)*.04+(n<2?Math.abs(t.turnRate)*.55:0))*s,.65,5);this.strideHz=O_(this.strideHz,c,8,e);let l=this.strideHz,u=$(n/18.75,0,1),d=o===0?.02:0,f=.77-.14*u+d,p=.83-.09*u+d;if(this.moving&&(this.phase=(this.phase+e*l)%1),this.accepted){let n=t.x-this.accepted.x,r=t.z-this.accepted.z,i=Math.hypot(n,r),a=this.climbing&&this.legs.some(e=>e.swing),o=(a?.045:this.climbing?.08:.36)*e;i>o&&(t.x=this.accepted.x+n*o/i,t.z=this.accepted.z+r*o/i);let s=a?0:this.climbing?.8:2.2;t.heading=this.accepted.heading+$(k_(t.heading-this.accepted.heading),-s*e,s*e)}this.computeBodyFrame(e);let m=this.moving?$(.035+n/160,.035,.18)*A_($(this.motionSpeed/.04,0,1)):0,h=$(t.turnRate*.09,-.18,.18);this.bend=O_(this.bend,-m*Math.cos(this.phase*Math.PI*2)+h,14,e),this.updateHead(e),this.solveSpine(e),this.resolveHeadContact(),this.fitBodyHeight(e);let g=this.accepted;this.supportPose(),g&&(this.motion.speed=Math.sign(t.speed||(t.lateralSpeed??0))*Math.hypot(t.x-g.x,t.z-g.z)/e,this.motion.turnRate=k_(t.heading-g.heading)/e,this.motionSpeed=O_(this.motionSpeed,Math.abs(this.motion.speed),10,e)),this.updateLegs(e,l,f,p),this.resolveHeadContact(),this.motion.blocked=this.blocked,this.motion.transferring=this.legs.some(e=>e.swing),this.updateTail(e,n),this.updateFace(e),this.commit()}updateHead(e){let t=this.inputs,n=0,r=0;if(t.look){let e=this.bodyToWorld(new G(9.4,2.6,0),new G),i=t.look.clone().sub(e),a=new G(i.dot(this.bodyFwd),i.dot(this.bodyUp),i.dot(this.bodyRight));if(n=$(-Math.atan2(a.z,Math.max(.025,a.x))-this.bend*.6,-1.1,1.1),r=$(Math.atan2(a.y,Math.max(.03,Math.hypot(a.x,a.z))),-.6,.6),t.tracking&&this.hasPose){let e=t.look.clone().sub(this.mouth),i=e.length();if(i>.012&&i<.08){let i=k_(Math.atan2(-e.z,e.x)-Math.atan2(-this.headForward.z,this.headForward.x));n=$(this.headYaw+$(i*.25,-.18,.18),-1.1,1.1);let a=Math.atan2(e.y,Math.hypot(e.x,e.z))-Math.atan2(this.headForward.y,Math.hypot(this.headForward.x,this.headForward.z));r=$(this.headPitchCur+$(a*.2,-.12,.12)-t.headPitch,-.8,.6)}}this.moving&&(r=$(r,-.35,.18))}this.headPitchFloor=Math.max(-1.15,this.headPitchFloor-.35*e),r=$(r+t.headPitch,this.headPitchFloor,.6),this.headHold-=e;let i=Math.abs(n-this.headGoalYaw)+Math.abs(r-this.headGoalPitch);(t.tracking||i>.14||this.headHold<0&&i>.03)&&(this.headGoalYaw=n,this.headGoalPitch=r,this.headHold=t.tracking?0:.4+Math.random()*1.2);let a=this.moving?4:8,o=this.moving?3:6;this.headYaw=$(O_(this.headYaw,this.headGoalYaw,16,e),this.headYaw-a*e,this.headYaw+a*e),this.headPitchCur=$(O_(this.headPitchCur,this.headGoalPitch+t.swallow*.35,14,e),this.headPitchCur-o*e,this.headPitchCur+o*e),this.headRollCur=O_(this.headRollCur,t.headTilt,4,e),t.shake>.01&&(this.headYaw+=Math.sin(this.time*23)*.32*t.shake*Math.min(1,e*60))}headContactDepth(e=1/0){if(!this.collision)return 0;let t=this.model,n=t.bone(`head`),r=t.bone(`neck`),i=t.bone(`jaw`),a=t.data.bones[n].origin,o=t.data.bones[i].origin,s=this.spineFrame[0].clone().scale(new G(Q,Q,Q)).setPosition(this.spinePos[0]),c=this.spineFrame[1].clone().scale(new G(Q,Q,Q)).setPosition(this.spinePos[1]),l=s.clone().multiply(new K().makeTranslation(o[0]-a[0],o[1]-a[1],o[2]-a[2])).multiply(new K().makeRotationZ(-this.jawOpen*.55)),u=0,d=new G,f=new G,p=new G,m=new G,h=new G;for(let t of this.headSkin){let i=t.bone===n?s:t.bone===r?c:l;for(let n of t.patches)if(d.copy(n.center).applyMatrix4(i),f.copy(d),this.collision.projectPoint(d,f,n.radius+.003,h.set(0,0,0)),!(d.distanceToSquared(f)<1e-16)){for(let t of n.points)if(p.copy(t).applyMatrix4(i),m.copy(p),this.collision.projectPoint(p,m,.003,h.set(0,0,0)),u=Math.max(u,p.distanceTo(m)),u>e)return u}}return u}resolveHeadContact(){let e=this.headContactDepth();if(e<.001)return;let t=this.headPitchCur,n=this.headYaw,r=t,i=n,a=e,o=4*this.poseDt,s=3*this.poseDt;this.headYaw=this.previousHead.yaw,this.headPitchCur=this.previousHead.pitch,this.solveSpine(0);let c=this.headContactDepth();c<a&&(a=c,i=this.headYaw,r=this.headPitchCur);for(let c of[0,s,-s])for(let l of[0,-o,o])this.headYaw=$($(n+l,-1.1,1.1),this.previousHead.yaw-o,this.previousHead.yaw+o),this.headPitchCur=$($(t+c,-1.15,.6),this.previousHead.pitch-s,this.previousHead.pitch+s),this.solveSpine(0),e=this.headContactDepth(),e<a-1e-7&&(a=e,r=this.headPitchCur,i=this.headYaw);this.headYaw=i,this.headPitchCur=r,this.solveSpine(0),r>t&&(this.headPitchFloor=Math.max(this.headPitchFloor,r))}tailPoint(e){return this.tailPts[Math.min(e,this.tailPts.length-1)]??this.spinePos[5]}spinePoints(){return this.spinePos}spinePos=Array.from({length:6},()=>new G);spineFrame=Array.from({length:6},()=>new K);solveSpine(e){let t=this.inputs,n=this.bend,r=t.chestLift,i=Math.atan2(r*.9,4.5)+t.lunge*.05,a=this.headYaw*.45-n*.55,o=this.headYaw*.55-n*.25,s=this.headPitchCur*.45-i*.7,c=this.headPitchCur*.55-i*.25,l=[n*.32,n*.34,a,o],u=[i*.5,i*.5,s,c],d=[n*.4,n*.4],f=[0,0],p=this.bodyToWorld(new G(this.rootX,this.spineBindYAt(this.rootX),0),new G),m=[3,2,1,0],h=[4,5],g=(e,n,r,i)=>{let a=p.clone(),o=this.rootX,s=this.spineBindYAt(this.rootX),c=new At().setFromRotationMatrix(T_.extractRotation(this.body));for(let l=0;l<e.length;l++){let u=e[l],d=n[l]*i,f=r[l],p=i>0?u===0?this.headRollCur*.7:u===1?this.headRollCur*.3:0:0,m=new At().setFromEuler(new un(p,d,f*i,`YZX`));c.multiply(m);let h=this.spineBindX[u],g=this.spineBindY[u],_=new G((h-o)*Q,(g-s)*Q,0),v=1-$(this.headPitchCur/.6,0,1)*.85;u===0&&(_.x+=t.lunge*.4*Q*v),u===1&&(_.x+=t.lunge*.2*Q*v),_.applyQuaternion(c),a=a.clone().add(_),this.spinePos[u].copy(a),o=h,s=g}return c},_=g(m,l,u,1);if(g(h,d,f,-1),t.bob)for(let e of[0,1,2])this.spinePos[e].addScaledVector(this.bodyUp,t.bob*Q*(e===2?.7:1));let v=this.spinePos[1].distanceTo(this.spinePos[2]),y=this.spinePos[0].distanceTo(this.spinePos[1]);for(let t of[1,0]){let n=this.spinePos[t],r=this.ground.heightAt(n.x,n.z)+(t===0?.75:.95)*Q-n.y;r>0&&e>0&&(this.headLift[t]=Math.max(this.headLift[t],Math.min(r,this.headLift[t]+.04*e))),this.headLift[t]=Math.max(0,this.headLift[t]-1.2*Q*e),n.y+=this.headLift[t],t===1&&(this.spinePos[0].y+=this.headLift[1])}if(this.headLift[0]>0||this.headLift[1]>0){let e=(e,t,n)=>{let r=e.x-t.x,i=e.z-t.z,a=$(e.y-t.y,-.9*n,.9*n),o=Math.sqrt(Math.max(0,n*n-a*a)),s=Math.hypot(r,i),c=e.clone();return e.set(t.x+(s>1e-6?r/s*o:0),t.y+a,t.z+(s>1e-6?i/s*o:0)),e.clone().sub(c)};this.spinePos[0].add(e(this.spinePos[1],this.spinePos[2],v)),e(this.spinePos[0],this.spinePos[1],y)}let b=new G(12.68-this.spineBindX[0],2.44-this.spineBindY[0],0);for(let e=0;e<6;e++){let t,n;if(e===0){t=this.spinePos[0].clone().add(b.clone().multiplyScalar(Q).applyQuaternion(_)),n=this.spinePos[1];let e=t.clone().sub(n);j_(e,this.bodyUp,T_),this.spineFrame[0].copy(T_).multiply(E_.copy(this.bindTilt[this.spineIdx[0]]).transpose()),this.snout.copy(t),this.headForward.copy(e.normalize());continue}t=e===2?this.spinePos[2]:e>0?this.spinePos[e-1]:this.spinePos[e],n=e<5?this.spinePos[e+1]:this.spinePos[e];let r=this.bodyUp.clone();j_(t.clone().sub(n),r,T_),this.spineFrame[e].copy(T_).multiply(E_.copy(this.bindTilt[this.spineIdx[e]]).transpose())}}updateTail(e,t){let n=this.spinePos[5],r=new G().subVectors(n,this.spinePos[4]).normalize();this.tailDynamics.update(e,n,r,this.inputs.tailTwitch)}minimumTransferReach(e){return e.returning&&!e.front?Math.abs(e.data.upperLength-e.data.lowerLength)*Q+1e-4:e.reach*.4}updateLegs(e,t,n,r){let i=this.inputs,a=new G,o=e=>{let t=e.planted.clone().addScaledVector(e.normal,(.12+e.wristAbove)*Q),n=this.shoulder(e).distanceTo(t)/e.reach;return Math.max(n,1.25-n)+Math.abs(k_(this.footYaw(e)-e.plantedYaw))*.3},s=this.climbing||this.carefulTurn||this.legs.some(e=>e.swing&&e.supportArc),c=s?[...this.legs].sort((e,t)=>Number(t.swing)-Number(e.swing)||o(t)-o(e)):this.legs;for(let o of c){let c=o.front?n:r,l=(this.phase+o.offset)%1;if(o.avoiding=!1,o.swing){o.swingElapsed=(o.swingElapsed??0)+e;let t=o.swingT,n=Math.min(1,t+e/o.swingDur);if(o.swingT=n,this.collision&&o.bendDirection.lengthSq()>.5){let r=this.transferPose(o,t),i=Math.min(r.distance,this.minimumTransferReach(o))-1e-7,a=Math.max(b_,this.limbObstruction(o,r.S,r.W,r.plane)+2e-5),s=e=>{let t=this.transferPose(o,e);return t.distance>=i&&this.limbObstruction(o,t.S,t.W,t.plane)<=a};if(!s(n)){let e=t,r=n;for(let t=0;t<6;t++){let t=(e+r)/2;s(t)?e=t:r=t}o.swingT=e,o.avoiding=!0;let i=this.transferPose(o,n),c=this.transferPose(o,e),l=this.clearLimbPlane(o,i.S,i.W,i.plane).applyQuaternion(new At().setFromUnitVectors(i.direction,c.direction));this.limbObstruction(o,c.S,c.W,l)<=a&&(o.bendDirection.copy(l),o.wristDirection.copy(c.direction))}if(o.swingStall=o.swingT-t<e/o.swingDur*.1?o.swingStall+e:0,(o.swingStall>.25||o.swingElapsed>.65)&&!o.returning){o.failedStep=o.to.clone(),o.failedUntil=this.time+(this.moving?3:12);let e=o.from.clone().addScaledVector(o.fromNormal,(.12+o.wristAbove)*Q);if(o.returning=!0,this.settleBlockedFoot(o),!o.settling&&this.shoulder(o).distanceTo(e)<o.reach*.92){let e=o.from.clone(),t=o.fromNormal.clone(),n=o.fromYaw;o.from.copy(o.to),o.to.copy(e),o.fromNormal.copy(o.toNormal),o.toNormal.copy(t),o.fromYaw=o.toYaw,o.toYaw=n,o.swingT=1-o.swingT}o.swingStall=0}o.returning&&o.swingStall>.25&&this.time>=o.nextPlanTime&&(this.settleBlockedFoot(o),o.nextPlanTime=this.time+.3)}if(o.swingT>=1){let e=o.to.clone().addScaledVector(o.toNormal,(.12+o.wristAbove)*Q);if(this.shoulder(o).distanceTo(e)>o.reach*.955){let e=this.footPosition(o,.98);if(this.time<o.nextPlanTime){o.swingT=.98;continue}o.nextPlanTime=this.time+.12;let t=this.footholds.find(o.to,this.shoulder(o),o.reach,i.heading,o.side,void 0,o.footprint,o.toYaw,1/0,o.toYaw);t?(o.fromNormal.lerp(o.toNormal,A_(o.swingT)).normalize(),o.from.copy(e),o.to.copy(t.point),o.toNormal.copy(t.normal),o.stepTop=t.top,o.swingT=0,o.swingDur=.24,o.fromYaw=o.toYaw,o.supportArc&&this.cacheTransferReach(o)):o.swingT=.98,o.lastPhase=l;continue}o.swing=!1,o.supportArc=null,o.planted.copy(o.to),o.plantedYaw=o.toYaw,o.returning&&=(o.nextPlanTime=this.time+(this.moving?1:12),!1),o.normal.copy(o.toNormal),o.heel=0,s&&(this.nextTransferTime=this.time+.06),this.onFootDown?.(o.planted,o.front)}}else{this.homeWorld(o,a);let n=this.footYaw(o),r=a.distanceTo(o.planted),u=Math.abs(k_(n-o.plantedYaw)),d=o.planted.clone().addScaledVector(o.normal,(.12+o.wristAbove)*Q),f=this.shoulder(o).distanceTo(d)/o.reach,p=o.front?this.moving?.5:.4:this.moving?.4:.31,m=f>(this.climbing?this.moving?.86:.9:.955)||f<p||u>(this.climbing?.32:.65);!this.moving||this.climbing?o.stepDue=!1:l>=c&&o.lastPhase<c&&(o.stepDue=!0);let h=!i.tracking&&!this.moving&&(r>.016||u>.35)&&!this.legs.some(e=>e.swing),g=i.restAdjustment&&!this.moving&&this.time>=this.nextComfortStep&&r>.006,_=this.legs.filter(e=>!e.swing).length,v=this.legs.some(e=>e.swing&&e.returning&&(e.swingElapsed??0)>.8&&e!==o&&(m||e.front!==o.front&&e.side!==o.side)),y=g||s&&!v?4:3;if((o.stepDue||m||h||g||v||this.blocked&&this.moving&&this.climbing||this.stepSearch?.leg===o)&&_>=y&&(!s||this.time>=this.nextTransferTime)&&(this.stepSearch?.leg===o||this.time>=o.nextPlanTime)){let r=(1-c)/t,s=this.moving?this.climbing?Math.sign(i.speed||1)*.022:$(i.speed*(c/t*.5+r),-.07,.07):0;if(this.homeWorld(o,a,s),i.lateralSpeed){let e=$(i.lateralSpeed*(c/t*.5+r),-.025,.025);a.x+=Math.sin(i.heading)*e,a.z+=Math.cos(i.heading)*e,a.y=this.footSupport(a.x,a.z).y}let l=this.shoulder(o);if(!this.climbing){let e=a.clone().addScaledVector(x_,(.12+o.wristAbove)*Q).sub(l),t=e.dot(this.bodyFwd),n=Math.max(0,e.lengthSq()-t*t),r=Math.sqrt(Math.max(0,(o.reach*.88)**2-n));a.addScaledVector(this.bodyFwd,$(t,-r,r)-t),a.y=this.footSupport(a.x,a.z).y}let d=this.ground.heightAt(i.x,i.z),f=this.ground.heightAt(i.x+Math.cos(i.heading)*.09,i.z-Math.sin(i.heading)*.09),p=d<.12&&f<d+.025?d+.012:1/0,m=this.planStep(o,()=>{let e=[.25,.5,.75].map(e=>this.supportedTransferShoulder(o,$(i.speed,-.045,.045)*.32*e));return this.footholds.search(a.clone(),l,o.reach,i.heading,o.side,o.planted.clone(),o.footprint,o.plantedYaw,p,n,t=>{if(t.point.distanceTo(o.planted)<=(this.climbing?.009:.004)&&u<=.2||o.failedStep&&this.time<o.failedUntil&&t.point.distanceTo(o.failedStep)<.016)return!1;if(!this.collision||o.bendDirection.lengthSq()<.5)return!0;let n=t.point.clone().addScaledVector(t.normal,(.12+o.wristAbove)*Q),a=n.clone().sub(l).normalize(),s=o.bendDirection.clone();if(o.front&&n.distanceTo(l)<o.reach*.5)return!1;o.wristDirection.lengthSq()>.5&&s.applyQuaternion(new At().setFromUnitVectors(o.wristDirection,a)),s.addScaledVector(a,-s.dot(a)).normalize(),this.boundLimbPlane(o,a,s);let c=this.moving?b_:.0015;if(this.limbObstruction(o,l,n,s,c)>=c)return!1;let d=this.transferPoseFor(o,o.planted,o.normal,l),f=Math.max(c,this.limbObstruction(o,l,d.W,d.plane)+1e-4),p=this.ground.heightAt(i.x,i.z)>.12||this.legs.some(e=>e.planted.y>.12)||t.point.y>.12,m=g_(o.planted.y,t.point.y,t.top).raised,h=this.climbing?p:m;if(h&&this.legs.some(e=>e!==o&&e.swing))return!1;if(h){let e={...o,bendDirection:d.plane.clone(),wristDirection:d.direction.clone()},n=Math.max(r,g_(o.planted.y,t.point.y,t.top).duration);for(let r=1;r<=16;r++){let i=r/16,a=__(o.planted,t.point,t.top,i,o.liftScale*Q),s=o.normal.clone().lerp(t.normal,A_(i)).normalize(),c=this.transferPoseFor(e,a,s,l);if(c.distance>=o.reach*.98||c.distance<=o.reach*.4)return!1;let u=this.clearLimbPlane(e,l,c.W,c.plane,3*n/16);if(this.limbObstruction(o,l,c.W,u,f)>f)return!1;e.bendDirection.copy(u),e.wristDirection.copy(c.direction)}return!0}for(let[n,r]of[.25,.5,.75].entries()){let i=__(o.planted,t.point,t.top,r,o.liftScale*Q),a=o.normal.clone().lerp(t.normal,A_(r)).normalize(),s=e[n];if(!(s?[l,s]:[l]).some(e=>{let t=this.transferPoseFor(o,i,a,e);return t.distance>=o.reach*.98||t.distance<=o.reach*.4?!1:[0,.3,-.3,.6,-.6].some(n=>{let r=this.boundLimbPlane(o,t.direction,t.plane.clone().applyAxisAngle(t.direction,n));return this.limbObstruction(o,e,t.W,r,f)<=f})}))return!1}return!0},.025,.055,o.liftScale*Q)});if(m&&(m.point.distanceTo(o.planted)>(this.climbing?.009:.004)||u>.2)){let t=Math.abs(m.point.y-o.planted.y)>.008||m.top>Math.min(m.point.y,o.planted.y)+.008;if(!t||_>=3){o.swing=!0,o.swingT=0,o.stepDue=!1,o.swingStall=0,o.swingElapsed=0,o.returning=!1,o.settling=!1,o.swingDur=t?Math.max(g_(o.planted.y,m.point.y,m.top).duration,r):this.carefulTurn?.24:this.moving?Math.max(.04,r-e):.28,g&&(this.nextComfortStep=this.time+12),o.from.copy(o.planted),o.to.copy(m.point),o.fromYaw=o.plantedYaw,o.fromNormal.copy(o.normal),o.toYaw=n,o.toNormal.copy(m.normal),o.stepTop=m.top;let a=this.ground.heightAt(i.x,i.z)>.12||this.legs.some(e=>e.planted.y>.12)||m.point.y>.12;(this.climbing?a:g_(o.from.y,o.to.y,o.stepTop).raised)?this.cacheTransferReach(o):o.supportArc=null,o.heel=0}}}}o.lastPhase=l,o.heel=0}}planStep(e,t){let n=this.inputs;if(this.stepSearch&&(Math.hypot(n.x-this.stepSearch.x,n.z-this.stepSearch.z)>.015||Math.abs(k_(n.heading-this.stepSearch.heading))>.15)&&(this.stepSearch=null),this.stepSearch&&this.stepSearch.leg!==e)return null;let r=this.stepSearch??={leg:e,search:t(),x:n.x,z:n.z,heading:n.heading};for(;this.stepWorkRemaining-->0;){let t=r.search.next();if(!t.done)continue;this.stepSearch=null,e.nextPlanTime=this.time+.12;let n=t.value;if(!n)return null;let i=this.shoulder(e),a=this.transferPoseFor(e,n.point,n.normal,i);return a.distance>e.reach*.94||a.distance<e.reach*.3||this.collision&&this.limbObstruction(e,i,a.W,a.plane,.0015)>.0015?null:n}return null}updateFace(e){let t=this.inputs;this.blinkT-=e,this.blinkT<0&&(this.blink=1,this.blinkT=2.5+Math.random()*6),this.blink=Math.max(0,this.blink-e*4.5);let n=this.blink>0?Math.sin(this.blink*Math.PI):0,r=$(t.lid*(1-n),0,1);for(let e of this.model.eyes)e.open.value=r;this.eyeHold-=e,this.eyeHold<0&&(this.eyeGoal.set((Math.random()-.5)*.25,0,(Math.random()-.5)*.35),this.eyeHold=.6+Math.random()*2),this.eyeLook.x=O_(this.eyeLook.x,this.eyeGoal.x,20,e),this.eyeLook.z=O_(this.eyeLook.z,this.eyeGoal.z,20,e);for(let e of this.model.eyes)e.look.set(this.eyeLook.x,0,this.eyeLook.z*e.side);this.gularT+=e}setBone(e,t,n,r=1,i=1){let a=this.boneWorld[e];a.copy(n),a.scale(new G(Q,Q*r,Q*i)),a.setPosition(t),this.model.bones[e].matrix.copy(a)}spineScale(e,t=new G){let n=this.inputs,r=1+.035*(Math.sin(this.time*Math.PI*2/2.6)*.5+.5)*n.breath,i=e>=2?n.flatten*(e===5?.5:1):0,a=(e===2||e===3?1+(r-1)*.6:1)*(1-.14*i),o=(e===2||e===3||e===4?r:1)*(1+.17*i);return t.set(Q,Q*a,Q*o)}commit(){let e=this.inputs,t=this.model;for(let e=0;e<6;e++){let t=this.spineIdx[e],n=this.spineScale(e);this.setBone(t,this.spinePos[e],this.spineFrame[e],n.y/Q,n.z/Q)}let n=this.spinePos[4].clone().sub(this.spinePos[5]).normalize(),r=new G().setFromMatrixColumn(j_(n,this.bodyUp,new K),2);for(let e=0;e<this.tailIdx.length;e++){let t=this.tailIdx[e],i=e===0?this.spinePos[5]:this.tailPts[e-1],a=this.tailPts[Math.min(e+1,this.tailPts.length-1)],o=i.clone().sub(a).normalize();o.lengthSq()<.5&&o.copy(n),r.applyQuaternion(new At().setFromUnitVectors(n,o)),r.addScaledVector(o,-r.dot(o)).normalize();let s=new G().crossVectors(r,o).normalize(),c=new K().makeBasis(o,s,r).multiply(E_.copy(this.bindTilt[t]).transpose());this.setBone(t,this.tailPts[e],c),n.copy(o)}let i=t.bone(`head`),a=t.bone(`neck`),o=this.boneWorld[i],s=t.bone(`jaw`),c=t.bone(`gular`),l=t.data.bones[i].origin,u=t.data.bones[s].origin,d=o.clone().multiply(T_.makeTranslation(u[0]-l[0],u[1]-l[1],u[2]-l[2])).multiply(E_.makeRotationZ(-this.jawOpen*.55));t.bones[s].matrix.copy(d),this.boneWorld[s].copy(d);let f=t.data.bones[a].origin,p=t.data.bones[c].origin,m=Math.sin(this.gularT*Math.PI*2/1.7)*.5+.5,h=1+e.display*.55+m*.05*e.breath+e.swallow*.3,g=this.boneWorld[a].clone().multiply(T_.makeTranslation(p[0]-f[0],p[1]-f[1],p[2]-f[2])).multiply(E_.makeScale(1,h,1+e.display*.35));t.bones[c].matrix.copy(g),this.boneWorld[c].copy(g),t.skin.uDisplay.value=O_(t.skin.uDisplay.value,e.display,3,1/60),t.skin.uTone.value=e.tone,t.skin.uBeardDark.value=e.beardDark,t.tongueOut=e.tongue,t.tongueReach=e.tongueReach,t.tongueTarget=e.tracking?e.look:null,this.mouth.set(12.15-u[0],t.data.mouth[1][1]-u[1]-.05,0).applyMatrix4(d);for(let e of this.legs)this.solveLeg(e);for(let e of t.eyes)e.look.x=$(e.look.x,-.3,.3);t.syncAttachments(),this.hasPose=!0}footPosition(e,t=e.swingT){if(!e.swing)return e.planted.clone();let n=__(e.from,e.to,e.stepTop,t,e.liftScale*Q,e.settling),r=e.fromYaw+k_(e.toYaw-e.fromYaw)*A_(t),i=Math.cos(r),a=Math.sin(r),o=0,s=0,c=0,l=0;for(let t of e.footprint){let e=i*t.x+a*t.z,n=-a*t.x+i*t.z;o=Math.min(o,e),s=Math.max(s,e),c=Math.min(c,n),l=Math.max(l,n)}return n.x=$(n.x,-Z.w/2+.014-o,Z.w/2-.014-s),n.z=$(n.z,-Z.d/2+.014-c,Z.d/2-.014-l),n}cacheTransferReach(e){e.supportArc=Array.from({length:17},(t,n)=>{let r=n/16,i=e.fromNormal.clone().lerp(e.toNormal,A_(r)).normalize();return this.footPosition(e,r).addScaledVector(i,(.12+e.wristAbove)*Q)})}settleBlockedFoot(e){let t=this.shoulder(e),n=e.fromNormal.clone().lerp(e.toNormal,A_(e.swingT)).normalize(),r=e.fromYaw+k_(e.toYaw-e.fromYaw)*A_(e.swingT),i=this.transferPose(e,e.swingT),a=i.W.clone().addScaledVector(n,-(.12+e.wristAbove)*Q),o=Math.max(b_,this.limbObstruction(e,t,i.W,i.plane)+2e-5),s=this.footholds.find(a,t,e.reach,this.inputs.heading,e.side,void 0,e.footprint,r,a.y+.008,r,r=>{let s=t.distanceTo(r.point.clone().addScaledVector(r.normal,(.12+e.wristAbove)*Q));if(s>e.reach*.92||s<e.reach*(e.front?.4:.3))return!1;let c={...e,bendDirection:i.plane.clone(),wristDirection:i.direction.clone()};for(let i=1;i<=16;i++){let s=i/16,l=a.clone().lerp(r.point,s),u=n.clone().lerp(r.normal,s).normalize(),d=this.transferPoseFor(c,l,u,t),f=d.W,p=d.direction;if(d.distance>e.reach*.92||d.distance<this.minimumTransferReach(e))return!1;let m=this.clearLimbPlane(c,t,f,d.plane,.046875);if(this.limbObstruction(e,t,f,m,o)>o)return!1;if(c.bendDirection.copy(m),c.wristDirection.copy(p),this.collision){let e=l.clone().addScaledVector(u,.003),t=e.clone();if(this.collision.projectPoint(e,t,.002,new G),e.distanceTo(t)>.001)return!1}}return!0});s&&(e.from.copy(a),e.to.copy(s.point),e.fromNormal.copy(n),e.toNormal.copy(s.normal),e.fromYaw=r,e.toYaw=r,e.swingT=0,e.swingDur=.25,e.swingStall=0,e.settling=!0,e.supportArc&&this.cacheTransferReach(e))}limbObstruction(e,t,n,r,i=1/0){if(!this.collision)return 0;let a=n.clone().sub(t),o=a.length();a.normalize();let s=e.data.upperLength*Q,c=e.data.lowerLength*Q,l=(s*s-c*c+o*o)/(2*Math.max(o,1e-4)),u=Math.sqrt(Math.max(0,s*s-l*l)),d=t.clone().addScaledVector(a,l).addScaledVector(r,u),f=0;for(let[r,i,a,o]of[[t,d,e.front?.016:.02,e.front?.014:.018],[d,n,e.front?.011:.012,.006]])for(let e of[0,.25,.5,.75,1]){let t=r.clone().lerp(i,e),n=t.clone();this.collision.projectPoint(t,n,U.lerp(a,o,e),new G),f=Math.max(f,t.distanceTo(n))}if(f===0)return 0;let p=new G().crossVectors(r,a).normalize(),m=0,h=t.clone().addScaledVector(d.clone().sub(t).normalize(),-.005),g=h.clone();if(this.collision.projectPoint(h,g,e.front?.0135:.0165,new G),m=Math.max(m,h.distanceTo(g)),m>i)return m;for(let r=0;r<2;r++){let a=r?d:t,o=(r?n.clone().sub(d):d.clone().sub(t)).normalize(),s=new G().crossVectors(p,o).normalize();for(let t of e.limbSkin[r]){let e=a.clone().addScaledVector(o,t.x).addScaledVector(s,t.y).addScaledVector(p,t.z),n=e.clone();if(this.collision.projectPoint(e,n,.0015,new G),m=Math.max(m,e.distanceTo(n)),m>i)return m}}return m}transferPose(e,t){let n=this.shoulder(e),r=e.fromNormal.clone().lerp(e.toNormal,A_(t)).normalize();return this.transferPoseFor(e,this.footPosition(e,t),r,n)}transferPoseFor(e,t,n,r){let i=t.clone().addScaledVector(n,(.12+e.wristAbove)*Q),a=i.clone().sub(r),o=e.data.upperLength*Q,s=e.data.lowerLength*Q,c=a.length();c>0&&i.copy(r).addScaledVector(a.divideScalar(c),$(c,Math.abs(o-s)+1e-4,(o+s)*.999));let l=i.clone().sub(r).normalize(),u=e.bendDirection.clone();return e.wristDirection.lengthSq()>.5&&u.applyQuaternion(new At().setFromUnitVectors(e.wristDirection,l)),u.addScaledVector(l,-u.dot(l)).normalize(),this.boundLimbPlane(e,l,u),{S:r,W:i,direction:l,plane:u,distance:c}}forearmReference(e,t){let n=new G(-1,-.15,0).transformDirection(this.spineFrame[2]);n.addScaledVector(t,-n.dot(t));let r=n.length();return r>.12?{axis:n.divideScalar(r),strength:r}:null}boundLimbPlane(e,t,n){if(!e.front)return n;let r=this.forearmReference(e,t);if(!r)return n;let i=Math.atan2(t.dot(new G().crossVectors(r.axis,n)),r.axis.dot(n)),a=U.lerp(Math.PI,1.4,A_($((r.strength-.12)/.28,0,1))),o=$($(i,-a,a)-i,-8*this.poseDt,8*this.poseDt);return n.applyAxisAngle(t,o)}clearLimbPlane(e,t,n,r,i=3*this.poseDt){let a=n.clone().sub(t),o=a.length();a.normalize();let s=r.clone();if(this.boundLimbPlane(e,a,r),!this.collision)return r;r.distanceToSquared(s)>1e-12&&this.limbObstruction(e,t,n,r)>Math.max(b_,this.limbObstruction(e,t,n,s))+2e-5&&r.copy(s);let c=e.data.upperLength*Q,l=e.data.lowerLength*Q,u=(c*c-l*l+o*o)/(2*Math.max(o,1e-4)),d=Math.sqrt(Math.max(0,c*c-u*u)),f=e=>t.clone().addScaledVector(a,u).addScaledVector(e,d),p=(r,i=1/0)=>this.limbObstruction(e,t,n,r,i),m=p(r);if(e.bendDirection.lengthSq()>.5&&e.wristDirection.lengthSq()>.5){let t=e.bendDirection.clone().applyQuaternion(new At().setFromUnitVectors(e.wristDirection,a));t.addScaledVector(a,-t.dot(a)).normalize();let n=p(t,m-5e-5);n<m-5e-5&&(r.copy(t),m=n)}let h=r.clone(),g=0;if(m<5e-4)return r;for(let n of[.2,-.2,.45,-.45,.75,-.75,1.05,-1.05,1.4,-1.4]){let i=this.boundLimbPlane(e,a,r.clone().applyAxisAngle(a,n)),o=f(i).clone().sub(t);if(o.dot(this.bodyRight)*e.side<.001||e.front&&o.dot(this.bodyUp)>.011)continue;let s=p(i,m-Math.abs(n)*3e-4)+Math.abs(n)*3e-4;s<m&&(m=s,h=i,g=n)}if(g){let e=Math.atan2(a.dot(new G().crossVectors(r,h)),r.dot(h)),t=r.clone().applyAxisAngle(a,$(e,-i,i));return p(t)<=p(r)+2e-5?t:r}return h}solveLeg(e){let t=this.inputs,n=this.model,r=e.data,i=e.front?2:5,a=this.spineIdx[i],o=this.boneWorld[a],s=n.data.bones[a].origin,c=new G(r.root[0]-s[0],r.root[1]-s[1],r.root[2]-s[2]);c.applyMatrix4(o);let l=this.footPosition(e),u,d=(e.swing?e.fromNormal:e.normal).clone();if(e.swing){let t=$(e.swingT,0,1);u=e.fromYaw+k_(e.toYaw-e.fromYaw)*A_(t),d.lerp(e.toNormal,A_(t)).normalize()}else u=e.plantedYaw;let f=0;if(e.front&&e.side<0&&t.wave>.01){let n=t.wave,r=this.time*Math.PI*2*.55;f=n;let i=this.homeWorld(e,new G);l.lerp(i,n),l.addScaledVector(this.bodyUp,n*(1.6+.5*Math.sin(r))*Q),l.addScaledVector(this.bodyFwd,n*(.6*Math.cos(r)+.4)*Q),l.addScaledVector(this.bodyRight,n*e.side*.4*Q)}let p=Math.atan2(-r.forward[2],r.forward[0]),m=u+p,h=new G(Math.cos(m),0,-Math.sin(m));h.addScaledVector(d,-h.dot(d));let g=A_($(h.length()/.3,0,1)),_=e.handForward.clone();if(e.handNormal.lengthSq()>.5&&_.applyQuaternion(new At().setFromUnitVectors(e.handNormal,d)),_.addScaledVector(d,-_.dot(d)),_.lengthSq()<1e-10&&_.copy(h),_.lengthSq()<1e-10&&_.copy(this.bodyFwd).addScaledVector(d,-this.bodyFwd.dot(d)),_.lengthSq()<1e-10&&_.crossVectors(this.bodyRight,d),_.lengthSq()<1e-10&&_.crossVectors(x_,d),_.normalize(),h.lengthSq()>1e-10){h.normalize();let e=Math.atan2(d.dot(new G().crossVectors(_,h)),_.dot(h));_.applyAxisAngle(d,e*g)}e.handForward.copy(_),e.handNormal.copy(d);let v=j_(_,d,new K).clone(),y=e.heel*(e.front?.45:.6)+f*.5,b=new G(r.palm[0]-r.wrist[0],0,r.palm[2]-r.wrist[2]).length()*Q*2.2,x=new G().setFromMatrixColumn(v,2),S=l.clone().addScaledVector(_,b),C=D_.setFromAxisAngle(x,-y),w=l.clone().sub(S).applyQuaternion(C).add(S);v=new K().makeRotationFromQuaternion(C).multiply(v),w.addScaledVector(d,.12*Q),this.setBone(r.bones.hand,w,v);let T=new G().setFromMatrixColumn(v,1),E=w.clone().addScaledVector(T,e.wristAbove*Q),D=r.upperLength*Q,O=r.lowerLength*Q,k=E.clone().sub(c),A=k.length(),j=(D+O)*.999,ee=Math.abs(D-O)+1e-4;if((e.swing||f>0)&&(A>j||A<ee)){let e=c.clone().addScaledVector(k.lengthSq()>1e-12?k.clone().normalize():this.bodyUp.clone().negate(),$(A,ee,j));w.add(e.clone().sub(E)),E.copy(e),A=c.distanceTo(E),this.setBone(r.bones.hand,w,v)}A=$(A,ee,j);let M=E.clone().sub(c).normalize(),N=e.front?new G(-1,-.15,0).transformDirection(o):this.bodyRight.clone().multiplyScalar(e.side*.045).addScaledVector(this.bodyUp,.045).addScaledVector(this.bodyFwd,.022),te=N.length(),P=N.addScaledVector(M,-N.dot(M)),ne=A_($((P.length()/te-.04)/.28,0,1)),F=e.bendDirection.clone();e.wristDirection.lengthSq()>.5&&F.applyQuaternion(new At().setFromUnitVectors(e.wristDirection,M)),F.addScaledVector(M,-F.dot(M)),F.lengthSq()<1e-10&&(F.copy(P),F.lengthSq()<1e-10&&F.copy(this.bodyRight).multiplyScalar(e.side).addScaledVector(M,-this.bodyRight.dot(M)*e.side)),F.normalize();let re=F.clone(),ie=this.collision?this.limbObstruction(e,c,E,re):0;if(!e.swing&&!e.avoiding&&P.lengthSq()>1e-10){P.normalize();let t=Math.atan2(M.dot(new G().crossVectors(F,P)),F.dot(P)),n=e.front?4*this.poseDt:1/0,r=F.clone().applyAxisAngle(M,$(t*ne*(1-Math.exp(-14*this.poseDt)),-n,n));(!this.collision||this.limbObstruction(e,c,E,r)<=Math.max(b_,ie)+1e-7)&&F.copy(r)}F.copy(this.clearLimbPlane(e,c,E,F)),this.collision&&this.limbObstruction(e,c,E,F)>Math.max(b_,ie)+1e-7&&F.copy(re),e.bendDirection.copy(F),e.wristDirection.copy(M);let ae=(D*D-O*O+A*A)/(2*A),oe=Math.sqrt(Math.max(0,D*D-ae*ae)),se=c.clone().addScaledVector(M,ae).addScaledVector(F,oe),I=new G().crossVectors(F,M).normalize(),ce=new K;{let e=se.clone().sub(c).normalize(),t=I.clone().addScaledVector(e,-I.dot(e)).normalize(),n=new G().crossVectors(t,e);ce.makeBasis(e,n,t)}let le=new K;{let e=E.clone().sub(se).normalize(),t=I.clone().addScaledVector(e,-I.dot(e)).normalize(),n=new G().crossVectors(t,e);le.makeBasis(e,n,t)}this.setBone(r.bones.upper,c,ce),this.setBone(r.bones.lower,se,le);let ue=this.boneWorld[r.bones.hand];(e.swing||f!==0||e.digitHand===null||!ue.elements.every((t,n)=>Math.abs(t-e.digitHand.elements[n])<1e-12))&&(!e.swing&&f===0?(e.digitHand??=new K).copy(ue):e.digitHand=null,r.bones.digits.forEach((t,i)=>{let a=e.digitRel[i],o=ue.clone().multiply(a),s=new G(...r.digits[i].tip).applyMatrix4(n.bind[t].clone().invert()),c=e.swing?-.25*Math.sin(Math.PI*e.swingT):0;for(let e=0;e<2;e++){let e=o.clone().multiply(new K().makeRotationZ(c)),t=0;for(let n of[.4,.7,1]){let r=s.clone().multiplyScalar(n).applyMatrix4(e),i=this.footholds.support(r.x,r.z,r.y+.018);t=Math.max(t,Math.atan2(i.y+6e-4-r.y,Math.max(.003,s.length()*Q*n)))}c=$(c+t,-.3,1)}let l=new At().setFromAxisAngle(new G(0,0,1),c),u=o.clone().multiply(new K().makeRotationFromQuaternion(l));if(this.collision){let e=o.clone().invert();for(let t=0;t<3;t++){let t=0,n=null;for(let r of[.5,.75,1]){let i=s.clone().multiplyScalar(r).applyMatrix4(u),a=i.clone();this.collision.projectPoint(i,a,.0012,new G);let o=i.distanceTo(a);o>t+1e-4&&(t=o,n=a.applyMatrix4(e).normalize())}if(!n||t<2e-4)break;let r=new At().setFromUnitVectors(s.clone().normalize(),n);if(r.angleTo(new At)>1.25)break;l.rotateTowards(r,.35),u.copy(o).multiply(new K().makeRotationFromQuaternion(l))}}n.bones[t].matrix.copy(u),this.boneWorld[t].copy(u)}))}};function N_(e,t,n,r,i){let a=n.clone().sub(t),o=a.lengthSq(),s=o>1e-12?U.clamp(e.clone().sub(t).dot(a)/o,0,1):0,c=t.clone().addScaledVector(a,s);if(c.distanceToSquared(e)>r*r)return!1;if(i){let t=c.distanceTo(e),n=Math.max(2,Math.ceil(t/.003));for(let t=0;t<=n;t++){let r=c.clone().lerp(e,t/n),a=r.clone();if(i.projectPoint(r,a,0,new G),r.distanceToSquared(a)>1e-6)return!1}}return!0}var P_=e=>Math.max(0,Math.min(1,e)),F_=class{satiety=.2;thirst=.2;fatigue=0;update(e,t,n){this.satiety=P_(this.satiety-e/2400),this.thirst=P_(this.thirst+e/1800+t*.004),this.fatigue=P_(this.fatigue+t*.035-(n?e/180:0))}eat(e){this.satiety=P_(this.satiety+e)}drink(e){this.thirst=P_(this.thirst-e)}get wantsPrey(){return this.satiety<.9&&this.fatigue<.85}},I_=class{settled=0;readiness=1;wasResting=!1;update(e,t,n,r,i){let a=!n&&Math.abs(r)<.008&&Math.abs(i)<.1;return this.settled=t&&a?Math.min(4,this.settled+e):0,this.wasResting&&!t&&(this.readiness=.25),this.readiness=Math.min(1,this.readiness+e/.3),this.wasResting=t,{bodyRate:t?this.settled<.25?0:1.6:4,headRate:t?3:7,breathRate:t?.8:2,advance:this.readiness,adjust:t&&this.settled>.5&&this.settled<1.5}}},L_=class{position=new G;velocity=new G;age=1/0;clock=0;last=-1/0;sampled=!1;reset(){this.age=1/0,this.clock=0,this.last=-1/0,this.sampled=!1,this.velocity.set(0,0,0)}update(e,t,n){if(this.clock+=e,this.age+=e,!n||this.clock-this.last<.075)return;let r=this.clock-this.last;if(this.sampled&&r<.35){let e=t.clone().sub(this.position).divideScalar(r).clampLength(0,1.5);this.velocity.lerp(e,1-Math.exp(-r*18))}else this.velocity.set(0,0,0);this.position.copy(t),this.last=this.clock,this.age=0,this.sampled=!0}predict(e,t,n,r=new G){if(r.copy(this.position),!this.sampled||this.age>.25)return r;let i=t?U.clamp((this.velocity.y+Math.sqrt(this.velocity.y**2+19.6*Math.max(0,r.y-n)))/9.8,0,.22):U.clamp((e-.1)/.55,0,.22),a=this.velocity.clone().multiplyScalar(i*(1-this.age/.25));return a.y=0,a.clampLength(0,.055),r.add(a),r}},R_=-Math.PI/2,z_=()=>Math.random(),B_=(e,t,n)=>Math.min(n,Math.max(t,e)),V_=(e,t,n,r)=>e+(t-e)*(1-Math.exp(-n*r)),H_=e=>Math.atan2(Math.sin(e),Math.cos(e)),U_=e=>(e=B_(e,0,1),e*e*(3-2*e)),W_=class e{rig;nav;surface;insects;needs=new F_;restTransition=new I_;observation=new L_;preyVisible=!0;huntDeparture=!1;sightT=0;mode=`bask`;status=`Basking under the lamp`;t=0;modeT=0;path=[];pathI=0;burstLeft=0;pauseT=0;cruise=.1;speed=0;turn=0;after=`idle`;lookT=0;lookPoint=new G;looking=!1;pose={clearance:.1,chestLift:2.3,headPitch:.45,lid:1,breath:1};poseGoal={clearance:.1,chestLift:2.3,headPitch:.45,lid:1,breath:1};faceHeading=null;prey=null;huntPhase=`notice`;bites=0;biteT=0;preySide=1;phaseT=0;captureWith=null;strikeScale=1;lapCount=0;drinkPitch=-.55;huntGoal=null;huntPrey=null;huntReplanT=0;huntElapsed=0;huntDistance=0;huntNoProgress=0;huntProgressAt=new G;lastPreyPosition=new G;preyHiddenT=0;standTries=0;misses=0;gapeT=0;displayKind=`bob`;boredom=0;goal=null;replans=0;replanOrigin=new W;blockedT=0;stallT=0;travelNoProgress=0;travelProgressAt=new G;pushedT=0;retreatLeft=0;retreatT=0;retreatSign=-1;retreatReversed=!1;retreatSide=0;pivotRecovery=null;climbBacking=!1;lateralRequest=0;lateralSpeed=0;turnStallT=0;caveApproach=!1;caveBacking=!1;caveExit=0;bowlExit=null;foodExit=!1;nearPath=null;nearBest=1/0;nearT=0;stallRef=new W;stallHeading=0;leadT=0;lickT=0;tmp2=[0,0];ignorePrey=new WeakMap;huntReassessUntil=0;hurry=!1;clearT=0;dish=null;grazePhase=`face`;grazeBites=0;grazeT=0;lastGraze=-60;tongueStrike=!1;onTongue=!1;caughtT=0;leafTips=[];leavesWet=0;sipTip=new G;sipPitch=0;lastSip=-60;lastMist=-60;snoutLickT=0;onSip;night=!1;raining=!1;heat=1;storm=0;envTemp=.5;lampOnIt=0;bodyTemp=.55;stress=0;cameraPos=new G;pointer=null;pointerPrev=new G;baskSpot=[-.4,.085,0];sleepSpot=[.475,-.018,-Math.PI/2];onLap;onCrunch;constructor(e,t,n,r){this.rig=e,this.nav=t,this.surface=n,this.insects=r;let i=-1/0;for(let e=-.52;e<=-.39;e+=.005)for(let r=.02;r<=.07;r+=.005)if(n.kindAt(e,r)===tg.Rock&&t.reachable(e,r))for(let t=Math.PI-.32;t<=Math.PI-.12;t+=.1){let a=Math.cos(t),o=-Math.sin(t),s=1/0,c=-1/0,l=0,u=0,d=0,f=!0;for(let t of[-.01,0,.01]){let i=NaN,p=NaN;for(let m=-.065;m<=.076&&f;m+=.01){let h=e+a*m-o*t,g=r+o*m+a*t;if(n.kindAt(h,g)!==tg.Rock){f=!1;break}let _=n.heightAt(h,g);s=Math.min(s,_),c=Math.max(c,_),l+=_,u++,Number.isNaN(i)||(d=Math.max(d,(i+_)/2-p)),i=p,p=_}if(!f)break}if(!f||d>.005||c-s>.03)continue;let p=l/u-(c-s)*3-d*4-Math.abs(e+.465)*.4;p>i&&(i=p,this.baskSpot=[e,r,t])}let a=t.nearestWalkable(this.sleepSpot[0],this.sleepSpot[1],t.mainRegion);a&&(this.sleepSpot[0]=a[0],this.sleepSpot[1]=a[1]);let o=e.inputs;o.x=this.baskSpot[0],o.z=this.baskSpot[1],o.heading=this.baskSpot[2],o.clearance=.1,o.chestLift=2.3,o.headPitch=.45,this.lookT=4,e.reset()}setMode(e,t){this.mode=e,this.modeT=0,this.status=t,e===`idle`&&(this.holdFor=Math.min(70,8+-Math.log(1-z_()*.98)*16))}holdFor=20;tmpTilt=new G;restInHide(){(!this.prey?.caught||this.prey.eaten)&&(this.goTo(this.sleepSpot[0],this.sleepSpot[1],`sleep`,.08)||(this.setMode(`sleep`,`Falling asleep`),this.posePreset(`sleep`)))}posePreset(e){let t={bask:{clearance:.05,chestLift:2.3,headPitch:.45,lid:.85,breath:1},alert:{clearance:.35,chestLift:.9,headPitch:.12,lid:1,breath:1},walk:{clearance:.95,chestLift:.15,headPitch:.05,lid:1,breath:1.2},rest:{clearance:.12,chestLift:.45,headPitch:.02,lid:1,breath:1},sleep:{clearance:-.15,chestLift:-.2,headPitch:-.22,lid:0,breath:.6},drink:{clearance:.25,chestLift:-.6,headPitch:-.55,lid:1,breath:1}};this.poseGoal={...t[e]}}goTo(e,t,n,r=.12){let i=this.rig.inputs,a=this.nav.path(i.x,i.z,e,t);return!a||a.length<2?!1:(this.path=a,this.pathI=1,this.goal=a[a.length-1],this.retreatT=0,this.retreatLeft=0,this.retreatSide=0,this.pivotRecovery=null,this.turnStallT=0,this.caveApproach=Math.abs(e-.475)<.11&&t<.11&&this.surface.heightAt(e,t)<.12,this.caveBacking=!1,this.caveExit=!this.caveApproach&&Math.abs(i.x-.475)<.11&&i.z<.11&&this.surface.heightAt(i.x,i.z)<.12?Math.sin(i.heading)>0?-1:1:0,this.bowlExit=i.x>.43&&i.x<.52&&i.z>.3&&e<.4?{x:i.x-Math.cos(i.heading)*.075,z:i.z+Math.sin(i.heading)*.075,heading:i.heading,time:0}:this.dishWithdrawal(e,t),this.foodExit=i.x>-.5&&i.x<-.34&&i.z>.29&&Math.cos(i.heading)<-.25&&(e>-.35||this.surface.heightAt(e,t)>.15),this.foodExit&&(this.path=this.nav.path(i.x,i.z,.18,.365)??a),this.replans=0,this.replanOrigin.set(i.x,i.z),this.blockedT=0,this.stallT=0,this.pushedT=0,this.stallRef.set(i.x,i.z),this.travelNoProgress=0,this.travelProgressAt.set(i.x,i.z,i.heading),this.after=n,this.hurry=!1,this.cruise=r*(.85+z_()*.3),this.burstLeft=.12+z_()*.3,this.pauseT=0,this.leadT=.2,this.setMode(`travel`,n===`drink`?`Heading to the water`:n===`bask`?`Returning to the basking ledge`:n===`sleep`?`Looking for a place to sleep`:n===`soak`?`Wading into the shallows`:n===`shelter`?`Heading for the cave`:n===`graze`?`Off to the greens dish`:n===`sip`?`Off to lick the wet leaves`:`Exploring`),this.posePreset(`walk`),!0)}dishWithdrawal(e,t){if(!this.dish)return null;let n=this.rig.inputs,r=this.dish.centre,i=r.x-n.x,a=r.z-n.z,o=Math.hypot(i,a);if(o>.16||Math.hypot(e-r.x,t-r.z)<o+.05||i*Math.cos(n.heading)-a*Math.sin(n.heading)<.035)return null;let s={x:n.x-Math.cos(n.heading)*.075,z:n.z+Math.sin(n.heading)*.075,heading:n.heading,time:0,side:0,cost:this.rig.recoveryCost(-1,0)},c=[-1,1].map(e=>({x:n.x+Math.sin(n.heading)*.075*e,z:n.z+Math.cos(n.heading)*.075*e,heading:n.heading,time:0,side:e,cost:this.rig.recoveryCost(0,e)})).filter(e=>this.nav.lineClear(n.x,n.z,e.x,e.z,1/0)&&Math.hypot(e.x-r.x,e.z-r.z)>o).sort((n,r)=>Math.hypot(n.x-e,n.z-t)-Math.hypot(r.x-e,r.z-t));if(!this.nav.lineClear(n.x,n.z,s.x,s.z,1/0))return c[0]??s;if(s.cost<=.005)return s;let l=c.find(e=>e.cost<.001);if(l)return l;let u=this.nav.path(n.x,n.z,e,t)?.[1]??[e,t];return[-1,1].map(e=>({x:n.x+Math.sin(n.heading)*.04*e,z:n.z+Math.cos(n.heading)*.04*e,heading:n.heading,time:0,side:e,unload:!0,cost:this.rig.recoveryCost(0,e)})).filter(e=>e.cost<.001&&this.nav.lineClear(n.x,n.z,e.x,e.z,1/0)).sort((e,t)=>Math.hypot(e.x-u[0],e.z-u[1])-Math.hypot(t.x-u[0],t.z-u[1]))[0]??s}drinkSpot(){let e=this.rig.inputs,t=[Uf.cx-.17,Uf.cz-.035,Math.atan2(-.035,.17)];if(this.nav.reachable(t[0],t[1]))return t;let n=[];for(let t=Uf.cx-Uf.rx*1.5;t<=Uf.cx+Uf.rx*1.5;t+=.012)for(let r=Uf.cz-Uf.rz*1.6;r<=Math.min(Z.d/2-.04,Uf.cz+Uf.rz*1.6);r+=.012){if(!this.nav.reachable(t,r)||this.nav.isWet(t,r)||Jf(t,r)<.01||this.surface.heightAt(t,r)>.13)continue;let i=-1,a=0;for(let e=0;e<Math.PI*2;e+=Math.PI/8){let n=-Jf(t+Math.cos(e)*.085,r-Math.sin(e)*.085);n>i&&(i=n,a=e)}i<.02||Jf(t+Math.cos(a)*.035,r-Math.sin(a)*.035)<.01||n.push([t,r,a,Math.hypot(t-e.x,r-e.z)])}return n.length?(n.sort((e,t)=>e[3]-t[3]),n[Math.floor(z_()*Math.min(6,n.length))].slice(0,3)):null}grazeSpot(){let e=this.dish;if(!e)return null;let t=[e.centre.x+.17,e.centre.z-.035,Math.atan2(-.035,-.17)];if(this.nav.reachable(t[0],t[1]))return t;let n=this.rig.inputs,r=null,i=1/0;for(let t=0;t<12;t++){let a=t/12*Math.PI*2,o=e.centre.x+Math.cos(a)*.1,s=e.centre.z+Math.sin(a)*.1;if(!this.nav.reachable(o,s)||this.nav.isWet(o,s))continue;let c=Math.hypot(o-n.x,s-n.z);c<i&&(i=c,r=[o,s,Math.atan2(-(e.centre.z-s),e.centre.x-o)])}return r}sipSpot(e){let t=this.rig.inputs,n=e?.x??t.x,r=e?.z??t.z,i=null,a=1/0;for(let o of this.leafTips){let s=Math.hypot(o.x-n,o.z-r);if(!(s>(e?.16:.45))&&!(o.y-this.surface.heightAt(o.x,o.z)<.02))for(let e=0;e<8;e++){let n=e/8*Math.PI*2,r=o.x+Math.cos(n)*.066,c=o.z+Math.sin(n)*.066,l=o.y-this.surface.heightAt(r,c);if(l<.03||l>.06||!this.nav.reachable(r,c)||this.nav.isWet(r,c))continue;let u=s+Math.hypot(r-t.x,c-t.z)*.5+z_()*.05;u<a&&(a=u,i=[r,c,Math.atan2(-(o.z-c),o.x-r)],this.sipTip.copy(o))}}return i}misted(e){if(this.mode===`sleep`)return;let t=this.rig.inputs;if((e.distanceTo(this.rig.snout)<.07||Math.hypot(e.x-t.x,e.z-t.z)<.06)&&(this.snoutLickT=2.4,this.pose.lid=.15),this.t-this.lastMist<1.5||(this.lastMist=this.t,this.mode===`hunt`||this.sheltering||this.mode===`startle`||this.mode===`sip`||this.mode===`graze`||this.mode===`petted`)||this.mode===`travel`&&this.after===`sip`||Math.hypot(e.x-t.x,e.z-t.z)>.55||z_()>.8)return;let n=this.sipSpot(e);n&&this.goTo(n[0],n[1],`sip`)&&(this.faceHeading=n[2])}chooseActivity(){if(this.night){this.rig.inputs,this.goTo(this.sleepSpot[0],this.sleepSpot[1],`sleep`,.08)||this.setMode(`sleep`,`Falling asleep`);return}let e=this.insects.nearest(this.rig.snout);if(e&&this.canHunt(e)){this.startHunt(e);return}let t=z_(),n=this.rig.inputs,r=Math.hypot(n.x-this.baskSpot[0],n.z-this.baskSpot[1])<.03;if(this.bodyTemp>.74&&this.lampOnIt>.3){let e=this.nav.nearestWalkable(.35,.29,this.nav.mainRegion);if(e&&this.goTo(e[0],e[1],`idle`)){this.status=`Moving into the shade`;return}}if(this.needs.fatigue>.65){this.setMode(`idle`,`Resting`);return}if(z_()<.25&&this.bodyTemp>.4&&this.t>5){this.setMode(`idle`,r?`Basking under the lamp`:`Watching`);return}if(this.leavesWet>.25&&this.t-this.lastSip>20&&z_()<.6){let e=this.sipSpot();if(e&&this.goTo(e[0],e[1],`sip`)){this.faceHeading=e[2];return}}if(this.dish&&this.dish.remaining>0&&this.needs.satiety<.8&&this.t-this.lastGraze>45&&z_()<.35){let e=this.grazeSpot();if(e&&this.goTo(e[0],e[1],`graze`)){this.faceHeading=e[2];return}}if(this.needs.thirst>.35&&t<.18){let e=this.drinkSpot();if(e&&this.goTo(e[0],e[1],`drink`)){this.faceHeading=e[2];return}}if((t<.42||this.bodyTemp<.45&&t<.8)&&!r&&this.heat>.5&&this.goTo(this.baskSpot[0],this.baskSpot[1],`bask`)){this.faceHeading=this.baskSpot[2];return}if(t<.46){let e=this.nav.randomPoint(z_,{x0:-.5,x1:.5,z0:Z.d/2-.18,z1:Z.d/2-.135});if(e&&this.goTo(e[0],e[1],`idle`)){this.faceHeading=-Math.PI/2+(z_()-.5)*.6;return}}let i=[];for(let e=0;e<12;e++){let e=this.nav.randomPoint(z_,void 0,z_()<.75);if(!e)continue;let t=Math.hypot(e[0]-n.x,e[1]-n.z);t<.15||i.push([e[0],e[1],this.visitedAt(e[0],e[1])*4+Math.abs(t-.45)*.6+z_()*.3])}i.sort((e,t)=>e[2]-t[2]);for(let e of i.slice(0,3))if(this.goTo(e[0],e[1],`idle`)){this.faceHeading=null;return}this.setMode(`idle`,`Watching`)}canHunt(e){if(this.t<this.huntReassessUntil||this.rig.needsRecovery||!this.needs.wantsPrey||this.bodyTemp<.2||!this.surface.visibleFrom(this.rig.snout.clone().add(new G(0,.009,0)),e.pos.clone().add(new G(0,.006,0))))return!1;let t=this.ignorePrey.get(e)??-1;if(this.t<t)return!1;let n=this.rig.inputs,r=this.nav.nearestWalkable(e.pos.x,e.pos.z,this.nav.region[this.nav.idx(n.x,n.z)]??-1),i=!!r&&Math.hypot(r[0]-e.pos.x,r[1]-e.pos.z)<.07&&e.pos.y-this.surface.heightAt(e.pos.x,e.pos.z)<.05;return i||this.ignorePrey.set(e,this.t+6),i}standPoint(e,t=e.pos){let n=this.rig.inputs,r=this.nav.nearestWalkable(n.x,n.z),i=r?this.nav.region[this.nav.idx(...r)]:-1;if(Math.abs(t.x-.475)<.11&&t.z<.15&&this.surface.heightAt(t.x,t.z)<.12)return[.485,.32];let a=null,o=1/0;for(let e=-1;e<16;e++){let r=e<0?Math.atan2(n.z-t.z,n.x-t.x):e/16*Math.PI*2+this.standTries*.7,s=Math.cos(r),c=Math.sin(r),l=t.x+s*.12,u=t.z+c*.12;if(Math.abs(l-.475)<.14&&u<.26&&this.surface.heightAt(l,u)<.12||l<-.2&&u>.105&&u<.27&&this.surface.heightAt(l,u)>.12)continue;let d=this.nav.idx(l,u);if(d<0||this.nav.region[d]!==i||this.nav.isWet(l,u)||this.surface.heightAt(t.x+s*.035,t.z+c*.035)>t.y+.045)continue;let f=1/0,p=-1/0;for(let e of[-.055,.055])for(let t of[-.05,.05]){let n=this.surface.heightAt(l+s*e-c*t,u+c*e+s*t);f=Math.min(f,n),p=Math.max(p,n)}let m=p-f;if(m>.055)continue;let h=this.observation.velocity,g=this.observation.age<.25&&h.length()>.025?-(s*h.x+c*h.z)*.18:0,_=Math.hypot(l-n.x,u-n.z)+this.nav.costAt(l,u)*.02+g+m*4;_<o&&(o=_,a=[l,u])}return a}static VX=Math.ceil(Z.w/.1);static VZ=Math.ceil(Z.d/.1);visited=new Float32Array(e.VX*e.VZ);visitedCell(t,n){let r=B_(Math.floor((t+Z.w/2)/.1),0,e.VX-1);return B_(Math.floor((n+Z.d/2)/.1),0,e.VZ-1)*e.VX+r}visitedAt(e,t){return this.visited[this.visitedCell(e,t)]/60}startHunt(e){if(this.prey?.caught&&!this.prey.eaten)return;let t=this.mode===`travel`&&this.rig.maneuver===`climb`&&!this.rig.canRedirect&&this.pathI<this.path.length;this.huntDeparture=t,this.prey=e,this.observation.reset(),this.observation.update(.1,e.pos,!0),this.sightT=0,this.preyVisible=!0,t||(this.path=[]),this.huntGoal=null,this.huntPrey=null,this.huntReplanT=0,this.preyHiddenT=0,this.huntElapsed=0,this.huntDistance=0,this.lastPreyPosition.copy(e.pos),this.huntNoProgress=0,this.huntProgressAt.set(this.rig.inputs.x,this.rig.inputs.z,this.rig.inputs.heading),this.standTries=0,this.pauseT=0,this.leadT=0,this.lickT=0,this.hurry=!0,this.blockedT=0,this.stallT=0,this.pushedT=0,this.turnStallT=0,this.retreatT=0,this.retreatLeft=0,this.retreatSide=0,this.pivotRecovery=null,this.foodExit=!1,this.caveApproach=!1,this.caveBacking=!1,this.bowlExit=null;let n=this.rig.inputs;this.caveExit=Math.abs(n.x-.475)<.11&&n.z<.24&&this.surface.heightAt(n.x,n.z)<.12?Math.sin(n.heading)>0?-1:1:0,this.bowlExit=n.x>.43&&n.x<.52&&n.z>.3&&e.pos.x<.4?{x:n.x-Math.cos(n.heading)*.075,z:n.z+Math.sin(n.heading)*.075,heading:n.heading,time:0}:this.dishWithdrawal(e.pos.x,e.pos.z),this.foodExit=n.x>-.5&&n.x<-.34&&n.z>.29&&Math.cos(n.heading)<-.25&&(e.pos.x>-.35||this.surface.heightAt(e.pos.x,e.pos.z)>.15),this.foodExit&&(this.path=this.nav.path(n.x,n.z,.18,.365)??[],this.pathI=1,this.goal=null),this.stallRef.set(n.x,n.z),this.stallHeading=n.heading,this.misses=0,this.huntPhase=`notice`,this.phaseT=0,this.setMode(`hunt`,`Spotted a cricket`),this.posePreset(`alert`)}get sheltering(){return this.mode===`shelter`||this.hurry&&this.after===`shelter`&&(this.mode===`travel`||this.mode===`startle`)}seekShelter(e){return this.sheltering?!0:this.prey?.caught||!this.goTo(Kf.den.x,Kf.den.z,`shelter`,e?.22:.15)?!1:(this.hurry=!0,this.prey=null,this.faceHeading=R_,this.status=e?`Bolting for the cave`:`Heading for the cave`,this.posePreset(`walk`),!0)}lightning(e,t){let n=Math.hypot(e.x-this.rig.inputs.x,e.z-this.rig.inputs.z)<.3;if(this.stress=Math.min(1,this.stress+(n?.6:.3)*t*(this.mode===`shelter`?.5:1)),this.lookPoint.copy(e),this.looking=!0,this.lookT=2.5,this.mode===`shelter`){this.pose.lid=.1,this.pose.headPitch-=.15;return}this.mode===`sleep`&&(this.setMode(`idle`,`Woken by the thunder`),this.posePreset(`alert`));let r=Math.hypot(e.x-this.rig.inputs.x,e.z-this.rig.inputs.z);this.storm>.3&&this.seekShelter(r<.3*t)||(r<.22*t&&this.mode!==`hunt`?(this.startle(e),this.mode===`startle`&&(this.status=`Startled by the lightning`)):this.mode!==`startle`&&(this.pauseT=Math.max(this.pauseT,1.2+Math.random()*1.5),this.mode!==`travel`&&this.mode!==`hunt`&&(this.setMode(`idle`,`Watching the storm`),this.posePreset(`alert`))),this.rig.inputs.display=Math.max(this.rig.inputs.display,.5*t))}pet(){this.mode!==`sleep`&&this.mode!==`hunt`&&(this.stress=Math.max(0,this.stress-.3),this.setMode(`petted`,`Enjoying the attention`))}update(e){this.t+=e,this.modeT+=e;let t=this.rig.inputs;this.captureWith=null;{let n=Math.exp(-e/150);for(let e=0;e<this.visited.length;e++)this.visited[e]*=n;this.visited[this.visitedCell(t.x,t.z)]+=e}t.jaw=V_(t.jaw,0,6,e),t.tongue=V_(t.tongue,0,12,e),t.lunge=V_(t.lunge,0,10,e),t.shake=V_(t.shake,0,8,e),(this.mode!==`hunt`||this.huntPhase!==`strike`)&&(t.tongueReach=V_(t.tongueReach,0,20,e)),t.swallow=V_(t.swallow,0,3,e),t.bob=V_(t.bob,0,20,e),t.wave=V_(t.wave,0,3,e),t.display=V_(t.display,0,1.5,e),t.tailTwitch=V_(t.tailTwitch,0,6,e);let n=0,r=0;this.lateralRequest=0,this.bodyTemp+=(this.envTemp-this.bodyTemp)*(1-Math.exp(-e/32)),this.stress=Math.max(this.storm>.4?.45*this.storm:0,this.stress-e/18),t.tone=V_(t.tone,B_((.5-this.bodyTemp)*2.4,-1,1),.4,e),t.beardDark=V_(t.beardDark,U_((this.stress-.25)/.5),1.5,e);let i=this.mode===`bask`?B_((.9-this.bodyTemp)*2.2,.25,1)*Math.min(1,.3+this.lampOnIt):this.mode===`soak`||this.mode===`sleep`?.25:0;if(t.flatten=V_(t.flatten,i,1.2,e),this.pointer&&this.mode!==`sleep`&&this.mode!==`startle`&&this.mode!==`petted`&&!this.prey?.caught){let t=this.pointer.distanceTo(this.pointerPrev)/Math.max(e,.001);this.pointer.distanceTo(this.rig.snout)<.06&&t>.8&&z_()<.25&&this.startle(this.pointer),this.pointerPrev.copy(this.pointer)}if(this.prey?.caught&&!this.prey.eaten?(this.caughtT+=e,this.caughtT>25?(this.prey.eaten=!0,this.prey.group.visible=!1,this.prey=null,this.onTongue=!1):this.mode!==`hunt`&&this.mode!==`startle`&&this.mode!==`travel`&&(this.onTongue=!1,this.huntPhase!==`grip`&&this.huntPhase!==`chew`&&this.huntPhase!==`swallow`&&this.huntPhase!==`lick`&&(this.huntPhase=`grip`),this.phaseT=0,this.setMode(`hunt`,`Eating`))):this.caughtT=0,this.boredom=Math.max(0,this.boredom-e),(this.storm>.42||this.raining&&this.storm>.25)&&!this.sheltering&&this.mode!==`startle`&&this.modeT>.5&&this.seekShelter(!1),!this.night&&!this.sheltering&&this.mode!==`hunt`&&this.mode!==`startle`&&this.modeT>.8&&this.boredom<=0){let e=this.insects.nearest(this.rig.snout);e&&!e.airborne&&e.pos.distanceTo(this.rig.snout)<.6&&this.canHunt(e)?this.startHunt(e):e&&this.mode!==`travel`&&(this.lookPoint.copy(e.pos),this.looking=!0,this.lookT=.8)}if(this.night&&(this.mode===`bask`||this.mode===`idle`||this.mode===`display`)&&this.modeT>2.5&&this.chooseActivity(),t.headTilt=0,(this.mode===`idle`||this.mode===`bask`)&&t.look&&this.modeT>1){let e=this.tmpTilt.copy(t.look).sub(this.rig.snout),n=Math.max(.01,e.length()),r=e.y/n;if(r>.3&&n<.9){let n=e.x*Math.sin(t.heading)+e.z*Math.cos(t.heading);t.headTilt=-Math.sign(n||1)*B_((r-.3)*1.3,0,.42)}}switch(this.mode){case`bask`:if(this.faceHeading!==null&&Math.abs(H_(this.faceHeading-t.heading))>.12&&this.modeT<3){r=this.turnToward(this.faceHeading),this.posePreset(`alert`);break}this.posePreset(`bask`),this.status=this.bodyTemp<.42?`Warming up under the lamp`:this.bodyTemp>.78?`Hot: gaping to cool off`:`Basking under the lamp`,this.gapeT-=e,this.gapeT<-14-z_()*20&&this.bodyTemp>.7&&(this.gapeT=4+z_()*6),this.gapeT>0&&(t.jaw=V_(t.jaw,.38,4,e)),this.poseGoal.lid=this.gapeT>0?.7:.85,this.idleLook(e,.35),(this.bodyTemp>.74?this.modeT>20:this.bodyTemp>.5?this.modeT>45+z_()*900*e:this.modeT>150)&&this.chooseActivity();break;case`idle`:this.faceHeading!==null&&(r=this.turnToward(this.faceHeading)),this.modeT>.3&&this.posePreset(this.modeT>6?`rest`:`alert`),this.idleLook(e,.55),this.modeT>this.holdFor&&(this.faceHeading=null,this.chooseActivity());break;case`display`:if(this.posePreset(`alert`),this.displayKind===`bob`){let e=this.modeT;e>.4&&e<2.2&&(t.bob=.9*Math.max(0,Math.sin((e-.4)*15)),t.display=Math.max(t.display,.6)),this.lookAtCamera()}else this.modeT>.3&&this.modeT<3.2&&(t.wave=1),this.poseGoal.headPitch=-.05;this.modeT>4&&this.setMode(`idle`,`Watching`);break;case`travel`:{let t=this.travel(e);n=t.speed,r=t.turn;break}case`drink`:{if(this.faceHeading!==null&&Math.abs(H_(this.faceHeading-t.heading))>.12&&this.modeT<2){r=this.turnToward(this.faceHeading),this.posePreset(`alert`);break}this.posePreset(`drink`),this.status=`Drinking`,this.rig.inputs.look=null,this.drinkPitch=B_(this.drinkPitch-(this.rig.mouth.y-(Wf+.002))*22*e,-1.1,.2),this.poseGoal.headPitch=this.drinkPitch;let n=this.modeT-.8;if(n>0){let e=n*1.8%1;t.tongue=e<.35?Math.sin(e/.35*Math.PI):0,t.jaw=Math.max(t.jaw,t.tongue*.18);let r=Math.floor(n*1.8);r>this.lapCount&&e>.15&&(this.lapCount=r,this.needs.drink(.08),this.onLap?.(this.rig.mouth.clone()))}this.modeT>6+z_()*50*e&&(this.lapCount=0,this.drinkPitch=-.55,this.setMode(`idle`,`Watching`));break}case`soak`:this.posePreset(`rest`),this.poseGoal.clearance=-.05,this.poseGoal.lid=.55,this.idleLook(e,.2),this.modeT>9+z_()*500*e&&this.chooseActivity();break;case`hunt`:{let t=this.hunt(e);n=t.speed,r=t.turn;break}case`sleep`:if(this.modeT<5&&Math.abs(H_(R_-t.heading))>.12){r=this.turnToward(R_),this.posePreset(`rest`),t.look=null;break}this.posePreset(`sleep`),t.look=null,this.status=this.modeT<4?`Falling asleep`:`Asleep`,!this.night&&this.modeT>3&&(this.posePreset(`alert`),this.setMode(`idle`,`Waking up`));break;case`startle`:{let t=this.travel(e);n=t.speed,r=t.turn;break}case`shelter`:if(this.modeT<3&&Math.abs(H_(R_-t.heading))>.15){r=this.turnToward(R_),this.posePreset(`alert`);break}this.night&&this.modeT>6?(this.posePreset(`sleep`),t.look=null,this.status=`Asleep in the cave`):(this.posePreset(`rest`),this.poseGoal.headPitch=.1,this.poseGoal.lid=.8,this.status=this.storm>.2||this.raining?`Sheltering in the cave`:`Peering out of the cave`,this.idleLook(e,.45)),this.clearT=this.storm<.15&&!this.raining?this.clearT+e:0,this.clearT>6&&!this.night&&(this.clearT=0,this.hurry=!1,this.posePreset(`alert`),this.chooseActivity());break;case`graze`:{let n=this.dish;if(!n||n.remaining<=0||this.grazeBites>=4){this.setMode(`idle`,`Content`);break}if(this.status=`Eating greens`,this.grazeT+=e,this.grazePhase===`face`){if(this.posePreset(`alert`),this.faceHeading!==null&&Math.abs(H_(this.faceHeading-t.heading))>.12&&this.grazeT<2){r=this.turnToward(this.faceHeading);break}this.grazePhase=`reach`,this.grazeT=0}this.lookPoint.copy(n.centre),this.lookPoint.y+=n.foodHeight,this.looking=!0,t.look=this.lookPoint,this.posePreset(`alert`),this.poseGoal.chestLift=.65,this.poseGoal.headPitch=-.1,this.grazePhase===`reach`?(t.lunge=Math.max(t.lunge,Math.min(1,this.grazeT/.4)*.35),t.jaw=Math.max(t.jaw,Math.min(1,this.grazeT/.4)*.38),this.grazeT>.45&&(this.grazePhase=`bite`,this.grazeT=0)):this.grazePhase===`bite`?(t.jaw=.04,this.grazeT>.08&&n.take(this.rig.mouth)?(this.needs.eat(.06),this.onCrunch?.(this.rig.mouth,.35),this.grazePhase=`chew`,this.grazeT=0,this.grazeBites++):this.grazeT>.3&&(this.grazePhase=`chew`,this.grazeT=0,this.grazeBites++)):(this.poseGoal.headPitch=.05,t.look=null,t.jaw=.06+.14*Math.max(0,Math.sin(this.grazeT*17)),this.grazeT>1.1&&this.grazeT<1.5&&(t.tongue=Math.max(t.tongue,Math.sin((this.grazeT-1.1)/.4*Math.PI)*.5)),this.grazeT>1.7&&(this.grazePhase=`reach`,this.grazeT=0));break}case`sip`:{if(this.faceHeading!==null&&Math.abs(H_(this.faceHeading-t.heading))>.12&&this.modeT<2){r=this.turnToward(this.faceHeading),this.posePreset(`alert`);break}this.posePreset(`alert`),this.status=`Lapping droplets off the leaves`,this.lookPoint.copy(this.sipTip),this.looking=!0,t.look=this.lookPoint;{let e=Math.atan2(-(this.sipTip.z-t.z),this.sipTip.x-t.x);Math.abs(H_(e-t.heading))>.04&&(r=this.turnToward(e)*.5);let n=Math.hypot(this.sipTip.x-t.x,this.sipTip.z-t.z)-Math.hypot(this.rig.mouth.x-t.x,this.rig.mouth.z-t.z);t.lunge=Math.max(t.lunge,B_(n/.03,0,.3))}this.poseGoal.chestLift=1.15,this.sipPitch=B_(this.sipPitch-(this.rig.mouth.y-this.sipTip.y)*18*e,-.5,.35),this.poseGoal.headPitch=this.sipPitch;let n=this.modeT-.9;if(n>0){let e=n*1.6%1;t.tongue=Math.max(t.tongue,e<.4?Math.sin(e/.4*Math.PI)*.85:0),t.jaw=Math.max(t.jaw,t.tongue*.15);let r=Math.floor(n*1.6);r>this.lapCount&&e>.2&&(this.lapCount=r,this.onSip?.(this.sipTip))}this.modeT>5+z_()*60*e&&(this.lapCount=0,this.lastSip=this.t,this.setMode(`idle`,`Watching`));break}case`petted`:this.posePreset(`rest`),this.poseGoal.lid=.15,this.poseGoal.headPitch=-.1,t.look=null,this.modeT>3&&this.setMode(`idle`,`Watching`)}if(this.rig.needsRecovery&&![`travel`,`startle`,`hunt`].includes(this.mode)){let i=this.mode;this.posePreset(`walk`),t.look=null;let a=this.travel(e);this.mode=i,this.status=`Settling a foot`,n=a.speed,r=a.turn}if(this.raining&&this.mode!==`sleep`&&z_()<e*.15&&(t.tongue=Math.max(t.tongue,.6)),this.snoutLickT>0){this.snoutLickT-=e;let n=this.snoutLickT*2.2%1;this.mode!==`hunt`&&(t.tongue=Math.max(t.tongue,n>.6?Math.sin((n-.6)/.4*Math.PI)*.7:0))}let a=[`idle`,`bask`,`sleep`,`shelter`,`petted`].includes(this.mode)&&Math.abs(n)<.005&&Math.abs(r)<.1&&!this.lateralRequest,o=this.restTransition.update(e,a,this.rig.motion.transferring,this.rig.motion.speed,this.rig.motion.turnRate);n*=o.advance,t.restAdjustment=o.adjust,this.speed=V_(this.speed,n,n>this.speed?9:14,e),this.turn=V_(this.turn,r,5,e),this.lateralSpeed=V_(this.lateralSpeed,this.lateralRequest,12,e),!this.lateralRequest&&Math.abs(this.lateralSpeed)<1e-4&&(this.lateralSpeed=0),t.lateralSpeed=this.lateralSpeed,t.speed=this.speed,t.turnRate=this.turn;let s=t.heading;t.heading=H_(t.heading+this.turn*e);let c=t.x,l=t.z,u=t.x+(Math.cos(t.heading)*this.speed+Math.sin(t.heading)*this.lateralSpeed)*e,d=t.z+(-Math.sin(t.heading)*this.speed+Math.cos(t.heading)*this.lateralSpeed)*e,f=this.mode===`hunt`&&this.huntPhase===`approach`&&this.preyVisible&&this.observation.position.z<.15&&Math.abs(this.observation.position.x-.475)<.11&&Math.abs(H_(t.heading-Math.PI/2))<.15&&d>.215,p=(this.caveBacking||this.caveExit!==0||f)&&Math.abs(u-.485)<.06&&d>-.1&&d<.31&&this.surface.heightAt(u,d)<.12,m=this.mode===`hunt`&&!this.caveExit&&!p&&Math.abs(u-.475)<.14&&d<.26&&d<t.z&&this.surface.heightAt(u,d)<.12,h=this.retreatT>0&&this.retreatLeft>0&&this.rig.maneuver!==`climb`&&this.surface.heightAt(u,d)<.12&&Math.abs(this.surface.heightAt(u,d)-this.surface.heightAt(t.x,t.z))<.008;!m&&(Math.hypot(this.speed,this.lateralSpeed)<1e-4||(this.nav.walkable(u,d)||p||h)&&this.nav.canTraverse(t.x,t.z,u,d)||!this.nav.walkable(t.x,t.z))?(t.x=u,t.z=d,this.blockedT=0):(this.speed*=.5,this.blockedT+=e),t.speed=Math.sign(this.speed)*Math.hypot(t.x-c,t.z-l)/Math.max(e,1e-6),this.lateralSpeed&&(t.speed=((t.x-c)*Math.cos(t.heading)-(t.z-l)*Math.sin(t.heading))/e,t.lateralSpeed=((t.x-c)*Math.sin(t.heading)+(t.z-l)*Math.cos(t.heading))/e);let g=t.x,_=t.z,v=this.pose,y=this.poseGoal;v.clearance=V_(v.clearance,y.clearance,o.bodyRate,e),v.chestLift=V_(v.chestLift,y.chestLift,o.bodyRate,e),v.headPitch=V_(v.headPitch,y.headPitch,o.headRate,e),v.lid=V_(v.lid,y.lid,this.mode===`sleep`?.6:5,e),v.breath=V_(v.breath,y.breath,o.breathRate,e),t.clearance=v.clearance+(Math.abs(this.speed)>.02?.2:0),t.chestLift=v.chestLift,t.headPitch=v.headPitch,t.lid=v.lid,t.breath=v.breath,t.tracking=this.mode===`hunt`;let b=this.rig.mouth.clone(),x=this.rig.model.tongueTip.clone();if(this.rig.update(e),Math.abs(H_(t.heading-s))>5e-4&&(this.blockedT=0),this.needs.update(e,Math.hypot(t.x-c,t.z-l),Math.abs(this.rig.motion.speed)<.003),this.captureWith&&this.prey&&!this.prey.caught){let e=this.captureWith===`tongue`,t=this.prey,n=t.pos.clone();n.y+=.004,N_(n,e?x:b,e?this.rig.model.tongueTip:this.rig.mouth,e?.011:.018,this.surface.tailContacts)&&(t.caught=!0,t.airborne=!1,this.onTongue=e)}let S=this.mode===`travel`||this.mode===`startle`||this.mode===`hunt`&&(this.huntPhase===`approach`||this.huntDeparture),C=this.caveExit!==0||this.caveBacking||this.bowlExit!==null;S&&(C||this.pauseT<=0&&this.leadT<=0)&&this.retreatT<=0?(this.stallT+=e,(Math.hypot(t.x-this.stallRef.x,t.z-this.stallRef.y)>.004||Math.abs(H_(t.heading-this.stallHeading))>.06)&&(this.stallT=0,this.stallRef.set(t.x,t.z),this.stallHeading=t.heading)):(this.stallT=0,this.stallRef.set(t.x,t.z),this.stallHeading=t.heading),this.mode!==`travel`||Math.hypot(t.x-this.travelProgressAt.x,t.z-this.travelProgressAt.y)>.003||Math.abs(H_(t.heading-this.travelProgressAt.z))>.06?(this.travelNoProgress=0,this.travelProgressAt.set(t.x,t.z,t.heading)):this.travelNoProgress+=e,this.travelNoProgress>6&&!this.rig.motion.transferring&&(this.nav.avoidApproach(t.x,t.z,t.heading),this.path=[],this.faceHeading=null,this.retreatT=0,this.retreatLeft=0,this.retreatSide=0,this.speed=0,this.turn=0,t.speed=0,t.turnRate=0,this.posePreset(`alert`),this.setMode(`idle`,`Pausing to reassess the route`),this.boredom=Math.max(this.boredom,3),this.travelNoProgress=0);let w=Math.abs(this.turn)>.3&&!this.rig.placingFoot&&Math.abs(H_(t.heading-s))<1e-4;this.turnStallT=w?this.turnStallT+e:Math.max(0,this.turnStallT-e),this.retreatLeft>0&&(this.speed*this.retreatSign>0||this.lateralSpeed*this.retreatSide>0)&&(this.retreatLeft=Math.max(0,this.retreatLeft-Math.hypot(t.x-c,t.z-l)));let T=-((t.x-g)*Math.cos(t.heading)-(t.z-_)*Math.sin(t.heading));if(this.pushedT=!this.rig.placingFoot&&this.speed>.01&&T>.5*this.speed*e?this.pushedT+e:Math.max(0,this.pushedT-e),this.prey&&this.prey.caught&&this.onTongue)this.prey.pos.copy(this.rig.model.tongueTip),this.prey.group.position.copy(this.prey.pos);else if(this.prey&&this.prey.caught){let e=this.prey,t=this.rig.headForward,n=new G().crossVectors(t,new G(0,1,0)).normalize().multiplyScalar(this.preySide),r=new G().crossVectors(n,t).normalize().multiplyScalar(this.preySide),i=(.006+.004*(1-e.consumed))*(1-e.consumed*.7);e.pos.copy(this.rig.mouth).addScaledVector(n,i).addScaledVector(r,-.0022),e.group.position.copy(e.pos);let a=new K().makeBasis(n,r,new G().crossVectors(n,r));e.group.quaternion.setFromRotationMatrix(a),e.group.rotation.order=`XYZ`}}turnToward(e){let t=this.clearTurnError(e);return Math.abs(t)<.06?0:B_(t*3.2,-1.25,1.25)}clearTurnError(e){let t=this.rig.inputs,n=H_(e-t.heading);if(Math.abs(n)<.25||t.z<.29)return n;let r=e=>{let n=t.z;for(let r=0;r<=16;r++)n=Math.max(n,t.z-Math.sin(t.heading+e*r/16)*.13+.025);return n},i=n-Math.sign(n)*Math.PI*2;return r(n)>.435&&r(i)<r(n)-.012?i:n}idleLook(e,t){this.lookT-=e;let n=this.rig.inputs;if(this.lookT<0){this.lookT=this.restTransition.settled>2?2.5+z_()*5:.8+z_()*3;let e=z_();this.pointer&&this.pointer.distanceTo(this.rig.snout)<.3?(this.lookPoint.copy(this.pointer),this.looking=!0):e<t&&this.cameraPos.distanceTo(this.rig.snout)<2.2?(this.lookPoint.copy(this.cameraPos),this.looking=!0):e<t+.35?(this.lookPoint.set(n.x+(z_()-.5)*.6,this.rig.snout.y+(z_()-.3)*.15,n.z+(z_()-.5)*.4),this.looking=!0):this.looking=!1}n.look=this.looking?this.lookPoint:null}lookAtCamera(){this.lookPoint.copy(this.cameraPos),this.rig.inputs.look=this.lookPoint}startle(e){let t=this.rig.inputs;this.stress=Math.min(1,this.stress+.35);let n=Math.atan2(-(t.z-e.z),t.x-e.x),r=.1+z_()*.08,i=t.x+Math.cos(n)*r,a=t.z-Math.sin(n)*r;this.goTo(i,a,`idle`,.38)&&(this.mode=`startle`,this.status=`Startled`,this.burstLeft=r,this.faceHeading=Math.atan2(-(e.z-a),e.x-i))}arrive(){this.mode===`hunt`?this.pathI=this.path.length:(this.path=[],this.mode===`startle`?this.setMode(`idle`,`Watching`):(this.setMode(this.after,this.after===`bask`?`Basking under the lamp`:this.after===`drink`?`Drinking`:this.after===`sleep`?`Asleep`:this.after===`soak`?`Soaking in the shallows`:this.after===`shelter`?`Sheltering in the cave`:this.after===`graze`?`Eating greens`:this.after===`sip`?`Lapping droplets off the leaves`:`Watching`),this.after===`graze`&&(this.grazePhase=`face`,this.grazeBites=0,this.grazeT=0,this.lastGraze=this.t),this.after===`bask`&&this.posePreset(`bask`),this.after===`sip`&&(this.sipPitch=0,this.lapCount=0)))}pathPoint(e,t){let n=this.rig.inputs,r=n.x,i=n.z,a=e;for(let e=this.pathI;e<this.path.length;e++){let[n,o]=this.path[e],s=Math.hypot(n-r,o-i);if(s>=a){let e=a/Math.max(s,1e-6);return t[0]=r+(n-r)*e,t[1]=i+(o-i)*e,t}a-=s,r=n,i=o}return t[0]=r,t[1]=i,t}remaining(){let e=this.rig.inputs,t=0,n=e.x,r=e.z;for(let e=this.pathI;e<this.path.length;e++)t+=Math.hypot(this.path[e][0]-n,this.path[e][1]-r),n=this.path[e][0],r=this.path[e][1];return t}replan(){let e=this.rig.inputs,t=this.foodExit?[.18,.365]:this.goal??this.path[this.path.length-1];if(!t||(Math.hypot(e.x-this.replanOrigin.x,e.z-this.replanOrigin.y)>.035&&(this.replans=0,this.replanOrigin.set(e.x,e.z)),this.replans++,this.replans>4))return!1;let n=this.nav.path(e.x,e.z,t[0],t[1]);return!n||n.length<2?!1:(this.path=n,this.pathI=1,this.blockedT=0,!0)}recoveryDestinationClear(e,t){let n=this.rig.inputs,r=this.surface.heightAt(n.x,n.z);return r>=.12||![.25,.5,.75,1].every(i=>Math.abs(this.surface.heightAt(n.x+(e-n.x)*i,n.z+(t-n.z)*i)-r)<.008)?!1:this.nav.walkable(e,t)?!0:!this.nav.walkable(n.x,n.z)}recoverySides(){let e=this.rig.inputs;return[-1,1].map(t=>{let n=e.x+Math.sin(e.heading)*.03*t,r=e.z+Math.cos(e.heading)*.03*t;return{side:t,clear:this.recoveryDestinationClear(n,r),room:Math.min(Z.w/2-Math.abs(n),Z.d/2-Math.abs(r)),cost:this.rig.recoveryCost(0,t)}}).filter(e=>e.clear).sort((e,t)=>e.cost-t.cost||t.room-e.room)}travel(e){let t=this.rig.inputs;if(this.pivotRecovery){let n=this.pivotRecovery;if(n.time-=e,n.remaining-=Math.max(0,this.rig.motion.turnRate*n.direction)*e,t.look=null,this.poseGoal.headPitch=.1,n.time>0&&n.remaining>.04)return{speed:0,turn:.6*n.direction};this.pivotRecovery=null,this.stallT=0,this.turnStallT=0,n.depart?(this.retreatSign=n.depart,this.retreatSide=0,this.retreatLeft=.05,this.retreatT=4,this.retreatReversed=!0,this.climbBacking=n.depart<0,this.speed=0,this.turn=0):this.replan()}if(this.bowlExit&&(t.look=null,this.poseGoal.headPitch=.15,this.poseGoal.chestLift=.4),this.foodExit&&t.x>.155){if(this.foodExit=!1,this.mode===`hunt`)return this.path=[],this.goal=null,this.huntPrey=null,{speed:0,turn:0};this.replan()}if((this.stallT>1.5||this.rig.needsRecovery)&&this.retreatT<=0){if(this.mode===`hunt`&&this.rig.maneuver!==`climb`&&!this.caveExit&&!this.bowlExit&&(this.nav.avoidApproach(t.x,t.z,t.heading),this.replan()),this.retreatSign=-Math.sign(this.speed||1),this.retreatLeft=.025,this.retreatT=2,this.retreatReversed=!1,this.retreatSide=0,this.rig.maneuver===`climb`&&!this.rig.motion.transferring){let e=Math.min(this.rig.recoveryCost(-1,0),this.rig.recoveryCost(1,0)),n=this.goal??this.path.at(-1),r=new G;this.surface.normalAt(t.x,t.z,r);let i=n?Math.atan2(-(n[1]-t.z),n[0]-t.x):t.heading;Math.hypot(r.x,r.z)>.12&&(i=Math.atan2(-r.z,r.x),n&&(n[0]-t.x)*r.x+(n[1]-t.z)*r.z<0&&(i+=Math.PI));let a=Math.sign(H_(i-t.heading))||1,o=e=>e<=1e-4?0:e,s=[a,-a].map(e=>({direction:e,cost:this.rig.recoveryCost(0,0,e)})).sort((e,t)=>o(e.cost)-o(t.cost));if(s[0].cost<e-1e-5){this.retreatT=0,this.retreatLeft=0,this.speed=0,this.turn=0;let e=H_(i-t.heading),n=1;Math.sign(e)!==s[0].direction&&(e+=s[0].direction*Math.PI,n=-1);let r=Math.max(.2,Math.abs(e));return this.pivotRecovery={direction:s[0].direction,remaining:r,time:Math.min(18,2+r/.2),depart:n},t.look=null,this.poseGoal.headPitch=.1,{speed:0,turn:.6*s[0].direction}}}if(this.rig.maneuver!==`climb`){let e=[-1,1].map(e=>{let n=t.x+Math.cos(t.heading)*.03*e,r=t.z-Math.sin(t.heading)*.03*e;return{forward:e,side:0,turn:0,clear:this.recoveryDestinationClear(n,r),cost:this.rig.recoveryCost(e,0)}}),n=e.find(e=>e.forward===this.retreatSign),r=this.goal??this.path.at(-1),i=r&&Math.sign(H_(Math.atan2(-(r[1]-t.z),r[0]-t.x)-t.heading))||1,a=[i,-i].map(e=>({forward:0,side:0,turn:e,cost:this.rig.recoveryCost(0,0,e)})),o=e=>e<=1e-4?0:e,s=[...e.filter(e=>e.clear),...this.recoverySides().map(e=>({...e,forward:0,turn:0})),...a].sort((e,t)=>o(e.cost)-o(t.cost))[0];if(s&&(!n.clear||s.cost<n.cost-1e-5)){if(s.turn)return this.retreatT=0,this.retreatLeft=0,this.speed=0,this.turn=0,this.pivotRecovery={direction:s.turn,remaining:.75,time:3},t.look=null,this.poseGoal.headPitch=.1,{speed:0,turn:.6*s.turn};this.retreatSide=s.side,this.retreatSign=s.forward||this.retreatSign,this.retreatReversed=s.side!==0||s.forward!==n.forward,this.speed=0,this.turn=0}}this.stallT=0,this.pushedT=0,this.turnStallT=0}if(this.retreatT>0){if(t.look=null,this.poseGoal.headPitch=.1,this.retreatT-=e,this.retreatLeft>.003&&this.retreatT>0)return this.lateralRequest=.025*this.retreatSide,{speed:this.retreatSide?0:.025*this.retreatSign,turn:0};if(this.retreatT<=0&&this.retreatLeft>.02&&(!this.retreatReversed||this.retreatSide!==0)){if(this.rig.maneuver!==`climb`&&!this.retreatSide){let e=this.recoverySides();if(e.length)return this.retreatSide=e[0].side,this.retreatLeft=.025,this.retreatT=2,this.retreatReversed=!0,this.speed=0,this.turn=0,this.lateralRequest=.025*this.retreatSide,{speed:0,turn:0}}return this.retreatSide=0,this.retreatSign*=-1,this.retreatLeft=.025,this.retreatT=2,this.retreatReversed=!0,{speed:.025*this.retreatSign,turn:0}}this.retreatT=0,this.retreatLeft=0,this.retreatSide=0,this.stallT=0,this.pushedT=0,this.turnStallT=0,this.blockedT=0}if(this.bowlExit){let n=this.bowlExit;if(n.time+=e,Math.hypot(t.x-n.x,t.z-n.z)>.012&&n.time<12){let e=H_(n.heading-t.heading);return this.posePreset(`walk`),n.side&&(this.lateralRequest=Math.abs(e)<.3?.025*n.side:0),{speed:!n.side&&Math.abs(e)<.3?-.05:0,turn:B_(e*3,-.6,.6)}}n.unload&&t.x>-.5&&t.x<-.34&&t.z>.29&&Math.cos(t.heading)<-.25&&(this.foodExit=!0),this.bowlExit=null,this.posePreset(`walk`),this.replan()}if(this.caveApproach&&(this.caveBacking||Math.hypot(t.x-.485,t.z-.28)<.025)){this.caveBacking=!0;let e=t.z-this.goal[1];if(e<.014)return this.caveApproach=!1,this.faceHeading=-Math.PI/2,this.arrive(),{speed:0,turn:0};let n=H_(Math.atan2(e,.485-t.x)+Math.PI-t.heading);return this.posePreset(`walk`),t.look=null,this.poseGoal.headPitch=.1,{speed:Math.abs(n)<.1?-.035:0,turn:B_(n*3,-.8,.8)}}if(this.caveExit){if(t.z<.28){let e=H_(Math.atan2(-(.32-t.z),.485-t.x)+(this.caveExit<0?Math.PI:0)-t.heading);return{speed:Math.abs(e)<.35?.035*this.caveExit:0,turn:B_(e*3,-.6,.6)}}if(this.caveExit=0,this.mode===`hunt`)return this.path=[],this.huntGoal=null,this.huntPrey=null,this.goal=null,{speed:0,turn:0};this.replan()}if(!this.path.length||this.pathI>=this.path.length)return this.arrive(),{speed:0,turn:0};if(this.blockedT>.8||this.stallT>8||this.turnStallT>2||this.pushedT>3&&this.remaining()>.06){if(this.pushedT>3||this.stallT>8||this.turnStallT>2)return this.nav.avoidApproach(t.x,t.z,t.heading),this.retreatSide=0,this.retreatSign=-1,this.retreatLeft=.025,this.retreatT=2,this.stallT=0,this.pushedT=0,this.turnStallT=0,this.status=`Finding a firmer foothold`,{speed:-.025,turn:0};if(this.stallT=0,this.pushedT=0,!this.replan())return this.path=[],this.mode===`hunt`||(this.faceHeading=null,this.setMode(`idle`,`Watching`)),{speed:0,turn:0}}if(this.pauseT>0){if(this.pauseT-=e,this.idleLook(e,.25),this.lickT>0){this.lickT-=e,t.look=null,this.poseGoal.headPitch=-.45;let n=1-this.lickT/.5;n>.35&&n<.6&&(t.tongue=Math.max(t.tongue,Math.sin((n-.35)/.25*Math.PI)*.55))}else this.mode===`travel`&&!this.hurry&&z_()<e*.25&&(this.lickT=.5);return this.mode!==`startle`&&this.posePreset(this.pauseT>1.2?`rest`:`alert`),this.pauseT<=0&&(this.burstLeft=.1+z_()*.3,this.posePreset(`walk`),this.leadT=.25),{speed:0,turn:0}}for(;this.pathI<this.path.length-1;){let[e,n]=this.path[this.pathI],[r,i]=this.path[this.pathI+1],a=this.nav.lineClear(t.x,t.z,r,i,1/0);if(Math.hypot(e-t.x,n-t.z)<.018&&a){this.pathI++;continue}let o=r-e,s=i-n;if((t.x-e)*o+(t.z-n)*s>0&&a)this.pathI++;else break}let n=this.remaining(),[r,i]=this.path[this.path.length-1];if(n<.014||this.pathI===this.path.length-1&&Math.hypot(r-t.x,i-t.z)<.014)return this.arrive(),{speed:0,turn:0};let a=this.pathPoint(Math.min(.11,n),this.tmp2),o=Math.max(0,.11-n),s=a[0]+Math.cos(t.heading)*o,c=a[1]-Math.sin(t.heading)*o;this.lookPoint.set(s,Math.max(this.surface.heightAt(s,c),this.surface.heightAt(t.x,t.z)-.01)+.02,c),t.look=this.lookPoint;let l=this.pathPoint(Math.min(.062,n),this.tmp2);for(let e of[.04,.025,.012,.005]){if(this.nav.lineClear(t.x,t.z,l[0],l[1],1/0))break;l=this.pathPoint(Math.min(e,n),this.tmp2)}this.climbBacking&&this.rig.canRedirect&&this.surface.heightAt(t.x,t.z)<.12&&this.surface.heightAt(this.rig.snout.x,this.rig.snout.z)<.12&&(this.climbBacking=!1);let u=this.foodExit||this.climbBacking;this.climbBacking&&(t.look=null,this.poseGoal.headPitch=.1);let d=Math.atan2(-(l[1]-t.z),l[0]-t.x)+(u?Math.PI:0),f=this.clearTurnError(d);if(this.leadT>0)return this.leadT-=e,{speed:0,turn:Math.abs(f)>1.2?Math.sign(f)*1.1:0};if(this.path!==this.nearPath&&(this.nearPath=this.path,this.nearBest=1/0,this.nearT=0),n<this.nearBest-.005?(this.nearBest=n,this.nearT=0):this.nearT+=e,n<.025&&(Math.abs(f)>1||this.nearT>1.5||this.pushedT>.25))return this.pushedT=0,this.arrive(),{speed:0,turn:0};let p=(u?Math.min(this.cruise,.05):this.cruise)*Math.max(0,Math.cos(f))**2;Math.abs(f)>1.25&&(p=0),p*=B_(n/.05,.4,1),this.nav.isWet(t.x,t.z)&&(p*=.6);let m=this.surface.heightAt(t.x+Math.cos(t.heading)*.04,t.z-Math.sin(t.heading)*.04)-this.surface.heightAt(t.x,t.z);p*=B_(1/(1+Math.abs(m)/.03),.35,1);let h=this.mode===`startle`?2:this.mode===`hunt`?1.8:1.15,g=B_(f*3.3,-h,h);return this.burstLeft-=this.speed*e,this.burstLeft<=0&&this.mode!==`startle`&&!this.hurry&&n>.08&&(this.pauseT=z_()<.25?1.2+z_()*2.5:.25+z_()*.7),{speed:u?-p:p,turn:g}}hunt(e){let t=this.rig.inputs,n=this.prey;if(!n||n.eaten&&this.huntPhase!==`lick`)return this.prey=null,this.setMode(`idle`,`Watching`),{speed:0,turn:0};this.sightT-=e,!n.caught&&this.sightT<=0&&(this.sightT=.075,this.preyVisible=this.surface.visibleFrom(this.rig.snout.clone().add(new G(0,.009,0)),n.pos.clone().add(new G(0,.006,0)))),this.observation.update(e,n.pos,this.preyVisible&&!n.caught),Math.hypot(t.x-this.huntProgressAt.x,t.z-this.huntProgressAt.y)>.004||Math.abs(H_(t.heading-this.huntProgressAt.z))>.06||this.huntPhase!==`approach`&&!this.huntDeparture?(this.huntNoProgress=0,this.huntProgressAt.set(t.x,t.z,t.heading)):this.huntNoProgress+=e;let r=this.huntDistance>.35?45:90,i=this.observation.age>8&&(this.rig.snout.distanceTo(this.observation.position)<.03||this.huntElapsed>r),a=this.huntNoProgress>4;if(!n.caught&&(i||a))return this.ignorePrey.set(n,this.t+20),this.prey=null,this.path=[],this.faceHeading=null,this.setMode(`idle`,`Watching escaped prey`),a&&(this.huntReassessUntil=this.t+12,this.holdFor=.8,t.look=null),{speed:0,turn:0};let o=this.preyVisible?n.pos:this.observation.position;if(!n.caught&&(this.huntElapsed+=e,this.preyVisible&&(this.huntDistance+=o.distanceTo(this.lastPreyPosition),this.lastPreyPosition.copy(o)),this.huntElapsed>45&&this.huntDistance>.35))return this.ignorePrey.set(n,this.t+20),this.prey=null,this.path=[],this.faceHeading=null,this.setMode(`idle`,`Watching escaped prey`),{speed:0,turn:0};this.phaseT+=e;let s=this.rig.snout,c=new G().subVectors(o,s),l=Math.hypot(c.x,c.z),u=Math.atan2(-(o.z-t.z),o.x-t.x),d=H_(u-t.heading);if(n.caught||(this.lookPoint.copy(o),this.lookPoint.y+=.006,t.look=this.lookPoint),this.huntDeparture){this.posePreset(`walk`);let t=this.travel(e);return this.mode=`hunt`,this.status=`Finishing a supported climb`,(this.rig.canRedirect||this.pathI>=this.path.length)&&(this.huntDeparture=!1,this.path=[],this.goal=null,this.huntPhase=`notice`,this.phaseT=0),t}switch(this.huntPhase){case`notice`:return this.status=`Spotted a cricket`,this.rig.motion.transferring&&this.phaseT<1.2?this.rig.needsRecovery||this.retreatT>0?this.travel(e):{speed:0,turn:0}:(this.phaseT>.5+z_()*.02&&(this.huntPhase=`approach`,this.phaseT=0),{speed:0,turn:this.rig.canRedirect&&!this.caveExit&&!this.bowlExit&&Math.abs(d)>.6?this.turnToward(u):0});case`approach`:{if(this.status=this.preyVisible?`Chasing a cricket`:`Checking where the cricket disappeared`,this.posePreset(`walk`),this.caveExit||this.bowlExit||this.foodExit)return this.travel(e);if(this.retreatT>0||this.stallT>1.5||this.rig.needsRecovery)return this.retreatT<=0&&this.rig.maneuver!==`climb`&&(this.standTries++,this.huntPrey=null,this.huntReplanT=0),this.travel(e);let r=this.observation.predict(l,this.preyVisible&&n.airborne,this.surface.heightAt(o.x,o.z)),i=this.surface.heightAt(r.x,r.z);this.observation.age>.25||!this.nav.dry(r.x,r.z)||!this.nav.lineClear(o.x,o.z,r.x,r.z,1/0)||Math.abs(i-this.surface.heightAt(o.x,o.z))>.025?r.copy(o):r.y=i;let a=o.distanceTo(this.rig.mouth),s=(o.x-this.rig.mouth.x)*Math.cos(t.heading)-(o.z-this.rig.mouth.z)*Math.sin(t.heading);if(!n.airborne&&l<.09&&Math.hypot(o.x-t.x,o.z-t.z)<.125&&s<-.008&&Math.abs(d)<.4)return this.retreatSide=0,this.retreatSign=-1,this.retreatLeft=B_(-s+.025,.025,.065),this.retreatT=2.5,this.path=[],this.huntPrey=null,this.huntReplanT=0,{speed:-.05,turn:0};if(this.preyVisible&&!n.airborne&&a<.04-Math.min(this.misses,3)*.004&&(Math.abs(d)<.9||a<.025))return this.huntPhase=`fix`,this.phaseT=0,this.path=[],{speed:0,turn:0};if(this.huntElapsed>90)return this.ignorePrey.set(n,this.t+10),this.prey=null,this.boredom=6,this.setMode(`idle`,`Lost interest`),{speed:0,turn:0};this.cruise=l>.2?.24:l>.09?.18:.1,this.huntReplanT=Math.max(0,this.huntReplanT-e);let c=!this.huntPrey||Math.hypot(this.huntPrey[0]-r.x,this.huntPrey[1]-r.z)>.03,f=this.pathI<this.path.length&&this.rig.maneuver===`climb`&&!this.rig.canRedirect;if((c||!this.path.length)&&this.huntReplanT<=0&&!f){this.huntReplanT=.2;let e=this.standPoint(n,r),i=e&&this.nav.path(t.x,t.z,e[0],e[1]);if(i)this.preyHiddenT=0,this.huntPrey=[r.x,r.z],this.huntGoal=e,this.path=i,this.pathI=1,this.goal=i[i.length-1],this.replans=0;else if(this.preyHiddenT+=.2,this.preyHiddenT>5)return this.ignorePrey.set(n,this.t+20),this.prey=null,this.path=[],this.faceHeading=null,this.setMode(`idle`,`Watching escaped prey`),{speed:0,turn:0}}if(!this.path.length)return{speed:0,turn:this.turnToward(u)};if(this.pathI>=this.path.length){if(Math.abs(o.x-.475)<.11&&o.z<.15&&this.surface.heightAt(o.x,o.z)<.12){this.status=`Watching the cave entrance`;let e=this.clearTurnError(Math.atan2(t.z-.225,.485-t.x));return a>.06&&(t.look=null,this.poseGoal.headPitch=.1),{speed:t.z>.225&&Math.abs(e)<.15?.025:0,turn:B_(e*3,-.8,.8)}}if(Math.abs(d)>.3)return{speed:0,turn:B_(d*5,-2.5,2.5)};if(this.preyVisible&&!n.airborne&&a<.04-Math.min(this.misses,3)*.004)return this.huntPhase=`fix`,this.phaseT=0,{speed:0,turn:0};let e=t.x+Math.cos(t.heading)*.02,r=t.z-Math.sin(t.heading)*.02,i=Math.abs(e-.475)<.14&&r<.26&&this.surface.heightAt(e,r)<.12,s=e<-.2&&r>.105&&r<.27&&this.surface.heightAt(e,r)>.12;return!i&&!s&&this.nav.walkable(e,r)&&this.pushedT<.3?{speed:n.airborne&&l<.06?0:.1,turn:B_(d*5,-2.5,2.5)}:(this.standTries++,this.huntPrey=null,this.path=[],{speed:0,turn:0})}let p=this.travel(e);return(this.rig.maneuver!==`climb`||a<.05)&&(this.lookPoint.copy(o),this.lookPoint.y+=.006,t.look=this.lookPoint),this.mode!==`hunt`&&(this.mode=`hunt`),p}case`fix`:{if(this.status=`Fixating`,this.posePreset(`walk`),this.poseGoal.headPitch=0,!this.preyVisible||o.distanceTo(this.rig.mouth)>.055||n.airborne)return this.huntPhase=`approach`,this.phaseT=0,{speed:0,turn:0};let e=Math.atan2(-(o.z-this.rig.mouth.z),o.x-this.rig.mouth.x),t=Math.atan2(-this.rig.headForward.z,this.rig.headForward.x),r=o.clone().sub(this.rig.mouth),i=r.length()<.015||Math.abs(H_(e-t))<.25&&r.angleTo(this.rig.headForward)<.55;if(this.phaseT>2&&(!i||!this.rig.canPickUpPrey))return this.huntPhase=`approach`,this.phaseT=0,this.huntPrey=null,this.standTries++,this.retreatSide=0,this.retreatSign=-1,this.retreatLeft=.025,this.retreatT=2,{speed:-.025,turn:0};if(this.phaseT>.18&&i&&this.rig.canPickUpPrey){this.huntPhase=`strike`,this.phaseT=0;let e=o.distanceTo(this.rig.mouth);this.tongueStrike=e<.045,this.strikeScale=B_(e/.055,.25,1),this.onTongue=!1,z_()<.25&&n.startle(this.rig.snout)}return{speed:0,turn:i?0:Math.abs(d)>.3?B_(d*6,-2,2):!i&&this.phaseT>.6?B_(H_(e-t)*2,-.7,.7):0}}case`strike`:{this.status=`Strike!`;let e=this.phaseT;return this.tongueStrike?(t.lunge=e<.2?U_(e/.2)*.35:Math.max(0,.35*(1-(e-.24)/.16)),t.jaw=e<.34?.42:t.jaw,t.tongueReach=.6*(e<.24?U_(e/.24):1-U_((e-.27)/.07)),e>.08&&e<.32&&(this.captureWith=`tongue`),e>.34&&(this.onTongue=!1),e>.4&&(t.tongueReach=0,this.phaseT=0,n.caught?(this.huntPhase=`grip`,this.preySide=Math.random()<.5?-1:1,n.consumed=0):(this.misses++,this.huntPhase=`approach`,this.path=[],this.huntPrey=null,this.status=`Missed`),this.misses>5&&(this.ignorePrey.set(n,this.t+20),this.prey=null,this.misses=0,this.boredom=8,this.setMode(`idle`,`Missed`))),{speed:0,turn:0}):(t.lunge=this.strikeScale*(e<.09?e/.09:Math.max(0,1-(e-.09)/.25)),t.jaw=e<.12?.85:t.jaw,t.tongue=e<.14?.7:t.tongue,e>.06&&e<.2&&(this.captureWith=`mouth`),e>.3&&(this.phaseT=0,n.caught?(this.huntPhase=`grip`,this.preySide=Math.random()<.5?-1:1,n.consumed=0):(this.misses++,this.huntPhase=`approach`,this.path=[],this.huntPrey=null),this.misses>5&&(this.ignorePrey.set(n,this.t+20),this.prey=null,this.misses=0,this.boredom=8,this.setMode(`idle`,`Missed`))),{speed:e<.1?.32*this.strikeScale:0,turn:0})}case`grip`:return this.status=`Caught it!`,t.look=null,t.jaw=.12,t.shake=+(this.phaseT<.55),n.struggle=1,this.phaseT>.4&&this.phaseT-e<=.4&&this.onCrunch?.(this.rig.mouth,.7),this.phaseT>.75&&(this.huntPhase=`chew`,this.phaseT=0,this.bites=0,this.biteT=0),{speed:0,turn:0};case`chew`:{this.status=`Eating`,t.look=null,this.poseGoal.headPitch=.18,this.biteT+=e;let r=.42+.08*Math.sin(this.bites*1.7),i=this.biteT/r;return t.jaw=i<.45?.12+.3*Math.sin(i/.45*Math.PI*.5):.42*Math.max(0,1-(i-.45)/.12)+.08,t.lunge=Math.max(t.lunge,i>.4&&i<.6?.18:0),n.struggle=Math.max(.05,1-this.bites*.22),i>=1&&(this.biteT=0,this.bites++,n.consumed=Math.min(.85,n.consumed+.16),this.onCrunch?.(this.rig.mouth,1-this.bites*.1),this.bites===2&&(t.shake=.6)),this.bites>=5&&(this.huntPhase=`swallow`,this.phaseT=0),{speed:0,turn:0}}case`swallow`:return this.status=`Swallowing`,t.look=null,t.jaw=this.phaseT<.25?.16:.02,t.swallow=Math.sin(Math.min(1,this.phaseT/.9)*Math.PI),this.poseGoal.lid=.35,n.consumed=Math.min(1,n.consumed+e*.9),n.struggle=0,this.phaseT>.35&&(n.group.visible=!1),this.phaseT>1&&(n.eaten=!0,this.needs.eat(.14),this.misses=0,this.huntPhase=`lick`,this.phaseT=0,this.poseGoal.lid=1),{speed:0,turn:0};case`lick`:{this.status=`Licking its lips`;let e=this.phaseT*3;return t.tongue=e<2&&e%1<.4?Math.sin(e%1/.4*Math.PI)*.6:0,this.phaseT>1.4&&(this.prey=null,this.setMode(`idle`,`Content`)),{speed:0,turn:0}}}return{speed:0,turn:0}}},G_=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},K_=new dc(-1,1,1,-1,0,1),q_=new class extends Pr{constructor(){super(),this.setAttribute(`position`,new J([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new J([0,2,0,0,2,0],2))}},J_=class{constructor(e){this._mesh=new Y(q_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,K_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Y_={name:`GTAOShader`,defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:`x`,SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new W},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new K},cameraProjectionMatrixInverse:{value:new K},cameraWorldMatrix:{value:new K},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new G(-1,-1,-1)},sceneBoxMax:{value:new G(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},X_={name:`GTAODepthShader`,defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Z_={name:`GTAOBlendShader`,uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function Q_(e=5){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=$_(t),r=n.length,a=new Uint8Array(r*4);for(let e=0;e<r;++e){let t=n[e],i=2*Math.PI*t/r,o=new G(Math.cos(i),Math.sin(i),0).normalize();a[e*4]=(o.x*.5+.5)*255,a[e*4+1]=(o.y*.5+.5)*255,a[e*4+2]=127,a[e*4+3]=255}let o=new yi(a,t,t);return o.wrapS=i,o.wrapT=i,o.needsUpdate=!0,o}function $_(e){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=t*t,r=Array(n).fill(0),i=Math.floor(t/2),a=t-1;for(let e=1;e<=n;)i===-1&&a===t?(a=t-2,i=0):(a===t&&(a=0),i<0&&(i=t-1)),r[i*t+a]===0?(r[i*t+a]=e++,a++,i--):(a-=2,i++);return r}var ev={name:`PoissonDenoiseShader`,defines:{SAMPLES:16,SAMPLE_VECTORS:tv(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new W},cameraProjectionMatrixInverse:{value:new K},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function tv(e,t,n){let r=nv(e,t,n),i=`vec3[SAMPLES](`;for(let t=0;t<e;t++){let n=r[t];i+=`vec3(${n.x}, ${n.y}, ${n.z})${t<e-1?`,`:`)`}`}return i}function nv(e,t,n){let r=[];for(let i=0;i<e;i++){let a=2*Math.PI*t*i/e,o=(i/(e-1))**n;r.push(new G(Math.cos(a),Math.sin(a),o))}return r}var rv={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`},iv=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,r,i,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,s=Math.floor(e+o),c=Math.floor(t+o),l=(3-Math.sqrt(3))/6,u=(s+c)*l,d=s-u,f=c-u,p=e-d,m=t-f,h,g;p>m?(h=1,g=0):(h=0,g=1);let _=p-h+l,v=m-g+l,y=p-1+2*l,b=m-1+2*l,x=s&255,S=c&255,C=this.perm[x+this.perm[S]]%12,w=this.perm[x+h+this.perm[S+g]]%12,T=this.perm[x+1+this.perm[S+1]]%12,E=.5-p*p-m*m;E<0?n=0:(E*=E,n=E*E*this._dot(this.grad3[C],p,m));let D=.5-_*_-v*v;D<0?r=0:(D*=D,r=D*D*this._dot(this.grad3[w],_,v));let O=.5-y*y-b*b;return O<0?i=0:(O*=O,i=O*O*this._dot(this.grad3[T],y,b)),70*(n+r+i)}noise3d(e,t,n){let r,i,a,o,s=(e+t+n)*(1/3),c=Math.floor(e+s),l=Math.floor(t+s),u=Math.floor(n+s),d=1/6,f=(c+l+u)*d,p=c-f,m=l-f,h=u-f,g=e-p,_=t-m,v=n-h,y,b,x,S,C,w;g>=_?_>=v?(y=1,b=0,x=0,S=1,C=1,w=0):g>=v?(y=1,b=0,x=0,S=1,C=0,w=1):(y=0,b=0,x=1,S=1,C=0,w=1):_<v?(y=0,b=0,x=1,S=0,C=1,w=1):g<v?(y=0,b=1,x=0,S=0,C=1,w=1):(y=0,b=1,x=0,S=1,C=1,w=0);let T=g-y+d,E=_-b+d,D=v-x+d,O=g-S+2*d,k=_-C+2*d,A=v-w+2*d,j=g-1+3*d,ee=_-1+3*d,M=v-1+3*d,N=c&255,te=l&255,P=u&255,ne=this.perm[N+this.perm[te+this.perm[P]]]%12,F=this.perm[N+y+this.perm[te+b+this.perm[P+x]]]%12,re=this.perm[N+S+this.perm[te+C+this.perm[P+w]]]%12,ie=this.perm[N+1+this.perm[te+1+this.perm[P+1]]]%12,ae=.6-g*g-_*_-v*v;ae<0?r=0:(ae*=ae,r=ae*ae*this._dot3(this.grad3[ne],g,_,v));let oe=.6-T*T-E*E-D*D;oe<0?i=0:(oe*=oe,i=oe*oe*this._dot3(this.grad3[F],T,E,D));let se=.6-O*O-k*k-A*A;se<0?a=0:(se*=se,a=se*se*this._dot3(this.grad3[re],O,k,A));let I=.6-j*j-ee*ee-M*M;return I<0?o=0:(I*=I,o=I*I*this._dot3(this.grad3[ie],j,ee,M)),32*(r+i+a+o)}noise4d(e,t,n,r){let i=this.grad4,a=this.simplex,o=this.perm,s=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,l,u,d,f,p,m=(e+t+n+r)*s,h=Math.floor(e+m),g=Math.floor(t+m),_=Math.floor(n+m),v=Math.floor(r+m),y=(h+g+_+v)*c,b=h-y,x=g-y,S=_-y,C=v-y,w=e-b,T=t-x,E=n-S,D=r-C,O=w>T?32:0,k=w>E?16:0,A=T>E?8:0,j=w>D?4:0,ee=T>D?2:0,M=+(E>D),N=O+k+A+j+ee+M,te=+(a[N][0]>=3),P=+(a[N][1]>=3),ne=+(a[N][2]>=3),F=+(a[N][3]>=3),re=+(a[N][0]>=2),ie=+(a[N][1]>=2),ae=+(a[N][2]>=2),oe=+(a[N][3]>=2),se=+(a[N][0]>=1),I=+(a[N][1]>=1),ce=+(a[N][2]>=1),le=+(a[N][3]>=1),ue=w-te+c,de=T-P+c,fe=E-ne+c,pe=D-F+c,me=w-re+2*c,he=T-ie+2*c,ge=E-ae+2*c,_e=D-oe+2*c,ve=w-se+3*c,ye=T-I+3*c,be=E-ce+3*c,xe=D-le+3*c,Se=w-1+4*c,Ce=T-1+4*c,we=E-1+4*c,Te=D-1+4*c,Ee=h&255,De=g&255,Oe=_&255,ke=v&255,Ae=o[Ee+o[De+o[Oe+o[ke]]]]%32,je=o[Ee+te+o[De+P+o[Oe+ne+o[ke+F]]]]%32,L=o[Ee+re+o[De+ie+o[Oe+ae+o[ke+oe]]]]%32,Me=o[Ee+se+o[De+I+o[Oe+ce+o[ke+le]]]]%32,Ne=o[Ee+1+o[De+1+o[Oe+1+o[ke+1]]]]%32,Pe=.6-w*w-T*T-E*E-D*D;Pe<0?l=0:(Pe*=Pe,l=Pe*Pe*this._dot4(i[Ae],w,T,E,D));let R=.6-ue*ue-de*de-fe*fe-pe*pe;R<0?u=0:(R*=R,u=R*R*this._dot4(i[je],ue,de,fe,pe));let Fe=.6-me*me-he*he-ge*ge-_e*_e;Fe<0?d=0:(Fe*=Fe,d=Fe*Fe*this._dot4(i[L],me,he,ge,_e));let z=.6-ve*ve-ye*ye-be*be-xe*xe;z<0?f=0:(z*=z,f=z*z*this._dot4(i[Me],ve,ye,be,xe));let Ie=.6-Se*Se-Ce*Ce-we*we-Te*Te;return Ie<0?p=0:(Ie*=Ie,p=Ie*Ie*this._dot4(i[Ne],Se,Ce,we,Te)),27*(l+u+d+f+p)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,r){return e[0]*t+e[1]*n+e[2]*r}_dot4(e,t,n,r,i){return e[0]*t+e[1]*n+e[2]*r+e[3]*i}},av=class e extends G_{constructor(e,t,n=512,r=512,i,a,o){super(),this.width=n,this.height=r,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=Q_(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new Zt(this.width,this.height,{type:b}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new vs({defines:Object.assign({},Y_.defines),uniforms:hs.clone(Y_.uniforms),vertexShader:Y_.vertexShader,fragmentShader:Y_.fragmentShader,blending:0,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=+!!this.camera.isPerspectiveCamera,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new Ss,this.normalMaterial.blending=0,this.pdMaterial=new vs({defines:Object.assign({},ev.defines),uniforms:hs.clone(ev.uniforms),vertexShader:ev.vertexShader,fragmentShader:ev.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new vs({defines:Object.assign({},X_.defines),uniforms:hs.clone(X_.uniforms),vertexShader:X_.vertexShader,fragmentShader:X_.fragmentShader,blending:0}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new vs({uniforms:hs.clone(rv.uniforms),vertexShader:rv.vertexShader,fragmentShader:rv.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this.blendMaterial=new vs({uniforms:hs.clone(Z_.uniforms),vertexShader:Z_.vertexShader,fragmentShader:Z_.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:5,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this._fsQuad=new J_(null),this._originalClearColor=new q,this.setGBuffer(i?i.depthTexture:void 0,i?i.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e===void 0?(this.depthTexture=new Aa,this.depthTexture.format=A,this.depthTexture.type=C,this.normalRenderTarget=new Zt(this.width,this.height,{minFilter:s,magFilter:s,type:b,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0):(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1);let n=+!!this.normalTexture,r=this.depthTexture===this.normalTexture?`w`:`x`;this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=r,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=r,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&+!!e.screenSpaceRadius!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=+!!e.screenSpaceRadius,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=tv(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,n,r){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case e.OUTPUT.Off:break;case e.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:n);break;default:console.warn(`THREE.GTAOPass: Unknown output type.`)}}_renderPass(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r=t.clearColor||r,i=t.clearAlpha||i,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(e){(e.isPoints||e.isLine||e.isLine2)&&e.visible&&(e.visible=!1,t.push(e))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new iv,n=e*e*4,r=new Uint8Array(n);for(let n=0;n<e;n++)for(let i=0;i<e;i++){let a=n,o=i;r[(n*e+i)*4]=(t.noise(a,o)*.5+.5)*255,r[(n*e+i)*4+1]=(t.noise(a+e,o)*.5+.5)*255,r[(n*e+i)*4+2]=(t.noise(a,o+e)*.5+.5)*255,r[(n*e+i)*4+3]=(t.noise(a+e,o+e)*.5+.5)*255}let a=new yi(r,e,e,O,p);return a.wrapS=i,a.wrapT=i,a.needsUpdate=!0,a}};av.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var ov={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new q(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`},sv=class e extends G_{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new W(256,256):new W(e.x,e.y),this.clearColor=new q(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Zt(i,a,{type:b}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new Zt(i,a,{type:b});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new Zt(i,a,{type:b});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=ov;this.highPassUniforms=hs.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new vs({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new W(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new G(1,1,1),new G(1,1,1),new G(1,1,1),new G(1,1,1),new G(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=hs.clone(rv.uniforms),this.blendMaterial=new vs({uniforms:this.copyUniforms,vertexShader:rv.vertexShader,fragmentShader:rv.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new q,this._oldClearAlpha=1,this._basic=new Jr,this._fsQuad=new J_(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new W(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new vs({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new W(.5,.5)},direction:{value:new W(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new vs({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};sv.BlurDirectionX=new W(1,0),sv.BlurDirectionY=new W(0,1);var cv={uniforms:{tColor:{value:null},tDepth:{value:null},tCloud:{value:null},tFocus:{value:null},uUseCloud:{value:0},uPixel:{value:new W},uNear:{value:.01},uFar:{value:20},uFocus:{value:1.5},uAperture:{value:1},uMaxBlur:{value:10}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,fragmentShader:`
precision highp float;
uniform sampler2D tColor; uniform sampler2D tDepth; uniform sampler2D tCloud; uniform sampler2D tFocus; uniform vec2 uPixel;
uniform float uNear, uFar, uFocus, uAperture, uMaxBlur, uUseCloud;
float focusD, apertureK;
varying vec2 vUv;
float linDepth(vec2 uv){
  float z = texture2D(tDepth, uv).x * 2.0 - 1.0;
  float d = 2.0 * uNear * uFar / (uFar + uNear - z * (uFar - uNear));
  // where a cloud covers the scene, the depth that matters is the cloud's
  // (they draw no depth of their own: without this they would be blurred by
  // the leaves and walls behind them, printing those edges into the cloud)
  if (uUseCloud > 0.5) {
    vec4 c = texture2D(tCloud, uv);
    if (c.a > 0.02) d = mix(d, min(d, c.r / c.a), smoothstep(0.08, 0.5, c.a));
  }
  return d;
}
float coc(float d){ return clamp((1.0 / focusD - 1.0 / d) * apertureK, -1.0, 1.0) * uMaxBlur; }
const float GOLDEN = 2.39996323;
void main(){
  // (uFocus < 0: autofocus; a macro lens close up still keeps its subject sharp,
  // so the aperture narrows as the focus comes in)
  focusD = uFocus > 0.0 ? uFocus : max(texture2D(tFocus, vec2(0.5)).r, 0.02);
  apertureK = uAperture * min(1.0, pow(focusD / 0.6, 1.2));
  float cd = linDepth(vUv);
  float cs = abs(coc(cd));
  vec3 col = texture2D(tColor, vUv).rgb;
  float tot = 1.0;
  float rad = 0.9;
  float ang = 0.0;
  for (int i = 0; i < 64; i++) {
    if (rad >= uMaxBlur) break;
    vec2 tc = vUv + vec2(cos(ang), sin(ang)) * uPixel * rad;
    vec3 sc = texture2D(tColor, tc).rgb;
    float sd = linDepth(tc);
    float ss = abs(coc(sd));
    if (sd > cd) ss = clamp(ss, 0.0, cs * 2.0);
    float m = smoothstep(rad - 0.5, rad + 0.5, ss);
    col += mix(col / tot, sc, m);
    tot += 1.0;
    rad += 1.15 / rad;
    ang += GOLDEN;
  }
  gl_FragColor = vec4(col / tot, 1.0);
}`},lv={uniforms:{tDepth:{value:null},tPrev:{value:null},tCloud:{value:null},uUseCloud:{value:0},uSubject:{value:0},uSubjectUv:{value:new W(.5,.5)},uNear:{value:.01},uFar:{value:20},uRate:{value:1},uAspect:{value:1}},vertexShader:`void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`,fragmentShader:`
precision highp float;
uniform sampler2D tDepth; uniform sampler2D tPrev; uniform sampler2D tCloud; uniform float uNear, uFar, uRate, uAspect, uUseCloud, uSubject; uniform vec2 uSubjectUv;
float linDepth(vec2 uv){
  float z = texture2D(tDepth, uv).x * 2.0 - 1.0;
  float d = 2.0 * uNear * uFar / (uFar + uNear - z * (uFar - uNear));
  // (a cloud in front counts, as it does for the blur)
  if (uUseCloud > 0.5) {
    vec4 c = texture2D(tCloud, uv);
    if (c.a > 0.02) d = mix(d, min(d, c.r / c.a), smoothstep(0.08, 0.5, c.a));
  }
  return d;
}
void main(){
  float d[9];
  for (int j = 0; j < 3; j++) for (int i = 0; i < 3; i++) {
    vec2 o = vec2(float(i - 1), float(j - 1)) * vec2(0.05 / uAspect, 0.05);
    d[j * 3 + i] = linDepth(vec2(0.5) + o);
  }
  // median of nine (a partial insertion sort)
  for (int i = 1; i < 9; i++) for (int k = 8; k > 0; k--) if (k <= i && d[k] < d[k - 1]) { float t = d[k]; d[k] = d[k - 1]; d[k - 1] = t; }
  // (a subject in view, the lizard, takes the focus; otherwise the middle of the picture)
  // (only if it can be seen: hidden behind the rock or a plant, the picture's middle wins)
  bool seen = uSubject > 0.0 && linDepth(uSubjectUv) > uSubject * 0.9 - 0.01;
  float target = clamp(seen ? uSubject : d[4], uNear * 4.0, 6.0);
  // eased in diopters (1/m), as a lens racks focus
  float prev = texture2D(tPrev, vec2(0.5)).r;
  float f = prev > 0.0 ? 1.0 / mix(1.0 / prev, 1.0 / target, uRate) : target;
  gl_FragColor = vec4(f, 0.0, 0.0, 1.0);
}`},uv={uniforms:{tColor:{value:null},uExposure:{value:1},uTime:{value:0},uPixel:{value:new W},uGrain:{value:.035},uVignette:{value:.32},uCA:{value:.9},uSat:{value:1.22},uContrast:{value:.22},uWarm:{value:1}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,fragmentShader:`
precision highp float;
uniform sampler2D tColor; uniform float uExposure, uTime, uGrain, uVignette, uCA, uSat, uContrast, uWarm; uniform vec2 uPixel;
varying vec2 vUv;
vec3 aces(vec3 x){
  // Stephen Hill's fitted ACES (RRT+ODT)
  const mat3 i = mat3(0.59719, 0.07600, 0.02840, 0.35458, 0.90834, 0.13383, 0.04823, 0.01566, 0.83777);
  const mat3 o = mat3(1.60475, -0.10208, -0.00327, -0.53108, 1.10813, -0.07276, -0.07367, -0.00605, 1.07602);
  x = i * x;
  vec3 a = x * (x + 0.0245786) - 0.000090537;
  vec3 b = x * (0.983729 * x + 0.4329510) + 0.238081;
  return clamp(o * (a / b), 0.0, 1.0);
}
vec3 toSRGB(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime * 0.1) * 43758.5453); }
void main(){
  vec2 c = vUv - 0.5;
  float r2 = dot(c, c);
  vec2 off = c * r2 * uCA * 4.0 * uPixel;
  vec3 col;
  col.r = texture2D(tColor, vUv - off).r;
  col.g = texture2D(tColor, vUv).g;
  col.b = texture2D(tColor, vUv + off).b;
  col *= uExposure;
  col = aces(col);
  col *= 1.0 - uVignette * smoothstep(0.08, 0.62, r2 * 1.6);
  col = toSRGB(col);
  // grade (display space): saturation, a soft S-curve, golden highlights over umber shadows
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = max(mix(vec3(luma), col, uSat), 0.0);
  col = mix(col, col * col * (3.0 - 2.0 * col), uContrast);
  col += uWarm * (vec3(0.018, 0.006, -0.014) * smoothstep(0.35, 0.9, luma) + vec3(0.006, 0.002, -0.004) * (1.0 - smoothstep(0.0, 0.3, luma)));
  col = clamp(col, 0.0, 1.0);
  float g = hash(gl_FragCoord.xy + fract(uTime) * 917.0) - 0.5;
  col += g * uGrain * (0.6 + 0.4 * (1.0 - dot(col, vec3(0.33))));
  gl_FragColor = vec4(col, 1.0);
}`},dv={uniforms:{tDepth:{value:null},uInvProj:{value:new K}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,fragmentShader:`precision highp float; uniform sampler2D tDepth; uniform mat4 uInvProj; varying vec2 vUv;
void main(){ float z = texture2D(tDepth, vUv).x; vec4 v = uInvProj * vec4(vUv * 2.0 - 1.0, z * 2.0 - 1.0, 1.0); v /= v.w; gl_FragColor = vec4(z >= 1.0 ? 1e4 : length(v.xyz), 0.0, 0.0, 1.0); }`},fv=`
bool finiteOk(vec3 c){ return !(any(isnan(c)) || any(isinf(c)) || !(c.r + c.g + c.b < 1e20) || !(c.r + c.g + c.b > -1e20)); }
// a bad pixel takes the average of the good ones around it (a speck vanishes; black only if all are bad)
vec3 cleanColor(sampler2D tex, vec2 uv, vec2 px){
  vec3 c = texture2D(tex, uv).rgb;
  if (finiteOk(c)) return clamp(c, vec3(0.0), vec3(256.0));
  vec3 s = vec3(0.0); float n = 0.0;
  for (int k = 0; k < 12; k++) {
    float a = float(k) * 0.5236, r = k < 6 ? 2.0 : 5.0;
    vec3 q = texture2D(tex, uv + vec2(cos(a), sin(a)) * r * px).rgb;
    if (finiteOk(q)) {s += clamp(q, vec3(0.0), vec3(256.0)); n += 1.0;}
  }
  return n > 0.0 ? s / n : vec3(0.0);
}`,pv={uniforms:{tAO:{value:null}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,fragmentShader:`precision highp float; uniform sampler2D tAO; varying vec2 vUv;
void main(){
  float ao = texture2D(tAO, vUv).r;
  ao = (ao >= 0.0 && ao <= 1.0) ? ao : 1.0;
  gl_FragColor = vec4(vec3(ao), 1.0);
}`},mv={uniforms:{tColor:{value:null},uPixel:{value:new W(1,1)}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,fragmentShader:`precision highp float; uniform sampler2D tColor; uniform vec2 uPixel; varying vec2 vUv;
${fv}
void main(){ gl_FragColor = vec4(cleanColor(tColor, vUv, uPixel), 1.0); }`},hv=class{renderer;scene;camera;sceneRT;refractRT;distRT;distQuad=new J_(new vs(dv));cloudRT;aRT;bRT;gtao;bloom;dofQuad=new J_(new vs(cv));focusQuad=new J_(new vs(lv));focusRT=[0,1].map(()=>new Zt(1,1,{type:b,depthBuffer:!1,minFilter:s,magFilter:s}));focusI=0;lastTime=-1;subject=0;subjectUv=new W(.5,.5);lastCam={pos:new G,quat:new At};finalQuad=new J_(new vs(uv));aoMulQuad=new J_(new vs({...pv,depthTest:!1,depthWrite:!1,transparent:!0,blending:5,blendSrc:200,blendDst:202,blendSrcAlpha:200,blendDstAlpha:201}));cleanQuad=new J_(new vs(mv));settings={ao:!0,bloom:!0,dof:!0,bloomStrength:.22,exposure:1.16,focus:0,aperture:.6,maxBlur:9};width=1;height=1;constructor(e,t,n,r=4){this.renderer=e,this.scene=t,this.camera=n;let i=new Aa(1,1);i.type=v;let a=new URLSearchParams(location.search).get(`msaa`);this.sceneRT=new Zt(1,1,{type:b,samples:a===null?r:Number(a),depthTexture:i}),this.refractRT=new Zt(1,1,{type:b,generateMipmaps:!0,minFilter:f}),this.distRT=new Zt(1,1,{type:b,depthBuffer:!1,minFilter:s,magFilter:s}),this.cloudRT=new Zt(1,1,{type:b,depthBuffer:!1}),this.aRT=new Zt(1,1,{type:b}),this.bRT=new Zt(1,1,{type:b}),this.gtao=new av(t,n,2,2),this.gtao.setGBuffer(i),this.gtao.output=av.OUTPUT.Off,this.gtao.updateGtaoMaterial({radius:.06,distanceExponent:1.4,thickness:.6,scale:1.1,samples:12,distanceFallOff:1}),this.gtao.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:6,rings:2,samples:12}),this.bloom=new sv(new W(256,256),.22,.5,1.4)}get samples(){return this.sceneRT.samples}setSamples(e){this.sceneRT.samples=e,this.sceneRT.dispose()}setSize(e,t,n){let r=Math.max(1,Math.round(e*n)),i=Math.max(1,Math.round(t*n));this.width=r,this.height=i,this.sceneRT.setSize(r,i),this.refractRT.setSize(r,i),this.distRT.setSize(r,i),this.cloudRT.setSize(Math.ceil(r/2),Math.ceil(i/2)),this.aRT.setSize(r,i),this.bRT.setSize(r,i),this.gtao.setSize(Math.ceil(r/2),Math.ceil(i/2)),this.bloom.setSize(r,i);let a=new W(1/r,1/i);this.dofQuad.material.uniforms.uPixel.value.copy(a),this.finalQuad.material.uniforms.uPixel.value.copy(a),this.cleanQuad.material.uniforms.uPixel.value.copy(a)}copyRefraction(){let e=this.renderer;this.cleanQuad.material.uniforms.tColor.value=this.sceneRT.texture,e.setRenderTarget(this.refractRT),this.cleanQuad.render(e),e.setRenderTarget(this.sceneRT)}render(e,t,n){let r=this.renderer,i=this.settings;if(r.setRenderTarget(this.sceneRT),r.clear(),r.render(this.scene,this.camera),i.ao&&(this.gtao.render(r,null,this.sceneRT,0,!1),this.aoMulQuad.material.uniforms.tAO.value=this.gtao.gtaoMap,r.setRenderTarget(this.sceneRT),this.aoMulQuad.render(r)),t){this.cleanQuad.material.uniforms.tColor.value=this.sceneRT.texture,r.setRenderTarget(this.refractRT),this.cleanQuad.render(r);let e=this.distQuad.material;e.uniforms.tDepth.value=this.sceneRT.depthTexture,e.uniforms.uInvProj.value.copy(this.camera.projectionMatrixInverse),r.setRenderTarget(this.distRT),this.distQuad.render(r),r.setRenderTarget(this.sceneRT),t(this.refractRT.texture,this.distRT.texture)}this.cleanQuad.material.uniforms.tColor.value=this.sceneRT.texture,r.setRenderTarget(this.aRT),this.cleanQuad.render(r);let a=this.aRT;if(i.bloom&&(this.bloom.strength=i.bloomStrength,this.bloom.render(r,null,a,0,!1)),i.dof){let o=this.dofQuad.material;if(t&&n){let e=r.getClearColor(new q),t=r.getClearAlpha();r.setRenderTarget(this.cloudRT),r.setClearColor(0,0),r.clear(!0,!1,!1),n(this.cloudRT),r.setClearColor(e,t)}if(o.uniforms.tCloud.value=this.cloudRT.texture,o.uniforms.uUseCloud.value=t&&n?1:0,o.uniforms.tColor.value=a.texture,o.uniforms.tDepth.value=this.sceneRT.depthTexture,o.uniforms.uNear.value=this.camera.near,o.uniforms.uFar.value=this.camera.far,i.focus<=0){let t=this.focusQuad.material,n=this.lastTime<0?1:Math.min(.25,Math.max(0,e-this.lastTime));t.uniforms.tDepth.value=this.sceneRT.depthTexture,t.uniforms.tPrev.value=this.focusRT[this.focusI].texture,t.uniforms.uNear.value=this.camera.near,t.uniforms.uFar.value=this.camera.far,t.uniforms.uAspect.value=this.width/this.height,t.uniforms.tCloud.value=this.cloudRT.texture,t.uniforms.uUseCloud.value=o.uniforms.uUseCloud.value;let i=this.camera.position.distanceTo(this.lastCam.pos)>.05||this.camera.quaternion.angleTo(this.lastCam.quat)>.3;this.lastCam.pos.copy(this.camera.position),this.lastCam.quat.copy(this.camera.quaternion),t.uniforms.uSubject.value=this.subject,t.uniforms.uSubjectUv.value.copy(this.subjectUv),t.uniforms.uRate.value=this.lastTime<0||i?1:1-Math.exp(-n*14),this.focusI=1-this.focusI,r.setRenderTarget(this.focusRT[this.focusI]),this.focusQuad.render(r),o.uniforms.tFocus.value=this.focusRT[this.focusI].texture}this.lastTime=e,o.uniforms.uFocus.value=i.focus>0?i.focus:-1,o.uniforms.uAperture.value=i.aperture,o.uniforms.uMaxBlur.value=i.maxBlur*(this.height/1080)*1.4;let s=a===this.bRT?this.aRT:this.bRT;r.setRenderTarget(s),this.dofQuad.render(r),a=s}let o=this.finalQuad.material;o.uniforms.tColor.value=a.texture,o.uniforms.uExposure.value=i.exposure,o.uniforms.uTime.value=e,r.setRenderTarget(null),this.finalQuad.render(r)}},gv=class{rate;remainder=0;step=1/60;constructor(e=1){this.rate=e}get alpha(){return Math.min(1,this.remainder/this.step)}advance(e,t,n=()=>!0){if(!Number.isFinite(e)||e<=0)return;this.remainder+=(e>.25?.05:e)*this.rate;let r=0;for(;this.remainder+1e-10>=this.step&&r<Math.ceil(6*this.rate)&&(r===0||n());)t(this.step),this.remainder-=this.step,r++;this.remainder=Math.max(0,this.remainder)}},_v=()=>({position:new G,rotation:new At,scale:new G}),vv=class{frames;position=new G;rotation=new At;scale=new G;ready=!1;constructor(e){this.frames=e.map(e=>({node:e,matrix:new K,previous:_v(),current:_v()}))}capture(){for(let e of this.frames)e.node.matrixAutoUpdate&&e.node.updateMatrix(),e.previous.position.copy(e.current.position),e.previous.rotation.copy(e.current.rotation),e.previous.scale.copy(e.current.scale),e.matrix.copy(e.node.matrix).decompose(e.current.position,e.current.rotation,e.current.scale),this.ready||(e.previous.position.copy(e.current.position),e.previous.rotation.copy(e.current.rotation),e.previous.scale.copy(e.current.scale));this.ready=!0}render(e,t,n=()=>{}){if(!this.ready){t();return}let r=U.clamp(e,0,1);try{for(let e of this.frames)this.position.lerpVectors(e.previous.position,e.current.position,r),this.rotation.slerpQuaternions(e.previous.rotation,e.current.rotation,r),this.scale.lerpVectors(e.previous.scale,e.current.scale,r),e.node.matrix.compose(this.position,this.rotation,this.scale),e.node.matrixAutoUpdate&&(e.node.position.copy(this.position),e.node.quaternion.copy(this.rotation),e.node.scale.copy(this.scale)),e.node.matrixWorldNeedsUpdate=!0;n(),t()}finally{for(let e of this.frames)e.node.matrix.copy(e.matrix),e.node.matrixAutoUpdate&&(e.node.position.copy(e.current.position),e.node.quaternion.copy(e.current.rotation),e.node.scale.copy(e.current.scale)),e.node.matrixWorldNeedsUpdate=!0;n()}}},yv=class{output=document.createElement(`output`);frames=[];costs=[];start=0;firstSimulation=0;previous=0;next=0;timerTicks=0;simulationCosts=[];renderCosts=[];constructor(){this.output.id=`playback-profile`,this.output.hidden=!0,document.body.append(this.output),setInterval(()=>this.timerTicks++,16)}record(e,t,n,r=0,i=0,a=`Full`){if(this.start||(this.start=e,this.firstSimulation=t),this.previous&&e-this.previous<2e3&&(this.frames.push(e-this.previous),this.costs.push(n)),this.previous=e,this.simulationCosts.push(r),this.renderCosts.push(i),this.simulationCosts.length>600&&(this.simulationCosts.shift(),this.renderCosts.shift()),e<this.next)return;this.next=e+1e3;let o=[...this.frames].sort((e,t)=>e-t),s=this.frames.reduce((e,t)=>e+t,0);this.output.textContent=JSON.stringify({seconds:(e-this.start)/1e3,frames:o.length,fps:o.length*1e3/s,p95:o[Math.floor(o.length*.95)],worst:o.at(-1),over50:o.filter(e=>e>50).length,over100:o.filter(e=>e>100).length,simulationRate:(t-this.firstSimulation)/((e-this.start)/1e3),cpuMean:this.costs.reduce((e,t)=>e+t,0)/this.costs.length,cpuWorst:Math.max(0,...this.costs),simulationP95:[...this.simulationCosts].sort((e,t)=>e-t)[Math.floor(this.simulationCosts.length*.95)],renderP95:[...this.renderCosts].sort((e,t)=>e-t)[Math.floor(this.renderCosts.length*.95)],recentFps:Math.min(600,this.frames.length)*1e3/this.frames.slice(-600).reduce((e,t)=>e+t,0),timerRate:this.timerTicks/((e-this.start)/1e3),lastFrame:this.frames.at(-1),visible:!document.hidden,width:innerWidth,height:innerHeight,dpr:devicePixelRatio,quality:a}),this.frames.length>18e3&&(this.frames.splice(0,9e3),this.costs.splice(0,9e3))}},bv={now:()=>performance.now(),visible:()=>!document.hidden,request:e=>requestAnimationFrame(e),cancel:e=>cancelAnimationFrame(e),delay:(e,t)=>window.setTimeout(e,t),clear:e=>clearTimeout(e)},xv=class{frame;host;raf=0;timer=0;running=!1;lastRaf=0;lastFrame=-1/0;fallback=!1;healthy=0;constructor(e,t=bv){this.frame=e,this.host=t}start(){this.stop(),this.running=!0,this.lastRaf=this.host.now(),this.lastFrame=-1/0,this.fallback=!1,this.healthy=0,this.raf=this.host.request(this.onRaf),this.timer=this.host.delay(this.onTimer,80)}stop(){this.running=!1,this.host.cancel(this.raf),this.host.clear(this.timer)}emit(e){this.host.visible()?e-this.lastFrame<8||(this.lastFrame=e,this.frame(e)):this.lastFrame=-1/0}onRaf=e=>{this.running&&(this.healthy=e-this.lastRaf<50?this.healthy+1:0,this.lastRaf=e,this.healthy>=8&&(this.fallback=!1),this.emit(e),this.running&&(this.raf=this.host.request(this.onRaf)))};onTimer=()=>{if(!this.running)return;let e=this.host.now();this.host.visible()&&(this.fallback||e-this.lastRaf>=80)&&(this.fallback=!0,this.emit(e)),this.running&&(this.timer=this.host.delay(this.onTimer,this.host.visible()?this.fallback?Math.max(4,1e3/60-(this.host.now()-e)):Math.max(4,80-(this.host.now()-this.lastRaf)):250))}},Sv=[{name:`Full`,ratio:1.75,samples:4,shadow:2048,ao:!0,bloom:!0},{name:`Balanced`,ratio:1.35,samples:2,shadow:1536,ao:!0,bloom:!0},{name:`Smooth`,ratio:1,samples:0,shadow:1024,ao:!1,bloom:!0},{name:`Light`,ratio:.8,samples:0,shadow:768,ao:!1,bloom:!1}],Cv=class{level=0;elapsed=0;frames=[];cpu=[];cooldown=6;good=0;bad=0;trial=null;ineffective=null;resetWindow(){this.elapsed=0,this.frames=[],this.cpu=[],this.good=0,this.bad=0}record(e,t,n=!0){if(!n||e<=0||e>.25)return this.resetWindow(),!1;if(this.cooldown=Math.max(0,this.cooldown-e),this.elapsed+=e,this.frames.push(e*1e3),this.cpu.push(t),this.elapsed<2)return!1;this.frames.sort((e,t)=>e-t),this.cpu.sort((e,t)=>e-t);let r=this.frames[Math.floor(this.frames.length*.5)],i=this.frames[Math.floor(this.frames.length*.9)],a=this.cpu[Math.floor(this.cpu.length*.5)],o=(r>24||i>38)&&a<r*.65;if(this.bad=o?this.bad+this.elapsed:0,this.good=r<18.5&&i<22?this.good+this.elapsed:0,this.elapsed=0,this.frames=[],this.cpu=[],this.cooldown>0)return!1;if(this.trial){if(!(r<this.trial.median*.94||i<this.trial.p90*.9))return this.ineffective={median:r,p90:i},this.level=this.trial.from,this.trial=null,this.cooldown=60,this.bad=0,this.good=0,!0;this.trial=null}return this.bad>=4&&this.level<Sv.length-1?this.ineffective&&r<=this.ineffective.median*1.15&&i<=this.ineffective.p90*1.15?(this.bad=0,!1):(this.trial={from:this.level,median:r,p90:i},this.level++,this.cooldown=10,this.bad=0,this.good=0,!0):this.good>=30&&this.level>0&&(this.level--,this.cooldown=30,this.bad=0,this.good=0,!0)}},wv=new URLSearchParams(location.search),Tv=e=>document.getElementById(e);wv.get(`ui`)===`0`&&document.body.classList.add(`no-ui`);var Ev=class{scene=new In;camera=new oc(33,1,.004,30);renderer;controls;habitat=new Hg;post;ready;surface;nav;lizard;rig;brain;insects;dish;hours=Number(wv.get(`hours`)??11.5);time=0;follow=!1;dayRunning=!1;feeding=!1;frames=0;lastTime=0;nextReadout=0;toastTimer=0;home=new G;homeTarget=new G(0,.32,0);wasNight=!1;lap=0;simulationClock=new gv;poseInterpolation;playbackStats=wv.has(`profile`)?new yv:void 0;animation;quality=new Cv;fill=new pc(14933199,1.1);ambient=new Js(13360105,6508604,.95);plantContacts=[];plantJointA=new G;plantJointB=new G;plantJointC=new G;constructor(){let e=new lf({antialias:!1,powerPreference:`high-performance`,preserveDrawingBuffer:wv.has(`capture`)});e.setPixelRatio(Math.min(devicePixelRatio,wv.has(`lite`)?1:1.75)),e.outputColorSpace=Be,e.toneMapping=0,e.autoClear=!1,e.shadowMap.enabled=!0,e.shadowMap.type=1,e.setClearColor(3421747),this.renderer=e,Tv(`scene`).append(e.domElement),e.domElement.id=`scene-canvas`;let t=new hl(e);this.scene.environment=t.fromScene(new Nf,.02).texture,this.scene.environmentIntensity=.32,t.dispose(),this.scene.add(this.habitat.group,this.habitat.panes,this.ambient,this.fill),this.fill.position.set(-1,1.6,3);let n=new pc(12834791,.7);n.position.set(1,1,-2),this.scene.add(n),this.controls=new bf(this.camera,e.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.minDistance=.14,this.controls.maxDistance=4.5,this.controls.minPolarAngle=.65,this.controls.maxPolarAngle=1.66,this.controls.minAzimuthAngle=-1.3,this.controls.maxAzimuthAngle=1.3,this.controls.zoomSpeed=.75,this.controls.enablePan=!0,this.post=new hv(e,this.scene,this.camera,wv.has(`lite`)?0:4),this.post.settings.dof=!1,this.post.settings.bloomStrength=.1,this.post.settings.exposure=1.05,wv.has(`lite`)&&(this.post.settings.ao=!1),this.resize(!0),new ResizeObserver(()=>this.resize(!1)).observe(Tv(`scene`)),document.addEventListener(`visibilitychange`,()=>{this.lastTime=0,this.quality.resetWindow()}),e.domElement.addEventListener(`webglcontextlost`,e=>{e.preventDefault(),this.stopAnimation(),this.say(`The display is paused while graphics recover…`)}),e.domElement.addEventListener(`webglcontextrestored`,()=>{this.ready.then(async()=>{await e.compileAsync(this.scene,this.camera),this.lastTime=0,this.draw(),Number(wv.get(`frames`))||this.startAnimation(),this.say(`Display restored`)}).catch(e=>{console.error(e),this.fail(`The graphics processor could not restore the display. Reload to reopen the terrarium.`)})}),this.ready=this.load()}async load(){await this.habitat.ready,this.dish=new Qg({heightAt:Yf},-.58,Z.d/2-.088,this.habitat.stonePhoto),this.scene.add(this.dish.group),this.surface=new ng(this.habitat.ground,[...this.habitat.hard,{mesh:this.dish.bowl,kind:tg.Rock}],.004);for(let e of this.habitat.plants)e.constrainToHardscape((e,t)=>this.surface.tailContacts.overlapsSolid(e,t));this.nav=new Gg(this.surface,this.habitat.obstacles),this.insects=new a_(this.surface,this.nav),this.scene.add(this.insects.group),this.lizard=await f_.load(`./lizard/`),this.lizard.setMorph(wv.get(`morph`)??`normal`),this.scene.add(this.lizard.root),this.rig=new M_(this.lizard,this.surface),this.brain=new W_(this.rig,this.nav,this.surface,this.insects),this.brain.dish=this.dish,this.poseInterpolation=new vv([...this.lizard.bones,this.camera]),this.brain.onLap=()=>this.lap=1,this.bind(),this.applyClimate(0);let e=Number(wv.get(`sim`)??0);for(let t=0;t<e;t+=1/30)this.simulate(1/30);let t=wv.get(`cam`)?.split(`,`).map(Number),n=wv.get(`target`)?.split(`,`).map(Number);t?.length===3&&this.camera.position.set(t[0],t[1],t[2]),n?.length===3&&this.controls.target.set(n[0],n[1],n[2]),this.controls.update(),wv.get(`follow`)===`1`&&this.setFollow(!0),await this.renderer.compileAsync(this.scene,this.camera),this.draw(),document.body.classList.add(`ready`),Object.assign(window,{desertReady:!0});let r=Number(wv.get(`frames`)??0);if(r)for(let e=0;e<r;e++)this.simulate(1/30),this.draw();else this.startAnimation()}stopAnimation(){this.animation?.stop(),this.lastTime=0}startAnimation(){this.stopAnimation(),this.animation=new xv(e=>{if(document.hidden){this.lastTime=0;return}let t=this.lastTime?(e-this.lastTime)/1e3:1/60;this.lastTime=e;let n=performance.now();this.simulate(t,8);let r=performance.now();this.poseInterpolation.render(this.simulationClock.alpha,()=>this.draw(),()=>{this.lizard.syncAttachments(),this.lizard.root.updateMatrixWorld(!0),this.camera.updateMatrixWorld()});let i=performance.now();this.playbackStats?.record(e,this.time,i-n,r-n,i-r,wv.has(`lite`)?`Light`:Sv[this.quality.level].name),!wv.has(`lite`)&&wv.get(`quality`)!==`high`&&this.quality.record(t,r-n)&&this.applyQuality()}),this.animation.start()}applyQuality(){let e=Sv[this.quality.level];this.renderer.setPixelRatio(Math.min(devicePixelRatio,e.ratio)),this.post.setSamples(e.samples),this.post.settings.ao=e.ao,this.post.settings.bloom=e.bloom;for(let t of[this.habitat.warm,this.habitat.daylight])t.shadow.mapSize.x!==e.shadow&&(t.shadow.map?.dispose(),t.shadow.map=null,t.shadow.mapSize.setScalar(e.shadow));this.renderer.shadowMap.needsUpdate=!0,this.resize(!1)}simulate(e,t=1/0){let n=performance.now();this.simulationClock.advance(e,e=>this.simulationStep(e),()=>performance.now()-n<t)}simulationStep(e){if(this.time+=e,this.dayRunning&&(this.hours=(this.hours+e*.1)%24),this.applyClimate(e),this.insects.update(e),this.brain.cameraPos.copy(this.camera.position),this.brain.update(e),this.updatePlants(e),this.lap=Math.max(0,this.lap-e*.45),this.habitat.ripple(this.lap),this.follow){let t=this.rig.spinePoints()[2].clone().lerp(this.rig.snout,.3),n=this.controls.target.clone();this.controls.target.lerp(t,1-Math.exp(-e*3)),this.camera.position.add(this.controls.target.clone().sub(n)),this.camera.position.distanceTo(this.controls.target)>.42&&this.camera.position.lerp(this.controls.target,1-Math.exp(-e*1.2))}this.controls.update(),this.camera.updateMatrixWorld(),ag.uKeyDirView.value.copy(this.habitat.warm.position).sub(this.habitat.warm.target.position).normalize().transformDirection(this.camera.matrixWorldInverse),ag.uKeyColor.value.copy(this.habitat.warm.color),this.lizard.root.updateMatrixWorld(!0),this.time>this.nextReadout&&(this.nextReadout=this.time+.5,this.updateUI()),this.poseInterpolation?.capture()}updatePlants(e){let t=0,n=(e,n,r,i=r)=>{let a=this.plantContacts[t]??={a:new G,b:new G,radius:r};a.a.copy(e),a.b.copy(n),a.radius=r,a.verticalRadius=i,t++},r=this.rig.spinePoints();n(this.rig.snout,r[0],.015,.011);for(let e=0;e<r.length-1;e++)n(r[e],r[e+1],[.019,.022,.03,.036,.031][e],[.011,.013,.016,.018,.018][e]);for(let e=0;e<10;e++)n(e===0?r[5]:this.rig.tailPoint(e-1),this.rig.tailPoint(e),.016*(1-e/11));for(let e of this.lizard.data.limbs)this.plantJointA.setFromMatrixPosition(this.lizard.bones[e.bones.upper].matrix),this.plantJointB.setFromMatrixPosition(this.lizard.bones[e.bones.lower].matrix),this.plantJointC.setFromMatrixPosition(this.lizard.bones[e.bones.hand].matrix),n(this.plantJointA,this.plantJointB,.01),n(this.plantJointB,this.plantJointC,.007),n(this.plantJointC,this.plantJointC,.011,.003);this.habitat.bendPlants(e,this.plantContacts)}applyClimate(e){let t=U.smoothstep(Math.sin((this.hours-6)/12*Math.PI),0,.18),n=t<.1;this.habitat.warm.intensity=2.4*t,this.habitat.daylight.intensity=1.65*t,fg.value=t;for(let e of this.habitat.bulbs)e.emissiveIntensity=t*2.3;this.ambient.intensity=.1+.48*t,this.fill.intensity=.1+.52*t,this.brain.night=n,this.brain.heat=t,this.brain.storm=0,this.brain.raining=!1,this.brain.leavesWet=0;let r=this.rig.inputs,i=this.surface.roofed(r.x,r.z),a=(1-U.smoothstep(Math.hypot(r.x-qf.x,r.z-qf.z),.05,.29))*t*(i?.04:1);this.brain.lampOnIt=a,this.brain.envTemp=U.clamp(.19+.2*t+.43*a-(i?.04:0),0,1),this.lizard.skin.uWet.value=0,n&&!this.wasNight&&this.brain.restInHide(),this.wasNight=n}draw(){this.post.render(this.time),this.frames++}resize(e){let t=!this.follow&&this.camera.position.distanceTo(this.home)<.025,n=innerWidth,r=innerHeight;this.renderer.setSize(n,r),this.camera.aspect=n/r,this.camera.updateProjectionMatrix(),this.post.setSize(n,r,this.renderer.getPixelRatio());let i=Math.max(1.9,(Z.w+.2)/2/Math.tan(U.degToRad(this.camera.fov/2))/this.camera.aspect);this.home.set(.015,.64,i+Z.d/2-.06),n<640&&(this.home.y=.82),this.controls.maxDistance=Math.max(4.5,i+1),(e||t)&&(this.camera.position.copy(this.home),this.controls.target.copy(this.homeTarget),this.controls.update())}updateUI(){let e=this.brain.heat,t=22+19*e,n=21+3*e,r=34+(1-e)*3;this.habitat.drawReadout(t,n,r),Tv(`warm`).textContent=`${t.toFixed(0)}°C`,Tv(`cool`).textContent=`${n.toFixed(0)}°C`,Tv(`rh`).textContent=`${r.toFixed(0)}%`,Tv(`behavior`).textContent=this.brain.status;let i=Math.floor(this.hours),a=Math.floor((this.hours-i)*60);Tv(`time`).textContent=`${String(i).padStart(2,`0`)}:${String(a).padStart(2,`0`)}`,Tv(`hours`).value=String(this.hours)}setFollow(e){this.follow=e,Tv(`follow`).setAttribute(`aria-pressed`,String(e)),e&&this.say(`Following the dragon · drag to look around · scroll for a closer view`)}feed(e){let t=this.insects.release(),n=e??new G(this.rig.snout.x+.09,this.rig.snout.y,this.rig.snout.z+.065),r=this.nav.nearestWalkable(n.x,n.z,this.nav.mainRegion);return r&&(t.pos.x=r[0],t.pos.z=r[1]),this.say(`A cricket drops in. Watch the dragon notice, stalk and strike.`),t}bind(){Tv(`follow`).onclick=()=>this.setFollow(!this.follow),Tv(`reset`).onclick=()=>{this.setFollow(!1),this.camera.position.copy(this.home),this.controls.target.copy(this.homeTarget),this.controls.update()},Tv(`full`).onclick=()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.()};let e=()=>{let e=document.body.classList.toggle(`no-ui`);Tv(`show`).hidden=!e};Tv(`hide`).onclick=e,Tv(`show`).onclick=e;let t=e=>{this.feeding=e,Tv(`feed`).setAttribute(`aria-pressed`,String(e)),Tv(`observe`).setAttribute(`aria-pressed`,String(!e)),Tv(`hint`).textContent=e?`Tap inside to drop a cricket`:`Drag to orbit · scroll to explore`};Tv(`feed`).onclick=()=>{t(!0),this.feed()},Tv(`observe`).onclick=()=>t(!1),Tv(`greens`).onclick=()=>{this.dish.refill(),this.say(`Fresh greens in the stone dish. The dragon grazes when it is ready.`)};let n=()=>{let e=[`normal`,`red`,`citrus`,`hypo`],t=e[(e.indexOf(this.lizard.morph)+1)%e.length];this.lizard.setMorph(t),Tv(`morph`).textContent=`Colour · ${t[0].toUpperCase()+t.slice(1)}`};Tv(`morph`).onclick=n,Tv(`hours`).oninput=()=>{this.hours=Number(Tv(`hours`).value),this.applyClimate(0),this.updateUI()},Tv(`play`).onclick=()=>{this.dayRunning=!this.dayRunning,Tv(`play`).textContent=this.dayRunning?`Ⅱ`:`▶`,Tv(`play`).setAttribute(`aria-pressed`,String(this.dayRunning))},addEventListener(`keydown`,r=>{if(r.target instanceof HTMLInputElement)return;let i=r.key.toLowerCase();i===`f`&&this.setFollow(!this.follow),i===`m`&&n(),i===`h`&&e(),i===`r`&&Tv(`reset`).click(),i===`1`&&t(!1),i===`2`&&Tv(`feed`).click()});let r={x:0,y:0},i=new jc,a=e=>{let t=this.renderer.domElement.getBoundingClientRect();i.setFromCamera(new W((e.clientX-t.left)/t.width*2-1,-(e.clientY-t.top)/t.height*2+1),this.camera)},o=this.renderer.domElement;o.addEventListener(`pointerdown`,e=>{if(r={x:e.clientX,y:e.clientY},this.feeding&&e.button===0){a(e);let t=i.intersectObjects([this.habitat.ground,...this.habitat.hard.map(e=>e.mesh)],!1);t[0]&&this.feed(t[0].point),e.stopImmediatePropagation()}},{capture:!0}),o.addEventListener(`pointermove`,e=>{a(e);let t=i.intersectObject(this.habitat.ground,!1)[0];this.brain.pointer=t?.point??null}),o.addEventListener(`pointerleave`,()=>this.brain.pointer=null),o.addEventListener(`pointerup`,e=>{this.feeding||Math.hypot(e.clientX-r.x,e.clientY-r.y)>5||(a(e),[this.rig.snout,...this.rig.spinePoints()].some(e=>i.ray.distanceToPoint(e)<.025)&&(this.brain.pet(),this.say(`The dragon closes its eyes.`)))})}say(e){Tv(`toast`).textContent=e,Tv(`toast`).classList.add(`on`),clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>Tv(`toast`).classList.remove(`on`),5200)}fail(e){Tv(`fatal`).hidden=!1,Tv(`fatal`).textContent=e,Tv(`veil`).remove()}};try{if(!document.createElement(`canvas`).getContext(`webgl2`))throw Error(`This terrarium needs WebGL 2. Open it in a current browser.`);let e=new Ev;e.ready.catch(t=>{console.error(t),e.fail(`The terrarium could not finish loading. Reload to try again.`)})}catch(e){console.error(e),Tv(`fatal`).hidden=!1,Tv(`fatal`).textContent=String(e),Tv(`veil`).remove()}