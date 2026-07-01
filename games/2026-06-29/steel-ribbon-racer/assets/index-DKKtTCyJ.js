(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const xc="181",kd=0,$c=1,Vd=2,Sh=1,yh=2,ci=3,Pi=0,ln=1,gt=2,$n=0,ys=1,Ti=2,Kc=3,Jc=4,Gd=5,Wi=100,Hd=101,Wd=102,Xd=103,Yd=104,qd=200,Zd=201,$d=202,Kd=203,_o=204,Mo=205,Jd=206,jd=207,Qd=208,eu=209,tu=210,nu=211,iu=212,su=213,ru=214,So=0,yo=1,bo=2,Ts=3,wo=4,To=5,Eo=6,Ao=7,gc=0,au=1,ou=2,Ci=0,bh=1,wh=2,Th=3,vc=4,Eh=5,Ah=6,Ch=7,Rh=300,Es=301,As=302,Co=303,Ro=304,Ma=306,dn=1e3,di=1001,Po=1002,wn=1003,cu=1004,Ar=1005,Pn=1006,Ra=1007,Yi=1008,jn=1009,Ph=1010,Lh=1011,cr=1012,_c=1013,ji=1014,qn=1015,Kn=1016,Mc=1017,Sc=1018,lr=1020,Dh=35902,Ih=35899,Uh=1021,Fh=1022,Bn=1023,hr=1026,dr=1027,yc=1028,bc=1029,wc=1030,Tc=1031,Ec=1033,na=33776,ia=33777,sa=33778,ra=33779,Lo=35840,Do=35841,Io=35842,Uo=35843,Fo=36196,No=37492,Oo=37496,Bo=37808,zo=37809,ko=37810,Vo=37811,Go=37812,Ho=37813,Wo=37814,Xo=37815,Yo=37816,qo=37817,Zo=37818,$o=37819,Ko=37820,Jo=37821,jo=36492,Qo=36494,ec=36495,tc=36283,nc=36284,ic=36285,sc=36286,lu=3200,hu=3201,Ac=0,du=1,wi="",Rt="srgb",Cs="srgb-linear",ha="linear",Ft="srgb",ss=7680,jc=519,uu=512,fu=513,pu=514,Nh=515,mu=516,xu=517,gu=518,vu=519,Qc=35044,el="300 es",Zn=2e3,da=2001;function Oh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ua(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function _u(){const i=ua("canvas");return i.style.display="block",i}const tl={};function nl(...i){const e="THREE."+i.shift();console.log(e,...i)}function lt(...i){const e="THREE."+i.shift();console.warn(e,...i)}function Ht(...i){const e="THREE."+i.shift();console.error(e,...i)}function ur(...i){const e=i.join(" ");e in tl||(tl[e]=!0,lt(...i))}function Mu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}class Is{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let il=1234567;const Qs=Math.PI/180,fr=180/Math.PI;function ts(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(nn[i&255]+nn[i>>8&255]+nn[i>>16&255]+nn[i>>24&255]+"-"+nn[e&255]+nn[e>>8&255]+"-"+nn[e>>16&15|64]+nn[e>>24&255]+"-"+nn[t&63|128]+nn[t>>8&255]+"-"+nn[t>>16&255]+nn[t>>24&255]+nn[n&255]+nn[n>>8&255]+nn[n>>16&255]+nn[n>>24&255]).toLowerCase()}function vt(i,e,t){return Math.max(e,Math.min(t,i))}function Cc(i,e){return(i%e+e)%e}function Su(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function yu(i,e,t){return i!==e?(t-i)/(e-i):0}function er(i,e,t){return(1-t)*i+t*e}function bu(i,e,t,n){return er(i,e,1-Math.exp(-t*n))}function wu(i,e=1){return e-Math.abs(Cc(i,e*2)-e)}function Tu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Eu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Au(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Cu(i,e){return i+Math.random()*(e-i)}function Ru(i){return i*(.5-Math.random())}function Pu(i){i!==void 0&&(il=i);let e=il+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Lu(i){return i*Qs}function Du(i){return i*fr}function Iu(i){return(i&i-1)===0&&i!==0}function Uu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Fu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Nu(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),d=a((e+n)/2),u=r((e-n)/2),p=a((e-n)/2),m=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*d,c*u,c*p,o*l);break;case"YZY":i.set(c*p,o*d,c*u,o*l);break;case"ZXZ":i.set(c*u,c*p,o*d,o*l);break;case"XZX":i.set(o*d,c*g,c*m,o*l);break;case"YXY":i.set(c*m,o*d,c*g,o*l);break;case"ZYZ":i.set(c*g,c*m,o*d,o*l);break;default:lt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ms(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function fn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Be={DEG2RAD:Qs,RAD2DEG:fr,generateUUID:ts,clamp:vt,euclideanModulo:Cc,mapLinear:Su,inverseLerp:yu,lerp:er,damp:bu,pingpong:wu,smoothstep:Tu,smootherstep:Eu,randInt:Au,randFloat:Cu,randFloatSpread:Ru,seededRandom:Pu,degToRad:Lu,radToDeg:Du,isPowerOfTwo:Iu,ceilPowerOfTwo:Uu,floorPowerOfTwo:Fu,setQuaternionFromProperEuler:Nu,normalize:fn,denormalize:Ms};class Ie{constructor(e=0,t=0){Ie.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=vt(this.x,e.x,t.x),this.y=vt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=vt(this.x,e,t),this.y=vt(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(vt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(vt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class pi{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],u=n[s+3],p=r[a+0],m=r[a+1],g=r[a+2],_=r[a+3];if(o<=0){e[t+0]=c,e[t+1]=l,e[t+2]=d,e[t+3]=u;return}if(o>=1){e[t+0]=p,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(u!==_||c!==p||l!==m||d!==g){let x=c*p+l*m+d*g+u*_;x<0&&(p=-p,m=-m,g=-g,_=-_,x=-x);let h=1-o;if(x<.9995){const M=Math.acos(x),v=Math.sin(M);h=Math.sin(h*M)/v,o=Math.sin(o*M)/v,c=c*h+p*o,l=l*h+m*o,d=d*h+g*o,u=u*h+_*o}else{c=c*h+p*o,l=l*h+m*o,d=d*h+g*o,u=u*h+_*o;const M=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=M,l*=M,d*=M,u*=M}}e[t]=c,e[t+1]=l,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],u=r[a],p=r[a+1],m=r[a+2],g=r[a+3];return e[t]=o*g+d*u+c*m-l*p,e[t+1]=c*g+d*p+l*u-o*m,e[t+2]=l*g+d*m+o*p-c*u,e[t+3]=d*g-o*u-c*p-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),u=o(r/2),p=c(n/2),m=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=p*d*u+l*m*g,this._y=l*m*u-p*d*g,this._z=l*d*g+p*m*u,this._w=l*d*u-p*m*g;break;case"YXZ":this._x=p*d*u+l*m*g,this._y=l*m*u-p*d*g,this._z=l*d*g-p*m*u,this._w=l*d*u+p*m*g;break;case"ZXY":this._x=p*d*u-l*m*g,this._y=l*m*u+p*d*g,this._z=l*d*g+p*m*u,this._w=l*d*u-p*m*g;break;case"ZYX":this._x=p*d*u-l*m*g,this._y=l*m*u+p*d*g,this._z=l*d*g-p*m*u,this._w=l*d*u+p*m*g;break;case"YZX":this._x=p*d*u+l*m*g,this._y=l*m*u+p*d*g,this._z=l*d*g-p*m*u,this._w=l*d*u-p*m*g;break;case"XZY":this._x=p*d*u-l*m*g,this._y=l*m*u-p*d*g,this._z=l*d*g+p*m*u,this._w=l*d*u+p*m*g;break;default:lt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],d=t[6],u=t[10],p=n+o+u;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(d-c)*m,this._y=(r-l)*m,this._z=(a-s)*m}else if(n>o&&n>u){const m=2*Math.sqrt(1+n-o-u);this._w=(d-c)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+l)/m}else if(o>u){const m=2*Math.sqrt(1+o-n-u);this._w=(r-l)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+u-n-o);this._w=(a-s)/m,this._x=(r+l)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(vt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,d=t._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,t=Math.sin(t*l)/d,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(sl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(sl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),d=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*d,this.y=n+c*d+o*l-r*u,this.z=s+c*u+r*d-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=vt(this.x,e.x,t.x),this.y=vt(this.y,e.y,t.y),this.z=vt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=vt(this.x,e,t),this.y=vt(this.y,e,t),this.z=vt(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(vt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Pa.copy(this).projectOnVector(e),this.sub(Pa)}reflect(e){return this.sub(Pa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(vt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Pa=new P,sl=new pi;class pt{constructor(e,t,n,s,r,a,o,c,l){pt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],u=n[7],p=n[2],m=n[5],g=n[8],_=s[0],x=s[3],h=s[6],M=s[1],v=s[4],y=s[7],E=s[2],T=s[5],R=s[8];return r[0]=a*_+o*M+c*E,r[3]=a*x+o*v+c*T,r[6]=a*h+o*y+c*R,r[1]=l*_+d*M+u*E,r[4]=l*x+d*v+u*T,r[7]=l*h+d*y+u*R,r[2]=p*_+m*M+g*E,r[5]=p*x+m*v+g*T,r[8]=p*h+m*y+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8];return t*a*d-t*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],u=d*a-o*l,p=o*c-d*r,m=l*r-a*c,g=t*u+n*p+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=u*_,e[1]=(s*l-d*n)*_,e[2]=(o*n-s*a)*_,e[3]=p*_,e[4]=(d*t-s*c)*_,e[5]=(s*r-o*t)*_,e[6]=m*_,e[7]=(n*c-l*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(La.makeScale(e,t)),this}rotate(e){return this.premultiply(La.makeRotation(-e)),this}translate(e,t){return this.premultiply(La.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const La=new pt,rl=new pt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),al=new pt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ou(){const i={enabled:!0,workingColorSpace:Cs,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Ft&&(s.r=ui(s.r),s.g=ui(s.g),s.b=ui(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Ft&&(s.r=bs(s.r),s.g=bs(s.g),s.b=bs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===wi?ha:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ur("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ur("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Cs]:{primaries:e,whitePoint:n,transfer:ha,toXYZ:rl,fromXYZ:al,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Rt},outputColorSpaceConfig:{drawingBufferColorSpace:Rt}},[Rt]:{primaries:e,whitePoint:n,transfer:Ft,toXYZ:rl,fromXYZ:al,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Rt}}}),i}const Et=Ou();function ui(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function bs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let rs;class Bu{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{rs===void 0&&(rs=ua("canvas")),rs.width=e.width,rs.height=e.height;const s=rs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=rs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ua("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ui(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ui(t[n]/255)*255):t[n]=ui(t[n]);return{data:t,width:e.width,height:e.height}}else return lt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let zu=0;class Rc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=ts(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Da(s[a].image)):r.push(Da(s[a]))}else r=Da(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Da(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Bu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(lt("Texture: Unable to serialize Texture."),{})}let ku=0;const Ia=new P;class hn extends Is{constructor(e=hn.DEFAULT_IMAGE,t=hn.DEFAULT_MAPPING,n=di,s=di,r=Pn,a=Yi,o=Bn,c=jn,l=hn.DEFAULT_ANISOTROPY,d=wi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ku++}),this.uuid=ts(),this.name="",this.source=new Rc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ie(0,0),this.repeat=new Ie(1,1),this.center=new Ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new pt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ia).x}get height(){return this.source.getSize(Ia).y}get depth(){return this.source.getSize(Ia).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){lt(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){lt(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Rh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case dn:e.x=e.x-Math.floor(e.x);break;case di:e.x=e.x<0?0:1;break;case Po:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case dn:e.y=e.y-Math.floor(e.y);break;case di:e.y=e.y<0?0:1;break;case Po:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}hn.DEFAULT_IMAGE=null;hn.DEFAULT_MAPPING=Rh;hn.DEFAULT_ANISOTROPY=1;class Nt{constructor(e=0,t=0,n=0,s=1){Nt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],d=c[4],u=c[8],p=c[1],m=c[5],g=c[9],_=c[2],x=c[6],h=c[10];if(Math.abs(d-p)<.01&&Math.abs(u-_)<.01&&Math.abs(g-x)<.01){if(Math.abs(d+p)<.1&&Math.abs(u+_)<.1&&Math.abs(g+x)<.1&&Math.abs(l+m+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(l+1)/2,y=(m+1)/2,E=(h+1)/2,T=(d+p)/4,R=(u+_)/4,C=(g+x)/4;return v>y&&v>E?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=T/n,r=R/n):y>E?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=T/s,r=C/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=R/r,s=C/r),this.set(n,s,r,t),this}let M=Math.sqrt((x-g)*(x-g)+(u-_)*(u-_)+(p-d)*(p-d));return Math.abs(M)<.001&&(M=1),this.x=(x-g)/M,this.y=(u-_)/M,this.z=(p-d)/M,this.w=Math.acos((l+m+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=vt(this.x,e.x,t.x),this.y=vt(this.y,e.y,t.y),this.z=vt(this.z,e.z,t.z),this.w=vt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=vt(this.x,e,t),this.y=vt(this.y,e,t),this.z=vt(this.z,e,t),this.w=vt(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(vt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Vu extends Is{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Nt(0,0,e,t),this.scissorTest=!1,this.viewport=new Nt(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new hn(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Pn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Rc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zn extends Vu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Bh extends hn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=wn,this.minFilter=wn,this.wrapR=di,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Gu extends hn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=wn,this.minFilter=wn,this.wrapR=di,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ns{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ln.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ln.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Ln.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Ln):Ln.fromBufferAttribute(r,a),Ln.applyMatrix4(e.matrixWorld),this.expandByPoint(Ln);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Cr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Cr.copy(n.boundingBox)),Cr.applyMatrix4(e.matrixWorld),this.union(Cr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ln),Ln.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(zs),Rr.subVectors(this.max,zs),as.subVectors(e.a,zs),os.subVectors(e.b,zs),cs.subVectors(e.c,zs),mi.subVectors(os,as),xi.subVectors(cs,os),Ui.subVectors(as,cs);let t=[0,-mi.z,mi.y,0,-xi.z,xi.y,0,-Ui.z,Ui.y,mi.z,0,-mi.x,xi.z,0,-xi.x,Ui.z,0,-Ui.x,-mi.y,mi.x,0,-xi.y,xi.x,0,-Ui.y,Ui.x,0];return!Ua(t,as,os,cs,Rr)||(t=[1,0,0,0,1,0,0,0,1],!Ua(t,as,os,cs,Rr))?!1:(Pr.crossVectors(mi,xi),t=[Pr.x,Pr.y,Pr.z],Ua(t,as,os,cs,Rr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ln).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ln).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ni[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ni[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ni[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ni[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ni[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ni[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ni[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ni[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ni),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ni=[new P,new P,new P,new P,new P,new P,new P,new P],Ln=new P,Cr=new ns,as=new P,os=new P,cs=new P,mi=new P,xi=new P,Ui=new P,zs=new P,Rr=new P,Pr=new P,Fi=new P;function Ua(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Fi.fromArray(i,r);const o=s.x*Math.abs(Fi.x)+s.y*Math.abs(Fi.y)+s.z*Math.abs(Fi.z),c=e.dot(Fi),l=t.dot(Fi),d=n.dot(Fi);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const Hu=new ns,ks=new P,Fa=new P;class Us{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Hu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ks.subVectors(e,this.center);const t=ks.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ks,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Fa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ks.copy(e.center).add(Fa)),this.expandByPoint(ks.copy(e.center).sub(Fa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const ii=new P,Na=new P,Lr=new P,gi=new P,Oa=new P,Dr=new P,Ba=new P;class Pc{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ii)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ii.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ii.copy(this.origin).addScaledVector(this.direction,t),ii.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Na.copy(e).add(t).multiplyScalar(.5),Lr.copy(t).sub(e).normalize(),gi.copy(this.origin).sub(Na);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Lr),o=gi.dot(this.direction),c=-gi.dot(Lr),l=gi.lengthSq(),d=Math.abs(1-a*a);let u,p,m,g;if(d>0)if(u=a*c-o,p=a*o-c,g=r*d,u>=0)if(p>=-g)if(p<=g){const _=1/d;u*=_,p*=_,m=u*(u+a*p+2*o)+p*(a*u+p+2*c)+l}else p=r,u=Math.max(0,-(a*p+o)),m=-u*u+p*(p+2*c)+l;else p=-r,u=Math.max(0,-(a*p+o)),m=-u*u+p*(p+2*c)+l;else p<=-g?(u=Math.max(0,-(-a*r+o)),p=u>0?-r:Math.min(Math.max(-r,-c),r),m=-u*u+p*(p+2*c)+l):p<=g?(u=0,p=Math.min(Math.max(-r,-c),r),m=p*(p+2*c)+l):(u=Math.max(0,-(a*r+o)),p=u>0?r:Math.min(Math.max(-r,-c),r),m=-u*u+p*(p+2*c)+l);else p=a>0?-r:r,u=Math.max(0,-(a*p+o)),m=-u*u+p*(p+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Na).addScaledVector(Lr,p),m}intersectSphere(e,t){ii.subVectors(e.center,this.origin);const n=ii.dot(this.direction),s=ii.dot(ii)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,p=this.origin;return l>=0?(n=(e.min.x-p.x)*l,s=(e.max.x-p.x)*l):(n=(e.max.x-p.x)*l,s=(e.min.x-p.x)*l),d>=0?(r=(e.min.y-p.y)*d,a=(e.max.y-p.y)*d):(r=(e.max.y-p.y)*d,a=(e.min.y-p.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-p.z)*u,c=(e.max.z-p.z)*u):(o=(e.max.z-p.z)*u,c=(e.min.z-p.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ii)!==null}intersectTriangle(e,t,n,s,r){Oa.subVectors(t,e),Dr.subVectors(n,e),Ba.crossVectors(Oa,Dr);let a=this.direction.dot(Ba),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;gi.subVectors(this.origin,e);const c=o*this.direction.dot(Dr.crossVectors(gi,Dr));if(c<0)return null;const l=o*this.direction.dot(Oa.cross(gi));if(l<0||c+l>a)return null;const d=-o*gi.dot(Ba);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Dt{constructor(e,t,n,s,r,a,o,c,l,d,u,p,m,g,_,x){Dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,d,u,p,m,g,_,x)}set(e,t,n,s,r,a,o,c,l,d,u,p,m,g,_,x){const h=this.elements;return h[0]=e,h[4]=t,h[8]=n,h[12]=s,h[1]=r,h[5]=a,h[9]=o,h[13]=c,h[2]=l,h[6]=d,h[10]=u,h[14]=p,h[3]=m,h[7]=g,h[11]=_,h[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Dt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/ls.setFromMatrixColumn(e,0).length(),r=1/ls.setFromMatrixColumn(e,1).length(),a=1/ls.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const p=a*d,m=a*u,g=o*d,_=o*u;t[0]=c*d,t[4]=-c*u,t[8]=l,t[1]=m+g*l,t[5]=p-_*l,t[9]=-o*c,t[2]=_-p*l,t[6]=g+m*l,t[10]=a*c}else if(e.order==="YXZ"){const p=c*d,m=c*u,g=l*d,_=l*u;t[0]=p+_*o,t[4]=g*o-m,t[8]=a*l,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=m*o-g,t[6]=_+p*o,t[10]=a*c}else if(e.order==="ZXY"){const p=c*d,m=c*u,g=l*d,_=l*u;t[0]=p-_*o,t[4]=-a*u,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*d,t[9]=_-p*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const p=a*d,m=a*u,g=o*d,_=o*u;t[0]=c*d,t[4]=g*l-m,t[8]=p*l+_,t[1]=c*u,t[5]=_*l+p,t[9]=m*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const p=a*c,m=a*l,g=o*c,_=o*l;t[0]=c*d,t[4]=_-p*u,t[8]=g*u+m,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-l*d,t[6]=m*u+g,t[10]=p-_*u}else if(e.order==="XZY"){const p=a*c,m=a*l,g=o*c,_=o*l;t[0]=c*d,t[4]=-u,t[8]=l*d,t[1]=p*u+_,t[5]=a*d,t[9]=m*u-g,t[2]=g*u-m,t[6]=o*d,t[10]=_*u+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Wu,e,Xu)}lookAt(e,t,n){const s=this.elements;return Sn.subVectors(e,t),Sn.lengthSq()===0&&(Sn.z=1),Sn.normalize(),vi.crossVectors(n,Sn),vi.lengthSq()===0&&(Math.abs(n.z)===1?Sn.x+=1e-4:Sn.z+=1e-4,Sn.normalize(),vi.crossVectors(n,Sn)),vi.normalize(),Ir.crossVectors(Sn,vi),s[0]=vi.x,s[4]=Ir.x,s[8]=Sn.x,s[1]=vi.y,s[5]=Ir.y,s[9]=Sn.y,s[2]=vi.z,s[6]=Ir.z,s[10]=Sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],u=n[5],p=n[9],m=n[13],g=n[2],_=n[6],x=n[10],h=n[14],M=n[3],v=n[7],y=n[11],E=n[15],T=s[0],R=s[4],C=s[8],b=s[12],S=s[1],L=s[5],U=s[9],H=s[13],te=s[2],ne=s[6],W=s[10],Q=s[14],ie=s[3],de=s[7],fe=s[11],ze=s[15];return r[0]=a*T+o*S+c*te+l*ie,r[4]=a*R+o*L+c*ne+l*de,r[8]=a*C+o*U+c*W+l*fe,r[12]=a*b+o*H+c*Q+l*ze,r[1]=d*T+u*S+p*te+m*ie,r[5]=d*R+u*L+p*ne+m*de,r[9]=d*C+u*U+p*W+m*fe,r[13]=d*b+u*H+p*Q+m*ze,r[2]=g*T+_*S+x*te+h*ie,r[6]=g*R+_*L+x*ne+h*de,r[10]=g*C+_*U+x*W+h*fe,r[14]=g*b+_*H+x*Q+h*ze,r[3]=M*T+v*S+y*te+E*ie,r[7]=M*R+v*L+y*ne+E*de,r[11]=M*C+v*U+y*W+E*fe,r[15]=M*b+v*H+y*Q+E*ze,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],d=e[2],u=e[6],p=e[10],m=e[14],g=e[3],_=e[7],x=e[11],h=e[15];return g*(+r*c*u-s*l*u-r*o*p+n*l*p+s*o*m-n*c*m)+_*(+t*c*m-t*l*p+r*a*p-s*a*m+s*l*d-r*c*d)+x*(+t*l*u-t*o*m-r*a*u+n*a*m+r*o*d-n*l*d)+h*(-s*o*d-t*c*u+t*o*p+s*a*u-n*a*p+n*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],u=e[9],p=e[10],m=e[11],g=e[12],_=e[13],x=e[14],h=e[15],M=u*x*l-_*p*l+_*c*m-o*x*m-u*c*h+o*p*h,v=g*p*l-d*x*l-g*c*m+a*x*m+d*c*h-a*p*h,y=d*_*l-g*u*l+g*o*m-a*_*m-d*o*h+a*u*h,E=g*u*c-d*_*c-g*o*p+a*_*p+d*o*x-a*u*x,T=t*M+n*v+s*y+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/T;return e[0]=M*R,e[1]=(_*p*r-u*x*r-_*s*m+n*x*m+u*s*h-n*p*h)*R,e[2]=(o*x*r-_*c*r+_*s*l-n*x*l-o*s*h+n*c*h)*R,e[3]=(u*c*r-o*p*r-u*s*l+n*p*l+o*s*m-n*c*m)*R,e[4]=v*R,e[5]=(d*x*r-g*p*r+g*s*m-t*x*m-d*s*h+t*p*h)*R,e[6]=(g*c*r-a*x*r-g*s*l+t*x*l+a*s*h-t*c*h)*R,e[7]=(a*p*r-d*c*r+d*s*l-t*p*l-a*s*m+t*c*m)*R,e[8]=y*R,e[9]=(g*u*r-d*_*r-g*n*m+t*_*m+d*n*h-t*u*h)*R,e[10]=(a*_*r-g*o*r+g*n*l-t*_*l-a*n*h+t*o*h)*R,e[11]=(d*o*r-a*u*r-d*n*l+t*u*l+a*n*m-t*o*m)*R,e[12]=E*R,e[13]=(d*_*s-g*u*s+g*n*p-t*_*p-d*n*x+t*u*x)*R,e[14]=(g*o*s-a*_*s-g*n*c+t*_*c+a*n*x-t*o*x)*R,e[15]=(a*u*s-d*o*s+d*n*c-t*u*c-a*n*p+t*o*p)*R,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,d=a+a,u=o+o,p=r*l,m=r*d,g=r*u,_=a*d,x=a*u,h=o*u,M=c*l,v=c*d,y=c*u,E=n.x,T=n.y,R=n.z;return s[0]=(1-(_+h))*E,s[1]=(m+y)*E,s[2]=(g-v)*E,s[3]=0,s[4]=(m-y)*T,s[5]=(1-(p+h))*T,s[6]=(x+M)*T,s[7]=0,s[8]=(g+v)*R,s[9]=(x-M)*R,s[10]=(1-(p+_))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=ls.set(s[0],s[1],s[2]).length();const a=ls.set(s[4],s[5],s[6]).length(),o=ls.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Dn.copy(this);const l=1/r,d=1/a,u=1/o;return Dn.elements[0]*=l,Dn.elements[1]*=l,Dn.elements[2]*=l,Dn.elements[4]*=d,Dn.elements[5]*=d,Dn.elements[6]*=d,Dn.elements[8]*=u,Dn.elements[9]*=u,Dn.elements[10]*=u,t.setFromRotationMatrix(Dn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Zn,c=!1){const l=this.elements,d=2*r/(t-e),u=2*r/(n-s),p=(t+e)/(t-e),m=(n+s)/(n-s);let g,_;if(c)g=r/(a-r),_=a*r/(a-r);else if(o===Zn)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===da)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=p,l[12]=0,l[1]=0,l[5]=u,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Zn,c=!1){const l=this.elements,d=2/(t-e),u=2/(n-s),p=-(t+e)/(t-e),m=-(n+s)/(n-s);let g,_;if(c)g=1/(a-r),_=a/(a-r);else if(o===Zn)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===da)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=p,l[1]=0,l[5]=u,l[9]=0,l[13]=m,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ls=new P,Dn=new Dt,Wu=new P(0,0,0),Xu=new P(1,1,1),vi=new P,Ir=new P,Sn=new P,ol=new Dt,cl=new pi;class Gn{constructor(e=0,t=0,n=0,s=Gn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],u=s[2],p=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(vt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(p,l),this._z=0);break;case"YXZ":this._x=Math.asin(-vt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(vt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-vt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(vt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-vt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:lt("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ol.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ol,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return cl.setFromEuler(this),this.setFromQuaternion(cl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Gn.DEFAULT_ORDER="XYZ";class Lc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Yu=0;const ll=new P,hs=new pi,si=new Dt,Ur=new P,Vs=new P,qu=new P,Zu=new pi,hl=new P(1,0,0),dl=new P(0,1,0),ul=new P(0,0,1),fl={type:"added"},$u={type:"removed"},ds={type:"childadded",child:null},za={type:"childremoved",child:null};class Wt extends Is{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yu++}),this.uuid=ts(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Wt.DEFAULT_UP.clone();const e=new P,t=new Gn,n=new pi,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Dt},normalMatrix:{value:new pt}}),this.matrix=new Dt,this.matrixWorld=new Dt,this.matrixAutoUpdate=Wt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Lc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return hs.setFromAxisAngle(e,t),this.quaternion.multiply(hs),this}rotateOnWorldAxis(e,t){return hs.setFromAxisAngle(e,t),this.quaternion.premultiply(hs),this}rotateX(e){return this.rotateOnAxis(hl,e)}rotateY(e){return this.rotateOnAxis(dl,e)}rotateZ(e){return this.rotateOnAxis(ul,e)}translateOnAxis(e,t){return ll.copy(e).applyQuaternion(this.quaternion),this.position.add(ll.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(hl,e)}translateY(e){return this.translateOnAxis(dl,e)}translateZ(e){return this.translateOnAxis(ul,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(si.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ur.copy(e):Ur.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Vs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?si.lookAt(Vs,Ur,this.up):si.lookAt(Ur,Vs,this.up),this.quaternion.setFromRotationMatrix(si),s&&(si.extractRotation(s.matrixWorld),hs.setFromRotationMatrix(si),this.quaternion.premultiply(hs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ht("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(fl),ds.child=e,this.dispatchEvent(ds),ds.child=null):Ht("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent($u),za.child=e,this.dispatchEvent(za),za.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),si.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),si.multiply(e.parent.matrixWorld)),e.applyMatrix4(si),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(fl),ds.child=e,this.dispatchEvent(ds),ds.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vs,e,qu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Vs,Zu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),d=a(e.images),u=a(e.shapes),p=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),p.length>0&&(n.skeletons=p),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Wt.DEFAULT_UP=new P(0,1,0);Wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const In=new P,ri=new P,ka=new P,ai=new P,us=new P,fs=new P,pl=new P,Va=new P,Ga=new P,Ha=new P,Wa=new Nt,Xa=new Nt,Ya=new Nt;class On{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),In.subVectors(e,t),s.cross(In);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){In.subVectors(s,t),ri.subVectors(n,t),ka.subVectors(e,t);const a=In.dot(In),o=In.dot(ri),c=In.dot(ka),l=ri.dot(ri),d=ri.dot(ka),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const p=1/u,m=(l*c-o*d)*p,g=(a*d-o*c)*p;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ai)===null?!1:ai.x>=0&&ai.y>=0&&ai.x+ai.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,ai)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ai.x),c.addScaledVector(a,ai.y),c.addScaledVector(o,ai.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return Wa.setScalar(0),Xa.setScalar(0),Ya.setScalar(0),Wa.fromBufferAttribute(e,t),Xa.fromBufferAttribute(e,n),Ya.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Wa,r.x),a.addScaledVector(Xa,r.y),a.addScaledVector(Ya,r.z),a}static isFrontFacing(e,t,n,s){return In.subVectors(n,t),ri.subVectors(e,t),In.cross(ri).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return In.subVectors(this.c,this.b),ri.subVectors(this.a,this.b),In.cross(ri).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return On.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return On.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return On.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return On.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return On.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;us.subVectors(s,n),fs.subVectors(r,n),Va.subVectors(e,n);const c=us.dot(Va),l=fs.dot(Va);if(c<=0&&l<=0)return t.copy(n);Ga.subVectors(e,s);const d=us.dot(Ga),u=fs.dot(Ga);if(d>=0&&u<=d)return t.copy(s);const p=c*u-d*l;if(p<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(n).addScaledVector(us,a);Ha.subVectors(e,r);const m=us.dot(Ha),g=fs.dot(Ha);if(g>=0&&m<=g)return t.copy(r);const _=m*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(fs,o);const x=d*g-m*u;if(x<=0&&u-d>=0&&m-g>=0)return pl.subVectors(r,s),o=(u-d)/(u-d+(m-g)),t.copy(s).addScaledVector(pl,o);const h=1/(x+_+p);return a=_*h,o=p*h,t.copy(n).addScaledVector(us,a).addScaledVector(fs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const zh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_i={h:0,s:0,l:0},Fr={h:0,s:0,l:0};function qa(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class it{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Rt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Et.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Et.workingColorSpace){return this.r=e,this.g=t,this.b=n,Et.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Et.workingColorSpace){if(e=Cc(e,1),t=vt(t,0,1),n=vt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=qa(a,r,e+1/3),this.g=qa(a,r,e),this.b=qa(a,r,e-1/3)}return Et.colorSpaceToWorking(this,s),this}setStyle(e,t=Rt){function n(r){r!==void 0&&parseFloat(r)<1&&lt("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:lt("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);lt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Rt){const n=zh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):lt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ui(e.r),this.g=ui(e.g),this.b=ui(e.b),this}copyLinearToSRGB(e){return this.r=bs(e.r),this.g=bs(e.g),this.b=bs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Rt){return Et.workingToColorSpace(sn.copy(this),e),Math.round(vt(sn.r*255,0,255))*65536+Math.round(vt(sn.g*255,0,255))*256+Math.round(vt(sn.b*255,0,255))}getHexString(e=Rt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Et.workingColorSpace){Et.workingToColorSpace(sn.copy(this),t);const n=sn.r,s=sn.g,r=sn.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=d<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=d,e}getRGB(e,t=Et.workingColorSpace){return Et.workingToColorSpace(sn.copy(this),t),e.r=sn.r,e.g=sn.g,e.b=sn.b,e}getStyle(e=Rt){Et.workingToColorSpace(sn.copy(this),e);const t=sn.r,n=sn.g,s=sn.b;return e!==Rt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(_i),this.setHSL(_i.h+e,_i.s+t,_i.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(_i),e.getHSL(Fr);const n=er(_i.h,Fr.h,t),s=er(_i.s,Fr.s,t),r=er(_i.l,Fr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const sn=new it;it.NAMES=zh;let Ku=0;class is extends Is{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ku++}),this.uuid=ts(),this.name="",this.type="Material",this.blending=ys,this.side=Pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_o,this.blendDst=Mo,this.blendEquation=Wi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new it(0,0,0),this.blendAlpha=0,this.depthFunc=Ts,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ss,this.stencilZFail=ss,this.stencilZPass=ss,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){lt(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){lt(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ys&&(n.blending=this.blending),this.side!==Pi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==_o&&(n.blendSrc=this.blendSrc),this.blendDst!==Mo&&(n.blendDst=this.blendDst),this.blendEquation!==Wi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ts&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==jc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ss&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ss&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ss&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class At extends is{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new it(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gn,this.combine=gc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const qt=new P,Nr=new Ie;let Ju=0;class kn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ju++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Qc,this.updateRanges=[],this.gpuType=qn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Nr.fromBufferAttribute(this,t),Nr.applyMatrix3(e),this.setXY(t,Nr.x,Nr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix3(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ms(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=fn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ms(t,this.array)),t}setX(e,t){return this.normalized&&(t=fn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ms(t,this.array)),t}setY(e,t){return this.normalized&&(t=fn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ms(t,this.array)),t}setZ(e,t){return this.normalized&&(t=fn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ms(t,this.array)),t}setW(e,t){return this.normalized&&(t=fn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=fn(t,this.array),n=fn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=fn(t,this.array),n=fn(n,this.array),s=fn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=fn(t,this.array),n=fn(n,this.array),s=fn(s,this.array),r=fn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Qc&&(e.usage=this.usage),e}}class kh extends kn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Vh extends kn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class wt extends kn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let ju=0;const An=new Dt,Za=new Wt,ps=new P,yn=new ns,Gs=new ns,jt=new P;class Xt extends Is{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=ts(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Oh(e)?Vh:kh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new pt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,n){return An.makeTranslation(e,t,n),this.applyMatrix4(An),this}scale(e,t,n){return An.makeScale(e,t,n),this.applyMatrix4(An),this}lookAt(e){return Za.lookAt(e),Za.updateMatrix(),this.applyMatrix4(Za.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ps).negate(),this.translate(ps.x,ps.y,ps.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new wt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&lt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ns);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ht("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(jt.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(jt),jt.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(jt)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ht('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Us);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ht("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(yn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Gs.setFromBufferAttribute(o),this.morphTargetsRelative?(jt.addVectors(yn.min,Gs.min),yn.expandByPoint(jt),jt.addVectors(yn.max,Gs.max),yn.expandByPoint(jt)):(yn.expandByPoint(Gs.min),yn.expandByPoint(Gs.max))}yn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)jt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(jt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)jt.fromBufferAttribute(o,l),c&&(ps.fromBufferAttribute(e,l),jt.add(ps)),s=Math.max(s,n.distanceToSquared(jt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ht('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ht("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let C=0;C<n.count;C++)o[C]=new P,c[C]=new P;const l=new P,d=new P,u=new P,p=new Ie,m=new Ie,g=new Ie,_=new P,x=new P;function h(C,b,S){l.fromBufferAttribute(n,C),d.fromBufferAttribute(n,b),u.fromBufferAttribute(n,S),p.fromBufferAttribute(r,C),m.fromBufferAttribute(r,b),g.fromBufferAttribute(r,S),d.sub(l),u.sub(l),m.sub(p),g.sub(p);const L=1/(m.x*g.y-g.x*m.y);isFinite(L)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(u,-m.y).multiplyScalar(L),x.copy(u).multiplyScalar(m.x).addScaledVector(d,-g.x).multiplyScalar(L),o[C].add(_),o[b].add(_),o[S].add(_),c[C].add(x),c[b].add(x),c[S].add(x))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let C=0,b=M.length;C<b;++C){const S=M[C],L=S.start,U=S.count;for(let H=L,te=L+U;H<te;H+=3)h(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const v=new P,y=new P,E=new P,T=new P;function R(C){E.fromBufferAttribute(s,C),T.copy(E);const b=o[C];v.copy(b),v.sub(E.multiplyScalar(E.dot(b))).normalize(),y.crossVectors(T,b);const L=y.dot(c[C])<0?-1:1;a.setXYZW(C,v.x,v.y,v.z,L)}for(let C=0,b=M.length;C<b;++C){const S=M[C],L=S.start,U=S.count;for(let H=L,te=L+U;H<te;H+=3)R(e.getX(H+0)),R(e.getX(H+1)),R(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new kn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let p=0,m=n.count;p<m;p++)n.setXYZ(p,0,0,0);const s=new P,r=new P,a=new P,o=new P,c=new P,l=new P,d=new P,u=new P;if(e)for(let p=0,m=e.count;p<m;p+=3){const g=e.getX(p+0),_=e.getX(p+1),x=e.getX(p+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,x),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,x),o.add(d),c.add(d),l.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(x,l.x,l.y,l.z)}else for(let p=0,m=t.count;p<m;p+=3)s.fromBufferAttribute(t,p+0),r.fromBufferAttribute(t,p+1),a.fromBufferAttribute(t,p+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),n.setXYZ(p+0,d.x,d.y,d.z),n.setXYZ(p+1,d.x,d.y,d.z),n.setXYZ(p+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)jt.fromBufferAttribute(e,t),jt.normalize(),e.setXYZ(t,jt.x,jt.y,jt.z)}toNonIndexed(){function e(o,c){const l=o.array,d=o.itemSize,u=o.normalized,p=new l.constructor(c.length*d);let m=0,g=0;for(let _=0,x=c.length;_<x;_++){o.isInterleavedBufferAttribute?m=c[_]*o.data.stride+o.offset:m=c[_]*d;for(let h=0;h<d;h++)p[g++]=l[m++]}return new kn(p,d,u)}if(this.index===null)return lt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Xt,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,u=l.length;d<u;d++){const p=l[d],m=e(p,n);c.push(m)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,p=l.length;u<p;u++){const m=l[u];d.push(m.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(t))}const r=e.morphAttributes;for(const l in r){const d=[],u=r[l];for(let p=0,m=u.length;p<m;p++)d.push(u[p].clone(t));this.morphAttributes[l]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,d=a.length;l<d;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ml=new Dt,Ni=new Pc,Or=new Us,xl=new P,Br=new P,zr=new P,kr=new P,$a=new P,Vr=new P,gl=new P,Gr=new P;class V extends Wt{constructor(e=new Xt,t=new At){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Vr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],u=r[c];d!==0&&($a.fromBufferAttribute(u,e),a?Vr.addScaledVector($a,d):Vr.addScaledVector($a.sub(t),d))}t.add(Vr)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere),Or.applyMatrix4(r),Ni.copy(e.ray).recast(e.near),!(Or.containsPoint(Ni.origin)===!1&&(Ni.intersectSphere(Or,xl)===null||Ni.origin.distanceToSquared(xl)>(e.far-e.near)**2))&&(ml.copy(r).invert(),Ni.copy(e.ray).applyMatrix4(ml),!(n.boundingBox!==null&&Ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ni)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,p=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=p.length;g<_;g++){const x=p[g],h=a[x.materialIndex],M=Math.max(x.start,m.start),v=Math.min(o.count,Math.min(x.start+x.count,m.start+m.count));for(let y=M,E=v;y<E;y+=3){const T=o.getX(y),R=o.getX(y+1),C=o.getX(y+2);s=Hr(this,h,e,n,l,d,u,T,R,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let x=g,h=_;x<h;x+=3){const M=o.getX(x),v=o.getX(x+1),y=o.getX(x+2);s=Hr(this,a,e,n,l,d,u,M,v,y),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=p.length;g<_;g++){const x=p[g],h=a[x.materialIndex],M=Math.max(x.start,m.start),v=Math.min(c.count,Math.min(x.start+x.count,m.start+m.count));for(let y=M,E=v;y<E;y+=3){const T=y,R=y+1,C=y+2;s=Hr(this,h,e,n,l,d,u,T,R,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(c.count,m.start+m.count);for(let x=g,h=_;x<h;x+=3){const M=x,v=x+1,y=x+2;s=Hr(this,a,e,n,l,d,u,M,v,y),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}}}function Qu(i,e,t,n,s,r,a,o){let c;if(e.side===ln?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===Pi,o),c===null)return null;Gr.copy(o),Gr.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Gr);return l<t.near||l>t.far?null:{distance:l,point:Gr.clone(),object:i}}function Hr(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,Br),i.getVertexPosition(c,zr),i.getVertexPosition(l,kr);const d=Qu(i,e,t,n,Br,zr,kr,gl);if(d){const u=new P;On.getBarycoord(gl,Br,zr,kr,u),s&&(d.uv=On.getInterpolatedAttribute(s,o,c,l,u,new Ie)),r&&(d.uv1=On.getInterpolatedAttribute(r,o,c,l,u,new Ie)),a&&(d.normal=On.getInterpolatedAttribute(a,o,c,l,u,new P),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const p={a:o,b:c,c:l,normal:new P,materialIndex:0};On.getNormal(Br,zr,kr,p.normal),d.face=p,d.barycoord=u}return d}class Le extends Xt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],u=[];let p=0,m=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new wt(l,3)),this.setAttribute("normal",new wt(d,3)),this.setAttribute("uv",new wt(u,2));function g(_,x,h,M,v,y,E,T,R,C,b){const S=y/R,L=E/C,U=y/2,H=E/2,te=T/2,ne=R+1,W=C+1;let Q=0,ie=0;const de=new P;for(let fe=0;fe<W;fe++){const ze=fe*L-H;for(let I=0;I<ne;I++){const ye=I*S-U;de[_]=ye*M,de[x]=ze*v,de[h]=te,l.push(de.x,de.y,de.z),de[_]=0,de[x]=0,de[h]=T>0?1:-1,d.push(de.x,de.y,de.z),u.push(I/R),u.push(1-fe/C),Q+=1}}for(let fe=0;fe<C;fe++)for(let ze=0;ze<R;ze++){const I=p+ze+ne*fe,ye=p+ze+ne*(fe+1),Me=p+(ze+1)+ne*(fe+1),Se=p+(ze+1)+ne*fe;c.push(I,ye,Se),c.push(ye,Me,Se),ie+=6}o.addGroup(m,ie,b),m+=ie,p+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Le(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Rs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(lt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function pn(i){const e={};for(let t=0;t<i.length;t++){const n=Rs(i[t]);for(const s in n)e[s]=n[s]}return e}function ef(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Gh(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Et.workingColorSpace}const pr={clone:Rs,merge:pn};var tf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,nf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class cn extends is{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=tf,this.fragmentShader=nf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Rs(e.uniforms),this.uniformsGroups=ef(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Hh extends Wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Dt,this.projectionMatrix=new Dt,this.projectionMatrixInverse=new Dt,this.coordinateSystem=Zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Mi=new P,vl=new Ie,_l=new Ie;class bn extends Hh{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=fr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Qs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return fr*2*Math.atan(Math.tan(Qs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Mi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Mi.x,Mi.y).multiplyScalar(-e/Mi.z),Mi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Mi.x,Mi.y).multiplyScalar(-e/Mi.z)}getViewSize(e,t){return this.getViewBounds(e,vl,_l),t.subVectors(_l,vl)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Qs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ms=-90,xs=1;class sf extends Wt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new bn(ms,xs,e,t);s.layers=this.layers,this.add(s);const r=new bn(ms,xs,e,t);r.layers=this.layers,this.add(r);const a=new bn(ms,xs,e,t);a.layers=this.layers,this.add(a);const o=new bn(ms,xs,e,t);o.layers=this.layers,this.add(o);const c=new bn(ms,xs,e,t);c.layers=this.layers,this.add(c);const l=new bn(ms,xs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===Zn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===da)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,u=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(u,p,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Wh extends hn{constructor(e=[],t=Es,n,s,r,a,o,c,l,d){super(e,t,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class rf extends zn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Wh(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Le(5,5,5),r=new cn({name:"CubemapFromEquirect",uniforms:Rs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ln,blending:$n});r.uniforms.tEquirect.value=t;const a=new V(s,r),o=t.minFilter;return t.minFilter===Yi&&(t.minFilter=Pn),new sf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class at extends Wt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const af={type:"move"};class Ka{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new at,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new at,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new at,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const _ of e.hand.values()){const x=t.getJointPose(_,n),h=this._getHandJoint(l,_);x!==null&&(h.matrix.fromArray(x.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=x.radius),h.visible=x!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],p=d.position.distanceTo(u.position),m=.02,g=.005;l.inputState.pinching&&p>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&p<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(af)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new at;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Dc{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new it(e),this.near=t,this.far=n}clone(){return new Dc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Xh extends Wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Gn,this.environmentIntensity=1,this.environmentRotation=new Gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Yh extends hn{constructor(e=null,t=1,n=1,s,r,a,o,c,l=wn,d=wn,u,p){super(null,a,o,c,l,d,s,r,u,p),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ml extends kn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const gs=new Dt,Sl=new Dt,Wr=[],yl=new ns,of=new Dt,Hs=new V,Ws=new Us;class rn extends V{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ml(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,of)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ns),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,gs),yl.copy(e.boundingBox).applyMatrix4(gs),this.boundingBox.union(yl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Us),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,gs),Ws.copy(e.boundingSphere).applyMatrix4(gs),this.boundingSphere.union(Ws)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(Hs.geometry=this.geometry,Hs.material=this.material,Hs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ws.copy(this.boundingSphere),Ws.applyMatrix4(n),e.ray.intersectsSphere(Ws)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,gs),Sl.multiplyMatrices(n,gs),Hs.matrixWorld=Sl,Hs.raycast(e,Wr);for(let a=0,o=Wr.length;a<o;a++){const c=Wr[a];c.instanceId=r,c.object=this,t.push(c)}Wr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ml(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Yh(new Float32Array(s*this.count),s,this.count,yc,qn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ja=new P,cf=new P,lf=new pt;class ki{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Ja.subVectors(n,t).cross(cf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Ja),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||lf.getNormalMatrix(e),s=this.coplanarPoint(Ja).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Oi=new Us,hf=new Ie(.5,.5),Xr=new P;class Ic{constructor(e=new ki,t=new ki,n=new ki,s=new ki,r=new ki,a=new ki){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Zn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],u=r[5],p=r[6],m=r[7],g=r[8],_=r[9],x=r[10],h=r[11],M=r[12],v=r[13],y=r[14],E=r[15];if(s[0].setComponents(l-a,m-d,h-g,E-M).normalize(),s[1].setComponents(l+a,m+d,h+g,E+M).normalize(),s[2].setComponents(l+o,m+u,h+_,E+v).normalize(),s[3].setComponents(l-o,m-u,h-_,E-v).normalize(),n)s[4].setComponents(c,p,x,y).normalize(),s[5].setComponents(l-c,m-p,h-x,E-y).normalize();else if(s[4].setComponents(l-c,m-p,h-x,E-y).normalize(),t===Zn)s[5].setComponents(l+c,m+p,h+x,E+y).normalize();else if(t===da)s[5].setComponents(c,p,x,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Oi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Oi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Oi)}intersectsSprite(e){Oi.center.set(0,0,0);const t=hf.distanceTo(e.center);return Oi.radius=.7071067811865476+t,Oi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Oi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Xr.x=s.normal.x>0?e.max.x:e.min.x,Xr.y=s.normal.y>0?e.max.y:e.min.y,Xr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Xr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class rc extends is{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new it(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const fa=new P,pa=new P,bl=new Dt,Xs=new Pc,Yr=new Us,ja=new P,wl=new P;class Tl extends Wt{constructor(e=new Xt,t=new rc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)fa.fromBufferAttribute(t,s-1),pa.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=fa.distanceTo(pa);e.setAttribute("lineDistance",new wt(n,1))}else lt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Yr.copy(n.boundingSphere),Yr.applyMatrix4(s),Yr.radius+=r,e.ray.intersectsSphere(Yr)===!1)return;bl.copy(s).invert(),Xs.copy(e.ray).applyMatrix4(bl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,p=n.attributes.position;if(d!==null){const m=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=m,x=g-1;_<x;_+=l){const h=d.getX(_),M=d.getX(_+1),v=qr(this,e,Xs,c,h,M,_);v&&t.push(v)}if(this.isLineLoop){const _=d.getX(g-1),x=d.getX(m),h=qr(this,e,Xs,c,_,x,g-1);h&&t.push(h)}}else{const m=Math.max(0,a.start),g=Math.min(p.count,a.start+a.count);for(let _=m,x=g-1;_<x;_+=l){const h=qr(this,e,Xs,c,_,_+1,_);h&&t.push(h)}if(this.isLineLoop){const _=qr(this,e,Xs,c,g-1,m,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function qr(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(fa.fromBufferAttribute(o,s),pa.fromBufferAttribute(o,r),t.distanceSqToSegment(fa,pa,ja,wl)>n)return;ja.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(ja);if(!(l<e.near||l>e.far))return{distance:l,point:wl.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class Jt extends hn{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class qh extends hn{constructor(e,t,n=ji,s,r,a,o=wn,c=wn,l,d=hr,u=1){if(d!==hr&&d!==dr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const p={width:e,height:t,depth:u};super(p,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Rc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Zh extends hn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class tn extends Xt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new P,d=new Ie;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,p=3;u<=t;u++,p+=3){const m=n+u/t*s;l.x=e*Math.cos(m),l.y=e*Math.sin(m),a.push(l.x,l.y,l.z),o.push(0,0,1),d.x=(a[p]/e+1)/2,d.y=(a[p+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new wt(a,3)),this.setAttribute("normal",new wt(o,3)),this.setAttribute("uv",new wt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ut extends Xt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],p=[],m=[];let g=0;const _=[],x=n/2;let h=0;M(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new wt(u,3)),this.setAttribute("normal",new wt(p,3)),this.setAttribute("uv",new wt(m,2));function M(){const y=new P,E=new P;let T=0;const R=(t-e)/n;for(let C=0;C<=r;C++){const b=[],S=C/r,L=S*(t-e)+e;for(let U=0;U<=s;U++){const H=U/s,te=H*c+o,ne=Math.sin(te),W=Math.cos(te);E.x=L*ne,E.y=-S*n+x,E.z=L*W,u.push(E.x,E.y,E.z),y.set(ne,R,W).normalize(),p.push(y.x,y.y,y.z),m.push(H,1-S),b.push(g++)}_.push(b)}for(let C=0;C<s;C++)for(let b=0;b<r;b++){const S=_[b][C],L=_[b+1][C],U=_[b+1][C+1],H=_[b][C+1];(e>0||b!==0)&&(d.push(S,L,H),T+=3),(t>0||b!==r-1)&&(d.push(L,U,H),T+=3)}l.addGroup(h,T,0),h+=T}function v(y){const E=g,T=new Ie,R=new P;let C=0;const b=y===!0?e:t,S=y===!0?1:-1;for(let U=1;U<=s;U++)u.push(0,x*S,0),p.push(0,S,0),m.push(.5,.5),g++;const L=g;for(let U=0;U<=s;U++){const te=U/s*c+o,ne=Math.cos(te),W=Math.sin(te);R.x=b*W,R.y=x*S,R.z=b*ne,u.push(R.x,R.y,R.z),p.push(0,S,0),T.x=ne*.5+.5,T.y=W*.5*S+.5,m.push(T.x,T.y),g++}for(let U=0;U<s;U++){const H=E+U,te=L+U;y===!0?d.push(te,te+1,H):d.push(te+1,te,H),C+=3}l.addGroup(h,C,y===!0?1:2),h+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ut(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class $i extends ut{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new $i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Sa extends Xt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),l(n),d(),this.setAttribute("position",new wt(r,3)),this.setAttribute("normal",new wt(r.slice(),3)),this.setAttribute("uv",new wt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(M){const v=new P,y=new P,E=new P;for(let T=0;T<t.length;T+=3)m(t[T+0],v),m(t[T+1],y),m(t[T+2],E),c(v,y,E,M)}function c(M,v,y,E){const T=E+1,R=[];for(let C=0;C<=T;C++){R[C]=[];const b=M.clone().lerp(y,C/T),S=v.clone().lerp(y,C/T),L=T-C;for(let U=0;U<=L;U++)U===0&&C===T?R[C][U]=b:R[C][U]=b.clone().lerp(S,U/L)}for(let C=0;C<T;C++)for(let b=0;b<2*(T-C)-1;b++){const S=Math.floor(b/2);b%2===0?(p(R[C][S+1]),p(R[C+1][S]),p(R[C][S])):(p(R[C][S+1]),p(R[C+1][S+1]),p(R[C+1][S]))}}function l(M){const v=new P;for(let y=0;y<r.length;y+=3)v.x=r[y+0],v.y=r[y+1],v.z=r[y+2],v.normalize().multiplyScalar(M),r[y+0]=v.x,r[y+1]=v.y,r[y+2]=v.z}function d(){const M=new P;for(let v=0;v<r.length;v+=3){M.x=r[v+0],M.y=r[v+1],M.z=r[v+2];const y=x(M)/2/Math.PI+.5,E=h(M)/Math.PI+.5;a.push(y,1-E)}g(),u()}function u(){for(let M=0;M<a.length;M+=6){const v=a[M+0],y=a[M+2],E=a[M+4],T=Math.max(v,y,E),R=Math.min(v,y,E);T>.9&&R<.1&&(v<.2&&(a[M+0]+=1),y<.2&&(a[M+2]+=1),E<.2&&(a[M+4]+=1))}}function p(M){r.push(M.x,M.y,M.z)}function m(M,v){const y=M*3;v.x=e[y+0],v.y=e[y+1],v.z=e[y+2]}function g(){const M=new P,v=new P,y=new P,E=new P,T=new Ie,R=new Ie,C=new Ie;for(let b=0,S=0;b<r.length;b+=9,S+=6){M.set(r[b+0],r[b+1],r[b+2]),v.set(r[b+3],r[b+4],r[b+5]),y.set(r[b+6],r[b+7],r[b+8]),T.set(a[S+0],a[S+1]),R.set(a[S+2],a[S+3]),C.set(a[S+4],a[S+5]),E.copy(M).add(v).add(y).divideScalar(3);const L=x(E);_(T,S+0,M,L),_(R,S+2,v,L),_(C,S+4,y,L)}}function _(M,v,y,E){E<0&&M.x===1&&(a[v]=M.x-1),y.x===0&&y.z===0&&(a[v]=E/2/Math.PI+.5)}function x(M){return Math.atan2(M.z,-M.x)}function h(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Sa(e.vertices,e.indices,e.radius,e.details)}}class Uc extends Sa{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Uc(e.radius,e.detail)}}class Qn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){lt("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const d=n[s],p=n[s+1]-d,m=(a-d)/p;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new Ie:new P);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new P,s=[],r=[],a=[],o=new P,c=new Dt;for(let m=0;m<=e;m++){const g=m/e;s[m]=this.getTangentAt(g,new P)}r[0]=new P,a[0]=new P;let l=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),p=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),p<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(vt(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(c.makeRotationAxis(o,g))}a[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(vt(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(m=-m);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],m*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Fc extends Qn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new Ie){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),p=c-this.aX,m=l-this.aY;c=p*d-m*u+this.aX,l=p*u+m*d+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class df extends Fc{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Nc(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,d,u){let p=(a-r)/l-(o-r)/(l+d)+(o-a)/d,m=(o-a)/d-(c-a)/(d+u)+(c-o)/u;p*=d,m*=d,s(a,o,p,m)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const Zr=new P,Qa=new Nc,eo=new Nc,to=new Nc;class uf extends Qn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,d;this.closed||o>0?l=s[(o-1)%r]:(Zr.subVectors(s[0],s[1]).add(s[0]),l=Zr);const u=s[o%r],p=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(Zr.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=Zr),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),m),_=Math.pow(u.distanceToSquared(p),m),x=Math.pow(p.distanceToSquared(d),m);_<1e-4&&(_=1),g<1e-4&&(g=_),x<1e-4&&(x=_),Qa.initNonuniformCatmullRom(l.x,u.x,p.x,d.x,g,_,x),eo.initNonuniformCatmullRom(l.y,u.y,p.y,d.y,g,_,x),to.initNonuniformCatmullRom(l.z,u.z,p.z,d.z,g,_,x)}else this.curveType==="catmullrom"&&(Qa.initCatmullRom(l.x,u.x,p.x,d.x,this.tension),eo.initCatmullRom(l.y,u.y,p.y,d.y,this.tension),to.initCatmullRom(l.z,u.z,p.z,d.z,this.tension));return n.set(Qa.calc(c),eo.calc(c),to.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function El(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function ff(i,e){const t=1-i;return t*t*e}function pf(i,e){return 2*(1-i)*i*e}function mf(i,e){return i*i*e}function tr(i,e,t,n){return ff(i,e)+pf(i,t)+mf(i,n)}function xf(i,e){const t=1-i;return t*t*t*e}function gf(i,e){const t=1-i;return 3*t*t*i*e}function vf(i,e){return 3*(1-i)*i*i*e}function _f(i,e){return i*i*i*e}function nr(i,e,t,n,s){return xf(i,e)+gf(i,t)+vf(i,n)+_f(i,s)}class $h extends Qn{constructor(e=new Ie,t=new Ie,n=new Ie,s=new Ie){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Ie){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(nr(e,s.x,r.x,a.x,o.x),nr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Mf extends Qn{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(nr(e,s.x,r.x,a.x,o.x),nr(e,s.y,r.y,a.y,o.y),nr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Kh extends Qn{constructor(e=new Ie,t=new Ie){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ie){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ie){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Sf extends Qn{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Jh extends Qn{constructor(e=new Ie,t=new Ie,n=new Ie){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Ie){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(tr(e,s.x,r.x,a.x),tr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class yf extends Qn{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(tr(e,s.x,r.x,a.x),tr(e,s.y,r.y,a.y),tr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class jh extends Qn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ie){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(El(o,c.x,l.x,d.x,u.x),El(o,c.y,l.y,d.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new Ie().fromArray(s))}return this}}var Al=Object.freeze({__proto__:null,ArcCurve:df,CatmullRomCurve3:uf,CubicBezierCurve:$h,CubicBezierCurve3:Mf,EllipseCurve:Fc,LineCurve:Kh,LineCurve3:Sf,QuadraticBezierCurve:Jh,QuadraticBezierCurve3:yf,SplineCurve:jh});class bf extends Qn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Al[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const d=c[l];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Al[s.type]().fromJSON(s))}return this}}class Cl extends bf{constructor(e){super(),this.type="Path",this.currentPoint=new Ie,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Kh(this.currentPoint.clone(),new Ie(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new Jh(this.currentPoint.clone(),new Ie(e,t),new Ie(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new $h(this.currentPoint.clone(),new Ie(e,t),new Ie(n,s),new Ie(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new jh(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+l,t+d,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){const l=new Fc(e,t,n,s,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Oc extends Cl{constructor(e){super(e),this.uuid=ts(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Cl().fromJSON(s))}return this}}function wf(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Qh(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=Rf(i,e,r,t)),i.length>80*t){o=i[0],c=i[1];let d=o,u=c;for(let p=t;p<s;p+=t){const m=i[p],g=i[p+1];m<o&&(o=m),g<c&&(c=g),m>d&&(d=m),g>u&&(u=g)}l=Math.max(d-o,u-c),l=l!==0?32767/l:0}return mr(r,a,t,o,c,l,0),a}function Qh(i,e,t,n,s){let r;if(s===kf(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=Rl(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Rl(a/n|0,i[a],i[a+1],r);return r&&Ps(r,r.next)&&(gr(r),r=r.next),r}function Qi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Ps(t,t.next)||Vt(t.prev,t,t.next)===0)){if(gr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function mr(i,e,t,n,s,r,a){if(!i)return;!a&&r&&Uf(i,n,s,r);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?Ef(i,n,s,r):Tf(i)){e.push(c.i,i.i,l.i),gr(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=Af(Qi(i),e),mr(i,e,t,n,s,r,2)):a===2&&Cf(i,e,t,n,s,r):mr(Qi(i),e,t,n,s,r,1);break}}}function Tf(i){const e=i.prev,t=i,n=i.next;if(Vt(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,d=Math.min(s,r,a),u=Math.min(o,c,l),p=Math.max(s,r,a),m=Math.max(o,c,l);let g=n.next;for(;g!==e;){if(g.x>=d&&g.x<=p&&g.y>=u&&g.y<=m&&$s(s,o,r,c,a,l,g.x,g.y)&&Vt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Ef(i,e,t,n){const s=i.prev,r=i,a=i.next;if(Vt(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,d=s.y,u=r.y,p=a.y,m=Math.min(o,c,l),g=Math.min(d,u,p),_=Math.max(o,c,l),x=Math.max(d,u,p),h=ac(m,g,e,t,n),M=ac(_,x,e,t,n);let v=i.prevZ,y=i.nextZ;for(;v&&v.z>=h&&y&&y.z<=M;){if(v.x>=m&&v.x<=_&&v.y>=g&&v.y<=x&&v!==s&&v!==a&&$s(o,d,c,u,l,p,v.x,v.y)&&Vt(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=m&&y.x<=_&&y.y>=g&&y.y<=x&&y!==s&&y!==a&&$s(o,d,c,u,l,p,y.x,y.y)&&Vt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=h;){if(v.x>=m&&v.x<=_&&v.y>=g&&v.y<=x&&v!==s&&v!==a&&$s(o,d,c,u,l,p,v.x,v.y)&&Vt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=M;){if(y.x>=m&&y.x<=_&&y.y>=g&&y.y<=x&&y!==s&&y!==a&&$s(o,d,c,u,l,p,y.x,y.y)&&Vt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Af(i,e){let t=i;do{const n=t.prev,s=t.next.next;!Ps(n,s)&&td(n,t,t.next,s)&&xr(n,s)&&xr(s,n)&&(e.push(n.i,t.i,s.i),gr(t),gr(t.next),t=i=s),t=t.next}while(t!==i);return Qi(t)}function Cf(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Of(a,o)){let c=nd(a,o);a=Qi(a,a.next),c=Qi(c,c.next),mr(a,e,t,n,s,r,0),mr(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Rf(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=Qh(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Nf(l))}s.sort(Pf);for(let r=0;r<s.length;r++)t=Lf(s[r],t);return t}function Pf(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Lf(i,e){const t=Df(i,e);if(!t)return e;const n=nd(t,i);return Qi(n,n.next),Qi(t,t.next)}function Df(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(Ps(i,t))return t;do{if(Ps(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let d=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&ed(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){const u=Math.abs(s-t.y)/(n-t.x);xr(t,i)&&(u<d||u===d&&(t.x>a.x||t.x===a.x&&If(a,t)))&&(a=t,d=u)}t=t.next}while(t!==o);return a}function If(i,e){return Vt(i.prev,i,e.prev)<0&&Vt(e.next,i,i.next)<0}function Uf(i,e,t,n){let s=i;do s.z===0&&(s.z=ac(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Ff(s)}function Ff(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function ac(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Nf(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function ed(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function $s(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&ed(i,e,t,n,s,r,a,o)}function Of(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Bf(i,e)&&(xr(i,e)&&xr(e,i)&&zf(i,e)&&(Vt(i.prev,i,e.prev)||Vt(i,e.prev,e))||Ps(i,e)&&Vt(i.prev,i,i.next)>0&&Vt(e.prev,e,e.next)>0)}function Vt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Ps(i,e){return i.x===e.x&&i.y===e.y}function td(i,e,t,n){const s=Kr(Vt(i,e,t)),r=Kr(Vt(i,e,n)),a=Kr(Vt(t,n,i)),o=Kr(Vt(t,n,e));return!!(s!==r&&a!==o||s===0&&$r(i,t,e)||r===0&&$r(i,n,e)||a===0&&$r(t,i,n)||o===0&&$r(t,e,n))}function $r(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Kr(i){return i>0?1:i<0?-1:0}function Bf(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&td(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function xr(i,e){return Vt(i.prev,i,i.next)<0?Vt(i,e,i.next)>=0&&Vt(i,i.prev,e)>=0:Vt(i,e,i.prev)<0||Vt(i,i.next,e)<0}function zf(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function nd(i,e){const t=oc(i.i,i.x,i.y),n=oc(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Rl(i,e,t,n){const s=oc(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function gr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function oc(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function kf(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Vf{static triangulate(e,t,n=2){return wf(e,t,n)}}class ir{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return ir.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];Pl(e),Ll(n,e);let a=e.length;t.forEach(Pl);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,Ll(n,t[c]);const o=Vf.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function Pl(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Ll(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class ya extends Sa{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ya(e.radius,e.detail)}}class Bt extends Xt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,u=e/o,p=t/c,m=[],g=[],_=[],x=[];for(let h=0;h<d;h++){const M=h*p-a;for(let v=0;v<l;v++){const y=v*u-r;g.push(y,-M,0),_.push(0,0,1),x.push(v/o),x.push(1-h/c)}}for(let h=0;h<c;h++)for(let M=0;M<o;M++){const v=M+l*h,y=M+l*(h+1),E=M+1+l*(h+1),T=M+1+l*h;m.push(v,y,T),m.push(y,E,T)}this.setIndex(m),this.setAttribute("position",new wt(g,3)),this.setAttribute("normal",new wt(_,3)),this.setAttribute("uv",new wt(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bt(e.width,e.height,e.widthSegments,e.heightSegments)}}class ba extends Xt{constructor(e=new Oc([new Ie(0,.5),new Ie(-.5,-.5),new Ie(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],a=[];let o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let d=0;d<e.length;d++)l(e[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new wt(s,3)),this.setAttribute("normal",new wt(r,3)),this.setAttribute("uv",new wt(a,2));function l(d){const u=s.length/3,p=d.extractPoints(t);let m=p.shape;const g=p.holes;ir.isClockWise(m)===!1&&(m=m.reverse());for(let x=0,h=g.length;x<h;x++){const M=g[x];ir.isClockWise(M)===!0&&(g[x]=M.reverse())}const _=ir.triangulateShape(m,g);for(let x=0,h=g.length;x<h;x++){const M=g[x];m=m.concat(M)}for(let x=0,h=m.length;x<h;x++){const M=m[x];s.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let x=0,h=_.length;x<h;x++){const M=_[x],v=M[0]+u,y=M[1]+u,E=M[2]+u;n.push(v,y,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Gf(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];n.push(a)}return new ba(n,e.curveSegments)}}function Gf(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class Gt extends Xt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const d=[],u=new P,p=new P,m=[],g=[],_=[],x=[];for(let h=0;h<=n;h++){const M=[],v=h/n;let y=0;h===0&&a===0?y=.5/t:h===n&&c===Math.PI&&(y=-.5/t);for(let E=0;E<=t;E++){const T=E/t;u.x=-e*Math.cos(s+T*r)*Math.sin(a+v*o),u.y=e*Math.cos(a+v*o),u.z=e*Math.sin(s+T*r)*Math.sin(a+v*o),g.push(u.x,u.y,u.z),p.copy(u).normalize(),_.push(p.x,p.y,p.z),x.push(T+y,1-v),M.push(l++)}d.push(M)}for(let h=0;h<n;h++)for(let M=0;M<t;M++){const v=d[h][M+1],y=d[h][M],E=d[h+1][M],T=d[h+1][M+1];(h!==0||a>0)&&m.push(v,y,T),(h!==n-1||c<Math.PI)&&m.push(y,E,T)}this.setIndex(m),this.setAttribute("position",new wt(g,3)),this.setAttribute("normal",new wt(_,3)),this.setAttribute("uv",new wt(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ls extends Xt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],d=new P,u=new P,p=new P;for(let m=0;m<=n;m++)for(let g=0;g<=s;g++){const _=g/s*r,x=m/n*Math.PI*2;u.x=(e+t*Math.cos(x))*Math.cos(_),u.y=(e+t*Math.cos(x))*Math.sin(_),u.z=t*Math.sin(x),o.push(u.x,u.y,u.z),d.x=e*Math.cos(_),d.y=e*Math.sin(_),p.subVectors(u,d).normalize(),c.push(p.x,p.y,p.z),l.push(g/s),l.push(m/n)}for(let m=1;m<=n;m++)for(let g=1;g<=s;g++){const _=(s+1)*m+g-1,x=(s+1)*(m-1)+g-1,h=(s+1)*(m-1)+g,M=(s+1)*m+g;a.push(_,x,M),a.push(x,h,M)}this.setIndex(a),this.setAttribute("position",new wt(o,3)),this.setAttribute("normal",new wt(c,3)),this.setAttribute("uv",new wt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ls(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Hf extends cn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class q extends is{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new it(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new it(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ac,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Wf extends is{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new it(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new it(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ac,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gn,this.combine=gc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Xf extends is{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=lu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Yf extends is{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Bc extends Wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new it(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class qf extends Bc{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Wt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new it(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const no=new Dt,Dl=new P,Il=new P;class id{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ie(512,512),this.mapType=jn,this.map=null,this.mapPass=null,this.matrix=new Dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ic,this._frameExtents=new Ie(1,1),this._viewportCount=1,this._viewports=[new Nt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Dl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Dl),Il.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Il),t.updateMatrixWorld(),no.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(no,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(no)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Ul=new Dt,Ys=new P,io=new P;class Zf extends id{constructor(){super(new bn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ie(4,2),this._viewportCount=6,this._viewports=[new Nt(2,1,1,1),new Nt(0,1,1,1),new Nt(3,1,1,1),new Nt(1,1,1,1),new Nt(3,0,1,1),new Nt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ys.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ys),io.copy(n.position),io.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(io),n.updateMatrixWorld(),s.makeTranslation(-Ys.x,-Ys.y,-Ys.z),Ul.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ul,n.coordinateSystem,n.reversedDepth)}}class zc extends Bc{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Zf}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class kc extends Hh{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class $f extends id{constructor(){super(new kc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class so extends Bc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Wt.DEFAULT_UP),this.updateMatrix(),this.target=new Wt,this.shadow=new $f}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Kf extends bn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class sd{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const Fl=new Dt;class Jf{constructor(e,t,n=0,s=1/0){this.ray=new Pc(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Lc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ht("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Fl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Fl),this}intersectObject(e,t=!0,n=[]){return cc(e,this,n,t),n.sort(Nl),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)cc(e[s],this,n,t);return n.sort(Nl),n}}function Nl(i,e){return i.distance-e.distance}function cc(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)cc(r[a],e,t,!0)}}function Ol(i,e,t,n){const s=jf(n);switch(t){case Uh:return i*e;case yc:return i*e/s.components*s.byteLength;case bc:return i*e/s.components*s.byteLength;case wc:return i*e*2/s.components*s.byteLength;case Tc:return i*e*2/s.components*s.byteLength;case Fh:return i*e*3/s.components*s.byteLength;case Bn:return i*e*4/s.components*s.byteLength;case Ec:return i*e*4/s.components*s.byteLength;case na:case ia:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case sa:case ra:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Do:case Uo:return Math.max(i,16)*Math.max(e,8)/4;case Lo:case Io:return Math.max(i,8)*Math.max(e,8)/2;case Fo:case No:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Oo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Bo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case zo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ko:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Vo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Go:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ho:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Wo:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Xo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Yo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case qo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Zo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case $o:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ko:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Jo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case jo:case Qo:case ec:return Math.ceil(i/4)*Math.ceil(e/4)*16;case tc:case nc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ic:case sc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function jf(i){switch(i){case jn:case Ph:return{byteLength:1,components:1};case cr:case Lh:case Kn:return{byteLength:2,components:1};case Mc:case Sc:return{byteLength:2,components:4};case ji:case _c:case qn:return{byteLength:4,components:1};case Dh:case Ih:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xc}}));typeof window<"u"&&(window.__THREE__?lt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xc);function rd(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Qf(i){const e=new WeakMap;function t(o,c){const l=o.array,d=o.usage,u=l.byteLength,p=i.createBuffer();i.bindBuffer(c,p),i.bufferData(c,l,d),o.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)m=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:p,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const d=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,d);else{u.sort((m,g)=>m.start-g.start);let p=0;for(let m=1;m<u.length;m++){const g=u[p],_=u[m];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++p,u[p]=_)}u.length=p+1;for(let m=0,g=u.length;m<g;m++){const _=u[m];i.bufferSubData(l,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var e0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,t0=`#ifdef USE_ALPHAHASH
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
#endif`,n0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,i0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,s0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,r0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,a0=`#ifdef USE_AOMAP
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
#endif`,o0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,c0=`#ifdef USE_BATCHING
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
#endif`,l0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,h0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,d0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,u0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,f0=`#ifdef USE_IRIDESCENCE
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
#endif`,p0=`#ifdef USE_BUMPMAP
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
#endif`,m0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,x0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,g0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,v0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,M0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,S0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,y0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,b0=`#define PI 3.141592653589793
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
} // validated`,w0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,T0=`vec3 transformedNormal = objectNormal;
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
#endif`,E0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,A0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,C0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,R0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,P0="gl_FragColor = linearToOutputTexel( gl_FragColor );",L0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,D0=`#ifdef USE_ENVMAP
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
#endif`,I0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,U0=`#ifdef USE_ENVMAP
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
#endif`,F0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,N0=`#ifdef USE_ENVMAP
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
#endif`,O0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,B0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,z0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,k0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,V0=`#ifdef USE_GRADIENTMAP
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
}`,G0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,H0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,W0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,X0=`uniform bool receiveShadow;
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
#endif`,Y0=`#ifdef USE_ENVMAP
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
#endif`,q0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Z0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,K0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,J0=`PhysicalMaterial material;
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
#endif`,j0=`uniform sampler2D dfgLUT;
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
}`,Q0=`
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
#endif`,ep=`#if defined( RE_IndirectDiffuse )
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
#endif`,tp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,np=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ip=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ap=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,op=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,cp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,lp=`#if defined( USE_POINTS_UV )
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
#endif`,hp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,dp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,up=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,fp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,pp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mp=`#ifdef USE_MORPHTARGETS
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
#endif`,xp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,vp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,_p=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Sp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,yp=`#ifdef USE_NORMALMAP
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
#endif`,bp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,wp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Tp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ep=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ap=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Cp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Rp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Pp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Lp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Dp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ip=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Up=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Fp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Np=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Op=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Bp=`float getShadowMask() {
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
}`,zp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,kp=`#ifdef USE_SKINNING
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
#endif`,Vp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Gp=`#ifdef USE_SKINNING
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
#endif`,Hp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Wp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Xp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Yp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,qp=`#ifdef USE_TRANSMISSION
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
#endif`,Zp=`#ifdef USE_TRANSMISSION
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
#endif`,$p=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Kp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Qp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,em=`uniform sampler2D t2D;
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
}`,tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,im=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rm=`#include <common>
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
}`,am=`#if DEPTH_PACKING == 3200
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
}`,om=`#define DISTANCE
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
}`,cm=`#define DISTANCE
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
}`,lm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dm=`uniform float scale;
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
}`,um=`uniform vec3 diffuse;
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
}`,fm=`#include <common>
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
}`,pm=`uniform vec3 diffuse;
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
}`,mm=`#define LAMBERT
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
}`,xm=`#define LAMBERT
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
}`,gm=`#define MATCAP
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
}`,vm=`#define MATCAP
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
}`,_m=`#define NORMAL
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
}`,Mm=`#define NORMAL
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
}`,Sm=`#define PHONG
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
}`,ym=`#define PHONG
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
}`,bm=`#define STANDARD
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
}`,wm=`#define STANDARD
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
}`,Tm=`#define TOON
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
}`,Em=`#define TOON
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
}`,Am=`uniform float size;
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
}`,Cm=`uniform vec3 diffuse;
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
}`,Rm=`#include <common>
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
}`,Pm=`uniform vec3 color;
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
}`,Lm=`uniform float rotation;
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
}`,Dm=`uniform vec3 diffuse;
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
}`,xt={alphahash_fragment:e0,alphahash_pars_fragment:t0,alphamap_fragment:n0,alphamap_pars_fragment:i0,alphatest_fragment:s0,alphatest_pars_fragment:r0,aomap_fragment:a0,aomap_pars_fragment:o0,batching_pars_vertex:c0,batching_vertex:l0,begin_vertex:h0,beginnormal_vertex:d0,bsdfs:u0,iridescence_fragment:f0,bumpmap_pars_fragment:p0,clipping_planes_fragment:m0,clipping_planes_pars_fragment:x0,clipping_planes_pars_vertex:g0,clipping_planes_vertex:v0,color_fragment:_0,color_pars_fragment:M0,color_pars_vertex:S0,color_vertex:y0,common:b0,cube_uv_reflection_fragment:w0,defaultnormal_vertex:T0,displacementmap_pars_vertex:E0,displacementmap_vertex:A0,emissivemap_fragment:C0,emissivemap_pars_fragment:R0,colorspace_fragment:P0,colorspace_pars_fragment:L0,envmap_fragment:D0,envmap_common_pars_fragment:I0,envmap_pars_fragment:U0,envmap_pars_vertex:F0,envmap_physical_pars_fragment:Y0,envmap_vertex:N0,fog_vertex:O0,fog_pars_vertex:B0,fog_fragment:z0,fog_pars_fragment:k0,gradientmap_pars_fragment:V0,lightmap_pars_fragment:G0,lights_lambert_fragment:H0,lights_lambert_pars_fragment:W0,lights_pars_begin:X0,lights_toon_fragment:q0,lights_toon_pars_fragment:Z0,lights_phong_fragment:$0,lights_phong_pars_fragment:K0,lights_physical_fragment:J0,lights_physical_pars_fragment:j0,lights_fragment_begin:Q0,lights_fragment_maps:ep,lights_fragment_end:tp,logdepthbuf_fragment:np,logdepthbuf_pars_fragment:ip,logdepthbuf_pars_vertex:sp,logdepthbuf_vertex:rp,map_fragment:ap,map_pars_fragment:op,map_particle_fragment:cp,map_particle_pars_fragment:lp,metalnessmap_fragment:hp,metalnessmap_pars_fragment:dp,morphinstance_vertex:up,morphcolor_vertex:fp,morphnormal_vertex:pp,morphtarget_pars_vertex:mp,morphtarget_vertex:xp,normal_fragment_begin:gp,normal_fragment_maps:vp,normal_pars_fragment:_p,normal_pars_vertex:Mp,normal_vertex:Sp,normalmap_pars_fragment:yp,clearcoat_normal_fragment_begin:bp,clearcoat_normal_fragment_maps:wp,clearcoat_pars_fragment:Tp,iridescence_pars_fragment:Ep,opaque_fragment:Ap,packing:Cp,premultiplied_alpha_fragment:Rp,project_vertex:Pp,dithering_fragment:Lp,dithering_pars_fragment:Dp,roughnessmap_fragment:Ip,roughnessmap_pars_fragment:Up,shadowmap_pars_fragment:Fp,shadowmap_pars_vertex:Np,shadowmap_vertex:Op,shadowmask_pars_fragment:Bp,skinbase_vertex:zp,skinning_pars_vertex:kp,skinning_vertex:Vp,skinnormal_vertex:Gp,specularmap_fragment:Hp,specularmap_pars_fragment:Wp,tonemapping_fragment:Xp,tonemapping_pars_fragment:Yp,transmission_fragment:qp,transmission_pars_fragment:Zp,uv_pars_fragment:$p,uv_pars_vertex:Kp,uv_vertex:Jp,worldpos_vertex:jp,background_vert:Qp,background_frag:em,backgroundCube_vert:tm,backgroundCube_frag:nm,cube_vert:im,cube_frag:sm,depth_vert:rm,depth_frag:am,distanceRGBA_vert:om,distanceRGBA_frag:cm,equirect_vert:lm,equirect_frag:hm,linedashed_vert:dm,linedashed_frag:um,meshbasic_vert:fm,meshbasic_frag:pm,meshlambert_vert:mm,meshlambert_frag:xm,meshmatcap_vert:gm,meshmatcap_frag:vm,meshnormal_vert:_m,meshnormal_frag:Mm,meshphong_vert:Sm,meshphong_frag:ym,meshphysical_vert:bm,meshphysical_frag:wm,meshtoon_vert:Tm,meshtoon_frag:Em,points_vert:Am,points_frag:Cm,shadow_vert:Rm,shadow_frag:Pm,sprite_vert:Lm,sprite_frag:Dm},Ue={common:{diffuse:{value:new it(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new pt}},envmap:{envMap:{value:null},envMapRotation:{value:new pt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new pt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new pt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new pt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new pt},normalScale:{value:new Ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new pt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new pt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new pt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new pt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new it(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new it(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0},uvTransform:{value:new pt}},sprite:{diffuse:{value:new it(16777215)},opacity:{value:1},center:{value:new Ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new pt},alphaMap:{value:null},alphaMapTransform:{value:new pt},alphaTest:{value:0}}},Xn={basic:{uniforms:pn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:xt.meshbasic_vert,fragmentShader:xt.meshbasic_frag},lambert:{uniforms:pn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new it(0)}}]),vertexShader:xt.meshlambert_vert,fragmentShader:xt.meshlambert_frag},phong:{uniforms:pn([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new it(0)},specular:{value:new it(1118481)},shininess:{value:30}}]),vertexShader:xt.meshphong_vert,fragmentShader:xt.meshphong_frag},standard:{uniforms:pn([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new it(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:xt.meshphysical_vert,fragmentShader:xt.meshphysical_frag},toon:{uniforms:pn([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new it(0)}}]),vertexShader:xt.meshtoon_vert,fragmentShader:xt.meshtoon_frag},matcap:{uniforms:pn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:xt.meshmatcap_vert,fragmentShader:xt.meshmatcap_frag},points:{uniforms:pn([Ue.points,Ue.fog]),vertexShader:xt.points_vert,fragmentShader:xt.points_frag},dashed:{uniforms:pn([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:xt.linedashed_vert,fragmentShader:xt.linedashed_frag},depth:{uniforms:pn([Ue.common,Ue.displacementmap]),vertexShader:xt.depth_vert,fragmentShader:xt.depth_frag},normal:{uniforms:pn([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:xt.meshnormal_vert,fragmentShader:xt.meshnormal_frag},sprite:{uniforms:pn([Ue.sprite,Ue.fog]),vertexShader:xt.sprite_vert,fragmentShader:xt.sprite_frag},background:{uniforms:{uvTransform:{value:new pt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:xt.background_vert,fragmentShader:xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new pt}},vertexShader:xt.backgroundCube_vert,fragmentShader:xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:xt.cube_vert,fragmentShader:xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:xt.equirect_vert,fragmentShader:xt.equirect_frag},distanceRGBA:{uniforms:pn([Ue.common,Ue.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:xt.distanceRGBA_vert,fragmentShader:xt.distanceRGBA_frag},shadow:{uniforms:pn([Ue.lights,Ue.fog,{color:{value:new it(0)},opacity:{value:1}}]),vertexShader:xt.shadow_vert,fragmentShader:xt.shadow_frag}};Xn.physical={uniforms:pn([Xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new pt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new pt},clearcoatNormalScale:{value:new Ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new pt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new pt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new pt},sheen:{value:0},sheenColor:{value:new it(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new pt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new pt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new pt},transmissionSamplerSize:{value:new Ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new pt},attenuationDistance:{value:0},attenuationColor:{value:new it(0)},specularColor:{value:new it(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new pt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new pt},anisotropyVector:{value:new Ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new pt}}]),vertexShader:xt.meshphysical_vert,fragmentShader:xt.meshphysical_frag};const Jr={r:0,b:0,g:0},Bi=new Gn,Im=new Dt;function Um(i,e,t,n,s,r,a){const o=new it(0);let c=r===!0?0:1,l,d,u=null,p=0,m=null;function g(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?t:e).get(y)),y}function _(v){let y=!1;const E=g(v);E===null?h(o,c):E&&E.isColor&&(h(E,1),y=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(v,y){const E=g(y);E&&(E.isCubeTexture||E.mapping===Ma)?(d===void 0&&(d=new V(new Le(1,1,1),new cn({name:"BackgroundCubeMaterial",uniforms:Rs(Xn.backgroundCube.uniforms),vertexShader:Xn.backgroundCube.vertexShader,fragmentShader:Xn.backgroundCube.fragmentShader,side:ln,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,R,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Bi.copy(y.backgroundRotation),Bi.x*=-1,Bi.y*=-1,Bi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Bi.y*=-1,Bi.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Im.makeRotationFromEuler(Bi)),d.material.toneMapped=Et.getTransfer(E.colorSpace)!==Ft,(u!==E||p!==E.version||m!==i.toneMapping)&&(d.material.needsUpdate=!0,u=E,p=E.version,m=i.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new V(new Bt(2,2),new cn({name:"BackgroundMaterial",uniforms:Rs(Xn.background.uniforms),vertexShader:Xn.background.vertexShader,fragmentShader:Xn.background.fragmentShader,side:Pi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=Et.getTransfer(E.colorSpace)!==Ft,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||p!==E.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,u=E,p=E.version,m=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function h(v,y){v.getRGB(Jr,Gh(i)),n.buffers.color.setClear(Jr.r,Jr.g,Jr.b,y,a)}function M(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,y=1){o.set(v),c=y,h(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,h(o,c)},render:_,addToRenderList:x,dispose:M}}function Fm(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=p(null);let r=s,a=!1;function o(S,L,U,H,te){let ne=!1;const W=u(H,U,L);r!==W&&(r=W,l(r.object)),ne=m(S,H,U,te),ne&&g(S,H,U,te),te!==null&&e.update(te,i.ELEMENT_ARRAY_BUFFER),(ne||a)&&(a=!1,y(S,L,U,H),te!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(te).buffer))}function c(){return i.createVertexArray()}function l(S){return i.bindVertexArray(S)}function d(S){return i.deleteVertexArray(S)}function u(S,L,U){const H=U.wireframe===!0;let te=n[S.id];te===void 0&&(te={},n[S.id]=te);let ne=te[L.id];ne===void 0&&(ne={},te[L.id]=ne);let W=ne[H];return W===void 0&&(W=p(c()),ne[H]=W),W}function p(S){const L=[],U=[],H=[];for(let te=0;te<t;te++)L[te]=0,U[te]=0,H[te]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:U,attributeDivisors:H,object:S,attributes:{},index:null}}function m(S,L,U,H){const te=r.attributes,ne=L.attributes;let W=0;const Q=U.getAttributes();for(const ie in Q)if(Q[ie].location>=0){const fe=te[ie];let ze=ne[ie];if(ze===void 0&&(ie==="instanceMatrix"&&S.instanceMatrix&&(ze=S.instanceMatrix),ie==="instanceColor"&&S.instanceColor&&(ze=S.instanceColor)),fe===void 0||fe.attribute!==ze||ze&&fe.data!==ze.data)return!0;W++}return r.attributesNum!==W||r.index!==H}function g(S,L,U,H){const te={},ne=L.attributes;let W=0;const Q=U.getAttributes();for(const ie in Q)if(Q[ie].location>=0){let fe=ne[ie];fe===void 0&&(ie==="instanceMatrix"&&S.instanceMatrix&&(fe=S.instanceMatrix),ie==="instanceColor"&&S.instanceColor&&(fe=S.instanceColor));const ze={};ze.attribute=fe,fe&&fe.data&&(ze.data=fe.data),te[ie]=ze,W++}r.attributes=te,r.attributesNum=W,r.index=H}function _(){const S=r.newAttributes;for(let L=0,U=S.length;L<U;L++)S[L]=0}function x(S){h(S,0)}function h(S,L){const U=r.newAttributes,H=r.enabledAttributes,te=r.attributeDivisors;U[S]=1,H[S]===0&&(i.enableVertexAttribArray(S),H[S]=1),te[S]!==L&&(i.vertexAttribDivisor(S,L),te[S]=L)}function M(){const S=r.newAttributes,L=r.enabledAttributes;for(let U=0,H=L.length;U<H;U++)L[U]!==S[U]&&(i.disableVertexAttribArray(U),L[U]=0)}function v(S,L,U,H,te,ne,W){W===!0?i.vertexAttribIPointer(S,L,U,te,ne):i.vertexAttribPointer(S,L,U,H,te,ne)}function y(S,L,U,H){_();const te=H.attributes,ne=U.getAttributes(),W=L.defaultAttributeValues;for(const Q in ne){const ie=ne[Q];if(ie.location>=0){let de=te[Q];if(de===void 0&&(Q==="instanceMatrix"&&S.instanceMatrix&&(de=S.instanceMatrix),Q==="instanceColor"&&S.instanceColor&&(de=S.instanceColor)),de!==void 0){const fe=de.normalized,ze=de.itemSize,I=e.get(de);if(I===void 0)continue;const ye=I.buffer,Me=I.type,Se=I.bytesPerElement,$=Me===i.INT||Me===i.UNSIGNED_INT||de.gpuType===_c;if(de.isInterleavedBufferAttribute){const K=de.data,_e=K.stride,be=de.offset;if(K.isInstancedInterleavedBuffer){for(let Re=0;Re<ie.locationSize;Re++)h(ie.location+Re,K.meshPerAttribute);S.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Re=0;Re<ie.locationSize;Re++)x(ie.location+Re);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let Re=0;Re<ie.locationSize;Re++)v(ie.location+Re,ze/ie.locationSize,Me,fe,_e*Se,(be+ze/ie.locationSize*Re)*Se,$)}else{if(de.isInstancedBufferAttribute){for(let K=0;K<ie.locationSize;K++)h(ie.location+K,de.meshPerAttribute);S.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let K=0;K<ie.locationSize;K++)x(ie.location+K);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let K=0;K<ie.locationSize;K++)v(ie.location+K,ze/ie.locationSize,Me,fe,ze*Se,ze/ie.locationSize*K*Se,$)}}else if(W!==void 0){const fe=W[Q];if(fe!==void 0)switch(fe.length){case 2:i.vertexAttrib2fv(ie.location,fe);break;case 3:i.vertexAttrib3fv(ie.location,fe);break;case 4:i.vertexAttrib4fv(ie.location,fe);break;default:i.vertexAttrib1fv(ie.location,fe)}}}}M()}function E(){C();for(const S in n){const L=n[S];for(const U in L){const H=L[U];for(const te in H)d(H[te].object),delete H[te];delete L[U]}delete n[S]}}function T(S){if(n[S.id]===void 0)return;const L=n[S.id];for(const U in L){const H=L[U];for(const te in H)d(H[te].object),delete H[te];delete L[U]}delete n[S.id]}function R(S){for(const L in n){const U=n[L];if(U[S.id]===void 0)continue;const H=U[S.id];for(const te in H)d(H[te].object),delete H[te];delete U[S.id]}}function C(){b(),a=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:b,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:x,disableUnusedAttributes:M}}function Nm(i,e,t){let n;function s(l){n=l}function r(l,d){i.drawArrays(n,l,d),t.update(d,n,1)}function a(l,d,u){u!==0&&(i.drawArraysInstanced(n,l,d,u),t.update(d,n,u))}function o(l,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,u);let m=0;for(let g=0;g<u;g++)m+=d[g];t.update(m,n,1)}function c(l,d,u,p){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<l.length;g++)a(l[g],d[g],p[g]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,d,0,p,0,u);let g=0;for(let _=0;_<u;_++)g+=d[_]*p[_];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Om(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==Bn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const C=R===Kn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==jn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==qn&&!C)}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const d=c(l);d!==l&&(lt("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),h=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:p,maxTextures:m,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:x,maxAttributes:h,maxVertexUniforms:M,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:E,maxSamples:T}}function Bm(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new ki,o=new pt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,p){const m=u.length!==0||p||n!==0||s;return s=p,n=u.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,p){t=d(u,p,0)},this.setState=function(u,p,m){const g=u.clippingPlanes,_=u.clipIntersection,x=u.clipShadows,h=i.get(u);if(!s||g===null||g.length===0||r&&!x)r?d(null):l();else{const M=r?0:n,v=M*4;let y=h.clippingState||null;c.value=y,y=d(g,p,v,m);for(let E=0;E!==v;++E)y[E]=t[E];h.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(u,p,m,g){const _=u!==null?u.length:0;let x=null;if(_!==0){if(x=c.value,g!==!0||x===null){const h=m+_*4,M=p.matrixWorldInverse;o.getNormalMatrix(M),(x===null||x.length<h)&&(x=new Float32Array(h));for(let v=0,y=m;v!==_;++v,y+=4)a.copy(u[v]).applyMatrix4(M,o),a.normal.toArray(x,y),x[y+3]=a.constant}c.value=x,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,x}}function zm(i){let e=new WeakMap;function t(a,o){return o===Co?a.mapping=Es:o===Ro&&(a.mapping=As),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Co||o===Ro)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new rf(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Ei=4,Bl=[.125,.215,.35,.446,.526,.582],Xi=20,km=256,qs=new kc,zl=new it;let ro=null,ao=0,oo=0,co=!1;const Vm=new P;class lc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Vm}=r;ro=this._renderer.getRenderTarget(),ao=this._renderer.getActiveCubeFace(),oo=this._renderer.getActiveMipmapLevel(),co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ro,ao,oo),this._renderer.xr.enabled=co,e.scissorTest=!1,vs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Es||e.mapping===As?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ro=this._renderer.getRenderTarget(),ao=this._renderer.getActiveCubeFace(),oo=this._renderer.getActiveMipmapLevel(),co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Pn,minFilter:Pn,generateMipmaps:!1,type:Kn,format:Bn,colorSpace:Cs,depthBuffer:!1},s=kl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=kl(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Gm(r)),this._blurMaterial=Wm(r,e,t),this._ggxMaterial=Hm(r,e,t)}return s}_compileMaterial(e){const t=new V(new Xt,e);this._renderer.compile(t,qs)}_sceneToCubeUV(e,t,n,s,r){const c=new bn(90,1,t,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,p=u.autoClear,m=u.toneMapping;u.getClearColor(zl),u.toneMapping=Ci,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new V(new Le,new At({name:"PMREM.Background",side:ln,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,x=_.material;let h=!1;const M=e.background;M?M.isColor&&(x.color.copy(M),e.background=null,h=!0):(x.color.copy(zl),h=!0);for(let v=0;v<6;v++){const y=v%3;y===0?(c.up.set(0,l[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[v],r.y,r.z)):y===1?(c.up.set(0,0,l[v]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[v],r.z)):(c.up.set(0,l[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[v]));const E=this._cubeSize;vs(s,y*E,v>2?E:0,E,E),u.setRenderTarget(s),h&&u.render(_,c),u.render(e,c)}u.toneMapping=m,u.autoClear=p,e.background=M}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Es||e.mapping===As;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;vs(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,qs)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),u=Math.sqrt(l*l-d*d),p=.05+l*.95,m=u*p,{_lodMax:g}=this,_=this._sizeLods[n],x=3*_*(n>g-Ei?n-g+Ei:0),h=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=g-t,vs(r,x,h,3*_,2*_),s.setRenderTarget(r),s.render(o,qs),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,vs(e,x,h,3*_,2*_),s.setRenderTarget(e),s.render(o,qs)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ht("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=l;const p=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Xi-1),_=r/g,x=isFinite(r)?1+Math.floor(d*_):Xi;x>Xi&&lt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${Xi}`);const h=[];let M=0;for(let R=0;R<Xi;++R){const C=R/_,b=Math.exp(-C*C/2);h.push(b),R===0?M+=b:R<x&&(M+=2*b)}for(let R=0;R<h.length;R++)h[R]=h[R]/M;p.envMap.value=e.texture,p.samples.value=x,p.weights.value=h,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:v}=this;p.dTheta.value=g,p.mipInt.value=v-n;const y=this._sizeLods[s],E=3*y*(s>v-Ei?s-v+Ei:0),T=4*(this._cubeSize-y);vs(t,E,T,3*y,2*y),c.setRenderTarget(t),c.render(u,qs)}}function Gm(i){const e=[],t=[],n=[];let s=i;const r=i-Ei+1+Bl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-Ei?c=Bl[a-i+Ei-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),d=-l,u=1+l,p=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,g=6,_=3,x=2,h=1,M=new Float32Array(_*g*m),v=new Float32Array(x*g*m),y=new Float32Array(h*g*m);for(let T=0;T<m;T++){const R=T%3*2/3-1,C=T>2?0:-1,b=[R,C,0,R+2/3,C,0,R+2/3,C+1,0,R,C,0,R+2/3,C+1,0,R,C+1,0];M.set(b,_*g*T),v.set(p,x*g*T);const S=[T,T,T,T,T,T];y.set(S,h*g*T)}const E=new Xt;E.setAttribute("position",new kn(M,_)),E.setAttribute("uv",new kn(v,x)),E.setAttribute("faceIndex",new kn(y,h)),n.push(new V(E,null)),s>Ei&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function kl(i,e,t){const n=new zn(i,e,t);return n.texture.mapping=Ma,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function vs(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Hm(i,e,t){return new cn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:km,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:wa(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Wm(i,e,t){const n=new Float32Array(Xi),s=new P(0,1,0);return new cn({name:"SphericalGaussianBlur",defines:{n:Xi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:wa(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Vl(){return new cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:wa(),fragmentShader:`

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
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Gl(){return new cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function wa(){return`

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
	`}function Xm(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Co||c===Ro,d=c===Es||c===As;if(l||d){let u=e.get(o);const p=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return t===null&&(t=new lc(i)),u=l?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const m=o.image;return l&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new lc(i)),u=l?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Ym(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&ur("WebGLRenderer: "+n+" extension not supported."),s}}}function qm(i,e,t,n){const s={},r=new WeakMap;function a(u){const p=u.target;p.index!==null&&e.remove(p.index);for(const g in p.attributes)e.remove(p.attributes[g]);p.removeEventListener("dispose",a),delete s[p.id];const m=r.get(p);m&&(e.remove(m),r.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function o(u,p){return s[p.id]===!0||(p.addEventListener("dispose",a),s[p.id]=!0,t.memory.geometries++),p}function c(u){const p=u.attributes;for(const m in p)e.update(p[m],i.ARRAY_BUFFER)}function l(u){const p=[],m=u.index,g=u.attributes.position;let _=0;if(m!==null){const M=m.array;_=m.version;for(let v=0,y=M.length;v<y;v+=3){const E=M[v+0],T=M[v+1],R=M[v+2];p.push(E,T,T,R,R,E)}}else if(g!==void 0){const M=g.array;_=g.version;for(let v=0,y=M.length/3-1;v<y;v+=3){const E=v+0,T=v+1,R=v+2;p.push(E,T,T,R,R,E)}}else return;const x=new(Oh(p)?Vh:kh)(p,1);x.version=_;const h=r.get(u);h&&e.remove(h),r.set(u,x)}function d(u){const p=r.get(u);if(p){const m=u.index;m!==null&&p.version<m.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function Zm(i,e,t){let n;function s(p){n=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function c(p,m){i.drawElements(n,m,r,p*a),t.update(m,n,1)}function l(p,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,p*a,g),t.update(m,n,g))}function d(p,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,p,0,g);let x=0;for(let h=0;h<g;h++)x+=m[h];t.update(x,n,1)}function u(p,m,g,_){if(g===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let h=0;h<p.length;h++)l(p[h]/a,m[h],_[h]);else{x.multiDrawElementsInstancedWEBGL(n,m,0,r,p,0,_,0,g);let h=0;for(let M=0;M<g;M++)h+=m[M]*_[M];t.update(h,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function $m(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Ht("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Km(i,e,t){const n=new WeakMap,s=new Nt;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let p=n.get(o);if(p===void 0||p.count!==u){let S=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",S)};var m=S;p!==void 0&&p.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),_===!0&&(y=2),x===!0&&(y=3);let E=o.attributes.position.count*y,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const R=new Float32Array(E*T*4*u),C=new Bh(R,E,T,u);C.type=qn,C.needsUpdate=!0;const b=y*4;for(let L=0;L<u;L++){const U=h[L],H=M[L],te=v[L],ne=E*T*4*L;for(let W=0;W<U.count;W++){const Q=W*b;g===!0&&(s.fromBufferAttribute(U,W),R[ne+Q+0]=s.x,R[ne+Q+1]=s.y,R[ne+Q+2]=s.z,R[ne+Q+3]=0),_===!0&&(s.fromBufferAttribute(H,W),R[ne+Q+4]=s.x,R[ne+Q+5]=s.y,R[ne+Q+6]=s.z,R[ne+Q+7]=0),x===!0&&(s.fromBufferAttribute(te,W),R[ne+Q+8]=s.x,R[ne+Q+9]=s.y,R[ne+Q+10]=s.z,R[ne+Q+11]=te.itemSize===4?s.w:1)}}p={count:u,texture:C,size:new Ie(E,T)},n.set(o,p),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let x=0;x<l.length;x++)g+=l[x];const _=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",p.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:r}}function Jm(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,d=c.geometry,u=e.get(c,d);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==l&&(p.update(),s.set(p,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}const ad=new hn,Hl=new qh(1,1),od=new Bh,cd=new Gu,ld=new Wh,Wl=[],Xl=[],Yl=new Float32Array(16),ql=new Float32Array(9),Zl=new Float32Array(4);function Fs(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Wl[s];if(r===void 0&&(r=new Float32Array(s),Wl[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function $t(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Kt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ta(i,e){let t=Xl[e];t===void 0&&(t=new Int32Array(e),Xl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function jm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Qm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2fv(this.addr,e),Kt(t,e)}}function ex(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if($t(t,e))return;i.uniform3fv(this.addr,e),Kt(t,e)}}function tx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4fv(this.addr,e),Kt(t,e)}}function nx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Kt(t,e)}else{if($t(t,n))return;Zl.set(n),i.uniformMatrix2fv(this.addr,!1,Zl),Kt(t,n)}}function ix(i,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Kt(t,e)}else{if($t(t,n))return;ql.set(n),i.uniformMatrix3fv(this.addr,!1,ql),Kt(t,n)}}function sx(i,e){const t=this.cache,n=e.elements;if(n===void 0){if($t(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Kt(t,e)}else{if($t(t,n))return;Yl.set(n),i.uniformMatrix4fv(this.addr,!1,Yl),Kt(t,n)}}function rx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function ax(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2iv(this.addr,e),Kt(t,e)}}function ox(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($t(t,e))return;i.uniform3iv(this.addr,e),Kt(t,e)}}function cx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4iv(this.addr,e),Kt(t,e)}}function lx(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function hx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if($t(t,e))return;i.uniform2uiv(this.addr,e),Kt(t,e)}}function dx(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if($t(t,e))return;i.uniform3uiv(this.addr,e),Kt(t,e)}}function ux(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if($t(t,e))return;i.uniform4uiv(this.addr,e),Kt(t,e)}}function fx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Hl.compareFunction=Nh,r=Hl):r=ad,t.setTexture2D(e||r,s)}function px(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||cd,s)}function mx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||ld,s)}function xx(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||od,s)}function gx(i){switch(i){case 5126:return jm;case 35664:return Qm;case 35665:return ex;case 35666:return tx;case 35674:return nx;case 35675:return ix;case 35676:return sx;case 5124:case 35670:return rx;case 35667:case 35671:return ax;case 35668:case 35672:return ox;case 35669:case 35673:return cx;case 5125:return lx;case 36294:return hx;case 36295:return dx;case 36296:return ux;case 35678:case 36198:case 36298:case 36306:case 35682:return fx;case 35679:case 36299:case 36307:return px;case 35680:case 36300:case 36308:case 36293:return mx;case 36289:case 36303:case 36311:case 36292:return xx}}function vx(i,e){i.uniform1fv(this.addr,e)}function _x(i,e){const t=Fs(e,this.size,2);i.uniform2fv(this.addr,t)}function Mx(i,e){const t=Fs(e,this.size,3);i.uniform3fv(this.addr,t)}function Sx(i,e){const t=Fs(e,this.size,4);i.uniform4fv(this.addr,t)}function yx(i,e){const t=Fs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function bx(i,e){const t=Fs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function wx(i,e){const t=Fs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Tx(i,e){i.uniform1iv(this.addr,e)}function Ex(i,e){i.uniform2iv(this.addr,e)}function Ax(i,e){i.uniform3iv(this.addr,e)}function Cx(i,e){i.uniform4iv(this.addr,e)}function Rx(i,e){i.uniform1uiv(this.addr,e)}function Px(i,e){i.uniform2uiv(this.addr,e)}function Lx(i,e){i.uniform3uiv(this.addr,e)}function Dx(i,e){i.uniform4uiv(this.addr,e)}function Ix(i,e,t){const n=this.cache,s=e.length,r=Ta(t,s);$t(n,r)||(i.uniform1iv(this.addr,r),Kt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||ad,r[a])}function Ux(i,e,t){const n=this.cache,s=e.length,r=Ta(t,s);$t(n,r)||(i.uniform1iv(this.addr,r),Kt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||cd,r[a])}function Fx(i,e,t){const n=this.cache,s=e.length,r=Ta(t,s);$t(n,r)||(i.uniform1iv(this.addr,r),Kt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||ld,r[a])}function Nx(i,e,t){const n=this.cache,s=e.length,r=Ta(t,s);$t(n,r)||(i.uniform1iv(this.addr,r),Kt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||od,r[a])}function Ox(i){switch(i){case 5126:return vx;case 35664:return _x;case 35665:return Mx;case 35666:return Sx;case 35674:return yx;case 35675:return bx;case 35676:return wx;case 5124:case 35670:return Tx;case 35667:case 35671:return Ex;case 35668:case 35672:return Ax;case 35669:case 35673:return Cx;case 5125:return Rx;case 36294:return Px;case 36295:return Lx;case 36296:return Dx;case 35678:case 36198:case 36298:case 36306:case 35682:return Ix;case 35679:case 36299:case 36307:return Ux;case 35680:case 36300:case 36308:case 36293:return Fx;case 36289:case 36303:case 36311:case 36292:return Nx}}class Bx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=gx(t.type)}}class zx{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ox(t.type)}}class kx{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const lo=/(\w+)(\])?(\[|\.)?/g;function $l(i,e){i.seq.push(e),i.map[e.id]=e}function Vx(i,e,t){const n=i.name,s=n.length;for(lo.lastIndex=0;;){const r=lo.exec(n),a=lo.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){$l(t,l===void 0?new Bx(o,i,e):new zx(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new kx(o),$l(t,u)),t=u}}}class aa{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Vx(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Kl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Gx=37297;let Hx=0;function Wx(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Jl=new pt;function Xx(i){Et._getMatrix(Jl,Et.workingColorSpace,i);const e=`mat3( ${Jl.elements.map(t=>t.toFixed(4))} )`;switch(Et.getTransfer(i)){case ha:return[e,"LinearTransferOETF"];case Ft:return[e,"sRGBTransferOETF"];default:return lt("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function jl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Wx(i.getShaderSource(e),o)}else return r}function Yx(i,e){const t=Xx(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function qx(i,e){let t;switch(e){case bh:t="Linear";break;case wh:t="Reinhard";break;case Th:t="Cineon";break;case vc:t="ACESFilmic";break;case Ah:t="AgX";break;case Ch:t="Neutral";break;case Eh:t="Custom";break;default:lt("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const jr=new P;function Zx(){Et.getLuminanceCoefficients(jr);const i=jr.x.toFixed(4),e=jr.y.toFixed(4),t=jr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $x(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ks).join(`
`)}function Kx(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Jx(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ks(i){return i!==""}function Ql(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function eh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const jx=/^[ \t]*#include +<([\w\d./]+)>/gm;function hc(i){return i.replace(jx,eg)}const Qx=new Map;function eg(i,e){let t=xt[e];if(t===void 0){const n=Qx.get(e);if(n!==void 0)t=xt[n],lt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return hc(t)}const tg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function th(i){return i.replace(tg,ng)}function ng(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function nh(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function ig(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Sh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===yh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ci&&(e="SHADOWMAP_TYPE_VSM"),e}function sg(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Es:case As:e="ENVMAP_TYPE_CUBE";break;case Ma:e="ENVMAP_TYPE_CUBE_UV";break}return e}function rg(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===As&&(e="ENVMAP_MODE_REFRACTION"),e}function ag(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case gc:e="ENVMAP_BLENDING_MULTIPLY";break;case au:e="ENVMAP_BLENDING_MIX";break;case ou:e="ENVMAP_BLENDING_ADD";break}return e}function og(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function cg(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=ig(t),l=sg(t),d=rg(t),u=ag(t),p=og(t),m=$x(t),g=Kx(r),_=s.createProgram();let x,h,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ks).join(`
`),x.length>0&&(x+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ks).join(`
`),h.length>0&&(h+=`
`)):(x=[nh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ks).join(`
`),h=[nh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ci?"#define TONE_MAPPING":"",t.toneMapping!==Ci?xt.tonemapping_pars_fragment:"",t.toneMapping!==Ci?qx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",xt.colorspace_pars_fragment,Yx("linearToOutputTexel",t.outputColorSpace),Zx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ks).join(`
`)),a=hc(a),a=Ql(a,t),a=eh(a,t),o=hc(o),o=Ql(o,t),o=eh(o,t),a=th(a),o=th(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,x=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,h=["#define varying in",t.glslVersion===el?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===el?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const v=M+x+a,y=M+h+o,E=Kl(s,s.VERTEX_SHADER,v),T=Kl(s,s.FRAGMENT_SHADER,y);s.attachShader(_,E),s.attachShader(_,T),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function R(L){if(i.debug.checkShaderErrors){const U=s.getProgramInfoLog(_)||"",H=s.getShaderInfoLog(E)||"",te=s.getShaderInfoLog(T)||"",ne=U.trim(),W=H.trim(),Q=te.trim();let ie=!0,de=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(ie=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,E,T);else{const fe=jl(s,E,"vertex"),ze=jl(s,T,"fragment");Ht("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+ne+`
`+fe+`
`+ze)}else ne!==""?lt("WebGLProgram: Program Info Log:",ne):(W===""||Q==="")&&(de=!1);de&&(L.diagnostics={runnable:ie,programLog:ne,vertexShader:{log:W,prefix:x},fragmentShader:{log:Q,prefix:h}})}s.deleteShader(E),s.deleteShader(T),C=new aa(s,_),b=Jx(s,_)}let C;this.getUniforms=function(){return C===void 0&&R(this),C};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(_,Gx)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Hx++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=T,this}let lg=0;class hg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new dg(e),t.set(e,n)),n}}class dg{constructor(e){this.id=lg++,this.code=e,this.usedTimes=0}}function ug(i,e,t,n,s,r,a){const o=new Lc,c=new hg,l=new Set,d=[],u=s.logarithmicDepthBuffer,p=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function x(b,S,L,U,H){const te=U.fog,ne=H.geometry,W=b.isMeshStandardMaterial?U.environment:null,Q=(b.isMeshStandardMaterial?t:e).get(b.envMap||W),ie=Q&&Q.mapping===Ma?Q.image.height:null,de=g[b.type];b.precision!==null&&(m=s.getMaxPrecision(b.precision),m!==b.precision&&lt("WebGLProgram.getParameters:",b.precision,"not supported, using",m,"instead."));const fe=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,ze=fe!==void 0?fe.length:0;let I=0;ne.morphAttributes.position!==void 0&&(I=1),ne.morphAttributes.normal!==void 0&&(I=2),ne.morphAttributes.color!==void 0&&(I=3);let ye,Me,Se,$;if(de){const Ut=Xn[de];ye=Ut.vertexShader,Me=Ut.fragmentShader}else ye=b.vertexShader,Me=b.fragmentShader,c.update(b),Se=c.getVertexShaderID(b),$=c.getFragmentShaderID(b);const K=i.getRenderTarget(),_e=i.state.buffers.depth.getReversed(),be=H.isInstancedMesh===!0,Re=H.isBatchedMesh===!0,Ye=!!b.map,Pt=!!b.matcap,Ze=!!Q,Tt=!!b.aoMap,z=!!b.lightMap,ft=!!b.bumpMap,ht=!!b.normalMap,Ct=!!b.displacementMap,Ge=!!b.emissiveMap,It=!!b.metalnessMap,$e=!!b.roughnessMap,ot=b.anisotropy>0,D=b.clearcoat>0,A=b.dispersion>0,J=b.iridescence>0,ce=b.sheen>0,ue=b.transmission>0,re=ot&&!!b.anisotropyMap,Ve=D&&!!b.clearcoatMap,Ce=D&&!!b.clearcoatNormalMap,je=D&&!!b.clearcoatRoughnessMap,We=J&&!!b.iridescenceMap,me=J&&!!b.iridescenceThicknessMap,we=ce&&!!b.sheenColorMap,nt=ce&&!!b.sheenRoughnessMap,Qe=!!b.specularMap,Oe=!!b.specularColorMap,rt=!!b.specularIntensityMap,k=ue&&!!b.transmissionMap,Pe=ue&&!!b.thicknessMap,Te=!!b.gradientMap,Ee=!!b.alphaMap,xe=b.alphaTest>0,le=!!b.alphaHash,ke=!!b.extensions;let st=Ci;b.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(st=i.toneMapping);const yt={shaderID:de,shaderType:b.type,shaderName:b.name,vertexShader:ye,fragmentShader:Me,defines:b.defines,customVertexShaderID:Se,customFragmentShaderID:$,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:m,batching:Re,batchingColor:Re&&H._colorsTexture!==null,instancing:be,instancingColor:be&&H.instanceColor!==null,instancingMorph:be&&H.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:K===null?i.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Cs,alphaToCoverage:!!b.alphaToCoverage,map:Ye,matcap:Pt,envMap:Ze,envMapMode:Ze&&Q.mapping,envMapCubeUVHeight:ie,aoMap:Tt,lightMap:z,bumpMap:ft,normalMap:ht,displacementMap:p&&Ct,emissiveMap:Ge,normalMapObjectSpace:ht&&b.normalMapType===du,normalMapTangentSpace:ht&&b.normalMapType===Ac,metalnessMap:It,roughnessMap:$e,anisotropy:ot,anisotropyMap:re,clearcoat:D,clearcoatMap:Ve,clearcoatNormalMap:Ce,clearcoatRoughnessMap:je,dispersion:A,iridescence:J,iridescenceMap:We,iridescenceThicknessMap:me,sheen:ce,sheenColorMap:we,sheenRoughnessMap:nt,specularMap:Qe,specularColorMap:Oe,specularIntensityMap:rt,transmission:ue,transmissionMap:k,thicknessMap:Pe,gradientMap:Te,opaque:b.transparent===!1&&b.blending===ys&&b.alphaToCoverage===!1,alphaMap:Ee,alphaTest:xe,alphaHash:le,combine:b.combine,mapUv:Ye&&_(b.map.channel),aoMapUv:Tt&&_(b.aoMap.channel),lightMapUv:z&&_(b.lightMap.channel),bumpMapUv:ft&&_(b.bumpMap.channel),normalMapUv:ht&&_(b.normalMap.channel),displacementMapUv:Ct&&_(b.displacementMap.channel),emissiveMapUv:Ge&&_(b.emissiveMap.channel),metalnessMapUv:It&&_(b.metalnessMap.channel),roughnessMapUv:$e&&_(b.roughnessMap.channel),anisotropyMapUv:re&&_(b.anisotropyMap.channel),clearcoatMapUv:Ve&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Ce&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:je&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:We&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:me&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:we&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:nt&&_(b.sheenRoughnessMap.channel),specularMapUv:Qe&&_(b.specularMap.channel),specularColorMapUv:Oe&&_(b.specularColorMap.channel),specularIntensityMapUv:rt&&_(b.specularIntensityMap.channel),transmissionMapUv:k&&_(b.transmissionMap.channel),thicknessMapUv:Pe&&_(b.thicknessMap.channel),alphaMapUv:Ee&&_(b.alphaMap.channel),vertexTangents:!!ne.attributes.tangent&&(ht||ot),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!ne.attributes.uv&&(Ye||Ee),fog:!!te,useFog:b.fog===!0,fogExp2:!!te&&te.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:_e,skinning:H.isSkinnedMesh===!0,morphTargets:ne.morphAttributes.position!==void 0,morphNormals:ne.morphAttributes.normal!==void 0,morphColors:ne.morphAttributes.color!==void 0,morphTargetsCount:ze,morphTextureStride:I,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:st,decodeVideoTexture:Ye&&b.map.isVideoTexture===!0&&Et.getTransfer(b.map.colorSpace)===Ft,decodeVideoTextureEmissive:Ge&&b.emissiveMap.isVideoTexture===!0&&Et.getTransfer(b.emissiveMap.colorSpace)===Ft,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===gt,flipSided:b.side===ln,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:ke&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ke&&b.extensions.multiDraw===!0||Re)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return yt.vertexUv1s=l.has(1),yt.vertexUv2s=l.has(2),yt.vertexUv3s=l.has(3),l.clear(),yt}function h(b){const S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(const L in b.defines)S.push(L),S.push(b.defines[L]);return b.isRawShaderMaterial===!1&&(M(S,b),v(S,b),S.push(i.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function M(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function v(b,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),S.gradientMap&&o.enable(22),b.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reversedDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),b.push(o.mask)}function y(b){const S=g[b.type];let L;if(S){const U=Xn[S];L=pr.clone(U.uniforms)}else L=b.uniforms;return L}function E(b,S){let L;for(let U=0,H=d.length;U<H;U++){const te=d[U];if(te.cacheKey===S){L=te,++L.usedTimes;break}}return L===void 0&&(L=new cg(i,S,b,r),d.push(L)),L}function T(b){if(--b.usedTimes===0){const S=d.indexOf(b);d[S]=d[d.length-1],d.pop(),b.destroy()}}function R(b){c.remove(b)}function C(){c.dispose()}return{getParameters:x,getProgramCacheKey:h,getUniforms:y,acquireProgram:E,releaseProgram:T,releaseShaderCache:R,programs:d,dispose:C}}function fg(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function pg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function ih(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function sh(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,p,m,g,_,x){let h=i[e];return h===void 0?(h={id:u.id,object:u,geometry:p,material:m,groupOrder:g,renderOrder:u.renderOrder,z:_,group:x},i[e]=h):(h.id=u.id,h.object=u,h.geometry=p,h.material=m,h.groupOrder=g,h.renderOrder=u.renderOrder,h.z=_,h.group=x),e++,h}function o(u,p,m,g,_,x){const h=a(u,p,m,g,_,x);m.transmission>0?n.push(h):m.transparent===!0?s.push(h):t.push(h)}function c(u,p,m,g,_,x){const h=a(u,p,m,g,_,x);m.transmission>0?n.unshift(h):m.transparent===!0?s.unshift(h):t.unshift(h)}function l(u,p){t.length>1&&t.sort(u||pg),n.length>1&&n.sort(p||ih),s.length>1&&s.sort(p||ih)}function d(){for(let u=e,p=i.length;u<p;u++){const m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:d,sort:l}}function mg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new sh,i.set(n,[a])):s>=r.length?(a=new sh,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function xg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new it};break;case"SpotLight":t={position:new P,direction:new P,color:new it,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new it,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new it,groundColor:new it};break;case"RectAreaLight":t={color:new it,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function gg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let vg=0;function _g(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Mg(i){const e=new xg,t=gg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new P);const s=new P,r=new Dt,a=new Dt;function o(l){let d=0,u=0,p=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let m=0,g=0,_=0,x=0,h=0,M=0,v=0,y=0,E=0,T=0,R=0;l.sort(_g);for(let b=0,S=l.length;b<S;b++){const L=l[b],U=L.color,H=L.intensity,te=L.distance,ne=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=U.r*H,u+=U.g*H,p+=U.b*H;else if(L.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(L.sh.coefficients[W],H);R++}else if(L.isDirectionalLight){const W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Q=L.shadow,ie=t.get(L);ie.shadowIntensity=Q.intensity,ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize=Q.mapSize,n.directionalShadow[m]=ie,n.directionalShadowMap[m]=ne,n.directionalShadowMatrix[m]=L.shadow.matrix,M++}n.directional[m]=W,m++}else if(L.isSpotLight){const W=e.get(L);W.position.setFromMatrixPosition(L.matrixWorld),W.color.copy(U).multiplyScalar(H),W.distance=te,W.coneCos=Math.cos(L.angle),W.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),W.decay=L.decay,n.spot[_]=W;const Q=L.shadow;if(L.map&&(n.spotLightMap[E]=L.map,E++,Q.updateMatrices(L),L.castShadow&&T++),n.spotLightMatrix[_]=Q.matrix,L.castShadow){const ie=t.get(L);ie.shadowIntensity=Q.intensity,ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize=Q.mapSize,n.spotShadow[_]=ie,n.spotShadowMap[_]=ne,y++}_++}else if(L.isRectAreaLight){const W=e.get(L);W.color.copy(U).multiplyScalar(H),W.halfWidth.set(L.width*.5,0,0),W.halfHeight.set(0,L.height*.5,0),n.rectArea[x]=W,x++}else if(L.isPointLight){const W=e.get(L);if(W.color.copy(L.color).multiplyScalar(L.intensity),W.distance=L.distance,W.decay=L.decay,L.castShadow){const Q=L.shadow,ie=t.get(L);ie.shadowIntensity=Q.intensity,ie.shadowBias=Q.bias,ie.shadowNormalBias=Q.normalBias,ie.shadowRadius=Q.radius,ie.shadowMapSize=Q.mapSize,ie.shadowCameraNear=Q.camera.near,ie.shadowCameraFar=Q.camera.far,n.pointShadow[g]=ie,n.pointShadowMap[g]=ne,n.pointShadowMatrix[g]=L.shadow.matrix,v++}n.point[g]=W,g++}else if(L.isHemisphereLight){const W=e.get(L);W.skyColor.copy(L.color).multiplyScalar(H),W.groundColor.copy(L.groundColor).multiplyScalar(H),n.hemi[h]=W,h++}}x>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ue.LTC_FLOAT_1,n.rectAreaLTC2=Ue.LTC_FLOAT_2):(n.rectAreaLTC1=Ue.LTC_HALF_1,n.rectAreaLTC2=Ue.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=p;const C=n.hash;(C.directionalLength!==m||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==x||C.hemiLength!==h||C.numDirectionalShadows!==M||C.numPointShadows!==v||C.numSpotShadows!==y||C.numSpotMaps!==E||C.numLightProbes!==R)&&(n.directional.length=m,n.spot.length=_,n.rectArea.length=x,n.point.length=g,n.hemi.length=h,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=y+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=R,C.directionalLength=m,C.pointLength=g,C.spotLength=_,C.rectAreaLength=x,C.hemiLength=h,C.numDirectionalShadows=M,C.numPointShadows=v,C.numSpotShadows=y,C.numSpotMaps=E,C.numLightProbes=R,n.version=vg++)}function c(l,d){let u=0,p=0,m=0,g=0,_=0;const x=d.matrixWorldInverse;for(let h=0,M=l.length;h<M;h++){const v=l[h];if(v.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(x),u++}else if(v.isSpotLight){const y=n.spot[m];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(x),y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(x),m++}else if(v.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(x),a.identity(),r.copy(v.matrixWorld),r.premultiply(x),a.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(v.isPointLight){const y=n.point[p];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(x),p++}else if(v.isHemisphereLight){const y=n.hemi[_];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(x),_++}}}return{setup:o,setupView:c,state:n}}function rh(i){const e=new Mg(i),t=[],n=[];function s(d){l.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Sg(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new rh(i),e.set(s,[o])):r>=a.length?(o=new rh(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const yg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bg=`uniform sampler2D shadow_pass;
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
}`;function wg(i,e,t){let n=new Ic;const s=new Ie,r=new Ie,a=new Nt,o=new Xf({depthPacking:hu}),c=new Yf,l={},d=t.maxTextureSize,u={[Pi]:ln,[ln]:Pi,[gt]:gt},p=new cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ie},radius:{value:4}},vertexShader:yg,fragmentShader:bg}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const g=new Xt;g.setAttribute("position",new kn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new V(g,p),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sh;let h=this.type;this.render=function(T,R,C){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||T.length===0)return;const b=i.getRenderTarget(),S=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),U=i.state;U.setBlending($n),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const H=h!==ci&&this.type===ci,te=h===ci&&this.type!==ci;for(let ne=0,W=T.length;ne<W;ne++){const Q=T[ne],ie=Q.shadow;if(ie===void 0){lt("WebGLShadowMap:",Q,"has no shadow.");continue}if(ie.autoUpdate===!1&&ie.needsUpdate===!1)continue;s.copy(ie.mapSize);const de=ie.getFrameExtents();if(s.multiply(de),r.copy(ie.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/de.x),s.x=r.x*de.x,ie.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/de.y),s.y=r.y*de.y,ie.mapSize.y=r.y)),ie.map===null||H===!0||te===!0){const ze=this.type!==ci?{minFilter:wn,magFilter:wn}:{};ie.map!==null&&ie.map.dispose(),ie.map=new zn(s.x,s.y,ze),ie.map.texture.name=Q.name+".shadowMap",ie.camera.updateProjectionMatrix()}i.setRenderTarget(ie.map),i.clear();const fe=ie.getViewportCount();for(let ze=0;ze<fe;ze++){const I=ie.getViewport(ze);a.set(r.x*I.x,r.y*I.y,r.x*I.z,r.y*I.w),U.viewport(a),ie.updateMatrices(Q,ze),n=ie.getFrustum(),y(R,C,ie.camera,Q,this.type)}ie.isPointLightShadow!==!0&&this.type===ci&&M(ie,C),ie.needsUpdate=!1}h=this.type,x.needsUpdate=!1,i.setRenderTarget(b,S,L)};function M(T,R){const C=e.update(_);p.defines.VSM_SAMPLES!==T.blurSamples&&(p.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new zn(s.x,s.y)),p.uniforms.shadow_pass.value=T.map.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(R,null,C,p,_,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(R,null,C,m,_,null)}function v(T,R,C,b){let S=null;const L=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(L!==void 0)S=L;else if(S=C.isPointLight===!0?c:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const U=S.uuid,H=R.uuid;let te=l[U];te===void 0&&(te={},l[U]=te);let ne=te[H];ne===void 0&&(ne=S.clone(),te[H]=ne,R.addEventListener("dispose",E)),S=ne}if(S.visible=R.visible,S.wireframe=R.wireframe,b===ci?S.side=R.shadowSide!==null?R.shadowSide:R.side:S.side=R.shadowSide!==null?R.shadowSide:u[R.side],S.alphaMap=R.alphaMap,S.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,S.map=R.map,S.clipShadows=R.clipShadows,S.clippingPlanes=R.clippingPlanes,S.clipIntersection=R.clipIntersection,S.displacementMap=R.displacementMap,S.displacementScale=R.displacementScale,S.displacementBias=R.displacementBias,S.wireframeLinewidth=R.wireframeLinewidth,S.linewidth=R.linewidth,C.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const U=i.properties.get(S);U.light=C}return S}function y(T,R,C,b,S){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===ci)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const H=e.update(T),te=T.material;if(Array.isArray(te)){const ne=H.groups;for(let W=0,Q=ne.length;W<Q;W++){const ie=ne[W],de=te[ie.materialIndex];if(de&&de.visible){const fe=v(T,de,b,S);T.onBeforeShadow(i,T,R,C,H,fe,ie),i.renderBufferDirect(C,null,H,fe,T,ie),T.onAfterShadow(i,T,R,C,H,fe,ie)}}}else if(te.visible){const ne=v(T,te,b,S);T.onBeforeShadow(i,T,R,C,H,ne,null),i.renderBufferDirect(C,null,H,ne,T,null),T.onAfterShadow(i,T,R,C,H,ne,null)}}const U=T.children;for(let H=0,te=U.length;H<te;H++)y(U[H],R,C,b,S)}function E(T){T.target.removeEventListener("dispose",E);for(const C in l){const b=l[C],S=T.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}const Tg={[So]:yo,[bo]:Eo,[wo]:Ao,[Ts]:To,[yo]:So,[Eo]:bo,[Ao]:wo,[To]:Ts};function Eg(i,e){function t(){let k=!1;const Pe=new Nt;let Te=null;const Ee=new Nt(0,0,0,0);return{setMask:function(xe){Te!==xe&&!k&&(i.colorMask(xe,xe,xe,xe),Te=xe)},setLocked:function(xe){k=xe},setClear:function(xe,le,ke,st,yt){yt===!0&&(xe*=st,le*=st,ke*=st),Pe.set(xe,le,ke,st),Ee.equals(Pe)===!1&&(i.clearColor(xe,le,ke,st),Ee.copy(Pe))},reset:function(){k=!1,Te=null,Ee.set(-1,0,0,0)}}}function n(){let k=!1,Pe=!1,Te=null,Ee=null,xe=null;return{setReversed:function(le){if(Pe!==le){const ke=e.get("EXT_clip_control");le?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT),Pe=le;const st=xe;xe=null,this.setClear(st)}},getReversed:function(){return Pe},setTest:function(le){le?K(i.DEPTH_TEST):_e(i.DEPTH_TEST)},setMask:function(le){Te!==le&&!k&&(i.depthMask(le),Te=le)},setFunc:function(le){if(Pe&&(le=Tg[le]),Ee!==le){switch(le){case So:i.depthFunc(i.NEVER);break;case yo:i.depthFunc(i.ALWAYS);break;case bo:i.depthFunc(i.LESS);break;case Ts:i.depthFunc(i.LEQUAL);break;case wo:i.depthFunc(i.EQUAL);break;case To:i.depthFunc(i.GEQUAL);break;case Eo:i.depthFunc(i.GREATER);break;case Ao:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ee=le}},setLocked:function(le){k=le},setClear:function(le){xe!==le&&(Pe&&(le=1-le),i.clearDepth(le),xe=le)},reset:function(){k=!1,Te=null,Ee=null,xe=null,Pe=!1}}}function s(){let k=!1,Pe=null,Te=null,Ee=null,xe=null,le=null,ke=null,st=null,yt=null;return{setTest:function(Ut){k||(Ut?K(i.STENCIL_TEST):_e(i.STENCIL_TEST))},setMask:function(Ut){Pe!==Ut&&!k&&(i.stencilMask(Ut),Pe=Ut)},setFunc:function(Ut,Tn,xn){(Te!==Ut||Ee!==Tn||xe!==xn)&&(i.stencilFunc(Ut,Tn,xn),Te=Ut,Ee=Tn,xe=xn)},setOp:function(Ut,Tn,xn){(le!==Ut||ke!==Tn||st!==xn)&&(i.stencilOp(Ut,Tn,xn),le=Ut,ke=Tn,st=xn)},setLocked:function(Ut){k=Ut},setClear:function(Ut){yt!==Ut&&(i.clearStencil(Ut),yt=Ut)},reset:function(){k=!1,Pe=null,Te=null,Ee=null,xe=null,le=null,ke=null,st=null,yt=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let d={},u={},p=new WeakMap,m=[],g=null,_=!1,x=null,h=null,M=null,v=null,y=null,E=null,T=null,R=new it(0,0,0),C=0,b=!1,S=null,L=null,U=null,H=null,te=null;const ne=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,Q=0;const ie=i.getParameter(i.VERSION);ie.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(ie)[1]),W=Q>=1):ie.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),W=Q>=2);let de=null,fe={};const ze=i.getParameter(i.SCISSOR_BOX),I=i.getParameter(i.VIEWPORT),ye=new Nt().fromArray(ze),Me=new Nt().fromArray(I);function Se(k,Pe,Te,Ee){const xe=new Uint8Array(4),le=i.createTexture();i.bindTexture(k,le),i.texParameteri(k,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(k,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ke=0;ke<Te;ke++)k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?i.texImage3D(Pe,0,i.RGBA,1,1,Ee,0,i.RGBA,i.UNSIGNED_BYTE,xe):i.texImage2D(Pe+ke,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,xe);return le}const $={};$[i.TEXTURE_2D]=Se(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=Se(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=Se(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=Se(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),K(i.DEPTH_TEST),a.setFunc(Ts),ft(!1),ht($c),K(i.CULL_FACE),Tt($n);function K(k){d[k]!==!0&&(i.enable(k),d[k]=!0)}function _e(k){d[k]!==!1&&(i.disable(k),d[k]=!1)}function be(k,Pe){return u[k]!==Pe?(i.bindFramebuffer(k,Pe),u[k]=Pe,k===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Pe),k===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Pe),!0):!1}function Re(k,Pe){let Te=m,Ee=!1;if(k){Te=p.get(Pe),Te===void 0&&(Te=[],p.set(Pe,Te));const xe=k.textures;if(Te.length!==xe.length||Te[0]!==i.COLOR_ATTACHMENT0){for(let le=0,ke=xe.length;le<ke;le++)Te[le]=i.COLOR_ATTACHMENT0+le;Te.length=xe.length,Ee=!0}}else Te[0]!==i.BACK&&(Te[0]=i.BACK,Ee=!0);Ee&&i.drawBuffers(Te)}function Ye(k){return g!==k?(i.useProgram(k),g=k,!0):!1}const Pt={[Wi]:i.FUNC_ADD,[Hd]:i.FUNC_SUBTRACT,[Wd]:i.FUNC_REVERSE_SUBTRACT};Pt[Xd]=i.MIN,Pt[Yd]=i.MAX;const Ze={[qd]:i.ZERO,[Zd]:i.ONE,[$d]:i.SRC_COLOR,[_o]:i.SRC_ALPHA,[tu]:i.SRC_ALPHA_SATURATE,[Qd]:i.DST_COLOR,[Jd]:i.DST_ALPHA,[Kd]:i.ONE_MINUS_SRC_COLOR,[Mo]:i.ONE_MINUS_SRC_ALPHA,[eu]:i.ONE_MINUS_DST_COLOR,[jd]:i.ONE_MINUS_DST_ALPHA,[nu]:i.CONSTANT_COLOR,[iu]:i.ONE_MINUS_CONSTANT_COLOR,[su]:i.CONSTANT_ALPHA,[ru]:i.ONE_MINUS_CONSTANT_ALPHA};function Tt(k,Pe,Te,Ee,xe,le,ke,st,yt,Ut){if(k===$n){_===!0&&(_e(i.BLEND),_=!1);return}if(_===!1&&(K(i.BLEND),_=!0),k!==Gd){if(k!==x||Ut!==b){if((h!==Wi||y!==Wi)&&(i.blendEquation(i.FUNC_ADD),h=Wi,y=Wi),Ut)switch(k){case ys:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ti:i.blendFunc(i.ONE,i.ONE);break;case Kc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Jc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ht("WebGLState: Invalid blending: ",k);break}else switch(k){case ys:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ti:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Kc:Ht("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Jc:Ht("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ht("WebGLState: Invalid blending: ",k);break}M=null,v=null,E=null,T=null,R.set(0,0,0),C=0,x=k,b=Ut}return}xe=xe||Pe,le=le||Te,ke=ke||Ee,(Pe!==h||xe!==y)&&(i.blendEquationSeparate(Pt[Pe],Pt[xe]),h=Pe,y=xe),(Te!==M||Ee!==v||le!==E||ke!==T)&&(i.blendFuncSeparate(Ze[Te],Ze[Ee],Ze[le],Ze[ke]),M=Te,v=Ee,E=le,T=ke),(st.equals(R)===!1||yt!==C)&&(i.blendColor(st.r,st.g,st.b,yt),R.copy(st),C=yt),x=k,b=!1}function z(k,Pe){k.side===gt?_e(i.CULL_FACE):K(i.CULL_FACE);let Te=k.side===ln;Pe&&(Te=!Te),ft(Te),k.blending===ys&&k.transparent===!1?Tt($n):Tt(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),r.setMask(k.colorWrite);const Ee=k.stencilWrite;o.setTest(Ee),Ee&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),Ge(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?K(i.SAMPLE_ALPHA_TO_COVERAGE):_e(i.SAMPLE_ALPHA_TO_COVERAGE)}function ft(k){S!==k&&(k?i.frontFace(i.CW):i.frontFace(i.CCW),S=k)}function ht(k){k!==kd?(K(i.CULL_FACE),k!==L&&(k===$c?i.cullFace(i.BACK):k===Vd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):_e(i.CULL_FACE),L=k}function Ct(k){k!==U&&(W&&i.lineWidth(k),U=k)}function Ge(k,Pe,Te){k?(K(i.POLYGON_OFFSET_FILL),(H!==Pe||te!==Te)&&(i.polygonOffset(Pe,Te),H=Pe,te=Te)):_e(i.POLYGON_OFFSET_FILL)}function It(k){k?K(i.SCISSOR_TEST):_e(i.SCISSOR_TEST)}function $e(k){k===void 0&&(k=i.TEXTURE0+ne-1),de!==k&&(i.activeTexture(k),de=k)}function ot(k,Pe,Te){Te===void 0&&(de===null?Te=i.TEXTURE0+ne-1:Te=de);let Ee=fe[Te];Ee===void 0&&(Ee={type:void 0,texture:void 0},fe[Te]=Ee),(Ee.type!==k||Ee.texture!==Pe)&&(de!==Te&&(i.activeTexture(Te),de=Te),i.bindTexture(k,Pe||$[k]),Ee.type=k,Ee.texture=Pe)}function D(){const k=fe[de];k!==void 0&&k.type!==void 0&&(i.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function A(){try{i.compressedTexImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function J(){try{i.compressedTexImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function ce(){try{i.texSubImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function ue(){try{i.texSubImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function re(){try{i.compressedTexSubImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function Ve(){try{i.compressedTexSubImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function Ce(){try{i.texStorage2D(...arguments)}catch(k){k("WebGLState:",k)}}function je(){try{i.texStorage3D(...arguments)}catch(k){k("WebGLState:",k)}}function We(){try{i.texImage2D(...arguments)}catch(k){k("WebGLState:",k)}}function me(){try{i.texImage3D(...arguments)}catch(k){k("WebGLState:",k)}}function we(k){ye.equals(k)===!1&&(i.scissor(k.x,k.y,k.z,k.w),ye.copy(k))}function nt(k){Me.equals(k)===!1&&(i.viewport(k.x,k.y,k.z,k.w),Me.copy(k))}function Qe(k,Pe){let Te=l.get(Pe);Te===void 0&&(Te=new WeakMap,l.set(Pe,Te));let Ee=Te.get(k);Ee===void 0&&(Ee=i.getUniformBlockIndex(Pe,k.name),Te.set(k,Ee))}function Oe(k,Pe){const Ee=l.get(Pe).get(k);c.get(Pe)!==Ee&&(i.uniformBlockBinding(Pe,Ee,k.__bindingPointIndex),c.set(Pe,Ee))}function rt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},de=null,fe={},u={},p=new WeakMap,m=[],g=null,_=!1,x=null,h=null,M=null,v=null,y=null,E=null,T=null,R=new it(0,0,0),C=0,b=!1,S=null,L=null,U=null,H=null,te=null,ye.set(0,0,i.canvas.width,i.canvas.height),Me.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:K,disable:_e,bindFramebuffer:be,drawBuffers:Re,useProgram:Ye,setBlending:Tt,setMaterial:z,setFlipSided:ft,setCullFace:ht,setLineWidth:Ct,setPolygonOffset:Ge,setScissorTest:It,activeTexture:$e,bindTexture:ot,unbindTexture:D,compressedTexImage2D:A,compressedTexImage3D:J,texImage2D:We,texImage3D:me,updateUBOMapping:Qe,uniformBlockBinding:Oe,texStorage2D:Ce,texStorage3D:je,texSubImage2D:ce,texSubImage3D:ue,compressedTexSubImage2D:re,compressedTexSubImage3D:Ve,scissor:we,viewport:nt,reset:rt}}function Ag(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ie,d=new WeakMap;let u;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,A){return m?new OffscreenCanvas(D,A):ua("canvas")}function _(D,A,J){let ce=1;const ue=ot(D);if((ue.width>J||ue.height>J)&&(ce=J/Math.max(ue.width,ue.height)),ce<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const re=Math.floor(ce*ue.width),Ve=Math.floor(ce*ue.height);u===void 0&&(u=g(re,Ve));const Ce=A?g(re,Ve):u;return Ce.width=re,Ce.height=Ve,Ce.getContext("2d").drawImage(D,0,0,re,Ve),lt("WebGLRenderer: Texture has been resized from ("+ue.width+"x"+ue.height+") to ("+re+"x"+Ve+")."),Ce}else return"data"in D&&lt("WebGLRenderer: Image in DataTexture is too big ("+ue.width+"x"+ue.height+")."),D;return D}function x(D){return D.generateMipmaps}function h(D){i.generateMipmap(D)}function M(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(D,A,J,ce,ue=!1){if(D!==null){if(i[D]!==void 0)return i[D];lt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let re=A;if(A===i.RED&&(J===i.FLOAT&&(re=i.R32F),J===i.HALF_FLOAT&&(re=i.R16F),J===i.UNSIGNED_BYTE&&(re=i.R8)),A===i.RED_INTEGER&&(J===i.UNSIGNED_BYTE&&(re=i.R8UI),J===i.UNSIGNED_SHORT&&(re=i.R16UI),J===i.UNSIGNED_INT&&(re=i.R32UI),J===i.BYTE&&(re=i.R8I),J===i.SHORT&&(re=i.R16I),J===i.INT&&(re=i.R32I)),A===i.RG&&(J===i.FLOAT&&(re=i.RG32F),J===i.HALF_FLOAT&&(re=i.RG16F),J===i.UNSIGNED_BYTE&&(re=i.RG8)),A===i.RG_INTEGER&&(J===i.UNSIGNED_BYTE&&(re=i.RG8UI),J===i.UNSIGNED_SHORT&&(re=i.RG16UI),J===i.UNSIGNED_INT&&(re=i.RG32UI),J===i.BYTE&&(re=i.RG8I),J===i.SHORT&&(re=i.RG16I),J===i.INT&&(re=i.RG32I)),A===i.RGB_INTEGER&&(J===i.UNSIGNED_BYTE&&(re=i.RGB8UI),J===i.UNSIGNED_SHORT&&(re=i.RGB16UI),J===i.UNSIGNED_INT&&(re=i.RGB32UI),J===i.BYTE&&(re=i.RGB8I),J===i.SHORT&&(re=i.RGB16I),J===i.INT&&(re=i.RGB32I)),A===i.RGBA_INTEGER&&(J===i.UNSIGNED_BYTE&&(re=i.RGBA8UI),J===i.UNSIGNED_SHORT&&(re=i.RGBA16UI),J===i.UNSIGNED_INT&&(re=i.RGBA32UI),J===i.BYTE&&(re=i.RGBA8I),J===i.SHORT&&(re=i.RGBA16I),J===i.INT&&(re=i.RGBA32I)),A===i.RGB&&(J===i.UNSIGNED_INT_5_9_9_9_REV&&(re=i.RGB9_E5),J===i.UNSIGNED_INT_10F_11F_11F_REV&&(re=i.R11F_G11F_B10F)),A===i.RGBA){const Ve=ue?ha:Et.getTransfer(ce);J===i.FLOAT&&(re=i.RGBA32F),J===i.HALF_FLOAT&&(re=i.RGBA16F),J===i.UNSIGNED_BYTE&&(re=Ve===Ft?i.SRGB8_ALPHA8:i.RGBA8),J===i.UNSIGNED_SHORT_4_4_4_4&&(re=i.RGBA4),J===i.UNSIGNED_SHORT_5_5_5_1&&(re=i.RGB5_A1)}return(re===i.R16F||re===i.R32F||re===i.RG16F||re===i.RG32F||re===i.RGBA16F||re===i.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function y(D,A){let J;return D?A===null||A===ji||A===lr?J=i.DEPTH24_STENCIL8:A===qn?J=i.DEPTH32F_STENCIL8:A===cr&&(J=i.DEPTH24_STENCIL8,lt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===ji||A===lr?J=i.DEPTH_COMPONENT24:A===qn?J=i.DEPTH_COMPONENT32F:A===cr&&(J=i.DEPTH_COMPONENT16),J}function E(D,A){return x(D)===!0||D.isFramebufferTexture&&D.minFilter!==wn&&D.minFilter!==Pn?Math.log2(Math.max(A.width,A.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?A.mipmaps.length:1}function T(D){const A=D.target;A.removeEventListener("dispose",T),C(A),A.isVideoTexture&&d.delete(A)}function R(D){const A=D.target;A.removeEventListener("dispose",R),S(A)}function C(D){const A=n.get(D);if(A.__webglInit===void 0)return;const J=D.source,ce=p.get(J);if(ce){const ue=ce[A.__cacheKey];ue.usedTimes--,ue.usedTimes===0&&b(D),Object.keys(ce).length===0&&p.delete(J)}n.remove(D)}function b(D){const A=n.get(D);i.deleteTexture(A.__webglTexture);const J=D.source,ce=p.get(J);delete ce[A.__cacheKey],a.memory.textures--}function S(D){const A=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let ce=0;ce<6;ce++){if(Array.isArray(A.__webglFramebuffer[ce]))for(let ue=0;ue<A.__webglFramebuffer[ce].length;ue++)i.deleteFramebuffer(A.__webglFramebuffer[ce][ue]);else i.deleteFramebuffer(A.__webglFramebuffer[ce]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[ce])}else{if(Array.isArray(A.__webglFramebuffer))for(let ce=0;ce<A.__webglFramebuffer.length;ce++)i.deleteFramebuffer(A.__webglFramebuffer[ce]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ce=0;ce<A.__webglColorRenderbuffer.length;ce++)A.__webglColorRenderbuffer[ce]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[ce]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const J=D.textures;for(let ce=0,ue=J.length;ce<ue;ce++){const re=n.get(J[ce]);re.__webglTexture&&(i.deleteTexture(re.__webglTexture),a.memory.textures--),n.remove(J[ce])}n.remove(D)}let L=0;function U(){L=0}function H(){const D=L;return D>=s.maxTextures&&lt("WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),L+=1,D}function te(D){const A=[];return A.push(D.wrapS),A.push(D.wrapT),A.push(D.wrapR||0),A.push(D.magFilter),A.push(D.minFilter),A.push(D.anisotropy),A.push(D.internalFormat),A.push(D.format),A.push(D.type),A.push(D.generateMipmaps),A.push(D.premultiplyAlpha),A.push(D.flipY),A.push(D.unpackAlignment),A.push(D.colorSpace),A.join()}function ne(D,A){const J=n.get(D);if(D.isVideoTexture&&It(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&J.__version!==D.version){const ce=D.image;if(ce===null)lt("WebGLRenderer: Texture marked for update but no image data found.");else if(ce.complete===!1)lt("WebGLRenderer: Texture marked for update but image is incomplete");else{$(J,D,A);return}}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,J.__webglTexture,i.TEXTURE0+A)}function W(D,A){const J=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){$(J,D,A);return}else D.isExternalTexture&&(J.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,J.__webglTexture,i.TEXTURE0+A)}function Q(D,A){const J=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&J.__version!==D.version){$(J,D,A);return}t.bindTexture(i.TEXTURE_3D,J.__webglTexture,i.TEXTURE0+A)}function ie(D,A){const J=n.get(D);if(D.version>0&&J.__version!==D.version){K(J,D,A);return}t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture,i.TEXTURE0+A)}const de={[dn]:i.REPEAT,[di]:i.CLAMP_TO_EDGE,[Po]:i.MIRRORED_REPEAT},fe={[wn]:i.NEAREST,[cu]:i.NEAREST_MIPMAP_NEAREST,[Ar]:i.NEAREST_MIPMAP_LINEAR,[Pn]:i.LINEAR,[Ra]:i.LINEAR_MIPMAP_NEAREST,[Yi]:i.LINEAR_MIPMAP_LINEAR},ze={[uu]:i.NEVER,[vu]:i.ALWAYS,[fu]:i.LESS,[Nh]:i.LEQUAL,[pu]:i.EQUAL,[gu]:i.GEQUAL,[mu]:i.GREATER,[xu]:i.NOTEQUAL};function I(D,A){if(A.type===qn&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===Pn||A.magFilter===Ra||A.magFilter===Ar||A.magFilter===Yi||A.minFilter===Pn||A.minFilter===Ra||A.minFilter===Ar||A.minFilter===Yi)&&lt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,de[A.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,de[A.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,de[A.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,fe[A.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,fe[A.minFilter]),A.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,ze[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===wn||A.minFilter!==Ar&&A.minFilter!==Yi||A.type===qn&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){const J=e.get("EXT_texture_filter_anisotropic");i.texParameterf(D,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function ye(D,A){let J=!1;D.__webglInit===void 0&&(D.__webglInit=!0,A.addEventListener("dispose",T));const ce=A.source;let ue=p.get(ce);ue===void 0&&(ue={},p.set(ce,ue));const re=te(A);if(re!==D.__cacheKey){ue[re]===void 0&&(ue[re]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,J=!0),ue[re].usedTimes++;const Ve=ue[D.__cacheKey];Ve!==void 0&&(ue[D.__cacheKey].usedTimes--,Ve.usedTimes===0&&b(A)),D.__cacheKey=re,D.__webglTexture=ue[re].texture}return J}function Me(D,A,J){return Math.floor(Math.floor(D/J)/A)}function Se(D,A,J,ce){const re=D.updateRanges;if(re.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,J,ce,A.data);else{re.sort((me,we)=>me.start-we.start);let Ve=0;for(let me=1;me<re.length;me++){const we=re[Ve],nt=re[me],Qe=we.start+we.count,Oe=Me(nt.start,A.width,4),rt=Me(we.start,A.width,4);nt.start<=Qe+1&&Oe===rt&&Me(nt.start+nt.count-1,A.width,4)===Oe?we.count=Math.max(we.count,nt.start+nt.count-we.start):(++Ve,re[Ve]=nt)}re.length=Ve+1;const Ce=i.getParameter(i.UNPACK_ROW_LENGTH),je=i.getParameter(i.UNPACK_SKIP_PIXELS),We=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let me=0,we=re.length;me<we;me++){const nt=re[me],Qe=Math.floor(nt.start/4),Oe=Math.ceil(nt.count/4),rt=Qe%A.width,k=Math.floor(Qe/A.width),Pe=Oe,Te=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,rt),i.pixelStorei(i.UNPACK_SKIP_ROWS,k),t.texSubImage2D(i.TEXTURE_2D,0,rt,k,Pe,Te,J,ce,A.data)}D.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,Ce),i.pixelStorei(i.UNPACK_SKIP_PIXELS,je),i.pixelStorei(i.UNPACK_SKIP_ROWS,We)}}function $(D,A,J){let ce=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ce=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ce=i.TEXTURE_3D);const ue=ye(D,A),re=A.source;t.bindTexture(ce,D.__webglTexture,i.TEXTURE0+J);const Ve=n.get(re);if(re.version!==Ve.__version||ue===!0){t.activeTexture(i.TEXTURE0+J);const Ce=Et.getPrimaries(Et.workingColorSpace),je=A.colorSpace===wi?null:Et.getPrimaries(A.colorSpace),We=A.colorSpace===wi||Ce===je?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,We);let me=_(A.image,!1,s.maxTextureSize);me=$e(A,me);const we=r.convert(A.format,A.colorSpace),nt=r.convert(A.type);let Qe=v(A.internalFormat,we,nt,A.colorSpace,A.isVideoTexture);I(ce,A);let Oe;const rt=A.mipmaps,k=A.isVideoTexture!==!0,Pe=Ve.__version===void 0||ue===!0,Te=re.dataReady,Ee=E(A,me);if(A.isDepthTexture)Qe=y(A.format===dr,A.type),Pe&&(k?t.texStorage2D(i.TEXTURE_2D,1,Qe,me.width,me.height):t.texImage2D(i.TEXTURE_2D,0,Qe,me.width,me.height,0,we,nt,null));else if(A.isDataTexture)if(rt.length>0){k&&Pe&&t.texStorage2D(i.TEXTURE_2D,Ee,Qe,rt[0].width,rt[0].height);for(let xe=0,le=rt.length;xe<le;xe++)Oe=rt[xe],k?Te&&t.texSubImage2D(i.TEXTURE_2D,xe,0,0,Oe.width,Oe.height,we,nt,Oe.data):t.texImage2D(i.TEXTURE_2D,xe,Qe,Oe.width,Oe.height,0,we,nt,Oe.data);A.generateMipmaps=!1}else k?(Pe&&t.texStorage2D(i.TEXTURE_2D,Ee,Qe,me.width,me.height),Te&&Se(A,me,we,nt)):t.texImage2D(i.TEXTURE_2D,0,Qe,me.width,me.height,0,we,nt,me.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){k&&Pe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ee,Qe,rt[0].width,rt[0].height,me.depth);for(let xe=0,le=rt.length;xe<le;xe++)if(Oe=rt[xe],A.format!==Bn)if(we!==null)if(k){if(Te)if(A.layerUpdates.size>0){const ke=Ol(Oe.width,Oe.height,A.format,A.type);for(const st of A.layerUpdates){const yt=Oe.data.subarray(st*ke/Oe.data.BYTES_PER_ELEMENT,(st+1)*ke/Oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,xe,0,0,st,Oe.width,Oe.height,1,we,yt)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,xe,0,0,0,Oe.width,Oe.height,me.depth,we,Oe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,xe,Qe,Oe.width,Oe.height,me.depth,0,Oe.data,0,0);else lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else k?Te&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,xe,0,0,0,Oe.width,Oe.height,me.depth,we,nt,Oe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,xe,Qe,Oe.width,Oe.height,me.depth,0,we,nt,Oe.data)}else{k&&Pe&&t.texStorage2D(i.TEXTURE_2D,Ee,Qe,rt[0].width,rt[0].height);for(let xe=0,le=rt.length;xe<le;xe++)Oe=rt[xe],A.format!==Bn?we!==null?k?Te&&t.compressedTexSubImage2D(i.TEXTURE_2D,xe,0,0,Oe.width,Oe.height,we,Oe.data):t.compressedTexImage2D(i.TEXTURE_2D,xe,Qe,Oe.width,Oe.height,0,Oe.data):lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):k?Te&&t.texSubImage2D(i.TEXTURE_2D,xe,0,0,Oe.width,Oe.height,we,nt,Oe.data):t.texImage2D(i.TEXTURE_2D,xe,Qe,Oe.width,Oe.height,0,we,nt,Oe.data)}else if(A.isDataArrayTexture)if(k){if(Pe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ee,Qe,me.width,me.height,me.depth),Te)if(A.layerUpdates.size>0){const xe=Ol(me.width,me.height,A.format,A.type);for(const le of A.layerUpdates){const ke=me.data.subarray(le*xe/me.data.BYTES_PER_ELEMENT,(le+1)*xe/me.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,le,me.width,me.height,1,we,nt,ke)}A.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,me.width,me.height,me.depth,we,nt,me.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Qe,me.width,me.height,me.depth,0,we,nt,me.data);else if(A.isData3DTexture)k?(Pe&&t.texStorage3D(i.TEXTURE_3D,Ee,Qe,me.width,me.height,me.depth),Te&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,me.width,me.height,me.depth,we,nt,me.data)):t.texImage3D(i.TEXTURE_3D,0,Qe,me.width,me.height,me.depth,0,we,nt,me.data);else if(A.isFramebufferTexture){if(Pe)if(k)t.texStorage2D(i.TEXTURE_2D,Ee,Qe,me.width,me.height);else{let xe=me.width,le=me.height;for(let ke=0;ke<Ee;ke++)t.texImage2D(i.TEXTURE_2D,ke,Qe,xe,le,0,we,nt,null),xe>>=1,le>>=1}}else if(rt.length>0){if(k&&Pe){const xe=ot(rt[0]);t.texStorage2D(i.TEXTURE_2D,Ee,Qe,xe.width,xe.height)}for(let xe=0,le=rt.length;xe<le;xe++)Oe=rt[xe],k?Te&&t.texSubImage2D(i.TEXTURE_2D,xe,0,0,we,nt,Oe):t.texImage2D(i.TEXTURE_2D,xe,Qe,we,nt,Oe);A.generateMipmaps=!1}else if(k){if(Pe){const xe=ot(me);t.texStorage2D(i.TEXTURE_2D,Ee,Qe,xe.width,xe.height)}Te&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,we,nt,me)}else t.texImage2D(i.TEXTURE_2D,0,Qe,we,nt,me);x(A)&&h(ce),Ve.__version=re.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function K(D,A,J){if(A.image.length!==6)return;const ce=ye(D,A),ue=A.source;t.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+J);const re=n.get(ue);if(ue.version!==re.__version||ce===!0){t.activeTexture(i.TEXTURE0+J);const Ve=Et.getPrimaries(Et.workingColorSpace),Ce=A.colorSpace===wi?null:Et.getPrimaries(A.colorSpace),je=A.colorSpace===wi||Ve===Ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,je);const We=A.isCompressedTexture||A.image[0].isCompressedTexture,me=A.image[0]&&A.image[0].isDataTexture,we=[];for(let le=0;le<6;le++)!We&&!me?we[le]=_(A.image[le],!0,s.maxCubemapSize):we[le]=me?A.image[le].image:A.image[le],we[le]=$e(A,we[le]);const nt=we[0],Qe=r.convert(A.format,A.colorSpace),Oe=r.convert(A.type),rt=v(A.internalFormat,Qe,Oe,A.colorSpace),k=A.isVideoTexture!==!0,Pe=re.__version===void 0||ce===!0,Te=ue.dataReady;let Ee=E(A,nt);I(i.TEXTURE_CUBE_MAP,A);let xe;if(We){k&&Pe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ee,rt,nt.width,nt.height);for(let le=0;le<6;le++){xe=we[le].mipmaps;for(let ke=0;ke<xe.length;ke++){const st=xe[ke];A.format!==Bn?Qe!==null?k?Te&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,ke,0,0,st.width,st.height,Qe,st.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,ke,rt,st.width,st.height,0,st.data):lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?Te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,ke,0,0,st.width,st.height,Qe,Oe,st.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,ke,rt,st.width,st.height,0,Qe,Oe,st.data)}}}else{if(xe=A.mipmaps,k&&Pe){xe.length>0&&Ee++;const le=ot(we[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ee,rt,le.width,le.height)}for(let le=0;le<6;le++)if(me){k?Te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,we[le].width,we[le].height,Qe,Oe,we[le].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,rt,we[le].width,we[le].height,0,Qe,Oe,we[le].data);for(let ke=0;ke<xe.length;ke++){const yt=xe[ke].image[le].image;k?Te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,ke+1,0,0,yt.width,yt.height,Qe,Oe,yt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,ke+1,rt,yt.width,yt.height,0,Qe,Oe,yt.data)}}else{k?Te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,Qe,Oe,we[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,rt,Qe,Oe,we[le]);for(let ke=0;ke<xe.length;ke++){const st=xe[ke];k?Te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,ke+1,0,0,Qe,Oe,st.image[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,ke+1,rt,Qe,Oe,st.image[le])}}}x(A)&&h(i.TEXTURE_CUBE_MAP),re.__version=ue.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function _e(D,A,J,ce,ue,re){const Ve=r.convert(J.format,J.colorSpace),Ce=r.convert(J.type),je=v(J.internalFormat,Ve,Ce,J.colorSpace),We=n.get(A),me=n.get(J);if(me.__renderTarget=A,!We.__hasExternalTextures){const we=Math.max(1,A.width>>re),nt=Math.max(1,A.height>>re);ue===i.TEXTURE_3D||ue===i.TEXTURE_2D_ARRAY?t.texImage3D(ue,re,je,we,nt,A.depth,0,Ve,Ce,null):t.texImage2D(ue,re,je,we,nt,0,Ve,Ce,null)}t.bindFramebuffer(i.FRAMEBUFFER,D),Ge(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ce,ue,me.__webglTexture,0,Ct(A)):(ue===i.TEXTURE_2D||ue>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ue<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ce,ue,me.__webglTexture,re),t.bindFramebuffer(i.FRAMEBUFFER,null)}function be(D,A,J){if(i.bindRenderbuffer(i.RENDERBUFFER,D),A.depthBuffer){const ce=A.depthTexture,ue=ce&&ce.isDepthTexture?ce.type:null,re=y(A.stencilBuffer,ue),Ve=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ce=Ct(A);Ge(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ce,re,A.width,A.height):J?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ce,re,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,re,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ve,i.RENDERBUFFER,D)}else{const ce=A.textures;for(let ue=0;ue<ce.length;ue++){const re=ce[ue],Ve=r.convert(re.format,re.colorSpace),Ce=r.convert(re.type),je=v(re.internalFormat,Ve,Ce,re.colorSpace),We=Ct(A);J&&Ge(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,We,je,A.width,A.height):Ge(A)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,We,je,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,je,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Re(D,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,D),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ce=n.get(A.depthTexture);ce.__renderTarget=A,(!ce.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),ne(A.depthTexture,0);const ue=ce.__webglTexture,re=Ct(A);if(A.depthTexture.format===hr)Ge(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ue,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ue,0);else if(A.depthTexture.format===dr)Ge(A)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ue,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ue,0);else throw new Error("Unknown depthTexture format")}function Ye(D){const A=n.get(D),J=D.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==D.depthTexture){const ce=D.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ce){const ue=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ce.removeEventListener("dispose",ue)};ce.addEventListener("dispose",ue),A.__depthDisposeCallback=ue}A.__boundDepthTexture=ce}if(D.depthTexture&&!A.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");const ce=D.texture.mipmaps;ce&&ce.length>0?Re(A.__webglFramebuffer[0],D):Re(A.__webglFramebuffer,D)}else if(J){A.__webglDepthbuffer=[];for(let ce=0;ce<6;ce++)if(t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[ce]),A.__webglDepthbuffer[ce]===void 0)A.__webglDepthbuffer[ce]=i.createRenderbuffer(),be(A.__webglDepthbuffer[ce],D,!1);else{const ue=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=A.__webglDepthbuffer[ce];i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,ue,i.RENDERBUFFER,re)}}else{const ce=D.texture.mipmaps;if(ce&&ce.length>0?t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),be(A.__webglDepthbuffer,D,!1);else{const ue=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,ue,i.RENDERBUFFER,re)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Pt(D,A,J){const ce=n.get(D);A!==void 0&&_e(ce.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),J!==void 0&&Ye(D)}function Ze(D){const A=D.texture,J=n.get(D),ce=n.get(A);D.addEventListener("dispose",R);const ue=D.textures,re=D.isWebGLCubeRenderTarget===!0,Ve=ue.length>1;if(Ve||(ce.__webglTexture===void 0&&(ce.__webglTexture=i.createTexture()),ce.__version=A.version,a.memory.textures++),re){J.__webglFramebuffer=[];for(let Ce=0;Ce<6;Ce++)if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer[Ce]=[];for(let je=0;je<A.mipmaps.length;je++)J.__webglFramebuffer[Ce][je]=i.createFramebuffer()}else J.__webglFramebuffer[Ce]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){J.__webglFramebuffer=[];for(let Ce=0;Ce<A.mipmaps.length;Ce++)J.__webglFramebuffer[Ce]=i.createFramebuffer()}else J.__webglFramebuffer=i.createFramebuffer();if(Ve)for(let Ce=0,je=ue.length;Ce<je;Ce++){const We=n.get(ue[Ce]);We.__webglTexture===void 0&&(We.__webglTexture=i.createTexture(),a.memory.textures++)}if(D.samples>0&&Ge(D)===!1){J.__webglMultisampledFramebuffer=i.createFramebuffer(),J.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let Ce=0;Ce<ue.length;Ce++){const je=ue[Ce];J.__webglColorRenderbuffer[Ce]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,J.__webglColorRenderbuffer[Ce]);const We=r.convert(je.format,je.colorSpace),me=r.convert(je.type),we=v(je.internalFormat,We,me,je.colorSpace,D.isXRRenderTarget===!0),nt=Ct(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,we,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.RENDERBUFFER,J.__webglColorRenderbuffer[Ce])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(J.__webglDepthRenderbuffer=i.createRenderbuffer(),be(J.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(re){t.bindTexture(i.TEXTURE_CUBE_MAP,ce.__webglTexture),I(i.TEXTURE_CUBE_MAP,A);for(let Ce=0;Ce<6;Ce++)if(A.mipmaps&&A.mipmaps.length>0)for(let je=0;je<A.mipmaps.length;je++)_e(J.__webglFramebuffer[Ce][je],D,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,je);else _e(J.__webglFramebuffer[Ce],D,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0);x(A)&&h(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ve){for(let Ce=0,je=ue.length;Ce<je;Ce++){const We=ue[Ce],me=n.get(We);let we=i.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(we=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(we,me.__webglTexture),I(we,We),_e(J.__webglFramebuffer,D,We,i.COLOR_ATTACHMENT0+Ce,we,0),x(We)&&h(we)}t.unbindTexture()}else{let Ce=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(Ce=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Ce,ce.__webglTexture),I(Ce,A),A.mipmaps&&A.mipmaps.length>0)for(let je=0;je<A.mipmaps.length;je++)_e(J.__webglFramebuffer[je],D,A,i.COLOR_ATTACHMENT0,Ce,je);else _e(J.__webglFramebuffer,D,A,i.COLOR_ATTACHMENT0,Ce,0);x(A)&&h(Ce),t.unbindTexture()}D.depthBuffer&&Ye(D)}function Tt(D){const A=D.textures;for(let J=0,ce=A.length;J<ce;J++){const ue=A[J];if(x(ue)){const re=M(D),Ve=n.get(ue).__webglTexture;t.bindTexture(re,Ve),h(re),t.unbindTexture()}}}const z=[],ft=[];function ht(D){if(D.samples>0){if(Ge(D)===!1){const A=D.textures,J=D.width,ce=D.height;let ue=i.COLOR_BUFFER_BIT;const re=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ve=n.get(D),Ce=A.length>1;if(Ce)for(let We=0;We<A.length;We++)t.bindFramebuffer(i.FRAMEBUFFER,Ve.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+We,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ve.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+We,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ve.__webglMultisampledFramebuffer);const je=D.texture.mipmaps;je&&je.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ve.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ve.__webglFramebuffer);for(let We=0;We<A.length;We++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ue|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ue|=i.STENCIL_BUFFER_BIT)),Ce){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ve.__webglColorRenderbuffer[We]);const me=n.get(A[We]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,me,0)}i.blitFramebuffer(0,0,J,ce,0,0,J,ce,ue,i.NEAREST),c===!0&&(z.length=0,ft.length=0,z.push(i.COLOR_ATTACHMENT0+We),D.depthBuffer&&D.resolveDepthBuffer===!1&&(z.push(re),ft.push(re),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ft)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,z))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Ce)for(let We=0;We<A.length;We++){t.bindFramebuffer(i.FRAMEBUFFER,Ve.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+We,i.RENDERBUFFER,Ve.__webglColorRenderbuffer[We]);const me=n.get(A[We]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ve.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+We,i.TEXTURE_2D,me,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ve.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const A=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function Ct(D){return Math.min(s.maxSamples,D.samples)}function Ge(D){const A=n.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function It(D){const A=a.render.frame;d.get(D)!==A&&(d.set(D,A),D.update())}function $e(D,A){const J=D.colorSpace,ce=D.format,ue=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||J!==Cs&&J!==wi&&(Et.getTransfer(J)===Ft?(ce!==Bn||ue!==jn)&&lt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ht("WebGLTextures: Unsupported texture color space:",J)),A}function ot(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(l.width=D.naturalWidth||D.width,l.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(l.width=D.displayWidth,l.height=D.displayHeight):(l.width=D.width,l.height=D.height),l}this.allocateTextureUnit=H,this.resetTextureUnits=U,this.setTexture2D=ne,this.setTexture2DArray=W,this.setTexture3D=Q,this.setTextureCube=ie,this.rebindTextures=Pt,this.setupRenderTarget=Ze,this.updateRenderTargetMipmap=Tt,this.updateMultisampleRenderTarget=ht,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=_e,this.useMultisampledRTT=Ge}function Cg(i,e){function t(n,s=wi){let r;const a=Et.getTransfer(s);if(n===jn)return i.UNSIGNED_BYTE;if(n===Mc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Sc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Dh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ih)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ph)return i.BYTE;if(n===Lh)return i.SHORT;if(n===cr)return i.UNSIGNED_SHORT;if(n===_c)return i.INT;if(n===ji)return i.UNSIGNED_INT;if(n===qn)return i.FLOAT;if(n===Kn)return i.HALF_FLOAT;if(n===Uh)return i.ALPHA;if(n===Fh)return i.RGB;if(n===Bn)return i.RGBA;if(n===hr)return i.DEPTH_COMPONENT;if(n===dr)return i.DEPTH_STENCIL;if(n===yc)return i.RED;if(n===bc)return i.RED_INTEGER;if(n===wc)return i.RG;if(n===Tc)return i.RG_INTEGER;if(n===Ec)return i.RGBA_INTEGER;if(n===na||n===ia||n===sa||n===ra)if(a===Ft)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===na)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ia)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ra)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===na)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ia)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===sa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ra)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Lo||n===Do||n===Io||n===Uo)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Lo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Do)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Io)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Uo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Fo||n===No||n===Oo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Fo||n===No)return a===Ft?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Oo)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Bo||n===zo||n===ko||n===Vo||n===Go||n===Ho||n===Wo||n===Xo||n===Yo||n===qo||n===Zo||n===$o||n===Ko||n===Jo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Bo)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===zo)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ko)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Vo)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Go)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ho)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Wo)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Xo)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Yo)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===qo)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Zo)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===$o)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ko)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Jo)return a===Ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===jo||n===Qo||n===ec)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===jo)return a===Ft?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Qo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ec)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===tc||n===nc||n===ic||n===sc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===tc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===nc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ic)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===sc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===lr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Rg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Pg=`
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

}`;class Lg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Zh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new cn({vertexShader:Rg,fragmentShader:Pg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new V(new Bt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Dg extends Is{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,u=null,p=null,m=null,g=null;const _=typeof XRWebGLBinding<"u",x=new Lg,h={},M=t.getContextAttributes();let v=null,y=null;const E=[],T=[],R=new Ie;let C=null;const b=new bn;b.viewport=new Nt;const S=new bn;S.viewport=new Nt;const L=[b,S],U=new Kf;let H=null,te=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let K=E[$];return K===void 0&&(K=new Ka,E[$]=K),K.getTargetRaySpace()},this.getControllerGrip=function($){let K=E[$];return K===void 0&&(K=new Ka,E[$]=K),K.getGripSpace()},this.getHand=function($){let K=E[$];return K===void 0&&(K=new Ka,E[$]=K),K.getHandSpace()};function ne($){const K=T.indexOf($.inputSource);if(K===-1)return;const _e=E[K];_e!==void 0&&(_e.update($.inputSource,$.frame,l||a),_e.dispatchEvent({type:$.type,data:$.inputSource}))}function W(){s.removeEventListener("select",ne),s.removeEventListener("selectstart",ne),s.removeEventListener("selectend",ne),s.removeEventListener("squeeze",ne),s.removeEventListener("squeezestart",ne),s.removeEventListener("squeezeend",ne),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",Q);for(let $=0;$<E.length;$++){const K=T[$];K!==null&&(T[$]=null,E[$].disconnect(K))}H=null,te=null,x.reset();for(const $ in h)delete h[$];e.setRenderTarget(v),m=null,p=null,u=null,s=null,y=null,Se.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&lt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&lt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",ne),s.addEventListener("selectstart",ne),s.addEventListener("selectend",ne),s.addEventListener("squeeze",ne),s.addEventListener("squeezestart",ne),s.addEventListener("squeezeend",ne),s.addEventListener("end",W),s.addEventListener("inputsourceschange",Q),M.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let _e=null,be=null,Re=null;M.depth&&(Re=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=M.stencil?dr:hr,be=M.stencil?lr:ji);const Ye={colorFormat:t.RGBA8,depthFormat:Re,scaleFactor:r};u=this.getBinding(),p=u.createProjectionLayer(Ye),s.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),y=new zn(p.textureWidth,p.textureHeight,{format:Bn,type:jn,depthTexture:new qh(p.textureWidth,p.textureHeight,be,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{const _e={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,_e),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new zn(m.framebufferWidth,m.framebufferHeight,{format:Bn,type:jn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Se.setContext(s),Se.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function Q($){for(let K=0;K<$.removed.length;K++){const _e=$.removed[K],be=T.indexOf(_e);be>=0&&(T[be]=null,E[be].disconnect(_e))}for(let K=0;K<$.added.length;K++){const _e=$.added[K];let be=T.indexOf(_e);if(be===-1){for(let Ye=0;Ye<E.length;Ye++)if(Ye>=T.length){T.push(_e),be=Ye;break}else if(T[Ye]===null){T[Ye]=_e,be=Ye;break}if(be===-1)break}const Re=E[be];Re&&Re.connect(_e)}}const ie=new P,de=new P;function fe($,K,_e){ie.setFromMatrixPosition(K.matrixWorld),de.setFromMatrixPosition(_e.matrixWorld);const be=ie.distanceTo(de),Re=K.projectionMatrix.elements,Ye=_e.projectionMatrix.elements,Pt=Re[14]/(Re[10]-1),Ze=Re[14]/(Re[10]+1),Tt=(Re[9]+1)/Re[5],z=(Re[9]-1)/Re[5],ft=(Re[8]-1)/Re[0],ht=(Ye[8]+1)/Ye[0],Ct=Pt*ft,Ge=Pt*ht,It=be/(-ft+ht),$e=It*-ft;if(K.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX($e),$.translateZ(It),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Re[10]===-1)$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const ot=Pt+It,D=Ze+It,A=Ct-$e,J=Ge+(be-$e),ce=Tt*Ze/D*ot,ue=z*Ze/D*ot;$.projectionMatrix.makePerspective(A,J,ce,ue,ot,D),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function ze($,K){K===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(K.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let K=$.near,_e=$.far;x.texture!==null&&(x.depthNear>0&&(K=x.depthNear),x.depthFar>0&&(_e=x.depthFar)),U.near=S.near=b.near=K,U.far=S.far=b.far=_e,(H!==U.near||te!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),H=U.near,te=U.far),U.layers.mask=$.layers.mask|6,b.layers.mask=U.layers.mask&3,S.layers.mask=U.layers.mask&5;const be=$.parent,Re=U.cameras;ze(U,be);for(let Ye=0;Ye<Re.length;Ye++)ze(Re[Ye],be);Re.length===2?fe(U,b,S):U.projectionMatrix.copy(b.projectionMatrix),I($,U,be)};function I($,K,_e){_e===null?$.matrix.copy(K.matrixWorld):($.matrix.copy(_e.matrixWorld),$.matrix.invert(),$.matrix.multiply(K.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(K.projectionMatrix),$.projectionMatrixInverse.copy(K.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=fr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(p===null&&m===null))return c},this.setFoveation=function($){c=$,p!==null&&(p.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(U)},this.getCameraTexture=function($){return h[$]};let ye=null;function Me($,K){if(d=K.getViewerPose(l||a),g=K,d!==null){const _e=d.views;m!==null&&(e.setRenderTargetFramebuffer(y,m.framebuffer),e.setRenderTarget(y));let be=!1;_e.length!==U.cameras.length&&(U.cameras.length=0,be=!0);for(let Ze=0;Ze<_e.length;Ze++){const Tt=_e[Ze];let z=null;if(m!==null)z=m.getViewport(Tt);else{const ht=u.getViewSubImage(p,Tt);z=ht.viewport,Ze===0&&(e.setRenderTargetTextures(y,ht.colorTexture,ht.depthStencilTexture),e.setRenderTarget(y))}let ft=L[Ze];ft===void 0&&(ft=new bn,ft.layers.enable(Ze),ft.viewport=new Nt,L[Ze]=ft),ft.matrix.fromArray(Tt.transform.matrix),ft.matrix.decompose(ft.position,ft.quaternion,ft.scale),ft.projectionMatrix.fromArray(Tt.projectionMatrix),ft.projectionMatrixInverse.copy(ft.projectionMatrix).invert(),ft.viewport.set(z.x,z.y,z.width,z.height),Ze===0&&(U.matrix.copy(ft.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),be===!0&&U.cameras.push(ft)}const Re=s.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const Ze=u.getDepthInformation(_e[0]);Ze&&Ze.isValid&&Ze.texture&&x.init(Ze,s.renderState)}if(Re&&Re.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let Ze=0;Ze<_e.length;Ze++){const Tt=_e[Ze].camera;if(Tt){let z=h[Tt];z||(z=new Zh,h[Tt]=z);const ft=u.getCameraImage(Tt);z.sourceTexture=ft}}}}for(let _e=0;_e<E.length;_e++){const be=T[_e],Re=E[_e];be!==null&&Re!==void 0&&Re.update(be,K,l||a)}ye&&ye($,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),g=null}const Se=new rd;Se.setAnimationLoop(Me),this.setAnimationLoop=function($){ye=$},this.dispose=function(){}}}const zi=new Gn,Ig=new Dt;function Ug(i,e){function t(x,h){x.matrixAutoUpdate===!0&&x.updateMatrix(),h.value.copy(x.matrix)}function n(x,h){h.color.getRGB(x.fogColor.value,Gh(i)),h.isFog?(x.fogNear.value=h.near,x.fogFar.value=h.far):h.isFogExp2&&(x.fogDensity.value=h.density)}function s(x,h,M,v,y){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(x,h):h.isMeshToonMaterial?(r(x,h),u(x,h)):h.isMeshPhongMaterial?(r(x,h),d(x,h)):h.isMeshStandardMaterial?(r(x,h),p(x,h),h.isMeshPhysicalMaterial&&m(x,h,y)):h.isMeshMatcapMaterial?(r(x,h),g(x,h)):h.isMeshDepthMaterial?r(x,h):h.isMeshDistanceMaterial?(r(x,h),_(x,h)):h.isMeshNormalMaterial?r(x,h):h.isLineBasicMaterial?(a(x,h),h.isLineDashedMaterial&&o(x,h)):h.isPointsMaterial?c(x,h,M,v):h.isSpriteMaterial?l(x,h):h.isShadowMaterial?(x.color.value.copy(h.color),x.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(x,h){x.opacity.value=h.opacity,h.color&&x.diffuse.value.copy(h.color),h.emissive&&x.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(x.map.value=h.map,t(h.map,x.mapTransform)),h.alphaMap&&(x.alphaMap.value=h.alphaMap,t(h.alphaMap,x.alphaMapTransform)),h.bumpMap&&(x.bumpMap.value=h.bumpMap,t(h.bumpMap,x.bumpMapTransform),x.bumpScale.value=h.bumpScale,h.side===ln&&(x.bumpScale.value*=-1)),h.normalMap&&(x.normalMap.value=h.normalMap,t(h.normalMap,x.normalMapTransform),x.normalScale.value.copy(h.normalScale),h.side===ln&&x.normalScale.value.negate()),h.displacementMap&&(x.displacementMap.value=h.displacementMap,t(h.displacementMap,x.displacementMapTransform),x.displacementScale.value=h.displacementScale,x.displacementBias.value=h.displacementBias),h.emissiveMap&&(x.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,x.emissiveMapTransform)),h.specularMap&&(x.specularMap.value=h.specularMap,t(h.specularMap,x.specularMapTransform)),h.alphaTest>0&&(x.alphaTest.value=h.alphaTest);const M=e.get(h),v=M.envMap,y=M.envMapRotation;v&&(x.envMap.value=v,zi.copy(y),zi.x*=-1,zi.y*=-1,zi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(zi.y*=-1,zi.z*=-1),x.envMapRotation.value.setFromMatrix4(Ig.makeRotationFromEuler(zi)),x.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=h.reflectivity,x.ior.value=h.ior,x.refractionRatio.value=h.refractionRatio),h.lightMap&&(x.lightMap.value=h.lightMap,x.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,x.lightMapTransform)),h.aoMap&&(x.aoMap.value=h.aoMap,x.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,x.aoMapTransform))}function a(x,h){x.diffuse.value.copy(h.color),x.opacity.value=h.opacity,h.map&&(x.map.value=h.map,t(h.map,x.mapTransform))}function o(x,h){x.dashSize.value=h.dashSize,x.totalSize.value=h.dashSize+h.gapSize,x.scale.value=h.scale}function c(x,h,M,v){x.diffuse.value.copy(h.color),x.opacity.value=h.opacity,x.size.value=h.size*M,x.scale.value=v*.5,h.map&&(x.map.value=h.map,t(h.map,x.uvTransform)),h.alphaMap&&(x.alphaMap.value=h.alphaMap,t(h.alphaMap,x.alphaMapTransform)),h.alphaTest>0&&(x.alphaTest.value=h.alphaTest)}function l(x,h){x.diffuse.value.copy(h.color),x.opacity.value=h.opacity,x.rotation.value=h.rotation,h.map&&(x.map.value=h.map,t(h.map,x.mapTransform)),h.alphaMap&&(x.alphaMap.value=h.alphaMap,t(h.alphaMap,x.alphaMapTransform)),h.alphaTest>0&&(x.alphaTest.value=h.alphaTest)}function d(x,h){x.specular.value.copy(h.specular),x.shininess.value=Math.max(h.shininess,1e-4)}function u(x,h){h.gradientMap&&(x.gradientMap.value=h.gradientMap)}function p(x,h){x.metalness.value=h.metalness,h.metalnessMap&&(x.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,x.metalnessMapTransform)),x.roughness.value=h.roughness,h.roughnessMap&&(x.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,x.roughnessMapTransform)),h.envMap&&(x.envMapIntensity.value=h.envMapIntensity)}function m(x,h,M){x.ior.value=h.ior,h.sheen>0&&(x.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),x.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(x.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,x.sheenColorMapTransform)),h.sheenRoughnessMap&&(x.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,x.sheenRoughnessMapTransform))),h.clearcoat>0&&(x.clearcoat.value=h.clearcoat,x.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(x.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,x.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(x.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===ln&&x.clearcoatNormalScale.value.negate())),h.dispersion>0&&(x.dispersion.value=h.dispersion),h.iridescence>0&&(x.iridescence.value=h.iridescence,x.iridescenceIOR.value=h.iridescenceIOR,x.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(x.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,x.iridescenceMapTransform)),h.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),h.transmission>0&&(x.transmission.value=h.transmission,x.transmissionSamplerMap.value=M.texture,x.transmissionSamplerSize.value.set(M.width,M.height),h.transmissionMap&&(x.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,x.transmissionMapTransform)),x.thickness.value=h.thickness,h.thicknessMap&&(x.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=h.attenuationDistance,x.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(x.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(x.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=h.specularIntensity,x.specularColor.value.copy(h.specularColor),h.specularColorMap&&(x.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,x.specularColorMapTransform)),h.specularIntensityMap&&(x.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,x.specularIntensityMapTransform))}function g(x,h){h.matcap&&(x.matcap.value=h.matcap)}function _(x,h){const M=e.get(h).light;x.referencePosition.value.setFromMatrixPosition(M.matrixWorld),x.nearDistance.value=M.shadow.camera.near,x.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Fg(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,v){const y=v.program;n.uniformBlockBinding(M,y)}function l(M,v){let y=s[M.id];y===void 0&&(g(M),y=d(M),s[M.id]=y,M.addEventListener("dispose",x));const E=v.program;n.updateUBOMapping(M,E);const T=e.render.frame;r[M.id]!==T&&(p(M),r[M.id]=T)}function d(M){const v=u();M.__bindingPointIndex=v;const y=i.createBuffer(),E=M.__size,T=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,E,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,y),y}function u(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return Ht("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(M){const v=s[M.id],y=M.uniforms,E=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let T=0,R=y.length;T<R;T++){const C=Array.isArray(y[T])?y[T]:[y[T]];for(let b=0,S=C.length;b<S;b++){const L=C[b];if(m(L,T,b,E)===!0){const U=L.__offset,H=Array.isArray(L.value)?L.value:[L.value];let te=0;for(let ne=0;ne<H.length;ne++){const W=H[ne],Q=_(W);typeof W=="number"||typeof W=="boolean"?(L.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,U+te,L.__data)):W.isMatrix3?(L.__data[0]=W.elements[0],L.__data[1]=W.elements[1],L.__data[2]=W.elements[2],L.__data[3]=0,L.__data[4]=W.elements[3],L.__data[5]=W.elements[4],L.__data[6]=W.elements[5],L.__data[7]=0,L.__data[8]=W.elements[6],L.__data[9]=W.elements[7],L.__data[10]=W.elements[8],L.__data[11]=0):(W.toArray(L.__data,te),te+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,U,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(M,v,y,E){const T=M.value,R=v+"_"+y;if(E[R]===void 0)return typeof T=="number"||typeof T=="boolean"?E[R]=T:E[R]=T.clone(),!0;{const C=E[R];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return E[R]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function g(M){const v=M.uniforms;let y=0;const E=16;for(let R=0,C=v.length;R<C;R++){const b=Array.isArray(v[R])?v[R]:[v[R]];for(let S=0,L=b.length;S<L;S++){const U=b[S],H=Array.isArray(U.value)?U.value:[U.value];for(let te=0,ne=H.length;te<ne;te++){const W=H[te],Q=_(W),ie=y%E,de=ie%Q.boundary,fe=ie+de;y+=de,fe!==0&&E-fe<Q.storage&&(y+=E-fe),U.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=y,y+=Q.storage}}}const T=y%E;return T>0&&(y+=E-T),M.__size=y,M.__cache={},this}function _(M){const v={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(v.boundary=4,v.storage=4):M.isVector2?(v.boundary=8,v.storage=8):M.isVector3||M.isColor?(v.boundary=16,v.storage=12):M.isVector4?(v.boundary=16,v.storage=16):M.isMatrix3?(v.boundary=48,v.storage=48):M.isMatrix4?(v.boundary=64,v.storage=64):M.isTexture?lt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):lt("WebGLRenderer: Unsupported uniform value type.",M),v}function x(M){const v=M.target;v.removeEventListener("dispose",x);const y=a.indexOf(v.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function h(){for(const M in s)i.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:c,update:l,dispose:h}}const Ng=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let oi=null;function Og(){return oi===null&&(oi=new Yh(Ng,32,32,wc,Kn),oi.minFilter=Pn,oi.magFilter=Pn,oi.wrapS=di,oi.wrapT=di,oi.generateMipmaps=!1,oi.needsUpdate=!0),oi}class Bg{constructor(e={}){const{canvas:t=_u(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:p=!1}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const g=new Set([Ec,Tc,bc]),_=new Set([jn,ji,cr,lr,Mc,Sc]),x=new Uint32Array(4),h=new Int32Array(4);let M=null,v=null;const y=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ci,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let R=!1;this._outputColorSpace=Rt;let C=0,b=0,S=null,L=-1,U=null;const H=new Nt,te=new Nt;let ne=null;const W=new it(0);let Q=0,ie=t.width,de=t.height,fe=1,ze=null,I=null;const ye=new Nt(0,0,ie,de),Me=new Nt(0,0,ie,de);let Se=!1;const $=new Ic;let K=!1,_e=!1;const be=new Dt,Re=new P,Ye=new Nt,Pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ze=!1;function Tt(){return S===null?fe:1}let z=n;function ft(w,O){return t.getContext(w,O)}try{const w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${xc}`),t.addEventListener("webglcontextlost",xe,!1),t.addEventListener("webglcontextrestored",le,!1),t.addEventListener("webglcontextcreationerror",ke,!1),z===null){const O="webgl2";if(z=ft(O,w),z===null)throw ft(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw w("WebGLRenderer: "+w.message),w}let ht,Ct,Ge,It,$e,ot,D,A,J,ce,ue,re,Ve,Ce,je,We,me,we,nt,Qe,Oe,rt,k,Pe;function Te(){ht=new Ym(z),ht.init(),rt=new Cg(z,ht),Ct=new Om(z,ht,e,rt),Ge=new Eg(z,ht),Ct.reversedDepthBuffer&&p&&Ge.buffers.depth.setReversed(!0),It=new $m(z),$e=new fg,ot=new Ag(z,ht,Ge,$e,Ct,rt,It),D=new zm(T),A=new Xm(T),J=new Qf(z),k=new Fm(z,J),ce=new qm(z,J,It,k),ue=new Jm(z,ce,J,It),nt=new Km(z,Ct,ot),We=new Bm($e),re=new ug(T,D,A,ht,Ct,k,We),Ve=new Ug(T,$e),Ce=new mg,je=new Sg(ht),we=new Um(T,D,A,Ge,ue,m,c),me=new wg(T,ue,Ct),Pe=new Fg(z,It,Ct,Ge),Qe=new Nm(z,ht,It),Oe=new Zm(z,ht,It),It.programs=re.programs,T.capabilities=Ct,T.extensions=ht,T.properties=$e,T.renderLists=Ce,T.shadowMap=me,T.state=Ge,T.info=It}Te();const Ee=new Dg(T,z);this.xr=Ee,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){const w=ht.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=ht.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return fe},this.setPixelRatio=function(w){w!==void 0&&(fe=w,this.setSize(ie,de,!1))},this.getSize=function(w){return w.set(ie,de)},this.setSize=function(w,O,G=!0){if(Ee.isPresenting){lt("WebGLRenderer: Can't change size while VR device is presenting.");return}ie=w,de=O,t.width=Math.floor(w*fe),t.height=Math.floor(O*fe),G===!0&&(t.style.width=w+"px",t.style.height=O+"px"),this.setViewport(0,0,w,O)},this.getDrawingBufferSize=function(w){return w.set(ie*fe,de*fe).floor()},this.setDrawingBufferSize=function(w,O,G){ie=w,de=O,fe=G,t.width=Math.floor(w*G),t.height=Math.floor(O*G),this.setViewport(0,0,w,O)},this.getCurrentViewport=function(w){return w.copy(H)},this.getViewport=function(w){return w.copy(ye)},this.setViewport=function(w,O,G,Y){w.isVector4?ye.set(w.x,w.y,w.z,w.w):ye.set(w,O,G,Y),Ge.viewport(H.copy(ye).multiplyScalar(fe).round())},this.getScissor=function(w){return w.copy(Me)},this.setScissor=function(w,O,G,Y){w.isVector4?Me.set(w.x,w.y,w.z,w.w):Me.set(w,O,G,Y),Ge.scissor(te.copy(Me).multiplyScalar(fe).round())},this.getScissorTest=function(){return Se},this.setScissorTest=function(w){Ge.setScissorTest(Se=w)},this.setOpaqueSort=function(w){ze=w},this.setTransparentSort=function(w){I=w},this.getClearColor=function(w){return w.copy(we.getClearColor())},this.setClearColor=function(){we.setClearColor(...arguments)},this.getClearAlpha=function(){return we.getClearAlpha()},this.setClearAlpha=function(){we.setClearAlpha(...arguments)},this.clear=function(w=!0,O=!0,G=!0){let Y=0;if(w){let B=!1;if(S!==null){const Z=S.texture.format;B=g.has(Z)}if(B){const Z=S.texture.type,he=_.has(Z),pe=we.getClearColor(),ge=we.getClearAlpha(),Ae=pe.r,ve=pe.g,Fe=pe.b;he?(x[0]=Ae,x[1]=ve,x[2]=Fe,x[3]=ge,z.clearBufferuiv(z.COLOR,0,x)):(h[0]=Ae,h[1]=ve,h[2]=Fe,h[3]=ge,z.clearBufferiv(z.COLOR,0,h))}else Y|=z.COLOR_BUFFER_BIT}O&&(Y|=z.DEPTH_BUFFER_BIT),G&&(Y|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",xe,!1),t.removeEventListener("webglcontextrestored",le,!1),t.removeEventListener("webglcontextcreationerror",ke,!1),we.dispose(),Ce.dispose(),je.dispose(),$e.dispose(),D.dispose(),A.dispose(),ue.dispose(),k.dispose(),Pe.dispose(),re.dispose(),Ee.dispose(),Ee.removeEventListener("sessionstart",ei),Ee.removeEventListener("sessionend",Li),ti.stop()};function xe(w){w.preventDefault(),nl("WebGLRenderer: Context Lost."),R=!0}function le(){nl("WebGLRenderer: Context Restored."),R=!1;const w=It.autoReset,O=me.enabled,G=me.autoUpdate,Y=me.needsUpdate,B=me.type;Te(),It.autoReset=w,me.enabled=O,me.autoUpdate=G,me.needsUpdate=Y,me.type=B}function ke(w){Ht("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function st(w){const O=w.target;O.removeEventListener("dispose",st),yt(O)}function yt(w){Ut(w),$e.remove(w)}function Ut(w){const O=$e.get(w).programs;O!==void 0&&(O.forEach(function(G){re.releaseProgram(G)}),w.isShaderMaterial&&re.releaseShaderCache(w))}this.renderBufferDirect=function(w,O,G,Y,B,Z){O===null&&(O=Pt);const he=B.isMesh&&B.matrixWorld.determinant()<0,pe=X(w,O,G,Y,B);Ge.setMaterial(Y,he);let ge=G.index,Ae=1;if(Y.wireframe===!0){if(ge=ce.getWireframeAttribute(G),ge===void 0)return;Ae=2}const ve=G.drawRange,Fe=G.attributes.position;let Ke=ve.start*Ae,dt=(ve.start+ve.count)*Ae;Z!==null&&(Ke=Math.max(Ke,Z.start*Ae),dt=Math.min(dt,(Z.start+Z.count)*Ae)),ge!==null?(Ke=Math.max(Ke,0),dt=Math.min(dt,ge.count)):Fe!=null&&(Ke=Math.max(Ke,0),dt=Math.min(dt,Fe.count));const Mt=dt-Ke;if(Mt<0||Mt===1/0)return;k.setup(B,Y,pe,G,ge);let St,mt=Qe;if(ge!==null&&(St=J.get(ge),mt=Oe,mt.setIndex(St)),B.isMesh)Y.wireframe===!0?(Ge.setLineWidth(Y.wireframeLinewidth*Tt()),mt.setMode(z.LINES)):mt.setMode(z.TRIANGLES);else if(B.isLine){let He=Y.linewidth;He===void 0&&(He=1),Ge.setLineWidth(He*Tt()),B.isLineSegments?mt.setMode(z.LINES):B.isLineLoop?mt.setMode(z.LINE_LOOP):mt.setMode(z.LINE_STRIP)}else B.isPoints?mt.setMode(z.POINTS):B.isSprite&&mt.setMode(z.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)ur("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),mt.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(ht.get("WEBGL_multi_draw"))mt.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const He=B._multiDrawStarts,Lt=B._multiDrawCounts,ct=B._multiDrawCount,zt=ge?J.get(ge).bytesPerElement:1,Mn=$e.get(Y).currentProgram.getUniforms();for(let Yt=0;Yt<ct;Yt++)Mn.setValue(z,"_gl_DrawID",Yt),mt.render(He[Yt]/zt,Lt[Yt])}else if(B.isInstancedMesh)mt.renderInstances(Ke,Mt,B.count);else if(G.isInstancedBufferGeometry){const He=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Lt=Math.min(G.instanceCount,He);mt.renderInstances(Ke,Mt,Lt)}else mt.render(Ke,Mt)};function Tn(w,O,G){w.transparent===!0&&w.side===gt&&w.forceSinglePass===!1?(w.side=ln,w.needsUpdate=!0,Di(w,O,G),w.side=Pi,w.needsUpdate=!0,Di(w,O,G),w.side=gt):Di(w,O,G)}this.compile=function(w,O,G=null){G===null&&(G=w),v=je.get(G),v.init(O),E.push(v),G.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(v.pushLight(B),B.castShadow&&v.pushShadow(B))}),w!==G&&w.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(v.pushLight(B),B.castShadow&&v.pushShadow(B))}),v.setupLights();const Y=new Set;return w.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const Z=B.material;if(Z)if(Array.isArray(Z))for(let he=0;he<Z.length;he++){const pe=Z[he];Tn(pe,G,B),Y.add(pe)}else Tn(Z,G,B),Y.add(Z)}),v=E.pop(),Y},this.compileAsync=function(w,O,G=null){const Y=this.compile(w,O,G);return new Promise(B=>{function Z(){if(Y.forEach(function(he){$e.get(he).currentProgram.isReady()&&Y.delete(he)}),Y.size===0){B(w);return}setTimeout(Z,10)}ht.get("KHR_parallel_shader_compile")!==null?Z():setTimeout(Z,10)})};let xn=null;function br(w){xn&&xn(w)}function ei(){ti.stop()}function Li(){ti.start()}const ti=new rd;ti.setAnimationLoop(br),typeof self<"u"&&ti.setContext(self),this.setAnimationLoop=function(w){xn=w,Ee.setAnimationLoop(w),w===null?ti.stop():ti.start()},Ee.addEventListener("sessionstart",ei),Ee.addEventListener("sessionend",Li),this.render=function(w,O){if(O!==void 0&&O.isCamera!==!0){Ht("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Ee.enabled===!0&&Ee.isPresenting===!0&&(Ee.cameraAutoUpdate===!0&&Ee.updateCamera(O),O=Ee.getCamera()),w.isScene===!0&&w.onBeforeRender(T,w,O,S),v=je.get(w,E.length),v.init(O),E.push(v),be.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),$.setFromProjectionMatrix(be,Zn,O.reversedDepth),_e=this.localClippingEnabled,K=We.init(this.clippingPlanes,_e),M=Ce.get(w,y.length),M.init(),y.push(M),Ee.enabled===!0&&Ee.isPresenting===!0){const Z=T.xr.getDepthSensingMesh();Z!==null&&Bs(Z,O,-1/0,T.sortObjects)}Bs(w,O,0,T.sortObjects),M.finish(),T.sortObjects===!0&&M.sort(ze,I),Ze=Ee.enabled===!1||Ee.isPresenting===!1||Ee.hasDepthSensing()===!1,Ze&&we.addToRenderList(M,w),this.info.render.frame++,K===!0&&We.beginShadows();const G=v.state.shadowsArray;me.render(G,w,O),K===!0&&We.endShadows(),this.info.autoReset===!0&&this.info.reset();const Y=M.opaque,B=M.transmissive;if(v.setupLights(),O.isArrayCamera){const Z=O.cameras;if(B.length>0)for(let he=0,pe=Z.length;he<pe;he++){const ge=Z[he];Tr(Y,B,w,ge)}Ze&&we.render(w);for(let he=0,pe=Z.length;he<pe;he++){const ge=Z[he];wr(M,w,ge,ge.viewport)}}else B.length>0&&Tr(Y,B,w,O),Ze&&we.render(w),wr(M,w,O);S!==null&&b===0&&(ot.updateMultisampleRenderTarget(S),ot.updateRenderTargetMipmap(S)),w.isScene===!0&&w.onAfterRender(T,w,O),k.resetDefaultState(),L=-1,U=null,E.pop(),E.length>0?(v=E[E.length-1],K===!0&&We.setGlobalState(T.clippingPlanes,v.state.camera)):v=null,y.pop(),y.length>0?M=y[y.length-1]:M=null};function Bs(w,O,G,Y){if(w.visible===!1)return;if(w.layers.test(O.layers)){if(w.isGroup)G=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(O);else if(w.isLight)v.pushLight(w),w.castShadow&&v.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||$.intersectsSprite(w)){Y&&Ye.setFromMatrixPosition(w.matrixWorld).applyMatrix4(be);const he=ue.update(w),pe=w.material;pe.visible&&M.push(w,he,pe,G,Ye.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||$.intersectsObject(w))){const he=ue.update(w),pe=w.material;if(Y&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ye.copy(w.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),Ye.copy(he.boundingSphere.center)),Ye.applyMatrix4(w.matrixWorld).applyMatrix4(be)),Array.isArray(pe)){const ge=he.groups;for(let Ae=0,ve=ge.length;Ae<ve;Ae++){const Fe=ge[Ae],Ke=pe[Fe.materialIndex];Ke&&Ke.visible&&M.push(w,he,Ke,G,Ye.z,Fe)}}else pe.visible&&M.push(w,he,pe,G,Ye.z,null)}}const Z=w.children;for(let he=0,pe=Z.length;he<pe;he++)Bs(Z[he],O,G,Y)}function wr(w,O,G,Y){const{opaque:B,transmissive:Z,transparent:he}=w;v.setupLightsView(G),K===!0&&We.setGlobalState(T.clippingPlanes,G),Y&&Ge.viewport(H.copy(Y)),B.length>0&&Zt(B,O,G),Z.length>0&&Zt(Z,O,G),he.length>0&&Zt(he,O,G),Ge.buffers.depth.setTest(!0),Ge.buffers.depth.setMask(!0),Ge.buffers.color.setMask(!0),Ge.setPolygonOffset(!1)}function Tr(w,O,G,Y){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[Y.id]===void 0&&(v.state.transmissionRenderTarget[Y.id]=new zn(1,1,{generateMipmaps:!0,type:ht.has("EXT_color_buffer_half_float")||ht.has("EXT_color_buffer_float")?Kn:jn,minFilter:Yi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Et.workingColorSpace}));const Z=v.state.transmissionRenderTarget[Y.id],he=Y.viewport||H;Z.setSize(he.z*T.transmissionResolutionScale,he.w*T.transmissionResolutionScale);const pe=T.getRenderTarget(),ge=T.getActiveCubeFace(),Ae=T.getActiveMipmapLevel();T.setRenderTarget(Z),T.getClearColor(W),Q=T.getClearAlpha(),Q<1&&T.setClearColor(16777215,.5),T.clear(),Ze&&we.render(G);const ve=T.toneMapping;T.toneMapping=Ci;const Fe=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),v.setupLightsView(Y),K===!0&&We.setGlobalState(T.clippingPlanes,Y),Zt(w,G,Y),ot.updateMultisampleRenderTarget(Z),ot.updateRenderTargetMipmap(Z),ht.has("WEBGL_multisampled_render_to_texture")===!1){let Ke=!1;for(let dt=0,Mt=O.length;dt<Mt;dt++){const St=O[dt],{object:mt,geometry:He,material:Lt,group:ct}=St;if(Lt.side===gt&&mt.layers.test(Y.layers)){const zt=Lt.side;Lt.side=ln,Lt.needsUpdate=!0,Er(mt,G,Y,He,Lt,ct),Lt.side=zt,Lt.needsUpdate=!0,Ke=!0}}Ke===!0&&(ot.updateMultisampleRenderTarget(Z),ot.updateRenderTargetMipmap(Z))}T.setRenderTarget(pe,ge,Ae),T.setClearColor(W,Q),Fe!==void 0&&(Y.viewport=Fe),T.toneMapping=ve}function Zt(w,O,G){const Y=O.isScene===!0?O.overrideMaterial:null;for(let B=0,Z=w.length;B<Z;B++){const he=w[B],{object:pe,geometry:ge,group:Ae}=he;let ve=he.material;ve.allowOverride===!0&&Y!==null&&(ve=Y),pe.layers.test(G.layers)&&Er(pe,O,G,ge,ve,Ae)}}function Er(w,O,G,Y,B,Z){w.onBeforeRender(T,O,G,Y,B,Z),w.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),B.onBeforeRender(T,O,G,Y,w,Z),B.transparent===!0&&B.side===gt&&B.forceSinglePass===!1?(B.side=ln,B.needsUpdate=!0,T.renderBufferDirect(G,O,Y,B,w,Z),B.side=Pi,B.needsUpdate=!0,T.renderBufferDirect(G,O,Y,B,w,Z),B.side=gt):T.renderBufferDirect(G,O,Y,B,w,Z),w.onAfterRender(T,O,G,Y,B,Z)}function Di(w,O,G){O.isScene!==!0&&(O=Pt);const Y=$e.get(w),B=v.state.lights,Z=v.state.shadowsArray,he=B.state.version,pe=re.getParameters(w,B.state,Z,O,G),ge=re.getProgramCacheKey(pe);let Ae=Y.programs;Y.environment=w.isMeshStandardMaterial?O.environment:null,Y.fog=O.fog,Y.envMap=(w.isMeshStandardMaterial?A:D).get(w.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&w.envMap===null?O.environmentRotation:w.envMapRotation,Ae===void 0&&(w.addEventListener("dispose",st),Ae=new Map,Y.programs=Ae);let ve=Ae.get(ge);if(ve!==void 0){if(Y.currentProgram===ve&&Y.lightsStateVersion===he)return N(w,pe),ve}else pe.uniforms=re.getUniforms(w),w.onBeforeCompile(pe,T),ve=re.acquireProgram(pe,ge),Ae.set(ge,ve),Y.uniforms=pe.uniforms;const Fe=Y.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Fe.clippingPlanes=We.uniform),N(w,pe),Y.needsLights=ee(w),Y.lightsStateVersion=he,Y.needsLights&&(Fe.ambientLightColor.value=B.state.ambient,Fe.lightProbe.value=B.state.probe,Fe.directionalLights.value=B.state.directional,Fe.directionalLightShadows.value=B.state.directionalShadow,Fe.spotLights.value=B.state.spot,Fe.spotLightShadows.value=B.state.spotShadow,Fe.rectAreaLights.value=B.state.rectArea,Fe.ltc_1.value=B.state.rectAreaLTC1,Fe.ltc_2.value=B.state.rectAreaLTC2,Fe.pointLights.value=B.state.point,Fe.pointLightShadows.value=B.state.pointShadow,Fe.hemisphereLights.value=B.state.hemi,Fe.directionalShadowMap.value=B.state.directionalShadowMap,Fe.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Fe.spotShadowMap.value=B.state.spotShadowMap,Fe.spotLightMatrix.value=B.state.spotLightMatrix,Fe.spotLightMap.value=B.state.spotLightMap,Fe.pointShadowMap.value=B.state.pointShadowMap,Fe.pointShadowMatrix.value=B.state.pointShadowMatrix),Y.currentProgram=ve,Y.uniformsList=null,ve}function F(w){if(w.uniformsList===null){const O=w.currentProgram.getUniforms();w.uniformsList=aa.seqWithValue(O.seq,w.uniforms)}return w.uniformsList}function N(w,O){const G=$e.get(w);G.outputColorSpace=O.outputColorSpace,G.batching=O.batching,G.batchingColor=O.batchingColor,G.instancing=O.instancing,G.instancingColor=O.instancingColor,G.instancingMorph=O.instancingMorph,G.skinning=O.skinning,G.morphTargets=O.morphTargets,G.morphNormals=O.morphNormals,G.morphColors=O.morphColors,G.morphTargetsCount=O.morphTargetsCount,G.numClippingPlanes=O.numClippingPlanes,G.numIntersection=O.numClipIntersection,G.vertexAlphas=O.vertexAlphas,G.vertexTangents=O.vertexTangents,G.toneMapping=O.toneMapping}function X(w,O,G,Y,B){O.isScene!==!0&&(O=Pt),ot.resetTextureUnits();const Z=O.fog,he=Y.isMeshStandardMaterial?O.environment:null,pe=S===null?T.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:Cs,ge=(Y.isMeshStandardMaterial?A:D).get(Y.envMap||he),Ae=Y.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,ve=!!G.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Fe=!!G.morphAttributes.position,Ke=!!G.morphAttributes.normal,dt=!!G.morphAttributes.color;let Mt=Ci;Y.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(Mt=T.toneMapping);const St=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,mt=St!==void 0?St.length:0,He=$e.get(Y),Lt=v.state.lights;if(K===!0&&(_e===!0||w!==U)){const un=w===U&&Y.id===L;We.setState(Y,w,un)}let ct=!1;Y.version===He.__version?(He.needsLights&&He.lightsStateVersion!==Lt.state.version||He.outputColorSpace!==pe||B.isBatchedMesh&&He.batching===!1||!B.isBatchedMesh&&He.batching===!0||B.isBatchedMesh&&He.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&He.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&He.instancing===!1||!B.isInstancedMesh&&He.instancing===!0||B.isSkinnedMesh&&He.skinning===!1||!B.isSkinnedMesh&&He.skinning===!0||B.isInstancedMesh&&He.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&He.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&He.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&He.instancingMorph===!1&&B.morphTexture!==null||He.envMap!==ge||Y.fog===!0&&He.fog!==Z||He.numClippingPlanes!==void 0&&(He.numClippingPlanes!==We.numPlanes||He.numIntersection!==We.numIntersection)||He.vertexAlphas!==Ae||He.vertexTangents!==ve||He.morphTargets!==Fe||He.morphNormals!==Ke||He.morphColors!==dt||He.toneMapping!==Mt||He.morphTargetsCount!==mt)&&(ct=!0):(ct=!0,He.__version=Y.version);let zt=He.currentProgram;ct===!0&&(zt=Di(Y,O,B));let Mn=!1,Yt=!1,Wn=!1;const kt=zt.getUniforms(),gn=He.uniforms;if(Ge.useProgram(zt.program)&&(Mn=!0,Yt=!0,Wn=!0),Y.id!==L&&(L=Y.id,Yt=!0),Mn||U!==w){Ge.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),kt.setValue(z,"projectionMatrix",w.projectionMatrix),kt.setValue(z,"viewMatrix",w.matrixWorldInverse);const vn=kt.map.cameraPosition;vn!==void 0&&vn.setValue(z,Re.setFromMatrixPosition(w.matrixWorld)),Ct.logarithmicDepthBuffer&&kt.setValue(z,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&kt.setValue(z,"isOrthographic",w.isOrthographicCamera===!0),U!==w&&(U=w,Yt=!0,Wn=!0)}if(B.isSkinnedMesh){kt.setOptional(z,B,"bindMatrix"),kt.setOptional(z,B,"bindMatrixInverse");const un=B.skeleton;un&&(un.boneTexture===null&&un.computeBoneTexture(),kt.setValue(z,"boneTexture",un.boneTexture,ot))}B.isBatchedMesh&&(kt.setOptional(z,B,"batchingTexture"),kt.setValue(z,"batchingTexture",B._matricesTexture,ot),kt.setOptional(z,B,"batchingIdTexture"),kt.setValue(z,"batchingIdTexture",B._indirectTexture,ot),kt.setOptional(z,B,"batchingColorTexture"),B._colorsTexture!==null&&kt.setValue(z,"batchingColorTexture",B._colorsTexture,ot));const En=G.morphAttributes;if((En.position!==void 0||En.normal!==void 0||En.color!==void 0)&&nt.update(B,G,zt),(Yt||He.receiveShadow!==B.receiveShadow)&&(He.receiveShadow=B.receiveShadow,kt.setValue(z,"receiveShadow",B.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(gn.envMap.value=ge,gn.flipEnvMap.value=ge.isCubeTexture&&ge.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&O.environment!==null&&(gn.envMapIntensity.value=O.environmentIntensity),gn.dfgLUT!==void 0&&(gn.dfgLUT.value=Og()),Yt&&(kt.setValue(z,"toneMappingExposure",T.toneMappingExposure),He.needsLights&&j(gn,Wn),Z&&Y.fog===!0&&Ve.refreshFogUniforms(gn,Z),Ve.refreshMaterialUniforms(gn,Y,fe,de,v.state.transmissionRenderTarget[w.id]),aa.upload(z,F(He),gn,ot)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(aa.upload(z,F(He),gn,ot),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&kt.setValue(z,"center",B.center),kt.setValue(z,"modelViewMatrix",B.modelViewMatrix),kt.setValue(z,"normalMatrix",B.normalMatrix),kt.setValue(z,"modelMatrix",B.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const un=Y.uniformsGroups;for(let vn=0,Ca=un.length;vn<Ca;vn++){const Ii=un[vn];Pe.update(Ii,zt),Pe.bind(Ii,zt)}}return zt}function j(w,O){w.ambientLightColor.needsUpdate=O,w.lightProbe.needsUpdate=O,w.directionalLights.needsUpdate=O,w.directionalLightShadows.needsUpdate=O,w.pointLights.needsUpdate=O,w.pointLightShadows.needsUpdate=O,w.spotLights.needsUpdate=O,w.spotLightShadows.needsUpdate=O,w.rectAreaLights.needsUpdate=O,w.hemisphereLights.needsUpdate=O}function ee(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(w,O,G){const Y=$e.get(w);Y.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),$e.get(w.texture).__webglTexture=O,$e.get(w.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:G,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,O){const G=$e.get(w);G.__webglFramebuffer=O,G.__useDefaultFramebuffer=O===void 0};const ae=z.createFramebuffer();this.setRenderTarget=function(w,O=0,G=0){S=w,C=O,b=G;let Y=!0,B=null,Z=!1,he=!1;if(w){const ge=$e.get(w);if(ge.__useDefaultFramebuffer!==void 0)Ge.bindFramebuffer(z.FRAMEBUFFER,null),Y=!1;else if(ge.__webglFramebuffer===void 0)ot.setupRenderTarget(w);else if(ge.__hasExternalTextures)ot.rebindTextures(w,$e.get(w.texture).__webglTexture,$e.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Fe=w.depthTexture;if(ge.__boundDepthTexture!==Fe){if(Fe!==null&&$e.has(Fe)&&(w.width!==Fe.image.width||w.height!==Fe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ot.setupDepthRenderbuffer(w)}}const Ae=w.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(he=!0);const ve=$e.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(ve[O])?B=ve[O][G]:B=ve[O],Z=!0):w.samples>0&&ot.useMultisampledRTT(w)===!1?B=$e.get(w).__webglMultisampledFramebuffer:Array.isArray(ve)?B=ve[G]:B=ve,H.copy(w.viewport),te.copy(w.scissor),ne=w.scissorTest}else H.copy(ye).multiplyScalar(fe).floor(),te.copy(Me).multiplyScalar(fe).floor(),ne=Se;if(G!==0&&(B=ae),Ge.bindFramebuffer(z.FRAMEBUFFER,B)&&Y&&Ge.drawBuffers(w,B),Ge.viewport(H),Ge.scissor(te),Ge.setScissorTest(ne),Z){const ge=$e.get(w.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+O,ge.__webglTexture,G)}else if(he){const ge=O;for(let Ae=0;Ae<w.textures.length;Ae++){const ve=$e.get(w.textures[Ae]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+Ae,ve.__webglTexture,G,ge)}}else if(w!==null&&G!==0){const ge=$e.get(w.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,ge.__webglTexture,G)}L=-1},this.readRenderTargetPixels=function(w,O,G,Y,B,Z,he,pe=0){if(!(w&&w.isWebGLRenderTarget)){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ge=$e.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&he!==void 0&&(ge=ge[he]),ge){Ge.bindFramebuffer(z.FRAMEBUFFER,ge);try{const Ae=w.textures[pe],ve=Ae.format,Fe=Ae.type;if(!Ct.textureFormatReadable(ve)){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ct.textureTypeReadable(Fe)){Ht("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=w.width-Y&&G>=0&&G<=w.height-B&&(w.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+pe),z.readPixels(O,G,Y,B,rt.convert(ve),rt.convert(Fe),Z))}finally{const Ae=S!==null?$e.get(S).__webglFramebuffer:null;Ge.bindFramebuffer(z.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(w,O,G,Y,B,Z,he,pe=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ge=$e.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&he!==void 0&&(ge=ge[he]),ge)if(O>=0&&O<=w.width-Y&&G>=0&&G<=w.height-B){Ge.bindFramebuffer(z.FRAMEBUFFER,ge);const Ae=w.textures[pe],ve=Ae.format,Fe=Ae.type;if(!Ct.textureFormatReadable(ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ct.textureTypeReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ke=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,Ke),z.bufferData(z.PIXEL_PACK_BUFFER,Z.byteLength,z.STREAM_READ),w.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+pe),z.readPixels(O,G,Y,B,rt.convert(ve),rt.convert(Fe),0);const dt=S!==null?$e.get(S).__webglFramebuffer:null;Ge.bindFramebuffer(z.FRAMEBUFFER,dt);const Mt=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await Mu(z,Mt,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,Ke),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,Z),z.deleteBuffer(Ke),z.deleteSync(Mt),Z}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,O=null,G=0){const Y=Math.pow(2,-G),B=Math.floor(w.image.width*Y),Z=Math.floor(w.image.height*Y),he=O!==null?O.x:0,pe=O!==null?O.y:0;ot.setTexture2D(w,0),z.copyTexSubImage2D(z.TEXTURE_2D,G,0,0,he,pe,B,Z),Ge.unbindTexture()};const se=z.createFramebuffer(),De=z.createFramebuffer();this.copyTextureToTexture=function(w,O,G=null,Y=null,B=0,Z=null){Z===null&&(B!==0?(ur("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Z=B,B=0):Z=0);let he,pe,ge,Ae,ve,Fe,Ke,dt,Mt;const St=w.isCompressedTexture?w.mipmaps[Z]:w.image;if(G!==null)he=G.max.x-G.min.x,pe=G.max.y-G.min.y,ge=G.isBox3?G.max.z-G.min.z:1,Ae=G.min.x,ve=G.min.y,Fe=G.isBox3?G.min.z:0;else{const En=Math.pow(2,-B);he=Math.floor(St.width*En),pe=Math.floor(St.height*En),w.isDataArrayTexture?ge=St.depth:w.isData3DTexture?ge=Math.floor(St.depth*En):ge=1,Ae=0,ve=0,Fe=0}Y!==null?(Ke=Y.x,dt=Y.y,Mt=Y.z):(Ke=0,dt=0,Mt=0);const mt=rt.convert(O.format),He=rt.convert(O.type);let Lt;O.isData3DTexture?(ot.setTexture3D(O,0),Lt=z.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(ot.setTexture2DArray(O,0),Lt=z.TEXTURE_2D_ARRAY):(ot.setTexture2D(O,0),Lt=z.TEXTURE_2D),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,O.flipY),z.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),z.pixelStorei(z.UNPACK_ALIGNMENT,O.unpackAlignment);const ct=z.getParameter(z.UNPACK_ROW_LENGTH),zt=z.getParameter(z.UNPACK_IMAGE_HEIGHT),Mn=z.getParameter(z.UNPACK_SKIP_PIXELS),Yt=z.getParameter(z.UNPACK_SKIP_ROWS),Wn=z.getParameter(z.UNPACK_SKIP_IMAGES);z.pixelStorei(z.UNPACK_ROW_LENGTH,St.width),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,St.height),z.pixelStorei(z.UNPACK_SKIP_PIXELS,Ae),z.pixelStorei(z.UNPACK_SKIP_ROWS,ve),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Fe);const kt=w.isDataArrayTexture||w.isData3DTexture,gn=O.isDataArrayTexture||O.isData3DTexture;if(w.isDepthTexture){const En=$e.get(w),un=$e.get(O),vn=$e.get(En.__renderTarget),Ca=$e.get(un.__renderTarget);Ge.bindFramebuffer(z.READ_FRAMEBUFFER,vn.__webglFramebuffer),Ge.bindFramebuffer(z.DRAW_FRAMEBUFFER,Ca.__webglFramebuffer);for(let Ii=0;Ii<ge;Ii++)kt&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,$e.get(w).__webglTexture,B,Fe+Ii),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,$e.get(O).__webglTexture,Z,Mt+Ii)),z.blitFramebuffer(Ae,ve,he,pe,Ke,dt,he,pe,z.DEPTH_BUFFER_BIT,z.NEAREST);Ge.bindFramebuffer(z.READ_FRAMEBUFFER,null),Ge.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(B!==0||w.isRenderTargetTexture||$e.has(w)){const En=$e.get(w),un=$e.get(O);Ge.bindFramebuffer(z.READ_FRAMEBUFFER,se),Ge.bindFramebuffer(z.DRAW_FRAMEBUFFER,De);for(let vn=0;vn<ge;vn++)kt?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,En.__webglTexture,B,Fe+vn):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,En.__webglTexture,B),gn?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,un.__webglTexture,Z,Mt+vn):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,un.__webglTexture,Z),B!==0?z.blitFramebuffer(Ae,ve,he,pe,Ke,dt,he,pe,z.COLOR_BUFFER_BIT,z.NEAREST):gn?z.copyTexSubImage3D(Lt,Z,Ke,dt,Mt+vn,Ae,ve,he,pe):z.copyTexSubImage2D(Lt,Z,Ke,dt,Ae,ve,he,pe);Ge.bindFramebuffer(z.READ_FRAMEBUFFER,null),Ge.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else gn?w.isDataTexture||w.isData3DTexture?z.texSubImage3D(Lt,Z,Ke,dt,Mt,he,pe,ge,mt,He,St.data):O.isCompressedArrayTexture?z.compressedTexSubImage3D(Lt,Z,Ke,dt,Mt,he,pe,ge,mt,St.data):z.texSubImage3D(Lt,Z,Ke,dt,Mt,he,pe,ge,mt,He,St):w.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,Z,Ke,dt,he,pe,mt,He,St.data):w.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,Z,Ke,dt,St.width,St.height,mt,St.data):z.texSubImage2D(z.TEXTURE_2D,Z,Ke,dt,he,pe,mt,He,St);z.pixelStorei(z.UNPACK_ROW_LENGTH,ct),z.pixelStorei(z.UNPACK_IMAGE_HEIGHT,zt),z.pixelStorei(z.UNPACK_SKIP_PIXELS,Mn),z.pixelStorei(z.UNPACK_SKIP_ROWS,Yt),z.pixelStorei(z.UNPACK_SKIP_IMAGES,Wn),Z===0&&O.generateMipmaps&&z.generateMipmap(Lt),Ge.unbindTexture()},this.initRenderTarget=function(w){$e.get(w).__webglFramebuffer===void 0&&ot.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?ot.setTextureCube(w,0):w.isData3DTexture?ot.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?ot.setTexture2DArray(w,0):ot.setTexture2D(w,0),Ge.unbindTexture()},this.resetState=function(){C=0,b=0,S=null,Ge.reset(),k.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Et._getDrawingBufferColorSpace(e),t.unpackColorSpace=Et._getUnpackColorSpace()}}const oa={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ns{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const zg=new kc(-1,1,1,-1,0,1);class kg extends Xt{constructor(){super(),this.setAttribute("position",new wt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new wt([0,2,0,0,2,0],2))}}const Vg=new kg;class Vc{constructor(e){this._mesh=new V(Vg,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,zg)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class hd extends Ns{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof cn?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=pr.clone(e.uniforms),this.material=new cn({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Vc(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class ah extends Ns{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Gg extends Ns{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Hg{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new Ie);this._width=n.width,this._height=n.height,t=new zn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Kn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new hd(oa),this.copyPass.material.blending=$n,this.clock=new sd}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}ah!==void 0&&(a instanceof ah?n=!0:a instanceof Gg&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new Ie);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Wg extends Ns{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new it}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const Xg={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new it(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ds extends Ns{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new Ie(e.x,e.y):new Ie(256,256),this.clearColor=new it(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new zn(r,a,{type:Kn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new zn(r,a,{type:Kn});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const p=new zn(r,a,{type:Kn});p.texture.name="UnrealBloomPass.v"+d,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),a=Math.round(a/2)}const o=Xg;this.highPassUniforms=pr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new cn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Ie(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=pr.clone(oa.uniforms),this.blendMaterial=new cn({uniforms:this.copyUniforms,vertexShader:oa.vertexShader,fragmentShader:oa.fragmentShader,blending:Ti,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new it,this._oldClearAlpha=1,this._basic=new At,this._fsQuad=new Vc(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Ie(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=Ds.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Ds.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new cn({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Ie(.5,.5)},direction:{value:new Ie(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new cn({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Ds.BlurDirectionX=new Ie(1,0);Ds.BlurDirectionY=new Ie(0,1);const Qr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Yg extends Ns{constructor(){super(),this.uniforms=pr.clone(Qr.uniforms),this.material=new Hf({name:Qr.name,uniforms:this.uniforms,vertexShader:Qr.vertexShader,fragmentShader:Qr.fragmentShader}),this._fsQuad=new Vc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Et.getTransfer(this._outputColorSpace)===Ft&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===bh?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===wh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Th?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===vc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ah?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ch?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Eh&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class qg extends Xh{constructor(){super();const e=new Le;e.deleteAttribute("uv");const t=new q({side:ln}),n=new q,s=new zc(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new V(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new rn(e,n,6),o=new Wt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const c=new V(e,_s(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const l=new V(e,_s(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);const d=new V(e,_s(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new V(e,_s(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const p=new V(e,_s(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const m=new V(e,_s(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function _s(i){return new Wf({color:0,emissive:16777215,emissiveIntensity:i})}const Mr=document.querySelector("#game"),Qt=new Bg({canvas:Mr,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});Qt.setPixelRatio(Math.min(window.devicePixelRatio,2));Qt.setSize(window.innerWidth,window.innerHeight);Qt.shadowMap.enabled=!0;Qt.shadowMap.type=yh;Qt.outputColorSpace=Rt;Qt.toneMapping=vc;Qt.toneMappingExposure=1.23;const tt=new Xh;tt.background=new it(5814015);tt.fog=new Dc(11001343,205,1520);const dd=new lc(Qt);dd.compileEquirectangularShader();tt.environment=dd.fromScene(new qg,.04).texture;tt.environmentIntensity=.78;const Je=new bn(69,window.innerWidth/window.innerHeight,.08,1800);tt.add(Je);const et={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const _t=new Set,Ne={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},Zg=new sd,an=new P(0,1,0),ud=new P,fd=new P,Gc=new P,Rn=new Wt,pd=.86,dc=1.2,$g=.78,Jn=.55,li={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},es=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],md=Math.max(...es.map(i=>i.width));let ca=0,oe=es[0];const f={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamSlip:0,roamSuspension:0,collisionDrama:0,collisionHits:0,collisionCooldown:0,objectiveIndex:0,objectiveHits:0,objectiveLap:1,roamPos:new P,best:Number(localStorage.getItem("steel-ribbon-best")||0)};et.best.textContent=`Best score ${f.best}`;function Kg(i){const e=Be.clamp(i,0,1);return e*e*(3-2*e)}function Jg(i,e){let t=0;for(const n of i.gaps){const s=n.start-n.approach,r=n.start+n.carry,a=n.end+n.settle;e>=s&&e<=r?t+=n.rise*Be.clamp((e-s)/(n.approach+n.carry),0,1):e>r&&e<=n.end?t+=n.rise:e>n.end&&e<=a&&(t+=n.rise*(1-Kg((e-n.end)/n.settle)))}return t}function Hc(i,e){const t=(e%i.length+i.length)%i.length,n=t/i.length*Math.PI*2,s=i.shape,r=Math.sin(n)*s.x1+Math.sin(n*2)*s.x2+Math.cos(n*3)*s.x3,a=Math.cos(n)*s.z1+Math.cos(n*2)*s.z2+Math.sin(n*3)*s.z3;return{x:r,z:a,t:n,n:t}}function xd(i,e){const{t,n}=Hc(i,e),s=i.shape;let r=s.y0+Math.sin(t*2)*s.y2+Math.sin(t*3)*s.y3+Math.cos(t)*s.y1;for(const a of i.ramps){let o=n-a.s;o>i.length/2&&(o-=i.length),o<-i.length/2&&(o+=i.length),r+=a.amp*Math.exp(-(o*o)/(a.width*a.width))}return r+=Jg(i,n),r}function ea(i){const{x:e,z:t,n}=Hc(oe,i),s=xd(oe,n);return new P(e,s,t)}function bt(i){const e=(i%oe.length+oe.length)%oe.length,t=ea(e),s=ea(e+2).sub(t).normalize(),r=ud.crossVectors(an,s).normalize(),a=ea(e-2).y,o=ea(e+2).y,c=Math.atan2(o-a,4),l=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,d=oe.gaps.find(u=>e>u.start&&e<u.end);return{s:e,p:t,tangent:s,side:r.clone(),grade:c,bank:l,gap:d}}function Ri(i){const e=(i%oe.length+oe.length)%oe.length;return oe.gaps.some(t=>e>t.start&&e<t.end)}function oh(i){return Be.clamp(i/(oe.length*oe.laps),0,1)}function ch(i,e,t){const n=Math.floor(i/oe.length),s=Math.floor(e/oe.length);for(let r=n;r<=s;r++){const a=r*oe.length+t;if(i<a&&e>=a)return!0}return!1}function jg(i=256,e=8){const t=document.createElement("canvas");t.width=i,t.height=i;const n=t.getContext("2d"),s=i/e;for(let a=0;a<e;a++)for(let o=0;o<e;o++)n.fillStyle=(o+a)%2?"#101318":"#f5f1df",n.fillRect(o*s,a*s,s,s);const r=new Jt(t);return r.colorSpace=Rt,r.wrapS=dn,r.wrapT=dn,r.repeat.set(3,1),r}function Qg(i=512){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,0);n.addColorStop(0,"#9c9b77"),n.addColorStop(.18,"#c9c69a"),n.addColorStop(.5,"#9f9f79"),n.addColorStop(.82,"#c0bd91"),n.addColorStop(1,"#858563"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let r=0;r<i;r+=64)t.beginPath(),t.moveTo(0,r+2),t.lineTo(i,r+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const r of[48,464])t.beginPath(),t.moveTo(r,0),t.lineTo(r,i),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let r=0;r<42;r++){const a=i*(.28+Math.random()*.44),o=Math.random()*i;t.beginPath(),t.moveTo(a,o),t.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)t.beginPath(),t.ellipse(Math.random()*i,Math.random()*i,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new Jt(e);return s.colorSpace=Rt,s.wrapS=dn,s.wrapT=dn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function e1(i=1024){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#2e6a40"),n.addColorStop(.42,"#487443"),n.addColorStop(1,"#1f4a37"),t.fillStyle=n,t.fillRect(0,0,i,i);for(let r=0;r<3600;r++){const a=.035+Math.random()*.08,o=72+Math.floor(Math.random()*70);t.fillStyle=`rgba(${38+Math.random()*30}, ${o}, ${38+Math.random()*26}, ${a})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*4,1+Math.random()*4)}t.strokeStyle="rgba(210, 220, 150, 0.08)",t.lineWidth=2;for(let r=-i;r<i*1.5;r+=76)t.beginPath(),t.moveTo(r,0),t.lineTo(r+i*.65,i),t.stroke();const s=new Jt(e);return s.colorSpace=Rt,s.wrapS=dn,s.wrapT=dn,s.repeat.set(18,18),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function t1(i=1024){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#263139"),n.addColorStop(.45,"#3a444a"),n.addColorStop(1,"#1b242c"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(180, 225, 255, 0.08)",t.lineWidth=1;for(let r=-i;r<i*2;r+=78)t.beginPath(),t.moveTo(r,0),t.lineTo(r+i*.32,i),t.stroke();for(let r=0;r<360;r++){const a=Math.random()*i,o=Math.random()*i,c=10+Math.random()*56,l=t.createRadialGradient(a,o,0,a,o,c);l.addColorStop(0,`rgba(145, 205, 255, ${.12+Math.random()*.15})`),l.addColorStop(.45,"rgba(80, 140, 180, 0.07)"),l.addColorStop(1,"rgba(10, 18, 24, 0)"),t.fillStyle=l,t.beginPath(),t.ellipse(a,o,c,c*(.16+Math.random()*.18),Math.random()*Math.PI,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 214, 122, 0.12)";for(let r=0;r<48;r++){const a=Math.random()*i,o=Math.random()*i;t.beginPath(),t.ellipse(a,o,8+Math.random()*36,1.5+Math.random()*4,Math.random()*Math.PI,0,Math.PI*2),t.fill()}for(let r=0;r<9200;r++){const a=36+Math.floor(Math.random()*110),o=.035+Math.random()*.075,c=Math.random()<.18?2:1;t.fillStyle=`rgba(${a}, ${a+3}, ${a+7}, ${o})`,t.fillRect(Math.random()*i,Math.random()*i,c,c)}const s=new Jt(e);return s.colorSpace=Rt,s.wrapS=dn,s.wrapT=dn,s.repeat.set(9,16),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function Ss(i=128,e=256,t=.42){const n=document.createElement("canvas");n.width=i,n.height=e;const s=n.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,i,e);for(let a=10;a<e-8;a+=18)for(let o=9;o<i-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<i;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,e),s.stroke();const r=new Jt(n);return r.colorSpace=Rt,r}function n1(i=256,e=256,t="#d9d0bd"){const n=document.createElement("canvas");n.width=i,n.height=e;const s=n.getContext("2d"),r=s.createLinearGradient(0,0,i,e);r.addColorStop(0,t),r.addColorStop(.58,"#f0e5d2"),r.addColorStop(1,"#b9b0a1"),s.fillStyle=r,s.fillRect(0,0,i,e),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const l=180+Math.random()*60;s.fillStyle=`rgba(${l}, ${l}, ${l-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*i,Math.random()*e,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,e*.77,i,e*.2);const a=(c,l,d,u)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,l,d,u),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,l,d,u),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,l+2),s.lineTo(c+d*.5,l+u-2),s.moveTo(c+2,l+u*.52),s.lineTo(c+d-2,l+u*.52),s.stroke()};a(i*.12,e*.24,i*.19,e*.2),a(i*.68,e*.25,i*.2,e*.2),a(i*.43,e*.5,i*.16,e*.16),s.fillStyle="#4b3d34",s.fillRect(i*.43,e*.62,i*.16,e*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(i*.55,e*.76,3,0,Math.PI*2),s.fill();const o=new Jt(n);return o.colorSpace=Rt,o.wrapS=dn,o.wrapT=dn,o.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),o}function i1(i=512){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#e77b36"),n.addColorStop(.45,"#a63f24"),n.addColorStop(1,"#6b271d"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(255, 185, 104, 0.28)",t.lineWidth=2;for(let r=-20;r<i+20;r+=26){t.beginPath();for(let a=-10;a<i+10;a+=12){const o=r+Math.sin((a+r)*.045)*3;a===-10?t.moveTo(a,o):t.lineTo(a,o)}t.stroke()}t.strokeStyle="rgba(75, 24, 18, 0.34)",t.lineWidth=1.5;for(let r=0;r<i;r+=20)t.beginPath(),t.moveTo(r,0),t.bezierCurveTo(r+8,i*.24,r-8,i*.58,r+7,i),t.stroke();for(let r=0;r<1400;r++){const a=112+Math.random()*110;t.fillStyle=`rgba(${a}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new Jt(e);return s.colorSpace=Rt,s.wrapS=dn,s.wrapT=dn,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function s1(i=256,e=160){const t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d"),s=n.createLinearGradient(0,0,0,e);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),n.fillStyle=s,n.fillRect(0,0,i,e),n.strokeStyle="rgba(210, 225, 232, 0.18)",n.lineWidth=3;for(let a=18;a<e;a+=24)n.beginPath(),n.moveTo(8,a),n.lineTo(i-8,a),n.stroke();n.strokeStyle="rgba(8, 10, 12, 0.72)",n.lineWidth=8,n.strokeRect(4,4,i-8,e-8);const r=new Jt(t);return r.colorSpace=Rt,r}function lh(i,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)",n=!0){const s=document.createElement("canvas");s.width=n?128:384,s.height=n?384:128;const r=s.getContext("2d"),{width:a,height:o}=s;r.fillStyle=t,r.fillRect(0,0,a,o),r.strokeStyle=e,r.lineWidth=n?5:6,r.strokeRect(8,8,a-16,o-16),r.save(),r.translate(a/2,o/2),n&&r.rotate(-Math.PI/2),r.font=`900 ${n?54:48}px Arial, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.shadowColor=e,r.shadowBlur=18,r.fillStyle=e,r.fillText(i,0,0),r.restore();const c=new Jt(s);return c.colorSpace=Rt,c}const yi=["SKYRAMP","TURBO MOTEL","MIDNIGHT AUTO","RIBBON RADIO","NEON DINER","VECTOR TIRES","NIGHT GARAGE","AERO PARTS","MOONLIGHT LANES","COIL CAFE","JETT FUEL","PIXEL PAWN","BLUE EXIT","CITY MOTORS","OPEN LATE"],ma=["NEXT EXIT","24 HOURS","TUNE UP","LOW FLYING DEALS","RACE NIGHT","HOT COFFEE","REPAIRS","LIVE MUSIC"],bi=["#ff4fb7","#4ff3ff","#ffd45b","#68ff8f","#ff7c4f","#b56bff"];function gd(i,e,t="#4ff3ff"){const n=document.createElement("canvas");n.width=640,n.height=256;const s=n.getContext("2d"),r=s.createLinearGradient(0,0,640,256);r.addColorStop(0,"#111722"),r.addColorStop(.55,"#20344a"),r.addColorStop(1,"#171024"),s.fillStyle=r,s.fillRect(0,0,640,256),s.fillStyle=t,s.globalAlpha=.18;for(let o=-80;o<700;o+=72)s.beginPath(),s.moveTo(o,256),s.lineTo(o+110,0),s.lineTo(o+145,0),s.lineTo(o+35,256),s.closePath(),s.fill();s.globalAlpha=1,s.strokeStyle=t,s.lineWidth=12,s.strokeRect(16,16,608,224),s.shadowColor=t,s.shadowBlur=18,s.fillStyle="#f7fbff",s.font="900 64px Arial Black, Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(i,320,102,560),s.shadowBlur=10,s.fillStyle=t,s.font="800 30px Arial, sans-serif",s.fillText(e,320,168,520),s.shadowBlur=0,s.fillStyle="rgba(255,255,255,0.72)",s.font="700 18px Arial, sans-serif",s.fillText("STEEL RIBBON CITY",320,212,520);const a=new Jt(n);return a.colorSpace=Rt,a.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),a}function ho(i,e="#ffd45b"){const t=document.createElement("canvas");t.width=384,t.height=128;const n=t.getContext("2d");n.fillStyle="#151922",n.fillRect(0,0,384,128),n.fillStyle=e,n.fillRect(0,0,384,12),n.fillRect(0,116,384,12),n.strokeStyle="rgba(255,255,255,0.32)",n.lineWidth=4,n.strokeRect(12,16,360,96),n.shadowColor=e,n.shadowBlur=14,n.fillStyle="#f8fbff",n.font="900 38px Arial Black, Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(i,192,64,330);const s=new Jt(t);return s.colorSpace=Rt,s}function uo(i=512,e=384,t="#9d4d3d",n="#2d86b7"){const s=document.createElement("canvas");s.width=i,s.height=e;const r=s.getContext("2d"),a=r.createLinearGradient(0,0,i,e);a.addColorStop(0,t),a.addColorStop(.55,"#b96a55"),a.addColorStop(1,"#633428"),r.fillStyle=a,r.fillRect(0,0,i,e),r.strokeStyle="rgba(50, 24, 18, 0.42)",r.lineWidth=2;for(let c=18;c<e;c+=22){r.beginPath(),r.moveTo(0,c),r.lineTo(i,c),r.stroke();for(let l=Math.floor(c/22)%2*28;l<i;l+=56)r.beginPath(),r.moveTo(l,c-18),r.lineTo(l,c),r.stroke()}r.fillStyle="rgba(17, 24, 31, 0.92)",r.fillRect(34,e*.58,i-68,e*.28),r.fillStyle="rgba(120, 210, 255, 0.32)";for(let c=58;c<i-48;c+=78)r.fillRect(c,e*.62,52,e*.19);r.fillStyle=n,r.fillRect(22,e*.49,i-44,34),r.fillStyle="#f7f4df",r.font="900 42px Arial Black, Arial, sans-serif",r.textAlign="center",r.textBaseline="middle",r.shadowColor=n,r.shadowBlur=12,r.fillText("OPEN",i/2,e*.28,i*.76),r.shadowBlur=0;const o=new Jt(s);return o.colorSpace=Rt,o.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),o}function r1(i=384,e=384){const t=document.createElement("canvas");t.width=i,t.height=e;const n=t.getContext("2d");n.fillStyle="#868f96",n.fillRect(0,0,i,e);for(let r=18;r<e;r+=54)n.fillStyle="rgba(30, 38, 44, 0.62)",n.fillRect(22,r,i-44,24),n.fillStyle="rgba(215, 225, 232, 0.44)",n.fillRect(20,r+26,i-40,6);n.strokeStyle="rgba(255,255,255,0.22)",n.lineWidth=3;for(let r=0;r<i;r+=64)n.beginPath(),n.moveTo(r,0),n.lineTo(r,e),n.stroke();n.fillStyle="#ffffff",n.font="900 96px Arial Black, Arial, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText("P",i*.5,e*.48);const s=new Jt(t);return s.colorSpace=Rt,s.anisotropy=Math.min(16,Qt.capabilities.getMaxAnisotropy()),s}function a1(i=256){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=i/2,s=i/2,r=i*.43;t.clearRect(0,0,i,i),t.beginPath();for(let o=0;o<8;o++){const c=-Math.PI/8+o*Math.PI/4,l=n+Math.cos(c)*r,d=s+Math.sin(c)*r;o===0?t.moveTo(l,d):t.lineTo(l,d)}t.closePath(),t.fillStyle="#c91f24",t.fill(),t.lineWidth=i*.035,t.strokeStyle="#f9f6ee",t.stroke(),t.fillStyle="#ffffff",t.font=`900 ${Math.round(i*.27)}px Arial, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("STOP",n,s+i*.015);const a=new Jt(e);return a.colorSpace=Rt,a}function Xe(i,e){return-7+Math.sin(i*.018)*4+Math.cos(e*.014)*5+Math.sin((i+e)*.006)*10}function Js(i,e,t,n){const s=t*.5,r=n*.5;let a=Xe(i,e);for(const o of[-s,0,s])for(const c of[-r,0,r])a=Math.min(a,Xe(i+o,e+c));return a}function Ea(i,e,t=10){const{x0:n,x1:s,zNear:r,zFar:a,pitch:o,streetW:c}=li;if(i<n-c||i>s+c||e<a-c||e>r+c)return!1;const l=Math.abs((i-n+o/2)%o-o/2),d=Math.abs((r-e+o/2)%o-o/2);return Math.min(l,d)<c*.5+t}function Vi(i,e,t,n,s=8){const{x0:r,x1:a,zNear:o,zFar:c,pitch:l,streetW:d}=li,u=t*.5,p=n*.5,m=d*.5+s;let g=null;const _=(x,h,M)=>{(!g||M>g.overlap)&&(g={axis:x,road:h,overlap:M})};for(let x=r;x<=a+1;x+=l){if(e+p<c-m||e-p>o+m)continue;const h=u+m-Math.abs(i-x);h>0&&_("x",Math.round(x),h)}for(let x=o;x>=c-1;x-=l){if(i+u<r-m||i-u>a+m)continue;const h=p+m-Math.abs(e-x);h>0&&_("z",Math.round(x),h)}return g}const la=[],fo=[],vd=[];let hh=0;function Un(i,e){return vd.push({obj:i,update:e}),i}function _d(i){hh+=i;for(const e of vd)e.update(hh,i)}function Md(){if(fo.length===0)for(let i=0;i<es.length;i++){const e=es[i];for(let t=0;t<e.length;t+=14){const n=Hc(e,t);fo.push({x:n.x,y:xd(e,t),z:n.z,s:t,courseIndex:i})}}return fo}function Cn(i,e,t=0){let n=null,s=1/0;for(const r of Md()){const a=i-r.x,o=e-r.z,c=Math.hypot(a,o);c<s&&(s=c,n=r)}return{clearance:s-t-md*.58,distance:s,nearestS:n?.s??0}}function Gi(i,e,t,n,s,r=9){const a=t*.5,o=n*.5,c=md*.62+r;let l=null;for(const d of Md()){const u=Math.max(Math.abs(d.x-i)-a,0),p=Math.max(Math.abs(d.z-e)-o,0),m=Math.hypot(u,p)-c;if(m>0)continue;const g=d.y-2.8,_=s-g;_<=0||(!l||_-m>l.score)&&(l={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:m,verticalIntrusion:_,score:_-m})}return l}function Fn(i,e,t,n=96){for(let s=0;s<n;s++){const r=i(s);if(Cn(r.x,r.z,e).clearance>=t)return r}return null}function Nn(i,e,t,n,s){const r=Cn(e,t,n);la.push({kind:i,x:Math.round(e),z:Math.round(t),radius:Math.round(n),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function o1(){const i=[...la].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:la.length,unsafe:la.filter(e=>e.clearance<e.margin),closest:i}}function mn(i,e,t,n,s){const r=e.clone().add(t).multiplyScalar(.5),a=t.clone().sub(e),o=new V(new ut(n,n,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors(an,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,i.add(o),o}function c1(){const i=new qf(12118271,1911848,.9);tt.add(i);const e=new so(6994175,1.28);e.position.set(260,145,-260),tt.add(e);const t=new so(16766880,1.72);t.position.set(-240,270,180),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,tt.add(t);const n=new so(16758892,.38);n.position.set(-180,35,280),tt.add(n);const s=new zc(5556479,70,900,2);s.position.set(0,88,-920),tt.add(s)}function l1(){const i=document.createElement("canvas");i.width=32,i.height=512;const e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,i.height);t.addColorStop(0,"#03569f"),t.addColorStop(.34,"#1689e6"),t.addColorStop(.72,"#86d3ff"),t.addColorStop(1,"#fff1c4"),e.fillStyle=t,e.fillRect(0,0,i.width,i.height);const n=new Jt(i);n.colorSpace=Rt;const s=new V(new Gt(1550,40,20),new At({map:n,side:ln,depthWrite:!1}));s.position.set(0,-70,-700),tt.add(s);const r=new At({color:16765316,transparent:!0,opacity:.22,depthWrite:!1}),a=new V(new tn(58,48),r);a.position.set(-430,300,-650),a.lookAt(Je.position),tt.add(a);const o=new At({color:16762479,transparent:!0,opacity:.16,depthWrite:!1});for(const[l,d]of[[150,.05],[260,.025],[430,.012]]){const u=new V(new tn(l,48),o.clone());u.material.opacity=d,u.position.copy(a.position).add(new P(0,0,2)),u.lookAt(Je.position),tt.add(u)}const c=new At({color:16769715,transparent:!0,opacity:.025,depthWrite:!1,side:gt});for(let l=0;l<3;l++){const d=new V(new Bt(1800,42),c.clone());d.material.opacity=.015+l*.01,d.position.set(0,92+l*28,-1220-l*260),tt.add(d)}}function h1(){const i=new q({map:e1(),color:10212492,roughness:.98,metalness:.02}),e=new V(new Bt(4200,4200,300,300),i);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let g=0;g<t.count;g++){const _=t.getX(g),x=t.getY(g);t.setZ(g,Xe(_,-x)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),tt.add(e);const n=new q({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.76});for(let g=0;g<3;g++){const _=new V(new Bt(980,64+g*18,1,1),n.clone());_.rotation.x=-Math.PI/2,_.rotation.z=-.34+g*.03,_.position.set(150-g*190,-5.4+g*.03,-760-g*420),tt.add(_)}const s=[new q({color:4352578,roughness:1}),new q({color:6910014,roughness:1}),new q({color:3562320,roughness:1})];for(let g=0;g<46;g++){const _=new V(new tn(28+Math.random()*90,9),s[g%s.length]);_.rotation.x=-Math.PI/2,_.rotation.z=Math.random()*Math.PI,_.position.set(-900+Math.random()*1800,-5.6+Math.random()*.8,-260-Math.random()*1780),_.scale.y=.32+Math.random()*.5,_.receiveShadow=!0,tt.add(_)}const r=new At({color:14217471,transparent:!0,opacity:.08,depthWrite:!1});for(let g=0;g<32;g++){const _=new V(new tn(70+Math.random()*150,22),r.clone());_.material.opacity=.035+Math.random()*.055,_.rotation.x=-Math.PI/2,_.position.set(-1050+Math.random()*2100,-1.8+Math.random()*4,-240-Math.random()*1820),_.scale.y=.22+Math.random()*.26,tt.add(_)}const a=[new q({color:5991785,roughness:1}),new q({color:7633254,roughness:1}),new q({color:4874865,roughness:1})],o=new q({color:15068905,roughness:.95});for(let g=0;g<52;g++){const _=78+Math.random()*180,x=52+Math.random()*115,h=Fn(v=>{const y=g/52*Math.PI*2+v*1.77,E=1380+Math.random()*820+v*18;return{x:Math.cos(y)*E,z:Math.sin(y)*E-1180}},x,480);if(!h)continue;const M=new V(new $i(x,_,5+Math.floor(Math.random()*2)),a[g%a.length]);if(M.position.set(h.x,-9,h.z),M.rotation.y=Math.random()*Math.PI,M.castShadow=!0,M.receiveShadow=!0,tt.add(M),Nn("mountain",h.x,h.z,x,480),_>160){const v=new V(new $i(x*.34,_*.22,5),o);v.position.copy(M.position).add(new P(0,_*.39,0)),v.rotation.y=M.rotation.y,tt.add(v)}}const c=new q({color:4926748,roughness:.9}),l=[new q({color:2055221,roughness:.92}),new q({color:3109954,roughness:.95}),new q({color:1589042,roughness:.9})];for(let g=0;g<185;g++){const _=.58+Math.random()*1.05,x=8*_,h=Fn(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),x,145,40);if(!h)continue;const{x:M,z:v}=h;if(Ea(M,v,18))continue;const y=Xe(M,v)+.8,E=new at,T=2.2+Math.random()*3.8,R=new V(new ut(.28,.42,T,6),c);R.position.y=T/2,E.add(R);const C=2+Math.floor(Math.random()*3);for(let b=0;b<C;b++){const S=new V(new $i(2.2+Math.random()*1.7-b*.22,4.8+Math.random()*2.6,7),l[(g+b)%l.length]);S.position.y=T+b*1.45+1.6,S.rotation.y=Math.random()*Math.PI,E.add(S)}E.position.set(M,y,v),E.scale.setScalar(_),tt.add(E),Nn("tree",M,v,x,145)}const d=new q({color:16777215,roughness:.75,transparent:!0,opacity:.88});for(let g=0;g<38;g++){const _=new at,x=4+Math.floor(Math.random()*5);for(let h=0;h<x;h++){const M=new V(new Gt(12+Math.random()*18,14,8),d);M.position.set(h*18-x*9,Math.random()*8,Math.random()*12),M.scale.set(1.2+Math.random()*.9,.36+Math.random()*.2,.8+Math.random()*.5),_.add(M)}_.position.set(-760+Math.random()*1520,185+Math.random()*135,-130-Math.random()*1720),tt.add(_)}const u=[new q({color:6186600,roughness:.68,metalness:.2}),new q({color:7829101,roughness:.72,metalness:.18}),new q({color:4544612,roughness:.62,metalness:.24})],p=new q({color:2962232,roughness:.65,metalness:.35});for(let g=0;g<44;g++){const _=new at,x=20+Math.random()*95,h=8+Math.random()*18,M=8+Math.random()*18,v=new V(new Le(h,x,M),u[g%u.length]);v.position.y=x/2,v.castShadow=!0,v.receiveShadow=!0,_.add(v);const y=Ss(160,320,.28+Math.random()*.36),E=new q({map:y,color:10414079,roughness:.24,metalness:.12,emissive:1724259,emissiveIntensity:.22});for(const b of[-1,1]){const S=new V(new Bt(h*.82,x*.74),E);S.position.set(0,x*.53,b*(M/2+.08)),S.rotation.y=b<0?Math.PI:0,_.add(S)}const T=new V(new Le(h*1.08,1.2,M*1.08),p);if(T.position.y=x+.7,_.add(T),Math.random()<.32){const b=new V(new ut(.18,.3,10+Math.random()*12,8),p);b.position.y=x+6.5,_.add(b)}const R=Math.hypot(h,M)*.65,C=Fn(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),R,240,60);C&&(_.position.set(C.x,Js(C.x,C.z,h,M)-.7,C.z),_.rotation.y=Math.random()*Math.PI,tt.add(_),Nn("building",C.x,C.z,R,240))}const m=new q({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22});for(let g=0;g<18;g++){const _=new at,x=yi[g%yi.length],h=ma[(g*3+1)%ma.length],M=bi[g%bi.length],v=new q({map:gd(x,h,M),color:16777215,roughness:.22,metalness:.04,emissive:new it(M),emissiveIntensity:.28}),y=22+Math.random()*18,E=8+Math.random()*4,T=new V(new Le(y,E,.5),v);T.position.y=10,_.add(T);const R=new V(new Le(y+1.2,.32,.75),m);R.position.y=10+E*.5+.25,_.add(R);for(const b of[-7,7]){const S=new V(new ut(.24,.32,10,8),m);S.position.set(b,5,-.2),_.add(S)}const C=Fn(()=>({x:-780+Math.random()*1560,z:-450-g*135+Math.random()*80-40}),22,175,50);C&&(_.position.set(C.x,Xe(C.x,C.z)+.5,C.z),_.rotation.y=-.35+Math.random()*.7,tt.add(_),Nn("billboard",C.x,C.z,22,175),Hi("roadside-billboard",C.x,_.position.y+10,C.z))}}function d1(){for(let h=0;h<3;h++){const M=[9418953,10995926,12770278][h],v=new At({color:M,transparent:!0,opacity:.55-h*.12,depthWrite:!1,fog:!1}),y=60,E=5200,T=new Bt(E,360,y,1),R=T.attributes.position;for(let b=0;b<=y;b++){const S=b/y,L=(Math.sin(S*22+h*3)*.5+Math.sin(S*9+h)*.5)*70+120;R.setY(b,L),R.setY(b+y+1,-180)}R.needsUpdate=!0;const C=new V(T,v);C.position.set(0,40,-2300-h*360),tt.add(C)}const i=new q({color:5583649,roughness:.9}),e=[new q({color:3837754,roughness:.9}),new q({color:7319100,roughness:.92}),new q({color:13075258,roughness:.9}),new q({color:15182276,roughness:.88})];for(let h=0;h<48;h++){const M=.7+Math.random()*1.2,v=9*M,y=Fn(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),v,150,36);if(!y)continue;const{x:E,z:T}=y;if(Ea(E,T,18))continue;const R=Xe(E,T)+.6,C=new at,b=2.6+Math.random()*3.4,S=new V(new ut(.34,.5,b,6),i);S.position.y=b/2,C.add(S);const L=e[Math.floor(Math.random()*e.length)],U=3+Math.floor(Math.random()*3);for(let H=0;H<U;H++){const te=2.4+Math.random()*1.8,ne=new V(new Gt(te,9,7),L);ne.position.set((Math.random()-.5)*3,b+1.6+Math.random()*2.2,(Math.random()-.5)*3),ne.scale.y=.82+Math.random()*.3,C.add(ne)}C.position.set(E,R,T),C.scale.setScalar(M),tt.add(C),Nn("tree",E,T,v,150)}const t=[new q({color:7762025,roughness:1,flatShading:!0,side:gt}),new q({color:9077368,roughness:1,flatShading:!0,side:gt}),new q({color:6249043,roughness:1,flatShading:!0,side:gt})];for(let h=0;h<70;h++){const M=2+Math.random()*7,v=Fn(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),M,70,30);if(!v)continue;const{x:y,z:E}=v,T=new V(new ya(M,0),t[h%t.length]),R=T.geometry.attributes.position;for(let C=0;C<R.count;C++)R.setXYZ(C,R.getX(C)*(.8+Math.random()*.4),R.getY(C)*(.6+Math.random()*.4),R.getZ(C)*(.8+Math.random()*.4));R.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(y,Xe(y,E)+M*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,tt.add(T),Ki.push({kind:"rock",x:y,z:E,radius:M*1.12}),Nn("rock",y,E,M,70)}const n=[11969084,9416262,7314255,13218138,8228670];for(let h=0;h<14;h++){const M=130+Math.random()*200,v=130+Math.random()*200,y=Fn(()=>({x:-1500+Math.random()*3e3,z:-700-Math.random()*1700}),Math.max(M,v)*.5,40,24);if(!y)continue;const{x:E,z:T}=y,R=new at,C=5+Math.floor(Math.random()*4),b=n[Math.floor(Math.random()*n.length)];for(let S=0;S<C;S++){const L=new q({color:S%2?b:n[Math.floor(Math.random()*n.length)],roughness:1}),U=new V(new Bt(M,v/C),L);U.rotation.x=-Math.PI/2,U.position.set(0,.05,-v/2+(S+.5)*(v/C)),R.add(U)}R.position.set(E,Xe(E,T)+.05,T),R.rotation.y=Math.random()*Math.PI,tt.add(R),Nn("field",E,T,Math.max(M,v)*.5,40)}{const h=Fn(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(h){const M=new q({color:4165552,roughness:.12,metalness:.35,transparent:!0,opacity:.88}),v=new V(new tn(150,40),M);v.rotation.x=-Math.PI/2,v.position.set(h.x,-6.4,h.z),v.scale.set(1.5,1,1),tt.add(v),Nn("lake",h.x,h.z,170,60),Un(v,y=>{M.opacity=.84+Math.sin(y*.8)*.05,v.rotation.z=Math.sin(y*.2)*.02})}}const s=new q({color:15922422,roughness:.5,metalness:.2});for(let h=0;h<9;h++){const M=h/9*Math.PI*2+.6,v=1500+Math.random()*700,y=Math.cos(M)*v,E=Math.sin(M)*v-1150,T=60+Math.random()*40,R=new at,C=new V(new ut(1.1,2.2,T,10),s);C.position.y=T/2,R.add(C);const b=new at;b.position.set(0,T,3);const S=new V(new Le(3,3,7),s);b.add(S);const L=new at;L.position.z=3.5;for(let H=0;H<3;H++){const te=new V(new Le(1.1,26,.5),s);te.position.y=13;const ne=new at;ne.add(te),ne.rotation.z=H/3*Math.PI*2,L.add(ne)}b.add(L),R.add(b),R.position.set(y,-8,E),R.rotation.y=Math.random()*Math.PI,tt.add(R);const U=.5+Math.random()*.5;Un(L,H=>{L.rotation.z=H*U})}const r=new q({color:7041398,roughness:.6,metalness:.4}),a=new rc({color:2764595,transparent:!0,opacity:.5});let o=null;for(let h=0;h<7;h++){const M=-1100+h*360,v=-1650-Math.sin(h*.7)*120,y=48,E=new at,T=6;for(const C of[-1,1])for(const b of[-1,1]){const S=new V(new ut(.4,.7,y,5),r);S.position.set(C*T,y/2,b*T),S.rotation.z=-C*.08,S.rotation.x=b*.08,E.add(S)}for(const C of[y*.6,y*.82,y]){const b=new V(new Le(T*4,.8,.8),r);b.position.y=C,E.add(b)}E.position.set(M,Xe(M,v)-2,v),tt.add(E);const R=Xe(M,v)-2+y;if(o)for(const C of[-T*2,0,T*2]){const b=o.x+C,S=o.z,L=M+C,U=v,H=[],te=12;for(let W=0;W<=te;W++){const Q=W/te,ie=Math.sin(Q*Math.PI)*6;H.push(new P(b+(L-b)*Q,o.y-ie+(R-o.y)*Q,S+(U-S)*Q))}const ne=new Tl(new Xt().setFromPoints(H),a);tt.add(ne)}o={x:M,y:R,z:v}}const c=new q({color:11680302,roughness:.6,metalness:.3}),l=new q({color:15263976,roughness:.6,metalness:.3});for(let h=0;h<5;h++){const M=Fn(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!M)continue;const{x:v,z:y}=M,E=70+Math.random()*50,T=new at,R=8;for(let L=0;L<R;L++){const U=new V(new ut(.5,.7,E/R,4),L%2?l:c);U.position.y=(L+.5)*(E/R),U.rotation.y=Math.PI/4,T.add(U)}const C=new q({color:16722458,emissive:16718346,emissiveIntensity:2}),b=new V(new Gt(1.1,10,8),C);b.position.y=E+1,T.add(b),T.position.set(v,Xe(v,y),y),tt.add(T),Nn("mast",v,y,8,120);const S=Math.random()*Math.PI*2;Un(b,L=>{C.emissiveIntensity=Math.sin(L*2.4+S)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let h=0;h<6;h++){const M=new at,v=d[h%d.length],y=new q({map:M1(v[0],v[1]),roughness:.5,metalness:.05,emissive:new it(v[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new V(new Gt(11,20,16),y);E.scale.y=1.25,M.add(E);const T=new V(new Le(3.4,3,3.4),new q({color:8014371,roughness:.9}));T.position.y=-17,M.add(T);const R=new rc({color:3811866});for(const U of[-1,1])for(const H of[-1,1]){const te=new Tl(new Xt().setFromPoints([new P(U*1.6,-15.5,H*1.6),new P(U*7,-3,H*7)]),R);M.add(te)}const C=-700+Math.random()*1400,b=-700-Math.random()*1200,S=280+Math.random()*100;M.position.set(C,S,b),tt.add(M);const L=Math.random()*Math.PI*2;Un(M,U=>{M.position.y=S+Math.sin(U*.5+L)*6,M.position.x=C+Math.sin(U*.08+L)*90,M.rotation.z=Math.sin(U*.4+L)*.04})}const u=new At({color:2829104,side:gt,fog:!1});function p(){const h=new Oc;return h.moveTo(0,0),h.lineTo(-2.6,1.1),h.lineTo(-2.2,.2),h.lineTo(0,.5),h.lineTo(2.2,.2),h.lineTo(2.6,1.1),h.lineTo(0,0),new V(new ba(h),u)}for(let h=0;h<5;h++){const M=new at,v=5+Math.floor(Math.random()*5),y=[];for(let L=0;L<v;L++){const U=p(),H=L%2?1:-1,te=Math.ceil(L/2);U.position.set(H*te*5,-te*2.4,0),U.rotation.x=-Math.PI/2,M.add(U),y.push(U)}const E=150+Math.random()*120,T=-500-Math.random()*1400,R=18+Math.random()*14,C=1400,b=-700+Math.random()*1400;M.position.set(b,E,T),tt.add(M);const S=Math.random()*Math.PI*2;Un(M,(L,U)=>{M.position.x+=R*U,M.position.x>C&&(M.position.x=-C);const H=Math.sin(L*6+S);for(const te of y)te.rotation.x=-Math.PI/2+H*.4})}{const h=new at,M=new q({color:14673644,roughness:.4,metalness:.2}),v=new V(new Gt(20,20,16),M);v.scale.set(2.6,1,1),h.add(v);const y=new q({color:13781835,roughness:.6});for(let b=0;b<3;b++){const S=new V(new Le(10,9,.6),y);S.position.x=-46,S.rotation.x=b/3*Math.PI*2,h.add(S)}const E=new V(new Le(10,4,4),new q({color:3356475,roughness:.7}));E.position.y=-19,h.add(E);const T=new V(new Bt(40,10),new At({map:Wc("STEEL RIBBON"),transparent:!0,side:gt}));T.position.set(60,0,0),h.add(T);const R=900,C=240;h.position.set(0,C,-1200),tt.add(h),Un(h,b=>{const S=b*.05;h.position.x=Math.cos(S)*R,h.position.z=-1200+Math.sin(S)*R*.5,h.position.y=C+Math.sin(b*.3)*8,h.rotation.y=-S+Math.PI/2})}const m=new At({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let h=0;h<14;h++){const M=new V(new Bt(220+Math.random()*360,16+Math.random()*22),m.clone());M.material.opacity=.12+Math.random()*.18,M.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),M.rotation.x=-Math.PI/2.1,M.rotation.z=Math.random()*Math.PI,M.scale.y=.3,tt.add(M);const v=2+Math.random()*3;Un(M,(y,E)=>{M.position.x+=v*E,M.position.x>1400&&(M.position.x=-1400)})}const g=new q({color:13620954,roughness:.6,metalness:.2}),_=new At({map:S1(),side:gt});for(let h=0;h<4;h++){const M=Fn(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!M)continue;const{x:v,z:y}=M,E=new at,T=60+Math.random()*40,R=new V(new Le(T,1.4,26),g);R.position.set(0,26,-4),R.rotation.x=-.32,E.add(R);const C=new V(new Bt(T*.94,24),_);C.position.set(0,12,6),C.rotation.x=-.85,E.add(C);for(const b of[-T/2,T/2]){const S=new V(new Le(1.4,26,1.4),g);S.position.set(b,13,-8),E.add(S)}E.position.set(v,Xe(v,y),y),E.rotation.y=Math.atan2(-v,-y)+(Math.random()-.5)*.5,tt.add(E),Nn("grandstand",v,y,40,30)}const x=[16731486,16765503,16777215,11824127];for(let h=0;h<90;h++){const M=Fn(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!M)continue;const{x:v,z:y}=M,E=new at,T=x[Math.floor(Math.random()*x.length)],R=new At({color:T,side:gt}),C=5+Math.floor(Math.random()*6);for(let b=0;b<C;b++){const S=new V(new tn(.5+Math.random()*.4,5),R);S.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),S.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,S.rotation.z=Math.random()*Math.PI,E.add(S)}E.position.set(v,Xe(v,y),y),tt.add(E),Nn("flowers",v,y,3,20)}}const _n=[],Yn=[];let uc=0;const Ki=[],Sr=[],Ai=[],fc=[],vr=[],ws=[],qe={traffic:0,pedestrians:0,types:{},turns:0,splats:0,trafficCrashes:0,streetLights:0,trafficLights:0,stopSigns:0,signs:0,roadDetails:{},buildingArchetypes:{},zones:{},openerProps:0},xa=[];function Hi(i,e,t,n){qe.signs++,xa.length<160&&xa.push({kind:i,x:+e.toFixed(1),y:+t.toFixed(1),z:+n.toFixed(1)})}function Si(i,e,t=1){qe[i][e]=(qe[i][e]||0)+t}function u1(i,e){const t=new at,n={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=n[i]||n.compact,r=new q({color:e,roughness:.34,metalness:.28}),a=new q({color:new it(e).multiplyScalar(.52),roughness:.42,metalness:.24}),o=new q({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2}),c=new q({color:395016,roughness:.72,metalness:.02}),l=new q({color:14147041,roughness:.2,metalness:.68}),d=new q({color:16774064,roughness:.2,emissive:16765788,emissiveIntensity:.82}),u=new q({color:16725033,roughness:.22,emissive:16717325,emissiveIntensity:.7}),p=new V(new Le(s.w,s.h,s.l),i==="taxi"?new q({color:16767293,roughness:.36,metalness:.24}):r);p.position.y=.95,t.add(p);const m=new V(new Le(s.cabin[0],s.cabin[1],s.cabin[2]),s.bus?o:r);if(m.position.set(0,1.65,s.cabinZ),t.add(m),!s.bus){const x=new V(new Le(s.cabin[0]*.78,s.cabin[1]*.55,.08),o);x.position.set(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),t.add(x);for(const h of[-1,1]){const M=new V(new Le(.08,s.cabin[1]*.5,s.cabin[2]*.48),o);M.position.set(h*(s.cabin[0]*.5+.04),1.68,s.cabinZ),t.add(M)}}if(s.bed){const x=new V(new Le(s.w*.94,.58,s.l*.38),a);x.position.set(0,1.2,1.35),t.add(x)}if(s.box){const x=new V(new Le(s.box[0],s.box[1],s.box[2]),new q({color:15130833,roughness:.62,metalness:.05}));x.position.set(0,1.55,1.25),t.add(x)}if(s.bus){const x=new V(new Le(s.w+.06,.28,s.l*.86),a);x.position.set(0,1.38,0),t.add(x);for(let h=-2.8;h<=3.1;h+=1.2)for(const M of[-1,1]){const v=new V(new Le(.08,.64,.72),o);v.position.set(M*(s.w*.5+.05),2.08,h),t.add(v)}}if(s.sign){const x=new V(new Le(1,.24,.46),new q({color:16774310,roughness:.2,emissive:16765773,emissiveIntensity:.9}));x.position.set(0,2.2,-.35),t.add(x)}const g=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],_=[];for(const x of g)for(const h of[-s.w*.54,s.w*.54]){const M=new V(new ut(.42,.42,.36,14),c);M.rotation.z=Math.PI/2,M.position.set(h,.45,x),t.add(M),_.push(M);const v=new V(new ut(.18,.18,.38,10),l);v.rotation.z=Math.PI/2,v.position.set(h,.45,x),t.add(v)}for(const x of[-s.w*.28,s.w*.28]){const h=new V(new Le(.42,.2,.08),d);h.position.set(x,.95,-s.l*.52),t.add(h);const M=new V(new Le(.36,.22,.08),u);M.position.set(x,.98,s.l*.52),t.add(M)}return t.userData={wheels:_,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55},t.traverse(x=>{x.castShadow=!0,x.receiveShadow=!0}),t}function f1(i,e){const t=new at,n=new q({color:12947299,roughness:.72}),s=new q({color:i,roughness:.68}),r=new q({color:e,roughness:.76}),a=new q({color:1119001,roughness:.82}),o=new V(new ut(.28,.34,.95,8),s);o.position.y=1.35,t.add(o);const c=new V(new Gt(.24,10,8),n);c.position.y=2.02,t.add(c);const l=new V(new Gt(.25,8,5),a);l.scale.y=.5,l.position.y=2.17,t.add(l);const d=[];for(const u of[-.16,.16]){const p=new V(new ut(.075,.09,.78,6),r);p.position.set(u,.58,0),t.add(p),d.push({mesh:p,side:Math.sign(u),baseY:.58,amp:.28})}for(const u of[-.38,.38]){const p=new V(new ut(.055,.065,.72,6),n);p.position.set(u,1.33,0),p.rotation.z=u<0?-.18:.18,t.add(p),d.push({mesh:p,side:-Math.sign(u),baseY:1.33,amp:.34})}return t.userData.limbs=d,t.traverse(u=>{u.castShadow=!0,u.receiveShadow=!0}),t}function p1(i,e,t){const{X0:n,X1:s,ZN:r,ZF:a,pitch:o,streetW:c,trafficControls:l=new Map}=t,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],u=["compact","taxi","pickup","van","boxTruck","bus"],p=[],m=30,g=[],_=[];for(let I=n;I<=s+1;I+=o)g.push(Math.round(I));for(let I=r;I>=a-1;I-=o)_.push(Math.round(I));_.sort((I,ye)=>I-ye);const x=g[0],h=g[g.length-1],M=_[0],v=_[_.length-1];Ai.length=0,fc.length=0,vr.length=0,ws.length=0,qe.traffic=0,qe.pedestrians=0,qe.types={},qe.turns=0,qe.splats=0,qe.trafficCrashes=0,qe.streetLights=0,qe.trafficLights=0,qe.stopSigns=0;const y=I=>I[Math.random()*I.length|0],E=I=>(I>0?-1:1)*c*.23,T=(I,ye)=>{let Me=0,Se=1/0;for(let $=0;$<I.length;$++){const K=Math.abs(I[$]-ye);K<Se&&(Se=K,Me=$)}return Me},R=(I,ye,Me)=>{const Se=I==="ns"?_:g;if(Me>0){for(const $ of Se)if($>ye+.05)return $;return Se[Se.length-1]}for(let $=Se.length-1;$>=0;$--)if(Se[$]<ye-.05)return Se[$];return Se[0]},C=I=>{const ye=I.laneOffset+(I.avoidOffset||0);return I.axis==="ns"?{x:I.road+ye,z:I.along}:{x:I.along,z:I.road+ye}},b=I=>{if(f.mode!=="roam")return null;const ye=C(I);if(Math.abs(f.roamPos.y-(Xe(ye.x,ye.z)+Jn))>4.2)return null;const Me=I.axis==="ns"?0:I.dir,Se=I.axis==="ns"?I.dir:0,$=f.roamPos.x-ye.x,K=f.roamPos.z-ye.z,_e=$*Me+K*Se,be=I.axis==="ns"?$:K,Re=Math.abs(be),Ye=Math.hypot($,K),Pt=I.mesh?.userData?.colliderHalfW||2,Ze=I.mesh?.userData?.colliderHalfD||3;return Ye<Vn+Math.max(Pt,Ze)*.55||_e>-1.5&&_e<Ze+4.2&&Re<Vn+Pt*.85?{crash:!0}:_e>0&&_e<30&&Re<c*.36?{avoidOffset:(be>=0?-1:1)*I.maxAvoidOffset,stop:_e<13&&Re<Vn+Pt*.95}:null},S=(I,ye)=>`${Math.round(I)},${Math.round(ye)}`,L=(I,ye)=>{const Se=((ye+I.phase)%15.5+15.5)%15.5;return Se<6.2?"ns":Se<7.4?"yellow-ns":Se<13.6?"ew":"yellow-ew"},U=(I,ye)=>{const Me=I.axis==="ns"?I.road:I.next,Se=I.axis==="ns"?I.next:I.road,$=S(Me,Se),K=l.get($);if(!K)return null;if(K.type==="signal"){const _e=L(K,ye),be=_e===`yellow-${I.axis}`;return _e===I.axis&&!be?null:{control:K,key:$,kind:"signal"}}return K.type==="stop"&&I.lastControlKey!==$?{control:K,key:$,kind:"stop"}:null},H=(I,ye=!1)=>{const Me=I.axis,Se=I.along,$=Me==="ns"?g:_,K=I.road,_e=T($,K),be=[],Re=Me==="ns"?M:x,Ye=Me==="ns"?v:h;!ye&&Se+I.dir*o>=Re&&Se+I.dir*o<=Ye&&be.push({axis:Me,road:I.road,along:Se,dir:I.dir,turn:!1}),_e>0&&be.push({axis:Me==="ns"?"ew":"ns",road:Se,along:K,dir:-1,turn:!0}),_e<$.length-1&&be.push({axis:Me==="ns"?"ew":"ns",road:Se,along:K,dir:1,turn:!0}),be.length||be.push({axis:Me,road:I.road,along:Se,dir:-I.dir,turn:!0});const Pt=be.filter(Tt=>Tt.turn),Ze=!ye&&Pt.length&&Math.random()<.42?y(Pt):y(be);(Ze.turn||Ze.axis!==Me)&&qe.turns++,I.axis=Ze.axis,I.road=Ze.road,I.along=Ze.along,I.dir=Ze.dir,I.laneOffset=E(I.dir),I.next=R(I.axis,I.along,I.dir),I.turnBlend=Ze.turn?1:0,I.lastControlKey=null};for(let I=0;I<m;I++){const ye=Math.random()<.56?"ns":"ew",Me=u[I%u.length],Se=Math.random()<.5?-1:1,$=(Me==="bus"||Me==="boxTruck"?10:13)+Math.random()*9,K={axis:ye,dir:Se,road:y(ye==="ns"?g:_),laneOffset:E(Se),along:y(ye==="ns"?_:g),speed:$,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,avoidOffset:0,maxAvoidOffset:c*.31,crashTimer:0,waitTimer:0,lastControlKey:null,mesh:u1(Me,d[I*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};K.collider.actor=K,I<8&&(K.axis="ns",K.dir=-1,K.laneOffset=E(K.dir),K.road=[210,-50,210,-50][I%4],K.along=318-I*54,K.speed+=3),K.next=R(K.axis,K.along,K.dir),Ai.push(K.collider),p.push(K),fc.push(K),i.add(K.mesh),qe.types[Me]=(qe.types[Me]||0)+1}function te(I,ye=0,Me=0){let Se=Math.max(0,I.speed*Me);const $=b(I);for($?.crash?(Pd(I,f.roamPos),Se=0):$?(I.avoidOffset+=($.avoidOffset-I.avoidOffset)*Math.min(1,Me*4.5),I.brakePulse=Math.max(I.brakePulse||0,$.stop?1:.35),$.stop&&(I.waitTimer=Math.max(I.waitTimer,.22),Se=0)):I.avoidOffset+=(0-I.avoidOffset)*Math.min(1,Me*1.8),I.crashTimer>0&&(I.crashTimer=Math.max(0,I.crashTimer-Me),Se=0),I.waitTimer>0&&(I.waitTimer=Math.max(0,I.waitTimer-Me),Se=0);Se>0;){const z=U(I,ye);if(z){const ht=I.next-I.dir*(z.kind==="signal"?12:8),Ct=(ht-I.along)*I.dir;if(Ct>=-.35&&Ct<=Se+.25){I.along=ht,I.brakePulse=1,Se=0,z.kind==="stop"&&(I.waitTimer=.65+Math.random()*.4,I.lastControlKey=z.key);break}}const ft=Math.abs(I.next-I.along);if(Se<ft)I.along+=I.dir*Se,Se=0;else{I.along=I.next,Se-=ft;const ht=I.next<=(I.axis==="ns"?M:x)+.05||I.next>=(I.axis==="ns"?v:h)-.05;H(I,ht)}}I.brakePulse=Math.max(0,(I.brakePulse||0)-Me*3.2),I.turnBlend=Math.max(0,I.turnBlend-Me*3.2);const{x:K,z:_e}=C(I),be=I.axis==="ns"?0:I.dir,Re=I.axis==="ns"?I.dir:0;I.mesh.position.set(K,Xe(K,_e)+.28+Math.sin(ye*3.2+I.bob)*.035,_e);const Ye=Math.atan2(-be,-Re),Pt=Math.atan2(Math.sin(Ye-I.mesh.rotation.y),Math.cos(Ye-I.mesh.rotation.y));I.mesh.rotation.y+=Pt*Math.min(1,Me*7+I.turnBlend*.55),I.crashTimer>0&&(I.mesh.rotation.y+=Math.sin(ye*22+I.bob)*.02);for(const z of I.mesh.userData.wheels||[])z.rotation.x-=I.dir*I.speed*Me*1.7;const Ze=I.mesh.userData.colliderHalfD,Tt=I.mesh.userData.colliderHalfW;I.collider.x=K,I.collider.z=_e,I.collider.hw=I.axis==="ns"?Tt:Ze,I.collider.hd=I.axis==="ns"?Ze:Tt,I.collider.maxY=I.mesh.position.y+3.2}for(const I of p)te(I,0,0);qe.traffic=p.length,Un(i,(I,ye)=>{for(const Me of p)te(Me,I,ye)});const ne=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],W=[2437188,3092787,4930093,2244434],Q=[],ie=45;for(let I=0;I<ie;I++){const ye=Math.random()<.56?"ns":"ew",Me=e[Math.random()*e.length|0],Se=Math.abs(Me.z1-Me.z0)>Math.abs(Me.x1-Me.x0),$=ye==="ns"?Se?"ns":"ew":Se?"ew":"ns",K=Math.random()<.5?-1:1,_e=Math.random()<.5?-1:1,be={axis:$,dir:K,sideSign:_e,coord:y($==="ns"?g:_),along:$==="ns"?a+Math.random()*(r-a):n+Math.random()*(s-n),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:f1(ne[I%ne.length],W[I*2%W.length])};I<14&&(be.axis="ns",be.coord=80,be.sideSign=I%2?-1:1,be.dir=I%3===0?1:-1,be.along=350-I*24,be.speed=1.5+I%4*.35),Q.push(be),vr.push(be),i.add(be.mesh)}const de=new At({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:gt}),fe=new At({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:gt});for(let I=0;I<18;I++){const ye=new at,Me=new V(new tn(1,12),de.clone());Me.rotation.x=-Math.PI/2,ye.add(Me);for(let Se=0;Se<7;Se++){const $=new V(new tn(.25+Math.random()*.25,8),fe.clone());$.rotation.x=-Math.PI/2,$.position.set(Math.cos(Se)*(.6+Math.random()*1.2),.01,Math.sin(Se*1.7)*(.5+Math.random()*1.1)),ye.add($)}ye.visible=!1,ye.userData.life=0,ye.userData.maxLife=2.8,ye.position.y=-99,i.add(ye),ws.push(ye)}function ze(I,ye=0,Me=0){if(!I.active)if(I.respawn-=Me,I.respawn<=0)I.active=!0,I.mesh.visible=!0,I.along+=I.dir*50;else return;I.along+=I.dir*I.speed*Me,I.axis==="ns"?(I.along<a-28&&(I.along=r+28),I.along>r+28&&(I.along=a-28)):(I.along<n-28&&(I.along=s+28),I.along>s+28&&(I.along=n-28));const Se=I.sideSign*(c*.66+1.2),$=I.axis==="ns"?I.coord+Se:I.along,K=I.axis==="ns"?I.along:I.coord+Se,_e=I.axis==="ns"?0:I.dir,be=I.axis==="ns"?I.dir:0;I.x=$,I.z=K,I.mesh.position.set($,Xe($,K)+.08,K),I.mesh.rotation.y=Math.atan2(-_e,-be);const Re=Math.sin(ye*7+I.phase);for(const Ye of I.mesh.userData.limbs||[])Ye.mesh.rotation.x=Re*Ye.amp*Ye.side,Ye.mesh.position.y=Ye.baseY+Math.abs(Re)*.025}for(const I of Q)ze(I,0,0);qe.pedestrians=Q.length,Un(i,(I,ye)=>{for(const Me of Q)ze(Me,I,ye);for(const Me of ws){if(!Me.visible)continue;Me.userData.life-=ye;const Se=Me.userData.life,$=Be.clamp(Se/Me.userData.maxLife,0,1);Me.scale.setScalar(1+(1-$)*.35),Me.traverse(K=>{K.material&&(K.material.opacity=Math.min(.78,$*1.2))}),Se<=0&&(Me.visible=!1)}})}function m1(){const i=new at,e=new Wt;new pi().setFromAxisAngle(new P(1,0,0),-Math.PI/2),qe.roadDetails={},qe.buildingArchetypes={},qe.zones={},qe.openerProps=0;const t=li.x0,n=li.x1,s=li.zNear,r=li.zFar,a=li.pitch,o=li.streetW,c=a-o,l=[],d=[];for(let F=t;F<=n+1;F+=a)l.push(Math.round(F));for(let F=s;F>=r-1;F-=a)d.push(Math.round(F));const u=[];for(const F of l)u.push({x0:F,z0:s,x1:F,z1:r});for(const F of d)u.push({x0:t,z0:F,x1:n,z1:F});function p(F,N){const X=F.x1-F.x0,j=F.z1-F.z0,ee=Math.hypot(X,j)||1,ae=-j/ee,se=X/ee;return{x0:F.x0+ae*N,z0:F.z0+se*N,x1:F.x1+ae*N,z1:F.z1+se*N}}function m(F,N,X){const j=[],ee=[];for(const se of F){const De=se.x1-se.x0,w=se.z1-se.z0,O=Math.hypot(De,w),G=Math.max(1,Math.round(O/14)),Y=De/O,Z=-(w/O),he=Y;let pe=null,ge=null;for(let Ae=0;Ae<=G;Ae++){const ve=Ae/G,Fe=ve*O/68,Ke=se.x0+De*ve,dt=se.z0+w*ve,Mt=Ke+Z*N,St=dt+he*N,mt=Ke-Z*N,He=dt-he*N,Lt=[Mt,Xe(Mt,St)+X,St,Fe],ct=[mt,Xe(mt,He)+X,He,Fe];pe&&(j.push(pe[0],pe[1],pe[2],ge[0],ge[1],ge[2],ct[0],ct[1],ct[2]),j.push(pe[0],pe[1],pe[2],ct[0],ct[1],ct[2],Lt[0],Lt[1],Lt[2]),ee.push(0,pe[3],1,ge[3],1,ct[3]),ee.push(0,pe[3],1,ct[3],0,Lt[3])),pe=Lt,ge=ct}}const ae=new Xt;return ae.setAttribute("position",new wt(j,3)),ae.setAttribute("uv",new wt(ee,2)),ae.computeVertexNormals(),ae}const g=new q({map:t1(),color:13097186,roughness:.34,metalness:.24,envMapIntensity:1.25,side:gt}),_=new q({color:11054244,roughness:.62,metalness:.04}),x=new q({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12}),h=new q({color:15855586,roughness:.48,metalness:.02,emissive:3158064,emissiveIntensity:.1}),M=new q({color:15921375,roughness:.4,metalness:.03,emissive:2960676,emissiveIntensity:.12}),v=new q({color:3422266,roughness:.58,metalness:.48}),y=[],E=[];for(const F of u)y.push(p(F,o*.5+3.3),p(F,-13.3)),E.push(p(F,o*.5+.42),p(F,-10.42));const T=new V(m(y,2.9,.66),_);T.receiveShadow=!0,i.add(T);const R=new V(m(E,.28,.78),x);R.receiveShadow=!0,i.add(R),Si("roadDetails","sidewalkRuns",y.length),Si("roadDetails","curbRuns",E.length);const C=new V(m(u,o/2,.55),g);C.receiveShadow=!0,i.add(C);const b=new q({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:gt});i.add(new V(m(u,.4,.62),b));let S=0,L=0,U=0;for(let F=1;F<l.length-1;F++)for(let N=1;N<d.length-1;N++){const X=l[F],j=d[N];if(!(Cn(X,j,o*.75).clearance<2))for(const ee of[-1,1]){const ae=new V(new Le(o*.92,.07,1.15),h);ae.position.set(X,Xe(X,j+ee*13)+.83,j+ee*13),ae.receiveShadow=!0,i.add(ae);const se=new V(new Le(1.15,.07,o*.92),h);se.position.set(X+ee*13,Xe(X+ee*13,j)+.83,j),se.receiveShadow=!0,i.add(se),S+=2}}const H=new Oc;H.moveTo(0,5.8),H.lineTo(2.5,1.6),H.lineTo(.72,1.6),H.lineTo(.72,-5.2),H.lineTo(-.72,-5.2),H.lineTo(-.72,1.6),H.lineTo(-2.5,1.6),H.closePath();const te=new ba(H);te.rotateX(-Math.PI/2);for(const F of u){const N=Math.abs(F.x1-F.x0)<Math.abs(F.z1-F.z0),X=Math.hypot(F.x1-F.x0,F.z1-F.z0),j=Math.max(2,Math.floor(X/280));for(let ee=0;ee<j;ee++){const ae=(ee+.5)/j,se=F.x0+(F.x1-F.x0)*ae,De=F.z0+(F.z1-F.z0)*ae;if(Cn(se,De,4).clearance<2)continue;const w=new V(te,M);if(w.position.set(se,Xe(se,De)+.86,De),w.rotation.y=N?0:Math.PI/2,w.scale.setScalar(.9),i.add(w),L++,ee%2===0){const O=new V(new ut(1.05,1.05,.08,24),v);O.position.set(se+(N?3.8:0),Xe(se,De)+.84,De+(N?0:3.8)),i.add(O),U++}}}Si("roadDetails","crosswalks",S),Si("roadDetails","laneArrows",L),Si("roadDetails","manholes",U);const ne=new At({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:gt,blending:Ti}),W=new At({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:gt,blending:Ti});for(let F=0;F<120;F++){const N=u[Math.random()*u.length|0],X=Math.random(),j=N.x0+(N.x1-N.x0)*X,ee=N.z0+(N.z1-N.z0)*X;if(Cn(j,ee,4).clearance<2)continue;const ae=new V(new tn(1,18),(F%4===0?W:ne).clone());ae.rotation.x=-Math.PI/2,ae.rotation.z=Math.atan2(N.x1-N.x0,N.z1-N.z0)+(Math.random()-.5)*.35,ae.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),ae.position.set(j+(Math.random()-.5)*o*.7,Xe(j,ee)+.66,ee+(Math.random()-.5)*o*.7),i.add(ae)}const Q=[Ss(160,320,.5),Ss(160,320,.62),Ss(160,320,.42)],ie=[new q({map:Q[0],color:7042688,roughness:.42,metalness:.26,emissive:2315117,emissiveIntensity:.34}),new q({map:Q[1],color:8550507,roughness:.46,metalness:.22,emissive:4860952,emissiveIntensity:.32}),new q({map:Q[2],color:4414064,roughness:.4,metalness:.3,emissive:1523562,emissiveIntensity:.38})],de=new Le(1,1,1),fe=[[],[],[]],ze=[],I=[],ye=[],Me=[],Se=[],$=[],K=[],_e=[],be=[],Re=[],Ye=[],Pt=[],Ze=[],Tt=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],z=n1(256,256,"#dbcdb8"),ft=i1(),ht=s1(),Ct=[uo(512,384,"#944737","#2e95bf"),uo(512,384,"#7e4d3e","#d04d65"),uo(512,384,"#a65a35","#4fba6d")],Ge=r1();function It(F,N){Si("zones",F),Si("buildingArchetypes",N)}function $e(F,N,X,j,ee,ae="downtown"){if(Vi(F,N,X,j))return!1;const se=Js(F,N,X,j)-1.1;if(Gi(F,N,X,j,se+ee+2))return!1;if(e.position.set(F,se+ee/2,N),e.quaternion.identity(),e.scale.set(X,ee,j),e.updateMatrix(),fe[Math.random()*3|0].push(e.matrix.clone()),e.position.set(F,se+ee+.6,N),e.scale.set(X*1.04,1.2,j*1.04),e.updateMatrix(),ze.push(e.matrix.clone()),ee>26){const De=Math.random()<.72?3790847:16730294;for(const w of[-1,1])e.position.set(F,se+ee+1.35,N+w*(j*.52+.12)),e.scale.set(X*1.12,.22,.18),e.updateMatrix(),I.push(e.matrix.clone()),ye.push(De);Math.random()<.34&&Me.push({px:F,pz:N,w:X,d:j,h:ee,gy:se,zSide:Math.random()<.5?-1:1})}if(ee>14&&Math.random()<.48){const De=Math.random()<.5?"x":"z";Se.push({px:F,pz:N,w:X,d:j,h:ee,gy:se,axis:De,side:Math.random()<.5?-1:1})}if(ee>28&&Math.random()<.18){const De=Math.random()<.5?"x":"z";$.push({px:F,pz:N,w:X,d:j,h:ee,gy:se,axis:De,side:Math.random()<.5?-1:1})}return _n.push({x:F,z:N,hw:X*.5,hd:j*.5,maxY:se+ee+2}),It(ae,ee>64?"glassTower":"midrise"),!0}function ot(F,N,X,j,ee,ae="residential"){if(Vi(F,N,X,j))return!1;const se=Js(F,N,X,j)-.55,De=2+Math.random()*2.4;if(Gi(F,N,X,j,se+ee+De+1.5,6))return!1;e.position.set(F,se+ee/2,N),e.quaternion.identity(),e.scale.set(X,ee,j),e.updateMatrix(),K.push(e.matrix.clone()),_n.push({x:F,z:N,hw:X*.5,hd:j*.5,maxY:se+ee+De+1.5}),_e.push(Tt[Math.random()*Tt.length|0]),e.position.set(F,se+ee+De/2,N),e.scale.set(X*.82,De,j*.82),e.updateMatrix(),be.push(e.matrix.clone());const w=t+Math.round((F-t)/a)*a,O=s-Math.round((s-N)/a)*a,G=Math.abs(F-w)<Math.abs(N-O),Y=G?w>F?1:-1:O>N?1:-1,B=Math.min(G?j*.46:X*.46,8.5),Z=Math.min(ee*.58,4.6),he=Math.min(24,Math.max(8,G?Math.abs(w-F)-X*.5-o*.35:Math.abs(O-N)-j*.5-o*.35));e.quaternion.identity(),G?(e.position.set(F+Y*(X*.5+.1),se+Z*.5+.1,N-j*.16),e.scale.set(.24,Z,B),e.updateMatrix(),Re.push(e.matrix.clone()),e.position.set(F+Y*(X*.5+he*.5),Xe(F+Y*(X*.5+he*.5),N)+.08,N-j*.16),e.scale.set(he,.08,B*1.18)):(e.position.set(F-X*.16,se+Z*.5+.1,N+Y*(j*.5+.1)),e.scale.set(B,Z,.24),e.updateMatrix(),Re.push(e.matrix.clone()),e.position.set(F-X*.16,Xe(F,N+Y*(j*.5+he*.5))+.08,N+Y*(j*.5+he*.5)),e.scale.set(B*1.18,.08,he)),e.updateMatrix(),Ye.push(e.matrix.clone()),e.position.set(F,se+.02,N),e.scale.set(X*1.58,.05,j*1.58),e.updateMatrix(),Pt.push(e.matrix.clone());for(let pe=0;pe<3;pe++){const ge=G?F+Y*(X*.55):F+(pe-1)*X*.25,Ae=G?N+(pe-1)*j*.28:N+Y*(j*.55);e.position.set(ge,Xe(ge,Ae)+.55,Ae);const ve=.85+Math.random()*.75;e.scale.set(ve*1.35,ve,ve*1.35),e.updateMatrix(),Ze.push(e.matrix.clone())}return It(ae,"residentialHouse"),!0}function D(F,N,X,j,ee,ae="commercial"){if(Vi(F,N,X,j))return!1;const se=Js(F,N,X,j)-.8;if(Gi(F,N,X,j,se+ee+2,7))return!1;const De=new q({map:Ge,color:14144452,roughness:.5,metalness:.18,emissive:2106666,emissiveIntensity:.12}),w=new V(new Le(X,ee,j),De);w.position.set(F,se+ee/2,N),w.castShadow=!0,w.receiveShadow=!0,i.add(w);const O=new q({color:7502722,roughness:.52,metalness:.15}),G=new V(new Le(X*.72,.32,j*.18),O);G.position.set(F,se+ee*.38,N+j*.18),G.rotation.z=.13,i.add(G);const Y=new q({color:16768876,roughness:.28,metalness:.08,emissive:12679680,emissiveIntensity:.38});for(let B=5;B<ee;B+=9){const Z=new V(new Le(X*1.02,.24,.22),Y);Z.position.set(F,se+B,N+j*.5+.14),i.add(Z)}return _n.push({x:F,z:N,hw:X*.5,hd:j*.5,maxY:se+ee+2}),It(ae,"parkingGarage"),!0}function A(F,N,X,j,ee,ae="commercial"){if(Vi(F,N,X,j))return!1;const se=Js(F,N,X,j)-.65;if(Gi(F,N,X,j,se+ee+2,7))return!1;const De=new q({map:Ct[Math.random()*Ct.length|0],color:16777215,roughness:.64,metalness:.04,emissive:2166794,emissiveIntensity:.12}),w=new V(new Le(X,ee,j),De);w.position.set(F,se+ee/2,N),w.castShadow=!0,w.receiveShadow=!0,i.add(w);const O=new V(new Le(X*1.06,.9,j*1.06),new q({color:2237478,roughness:.56,metalness:.18}));O.position.set(F,se+ee+.45,N),i.add(O);const G=t+Math.round((F-t)/a)*a,Y=s-Math.round((s-N)/a)*a,B=Math.abs(F-G)<Math.abs(N-Y),Z=B?G>F?1:-1:Y>N?1:-1,he=bi[(F+N|0)%bi.length]||"#ffd45b",pe=new At({map:ho(yi[(Math.abs(F)+Math.abs(N)|0)%yi.length],he),transparent:!0,side:gt,depthWrite:!1}),ge=new V(new Bt(Math.min(16,B?j*.82:X*.82),4.2),pe);return B?(ge.position.set(F+Z*(X*.5+.2),se+ee*.66,N),ge.rotation.y=Z>0?Math.PI/2:-Math.PI/2):(ge.position.set(F,se+ee*.66,N+Z*(j*.5+.2)),ge.rotation.y=Z<0?Math.PI:0),i.add(ge),Hi("storefront-sign",ge.position.x,ge.position.y,ge.position.z),_n.push({x:F,z:N,hw:X*.5,hd:j*.5,maxY:se+ee+2}),It(ae,"brickStorefront"),!0}for(let F=t+a/2;F<=n-a/2;F+=a)for(let N=s-a/2;N>=r+a/2;N-=a){const X=Cn(F,N,c*.5).clearance;if(X<2)continue;const j=N>40&&N<380&&F>-360&&F<360,ee=j?"showcase":N<-920?"industrial":X>230||N<-430?"downtown":X<90?"residential":"commercial";if(X<90||j){const se=c/3;for(let De=0;De<3;De++)for(let w=0;w<3;w++){if(Math.random()<.14)continue;const O=F-c/2+se*(De+.5)+(Math.random()-.5)*se*.3,G=N-c/2+se*(w+.5)+(Math.random()-.5)*se*.3;if(Cn(O,G,8).clearance<1)continue;const Y=se*(.5+Math.random()*.22),B=se*(.5+Math.random()*.22);!j&&Math.random()<.16?$e(O,G,Y*.9,B*.9,12+Math.random()*12,ee):ot(O,G,Y,B,5+Math.random()*4.5,ee)}}else{const ae=X>230,se=ae?Be.clamp(50+X*1.1,60,175):Be.clamp(22+X*.3,22,62),De=2+(Math.random()<.72?1:0)+(Math.random()<.42?1:0);for(let w=0;w<De;w++){const O=13+Math.random()*Math.min(26,c*.44),G=13+Math.random()*Math.min(26,c*.44),Y=F+(Math.random()-.5)*(c-O),B=N+(Math.random()-.5)*(c-G);if(Cn(Y,B,Math.hypot(O,G)*.5).clearance<2)continue;const Z=(18+Math.random()*(se-18))*(ae&&Math.random()<.2?1.35:1);!ae&&(Math.random()<.38&&A(Y,B,Math.max(18,O*1.12),Math.max(18,G*1.08),12+Math.random()*14,ee)||Math.random()<.18&&D(Y,B,Math.max(24,O*1.35),Math.max(24,G*1.28),24+Math.random()*24,ee))||$e(Y,B,O,G,Z,ee)}}}for(let F=0;F<3;F++){if(!fe[F].length)continue;const N=new rn(de,ie[F],fe[F].length);for(let X=0;X<fe[F].length;X++)N.setMatrixAt(X,fe[F][X]);N.instanceMatrix.needsUpdate=!0,N.castShadow=!0,N.receiveShadow=!0,i.add(N)}if(ze.length){const F=new q({color:2896696,roughness:.62,metalness:.34}),N=new rn(de,F,ze.length);for(let X=0;X<ze.length;X++)N.setMatrixAt(X,ze[X]);N.instanceMatrix.needsUpdate=!0,i.add(N)}if(I.length){const F=new q({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),N=new rn(de,F,I.length);for(let X=0;X<I.length;X++)N.setMatrixAt(X,I[X]),N.setColorAt(X,new it(ye[X]));N.instanceMatrix.needsUpdate=!0,N.instanceColor&&(N.instanceColor.needsUpdate=!0),i.add(N)}if(K.length){const F=new q({color:4891451,roughness:.88,metalness:.02}),N=new rn(de,F,Pt.length);for(let Z=0;Z<Pt.length;Z++)N.setMatrixAt(Z,Pt[Z]);N.instanceMatrix.needsUpdate=!0,N.receiveShadow=!0,i.add(N);const X=new q({color:12040883,roughness:.48,metalness:.05}),j=new rn(de,X,Ye.length);for(let Z=0;Z<Ye.length;Z++)j.setMatrixAt(Z,Ye[Z]);j.instanceMatrix.needsUpdate=!0,j.receiveShadow=!0,i.add(j);const ee=new q({map:z,roughness:.78,metalness:.03}),ae=new rn(de,ee,K.length);for(let Z=0;Z<K.length;Z++)ae.setMatrixAt(Z,K[Z]),ae.setColorAt(Z,new it(_e[Z]));ae.instanceMatrix.needsUpdate=!0,ae.instanceColor&&(ae.instanceColor.needsUpdate=!0),ae.castShadow=!0,ae.receiveShadow=!0,i.add(ae);const se=new $i(.72,1,4);se.rotateY(Math.PI/4);const De=new q({map:ft,color:14314033,roughness:.72}),w=new rn(se,De,be.length);for(let Z=0;Z<be.length;Z++)w.setMatrixAt(Z,be[Z]);w.instanceMatrix.needsUpdate=!0,w.castShadow=!0,i.add(w);const O=new q({map:ht,roughness:.38,metalness:.18}),G=new rn(de,O,Re.length);for(let Z=0;Z<Re.length;Z++)G.setMatrixAt(Z,Re[Z]);G.instanceMatrix.needsUpdate=!0,i.add(G);const Y=new q({color:3112239,roughness:.88,metalness:.02}),B=new rn(new Gt(1,8,6),Y,Ze.length);for(let Z=0;Z<Ze.length;Z++)B.setMatrixAt(Z,Ze[Z]);B.instanceMatrix.needsUpdate=!0,B.castShadow=!0,B.receiveShadow=!0,i.add(B)}const J=["HOTEL","OPEN","AUTO","RACE","CAFE","PARTS","ARCADE","MOTEL","TACOS","VINYL"];for(let F=0;F<Math.min(Me.length,34);F++){const N=Me[F],X=J[F%J.length],j=F%3===0?"#ff4fb7":F%3===1?"#4ff3ff":"#ffd45b",ee=new At({map:lh(X,j),transparent:!0,side:gt,depthWrite:!1}),ae=new V(new Bt(8,24),ee);ae.position.set(N.px,N.gy+Math.max(14,N.h*.58),N.pz+N.zSide*(N.d*.5+.25)),ae.rotation.y=N.zSide<0?Math.PI:0,i.add(ae),Hi("vertical-neon",ae.position.x,ae.position.y,ae.position.z)}for(let F=0;F<Math.min(Se.length,48);F++){const N=Se[F],X=yi[(F*5+2)%yi.length],j=bi[(F*2+1)%bi.length],ee=new At({map:ho(X,j),transparent:!0,side:gt,depthWrite:!1}),ae=Math.min(17,(N.axis==="x"?N.d:N.w)*.82),se=new V(new Bt(ae,4.7),ee),De=N.gy+Math.max(6.2,Math.min(N.h-3.5,N.h*(.28+F%3*.12)));N.axis==="x"?(se.position.set(N.px+N.side*(N.w*.5+.22),De,N.pz),se.rotation.y=N.side>0?Math.PI/2:-Math.PI/2):(se.position.set(N.px,De,N.pz+N.side*(N.d*.5+.22)),se.rotation.y=N.side<0?Math.PI:0),i.add(se),Hi("wall-sign",se.position.x,se.position.y,se.position.z)}for(let F=0;F<Math.min($.length,18);F++){const N=$[F],X=yi[(F*7+4)%yi.length],j=ma[(F*5+3)%ma.length],ee=bi[(F+3)%bi.length],ae=new at,se=new q({map:gd(X,j,ee),color:16777215,roughness:.2,metalness:.06,emissive:new it(ee),emissiveIntensity:.34}),De=Math.min(18,(N.axis==="x"?N.d:N.w)*.86),w=new V(new Le(De,5.2,.42),se);w.position.y=4.8,ae.add(w);const O=new q({color:1053978,roughness:.44,metalness:.28});for(const G of[-De*.34,De*.34]){const Y=new V(new ut(.13,.17,5,8),O);Y.position.set(G,2.25,-.2),ae.add(Y)}ae.position.set(N.px,N.gy+N.h+.7,N.pz),ae.rotation.y=N.axis==="x"?N.side>0?Math.PI/2:-Math.PI/2:N.side<0?Math.PI:0,i.add(ae),Hi("roof-billboard",ae.position.x,ae.position.y+4.8,ae.position.z)}const ce=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],ue=new Le(2.2,1.4,4.6),re=130,Ve=new rn(ue,new q({roughness:.42,metalness:.36}),re);let Ce=0,je=0;for(;Ce<re&&je<re*6;){je++;const F=Math.random()<.5,N=F?t+Math.round(Math.random()*((n-t)/a))*a+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(n-t),X=F?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(Cn(N,X,4).clearance<2)continue;const j=Xe(N,X)+.7;e.position.set(N,j,X),e.quaternion.setFromAxisAngle(an,F?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Ve.setMatrixAt(Ce,e.matrix),Ve.setColorAt(Ce,new it(ce[Math.random()*ce.length|0])),Ce++}Ve.count=Ce,Ve.instanceMatrix.needsUpdate=!0,Ve.instanceColor&&(Ve.instanceColor.needsUpdate=!0),i.add(Ve);const We=new Map,me=(F,N)=>`${Math.round(F)},${Math.round(N)}`;function we(F,N){const j=((N+F.phase)%15.5+15.5)%15.5;return j<6.2?{green:"ns",yellow:null}:j<7.4?{green:null,yellow:"ns"}:j<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function nt(){const F=[],N=new q({color:1120028,roughness:.38,metalness:.62}),X=new q({color:1382685,roughness:.34,metalness:.38}),j=a1(),ee=new At({map:j,transparent:!0,side:gt}),ae=new q({color:5050642,roughness:.48,metalness:.12}),se=(B,Z)=>new q({color:B,roughness:.16,metalness:.02,emissive:Z,emissiveIntensity:.2}),De=(B,Z,he,pe,ge,Ae)=>{const ve=new at,Fe=new V(new Le(1.15,2.85,.75),X);ve.add(Fe);const Ke=se(16724008,16717836),dt=se(16767053,16757276),Mt=se(4521842,1693789),St=[Ke,dt,Mt];for(let mt=0;mt<3;mt++){const He=new V(new Gt(.28,12,8),St[mt]);He.position.set(0,.78-mt*.78,-.42),ve.add(He)}ve.position.set(he,pe,ge),ve.rotation.y=Ae,B.add(ve),F.push({axis:Z,red:Ke,yellow:dt,green:Mt,control:B.userData.control})},w=(B,Z,he)=>{const pe=me(B,Z),ge={type:"signal",x:B,z:Z,phase:he%4*2.1};We.set(pe,ge);const Ae=Xe(B,Z),ve=new at;ve.userData.control=ge;const Fe=o*.72,Ke=o*.72,dt=new V(new ut(.18,.24,8.2,8),N);dt.position.set(Fe,4.1,Ke),ve.add(dt);const Mt=new V(new Le(o*1.65,.2,.2),N);Mt.position.set(Fe-o*.72,8,Ke),ve.add(Mt);const St=new V(new Le(.2,.2,o*1.65),N);St.position.set(Fe,7.55,Ke-o*.72),ve.add(St),De(ve,"ns",Fe-o*1.24,7.52,Ke,0),De(ve,"ns",Fe-o*.18,7.52,-Ke,Math.PI),De(ve,"ew",Fe,7.05,Ke-o*1.24,Math.PI/2),De(ve,"ew",-Fe,7.05,Ke-o*.18,-Math.PI/2),ve.position.set(B,Ae,Z),ve.traverse(mt=>{mt.castShadow=!0,mt.receiveShadow=!0}),i.add(ve)},O=(B,Z,he)=>{const pe=me(B,Z);We.set(pe,{type:"stop",x:B,z:Z,phase:0});const ge=Xe(B,Z),Ae=new at,ve=he%2?-1:1,Fe=he%3?1:-1,Ke=new V(new ut(.12,.16,4.2,7),N);Ke.position.y=2.1,Ae.add(Ke);const dt=new V(new tn(1.04,8),ae);dt.position.y=4.55,dt.rotation.y=Math.PI,Ae.add(dt);const Mt=new V(new Bt(2.05,2.05),ee);Mt.position.set(0,4.55,-.04),Ae.add(Mt),Ae.position.set(B+ve*o*.74,ge,Z+Fe*o*.74),Ae.rotation.y=Math.atan2(ve,Fe),Ae.traverse(St=>{St.castShadow=!0,St.receiveShadow=!0}),i.add(Ae)};let G=0,Y=0;for(let B=1;B<l.length-1;B++)for(let Z=1;Z<d.length-1;Z++){const he=l[B],pe=d[Z];if(Cn(he,pe,o*.9).clearance<2)continue;const ge=Math.abs(he-80)<=a*1.05&&pe<=s&&pe>=-560,Ae=pe<-260&&pe>-1180&&(B+Z)%4===0,ve=pe>-360&&(B+Z)%2===0;ge&&Z%2===0||Ae?w(he,pe,G++):(ve||(B+Z)%5===0&&pe>-820)&&O(he,pe,Y++)}return Un(i,B=>{for(const Z of F){const he=we(Z.control,B);Z.red.emissiveIntensity=he.green===Z.axis||he.yellow===Z.axis?.12:2.3,Z.yellow.emissiveIntensity=he.yellow===Z.axis?2.6:.12,Z.green.emissiveIntensity=he.green===Z.axis?2.6:.1}}),{trafficLights:G,stopSigns:Y}}const Qe=nt();p1(i,u,{X0:t,X1:n,ZN:s,ZF:r,pitch:a,streetW:o,trafficControls:We}),qe.trafficLights=Qe.trafficLights,qe.stopSigns=Qe.stopSigns;const Oe=new ut(.12,.16,7.2,7),rt=new Gt(.46,10,8),k=new Bt(2.8,13),Pe=new q({color:1581353,roughness:.42,metalness:.68}),Te=new q({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),Ee=new At({color:16760163,transparent:!0,opacity:.16,depthWrite:!1,side:gt,blending:Ti}),xe=132,le=new rn(Oe,Pe,xe),ke=new rn(rt,Te,xe),st=new rn(k,Ee,xe);let yt=0;for(let F=0;F<xe*2&&yt<xe;F++){const N=Math.random()<.5,X=N?t+Math.round(Math.random()*((n-t)/a))*a+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(n-t),j=N?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(Cn(X,j,3).clearance<2)continue;const ee=Xe(X,j);e.quaternion.identity(),e.position.set(X,ee+3.6,j),e.scale.set(1,1,1),e.updateMatrix(),le.setMatrixAt(yt,e.matrix),e.position.set(X,ee+7.5,j),e.updateMatrix(),ke.setMatrixAt(yt,e.matrix),e.position.set(X,ee+.72,j),e.quaternion.setFromAxisAngle(new P(1,0,0),-Math.PI/2),e.rotateZ(N?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),st.setMatrixAt(yt,e.matrix),yt++}le.count=yt,ke.count=yt,st.count=yt,le.instanceMatrix.needsUpdate=!0,ke.instanceMatrix.needsUpdate=!0,st.instanceMatrix.needsUpdate=!0,i.add(le,ke,st),qe.streetLights=yt,i.add(new V(m([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),_)),i.add(new V(m([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),_)),i.add(new V(m([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),x)),i.add(new V(m([{x0:80,z0:345,x1:80,z1:-720}],.78,.83),g));const Ut=new q({color:16768876,roughness:.34,metalness:.05,emissive:8013824,emissiveIntensity:.24});for(let F=330;F>=-700;F-=32){const N=new V(new Le(1.15,.09,13.5),Ut);N.position.set(80,Xe(80,F)+.9,F),N.receiveShadow=!0,i.add(N)}for(const F of[286,156,26,-104])for(let N=0;N<7;N++){const X=new V(new Le(2,.08,11.8),h),j=71.2+N*2.95;X.position.set(j,Xe(j,F)+.91,F),X.receiveShadow=!0,i.add(X),Si("roadDetails","openerCrosswalkStripes")}const Tn=new At({color:16765818,transparent:!0,opacity:.28,depthWrite:!1,side:gt,blending:Ti});function xn(F,N,X,j=!1){const ee=Xe(F,N),ae=new at,se=new V(new ut(.16,.22,9.5,8),Pe);se.position.y=4.75,ae.add(se);const De=new V(new Le(3.8,.22,.22),Pe);De.position.set(X*1.75,8.95,0),ae.add(De);const w=new V(new Gt(.62,12,8),Te);w.position.set(X*3.6,8.82,0),ae.add(w);const O=new V(new tn(4.6,20),Tn.clone());O.position.copy(w.position),O.rotation.x=-Math.PI/2,O.material.opacity=.18+Math.random()*.12,ae.add(O);const G=new V(new Bt(3.2,15),Ee.clone());if(G.position.set(X*2.8,.72,0),G.rotation.x=-Math.PI/2,G.scale.y=.7+Math.random()*.35,ae.add(G),j){const Y=new zc(16762474,3,52,2.2);Y.position.copy(w.position),ae.add(Y)}ae.position.set(F,ee,N),i.add(ae),qe.streetLights++}let br=0;for(let F=340;F>=-700;F-=118)xn(63,F,1,br++%4===0),xn(97,F-42,-1,br++%4===0);function ei(F,N,X,j,ee=6010942){const ae=new q({color:ee,roughness:.92,metalness:.01}),se=new V(new Le(X,.08,j),ae);return se.position.set(F,Xe(F,N)+.06,N),se.receiveShadow=!0,i.add(se),qe.openerProps++,se}function Li(F,N,X=1){const j=Xe(F,N),ee=new at,ae=new V(new ut(.35,.55,5.5,8),new q({color:6832160,roughness:.88}));ae.position.y=2.75,ee.add(ae);const se=new q({color:7587902,roughness:.86}),De=new q({color:4167215,roughness:.9}),w=[[-1.7,5.9,0,2.7],[1.3,6.1,.2,2.9],[0,7.1,-.4,3],[.4,5.5,1.6,2.4],[-.6,5.7,-1.6,2.4]];for(let O=0;O<w.length;O++){const[G,Y,B,Z]=w[O],he=new V(new Gt(Z,12,8),O%2?De:se);he.position.set(G,Y,B),he.scale.y=.78,he.castShadow=!0,ee.add(he)}return ee.position.set(F,j,N),ee.scale.setScalar(X),i.add(ee),Ki.push({kind:"tree",x:F,z:N,radius:3.4*X,maxY:j+11*X}),qe.openerProps++,ee}function ti(F,N,X=15){const j=new q({color:10129021,roughness:.98,flatShading:!0,side:gt}),ee=new V(new ya(X,2),j),ae=ee.geometry.attributes.position;for(let se=0;se<ae.count;se++){const De=ae.getX(se),w=ae.getY(se),O=ae.getZ(se),G=.86+Math.sin(se*17.1)*.09+Math.cos(se*9.3)*.07;ae.setXYZ(se,De*(1.15+se%3*.06)*G,w*(.72+se%5*.035)*G,O*(.92+se%4*.05)*G)}return ae.needsUpdate=!0,ee.geometry.computeVertexNormals(),ee.position.set(F,Xe(F,N)+X*.46,N),ee.rotation.set(.34,-.72,.18),ee.castShadow=!0,ee.receiveShadow=!0,i.add(ee),Ki.push({kind:"rock",x:F,z:N,radius:X*.98,maxY:ee.position.y+X*.68}),qe.openerProps++,ee}function Bs(F,N,X=0){const j=new at,ee=new q({color:10970418,roughness:.64,metalness:.04}),ae=new q({color:1910317,roughness:.46,metalness:.5});for(const se of[1.05,1.55]){const De=new V(new Le(6.8,.22,.44),ee);De.position.y=se,j.add(De)}for(const se of[-2.7,2.7]){const De=new V(new Le(.22,1.2,.35),ae);De.position.set(se,.62,0),j.add(De)}j.position.set(F,Xe(F,N),N),j.rotation.y=X,i.add(j),qe.openerProps++}function wr(F,N){const X=new q({color:14164770,roughness:.34,metalness:.18,emissive:4850949,emissiveIntensity:.18}),j=new at,ee=new V(new ut(.34,.42,1.25,12),X);ee.position.y=.65,j.add(ee);const ae=new V(new Gt(.42,12,8),X);ae.position.y=1.32,j.add(ae);const se=new V(new ut(.16,.16,1.1,10),X);se.rotation.z=Math.PI/2,se.position.y=.9,j.add(se),j.position.set(F,Xe(F,N),N),i.add(j),qe.openerProps++}function Tr(F,N,X=0){const j=new at,ee=new q({color:1185821,roughness:.36,metalness:.68}),ae=new q({color:10283263,roughness:.08,metalness:.02,transparent:!0,opacity:.42,emissive:1194833,emissiveIntensity:.18}),se=new q({color:2370611,roughness:.42,metalness:.32}),De=new V(new Le(8.5,.35,3.2),se);De.position.y=4.2,j.add(De);for(const G of[-3.8,3.8]){const Y=new V(new ut(.09,.11,4.1,7),ee);Y.position.set(G,2.05,-1.25),j.add(Y)}const w=new V(new Le(8,2.8,.08),ae);w.position.set(0,2.2,1.35),j.add(w);const O=new V(new Bt(2.3,2.8),new At({map:ho("BUS","#4ff3ff"),transparent:!0,side:gt}));O.position.set(-2.4,2.2,1.42),j.add(O),j.position.set(F,Xe(F,N),N),j.rotation.y=X,i.add(j),Hi("bus-shelter-ad",F,Xe(F,N)+2.2,N),qe.openerProps++}function Zt(F,N,X,j,ee,ae,se,De=null,w=0){if(Vi(F,N,X,j,12))return!1;const O=Xe(F,N)-.45;if(Gi(F,N,X,j,O+ee+2))return!1;const G=F<80?1:-1,Y=new q({map:Ss(192,512,se),color:ae,roughness:.24,metalness:.36,emissive:2060177,emissiveIntensity:.5,envMapIntensity:1.4}),B=new V(new Le(X,ee,j),Y);B.position.set(F,O+ee/2,N),B.castShadow=!1,B.receiveShadow=!0,i.add(B);const Z=new q({map:Ss(220,620,Math.min(.86,se+.18)),color:10481407,roughness:.12,metalness:.28,emissive:1740466,emissiveIntensity:.32,envMapIntensity:1.55,transparent:!0,opacity:.96,side:gt}),he=new V(new Bt(j*.78,ee*.74),Z);he.position.set(F+G*(X/2+.09),O+ee*.54,N),he.rotation.y=G>0?Math.PI/2:-Math.PI/2,i.add(he);for(const Ae of[-1,1]){const ve=new V(new Bt(X*.82,ee*.72),Z.clone());ve.position.set(F,O+ee*.55,N+Ae*(j/2+.1)),ve.rotation.y=Ae>0?0:Math.PI,i.add(ve)}const pe=new V(new Le(X*1.04,1.2,j*1.04),new q({color:1778733,roughness:.34,metalness:.38}));pe.position.set(F,O+ee+.7,N),i.add(pe);const ge=new q({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const Ae of[-1,1]){const ve=new V(new Le(X*1.1,.22,.18),ge);ve.position.set(F,O+ee+1.4,N+Ae*(j/2+.18)),i.add(ve)}if(De&&w){const Ae=new At({map:lh(De,De==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:gt,depthWrite:!1}),ve=new V(new Bt(7.5,24),Ae);ve.position.set(F+w*(X/2+.3),O+Math.min(ee-8,ee*.58),N),ve.rotation.y=w>0?Math.PI/2:-Math.PI/2,i.add(ve),Hi("showcase-neon",ve.position.x,ve.position.y,ve.position.z)}return _n.push({x:F,z:N,hw:X*.5,hd:j*.5,maxY:O+ee+2}),It("showcase","glassTower"),!0}function Er(F,N,X,j=3.2){const ee=F*.5+j,ae=N*.5+j,se=Math.max(2,Math.abs(ee-ae)*.72),w=F>=N?[-ee,0,-ae,ee,0,-ae,se,X,0,-ee,0,-ae,se,X,0,-se,X,0,ee,0,-ae,ee,0,ae,se,X,0,ee,0,ae,-ee,0,ae,-se,X,0,ee,0,ae,se,X,0,-se,X,0,-ee,0,ae,-ee,0,-ae,-se,X,0]:[-ee,0,-ae,ee,0,-ae,0,X,-se,ee,0,-ae,ee,0,ae,0,X,se,ee,0,-ae,0,X,se,0,X,-se,ee,0,ae,-ee,0,ae,0,X,se,-ee,0,ae,-ee,0,-ae,0,X,-se,-ee,0,ae,0,X,-se,0,X,se],O=new Xt;return O.setAttribute("position",new wt(w,3)),O.computeVertexNormals(),O}function Di(F,N,X,j,ee,ae,se={}){if(Vi(F,N,X,j,12))return!1;const De=Xe(F,N)-.3;if(Gi(F,N,X,j,De+ee+(se.roofH??8.2)+1,6))return!1;const w=se.frontZ??-1,O=new q({map:z,color:se.wallColor??14734788,roughness:.68,metalness:.03}),G=new V(new Le(X,ee,j),O);G.position.set(F,De+ee/2,N),G.castShadow=!0,G.receiveShadow=!0,i.add(G);const Y=new q({map:ft,color:ae,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),B=se.roofH??8.2,Z=new V(Er(X,j,B),Y);Z.position.set(F,De+ee,N),Z.castShadow=!0,Z.receiveShadow=!0,i.add(Z);const he=new q({color:15985112,roughness:.42,metalness:.05}),pe=new V(new Le(X+7,.42,1.2),he);pe.position.set(F,De+ee+.12,N+w*(j*.5+1.4)),i.add(pe);const ge=pe.clone();ge.position.z=N-w*(j*.5+1.4),i.add(ge);const Ae=Math.min(18,X*.38),ve=new V(new Le(Ae,ee*.55,.32),new q({map:ht,roughness:.34,metalness:.2}));ve.position.set(F+X*.18,De+ee*.33,N+w*(j*.5+.22)),i.add(ve);const Fe=new V(new Le(5.2,7.2,.28),new q({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));Fe.position.set(F-X*.25,De+3.7,N+w*(j/2+.24)),i.add(Fe);const Ke=new q({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),dt=new q({color:3353638,roughness:.38});for(const zt of[-X*.36,-X*.05,X*.38]){if(Math.abs(zt-X*.18)<Ae*.45)continue;const Mn=new V(new Le(6.2,4.8,.26),dt);Mn.position.set(F+zt,De+ee*.58,N+w*(j*.5+.28)),i.add(Mn);const Yt=new V(new Le(4.8,3.4,.3),Ke);Yt.position.copy(Mn.position),Yt.position.z+=w*.04,i.add(Yt)}const Mt=new q({color:12370619,roughness:.44,metalness:.04}),St=new V(new Le(Ae*1.18,.12,34),Mt);St.position.set(F+X*.18,Xe(F+X*.18,N+w*(j*.5+17))+.11,N+w*(j*.5+17)),i.add(St);const mt=new q({color:5679925,roughness:.86,metalness:.01}),He=new V(new Le(X+10,.08,j+12),mt);He.position.set(F,Xe(F,N)-.18,N),He.receiveShadow=!0,i.add(He),He.renderOrder=-1;const Lt=new q({color:3042609,roughness:.84}),ct=[new q({color:16766544,roughness:.58}),new q({color:16738974,roughness:.58}),new q({color:16314584,roughness:.58})];for(let zt=0;zt<9;zt++){const Mn=F-X*.44+zt*(X*.11),Yt=N+w*(j*.5+2.2+zt%2*1.5),Wn=new V(new Gt(1.35+zt%3*.22,10,7),zt%4===0?ct[zt%ct.length]:Lt);Wn.position.set(Mn,Xe(Mn,Yt)+.95,Yt),Wn.scale.y=.72,Wn.castShadow=!0,i.add(Wn)}return _n.push({x:F,z:N,hw:X*.5,hd:j*.5,maxY:De+ee+5}),It("showcase","lowStorefront"),!0}return ei(45,318,36,84,6404169),ei(116,318,36,84,6074179),ei(44,188,34,84,6798662),ei(118,188,36,84,5941822),ei(43,60,34,82,5679164),ei(118,60,36,82,6864197),Zt(18,315,70,54,154,2311775,.72,"HOTEL",1),Zt(17,185,72,58,188,1522779,.78,null,0),Zt(31,55,44,56,138,2840688,.66,"OPEN",1),Zt(24,-75,52,64,182,1913933,.7,null,0),Zt(145,315,68,54,116,2776440,.72,null,0),Zt(146,185,70,58,146,2314602,.76,null,0),Zt(142,55,42,56,156,1590364,.68,"CAFE",-1),Zt(134,-75,48,64,114,3688540,.62,null,0),Zt(-70,315,52,52,146,2112085,.68,null,0),Zt(228,185,48,58,148,3235186,.66,null,0),Zt(-78,185,48,56,134,2181730,.68,null,0),Zt(236,315,44,54,104,3104884,.66,null,0),Di(-145,315,46,42,12,13126954,{wallColor:14274231,frontZ:1,roofH:6.4}),Di(228,315,52,42,13,13390888,{wallColor:14734010,frontZ:1,roofH:6.6}),Zt(-48,-360,54,56,148,2439765,.58,null,0),Zt(172,-430,50,56,132,3817032,.66,"OPEN",-1),ti(112,238,12.5),Li(50,292,1.2),Li(111,316,.95),Li(48,132,.9),Li(116,102,1.05),Bs(47,248,Math.PI/2),wr(57,226),Tr(111,260,-Math.PI/2),tt.add(i),i}function Sd(i,{dirSel:e=1,rampType:t="on",merge:n=16,runBack:s=165,runOut:r=52,label:a="ON RAMP"}={}){const o=bt(n),c=new P(o.tangent.x,0,o.tangent.z).normalize(),l=new P().crossVectors(an,c).normalize(),d=o.p.clone().addScaledVector(o.side,e*oe.width*.5),u=t==="off"?1:-1,p=d.x+c.x*s*u+l.x*e*r,m=d.z+c.z*s*u+l.z*e*r,g=new P(p,Xe(p,m)+.4,m),_=t==="off"?d:g,x=t==="off"?g:d,h=26,M=[];for(let W=0;W<=h;W++){const Q=W/h,ie=Q*Q*(3-2*Q),de=t==="off"?1-(1-Q)*(1-Q):ie;M.push(new P(Be.lerp(_.x,x.x,Q),Be.lerp(_.y,x.y,de),Be.lerp(_.z,x.z,Q)))}const v=7.4,y=new P,E=new P,T=[],R=[];for(let W=0;W<=h;W++)E.subVectors(M[Math.min(h,W+1)],M[Math.max(0,W-1)]),E.y=0,E.normalize(),y.crossVectors(an,E).normalize(),T.push(M[W].clone().addScaledVector(y,-v)),R.push(M[W].clone().addScaledVector(y,v));const C={kind:"ramp",rampType:t,halfW:v,dirSel:e,mergeS:n,exitS:n,points:M.map(W=>W.clone()),segments:[]};for(let W=0;W<h;W++){const Q=M[W],ie=M[W+1],de=ie.x-Q.x,fe=ie.z-Q.z,ze=Math.max(1e-4,de*de+fe*fe);C.segments.push({a:Q.clone(),b:ie.clone(),abx:de,abz:fe,lenSq:ze,u0:W/h,u1:(W+1)/h})}Sr.push(C);const b=[];for(let W=0;W<h;W++){const Q=T[W],ie=R[W],de=T[W+1],fe=R[W+1];b.push(Q.x,Q.y,Q.z,ie.x,ie.y,ie.z,fe.x,fe.y,fe.z),b.push(Q.x,Q.y,Q.z,fe.x,fe.y,fe.z,de.x,de.y,de.z)}const S=new Xt;S.setAttribute("position",new wt(b,3)),S.computeVertexNormals();const L=new q({color:t==="off"?5003356:4607826,roughness:.82,metalness:.04,emissive:t==="off"?463123:331023,emissiveIntensity:.22,side:gt});i.add(new V(S,L));const U=new q({color:12107972,roughness:.5,metalness:.4});for(let W=0;W<h;W++)mn(i,T[W].clone().setY(T[W].y+1),T[W+1].clone().setY(T[W+1].y+1),.16,U),mn(i,R[W].clone().setY(R[W].y+1),R[W+1].clone().setY(R[W+1].y+1),.16,U);const H=new q({color:7173241,roughness:.82});for(let W=3;W<h;W+=3){const Q=M[W],ie=Xe(Q.x,Q.z),de=Q.y-ie;if(de<3)continue;const fe=new V(new ut(.9,1.15,de,8),H);fe.position.set(Q.x,ie+de/2,Q.z),i.add(fe),Yn.push({x:Q.x,z:Q.z,hw:1.3,hd:1.3,maxY:Q.y-.9})}const te=new At({map:Wc(a),transparent:!0,side:gt}),ne=new V(new Bt(12,3),te);ne.position.copy(t==="off"?d:g).add(new P(0,t==="off"?6.2:5.5,0)),ne.rotation.y=Math.atan2(-c.x,-c.z)+(t==="off"?Math.PI:0),i.add(ne);for(const W of[-1,1]){const Q=new V(new ut(.2,.26,6,6),H),ie=t==="off"?d:g;Q.position.set(ie.x+l.x*W*5.4,ie.y+3,ie.z+l.z*W*5.4),i.add(Q)}}function x1(i,e=1){Sd(i,{dirSel:e,rampType:"on",merge:16,runBack:165,runOut:52,label:"ON RAMP"})}function g1(i,e=-1){Sd(i,{dirSel:e,rampType:"off",merge:220,runBack:190,runOut:62,label:"OFF RAMP"})}function v1(){const i=new at,e=[],t=new it(14170671),n=new it(15922680),s=new q({color:3883336,roughness:.6,metalness:.3}),r=new At({map:_1(),transparent:!0,side:gt}),a=new q({color:4926748,roughness:.9}),o=[new q({color:2055221,roughness:.92}),new q({color:3109954,roughness:.95}),new q({color:2583370,roughness:.9})],c=new q({color:7040883,roughness:.95,side:gt}),l=12,d=[],u=[];let p=0;for(let g=0;g<oe.length;g+=l){if(Ri(g+l*.5)){p++;continue}const _=bt(g),x=bt(g+l),h=_.p.clone().add(x.p).multiplyScalar(.5),{sideways:M,normal:v,q:y}=hi(_,x);for(const E of[-1,1]){const T=h.clone().addScaledVector(M,E*oe.width*.5).addScaledVector(v,.5);d.push(T),u.push(y),e.push(p%2===0?t:n)}if(p%16===8){const E=(p>>4)%2?1:-1,T=h.clone().addScaledVector(M,E*oe.width*.52).addScaledVector(v,.4),R=new at,C=new V(new Bt(4.4,2.6),r);C.position.y=3.4,C.rotation.y=Math.PI,R.add(C);const b=new ut(.12,.16,3.4,5);for(const S of[-1.5,1.5]){const L=new V(b,s);L.position.set(S,1.7,0),R.add(L)}R.position.copy(T),R.quaternion.copy(y),i.add(R)}p++}for(let g=0;g<oe.length;g+=16){const _=bt(g),x=1+(Math.random()<.5?1:0);for(let h=0;h<x;h++){const M=Math.random()<.5?-1:1,v=oe.width/2+12+Math.random()*78,y=_.p.x+_.side.x*v*M+(Math.random()-.5)*16,E=_.p.z+_.side.z*v*M+(Math.random()-.5)*16;if(Ea(y,E,18))continue;const T=Xe(y,E);if(Math.random()<.78){const R=.7+Math.random()*1.5,C=new at,b=2.4+Math.random()*4.2,S=new V(new ut(.26,.42,b,6),a);S.position.y=b/2,C.add(S);const L=2+Math.floor(Math.random()*3);for(let U=0;U<L;U++){const H=new V(new $i(2.4+Math.random()*1.6-U*.2,4.6+Math.random()*2.4,7),o[(h+U+g)%o.length]);H.position.y=b+U*1.4+1.5,H.rotation.y=Math.random()*Math.PI,C.add(H)}C.position.set(y,T+.6,E),C.scale.setScalar(R),i.add(C)}else{const R=1.4+Math.random()*3.6,C=new V(new Uc(R,0),c);C.position.set(y,T+R*.35,E),C.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),C.scale.set(1,.7+Math.random()*.4,1),i.add(C),Yn.push({kind:"rock",x:y,z:E,radius:R*1.18})}}}const m=["START","SECTOR 2","SECTOR 3"];for(let g=0;g<3;g++){const _=oe.length*g/3+6;if(Ri(_))continue;const x=bt(_),h=bt(_+l),M=x.p.clone().add(h.p).multiplyScalar(.5),{q:v}=hi(x,h),y=oe.width*.5+1.2,E=9,T=new at,R=new ut(.4,.55,E,7);for(const U of[-1,1]){const H=new V(R,s);H.position.set(U*y,E/2,0),T.add(H)}const C=y*2,b=new V(new Le(C,1.1,1.1),s);b.position.y=E,T.add(b);const S=new At({map:Wc(m[g]),transparent:!0,side:gt}),L=new V(new Bt(C*.82,3),S);L.position.set(0,E-2,0),L.rotation.y=Math.PI,T.add(L),T.position.copy(M),T.quaternion.copy(v),i.add(T)}if(d.length){const g=new ut(.18,.24,3,6);g.translate(0,1.5,0);const _=new Gt(.34,8,6);_.translate(0,3.2,0);const x=new q({color:10134440,roughness:.7,metalness:.2}),h=new q({roughness:.55}),M=new rn(g,x,d.length),v=new rn(_,h,d.length),y=new Wt;for(let E=0;E<d.length;E++)y.position.copy(d[E]),y.quaternion.copy(u[E]),y.updateMatrix(),M.setMatrixAt(E,y.matrix),v.setMatrixAt(E,y.matrix),v.setColorAt(E,e[E]);M.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),i.add(M),i.add(v)}return x1(i),g1(i),tt.add(i),i}function _1(){const i=document.createElement("canvas");i.width=256,i.height=160;const e=i.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,i.width,i.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let n=-1;n<4;n++){e.beginPath();const s=n*70;e.moveTo(s,16),e.lineTo(s+40,i.height/2),e.lineTo(s,i.height-16),e.lineTo(s+18,i.height-16),e.lineTo(s+58,i.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new Jt(i);return t.colorSpace=Rt,t}function Wc(i){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(i,e.width/2,e.height/2);const n=new Jt(e);return n.colorSpace=Rt,n}function M1(i,e){const t=document.createElement("canvas");t.width=128,t.height=64;const n=t.getContext("2d"),s="#"+i.toString(16).padStart(6,"0"),r="#"+e.toString(16).padStart(6,"0"),a=8;for(let c=0;c<a;c++)n.fillStyle=c%2?s:r,n.fillRect(c/a*t.width,0,t.width/a+1,t.height);const o=new Jt(t);return o.colorSpace=Rt,o}function S1(){const i=document.createElement("canvas");i.width=256,i.height=128;const e=i.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,i.width,i.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const r=Math.random()*i.width,a=Math.random()*i.height;e.fillRect(r,a,2.4,2.4)}const n=new Jt(i);return n.colorSpace=Rt,n.wrapS=dn,n.repeat.set(3,1),n}function Ot(i,e,t,n,s){const r=new V(new Le(e.x,e.y,e.z),s);return r.position.copy(t),r.quaternion.copy(n),r.castShadow=!1,r.receiveShadow=!0,i.add(r),r}function hi(i,e){const t=e.p.clone().sub(i.p).normalize(),n=ud.crossVectors(an,t).normalize();let s=t.clone().cross(n).normalize();const r=(i.bank+e.bank)*.5;if(Math.abs(r)>.001){const c=new pi().setFromAxisAngle(t,r);n.applyQuaternion(c),s.applyQuaternion(c)}const a=new Dt().makeBasis(n,s,t),o=new pi().setFromRotationMatrix(a);return{tangent:t,sideways:n,normal:s,q:o}}function dh(i,e,t,n){const r=[],a=[],o=[],c=oe.width*.47;let l=0;for(let p=e;p<=t;p+=8){const m=bt(Math.min(p,t)),g=hi(m,bt(m.s+2)),_=Math.sin(p*.018)*.04,x=m.p.clone().addScaledVector(g.sideways,-c).addScaledVector(g.normal,.46+_),h=m.p.clone().addScaledVector(g.sideways,c).addScaledVector(g.normal,.46-_);r.push(x.x,x.y,x.z,h.x,h.y,h.z);const M=(p-e)/64;if(a.push(0,M,1,M),l>0){const v=(l-1)*2,y=l*2;o.push(v,v+1,y,v+1,y+1,y)}l++}const d=new Xt;d.setAttribute("position",new wt(r,3)),d.setAttribute("uv",new wt(a,2)),d.setIndex(o),d.computeVertexNormals();const u=new V(d,n);u.receiveShadow=!0,i.add(u)}function y1(i,e){let t=0;for(const n of oe.gaps)dh(i,t,Math.max(t,n.start-4),e),t=n.end+4;dh(i,t,oe.length,e)}function b1(i,e,t){const n=bt(e.s+2),{normal:s,q:r}=hi(e,n),a=new at;a.position.copy(e.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new V(new Le(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const c=new V(new Le(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,a.add(c);const l=new V(new Le(.42,.1,3.8),t);l.position.set(0,.01,-1.9),a.add(l),i.add(a)}function w1(){const i=new at;tt.add(i),uc=0;const e=new q({color:12171149,roughness:.72,metalness:.08}),t=new q({color:9869942,roughness:.78,metalness:.05}),n=new q({color:15255629,roughness:.28,metalness:.72}),s=new q({color:8204328,roughness:.3,metalness:.85}),r=new q({color:6120040,roughness:.5,metalness:.6}),a=new q({color:5595238,roughness:.62,metalness:.38,emissive:462868,emissiveIntensity:.18}),o=new q({color:14270570,roughness:.35,metalness:.65}),c=new q({color:2435884,roughness:.48,metalness:.62}),l=new q({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new q({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new q({color:4935486,roughness:.92,metalness:.04}),p=new q({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),m=new q({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),g=new q({color:4739414,roughness:.72,metalness:.32,emissive:330509,emissiveIntensity:.12}),_=new q({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),x=new q({color:15919561,roughness:.82,metalness:.02});new q({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const h=new q({map:Qg(),roughness:.74,metalness:.08}),M=new At({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),v=12;y1(i,h);function y(E,T=!1){if(Ri(E))return!1;const R=bt(E),C=bt(E+3),{sideways:b,normal:S,q:L}=hi(R,C),U=R.p,H=Xe(U.x,U.z),te=U.y-.95;if(te-H<10)return!1;const ne=oe.width*(T?.43:.35),W=te,Q=H+.25,ie=T?.56:.42,de=T?2.4:1.75,fe=T?.52:.36,ze=[],I=[];for(const _e of[-1,1]){const be=U.clone().addScaledVector(b,_e*ne).addScaledVector(S,-.85);be.y=W;const Re=new P(be.x,Q,be.z);mn(i,Re,be,ie,r);const Ye=new V(new ut(de,de*1.12,fe,12),r);Ye.position.set(Re.x,H+fe*.5,Re.z),Ye.receiveShadow=!0,i.add(Ye),ze.push(be),I.push(Re),Yn.push({x:Re.x,z:Re.z,hw:de*.92,hd:de*.92,maxY:W-.7})}const ye=U.clone().addScaledVector(S,-1.05);ye.y=W,Ot(i,new P(oe.width*.92,T?.58:.42,T?1.55:1.15),ye,L,a);const Me=I[0].clone();Me.y+=(W-Q)*.28;const Se=I[1].clone();Se.y+=(W-Q)*.28;const $=ze[0].clone();$.y-=1;const K=ze[1].clone();if(K.y-=1,mn(i,Me,K,T?.16:.1,c),mn(i,Se,$,T?.16:.1,c),T){const _e=I[0].clone();_e.y+=(W-Q)*.58;const be=I[1].clone();be.y+=(W-Q)*.58,mn(i,I[0].clone().setY(Q+1.2),be,.13,c),mn(i,I[1].clone().setY(Q+1.2),_e,.13,c),mn(i,_e,K,.13,c),mn(i,be,$,.13,c)}return uc++,!0}for(let E=0;E<oe.length;E+=v){if(Ri(E+v*.5))continue;const T=bt(E),R=bt(E+v),C=T.p.clone().add(R.p).multiplyScalar(.5),{sideways:b,normal:S,q:L}=hi(T,R),U=T.p.distanceTo(R.p)+.45,H=Math.floor(E/(v*2))%2?e:t;Ot(i,new P(oe.width,.62,U),C.clone().addScaledVector(S,-.05),L,H),Ot(i,new P(oe.width-2.8,.08,U*.86),C.clone().addScaledVector(S,.36),L,u),Ot(i,new P(.2,.1,U*.76),C.clone().addScaledVector(b,-oe.width*.19).addScaledVector(S,.43),L,u),Ot(i,new P(.2,.1,U*.76),C.clone().addScaledVector(b,oe.width*.19).addScaledVector(S,.43),L,u),E%48===0&&(Ot(i,new P(.14,.08,U*.62),C.clone().addScaledVector(b,-oe.width*.08).addScaledVector(S,.51),L,_),Ot(i,new P(.14,.08,U*.62),C.clone().addScaledVector(b,oe.width*.08).addScaledVector(S,.51),L,_)),E%120===0&&Ot(i,new P(oe.width*.42,.07,.72),C.clone().addScaledVector(S,.55),L,x),Ot(i,new P(oe.width+1.2,.35,U*.94),C.clone().addScaledVector(S,-.56),L,a),Ot(i,new P(.42,.42,U*.9),C.clone().addScaledVector(b,-oe.width*.36).addScaledVector(S,-.78),L,g),Ot(i,new P(.42,.42,U*.9),C.clone().addScaledVector(b,oe.width*.36).addScaledVector(S,-.78),L,g);const te=C.clone().addScaledVector(b,-oe.width*.51),ne=C.clone().addScaledVector(b,oe.width*.51);if(Ot(i,new P(.32,.46,U),te.clone().addScaledVector(S,.28),L,n),Ot(i,new P(.32,.46,U),ne.clone().addScaledVector(S,.28),L,n),Ot(i,new P(.26,.72,U*.94),te.clone().addScaledVector(S,-.22),L,a),Ot(i,new P(.26,.72,U*.94),ne.clone().addScaledVector(S,-.22),L,a),E%36===0)for(const W of[-oe.width*.39,-oe.width*.2,oe.width*.2,oe.width*.39]){const Q=new V(new ut(.16,.2,.12,10),o);Q.position.copy(C).addScaledVector(b,W).addScaledVector(S,.46),Q.quaternion.copy(L),Q.castShadow=!1,i.add(Q)}if(E%72===0&&(Ot(i,new P(.34,1.56,3.4),C.clone().addScaledVector(b,-oe.width*.66).addScaledVector(S,1.16),L,s),Ot(i,new P(.34,1.56,3.4),C.clone().addScaledVector(b,oe.width*.66).addScaledVector(S,1.16),L,s),Ot(i,new P(.18,.18,4.4),C.clone().addScaledVector(b,-oe.width*.62).addScaledVector(S,1.94),L,s),Ot(i,new P(.18,.18,4.4),C.clone().addScaledVector(b,oe.width*.62).addScaledVector(S,1.94),L,s),Ot(i,new P(.12,.12,4),C.clone().addScaledVector(b,-oe.width*.62).addScaledVector(S,1.38),L,n),Ot(i,new P(.12,.12,4),C.clone().addScaledVector(b,oe.width*.62).addScaledVector(S,1.38),L,n),mn(i,C.clone().addScaledVector(b,-oe.width*.58).addScaledVector(S,-1.08),C.clone().addScaledVector(b,oe.width*.58).addScaledVector(S,-1.08),.11,c),mn(i,C.clone().addScaledVector(b,-oe.width*.48).addScaledVector(S,-1),C.clone().addScaledVector(b,0).addScaledVector(S,-2.2),.09,c),mn(i,C.clone().addScaledVector(b,oe.width*.48).addScaledVector(S,-1),C.clone().addScaledVector(b,0).addScaledVector(S,-2.2),.09,c)),E%96===0){const W=new V(new tn(1,28),M);W.rotation.x=-Math.PI/2,W.position.set(C.x,-4.72,C.z),W.scale.set(oe.width*.9,Math.max(10,U*2.2),1),W.rotation.z=Math.atan2(hi(T,R).tangent.x,hi(T,R).tangent.z),i.add(W)}if(E%144===0){const W=C.clone().addScaledVector(b,-oe.width*.74).addScaledVector(S,2),Q=C.clone().addScaledVector(b,oe.width*.74).addScaledVector(S,2);mn(i,W.clone().addScaledVector(S,-1.2),W.clone().addScaledVector(S,1.1),.12,s),mn(i,Q.clone().addScaledVector(S,-1.2),Q.clone().addScaledVector(S,1.1),.12,s),Ot(i,new P(.46,.72,.46),W.clone().addScaledVector(S,1.15),L,l),Ot(i,new P(.46,.72,.46),Q.clone().addScaledVector(S,1.15),L,l)}if(E%288===0){const W=C.clone().addScaledVector(b,(Math.floor(E/144)%2?1:-1)*oe.width*.92).addScaledVector(S,5.2);Ot(i,new P(.44,.44,.44),W.clone(),L,p),mn(i,W.clone().addScaledVector(S,-.2),C.clone().addScaledVector(S,1),.05,c)}E%48===0&&y(E+v*.5,!1),E%168===0&&!Ri(E+16)&&b1(i,bt(E+5),d)}for(const E of oe.gaps){const T=bt(E.start-3),R=bt(E.end+3);for(const C of[T,R]){const b=bt(C.s+2),{normal:S,q:L}=hi(C,b);Ot(i,new P(oe.width-1.2,.08,4.6),C.p.clone().addScaledVector(S,.54),L,l),Ot(i,new P(oe.width*.62,.09,1.3),C.p.clone().addScaledVector(S,.62).addScaledVector(C.tangent,C===T?-6.3:6.3),L,x);for(const U of[-oe.width*.42,0,oe.width*.42]){const H=C.p.clone().addScaledVector(C.side,U).addScaledVector(S,2.35);Ot(i,new P(.46,.46,.46),H,L,U===0?m:l)}y(C.s+(C===T?-9:9),!0),y(C.s+(C===T?-24:24),!0)}}return i}function yd(i=13710372,e=7740696){const t=new at,n=new q({color:i,roughness:.19,metalness:.68,envMapIntensity:1.25}),s=new q({color:e,roughness:.28,metalness:.58,envMapIntensity:1}),r=new q({color:329225,roughness:.52,metalness:.12}),a=new q({color:1053463,roughness:.38,metalness:.34}),o=new q({color:12569555,roughness:.16,metalness:.82,envMapIntensity:1.15}),c=new q({color:5397346,roughness:.22,metalness:.78,envMapIntensity:1.1}),l=new q({color:5425663,roughness:.04,metalness:.02,transparent:!0,opacity:.43,emissive:536402,emissiveIntensity:.18,envMapIntensity:1.6}),d=new q({color:16722713,roughness:.13,metalness:.04,emissive:16717836,emissiveIntensity:1.25}),u=new q({color:16757562,roughness:.18,metalness:.04,emissive:16747032,emissiveIntensity:.88}),p=new q({color:16773285,roughness:.18,metalness:.08,emissive:16765019,emissiveIntensity:.95}),m=new q({color:2237480,roughness:.26,metalness:.78,envMapIntensity:1.2}),g=new q({color:329225,roughness:.44,metalness:.22}),_=new V(new tn(3.65,36),new At({color:0,transparent:!0,opacity:.22,depthWrite:!1}));_.rotation.x=-Math.PI/2,_.position.y=.08,_.scale.z=1.58,t.add(_);const x=(y,E,T,R,C=null,b=null)=>{const S=new V(E,T);return S.name=y,S.position.copy(R),C&&S.rotation.set(C.x||0,C.y||0,C.z||0),b&&S.scale.copy(b),t.add(S),S},h=(y,E,T,R,C,b,S=0,L=0,U=0)=>x(y,new Le(E.x,E.y,E.z),T,new P(R,C,b),new P(S,L,U));h("low black undertray",new P(5.25,.28,8.45),r,0,.45,-.08),h("wide wedge body tub",new P(4.85,.86,6.65),n,0,.98,.28,-.035),h("sloped front wedge nose",new P(3.7,.64,3.35),n,0,.83,-3.75,-.145),h("front black splitter",new P(5.25,.13,.78),r,0,.35,-5.6),h("left sculpted rocker panel",new P(.46,.5,5.85),s,-2.63,.82,.08,0,0,-.04),h("right sculpted rocker panel",new P(.46,.5,5.85),s,2.63,.82,.08,0,0,.04),h("left rear haunch",new P(.72,.74,2.55),n,-2.53,1.18,2.08,-.04),h("right rear haunch",new P(.72,.74,2.55),n,2.53,1.18,2.08,-.04),h("left front fender flare",new P(.46,.54,1.38),n,-2.55,.98,-2.78,-.04),h("right front fender flare",new P(.46,.54,1.38),n,2.55,.98,-2.78,-.04),h("black rear fascia",new P(4.72,.66,.2),a,0,1.02,4.04),h("deep rear bumper",new P(5.32,.38,.48),c,0,.58,4.23),h("front windshield",new P(2.8,.13,1.15),l,0,1.78,-1.25,-.48),h("roof glass",new P(2.34,.18,1.55),l,0,2.08,-.2,-.13),h("left side window",new P(.12,.78,1.9),l,-1.28,1.76,-.15,-.08,.04),h("right side window",new P(.12,.78,1.9),l,1.28,1.76,-.15,-.08,-.04),h("black a pillar left",new P(.12,.86,.14),g,-1.46,1.75,-1.22,-.48),h("black a pillar right",new P(.12,.86,.14),g,1.46,1.75,-1.22,-.48),h("rear deck panel",new P(3.5,.18,2.18),n,0,1.7,2,-.2);for(let y=0;y<7;y++)h("black rear deck louver",new P(3.35,.12,.18),a,0,1.83+y*.015,1.1+y*.28,-.21);h("raised rear spoiler blade",new P(5.55,.18,.86),s,0,1.82,3.82,-.06);for(const y of[-2.28,2.28])h("spoiler side endplate",new P(.24,.78,1.04),s,y,1.43,3.72,0,0,y<0?-.08:.08);for(const y of[-1.78,1.78])h("thin hood crease",new P(.08,.04,2.55),g,y*.36,1.27,-3.45,-.15),h("door seam",new P(.035,.68,1.75),g,y,1.16,-.2),h("side intake",new P(.09,.34,.9),a,Math.sign(y)*2.68,.86,1.42);for(const y of[-1.04,1.04])h("pop up headlight glass",new P(.62,.12,.18),p,y,1.02,-5.28,-.16);h("tail light backplate",new P(3.86,.46,.08),g,0,1.08,4.18);for(const y of[-1.42,-.62,.62,1.42])h("rectangular glowing tail lamp",new P(.54,.28,.1),Math.abs(y)>1?d:u,y,1.08,4.24);h("slim chrome beltline left",new P(.06,.08,4.75),o,-2.72,1.42,-.2),h("slim chrome beltline right",new P(.06,.08,4.75),o,2.72,1.42,-.2),h("left black roof rail",new P(.12,.12,2.72),g,-1.34,2.15,-.42,-.13),h("right black roof rail",new P(.12,.12,2.72),g,1.34,2.15,-.42,-.13);for(const y of[-2.86,2.86])h("angular side mirror arm",new P(.42,.08,.08),g,y,1.62,-1.55,0,0,y<0?-.14:.14),h("blue tinted side mirror",new P(.12,.34,.46),l,y*1.03,1.62,-1.65,0,y<0?.24:-.24),h("flush door handle",new P(.08,.11,.46),o,y*.94,1.28,.52);for(const y of[-2.65,2.42])h("left wheel arch shadow",new P(.08,.9,1.75),g,-2.82,.78,y),h("right wheel arch shadow",new P(.08,.9,1.75),g,2.82,.78,y);h("black license recess",new P(.9,.24,.08),a,0,.76,4.31);const M=[],v=(y,E,T=!1)=>{const R=new at;R.name=T?"steering front wheel assembly":"rear wheel assembly",R.position.set(y,.54,E);const C=new V(new ut(.88,.88,.62,28),r);C.name="wide performance tire",C.rotation.z=Math.PI/2,R.add(C);const b=new V(new Ls(.88,.06,10,32),r);b.name="rounded tire sidewall",b.rotation.y=Math.PI/2,R.add(b);const S=new V(new ut(.42,.42,.66,24),o);S.name="chrome wheel rim",S.rotation.z=Math.PI/2,R.add(S);const L=new V(new ut(.56,.56,.08,24),m);L.name="visible brake disc",L.rotation.z=Math.PI/2,L.position.x=y>0?-.05:.05,R.add(L);for(let te=0;te<8;te++){const ne=new V(new Le(.08,.055,.62),o);ne.name="thin wheel spoke",ne.rotation.x=te/8*Math.PI*2,ne.position.set(y>0?.035:-.035,0,.22),R.add(ne)}const U=new V(new Le(.1,.22,.18),u);U.name="small brake caliper",U.position.set(y>0?-.39:.39,.18,-.38),R.add(U);const H=new V(new ut(.17,.17,.72,18),c);H.name="dark center cap",H.rotation.z=Math.PI/2,R.add(H),t.add(R),T&&M.push(R)};for(const y of[-2.4,2.4])v(y,-2.65,!0),v(y,2.42,!1);t.userData.frontWheels=M,t.userData.detailReport={louvers:7,tailLamps:4,wheelSpokes:32,sideWindows:2,spoiler:!0};for(const y of[-.92,-.52,.52,.92]){const E=new V(new ut(.13,.13,.55,14),o);E.name="quad square exhaust outlet",E.rotation.x=Math.PI/2,E.position.set(y,.43,4.52),t.add(E)}return t.traverse(y=>{y.castShadow=!0,y.receiveShadow=!0}),tt.add(t),t}function T1(){const i=new at,e=new q({color:9383205,roughness:.35,metalness:.55}),t=new q({color:460551,roughness:.55}),n=new q({color:12375772,roughness:.18,metalness:.9}),s=new q({color:16767297,roughness:.38,metalness:.25}),r=new q({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new q({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.16}),o=new q({color:1118995,roughness:.7,metalness:.05}),c=new V(new Le(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),i.add(c);const l=new V(new Le(.16,.028,1.92),n);l.position.set(0,-.64,-2.28),i.add(l);const d=new V(new Le(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,i.add(d);const u=new V(new Bt(2.8,.82,1,1),a);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,i.add(u);const p=new V(new Ls(.36,.035,12,48),o);p.position.set(0,-.46,-1.02),p.rotation.x=Math.PI/2.75,i.add(p);for(let m=0;m<3;m++){const g=new V(new Le(.34,.025,.035),n);g.position.copy(p.position),g.rotation.copy(p.rotation),g.rotation.z+=m/3*Math.PI*2,i.add(g)}for(let m=0;m<6;m++){const g=new V(new ut(.16,.16,.56,18),n);g.rotation.z=Math.PI/2,g.position.set(-.78+m*.31,-.42+Math.sin(m)*.03,-2.12),i.add(g)}for(const m of[-1.08,1.08]){const g=new V(new ut(.34,.34,.25,18),t);g.rotation.z=Math.PI/2,g.position.set(m,-.68,-1.58),i.add(g);const _=new V(new Ls(.22,.035,8,28),s);_.scale.set(.72,1.25,.72),_.position.set(m*.8,-.48,-1.74),_.rotation.x=Math.PI/2,i.add(_)}for(const m of[-1.14,-.84,.84,1.14]){const g=new V(new ut(.035,.04,.028,8),n);g.position.set(m,-.39,-1.28),g.rotation.x=Math.PI/2,i.add(g)}for(const m of[-.52,.52]){const g=new V(new Gt(.045,12,8),r);g.position.set(m,-.34,-1.22),i.add(g)}i.position.set(0,0,0),Je.add(i),Hn=i}function E1(){const i=new q({color:16119285,roughness:.35,metalness:.25}),e=new q({color:1184274,roughness:.45}),t=new q({map:jg(),roughness:.42,metalness:.05}),n=new q({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=bt(0),r=new Dt().makeBasis(s.side,an,s.tangent),a=new pi().setFromRotationMatrix(r),o=new at;for(const d of[-oe.width*.58,oe.width*.58]){const u=new V(new Le(.8,11,.8),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(an,5.4),u.quaternion.copy(a),o.add(u)}const c=new V(new Le(oe.width+3,.8,1),t);c.position.copy(s.p).addScaledVector(an,11.2),c.quaternion.copy(a),o.add(c);const l=new V(new Le(oe.width+1.2,1.4,.18),e);l.position.copy(s.p).addScaledVector(an,12.5).addScaledVector(s.tangent,-.55),l.quaternion.copy(a),o.add(l);for(const d of[-oe.width*.38,0,oe.width*.38]){const u=new V(new Gt(.32,16,10),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(an,10.25),o.add(u)}return tt.add(o),o}const Ji=yd(),on=yd(3108784,1916782);on.visible=!1;l1();c1();qe.signs=0;xa.length=0;h1();d1();m1();let uh=null,fh=null,ph=null,Hn=null,po=null;const en=[];T1();function mo(i){i&&(i.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const n of t)n.map&&n.map.dispose(),n.dispose()}}),tt.remove(i))}function Xc(i){return ca=Be.clamp(i,0,es.length-1),oe=es[ca],Yn.length=0,Sr.length=0,mo(uh),mo(fh),mo(ph),uh=w1(),fh=E1(),ph=v1(),et.trackName.textContent=oe.name,et.courseName&&(et.courseName.textContent=oe.name),et.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===ca)}),oe.name}Xc(0);function A1(){po&&tt.remove(po),en.length=0;const i=new at,e=new q({color:5239807,roughness:.16,metalness:.08,emissive:1619711,emissiveIntensity:1.55}),t=new At({color:16769146,transparent:!0,opacity:.42,depthWrite:!1,side:gt,blending:Ti}),n=[{x:80,z:245,yaw:0,label:"CROSSWALK GATE"},{x:80,z:112,yaw:0,label:"NEON STRAIGHT"},{x:210,z:120,yaw:Math.PI/2,label:"MIDTOWN TURN"},{x:340,z:-10,yaw:0,label:"GARAGE ROW"},{x:210,z:-270,yaw:Math.PI/2,label:"SIGN SPRINT"},{x:80,z:-400,yaw:0,label:"RIBBON VIEW"},{x:-50,z:-270,yaw:Math.PI/2,label:"BRICK BLOCK"},{x:-50,z:-10,yaw:0,label:"CITY LOOP"}];for(let s=0;s<n.length;s++){const r=n[s],a=Xe(r.x,r.z)+4.2,o=new at,c=new V(new Ls(5.6,.22,12,52),e.clone());c.rotation.y=r.yaw,o.add(c);const l=new V(new tn(4.7,32),t.clone());l.rotation.y=r.yaw,o.add(l);const d=new q({color:1120288,roughness:.42,metalness:.55});for(const p of[-5.1,5.1]){const m=new V(new ut(.11,.16,6.2,8),d);m.position.set(Math.cos(r.yaw)*p,-1.1,Math.sin(r.yaw)*p),o.add(m)}const u=new V(new Gt(.45,16,10),e.clone());u.position.y=4.1,o.add(u),o.position.set(r.x,a,r.z),o.userData.index=s,o.userData.baseY=a,o.userData.label=r.label,i.add(o),en.push({...r,y:a,radius:8.5,marker:o,collected:!1})}Un(i,s=>{for(let r=0;r<en.length;r++){const a=en[r],o=r===f.objectiveIndex;a.marker.visible=!a.collected||o,a.marker.position.y=a.y+Math.sin(s*2.2+r)*.35,a.marker.rotation.z=Math.sin(s*1.3+r)*.035,a.marker.scale.setScalar(o?1.16+Math.sin(s*5)*.035:.82),a.marker.traverse(c=>{c.material?.emissive&&(c.material.emissiveIntensity=o?2.4:.65)})}}),tt.add(i),po=i}A1();const Os=new Hg(Qt);Os.addPass(new Wg(tt,Je));const bd=new Ds(new Ie(window.innerWidth,window.innerHeight),.34,.78,1);Os.addPass(bd);Os.addPass(new Yg);const C1={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},js=new hd(C1);Os.addPass(js);const R1=new q({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),sr=Array.from({length:72},()=>{const i=new V(new Gt(.1,8,5),R1);return i.visible=!1,tt.add(i),{mesh:i,life:0,velocity:new P}}),P1=new At({color:14212576,transparent:!0,opacity:0,depthWrite:!1,side:gt}),rr=Array.from({length:90},()=>{const i=new V(new tn(1,18),P1.clone());return i.visible=!1,tt.add(i),{mesh:i,life:0,maxLife:1,velocity:new P,spin:0}}),L1=new q({color:2962232,roughness:.58,metalness:.34}),ar=Array.from({length:48},()=>{const i=new V(new Le(.18,.08,.26),L1);return i.visible=!1,tt.add(i),{mesh:i,life:0,velocity:new P,spin:new P}});let fi=null;function wd(){if(fi)return;const i=new AudioContext,e=i.createOscillator(),t=i.createGain(),n=i.createBiquadFilter();e.type="sawtooth",n.type="lowpass",n.frequency.value=540,e.frequency.value=70,t.gain.value=1e-4,e.connect(n).connect(t).connect(i.destination),e.start(),fi={ctx:i,engine:e,engineGain:t,filter:n,nextNote:0,beat:0}}function ga(){fi||wd(),fi?.ctx.state==="suspended"&&fi.ctx.resume().catch(()=>{})}function pc(i){if(!fi)return;const{ctx:e}=fi,t=e.createOscillator(),n=e.createGain();t.type="sine",t.frequency.value=55+i*2.6,n.gain.setValueAtTime(Math.min(.34,i/55),e.currentTime),n.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(n).connect(e.destination),t.start(),t.stop(e.currentTime+.24)}function _r(i,e=18){const t=Math.min(e,sr.length);for(let n=0;n<t;n++){const s=sr.find(r=>r.life<=0)||sr[n];s.mesh.visible=!0,s.mesh.position.copy(i),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function Td(i,e=10,t=1){const n=Math.min(e,rr.length);for(let s=0;s<n;s++){const r=rr.find(a=>a.life<=0)||rr[s];r.mesh.visible=!0,r.mesh.position.copy(i).add(new P((Math.random()-.5)*2.2,Math.random()*.7,(Math.random()-.5)*2.2)),r.mesh.rotation.set(-Math.PI/2,0,Math.random()*Math.PI*2),r.mesh.material.opacity=.18+Math.random()*.12,r.mesh.scale.setScalar(.8+Math.random()*1.2*t),r.velocity.set((Math.random()-.5)*3.2,1.4+Math.random()*2.2,(Math.random()-.5)*3.2),r.life=r.maxLife=.55+Math.random()*.55,r.spin=(Math.random()-.5)*2.2}}function D1(i,e=8,t=1){const n=Math.min(e,ar.length);for(let s=0;s<n;s++){const r=ar.find(a=>a.life<=0)||ar[s];r.mesh.visible=!0,r.mesh.position.copy(i).add(new P((Math.random()-.5)*1.4,.6+Math.random()*.9,(Math.random()-.5)*1.4)),r.mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),r.mesh.scale.setScalar(.8+Math.random()*1.8*t),r.velocity.set((Math.random()-.5)*14*t,5+Math.random()*9*t,(Math.random()-.5)*14*t),r.spin.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8),r.life=.65+Math.random()*.55}}function I1(i,e=Math.abs(f.speed),t="CRASH"){const n=Be.clamp(Math.abs(e)/70,.18,1.45);f.collisionHits++,f.collisionDrama=Math.max(f.collisionDrama,n),f.cameraShake=Math.max(f.cameraShake,.25+n*.45),f.damage=Be.clamp(f.damage+n*3.6,0,100),f.message=t,f.messageTimer=Math.max(f.messageTimer,.7),_r(i,Math.round(10+n*24)),Td(i,Math.round(5+n*12),n),D1(i,Math.round(3+n*8),n),pc(18+n*34)}function U1(i){for(const e of sr){if(e.life<=0)continue;e.life-=i,e.velocity.y-=26*i,e.mesh.position.addScaledVector(e.velocity,i);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}for(const e of rr){if(e.life<=0)continue;e.life-=i,e.mesh.position.addScaledVector(e.velocity,i),e.velocity.y+=.4*i,e.mesh.rotation.z+=e.spin*i;const t=1-e.life/Math.max(.001,e.maxLife);e.mesh.scale.multiplyScalar(1+i*.75),e.mesh.material.opacity=Math.max(0,.24*(1-t)),e.mesh.lookAt(Je.position),e.life<=0&&(e.mesh.visible=!1)}for(const e of ar)e.life<=0||(e.life-=i,e.velocity.y-=24*i,e.mesh.position.addScaledVector(e.velocity,i),e.mesh.rotation.x+=e.spin.x*i,e.mesh.rotation.y+=e.spin.y*i,e.mesh.rotation.z+=e.spin.z*i,e.life<=0&&(e.mesh.visible=!1))}function F1(i){if(!fi)return;const{ctx:e,engine:t,engineGain:n,filter:s}=fi;t.frequency.setTargetAtTime(62+f.speed*2.9+(_t.has("ShiftLeft")||_t.has("ShiftRight")?60:0),e.currentTime,.04),s.frequency.setTargetAtTime(480+f.speed*9,e.currentTime,.08);const r=f.mode==="race"||f.mode==="roam";n.gain.setTargetAtTime(r?.036+Math.abs(f.speed)/4200:1e-4,e.currentTime,.08)}function Aa(i=!1,e=!1){wd(),_t.clear(),_a();const t=i||e;Object.assign(f,{mode:"race",practice:t,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:t?-900:-28,rivalDistance:t?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":i?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:t?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const n=bt(f.s);f.y=n.p.y+2.1,f.yVel=0,et.menu.classList.add("hidden"),et.result.classList.add("hidden"),et.resultStats.innerHTML="",et.position.textContent=e?"FREE RUN":i?"PRACTICE":"DIV 4",et.trackName.textContent=oe.name,on.visible=!1,Hn&&(Hn.visible=!0),document.body.classList.remove("roam-mode"),window.__freeCam=!1}function Ed(){ga(),f.mode="roam",f.practice=!0,f.freeRun=!1,_t.clear(),_a();let i=80,e=338;Cn(i,e,6).clearance<6&&(i=80,e=320),f.roamPos.set(i,Xe(i,e),e),f.roamYaw=0,f.camYaw=f.roamYaw,f.camLookYaw=0,f.camLookPitch=0,f.cameraZoom=0,Ne.zoom=0,f.wheelSteer=0,f.speed=0,f.boost=1,f.damage=0,f.cameraShake=0,f.collisionDrama=0,f.collisionHits=0,f.collisionCooldown=0,f.objectiveIndex=0,f.objectiveHits=0,f.objectiveLap=1;for(const s of en)s.collected=!1;f.message="",f.messageTimer=0,Ji.visible=!1,on.visible=!0,Hn&&(Hn.visible=!1),document.body.classList.add("roam-mode"),window.__freeCam=!1,et.menu.classList.add("hidden"),et.result.classList.add("hidden"),et.position.textContent="FREE ROAM",et.trackName.textContent="City Streets",yr();const t=Math.sin(f.roamYaw),n=-Math.cos(f.roamYaw);Je.position.set(f.roamPos.x-t*17,f.roamPos.y+7.2,f.roamPos.z-n*17),Dd(),Je.lookAt(f.roamPos.x+t*13,f.roamPos.y+2.45,f.roamPos.z+n*13),Je.fov=69,Je.updateProjectionMatrix()}function yr(){on.position.set(f.roamPos.x,f.roamPos.y+.3-f.roamSuspension*.45,f.roamPos.z),on.quaternion.setFromAxisAngle(an,-f.roamYaw),on.rotateZ(-f.wheelSteer*Be.clamp(Math.abs(f.speed)/90,0,1)*.1),on.rotateX(Be.clamp(f.roamSuspension,-.16,.22))}function Ad(i,e){let t=null;for(const s of Sr)for(const r of s.segments){const a=i-r.a.x,o=e-r.a.z,c=Be.clamp((a*r.abx+o*r.abz)/r.lenSq,0,1),l=r.a.x+r.abx*c,d=r.a.z+r.abz*c,u=Math.hypot(i-l,e-d);if(u>s.halfW+Vn*1.15)continue;const p=Be.lerp(r.a.y,r.b.y,c),m=Be.lerp(r.u0,r.u1,c),g=u+Math.max(0,Xe(i,e)-p)*.2;(!t||g<t.score)&&(t={kind:"ramp",y:p,u:m,ramp:s,rampType:s.rampType,mergeS:s.mergeS,exitS:s.exitS,dirSel:s.dirSel,tangentX:r.abx,tangentZ:r.abz,lateral:s.dirSel*oe.width*.34,score:g})}if(!t)return null;const n=Math.max(1e-4,Math.hypot(t.tangentX,t.tangentZ));return t.tangentX/=n,t.tangentZ/=n,t}function Cd(i,e,t=Xe(i,e),n=!1){let s=null;const r=10;for(let o=0;o<oe.length;o+=r){if(Ri(o+r*.5))continue;const c=bt(o),l=bt(o+r),d=l.p.x-c.p.x,u=l.p.z-c.p.z,p=Math.max(1e-4,d*d+u*u),m=Be.clamp(((i-c.p.x)*d+(e-c.p.z)*u)/p,0,1),g=c.p.x+d*m,_=c.p.z+u*m,x=i-g,h=e-_,M=Math.hypot(x,h);if(M>oe.width*.5+Vn*.45)continue;const v=Be.lerp(c.p.y,l.p.y,m)+.58;if(!n&&t<v-5)continue;const y=new P(u,0,-d).normalize(),E=Be.clamp(x*y.x+h*y.z,-oe.width*.44,oe.width*.44);(!s||M<s.dist)&&(s={kind:"track",y:v,s:o+r*m,lateral:E,tangentX:d,tangentZ:u,dist:M})}if(!s)return null;const a=Math.max(1e-4,Math.hypot(s.tangentX,s.tangentZ));return s.tangentX/=a,s.tangentZ/=a,s}function qi(i,e,t=f.roamPos.y){const n=Xe(i,e);let s={kind:"ground",y:n};const r=Ad(i,e);r&&r.y>=n-1.2&&(s=r);const a=Cd(i,e,Math.max(t,s.y));return!(s.kind==="ramp"&&s.rampType==="off")&&a&&a.y>=s.y-.8&&(s=a),s}function mh(i){if(i.rampType==="off")return!1;const e=Math.sin(f.roamYaw)*i.tangentX+-Math.cos(f.roamYaw)*i.tangentZ;if(f.speed<10||e<.22)return!1;const t=(i.mergeS??i.s??22)+8,n=bt(t);return f.mode="race",f.practice=!0,f.freeRun=!0,f.breakdownTimer=0,f.s=n.s,f.totalDistance=n.s,f.lastSafeS=n.s,f.lastSafeDistance=n.s,f.lateral=Be.clamp(i.lateral??0,-oe.width*.32,oe.width*.32),f.lateralVel=-Math.sign(f.lateral)*Math.min(4,Math.abs(f.speed)*.04),f.speed=Be.clamp(Math.max(28,f.speed),18,112),f.grounded=!0,f.y=n.p.y+2.1,f.yVel=0,f.airtime=0,f.rivalS=-900,f.rivalDistance=-900,f.leadState="SOLO",f.message="Merged onto the ribbon",f.messageTimer=1.6,f.cameraShake=Math.max(f.cameraShake,.35),Ji.visible=!1,on.visible=!1,Hn&&(Hn.visible=!0),document.body.classList.remove("roam-mode"),et.position.textContent="FREE RUN",et.trackName.textContent=oe.name,yr(),!0}function N1(i){if(!i||f.mode!=="race")return!1;const e=i.segments[0],t=i.points[0],n=Math.max(1e-4,Math.hypot(e.abx,e.abz)),s=e.abx/n,r=e.abz/n;f.mode="roam",f.practice=!0,f.freeRun=!1,f.roamPos.set(t.x+s*3.5,t.y+Jn,t.z+r*3.5),f.roamYaw=Math.atan2(s,-r),f.camYaw=f.roamYaw,f.camLookYaw=0,f.camLookPitch=0,f.cameraZoom=0,f.wheelSteer=0,f.speed=Be.clamp(Math.max(24,Math.abs(f.speed)*.82),20,78),f.grounded=!0,f.yVel=0,f.airtime=0,f.message="Exited to city streets",f.messageTimer=1.25,f.cameraShake=Math.max(f.cameraShake,.22),Ji.visible=!1,on.visible=!0,Hn&&(Hn.visible=!1),document.body.classList.add("roam-mode"),et.position.textContent="FREE ROAM",et.trackName.textContent="City Streets",yr();const a=Math.sin(f.roamYaw),o=-Math.cos(f.roamYaw);return Je.position.set(f.roamPos.x-a*17,f.roamPos.y+7.2,f.roamPos.z-o*17),Je.lookAt(f.roamPos.x+a*13,f.roamPos.y+2.45,f.roamPos.z+o*13),Je.fov=69,Je.updateProjectionMatrix(),_r(f.roamPos.clone().add(new P(0,.6,0)),10),!0}function O1(){if(f.mode!=="roam"||en.length===0)return;const i=en[f.objectiveIndex%en.length];if(!i)return;const e=f.roamPos.x-i.x,t=f.roamPos.z-i.z,n=Math.abs(f.roamPos.y-i.y);e*e+t*t>i.radius*i.radius||n>8.5||(i.collected=!0,f.objectiveHits++,f.objectiveIndex=(f.objectiveIndex+1)%en.length,f.objectiveIndex===0&&f.objectiveLap++,f.score+=420+Math.round(Math.abs(f.speed)*5),f.boost=Math.min(1,f.boost+.32),f.cameraShake=Math.max(f.cameraShake,.18),f.message=`${i.label} +${420+Math.round(Math.abs(f.speed)*5)}`,f.messageTimer=1.05,_r(new P(i.x,i.y,i.z),18))}function Rd(i){const e=f.speed;f.collisionCooldown=Math.max(0,f.collisionCooldown-i);const t=Math.max(_t.has("KeyW")||_t.has("ArrowUp")?1:0,Ne.throttle),n=Math.max(_t.has("KeyS")||_t.has("ArrowDown")?1:0,Ne.brake),r=Be.clamp((_t.has("KeyD")||_t.has("ArrowRight")?1:0)-(_t.has("KeyA")||_t.has("ArrowLeft")?1:0)+Ne.steer,-1,1)*pd,a=(_t.has("ShiftLeft")||_t.has("ShiftRight"))&&f.boost>.02&&t>.03;if(t>.03){const v=f.speed<0?38:0;f.speed+=((a?62:36)+v)*t*i}n>.03&&(f.speed-=(f.speed>1.2?78:32)*n*i),f.speed-=.00235*f.speed*Math.abs(f.speed)*i,Math.abs(f.speed)>.08?f.speed-=Math.sign(f.speed)*3.6*i:t<=.03&&n<=.03&&(f.speed=0),f.speed=Be.clamp(f.speed,-24,135),f.boosting=a,a?f.boost=Math.max(0,f.boost-i*.22):f.boost=Math.min(1,f.boost+i*.05),f.wheelSteer+=(r-f.wheelSteer)*(1-Math.pow(1e-5,i));const o=-f.wheelSteer*.55,c=on.userData.frontWheels;c&&(c[0].rotation.y=o,c[1].rotation.y=o);const l=Math.abs(f.speed);if(l>dc){const v=Be.clamp((l-dc)/5,0,1),y=1-.36*Be.clamp((l-34)/85,0,1),E=$g*1.08*v*y;f.roamYaw+=f.wheelSteer*E*i*Math.sign(f.speed)}const d=Math.sin(f.roamYaw),u=-Math.cos(f.roamYaw),p=(f.speed-e)/Math.max(.001,i),m=Be.clamp(Math.abs(f.wheelSteer)*Math.max(0,l-18)/68+Math.max(0,-p-34)/90,0,1);if(f.roamSlip+=(m-f.roamSlip)*(1-Math.pow(.01,i)),f.roamSuspension+=(Math.sin(performance.now()*.014)*Math.min(.18,l/540)+Math.abs(p)*.0018-f.roamSuspension)*(1-Math.pow(.018,i)),f.roamSlip>.38&&Math.random()<i*(3+f.roamSlip*7)){const v=new P(f.roamPos.x-d*3.2,f.roamPos.y+.2,f.roamPos.z-u*3.2);Td(v,2,f.roamSlip)}const g=Math.abs(f.speed)*i,_=Math.max(1,Math.ceil(g/1.2));let x=!1,h=!1,M=qi(f.roamPos.x,f.roamPos.z,f.roamPos.y);for(let v=0;v<_;v++)f.roamPos.x+=d*f.speed*i/_,f.roamPos.z+=u*f.speed*i/_,M=qi(f.roamPos.x,f.roamPos.z,f.roamPos.y),f.roamPos.y=M.y+Jn,V1(f.roamPos,M)&&(h=!0),G1(f.roamPos,M)&&(x=!0),M=qi(f.roamPos.x,f.roamPos.z,f.roamPos.y),f.roamPos.y=M.y+Jn;f.roamPos.x=Be.clamp(f.roamPos.x,-820,820),f.roamPos.z=Be.clamp(f.roamPos.z,-1620,480),x&&(f.collisionCooldown<=0&&(I1(new P(f.roamPos.x,f.roamPos.y+.8,f.roamPos.z),e,"IMPACT"),f.collisionCooldown=.38),f.speed*=.28),h&&(f.speed*=.62,f.cameraShake=Math.max(f.cameraShake,.22),f.message="SPLAT!",f.messageTimer=.9),M=qi(f.roamPos.x,f.roamPos.z,f.roamPos.y),f.roamPos.y=M.y+Jn,!(M.kind==="ramp"&&M.u>.72&&mh(M))&&(M.kind==="track"&&mh(M)||(O1(),yr(),_t.has("KeyR")&&(Ed(),_t.delete("KeyR"))))}const Vn=2.6;function xo(i,e){let t=!1;for(let n=0;n<e.length;n++){const s=e[n];if(s.maxY!=null&&i.y>s.maxY+Jn+.45)continue;if(s.radius){const u=s.radius+Vn,p=i.x-s.x,m=i.z-s.z,g=p*p+m*m;if(g>=u*u)continue;t=!0;const _=Math.max(1e-4,Math.sqrt(g));i.x=s.x+p/_*u,i.z=s.z+m/_*u;continue}const r=s.hw+Vn,a=s.hd+Vn,o=i.x-s.x,c=i.z-s.z;if(Math.abs(o)>=r||Math.abs(c)>=a)continue;t=!0;const l=r-Math.abs(o),d=a-Math.abs(c);l<d?i.x=s.x+(o<0?-r:r):i.z=s.z+(c<0?-a:a)}return t}function Pd(i,e=f.roamPos){if(!i)return;const t=(i.crashTimer||0)<=.05;i.crashTimer=Math.max(i.crashTimer||0,1.15+Math.random()*.45),i.waitTimer=Math.max(i.waitTimer||0,.55),i.brakePulse=1;const n=i.maxAvoidOffset||li.streetW*.3,s=i.mesh?.position?.x??i.collider?.x??i.road,r=i.mesh?.position?.z??i.collider?.z??i.along,a=i.axis==="ns"?e.x-s>=0?-1:1:e.z-r>=0?-1:1;i.avoidOffset=Be.clamp((i.avoidOffset||0)+a*n*.9,-n,n),t&&(qe.trafficCrashes++,i.along-=i.dir*1.8,i.mesh&&(i.mesh.rotation.y+=a*.08),f.mode==="roam"&&(f.cameraShake=Math.max(f.cameraShake,.32),f.message="TRAFFIC CRASH",f.messageTimer=.85))}function B1(i){let e=!1;for(let t=0;t<Ai.length;t++){const n=Ai[t];if(n.maxY!=null&&i.y>n.maxY+Jn+.45)continue;const s=n.hw+Vn,r=n.hd+Vn,a=i.x-n.x,o=i.z-n.z;if(Math.abs(a)>=s||Math.abs(o)>=r)continue;e=!0,Pd(n.actor,i);const c=s-Math.abs(a),l=r-Math.abs(o);c<l?i.x=n.x+(a<0?-s:s):i.z=n.z+(o<0?-r:r)}return e}function z1(i,e,t=0){return e.maxY!=null&&i.y>e.maxY+Jn+.45?!1:e.radius?Math.hypot(i.x-e.x,i.z-e.z)<e.radius+t:Math.abs(i.x-e.x)<e.hw+t&&Math.abs(i.z-e.z)<e.hd+t}function k1(i){i.active=!1,i.respawn=4.5+Math.random()*1.5,i.mesh.visible=!1,qe.splats++;const e=ws.find(t=>!t.visible)||ws[qe.splats%Math.max(1,ws.length)];e&&(e.visible=!0,e.userData.life=e.userData.maxLife,e.position.set(i.x,Xe(i.x,i.z)+.08,i.z),e.rotation.y=0,e.rotation.z=Math.random()*Math.PI*2,e.scale.setScalar(.9+Math.random()*.45),e.traverse(t=>{t.material&&(t.material.opacity=.72)}))}function V1(i,e=null){if(e?.kind!=="ground"||Math.abs(f.speed)<5)return!1;let t=!1;for(const n of vr){if(!n.active)continue;const s=i.x-n.x,r=i.z-n.z,a=Vn+n.hitRadius;s*s+r*r>a*a||Math.abs(i.y-(Xe(n.x,n.z)+Jn))>3.2||(k1(n),t=!0)}return t}function G1(i,e=null){let t=!1;for(let n=0;n<2;n++){const s=xo(i,_n),r=e?.kind==="ground"?xo(i,Yn):!1,a=xo(i,Ki),o=e?.kind==="ground"?B1(i):!1;if(!s&&!r&&!a&&!o)break;t=!0}return t}function Ld(i){const e=Ne.lookX*1.18,t=Ne.lookY*.58;f.camLookYaw+=(e-f.camLookYaw)*(1-Math.pow(.002,i)),f.camLookPitch+=(t-f.camLookPitch)*(1-Math.pow(.002,i)),f.cameraZoom+=(Ne.zoom-f.cameraZoom)*(1-Math.pow(.018,i))}function Yc(i,e,t=3.2){let n=0;for(let s=1;s<=10;s++){const r=s/10,a=Be.lerp(i.x,e.x,r),o=Be.lerp(i.z,e.z,r),c=Be.lerp(i.y,e.y,r),l=Xe(a,o)+t;l>c&&(n=Math.max(n,(l-c)/Math.max(.08,r)))}return n}function H1(i,e){const t=Xe(i,e);let n=null;const s=Ad(i,e);s&&s.y>t+4&&(n=s);const r=Cd(i,e,1e3,!0);return r&&r.y>t+4&&(!n||r.y>n.y)&&(n=r),n}function va(i,e,t=4){let n=0;for(let s=2;s<=14;s++){const r=s/14,a=Be.lerp(i.x,e.x,r),o=Be.lerp(i.z,e.z,r),c=Be.lerp(i.y,e.y,r),l=H1(a,o);if(!l)continue;const d=l.y+t-c;d>0&&(n=Math.max(n,d/Math.max(.16,r)))}return Math.min(54,n)}function Dd(){const i=f.camYaw+f.camLookYaw,e=Math.sin(i),t=-Math.cos(i),n=Be.clamp(f.cameraZoom,-.42,.9),s=f.roamPos,r={x:s.x+e*(12-Math.min(n,0)*6),y:s.y+2.6+f.camLookPitch*13.5,z:s.z+t*(12-Math.min(n,0)*6)};Je.position.y+=Yc(r,Je.position,3.4),Je.position.y+=va(r,Je.position,4.2)}function Id(i){if(window.__freeCam)return;if(Ld(i),Math.abs(f.speed)>dc){let m=f.roamYaw-f.camYaw;m=Math.atan2(Math.sin(m),Math.cos(m)),f.camYaw+=m*(1-Math.pow(.08,i))}const e=f.camYaw+f.camLookYaw,t=Math.sin(e),n=-Math.cos(e),s=f.roamPos,r=Be.clamp(f.cameraZoom,-.42,.9),a=Be.clamp(Math.abs(f.speed)/135,0,1),o=(17+Math.abs(f.speed)*.11+f.roamSlip*3)*(1+r*.72),c=7.2+a*2.1+Math.max(0,r)*4.4-Math.min(0,r)*2+f.camLookPitch*5.8,l=fd.set(s.x-t*o,s.y+c,s.z-n*o);if(f.cameraShake>.01||f.collisionDrama>.01){const m=f.cameraShake+f.collisionDrama*.42;l.x+=(Math.random()-.5)*m*1.2,l.y+=(Math.random()-.5)*m*.75,l.z+=(Math.random()-.5)*m*1.2}const d=Gc.set(s.x+t*(13+a*8-Math.min(r,0)*6),s.y+2.45+f.camLookPitch*13.5,s.z+n*(13+a*8-Math.min(r,0)*6));l.y=Math.max(l.y,Xe(l.x,l.z)+3.5),l.y+=Yc(d,l,3.4),l.y+=va(d,l,4.2);const u=f.roamSlip>.35?.006:.0026;Je.position.lerp(l,1-Math.pow(u,i)),Je.position.y+=va(d,Je.position,3.8)*.72,Rn.position.copy(Je.position),Rn.lookAt(d),Rn.rotateY(Math.PI),Rn.rotateZ(-f.wheelSteer*a*.18+f.roamSlip*Math.sign(f.wheelSteer||1)*.05),Je.quaternion.slerp(Rn.quaternion,1-Math.pow(.05,i));const p=69+Math.min(13,Math.abs(f.speed)*.075)+f.roamSlip*2.5+r*10;Math.abs(Je.fov-p)>.02&&(Je.fov+=(p-Je.fov)*(1-Math.pow(.01,i)),Je.updateProjectionMatrix()),f.cameraShake=Math.max(0,f.cameraShake-i*2.4),f.collisionDrama=Math.max(0,f.collisionDrama-i*1.8)}function Ud(i){if(f.mode==="result")return;f.mode="result";const e=Math.max(0,Math.round(f.score-f.damage*9+Math.max(0,220-f.time)*45));e>f.best&&(f.best=e,localStorage.setItem("steel-ribbon-best",String(e))),et.best.textContent=`Best score ${f.best}`,et.resultText.textContent=`${i} Score ${e}. Time ${mc(f.time)}. Damage ${Math.round(f.damage)}%.`;const t=Number.isFinite(f.bestLap)?mc(f.bestLap):"--:--.-";et.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${t}</b>
    <b>Clean landings: ${f.cleanLandings}</b>
    <b>Hard landings: ${f.hardLandings}</b>
    <b>Recoveries: ${f.recoveries}</b>
    <b>Near edges: ${Math.round(f.nearMisses)}</b>
  `,et.result.classList.remove("hidden")}function xh(i="Craned back to the ribbon"){const e=bt(f.lastSafeS);f.s=f.lastSafeS,f.totalDistance=f.lastSafeDistance,f.lateral=0,f.lateralVel=0,f.y=e.p.y+2.1,f.yVel=0,f.speed=Math.max(16,f.speed*.32),f.grounded=!0,f.cameraShake=1.2,f.message=i,f.messageTimer=1.4,f.recoveries+=1}function qc(i,e){return Be.clamp(e*i.tangent.y,-48,48)}function W1(i=94){return oe.gaps.map(e=>{const t=bt(e.start),n=bt(e.end+3),s=(e.end-e.start)/Math.max(1,i),r=qc(t,i),a=t.p.y+2.1+r*s-.5*31*s*s,o=n.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(Be.radToDeg(t.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function gh(i,e){f.grounded=!1,f.yVel=qc(i,f.speed),f.airtime=0,e&&(f.message=e)}window.__steelRibbonDebug={launchVelocityAt(i,e){return qc(bt(i),e)},gapJumpReport(i){return W1(i)},sceneryClearanceReport(){return o1()},setSpeed(i){return f.speed=Be.clamp(i,-14,156-f.damage*.42),or(),f.speed},setTrackPosition(i,e=f.speed,t=0){const n=bt(i);return f.totalDistance=i,f.s=n.s,f.lastSafeS=n.s,f.lastSafeDistance=i,f.lateral=Be.clamp(t,-oe.width*.48,oe.width*.48),f.lateralVel=0,f.y=n.p.y+2.1,f.yVel=0,f.grounded=!0,f.speed=Be.clamp(e,-14,156-f.damage*.42),or(),{s:f.s,totalDistance:f.totalDistance,speed:f.speed,lateral:f.lateral,y:f.y}},setDamage(i){return f.damage=Be.clamp(i,0,99),or(),f.damage},setCourse(i){return Xc(i)},flyCam(i,e,t,n,s,r){return window.__freeCam=!0,Je.position.set(i,e,t),Je.lookAt(n,s,r),Je.fov=62,Je.updateProjectionMatrix(),"freecam"},listCourses(){return es.map((i,e)=>({index:e,name:i.name,length:i.length,width:i.width,laps:i.laps,gaps:i.gaps.length}))},courseInfo(){return{index:ca,name:oe.name,length:oe.length,width:oe.width,laps:oe.laps}},probeDown(i,e){const n=new Jf(new P(i,400,e),new P(0,-1,0),0,1e3).intersectObjects(tt.children,!0).map(r=>({y:+r.point.y.toFixed(2),name:r.object.material?.color?"#"+r.object.material.color.getHexString():"?"})),s=qi(i,e,400);return{x:i,z:e,ground:+Xe(i,e).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:n.slice(0,5)}},rampSurfaceReport(){return Sr.map((i,e)=>{const t=i.points[0],n=i.points[i.points.length-1],s=i.points[i.points.length/2|0],r=i.segments[0],a=i.segments[i.segments.length-1],o=Math.atan2(r.abx,-r.abz);return{index:e,rampType:i.rampType,mergeS:i.mergeS,exitS:i.exitS,dirSel:i.dirSel,halfW:i.halfW,start:{x:+t.x.toFixed(2),y:+t.y.toFixed(2),z:+t.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2)},climb:+(n.y-t.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(a.abx,-a.abz).toFixed(4)}})},colliderSample(i=8){return _n.slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(i=8){return Yn.filter(e=>e.hw).slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},trackSupportReport(){const i=Yn.filter(e=>e.hw);return{supports:uc,pylonColliders:i.length,gaps:oe.gaps.length,sample:i.slice(0,8).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)}))}},buildingTrackConflictReport(i=12){const e=[];for(const t of _n){const n=Gi(t.x,t.z,t.hw*2,t.hd*2,t.maxY);n&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1),courseIndex:n.courseIndex,s:+n.s.toFixed(1),trackY:+n.trackY.toFixed(1),horizontalClearance:+n.horizontalClearance.toFixed(1),verticalIntrusion:+n.verticalIntrusion.toFixed(1)})}return e.sort((t,n)=>n.verticalIntrusion-t.verticalIntrusion),{totalBuildings:_n.length,conflicts:e.length,sample:e.slice(0,i)}},buildingStreetConflictReport(i=12){const e=[];for(const t of _n){const n=Vi(t.x,t.z,t.hw*2,t.hd*2,0);n&&e.push({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),axis:n.axis,road:n.road,overlap:+n.overlap.toFixed(1)})}return e.sort((t,n)=>n.overlap-t.overlap),{totalBuildings:_n.length,conflicts:e.length,sample:e.slice(0,i)}},rockColliderSample(i=8){return Ki.concat(Yn.filter(e=>e.kind==="rock")).slice(0,i).map(e=>({kind:e.kind||"prop",x:+e.x.toFixed(1),z:+e.z.toFixed(1),radius:e.radius?+e.radius.toFixed(1):null}))},cityLifeReport(i=8){return{traffic:qe.traffic,pedestrians:qe.pedestrians,pedestriansActive:vr.filter(e=>e.active).length,turns:qe.turns,splats:qe.splats,trafficCrashes:qe.trafficCrashes,streetLights:qe.streetLights,trafficLights:qe.trafficLights,stopSigns:qe.stopSigns,signs:qe.signs,roadDetails:{...qe.roadDetails},buildingArchetypes:{...qe.buildingArchetypes},zones:{...qe.zones},openerProps:qe.openerProps,signSamples:xa.slice(0,i),types:{...qe.types},offRoadTraffic:Ai.filter(e=>!Ea(e.x,e.z,2)).length,trafficRoutes:fc.slice(0,i).map(e=>({axis:e.axis,dir:e.dir,road:+e.road.toFixed(1),along:+e.along.toFixed(1),next:+e.next.toFixed(1),avoidOffset:+(e.avoidOffset||0).toFixed(1),crashTimer:+(e.crashTimer||0).toFixed(2)})),trafficColliders:Ai.slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1)})),pedestrianTargets:vr.filter(e=>e.active).slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),axis:e.axis,dir:e.dir}))}},visualQualityReport(){const i={...qe.roadDetails},e={...qe.buildingArchetypes},t={...qe.zones},n=Object.values(e).filter(a=>a>0).length,s=Object.values(t).filter(a=>a>0).length;return{score:+(Math.min(25,(i.crosswalks||0)/8)+Math.min(18,(i.laneArrows||0)/3)+Math.min(14,(i.manholes||0)/4)+Math.min(16,qe.signs/7)+Math.min(14,qe.openerProps*1.4)+Math.min(13,n*2.6)).toFixed(1),roadDetails:i,buildingArchetypes:e,zones:t,archetypeKinds:n,zoneKinds:s,openerProps:qe.openerProps,signs:qe.signs,streetLights:qe.streetLights}},objectiveReport(){const i=en[f.objectiveIndex%Math.max(1,en.length)];return{total:en.length,hits:f.objectiveHits,index:f.objectiveIndex,lap:f.objectiveLap,next:i?{x:+i.x.toFixed(1),y:+i.y.toFixed(1),z:+i.z.toFixed(1),label:i.label}:null,collected:en.filter(e=>e.collected).length,score:Math.round(f.score),boost:+f.boost.toFixed(2)}},drivingFeelReport(){return{speed:+f.speed.toFixed(2),wheelSteer:+(f.wheelSteer||0).toFixed(3),slip:+(f.roamSlip||0).toFixed(3),suspension:+(f.roamSuspension||0).toFixed(3),cameraShake:+(f.cameraShake||0).toFixed(3),collisionDrama:+(f.collisionDrama||0).toFixed(3),collisionHits:f.collisionHits,smokeActive:rr.filter(i=>i.life>0).length,debrisActive:ar.filter(i=>i.life>0).length,sparksActive:sr.filter(i=>i.life>0).length}},vehicleDetailReport(){return{player:{...on.userData.detailReport},racer:{...Ji.userData.detailReport},namedParts:on.children.filter(i=>i.name).map(i=>i.name).slice(0,24)}},advanceCityLife(i=1){const e=.03333333333333333;let t=Math.max(0,Math.min(i,60));for(;t>0;){const n=Math.min(e,t);_d(n),t-=n}return this.cityLifeReport(12)},setRoamPose(i,e,t){const n=qi(i,e,f.roamPos.y);f.roamPos.set(i,n.y+Jn,e),f.roamYaw=t,f.camYaw=t,f.camLookYaw=0,f.camLookPitch=0,f.wheelSteer=0,f.speed=0,yr();const s=Math.sin(f.roamYaw),r=-Math.cos(f.roamYaw);return Je.position.set(f.roamPos.x-s*17,f.roamPos.y+7.2,f.roamPos.z-r*17),Dd(),Je.lookAt(f.roamPos.x+s*13,f.roamPos.y+2.45,f.roamPos.z+r*13),Je.fov=69,Je.updateProjectionMatrix(),this.roamReport()},setTouchCamera(i=0,e=0,t=Ne.zoom,n=30){Ne.lookX=Be.clamp(i,-1,1),Ne.lookY=Be.clamp(e,-1,1),Ne.zoom=Be.clamp(t,-.42,.9);for(let s=0;s<n;s++)f.mode==="roam"?Id(1/60):Zc(1/60);return this.roamReport()},simulateRoamDrive(i=1,e=0,t=0,n=0){if(f.mode!=="roam")return this.roamReport();const s={steer:Ne.steer,throttle:Ne.throttle,brake:Ne.brake};Ne.steer=Be.clamp(e,-1,1),Ne.throttle=Be.clamp(t,0,1),Ne.brake=Be.clamp(n,0,1);const r=1/60;let a=Math.max(0,Math.min(i,8));for(;a>0;){const o=Math.min(r,a);if(Rd(o),f.mode!=="roam")break;a-=o}return Ne.steer=s.steer,Ne.throttle=s.throttle,Ne.brake=s.brake,this.roamReport()},simulateTrackDrive(i=1){if(f.mode!=="race")return this.roamReport();const e=1/60;let t=Math.max(0,Math.min(i,8));for(;t>0;){const n=Math.min(e,t);if(Fd(n),f.mode!=="race")break;t-=n}return this.roamReport()},roamReport(){const i=f.roamPos,e=fd.set(0,0,-1).applyQuaternion(on.quaternion).normalize(),t=Gc.set(Math.sin(f.roamYaw),0,-Math.cos(f.roamYaw)).normalize(),n=qi(i.x,i.z,i.y);return{mode:f.mode,s:+f.s.toFixed(2),totalDistance:+f.totalDistance.toFixed(2),x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2),yaw:+f.roamYaw.toFixed(3),camYaw:+f.camYaw.toFixed(3),speed:+f.speed.toFixed(2),groundXZ:+Xe(i.x,i.z).toFixed(2),surface:n.kind,surfaceY:+n.y.toFixed(2),camX:+Je.position.x.toFixed(2),camY:+Je.position.y.toFixed(2),camZ:+Je.position.z.toFixed(2),fov:+Je.fov.toFixed(2),lookYaw:+f.camLookYaw.toFixed(3),lookPitch:+f.camLookPitch.toFixed(3),cameraZoom:+f.cameraZoom.toFixed(3),cameraSightLift:+Yc({x:i.x,y:i.y+2.6,z:i.z},{x:Je.position.x,y:Je.position.y,z:Je.position.z},2.4).toFixed(3),elevatedCameraLift:+va({x:i.x,y:i.y+2.6,z:i.z},{x:Je.position.x,y:Je.position.y,z:Je.position.z},3.8).toFixed(3),colliders:_n.length+Yn.length+Ki.length+Ai.length,insideBuilding:_n.concat(Yn,Ki,Ai).some(s=>z1(i,s)),objectiveHits:f.objectiveHits,objectiveIndex:f.objectiveIndex,collisionHits:f.collisionHits,slip:+(f.roamSlip||0).toFixed(3),suspension:+(f.roamSuspension||0).toFixed(3),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:on.userData.frontWheels?+on.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function Fd(i){if(f.mode!=="race")return;f.time+=i,f.freeRun&&(f.damage=0);const e=f.breakdownTimer>0;e&&(f.breakdownTimer-=i,f.breakdownTimer<=0&&(f.damage=55,f.message="Patched up — back on it",f.messageTimer=1.2));const t=Math.max(_t.has("KeyW")||_t.has("ArrowUp")?1:0,Ne.throttle),n=Math.max(_t.has("KeyS")||_t.has("ArrowDown")?1:0,Ne.brake),r=Be.clamp((_t.has("KeyD")||_t.has("ArrowRight")?1:0)-(_t.has("KeyA")||_t.has("ArrowLeft")?1:0)+Ne.steer,-1,1)*pd,a=t>.03&&!e,o=(_t.has("ShiftLeft")||_t.has("ShiftRight"))&&f.boost>.02&&a&&f.grounded,c=bt(f.s),l=c.p.y+2.1,d=Math.abs(f.speed);if(a){const v=f.speed<0?40:0;f.speed+=((o?68:40)+v)*t*i}if(n>.03){const v=f.speed>1.2?70:26;f.speed-=v*n*i}const u=f.grounded?.0024:.0011;f.speed-=u*f.speed*d*i,d>.08?f.speed-=Math.sign(f.speed)*(f.grounded?2.2:.3)*i:t<=.03&&n<=.03&&(f.speed=0),f.speed=Be.clamp(f.speed,-16,156-f.damage*.8),e&&(f.speed=Math.min(f.speed,14)),f.boosting=o,o?(f.boost=Math.max(0,f.boost-i*.21),f.score+=28*i):f.boost=Math.min(1,f.boost+i*(f.grounded?.045:.018));const p=14+d*.12;f.lateralVel-=r*p*i,f.lateralVel-=f.lateralVel*(f.grounded?3.4:.7)*i,f.lateral+=f.lateralVel*i;const m=Ri(f.s),g=Math.abs(f.lateral)<oe.width*.52,_=!m&&g;if(f.grounded&&(!_||Math.abs(f.lateral)>oe.width*.5)&&gh(c,g?"":"Edge slip"),f.grounded){const v=Math.sin(f.time*18)*Math.min(.22,Math.abs(f.speed)/700);f.y=Be.lerp(f.y,l+v,.5),f.yVel=0,f.lastSafeS=f.s,f.lastSafeDistance=f.totalDistance,f.score+=Math.max(0,f.speed)*i*.34,Math.abs(f.lateral)>oe.width*.42&&(f.damage+=i*(1.2+Math.abs(f.speed)*.035),f.cameraShake=Math.max(f.cameraShake,.24),f.nearMisses+=i*.8,Math.random()<i*5&&_r(c.p.clone().addScaledVector(c.side,Math.sign(f.lateral)*oe.width*.55).addScaledVector(an,1.2),4))}else{f.yVel-=31*i,f.y+=f.yVel*i,f.airtime+=i,f.score+=i*11;const v=bt(f.s),y=v.p.y+2.1;if(!Ri(f.s)&&Math.abs(f.lateral)<oe.width*.55&&f.y<=y&&f.yVel<0){const T=-f.yVel,R=Math.abs(f.lateral)<oe.width*.34&&T<30;f.y=y,f.grounded=!0,f.yVel=0,f.lastSafeS=f.s,f.lastSafeDistance=f.totalDistance,f.damage+=Math.max(0,T-17)*.82+Math.max(0,Math.abs(f.lateral)-oe.width*.36)*1.8,f.score+=R?260+f.airtime*85:Math.max(30,120-T),f.cameraShake=Math.max(f.cameraShake,T/34),f.message=R?"Clean landing":"Hard landing",f.messageTimer=.9,R?f.cleanLandings+=1:f.hardLandings+=1,pc(T),_r(v.p.clone().addScaledVector(v.side,f.lateral).addScaledVector(an,.7),R?7:24),f.airtime=0}f.y<-55&&(f.damage+=28,xh("Track crew recovery"))}const x=f.totalDistance;f.totalDistance+=f.speed*i,f.s=(f.totalDistance%oe.length+oe.length)%oe.length;const h=Sr.find(v=>v.rampType==="off");if(f.freeRun&&h&&ch(x,f.totalDistance,h.exitS)&&f.lateral*h.dirSel>oe.width*.2&&N1(h))return;const M=Math.floor(f.totalDistance/oe.length)+1;if(M>f.lap){const v=f.time-f.lapStartTime;f.splitTimes.push(v),f.bestLap=Math.min(f.bestLap,v),f.lapStartTime=f.time,f.lap=M,f.score+=1200,f.message=f.practice?`Lap ${f.lap}`:f.lap<=oe.laps?`Lap ${f.lap}`:"Season race complete",f.messageTimer=1.4,!f.practice&&f.lap>oe.laps&&Ud(f.totalDistance>=f.rivalDistance?"You took the chequered gantry.":"You finished behind Crowther.")}for(const v of oe.gaps)ch(x,f.totalDistance,v.start)&&(f.message=v.name,f.messageTimer=1.1,f.grounded&&gh(bt(v.start),v.name));f.damage=Be.clamp(f.damage,0,100),!f.freeRun&&f.damage>=90&&f.breakdownTimer<=0&&(f.breakdownTimer=2.6,f.message="Chassis cracked — limping to repair",f.messageTimer=1.6,f.cameraShake=Math.max(f.cameraShake,.8),pc(40),f.damage=90),_t.has("KeyR")&&(f.damage=Math.min(99,f.damage+8),xh("Manual reset"),_t.delete("KeyR"))}function X1(i){if(f.mode==="race"&&!f.practice){const r=f.totalDistance-f.rivalDistance,a=Be.clamp(r*.06,-12,16),o=Math.sin(f.time*.6)*5;f.rivalSpeed=Be.clamp(92+a+o,70,120),f.rivalDistance+=f.rivalSpeed*i,f.rivalDistance>=oe.length*oe.laps&&f.lap<=oe.laps&&Ud("Crowther reached the gantry first.")}f.rivalS=(f.rivalDistance%oe.length+oe.length)%oe.length;const e=bt(f.rivalS),t=e.p.clone().addScaledVector(an,1.4).addScaledVector(e.side,Math.sin(f.rivalS*.02)*1.4);Ji.position.copy(t);const n=new Dt().makeBasis(e.side,an,e.tangent);Ji.quaternion.setFromRotationMatrix(n);const s=Math.abs(f.rivalDistance-f.totalDistance)<26;Ji.visible=(f.mode==="race"||f.mode==="paused")&&!f.practice&&!s}function Zc(i){if(window.__freeCam)return;Ld(i);const e=bt(f.s),t=e.side.clone().multiplyScalar(f.lateral),n=e.p.clone().add(t);n.y=f.y;const s=f.cameraShake;s>.01&&(n.x+=(Math.random()-.5)*s*.8,n.y+=(Math.random()-.5)*s*.45),Je.position.copy(n);const r=Math.abs(f.speed),a=68+Math.min(10,r*.055)+(_t.has("ShiftLeft")||_t.has("ShiftRight")?3:0)+f.cameraZoom*12;Math.abs(Je.fov-a)>.02&&(Je.fov+=(a-Je.fov)*(1-Math.pow(.004,i)),Je.updateProjectionMatrix());const o=bt(f.s+34+f.speed*.16),c=o.p.clone().addScaledVector(o.side,f.lateral*.45);c.y+=1.7+f.camLookPitch*12+Math.sin(f.time*8)*Math.min(.2,r/680),Rn.position.copy(Je.position),Rn.lookAt(c),Rn.rotateY(Math.PI),Rn.rotateY(-f.camLookYaw),Rn.rotateZ(-e.bank*.72-f.lateralVel*.006),Rn.rotateX(e.grade*.18+(f.grounded?0:Be.clamp(f.yVel,-30,30)*-.006)),Je.quaternion.slerp(Rn.quaternion,1-Math.pow(8e-4,i)),f.cameraShake=Math.max(0,f.cameraShake-i*1.9);const l=Gc.set(0,0,-1).applyQuaternion(Je.quaternion).normalize();window.__steelRibbonTelemetry={mode:f.mode,s:f.s,totalDistance:f.totalDistance,rivalDistance:f.rivalDistance,speed:f.speed,lap:f.lap,score:f.score,damage:f.damage,y:f.y,yVel:f.yVel,grounded:f.grounded,input:{steer:Ne.steer,throttle:Ne.throttle,brake:Ne.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:l.x,y:l.y,z:l.z}}}const Zi={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},Zs=[28,54,82,110,134,156];function Y1(){const i=Math.abs(f.speed);let e=1;for(let o=0;o<Zs.length;o++)i>Zs[o]&&(e=o+2);e=Math.min(e,Zs.length);const t=e===1?0:Zs[e-2],n=Zs[e-1],s=n>t?Be.clamp((i-t)/(n-t),0,1):0,r=e===1?Zi.idle:Zi.postShift;let a=r+s*(Zi.shift-r);return i<.4&&(a=Zi.idle),{gear:e,rpm:a}}let vh=performance.now(),go=0,vo=0;function Nd(i){const e=i.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),n=i.clientWidth||120,s=i.clientHeight||70;(i.width!==Math.round(n*t)||i.height!==Math.round(s*t))&&(i.width=Math.round(n*t),i.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,n,s);const r=n/2,a=s-s*.14,o=Math.min(n*.46,s*.9);return{ctx:e,w:n,h:s,cx:r,cy:a,R:o,aFor:d=>Math.PI-d*Math.PI,at:(d,u)=>[r+Math.cos(d)*u,a-Math.sin(d)*u]}}function q1(i,e){const t=et.speedo;if(!t)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=Nd(t),l=360;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke(),n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let g=0;g<=l;g+=20){const _=g/l,x=o(_),h=g%80===0;n.strokeStyle="rgba(180, 230, 255, 0.85)",n.lineWidth=h?Math.max(1.4,a*.035):Math.max(1,a*.02);const M=c(x,a-a*.02),v=c(x,a-a*(h?.18:.1));if(n.beginPath(),n.moveTo(M[0],M[1]),n.lineTo(v[0],v[1]),n.stroke(),h){const y=c(x,a-a*.34);n.fillStyle="#cfeeff",n.fillText(String(g/10),y[0],y[1])}}const d=Be.clamp(i/l,0,1),u=o(d),p=c(u,a-a*.06),m=c(u+Math.PI,a*.14);n.strokeStyle="#7df1ff",n.shadowColor="rgba(80, 220, 255, 0.9)",n.shadowBlur=a*.18,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(m[0],m[1]),n.lineTo(p[0],p[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("MPH",s,r-a*.26),n.fillStyle=e?"#ff8077":"#f2f8ff",n.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,n.fillText(e?`-${Math.round(i)}`:String(Math.round(i)),s,r+a*.02)}function Z1(i,e){const t=et.boostGauge;if(!t)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=Nd(t),l=18;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.3)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke();const d=Be.clamp(i,0,1),u=i<.25;n.strokeStyle=u?"#ff5436":e?"#ffb53a":"#46e0b0",n.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",n.shadowBlur=e?a*.25:a*.1,n.lineWidth=Math.max(2,a*.07),n.beginPath(),n.arc(s,r,a,o(d),o(0)),n.stroke(),n.shadowBlur=0,n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let _=0;_<=l;_+=3){const x=_/l,h=o(x),M=_%6===0;n.strokeStyle=_>=l*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",n.lineWidth=M?Math.max(1.3,a*.03):Math.max(1,a*.018);const v=c(h,a-a*.02),y=c(h,a-a*(M?.17:.1));if(n.beginPath(),n.moveTo(v[0],v[1]),n.lineTo(y[0],y[1]),n.stroke(),M){const E=c(h,a-a*.33);n.fillStyle="#cfeeff",n.fillText(String(_),E[0],E[1])}}const p=o(d),m=c(p,a-a*.06),g=c(p+Math.PI,a*.14);n.strokeStyle=u?"#ff5436":"#ffd23f",n.shadowColor="rgba(255, 200, 60, 0.8)",n.shadowBlur=a*.16,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(g[0],g[1]),n.lineTo(m[0],m[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("BOOST psi",s,r-a*.26),e&&(n.fillStyle="#ffce4a",n.shadowColor="rgba(255, 190, 60, 0.95)",n.shadowBlur=a*.3,n.beginPath(),n.arc(s,r+a*.02,a*.07,0,Math.PI*2),n.fill(),n.shadowBlur=0)}function $1(i,e){const t=et.tach;if(!t)return;const n=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=t.clientWidth||160,a=t.clientHeight||70;(t.width!==Math.round(r*s)||t.height!==Math.round(a*s))&&(t.width=Math.round(r*s),t.height=Math.round(a*s)),n.setTransform(s,0,0,s,0,0),n.clearRect(0,0,r,a);const o=r/2,c=a-a*.14,l=Math.min(r*.46,a*.9),d=Zi.max,u=v=>Math.PI-v*Math.PI,p=(v,y)=>[o+Math.cos(v)*y,c-Math.sin(v)*y];n.lineCap="round",n.lineWidth=Math.max(2,l*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(o,c,l,u(1),u(0)),n.stroke();const m=Zi.redline/d;n.strokeStyle="#ff3b30",n.beginPath(),n.arc(o,c,l,u(1),u(m)),n.stroke(),n.font=`700 ${Math.max(7,l*.17)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let v=0;v<=9;v++){const y=v/9,E=u(y),T=v*1e3>=Zi.redline;n.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",n.lineWidth=Math.max(1.4,l*.035);const R=p(E,l-l*.02),C=p(E,l-l*.18);n.beginPath(),n.moveTo(R[0],R[1]),n.lineTo(C[0],C[1]),n.stroke();const b=p(E,l-l*.34);if(n.fillStyle=T?"#ff8077":"#cfeeff",n.fillText(String(v),b[0],b[1]),v<9){const S=u((v+.5)/9),L=p(S,l-l*.02),U=p(S,l-l*.1);n.strokeStyle="rgba(150, 210, 255, 0.5)",n.lineWidth=Math.max(1,l*.02),n.beginPath(),n.moveTo(L[0],L[1]),n.lineTo(U[0],U[1]),n.stroke()}}const g=Be.clamp(i/d,0,1),_=u(g),x=p(_,l-l*.06),h=p(_+Math.PI,l*.14);n.strokeStyle="#ffdd48",n.shadowColor="rgba(255, 200, 60, 0.9)",n.shadowBlur=l*.18,n.lineWidth=Math.max(1.8,l*.05),n.beginPath(),n.moveTo(h[0],h[1]),n.lineTo(x[0],x[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,l*.03),n.beginPath(),n.arc(o,c,l*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,l*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("x1000 r/min",o,c-l*.26);const M=f.speed<-.5?"R":String(e);n.fillStyle="#f2f8ff",n.font=`800 ${Math.max(9,l*.22)}px "Courier New", monospace`,n.fillText(M,o,c+l*.02)}function or(){oe.length*oe.laps;const i=oh(f.practice?f.totalDistance%oe.length:f.totalDistance),e=f.practice?0:oh(f.rivalDistance),t=f.practice?"SOLO":f.totalDistance>=f.rivalDistance?"P1":"P2";t!==f.leadState&&f.mode==="race"&&(f.leadState=t,f.practice||(f.message=t==="P1"?"You took the lead":"Crowther ahead",f.messageTimer=.95)),et.damage.style.width=`${Math.round(f.damage)}%`,et.lap.textContent=f.practice?`LAP ${f.lap}`:`${Math.min(f.lap,oe.laps)}/${oe.laps}`,et.timer.textContent=mc(f.time);const n=f.mode==="roam";et.score.textContent=n?`Gates ${f.objectiveHits}/${en.length}  Score ${Math.round(f.score)}`:`Score ${Math.round(f.score)}`;const s=f.mode==="race"||f.mode==="paused"||n;if(et.position.textContent=n?"FREE ROAM":f.freeRun?"FREE RUN":f.practice?"PRACTICE":`${t} DIV 4`,n&&en.length){const d=en[f.objectiveIndex%en.length];et.trackName.textContent=d?`Next: ${d.label}`:"City Streets"}et.hud.style.display=s?"flex":"none",et.raceStrip.style.display=f.mode==="race"||f.mode==="paused"?"grid":"none",et.touchControls.style.display=s?"":"none",et.playerProgress.style.width=`${Math.round(i*100)}%`,et.rivalProgress.style.width=`${Math.round(e*100)}%`;const r=Y1();f.gear=r.gear;const a=performance.now(),o=Math.min(.05,(a-vh)/1e3);vh=a;const c=1-Math.exp(-o*(r.rpm>f.tachRpm?10:6));f.tachRpm+=(r.rpm-f.tachRpm)*c,$1(f.tachRpm,r.gear);const l=Math.abs(f.speed)*2.25;go+=(l-go)*(1-Math.exp(-o*8)),vo+=(f.boost-vo)*(1-Math.exp(-o*9)),q1(go,f.speed<-.5),Z1(vo,f.boosting),et.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(f.speed)-44)/150)),et.damageFx.style.opacity=f.damage<18?0:Math.min(.72,(f.damage-18)/82),f.mode==="paused"?(et.centerMessage.textContent="Paused",et.centerMessage.classList.remove("hidden")):f.messageTimer>0?(et.centerMessage.textContent=f.message,et.centerMessage.classList.remove("hidden")):et.centerMessage.classList.add("hidden")}function mc(i){const e=Math.floor(i/60),t=i-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}function Od(){const i=Zg.getDelta(),e=Math.min(.033,i);f.messageTimer>0&&(f.messageTimer-=e),f.mode==="roam"?(Rd(e),Id(e)):(Fd(e),X1(e),Zc(e)),U1(e),_d(e),or(),F1(),js.uniforms.uTime.value+=e,js.uniforms.uSpeed.value=Math.min(1,Math.abs(f.speed)/150);const n=(_t.has("ShiftLeft")||_t.has("ShiftRight"))&&f.boost>.02&&(f.mode==="race"||f.mode==="roam")?1:Math.min(.75,f.roamSlip*.55+f.collisionDrama*.6);js.uniforms.uBoost.value+=(n-js.uniforms.uBoost.value)*Math.min(1,e*6),Os.render(),requestAnimationFrame(Od)}window.addEventListener("keydown",i=>{_t.add(i.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(i.code)&&i.preventDefault(),i.code==="KeyP"&&f.mode==="race"?(f.mode="paused",_t.clear(),_a()):i.code==="KeyP"&&f.mode==="paused"?f.mode="race":i.code==="Escape"&&(f.mode==="race"||f.mode==="paused"||f.mode==="roam")&&(f.mode="menu",_a(),on.visible=!1,Hn&&(Hn.visible=!0),document.body.classList.remove("roam-mode"),et.menu.classList.remove("hidden"))});window.addEventListener("keyup",i=>_t.delete(i.code));window.addEventListener("resize",()=>{Je.aspect=window.innerWidth/window.innerHeight,Je.updateProjectionMatrix(),Qt.setSize(window.innerWidth,window.innerHeight),Os.setSize(window.innerWidth,window.innerHeight),bd.setSize(window.innerWidth,window.innerHeight)});et.startBtn.addEventListener("click",()=>Aa(!1));et.practiceBtn.addEventListener("click",()=>Aa(!0));et.freeRunBtn.addEventListener("click",()=>Aa(!0,!0));et.roamBtn.addEventListener("click",()=>Ed());et.againBtn.addEventListener("click",()=>Aa(!1));et.courseButtons.forEach(i=>{i.addEventListener("click",()=>Xc(Number(i.dataset.course)))});function Bd(i){i&&(i.classList.remove("active"),i.style.setProperty("--stick-x","0px"),i.style.setProperty("--stick-y","0px"))}function _a(){Ne.steer=0,Ne.throttle=0,Ne.brake=0,Ne.lookX=0,Ne.lookY=0,Ne.zoom=0,Ne.lookPointer=null,Ne.drivePointer=null,Ne.pinchStartDistance=0,Ne.pinchStartZoom=0;for(const i of et.touchControls.querySelectorAll(".touch-stick"))Bd(i)}function ta(i,e){const t=i.getBoundingClientRect(),n=Math.min(t.width,t.height)*.36;if(!(n>0))return;const s=Be.clamp(e.clientX-(t.left+t.width/2),-n,n),r=Be.clamp(e.clientY-(t.top+t.height/2),-n,n),a=i.dataset.stick;if(i.classList.add("active"),a==="look")Ne.lookX=Be.clamp(s/n,-1,1),Ne.lookY=Be.clamp(-r/n,-1,1),i.style.setProperty("--stick-x",`${Math.round(Ne.lookX*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-Ne.lookY*n)}px`);else{const o=Be.clamp(s/n,-1,1),c=Be.clamp(-r/n,-1,1);Ne.steer=o,Ne.throttle=Math.max(0,c),Ne.brake=Math.max(0,-c),i.style.setProperty("--stick-x",`${Math.round(o*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-c*n)}px`)}}function _h(i,e){return Array.from(i.changedTouches).find(t=>t.identifier===e)}function Mh(i,e){e==="look"?(Ne.lookX=0,Ne.lookY=0,Ne.lookPointer=null):(Ne.steer=0,Ne.throttle=0,Ne.brake=0,Ne.drivePointer=null),Bd(i)}function K1(i,e){return Math.hypot(i.clientX-e.clientX,i.clientY-e.clientY)}function zd(i,e=!1){if(i.touches.length<2){Ne.pinchStartDistance=0;return}const t=K1(i.touches[0],i.touches[1]);if(e||!(Ne.pinchStartDistance>0)){Ne.pinchStartDistance=t,Ne.pinchStartZoom=Ne.zoom;return}const n=Math.max(.2,t/Ne.pinchStartDistance);Ne.zoom=Be.clamp(Ne.pinchStartZoom-Math.log(n)*1.15,-.42,.9)}for(const i of et.touchControls.querySelectorAll(".touch-stick")){const e=i.dataset.stick;i.addEventListener("pointerdown",s=>{s.preventDefault(),ga(),f.mode==="paused"&&(f.mode="race"),e==="look"&&(Ne.lookPointer=s.pointerId),e==="drive"&&(Ne.drivePointer=s.pointerId),ta(i,s)},{passive:!1}),i.addEventListener("pointermove",s=>{(e==="look"?Ne.lookPointer:Ne.drivePointer)===s.pointerId&&(s.preventDefault(),ta(i,s))},{passive:!1});const t=s=>{(e==="look"?Ne.lookPointer:Ne.drivePointer)===s.pointerId&&Mh(i,e)};i.addEventListener("pointerup",t),i.addEventListener("pointercancel",t),i.addEventListener("touchstart",s=>{s.preventDefault(),ga(),f.mode==="paused"&&(f.mode="race");const r=s.changedTouches[0];r&&(e==="look"&&(Ne.lookPointer=r.identifier),e==="drive"&&(Ne.drivePointer=r.identifier),ta(i,r))},{passive:!1}),i.addEventListener("touchmove",s=>{const r=e==="look"?Ne.lookPointer:Ne.drivePointer,a=_h(s,r);a&&(s.preventDefault(),ta(i,a))},{passive:!1});const n=s=>{const r=e==="look"?Ne.lookPointer:Ne.drivePointer;_h(s,r)&&(s.preventDefault(),Mh(i,e))};i.addEventListener("touchend",n,{passive:!1}),i.addEventListener("touchcancel",n,{passive:!1})}for(const i of et.touchControls.querySelectorAll("button")){const e=i.dataset.code;i.addEventListener("pointerdown",n=>{n.preventDefault(),ga(),_t.add(e),i.setPointerCapture(n.pointerId)});const t=()=>_t.delete(e);i.addEventListener("pointerup",t),i.addEventListener("pointercancel",t),i.addEventListener("lostpointercapture",t)}Mr.addEventListener("touchstart",i=>{i.touches.length>=2&&(i.preventDefault(),zd(i,!0))},{passive:!1});Mr.addEventListener("touchmove",i=>{i.touches.length>=2&&(i.preventDefault(),zd(i))},{passive:!1});Mr.addEventListener("touchend",i=>{i.touches.length<2&&(Ne.pinchStartDistance=0)},{passive:!1});Mr.addEventListener("touchcancel",()=>{Ne.pinchStartDistance=0},{passive:!1});const J1=bt(f.s);f.y=J1.p.y+2.1;f.lastSafeS=f.s;f.lastSafeDistance=f.totalDistance;Zc(.016);or();Od();
