(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const qo="181",xd=0,Ac=1,gd=2,eh=1,nh=2,ii=3,yi=0,nn=1,ue=2,qn=0,fs=1,Ui=2,Cc=3,Rc=4,_d=5,Di=100,vd=101,Md=102,Sd=103,yd=104,bd=200,wd=201,Td=202,Ed=203,Ka=204,Ja=205,Ad=206,Cd=207,Rd=208,Pd=209,Ld=210,Dd=211,Id=212,Ud=213,Nd=214,ja=0,Qa=1,to=2,gs=3,eo=4,no=5,io=6,so=7,Zo=0,Fd=1,Od=2,Mi=0,ih=1,sh=2,rh=3,$o=4,ah=5,oh=6,ch=7,lh=300,_s=301,vs=302,ro=303,ao=304,ia=306,rn=1e3,ri=1001,oo=1002,bn=1003,Bd=1004,dr=1005,An=1006,ua=1007,Ni=1008,$n=1009,hh=1010,dh=1011,js=1012,Ko=1013,Vi=1014,Xn=1015,Zn=1016,Jo=1017,jo=1018,Qs=1020,uh=35902,fh=35899,ph=1021,mh=1022,Nn=1023,tr=1026,er=1027,Qo=1028,tc=1029,ec=1030,nc=1031,ic=1033,Vr=33776,Gr=33777,Hr=33778,Wr=33779,co=35840,lo=35841,ho=35842,uo=35843,fo=36196,po=37492,mo=37496,xo=37808,go=37809,_o=37810,vo=37811,Mo=37812,So=37813,yo=37814,bo=37815,wo=37816,To=37817,Eo=37818,Ao=37819,Co=37820,Ro=37821,Po=36492,Lo=36494,Do=36495,Io=36283,Uo=36284,No=36285,Fo=36286,zd=3200,kd=3201,sc=0,Vd=1,_i="",we="srgb",Ms="srgb-linear",Kr="linear",ye="srgb",$i=7680,Pc=519,Gd=512,Hd=513,Wd=514,xh=515,Xd=516,Yd=517,qd=518,Zd=519,Lc=35044,Dc="300 es",Yn=2e3,Jr=2001;function gh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function jr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function $d(){const i=jr("canvas");return i.style.display="block",i}const Ic={};function Uc(...i){const t="THREE."+i.shift();console.log(t,...i)}function Qt(...i){const t="THREE."+i.shift();console.warn(t,...i)}function Be(...i){const t="THREE."+i.shift();console.error(t,...i)}function nr(...i){const t=i.join(" ");t in Ic||(Ic[t]=!0,Qt(...i))}function Kd(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}class ws{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Je=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Nc=1234567;const Ws=Math.PI/180,ir=180/Math.PI;function Wi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Je[i&255]+Je[i>>8&255]+Je[i>>16&255]+Je[i>>24&255]+"-"+Je[t&255]+Je[t>>8&255]+"-"+Je[t>>16&15|64]+Je[t>>24&255]+"-"+Je[e&63|128]+Je[e>>8&255]+"-"+Je[e>>16&255]+Je[e>>24&255]+Je[n&255]+Je[n>>8&255]+Je[n>>16&255]+Je[n>>24&255]).toLowerCase()}function oe(i,t,e){return Math.max(t,Math.min(e,i))}function rc(i,t){return(i%t+t)%t}function Jd(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function jd(i,t,e){return i!==t?(e-i)/(t-i):0}function Xs(i,t,e){return(1-e)*i+e*t}function Qd(i,t,e,n){return Xs(i,t,1-Math.exp(-e*n))}function tu(i,t=1){return t-Math.abs(rc(i,t*2)-t)}function eu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function nu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function iu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function su(i,t){return i+Math.random()*(t-i)}function ru(i){return i*(.5-Math.random())}function au(i){i!==void 0&&(Nc=i);let t=Nc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function ou(i){return i*Ws}function cu(i){return i*ir}function lu(i){return(i&i-1)===0&&i!==0}function hu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function du(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function uu(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),d=a((t+n)/2),u=r((t-n)/2),f=a((t-n)/2),m=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*d,c*u,c*f,o*l);break;case"YZY":i.set(c*f,o*d,c*u,o*l);break;case"ZXZ":i.set(c*u,c*f,o*d,o*l);break;case"XZX":i.set(o*d,c*g,c*m,o*l);break;case"YXY":i.set(c*m,o*d,c*g,o*l);break;case"ZYZ":i.set(c*g,c*m,o*d,o*l);break;default:Qt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ds(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function cn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const zt={DEG2RAD:Ws,RAD2DEG:ir,generateUUID:Wi,clamp:oe,euclideanModulo:rc,mapLinear:Jd,inverseLerp:jd,lerp:Xs,damp:Qd,pingpong:tu,smoothstep:eu,smootherstep:nu,randInt:iu,randFloat:su,randFloatSpread:ru,seededRandom:au,degToRad:ou,radToDeg:cu,isPowerOfTwo:lu,ceilPowerOfTwo:hu,floorPowerOfTwo:du,setQuaternionFromProperEuler:uu,normalize:cn,denormalize:ds};class wt{constructor(t=0,e=0){wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=oe(this.x,t.x,e.x),this.y=oe(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=oe(this.x,t,e),this.y=oe(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(oe(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(oe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ci{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],u=n[s+3],f=r[a+0],m=r[a+1],g=r[a+2],v=r[a+3];if(o<=0){t[e+0]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u;return}if(o>=1){t[e+0]=f,t[e+1]=m,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==f||l!==m||d!==g){let p=c*f+l*m+d*g+u*v;p<0&&(f=-f,m=-m,g=-g,v=-v,p=-p);let h=1-o;if(p<.9995){const S=Math.acos(p),_=Math.sin(S);h=Math.sin(h*S)/_,o=Math.sin(o*S)/_,c=c*h+f*o,l=l*h+m*o,d=d*h+g*o,u=u*h+v*o}else{c=c*h+f*o,l=l*h+m*o,d=d*h+g*o,u=u*h+v*o;const S=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=S,l*=S,d*=S,u*=S}}t[e]=c,t[e+1]=l,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],u=r[a],f=r[a+1],m=r[a+2],g=r[a+3];return t[e]=o*g+d*u+c*m-l*f,t[e+1]=c*g+d*f+l*u-o*m,t[e+2]=l*g+d*m+o*f-c*u,t[e+3]=d*g-o*u-c*f-l*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),u=o(r/2),f=c(n/2),m=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=f*d*u+l*m*g,this._y=l*m*u-f*d*g,this._z=l*d*g+f*m*u,this._w=l*d*u-f*m*g;break;case"YXZ":this._x=f*d*u+l*m*g,this._y=l*m*u-f*d*g,this._z=l*d*g-f*m*u,this._w=l*d*u+f*m*g;break;case"ZXY":this._x=f*d*u-l*m*g,this._y=l*m*u+f*d*g,this._z=l*d*g+f*m*u,this._w=l*d*u-f*m*g;break;case"ZYX":this._x=f*d*u-l*m*g,this._y=l*m*u+f*d*g,this._z=l*d*g-f*m*u,this._w=l*d*u+f*m*g;break;case"YZX":this._x=f*d*u+l*m*g,this._y=l*m*u+f*d*g,this._z=l*d*g-f*m*u,this._w=l*d*u-f*m*g;break;case"XZY":this._x=f*d*u-l*m*g,this._y=l*m*u-f*d*g,this._z=l*d*g+f*m*u,this._w=l*d*u+f*m*g;break;default:Qt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],d=e[6],u=e[10],f=n+o+u;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(d-c)*m,this._y=(r-l)*m,this._z=(a-s)*m}else if(n>o&&n>u){const m=2*Math.sqrt(1+n-o-u);this._w=(d-c)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+l)/m}else if(o>u){const m=2*Math.sqrt(1+o-n-u);this._w=(r-l)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+u-n-o);this._w=(a-s)/m,this._x=(r+l)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(oe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,d=e._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e<=0)return this;if(e>=1)return this.copy(t);let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-e;if(o<.9995){const l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,e=Math.sin(e*l)/d,this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this._onChangeCallback()}else this._x=this._x*c+n*e,this._y=this._y*c+s*e,this._z=this._z*c+r*e,this._w=this._w*c+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(t=0,e=0,n=0){U.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Fc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Fc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),d=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+c*l+a*u-o*d,this.y=n+c*d+o*l-r*u,this.z=s+c*u+r*d-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=oe(this.x,t.x,e.x),this.y=oe(this.y,t.y,e.y),this.z=oe(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=oe(this.x,t,e),this.y=oe(this.y,t,e),this.z=oe(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(oe(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return fa.copy(this).projectOnVector(t),this.sub(fa)}reflect(t){return this.sub(fa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(oe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fa=new U,Fc=new ci;class ne{constructor(t,e,n,s,r,a,o,c,l){ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){const d=this.elements;return d[0]=t,d[1]=s,d[2]=o,d[3]=e,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],u=n[7],f=n[2],m=n[5],g=n[8],v=s[0],p=s[3],h=s[6],S=s[1],_=s[4],y=s[7],E=s[2],w=s[5],R=s[8];return r[0]=a*v+o*S+c*E,r[3]=a*p+o*_+c*w,r[6]=a*h+o*y+c*R,r[1]=l*v+d*S+u*E,r[4]=l*p+d*_+u*w,r[7]=l*h+d*y+u*R,r[2]=f*v+m*S+g*E,r[5]=f*p+m*_+g*w,r[8]=f*h+m*y+g*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8];return e*a*d-e*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],u=d*a-o*l,f=o*c-d*r,m=l*r-a*c,g=e*u+n*f+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*l-d*n)*v,t[2]=(o*n-s*a)*v,t[3]=f*v,t[4]=(d*e-s*c)*v,t[5]=(s*r-o*e)*v,t[6]=m*v,t[7]=(n*c-l*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(pa.makeScale(t,e)),this}rotate(t){return this.premultiply(pa.makeRotation(-t)),this}translate(t,e){return this.premultiply(pa.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const pa=new ne,Oc=new ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bc=new ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function fu(){const i={enabled:!0,workingColorSpace:Ms,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ye&&(s.r=ai(s.r),s.g=ai(s.g),s.b=ai(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ye&&(s.r=ps(s.r),s.g=ps(s.g),s.b=ps(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===_i?Kr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return nr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return nr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ms]:{primaries:t,whitePoint:n,transfer:Kr,toXYZ:Oc,fromXYZ:Bc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:we},outputColorSpaceConfig:{drawingBufferColorSpace:we}},[we]:{primaries:t,whitePoint:n,transfer:ye,toXYZ:Oc,fromXYZ:Bc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:we}}}),i}const me=fu();function ai(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ps(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ki;class pu{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ki===void 0&&(Ki=jr("canvas")),Ki.width=t.width,Ki.height=t.height;const s=Ki.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ki}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=jr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ai(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ai(e[n]/255)*255):e[n]=ai(e[n]);return{data:e,width:t.width,height:t.height}}else return Qt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let mu=0;class ac{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:mu++}),this.uuid=Wi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ma(s[a].image)):r.push(ma(s[a]))}else r=ma(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ma(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?pu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Qt("Texture: Unable to serialize Texture."),{})}let xu=0;const xa=new U;class sn extends ws{constructor(t=sn.DEFAULT_IMAGE,e=sn.DEFAULT_MAPPING,n=ri,s=ri,r=An,a=Ni,o=Nn,c=$n,l=sn.DEFAULT_ANISOTROPY,d=_i){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xu++}),this.uuid=Wi(),this.name="",this.source=new ac(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new wt(0,0),this.repeat=new wt(1,1),this.center=new wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(xa).x}get height(){return this.source.getSize(xa).y}get depth(){return this.source.getSize(xa).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Qt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Qt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==lh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case rn:t.x=t.x-Math.floor(t.x);break;case ri:t.x=t.x<0?0:1;break;case oo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case rn:t.y=t.y-Math.floor(t.y);break;case ri:t.y=t.y<0?0:1;break;case oo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}sn.DEFAULT_IMAGE=null;sn.DEFAULT_MAPPING=lh;sn.DEFAULT_ANISOTROPY=1;class Ee{constructor(t=0,e=0,n=0,s=1){Ee.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],d=c[4],u=c[8],f=c[1],m=c[5],g=c[9],v=c[2],p=c[6],h=c[10];if(Math.abs(d-f)<.01&&Math.abs(u-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(d+f)<.1&&Math.abs(u+v)<.1&&Math.abs(g+p)<.1&&Math.abs(l+m+h-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(l+1)/2,y=(m+1)/2,E=(h+1)/2,w=(d+f)/4,R=(u+v)/4,P=(g+p)/4;return _>y&&_>E?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=w/n,r=R/n):y>E?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=w/s,r=P/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=R/r,s=P/r),this.set(n,s,r,e),this}let S=Math.sqrt((p-g)*(p-g)+(u-v)*(u-v)+(f-d)*(f-d));return Math.abs(S)<.001&&(S=1),this.x=(p-g)/S,this.y=(u-v)/S,this.z=(f-d)/S,this.w=Math.acos((l+m+h-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=oe(this.x,t.x,e.x),this.y=oe(this.y,t.y,e.y),this.z=oe(this.z,t.z,e.z),this.w=oe(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=oe(this.x,t,e),this.y=oe(this.y,t,e),this.z=oe(this.z,t,e),this.w=oe(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(oe(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class gu extends ws{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:An,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Ee(0,0,t,e),this.scissorTest=!1,this.viewport=new Ee(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new sn(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:An,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new ac(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fn extends gu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class _h extends sn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=bn,this.minFilter=bn,this.wrapR=ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class _u extends sn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=bn,this.minFilter=bn,this.wrapR=ri,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Xi{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Cn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Cn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Cn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Cn):Cn.fromBufferAttribute(r,a),Cn.applyMatrix4(t.matrixWorld),this.expandByPoint(Cn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ur.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ur.copy(n.boundingBox)),ur.applyMatrix4(t.matrixWorld),this.union(ur)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Cn),Cn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ps),fr.subVectors(this.max,Ps),Ji.subVectors(t.a,Ps),ji.subVectors(t.b,Ps),Qi.subVectors(t.c,Ps),ui.subVectors(ji,Ji),fi.subVectors(Qi,ji),wi.subVectors(Ji,Qi);let e=[0,-ui.z,ui.y,0,-fi.z,fi.y,0,-wi.z,wi.y,ui.z,0,-ui.x,fi.z,0,-fi.x,wi.z,0,-wi.x,-ui.y,ui.x,0,-fi.y,fi.x,0,-wi.y,wi.x,0];return!ga(e,Ji,ji,Qi,fr)||(e=[1,0,0,0,1,0,0,0,1],!ga(e,Ji,ji,Qi,fr))?!1:(pr.crossVectors(ui,fi),e=[pr.x,pr.y,pr.z],ga(e,Ji,ji,Qi,fr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Cn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Cn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Jn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Jn=[new U,new U,new U,new U,new U,new U,new U,new U],Cn=new U,ur=new Xi,Ji=new U,ji=new U,Qi=new U,ui=new U,fi=new U,wi=new U,Ps=new U,fr=new U,pr=new U,Ti=new U;function ga(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ti.fromArray(i,r);const o=s.x*Math.abs(Ti.x)+s.y*Math.abs(Ti.y)+s.z*Math.abs(Ti.z),c=t.dot(Ti),l=e.dot(Ti),d=n.dot(Ti);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const vu=new Xi,Ls=new U,_a=new U;class Ts{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):vu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ls.subVectors(t,this.center);const e=Ls.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ls,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(_a.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ls.copy(t.center).add(_a)),this.expandByPoint(Ls.copy(t.center).sub(_a))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const jn=new U,va=new U,mr=new U,pi=new U,Ma=new U,xr=new U,Sa=new U;class oc{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,jn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=jn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(jn.copy(this.origin).addScaledVector(this.direction,e),jn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){va.copy(t).add(e).multiplyScalar(.5),mr.copy(e).sub(t).normalize(),pi.copy(this.origin).sub(va);const r=t.distanceTo(e)*.5,a=-this.direction.dot(mr),o=pi.dot(this.direction),c=-pi.dot(mr),l=pi.lengthSq(),d=Math.abs(1-a*a);let u,f,m,g;if(d>0)if(u=a*c-o,f=a*o-c,g=r*d,u>=0)if(f>=-g)if(f<=g){const v=1/d;u*=v,f*=v,m=u*(u+a*f+2*o)+f*(a*u+f+2*c)+l}else f=r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),m=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),m=f*(f+2*c)+l):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),m=-u*u+f*(f+2*c)+l);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(va).addScaledVector(mr,f),m}intersectSphere(t,e){jn.subVectors(t.center,this.origin);const n=jn.dot(this.direction),s=jn.dot(jn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),d>=0?(r=(t.min.y-f.y)*d,a=(t.max.y-f.y)*d):(r=(t.max.y-f.y)*d,a=(t.min.y-f.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,jn)!==null}intersectTriangle(t,e,n,s,r){Ma.subVectors(e,t),xr.subVectors(n,t),Sa.crossVectors(Ma,xr);let a=this.direction.dot(Sa),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;pi.subVectors(this.origin,t);const c=o*this.direction.dot(xr.crossVectors(pi,xr));if(c<0)return null;const l=o*this.direction.dot(Ma.cross(pi));if(l<0||c+l>a)return null;const d=-o*pi.dot(Sa);return d<0?null:this.at(d/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class _e{constructor(t,e,n,s,r,a,o,c,l,d,u,f,m,g,v,p){_e.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,d,u,f,m,g,v,p)}set(t,e,n,s,r,a,o,c,l,d,u,f,m,g,v,p){const h=this.elements;return h[0]=t,h[4]=e,h[8]=n,h[12]=s,h[1]=r,h[5]=a,h[9]=o,h[13]=c,h[2]=l,h[6]=d,h[10]=u,h[14]=f,h[3]=m,h[7]=g,h[11]=v,h[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _e().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/ts.setFromMatrixColumn(t,0).length(),r=1/ts.setFromMatrixColumn(t,1).length(),a=1/ts.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*d,m=a*u,g=o*d,v=o*u;e[0]=c*d,e[4]=-c*u,e[8]=l,e[1]=m+g*l,e[5]=f-v*l,e[9]=-o*c,e[2]=v-f*l,e[6]=g+m*l,e[10]=a*c}else if(t.order==="YXZ"){const f=c*d,m=c*u,g=l*d,v=l*u;e[0]=f+v*o,e[4]=g*o-m,e[8]=a*l,e[1]=a*u,e[5]=a*d,e[9]=-o,e[2]=m*o-g,e[6]=v+f*o,e[10]=a*c}else if(t.order==="ZXY"){const f=c*d,m=c*u,g=l*d,v=l*u;e[0]=f-v*o,e[4]=-a*u,e[8]=g+m*o,e[1]=m+g*o,e[5]=a*d,e[9]=v-f*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const f=a*d,m=a*u,g=o*d,v=o*u;e[0]=c*d,e[4]=g*l-m,e[8]=f*l+v,e[1]=c*u,e[5]=v*l+f,e[9]=m*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,m=a*l,g=o*c,v=o*l;e[0]=c*d,e[4]=v-f*u,e[8]=g*u+m,e[1]=u,e[5]=a*d,e[9]=-o*d,e[2]=-l*d,e[6]=m*u+g,e[10]=f-v*u}else if(t.order==="XZY"){const f=a*c,m=a*l,g=o*c,v=o*l;e[0]=c*d,e[4]=-u,e[8]=l*d,e[1]=f*u+v,e[5]=a*d,e[9]=m*u-g,e[2]=g*u-m,e[6]=o*d,e[10]=v*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Mu,t,Su)}lookAt(t,e,n){const s=this.elements;return Mn.subVectors(t,e),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),mi.crossVectors(n,Mn),mi.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),mi.crossVectors(n,Mn)),mi.normalize(),gr.crossVectors(Mn,mi),s[0]=mi.x,s[4]=gr.x,s[8]=Mn.x,s[1]=mi.y,s[5]=gr.y,s[9]=Mn.y,s[2]=mi.z,s[6]=gr.z,s[10]=Mn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],u=n[5],f=n[9],m=n[13],g=n[2],v=n[6],p=n[10],h=n[14],S=n[3],_=n[7],y=n[11],E=n[15],w=s[0],R=s[4],P=s[8],b=s[12],M=s[1],A=s[5],I=s[9],B=s[13],Y=s[2],q=s[6],Z=s[10],ct=s[14],nt=s[3],mt=s[7],_t=s[11],N=s[15];return r[0]=a*w+o*M+c*Y+l*nt,r[4]=a*R+o*A+c*q+l*mt,r[8]=a*P+o*I+c*Z+l*_t,r[12]=a*b+o*B+c*ct+l*N,r[1]=d*w+u*M+f*Y+m*nt,r[5]=d*R+u*A+f*q+m*mt,r[9]=d*P+u*I+f*Z+m*_t,r[13]=d*b+u*B+f*ct+m*N,r[2]=g*w+v*M+p*Y+h*nt,r[6]=g*R+v*A+p*q+h*mt,r[10]=g*P+v*I+p*Z+h*_t,r[14]=g*b+v*B+p*ct+h*N,r[3]=S*w+_*M+y*Y+E*nt,r[7]=S*R+_*A+y*q+E*mt,r[11]=S*P+_*I+y*Z+E*_t,r[15]=S*b+_*B+y*ct+E*N,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],d=t[2],u=t[6],f=t[10],m=t[14],g=t[3],v=t[7],p=t[11],h=t[15];return g*(+r*c*u-s*l*u-r*o*f+n*l*f+s*o*m-n*c*m)+v*(+e*c*m-e*l*f+r*a*f-s*a*m+s*l*d-r*c*d)+p*(+e*l*u-e*o*m-r*a*u+n*a*m+r*o*d-n*l*d)+h*(-s*o*d-e*c*u+e*o*f+s*a*u-n*a*f+n*c*d)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],d=t[8],u=t[9],f=t[10],m=t[11],g=t[12],v=t[13],p=t[14],h=t[15],S=u*p*l-v*f*l+v*c*m-o*p*m-u*c*h+o*f*h,_=g*f*l-d*p*l-g*c*m+a*p*m+d*c*h-a*f*h,y=d*v*l-g*u*l+g*o*m-a*v*m-d*o*h+a*u*h,E=g*u*c-d*v*c-g*o*f+a*v*f+d*o*p-a*u*p,w=e*S+n*_+s*y+r*E;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/w;return t[0]=S*R,t[1]=(v*f*r-u*p*r-v*s*m+n*p*m+u*s*h-n*f*h)*R,t[2]=(o*p*r-v*c*r+v*s*l-n*p*l-o*s*h+n*c*h)*R,t[3]=(u*c*r-o*f*r-u*s*l+n*f*l+o*s*m-n*c*m)*R,t[4]=_*R,t[5]=(d*p*r-g*f*r+g*s*m-e*p*m-d*s*h+e*f*h)*R,t[6]=(g*c*r-a*p*r-g*s*l+e*p*l+a*s*h-e*c*h)*R,t[7]=(a*f*r-d*c*r+d*s*l-e*f*l-a*s*m+e*c*m)*R,t[8]=y*R,t[9]=(g*u*r-d*v*r-g*n*m+e*v*m+d*n*h-e*u*h)*R,t[10]=(a*v*r-g*o*r+g*n*l-e*v*l-a*n*h+e*o*h)*R,t[11]=(d*o*r-a*u*r-d*n*l+e*u*l+a*n*m-e*o*m)*R,t[12]=E*R,t[13]=(d*v*s-g*u*s+g*n*f-e*v*f-d*n*p+e*u*p)*R,t[14]=(g*o*s-a*v*s-g*n*c+e*v*c+a*n*p-e*o*p)*R,t[15]=(a*u*s-d*o*s+d*n*c-e*u*c-a*n*f+e*o*f)*R,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,d=a+a,u=o+o,f=r*l,m=r*d,g=r*u,v=a*d,p=a*u,h=o*u,S=c*l,_=c*d,y=c*u,E=n.x,w=n.y,R=n.z;return s[0]=(1-(v+h))*E,s[1]=(m+y)*E,s[2]=(g-_)*E,s[3]=0,s[4]=(m-y)*w,s[5]=(1-(f+h))*w,s[6]=(p+S)*w,s[7]=0,s[8]=(g+_)*R,s[9]=(p-S)*R,s[10]=(1-(f+v))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=ts.set(s[0],s[1],s[2]).length();const a=ts.set(s[4],s[5],s[6]).length(),o=ts.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Rn.copy(this);const l=1/r,d=1/a,u=1/o;return Rn.elements[0]*=l,Rn.elements[1]*=l,Rn.elements[2]*=l,Rn.elements[4]*=d,Rn.elements[5]*=d,Rn.elements[6]*=d,Rn.elements[8]*=u,Rn.elements[9]*=u,Rn.elements[10]*=u,e.setFromRotationMatrix(Rn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Yn,c=!1){const l=this.elements,d=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),m=(n+s)/(n-s);let g,v;if(c)g=r/(a-r),v=a*r/(a-r);else if(o===Yn)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Jr)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Yn,c=!1){const l=this.elements,d=2/(e-t),u=2/(n-s),f=-(e+t)/(e-t),m=-(n+s)/(n-s);let g,v;if(c)g=1/(a-r),v=a/(a-r);else if(o===Yn)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===Jr)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=m,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ts=new U,Rn=new _e,Mu=new U(0,0,0),Su=new U(1,1,1),mi=new U,gr=new U,Mn=new U,zc=new _e,kc=new ci;class zn{constructor(t=0,e=0,n=0,s=zn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],u=s[2],f=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(oe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-oe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(oe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-oe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(oe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-oe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:Qt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return zc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(zc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return kc.setFromEuler(this),this.setFromQuaternion(kc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}zn.DEFAULT_ORDER="XYZ";class cc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let yu=0;const Vc=new U,es=new ci,Qn=new _e,_r=new U,Ds=new U,bu=new U,wu=new ci,Gc=new U(1,0,0),Hc=new U(0,1,0),Wc=new U(0,0,1),Xc={type:"added"},Tu={type:"removed"},ns={type:"childadded",child:null},ya={type:"childremoved",child:null};class ze extends ws{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:yu++}),this.uuid=Wi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ze.DEFAULT_UP.clone();const t=new U,e=new zn,n=new ci,s=new U(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new _e},normalMatrix:{value:new ne}}),this.matrix=new _e,this.matrixWorld=new _e,this.matrixAutoUpdate=ze.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new cc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return es.setFromAxisAngle(t,e),this.quaternion.multiply(es),this}rotateOnWorldAxis(t,e){return es.setFromAxisAngle(t,e),this.quaternion.premultiply(es),this}rotateX(t){return this.rotateOnAxis(Gc,t)}rotateY(t){return this.rotateOnAxis(Hc,t)}rotateZ(t){return this.rotateOnAxis(Wc,t)}translateOnAxis(t,e){return Vc.copy(t).applyQuaternion(this.quaternion),this.position.add(Vc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Gc,t)}translateY(t){return this.translateOnAxis(Hc,t)}translateZ(t){return this.translateOnAxis(Wc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Qn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?_r.copy(t):_r.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ds.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Qn.lookAt(Ds,_r,this.up):Qn.lookAt(_r,Ds,this.up),this.quaternion.setFromRotationMatrix(Qn),s&&(Qn.extractRotation(s.matrixWorld),es.setFromRotationMatrix(Qn),this.quaternion.premultiply(es.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Be("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Xc),ns.child=t,this.dispatchEvent(ns),ns.child=null):Be("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Tu),ya.child=t,this.dispatchEvent(ya),ya.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Qn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Qn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Qn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Xc),ns.child=t,this.dispatchEvent(ns),ns.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ds,t,bu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ds,wu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),d=a(t.images),u=a(t.shapes),f=a(t.skeletons),m=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ze.DEFAULT_UP=new U(0,1,0);ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Pn=new U,ti=new U,ba=new U,ei=new U,is=new U,ss=new U,Yc=new U,wa=new U,Ta=new U,Ea=new U,Aa=new Ee,Ca=new Ee,Ra=new Ee;class Un{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Pn.subVectors(t,e),s.cross(Pn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Pn.subVectors(s,e),ti.subVectors(n,e),ba.subVectors(t,e);const a=Pn.dot(Pn),o=Pn.dot(ti),c=Pn.dot(ba),l=ti.dot(ti),d=ti.dot(ba),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,m=(l*c-o*d)*f,g=(a*d-o*c)*f;return r.set(1-m-g,g,m)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,ei)===null?!1:ei.x>=0&&ei.y>=0&&ei.x+ei.y<=1}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,ei)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ei.x),c.addScaledVector(a,ei.y),c.addScaledVector(o,ei.z),c)}static getInterpolatedAttribute(t,e,n,s,r,a){return Aa.setScalar(0),Ca.setScalar(0),Ra.setScalar(0),Aa.fromBufferAttribute(t,e),Ca.fromBufferAttribute(t,n),Ra.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(Aa,r.x),a.addScaledVector(Ca,r.y),a.addScaledVector(Ra,r.z),a}static isFrontFacing(t,e,n,s){return Pn.subVectors(n,e),ti.subVectors(t,e),Pn.cross(ti).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Pn.subVectors(this.c,this.b),ti.subVectors(this.a,this.b),Pn.cross(ti).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Un.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Un.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Un.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Un.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Un.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;is.subVectors(s,n),ss.subVectors(r,n),wa.subVectors(t,n);const c=is.dot(wa),l=ss.dot(wa);if(c<=0&&l<=0)return e.copy(n);Ta.subVectors(t,s);const d=is.dot(Ta),u=ss.dot(Ta);if(d>=0&&u<=d)return e.copy(s);const f=c*u-d*l;if(f<=0&&c>=0&&d<=0)return a=c/(c-d),e.copy(n).addScaledVector(is,a);Ea.subVectors(t,r);const m=is.dot(Ea),g=ss.dot(Ea);if(g>=0&&m<=g)return e.copy(r);const v=m*l-c*g;if(v<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(ss,o);const p=d*g-m*u;if(p<=0&&u-d>=0&&m-g>=0)return Yc.subVectors(r,s),o=(u-d)/(u-d+(m-g)),e.copy(s).addScaledVector(Yc,o);const h=1/(p+v+f);return a=v*h,o=f*h,e.copy(n).addScaledVector(is,a).addScaledVector(ss,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const vh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},xi={h:0,s:0,l:0},vr={h:0,s:0,l:0};function Pa(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Zt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=we){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,me.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=me.workingColorSpace){return this.r=t,this.g=e,this.b=n,me.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=me.workingColorSpace){if(t=rc(t,1),e=oe(e,0,1),n=oe(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Pa(a,r,t+1/3),this.g=Pa(a,r,t),this.b=Pa(a,r,t-1/3)}return me.colorSpaceToWorking(this,s),this}setStyle(t,e=we){function n(r){r!==void 0&&parseFloat(r)<1&&Qt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Qt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Qt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=we){const n=vh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Qt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ai(t.r),this.g=ai(t.g),this.b=ai(t.b),this}copyLinearToSRGB(t){return this.r=ps(t.r),this.g=ps(t.g),this.b=ps(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=we){return me.workingToColorSpace(je.copy(this),t),Math.round(oe(je.r*255,0,255))*65536+Math.round(oe(je.g*255,0,255))*256+Math.round(oe(je.b*255,0,255))}getHexString(t=we){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=me.workingColorSpace){me.workingToColorSpace(je.copy(this),e);const n=je.r,s=je.g,r=je.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=d<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=d,t}getRGB(t,e=me.workingColorSpace){return me.workingToColorSpace(je.copy(this),e),t.r=je.r,t.g=je.g,t.b=je.b,t}getStyle(t=we){me.workingToColorSpace(je.copy(this),t);const e=je.r,n=je.g,s=je.b;return t!==we?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(xi),this.setHSL(xi.h+t,xi.s+e,xi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(xi),t.getHSL(vr);const n=Xs(xi.h,vr.h,e),s=Xs(xi.s,vr.s,e),r=Xs(xi.l,vr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const je=new Zt;Zt.NAMES=vh;let Eu=0;class Yi extends ws{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Eu++}),this.uuid=Wi(),this.name="",this.type="Material",this.blending=fs,this.side=yi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ka,this.blendDst=Ja,this.blendEquation=Di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Zt(0,0,0),this.blendAlpha=0,this.depthFunc=gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Pc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=$i,this.stencilZFail=$i,this.stencilZPass=$i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Qt(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Qt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==fs&&(n.blending=this.blending),this.side!==yi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ka&&(n.blendSrc=this.blendSrc),this.blendDst!==Ja&&(n.blendDst=this.blendDst),this.blendEquation!==Di&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==gs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Pc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==$i&&(n.stencilFail=this.stencilFail),this.stencilZFail!==$i&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==$i&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Te extends Yi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=Zo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ge=new U,Mr=new wt;let Au=0;class On{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Au++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Lc,this.updateRanges=[],this.gpuType=Xn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Mr.fromBufferAttribute(this,e),Mr.applyMatrix3(t),this.setXY(e,Mr.x,Mr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ge.fromBufferAttribute(this,e),Ge.applyMatrix3(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ge.fromBufferAttribute(this,e),Ge.applyMatrix4(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ge.fromBufferAttribute(this,e),Ge.applyNormalMatrix(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ge.fromBufferAttribute(this,e),Ge.transformDirection(t),this.setXYZ(e,Ge.x,Ge.y,Ge.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ds(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=cn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ds(e,this.array)),e}setX(t,e){return this.normalized&&(e=cn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ds(e,this.array)),e}setY(t,e){return this.normalized&&(e=cn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ds(e,this.array)),e}setZ(t,e){return this.normalized&&(e=cn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ds(e,this.array)),e}setW(t,e){return this.normalized&&(e=cn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=cn(e,this.array),n=cn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=cn(e,this.array),n=cn(n,this.array),s=cn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=cn(e,this.array),n=cn(n,this.array),s=cn(s,this.array),r=cn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Lc&&(t.usage=this.usage),t}}class Mh extends On{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Sh extends On{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class pe extends On{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Cu=0;const En=new _e,La=new ze,rs=new U,Sn=new Xi,Is=new Xi,qe=new U;class ke extends ws{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Cu++}),this.uuid=Wi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(gh(t)?Sh:Mh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ne().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return En.makeRotationFromQuaternion(t),this.applyMatrix4(En),this}rotateX(t){return En.makeRotationX(t),this.applyMatrix4(En),this}rotateY(t){return En.makeRotationY(t),this.applyMatrix4(En),this}rotateZ(t){return En.makeRotationZ(t),this.applyMatrix4(En),this}translate(t,e,n){return En.makeTranslation(t,e,n),this.applyMatrix4(En),this}scale(t,e,n){return En.makeScale(t,e,n),this.applyMatrix4(En),this}lookAt(t){return La.lookAt(t),La.updateMatrix(),this.applyMatrix4(La.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rs).negate(),this.translate(rs.x,rs.y,rs.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new pe(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Qt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Xi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Be("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Sn.setFromBufferAttribute(r),this.morphTargetsRelative?(qe.addVectors(this.boundingBox.min,Sn.min),this.boundingBox.expandByPoint(qe),qe.addVectors(this.boundingBox.max,Sn.max),this.boundingBox.expandByPoint(qe)):(this.boundingBox.expandByPoint(Sn.min),this.boundingBox.expandByPoint(Sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Be('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ts);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Be("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){const n=this.boundingSphere.center;if(Sn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Is.setFromBufferAttribute(o),this.morphTargetsRelative?(qe.addVectors(Sn.min,Is.min),Sn.expandByPoint(qe),qe.addVectors(Sn.max,Is.max),Sn.expandByPoint(qe)):(Sn.expandByPoint(Is.min),Sn.expandByPoint(Is.max))}Sn.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)qe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(qe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)qe.fromBufferAttribute(o,l),c&&(rs.fromBufferAttribute(t,l),qe.add(rs)),s=Math.max(s,n.distanceToSquared(qe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Be('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Be("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new On(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let P=0;P<n.count;P++)o[P]=new U,c[P]=new U;const l=new U,d=new U,u=new U,f=new wt,m=new wt,g=new wt,v=new U,p=new U;function h(P,b,M){l.fromBufferAttribute(n,P),d.fromBufferAttribute(n,b),u.fromBufferAttribute(n,M),f.fromBufferAttribute(r,P),m.fromBufferAttribute(r,b),g.fromBufferAttribute(r,M),d.sub(l),u.sub(l),m.sub(f),g.sub(f);const A=1/(m.x*g.y-g.x*m.y);isFinite(A)&&(v.copy(d).multiplyScalar(g.y).addScaledVector(u,-m.y).multiplyScalar(A),p.copy(u).multiplyScalar(m.x).addScaledVector(d,-g.x).multiplyScalar(A),o[P].add(v),o[b].add(v),o[M].add(v),c[P].add(p),c[b].add(p),c[M].add(p))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let P=0,b=S.length;P<b;++P){const M=S[P],A=M.start,I=M.count;for(let B=A,Y=A+I;B<Y;B+=3)h(t.getX(B+0),t.getX(B+1),t.getX(B+2))}const _=new U,y=new U,E=new U,w=new U;function R(P){E.fromBufferAttribute(s,P),w.copy(E);const b=o[P];_.copy(b),_.sub(E.multiplyScalar(E.dot(b))).normalize(),y.crossVectors(w,b);const A=y.dot(c[P])<0?-1:1;a.setXYZW(P,_.x,_.y,_.z,A)}for(let P=0,b=S.length;P<b;++P){const M=S[P],A=M.start,I=M.count;for(let B=A,Y=A+I;B<Y;B+=3)R(t.getX(B+0)),R(t.getX(B+1)),R(t.getX(B+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new On(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);const s=new U,r=new U,a=new U,o=new U,c=new U,l=new U,d=new U,u=new U;if(t)for(let f=0,m=t.count;f<m;f+=3){const g=t.getX(f+0),v=t.getX(f+1),p=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,p),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,p),o.add(d),c.add(d),l.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,m=e.count;f<m;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)qe.fromBufferAttribute(t,e),qe.normalize(),t.setXYZ(e,qe.x,qe.y,qe.z)}toNonIndexed(){function t(o,c){const l=o.array,d=o.itemSize,u=o.normalized,f=new l.constructor(c.length*d);let m=0,g=0;for(let v=0,p=c.length;v<p;v++){o.isInterleavedBufferAttribute?m=c[v]*o.data.stride+o.offset:m=c[v]*d;for(let h=0;h<d;h++)f[g++]=l[m++]}return new On(f,d,u)}if(this.index===null)return Qt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ke,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,u=l.length;d<u;d++){const f=l[d],m=t(f,n);c.push(m)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,f=l.length;u<f;u++){const m=l[u];d.push(m.toJSON(t.data))}d.length>0&&(s[c]=d,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(e))}const r=t.morphAttributes;for(const l in r){const d=[],u=r[l];for(let f=0,m=u.length;f<m;f++)d.push(u[f].clone(e));this.morphAttributes[l]=d}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,d=a.length;l<d;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const qc=new _e,Ei=new oc,Sr=new Ts,Zc=new U,yr=new U,br=new U,wr=new U,Da=new U,Tr=new U,$c=new U,Er=new U;class V extends ze{constructor(t=new ke,e=new Te){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Tr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],u=r[c];d!==0&&(Da.fromBufferAttribute(u,t),a?Tr.addScaledVector(Da,d):Tr.addScaledVector(Da.sub(e),d))}e.add(Tr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Sr.copy(n.boundingSphere),Sr.applyMatrix4(r),Ei.copy(t.ray).recast(t.near),!(Sr.containsPoint(Ei.origin)===!1&&(Ei.intersectSphere(Sr,Zc)===null||Ei.origin.distanceToSquared(Zc)>(t.far-t.near)**2))&&(qc.copy(r).invert(),Ei.copy(t.ray).applyMatrix4(qc),!(n.boundingBox!==null&&Ei.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ei)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,f=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const p=f[g],h=a[p.materialIndex],S=Math.max(p.start,m.start),_=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let y=S,E=_;y<E;y+=3){const w=o.getX(y),R=o.getX(y+1),P=o.getX(y+2);s=Ar(this,h,t,n,l,d,u,w,R,P),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(o.count,m.start+m.count);for(let p=g,h=v;p<h;p+=3){const S=o.getX(p),_=o.getX(p+1),y=o.getX(p+2);s=Ar(this,a,t,n,l,d,u,S,_,y),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const p=f[g],h=a[p.materialIndex],S=Math.max(p.start,m.start),_=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let y=S,E=_;y<E;y+=3){const w=y,R=y+1,P=y+2;s=Ar(this,h,t,n,l,d,u,w,R,P),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const g=Math.max(0,m.start),v=Math.min(c.count,m.start+m.count);for(let p=g,h=v;p<h;p+=3){const S=p,_=p+1,y=p+2;s=Ar(this,a,t,n,l,d,u,S,_,y),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}}function Ru(i,t,e,n,s,r,a,o){let c;if(t.side===nn?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===yi,o),c===null)return null;Er.copy(o),Er.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Er);return l<e.near||l>e.far?null:{distance:l,point:Er.clone(),object:i}}function Ar(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,yr),i.getVertexPosition(c,br),i.getVertexPosition(l,wr);const d=Ru(i,t,e,n,yr,br,wr,$c);if(d){const u=new U;Un.getBarycoord($c,yr,br,wr,u),s&&(d.uv=Un.getInterpolatedAttribute(s,o,c,l,u,new wt)),r&&(d.uv1=Un.getInterpolatedAttribute(r,o,c,l,u,new wt)),a&&(d.normal=Un.getInterpolatedAttribute(a,o,c,l,u,new U),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new U,materialIndex:0};Un.getNormal(yr,br,wr,f.normal),d.face=f,d.barycoord=u}return d}class Pt extends ke{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],u=[];let f=0,m=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new pe(l,3)),this.setAttribute("normal",new pe(d,3)),this.setAttribute("uv",new pe(u,2));function g(v,p,h,S,_,y,E,w,R,P,b){const M=y/R,A=E/P,I=y/2,B=E/2,Y=w/2,q=R+1,Z=P+1;let ct=0,nt=0;const mt=new U;for(let _t=0;_t<Z;_t++){const N=_t*A-B;for(let Mt=0;Mt<q;Mt++){const gt=Mt*M-I;mt[v]=gt*S,mt[p]=N*_,mt[h]=Y,l.push(mt.x,mt.y,mt.z),mt[v]=0,mt[p]=0,mt[h]=w>0?1:-1,d.push(mt.x,mt.y,mt.z),u.push(Mt/R),u.push(1-_t/P),ct+=1}}for(let _t=0;_t<P;_t++)for(let N=0;N<R;N++){const Mt=f+N+q*_t,gt=f+N+q*(_t+1),yt=f+(N+1)+q*(_t+1),At=f+(N+1)+q*_t;c.push(Mt,gt,At),c.push(gt,yt,At),nt+=6}o.addGroup(m,nt,b),m+=nt,f+=ct}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pt(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ss(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Qt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ln(i){const t={};for(let e=0;e<i.length;e++){const n=Ss(i[e]);for(const s in n)t[s]=n[s]}return t}function Pu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function yh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:me.workingColorSpace}const sr={clone:Ss,merge:ln};var Lu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Du=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class en extends Yi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Lu,this.fragmentShader=Du,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ss(t.uniforms),this.uniformsGroups=Pu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class bh extends ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _e,this.projectionMatrix=new _e,this.projectionMatrixInverse=new _e,this.coordinateSystem=Yn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const gi=new U,Kc=new wt,Jc=new wt;class yn extends bh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ir*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ws*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ir*2*Math.atan(Math.tan(Ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){gi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(gi.x,gi.y).multiplyScalar(-t/gi.z),gi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(gi.x,gi.y).multiplyScalar(-t/gi.z)}getViewSize(t,e){return this.getViewBounds(t,Kc,Jc),e.subVectors(Jc,Kc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ws*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const as=-90,os=1;class Iu extends ze{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new yn(as,os,t,e);s.layers=this.layers,this.add(s);const r=new yn(as,os,t,e);r.layers=this.layers,this.add(r);const a=new yn(as,os,t,e);a.layers=this.layers,this.add(a);const o=new yn(as,os,t,e);o.layers=this.layers,this.add(o);const c=new yn(as,os,t,e);c.layers=this.layers,this.add(c);const l=new yn(as,os,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===Yn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Jr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,d),t.setRenderTarget(u,f,m),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class wh extends sn{constructor(t=[],e=_s,n,s,r,a,o,c,l,d){super(t,e,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Uu extends Fn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new wh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Pt(5,5,5),r=new en({name:"CubemapFromEquirect",uniforms:Ss(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:nn,blending:qn});r.uniforms.tEquirect.value=e;const a=new V(s,r),o=e.minFilter;return e.minFilter===Ni&&(e.minFilter=An),new Iu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}class re extends ze{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Nu={type:"move"};class Ia{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new re,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new re,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new re,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const p=e.getJointPose(v,n),h=this._getHandJoint(l,v);p!==null&&(h.matrix.fromArray(p.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=p.radius),h.visible=p!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=d.position.distanceTo(u.position),m=.02,g=.005;l.inputState.pinching&&f>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Nu)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new re;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class lc{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Zt(t),this.near=e,this.far=n}clone(){return new lc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Th extends ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zn,this.environmentIntensity=1,this.environmentRotation=new zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Eh extends sn{constructor(t=null,e=1,n=1,s,r,a,o,c,l=bn,d=bn,u,f){super(null,a,o,c,l,d,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class jc extends On{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const cs=new _e,Qc=new _e,Cr=[],tl=new Xi,Fu=new _e,Us=new V,Ns=new Ts;class Qe extends V{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new jc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Fu)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Xi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,cs),tl.copy(t.boundingBox).applyMatrix4(cs),this.boundingBox.union(tl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ts),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,cs),Ns.copy(t.boundingSphere).applyMatrix4(cs),this.boundingSphere.union(Ns)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Us.geometry=this.geometry,Us.material=this.material,Us.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ns.copy(this.boundingSphere),Ns.applyMatrix4(n),t.ray.intersectsSphere(Ns)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,cs),Qc.multiplyMatrices(n,cs),Us.matrixWorld=Qc,Us.raycast(t,Cr);for(let a=0,o=Cr.length;a<o;a++){const c=Cr[a];c.instanceId=r,c.object=this,e.push(c)}Cr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new jc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Eh(new Float32Array(s*this.count),s,this.count,Qo,Xn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*t;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ua=new U,Ou=new U,Bu=new ne;class Pi{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ua.subVectors(n,e).cross(Ou.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ua),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Bu.getNormalMatrix(t),s=this.coplanarPoint(Ua).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ai=new Ts,zu=new wt(.5,.5),Rr=new U;class hc{constructor(t=new Pi,e=new Pi,n=new Pi,s=new Pi,r=new Pi,a=new Pi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Yn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],u=r[5],f=r[6],m=r[7],g=r[8],v=r[9],p=r[10],h=r[11],S=r[12],_=r[13],y=r[14],E=r[15];if(s[0].setComponents(l-a,m-d,h-g,E-S).normalize(),s[1].setComponents(l+a,m+d,h+g,E+S).normalize(),s[2].setComponents(l+o,m+u,h+v,E+_).normalize(),s[3].setComponents(l-o,m-u,h-v,E-_).normalize(),n)s[4].setComponents(c,f,p,y).normalize(),s[5].setComponents(l-c,m-f,h-p,E-y).normalize();else if(s[4].setComponents(l-c,m-f,h-p,E-y).normalize(),e===Yn)s[5].setComponents(l+c,m+f,h+p,E+y).normalize();else if(e===Jr)s[5].setComponents(c,f,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ai.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ai.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ai)}intersectsSprite(t){Ai.center.set(0,0,0);const e=zu.distanceTo(t.center);return Ai.radius=.7071067811865476+e,Ai.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ai)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Rr.x=s.normal.x>0?t.max.x:t.min.x,Rr.y=s.normal.y>0?t.max.y:t.min.y,Rr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Rr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Oo extends Yi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Zt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Qr=new U,ta=new U,el=new _e,Fs=new oc,Pr=new Ts,Na=new U,nl=new U;class il extends ze{constructor(t=new ke,e=new Oo){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Qr.fromBufferAttribute(e,s-1),ta.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Qr.distanceTo(ta);t.setAttribute("lineDistance",new pe(n,1))}else Qt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Pr.copy(n.boundingSphere),Pr.applyMatrix4(s),Pr.radius+=r,t.ray.intersectsSphere(Pr)===!1)return;el.copy(s).invert(),Fs.copy(t.ray).applyMatrix4(el);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,f=n.attributes.position;if(d!==null){const m=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let v=m,p=g-1;v<p;v+=l){const h=d.getX(v),S=d.getX(v+1),_=Lr(this,t,Fs,c,h,S,v);_&&e.push(_)}if(this.isLineLoop){const v=d.getX(g-1),p=d.getX(m),h=Lr(this,t,Fs,c,v,p,g-1);h&&e.push(h)}}else{const m=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let v=m,p=g-1;v<p;v+=l){const h=Lr(this,t,Fs,c,v,v+1,v);h&&e.push(h)}if(this.isLineLoop){const v=Lr(this,t,Fs,c,g-1,m,g-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Lr(i,t,e,n,s,r,a){const o=i.geometry.attributes.position;if(Qr.fromBufferAttribute(o,s),ta.fromBufferAttribute(o,r),e.distanceSqToSegment(Qr,ta,Na,nl)>n)return;Na.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Na);if(!(l<t.near||l>t.far))return{distance:l,point:nl.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class un extends sn{constructor(t,e,n,s,r,a,o,c,l){super(t,e,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ah extends sn{constructor(t,e,n=Vi,s,r,a,o=bn,c=bn,l,d=tr,u=1){if(d!==tr&&d!==er)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:u};super(f,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ac(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Ch extends sn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class dn extends ke{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],c=[],l=new U,d=new wt;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const m=n+u/e*s;l.x=t*Math.cos(m),l.y=t*Math.sin(m),a.push(l.x,l.y,l.z),o.push(0,0,1),d.x=(a[f]/t+1)/2,d.y=(a[f+1]/t+1)/2,c.push(d.x,d.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new pe(a,3)),this.setAttribute("normal",new pe(o,3)),this.setAttribute("uv",new pe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dn(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class he extends ke{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],f=[],m=[];let g=0;const v=[],p=n/2;let h=0;S(),a===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(d),this.setAttribute("position",new pe(u,3)),this.setAttribute("normal",new pe(f,3)),this.setAttribute("uv",new pe(m,2));function S(){const y=new U,E=new U;let w=0;const R=(e-t)/n;for(let P=0;P<=r;P++){const b=[],M=P/r,A=M*(e-t)+t;for(let I=0;I<=s;I++){const B=I/s,Y=B*c+o,q=Math.sin(Y),Z=Math.cos(Y);E.x=A*q,E.y=-M*n+p,E.z=A*Z,u.push(E.x,E.y,E.z),y.set(q,R,Z).normalize(),f.push(y.x,y.y,y.z),m.push(B,1-M),b.push(g++)}v.push(b)}for(let P=0;P<s;P++)for(let b=0;b<r;b++){const M=v[b][P],A=v[b+1][P],I=v[b+1][P+1],B=v[b][P+1];(t>0||b!==0)&&(d.push(M,A,B),w+=3),(e>0||b!==r-1)&&(d.push(A,I,B),w+=3)}l.addGroup(h,w,0),h+=w}function _(y){const E=g,w=new wt,R=new U;let P=0;const b=y===!0?t:e,M=y===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,p*M,0),f.push(0,M,0),m.push(.5,.5),g++;const A=g;for(let I=0;I<=s;I++){const Y=I/s*c+o,q=Math.cos(Y),Z=Math.sin(Y);R.x=b*Z,R.y=p*M,R.z=b*q,u.push(R.x,R.y,R.z),f.push(0,M,0),w.x=q*.5+.5,w.y=Z*.5*M+.5,m.push(w.x,w.y),g++}for(let I=0;I<s;I++){const B=E+I,Y=A+I;y===!0?d.push(Y,Y+1,B):d.push(Y+1,Y,B),P+=3}l.addGroup(h,P,y===!0?1:2),h+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new he(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class zi extends he{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new zi(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class sa extends ke{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),l(n),d(),this.setAttribute("position",new pe(r,3)),this.setAttribute("normal",new pe(r.slice(),3)),this.setAttribute("uv",new pe(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(S){const _=new U,y=new U,E=new U;for(let w=0;w<e.length;w+=3)m(e[w+0],_),m(e[w+1],y),m(e[w+2],E),c(_,y,E,S)}function c(S,_,y,E){const w=E+1,R=[];for(let P=0;P<=w;P++){R[P]=[];const b=S.clone().lerp(y,P/w),M=_.clone().lerp(y,P/w),A=w-P;for(let I=0;I<=A;I++)I===0&&P===w?R[P][I]=b:R[P][I]=b.clone().lerp(M,I/A)}for(let P=0;P<w;P++)for(let b=0;b<2*(w-P)-1;b++){const M=Math.floor(b/2);b%2===0?(f(R[P][M+1]),f(R[P+1][M]),f(R[P][M])):(f(R[P][M+1]),f(R[P+1][M+1]),f(R[P+1][M]))}}function l(S){const _=new U;for(let y=0;y<r.length;y+=3)_.x=r[y+0],_.y=r[y+1],_.z=r[y+2],_.normalize().multiplyScalar(S),r[y+0]=_.x,r[y+1]=_.y,r[y+2]=_.z}function d(){const S=new U;for(let _=0;_<r.length;_+=3){S.x=r[_+0],S.y=r[_+1],S.z=r[_+2];const y=p(S)/2/Math.PI+.5,E=h(S)/Math.PI+.5;a.push(y,1-E)}g(),u()}function u(){for(let S=0;S<a.length;S+=6){const _=a[S+0],y=a[S+2],E=a[S+4],w=Math.max(_,y,E),R=Math.min(_,y,E);w>.9&&R<.1&&(_<.2&&(a[S+0]+=1),y<.2&&(a[S+2]+=1),E<.2&&(a[S+4]+=1))}}function f(S){r.push(S.x,S.y,S.z)}function m(S,_){const y=S*3;_.x=t[y+0],_.y=t[y+1],_.z=t[y+2]}function g(){const S=new U,_=new U,y=new U,E=new U,w=new wt,R=new wt,P=new wt;for(let b=0,M=0;b<r.length;b+=9,M+=6){S.set(r[b+0],r[b+1],r[b+2]),_.set(r[b+3],r[b+4],r[b+5]),y.set(r[b+6],r[b+7],r[b+8]),w.set(a[M+0],a[M+1]),R.set(a[M+2],a[M+3]),P.set(a[M+4],a[M+5]),E.copy(S).add(_).add(y).divideScalar(3);const A=p(E);v(w,M+0,S,A),v(R,M+2,_,A),v(P,M+4,y,A)}}function v(S,_,y,E){E<0&&S.x===1&&(a[_]=S.x-1),y.x===0&&y.z===0&&(a[_]=E/2/Math.PI+.5)}function p(S){return Math.atan2(S.z,-S.x)}function h(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sa(t.vertices,t.indices,t.radius,t.details)}}class dc extends sa{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new dc(t.radius,t.detail)}}class Kn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Qt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const d=n[s],f=n[s+1]-d,m=(a-d)/f;return(s+m)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new wt:new U);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new U,s=[],r=[],a=[],o=new U,c=new _e;for(let m=0;m<=t;m++){const g=m/t;s[m]=this.getTangentAt(g,new U)}r[0]=new U,a[0]=new U;let l=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=t;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(oe(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(c.makeRotationAxis(o,g))}a[m].crossVectors(s[m],r[m])}if(e===!0){let m=Math.acos(oe(r[0].dot(r[t]),-1,1));m/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(m=-m);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],m*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class uc extends Kn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e=new wt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,m=l-this.aY;c=f*d-m*u+this.aX,l=f*u+m*d+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class ku extends uc{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function fc(){let i=0,t=0,e=0,n=0;function s(r,a,o,c){i=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,d,u){let f=(a-r)/l-(o-r)/(l+d)+(o-a)/d,m=(o-a)/d-(c-a)/(d+u)+(c-o)/u;f*=d,m*=d,s(a,o,f,m)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const Dr=new U,Fa=new fc,Oa=new fc,Ba=new fc;class Vu extends Kn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new U){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,d;this.closed||o>0?l=s[(o-1)%r]:(Dr.subVectors(s[0],s[1]).add(s[0]),l=Dr);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(Dr.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=Dr),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),m),v=Math.pow(u.distanceToSquared(f),m),p=Math.pow(f.distanceToSquared(d),m);v<1e-4&&(v=1),g<1e-4&&(g=v),p<1e-4&&(p=v),Fa.initNonuniformCatmullRom(l.x,u.x,f.x,d.x,g,v,p),Oa.initNonuniformCatmullRom(l.y,u.y,f.y,d.y,g,v,p),Ba.initNonuniformCatmullRom(l.z,u.z,f.z,d.z,g,v,p)}else this.curveType==="catmullrom"&&(Fa.initCatmullRom(l.x,u.x,f.x,d.x,this.tension),Oa.initCatmullRom(l.y,u.y,f.y,d.y,this.tension),Ba.initCatmullRom(l.z,u.z,f.z,d.z,this.tension));return n.set(Fa.calc(c),Oa.calc(c),Ba.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new U().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function sl(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,c=i*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*i+e}function Gu(i,t){const e=1-i;return e*e*t}function Hu(i,t){return 2*(1-i)*i*t}function Wu(i,t){return i*i*t}function Ys(i,t,e,n){return Gu(i,t)+Hu(i,e)+Wu(i,n)}function Xu(i,t){const e=1-i;return e*e*e*t}function Yu(i,t){const e=1-i;return 3*e*e*i*t}function qu(i,t){return 3*(1-i)*i*i*t}function Zu(i,t){return i*i*i*t}function qs(i,t,e,n,s){return Xu(i,t)+Yu(i,e)+qu(i,n)+Zu(i,s)}class Rh extends Kn{constructor(t=new wt,e=new wt,n=new wt,s=new wt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new wt){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(qs(t,s.x,r.x,a.x,o.x),qs(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class $u extends Kn{constructor(t=new U,e=new U,n=new U,s=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new U){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(qs(t,s.x,r.x,a.x,o.x),qs(t,s.y,r.y,a.y,o.y),qs(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Ph extends Kn{constructor(t=new wt,e=new wt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new wt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new wt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ku extends Kn{constructor(t=new U,e=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new U){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new U){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Lh extends Kn{constructor(t=new wt,e=new wt,n=new wt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new wt){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ys(t,s.x,r.x,a.x),Ys(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ju extends Kn{constructor(t=new U,e=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new U){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ys(t,s.x,r.x,a.x),Ys(t,s.y,r.y,a.y),Ys(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Dh extends Kn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new wt){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(sl(o,c.x,l.x,d.x,u.x),sl(o,c.y,l.y,d.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new wt().fromArray(s))}return this}}var rl=Object.freeze({__proto__:null,ArcCurve:ku,CatmullRomCurve3:Vu,CubicBezierCurve:Rh,CubicBezierCurve3:$u,EllipseCurve:uc,LineCurve:Ph,LineCurve3:Ku,QuadraticBezierCurve:Lh,QuadraticBezierCurve3:Ju,SplineCurve:Dh});class ju extends Kn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new rl[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const d=c[l];n&&n.equals(d)||(e.push(d),n=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new rl[s.type]().fromJSON(s))}return this}}class al extends ju{constructor(t){super(),this.type="Path",this.currentPoint=new wt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Ph(this.currentPoint.clone(),new wt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Lh(this.currentPoint.clone(),new wt(t,e),new wt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Rh(this.currentPoint.clone(),new wt(t,e),new wt(n,s),new wt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Dh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+l,e+d,n,s,r,a,o,c),this}absellipse(t,e,n,s,r,a,o,c){const l=new uc(t,e,n,s,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Ih extends al{constructor(t){super(t),this.uuid=Wi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new al().fromJSON(s))}return this}}function Qu(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Uh(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=rf(i,t,r,e)),i.length>80*e){o=i[0],c=i[1];let d=o,u=c;for(let f=e;f<s;f+=e){const m=i[f],g=i[f+1];m<o&&(o=m),g<c&&(c=g),m>d&&(d=m),g>u&&(u=g)}l=Math.max(d-o,u-c),l=l!==0?32767/l:0}return rr(r,a,e,o,c,l,0),a}function Uh(i,t,e,n,s){let r;if(s===xf(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=ol(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=ol(a/n|0,i[a],i[a+1],r);return r&&ys(r,r.next)&&(or(r),r=r.next),r}function Gi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ys(e,e.next)||Ne(e.prev,e,e.next)===0)){if(or(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function rr(i,t,e,n,s,r,a){if(!i)return;!a&&r&&hf(i,n,s,r);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?ef(i,n,s,r):tf(i)){t.push(c.i,i.i,l.i),or(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=nf(Gi(i),t),rr(i,t,e,n,s,r,2)):a===2&&sf(i,t,e,n,s,r):rr(Gi(i),t,e,n,s,r,1);break}}}function tf(i){const t=i.prev,e=i,n=i.next;if(Ne(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,c=e.y,l=n.y,d=Math.min(s,r,a),u=Math.min(o,c,l),f=Math.max(s,r,a),m=Math.max(o,c,l);let g=n.next;for(;g!==t;){if(g.x>=d&&g.x<=f&&g.y>=u&&g.y<=m&&ks(s,o,r,c,a,l,g.x,g.y)&&Ne(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function ef(i,t,e,n){const s=i.prev,r=i,a=i.next;if(Ne(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,d=s.y,u=r.y,f=a.y,m=Math.min(o,c,l),g=Math.min(d,u,f),v=Math.max(o,c,l),p=Math.max(d,u,f),h=Bo(m,g,t,e,n),S=Bo(v,p,t,e,n);let _=i.prevZ,y=i.nextZ;for(;_&&_.z>=h&&y&&y.z<=S;){if(_.x>=m&&_.x<=v&&_.y>=g&&_.y<=p&&_!==s&&_!==a&&ks(o,d,c,u,l,f,_.x,_.y)&&Ne(_.prev,_,_.next)>=0||(_=_.prevZ,y.x>=m&&y.x<=v&&y.y>=g&&y.y<=p&&y!==s&&y!==a&&ks(o,d,c,u,l,f,y.x,y.y)&&Ne(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;_&&_.z>=h;){if(_.x>=m&&_.x<=v&&_.y>=g&&_.y<=p&&_!==s&&_!==a&&ks(o,d,c,u,l,f,_.x,_.y)&&Ne(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;y&&y.z<=S;){if(y.x>=m&&y.x<=v&&y.y>=g&&y.y<=p&&y!==s&&y!==a&&ks(o,d,c,u,l,f,y.x,y.y)&&Ne(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function nf(i,t){let e=i;do{const n=e.prev,s=e.next.next;!ys(n,s)&&Fh(n,e,e.next,s)&&ar(n,s)&&ar(s,n)&&(t.push(n.i,e.i,s.i),or(e),or(e.next),e=i=s),e=e.next}while(e!==i);return Gi(e)}function sf(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&ff(a,o)){let c=Oh(a,o);a=Gi(a,a.next),c=Gi(c,c.next),rr(a,t,e,n,s,r,0),rr(c,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function rf(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,c=r<a-1?t[r+1]*n:i.length,l=Uh(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(uf(l))}s.sort(af);for(let r=0;r<s.length;r++)e=of(s[r],e);return e}function af(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function of(i,t){const e=cf(i,t);if(!e)return t;const n=Oh(e,i);return Gi(n,n.next),Gi(e,e.next)}function cf(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(ys(i,e))return e;do{if(ys(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,a=e.x<e.next.x?e:e.next,u===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,c=a.x,l=a.y;let d=1/0;e=a;do{if(n>=e.x&&e.x>=c&&n!==e.x&&Nh(s<l?n:r,s,c,l,s<l?r:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);ar(e,i)&&(u<d||u===d&&(e.x>a.x||e.x===a.x&&lf(a,e)))&&(a=e,d=u)}e=e.next}while(e!==o);return a}function lf(i,t){return Ne(i.prev,i,t.prev)<0&&Ne(t.next,i,i.next)<0}function hf(i,t,e,n){let s=i;do s.z===0&&(s.z=Bo(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,df(s)}function df(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let l=0;l<e&&(o++,a=a.nextZ,!!a);l++);let c=e;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function Bo(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function uf(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Nh(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function ks(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Nh(i,t,e,n,s,r,a,o)}function ff(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!pf(i,t)&&(ar(i,t)&&ar(t,i)&&mf(i,t)&&(Ne(i.prev,i,t.prev)||Ne(i,t.prev,t))||ys(i,t)&&Ne(i.prev,i,i.next)>0&&Ne(t.prev,t,t.next)>0)}function Ne(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ys(i,t){return i.x===t.x&&i.y===t.y}function Fh(i,t,e,n){const s=Ur(Ne(i,t,e)),r=Ur(Ne(i,t,n)),a=Ur(Ne(e,n,i)),o=Ur(Ne(e,n,t));return!!(s!==r&&a!==o||s===0&&Ir(i,e,t)||r===0&&Ir(i,n,t)||a===0&&Ir(e,i,n)||o===0&&Ir(e,t,n))}function Ir(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ur(i){return i>0?1:i<0?-1:0}function pf(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Fh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function ar(i,t){return Ne(i.prev,i,i.next)<0?Ne(i,t,i.next)>=0&&Ne(i,i.prev,t)>=0:Ne(i,t,i.prev)<0||Ne(i,i.next,t)<0}function mf(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Oh(i,t){const e=zo(i.i,i.x,i.y),n=zo(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function ol(i,t,e,n){const s=zo(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function or(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function zo(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function xf(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class gf{static triangulate(t,e,n=2){return Qu(t,e,n)}}class Zs{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Zs.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];cl(t),ll(n,t);let a=t.length;e.forEach(cl);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,ll(n,e[c]);const o=gf.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function cl(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function ll(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class pc extends sa{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new pc(t.radius,t.detail)}}class Ue extends ke{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,u=t/o,f=e/c,m=[],g=[],v=[],p=[];for(let h=0;h<d;h++){const S=h*f-a;for(let _=0;_<l;_++){const y=_*u-r;g.push(y,-S,0),v.push(0,0,1),p.push(_/o),p.push(1-h/c)}}for(let h=0;h<c;h++)for(let S=0;S<o;S++){const _=S+l*h,y=S+l*(h+1),E=S+1+l*(h+1),w=S+1+l*h;m.push(_,y,w),m.push(y,E,w)}this.setIndex(m),this.setAttribute("position",new pe(g,3)),this.setAttribute("normal",new pe(v,3)),this.setAttribute("uv",new pe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ue(t.width,t.height,t.widthSegments,t.heightSegments)}}class mc extends ke{constructor(t=new Ih([new wt(0,.5),new wt(-.5,-.5),new wt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let d=0;d<t.length;d++)l(t[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new pe(s,3)),this.setAttribute("normal",new pe(r,3)),this.setAttribute("uv",new pe(a,2));function l(d){const u=s.length/3,f=d.extractPoints(e);let m=f.shape;const g=f.holes;Zs.isClockWise(m)===!1&&(m=m.reverse());for(let p=0,h=g.length;p<h;p++){const S=g[p];Zs.isClockWise(S)===!0&&(g[p]=S.reverse())}const v=Zs.triangulateShape(m,g);for(let p=0,h=g.length;p<h;p++){const S=g[p];m=m.concat(S)}for(let p=0,h=m.length;p<h;p++){const S=m[p];s.push(S.x,S.y,0),r.push(0,0,1),a.push(S.x,S.y)}for(let p=0,h=v.length;p<h;p++){const S=v[p],_=S[0]+u,y=S[1]+u,E=S[2]+u;n.push(_,y,E),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return _f(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new mc(n,t.curveSegments)}}function _f(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class He extends ke{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const d=[],u=new U,f=new U,m=[],g=[],v=[],p=[];for(let h=0;h<=n;h++){const S=[],_=h/n;let y=0;h===0&&a===0?y=.5/e:h===n&&c===Math.PI&&(y=-.5/e);for(let E=0;E<=e;E++){const w=E/e;u.x=-t*Math.cos(s+w*r)*Math.sin(a+_*o),u.y=t*Math.cos(a+_*o),u.z=t*Math.sin(s+w*r)*Math.sin(a+_*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),p.push(w+y,1-_),S.push(l++)}d.push(S)}for(let h=0;h<n;h++)for(let S=0;S<e;S++){const _=d[h][S+1],y=d[h][S],E=d[h+1][S],w=d[h+1][S+1];(h!==0||a>0)&&m.push(_,y,w),(h!==n-1||c<Math.PI)&&m.push(y,E,w)}this.setIndex(m),this.setAttribute("position",new pe(g,3)),this.setAttribute("normal",new pe(v,3)),this.setAttribute("uv",new pe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new He(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class cr extends ke{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],d=new U,u=new U,f=new U;for(let m=0;m<=n;m++)for(let g=0;g<=s;g++){const v=g/s*r,p=m/n*Math.PI*2;u.x=(t+e*Math.cos(p))*Math.cos(v),u.y=(t+e*Math.cos(p))*Math.sin(v),u.z=e*Math.sin(p),o.push(u.x,u.y,u.z),d.x=t*Math.cos(v),d.y=t*Math.sin(v),f.subVectors(u,d).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(m/n)}for(let m=1;m<=n;m++)for(let g=1;g<=s;g++){const v=(s+1)*m+g-1,p=(s+1)*(m-1)+g-1,h=(s+1)*(m-1)+g,S=(s+1)*m+g;a.push(v,p,S),a.push(p,h,S)}this.setIndex(a),this.setAttribute("position",new pe(o,3)),this.setAttribute("normal",new pe(c,3)),this.setAttribute("uv",new pe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class vf extends en{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class K extends Yi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Zt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=sc,this.normalScale=new wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Mf extends Yi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=sc,this.normalScale=new wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=Zo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Sf extends Yi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=zd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class yf extends Yi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class xc extends ze{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class bf extends xc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const za=new _e,hl=new U,dl=new U;class Bh{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new wt(512,512),this.mapType=$n,this.map=null,this.mapPass=null,this.matrix=new _e,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new hc,this._frameExtents=new wt(1,1),this._viewportCount=1,this._viewports=[new Ee(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;hl.setFromMatrixPosition(t.matrixWorld),e.position.copy(hl),dl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(dl),e.updateMatrixWorld(),za.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(za,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(za)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const ul=new _e,Os=new U,ka=new U;class wf extends Bh{constructor(){super(new yn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new wt(4,2),this._viewportCount=6,this._viewports=[new Ee(2,1,1,1),new Ee(0,1,1,1),new Ee(3,1,1,1),new Ee(1,1,1,1),new Ee(3,0,1,1),new Ee(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Os.setFromMatrixPosition(t.matrixWorld),n.position.copy(Os),ka.copy(n.position),ka.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(ka),n.updateMatrixWorld(),s.makeTranslation(-Os.x,-Os.y,-Os.z),ul.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ul,n.coordinateSystem,n.reversedDepth)}}class gc extends xc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new wf}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class _c extends bh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Tf extends Bh{constructor(){super(new _c(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class fl extends xc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ze.DEFAULT_UP),this.updateMatrix(),this.target=new ze,this.shadow=new Tf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Ef extends yn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class zh{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}const pl=new _e;class Af{constructor(t,e,n=0,s=1/0){this.ray=new oc(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new cc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Be("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return pl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(pl),this}intersectObject(t,e=!0,n=[]){return ko(t,this,n,e),n.sort(ml),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)ko(t[s],this,n,e);return n.sort(ml),n}}function ml(i,t){return i.distance-t.distance}function ko(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)ko(r[a],t,e,!0)}}function xl(i,t,e,n){const s=Cf(n);switch(e){case ph:return i*t;case Qo:return i*t/s.components*s.byteLength;case tc:return i*t/s.components*s.byteLength;case ec:return i*t*2/s.components*s.byteLength;case nc:return i*t*2/s.components*s.byteLength;case mh:return i*t*3/s.components*s.byteLength;case Nn:return i*t*4/s.components*s.byteLength;case ic:return i*t*4/s.components*s.byteLength;case Vr:case Gr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Hr:case Wr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case lo:case uo:return Math.max(i,16)*Math.max(t,8)/4;case co:case ho:return Math.max(i,8)*Math.max(t,8)/2;case fo:case po:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case mo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case xo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case go:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case _o:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case vo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Mo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case So:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case yo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case bo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case wo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case To:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Eo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ao:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Co:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ro:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Po:case Lo:case Do:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Io:case Uo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case No:case Fo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Cf(i){switch(i){case $n:case hh:return{byteLength:1,components:1};case js:case dh:case Zn:return{byteLength:2,components:1};case Jo:case jo:return{byteLength:2,components:4};case Vi:case Ko:case Xn:return{byteLength:4,components:1};case uh:case fh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qo}}));typeof window<"u"&&(window.__THREE__?Qt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qo);function kh(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Rf(i){const t=new WeakMap;function e(o,c){const l=o.array,d=o.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,d),o.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)m=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const d=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,d);else{u.sort((m,g)=>m.start-g.start);let f=0;for(let m=1;m<u.length;m++){const g=u[f],v=u[m];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++f,u[f]=v)}u.length=f+1;for(let m=0,g=u.length;m<g;m++){const v=u[m];i.bufferSubData(l,v.start*d.BYTES_PER_ELEMENT,d,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=t.get(o);(!d||d.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=t.get(o);if(l===void 0)t.set(o,e(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var Pf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Lf=`#ifdef USE_ALPHAHASH
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
#endif`,Df=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,If=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Uf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Nf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ff=`#ifdef USE_AOMAP
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
#endif`,Of=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Bf=`#ifdef USE_BATCHING
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
#endif`,zf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,kf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Vf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Hf=`#ifdef USE_IRIDESCENCE
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
#endif`,Wf=`#ifdef USE_BUMPMAP
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
#endif`,Xf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Yf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Zf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$f=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Kf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Jf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,jf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Qf=`#define PI 3.141592653589793
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
} // validated`,t0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,e0=`vec3 transformedNormal = objectNormal;
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
#endif`,n0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,i0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,s0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,r0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,a0="gl_FragColor = linearToOutputTexel( gl_FragColor );",o0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,c0=`#ifdef USE_ENVMAP
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
#endif`,l0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,h0=`#ifdef USE_ENVMAP
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
#endif`,d0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,u0=`#ifdef USE_ENVMAP
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
#endif`,f0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,p0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,m0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,x0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,g0=`#ifdef USE_GRADIENTMAP
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
}`,_0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,v0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,M0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,S0=`uniform bool receiveShadow;
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
#endif`,y0=`#ifdef USE_ENVMAP
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
#endif`,b0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,w0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,T0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,E0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,A0=`PhysicalMaterial material;
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
#endif`,C0=`uniform sampler2D dfgLUT;
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
}`,R0=`
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
#endif`,P0=`#if defined( RE_IndirectDiffuse )
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
#endif`,L0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,D0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,I0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,U0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,N0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,F0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,O0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,B0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,z0=`#if defined( USE_POINTS_UV )
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
#endif`,k0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,V0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,G0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,H0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,W0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,X0=`#ifdef USE_MORPHTARGETS
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
#endif`,Y0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,q0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Z0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,$0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,K0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,J0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,j0=`#ifdef USE_NORMALMAP
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
#endif`,Q0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ep=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,np=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ip=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,sp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,rp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ap=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,op=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,lp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,hp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,up=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,pp=`float getShadowMask() {
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
}`,mp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,xp=`#ifdef USE_SKINNING
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
#endif`,gp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,_p=`#ifdef USE_SKINNING
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
#endif`,vp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Mp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Sp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,yp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,bp=`#ifdef USE_TRANSMISSION
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
#endif`,wp=`#ifdef USE_TRANSMISSION
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
#endif`,Tp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ep=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Rp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Pp=`uniform sampler2D t2D;
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
}`,Lp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Ip=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Up=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Np=`#include <common>
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
}`,Fp=`#if DEPTH_PACKING == 3200
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
}`,Op=`#define DISTANCE
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
}`,Bp=`#define DISTANCE
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
}`,zp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,kp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vp=`uniform float scale;
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
}`,Gp=`uniform vec3 diffuse;
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
}`,Hp=`#include <common>
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
}`,Wp=`uniform vec3 diffuse;
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
}`,Xp=`#define LAMBERT
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
}`,Yp=`#define LAMBERT
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
}`,qp=`#define MATCAP
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
}`,Zp=`#define MATCAP
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
}`,$p=`#define NORMAL
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
}`,Kp=`#define NORMAL
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
}`,Jp=`#define PHONG
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
}`,jp=`#define PHONG
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
}`,Qp=`#define STANDARD
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
}`,tm=`#define STANDARD
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
}`,em=`#define TOON
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
}`,nm=`#define TOON
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
}`,im=`uniform float size;
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
}`,sm=`uniform vec3 diffuse;
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
}`,rm=`#include <common>
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
}`,am=`uniform vec3 color;
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
}`,om=`uniform float rotation;
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
}`,cm=`uniform vec3 diffuse;
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
}`,ie={alphahash_fragment:Pf,alphahash_pars_fragment:Lf,alphamap_fragment:Df,alphamap_pars_fragment:If,alphatest_fragment:Uf,alphatest_pars_fragment:Nf,aomap_fragment:Ff,aomap_pars_fragment:Of,batching_pars_vertex:Bf,batching_vertex:zf,begin_vertex:kf,beginnormal_vertex:Vf,bsdfs:Gf,iridescence_fragment:Hf,bumpmap_pars_fragment:Wf,clipping_planes_fragment:Xf,clipping_planes_pars_fragment:Yf,clipping_planes_pars_vertex:qf,clipping_planes_vertex:Zf,color_fragment:$f,color_pars_fragment:Kf,color_pars_vertex:Jf,color_vertex:jf,common:Qf,cube_uv_reflection_fragment:t0,defaultnormal_vertex:e0,displacementmap_pars_vertex:n0,displacementmap_vertex:i0,emissivemap_fragment:s0,emissivemap_pars_fragment:r0,colorspace_fragment:a0,colorspace_pars_fragment:o0,envmap_fragment:c0,envmap_common_pars_fragment:l0,envmap_pars_fragment:h0,envmap_pars_vertex:d0,envmap_physical_pars_fragment:y0,envmap_vertex:u0,fog_vertex:f0,fog_pars_vertex:p0,fog_fragment:m0,fog_pars_fragment:x0,gradientmap_pars_fragment:g0,lightmap_pars_fragment:_0,lights_lambert_fragment:v0,lights_lambert_pars_fragment:M0,lights_pars_begin:S0,lights_toon_fragment:b0,lights_toon_pars_fragment:w0,lights_phong_fragment:T0,lights_phong_pars_fragment:E0,lights_physical_fragment:A0,lights_physical_pars_fragment:C0,lights_fragment_begin:R0,lights_fragment_maps:P0,lights_fragment_end:L0,logdepthbuf_fragment:D0,logdepthbuf_pars_fragment:I0,logdepthbuf_pars_vertex:U0,logdepthbuf_vertex:N0,map_fragment:F0,map_pars_fragment:O0,map_particle_fragment:B0,map_particle_pars_fragment:z0,metalnessmap_fragment:k0,metalnessmap_pars_fragment:V0,morphinstance_vertex:G0,morphcolor_vertex:H0,morphnormal_vertex:W0,morphtarget_pars_vertex:X0,morphtarget_vertex:Y0,normal_fragment_begin:q0,normal_fragment_maps:Z0,normal_pars_fragment:$0,normal_pars_vertex:K0,normal_vertex:J0,normalmap_pars_fragment:j0,clearcoat_normal_fragment_begin:Q0,clearcoat_normal_fragment_maps:tp,clearcoat_pars_fragment:ep,iridescence_pars_fragment:np,opaque_fragment:ip,packing:sp,premultiplied_alpha_fragment:rp,project_vertex:ap,dithering_fragment:op,dithering_pars_fragment:cp,roughnessmap_fragment:lp,roughnessmap_pars_fragment:hp,shadowmap_pars_fragment:dp,shadowmap_pars_vertex:up,shadowmap_vertex:fp,shadowmask_pars_fragment:pp,skinbase_vertex:mp,skinning_pars_vertex:xp,skinning_vertex:gp,skinnormal_vertex:_p,specularmap_fragment:vp,specularmap_pars_fragment:Mp,tonemapping_fragment:Sp,tonemapping_pars_fragment:yp,transmission_fragment:bp,transmission_pars_fragment:wp,uv_pars_fragment:Tp,uv_pars_vertex:Ep,uv_vertex:Ap,worldpos_vertex:Cp,background_vert:Rp,background_frag:Pp,backgroundCube_vert:Lp,backgroundCube_frag:Dp,cube_vert:Ip,cube_frag:Up,depth_vert:Np,depth_frag:Fp,distanceRGBA_vert:Op,distanceRGBA_frag:Bp,equirect_vert:zp,equirect_frag:kp,linedashed_vert:Vp,linedashed_frag:Gp,meshbasic_vert:Hp,meshbasic_frag:Wp,meshlambert_vert:Xp,meshlambert_frag:Yp,meshmatcap_vert:qp,meshmatcap_frag:Zp,meshnormal_vert:$p,meshnormal_frag:Kp,meshphong_vert:Jp,meshphong_frag:jp,meshphysical_vert:Qp,meshphysical_frag:tm,meshtoon_vert:em,meshtoon_frag:nm,points_vert:im,points_frag:sm,shadow_vert:rm,shadow_frag:am,sprite_vert:om,sprite_frag:cm},Tt={common:{diffuse:{value:new Zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ne},alphaMap:{value:null},alphaMapTransform:{value:new ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ne}},envmap:{envMap:{value:null},envMapRotation:{value:new ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ne},normalScale:{value:new wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ne},alphaTest:{value:0},uvTransform:{value:new ne}},sprite:{diffuse:{value:new Zt(16777215)},opacity:{value:1},center:{value:new wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ne},alphaMap:{value:null},alphaMapTransform:{value:new ne},alphaTest:{value:0}}},Gn={basic:{uniforms:ln([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:ie.meshbasic_vert,fragmentShader:ie.meshbasic_frag},lambert:{uniforms:ln([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:ie.meshlambert_vert,fragmentShader:ie.meshlambert_frag},phong:{uniforms:ln([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Zt(0)},specular:{value:new Zt(1118481)},shininess:{value:30}}]),vertexShader:ie.meshphong_vert,fragmentShader:ie.meshphong_frag},standard:{uniforms:ln([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new Zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag},toon:{uniforms:ln([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:ie.meshtoon_vert,fragmentShader:ie.meshtoon_frag},matcap:{uniforms:ln([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:ie.meshmatcap_vert,fragmentShader:ie.meshmatcap_frag},points:{uniforms:ln([Tt.points,Tt.fog]),vertexShader:ie.points_vert,fragmentShader:ie.points_frag},dashed:{uniforms:ln([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ie.linedashed_vert,fragmentShader:ie.linedashed_frag},depth:{uniforms:ln([Tt.common,Tt.displacementmap]),vertexShader:ie.depth_vert,fragmentShader:ie.depth_frag},normal:{uniforms:ln([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:ie.meshnormal_vert,fragmentShader:ie.meshnormal_frag},sprite:{uniforms:ln([Tt.sprite,Tt.fog]),vertexShader:ie.sprite_vert,fragmentShader:ie.sprite_frag},background:{uniforms:{uvTransform:{value:new ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ie.background_vert,fragmentShader:ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ne}},vertexShader:ie.backgroundCube_vert,fragmentShader:ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ie.cube_vert,fragmentShader:ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ie.equirect_vert,fragmentShader:ie.equirect_frag},distanceRGBA:{uniforms:ln([Tt.common,Tt.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ie.distanceRGBA_vert,fragmentShader:ie.distanceRGBA_frag},shadow:{uniforms:ln([Tt.lights,Tt.fog,{color:{value:new Zt(0)},opacity:{value:1}}]),vertexShader:ie.shadow_vert,fragmentShader:ie.shadow_frag}};Gn.physical={uniforms:ln([Gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ne},clearcoatNormalScale:{value:new wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ne},sheen:{value:0},sheenColor:{value:new Zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ne},transmissionSamplerSize:{value:new wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ne},attenuationDistance:{value:0},attenuationColor:{value:new Zt(0)},specularColor:{value:new Zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ne},anisotropyVector:{value:new wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ne}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag};const Nr={r:0,b:0,g:0},Ci=new zn,lm=new _e;function hm(i,t,e,n,s,r,a){const o=new Zt(0);let c=r===!0?0:1,l,d,u=null,f=0,m=null;function g(_){let y=_.isScene===!0?_.background:null;return y&&y.isTexture&&(y=(_.backgroundBlurriness>0?e:t).get(y)),y}function v(_){let y=!1;const E=g(_);E===null?h(o,c):E&&E.isColor&&(h(E,1),y=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(_,y){const E=g(y);E&&(E.isCubeTexture||E.mapping===ia)?(d===void 0&&(d=new V(new Pt(1,1,1),new en({name:"BackgroundCubeMaterial",uniforms:Ss(Gn.backgroundCube.uniforms),vertexShader:Gn.backgroundCube.vertexShader,fragmentShader:Gn.backgroundCube.fragmentShader,side:nn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(w,R,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),Ci.copy(y.backgroundRotation),Ci.x*=-1,Ci.y*=-1,Ci.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Ci.y*=-1,Ci.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(lm.makeRotationFromEuler(Ci)),d.material.toneMapped=me.getTransfer(E.colorSpace)!==ye,(u!==E||f!==E.version||m!==i.toneMapping)&&(d.material.needsUpdate=!0,u=E,f=E.version,m=i.toneMapping),d.layers.enableAll(),_.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new V(new Ue(2,2),new en({name:"BackgroundMaterial",uniforms:Ss(Gn.background.uniforms),vertexShader:Gn.background.vertexShader,fragmentShader:Gn.background.fragmentShader,side:yi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=me.getTransfer(E.colorSpace)!==ye,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||f!==E.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,u=E,f=E.version,m=i.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function h(_,y){_.getRGB(Nr,yh(i)),n.buffers.color.setClear(Nr.r,Nr.g,Nr.b,y,a)}function S(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(_,y=1){o.set(_),c=y,h(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,h(o,c)},render:v,addToRenderList:p,dispose:S}}function dm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(M,A,I,B,Y){let q=!1;const Z=u(B,I,A);r!==Z&&(r=Z,l(r.object)),q=m(M,B,I,Y),q&&g(M,B,I,Y),Y!==null&&t.update(Y,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,y(M,A,I,B),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(Y).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function d(M){return i.deleteVertexArray(M)}function u(M,A,I){const B=I.wireframe===!0;let Y=n[M.id];Y===void 0&&(Y={},n[M.id]=Y);let q=Y[A.id];q===void 0&&(q={},Y[A.id]=q);let Z=q[B];return Z===void 0&&(Z=f(c()),q[B]=Z),Z}function f(M){const A=[],I=[],B=[];for(let Y=0;Y<e;Y++)A[Y]=0,I[Y]=0,B[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:I,attributeDivisors:B,object:M,attributes:{},index:null}}function m(M,A,I,B){const Y=r.attributes,q=A.attributes;let Z=0;const ct=I.getAttributes();for(const nt in ct)if(ct[nt].location>=0){const _t=Y[nt];let N=q[nt];if(N===void 0&&(nt==="instanceMatrix"&&M.instanceMatrix&&(N=M.instanceMatrix),nt==="instanceColor"&&M.instanceColor&&(N=M.instanceColor)),_t===void 0||_t.attribute!==N||N&&_t.data!==N.data)return!0;Z++}return r.attributesNum!==Z||r.index!==B}function g(M,A,I,B){const Y={},q=A.attributes;let Z=0;const ct=I.getAttributes();for(const nt in ct)if(ct[nt].location>=0){let _t=q[nt];_t===void 0&&(nt==="instanceMatrix"&&M.instanceMatrix&&(_t=M.instanceMatrix),nt==="instanceColor"&&M.instanceColor&&(_t=M.instanceColor));const N={};N.attribute=_t,_t&&_t.data&&(N.data=_t.data),Y[nt]=N,Z++}r.attributes=Y,r.attributesNum=Z,r.index=B}function v(){const M=r.newAttributes;for(let A=0,I=M.length;A<I;A++)M[A]=0}function p(M){h(M,0)}function h(M,A){const I=r.newAttributes,B=r.enabledAttributes,Y=r.attributeDivisors;I[M]=1,B[M]===0&&(i.enableVertexAttribArray(M),B[M]=1),Y[M]!==A&&(i.vertexAttribDivisor(M,A),Y[M]=A)}function S(){const M=r.newAttributes,A=r.enabledAttributes;for(let I=0,B=A.length;I<B;I++)A[I]!==M[I]&&(i.disableVertexAttribArray(I),A[I]=0)}function _(M,A,I,B,Y,q,Z){Z===!0?i.vertexAttribIPointer(M,A,I,Y,q):i.vertexAttribPointer(M,A,I,B,Y,q)}function y(M,A,I,B){v();const Y=B.attributes,q=I.getAttributes(),Z=A.defaultAttributeValues;for(const ct in q){const nt=q[ct];if(nt.location>=0){let mt=Y[ct];if(mt===void 0&&(ct==="instanceMatrix"&&M.instanceMatrix&&(mt=M.instanceMatrix),ct==="instanceColor"&&M.instanceColor&&(mt=M.instanceColor)),mt!==void 0){const _t=mt.normalized,N=mt.itemSize,Mt=t.get(mt);if(Mt===void 0)continue;const gt=Mt.buffer,yt=Mt.type,At=Mt.bytesPerElement,X=yt===i.INT||yt===i.UNSIGNED_INT||mt.gpuType===Ko;if(mt.isInterleavedBufferAttribute){const rt=mt.data,pt=rt.stride,Dt=mt.offset;if(rt.isInstancedInterleavedBuffer){for(let Et=0;Et<nt.locationSize;Et++)h(nt.location+Et,rt.meshPerAttribute);M.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Et=0;Et<nt.locationSize;Et++)p(nt.location+Et);i.bindBuffer(i.ARRAY_BUFFER,gt);for(let Et=0;Et<nt.locationSize;Et++)_(nt.location+Et,N/nt.locationSize,yt,_t,pt*At,(Dt+N/nt.locationSize*Et)*At,X)}else{if(mt.isInstancedBufferAttribute){for(let rt=0;rt<nt.locationSize;rt++)h(nt.location+rt,mt.meshPerAttribute);M.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=mt.meshPerAttribute*mt.count)}else for(let rt=0;rt<nt.locationSize;rt++)p(nt.location+rt);i.bindBuffer(i.ARRAY_BUFFER,gt);for(let rt=0;rt<nt.locationSize;rt++)_(nt.location+rt,N/nt.locationSize,yt,_t,N*At,N/nt.locationSize*rt*At,X)}}else if(Z!==void 0){const _t=Z[ct];if(_t!==void 0)switch(_t.length){case 2:i.vertexAttrib2fv(nt.location,_t);break;case 3:i.vertexAttrib3fv(nt.location,_t);break;case 4:i.vertexAttrib4fv(nt.location,_t);break;default:i.vertexAttrib1fv(nt.location,_t)}}}}S()}function E(){P();for(const M in n){const A=n[M];for(const I in A){const B=A[I];for(const Y in B)d(B[Y].object),delete B[Y];delete A[I]}delete n[M]}}function w(M){if(n[M.id]===void 0)return;const A=n[M.id];for(const I in A){const B=A[I];for(const Y in B)d(B[Y].object),delete B[Y];delete A[I]}delete n[M.id]}function R(M){for(const A in n){const I=n[A];if(I[M.id]===void 0)continue;const B=I[M.id];for(const Y in B)d(B[Y].object),delete B[Y];delete I[M.id]}}function P(){b(),a=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:P,resetDefaultState:b,dispose:E,releaseStatesOfGeometry:w,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:p,disableUnusedAttributes:S}}function um(i,t,e){let n;function s(l){n=l}function r(l,d){i.drawArrays(n,l,d),e.update(d,n,1)}function a(l,d,u){u!==0&&(i.drawArraysInstanced(n,l,d,u),e.update(d,n,u))}function o(l,d,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,u);let m=0;for(let g=0;g<u;g++)m+=d[g];e.update(m,n,1)}function c(l,d,u,f){if(u===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<l.length;g++)a(l[g],d[g],f[g]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,d,0,f,0,u);let g=0;for(let v=0;v<u;v++)g+=d[v]*f[v];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function fm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==Nn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const P=R===Zn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==$n&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Xn&&!P)}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const d=c(l);d!==l&&(Qt("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),h=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),_=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:m,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:p,maxAttributes:h,maxVertexUniforms:S,maxVaryings:_,maxFragmentUniforms:y,vertexTextures:E,maxSamples:w}}function pm(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new Pi,o=new ne,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const m=u.length!==0||f||n!==0||s;return s=f,n=u.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=d(u,f,0)},this.setState=function(u,f,m){const g=u.clippingPlanes,v=u.clipIntersection,p=u.clipShadows,h=i.get(u);if(!s||g===null||g.length===0||r&&!p)r?d(null):l();else{const S=r?0:n,_=S*4;let y=h.clippingState||null;c.value=y,y=d(g,f,_,m);for(let E=0;E!==_;++E)y[E]=e[E];h.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(u,f,m,g){const v=u!==null?u.length:0;let p=null;if(v!==0){if(p=c.value,g!==!0||p===null){const h=m+v*4,S=f.matrixWorldInverse;o.getNormalMatrix(S),(p===null||p.length<h)&&(p=new Float32Array(h));for(let _=0,y=m;_!==v;++_,y+=4)a.copy(u[_]).applyMatrix4(S,o),a.normal.toArray(p,y),p[y+3]=a.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}function mm(i){let t=new WeakMap;function e(a,o){return o===ro?a.mapping=_s:o===ao&&(a.mapping=vs),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===ro||o===ao)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Uu(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const vi=4,gl=[.125,.215,.35,.446,.526,.582],Ii=20,xm=256,Bs=new _c,_l=new Zt;let Va=null,Ga=0,Ha=0,Wa=!1;const gm=new U;class Vo{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=gm}=r;Va=this._renderer.getRenderTarget(),Ga=this._renderer.getActiveCubeFace(),Ha=this._renderer.getActiveMipmapLevel(),Wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,o),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Sl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ml(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Va,Ga,Ha),this._renderer.xr.enabled=Wa,t.scissorTest=!1,ls(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===_s||t.mapping===vs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Va=this._renderer.getRenderTarget(),Ga=this._renderer.getActiveCubeFace(),Ha=this._renderer.getActiveMipmapLevel(),Wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:An,minFilter:An,generateMipmaps:!1,type:Zn,format:Nn,colorSpace:Ms,depthBuffer:!1},s=vl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vl(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=_m(r)),this._blurMaterial=Mm(r,t,e),this._ggxMaterial=vm(r,t,e)}return s}_compileMaterial(t){const e=new V(new ke,t);this._renderer.compile(e,Bs)}_sceneToCubeUV(t,e,n,s,r){const c=new yn(90,1,e,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,m=u.toneMapping;u.getClearColor(_l),u.toneMapping=Mi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new V(new Pt,new Te({name:"PMREM.Background",side:nn,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,p=v.material;let h=!1;const S=t.background;S?S.isColor&&(p.color.copy(S),t.background=null,h=!0):(p.color.copy(_l),h=!0);for(let _=0;_<6;_++){const y=_%3;y===0?(c.up.set(0,l[_],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[_],r.y,r.z)):y===1?(c.up.set(0,0,l[_]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[_],r.z)):(c.up.set(0,l[_],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[_]));const E=this._cubeSize;ls(s,y*E,_>2?E:0,E,E),u.setRenderTarget(s),h&&u.render(v,c),u.render(t,c)}u.toneMapping=m,u.autoClear=f,t.background=S}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===_s||t.mapping===vs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Sl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ml());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;ls(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Bs)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),d=e/(this._lodMeshes.length-1),u=Math.sqrt(l*l-d*d),f=.05+l*.95,m=u*f,{_lodMax:g}=this,v=this._sizeLods[n],p=3*v*(n>g-vi?n-g+vi:0),h=4*(this._cubeSize-v);c.envMap.value=t.texture,c.roughness.value=m,c.mipInt.value=g-e,ls(r,p,h,3*v,2*v),s.setRenderTarget(r),s.render(o,Bs),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,ls(t,p,h,3*v,2*v),s.setRenderTarget(t),s.render(o,Bs)}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Be("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=l;const f=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Ii-1),v=r/g,p=isFinite(r)?1+Math.floor(d*v):Ii;p>Ii&&Qt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Ii}`);const h=[];let S=0;for(let R=0;R<Ii;++R){const P=R/v,b=Math.exp(-P*P/2);h.push(b),R===0?S+=b:R<p&&(S+=2*b)}for(let R=0;R<h.length;R++)h[R]=h[R]/S;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=h,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:_}=this;f.dTheta.value=g,f.mipInt.value=_-n;const y=this._sizeLods[s],E=3*y*(s>_-vi?s-_+vi:0),w=4*(this._cubeSize-y);ls(e,E,w,3*y,2*y),c.setRenderTarget(e),c.render(u,Bs)}}function _m(i){const t=[],e=[],n=[];let s=i;const r=i-vi+1+gl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let c=1/o;a>i-vi?c=gl[a-i+vi-1]:a===0&&(c=0),e.push(c);const l=1/(o-2),d=-l,u=1+l,f=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,g=6,v=3,p=2,h=1,S=new Float32Array(v*g*m),_=new Float32Array(p*g*m),y=new Float32Array(h*g*m);for(let w=0;w<m;w++){const R=w%3*2/3-1,P=w>2?0:-1,b=[R,P,0,R+2/3,P,0,R+2/3,P+1,0,R,P,0,R+2/3,P+1,0,R,P+1,0];S.set(b,v*g*w),_.set(f,p*g*w);const M=[w,w,w,w,w,w];y.set(M,h*g*w)}const E=new ke;E.setAttribute("position",new On(S,v)),E.setAttribute("uv",new On(_,p)),E.setAttribute("faceIndex",new On(y,h)),n.push(new V(E,null)),s>vi&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function vl(i,t,e){const n=new Fn(i,t,e);return n.texture.mapping=ia,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ls(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function vm(i,t,e){return new en({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:xm,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ra(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Mm(i,t,e){const n=new Float32Array(Ii),s=new U(0,1,0);return new en({name:"SphericalGaussianBlur",defines:{n:Ii,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ra(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Ml(){return new en({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ra(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Sl(){return new en({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function ra(){return`

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
	`}function Sm(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===ro||c===ao,d=c===_s||c===vs;if(l||d){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new Vo(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const m=o.image;return l&&m&&m.height>0||d&&m&&s(m)?(e===null&&(e=new Vo(i)),u=l?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function ym(i){const t={};function e(n){if(t[n]!==void 0)return t[n];const s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&nr("WebGLRenderer: "+n+" extension not supported."),s}}}function bm(i,t,e,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete s[f.id];const m=r.get(f);m&&(t.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const m in f)t.update(f[m],i.ARRAY_BUFFER)}function l(u){const f=[],m=u.index,g=u.attributes.position;let v=0;if(m!==null){const S=m.array;v=m.version;for(let _=0,y=S.length;_<y;_+=3){const E=S[_+0],w=S[_+1],R=S[_+2];f.push(E,w,w,R,R,E)}}else if(g!==void 0){const S=g.array;v=g.version;for(let _=0,y=S.length/3-1;_<y;_+=3){const E=_+0,w=_+1,R=_+2;f.push(E,w,w,R,R,E)}}else return;const p=new(gh(f)?Sh:Mh)(f,1);p.version=v;const h=r.get(u);h&&t.remove(h),r.set(u,p)}function d(u){const f=r.get(u);if(f){const m=u.index;m!==null&&f.version<m.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function wm(i,t,e){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,m){i.drawElements(n,m,r,f*a),e.update(m,n,1)}function l(f,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,f*a,g),e.update(m,n,g))}function d(f,m,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,f,0,g);let p=0;for(let h=0;h<g;h++)p+=m[h];e.update(p,n,1)}function u(f,m,g,v){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let h=0;h<f.length;h++)l(f[h]/a,m[h],v[h]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,r,f,0,v,0,g);let h=0;for(let S=0;S<g;S++)h+=m[S]*v[S];e.update(h,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function Tm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Be("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Em(i,t,e){const n=new WeakMap,s=new Ee;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let M=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",M)};var m=M;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),v===!0&&(y=2),p===!0&&(y=3);let E=o.attributes.position.count*y,w=1;E>t.maxTextureSize&&(w=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);const R=new Float32Array(E*w*4*u),P=new _h(R,E,w,u);P.type=Xn,P.needsUpdate=!0;const b=y*4;for(let A=0;A<u;A++){const I=h[A],B=S[A],Y=_[A],q=E*w*4*A;for(let Z=0;Z<I.count;Z++){const ct=Z*b;g===!0&&(s.fromBufferAttribute(I,Z),R[q+ct+0]=s.x,R[q+ct+1]=s.y,R[q+ct+2]=s.z,R[q+ct+3]=0),v===!0&&(s.fromBufferAttribute(B,Z),R[q+ct+4]=s.x,R[q+ct+5]=s.y,R[q+ct+6]=s.z,R[q+ct+7]=0),p===!0&&(s.fromBufferAttribute(Y,Z),R[q+ct+8]=s.x,R[q+ct+9]=s.y,R[q+ct+10]=s.z,R[q+ct+11]=Y.itemSize===4?s.w:1)}}f={count:u,texture:P,size:new wt(E,w)},n.set(o,f),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const v=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",v),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Am(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,d=c.geometry,u=t.get(c,d);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}const Vh=new sn,yl=new Ah(1,1),Gh=new _h,Hh=new _u,Wh=new wh,bl=[],wl=[],Tl=new Float32Array(16),El=new Float32Array(9),Al=new Float32Array(4);function Es(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=bl[s];if(r===void 0&&(r=new Float32Array(s),bl[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function We(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Xe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function aa(i,t){let e=wl[t];e===void 0&&(e=new Int32Array(t),wl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Cm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Rm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;i.uniform2fv(this.addr,t),Xe(e,t)}}function Pm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(We(e,t))return;i.uniform3fv(this.addr,t),Xe(e,t)}}function Lm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;i.uniform4fv(this.addr,t),Xe(e,t)}}function Dm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;Al.set(n),i.uniformMatrix2fv(this.addr,!1,Al),Xe(e,n)}}function Im(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;El.set(n),i.uniformMatrix3fv(this.addr,!1,El),Xe(e,n)}}function Um(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;Tl.set(n),i.uniformMatrix4fv(this.addr,!1,Tl),Xe(e,n)}}function Nm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Fm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;i.uniform2iv(this.addr,t),Xe(e,t)}}function Om(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(We(e,t))return;i.uniform3iv(this.addr,t),Xe(e,t)}}function Bm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;i.uniform4iv(this.addr,t),Xe(e,t)}}function zm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function km(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;i.uniform2uiv(this.addr,t),Xe(e,t)}}function Vm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(We(e,t))return;i.uniform3uiv(this.addr,t),Xe(e,t)}}function Gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;i.uniform4uiv(this.addr,t),Xe(e,t)}}function Hm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(yl.compareFunction=xh,r=yl):r=Vh,e.setTexture2D(t||r,s)}function Wm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Hh,s)}function Xm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Wh,s)}function Ym(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Gh,s)}function qm(i){switch(i){case 5126:return Cm;case 35664:return Rm;case 35665:return Pm;case 35666:return Lm;case 35674:return Dm;case 35675:return Im;case 35676:return Um;case 5124:case 35670:return Nm;case 35667:case 35671:return Fm;case 35668:case 35672:return Om;case 35669:case 35673:return Bm;case 5125:return zm;case 36294:return km;case 36295:return Vm;case 36296:return Gm;case 35678:case 36198:case 36298:case 36306:case 35682:return Hm;case 35679:case 36299:case 36307:return Wm;case 35680:case 36300:case 36308:case 36293:return Xm;case 36289:case 36303:case 36311:case 36292:return Ym}}function Zm(i,t){i.uniform1fv(this.addr,t)}function $m(i,t){const e=Es(t,this.size,2);i.uniform2fv(this.addr,e)}function Km(i,t){const e=Es(t,this.size,3);i.uniform3fv(this.addr,e)}function Jm(i,t){const e=Es(t,this.size,4);i.uniform4fv(this.addr,e)}function jm(i,t){const e=Es(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Qm(i,t){const e=Es(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function tx(i,t){const e=Es(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function ex(i,t){i.uniform1iv(this.addr,t)}function nx(i,t){i.uniform2iv(this.addr,t)}function ix(i,t){i.uniform3iv(this.addr,t)}function sx(i,t){i.uniform4iv(this.addr,t)}function rx(i,t){i.uniform1uiv(this.addr,t)}function ax(i,t){i.uniform2uiv(this.addr,t)}function ox(i,t){i.uniform3uiv(this.addr,t)}function cx(i,t){i.uniform4uiv(this.addr,t)}function lx(i,t,e){const n=this.cache,s=t.length,r=aa(e,s);We(n,r)||(i.uniform1iv(this.addr,r),Xe(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Vh,r[a])}function hx(i,t,e){const n=this.cache,s=t.length,r=aa(e,s);We(n,r)||(i.uniform1iv(this.addr,r),Xe(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Hh,r[a])}function dx(i,t,e){const n=this.cache,s=t.length,r=aa(e,s);We(n,r)||(i.uniform1iv(this.addr,r),Xe(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Wh,r[a])}function ux(i,t,e){const n=this.cache,s=t.length,r=aa(e,s);We(n,r)||(i.uniform1iv(this.addr,r),Xe(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Gh,r[a])}function fx(i){switch(i){case 5126:return Zm;case 35664:return $m;case 35665:return Km;case 35666:return Jm;case 35674:return jm;case 35675:return Qm;case 35676:return tx;case 5124:case 35670:return ex;case 35667:case 35671:return nx;case 35668:case 35672:return ix;case 35669:case 35673:return sx;case 5125:return rx;case 36294:return ax;case 36295:return ox;case 36296:return cx;case 35678:case 36198:case 36298:case 36306:case 35682:return lx;case 35679:case 36299:case 36307:return hx;case 35680:case 36300:case 36308:case 36293:return dx;case 36289:case 36303:case 36311:case 36292:return ux}}class px{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=qm(e.type)}}class mx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=fx(e.type)}}class xx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Xa=/(\w+)(\])?(\[|\.)?/g;function Cl(i,t){i.seq.push(t),i.map[t.id]=t}function gx(i,t,e){const n=i.name,s=n.length;for(Xa.lastIndex=0;;){const r=Xa.exec(n),a=Xa.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Cl(e,l===void 0?new px(o,i,t):new mx(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new xx(o),Cl(e,u)),e=u}}}class Xr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);gx(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Rl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const _x=37297;let vx=0;function Mx(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Pl=new ne;function Sx(i){me._getMatrix(Pl,me.workingColorSpace,i);const t=`mat3( ${Pl.elements.map(e=>e.toFixed(4))} )`;switch(me.getTransfer(i)){case Kr:return[t,"LinearTransferOETF"];case ye:return[t,"sRGBTransferOETF"];default:return Qt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Ll(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Mx(i.getShaderSource(t),o)}else return r}function yx(i,t){const e=Sx(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function bx(i,t){let e;switch(t){case ih:e="Linear";break;case sh:e="Reinhard";break;case rh:e="Cineon";break;case $o:e="ACESFilmic";break;case oh:e="AgX";break;case ch:e="Neutral";break;case ah:e="Custom";break;default:Qt("WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Fr=new U;function wx(){me.getLuminanceCoefficients(Fr);const i=Fr.x.toFixed(4),t=Fr.y.toFixed(4),e=Fr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Tx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Vs).join(`
`)}function Ex(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Ax(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Vs(i){return i!==""}function Dl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Il(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Cx=/^[ \t]*#include +<([\w\d./]+)>/gm;function Go(i){return i.replace(Cx,Px)}const Rx=new Map;function Px(i,t){let e=ie[t];if(e===void 0){const n=Rx.get(t);if(n!==void 0)e=ie[n],Qt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Go(e)}const Lx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ul(i){return i.replace(Lx,Dx)}function Dx(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Nl(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function Ix(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===eh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===nh?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ii&&(t="SHADOWMAP_TYPE_VSM"),t}function Ux(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case _s:case vs:t="ENVMAP_TYPE_CUBE";break;case ia:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Nx(i){let t="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===vs&&(t="ENVMAP_MODE_REFRACTION"),t}function Fx(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Zo:t="ENVMAP_BLENDING_MULTIPLY";break;case Fd:t="ENVMAP_BLENDING_MIX";break;case Od:t="ENVMAP_BLENDING_ADD";break}return t}function Ox(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Bx(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=Ix(e),l=Ux(e),d=Nx(e),u=Fx(e),f=Ox(e),m=Tx(e),g=Ex(r),v=s.createProgram();let p,h,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Vs).join(`
`),p.length>0&&(p+=`
`),h=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Vs).join(`
`),h.length>0&&(h+=`
`)):(p=[Nl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Vs).join(`
`),h=[Nl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Mi?"#define TONE_MAPPING":"",e.toneMapping!==Mi?ie.tonemapping_pars_fragment:"",e.toneMapping!==Mi?bx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ie.colorspace_pars_fragment,yx("linearToOutputTexel",e.outputColorSpace),wx(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Vs).join(`
`)),a=Go(a),a=Dl(a,e),a=Il(a,e),o=Go(o),o=Dl(o,e),o=Il(o,e),a=Ul(a),o=Ul(o),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,h=["#define varying in",e.glslVersion===Dc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Dc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const _=S+p+a,y=S+h+o,E=Rl(s,s.VERTEX_SHADER,_),w=Rl(s,s.FRAGMENT_SHADER,y);s.attachShader(v,E),s.attachShader(v,w),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function R(A){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(v)||"",B=s.getShaderInfoLog(E)||"",Y=s.getShaderInfoLog(w)||"",q=I.trim(),Z=B.trim(),ct=Y.trim();let nt=!0,mt=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(nt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,E,w);else{const _t=Ll(s,E,"vertex"),N=Ll(s,w,"fragment");Be("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+q+`
`+_t+`
`+N)}else q!==""?Qt("WebGLProgram: Program Info Log:",q):(Z===""||ct==="")&&(mt=!1);mt&&(A.diagnostics={runnable:nt,programLog:q,vertexShader:{log:Z,prefix:p},fragmentShader:{log:ct,prefix:h}})}s.deleteShader(E),s.deleteShader(w),P=new Xr(s,v),b=Ax(s,v)}let P;this.getUniforms=function(){return P===void 0&&R(this),P};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,_x)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=vx++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=w,this}let zx=0;class kx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Vx(t),e.set(t,n)),n}}class Vx{constructor(t){this.id=zx++,this.code=t,this.usedTimes=0}}function Gx(i,t,e,n,s,r,a){const o=new cc,c=new kx,l=new Set,d=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return l.add(b),b===0?"uv":`uv${b}`}function p(b,M,A,I,B){const Y=I.fog,q=B.geometry,Z=b.isMeshStandardMaterial?I.environment:null,ct=(b.isMeshStandardMaterial?e:t).get(b.envMap||Z),nt=ct&&ct.mapping===ia?ct.image.height:null,mt=g[b.type];b.precision!==null&&(m=s.getMaxPrecision(b.precision),m!==b.precision&&Qt("WebGLProgram.getParameters:",b.precision,"not supported, using",m,"instead."));const _t=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,N=_t!==void 0?_t.length:0;let Mt=0;q.morphAttributes.position!==void 0&&(Mt=1),q.morphAttributes.normal!==void 0&&(Mt=2),q.morphAttributes.color!==void 0&&(Mt=3);let gt,yt,At,X;if(mt){const Ft=Gn[mt];gt=Ft.vertexShader,yt=Ft.fragmentShader}else gt=b.vertexShader,yt=b.fragmentShader,c.update(b),At=c.getVertexShaderID(b),X=c.getFragmentShaderID(b);const rt=i.getRenderTarget(),pt=i.state.buffers.depth.getReversed(),Dt=B.isInstancedMesh===!0,Et=B.isBatchedMesh===!0,Wt=!!b.map,ve=!!b.matcap,Yt=!!ct,Me=!!b.aoMap,F=!!b.lightMap,ee=!!b.bumpMap,ae=!!b.normalMap,Se=!!b.displacementMap,It=!!b.emissiveMap,Pe=!!b.metalnessMap,Ot=!!b.roughnessMap,qt=b.anisotropy>0,D=b.clearcoat>0,T=b.dispersion>0,H=b.iridescence>0,lt=b.sheen>0,ft=b.transmission>0,et=qt&&!!b.anisotropyMap,Bt=D&&!!b.clearcoatMap,bt=D&&!!b.clearcoatNormalMap,kt=D&&!!b.clearcoatRoughnessMap,Nt=H&&!!b.iridescenceMap,ut=H&&!!b.iridescenceThicknessMap,O=lt&&!!b.sheenColorMap,z=lt&&!!b.sheenRoughnessMap,W=!!b.specularMap,$=!!b.specularColorMap,it=!!b.specularIntensityMap,L=ft&&!!b.transmissionMap,st=ft&&!!b.thicknessMap,ot=!!b.gradientMap,at=!!b.alphaMap,tt=b.alphaTest>0,J=!!b.alphaHash,vt=!!b.extensions;let xt=Mi;b.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(xt=i.toneMapping);const dt={shaderID:mt,shaderType:b.type,shaderName:b.name,vertexShader:gt,fragmentShader:yt,defines:b.defines,customVertexShaderID:At,customFragmentShaderID:X,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:m,batching:Et,batchingColor:Et&&B._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&B.instanceColor!==null,instancingMorph:Dt&&B.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:rt===null?i.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:Ms,alphaToCoverage:!!b.alphaToCoverage,map:Wt,matcap:ve,envMap:Yt,envMapMode:Yt&&ct.mapping,envMapCubeUVHeight:nt,aoMap:Me,lightMap:F,bumpMap:ee,normalMap:ae,displacementMap:f&&Se,emissiveMap:It,normalMapObjectSpace:ae&&b.normalMapType===Vd,normalMapTangentSpace:ae&&b.normalMapType===sc,metalnessMap:Pe,roughnessMap:Ot,anisotropy:qt,anisotropyMap:et,clearcoat:D,clearcoatMap:Bt,clearcoatNormalMap:bt,clearcoatRoughnessMap:kt,dispersion:T,iridescence:H,iridescenceMap:Nt,iridescenceThicknessMap:ut,sheen:lt,sheenColorMap:O,sheenRoughnessMap:z,specularMap:W,specularColorMap:$,specularIntensityMap:it,transmission:ft,transmissionMap:L,thicknessMap:st,gradientMap:ot,opaque:b.transparent===!1&&b.blending===fs&&b.alphaToCoverage===!1,alphaMap:at,alphaTest:tt,alphaHash:J,combine:b.combine,mapUv:Wt&&v(b.map.channel),aoMapUv:Me&&v(b.aoMap.channel),lightMapUv:F&&v(b.lightMap.channel),bumpMapUv:ee&&v(b.bumpMap.channel),normalMapUv:ae&&v(b.normalMap.channel),displacementMapUv:Se&&v(b.displacementMap.channel),emissiveMapUv:It&&v(b.emissiveMap.channel),metalnessMapUv:Pe&&v(b.metalnessMap.channel),roughnessMapUv:Ot&&v(b.roughnessMap.channel),anisotropyMapUv:et&&v(b.anisotropyMap.channel),clearcoatMapUv:Bt&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:bt&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:kt&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Nt&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:ut&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:O&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:z&&v(b.sheenRoughnessMap.channel),specularMapUv:W&&v(b.specularMap.channel),specularColorMapUv:$&&v(b.specularColorMap.channel),specularIntensityMapUv:it&&v(b.specularIntensityMap.channel),transmissionMapUv:L&&v(b.transmissionMap.channel),thicknessMapUv:st&&v(b.thicknessMap.channel),alphaMapUv:at&&v(b.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(ae||qt),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!q.attributes.uv&&(Wt||at),fog:!!Y,useFog:b.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:pt,skinning:B.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:N,morphTextureStride:Mt,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:xt,decodeVideoTexture:Wt&&b.map.isVideoTexture===!0&&me.getTransfer(b.map.colorSpace)===ye,decodeVideoTextureEmissive:It&&b.emissiveMap.isVideoTexture===!0&&me.getTransfer(b.emissiveMap.colorSpace)===ye,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===ue,flipSided:b.side===nn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:vt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(vt&&b.extensions.multiDraw===!0||Et)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return dt.vertexUv1s=l.has(1),dt.vertexUv2s=l.has(2),dt.vertexUv3s=l.has(3),l.clear(),dt}function h(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const A in b.defines)M.push(A),M.push(b.defines[A]);return b.isRawShaderMaterial===!1&&(S(M,b),_(M,b),M.push(i.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function S(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function _(b,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),b.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),b.push(o.mask)}function y(b){const M=g[b.type];let A;if(M){const I=Gn[M];A=sr.clone(I.uniforms)}else A=b.uniforms;return A}function E(b,M){let A;for(let I=0,B=d.length;I<B;I++){const Y=d[I];if(Y.cacheKey===M){A=Y,++A.usedTimes;break}}return A===void 0&&(A=new Bx(i,M,b,r),d.push(A)),A}function w(b){if(--b.usedTimes===0){const M=d.indexOf(b);d[M]=d[d.length-1],d.pop(),b.destroy()}}function R(b){c.remove(b)}function P(){c.dispose()}return{getParameters:p,getProgramCacheKey:h,getUniforms:y,acquireProgram:E,releaseProgram:w,releaseShaderCache:R,programs:d,dispose:P}}function Hx(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Wx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Fl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ol(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,f,m,g,v,p){let h=i[t];return h===void 0?(h={id:u.id,object:u,geometry:f,material:m,groupOrder:g,renderOrder:u.renderOrder,z:v,group:p},i[t]=h):(h.id=u.id,h.object=u,h.geometry=f,h.material=m,h.groupOrder=g,h.renderOrder=u.renderOrder,h.z=v,h.group=p),t++,h}function o(u,f,m,g,v,p){const h=a(u,f,m,g,v,p);m.transmission>0?n.push(h):m.transparent===!0?s.push(h):e.push(h)}function c(u,f,m,g,v,p){const h=a(u,f,m,g,v,p);m.transmission>0?n.unshift(h):m.transparent===!0?s.unshift(h):e.unshift(h)}function l(u,f){e.length>1&&e.sort(u||Wx),n.length>1&&n.sort(f||Fl),s.length>1&&s.sort(f||Fl)}function d(){for(let u=t,f=i.length;u<f;u++){const m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:d,sort:l}}function Xx(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Ol,i.set(n,[a])):s>=r.length?(a=new Ol,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Yx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new Zt};break;case"SpotLight":e={position:new U,direction:new U,color:new Zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new Zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new Zt,groundColor:new Zt};break;case"RectAreaLight":e={color:new Zt,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function qx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Zx=0;function $x(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Kx(i){const t=new Yx,e=qx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);const s=new U,r=new _e,a=new _e;function o(l){let d=0,u=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let m=0,g=0,v=0,p=0,h=0,S=0,_=0,y=0,E=0,w=0,R=0;l.sort($x);for(let b=0,M=l.length;b<M;b++){const A=l[b],I=A.color,B=A.intensity,Y=A.distance,q=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)d+=I.r*B,u+=I.g*B,f+=I.b*B;else if(A.isLightProbe){for(let Z=0;Z<9;Z++)n.probe[Z].addScaledVector(A.sh.coefficients[Z],B);R++}else if(A.isDirectionalLight){const Z=t.get(A);if(Z.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const ct=A.shadow,nt=e.get(A);nt.shadowIntensity=ct.intensity,nt.shadowBias=ct.bias,nt.shadowNormalBias=ct.normalBias,nt.shadowRadius=ct.radius,nt.shadowMapSize=ct.mapSize,n.directionalShadow[m]=nt,n.directionalShadowMap[m]=q,n.directionalShadowMatrix[m]=A.shadow.matrix,S++}n.directional[m]=Z,m++}else if(A.isSpotLight){const Z=t.get(A);Z.position.setFromMatrixPosition(A.matrixWorld),Z.color.copy(I).multiplyScalar(B),Z.distance=Y,Z.coneCos=Math.cos(A.angle),Z.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),Z.decay=A.decay,n.spot[v]=Z;const ct=A.shadow;if(A.map&&(n.spotLightMap[E]=A.map,E++,ct.updateMatrices(A),A.castShadow&&w++),n.spotLightMatrix[v]=ct.matrix,A.castShadow){const nt=e.get(A);nt.shadowIntensity=ct.intensity,nt.shadowBias=ct.bias,nt.shadowNormalBias=ct.normalBias,nt.shadowRadius=ct.radius,nt.shadowMapSize=ct.mapSize,n.spotShadow[v]=nt,n.spotShadowMap[v]=q,y++}v++}else if(A.isRectAreaLight){const Z=t.get(A);Z.color.copy(I).multiplyScalar(B),Z.halfWidth.set(A.width*.5,0,0),Z.halfHeight.set(0,A.height*.5,0),n.rectArea[p]=Z,p++}else if(A.isPointLight){const Z=t.get(A);if(Z.color.copy(A.color).multiplyScalar(A.intensity),Z.distance=A.distance,Z.decay=A.decay,A.castShadow){const ct=A.shadow,nt=e.get(A);nt.shadowIntensity=ct.intensity,nt.shadowBias=ct.bias,nt.shadowNormalBias=ct.normalBias,nt.shadowRadius=ct.radius,nt.shadowMapSize=ct.mapSize,nt.shadowCameraNear=ct.camera.near,nt.shadowCameraFar=ct.camera.far,n.pointShadow[g]=nt,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=A.shadow.matrix,_++}n.point[g]=Z,g++}else if(A.isHemisphereLight){const Z=t.get(A);Z.skyColor.copy(A.color).multiplyScalar(B),Z.groundColor.copy(A.groundColor).multiplyScalar(B),n.hemi[h]=Z,h++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Tt.LTC_FLOAT_1,n.rectAreaLTC2=Tt.LTC_FLOAT_2):(n.rectAreaLTC1=Tt.LTC_HALF_1,n.rectAreaLTC2=Tt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=f;const P=n.hash;(P.directionalLength!==m||P.pointLength!==g||P.spotLength!==v||P.rectAreaLength!==p||P.hemiLength!==h||P.numDirectionalShadows!==S||P.numPointShadows!==_||P.numSpotShadows!==y||P.numSpotMaps!==E||P.numLightProbes!==R)&&(n.directional.length=m,n.spot.length=v,n.rectArea.length=p,n.point.length=g,n.hemi.length=h,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=y+E-w,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=R,P.directionalLength=m,P.pointLength=g,P.spotLength=v,P.rectAreaLength=p,P.hemiLength=h,P.numDirectionalShadows=S,P.numPointShadows=_,P.numSpotShadows=y,P.numSpotMaps=E,P.numLightProbes=R,n.version=Zx++)}function c(l,d){let u=0,f=0,m=0,g=0,v=0;const p=d.matrixWorldInverse;for(let h=0,S=l.length;h<S;h++){const _=l[h];if(_.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),u++}else if(_.isSpotLight){const y=n.spot[m];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),m++}else if(_.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(p),a.identity(),r.copy(_.matrixWorld),r.premultiply(p),a.extractRotation(r),y.halfWidth.set(_.width*.5,0,0),y.halfHeight.set(0,_.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(_.isPointLight){const y=n.point[f];y.position.setFromMatrixPosition(_.matrixWorld),y.position.applyMatrix4(p),f++}else if(_.isHemisphereLight){const y=n.hemi[v];y.direction.setFromMatrixPosition(_.matrixWorld),y.direction.transformDirection(p),v++}}}return{setup:o,setupView:c,state:n}}function Bl(i){const t=new Kx(i),e=[],n=[];function s(d){l.camera=d,e.length=0,n.length=0}function r(d){e.push(d)}function a(d){n.push(d)}function o(){t.setup(e)}function c(d){t.setupView(e,d)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Jx(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Bl(i),t.set(s,[o])):r>=a.length?(o=new Bl(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const jx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Qx=`uniform sampler2D shadow_pass;
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
}`;function tg(i,t,e){let n=new hc;const s=new wt,r=new wt,a=new Ee,o=new Sf({depthPacking:kd}),c=new yf,l={},d=e.maxTextureSize,u={[yi]:nn,[nn]:yi,[ue]:ue},f=new en({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new wt},radius:{value:4}},vertexShader:jx,fragmentShader:Qx}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const g=new ke;g.setAttribute("position",new On(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new V(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=eh;let h=this.type;this.render=function(w,R,P){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const b=i.getRenderTarget(),M=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),I=i.state;I.setBlending(qn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const B=h!==ii&&this.type===ii,Y=h===ii&&this.type!==ii;for(let q=0,Z=w.length;q<Z;q++){const ct=w[q],nt=ct.shadow;if(nt===void 0){Qt("WebGLShadowMap:",ct,"has no shadow.");continue}if(nt.autoUpdate===!1&&nt.needsUpdate===!1)continue;s.copy(nt.mapSize);const mt=nt.getFrameExtents();if(s.multiply(mt),r.copy(nt.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/mt.x),s.x=r.x*mt.x,nt.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/mt.y),s.y=r.y*mt.y,nt.mapSize.y=r.y)),nt.map===null||B===!0||Y===!0){const N=this.type!==ii?{minFilter:bn,magFilter:bn}:{};nt.map!==null&&nt.map.dispose(),nt.map=new Fn(s.x,s.y,N),nt.map.texture.name=ct.name+".shadowMap",nt.camera.updateProjectionMatrix()}i.setRenderTarget(nt.map),i.clear();const _t=nt.getViewportCount();for(let N=0;N<_t;N++){const Mt=nt.getViewport(N);a.set(r.x*Mt.x,r.y*Mt.y,r.x*Mt.z,r.y*Mt.w),I.viewport(a),nt.updateMatrices(ct,N),n=nt.getFrustum(),y(R,P,nt.camera,ct,this.type)}nt.isPointLightShadow!==!0&&this.type===ii&&S(nt,P),nt.needsUpdate=!1}h=this.type,p.needsUpdate=!1,i.setRenderTarget(b,M,A)};function S(w,R){const P=t.update(v);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Fn(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(R,null,P,f,v,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(R,null,P,m,v,null)}function _(w,R,P,b){let M=null;const A=P.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(A!==void 0)M=A;else if(M=P.isPointLight===!0?c:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const I=M.uuid,B=R.uuid;let Y=l[I];Y===void 0&&(Y={},l[I]=Y);let q=Y[B];q===void 0&&(q=M.clone(),Y[B]=q,R.addEventListener("dispose",E)),M=q}if(M.visible=R.visible,M.wireframe=R.wireframe,b===ii?M.side=R.shadowSide!==null?R.shadowSide:R.side:M.side=R.shadowSide!==null?R.shadowSide:u[R.side],M.alphaMap=R.alphaMap,M.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,M.map=R.map,M.clipShadows=R.clipShadows,M.clippingPlanes=R.clippingPlanes,M.clipIntersection=R.clipIntersection,M.displacementMap=R.displacementMap,M.displacementScale=R.displacementScale,M.displacementBias=R.displacementBias,M.wireframeLinewidth=R.wireframeLinewidth,M.linewidth=R.linewidth,P.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const I=i.properties.get(M);I.light=P}return M}function y(w,R,P,b,M){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===ii)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,w.matrixWorld);const B=t.update(w),Y=w.material;if(Array.isArray(Y)){const q=B.groups;for(let Z=0,ct=q.length;Z<ct;Z++){const nt=q[Z],mt=Y[nt.materialIndex];if(mt&&mt.visible){const _t=_(w,mt,b,M);w.onBeforeShadow(i,w,R,P,B,_t,nt),i.renderBufferDirect(P,null,B,_t,w,nt),w.onAfterShadow(i,w,R,P,B,_t,nt)}}}else if(Y.visible){const q=_(w,Y,b,M);w.onBeforeShadow(i,w,R,P,B,q,null),i.renderBufferDirect(P,null,B,q,w,null),w.onAfterShadow(i,w,R,P,B,q,null)}}const I=w.children;for(let B=0,Y=I.length;B<Y;B++)y(I[B],R,P,b,M)}function E(w){w.target.removeEventListener("dispose",E);for(const P in l){const b=l[P],M=w.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const eg={[ja]:Qa,[to]:io,[eo]:so,[gs]:no,[Qa]:ja,[io]:to,[so]:eo,[no]:gs};function ng(i,t){function e(){let L=!1;const st=new Ee;let ot=null;const at=new Ee(0,0,0,0);return{setMask:function(tt){ot!==tt&&!L&&(i.colorMask(tt,tt,tt,tt),ot=tt)},setLocked:function(tt){L=tt},setClear:function(tt,J,vt,xt,dt){dt===!0&&(tt*=xt,J*=xt,vt*=xt),st.set(tt,J,vt,xt),at.equals(st)===!1&&(i.clearColor(tt,J,vt,xt),at.copy(st))},reset:function(){L=!1,ot=null,at.set(-1,0,0,0)}}}function n(){let L=!1,st=!1,ot=null,at=null,tt=null;return{setReversed:function(J){if(st!==J){const vt=t.get("EXT_clip_control");J?vt.clipControlEXT(vt.LOWER_LEFT_EXT,vt.ZERO_TO_ONE_EXT):vt.clipControlEXT(vt.LOWER_LEFT_EXT,vt.NEGATIVE_ONE_TO_ONE_EXT),st=J;const xt=tt;tt=null,this.setClear(xt)}},getReversed:function(){return st},setTest:function(J){J?rt(i.DEPTH_TEST):pt(i.DEPTH_TEST)},setMask:function(J){ot!==J&&!L&&(i.depthMask(J),ot=J)},setFunc:function(J){if(st&&(J=eg[J]),at!==J){switch(J){case ja:i.depthFunc(i.NEVER);break;case Qa:i.depthFunc(i.ALWAYS);break;case to:i.depthFunc(i.LESS);break;case gs:i.depthFunc(i.LEQUAL);break;case eo:i.depthFunc(i.EQUAL);break;case no:i.depthFunc(i.GEQUAL);break;case io:i.depthFunc(i.GREATER);break;case so:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}at=J}},setLocked:function(J){L=J},setClear:function(J){tt!==J&&(st&&(J=1-J),i.clearDepth(J),tt=J)},reset:function(){L=!1,ot=null,at=null,tt=null,st=!1}}}function s(){let L=!1,st=null,ot=null,at=null,tt=null,J=null,vt=null,xt=null,dt=null;return{setTest:function(Ft){L||(Ft?rt(i.STENCIL_TEST):pt(i.STENCIL_TEST))},setMask:function(Ft){st!==Ft&&!L&&(i.stencilMask(Ft),st=Ft)},setFunc:function(Ft,$t,de){(ot!==Ft||at!==$t||tt!==de)&&(i.stencilFunc(Ft,$t,de),ot=Ft,at=$t,tt=de)},setOp:function(Ft,$t,de){(J!==Ft||vt!==$t||xt!==de)&&(i.stencilOp(Ft,$t,de),J=Ft,vt=$t,xt=de)},setLocked:function(Ft){L=Ft},setClear:function(Ft){dt!==Ft&&(i.clearStencil(Ft),dt=Ft)},reset:function(){L=!1,st=null,ot=null,at=null,tt=null,J=null,vt=null,xt=null,dt=null}}}const r=new e,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let d={},u={},f=new WeakMap,m=[],g=null,v=!1,p=null,h=null,S=null,_=null,y=null,E=null,w=null,R=new Zt(0,0,0),P=0,b=!1,M=null,A=null,I=null,B=null,Y=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,ct=0;const nt=i.getParameter(i.VERSION);nt.indexOf("WebGL")!==-1?(ct=parseFloat(/^WebGL (\d)/.exec(nt)[1]),Z=ct>=1):nt.indexOf("OpenGL ES")!==-1&&(ct=parseFloat(/^OpenGL ES (\d)/.exec(nt)[1]),Z=ct>=2);let mt=null,_t={};const N=i.getParameter(i.SCISSOR_BOX),Mt=i.getParameter(i.VIEWPORT),gt=new Ee().fromArray(N),yt=new Ee().fromArray(Mt);function At(L,st,ot,at){const tt=new Uint8Array(4),J=i.createTexture();i.bindTexture(L,J),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let vt=0;vt<ot;vt++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(st,0,i.RGBA,1,1,at,0,i.RGBA,i.UNSIGNED_BYTE,tt):i.texImage2D(st+vt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,tt);return J}const X={};X[i.TEXTURE_2D]=At(i.TEXTURE_2D,i.TEXTURE_2D,1),X[i.TEXTURE_CUBE_MAP]=At(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),X[i.TEXTURE_2D_ARRAY]=At(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),X[i.TEXTURE_3D]=At(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),rt(i.DEPTH_TEST),a.setFunc(gs),ee(!1),ae(Ac),rt(i.CULL_FACE),Me(qn);function rt(L){d[L]!==!0&&(i.enable(L),d[L]=!0)}function pt(L){d[L]!==!1&&(i.disable(L),d[L]=!1)}function Dt(L,st){return u[L]!==st?(i.bindFramebuffer(L,st),u[L]=st,L===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=st),L===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=st),!0):!1}function Et(L,st){let ot=m,at=!1;if(L){ot=f.get(st),ot===void 0&&(ot=[],f.set(st,ot));const tt=L.textures;if(ot.length!==tt.length||ot[0]!==i.COLOR_ATTACHMENT0){for(let J=0,vt=tt.length;J<vt;J++)ot[J]=i.COLOR_ATTACHMENT0+J;ot.length=tt.length,at=!0}}else ot[0]!==i.BACK&&(ot[0]=i.BACK,at=!0);at&&i.drawBuffers(ot)}function Wt(L){return g!==L?(i.useProgram(L),g=L,!0):!1}const ve={[Di]:i.FUNC_ADD,[vd]:i.FUNC_SUBTRACT,[Md]:i.FUNC_REVERSE_SUBTRACT};ve[Sd]=i.MIN,ve[yd]=i.MAX;const Yt={[bd]:i.ZERO,[wd]:i.ONE,[Td]:i.SRC_COLOR,[Ka]:i.SRC_ALPHA,[Ld]:i.SRC_ALPHA_SATURATE,[Rd]:i.DST_COLOR,[Ad]:i.DST_ALPHA,[Ed]:i.ONE_MINUS_SRC_COLOR,[Ja]:i.ONE_MINUS_SRC_ALPHA,[Pd]:i.ONE_MINUS_DST_COLOR,[Cd]:i.ONE_MINUS_DST_ALPHA,[Dd]:i.CONSTANT_COLOR,[Id]:i.ONE_MINUS_CONSTANT_COLOR,[Ud]:i.CONSTANT_ALPHA,[Nd]:i.ONE_MINUS_CONSTANT_ALPHA};function Me(L,st,ot,at,tt,J,vt,xt,dt,Ft){if(L===qn){v===!0&&(pt(i.BLEND),v=!1);return}if(v===!1&&(rt(i.BLEND),v=!0),L!==_d){if(L!==p||Ft!==b){if((h!==Di||y!==Di)&&(i.blendEquation(i.FUNC_ADD),h=Di,y=Di),Ft)switch(L){case fs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ui:i.blendFunc(i.ONE,i.ONE);break;case Cc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Rc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Be("WebGLState: Invalid blending: ",L);break}else switch(L){case fs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ui:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Cc:Be("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Rc:Be("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Be("WebGLState: Invalid blending: ",L);break}S=null,_=null,E=null,w=null,R.set(0,0,0),P=0,p=L,b=Ft}return}tt=tt||st,J=J||ot,vt=vt||at,(st!==h||tt!==y)&&(i.blendEquationSeparate(ve[st],ve[tt]),h=st,y=tt),(ot!==S||at!==_||J!==E||vt!==w)&&(i.blendFuncSeparate(Yt[ot],Yt[at],Yt[J],Yt[vt]),S=ot,_=at,E=J,w=vt),(xt.equals(R)===!1||dt!==P)&&(i.blendColor(xt.r,xt.g,xt.b,dt),R.copy(xt),P=dt),p=L,b=!1}function F(L,st){L.side===ue?pt(i.CULL_FACE):rt(i.CULL_FACE);let ot=L.side===nn;st&&(ot=!ot),ee(ot),L.blending===fs&&L.transparent===!1?Me(qn):Me(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const at=L.stencilWrite;o.setTest(at),at&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),It(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?rt(i.SAMPLE_ALPHA_TO_COVERAGE):pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function ee(L){M!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),M=L)}function ae(L){L!==xd?(rt(i.CULL_FACE),L!==A&&(L===Ac?i.cullFace(i.BACK):L===gd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pt(i.CULL_FACE),A=L}function Se(L){L!==I&&(Z&&i.lineWidth(L),I=L)}function It(L,st,ot){L?(rt(i.POLYGON_OFFSET_FILL),(B!==st||Y!==ot)&&(i.polygonOffset(st,ot),B=st,Y=ot)):pt(i.POLYGON_OFFSET_FILL)}function Pe(L){L?rt(i.SCISSOR_TEST):pt(i.SCISSOR_TEST)}function Ot(L){L===void 0&&(L=i.TEXTURE0+q-1),mt!==L&&(i.activeTexture(L),mt=L)}function qt(L,st,ot){ot===void 0&&(mt===null?ot=i.TEXTURE0+q-1:ot=mt);let at=_t[ot];at===void 0&&(at={type:void 0,texture:void 0},_t[ot]=at),(at.type!==L||at.texture!==st)&&(mt!==ot&&(i.activeTexture(ot),mt=ot),i.bindTexture(L,st||X[L]),at.type=L,at.texture=st)}function D(){const L=_t[mt];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function T(){try{i.compressedTexImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function H(){try{i.compressedTexImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function lt(){try{i.texSubImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function ft(){try{i.texSubImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function et(){try{i.compressedTexSubImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function Bt(){try{i.compressedTexSubImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function bt(){try{i.texStorage2D(...arguments)}catch(L){L("WebGLState:",L)}}function kt(){try{i.texStorage3D(...arguments)}catch(L){L("WebGLState:",L)}}function Nt(){try{i.texImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function ut(){try{i.texImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function O(L){gt.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),gt.copy(L))}function z(L){yt.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),yt.copy(L))}function W(L,st){let ot=l.get(st);ot===void 0&&(ot=new WeakMap,l.set(st,ot));let at=ot.get(L);at===void 0&&(at=i.getUniformBlockIndex(st,L.name),ot.set(L,at))}function $(L,st){const at=l.get(st).get(L);c.get(st)!==at&&(i.uniformBlockBinding(st,at,L.__bindingPointIndex),c.set(st,at))}function it(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},mt=null,_t={},u={},f=new WeakMap,m=[],g=null,v=!1,p=null,h=null,S=null,_=null,y=null,E=null,w=null,R=new Zt(0,0,0),P=0,b=!1,M=null,A=null,I=null,B=null,Y=null,gt.set(0,0,i.canvas.width,i.canvas.height),yt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:rt,disable:pt,bindFramebuffer:Dt,drawBuffers:Et,useProgram:Wt,setBlending:Me,setMaterial:F,setFlipSided:ee,setCullFace:ae,setLineWidth:Se,setPolygonOffset:It,setScissorTest:Pe,activeTexture:Ot,bindTexture:qt,unbindTexture:D,compressedTexImage2D:T,compressedTexImage3D:H,texImage2D:Nt,texImage3D:ut,updateUBOMapping:W,uniformBlockBinding:$,texStorage2D:bt,texStorage3D:kt,texSubImage2D:lt,texSubImage3D:ft,compressedTexSubImage2D:et,compressedTexSubImage3D:Bt,scissor:O,viewport:z,reset:it}}function ig(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new wt,d=new WeakMap;let u;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,T){return m?new OffscreenCanvas(D,T):jr("canvas")}function v(D,T,H){let lt=1;const ft=qt(D);if((ft.width>H||ft.height>H)&&(lt=H/Math.max(ft.width,ft.height)),lt<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const et=Math.floor(lt*ft.width),Bt=Math.floor(lt*ft.height);u===void 0&&(u=g(et,Bt));const bt=T?g(et,Bt):u;return bt.width=et,bt.height=Bt,bt.getContext("2d").drawImage(D,0,0,et,Bt),Qt("WebGLRenderer: Texture has been resized from ("+ft.width+"x"+ft.height+") to ("+et+"x"+Bt+")."),bt}else return"data"in D&&Qt("WebGLRenderer: Image in DataTexture is too big ("+ft.width+"x"+ft.height+")."),D;return D}function p(D){return D.generateMipmaps}function h(D){i.generateMipmap(D)}function S(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function _(D,T,H,lt,ft=!1){if(D!==null){if(i[D]!==void 0)return i[D];Qt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let et=T;if(T===i.RED&&(H===i.FLOAT&&(et=i.R32F),H===i.HALF_FLOAT&&(et=i.R16F),H===i.UNSIGNED_BYTE&&(et=i.R8)),T===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(et=i.R8UI),H===i.UNSIGNED_SHORT&&(et=i.R16UI),H===i.UNSIGNED_INT&&(et=i.R32UI),H===i.BYTE&&(et=i.R8I),H===i.SHORT&&(et=i.R16I),H===i.INT&&(et=i.R32I)),T===i.RG&&(H===i.FLOAT&&(et=i.RG32F),H===i.HALF_FLOAT&&(et=i.RG16F),H===i.UNSIGNED_BYTE&&(et=i.RG8)),T===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(et=i.RG8UI),H===i.UNSIGNED_SHORT&&(et=i.RG16UI),H===i.UNSIGNED_INT&&(et=i.RG32UI),H===i.BYTE&&(et=i.RG8I),H===i.SHORT&&(et=i.RG16I),H===i.INT&&(et=i.RG32I)),T===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(et=i.RGB8UI),H===i.UNSIGNED_SHORT&&(et=i.RGB16UI),H===i.UNSIGNED_INT&&(et=i.RGB32UI),H===i.BYTE&&(et=i.RGB8I),H===i.SHORT&&(et=i.RGB16I),H===i.INT&&(et=i.RGB32I)),T===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(et=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(et=i.RGBA16UI),H===i.UNSIGNED_INT&&(et=i.RGBA32UI),H===i.BYTE&&(et=i.RGBA8I),H===i.SHORT&&(et=i.RGBA16I),H===i.INT&&(et=i.RGBA32I)),T===i.RGB&&(H===i.UNSIGNED_INT_5_9_9_9_REV&&(et=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(et=i.R11F_G11F_B10F)),T===i.RGBA){const Bt=ft?Kr:me.getTransfer(lt);H===i.FLOAT&&(et=i.RGBA32F),H===i.HALF_FLOAT&&(et=i.RGBA16F),H===i.UNSIGNED_BYTE&&(et=Bt===ye?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(et=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(et=i.RGB5_A1)}return(et===i.R16F||et===i.R32F||et===i.RG16F||et===i.RG32F||et===i.RGBA16F||et===i.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function y(D,T){let H;return D?T===null||T===Vi||T===Qs?H=i.DEPTH24_STENCIL8:T===Xn?H=i.DEPTH32F_STENCIL8:T===js&&(H=i.DEPTH24_STENCIL8,Qt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Vi||T===Qs?H=i.DEPTH_COMPONENT24:T===Xn?H=i.DEPTH_COMPONENT32F:T===js&&(H=i.DEPTH_COMPONENT16),H}function E(D,T){return p(D)===!0||D.isFramebufferTexture&&D.minFilter!==bn&&D.minFilter!==An?Math.log2(Math.max(T.width,T.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?T.mipmaps.length:1}function w(D){const T=D.target;T.removeEventListener("dispose",w),P(T),T.isVideoTexture&&d.delete(T)}function R(D){const T=D.target;T.removeEventListener("dispose",R),M(T)}function P(D){const T=n.get(D);if(T.__webglInit===void 0)return;const H=D.source,lt=f.get(H);if(lt){const ft=lt[T.__cacheKey];ft.usedTimes--,ft.usedTimes===0&&b(D),Object.keys(lt).length===0&&f.delete(H)}n.remove(D)}function b(D){const T=n.get(D);i.deleteTexture(T.__webglTexture);const H=D.source,lt=f.get(H);delete lt[T.__cacheKey],a.memory.textures--}function M(D){const T=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let lt=0;lt<6;lt++){if(Array.isArray(T.__webglFramebuffer[lt]))for(let ft=0;ft<T.__webglFramebuffer[lt].length;ft++)i.deleteFramebuffer(T.__webglFramebuffer[lt][ft]);else i.deleteFramebuffer(T.__webglFramebuffer[lt]);T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer[lt])}else{if(Array.isArray(T.__webglFramebuffer))for(let lt=0;lt<T.__webglFramebuffer.length;lt++)i.deleteFramebuffer(T.__webglFramebuffer[lt]);else i.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&i.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let lt=0;lt<T.__webglColorRenderbuffer.length;lt++)T.__webglColorRenderbuffer[lt]&&i.deleteRenderbuffer(T.__webglColorRenderbuffer[lt]);T.__webglDepthRenderbuffer&&i.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const H=D.textures;for(let lt=0,ft=H.length;lt<ft;lt++){const et=n.get(H[lt]);et.__webglTexture&&(i.deleteTexture(et.__webglTexture),a.memory.textures--),n.remove(H[lt])}n.remove(D)}let A=0;function I(){A=0}function B(){const D=A;return D>=s.maxTextures&&Qt("WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),A+=1,D}function Y(D){const T=[];return T.push(D.wrapS),T.push(D.wrapT),T.push(D.wrapR||0),T.push(D.magFilter),T.push(D.minFilter),T.push(D.anisotropy),T.push(D.internalFormat),T.push(D.format),T.push(D.type),T.push(D.generateMipmaps),T.push(D.premultiplyAlpha),T.push(D.flipY),T.push(D.unpackAlignment),T.push(D.colorSpace),T.join()}function q(D,T){const H=n.get(D);if(D.isVideoTexture&&Pe(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&H.__version!==D.version){const lt=D.image;if(lt===null)Qt("WebGLRenderer: Texture marked for update but no image data found.");else if(lt.complete===!1)Qt("WebGLRenderer: Texture marked for update but image is incomplete");else{X(H,D,T);return}}else D.isExternalTexture&&(H.__webglTexture=D.sourceTexture?D.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+T)}function Z(D,T){const H=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&H.__version!==D.version){X(H,D,T);return}else D.isExternalTexture&&(H.__webglTexture=D.sourceTexture?D.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+T)}function ct(D,T){const H=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&H.__version!==D.version){X(H,D,T);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+T)}function nt(D,T){const H=n.get(D);if(D.version>0&&H.__version!==D.version){rt(H,D,T);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+T)}const mt={[rn]:i.REPEAT,[ri]:i.CLAMP_TO_EDGE,[oo]:i.MIRRORED_REPEAT},_t={[bn]:i.NEAREST,[Bd]:i.NEAREST_MIPMAP_NEAREST,[dr]:i.NEAREST_MIPMAP_LINEAR,[An]:i.LINEAR,[ua]:i.LINEAR_MIPMAP_NEAREST,[Ni]:i.LINEAR_MIPMAP_LINEAR},N={[Gd]:i.NEVER,[Zd]:i.ALWAYS,[Hd]:i.LESS,[xh]:i.LEQUAL,[Wd]:i.EQUAL,[qd]:i.GEQUAL,[Xd]:i.GREATER,[Yd]:i.NOTEQUAL};function Mt(D,T){if(T.type===Xn&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===An||T.magFilter===ua||T.magFilter===dr||T.magFilter===Ni||T.minFilter===An||T.minFilter===ua||T.minFilter===dr||T.minFilter===Ni)&&Qt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,mt[T.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,mt[T.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,mt[T.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,_t[T.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,_t[T.minFilter]),T.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,N[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===bn||T.minFilter!==dr&&T.minFilter!==Ni||T.type===Xn&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(D,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function gt(D,T){let H=!1;D.__webglInit===void 0&&(D.__webglInit=!0,T.addEventListener("dispose",w));const lt=T.source;let ft=f.get(lt);ft===void 0&&(ft={},f.set(lt,ft));const et=Y(T);if(et!==D.__cacheKey){ft[et]===void 0&&(ft[et]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),ft[et].usedTimes++;const Bt=ft[D.__cacheKey];Bt!==void 0&&(ft[D.__cacheKey].usedTimes--,Bt.usedTimes===0&&b(T)),D.__cacheKey=et,D.__webglTexture=ft[et].texture}return H}function yt(D,T,H){return Math.floor(Math.floor(D/H)/T)}function At(D,T,H,lt){const et=D.updateRanges;if(et.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,T.width,T.height,H,lt,T.data);else{et.sort((ut,O)=>ut.start-O.start);let Bt=0;for(let ut=1;ut<et.length;ut++){const O=et[Bt],z=et[ut],W=O.start+O.count,$=yt(z.start,T.width,4),it=yt(O.start,T.width,4);z.start<=W+1&&$===it&&yt(z.start+z.count-1,T.width,4)===$?O.count=Math.max(O.count,z.start+z.count-O.start):(++Bt,et[Bt]=z)}et.length=Bt+1;const bt=i.getParameter(i.UNPACK_ROW_LENGTH),kt=i.getParameter(i.UNPACK_SKIP_PIXELS),Nt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,T.width);for(let ut=0,O=et.length;ut<O;ut++){const z=et[ut],W=Math.floor(z.start/4),$=Math.ceil(z.count/4),it=W%T.width,L=Math.floor(W/T.width),st=$,ot=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,it),i.pixelStorei(i.UNPACK_SKIP_ROWS,L),e.texSubImage2D(i.TEXTURE_2D,0,it,L,st,ot,H,lt,T.data)}D.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,bt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,kt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Nt)}}function X(D,T,H){let lt=i.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(lt=i.TEXTURE_2D_ARRAY),T.isData3DTexture&&(lt=i.TEXTURE_3D);const ft=gt(D,T),et=T.source;e.bindTexture(lt,D.__webglTexture,i.TEXTURE0+H);const Bt=n.get(et);if(et.version!==Bt.__version||ft===!0){e.activeTexture(i.TEXTURE0+H);const bt=me.getPrimaries(me.workingColorSpace),kt=T.colorSpace===_i?null:me.getPrimaries(T.colorSpace),Nt=T.colorSpace===_i||bt===kt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);let ut=v(T.image,!1,s.maxTextureSize);ut=Ot(T,ut);const O=r.convert(T.format,T.colorSpace),z=r.convert(T.type);let W=_(T.internalFormat,O,z,T.colorSpace,T.isVideoTexture);Mt(lt,T);let $;const it=T.mipmaps,L=T.isVideoTexture!==!0,st=Bt.__version===void 0||ft===!0,ot=et.dataReady,at=E(T,ut);if(T.isDepthTexture)W=y(T.format===er,T.type),st&&(L?e.texStorage2D(i.TEXTURE_2D,1,W,ut.width,ut.height):e.texImage2D(i.TEXTURE_2D,0,W,ut.width,ut.height,0,O,z,null));else if(T.isDataTexture)if(it.length>0){L&&st&&e.texStorage2D(i.TEXTURE_2D,at,W,it[0].width,it[0].height);for(let tt=0,J=it.length;tt<J;tt++)$=it[tt],L?ot&&e.texSubImage2D(i.TEXTURE_2D,tt,0,0,$.width,$.height,O,z,$.data):e.texImage2D(i.TEXTURE_2D,tt,W,$.width,$.height,0,O,z,$.data);T.generateMipmaps=!1}else L?(st&&e.texStorage2D(i.TEXTURE_2D,at,W,ut.width,ut.height),ot&&At(T,ut,O,z)):e.texImage2D(i.TEXTURE_2D,0,W,ut.width,ut.height,0,O,z,ut.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){L&&st&&e.texStorage3D(i.TEXTURE_2D_ARRAY,at,W,it[0].width,it[0].height,ut.depth);for(let tt=0,J=it.length;tt<J;tt++)if($=it[tt],T.format!==Nn)if(O!==null)if(L){if(ot)if(T.layerUpdates.size>0){const vt=xl($.width,$.height,T.format,T.type);for(const xt of T.layerUpdates){const dt=$.data.subarray(xt*vt/$.data.BYTES_PER_ELEMENT,(xt+1)*vt/$.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,xt,$.width,$.height,1,O,dt)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,0,$.width,$.height,ut.depth,O,$.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,tt,W,$.width,$.height,ut.depth,0,$.data,0,0);else Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?ot&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,0,$.width,$.height,ut.depth,O,z,$.data):e.texImage3D(i.TEXTURE_2D_ARRAY,tt,W,$.width,$.height,ut.depth,0,O,z,$.data)}else{L&&st&&e.texStorage2D(i.TEXTURE_2D,at,W,it[0].width,it[0].height);for(let tt=0,J=it.length;tt<J;tt++)$=it[tt],T.format!==Nn?O!==null?L?ot&&e.compressedTexSubImage2D(i.TEXTURE_2D,tt,0,0,$.width,$.height,O,$.data):e.compressedTexImage2D(i.TEXTURE_2D,tt,W,$.width,$.height,0,$.data):Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?ot&&e.texSubImage2D(i.TEXTURE_2D,tt,0,0,$.width,$.height,O,z,$.data):e.texImage2D(i.TEXTURE_2D,tt,W,$.width,$.height,0,O,z,$.data)}else if(T.isDataArrayTexture)if(L){if(st&&e.texStorage3D(i.TEXTURE_2D_ARRAY,at,W,ut.width,ut.height,ut.depth),ot)if(T.layerUpdates.size>0){const tt=xl(ut.width,ut.height,T.format,T.type);for(const J of T.layerUpdates){const vt=ut.data.subarray(J*tt/ut.data.BYTES_PER_ELEMENT,(J+1)*tt/ut.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,J,ut.width,ut.height,1,O,z,vt)}T.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ut.width,ut.height,ut.depth,O,z,ut.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,W,ut.width,ut.height,ut.depth,0,O,z,ut.data);else if(T.isData3DTexture)L?(st&&e.texStorage3D(i.TEXTURE_3D,at,W,ut.width,ut.height,ut.depth),ot&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ut.width,ut.height,ut.depth,O,z,ut.data)):e.texImage3D(i.TEXTURE_3D,0,W,ut.width,ut.height,ut.depth,0,O,z,ut.data);else if(T.isFramebufferTexture){if(st)if(L)e.texStorage2D(i.TEXTURE_2D,at,W,ut.width,ut.height);else{let tt=ut.width,J=ut.height;for(let vt=0;vt<at;vt++)e.texImage2D(i.TEXTURE_2D,vt,W,tt,J,0,O,z,null),tt>>=1,J>>=1}}else if(it.length>0){if(L&&st){const tt=qt(it[0]);e.texStorage2D(i.TEXTURE_2D,at,W,tt.width,tt.height)}for(let tt=0,J=it.length;tt<J;tt++)$=it[tt],L?ot&&e.texSubImage2D(i.TEXTURE_2D,tt,0,0,O,z,$):e.texImage2D(i.TEXTURE_2D,tt,W,O,z,$);T.generateMipmaps=!1}else if(L){if(st){const tt=qt(ut);e.texStorage2D(i.TEXTURE_2D,at,W,tt.width,tt.height)}ot&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,O,z,ut)}else e.texImage2D(i.TEXTURE_2D,0,W,O,z,ut);p(T)&&h(lt),Bt.__version=et.version,T.onUpdate&&T.onUpdate(T)}D.__version=T.version}function rt(D,T,H){if(T.image.length!==6)return;const lt=gt(D,T),ft=T.source;e.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+H);const et=n.get(ft);if(ft.version!==et.__version||lt===!0){e.activeTexture(i.TEXTURE0+H);const Bt=me.getPrimaries(me.workingColorSpace),bt=T.colorSpace===_i?null:me.getPrimaries(T.colorSpace),kt=T.colorSpace===_i||Bt===bt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,kt);const Nt=T.isCompressedTexture||T.image[0].isCompressedTexture,ut=T.image[0]&&T.image[0].isDataTexture,O=[];for(let J=0;J<6;J++)!Nt&&!ut?O[J]=v(T.image[J],!0,s.maxCubemapSize):O[J]=ut?T.image[J].image:T.image[J],O[J]=Ot(T,O[J]);const z=O[0],W=r.convert(T.format,T.colorSpace),$=r.convert(T.type),it=_(T.internalFormat,W,$,T.colorSpace),L=T.isVideoTexture!==!0,st=et.__version===void 0||lt===!0,ot=ft.dataReady;let at=E(T,z);Mt(i.TEXTURE_CUBE_MAP,T);let tt;if(Nt){L&&st&&e.texStorage2D(i.TEXTURE_CUBE_MAP,at,it,z.width,z.height);for(let J=0;J<6;J++){tt=O[J].mipmaps;for(let vt=0;vt<tt.length;vt++){const xt=tt[vt];T.format!==Nn?W!==null?L?ot&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,0,0,xt.width,xt.height,W,xt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,it,xt.width,xt.height,0,xt.data):Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?ot&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,0,0,xt.width,xt.height,W,$,xt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt,it,xt.width,xt.height,0,W,$,xt.data)}}}else{if(tt=T.mipmaps,L&&st){tt.length>0&&at++;const J=qt(O[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,at,it,J.width,J.height)}for(let J=0;J<6;J++)if(ut){L?ot&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,O[J].width,O[J].height,W,$,O[J].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,it,O[J].width,O[J].height,0,W,$,O[J].data);for(let vt=0;vt<tt.length;vt++){const dt=tt[vt].image[J].image;L?ot&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,0,0,dt.width,dt.height,W,$,dt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,it,dt.width,dt.height,0,W,$,dt.data)}}else{L?ot&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,W,$,O[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,it,W,$,O[J]);for(let vt=0;vt<tt.length;vt++){const xt=tt[vt];L?ot&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,0,0,W,$,xt.image[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,vt+1,it,W,$,xt.image[J])}}}p(T)&&h(i.TEXTURE_CUBE_MAP),et.__version=ft.version,T.onUpdate&&T.onUpdate(T)}D.__version=T.version}function pt(D,T,H,lt,ft,et){const Bt=r.convert(H.format,H.colorSpace),bt=r.convert(H.type),kt=_(H.internalFormat,Bt,bt,H.colorSpace),Nt=n.get(T),ut=n.get(H);if(ut.__renderTarget=T,!Nt.__hasExternalTextures){const O=Math.max(1,T.width>>et),z=Math.max(1,T.height>>et);ft===i.TEXTURE_3D||ft===i.TEXTURE_2D_ARRAY?e.texImage3D(ft,et,kt,O,z,T.depth,0,Bt,bt,null):e.texImage2D(ft,et,kt,O,z,0,Bt,bt,null)}e.bindFramebuffer(i.FRAMEBUFFER,D),It(T)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,lt,ft,ut.__webglTexture,0,Se(T)):(ft===i.TEXTURE_2D||ft>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ft<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,lt,ft,ut.__webglTexture,et),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Dt(D,T,H){if(i.bindRenderbuffer(i.RENDERBUFFER,D),T.depthBuffer){const lt=T.depthTexture,ft=lt&&lt.isDepthTexture?lt.type:null,et=y(T.stencilBuffer,ft),Bt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,bt=Se(T);It(T)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,bt,et,T.width,T.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,bt,et,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,et,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Bt,i.RENDERBUFFER,D)}else{const lt=T.textures;for(let ft=0;ft<lt.length;ft++){const et=lt[ft],Bt=r.convert(et.format,et.colorSpace),bt=r.convert(et.type),kt=_(et.internalFormat,Bt,bt,et.colorSpace),Nt=Se(T);H&&It(T)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,kt,T.width,T.height):It(T)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Nt,kt,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,kt,T.width,T.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Et(D,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,D),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const lt=n.get(T.depthTexture);lt.__renderTarget=T,(!lt.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),q(T.depthTexture,0);const ft=lt.__webglTexture,et=Se(T);if(T.depthTexture.format===tr)It(T)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ft,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ft,0);else if(T.depthTexture.format===er)It(T)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ft,0,et):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ft,0);else throw new Error("Unknown depthTexture format")}function Wt(D){const T=n.get(D),H=D.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==D.depthTexture){const lt=D.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),lt){const ft=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,lt.removeEventListener("dispose",ft)};lt.addEventListener("dispose",ft),T.__depthDisposeCallback=ft}T.__boundDepthTexture=lt}if(D.depthTexture&&!T.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");const lt=D.texture.mipmaps;lt&&lt.length>0?Et(T.__webglFramebuffer[0],D):Et(T.__webglFramebuffer,D)}else if(H){T.__webglDepthbuffer=[];for(let lt=0;lt<6;lt++)if(e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[lt]),T.__webglDepthbuffer[lt]===void 0)T.__webglDepthbuffer[lt]=i.createRenderbuffer(),Dt(T.__webglDepthbuffer[lt],D,!1);else{const ft=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=T.__webglDepthbuffer[lt];i.bindRenderbuffer(i.RENDERBUFFER,et),i.framebufferRenderbuffer(i.FRAMEBUFFER,ft,i.RENDERBUFFER,et)}}else{const lt=D.texture.mipmaps;if(lt&&lt.length>0?e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=i.createRenderbuffer(),Dt(T.__webglDepthbuffer,D,!1);else{const ft=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=T.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,et),i.framebufferRenderbuffer(i.FRAMEBUFFER,ft,i.RENDERBUFFER,et)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ve(D,T,H){const lt=n.get(D);T!==void 0&&pt(lt.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&Wt(D)}function Yt(D){const T=D.texture,H=n.get(D),lt=n.get(T);D.addEventListener("dispose",R);const ft=D.textures,et=D.isWebGLCubeRenderTarget===!0,Bt=ft.length>1;if(Bt||(lt.__webglTexture===void 0&&(lt.__webglTexture=i.createTexture()),lt.__version=T.version,a.memory.textures++),et){H.__webglFramebuffer=[];for(let bt=0;bt<6;bt++)if(T.mipmaps&&T.mipmaps.length>0){H.__webglFramebuffer[bt]=[];for(let kt=0;kt<T.mipmaps.length;kt++)H.__webglFramebuffer[bt][kt]=i.createFramebuffer()}else H.__webglFramebuffer[bt]=i.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){H.__webglFramebuffer=[];for(let bt=0;bt<T.mipmaps.length;bt++)H.__webglFramebuffer[bt]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(Bt)for(let bt=0,kt=ft.length;bt<kt;bt++){const Nt=n.get(ft[bt]);Nt.__webglTexture===void 0&&(Nt.__webglTexture=i.createTexture(),a.memory.textures++)}if(D.samples>0&&It(D)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let bt=0;bt<ft.length;bt++){const kt=ft[bt];H.__webglColorRenderbuffer[bt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[bt]);const Nt=r.convert(kt.format,kt.colorSpace),ut=r.convert(kt.type),O=_(kt.internalFormat,Nt,ut,kt.colorSpace,D.isXRRenderTarget===!0),z=Se(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,z,O,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.RENDERBUFFER,H.__webglColorRenderbuffer[bt])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Dt(H.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(et){e.bindTexture(i.TEXTURE_CUBE_MAP,lt.__webglTexture),Mt(i.TEXTURE_CUBE_MAP,T);for(let bt=0;bt<6;bt++)if(T.mipmaps&&T.mipmaps.length>0)for(let kt=0;kt<T.mipmaps.length;kt++)pt(H.__webglFramebuffer[bt][kt],D,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,kt);else pt(H.__webglFramebuffer[bt],D,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0);p(T)&&h(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Bt){for(let bt=0,kt=ft.length;bt<kt;bt++){const Nt=ft[bt],ut=n.get(Nt);let O=i.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(O=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(O,ut.__webglTexture),Mt(O,Nt),pt(H.__webglFramebuffer,D,Nt,i.COLOR_ATTACHMENT0+bt,O,0),p(Nt)&&h(O)}e.unbindTexture()}else{let bt=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(bt=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(bt,lt.__webglTexture),Mt(bt,T),T.mipmaps&&T.mipmaps.length>0)for(let kt=0;kt<T.mipmaps.length;kt++)pt(H.__webglFramebuffer[kt],D,T,i.COLOR_ATTACHMENT0,bt,kt);else pt(H.__webglFramebuffer,D,T,i.COLOR_ATTACHMENT0,bt,0);p(T)&&h(bt),e.unbindTexture()}D.depthBuffer&&Wt(D)}function Me(D){const T=D.textures;for(let H=0,lt=T.length;H<lt;H++){const ft=T[H];if(p(ft)){const et=S(D),Bt=n.get(ft).__webglTexture;e.bindTexture(et,Bt),h(et),e.unbindTexture()}}}const F=[],ee=[];function ae(D){if(D.samples>0){if(It(D)===!1){const T=D.textures,H=D.width,lt=D.height;let ft=i.COLOR_BUFFER_BIT;const et=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Bt=n.get(D),bt=T.length>1;if(bt)for(let Nt=0;Nt<T.length;Nt++)e.bindFramebuffer(i.FRAMEBUFFER,Bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Bt.__webglMultisampledFramebuffer);const kt=D.texture.mipmaps;kt&&kt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Bt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Bt.__webglFramebuffer);for(let Nt=0;Nt<T.length;Nt++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(ft|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(ft|=i.STENCIL_BUFFER_BIT)),bt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Bt.__webglColorRenderbuffer[Nt]);const ut=n.get(T[Nt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ut,0)}i.blitFramebuffer(0,0,H,lt,0,0,H,lt,ft,i.NEAREST),c===!0&&(F.length=0,ee.length=0,F.push(i.COLOR_ATTACHMENT0+Nt),D.depthBuffer&&D.resolveDepthBuffer===!1&&(F.push(et),ee.push(et),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ee)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,F))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),bt)for(let Nt=0;Nt<T.length;Nt++){e.bindFramebuffer(i.FRAMEBUFFER,Bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.RENDERBUFFER,Bt.__webglColorRenderbuffer[Nt]);const ut=n.get(T[Nt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.TEXTURE_2D,ut,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Bt.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){const T=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[T])}}}function Se(D){return Math.min(s.maxSamples,D.samples)}function It(D){const T=n.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Pe(D){const T=a.render.frame;d.get(D)!==T&&(d.set(D,T),D.update())}function Ot(D,T){const H=D.colorSpace,lt=D.format,ft=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||H!==Ms&&H!==_i&&(me.getTransfer(H)===ye?(lt!==Nn||ft!==$n)&&Qt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Be("WebGLTextures: Unsupported texture color space:",H)),T}function qt(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(l.width=D.naturalWidth||D.width,l.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(l.width=D.displayWidth,l.height=D.displayHeight):(l.width=D.width,l.height=D.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=I,this.setTexture2D=q,this.setTexture2DArray=Z,this.setTexture3D=ct,this.setTextureCube=nt,this.rebindTextures=ve,this.setupRenderTarget=Yt,this.updateRenderTargetMipmap=Me,this.updateMultisampleRenderTarget=ae,this.setupDepthRenderbuffer=Wt,this.setupFrameBufferTexture=pt,this.useMultisampledRTT=It}function sg(i,t){function e(n,s=_i){let r;const a=me.getTransfer(s);if(n===$n)return i.UNSIGNED_BYTE;if(n===Jo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===jo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===uh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===fh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===hh)return i.BYTE;if(n===dh)return i.SHORT;if(n===js)return i.UNSIGNED_SHORT;if(n===Ko)return i.INT;if(n===Vi)return i.UNSIGNED_INT;if(n===Xn)return i.FLOAT;if(n===Zn)return i.HALF_FLOAT;if(n===ph)return i.ALPHA;if(n===mh)return i.RGB;if(n===Nn)return i.RGBA;if(n===tr)return i.DEPTH_COMPONENT;if(n===er)return i.DEPTH_STENCIL;if(n===Qo)return i.RED;if(n===tc)return i.RED_INTEGER;if(n===ec)return i.RG;if(n===nc)return i.RG_INTEGER;if(n===ic)return i.RGBA_INTEGER;if(n===Vr||n===Gr||n===Hr||n===Wr)if(a===ye)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Vr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Vr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Gr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Wr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===co||n===lo||n===ho||n===uo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===co)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===lo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ho)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===uo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===fo||n===po||n===mo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===fo||n===po)return a===ye?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===mo)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===xo||n===go||n===_o||n===vo||n===Mo||n===So||n===yo||n===bo||n===wo||n===To||n===Eo||n===Ao||n===Co||n===Ro)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===xo)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===go)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===_o)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===vo)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Mo)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===So)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===yo)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===bo)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===wo)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===To)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Eo)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ao)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Co)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ro)return a===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Po||n===Lo||n===Do)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Po)return a===ye?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Lo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Do)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Io||n===Uo||n===No||n===Fo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Io)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Uo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===No)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Fo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Qs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const rg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ag=`
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

}`;class og{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Ch(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new en({vertexShader:rg,fragmentShader:ag,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new V(new Ue(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class cg extends ws{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,u=null,f=null,m=null,g=null;const v=typeof XRWebGLBinding<"u",p=new og,h={},S=e.getContextAttributes();let _=null,y=null;const E=[],w=[],R=new wt;let P=null;const b=new yn;b.viewport=new Ee;const M=new yn;M.viewport=new Ee;const A=[b,M],I=new Ef;let B=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let rt=E[X];return rt===void 0&&(rt=new Ia,E[X]=rt),rt.getTargetRaySpace()},this.getControllerGrip=function(X){let rt=E[X];return rt===void 0&&(rt=new Ia,E[X]=rt),rt.getGripSpace()},this.getHand=function(X){let rt=E[X];return rt===void 0&&(rt=new Ia,E[X]=rt),rt.getHandSpace()};function q(X){const rt=w.indexOf(X.inputSource);if(rt===-1)return;const pt=E[rt];pt!==void 0&&(pt.update(X.inputSource,X.frame,l||a),pt.dispatchEvent({type:X.type,data:X.inputSource}))}function Z(){s.removeEventListener("select",q),s.removeEventListener("selectstart",q),s.removeEventListener("selectend",q),s.removeEventListener("squeeze",q),s.removeEventListener("squeezestart",q),s.removeEventListener("squeezeend",q),s.removeEventListener("end",Z),s.removeEventListener("inputsourceschange",ct);for(let X=0;X<E.length;X++){const rt=w[X];rt!==null&&(w[X]=null,E[X].disconnect(rt))}B=null,Y=null,p.reset();for(const X in h)delete h[X];t.setRenderTarget(_),m=null,f=null,u=null,s=null,y=null,At.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&Qt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&Qt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(_=t.getRenderTarget(),s.addEventListener("select",q),s.addEventListener("selectstart",q),s.addEventListener("selectend",q),s.addEventListener("squeeze",q),s.addEventListener("squeezestart",q),s.addEventListener("squeezeend",q),s.addEventListener("end",Z),s.addEventListener("inputsourceschange",ct),S.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let pt=null,Dt=null,Et=null;S.depth&&(Et=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,pt=S.stencil?er:tr,Dt=S.stencil?Qs:Vi);const Wt={colorFormat:e.RGBA8,depthFormat:Et,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Wt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),y=new Fn(f.textureWidth,f.textureHeight,{format:Nn,type:$n,depthTexture:new Ah(f.textureWidth,f.textureHeight,Dt,void 0,void 0,void 0,void 0,void 0,void 0,pt),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const pt={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,pt),s.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new Fn(m.framebufferWidth,m.framebufferHeight,{format:Nn,type:$n,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),At.setContext(s),At.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function ct(X){for(let rt=0;rt<X.removed.length;rt++){const pt=X.removed[rt],Dt=w.indexOf(pt);Dt>=0&&(w[Dt]=null,E[Dt].disconnect(pt))}for(let rt=0;rt<X.added.length;rt++){const pt=X.added[rt];let Dt=w.indexOf(pt);if(Dt===-1){for(let Wt=0;Wt<E.length;Wt++)if(Wt>=w.length){w.push(pt),Dt=Wt;break}else if(w[Wt]===null){w[Wt]=pt,Dt=Wt;break}if(Dt===-1)break}const Et=E[Dt];Et&&Et.connect(pt)}}const nt=new U,mt=new U;function _t(X,rt,pt){nt.setFromMatrixPosition(rt.matrixWorld),mt.setFromMatrixPosition(pt.matrixWorld);const Dt=nt.distanceTo(mt),Et=rt.projectionMatrix.elements,Wt=pt.projectionMatrix.elements,ve=Et[14]/(Et[10]-1),Yt=Et[14]/(Et[10]+1),Me=(Et[9]+1)/Et[5],F=(Et[9]-1)/Et[5],ee=(Et[8]-1)/Et[0],ae=(Wt[8]+1)/Wt[0],Se=ve*ee,It=ve*ae,Pe=Dt/(-ee+ae),Ot=Pe*-ee;if(rt.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Ot),X.translateZ(Pe),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Et[10]===-1)X.projectionMatrix.copy(rt.projectionMatrix),X.projectionMatrixInverse.copy(rt.projectionMatrixInverse);else{const qt=ve+Pe,D=Yt+Pe,T=Se-Ot,H=It+(Dt-Ot),lt=Me*Yt/D*qt,ft=F*Yt/D*qt;X.projectionMatrix.makePerspective(T,H,lt,ft,qt,D),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function N(X,rt){rt===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(rt.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;let rt=X.near,pt=X.far;p.texture!==null&&(p.depthNear>0&&(rt=p.depthNear),p.depthFar>0&&(pt=p.depthFar)),I.near=M.near=b.near=rt,I.far=M.far=b.far=pt,(B!==I.near||Y!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),B=I.near,Y=I.far),I.layers.mask=X.layers.mask|6,b.layers.mask=I.layers.mask&3,M.layers.mask=I.layers.mask&5;const Dt=X.parent,Et=I.cameras;N(I,Dt);for(let Wt=0;Wt<Et.length;Wt++)N(Et[Wt],Dt);Et.length===2?_t(I,b,M):I.projectionMatrix.copy(b.projectionMatrix),Mt(X,I,Dt)};function Mt(X,rt,pt){pt===null?X.matrix.copy(rt.matrixWorld):(X.matrix.copy(pt.matrixWorld),X.matrix.invert(),X.matrix.multiply(rt.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(rt.projectionMatrix),X.projectionMatrixInverse.copy(rt.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=ir*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(f===null&&m===null))return c},this.setFoveation=function(X){c=X,f!==null&&(f.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(I)},this.getCameraTexture=function(X){return h[X]};let gt=null;function yt(X,rt){if(d=rt.getViewerPose(l||a),g=rt,d!==null){const pt=d.views;m!==null&&(t.setRenderTargetFramebuffer(y,m.framebuffer),t.setRenderTarget(y));let Dt=!1;pt.length!==I.cameras.length&&(I.cameras.length=0,Dt=!0);for(let Yt=0;Yt<pt.length;Yt++){const Me=pt[Yt];let F=null;if(m!==null)F=m.getViewport(Me);else{const ae=u.getViewSubImage(f,Me);F=ae.viewport,Yt===0&&(t.setRenderTargetTextures(y,ae.colorTexture,ae.depthStencilTexture),t.setRenderTarget(y))}let ee=A[Yt];ee===void 0&&(ee=new yn,ee.layers.enable(Yt),ee.viewport=new Ee,A[Yt]=ee),ee.matrix.fromArray(Me.transform.matrix),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.projectionMatrix.fromArray(Me.projectionMatrix),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert(),ee.viewport.set(F.x,F.y,F.width,F.height),Yt===0&&(I.matrix.copy(ee.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Dt===!0&&I.cameras.push(ee)}const Et=s.enabledFeatures;if(Et&&Et.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const Yt=u.getDepthInformation(pt[0]);Yt&&Yt.isValid&&Yt.texture&&p.init(Yt,s.renderState)}if(Et&&Et.includes("camera-access")&&v){t.state.unbindTexture(),u=n.getBinding();for(let Yt=0;Yt<pt.length;Yt++){const Me=pt[Yt].camera;if(Me){let F=h[Me];F||(F=new Ch,h[Me]=F);const ee=u.getCameraImage(Me);F.sourceTexture=ee}}}}for(let pt=0;pt<E.length;pt++){const Dt=w[pt],Et=E[pt];Dt!==null&&Et!==void 0&&Et.update(Dt,rt,l||a)}gt&&gt(X,rt),rt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:rt}),g=null}const At=new kh;At.setAnimationLoop(yt),this.setAnimationLoop=function(X){gt=X},this.dispose=function(){}}}const Ri=new zn,lg=new _e;function hg(i,t){function e(p,h){p.matrixAutoUpdate===!0&&p.updateMatrix(),h.value.copy(p.matrix)}function n(p,h){h.color.getRGB(p.fogColor.value,yh(i)),h.isFog?(p.fogNear.value=h.near,p.fogFar.value=h.far):h.isFogExp2&&(p.fogDensity.value=h.density)}function s(p,h,S,_,y){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(p,h):h.isMeshToonMaterial?(r(p,h),u(p,h)):h.isMeshPhongMaterial?(r(p,h),d(p,h)):h.isMeshStandardMaterial?(r(p,h),f(p,h),h.isMeshPhysicalMaterial&&m(p,h,y)):h.isMeshMatcapMaterial?(r(p,h),g(p,h)):h.isMeshDepthMaterial?r(p,h):h.isMeshDistanceMaterial?(r(p,h),v(p,h)):h.isMeshNormalMaterial?r(p,h):h.isLineBasicMaterial?(a(p,h),h.isLineDashedMaterial&&o(p,h)):h.isPointsMaterial?c(p,h,S,_):h.isSpriteMaterial?l(p,h):h.isShadowMaterial?(p.color.value.copy(h.color),p.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(p,h){p.opacity.value=h.opacity,h.color&&p.diffuse.value.copy(h.color),h.emissive&&p.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(p.map.value=h.map,e(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,e(h.alphaMap,p.alphaMapTransform)),h.bumpMap&&(p.bumpMap.value=h.bumpMap,e(h.bumpMap,p.bumpMapTransform),p.bumpScale.value=h.bumpScale,h.side===nn&&(p.bumpScale.value*=-1)),h.normalMap&&(p.normalMap.value=h.normalMap,e(h.normalMap,p.normalMapTransform),p.normalScale.value.copy(h.normalScale),h.side===nn&&p.normalScale.value.negate()),h.displacementMap&&(p.displacementMap.value=h.displacementMap,e(h.displacementMap,p.displacementMapTransform),p.displacementScale.value=h.displacementScale,p.displacementBias.value=h.displacementBias),h.emissiveMap&&(p.emissiveMap.value=h.emissiveMap,e(h.emissiveMap,p.emissiveMapTransform)),h.specularMap&&(p.specularMap.value=h.specularMap,e(h.specularMap,p.specularMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest);const S=t.get(h),_=S.envMap,y=S.envMapRotation;_&&(p.envMap.value=_,Ri.copy(y),Ri.x*=-1,Ri.y*=-1,Ri.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Ri.y*=-1,Ri.z*=-1),p.envMapRotation.value.setFromMatrix4(lg.makeRotationFromEuler(Ri)),p.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=h.reflectivity,p.ior.value=h.ior,p.refractionRatio.value=h.refractionRatio),h.lightMap&&(p.lightMap.value=h.lightMap,p.lightMapIntensity.value=h.lightMapIntensity,e(h.lightMap,p.lightMapTransform)),h.aoMap&&(p.aoMap.value=h.aoMap,p.aoMapIntensity.value=h.aoMapIntensity,e(h.aoMap,p.aoMapTransform))}function a(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,h.map&&(p.map.value=h.map,e(h.map,p.mapTransform))}function o(p,h){p.dashSize.value=h.dashSize,p.totalSize.value=h.dashSize+h.gapSize,p.scale.value=h.scale}function c(p,h,S,_){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.size.value=h.size*S,p.scale.value=_*.5,h.map&&(p.map.value=h.map,e(h.map,p.uvTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,e(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function l(p,h){p.diffuse.value.copy(h.color),p.opacity.value=h.opacity,p.rotation.value=h.rotation,h.map&&(p.map.value=h.map,e(h.map,p.mapTransform)),h.alphaMap&&(p.alphaMap.value=h.alphaMap,e(h.alphaMap,p.alphaMapTransform)),h.alphaTest>0&&(p.alphaTest.value=h.alphaTest)}function d(p,h){p.specular.value.copy(h.specular),p.shininess.value=Math.max(h.shininess,1e-4)}function u(p,h){h.gradientMap&&(p.gradientMap.value=h.gradientMap)}function f(p,h){p.metalness.value=h.metalness,h.metalnessMap&&(p.metalnessMap.value=h.metalnessMap,e(h.metalnessMap,p.metalnessMapTransform)),p.roughness.value=h.roughness,h.roughnessMap&&(p.roughnessMap.value=h.roughnessMap,e(h.roughnessMap,p.roughnessMapTransform)),h.envMap&&(p.envMapIntensity.value=h.envMapIntensity)}function m(p,h,S){p.ior.value=h.ior,h.sheen>0&&(p.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),p.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(p.sheenColorMap.value=h.sheenColorMap,e(h.sheenColorMap,p.sheenColorMapTransform)),h.sheenRoughnessMap&&(p.sheenRoughnessMap.value=h.sheenRoughnessMap,e(h.sheenRoughnessMap,p.sheenRoughnessMapTransform))),h.clearcoat>0&&(p.clearcoat.value=h.clearcoat,p.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(p.clearcoatMap.value=h.clearcoatMap,e(h.clearcoatMap,p.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,e(h.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(p.clearcoatNormalMap.value=h.clearcoatNormalMap,e(h.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===nn&&p.clearcoatNormalScale.value.negate())),h.dispersion>0&&(p.dispersion.value=h.dispersion),h.iridescence>0&&(p.iridescence.value=h.iridescence,p.iridescenceIOR.value=h.iridescenceIOR,p.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(p.iridescenceMap.value=h.iridescenceMap,e(h.iridescenceMap,p.iridescenceMapTransform)),h.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=h.iridescenceThicknessMap,e(h.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),h.transmission>0&&(p.transmission.value=h.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),h.transmissionMap&&(p.transmissionMap.value=h.transmissionMap,e(h.transmissionMap,p.transmissionMapTransform)),p.thickness.value=h.thickness,h.thicknessMap&&(p.thicknessMap.value=h.thicknessMap,e(h.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=h.attenuationDistance,p.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(p.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(p.anisotropyMap.value=h.anisotropyMap,e(h.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=h.specularIntensity,p.specularColor.value.copy(h.specularColor),h.specularColorMap&&(p.specularColorMap.value=h.specularColorMap,e(h.specularColorMap,p.specularColorMapTransform)),h.specularIntensityMap&&(p.specularIntensityMap.value=h.specularIntensityMap,e(h.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,h){h.matcap&&(p.matcap.value=h.matcap)}function v(p,h){const S=t.get(h).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function dg(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,_){const y=_.program;n.uniformBlockBinding(S,y)}function l(S,_){let y=s[S.id];y===void 0&&(g(S),y=d(S),s[S.id]=y,S.addEventListener("dispose",p));const E=_.program;n.updateUBOMapping(S,E);const w=t.render.frame;r[S.id]!==w&&(f(S),r[S.id]=w)}function d(S){const _=u();S.__bindingPointIndex=_;const y=i.createBuffer(),E=S.__size,w=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,E,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,y),y}function u(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return Be("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){const _=s[S.id],y=S.uniforms,E=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let w=0,R=y.length;w<R;w++){const P=Array.isArray(y[w])?y[w]:[y[w]];for(let b=0,M=P.length;b<M;b++){const A=P[b];if(m(A,w,b,E)===!0){const I=A.__offset,B=Array.isArray(A.value)?A.value:[A.value];let Y=0;for(let q=0;q<B.length;q++){const Z=B[q],ct=v(Z);typeof Z=="number"||typeof Z=="boolean"?(A.__data[0]=Z,i.bufferSubData(i.UNIFORM_BUFFER,I+Y,A.__data)):Z.isMatrix3?(A.__data[0]=Z.elements[0],A.__data[1]=Z.elements[1],A.__data[2]=Z.elements[2],A.__data[3]=0,A.__data[4]=Z.elements[3],A.__data[5]=Z.elements[4],A.__data[6]=Z.elements[5],A.__data[7]=0,A.__data[8]=Z.elements[6],A.__data[9]=Z.elements[7],A.__data[10]=Z.elements[8],A.__data[11]=0):(Z.toArray(A.__data,Y),Y+=ct.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(S,_,y,E){const w=S.value,R=_+"_"+y;if(E[R]===void 0)return typeof w=="number"||typeof w=="boolean"?E[R]=w:E[R]=w.clone(),!0;{const P=E[R];if(typeof w=="number"||typeof w=="boolean"){if(P!==w)return E[R]=w,!0}else if(P.equals(w)===!1)return P.copy(w),!0}return!1}function g(S){const _=S.uniforms;let y=0;const E=16;for(let R=0,P=_.length;R<P;R++){const b=Array.isArray(_[R])?_[R]:[_[R]];for(let M=0,A=b.length;M<A;M++){const I=b[M],B=Array.isArray(I.value)?I.value:[I.value];for(let Y=0,q=B.length;Y<q;Y++){const Z=B[Y],ct=v(Z),nt=y%E,mt=nt%ct.boundary,_t=nt+mt;y+=mt,_t!==0&&E-_t<ct.storage&&(y+=E-_t),I.__data=new Float32Array(ct.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=y,y+=ct.storage}}}const w=y%E;return w>0&&(y+=E-w),S.__size=y,S.__cache={},this}function v(S){const _={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(_.boundary=4,_.storage=4):S.isVector2?(_.boundary=8,_.storage=8):S.isVector3||S.isColor?(_.boundary=16,_.storage=12):S.isVector4?(_.boundary=16,_.storage=16):S.isMatrix3?(_.boundary=48,_.storage=48):S.isMatrix4?(_.boundary=64,_.storage=64):S.isTexture?Qt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Qt("WebGLRenderer: Unsupported uniform value type.",S),_}function p(S){const _=S.target;_.removeEventListener("dispose",p);const y=a.indexOf(_.__bindingPointIndex);a.splice(y,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function h(){for(const S in s)i.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:c,update:l,dispose:h}}const ug=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let ni=null;function fg(){return ni===null&&(ni=new Eh(ug,32,32,ec,Zn),ni.minFilter=An,ni.magFilter=An,ni.wrapS=ri,ni.wrapT=ri,ni.generateMipmaps=!1,ni.needsUpdate=!0),ni}class pg{constructor(t={}){const{canvas:e=$d(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const g=new Set([ic,nc,tc]),v=new Set([$n,Vi,js,Qs,Jo,jo]),p=new Uint32Array(4),h=new Int32Array(4);let S=null,_=null;const y=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Mi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const w=this;let R=!1;this._outputColorSpace=we;let P=0,b=0,M=null,A=-1,I=null;const B=new Ee,Y=new Ee;let q=null;const Z=new Zt(0);let ct=0,nt=e.width,mt=e.height,_t=1,N=null,Mt=null;const gt=new Ee(0,0,nt,mt),yt=new Ee(0,0,nt,mt);let At=!1;const X=new hc;let rt=!1,pt=!1;const Dt=new _e,Et=new U,Wt=new Ee,ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Yt=!1;function Me(){return M===null?_t:1}let F=n;function ee(C,k){return e.getContext(C,k)}try{const C={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${qo}`),e.addEventListener("webglcontextlost",tt,!1),e.addEventListener("webglcontextrestored",J,!1),e.addEventListener("webglcontextcreationerror",vt,!1),F===null){const k="webgl2";if(F=ee(k,C),F===null)throw ee(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw C("WebGLRenderer: "+C.message),C}let ae,Se,It,Pe,Ot,qt,D,T,H,lt,ft,et,Bt,bt,kt,Nt,ut,O,z,W,$,it,L,st;function ot(){ae=new ym(F),ae.init(),it=new sg(F,ae),Se=new fm(F,ae,t,it),It=new ng(F,ae),Se.reversedDepthBuffer&&f&&It.buffers.depth.setReversed(!0),Pe=new Tm(F),Ot=new Hx,qt=new ig(F,ae,It,Ot,Se,it,Pe),D=new mm(w),T=new Sm(w),H=new Rf(F),L=new dm(F,H),lt=new bm(F,H,Pe,L),ft=new Am(F,lt,H,Pe),z=new Em(F,Se,qt),Nt=new pm(Ot),et=new Gx(w,D,T,ae,Se,L,Nt),Bt=new hg(w,Ot),bt=new Xx,kt=new Jx(ae),O=new hm(w,D,T,It,ft,m,c),ut=new tg(w,ft,Se),st=new dg(F,Pe,Se,It),W=new um(F,ae,Pe),$=new wm(F,ae,Pe),Pe.programs=et.programs,w.capabilities=Se,w.extensions=ae,w.properties=Ot,w.renderLists=bt,w.shadowMap=ut,w.state=It,w.info=Pe}ot();const at=new cg(w,F);this.xr=at,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const C=ae.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=ae.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return _t},this.setPixelRatio=function(C){C!==void 0&&(_t=C,this.setSize(nt,mt,!1))},this.getSize=function(C){return C.set(nt,mt)},this.setSize=function(C,k,j=!0){if(at.isPresenting){Qt("WebGLRenderer: Can't change size while VR device is presenting.");return}nt=C,mt=k,e.width=Math.floor(C*_t),e.height=Math.floor(k*_t),j===!0&&(e.style.width=C+"px",e.style.height=k+"px"),this.setViewport(0,0,C,k)},this.getDrawingBufferSize=function(C){return C.set(nt*_t,mt*_t).floor()},this.setDrawingBufferSize=function(C,k,j){nt=C,mt=k,_t=j,e.width=Math.floor(C*j),e.height=Math.floor(k*j),this.setViewport(0,0,C,k)},this.getCurrentViewport=function(C){return C.copy(B)},this.getViewport=function(C){return C.copy(gt)},this.setViewport=function(C,k,j,Q){C.isVector4?gt.set(C.x,C.y,C.z,C.w):gt.set(C,k,j,Q),It.viewport(B.copy(gt).multiplyScalar(_t).round())},this.getScissor=function(C){return C.copy(yt)},this.setScissor=function(C,k,j,Q){C.isVector4?yt.set(C.x,C.y,C.z,C.w):yt.set(C,k,j,Q),It.scissor(Y.copy(yt).multiplyScalar(_t).round())},this.getScissorTest=function(){return At},this.setScissorTest=function(C){It.setScissorTest(At=C)},this.setOpaqueSort=function(C){N=C},this.setTransparentSort=function(C){Mt=C},this.getClearColor=function(C){return C.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor(...arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha(...arguments)},this.clear=function(C=!0,k=!0,j=!0){let Q=0;if(C){let G=!1;if(M!==null){const St=M.texture.format;G=g.has(St)}if(G){const St=M.texture.type,Rt=v.has(St),Ut=O.getClearColor(),Lt=O.getClearAlpha(),Xt=Ut.r,Kt=Ut.g,Vt=Ut.b;Rt?(p[0]=Xt,p[1]=Kt,p[2]=Vt,p[3]=Lt,F.clearBufferuiv(F.COLOR,0,p)):(h[0]=Xt,h[1]=Kt,h[2]=Vt,h[3]=Lt,F.clearBufferiv(F.COLOR,0,h))}else Q|=F.COLOR_BUFFER_BIT}k&&(Q|=F.DEPTH_BUFFER_BIT),j&&(Q|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",tt,!1),e.removeEventListener("webglcontextrestored",J,!1),e.removeEventListener("webglcontextcreationerror",vt,!1),O.dispose(),bt.dispose(),kt.dispose(),Ot.dispose(),D.dispose(),T.dispose(),ft.dispose(),L.dispose(),st.dispose(),et.dispose(),at.dispose(),at.removeEventListener("sessionstart",se),at.removeEventListener("sessionend",Ve),Le.stop()};function tt(C){C.preventDefault(),Uc("WebGLRenderer: Context Lost."),R=!0}function J(){Uc("WebGLRenderer: Context Restored."),R=!1;const C=Pe.autoReset,k=ut.enabled,j=ut.autoUpdate,Q=ut.needsUpdate,G=ut.type;ot(),Pe.autoReset=C,ut.enabled=k,ut.autoUpdate=j,ut.needsUpdate=Q,ut.type=G}function vt(C){Be("WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function xt(C){const k=C.target;k.removeEventListener("dispose",xt),dt(k)}function dt(C){Ft(C),Ot.remove(C)}function Ft(C){const k=Ot.get(C).programs;k!==void 0&&(k.forEach(function(j){et.releaseProgram(j)}),C.isShaderMaterial&&et.releaseShaderCache(C))}this.renderBufferDirect=function(C,k,j,Q,G,St){k===null&&(k=ve);const Rt=G.isMesh&&G.matrixWorld.determinant()<0,Ut=hi(C,k,j,Q,G);It.setMaterial(Q,Rt);let Lt=j.index,Xt=1;if(Q.wireframe===!0){if(Lt=lt.getWireframeAttribute(j),Lt===void 0)return;Xt=2}const Kt=j.drawRange,Vt=j.attributes.position;let le=Kt.start*Xt,be=(Kt.start+Kt.count)*Xt;St!==null&&(le=Math.max(le,St.start*Xt),be=Math.min(be,(St.start+St.count)*Xt)),Lt!==null?(le=Math.max(le,0),be=Math.min(be,Lt.count)):Vt!=null&&(le=Math.max(le,0),be=Math.min(be,Vt.count));const Fe=be-le;if(Fe<0||Fe===1/0)return;L.setup(G,Q,Ut,j,Lt);let Oe,Ae=W;if(Lt!==null&&(Oe=H.get(Lt),Ae=$,Ae.setIndex(Oe)),G.isMesh)Q.wireframe===!0?(It.setLineWidth(Q.wireframeLinewidth*Me()),Ae.setMode(F.LINES)):Ae.setMode(F.TRIANGLES);else if(G.isLine){let Gt=Q.linewidth;Gt===void 0&&(Gt=1),It.setLineWidth(Gt*Me()),G.isLineSegments?Ae.setMode(F.LINES):G.isLineLoop?Ae.setMode(F.LINE_LOOP):Ae.setMode(F.LINE_STRIP)}else G.isPoints?Ae.setMode(F.POINTS):G.isSprite&&Ae.setMode(F.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)nr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ae.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(ae.get("WEBGL_multi_draw"))Ae.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Gt=G._multiDrawStarts,De=G._multiDrawCounts,xe=G._multiDrawCount,_n=Lt?H.get(Lt).bytesPerElement:1,Zi=Ot.get(Q).currentProgram.getUniforms();for(let vn=0;vn<xe;vn++)Zi.setValue(F,"_gl_DrawID",vn),Ae.render(Gt[vn]/_n,De[vn])}else if(G.isInstancedMesh)Ae.renderInstances(le,Fe,G.count);else if(j.isInstancedBufferGeometry){const Gt=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,De=Math.min(j.instanceCount,Gt);Ae.renderInstances(le,Fe,De)}else Ae.render(le,Fe)};function $t(C,k,j){C.transparent===!0&&C.side===ue&&C.forceSinglePass===!1?(C.side=nn,C.needsUpdate=!0,wn(C,k,j),C.side=yi,C.needsUpdate=!0,wn(C,k,j),C.side=ue):wn(C,k,j)}this.compile=function(C,k,j=null){j===null&&(j=C),_=kt.get(j),_.init(k),E.push(_),j.traverseVisible(function(G){G.isLight&&G.layers.test(k.layers)&&(_.pushLight(G),G.castShadow&&_.pushShadow(G))}),C!==j&&C.traverseVisible(function(G){G.isLight&&G.layers.test(k.layers)&&(_.pushLight(G),G.castShadow&&_.pushShadow(G))}),_.setupLights();const Q=new Set;return C.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const St=G.material;if(St)if(Array.isArray(St))for(let Rt=0;Rt<St.length;Rt++){const Ut=St[Rt];$t(Ut,j,G),Q.add(Ut)}else $t(St,j,G),Q.add(St)}),_=E.pop(),Q},this.compileAsync=function(C,k,j=null){const Q=this.compile(C,k,j);return new Promise(G=>{function St(){if(Q.forEach(function(Rt){Ot.get(Rt).currentProgram.isReady()&&Q.delete(Rt)}),Q.size===0){G(C);return}setTimeout(St,10)}ae.get("KHR_parallel_shader_compile")!==null?St():setTimeout(St,10)})};let de=null;function ge(C){de&&de(C)}function se(){Le.stop()}function Ve(){Le.start()}const Le=new kh;Le.setAnimationLoop(ge),typeof self<"u"&&Le.setContext(self),this.setAnimationLoop=function(C){de=C,at.setAnimationLoop(C),C===null?Le.stop():Le.start()},at.addEventListener("sessionstart",se),at.addEventListener("sessionend",Ve),this.render=function(C,k){if(k!==void 0&&k.isCamera!==!0){Be("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),at.enabled===!0&&at.isPresenting===!0&&(at.cameraAutoUpdate===!0&&at.updateCamera(k),k=at.getCamera()),C.isScene===!0&&C.onBeforeRender(w,C,k,M),_=kt.get(C,E.length),_.init(k),E.push(_),Dt.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),X.setFromProjectionMatrix(Dt,Yn,k.reversedDepth),pt=this.localClippingEnabled,rt=Nt.init(this.clippingPlanes,pt),S=bt.get(C,y.length),S.init(),y.push(S),at.enabled===!0&&at.isPresenting===!0){const St=w.xr.getDepthSensingMesh();St!==null&&Ye(St,k,-1/0,w.sortObjects)}Ye(C,k,0,w.sortObjects),S.finish(),w.sortObjects===!0&&S.sort(N,Mt),Yt=at.enabled===!1||at.isPresenting===!1||at.hasDepthSensing()===!1,Yt&&O.addToRenderList(S,C),this.info.render.frame++,rt===!0&&Nt.beginShadows();const j=_.state.shadowsArray;ut.render(j,C,k),rt===!0&&Nt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=S.opaque,G=S.transmissive;if(_.setupLights(),k.isArrayCamera){const St=k.cameras;if(G.length>0)for(let Rt=0,Ut=St.length;Rt<Ut;Rt++){const Lt=St[Rt];Ke(Q,G,C,Lt)}Yt&&O.render(C);for(let Rt=0,Ut=St.length;Rt<Ut;Rt++){const Lt=St[Rt];$e(S,C,Lt,Lt.viewport)}}else G.length>0&&Ke(Q,G,C,k),Yt&&O.render(C),$e(S,C,k);M!==null&&b===0&&(qt.updateMultisampleRenderTarget(M),qt.updateRenderTargetMipmap(M)),C.isScene===!0&&C.onAfterRender(w,C,k),L.resetDefaultState(),A=-1,I=null,E.pop(),E.length>0?(_=E[E.length-1],rt===!0&&Nt.setGlobalState(w.clippingPlanes,_.state.camera)):_=null,y.pop(),y.length>0?S=y[y.length-1]:S=null};function Ye(C,k,j,Q){if(C.visible===!1)return;if(C.layers.test(k.layers)){if(C.isGroup)j=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(k);else if(C.isLight)_.pushLight(C),C.castShadow&&_.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||X.intersectsSprite(C)){Q&&Wt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(Dt);const Rt=ft.update(C),Ut=C.material;Ut.visible&&S.push(C,Rt,Ut,j,Wt.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||X.intersectsObject(C))){const Rt=ft.update(C),Ut=C.material;if(Q&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Wt.copy(C.boundingSphere.center)):(Rt.boundingSphere===null&&Rt.computeBoundingSphere(),Wt.copy(Rt.boundingSphere.center)),Wt.applyMatrix4(C.matrixWorld).applyMatrix4(Dt)),Array.isArray(Ut)){const Lt=Rt.groups;for(let Xt=0,Kt=Lt.length;Xt<Kt;Xt++){const Vt=Lt[Xt],le=Ut[Vt.materialIndex];le&&le.visible&&S.push(C,Rt,le,j,Wt.z,Vt)}}else Ut.visible&&S.push(C,Rt,Ut,j,Wt.z,null)}}const St=C.children;for(let Rt=0,Ut=St.length;Rt<Ut;Rt++)Ye(St[Rt],k,j,Q)}function $e(C,k,j,Q){const{opaque:G,transmissive:St,transparent:Rt}=C;_.setupLightsView(j),rt===!0&&Nt.setGlobalState(w.clippingPlanes,j),Q&&It.viewport(B.copy(Q)),G.length>0&&Ze(G,k,j),St.length>0&&Ze(St,k,j),Rt.length>0&&Ze(Rt,k,j),It.buffers.depth.setTest(!0),It.buffers.depth.setMask(!0),It.buffers.color.setMask(!0),It.setPolygonOffset(!1)}function Ke(C,k,j,Q){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;_.state.transmissionRenderTarget[Q.id]===void 0&&(_.state.transmissionRenderTarget[Q.id]=new Fn(1,1,{generateMipmaps:!0,type:ae.has("EXT_color_buffer_half_float")||ae.has("EXT_color_buffer_float")?Zn:$n,minFilter:Ni,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:me.workingColorSpace}));const St=_.state.transmissionRenderTarget[Q.id],Rt=Q.viewport||B;St.setSize(Rt.z*w.transmissionResolutionScale,Rt.w*w.transmissionResolutionScale);const Ut=w.getRenderTarget(),Lt=w.getActiveCubeFace(),Xt=w.getActiveMipmapLevel();w.setRenderTarget(St),w.getClearColor(Z),ct=w.getClearAlpha(),ct<1&&w.setClearColor(16777215,.5),w.clear(),Yt&&O.render(j);const Kt=w.toneMapping;w.toneMapping=Mi;const Vt=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),_.setupLightsView(Q),rt===!0&&Nt.setGlobalState(w.clippingPlanes,Q),Ze(C,j,Q),qt.updateMultisampleRenderTarget(St),qt.updateRenderTargetMipmap(St),ae.has("WEBGL_multisampled_render_to_texture")===!1){let le=!1;for(let be=0,Fe=k.length;be<Fe;be++){const Oe=k[be],{object:Ae,geometry:Gt,material:De,group:xe}=Oe;if(De.side===ue&&Ae.layers.test(Q.layers)){const _n=De.side;De.side=nn,De.needsUpdate=!0,xn(Ae,j,Q,Gt,De,xe),De.side=_n,De.needsUpdate=!0,le=!0}}le===!0&&(qt.updateMultisampleRenderTarget(St),qt.updateRenderTargetMipmap(St))}w.setRenderTarget(Ut,Lt,Xt),w.setClearColor(Z,ct),Vt!==void 0&&(Q.viewport=Vt),w.toneMapping=Kt}function Ze(C,k,j){const Q=k.isScene===!0?k.overrideMaterial:null;for(let G=0,St=C.length;G<St;G++){const Rt=C[G],{object:Ut,geometry:Lt,group:Xt}=Rt;let Kt=Rt.material;Kt.allowOverride===!0&&Q!==null&&(Kt=Q),Ut.layers.test(j.layers)&&xn(Ut,k,j,Lt,Kt,Xt)}}function xn(C,k,j,Q,G,St){C.onBeforeRender(w,k,j,Q,G,St),C.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),G.onBeforeRender(w,k,j,Q,C,St),G.transparent===!0&&G.side===ue&&G.forceSinglePass===!1?(G.side=nn,G.needsUpdate=!0,w.renderBufferDirect(j,k,Q,G,C,St),G.side=yi,G.needsUpdate=!0,w.renderBufferDirect(j,k,Q,G,C,St),G.side=ue):w.renderBufferDirect(j,k,Q,G,C,St),C.onAfterRender(w,k,j,Q,G,St)}function wn(C,k,j){k.isScene!==!0&&(k=ve);const Q=Ot.get(C),G=_.state.lights,St=_.state.shadowsArray,Rt=G.state.version,Ut=et.getParameters(C,G.state,St,k,j),Lt=et.getProgramCacheKey(Ut);let Xt=Q.programs;Q.environment=C.isMeshStandardMaterial?k.environment:null,Q.fog=k.fog,Q.envMap=(C.isMeshStandardMaterial?T:D).get(C.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&C.envMap===null?k.environmentRotation:C.envMapRotation,Xt===void 0&&(C.addEventListener("dispose",xt),Xt=new Map,Q.programs=Xt);let Kt=Xt.get(Lt);if(Kt!==void 0){if(Q.currentProgram===Kt&&Q.lightsStateVersion===Rt)return gn(C,Ut),Kt}else Ut.uniforms=et.getUniforms(C),C.onBeforeCompile(Ut,w),Kt=et.acquireProgram(Ut,Lt),Xt.set(Lt,Kt),Q.uniforms=Ut.uniforms;const Vt=Q.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Vt.clippingPlanes=Nt.uniform),gn(C,Ut),Q.needsLights=qi(C),Q.lightsStateVersion=Rt,Q.needsLights&&(Vt.ambientLightColor.value=G.state.ambient,Vt.lightProbe.value=G.state.probe,Vt.directionalLights.value=G.state.directional,Vt.directionalLightShadows.value=G.state.directionalShadow,Vt.spotLights.value=G.state.spot,Vt.spotLightShadows.value=G.state.spotShadow,Vt.rectAreaLights.value=G.state.rectArea,Vt.ltc_1.value=G.state.rectAreaLTC1,Vt.ltc_2.value=G.state.rectAreaLTC2,Vt.pointLights.value=G.state.point,Vt.pointLightShadows.value=G.state.pointShadow,Vt.hemisphereLights.value=G.state.hemi,Vt.directionalShadowMap.value=G.state.directionalShadowMap,Vt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Vt.spotShadowMap.value=G.state.spotShadowMap,Vt.spotLightMatrix.value=G.state.spotLightMatrix,Vt.spotLightMap.value=G.state.spotLightMap,Vt.pointShadowMap.value=G.state.pointShadowMap,Vt.pointShadowMatrix.value=G.state.pointShadowMatrix),Q.currentProgram=Kt,Q.uniformsList=null,Kt}function an(C){if(C.uniformsList===null){const k=C.currentProgram.getUniforms();C.uniformsList=Xr.seqWithValue(k.seq,C.uniforms)}return C.uniformsList}function gn(C,k){const j=Ot.get(C);j.outputColorSpace=k.outputColorSpace,j.batching=k.batching,j.batchingColor=k.batchingColor,j.instancing=k.instancing,j.instancingColor=k.instancingColor,j.instancingMorph=k.instancingMorph,j.skinning=k.skinning,j.morphTargets=k.morphTargets,j.morphNormals=k.morphNormals,j.morphColors=k.morphColors,j.morphTargetsCount=k.morphTargetsCount,j.numClippingPlanes=k.numClippingPlanes,j.numIntersection=k.numClipIntersection,j.vertexAlphas=k.vertexAlphas,j.vertexTangents=k.vertexTangents,j.toneMapping=k.toneMapping}function hi(C,k,j,Q,G){k.isScene!==!0&&(k=ve),qt.resetTextureUnits();const St=k.fog,Rt=Q.isMeshStandardMaterial?k.environment:null,Ut=M===null?w.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:Ms,Lt=(Q.isMeshStandardMaterial?T:D).get(Q.envMap||Rt),Xt=Q.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,Kt=!!j.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Vt=!!j.morphAttributes.position,le=!!j.morphAttributes.normal,be=!!j.morphAttributes.color;let Fe=Mi;Q.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(Fe=w.toneMapping);const Oe=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,Ae=Oe!==void 0?Oe.length:0,Gt=Ot.get(Q),De=_.state.lights;if(rt===!0&&(pt===!0||C!==I)){const on=C===I&&Q.id===A;Nt.setState(Q,C,on)}let xe=!1;Q.version===Gt.__version?(Gt.needsLights&&Gt.lightsStateVersion!==De.state.version||Gt.outputColorSpace!==Ut||G.isBatchedMesh&&Gt.batching===!1||!G.isBatchedMesh&&Gt.batching===!0||G.isBatchedMesh&&Gt.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Gt.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Gt.instancing===!1||!G.isInstancedMesh&&Gt.instancing===!0||G.isSkinnedMesh&&Gt.skinning===!1||!G.isSkinnedMesh&&Gt.skinning===!0||G.isInstancedMesh&&Gt.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Gt.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Gt.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Gt.instancingMorph===!1&&G.morphTexture!==null||Gt.envMap!==Lt||Q.fog===!0&&Gt.fog!==St||Gt.numClippingPlanes!==void 0&&(Gt.numClippingPlanes!==Nt.numPlanes||Gt.numIntersection!==Nt.numIntersection)||Gt.vertexAlphas!==Xt||Gt.vertexTangents!==Kt||Gt.morphTargets!==Vt||Gt.morphNormals!==le||Gt.morphColors!==be||Gt.toneMapping!==Fe||Gt.morphTargetsCount!==Ae)&&(xe=!0):(xe=!0,Gt.__version=Q.version);let _n=Gt.currentProgram;xe===!0&&(_n=wn(Q,k,G));let Zi=!1,vn=!1,Rs=!1;const Ie=_n.getUniforms(),pn=Gt.uniforms;if(It.useProgram(_n.program)&&(Zi=!0,vn=!0,Rs=!0),Q.id!==A&&(A=Q.id,vn=!0),Zi||I!==C){It.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Ie.setValue(F,"projectionMatrix",C.projectionMatrix),Ie.setValue(F,"viewMatrix",C.matrixWorldInverse);const mn=Ie.map.cameraPosition;mn!==void 0&&mn.setValue(F,Et.setFromMatrixPosition(C.matrixWorld)),Se.logarithmicDepthBuffer&&Ie.setValue(F,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&Ie.setValue(F,"isOrthographic",C.isOrthographicCamera===!0),I!==C&&(I=C,vn=!0,Rs=!0)}if(G.isSkinnedMesh){Ie.setOptional(F,G,"bindMatrix"),Ie.setOptional(F,G,"bindMatrixInverse");const on=G.skeleton;on&&(on.boneTexture===null&&on.computeBoneTexture(),Ie.setValue(F,"boneTexture",on.boneTexture,qt))}G.isBatchedMesh&&(Ie.setOptional(F,G,"batchingTexture"),Ie.setValue(F,"batchingTexture",G._matricesTexture,qt),Ie.setOptional(F,G,"batchingIdTexture"),Ie.setValue(F,"batchingIdTexture",G._indirectTexture,qt),Ie.setOptional(F,G,"batchingColorTexture"),G._colorsTexture!==null&&Ie.setValue(F,"batchingColorTexture",G._colorsTexture,qt));const Tn=j.morphAttributes;if((Tn.position!==void 0||Tn.normal!==void 0||Tn.color!==void 0)&&z.update(G,j,_n),(vn||Gt.receiveShadow!==G.receiveShadow)&&(Gt.receiveShadow=G.receiveShadow,Ie.setValue(F,"receiveShadow",G.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(pn.envMap.value=Lt,pn.flipEnvMap.value=Lt.isCubeTexture&&Lt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&k.environment!==null&&(pn.envMapIntensity.value=k.environmentIntensity),pn.dfgLUT!==void 0&&(pn.dfgLUT.value=fg()),vn&&(Ie.setValue(F,"toneMappingExposure",w.toneMappingExposure),Gt.needsLights&&di(pn,Rs),St&&Q.fog===!0&&Bt.refreshFogUniforms(pn,St),Bt.refreshMaterialUniforms(pn,Q,_t,mt,_.state.transmissionRenderTarget[C.id]),Xr.upload(F,an(Gt),pn,qt)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Xr.upload(F,an(Gt),pn,qt),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&Ie.setValue(F,"center",G.center),Ie.setValue(F,"modelViewMatrix",G.modelViewMatrix),Ie.setValue(F,"normalMatrix",G.normalMatrix),Ie.setValue(F,"modelMatrix",G.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const on=Q.uniformsGroups;for(let mn=0,da=on.length;mn<da;mn++){const bi=on[mn];st.update(bi,_n),st.bind(bi,_n)}}return _n}function di(C,k){C.ambientLightColor.needsUpdate=k,C.lightProbe.needsUpdate=k,C.directionalLights.needsUpdate=k,C.directionalLightShadows.needsUpdate=k,C.pointLights.needsUpdate=k,C.pointLightShadows.needsUpdate=k,C.spotLights.needsUpdate=k,C.spotLightShadows.needsUpdate=k,C.rectAreaLights.needsUpdate=k,C.hemisphereLights.needsUpdate=k}function qi(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(C,k,j){const Q=Ot.get(C);Q.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),Ot.get(C.texture).__webglTexture=k,Ot.get(C.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:j,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,k){const j=Ot.get(C);j.__webglFramebuffer=k,j.__useDefaultFramebuffer=k===void 0};const fd=F.createFramebuffer();this.setRenderTarget=function(C,k=0,j=0){M=C,P=k,b=j;let Q=!0,G=null,St=!1,Rt=!1;if(C){const Lt=Ot.get(C);if(Lt.__useDefaultFramebuffer!==void 0)It.bindFramebuffer(F.FRAMEBUFFER,null),Q=!1;else if(Lt.__webglFramebuffer===void 0)qt.setupRenderTarget(C);else if(Lt.__hasExternalTextures)qt.rebindTextures(C,Ot.get(C.texture).__webglTexture,Ot.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Vt=C.depthTexture;if(Lt.__boundDepthTexture!==Vt){if(Vt!==null&&Ot.has(Vt)&&(C.width!==Vt.image.width||C.height!==Vt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");qt.setupDepthRenderbuffer(C)}}const Xt=C.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Rt=!0);const Kt=Ot.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Kt[k])?G=Kt[k][j]:G=Kt[k],St=!0):C.samples>0&&qt.useMultisampledRTT(C)===!1?G=Ot.get(C).__webglMultisampledFramebuffer:Array.isArray(Kt)?G=Kt[j]:G=Kt,B.copy(C.viewport),Y.copy(C.scissor),q=C.scissorTest}else B.copy(gt).multiplyScalar(_t).floor(),Y.copy(yt).multiplyScalar(_t).floor(),q=At;if(j!==0&&(G=fd),It.bindFramebuffer(F.FRAMEBUFFER,G)&&Q&&It.drawBuffers(C,G),It.viewport(B),It.scissor(Y),It.setScissorTest(q),St){const Lt=Ot.get(C.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+k,Lt.__webglTexture,j)}else if(Rt){const Lt=k;for(let Xt=0;Xt<C.textures.length;Xt++){const Kt=Ot.get(C.textures[Xt]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Xt,Kt.__webglTexture,j,Lt)}}else if(C!==null&&j!==0){const Lt=Ot.get(C.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Lt.__webglTexture,j)}A=-1},this.readRenderTargetPixels=function(C,k,j,Q,G,St,Rt,Ut=0){if(!(C&&C.isWebGLRenderTarget)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=Ot.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Rt!==void 0&&(Lt=Lt[Rt]),Lt){It.bindFramebuffer(F.FRAMEBUFFER,Lt);try{const Xt=C.textures[Ut],Kt=Xt.format,Vt=Xt.type;if(!Se.textureFormatReadable(Kt)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Se.textureTypeReadable(Vt)){Be("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=C.width-Q&&j>=0&&j<=C.height-G&&(C.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Ut),F.readPixels(k,j,Q,G,it.convert(Kt),it.convert(Vt),St))}finally{const Xt=M!==null?Ot.get(M).__webglFramebuffer:null;It.bindFramebuffer(F.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(C,k,j,Q,G,St,Rt,Ut=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Lt=Ot.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Rt!==void 0&&(Lt=Lt[Rt]),Lt)if(k>=0&&k<=C.width-Q&&j>=0&&j<=C.height-G){It.bindFramebuffer(F.FRAMEBUFFER,Lt);const Xt=C.textures[Ut],Kt=Xt.format,Vt=Xt.type;if(!Se.textureFormatReadable(Kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Se.textureTypeReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const le=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,le),F.bufferData(F.PIXEL_PACK_BUFFER,St.byteLength,F.STREAM_READ),C.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Ut),F.readPixels(k,j,Q,G,it.convert(Kt),it.convert(Vt),0);const be=M!==null?Ot.get(M).__webglFramebuffer:null;It.bindFramebuffer(F.FRAMEBUFFER,be);const Fe=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Kd(F,Fe,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,le),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,St),F.deleteBuffer(le),F.deleteSync(Fe),St}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,k=null,j=0){const Q=Math.pow(2,-j),G=Math.floor(C.image.width*Q),St=Math.floor(C.image.height*Q),Rt=k!==null?k.x:0,Ut=k!==null?k.y:0;qt.setTexture2D(C,0),F.copyTexSubImage2D(F.TEXTURE_2D,j,0,0,Rt,Ut,G,St),It.unbindTexture()};const pd=F.createFramebuffer(),md=F.createFramebuffer();this.copyTextureToTexture=function(C,k,j=null,Q=null,G=0,St=null){St===null&&(G!==0?(nr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),St=G,G=0):St=0);let Rt,Ut,Lt,Xt,Kt,Vt,le,be,Fe;const Oe=C.isCompressedTexture?C.mipmaps[St]:C.image;if(j!==null)Rt=j.max.x-j.min.x,Ut=j.max.y-j.min.y,Lt=j.isBox3?j.max.z-j.min.z:1,Xt=j.min.x,Kt=j.min.y,Vt=j.isBox3?j.min.z:0;else{const Tn=Math.pow(2,-G);Rt=Math.floor(Oe.width*Tn),Ut=Math.floor(Oe.height*Tn),C.isDataArrayTexture?Lt=Oe.depth:C.isData3DTexture?Lt=Math.floor(Oe.depth*Tn):Lt=1,Xt=0,Kt=0,Vt=0}Q!==null?(le=Q.x,be=Q.y,Fe=Q.z):(le=0,be=0,Fe=0);const Ae=it.convert(k.format),Gt=it.convert(k.type);let De;k.isData3DTexture?(qt.setTexture3D(k,0),De=F.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(qt.setTexture2DArray(k,0),De=F.TEXTURE_2D_ARRAY):(qt.setTexture2D(k,0),De=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,k.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,k.unpackAlignment);const xe=F.getParameter(F.UNPACK_ROW_LENGTH),_n=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Zi=F.getParameter(F.UNPACK_SKIP_PIXELS),vn=F.getParameter(F.UNPACK_SKIP_ROWS),Rs=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,Oe.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Oe.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Xt),F.pixelStorei(F.UNPACK_SKIP_ROWS,Kt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Vt);const Ie=C.isDataArrayTexture||C.isData3DTexture,pn=k.isDataArrayTexture||k.isData3DTexture;if(C.isDepthTexture){const Tn=Ot.get(C),on=Ot.get(k),mn=Ot.get(Tn.__renderTarget),da=Ot.get(on.__renderTarget);It.bindFramebuffer(F.READ_FRAMEBUFFER,mn.__webglFramebuffer),It.bindFramebuffer(F.DRAW_FRAMEBUFFER,da.__webglFramebuffer);for(let bi=0;bi<Lt;bi++)Ie&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ot.get(C).__webglTexture,G,Vt+bi),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ot.get(k).__webglTexture,St,Fe+bi)),F.blitFramebuffer(Xt,Kt,Rt,Ut,le,be,Rt,Ut,F.DEPTH_BUFFER_BIT,F.NEAREST);It.bindFramebuffer(F.READ_FRAMEBUFFER,null),It.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(G!==0||C.isRenderTargetTexture||Ot.has(C)){const Tn=Ot.get(C),on=Ot.get(k);It.bindFramebuffer(F.READ_FRAMEBUFFER,pd),It.bindFramebuffer(F.DRAW_FRAMEBUFFER,md);for(let mn=0;mn<Lt;mn++)Ie?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Tn.__webglTexture,G,Vt+mn):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Tn.__webglTexture,G),pn?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,on.__webglTexture,St,Fe+mn):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,on.__webglTexture,St),G!==0?F.blitFramebuffer(Xt,Kt,Rt,Ut,le,be,Rt,Ut,F.COLOR_BUFFER_BIT,F.NEAREST):pn?F.copyTexSubImage3D(De,St,le,be,Fe+mn,Xt,Kt,Rt,Ut):F.copyTexSubImage2D(De,St,le,be,Xt,Kt,Rt,Ut);It.bindFramebuffer(F.READ_FRAMEBUFFER,null),It.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else pn?C.isDataTexture||C.isData3DTexture?F.texSubImage3D(De,St,le,be,Fe,Rt,Ut,Lt,Ae,Gt,Oe.data):k.isCompressedArrayTexture?F.compressedTexSubImage3D(De,St,le,be,Fe,Rt,Ut,Lt,Ae,Oe.data):F.texSubImage3D(De,St,le,be,Fe,Rt,Ut,Lt,Ae,Gt,Oe):C.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,St,le,be,Rt,Ut,Ae,Gt,Oe.data):C.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,St,le,be,Oe.width,Oe.height,Ae,Oe.data):F.texSubImage2D(F.TEXTURE_2D,St,le,be,Rt,Ut,Ae,Gt,Oe);F.pixelStorei(F.UNPACK_ROW_LENGTH,xe),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,_n),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Zi),F.pixelStorei(F.UNPACK_SKIP_ROWS,vn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Rs),St===0&&k.generateMipmaps&&F.generateMipmap(De),It.unbindTexture()},this.initRenderTarget=function(C){Ot.get(C).__webglFramebuffer===void 0&&qt.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?qt.setTextureCube(C,0):C.isData3DTexture?qt.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?qt.setTexture2DArray(C,0):qt.setTexture2D(C,0),It.unbindTexture()},this.resetState=function(){P=0,b=0,M=null,It.reset(),L.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=me._getDrawingBufferColorSpace(t),e.unpackColorSpace=me._getUnpackColorSpace()}}const Yr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class As{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const mg=new _c(-1,1,1,-1,0,1);class xg extends ke{constructor(){super(),this.setAttribute("position",new pe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new pe([0,2,0,0,2,0],2))}}const gg=new xg;class vc{constructor(t){this._mesh=new V(gg,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,mg)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Xh extends As{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof en?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=sr.clone(t.uniforms),this.material=new en({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new vc(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class zl extends As{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class _g extends As{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class vg{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new wt);this._width=n.width,this._height=n.height,e=new Fn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Zn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Xh(Yr),this.copyPass.material.blending=qn,this.clock=new zh}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}zl!==void 0&&(a instanceof zl?n=!0:a instanceof _g&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new wt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Mg extends As{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Zt}render(t,e,n){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}const Sg={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Zt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class bs extends As{constructor(t,e=1,n,s){super(),this.strength=e,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new wt(t.x,t.y):new wt(256,256),this.clearColor=new Zt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Fn(r,a,{type:Zn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new Fn(r,a,{type:Zn});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new Fn(r,a,{type:Zn});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=Sg;this.highPassUniforms=sr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new en({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new wt(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new U(1,1,1),new U(1,1,1),new U(1,1,1),new U(1,1,1),new U(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=sr.clone(Yr.uniforms),this.blendMaterial=new en({uniforms:this.copyUniforms,vertexShader:Yr.vertexShader,fragmentShader:Yr.fragmentShader,blending:Ui,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Zt,this._oldClearAlpha=1,this._basic=new Te,this._fsQuad=new vc(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new wt(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=bs.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[c]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=bs.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[c]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){const e=[],n=t/3;for(let s=0;s<t;s++)e.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new en({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new wt(.5,.5)},direction:{value:new wt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(t){return new en({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}bs.BlurDirectionX=new wt(1,0);bs.BlurDirectionY=new wt(0,1);const Or={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class yg extends As{constructor(){super(),this.uniforms=sr.clone(Or.uniforms),this.material=new vf({name:Or.name,uniforms:this.uniforms,vertexShader:Or.vertexShader,fragmentShader:Or.fragmentShader}),this._fsQuad=new vc(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},me.getTransfer(this._outputColorSpace)===ye&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ih?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===sh?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===rh?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===$o?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===oh?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ch?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ah&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class bg extends Th{constructor(){super();const t=new Pt;t.deleteAttribute("uv");const e=new K({side:nn}),n=new K,s=new gc(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new V(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new Qe(t,n,6),o=new ze;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const c=new V(t,hs(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const l=new V(t,hs(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);const d=new V(t,hs(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new V(t,hs(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const f=new V(t,hs(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);const m=new V(t,hs(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function hs(i){return new Mf({color:0,emissive:16777215,emissiveIntensity:i})}const hr=document.querySelector("#game"),fn=new pg({canvas:hr,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});fn.setPixelRatio(Math.min(window.devicePixelRatio,2));fn.setSize(window.innerWidth,window.innerHeight);fn.shadowMap.enabled=!0;fn.shadowMap.type=nh;fn.outputColorSpace=we;fn.toneMapping=$o;fn.toneMappingExposure=1.08;const Jt=new Th;Jt.background=new Zt(5814015);Jt.fog=new lc(9293045,165,1380);const Yh=new Vo(fn);Yh.compileEquirectangularShader();Jt.environment=Yh.fromScene(new bg,.04).texture;Jt.environmentIntensity=.62;const te=new yn(69,window.innerWidth/window.innerHeight,.08,1800);Jt.add(te);const Ht={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const ce=new Set,Ct={steer:0,throttle:0,brake:0,lookX:0,lookY:0,zoom:0,lookPointer:null,drivePointer:null,pinchStartDistance:0,pinchStartZoom:0},wg=new zh,tn=new U(0,1,0),qh=new U,Zh=new U,Mc=new U,Ln=new ze,Ho=1.2,Tg=.78,ki=.55,Li={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},Hi=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],$h=Math.max(...Hi.map(i=>i.width));let qr=0,ht=Hi[0];const x={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,camLookYaw:0,camLookPitch:0,cameraZoom:0,wheelSteer:0,roamPos:new U,best:Number(localStorage.getItem("steel-ribbon-best")||0)};Ht.best.textContent=`Best score ${x.best}`;function Eg(i){const t=zt.clamp(i,0,1);return t*t*(3-2*t)}function Ag(i,t){let e=0;for(const n of i.gaps){const s=n.start-n.approach,r=n.start+n.carry,a=n.end+n.settle;t>=s&&t<=r?e+=n.rise*zt.clamp((t-s)/(n.approach+n.carry),0,1):t>r&&t<=n.end?e+=n.rise:t>n.end&&t<=a&&(e+=n.rise*(1-Eg((t-n.end)/n.settle)))}return e}function Sc(i,t){const e=(t%i.length+i.length)%i.length,n=e/i.length*Math.PI*2,s=i.shape,r=Math.sin(n)*s.x1+Math.sin(n*2)*s.x2+Math.cos(n*3)*s.x3,a=Math.cos(n)*s.z1+Math.cos(n*2)*s.z2+Math.sin(n*3)*s.z3;return{x:r,z:a,t:n,n:e}}function Kh(i,t){const{t:e,n}=Sc(i,t),s=i.shape;let r=s.y0+Math.sin(e*2)*s.y2+Math.sin(e*3)*s.y3+Math.cos(e)*s.y1;for(const a of i.ramps){let o=n-a.s;o>i.length/2&&(o-=i.length),o<-i.length/2&&(o+=i.length),r+=a.amp*Math.exp(-(o*o)/(a.width*a.width))}return r+=Ag(i,n),r}function Br(i){const{x:t,z:e,n}=Sc(ht,i),s=Kh(ht,n);return new U(t,s,e)}function fe(i){const t=(i%ht.length+ht.length)%ht.length,e=Br(t),s=Br(t+2).sub(e).normalize(),r=qh.crossVectors(tn,s).normalize(),a=Br(t-2).y,o=Br(t+2).y,c=Math.atan2(o-a,4),l=Math.sin(t*.012)*.18+Math.sin(t*.032)*.08,d=ht.gaps.find(u=>t>u.start&&t<u.end);return{s:t,p:e,tangent:s,side:r.clone(),grade:c,bank:l,gap:d}}function Si(i){const t=(i%ht.length+ht.length)%ht.length;return ht.gaps.some(e=>t>e.start&&t<e.end)}function kl(i){return zt.clamp(i/(ht.length*ht.laps),0,1)}function Cg(i,t,e){const n=Math.floor(i/ht.length),s=Math.floor(t/ht.length);for(let r=n;r<=s;r++){const a=r*ht.length+e;if(i<a&&t>=a)return!0}return!1}function Rg(i=256,t=8){const e=document.createElement("canvas");e.width=i,e.height=i;const n=e.getContext("2d"),s=i/t;for(let a=0;a<t;a++)for(let o=0;o<t;o++)n.fillStyle=(o+a)%2?"#101318":"#f5f1df",n.fillRect(o*s,a*s,s,s);const r=new un(e);return r.colorSpace=we,r.wrapS=rn,r.wrapT=rn,r.repeat.set(3,1),r}function Pg(i=512){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,i,0);n.addColorStop(0,"#9c9b77"),n.addColorStop(.18,"#c9c69a"),n.addColorStop(.5,"#9f9f79"),n.addColorStop(.82,"#c0bd91"),n.addColorStop(1,"#858563"),e.fillStyle=n,e.fillRect(0,0,i,i),e.strokeStyle="rgba(38, 44, 36, 0.32)",e.lineWidth=2;for(let r=0;r<i;r+=64)e.beginPath(),e.moveTo(0,r+2),e.lineTo(i,r+2),e.stroke();e.strokeStyle="rgba(250, 242, 180, 0.22)",e.lineWidth=3;for(const r of[48,464])e.beginPath(),e.moveTo(r,0),e.lineTo(r,i),e.stroke();e.strokeStyle="rgba(28, 31, 30, 0.24)",e.lineWidth=3;for(let r=0;r<42;r++){const a=i*(.28+Math.random()*.44),o=Math.random()*i;e.beginPath(),e.moveTo(a,o),e.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),e.stroke()}e.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)e.beginPath(),e.ellipse(Math.random()*i,Math.random()*i,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),e.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);e.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,e.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new un(t);return s.colorSpace=we,s.wrapS=rn,s.wrapT=rn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,fn.capabilities.getMaxAnisotropy()),s}function Lg(i=1024){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,i,i);n.addColorStop(0,"#2e6a40"),n.addColorStop(.42,"#487443"),n.addColorStop(1,"#1f4a37"),e.fillStyle=n,e.fillRect(0,0,i,i);for(let r=0;r<3600;r++){const a=.035+Math.random()*.08,o=72+Math.floor(Math.random()*70);e.fillStyle=`rgba(${38+Math.random()*30}, ${o}, ${38+Math.random()*26}, ${a})`,e.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*4,1+Math.random()*4)}e.strokeStyle="rgba(210, 220, 150, 0.08)",e.lineWidth=2;for(let r=-i;r<i*1.5;r+=76)e.beginPath(),e.moveTo(r,0),e.lineTo(r+i*.65,i),e.stroke();const s=new un(t);return s.colorSpace=we,s.wrapS=rn,s.wrapT=rn,s.repeat.set(18,18),s.anisotropy=Math.min(16,fn.capabilities.getMaxAnisotropy()),s}function Dg(i=1024){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,i,i);n.addColorStop(0,"#111a1f"),n.addColorStop(.45,"#252c31"),n.addColorStop(1,"#070d11"),e.fillStyle=n,e.fillRect(0,0,i,i),e.strokeStyle="rgba(180, 225, 255, 0.08)",e.lineWidth=1;for(let r=-i;r<i*2;r+=42)e.beginPath(),e.moveTo(r,0),e.lineTo(r+i*.7,i),e.stroke();for(let r=0;r<360;r++){const a=Math.random()*i,o=Math.random()*i,c=10+Math.random()*56,l=e.createRadialGradient(a,o,0,a,o,c);l.addColorStop(0,`rgba(145, 205, 255, ${.12+Math.random()*.15})`),l.addColorStop(.45,"rgba(80, 140, 180, 0.07)"),l.addColorStop(1,"rgba(10, 18, 24, 0)"),e.fillStyle=l,e.beginPath(),e.ellipse(a,o,c,c*(.16+Math.random()*.18),Math.random()*Math.PI,0,Math.PI*2),e.fill()}e.fillStyle="rgba(255, 214, 122, 0.12)";for(let r=0;r<48;r++){const a=Math.random()*i,o=Math.random()*i;e.beginPath(),e.ellipse(a,o,8+Math.random()*36,1.5+Math.random()*4,Math.random()*Math.PI,0,Math.PI*2),e.fill()}for(let r=0;r<5200;r++){const a=40+Math.floor(Math.random()*80);e.fillStyle=`rgba(${a}, ${a+4}, ${a+8}, ${.045+Math.random()*.08})`,e.fillRect(Math.random()*i,Math.random()*i,1,1)}const s=new un(t);return s.colorSpace=we,s.wrapS=rn,s.wrapT=rn,s.repeat.set(22,28),s.anisotropy=Math.min(16,fn.capabilities.getMaxAnisotropy()),s}function us(i=128,t=256,e=.42){const n=document.createElement("canvas");n.width=i,n.height=t;const s=n.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,i,t);for(let a=10;a<t-8;a+=18)for(let o=9;o<i-9;o+=15)Math.random()<e?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<i;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,t),s.stroke();const r=new un(n);return r.colorSpace=we,r}function Ig(i=256,t=256,e="#d9d0bd"){const n=document.createElement("canvas");n.width=i,n.height=t;const s=n.getContext("2d"),r=s.createLinearGradient(0,0,i,t);r.addColorStop(0,e),r.addColorStop(.58,"#f0e5d2"),r.addColorStop(1,"#b9b0a1"),s.fillStyle=r,s.fillRect(0,0,i,t),s.fillStyle="rgba(255,255,255,0.16)";for(let c=0;c<1700;c++){const l=180+Math.random()*60;s.fillStyle=`rgba(${l}, ${l}, ${l-18}, ${.018+Math.random()*.04})`,s.fillRect(Math.random()*i,Math.random()*t,1,1)}s.strokeStyle="rgba(120, 96, 70, 0.18)",s.lineWidth=2,s.strokeRect(0,t*.77,i,t*.2);const a=(c,l,d,u)=>{s.shadowColor="rgba(255, 198, 95, 0.48)",s.shadowBlur=7,s.fillStyle="rgba(255, 212, 128, 0.78)",s.fillRect(c,l,d,u),s.shadowBlur=0,s.strokeStyle="rgba(70, 54, 44, 0.72)",s.lineWidth=4,s.strokeRect(c,l,d,u),s.lineWidth=2,s.beginPath(),s.moveTo(c+d*.5,l+2),s.lineTo(c+d*.5,l+u-2),s.moveTo(c+2,l+u*.52),s.lineTo(c+d-2,l+u*.52),s.stroke()};a(i*.12,t*.24,i*.19,t*.2),a(i*.68,t*.25,i*.2,t*.2),a(i*.43,t*.5,i*.16,t*.16),s.fillStyle="#4b3d34",s.fillRect(i*.43,t*.62,i*.16,t*.29),s.fillStyle="rgba(255, 218, 120, 0.72)",s.beginPath(),s.arc(i*.55,t*.76,3,0,Math.PI*2),s.fill();const o=new un(n);return o.colorSpace=we,o.wrapS=rn,o.wrapT=rn,o.anisotropy=Math.min(16,fn.capabilities.getMaxAnisotropy()),o}function Ug(i=512){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=e.createLinearGradient(0,0,i,i);n.addColorStop(0,"#e77b36"),n.addColorStop(.45,"#a63f24"),n.addColorStop(1,"#6b271d"),e.fillStyle=n,e.fillRect(0,0,i,i),e.strokeStyle="rgba(255, 185, 104, 0.28)",e.lineWidth=2;for(let r=-20;r<i+20;r+=26){e.beginPath();for(let a=-10;a<i+10;a+=12){const o=r+Math.sin((a+r)*.045)*3;a===-10?e.moveTo(a,o):e.lineTo(a,o)}e.stroke()}e.strokeStyle="rgba(75, 24, 18, 0.34)",e.lineWidth=1.5;for(let r=0;r<i;r+=20)e.beginPath(),e.moveTo(r,0),e.bezierCurveTo(r+8,i*.24,r-8,i*.58,r+7,i),e.stroke();for(let r=0;r<1400;r++){const a=112+Math.random()*110;e.fillStyle=`rgba(${a}, ${52+Math.random()*52}, ${28+Math.random()*34}, ${.045+Math.random()*.08})`,e.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new un(t);return s.colorSpace=we,s.wrapS=rn,s.wrapT=rn,s.repeat.set(2.2,2.2),s.anisotropy=Math.min(16,fn.capabilities.getMaxAnisotropy()),s}function Ng(i=256,t=160){const e=document.createElement("canvas");e.width=i,e.height=t;const n=e.getContext("2d"),s=n.createLinearGradient(0,0,0,t);s.addColorStop(0,"#4f565c"),s.addColorStop(.55,"#293139"),s.addColorStop(1,"#161c23"),n.fillStyle=s,n.fillRect(0,0,i,t),n.strokeStyle="rgba(210, 225, 232, 0.18)",n.lineWidth=3;for(let a=18;a<t;a+=24)n.beginPath(),n.moveTo(8,a),n.lineTo(i-8,a),n.stroke();n.strokeStyle="rgba(8, 10, 12, 0.72)",n.lineWidth=8,n.strokeRect(4,4,i-8,t-8);const r=new un(e);return r.colorSpace=we,r}function Vl(i,t="#ff4fb7",e="rgba(12, 5, 30, 0.92)"){const n=document.createElement("canvas");n.width=128,n.height=384;const s=n.getContext("2d");s.fillStyle=e,s.fillRect(0,0,128,384),s.strokeStyle=t,s.lineWidth=5,s.strokeRect(8,8,112,368),s.save(),s.translate(64,196),s.rotate(-Math.PI/2),s.font="900 54px Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.shadowColor=t,s.shadowBlur=18,s.fillStyle=t,s.fillText(i,0,0),s.restore();const r=new un(n);return r.colorSpace=we,r}function Fg(i=256){const t=document.createElement("canvas");t.width=i,t.height=i;const e=t.getContext("2d"),n=i/2,s=i/2,r=i*.43;e.clearRect(0,0,i,i),e.beginPath();for(let o=0;o<8;o++){const c=-Math.PI/8+o*Math.PI/4,l=n+Math.cos(c)*r,d=s+Math.sin(c)*r;o===0?e.moveTo(l,d):e.lineTo(l,d)}e.closePath(),e.fillStyle="#c91f24",e.fill(),e.lineWidth=i*.035,e.strokeStyle="#f9f6ee",e.stroke(),e.fillStyle="#ffffff",e.font=`900 ${Math.round(i*.27)}px Arial, sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillText("STOP",n,s+i*.015);const a=new un(t);return a.colorSpace=we,a}function jt(i,t){return-7+Math.sin(i*.018)*4+Math.cos(t*.014)*5+Math.sin((i+t)*.006)*10}function oa(i,t,e=10){const{x0:n,x1:s,zNear:r,zFar:a,pitch:o,streetW:c}=Li;if(i<n-c||i>s+c||t<a-c||t>r+c)return!1;const l=Math.abs((i-n+o/2)%o-o/2),d=Math.abs((r-t+o/2)%o-o/2);return Math.min(l,d)<c*.5+e}const Zr=[],Ya=[],Jh=[];let Gl=0;function kn(i,t){return Jh.push({obj:i,update:t}),i}function jh(i){Gl+=i;for(const t of Jh)t.update(Gl,i)}function Qh(){if(Ya.length===0)for(let i=0;i<Hi.length;i++){const t=Hi[i];for(let e=0;e<t.length;e+=14){const n=Sc(t,e);Ya.push({x:n.x,y:Kh(t,e),z:n.z,s:e,courseIndex:i})}}return Ya}function Vn(i,t,e=0){let n=null,s=1/0;for(const r of Qh()){const a=i-r.x,o=t-r.z,c=Math.hypot(a,o);c<s&&(s=c,n=r)}return{clearance:s-e-$h*.58,distance:s,nearestS:n?.s??0}}function Gs(i,t,e,n,s,r=9){const a=e*.5,o=n*.5,c=$h*.62+r;let l=null;for(const d of Qh()){const u=Math.max(Math.abs(d.x-i)-a,0),f=Math.max(Math.abs(d.z-t)-o,0),m=Math.hypot(u,f)-c;if(m>0)continue;const g=d.y-2.8,v=s-g;v<=0||(!l||v-m>l.score)&&(l={courseIndex:d.courseIndex,s:d.s,x:d.x,z:d.z,trackY:d.y,horizontalClearance:m,verticalIntrusion:v,score:v-m})}return l}function Dn(i,t,e,n=96){for(let s=0;s<n;s++){const r=i(s);if(Vn(r.x,r.z,t).clearance>=e)return r}return null}function In(i,t,e,n,s){const r=Vn(t,e,n);Zr.push({kind:i,x:Math.round(t),z:Math.round(e),radius:Math.round(n),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function Og(){const i=[...Zr].sort((t,e)=>t.clearance-e.clearance).slice(0,12);return{count:Zr.length,unsafe:Zr.filter(t=>t.clearance<t.margin),closest:i}}function hn(i,t,e,n,s){const r=t.clone().add(e).multiplyScalar(.5),a=e.clone().sub(t),o=new V(new he(n,n,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors(tn,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,i.add(o),o}function Bg(){const i=new bf(10475519,1055524,.82);Jt.add(i);const t=new fl(5941759,1.15);t.position.set(260,145,-260),Jt.add(t);const e=new fl(16766364,1.55);e.position.set(-240,270,180),e.castShadow=!0,e.shadow.mapSize.set(3072,3072),e.shadow.camera.left=-460,e.shadow.camera.right=460,e.shadow.camera.top=460,e.shadow.camera.bottom=-460,e.shadow.camera.near=50,e.shadow.camera.far=980,e.shadow.bias=-.0015,Jt.add(e);const n=new gc(5552383,58,820,2.1);n.position.set(0,88,-920),Jt.add(n)}function zg(){const i=document.createElement("canvas");i.width=32,i.height=512;const t=i.getContext("2d"),e=t.createLinearGradient(0,0,0,i.height);e.addColorStop(0,"#03569f"),e.addColorStop(.34,"#1689e6"),e.addColorStop(.72,"#86d3ff"),e.addColorStop(1,"#fff1c4"),t.fillStyle=e,t.fillRect(0,0,i.width,i.height);const n=new un(i);n.colorSpace=we;const s=new V(new He(1550,40,20),new Te({map:n,side:nn,depthWrite:!1}));s.position.set(0,-70,-700),Jt.add(s);const r=new Te({color:16765316,transparent:!0,opacity:.22,depthWrite:!1}),a=new V(new dn(58,48),r);a.position.set(-430,300,-650),a.lookAt(te.position),Jt.add(a);const o=new Te({color:16762479,transparent:!0,opacity:.16,depthWrite:!1});for(const[l,d]of[[150,.05],[260,.025],[430,.012]]){const u=new V(new dn(l,48),o.clone());u.material.opacity=d,u.position.copy(a.position).add(new U(0,0,2)),u.lookAt(te.position),Jt.add(u)}const c=new Te({color:16769715,transparent:!0,opacity:.025,depthWrite:!1,side:ue});for(let l=0;l<3;l++){const d=new V(new Ue(1800,42),c.clone());d.material.opacity=.015+l*.01,d.position.set(0,92+l*28,-1220-l*260),Jt.add(d)}}function kg(){const i=new K({map:Lg(),color:10212492,roughness:.98,metalness:.02}),t=new V(new Ue(4200,4200,300,300),i);t.rotation.x=-Math.PI/2,t.position.y=-7,t.receiveShadow=!0;const e=t.geometry.attributes.position;for(let v=0;v<e.count;v++){const p=e.getX(v),h=e.getY(v);e.setZ(v,jt(p,-h)+7)}e.needsUpdate=!0,t.geometry.computeVertexNormals(),Jt.add(t);const n=new K({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.76});for(let v=0;v<3;v++){const p=new V(new Ue(980,64+v*18,1,1),n.clone());p.rotation.x=-Math.PI/2,p.rotation.z=-.34+v*.03,p.position.set(150-v*190,-5.4+v*.03,-760-v*420),Jt.add(p)}const s=[new K({color:4352578,roughness:1}),new K({color:6910014,roughness:1}),new K({color:3562320,roughness:1})];for(let v=0;v<46;v++){const p=new V(new dn(28+Math.random()*90,9),s[v%s.length]);p.rotation.x=-Math.PI/2,p.rotation.z=Math.random()*Math.PI,p.position.set(-900+Math.random()*1800,-5.6+Math.random()*.8,-260-Math.random()*1780),p.scale.y=.32+Math.random()*.5,p.receiveShadow=!0,Jt.add(p)}const r=new Te({color:14217471,transparent:!0,opacity:.08,depthWrite:!1});for(let v=0;v<32;v++){const p=new V(new dn(70+Math.random()*150,22),r.clone());p.material.opacity=.035+Math.random()*.055,p.rotation.x=-Math.PI/2,p.position.set(-1050+Math.random()*2100,-1.8+Math.random()*4,-240-Math.random()*1820),p.scale.y=.22+Math.random()*.26,Jt.add(p)}const a=[new K({color:5991785,roughness:1}),new K({color:7633254,roughness:1}),new K({color:4874865,roughness:1})],o=new K({color:15068905,roughness:.95});for(let v=0;v<52;v++){const p=78+Math.random()*180,h=52+Math.random()*115,S=Dn(y=>{const E=v/52*Math.PI*2+y*1.77,w=1380+Math.random()*820+y*18;return{x:Math.cos(E)*w,z:Math.sin(E)*w-1180}},h,480);if(!S)continue;const _=new V(new zi(h,p,5+Math.floor(Math.random()*2)),a[v%a.length]);if(_.position.set(S.x,-9,S.z),_.rotation.y=Math.random()*Math.PI,_.castShadow=!0,_.receiveShadow=!0,Jt.add(_),In("mountain",S.x,S.z,h,480),p>160){const y=new V(new zi(h*.34,p*.22,5),o);y.position.copy(_.position).add(new U(0,p*.39,0)),y.rotation.y=_.rotation.y,Jt.add(y)}}const c=new K({color:4926748,roughness:.9}),l=[new K({color:2055221,roughness:.92}),new K({color:3109954,roughness:.95}),new K({color:1589042,roughness:.9})];for(let v=0;v<185;v++){const p=.58+Math.random()*1.05,h=8*p,S=Dn(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),h,145,40);if(!S)continue;const{x:_,z:y}=S;if(oa(_,y,18))continue;const E=jt(_,y)+.8,w=new re,R=2.2+Math.random()*3.8,P=new V(new he(.28,.42,R,6),c);P.position.y=R/2,w.add(P);const b=2+Math.floor(Math.random()*3);for(let M=0;M<b;M++){const A=new V(new zi(2.2+Math.random()*1.7-M*.22,4.8+Math.random()*2.6,7),l[(v+M)%l.length]);A.position.y=R+M*1.45+1.6,A.rotation.y=Math.random()*Math.PI,w.add(A)}w.position.set(_,E,y),w.scale.setScalar(p),Jt.add(w),In("tree",_,y,h,145)}const d=new K({color:16777215,roughness:.75,transparent:!0,opacity:.88});for(let v=0;v<38;v++){const p=new re,h=4+Math.floor(Math.random()*5);for(let S=0;S<h;S++){const _=new V(new He(12+Math.random()*18,14,8),d);_.position.set(S*18-h*9,Math.random()*8,Math.random()*12),_.scale.set(1.2+Math.random()*.9,.36+Math.random()*.2,.8+Math.random()*.5),p.add(_)}p.position.set(-760+Math.random()*1520,185+Math.random()*135,-130-Math.random()*1720),Jt.add(p)}const u=[new K({color:6186600,roughness:.68,metalness:.2}),new K({color:7829101,roughness:.72,metalness:.18}),new K({color:4544612,roughness:.62,metalness:.24})],f=new K({color:2962232,roughness:.65,metalness:.35});for(let v=0;v<44;v++){const p=new re,h=20+Math.random()*95,S=8+Math.random()*18,_=8+Math.random()*18,y=new V(new Pt(S,h,_),u[v%u.length]);y.position.y=h/2,y.castShadow=!0,y.receiveShadow=!0,p.add(y);const E=us(160,320,.28+Math.random()*.36),w=new K({map:E,color:10414079,roughness:.24,metalness:.12,emissive:1724259,emissiveIntensity:.22});for(const M of[-1,1]){const A=new V(new Ue(S*.82,h*.74),w);A.position.set(0,h*.53,M*(_/2+.08)),A.rotation.y=M<0?Math.PI:0,p.add(A)}const R=new V(new Pt(S*1.08,1.2,_*1.08),f);if(R.position.y=h+.7,p.add(R),Math.random()<.32){const M=new V(new he(.18,.3,10+Math.random()*12,8),f);M.position.y=h+6.5,p.add(M)}const P=Math.hypot(S,_)*.65,b=Dn(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),P,240,60);b&&(p.position.set(b.x,-5,b.z),p.rotation.y=Math.random()*Math.PI,Jt.add(p),In("building",b.x,b.z,P,240))}const m=new K({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22}),g=new K({color:16766574,roughness:.32,metalness:.05,emissive:9061888,emissiveIntensity:.28});for(let v=0;v<12;v++){const p=new re,h=new V(new Pt(20+Math.random()*16,7+Math.random()*4,.5),g);h.position.y=10,p.add(h);for(const _ of[-7,7]){const y=new V(new he(.24,.32,10,8),m);y.position.set(_,5,-.2),p.add(y)}const S=Dn(()=>({x:-780+Math.random()*1560,z:-450-v*135+Math.random()*80-40}),22,175,50);S&&(p.position.set(S.x,jt(S.x,S.z)+.5,S.z),p.rotation.y=-.35+Math.random()*.7,Jt.add(p),In("billboard",S.x,S.z,22,175))}}function Vg(){for(let h=0;h<3;h++){const S=[9418953,10995926,12770278][h],_=new Te({color:S,transparent:!0,opacity:.55-h*.12,depthWrite:!1,fog:!1}),y=60,E=5200,w=new Ue(E,360,y,1),R=w.attributes.position;for(let b=0;b<=y;b++){const M=b/y,A=(Math.sin(M*22+h*3)*.5+Math.sin(M*9+h)*.5)*70+120;R.setY(b,A),R.setY(b+y+1,-180)}R.needsUpdate=!0;const P=new V(w,_);P.position.set(0,40,-2300-h*360),Jt.add(P)}const i=new K({color:5583649,roughness:.9}),t=[new K({color:3837754,roughness:.9}),new K({color:7319100,roughness:.92}),new K({color:13075258,roughness:.9}),new K({color:15182276,roughness:.88})];for(let h=0;h<48;h++){const S=.7+Math.random()*1.2,_=9*S,y=Dn(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),_,150,36);if(!y)continue;const{x:E,z:w}=y;if(oa(E,w,18))continue;const R=jt(E,w)+.6,P=new re,b=2.6+Math.random()*3.4,M=new V(new he(.34,.5,b,6),i);M.position.y=b/2,P.add(M);const A=t[Math.floor(Math.random()*t.length)],I=3+Math.floor(Math.random()*3);for(let B=0;B<I;B++){const Y=2.4+Math.random()*1.8,q=new V(new He(Y,9,7),A);q.position.set((Math.random()-.5)*3,b+1.6+Math.random()*2.2,(Math.random()-.5)*3),q.scale.y=.82+Math.random()*.3,P.add(q)}P.position.set(E,R,w),P.scale.setScalar(S),Jt.add(P),In("tree",E,w,_,150)}const e=[new K({color:7762025,roughness:1,flatShading:!0,side:ue}),new K({color:9077368,roughness:1,flatShading:!0,side:ue}),new K({color:6249043,roughness:1,flatShading:!0,side:ue})];for(let h=0;h<70;h++){const S=2+Math.random()*7,_=Dn(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),S,70,30);if(!_)continue;const{x:y,z:E}=_,w=new V(new pc(S,0),e[h%e.length]),R=w.geometry.attributes.position;for(let P=0;P<R.count;P++)R.setXYZ(P,R.getX(P)*(.8+Math.random()*.4),R.getY(P)*(.6+Math.random()*.4),R.getZ(P)*(.8+Math.random()*.4));R.needsUpdate=!0,w.geometry.computeVertexNormals(),w.position.set(y,jt(y,E)+S*.35,E),w.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),w.castShadow=!0,Jt.add(w),$s.push({kind:"rock",x:y,z:E,radius:S*1.12}),In("rock",y,E,S,70)}const n=[11969084,9416262,7314255,13218138,8228670];for(let h=0;h<14;h++){const S=130+Math.random()*200,_=130+Math.random()*200,y=Dn(()=>({x:-1500+Math.random()*3e3,z:-700-Math.random()*1700}),Math.max(S,_)*.5,40,24);if(!y)continue;const{x:E,z:w}=y,R=new re,P=5+Math.floor(Math.random()*4),b=n[Math.floor(Math.random()*n.length)];for(let M=0;M<P;M++){const A=new K({color:M%2?b:n[Math.floor(Math.random()*n.length)],roughness:1}),I=new V(new Ue(S,_/P),A);I.rotation.x=-Math.PI/2,I.position.set(0,.05,-_/2+(M+.5)*(_/P)),R.add(I)}R.position.set(E,jt(E,w)+.05,w),R.rotation.y=Math.random()*Math.PI,Jt.add(R),In("field",E,w,Math.max(S,_)*.5,40)}{const h=Dn(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(h){const S=new K({color:4165552,roughness:.12,metalness:.35,transparent:!0,opacity:.88}),_=new V(new dn(150,40),S);_.rotation.x=-Math.PI/2,_.position.set(h.x,-6.4,h.z),_.scale.set(1.5,1,1),Jt.add(_),In("lake",h.x,h.z,170,60),kn(_,y=>{S.opacity=.84+Math.sin(y*.8)*.05,_.rotation.z=Math.sin(y*.2)*.02})}}const s=new K({color:15922422,roughness:.5,metalness:.2});for(let h=0;h<9;h++){const S=h/9*Math.PI*2+.6,_=1500+Math.random()*700,y=Math.cos(S)*_,E=Math.sin(S)*_-1150,w=60+Math.random()*40,R=new re,P=new V(new he(1.1,2.2,w,10),s);P.position.y=w/2,R.add(P);const b=new re;b.position.set(0,w,3);const M=new V(new Pt(3,3,7),s);b.add(M);const A=new re;A.position.z=3.5;for(let B=0;B<3;B++){const Y=new V(new Pt(1.1,26,.5),s);Y.position.y=13;const q=new re;q.add(Y),q.rotation.z=B/3*Math.PI*2,A.add(q)}b.add(A),R.add(b),R.position.set(y,-8,E),R.rotation.y=Math.random()*Math.PI,Jt.add(R);const I=.5+Math.random()*.5;kn(A,B=>{A.rotation.z=B*I})}const r=new K({color:7041398,roughness:.6,metalness:.4}),a=new Oo({color:2764595,transparent:!0,opacity:.5});let o=null;for(let h=0;h<7;h++){const S=-1100+h*360,_=-1650-Math.sin(h*.7)*120,y=48,E=new re,w=6;for(const P of[-1,1])for(const b of[-1,1]){const M=new V(new he(.4,.7,y,5),r);M.position.set(P*w,y/2,b*w),M.rotation.z=-P*.08,M.rotation.x=b*.08,E.add(M)}for(const P of[y*.6,y*.82,y]){const b=new V(new Pt(w*4,.8,.8),r);b.position.y=P,E.add(b)}E.position.set(S,jt(S,_)-2,_),Jt.add(E);const R=jt(S,_)-2+y;if(o)for(const P of[-w*2,0,w*2]){const b=o.x+P,M=o.z,A=S+P,I=_,B=[],Y=12;for(let Z=0;Z<=Y;Z++){const ct=Z/Y,nt=Math.sin(ct*Math.PI)*6;B.push(new U(b+(A-b)*ct,o.y-nt+(R-o.y)*ct,M+(I-M)*ct))}const q=new il(new ke().setFromPoints(B),a);Jt.add(q)}o={x:S,y:R,z:_}}const c=new K({color:11680302,roughness:.6,metalness:.3}),l=new K({color:15263976,roughness:.6,metalness:.3});for(let h=0;h<5;h++){const S=Dn(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!S)continue;const{x:_,z:y}=S,E=70+Math.random()*50,w=new re,R=8;for(let A=0;A<R;A++){const I=new V(new he(.5,.7,E/R,4),A%2?l:c);I.position.y=(A+.5)*(E/R),I.rotation.y=Math.PI/4,w.add(I)}const P=new K({color:16722458,emissive:16718346,emissiveIntensity:2}),b=new V(new He(1.1,10,8),P);b.position.y=E+1,w.add(b),w.position.set(_,jt(_,y),y),Jt.add(w),In("mast",_,y,8,120);const M=Math.random()*Math.PI*2;kn(b,A=>{P.emissiveIntensity=Math.sin(A*2.4+M)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let h=0;h<6;h++){const S=new re,_=d[h%d.length],y=new K({map:$g(_[0],_[1]),roughness:.5,metalness:.05,emissive:new Zt(_[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new V(new He(11,20,16),y);E.scale.y=1.25,S.add(E);const w=new V(new Pt(3.4,3,3.4),new K({color:8014371,roughness:.9}));w.position.y=-17,S.add(w);const R=new Oo({color:3811866});for(const I of[-1,1])for(const B of[-1,1]){const Y=new il(new ke().setFromPoints([new U(I*1.6,-15.5,B*1.6),new U(I*7,-3,B*7)]),R);S.add(Y)}const P=-700+Math.random()*1400,b=-700-Math.random()*1200,M=280+Math.random()*100;S.position.set(P,M,b),Jt.add(S);const A=Math.random()*Math.PI*2;kn(S,I=>{S.position.y=M+Math.sin(I*.5+A)*6,S.position.x=P+Math.sin(I*.08+A)*90,S.rotation.z=Math.sin(I*.4+A)*.04})}const u=new Te({color:2829104,side:ue,fog:!1});function f(){const h=new Ih;return h.moveTo(0,0),h.lineTo(-2.6,1.1),h.lineTo(-2.2,.2),h.lineTo(0,.5),h.lineTo(2.2,.2),h.lineTo(2.6,1.1),h.lineTo(0,0),new V(new mc(h),u)}for(let h=0;h<5;h++){const S=new re,_=5+Math.floor(Math.random()*5),y=[];for(let A=0;A<_;A++){const I=f(),B=A%2?1:-1,Y=Math.ceil(A/2);I.position.set(B*Y*5,-Y*2.4,0),I.rotation.x=-Math.PI/2,S.add(I),y.push(I)}const E=150+Math.random()*120,w=-500-Math.random()*1400,R=18+Math.random()*14,P=1400,b=-700+Math.random()*1400;S.position.set(b,E,w),Jt.add(S);const M=Math.random()*Math.PI*2;kn(S,(A,I)=>{S.position.x+=R*I,S.position.x>P&&(S.position.x=-P);const B=Math.sin(A*6+M);for(const Y of y)Y.rotation.x=-Math.PI/2+B*.4})}{const h=new re,S=new K({color:14673644,roughness:.4,metalness:.2}),_=new V(new He(20,20,16),S);_.scale.set(2.6,1,1),h.add(_);const y=new K({color:13781835,roughness:.6});for(let b=0;b<3;b++){const M=new V(new Pt(10,9,.6),y);M.position.x=-46,M.rotation.x=b/3*Math.PI*2,h.add(M)}const E=new V(new Pt(10,4,4),new K({color:3356475,roughness:.7}));E.position.y=-19,h.add(E);const w=new V(new Ue(40,10),new Te({map:yc("STEEL RIBBON"),transparent:!0,side:ue}));w.position.set(60,0,0),h.add(w);const R=900,P=240;h.position.set(0,P,-1200),Jt.add(h),kn(h,b=>{const M=b*.05;h.position.x=Math.cos(M)*R,h.position.z=-1200+Math.sin(M)*R*.5,h.position.y=P+Math.sin(b*.3)*8,h.rotation.y=-M+Math.PI/2})}const m=new Te({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let h=0;h<14;h++){const S=new V(new Ue(220+Math.random()*360,16+Math.random()*22),m.clone());S.material.opacity=.12+Math.random()*.18,S.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),S.rotation.x=-Math.PI/2.1,S.rotation.z=Math.random()*Math.PI,S.scale.y=.3,Jt.add(S);const _=2+Math.random()*3;kn(S,(y,E)=>{S.position.x+=_*E,S.position.x>1400&&(S.position.x=-1400)})}const g=new K({color:13620954,roughness:.6,metalness:.2}),v=new Te({map:Kg(),side:ue});for(let h=0;h<4;h++){const S=Dn(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!S)continue;const{x:_,z:y}=S,E=new re,w=60+Math.random()*40,R=new V(new Pt(w,1.4,26),g);R.position.set(0,26,-4),R.rotation.x=-.32,E.add(R);const P=new V(new Ue(w*.94,24),v);P.position.set(0,12,6),P.rotation.x=-.85,E.add(P);for(const b of[-w/2,w/2]){const M=new V(new Pt(1.4,26,1.4),g);M.position.set(b,13,-8),E.add(M)}E.position.set(_,jt(_,y),y),E.rotation.y=Math.atan2(-_,-y)+(Math.random()-.5)*.5,Jt.add(E),In("grandstand",_,y,40,30)}const p=[16731486,16765503,16777215,11824127];for(let h=0;h<90;h++){const S=Dn(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!S)continue;const{x:_,z:y}=S,E=new re,w=p[Math.floor(Math.random()*p.length)],R=new Te({color:w,side:ue}),P=5+Math.floor(Math.random()*6);for(let b=0;b<P;b++){const M=new V(new dn(.5+Math.random()*.4,5),R);M.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),M.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,M.rotation.z=Math.random()*Math.PI,E.add(M)}E.position.set(_,jt(_,y),y),Jt.add(E),In("flowers",_,y,3,20)}}const Hn=[],Wn=[];let Wo=0;const $s=[],ca=[],Fi=[],Xo=[],lr=[],ms=[],Re={traffic:0,pedestrians:0,types:{},turns:0,splats:0,streetLights:0,trafficLights:0,stopSigns:0};function Gg(i,t){const e=new re,n={compact:{w:2.2,h:1.05,l:4.3,cabin:[1.55,.78,1.75],cabinZ:-.35},taxi:{w:2.25,h:1.08,l:4.5,cabin:[1.6,.82,1.9],cabinZ:-.25,sign:!0},pickup:{w:2.35,h:1.12,l:5.2,cabin:[1.62,.88,1.65],cabinZ:-1.15,bed:!0},van:{w:2.55,h:1.65,l:5.4,cabin:[2.05,.82,2.1],cabinZ:-.85},boxTruck:{w:2.8,h:1.25,l:6.6,cabin:[2,.95,1.75],cabinZ:-2.1,box:[2.75,2,3.35]},bus:{w:3,h:2,l:8.6,cabin:[2.72,.9,6.6],cabinZ:.1,bus:!0}},s=n[i]||n.compact,r=new K({color:t,roughness:.34,metalness:.28}),a=new K({color:new Zt(t).multiplyScalar(.52),roughness:.42,metalness:.24}),o=new K({color:10217727,roughness:.08,metalness:.08,transparent:!0,opacity:.62,emissive:1192778,emissiveIntensity:.2}),c=new K({color:395016,roughness:.72,metalness:.02}),l=new K({color:14147041,roughness:.2,metalness:.68}),d=new K({color:16774064,roughness:.2,emissive:16765788,emissiveIntensity:.82}),u=new K({color:16725033,roughness:.22,emissive:16717325,emissiveIntensity:.7}),f=new V(new Pt(s.w,s.h,s.l),i==="taxi"?new K({color:16767293,roughness:.36,metalness:.24}):r);f.position.y=.95,e.add(f);const m=new V(new Pt(s.cabin[0],s.cabin[1],s.cabin[2]),s.bus?o:r);if(m.position.set(0,1.65,s.cabinZ),e.add(m),!s.bus){const p=new V(new Pt(s.cabin[0]*.78,s.cabin[1]*.55,.08),o);p.position.set(0,1.68,s.cabinZ-s.cabin[2]*.5-.05),e.add(p);for(const h of[-1,1]){const S=new V(new Pt(.08,s.cabin[1]*.5,s.cabin[2]*.48),o);S.position.set(h*(s.cabin[0]*.5+.04),1.68,s.cabinZ),e.add(S)}}if(s.bed){const p=new V(new Pt(s.w*.94,.58,s.l*.38),a);p.position.set(0,1.2,1.35),e.add(p)}if(s.box){const p=new V(new Pt(s.box[0],s.box[1],s.box[2]),new K({color:15130833,roughness:.62,metalness:.05}));p.position.set(0,1.55,1.25),e.add(p)}if(s.bus){const p=new V(new Pt(s.w+.06,.28,s.l*.86),a);p.position.set(0,1.38,0),e.add(p);for(let h=-2.8;h<=3.1;h+=1.2)for(const S of[-1,1]){const _=new V(new Pt(.08,.64,.72),o);_.position.set(S*(s.w*.5+.05),2.08,h),e.add(_)}}if(s.sign){const p=new V(new Pt(1,.24,.46),new K({color:16774310,roughness:.2,emissive:16765773,emissiveIntensity:.9}));p.position.set(0,2.2,-.35),e.add(p)}const g=s.l>6?[-s.l*.34,0,s.l*.34]:[-s.l*.34,s.l*.34],v=[];for(const p of g)for(const h of[-s.w*.54,s.w*.54]){const S=new V(new he(.42,.42,.36,14),c);S.rotation.z=Math.PI/2,S.position.set(h,.45,p),e.add(S),v.push(S);const _=new V(new he(.18,.18,.38,10),l);_.rotation.z=Math.PI/2,_.position.set(h,.45,p),e.add(_)}for(const p of[-s.w*.28,s.w*.28]){const h=new V(new Pt(.42,.2,.08),d);h.position.set(p,.95,-s.l*.52),e.add(h);const S=new V(new Pt(.36,.22,.08),u);S.position.set(p,.98,s.l*.52),e.add(S)}return e.userData={wheels:v,colliderHalfW:s.w*.58,colliderHalfD:s.l*.55},e.traverse(p=>{p.castShadow=!0,p.receiveShadow=!0}),e}function Hg(i,t){const e=new re,n=new K({color:12947299,roughness:.72}),s=new K({color:i,roughness:.68}),r=new K({color:t,roughness:.76}),a=new K({color:1119001,roughness:.82}),o=new V(new he(.28,.34,.95,8),s);o.position.y=1.35,e.add(o);const c=new V(new He(.24,10,8),n);c.position.y=2.02,e.add(c);const l=new V(new He(.25,8,5),a);l.scale.y=.5,l.position.y=2.17,e.add(l);const d=[];for(const u of[-.16,.16]){const f=new V(new he(.075,.09,.78,6),r);f.position.set(u,.58,0),e.add(f),d.push({mesh:f,side:Math.sign(u),baseY:.58,amp:.28})}for(const u of[-.38,.38]){const f=new V(new he(.055,.065,.72,6),n);f.position.set(u,1.33,0),f.rotation.z=u<0?-.18:.18,e.add(f),d.push({mesh:f,side:-Math.sign(u),baseY:1.33,amp:.34})}return e.userData.limbs=d,e.traverse(u=>{u.castShadow=!0,u.receiveShadow=!0}),e}function Wg(i,t,e){const{X0:n,X1:s,ZN:r,ZF:a,pitch:o,streetW:c,trafficControls:l=new Map}=e,d=[12139059,3109053,15263967,3818573,4695133,14793024,9261235,16767293],u=["compact","taxi","pickup","van","boxTruck","bus"],f=[],m=30,g=[],v=[];for(let N=n;N<=s+1;N+=o)g.push(Math.round(N));for(let N=r;N>=a-1;N-=o)v.push(Math.round(N));v.sort((N,Mt)=>N-Mt);const p=g[0],h=g[g.length-1],S=v[0],_=v[v.length-1];Fi.length=0,Xo.length=0,lr.length=0,ms.length=0,Re.traffic=0,Re.pedestrians=0,Re.types={},Re.turns=0,Re.splats=0,Re.streetLights=0,Re.trafficLights=0,Re.stopSigns=0;const y=N=>N[Math.random()*N.length|0],E=N=>(N>0?-1:1)*c*.23,w=(N,Mt)=>{let gt=0,yt=1/0;for(let At=0;At<N.length;At++){const X=Math.abs(N[At]-Mt);X<yt&&(yt=X,gt=At)}return gt},R=(N,Mt,gt)=>{const yt=N==="ns"?v:g;if(gt>0){for(const At of yt)if(At>Mt+.05)return At;return yt[yt.length-1]}for(let At=yt.length-1;At>=0;At--)if(yt[At]<Mt-.05)return yt[At];return yt[0]},P=N=>N.axis==="ns"?{x:N.road+N.laneOffset,z:N.along}:{x:N.along,z:N.road+N.laneOffset},b=(N,Mt)=>`${Math.round(N)},${Math.round(Mt)}`,M=(N,Mt)=>{const yt=((Mt+N.phase)%15.5+15.5)%15.5;return yt<6.2?"ns":yt<7.4?"yellow-ns":yt<13.6?"ew":"yellow-ew"},A=(N,Mt)=>{const gt=N.axis==="ns"?N.road:N.next,yt=N.axis==="ns"?N.next:N.road,At=b(gt,yt),X=l.get(At);if(!X)return null;if(X.type==="signal"){const rt=M(X,Mt),pt=rt===`yellow-${N.axis}`;return rt===N.axis&&!pt?null:{control:X,key:At,kind:"signal"}}return X.type==="stop"&&N.lastControlKey!==At?{control:X,key:At,kind:"stop"}:null},I=(N,Mt=!1)=>{const gt=N.axis,yt=N.along,At=gt==="ns"?g:v,X=N.road,rt=w(At,X),pt=[],Dt=gt==="ns"?S:p,Et=gt==="ns"?_:h;!Mt&&yt+N.dir*o>=Dt&&yt+N.dir*o<=Et&&pt.push({axis:gt,road:N.road,along:yt,dir:N.dir,turn:!1}),rt>0&&pt.push({axis:gt==="ns"?"ew":"ns",road:yt,along:X,dir:-1,turn:!0}),rt<At.length-1&&pt.push({axis:gt==="ns"?"ew":"ns",road:yt,along:X,dir:1,turn:!0}),pt.length||pt.push({axis:gt,road:N.road,along:yt,dir:-N.dir,turn:!0});const Wt=pt.filter(Yt=>Yt.turn),ve=!Mt&&Wt.length&&Math.random()<.42?y(Wt):y(pt);(ve.turn||ve.axis!==gt)&&Re.turns++,N.axis=ve.axis,N.road=ve.road,N.along=ve.along,N.dir=ve.dir,N.laneOffset=E(N.dir),N.next=R(N.axis,N.along,N.dir),N.turnBlend=ve.turn?1:0,N.lastControlKey=null};for(let N=0;N<m;N++){const Mt=Math.random()<.56?"ns":"ew",gt=u[N%u.length],yt=Math.random()<.5?-1:1,At=(gt==="bus"||gt==="boxTruck"?10:13)+Math.random()*9,X={axis:Mt,dir:yt,road:y(Mt==="ns"?g:v),laneOffset:E(yt),along:y(Mt==="ns"?v:g),speed:At,bob:Math.random()*Math.PI*2,next:0,turnBlend:0,waitTimer:0,lastControlKey:null,mesh:Gg(gt,d[N*3%d.length]),collider:{kind:"traffic",x:0,z:0,hw:2,hd:3,maxY:0}};N<8&&(X.axis="ns",X.dir=-1,X.laneOffset=E(X.dir),X.road=[80,210,-50,80][N%4],X.along=370-N*54,X.speed+=3),X.next=R(X.axis,X.along,X.dir),Fi.push(X.collider),f.push(X),Xo.push(X),i.add(X.mesh),Re.types[gt]=(Re.types[gt]||0)+1}function B(N,Mt=0,gt=0){let yt=Math.max(0,N.speed*gt);for(N.waitTimer>0&&(N.waitTimer=Math.max(0,N.waitTimer-gt),yt=0);yt>0;){const Yt=A(N,Mt);if(Yt){const F=N.next-N.dir*(Yt.kind==="signal"?12:8),ee=(F-N.along)*N.dir;if(ee>=-.35&&ee<=yt+.25){N.along=F,N.brakePulse=1,yt=0,Yt.kind==="stop"&&(N.waitTimer=.65+Math.random()*.4,N.lastControlKey=Yt.key);break}}const Me=Math.abs(N.next-N.along);if(yt<Me)N.along+=N.dir*yt,yt=0;else{N.along=N.next,yt-=Me;const F=N.next<=(N.axis==="ns"?S:p)+.05||N.next>=(N.axis==="ns"?_:h)-.05;I(N,F)}}N.brakePulse=Math.max(0,(N.brakePulse||0)-gt*3.2),N.turnBlend=Math.max(0,N.turnBlend-gt*3.2);const{x:At,z:X}=P(N),rt=N.axis==="ns"?0:N.dir,pt=N.axis==="ns"?N.dir:0;N.mesh.position.set(At,jt(At,X)+.28+Math.sin(Mt*3.2+N.bob)*.035,X);const Dt=Math.atan2(-rt,-pt),Et=Math.atan2(Math.sin(Dt-N.mesh.rotation.y),Math.cos(Dt-N.mesh.rotation.y));N.mesh.rotation.y+=Et*Math.min(1,gt*7+N.turnBlend*.55);for(const Yt of N.mesh.userData.wheels||[])Yt.rotation.x-=N.dir*N.speed*gt*1.7;const Wt=N.mesh.userData.colliderHalfD,ve=N.mesh.userData.colliderHalfW;N.collider.x=At,N.collider.z=X,N.collider.hw=N.axis==="ns"?ve:Wt,N.collider.hd=N.axis==="ns"?Wt:ve,N.collider.maxY=N.mesh.position.y+3.2}for(const N of f)B(N,0,0);Re.traffic=f.length,kn(i,(N,Mt)=>{for(const gt of f)B(gt,N,Mt)});const Y=[14703451,5217256,15779915,6535022,12284639,15724527,15764053],q=[2437188,3092787,4930093,2244434],Z=[],ct=45;for(let N=0;N<ct;N++){const Mt=Math.random()<.56?"ns":"ew",gt=t[Math.random()*t.length|0],yt=Math.abs(gt.z1-gt.z0)>Math.abs(gt.x1-gt.x0),At=Mt==="ns"?yt?"ns":"ew":yt?"ew":"ns",X=Math.random()<.5?-1:1,rt=Math.random()<.5?-1:1,pt={axis:At,dir:X,sideSign:rt,coord:y(At==="ns"?g:v),along:At==="ns"?a+Math.random()*(r-a):n+Math.random()*(s-n),speed:1.8+Math.random()*1.3,phase:Math.random()*Math.PI*2,active:!0,respawn:0,x:0,z:0,hitRadius:.9,mesh:Hg(Y[N%Y.length],q[N*2%q.length])};N<14&&(pt.axis="ns",pt.coord=80,pt.sideSign=N%2?-1:1,pt.dir=N%3===0?1:-1,pt.along=350-N*24,pt.speed=1.5+N%4*.35),Z.push(pt),lr.push(pt),i.add(pt.mesh)}const nt=new Te({color:14230306,transparent:!0,opacity:0,depthWrite:!1,side:ue}),mt=new Te({color:16734015,transparent:!0,opacity:0,depthWrite:!1,side:ue});for(let N=0;N<18;N++){const Mt=new re,gt=new V(new dn(1,12),nt.clone());gt.rotation.x=-Math.PI/2,Mt.add(gt);for(let yt=0;yt<7;yt++){const At=new V(new dn(.25+Math.random()*.25,8),mt.clone());At.rotation.x=-Math.PI/2,At.position.set(Math.cos(yt)*(.6+Math.random()*1.2),.01,Math.sin(yt*1.7)*(.5+Math.random()*1.1)),Mt.add(At)}Mt.visible=!1,Mt.userData.life=0,Mt.userData.maxLife=2.8,Mt.position.y=-99,i.add(Mt),ms.push(Mt)}function _t(N,Mt=0,gt=0){if(!N.active)if(N.respawn-=gt,N.respawn<=0)N.active=!0,N.mesh.visible=!0,N.along+=N.dir*50;else return;N.along+=N.dir*N.speed*gt,N.axis==="ns"?(N.along<a-28&&(N.along=r+28),N.along>r+28&&(N.along=a-28)):(N.along<n-28&&(N.along=s+28),N.along>s+28&&(N.along=n-28));const yt=N.sideSign*(c*.66+1.2),At=N.axis==="ns"?N.coord+yt:N.along,X=N.axis==="ns"?N.along:N.coord+yt,rt=N.axis==="ns"?0:N.dir,pt=N.axis==="ns"?N.dir:0;N.x=At,N.z=X,N.mesh.position.set(At,jt(At,X)+.08,X),N.mesh.rotation.y=Math.atan2(-rt,-pt);const Dt=Math.sin(Mt*7+N.phase);for(const Et of N.mesh.userData.limbs||[])Et.mesh.rotation.x=Dt*Et.amp*Et.side,Et.mesh.position.y=Et.baseY+Math.abs(Dt)*.025}for(const N of Z)_t(N,0,0);Re.pedestrians=Z.length,kn(i,(N,Mt)=>{for(const gt of Z)_t(gt,N,Mt);for(const gt of ms){if(!gt.visible)continue;gt.userData.life-=Mt;const yt=gt.userData.life,At=zt.clamp(yt/gt.userData.maxLife,0,1);gt.scale.setScalar(1+(1-At)*.35),gt.traverse(X=>{X.material&&(X.material.opacity=Math.min(.78,At*1.2))}),yt<=0&&(gt.visible=!1)}})}function Xg(){const i=new re,t=new ze;new ci().setFromAxisAngle(new U(1,0,0),-Math.PI/2);const e=Li.x0,n=Li.x1,s=Li.zNear,r=Li.zFar,a=Li.pitch,o=Li.streetW,c=a-o,l=[],d=[];for(let O=e;O<=n+1;O+=a)l.push(Math.round(O));for(let O=s;O>=r-1;O-=a)d.push(Math.round(O));const u=[];for(const O of l)u.push({x0:O,z0:s,x1:O,z1:r});for(const O of d)u.push({x0:e,z0:O,x1:n,z1:O});function f(O,z,W){const $=[],it=[];for(const st of O){const ot=st.x1-st.x0,at=st.z1-st.z0,tt=Math.hypot(ot,at),J=Math.max(1,Math.round(tt/14)),vt=ot/tt,dt=-(at/tt),Ft=vt;let $t=null,de=null;for(let ge=0;ge<=J;ge++){const se=ge/J,Ve=se*tt/68,Le=st.x0+ot*se,Ye=st.z0+at*se,$e=Le+dt*z,Ke=Ye+Ft*z,Ze=Le-dt*z,xn=Ye-Ft*z,wn=[$e,jt($e,Ke)+W,Ke,Ve],an=[Ze,jt(Ze,xn)+W,xn,Ve];$t&&($.push($t[0],$t[1],$t[2],de[0],de[1],de[2],an[0],an[1],an[2]),$.push($t[0],$t[1],$t[2],an[0],an[1],an[2],wn[0],wn[1],wn[2]),it.push(0,$t[3],1,de[3],1,an[3]),it.push(0,$t[3],1,an[3],0,wn[3])),$t=wn,de=an}}const L=new ke;return L.setAttribute("position",new pe($,3)),L.setAttribute("uv",new pe(it,2)),L.computeVertexNormals(),L}const m=new K({map:Dg(),color:13097186,roughness:.34,metalness:.24,envMapIntensity:1.25,side:ue}),g=new V(f(u,o/2,.55),m);g.receiveShadow=!0,i.add(g);const v=new K({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:ue});i.add(new V(f(u,.4,.62),v));const p=new Te({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:ue,blending:Ui}),h=new Te({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:ue,blending:Ui});for(let O=0;O<120;O++){const z=u[Math.random()*u.length|0],W=Math.random(),$=z.x0+(z.x1-z.x0)*W,it=z.z0+(z.z1-z.z0)*W;if(Vn($,it,4).clearance<2)continue;const L=new V(new dn(1,18),(O%4===0?h:p).clone());L.rotation.x=-Math.PI/2,L.rotation.z=Math.atan2(z.x1-z.x0,z.z1-z.z0)+(Math.random()-.5)*.35,L.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),L.position.set($+(Math.random()-.5)*o*.7,jt($,it)+.66,it+(Math.random()-.5)*o*.7),i.add(L)}const S=[us(160,320,.5),us(160,320,.62),us(160,320,.42)],_=[new K({map:S[0],color:7042688,roughness:.42,metalness:.26,emissive:2315117,emissiveIntensity:.34}),new K({map:S[1],color:8550507,roughness:.46,metalness:.22,emissive:4860952,emissiveIntensity:.32}),new K({map:S[2],color:4414064,roughness:.4,metalness:.3,emissive:1523562,emissiveIntensity:.38})],y=new Pt(1,1,1),E=[[],[],[]],w=[],R=[],P=[],b=[],M=[],A=[],I=[],B=[],Y=[],q=[],Z=[],ct=[14141877,14865853,13350555,13620947,14731694,12568509,13805717,13222061],nt=Ig(256,256,"#dbcdb8"),mt=Ug(),_t=Ng();function N(O,z,W,$,it){const L=jt(O,z)-1;if(Gs(O,z,W,$,L+it+2))return!1;if(t.position.set(O,L+it/2,z),t.quaternion.identity(),t.scale.set(W,it,$),t.updateMatrix(),E[Math.random()*3|0].push(t.matrix.clone()),t.position.set(O,L+it+.6,z),t.scale.set(W*1.04,1.2,$*1.04),t.updateMatrix(),w.push(t.matrix.clone()),it>26){const st=Math.random()<.72?3790847:16730294;for(const ot of[-1,1])t.position.set(O,L+it+1.35,z+ot*($*.52+.12)),t.scale.set(W*1.12,.22,.18),t.updateMatrix(),R.push(t.matrix.clone()),P.push(st);Math.random()<.34&&b.push({px:O,pz:z,w:W,d:$,h:it,gy:L,zSide:Math.random()<.5?-1:1})}return Hn.push({x:O,z,hw:W*.5,hd:$*.5,maxY:L+it+2}),!0}function Mt(O,z,W,$,it){const L=jt(O,z)-.4,st=2+Math.random()*2.4;if(Gs(O,z,W,$,L+it+st+1.5,6))return!1;t.position.set(O,L+it/2,z),t.quaternion.identity(),t.scale.set(W,it,$),t.updateMatrix(),M.push(t.matrix.clone()),Hn.push({x:O,z,hw:W*.5,hd:$*.5,maxY:L+it+st+1.5}),A.push(ct[Math.random()*ct.length|0]),t.position.set(O,L+it+st/2,z),t.scale.set(W*.82,st,$*.82),t.updateMatrix(),I.push(t.matrix.clone());const ot=e+Math.round((O-e)/a)*a,at=s-Math.round((s-z)/a)*a,tt=Math.abs(O-ot)<Math.abs(z-at),J=tt?ot>O?1:-1:at>z?1:-1,vt=Math.min(tt?$*.46:W*.46,8.5),xt=Math.min(it*.58,4.6),dt=Math.min(24,Math.max(8,tt?Math.abs(ot-O)-W*.5-o*.35:Math.abs(at-z)-$*.5-o*.35));t.quaternion.identity(),tt?(t.position.set(O+J*(W*.5+.1),L+xt*.5+.1,z-$*.16),t.scale.set(.24,xt,vt),t.updateMatrix(),B.push(t.matrix.clone()),t.position.set(O+J*(W*.5+dt*.5),jt(O+J*(W*.5+dt*.5),z)+.08,z-$*.16),t.scale.set(dt,.08,vt*1.18)):(t.position.set(O-W*.16,L+xt*.5+.1,z+J*($*.5+.1)),t.scale.set(vt,xt,.24),t.updateMatrix(),B.push(t.matrix.clone()),t.position.set(O-W*.16,jt(O,z+J*($*.5+dt*.5))+.08,z+J*($*.5+dt*.5)),t.scale.set(vt*1.18,.08,dt)),t.updateMatrix(),Y.push(t.matrix.clone()),t.position.set(O,L+.02,z),t.scale.set(W*1.58,.05,$*1.58),t.updateMatrix(),q.push(t.matrix.clone());for(let Ft=0;Ft<3;Ft++){const $t=tt?O+J*(W*.55):O+(Ft-1)*W*.25,de=tt?z+(Ft-1)*$*.28:z+J*($*.55);t.position.set($t,jt($t,de)+.55,de);const ge=.85+Math.random()*.75;t.scale.set(ge*1.35,ge,ge*1.35),t.updateMatrix(),Z.push(t.matrix.clone())}return!0}for(let O=e+a/2;O<=n-a/2;O+=a)for(let z=s-a/2;z>=r+a/2;z-=a){const W=Vn(O,z,c*.5).clearance;if(W<2)continue;const $=z>40&&z<380&&O>-360&&O<360;if(W<90||$){const L=c/3;for(let st=0;st<3;st++)for(let ot=0;ot<3;ot++){if(Math.random()<.14)continue;const at=O-c/2+L*(st+.5)+(Math.random()-.5)*L*.3,tt=z-c/2+L*(ot+.5)+(Math.random()-.5)*L*.3;if(Vn(at,tt,8).clearance<1)continue;const J=L*(.5+Math.random()*.22),vt=L*(.5+Math.random()*.22);!$&&Math.random()<.16?N(at,tt,J*.9,vt*.9,12+Math.random()*12):Mt(at,tt,J,vt,5+Math.random()*4.5)}}else{const it=W>230,L=it?zt.clamp(50+W*1.1,60,175):zt.clamp(22+W*.3,22,62),st=2+(Math.random()<.72?1:0)+(Math.random()<.42?1:0);for(let ot=0;ot<st;ot++){const at=13+Math.random()*Math.min(26,c*.44),tt=13+Math.random()*Math.min(26,c*.44),J=O+(Math.random()-.5)*(c-at),vt=z+(Math.random()-.5)*(c-tt);if(Vn(J,vt,Math.hypot(at,tt)*.5).clearance<2)continue;const xt=(18+Math.random()*(L-18))*(it&&Math.random()<.2?1.35:1);N(J,vt,at,tt,xt)}}}for(let O=0;O<3;O++){if(!E[O].length)continue;const z=new Qe(y,_[O],E[O].length);for(let W=0;W<E[O].length;W++)z.setMatrixAt(W,E[O][W]);z.instanceMatrix.needsUpdate=!0,z.castShadow=!0,z.receiveShadow=!0,i.add(z)}if(w.length){const O=new K({color:2896696,roughness:.62,metalness:.34}),z=new Qe(y,O,w.length);for(let W=0;W<w.length;W++)z.setMatrixAt(W,w[W]);z.instanceMatrix.needsUpdate=!0,i.add(z)}if(R.length){const O=new K({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),z=new Qe(y,O,R.length);for(let W=0;W<R.length;W++)z.setMatrixAt(W,R[W]),z.setColorAt(W,new Zt(P[W]));z.instanceMatrix.needsUpdate=!0,z.instanceColor&&(z.instanceColor.needsUpdate=!0),i.add(z)}if(M.length){const O=new K({color:4891451,roughness:.88,metalness:.02}),z=new Qe(y,O,q.length);for(let dt=0;dt<q.length;dt++)z.setMatrixAt(dt,q[dt]);z.instanceMatrix.needsUpdate=!0,z.receiveShadow=!0,i.add(z);const W=new K({color:12040883,roughness:.48,metalness:.05}),$=new Qe(y,W,Y.length);for(let dt=0;dt<Y.length;dt++)$.setMatrixAt(dt,Y[dt]);$.instanceMatrix.needsUpdate=!0,$.receiveShadow=!0,i.add($);const it=new K({map:nt,roughness:.78,metalness:.03}),L=new Qe(y,it,M.length);for(let dt=0;dt<M.length;dt++)L.setMatrixAt(dt,M[dt]),L.setColorAt(dt,new Zt(A[dt]));L.instanceMatrix.needsUpdate=!0,L.instanceColor&&(L.instanceColor.needsUpdate=!0),L.castShadow=!0,L.receiveShadow=!0,i.add(L);const st=new zi(.72,1,4);st.rotateY(Math.PI/4);const ot=new K({map:mt,color:14314033,roughness:.72}),at=new Qe(st,ot,I.length);for(let dt=0;dt<I.length;dt++)at.setMatrixAt(dt,I[dt]);at.instanceMatrix.needsUpdate=!0,at.castShadow=!0,i.add(at);const tt=new K({map:_t,roughness:.38,metalness:.18}),J=new Qe(y,tt,B.length);for(let dt=0;dt<B.length;dt++)J.setMatrixAt(dt,B[dt]);J.instanceMatrix.needsUpdate=!0,i.add(J);const vt=new K({color:3112239,roughness:.88,metalness:.02}),xt=new Qe(new He(1,8,6),vt,Z.length);for(let dt=0;dt<Z.length;dt++)xt.setMatrixAt(dt,Z[dt]);xt.instanceMatrix.needsUpdate=!0,xt.castShadow=!0,xt.receiveShadow=!0,i.add(xt)}const gt=["HOTEL","OPEN","AUTO","RACE","CAFE"];for(let O=0;O<Math.min(b.length,18);O++){const z=b[O],W=gt[O%gt.length],$=O%3===0?"#ff4fb7":O%3===1?"#4ff3ff":"#ffd45b",it=new Te({map:Vl(W,$),transparent:!0,side:ue,depthWrite:!1}),L=new V(new Ue(8,24),it);L.position.set(z.px,z.gy+Math.max(14,z.h*.58),z.pz+z.zSide*(z.d*.5+.25)),L.rotation.y=z.zSide<0?Math.PI:0,i.add(L)}const yt=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],At=new Pt(2.2,1.4,4.6),X=130,rt=new Qe(At,new K({roughness:.42,metalness:.36}),X);let pt=0,Dt=0;for(;pt<X&&Dt<X*6;){Dt++;const O=Math.random()<.5,z=O?e+Math.round(Math.random()*((n-e)/a))*a+(Math.random()<.5?-1:1)*(o*.26):e+Math.random()*(n-e),W=O?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(Vn(z,W,4).clearance<2)continue;const $=jt(z,W)+.7;t.position.set(z,$,W),t.quaternion.setFromAxisAngle(tn,O?0:Math.PI/2),t.scale.set(1,1,1),t.updateMatrix(),rt.setMatrixAt(pt,t.matrix),rt.setColorAt(pt,new Zt(yt[Math.random()*yt.length|0])),pt++}rt.count=pt,rt.instanceMatrix.needsUpdate=!0,rt.instanceColor&&(rt.instanceColor.needsUpdate=!0),i.add(rt);const Et=new Map,Wt=(O,z)=>`${Math.round(O)},${Math.round(z)}`;function ve(O,z){const $=((z+O.phase)%15.5+15.5)%15.5;return $<6.2?{green:"ns",yellow:null}:$<7.4?{green:null,yellow:"ns"}:$<13.6?{green:"ew",yellow:null}:{green:null,yellow:"ew"}}function Yt(){const O=[],z=new K({color:1120028,roughness:.38,metalness:.62}),W=new K({color:1382685,roughness:.34,metalness:.38}),$=Fg(),it=new Te({map:$,transparent:!0,side:ue}),L=new K({color:5050642,roughness:.48,metalness:.12}),st=(xt,dt)=>new K({color:xt,roughness:.16,metalness:.02,emissive:dt,emissiveIntensity:.2}),ot=(xt,dt,Ft,$t,de,ge)=>{const se=new re,Ve=new V(new Pt(1.15,2.85,.75),W);se.add(Ve);const Le=st(16724008,16717836),Ye=st(16767053,16757276),$e=st(4521842,1693789),Ke=[Le,Ye,$e];for(let Ze=0;Ze<3;Ze++){const xn=new V(new He(.28,12,8),Ke[Ze]);xn.position.set(0,.78-Ze*.78,-.42),se.add(xn)}se.position.set(Ft,$t,de),se.rotation.y=ge,xt.add(se),O.push({axis:dt,red:Le,yellow:Ye,green:$e,control:xt.userData.control})},at=(xt,dt,Ft)=>{const $t=Wt(xt,dt),de={type:"signal",x:xt,z:dt,phase:Ft%4*2.1};Et.set($t,de);const ge=jt(xt,dt),se=new re;se.userData.control=de;const Ve=o*.72,Le=o*.72,Ye=new V(new he(.18,.24,8.2,8),z);Ye.position.set(Ve,4.1,Le),se.add(Ye);const $e=new V(new Pt(o*1.65,.2,.2),z);$e.position.set(Ve-o*.72,8,Le),se.add($e);const Ke=new V(new Pt(.2,.2,o*1.65),z);Ke.position.set(Ve,7.55,Le-o*.72),se.add(Ke),ot(se,"ns",Ve-o*1.24,7.52,Le,0),ot(se,"ns",Ve-o*.18,7.52,-Le,Math.PI),ot(se,"ew",Ve,7.05,Le-o*1.24,Math.PI/2),ot(se,"ew",-Ve,7.05,Le-o*.18,-Math.PI/2),se.position.set(xt,ge,dt),se.traverse(Ze=>{Ze.castShadow=!0,Ze.receiveShadow=!0}),i.add(se)},tt=(xt,dt,Ft)=>{const $t=Wt(xt,dt);Et.set($t,{type:"stop",x:xt,z:dt,phase:0});const de=jt(xt,dt),ge=new re,se=Ft%2?-1:1,Ve=Ft%3?1:-1,Le=new V(new he(.12,.16,4.2,7),z);Le.position.y=2.1,ge.add(Le);const Ye=new V(new dn(1.04,8),L);Ye.position.y=4.55,Ye.rotation.y=Math.PI,ge.add(Ye);const $e=new V(new Ue(2.05,2.05),it);$e.position.set(0,4.55,-.04),ge.add($e),ge.position.set(xt+se*o*.74,de,dt+Ve*o*.74),ge.rotation.y=Math.atan2(se,Ve),ge.traverse(Ke=>{Ke.castShadow=!0,Ke.receiveShadow=!0}),i.add(ge)};let J=0,vt=0;for(let xt=1;xt<l.length-1;xt++)for(let dt=1;dt<d.length-1;dt++){const Ft=l[xt],$t=d[dt];if(Vn(Ft,$t,o*.9).clearance<2)continue;const de=Math.abs(Ft-80)<=a*1.05&&$t<=s&&$t>=-560,ge=$t<-260&&$t>-1180&&(xt+dt)%4===0,se=$t>-360&&(xt+dt)%2===0;de&&dt%2===0||ge?at(Ft,$t,J++):(se||(xt+dt)%5===0&&$t>-820)&&tt(Ft,$t,vt++)}return kn(i,xt=>{for(const dt of O){const Ft=ve(dt.control,xt);dt.red.emissiveIntensity=Ft.green===dt.axis||Ft.yellow===dt.axis?.12:2.3,dt.yellow.emissiveIntensity=Ft.yellow===dt.axis?2.6:.12,dt.green.emissiveIntensity=Ft.green===dt.axis?2.6:.1}}),{trafficLights:J,stopSigns:vt}}const Me=Yt();Wg(i,u,{X0:e,X1:n,ZN:s,ZF:r,pitch:a,streetW:o,trafficControls:Et}),Re.trafficLights=Me.trafficLights,Re.stopSigns=Me.stopSigns;const F=new he(.12,.16,7.2,7),ee=new He(.46,10,8),ae=new Ue(2.8,13),Se=new K({color:1581353,roughness:.42,metalness:.68}),It=new K({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),Pe=new Te({color:16760163,transparent:!0,opacity:.16,depthWrite:!1,side:ue,blending:Ui}),Ot=132,qt=new Qe(F,Se,Ot),D=new Qe(ee,It,Ot),T=new Qe(ae,Pe,Ot);let H=0;for(let O=0;O<Ot*2&&H<Ot;O++){const z=Math.random()<.5,W=z?e+Math.round(Math.random()*((n-e)/a))*a+(Math.random()<.5?-1:1)*(o*.58):e+Math.random()*(n-e),$=z?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(Vn(W,$,3).clearance<2)continue;const it=jt(W,$);t.quaternion.identity(),t.position.set(W,it+3.6,$),t.scale.set(1,1,1),t.updateMatrix(),qt.setMatrixAt(H,t.matrix),t.position.set(W,it+7.5,$),t.updateMatrix(),D.setMatrixAt(H,t.matrix),t.position.set(W,it+.72,$),t.quaternion.setFromAxisAngle(new U(1,0,0),-Math.PI/2),t.rotateZ(z?0:Math.PI/2),t.scale.set(1,1,1),t.updateMatrix(),T.setMatrixAt(H,t.matrix),H++}qt.count=H,D.count=H,T.count=H,qt.instanceMatrix.needsUpdate=!0,D.instanceMatrix.needsUpdate=!0,T.instanceMatrix.needsUpdate=!0,i.add(qt,D,T),Re.streetLights=H;const lt=new K({color:10397084,roughness:.58,metalness:.04}),ft=new K({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12});i.add(new V(f([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),lt)),i.add(new V(f([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),lt)),i.add(new V(f([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),ft));const et=new Te({color:16765818,transparent:!0,opacity:.28,depthWrite:!1,side:ue,blending:Ui});function Bt(O,z,W,$=!1){const it=jt(O,z),L=new re,st=new V(new he(.16,.22,9.5,8),Se);st.position.y=4.75,L.add(st);const ot=new V(new Pt(3.8,.22,.22),Se);ot.position.set(W*1.75,8.95,0),L.add(ot);const at=new V(new He(.62,12,8),It);at.position.set(W*3.6,8.82,0),L.add(at);const tt=new V(new dn(4.6,20),et.clone());tt.position.copy(at.position),tt.rotation.x=-Math.PI/2,tt.material.opacity=.18+Math.random()*.12,L.add(tt);const J=new V(new Ue(3.2,15),Pe.clone());if(J.position.set(W*2.8,.72,0),J.rotation.x=-Math.PI/2,J.scale.y=.7+Math.random()*.35,L.add(J),$){const vt=new gc(16762474,3,52,2.2);vt.position.copy(at.position),L.add(vt)}L.position.set(O,it,z),i.add(L),Re.streetLights++}let bt=0;for(let O=340;O>=-700;O-=118)Bt(63,O,1,bt++%4===0),Bt(97,O-42,-1,bt++%4===0);function kt(O,z,W,$,it,L,st,ot=null,at=0){const tt=jt(O,z)-.45;if(Gs(O,z,W,$,tt+it+2))return!1;const J=O<80?1:-1,vt=new K({map:us(192,512,st),color:L,roughness:.38,metalness:.26,emissive:1719900,emissiveIntensity:.44}),xt=new V(new Pt(W,it,$),vt);xt.position.set(O,tt+it/2,z),xt.castShadow=!0,xt.receiveShadow=!0,i.add(xt);const dt=new K({map:us(220,620,Math.min(.86,st+.18)),color:16777215,roughness:.2,metalness:.14,emissive:1386040,emissiveIntensity:.12,transparent:!0,opacity:.94,side:ue}),Ft=new V(new Ue($*.78,it*.74),dt);Ft.position.set(O+J*(W/2+.09),tt+it*.54,z),Ft.rotation.y=J>0?Math.PI/2:-Math.PI/2,i.add(Ft);const $t=new V(new Pt(W*1.04,1.2,$*1.04),new K({color:1778733,roughness:.34,metalness:.38}));$t.position.set(O,tt+it+.7,z),i.add($t);const de=new K({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const ge of[-1,1]){const se=new V(new Pt(W*1.1,.22,.18),de);se.position.set(O,tt+it+1.4,z+ge*($/2+.18)),i.add(se)}if(ot&&at){const ge=new Te({map:Vl(ot,ot==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:ue,depthWrite:!1}),se=new V(new Ue(7.5,24),ge);se.position.set(O+at*(W/2+.3),tt+Math.min(it-8,it*.58),z),se.rotation.y=at>0?Math.PI/2:-Math.PI/2,i.add(se)}return Hn.push({x:O,z,hw:W*.5,hd:$*.5,maxY:tt+it+2}),!0}function Nt(O,z,W,$=3.2){const it=O*.5+$,L=z*.5+$,st=Math.max(2,Math.abs(it-L)*.72),at=O>=z?[-it,0,-L,it,0,-L,st,W,0,-it,0,-L,st,W,0,-st,W,0,it,0,-L,it,0,L,st,W,0,it,0,L,-it,0,L,-st,W,0,it,0,L,st,W,0,-st,W,0,-it,0,L,-it,0,-L,-st,W,0]:[-it,0,-L,it,0,-L,0,W,-st,it,0,-L,it,0,L,0,W,st,it,0,-L,0,W,st,0,W,-st,it,0,L,-it,0,L,0,W,st,-it,0,L,-it,0,-L,0,W,-st,-it,0,L,0,W,-st,0,W,st],tt=new ke;return tt.setAttribute("position",new pe(at,3)),tt.computeVertexNormals(),tt}function ut(O,z,W,$,it,L,st={}){const ot=jt(O,z)-.3;if(Gs(O,z,W,$,ot+it+(st.roofH??8.2)+1,6))return!1;const at=st.frontZ??-1,tt=new K({map:nt,color:st.wallColor??14734788,roughness:.68,metalness:.03}),J=new V(new Pt(W,it,$),tt);J.position.set(O,ot+it/2,z),J.castShadow=!0,J.receiveShadow=!0,i.add(J);const vt=new K({map:mt,color:L,roughness:.58,metalness:.08,emissive:2951172,emissiveIntensity:.08}),xt=st.roofH??8.2,dt=new V(Nt(W,$,xt),vt);dt.position.set(O,ot+it,z),dt.castShadow=!0,dt.receiveShadow=!0,i.add(dt);const Ft=new K({color:15985112,roughness:.42,metalness:.05}),$t=new V(new Pt(W+7,.42,1.2),Ft);$t.position.set(O,ot+it+.12,z+at*($*.5+1.4)),i.add($t);const de=$t.clone();de.position.z=z-at*($*.5+1.4),i.add(de);const ge=Math.min(18,W*.38),se=new V(new Pt(ge,it*.55,.32),new K({map:_t,roughness:.34,metalness:.2}));se.position.set(O+W*.18,ot+it*.33,z+at*($*.5+.22)),i.add(se);const Ve=new V(new Pt(5.2,7.2,.28),new K({color:4602418,roughness:.36,emissive:4857353,emissiveIntensity:.16}));Ve.position.set(O-W*.25,ot+3.7,z+at*($/2+.24)),i.add(Ve);const Le=new K({color:16764800,roughness:.18,metalness:.04,emissive:16754767,emissiveIntensity:.72}),Ye=new K({color:3353638,roughness:.38});for(const gn of[-W*.36,-W*.05,W*.38]){if(Math.abs(gn-W*.18)<ge*.45)continue;const hi=new V(new Pt(6.2,4.8,.26),Ye);hi.position.set(O+gn,ot+it*.58,z+at*($*.5+.28)),i.add(hi);const di=new V(new Pt(4.8,3.4,.3),Le);di.position.copy(hi.position),di.position.z+=at*.04,i.add(di)}const $e=new K({color:12370619,roughness:.44,metalness:.04}),Ke=new V(new Pt(ge*1.18,.12,34),$e);Ke.position.set(O+W*.18,jt(O+W*.18,z+at*($*.5+17))+.11,z+at*($*.5+17)),i.add(Ke);const Ze=new K({color:5679925,roughness:.86,metalness:.01}),xn=new V(new Pt(W+10,.08,$+12),Ze);xn.position.set(O,jt(O,z)-.18,z),xn.receiveShadow=!0,i.add(xn),xn.renderOrder=-1;const wn=new K({color:3042609,roughness:.84}),an=[new K({color:16766544,roughness:.58}),new K({color:16738974,roughness:.58}),new K({color:16314584,roughness:.58})];for(let gn=0;gn<9;gn++){const hi=O-W*.44+gn*(W*.11),di=z+at*($*.5+2.2+gn%2*1.5),qi=new V(new He(1.35+gn%3*.22,10,7),gn%4===0?an[gn%an.length]:wn);qi.position.set(hi,jt(hi,di)+.95,di),qi.scale.y=.72,qi.castShadow=!0,i.add(qi)}return Hn.push({x:O,z,hw:W*.5,hd:$*.5,maxY:ot+it+5}),!0}return ut(-8,286,92,58,18,14244903,{wallColor:15063235,frontZ:1,roofH:8.8}),ut(168,238,54,46,15,12536356,{wallColor:13946041,frontZ:1,roofH:7.2}),ut(-188,316,48,42,14,12995115,{wallColor:14274744,frontZ:1,roofH:6.8}),ut(262,304,58,46,15,13788715,{wallColor:14799288,frontZ:1,roofH:7.4}),ut(-230,152,54,44,14,12272168,{wallColor:13616562,frontZ:1,roofH:6.8}),ut(282,120,50,42,13,12801063,{wallColor:14275524,frontZ:1,roofH:6.5}),kt(-48,-360,54,86,148,2439765,.58,null,0),kt(172,-430,50,80,132,3817032,.66,"OPEN",-1),Jt.add(i),i}function Yg(i,t=1){const n=fe(16),s=new U(n.tangent.x,0,n.tangent.z).normalize(),r=new U().crossVectors(tn,s).normalize(),a=n.p.clone().addScaledVector(n.side,t*ht.width*.5),o=165,c=52,l=a.x-s.x*o+r.x*t*c,d=a.z-s.z*o+r.z*t*c,u=new U(l,jt(l,d)+.4,d),f=26,m=[];for(let A=0;A<=f;A++){const I=A/f,B=I*I*(3-2*I);m.push(new U(zt.lerp(u.x,a.x,I),zt.lerp(u.y,a.y,B),zt.lerp(u.z,a.z,I)))}const g=7.4,v=new U,p=new U,h=[],S=[];for(let A=0;A<=f;A++)p.subVectors(m[Math.min(f,A+1)],m[Math.max(0,A-1)]),p.y=0,p.normalize(),v.crossVectors(tn,p).normalize(),h.push(m[A].clone().addScaledVector(v,-g)),S.push(m[A].clone().addScaledVector(v,g));const _={kind:"ramp",halfW:g,dirSel:t,mergeS:16,points:m.map(A=>A.clone()),segments:[]};for(let A=0;A<f;A++){const I=m[A],B=m[A+1],Y=B.x-I.x,q=B.z-I.z,Z=Math.max(1e-4,Y*Y+q*q);_.segments.push({a:I.clone(),b:B.clone(),abx:Y,abz:q,lenSq:Z,u0:A/f,u1:(A+1)/f})}ca.push(_);const y=[];for(let A=0;A<f;A++){const I=h[A],B=S[A],Y=h[A+1],q=S[A+1];y.push(I.x,I.y,I.z,B.x,B.y,B.z,q.x,q.y,q.z),y.push(I.x,I.y,I.z,q.x,q.y,q.z,Y.x,Y.y,Y.z)}const E=new ke;E.setAttribute("position",new pe(y,3)),E.computeVertexNormals();const w=new K({color:2895665,roughness:.85,metalness:.05,side:ue});i.add(new V(E,w));const R=new K({color:12107972,roughness:.5,metalness:.4});for(let A=0;A<f;A++)hn(i,h[A].clone().setY(h[A].y+1),h[A+1].clone().setY(h[A+1].y+1),.16,R),hn(i,S[A].clone().setY(S[A].y+1),S[A+1].clone().setY(S[A+1].y+1),.16,R);const P=new K({color:7173241,roughness:.82});for(let A=3;A<f;A+=3){const I=m[A],B=jt(I.x,I.z),Y=I.y-B;if(Y<3)continue;const q=new V(new he(.9,1.15,Y,8),P);q.position.set(I.x,B+Y/2,I.z),i.add(q),Wn.push({x:I.x,z:I.z,hw:1.3,hd:1.3,maxY:I.y-.9})}const b=new Te({map:yc("ON RAMP"),transparent:!0,side:ue}),M=new V(new Ue(12,3),b);M.position.copy(u).add(new U(0,5.5,0)),M.rotation.y=Math.atan2(-s.x,-s.z),i.add(M);for(const A of[-1,1]){const I=new V(new he(.2,.26,6,6),P);I.position.set(u.x+r.x*A*5.4,u.y+3,u.z+r.z*A*5.4),i.add(I)}}function qg(){const i=new re,t=[],e=new Zt(14170671),n=new Zt(15922680),s=new K({color:3883336,roughness:.6,metalness:.3}),r=new Te({map:Zg(),transparent:!0,side:ue}),a=new K({color:4926748,roughness:.9}),o=[new K({color:2055221,roughness:.92}),new K({color:3109954,roughness:.95}),new K({color:2583370,roughness:.9})],c=new K({color:7040883,roughness:.95,side:ue}),l=12,d=[],u=[];let f=0;for(let g=0;g<ht.length;g+=l){if(Si(g+l*.5)){f++;continue}const v=fe(g),p=fe(g+l),h=v.p.clone().add(p.p).multiplyScalar(.5),{sideways:S,normal:_,q:y}=si(v,p);for(const E of[-1,1]){const w=h.clone().addScaledVector(S,E*ht.width*.5).addScaledVector(_,.5);d.push(w),u.push(y),t.push(f%2===0?e:n)}if(f%16===8){const E=(f>>4)%2?1:-1,w=h.clone().addScaledVector(S,E*ht.width*.52).addScaledVector(_,.4),R=new re,P=new V(new Ue(4.4,2.6),r);P.position.y=3.4,P.rotation.y=Math.PI,R.add(P);const b=new he(.12,.16,3.4,5);for(const M of[-1.5,1.5]){const A=new V(b,s);A.position.set(M,1.7,0),R.add(A)}R.position.copy(w),R.quaternion.copy(y),i.add(R)}f++}for(let g=0;g<ht.length;g+=16){const v=fe(g),p=1+(Math.random()<.5?1:0);for(let h=0;h<p;h++){const S=Math.random()<.5?-1:1,_=ht.width/2+12+Math.random()*78,y=v.p.x+v.side.x*_*S+(Math.random()-.5)*16,E=v.p.z+v.side.z*_*S+(Math.random()-.5)*16;if(oa(y,E,18))continue;const w=jt(y,E);if(Math.random()<.78){const R=.7+Math.random()*1.5,P=new re,b=2.4+Math.random()*4.2,M=new V(new he(.26,.42,b,6),a);M.position.y=b/2,P.add(M);const A=2+Math.floor(Math.random()*3);for(let I=0;I<A;I++){const B=new V(new zi(2.4+Math.random()*1.6-I*.2,4.6+Math.random()*2.4,7),o[(h+I+g)%o.length]);B.position.y=b+I*1.4+1.5,B.rotation.y=Math.random()*Math.PI,P.add(B)}P.position.set(y,w+.6,E),P.scale.setScalar(R),i.add(P)}else{const R=1.4+Math.random()*3.6,P=new V(new dc(R,0),c);P.position.set(y,w+R*.35,E),P.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),P.scale.set(1,.7+Math.random()*.4,1),i.add(P),Wn.push({kind:"rock",x:y,z:E,radius:R*1.18})}}}const m=["START","SECTOR 2","SECTOR 3"];for(let g=0;g<3;g++){const v=ht.length*g/3+6;if(Si(v))continue;const p=fe(v),h=fe(v+l),S=p.p.clone().add(h.p).multiplyScalar(.5),{q:_}=si(p,h),y=ht.width*.5+1.2,E=9,w=new re,R=new he(.4,.55,E,7);for(const I of[-1,1]){const B=new V(R,s);B.position.set(I*y,E/2,0),w.add(B)}const P=y*2,b=new V(new Pt(P,1.1,1.1),s);b.position.y=E,w.add(b);const M=new Te({map:yc(m[g]),transparent:!0,side:ue}),A=new V(new Ue(P*.82,3),M);A.position.set(0,E-2,0),A.rotation.y=Math.PI,w.add(A),w.position.copy(S),w.quaternion.copy(_),i.add(w)}if(d.length){const g=new he(.18,.24,3,6);g.translate(0,1.5,0);const v=new He(.34,8,6);v.translate(0,3.2,0);const p=new K({color:10134440,roughness:.7,metalness:.2}),h=new K({roughness:.55}),S=new Qe(g,p,d.length),_=new Qe(v,h,d.length),y=new ze;for(let E=0;E<d.length;E++)y.position.copy(d[E]),y.quaternion.copy(u[E]),y.updateMatrix(),S.setMatrixAt(E,y.matrix),_.setMatrixAt(E,y.matrix),_.setColorAt(E,t[E]);S.instanceMatrix.needsUpdate=!0,_.instanceMatrix.needsUpdate=!0,_.instanceColor&&(_.instanceColor.needsUpdate=!0),i.add(S),i.add(_)}return Yg(i),Jt.add(i),i}function Zg(){const i=document.createElement("canvas");i.width=256,i.height=160;const t=i.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,i.width,i.height),t.fillStyle="#ffd23f",t.lineWidth=0;for(let n=-1;n<4;n++){t.beginPath();const s=n*70;t.moveTo(s,16),t.lineTo(s+40,i.height/2),t.lineTo(s,i.height-16),t.lineTo(s+18,i.height-16),t.lineTo(s+58,i.height/2),t.lineTo(s+18,16),t.closePath(),t.fill()}const e=new un(i);return e.colorSpace=we,e}function yc(i){const t=document.createElement("canvas");t.width=512,t.height=128;const e=t.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,t.width,t.height),e.fillStyle="#ffd23f",e.fillRect(0,0,t.width,8),e.fillRect(0,t.height-8,t.width,8),e.fillStyle="#ffffff",e.font="bold 64px sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText(i,t.width/2,t.height/2);const n=new un(t);return n.colorSpace=we,n}function $g(i,t){const e=document.createElement("canvas");e.width=128,e.height=64;const n=e.getContext("2d"),s="#"+i.toString(16).padStart(6,"0"),r="#"+t.toString(16).padStart(6,"0"),a=8;for(let c=0;c<a;c++)n.fillStyle=c%2?s:r,n.fillRect(c/a*e.width,0,e.width/a+1,e.height);const o=new un(e);return o.colorSpace=we,o}function Kg(){const i=document.createElement("canvas");i.width=256,i.height=128;const t=i.getContext("2d");t.fillStyle="#2a3138",t.fillRect(0,0,i.width,i.height);const e=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){t.fillStyle=e[Math.random()*e.length|0];const r=Math.random()*i.width,a=Math.random()*i.height;t.fillRect(r,a,2.4,2.4)}const n=new un(i);return n.colorSpace=we,n.wrapS=rn,n.repeat.set(3,1),n}function Ce(i,t,e,n,s){const r=new V(new Pt(t.x,t.y,t.z),s);return r.position.copy(e),r.quaternion.copy(n),r.castShadow=!1,r.receiveShadow=!0,i.add(r),r}function si(i,t){const e=t.p.clone().sub(i.p).normalize(),n=qh.crossVectors(tn,e).normalize();let s=e.clone().cross(n).normalize();const r=(i.bank+t.bank)*.5;if(Math.abs(r)>.001){const c=new ci().setFromAxisAngle(e,r);n.applyQuaternion(c),s.applyQuaternion(c)}const a=new _e().makeBasis(n,s,e),o=new ci().setFromRotationMatrix(a);return{tangent:e,sideways:n,normal:s,q:o}}function Hl(i,t,e,n){const r=[],a=[],o=[],c=ht.width*.47;let l=0;for(let f=t;f<=e;f+=8){const m=fe(Math.min(f,e)),g=si(m,fe(m.s+2)),v=Math.sin(f*.018)*.04,p=m.p.clone().addScaledVector(g.sideways,-c).addScaledVector(g.normal,.46+v),h=m.p.clone().addScaledVector(g.sideways,c).addScaledVector(g.normal,.46-v);r.push(p.x,p.y,p.z,h.x,h.y,h.z);const S=(f-t)/64;if(a.push(0,S,1,S),l>0){const _=(l-1)*2,y=l*2;o.push(_,_+1,y,_+1,y+1,y)}l++}const d=new ke;d.setAttribute("position",new pe(r,3)),d.setAttribute("uv",new pe(a,2)),d.setIndex(o),d.computeVertexNormals();const u=new V(d,n);u.receiveShadow=!0,i.add(u)}function Jg(i,t){let e=0;for(const n of ht.gaps)Hl(i,e,Math.max(e,n.start-4),t),e=n.end+4;Hl(i,e,ht.length,t)}function jg(i,t,e){const n=fe(t.s+2),{normal:s,q:r}=si(t,n),a=new re;a.position.copy(t.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new V(new Pt(.55,.12,5.2),e);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const c=new V(new Pt(.55,.12,5.2),e);c.position.set(1.25,0,0),c.rotation.y=.62,a.add(c);const l=new V(new Pt(.42,.1,3.8),e);l.position.set(0,.01,-1.9),a.add(l),i.add(a)}function Qg(){const i=new re;Jt.add(i),Wo=0;const t=new K({color:12171149,roughness:.72,metalness:.08}),e=new K({color:9869942,roughness:.78,metalness:.05}),n=new K({color:15255629,roughness:.28,metalness:.72}),s=new K({color:8204328,roughness:.3,metalness:.85}),r=new K({color:6120040,roughness:.5,metalness:.6}),a=new K({color:4080968,roughness:.58,metalness:.55}),o=new K({color:14270570,roughness:.35,metalness:.65}),c=new K({color:2435884,roughness:.48,metalness:.62}),l=new K({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new K({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new K({color:4935486,roughness:.92,metalness:.04}),f=new K({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),m=new K({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),g=new K({color:3159607,roughness:.7,metalness:.45}),v=new K({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),p=new K({color:15919561,roughness:.82,metalness:.02});new K({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12});const h=new K({map:Pg(),roughness:.74,metalness:.08}),S=new Te({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),_=12;Jg(i,h);function y(E,w=!1){if(Si(E))return!1;const R=fe(E),P=fe(E+3),{sideways:b,normal:M,q:A}=si(R,P),I=R.p,B=jt(I.x,I.z),Y=I.y-.95;if(Y-B<10)return!1;const q=ht.width*(w?.43:.35),Z=Y,ct=B+.25,nt=w?.56:.42,mt=w?2.4:1.75,_t=w?.52:.36,N=[],Mt=[];for(const pt of[-1,1]){const Dt=I.clone().addScaledVector(b,pt*q).addScaledVector(M,-.85);Dt.y=Z;const Et=new U(Dt.x,ct,Dt.z);hn(i,Et,Dt,nt,r);const Wt=new V(new he(mt,mt*1.12,_t,12),r);Wt.position.set(Et.x,B+_t*.5,Et.z),Wt.receiveShadow=!0,i.add(Wt),N.push(Dt),Mt.push(Et),Wn.push({x:Et.x,z:Et.z,hw:mt*.92,hd:mt*.92,maxY:Z-.7})}const gt=I.clone().addScaledVector(M,-1.05);gt.y=Z,Ce(i,new U(ht.width*.92,w?.58:.42,w?1.55:1.15),gt,A,a);const yt=Mt[0].clone();yt.y+=(Z-ct)*.28;const At=Mt[1].clone();At.y+=(Z-ct)*.28;const X=N[0].clone();X.y-=1;const rt=N[1].clone();if(rt.y-=1,hn(i,yt,rt,w?.16:.1,c),hn(i,At,X,w?.16:.1,c),w){const pt=Mt[0].clone();pt.y+=(Z-ct)*.58;const Dt=Mt[1].clone();Dt.y+=(Z-ct)*.58,hn(i,Mt[0].clone().setY(ct+1.2),Dt,.13,c),hn(i,Mt[1].clone().setY(ct+1.2),pt,.13,c),hn(i,pt,rt,.13,c),hn(i,Dt,X,.13,c)}return Wo++,!0}for(let E=0;E<ht.length;E+=_){if(Si(E+_*.5))continue;const w=fe(E),R=fe(E+_),P=w.p.clone().add(R.p).multiplyScalar(.5),{sideways:b,normal:M,q:A}=si(w,R),I=w.p.distanceTo(R.p)+.45,B=Math.floor(E/(_*2))%2?t:e;Ce(i,new U(ht.width,.62,I),P.clone().addScaledVector(M,-.05),A,B),Ce(i,new U(ht.width-2.8,.08,I*.86),P.clone().addScaledVector(M,.36),A,u),Ce(i,new U(.2,.1,I*.76),P.clone().addScaledVector(b,-ht.width*.19).addScaledVector(M,.43),A,u),Ce(i,new U(.2,.1,I*.76),P.clone().addScaledVector(b,ht.width*.19).addScaledVector(M,.43),A,u),E%48===0&&(Ce(i,new U(.14,.08,I*.62),P.clone().addScaledVector(b,-ht.width*.08).addScaledVector(M,.51),A,v),Ce(i,new U(.14,.08,I*.62),P.clone().addScaledVector(b,ht.width*.08).addScaledVector(M,.51),A,v)),E%120===0&&Ce(i,new U(ht.width*.42,.07,.72),P.clone().addScaledVector(M,.55),A,p),Ce(i,new U(ht.width+1.2,.35,I*.94),P.clone().addScaledVector(M,-.56),A,a),Ce(i,new U(.42,.42,I*.9),P.clone().addScaledVector(b,-ht.width*.36).addScaledVector(M,-.78),A,g),Ce(i,new U(.42,.42,I*.9),P.clone().addScaledVector(b,ht.width*.36).addScaledVector(M,-.78),A,g);const Y=P.clone().addScaledVector(b,-ht.width*.51),q=P.clone().addScaledVector(b,ht.width*.51);if(Ce(i,new U(.32,.46,I),Y.clone().addScaledVector(M,.28),A,n),Ce(i,new U(.32,.46,I),q.clone().addScaledVector(M,.28),A,n),Ce(i,new U(.26,.72,I*.94),Y.clone().addScaledVector(M,-.22),A,a),Ce(i,new U(.26,.72,I*.94),q.clone().addScaledVector(M,-.22),A,a),E%36===0)for(const Z of[-ht.width*.39,-ht.width*.2,ht.width*.2,ht.width*.39]){const ct=new V(new he(.16,.2,.12,10),o);ct.position.copy(P).addScaledVector(b,Z).addScaledVector(M,.46),ct.quaternion.copy(A),ct.castShadow=!1,i.add(ct)}if(E%72===0&&(Ce(i,new U(.34,1.56,3.4),P.clone().addScaledVector(b,-ht.width*.66).addScaledVector(M,1.16),A,s),Ce(i,new U(.34,1.56,3.4),P.clone().addScaledVector(b,ht.width*.66).addScaledVector(M,1.16),A,s),Ce(i,new U(.18,.18,4.4),P.clone().addScaledVector(b,-ht.width*.62).addScaledVector(M,1.94),A,s),Ce(i,new U(.18,.18,4.4),P.clone().addScaledVector(b,ht.width*.62).addScaledVector(M,1.94),A,s),Ce(i,new U(.12,.12,4),P.clone().addScaledVector(b,-ht.width*.62).addScaledVector(M,1.38),A,n),Ce(i,new U(.12,.12,4),P.clone().addScaledVector(b,ht.width*.62).addScaledVector(M,1.38),A,n),hn(i,P.clone().addScaledVector(b,-ht.width*.58).addScaledVector(M,-1.08),P.clone().addScaledVector(b,ht.width*.58).addScaledVector(M,-1.08),.11,c),hn(i,P.clone().addScaledVector(b,-ht.width*.48).addScaledVector(M,-1),P.clone().addScaledVector(b,0).addScaledVector(M,-2.2),.09,c),hn(i,P.clone().addScaledVector(b,ht.width*.48).addScaledVector(M,-1),P.clone().addScaledVector(b,0).addScaledVector(M,-2.2),.09,c)),E%96===0){const Z=new V(new dn(1,28),S);Z.rotation.x=-Math.PI/2,Z.position.set(P.x,-4.72,P.z),Z.scale.set(ht.width*.9,Math.max(10,I*2.2),1),Z.rotation.z=Math.atan2(si(w,R).tangent.x,si(w,R).tangent.z),i.add(Z)}if(E%144===0){const Z=P.clone().addScaledVector(b,-ht.width*.74).addScaledVector(M,2),ct=P.clone().addScaledVector(b,ht.width*.74).addScaledVector(M,2);hn(i,Z.clone().addScaledVector(M,-1.2),Z.clone().addScaledVector(M,1.1),.12,s),hn(i,ct.clone().addScaledVector(M,-1.2),ct.clone().addScaledVector(M,1.1),.12,s),Ce(i,new U(.46,.72,.46),Z.clone().addScaledVector(M,1.15),A,l),Ce(i,new U(.46,.72,.46),ct.clone().addScaledVector(M,1.15),A,l)}if(E%288===0){const Z=P.clone().addScaledVector(b,(Math.floor(E/144)%2?1:-1)*ht.width*.92).addScaledVector(M,5.2);Ce(i,new U(.44,.44,.44),Z.clone(),A,f),hn(i,Z.clone().addScaledVector(M,-.2),P.clone().addScaledVector(M,1),.05,c)}E%48===0&&y(E+_*.5,!1),E%168===0&&!Si(E+16)&&jg(i,fe(E+5),d)}for(const E of ht.gaps){const w=fe(E.start-3),R=fe(E.end+3);for(const P of[w,R]){const b=fe(P.s+2),{normal:M,q:A}=si(P,b);Ce(i,new U(ht.width-1.2,.08,4.6),P.p.clone().addScaledVector(M,.54),A,l),Ce(i,new U(ht.width*.62,.09,1.3),P.p.clone().addScaledVector(M,.62).addScaledVector(P.tangent,P===w?-6.3:6.3),A,p);for(const I of[-ht.width*.42,0,ht.width*.42]){const B=P.p.clone().addScaledVector(P.side,I).addScaledVector(M,2.35);Ce(i,new U(.46,.46,.46),B,A,I===0?m:l)}y(P.s+(P===w?-9:9),!0),y(P.s+(P===w?-24:24),!0)}}return i}function td(i=13710372,t=7740696){const e=new re,n=new K({color:i,roughness:.32,metalness:.28}),s=new K({color:t,roughness:.42,metalness:.22}),r=new K({color:328965,roughness:.65}),a=new K({color:13621729,roughness:.18,metalness:.75}),o=new K({color:8840447,roughness:.08,metalness:.05,transparent:!0,opacity:.55}),c=new K({color:16722974,roughness:.18,metalness:.05,emissive:16719122,emissiveIntensity:1.1}),l=new K({color:16773285,roughness:.22,metalness:.05,emissive:16765019,emissiveIntensity:.7}),d=new K({color:16773820,roughness:.28,metalness:.2}),u=new K({color:2697513,roughness:.34,metalness:.72}),f=new V(new dn(3.2,28),new Te({color:0,transparent:!0,opacity:.22,depthWrite:!1}));f.rotation.x=-Math.PI/2,f.position.y=.08,f.scale.z=1.8,e.add(f);const m=new V(new Pt(4.4,1,7.4),n);m.position.y=1,e.add(m);const g=new V(new Pt(.72,.06,7.62),d);g.position.set(0,1.54,.05),e.add(g);for(const w of[-2.32,2.32]){const R=new V(new Pt(.52,.54,3.2),s);R.position.set(w,.92,.85),e.add(R)}const v=new V(new Pt(4.9,.28,7.8),r);v.position.set(0,.54,.15),e.add(v);const p=new V(new Pt(2.7,.8,3.1),n);p.position.set(0,.82,-4.2),e.add(p);const h=new V(new Pt(4.8,.14,.8),r);h.position.set(0,.42,-5.55),e.add(h);const S=new V(new Pt(2.1,.78,1.9),o);S.position.set(0,1.72,-.72),S.rotation.x=-.08,e.add(S);const _=new V(new Pt(2.14,.08,.08),a);_.position.set(0,2.04,-1.48),_.rotation.x=-.08,e.add(_);const y=new V(new Pt(5.8,.22,1.1),s);y.position.set(0,1.84,3.9),e.add(y);for(const w of[-2.25,2.25]){const R=new V(new Pt(.28,1.1,1.3),s);R.position.set(w,1.3,3.75),R.rotation.z=w<0?-.12:.12,e.add(R)}const E=[];for(const w of[-2.4,2.4])for(const R of[-2.3,2.6]){const P=new re;P.position.set(w,.52,R);const b=new V(new he(.78,.78,.55,18),r);b.rotation.z=Math.PI/2,P.add(b);const M=new V(new he(.34,.34,.6,12),a);M.rotation.z=Math.PI/2,P.add(M);const A=new V(new he(.48,.48,.08,16),u);A.rotation.z=Math.PI/2,A.position.set(w>0?-.04:.04,0,0),P.add(A);const I=new V(new cr(.78,.055,8,20),r);I.rotation.y=Math.PI/2,P.add(I),e.add(P),R<0&&E.push(P)}e.userData.frontWheels=E;for(let w=0;w<4;w++){const R=new V(new he(.12,.12,2.4,10),a);R.rotation.x=Math.PI/2,R.position.set(-.9+w*.6,1.62,-2.7),e.add(R)}for(const w of[-1.35,1.35]){const R=new V(new Pt(.62,.26,.16),c);R.position.set(w,1.05,3.82),e.add(R);const P=new V(new Pt(.5,.22,.12),l);P.position.set(w,.86,-5.72),e.add(P)}return e.traverse(w=>{w.castShadow=!0,w.receiveShadow=!0}),Jt.add(e),e}function t_(){const i=new re,t=new K({color:9383205,roughness:.35,metalness:.55}),e=new K({color:460551,roughness:.55}),n=new K({color:12375772,roughness:.18,metalness:.9}),s=new K({color:16767297,roughness:.38,metalness:.25}),r=new K({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new K({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.16}),o=new K({color:1118995,roughness:.7,metalness:.05}),c=new V(new Pt(2.2,.24,2.2),t);c.position.set(0,-.78,-2.2),i.add(c);const l=new V(new Pt(.16,.028,1.92),n);l.position.set(0,-.64,-2.28),i.add(l);const d=new V(new Pt(2.55,.18,.52),e);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,i.add(d);const u=new V(new Ue(2.8,.82,1,1),a);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,i.add(u);const f=new V(new cr(.36,.035,12,48),o);f.position.set(0,-.46,-1.02),f.rotation.x=Math.PI/2.75,i.add(f);for(let m=0;m<3;m++){const g=new V(new Pt(.34,.025,.035),n);g.position.copy(f.position),g.rotation.copy(f.rotation),g.rotation.z+=m/3*Math.PI*2,i.add(g)}for(let m=0;m<6;m++){const g=new V(new he(.16,.16,.56,18),n);g.rotation.z=Math.PI/2,g.position.set(-.78+m*.31,-.42+Math.sin(m)*.03,-2.12),i.add(g)}for(const m of[-1.08,1.08]){const g=new V(new he(.34,.34,.25,18),e);g.rotation.z=Math.PI/2,g.position.set(m,-.68,-1.58),i.add(g);const v=new V(new cr(.22,.035,8,28),s);v.scale.set(.72,1.25,.72),v.position.set(m*.8,-.48,-1.74),v.rotation.x=Math.PI/2,i.add(v)}for(const m of[-1.14,-.84,.84,1.14]){const g=new V(new he(.035,.04,.028,8),n);g.position.set(m,-.39,-1.28),g.rotation.x=Math.PI/2,i.add(g)}for(const m of[-.52,.52]){const g=new V(new He(.045,12,8),r);g.position.set(m,-.34,-1.22),i.add(g)}i.position.set(0,0,0),te.add(i),li=i}function e_(){const i=new K({color:16119285,roughness:.35,metalness:.25}),t=new K({color:1184274,roughness:.45}),e=new K({map:Rg(),roughness:.42,metalness:.05}),n=new K({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=fe(0),r=new _e().makeBasis(s.side,tn,s.tangent),a=new ci().setFromRotationMatrix(r),o=new re;for(const d of[-ht.width*.58,ht.width*.58]){const u=new V(new Pt(.8,11,.8),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(tn,5.4),u.quaternion.copy(a),o.add(u)}const c=new V(new Pt(ht.width+3,.8,1),e);c.position.copy(s.p).addScaledVector(tn,11.2),c.quaternion.copy(a),o.add(c);const l=new V(new Pt(ht.width+1.2,1.4,.18),t);l.position.copy(s.p).addScaledVector(tn,12.5).addScaledVector(s.tangent,-.55),l.quaternion.copy(a),o.add(l);for(const d of[-ht.width*.38,0,ht.width*.38]){const u=new V(new He(.32,16,10),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(tn,10.25),o.add(u)}return Jt.add(o),o}const Ks=td(),Bn=td(3108784,1916782);Bn.visible=!1;zg();Bg();kg();Vg();Xg();let Wl=null,Xl=null,Yl=null,li=null;t_();function qa(i){i&&(i.traverse(t=>{if(t.geometry&&t.geometry.dispose(),t.material){const e=Array.isArray(t.material)?t.material:[t.material];for(const n of e)n.map&&n.map.dispose(),n.dispose()}}),Jt.remove(i))}function bc(i){return qr=zt.clamp(i,0,Hi.length-1),ht=Hi[qr],Wn.length=0,ca.length=0,qa(Wl),qa(Xl),qa(Yl),Wl=Qg(),Xl=e_(),Yl=qg(),Ht.trackName.textContent=ht.name,Ht.courseName&&(Ht.courseName.textContent=ht.name),Ht.courseButtons.forEach(t=>{t.classList.toggle("active",Number(t.dataset.course)===qr)}),ht.name}bc(0);const Cs=new vg(fn);Cs.addPass(new Mg(Jt,te));const ed=new bs(new wt(window.innerWidth,window.innerHeight),.34,.78,1);Cs.addPass(ed);Cs.addPass(new yg);const n_={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},Hs=new Xh(n_);Cs.addPass(Hs);const i_=new K({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),$r=Array.from({length:72},()=>{const i=new V(new He(.1,8,5),i_);return i.visible=!1,Jt.add(i),{mesh:i,life:0,velocity:new U}});let oi=null;function nd(){if(oi)return;const i=new AudioContext,t=i.createOscillator(),e=i.createGain(),n=i.createBiquadFilter();t.type="sawtooth",n.type="lowpass",n.frequency.value=540,t.frequency.value=70,e.gain.value=1e-4,t.connect(n).connect(e).connect(i.destination),t.start(),oi={ctx:i,engine:t,engineGain:e,filter:n,nextNote:0,beat:0}}function ea(){oi||nd(),oi?.ctx.state==="suspended"&&oi.ctx.resume().catch(()=>{})}function ql(i){if(!oi)return;const{ctx:t}=oi,e=t.createOscillator(),n=t.createGain();e.type="sine",e.frequency.value=55+i*2.6,n.gain.setValueAtTime(Math.min(.34,i/55),t.currentTime),n.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+.23),e.connect(n).connect(t.destination),e.start(),e.stop(t.currentTime+.24)}function Zl(i,t=18){const e=Math.min(t,$r.length);for(let n=0;n<e;n++){const s=$r.find(r=>r.life<=0)||$r[n];s.mesh.visible=!0,s.mesh.position.copy(i),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function s_(i){for(const t of $r){if(t.life<=0)continue;t.life-=i,t.velocity.y-=26*i,t.mesh.position.addScaledVector(t.velocity,i);const e=Math.max(.01,t.life*2.4);t.mesh.scale.setScalar(e),t.life<=0&&(t.mesh.visible=!1)}}function r_(i){if(!oi)return;const{ctx:t,engine:e,engineGain:n,filter:s}=oi;e.frequency.setTargetAtTime(62+x.speed*2.9+(ce.has("ShiftLeft")||ce.has("ShiftRight")?60:0),t.currentTime,.04),s.frequency.setTargetAtTime(480+x.speed*9,t.currentTime,.08);const r=x.mode==="race"||x.mode==="roam";n.gain.setTargetAtTime(r?.036+Math.abs(x.speed)/4200:1e-4,t.currentTime,.08)}function la(i=!1,t=!1){nd(),ce.clear(),na();const e=i||t;Object.assign(x,{mode:"race",practice:e,freeRun:t,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:e?-900:-28,rivalDistance:e?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:t?"Free run — course check":i?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:e?"SOLO":"P2",camLookYaw:0,camLookPitch:0,cameraZoom:0});const n=fe(x.s);x.y=n.p.y+2.1,x.yVel=0,Ht.menu.classList.add("hidden"),Ht.result.classList.add("hidden"),Ht.resultStats.innerHTML="",Ht.position.textContent=t?"FREE RUN":i?"PRACTICE":"DIV 4",Ht.trackName.textContent=ht.name,Bn.visible=!1,li&&(li.visible=!0),window.__freeCam=!1}function id(){ea(),x.mode="roam",x.practice=!0,x.freeRun=!1,ce.clear(),na();let i=118,t=402;Vn(i,t,6).clearance<6&&(i=92,t=392),x.roamPos.set(i,jt(i,t),t),x.roamYaw=-.05,x.camYaw=x.roamYaw,x.camLookYaw=0,x.camLookPitch=0,x.cameraZoom=0,Ct.zoom=0,x.wheelSteer=0,x.speed=0,x.boost=1,x.damage=0,x.cameraShake=0,x.message="",x.messageTimer=0,Ks.visible=!1,Bn.visible=!0,li&&(li.visible=!1),window.__freeCam=!1,Ht.menu.classList.add("hidden"),Ht.result.classList.add("hidden"),Ht.position.textContent="FREE ROAM",Ht.trackName.textContent="City Streets",ha();const e=Math.sin(x.roamYaw),n=-Math.cos(x.roamYaw);te.position.set(x.roamPos.x-e*18,x.roamPos.y+8.5,x.roamPos.z-n*18),ad(),te.lookAt(x.roamPos.x+e*12,x.roamPos.y+2.6,x.roamPos.z+n*12),te.fov=70,te.updateProjectionMatrix()}function ha(){Bn.position.set(x.roamPos.x,x.roamPos.y+.3,x.roamPos.z),Bn.quaternion.setFromAxisAngle(tn,-x.roamYaw)}function a_(i,t){let e=null;for(const s of ca)for(const r of s.segments){const a=i-r.a.x,o=t-r.a.z,c=zt.clamp((a*r.abx+o*r.abz)/r.lenSq,0,1),l=r.a.x+r.abx*c,d=r.a.z+r.abz*c,u=Math.hypot(i-l,t-d);if(u>s.halfW+xs*1.15)continue;const f=zt.lerp(r.a.y,r.b.y,c),m=zt.lerp(r.u0,r.u1,c),g=u+Math.max(0,jt(i,t)-f)*.2;(!e||g<e.score)&&(e={kind:"ramp",y:f,u:m,ramp:s,mergeS:s.mergeS,dirSel:s.dirSel,tangentX:r.abx,tangentZ:r.abz,lateral:s.dirSel*ht.width*.34,score:g})}if(!e)return null;const n=Math.max(1e-4,Math.hypot(e.tangentX,e.tangentZ));return e.tangentX/=n,e.tangentZ/=n,e}function o_(i,t,e=jt(i,t)){let n=null;const s=10;for(let a=0;a<ht.length;a+=s){if(Si(a+s*.5))continue;const o=fe(a),c=fe(a+s),l=c.p.x-o.p.x,d=c.p.z-o.p.z,u=Math.max(1e-4,l*l+d*d),f=zt.clamp(((i-o.p.x)*l+(t-o.p.z)*d)/u,0,1),m=o.p.x+l*f,g=o.p.z+d*f,v=i-m,p=t-g,h=Math.hypot(v,p);if(h>ht.width*.5+xs*.45)continue;const S=zt.lerp(o.p.y,c.p.y,f)+.58;if(e<S-5)continue;const _=new U(d,0,-l).normalize(),y=zt.clamp(v*_.x+p*_.z,-ht.width*.44,ht.width*.44);(!n||h<n.dist)&&(n={kind:"track",y:S,s:a+s*f,lateral:y,tangentX:l,tangentZ:d,dist:h})}if(!n)return null;const r=Math.max(1e-4,Math.hypot(n.tangentX,n.tangentZ));return n.tangentX/=r,n.tangentZ/=r,n}function Oi(i,t,e=x.roamPos.y){const n=jt(i,t);let s={kind:"ground",y:n};const r=a_(i,t);r&&r.y>=n-1.2&&(s=r);const a=o_(i,t,Math.max(e,s.y));return a&&a.y>=s.y-.8&&(s=a),s}function $l(i){const t=Math.sin(x.roamYaw)*i.tangentX+-Math.cos(x.roamYaw)*i.tangentZ;if(x.speed<10||t<.22)return!1;const e=(i.mergeS??i.s??22)+8,n=fe(e);return x.mode="race",x.practice=!0,x.freeRun=!0,x.breakdownTimer=0,x.s=n.s,x.totalDistance=n.s,x.lastSafeS=n.s,x.lastSafeDistance=n.s,x.lateral=zt.clamp(i.lateral??0,-ht.width*.32,ht.width*.32),x.lateralVel=-Math.sign(x.lateral)*Math.min(4,Math.abs(x.speed)*.04),x.speed=zt.clamp(Math.max(28,x.speed),18,112),x.grounded=!0,x.y=n.p.y+2.1,x.yVel=0,x.airtime=0,x.rivalS=-900,x.rivalDistance=-900,x.leadState="SOLO",x.message="Merged onto the ribbon",x.messageTimer=1.6,x.cameraShake=Math.max(x.cameraShake,.35),Ks.visible=!1,Bn.visible=!1,li&&(li.visible=!0),Ht.position.textContent="FREE RUN",Ht.trackName.textContent=ht.name,ha(),!0}function sd(i){const t=Math.max(ce.has("KeyW")||ce.has("ArrowUp")?1:0,Ct.throttle),e=Math.max(ce.has("KeyS")||ce.has("ArrowDown")?1:0,Ct.brake),n=zt.clamp((ce.has("KeyD")||ce.has("ArrowRight")?1:0)-(ce.has("KeyA")||ce.has("ArrowLeft")?1:0)+Ct.steer,-1,1),s=(ce.has("ShiftLeft")||ce.has("ShiftRight"))&&x.boost>.02&&t>.03;if(t>.03){const v=x.speed<0?38:0;x.speed+=((s?52:30)+v)*t*i}e>.03&&(x.speed-=(x.speed>1.2?64:30)*e*i),x.speed-=.0026*x.speed*Math.abs(x.speed)*i,Math.abs(x.speed)>.08?x.speed-=Math.sign(x.speed)*4.2*i:t<=.03&&e<=.03&&(x.speed=0),x.speed=zt.clamp(x.speed,-22,120),x.boosting=s,s?x.boost=Math.max(0,x.boost-i*.22):x.boost=Math.min(1,x.boost+i*.05),x.wheelSteer+=(n-x.wheelSteer)*(1-Math.pow(1e-5,i));const r=-x.wheelSteer*.55,a=Bn.userData.frontWheels;a&&(a[0].rotation.y=r,a[1].rotation.y=r);const o=Math.abs(x.speed);if(o>Ho){const v=zt.clamp((o-Ho)/5,0,1),p=1-.45*zt.clamp((o-28)/70,0,1),h=Tg*v*p;x.roamYaw+=x.wheelSteer*h*i*Math.sign(x.speed)}const c=Math.sin(x.roamYaw),l=-Math.cos(x.roamYaw),d=Math.abs(x.speed)*i,u=Math.max(1,Math.ceil(d/1.2));let f=!1,m=!1,g=Oi(x.roamPos.x,x.roamPos.z,x.roamPos.y);for(let v=0;v<u;v++)x.roamPos.x+=c*x.speed*i/u,x.roamPos.z+=l*x.speed*i/u,g=Oi(x.roamPos.x,x.roamPos.z,x.roamPos.y),x.roamPos.y=g.y+ki,h_(x.roamPos,g)&&(m=!0),d_(x.roamPos,g)&&(f=!0),g=Oi(x.roamPos.x,x.roamPos.z,x.roamPos.y),x.roamPos.y=g.y+ki;x.roamPos.x=zt.clamp(x.roamPos.x,-820,820),x.roamPos.z=zt.clamp(x.roamPos.z,-1620,480),f&&(x.speed*=.35),m&&(x.speed*=.62,x.cameraShake=Math.max(x.cameraShake,.22),x.message="SPLAT!",x.messageTimer=.9),g=Oi(x.roamPos.x,x.roamPos.z,x.roamPos.y),x.roamPos.y=g.y+ki,!(g.kind==="ramp"&&g.u>.72&&$l(g))&&(g.kind==="track"&&$l(g)||(ha(),ce.has("KeyR")&&(id(),ce.delete("KeyR"))))}const xs=2.6;function zr(i,t){let e=!1;for(let n=0;n<t.length;n++){const s=t[n];if(s.maxY!=null&&i.y>s.maxY+ki+.45)continue;if(s.radius){const u=s.radius+xs,f=i.x-s.x,m=i.z-s.z,g=f*f+m*m;if(g>=u*u)continue;e=!0;const v=Math.max(1e-4,Math.sqrt(g));i.x=s.x+f/v*u,i.z=s.z+m/v*u;continue}const r=s.hw+xs,a=s.hd+xs,o=i.x-s.x,c=i.z-s.z;if(Math.abs(o)>=r||Math.abs(c)>=a)continue;e=!0;const l=r-Math.abs(o),d=a-Math.abs(c);l<d?i.x=s.x+(o<0?-r:r):i.z=s.z+(c<0?-a:a)}return e}function c_(i,t,e=0){return t.maxY!=null&&i.y>t.maxY+ki+.45?!1:t.radius?Math.hypot(i.x-t.x,i.z-t.z)<t.radius+e:Math.abs(i.x-t.x)<t.hw+e&&Math.abs(i.z-t.z)<t.hd+e}function l_(i){i.active=!1,i.respawn=4.5+Math.random()*1.5,i.mesh.visible=!1,Re.splats++;const t=ms.find(e=>!e.visible)||ms[Re.splats%Math.max(1,ms.length)];t&&(t.visible=!0,t.userData.life=t.userData.maxLife,t.position.set(i.x,jt(i.x,i.z)+.08,i.z),t.rotation.y=0,t.rotation.z=Math.random()*Math.PI*2,t.scale.setScalar(.9+Math.random()*.45),t.traverse(e=>{e.material&&(e.material.opacity=.72)}))}function h_(i,t=null){if(t?.kind!=="ground"||Math.abs(x.speed)<5)return!1;let e=!1;for(const n of lr){if(!n.active)continue;const s=i.x-n.x,r=i.z-n.z,a=xs+n.hitRadius;s*s+r*r>a*a||Math.abs(i.y-(jt(n.x,n.z)+ki))>3.2||(l_(n),e=!0)}return e}function d_(i,t=null){let e=!1;for(let n=0;n<2;n++){const s=zr(i,Hn),r=t?.kind==="ground"?zr(i,Wn):!1,a=zr(i,$s),o=t?.kind==="ground"?zr(i,Fi):!1;if(!s&&!r&&!a&&!o)break;e=!0}return e}function rd(i){const t=Ct.lookX*1.18,e=Ct.lookY*.58;x.camLookYaw+=(t-x.camLookYaw)*(1-Math.pow(.002,i)),x.camLookPitch+=(e-x.camLookPitch)*(1-Math.pow(.002,i)),x.cameraZoom+=(Ct.zoom-x.cameraZoom)*(1-Math.pow(.018,i))}function wc(i,t,e=3.2){let n=0;for(let s=1;s<=10;s++){const r=s/10,a=zt.lerp(i.x,t.x,r),o=zt.lerp(i.z,t.z,r),c=zt.lerp(i.y,t.y,r),l=jt(a,o)+e;l>c&&(n=Math.max(n,(l-c)/Math.max(.08,r)))}return n}function ad(){const i=x.camYaw+x.camLookYaw,t=Math.sin(i),e=-Math.cos(i),n=zt.clamp(x.cameraZoom,-.42,.9),s=x.roamPos,r={x:s.x+t*(12-Math.min(n,0)*6),y:s.y+2.6+x.camLookPitch*13.5,z:s.z+e*(12-Math.min(n,0)*6)};te.position.y+=wc(r,te.position,3.4)}function od(i){if(window.__freeCam)return;if(rd(i),Math.abs(x.speed)>Ho){let u=x.roamYaw-x.camYaw;u=Math.atan2(Math.sin(u),Math.cos(u)),x.camYaw+=u*(1-Math.pow(.08,i))}const t=x.camYaw+x.camLookYaw,e=Math.sin(t),n=-Math.cos(t),s=x.roamPos,r=zt.clamp(x.cameraZoom,-.42,.9),a=(18+Math.abs(x.speed)*.08)*(1+r*.72),o=8.5+Math.max(0,r)*4.4-Math.min(0,r)*2+x.camLookPitch*5.8,c=Zh.set(s.x-e*a,s.y+o,s.z-n*a),l=Mc.set(s.x+e*(12-Math.min(r,0)*6),s.y+2.6+x.camLookPitch*13.5,s.z+n*(12-Math.min(r,0)*6));c.y=Math.max(c.y,jt(c.x,c.z)+3.5),c.y+=wc(l,c,3.4),te.position.lerp(c,1-Math.pow(.0023,i)),Ln.position.copy(te.position),Ln.lookAt(l),Ln.rotateY(Math.PI),te.quaternion.slerp(Ln.quaternion,1-Math.pow(.05,i));const d=70+Math.min(8,Math.abs(x.speed)*.05)+r*10;Math.abs(te.fov-d)>.02&&(te.fov+=(d-te.fov)*(1-Math.pow(.01,i)),te.updateProjectionMatrix())}function cd(i){if(x.mode==="result")return;x.mode="result";const t=Math.max(0,Math.round(x.score-x.damage*9+Math.max(0,220-x.time)*45));t>x.best&&(x.best=t,localStorage.setItem("steel-ribbon-best",String(t))),Ht.best.textContent=`Best score ${x.best}`,Ht.resultText.textContent=`${i} Score ${t}. Time ${Yo(x.time)}. Damage ${Math.round(x.damage)}%.`;const e=Number.isFinite(x.bestLap)?Yo(x.bestLap):"--:--.-";Ht.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${e}</b>
    <b>Clean landings: ${x.cleanLandings}</b>
    <b>Hard landings: ${x.hardLandings}</b>
    <b>Recoveries: ${x.recoveries}</b>
    <b>Near edges: ${Math.round(x.nearMisses)}</b>
  `,Ht.result.classList.remove("hidden")}function Kl(i="Craned back to the ribbon"){const t=fe(x.lastSafeS);x.s=x.lastSafeS,x.totalDistance=x.lastSafeDistance,x.lateral=0,x.lateralVel=0,x.y=t.p.y+2.1,x.yVel=0,x.speed=Math.max(16,x.speed*.32),x.grounded=!0,x.cameraShake=1.2,x.message=i,x.messageTimer=1.4,x.recoveries+=1}function Tc(i,t){return zt.clamp(t*i.tangent.y,-48,48)}function u_(i=94){return ht.gaps.map(t=>{const e=fe(t.start),n=fe(t.end+3),s=(t.end-t.start)/Math.max(1,i),r=Tc(e,i),a=e.p.y+2.1+r*s-.5*31*s*s,o=n.p.y+2.1;return{name:t.name,start:t.start,end:t.end,length:t.end-t.start,lipGradeDeg:Math.round(zt.radToDeg(e.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function Jl(i,t){x.grounded=!1,x.yVel=Tc(i,x.speed),x.airtime=0,t&&(x.message=t)}window.__steelRibbonDebug={launchVelocityAt(i,t){return Tc(fe(i),t)},gapJumpReport(i){return u_(i)},sceneryClearanceReport(){return Og()},setSpeed(i){return x.speed=zt.clamp(i,-14,156-x.damage*.42),Js(),x.speed},setTrackPosition(i,t=x.speed){const e=fe(i);return x.totalDistance=i,x.s=e.s,x.lastSafeS=e.s,x.lastSafeDistance=i,x.lateral=0,x.lateralVel=0,x.y=e.p.y+2.1,x.yVel=0,x.grounded=!0,x.speed=zt.clamp(t,-14,156-x.damage*.42),Js(),{s:x.s,totalDistance:x.totalDistance,speed:x.speed,y:x.y}},setDamage(i){return x.damage=zt.clamp(i,0,99),Js(),x.damage},setCourse(i){return bc(i)},flyCam(i,t,e,n,s,r){return window.__freeCam=!0,te.position.set(i,t,e),te.lookAt(n,s,r),te.fov=62,te.updateProjectionMatrix(),"freecam"},listCourses(){return Hi.map((i,t)=>({index:t,name:i.name,length:i.length,width:i.width,laps:i.laps,gaps:i.gaps.length}))},courseInfo(){return{index:qr,name:ht.name,length:ht.length,width:ht.width,laps:ht.laps}},probeDown(i,t){const n=new Af(new U(i,400,t),new U(0,-1,0),0,1e3).intersectObjects(Jt.children,!0).map(r=>({y:+r.point.y.toFixed(2),name:r.object.material?.color?"#"+r.object.material.color.getHexString():"?"})),s=Oi(i,t,400);return{x:i,z:t,ground:+jt(i,t).toFixed(2),surface:s.kind,surfaceY:+s.y.toFixed(2),hits:n.slice(0,5)}},rampSurfaceReport(){return ca.map((i,t)=>{const e=i.points[0],n=i.points[i.points.length-1],s=i.points[i.points.length/2|0],r=i.segments[0],a=i.segments[i.segments.length-1],o=Math.atan2(r.abx,-r.abz);return{index:t,mergeS:i.mergeS,halfW:i.halfW,start:{x:+e.x.toFixed(2),y:+e.y.toFixed(2),z:+e.z.toFixed(2)},mid:{x:+s.x.toFixed(2),y:+s.y.toFixed(2),z:+s.z.toFixed(2)},end:{x:+n.x.toFixed(2),y:+n.y.toFixed(2),z:+n.z.toFixed(2)},climb:+(n.y-e.y).toFixed(2),yaw:+o.toFixed(4),endYaw:+Math.atan2(a.abx,-a.abz).toFixed(4)}})},colliderSample(i=8){return Hn.slice(0,i).map(t=>({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1)}))},pylonColliderSample(i=8){return Wn.filter(t=>t.hw).slice(0,i).map(t=>({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1)}))},trackSupportReport(){const i=Wn.filter(t=>t.hw);return{supports:Wo,pylonColliders:i.length,gaps:ht.gaps.length,sample:i.slice(0,8).map(t=>({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1)}))}},buildingTrackConflictReport(i=12){const t=[];for(const e of Hn){const n=Gs(e.x,e.z,e.hw*2,e.hd*2,e.maxY);n&&t.push({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1),maxY:+e.maxY.toFixed(1),courseIndex:n.courseIndex,s:+n.s.toFixed(1),trackY:+n.trackY.toFixed(1),horizontalClearance:+n.horizontalClearance.toFixed(1),verticalIntrusion:+n.verticalIntrusion.toFixed(1)})}return t.sort((e,n)=>n.verticalIntrusion-e.verticalIntrusion),{totalBuildings:Hn.length,conflicts:t.length,sample:t.slice(0,i)}},rockColliderSample(i=8){return $s.concat(Wn.filter(t=>t.kind==="rock")).slice(0,i).map(t=>({kind:t.kind||"prop",x:+t.x.toFixed(1),z:+t.z.toFixed(1),radius:t.radius?+t.radius.toFixed(1):null}))},cityLifeReport(i=8){return{traffic:Re.traffic,pedestrians:Re.pedestrians,pedestriansActive:lr.filter(t=>t.active).length,turns:Re.turns,splats:Re.splats,streetLights:Re.streetLights,trafficLights:Re.trafficLights,stopSigns:Re.stopSigns,types:{...Re.types},offRoadTraffic:Fi.filter(t=>!oa(t.x,t.z,2)).length,trafficRoutes:Xo.slice(0,i).map(t=>({axis:t.axis,dir:t.dir,road:+t.road.toFixed(1),along:+t.along.toFixed(1),next:+t.next.toFixed(1)})),trafficColliders:Fi.slice(0,i).map(t=>({x:+t.x.toFixed(1),z:+t.z.toFixed(1),hw:+t.hw.toFixed(1),hd:+t.hd.toFixed(1),maxY:+t.maxY.toFixed(1)})),pedestrianTargets:lr.filter(t=>t.active).slice(0,i).map(t=>({x:+t.x.toFixed(1),z:+t.z.toFixed(1),axis:t.axis,dir:t.dir}))}},advanceCityLife(i=1){const t=.03333333333333333;let e=Math.max(0,Math.min(i,60));for(;e>0;){const n=Math.min(t,e);jh(n),e-=n}return this.cityLifeReport(12)},setRoamPose(i,t,e){const n=Oi(i,t,x.roamPos.y);x.roamPos.set(i,n.y+ki,t),x.roamYaw=e,x.camYaw=e,x.camLookYaw=0,x.camLookPitch=0,x.wheelSteer=0,x.speed=0,ha();const s=Math.sin(x.roamYaw),r=-Math.cos(x.roamYaw);return te.position.set(x.roamPos.x-s*18,x.roamPos.y+8.5,x.roamPos.z-r*18),ad(),te.lookAt(x.roamPos.x+s*12,x.roamPos.y+2.6,x.roamPos.z+r*12),te.fov=70,te.updateProjectionMatrix(),this.roamReport()},setTouchCamera(i=0,t=0,e=Ct.zoom,n=30){Ct.lookX=zt.clamp(i,-1,1),Ct.lookY=zt.clamp(t,-1,1),Ct.zoom=zt.clamp(e,-.42,.9);for(let s=0;s<n;s++)x.mode==="roam"?od(1/60):Ec(1/60);return this.roamReport()},simulateRoamDrive(i=1,t=0,e=0,n=0){if(x.mode!=="roam")return this.roamReport();const s={steer:Ct.steer,throttle:Ct.throttle,brake:Ct.brake};Ct.steer=zt.clamp(t,-1,1),Ct.throttle=zt.clamp(e,0,1),Ct.brake=zt.clamp(n,0,1);const r=1/60;let a=Math.max(0,Math.min(i,8));for(;a>0;){const o=Math.min(r,a);if(sd(o),x.mode!=="roam")break;a-=o}return Ct.steer=s.steer,Ct.throttle=s.throttle,Ct.brake=s.brake,this.roamReport()},roamReport(){const i=x.roamPos,t=Zh.set(0,0,-1).applyQuaternion(Bn.quaternion).normalize(),e=Mc.set(Math.sin(x.roamYaw),0,-Math.cos(x.roamYaw)).normalize(),n=Oi(i.x,i.z,i.y);return{mode:x.mode,s:+x.s.toFixed(2),totalDistance:+x.totalDistance.toFixed(2),x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2),yaw:+x.roamYaw.toFixed(3),camYaw:+x.camYaw.toFixed(3),speed:+x.speed.toFixed(2),groundXZ:+jt(i.x,i.z).toFixed(2),surface:n.kind,surfaceY:+n.y.toFixed(2),camX:+te.position.x.toFixed(2),camY:+te.position.y.toFixed(2),camZ:+te.position.z.toFixed(2),fov:+te.fov.toFixed(2),lookYaw:+x.camLookYaw.toFixed(3),lookPitch:+x.camLookPitch.toFixed(3),cameraZoom:+x.cameraZoom.toFixed(3),cameraSightLift:+wc({x:i.x,y:i.y+2.6,z:i.z},{x:te.position.x,y:te.position.y,z:te.position.z},2.4).toFixed(3),colliders:Hn.length+Wn.length+$s.length+Fi.length,insideBuilding:Hn.concat(Wn,$s,Fi).some(s=>c_(i,s)),carForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},driveForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},wheelRotY:Bn.userData.frontWheels?+Bn.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function f_(i){if(x.mode!=="race")return;x.time+=i,x.freeRun&&(x.damage=0);const t=x.breakdownTimer>0;t&&(x.breakdownTimer-=i,x.breakdownTimer<=0&&(x.damage=55,x.message="Patched up — back on it",x.messageTimer=1.2));const e=Math.max(ce.has("KeyW")||ce.has("ArrowUp")?1:0,Ct.throttle),n=Math.max(ce.has("KeyS")||ce.has("ArrowDown")?1:0,Ct.brake),s=zt.clamp((ce.has("KeyD")||ce.has("ArrowRight")?1:0)-(ce.has("KeyA")||ce.has("ArrowLeft")?1:0)+Ct.steer,-1,1),r=e>.03&&!t,a=(ce.has("ShiftLeft")||ce.has("ShiftRight"))&&x.boost>.02&&r&&x.grounded,o=fe(x.s),c=o.p.y+2.1,l=Math.abs(x.speed);if(r){const h=x.speed<0?40:0;x.speed+=((a?68:40)+h)*e*i}if(n>.03){const h=x.speed>1.2?70:26;x.speed-=h*n*i}const d=x.grounded?.0024:.0011;x.speed-=d*x.speed*l*i,l>.08?x.speed-=Math.sign(x.speed)*(x.grounded?2.2:.3)*i:e<=.03&&n<=.03&&(x.speed=0),x.speed=zt.clamp(x.speed,-16,156-x.damage*.8),t&&(x.speed=Math.min(x.speed,14)),x.boosting=a,a?(x.boost=Math.max(0,x.boost-i*.21),x.score+=28*i):x.boost=Math.min(1,x.boost+i*(x.grounded?.045:.018));const u=14+l*.12;x.lateralVel-=s*u*i,x.lateralVel-=x.lateralVel*(x.grounded?3.4:.7)*i,x.lateral+=x.lateralVel*i;const f=Si(x.s),m=Math.abs(x.lateral)<ht.width*.52,g=!f&&m;if(x.grounded&&(!g||Math.abs(x.lateral)>ht.width*.5)&&Jl(o,m?"":"Edge slip"),x.grounded){const h=Math.sin(x.time*18)*Math.min(.22,Math.abs(x.speed)/700);x.y=zt.lerp(x.y,c+h,.5),x.yVel=0,x.lastSafeS=x.s,x.lastSafeDistance=x.totalDistance,x.score+=Math.max(0,x.speed)*i*.34,Math.abs(x.lateral)>ht.width*.42&&(x.damage+=i*(1.2+Math.abs(x.speed)*.035),x.cameraShake=Math.max(x.cameraShake,.24),x.nearMisses+=i*.8,Math.random()<i*5&&Zl(o.p.clone().addScaledVector(o.side,Math.sign(x.lateral)*ht.width*.55).addScaledVector(tn,1.2),4))}else{x.yVel-=31*i,x.y+=x.yVel*i,x.airtime+=i,x.score+=i*11;const h=fe(x.s),S=h.p.y+2.1;if(!Si(x.s)&&Math.abs(x.lateral)<ht.width*.55&&x.y<=S&&x.yVel<0){const y=-x.yVel,E=Math.abs(x.lateral)<ht.width*.34&&y<30;x.y=S,x.grounded=!0,x.yVel=0,x.lastSafeS=x.s,x.lastSafeDistance=x.totalDistance,x.damage+=Math.max(0,y-17)*.82+Math.max(0,Math.abs(x.lateral)-ht.width*.36)*1.8,x.score+=E?260+x.airtime*85:Math.max(30,120-y),x.cameraShake=Math.max(x.cameraShake,y/34),x.message=E?"Clean landing":"Hard landing",x.messageTimer=.9,E?x.cleanLandings+=1:x.hardLandings+=1,ql(y),Zl(h.p.clone().addScaledVector(h.side,x.lateral).addScaledVector(tn,.7),E?7:24),x.airtime=0}x.y<-55&&(x.damage+=28,Kl("Track crew recovery"))}const v=x.totalDistance;x.totalDistance+=x.speed*i,x.s=(x.totalDistance%ht.length+ht.length)%ht.length;const p=Math.floor(x.totalDistance/ht.length)+1;if(p>x.lap){const h=x.time-x.lapStartTime;x.splitTimes.push(h),x.bestLap=Math.min(x.bestLap,h),x.lapStartTime=x.time,x.lap=p,x.score+=1200,x.message=x.practice?`Lap ${x.lap}`:x.lap<=ht.laps?`Lap ${x.lap}`:"Season race complete",x.messageTimer=1.4,!x.practice&&x.lap>ht.laps&&cd(x.totalDistance>=x.rivalDistance?"You took the chequered gantry.":"You finished behind Crowther.")}for(const h of ht.gaps)Cg(v,x.totalDistance,h.start)&&(x.message=h.name,x.messageTimer=1.1,x.grounded&&Jl(fe(h.start),h.name));x.damage=zt.clamp(x.damage,0,100),!x.freeRun&&x.damage>=90&&x.breakdownTimer<=0&&(x.breakdownTimer=2.6,x.message="Chassis cracked — limping to repair",x.messageTimer=1.6,x.cameraShake=Math.max(x.cameraShake,.8),ql(40),x.damage=90),ce.has("KeyR")&&(x.damage=Math.min(99,x.damage+8),Kl("Manual reset"),ce.delete("KeyR"))}function p_(i){if(x.mode==="race"&&!x.practice){const r=x.totalDistance-x.rivalDistance,a=zt.clamp(r*.06,-12,16),o=Math.sin(x.time*.6)*5;x.rivalSpeed=zt.clamp(92+a+o,70,120),x.rivalDistance+=x.rivalSpeed*i,x.rivalDistance>=ht.length*ht.laps&&x.lap<=ht.laps&&cd("Crowther reached the gantry first.")}x.rivalS=(x.rivalDistance%ht.length+ht.length)%ht.length;const t=fe(x.rivalS),e=t.p.clone().addScaledVector(tn,1.4).addScaledVector(t.side,Math.sin(x.rivalS*.02)*1.4);Ks.position.copy(e);const n=new _e().makeBasis(t.side,tn,t.tangent);Ks.quaternion.setFromRotationMatrix(n);const s=Math.abs(x.rivalDistance-x.totalDistance)<26;Ks.visible=(x.mode==="race"||x.mode==="paused")&&!x.practice&&!s}function Ec(i){if(window.__freeCam)return;rd(i);const t=fe(x.s),e=t.side.clone().multiplyScalar(x.lateral),n=t.p.clone().add(e);n.y=x.y;const s=x.cameraShake;s>.01&&(n.x+=(Math.random()-.5)*s*.8,n.y+=(Math.random()-.5)*s*.45),te.position.copy(n);const r=Math.abs(x.speed),a=68+Math.min(10,r*.055)+(ce.has("ShiftLeft")||ce.has("ShiftRight")?3:0)+x.cameraZoom*12;Math.abs(te.fov-a)>.02&&(te.fov+=(a-te.fov)*(1-Math.pow(.004,i)),te.updateProjectionMatrix());const o=fe(x.s+34+x.speed*.16),c=o.p.clone().addScaledVector(o.side,x.lateral*.45);c.y+=1.7+x.camLookPitch*12+Math.sin(x.time*8)*Math.min(.2,r/680),Ln.position.copy(te.position),Ln.lookAt(c),Ln.rotateY(Math.PI),Ln.rotateY(-x.camLookYaw),Ln.rotateZ(-t.bank*.72-x.lateralVel*.006),Ln.rotateX(t.grade*.18+(x.grounded?0:zt.clamp(x.yVel,-30,30)*-.006)),te.quaternion.slerp(Ln.quaternion,1-Math.pow(8e-4,i)),x.cameraShake=Math.max(0,x.cameraShake-i*1.9);const l=Mc.set(0,0,-1).applyQuaternion(te.quaternion).normalize();window.__steelRibbonTelemetry={mode:x.mode,s:x.s,totalDistance:x.totalDistance,rivalDistance:x.rivalDistance,speed:x.speed,lap:x.lap,score:x.score,damage:x.damage,y:x.y,yVel:x.yVel,grounded:x.grounded,input:{steer:Ct.steer,throttle:Ct.throttle,brake:Ct.brake},forwardWorld:{x:t.tangent.x,y:t.tangent.y,z:t.tangent.z},cameraWorld:{x:l.x,y:l.y,z:l.z}}}const Bi={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},zs=[28,54,82,110,134,156];function m_(){const i=Math.abs(x.speed);let t=1;for(let o=0;o<zs.length;o++)i>zs[o]&&(t=o+2);t=Math.min(t,zs.length);const e=t===1?0:zs[t-2],n=zs[t-1],s=n>e?zt.clamp((i-e)/(n-e),0,1):0,r=t===1?Bi.idle:Bi.postShift;let a=r+s*(Bi.shift-r);return i<.4&&(a=Bi.idle),{gear:t,rpm:a}}let jl=performance.now(),Za=0,$a=0;function ld(i){const t=i.getContext("2d"),e=Math.min(2,window.devicePixelRatio||1),n=i.clientWidth||120,s=i.clientHeight||70;(i.width!==Math.round(n*e)||i.height!==Math.round(s*e))&&(i.width=Math.round(n*e),i.height=Math.round(s*e)),t.setTransform(e,0,0,e,0,0),t.clearRect(0,0,n,s);const r=n/2,a=s-s*.14,o=Math.min(n*.46,s*.9);return{ctx:t,w:n,h:s,cx:r,cy:a,R:o,aFor:d=>Math.PI-d*Math.PI,at:(d,u)=>[r+Math.cos(d)*u,a-Math.sin(d)*u]}}function x_(i,t){const e=Ht.speedo;if(!e)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=ld(e),l=360;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke(),n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let g=0;g<=l;g+=20){const v=g/l,p=o(v),h=g%80===0;n.strokeStyle="rgba(180, 230, 255, 0.85)",n.lineWidth=h?Math.max(1.4,a*.035):Math.max(1,a*.02);const S=c(p,a-a*.02),_=c(p,a-a*(h?.18:.1));if(n.beginPath(),n.moveTo(S[0],S[1]),n.lineTo(_[0],_[1]),n.stroke(),h){const y=c(p,a-a*.34);n.fillStyle="#cfeeff",n.fillText(String(g/10),y[0],y[1])}}const d=zt.clamp(i/l,0,1),u=o(d),f=c(u,a-a*.06),m=c(u+Math.PI,a*.14);n.strokeStyle="#7df1ff",n.shadowColor="rgba(80, 220, 255, 0.9)",n.shadowBlur=a*.18,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(m[0],m[1]),n.lineTo(f[0],f[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("MPH",s,r-a*.26),n.fillStyle=t?"#ff8077":"#f2f8ff",n.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,n.fillText(t?`-${Math.round(i)}`:String(Math.round(i)),s,r+a*.02)}function g_(i,t){const e=Ht.boostGauge;if(!e)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=ld(e),l=18;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.3)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke();const d=zt.clamp(i,0,1),u=i<.25;n.strokeStyle=u?"#ff5436":t?"#ffb53a":"#46e0b0",n.shadowColor=t?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",n.shadowBlur=t?a*.25:a*.1,n.lineWidth=Math.max(2,a*.07),n.beginPath(),n.arc(s,r,a,o(d),o(0)),n.stroke(),n.shadowBlur=0,n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let v=0;v<=l;v+=3){const p=v/l,h=o(p),S=v%6===0;n.strokeStyle=v>=l*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",n.lineWidth=S?Math.max(1.3,a*.03):Math.max(1,a*.018);const _=c(h,a-a*.02),y=c(h,a-a*(S?.17:.1));if(n.beginPath(),n.moveTo(_[0],_[1]),n.lineTo(y[0],y[1]),n.stroke(),S){const E=c(h,a-a*.33);n.fillStyle="#cfeeff",n.fillText(String(v),E[0],E[1])}}const f=o(d),m=c(f,a-a*.06),g=c(f+Math.PI,a*.14);n.strokeStyle=u?"#ff5436":"#ffd23f",n.shadowColor="rgba(255, 200, 60, 0.8)",n.shadowBlur=a*.16,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(g[0],g[1]),n.lineTo(m[0],m[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("BOOST psi",s,r-a*.26),t&&(n.fillStyle="#ffce4a",n.shadowColor="rgba(255, 190, 60, 0.95)",n.shadowBlur=a*.3,n.beginPath(),n.arc(s,r+a*.02,a*.07,0,Math.PI*2),n.fill(),n.shadowBlur=0)}function __(i,t){const e=Ht.tach;if(!e)return;const n=e.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=e.clientWidth||160,a=e.clientHeight||70;(e.width!==Math.round(r*s)||e.height!==Math.round(a*s))&&(e.width=Math.round(r*s),e.height=Math.round(a*s)),n.setTransform(s,0,0,s,0,0),n.clearRect(0,0,r,a);const o=r/2,c=a-a*.14,l=Math.min(r*.46,a*.9),d=Bi.max,u=_=>Math.PI-_*Math.PI,f=(_,y)=>[o+Math.cos(_)*y,c-Math.sin(_)*y];n.lineCap="round",n.lineWidth=Math.max(2,l*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(o,c,l,u(1),u(0)),n.stroke();const m=Bi.redline/d;n.strokeStyle="#ff3b30",n.beginPath(),n.arc(o,c,l,u(1),u(m)),n.stroke(),n.font=`700 ${Math.max(7,l*.17)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let _=0;_<=9;_++){const y=_/9,E=u(y),w=_*1e3>=Bi.redline;n.strokeStyle=w?"#ff6155":"rgba(180, 230, 255, 0.9)",n.lineWidth=Math.max(1.4,l*.035);const R=f(E,l-l*.02),P=f(E,l-l*.18);n.beginPath(),n.moveTo(R[0],R[1]),n.lineTo(P[0],P[1]),n.stroke();const b=f(E,l-l*.34);if(n.fillStyle=w?"#ff8077":"#cfeeff",n.fillText(String(_),b[0],b[1]),_<9){const M=u((_+.5)/9),A=f(M,l-l*.02),I=f(M,l-l*.1);n.strokeStyle="rgba(150, 210, 255, 0.5)",n.lineWidth=Math.max(1,l*.02),n.beginPath(),n.moveTo(A[0],A[1]),n.lineTo(I[0],I[1]),n.stroke()}}const g=zt.clamp(i/d,0,1),v=u(g),p=f(v,l-l*.06),h=f(v+Math.PI,l*.14);n.strokeStyle="#ffdd48",n.shadowColor="rgba(255, 200, 60, 0.9)",n.shadowBlur=l*.18,n.lineWidth=Math.max(1.8,l*.05),n.beginPath(),n.moveTo(h[0],h[1]),n.lineTo(p[0],p[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,l*.03),n.beginPath(),n.arc(o,c,l*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,l*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("x1000 r/min",o,c-l*.26);const S=x.speed<-.5?"R":String(t);n.fillStyle="#f2f8ff",n.font=`800 ${Math.max(9,l*.22)}px "Courier New", monospace`,n.fillText(S,o,c+l*.02)}function Js(){ht.length*ht.laps;const i=kl(x.practice?x.totalDistance%ht.length:x.totalDistance),t=x.practice?0:kl(x.rivalDistance),e=x.practice?"SOLO":x.totalDistance>=x.rivalDistance?"P1":"P2";e!==x.leadState&&x.mode==="race"&&(x.leadState=e,x.practice||(x.message=e==="P1"?"You took the lead":"Crowther ahead",x.messageTimer=.95)),Ht.damage.style.width=`${Math.round(x.damage)}%`,Ht.lap.textContent=x.practice?`LAP ${x.lap}`:`${Math.min(x.lap,ht.laps)}/${ht.laps}`,Ht.timer.textContent=Yo(x.time),Ht.score.textContent=`Score ${Math.round(x.score)}`;const n=x.mode==="roam",s=x.mode==="race"||x.mode==="paused"||n;Ht.position.textContent=n?"FREE ROAM":x.freeRun?"FREE RUN":x.practice?"PRACTICE":`${e} DIV 4`,Ht.hud.style.display=s?"flex":"none",Ht.raceStrip.style.display=x.mode==="race"||x.mode==="paused"?"grid":"none",Ht.touchControls.style.display=s?"":"none",Ht.playerProgress.style.width=`${Math.round(i*100)}%`,Ht.rivalProgress.style.width=`${Math.round(t*100)}%`;const r=m_();x.gear=r.gear;const a=performance.now(),o=Math.min(.05,(a-jl)/1e3);jl=a;const c=1-Math.exp(-o*(r.rpm>x.tachRpm?10:6));x.tachRpm+=(r.rpm-x.tachRpm)*c,__(x.tachRpm,r.gear);const l=Math.abs(x.speed)*2.25;Za+=(l-Za)*(1-Math.exp(-o*8)),$a+=(x.boost-$a)*(1-Math.exp(-o*9)),x_(Za,x.speed<-.5),g_($a,x.boosting),Ht.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(x.speed)-44)/150)),Ht.damageFx.style.opacity=x.damage<18?0:Math.min(.72,(x.damage-18)/82),x.mode==="paused"?(Ht.centerMessage.textContent="Paused",Ht.centerMessage.classList.remove("hidden")):x.messageTimer>0?(Ht.centerMessage.textContent=x.message,Ht.centerMessage.classList.remove("hidden")):Ht.centerMessage.classList.add("hidden")}function Yo(i){const t=Math.floor(i/60),e=i-t*60;return`${String(t).padStart(2,"0")}:${e.toFixed(1).padStart(4,"0")}`}function hd(){const i=wg.getDelta(),t=Math.min(.033,i);x.messageTimer>0&&(x.messageTimer-=t),x.mode==="roam"?(sd(t),od(t)):(f_(t),p_(t),Ec(t)),s_(t),jh(t),Js(),r_(),Hs.uniforms.uTime.value+=t,Hs.uniforms.uSpeed.value=Math.min(1,Math.abs(x.speed)/150);const e=(ce.has("ShiftLeft")||ce.has("ShiftRight"))&&x.boost>.02&&x.mode==="race";Hs.uniforms.uBoost.value+=((e?1:0)-Hs.uniforms.uBoost.value)*Math.min(1,t*6),Cs.render(),requestAnimationFrame(hd)}window.addEventListener("keydown",i=>{ce.add(i.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(i.code)&&i.preventDefault(),i.code==="KeyP"&&x.mode==="race"?(x.mode="paused",ce.clear(),na()):i.code==="KeyP"&&x.mode==="paused"?x.mode="race":i.code==="Escape"&&(x.mode==="race"||x.mode==="paused"||x.mode==="roam")&&(x.mode="menu",na(),Bn.visible=!1,li&&(li.visible=!0),Ht.menu.classList.remove("hidden"))});window.addEventListener("keyup",i=>ce.delete(i.code));window.addEventListener("resize",()=>{te.aspect=window.innerWidth/window.innerHeight,te.updateProjectionMatrix(),fn.setSize(window.innerWidth,window.innerHeight),Cs.setSize(window.innerWidth,window.innerHeight),ed.setSize(window.innerWidth,window.innerHeight)});Ht.startBtn.addEventListener("click",()=>la(!1));Ht.practiceBtn.addEventListener("click",()=>la(!0));Ht.freeRunBtn.addEventListener("click",()=>la(!0,!0));Ht.roamBtn.addEventListener("click",()=>id());Ht.againBtn.addEventListener("click",()=>la(!1));Ht.courseButtons.forEach(i=>{i.addEventListener("click",()=>bc(Number(i.dataset.course)))});function dd(i){i&&(i.classList.remove("active"),i.style.setProperty("--stick-x","0px"),i.style.setProperty("--stick-y","0px"))}function na(){Ct.steer=0,Ct.throttle=0,Ct.brake=0,Ct.lookX=0,Ct.lookY=0,Ct.zoom=0,Ct.lookPointer=null,Ct.drivePointer=null,Ct.pinchStartDistance=0,Ct.pinchStartZoom=0;for(const i of Ht.touchControls.querySelectorAll(".touch-stick"))dd(i)}function kr(i,t){const e=i.getBoundingClientRect(),n=Math.min(e.width,e.height)*.36;if(!(n>0))return;const s=zt.clamp(t.clientX-(e.left+e.width/2),-n,n),r=zt.clamp(t.clientY-(e.top+e.height/2),-n,n),a=i.dataset.stick;if(i.classList.add("active"),a==="look")Ct.lookX=zt.clamp(s/n,-1,1),Ct.lookY=zt.clamp(-r/n,-1,1),i.style.setProperty("--stick-x",`${Math.round(Ct.lookX*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-Ct.lookY*n)}px`);else{const o=zt.clamp(s/n,-1,1),c=zt.clamp(-r/n,-1,1);Ct.steer=o,Ct.throttle=Math.max(0,c),Ct.brake=Math.max(0,-c),i.style.setProperty("--stick-x",`${Math.round(o*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-c*n)}px`)}}function Ql(i,t){return Array.from(i.changedTouches).find(e=>e.identifier===t)}function th(i,t){t==="look"?(Ct.lookX=0,Ct.lookY=0,Ct.lookPointer=null):(Ct.steer=0,Ct.throttle=0,Ct.brake=0,Ct.drivePointer=null),dd(i)}function v_(i,t){return Math.hypot(i.clientX-t.clientX,i.clientY-t.clientY)}function ud(i,t=!1){if(i.touches.length<2){Ct.pinchStartDistance=0;return}const e=v_(i.touches[0],i.touches[1]);if(t||!(Ct.pinchStartDistance>0)){Ct.pinchStartDistance=e,Ct.pinchStartZoom=Ct.zoom;return}const n=Math.max(.2,e/Ct.pinchStartDistance);Ct.zoom=zt.clamp(Ct.pinchStartZoom-Math.log(n)*1.15,-.42,.9)}for(const i of Ht.touchControls.querySelectorAll(".touch-stick")){const t=i.dataset.stick;i.addEventListener("pointerdown",s=>{s.preventDefault(),ea(),x.mode==="paused"&&(x.mode="race"),t==="look"&&(Ct.lookPointer=s.pointerId),t==="drive"&&(Ct.drivePointer=s.pointerId),kr(i,s)},{passive:!1}),i.addEventListener("pointermove",s=>{(t==="look"?Ct.lookPointer:Ct.drivePointer)===s.pointerId&&(s.preventDefault(),kr(i,s))},{passive:!1});const e=s=>{(t==="look"?Ct.lookPointer:Ct.drivePointer)===s.pointerId&&th(i,t)};i.addEventListener("pointerup",e),i.addEventListener("pointercancel",e),i.addEventListener("touchstart",s=>{s.preventDefault(),ea(),x.mode==="paused"&&(x.mode="race");const r=s.changedTouches[0];r&&(t==="look"&&(Ct.lookPointer=r.identifier),t==="drive"&&(Ct.drivePointer=r.identifier),kr(i,r))},{passive:!1}),i.addEventListener("touchmove",s=>{const r=t==="look"?Ct.lookPointer:Ct.drivePointer,a=Ql(s,r);a&&(s.preventDefault(),kr(i,a))},{passive:!1});const n=s=>{const r=t==="look"?Ct.lookPointer:Ct.drivePointer;Ql(s,r)&&(s.preventDefault(),th(i,t))};i.addEventListener("touchend",n,{passive:!1}),i.addEventListener("touchcancel",n,{passive:!1})}for(const i of Ht.touchControls.querySelectorAll("button")){const t=i.dataset.code;i.addEventListener("pointerdown",n=>{n.preventDefault(),ea(),ce.add(t),i.setPointerCapture(n.pointerId)});const e=()=>ce.delete(t);i.addEventListener("pointerup",e),i.addEventListener("pointercancel",e),i.addEventListener("lostpointercapture",e)}hr.addEventListener("touchstart",i=>{i.touches.length>=2&&(i.preventDefault(),ud(i,!0))},{passive:!1});hr.addEventListener("touchmove",i=>{i.touches.length>=2&&(i.preventDefault(),ud(i))},{passive:!1});hr.addEventListener("touchend",i=>{i.touches.length<2&&(Ct.pinchStartDistance=0)},{passive:!1});hr.addEventListener("touchcancel",()=>{Ct.pinchStartDistance=0},{passive:!1});const M_=fe(x.s);x.y=M_.p.y+2.1;x.lastSafeS=x.s;x.lastSafeDistance=x.totalDistance;Ec(.016);Js();hd();
