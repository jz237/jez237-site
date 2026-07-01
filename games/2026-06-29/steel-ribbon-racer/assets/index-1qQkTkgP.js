(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const cc="181",Rd=0,Vc=1,Pd=2,mh=1,xh=2,ri=3,Ci=0,an=1,gt=2,qn=0,Ms=1,Wi=2,Gc=3,Hc=4,Ld=5,Gi=100,Dd=101,Id=102,Ud=103,Nd=104,Fd=200,Od=201,Bd=202,zd=203,uo=204,fo=205,kd=206,Vd=207,Gd=208,Hd=209,Wd=210,Xd=211,Yd=212,qd=213,Zd=214,po=0,mo=1,xo=2,ws=3,go=4,_o=5,vo=6,Mo=7,lc=0,$d=1,Kd=2,Ei=0,gh=1,_h=2,vh=3,hc=4,Mh=5,Sh=6,yh=7,bh=300,Ts=301,Es=302,So=303,yo=304,fa=306,cn=1e3,ci=1001,bo=1002,bn=1003,Jd=1004,Mr=1005,Cn=1006,wa=1007,Xi=1008,$n=1009,wh=1010,Th=1011,ir=1012,dc=1013,Ki=1014,Xn=1015,Zn=1016,uc=1017,fc=1018,sr=1020,Eh=35902,Ah=35899,Ch=1021,Rh=1022,Fn=1023,rr=1026,ar=1027,pc=1028,mc=1029,xc=1030,gc=1031,_c=1033,$r=33776,Kr=33777,Jr=33778,jr=33779,wo=35840,To=35841,Eo=35842,Ao=35843,Co=36196,Ro=37492,Po=37496,Lo=37808,Do=37809,Io=37810,Uo=37811,No=37812,Fo=37813,Oo=37814,Bo=37815,zo=37816,ko=37817,Vo=37818,Go=37819,Ho=37820,Wo=37821,Xo=36492,Yo=36494,qo=36495,Zo=36283,$o=36284,Ko=36285,Jo=36286,jd=3200,Qd=3201,vc=0,eu=1,bi="",Ct="srgb",As="srgb-linear",sa="linear",Nt="srgb",ns=7680,Wc=519,tu=512,nu=513,iu=514,Ph=515,su=516,ru=517,au=518,ou=519,Xc=35044,Yc="300 es",Yn=2e3,ra=2001;function Lh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function aa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function cu(){const i=aa("canvas");return i.style.display="block",i}const qc={};function Zc(...i){const e="THREE."+i.shift();console.log(e,...i)}function ot(...i){const e="THREE."+i.shift();console.warn(e,...i)}function Gt(...i){const e="THREE."+i.shift();console.error(e,...i)}function or(...i){const e=i.join(" ");e in qc||(qc[e]=!0,ot(...i))}function lu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}class Ls{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const en=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let $c=1234567;const Js=Math.PI/180,cr=180/Math.PI;function Qi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(en[i&255]+en[i>>8&255]+en[i>>16&255]+en[i>>24&255]+"-"+en[e&255]+en[e>>8&255]+"-"+en[e>>16&15|64]+en[e>>24&255]+"-"+en[t&63|128]+en[t>>8&255]+"-"+en[t>>16&255]+en[t>>24&255]+en[n&255]+en[n>>8&255]+en[n>>16&255]+en[n>>24&255]).toLowerCase()}function _t(i,e,t){return Math.max(e,Math.min(t,i))}function Mc(i,e){return(i%e+e)%e}function hu(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function du(i,e,t){return i!==e?(t-i)/(e-i):0}function js(i,e,t){return(1-t)*i+t*e}function uu(i,e,t,n){return js(i,e,1-Math.exp(-t*n))}function fu(i,e=1){return e-Math.abs(Mc(i,e*2)-e)}function pu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function mu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function xu(i,e){return i+Math.floor(Math.random()*(e-i+1))}function gu(i,e){return i+Math.random()*(e-i)}function _u(i){return i*(.5-Math.random())}function vu(i){i!==void 0&&($c=i);let e=$c+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Mu(i){return i*Js}function Su(i){return i*cr}function yu(i){return(i&i-1)===0&&i!==0}function bu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function wu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Tu(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),d=a((e+n)/2),u=r((e-n)/2),f=a((e-n)/2),p=r((n-e)/2),x=a((n-e)/2);switch(s){case"XYX":i.set(o*d,c*u,c*f,o*l);break;case"YZY":i.set(c*f,o*d,c*u,o*l);break;case"ZXZ":i.set(c*u,c*f,o*d,o*l);break;case"XZX":i.set(o*d,c*x,c*p,o*l);break;case"YXY":i.set(c*p,o*d,c*x,o*l);break;case"ZYZ":i.set(c*x,c*p,o*d,o*l);break;default:ot("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function _s(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function hn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Xe={DEG2RAD:Js,RAD2DEG:cr,generateUUID:Qi,clamp:_t,euclideanModulo:Mc,mapLinear:hu,inverseLerp:du,lerp:js,damp:uu,pingpong:fu,smoothstep:pu,smootherstep:mu,randInt:xu,randFloat:gu,randFloatSpread:_u,seededRandom:vu,degToRad:Mu,radToDeg:Su,isPowerOfTwo:yu,ceilPowerOfTwo:bu,floorPowerOfTwo:wu,setQuaternionFromProperEuler:Tu,normalize:hn,denormalize:_s};class Ie{constructor(e=0,t=0){Ie.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=_t(this.x,e.x,t.x),this.y=_t(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=_t(this.x,e,t),this.y=_t(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(_t(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(_t(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ui{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],u=n[s+3],f=r[a+0],p=r[a+1],x=r[a+2],_=r[a+3];if(o<=0){e[t+0]=c,e[t+1]=l,e[t+2]=d,e[t+3]=u;return}if(o>=1){e[t+0]=f,e[t+1]=p,e[t+2]=x,e[t+3]=_;return}if(u!==_||c!==f||l!==p||d!==x){let m=c*f+l*p+d*x+u*_;m<0&&(f=-f,p=-p,x=-x,_=-_,m=-m);let h=1-o;if(m<.9995){const v=Math.acos(m),S=Math.sin(v);h=Math.sin(h*v)/S,o=Math.sin(o*v)/S,c=c*h+f*o,l=l*h+p*o,d=d*h+x*o,u=u*h+_*o}else{c=c*h+f*o,l=l*h+p*o,d=d*h+x*o,u=u*h+_*o;const v=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=v,l*=v,d*=v,u*=v}}e[t]=c,e[t+1]=l,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],u=r[a],f=r[a+1],p=r[a+2],x=r[a+3];return e[t]=o*x+d*u+c*p-l*f,e[t+1]=c*x+d*f+l*u-o*p,e[t+2]=l*x+d*p+o*f-c*u,e[t+3]=d*x-o*u-c*f-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),u=o(r/2),f=c(n/2),p=c(s/2),x=c(r/2);switch(a){case"XYZ":this._x=f*d*u+l*p*x,this._y=l*p*u-f*d*x,this._z=l*d*x+f*p*u,this._w=l*d*u-f*p*x;break;case"YXZ":this._x=f*d*u+l*p*x,this._y=l*p*u-f*d*x,this._z=l*d*x-f*p*u,this._w=l*d*u+f*p*x;break;case"ZXY":this._x=f*d*u-l*p*x,this._y=l*p*u+f*d*x,this._z=l*d*x+f*p*u,this._w=l*d*u-f*p*x;break;case"ZYX":this._x=f*d*u-l*p*x,this._y=l*p*u+f*d*x,this._z=l*d*x-f*p*u,this._w=l*d*u+f*p*x;break;case"YZX":this._x=f*d*u+l*p*x,this._y=l*p*u+f*d*x,this._z=l*d*x-f*p*u,this._w=l*d*u-f*p*x;break;case"XZY":this._x=f*d*u-l*p*x,this._y=l*p*u-f*d*x,this._z=l*d*x+f*p*u,this._w=l*d*u+f*p*x;break;default:ot("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],d=t[6],u=t[10],f=n+o+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(d-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(d-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+d)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(_t(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,d=t._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,t=Math.sin(t*l)/d,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,n=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Kc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Kc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),d=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*d,this.y=n+c*d+o*l-r*u,this.z=s+c*u+r*d-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=_t(this.x,e.x,t.x),this.y=_t(this.y,e.y,t.y),this.z=_t(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=_t(this.x,e,t),this.y=_t(this.y,e,t),this.z=_t(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(_t(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ta.copy(this).projectOnVector(e),this.sub(Ta)}reflect(e){return this.sub(Ta.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(_t(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ta=new L,Kc=new ui;class pt{constructor(e,t,n,s,r,a,o,c,l){pt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],u=n[7],f=n[2],p=n[5],x=n[8],_=s[0],m=s[3],h=s[6],v=s[1],S=s[4],y=s[7],E=s[2],T=s[5],P=s[8];return r[0]=a*_+o*v+c*E,r[3]=a*m+o*S+c*T,r[6]=a*h+o*y+c*P,r[1]=l*_+d*v+u*E,r[4]=l*m+d*S+u*T,r[7]=l*h+d*y+u*P,r[2]=f*_+p*v+x*E,r[5]=f*m+p*S+x*T,r[8]=f*h+p*y+x*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8];return t*a*d-t*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],u=d*a-o*l,f=o*c-d*r,p=l*r-a*c,x=t*u+n*f+s*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/x;return e[0]=u*_,e[1]=(s*l-d*n)*_,e[2]=(o*n-s*a)*_,e[3]=f*_,e[4]=(d*t-s*c)*_,e[5]=(s*r-o*t)*_,e[6]=p*_,e[7]=(n*c-l*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ea.makeScale(e,t)),this}rotate(e){return this.premultiply(Ea.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ea.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ea=new pt,Jc=new pt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),jc=new pt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Eu(){const i={enabled:!0,workingColorSpace:As,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Nt&&(s.r=li(s.r),s.g=li(s.g),s.b=li(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Nt&&(s.r=Ss(s.r),s.g=Ss(s.g),s.b=Ss(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===bi?sa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return or("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return or("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[As]:{primaries:e,whitePoint:n,transfer:sa,toXYZ:Jc,fromXYZ:jc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ct},outputColorSpaceConfig:{drawingBufferColorSpace:Ct}},[Ct]:{primaries:e,whitePoint:n,transfer:Nt,toXYZ:Jc,fromXYZ:jc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ct}}}),i}const Et=Eu();function li(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ss(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let is;class Au{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{is===void 0&&(is=aa("canvas")),is.width=e.width,is.height=e.height;const s=is.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=is}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=aa("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=li(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(li(t[n]/255)*255):t[n]=li(t[n]);return{data:t,width:e.width,height:e.height}}else return ot("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Cu=0;class Sc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Cu++}),this.uuid=Qi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Aa(s[a].image)):r.push(Aa(s[a]))}else r=Aa(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Aa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Au.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(ot("Texture: Unable to serialize Texture."),{})}let Ru=0;const Ca=new L;class on extends Ls{constructor(e=on.DEFAULT_IMAGE,t=on.DEFAULT_MAPPING,n=ci,s=ci,r=Cn,a=Xi,o=Fn,c=$n,l=on.DEFAULT_ANISOTROPY,d=bi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ru++}),this.uuid=Qi(),this.name="",this.source=new Sc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ie(0,0),this.repeat=new Ie(1,1),this.center=new Ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new pt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ca).x}get height(){return this.source.getSize(Ca).y}get depth(){return this.source.getSize(Ca).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){ot(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){ot(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==bh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case cn:e.x=e.x-Math.floor(e.x);break;case ci:e.x=e.x<0?0:1;break;case bo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case cn:e.y=e.y-Math.floor(e.y);break;case ci:e.y=e.y<0?0:1;break;case bo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}on.DEFAULT_IMAGE=null;on.DEFAULT_MAPPING=bh;on.DEFAULT_ANISOTROPY=1;class Ft{constructor(e=0,t=0,n=0,s=1){Ft.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],d=c[4],u=c[8],f=c[1],p=c[5],x=c[9],_=c[2],m=c[6],h=c[10];if(Math.abs(d-f)<.01&&Math.abs(u-_)<.01&&Math.abs(x-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(u+_)<.1&&Math.abs(x+m)<.1&&Math.abs(l+p+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(l+1)/2,y=(p+1)/2,E=(h+1)/2,T=(d+f)/4,P=(u+_)/4,R=(x+m)/4;return S>y&&S>E?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=T/n,r=P/n):y>E?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=T/s,r=R/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=P/r,s=R/r),this.set(n,s,r,t),this}let v=Math.sqrt((m-x)*(m-x)+(u-_)*(u-_)+(f-d)*(f-d));return Math.abs(v)<.001&&(v=1),this.x=(m-x)/v,this.y=(u-_)/v,this.z=(f-d)/v,this.w=Math.acos((l+p+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=_t(this.x,e.x,t.x),this.y=_t(this.y,e.y,t.y),this.z=_t(this.z,e.z,t.z),this.w=_t(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=_t(this.x,e,t),this.y=_t(this.y,e,t),this.z=_t(this.z,e,t),this.w=_t(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(_t(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Pu extends Ls{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Cn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ft(0,0,e,t),this.scissorTest=!1,this.viewport=new Ft(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new on(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Cn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Sc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class On extends Pu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Dh extends on{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=bn,this.minFilter=bn,this.wrapR=ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Lu extends on{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=bn,this.minFilter=bn,this.wrapR=ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class es{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Rn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Rn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Rn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Rn):Rn.fromBufferAttribute(r,a),Rn.applyMatrix4(e.matrixWorld),this.expandByPoint(Rn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Sr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Sr.copy(n.boundingBox)),Sr.applyMatrix4(e.matrixWorld),this.union(Sr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Rn),Rn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Os),yr.subVectors(this.max,Os),ss.subVectors(e.a,Os),rs.subVectors(e.b,Os),as.subVectors(e.c,Os),pi.subVectors(rs,ss),mi.subVectors(as,rs),Di.subVectors(ss,as);let t=[0,-pi.z,pi.y,0,-mi.z,mi.y,0,-Di.z,Di.y,pi.z,0,-pi.x,mi.z,0,-mi.x,Di.z,0,-Di.x,-pi.y,pi.x,0,-mi.y,mi.x,0,-Di.y,Di.x,0];return!Ra(t,ss,rs,as,yr)||(t=[1,0,0,0,1,0,0,0,1],!Ra(t,ss,rs,as,yr))?!1:(br.crossVectors(pi,mi),t=[br.x,br.y,br.z],Ra(t,ss,rs,as,yr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Rn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Rn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Qn=[new L,new L,new L,new L,new L,new L,new L,new L],Rn=new L,Sr=new es,ss=new L,rs=new L,as=new L,pi=new L,mi=new L,Di=new L,Os=new L,yr=new L,br=new L,Ii=new L;function Ra(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ii.fromArray(i,r);const o=s.x*Math.abs(Ii.x)+s.y*Math.abs(Ii.y)+s.z*Math.abs(Ii.z),c=e.dot(Ii),l=t.dot(Ii),d=n.dot(Ii);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const Du=new es,Bs=new L,Pa=new L;class Ds{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Du.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Bs.subVectors(e,this.center);const t=Bs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Bs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Pa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Bs.copy(e.center).add(Pa)),this.expandByPoint(Bs.copy(e.center).sub(Pa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const ei=new L,La=new L,wr=new L,xi=new L,Da=new L,Tr=new L,Ia=new L;class yc{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ei)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ei.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ei.copy(this.origin).addScaledVector(this.direction,t),ei.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){La.copy(e).add(t).multiplyScalar(.5),wr.copy(t).sub(e).normalize(),xi.copy(this.origin).sub(La);const r=e.distanceTo(t)*.5,a=-this.direction.dot(wr),o=xi.dot(this.direction),c=-xi.dot(wr),l=xi.lengthSq(),d=Math.abs(1-a*a);let u,f,p,x;if(d>0)if(u=a*c-o,f=a*o-c,x=r*d,u>=0)if(f>=-x)if(f<=x){const _=1/d;u*=_,f*=_,p=u*(u+a*f+2*o)+f*(a*u+f+2*c)+l}else f=r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+l;else f<=-x?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l):f<=x?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+l):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(La).addScaledVector(wr,f),p}intersectSphere(e,t){ei.subVectors(e.center,this.origin);const n=ei.dot(this.direction),s=ei.dot(ei)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),d>=0?(r=(e.min.y-f.y)*d,a=(e.max.y-f.y)*d):(r=(e.max.y-f.y)*d,a=(e.min.y-f.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ei)!==null}intersectTriangle(e,t,n,s,r){Da.subVectors(t,e),Tr.subVectors(n,e),Ia.crossVectors(Da,Tr);let a=this.direction.dot(Ia),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;xi.subVectors(this.origin,e);const c=o*this.direction.dot(Tr.crossVectors(xi,Tr));if(c<0)return null;const l=o*this.direction.dot(Da.cross(xi));if(l<0||c+l>a)return null;const d=-o*xi.dot(Ia);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Dt{constructor(e,t,n,s,r,a,o,c,l,d,u,f,p,x,_,m){Dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,d,u,f,p,x,_,m)}set(e,t,n,s,r,a,o,c,l,d,u,f,p,x,_,m){const h=this.elements;return h[0]=e,h[4]=t,h[8]=n,h[12]=s,h[1]=r,h[5]=a,h[9]=o,h[13]=c,h[2]=l,h[6]=d,h[10]=u,h[14]=f,h[3]=p,h[7]=x,h[11]=_,h[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Dt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/os.setFromMatrixColumn(e,0).length(),r=1/os.setFromMatrixColumn(e,1).length(),a=1/os.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=a*d,p=a*u,x=o*d,_=o*u;t[0]=c*d,t[4]=-c*u,t[8]=l,t[1]=p+x*l,t[5]=f-_*l,t[9]=-o*c,t[2]=_-f*l,t[6]=x+p*l,t[10]=a*c}else if(e.order==="YXZ"){const f=c*d,p=c*u,x=l*d,_=l*u;t[0]=f+_*o,t[4]=x*o-p,t[8]=a*l,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=p*o-x,t[6]=_+f*o,t[10]=a*c}else if(e.order==="ZXY"){const f=c*d,p=c*u,x=l*d,_=l*u;t[0]=f-_*o,t[4]=-a*u,t[8]=x+p*o,t[1]=p+x*o,t[5]=a*d,t[9]=_-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const f=a*d,p=a*u,x=o*d,_=o*u;t[0]=c*d,t[4]=x*l-p,t[8]=f*l+_,t[1]=c*u,t[5]=_*l+f,t[9]=p*l-x,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,p=a*l,x=o*c,_=o*l;t[0]=c*d,t[4]=_-f*u,t[8]=x*u+p,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-l*d,t[6]=p*u+x,t[10]=f-_*u}else if(e.order==="XZY"){const f=a*c,p=a*l,x=o*c,_=o*l;t[0]=c*d,t[4]=-u,t[8]=l*d,t[1]=f*u+_,t[5]=a*d,t[9]=p*u-x,t[2]=x*u-p,t[6]=o*d,t[10]=_*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Iu,e,Uu)}lookAt(e,t,n){const s=this.elements;return vn.subVectors(e,t),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),gi.crossVectors(n,vn),gi.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),gi.crossVectors(n,vn)),gi.normalize(),Er.crossVectors(vn,gi),s[0]=gi.x,s[4]=Er.x,s[8]=vn.x,s[1]=gi.y,s[5]=Er.y,s[9]=vn.y,s[2]=gi.z,s[6]=Er.z,s[10]=vn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],u=n[5],f=n[9],p=n[13],x=n[2],_=n[6],m=n[10],h=n[14],v=n[3],S=n[7],y=n[11],E=n[15],T=s[0],P=s[4],R=s[8],b=s[12],M=s[1],C=s[5],D=s[9],H=s[13],J=s[2],j=s[6],te=s[10],re=s[14],se=s[3],xe=s[7],Me=s[11],ze=s[15];return r[0]=a*T+o*M+c*J+l*se,r[4]=a*P+o*C+c*j+l*xe,r[8]=a*R+o*D+c*te+l*Me,r[12]=a*b+o*H+c*re+l*ze,r[1]=d*T+u*M+f*J+p*se,r[5]=d*P+u*C+f*j+p*xe,r[9]=d*R+u*D+f*te+p*Me,r[13]=d*b+u*H+f*re+p*ze,r[2]=x*T+_*M+m*J+h*se,r[6]=x*P+_*C+m*j+h*xe,r[10]=x*R+_*D+m*te+h*Me,r[14]=x*b+_*H+m*re+h*ze,r[3]=v*T+S*M+y*J+E*se,r[7]=v*P+S*C+y*j+E*xe,r[11]=v*R+S*D+y*te+E*Me,r[15]=v*b+S*H+y*re+E*ze,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],d=e[2],u=e[6],f=e[10],p=e[14],x=e[3],_=e[7],m=e[11],h=e[15];return x*(+r*c*u-s*l*u-r*o*f+n*l*f+s*o*p-n*c*p)+_*(+t*c*p-t*l*f+r*a*f-s*a*p+s*l*d-r*c*d)+m*(+t*l*u-t*o*p-r*a*u+n*a*p+r*o*d-n*l*d)+h*(-s*o*d-t*c*u+t*o*f+s*a*u-n*a*f+n*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],u=e[9],f=e[10],p=e[11],x=e[12],_=e[13],m=e[14],h=e[15],v=u*m*l-_*f*l+_*c*p-o*m*p-u*c*h+o*f*h,S=x*f*l-d*m*l-x*c*p+a*m*p+d*c*h-a*f*h,y=d*_*l-x*u*l+x*o*p-a*_*p-d*o*h+a*u*h,E=x*u*c-d*_*c-x*o*f+a*_*f+d*o*m-a*u*m,T=t*v+n*S+s*y+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/T;return e[0]=v*P,e[1]=(_*f*r-u*m*r-_*s*p+n*m*p+u*s*h-n*f*h)*P,e[2]=(o*m*r-_*c*r+_*s*l-n*m*l-o*s*h+n*c*h)*P,e[3]=(u*c*r-o*f*r-u*s*l+n*f*l+o*s*p-n*c*p)*P,e[4]=S*P,e[5]=(d*m*r-x*f*r+x*s*p-t*m*p-d*s*h+t*f*h)*P,e[6]=(x*c*r-a*m*r-x*s*l+t*m*l+a*s*h-t*c*h)*P,e[7]=(a*f*r-d*c*r+d*s*l-t*f*l-a*s*p+t*c*p)*P,e[8]=y*P,e[9]=(x*u*r-d*_*r-x*n*p+t*_*p+d*n*h-t*u*h)*P,e[10]=(a*_*r-x*o*r+x*n*l-t*_*l-a*n*h+t*o*h)*P,e[11]=(d*o*r-a*u*r-d*n*l+t*u*l+a*n*p-t*o*p)*P,e[12]=E*P,e[13]=(d*_*s-x*u*s+x*n*f-t*_*f-d*n*m+t*u*m)*P,e[14]=(x*o*s-a*_*s-x*n*c+t*_*c+a*n*m-t*o*m)*P,e[15]=(a*u*s-d*o*s+d*n*c-t*u*c-a*n*f+t*o*f)*P,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,d=a+a,u=o+o,f=r*l,p=r*d,x=r*u,_=a*d,m=a*u,h=o*u,v=c*l,S=c*d,y=c*u,E=n.x,T=n.y,P=n.z;return s[0]=(1-(_+h))*E,s[1]=(p+y)*E,s[2]=(x-S)*E,s[3]=0,s[4]=(p-y)*T,s[5]=(1-(f+h))*T,s[6]=(m+v)*T,s[7]=0,s[8]=(x+S)*P,s[9]=(m-v)*P,s[10]=(1-(f+_))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=os.set(s[0],s[1],s[2]).length();const a=os.set(s[4],s[5],s[6]).length(),o=os.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Pn.copy(this);const l=1/r,d=1/a,u=1/o;return Pn.elements[0]*=l,Pn.elements[1]*=l,Pn.elements[2]*=l,Pn.elements[4]*=d,Pn.elements[5]*=d,Pn.elements[6]*=d,Pn.elements[8]*=u,Pn.elements[9]*=u,Pn.elements[10]*=u,t.setFromRotationMatrix(Pn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Yn,c=!1){const l=this.elements,d=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),p=(n+s)/(n-s);let x,_;if(c)x=r/(a-r),_=a*r/(a-r);else if(o===Yn)x=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===ra)x=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=x,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Yn,c=!1){const l=this.elements,d=2/(t-e),u=2/(n-s),f=-(t+e)/(t-e),p=-(n+s)/(n-s);let x,_;if(c)x=1/(a-r),_=a/(a-r);else if(o===Yn)x=-2/(a-r),_=-(a+r)/(a-r);else if(o===ra)x=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=x,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const os=new L,Pn=new Dt,Iu=new L(0,0,0),Uu=new L(1,1,1),gi=new L,Er=new L,vn=new L,Qc=new Dt,el=new ui;class kn{constructor(e=0,t=0,n=0,s=kn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],u=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(_t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-_t(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(_t(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-_t(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(_t(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-_t(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,p),this._y=0);break;default:ot("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Qc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Qc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return el.setFromEuler(this),this.setFromQuaternion(el,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}kn.DEFAULT_ORDER="XYZ";class bc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Nu=0;const tl=new L,cs=new ui,ti=new Dt,Ar=new L,zs=new L,Fu=new L,Ou=new ui,nl=new L(1,0,0),il=new L(0,1,0),sl=new L(0,0,1),rl={type:"added"},Bu={type:"removed"},ls={type:"childadded",child:null},Ua={type:"childremoved",child:null};class Ht extends Ls{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Nu++}),this.uuid=Qi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ht.DEFAULT_UP.clone();const e=new L,t=new kn,n=new ui,s=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Dt},normalMatrix:{value:new pt}}),this.matrix=new Dt,this.matrixWorld=new Dt,this.matrixAutoUpdate=Ht.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return cs.setFromAxisAngle(e,t),this.quaternion.multiply(cs),this}rotateOnWorldAxis(e,t){return cs.setFromAxisAngle(e,t),this.quaternion.premultiply(cs),this}rotateX(e){return this.rotateOnAxis(nl,e)}rotateY(e){return this.rotateOnAxis(il,e)}rotateZ(e){return this.rotateOnAxis(sl,e)}translateOnAxis(e,t){return tl.copy(e).applyQuaternion(this.quaternion),this.position.add(tl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(nl,e)}translateY(e){return this.translateOnAxis(il,e)}translateZ(e){return this.translateOnAxis(sl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ti.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ar.copy(e):Ar.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),zs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ti.lookAt(zs,Ar,this.up):ti.lookAt(Ar,zs,this.up),this.quaternion.setFromRotationMatrix(ti),s&&(ti.extractRotation(s.matrixWorld),cs.setFromRotationMatrix(ti),this.quaternion.premultiply(cs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Gt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(rl),ls.child=e,this.dispatchEvent(ls),ls.child=null):Gt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Bu),Ua.child=e,this.dispatchEvent(Ua),Ua.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ti.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ti.multiply(e.parent.matrixWorld)),e.applyMatrix4(ti),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(rl),ls.child=e,this.dispatchEvent(ls),ls.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zs,e,Fu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zs,Ou,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),d=a(e.images),u=a(e.shapes),f=a(e.skeletons),p=a(e.animations),x=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),x.length>0&&(n.nodes=x)}return n.object=s,n;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Ht.DEFAULT_UP=new L(0,1,0);Ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ln=new L,ni=new L,Na=new L,ii=new L,hs=new L,ds=new L,al=new L,Fa=new L,Oa=new L,Ba=new L,za=new Ft,ka=new Ft,Va=new Ft;class Nn{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Ln.subVectors(e,t),s.cross(Ln);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Ln.subVectors(s,t),ni.subVectors(n,t),Na.subVectors(e,t);const a=Ln.dot(Ln),o=Ln.dot(ni),c=Ln.dot(Na),l=ni.dot(ni),d=ni.dot(Na),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(l*c-o*d)*f,x=(a*d-o*c)*f;return r.set(1-p-x,x,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ii)===null?!1:ii.x>=0&&ii.y>=0&&ii.x+ii.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,ii)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ii.x),c.addScaledVector(a,ii.y),c.addScaledVector(o,ii.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return za.setScalar(0),ka.setScalar(0),Va.setScalar(0),za.fromBufferAttribute(e,t),ka.fromBufferAttribute(e,n),Va.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(za,r.x),a.addScaledVector(ka,r.y),a.addScaledVector(Va,r.z),a}static isFrontFacing(e,t,n,s){return Ln.subVectors(n,t),ni.subVectors(e,t),Ln.cross(ni).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ln.subVectors(this.c,this.b),ni.subVectors(this.a,this.b),Ln.cross(ni).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Nn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Nn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Nn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Nn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Nn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;hs.subVectors(s,n),ds.subVectors(r,n),Fa.subVectors(e,n);const c=hs.dot(Fa),l=ds.dot(Fa);if(c<=0&&l<=0)return t.copy(n);Oa.subVectors(e,s);const d=hs.dot(Oa),u=ds.dot(Oa);if(d>=0&&u<=d)return t.copy(s);const f=c*u-d*l;if(f<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(n).addScaledVector(hs,a);Ba.subVectors(e,r);const p=hs.dot(Ba),x=ds.dot(Ba);if(x>=0&&p<=x)return t.copy(r);const _=p*l-c*x;if(_<=0&&l>=0&&x<=0)return o=l/(l-x),t.copy(n).addScaledVector(ds,o);const m=d*x-p*u;if(m<=0&&u-d>=0&&p-x>=0)return al.subVectors(r,s),o=(u-d)/(u-d+(p-x)),t.copy(s).addScaledVector(al,o);const h=1/(m+_+f);return a=_*h,o=f*h,t.copy(n).addScaledVector(hs,a).addScaledVector(ds,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ih={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_i={h:0,s:0,l:0},Cr={h:0,s:0,l:0};function Ga(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class tt{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ct){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Et.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Et.workingColorSpace){return this.r=e,this.g=t,this.b=n,Et.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Et.workingColorSpace){if(e=Mc(e,1),t=_t(t,0,1),n=_t(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Ga(a,r,e+1/3),this.g=Ga(a,r,e),this.b=Ga(a,r,e-1/3)}return Et.colorSpaceToWorking(this,s),this}setStyle(e,t=Ct){function n(r){r!==void 0&&parseFloat(r)<1&&ot("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:ot("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);ot("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ct){const n=Ih[e.toLowerCase()];return n!==void 0?this.setHex(n,t):ot("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=li(e.r),this.g=li(e.g),this.b=li(e.b),this}copyLinearToSRGB(e){return this.r=Ss(e.r),this.g=Ss(e.g),this.b=Ss(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ct){return Et.workingToColorSpace(tn.copy(this),e),Math.round(_t(tn.r*255,0,255))*65536+Math.round(_t(tn.g*255,0,255))*256+Math.round(_t(tn.b*255,0,255))}getHexString(e=Ct){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Et.workingColorSpace){Et.workingToColorSpace(tn.copy(this),t);const n=tn.r,s=tn.g,r=tn.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=d<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=d,e}getRGB(e,t=Et.workingColorSpace){return Et.workingToColorSpace(tn.copy(this),t),e.r=tn.r,e.g=tn.g,e.b=tn.b,e}getStyle(e=Ct){Et.workingToColorSpace(tn.copy(this),e);const t=tn.r,n=tn.g,s=tn.b;return e!==Ct?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(_i),this.setHSL(_i.h+e,_i.s+t,_i.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(_i),e.getHSL(Cr);const n=js(_i.h,Cr.h,t),s=js(_i.s,Cr.s,t),r=js(_i.l,Cr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const tn=new tt;tt.NAMES=Ih;let zu=0;class ts extends Ls{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=Qi(),this.name="",this.type="Material",this.blending=Ms,this.side=Ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=uo,this.blendDst=fo,this.blendEquation=Gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new tt(0,0,0),this.blendAlpha=0,this.depthFunc=ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ns,this.stencilZFail=ns,this.stencilZPass=ns,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){ot(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){ot(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ms&&(n.blending=this.blending),this.side!==Ci&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==uo&&(n.blendSrc=this.blendSrc),this.blendDst!==fo&&(n.blendDst=this.blendDst),this.blendEquation!==Gi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ws&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Wc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ns&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ns&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ns&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Lt extends ts{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=lc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const qt=new L,Rr=new Ie;let ku=0;class Bn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ku++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Xc,this.updateRanges=[],this.gpuType=Xn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Rr.fromBufferAttribute(this,t),Rr.applyMatrix3(e),this.setXY(t,Rr.x,Rr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix3(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=_s(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=hn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=_s(t,this.array)),t}setX(e,t){return this.normalized&&(t=hn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=_s(t,this.array)),t}setY(e,t){return this.normalized&&(t=hn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=_s(t,this.array)),t}setZ(e,t){return this.normalized&&(t=hn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=_s(t,this.array)),t}setW(e,t){return this.normalized&&(t=hn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=hn(t,this.array),n=hn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=hn(t,this.array),n=hn(n,this.array),s=hn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=hn(t,this.array),n=hn(n,this.array),s=hn(s,this.array),r=hn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Xc&&(e.usage=this.usage),e}}class Uh extends Bn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Nh extends Bn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class wt extends Bn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Vu=0;const En=new Dt,Ha=new Ht,us=new L,Mn=new es,ks=new es,jt=new L;class Wt extends Ls{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Vu++}),this.uuid=Qi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Lh(e)?Nh:Uh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new pt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return En.makeRotationFromQuaternion(e),this.applyMatrix4(En),this}rotateX(e){return En.makeRotationX(e),this.applyMatrix4(En),this}rotateY(e){return En.makeRotationY(e),this.applyMatrix4(En),this}rotateZ(e){return En.makeRotationZ(e),this.applyMatrix4(En),this}translate(e,t,n){return En.makeTranslation(e,t,n),this.applyMatrix4(En),this}scale(e,t,n){return En.makeScale(e,t,n),this.applyMatrix4(En),this}lookAt(e){return Ha.lookAt(e),Ha.updateMatrix(),this.applyMatrix4(Ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(us).negate(),this.translate(us.x,us.y,us.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new wt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&ot("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new es);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Gt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Mn.setFromBufferAttribute(r),this.morphTargetsRelative?(jt.addVectors(this.boundingBox.min,Mn.min),this.boundingBox.expandByPoint(jt),jt.addVectors(this.boundingBox.max,Mn.max),this.boundingBox.expandByPoint(jt)):(this.boundingBox.expandByPoint(Mn.min),this.boundingBox.expandByPoint(Mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Gt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ds);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Gt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const n=this.boundingSphere.center;if(Mn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ks.setFromBufferAttribute(o),this.morphTargetsRelative?(jt.addVectors(Mn.min,ks.min),Mn.expandByPoint(jt),jt.addVectors(Mn.max,ks.max),Mn.expandByPoint(jt)):(Mn.expandByPoint(ks.min),Mn.expandByPoint(ks.max))}Mn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)jt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(jt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)jt.fromBufferAttribute(o,l),c&&(us.fromBufferAttribute(e,l),jt.add(us)),s=Math.max(s,n.distanceToSquared(jt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Gt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Gt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Bn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<n.count;R++)o[R]=new L,c[R]=new L;const l=new L,d=new L,u=new L,f=new Ie,p=new Ie,x=new Ie,_=new L,m=new L;function h(R,b,M){l.fromBufferAttribute(n,R),d.fromBufferAttribute(n,b),u.fromBufferAttribute(n,M),f.fromBufferAttribute(r,R),p.fromBufferAttribute(r,b),x.fromBufferAttribute(r,M),d.sub(l),u.sub(l),p.sub(f),x.sub(f);const C=1/(p.x*x.y-x.x*p.y);isFinite(C)&&(_.copy(d).multiplyScalar(x.y).addScaledVector(u,-p.y).multiplyScalar(C),m.copy(u).multiplyScalar(p.x).addScaledVector(d,-x.x).multiplyScalar(C),o[R].add(_),o[b].add(_),o[M].add(_),c[R].add(m),c[b].add(m),c[M].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let R=0,b=v.length;R<b;++R){const M=v[R],C=M.start,D=M.count;for(let H=C,J=C+D;H<J;H+=3)h(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const S=new L,y=new L,E=new L,T=new L;function P(R){E.fromBufferAttribute(s,R),T.copy(E);const b=o[R];S.copy(b),S.sub(E.multiplyScalar(E.dot(b))).normalize(),y.crossVectors(T,b);const C=y.dot(c[R])<0?-1:1;a.setXYZW(R,S.x,S.y,S.z,C)}for(let R=0,b=v.length;R<b;++R){const M=v[R],C=M.start,D=M.count;for(let H=C,J=C+D;H<J;H+=3)P(e.getX(H+0)),P(e.getX(H+1)),P(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Bn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new L,r=new L,a=new L,o=new L,c=new L,l=new L,d=new L,u=new L;if(e)for(let f=0,p=e.count;f<p;f+=3){const x=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(n,x),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(d),c.add(d),l.add(d),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)jt.fromBufferAttribute(e,t),jt.normalize(),e.setXYZ(t,jt.x,jt.y,jt.z)}toNonIndexed(){function e(o,c){const l=o.array,d=o.itemSize,u=o.normalized,f=new l.constructor(c.length*d);let p=0,x=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?p=c[_]*o.data.stride+o.offset:p=c[_]*d;for(let h=0;h<d;h++)f[x++]=l[p++]}return new Bn(f,d,u)}if(this.index===null)return ot("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Wt,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,u=l.length;d<u;d++){const f=l[d],p=e(f,n);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,f=l.length;u<f;u++){const p=l[u];d.push(p.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(t))}const r=e.morphAttributes;for(const l in r){const d=[],u=r[l];for(let f=0,p=u.length;f<p;f++)d.push(u[f].clone(t));this.morphAttributes[l]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,d=a.length;l<d;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ol=new Dt,Ui=new yc,Pr=new Ds,cl=new L,Lr=new L,Dr=new L,Ir=new L,Wa=new L,Ur=new L,ll=new L,Nr=new L;class G extends Ht{constructor(e=new Wt,t=new Lt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Ur.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],u=r[c];d!==0&&(Wa.fromBufferAttribute(u,e),a?Ur.addScaledVector(Wa,d):Ur.addScaledVector(Wa.sub(t),d))}t.add(Ur)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Pr.copy(n.boundingSphere),Pr.applyMatrix4(r),Ui.copy(e.ray).recast(e.near),!(Pr.containsPoint(Ui.origin)===!1&&(Ui.intersectSphere(Pr,cl)===null||Ui.origin.distanceToSquared(cl)>(e.far-e.near)**2))&&(ol.copy(r).invert(),Ui.copy(e.ray).applyMatrix4(ol),!(n.boundingBox!==null&&Ui.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ui)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,_=f.length;x<_;x++){const m=f[x],h=a[m.materialIndex],v=Math.max(m.start,p.start),S=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let y=v,E=S;y<E;y+=3){const T=o.getX(y),P=o.getX(y+1),R=o.getX(y+2);s=Fr(this,h,e,n,l,d,u,T,P,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=x,h=_;m<h;m+=3){const v=o.getX(m),S=o.getX(m+1),y=o.getX(m+2);s=Fr(this,a,e,n,l,d,u,v,S,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let x=0,_=f.length;x<_;x++){const m=f[x],h=a[m.materialIndex],v=Math.max(m.start,p.start),S=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let y=v,E=S;y<E;y+=3){const T=y,P=y+1,R=y+2;s=Fr(this,h,e,n,l,d,u,T,P,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let m=x,h=_;m<h;m+=3){const v=m,S=m+1,y=m+2;s=Fr(this,a,e,n,l,d,u,v,S,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Gu(i,e,t,n,s,r,a,o){let c;if(e.side===an?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Ci,o),c===null)return null;Nr.copy(o),Nr.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Nr);return l<t.near||l>t.far?null:{distance:l,point:Nr.clone(),object:i}}function Fr(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,Lr),i.getVertexPosition(c,Dr),i.getVertexPosition(l,Ir);const d=Gu(i,e,t,n,Lr,Dr,Ir,ll);if(d){const u=new L;Nn.getBarycoord(ll,Lr,Dr,Ir,u),s&&(d.uv=Nn.getInterpolatedAttribute(s,o,c,l,u,new Ie)),r&&(d.uv1=Nn.getInterpolatedAttribute(r,o,c,l,u,new Ie)),a&&(d.normal=Nn.getInterpolatedAttribute(a,o,c,l,u,new L),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new L,materialIndex:0};Nn.getNormal(Lr,Dr,Ir,f.normal),d.face=f,d.barycoord=u}return d}class De extends Wt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],u=[];let f=0,p=0;x("z","y","x",-1,-1,n,t,e,a,r,0),x("z","y","x",1,-1,n,t,-e,a,r,1),x("x","z","y",1,1,e,n,t,s,a,2),x("x","z","y",1,-1,e,n,-t,s,a,3),x("x","y","z",1,-1,e,t,n,s,r,4),x("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new wt(l,3)),this.setAttribute("normal",new wt(d,3)),this.setAttribute("uv",new wt(u,2));function x(_,m,h,v,S,y,E,T,P,R,b){const M=y/P,C=E/R,D=y/2,H=E/2,J=T/2,j=P+1,te=R+1;let re=0,se=0;const xe=new L;for(let Me=0;Me<te;Me++){const ze=Me*C-H;for(let U=0;U<j;U++){const ye=U*M-D;xe[_]=ye*v,xe[m]=ze*S,xe[h]=J,l.push(xe.x,xe.y,xe.z),xe[_]=0,xe[m]=0,xe[h]=T>0?1:-1,d.push(xe.x,xe.y,xe.z),u.push(U/P),u.push(1-Me/R),re+=1}}for(let Me=0;Me<R;Me++)for(let ze=0;ze<P;ze++){const U=f+ze+j*Me,ye=f+ze+j*(Me+1),ve=f+(ze+1)+j*(Me+1),Se=f+(ze+1)+j*Me;c.push(U,ye,Se),c.push(ye,ve,Se),se+=6}o.addGroup(p,se,b),p+=se,f+=re}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new De(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Cs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(ot("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function dn(i){const e={};for(let t=0;t<i.length;t++){const n=Cs(i[t]);for(const s in n)e[s]=n[s]}return e}function Hu(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Fh(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Et.workingColorSpace}const lr={clone:Cs,merge:dn};var Wu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Xu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class rn extends ts{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Wu,this.fragmentShader=Xu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Cs(e.uniforms),this.uniformsGroups=Hu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Oh extends Ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Dt,this.projectionMatrix=new Dt,this.projectionMatrixInverse=new Dt,this.coordinateSystem=Yn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const vi=new L,hl=new Ie,dl=new Ie;class Sn extends Oh{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=cr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Js*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return cr*2*Math.atan(Math.tan(Js*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){vi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(vi.x,vi.y).multiplyScalar(-e/vi.z),vi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(vi.x,vi.y).multiplyScalar(-e/vi.z)}getViewSize(e,t){return this.getViewBounds(e,hl,dl),t.subVectors(dl,hl)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Js*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const fs=-90,ps=1;class Yu extends Ht{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Sn(fs,ps,e,t);s.layers=this.layers,this.add(s);const r=new Sn(fs,ps,e,t);r.layers=this.layers,this.add(r);const a=new Sn(fs,ps,e,t);a.layers=this.layers,this.add(a);const o=new Sn(fs,ps,e,t);o.layers=this.layers,this.add(o);const c=new Sn(fs,ps,e,t);c.layers=this.layers,this.add(c);const l=new Sn(fs,ps,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===Yn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===ra)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(u,f,p),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class Bh extends on{constructor(e=[],t=Ts,n,s,r,a,o,c,l,d){super(e,t,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class qu extends On{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Bh(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new De(5,5,5),r=new rn({name:"CubemapFromEquirect",uniforms:Cs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:an,blending:qn});r.uniforms.tEquirect.value=t;const a=new G(s,r),o=t.minFilter;return t.minFilter===Xi&&(t.minFilter=Cn),new Yu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class lt extends Ht{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Zu={type:"move"};class Xa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new lt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new lt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new lt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),h=this._getHandJoint(l,_);m!==null&&(h.matrix.fromArray(m.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=m.radius),h.visible=m!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=d.position.distanceTo(u.position),p=.02,x=.005;l.inputState.pinching&&f>p+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=p-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Zu)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new lt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class wc{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new tt(e),this.near=t,this.far=n}clone(){return new wc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class zh extends Ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new kn,this.environmentIntensity=1,this.environmentRotation=new kn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class kh extends on{constructor(e=null,t=1,n=1,s,r,a,o,c,l=bn,d=bn,u,f){super(null,a,o,c,l,d,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ul extends Bn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ms=new Dt,fl=new Dt,Or=[],pl=new es,$u=new Dt,Vs=new G,Gs=new Ds;class nn extends G{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ul(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,$u)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new es),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ms),pl.copy(e.boundingBox).applyMatrix4(ms),this.boundingBox.union(pl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ds),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ms),Gs.copy(e.boundingSphere).applyMatrix4(ms),this.boundingSphere.union(Gs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(Vs.geometry=this.geometry,Vs.material=this.material,Vs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Gs.copy(this.boundingSphere),Gs.applyMatrix4(n),e.ray.intersectsSphere(Gs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ms),fl.multiplyMatrices(n,ms),Vs.matrixWorld=fl,Vs.raycast(e,Or);for(let a=0,o=Or.length;a<o;a++){const c=Or[a];c.instanceId=r,c.object=this,t.push(c)}Or.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new ul(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new kh(new Float32Array(s*this.count),s,this.count,pc,Xn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ya=new L,Ku=new L,Ju=new pt;class Bi{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Ya.subVectors(n,t).cross(Ku.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Ya),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Ju.getNormalMatrix(e),s=this.coplanarPoint(Ya).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ni=new Ds,ju=new Ie(.5,.5),Br=new L;class Tc{constructor(e=new Bi,t=new Bi,n=new Bi,s=new Bi,r=new Bi,a=new Bi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Yn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],u=r[5],f=r[6],p=r[7],x=r[8],_=r[9],m=r[10],h=r[11],v=r[12],S=r[13],y=r[14],E=r[15];if(s[0].setComponents(l-a,p-d,h-x,E-v).normalize(),s[1].setComponents(l+a,p+d,h+x,E+v).normalize(),s[2].setComponents(l+o,p+u,h+_,E+S).normalize(),s[3].setComponents(l-o,p-u,h-_,E-S).normalize(),n)s[4].setComponents(c,f,m,y).normalize(),s[5].setComponents(l-c,p-f,h-m,E-y).normalize();else if(s[4].setComponents(l-c,p-f,h-m,E-y).normalize(),t===Yn)s[5].setComponents(l+c,p+f,h+m,E+y).normalize();else if(t===ra)s[5].setComponents(c,f,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ni.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ni.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ni)}intersectsSprite(e){Ni.center.set(0,0,0);const t=ju.distanceTo(e.center);return Ni.radius=.7071067811865476+t,Ni.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ni)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Br.x=s.normal.x>0?e.max.x:e.min.x,Br.y=s.normal.y>0?e.max.y:e.min.y,Br.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Br)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class jo extends ts{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new tt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const oa=new L,ca=new L,ml=new Dt,Hs=new yc,zr=new Ds,qa=new L,xl=new L;class gl extends Ht{constructor(e=new Wt,t=new jo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)oa.fromBufferAttribute(t,s-1),ca.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=oa.distanceTo(ca);e.setAttribute("lineDistance",new wt(n,1))}else ot("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),zr.copy(n.boundingSphere),zr.applyMatrix4(s),zr.radius+=r,e.ray.intersectsSphere(zr)===!1)return;ml.copy(s).invert(),Hs.copy(e.ray).applyMatrix4(ml);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,f=n.attributes.position;if(d!==null){const p=Math.max(0,a.start),x=Math.min(d.count,a.start+a.count);for(let _=p,m=x-1;_<m;_+=l){const h=d.getX(_),v=d.getX(_+1),S=kr(this,e,Hs,c,h,v,_);S&&t.push(S)}if(this.isLineLoop){const _=d.getX(x-1),m=d.getX(p),h=kr(this,e,Hs,c,_,m,x-1);h&&t.push(h)}}else{const p=Math.max(0,a.start),x=Math.min(f.count,a.start+a.count);for(let _=p,m=x-1;_<m;_+=l){const h=kr(this,e,Hs,c,_,_+1,_);h&&t.push(h)}if(this.isLineLoop){const _=kr(this,e,Hs,c,x-1,p,x-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function kr(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(oa.fromBufferAttribute(o,s),ca.fromBufferAttribute(o,r),t.distanceSqToSegment(oa,ca,qa,xl)>n)return;qa.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(qa);if(!(l<e.near||l>e.far))return{distance:l,point:xl.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class Jt extends on{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Vh extends on{constructor(e,t,n=Ki,s,r,a,o=bn,c=bn,l,d=rr,u=1){if(d!==rr&&d!==ar)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:u};super(f,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Sc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Gh extends on{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class fn extends Wt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new L,d=new Ie;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){const p=n+u/t*s;l.x=e*Math.cos(p),l.y=e*Math.sin(p),a.push(l.x,l.y,l.z),o.push(0,0,1),d.x=(a[f]/e+1)/2,d.y=(a[f+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new wt(a,3)),this.setAttribute("normal",new wt(o,3)),this.setAttribute("uv",new wt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ft extends Wt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],f=[],p=[];let x=0;const _=[],m=n/2;let h=0;v(),a===!1&&(e>0&&S(!0),t>0&&S(!1)),this.setIndex(d),this.setAttribute("position",new wt(u,3)),this.setAttribute("normal",new wt(f,3)),this.setAttribute("uv",new wt(p,2));function v(){const y=new L,E=new L;let T=0;const P=(t-e)/n;for(let R=0;R<=r;R++){const b=[],M=R/r,C=M*(t-e)+e;for(let D=0;D<=s;D++){const H=D/s,J=H*c+o,j=Math.sin(J),te=Math.cos(J);E.x=C*j,E.y=-M*n+m,E.z=C*te,u.push(E.x,E.y,E.z),y.set(j,P,te).normalize(),f.push(y.x,y.y,y.z),p.push(H,1-M),b.push(x++)}_.push(b)}for(let R=0;R<s;R++)for(let b=0;b<r;b++){const M=_[b][R],C=_[b+1][R],D=_[b+1][R+1],H=_[b][R+1];(e>0||b!==0)&&(d.push(M,C,H),T+=3),(t>0||b!==r-1)&&(d.push(C,D,H),T+=3)}l.addGroup(h,T,0),h+=T}function S(y){const E=x,T=new Ie,P=new L;let R=0;const b=y===!0?e:t,M=y===!0?1:-1;for(let D=1;D<=s;D++)u.push(0,m*M,0),f.push(0,M,0),p.push(.5,.5),x++;const C=x;for(let D=0;D<=s;D++){const J=D/s*c+o,j=Math.cos(J),te=Math.sin(J);P.x=b*te,P.y=m*M,P.z=b*j,u.push(P.x,P.y,P.z),f.push(0,M,0),T.x=j*.5+.5,T.y=te*.5*M+.5,p.push(T.x,T.y),x++}for(let D=0;D<s;D++){const H=E+D,J=C+D;y===!0?d.push(J,J+1,H):d.push(J+1,J,H),R+=3}l.addGroup(h,R,y===!0?1:2),h+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ft(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Zi extends ft{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Zi(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class pa extends Wt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),l(n),d(),this.setAttribute("position",new wt(r,3)),this.setAttribute("normal",new wt(r.slice(),3)),this.setAttribute("uv",new wt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const S=new L,y=new L,E=new L;for(let T=0;T<t.length;T+=3)p(t[T+0],S),p(t[T+1],y),p(t[T+2],E),c(S,y,E,v)}function c(v,S,y,E){const T=E+1,P=[];for(let R=0;R<=T;R++){P[R]=[];const b=v.clone().lerp(y,R/T),M=S.clone().lerp(y,R/T),C=T-R;for(let D=0;D<=C;D++)D===0&&R===T?P[R][D]=b:P[R][D]=b.clone().lerp(M,D/C)}for(let R=0;R<T;R++)for(let b=0;b<2*(T-R)-1;b++){const M=Math.floor(b/2);b%2===0?(f(P[R][M+1]),f(P[R+1][M]),f(P[R][M])):(f(P[R][M+1]),f(P[R+1][M+1]),f(P[R+1][M]))}}function l(v){const S=new L;for(let y=0;y<r.length;y+=3)S.x=r[y+0],S.y=r[y+1],S.z=r[y+2],S.normalize().multiplyScalar(v),r[y+0]=S.x,r[y+1]=S.y,r[y+2]=S.z}function d(){const v=new L;for(let S=0;S<r.length;S+=3){v.x=r[S+0],v.y=r[S+1],v.z=r[S+2];const y=m(v)/2/Math.PI+.5,E=h(v)/Math.PI+.5;a.push(y,1-E)}x(),u()}function u(){for(let v=0;v<a.length;v+=6){const S=a[v+0],y=a[v+2],E=a[v+4],T=Math.max(S,y,E),P=Math.min(S,y,E);T>.9&&P<.1&&(S<.2&&(a[v+0]+=1),y<.2&&(a[v+2]+=1),E<.2&&(a[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function p(v,S){const y=v*3;S.x=e[y+0],S.y=e[y+1],S.z=e[y+2]}function x(){const v=new L,S=new L,y=new L,E=new L,T=new Ie,P=new Ie,R=new Ie;for(let b=0,M=0;b<r.length;b+=9,M+=6){v.set(r[b+0],r[b+1],r[b+2]),S.set(r[b+3],r[b+4],r[b+5]),y.set(r[b+6],r[b+7],r[b+8]),T.set(a[M+0],a[M+1]),P.set(a[M+2],a[M+3]),R.set(a[M+4],a[M+5]),E.copy(v).add(S).add(y).divideScalar(3);const C=m(E);_(T,M+0,v,C),_(P,M+2,S,C),_(R,M+4,y,C)}}function _(v,S,y,E){E<0&&v.x===1&&(a[S]=v.x-1),y.x===0&&y.z===0&&(a[S]=E/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function h(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pa(e.vertices,e.indices,e.radius,e.details)}}class Ec extends pa{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ec(e.radius,e.detail)}}class Kn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){ot("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const d=n[s],f=n[s+1]-d,p=(a-d)/f;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new Ie:new L);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new L,s=[],r=[],a=[],o=new L,c=new Dt;for(let p=0;p<=e;p++){const x=p/e;s[p]=this.getTangentAt(x,new L)}r[0]=new L,a[0]=new L;let l=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const x=Math.acos(_t(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,x))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(_t(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let x=1;x<=e;x++)r[x].applyMatrix4(c.makeRotationAxis(s[x],p*x)),a[x].crossVectors(s[x],r[x])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Ac extends Kn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Ie){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,p=l-this.aY;c=f*d-p*u+this.aX,l=f*u+p*d+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Qu extends Ac{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Cc(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,d,u){let f=(a-r)/l-(o-r)/(l+d)+(o-a)/d,p=(o-a)/d-(c-a)/(d+u)+(c-o)/u;f*=d,p*=d,s(a,o,f,p)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const Vr=new L,Za=new Cc,$a=new Cc,Ka=new Cc;class ef extends Kn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new L){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,d;this.closed||o>0?l=s[(o-1)%r]:(Vr.subVectors(s[0],s[1]).add(s[0]),l=Vr);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(Vr.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=Vr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let x=Math.pow(l.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(d),p);_<1e-4&&(_=1),x<1e-4&&(x=_),m<1e-4&&(m=_),Za.initNonuniformCatmullRom(l.x,u.x,f.x,d.x,x,_,m),$a.initNonuniformCatmullRom(l.y,u.y,f.y,d.y,x,_,m),Ka.initNonuniformCatmullRom(l.z,u.z,f.z,d.z,x,_,m)}else this.curveType==="catmullrom"&&(Za.initCatmullRom(l.x,u.x,f.x,d.x,this.tension),$a.initCatmullRom(l.y,u.y,f.y,d.y,this.tension),Ka.initCatmullRom(l.z,u.z,f.z,d.z,this.tension));return n.set(Za.calc(c),$a.calc(c),Ka.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function _l(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function tf(i,e){const t=1-i;return t*t*e}function nf(i,e){return 2*(1-i)*i*e}function sf(i,e){return i*i*e}function Qs(i,e,t,n){return tf(i,e)+nf(i,t)+sf(i,n)}function rf(i,e){const t=1-i;return t*t*t*e}function af(i,e){const t=1-i;return 3*t*t*i*e}function of(i,e){return 3*(1-i)*i*i*e}function cf(i,e){return i*i*i*e}function er(i,e,t,n,s){return rf(i,e)+af(i,t)+of(i,n)+cf(i,s)}class Hh extends Kn{constructor(e=new Ie,t=new Ie,n=new Ie,s=new Ie){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Ie){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(er(e,s.x,r.x,a.x,o.x),er(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class lf extends Kn{constructor(e=new L,t=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new L){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(er(e,s.x,r.x,a.x,o.x),er(e,s.y,r.y,a.y,o.y),er(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Wh extends Kn{constructor(e=new Ie,t=new Ie){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ie){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ie){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hf extends Kn{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Xh extends Kn{constructor(e=new Ie,t=new Ie,n=new Ie){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Ie){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Qs(e,s.x,r.x,a.x),Qs(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class df extends Kn{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Qs(e,s.x,r.x,a.x),Qs(e,s.y,r.y,a.y),Qs(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Yh extends Kn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ie){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(_l(o,c.x,l.x,d.x,u.x),_l(o,c.y,l.y,d.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new Ie().fromArray(s))}return this}}var vl=Object.freeze({__proto__:null,ArcCurve:Qu,CatmullRomCurve3:ef,CubicBezierCurve:Hh,CubicBezierCurve3:lf,EllipseCurve:Ac,LineCurve:Wh,LineCurve3:hf,QuadraticBezierCurve:Xh,QuadraticBezierCurve3:df,SplineCurve:Yh});class uf extends Kn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new vl[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const d=c[l];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new vl[s.type]().fromJSON(s))}return this}}class Ml extends uf{constructor(e){super(),this.type="Path",this.currentPoint=new Ie,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Wh(this.currentPoint.clone(),new Ie(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new Xh(this.currentPoint.clone(),new Ie(e,t),new Ie(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new Hh(this.currentPoint.clone(),new Ie(e,t),new Ie(n,s),new Ie(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Yh(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+l,t+d,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){const l=new Ac(e,t,n,s,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Rc extends Ml{constructor(e){super(e),this.uuid=Qi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Ml().fromJSON(s))}return this}}function ff(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=qh(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=_f(i,e,r,t)),i.length>80*t){o=i[0],c=i[1];let d=o,u=c;for(let f=t;f<s;f+=t){const p=i[f],x=i[f+1];p<o&&(o=p),x<c&&(c=x),p>d&&(d=p),x>u&&(u=x)}l=Math.max(d-o,u-c),l=l!==0?32767/l:0}return hr(r,a,t,o,c,l,0),a}function qh(i,e,t,n,s){let r;if(s===Rf(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=Sl(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Sl(a/n|0,i[a],i[a+1],r);return r&&Rs(r,r.next)&&(ur(r),r=r.next),r}function Ji(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Rs(t,t.next)||Vt(t.prev,t,t.next)===0)){if(ur(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function hr(i,e,t,n,s,r,a){if(!i)return;!a&&r&&bf(i,n,s,r);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?mf(i,n,s,r):pf(i)){e.push(c.i,i.i,l.i),ur(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=xf(Ji(i),e),hr(i,e,t,n,s,r,2)):a===2&&gf(i,e,t,n,s,r):hr(Ji(i),e,t,n,s,r,1);break}}}function pf(i){const e=i.prev,t=i,n=i.next;if(Vt(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,d=Math.min(s,r,a),u=Math.min(o,c,l),f=Math.max(s,r,a),p=Math.max(o,c,l);let x=n.next;for(;x!==e;){if(x.x>=d&&x.x<=f&&x.y>=u&&x.y<=p&&qs(s,o,r,c,a,l,x.x,x.y)&&Vt(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function mf(i,e,t,n){const s=i.prev,r=i,a=i.next;if(Vt(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,d=s.y,u=r.y,f=a.y,p=Math.min(o,c,l),x=Math.min(d,u,f),_=Math.max(o,c,l),m=Math.max(d,u,f),h=Qo(p,x,e,t,n),v=Qo(_,m,e,t,n);let S=i.prevZ,y=i.nextZ;for(;S&&S.z>=h&&y&&y.z<=v;){if(S.x>=p&&S.x<=_&&S.y>=x&&S.y<=m&&S!==s&&S!==a&&qs(o,d,c,u,l,f,S.x,S.y)&&Vt(S.prev,S,S.next)>=0||(S=S.prevZ,y.x>=p&&y.x<=_&&y.y>=x&&y.y<=m&&y!==s&&y!==a&&qs(o,d,c,u,l,f,y.x,y.y)&&Vt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;S&&S.z>=h;){if(S.x>=p&&S.x<=_&&S.y>=x&&S.y<=m&&S!==s&&S!==a&&qs(o,d,c,u,l,f,S.x,S.y)&&Vt(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;y&&y.z<=v;){if(y.x>=p&&y.x<=_&&y.y>=x&&y.y<=m&&y!==s&&y!==a&&qs(o,d,c,u,l,f,y.x,y.y)&&Vt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function xf(i,e){let t=i;do{const n=t.prev,s=t.next.next;!Rs(n,s)&&$h(n,t,t.next,s)&&dr(n,s)&&dr(s,n)&&(e.push(n.i,t.i,s.i),ur(t),ur(t.next),t=i=s),t=t.next}while(t!==i);return Ji(t)}function gf(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Ef(a,o)){let c=Kh(a,o);a=Ji(a,a.next),c=Ji(c,c.next),hr(a,e,t,n,s,r,0),hr(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function _f(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=qh(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Tf(l))}s.sort(vf);for(let r=0;r<s.length;r++)t=Mf(s[r],t);return t}function vf(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Mf(i,e){const t=Sf(i,e);if(!t)return e;const n=Kh(t,i);return Ji(n,n.next),Ji(t,t.next)}function Sf(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(Rs(i,t))return t;do{if(Rs(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let d=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&Zh(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){const u=Math.abs(s-t.y)/(n-t.x);dr(t,i)&&(u<d||u===d&&(t.x>a.x||t.x===a.x&&yf(a,t)))&&(a=t,d=u)}t=t.next}while(t!==o);return a}function yf(i,e){return Vt(i.prev,i,e.prev)<0&&Vt(e.next,i,i.next)<0}function bf(i,e,t,n){let s=i;do s.z===0&&(s.z=Qo(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,wf(s)}function wf(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Qo(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Tf(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Zh(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function qs(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Zh(i,e,t,n,s,r,a,o)}function Ef(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Af(i,e)&&(dr(i,e)&&dr(e,i)&&Cf(i,e)&&(Vt(i.prev,i,e.prev)||Vt(i,e.prev,e))||Rs(i,e)&&Vt(i.prev,i,i.next)>0&&Vt(e.prev,e,e.next)>0)}function Vt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Rs(i,e){return i.x===e.x&&i.y===e.y}function $h(i,e,t,n){const s=Hr(Vt(i,e,t)),r=Hr(Vt(i,e,n)),a=Hr(Vt(t,n,i)),o=Hr(Vt(t,n,e));return!!(s!==r&&a!==o||s===0&&Gr(i,t,e)||r===0&&Gr(i,n,e)||a===0&&Gr(t,i,n)||o===0&&Gr(t,e,n))}function Gr(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Hr(i){return i>0?1:i<0?-1:0}function Af(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&$h(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function dr(i,e){return Vt(i.prev,i,i.next)<0?Vt(i,e,i.next)>=0&&Vt(i,i.prev,e)>=0:Vt(i,e,i.prev)<0||Vt(i,i.next,e)<0}function Cf(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Kh(i,e){const t=ec(i.i,i.x,i.y),n=ec(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Sl(i,e,t,n){const s=ec(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ur(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ec(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Rf(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Pf{static triangulate(e,t,n=2){return ff(e,t,n)}}class tr{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return tr.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];yl(e),bl(n,e);let a=e.length;t.forEach(yl);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,bl(n,t[c]);const o=Pf.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function yl(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function bl(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class ma extends pa{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ma(e.radius,e.detail)}}class Bt extends Wt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,u=e/o,f=t/c,p=[],x=[],_=[],m=[];for(let h=0;h<d;h++){const v=h*f-a;for(let S=0;S<l;S++){const y=S*u-r;x.push(y,-v,0),_.push(0,0,1),m.push(S/o),m.push(1-h/c)}}for(let h=0;h<c;h++)for(let v=0;v<o;v++){const S=v+l*h,y=v+l*(h+1),E=v+1+l*(h+1),T=v+1+l*h;p.push(S,y,T),p.push(y,E,T)}this.setIndex(p),this.setAttribute("position",new wt(x,3)),this.setAttribute("normal",new wt(_,3)),this.setAttribute("uv",new wt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bt(e.width,e.height,e.widthSegments,e.heightSegments)}}class xa extends Wt{constructor(e=new Rc([new Ie(0,.5),new Ie(-.5,-.5),new Ie(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],a=[];let o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let d=0;d<e.length;d++)l(e[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new wt(s,3)),this.setAttribute("normal",new wt(r,3)),this.setAttribute("uv",new wt(a,2));function l(d){const u=s.length/3,f=d.extractPoints(t);let p=f.shape;const x=f.holes;tr.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,h=x.length;m<h;m++){const v=x[m];tr.isClockWise(v)===!0&&(x[m]=v.reverse())}const _=tr.triangulateShape(p,x);for(let m=0,h=x.length;m<h;m++){const v=x[m];p=p.concat(v)}for(let m=0,h=p.length;m<h;m++){const v=p[m];s.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let m=0,h=_.length;m<h;m++){const v=_[m],S=v[0]+u,y=v[1]+u,E=v[2]+u;n.push(S,y,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Lf(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];n.push(a)}return new xa(n,e.curveSegments)}}function Lf(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class Xt extends Wt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const d=[],u=new L,f=new L,p=[],x=[],_=[],m=[];for(let h=0;h<=n;h++){const v=[],S=h/n;let y=0;h===0&&a===0?y=.5/t:h===n&&c===Math.PI&&(y=-.5/t);for(let E=0;E<=t;E++){const T=E/t;u.x=-e*Math.cos(s+T*r)*Math.sin(a+S*o),u.y=e*Math.cos(a+S*o),u.z=e*Math.sin(s+T*r)*Math.sin(a+S*o),x.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(T+y,1-S),v.push(l++)}d.push(v)}for(let h=0;h<n;h++)for(let v=0;v<t;v++){const S=d[h][v+1],y=d[h][v],E=d[h+1][v],T=d[h+1][v+1];(h!==0||a>0)&&p.push(S,y,T),(h!==n-1||c<Math.PI)&&p.push(y,E,T)}this.setIndex(p),this.setAttribute("position",new wt(x,3)),this.setAttribute("normal",new wt(_,3)),this.setAttribute("uv",new wt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class fr extends Wt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],d=new L,u=new L,f=new L;for(let p=0;p<=n;p++)for(let x=0;x<=s;x++){const _=x/s*r,m=p/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(_),u.y=(e+t*Math.cos(m))*Math.sin(_),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),d.x=e*Math.cos(_),d.y=e*Math.sin(_),f.subVectors(u,d).normalize(),c.push(f.x,f.y,f.z),l.push(x/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let x=1;x<=s;x++){const _=(s+1)*p+x-1,m=(s+1)*(p-1)+x-1,h=(s+1)*(p-1)+x,v=(s+1)*p+x;a.push(_,m,v),a.push(m,h,v)}this.setIndex(a),this.setAttribute("position",new wt(o,3)),this.setAttribute("normal",new wt(c,3)),this.setAttribute("uv",new wt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fr(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Df extends rn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class q extends ts{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new tt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=vc,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class If extends ts{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new tt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=vc,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=lc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Uf extends ts{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=jd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Nf extends ts{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Pc extends Ht{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new tt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Ff extends Pc{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ht.DEFAULT_UP),this.updateMatrix(),this.groundColor=new tt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ja=new Dt,wl=new L,Tl=new L;class Jh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ie(512,512),this.mapType=$n,this.map=null,this.mapPass=null,this.matrix=new Dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Tc,this._frameExtents=new Ie(1,1),this._viewportCount=1,this._viewports=[new Ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;wl.setFromMatrixPosition(e.matrixWorld),t.position.copy(wl),Tl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Tl),t.updateMatrixWorld(),Ja.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ja,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ja)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const El=new Dt,Ws=new L,ja=new L;class Of extends Jh{constructor(){super(new Sn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ie(4,2),this._viewportCount=6,this._viewports=[new Ft(2,1,1,1),new Ft(0,1,1,1),new Ft(3,1,1,1),new Ft(1,1,1,1),new Ft(3,0,1,1),new Ft(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ws.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ws),ja.copy(n.position),ja.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ja),n.updateMatrixWorld(),s.makeTranslation(-Ws.x,-Ws.y,-Ws.z),El.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(El,n.coordinateSystem,n.reversedDepth)}}class Lc extends Pc{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Of}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Dc extends Oh{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Bf extends Jh{constructor(){super(new Dc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Al extends Pc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ht.DEFAULT_UP),this.updateMatrix(),this.target=new Ht,this.shadow=new Bf}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class zf extends Sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class jh{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Cl=new Dt;class kf{constructor(e,t,n=0,s=1/0){this.ray=new yc(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new bc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Gt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Cl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Cl),this}intersectObject(e,t=!0,n=[]){return tc(e,this,n,t),n.sort(Rl),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)tc(e[s],this,n,t);return n.sort(Rl),n}}function Rl(i,e){return i.distance-e.distance}function tc(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)tc(r[a],e,t,!0)}}function Pl(i,e,t,n){const s=Vf(n);switch(t){case Ch:return i*e;case pc:return i*e/s.components*s.byteLength;case mc:return i*e/s.components*s.byteLength;case xc:return i*e*2/s.components*s.byteLength;case gc:return i*e*2/s.components*s.byteLength;case Rh:return i*e*3/s.components*s.byteLength;case Fn:return i*e*4/s.components*s.byteLength;case _c:return i*e*4/s.components*s.byteLength;case $r:case Kr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Jr:case jr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case To:case Ao:return Math.max(i,16)*Math.max(e,8)/4;case wo:case Eo:return Math.max(i,8)*Math.max(e,8)/2;case Co:case Ro:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Po:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Lo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Do:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Io:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Uo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case No:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Fo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Oo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Bo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case zo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ko:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Vo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Go:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ho:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Wo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Xo:case Yo:case qo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Zo:case $o:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ko:case Jo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Vf(i){switch(i){case $n:case wh:return{byteLength:1,components:1};case ir:case Th:case Zn:return{byteLength:2,components:1};case uc:case fc:return{byteLength:2,components:4};case Ki:case dc:case Xn:return{byteLength:4,components:1};case Eh:case Ah:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:cc}}));typeof window<"u"&&(window.__THREE__?ot("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=cc);function Qh(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Gf(i){const e=new WeakMap;function t(o,c){const l=o.array,d=o.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,d),o.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const d=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,d);else{u.sort((p,x)=>p.start-x.start);let f=0;for(let p=1;p<u.length;p++){const x=u[f],_=u[p];_.start<=x.start+x.count+1?x.count=Math.max(x.count,_.start+_.count-x.start):(++f,u[f]=_)}u.length=f+1;for(let p=0,x=u.length;p<x;p++){const _=u[p];i.bufferSubData(l,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var Hf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wf=`#ifdef USE_ALPHAHASH
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
#endif`,Xf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Yf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$f=`#ifdef USE_AOMAP
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
#endif`,Kf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Jf=`#ifdef USE_BATCHING
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
#endif`,jf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Qf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,e0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,t0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,n0=`#ifdef USE_IRIDESCENCE
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
#endif`,i0=`#ifdef USE_BUMPMAP
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
#endif`,s0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,r0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,a0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,o0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,c0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,l0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,h0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,d0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,u0=`#define PI 3.141592653589793
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
} // validated`,f0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,p0=`vec3 transformedNormal = objectNormal;
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
#endif`,m0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,x0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,g0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,v0="gl_FragColor = linearToOutputTexel( gl_FragColor );",M0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,S0=`#ifdef USE_ENVMAP
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
#endif`,y0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,b0=`#ifdef USE_ENVMAP
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
#endif`,w0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,T0=`#ifdef USE_ENVMAP
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
#endif`,E0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,A0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,C0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,R0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,P0=`#ifdef USE_GRADIENTMAP
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
}`,L0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,D0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,I0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,U0=`uniform bool receiveShadow;
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
#endif`,N0=`#ifdef USE_ENVMAP
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
#endif`,F0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,O0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,B0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,z0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,k0=`PhysicalMaterial material;
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
#endif`,V0=`uniform sampler2D dfgLUT;
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
}`,G0=`
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
#endif`,H0=`#if defined( RE_IndirectDiffuse )
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
#endif`,W0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,X0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Y0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,q0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Z0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,K0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,J0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,j0=`#if defined( USE_POINTS_UV )
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
#endif`,Q0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ep=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,tp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,np=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ip=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sp=`#ifdef USE_MORPHTARGETS
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
#endif`,rp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ap=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,op=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,dp=`#ifdef USE_NORMALMAP
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
#endif`,up=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,_p=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Mp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Sp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,yp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,wp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Tp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ep=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ap=`float getShadowMask() {
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
}`,Cp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rp=`#ifdef USE_SKINNING
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
#endif`,Pp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lp=`#ifdef USE_SKINNING
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
#endif`,Dp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ip=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Up=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Np=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fp=`#ifdef USE_TRANSMISSION
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
#endif`,Op=`#ifdef USE_TRANSMISSION
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
#endif`,Bp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,zp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Vp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Gp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Hp=`uniform sampler2D t2D;
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
}`,Wp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Yp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zp=`#include <common>
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
}`,$p=`#if DEPTH_PACKING == 3200
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
}`,Kp=`#define DISTANCE
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
}`,Jp=`#define DISTANCE
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
}`,jp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,em=`uniform float scale;
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
}`,tm=`uniform vec3 diffuse;
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
}`,nm=`#include <common>
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
}`,im=`uniform vec3 diffuse;
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
}`,sm=`#define LAMBERT
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
}`,rm=`#define LAMBERT
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
}`,am=`#define MATCAP
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
}`,om=`#define MATCAP
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
}`,cm=`#define NORMAL
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
}`,lm=`#define NORMAL
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
}`,hm=`#define PHONG
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
}`,dm=`#define PHONG
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
}`,um=`#define STANDARD
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
}`,fm=`#define STANDARD
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
}`,pm=`#define TOON
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
}`,mm=`#define TOON
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
}`,xm=`uniform float size;
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
}`,gm=`uniform vec3 diffuse;
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
}`,_m=`#include <common>
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
}`,vm=`uniform vec3 color;
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
}`,Mm=`uniform float rotation;
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
}`,Sm=`uniform vec3 diffuse;
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
}`,xt={alphahash_fragment:Hf,alphahash_pars_fragment:Wf,alphamap_fragment:Xf,alphamap_pars_fragment:Yf,alphatest_fragment:qf,alphatest_pars_fragment:Zf,aomap_fragment:$f,aomap_pars_fragment:Kf,batching_pars_vertex:Jf,batching_vertex:jf,begin_vertex:Qf,beginnormal_vertex:e0,bsdfs:t0,iridescence_fragment:n0,bumpmap_pars_fragment:i0,clipping_planes_fragment:s0,clipping_planes_pars_fragment:r0,clipping_planes_pars_vertex:a0,clipping_planes_vertex:o0,color_fragment:c0,color_pars_fragment:l0,color_pars_vertex:h0,color_vertex:d0,common:u0,cube_uv_reflection_fragment:f0,defaultnormal_vertex:p0,displacementmap_pars_vertex:m0,displacementmap_vertex:x0,emissivemap_fragment:g0,emissivemap_pars_fragment:_0,colorspace_fragment:v0,colorspace_pars_fragment:M0,envmap_fragment:S0,envmap_common_pars_fragment:y0,envmap_pars_fragment:b0,envmap_pars_vertex:w0,envmap_physical_pars_fragment:N0,envmap_vertex:T0,fog_vertex:E0,fog_pars_vertex:A0,fog_fragment:C0,fog_pars_fragment:R0,gradientmap_pars_fragment:P0,lightmap_pars_fragment:L0,lights_lambert_fragment:D0,lights_lambert_pars_fragment:I0,lights_pars_begin:U0,lights_toon_fragment:F0,lights_toon_pars_fragment:O0,lights_phong_fragment:B0,lights_phong_pars_fragment:z0,lights_physical_fragment:k0,lights_physical_pars_fragment:V0,lights_fragment_begin:G0,lights_fragment_maps:H0,lights_fragment_end:W0,logdepthbuf_fragment:X0,logdepthbuf_pars_fragment:Y0,logdepthbuf_pars_vertex:q0,logdepthbuf_vertex:Z0,map_fragment:$0,map_pars_fragment:K0,map_particle_fragment:J0,map_particle_pars_fragment:j0,metalnessmap_fragment:Q0,metalnessmap_pars_fragment:ep,morphinstance_vertex:tp,morphcolor_vertex:np,morphnormal_vertex:ip,morphtarget_pars_vertex:sp,morphtarget_vertex:rp,normal_fragment_begin:ap,normal_fragment_maps:op,normal_pars_fragment:cp,normal_pars_vertex:lp,normal_vertex:hp,normalmap_pars_fragment:dp,clearcoat_normal_fragment_begin:up,clearcoat_normal_fragment_maps:fp,clearcoat_pars_fragment:pp,iridescence_pars_fragment:mp,opaque_fragment:xp,packing:gp,premultiplied_alpha_fragment:_p,project_vertex:vp,dithering_fragment:Mp,dithering_pars_fragment:Sp,roughnessmap_fragment:yp,roughnessmap_pars_fragment:bp,shadowmap_pars_fragment:wp,shadowmap_pars_vertex:Tp,shadowmap_vertex:Ep,shadowmask_pars_fragment:Ap,skinbase_vertex:Cp,skinning_pars_vertex:Rp,skinning_vertex:Pp,skinnormal_vertex:Lp,specularmap_fragment:Dp,specularmap_pars_fragment:Ip,tonemapping_fragment:Up,tonemapping_pars_fragment:Np,transmission_fragment:Fp,transmission_pars_fragment:Op,uv_pars_fragment:Bp,uv_pars_vertex:zp,uv_vertex:kp,worldpos_vertex:Vp,background_vert:Gp,background_frag:Hp,backgroundCube_vert:Wp,backgroundCube_frag:Xp,cube_vert:Yp,cube_frag:qp,depth_vert:Zp,depth_frag:$p,distanceRGBA_vert:Kp,distanceRGBA_frag:Jp,equirect_vert:jp,equirect_frag:Qp,linedashed_vert:em,linedashed_frag:tm,meshbasic_vert:nm,meshbasic_frag:im,meshlambert_vert:sm,meshlambert_frag:rm,meshmatcap_vert:am,meshmatcap_frag:om,meshnormal_vert:cm,meshnormal_frag:lm,meshphong_vert:hm,meshphong_frag:dm,meshphysical_vert:um,meshphysical_frag:fm,meshtoon_vert:pm,meshtoon_frag:mm,points_vert:xm,points_frag:gm,shadow_vert:_m,shadow_frag:vm,sprite_vert:Mm,sprite_frag:Sm},Ue={common:{diffuse:{value:new tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new pt}},envmap:{envMap:{value:null},envMapRotation:{value:new pt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new pt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new pt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new pt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new pt},normalScale:{value:new Ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new pt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new pt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new pt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new pt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0},uvTransform:{value:new pt}},sprite:{diffuse:{value:new tt(16777215)},opacity:{value:1},center:{value:new Ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}}},Hn={basic:{uniforms:dn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:xt.meshbasic_vert,fragmentShader:xt.meshbasic_frag},lambert:{uniforms:dn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new tt(0)}}]),vertexShader:xt.meshlambert_vert,fragmentShader:xt.meshlambert_frag},phong:{uniforms:dn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new tt(0)},specular:{value:new tt(1118481)},shininess:{value:30}}]),vertexShader:xt.meshphong_vert,fragmentShader:xt.meshphong_frag},standard:{uniforms:dn([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:xt.meshphysical_vert,fragmentShader:xt.meshphysical_frag},toon:{uniforms:dn([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new tt(0)}}]),vertexShader:xt.meshtoon_vert,fragmentShader:xt.meshtoon_frag},matcap:{uniforms:dn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:xt.meshmatcap_vert,fragmentShader:xt.meshmatcap_frag},points:{uniforms:dn([Ue.points,Ue.fog]),vertexShader:xt.points_vert,fragmentShader:xt.points_frag},dashed:{uniforms:dn([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:xt.linedashed_vert,fragmentShader:xt.linedashed_frag},depth:{uniforms:dn([Ue.common,Ue.displacementmap]),vertexShader:xt.depth_vert,fragmentShader:xt.depth_frag},normal:{uniforms:dn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:xt.meshnormal_vert,fragmentShader:xt.meshnormal_frag},sprite:{uniforms:dn([Ue.sprite,Ue.fog]),vertexShader:xt.sprite_vert,fragmentShader:xt.sprite_frag},background:{uniforms:{uvTransform:{value:new pt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:xt.background_vert,fragmentShader:xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new pt}},vertexShader:xt.backgroundCube_vert,fragmentShader:xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:xt.cube_vert,fragmentShader:xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:xt.equirect_vert,fragmentShader:xt.equirect_frag},distanceRGBA:{uniforms:dn([Ue.common,Ue.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:xt.distanceRGBA_vert,fragmentShader:xt.distanceRGBA_frag},shadow:{uniforms:dn([Ue.lights,Ue.fog,{color:{value:new tt(0)},opacity:{value:1}}]),vertexShader:xt.shadow_vert,fragmentShader:xt.shadow_frag}};Hn.physical={uniforms:dn([Hn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new pt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new pt},clearcoatNormalScale:{value:new Ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new pt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new pt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new pt},sheen:{value:0},sheenColor:{value:new tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new pt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new pt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new pt},transmissionSamplerSize:{value:new Ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new pt},attenuationDistance:{value:0},attenuationColor:{value:new tt(0)},specularColor:{value:new tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new pt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new pt},anisotropyVector:{value:new Ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new pt}}]),vertexShader:xt.meshphysical_vert,fragmentShader:xt.meshphysical_frag};const Wr={r:0,b:0,g:0},Fi=new kn,ym=new Dt;function bm(i,e,t,n,s,r,a){const o=new tt(0);let c=r===!0?0:1,l,d,u=null,f=0,p=null;function x(S){let y=S.isScene===!0?S.background:null;return y&&y.isTexture&&(y=(S.backgroundBlurriness>0?t:e).get(y)),y}function _(S){let y=!1;const E=x(S);E===null?h(o,c):E&&E.isColor&&(h(E,1),y=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(S,y){const E=x(y);E&&(E.isCubeTexture||E.mapping===fa)?(d===void 0&&(d=new G(new De(1,1,1),new rn({name:"BackgroundCubeMaterial",uniforms:Cs(Hn.backgroundCube.uniforms),vertexShader:Hn.backgroundCube.vertexShader,fragmentShader:Hn.backgroundCube.fragmentShader,side:an,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,P,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Fi.copy(y.backgroundRotation),Fi.x*=-1,Fi.y*=-1,Fi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Fi.y*=-1,Fi.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(ym.makeRotationFromEuler(Fi)),d.material.toneMapped=Et.getTransfer(E.colorSpace)!==Nt,(u!==E||f!==E.version||p!==i.toneMapping)&&(d.material.needsUpdate=!0,u=E,f=E.version,p=i.toneMapping),d.layers.enableAll(),S.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new G(new Bt(2,2),new rn({name:"BackgroundMaterial",uniforms:Cs(Hn.background.uniforms),vertexShader:Hn.background.vertexShader,fragmentShader:Hn.background.fragmentShader,side:Ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=Et.getTransfer(E.colorSpace)!==Nt,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||f!==E.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=E,f=E.version,p=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function h(S,y){S.getRGB(Wr,Fh(i)),n.buffers.color.setClear(Wr.r,Wr.g,Wr.b,y,a)}function v(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,y=1){o.set(S),c=y,h(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,h(o,c)},render:_,addToRenderList:m,dispose:v}}function wm(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(M,C,D,H,J){let j=!1;const te=u(H,D,C);r!==te&&(r=te,l(r.object)),j=p(M,H,D,J),j&&x(M,H,D,J),J!==null&&e.update(J,i.ELEMENT_ARRAY_BUFFER),(j||a)&&(a=!1,y(M,C,D,H),J!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(J).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function d(M){return i.deleteVertexArray(M)}function u(M,C,D){const H=D.wireframe===!0;let J=n[M.id];J===void 0&&(J={},n[M.id]=J);let j=J[C.id];j===void 0&&(j={},J[C.id]=j);let te=j[H];return te===void 0&&(te=f(c()),j[H]=te),te}function f(M){const C=[],D=[],H=[];for(let J=0;J<t;J++)C[J]=0,D[J]=0,H[J]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:D,attributeDivisors:H,object:M,attributes:{},index:null}}function p(M,C,D,H){const J=r.attributes,j=C.attributes;let te=0;const re=D.getAttributes();for(const se in re)if(re[se].location>=0){const Me=J[se];let ze=j[se];if(ze===void 0&&(se==="instanceMatrix"&&M.instanceMatrix&&(ze=M.instanceMatrix),se==="instanceColor"&&M.instanceColor&&(ze=M.instanceColor)),Me===void 0||Me.attribute!==ze||ze&&Me.data!==ze.data)return!0;te++}return r.attributesNum!==te||r.index!==H}function x(M,C,D,H){const J={},j=C.attributes;let te=0;const re=D.getAttributes();for(const se in re)if(re[se].location>=0){let Me=j[se];Me===void 0&&(se==="instanceMatrix"&&M.instanceMatrix&&(Me=M.instanceMatrix),se==="instanceColor"&&M.instanceColor&&(Me=M.instanceColor));const ze={};ze.attribute=Me,Me&&Me.data&&(ze.data=Me.data),J[se]=ze,te++}r.attributes=J,r.attributesNum=te,r.index=H}function _(){const M=r.newAttributes;for(let C=0,D=M.length;C<D;C++)M[C]=0}function m(M){h(M,0)}function h(M,C){const D=r.newAttributes,H=r.enabledAttributes,J=r.attributeDivisors;D[M]=1,H[M]===0&&(i.enableVertexAttribArray(M),H[M]=1),J[M]!==C&&(i.vertexAttribDivisor(M,C),J[M]=C)}function v(){const M=r.newAttributes,C=r.enabledAttributes;for(let D=0,H=C.length;D<H;D++)C[D]!==M[D]&&(i.disableVertexAttribArray(D),C[D]=0)}function S(M,C,D,H,J,j,te){te===!0?i.vertexAttribIPointer(M,C,D,J,j):i.vertexAttribPointer(M,C,D,H,J,j)}function y(M,C,D,H){_();const J=H.attributes,j=D.getAttributes(),te=C.defaultAttributeValues;for(const re in j){const se=j[re];if(se.location>=0){let xe=J[re];if(xe===void 0&&(re==="instanceMatrix"&&M.instanceMatrix&&(xe=M.instanceMatrix),re==="instanceColor"&&M.instanceColor&&(xe=M.instanceColor)),xe!==void 0){const Me=xe.normalized,ze=xe.itemSize,U=e.get(xe);if(U===void 0)continue;const ye=U.buffer,ve=U.type,Se=U.bytesPerElement,Z=ve===i.INT||ve===i.UNSIGNED_INT||xe.gpuType===dc;if(xe.isInterleavedBufferAttribute){const $=xe.data,_e=$.stride,be=xe.offset;if($.isInstancedInterleavedBuffer){for(let Re=0;Re<se.locationSize;Re++)h(se.location+Re,$.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let Re=0;Re<se.locationSize;Re++)m(se.location+Re);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let Re=0;Re<se.locationSize;Re++)S(se.location+Re,ze/se.locationSize,ve,Me,_e*Se,(be+ze/se.locationSize*Re)*Se,Z)}else{if(xe.isInstancedBufferAttribute){for(let $=0;$<se.locationSize;$++)h(se.location+$,xe.meshPerAttribute);M.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=xe.meshPerAttribute*xe.count)}else for(let $=0;$<se.locationSize;$++)m(se.location+$);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let $=0;$<se.locationSize;$++)S(se.location+$,ze/se.locationSize,ve,Me,ze*Se,ze/se.locationSize*$*Se,Z)}}else if(te!==void 0){const Me=te[re];if(Me!==void 0)switch(Me.length){case 2:i.vertexAttrib2fv(se.location,Me);break;case 3:i.vertexAttrib3fv(se.location,Me);break;case 4:i.vertexAttrib4fv(se.location,Me);break;default:i.vertexAttrib1fv(se.location,Me)}}}}v()}function E(){R();for(const M in n){const C=n[M];for(const D in C){const H=C[D];for(const J in H)d(H[J].object),delete H[J];delete C[D]}delete n[M]}}function T(M){if(n[M.id]===void 0)return;const C=n[M.id];for(const D in C){const H=C[D];for(const J in H)d(H[J].object),delete H[J];delete C[D]}delete n[M.id]}function P(M){for(const C in n){const D=n[C];if(D[M.id]===void 0)continue;const H=D[M.id];for(const J in H)d(H[J].object),delete H[J];delete D[M.id]}}function R(){b(),a=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:b,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function Tm(i,e,t){let n;function s(l){n=l}function r(l,d){i.drawArrays(n,l,d),t.update(d,n,1)}function a(l,d,u){u!==0&&(i.drawArraysInstanced(n,l,d,u),t.update(d,n,u))}function o(l,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,u);let p=0;for(let x=0;x<u;x++)p+=d[x];t.update(p,n,1)}function c(l,d,u,f){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<l.length;x++)a(l[x],d[x],f[x]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,d,0,f,0,u);let x=0;for(let _=0;_<u;_++)x+=d[_]*f[_];t.update(x,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Em(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==Fn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const R=P===Zn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==$n&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Xn&&!R)}function c(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const d=c(l);d!==l&&(ot("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),h=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=x>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:x,maxTextureSize:_,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:v,maxVaryings:S,maxFragmentUniforms:y,vertexTextures:E,maxSamples:T}}function Am(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Bi,o=new pt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=d(u,f,0)},this.setState=function(u,f,p){const x=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,h=i.get(u);if(!s||x===null||x.length===0||r&&!m)r?d(null):l();else{const v=r?0:n,S=v*4;let y=h.clippingState||null;c.value=y,y=d(x,f,S,p);for(let E=0;E!==S;++E)y[E]=t[E];h.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(u,f,p,x){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,x!==!0||m===null){const h=p+_*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<h)&&(m=new Float32Array(h));for(let S=0,y=p;S!==_;++S,y+=4)a.copy(u[S]).applyMatrix4(v,o),a.normal.toArray(m,y),m[y+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Cm(i){let e=new WeakMap;function t(a,o){return o===So?a.mapping=Ts:o===yo&&(a.mapping=Es),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===So||o===yo)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new qu(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const wi=4,Ll=[.125,.215,.35,.446,.526,.582],Hi=20,Rm=256,Xs=new Dc,Dl=new tt;let Qa=null,eo=0,to=0,no=!1;const Pm=new L;class nc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Pm}=r;Qa=this._renderer.getRenderTarget(),eo=this._renderer.getActiveCubeFace(),to=this._renderer.getActiveMipmapLevel(),no=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Nl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ul(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Qa,eo,to),this._renderer.xr.enabled=no,e.scissorTest=!1,xs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ts||e.mapping===Es?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Qa=this._renderer.getRenderTarget(),eo=this._renderer.getActiveCubeFace(),to=this._renderer.getActiveMipmapLevel(),no=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Cn,minFilter:Cn,generateMipmaps:!1,type:Zn,format:Fn,colorSpace:As,depthBuffer:!1},s=Il(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Il(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Lm(r)),this._blurMaterial=Im(r,e,t),this._ggxMaterial=Dm(r,e,t)}return s}_compileMaterial(e){const t=new G(new Wt,e);this._renderer.compile(t,Xs)}_sceneToCubeUV(e,t,n,s,r){const c=new Sn(90,1,t,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(Dl),u.toneMapping=Ei,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new G(new De,new Lt({name:"PMREM.Background",side:an,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let h=!1;const v=e.background;v?v.isColor&&(m.color.copy(v),e.background=null,h=!0):(m.color.copy(Dl),h=!0);for(let S=0;S<6;S++){const y=S%3;y===0?(c.up.set(0,l[S],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[S],r.y,r.z)):y===1?(c.up.set(0,0,l[S]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[S],r.z)):(c.up.set(0,l[S],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[S]));const E=this._cubeSize;xs(s,y*E,S>2?E:0,E,E),u.setRenderTarget(s),h&&u.render(_,c),u.render(e,c)}u.toneMapping=p,u.autoClear=f,e.background=v}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Ts||e.mapping===Es;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Nl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ul());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;xs(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Xs)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),u=Math.sqrt(l*l-d*d),f=.05+l*.95,p=u*f,{_lodMax:x}=this,_=this._sizeLods[n],m=3*_*(n>x-wi?n-x+wi:0),h=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=p,c.mipInt.value=x-t,xs(r,m,h,3*_,2*_),s.setRenderTarget(r),s.render(o,Xs),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=x-n,xs(e,m,h,3*_,2*_),s.setRenderTarget(e),s.render(o,Xs)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Gt("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=l;const f=l.uniforms,p=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Hi-1),_=r/x,m=isFinite(r)?1+Math.floor(d*_):Hi;m>Hi&&ot(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Hi}`);const h=[];let v=0;for(let P=0;P<Hi;++P){const R=P/_,b=Math.exp(-R*R/2);h.push(b),P===0?v+=b:P<m&&(v+=2*b)}for(let P=0;P<h.length;P++)h[P]=h[P]/v;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=h,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:S}=this;f.dTheta.value=x,f.mipInt.value=S-n;const y=this._sizeLods[s],E=3*y*(s>S-wi?s-S+wi:0),T=4*(this._cubeSize-y);xs(t,E,T,3*y,2*y),c.setRenderTarget(t),c.render(u,Xs)}}function Lm(i){const e=[],t=[],n=[];let s=i;const r=i-wi+1+Ll.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-wi?c=Ll[a-i+wi-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),d=-l,u=1+l,f=[d,d,u,d,u,u,d,d,u,u,d,u],p=6,x=6,_=3,m=2,h=1,v=new Float32Array(_*x*p),S=new Float32Array(m*x*p),y=new Float32Array(h*x*p);for(let T=0;T<p;T++){const P=T%3*2/3-1,R=T>2?0:-1,b=[P,R,0,P+2/3,R,0,P+2/3,R+1,0,P,R,0,P+2/3,R+1,0,P,R+1,0];v.set(b,_*x*T),S.set(f,m*x*T);const M=[T,T,T,T,T,T];y.set(M,h*x*T)}const E=new Wt;E.setAttribute("position",new Bn(v,_)),E.setAttribute("uv",new Bn(S,m)),E.setAttribute("faceIndex",new Bn(y,h)),n.push(new G(E,null)),s>wi&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Il(i,e,t){const n=new On(i,e,t);return n.texture.mapping=fa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function xs(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Dm(i,e,t){return new rn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Rm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ga(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Im(i,e,t){const n=new Float32Array(Hi),s=new L(0,1,0);return new rn({name:"SphericalGaussianBlur",defines:{n:Hi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ga(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Ul(){return new rn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ga(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Nl(){return new rn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ga(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function ga(){return`

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
	`}function Um(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===So||c===yo,d=c===Ts||c===Es;if(l||d){let u=e.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new nc(i)),u=l?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return l&&p&&p.height>0||d&&p&&s(p)?(t===null&&(t=new nc(i)),u=l?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Nm(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&or("WebGLRenderer: "+n+" extension not supported."),s}}}function Fm(i,e,t,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const x in f.attributes)e.remove(f.attributes[x]);f.removeEventListener("dispose",a),delete s[f.id];const p=r.get(f);p&&(e.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(u){const f=u.attributes;for(const p in f)e.update(f[p],i.ARRAY_BUFFER)}function l(u){const f=[],p=u.index,x=u.attributes.position;let _=0;if(p!==null){const v=p.array;_=p.version;for(let S=0,y=v.length;S<y;S+=3){const E=v[S+0],T=v[S+1],P=v[S+2];f.push(E,T,T,P,P,E)}}else if(x!==void 0){const v=x.array;_=x.version;for(let S=0,y=v.length/3-1;S<y;S+=3){const E=S+0,T=S+1,P=S+2;f.push(E,T,T,P,P,E)}}else return;const m=new(Lh(f)?Nh:Uh)(f,1);m.version=_;const h=r.get(u);h&&e.remove(h),r.set(u,m)}function d(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function Om(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,p){i.drawElements(n,p,r,f*a),t.update(p,n,1)}function l(f,p,x){x!==0&&(i.drawElementsInstanced(n,p,r,f*a,x),t.update(p,n,x))}function d(f,p,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,x);let m=0;for(let h=0;h<x;h++)m+=p[h];t.update(m,n,1)}function u(f,p,x,_){if(x===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let h=0;h<f.length;h++)l(f[h]/a,p[h],_[h]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,_,0,x);let h=0;for(let v=0;v<x;v++)h+=p[v]*_[v];t.update(h,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function Bm(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Gt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function zm(i,e,t){const n=new WeakMap,s=new Ft;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let M=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",M)};var p=M;f!==void 0&&f.texture.dispose();const x=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let y=0;x===!0&&(y=1),_===!0&&(y=2),m===!0&&(y=3);let E=o.attributes.position.count*y,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const P=new Float32Array(E*T*4*u),R=new Dh(P,E,T,u);R.type=Xn,R.needsUpdate=!0;const b=y*4;for(let C=0;C<u;C++){const D=h[C],H=v[C],J=S[C],j=E*T*4*C;for(let te=0;te<D.count;te++){const re=te*b;x===!0&&(s.fromBufferAttribute(D,te),P[j+re+0]=s.x,P[j+re+1]=s.y,P[j+re+2]=s.z,P[j+re+3]=0),_===!0&&(s.fromBufferAttribute(H,te),P[j+re+4]=s.x,P[j+re+5]=s.y,P[j+re+6]=s.z,P[j+re+7]=0),m===!0&&(s.fromBufferAttribute(J,te),P[j+re+8]=s.x,P[j+re+9]=s.y,P[j+re+10]=s.z,P[j+re+11]=J.itemSize===4?s.w:1)}}f={count:u,texture:R,size:new Ie(E,T)},n.set(o,f),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let x=0;for(let m=0;m<l.length;m++)x+=l[m];const _=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function km(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,d=c.geometry,u=e.get(c,d);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}const ed=new on,Fl=new Vh(1,1),td=new Dh,nd=new Lu,id=new Bh,Ol=[],Bl=[],zl=new Float32Array(16),kl=new Float32Array(9),Vl=new Float32Array(4);function Is(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Ol[s];if(r===void 0&&(r=new Float32Array(s),Ol[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function $t(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Kt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function _a(i,e){let t=Bl[e];t===void 0&&(t=new Int32Array(e),Bl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Vm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Gm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2fv(this.addr,e),Kt(t,e)}}function Hm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if($t(t,e))return;i.uniform3fv(this.addr,e),Kt(t,e)}}function Wm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4fv(this.addr,e),Kt(t,e)}}function Xm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Kt(t,e)}else{if($t(t,n))return;Vl.set(n),i.uniformMatrix2fv(this.addr,!1,Vl),Kt(t,n)}}function Ym(i,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Kt(t,e)}else{if($t(t,n))return;kl.set(n),i.uniformMatrix3fv(this.addr,!1,kl),Kt(t,n)}}function qm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Kt(t,e)}else{if($t(t,n))return;zl.set(n),i.uniformMatrix4fv(this.addr,!1,zl),Kt(t,n)}}function Zm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function $m(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2iv(this.addr,e),Kt(t,e)}}function Km(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($t(t,e))return;i.uniform3iv(this.addr,e),Kt(t,e)}}function Jm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4iv(this.addr,e),Kt(t,e)}}function jm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Qm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2uiv(this.addr,e),Kt(t,e)}}function ex(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($t(t,e))return;i.uniform3uiv(this.addr,e),Kt(t,e)}}function tx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4uiv(this.addr,e),Kt(t,e)}}function nx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Fl.compareFunction=Ph,r=Fl):r=ed,t.setTexture2D(e||r,s)}function ix(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||nd,s)}function sx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||id,s)}function rx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||td,s)}function ax(i){switch(i){case 5126:return Vm;case 35664:return Gm;case 35665:return Hm;case 35666:return Wm;case 35674:return Xm;case 35675:return Ym;case 35676:return qm;case 5124:case 35670:return Zm;case 35667:case 35671:return $m;case 35668:case 35672:return Km;case 35669:case 35673:return Jm;case 5125:return jm;case 36294:return Qm;case 36295:return ex;case 36296:return tx;case 35678:case 36198:case 36298:case 36306:case 35682:return nx;case 35679:case 36299:case 36307:return ix;case 35680:case 36300:case 36308:case 36293:return sx;case 36289:case 36303:case 36311:case 36292:return rx}}function ox(i,e){i.uniform1fv(this.addr,e)}function cx(i,e){const t=Is(e,this.size,2);i.uniform2fv(this.addr,t)}function lx(i,e){const t=Is(e,this.size,3);i.uniform3fv(this.addr,t)}function hx(i,e){const t=Is(e,this.size,4);i.uniform4fv(this.addr,t)}function dx(i,e){const t=Is(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function ux(i,e){const t=Is(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function fx(i,e){const t=Is(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function px(i,e){i.uniform1iv(this.addr,e)}function mx(i,e){i.uniform2iv(this.addr,e)}function xx(i,e){i.uniform3iv(this.addr,e)}function gx(i,e){i.uniform4iv(this.addr,e)}function _x(i,e){i.uniform1uiv(this.addr,e)}function vx(i,e){i.uniform2uiv(this.addr,e)}function Mx(i,e){i.uniform3uiv(this.addr,e)}function Sx(i,e){i.uniform4uiv(this.addr,e)}function yx(i,e,t){const n=this.cache,s=e.length,r=_a(t,s);$t(n,r)||(i.uniform1iv(this.addr,r),Kt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||ed,r[a])}function bx(i,e,t){const n=this.cache,s=e.length,r=_a(t,s);$t(n,r)||(i.uniform1iv(this.addr,r),Kt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||nd,r[a])}function wx(i,e,t){const n=this.cache,s=e.length,r=_a(t,s);$t(n,r)||(i.uniform1iv(this.addr,r),Kt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||id,r[a])}function Tx(i,e,t){const n=this.cache,s=e.length,r=_a(t,s);$t(n,r)||(i.uniform1iv(this.addr,r),Kt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||td,r[a])}function Ex(i){switch(i){case 5126:return ox;case 35664:return cx;case 35665:return lx;case 35666:return hx;case 35674:return dx;case 35675:return ux;case 35676:return fx;case 5124:case 35670:return px;case 35667:case 35671:return mx;case 35668:case 35672:return xx;case 35669:case 35673:return gx;case 5125:return _x;case 36294:return vx;case 36295:return Mx;case 36296:return Sx;case 35678:case 36198:case 36298:case 36306:case 35682:return yx;case 35679:case 36299:case 36307:return bx;case 35680:case 36300:case 36308:case 36293:return wx;case 36289:case 36303:case 36311:case 36292:return Tx}}class Ax{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=ax(t.type)}}class Cx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ex(t.type)}}class Rx{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const io=/(\w+)(\])?(\[|\.)?/g;function Gl(i,e){i.seq.push(e),i.map[e.id]=e}function Px(i,e,t){const n=i.name,s=n.length;for(io.lastIndex=0;;){const r=io.exec(n),a=io.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Gl(t,l===void 0?new Ax(o,i,e):new Cx(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Rx(o),Gl(t,u)),t=u}}}class Qr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Px(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Hl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Lx=37297;let Dx=0;function Ix(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Wl=new pt;function Ux(i){Et._getMatrix(Wl,Et.workingColorSpace,i);const e=`mat3( ${Wl.elements.map(t=>t.toFixed(4))} )`;switch(Et.getTransfer(i)){case sa:return[e,"LinearTransferOETF"];case Nt:return[e,"sRGBTransferOETF"];default:return ot("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Xl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Ix(i.getShaderSource(e),o)}else return r}function Nx(i,e){const t=Ux(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Fx(i,e){let t;switch(e){case gh:t="Linear";break;case _h:t="Reinhard";break;case vh:t="Cineon";break;case hc:t="ACESFilmic";break;case Sh:t="AgX";break;case yh:t="Neutral";break;case Mh:t="Custom";break;default:ot("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Xr=new L;function Ox(){Et.getLuminanceCoefficients(Xr);const i=Xr.x.toFixed(4),e=Xr.y.toFixed(4),t=Xr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Bx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Zs).join(`
`)}function zx(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function kx(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Zs(i){return i!==""}function Yl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ql(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Vx=/^[ \t]*#include +<([\w\d./]+)>/gm;function ic(i){return i.replace(Vx,Hx)}const Gx=new Map;function Hx(i,e){let t=xt[e];if(t===void 0){const n=Gx.get(e);if(n!==void 0)t=xt[n],ot('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return ic(t)}const Wx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Zl(i){return i.replace(Wx,Xx)}function Xx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function $l(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Yx(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===mh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===xh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ri&&(e="SHADOWMAP_TYPE_VSM"),e}function qx(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ts:case Es:e="ENVMAP_TYPE_CUBE";break;case fa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Zx(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Es&&(e="ENVMAP_MODE_REFRACTION"),e}function $x(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case lc:e="ENVMAP_BLENDING_MULTIPLY";break;case $d:e="ENVMAP_BLENDING_MIX";break;case Kd:e="ENVMAP_BLENDING_ADD";break}return e}function Kx(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Jx(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=Yx(t),l=qx(t),d=Zx(t),u=$x(t),f=Kx(t),p=Bx(t),x=zx(r),_=s.createProgram();let m,h,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Zs).join(`
`),m.length>0&&(m+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Zs).join(`
`),h.length>0&&(h+=`
`)):(m=[$l(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zs).join(`
`),h=[$l(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ei?"#define TONE_MAPPING":"",t.toneMapping!==Ei?xt.tonemapping_pars_fragment:"",t.toneMapping!==Ei?Fx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",xt.colorspace_pars_fragment,Nx("linearToOutputTexel",t.outputColorSpace),Ox(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Zs).join(`
`)),a=ic(a),a=Yl(a,t),a=ql(a,t),o=ic(o),o=Yl(o,t),o=ql(o,t),a=Zl(a),o=Zl(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,h=["#define varying in",t.glslVersion===Yc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Yc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const S=v+m+a,y=v+h+o,E=Hl(s,s.VERTEX_SHADER,S),T=Hl(s,s.FRAGMENT_SHADER,y);s.attachShader(_,E),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function P(C){if(i.debug.checkShaderErrors){const D=s.getProgramInfoLog(_)||"",H=s.getShaderInfoLog(E)||"",J=s.getShaderInfoLog(T)||"",j=D.trim(),te=H.trim(),re=J.trim();let se=!0,xe=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(se=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,E,T);else{const Me=Xl(s,E,"vertex"),ze=Xl(s,T,"fragment");Gt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+j+`
`+Me+`
`+ze)}else j!==""?ot("WebGLProgram: Program Info Log:",j):(te===""||re==="")&&(xe=!1);xe&&(C.diagnostics={runnable:se,programLog:j,vertexShader:{log:te,prefix:m},fragmentShader:{log:re,prefix:h}})}s.deleteShader(E),s.deleteShader(T),R=new Qr(s,_),b=kx(s,_)}let R;this.getUniforms=function(){return R===void 0&&P(this),R};let b;this.getAttributes=function(){return b===void 0&&P(this),b};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(_,Lx)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Dx++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=T,this}let jx=0;class Qx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new eg(e),t.set(e,n)),n}}class eg{constructor(e){this.id=jx++,this.code=e,this.usedTimes=0}}function tg(i,e,t,n,s,r,a){const o=new bc,c=new Qx,l=new Set,d=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,M,C,D,H){const J=D.fog,j=H.geometry,te=b.isMeshStandardMaterial?D.environment:null,re=(b.isMeshStandardMaterial?t:e).get(b.envMap||te),se=re&&re.mapping===fa?re.image.height:null,xe=x[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&ot("WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));const Me=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ze=Me!==void 0?Me.length:0;let U=0;j.morphAttributes.position!==void 0&&(U=1),j.morphAttributes.normal!==void 0&&(U=2),j.morphAttributes.color!==void 0&&(U=3);let ye,ve,Se,Z;if(xe){const Ut=Hn[xe];ye=Ut.vertexShader,ve=Ut.fragmentShader}else ye=b.vertexShader,ve=b.fragmentShader,c.update(b),Se=c.getVertexShaderID(b),Z=c.getFragmentShaderID(b);const $=i.getRenderTarget(),_e=i.state.buffers.depth.getReversed(),be=H.isInstancedMesh===!0,Re=H.isBatchedMesh===!0,Ye=!!b.map,Rt=!!b.matcap,Ze=!!re,Tt=!!b.aoMap,z=!!b.lightMap,ut=!!b.bumpMap,ct=!!b.normalMap,At=!!b.displacementMap,Ve=!!b.emissiveMap,It=!!b.metalnessMap,$e=!!b.roughnessMap,rt=b.anisotropy>0,I=b.clearcoat>0,A=b.dispersion>0,K=b.iridescence>0,oe=b.sheen>0,de=b.transmission>0,ie=rt&&!!b.anisotropyMap,ke=I&&!!b.clearcoatMap,Ce=I&&!!b.clearcoatNormalMap,Je=I&&!!b.clearcoatRoughnessMap,He=K&&!!b.iridescenceMap,fe=K&&!!b.iridescenceThicknessMap,we=oe&&!!b.sheenColorMap,Qe=oe&&!!b.sheenRoughnessMap,je=!!b.specularMap,Oe=!!b.specularColorMap,it=!!b.specularIntensityMap,k=de&&!!b.transmissionMap,Pe=de&&!!b.thicknessMap,Te=!!b.gradientMap,Ee=!!b.alphaMap,pe=b.alphaTest>0,le=!!b.alphaHash,Be=!!b.extensions;let nt=Ei;b.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(nt=i.toneMapping);const yt={shaderID:xe,shaderType:b.type,shaderName:b.name,vertexShader:ye,fragmentShader:ve,defines:b.defines,customVertexShaderID:Se,customFragmentShaderID:Z,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:Re,batchingColor:Re&&H._colorsTexture!==null,instancing:be,instancingColor:be&&H.instanceColor!==null,instancingMorph:be&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:$===null?i.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:As,alphaToCoverage:!!b.alphaToCoverage,map:Ye,matcap:Rt,envMap:Ze,envMapMode:Ze&&re.mapping,envMapCubeUVHeight:se,aoMap:Tt,lightMap:z,bumpMap:ut,normalMap:ct,displacementMap:f&&At,emissiveMap:Ve,normalMapObjectSpace:ct&&b.normalMapType===eu,normalMapTangentSpace:ct&&b.normalMapType===vc,metalnessMap:It,roughnessMap:$e,anisotropy:rt,anisotropyMap:ie,clearcoat:I,clearcoatMap:ke,clearcoatNormalMap:Ce,clearcoatRoughnessMap:Je,dispersion:A,iridescence:K,iridescenceMap:He,iridescenceThicknessMap:fe,sheen:oe,sheenColorMap:we,sheenRoughnessMap:Qe,specularMap:je,specularColorMap:Oe,specularIntensityMap:it,transmission:de,transmissionMap:k,thicknessMap:Pe,gradientMap:Te,opaque:b.transparent===!1&&b.blending===Ms&&b.alphaToCoverage===!1,alphaMap:Ee,alphaTest:pe,alphaHash:le,combine:b.combine,mapUv:Ye&&_(b.map.channel),aoMapUv:Tt&&_(b.aoMap.channel),lightMapUv:z&&_(b.lightMap.channel),bumpMapUv:ut&&_(b.bumpMap.channel),normalMapUv:ct&&_(b.normalMap.channel),displacementMapUv:At&&_(b.displacementMap.channel),emissiveMapUv:Ve&&_(b.emissiveMap.channel),metalnessMapUv:It&&_(b.metalnessMap.channel),roughnessMapUv:$e&&_(b.roughnessMap.channel),anisotropyMapUv:ie&&_(b.anisotropyMap.channel),clearcoatMapUv:ke&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Ce&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Je&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:He&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:fe&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:we&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Qe&&_(b.sheenRoughnessMap.channel),specularMapUv:je&&_(b.specularMap.channel),specularColorMapUv:Oe&&_(b.specularColorMap.channel),specularIntensityMapUv:it&&_(b.specularIntensityMap.channel),transmissionMapUv:k&&_(b.transmissionMap.channel),thicknessMapUv:Pe&&_(b.thicknessMap.channel),alphaMapUv:Ee&&_(b.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(ct||rt),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!j.attributes.uv&&(Ye||Ee),fog:!!J,useFog:b.fog===!0,fogExp2:!!J&&J.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:_e,skinning:H.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:ze,morphTextureStride:U,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:nt,decodeVideoTexture:Ye&&b.map.isVideoTexture===!0&&Et.getTransfer(b.map.colorSpace)===Nt,decodeVideoTextureEmissive:Ve&&b.emissiveMap.isVideoTexture===!0&&Et.getTransfer(b.emissiveMap.colorSpace)===Nt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===gt,flipSided:b.side===an,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Be&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Be&&b.extensions.multiDraw===!0||Re)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return yt.vertexUv1s=l.has(1),yt.vertexUv2s=l.has(2),yt.vertexUv3s=l.has(3),l.clear(),yt}function h(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const C in b.defines)M.push(C),M.push(b.defines[C]);return b.isRawShaderMaterial===!1&&(v(M,b),S(M,b),M.push(i.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function v(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function S(b,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),b.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),b.push(o.mask)}function y(b){const M=x[b.type];let C;if(M){const D=Hn[M];C=lr.clone(D.uniforms)}else C=b.uniforms;return C}function E(b,M){let C;for(let D=0,H=d.length;D<H;D++){const J=d[D];if(J.cacheKey===M){C=J,++C.usedTimes;break}}return C===void 0&&(C=new Jx(i,M,b,r),d.push(C)),C}function T(b){if(--b.usedTimes===0){const M=d.indexOf(b);d[M]=d[d.length-1],d.pop(),b.destroy()}}function P(b){c.remove(b)}function R(){c.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:y,acquireProgram:E,releaseProgram:T,releaseShaderCache:P,programs:d,dispose:R}}function ng(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function ig(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Kl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Jl(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,f,p,x,_,m){let h=i[e];return h===void 0?(h={id:u.id,object:u,geometry:f,material:p,groupOrder:x,renderOrder:u.renderOrder,z:_,group:m},i[e]=h):(h.id=u.id,h.object=u,h.geometry=f,h.material=p,h.groupOrder=x,h.renderOrder=u.renderOrder,h.z=_,h.group=m),e++,h}function o(u,f,p,x,_,m){const h=a(u,f,p,x,_,m);p.transmission>0?n.push(h):p.transparent===!0?s.push(h):t.push(h)}function c(u,f,p,x,_,m){const h=a(u,f,p,x,_,m);p.transmission>0?n.unshift(h):p.transparent===!0?s.unshift(h):t.unshift(h)}function l(u,f){t.length>1&&t.sort(u||ig),n.length>1&&n.sort(f||Kl),s.length>1&&s.sort(f||Kl)}function d(){for(let u=e,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:d,sort:l}}function sg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new Jl,i.set(n,[a])):s>=r.length?(a=new Jl,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function rg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new tt};break;case"SpotLight":t={position:new L,direction:new L,color:new tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new tt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new tt,groundColor:new tt};break;case"RectAreaLight":t={color:new tt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function ag(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let og=0;function cg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function lg(i){const e=new rg,t=ag(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new L);const s=new L,r=new Dt,a=new Dt;function o(l){let d=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let p=0,x=0,_=0,m=0,h=0,v=0,S=0,y=0,E=0,T=0,P=0;l.sort(cg);for(let b=0,M=l.length;b<M;b++){const C=l[b],D=C.color,H=C.intensity,J=C.distance,j=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)d+=D.r*H,u+=D.g*H,f+=D.b*H;else if(C.isLightProbe){for(let te=0;te<9;te++)n.probe[te].addScaledVector(C.sh.coefficients[te],H);P++}else if(C.isDirectionalLight){const te=e.get(C);if(te.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const re=C.shadow,se=t.get(C);se.shadowIntensity=re.intensity,se.shadowBias=re.bias,se.shadowNormalBias=re.normalBias,se.shadowRadius=re.radius,se.shadowMapSize=re.mapSize,n.directionalShadow[p]=se,n.directionalShadowMap[p]=j,n.directionalShadowMatrix[p]=C.shadow.matrix,v++}n.directional[p]=te,p++}else if(C.isSpotLight){const te=e.get(C);te.position.setFromMatrixPosition(C.matrixWorld),te.color.copy(D).multiplyScalar(H),te.distance=J,te.coneCos=Math.cos(C.angle),te.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),te.decay=C.decay,n.spot[_]=te;const re=C.shadow;if(C.map&&(n.spotLightMap[E]=C.map,E++,re.updateMatrices(C),C.castShadow&&T++),n.spotLightMatrix[_]=re.matrix,C.castShadow){const se=t.get(C);se.shadowIntensity=re.intensity,se.shadowBias=re.bias,se.shadowNormalBias=re.normalBias,se.shadowRadius=re.radius,se.shadowMapSize=re.mapSize,n.spotShadow[_]=se,n.spotShadowMap[_]=j,y++}_++}else if(C.isRectAreaLight){const te=e.get(C);te.color.copy(D).multiplyScalar(H),te.halfWidth.set(C.width*.5,0,0),te.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=te,m++}else if(C.isPointLight){const te=e.get(C);if(te.color.copy(C.color).multiplyScalar(C.intensity),te.distance=C.distance,te.decay=C.decay,C.castShadow){const re=C.shadow,se=t.get(C);se.shadowIntensity=re.intensity,se.shadowBias=re.bias,se.shadowNormalBias=re.normalBias,se.shadowRadius=re.radius,se.shadowMapSize=re.mapSize,se.shadowCameraNear=re.camera.near,se.shadowCameraFar=re.camera.far,n.pointShadow[x]=se,n.pointShadowMap[x]=j,n.pointShadowMatrix[x]=C.shadow.matrix,S++}n.point[x]=te,x++}else if(C.isHemisphereLight){const te=e.get(C);te.skyColor.copy(C.color).multiplyScalar(H),te.groundColor.copy(C.groundColor).multiplyScalar(H),n.hemi[h]=te,h++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ue.LTC_FLOAT_1,n.rectAreaLTC2=Ue.LTC_FLOAT_2):(n.rectAreaLTC1=Ue.LTC_HALF_1,n.rectAreaLTC2=Ue.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=f;const R=n.hash;(R.directionalLength!==p||R.pointLength!==x||R.spotLength!==_||R.rectAreaLength!==m||R.hemiLength!==h||R.numDirectionalShadows!==v||R.numPointShadows!==S||R.numSpotShadows!==y||R.numSpotMaps!==E||R.numLightProbes!==P)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=x,n.hemi.length=h,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=y+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=P,R.directionalLength=p,R.pointLength=x,R.spotLength=_,R.rectAreaLength=m,R.hemiLength=h,R.numDirectionalShadows=v,R.numPointShadows=S,R.numSpotShadows=y,R.numSpotMaps=E,R.numLightProbes=P,n.version=og++)}function c(l,d){let u=0,f=0,p=0,x=0,_=0;const m=d.matrixWorldInverse;for(let h=0,v=l.length;h<v;h++){const S=l[h];if(S.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(S.isSpotLight){const y=n.spot[p];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),p++}else if(S.isRectAreaLight){const y=n.rectArea[x];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(S.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(S.width*.5,0,0),y.halfHeight.set(0,S.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),x++}else if(S.isPointLight){const y=n.point[f];y.position.setFromMatrixPosition(S.matrixWorld),y.position.applyMatrix4(m),f++}else if(S.isHemisphereLight){const y=n.hemi[_];y.direction.setFromMatrixPosition(S.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function jl(i){const e=new lg(i),t=[],n=[];function s(d){l.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function hg(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new jl(i),e.set(s,[o])):r>=a.length?(o=new jl(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const dg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ug=`uniform sampler2D shadow_pass;
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
}`;function fg(i,e,t){let n=new Tc;const s=new Ie,r=new Ie,a=new Ft,o=new Uf({depthPacking:Qd}),c=new Nf,l={},d=t.maxTextureSize,u={[Ci]:an,[an]:Ci,[gt]:gt},f=new rn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ie},radius:{value:4}},vertexShader:dg,fragmentShader:ug}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const x=new Wt;x.setAttribute("position",new Bn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new G(x,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mh;let h=this.type;this.render=function(T,P,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const b=i.getRenderTarget(),M=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),D=i.state;D.setBlending(qn),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const H=h!==ri&&this.type===ri,J=h===ri&&this.type!==ri;for(let j=0,te=T.length;j<te;j++){const re=T[j],se=re.shadow;if(se===void 0){ot("WebGLShadowMap:",re,"has no shadow.");continue}if(se.autoUpdate===!1&&se.needsUpdate===!1)continue;s.copy(se.mapSize);const xe=se.getFrameExtents();if(s.multiply(xe),r.copy(se.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/xe.x),s.x=r.x*xe.x,se.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/xe.y),s.y=r.y*xe.y,se.mapSize.y=r.y)),se.map===null||H===!0||J===!0){const ze=this.type!==ri?{minFilter:bn,magFilter:bn}:{};se.map!==null&&se.map.dispose(),se.map=new On(s.x,s.y,ze),se.map.texture.name=re.name+".shadowMap",se.camera.updateProjectionMatrix()}i.setRenderTarget(se.map),i.clear();const Me=se.getViewportCount();for(let ze=0;ze<Me;ze++){const U=se.getViewport(ze);a.set(r.x*U.x,r.y*U.y,r.x*U.z,r.y*U.w),D.viewport(a),se.updateMatrices(re,ze),n=se.getFrustum(),y(P,R,se.camera,re,this.type)}se.isPointLightShadow!==!0&&this.type===ri&&v(se,R),se.needsUpdate=!1}h=this.type,m.needsUpdate=!1,i.setRenderTarget(b,M,C)};function v(T,P){const R=e.update(_);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new On(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(P,null,R,f,_,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(P,null,R,p,_,null)}function S(T,P,R,b){let M=null;const C=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(C!==void 0)M=C;else if(M=R.isPointLight===!0?c:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const D=M.uuid,H=P.uuid;let J=l[D];J===void 0&&(J={},l[D]=J);let j=J[H];j===void 0&&(j=M.clone(),J[H]=j,P.addEventListener("dispose",E)),M=j}if(M.visible=P.visible,M.wireframe=P.wireframe,b===ri?M.side=P.shadowSide!==null?P.shadowSide:P.side:M.side=P.shadowSide!==null?P.shadowSide:u[P.side],M.alphaMap=P.alphaMap,M.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,M.map=P.map,M.clipShadows=P.clipShadows,M.clippingPlanes=P.clippingPlanes,M.clipIntersection=P.clipIntersection,M.displacementMap=P.displacementMap,M.displacementScale=P.displacementScale,M.displacementBias=P.displacementBias,M.wireframeLinewidth=P.wireframeLinewidth,M.linewidth=P.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const D=i.properties.get(M);D.light=R}return M}function y(T,P,R,b,M){if(T.visible===!1)return;if(T.layers.test(P.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&M===ri)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const H=e.update(T),J=T.material;if(Array.isArray(J)){const j=H.groups;for(let te=0,re=j.length;te<re;te++){const se=j[te],xe=J[se.materialIndex];if(xe&&xe.visible){const Me=S(T,xe,b,M);T.onBeforeShadow(i,T,P,R,H,Me,se),i.renderBufferDirect(R,null,H,Me,T,se),T.onAfterShadow(i,T,P,R,H,Me,se)}}}else if(J.visible){const j=S(T,J,b,M);T.onBeforeShadow(i,T,P,R,H,j,null),i.renderBufferDirect(R,null,H,j,T,null),T.onAfterShadow(i,T,P,R,H,j,null)}}const D=T.children;for(let H=0,J=D.length;H<J;H++)y(D[H],P,R,b,M)}function E(T){T.target.removeEventListener("dispose",E);for(const R in l){const b=l[R],M=T.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const pg={[po]:mo,[xo]:vo,[go]:Mo,[ws]:_o,[mo]:po,[vo]:xo,[Mo]:go,[_o]:ws};function mg(i,e){function t(){let k=!1;const Pe=new Ft;let Te=null;const Ee=new Ft(0,0,0,0);return{setMask:function(pe){Te!==pe&&!k&&(i.colorMask(pe,pe,pe,pe),Te=pe)},setLocked:function(pe){k=pe},setClear:function(pe,le,Be,nt,yt){yt===!0&&(pe*=nt,le*=nt,Be*=nt),Pe.set(pe,le,Be,nt),Ee.equals(Pe)===!1&&(i.clearColor(pe,le,Be,nt),Ee.copy(Pe))},reset:function(){k=!1,Te=null,Ee.set(-1,0,0,0)}}}function n(){let k=!1,Pe=!1,Te=null,Ee=null,pe=null;return{setReversed:function(le){if(Pe!==le){const Be=e.get("EXT_clip_control");le?Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.ZERO_TO_ONE_EXT):Be.clipControlEXT(Be.LOWER_LEFT_EXT,Be.NEGATIVE_ONE_TO_ONE_EXT),Pe=le;const nt=pe;pe=null,this.setClear(nt)}},getReversed:function(){return Pe},setTest:function(le){le?$(i.DEPTH_TEST):_e(i.DEPTH_TEST)},setMask:function(le){Te!==le&&!k&&(i.depthMask(le),Te=le)},setFunc:function(le){if(Pe&&(le=pg[le]),Ee!==le){switch(le){case po:i.depthFunc(i.NEVER);break;case mo:i.depthFunc(i.ALWAYS);break;case xo:i.depthFunc(i.LESS);break;case ws:i.depthFunc(i.LEQUAL);break;case go:i.depthFunc(i.EQUAL);break;case _o:i.depthFunc(i.GEQUAL);break;case vo:i.depthFunc(i.GREATER);break;case Mo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ee=le}},setLocked:function(le){k=le},setClear:function(le){pe!==le&&(Pe&&(le=1-le),i.clearDepth(le),pe=le)},reset:function(){k=!1,Te=null,Ee=null,pe=null,Pe=!1}}}function s(){let k=!1,Pe=null,Te=null,Ee=null,pe=null,le=null,Be=null,nt=null,yt=null;return{setTest:function(Ut){k||(Ut?$(i.STENCIL_TEST):_e(i.STENCIL_TEST))},setMask:function(Ut){Pe!==Ut&&!k&&(i.stencilMask(Ut),Pe=Ut)},setFunc:function(Ut,wn,pn){(Te!==Ut||Ee!==wn||pe!==pn)&&(i.stencilFunc(Ut,wn,pn),Te=Ut,Ee=wn,pe=pn)},setOp:function(Ut,wn,pn){(le!==Ut||Be!==wn||nt!==pn)&&(i.stencilOp(Ut,wn,pn),le=Ut,Be=wn,nt=pn)},setLocked:function(Ut){k=Ut},setClear:function(Ut){yt!==Ut&&(i.clearStencil(Ut),yt=Ut)},reset:function(){k=!1,Pe=null,Te=null,Ee=null,pe=null,le=null,Be=null,nt=null,yt=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let d={},u={},f=new WeakMap,p=[],x=null,_=!1,m=null,h=null,v=null,S=null,y=null,E=null,T=null,P=new tt(0,0,0),R=0,b=!1,M=null,C=null,D=null,H=null,J=null;const j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let te=!1,re=0;const se=i.getParameter(i.VERSION);se.indexOf("WebGL")!==-1?(re=parseFloat(/^WebGL (\d)/.exec(se)[1]),te=re>=1):se.indexOf("OpenGL ES")!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(se)[1]),te=re>=2);let xe=null,Me={};const ze=i.getParameter(i.SCISSOR_BOX),U=i.getParameter(i.VIEWPORT),ye=new Ft().fromArray(ze),ve=new Ft().fromArray(U);function Se(k,Pe,Te,Ee){const pe=new Uint8Array(4),le=i.createTexture();i.bindTexture(k,le),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Be=0;Be<Te;Be++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(Pe,0,i.RGBA,1,1,Ee,0,i.RGBA,i.UNSIGNED_BYTE,pe):i.texImage2D(Pe+Be,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,pe);return le}const Z={};Z[i.TEXTURE_2D]=Se(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=Se(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=Se(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=Se(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),$(i.DEPTH_TEST),a.setFunc(ws),ut(!1),ct(Vc),$(i.CULL_FACE),Tt(qn);function $(k){d[k]!==!0&&(i.enable(k),d[k]=!0)}function _e(k){d[k]!==!1&&(i.disable(k),d[k]=!1)}function be(k,Pe){return u[k]!==Pe?(i.bindFramebuffer(k,Pe),u[k]=Pe,k===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Pe),k===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Pe),!0):!1}function Re(k,Pe){let Te=p,Ee=!1;if(k){Te=f.get(Pe),Te===void 0&&(Te=[],f.set(Pe,Te));const pe=k.textures;if(Te.length!==pe.length||Te[0]!==i.COLOR_ATTACHMENT0){for(let le=0,Be=pe.length;le<Be;le++)Te[le]=i.COLOR_ATTACHMENT0+le;Te.length=pe.length,Ee=!0}}else Te[0]!==i.BACK&&(Te[0]=i.BACK,Ee=!0);Ee&&i.drawBuffers(Te)}function Ye(k){return x!==k?(i.useProgram(k),x=k,!0):!1}const Rt={[Gi]:i.FUNC_ADD,[Dd]:i.FUNC_SUBTRACT,[Id]:i.FUNC_REVERSE_SUBTRACT};Rt[Ud]=i.MIN,Rt[Nd]=i.MAX;const Ze={[Fd]:i.ZERO,[Od]:i.ONE,[Bd]:i.SRC_COLOR,[uo]:i.SRC_ALPHA,[Wd]:i.SRC_ALPHA_SATURATE,[Gd]:i.DST_COLOR,[kd]:i.DST_ALPHA,[zd]:i.ONE_MINUS_SRC_COLOR,[fo]:i.ONE_MINUS_SRC_ALPHA,[Hd]:i.ONE_MINUS_DST_COLOR,[Vd]:i.ONE_MINUS_DST_ALPHA,[Xd]:i.CONSTANT_COLOR,[Yd]:i.ONE_MINUS_CONSTANT_COLOR,[qd]:i.CONSTANT_ALPHA,[Zd]:i.ONE_MINUS_CONSTANT_ALPHA};function Tt(k,Pe,Te,Ee,pe,le,Be,nt,yt,Ut){if(k===qn){_===!0&&(_e(i.BLEND),_=!1);return}if(_===!1&&($(i.BLEND),_=!0),k!==Ld){if(k!==m||Ut!==b){if((h!==Gi||y!==Gi)&&(i.blendEquation(i.FUNC_ADD),h=Gi,y=Gi),Ut)switch(k){case Ms:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Wi:i.blendFunc(i.ONE,i.ONE);break;case Gc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Hc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Gt("WebGLState: Invalid blending: ",k);break}else switch(k){case Ms:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Wi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Gc:Gt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Hc:Gt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Gt("WebGLState: Invalid blending: ",k);break}v=null,S=null,E=null,T=null,P.set(0,0,0),R=0,m=k,b=Ut}return}pe=pe||Pe,le=le||Te,Be=Be||Ee,(Pe!==h||pe!==y)&&(i.blendEquationSeparate(Rt[Pe],Rt[pe]),h=Pe,y=pe),(Te!==v||Ee!==S||le!==E||Be!==T)&&(i.blendFuncSeparate(Ze[Te],Ze[Ee],Ze[le],Ze[Be]),v=Te,S=Ee,E=le,T=Be),(nt.equals(P)===!1||yt!==R)&&(i.blendColor(nt.r,nt.g,nt.b,yt),P.copy(nt),R=yt),m=k,b=!1}function z(k,Pe){k.side===gt?_e(i.CULL_FACE):$(i.CULL_FACE);let Te=k.side===an;Pe&&(Te=!Te),ut(Te),k.blending===Ms&&k.transparent===!1?Tt(qn):Tt(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),r.setMask(k.colorWrite);const Ee=k.stencilWrite;o.setTest(Ee),Ee&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),Ve(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?$(i.SAMPLE_ALPHA_TO_COVERAGE):_e(i.SAMPLE_ALPHA_TO_COVERAGE)}function ut(k){M!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),M=k)}function ct(k){k!==Rd?($(i.CULL_FACE),k!==C&&(k===Vc?i.cullFace(i.BACK):k===Pd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):_e(i.CULL_FACE),C=k}function At(k){k!==D&&(te&&i.lineWidth(k),D=k)}function Ve(k,Pe,Te){k?($(i.POLYGON_OFFSET_FILL),(H!==Pe||J!==Te)&&(i.polygonOffset(Pe,Te),H=Pe,J=Te)):_e(i.POLYGON_OFFSET_FILL)}function It(k){k?$(i.SCISSOR_TEST):_e(i.SCISSOR_TEST)}function $e(k){k===void 0&&(k=i.TEXTURE0+j-1),xe!==k&&(i.activeTexture(k),xe=k)}function rt(k,Pe,Te){Te===void 0&&(xe===null?Te=i.TEXTURE0+j-1:Te=xe);let Ee=Me[Te];Ee===void 0&&(Ee={type:void 0,texture:void 0},Me[Te]=Ee),(Ee.type!==k||Ee.texture!==Pe)&&(xe!==Te&&(i.activeTexture(Te),xe=Te),i.bindTexture(k,Pe||Z[k]),Ee.type=k,Ee.texture=Pe)}function I(){const k=Me[xe];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function A(){try{i.compressedTexImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function K(){try{i.compressedTexImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function oe(){try{i.texSubImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function de(){try{i.texSubImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function ie(){try{i.compressedTexSubImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function ke(){try{i.compressedTexSubImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function Ce(){try{i.texStorage2D(...arguments)}catch(k){k("WebGLState:",k)}}function Je(){try{i.texStorage3D(...arguments)}catch(k){k("WebGLState:",k)}}function He(){try{i.texImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function fe(){try{i.texImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function we(k){ye.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),ye.copy(k))}function Qe(k){ve.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),ve.copy(k))}function je(k,Pe){let Te=l.get(Pe);Te===void 0&&(Te=new WeakMap,l.set(Pe,Te));let Ee=Te.get(k);Ee===void 0&&(Ee=i.getUniformBlockIndex(Pe,k.name),Te.set(k,Ee))}function Oe(k,Pe){const Ee=l.get(Pe).get(k);c.get(Pe)!==Ee&&(i.uniformBlockBinding(Pe,Ee,k.__bindingPointIndex),c.set(Pe,Ee))}function it(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},xe=null,Me={},u={},f=new WeakMap,p=[],x=null,_=!1,m=null,h=null,v=null,S=null,y=null,E=null,T=null,P=new tt(0,0,0),R=0,b=!1,M=null,C=null,D=null,H=null,J=null,ye.set(0,0,i.canvas.width,i.canvas.height),ve.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:$,disable:_e,bindFramebuffer:be,drawBuffers:Re,useProgram:Ye,setBlending:Tt,setMaterial:z,setFlipSided:ut,setCullFace:ct,setLineWidth:At,setPolygonOffset:Ve,setScissorTest:It,activeTexture:$e,bindTexture:rt,unbindTexture:I,compressedTexImage2D:A,compressedTexImage3D:K,texImage2D:He,texImage3D:fe,updateUBOMapping:je,uniformBlockBinding:Oe,texStorage2D:Ce,texStorage3D:Je,texSubImage2D:oe,texSubImage3D:de,compressedTexSubImage2D:ie,compressedTexSubImage3D:ke,scissor:we,viewport:Qe,reset:it}}function xg(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ie,d=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(I,A){return p?new OffscreenCanvas(I,A):aa("canvas")}function _(I,A,K){let oe=1;const de=rt(I);if((de.width>K||de.height>K)&&(oe=K/Math.max(de.width,de.height)),oe<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const ie=Math.floor(oe*de.width),ke=Math.floor(oe*de.height);u===void 0&&(u=x(ie,ke));const Ce=A?x(ie,ke):u;return Ce.width=ie,Ce.height=ke,Ce.getContext("2d").drawImage(I,0,0,ie,ke),ot("WebGLRenderer: Texture has been resized from ("+de.width+"x"+de.height+") to ("+ie+"x"+ke+")."),Ce}else return"data"in I&&ot("WebGLRenderer: Image in DataTexture is too big ("+de.width+"x"+de.height+")."),I;return I}function m(I){return I.generateMipmaps}function h(I){i.generateMipmap(I)}function v(I){return I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?i.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(I,A,K,oe,de=!1){if(I!==null){if(i[I]!==void 0)return i[I];ot("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let ie=A;if(A===i.RED&&(K===i.FLOAT&&(ie=i.R32F),K===i.HALF_FLOAT&&(ie=i.R16F),K===i.UNSIGNED_BYTE&&(ie=i.R8)),A===i.RED_INTEGER&&(K===i.UNSIGNED_BYTE&&(ie=i.R8UI),K===i.UNSIGNED_SHORT&&(ie=i.R16UI),K===i.UNSIGNED_INT&&(ie=i.R32UI),K===i.BYTE&&(ie=i.R8I),K===i.SHORT&&(ie=i.R16I),K===i.INT&&(ie=i.R32I)),A===i.RG&&(K===i.FLOAT&&(ie=i.RG32F),K===i.HALF_FLOAT&&(ie=i.RG16F),K===i.UNSIGNED_BYTE&&(ie=i.RG8)),A===i.RG_INTEGER&&(K===i.UNSIGNED_BYTE&&(ie=i.RG8UI),K===i.UNSIGNED_SHORT&&(ie=i.RG16UI),K===i.UNSIGNED_INT&&(ie=i.RG32UI),K===i.BYTE&&(ie=i.RG8I),K===i.SHORT&&(ie=i.RG16I),K===i.INT&&(ie=i.RG32I)),A===i.RGB_INTEGER&&(K===i.UNSIGNED_BYTE&&(ie=i.RGB8UI),K===i.UNSIGNED_SHORT&&(ie=i.RGB16UI),K===i.UNSIGNED_INT&&(ie=i.RGB32UI),K===i.BYTE&&(ie=i.RGB8I),K===i.SHORT&&(ie=i.RGB16I),K===i.INT&&(ie=i.RGB32I)),A===i.RGBA_INTEGER&&(K===i.UNSIGNED_BYTE&&(ie=i.RGBA8UI),K===i.UNSIGNED_SHORT&&(ie=i.RGBA16UI),K===i.UNSIGNED_INT&&(ie=i.RGBA32UI),K===i.BYTE&&(ie=i.RGBA8I),K===i.SHORT&&(ie=i.RGBA16I),K===i.INT&&(ie=i.RGBA32I)),A===i.RGB&&(K===i.UNSIGNED_INT_5_9_9_9_REV&&(ie=i.RGB9_E5),K===i.UNSIGNED_INT_10F_11F_11F_REV&&(ie=i.R11F_G11F_B10F)),A===i.RGBA){const ke=de?sa:Et.getTransfer(oe);K===i.FLOAT&&(ie=i.RGBA32F),K===i.HALF_FLOAT&&(ie=i.RGBA16F),K===i.UNSIGNED_BYTE&&(ie=ke===Nt?i.SRGB8_ALPHA8:i.RGBA8),K===i.UNSIGNED_SHORT_4_4_4_4&&(ie=i.RGBA4),K===i.UNSIGNED_SHORT_5_5_5_1&&(ie=i.RGB5_A1)}return(ie===i.R16F||ie===i.R32F||ie===i.RG16F||ie===i.RG32F||ie===i.RGBA16F||ie===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ie}function y(I,A){let K;return I?A===null||A===Ki||A===sr?K=i.DEPTH24_STENCIL8:A===Xn?K=i.DEPTH32F_STENCIL8:A===ir&&(K=i.DEPTH24_STENCIL8,ot("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Ki||A===sr?K=i.DEPTH_COMPONENT24:A===Xn?K=i.DEPTH_COMPONENT32F:A===ir&&(K=i.DEPTH_COMPONENT16),K}function E(I,A){return m(I)===!0||I.isFramebufferTexture&&I.minFilter!==bn&&I.minFilter!==Cn?Math.log2(Math.max(A.width,A.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?A.mipmaps.length:1}function T(I){const A=I.target;A.removeEventListener("dispose",T),R(A),A.isVideoTexture&&d.delete(A)}function P(I){const A=I.target;A.removeEventListener("dispose",P),M(A)}function R(I){const A=n.get(I);if(A.__webglInit===void 0)return;const K=I.source,oe=f.get(K);if(oe){const de=oe[A.__cacheKey];de.usedTimes--,de.usedTimes===0&&b(I),Object.keys(oe).length===0&&f.delete(K)}n.remove(I)}function b(I){const A=n.get(I);i.deleteTexture(A.__webglTexture);const K=I.source,oe=f.get(K);delete oe[A.__cacheKey],a.memory.textures--}function M(I){const A=n.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),n.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let oe=0;oe<6;oe++){if(Array.isArray(A.__webglFramebuffer[oe]))for(let de=0;de<A.__webglFramebuffer[oe].length;de++)i.deleteFramebuffer(A.__webglFramebuffer[oe][de]);else i.deleteFramebuffer(A.__webglFramebuffer[oe]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[oe])}else{if(Array.isArray(A.__webglFramebuffer))for(let oe=0;oe<A.__webglFramebuffer.length;oe++)i.deleteFramebuffer(A.__webglFramebuffer[oe]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let oe=0;oe<A.__webglColorRenderbuffer.length;oe++)A.__webglColorRenderbuffer[oe]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[oe]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const K=I.textures;for(let oe=0,de=K.length;oe<de;oe++){const ie=n.get(K[oe]);ie.__webglTexture&&(i.deleteTexture(ie.__webglTexture),a.memory.textures--),n.remove(K[oe])}n.remove(I)}let C=0;function D(){C=0}function H(){const I=C;return I>=s.maxTextures&&ot("WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),C+=1,I}function J(I){const A=[];return A.push(I.wrapS),A.push(I.wrapT),A.push(I.wrapR||0),A.push(I.magFilter),A.push(I.minFilter),A.push(I.anisotropy),A.push(I.internalFormat),A.push(I.format),A.push(I.type),A.push(I.generateMipmaps),A.push(I.premultiplyAlpha),A.push(I.flipY),A.push(I.unpackAlignment),A.push(I.colorSpace),A.join()}function j(I,A){const K=n.get(I);if(I.isVideoTexture&&It(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&K.__version!==I.version){const oe=I.image;if(oe===null)ot("WebGLRenderer: Texture marked for update but no image data found.");else if(oe.complete===!1)ot("WebGLRenderer: Texture marked for update but image is incomplete");else{Z(K,I,A);return}}else I.isExternalTexture&&(K.__webglTexture=I.sourceTexture?I.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,K.__webglTexture,i.TEXTURE0+A)}function te(I,A){const K=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&K.__version!==I.version){Z(K,I,A);return}else I.isExternalTexture&&(K.__webglTexture=I.sourceTexture?I.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,K.__webglTexture,i.TEXTURE0+A)}function re(I,A){const K=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&K.__version!==I.version){Z(K,I,A);return}t.bindTexture(i.TEXTURE_3D,K.__webglTexture,i.TEXTURE0+A)}function se(I,A){const K=n.get(I);if(I.version>0&&K.__version!==I.version){$(K,I,A);return}t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture,i.TEXTURE0+A)}const xe={[cn]:i.REPEAT,[ci]:i.CLAMP_TO_EDGE,[bo]:i.MIRRORED_REPEAT},Me={[bn]:i.NEAREST,[Jd]:i.NEAREST_MIPMAP_NEAREST,[Mr]:i.NEAREST_MIPMAP_LINEAR,[Cn]:i.LINEAR,[wa]:i.LINEAR_MIPMAP_NEAREST,[Xi]:i.LINEAR_MIPMAP_LINEAR},ze={[tu]:i.NEVER,[ou]:i.ALWAYS,[nu]:i.LESS,[Ph]:i.LEQUAL,[iu]:i.EQUAL,[au]:i.GEQUAL,[su]:i.GREATER,[ru]:i.NOTEQUAL};function U(I,A){if(A.type===Xn&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===Cn||A.magFilter===wa||A.magFilter===Mr||A.magFilter===Xi||A.minFilter===Cn||A.minFilter===wa||A.minFilter===Mr||A.minFilter===Xi)&&ot("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(I,i.TEXTURE_WRAP_S,xe[A.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,xe[A.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,xe[A.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,Me[A.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,Me[A.minFilter]),A.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,ze[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===bn||A.minFilter!==Mr&&A.minFilter!==Xi||A.type===Xn&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){const K=e.get("EXT_texture_filter_anisotropic");i.texParameterf(I,K.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function ye(I,A){let K=!1;I.__webglInit===void 0&&(I.__webglInit=!0,A.addEventListener("dispose",T));const oe=A.source;let de=f.get(oe);de===void 0&&(de={},f.set(oe,de));const ie=J(A);if(ie!==I.__cacheKey){de[ie]===void 0&&(de[ie]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,K=!0),de[ie].usedTimes++;const ke=de[I.__cacheKey];ke!==void 0&&(de[I.__cacheKey].usedTimes--,ke.usedTimes===0&&b(A)),I.__cacheKey=ie,I.__webglTexture=de[ie].texture}return K}function ve(I,A,K){return Math.floor(Math.floor(I/K)/A)}function Se(I,A,K,oe){const ie=I.updateRanges;if(ie.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,K,oe,A.data);else{ie.sort((fe,we)=>fe.start-we.start);let ke=0;for(let fe=1;fe<ie.length;fe++){const we=ie[ke],Qe=ie[fe],je=we.start+we.count,Oe=ve(Qe.start,A.width,4),it=ve(we.start,A.width,4);Qe.start<=je+1&&Oe===it&&ve(Qe.start+Qe.count-1,A.width,4)===Oe?we.count=Math.max(we.count,Qe.start+Qe.count-we.start):(++ke,ie[ke]=Qe)}ie.length=ke+1;const Ce=i.getParameter(i.UNPACK_ROW_LENGTH),Je=i.getParameter(i.UNPACK_SKIP_PIXELS),He=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let fe=0,we=ie.length;fe<we;fe++){const Qe=ie[fe],je=Math.floor(Qe.start/4),Oe=Math.ceil(Qe.count/4),it=je%A.width,k=Math.floor(je/A.width),Pe=Oe,Te=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,it),i.pixelStorei(i.UNPACK_SKIP_ROWS,k),t.texSubImage2D(i.TEXTURE_2D,0,it,k,Pe,Te,K,oe,A.data)}I.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Ce),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Je),i.pixelStorei(i.UNPACK_SKIP_ROWS,He)}}function Z(I,A,K){let oe=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(oe=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(oe=i.TEXTURE_3D);const de=ye(I,A),ie=A.source;t.bindTexture(oe,I.__webglTexture,i.TEXTURE0+K);const ke=n.get(ie);if(ie.version!==ke.__version||de===!0){t.activeTexture(i.TEXTURE0+K);const Ce=Et.getPrimaries(Et.workingColorSpace),Je=A.colorSpace===bi?null:Et.getPrimaries(A.colorSpace),He=A.colorSpace===bi||Ce===Je?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);let fe=_(A.image,!1,s.maxTextureSize);fe=$e(A,fe);const we=r.convert(A.format,A.colorSpace),Qe=r.convert(A.type);let je=S(A.internalFormat,we,Qe,A.colorSpace,A.isVideoTexture);U(oe,A);let Oe;const it=A.mipmaps,k=A.isVideoTexture!==!0,Pe=ke.__version===void 0||de===!0,Te=ie.dataReady,Ee=E(A,fe);if(A.isDepthTexture)je=y(A.format===ar,A.type),Pe&&(k?t.texStorage2D(i.TEXTURE_2D,1,je,fe.width,fe.height):t.texImage2D(i.TEXTURE_2D,0,je,fe.width,fe.height,0,we,Qe,null));else if(A.isDataTexture)if(it.length>0){k&&Pe&&t.texStorage2D(i.TEXTURE_2D,Ee,je,it[0].width,it[0].height);for(let pe=0,le=it.length;pe<le;pe++)Oe=it[pe],k?Te&&t.texSubImage2D(i.TEXTURE_2D,pe,0,0,Oe.width,Oe.height,we,Qe,Oe.data):t.texImage2D(i.TEXTURE_2D,pe,je,Oe.width,Oe.height,0,we,Qe,Oe.data);A.generateMipmaps=!1}else k?(Pe&&t.texStorage2D(i.TEXTURE_2D,Ee,je,fe.width,fe.height),Te&&Se(A,fe,we,Qe)):t.texImage2D(i.TEXTURE_2D,0,je,fe.width,fe.height,0,we,Qe,fe.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){k&&Pe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ee,je,it[0].width,it[0].height,fe.depth);for(let pe=0,le=it.length;pe<le;pe++)if(Oe=it[pe],A.format!==Fn)if(we!==null)if(k){if(Te)if(A.layerUpdates.size>0){const Be=Pl(Oe.width,Oe.height,A.format,A.type);for(const nt of A.layerUpdates){const yt=Oe.data.subarray(nt*Be/Oe.data.BYTES_PER_ELEMENT,(nt+1)*Be/Oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,pe,0,0,nt,Oe.width,Oe.height,1,we,yt)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,pe,0,0,0,Oe.width,Oe.height,fe.depth,we,Oe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,pe,je,Oe.width,Oe.height,fe.depth,0,Oe.data,0,0);else ot("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else k?Te&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,pe,0,0,0,Oe.width,Oe.height,fe.depth,we,Qe,Oe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,pe,je,Oe.width,Oe.height,fe.depth,0,we,Qe,Oe.data)}else{k&&Pe&&t.texStorage2D(i.TEXTURE_2D,Ee,je,it[0].width,it[0].height);for(let pe=0,le=it.length;pe<le;pe++)Oe=it[pe],A.format!==Fn?we!==null?k?Te&&t.compressedTexSubImage2D(i.TEXTURE_2D,pe,0,0,Oe.width,Oe.height,we,Oe.data):t.compressedTexImage2D(i.TEXTURE_2D,pe,je,Oe.width,Oe.height,0,Oe.data):ot("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):k?Te&&t.texSubImage2D(i.TEXTURE_2D,pe,0,0,Oe.width,Oe.height,we,Qe,Oe.data):t.texImage2D(i.TEXTURE_2D,pe,je,Oe.width,Oe.height,0,we,Qe,Oe.data)}else if(A.isDataArrayTexture)if(k){if(Pe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ee,je,fe.width,fe.height,fe.depth),Te)if(A.layerUpdates.size>0){const pe=Pl(fe.width,fe.height,A.format,A.type);for(const le of A.layerUpdates){const Be=fe.data.subarray(le*pe/fe.data.BYTES_PER_ELEMENT,(le+1)*pe/fe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,le,fe.width,fe.height,1,we,Qe,Be)}A.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,fe.width,fe.height,fe.depth,we,Qe,fe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,je,fe.width,fe.height,fe.depth,0,we,Qe,fe.data);else if(A.isData3DTexture)k?(Pe&&t.texStorage3D(i.TEXTURE_3D,Ee,je,fe.width,fe.height,fe.depth),Te&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,fe.width,fe.height,fe.depth,we,Qe,fe.data)):t.texImage3D(i.TEXTURE_3D,0,je,fe.width,fe.height,fe.depth,0,we,Qe,fe.data);else if(A.isFramebufferTexture){if(Pe)if(k)t.texStorage2D(i.TEXTURE_2D,Ee,je,fe.width,fe.height);else{let pe=fe.width,le=fe.height;for(let Be=0;Be<Ee;Be++)t.texImage2D(i.TEXTURE_2D,Be,je,pe,le,0,we,Qe,null),pe>>=1,le>>=1}}else if(it.length>0){if(k&&Pe){const pe=rt(it[0]);t.texStorage2D(i.TEXTURE_2D,Ee,je,pe.width,pe.height)}for(let pe=0,le=it.length;pe<le;pe++)Oe=it[pe],k?Te&&t.texSubImage2D(i.TEXTURE_2D,pe,0,0,we,Qe,Oe):t.texImage2D(i.TEXTURE_2D,pe,je,we,Qe,Oe);A.generateMipmaps=!1}else if(k){if(Pe){const pe=rt(fe);t.texStorage2D(i.TEXTURE_2D,Ee,je,pe.width,pe.height)}Te&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,we,Qe,fe)}else t.texImage2D(i.TEXTURE_2D,0,je,we,Qe,fe);m(A)&&h(oe),ke.__version=ie.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function $(I,A,K){if(A.image.length!==6)return;const oe=ye(I,A),de=A.source;t.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+K);const ie=n.get(de);if(de.version!==ie.__version||oe===!0){t.activeTexture(i.TEXTURE0+K);const ke=Et.getPrimaries(Et.workingColorSpace),Ce=A.colorSpace===bi?null:Et.getPrimaries(A.colorSpace),Je=A.colorSpace===bi||ke===Ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Je);const He=A.isCompressedTexture||A.image[0].isCompressedTexture,fe=A.image[0]&&A.image[0].isDataTexture,we=[];for(let le=0;le<6;le++)!He&&!fe?we[le]=_(A.image[le],!0,s.maxCubemapSize):we[le]=fe?A.image[le].image:A.image[le],we[le]=$e(A,we[le]);const Qe=we[0],je=r.convert(A.format,A.colorSpace),Oe=r.convert(A.type),it=S(A.internalFormat,je,Oe,A.colorSpace),k=A.isVideoTexture!==!0,Pe=ie.__version===void 0||oe===!0,Te=de.dataReady;let Ee=E(A,Qe);U(i.TEXTURE_CUBE_MAP,A);let pe;if(He){k&&Pe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ee,it,Qe.width,Qe.height);for(let le=0;le<6;le++){pe=we[le].mipmaps;for(let Be=0;Be<pe.length;Be++){const nt=pe[Be];A.format!==Fn?je!==null?k?Te&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be,0,0,nt.width,nt.height,je,nt.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be,it,nt.width,nt.height,0,nt.data):ot("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?Te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be,0,0,nt.width,nt.height,je,Oe,nt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be,it,nt.width,nt.height,0,je,Oe,nt.data)}}}else{if(pe=A.mipmaps,k&&Pe){pe.length>0&&Ee++;const le=rt(we[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ee,it,le.width,le.height)}for(let le=0;le<6;le++)if(fe){k?Te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,we[le].width,we[le].height,je,Oe,we[le].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,it,we[le].width,we[le].height,0,je,Oe,we[le].data);for(let Be=0;Be<pe.length;Be++){const yt=pe[Be].image[le].image;k?Te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be+1,0,0,yt.width,yt.height,je,Oe,yt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be+1,it,yt.width,yt.height,0,je,Oe,yt.data)}}else{k?Te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,je,Oe,we[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,it,je,Oe,we[le]);for(let Be=0;Be<pe.length;Be++){const nt=pe[Be];k?Te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be+1,0,0,je,Oe,nt.image[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Be+1,it,je,Oe,nt.image[le])}}}m(A)&&h(i.TEXTURE_CUBE_MAP),ie.__version=de.version,A.onUpdate&&A.onUpdate(A)}I.__version=A.version}function _e(I,A,K,oe,de,ie){const ke=r.convert(K.format,K.colorSpace),Ce=r.convert(K.type),Je=S(K.internalFormat,ke,Ce,K.colorSpace),He=n.get(A),fe=n.get(K);if(fe.__renderTarget=A,!He.__hasExternalTextures){const we=Math.max(1,A.width>>ie),Qe=Math.max(1,A.height>>ie);de===i.TEXTURE_3D||de===i.TEXTURE_2D_ARRAY?t.texImage3D(de,ie,Je,we,Qe,A.depth,0,ke,Ce,null):t.texImage2D(de,ie,Je,we,Qe,0,ke,Ce,null)}t.bindFramebuffer(i.FRAMEBUFFER,I),Ve(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,oe,de,fe.__webglTexture,0,At(A)):(de===i.TEXTURE_2D||de>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&de<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,oe,de,fe.__webglTexture,ie),t.bindFramebuffer(i.FRAMEBUFFER,null)}function be(I,A,K){if(i.bindRenderbuffer(i.RENDERBUFFER,I),A.depthBuffer){const oe=A.depthTexture,de=oe&&oe.isDepthTexture?oe.type:null,ie=y(A.stencilBuffer,de),ke=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ce=At(A);Ve(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ce,ie,A.width,A.height):K?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ce,ie,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,ie,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ke,i.RENDERBUFFER,I)}else{const oe=A.textures;for(let de=0;de<oe.length;de++){const ie=oe[de],ke=r.convert(ie.format,ie.colorSpace),Ce=r.convert(ie.type),Je=S(ie.internalFormat,ke,Ce,ie.colorSpace),He=At(A);K&&Ve(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,He,Je,A.width,A.height):Ve(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,He,Je,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Je,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Re(I,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,I),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const oe=n.get(A.depthTexture);oe.__renderTarget=A,(!oe.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),j(A.depthTexture,0);const de=oe.__webglTexture,ie=At(A);if(A.depthTexture.format===rr)Ve(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,de,0,ie):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,de,0);else if(A.depthTexture.format===ar)Ve(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,de,0,ie):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,de,0);else throw new Error("Unknown depthTexture format")}function Ye(I){const A=n.get(I),K=I.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==I.depthTexture){const oe=I.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),oe){const de=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,oe.removeEventListener("dispose",de)};oe.addEventListener("dispose",de),A.__depthDisposeCallback=de}A.__boundDepthTexture=oe}if(I.depthTexture&&!A.__autoAllocateDepthBuffer){if(K)throw new Error("target.depthTexture not supported in Cube render targets");const oe=I.texture.mipmaps;oe&&oe.length>0?Re(A.__webglFramebuffer[0],I):Re(A.__webglFramebuffer,I)}else if(K){A.__webglDepthbuffer=[];for(let oe=0;oe<6;oe++)if(t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[oe]),A.__webglDepthbuffer[oe]===void 0)A.__webglDepthbuffer[oe]=i.createRenderbuffer(),be(A.__webglDepthbuffer[oe],I,!1);else{const de=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=A.__webglDepthbuffer[oe];i.bindRenderbuffer(i.RENDERBUFFER,ie),i.framebufferRenderbuffer(i.FRAMEBUFFER,de,i.RENDERBUFFER,ie)}}else{const oe=I.texture.mipmaps;if(oe&&oe.length>0?t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),be(A.__webglDepthbuffer,I,!1);else{const de=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ie),i.framebufferRenderbuffer(i.FRAMEBUFFER,de,i.RENDERBUFFER,ie)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Rt(I,A,K){const oe=n.get(I);A!==void 0&&_e(oe.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),K!==void 0&&Ye(I)}function Ze(I){const A=I.texture,K=n.get(I),oe=n.get(A);I.addEventListener("dispose",P);const de=I.textures,ie=I.isWebGLCubeRenderTarget===!0,ke=de.length>1;if(ke||(oe.__webglTexture===void 0&&(oe.__webglTexture=i.createTexture()),oe.__version=A.version,a.memory.textures++),ie){K.__webglFramebuffer=[];for(let Ce=0;Ce<6;Ce++)if(A.mipmaps&&A.mipmaps.length>0){K.__webglFramebuffer[Ce]=[];for(let Je=0;Je<A.mipmaps.length;Je++)K.__webglFramebuffer[Ce][Je]=i.createFramebuffer()}else K.__webglFramebuffer[Ce]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){K.__webglFramebuffer=[];for(let Ce=0;Ce<A.mipmaps.length;Ce++)K.__webglFramebuffer[Ce]=i.createFramebuffer()}else K.__webglFramebuffer=i.createFramebuffer();if(ke)for(let Ce=0,Je=de.length;Ce<Je;Ce++){const He=n.get(de[Ce]);He.__webglTexture===void 0&&(He.__webglTexture=i.createTexture(),a.memory.textures++)}if(I.samples>0&&Ve(I)===!1){K.__webglMultisampledFramebuffer=i.createFramebuffer(),K.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let Ce=0;Ce<de.length;Ce++){const Je=de[Ce];K.__webglColorRenderbuffer[Ce]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,K.__webglColorRenderbuffer[Ce]);const He=r.convert(Je.format,Je.colorSpace),fe=r.convert(Je.type),we=S(Je.internalFormat,He,fe,Je.colorSpace,I.isXRRenderTarget===!0),Qe=At(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,Qe,we,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.RENDERBUFFER,K.__webglColorRenderbuffer[Ce])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&(K.__webglDepthRenderbuffer=i.createRenderbuffer(),be(K.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ie){t.bindTexture(i.TEXTURE_CUBE_MAP,oe.__webglTexture),U(i.TEXTURE_CUBE_MAP,A);for(let Ce=0;Ce<6;Ce++)if(A.mipmaps&&A.mipmaps.length>0)for(let Je=0;Je<A.mipmaps.length;Je++)_e(K.__webglFramebuffer[Ce][Je],I,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,Je);else _e(K.__webglFramebuffer[Ce],I,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0);m(A)&&h(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ke){for(let Ce=0,Je=de.length;Ce<Je;Ce++){const He=de[Ce],fe=n.get(He);let we=i.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(we=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(we,fe.__webglTexture),U(we,He),_e(K.__webglFramebuffer,I,He,i.COLOR_ATTACHMENT0+Ce,we,0),m(He)&&h(we)}t.unbindTexture()}else{let Ce=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Ce=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Ce,oe.__webglTexture),U(Ce,A),A.mipmaps&&A.mipmaps.length>0)for(let Je=0;Je<A.mipmaps.length;Je++)_e(K.__webglFramebuffer[Je],I,A,i.COLOR_ATTACHMENT0,Ce,Je);else _e(K.__webglFramebuffer,I,A,i.COLOR_ATTACHMENT0,Ce,0);m(A)&&h(Ce),t.unbindTexture()}I.depthBuffer&&Ye(I)}function Tt(I){const A=I.textures;for(let K=0,oe=A.length;K<oe;K++){const de=A[K];if(m(de)){const ie=v(I),ke=n.get(de).__webglTexture;t.bindTexture(ie,ke),h(ie),t.unbindTexture()}}}const z=[],ut=[];function ct(I){if(I.samples>0){if(Ve(I)===!1){const A=I.textures,K=I.width,oe=I.height;let de=i.COLOR_BUFFER_BIT;const ie=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ke=n.get(I),Ce=A.length>1;if(Ce)for(let He=0;He<A.length;He++)t.bindFramebuffer(i.FRAMEBUFFER,ke.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ke.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ke.__webglMultisampledFramebuffer);const Je=I.texture.mipmaps;Je&&Je.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ke.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ke.__webglFramebuffer);for(let He=0;He<A.length;He++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(de|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(de|=i.STENCIL_BUFFER_BIT)),Ce){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ke.__webglColorRenderbuffer[He]);const fe=n.get(A[He]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,fe,0)}i.blitFramebuffer(0,0,K,oe,0,0,K,oe,de,i.NEAREST),c===!0&&(z.length=0,ut.length=0,z.push(i.COLOR_ATTACHMENT0+He),I.depthBuffer&&I.resolveDepthBuffer===!1&&(z.push(ie),ut.push(ie),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ut)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,z))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Ce)for(let He=0;He<A.length;He++){t.bindFramebuffer(i.FRAMEBUFFER,ke.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.RENDERBUFFER,ke.__webglColorRenderbuffer[He]);const fe=n.get(A[He]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ke.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+He,i.TEXTURE_2D,fe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ke.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&c){const A=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function At(I){return Math.min(s.maxSamples,I.samples)}function Ve(I){const A=n.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function It(I){const A=a.render.frame;d.get(I)!==A&&(d.set(I,A),I.update())}function $e(I,A){const K=I.colorSpace,oe=I.format,de=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||K!==As&&K!==bi&&(Et.getTransfer(K)===Nt?(oe!==Fn||de!==$n)&&ot("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Gt("WebGLTextures: Unsupported texture color space:",K)),A}function rt(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(l.width=I.naturalWidth||I.width,l.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(l.width=I.displayWidth,l.height=I.displayHeight):(l.width=I.width,l.height=I.height),l}this.allocateTextureUnit=H,this.resetTextureUnits=D,this.setTexture2D=j,this.setTexture2DArray=te,this.setTexture3D=re,this.setTextureCube=se,this.rebindTextures=Rt,this.setupRenderTarget=Ze,this.updateRenderTargetMipmap=Tt,this.updateMultisampleRenderTarget=ct,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=_e,this.useMultisampledRTT=Ve}function gg(i,e){function t(n,s=bi){let r;const a=Et.getTransfer(s);if(n===$n)return i.UNSIGNED_BYTE;if(n===uc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===fc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Eh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ah)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===wh)return i.BYTE;if(n===Th)return i.SHORT;if(n===ir)return i.UNSIGNED_SHORT;if(n===dc)return i.INT;if(n===Ki)return i.UNSIGNED_INT;if(n===Xn)return i.FLOAT;if(n===Zn)return i.HALF_FLOAT;if(n===Ch)return i.ALPHA;if(n===Rh)return i.RGB;if(n===Fn)return i.RGBA;if(n===rr)return i.DEPTH_COMPONENT;if(n===ar)return i.DEPTH_STENCIL;if(n===pc)return i.RED;if(n===mc)return i.RED_INTEGER;if(n===xc)return i.RG;if(n===gc)return i.RG_INTEGER;if(n===_c)return i.RGBA_INTEGER;if(n===$r||n===Kr||n===Jr||n===jr)if(a===Nt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===$r)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Jr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===jr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===$r)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Kr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Jr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===jr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===wo||n===To||n===Eo||n===Ao)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===wo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===To)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Eo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ao)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Co||n===Ro||n===Po)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Co||n===Ro)return a===Nt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Po)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Lo||n===Do||n===Io||n===Uo||n===No||n===Fo||n===Oo||n===Bo||n===zo||n===ko||n===Vo||n===Go||n===Ho||n===Wo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Lo)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Do)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Io)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Uo)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===No)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Fo)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Oo)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Bo)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===zo)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ko)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Vo)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Go)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ho)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Wo)return a===Nt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Xo||n===Yo||n===qo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Xo)return a===Nt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Yo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===qo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Zo||n===$o||n===Ko||n===Jo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Zo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===$o)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ko)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Jo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===sr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const _g=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vg=`
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

}`;class Mg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Gh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new rn({vertexShader:_g,fragmentShader:vg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new G(new Bt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Sg extends Ls{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,u=null,f=null,p=null,x=null;const _=typeof XRWebGLBinding<"u",m=new Mg,h={},v=t.getContextAttributes();let S=null,y=null;const E=[],T=[],P=new Ie;let R=null;const b=new Sn;b.viewport=new Ft;const M=new Sn;M.viewport=new Ft;const C=[b,M],D=new zf;let H=null,J=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let $=E[Z];return $===void 0&&($=new Xa,E[Z]=$),$.getTargetRaySpace()},this.getControllerGrip=function(Z){let $=E[Z];return $===void 0&&($=new Xa,E[Z]=$),$.getGripSpace()},this.getHand=function(Z){let $=E[Z];return $===void 0&&($=new Xa,E[Z]=$),$.getHandSpace()};function j(Z){const $=T.indexOf(Z.inputSource);if($===-1)return;const _e=E[$];_e!==void 0&&(_e.update(Z.inputSource,Z.frame,l||a),_e.dispatchEvent({type:Z.type,data:Z.inputSource}))}function te(){s.removeEventListener("select",j),s.removeEventListener("selectstart",j),s.removeEventListener("selectend",j),s.removeEventListener("squeeze",j),s.removeEventListener("squeezestart",j),s.removeEventListener("squeezeend",j),s.removeEventListener("end",te),s.removeEventListener("inputsourceschange",re);for(let Z=0;Z<E.length;Z++){const $=T[Z];$!==null&&(T[Z]=null,E[Z].disconnect($))}H=null,J=null,m.reset();for(const Z in h)delete h[Z];e.setRenderTarget(S),p=null,f=null,u=null,s=null,y=null,Se.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&ot("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&ot("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(S=e.getRenderTarget(),s.addEventListener("select",j),s.addEventListener("selectstart",j),s.addEventListener("selectend",j),s.addEventListener("squeeze",j),s.addEventListener("squeezestart",j),s.addEventListener("squeezeend",j),s.addEventListener("end",te),s.addEventListener("inputsourceschange",re),v.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(P),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,be=null,Re=null;v.depth&&(Re=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=v.stencil?ar:rr,be=v.stencil?sr:Ki);const Ye={colorFormat:t.RGBA8,depthFormat:Re,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Ye),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),y=new On(f.textureWidth,f.textureHeight,{format:Fn,type:$n,depthTexture:new Vh(f.textureWidth,f.textureHeight,be,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const _e={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,_e),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new On(p.framebufferWidth,p.framebufferHeight,{format:Fn,type:$n,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Se.setContext(s),Se.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function re(Z){for(let $=0;$<Z.removed.length;$++){const _e=Z.removed[$],be=T.indexOf(_e);be>=0&&(T[be]=null,E[be].disconnect(_e))}for(let $=0;$<Z.added.length;$++){const _e=Z.added[$];let be=T.indexOf(_e);if(be===-1){for(let Ye=0;Ye<E.length;Ye++)if(Ye>=T.length){T.push(_e),be=Ye;break}else if(T[Ye]===null){T[Ye]=_e,be=Ye;break}if(be===-1)break}const Re=E[be];Re&&Re.connect(_e)}}const se=new L,xe=new L;function Me(Z,$,_e){se.setFromMatrixPosition($.matrixWorld),xe.setFromMatrixPosition(_e.matrixWorld);const be=se.distanceTo(xe),Re=$.projectionMatrix.elements,Ye=_e.projectionMatrix.elements,Rt=Re[14]/(Re[10]-1),Ze=Re[14]/(Re[10]+1),Tt=(Re[9]+1)/Re[5],z=(Re[9]-1)/Re[5],ut=(Re[8]-1)/Re[0],ct=(Ye[8]+1)/Ye[0],At=Rt*ut,Ve=Rt*ct,It=be/(-ut+ct),$e=It*-ut;if($.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX($e),Z.translateZ(It),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Re[10]===-1)Z.projectionMatrix.copy($.projectionMatrix),Z.projectionMatrixInverse.copy($.projectionMatrixInverse);else{const rt=Rt+It,I=Ze+It,A=At-$e,K=Ve+(be-$e),oe=Tt*Ze/I*rt,de=z*Ze/I*rt;Z.projectionMatrix.makePerspective(A,K,oe,de,rt,I),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ze(Z,$){$===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices($.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let $=Z.near,_e=Z.far;m.texture!==null&&(m.depthNear>0&&($=m.depthNear),m.depthFar>0&&(_e=m.depthFar)),D.near=M.near=b.near=$,D.far=M.far=b.far=_e,(H!==D.near||J!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),H=D.near,J=D.far),D.layers.mask=Z.layers.mask|6,b.layers.mask=D.layers.mask&3,M.layers.mask=D.layers.mask&5;const be=Z.parent,Re=D.cameras;ze(D,be);for(let Ye=0;Ye<Re.length;Ye++)ze(Re[Ye],be);Re.length===2?Me(D,b,M):D.projectionMatrix.copy(b.projectionMatrix),U(Z,D,be)};function U(Z,$,_e){_e===null?Z.matrix.copy($.matrixWorld):(Z.matrix.copy(_e.matrixWorld),Z.matrix.invert(),Z.matrix.multiply($.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy($.projectionMatrix),Z.projectionMatrixInverse.copy($.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=cr*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(Z){c=Z,f!==null&&(f.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(D)},this.getCameraTexture=function(Z){return h[Z]};let ye=null;function ve(Z,$){if(d=$.getViewerPose(l||a),x=$,d!==null){const _e=d.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let be=!1;_e.length!==D.cameras.length&&(D.cameras.length=0,be=!0);for(let Ze=0;Ze<_e.length;Ze++){const Tt=_e[Ze];let z=null;if(p!==null)z=p.getViewport(Tt);else{const ct=u.getViewSubImage(f,Tt);z=ct.viewport,Ze===0&&(e.setRenderTargetTextures(y,ct.colorTexture,ct.depthStencilTexture),e.setRenderTarget(y))}let ut=C[Ze];ut===void 0&&(ut=new Sn,ut.layers.enable(Ze),ut.viewport=new Ft,C[Ze]=ut),ut.matrix.fromArray(Tt.transform.matrix),ut.matrix.decompose(ut.position,ut.quaternion,ut.scale),ut.projectionMatrix.fromArray(Tt.projectionMatrix),ut.projectionMatrixInverse.copy(ut.projectionMatrix).invert(),ut.viewport.set(z.x,z.y,z.width,z.height),Ze===0&&(D.matrix.copy(ut.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),be===!0&&D.cameras.push(ut)}const Re=s.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const Ze=u.getDepthInformation(_e[0]);Ze&&Ze.isValid&&Ze.texture&&m.init(Ze,s.renderState)}if(Re&&Re.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let Ze=0;Ze<_e.length;Ze++){const Tt=_e[Ze].camera;if(Tt){let z=h[Tt];z||(z=new Gh,h[Tt]=z);const ut=u.getCameraImage(Tt);z.sourceTexture=ut}}}}for(let _e=0;_e<E.length;_e++){const be=T[_e],Re=E[_e];be!==null&&Re!==void 0&&Re.update(be,$,l||a)}ye&&ye(Z,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),x=null}const Se=new Qh;Se.setAnimationLoop(ve),this.setAnimationLoop=function(Z){ye=Z},this.dispose=function(){}}}const Oi=new kn,yg=new Dt;function bg(i,e){function t(m,h){m.matrixAutoUpdate===!0&&m.updateMatrix(),h.value.copy(m.matrix)}function n(m,h){h.color.getRGB(m.fogColor.value,Fh(i)),h.isFog?(m.fogNear.value=h.near,m.fogFar.value=h.far):h.isFogExp2&&(m.fogDensity.value=h.density)}function s(m,h,v,S,y){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(m,h):h.isMeshToonMaterial?(r(m,h),u(m,h)):h.isMeshPhongMaterial?(r(m,h),d(m,h)):h.isMeshStandardMaterial?(r(m,h),f(m,h),h.isMeshPhysicalMaterial&&p(m,h,y)):h.isMeshMatcapMaterial?(r(m,h),x(m,h)):h.isMeshDepthMaterial?r(m,h):h.isMeshDistanceMaterial?(r(m,h),_(m,h)):h.isMeshNormalMaterial?r(m,h):h.isLineBasicMaterial?(a(m,h),h.isLineDashedMaterial&&o(m,h)):h.isPointsMaterial?c(m,h,v,S):h.isSpriteMaterial?l(m,h):h.isShadowMaterial?(m.color.value.copy(h.color),m.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(m,h){m.opacity.value=h.opacity,h.color&&m.diffuse.value.copy(h.color),h.emissive&&m.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(m.map.value=h.map,t(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.bumpMap&&(m.bumpMap.value=h.bumpMap,t(h.bumpMap,m.bumpMapTransform),m.bumpScale.value=h.bumpScale,h.side===an&&(m.bumpScale.value*=-1)),h.normalMap&&(m.normalMap.value=h.normalMap,t(h.normalMap,m.normalMapTransform),m.normalScale.value.copy(h.normalScale),h.side===an&&m.normalScale.value.negate()),h.displacementMap&&(m.displacementMap.value=h.displacementMap,t(h.displacementMap,m.displacementMapTransform),m.displacementScale.value=h.displacementScale,m.displacementBias.value=h.displacementBias),h.emissiveMap&&(m.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,m.emissiveMapTransform)),h.specularMap&&(m.specularMap.value=h.specularMap,t(h.specularMap,m.specularMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest);const v=e.get(h),S=v.envMap,y=v.envMapRotation;S&&(m.envMap.value=S,Oi.copy(y),Oi.x*=-1,Oi.y*=-1,Oi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Oi.y*=-1,Oi.z*=-1),m.envMapRotation.value.setFromMatrix4(yg.makeRotationFromEuler(Oi)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=h.reflectivity,m.ior.value=h.ior,m.refractionRatio.value=h.refractionRatio),h.lightMap&&(m.lightMap.value=h.lightMap,m.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,m.lightMapTransform)),h.aoMap&&(m.aoMap.value=h.aoMap,m.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,m.aoMapTransform))}function a(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,h.map&&(m.map.value=h.map,t(h.map,m.mapTransform))}function o(m,h){m.dashSize.value=h.dashSize,m.totalSize.value=h.dashSize+h.gapSize,m.scale.value=h.scale}function c(m,h,v,S){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.size.value=h.size*v,m.scale.value=S*.5,h.map&&(m.map.value=h.map,t(h.map,m.uvTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function l(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.rotation.value=h.rotation,h.map&&(m.map.value=h.map,t(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function d(m,h){m.specular.value.copy(h.specular),m.shininess.value=Math.max(h.shininess,1e-4)}function u(m,h){h.gradientMap&&(m.gradientMap.value=h.gradientMap)}function f(m,h){m.metalness.value=h.metalness,h.metalnessMap&&(m.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,m.metalnessMapTransform)),m.roughness.value=h.roughness,h.roughnessMap&&(m.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,m.roughnessMapTransform)),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)}function p(m,h,v){m.ior.value=h.ior,h.sheen>0&&(m.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),m.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(m.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,m.sheenColorMapTransform)),h.sheenRoughnessMap&&(m.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,m.sheenRoughnessMapTransform))),h.clearcoat>0&&(m.clearcoat.value=h.clearcoat,m.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(m.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,m.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(m.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===an&&m.clearcoatNormalScale.value.negate())),h.dispersion>0&&(m.dispersion.value=h.dispersion),h.iridescence>0&&(m.iridescence.value=h.iridescence,m.iridescenceIOR.value=h.iridescenceIOR,m.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(m.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,m.iridescenceMapTransform)),h.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),h.transmission>0&&(m.transmission.value=h.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),h.transmissionMap&&(m.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,m.transmissionMapTransform)),m.thickness.value=h.thickness,h.thicknessMap&&(m.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=h.attenuationDistance,m.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(m.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(m.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=h.specularIntensity,m.specularColor.value.copy(h.specularColor),h.specularColorMap&&(m.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,m.specularColorMapTransform)),h.specularIntensityMap&&(m.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,h){h.matcap&&(m.matcap.value=h.matcap)}function _(m,h){const v=e.get(h).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function wg(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,S){const y=S.program;n.uniformBlockBinding(v,y)}function l(v,S){let y=s[v.id];y===void 0&&(x(v),y=d(v),s[v.id]=y,v.addEventListener("dispose",m));const E=S.program;n.updateUBOMapping(v,E);const T=e.render.frame;r[v.id]!==T&&(f(v),r[v.id]=T)}function d(v){const S=u();v.__bindingPointIndex=S;const y=i.createBuffer(),E=v.__size,T=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,E,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,y),y}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Gt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const S=s[v.id],y=v.uniforms,E=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let T=0,P=y.length;T<P;T++){const R=Array.isArray(y[T])?y[T]:[y[T]];for(let b=0,M=R.length;b<M;b++){const C=R[b];if(p(C,T,b,E)===!0){const D=C.__offset,H=Array.isArray(C.value)?C.value:[C.value];let J=0;for(let j=0;j<H.length;j++){const te=H[j],re=_(te);typeof te=="number"||typeof te=="boolean"?(C.__data[0]=te,i.bufferSubData(i.UNIFORM_BUFFER,D+J,C.__data)):te.isMatrix3?(C.__data[0]=te.elements[0],C.__data[1]=te.elements[1],C.__data[2]=te.elements[2],C.__data[3]=0,C.__data[4]=te.elements[3],C.__data[5]=te.elements[4],C.__data[6]=te.elements[5],C.__data[7]=0,C.__data[8]=te.elements[6],C.__data[9]=te.elements[7],C.__data[10]=te.elements[8],C.__data[11]=0):(te.toArray(C.__data,J),J+=re.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,D,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,S,y,E){const T=v.value,P=S+"_"+y;if(E[P]===void 0)return typeof T=="number"||typeof T=="boolean"?E[P]=T:E[P]=T.clone(),!0;{const R=E[P];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return E[P]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function x(v){const S=v.uniforms;let y=0;const E=16;for(let P=0,R=S.length;P<R;P++){const b=Array.isArray(S[P])?S[P]:[S[P]];for(let M=0,C=b.length;M<C;M++){const D=b[M],H=Array.isArray(D.value)?D.value:[D.value];for(let J=0,j=H.length;J<j;J++){const te=H[J],re=_(te),se=y%E,xe=se%re.boundary,Me=se+xe;y+=xe,Me!==0&&E-Me<re.storage&&(y+=E-Me),D.__data=new Float32Array(re.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=y,y+=re.storage}}}const T=y%E;return T>0&&(y+=E-T),v.__size=y,v.__cache={},this}function _(v){const S={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(S.boundary=4,S.storage=4):v.isVector2?(S.boundary=8,S.storage=8):v.isVector3||v.isColor?(S.boundary=16,S.storage=12):v.isVector4?(S.boundary=16,S.storage=16):v.isMatrix3?(S.boundary=48,S.storage=48):v.isMatrix4?(S.boundary=64,S.storage=64):v.isTexture?ot("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ot("WebGLRenderer: Unsupported uniform value type.",v),S}function m(v){const S=v.target;S.removeEventListener("dispose",m);const y=a.indexOf(S.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function h(){for(const v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:l,dispose:h}}const Tg=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let si=null;function Eg(){return si===null&&(si=new kh(Tg,32,32,xc,Zn),si.minFilter=Cn,si.magFilter=Cn,si.wrapS=ci,si.wrapT=ci,si.generateMipmaps=!1,si.needsUpdate=!0),si}class Ag{constructor(e={}){const{canvas:t=cu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const x=new Set([_c,gc,mc]),_=new Set([$n,Ki,ir,sr,uc,fc]),m=new Uint32Array(4),h=new Int32Array(4);let v=null,S=null;const y=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ei,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let P=!1;this._outputColorSpace=Ct;let R=0,b=0,M=null,C=-1,D=null;const H=new Ft,J=new Ft;let j=null;const te=new tt(0);let re=0,se=t.width,xe=t.height,Me=1,ze=null,U=null;const ye=new Ft(0,0,se,xe),ve=new Ft(0,0,se,xe);let Se=!1;const Z=new Tc;let $=!1,_e=!1;const be=new Dt,Re=new L,Ye=new Ft,Rt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ze=!1;function Tt(){return M===null?Me:1}let z=n;function ut(w,O){return t.getContext(w,O)}try{const w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${cc}`),t.addEventListener("webglcontextlost",pe,!1),t.addEventListener("webglcontextrestored",le,!1),t.addEventListener("webglcontextcreationerror",Be,!1),z===null){const O="webgl2";if(z=ut(O,w),z===null)throw ut(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw w("WebGLRenderer: "+w.message),w}let ct,At,Ve,It,$e,rt,I,A,K,oe,de,ie,ke,Ce,Je,He,fe,we,Qe,je,Oe,it,k,Pe;function Te(){ct=new Nm(z),ct.init(),it=new gg(z,ct),At=new Em(z,ct,e,it),Ve=new mg(z,ct),At.reversedDepthBuffer&&f&&Ve.buffers.depth.setReversed(!0),It=new Bm(z),$e=new ng,rt=new xg(z,ct,Ve,$e,At,it,It),I=new Cm(T),A=new Um(T),K=new Gf(z),k=new wm(z,K),oe=new Fm(z,K,It,k),de=new km(z,oe,K,It),Qe=new zm(z,At,rt),He=new Am($e),ie=new tg(T,I,A,ct,At,k,He),ke=new bg(T,$e),Ce=new sg,Je=new hg(ct),we=new bm(T,I,A,Ve,de,p,c),fe=new fg(T,de,At),Pe=new wg(z,It,At,Ve),je=new Tm(z,ct,It),Oe=new Om(z,ct,It),It.programs=ie.programs,T.capabilities=At,T.extensions=ct,T.properties=$e,T.renderLists=Ce,T.shadowMap=fe,T.state=Ve,T.info=It}Te();const Ee=new Sg(T,z);this.xr=Ee,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const w=ct.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=ct.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return Me},this.setPixelRatio=function(w){w!==void 0&&(Me=w,this.setSize(se,xe,!1))},this.getSize=function(w){return w.set(se,xe)},this.setSize=function(w,O,V=!0){if(Ee.isPresenting){ot("WebGLRenderer: Can't change size while VR device is presenting.");return}se=w,xe=O,t.width=Math.floor(w*Me),t.height=Math.floor(O*Me),V===!0&&(t.style.width=w+"px",t.style.height=O+"px"),this.setViewport(0,0,w,O)},this.getDrawingBufferSize=function(w){return w.set(se*Me,xe*Me).floor()},this.setDrawingBufferSize=function(w,O,V){se=w,xe=O,Me=V,t.width=Math.floor(w*V),t.height=Math.floor(O*V),this.setViewport(0,0,w,O)},this.getCurrentViewport=function(w){return w.copy(H)},this.getViewport=function(w){return w.copy(ye)},this.setViewport=function(w,O,V,X){w.isVector4?ye.set(w.x,w.y,w.z,w.w):ye.set(w,O,V,X),Ve.viewport(H.copy(ye).multiplyScalar(Me).round())},this.getScissor=function(w){return w.copy(ve)},this.setScissor=function(w,O,V,X){w.isVector4?ve.set(w.x,w.y,w.z,w.w):ve.set(w,O,V,X),Ve.scissor(J.copy(ve).multiplyScalar(Me).round())},this.getScissorTest=function(){return Se},this.setScissorTest=function(w){Ve.setScissorTest(Se=w)},this.setOpaqueSort=function(w){ze=w},this.setTransparentSort=function(w){U=w},this.getClearColor=function(w){return w.copy(we.getClearColor())},this.setClearColor=function(){we.setClearColor(...arguments)},this.getClearAlpha=function(){return we.getClearAlpha()},this.setClearAlpha=function(){we.setClearAlpha(...arguments)},this.clear=function(w=!0,O=!0,V=!0){let X=0;if(w){let B=!1;if(M!==null){const Y=M.texture.format;B=x.has(Y)}if(B){const Y=M.texture.type,he=_.has(Y),ue=we.getClearColor(),me=we.getClearAlpha(),Ae=ue.r,ge=ue.g,Ne=ue.b;he?(m[0]=Ae,m[1]=ge,m[2]=Ne,m[3]=me,z.clearBufferuiv(z.COLOR,0,m)):(h[0]=Ae,h[1]=ge,h[2]=Ne,h[3]=me,z.clearBufferiv(z.COLOR,0,h))}else X|=z.COLOR_BUFFER_BIT}O&&(X|=z.DEPTH_BUFFER_BIT),V&&(X|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",pe,!1),t.removeEventListener("webglcontextrestored",le,!1),t.removeEventListener("webglcontextcreationerror",Be,!1),we.dispose(),Ce.dispose(),Je.dispose(),$e.dispose(),I.dispose(),A.dispose(),de.dispose(),k.dispose(),Pe.dispose(),ie.dispose(),Ee.dispose(),Ee.removeEventListener("sessionstart",Jn),Ee.removeEventListener("sessionend",Ri),jn.stop()};function pe(w){w.preventDefault(),Zc("WebGLRenderer: Context Lost."),P=!0}function le(){Zc("WebGLRenderer: Context Restored."),P=!1;const w=It.autoReset,O=fe.enabled,V=fe.autoUpdate,X=fe.needsUpdate,B=fe.type;Te(),It.autoReset=w,fe.enabled=O,fe.autoUpdate=V,fe.needsUpdate=X,fe.type=B}function Be(w){Gt("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function nt(w){const O=w.target;O.removeEventListener("dispose",nt),yt(O)}function yt(w){Ut(w),$e.remove(w)}function Ut(w){const O=$e.get(w).programs;O!==void 0&&(O.forEach(function(V){ie.releaseProgram(V)}),w.isShaderMaterial&&ie.releaseShaderCache(w))}this.renderBufferDirect=function(w,O,V,X,B,Y){O===null&&(O=Rt);const he=B.isMesh&&B.matrixWorld.determinant()<0,ue=W(w,O,V,X,B);Ve.setMaterial(X,he);let me=V.index,Ae=1;if(X.wireframe===!0){if(me=oe.getWireframeAttribute(V),me===void 0)return;Ae=2}const ge=V.drawRange,Ne=V.attributes.position;let Ke=ge.start*Ae,ht=(ge.start+ge.count)*Ae;Y!==null&&(Ke=Math.max(Ke,Y.start*Ae),ht=Math.min(ht,(Y.start+Y.count)*Ae)),me!==null?(Ke=Math.max(Ke,0),ht=Math.min(ht,me.count)):Ne!=null&&(Ke=Math.max(Ke,0),ht=Math.min(ht,Ne.count));const Mt=ht-Ke;if(Mt<0||Mt===1/0)return;k.setup(B,X,ue,V,me);let St,mt=je;if(me!==null&&(St=K.get(me),mt=Oe,mt.setIndex(St)),B.isMesh)X.wireframe===!0?(Ve.setLineWidth(X.wireframeLinewidth*Tt()),mt.setMode(z.LINES)):mt.setMode(z.TRIANGLES);else if(B.isLine){let Ge=X.linewidth;Ge===void 0&&(Ge=1),Ve.setLineWidth(Ge*Tt()),B.isLineSegments?mt.setMode(z.LINES):B.isLineLoop?mt.setMode(z.LINE_LOOP):mt.setMode(z.LINE_STRIP)}else B.isPoints?mt.setMode(z.POINTS):B.isSprite&&mt.setMode(z.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)or("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),mt.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(ct.get("WEBGL_multi_draw"))mt.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Ge=B._multiDrawStarts,Pt=B._multiDrawCounts,at=B._multiDrawCount,zt=me?K.get(me).bytesPerElement:1,_n=$e.get(X).currentProgram.getUniforms();for(let Yt=0;Yt<at;Yt++)_n.setValue(z,"_gl_DrawID",Yt),mt.render(Ge[Yt]/zt,Pt[Yt])}else if(B.isInstancedMesh)mt.renderInstances(Ke,Mt,B.count);else if(V.isInstancedBufferGeometry){const Ge=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Pt=Math.min(V.instanceCount,Ge);mt.renderInstances(Ke,Mt,Pt)}else mt.render(Ke,Mt)};function wn(w,O,V){w.transparent===!0&&w.side===gt&&w.forceSinglePass===!1?(w.side=an,w.needsUpdate=!0,Pi(w,O,V),w.side=Ci,w.needsUpdate=!0,Pi(w,O,V),w.side=gt):Pi(w,O,V)}this.compile=function(w,O,V=null){V===null&&(V=w),S=Je.get(V),S.init(O),E.push(S),V.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(S.pushLight(B),B.castShadow&&S.pushShadow(B))}),w!==V&&w.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(S.pushLight(B),B.castShadow&&S.pushShadow(B))}),S.setupLights();const X=new Set;return w.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const Y=B.material;if(Y)if(Array.isArray(Y))for(let he=0;he<Y.length;he++){const ue=Y[he];wn(ue,V,B),X.add(ue)}else wn(Y,V,B),X.add(Y)}),S=E.pop(),X},this.compileAsync=function(w,O,V=null){const X=this.compile(w,O,V);return new Promise(B=>{function Y(){if(X.forEach(function(he){$e.get(he).currentProgram.isReady()&&X.delete(he)}),X.size===0){B(w);return}setTimeout(Y,10)}ct.get("KHR_parallel_shader_compile")!==null?Y():setTimeout(Y,10)})};let pn=null;function xr(w){pn&&pn(w)}function Jn(){jn.stop()}function Ri(){jn.start()}const jn=new Qh;jn.setAnimationLoop(xr),typeof self<"u"&&jn.setContext(self),this.setAnimationLoop=function(w){pn=w,Ee.setAnimationLoop(w),w===null?jn.stop():jn.start()},Ee.addEventListener("sessionstart",Jn),Ee.addEventListener("sessionend",Ri),this.render=function(w,O){if(O!==void 0&&O.isCamera!==!0){Gt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Ee.enabled===!0&&Ee.isPresenting===!0&&(Ee.cameraAutoUpdate===!0&&Ee.updateCamera(O),O=Ee.getCamera()),w.isScene===!0&&w.onBeforeRender(T,w,O,M),S=Je.get(w,E.length),S.init(O),E.push(S),be.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Z.setFromProjectionMatrix(be,Yn,O.reversedDepth),_e=this.localClippingEnabled,$=He.init(this.clippingPlanes,_e),v=Ce.get(w,y.length),v.init(),y.push(v),Ee.enabled===!0&&Ee.isPresenting===!0){const Y=T.xr.getDepthSensingMesh();Y!==null&&Fs(Y,O,-1/0,T.sortObjects)}Fs(w,O,0,T.sortObjects),v.finish(),T.sortObjects===!0&&v.sort(ze,U),Ze=Ee.enabled===!1||Ee.isPresenting===!1||Ee.hasDepthSensing()===!1,Ze&&we.addToRenderList(v,w),this.info.render.frame++,$===!0&&He.beginShadows();const V=S.state.shadowsArray;fe.render(V,w,O),$===!0&&He.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=v.opaque,B=v.transmissive;if(S.setupLights(),O.isArrayCamera){const Y=O.cameras;if(B.length>0)for(let he=0,ue=Y.length;he<ue;he++){const me=Y[he];_r(X,B,w,me)}Ze&&we.render(w);for(let he=0,ue=Y.length;he<ue;he++){const me=Y[he];gr(v,w,me,me.viewport)}}else B.length>0&&_r(X,B,w,O),Ze&&we.render(w),gr(v,w,O);M!==null&&b===0&&(rt.updateMultisampleRenderTarget(M),rt.updateRenderTargetMipmap(M)),w.isScene===!0&&w.onAfterRender(T,w,O),k.resetDefaultState(),C=-1,D=null,E.pop(),E.length>0?(S=E[E.length-1],$===!0&&He.setGlobalState(T.clippingPlanes,S.state.camera)):S=null,y.pop(),y.length>0?v=y[y.length-1]:v=null};function Fs(w,O,V,X){if(w.visible===!1)return;if(w.layers.test(O.layers)){if(w.isGroup)V=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(O);else if(w.isLight)S.pushLight(w),w.castShadow&&S.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Z.intersectsSprite(w)){X&&Ye.setFromMatrixPosition(w.matrixWorld).applyMatrix4(be);const he=de.update(w),ue=w.material;ue.visible&&v.push(w,he,ue,V,Ye.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Z.intersectsObject(w))){const he=de.update(w),ue=w.material;if(X&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ye.copy(w.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),Ye.copy(he.boundingSphere.center)),Ye.applyMatrix4(w.matrixWorld).applyMatrix4(be)),Array.isArray(ue)){const me=he.groups;for(let Ae=0,ge=me.length;Ae<ge;Ae++){const Ne=me[Ae],Ke=ue[Ne.materialIndex];Ke&&Ke.visible&&v.push(w,he,Ke,V,Ye.z,Ne)}}else ue.visible&&v.push(w,he,ue,V,Ye.z,null)}}const Y=w.children;for(let he=0,ue=Y.length;he<ue;he++)Fs(Y[he],O,V,X)}function gr(w,O,V,X){const{opaque:B,transmissive:Y,transparent:he}=w;S.setupLightsView(V),$===!0&&He.setGlobalState(T.clippingPlanes,V),X&&Ve.viewport(H.copy(X)),B.length>0&&Zt(B,O,V),Y.length>0&&Zt(Y,O,V),he.length>0&&Zt(he,O,V),Ve.buffers.depth.setTest(!0),Ve.buffers.depth.setMask(!0),Ve.buffers.color.setMask(!0),Ve.setPolygonOffset(!1)}function _r(w,O,V,X){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;S.state.transmissionRenderTarget[X.id]===void 0&&(S.state.transmissionRenderTarget[X.id]=new On(1,1,{generateMipmaps:!0,type:ct.has("EXT_color_buffer_half_float")||ct.has("EXT_color_buffer_float")?Zn:$n,minFilter:Xi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Et.workingColorSpace}));const Y=S.state.transmissionRenderTarget[X.id],he=X.viewport||H;Y.setSize(he.z*T.transmissionResolutionScale,he.w*T.transmissionResolutionScale);const ue=T.getRenderTarget(),me=T.getActiveCubeFace(),Ae=T.getActiveMipmapLevel();T.setRenderTarget(Y),T.getClearColor(te),re=T.getClearAlpha(),re<1&&T.setClearColor(16777215,.5),T.clear(),Ze&&we.render(V);const ge=T.toneMapping;T.toneMapping=Ei;const Ne=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),S.setupLightsView(X),$===!0&&He.setGlobalState(T.clippingPlanes,X),Zt(w,V,X),rt.updateMultisampleRenderTarget(Y),rt.updateRenderTargetMipmap(Y),ct.has("WEBGL_multisampled_render_to_texture")===!1){let Ke=!1;for(let ht=0,Mt=O.length;ht<Mt;ht++){const St=O[ht],{object:mt,geometry:Ge,material:Pt,group:at}=St;if(Pt.side===gt&&mt.layers.test(X.layers)){const zt=Pt.side;Pt.side=an,Pt.needsUpdate=!0,vr(mt,V,X,Ge,Pt,at),Pt.side=zt,Pt.needsUpdate=!0,Ke=!0}}Ke===!0&&(rt.updateMultisampleRenderTarget(Y),rt.updateRenderTargetMipmap(Y))}T.setRenderTarget(ue,me,Ae),T.setClearColor(te,re),Ne!==void 0&&(X.viewport=Ne),T.toneMapping=ge}function Zt(w,O,V){const X=O.isScene===!0?O.overrideMaterial:null;for(let B=0,Y=w.length;B<Y;B++){const he=w[B],{object:ue,geometry:me,group:Ae}=he;let ge=he.material;ge.allowOverride===!0&&X!==null&&(ge=X),ue.layers.test(V.layers)&&vr(ue,O,V,me,ge,Ae)}}function vr(w,O,V,X,B,Y){w.onBeforeRender(T,O,V,X,B,Y),w.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),B.onBeforeRender(T,O,V,X,w,Y),B.transparent===!0&&B.side===gt&&B.forceSinglePass===!1?(B.side=an,B.needsUpdate=!0,T.renderBufferDirect(V,O,X,B,w,Y),B.side=Ci,B.needsUpdate=!0,T.renderBufferDirect(V,O,X,B,w,Y),B.side=gt):T.renderBufferDirect(V,O,X,B,w,Y),w.onAfterRender(T,O,V,X,B,Y)}function Pi(w,O,V){O.isScene!==!0&&(O=Rt);const X=$e.get(w),B=S.state.lights,Y=S.state.shadowsArray,he=B.state.version,ue=ie.getParameters(w,B.state,Y,O,V),me=ie.getProgramCacheKey(ue);let Ae=X.programs;X.environment=w.isMeshStandardMaterial?O.environment:null,X.fog=O.fog,X.envMap=(w.isMeshStandardMaterial?A:I).get(w.envMap||X.environment),X.envMapRotation=X.environment!==null&&w.envMap===null?O.environmentRotation:w.envMapRotation,Ae===void 0&&(w.addEventListener("dispose",nt),Ae=new Map,X.programs=Ae);let ge=Ae.get(me);if(ge!==void 0){if(X.currentProgram===ge&&X.lightsStateVersion===he)return F(w,ue),ge}else ue.uniforms=ie.getUniforms(w),w.onBeforeCompile(ue,T),ge=ie.acquireProgram(ue,me),Ae.set(me,ge),X.uniforms=ue.uniforms;const Ne=X.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ne.clippingPlanes=He.uniform),F(w,ue),X.needsLights=ee(w),X.lightsStateVersion=he,X.needsLights&&(Ne.ambientLightColor.value=B.state.ambient,Ne.lightProbe.value=B.state.probe,Ne.directionalLights.value=B.state.directional,Ne.directionalLightShadows.value=B.state.directionalShadow,Ne.spotLights.value=B.state.spot,Ne.spotLightShadows.value=B.state.spotShadow,Ne.rectAreaLights.value=B.state.rectArea,Ne.ltc_1.value=B.state.rectAreaLTC1,Ne.ltc_2.value=B.state.rectAreaLTC2,Ne.pointLights.value=B.state.point,Ne.pointLightShadows.value=B.state.pointShadow,Ne.hemisphereLights.value=B.state.hemi,Ne.directionalShadowMap.value=B.state.directionalShadowMap,Ne.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Ne.spotShadowMap.value=B.state.spotShadowMap,Ne.spotLightMatrix.value=B.state.spotLightMatrix,Ne.spotLightMap.value=B.state.spotLightMap,Ne.pointShadowMap.value=B.state.pointShadowMap,Ne.pointShadowMatrix.value=B.state.pointShadowMatrix),X.currentProgram=ge,X.uniformsList=null,ge}function N(w){if(w.uniformsList===null){const O=w.currentProgram.getUniforms();w.uniformsList=Qr.seqWithValue(O.seq,w.uniforms)}return w.uniformsList}function F(w,O){const V=$e.get(w);V.outputColorSpace=O.outputColorSpace,V.batching=O.batching,V.batchingColor=O.batchingColor,V.instancing=O.instancing,V.instancingColor=O.instancingColor,V.instancingMorph=O.instancingMorph,V.skinning=O.skinning,V.morphTargets=O.morphTargets,V.morphNormals=O.morphNormals,V.morphColors=O.morphColors,V.morphTargetsCount=O.morphTargetsCount,V.numClippingPlanes=O.numClippingPlanes,V.numIntersection=O.numClipIntersection,V.vertexAlphas=O.vertexAlphas,V.vertexTangents=O.vertexTangents,V.toneMapping=O.toneMapping}function W(w,O,V,X,B){O.isScene!==!0&&(O=Rt),rt.resetTextureUnits();const Y=O.fog,he=X.isMeshStandardMaterial?O.environment:null,ue=M===null?T.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:As,me=(X.isMeshStandardMaterial?A:I).get(X.envMap||he),Ae=X.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,ge=!!V.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ne=!!V.morphAttributes.position,Ke=!!V.morphAttributes.normal,ht=!!V.morphAttributes.color;let Mt=Ei;X.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(Mt=T.toneMapping);const St=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,mt=St!==void 0?St.length:0,Ge=$e.get(X),Pt=S.state.lights;if($===!0&&(_e===!0||w!==D)){const ln=w===D&&X.id===C;He.setState(X,w,ln)}let at=!1;X.version===Ge.__version?(Ge.needsLights&&Ge.lightsStateVersion!==Pt.state.version||Ge.outputColorSpace!==ue||B.isBatchedMesh&&Ge.batching===!1||!B.isBatchedMesh&&Ge.batching===!0||B.isBatchedMesh&&Ge.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Ge.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Ge.instancing===!1||!B.isInstancedMesh&&Ge.instancing===!0||B.isSkinnedMesh&&Ge.skinning===!1||!B.isSkinnedMesh&&Ge.skinning===!0||B.isInstancedMesh&&Ge.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Ge.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Ge.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Ge.instancingMorph===!1&&B.morphTexture!==null||Ge.envMap!==me||X.fog===!0&&Ge.fog!==Y||Ge.numClippingPlanes!==void 0&&(Ge.numClippingPlanes!==He.numPlanes||Ge.numIntersection!==He.numIntersection)||Ge.vertexAlphas!==Ae||Ge.vertexTangents!==ge||Ge.morphTargets!==Ne||Ge.morphNormals!==Ke||Ge.morphColors!==ht||Ge.toneMapping!==Mt||Ge.morphTargetsCount!==mt)&&(at=!0):(at=!0,Ge.__version=X.version);let zt=Ge.currentProgram;at===!0&&(zt=Pi(X,O,B));let _n=!1,Yt=!1,Vn=!1;const kt=zt.getUniforms(),mn=Ge.uniforms;if(Ve.useProgram(zt.program)&&(_n=!0,Yt=!0,Vn=!0),X.id!==C&&(C=X.id,Yt=!0),_n||D!==w){Ve.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),kt.setValue(z,"projectionMatrix",w.projectionMatrix),kt.setValue(z,"viewMatrix",w.matrixWorldInverse);const xn=kt.map.cameraPosition;xn!==void 0&&xn.setValue(z,Re.setFromMatrixPosition(w.matrixWorld)),At.logarithmicDepthBuffer&&kt.setValue(z,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&kt.setValue(z,"isOrthographic",w.isOrthographicCamera===!0),D!==w&&(D=w,Yt=!0,Vn=!0)}if(B.isSkinnedMesh){kt.setOptional(z,B,"bindMatrix"),kt.setOptional(z,B,"bindMatrixInverse");const ln=B.skeleton;ln&&(ln.boneTexture===null&&ln.computeBoneTexture(),kt.setValue(z,"boneTexture",ln.boneTexture,rt))}B.isBatchedMesh&&(kt.setOptional(z,B,"batchingTexture"),kt.setValue(z,"batchingTexture",B._matricesTexture,rt),kt.setOptional(z,B,"batchingIdTexture"),kt.setValue(z,"batchingIdTexture",B._indirectTexture,rt),kt.setOptional(z,B,"batchingColorTexture"),B._colorsTexture!==null&&kt.setValue(z,"batchingColorTexture",B._colorsTexture,rt));const Tn=V.morphAttributes;if((Tn.position!==void 0||Tn.normal!==void 0||Tn.color!==void 0)&&Qe.update(B,V,zt),(Yt||Ge.receiveShadow!==B.receiveShadow)&&(Ge.receiveShadow=B.receiveShadow,kt.setValue(z,"receiveShadow",B.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(mn.envMap.value=me,mn.flipEnvMap.value=me.isCubeTexture&&me.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&O.environment!==null&&(mn.envMapIntensity.value=O.environmentIntensity),mn.dfgLUT!==void 0&&(mn.dfgLUT.value=Eg()),Yt&&(kt.setValue(z,"toneMappingExposure",T.toneMappingExposure),Ge.needsLights&&Q(mn,Vn),Y&&X.fog===!0&&ke.refreshFogUniforms(mn,Y),ke.refreshMaterialUniforms(mn,X,Me,xe,S.state.transmissionRenderTarget[w.id]),Qr.upload(z,N(Ge),mn,rt)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Qr.upload(z,N(Ge),mn,rt),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&kt.setValue(z,"center",B.center),kt.setValue(z,"modelViewMatrix",B.modelViewMatrix),kt.setValue(z,"normalMatrix",B.normalMatrix),kt.setValue(z,"modelMatrix",B.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const ln=X.uniformsGroups;for(let xn=0,ba=ln.length;xn<ba;xn++){const Li=ln[xn];Pe.update(Li,zt),Pe.bind(Li,zt)}}return zt}function Q(w,O){w.ambientLightColor.needsUpdate=O,w.lightProbe.needsUpdate=O,w.directionalLights.needsUpdate=O,w.directionalLightShadows.needsUpdate=O,w.pointLights.needsUpdate=O,w.pointLightShadows.needsUpdate=O,w.spotLights.needsUpdate=O,w.spotLightShadows.needsUpdate=O,w.rectAreaLights.needsUpdate=O,w.hemisphereLights.needsUpdate=O}function ee(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(w,O,V){const X=$e.get(w);X.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),$e.get(w.texture).__webglTexture=O,$e.get(w.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:V,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,O){const V=$e.get(w);V.__webglFramebuffer=O,V.__useDefaultFramebuffer=O===void 0};const ae=z.createFramebuffer();this.setRenderTarget=function(w,O=0,V=0){M=w,R=O,b=V;let X=!0,B=null,Y=!1,he=!1;if(w){const me=$e.get(w);if(me.__useDefaultFramebuffer!==void 0)Ve.bindFramebuffer(z.FRAMEBUFFER,null),X=!1;else if(me.__webglFramebuffer===void 0)rt.setupRenderTarget(w);else if(me.__hasExternalTextures)rt.rebindTextures(w,$e.get(w.texture).__webglTexture,$e.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Ne=w.depthTexture;if(me.__boundDepthTexture!==Ne){if(Ne!==null&&$e.has(Ne)&&(w.width!==Ne.image.width||w.height!==Ne.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");rt.setupDepthRenderbuffer(w)}}const Ae=w.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(he=!0);const ge=$e.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(ge[O])?B=ge[O][V]:B=ge[O],Y=!0):w.samples>0&&rt.useMultisampledRTT(w)===!1?B=$e.get(w).__webglMultisampledFramebuffer:Array.isArray(ge)?B=ge[V]:B=ge,H.copy(w.viewport),J.copy(w.scissor),j=w.scissorTest}else H.copy(ye).multiplyScalar(Me).floor(),J.copy(ve).multiplyScalar(Me).floor(),j=Se;if(V!==0&&(B=ae),Ve.bindFramebuffer(z.FRAMEBUFFER,B)&&X&&Ve.drawBuffers(w,B),Ve.viewport(H),Ve.scissor(J),Ve.setScissorTest(j),Y){const me=$e.get(w.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+O,me.__webglTexture,V)}else if(he){const me=O;for(let Ae=0;Ae<w.textures.length;Ae++){const ge=$e.get(w.textures[Ae]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+Ae,ge.__webglTexture,V,me)}}else if(w!==null&&V!==0){const me=$e.get(w.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,me.__webglTexture,V)}C=-1},this.readRenderTargetPixels=function(w,O,V,X,B,Y,he,ue=0){if(!(w&&w.isWebGLRenderTarget)){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let me=$e.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&he!==void 0&&(me=me[he]),me){Ve.bindFramebuffer(z.FRAMEBUFFER,me);try{const Ae=w.textures[ue],ge=Ae.format,Ne=Ae.type;if(!At.textureFormatReadable(ge)){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!At.textureTypeReadable(Ne)){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=w.width-X&&V>=0&&V<=w.height-B&&(w.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+ue),z.readPixels(O,V,X,B,it.convert(ge),it.convert(Ne),Y))}finally{const Ae=M!==null?$e.get(M).__webglFramebuffer:null;Ve.bindFramebuffer(z.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(w,O,V,X,B,Y,he,ue=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let me=$e.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&he!==void 0&&(me=me[he]),me)if(O>=0&&O<=w.width-X&&V>=0&&V<=w.height-B){Ve.bindFramebuffer(z.FRAMEBUFFER,me);const Ae=w.textures[ue],ge=Ae.format,Ne=Ae.type;if(!At.textureFormatReadable(ge))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!At.textureTypeReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ke=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,Ke),z.bufferData(z.PIXEL_PACK_BUFFER,Y.byteLength,z.STREAM_READ),w.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+ue),z.readPixels(O,V,X,B,it.convert(ge),it.convert(Ne),0);const ht=M!==null?$e.get(M).__webglFramebuffer:null;Ve.bindFramebuffer(z.FRAMEBUFFER,ht);const Mt=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await lu(z,Mt,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,Ke),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,Y),z.deleteBuffer(Ke),z.deleteSync(Mt),Y}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,O=null,V=0){const X=Math.pow(2,-V),B=Math.floor(w.image.width*X),Y=Math.floor(w.image.height*X),he=O!==null?O.x:0,ue=O!==null?O.y:0;rt.setTexture2D(w,0),z.copyTexSubImage2D(z.TEXTURE_2D,V,0,0,he,ue,B,Y),Ve.unbindTexture()};const ne=z.createFramebuffer(),Le=z.createFramebuffer();this.copyTextureToTexture=function(w,O,V=null,X=null,B=0,Y=null){Y===null&&(B!==0?(or("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Y=B,B=0):Y=0);let he,ue,me,Ae,ge,Ne,Ke,ht,Mt;const St=w.isCompressedTexture?w.mipmaps[Y]:w.image;if(V!==null)he=V.max.x-V.min.x,ue=V.max.y-V.min.y,me=V.isBox3?V.max.z-V.min.z:1,Ae=V.min.x,ge=V.min.y,Ne=V.isBox3?V.min.z:0;else{const Tn=Math.pow(2,-B);he=Math.floor(St.width*Tn),ue=Math.floor(St.height*Tn),w.isDataArrayTexture?me=St.depth:w.isData3DTexture?me=Math.floor(St.depth*Tn):me=1,Ae=0,ge=0,Ne=0}X!==null?(Ke=X.x,ht=X.y,Mt=X.z):(Ke=0,ht=0,Mt=0);const mt=it.convert(O.format),Ge=it.convert(O.type);let Pt;O.isData3DTexture?(rt.setTexture3D(O,0),Pt=z.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(rt.setTexture2DArray(O,0),Pt=z.TEXTURE_2D_ARRAY):(rt.setTexture2D(O,0),Pt=z.TEXTURE_2D),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,O.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,O.unpackAlignment);const at=z.getParameter(z.UNPACK_ROW_LENGTH),zt=z.getParameter(z.UNPACK_IMAGE_HEIGHT),_n=z.getParameter(z.UNPACK_SKIP_PIXELS),Yt=z.getParameter(z.UNPACK_SKIP_ROWS),Vn=z.getParameter(z.UNPACK_SKIP_IMAGES);z.pixelStorei(z.UNPACK_ROW_LENGTH,St.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,St.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,Ae),z.pixelStorei(z.UNPACK_SKIP_ROWS,ge),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Ne);const kt=w.isDataArrayTexture||w.isData3DTexture,mn=O.isDataArrayTexture||O.isData3DTexture;if(w.isDepthTexture){const Tn=$e.get(w),ln=$e.get(O),xn=$e.get(Tn.__renderTarget),ba=$e.get(ln.__renderTarget);Ve.bindFramebuffer(z.READ_FRAMEBUFFER,xn.__webglFramebuffer),Ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,ba.__webglFramebuffer);for(let Li=0;Li<me;Li++)kt&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,$e.get(w).__webglTexture,B,Ne+Li),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,$e.get(O).__webglTexture,Y,Mt+Li)),z.blitFramebuffer(Ae,ge,he,ue,Ke,ht,he,ue,z.DEPTH_BUFFER_BIT,z.NEAREST);Ve.bindFramebuffer(z.READ_FRAMEBUFFER,null),Ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(B!==0||w.isRenderTargetTexture||$e.has(w)){const Tn=$e.get(w),ln=$e.get(O);Ve.bindFramebuffer(z.READ_FRAMEBUFFER,ne),Ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,Le);for(let xn=0;xn<me;xn++)kt?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Tn.__webglTexture,B,Ne+xn):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,Tn.__webglTexture,B),mn?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,ln.__webglTexture,Y,Mt+xn):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,ln.__webglTexture,Y),B!==0?z.blitFramebuffer(Ae,ge,he,ue,Ke,ht,he,ue,z.COLOR_BUFFER_BIT,z.NEAREST):mn?z.copyTexSubImage3D(Pt,Y,Ke,ht,Mt+xn,Ae,ge,he,ue):z.copyTexSubImage2D(Pt,Y,Ke,ht,Ae,ge,he,ue);Ve.bindFramebuffer(z.READ_FRAMEBUFFER,null),Ve.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else mn?w.isDataTexture||w.isData3DTexture?z.texSubImage3D(Pt,Y,Ke,ht,Mt,he,ue,me,mt,Ge,St.data):O.isCompressedArrayTexture?z.compressedTexSubImage3D(Pt,Y,Ke,ht,Mt,he,ue,me,mt,St.data):z.texSubImage3D(Pt,Y,Ke,ht,Mt,he,ue,me,mt,Ge,St):w.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,Y,Ke,ht,he,ue,mt,Ge,St.data):w.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,Y,Ke,ht,St.width,St.height,mt,St.data):z.texSubImage2D(z.TEXTURE_2D,Y,Ke,ht,he,ue,mt,Ge,St);z.pixelStorei(z.UNPACK_ROW_LENGTH,at),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,zt),z.pixelStorei(z.UNPACK_SKIP_PIXELS,_n),z.pixelStorei(z.UNPACK_SKIP_ROWS,Yt),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Vn),Y===0&&O.generateMipmaps&&z.generateMipmap(Pt),Ve.unbindTexture()},this.initRenderTarget=function(w){$e.get(w).__webglFramebuffer===void 0&&rt.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?rt.setTextureCube(w,0):w.isData3DTexture?rt.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?rt.setTexture2DArray(w,0):rt.setTexture2D(w,0),Ve.unbindTexture()},this.resetState=function(){R=0,b=0,M=null,Ve.reset(),k.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Et._getDrawingBufferColorSpace(e),t.unpackColorSpace=Et._getUnpackColorSpace()}}const ea={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Us{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Cg=new Dc(-1,1,1,-1,0,1);class Rg extends Wt{constructor(){super(),this.setAttribute("position",new wt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new wt([0,2,0,0,2,0],2))}}const Pg=new Rg;class Ic{constructor(e){this._mesh=new G(Pg,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Cg)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class sd extends Us{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof rn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=lr.clone(e.uniforms),this.material=new rn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Ic(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Ql extends Us{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Lg extends Us{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Dg{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Ie);this._width=n.width,this._height=n.height,t=new On(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Zn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new sd(ea),this.copyPass.material.blending=qn,this.clock=new jh}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Ql!==void 0&&(a instanceof Ql?n=!0:a instanceof Lg&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ie);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Ig extends Us{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new tt}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const Ug={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new tt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ps extends Us{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new Ie(e.x,e.y):new Ie(256,256),this.clearColor=new tt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new On(r,a,{type:Zn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new On(r,a,{type:Zn});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new On(r,a,{type:Zn});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=Ug;this.highPassUniforms=lr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new rn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Ie(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1),new L(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=lr.clone(ea.uniforms),this.blendMaterial=new rn({uniforms:this.copyUniforms,vertexShader:ea.vertexShader,fragmentShader:ea.fragmentShader,blending:Wi,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new tt,this._oldClearAlpha=1,this._basic=new Lt,this._fsQuad=new Ic(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Ie(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=Ps.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Ps.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new rn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ie(.5,.5)},direction:{value:new Ie(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new rn({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Ps.BlurDirectionX=new Ie(1,0);Ps.BlurDirectionY=new Ie(0,1);const Yr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Ng extends Us{constructor(){super(),this.uniforms=lr.clone(Yr.uniforms),this.material=new Df({name:Yr.name,uniforms:this.uniforms,vertexShader:Yr.vertexShader,fragmentShader:Yr.fragmentShader}),this._fsQuad=new Ic(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Et.getTransfer(this._outputColorSpace)===Nt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===gh?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===_h?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===vh?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===hc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Sh?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===yh?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Mh&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Fg extends zh{constructor(){super();const e=new De;e.deleteAttribute("uv");const t=new q({side:an}),n=new q,s=new Lc(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new G(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new nn(e,n,6),o=new Ht;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const c=new G(e,gs(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const l=new G(e,gs(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);const d=new G(e,gs(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new G(e,gs(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const f=new G(e,gs(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);const p=new G(e,gs(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function gs(i){return new If({color:0,emissive:16777215,emissiveIntensity:i})}const mr=document.querySelector("#game"),Qt=new Ag({canvas:mr,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});Qt.setPixelRatio(Math.min(window.devicePixelRatio,2));Qt.setSize(window.innerWidth,window.innerHeight);Qt.shadowMap.enabled=!0;Qt.shadowMap.type=xh;Qt.outputColorSpace=Ct;Qt.toneMapping=hc;Qt.toneMappingExposure=1.18;const st=new zh;st.background=new tt(5814015);st.fog=new wc(10213371,185,1460);const rd=new nc(Qt);rd.compileEquirectangularShader();st.environment=rd.fromScene(new Fg,.04).texture;st.environmentIntensity=.62;const dt=new Sn(69,window.innerWidth/window.innerHeight,.08,1800);st.add(dt);const et={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const vt=new Set,Fe={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},Og=new jh,sn=new L(0,1,0),ad=new L,od=new L,Uc=new L,Dn=new Ht,cd=.86,sc=1.2,Bg=.78,hi=.55,ai={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},ji=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],ld=Math.max(...ji.map(i=>i.width));let ta=0,ce=ji[0];const g={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamPos:new L,best:Number(localStorage.getItem("steel-ribbon-best")||0)};et.best.textContent=`Best score ${g.best}`;function zg(i){const e=Xe.clamp(i,0,1);return e*e*(3-2*e)}function kg(i,e){let t=0;for(const n of i.gaps){const s=n.start-n.approach,r=n.start+n.carry,a=n.end+n.settle;e>=s&&e<=r?t+=n.rise*Xe.clamp((e-s)/(n.approach+n.carry),0,1):e>r&&e<=n.end?t+=n.rise:e>n.end&&e<=a&&(t+=n.rise*(1-zg((e-n.end)/n.settle)))}return t}function Nc(i,e){const t=(e%i.length+i.length)%i.length,n=t/i.length*Math.PI*2,s=i.shape,r=Math.sin(n)*s.x1+Math.sin(n*2)*s.x2+Math.cos(n*3)*s.x3,a=Math.cos(n)*s.z1+Math.cos(n*2)*s.z2+Math.sin(n*3)*s.z3;return{x:r,z:a,t:n,n:t}}function hd(i,e){const{t,n}=Nc(i,e),s=i.shape;let r=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const a of i.ramps){let o=n-a.s;o>i.length/2&&(o-=i.length),o<-i.length/2&&(o+=i.length),r+=a.amp*Math.exp(-(o*o)/(a.width*a.width))}return r+=kg(i,n),r}function qr(i){const{x:e,z:t,n}=Nc(ce,i),s=hd(ce,n);return new L(e,s,t)}function bt(i){const e=(i%ce.length+ce.length)%ce.length,t=qr(e),s=qr(e+2).sub(t).normalize(),r=ad.crossVectors(sn,s).normalize(),a=qr(e-2).y,o=qr(e+2).y,c=Math.atan2(o-a,4),l=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,d=ce.gaps.find(u=>e>u.start&&e<u.end);return{s:e,p:t,tangent:s,side:r.clone(),grade:c,bank:l,gap:d}}function Ai(i){const e=(i%ce.length+ce.length)%ce.length;return ce.gaps.some(t=>e>t.start&&e<t.end)}function eh(i){return Xe.clamp(i/(ce.length*ce.laps),0,1)}function Vg(i,e,t){const n=Math.floor(i/ce.length),s=Math.floor(e/ce.length);for(let r=n;r<=s;r++){const a=r*ce.length+t;if(i<a&&e>=a)return!0}return!1}function Gg(i=256,e=8){const t=document.createElement("canvas");t.width=i,t.height=i;const n=t.getContext("2d"),s=i/e;for(let a=0;a<e;a++)for(let o=0;o<e;o++)n.fillStyle=(o+a)%2?"#101318":"#f5f1df",n.fillRect(o*s,a*s,s,s);const r=new Jt(t);return r.colorSpace=Ct,r.wrapS=cn,r.wrapT=cn,r.repeat.set(3,1),r}function Hg(i=512){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,0);n.addColorStop(0,"#9c9b77"),n.addColorStop(.18,"#c9c69a"),n.addColorStop(.5,"#9f9f79"),n.addColorStop(.82,"#c0bd91"),n.addColorStop(1,"#858563"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let r=0;r<i;r+=64)t.beginPath(),t.moveTo(0,r+2),t.lineTo(i,r+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const r of[48,464])t.beginPath(),t.moveTo(r,0),t.lineTo(r,i),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let r=0;r<42;r++){const a=i*(.28+Math.random()*.44),o=Math.random()*i;t.beginPath(),t.moveTo(a,o),t.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)t.beginPath(),t.ellipse(Math.random()*i,Math.random()*i,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new Jt(e);return s.colorSpace=Ct,s.wrapS=cn,s.wrapT=cn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function Wg(i=1024){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#2e6a40"),n.addColorStop(.42,"#487443"),n.addColorStop(1,"#1f4a37"),t.fillStyle=n,t.fillRect(0,0,i,i);for(let r=0;r<3600;r++){const a=.035+Math.random()*.08,o=72+Math.floor(Math.random()*70);t.fillStyle=`rgba(${38+Math.random()*30}, ${o}, ${38+Math.random()*26}, ${a})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*4,1+Math.random()*4)}t.strokeStyle="rgba(210, 220, 150, 0.08)",t.lineWidth=2;for(let r=-i;r<i*1.5;r+=76)t.beginPath(),t.moveTo(r,0),t.lineTo(r+i*.65,i),t.stroke();const s=new Jt(e);return s.colorSpace=Ct,s.wrapS=cn,s.wrapT=cn,s.repeat.set(18,18),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function Xg(i=1024){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#263139"),n.addColorStop(.45,"#3a444a"),n.addColorStop(1,"#1b242c"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(180, 225, 255, 0.08)",t.lineWidth=1;for(let r=-i;r<i*2;r+=78)t.beginPath(),t.moveTo(r,0),t.lineTo(r+i*.32,i),t.stroke();for(let r=0;r<360;r++){const a=Math.random()*i,o=Math.random()*i,c=10+Math.random()*56,l=t.createRadialGradient(a,o,0,a,o,c);l.addColorStop(0,`rgba(145, 205, 255, ${.12+Math.random()*.15})`),l.addColorStop(.45,"rgba(80, 140, 180, 0.07)"),l.addColorStop(1,"rgba(10, 18, 24, 0)"),t.fillStyle=l,t.beginPath(),t.ellipse(a,o,c,c*(.16+Math.random()*.18),Math.random()*Math.PI,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 214, 122, 0.12)";for(let r=0;r<48;r++){const a=Math.random()*i,o=Math.random()*i;t.beginPath(),t.ellipse(a,o,8+Math.random()*36,1.5+Math.random()*4,Math.random()*Math.PI,0,Math.PI*2),t.fill()}for(let r=0;r<9200;r++){const a=36+Math.floor(Math.random()*110),o=.035+Math.random()*.075,c=Math.random()<.18?2:1;t.fillStyle=`rgba(${a}, ${a+3}, ${a+7}, ${o})`,t.fillRect(Math.random()*i,Math.random()*i,c,c)}const s=new Jt(e);return s.colorSpace=Ct,s.wrapS=cn,s.wrapT=cn,s.repeat.set(9,16),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function vs(i=128,e=256,t=.42){const n=document.createElement("canvas");n.width=i,n.height=e;const s=n.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,i,e);for(let a=10;a<e-8;a+=18)for(let o=9;o<i-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<i;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,e),s.stroke();const r=new Jt(n);return r.colorSpace=Ct,r}function Yg(i=256,e=256,t="#d9d0bd"){const n=document.createElement("canvas");n.width=i,n.height=e;const s=n.getContext("2d"),r=s.createLinearGradient(0,0,i,e);r.addColorStop(0,t),r.addColorStop(.58,"#f0e5d2"),r.addColorStop(1,"#b9b0a1"),s.fillStyle=r,s.fillRect(0,0,i,e),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const l=180+Math.random()*60;s.fillStyle=`rgba(${l}, ${l}, ${l-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*i,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,i,e*.2);const a=(c,l,d,u)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,l,d,u),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,l,d,u),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,l+2),s.lineTo(c+d*.5,l+u-2),s.moveTo(c+2,l+u*.52),s.lineTo(c+d-2,l+u*.52),s.stroke()};a(i*.12,e*.24,i*.19,e*.2),a(i*.68,e*.25,i*.2,e*.2),a(i*.43,e*.5,i*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(i*.43,e*.62,i*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(i*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new Jt(n);return o.colorSpace=Ct,o.wrapS=cn,o.wrapT=cn,o.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),o}function qg(i=512){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#e77b36"),n.addColorStop(.45,"#a63f24"),n.addColorStop(1,"#6b271d"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let r=-20;r<i+20;r+=26){t.beginPath();for(let a=-10;a<i+10;a+=12){const o=r+Math.sin((a+r)*.045)*3;a===-10?t.moveTo(a,o):t.lineTo(a,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let r=0;r<i;r+=20)t.beginPath(),t.moveTo(r,0),t.bezierCurveTo(r+8,i*.24,r-8,i*.58,r+7,i),t.stroke();for(let r=0;r<1400;r++){const a=112+Math.random()*110;t.fillStyle=`rgba(${a}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new Jt(e);return s.colorSpace=Ct,s.wrapS=cn,s.wrapT=cn,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function Zg(i=256,e=160){const t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d"),s=n.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),n.fillStyle=s,n.fillRect(0,0,i,e),n.strokeStyle="rgba(210, 225, 232, 0.18)",n.lineWidth=3;for(let a=18;a<e;a+=24)n.beginPath(),n.moveTo(8,a),n.lineTo(i-8,a),n.stroke();n.strokeStyle="rgba(8, 10, 12, 0.72)",n.lineWidth=8,n.strokeRect(4,4,i-8,e-8);const r=new Jt(t);return r.colorSpace=Ct,r}function th(i,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",n=!0){const s=document.createElement("canvas");s.width=n?128:384,s.height=n?384:128;const r=s.getContext("2d"),{width:a,height:o}=s;r.fillStyle=t,r.fillRect(0,0,a,o),r.strokeStyle=e,r.lineWidth=n?5:6,r.strokeRect(8,8,a-16,o-16),r.save(),r.translate(a/2,o/2),n&&r.rotate(-Math.PI/2),r.font=`900 ${n?54:48}px Arial, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.shadowColor=e,r.shadowBlur=18,r.fillStyle=e,r.fillText(i,0,0),r.restore();const c=new Jt(s);return c.colorSpace=Ct,c}const Si=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],la=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],yi=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function dd(i,e,t="#4ff3ff"){const n=document.createElement("canvas");n.width=640,n.height=256;const s=n.getContext("2d"),r=s.createLinearGradient(0,0,640,256);r.addColorStop(0,"#111722"),r.addColorStop(.55,"#20344a"),r.addColorStop(1,"#171024"),s.fillStyle=r,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(i,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const a=new Jt(n);return a.colorSpace=Ct,a.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),a}function so(i,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const n=t.getContext("2d");n.fillStyle="#151922",n.fillRect(0,0,384,128),n.fillStyle=e,n.fillRect(0,0,384,12),n.fillRect(0,116,384,12),n.strokeStyle="rgba(255,255,255,0.32)",n.lineWidth=4,n.strokeRect(12,16,360,96),n.shadowColor=e,n.shadowBlur=14,n.fillStyle="#f8fbff",n.font="900 38px Arial Black, Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(i,192,64,330);const s=new Jt(t);return s.colorSpace=Ct,s}function ro(i=512,e=384,t="#9d4d3d",n="#2d86b7"){const s=document.createElement("canvas");s.width=i,s.height=e;const r=s.getContext("2d"),a=r.createLinearGradient(0,0,i,e);a.addColorStop(0,t),a.addColorStop(.55,"#b96a55"),a.addColorStop(1,"#633428"),r.fillStyle=a,r.fillRect(0,0,i,e),r.strokeStyle="rgba(50, 24, 18, 0.42)",r.lineWidth=2;for(let c=18;c<e;c+=22){r.beginPath(),r.moveTo(0,c),r.lineTo(i,c),r.stroke();for(let l=Math.floor(c/22)%2*28;l<i;l+=56)r.beginPath(),r.moveTo(l,c-18),r.lineTo(l,c),r.stroke()}r.fillStyle="rgba(17, 24, 31, 0.92)",r.fillRect(34,e*.58,i-68,e*.28),r.fillStyle="rgba(120, 210, 255, 0.32)";for(let c=58;c<i-48;c+=78)r.fillRect(c,e*.62,52,e*.19);r.fillStyle=n,r.fillRect(22,e*.49,i-44,34),r.fillStyle="#f7f4df",r.font="900 42px Arial Black, Arial, sans-serif",r.textAlign="center",r.textBaseline="middle",r.shadowColor=n,r.shadowBlur=12,r.fillText("OPEN",i/2,e*.28,i*.76),r.shadowBlur=0;const o=new Jt(s);return o.colorSpace=Ct,o.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),o}function $g(i=384,e=384){const t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d");n.fillStyle="#868f96",n.fillRect(0,0,i,e);for(let r=18;r<e;r+=54)n.fillStyle="rgba(30, 38, 44, 0.62)",n.fillRect(22,r,i-44,24),n.fillStyle="rgba(215, 225, 232, 0.44)",n.fillRect(20,r+26,i-40,6);n.strokeStyle="rgba(255,255,255,0.22)",n.lineWidth=3;for(let r=0;r<i;r+=64)n.beginPath(),n.moveTo(r,0),n.lineTo(r,e),n.stroke();n.fillStyle="#ffffff",n.font="900 96px Arial Black, Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText("P",i*.5,e*.48);const s=new Jt(t);return s.colorSpace=Ct,s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function Kg(i=256){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=i/2,s=i/2,r=i*.43;t.clearRect(0,0,i,i),t.beginPath();for(let o=0;o<8;o++){const c=-Math.PI/8+o*Math.PI/4,l=n+Math.cos(c)*r,d=s+Math.sin(c)*r;o===0?t.moveTo(l,d):t.lineTo(l,d)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=i*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(i*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",n,s+i*.015);const a=new Jt(e);return a.colorSpace=Ct,a}function We(i,e){return-7+Math.sin(i*.018)*4+Math.cos(e*.014)*5+Math.sin((i+e)*.006)*10}function $s(i,e,t,n){const s=t*.5,r=n*.5;let a=We(i,e);for(const o of[-s,0,s])for(const c of[-r,0,r])a=Math.min(a,We(i+o,e+c));return a}function va(i,e,t=10){const{x0:n,x1:s,zNear:r,zFar:a,pitch:o,streetW:c}=ai;if(i<n-c||i>s+c||e<a-c||e>r+c)return!1;const l=Math.abs((i-n+o/2)%o-o/2),d=Math.abs((r-e+o/2)%o-o/2);return Math.min(l,d)<c*.5+t}function zi(i,e,t,n,s=8){const{x0:r,x1:a,zNear:o,zFar:c,pitch:l,streetW:d}=ai,u=t*.5,f=n*.5,p=d*.5+s;let x=null;const _=(m,h,v)=>{(!x||v>x.overlap)&&(x={axis:m,road:h,overlap:v})};for(let m=r;m<=a+1;m+=l){if(e+f<c-p||e-f>o+p)continue;const h=u+p-Math.abs(i-m);h>0&&_("x",Math.round(m),h)}for(let m=o;m>=c-1;m-=l){if(i+u<r-p||i-u>a+p)continue;const h=f+p-Math.abs(e-m);h>0&&_("z",Math.round(m),h)}return x}const na=[],ao=[],ud=[];let nh=0;function Gn(i,e){return ud.push({obj:i,update:e}),i}function fd(i){nh+=i;for(const e of ud)e.update(nh,i)}function pd(){if(ao.length===0)for(let i=0;i<ji.length;i++){const e=ji[i];for(let t=0;t<e.length;t+=14){const n=Nc(e,t);ao.push({x:n.x,y:hd(e,t),z:n.z,s:t,courseIndex:i})}}return ao}function An(i,e,t=0){let n=null,s=1/0;for(const r of pd()){const a=i-r.x,o=e-r.z,c=Math.hypot(a,o);c<s&&(s=c,n=r)}return{clearance:s-t-ld*.58,distance:s,nearestS:n?.s??0}}function ki(i,e,t,n,s,r=9){const a=t*.5,o=n*.5,c=ld*.62+r;let l=null;for(const d of pd()){const u=Math.max(Math.abs(d.x-i)-a,0),f=Math.max(Math.abs(d.z-e)-o,0),p=Math.hypot(u,f)-c;if(p>0)continue;const x=d.y-2.8,_=s-x;_<=0||(!l||_-p>l.score)&&(l={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:p,verticalIntrusion:_,score:_-p})}return l}function In(i,e,t,n=96){for(let s=0;s<n;s++){const r=i(s);if(An(r.x,r.z,e).clearance>=t)return r}return null}function Un(i,e,t,n,s){const r=An(e,t,n);na.push({kind:i,x:Math.round(e),z:Math.round(t),radius:Math.round(n),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function Jg(){const i=[...na].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:na.length,unsafe:na.filter(e=>e.clearance<e.margin),closest:i}}function un(i,e,t,n,s){const r=e.clone().add(t).multiplyScalar(.5),a=t.clone().sub(e),o=new G(new ft(n,n,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors(sn,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,i.add(o),o}function jg(){const i=new Ff(10475519,1055524,.82);st.add(i);const e=new Al(5941759,1.15);e.position.set(260,145,-260),st.add(e);const t=new Al(16766364,1.55);t.position.set(-240,270,180),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,st.add(t);const n=new Lc(5552383,58,820,2.1);n.position.set(0,88,-920),st.add(n)}function Qg(){const i=document.createElement("canvas");i.width=32,i.height=512;const e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,i.height);t.addColorStop(0,"#03569f"),t.addColorStop(.34,"#1689e6"),t.addColorStop(.72,"#86d3ff"),t.addColorStop(1,"#fff1c4"),e.fillStyle=t,e.fillRect(0,0,i.width,i.height);const n=new Jt(i);n.colorSpace=Ct;const s=new G(new Xt(1550,40,20),new Lt({map:n,side:an,depthWrite:!1}));s.position.set(0,-70,-700),st.add(s);const r=new Lt({color:16765316,transparent:!0,opacity:.22,depthWrite:!1}),a=new G(new fn(58,48),r);a.position.set(-430,300,-650),a.lookAt(dt.position),st.add(a);const o=new Lt({color:16762479,transparent:!0,opacity:.16,depthWrite:!1});for(const[l,d]of[[150,.05],[260,.025],[430,.012]]){const u=new G(new fn(l,48),o.clone());u.material.opacity=d,u.position.copy(a.position).add(new L(0,0,2)),u.lookAt(dt.position),st.add(u)}const c=new Lt({color:16769715,transparent:!0,opacity:.025,depthWrite:!1,side:gt});for(let l=0;l<3;l++){const d=new G(new Bt(1800,42),c.clone());d.material.opacity=.015+l*.01,d.position.set(0,92+l*28,-1220-l*260),st.add(d)}}function e_(){const i=new q({map:Wg(),color:10212492,roughness:.98,metalness:.02}),e=new G(new Bt(4200,4200,300,300),i);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let x=0;x<t.count;x++){const _=t.getX(x),m=t.getY(x);t.setZ(x,We(_,-m)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),st.add(e);const n=new q({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.76});for(let x=0;x<3;x++){const _=new G(new Bt(980,64+x*18,1,1),n.clone());_.rotation.x=-Math.PI/2,_.rotation.z=-.34+x*.03,_.position.set(150-x*190,-5.4+x*.03,-760-x*420),st.add(_)}const s=[new q({color:4352578,roughness:1}),new q({color:6910014,roughness:1}),new q({color:3562320,roughness:1})];for(let x=0;x<46;x++){const _=new G(new fn(28+Math.random()*90,9),s[x%s.length]);_.rotation.x=-Math.PI/2,_.rotation.z=Math.random()*Math.PI,_.position.set(-900+Math.random()*1800,-5.6+Math.random()*.8,-260-Math.random()*1780),_.scale.y=.32+Math.random()*.5,_.receiveShadow=!0,st.add(_)}const r=new Lt({color:14217471,transparent:!0,opacity:.08,depthWrite:!1});for(let x=0;x<32;x++){const _=new G(new fn(70+Math.random()*150,22),r.clone());_.material.opacity=.035+Math.random()*.055,_.rotation.x=-Math.PI/2,_.position.set(-1050+Math.random()*2100,-1.8+Math.random()*4,-240-Math.random()*1820),_.scale.y=.22+Math.random()*.26,st.add(_)}const a=[new q({color:5991785,roughness:1}),new q({color:7633254,roughness:1}),new q({color:4874865,roughness:1})],o=new q({color:15068905,roughness:.95});for(let x=0;x<52;x++){const _=78+Math.random()*180,m=52+Math.random()*115,h=In(S=>{const y=x/52*Math.PI*2+S*1.77,E=1380+Math.random()*820+S*18;return{x:Math.cos(y)*E,z:Math.sin(y)*E-1180}},m,480);if(!h)continue;const v=new G(new Zi(m,_,5+Math.floor(Math.random()*2)),a[x%a.length]);if(v.position.set(h.x,-9,h.z),v.rotation.y=Math.random()*Math.PI,v.castShadow=!0,v.receiveShadow=!0,st.add(v),Un("mountain",h.x,h.z,m,480),_>160){const S=new G(new Zi(m*.34,_*.22,5),o);S.position.copy(v.position).add(new L(0,_*.39,0)),S.rotation.y=v.rotation.y,st.add(S)}}const c=new q({color:4926748,roughness:.9}),l=[new q({color:2055221,roughness:.92}),new q({color:3109954,roughness:.95}),new q({color:1589042,roughness:.9})];for(let x=0;x<185;x++){const _=.58+Math.random()*1.05,m=8*_,h=In(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),m,145,40);if(!h)continue;const{x:v,z:S}=h;if(va(v,S,18))continue;const y=We(v,S)+.8,E=new lt,T=2.2+Math.random()*3.8,P=new G(new ft(.28,.42,T,6),c);P.position.y=T/2,E.add(P);const R=2+Math.floor(Math.random()*3);for(let b=0;b<R;b++){const M=new G(new Zi(2.2+Math.random()*1.7-b*.22,4.8+Math.random()*2.6,7),l[(x+b)%l.length]);M.position.y=T+b*1.45+1.6,M.rotation.y=Math.random()*Math.PI,E.add(M)}E.position.set(v,y,S),E.scale.setScalar(_),st.add(E),Un("tree",v,S,m,145)}const d=new q({color:16777215,roughness:.75,transparent:!0,opacity:.88});for(let x=0;x<38;x++){const _=new lt,m=4+Math.floor(Math.random()*5);for(let h=0;h<m;h++){const v=new G(new Xt(12+Math.random()*18,14,8),d);v.position.set(h*18-m*9,Math.random()*8,Math.random()*12),v.scale.set(1.2+Math.random()*.9,.36+Math.random()*.2,.8+Math.random()*.5),_.add(v)}_.position.set(-760+Math.random()*1520,185+Math.random()*135,-130-Math.random()*1720),st.add(_)}const u=[new q({color:6186600,roughness:.68,metalness:.2}),new q({color:7829101,roughness:.72,metalness:.18}),new q({color:4544612,roughness:.62,metalness:.24})],f=new q({color:2962232,roughness:.65,metalness:.35});for(let x=0;x<44;x++){const _=new lt,m=20+Math.random()*95,h=8+Math.random()*18,v=8+Math.random()*18,S=new G(new De(h,m,v),u[x%u.length]);S.position.y=m/2,S.castShadow=!0,S.receiveShadow=!0,_.add(S);const y=vs(160,320,.28+Math.random()*.36),E=new q({map:y,color:10414079,roughness:.24,metalness:.12,emissive:1724259,emissiveIntensity:.22});for(const b of[-1,1]){const M=new G(new Bt(h*.82,m*.74),E);M.position.set(0,m*.53,b*(v/2+.08)),M.rotation.y=b<0?Math.PI:0,_.add(M)}const T=new G(new De(h*1.08,1.2,v*1.08),f);if(T.position.y=m+.7,_.add(T),Math.random()<.32){const b=new G(new ft(.18,.3,10+Math.random()*12,8),f);b.position.y=m+6.5,_.add(b)}const P=Math.hypot(h,v)*.65,R=In(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),P,240,60);R&&(_.position.set(R.x,$s(R.x,R.z,h,v)-.7,R.z),_.rotation.y=Math.random()*Math.PI,st.add(_),Un("building",R.x,R.z,P,240))}const p=new q({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let x=0;x<18;x++){const _=new lt,m=Si[x%Si.length],h=la[(x*3+1)%la.length],v=yi[x%yi.length],S=new q({map:dd(m,h,v),color:16777215,roughness:.22,metalness:.04,emissive:new tt(v),emissiveIntensity:.28}),y=22+Math.random()*18,E=8+Math.random()*4,T=new G(new De(y,E,.5),S);T.position.y=10,_.add(T);const P=new G(new De(y+1.2,.32,.75),p);P.position.y=10+E*.5+.25,_.add(P);for(const b of[-7,7]){const M=new G(new ft(.24,.32,10,8),p);M.position.set(b,5,-.2),_.add(M)}const R=In(()=>({x:-780+Math.random()*1560,z:-450-x*135+Math.random()*80-40}),22,175,50);R&&(_.position.set(R.x,We(R.x,R.z)+.5,R.z),_.rotation.y=-.35+Math.random()*.7,st.add(_),Un("billboard",R.x,R.z,22,175),Vi("roadside-billboard",R.x,_.position.y+10,R.z))}}function t_(){for(let h=0;h<3;h++){const v=[9418953,10995926,12770278][h],S=new Lt({color:v,transparent:!0,opacity:.55-h*.12,depthWrite:!1,fog:!1}),y=60,E=5200,T=new Bt(E,360,y,1),P=T.attributes.position;for(let b=0;b<=y;b++){const M=b/y,C=(Math.sin(M*22+h*3)*.5+Math.sin(M*9+h)*.5)*70+120;P.setY(b,C),P.setY(b+y+1,-180)}P.needsUpdate=!0;const R=new G(T,S);R.position.set(0,40,-2300-h*360),st.add(R)}const i=new q({color:5583649,roughness:.9}),e=[new q({color:3837754,roughness:.9}),new q({color:7319100,roughness:.92}),new q({color:13075258,roughness:.9}),new q({color:15182276,roughness:.88})];for(let h=0;h<48;h++){const v=.7+Math.random()*1.2,S=9*v,y=In(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),S,150,36);if(!y)continue;const{x:E,z:T}=y;if(va(E,T,18))continue;const P=We(E,T)+.6,R=new lt,b=2.6+Math.random()*3.4,M=new G(new ft(.34,.5,b,6),i);M.position.y=b/2,R.add(M);const C=e[Math.floor(Math.random()*e.length)],D=3+Math.floor(Math.random()*3);for(let H=0;H<D;H++){const J=2.4+Math.random()*1.8,j=new G(new Xt(J,9,7),C);j.position.set((Math.random()-.5)*3,b+1.6+Math.random()*2.2,(Math.random()-.5)*3),j.scale.y=.82+Math.random()*.3,R.add(j)}R.position.set(E,P,T),R.scale.setScalar(v),st.add(R),Un("tree",E,T,S,150)}const t=[new q({color:7762025,roughness:1,flatShading:!0,side:gt}),new q({color:9077368,roughness:1,flatShading:!0,side:gt}),new q({color:6249043,roughness:1,flatShading:!0,side:gt})];for(let h=0;h<70;h++){const v=2+Math.random()*7,S=In(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),v,70,30);if(!S)continue;const{x:y,z:E}=S,T=new G(new ma(v,0),t[h%t.length]),P=T.geometry.attributes.position;for(let R=0;R<P.count;R++)P.setXYZ(R,P.getX(R)*(.8+Math.random()*.4),P.getY(R)*(.6+Math.random()*.4),P.getZ(R)*(.8+Math.random()*.4));P.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(y,We(y,E)+v*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,st.add(T),$i.push({kind:"rock",x:y,z:E,radius:v*1.12}),Un("rock",y,E,v,70)}const n=[11969084,9416262,7314255,13218138,8228670];for(let h=0;h<14;h++){const v=130+Math.random()*200,S=130+Math.random()*200,y=In(()=>({x:-1500+Math.random()*3e3,z:-700-Math.random()*1700}),Math.max(v,S)*.5,40,24);if(!y)continue;const{x:E,z:T}=y,P=new lt,R=5+Math.floor(Math.random()*4),b=n[Math.floor(Math.random()*n.length)];for(let M=0;M<R;M++){const C=new q({color:M%2?b:n[Math.floor(Math.random()*n.length)],roughness:1}),D=new G(new Bt(v,S/R),C);D.rotation.x=-Math.PI/2,D.position.set(0,.05,-S/2+(M+.5)*(S/R)),P.add(D)}P.position.set(E,We(E,T)+.05,T),P.rotation.y=Math.random()*Math.PI,st.add(P),Un("field",E,T,Math.max(v,S)*.5,40)}{const h=In(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(h){const v=new q({color:4165552,roughness:.12,metalness:.35,transparent:!0,opacity:.88}),S=new G(new fn(150,40),v);S.rotation.x=-Math.PI/2,S.position.set(h.x,-6.4,h.z),S.scale.set(1.5,1,1),st.add(S),Un("lake",h.x,h.z,170,60),Gn(S,y=>{v.opacity=.84+Math.sin(y*.8)*.05,S.rotation.z=Math.sin(y*.2)*.02})}}const s=new q({color:15922422,roughness:.5,metalness:.2});for(let h=0;h<9;h++){const v=h/9*Math.PI*2+.6,S=1500+Math.random()*700,y=Math.cos(v)*S,E=Math.sin(v)*S-1150,T=60+Math.random()*40,P=new lt,R=new G(new ft(1.1,2.2,T,10),s);R.position.y=T/2,P.add(R);const b=new lt;b.position.set(0,T,3);const M=new G(new De(3,3,7),s);b.add(M);const C=new lt;C.position.z=3.5;for(let H=0;H<3;H++){const J=new G(new De(1.1,26,.5),s);J.position.y=13;const j=new lt;j.add(J),j.rotation.z=H/3*Math.PI*2,C.add(j)}b.add(C),P.add(b),P.position.set(y,-8,E),P.rotation.y=Math.random()*Math.PI,st.add(P);const D=.5+Math.random()*.5;Gn(C,H=>{C.rotation.z=H*D})}const r=new q({color:7041398,roughness:.6,metalness:.4}),a=new jo({color:2764595,transparent:!0,opacity:.5});let o=null;for(let h=0;h<7;h++){const v=-1100+h*360,S=-1650-Math.sin(h*.7)*120,y=48,E=new lt,T=6;for(const R of[-1,1])for(const b of[-1,1]){const M=new G(new ft(.4,.7,y,5),r);M.position.set(R*T,y/2,b*T),M.rotation.z=-R*.08,M.rotation.x=b*.08,E.add(M)}for(const R of[y*.6,y*.82,y]){const b=new G(new De(T*4,.8,.8),r);b.position.y=R,E.add(b)}E.position.set(v,We(v,S)-2,S),st.add(E);const P=We(v,S)-2+y;if(o)for(const R of[-T*2,0,T*2]){const b=o.x+R,M=o.z,C=v+R,D=S,H=[],J=12;for(let te=0;te<=J;te++){const re=te/J,se=Math.sin(re*Math.PI)*6;H.push(new L(b+(C-b)*re,o.y-se+(P-o.y)*re,M+(D-M)*re))}const j=new gl(new Wt().setFromPoints(H),a);st.add(j)}o={x:v,y:P,z:S}}const c=new q({color:11680302,roughness:.6,metalness:.3}),l=new q({color:15263976,roughness:.6,metalness:.3});for(let h=0;h<5;h++){const v=In(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!v)continue;const{x:S,z:y}=v,E=70+Math.random()*50,T=new lt,P=8;for(let C=0;C<P;C++){const D=new G(new ft(.5,.7,E/P,4),C%2?l:c);D.position.y=(C+.5)*(E/P),D.rotation.y=Math.PI/4,T.add(D)}const R=new q({color:16722458,emissive:16718346,emissiveIntensity:2}),b=new G(new Xt(1.1,10,8),R);b.position.y=E+1,T.add(b),T.position.set(S,We(S,y),y),st.add(T),Un("mast",S,y,8,120);const M=Math.random()*Math.PI*2;Gn(b,C=>{R.emissiveIntensity=Math.sin(C*2.4+M)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let h=0;h<6;h++){const v=new lt,S=d[h%d.length],y=new q({map:l_(S[0],S[1]),roughness:.5,metalness:.05,emissive:new tt(S[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new G(new Xt(11,20,16),y);E.scale.y=1.25,v.add(E);const T=new G(new De(3.4,3,3.4),new q({color:8014371,roughness:.9}));T.position.y=-17,v.add(T);const P=new jo({color:3811866});for(const D of[-1,1])for(const H of[-1,1]){const J=new gl(new Wt().setFromPoints([new L(D*1.6,-15.5,H*1.6),new L(D*7,-3,H*7)]),P);v.add(J)}const R=-700+Math.random()*1400,b=-700-Math.random()*1200,M=280+Math.random()*100;v.position.set(R,M,b),st.add(v);const C=Math.random()*Math.PI*2;Gn(v,D=>{v.position.y=M+Math.sin(D*.5+C)*6,v.position.x=R+Math.sin(D*.08+C)*90,v.rotation.z=Math.sin(D*.4+C)*.04})}const u=new Lt({color:2829104,side:gt,fog:!1});function f(){const h=new Rc;return h.moveTo(0,0),h.lineTo(-2.6,1.1),h.lineTo(-2.2,.2),h.lineTo(0,.5),h.lineTo(2.2,.2),h.lineTo(2.6,1.1),h.lineTo(0,0),new G(new xa(h),u)}for(let h=0;h<5;h++){const v=new lt,S=5+Math.floor(Math.random()*5),y=[];for(let C=0;C<S;C++){const D=f(),H=C%2?1:-1,J=Math.ceil(C/2);D.position.set(H*J*5,-J*2.4,0),D.rotation.x=-Math.PI/2,v.add(D),y.push(D)}const E=150+Math.random()*120,T=-500-Math.random()*1400,P=18+Math.random()*14,R=1400,b=-700+Math.random()*1400;v.position.set(b,E,T),st.add(v);const M=Math.random()*Math.PI*2;Gn(v,(C,D)=>{v.position.x+=P*D,v.position.x>R&&(v.position.x=-R);const H=Math.sin(C*6+M);for(const J of y)J.rotation.x=-Math.PI/2+H*.4})}{const h=new lt,v=new q({color:14673644,roughness:.4,metalness:.2}),S=new G(new Xt(20,20,16),v);S.scale.set(2.6,1,1),h.add(S);const y=new q({color:13781835,roughness:.6});for(let b=0;b<3;b++){const M=new G(new De(10,9,.6),y);M.position.x=-46,M.rotation.x=b/3*Math.PI*2,h.add(M)}const E=new G(new De(10,4,4),new q({color:3356475,roughness:.7}));E.position.y=-19,h.add(E);const T=new G(new Bt(40,10),new Lt({map:Fc("STEEL RIBBON"),transparent:!0,side:gt}));T.position.set(60,0,0),h.add(T);const P=900,R=240;h.position.set(0,R,-1200),st.add(h),Gn(h,b=>{const M=b*.05;h.position.x=Math.cos(M)*P,h.position.z=-1200+Math.sin(M)*P*.5,h.position.y=R+Math.sin(b*.3)*8,h.rotation.y=-M+Math.PI/2})}const p=new Lt({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let h=0;h<14;h++){const v=new G(new Bt(220+Math.random()*360,16+Math.random()*22),p.clone());v.material.opacity=.12+Math.random()*.18,v.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),v.rotation.x=-Math.PI/2.1,v.rotation.z=Math.random()*Math.PI,v.scale.y=.3,st.add(v);const S=2+Math.random()*3;Gn(v,(y,E)=>{v.position.x+=S*E,v.position.x>1400&&(v.position.x=-1400)})}const x=new q({color:13620954,roughness:.6,metalness:.2}),_=new Lt({map:h_(),side:gt});for(let h=0;h<4;h++){const v=In(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!v)continue;const{x:S,z:y}=v,E=new lt,T=60+Math.random()*40,P=new G(new De(T,1.4,26),x);P.position.set(0,26,-4),P.rotation.x=-.32,E.add(P);const R=new G(new Bt(T*.94,24),_);R.position.set(0,12,6),R.rotation.x=-.85,E.add(R);for(const b of[-T/2,T/2]){const M=new G(new De(1.4,26,1.4),x);M.position.set(b,13,-8),E.add(M)}E.position.set(S,We(S,y),y),E.rotation.y=Math.atan2(-S,-y)+(Math.random()-.5)*.5,st.add(E),Un("grandstand",S,y,40,30)}const m=[16731486,16765503,16777215,11824127];for(let h=0;h<90;h++){const v=In(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!v)continue;const{x:S,z:y}=v,E=new lt,T=m[Math.floor(Math.random()*m.length)],P=new Lt({color:T,side:gt}),R=5+Math.floor(Math.random()*6);for(let b=0;b<R;b++){const M=new G(new fn(.5+Math.random()*.4,5),P);M.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),M.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,M.rotation.z=Math.random()*Math.PI,E.add(M)}E.position.set(S,We(S,y),y),st.add(E),Un("flowers",S,y,3,20)}}const gn=[],Wn=[];let rc=0;const $i=[],Ma=[],Ti=[],ac=[],pr=[],ys=[],qe={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},ha=[];function Vi(i,e,t,n){qe.signs++,ha.length<160&&ha.push({kind:i,x:+e.toFixed(1),y:+t.toFixed(1),z:+n.toFixed(1)})}function Mi(i,e,t=1){qe[i][e]=(qe[i][e]||0)+t}function n_(i,e){const t=new lt,n={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=n[i]||n.compact,r=new q({color:e,roughness:.34,metalness:.28}),a=new q({color:new tt(e).multiplyScalar(.52),roughness:.42,metalness:.24}),o=new q({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2}),c=new q({color:395016,roughness:.72,metalness:.02}),l=new q({color:14147041,roughness:.2,metalness:.68}),d=new q({color:16774064,roughness:.2,emissive:16765788,emissiveIntensity:.82}),u=new q({color:16725033,roughness:.22,emissive:16717325,emissiveIntensity:.7}),f=new G(new De(s.w,s.h,s.l),i==="taxi"?new q({color:16767293,roughness:.36,metalness:.24}):r);f.position.y=.95,t.add(f);const p=new G(new De(s.cabin[0],s.cabin[1],s.cabin[2]),s.bus?o:r);if(p.position.set(0,1.65,s.cabinZ),t.add(p),!s.bus){const m=new G(new De(s.cabin[0]*.78,s.cabin[1]*.55,.08),o);m.position.set(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),t.add(m);for(const h of[-1,1]){const v=new G(new De(.08,s.cabin[1]*.5,s.cabin[2]*.48),o);v.position.set(h*(s.cabin[0]*.5+.04),1.68,s.cabinZ),t.add(v)}}if(s.bed){const m=new G(new De(s.w*.94,.58,s.l*.38),a);m.position.set(0,1.2,1.35),t.add(m)}if(s.box){const m=new G(new De(s.box[0],s.box[1],s.box[2]),new q({color:15130833,roughness:.62,metalness:.05}));m.position.set(0,1.55,1.25),t.add(m)}if(s.bus){const m=new G(new De(s.w+.06,.28,s.l*.86),a);m.position.set(0,1.38,0),t.add(m);for(let h=-2.8;h<=3.1;h+=1.2)for(const v of[-1,1]){const S=new G(new De(.08,.64,.72),o);S.position.set(v*(s.w*.5+.05),2.08,h),t.add(S)}}if(s.sign){const m=new G(new De(1,.24,.46),new q({color:16774310,roughness:.2,emissive:16765773,emissiveIntensity:.9}));m.position.set(0,2.2,-.35),t.add(m)}const x=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],_=[];for(const m of x)for(const h of[-s.w*.54,s.w*.54]){const v=new G(new ft(.42,.42,.36,14),c);v.rotation.z=Math.PI/2,v.position.set(h,.45,m),t.add(v),_.push(v);const S=new G(new ft(.18,.18,.38,10),l);S.rotation.z=Math.PI/2,S.position.set(h,.45,m),t.add(S)}for(const m of[-s.w*.28,s.w*.28]){const h=new G(new De(.42,.2,.08),d);h.position.set(m,.95,-s.l*.52),t.add(h);const v=new G(new De(.36,.22,.08),u);v.position.set(m,.98,s.l*.52),t.add(v)}return t.userData={wheels:_,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55},t.traverse(m=>{m.castShadow=!0,m.receiveShadow=!0}),t}function i_(i,e){const t=new lt,n=new q({color:12947299,roughness:.72}),s=new q({color:i,roughness:.68}),r=new q({color:e,roughness:.76}),a=new q({color:1119001,roughness:.82}),o=new G(new ft(.28,.34,.95,8),s);o.position.y=1.35,t.add(o);const c=new G(new Xt(.24,10,8),n);c.position.y=2.02,t.add(c);const l=new G(new Xt(.25,8,5),a);l.scale.y=.5,l.position.y=2.17,t.add(l);const d=[];for(const u of[-.16,.16]){const f=new G(new ft(.075,.09,.78,6),r);f.position.set(u,.58,0),t.add(f),d.push({mesh:f,side:Math.sign(u),baseY:.58,amp:.28})}for(const u of[-.38,.38]){const f=new G(new ft(.055,.065,.72,6),n);f.position.set(u,1.33,0),f.rotation.z=u<0?-.18:.18,t.add(f),d.push({mesh:f,side:-Math.sign(u),baseY:1.33,amp:.34})}return t.userData.limbs=d,t.traverse(u=>{u.castShadow=!0,u.receiveShadow=!0}),t}function s_(i,e,t){const{X0:n,X1:s,ZN:r,ZF:a,pitch:o,streetW:c,trafficControls:l=new Map}=t,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],u=["compact","taxi","pickup","van","boxTruck","bus"],f=[],p=30,x=[],_=[];for(let U=n;U<=s+1;U+=o)x.push(Math.round(U));for(let U=r;U>=a-1;U-=o)_.push(Math.round(U));_.sort((U,ye)=>U-ye);const m=x[0],h=x[x.length-1],v=_[0],S=_[_.length-1];Ti.length=0,ac.length=0,pr.length=0,ys.length=0,qe.traffic=0,qe.pedestrians=0,qe.types={},qe.turns=0,qe.splats=0,qe.trafficCrashes=0,qe.streetLights=0,qe.trafficLights=0,qe.stopSigns=0;const y=U=>U[Math.random()*U.length|0],E=U=>(U>0?-1:1)*c*.23,T=(U,ye)=>{let ve=0,Se=1/0;for(let Z=0;Z<U.length;Z++){const $=Math.abs(U[Z]-ye);$<Se&&(Se=$,ve=Z)}return ve},P=(U,ye,ve)=>{const Se=U==="ns"?_:x;if(ve>0){for(const Z of Se)if(Z>ye+.05)return Z;return Se[Se.length-1]}for(let Z=Se.length-1;Z>=0;Z--)if(Se[Z]<ye-.05)return Se[Z];return Se[0]},R=U=>{const ye=U.laneOffset+(U.avoidOffset||0);return U.axis==="ns"?{x:U.road+ye,z:U.along}:{x:U.along,z:U.road+ye}},b=U=>{if(g.mode!=="roam")return null;const ye=R(U);if(Math.abs(g.roamPos.y-(We(ye.x,ye.z)+hi))>4.2)return null;const ve=U.axis==="ns"?0:U.dir,Se=U.axis==="ns"?U.dir:0,Z=g.roamPos.x-ye.x,$=g.roamPos.z-ye.z,_e=Z*ve+$*Se,be=U.axis==="ns"?Z:$,Re=Math.abs(be),Ye=Math.hypot(Z,$),Rt=U.mesh?.userData?.colliderHalfW||2,Ze=U.mesh?.userData?.colliderHalfD||3;return Ye<zn+Math.max(Rt,Ze)*.55||_e>-1.5&&_e<Ze+4.2&&Re<zn+Rt*.85?{crash:!0}:_e>0&&_e<30&&Re<c*.36?{avoidOffset:(be>=0?-1:1)*U.maxAvoidOffset,stop:_e<13&&Re<zn+Rt*.95}:null},M=(U,ye)=>`${Math.round(U)},${Math.round(ye)}`,C=(U,ye)=>{const Se=((ye+U.phase)%15.5+15.5)%15.5;return Se<6.2?"ns":Se<7.4?"yellow-ns":Se<13.6?"ew":"yellow-ew"},D=(U,ye)=>{const ve=U.axis==="ns"?U.road:U.next,Se=U.axis==="ns"?U.next:U.road,Z=M(ve,Se),$=l.get(Z);if(!$)return null;if($.type==="signal"){const _e=C($,ye),be=_e===`yellow-${U.axis}`;return _e===U.axis&&!be?null:{control:$,key:Z,kind:"signal"}}return $.type==="stop"&&U.lastControlKey!==Z?{control:$,key:Z,kind:"stop"}:null},H=(U,ye=!1)=>{const ve=U.axis,Se=U.along,Z=ve==="ns"?x:_,$=U.road,_e=T(Z,$),be=[],Re=ve==="ns"?v:m,Ye=ve==="ns"?S:h;!ye&&Se+U.dir*o>=Re&&Se+U.dir*o<=Ye&&be.push({axis:ve,road:U.road,along:Se,dir:U.dir,turn:!1}),_e>0&&be.push({axis:ve==="ns"?"ew":"ns",road:Se,along:$,dir:-1,turn:!0}),_e<Z.length-1&&be.push({axis:ve==="ns"?"ew":"ns",road:Se,along:$,dir:1,turn:!0}),be.length||be.push({axis:ve,road:U.road,along:Se,dir:-U.dir,turn:!0});const Rt=be.filter(Tt=>Tt.turn),Ze=!ye&&Rt.length&&Math.random()<.42?y(Rt):y(be);(Ze.turn||Ze.axis!==ve)&&qe.turns++,U.axis=Ze.axis,U.road=Ze.road,U.along=Ze.along,U.dir=Ze.dir,U.laneOffset=E(U.dir),U.next=P(U.axis,U.along,U.dir),U.turnBlend=Ze.turn?1:0,U.lastControlKey=null};for(let U=0;U<p;U++){const ye=Math.random()<.56?"ns":"ew",ve=u[U%u.length],Se=Math.random()<.5?-1:1,Z=(ve==="bus"||ve==="boxTruck"?10:13)+Math.random()*9,$={axis:ye,dir:Se,road:y(ye==="ns"?x:_),laneOffset:E(Se),along:y(ye==="ns"?_:x),speed:Z,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:c*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:n_(ve,d[U*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};$.collider.actor=$,U<8&&($.axis="ns",$.dir=-1,$.laneOffset=E($.dir),$.road=[210,-50,210,-50][U%4],$.along=318-U*54,$.speed+=3),$.next=P($.axis,$.along,$.dir),Ti.push($.collider),f.push($),ac.push($),i.add($.mesh),qe.types[ve]=(qe.types[ve]||0)+1}function J(U,ye=0,ve=0){let Se=Math.max(0,U.speed*ve);const Z=b(U);for(Z?.crash?(Md(U,g.roamPos),Se=0):Z?(U.avoidOffset+=(Z.avoidOffset-U.avoidOffset)*Math.min(1,ve*4.5),U.brakePulse=Math.max(U.brakePulse||0,Z.stop?1:.35),Z.stop&&(U.waitTimer=Math.max(U.waitTimer,.22),Se=0)):U.avoidOffset+=(0-U.avoidOffset)*Math.min(1,ve*1.8),U.crashTimer>0&&(U.crashTimer=Math.max(0,U.crashTimer-ve),Se=0),U.waitTimer>0&&(U.waitTimer=Math.max(0,U.waitTimer-ve),Se=0);Se>0;){const z=D(U,ye);if(z){const ct=U.next-U.dir*(z.kind==="signal"?12:8),At=(ct-U.along)*U.dir;if(At>=-.35&&At<=Se+.25){U.along=ct,U.brakePulse=1,Se=0,z.kind==="stop"&&(U.waitTimer=.65+Math.random()*.4,U.lastControlKey=z.key);break}}const ut=Math.abs(U.next-U.along);if(Se<ut)U.along+=U.dir*Se,Se=0;else{U.along=U.next,Se-=ut;const ct=U.next<=(U.axis==="ns"?v:m)+.05||U.next>=(U.axis==="ns"?S:h)-.05;H(U,ct)}}U.brakePulse=Math.max(0,(U.brakePulse||0)-ve*3.2),U.turnBlend=Math.max(0,U.turnBlend-ve*3.2);const{x:$,z:_e}=R(U),be=U.axis==="ns"?0:U.dir,Re=U.axis==="ns"?U.dir:0;U.mesh.position.set($,We($,_e)+.28+Math.sin(ye*3.2+U.bob)*.035,_e);const Ye=Math.atan2(-be,-Re),Rt=Math.atan2(Math.sin(Ye-U.mesh.rotation.y),Math.cos(Ye-U.mesh.rotation.y));U.mesh.rotation.y+=Rt*Math.min(1,ve*7+U.turnBlend*.55),U.crashTimer>0&&(U.mesh.rotation.y+=Math.sin(ye*22+U.bob)*.02);for(const z of U.mesh.userData.wheels||[])z.rotation.x-=U.dir*U.speed*ve*1.7;const Ze=U.mesh.userData.colliderHalfD,Tt=U.mesh.userData.colliderHalfW;U.collider.x=$,U.collider.z=_e,U.collider.hw=U.axis==="ns"?Tt:Ze,U.collider.hd=U.axis==="ns"?Ze:Tt,U.collider.maxY=U.mesh.position.y+3.2}for(const U of f)J(U,0,0);qe.traffic=f.length,Gn(i,(U,ye)=>{for(const ve of f)J(ve,U,ye)});const j=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],te=[2437188,3092787,4930093,2244434],re=[],se=45;for(let U=0;U<se;U++){const ye=Math.random()<.56?"ns":"ew",ve=e[Math.random()*e.length|0],Se=Math.abs(ve.z1-ve.z0)>Math.abs(ve.x1-ve.x0),Z=ye==="ns"?Se?"ns":"ew":Se?"ew":"ns",$=Math.random()<.5?-1:1,_e=Math.random()<.5?-1:1,be={axis:Z,dir:$,sideSign:_e,coord:y(Z==="ns"?x:_),along:Z==="ns"?a+Math.random()*(r-a):n+Math.random()*(s-n),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:i_(j[U%j.length],te[U*2%te.length])};U<14&&(be.axis="ns",be.coord=80,be.sideSign=U%2?-1:1,be.dir=U%3===0?1:-1,be.along=350-U*24,be.speed=1.5+U%4*.35),re.push(be),pr.push(be),i.add(be.mesh)}const xe=new Lt({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:gt}),Me=new Lt({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:gt});for(let U=0;U<18;U++){const ye=new lt,ve=new G(new fn(1,12),xe.clone());ve.rotation.x=-Math.PI/2,ye.add(ve);for(let Se=0;Se<7;Se++){const Z=new G(new fn(.25+Math.random()*.25,8),Me.clone());Z.rotation.x=-Math.PI/2,Z.position.set(Math.cos(Se)*(.6+Math.random()*1.2),.01,Math.sin(Se*1.7)*(.5+Math.random()*1.1)),ye.add(Z)}ye.visible=!1,ye.userData.life=0,ye.userData.maxLife=2.8,ye.position.y=-99,i.add(ye),ys.push(ye)}function ze(U,ye=0,ve=0){if(!U.active)if(U.respawn-=ve,U.respawn<=0)U.active=!0,U.mesh.visible=!0,U.along+=U.dir*50;else return;U.along+=U.dir*U.speed*ve,U.axis==="ns"?(U.along<a-28&&(U.along=r+28),U.along>r+28&&(U.along=a-28)):(U.along<n-28&&(U.along=s+28),U.along>s+28&&(U.along=n-28));const Se=U.sideSign*(c*.66+1.2),Z=U.axis==="ns"?U.coord+Se:U.along,$=U.axis==="ns"?U.along:U.coord+Se,_e=U.axis==="ns"?0:U.dir,be=U.axis==="ns"?U.dir:0;U.x=Z,U.z=$,U.mesh.position.set(Z,We(Z,$)+.08,$),U.mesh.rotation.y=Math.atan2(-_e,-be);const Re=Math.sin(ye*7+U.phase);for(const Ye of U.mesh.userData.limbs||[])Ye.mesh.rotation.x=Re*Ye.amp*Ye.side,Ye.mesh.position.y=Ye.baseY+Math.abs(Re)*.025}for(const U of re)ze(U,0,0);qe.pedestrians=re.length,Gn(i,(U,ye)=>{for(const ve of re)ze(ve,U,ye);for(const ve of ys){if(!ve.visible)continue;ve.userData.life-=ye;const Se=ve.userData.life,Z=Xe.clamp(Se/ve.userData.maxLife,0,1);ve.scale.setScalar(1+(1-Z)*.35),ve.traverse($=>{$.material&&($.material.opacity=Math.min(.78,Z*1.2))}),Se<=0&&(ve.visible=!1)}})}function r_(){const i=new lt,e=new Ht;new ui().setFromAxisAngle(new L(1,0,0),-Math.PI/2),qe.roadDetails={},qe.buildingArchetypes={},qe.zones={},qe.openerProps=0;const t=ai.x0,n=ai.x1,s=ai.zNear,r=ai.zFar,a=ai.pitch,o=ai.streetW,c=a-o,l=[],d=[];for(let N=t;N<=n+1;N+=a)l.push(Math.round(N));for(let N=s;N>=r-1;N-=a)d.push(Math.round(N));const u=[];for(const N of l)u.push({x0:N,z0:s,x1:N,z1:r});for(const N of d)u.push({x0:t,z0:N,x1:n,z1:N});function f(N,F){const W=N.x1-N.x0,Q=N.z1-N.z0,ee=Math.hypot(W,Q)||1,ae=-Q/ee,ne=W/ee;return{x0:N.x0+ae*F,z0:N.z0+ne*F,x1:N.x1+ae*F,z1:N.z1+ne*F}}function p(N,F,W){const Q=[],ee=[];for(const ne of N){const Le=ne.x1-ne.x0,w=ne.z1-ne.z0,O=Math.hypot(Le,w),V=Math.max(1,Math.round(O/14)),X=Le/O,Y=-(w/O),he=X;let ue=null,me=null;for(let Ae=0;Ae<=V;Ae++){const ge=Ae/V,Ne=ge*O/68,Ke=ne.x0+Le*ge,ht=ne.z0+w*ge,Mt=Ke+Y*F,St=ht+he*F,mt=Ke-Y*F,Ge=ht-he*F,Pt=[Mt,We(Mt,St)+W,St,Ne],at=[mt,We(mt,Ge)+W,Ge,Ne];ue&&(Q.push(ue[0],ue[1],ue[2],me[0],me[1],me[2],at[0],at[1],at[2]),Q.push(ue[0],ue[1],ue[2],at[0],at[1],at[2],Pt[0],Pt[1],Pt[2]),ee.push(0,ue[3],1,me[3],1,at[3]),ee.push(0,ue[3],1,at[3],0,Pt[3])),ue=Pt,me=at}}const ae=new Wt;return ae.setAttribute("position",new wt(Q,3)),ae.setAttribute("uv",new wt(ee,2)),ae.computeVertexNormals(),ae}const x=new q({map:Xg(),color:13097186,roughness:.34,metalness:.24,envMapIntensity:1.25,side:gt}),_=new q({color:11054244,roughness:.62,metalness:.04}),m=new q({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),h=new q({color:15855586,roughness:.48,metalness:.02,emissive:3158064,emissiveIntensity:.1}),v=new q({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),S=new q({color:3422266,roughness:.58,metalness:.48}),y=[],E=[];for(const N of u)y.push(f(N,o*.5+3.3),f(N,-13.3)),E.push(f(N,o*.5+.42),f(N,-10.42));const T=new G(p(y,2.9,.66),_);T.receiveShadow=!0,i.add(T);const P=new G(p(E,.28,.78),m);P.receiveShadow=!0,i.add(P),Mi("roadDetails","sidewalkRuns",y.length),Mi("roadDetails","curbRuns",E.length);const R=new G(p(u,o/2,.55),x);R.receiveShadow=!0,i.add(R);const b=new q({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:gt});i.add(new G(p(u,.4,.62),b));let M=0,C=0,D=0;for(let N=1;N<l.length-1;N++)for(let F=1;F<d.length-1;F++){const W=l[N],Q=d[F];if(!(An(W,Q,o*.75).clearance<2))for(const ee of[-1,1]){const ae=new G(new De(o*.92,.07,1.15),h);ae.position.set(W,We(W,Q+ee*13)+.83,Q+ee*13),ae.receiveShadow=!0,i.add(ae);const ne=new G(new De(1.15,.07,o*.92),h);ne.position.set(W+ee*13,We(W+ee*13,Q)+.83,Q),ne.receiveShadow=!0,i.add(ne),M+=2}}const H=new Rc;H.moveTo(0,5.8),H.lineTo(2.5,1.6),H.lineTo(.72,1.6),H.lineTo(.72,-5.2),H.lineTo(-.72,-5.2),H.lineTo(-.72,1.6),H.lineTo(-2.5,1.6),H.closePath();const J=new xa(H);J.rotateX(-Math.PI/2);for(const N of u){const F=Math.abs(N.x1-N.x0)<Math.abs(N.z1-N.z0),W=Math.hypot(N.x1-N.x0,N.z1-N.z0),Q=Math.max(2,Math.floor(W/280));for(let ee=0;ee<Q;ee++){const ae=(ee+.5)/Q,ne=N.x0+(N.x1-N.x0)*ae,Le=N.z0+(N.z1-N.z0)*ae;if(An(ne,Le,4).clearance<2)continue;const w=new G(J,v);if(w.position.set(ne,We(ne,Le)+.86,Le),w.rotation.y=F?0:Math.PI/2,w.scale.setScalar(.9),i.add(w),C++,ee%2===0){const O=new G(new ft(1.05,1.05,.08,24),S);O.position.set(ne+(F?3.8:0),We(ne,Le)+.84,Le+(F?0:3.8)),i.add(O),D++}}}Mi("roadDetails","crosswalks",M),Mi("roadDetails","laneArrows",C),Mi("roadDetails","manholes",D);const j=new Lt({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:gt,blending:Wi}),te=new Lt({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:gt,blending:Wi});for(let N=0;N<120;N++){const F=u[Math.random()*u.length|0],W=Math.random(),Q=F.x0+(F.x1-F.x0)*W,ee=F.z0+(F.z1-F.z0)*W;if(An(Q,ee,4).clearance<2)continue;const ae=new G(new fn(1,18),(N%4===0?te:j).clone());ae.rotation.x=-Math.PI/2,ae.rotation.z=Math.atan2(F.x1-F.x0,F.z1-F.z0)+(Math.random()-.5)*.35,ae.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),ae.position.set(Q+(Math.random()-.5)*o*.7,We(Q,ee)+.66,ee+(Math.random()-.5)*o*.7),i.add(ae)}const re=[vs(160,320,.5),vs(160,320,.62),vs(160,320,.42)],se=[new q({map:re[0],color:7042688,roughness:.42,metalness:.26,emissive:2315117,emissiveIntensity:.34}),new q({map:re[1],color:8550507,roughness:.46,metalness:.22,emissive:4860952,emissiveIntensity:.32}),new q({map:re[2],color:4414064,roughness:.4,metalness:.3,emissive:1523562,emissiveIntensity:.38})],xe=new De(1,1,1),Me=[[],[],[]],ze=[],U=[],ye=[],ve=[],Se=[],Z=[],$=[],_e=[],be=[],Re=[],Ye=[],Rt=[],Ze=[],Tt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],z=Yg(256,256,"#dbcdb8"),ut=qg(),ct=Zg(),At=[ro(512,384,"#944737","#2e95bf"),ro(512,384,"#7e4d3e","#d04d65"),ro(512,384,"#a65a35","#4fba6d")],Ve=$g();function It(N,F){Mi("zones",N),Mi("buildingArchetypes",F)}function $e(N,F,W,Q,ee,ae="downtown"){if(zi(N,F,W,Q))return!1;const ne=$s(N,F,W,Q)-1.1;if(ki(N,F,W,Q,ne+ee+2))return!1;if(e.position.set(N,ne+ee/2,F),e.quaternion.identity(),e.scale.set(W,ee,Q),e.updateMatrix(),Me[Math.random()*3|0].push(e.matrix.clone()),e.position.set(N,ne+ee+.6,F),e.scale.set(W*1.04,1.2,Q*1.04),e.updateMatrix(),ze.push(e.matrix.clone()),ee>26){const Le=Math.random()<.72?3790847:16730294;for(const w of[-1,1])e.position.set(N,ne+ee+1.35,F+w*(Q*.52+.12)),e.scale.set(W*1.12,.22,.18),e.updateMatrix(),U.push(e.matrix.clone()),ye.push(Le);Math.random()<.34&&ve.push({px:N,pz:F,w:W,d:Q,h:ee,gy:ne,zSide:Math.random()<.5?-1:1})}if(ee>14&&Math.random()<.48){const Le=Math.random()<.5?"x":"z";Se.push({px:N,pz:F,w:W,d:Q,h:ee,gy:ne,axis:Le,side:Math.random()<.5?-1:1})}if(ee>28&&Math.random()<.18){const Le=Math.random()<.5?"x":"z";Z.push({px:N,pz:F,w:W,d:Q,h:ee,gy:ne,axis:Le,side:Math.random()<.5?-1:1})}return gn.push({x:N,z:F,hw:W*.5,hd:Q*.5,maxY:ne+ee+2}),It(ae,ee>64?"glassTower":"midrise"),!0}function rt(N,F,W,Q,ee,ae="residential"){if(zi(N,F,W,Q))return!1;const ne=$s(N,F,W,Q)-.55,Le=2+Math.random()*2.4;if(ki(N,F,W,Q,ne+ee+Le+1.5,6))return!1;e.position.set(N,ne+ee/2,F),e.quaternion.identity(),e.scale.set(W,ee,Q),e.updateMatrix(),$.push(e.matrix.clone()),gn.push({x:N,z:F,hw:W*.5,hd:Q*.5,maxY:ne+ee+Le+1.5}),_e.push(Tt[Math.random()*Tt.length|0]),e.position.set(N,ne+ee+Le/2,F),e.scale.set(W*.82,Le,Q*.82),e.updateMatrix(),be.push(e.matrix.clone());const w=t+Math.round((N-t)/a)*a,O=s-Math.round((s-F)/a)*a,V=Math.abs(N-w)<Math.abs(F-O),X=V?w>N?1:-1:O>F?1:-1,B=Math.min(V?Q*.46:W*.46,8.5),Y=Math.min(ee*.58,4.6),he=Math.min(24,Math.max(8,V?Math.abs(w-N)-W*.5-o*.35:Math.abs(O-F)-Q*.5-o*.35));e.quaternion.identity(),V?(e.position.set(N+X*(W*.5+.1),ne+Y*.5+.1,F-Q*.16),e.scale.set(.24,Y,B),e.updateMatrix(),Re.push(e.matrix.clone()),e.position.set(N+X*(W*.5+he*.5),We(N+X*(W*.5+he*.5),F)+.08,F-Q*.16),e.scale.set(he,.08,B*1.18)):(e.position.set(N-W*.16,ne+Y*.5+.1,F+X*(Q*.5+.1)),e.scale.set(B,Y,.24),e.updateMatrix(),Re.push(e.matrix.clone()),e.position.set(N-W*.16,We(N,F+X*(Q*.5+he*.5))+.08,F+X*(Q*.5+he*.5)),e.scale.set(B*1.18,.08,he)),e.updateMatrix(),Ye.push(e.matrix.clone()),e.position.set(N,ne+.02,F),e.scale.set(W*1.58,.05,Q*1.58),e.updateMatrix(),Rt.push(e.matrix.clone());for(let ue=0;ue<3;ue++){const me=V?N+X*(W*.55):N+(ue-1)*W*.25,Ae=V?F+(ue-1)*Q*.28:F+X*(Q*.55);e.position.set(me,We(me,Ae)+.55,Ae);const ge=.85+Math.random()*.75;e.scale.set(ge*1.35,ge,ge*1.35),e.updateMatrix(),Ze.push(e.matrix.clone())}return It(ae,"residentialHouse"),!0}function I(N,F,W,Q,ee,ae="commercial"){if(zi(N,F,W,Q))return!1;const ne=$s(N,F,W,Q)-.8;if(ki(N,F,W,Q,ne+ee+2,7))return!1;const Le=new q({map:Ve,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),w=new G(new De(W,ee,Q),Le);w.position.set(N,ne+ee/2,F),w.castShadow=!0,w.receiveShadow=!0,i.add(w);const O=new q({color:7502722,roughness:.52,metalness:.15}),V=new G(new De(W*.72,.32,Q*.18),O);V.position.set(N,ne+ee*.38,F+Q*.18),V.rotation.z=.13,i.add(V);const X=new q({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let B=5;B<ee;B+=9){const Y=new G(new De(W*1.02,.24,.22),X);Y.position.set(N,ne+B,F+Q*.5+.14),i.add(Y)}return gn.push({x:N,z:F,hw:W*.5,hd:Q*.5,maxY:ne+ee+2}),It(ae,"parkingGarage"),!0}function A(N,F,W,Q,ee,ae="commercial"){if(zi(N,F,W,Q))return!1;const ne=$s(N,F,W,Q)-.65;if(ki(N,F,W,Q,ne+ee+2,7))return!1;const Le=new q({map:At[Math.random()*At.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),w=new G(new De(W,ee,Q),Le);w.position.set(N,ne+ee/2,F),w.castShadow=!0,w.receiveShadow=!0,i.add(w);const O=new G(new De(W*1.06,.9,Q*1.06),new q({color:2237478,roughness:.56,metalness:.18}));O.position.set(N,ne+ee+.45,F),i.add(O);const V=t+Math.round((N-t)/a)*a,X=s-Math.round((s-F)/a)*a,B=Math.abs(N-V)<Math.abs(F-X),Y=B?V>N?1:-1:X>F?1:-1,he=yi[(N+F|0)%yi.length]||"#ffd45b",ue=new Lt({map:so(Si[(Math.abs(N)+Math.abs(F)|0)%Si.length],he),transparent:!0,side:gt,depthWrite:!1}),me=new G(new Bt(Math.min(16,B?Q*.82:W*.82),4.2),ue);return B?(me.position.set(N+Y*(W*.5+.2),ne+ee*.66,F),me.rotation.y=Y>0?Math.PI/2:-Math.PI/2):(me.position.set(N,ne+ee*.66,F+Y*(Q*.5+.2)),me.rotation.y=Y<0?Math.PI:0),i.add(me),Vi("storefront-sign",me.position.x,me.position.y,me.position.z),gn.push({x:N,z:F,hw:W*.5,hd:Q*.5,maxY:ne+ee+2}),It(ae,"brickStorefront"),!0}for(let N=t+a/2;N<=n-a/2;N+=a)for(let F=s-a/2;F>=r+a/2;F-=a){const W=An(N,F,c*.5).clearance;if(W<2)continue;const Q=F>40&&F<380&&N>-360&&N<360,ee=Q?"showcase":F<-920?"industrial":W>230||F<-430?"downtown":W<90?"residential":"commercial";if(W<90||Q){const ne=c/3;for(let Le=0;Le<3;Le++)for(let w=0;w<3;w++){if(Math.random()<.14)continue;const O=N-c/2+ne*(Le+.5)+(Math.random()-.5)*ne*.3,V=F-c/2+ne*(w+.5)+(Math.random()-.5)*ne*.3;if(An(O,V,8).clearance<1)continue;const X=ne*(.5+Math.random()*.22),B=ne*(.5+Math.random()*.22);!Q&&Math.random()<.16?$e(O,V,X*.9,B*.9,12+Math.random()*12,ee):rt(O,V,X,B,5+Math.random()*4.5,ee)}}else{const ae=W>230,ne=ae?Xe.clamp(50+W*1.1,60,175):Xe.clamp(22+W*.3,22,62),Le=2+(Math.random()<.72?1:0)+(Math.random()<.42?1:0);for(let w=0;w<Le;w++){const O=13+Math.random()*Math.min(26,c*.44),V=13+Math.random()*Math.min(26,c*.44),X=N+(Math.random()-.5)*(c-O),B=F+(Math.random()-.5)*(c-V);if(An(X,B,Math.hypot(O,V)*.5).clearance<2)continue;const Y=(18+Math.random()*(ne-18))*(ae&&Math.random()<.2?1.35:1);!ae&&(Math.random()<.38&&A(X,B,Math.max(18,O*1.12),Math.max(18,V*1.08),12+Math.random()*14,ee)||Math.random()<.18&&I(X,B,Math.max(24,O*1.35),Math.max(24,V*1.28),24+Math.random()*24,ee))||$e(X,B,O,V,Y,ee)}}}for(let N=0;N<3;N++){if(!Me[N].length)continue;const F=new nn(xe,se[N],Me[N].length);for(let W=0;W<Me[N].length;W++)F.setMatrixAt(W,Me[N][W]);F.instanceMatrix.needsUpdate=!0,F.castShadow=!0,F.receiveShadow=!0,i.add(F)}if(ze.length){const N=new q({color:2896696,roughness:.62,metalness:.34}),F=new nn(xe,N,ze.length);for(let W=0;W<ze.length;W++)F.setMatrixAt(W,ze[W]);F.instanceMatrix.needsUpdate=!0,i.add(F)}if(U.length){const N=new q({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),F=new nn(xe,N,U.length);for(let W=0;W<U.length;W++)F.setMatrixAt(W,U[W]),F.setColorAt(W,new tt(ye[W]));F.instanceMatrix.needsUpdate=!0,F.instanceColor&&(F.instanceColor.needsUpdate=!0),i.add(F)}if($.length){const N=new q({color:4891451,roughness:.88,metalness:.02}),F=new nn(xe,N,Rt.length);for(let Y=0;Y<Rt.length;Y++)F.setMatrixAt(Y,Rt[Y]);F.instanceMatrix.needsUpdate=!0,F.receiveShadow=!0,i.add(F);const W=new q({color:12040883,roughness:.48,metalness:.05}),Q=new nn(xe,W,Ye.length);for(let Y=0;Y<Ye.length;Y++)Q.setMatrixAt(Y,Ye[Y]);Q.instanceMatrix.needsUpdate=!0,Q.receiveShadow=!0,i.add(Q);const ee=new q({map:z,roughness:.78,metalness:.03}),ae=new nn(xe,ee,$.length);for(let Y=0;Y<$.length;Y++)ae.setMatrixAt(Y,$[Y]),ae.setColorAt(Y,new tt(_e[Y]));ae.instanceMatrix.needsUpdate=!0,ae.instanceColor&&(ae.instanceColor.needsUpdate=!0),ae.castShadow=!0,ae.receiveShadow=!0,i.add(ae);const ne=new Zi(.72,1,4);ne.rotateY(Math.PI/4);const Le=new q({map:ut,color:14314033,roughness:.72}),w=new nn(ne,Le,be.length);for(let Y=0;Y<be.length;Y++)w.setMatrixAt(Y,be[Y]);w.instanceMatrix.needsUpdate=!0,w.castShadow=!0,i.add(w);const O=new q({map:ct,roughness:.38,metalness:.18}),V=new nn(xe,O,Re.length);for(let Y=0;Y<Re.length;Y++)V.setMatrixAt(Y,Re[Y]);V.instanceMatrix.needsUpdate=!0,i.add(V);const X=new q({color:3112239,roughness:.88,metalness:.02}),B=new nn(new Xt(1,8,6),X,Ze.length);for(let Y=0;Y<Ze.length;Y++)B.setMatrixAt(Y,Ze[Y]);B.instanceMatrix.needsUpdate=!0,B.castShadow=!0,B.receiveShadow=!0,i.add(B)}const K=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let N=0;N<Math.min(ve.length,34);N++){const F=ve[N],W=K[N%K.length],Q=N%3===0?"#ff4fb7":N%3===1?"#4ff3ff":"#ffd45b",ee=new Lt({map:th(W,Q),transparent:!0,side:gt,depthWrite:!1}),ae=new G(new Bt(8,24),ee);ae.position.set(F.px,F.gy+Math.max(14,F.h*.58),F.pz+F.zSide*(F.d*.5+.25)),ae.rotation.y=F.zSide<0?Math.PI:0,i.add(ae),Vi("vertical-neon",ae.position.x,ae.position.y,ae.position.z)}for(let N=0;N<Math.min(Se.length,48);N++){const F=Se[N],W=Si[(N*5+2)%Si.length],Q=yi[(N*2+1)%yi.length],ee=new Lt({map:so(W,Q),transparent:!0,side:gt,depthWrite:!1}),ae=Math.min(17,(F.axis==="x"?F.d:F.w)*.82),ne=new G(new Bt(ae,4.7),ee),Le=F.gy+Math.max(6.2,Math.min(F.h-3.5,F.h*(.28+N%3*.12)));F.axis==="x"?(ne.position.set(F.px+F.side*(F.w*.5+.22),Le,F.pz),ne.rotation.y=F.side>0?Math.PI/2:-Math.PI/2):(ne.position.set(F.px,Le,F.pz+F.side*(F.d*.5+.22)),ne.rotation.y=F.side<0?Math.PI:0),i.add(ne),Vi("wall-sign",ne.position.x,ne.position.y,ne.position.z)}for(let N=0;N<Math.min(Z.length,18);N++){const F=Z[N],W=Si[(N*7+4)%Si.length],Q=la[(N*5+3)%la.length],ee=yi[(N+3)%yi.length],ae=new lt,ne=new q({map:dd(W,Q,ee),color:16777215,roughness:.2,metalness:.06,emissive:new tt(ee),emissiveIntensity:.34}),Le=Math.min(18,(F.axis==="x"?F.d:F.w)*.86),w=new G(new De(Le,5.2,.42),ne);w.position.y=4.8,ae.add(w);const O=new q({color:1053978,roughness:.44,metalness:.28});for(const V of[-Le*.34,Le*.34]){const X=new G(new ft(.13,.17,5,8),O);X.position.set(V,2.25,-.2),ae.add(X)}ae.position.set(F.px,F.gy+F.h+.7,F.pz),ae.rotation.y=F.axis==="x"?F.side>0?Math.PI/2:-Math.PI/2:F.side<0?Math.PI:0,i.add(ae),Vi("roof-billboard",ae.position.x,ae.position.y+4.8,ae.position.z)}const oe=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],de=new De(2.2,1.4,4.6),ie=130,ke=new nn(de,new q({roughness:.42,metalness:.36}),ie);let Ce=0,Je=0;for(;Ce<ie&&Je<ie*6;){Je++;const N=Math.random()<.5,F=N?t+Math.round(Math.random()*((n-t)/a))*a+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(n-t),W=N?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(An(F,W,4).clearance<2)continue;const Q=We(F,W)+.7;e.position.set(F,Q,W),e.quaternion.setFromAxisAngle(sn,N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),ke.setMatrixAt(Ce,e.matrix),ke.setColorAt(Ce,new tt(oe[Math.random()*oe.length|0])),Ce++}ke.count=Ce,ke.instanceMatrix.needsUpdate=!0,ke.instanceColor&&(ke.instanceColor.needsUpdate=!0),i.add(ke);const He=new Map,fe=(N,F)=>`${Math.round(N)},${Math.round(F)}`;function we(N,F){const Q=((F+N.phase)%15.5+15.5)%15.5;return Q<6.2?{green:"ns",yellow:null}:Q<7.4?{green:null,yellow:"ns"}:Q<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function Qe(){const N=[],F=new q({color:1120028,roughness:.38,metalness:.62}),W=new q({color:1382685,roughness:.34,metalness:.38}),Q=Kg(),ee=new Lt({map:Q,transparent:!0,side:gt}),ae=new q({color:5050642,roughness:.48,metalness:.12}),ne=(B,Y)=>new q({color:B,roughness:.16,metalness:.02,emissive:Y,emissiveIntensity:.2}),Le=(B,Y,he,ue,me,Ae)=>{const ge=new lt,Ne=new G(new De(1.15,2.85,.75),W);ge.add(Ne);const Ke=ne(16724008,16717836),ht=ne(16767053,16757276),Mt=ne(4521842,1693789),St=[Ke,ht,Mt];for(let mt=0;mt<3;mt++){const Ge=new G(new Xt(.28,12,8),St[mt]);Ge.position.set(0,.78-mt*.78,-.42),ge.add(Ge)}ge.position.set(he,ue,me),ge.rotation.y=Ae,B.add(ge),N.push({axis:Y,red:Ke,yellow:ht,green:Mt,control:B.userData.control})},w=(B,Y,he)=>{const ue=fe(B,Y),me={type:"signal",x:B,z:Y,phase:he%4*2.1};He.set(ue,me);const Ae=We(B,Y),ge=new lt;ge.userData.control=me;const Ne=o*.72,Ke=o*.72,ht=new G(new ft(.18,.24,8.2,8),F);ht.position.set(Ne,4.1,Ke),ge.add(ht);const Mt=new G(new De(o*1.65,.2,.2),F);Mt.position.set(Ne-o*.72,8,Ke),ge.add(Mt);const St=new G(new De(.2,.2,o*1.65),F);St.position.set(Ne,7.55,Ke-o*.72),ge.add(St),Le(ge,"ns",Ne-o*1.24,7.52,Ke,0),Le(ge,"ns",Ne-o*.18,7.52,-Ke,Math.PI),Le(ge,"ew",Ne,7.05,Ke-o*1.24,Math.PI/2),Le(ge,"ew",-Ne,7.05,Ke-o*.18,-Math.PI/2),ge.position.set(B,Ae,Y),ge.traverse(mt=>{mt.castShadow=!0,mt.receiveShadow=!0}),i.add(ge)},O=(B,Y,he)=>{const ue=fe(B,Y);He.set(ue,{type:"stop",x:B,z:Y,phase:0});const me=We(B,Y),Ae=new lt,ge=he%2?-1:1,Ne=he%3?1:-1,Ke=new G(new ft(.12,.16,4.2,7),F);Ke.position.y=2.1,Ae.add(Ke);const ht=new G(new fn(1.04,8),ae);ht.position.y=4.55,ht.rotation.y=Math.PI,Ae.add(ht);const Mt=new G(new Bt(2.05,2.05),ee);Mt.position.set(0,4.55,-.04),Ae.add(Mt),Ae.position.set(B+ge*o*.74,me,Y+Ne*o*.74),Ae.rotation.y=Math.atan2(ge,Ne),Ae.traverse(St=>{St.castShadow=!0,St.receiveShadow=!0}),i.add(Ae)};let V=0,X=0;for(let B=1;B<l.length-1;B++)for(let Y=1;Y<d.length-1;Y++){const he=l[B],ue=d[Y];if(An(he,ue,o*.9).clearance<2)continue;const me=Math.abs(he-80)<=a*1.05&&ue<=s&&ue>=-560,Ae=ue<-260&&ue>-1180&&(B+Y)%4===0,ge=ue>-360&&(B+Y)%2===0;me&&Y%2===0||Ae?w(he,ue,V++):(ge||(B+Y)%5===0&&ue>-820)&&O(he,ue,X++)}return Gn(i,B=>{for(const Y of N){const he=we(Y.control,B);Y.red.emissiveIntensity=he.green===Y.axis||he.yellow===Y.axis?.12:2.3,Y.yellow.emissiveIntensity=he.yellow===Y.axis?2.6:.12,Y.green.emissiveIntensity=he.green===Y.axis?2.6:.1}}),{trafficLights:V,stopSigns:X}}const je=Qe();s_(i,u,{X0:t,X1:n,ZN:s,ZF:r,pitch:a,streetW:o,trafficControls:He}),qe.trafficLights=je.trafficLights,qe.stopSigns=je.stopSigns;const Oe=new ft(.12,.16,7.2,7),it=new Xt(.46,10,8),k=new Bt(2.8,13),Pe=new q({color:1581353,roughness:.42,metalness:.68}),Te=new q({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),Ee=new Lt({color:16760163,transparent:!0,opacity:.16,depthWrite:!1,side:gt,blending:Wi}),pe=132,le=new nn(Oe,Pe,pe),Be=new nn(it,Te,pe),nt=new nn(k,Ee,pe);let yt=0;for(let N=0;N<pe*2&&yt<pe;N++){const F=Math.random()<.5,W=F?t+Math.round(Math.random()*((n-t)/a))*a+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(n-t),Q=F?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(An(W,Q,3).clearance<2)continue;const ee=We(W,Q);e.quaternion.identity(),e.position.set(W,ee+3.6,Q),e.scale.set(1,1,1),e.updateMatrix(),le.setMatrixAt(yt,e.matrix),e.position.set(W,ee+7.5,Q),e.updateMatrix(),Be.setMatrixAt(yt,e.matrix),e.position.set(W,ee+.72,Q),e.quaternion.setFromAxisAngle(new L(1,0,0),-Math.PI/2),e.rotateZ(F?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),nt.setMatrixAt(yt,e.matrix),yt++}le.count=yt,Be.count=yt,nt.count=yt,le.instanceMatrix.needsUpdate=!0,Be.instanceMatrix.needsUpdate=!0,nt.instanceMatrix.needsUpdate=!0,i.add(le,Be,nt),qe.streetLights=yt,i.add(new G(p([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),_)),i.add(new G(p([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),_)),i.add(new G(p([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),m)),i.add(new G(p([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),x));const Ut=new q({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let N=330;N>=-700;N-=32){const F=new G(new De(1.15,.09,13.5),Ut);F.position.set(80,We(80,N)+.9,N),F.receiveShadow=!0,i.add(F)}for(const N of[286,156,26,-104])for(let F=0;F<7;F++){const W=new G(new De(2,.08,11.8),h),Q=71.2+F*2.95;W.position.set(Q,We(Q,N)+.91,N),W.receiveShadow=!0,i.add(W),Mi("roadDetails","openerCrosswalkStripes")}const wn=new Lt({color:16765818,transparent:!0,opacity:.28,depthWrite:!1,side:gt,blending:Wi});function pn(N,F,W,Q=!1){const ee=We(N,F),ae=new lt,ne=new G(new ft(.16,.22,9.5,8),Pe);ne.position.y=4.75,ae.add(ne);const Le=new G(new De(3.8,.22,.22),Pe);Le.position.set(W*1.75,8.95,0),ae.add(Le);const w=new G(new Xt(.62,12,8),Te);w.position.set(W*3.6,8.82,0),ae.add(w);const O=new G(new fn(4.6,20),wn.clone());O.position.copy(w.position),O.rotation.x=-Math.PI/2,O.material.opacity=.18+Math.random()*.12,ae.add(O);const V=new G(new Bt(3.2,15),Ee.clone());if(V.position.set(W*2.8,.72,0),V.rotation.x=-Math.PI/2,V.scale.y=.7+Math.random()*.35,ae.add(V),Q){const X=new Lc(16762474,3,52,2.2);X.position.copy(w.position),ae.add(X)}ae.position.set(N,ee,F),i.add(ae),qe.streetLights++}let xr=0;for(let N=340;N>=-700;N-=118)pn(63,N,1,xr++%4===0),pn(97,N-42,-1,xr++%4===0);function Jn(N,F,W,Q,ee=6010942){const ae=new q({color:ee,roughness:.92,metalness:.01}),ne=new G(new De(W,.08,Q),ae);return ne.position.set(N,We(N,F)+.06,F),ne.receiveShadow=!0,i.add(ne),qe.openerProps++,ne}function Ri(N,F,W=1){const Q=We(N,F),ee=new lt,ae=new G(new ft(.35,.55,5.5,8),new q({color:6832160,roughness:.88}));ae.position.y=2.75,ee.add(ae);const ne=new q({color:7587902,roughness:.86}),Le=new q({color:4167215,roughness:.9}),w=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let O=0;O<w.length;O++){const[V,X,B,Y]=w[O],he=new G(new Xt(Y,12,8),O%2?Le:ne);he.position.set(V,X,B),he.scale.y=.78,he.castShadow=!0,ee.add(he)}return ee.position.set(N,Q,F),ee.scale.setScalar(W),i.add(ee),$i.push({kind:"tree",x:N,z:F,radius:3.4*W,maxY:Q+11*W}),qe.openerProps++,ee}function jn(N,F,W=15){const Q=new q({color:10129021,roughness:.98,flatShading:!0,side:gt}),ee=new G(new ma(W,2),Q),ae=ee.geometry.attributes.position;for(let ne=0;ne<ae.count;ne++){const Le=ae.getX(ne),w=ae.getY(ne),O=ae.getZ(ne),V=.86+Math.sin(ne*17.1)*.09+Math.cos(ne*9.3)*.07;ae.setXYZ(ne,Le*(1.15+ne%3*.06)*V,w*(.72+ne%5*.035)*V,O*(.92+ne%4*.05)*V)}return ae.needsUpdate=!0,ee.geometry.computeVertexNormals(),ee.position.set(N,We(N,F)+W*.46,F),ee.rotation.set(.34,-.72,.18),ee.castShadow=!0,ee.receiveShadow=!0,i.add(ee),$i.push({kind:"rock",x:N,z:F,radius:W*.98,maxY:ee.position.y+W*.68}),qe.openerProps++,ee}function Fs(N,F,W=0){const Q=new lt,ee=new q({color:10970418,roughness:.64,metalness:.04}),ae=new q({color:1910317,roughness:.46,metalness:.5});for(const ne of[1.05,1.55]){const Le=new G(new De(6.8,.22,.44),ee);Le.position.y=ne,Q.add(Le)}for(const ne of[-2.7,2.7]){const Le=new G(new De(.22,1.2,.35),ae);Le.position.set(ne,.62,0),Q.add(Le)}Q.position.set(N,We(N,F),F),Q.rotation.y=W,i.add(Q),qe.openerProps++}function gr(N,F){const W=new q({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),Q=new lt,ee=new G(new ft(.34,.42,1.25,12),W);ee.position.y=.65,Q.add(ee);const ae=new G(new Xt(.42,12,8),W);ae.position.y=1.32,Q.add(ae);const ne=new G(new ft(.16,.16,1.1,10),W);ne.rotation.z=Math.PI/2,ne.position.y=.9,Q.add(ne),Q.position.set(N,We(N,F),F),i.add(Q),qe.openerProps++}function _r(N,F,W=0){const Q=new lt,ee=new q({color:1185821,roughness:.36,metalness:.68}),ae=new q({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),ne=new q({color:2370611,roughness:.42,metalness:.32}),Le=new G(new De(8.5,.35,3.2),ne);Le.position.y=4.2,Q.add(Le);for(const V of[-3.8,3.8]){const X=new G(new ft(.09,.11,4.1,7),ee);X.position.set(V,2.05,-1.25),Q.add(X)}const w=new G(new De(8,2.8,.08),ae);w.position.set(0,2.2,1.35),Q.add(w);const O=new G(new Bt(2.3,2.8),new Lt({map:so("BUS","#4ff3ff"),transparent:!0,side:gt}));O.position.set(-2.4,2.2,1.42),Q.add(O),Q.position.set(N,We(N,F),F),Q.rotation.y=W,i.add(Q),Vi("bus-shelter-ad",N,We(N,F)+2.2,F),qe.openerProps++}function Zt(N,F,W,Q,ee,ae,ne,Le=null,w=0){if(zi(N,F,W,Q,12))return!1;const O=We(N,F)-.45;if(ki(N,F,W,Q,O+ee+2))return!1;const V=N<80?1:-1,X=new q({map:vs(192,512,ne),color:ae,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),B=new G(new De(W,ee,Q),X);B.position.set(N,O+ee/2,F),B.castShadow=!1,B.receiveShadow=!0,i.add(B);const Y=new q({map:vs(220,620,Math.min(.86,ne+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:gt}),he=new G(new Bt(Q*.78,ee*.74),Y);he.position.set(N+V*(W/2+.09),O+ee*.54,F),he.rotation.y=V>0?Math.PI/2:-Math.PI/2,i.add(he);for(const Ae of[-1,1]){const ge=new G(new Bt(W*.82,ee*.72),Y.clone());ge.position.set(N,O+ee*.55,F+Ae*(Q/2+.1)),ge.rotation.y=Ae>0?0:Math.PI,i.add(ge)}const ue=new G(new De(W*1.04,1.2,Q*1.04),new q({color:1778733,roughness:.34,metalness:.38}));ue.position.set(N,O+ee+.7,F),i.add(ue);const me=new q({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const Ae of[-1,1]){const ge=new G(new De(W*1.1,.22,.18),me);ge.position.set(N,O+ee+1.4,F+Ae*(Q/2+.18)),i.add(ge)}if(Le&&w){const Ae=new Lt({map:th(Le,Le==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:gt,depthWrite:!1}),ge=new G(new Bt(7.5,24),Ae);ge.position.set(N+w*(W/2+.3),O+Math.min(ee-8,ee*.58),F),ge.rotation.y=w>0?Math.PI/2:-Math.PI/2,i.add(ge),Vi("showcase-neon",ge.position.x,ge.position.y,ge.position.z)}return gn.push({x:N,z:F,hw:W*.5,hd:Q*.5,maxY:O+ee+2}),It("showcase","glassTower"),!0}function vr(N,F,W,Q=3.2){const ee=N*.5+Q,ae=F*.5+Q,ne=Math.max(2,Math.abs(ee-ae)*.72),w=N>=F?[-ee,0,-ae,ee,0,-ae,ne,W,0,-ee,0,-ae,ne,W,0,-ne,W,0,ee,0,-ae,ee,0,ae,ne,W,0,ee,0,ae,-ee,0,ae,-ne,W,0,ee,0,ae,ne,W,0,-ne,W,0,-ee,0,ae,-ee,0,-ae,-ne,W,0]:[-ee,0,-ae,ee,0,-ae,0,W,-ne,ee,0,-ae,ee,0,ae,0,W,ne,ee,0,-ae,0,W,ne,0,W,-ne,ee,0,ae,-ee,0,ae,0,W,ne,-ee,0,ae,-ee,0,-ae,0,W,-ne,-ee,0,ae,0,W,-ne,0,W,ne],O=new Wt;return O.setAttribute("position",new wt(w,3)),O.computeVertexNormals(),O}function Pi(N,F,W,Q,ee,ae,ne={}){if(zi(N,F,W,Q,12))return!1;const Le=We(N,F)-.3;if(ki(N,F,W,Q,Le+ee+(ne.roofH??8.2)+1,6))return!1;const w=ne.frontZ??-1,O=new q({map:z,color:ne.wallColor??14734788,roughness:.68,metalness:.03}),V=new G(new De(W,ee,Q),O);V.position.set(N,Le+ee/2,F),V.castShadow=!0,V.receiveShadow=!0,i.add(V);const X=new q({map:ut,color:ae,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),B=ne.roofH??8.2,Y=new G(vr(W,Q,B),X);Y.position.set(N,Le+ee,F),Y.castShadow=!0,Y.receiveShadow=!0,i.add(Y);const he=new q({color:15985112,roughness:.42,metalness:.05}),ue=new G(new De(W+7,.42,1.2),he);ue.position.set(N,Le+ee+.12,F+w*(Q*.5+1.4)),i.add(ue);const me=ue.clone();me.position.z=F-w*(Q*.5+1.4),i.add(me);const Ae=Math.min(18,W*.38),ge=new G(new De(Ae,ee*.55,.32),new q({map:ct,roughness:.34,metalness:.2}));ge.position.set(N+W*.18,Le+ee*.33,F+w*(Q*.5+.22)),i.add(ge);const Ne=new G(new De(5.2,7.2,.28),new q({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));Ne.position.set(N-W*.25,Le+3.7,F+w*(Q/2+.24)),i.add(Ne);const Ke=new q({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),ht=new q({color:3353638,roughness:.38});for(const zt of[-W*.36,-W*.05,W*.38]){if(Math.abs(zt-W*.18)<Ae*.45)continue;const _n=new G(new De(6.2,4.8,.26),ht);_n.position.set(N+zt,Le+ee*.58,F+w*(Q*.5+.28)),i.add(_n);const Yt=new G(new De(4.8,3.4,.3),Ke);Yt.position.copy(_n.position),Yt.position.z+=w*.04,i.add(Yt)}const Mt=new q({color:12370619,roughness:.44,metalness:.04}),St=new G(new De(Ae*1.18,.12,34),Mt);St.position.set(N+W*.18,We(N+W*.18,F+w*(Q*.5+17))+.11,F+w*(Q*.5+17)),i.add(St);const mt=new q({color:5679925,roughness:.86,metalness:.01}),Ge=new G(new De(W+10,.08,Q+12),mt);Ge.position.set(N,We(N,F)-.18,F),Ge.receiveShadow=!0,i.add(Ge),Ge.renderOrder=-1;const Pt=new q({color:3042609,roughness:.84}),at=[new q({color:16766544,roughness:.58}),new q({color:16738974,roughness:.58}),new q({color:16314584,roughness:.58})];for(let zt=0;zt<9;zt++){const _n=N-W*.44+zt*(W*.11),Yt=F+w*(Q*.5+2.2+zt%2*1.5),Vn=new G(new Xt(1.35+zt%3*.22,10,7),zt%4===0?at[zt%at.length]:Pt);Vn.position.set(_n,We(_n,Yt)+.95,Yt),Vn.scale.y=.72,Vn.castShadow=!0,i.add(Vn)}return gn.push({x:N,z:F,hw:W*.5,hd:Q*.5,maxY:Le+ee+5}),It("showcase","lowStorefront"),!0}return Jn(45,318,36,84,6404169),Jn(116,318,36,84,6074179),Jn(44,188,34,84,6798662),Jn(118,188,36,84,5941822),Jn(43,60,34,82,5679164),Jn(118,60,36,82,6864197),Zt(18,315,70,54,154,2311775,.72,"HOTEL",1),Zt(17,185,72,58,188,1522779,.78,null,0),Zt(31,55,44,56,138,2840688,.66,"OPEN",1),Zt(24,-75,52,64,182,1913933,.7,null,0),Zt(145,315,68,54,116,2776440,.72,null,0),Zt(146,185,70,58,146,2314602,.76,null,0),Zt(142,55,42,56,156,1590364,.68,"CAFE",-1),Zt(134,-75,48,64,114,3688540,.62,null,0),Zt(-70,315,52,52,146,2112085,.68,null,0),Zt(228,185,48,58,148,3235186,.66,null,0),Zt(-78,185,48,56,134,2181730,.68,null,0),Zt(236,315,44,54,104,3104884,.66,null,0),Pi(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),Pi(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),Zt(-48,-360,54,56,148,2439765,.58,null,0),Zt(172,-430,50,56,132,3817032,.66,"OPEN",-1),jn(112,238,12.5),Ri(50,292,1.2),Ri(111,316,.95),Ri(48,132,.9),Ri(116,102,1.05),Fs(47,248,Math.PI/2),gr(57,226),_r(111,260,-Math.PI/2),st.add(i),i}function a_(i,e=1){const n=bt(16),s=new L(n.tangent.x,0,n.tangent.z).normalize(),r=new L().crossVectors(sn,s).normalize(),a=n.p.clone().addScaledVector(n.side,e*ce.width*.5),o=165,c=52,l=a.x-s.x*o+r.x*e*c,d=a.z-s.z*o+r.z*e*c,u=new L(l,We(l,d)+.4,d),f=26,p=[];for(let C=0;C<=f;C++){const D=C/f,H=D*D*(3-2*D);p.push(new L(Xe.lerp(u.x,a.x,D),Xe.lerp(u.y,a.y,H),Xe.lerp(u.z,a.z,D)))}const x=7.4,_=new L,m=new L,h=[],v=[];for(let C=0;C<=f;C++)m.subVectors(p[Math.min(f,C+1)],p[Math.max(0,C-1)]),m.y=0,m.normalize(),_.crossVectors(sn,m).normalize(),h.push(p[C].clone().addScaledVector(_,-x)),v.push(p[C].clone().addScaledVector(_,x));const S={kind:"ramp",halfW:x,dirSel:e,mergeS:16,points:p.map(C=>C.clone()),segments:[]};for(let C=0;C<f;C++){const D=p[C],H=p[C+1],J=H.x-D.x,j=H.z-D.z,te=Math.max(1e-4,J*J+j*j);S.segments.push({a:D.clone(),b:H.clone(),abx:J,abz:j,lenSq:te,u0:C/f,u1:(C+1)/f})}Ma.push(S);const y=[];for(let C=0;C<f;C++){const D=h[C],H=v[C],J=h[C+1],j=v[C+1];y.push(D.x,D.y,D.z,H.x,H.y,H.z,j.x,j.y,j.z),y.push(D.x,D.y,D.z,j.x,j.y,j.z,J.x,J.y,J.z)}const E=new Wt;E.setAttribute("position",new wt(y,3)),E.computeVertexNormals();const T=new q({color:2895665,roughness:.85,metalness:.05,side:gt});i.add(new G(E,T));const P=new q({color:12107972,roughness:.5,metalness:.4});for(let C=0;C<f;C++)un(i,h[C].clone().setY(h[C].y+1),h[C+1].clone().setY(h[C+1].y+1),.16,P),un(i,v[C].clone().setY(v[C].y+1),v[C+1].clone().setY(v[C+1].y+1),.16,P);const R=new q({color:7173241,roughness:.82});for(let C=3;C<f;C+=3){const D=p[C],H=We(D.x,D.z),J=D.y-H;if(J<3)continue;const j=new G(new ft(.9,1.15,J,8),R);j.position.set(D.x,H+J/2,D.z),i.add(j),Wn.push({x:D.x,z:D.z,hw:1.3,hd:1.3,maxY:D.y-.9})}const b=new Lt({map:Fc("ON RAMP"),transparent:!0,side:gt}),M=new G(new Bt(12,3),b);M.position.copy(u).add(new L(0,5.5,0)),M.rotation.y=Math.atan2(-s.x,-s.z),i.add(M);for(const C of[-1,1]){const D=new G(new ft(.2,.26,6,6),R);D.position.set(u.x+r.x*C*5.4,u.y+3,u.z+r.z*C*5.4),i.add(D)}}function o_(){const i=new lt,e=[],t=new tt(14170671),n=new tt(15922680),s=new q({color:3883336,roughness:.6,metalness:.3}),r=new Lt({map:c_(),transparent:!0,side:gt}),a=new q({color:4926748,roughness:.9}),o=[new q({color:2055221,roughness:.92}),new q({color:3109954,roughness:.95}),new q({color:2583370,roughness:.9})],c=new q({color:7040883,roughness:.95,side:gt}),l=12,d=[],u=[];let f=0;for(let x=0;x<ce.length;x+=l){if(Ai(x+l*.5)){f++;continue}const _=bt(x),m=bt(x+l),h=_.p.clone().add(m.p).multiplyScalar(.5),{sideways:v,normal:S,q:y}=oi(_,m);for(const E of[-1,1]){const T=h.clone().addScaledVector(v,E*ce.width*.5).addScaledVector(S,.5);d.push(T),u.push(y),e.push(f%2===0?t:n)}if(f%16===8){const E=(f>>4)%2?1:-1,T=h.clone().addScaledVector(v,E*ce.width*.52).addScaledVector(S,.4),P=new lt,R=new G(new Bt(4.4,2.6),r);R.position.y=3.4,R.rotation.y=Math.PI,P.add(R);const b=new ft(.12,.16,3.4,5);for(const M of[-1.5,1.5]){const C=new G(b,s);C.position.set(M,1.7,0),P.add(C)}P.position.copy(T),P.quaternion.copy(y),i.add(P)}f++}for(let x=0;x<ce.length;x+=16){const _=bt(x),m=1+(Math.random()<.5?1:0);for(let h=0;h<m;h++){const v=Math.random()<.5?-1:1,S=ce.width/2+12+Math.random()*78,y=_.p.x+_.side.x*S*v+(Math.random()-.5)*16,E=_.p.z+_.side.z*S*v+(Math.random()-.5)*16;if(va(y,E,18))continue;const T=We(y,E);if(Math.random()<.78){const P=.7+Math.random()*1.5,R=new lt,b=2.4+Math.random()*4.2,M=new G(new ft(.26,.42,b,6),a);M.position.y=b/2,R.add(M);const C=2+Math.floor(Math.random()*3);for(let D=0;D<C;D++){const H=new G(new Zi(2.4+Math.random()*1.6-D*.2,4.6+Math.random()*2.4,7),o[(h+D+x)%o.length]);H.position.y=b+D*1.4+1.5,H.rotation.y=Math.random()*Math.PI,R.add(H)}R.position.set(y,T+.6,E),R.scale.setScalar(P),i.add(R)}else{const P=1.4+Math.random()*3.6,R=new G(new Ec(P,0),c);R.position.set(y,T+P*.35,E),R.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),R.scale.set(1,.7+Math.random()*.4,1),i.add(R),Wn.push({kind:"rock",x:y,z:E,radius:P*1.18})}}}const p=["START","SECTOR 2","SECTOR 3"];for(let x=0;x<3;x++){const _=ce.length*x/3+6;if(Ai(_))continue;const m=bt(_),h=bt(_+l),v=m.p.clone().add(h.p).multiplyScalar(.5),{q:S}=oi(m,h),y=ce.width*.5+1.2,E=9,T=new lt,P=new ft(.4,.55,E,7);for(const D of[-1,1]){const H=new G(P,s);H.position.set(D*y,E/2,0),T.add(H)}const R=y*2,b=new G(new De(R,1.1,1.1),s);b.position.y=E,T.add(b);const M=new Lt({map:Fc(p[x]),transparent:!0,side:gt}),C=new G(new Bt(R*.82,3),M);C.position.set(0,E-2,0),C.rotation.y=Math.PI,T.add(C),T.position.copy(v),T.quaternion.copy(S),i.add(T)}if(d.length){const x=new ft(.18,.24,3,6);x.translate(0,1.5,0);const _=new Xt(.34,8,6);_.translate(0,3.2,0);const m=new q({color:10134440,roughness:.7,metalness:.2}),h=new q({roughness:.55}),v=new nn(x,m,d.length),S=new nn(_,h,d.length),y=new Ht;for(let E=0;E<d.length;E++)y.position.copy(d[E]),y.quaternion.copy(u[E]),y.updateMatrix(),v.setMatrixAt(E,y.matrix),S.setMatrixAt(E,y.matrix),S.setColorAt(E,e[E]);v.instanceMatrix.needsUpdate=!0,S.instanceMatrix.needsUpdate=!0,S.instanceColor&&(S.instanceColor.needsUpdate=!0),i.add(v),i.add(S)}return a_(i),st.add(i),i}function c_(){const i=document.createElement("canvas");i.width=256,i.height=160;const e=i.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,i.width,i.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let n=-1;n<4;n++){e.beginPath();const s=n*70;e.moveTo(s,16),e.lineTo(s+40,i.height/2),e.lineTo(s,i.height-16),e.lineTo(s+18,i.height-16),e.lineTo(s+58,i.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new Jt(i);return t.colorSpace=Ct,t}function Fc(i){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(i,e.width/2,e.height/2);const n=new Jt(e);return n.colorSpace=Ct,n}function l_(i,e){const t=document.createElement("canvas");t.width=128,t.height=64;const n=t.getContext("2d"),s="#"+i.toString(16).padStart(6,"0"),r="#"+e.toString(16).padStart(6,"0"),a=8;for(let c=0;c<a;c++)n.fillStyle=c%2?s:r,n.fillRect(c/a*t.width,0,t.width/a+1,t.height);const o=new Jt(t);return o.colorSpace=Ct,o}function h_(){const i=document.createElement("canvas");i.width=256,i.height=128;const e=i.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,i.width,i.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const r=Math.random()*i.width,a=Math.random()*i.height;e.fillRect(r,a,2.4,2.4)}const n=new Jt(i);return n.colorSpace=Ct,n.wrapS=cn,n.repeat.set(3,1),n}function Ot(i,e,t,n,s){const r=new G(new De(e.x,e.y,e.z),s);return r.position.copy(t),r.quaternion.copy(n),r.castShadow=!1,r.receiveShadow=!0,i.add(r),r}function oi(i,e){const t=e.p.clone().sub(i.p).normalize(),n=ad.crossVectors(sn,t).normalize();let s=t.clone().cross(n).normalize();const r=(i.bank+e.bank)*.5;if(Math.abs(r)>.001){const c=new ui().setFromAxisAngle(t,r);n.applyQuaternion(c),s.applyQuaternion(c)}const a=new Dt().makeBasis(n,s,t),o=new ui().setFromRotationMatrix(a);return{tangent:t,sideways:n,normal:s,q:o}}function ih(i,e,t,n){const r=[],a=[],o=[],c=ce.width*.47;let l=0;for(let f=e;f<=t;f+=8){const p=bt(Math.min(f,t)),x=oi(p,bt(p.s+2)),_=Math.sin(f*.018)*.04,m=p.p.clone().addScaledVector(x.sideways,-c).addScaledVector(x.normal,.46+_),h=p.p.clone().addScaledVector(x.sideways,c).addScaledVector(x.normal,.46-_);r.push(m.x,m.y,m.z,h.x,h.y,h.z);const v=(f-e)/64;if(a.push(0,v,1,v),l>0){const S=(l-1)*2,y=l*2;o.push(S,S+1,y,S+1,y+1,y)}l++}const d=new Wt;d.setAttribute("position",new wt(r,3)),d.setAttribute("uv",new wt(a,2)),d.setIndex(o),d.computeVertexNormals();const u=new G(d,n);u.receiveShadow=!0,i.add(u)}function d_(i,e){let t=0;for(const n of ce.gaps)ih(i,t,Math.max(t,n.start-4),e),t=n.end+4;ih(i,t,ce.length,e)}function u_(i,e,t){const n=bt(e.s+2),{normal:s,q:r}=oi(e,n),a=new lt;a.position.copy(e.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new G(new De(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const c=new G(new De(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,a.add(c);const l=new G(new De(.42,.1,3.8),t);l.position.set(0,.01,-1.9),a.add(l),i.add(a)}function f_(){const i=new lt;st.add(i),rc=0;const e=new q({color:12171149,roughness:.72,metalness:.08}),t=new q({color:9869942,roughness:.78,metalness:.05}),n=new q({color:15255629,roughness:.28,metalness:.72}),s=new q({color:8204328,roughness:.3,metalness:.85}),r=new q({color:6120040,roughness:.5,metalness:.6}),a=new q({color:4080968,roughness:.58,metalness:.55}),o=new q({color:14270570,roughness:.35,metalness:.65}),c=new q({color:2435884,roughness:.48,metalness:.62}),l=new q({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new q({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new q({color:4935486,roughness:.92,metalness:.04}),f=new q({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),p=new q({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),x=new q({color:3159607,roughness:.7,metalness:.45}),_=new q({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),m=new q({color:15919561,roughness:.82,metalness:.02});new q({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const h=new q({map:Hg(),roughness:.74,metalness:.08}),v=new Lt({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),S=12;d_(i,h);function y(E,T=!1){if(Ai(E))return!1;const P=bt(E),R=bt(E+3),{sideways:b,normal:M,q:C}=oi(P,R),D=P.p,H=We(D.x,D.z),J=D.y-.95;if(J-H<10)return!1;const j=ce.width*(T?.43:.35),te=J,re=H+.25,se=T?.56:.42,xe=T?2.4:1.75,Me=T?.52:.36,ze=[],U=[];for(const _e of[-1,1]){const be=D.clone().addScaledVector(b,_e*j).addScaledVector(M,-.85);be.y=te;const Re=new L(be.x,re,be.z);un(i,Re,be,se,r);const Ye=new G(new ft(xe,xe*1.12,Me,12),r);Ye.position.set(Re.x,H+Me*.5,Re.z),Ye.receiveShadow=!0,i.add(Ye),ze.push(be),U.push(Re),Wn.push({x:Re.x,z:Re.z,hw:xe*.92,hd:xe*.92,maxY:te-.7})}const ye=D.clone().addScaledVector(M,-1.05);ye.y=te,Ot(i,new L(ce.width*.92,T?.58:.42,T?1.55:1.15),ye,C,a);const ve=U[0].clone();ve.y+=(te-re)*.28;const Se=U[1].clone();Se.y+=(te-re)*.28;const Z=ze[0].clone();Z.y-=1;const $=ze[1].clone();if($.y-=1,un(i,ve,$,T?.16:.1,c),un(i,Se,Z,T?.16:.1,c),T){const _e=U[0].clone();_e.y+=(te-re)*.58;const be=U[1].clone();be.y+=(te-re)*.58,un(i,U[0].clone().setY(re+1.2),be,.13,c),un(i,U[1].clone().setY(re+1.2),_e,.13,c),un(i,_e,$,.13,c),un(i,be,Z,.13,c)}return rc++,!0}for(let E=0;E<ce.length;E+=S){if(Ai(E+S*.5))continue;const T=bt(E),P=bt(E+S),R=T.p.clone().add(P.p).multiplyScalar(.5),{sideways:b,normal:M,q:C}=oi(T,P),D=T.p.distanceTo(P.p)+.45,H=Math.floor(E/(S*2))%2?e:t;Ot(i,new L(ce.width,.62,D),R.clone().addScaledVector(M,-.05),C,H),Ot(i,new L(ce.width-2.8,.08,D*.86),R.clone().addScaledVector(M,.36),C,u),Ot(i,new L(.2,.1,D*.76),R.clone().addScaledVector(b,-ce.width*.19).addScaledVector(M,.43),C,u),Ot(i,new L(.2,.1,D*.76),R.clone().addScaledVector(b,ce.width*.19).addScaledVector(M,.43),C,u),E%48===0&&(Ot(i,new L(.14,.08,D*.62),R.clone().addScaledVector(b,-ce.width*.08).addScaledVector(M,.51),C,_),Ot(i,new L(.14,.08,D*.62),R.clone().addScaledVector(b,ce.width*.08).addScaledVector(M,.51),C,_)),E%120===0&&Ot(i,new L(ce.width*.42,.07,.72),R.clone().addScaledVector(M,.55),C,m),Ot(i,new L(ce.width+1.2,.35,D*.94),R.clone().addScaledVector(M,-.56),C,a),Ot(i,new L(.42,.42,D*.9),R.clone().addScaledVector(b,-ce.width*.36).addScaledVector(M,-.78),C,x),Ot(i,new L(.42,.42,D*.9),R.clone().addScaledVector(b,ce.width*.36).addScaledVector(M,-.78),C,x);const J=R.clone().addScaledVector(b,-ce.width*.51),j=R.clone().addScaledVector(b,ce.width*.51);if(Ot(i,new L(.32,.46,D),J.clone().addScaledVector(M,.28),C,n),Ot(i,new L(.32,.46,D),j.clone().addScaledVector(M,.28),C,n),Ot(i,new L(.26,.72,D*.94),J.clone().addScaledVector(M,-.22),C,a),Ot(i,new L(.26,.72,D*.94),j.clone().addScaledVector(M,-.22),C,a),E%36===0)for(const te of[-ce.width*.39,-ce.width*.2,ce.width*.2,ce.width*.39]){const re=new G(new ft(.16,.2,.12,10),o);re.position.copy(R).addScaledVector(b,te).addScaledVector(M,.46),re.quaternion.copy(C),re.castShadow=!1,i.add(re)}if(E%72===0&&(Ot(i,new L(.34,1.56,3.4),R.clone().addScaledVector(b,-ce.width*.66).addScaledVector(M,1.16),C,s),Ot(i,new L(.34,1.56,3.4),R.clone().addScaledVector(b,ce.width*.66).addScaledVector(M,1.16),C,s),Ot(i,new L(.18,.18,4.4),R.clone().addScaledVector(b,-ce.width*.62).addScaledVector(M,1.94),C,s),Ot(i,new L(.18,.18,4.4),R.clone().addScaledVector(b,ce.width*.62).addScaledVector(M,1.94),C,s),Ot(i,new L(.12,.12,4),R.clone().addScaledVector(b,-ce.width*.62).addScaledVector(M,1.38),C,n),Ot(i,new L(.12,.12,4),R.clone().addScaledVector(b,ce.width*.62).addScaledVector(M,1.38),C,n),un(i,R.clone().addScaledVector(b,-ce.width*.58).addScaledVector(M,-1.08),R.clone().addScaledVector(b,ce.width*.58).addScaledVector(M,-1.08),.11,c),un(i,R.clone().addScaledVector(b,-ce.width*.48).addScaledVector(M,-1),R.clone().addScaledVector(b,0).addScaledVector(M,-2.2),.09,c),un(i,R.clone().addScaledVector(b,ce.width*.48).addScaledVector(M,-1),R.clone().addScaledVector(b,0).addScaledVector(M,-2.2),.09,c)),E%96===0){const te=new G(new fn(1,28),v);te.rotation.x=-Math.PI/2,te.position.set(R.x,-4.72,R.z),te.scale.set(ce.width*.9,Math.max(10,D*2.2),1),te.rotation.z=Math.atan2(oi(T,P).tangent.x,oi(T,P).tangent.z),i.add(te)}if(E%144===0){const te=R.clone().addScaledVector(b,-ce.width*.74).addScaledVector(M,2),re=R.clone().addScaledVector(b,ce.width*.74).addScaledVector(M,2);un(i,te.clone().addScaledVector(M,-1.2),te.clone().addScaledVector(M,1.1),.12,s),un(i,re.clone().addScaledVector(M,-1.2),re.clone().addScaledVector(M,1.1),.12,s),Ot(i,new L(.46,.72,.46),te.clone().addScaledVector(M,1.15),C,l),Ot(i,new L(.46,.72,.46),re.clone().addScaledVector(M,1.15),C,l)}if(E%288===0){const te=R.clone().addScaledVector(b,(Math.floor(E/144)%2?1:-1)*ce.width*.92).addScaledVector(M,5.2);Ot(i,new L(.44,.44,.44),te.clone(),C,f),un(i,te.clone().addScaledVector(M,-.2),R.clone().addScaledVector(M,1),.05,c)}E%48===0&&y(E+S*.5,!1),E%168===0&&!Ai(E+16)&&u_(i,bt(E+5),d)}for(const E of ce.gaps){const T=bt(E.start-3),P=bt(E.end+3);for(const R of[T,P]){const b=bt(R.s+2),{normal:M,q:C}=oi(R,b);Ot(i,new L(ce.width-1.2,.08,4.6),R.p.clone().addScaledVector(M,.54),C,l),Ot(i,new L(ce.width*.62,.09,1.3),R.p.clone().addScaledVector(M,.62).addScaledVector(R.tangent,R===T?-6.3:6.3),C,m);for(const D of[-ce.width*.42,0,ce.width*.42]){const H=R.p.clone().addScaledVector(R.side,D).addScaledVector(M,2.35);Ot(i,new L(.46,.46,.46),H,C,D===0?p:l)}y(R.s+(R===T?-9:9),!0),y(R.s+(R===T?-24:24),!0)}}return i}function md(i=13710372,e=7740696){const t=new lt,n=new q({color:i,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new q({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),r=new q({color:329225,roughness:.52,metalness:.12}),a=new q({color:1053463,roughness:.38,metalness:.34}),o=new q({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),c=new q({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),l=new q({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),d=new q({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:1.25}),u=new q({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:.88}),f=new q({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:.95}),p=new q({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),x=new q({color:329225,roughness:.44,metalness:.22}),_=new G(new fn(3.65,36),new Lt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));_.rotation.x=-Math.PI/2,_.position.y=.08,_.scale.z=1.58,t.add(_);const m=(y,E,T,P,R=null,b=null)=>{const M=new G(E,T);return M.name=y,M.position.copy(P),R&&M.rotation.set(R.x||0,R.y||0,R.z||0),b&&M.scale.copy(b),t.add(M),M},h=(y,E,T,P,R,b,M=0,C=0,D=0)=>m(y,new De(E.x,E.y,E.z),T,new L(P,R,b),new L(M,C,D));h("low black undertray",new L(5.25,.28,8.45),r,0,.45,-.08),h("wide wedge body tub",new L(4.85,.86,6.65),n,0,.98,.28,-.035),h("sloped front wedge nose",new L(3.7,.64,3.35),n,0,.83,-3.75,-.145),h("front black splitter",new L(5.25,.13,.78),r,0,.35,-5.6),h("left sculpted rocker panel",new L(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),h("right sculpted rocker panel",new L(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),h("left rear haunch",new L(.72,.74,2.55),n,-2.53,1.18,2.08,-.04),h("right rear haunch",new L(.72,.74,2.55),n,2.53,1.18,2.08,-.04),h("left front fender flare",new L(.46,.54,1.38),n,-2.55,.98,-2.78,-.04),h("right front fender flare",new L(.46,.54,1.38),n,2.55,.98,-2.78,-.04),h("black rear fascia",new L(4.72,.66,.2),a,0,1.02,4.04),h("deep rear bumper",new L(5.32,.38,.48),c,0,.58,4.23),h("front windshield",new L(2.8,.13,1.15),l,0,1.78,-1.25,-.48),h("roof glass",new L(2.34,.18,1.55),l,0,2.08,-.2,-.13),h("left side window",new L(.12,.78,1.9),l,-1.28,1.76,-.15,-.08,.04),h("right side window",new L(.12,.78,1.9),l,1.28,1.76,-.15,-.08,-.04),h("black a pillar left",new L(.12,.86,.14),x,-1.46,1.75,-1.22,-.48),h("black a pillar right",new L(.12,.86,.14),x,1.46,1.75,-1.22,-.48),h("rear deck panel",new L(3.5,.18,2.18),n,0,1.7,2,-.2);for(let y=0;y<7;y++)h("black rear deck louver",new L(3.35,.12,.18),a,0,1.83+y*.015,1.1+y*.28,-.21);h("raised rear spoiler blade",new L(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const y of[-2.28,2.28])h("spoiler side endplate",new L(.24,.78,1.04),s,y,1.43,3.72,0,0,y<0?-.08:.08);for(const y of[-1.78,1.78])h("thin hood crease",new L(.08,.04,2.55),x,y*.36,1.27,-3.45,-.15),h("door seam",new L(.035,.68,1.75),x,y,1.16,-.2),h("side intake",new L(.09,.34,.9),a,Math.sign(y)*2.68,.86,1.42);for(const y of[-1.04,1.04])h("pop up headlight glass",new L(.62,.12,.18),f,y,1.02,-5.28,-.16);h("tail light backplate",new L(3.86,.46,.08),x,0,1.08,4.18);for(const y of[-1.42,-.62,.62,1.42])h("rectangular glowing tail lamp",new L(.54,.28,.1),Math.abs(y)>1?d:u,y,1.08,4.24);h("slim chrome beltline left",new L(.06,.08,4.75),o,-2.72,1.42,-.2),h("slim chrome beltline right",new L(.06,.08,4.75),o,2.72,1.42,-.2),h("left black roof rail",new L(.12,.12,2.72),x,-1.34,2.15,-.42,-.13),h("right black roof rail",new L(.12,.12,2.72),x,1.34,2.15,-.42,-.13);for(const y of[-2.86,2.86])h("angular side mirror arm",new L(.42,.08,.08),x,y,1.62,-1.55,0,0,y<0?-.14:.14),h("blue tinted side mirror",new L(.12,.34,.46),l,y*1.03,1.62,-1.65,0,y<0?.24:-.24),h("flush door handle",new L(.08,.11,.46),o,y*.94,1.28,.52);for(const y of[-2.65,2.42])h("left wheel arch shadow",new L(.08,.9,1.75),x,-2.82,.78,y),h("right wheel arch shadow",new L(.08,.9,1.75),x,2.82,.78,y);h("black license recess",new L(.9,.24,.08),a,0,.76,4.31);const v=[],S=(y,E,T=!1)=>{const P=new lt;P.name=T?"steering front wheel assembly":"rear wheel assembly",P.position.set(y,.54,E);const R=new G(new ft(.88,.88,.62,28),r);R.name="wide performance tire",R.rotation.z=Math.PI/2,P.add(R);const b=new G(new fr(.88,.06,10,32),r);b.name="rounded tire sidewall",b.rotation.y=Math.PI/2,P.add(b);const M=new G(new ft(.42,.42,.66,24),o);M.name="chrome wheel rim",M.rotation.z=Math.PI/2,P.add(M);const C=new G(new ft(.56,.56,.08,24),p);C.name="visible brake disc",C.rotation.z=Math.PI/2,C.position.x=y>0?-.05:.05,P.add(C);for(let J=0;J<8;J++){const j=new G(new De(.08,.055,.62),o);j.name="thin wheel spoke",j.rotation.x=J/8*Math.PI*2,j.position.set(y>0?.035:-.035,0,.22),P.add(j)}const D=new G(new De(.1,.22,.18),u);D.name="small brake caliper",D.position.set(y>0?-.39:.39,.18,-.38),P.add(D);const H=new G(new ft(.17,.17,.72,18),c);H.name="dark center cap",H.rotation.z=Math.PI/2,P.add(H),t.add(P),T&&v.push(P)};for(const y of[-2.4,2.4])S(y,-2.65,!0),S(y,2.42,!1);t.userData.frontWheels=v,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const y of[-.92,-.52,.52,.92]){const E=new G(new ft(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(y,.43,4.52),t.add(E)}return t.traverse(y=>{y.castShadow=!0,y.receiveShadow=!0}),st.add(t),t}function p_(){const i=new lt,e=new q({color:9383205,roughness:.35,metalness:.55}),t=new q({color:460551,roughness:.55}),n=new q({color:12375772,roughness:.18,metalness:.9}),s=new q({color:16767297,roughness:.38,metalness:.25}),r=new q({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new q({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.16}),o=new q({color:1118995,roughness:.7,metalness:.05}),c=new G(new De(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),i.add(c);const l=new G(new De(.16,.028,1.92),n);l.position.set(0,-.64,-2.28),i.add(l);const d=new G(new De(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,i.add(d);const u=new G(new Bt(2.8,.82,1,1),a);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,i.add(u);const f=new G(new fr(.36,.035,12,48),o);f.position.set(0,-.46,-1.02),f.rotation.x=Math.PI/2.75,i.add(f);for(let p=0;p<3;p++){const x=new G(new De(.34,.025,.035),n);x.position.copy(f.position),x.rotation.copy(f.rotation),x.rotation.z+=p/3*Math.PI*2,i.add(x)}for(let p=0;p<6;p++){const x=new G(new ft(.16,.16,.56,18),n);x.rotation.z=Math.PI/2,x.position.set(-.78+p*.31,-.42+Math.sin(p)*.03,-2.12),i.add(x)}for(const p of[-1.08,1.08]){const x=new G(new ft(.34,.34,.25,18),t);x.rotation.z=Math.PI/2,x.position.set(p,-.68,-1.58),i.add(x);const _=new G(new fr(.22,.035,8,28),s);_.scale.set(.72,1.25,.72),_.position.set(p*.8,-.48,-1.74),_.rotation.x=Math.PI/2,i.add(_)}for(const p of[-1.14,-.84,.84,1.14]){const x=new G(new ft(.035,.04,.028,8),n);x.position.set(p,-.39,-1.28),x.rotation.x=Math.PI/2,i.add(x)}for(const p of[-.52,.52]){const x=new G(new Xt(.045,12,8),r);x.position.set(p,-.34,-1.22),i.add(x)}i.position.set(0,0,0),dt.add(i),fi=i}function m_(){const i=new q({color:16119285,roughness:.35,metalness:.25}),e=new q({color:1184274,roughness:.45}),t=new q({map:Gg(),roughness:.42,metalness:.05}),n=new q({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=bt(0),r=new Dt().makeBasis(s.side,sn,s.tangent),a=new ui().setFromRotationMatrix(r),o=new lt;for(const d of[-ce.width*.58,ce.width*.58]){const u=new G(new De(.8,11,.8),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(sn,5.4),u.quaternion.copy(a),o.add(u)}const c=new G(new De(ce.width+3,.8,1),t);c.position.copy(s.p).addScaledVector(sn,11.2),c.quaternion.copy(a),o.add(c);const l=new G(new De(ce.width+1.2,1.4,.18),e);l.position.copy(s.p).addScaledVector(sn,12.5).addScaledVector(s.tangent,-.55),l.quaternion.copy(a),o.add(l);for(const d of[-ce.width*.38,0,ce.width*.38]){const u=new G(new Xt(.32,16,10),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(sn,10.25),o.add(u)}return st.add(o),o}const bs=md(),yn=md(3108784,1916782);yn.visible=!1;Qg();jg();qe.signs=0;ha.length=0;e_();t_();r_();let sh=null,rh=null,ah=null,fi=null;p_();function oo(i){i&&(i.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const n of t)n.map&&n.map.dispose(),n.dispose()}}),st.remove(i))}function Oc(i){return ta=Xe.clamp(i,0,ji.length-1),ce=ji[ta],Wn.length=0,Ma.length=0,oo(sh),oo(rh),oo(ah),sh=f_(),rh=m_(),ah=o_(),et.trackName.textContent=ce.name,et.courseName&&(et.courseName.textContent=ce.name),et.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===ta)}),ce.name}Oc(0);const Ns=new Dg(Qt);Ns.addPass(new Ig(st,dt));const xd=new Ps(new Ie(window.innerWidth,window.innerHeight),.34,.78,1);Ns.addPass(xd);Ns.addPass(new Ng);const x_={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},Ks=new sd(x_);Ns.addPass(Ks);const g_=new q({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),ia=Array.from({length:72},()=>{const i=new G(new Xt(.1,8,5),g_);return i.visible=!1,st.add(i),{mesh:i,life:0,velocity:new L}});let di=null;function gd(){if(di)return;const i=new AudioContext,e=i.createOscillator(),t=i.createGain(),n=i.createBiquadFilter();e.type="sawtooth",n.type="lowpass",n.frequency.value=540,e.frequency.value=70,t.gain.value=1e-4,e.connect(n).connect(t).connect(i.destination),e.start(),di={ctx:i,engine:e,engineGain:t,filter:n,nextNote:0,beat:0}}function da(){di||gd(),di?.ctx.state==="suspended"&&di.ctx.resume().catch(()=>{})}function oh(i){if(!di)return;const{ctx:e}=di,t=e.createOscillator(),n=e.createGain();t.type="sine",t.frequency.value=55+i*2.6,n.gain.setValueAtTime(Math.min(.34,i/55),e.currentTime),n.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(n).connect(e.destination),t.start(),t.stop(e.currentTime+.24)}function ch(i,e=18){const t=Math.min(e,ia.length);for(let n=0;n<t;n++){const s=ia.find(r=>r.life<=0)||ia[n];s.mesh.visible=!0,s.mesh.position.copy(i),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function __(i){for(const e of ia){if(e.life<=0)continue;e.life-=i,e.velocity.y-=26*i,e.mesh.position.addScaledVector(e.velocity,i);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}}function v_(i){if(!di)return;const{ctx:e,engine:t,engineGain:n,filter:s}=di;t.frequency.setTargetAtTime(62+g.speed*2.9+(vt.has("ShiftLeft")||vt.has("ShiftRight")?60:0),e.currentTime,.04),s.frequency.setTargetAtTime(480+g.speed*9,e.currentTime,.08);const r=g.mode==="race"||g.mode==="roam";n.gain.setTargetAtTime(r?.036+Math.abs(g.speed)/4200:1e-4,e.currentTime,.08)}function Sa(i=!1,e=!1){gd(),vt.clear(),ua();const t=i||e;Object.assign(g,{mode:"race",practice:t,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:t?-900:-28,rivalDistance:t?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":i?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:t?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const n=bt(g.s);g.y=n.p.y+2.1,g.yVel=0,et.menu.classList.add("hidden"),et.result.classList.add("hidden"),et.resultStats.innerHTML="",et.position.textContent=e?"FREE RUN":i?"PRACTICE":"DIV 4",et.trackName.textContent=ce.name,yn.visible=!1,fi&&(fi.visible=!0),document.body.classList.remove("roam-mode"),window.__freeCam=!1}function _d(){da(),g.mode="roam",g.practice=!0,g.freeRun=!1,vt.clear(),ua();let i=80,e=338;An(i,e,6).clearance<6&&(i=80,e=320),g.roamPos.set(i,We(i,e),e),g.roamYaw=0,g.camYaw=g.roamYaw,g.camLookYaw=0,g.camLookPitch=0,g.cameraZoom=0,Fe.zoom=0,g.wheelSteer=0,g.speed=0,g.boost=1,g.damage=0,g.cameraShake=0,g.message="",g.messageTimer=0,bs.visible=!1,yn.visible=!0,fi&&(fi.visible=!1),document.body.classList.add("roam-mode"),window.__freeCam=!1,et.menu.classList.add("hidden"),et.result.classList.add("hidden"),et.position.textContent="FREE ROAM",et.trackName.textContent="City Streets",ya();const t=Math.sin(g.roamYaw),n=-Math.cos(g.roamYaw);dt.position.set(g.roamPos.x-t*18,g.roamPos.y+8.5,g.roamPos.z-n*18),yd(),dt.lookAt(g.roamPos.x+t*12,g.roamPos.y+2.6,g.roamPos.z+n*12),dt.fov=70,dt.updateProjectionMatrix()}function ya(){yn.position.set(g.roamPos.x,g.roamPos.y+.3,g.roamPos.z),yn.quaternion.setFromAxisAngle(sn,-g.roamYaw)}function M_(i,e){let t=null;for(const s of Ma)for(const r of s.segments){const a=i-r.a.x,o=e-r.a.z,c=Xe.clamp((a*r.abx+o*r.abz)/r.lenSq,0,1),l=r.a.x+r.abx*c,d=r.a.z+r.abz*c,u=Math.hypot(i-l,e-d);if(u>s.halfW+zn*1.15)continue;const f=Xe.lerp(r.a.y,r.b.y,c),p=Xe.lerp(r.u0,r.u1,c),x=u+Math.max(0,We(i,e)-f)*.2;(!t||x<t.score)&&(t={kind:"ramp",y:f,u:p,ramp:s,mergeS:s.mergeS,dirSel:s.dirSel,tangentX:r.abx,tangentZ:r.abz,lateral:s.dirSel*ce.width*.34,score:x})}if(!t)return null;const n=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=n,t.tangentZ/=n,t}function S_(i,e,t=We(i,e)){let n=null;const s=10;for(let a=0;a<ce.length;a+=s){if(Ai(a+s*.5))continue;const o=bt(a),c=bt(a+s),l=c.p.x-o.p.x,d=c.p.z-o.p.z,u=Math.max(1e-4,l*l+d*d),f=Xe.clamp(((i-o.p.x)*l+(e-o.p.z)*d)/u,0,1),p=o.p.x+l*f,x=o.p.z+d*f,_=i-p,m=e-x,h=Math.hypot(_,m);if(h>ce.width*.5+zn*.45)continue;const v=Xe.lerp(o.p.y,c.p.y,f)+.58;if(t<v-5)continue;const S=new L(d,0,-l).normalize(),y=Xe.clamp(_*S.x+m*S.z,-ce.width*.44,ce.width*.44);(!n||h<n.dist)&&(n={kind:"track",y:v,s:a+s*f,lateral:y,tangentX:l,tangentZ:d,dist:h})}if(!n)return null;const r=Math.max(1e-4,Math.hypot(n.tangentX,n.tangentZ));return n.tangentX/=r,n.tangentZ/=r,n}function Yi(i,e,t=g.roamPos.y){const n=We(i,e);let s={kind:"ground",y:n};const r=M_(i,e);r&&r.y>=n-1.2&&(s=r);const a=S_(i,e,Math.max(t,s.y));return a&&a.y>=s.y-.8&&(s=a),s}function lh(i){const e=Math.sin(g.roamYaw)*i.tangentX+-Math.cos(g.roamYaw)*i.tangentZ;if(g.speed<10||e<.22)return!1;const t=(i.mergeS??i.s??22)+8,n=bt(t);return g.mode="race",g.practice=!0,g.freeRun=!0,g.breakdownTimer=0,g.s=n.s,g.totalDistance=n.s,g.lastSafeS=n.s,g.lastSafeDistance=n.s,g.lateral=Xe.clamp(i.lateral??0,-ce.width*.32,ce.width*.32),g.lateralVel=-Math.sign(g.lateral)*Math.min(4,Math.abs(g.speed)*.04),g.speed=Xe.clamp(Math.max(28,g.speed),18,112),g.grounded=!0,g.y=n.p.y+2.1,g.yVel=0,g.airtime=0,g.rivalS=-900,g.rivalDistance=-900,g.leadState="SOLO",g.message="Merged onto the ribbon",g.messageTimer=1.6,g.cameraShake=Math.max(g.cameraShake,.35),bs.visible=!1,yn.visible=!1,fi&&(fi.visible=!0),document.body.classList.remove("roam-mode"),et.position.textContent="FREE RUN",et.trackName.textContent=ce.name,ya(),!0}function vd(i){const e=Math.max(vt.has("KeyW")||vt.has("ArrowUp")?1:0,Fe.throttle),t=Math.max(vt.has("KeyS")||vt.has("ArrowDown")?1:0,Fe.brake),s=Xe.clamp((vt.has("KeyD")||vt.has("ArrowRight")?1:0)-(vt.has("KeyA")||vt.has("ArrowLeft")?1:0)+Fe.steer,-1,1)*cd,r=(vt.has("ShiftLeft")||vt.has("ShiftRight"))&&g.boost>.02&&e>.03;if(e>.03){const m=g.speed<0?38:0;g.speed+=((r?52:30)+m)*e*i}t>.03&&(g.speed-=(g.speed>1.2?64:30)*t*i),g.speed-=.0026*g.speed*Math.abs(g.speed)*i,Math.abs(g.speed)>.08?g.speed-=Math.sign(g.speed)*4.2*i:e<=.03&&t<=.03&&(g.speed=0),g.speed=Xe.clamp(g.speed,-22,120),g.boosting=r,r?g.boost=Math.max(0,g.boost-i*.22):g.boost=Math.min(1,g.boost+i*.05),g.wheelSteer+=(s-g.wheelSteer)*(1-Math.pow(1e-5,i));const a=-g.wheelSteer*.55,o=yn.userData.frontWheels;o&&(o[0].rotation.y=a,o[1].rotation.y=a);const c=Math.abs(g.speed);if(c>sc){const m=Xe.clamp((c-sc)/5,0,1),h=1-.45*Xe.clamp((c-28)/70,0,1),v=Bg*m*h;g.roamYaw+=g.wheelSteer*v*i*Math.sign(g.speed)}const l=Math.sin(g.roamYaw),d=-Math.cos(g.roamYaw),u=Math.abs(g.speed)*i,f=Math.max(1,Math.ceil(u/1.2));let p=!1,x=!1,_=Yi(g.roamPos.x,g.roamPos.z,g.roamPos.y);for(let m=0;m<f;m++)g.roamPos.x+=l*g.speed*i/f,g.roamPos.z+=d*g.speed*i/f,_=Yi(g.roamPos.x,g.roamPos.z,g.roamPos.y),g.roamPos.y=_.y+hi,T_(g.roamPos,_)&&(x=!0),E_(g.roamPos,_)&&(p=!0),_=Yi(g.roamPos.x,g.roamPos.z,g.roamPos.y),g.roamPos.y=_.y+hi;g.roamPos.x=Xe.clamp(g.roamPos.x,-820,820),g.roamPos.z=Xe.clamp(g.roamPos.z,-1620,480),p&&(g.speed*=.35),x&&(g.speed*=.62,g.cameraShake=Math.max(g.cameraShake,.22),g.message="SPLAT!",g.messageTimer=.9),_=Yi(g.roamPos.x,g.roamPos.z,g.roamPos.y),g.roamPos.y=_.y+hi,!(_.kind==="ramp"&&_.u>.72&&lh(_))&&(_.kind==="track"&&lh(_)||(ya(),vt.has("KeyR")&&(_d(),vt.delete("KeyR"))))}const zn=2.6;function co(i,e){let t=!1;for(let n=0;n<e.length;n++){const s=e[n];if(s.maxY!=null&&i.y>s.maxY+hi+.45)continue;if(s.radius){const u=s.radius+zn,f=i.x-s.x,p=i.z-s.z,x=f*f+p*p;if(x>=u*u)continue;t=!0;const _=Math.max(1e-4,Math.sqrt(x));i.x=s.x+f/_*u,i.z=s.z+p/_*u;continue}const r=s.hw+zn,a=s.hd+zn,o=i.x-s.x,c=i.z-s.z;if(Math.abs(o)>=r||Math.abs(c)>=a)continue;t=!0;const l=r-Math.abs(o),d=a-Math.abs(c);l<d?i.x=s.x+(o<0?-r:r):i.z=s.z+(c<0?-a:a)}return t}function Md(i,e=g.roamPos){if(!i)return;const t=(i.crashTimer||0)<=.05;i.crashTimer=Math.max(i.crashTimer||0,1.15+Math.random()*.45),i.waitTimer=Math.max(i.waitTimer||0,.55),i.brakePulse=1;const n=i.maxAvoidOffset||ai.streetW*.3,s=i.mesh?.position?.x??i.collider?.x??i.road,r=i.mesh?.position?.z??i.collider?.z??i.along,a=i.axis==="ns"?e.x-s>=0?-1:1:e.z-r>=0?-1:1;i.avoidOffset=Xe.clamp((i.avoidOffset||0)+a*n*.9,-n,n),t&&(qe.trafficCrashes++,i.along-=i.dir*1.8,i.mesh&&(i.mesh.rotation.y+=a*.08),g.mode==="roam"&&(g.cameraShake=Math.max(g.cameraShake,.32),g.message="TRAFFIC CRASH",g.messageTimer=.85))}function y_(i){let e=!1;for(let t=0;t<Ti.length;t++){const n=Ti[t];if(n.maxY!=null&&i.y>n.maxY+hi+.45)continue;const s=n.hw+zn,r=n.hd+zn,a=i.x-n.x,o=i.z-n.z;if(Math.abs(a)>=s||Math.abs(o)>=r)continue;e=!0,Md(n.actor,i);const c=s-Math.abs(a),l=r-Math.abs(o);c<l?i.x=n.x+(a<0?-s:s):i.z=n.z+(o<0?-r:r)}return e}function b_(i,e,t=0){return e.maxY!=null&&i.y>e.maxY+hi+.45?!1:e.radius?Math.hypot(i.x-e.x,i.z-e.z)<e.radius+t:Math.abs(i.x-e.x)<e.hw+t&&Math.abs(i.z-e.z)<e.hd+t}function w_(i){i.active=!1,i.respawn=4.5+Math.random()*1.5,i.mesh.visible=!1,qe.splats++;const e=ys.find(t=>!t.visible)||ys[qe.splats%Math.max(1,ys.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(i.x,We(i.x,i.z)+.08,i.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function T_(i,e=null){if(e?.kind!=="ground"||Math.abs(g.speed)<5)return!1;let t=!1;for(const n of pr){if(!n.active)continue;const s=i.x-n.x,r=i.z-n.z,a=zn+n.hitRadius;s*s+r*r>a*a||Math.abs(i.y-(We(n.x,n.z)+hi))>3.2||(w_(n),t=!0)}return t}function E_(i,e=null){let t=!1;for(let n=0;n<2;n++){const s=co(i,gn),r=e?.kind==="ground"?co(i,Wn):!1,a=co(i,$i),o=e?.kind==="ground"?y_(i):!1;if(!s&&!r&&!a&&!o)break;t=!0}return t}function Sd(i){const e=Fe.lookX*1.18,t=Fe.lookY*.58;g.camLookYaw+=(e-g.camLookYaw)*(1-Math.pow(.002,i)),g.camLookPitch+=(t-g.camLookPitch)*(1-Math.pow(.002,i)),g.cameraZoom+=(Fe.zoom-g.cameraZoom)*(1-Math.pow(.018,i))}function Bc(i,e,t=3.2){let n=0;for(let s=1;s<=10;s++){const r=s/10,a=Xe.lerp(i.x,e.x,r),o=Xe.lerp(i.z,e.z,r),c=Xe.lerp(i.y,e.y,r),l=We(a,o)+t;l>c&&(n=Math.max(n,(l-c)/Math.max(.08,r)))}return n}function yd(){const i=g.camYaw+g.camLookYaw,e=Math.sin(i),t=-Math.cos(i),n=Xe.clamp(g.cameraZoom,-.42,.9),s=g.roamPos,r={x:s.x+e*(12-Math.min(n,0)*6),y:s.y+2.6+g.camLookPitch*13.5,z:s.z+t*(12-Math.min(n,0)*6)};dt.position.y+=Bc(r,dt.position,3.4)}function bd(i){if(window.__freeCam)return;if(Sd(i),Math.abs(g.speed)>sc){let u=g.roamYaw-g.camYaw;u=Math.atan2(Math.sin(u),Math.cos(u)),g.camYaw+=u*(1-Math.pow(.08,i))}const e=g.camYaw+g.camLookYaw,t=Math.sin(e),n=-Math.cos(e),s=g.roamPos,r=Xe.clamp(g.cameraZoom,-.42,.9),a=(18+Math.abs(g.speed)*.08)*(1+r*.72),o=8.5+Math.max(0,r)*4.4-Math.min(0,r)*2+g.camLookPitch*5.8,c=od.set(s.x-t*a,s.y+o,s.z-n*a),l=Uc.set(s.x+t*(12-Math.min(r,0)*6),s.y+2.6+g.camLookPitch*13.5,s.z+n*(12-Math.min(r,0)*6));c.y=Math.max(c.y,We(c.x,c.z)+3.5),c.y+=Bc(l,c,3.4),dt.position.lerp(c,1-Math.pow(.0023,i)),Dn.position.copy(dt.position),Dn.lookAt(l),Dn.rotateY(Math.PI),dt.quaternion.slerp(Dn.quaternion,1-Math.pow(.05,i));const d=70+Math.min(8,Math.abs(g.speed)*.05)+r*10;Math.abs(dt.fov-d)>.02&&(dt.fov+=(d-dt.fov)*(1-Math.pow(.01,i)),dt.updateProjectionMatrix())}function wd(i){if(g.mode==="result")return;g.mode="result";const e=Math.max(0,Math.round(g.score-g.damage*9+Math.max(0,220-g.time)*45));e>g.best&&(g.best=e,localStorage.setItem("steel-ribbon-best",String(e))),et.best.textContent=`Best score ${g.best}`,et.resultText.textContent=`${i} Score ${e}. Time ${oc(g.time)}. Damage ${Math.round(g.damage)}%.`;const t=Number.isFinite(g.bestLap)?oc(g.bestLap):"--:--.-";et.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${t}</b>
    <b>Clean landings: ${g.cleanLandings}</b>
    <b>Hard landings: ${g.hardLandings}</b>
    <b>Recoveries: ${g.recoveries}</b>
    <b>Near edges: ${Math.round(g.nearMisses)}</b>
  `,et.result.classList.remove("hidden")}function hh(i="Craned back to the ribbon"){const e=bt(g.lastSafeS);g.s=g.lastSafeS,g.totalDistance=g.lastSafeDistance,g.lateral=0,g.lateralVel=0,g.y=e.p.y+2.1,g.yVel=0,g.speed=Math.max(16,g.speed*.32),g.grounded=!0,g.cameraShake=1.2,g.message=i,g.messageTimer=1.4,g.recoveries+=1}function zc(i,e){return Xe.clamp(e*i.tangent.y,-48,48)}function A_(i=94){return ce.gaps.map(e=>{const t=bt(e.start),n=bt(e.end+3),s=(e.end-e.start)/Math.max(1,i),r=zc(t,i),a=t.p.y+2.1+r*s-.5*31*s*s,o=n.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(Xe.radToDeg(t.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function dh(i,e){g.grounded=!1,g.yVel=zc(i,g.speed),g.airtime=0,e&&(g.message=e)}window.__steelRibbonDebug={launchVelocityAt(i,e){return zc(bt(i),e)},gapJumpReport(i){return A_(i)},sceneryClearanceReport(){return Jg()},setSpeed(i){return g.speed=Xe.clamp(i,-14,156-g.damage*.42),nr(),g.speed},setTrackPosition(i,e=g.speed){const t=bt(i);return g.totalDistance=i,g.s=t.s,g.lastSafeS=t.s,g.lastSafeDistance=i,g.lateral=0,g.lateralVel=0,g.y=t.p.y+2.1,g.yVel=0,g.grounded=!0,g.speed=Xe.clamp(e,-14,156-g.damage*.42),nr(),{s:g.s,totalDistance:g.totalDistance,speed:g.speed,y:g.y}},setDamage(i){return g.damage=Xe.clamp(i,0,99),nr(),g.damage},setCourse(i){return Oc(i)},flyCam(i,e,t,n,s,r){return window.__freeCam=!0,dt.position.set(i,e,t),dt.lookAt(n,s,r),dt.fov=62,dt.updateProjectionMatrix(),"freecam"},listCourses(){return ji.map((i,e)=>({index:e,name:i.name,length:i.length,width:i.width,laps:i.laps,gaps:i.gaps.length}))},courseInfo(){return{index:ta,name:ce.name,length:ce.length,width:ce.width,laps:ce.laps}},probeDown(i,e){const n=new kf(new L(i,400,e),new L(0,-1,0),0,1e3).intersectObjects(st.children,!0).map(r=>({y:+r.point.y.toFixed(2),name:r.object.material?.color?"#"+r.object.material.color.getHexString():"?"})),s=Yi(i,e,400);return{x:i,z:e,ground:+We(i,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:n.slice(0,5)}},rampSurfaceReport(){return Ma.map((i,e)=>{const t=i.points[0],n=i.points[i.points.length-1],s=i.points[i.points.length/2|0],r=i.segments[0],a=i.segments[i.segments.length-1],o=Math.atan2(r.abx,-r.abz);return{index:e,mergeS:i.mergeS,halfW:i.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2)},climb:+(n.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(a.abx,-a.abz).toFixed(4)}})},colliderSample(i=8){return gn.slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(i=8){return Wn.filter(e=>e.hw).slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const i=Wn.filter(e=>e.hw);return{supports:rc,pylonColliders:i.length,gaps:ce.gaps.length,sample:i.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(i=12){const e=[];for(const t of gn){const n=ki(t.x,t.z,t.hw*2,t.hd*2,t.maxY);n&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:n.courseIndex,s:+n.s.toFixed(1),trackY:+n.trackY.toFixed(1),horizontalClearance:+n.horizontalClearance.toFixed(1),verticalIntrusion:+n.verticalIntrusion.toFixed(1)})}return e.sort((t,n)=>n.verticalIntrusion-t.verticalIntrusion),{totalBuildings:gn.length,conflicts:e.length,sample:e.slice(0,i)}},buildingStreetConflictReport(i=12){const e=[];for(const t of gn){const n=zi(t.x,t.z,t.hw*2,t.hd*2,0);n&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:n.axis,road:n.road,overlap:+n.overlap.toFixed(1)})}return e.sort((t,n)=>n.overlap-t.overlap),{totalBuildings:gn.length,conflicts:e.length,sample:e.slice(0,i)}},rockColliderSample(i=8){return $i.concat(Wn.filter(e=>e.kind==="rock")).slice(0,i).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(i=8){return{traffic:qe.traffic,pedestrians:qe.pedestrians,pedestriansActive:pr.filter(e=>e.active).length,turns:qe.turns,splats:qe.splats,trafficCrashes:qe.trafficCrashes,streetLights:qe.streetLights,trafficLights:qe.trafficLights,stopSigns:qe.stopSigns,signs:qe.signs,roadDetails:{...qe.roadDetails},buildingArchetypes:{...qe.buildingArchetypes},zones:{...qe.zones},openerProps:qe.openerProps,signSamples:ha.slice(0,i),types:{...qe.types},offRoadTraffic:Ti.filter(e=>!va(e.x,e.z,2)).length,trafficRoutes:ac.slice(0,i).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:Ti.slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:pr.filter(e=>e.active).slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const i={...qe.roadDetails},e={...qe.buildingArchetypes},t={...qe.zones},n=Object.values(e).filter(a=>a>0).length,s=Object.values(t).filter(a=>a>0).length;return{score:+(Math.min(25,(i.crosswalks||0)/8)+Math.min(18,(i.laneArrows||0)/3)+Math.min(14,(i.manholes||0)/4)+Math.min(16,qe.signs/7)+Math.min(14,qe.openerProps*1.4)+Math.min(13,n*2.6)).toFixed(1),roadDetails:i,buildingArchetypes:e,zones:t,archetypeKinds:n,zoneKinds:s,openerProps:qe.openerProps,signs:qe.signs,streetLights:qe.streetLights}},vehicleDetailReport(){return{player:{...yn.userData.detailReport},racer:{...bs.userData.detailReport},namedParts:yn.children.filter(i=>i.name).map(i=>i.name).slice(0,24)}},advanceCityLife(i=1){const e=.03333333333333333;let t=Math.max(0,Math.min(i,60));for(;t>0;){const n=Math.min(e,t);fd(n),t-=n}return this.cityLifeReport(12)},setRoamPose(i,e,t){const n=Yi(i,e,g.roamPos.y);g.roamPos.set(i,n.y+hi,e),g.roamYaw=t,g.camYaw=t,g.camLookYaw=0,g.camLookPitch=0,g.wheelSteer=0,g.speed=0,ya();const s=Math.sin(g.roamYaw),r=-Math.cos(g.roamYaw);return dt.position.set(g.roamPos.x-s*18,g.roamPos.y+8.5,g.roamPos.z-r*18),yd(),dt.lookAt(g.roamPos.x+s*12,g.roamPos.y+2.6,g.roamPos.z+r*12),dt.fov=70,dt.updateProjectionMatrix(),this.roamReport()},setTouchCamera(i=0,e=0,t=Fe.zoom,n=30){Fe.lookX=Xe.clamp(i,-1,1),Fe.lookY=Xe.clamp(e,-1,1),Fe.zoom=Xe.clamp(t,-.42,.9);for(let s=0;s<n;s++)g.mode==="roam"?bd(1/60):kc(1/60);return this.roamReport()},simulateRoamDrive(i=1,e=0,t=0,n=0){if(g.mode!=="roam")return this.roamReport();const s={steer:Fe.steer,throttle:Fe.throttle,brake:Fe.brake};Fe.steer=Xe.clamp(e,-1,1),Fe.throttle=Xe.clamp(t,0,1),Fe.brake=Xe.clamp(n,0,1);const r=1/60;let a=Math.max(0,Math.min(i,8));for(;a>0;){const o=Math.min(r,a);if(vd(o),g.mode!=="roam")break;a-=o}return Fe.steer=s.steer,Fe.throttle=s.throttle,Fe.brake=s.brake,this.roamReport()},roamReport(){const i=g.roamPos,e=od.set(0,0,-1).applyQuaternion(yn.quaternion).normalize(),t=Uc.set(Math.sin(g.roamYaw),0,-Math.cos(g.roamYaw)).normalize(),n=Yi(i.x,i.z,i.y);return{mode:g.mode,s:+g.s.toFixed(2),totalDistance:+g.totalDistance.toFixed(2),x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2),yaw:+g.roamYaw.toFixed(3),camYaw:+g.camYaw.toFixed(3),speed:+g.speed.toFixed(2),groundXZ:+We(i.x,i.z).toFixed(2),surface:n.kind,surfaceY:+n.y.toFixed(2),camX:+dt.position.x.toFixed(2),camY:+dt.position.y.toFixed(2),camZ:+dt.position.z.toFixed(2),fov:+dt.fov.toFixed(2),lookYaw:+g.camLookYaw.toFixed(3),lookPitch:+g.camLookPitch.toFixed(3),cameraZoom:+g.cameraZoom.toFixed(3),cameraSightLift:+Bc({x:i.x,y:i.y+2.6,z:i.z},{x:dt.position.x,y:dt.position.y,z:dt.position.z},2.4).toFixed(3),colliders:gn.length+Wn.length+$i.length+Ti.length,insideBuilding:gn.concat(Wn,$i,Ti).some(s=>b_(i,s)),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:yn.userData.frontWheels?+yn.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function C_(i){if(g.mode!=="race")return;g.time+=i,g.freeRun&&(g.damage=0);const e=g.breakdownTimer>0;e&&(g.breakdownTimer-=i,g.breakdownTimer<=0&&(g.damage=55,g.message="Patched up — back on it",g.messageTimer=1.2));const t=Math.max(vt.has("KeyW")||vt.has("ArrowUp")?1:0,Fe.throttle),n=Math.max(vt.has("KeyS")||vt.has("ArrowDown")?1:0,Fe.brake),r=Xe.clamp((vt.has("KeyD")||vt.has("ArrowRight")?1:0)-(vt.has("KeyA")||vt.has("ArrowLeft")?1:0)+Fe.steer,-1,1)*cd,a=t>.03&&!e,o=(vt.has("ShiftLeft")||vt.has("ShiftRight"))&&g.boost>.02&&a&&g.grounded,c=bt(g.s),l=c.p.y+2.1,d=Math.abs(g.speed);if(a){const v=g.speed<0?40:0;g.speed+=((o?68:40)+v)*t*i}if(n>.03){const v=g.speed>1.2?70:26;g.speed-=v*n*i}const u=g.grounded?.0024:.0011;g.speed-=u*g.speed*d*i,d>.08?g.speed-=Math.sign(g.speed)*(g.grounded?2.2:.3)*i:t<=.03&&n<=.03&&(g.speed=0),g.speed=Xe.clamp(g.speed,-16,156-g.damage*.8),e&&(g.speed=Math.min(g.speed,14)),g.boosting=o,o?(g.boost=Math.max(0,g.boost-i*.21),g.score+=28*i):g.boost=Math.min(1,g.boost+i*(g.grounded?.045:.018));const f=14+d*.12;g.lateralVel-=r*f*i,g.lateralVel-=g.lateralVel*(g.grounded?3.4:.7)*i,g.lateral+=g.lateralVel*i;const p=Ai(g.s),x=Math.abs(g.lateral)<ce.width*.52,_=!p&&x;if(g.grounded&&(!_||Math.abs(g.lateral)>ce.width*.5)&&dh(c,x?"":"Edge slip"),g.grounded){const v=Math.sin(g.time*18)*Math.min(.22,Math.abs(g.speed)/700);g.y=Xe.lerp(g.y,l+v,.5),g.yVel=0,g.lastSafeS=g.s,g.lastSafeDistance=g.totalDistance,g.score+=Math.max(0,g.speed)*i*.34,Math.abs(g.lateral)>ce.width*.42&&(g.damage+=i*(1.2+Math.abs(g.speed)*.035),g.cameraShake=Math.max(g.cameraShake,.24),g.nearMisses+=i*.8,Math.random()<i*5&&ch(c.p.clone().addScaledVector(c.side,Math.sign(g.lateral)*ce.width*.55).addScaledVector(sn,1.2),4))}else{g.yVel-=31*i,g.y+=g.yVel*i,g.airtime+=i,g.score+=i*11;const v=bt(g.s),S=v.p.y+2.1;if(!Ai(g.s)&&Math.abs(g.lateral)<ce.width*.55&&g.y<=S&&g.yVel<0){const E=-g.yVel,T=Math.abs(g.lateral)<ce.width*.34&&E<30;g.y=S,g.grounded=!0,g.yVel=0,g.lastSafeS=g.s,g.lastSafeDistance=g.totalDistance,g.damage+=Math.max(0,E-17)*.82+Math.max(0,Math.abs(g.lateral)-ce.width*.36)*1.8,g.score+=T?260+g.airtime*85:Math.max(30,120-E),g.cameraShake=Math.max(g.cameraShake,E/34),g.message=T?"Clean landing":"Hard landing",g.messageTimer=.9,T?g.cleanLandings+=1:g.hardLandings+=1,oh(E),ch(v.p.clone().addScaledVector(v.side,g.lateral).addScaledVector(sn,.7),T?7:24),g.airtime=0}g.y<-55&&(g.damage+=28,hh("Track crew recovery"))}const m=g.totalDistance;g.totalDistance+=g.speed*i,g.s=(g.totalDistance%ce.length+ce.length)%ce.length;const h=Math.floor(g.totalDistance/ce.length)+1;if(h>g.lap){const v=g.time-g.lapStartTime;g.splitTimes.push(v),g.bestLap=Math.min(g.bestLap,v),g.lapStartTime=g.time,g.lap=h,g.score+=1200,g.message=g.practice?`Lap ${g.lap}`:g.lap<=ce.laps?`Lap ${g.lap}`:"Season race complete",g.messageTimer=1.4,!g.practice&&g.lap>ce.laps&&wd(g.totalDistance>=g.rivalDistance?"You took the chequered gantry.":"You finished behind Crowther.")}for(const v of ce.gaps)Vg(m,g.totalDistance,v.start)&&(g.message=v.name,g.messageTimer=1.1,g.grounded&&dh(bt(v.start),v.name));g.damage=Xe.clamp(g.damage,0,100),!g.freeRun&&g.damage>=90&&g.breakdownTimer<=0&&(g.breakdownTimer=2.6,g.message="Chassis cracked — limping to repair",g.messageTimer=1.6,g.cameraShake=Math.max(g.cameraShake,.8),oh(40),g.damage=90),vt.has("KeyR")&&(g.damage=Math.min(99,g.damage+8),hh("Manual reset"),vt.delete("KeyR"))}function R_(i){if(g.mode==="race"&&!g.practice){const r=g.totalDistance-g.rivalDistance,a=Xe.clamp(r*.06,-12,16),o=Math.sin(g.time*.6)*5;g.rivalSpeed=Xe.clamp(92+a+o,70,120),g.rivalDistance+=g.rivalSpeed*i,g.rivalDistance>=ce.length*ce.laps&&g.lap<=ce.laps&&wd("Crowther reached the gantry first.")}g.rivalS=(g.rivalDistance%ce.length+ce.length)%ce.length;const e=bt(g.rivalS),t=e.p.clone().addScaledVector(sn,1.4).addScaledVector(e.side,Math.sin(g.rivalS*.02)*1.4);bs.position.copy(t);const n=new Dt().makeBasis(e.side,sn,e.tangent);bs.quaternion.setFromRotationMatrix(n);const s=Math.abs(g.rivalDistance-g.totalDistance)<26;bs.visible=(g.mode==="race"||g.mode==="paused")&&!g.practice&&!s}function kc(i){if(window.__freeCam)return;Sd(i);const e=bt(g.s),t=e.side.clone().multiplyScalar(g.lateral),n=e.p.clone().add(t);n.y=g.y;const s=g.cameraShake;s>.01&&(n.x+=(Math.random()-.5)*s*.8,n.y+=(Math.random()-.5)*s*.45),dt.position.copy(n);const r=Math.abs(g.speed),a=68+Math.min(10,r*.055)+(vt.has("ShiftLeft")||vt.has("ShiftRight")?3:0)+g.cameraZoom*12;Math.abs(dt.fov-a)>.02&&(dt.fov+=(a-dt.fov)*(1-Math.pow(.004,i)),dt.updateProjectionMatrix());const o=bt(g.s+34+g.speed*.16),c=o.p.clone().addScaledVector(o.side,g.lateral*.45);c.y+=1.7+g.camLookPitch*12+Math.sin(g.time*8)*Math.min(.2,r/680),Dn.position.copy(dt.position),Dn.lookAt(c),Dn.rotateY(Math.PI),Dn.rotateY(-g.camLookYaw),Dn.rotateZ(-e.bank*.72-g.lateralVel*.006),Dn.rotateX(e.grade*.18+(g.grounded?0:Xe.clamp(g.yVel,-30,30)*-.006)),dt.quaternion.slerp(Dn.quaternion,1-Math.pow(8e-4,i)),g.cameraShake=Math.max(0,g.cameraShake-i*1.9);const l=Uc.set(0,0,-1).applyQuaternion(dt.quaternion).normalize();window.__steelRibbonTelemetry={mode:g.mode,s:g.s,totalDistance:g.totalDistance,rivalDistance:g.rivalDistance,speed:g.speed,lap:g.lap,score:g.score,damage:g.damage,y:g.y,yVel:g.yVel,grounded:g.grounded,input:{steer:Fe.steer,throttle:Fe.throttle,brake:Fe.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:l.x,y:l.y,z:l.z}}}const qi={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},Ys=[28,54,82,110,134,156];function P_(){const i=Math.abs(g.speed);let e=1;for(let o=0;o<Ys.length;o++)i>Ys[o]&&(e=o+2);e=Math.min(e,Ys.length);const t=e===1?0:Ys[e-2],n=Ys[e-1],s=n>t?Xe.clamp((i-t)/(n-t),0,1):0,r=e===1?qi.idle:qi.postShift;let a=r+s*(qi.shift-r);return i<.4&&(a=qi.idle),{gear:e,rpm:a}}let uh=performance.now(),lo=0,ho=0;function Td(i){const e=i.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),n=i.clientWidth||120,s=i.clientHeight||70;(i.width!==Math.round(n*t)||i.height!==Math.round(s*t))&&(i.width=Math.round(n*t),i.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,n,s);const r=n/2,a=s-s*.14,o=Math.min(n*.46,s*.9);return{ctx:e,w:n,h:s,cx:r,cy:a,R:o,aFor:d=>Math.PI-d*Math.PI,at:(d,u)=>[r+Math.cos(d)*u,a-Math.sin(d)*u]}}function L_(i,e){const t=et.speedo;if(!t)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=Td(t),l=360;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke(),n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let x=0;x<=l;x+=20){const _=x/l,m=o(_),h=x%80===0;n.strokeStyle="rgba(180, 230, 255, 0.85)",n.lineWidth=h?Math.max(1.4,a*.035):Math.max(1,a*.02);const v=c(m,a-a*.02),S=c(m,a-a*(h?.18:.1));if(n.beginPath(),n.moveTo(v[0],v[1]),n.lineTo(S[0],S[1]),n.stroke(),h){const y=c(m,a-a*.34);n.fillStyle="#cfeeff",n.fillText(String(x/10),y[0],y[1])}}const d=Xe.clamp(i/l,0,1),u=o(d),f=c(u,a-a*.06),p=c(u+Math.PI,a*.14);n.strokeStyle="#7df1ff",n.shadowColor="rgba(80, 220, 255, 0.9)",n.shadowBlur=a*.18,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(p[0],p[1]),n.lineTo(f[0],f[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("MPH",s,r-a*.26),n.fillStyle=e?"#ff8077":"#f2f8ff",n.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,n.fillText(e?`-${Math.round(i)}`:String(Math.round(i)),s,r+a*.02)}function D_(i,e){const t=et.boostGauge;if(!t)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=Td(t),l=18;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.3)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke();const d=Xe.clamp(i,0,1),u=i<.25;n.strokeStyle=u?"#ff5436":e?"#ffb53a":"#46e0b0",n.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",n.shadowBlur=e?a*.25:a*.1,n.lineWidth=Math.max(2,a*.07),n.beginPath(),n.arc(s,r,a,o(d),o(0)),n.stroke(),n.shadowBlur=0,n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let _=0;_<=l;_+=3){const m=_/l,h=o(m),v=_%6===0;n.strokeStyle=_>=l*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",n.lineWidth=v?Math.max(1.3,a*.03):Math.max(1,a*.018);const S=c(h,a-a*.02),y=c(h,a-a*(v?.17:.1));if(n.beginPath(),n.moveTo(S[0],S[1]),n.lineTo(y[0],y[1]),n.stroke(),v){const E=c(h,a-a*.33);n.fillStyle="#cfeeff",n.fillText(String(_),E[0],E[1])}}const f=o(d),p=c(f,a-a*.06),x=c(f+Math.PI,a*.14);n.strokeStyle=u?"#ff5436":"#ffd23f",n.shadowColor="rgba(255, 200, 60, 0.8)",n.shadowBlur=a*.16,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(x[0],x[1]),n.lineTo(p[0],p[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("BOOST psi",s,r-a*.26),e&&(n.fillStyle="#ffce4a",n.shadowColor="rgba(255, 190, 60, 0.95)",n.shadowBlur=a*.3,n.beginPath(),n.arc(s,r+a*.02,a*.07,0,Math.PI*2),n.fill(),n.shadowBlur=0)}function I_(i,e){const t=et.tach;if(!t)return;const n=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=t.clientWidth||160,a=t.clientHeight||70;(t.width!==Math.round(r*s)||t.height!==Math.round(a*s))&&(t.width=Math.round(r*s),t.height=Math.round(a*s)),n.setTransform(s,0,0,s,0,0),n.clearRect(0,0,r,a);const o=r/2,c=a-a*.14,l=Math.min(r*.46,a*.9),d=qi.max,u=S=>Math.PI-S*Math.PI,f=(S,y)=>[o+Math.cos(S)*y,c-Math.sin(S)*y];n.lineCap="round",n.lineWidth=Math.max(2,l*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(o,c,l,u(1),u(0)),n.stroke();const p=qi.redline/d;n.strokeStyle="#ff3b30",n.beginPath(),n.arc(o,c,l,u(1),u(p)),n.stroke(),n.font=`700 ${Math.max(7,l*.17)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let S=0;S<=9;S++){const y=S/9,E=u(y),T=S*1e3>=qi.redline;n.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",n.lineWidth=Math.max(1.4,l*.035);const P=f(E,l-l*.02),R=f(E,l-l*.18);n.beginPath(),n.moveTo(P[0],P[1]),n.lineTo(R[0],R[1]),n.stroke();const b=f(E,l-l*.34);if(n.fillStyle=T?"#ff8077":"#cfeeff",n.fillText(String(S),b[0],b[1]),S<9){const M=u((S+.5)/9),C=f(M,l-l*.02),D=f(M,l-l*.1);n.strokeStyle="rgba(150, 210, 255, 0.5)",n.lineWidth=Math.max(1,l*.02),n.beginPath(),n.moveTo(C[0],C[1]),n.lineTo(D[0],D[1]),n.stroke()}}const x=Xe.clamp(i/d,0,1),_=u(x),m=f(_,l-l*.06),h=f(_+Math.PI,l*.14);n.strokeStyle="#ffdd48",n.shadowColor="rgba(255, 200, 60, 0.9)",n.shadowBlur=l*.18,n.lineWidth=Math.max(1.8,l*.05),n.beginPath(),n.moveTo(h[0],h[1]),n.lineTo(m[0],m[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,l*.03),n.beginPath(),n.arc(o,c,l*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,l*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("x1000 r/min",o,c-l*.26);const v=g.speed<-.5?"R":String(e);n.fillStyle="#f2f8ff",n.font=`800 ${Math.max(9,l*.22)}px "Courier New", monospace`,n.fillText(v,o,c+l*.02)}function nr(){ce.length*ce.laps;const i=eh(g.practice?g.totalDistance%ce.length:g.totalDistance),e=g.practice?0:eh(g.rivalDistance),t=g.practice?"SOLO":g.totalDistance>=g.rivalDistance?"P1":"P2";t!==g.leadState&&g.mode==="race"&&(g.leadState=t,g.practice||(g.message=t==="P1"?"You took the lead":"Crowther ahead",g.messageTimer=.95)),et.damage.style.width=`${Math.round(g.damage)}%`,et.lap.textContent=g.practice?`LAP ${g.lap}`:`${Math.min(g.lap,ce.laps)}/${ce.laps}`,et.timer.textContent=oc(g.time),et.score.textContent=`Score ${Math.round(g.score)}`;const n=g.mode==="roam",s=g.mode==="race"||g.mode==="paused"||n;et.position.textContent=n?"FREE ROAM":g.freeRun?"FREE RUN":g.practice?"PRACTICE":`${t} DIV 4`,et.hud.style.display=s?"flex":"none",et.raceStrip.style.display=g.mode==="race"||g.mode==="paused"?"grid":"none",et.touchControls.style.display=s?"":"none",et.playerProgress.style.width=`${Math.round(i*100)}%`,et.rivalProgress.style.width=`${Math.round(e*100)}%`;const r=P_();g.gear=r.gear;const a=performance.now(),o=Math.min(.05,(a-uh)/1e3);uh=a;const c=1-Math.exp(-o*(r.rpm>g.tachRpm?10:6));g.tachRpm+=(r.rpm-g.tachRpm)*c,I_(g.tachRpm,r.gear);const l=Math.abs(g.speed)*2.25;lo+=(l-lo)*(1-Math.exp(-o*8)),ho+=(g.boost-ho)*(1-Math.exp(-o*9)),L_(lo,g.speed<-.5),D_(ho,g.boosting),et.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(g.speed)-44)/150)),et.damageFx.style.opacity=g.damage<18?0:Math.min(.72,(g.damage-18)/82),g.mode==="paused"?(et.centerMessage.textContent="Paused",et.centerMessage.classList.remove("hidden")):g.messageTimer>0?(et.centerMessage.textContent=g.message,et.centerMessage.classList.remove("hidden")):et.centerMessage.classList.add("hidden")}function oc(i){const e=Math.floor(i/60),t=i-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}function Ed(){const i=Og.getDelta(),e=Math.min(.033,i);g.messageTimer>0&&(g.messageTimer-=e),g.mode==="roam"?(vd(e),bd(e)):(C_(e),R_(e),kc(e)),__(e),fd(e),nr(),v_(),Ks.uniforms.uTime.value+=e,Ks.uniforms.uSpeed.value=Math.min(1,Math.abs(g.speed)/150);const t=(vt.has("ShiftLeft")||vt.has("ShiftRight"))&&g.boost>.02&&g.mode==="race";Ks.uniforms.uBoost.value+=((t?1:0)-Ks.uniforms.uBoost.value)*Math.min(1,e*6),Ns.render(),requestAnimationFrame(Ed)}window.addEventListener("keydown",i=>{vt.add(i.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(i.code)&&i.preventDefault(),i.code==="KeyP"&&g.mode==="race"?(g.mode="paused",vt.clear(),ua()):i.code==="KeyP"&&g.mode==="paused"?g.mode="race":i.code==="Escape"&&(g.mode==="race"||g.mode==="paused"||g.mode==="roam")&&(g.mode="menu",ua(),yn.visible=!1,fi&&(fi.visible=!0),document.body.classList.remove("roam-mode"),et.menu.classList.remove("hidden"))});window.addEventListener("keyup",i=>vt.delete(i.code));window.addEventListener("resize",()=>{dt.aspect=window.innerWidth/window.innerHeight,dt.updateProjectionMatrix(),Qt.setSize(window.innerWidth,window.innerHeight),Ns.setSize(window.innerWidth,window.innerHeight),xd.setSize(window.innerWidth,window.innerHeight)});et.startBtn.addEventListener("click",()=>Sa(!1));et.practiceBtn.addEventListener("click",()=>Sa(!0));et.freeRunBtn.addEventListener("click",()=>Sa(!0,!0));et.roamBtn.addEventListener("click",()=>_d());et.againBtn.addEventListener("click",()=>Sa(!1));et.courseButtons.forEach(i=>{i.addEventListener("click",()=>Oc(Number(i.dataset.course)))});function Ad(i){i&&(i.classList.remove("active"),i.style.setProperty("--stick-x","0px"),i.style.setProperty("--stick-y","0px"))}function ua(){Fe.steer=0,Fe.throttle=0,Fe.brake=0,Fe.lookX=0,Fe.lookY=0,Fe.zoom=0,Fe.lookPointer=null,Fe.drivePointer=null,Fe.pinchStartDistance=0,Fe.pinchStartZoom=0;for(const i of et.touchControls.querySelectorAll(".touch-stick"))Ad(i)}function Zr(i,e){const t=i.getBoundingClientRect(),n=Math.min(t.width,t.height)*.36;if(!(n>0))return;const s=Xe.clamp(e.clientX-(t.left+t.width/2),-n,n),r=Xe.clamp(e.clientY-(t.top+t.height/2),-n,n),a=i.dataset.stick;if(i.classList.add("active"),a==="look")Fe.lookX=Xe.clamp(s/n,-1,1),Fe.lookY=Xe.clamp(-r/n,-1,1),i.style.setProperty("--stick-x",`${Math.round(Fe.lookX*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-Fe.lookY*n)}px`);else{const o=Xe.clamp(s/n,-1,1),c=Xe.clamp(-r/n,-1,1);Fe.steer=o,Fe.throttle=Math.max(0,c),Fe.brake=Math.max(0,-c),i.style.setProperty("--stick-x",`${Math.round(o*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-c*n)}px`)}}function fh(i,e){return Array.from(i.changedTouches).find(t=>t.identifier===e)}function ph(i,e){e==="look"?(Fe.lookX=0,Fe.lookY=0,Fe.lookPointer=null):(Fe.steer=0,Fe.throttle=0,Fe.brake=0,Fe.drivePointer=null),Ad(i)}function U_(i,e){return Math.hypot(i.clientX-e.clientX,i.clientY-e.clientY)}function Cd(i,e=!1){if(i.touches.length<2){Fe.pinchStartDistance=0;return}const t=U_(i.touches[0],i.touches[1]);if(e||!(Fe.pinchStartDistance>0)){Fe.pinchStartDistance=t,Fe.pinchStartZoom=Fe.zoom;return}const n=Math.max(.2,t/Fe.pinchStartDistance);Fe.zoom=Xe.clamp(Fe.pinchStartZoom-Math.log(n)*1.15,-.42,.9)}for(const i of et.touchControls.querySelectorAll(".touch-stick")){const e=i.dataset.stick;i.addEventListener("pointerdown",s=>{s.preventDefault(),da(),g.mode==="paused"&&(g.mode="race"),e==="look"&&(Fe.lookPointer=s.pointerId),e==="drive"&&(Fe.drivePointer=s.pointerId),Zr(i,s)},{passive:!1}),i.addEventListener("pointermove",s=>{(e==="look"?Fe.lookPointer:Fe.drivePointer)===s.pointerId&&(s.preventDefault(),Zr(i,s))},{passive:!1});const t=s=>{(e==="look"?Fe.lookPointer:Fe.drivePointer)===s.pointerId&&ph(i,e)};i.addEventListener("pointerup",t),i.addEventListener("pointercancel",t),i.addEventListener("touchstart",s=>{s.preventDefault(),da(),g.mode==="paused"&&(g.mode="race");const r=s.changedTouches[0];r&&(e==="look"&&(Fe.lookPointer=r.identifier),e==="drive"&&(Fe.drivePointer=r.identifier),Zr(i,r))},{passive:!1}),i.addEventListener("touchmove",s=>{const r=e==="look"?Fe.lookPointer:Fe.drivePointer,a=fh(s,r);a&&(s.preventDefault(),Zr(i,a))},{passive:!1});const n=s=>{const r=e==="look"?Fe.lookPointer:Fe.drivePointer;fh(s,r)&&(s.preventDefault(),ph(i,e))};i.addEventListener("touchend",n,{passive:!1}),i.addEventListener("touchcancel",n,{passive:!1})}for(const i of et.touchControls.querySelectorAll("button")){const e=i.dataset.code;i.addEventListener("pointerdown",n=>{n.preventDefault(),da(),vt.add(e),i.setPointerCapture(n.pointerId)});const t=()=>vt.delete(e);i.addEventListener("pointerup",t),i.addEventListener("pointercancel",t),i.addEventListener("lostpointercapture",t)}mr.addEventListener("touchstart",i=>{i.touches.length>=2&&(i.preventDefault(),Cd(i,!0))},{passive:!1});mr.addEventListener("touchmove",i=>{i.touches.length>=2&&(i.preventDefault(),Cd(i))},{passive:!1});mr.addEventListener("touchend",i=>{i.touches.length<2&&(Fe.pinchStartDistance=0)},{passive:!1});mr.addEventListener("touchcancel",()=>{Fe.pinchStartDistance=0},{passive:!1});const N_=bt(g.s);g.y=N_.p.y+2.1;g.lastSafeS=g.s;g.lastSafeDistance=g.totalDistance;kc(.016);nr();Ed();
