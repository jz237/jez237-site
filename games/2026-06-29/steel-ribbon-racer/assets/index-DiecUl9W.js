(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Mo="181",$h=0,rc=1,Zh=2,Ul=1,Nl=2,Vn=3,si=0,Ht=1,St=2,Rn=0,qi=1,Yi=2,ac=3,oc=4,Kh=5,xi=100,Jh=101,jh=102,Qh=103,ed=104,td=200,nd=201,id=202,sd=203,Ta=204,Ea=205,rd=206,ad=207,od=208,cd=209,ld=210,hd=211,dd=212,ud=213,fd=214,Aa=0,Ca=1,Ra=2,Zi=3,Pa=4,La=5,Da=6,Ia=7,So=0,pd=1,md=2,ni=0,Fl=1,Ol=2,Bl=3,yo=4,zl=5,Vl=6,kl=7,Gl=300,Ki=301,Ji=302,Ua=303,Na=304,Ur=306,hn=1e3,Gn=1001,Fa=1002,nn=1003,xd=1004,Gs=1005,ln=1006,kr=1007,_i=1008,Dn=1009,Hl=1010,Wl=1011,Rs=1012,bo=1013,Si=1014,An=1015,Pn=1016,wo=1017,To=1018,Ps=1020,Xl=35902,ql=35899,Yl=1021,$l=1022,_n=1023,Ls=1026,Ds=1027,Eo=1028,Ao=1029,Co=1030,Ro=1031,Po=1033,gr=33776,_r=33777,vr=33778,Mr=33779,Oa=35840,Ba=35841,za=35842,Va=35843,ka=36196,Ga=37492,Ha=37496,Wa=37808,Xa=37809,qa=37810,Ya=37811,$a=37812,Za=37813,Ka=37814,Ja=37815,ja=37816,Qa=37817,eo=37818,to=37819,no=37820,io=37821,so=36492,ro=36494,ao=36495,oo=36283,co=36284,lo=36285,ho=36286,gd=3200,_d=3201,Lo=0,vd=1,jn="",bt="srgb",ji="srgb-linear",Ar="linear",ht="srgb",Ci=7680,cc=519,Md=512,Sd=513,yd=514,Zl=515,bd=516,wd=517,Td=518,Ed=519,lc=35044,hc="300 es",Cn=2e3,Cr=2001;function Kl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Rr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ad(){const i=Rr("canvas");return i.style.display="block",i}const dc={};function uc(...i){const e="THREE."+i.shift();console.log(e,...i)}function qe(...i){const e="THREE."+i.shift();console.warn(e,...i)}function Pt(...i){const e="THREE."+i.shift();console.error(e,...i)}function Is(...i){const e=i.join(" ");e in dc||(dc[e]=!0,qe(...i))}function Cd(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}class ss{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const zt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let fc=1234567;const bs=Math.PI/180,Us=180/Math.PI;function wi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(zt[i&255]+zt[i>>8&255]+zt[i>>16&255]+zt[i>>24&255]+"-"+zt[e&255]+zt[e>>8&255]+"-"+zt[e>>16&15|64]+zt[e>>24&255]+"-"+zt[t&63|128]+zt[t>>8&255]+"-"+zt[t>>16&255]+zt[t>>24&255]+zt[n&255]+zt[n>>8&255]+zt[n>>16&255]+zt[n>>24&255]).toLowerCase()}function Qe(i,e,t){return Math.max(e,Math.min(t,i))}function Do(i,e){return(i%e+e)%e}function Rd(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Pd(i,e,t){return i!==e?(t-i)/(e-i):0}function ws(i,e,t){return(1-t)*i+t*e}function Ld(i,e,t,n){return ws(i,e,1-Math.exp(-t*n))}function Dd(i,e=1){return e-Math.abs(Do(i,e*2)-e)}function Id(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Ud(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Nd(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Fd(i,e){return i+Math.random()*(e-i)}function Od(i){return i*(.5-Math.random())}function Bd(i){i!==void 0&&(fc=i);let e=fc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function zd(i){return i*bs}function Vd(i){return i*Us}function kd(i){return(i&i-1)===0&&i!==0}function Gd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Hd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Wd(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),d=a((e+n)/2),u=r((e-n)/2),f=a((e-n)/2),p=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*d,c*u,c*f,o*l);break;case"YZY":i.set(c*f,o*d,c*u,o*l);break;case"ZXZ":i.set(c*u,c*f,o*d,o*l);break;case"XZX":i.set(o*d,c*g,c*p,o*l);break;case"YXY":i.set(c*p,o*d,c*g,o*l);break;case"ZYZ":i.set(c*g,c*p,o*d,o*l);break;default:qe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Wi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function qt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Je={DEG2RAD:bs,RAD2DEG:Us,generateUUID:wi,clamp:Qe,euclideanModulo:Do,mapLinear:Rd,inverseLerp:Pd,lerp:ws,damp:Ld,pingpong:Dd,smoothstep:Id,smootherstep:Ud,randInt:Nd,randFloat:Fd,randFloatSpread:Od,seededRandom:Bd,degToRad:zd,radToDeg:Vd,isPowerOfTwo:kd,ceilPowerOfTwo:Gd,floorPowerOfTwo:Hd,setQuaternionFromProperEuler:Wd,normalize:qt,denormalize:Wi};class ge{constructor(e=0,t=0){ge.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Xn{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],d=n[s+2],u=n[s+3],f=r[a+0],p=r[a+1],g=r[a+2],M=r[a+3];if(o<=0){e[t+0]=c,e[t+1]=l,e[t+2]=d,e[t+3]=u;return}if(o>=1){e[t+0]=f,e[t+1]=p,e[t+2]=g,e[t+3]=M;return}if(u!==M||c!==f||l!==p||d!==g){let m=c*f+l*p+d*g+u*M;m<0&&(f=-f,p=-p,g=-g,M=-M,m=-m);let h=1-o;if(m<.9995){const v=Math.acos(m),_=Math.sin(v);h=Math.sin(h*v)/_,o=Math.sin(o*v)/_,c=c*h+f*o,l=l*h+p*o,d=d*h+g*o,u=u*h+M*o}else{c=c*h+f*o,l=l*h+p*o,d=d*h+g*o,u=u*h+M*o;const v=1/Math.sqrt(c*c+l*l+d*d+u*u);c*=v,l*=v,d*=v,u*=v}}e[t]=c,e[t+1]=l,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],d=n[s+3],u=r[a],f=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+d*u+c*p-l*f,e[t+1]=c*g+d*f+l*u-o*p,e[t+2]=l*g+d*p+o*f-c*u,e[t+3]=d*g-o*u-c*f-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),d=o(s/2),u=o(r/2),f=c(n/2),p=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=f*d*u+l*p*g,this._y=l*p*u-f*d*g,this._z=l*d*g+f*p*u,this._w=l*d*u-f*p*g;break;case"YXZ":this._x=f*d*u+l*p*g,this._y=l*p*u-f*d*g,this._z=l*d*g-f*p*u,this._w=l*d*u+f*p*g;break;case"ZXY":this._x=f*d*u-l*p*g,this._y=l*p*u+f*d*g,this._z=l*d*g+f*p*u,this._w=l*d*u-f*p*g;break;case"ZYX":this._x=f*d*u-l*p*g,this._y=l*p*u+f*d*g,this._z=l*d*g-f*p*u,this._w=l*d*u+f*p*g;break;case"YZX":this._x=f*d*u+l*p*g,this._y=l*p*u+f*d*g,this._z=l*d*g-f*p*u,this._w=l*d*u-f*p*g;break;case"XZY":this._x=f*d*u-l*p*g,this._y=l*p*u-f*d*g,this._z=l*d*g+f*p*u,this._w=l*d*u+f*p*g;break;default:qe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],d=t[6],u=t[10],f=n+o+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(d-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(d-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+d)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qe(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,d=t._w;return this._x=n*d+a*o+s*l-r*c,this._y=s*d+a*c+r*o-n*l,this._z=r*d+a*l+n*c-s*o,this._w=a*d-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),d=Math.sin(l);c=Math.sin(c*l)/d,t=Math.sin(t*l)/d,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,n=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(pc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(pc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),d=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*d,this.y=n+c*d+o*l-r*u,this.z=s+c*u+r*d-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Gr.copy(this).projectOnVector(e),this.sub(Gr)}reflect(e){return this.sub(Gr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Gr=new D,pc=new Xn;class $e{constructor(e,t,n,s,r,a,o,c,l){$e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],d=n[4],u=n[7],f=n[2],p=n[5],g=n[8],M=s[0],m=s[3],h=s[6],v=s[1],_=s[4],b=s[7],E=s[2],T=s[5],P=s[8];return r[0]=a*M+o*v+c*E,r[3]=a*m+o*_+c*T,r[6]=a*h+o*b+c*P,r[1]=l*M+d*v+u*E,r[4]=l*m+d*_+u*T,r[7]=l*h+d*b+u*P,r[2]=f*M+p*v+g*E,r[5]=f*m+p*_+g*T,r[8]=f*h+p*b+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8];return t*a*d-t*o*l-n*r*d+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],u=d*a-o*l,f=o*c-d*r,p=l*r-a*c,g=t*u+n*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/g;return e[0]=u*M,e[1]=(s*l-d*n)*M,e[2]=(o*n-s*a)*M,e[3]=f*M,e[4]=(d*t-s*c)*M,e[5]=(s*r-o*t)*M,e[6]=p*M,e[7]=(n*c-l*t)*M,e[8]=(a*t-n*r)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Hr.makeScale(e,t)),this}rotate(e){return this.premultiply(Hr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Hr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Hr=new $e,mc=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xc=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Xd(){const i={enabled:!0,workingColorSpace:ji,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ht&&(s.r=Hn(s.r),s.g=Hn(s.g),s.b=Hn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ht&&(s.r=$i(s.r),s.g=$i(s.g),s.b=$i(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===jn?Ar:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Is("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Is("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ji]:{primaries:e,whitePoint:n,transfer:Ar,toXYZ:mc,fromXYZ:xc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:bt},outputColorSpaceConfig:{drawingBufferColorSpace:bt}},[bt]:{primaries:e,whitePoint:n,transfer:ht,toXYZ:mc,fromXYZ:xc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:bt}}}),i}const st=Xd();function Hn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function $i(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ri;class qd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ri===void 0&&(Ri=Rr("canvas")),Ri.width=e.width,Ri.height=e.height;const s=Ri.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ri}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Rr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Hn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Hn(t[n]/255)*255):t[n]=Hn(t[n]);return{data:t,width:e.width,height:e.height}}else return qe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Yd=0;class Io{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Yd++}),this.uuid=wi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Wr(s[a].image)):r.push(Wr(s[a]))}else r=Wr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Wr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?qd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(qe("Texture: Unable to serialize Texture."),{})}let $d=0;const Xr=new D;class Wt extends ss{constructor(e=Wt.DEFAULT_IMAGE,t=Wt.DEFAULT_MAPPING,n=Gn,s=Gn,r=ln,a=_i,o=_n,c=Dn,l=Wt.DEFAULT_ANISOTROPY,d=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$d++}),this.uuid=wi(),this.name="",this.source=new Io(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ge(0,0),this.repeat=new ge(1,1),this.center=new ge(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Xr).x}get height(){return this.source.getSize(Xr).y}get depth(){return this.source.getSize(Xr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){qe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){qe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Gl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case hn:e.x=e.x-Math.floor(e.x);break;case Gn:e.x=e.x<0?0:1;break;case Fa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case hn:e.y=e.y-Math.floor(e.y);break;case Gn:e.y=e.y<0?0:1;break;case Fa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=Gl;Wt.DEFAULT_ANISOTROPY=1;class _t{constructor(e=0,t=0,n=0,s=1){_t.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],d=c[4],u=c[8],f=c[1],p=c[5],g=c[9],M=c[2],m=c[6],h=c[10];if(Math.abs(d-f)<.01&&Math.abs(u-M)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(u+M)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(l+1)/2,b=(p+1)/2,E=(h+1)/2,T=(d+f)/4,P=(u+M)/4,A=(g+m)/4;return _>b&&_>E?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=T/n,r=P/n):b>E?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=T/s,r=A/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=P/r,s=A/r),this.set(n,s,r,t),this}let v=Math.sqrt((m-g)*(m-g)+(u-M)*(u-M)+(f-d)*(f-d));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(u-M)/v,this.z=(f-d)/v,this.w=Math.acos((l+p+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Qe(this.x,e.x,t.x),this.y=Qe(this.y,e.y,t.y),this.z=Qe(this.z,e.z,t.z),this.w=Qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Qe(this.x,e,t),this.y=Qe(this.y,e,t),this.z=Qe(this.z,e,t),this.w=Qe(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Zd extends ss{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ln,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new _t(0,0,e,t),this.scissorTest=!1,this.viewport=new _t(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new Wt(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:ln,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Io(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class vn extends Zd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Jl extends Wt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=nn,this.minFilter=nn,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Kd extends Wt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=nn,this.minFilter=nn,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ti{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,un):un.fromBufferAttribute(r,a),un.applyMatrix4(e.matrixWorld),this.expandByPoint(un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Hs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Hs.copy(n.boundingBox)),Hs.applyMatrix4(e.matrixWorld),this.union(Hs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,un),un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(hs),Ws.subVectors(this.max,hs),Pi.subVectors(e.a,hs),Li.subVectors(e.b,hs),Di.subVectors(e.c,hs),qn.subVectors(Li,Pi),Yn.subVectors(Di,Li),oi.subVectors(Pi,Di);let t=[0,-qn.z,qn.y,0,-Yn.z,Yn.y,0,-oi.z,oi.y,qn.z,0,-qn.x,Yn.z,0,-Yn.x,oi.z,0,-oi.x,-qn.y,qn.x,0,-Yn.y,Yn.x,0,-oi.y,oi.x,0];return!qr(t,Pi,Li,Di,Ws)||(t=[1,0,0,0,1,0,0,0,1],!qr(t,Pi,Li,Di,Ws))?!1:(Xs.crossVectors(qn,Yn),t=[Xs.x,Xs.y,Xs.z],qr(t,Pi,Li,Di,Ws))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Un),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Un=[new D,new D,new D,new D,new D,new D,new D,new D],un=new D,Hs=new Ti,Pi=new D,Li=new D,Di=new D,qn=new D,Yn=new D,oi=new D,hs=new D,Ws=new D,Xs=new D,ci=new D;function qr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ci.fromArray(i,r);const o=s.x*Math.abs(ci.x)+s.y*Math.abs(ci.y)+s.z*Math.abs(ci.z),c=e.dot(ci),l=t.dot(ci),d=n.dot(ci);if(Math.max(-Math.max(c,l,d),Math.min(c,l,d))>o)return!1}return!0}const Jd=new Ti,ds=new D,Yr=new D;class rs{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Jd.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ds.subVectors(e,this.center);const t=ds.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ds,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Yr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ds.copy(e.center).add(Yr)),this.expandByPoint(ds.copy(e.center).sub(Yr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Nn=new D,$r=new D,qs=new D,$n=new D,Zr=new D,Ys=new D,Kr=new D;class Uo{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Nn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Nn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Nn.copy(this.origin).addScaledVector(this.direction,t),Nn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){$r.copy(e).add(t).multiplyScalar(.5),qs.copy(t).sub(e).normalize(),$n.copy(this.origin).sub($r);const r=e.distanceTo(t)*.5,a=-this.direction.dot(qs),o=$n.dot(this.direction),c=-$n.dot(qs),l=$n.lengthSq(),d=Math.abs(1-a*a);let u,f,p,g;if(d>0)if(u=a*c-o,f=a*o-c,g=r*d,u>=0)if(f>=-g)if(f<=g){const M=1/d;u*=M,f*=M,p=u*(u+a*f+2*o)+f*(a*u+f+2*c)+l}else f=r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+l):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy($r).addScaledVector(qs,f),p}intersectSphere(e,t){Nn.subVectors(e.center,this.origin);const n=Nn.dot(this.direction),s=Nn.dot(Nn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),d>=0?(r=(e.min.y-f.y)*d,a=(e.max.y-f.y)*d):(r=(e.max.y-f.y)*d,a=(e.min.y-f.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Nn)!==null}intersectTriangle(e,t,n,s,r){Zr.subVectors(t,e),Ys.subVectors(n,e),Kr.crossVectors(Zr,Ys);let a=this.direction.dot(Kr),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;$n.subVectors(this.origin,e);const c=o*this.direction.dot(Ys.crossVectors($n,Ys));if(c<0)return null;const l=o*this.direction.dot(Zr.cross($n));if(l<0||c+l>a)return null;const d=-o*$n.dot(Kr);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class lt{constructor(e,t,n,s,r,a,o,c,l,d,u,f,p,g,M,m){lt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,d,u,f,p,g,M,m)}set(e,t,n,s,r,a,o,c,l,d,u,f,p,g,M,m){const h=this.elements;return h[0]=e,h[4]=t,h[8]=n,h[12]=s,h[1]=r,h[5]=a,h[9]=o,h[13]=c,h[2]=l,h[6]=d,h[10]=u,h[14]=f,h[3]=p,h[7]=g,h[11]=M,h[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new lt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Ii.setFromMatrixColumn(e,0).length(),r=1/Ii.setFromMatrixColumn(e,1).length(),a=1/Ii.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=a*d,p=a*u,g=o*d,M=o*u;t[0]=c*d,t[4]=-c*u,t[8]=l,t[1]=p+g*l,t[5]=f-M*l,t[9]=-o*c,t[2]=M-f*l,t[6]=g+p*l,t[10]=a*c}else if(e.order==="YXZ"){const f=c*d,p=c*u,g=l*d,M=l*u;t[0]=f+M*o,t[4]=g*o-p,t[8]=a*l,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=p*o-g,t[6]=M+f*o,t[10]=a*c}else if(e.order==="ZXY"){const f=c*d,p=c*u,g=l*d,M=l*u;t[0]=f-M*o,t[4]=-a*u,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*d,t[9]=M-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const f=a*d,p=a*u,g=o*d,M=o*u;t[0]=c*d,t[4]=g*l-p,t[8]=f*l+M,t[1]=c*u,t[5]=M*l+f,t[9]=p*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,p=a*l,g=o*c,M=o*l;t[0]=c*d,t[4]=M-f*u,t[8]=g*u+p,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-l*d,t[6]=p*u+g,t[10]=f-M*u}else if(e.order==="XZY"){const f=a*c,p=a*l,g=o*c,M=o*l;t[0]=c*d,t[4]=-u,t[8]=l*d,t[1]=f*u+M,t[5]=a*d,t[9]=p*u-g,t[2]=g*u-p,t[6]=o*d,t[10]=M*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(jd,e,Qd)}lookAt(e,t,n){const s=this.elements;return jt.subVectors(e,t),jt.lengthSq()===0&&(jt.z=1),jt.normalize(),Zn.crossVectors(n,jt),Zn.lengthSq()===0&&(Math.abs(n.z)===1?jt.x+=1e-4:jt.z+=1e-4,jt.normalize(),Zn.crossVectors(n,jt)),Zn.normalize(),$s.crossVectors(jt,Zn),s[0]=Zn.x,s[4]=$s.x,s[8]=jt.x,s[1]=Zn.y,s[5]=$s.y,s[9]=jt.y,s[2]=Zn.z,s[6]=$s.z,s[10]=jt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],d=n[1],u=n[5],f=n[9],p=n[13],g=n[2],M=n[6],m=n[10],h=n[14],v=n[3],_=n[7],b=n[11],E=n[15],T=s[0],P=s[4],A=s[8],y=s[12],x=s[1],R=s[5],I=s[9],O=s[13],V=s[2],Y=s[6],H=s[10],Q=s[14],W=s[3],he=s[7],de=s[11],Pe=s[15];return r[0]=a*T+o*x+c*V+l*W,r[4]=a*P+o*R+c*Y+l*he,r[8]=a*A+o*I+c*H+l*de,r[12]=a*y+o*O+c*Q+l*Pe,r[1]=d*T+u*x+f*V+p*W,r[5]=d*P+u*R+f*Y+p*he,r[9]=d*A+u*I+f*H+p*de,r[13]=d*y+u*O+f*Q+p*Pe,r[2]=g*T+M*x+m*V+h*W,r[6]=g*P+M*R+m*Y+h*he,r[10]=g*A+M*I+m*H+h*de,r[14]=g*y+M*O+m*Q+h*Pe,r[3]=v*T+_*x+b*V+E*W,r[7]=v*P+_*R+b*Y+E*he,r[11]=v*A+_*I+b*H+E*de,r[15]=v*y+_*O+b*Q+E*Pe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],d=e[2],u=e[6],f=e[10],p=e[14],g=e[3],M=e[7],m=e[11],h=e[15];return g*(+r*c*u-s*l*u-r*o*f+n*l*f+s*o*p-n*c*p)+M*(+t*c*p-t*l*f+r*a*f-s*a*p+s*l*d-r*c*d)+m*(+t*l*u-t*o*p-r*a*u+n*a*p+r*o*d-n*l*d)+h*(-s*o*d-t*c*u+t*o*f+s*a*u-n*a*f+n*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],d=e[8],u=e[9],f=e[10],p=e[11],g=e[12],M=e[13],m=e[14],h=e[15],v=u*m*l-M*f*l+M*c*p-o*m*p-u*c*h+o*f*h,_=g*f*l-d*m*l-g*c*p+a*m*p+d*c*h-a*f*h,b=d*M*l-g*u*l+g*o*p-a*M*p-d*o*h+a*u*h,E=g*u*c-d*M*c-g*o*f+a*M*f+d*o*m-a*u*m,T=t*v+n*_+s*b+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/T;return e[0]=v*P,e[1]=(M*f*r-u*m*r-M*s*p+n*m*p+u*s*h-n*f*h)*P,e[2]=(o*m*r-M*c*r+M*s*l-n*m*l-o*s*h+n*c*h)*P,e[3]=(u*c*r-o*f*r-u*s*l+n*f*l+o*s*p-n*c*p)*P,e[4]=_*P,e[5]=(d*m*r-g*f*r+g*s*p-t*m*p-d*s*h+t*f*h)*P,e[6]=(g*c*r-a*m*r-g*s*l+t*m*l+a*s*h-t*c*h)*P,e[7]=(a*f*r-d*c*r+d*s*l-t*f*l-a*s*p+t*c*p)*P,e[8]=b*P,e[9]=(g*u*r-d*M*r-g*n*p+t*M*p+d*n*h-t*u*h)*P,e[10]=(a*M*r-g*o*r+g*n*l-t*M*l-a*n*h+t*o*h)*P,e[11]=(d*o*r-a*u*r-d*n*l+t*u*l+a*n*p-t*o*p)*P,e[12]=E*P,e[13]=(d*M*s-g*u*s+g*n*f-t*M*f-d*n*m+t*u*m)*P,e[14]=(g*o*s-a*M*s-g*n*c+t*M*c+a*n*m-t*o*m)*P,e[15]=(a*u*s-d*o*s+d*n*c-t*u*c-a*n*f+t*o*f)*P,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,d=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,d*o+n,d*c-s*a,0,l*c-s*o,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,d=a+a,u=o+o,f=r*l,p=r*d,g=r*u,M=a*d,m=a*u,h=o*u,v=c*l,_=c*d,b=c*u,E=n.x,T=n.y,P=n.z;return s[0]=(1-(M+h))*E,s[1]=(p+b)*E,s[2]=(g-_)*E,s[3]=0,s[4]=(p-b)*T,s[5]=(1-(f+h))*T,s[6]=(m+v)*T,s[7]=0,s[8]=(g+_)*P,s[9]=(m-v)*P,s[10]=(1-(f+M))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Ii.set(s[0],s[1],s[2]).length();const a=Ii.set(s[4],s[5],s[6]).length(),o=Ii.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],fn.copy(this);const l=1/r,d=1/a,u=1/o;return fn.elements[0]*=l,fn.elements[1]*=l,fn.elements[2]*=l,fn.elements[4]*=d,fn.elements[5]*=d,fn.elements[6]*=d,fn.elements[8]*=u,fn.elements[9]*=u,fn.elements[10]*=u,t.setFromRotationMatrix(fn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Cn,c=!1){const l=this.elements,d=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),p=(n+s)/(n-s);let g,M;if(c)g=r/(a-r),M=a*r/(a-r);else if(o===Cn)g=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===Cr)g=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=M,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Cn,c=!1){const l=this.elements,d=2/(t-e),u=2/(n-s),f=-(t+e)/(t-e),p=-(n+s)/(n-s);let g,M;if(c)g=1/(a-r),M=a/(a-r);else if(o===Cn)g=-2/(a-r),M=-(a+r)/(a-r);else if(o===Cr)g=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=d,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=M,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ii=new D,fn=new lt,jd=new D(0,0,0),Qd=new D(1,1,1),Zn=new D,$s=new D,jt=new D,gc=new lt,_c=new Xn;class Sn{constructor(e=0,t=0,n=0,s=Sn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],d=s[9],u=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Qe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Qe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Qe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Qe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Qe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,p),this._y=0);break;default:qe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return gc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(gc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return _c.setFromEuler(this),this.setFromQuaternion(_c,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Sn.DEFAULT_ORDER="XYZ";class No{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let eu=0;const vc=new D,Ui=new Xn,Fn=new lt,Zs=new D,us=new D,tu=new D,nu=new Xn,Mc=new D(1,0,0),Sc=new D(0,1,0),yc=new D(0,0,1),bc={type:"added"},iu={type:"removed"},Ni={type:"childadded",child:null},Jr={type:"childremoved",child:null};class Lt extends ss{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:eu++}),this.uuid=wi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Lt.DEFAULT_UP.clone();const e=new D,t=new Sn,n=new Xn,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new lt},normalMatrix:{value:new $e}}),this.matrix=new lt,this.matrixWorld=new lt,this.matrixAutoUpdate=Lt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new No,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ui.setFromAxisAngle(e,t),this.quaternion.multiply(Ui),this}rotateOnWorldAxis(e,t){return Ui.setFromAxisAngle(e,t),this.quaternion.premultiply(Ui),this}rotateX(e){return this.rotateOnAxis(Mc,e)}rotateY(e){return this.rotateOnAxis(Sc,e)}rotateZ(e){return this.rotateOnAxis(yc,e)}translateOnAxis(e,t){return vc.copy(e).applyQuaternion(this.quaternion),this.position.add(vc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Mc,e)}translateY(e){return this.translateOnAxis(Sc,e)}translateZ(e){return this.translateOnAxis(yc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Fn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Zs.copy(e):Zs.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fn.lookAt(us,Zs,this.up):Fn.lookAt(Zs,us,this.up),this.quaternion.setFromRotationMatrix(Fn),s&&(Fn.extractRotation(s.matrixWorld),Ui.setFromRotationMatrix(Fn),this.quaternion.premultiply(Ui.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Pt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(bc),Ni.child=e,this.dispatchEvent(Ni),Ni.child=null):Pt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(iu),Jr.child=e,this.dispatchEvent(Jr),Jr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Fn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(bc),Ni.child=e,this.dispatchEvent(Ni),Ni.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,e,tu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(us,nu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,d=c.length;l<d;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),d=a(e.images),u=a(e.shapes),f=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const d=o[l];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Lt.DEFAULT_UP=new D(0,1,0);Lt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Lt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const pn=new D,On=new D,jr=new D,Bn=new D,Fi=new D,Oi=new D,wc=new D,Qr=new D,ea=new D,ta=new D,na=new _t,ia=new _t,sa=new _t;class gn{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),pn.subVectors(e,t),s.cross(pn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){pn.subVectors(s,t),On.subVectors(n,t),jr.subVectors(e,t);const a=pn.dot(pn),o=pn.dot(On),c=pn.dot(jr),l=On.dot(On),d=On.dot(jr),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(l*c-o*d)*f,g=(a*d-o*c)*f;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Bn)===null?!1:Bn.x>=0&&Bn.y>=0&&Bn.x+Bn.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,Bn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Bn.x),c.addScaledVector(a,Bn.y),c.addScaledVector(o,Bn.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return na.setScalar(0),ia.setScalar(0),sa.setScalar(0),na.fromBufferAttribute(e,t),ia.fromBufferAttribute(e,n),sa.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(na,r.x),a.addScaledVector(ia,r.y),a.addScaledVector(sa,r.z),a}static isFrontFacing(e,t,n,s){return pn.subVectors(n,t),On.subVectors(e,t),pn.cross(On).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return pn.subVectors(this.c,this.b),On.subVectors(this.a,this.b),pn.cross(On).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return gn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return gn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Fi.subVectors(s,n),Oi.subVectors(r,n),Qr.subVectors(e,n);const c=Fi.dot(Qr),l=Oi.dot(Qr);if(c<=0&&l<=0)return t.copy(n);ea.subVectors(e,s);const d=Fi.dot(ea),u=Oi.dot(ea);if(d>=0&&u<=d)return t.copy(s);const f=c*u-d*l;if(f<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(n).addScaledVector(Fi,a);ta.subVectors(e,r);const p=Fi.dot(ta),g=Oi.dot(ta);if(g>=0&&p<=g)return t.copy(r);const M=p*l-c*g;if(M<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(Oi,o);const m=d*g-p*u;if(m<=0&&u-d>=0&&p-g>=0)return wc.subVectors(r,s),o=(u-d)/(u-d+(p-g)),t.copy(s).addScaledVector(wc,o);const h=1/(m+M+f);return a=M*h,o=f*h,t.copy(n).addScaledVector(Fi,a).addScaledVector(Oi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const jl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Kn={h:0,s:0,l:0},Ks={h:0,s:0,l:0};function ra(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class He{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,st.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=st.workingColorSpace){return this.r=e,this.g=t,this.b=n,st.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=st.workingColorSpace){if(e=Do(e,1),t=Qe(t,0,1),n=Qe(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=ra(a,r,e+1/3),this.g=ra(a,r,e),this.b=ra(a,r,e-1/3)}return st.colorSpaceToWorking(this,s),this}setStyle(e,t=bt){function n(r){r!==void 0&&parseFloat(r)<1&&qe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:qe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);qe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=bt){const n=jl[e.toLowerCase()];return n!==void 0?this.setHex(n,t):qe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Hn(e.r),this.g=Hn(e.g),this.b=Hn(e.b),this}copyLinearToSRGB(e){return this.r=$i(e.r),this.g=$i(e.g),this.b=$i(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=bt){return st.workingToColorSpace(Vt.copy(this),e),Math.round(Qe(Vt.r*255,0,255))*65536+Math.round(Qe(Vt.g*255,0,255))*256+Math.round(Qe(Vt.b*255,0,255))}getHexString(e=bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=st.workingColorSpace){st.workingToColorSpace(Vt.copy(this),t);const n=Vt.r,s=Vt.g,r=Vt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const d=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=d<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=d,e}getRGB(e,t=st.workingColorSpace){return st.workingToColorSpace(Vt.copy(this),t),e.r=Vt.r,e.g=Vt.g,e.b=Vt.b,e}getStyle(e=bt){st.workingToColorSpace(Vt.copy(this),e);const t=Vt.r,n=Vt.g,s=Vt.b;return e!==bt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Kn),this.setHSL(Kn.h+e,Kn.s+t,Kn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Kn),e.getHSL(Ks);const n=ws(Kn.h,Ks.h,t),s=ws(Kn.s,Ks.s,t),r=ws(Kn.l,Ks.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Vt=new He;He.NAMES=jl;let su=0;class Ei extends ss{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:su++}),this.uuid=wi(),this.name="",this.type="Material",this.blending=qi,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ta,this.blendDst=Ea,this.blendEquation=xi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new He(0,0,0),this.blendAlpha=0,this.depthFunc=Zi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ci,this.stencilZFail=Ci,this.stencilZPass=Ci,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){qe(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){qe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==qi&&(n.blending=this.blending),this.side!==si&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ta&&(n.blendSrc=this.blendSrc),this.blendDst!==Ea&&(n.blendDst=this.blendDst),this.blendEquation!==xi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Zi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==cc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ci&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ci&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ci&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class wt extends Ei{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new He(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=So,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Nt=new D,Js=new ge;let ru=0;class Mn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ru++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=lc,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Js.fromBufferAttribute(this,t),Js.applyMatrix3(e),this.setXY(t,Js.x,Js.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyMatrix3(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyMatrix4(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyNormalMatrix(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.transformDirection(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Wi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=qt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Wi(t,this.array)),t}setX(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Wi(t,this.array)),t}setY(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Wi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Wi(t,this.array)),t}setW(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),n=qt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),n=qt(n,this.array),s=qt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),n=qt(n,this.array),s=qt(s,this.array),r=qt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==lc&&(e.usage=this.usage),e}}class Ql extends Mn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class eh extends Mn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class rt extends Mn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let au=0;const an=new lt,aa=new Lt,Bi=new D,Qt=new Ti,fs=new Ti,Bt=new D;class It extends ss{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:au++}),this.uuid=wi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Kl(e)?eh:Ql)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new $e().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return an.makeRotationFromQuaternion(e),this.applyMatrix4(an),this}rotateX(e){return an.makeRotationX(e),this.applyMatrix4(an),this}rotateY(e){return an.makeRotationY(e),this.applyMatrix4(an),this}rotateZ(e){return an.makeRotationZ(e),this.applyMatrix4(an),this}translate(e,t,n){return an.makeTranslation(e,t,n),this.applyMatrix4(an),this}scale(e,t,n){return an.makeScale(e,t,n),this.applyMatrix4(an),this}lookAt(e){return aa.lookAt(e),aa.updateMatrix(),this.applyMatrix4(aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bi).negate(),this.translate(Bi.x,Bi.y,Bi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new rt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&qe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ti);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Pt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Qt.setFromBufferAttribute(r),this.morphTargetsRelative?(Bt.addVectors(this.boundingBox.min,Qt.min),this.boundingBox.expandByPoint(Bt),Bt.addVectors(this.boundingBox.max,Qt.max),this.boundingBox.expandByPoint(Bt)):(this.boundingBox.expandByPoint(Qt.min),this.boundingBox.expandByPoint(Qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Pt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new rs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Pt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const n=this.boundingSphere.center;if(Qt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];fs.setFromBufferAttribute(o),this.morphTargetsRelative?(Bt.addVectors(Qt.min,fs.min),Qt.expandByPoint(Bt),Bt.addVectors(Qt.max,fs.max),Qt.expandByPoint(Bt)):(Qt.expandByPoint(fs.min),Qt.expandByPoint(fs.max))}Qt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Bt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Bt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,d=o.count;l<d;l++)Bt.fromBufferAttribute(o,l),c&&(Bi.fromBufferAttribute(e,l),Bt.add(Bi)),s=Math.max(s,n.distanceToSquared(Bt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Pt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Pt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Mn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let A=0;A<n.count;A++)o[A]=new D,c[A]=new D;const l=new D,d=new D,u=new D,f=new ge,p=new ge,g=new ge,M=new D,m=new D;function h(A,y,x){l.fromBufferAttribute(n,A),d.fromBufferAttribute(n,y),u.fromBufferAttribute(n,x),f.fromBufferAttribute(r,A),p.fromBufferAttribute(r,y),g.fromBufferAttribute(r,x),d.sub(l),u.sub(l),p.sub(f),g.sub(f);const R=1/(p.x*g.y-g.x*p.y);isFinite(R)&&(M.copy(d).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(R),m.copy(u).multiplyScalar(p.x).addScaledVector(d,-g.x).multiplyScalar(R),o[A].add(M),o[y].add(M),o[x].add(M),c[A].add(m),c[y].add(m),c[x].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let A=0,y=v.length;A<y;++A){const x=v[A],R=x.start,I=x.count;for(let O=R,V=R+I;O<V;O+=3)h(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const _=new D,b=new D,E=new D,T=new D;function P(A){E.fromBufferAttribute(s,A),T.copy(E);const y=o[A];_.copy(y),_.sub(E.multiplyScalar(E.dot(y))).normalize(),b.crossVectors(T,y);const R=b.dot(c[A])<0?-1:1;a.setXYZW(A,_.x,_.y,_.z,R)}for(let A=0,y=v.length;A<y;++A){const x=v[A],R=x.start,I=x.count;for(let O=R,V=R+I;O<V;O+=3)P(e.getX(O+0)),P(e.getX(O+1)),P(e.getX(O+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Mn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new D,r=new D,a=new D,o=new D,c=new D,l=new D,d=new D,u=new D;if(e)for(let f=0,p=e.count;f<p;f+=3){const g=e.getX(f+0),M=e.getX(f+1),m=e.getX(f+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,M),a.fromBufferAttribute(t,m),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,M),l.fromBufferAttribute(n,m),o.add(d),c.add(d),l.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(M,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Bt.fromBufferAttribute(e,t),Bt.normalize(),e.setXYZ(t,Bt.x,Bt.y,Bt.z)}toNonIndexed(){function e(o,c){const l=o.array,d=o.itemSize,u=o.normalized,f=new l.constructor(c.length*d);let p=0,g=0;for(let M=0,m=c.length;M<m;M++){o.isInterleavedBufferAttribute?p=c[M]*o.data.stride+o.offset:p=c[M]*d;for(let h=0;h<d;h++)f[g++]=l[p++]}return new Mn(f,d,u)}if(this.index===null)return qe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new It,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let d=0,u=l.length;d<u;d++){const f=l[d],p=e(f,n);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],d=[];for(let u=0,f=l.length;u<f;u++){const p=l[u];d.push(p.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const d=s[l];this.setAttribute(l,d.clone(t))}const r=e.morphAttributes;for(const l in r){const d=[],u=r[l];for(let f=0,p=u.length;f<p;f++)d.push(u[f].clone(t));this.morphAttributes[l]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,d=a.length;l<d;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Tc=new lt,li=new Uo,js=new rs,Ec=new D,Qs=new D,er=new D,tr=new D,oa=new D,nr=new D,Ac=new D,ir=new D;class q extends Lt{constructor(e=new It,t=new wt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){nr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const d=o[c],u=r[c];d!==0&&(oa.fromBufferAttribute(u,e),a?nr.addScaledVector(oa,d):nr.addScaledVector(oa.sub(t),d))}t.add(nr)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),js.copy(n.boundingSphere),js.applyMatrix4(r),li.copy(e.ray).recast(e.near),!(js.containsPoint(li.origin)===!1&&(li.intersectSphere(js,Ec)===null||li.origin.distanceToSquared(Ec)>(e.far-e.near)**2))&&(Tc.copy(r).invert(),li.copy(e.ray).applyMatrix4(Tc),!(n.boundingBox!==null&&li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,li)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,M=f.length;g<M;g++){const m=f[g],h=a[m.materialIndex],v=Math.max(m.start,p.start),_=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let b=v,E=_;b<E;b+=3){const T=o.getX(b),P=o.getX(b+1),A=o.getX(b+2);s=sr(this,h,e,n,l,d,u,T,P,A),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),M=Math.min(o.count,p.start+p.count);for(let m=g,h=M;m<h;m+=3){const v=o.getX(m),_=o.getX(m+1),b=o.getX(m+2);s=sr(this,a,e,n,l,d,u,v,_,b),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,M=f.length;g<M;g++){const m=f[g],h=a[m.materialIndex],v=Math.max(m.start,p.start),_=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let b=v,E=_;b<E;b+=3){const T=b,P=b+1,A=b+2;s=sr(this,h,e,n,l,d,u,T,P,A),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),M=Math.min(c.count,p.start+p.count);for(let m=g,h=M;m<h;m+=3){const v=m,_=m+1,b=m+2;s=sr(this,a,e,n,l,d,u,v,_,b),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function ou(i,e,t,n,s,r,a,o){let c;if(e.side===Ht?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===si,o),c===null)return null;ir.copy(o),ir.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(ir);return l<t.near||l>t.far?null:{distance:l,point:ir.clone(),object:i}}function sr(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,Qs),i.getVertexPosition(c,er),i.getVertexPosition(l,tr);const d=ou(i,e,t,n,Qs,er,tr,Ac);if(d){const u=new D;gn.getBarycoord(Ac,Qs,er,tr,u),s&&(d.uv=gn.getInterpolatedAttribute(s,o,c,l,u,new ge)),r&&(d.uv1=gn.getInterpolatedAttribute(r,o,c,l,u,new ge)),a&&(d.normal=gn.getInterpolatedAttribute(a,o,c,l,u,new D),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new D,materialIndex:0};gn.getNormal(Qs,er,tr,f.normal),d.face=f,d.barycoord=u}return d}class ze extends It{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],d=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new rt(l,3)),this.setAttribute("normal",new rt(d,3)),this.setAttribute("uv",new rt(u,2));function g(M,m,h,v,_,b,E,T,P,A,y){const x=b/P,R=E/A,I=b/2,O=E/2,V=T/2,Y=P+1,H=A+1;let Q=0,W=0;const he=new D;for(let de=0;de<H;de++){const Pe=de*R-O;for(let je=0;je<Y;je++){const it=je*x-I;he[M]=it*v,he[m]=Pe*_,he[h]=V,l.push(he.x,he.y,he.z),he[M]=0,he[m]=0,he[h]=T>0?1:-1,d.push(he.x,he.y,he.z),u.push(je/P),u.push(1-de/A),Q+=1}}for(let de=0;de<A;de++)for(let Pe=0;Pe<P;Pe++){const je=f+Pe+Y*de,it=f+Pe+Y*(de+1),pt=f+(Pe+1)+Y*(de+1),mt=f+(Pe+1)+Y*de;c.push(je,it,mt),c.push(it,pt,mt),W+=6}o.addGroup(p,W,y),p+=W,f+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ze(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Qi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(qe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Yt(i){const e={};for(let t=0;t<i.length;t++){const n=Qi(i[t]);for(const s in n)e[s]=n[s]}return e}function cu(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function th(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:st.workingColorSpace}const Ns={clone:Qi,merge:Yt};var lu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,hu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gt extends Ei{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lu,this.fragmentShader=hu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Qi(e.uniforms),this.uniformsGroups=cu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class nh extends Lt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new lt,this.projectionMatrix=new lt,this.projectionMatrixInverse=new lt,this.coordinateSystem=Cn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Jn=new D,Cc=new ge,Rc=new ge;class en extends nh{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Us*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(bs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Us*2*Math.atan(Math.tan(bs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Jn.x,Jn.y).multiplyScalar(-e/Jn.z),Jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Jn.x,Jn.y).multiplyScalar(-e/Jn.z)}getViewSize(e,t){return this.getViewBounds(e,Cc,Rc),t.subVectors(Rc,Cc)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(bs*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const zi=-90,Vi=1;class du extends Lt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new en(zi,Vi,e,t);s.layers=this.layers,this.add(s);const r=new en(zi,Vi,e,t);r.layers=this.layers,this.add(r);const a=new en(zi,Vi,e,t);a.layers=this.layers,this.add(a);const o=new en(zi,Vi,e,t);o.layers=this.layers,this.add(o);const c=new en(zi,Vi,e,t);c.layers=this.layers,this.add(c);const l=new en(zi,Vi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===Cn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Cr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,d]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(u,f,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class ih extends Wt{constructor(e=[],t=Ki,n,s,r,a,o,c,l,d){super(e,t,n,s,r,a,o,c,l,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class uu extends vn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ih(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ze(5,5,5),r=new Gt({name:"CubemapFromEquirect",uniforms:Qi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ht,blending:Rn});r.uniforms.tEquirect.value=t;const a=new q(s,r),o=t.minFilter;return t.minFilter===_i&&(t.minFilter=ln),new du(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class ot extends Lt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const fu={type:"move"};class ca{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ot,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ot,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ot,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const M of e.hand.values()){const m=t.getJointPose(M,n),h=this._getHandJoint(l,M);m!==null&&(h.matrix.fromArray(m.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=m.radius),h.visible=m!==null}const d=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=d.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&f>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(fu)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new ot;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Fo{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new He(e),this.near=t,this.far=n}clone(){return new Fo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class sh extends Lt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sn,this.environmentIntensity=1,this.environmentRotation=new Sn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class rh extends Wt{constructor(e=null,t=1,n=1,s,r,a,o,c,l=nn,d=nn,u,f){super(null,a,o,c,l,d,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Pc extends Mn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ki=new lt,Lc=new lt,rr=[],Dc=new Ti,pu=new lt,ps=new q,ms=new rs;class cn extends q{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Pc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,pu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ti),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ki),Dc.copy(e.boundingBox).applyMatrix4(ki),this.boundingBox.union(Dc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new rs),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ki),ms.copy(e.boundingSphere).applyMatrix4(ki),this.boundingSphere.union(ms)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(ps.geometry=this.geometry,ps.material=this.material,ps.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ms.copy(this.boundingSphere),ms.applyMatrix4(n),e.ray.intersectsSphere(ms)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ki),Lc.multiplyMatrices(n,ki),ps.matrixWorld=Lc,ps.raycast(e,rr);for(let a=0,o=rr.length;a<o;a++){const c=rr[a];c.instanceId=r,c.object=this,t.push(c)}rr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Pc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new rh(new Float32Array(s*this.count),s,this.count,Eo,An));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const la=new D,mu=new D,xu=new $e;class pi{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=la.subVectors(n,t).cross(mu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(la),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||xu.getNormalMatrix(e),s=this.coplanarPoint(la).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const hi=new rs,gu=new ge(.5,.5),ar=new D;class Oo{constructor(e=new pi,t=new pi,n=new pi,s=new pi,r=new pi,a=new pi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Cn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],d=r[4],u=r[5],f=r[6],p=r[7],g=r[8],M=r[9],m=r[10],h=r[11],v=r[12],_=r[13],b=r[14],E=r[15];if(s[0].setComponents(l-a,p-d,h-g,E-v).normalize(),s[1].setComponents(l+a,p+d,h+g,E+v).normalize(),s[2].setComponents(l+o,p+u,h+M,E+_).normalize(),s[3].setComponents(l-o,p-u,h-M,E-_).normalize(),n)s[4].setComponents(c,f,m,b).normalize(),s[5].setComponents(l-c,p-f,h-m,E-b).normalize();else if(s[4].setComponents(l-c,p-f,h-m,E-b).normalize(),t===Cn)s[5].setComponents(l+c,p+f,h+m,E+b).normalize();else if(t===Cr)s[5].setComponents(c,f,m,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),hi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),hi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(hi)}intersectsSprite(e){hi.center.set(0,0,0);const t=gu.distanceTo(e.center);return hi.radius=.7071067811865476+t,hi.applyMatrix4(e.matrixWorld),this.intersectsSphere(hi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(ar.x=s.normal.x>0?e.max.x:e.min.x,ar.y=s.normal.y>0?e.max.y:e.min.y,ar.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ar)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class uo extends Ei{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new He(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Pr=new D,Lr=new D,Ic=new lt,xs=new Uo,or=new rs,ha=new D,Uc=new D;class Nc extends Lt{constructor(e=new It,t=new uo){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Pr.fromBufferAttribute(t,s-1),Lr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Pr.distanceTo(Lr);e.setAttribute("lineDistance",new rt(n,1))}else qe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),or.copy(n.boundingSphere),or.applyMatrix4(s),or.radius+=r,e.ray.intersectsSphere(or)===!1)return;Ic.copy(s).invert(),xs.copy(e.ray).applyMatrix4(Ic);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,d=n.index,f=n.attributes.position;if(d!==null){const p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let M=p,m=g-1;M<m;M+=l){const h=d.getX(M),v=d.getX(M+1),_=cr(this,e,xs,c,h,v,M);_&&t.push(_)}if(this.isLineLoop){const M=d.getX(g-1),m=d.getX(p),h=cr(this,e,xs,c,M,m,g-1);h&&t.push(h)}}else{const p=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let M=p,m=g-1;M<m;M+=l){const h=cr(this,e,xs,c,M,M+1,M);h&&t.push(h)}if(this.isLineLoop){const M=cr(this,e,xs,c,g-1,p,g-1);M&&t.push(M)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function cr(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Pr.fromBufferAttribute(o,s),Lr.fromBufferAttribute(o,r),t.distanceSqToSegment(Pr,Lr,ha,Uc)>n)return;ha.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(ha);if(!(l<e.near||l>e.far))return{distance:l,point:Uc.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class bn extends Wt{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ah extends Wt{constructor(e,t,n=Si,s,r,a,o=nn,c=nn,l,d=Ls,u=1){if(d!==Ls&&d!==Ds)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:u};super(f,s,r,a,o,c,d,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Io(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class oh extends Wt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class yn extends It{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new D,d=new ge;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){const p=n+u/t*s;l.x=e*Math.cos(p),l.y=e*Math.sin(p),a.push(l.x,l.y,l.z),o.push(0,0,1),d.x=(a[f]/e+1)/2,d.y=(a[f+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new rt(a,3)),this.setAttribute("normal",new rt(o,3)),this.setAttribute("uv",new rt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yn(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ft extends It{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],f=[],p=[];let g=0;const M=[],m=n/2;let h=0;v(),a===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(d),this.setAttribute("position",new rt(u,3)),this.setAttribute("normal",new rt(f,3)),this.setAttribute("uv",new rt(p,2));function v(){const b=new D,E=new D;let T=0;const P=(t-e)/n;for(let A=0;A<=r;A++){const y=[],x=A/r,R=x*(t-e)+e;for(let I=0;I<=s;I++){const O=I/s,V=O*c+o,Y=Math.sin(V),H=Math.cos(V);E.x=R*Y,E.y=-x*n+m,E.z=R*H,u.push(E.x,E.y,E.z),b.set(Y,P,H).normalize(),f.push(b.x,b.y,b.z),p.push(O,1-x),y.push(g++)}M.push(y)}for(let A=0;A<s;A++)for(let y=0;y<r;y++){const x=M[y][A],R=M[y+1][A],I=M[y+1][A+1],O=M[y][A+1];(e>0||y!==0)&&(d.push(x,R,O),T+=3),(t>0||y!==r-1)&&(d.push(R,I,O),T+=3)}l.addGroup(h,T,0),h+=T}function _(b){const E=g,T=new ge,P=new D;let A=0;const y=b===!0?e:t,x=b===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,m*x,0),f.push(0,x,0),p.push(.5,.5),g++;const R=g;for(let I=0;I<=s;I++){const V=I/s*c+o,Y=Math.cos(V),H=Math.sin(V);P.x=y*H,P.y=m*x,P.z=y*Y,u.push(P.x,P.y,P.z),f.push(0,x,0),T.x=Y*.5+.5,T.y=H*.5*x+.5,p.push(T.x,T.y),g++}for(let I=0;I<s;I++){const O=E+I,V=R+I;b===!0?d.push(V,V+1,O):d.push(V+1,V,O),A+=3}l.addGroup(h,A,b===!0?1:2),h+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ft(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ii extends ft{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new ii(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Nr extends It{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],a=[];o(s),l(n),d(),this.setAttribute("position",new rt(r,3)),this.setAttribute("normal",new rt(r.slice(),3)),this.setAttribute("uv",new rt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const _=new D,b=new D,E=new D;for(let T=0;T<t.length;T+=3)p(t[T+0],_),p(t[T+1],b),p(t[T+2],E),c(_,b,E,v)}function c(v,_,b,E){const T=E+1,P=[];for(let A=0;A<=T;A++){P[A]=[];const y=v.clone().lerp(b,A/T),x=_.clone().lerp(b,A/T),R=T-A;for(let I=0;I<=R;I++)I===0&&A===T?P[A][I]=y:P[A][I]=y.clone().lerp(x,I/R)}for(let A=0;A<T;A++)for(let y=0;y<2*(T-A)-1;y++){const x=Math.floor(y/2);y%2===0?(f(P[A][x+1]),f(P[A+1][x]),f(P[A][x])):(f(P[A][x+1]),f(P[A+1][x+1]),f(P[A+1][x]))}}function l(v){const _=new D;for(let b=0;b<r.length;b+=3)_.x=r[b+0],_.y=r[b+1],_.z=r[b+2],_.normalize().multiplyScalar(v),r[b+0]=_.x,r[b+1]=_.y,r[b+2]=_.z}function d(){const v=new D;for(let _=0;_<r.length;_+=3){v.x=r[_+0],v.y=r[_+1],v.z=r[_+2];const b=m(v)/2/Math.PI+.5,E=h(v)/Math.PI+.5;a.push(b,1-E)}g(),u()}function u(){for(let v=0;v<a.length;v+=6){const _=a[v+0],b=a[v+2],E=a[v+4],T=Math.max(_,b,E),P=Math.min(_,b,E);T>.9&&P<.1&&(_<.2&&(a[v+0]+=1),b<.2&&(a[v+2]+=1),E<.2&&(a[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function p(v,_){const b=v*3;_.x=e[b+0],_.y=e[b+1],_.z=e[b+2]}function g(){const v=new D,_=new D,b=new D,E=new D,T=new ge,P=new ge,A=new ge;for(let y=0,x=0;y<r.length;y+=9,x+=6){v.set(r[y+0],r[y+1],r[y+2]),_.set(r[y+3],r[y+4],r[y+5]),b.set(r[y+6],r[y+7],r[y+8]),T.set(a[x+0],a[x+1]),P.set(a[x+2],a[x+3]),A.set(a[x+4],a[x+5]),E.copy(v).add(_).add(b).divideScalar(3);const R=m(E);M(T,x+0,v,R),M(P,x+2,_,R),M(A,x+4,b,R)}}function M(v,_,b,E){E<0&&v.x===1&&(a[_]=v.x-1),b.x===0&&b.z===0&&(a[_]=E/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function h(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nr(e.vertices,e.indices,e.radius,e.details)}}class Bo extends Nr{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Bo(e.radius,e.detail)}}class In{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){qe("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const d=n[s],f=n[s+1]-d,p=(a-d)/f;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new ge:new D);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new D,s=[],r=[],a=[],o=new D,c=new lt;for(let p=0;p<=e;p++){const g=p/e;s[p]=this.getTangentAt(g,new D)}r[0]=new D,a[0]=new D;let l=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);d<=l&&(l=d,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(s[p-1],s[p]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Qe(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(o,g))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Qe(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class zo extends In{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new ge){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,p=l-this.aY;c=f*d-p*u+this.aX,l=f*u+p*d+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class _u extends zo{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Vo(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,d,u){let f=(a-r)/l-(o-r)/(l+d)+(o-a)/d,p=(o-a)/d-(c-a)/(d+u)+(c-o)/u;f*=d,p*=d,s(a,o,f,p)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const lr=new D,da=new Vo,ua=new Vo,fa=new Vo;class vu extends In{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new D){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,d;this.closed||o>0?l=s[(o-1)%r]:(lr.subVectors(s[0],s[1]).add(s[0]),l=lr);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(lr.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=lr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),p),M=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(d),p);M<1e-4&&(M=1),g<1e-4&&(g=M),m<1e-4&&(m=M),da.initNonuniformCatmullRom(l.x,u.x,f.x,d.x,g,M,m),ua.initNonuniformCatmullRom(l.y,u.y,f.y,d.y,g,M,m),fa.initNonuniformCatmullRom(l.z,u.z,f.z,d.z,g,M,m)}else this.curveType==="catmullrom"&&(da.initCatmullRom(l.x,u.x,f.x,d.x,this.tension),ua.initCatmullRom(l.y,u.y,f.y,d.y,this.tension),fa.initCatmullRom(l.z,u.z,f.z,d.z,this.tension));return n.set(da.calc(c),ua.calc(c),fa.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new D().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Fc(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function Mu(i,e){const t=1-i;return t*t*e}function Su(i,e){return 2*(1-i)*i*e}function yu(i,e){return i*i*e}function Ts(i,e,t,n){return Mu(i,e)+Su(i,t)+yu(i,n)}function bu(i,e){const t=1-i;return t*t*t*e}function wu(i,e){const t=1-i;return 3*t*t*i*e}function Tu(i,e){return 3*(1-i)*i*i*e}function Eu(i,e){return i*i*i*e}function Es(i,e,t,n,s){return bu(i,e)+wu(i,t)+Tu(i,n)+Eu(i,s)}class ch extends In{constructor(e=new ge,t=new ge,n=new ge,s=new ge){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ge){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Es(e,s.x,r.x,a.x,o.x),Es(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Au extends In{constructor(e=new D,t=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new D){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Es(e,s.x,r.x,a.x,o.x),Es(e,s.y,r.y,a.y,o.y),Es(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class lh extends In{constructor(e=new ge,t=new ge){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ge){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ge){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Cu extends In{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hh extends In{constructor(e=new ge,t=new ge,n=new ge){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ge){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Ts(e,s.x,r.x,a.x),Ts(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ru extends In{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Ts(e,s.x,r.x,a.x),Ts(e,s.y,r.y,a.y),Ts(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class dh extends In{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ge){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Fc(o,c.x,l.x,d.x,u.x),Fc(o,c.y,l.y,d.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new ge().fromArray(s))}return this}}var Oc=Object.freeze({__proto__:null,ArcCurve:_u,CatmullRomCurve3:vu,CubicBezierCurve:ch,CubicBezierCurve3:Au,EllipseCurve:zo,LineCurve:lh,LineCurve3:Cu,QuadraticBezierCurve:hh,QuadraticBezierCurve3:Ru,SplineCurve:dh});class Pu extends In{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Oc[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const d=c[l];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Oc[s.type]().fromJSON(s))}return this}}class Bc extends Pu{constructor(e){super(),this.type="Path",this.currentPoint=new ge,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new lh(this.currentPoint.clone(),new ge(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new hh(this.currentPoint.clone(),new ge(e,t),new ge(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new ch(this.currentPoint.clone(),new ge(e,t),new ge(n,s),new ge(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new dh(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){const l=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+l,t+d,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){const l=new zo(e,t,n,s,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const d=l.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class uh extends Bc{constructor(e){super(e),this.uuid=wi(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Bc().fromJSON(s))}return this}}function Lu(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=fh(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=Fu(i,e,r,t)),i.length>80*t){o=i[0],c=i[1];let d=o,u=c;for(let f=t;f<s;f+=t){const p=i[f],g=i[f+1];p<o&&(o=p),g<c&&(c=g),p>d&&(d=p),g>u&&(u=g)}l=Math.max(d-o,u-c),l=l!==0?32767/l:0}return Fs(r,a,t,o,c,l,0),a}function fh(i,e,t,n,s){let r;if(s===Yu(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=zc(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=zc(a/n|0,i[a],i[a+1],r);return r&&es(r,r.next)&&(Bs(r),r=r.next),r}function yi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(es(t,t.next)||At(t.prev,t,t.next)===0)){if(Bs(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Fs(i,e,t,n,s,r,a){if(!i)return;!a&&r&&ku(i,n,s,r);let o=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?Iu(i,n,s,r):Du(i)){e.push(c.i,i.i,l.i),Bs(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=Uu(yi(i),e),Fs(i,e,t,n,s,r,2)):a===2&&Nu(i,e,t,n,s,r):Fs(yi(i),e,t,n,s,r,1);break}}}function Du(i){const e=i.prev,t=i,n=i.next;if(At(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,d=Math.min(s,r,a),u=Math.min(o,c,l),f=Math.max(s,r,a),p=Math.max(o,c,l);let g=n.next;for(;g!==e;){if(g.x>=d&&g.x<=f&&g.y>=u&&g.y<=p&&Ms(s,o,r,c,a,l,g.x,g.y)&&At(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Iu(i,e,t,n){const s=i.prev,r=i,a=i.next;if(At(s,r,a)>=0)return!1;const o=s.x,c=r.x,l=a.x,d=s.y,u=r.y,f=a.y,p=Math.min(o,c,l),g=Math.min(d,u,f),M=Math.max(o,c,l),m=Math.max(d,u,f),h=fo(p,g,e,t,n),v=fo(M,m,e,t,n);let _=i.prevZ,b=i.nextZ;for(;_&&_.z>=h&&b&&b.z<=v;){if(_.x>=p&&_.x<=M&&_.y>=g&&_.y<=m&&_!==s&&_!==a&&Ms(o,d,c,u,l,f,_.x,_.y)&&At(_.prev,_,_.next)>=0||(_=_.prevZ,b.x>=p&&b.x<=M&&b.y>=g&&b.y<=m&&b!==s&&b!==a&&Ms(o,d,c,u,l,f,b.x,b.y)&&At(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;_&&_.z>=h;){if(_.x>=p&&_.x<=M&&_.y>=g&&_.y<=m&&_!==s&&_!==a&&Ms(o,d,c,u,l,f,_.x,_.y)&&At(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=M&&b.y>=g&&b.y<=m&&b!==s&&b!==a&&Ms(o,d,c,u,l,f,b.x,b.y)&&At(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Uu(i,e){let t=i;do{const n=t.prev,s=t.next.next;!es(n,s)&&mh(n,t,t.next,s)&&Os(n,s)&&Os(s,n)&&(e.push(n.i,t.i,s.i),Bs(t),Bs(t.next),t=i=s),t=t.next}while(t!==i);return yi(t)}function Nu(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Wu(a,o)){let c=xh(a,o);a=yi(a,a.next),c=yi(c,c.next),Fs(a,e,t,n,s,r,0),Fs(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Fu(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=fh(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Hu(l))}s.sort(Ou);for(let r=0;r<s.length;r++)t=Bu(s[r],t);return t}function Ou(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Bu(i,e){const t=zu(i,e);if(!t)return e;const n=xh(t,i);return yi(n,n.next),yi(t,t.next)}function zu(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(es(i,t))return t;do{if(es(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,c=a.x,l=a.y;let d=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&ph(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){const u=Math.abs(s-t.y)/(n-t.x);Os(t,i)&&(u<d||u===d&&(t.x>a.x||t.x===a.x&&Vu(a,t)))&&(a=t,d=u)}t=t.next}while(t!==o);return a}function Vu(i,e){return At(i.prev,i,e.prev)<0&&At(e.next,i,i.next)<0}function ku(i,e,t,n){let s=i;do s.z===0&&(s.z=fo(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Gu(s)}function Gu(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function fo(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Hu(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function ph(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function Ms(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&ph(i,e,t,n,s,r,a,o)}function Wu(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Xu(i,e)&&(Os(i,e)&&Os(e,i)&&qu(i,e)&&(At(i.prev,i,e.prev)||At(i,e.prev,e))||es(i,e)&&At(i.prev,i,i.next)>0&&At(e.prev,e,e.next)>0)}function At(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function es(i,e){return i.x===e.x&&i.y===e.y}function mh(i,e,t,n){const s=dr(At(i,e,t)),r=dr(At(i,e,n)),a=dr(At(t,n,i)),o=dr(At(t,n,e));return!!(s!==r&&a!==o||s===0&&hr(i,t,e)||r===0&&hr(i,n,e)||a===0&&hr(t,i,n)||o===0&&hr(t,e,n))}function hr(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function dr(i){return i>0?1:i<0?-1:0}function Xu(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&mh(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Os(i,e){return At(i.prev,i,i.next)<0?At(i,e,i.next)>=0&&At(i,i.prev,e)>=0:At(i,e,i.prev)<0||At(i,i.next,e)<0}function qu(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function xh(i,e){const t=po(i.i,i.x,i.y),n=po(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function zc(i,e,t,n){const s=po(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Bs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function po(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Yu(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class $u{static triangulate(e,t,n=2){return Lu(e,t,n)}}class As{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return As.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];Vc(e),kc(n,e);let a=e.length;t.forEach(Vc);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,kc(n,t[c]);const o=$u.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function Vc(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function kc(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class ko extends Nr{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ko(e.radius,e.detail)}}class Dt extends It{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,d=c+1,u=e/o,f=t/c,p=[],g=[],M=[],m=[];for(let h=0;h<d;h++){const v=h*f-a;for(let _=0;_<l;_++){const b=_*u-r;g.push(b,-v,0),M.push(0,0,1),m.push(_/o),m.push(1-h/c)}}for(let h=0;h<c;h++)for(let v=0;v<o;v++){const _=v+l*h,b=v+l*(h+1),E=v+1+l*(h+1),T=v+1+l*h;p.push(_,b,T),p.push(b,E,T)}this.setIndex(p),this.setAttribute("position",new rt(g,3)),this.setAttribute("normal",new rt(M,3)),this.setAttribute("uv",new rt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Dt(e.width,e.height,e.widthSegments,e.heightSegments)}}class Go extends It{constructor(e=new uh([new ge(0,.5),new ge(-.5,-.5),new ge(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],a=[];let o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let d=0;d<e.length;d++)l(e[d]),this.addGroup(o,c,d),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new rt(s,3)),this.setAttribute("normal",new rt(r,3)),this.setAttribute("uv",new rt(a,2));function l(d){const u=s.length/3,f=d.extractPoints(t);let p=f.shape;const g=f.holes;As.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,h=g.length;m<h;m++){const v=g[m];As.isClockWise(v)===!0&&(g[m]=v.reverse())}const M=As.triangulateShape(p,g);for(let m=0,h=g.length;m<h;m++){const v=g[m];p=p.concat(v)}for(let m=0,h=p.length;m<h;m++){const v=p[m];s.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let m=0,h=M.length;m<h;m++){const v=M[m],_=v[0]+u,b=v[1]+u,E=v[2]+u;n.push(_,b,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Zu(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];n.push(a)}return new Go(n,e.curveSegments)}}function Zu(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class tn extends It{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const d=[],u=new D,f=new D,p=[],g=[],M=[],m=[];for(let h=0;h<=n;h++){const v=[],_=h/n;let b=0;h===0&&a===0?b=.5/t:h===n&&c===Math.PI&&(b=-.5/t);for(let E=0;E<=t;E++){const T=E/t;u.x=-e*Math.cos(s+T*r)*Math.sin(a+_*o),u.y=e*Math.cos(a+_*o),u.z=e*Math.sin(s+T*r)*Math.sin(a+_*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),M.push(f.x,f.y,f.z),m.push(T+b,1-_),v.push(l++)}d.push(v)}for(let h=0;h<n;h++)for(let v=0;v<t;v++){const _=d[h][v+1],b=d[h][v],E=d[h+1][v],T=d[h+1][v+1];(h!==0||a>0)&&p.push(_,b,T),(h!==n-1||c<Math.PI)&&p.push(b,E,T)}this.setIndex(p),this.setAttribute("position",new rt(g,3)),this.setAttribute("normal",new rt(M,3)),this.setAttribute("uv",new rt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tn(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class zs extends It{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],d=new D,u=new D,f=new D;for(let p=0;p<=n;p++)for(let g=0;g<=s;g++){const M=g/s*r,m=p/n*Math.PI*2;u.x=(e+t*Math.cos(m))*Math.cos(M),u.y=(e+t*Math.cos(m))*Math.sin(M),u.z=t*Math.sin(m),o.push(u.x,u.y,u.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),f.subVectors(u,d).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=s;g++){const M=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,h=(s+1)*(p-1)+g,v=(s+1)*p+g;a.push(M,m,v),a.push(m,h,v)}this.setIndex(a),this.setAttribute("position",new rt(o,3)),this.setAttribute("normal",new rt(c,3)),this.setAttribute("uv",new rt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zs(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Ku extends Gt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class K extends Ei{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new He(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new He(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Lo,this.normalScale=new ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ju extends Ei{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new He(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new He(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Lo,this.normalScale=new ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=So,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ju extends Ei{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=gd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Qu extends Ei{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Ho extends Lt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new He(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class ef extends Ho{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Lt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new He(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const pa=new lt,Gc=new D,Hc=new D;class gh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ge(512,512),this.mapType=Dn,this.map=null,this.mapPass=null,this.matrix=new lt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Oo,this._frameExtents=new ge(1,1),this._viewportCount=1,this._viewports=[new _t(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Gc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Gc),Hc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Hc),t.updateMatrixWorld(),pa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(pa,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(pa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Wc=new lt,gs=new D,ma=new D;class tf extends gh{constructor(){super(new en(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ge(4,2),this._viewportCount=6,this._viewports=[new _t(2,1,1,1),new _t(0,1,1,1),new _t(3,1,1,1),new _t(1,1,1,1),new _t(3,0,1,1),new _t(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),gs.setFromMatrixPosition(e.matrixWorld),n.position.copy(gs),ma.copy(n.position),ma.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ma),n.updateMatrixWorld(),s.makeTranslation(-gs.x,-gs.y,-gs.z),Wc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wc,n.coordinateSystem,n.reversedDepth)}}class _h extends Ho{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new tf}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Wo extends nh{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=d*this.view.offsetY,c=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class nf extends gh{constructor(){super(new Wo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Xc extends Ho{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Lt.DEFAULT_UP),this.updateMatrix(),this.target=new Lt,this.shadow=new nf}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class sf extends en{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class vh{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const qc=new lt;class rf{constructor(e,t,n=0,s=1/0){this.ray=new Uo(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new No,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Pt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return qc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(qc),this}intersectObject(e,t=!0,n=[]){return mo(e,this,n,t),n.sort(Yc),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)mo(e[s],this,n,t);return n.sort(Yc),n}}function Yc(i,e){return i.distance-e.distance}function mo(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)mo(r[a],e,t,!0)}}function $c(i,e,t,n){const s=af(n);switch(t){case Yl:return i*e;case Eo:return i*e/s.components*s.byteLength;case Ao:return i*e/s.components*s.byteLength;case Co:return i*e*2/s.components*s.byteLength;case Ro:return i*e*2/s.components*s.byteLength;case $l:return i*e*3/s.components*s.byteLength;case _n:return i*e*4/s.components*s.byteLength;case Po:return i*e*4/s.components*s.byteLength;case gr:case _r:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case vr:case Mr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ba:case Va:return Math.max(i,16)*Math.max(e,8)/4;case Oa:case za:return Math.max(i,8)*Math.max(e,8)/2;case ka:case Ga:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ha:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Wa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Xa:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case qa:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ya:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case $a:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Za:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ka:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ja:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ja:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Qa:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case eo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case to:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case no:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case io:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case so:case ro:case ao:return Math.ceil(i/4)*Math.ceil(e/4)*16;case oo:case co:return Math.ceil(i/4)*Math.ceil(e/4)*8;case lo:case ho:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function af(i){switch(i){case Dn:case Hl:return{byteLength:1,components:1};case Rs:case Wl:case Pn:return{byteLength:2,components:1};case wo:case To:return{byteLength:2,components:4};case Si:case bo:case An:return{byteLength:4,components:1};case Xl:case ql:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Mo}}));typeof window<"u"&&(window.__THREE__?qe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Mo);function Mh(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function of(i){const e=new WeakMap;function t(o,c){const l=o.array,d=o.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,d),o.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const d=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,d);else{u.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<u.length;p++){const g=u[f],M=u[p];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++f,u[f]=M)}u.length=f+1;for(let p=0,g=u.length;p<g;p++){const M=u[p];i.bufferSubData(l,M.start*d.BYTES_PER_ELEMENT,d,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var cf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,lf=`#ifdef USE_ALPHAHASH
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
#endif`,hf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,df=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,uf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ff=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pf=`#ifdef USE_AOMAP
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
#endif`,mf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xf=`#ifdef USE_BATCHING
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
#endif`,gf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_f=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,vf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Sf=`#ifdef USE_IRIDESCENCE
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
#endif`,yf=`#ifdef USE_BUMPMAP
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
#endif`,bf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,wf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ef=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Af=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Rf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Pf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Lf=`#define PI 3.141592653589793
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
} // validated`,Df=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,If=`vec3 transformedNormal = objectNormal;
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
#endif`,Uf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Nf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ff=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Of=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Bf="gl_FragColor = linearToOutputTexel( gl_FragColor );",zf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Vf=`#ifdef USE_ENVMAP
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
#endif`,kf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Gf=`#ifdef USE_ENVMAP
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
#endif`,Hf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wf=`#ifdef USE_ENVMAP
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
#endif`,Xf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,qf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$f=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zf=`#ifdef USE_GRADIENTMAP
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
}`,Kf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qf=`uniform bool receiveShadow;
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
#endif`,ep=`#ifdef USE_ENVMAP
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
#endif`,tp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,np=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ip=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,sp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,rp=`PhysicalMaterial material;
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
#endif`,ap=`uniform sampler2D dfgLUT;
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
}`,op=`
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
#endif`,cp=`#if defined( RE_IndirectDiffuse )
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
#endif`,lp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,dp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,up=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,gp=`#if defined( USE_POINTS_UV )
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
#endif`,_p=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Mp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Sp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bp=`#ifdef USE_MORPHTARGETS
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
#endif`,wp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ep=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ap=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Pp=`#ifdef USE_NORMALMAP
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
#endif`,Lp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Dp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ip=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Up=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Np=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Fp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Op=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Bp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Gp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Xp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,qp=`float getShadowMask() {
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
}`,Yp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$p=`#ifdef USE_SKINNING
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
#endif`,Zp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Kp=`#ifdef USE_SKINNING
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
#endif`,Jp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,jp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,e0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,t0=`#ifdef USE_TRANSMISSION
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
#endif`,n0=`#ifdef USE_TRANSMISSION
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
#endif`,i0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,s0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,r0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,a0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const o0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,c0=`uniform sampler2D t2D;
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
}`,l0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,h0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,d0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,u0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,f0=`#include <common>
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
}`,p0=`#if DEPTH_PACKING == 3200
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
}`,m0=`#define DISTANCE
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
}`,x0=`#define DISTANCE
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
}`,g0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,v0=`uniform float scale;
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
}`,M0=`uniform vec3 diffuse;
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
}`,S0=`#include <common>
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
}`,y0=`uniform vec3 diffuse;
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
}`,b0=`#define LAMBERT
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
}`,w0=`#define LAMBERT
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
}`,T0=`#define MATCAP
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
}`,E0=`#define MATCAP
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
}`,A0=`#define NORMAL
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
}`,C0=`#define NORMAL
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
}`,R0=`#define PHONG
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
}`,P0=`#define PHONG
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
}`,L0=`#define STANDARD
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
}`,D0=`#define STANDARD
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
}`,I0=`#define TOON
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
}`,U0=`#define TOON
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
}`,N0=`uniform float size;
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
}`,F0=`uniform vec3 diffuse;
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
}`,O0=`#include <common>
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
}`,B0=`uniform vec3 color;
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
}`,z0=`uniform float rotation;
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
}`,V0=`uniform vec3 diffuse;
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
}`,Ze={alphahash_fragment:cf,alphahash_pars_fragment:lf,alphamap_fragment:hf,alphamap_pars_fragment:df,alphatest_fragment:uf,alphatest_pars_fragment:ff,aomap_fragment:pf,aomap_pars_fragment:mf,batching_pars_vertex:xf,batching_vertex:gf,begin_vertex:_f,beginnormal_vertex:vf,bsdfs:Mf,iridescence_fragment:Sf,bumpmap_pars_fragment:yf,clipping_planes_fragment:bf,clipping_planes_pars_fragment:wf,clipping_planes_pars_vertex:Tf,clipping_planes_vertex:Ef,color_fragment:Af,color_pars_fragment:Cf,color_pars_vertex:Rf,color_vertex:Pf,common:Lf,cube_uv_reflection_fragment:Df,defaultnormal_vertex:If,displacementmap_pars_vertex:Uf,displacementmap_vertex:Nf,emissivemap_fragment:Ff,emissivemap_pars_fragment:Of,colorspace_fragment:Bf,colorspace_pars_fragment:zf,envmap_fragment:Vf,envmap_common_pars_fragment:kf,envmap_pars_fragment:Gf,envmap_pars_vertex:Hf,envmap_physical_pars_fragment:ep,envmap_vertex:Wf,fog_vertex:Xf,fog_pars_vertex:qf,fog_fragment:Yf,fog_pars_fragment:$f,gradientmap_pars_fragment:Zf,lightmap_pars_fragment:Kf,lights_lambert_fragment:Jf,lights_lambert_pars_fragment:jf,lights_pars_begin:Qf,lights_toon_fragment:tp,lights_toon_pars_fragment:np,lights_phong_fragment:ip,lights_phong_pars_fragment:sp,lights_physical_fragment:rp,lights_physical_pars_fragment:ap,lights_fragment_begin:op,lights_fragment_maps:cp,lights_fragment_end:lp,logdepthbuf_fragment:hp,logdepthbuf_pars_fragment:dp,logdepthbuf_pars_vertex:up,logdepthbuf_vertex:fp,map_fragment:pp,map_pars_fragment:mp,map_particle_fragment:xp,map_particle_pars_fragment:gp,metalnessmap_fragment:_p,metalnessmap_pars_fragment:vp,morphinstance_vertex:Mp,morphcolor_vertex:Sp,morphnormal_vertex:yp,morphtarget_pars_vertex:bp,morphtarget_vertex:wp,normal_fragment_begin:Tp,normal_fragment_maps:Ep,normal_pars_fragment:Ap,normal_pars_vertex:Cp,normal_vertex:Rp,normalmap_pars_fragment:Pp,clearcoat_normal_fragment_begin:Lp,clearcoat_normal_fragment_maps:Dp,clearcoat_pars_fragment:Ip,iridescence_pars_fragment:Up,opaque_fragment:Np,packing:Fp,premultiplied_alpha_fragment:Op,project_vertex:Bp,dithering_fragment:zp,dithering_pars_fragment:Vp,roughnessmap_fragment:kp,roughnessmap_pars_fragment:Gp,shadowmap_pars_fragment:Hp,shadowmap_pars_vertex:Wp,shadowmap_vertex:Xp,shadowmask_pars_fragment:qp,skinbase_vertex:Yp,skinning_pars_vertex:$p,skinning_vertex:Zp,skinnormal_vertex:Kp,specularmap_fragment:Jp,specularmap_pars_fragment:jp,tonemapping_fragment:Qp,tonemapping_pars_fragment:e0,transmission_fragment:t0,transmission_pars_fragment:n0,uv_pars_fragment:i0,uv_pars_vertex:s0,uv_vertex:r0,worldpos_vertex:a0,background_vert:o0,background_frag:c0,backgroundCube_vert:l0,backgroundCube_frag:h0,cube_vert:d0,cube_frag:u0,depth_vert:f0,depth_frag:p0,distanceRGBA_vert:m0,distanceRGBA_frag:x0,equirect_vert:g0,equirect_frag:_0,linedashed_vert:v0,linedashed_frag:M0,meshbasic_vert:S0,meshbasic_frag:y0,meshlambert_vert:b0,meshlambert_frag:w0,meshmatcap_vert:T0,meshmatcap_frag:E0,meshnormal_vert:A0,meshnormal_frag:C0,meshphong_vert:R0,meshphong_frag:P0,meshphysical_vert:L0,meshphysical_frag:D0,meshtoon_vert:I0,meshtoon_frag:U0,points_vert:N0,points_frag:F0,shadow_vert:O0,shadow_frag:B0,sprite_vert:z0,sprite_frag:V0},ve={common:{diffuse:{value:new He(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new ge(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new He(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new He(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new He(16777215)},opacity:{value:1},center:{value:new ge(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},Tn={basic:{uniforms:Yt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:Yt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new He(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:Yt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new He(0)},specular:{value:new He(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:Yt([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new He(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:Yt([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new He(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:Yt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:Yt([ve.points,ve.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:Yt([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:Yt([ve.common,ve.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:Yt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:Yt([ve.sprite,ve.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:Yt([ve.common,ve.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:Yt([ve.lights,ve.fog,{color:{value:new He(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Tn.physical={uniforms:Yt([Tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new ge(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new He(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new ge},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new He(0)},specularColor:{value:new He(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new ge},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};const ur={r:0,b:0,g:0},di=new Sn,k0=new lt;function G0(i,e,t,n,s,r,a){const o=new He(0);let c=r===!0?0:1,l,d,u=null,f=0,p=null;function g(_){let b=_.isScene===!0?_.background:null;return b&&b.isTexture&&(b=(_.backgroundBlurriness>0?t:e).get(b)),b}function M(_){let b=!1;const E=g(_);E===null?h(o,c):E&&E.isColor&&(h(E,1),b=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(_,b){const E=g(b);E&&(E.isCubeTexture||E.mapping===Ur)?(d===void 0&&(d=new q(new ze(1,1,1),new Gt({name:"BackgroundCubeMaterial",uniforms:Qi(Tn.backgroundCube.uniforms),vertexShader:Tn.backgroundCube.vertexShader,fragmentShader:Tn.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,P,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),di.copy(b.backgroundRotation),di.x*=-1,di.y*=-1,di.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(k0.makeRotationFromEuler(di)),d.material.toneMapped=st.getTransfer(E.colorSpace)!==ht,(u!==E||f!==E.version||p!==i.toneMapping)&&(d.material.needsUpdate=!0,u=E,f=E.version,p=i.toneMapping),d.layers.enableAll(),_.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new q(new Dt(2,2),new Gt({name:"BackgroundMaterial",uniforms:Qi(Tn.background.uniforms),vertexShader:Tn.background.vertexShader,fragmentShader:Tn.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=st.getTransfer(E.colorSpace)!==ht,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||f!==E.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=E,f=E.version,p=i.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function h(_,b){_.getRGB(ur,th(i)),n.buffers.color.setClear(ur.r,ur.g,ur.b,b,a)}function v(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(_,b=1){o.set(_),c=b,h(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,h(o,c)},render:M,addToRenderList:m,dispose:v}}function H0(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,a=!1;function o(x,R,I,O,V){let Y=!1;const H=u(O,I,R);r!==H&&(r=H,l(r.object)),Y=p(x,O,I,V),Y&&g(x,O,I,V),V!==null&&e.update(V,i.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,b(x,R,I,O),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function c(){return i.createVertexArray()}function l(x){return i.bindVertexArray(x)}function d(x){return i.deleteVertexArray(x)}function u(x,R,I){const O=I.wireframe===!0;let V=n[x.id];V===void 0&&(V={},n[x.id]=V);let Y=V[R.id];Y===void 0&&(Y={},V[R.id]=Y);let H=Y[O];return H===void 0&&(H=f(c()),Y[O]=H),H}function f(x){const R=[],I=[],O=[];for(let V=0;V<t;V++)R[V]=0,I[V]=0,O[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:I,attributeDivisors:O,object:x,attributes:{},index:null}}function p(x,R,I,O){const V=r.attributes,Y=R.attributes;let H=0;const Q=I.getAttributes();for(const W in Q)if(Q[W].location>=0){const de=V[W];let Pe=Y[W];if(Pe===void 0&&(W==="instanceMatrix"&&x.instanceMatrix&&(Pe=x.instanceMatrix),W==="instanceColor"&&x.instanceColor&&(Pe=x.instanceColor)),de===void 0||de.attribute!==Pe||Pe&&de.data!==Pe.data)return!0;H++}return r.attributesNum!==H||r.index!==O}function g(x,R,I,O){const V={},Y=R.attributes;let H=0;const Q=I.getAttributes();for(const W in Q)if(Q[W].location>=0){let de=Y[W];de===void 0&&(W==="instanceMatrix"&&x.instanceMatrix&&(de=x.instanceMatrix),W==="instanceColor"&&x.instanceColor&&(de=x.instanceColor));const Pe={};Pe.attribute=de,de&&de.data&&(Pe.data=de.data),V[W]=Pe,H++}r.attributes=V,r.attributesNum=H,r.index=O}function M(){const x=r.newAttributes;for(let R=0,I=x.length;R<I;R++)x[R]=0}function m(x){h(x,0)}function h(x,R){const I=r.newAttributes,O=r.enabledAttributes,V=r.attributeDivisors;I[x]=1,O[x]===0&&(i.enableVertexAttribArray(x),O[x]=1),V[x]!==R&&(i.vertexAttribDivisor(x,R),V[x]=R)}function v(){const x=r.newAttributes,R=r.enabledAttributes;for(let I=0,O=R.length;I<O;I++)R[I]!==x[I]&&(i.disableVertexAttribArray(I),R[I]=0)}function _(x,R,I,O,V,Y,H){H===!0?i.vertexAttribIPointer(x,R,I,V,Y):i.vertexAttribPointer(x,R,I,O,V,Y)}function b(x,R,I,O){M();const V=O.attributes,Y=I.getAttributes(),H=R.defaultAttributeValues;for(const Q in Y){const W=Y[Q];if(W.location>=0){let he=V[Q];if(he===void 0&&(Q==="instanceMatrix"&&x.instanceMatrix&&(he=x.instanceMatrix),Q==="instanceColor"&&x.instanceColor&&(he=x.instanceColor)),he!==void 0){const de=he.normalized,Pe=he.itemSize,je=e.get(he);if(je===void 0)continue;const it=je.buffer,pt=je.type,mt=je.bytesPerElement,J=pt===i.INT||pt===i.UNSIGNED_INT||he.gpuType===bo;if(he.isInterleavedBufferAttribute){const ie=he.data,be=ie.stride,Ve=he.offset;if(ie.isInstancedInterleavedBuffer){for(let Le=0;Le<W.locationSize;Le++)h(W.location+Le,ie.meshPerAttribute);x.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Le=0;Le<W.locationSize;Le++)m(W.location+Le);i.bindBuffer(i.ARRAY_BUFFER,it);for(let Le=0;Le<W.locationSize;Le++)_(W.location+Le,Pe/W.locationSize,pt,de,be*mt,(Ve+Pe/W.locationSize*Le)*mt,J)}else{if(he.isInstancedBufferAttribute){for(let ie=0;ie<W.locationSize;ie++)h(W.location+ie,he.meshPerAttribute);x.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let ie=0;ie<W.locationSize;ie++)m(W.location+ie);i.bindBuffer(i.ARRAY_BUFFER,it);for(let ie=0;ie<W.locationSize;ie++)_(W.location+ie,Pe/W.locationSize,pt,de,Pe*mt,Pe/W.locationSize*ie*mt,J)}}else if(H!==void 0){const de=H[Q];if(de!==void 0)switch(de.length){case 2:i.vertexAttrib2fv(W.location,de);break;case 3:i.vertexAttrib3fv(W.location,de);break;case 4:i.vertexAttrib4fv(W.location,de);break;default:i.vertexAttrib1fv(W.location,de)}}}}v()}function E(){A();for(const x in n){const R=n[x];for(const I in R){const O=R[I];for(const V in O)d(O[V].object),delete O[V];delete R[I]}delete n[x]}}function T(x){if(n[x.id]===void 0)return;const R=n[x.id];for(const I in R){const O=R[I];for(const V in O)d(O[V].object),delete O[V];delete R[I]}delete n[x.id]}function P(x){for(const R in n){const I=n[R];if(I[x.id]===void 0)continue;const O=I[x.id];for(const V in O)d(O[V].object),delete O[V];delete I[x.id]}}function A(){y(),a=!0,r!==s&&(r=s,l(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:y,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:P,initAttributes:M,enableAttribute:m,disableUnusedAttributes:v}}function W0(i,e,t){let n;function s(l){n=l}function r(l,d){i.drawArrays(n,l,d),t.update(d,n,1)}function a(l,d,u){u!==0&&(i.drawArraysInstanced(n,l,d,u),t.update(d,n,u))}function o(l,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,d,0,u);let p=0;for(let g=0;g<u;g++)p+=d[g];t.update(p,n,1)}function c(l,d,u,f){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)a(l[g],d[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,d,0,f,0,u);let g=0;for(let M=0;M<u;M++)g+=d[M]*f[M];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function X0(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==_n&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const A=P===Pn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==Dn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==An&&!A)}function c(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const d=c(l);d!==l&&(qe("WebGLRenderer:",l,"not supported, using",d,"instead."),l=d);const u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),h=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),_=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),E=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:v,maxVaryings:_,maxFragmentUniforms:b,vertexTextures:E,maxSamples:T}}function q0(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new pi,o=new $e,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=d(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,M=u.clipIntersection,m=u.clipShadows,h=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?d(null):l();else{const v=r?0:n,_=v*4;let b=h.clippingState||null;c.value=b,b=d(g,f,_,p);for(let E=0;E!==_;++E)b[E]=t[E];h.clippingState=b,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(u,f,p,g){const M=u!==null?u.length:0;let m=null;if(M!==0){if(m=c.value,g!==!0||m===null){const h=p+M*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<h)&&(m=new Float32Array(h));for(let _=0,b=p;_!==M;++_,b+=4)a.copy(u[_]).applyMatrix4(v,o),a.normal.toArray(m,b),m[b+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,m}}function Y0(i){let e=new WeakMap;function t(a,o){return o===Ua?a.mapping=Ki:o===Na&&(a.mapping=Ji),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ua||o===Na)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new uu(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Qn=4,Zc=[.125,.215,.35,.446,.526,.582],gi=20,$0=256,_s=new Wo,Kc=new He;let xa=null,ga=0,_a=0,va=!1;const Z0=new D;class xo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Z0}=r;xa=this._renderer.getRenderTarget(),ga=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Qc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(xa,ga,_a),this._renderer.xr.enabled=va,e.scissorTest=!1,Gi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ki||e.mapping===Ji?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),xa=this._renderer.getRenderTarget(),ga=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ln,minFilter:ln,generateMipmaps:!1,type:Pn,format:_n,colorSpace:ji,depthBuffer:!1},s=Jc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Jc(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=K0(r)),this._blurMaterial=j0(r,e,t),this._ggxMaterial=J0(r,e,t)}return s}_compileMaterial(e){const t=new q(new It,e);this._renderer.compile(t,_s)}_sceneToCubeUV(e,t,n,s,r){const c=new en(90,1,t,n),l=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(Kc),u.toneMapping=ni,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new q(new ze,new wt({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,m=M.material;let h=!1;const v=e.background;v?v.isColor&&(m.color.copy(v),e.background=null,h=!0):(m.color.copy(Kc),h=!0);for(let _=0;_<6;_++){const b=_%3;b===0?(c.up.set(0,l[_],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[_],r.y,r.z)):b===1?(c.up.set(0,0,l[_]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[_],r.z)):(c.up.set(0,l[_],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[_]));const E=this._cubeSize;Gi(s,b*E,_>2?E:0,E,E),u.setRenderTarget(s),h&&u.render(M,c),u.render(e,c)}u.toneMapping=p,u.autoClear=f,e.background=v}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Ki||e.mapping===Ji;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Qc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Gi(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,_s)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),u=Math.sqrt(l*l-d*d),f=.05+l*.95,p=u*f,{_lodMax:g}=this,M=this._sizeLods[n],m=3*M*(n>g-Qn?n-g+Qn:0),h=4*(this._cubeSize-M);c.envMap.value=e.texture,c.roughness.value=p,c.mipInt.value=g-t,Gi(r,m,h,3*M,2*M),s.setRenderTarget(r),s.render(o,_s),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,Gi(e,m,h,3*M,2*M),s.setRenderTarget(e),s.render(o,_s)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Pt("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[s];u.material=l;const f=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*gi-1),M=r/g,m=isFinite(r)?1+Math.floor(d*M):gi;m>gi&&qe(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${gi}`);const h=[];let v=0;for(let P=0;P<gi;++P){const A=P/M,y=Math.exp(-A*A/2);h.push(y),P===0?v+=y:P<m&&(v+=2*y)}for(let P=0;P<h.length;P++)h[P]=h[P]/v;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=h,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:_}=this;f.dTheta.value=g,f.mipInt.value=_-n;const b=this._sizeLods[s],E=3*b*(s>_-Qn?s-_+Qn:0),T=4*(this._cubeSize-b);Gi(t,E,T,3*b,2*b),c.setRenderTarget(t),c.render(u,_s)}}function K0(i){const e=[],t=[],n=[];let s=i;const r=i-Qn+1+Zc.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-Qn?c=Zc[a-i+Qn-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),d=-l,u=1+l,f=[d,d,u,d,u,u,d,d,u,u,d,u],p=6,g=6,M=3,m=2,h=1,v=new Float32Array(M*g*p),_=new Float32Array(m*g*p),b=new Float32Array(h*g*p);for(let T=0;T<p;T++){const P=T%3*2/3-1,A=T>2?0:-1,y=[P,A,0,P+2/3,A,0,P+2/3,A+1,0,P,A,0,P+2/3,A+1,0,P,A+1,0];v.set(y,M*g*T),_.set(f,m*g*T);const x=[T,T,T,T,T,T];b.set(x,h*g*T)}const E=new It;E.setAttribute("position",new Mn(v,M)),E.setAttribute("uv",new Mn(_,m)),E.setAttribute("faceIndex",new Mn(b,h)),n.push(new q(E,null)),s>Qn&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Jc(i,e,t){const n=new vn(i,e,t);return n.texture.mapping=Ur,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Gi(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function J0(i,e,t){return new Gt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:$0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Fr(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function j0(i,e,t){const n=new Float32Array(gi),s=new D(0,1,0);return new Gt({name:"SphericalGaussianBlur",defines:{n:gi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Fr(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function jc(){return new Gt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fr(),fragmentShader:`

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
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Qc(){return new Gt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Rn,depthTest:!1,depthWrite:!1})}function Fr(){return`

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
	`}function Q0(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Ua||c===Na,d=c===Ki||c===Ji;if(l||d){let u=e.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new xo(i)),u=l?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return l&&p&&p.height>0||d&&p&&s(p)?(t===null&&(t=new xo(i)),u=l?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0;const l=6;for(let d=0;d<l;d++)o[d]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function em(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Is("WebGLRenderer: "+n+" extension not supported."),s}}}function tm(i,e,t,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete s[f.id];const p=r.get(f);p&&(e.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(u){const f=u.attributes;for(const p in f)e.update(f[p],i.ARRAY_BUFFER)}function l(u){const f=[],p=u.index,g=u.attributes.position;let M=0;if(p!==null){const v=p.array;M=p.version;for(let _=0,b=v.length;_<b;_+=3){const E=v[_+0],T=v[_+1],P=v[_+2];f.push(E,T,T,P,P,E)}}else if(g!==void 0){const v=g.array;M=g.version;for(let _=0,b=v.length/3-1;_<b;_+=3){const E=_+0,T=_+1,P=_+2;f.push(E,T,T,P,P,E)}}else return;const m=new(Kl(f)?eh:Ql)(f,1);m.version=M;const h=r.get(u);h&&e.remove(h),r.set(u,m)}function d(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:d}}function nm(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,p){i.drawElements(n,p,r,f*a),t.update(p,n,1)}function l(f,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,f*a,g),t.update(p,n,g))}function d(f,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,g);let m=0;for(let h=0;h<g;h++)m+=p[h];t.update(m,n,1)}function u(f,p,g,M){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let h=0;h<f.length;h++)l(f[h]/a,p[h],M[h]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,M,0,g);let h=0;for(let v=0;v<g;v++)h+=p[v]*M[v];t.update(h,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function im(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Pt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function sm(i,e,t){const n=new WeakMap,s=new _t;function r(a,o,c){const l=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let x=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",x)};var p=x;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let b=0;g===!0&&(b=1),M===!0&&(b=2),m===!0&&(b=3);let E=o.attributes.position.count*b,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const P=new Float32Array(E*T*4*u),A=new Jl(P,E,T,u);A.type=An,A.needsUpdate=!0;const y=b*4;for(let R=0;R<u;R++){const I=h[R],O=v[R],V=_[R],Y=E*T*4*R;for(let H=0;H<I.count;H++){const Q=H*y;g===!0&&(s.fromBufferAttribute(I,H),P[Y+Q+0]=s.x,P[Y+Q+1]=s.y,P[Y+Q+2]=s.z,P[Y+Q+3]=0),M===!0&&(s.fromBufferAttribute(O,H),P[Y+Q+4]=s.x,P[Y+Q+5]=s.y,P[Y+Q+6]=s.z,P[Y+Q+7]=0),m===!0&&(s.fromBufferAttribute(V,H),P[Y+Q+8]=s.x,P[Y+Q+9]=s.y,P[Y+Q+10]=s.z,P[Y+Q+11]=V.itemSize===4?s.w:1)}}f={count:u,texture:A,size:new ge(E,T)},n.set(o,f),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const M=o.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",M),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function rm(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,d=c.geometry,u=e.get(c,d);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}const Sh=new Wt,el=new ah(1,1),yh=new Jl,bh=new Kd,wh=new ih,tl=[],nl=[],il=new Float32Array(16),sl=new Float32Array(9),rl=new Float32Array(4);function as(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=tl[s];if(r===void 0&&(r=new Float32Array(s),tl[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Ft(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ot(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Or(i,e){let t=nl[e];t===void 0&&(t=new Int32Array(e),nl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function am(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function om(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2fv(this.addr,e),Ot(t,e)}}function cm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ft(t,e))return;i.uniform3fv(this.addr,e),Ot(t,e)}}function lm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4fv(this.addr,e),Ot(t,e)}}function hm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ot(t,e)}else{if(Ft(t,n))return;rl.set(n),i.uniformMatrix2fv(this.addr,!1,rl),Ot(t,n)}}function dm(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ot(t,e)}else{if(Ft(t,n))return;sl.set(n),i.uniformMatrix3fv(this.addr,!1,sl),Ot(t,n)}}function um(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ft(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ot(t,e)}else{if(Ft(t,n))return;il.set(n),i.uniformMatrix4fv(this.addr,!1,il),Ot(t,n)}}function fm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function pm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2iv(this.addr,e),Ot(t,e)}}function mm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;i.uniform3iv(this.addr,e),Ot(t,e)}}function xm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4iv(this.addr,e),Ot(t,e)}}function gm(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function _m(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;i.uniform2uiv(this.addr,e),Ot(t,e)}}function vm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;i.uniform3uiv(this.addr,e),Ot(t,e)}}function Mm(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;i.uniform4uiv(this.addr,e),Ot(t,e)}}function Sm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(el.compareFunction=Zl,r=el):r=Sh,t.setTexture2D(e||r,s)}function ym(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||bh,s)}function bm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||wh,s)}function wm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||yh,s)}function Tm(i){switch(i){case 5126:return am;case 35664:return om;case 35665:return cm;case 35666:return lm;case 35674:return hm;case 35675:return dm;case 35676:return um;case 5124:case 35670:return fm;case 35667:case 35671:return pm;case 35668:case 35672:return mm;case 35669:case 35673:return xm;case 5125:return gm;case 36294:return _m;case 36295:return vm;case 36296:return Mm;case 35678:case 36198:case 36298:case 36306:case 35682:return Sm;case 35679:case 36299:case 36307:return ym;case 35680:case 36300:case 36308:case 36293:return bm;case 36289:case 36303:case 36311:case 36292:return wm}}function Em(i,e){i.uniform1fv(this.addr,e)}function Am(i,e){const t=as(e,this.size,2);i.uniform2fv(this.addr,t)}function Cm(i,e){const t=as(e,this.size,3);i.uniform3fv(this.addr,t)}function Rm(i,e){const t=as(e,this.size,4);i.uniform4fv(this.addr,t)}function Pm(i,e){const t=as(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Lm(i,e){const t=as(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Dm(i,e){const t=as(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Im(i,e){i.uniform1iv(this.addr,e)}function Um(i,e){i.uniform2iv(this.addr,e)}function Nm(i,e){i.uniform3iv(this.addr,e)}function Fm(i,e){i.uniform4iv(this.addr,e)}function Om(i,e){i.uniform1uiv(this.addr,e)}function Bm(i,e){i.uniform2uiv(this.addr,e)}function zm(i,e){i.uniform3uiv(this.addr,e)}function Vm(i,e){i.uniform4uiv(this.addr,e)}function km(i,e,t){const n=this.cache,s=e.length,r=Or(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Sh,r[a])}function Gm(i,e,t){const n=this.cache,s=e.length,r=Or(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||bh,r[a])}function Hm(i,e,t){const n=this.cache,s=e.length,r=Or(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||wh,r[a])}function Wm(i,e,t){const n=this.cache,s=e.length,r=Or(t,s);Ft(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||yh,r[a])}function Xm(i){switch(i){case 5126:return Em;case 35664:return Am;case 35665:return Cm;case 35666:return Rm;case 35674:return Pm;case 35675:return Lm;case 35676:return Dm;case 5124:case 35670:return Im;case 35667:case 35671:return Um;case 35668:case 35672:return Nm;case 35669:case 35673:return Fm;case 5125:return Om;case 36294:return Bm;case 36295:return zm;case 36296:return Vm;case 35678:case 36198:case 36298:case 36306:case 35682:return km;case 35679:case 36299:case 36307:return Gm;case 35680:case 36300:case 36308:case 36293:return Hm;case 36289:case 36303:case 36311:case 36292:return Wm}}class qm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Tm(t.type)}}class Ym{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Xm(t.type)}}class $m{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Ma=/(\w+)(\])?(\[|\.)?/g;function al(i,e){i.seq.push(e),i.map[e.id]=e}function Zm(i,e,t){const n=i.name,s=n.length;for(Ma.lastIndex=0;;){const r=Ma.exec(n),a=Ma.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){al(t,l===void 0?new qm(o,i,e):new Ym(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new $m(o),al(t,u)),t=u}}}class Sr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Zm(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function ol(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Km=37297;let Jm=0;function jm(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const cl=new $e;function Qm(i){st._getMatrix(cl,st.workingColorSpace,i);const e=`mat3( ${cl.elements.map(t=>t.toFixed(4))} )`;switch(st.getTransfer(i)){case Ar:return[e,"LinearTransferOETF"];case ht:return[e,"sRGBTransferOETF"];default:return qe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function ll(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+jm(i.getShaderSource(e),o)}else return r}function ex(i,e){const t=Qm(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function tx(i,e){let t;switch(e){case Fl:t="Linear";break;case Ol:t="Reinhard";break;case Bl:t="Cineon";break;case yo:t="ACESFilmic";break;case Vl:t="AgX";break;case kl:t="Neutral";break;case zl:t="Custom";break;default:qe("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const fr=new D;function nx(){st.getLuminanceCoefficients(fr);const i=fr.x.toFixed(4),e=fr.y.toFixed(4),t=fr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ix(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ss).join(`
`)}function sx(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function rx(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ss(i){return i!==""}function hl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function dl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const ax=/^[ \t]*#include +<([\w\d./]+)>/gm;function go(i){return i.replace(ax,cx)}const ox=new Map;function cx(i,e){let t=Ze[e];if(t===void 0){const n=ox.get(e);if(n!==void 0)t=Ze[n],qe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return go(t)}const lx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ul(i){return i.replace(lx,hx)}function hx(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function fl(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function dx(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ul?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Nl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Vn&&(e="SHADOWMAP_TYPE_VSM"),e}function ux(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ki:case Ji:e="ENVMAP_TYPE_CUBE";break;case Ur:e="ENVMAP_TYPE_CUBE_UV";break}return e}function fx(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Ji&&(e="ENVMAP_MODE_REFRACTION"),e}function px(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case So:e="ENVMAP_BLENDING_MULTIPLY";break;case pd:e="ENVMAP_BLENDING_MIX";break;case md:e="ENVMAP_BLENDING_ADD";break}return e}function mx(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function xx(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=dx(t),l=ux(t),d=fx(t),u=px(t),f=mx(t),p=ix(t),g=sx(r),M=s.createProgram();let m,h,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ss).join(`
`),m.length>0&&(m+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ss).join(`
`),h.length>0&&(h+=`
`)):(m=[fl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ss).join(`
`),h=[fl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ni?"#define TONE_MAPPING":"",t.toneMapping!==ni?Ze.tonemapping_pars_fragment:"",t.toneMapping!==ni?tx("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,ex("linearToOutputTexel",t.outputColorSpace),nx(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ss).join(`
`)),a=go(a),a=hl(a,t),a=dl(a,t),o=go(o),o=hl(o,t),o=dl(o,t),a=ul(a),o=ul(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,h=["#define varying in",t.glslVersion===hc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===hc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const _=v+m+a,b=v+h+o,E=ol(s,s.VERTEX_SHADER,_),T=ol(s,s.FRAGMENT_SHADER,b);s.attachShader(M,E),s.attachShader(M,T),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function P(R){if(i.debug.checkShaderErrors){const I=s.getProgramInfoLog(M)||"",O=s.getShaderInfoLog(E)||"",V=s.getShaderInfoLog(T)||"",Y=I.trim(),H=O.trim(),Q=V.trim();let W=!0,he=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,E,T);else{const de=ll(s,E,"vertex"),Pe=ll(s,T,"fragment");Pt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+Y+`
`+de+`
`+Pe)}else Y!==""?qe("WebGLProgram: Program Info Log:",Y):(H===""||Q==="")&&(he=!1);he&&(R.diagnostics={runnable:W,programLog:Y,vertexShader:{log:H,prefix:m},fragmentShader:{log:Q,prefix:h}})}s.deleteShader(E),s.deleteShader(T),A=new Sr(s,M),y=rx(s,M)}let A;this.getUniforms=function(){return A===void 0&&P(this),A};let y;this.getAttributes=function(){return y===void 0&&P(this),y};let x=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(M,Km)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Jm++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=E,this.fragmentShader=T,this}let gx=0;class _x{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new vx(e),t.set(e,n)),n}}class vx{constructor(e){this.id=gx++,this.code=e,this.usedTimes=0}}function Mx(i,e,t,n,s,r,a){const o=new No,c=new _x,l=new Set,d=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(y){return l.add(y),y===0?"uv":`uv${y}`}function m(y,x,R,I,O){const V=I.fog,Y=O.geometry,H=y.isMeshStandardMaterial?I.environment:null,Q=(y.isMeshStandardMaterial?t:e).get(y.envMap||H),W=Q&&Q.mapping===Ur?Q.image.height:null,he=g[y.type];y.precision!==null&&(p=s.getMaxPrecision(y.precision),p!==y.precision&&qe("WebGLProgram.getParameters:",y.precision,"not supported, using",p,"instead."));const de=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Pe=de!==void 0?de.length:0;let je=0;Y.morphAttributes.position!==void 0&&(je=1),Y.morphAttributes.normal!==void 0&&(je=2),Y.morphAttributes.color!==void 0&&(je=3);let it,pt,mt,J;if(he){const xt=Tn[he];it=xt.vertexShader,pt=xt.fragmentShader}else it=y.vertexShader,pt=y.fragmentShader,c.update(y),mt=c.getVertexShaderID(y),J=c.getFragmentShaderID(y);const ie=i.getRenderTarget(),be=i.state.buffers.depth.getReversed(),Ve=O.isInstancedMesh===!0,Le=O.isBatchedMesh===!0,Xe=!!y.map,Ut=!!y.matcap,Ke=!!Q,ct=!!y.aoMap,U=!!y.lightMap,j=!!y.bumpMap,$=!!y.normalMap,le=!!y.displacementMap,se=!!y.emissiveMap,_e=!!y.metalnessMap,oe=!!y.roughnessMap,ye=y.anisotropy>0,L=y.clearcoat>0,w=y.dispersion>0,F=y.iridescence>0,Z=y.sheen>0,ne=y.transmission>0,X=ye&&!!y.anisotropyMap,Re=L&&!!y.clearcoatMap,me=L&&!!y.clearcoatNormalMap,we=L&&!!y.clearcoatRoughnessMap,Te=F&&!!y.iridescenceMap,re=F&&!!y.iridescenceThicknessMap,ce=Z&&!!y.sheenColorMap,Ue=Z&&!!y.sheenRoughnessMap,De=!!y.specularMap,Me=!!y.specularColorMap,Fe=!!y.specularIntensityMap,N=ne&&!!y.transmissionMap,xe=ne&&!!y.thicknessMap,pe=!!y.gradientMap,ue=!!y.alphaMap,ae=y.alphaTest>0,te=!!y.alphaHash,Ae=!!y.extensions;let Ye=ni;y.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Ye=i.toneMapping);const yt={shaderID:he,shaderType:y.type,shaderName:y.name,vertexShader:it,fragmentShader:pt,defines:y.defines,customVertexShaderID:mt,customFragmentShaderID:J,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:p,batching:Le,batchingColor:Le&&O._colorsTexture!==null,instancing:Ve,instancingColor:Ve&&O.instanceColor!==null,instancingMorph:Ve&&O.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ie===null?i.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:ji,alphaToCoverage:!!y.alphaToCoverage,map:Xe,matcap:Ut,envMap:Ke,envMapMode:Ke&&Q.mapping,envMapCubeUVHeight:W,aoMap:ct,lightMap:U,bumpMap:j,normalMap:$,displacementMap:f&&le,emissiveMap:se,normalMapObjectSpace:$&&y.normalMapType===vd,normalMapTangentSpace:$&&y.normalMapType===Lo,metalnessMap:_e,roughnessMap:oe,anisotropy:ye,anisotropyMap:X,clearcoat:L,clearcoatMap:Re,clearcoatNormalMap:me,clearcoatRoughnessMap:we,dispersion:w,iridescence:F,iridescenceMap:Te,iridescenceThicknessMap:re,sheen:Z,sheenColorMap:ce,sheenRoughnessMap:Ue,specularMap:De,specularColorMap:Me,specularIntensityMap:Fe,transmission:ne,transmissionMap:N,thicknessMap:xe,gradientMap:pe,opaque:y.transparent===!1&&y.blending===qi&&y.alphaToCoverage===!1,alphaMap:ue,alphaTest:ae,alphaHash:te,combine:y.combine,mapUv:Xe&&M(y.map.channel),aoMapUv:ct&&M(y.aoMap.channel),lightMapUv:U&&M(y.lightMap.channel),bumpMapUv:j&&M(y.bumpMap.channel),normalMapUv:$&&M(y.normalMap.channel),displacementMapUv:le&&M(y.displacementMap.channel),emissiveMapUv:se&&M(y.emissiveMap.channel),metalnessMapUv:_e&&M(y.metalnessMap.channel),roughnessMapUv:oe&&M(y.roughnessMap.channel),anisotropyMapUv:X&&M(y.anisotropyMap.channel),clearcoatMapUv:Re&&M(y.clearcoatMap.channel),clearcoatNormalMapUv:me&&M(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:we&&M(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Te&&M(y.iridescenceMap.channel),iridescenceThicknessMapUv:re&&M(y.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&M(y.sheenColorMap.channel),sheenRoughnessMapUv:Ue&&M(y.sheenRoughnessMap.channel),specularMapUv:De&&M(y.specularMap.channel),specularColorMapUv:Me&&M(y.specularColorMap.channel),specularIntensityMapUv:Fe&&M(y.specularIntensityMap.channel),transmissionMapUv:N&&M(y.transmissionMap.channel),thicknessMapUv:xe&&M(y.thicknessMap.channel),alphaMapUv:ue&&M(y.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&($||ye),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!Y.attributes.uv&&(Xe||ue),fog:!!V,useFog:y.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:be,skinning:O.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:Pe,morphTextureStride:je,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ye,decodeVideoTexture:Xe&&y.map.isVideoTexture===!0&&st.getTransfer(y.map.colorSpace)===ht,decodeVideoTextureEmissive:se&&y.emissiveMap.isVideoTexture===!0&&st.getTransfer(y.emissiveMap.colorSpace)===ht,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===St,flipSided:y.side===Ht,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Ae&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ae&&y.extensions.multiDraw===!0||Le)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return yt.vertexUv1s=l.has(1),yt.vertexUv2s=l.has(2),yt.vertexUv3s=l.has(3),l.clear(),yt}function h(y){const x=[];if(y.shaderID?x.push(y.shaderID):(x.push(y.customVertexShaderID),x.push(y.customFragmentShaderID)),y.defines!==void 0)for(const R in y.defines)x.push(R),x.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(v(x,y),_(x,y),x.push(i.outputColorSpace)),x.push(y.customProgramCacheKey),x.join()}function v(y,x){y.push(x.precision),y.push(x.outputColorSpace),y.push(x.envMapMode),y.push(x.envMapCubeUVHeight),y.push(x.mapUv),y.push(x.alphaMapUv),y.push(x.lightMapUv),y.push(x.aoMapUv),y.push(x.bumpMapUv),y.push(x.normalMapUv),y.push(x.displacementMapUv),y.push(x.emissiveMapUv),y.push(x.metalnessMapUv),y.push(x.roughnessMapUv),y.push(x.anisotropyMapUv),y.push(x.clearcoatMapUv),y.push(x.clearcoatNormalMapUv),y.push(x.clearcoatRoughnessMapUv),y.push(x.iridescenceMapUv),y.push(x.iridescenceThicknessMapUv),y.push(x.sheenColorMapUv),y.push(x.sheenRoughnessMapUv),y.push(x.specularMapUv),y.push(x.specularColorMapUv),y.push(x.specularIntensityMapUv),y.push(x.transmissionMapUv),y.push(x.thicknessMapUv),y.push(x.combine),y.push(x.fogExp2),y.push(x.sizeAttenuation),y.push(x.morphTargetsCount),y.push(x.morphAttributeCount),y.push(x.numDirLights),y.push(x.numPointLights),y.push(x.numSpotLights),y.push(x.numSpotLightMaps),y.push(x.numHemiLights),y.push(x.numRectAreaLights),y.push(x.numDirLightShadows),y.push(x.numPointLightShadows),y.push(x.numSpotLightShadows),y.push(x.numSpotLightShadowsWithMaps),y.push(x.numLightProbes),y.push(x.shadowMapType),y.push(x.toneMapping),y.push(x.numClippingPlanes),y.push(x.numClipIntersection),y.push(x.depthPacking)}function _(y,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),x.gradientMap&&o.enable(22),y.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reversedDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),y.push(o.mask)}function b(y){const x=g[y.type];let R;if(x){const I=Tn[x];R=Ns.clone(I.uniforms)}else R=y.uniforms;return R}function E(y,x){let R;for(let I=0,O=d.length;I<O;I++){const V=d[I];if(V.cacheKey===x){R=V,++R.usedTimes;break}}return R===void 0&&(R=new xx(i,x,y,r),d.push(R)),R}function T(y){if(--y.usedTimes===0){const x=d.indexOf(y);d[x]=d[d.length-1],d.pop(),y.destroy()}}function P(y){c.remove(y)}function A(){c.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:b,acquireProgram:E,releaseProgram:T,releaseShaderCache:P,programs:d,dispose:A}}function Sx(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function yx(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function pl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ml(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,f,p,g,M,m){let h=i[e];return h===void 0?(h={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:M,group:m},i[e]=h):(h.id=u.id,h.object=u,h.geometry=f,h.material=p,h.groupOrder=g,h.renderOrder=u.renderOrder,h.z=M,h.group=m),e++,h}function o(u,f,p,g,M,m){const h=a(u,f,p,g,M,m);p.transmission>0?n.push(h):p.transparent===!0?s.push(h):t.push(h)}function c(u,f,p,g,M,m){const h=a(u,f,p,g,M,m);p.transmission>0?n.unshift(h):p.transparent===!0?s.unshift(h):t.unshift(h)}function l(u,f){t.length>1&&t.sort(u||yx),n.length>1&&n.sort(f||pl),s.length>1&&s.sort(f||pl)}function d(){for(let u=e,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:d,sort:l}}function bx(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new ml,i.set(n,[a])):s>=r.length?(a=new ml,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function wx(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new He};break;case"SpotLight":t={position:new D,direction:new D,color:new He,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new He,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new He,groundColor:new He};break;case"RectAreaLight":t={color:new He,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function Tx(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Ex=0;function Ax(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Cx(i){const e=new wx,t=Tx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new D);const s=new D,r=new lt,a=new lt;function o(l){let d=0,u=0,f=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let p=0,g=0,M=0,m=0,h=0,v=0,_=0,b=0,E=0,T=0,P=0;l.sort(Ax);for(let y=0,x=l.length;y<x;y++){const R=l[y],I=R.color,O=R.intensity,V=R.distance,Y=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=I.r*O,u+=I.g*O,f+=I.b*O;else if(R.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(R.sh.coefficients[H],O);P++}else if(R.isDirectionalLight){const H=e.get(R);if(H.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const Q=R.shadow,W=t.get(R);W.shadowIntensity=Q.intensity,W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,n.directionalShadow[p]=W,n.directionalShadowMap[p]=Y,n.directionalShadowMatrix[p]=R.shadow.matrix,v++}n.directional[p]=H,p++}else if(R.isSpotLight){const H=e.get(R);H.position.setFromMatrixPosition(R.matrixWorld),H.color.copy(I).multiplyScalar(O),H.distance=V,H.coneCos=Math.cos(R.angle),H.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),H.decay=R.decay,n.spot[M]=H;const Q=R.shadow;if(R.map&&(n.spotLightMap[E]=R.map,E++,Q.updateMatrices(R),R.castShadow&&T++),n.spotLightMatrix[M]=Q.matrix,R.castShadow){const W=t.get(R);W.shadowIntensity=Q.intensity,W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,n.spotShadow[M]=W,n.spotShadowMap[M]=Y,b++}M++}else if(R.isRectAreaLight){const H=e.get(R);H.color.copy(I).multiplyScalar(O),H.halfWidth.set(R.width*.5,0,0),H.halfHeight.set(0,R.height*.5,0),n.rectArea[m]=H,m++}else if(R.isPointLight){const H=e.get(R);if(H.color.copy(R.color).multiplyScalar(R.intensity),H.distance=R.distance,H.decay=R.decay,R.castShadow){const Q=R.shadow,W=t.get(R);W.shadowIntensity=Q.intensity,W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,W.shadowCameraNear=Q.camera.near,W.shadowCameraFar=Q.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=Y,n.pointShadowMatrix[g]=R.shadow.matrix,_++}n.point[g]=H,g++}else if(R.isHemisphereLight){const H=e.get(R);H.skyColor.copy(R.color).multiplyScalar(O),H.groundColor.copy(R.groundColor).multiplyScalar(O),n.hemi[h]=H,h++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=f;const A=n.hash;(A.directionalLength!==p||A.pointLength!==g||A.spotLength!==M||A.rectAreaLength!==m||A.hemiLength!==h||A.numDirectionalShadows!==v||A.numPointShadows!==_||A.numSpotShadows!==b||A.numSpotMaps!==E||A.numLightProbes!==P)&&(n.directional.length=p,n.spot.length=M,n.rectArea.length=m,n.point.length=g,n.hemi.length=h,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=b,n.spotShadowMap.length=b,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=b+E-T,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=P,A.directionalLength=p,A.pointLength=g,A.spotLength=M,A.rectAreaLength=m,A.hemiLength=h,A.numDirectionalShadows=v,A.numPointShadows=_,A.numSpotShadows=b,A.numSpotMaps=E,A.numLightProbes=P,n.version=Ex++)}function c(l,d){let u=0,f=0,p=0,g=0,M=0;const m=d.matrixWorldInverse;for(let h=0,v=l.length;h<v;h++){const _=l[h];if(_.isDirectionalLight){const b=n.directional[u];b.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),u++}else if(_.isSpotLight){const b=n.spot[p];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(m),p++}else if(_.isRectAreaLight){const b=n.rectArea[g];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(m),a.identity(),r.copy(_.matrixWorld),r.premultiply(m),a.extractRotation(r),b.halfWidth.set(_.width*.5,0,0),b.halfHeight.set(0,_.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),g++}else if(_.isPointLight){const b=n.point[f];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(m),f++}else if(_.isHemisphereLight){const b=n.hemi[M];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(m),M++}}}return{setup:o,setupView:c,state:n}}function xl(i){const e=new Cx(i),t=[],n=[];function s(d){l.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function a(d){n.push(d)}function o(){e.setup(t)}function c(d){e.setupView(t,d)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Rx(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new xl(i),e.set(s,[o])):r>=a.length?(o=new xl(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Px=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Lx=`uniform sampler2D shadow_pass;
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
}`;function Dx(i,e,t){let n=new Oo;const s=new ge,r=new ge,a=new _t,o=new ju({depthPacking:_d}),c=new Qu,l={},d=t.maxTextureSize,u={[si]:Ht,[Ht]:si,[St]:St},f=new Gt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ge},radius:{value:4}},vertexShader:Px,fragmentShader:Lx}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new It;g.setAttribute("position",new Mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new q(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ul;let h=this.type;this.render=function(T,P,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const y=i.getRenderTarget(),x=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),I=i.state;I.setBlending(Rn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const O=h!==Vn&&this.type===Vn,V=h===Vn&&this.type!==Vn;for(let Y=0,H=T.length;Y<H;Y++){const Q=T[Y],W=Q.shadow;if(W===void 0){qe("WebGLShadowMap:",Q,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const he=W.getFrameExtents();if(s.multiply(he),r.copy(W.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/he.x),s.x=r.x*he.x,W.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/he.y),s.y=r.y*he.y,W.mapSize.y=r.y)),W.map===null||O===!0||V===!0){const Pe=this.type!==Vn?{minFilter:nn,magFilter:nn}:{};W.map!==null&&W.map.dispose(),W.map=new vn(s.x,s.y,Pe),W.map.texture.name=Q.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const de=W.getViewportCount();for(let Pe=0;Pe<de;Pe++){const je=W.getViewport(Pe);a.set(r.x*je.x,r.y*je.y,r.x*je.z,r.y*je.w),I.viewport(a),W.updateMatrices(Q,Pe),n=W.getFrustum(),b(P,A,W.camera,Q,this.type)}W.isPointLightShadow!==!0&&this.type===Vn&&v(W,A),W.needsUpdate=!1}h=this.type,m.needsUpdate=!1,i.setRenderTarget(y,x,R)};function v(T,P){const A=e.update(M);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new vn(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(P,null,A,f,M,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(P,null,A,p,M,null)}function _(T,P,A,y){let x=null;const R=A.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(R!==void 0)x=R;else if(x=A.isPointLight===!0?c:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const I=x.uuid,O=P.uuid;let V=l[I];V===void 0&&(V={},l[I]=V);let Y=V[O];Y===void 0&&(Y=x.clone(),V[O]=Y,P.addEventListener("dispose",E)),x=Y}if(x.visible=P.visible,x.wireframe=P.wireframe,y===Vn?x.side=P.shadowSide!==null?P.shadowSide:P.side:x.side=P.shadowSide!==null?P.shadowSide:u[P.side],x.alphaMap=P.alphaMap,x.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,x.map=P.map,x.clipShadows=P.clipShadows,x.clippingPlanes=P.clippingPlanes,x.clipIntersection=P.clipIntersection,x.displacementMap=P.displacementMap,x.displacementScale=P.displacementScale,x.displacementBias=P.displacementBias,x.wireframeLinewidth=P.wireframeLinewidth,x.linewidth=P.linewidth,A.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const I=i.properties.get(x);I.light=A}return x}function b(T,P,A,y,x){if(T.visible===!1)return;if(T.layers.test(P.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&x===Vn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,T.matrixWorld);const O=e.update(T),V=T.material;if(Array.isArray(V)){const Y=O.groups;for(let H=0,Q=Y.length;H<Q;H++){const W=Y[H],he=V[W.materialIndex];if(he&&he.visible){const de=_(T,he,y,x);T.onBeforeShadow(i,T,P,A,O,de,W),i.renderBufferDirect(A,null,O,de,T,W),T.onAfterShadow(i,T,P,A,O,de,W)}}}else if(V.visible){const Y=_(T,V,y,x);T.onBeforeShadow(i,T,P,A,O,Y,null),i.renderBufferDirect(A,null,O,Y,T,null),T.onAfterShadow(i,T,P,A,O,Y,null)}}const I=T.children;for(let O=0,V=I.length;O<V;O++)b(I[O],P,A,y,x)}function E(T){T.target.removeEventListener("dispose",E);for(const A in l){const y=l[A],x=T.target.uuid;x in y&&(y[x].dispose(),delete y[x])}}}const Ix={[Aa]:Ca,[Ra]:Da,[Pa]:Ia,[Zi]:La,[Ca]:Aa,[Da]:Ra,[Ia]:Pa,[La]:Zi};function Ux(i,e){function t(){let N=!1;const xe=new _t;let pe=null;const ue=new _t(0,0,0,0);return{setMask:function(ae){pe!==ae&&!N&&(i.colorMask(ae,ae,ae,ae),pe=ae)},setLocked:function(ae){N=ae},setClear:function(ae,te,Ae,Ye,yt){yt===!0&&(ae*=Ye,te*=Ye,Ae*=Ye),xe.set(ae,te,Ae,Ye),ue.equals(xe)===!1&&(i.clearColor(ae,te,Ae,Ye),ue.copy(xe))},reset:function(){N=!1,pe=null,ue.set(-1,0,0,0)}}}function n(){let N=!1,xe=!1,pe=null,ue=null,ae=null;return{setReversed:function(te){if(xe!==te){const Ae=e.get("EXT_clip_control");te?Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.ZERO_TO_ONE_EXT):Ae.clipControlEXT(Ae.LOWER_LEFT_EXT,Ae.NEGATIVE_ONE_TO_ONE_EXT),xe=te;const Ye=ae;ae=null,this.setClear(Ye)}},getReversed:function(){return xe},setTest:function(te){te?ie(i.DEPTH_TEST):be(i.DEPTH_TEST)},setMask:function(te){pe!==te&&!N&&(i.depthMask(te),pe=te)},setFunc:function(te){if(xe&&(te=Ix[te]),ue!==te){switch(te){case Aa:i.depthFunc(i.NEVER);break;case Ca:i.depthFunc(i.ALWAYS);break;case Ra:i.depthFunc(i.LESS);break;case Zi:i.depthFunc(i.LEQUAL);break;case Pa:i.depthFunc(i.EQUAL);break;case La:i.depthFunc(i.GEQUAL);break;case Da:i.depthFunc(i.GREATER);break;case Ia:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ue=te}},setLocked:function(te){N=te},setClear:function(te){ae!==te&&(xe&&(te=1-te),i.clearDepth(te),ae=te)},reset:function(){N=!1,pe=null,ue=null,ae=null,xe=!1}}}function s(){let N=!1,xe=null,pe=null,ue=null,ae=null,te=null,Ae=null,Ye=null,yt=null;return{setTest:function(xt){N||(xt?ie(i.STENCIL_TEST):be(i.STENCIL_TEST))},setMask:function(xt){xe!==xt&&!N&&(i.stencilMask(xt),xe=xt)},setFunc:function(xt,wn,dn){(pe!==xt||ue!==wn||ae!==dn)&&(i.stencilFunc(xt,wn,dn),pe=xt,ue=wn,ae=dn)},setOp:function(xt,wn,dn){(te!==xt||Ae!==wn||Ye!==dn)&&(i.stencilOp(xt,wn,dn),te=xt,Ae=wn,Ye=dn)},setLocked:function(xt){N=xt},setClear:function(xt){yt!==xt&&(i.clearStencil(xt),yt=xt)},reset:function(){N=!1,xe=null,pe=null,ue=null,ae=null,te=null,Ae=null,Ye=null,yt=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let d={},u={},f=new WeakMap,p=[],g=null,M=!1,m=null,h=null,v=null,_=null,b=null,E=null,T=null,P=new He(0,0,0),A=0,y=!1,x=null,R=null,I=null,O=null,V=null;const Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,Q=0;const W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(W)[1]),H=Q>=1):W.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),H=Q>=2);let he=null,de={};const Pe=i.getParameter(i.SCISSOR_BOX),je=i.getParameter(i.VIEWPORT),it=new _t().fromArray(Pe),pt=new _t().fromArray(je);function mt(N,xe,pe,ue){const ae=new Uint8Array(4),te=i.createTexture();i.bindTexture(N,te),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ae=0;Ae<pe;Ae++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(xe,0,i.RGBA,1,1,ue,0,i.RGBA,i.UNSIGNED_BYTE,ae):i.texImage2D(xe+Ae,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ae);return te}const J={};J[i.TEXTURE_2D]=mt(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=mt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=mt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=mt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(i.DEPTH_TEST),a.setFunc(Zi),j(!1),$(rc),ie(i.CULL_FACE),ct(Rn);function ie(N){d[N]!==!0&&(i.enable(N),d[N]=!0)}function be(N){d[N]!==!1&&(i.disable(N),d[N]=!1)}function Ve(N,xe){return u[N]!==xe?(i.bindFramebuffer(N,xe),u[N]=xe,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=xe),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=xe),!0):!1}function Le(N,xe){let pe=p,ue=!1;if(N){pe=f.get(xe),pe===void 0&&(pe=[],f.set(xe,pe));const ae=N.textures;if(pe.length!==ae.length||pe[0]!==i.COLOR_ATTACHMENT0){for(let te=0,Ae=ae.length;te<Ae;te++)pe[te]=i.COLOR_ATTACHMENT0+te;pe.length=ae.length,ue=!0}}else pe[0]!==i.BACK&&(pe[0]=i.BACK,ue=!0);ue&&i.drawBuffers(pe)}function Xe(N){return g!==N?(i.useProgram(N),g=N,!0):!1}const Ut={[xi]:i.FUNC_ADD,[Jh]:i.FUNC_SUBTRACT,[jh]:i.FUNC_REVERSE_SUBTRACT};Ut[Qh]=i.MIN,Ut[ed]=i.MAX;const Ke={[td]:i.ZERO,[nd]:i.ONE,[id]:i.SRC_COLOR,[Ta]:i.SRC_ALPHA,[ld]:i.SRC_ALPHA_SATURATE,[od]:i.DST_COLOR,[rd]:i.DST_ALPHA,[sd]:i.ONE_MINUS_SRC_COLOR,[Ea]:i.ONE_MINUS_SRC_ALPHA,[cd]:i.ONE_MINUS_DST_COLOR,[ad]:i.ONE_MINUS_DST_ALPHA,[hd]:i.CONSTANT_COLOR,[dd]:i.ONE_MINUS_CONSTANT_COLOR,[ud]:i.CONSTANT_ALPHA,[fd]:i.ONE_MINUS_CONSTANT_ALPHA};function ct(N,xe,pe,ue,ae,te,Ae,Ye,yt,xt){if(N===Rn){M===!0&&(be(i.BLEND),M=!1);return}if(M===!1&&(ie(i.BLEND),M=!0),N!==Kh){if(N!==m||xt!==y){if((h!==xi||b!==xi)&&(i.blendEquation(i.FUNC_ADD),h=xi,b=xi),xt)switch(N){case qi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Yi:i.blendFunc(i.ONE,i.ONE);break;case ac:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case oc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Pt("WebGLState: Invalid blending: ",N);break}else switch(N){case qi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Yi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ac:Pt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case oc:Pt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Pt("WebGLState: Invalid blending: ",N);break}v=null,_=null,E=null,T=null,P.set(0,0,0),A=0,m=N,y=xt}return}ae=ae||xe,te=te||pe,Ae=Ae||ue,(xe!==h||ae!==b)&&(i.blendEquationSeparate(Ut[xe],Ut[ae]),h=xe,b=ae),(pe!==v||ue!==_||te!==E||Ae!==T)&&(i.blendFuncSeparate(Ke[pe],Ke[ue],Ke[te],Ke[Ae]),v=pe,_=ue,E=te,T=Ae),(Ye.equals(P)===!1||yt!==A)&&(i.blendColor(Ye.r,Ye.g,Ye.b,yt),P.copy(Ye),A=yt),m=N,y=!1}function U(N,xe){N.side===St?be(i.CULL_FACE):ie(i.CULL_FACE);let pe=N.side===Ht;xe&&(pe=!pe),j(pe),N.blending===qi&&N.transparent===!1?ct(Rn):ct(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);const ue=N.stencilWrite;o.setTest(ue),ue&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),se(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ie(i.SAMPLE_ALPHA_TO_COVERAGE):be(i.SAMPLE_ALPHA_TO_COVERAGE)}function j(N){x!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),x=N)}function $(N){N!==$h?(ie(i.CULL_FACE),N!==R&&(N===rc?i.cullFace(i.BACK):N===Zh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):be(i.CULL_FACE),R=N}function le(N){N!==I&&(H&&i.lineWidth(N),I=N)}function se(N,xe,pe){N?(ie(i.POLYGON_OFFSET_FILL),(O!==xe||V!==pe)&&(i.polygonOffset(xe,pe),O=xe,V=pe)):be(i.POLYGON_OFFSET_FILL)}function _e(N){N?ie(i.SCISSOR_TEST):be(i.SCISSOR_TEST)}function oe(N){N===void 0&&(N=i.TEXTURE0+Y-1),he!==N&&(i.activeTexture(N),he=N)}function ye(N,xe,pe){pe===void 0&&(he===null?pe=i.TEXTURE0+Y-1:pe=he);let ue=de[pe];ue===void 0&&(ue={type:void 0,texture:void 0},de[pe]=ue),(ue.type!==N||ue.texture!==xe)&&(he!==pe&&(i.activeTexture(pe),he=pe),i.bindTexture(N,xe||J[N]),ue.type=N,ue.texture=xe)}function L(){const N=de[he];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function w(){try{i.compressedTexImage2D(...arguments)}catch(N){N("WebGLState:",N)}}function F(){try{i.compressedTexImage3D(...arguments)}catch(N){N("WebGLState:",N)}}function Z(){try{i.texSubImage2D(...arguments)}catch(N){N("WebGLState:",N)}}function ne(){try{i.texSubImage3D(...arguments)}catch(N){N("WebGLState:",N)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(N){N("WebGLState:",N)}}function Re(){try{i.compressedTexSubImage3D(...arguments)}catch(N){N("WebGLState:",N)}}function me(){try{i.texStorage2D(...arguments)}catch(N){N("WebGLState:",N)}}function we(){try{i.texStorage3D(...arguments)}catch(N){N("WebGLState:",N)}}function Te(){try{i.texImage2D(...arguments)}catch(N){N("WebGLState:",N)}}function re(){try{i.texImage3D(...arguments)}catch(N){N("WebGLState:",N)}}function ce(N){it.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),it.copy(N))}function Ue(N){pt.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),pt.copy(N))}function De(N,xe){let pe=l.get(xe);pe===void 0&&(pe=new WeakMap,l.set(xe,pe));let ue=pe.get(N);ue===void 0&&(ue=i.getUniformBlockIndex(xe,N.name),pe.set(N,ue))}function Me(N,xe){const ue=l.get(xe).get(N);c.get(xe)!==ue&&(i.uniformBlockBinding(xe,ue,N.__bindingPointIndex),c.set(xe,ue))}function Fe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},he=null,de={},u={},f=new WeakMap,p=[],g=null,M=!1,m=null,h=null,v=null,_=null,b=null,E=null,T=null,P=new He(0,0,0),A=0,y=!1,x=null,R=null,I=null,O=null,V=null,it.set(0,0,i.canvas.width,i.canvas.height),pt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ie,disable:be,bindFramebuffer:Ve,drawBuffers:Le,useProgram:Xe,setBlending:ct,setMaterial:U,setFlipSided:j,setCullFace:$,setLineWidth:le,setPolygonOffset:se,setScissorTest:_e,activeTexture:oe,bindTexture:ye,unbindTexture:L,compressedTexImage2D:w,compressedTexImage3D:F,texImage2D:Te,texImage3D:re,updateUBOMapping:De,uniformBlockBinding:Me,texStorage2D:me,texStorage3D:we,texSubImage2D:Z,texSubImage3D:ne,compressedTexSubImage2D:X,compressedTexSubImage3D:Re,scissor:ce,viewport:Ue,reset:Fe}}function Nx(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ge,d=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(L,w){return p?new OffscreenCanvas(L,w):Rr("canvas")}function M(L,w,F){let Z=1;const ne=ye(L);if((ne.width>F||ne.height>F)&&(Z=F/Math.max(ne.width,ne.height)),Z<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const X=Math.floor(Z*ne.width),Re=Math.floor(Z*ne.height);u===void 0&&(u=g(X,Re));const me=w?g(X,Re):u;return me.width=X,me.height=Re,me.getContext("2d").drawImage(L,0,0,X,Re),qe("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+X+"x"+Re+")."),me}else return"data"in L&&qe("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),L;return L}function m(L){return L.generateMipmaps}function h(L){i.generateMipmap(L)}function v(L){return L.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?i.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function _(L,w,F,Z,ne=!1){if(L!==null){if(i[L]!==void 0)return i[L];qe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let X=w;if(w===i.RED&&(F===i.FLOAT&&(X=i.R32F),F===i.HALF_FLOAT&&(X=i.R16F),F===i.UNSIGNED_BYTE&&(X=i.R8)),w===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.R8UI),F===i.UNSIGNED_SHORT&&(X=i.R16UI),F===i.UNSIGNED_INT&&(X=i.R32UI),F===i.BYTE&&(X=i.R8I),F===i.SHORT&&(X=i.R16I),F===i.INT&&(X=i.R32I)),w===i.RG&&(F===i.FLOAT&&(X=i.RG32F),F===i.HALF_FLOAT&&(X=i.RG16F),F===i.UNSIGNED_BYTE&&(X=i.RG8)),w===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RG8UI),F===i.UNSIGNED_SHORT&&(X=i.RG16UI),F===i.UNSIGNED_INT&&(X=i.RG32UI),F===i.BYTE&&(X=i.RG8I),F===i.SHORT&&(X=i.RG16I),F===i.INT&&(X=i.RG32I)),w===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RGB8UI),F===i.UNSIGNED_SHORT&&(X=i.RGB16UI),F===i.UNSIGNED_INT&&(X=i.RGB32UI),F===i.BYTE&&(X=i.RGB8I),F===i.SHORT&&(X=i.RGB16I),F===i.INT&&(X=i.RGB32I)),w===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(X=i.RGBA16UI),F===i.UNSIGNED_INT&&(X=i.RGBA32UI),F===i.BYTE&&(X=i.RGBA8I),F===i.SHORT&&(X=i.RGBA16I),F===i.INT&&(X=i.RGBA32I)),w===i.RGB&&(F===i.UNSIGNED_INT_5_9_9_9_REV&&(X=i.RGB9_E5),F===i.UNSIGNED_INT_10F_11F_11F_REV&&(X=i.R11F_G11F_B10F)),w===i.RGBA){const Re=ne?Ar:st.getTransfer(Z);F===i.FLOAT&&(X=i.RGBA32F),F===i.HALF_FLOAT&&(X=i.RGBA16F),F===i.UNSIGNED_BYTE&&(X=Re===ht?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(X=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(X=i.RGB5_A1)}return(X===i.R16F||X===i.R32F||X===i.RG16F||X===i.RG32F||X===i.RGBA16F||X===i.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function b(L,w){let F;return L?w===null||w===Si||w===Ps?F=i.DEPTH24_STENCIL8:w===An?F=i.DEPTH32F_STENCIL8:w===Rs&&(F=i.DEPTH24_STENCIL8,qe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Si||w===Ps?F=i.DEPTH_COMPONENT24:w===An?F=i.DEPTH_COMPONENT32F:w===Rs&&(F=i.DEPTH_COMPONENT16),F}function E(L,w){return m(L)===!0||L.isFramebufferTexture&&L.minFilter!==nn&&L.minFilter!==ln?Math.log2(Math.max(w.width,w.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?w.mipmaps.length:1}function T(L){const w=L.target;w.removeEventListener("dispose",T),A(w),w.isVideoTexture&&d.delete(w)}function P(L){const w=L.target;w.removeEventListener("dispose",P),x(w)}function A(L){const w=n.get(L);if(w.__webglInit===void 0)return;const F=L.source,Z=f.get(F);if(Z){const ne=Z[w.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&y(L),Object.keys(Z).length===0&&f.delete(F)}n.remove(L)}function y(L){const w=n.get(L);i.deleteTexture(w.__webglTexture);const F=L.source,Z=f.get(F);delete Z[w.__cacheKey],a.memory.textures--}function x(L){const w=n.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),n.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(w.__webglFramebuffer[Z]))for(let ne=0;ne<w.__webglFramebuffer[Z].length;ne++)i.deleteFramebuffer(w.__webglFramebuffer[Z][ne]);else i.deleteFramebuffer(w.__webglFramebuffer[Z]);w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer[Z])}else{if(Array.isArray(w.__webglFramebuffer))for(let Z=0;Z<w.__webglFramebuffer.length;Z++)i.deleteFramebuffer(w.__webglFramebuffer[Z]);else i.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&i.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&i.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let Z=0;Z<w.__webglColorRenderbuffer.length;Z++)w.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(w.__webglColorRenderbuffer[Z]);w.__webglDepthRenderbuffer&&i.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const F=L.textures;for(let Z=0,ne=F.length;Z<ne;Z++){const X=n.get(F[Z]);X.__webglTexture&&(i.deleteTexture(X.__webglTexture),a.memory.textures--),n.remove(F[Z])}n.remove(L)}let R=0;function I(){R=0}function O(){const L=R;return L>=s.maxTextures&&qe("WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),R+=1,L}function V(L){const w=[];return w.push(L.wrapS),w.push(L.wrapT),w.push(L.wrapR||0),w.push(L.magFilter),w.push(L.minFilter),w.push(L.anisotropy),w.push(L.internalFormat),w.push(L.format),w.push(L.type),w.push(L.generateMipmaps),w.push(L.premultiplyAlpha),w.push(L.flipY),w.push(L.unpackAlignment),w.push(L.colorSpace),w.join()}function Y(L,w){const F=n.get(L);if(L.isVideoTexture&&_e(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&F.__version!==L.version){const Z=L.image;if(Z===null)qe("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)qe("WebGLRenderer: Texture marked for update but image is incomplete");else{J(F,L,w);return}}else L.isExternalTexture&&(F.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+w)}function H(L,w){const F=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&F.__version!==L.version){J(F,L,w);return}else L.isExternalTexture&&(F.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+w)}function Q(L,w){const F=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&F.__version!==L.version){J(F,L,w);return}t.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+w)}function W(L,w){const F=n.get(L);if(L.version>0&&F.__version!==L.version){ie(F,L,w);return}t.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+w)}const he={[hn]:i.REPEAT,[Gn]:i.CLAMP_TO_EDGE,[Fa]:i.MIRRORED_REPEAT},de={[nn]:i.NEAREST,[xd]:i.NEAREST_MIPMAP_NEAREST,[Gs]:i.NEAREST_MIPMAP_LINEAR,[ln]:i.LINEAR,[kr]:i.LINEAR_MIPMAP_NEAREST,[_i]:i.LINEAR_MIPMAP_LINEAR},Pe={[Md]:i.NEVER,[Ed]:i.ALWAYS,[Sd]:i.LESS,[Zl]:i.LEQUAL,[yd]:i.EQUAL,[Td]:i.GEQUAL,[bd]:i.GREATER,[wd]:i.NOTEQUAL};function je(L,w){if(w.type===An&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===ln||w.magFilter===kr||w.magFilter===Gs||w.magFilter===_i||w.minFilter===ln||w.minFilter===kr||w.minFilter===Gs||w.minFilter===_i)&&qe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(L,i.TEXTURE_WRAP_S,he[w.wrapS]),i.texParameteri(L,i.TEXTURE_WRAP_T,he[w.wrapT]),(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)&&i.texParameteri(L,i.TEXTURE_WRAP_R,he[w.wrapR]),i.texParameteri(L,i.TEXTURE_MAG_FILTER,de[w.magFilter]),i.texParameteri(L,i.TEXTURE_MIN_FILTER,de[w.minFilter]),w.compareFunction&&(i.texParameteri(L,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(L,i.TEXTURE_COMPARE_FUNC,Pe[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===nn||w.minFilter!==Gs&&w.minFilter!==_i||w.type===An&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");i.texParameterf(L,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function it(L,w){let F=!1;L.__webglInit===void 0&&(L.__webglInit=!0,w.addEventListener("dispose",T));const Z=w.source;let ne=f.get(Z);ne===void 0&&(ne={},f.set(Z,ne));const X=V(w);if(X!==L.__cacheKey){ne[X]===void 0&&(ne[X]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,F=!0),ne[X].usedTimes++;const Re=ne[L.__cacheKey];Re!==void 0&&(ne[L.__cacheKey].usedTimes--,Re.usedTimes===0&&y(w)),L.__cacheKey=X,L.__webglTexture=ne[X].texture}return F}function pt(L,w,F){return Math.floor(Math.floor(L/F)/w)}function mt(L,w,F,Z){const X=L.updateRanges;if(X.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,w.width,w.height,F,Z,w.data);else{X.sort((re,ce)=>re.start-ce.start);let Re=0;for(let re=1;re<X.length;re++){const ce=X[Re],Ue=X[re],De=ce.start+ce.count,Me=pt(Ue.start,w.width,4),Fe=pt(ce.start,w.width,4);Ue.start<=De+1&&Me===Fe&&pt(Ue.start+Ue.count-1,w.width,4)===Me?ce.count=Math.max(ce.count,Ue.start+Ue.count-ce.start):(++Re,X[Re]=Ue)}X.length=Re+1;const me=i.getParameter(i.UNPACK_ROW_LENGTH),we=i.getParameter(i.UNPACK_SKIP_PIXELS),Te=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,w.width);for(let re=0,ce=X.length;re<ce;re++){const Ue=X[re],De=Math.floor(Ue.start/4),Me=Math.ceil(Ue.count/4),Fe=De%w.width,N=Math.floor(De/w.width),xe=Me,pe=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Fe),i.pixelStorei(i.UNPACK_SKIP_ROWS,N),t.texSubImage2D(i.TEXTURE_2D,0,Fe,N,xe,pe,F,Z,w.data)}L.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,me),i.pixelStorei(i.UNPACK_SKIP_PIXELS,we),i.pixelStorei(i.UNPACK_SKIP_ROWS,Te)}}function J(L,w,F){let Z=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(Z=i.TEXTURE_3D);const ne=it(L,w),X=w.source;t.bindTexture(Z,L.__webglTexture,i.TEXTURE0+F);const Re=n.get(X);if(X.version!==Re.__version||ne===!0){t.activeTexture(i.TEXTURE0+F);const me=st.getPrimaries(st.workingColorSpace),we=w.colorSpace===jn?null:st.getPrimaries(w.colorSpace),Te=w.colorSpace===jn||me===we?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te);let re=M(w.image,!1,s.maxTextureSize);re=oe(w,re);const ce=r.convert(w.format,w.colorSpace),Ue=r.convert(w.type);let De=_(w.internalFormat,ce,Ue,w.colorSpace,w.isVideoTexture);je(Z,w);let Me;const Fe=w.mipmaps,N=w.isVideoTexture!==!0,xe=Re.__version===void 0||ne===!0,pe=X.dataReady,ue=E(w,re);if(w.isDepthTexture)De=b(w.format===Ds,w.type),xe&&(N?t.texStorage2D(i.TEXTURE_2D,1,De,re.width,re.height):t.texImage2D(i.TEXTURE_2D,0,De,re.width,re.height,0,ce,Ue,null));else if(w.isDataTexture)if(Fe.length>0){N&&xe&&t.texStorage2D(i.TEXTURE_2D,ue,De,Fe[0].width,Fe[0].height);for(let ae=0,te=Fe.length;ae<te;ae++)Me=Fe[ae],N?pe&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,Me.width,Me.height,ce,Ue,Me.data):t.texImage2D(i.TEXTURE_2D,ae,De,Me.width,Me.height,0,ce,Ue,Me.data);w.generateMipmaps=!1}else N?(xe&&t.texStorage2D(i.TEXTURE_2D,ue,De,re.width,re.height),pe&&mt(w,re,ce,Ue)):t.texImage2D(i.TEXTURE_2D,0,De,re.width,re.height,0,ce,Ue,re.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){N&&xe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ue,De,Fe[0].width,Fe[0].height,re.depth);for(let ae=0,te=Fe.length;ae<te;ae++)if(Me=Fe[ae],w.format!==_n)if(ce!==null)if(N){if(pe)if(w.layerUpdates.size>0){const Ae=$c(Me.width,Me.height,w.format,w.type);for(const Ye of w.layerUpdates){const yt=Me.data.subarray(Ye*Ae/Me.data.BYTES_PER_ELEMENT,(Ye+1)*Ae/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,Ye,Me.width,Me.height,1,ce,yt)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,Me.width,Me.height,re.depth,ce,Me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ae,De,Me.width,Me.height,re.depth,0,Me.data,0,0);else qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?pe&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,Me.width,Me.height,re.depth,ce,Ue,Me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ae,De,Me.width,Me.height,re.depth,0,ce,Ue,Me.data)}else{N&&xe&&t.texStorage2D(i.TEXTURE_2D,ue,De,Fe[0].width,Fe[0].height);for(let ae=0,te=Fe.length;ae<te;ae++)Me=Fe[ae],w.format!==_n?ce!==null?N?pe&&t.compressedTexSubImage2D(i.TEXTURE_2D,ae,0,0,Me.width,Me.height,ce,Me.data):t.compressedTexImage2D(i.TEXTURE_2D,ae,De,Me.width,Me.height,0,Me.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?pe&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,Me.width,Me.height,ce,Ue,Me.data):t.texImage2D(i.TEXTURE_2D,ae,De,Me.width,Me.height,0,ce,Ue,Me.data)}else if(w.isDataArrayTexture)if(N){if(xe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ue,De,re.width,re.height,re.depth),pe)if(w.layerUpdates.size>0){const ae=$c(re.width,re.height,w.format,w.type);for(const te of w.layerUpdates){const Ae=re.data.subarray(te*ae/re.data.BYTES_PER_ELEMENT,(te+1)*ae/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,te,re.width,re.height,1,ce,Ue,Ae)}w.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,ce,Ue,re.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,De,re.width,re.height,re.depth,0,ce,Ue,re.data);else if(w.isData3DTexture)N?(xe&&t.texStorage3D(i.TEXTURE_3D,ue,De,re.width,re.height,re.depth),pe&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,ce,Ue,re.data)):t.texImage3D(i.TEXTURE_3D,0,De,re.width,re.height,re.depth,0,ce,Ue,re.data);else if(w.isFramebufferTexture){if(xe)if(N)t.texStorage2D(i.TEXTURE_2D,ue,De,re.width,re.height);else{let ae=re.width,te=re.height;for(let Ae=0;Ae<ue;Ae++)t.texImage2D(i.TEXTURE_2D,Ae,De,ae,te,0,ce,Ue,null),ae>>=1,te>>=1}}else if(Fe.length>0){if(N&&xe){const ae=ye(Fe[0]);t.texStorage2D(i.TEXTURE_2D,ue,De,ae.width,ae.height)}for(let ae=0,te=Fe.length;ae<te;ae++)Me=Fe[ae],N?pe&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,ce,Ue,Me):t.texImage2D(i.TEXTURE_2D,ae,De,ce,Ue,Me);w.generateMipmaps=!1}else if(N){if(xe){const ae=ye(re);t.texStorage2D(i.TEXTURE_2D,ue,De,ae.width,ae.height)}pe&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ce,Ue,re)}else t.texImage2D(i.TEXTURE_2D,0,De,ce,Ue,re);m(w)&&h(Z),Re.__version=X.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function ie(L,w,F){if(w.image.length!==6)return;const Z=it(L,w),ne=w.source;t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+F);const X=n.get(ne);if(ne.version!==X.__version||Z===!0){t.activeTexture(i.TEXTURE0+F);const Re=st.getPrimaries(st.workingColorSpace),me=w.colorSpace===jn?null:st.getPrimaries(w.colorSpace),we=w.colorSpace===jn||Re===me?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);const Te=w.isCompressedTexture||w.image[0].isCompressedTexture,re=w.image[0]&&w.image[0].isDataTexture,ce=[];for(let te=0;te<6;te++)!Te&&!re?ce[te]=M(w.image[te],!0,s.maxCubemapSize):ce[te]=re?w.image[te].image:w.image[te],ce[te]=oe(w,ce[te]);const Ue=ce[0],De=r.convert(w.format,w.colorSpace),Me=r.convert(w.type),Fe=_(w.internalFormat,De,Me,w.colorSpace),N=w.isVideoTexture!==!0,xe=X.__version===void 0||Z===!0,pe=ne.dataReady;let ue=E(w,Ue);je(i.TEXTURE_CUBE_MAP,w);let ae;if(Te){N&&xe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ue,Fe,Ue.width,Ue.height);for(let te=0;te<6;te++){ae=ce[te].mipmaps;for(let Ae=0;Ae<ae.length;Ae++){const Ye=ae[Ae];w.format!==_n?De!==null?N?pe&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae,0,0,Ye.width,Ye.height,De,Ye.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae,Fe,Ye.width,Ye.height,0,Ye.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?pe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae,0,0,Ye.width,Ye.height,De,Me,Ye.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae,Fe,Ye.width,Ye.height,0,De,Me,Ye.data)}}}else{if(ae=w.mipmaps,N&&xe){ae.length>0&&ue++;const te=ye(ce[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ue,Fe,te.width,te.height)}for(let te=0;te<6;te++)if(re){N?pe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,ce[te].width,ce[te].height,De,Me,ce[te].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Fe,ce[te].width,ce[te].height,0,De,Me,ce[te].data);for(let Ae=0;Ae<ae.length;Ae++){const yt=ae[Ae].image[te].image;N?pe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae+1,0,0,yt.width,yt.height,De,Me,yt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae+1,Fe,yt.width,yt.height,0,De,Me,yt.data)}}else{N?pe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,De,Me,ce[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Fe,De,Me,ce[te]);for(let Ae=0;Ae<ae.length;Ae++){const Ye=ae[Ae];N?pe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae+1,0,0,De,Me,Ye.image[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ae+1,Fe,De,Me,Ye.image[te])}}}m(w)&&h(i.TEXTURE_CUBE_MAP),X.__version=ne.version,w.onUpdate&&w.onUpdate(w)}L.__version=w.version}function be(L,w,F,Z,ne,X){const Re=r.convert(F.format,F.colorSpace),me=r.convert(F.type),we=_(F.internalFormat,Re,me,F.colorSpace),Te=n.get(w),re=n.get(F);if(re.__renderTarget=w,!Te.__hasExternalTextures){const ce=Math.max(1,w.width>>X),Ue=Math.max(1,w.height>>X);ne===i.TEXTURE_3D||ne===i.TEXTURE_2D_ARRAY?t.texImage3D(ne,X,we,ce,Ue,w.depth,0,Re,me,null):t.texImage2D(ne,X,we,ce,Ue,0,Re,me,null)}t.bindFramebuffer(i.FRAMEBUFFER,L),se(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,ne,re.__webglTexture,0,le(w)):(ne===i.TEXTURE_2D||ne>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,ne,re.__webglTexture,X),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ve(L,w,F){if(i.bindRenderbuffer(i.RENDERBUFFER,L),w.depthBuffer){const Z=w.depthTexture,ne=Z&&Z.isDepthTexture?Z.type:null,X=b(w.stencilBuffer,ne),Re=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=le(w);se(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,me,X,w.width,w.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,me,X,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,X,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Re,i.RENDERBUFFER,L)}else{const Z=w.textures;for(let ne=0;ne<Z.length;ne++){const X=Z[ne],Re=r.convert(X.format,X.colorSpace),me=r.convert(X.type),we=_(X.internalFormat,Re,me,X.colorSpace),Te=le(w);F&&se(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Te,we,w.width,w.height):se(w)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Te,we,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,we,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Le(L,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,L),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(w.depthTexture);Z.__renderTarget=w,(!Z.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),Y(w.depthTexture,0);const ne=Z.__webglTexture,X=le(w);if(w.depthTexture.format===Ls)se(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ne,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ne,0);else if(w.depthTexture.format===Ds)se(w)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ne,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ne,0);else throw new Error("Unknown depthTexture format")}function Xe(L){const w=n.get(L),F=L.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==L.depthTexture){const Z=L.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),Z){const ne=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,Z.removeEventListener("dispose",ne)};Z.addEventListener("dispose",ne),w.__depthDisposeCallback=ne}w.__boundDepthTexture=Z}if(L.depthTexture&&!w.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");const Z=L.texture.mipmaps;Z&&Z.length>0?Le(w.__webglFramebuffer[0],L):Le(w.__webglFramebuffer,L)}else if(F){w.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[Z]),w.__webglDepthbuffer[Z]===void 0)w.__webglDepthbuffer[Z]=i.createRenderbuffer(),Ve(w.__webglDepthbuffer[Z],L,!1);else{const ne=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=w.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,X)}}else{const Z=L.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=i.createRenderbuffer(),Ve(w.__webglDepthbuffer,L,!1);else{const ne=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=w.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,X)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ut(L,w,F){const Z=n.get(L);w!==void 0&&be(Z.__webglFramebuffer,L,L.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&Xe(L)}function Ke(L){const w=L.texture,F=n.get(L),Z=n.get(w);L.addEventListener("dispose",P);const ne=L.textures,X=L.isWebGLCubeRenderTarget===!0,Re=ne.length>1;if(Re||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=w.version,a.memory.textures++),X){F.__webglFramebuffer=[];for(let me=0;me<6;me++)if(w.mipmaps&&w.mipmaps.length>0){F.__webglFramebuffer[me]=[];for(let we=0;we<w.mipmaps.length;we++)F.__webglFramebuffer[me][we]=i.createFramebuffer()}else F.__webglFramebuffer[me]=i.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){F.__webglFramebuffer=[];for(let me=0;me<w.mipmaps.length;me++)F.__webglFramebuffer[me]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(Re)for(let me=0,we=ne.length;me<we;me++){const Te=n.get(ne[me]);Te.__webglTexture===void 0&&(Te.__webglTexture=i.createTexture(),a.memory.textures++)}if(L.samples>0&&se(L)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let me=0;me<ne.length;me++){const we=ne[me];F.__webglColorRenderbuffer[me]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[me]);const Te=r.convert(we.format,we.colorSpace),re=r.convert(we.type),ce=_(we.internalFormat,Te,re,we.colorSpace,L.isXRRenderTarget===!0),Ue=le(L);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ue,ce,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+me,i.RENDERBUFFER,F.__webglColorRenderbuffer[me])}i.bindRenderbuffer(i.RENDERBUFFER,null),L.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),Ve(F.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(X){t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),je(i.TEXTURE_CUBE_MAP,w);for(let me=0;me<6;me++)if(w.mipmaps&&w.mipmaps.length>0)for(let we=0;we<w.mipmaps.length;we++)be(F.__webglFramebuffer[me][we],L,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+me,we);else be(F.__webglFramebuffer[me],L,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0);m(w)&&h(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Re){for(let me=0,we=ne.length;me<we;me++){const Te=ne[me],re=n.get(Te);let ce=i.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ce=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ce,re.__webglTexture),je(ce,Te),be(F.__webglFramebuffer,L,Te,i.COLOR_ATTACHMENT0+me,ce,0),m(Te)&&h(ce)}t.unbindTexture()}else{let me=i.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(me=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(me,Z.__webglTexture),je(me,w),w.mipmaps&&w.mipmaps.length>0)for(let we=0;we<w.mipmaps.length;we++)be(F.__webglFramebuffer[we],L,w,i.COLOR_ATTACHMENT0,me,we);else be(F.__webglFramebuffer,L,w,i.COLOR_ATTACHMENT0,me,0);m(w)&&h(me),t.unbindTexture()}L.depthBuffer&&Xe(L)}function ct(L){const w=L.textures;for(let F=0,Z=w.length;F<Z;F++){const ne=w[F];if(m(ne)){const X=v(L),Re=n.get(ne).__webglTexture;t.bindTexture(X,Re),h(X),t.unbindTexture()}}}const U=[],j=[];function $(L){if(L.samples>0){if(se(L)===!1){const w=L.textures,F=L.width,Z=L.height;let ne=i.COLOR_BUFFER_BIT;const X=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Re=n.get(L),me=w.length>1;if(me)for(let Te=0;Te<w.length;Te++)t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer);const we=L.texture.mipmaps;we&&we.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let Te=0;Te<w.length;Te++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(ne|=i.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(ne|=i.STENCIL_BUFFER_BIT)),me){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Re.__webglColorRenderbuffer[Te]);const re=n.get(w[Te]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,re,0)}i.blitFramebuffer(0,0,F,Z,0,0,F,Z,ne,i.NEAREST),c===!0&&(U.length=0,j.length=0,U.push(i.COLOR_ATTACHMENT0+Te),L.depthBuffer&&L.resolveDepthBuffer===!1&&(U.push(X),j.push(X),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,j)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,U))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),me)for(let Te=0;Te<w.length;Te++){t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.RENDERBUFFER,Re.__webglColorRenderbuffer[Te]);const re=n.get(w[Te]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.TEXTURE_2D,re,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const w=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[w])}}}function le(L){return Math.min(s.maxSamples,L.samples)}function se(L){const w=n.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function _e(L){const w=a.render.frame;d.get(L)!==w&&(d.set(L,w),L.update())}function oe(L,w){const F=L.colorSpace,Z=L.format,ne=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||F!==ji&&F!==jn&&(st.getTransfer(F)===ht?(Z!==_n||ne!==Dn)&&qe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Pt("WebGLTextures: Unsupported texture color space:",F)),w}function ye(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=O,this.resetTextureUnits=I,this.setTexture2D=Y,this.setTexture2DArray=H,this.setTexture3D=Q,this.setTextureCube=W,this.rebindTextures=Ut,this.setupRenderTarget=Ke,this.updateRenderTargetMipmap=ct,this.updateMultisampleRenderTarget=$,this.setupDepthRenderbuffer=Xe,this.setupFrameBufferTexture=be,this.useMultisampledRTT=se}function Fx(i,e){function t(n,s=jn){let r;const a=st.getTransfer(s);if(n===Dn)return i.UNSIGNED_BYTE;if(n===wo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===To)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Xl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===ql)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Hl)return i.BYTE;if(n===Wl)return i.SHORT;if(n===Rs)return i.UNSIGNED_SHORT;if(n===bo)return i.INT;if(n===Si)return i.UNSIGNED_INT;if(n===An)return i.FLOAT;if(n===Pn)return i.HALF_FLOAT;if(n===Yl)return i.ALPHA;if(n===$l)return i.RGB;if(n===_n)return i.RGBA;if(n===Ls)return i.DEPTH_COMPONENT;if(n===Ds)return i.DEPTH_STENCIL;if(n===Eo)return i.RED;if(n===Ao)return i.RED_INTEGER;if(n===Co)return i.RG;if(n===Ro)return i.RG_INTEGER;if(n===Po)return i.RGBA_INTEGER;if(n===gr||n===_r||n===vr||n===Mr)if(a===ht)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===_r)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Mr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Oa||n===Ba||n===za||n===Va)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Oa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ba)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===za)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Va)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ka||n===Ga||n===Ha)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ka||n===Ga)return a===ht?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ha)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Wa||n===Xa||n===qa||n===Ya||n===$a||n===Za||n===Ka||n===Ja||n===ja||n===Qa||n===eo||n===to||n===no||n===io)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Wa)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Xa)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===qa)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ya)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===$a)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Za)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ka)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ja)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ja)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Qa)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===eo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===to)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===no)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===io)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===so||n===ro||n===ao)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===so)return a===ht?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ro)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ao)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===oo||n===co||n===lo||n===ho)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===oo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===co)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===lo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ho)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ps?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Ox=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Bx=`
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

}`;class zx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new oh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Gt({vertexShader:Ox,fragmentShader:Bx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new q(new Dt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Vx extends ss{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,d=null,u=null,f=null,p=null,g=null;const M=typeof XRWebGLBinding<"u",m=new zx,h={},v=t.getContextAttributes();let _=null,b=null;const E=[],T=[],P=new ge;let A=null;const y=new en;y.viewport=new _t;const x=new en;x.viewport=new _t;const R=[y,x],I=new sf;let O=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ie=E[J];return ie===void 0&&(ie=new ca,E[J]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(J){let ie=E[J];return ie===void 0&&(ie=new ca,E[J]=ie),ie.getGripSpace()},this.getHand=function(J){let ie=E[J];return ie===void 0&&(ie=new ca,E[J]=ie),ie.getHandSpace()};function Y(J){const ie=T.indexOf(J.inputSource);if(ie===-1)return;const be=E[ie];be!==void 0&&(be.update(J.inputSource,J.frame,l||a),be.dispatchEvent({type:J.type,data:J.inputSource}))}function H(){s.removeEventListener("select",Y),s.removeEventListener("selectstart",Y),s.removeEventListener("selectend",Y),s.removeEventListener("squeeze",Y),s.removeEventListener("squeezestart",Y),s.removeEventListener("squeezeend",Y),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",Q);for(let J=0;J<E.length;J++){const ie=T[J];ie!==null&&(T[J]=null,E[J].disconnect(ie))}O=null,V=null,m.reset();for(const J in h)delete h[J];e.setRenderTarget(_),p=null,f=null,u=null,s=null,b=null,mt.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&qe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&qe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u===null&&M&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(_=e.getRenderTarget(),s.addEventListener("select",Y),s.addEventListener("selectstart",Y),s.addEventListener("selectend",Y),s.addEventListener("squeeze",Y),s.addEventListener("squeezestart",Y),s.addEventListener("squeezeend",Y),s.addEventListener("end",H),s.addEventListener("inputsourceschange",Q),v.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(P),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let be=null,Ve=null,Le=null;v.depth&&(Le=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,be=v.stencil?Ds:Ls,Ve=v.stencil?Ps:Si);const Xe={colorFormat:t.RGBA8,depthFormat:Le,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Xe),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),b=new vn(f.textureWidth,f.textureHeight,{format:_n,type:Dn,depthTexture:new ah(f.textureWidth,f.textureHeight,Ve,void 0,void 0,void 0,void 0,void 0,void 0,be),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const be={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,be),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),b=new vn(p.framebufferWidth,p.framebufferHeight,{format:_n,type:Dn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),mt.setContext(s),mt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Q(J){for(let ie=0;ie<J.removed.length;ie++){const be=J.removed[ie],Ve=T.indexOf(be);Ve>=0&&(T[Ve]=null,E[Ve].disconnect(be))}for(let ie=0;ie<J.added.length;ie++){const be=J.added[ie];let Ve=T.indexOf(be);if(Ve===-1){for(let Xe=0;Xe<E.length;Xe++)if(Xe>=T.length){T.push(be),Ve=Xe;break}else if(T[Xe]===null){T[Xe]=be,Ve=Xe;break}if(Ve===-1)break}const Le=E[Ve];Le&&Le.connect(be)}}const W=new D,he=new D;function de(J,ie,be){W.setFromMatrixPosition(ie.matrixWorld),he.setFromMatrixPosition(be.matrixWorld);const Ve=W.distanceTo(he),Le=ie.projectionMatrix.elements,Xe=be.projectionMatrix.elements,Ut=Le[14]/(Le[10]-1),Ke=Le[14]/(Le[10]+1),ct=(Le[9]+1)/Le[5],U=(Le[9]-1)/Le[5],j=(Le[8]-1)/Le[0],$=(Xe[8]+1)/Xe[0],le=Ut*j,se=Ut*$,_e=Ve/(-j+$),oe=_e*-j;if(ie.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(oe),J.translateZ(_e),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Le[10]===-1)J.projectionMatrix.copy(ie.projectionMatrix),J.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const ye=Ut+_e,L=Ke+_e,w=le-oe,F=se+(Ve-oe),Z=ct*Ke/L*ye,ne=U*Ke/L*ye;J.projectionMatrix.makePerspective(w,F,Z,ne,ye,L),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function Pe(J,ie){ie===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ie.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let ie=J.near,be=J.far;m.texture!==null&&(m.depthNear>0&&(ie=m.depthNear),m.depthFar>0&&(be=m.depthFar)),I.near=x.near=y.near=ie,I.far=x.far=y.far=be,(O!==I.near||V!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),O=I.near,V=I.far),I.layers.mask=J.layers.mask|6,y.layers.mask=I.layers.mask&3,x.layers.mask=I.layers.mask&5;const Ve=J.parent,Le=I.cameras;Pe(I,Ve);for(let Xe=0;Xe<Le.length;Xe++)Pe(Le[Xe],Ve);Le.length===2?de(I,y,x):I.projectionMatrix.copy(y.projectionMatrix),je(J,I,Ve)};function je(J,ie,be){be===null?J.matrix.copy(ie.matrixWorld):(J.matrix.copy(be.matrixWorld),J.matrix.invert(),J.matrix.multiply(ie.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ie.projectionMatrix),J.projectionMatrixInverse.copy(ie.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Us*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(J){c=J,f!==null&&(f.fixedFoveation=J),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(J){return h[J]};let it=null;function pt(J,ie){if(d=ie.getViewerPose(l||a),g=ie,d!==null){const be=d.views;p!==null&&(e.setRenderTargetFramebuffer(b,p.framebuffer),e.setRenderTarget(b));let Ve=!1;be.length!==I.cameras.length&&(I.cameras.length=0,Ve=!0);for(let Ke=0;Ke<be.length;Ke++){const ct=be[Ke];let U=null;if(p!==null)U=p.getViewport(ct);else{const $=u.getViewSubImage(f,ct);U=$.viewport,Ke===0&&(e.setRenderTargetTextures(b,$.colorTexture,$.depthStencilTexture),e.setRenderTarget(b))}let j=R[Ke];j===void 0&&(j=new en,j.layers.enable(Ke),j.viewport=new _t,R[Ke]=j),j.matrix.fromArray(ct.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(ct.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(U.x,U.y,U.width,U.height),Ke===0&&(I.matrix.copy(j.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Ve===!0&&I.cameras.push(j)}const Le=s.enabledFeatures;if(Le&&Le.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){u=n.getBinding();const Ke=u.getDepthInformation(be[0]);Ke&&Ke.isValid&&Ke.texture&&m.init(Ke,s.renderState)}if(Le&&Le.includes("camera-access")&&M){e.state.unbindTexture(),u=n.getBinding();for(let Ke=0;Ke<be.length;Ke++){const ct=be[Ke].camera;if(ct){let U=h[ct];U||(U=new oh,h[ct]=U);const j=u.getCameraImage(ct);U.sourceTexture=j}}}}for(let be=0;be<E.length;be++){const Ve=T[be],Le=E[be];Ve!==null&&Le!==void 0&&Le.update(Ve,ie,l||a)}it&&it(J,ie),ie.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ie}),g=null}const mt=new Mh;mt.setAnimationLoop(pt),this.setAnimationLoop=function(J){it=J},this.dispose=function(){}}}const ui=new Sn,kx=new lt;function Gx(i,e){function t(m,h){m.matrixAutoUpdate===!0&&m.updateMatrix(),h.value.copy(m.matrix)}function n(m,h){h.color.getRGB(m.fogColor.value,th(i)),h.isFog?(m.fogNear.value=h.near,m.fogFar.value=h.far):h.isFogExp2&&(m.fogDensity.value=h.density)}function s(m,h,v,_,b){h.isMeshBasicMaterial||h.isMeshLambertMaterial?r(m,h):h.isMeshToonMaterial?(r(m,h),u(m,h)):h.isMeshPhongMaterial?(r(m,h),d(m,h)):h.isMeshStandardMaterial?(r(m,h),f(m,h),h.isMeshPhysicalMaterial&&p(m,h,b)):h.isMeshMatcapMaterial?(r(m,h),g(m,h)):h.isMeshDepthMaterial?r(m,h):h.isMeshDistanceMaterial?(r(m,h),M(m,h)):h.isMeshNormalMaterial?r(m,h):h.isLineBasicMaterial?(a(m,h),h.isLineDashedMaterial&&o(m,h)):h.isPointsMaterial?c(m,h,v,_):h.isSpriteMaterial?l(m,h):h.isShadowMaterial?(m.color.value.copy(h.color),m.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function r(m,h){m.opacity.value=h.opacity,h.color&&m.diffuse.value.copy(h.color),h.emissive&&m.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(m.map.value=h.map,t(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.bumpMap&&(m.bumpMap.value=h.bumpMap,t(h.bumpMap,m.bumpMapTransform),m.bumpScale.value=h.bumpScale,h.side===Ht&&(m.bumpScale.value*=-1)),h.normalMap&&(m.normalMap.value=h.normalMap,t(h.normalMap,m.normalMapTransform),m.normalScale.value.copy(h.normalScale),h.side===Ht&&m.normalScale.value.negate()),h.displacementMap&&(m.displacementMap.value=h.displacementMap,t(h.displacementMap,m.displacementMapTransform),m.displacementScale.value=h.displacementScale,m.displacementBias.value=h.displacementBias),h.emissiveMap&&(m.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,m.emissiveMapTransform)),h.specularMap&&(m.specularMap.value=h.specularMap,t(h.specularMap,m.specularMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest);const v=e.get(h),_=v.envMap,b=v.envMapRotation;_&&(m.envMap.value=_,ui.copy(b),ui.x*=-1,ui.y*=-1,ui.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(ui.y*=-1,ui.z*=-1),m.envMapRotation.value.setFromMatrix4(kx.makeRotationFromEuler(ui)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=h.reflectivity,m.ior.value=h.ior,m.refractionRatio.value=h.refractionRatio),h.lightMap&&(m.lightMap.value=h.lightMap,m.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,m.lightMapTransform)),h.aoMap&&(m.aoMap.value=h.aoMap,m.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,m.aoMapTransform))}function a(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,h.map&&(m.map.value=h.map,t(h.map,m.mapTransform))}function o(m,h){m.dashSize.value=h.dashSize,m.totalSize.value=h.dashSize+h.gapSize,m.scale.value=h.scale}function c(m,h,v,_){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.size.value=h.size*v,m.scale.value=_*.5,h.map&&(m.map.value=h.map,t(h.map,m.uvTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function l(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.rotation.value=h.rotation,h.map&&(m.map.value=h.map,t(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function d(m,h){m.specular.value.copy(h.specular),m.shininess.value=Math.max(h.shininess,1e-4)}function u(m,h){h.gradientMap&&(m.gradientMap.value=h.gradientMap)}function f(m,h){m.metalness.value=h.metalness,h.metalnessMap&&(m.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,m.metalnessMapTransform)),m.roughness.value=h.roughness,h.roughnessMap&&(m.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,m.roughnessMapTransform)),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)}function p(m,h,v){m.ior.value=h.ior,h.sheen>0&&(m.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),m.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(m.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,m.sheenColorMapTransform)),h.sheenRoughnessMap&&(m.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,m.sheenRoughnessMapTransform))),h.clearcoat>0&&(m.clearcoat.value=h.clearcoat,m.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(m.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,m.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(m.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===Ht&&m.clearcoatNormalScale.value.negate())),h.dispersion>0&&(m.dispersion.value=h.dispersion),h.iridescence>0&&(m.iridescence.value=h.iridescence,m.iridescenceIOR.value=h.iridescenceIOR,m.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(m.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,m.iridescenceMapTransform)),h.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),h.transmission>0&&(m.transmission.value=h.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),h.transmissionMap&&(m.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,m.transmissionMapTransform)),m.thickness.value=h.thickness,h.thicknessMap&&(m.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=h.attenuationDistance,m.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(m.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(m.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=h.specularIntensity,m.specularColor.value.copy(h.specularColor),h.specularColorMap&&(m.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,m.specularColorMapTransform)),h.specularIntensityMap&&(m.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,h){h.matcap&&(m.matcap.value=h.matcap)}function M(m,h){const v=e.get(h).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Hx(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,_){const b=_.program;n.uniformBlockBinding(v,b)}function l(v,_){let b=s[v.id];b===void 0&&(g(v),b=d(v),s[v.id]=b,v.addEventListener("dispose",m));const E=_.program;n.updateUBOMapping(v,E);const T=e.render.frame;r[v.id]!==T&&(f(v),r[v.id]=T)}function d(v){const _=u();v.__bindingPointIndex=_;const b=i.createBuffer(),E=v.__size,T=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,E,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,b),b}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return Pt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const _=s[v.id],b=v.uniforms,E=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let T=0,P=b.length;T<P;T++){const A=Array.isArray(b[T])?b[T]:[b[T]];for(let y=0,x=A.length;y<x;y++){const R=A[y];if(p(R,T,y,E)===!0){const I=R.__offset,O=Array.isArray(R.value)?R.value:[R.value];let V=0;for(let Y=0;Y<O.length;Y++){const H=O[Y],Q=M(H);typeof H=="number"||typeof H=="boolean"?(R.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,I+V,R.__data)):H.isMatrix3?(R.__data[0]=H.elements[0],R.__data[1]=H.elements[1],R.__data[2]=H.elements[2],R.__data[3]=0,R.__data[4]=H.elements[3],R.__data[5]=H.elements[4],R.__data[6]=H.elements[5],R.__data[7]=0,R.__data[8]=H.elements[6],R.__data[9]=H.elements[7],R.__data[10]=H.elements[8],R.__data[11]=0):(H.toArray(R.__data,V),V+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,I,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(v,_,b,E){const T=v.value,P=_+"_"+b;if(E[P]===void 0)return typeof T=="number"||typeof T=="boolean"?E[P]=T:E[P]=T.clone(),!0;{const A=E[P];if(typeof T=="number"||typeof T=="boolean"){if(A!==T)return E[P]=T,!0}else if(A.equals(T)===!1)return A.copy(T),!0}return!1}function g(v){const _=v.uniforms;let b=0;const E=16;for(let P=0,A=_.length;P<A;P++){const y=Array.isArray(_[P])?_[P]:[_[P]];for(let x=0,R=y.length;x<R;x++){const I=y[x],O=Array.isArray(I.value)?I.value:[I.value];for(let V=0,Y=O.length;V<Y;V++){const H=O[V],Q=M(H),W=b%E,he=W%Q.boundary,de=W+he;b+=he,de!==0&&E-de<Q.storage&&(b+=E-de),I.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=b,b+=Q.storage}}}const T=b%E;return T>0&&(b+=E-T),v.__size=b,v.__cache={},this}function M(v){const _={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(_.boundary=4,_.storage=4):v.isVector2?(_.boundary=8,_.storage=8):v.isVector3||v.isColor?(_.boundary=16,_.storage=12):v.isVector4?(_.boundary=16,_.storage=16):v.isMatrix3?(_.boundary=48,_.storage=48):v.isMatrix4?(_.boundary=64,_.storage=64):v.isTexture?qe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):qe("WebGLRenderer: Unsupported uniform value type.",v),_}function m(v){const _=v.target;_.removeEventListener("dispose",m);const b=a.indexOf(_.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function h(){for(const v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:l,dispose:h}}const Wx=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let zn=null;function Xx(){return zn===null&&(zn=new rh(Wx,32,32,Co,Pn),zn.minFilter=ln,zn.magFilter=ln,zn.wrapS=Gn,zn.wrapT=Gn,zn.generateMipmaps=!1,zn.needsUpdate=!0),zn}class qx{constructor(e={}){const{canvas:t=Ad(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=new Set([Po,Ro,Ao]),M=new Set([Dn,Si,Rs,Ps,wo,To]),m=new Uint32Array(4),h=new Int32Array(4);let v=null,_=null;const b=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ni,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let P=!1;this._outputColorSpace=bt;let A=0,y=0,x=null,R=-1,I=null;const O=new _t,V=new _t;let Y=null;const H=new He(0);let Q=0,W=t.width,he=t.height,de=1,Pe=null,je=null;const it=new _t(0,0,W,he),pt=new _t(0,0,W,he);let mt=!1;const J=new Oo;let ie=!1,be=!1;const Ve=new lt,Le=new D,Xe=new _t,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ke=!1;function ct(){return x===null?de:1}let U=n;function j(C,B){return t.getContext(C,B)}try{const C={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Mo}`),t.addEventListener("webglcontextlost",ae,!1),t.addEventListener("webglcontextrestored",te,!1),t.addEventListener("webglcontextcreationerror",Ae,!1),U===null){const B="webgl2";if(U=j(B,C),U===null)throw j(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw C("WebGLRenderer: "+C.message),C}let $,le,se,_e,oe,ye,L,w,F,Z,ne,X,Re,me,we,Te,re,ce,Ue,De,Me,Fe,N,xe;function pe(){$=new em(U),$.init(),Fe=new Fx(U,$),le=new X0(U,$,e,Fe),se=new Ux(U,$),le.reversedDepthBuffer&&f&&se.buffers.depth.setReversed(!0),_e=new im(U),oe=new Sx,ye=new Nx(U,$,se,oe,le,Fe,_e),L=new Y0(T),w=new Q0(T),F=new of(U),N=new H0(U,F),Z=new tm(U,F,_e,N),ne=new rm(U,Z,F,_e),Ue=new sm(U,le,ye),Te=new q0(oe),X=new Mx(T,L,w,$,le,N,Te),Re=new Gx(T,oe),me=new bx,we=new Rx($),ce=new G0(T,L,w,se,ne,p,c),re=new Dx(T,ne,le),xe=new Hx(U,_e,le,se),De=new W0(U,$,_e),Me=new nm(U,$,_e),_e.programs=X.programs,T.capabilities=le,T.extensions=$,T.properties=oe,T.renderLists=me,T.shadowMap=re,T.state=se,T.info=_e}pe();const ue=new Vx(T,U);this.xr=ue,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const C=$.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=$.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return de},this.setPixelRatio=function(C){C!==void 0&&(de=C,this.setSize(W,he,!1))},this.getSize=function(C){return C.set(W,he)},this.setSize=function(C,B,k=!0){if(ue.isPresenting){qe("WebGLRenderer: Can't change size while VR device is presenting.");return}W=C,he=B,t.width=Math.floor(C*de),t.height=Math.floor(B*de),k===!0&&(t.style.width=C+"px",t.style.height=B+"px"),this.setViewport(0,0,C,B)},this.getDrawingBufferSize=function(C){return C.set(W*de,he*de).floor()},this.setDrawingBufferSize=function(C,B,k){W=C,he=B,de=k,t.width=Math.floor(C*k),t.height=Math.floor(B*k),this.setViewport(0,0,C,B)},this.getCurrentViewport=function(C){return C.copy(O)},this.getViewport=function(C){return C.copy(it)},this.setViewport=function(C,B,k,G){C.isVector4?it.set(C.x,C.y,C.z,C.w):it.set(C,B,k,G),se.viewport(O.copy(it).multiplyScalar(de).round())},this.getScissor=function(C){return C.copy(pt)},this.setScissor=function(C,B,k,G){C.isVector4?pt.set(C.x,C.y,C.z,C.w):pt.set(C,B,k,G),se.scissor(V.copy(pt).multiplyScalar(de).round())},this.getScissorTest=function(){return mt},this.setScissorTest=function(C){se.setScissorTest(mt=C)},this.setOpaqueSort=function(C){Pe=C},this.setTransparentSort=function(C){je=C},this.getClearColor=function(C){return C.copy(ce.getClearColor())},this.setClearColor=function(){ce.setClearColor(...arguments)},this.getClearAlpha=function(){return ce.getClearAlpha()},this.setClearAlpha=function(){ce.setClearAlpha(...arguments)},this.clear=function(C=!0,B=!0,k=!0){let G=0;if(C){let z=!1;if(x!==null){const fe=x.texture.format;z=g.has(fe)}if(z){const fe=x.texture.type,Se=M.has(fe),Ce=ce.getClearColor(),Ee=ce.getClearAlpha(),Oe=Ce.r,ke=Ce.g,Ie=Ce.b;Se?(m[0]=Oe,m[1]=ke,m[2]=Ie,m[3]=Ee,U.clearBufferuiv(U.COLOR,0,m)):(h[0]=Oe,h[1]=ke,h[2]=Ie,h[3]=Ee,U.clearBufferiv(U.COLOR,0,h))}else G|=U.COLOR_BUFFER_BIT}B&&(G|=U.DEPTH_BUFFER_BIT),k&&(G|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ae,!1),t.removeEventListener("webglcontextrestored",te,!1),t.removeEventListener("webglcontextcreationerror",Ae,!1),ce.dispose(),me.dispose(),we.dispose(),oe.dispose(),L.dispose(),w.dispose(),ne.dispose(),N.dispose(),xe.dispose(),X.dispose(),ue.dispose(),ue.removeEventListener("sessionstart",jo),ue.removeEventListener("sessionend",Qo),ri.stop()};function ae(C){C.preventDefault(),uc("WebGLRenderer: Context Lost."),P=!0}function te(){uc("WebGLRenderer: Context Restored."),P=!1;const C=_e.autoReset,B=re.enabled,k=re.autoUpdate,G=re.needsUpdate,z=re.type;pe(),_e.autoReset=C,re.enabled=B,re.autoUpdate=k,re.needsUpdate=G,re.type=z}function Ae(C){Pt("WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Ye(C){const B=C.target;B.removeEventListener("dispose",Ye),yt(B)}function yt(C){xt(C),oe.remove(C)}function xt(C){const B=oe.get(C).programs;B!==void 0&&(B.forEach(function(k){X.releaseProgram(k)}),C.isShaderMaterial&&X.releaseShaderCache(C))}this.renderBufferDirect=function(C,B,k,G,z,fe){B===null&&(B=Ut);const Se=z.isMesh&&z.matrixWorld.determinant()<0,Ce=Gh(C,B,k,G,z);se.setMaterial(G,Se);let Ee=k.index,Oe=1;if(G.wireframe===!0){if(Ee=Z.getWireframeAttribute(k),Ee===void 0)return;Oe=2}const ke=k.drawRange,Ie=k.attributes.position;let nt=ke.start*Oe,gt=(ke.start+ke.count)*Oe;fe!==null&&(nt=Math.max(nt,fe.start*Oe),gt=Math.min(gt,(fe.start+fe.count)*Oe)),Ee!==null?(nt=Math.max(nt,0),gt=Math.min(gt,Ee.count)):Ie!=null&&(nt=Math.max(nt,0),gt=Math.min(gt,Ie.count));const Ct=gt-nt;if(Ct<0||Ct===1/0)return;N.setup(z,G,Ce,k,Ee);let Rt,vt=De;if(Ee!==null&&(Rt=F.get(Ee),vt=Me,vt.setIndex(Rt)),z.isMesh)G.wireframe===!0?(se.setLineWidth(G.wireframeLinewidth*ct()),vt.setMode(U.LINES)):vt.setMode(U.TRIANGLES);else if(z.isLine){let Ne=G.linewidth;Ne===void 0&&(Ne=1),se.setLineWidth(Ne*ct()),z.isLineSegments?vt.setMode(U.LINES):z.isLineLoop?vt.setMode(U.LINE_LOOP):vt.setMode(U.LINE_STRIP)}else z.isPoints?vt.setMode(U.POINTS):z.isSprite&&vt.setMode(U.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)Is("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),vt.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if($.get("WEBGL_multi_draw"))vt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Ne=z._multiDrawStarts,Tt=z._multiDrawCounts,at=z._multiDrawCount,Kt=Ee?F.get(Ee).bytesPerElement:1,Ai=oe.get(G).currentProgram.getUniforms();for(let Jt=0;Jt<at;Jt++)Ai.setValue(U,"_gl_DrawID",Jt),vt.render(Ne[Jt]/Kt,Tt[Jt])}else if(z.isInstancedMesh)vt.renderInstances(nt,Ct,z.count);else if(k.isInstancedBufferGeometry){const Ne=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,Tt=Math.min(k.instanceCount,Ne);vt.renderInstances(nt,Ct,Tt)}else vt.render(nt,Ct)};function wn(C,B,k){C.transparent===!0&&C.side===St&&C.forceSinglePass===!1?(C.side=Ht,C.needsUpdate=!0,ks(C,B,k),C.side=si,C.needsUpdate=!0,ks(C,B,k),C.side=St):ks(C,B,k)}this.compile=function(C,B,k=null){k===null&&(k=C),_=we.get(k),_.init(B),E.push(_),k.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(_.pushLight(z),z.castShadow&&_.pushShadow(z))}),C!==k&&C.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(_.pushLight(z),z.castShadow&&_.pushShadow(z))}),_.setupLights();const G=new Set;return C.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const fe=z.material;if(fe)if(Array.isArray(fe))for(let Se=0;Se<fe.length;Se++){const Ce=fe[Se];wn(Ce,k,z),G.add(Ce)}else wn(fe,k,z),G.add(fe)}),_=E.pop(),G},this.compileAsync=function(C,B,k=null){const G=this.compile(C,B,k);return new Promise(z=>{function fe(){if(G.forEach(function(Se){oe.get(Se).currentProgram.isReady()&&G.delete(Se)}),G.size===0){z(C);return}setTimeout(fe,10)}$.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let dn=null;function kh(C){dn&&dn(C)}function jo(){ri.stop()}function Qo(){ri.start()}const ri=new Mh;ri.setAnimationLoop(kh),typeof self<"u"&&ri.setContext(self),this.setAnimationLoop=function(C){dn=C,ue.setAnimationLoop(C),C===null?ri.stop():ri.start()},ue.addEventListener("sessionstart",jo),ue.addEventListener("sessionend",Qo),this.render=function(C,B){if(B!==void 0&&B.isCamera!==!0){Pt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),ue.enabled===!0&&ue.isPresenting===!0&&(ue.cameraAutoUpdate===!0&&ue.updateCamera(B),B=ue.getCamera()),C.isScene===!0&&C.onBeforeRender(T,C,B,x),_=we.get(C,E.length),_.init(B),E.push(_),Ve.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),J.setFromProjectionMatrix(Ve,Cn,B.reversedDepth),be=this.localClippingEnabled,ie=Te.init(this.clippingPlanes,be),v=me.get(C,b.length),v.init(),b.push(v),ue.enabled===!0&&ue.isPresenting===!0){const fe=T.xr.getDepthSensingMesh();fe!==null&&zr(fe,B,-1/0,T.sortObjects)}zr(C,B,0,T.sortObjects),v.finish(),T.sortObjects===!0&&v.sort(Pe,je),Ke=ue.enabled===!1||ue.isPresenting===!1||ue.hasDepthSensing()===!1,Ke&&ce.addToRenderList(v,C),this.info.render.frame++,ie===!0&&Te.beginShadows();const k=_.state.shadowsArray;re.render(k,C,B),ie===!0&&Te.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=v.opaque,z=v.transmissive;if(_.setupLights(),B.isArrayCamera){const fe=B.cameras;if(z.length>0)for(let Se=0,Ce=fe.length;Se<Ce;Se++){const Ee=fe[Se];tc(G,z,C,Ee)}Ke&&ce.render(C);for(let Se=0,Ce=fe.length;Se<Ce;Se++){const Ee=fe[Se];ec(v,C,Ee,Ee.viewport)}}else z.length>0&&tc(G,z,C,B),Ke&&ce.render(C),ec(v,C,B);x!==null&&y===0&&(ye.updateMultisampleRenderTarget(x),ye.updateRenderTargetMipmap(x)),C.isScene===!0&&C.onAfterRender(T,C,B),N.resetDefaultState(),R=-1,I=null,E.pop(),E.length>0?(_=E[E.length-1],ie===!0&&Te.setGlobalState(T.clippingPlanes,_.state.camera)):_=null,b.pop(),b.length>0?v=b[b.length-1]:v=null};function zr(C,B,k,G){if(C.visible===!1)return;if(C.layers.test(B.layers)){if(C.isGroup)k=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(B);else if(C.isLight)_.pushLight(C),C.castShadow&&_.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||J.intersectsSprite(C)){G&&Xe.setFromMatrixPosition(C.matrixWorld).applyMatrix4(Ve);const Se=ne.update(C),Ce=C.material;Ce.visible&&v.push(C,Se,Ce,k,Xe.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||J.intersectsObject(C))){const Se=ne.update(C),Ce=C.material;if(G&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Xe.copy(C.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),Xe.copy(Se.boundingSphere.center)),Xe.applyMatrix4(C.matrixWorld).applyMatrix4(Ve)),Array.isArray(Ce)){const Ee=Se.groups;for(let Oe=0,ke=Ee.length;Oe<ke;Oe++){const Ie=Ee[Oe],nt=Ce[Ie.materialIndex];nt&&nt.visible&&v.push(C,Se,nt,k,Xe.z,Ie)}}else Ce.visible&&v.push(C,Se,Ce,k,Xe.z,null)}}const fe=C.children;for(let Se=0,Ce=fe.length;Se<Ce;Se++)zr(fe[Se],B,k,G)}function ec(C,B,k,G){const{opaque:z,transmissive:fe,transparent:Se}=C;_.setupLightsView(k),ie===!0&&Te.setGlobalState(T.clippingPlanes,k),G&&se.viewport(O.copy(G)),z.length>0&&Vs(z,B,k),fe.length>0&&Vs(fe,B,k),Se.length>0&&Vs(Se,B,k),se.buffers.depth.setTest(!0),se.buffers.depth.setMask(!0),se.buffers.color.setMask(!0),se.setPolygonOffset(!1)}function tc(C,B,k,G){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;_.state.transmissionRenderTarget[G.id]===void 0&&(_.state.transmissionRenderTarget[G.id]=new vn(1,1,{generateMipmaps:!0,type:$.has("EXT_color_buffer_half_float")||$.has("EXT_color_buffer_float")?Pn:Dn,minFilter:_i,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:st.workingColorSpace}));const fe=_.state.transmissionRenderTarget[G.id],Se=G.viewport||O;fe.setSize(Se.z*T.transmissionResolutionScale,Se.w*T.transmissionResolutionScale);const Ce=T.getRenderTarget(),Ee=T.getActiveCubeFace(),Oe=T.getActiveMipmapLevel();T.setRenderTarget(fe),T.getClearColor(H),Q=T.getClearAlpha(),Q<1&&T.setClearColor(16777215,.5),T.clear(),Ke&&ce.render(k);const ke=T.toneMapping;T.toneMapping=ni;const Ie=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),_.setupLightsView(G),ie===!0&&Te.setGlobalState(T.clippingPlanes,G),Vs(C,k,G),ye.updateMultisampleRenderTarget(fe),ye.updateRenderTargetMipmap(fe),$.has("WEBGL_multisampled_render_to_texture")===!1){let nt=!1;for(let gt=0,Ct=B.length;gt<Ct;gt++){const Rt=B[gt],{object:vt,geometry:Ne,material:Tt,group:at}=Rt;if(Tt.side===St&&vt.layers.test(G.layers)){const Kt=Tt.side;Tt.side=Ht,Tt.needsUpdate=!0,nc(vt,k,G,Ne,Tt,at),Tt.side=Kt,Tt.needsUpdate=!0,nt=!0}}nt===!0&&(ye.updateMultisampleRenderTarget(fe),ye.updateRenderTargetMipmap(fe))}T.setRenderTarget(Ce,Ee,Oe),T.setClearColor(H,Q),Ie!==void 0&&(G.viewport=Ie),T.toneMapping=ke}function Vs(C,B,k){const G=B.isScene===!0?B.overrideMaterial:null;for(let z=0,fe=C.length;z<fe;z++){const Se=C[z],{object:Ce,geometry:Ee,group:Oe}=Se;let ke=Se.material;ke.allowOverride===!0&&G!==null&&(ke=G),Ce.layers.test(k.layers)&&nc(Ce,B,k,Ee,ke,Oe)}}function nc(C,B,k,G,z,fe){C.onBeforeRender(T,B,k,G,z,fe),C.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),z.onBeforeRender(T,B,k,G,C,fe),z.transparent===!0&&z.side===St&&z.forceSinglePass===!1?(z.side=Ht,z.needsUpdate=!0,T.renderBufferDirect(k,B,G,z,C,fe),z.side=si,z.needsUpdate=!0,T.renderBufferDirect(k,B,G,z,C,fe),z.side=St):T.renderBufferDirect(k,B,G,z,C,fe),C.onAfterRender(T,B,k,G,z,fe)}function ks(C,B,k){B.isScene!==!0&&(B=Ut);const G=oe.get(C),z=_.state.lights,fe=_.state.shadowsArray,Se=z.state.version,Ce=X.getParameters(C,z.state,fe,B,k),Ee=X.getProgramCacheKey(Ce);let Oe=G.programs;G.environment=C.isMeshStandardMaterial?B.environment:null,G.fog=B.fog,G.envMap=(C.isMeshStandardMaterial?w:L).get(C.envMap||G.environment),G.envMapRotation=G.environment!==null&&C.envMap===null?B.environmentRotation:C.envMapRotation,Oe===void 0&&(C.addEventListener("dispose",Ye),Oe=new Map,G.programs=Oe);let ke=Oe.get(Ee);if(ke!==void 0){if(G.currentProgram===ke&&G.lightsStateVersion===Se)return sc(C,Ce),ke}else Ce.uniforms=X.getUniforms(C),C.onBeforeCompile(Ce,T),ke=X.acquireProgram(Ce,Ee),Oe.set(Ee,ke),G.uniforms=Ce.uniforms;const Ie=G.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ie.clippingPlanes=Te.uniform),sc(C,Ce),G.needsLights=Wh(C),G.lightsStateVersion=Se,G.needsLights&&(Ie.ambientLightColor.value=z.state.ambient,Ie.lightProbe.value=z.state.probe,Ie.directionalLights.value=z.state.directional,Ie.directionalLightShadows.value=z.state.directionalShadow,Ie.spotLights.value=z.state.spot,Ie.spotLightShadows.value=z.state.spotShadow,Ie.rectAreaLights.value=z.state.rectArea,Ie.ltc_1.value=z.state.rectAreaLTC1,Ie.ltc_2.value=z.state.rectAreaLTC2,Ie.pointLights.value=z.state.point,Ie.pointLightShadows.value=z.state.pointShadow,Ie.hemisphereLights.value=z.state.hemi,Ie.directionalShadowMap.value=z.state.directionalShadowMap,Ie.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ie.spotShadowMap.value=z.state.spotShadowMap,Ie.spotLightMatrix.value=z.state.spotLightMatrix,Ie.spotLightMap.value=z.state.spotLightMap,Ie.pointShadowMap.value=z.state.pointShadowMap,Ie.pointShadowMatrix.value=z.state.pointShadowMatrix),G.currentProgram=ke,G.uniformsList=null,ke}function ic(C){if(C.uniformsList===null){const B=C.currentProgram.getUniforms();C.uniformsList=Sr.seqWithValue(B.seq,C.uniforms)}return C.uniformsList}function sc(C,B){const k=oe.get(C);k.outputColorSpace=B.outputColorSpace,k.batching=B.batching,k.batchingColor=B.batchingColor,k.instancing=B.instancing,k.instancingColor=B.instancingColor,k.instancingMorph=B.instancingMorph,k.skinning=B.skinning,k.morphTargets=B.morphTargets,k.morphNormals=B.morphNormals,k.morphColors=B.morphColors,k.morphTargetsCount=B.morphTargetsCount,k.numClippingPlanes=B.numClippingPlanes,k.numIntersection=B.numClipIntersection,k.vertexAlphas=B.vertexAlphas,k.vertexTangents=B.vertexTangents,k.toneMapping=B.toneMapping}function Gh(C,B,k,G,z){B.isScene!==!0&&(B=Ut),ye.resetTextureUnits();const fe=B.fog,Se=G.isMeshStandardMaterial?B.environment:null,Ce=x===null?T.outputColorSpace:x.isXRRenderTarget===!0?x.texture.colorSpace:ji,Ee=(G.isMeshStandardMaterial?w:L).get(G.envMap||Se),Oe=G.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,ke=!!k.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ie=!!k.morphAttributes.position,nt=!!k.morphAttributes.normal,gt=!!k.morphAttributes.color;let Ct=ni;G.toneMapped&&(x===null||x.isXRRenderTarget===!0)&&(Ct=T.toneMapping);const Rt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,vt=Rt!==void 0?Rt.length:0,Ne=oe.get(G),Tt=_.state.lights;if(ie===!0&&(be===!0||C!==I)){const Xt=C===I&&G.id===R;Te.setState(G,C,Xt)}let at=!1;G.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==Tt.state.version||Ne.outputColorSpace!==Ce||z.isBatchedMesh&&Ne.batching===!1||!z.isBatchedMesh&&Ne.batching===!0||z.isBatchedMesh&&Ne.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Ne.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Ne.instancing===!1||!z.isInstancedMesh&&Ne.instancing===!0||z.isSkinnedMesh&&Ne.skinning===!1||!z.isSkinnedMesh&&Ne.skinning===!0||z.isInstancedMesh&&Ne.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Ne.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Ne.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Ne.instancingMorph===!1&&z.morphTexture!==null||Ne.envMap!==Ee||G.fog===!0&&Ne.fog!==fe||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==Te.numPlanes||Ne.numIntersection!==Te.numIntersection)||Ne.vertexAlphas!==Oe||Ne.vertexTangents!==ke||Ne.morphTargets!==Ie||Ne.morphNormals!==nt||Ne.morphColors!==gt||Ne.toneMapping!==Ct||Ne.morphTargetsCount!==vt)&&(at=!0):(at=!0,Ne.__version=G.version);let Kt=Ne.currentProgram;at===!0&&(Kt=ks(G,B,z));let Ai=!1,Jt=!1,ls=!1;const Et=Kt.getUniforms(),$t=Ne.uniforms;if(se.useProgram(Kt.program)&&(Ai=!0,Jt=!0,ls=!0),G.id!==R&&(R=G.id,Jt=!0),Ai||I!==C){se.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Et.setValue(U,"projectionMatrix",C.projectionMatrix),Et.setValue(U,"viewMatrix",C.matrixWorldInverse);const Zt=Et.map.cameraPosition;Zt!==void 0&&Zt.setValue(U,Le.setFromMatrixPosition(C.matrixWorld)),le.logarithmicDepthBuffer&&Et.setValue(U,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Et.setValue(U,"isOrthographic",C.isOrthographicCamera===!0),I!==C&&(I=C,Jt=!0,ls=!0)}if(z.isSkinnedMesh){Et.setOptional(U,z,"bindMatrix"),Et.setOptional(U,z,"bindMatrixInverse");const Xt=z.skeleton;Xt&&(Xt.boneTexture===null&&Xt.computeBoneTexture(),Et.setValue(U,"boneTexture",Xt.boneTexture,ye))}z.isBatchedMesh&&(Et.setOptional(U,z,"batchingTexture"),Et.setValue(U,"batchingTexture",z._matricesTexture,ye),Et.setOptional(U,z,"batchingIdTexture"),Et.setValue(U,"batchingIdTexture",z._indirectTexture,ye),Et.setOptional(U,z,"batchingColorTexture"),z._colorsTexture!==null&&Et.setValue(U,"batchingColorTexture",z._colorsTexture,ye));const rn=k.morphAttributes;if((rn.position!==void 0||rn.normal!==void 0||rn.color!==void 0)&&Ue.update(z,k,Kt),(Jt||Ne.receiveShadow!==z.receiveShadow)&&(Ne.receiveShadow=z.receiveShadow,Et.setValue(U,"receiveShadow",z.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&($t.envMap.value=Ee,$t.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&B.environment!==null&&($t.envMapIntensity.value=B.environmentIntensity),$t.dfgLUT!==void 0&&($t.dfgLUT.value=Xx()),Jt&&(Et.setValue(U,"toneMappingExposure",T.toneMappingExposure),Ne.needsLights&&Hh($t,ls),fe&&G.fog===!0&&Re.refreshFogUniforms($t,fe),Re.refreshMaterialUniforms($t,G,de,he,_.state.transmissionRenderTarget[C.id]),Sr.upload(U,ic(Ne),$t,ye)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Sr.upload(U,ic(Ne),$t,ye),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Et.setValue(U,"center",z.center),Et.setValue(U,"modelViewMatrix",z.modelViewMatrix),Et.setValue(U,"normalMatrix",z.normalMatrix),Et.setValue(U,"modelMatrix",z.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Xt=G.uniformsGroups;for(let Zt=0,Vr=Xt.length;Zt<Vr;Zt++){const ai=Xt[Zt];xe.update(ai,Kt),xe.bind(ai,Kt)}}return Kt}function Hh(C,B){C.ambientLightColor.needsUpdate=B,C.lightProbe.needsUpdate=B,C.directionalLights.needsUpdate=B,C.directionalLightShadows.needsUpdate=B,C.pointLights.needsUpdate=B,C.pointLightShadows.needsUpdate=B,C.spotLights.needsUpdate=B,C.spotLightShadows.needsUpdate=B,C.rectAreaLights.needsUpdate=B,C.hemisphereLights.needsUpdate=B}function Wh(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return x},this.setRenderTargetTextures=function(C,B,k){const G=oe.get(C);G.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),oe.get(C.texture).__webglTexture=B,oe.get(C.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:k,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,B){const k=oe.get(C);k.__webglFramebuffer=B,k.__useDefaultFramebuffer=B===void 0};const Xh=U.createFramebuffer();this.setRenderTarget=function(C,B=0,k=0){x=C,A=B,y=k;let G=!0,z=null,fe=!1,Se=!1;if(C){const Ee=oe.get(C);if(Ee.__useDefaultFramebuffer!==void 0)se.bindFramebuffer(U.FRAMEBUFFER,null),G=!1;else if(Ee.__webglFramebuffer===void 0)ye.setupRenderTarget(C);else if(Ee.__hasExternalTextures)ye.rebindTextures(C,oe.get(C.texture).__webglTexture,oe.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Ie=C.depthTexture;if(Ee.__boundDepthTexture!==Ie){if(Ie!==null&&oe.has(Ie)&&(C.width!==Ie.image.width||C.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ye.setupDepthRenderbuffer(C)}}const Oe=C.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(Se=!0);const ke=oe.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(ke[B])?z=ke[B][k]:z=ke[B],fe=!0):C.samples>0&&ye.useMultisampledRTT(C)===!1?z=oe.get(C).__webglMultisampledFramebuffer:Array.isArray(ke)?z=ke[k]:z=ke,O.copy(C.viewport),V.copy(C.scissor),Y=C.scissorTest}else O.copy(it).multiplyScalar(de).floor(),V.copy(pt).multiplyScalar(de).floor(),Y=mt;if(k!==0&&(z=Xh),se.bindFramebuffer(U.FRAMEBUFFER,z)&&G&&se.drawBuffers(C,z),se.viewport(O),se.scissor(V),se.setScissorTest(Y),fe){const Ee=oe.get(C.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+B,Ee.__webglTexture,k)}else if(Se){const Ee=B;for(let Oe=0;Oe<C.textures.length;Oe++){const ke=oe.get(C.textures[Oe]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Oe,ke.__webglTexture,k,Ee)}}else if(C!==null&&k!==0){const Ee=oe.get(C.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Ee.__webglTexture,k)}R=-1},this.readRenderTargetPixels=function(C,B,k,G,z,fe,Se,Ce=0){if(!(C&&C.isWebGLRenderTarget)){Pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=oe.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Se!==void 0&&(Ee=Ee[Se]),Ee){se.bindFramebuffer(U.FRAMEBUFFER,Ee);try{const Oe=C.textures[Ce],ke=Oe.format,Ie=Oe.type;if(!le.textureFormatReadable(ke)){Pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!le.textureTypeReadable(Ie)){Pt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=C.width-G&&k>=0&&k<=C.height-z&&(C.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Ce),U.readPixels(B,k,G,z,Fe.convert(ke),Fe.convert(Ie),fe))}finally{const Oe=x!==null?oe.get(x).__webglFramebuffer:null;se.bindFramebuffer(U.FRAMEBUFFER,Oe)}}},this.readRenderTargetPixelsAsync=async function(C,B,k,G,z,fe,Se,Ce=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=oe.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Se!==void 0&&(Ee=Ee[Se]),Ee)if(B>=0&&B<=C.width-G&&k>=0&&k<=C.height-z){se.bindFramebuffer(U.FRAMEBUFFER,Ee);const Oe=C.textures[Ce],ke=Oe.format,Ie=Oe.type;if(!le.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!le.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const nt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,nt),U.bufferData(U.PIXEL_PACK_BUFFER,fe.byteLength,U.STREAM_READ),C.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Ce),U.readPixels(B,k,G,z,Fe.convert(ke),Fe.convert(Ie),0);const gt=x!==null?oe.get(x).__webglFramebuffer:null;se.bindFramebuffer(U.FRAMEBUFFER,gt);const Ct=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Cd(U,Ct,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,nt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,fe),U.deleteBuffer(nt),U.deleteSync(Ct),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,B=null,k=0){const G=Math.pow(2,-k),z=Math.floor(C.image.width*G),fe=Math.floor(C.image.height*G),Se=B!==null?B.x:0,Ce=B!==null?B.y:0;ye.setTexture2D(C,0),U.copyTexSubImage2D(U.TEXTURE_2D,k,0,0,Se,Ce,z,fe),se.unbindTexture()};const qh=U.createFramebuffer(),Yh=U.createFramebuffer();this.copyTextureToTexture=function(C,B,k=null,G=null,z=0,fe=null){fe===null&&(z!==0?(Is("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),fe=z,z=0):fe=0);let Se,Ce,Ee,Oe,ke,Ie,nt,gt,Ct;const Rt=C.isCompressedTexture?C.mipmaps[fe]:C.image;if(k!==null)Se=k.max.x-k.min.x,Ce=k.max.y-k.min.y,Ee=k.isBox3?k.max.z-k.min.z:1,Oe=k.min.x,ke=k.min.y,Ie=k.isBox3?k.min.z:0;else{const rn=Math.pow(2,-z);Se=Math.floor(Rt.width*rn),Ce=Math.floor(Rt.height*rn),C.isDataArrayTexture?Ee=Rt.depth:C.isData3DTexture?Ee=Math.floor(Rt.depth*rn):Ee=1,Oe=0,ke=0,Ie=0}G!==null?(nt=G.x,gt=G.y,Ct=G.z):(nt=0,gt=0,Ct=0);const vt=Fe.convert(B.format),Ne=Fe.convert(B.type);let Tt;B.isData3DTexture?(ye.setTexture3D(B,0),Tt=U.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(ye.setTexture2DArray(B,0),Tt=U.TEXTURE_2D_ARRAY):(ye.setTexture2D(B,0),Tt=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,B.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,B.unpackAlignment);const at=U.getParameter(U.UNPACK_ROW_LENGTH),Kt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Ai=U.getParameter(U.UNPACK_SKIP_PIXELS),Jt=U.getParameter(U.UNPACK_SKIP_ROWS),ls=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,Rt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Rt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Oe),U.pixelStorei(U.UNPACK_SKIP_ROWS,ke),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ie);const Et=C.isDataArrayTexture||C.isData3DTexture,$t=B.isDataArrayTexture||B.isData3DTexture;if(C.isDepthTexture){const rn=oe.get(C),Xt=oe.get(B),Zt=oe.get(rn.__renderTarget),Vr=oe.get(Xt.__renderTarget);se.bindFramebuffer(U.READ_FRAMEBUFFER,Zt.__webglFramebuffer),se.bindFramebuffer(U.DRAW_FRAMEBUFFER,Vr.__webglFramebuffer);for(let ai=0;ai<Ee;ai++)Et&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,oe.get(C).__webglTexture,z,Ie+ai),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,oe.get(B).__webglTexture,fe,Ct+ai)),U.blitFramebuffer(Oe,ke,Se,Ce,nt,gt,Se,Ce,U.DEPTH_BUFFER_BIT,U.NEAREST);se.bindFramebuffer(U.READ_FRAMEBUFFER,null),se.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(z!==0||C.isRenderTargetTexture||oe.has(C)){const rn=oe.get(C),Xt=oe.get(B);se.bindFramebuffer(U.READ_FRAMEBUFFER,qh),se.bindFramebuffer(U.DRAW_FRAMEBUFFER,Yh);for(let Zt=0;Zt<Ee;Zt++)Et?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,rn.__webglTexture,z,Ie+Zt):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,rn.__webglTexture,z),$t?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Xt.__webglTexture,fe,Ct+Zt):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Xt.__webglTexture,fe),z!==0?U.blitFramebuffer(Oe,ke,Se,Ce,nt,gt,Se,Ce,U.COLOR_BUFFER_BIT,U.NEAREST):$t?U.copyTexSubImage3D(Tt,fe,nt,gt,Ct+Zt,Oe,ke,Se,Ce):U.copyTexSubImage2D(Tt,fe,nt,gt,Oe,ke,Se,Ce);se.bindFramebuffer(U.READ_FRAMEBUFFER,null),se.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else $t?C.isDataTexture||C.isData3DTexture?U.texSubImage3D(Tt,fe,nt,gt,Ct,Se,Ce,Ee,vt,Ne,Rt.data):B.isCompressedArrayTexture?U.compressedTexSubImage3D(Tt,fe,nt,gt,Ct,Se,Ce,Ee,vt,Rt.data):U.texSubImage3D(Tt,fe,nt,gt,Ct,Se,Ce,Ee,vt,Ne,Rt):C.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,fe,nt,gt,Se,Ce,vt,Ne,Rt.data):C.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,fe,nt,gt,Rt.width,Rt.height,vt,Rt.data):U.texSubImage2D(U.TEXTURE_2D,fe,nt,gt,Se,Ce,vt,Ne,Rt);U.pixelStorei(U.UNPACK_ROW_LENGTH,at),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Kt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ai),U.pixelStorei(U.UNPACK_SKIP_ROWS,Jt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,ls),fe===0&&B.generateMipmaps&&U.generateMipmap(Tt),se.unbindTexture()},this.initRenderTarget=function(C){oe.get(C).__webglFramebuffer===void 0&&ye.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?ye.setTextureCube(C,0):C.isData3DTexture?ye.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?ye.setTexture2DArray(C,0):ye.setTexture2D(C,0),se.unbindTexture()},this.resetState=function(){A=0,y=0,x=null,se.reset(),N.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=st._getDrawingBufferColorSpace(e),t.unpackColorSpace=st._getUnpackColorSpace()}}const yr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class os{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Yx=new Wo(-1,1,1,-1,0,1);class $x extends It{constructor(){super(),this.setAttribute("position",new rt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new rt([0,2,0,0,2,0],2))}}const Zx=new $x;class Xo{constructor(e){this._mesh=new q(Zx,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Yx)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Th extends os{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Gt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ns.clone(e.uniforms),this.material=new Gt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Xo(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class gl extends os{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Kx extends os{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Jx{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new ge);this._width=n.width,this._height=n.height,t=new vn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Pn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Th(yr),this.copyPass.material.blending=Rn,this.clock=new vh}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}gl!==void 0&&(a instanceof gl?n=!0:a instanceof Kx&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new ge);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class jx extends os{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new He}render(e,t,n){const s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}}const Qx={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new He(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class ts extends os{constructor(e,t=1,n,s){super(),this.strength=t,this.radius=n,this.threshold=s,this.resolution=e!==void 0?new ge(e.x,e.y):new ge(256,256),this.clearColor=new He(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new vn(r,a,{type:Pn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const u=new vn(r,a,{type:Pn});u.texture.name="UnrealBloomPass.h"+d,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new vn(r,a,{type:Pn});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=Qx;this.highPassUniforms=Ns.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Gt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new ge(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Ns.clone(yr.uniforms),this.blendMaterial=new Gt({uniforms:this.copyUniforms,vertexShader:yr.vertexShader,fragmentShader:yr.fragmentShader,blending:Yi,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new He,this._oldClearAlpha=1,this._basic=new wt,this._fsQuad=new Xo(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),s=Math.round(t/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new ge(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(e,t,n,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=ts.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=ts.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),o=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=a}_getSeparableBlurMaterial(e){const t=[],n=e/3;for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(n*n))/n);return new Gt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new ge(.5,.5)},direction:{value:new ge(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}_getCompositeMaterial(e){return new Gt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}ts.BlurDirectionX=new ge(1,0);ts.BlurDirectionY=new ge(0,1);const pr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class eg extends os{constructor(){super(),this.uniforms=Ns.clone(pr.uniforms),this.material=new Ku({name:pr.name,uniforms:this.uniforms,vertexShader:pr.vertexShader,fragmentShader:pr.fragmentShader}),this._fsQuad=new Xo(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},st.getTransfer(this._outputColorSpace)===ht&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Fl?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ol?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Bl?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===yo?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Vl?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===kl?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===zl&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class tg extends sh{constructor(){super();const e=new ze;e.deleteAttribute("uv");const t=new K({side:Ht}),n=new K,s=new _h(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new q(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new cn(e,n,6),o=new Lt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const c=new q(e,Hi(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const l=new q(e,Hi(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);const d=new q(e,Hi(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);const u=new q(e,Hi(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const f=new q(e,Hi(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);const p=new q(e,Hi(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Hi(i){return new Ju({color:0,emissive:16777215,emissiveIntensity:i})}const ng=document.querySelector("#game"),sn=new qx({canvas:ng,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!0});sn.setPixelRatio(Math.min(window.devicePixelRatio,2));sn.setSize(window.innerWidth,window.innerHeight);sn.shadowMap.enabled=!0;sn.shadowMap.type=Nl;sn.outputColorSpace=bt;sn.toneMapping=yo;sn.toneMappingExposure=.96;const Ge=new sh;Ge.background=new He(806802);Ge.fog=new Fo(2848949,105,1180);const Eh=new xo(sn);Eh.compileEquirectangularShader();Ge.environment=Eh.fromScene(new tg,.04).texture;Ge.environmentIntensity=.62;const tt=new en(69,window.innerWidth/window.innerHeight,.08,1800);Ge.add(tt);const Be={menu:document.querySelector("#menu"),result:document.querySelector("#result"),resultText:document.querySelector("#resultText"),startBtn:document.querySelector("#startBtn"),practiceBtn:document.querySelector("#practiceBtn"),freeRunBtn:document.querySelector("#freeRunBtn"),roamBtn:document.querySelector("#roamBtn"),againBtn:document.querySelector("#againBtn"),hud:document.querySelector("#hud"),speedo:document.querySelector("#speedo"),boostGauge:document.querySelector("#boostGauge"),damage:document.querySelector("#damage"),lap:document.querySelector("#lap"),timer:document.querySelector("#timer"),score:document.querySelector("#score"),best:document.querySelector("#best"),resultStats:document.querySelector("#resultStats"),tach:document.querySelector("#tach"),centerMessage:document.querySelector("#centerMessage"),speedFx:document.querySelector("#speedFx"),damageFx:document.querySelector("#damageFx"),touchControls:document.querySelector("#touchControls"),raceStrip:document.querySelector("#raceStrip"),playerProgress:document.querySelector("#playerProgress"),rivalProgress:document.querySelector("#rivalProgress"),position:document.querySelector("#position"),trackName:document.querySelector("#trackName"),courseName:document.querySelector("#courseName"),courseButtons:Array.from(document.querySelectorAll(".course-btn"))};window.__steelRibbonTelemetry={mode:"menu",s:0,speed:0,lap:1,score:0,forwardWorld:{x:0,y:0,z:-1},cameraWorld:{x:0,y:0,z:-1}};const et=new Set,We={steer:0,throttle:0,brake:0,steerPointer:null,drivePointer:null},ig=new vh,kt=new D(0,1,0),Ah=new D,Ch=new D,qo=new D,En=new Lt,_o=1.2,sg=.78,mi={x0:-700,x1:700,zNear:380,zFar:-1500,pitch:130,streetW:20},ns=[{name:"The Little Ramp",length:2380,width:22,laps:3,shape:{x1:372,x2:82,x3:34,z1:372,z2:64,z3:30,y0:54,y1:7,y2:10,y3:5},gaps:[{start:332,end:394,name:"Sky Gap",approach:72,carry:16,rise:42,settle:86},{start:950,end:1007,name:"The Long Drop",approach:82,carry:18,rise:48,settle:96},{start:1680,end:1744,name:"Bridge Break",approach:90,carry:18,rise:54,settle:104}],ramps:[{s:260,amp:34,width:95},{s:530,amp:-18,width:70},{s:875,amp:38,width:110},{s:1220,amp:26,width:80},{s:1275,amp:42,width:40},{s:1582,amp:44,width:120},{s:2050,amp:-24,width:92}]},{name:"Coil Spring",length:2600,width:20,laps:3,shape:{x1:300,x2:150,x3:78,z1:300,z2:-126,z3:66,y0:62,y1:11,y2:22,y3:12},gaps:[{start:470,end:524,name:"Helter",approach:70,carry:16,rise:46,settle:88},{start:1180,end:1232,name:"Coil Drop",approach:84,carry:18,rise:52,settle:98},{start:1980,end:2030,name:"Spring Snap",approach:88,carry:18,rise:56,settle:102}],ramps:[{s:240,amp:40,width:80},{s:760,amp:-22,width:70},{s:1040,amp:46,width:96},{s:1480,amp:30,width:84},{s:1760,amp:52,width:108},{s:2280,amp:-26,width:90}]},{name:"Long Haul",length:3200,width:24,laps:2,shape:{x1:462,x2:44,x3:22,z1:462,z2:56,z3:-30,y0:48,y1:14,y2:8,y3:4},gaps:[{start:620,end:700,name:"The Reach",approach:96,carry:20,rise:52,settle:112},{start:1640,end:1726,name:"Canyon Carry",approach:100,carry:22,rise:58,settle:120},{start:2540,end:2618,name:"Final Stretch Gap",approach:96,carry:20,rise:54,settle:116}],ramps:[{s:320,amp:30,width:130},{s:1080,amp:-20,width:110},{s:1980,amp:36,width:140},{s:2900,amp:28,width:120}]},{name:"Switchback",length:2900,width:20,laps:3,shape:{x1:330,x2:-186,x3:98,z1:330,z2:156,z3:-84,y0:66,y1:8,y2:15,y3:7},gaps:[{start:360,end:402,name:"Hairpin Hop",approach:76,carry:16,rise:48,settle:90},{start:1120,end:1162,name:"Switch Drop",approach:88,carry:18,rise:56,settle:98},{start:1820,end:1862,name:"Ridge Jump",approach:92,carry:18,rise:60,settle:102}],ramps:[{s:220,amp:44,width:74},{s:620,amp:-24,width:64},{s:900,amp:50,width:92},{s:1340,amp:32,width:78},{s:1600,amp:56,width:104},{s:2080,amp:-28,width:84},{s:2680,amp:40,width:96}]}],rg=Math.max(...ns.map(i=>i.width));let br=0,ee=ns[0];const S={mode:"menu",practice:!1,freeRun:!1,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:0,gear:1,tachRpm:900,y:0,yVel:0,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:0,rivalDistance:0,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:0,message:"",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:"P2",roamYaw:0,camYaw:0,wheelSteer:0,roamPos:new D,best:Number(localStorage.getItem("steel-ribbon-best")||0)};Be.best.textContent=`Best score ${S.best}`;function ag(i){const e=Je.clamp(i,0,1);return e*e*(3-2*e)}function og(i){let e=0;for(const t of ee.gaps){const n=t.start-t.approach,s=t.start+t.carry,r=t.end+t.settle;i>=n&&i<=s?e+=t.rise*Je.clamp((i-n)/(t.approach+t.carry),0,1):i>s&&i<=t.end?e+=t.rise:i>t.end&&i<=r&&(e+=t.rise*(1-ag((i-t.end)/t.settle)))}return e}function Rh(i,e){const t=(e%i.length+i.length)%i.length,n=t/i.length*Math.PI*2,s=i.shape,r=Math.sin(n)*s.x1+Math.sin(n*2)*s.x2+Math.cos(n*3)*s.x3,a=Math.cos(n)*s.z1+Math.cos(n*2)*s.z2+Math.sin(n*3)*s.z3;return{x:r,z:a,t:n,n:t}}function mr(i){const{x:e,z:t,t:n,n:s}=Rh(ee,i),r=ee.shape;let a=r.y0+Math.sin(n*2)*r.y2+Math.sin(n*3)*r.y3+Math.cos(n)*r.y1;for(const o of ee.ramps){const c=cg(s-o.s);a+=o.amp*Math.exp(-(c*c)/(o.width*o.width))}return a+=og(s),new D(e,a,t)}function cg(i){return i>ee.length/2?i-ee.length:i<-ee.length/2?i+ee.length:i}function ut(i){const e=(i%ee.length+ee.length)%ee.length,t=mr(e),s=mr(e+2).sub(t).normalize(),r=Ah.crossVectors(kt,s).normalize(),a=mr(e-2).y,o=mr(e+2).y,c=Math.atan2(o-a,4),l=Math.sin(e*.012)*.18+Math.sin(e*.032)*.08,d=ee.gaps.find(u=>e>u.start&&e<u.end);return{s:e,p:t,tangent:s,side:r.clone(),grade:c,bank:l,gap:d}}function is(i){const e=(i%ee.length+ee.length)%ee.length;return ee.gaps.some(t=>e>t.start&&e<t.end)}function _l(i){return Je.clamp(i/(ee.length*ee.laps),0,1)}function lg(i,e,t){const n=Math.floor(i/ee.length),s=Math.floor(e/ee.length);for(let r=n;r<=s;r++){const a=r*ee.length+t;if(i<a&&e>=a)return!0}return!1}function hg(i=256,e=8){const t=document.createElement("canvas");t.width=i,t.height=i;const n=t.getContext("2d"),s=i/e;for(let a=0;a<e;a++)for(let o=0;o<e;o++)n.fillStyle=(o+a)%2?"#101318":"#f5f1df",n.fillRect(o*s,a*s,s,s);const r=new bn(t);return r.colorSpace=bt,r.wrapS=hn,r.wrapT=hn,r.repeat.set(3,1),r}function dg(i=512){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,0);n.addColorStop(0,"#9c9b77"),n.addColorStop(.18,"#c9c69a"),n.addColorStop(.5,"#9f9f79"),n.addColorStop(.82,"#c0bd91"),n.addColorStop(1,"#858563"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(38, 44, 36, 0.32)",t.lineWidth=2;for(let r=0;r<i;r+=64)t.beginPath(),t.moveTo(0,r+2),t.lineTo(i,r+2),t.stroke();t.strokeStyle="rgba(250, 242, 180, 0.22)",t.lineWidth=3;for(const r of[48,464])t.beginPath(),t.moveTo(r,0),t.lineTo(r,i),t.stroke();t.strokeStyle="rgba(28, 31, 30, 0.24)",t.lineWidth=3;for(let r=0;r<42;r++){const a=i*(.28+Math.random()*.44),o=Math.random()*i;t.beginPath(),t.moveTo(a,o),t.bezierCurveTo(a+Math.random()*22-11,o+36,a+Math.random()*22-11,o+82,a+Math.random()*16-8,o+130),t.stroke()}t.fillStyle="rgba(24, 29, 25, 0.16)";for(let r=0;r<36;r++)t.beginPath(),t.ellipse(Math.random()*i,Math.random()*i,6+Math.random()*22,2+Math.random()*8,Math.random()*Math.PI,0,Math.PI*2),t.fill();for(let r=0;r<2200;r++){const a=110+Math.floor(Math.random()*60);t.fillStyle=`rgba(${a}, ${a}, ${a-12}, ${.035+Math.random()*.055})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*2,1+Math.random()*2)}const s=new bn(e);return s.colorSpace=bt,s.wrapS=hn,s.wrapT=hn,s.repeat.set(1.25,20),s.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),s}function ug(i=1024){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#2e6a40"),n.addColorStop(.42,"#487443"),n.addColorStop(1,"#1f4a37"),t.fillStyle=n,t.fillRect(0,0,i,i);for(let r=0;r<3600;r++){const a=.035+Math.random()*.08,o=72+Math.floor(Math.random()*70);t.fillStyle=`rgba(${38+Math.random()*30}, ${o}, ${38+Math.random()*26}, ${a})`,t.fillRect(Math.random()*i,Math.random()*i,1+Math.random()*4,1+Math.random()*4)}t.strokeStyle="rgba(210, 220, 150, 0.08)",t.lineWidth=2;for(let r=-i;r<i*1.5;r+=76)t.beginPath(),t.moveTo(r,0),t.lineTo(r+i*.65,i),t.stroke();const s=new bn(e);return s.colorSpace=bt,s.wrapS=hn,s.wrapT=hn,s.repeat.set(18,18),s.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),s}function fg(i=1024){const e=document.createElement("canvas");e.width=i,e.height=i;const t=e.getContext("2d"),n=t.createLinearGradient(0,0,i,i);n.addColorStop(0,"#111a1f"),n.addColorStop(.45,"#252c31"),n.addColorStop(1,"#070d11"),t.fillStyle=n,t.fillRect(0,0,i,i),t.strokeStyle="rgba(180, 225, 255, 0.08)",t.lineWidth=1;for(let r=-i;r<i*2;r+=42)t.beginPath(),t.moveTo(r,0),t.lineTo(r+i*.7,i),t.stroke();for(let r=0;r<360;r++){const a=Math.random()*i,o=Math.random()*i,c=10+Math.random()*56,l=t.createRadialGradient(a,o,0,a,o,c);l.addColorStop(0,`rgba(145, 205, 255, ${.12+Math.random()*.15})`),l.addColorStop(.45,"rgba(80, 140, 180, 0.07)"),l.addColorStop(1,"rgba(10, 18, 24, 0)"),t.fillStyle=l,t.beginPath(),t.ellipse(a,o,c,c*(.16+Math.random()*.18),Math.random()*Math.PI,0,Math.PI*2),t.fill()}t.fillStyle="rgba(255, 214, 122, 0.12)";for(let r=0;r<48;r++){const a=Math.random()*i,o=Math.random()*i;t.beginPath(),t.ellipse(a,o,8+Math.random()*36,1.5+Math.random()*4,Math.random()*Math.PI,0,Math.PI*2),t.fill()}for(let r=0;r<5200;r++){const a=40+Math.floor(Math.random()*80);t.fillStyle=`rgba(${a}, ${a+4}, ${a+8}, ${.045+Math.random()*.08})`,t.fillRect(Math.random()*i,Math.random()*i,1,1)}const s=new bn(e);return s.colorSpace=bt,s.wrapS=hn,s.wrapT=hn,s.repeat.set(22,28),s.anisotropy=Math.min(16,sn.capabilities.getMaxAnisotropy()),s}function Xi(i=128,e=256,t=.42){const n=document.createElement("canvas");n.width=i,n.height=e;const s=n.getContext("2d");s.fillStyle="#081722",s.fillRect(0,0,i,e);for(let a=10;a<e-8;a+=18)for(let o=9;o<i-9;o+=15)Math.random()<t?(s.shadowColor="rgba(255, 197, 104, 0.75)",s.shadowBlur=5,s.fillStyle=`rgba(255, ${205+Math.random()*38}, ${118+Math.random()*72}, ${.82+Math.random()*.18})`):(s.shadowBlur=0,s.fillStyle="rgba(42, 92, 125, 0.28)"),s.fillRect(o,a,7,8);s.shadowBlur=0,s.strokeStyle="rgba(140, 220, 255, 0.12)",s.lineWidth=1;for(let a=0;a<i;a+=15)s.beginPath(),s.moveTo(a+3,0),s.lineTo(a+3,e),s.stroke();const r=new bn(n);return r.colorSpace=bt,r}function vl(i,e="#ff4fb7",t="rgba(12, 5, 30, 0.92)"){const n=document.createElement("canvas");n.width=128,n.height=384;const s=n.getContext("2d");s.fillStyle=t,s.fillRect(0,0,128,384),s.strokeStyle=e,s.lineWidth=5,s.strokeRect(8,8,112,368),s.save(),s.translate(64,196),s.rotate(-Math.PI/2),s.font="900 54px Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.shadowColor=e,s.shadowBlur=18,s.fillStyle=e,s.fillText(i,0,0),s.restore();const r=new bn(n);return r.colorSpace=bt,r}function dt(i,e){return-7+Math.sin(i*.018)*4+Math.cos(e*.014)*5+Math.sin((i+e)*.006)*10}function Yo(i,e,t=10){const{x0:n,x1:s,zNear:r,zFar:a,pitch:o,streetW:c}=mi;if(i<n-c||i>s+c||e<a-c||e>r+c)return!1;const l=Math.abs((i-n+o/2)%o-o/2),d=Math.abs((r-e+o/2)%o-o/2);return Math.min(l,d)<c*.5+t}const wr=[],Sa=[],Ph=[];let Ml=0;function fi(i,e){return Ph.push({obj:i,update:e}),i}function pg(i){Ml+=i;for(const e of Ph)e.update(Ml,i)}function mg(){if(Sa.length===0)for(const i of ns)for(let e=0;e<i.length;e+=14){const t=Rh(i,e);Sa.push({x:t.x,z:t.z,s:e})}return Sa}function kn(i,e,t=0){let n=null,s=1/0;for(const r of mg()){const a=i-r.x,o=e-r.z,c=Math.hypot(a,o);c<s&&(s=c,n=r)}return{clearance:s-t-rg*.58,distance:s,nearestS:n?.s??0}}function mn(i,e,t,n=96){for(let s=0;s<n;s++){const r=i(s);if(kn(r.x,r.z,e).clearance>=t)return r}return null}function xn(i,e,t,n,s){const r=kn(e,t,n);wr.push({kind:i,x:Math.round(e),z:Math.round(t),radius:Math.round(n),margin:s,clearance:Math.round(r.clearance),nearestS:Math.round(r.nearestS)})}function xg(){const i=[...wr].sort((e,t)=>e.clearance-t.clearance).slice(0,12);return{count:wr.length,unsafe:wr.filter(e=>e.clearance<e.margin),closest:i}}function on(i,e,t,n,s){const r=e.clone().add(t).multiplyScalar(.5),a=t.clone().sub(e),o=new q(new ft(n,n,a.length(),8),s);return o.position.copy(r),o.quaternion.setFromUnitVectors(kt,a.normalize()),o.castShadow=!1,o.receiveShadow=!0,i.add(o),o}function gg(){const i=new ef(10475519,1055524,.82);Ge.add(i);const e=new Xc(5941759,1.15);e.position.set(260,145,-260),Ge.add(e);const t=new Xc(16766364,1.55);t.position.set(-240,270,180),t.castShadow=!0,t.shadow.mapSize.set(3072,3072),t.shadow.camera.left=-460,t.shadow.camera.right=460,t.shadow.camera.top=460,t.shadow.camera.bottom=-460,t.shadow.camera.near=50,t.shadow.camera.far=980,t.shadow.bias=-.0015,Ge.add(t);const n=new _h(5552383,58,820,2.1);n.position.set(0,88,-920),Ge.add(n)}function _g(){const i=document.createElement("canvas");i.width=32,i.height=512;const e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,i.height);t.addColorStop(0,"#052e72"),t.addColorStop(.34,"#126bc8"),t.addColorStop(.68,"#62baff"),t.addColorStop(1,"#ffb46f"),e.fillStyle=t,e.fillRect(0,0,i.width,i.height);const n=new bn(i);n.colorSpace=bt;const s=new q(new tn(1550,40,20),new wt({map:n,side:Ht,depthWrite:!1}));s.position.set(0,-70,-700),Ge.add(s);const r=new wt({color:16765316,transparent:!0,opacity:.22,depthWrite:!1}),a=new q(new yn(58,48),r);a.position.set(-430,300,-650),a.lookAt(tt.position),Ge.add(a);const o=new wt({color:16762479,transparent:!0,opacity:.16,depthWrite:!1});for(const[l,d]of[[150,.05],[260,.025],[430,.012]]){const u=new q(new yn(l,48),o.clone());u.material.opacity=d,u.position.copy(a.position).add(new D(0,0,2)),u.lookAt(tt.position),Ge.add(u)}const c=new wt({color:16769715,transparent:!0,opacity:.025,depthWrite:!1,side:St});for(let l=0;l<3;l++){const d=new q(new Dt(1800,42),c.clone());d.material.opacity=.015+l*.01,d.position.set(0,92+l*28,-1220-l*260),Ge.add(d)}}function vg(){const i=new K({map:ug(),color:10212492,roughness:.98,metalness:.02}),e=new q(new Dt(4200,4200,300,300),i);e.rotation.x=-Math.PI/2,e.position.y=-7,e.receiveShadow=!0;const t=e.geometry.attributes.position;for(let M=0;M<t.count;M++){const m=t.getX(M),h=t.getY(M);t.setZ(M,dt(m,-h)+7)}t.needsUpdate=!0,e.geometry.computeVertexNormals(),Ge.add(e);const n=new K({color:5220796,roughness:.22,metalness:.08,transparent:!0,opacity:.76});for(let M=0;M<3;M++){const m=new q(new Dt(980,64+M*18,1,1),n.clone());m.rotation.x=-Math.PI/2,m.rotation.z=-.34+M*.03,m.position.set(150-M*190,-5.4+M*.03,-760-M*420),Ge.add(m)}const s=[new K({color:4352578,roughness:1}),new K({color:6910014,roughness:1}),new K({color:3562320,roughness:1})];for(let M=0;M<46;M++){const m=new q(new yn(28+Math.random()*90,9),s[M%s.length]);m.rotation.x=-Math.PI/2,m.rotation.z=Math.random()*Math.PI,m.position.set(-900+Math.random()*1800,-5.6+Math.random()*.8,-260-Math.random()*1780),m.scale.y=.32+Math.random()*.5,m.receiveShadow=!0,Ge.add(m)}const r=new wt({color:14217471,transparent:!0,opacity:.08,depthWrite:!1});for(let M=0;M<32;M++){const m=new q(new yn(70+Math.random()*150,22),r.clone());m.material.opacity=.035+Math.random()*.055,m.rotation.x=-Math.PI/2,m.position.set(-1050+Math.random()*2100,-1.8+Math.random()*4,-240-Math.random()*1820),m.scale.y=.22+Math.random()*.26,Ge.add(m)}const a=[new K({color:5991785,roughness:1}),new K({color:7633254,roughness:1}),new K({color:4874865,roughness:1})],o=new K({color:15068905,roughness:.95});for(let M=0;M<52;M++){const m=78+Math.random()*180,h=52+Math.random()*115,v=mn(b=>{const E=M/52*Math.PI*2+b*1.77,T=1380+Math.random()*820+b*18;return{x:Math.cos(E)*T,z:Math.sin(E)*T-1180}},h,480);if(!v)continue;const _=new q(new ii(h,m,5+Math.floor(Math.random()*2)),a[M%a.length]);if(_.position.set(v.x,-9,v.z),_.rotation.y=Math.random()*Math.PI,_.castShadow=!0,_.receiveShadow=!0,Ge.add(_),xn("mountain",v.x,v.z,h,480),m>160){const b=new q(new ii(h*.34,m*.22,5),o);b.position.copy(_.position).add(new D(0,m*.39,0)),b.rotation.y=_.rotation.y,Ge.add(b)}}const c=new K({color:4926748,roughness:.9}),l=[new K({color:2055221,roughness:.92}),new K({color:3109954,roughness:.95}),new K({color:1589042,roughness:.9})];for(let M=0;M<185;M++){const m=.58+Math.random()*1.05,h=8*m,v=mn(()=>({x:-1120+Math.random()*2240,z:-450-Math.random()*1740}),h,145,40);if(!v)continue;const{x:_,z:b}=v;if(Yo(_,b,18))continue;const E=dt(_,b)+.8,T=new ot,P=2.2+Math.random()*3.8,A=new q(new ft(.28,.42,P,6),c);A.position.y=P/2,T.add(A);const y=2+Math.floor(Math.random()*3);for(let x=0;x<y;x++){const R=new q(new ii(2.2+Math.random()*1.7-x*.22,4.8+Math.random()*2.6,7),l[(M+x)%l.length]);R.position.y=P+x*1.45+1.6,R.rotation.y=Math.random()*Math.PI,T.add(R)}T.position.set(_,E,b),T.scale.setScalar(m),Ge.add(T),xn("tree",_,b,h,145)}const d=new K({color:16777215,roughness:.75,transparent:!0,opacity:.88});for(let M=0;M<38;M++){const m=new ot,h=4+Math.floor(Math.random()*5);for(let v=0;v<h;v++){const _=new q(new tn(12+Math.random()*18,14,8),d);_.position.set(v*18-h*9,Math.random()*8,Math.random()*12),_.scale.set(1.2+Math.random()*.9,.36+Math.random()*.2,.8+Math.random()*.5),m.add(_)}m.position.set(-760+Math.random()*1520,185+Math.random()*135,-130-Math.random()*1720),Ge.add(m)}const u=[new K({color:6186600,roughness:.68,metalness:.2}),new K({color:7829101,roughness:.72,metalness:.18}),new K({color:4544612,roughness:.62,metalness:.24})],f=new K({color:2962232,roughness:.65,metalness:.35});for(let M=0;M<44;M++){const m=new ot,h=20+Math.random()*95,v=8+Math.random()*18,_=8+Math.random()*18,b=new q(new ze(v,h,_),u[M%u.length]);b.position.y=h/2,b.castShadow=!0,b.receiveShadow=!0,m.add(b);const E=Xi(160,320,.28+Math.random()*.36),T=new K({map:E,color:10414079,roughness:.24,metalness:.12,emissive:1724259,emissiveIntensity:.22});for(const x of[-1,1]){const R=new q(new Dt(v*.82,h*.74),T);R.position.set(0,h*.53,x*(_/2+.08)),R.rotation.y=x<0?Math.PI:0,m.add(R)}const P=new q(new ze(v*1.08,1.2,_*1.08),f);if(P.position.y=h+.7,m.add(P),Math.random()<.32){const x=new q(new ft(.18,.3,10+Math.random()*12,8),f);x.position.y=h+6.5,m.add(x)}const A=Math.hypot(v,_)*.65,y=mn(()=>({x:-880+Math.random()*1760,z:-900-Math.random()*900}),A,240,60);y&&(m.position.set(y.x,-5,y.z),m.rotation.y=Math.random()*Math.PI,Ge.add(m),xn("building",y.x,y.z,A,240))}const p=new K({color:1053978,roughness:.4,metalness:.25,emissive:1786464,emissiveIntensity:.22}),g=new K({color:16766574,roughness:.32,metalness:.05,emissive:9061888,emissiveIntensity:.28});for(let M=0;M<12;M++){const m=new ot,h=new q(new ze(20+Math.random()*16,7+Math.random()*4,.5),g);h.position.y=10,m.add(h);for(const _ of[-7,7]){const b=new q(new ft(.24,.32,10,8),p);b.position.set(_,5,-.2),m.add(b)}const v=mn(()=>({x:-780+Math.random()*1560,z:-450-M*135+Math.random()*80-40}),22,175,50);v&&(m.position.set(v.x,dt(v.x,v.z)+.5,v.z),m.rotation.y=-.35+Math.random()*.7,Ge.add(m),xn("billboard",v.x,v.z,22,175))}}function Mg(){for(let h=0;h<3;h++){const v=[9418953,10995926,12770278][h],_=new wt({color:v,transparent:!0,opacity:.55-h*.12,depthWrite:!1,fog:!1}),b=60,E=5200,T=new Dt(E,360,b,1),P=T.attributes.position;for(let y=0;y<=b;y++){const x=y/b,R=(Math.sin(x*22+h*3)*.5+Math.sin(x*9+h)*.5)*70+120;P.setY(y,R),P.setY(y+b+1,-180)}P.needsUpdate=!0;const A=new q(T,_);A.position.set(0,40,-2300-h*360),Ge.add(A)}const i=new K({color:5583649,roughness:.9}),e=[new K({color:3837754,roughness:.9}),new K({color:7319100,roughness:.92}),new K({color:13075258,roughness:.9}),new K({color:15182276,roughness:.88})];for(let h=0;h<48;h++){const v=.7+Math.random()*1.2,_=9*v,b=mn(()=>({x:-1180+Math.random()*2360,z:-420-Math.random()*1820}),_,150,36);if(!b)continue;const{x:E,z:T}=b;if(Yo(E,T,18))continue;const P=dt(E,T)+.6,A=new ot,y=2.6+Math.random()*3.4,x=new q(new ft(.34,.5,y,6),i);x.position.y=y/2,A.add(x);const R=e[Math.floor(Math.random()*e.length)],I=3+Math.floor(Math.random()*3);for(let O=0;O<I;O++){const V=2.4+Math.random()*1.8,Y=new q(new tn(V,9,7),R);Y.position.set((Math.random()-.5)*3,y+1.6+Math.random()*2.2,(Math.random()-.5)*3),Y.scale.y=.82+Math.random()*.3,A.add(Y)}A.position.set(E,P,T),A.scale.setScalar(v),Ge.add(A),xn("tree",E,T,_,150)}const t=[new K({color:7762025,roughness:1,flatShading:!0}),new K({color:9077368,roughness:1,flatShading:!0}),new K({color:6249043,roughness:1,flatShading:!0})];for(let h=0;h<70;h++){const v=2+Math.random()*7,_=mn(()=>({x:-1200+Math.random()*2400,z:-360-Math.random()*1900}),v,70,30);if(!_)continue;const{x:b,z:E}=_,T=new q(new ko(v,0),t[h%t.length]),P=T.geometry.attributes.position;for(let A=0;A<P.count;A++)P.setXYZ(A,P.getX(A)*(.8+Math.random()*.4),P.getY(A)*(.6+Math.random()*.4),P.getZ(A)*(.8+Math.random()*.4));P.needsUpdate=!0,T.geometry.computeVertexNormals(),T.position.set(b,dt(b,E)+v*.35,E),T.rotation.set(Math.random(),Math.random()*Math.PI,Math.random()),T.castShadow=!0,Ge.add(T),xn("rock",b,E,v,70)}const n=[11969084,9416262,7314255,13218138,8228670];for(let h=0;h<14;h++){const v=130+Math.random()*200,_=130+Math.random()*200,b=mn(()=>({x:-1500+Math.random()*3e3,z:-700-Math.random()*1700}),Math.max(v,_)*.5,40,24);if(!b)continue;const{x:E,z:T}=b,P=new ot,A=5+Math.floor(Math.random()*4),y=n[Math.floor(Math.random()*n.length)];for(let x=0;x<A;x++){const R=new K({color:x%2?y:n[Math.floor(Math.random()*n.length)],roughness:1}),I=new q(new Dt(v,_/A),R);I.rotation.x=-Math.PI/2,I.position.set(0,.05,-_/2+(x+.5)*(_/A)),P.add(I)}P.position.set(E,dt(E,T)+.05,T),P.rotation.y=Math.random()*Math.PI,Ge.add(P),xn("field",E,T,Math.max(v,_)*.5,40)}{const h=mn(()=>({x:-650+Math.random()*1300,z:-1200-Math.random()*700}),170,60,50);if(h){const v=new K({color:4165552,roughness:.12,metalness:.35,transparent:!0,opacity:.88}),_=new q(new yn(150,40),v);_.rotation.x=-Math.PI/2,_.position.set(h.x,-6.4,h.z),_.scale.set(1.5,1,1),Ge.add(_),xn("lake",h.x,h.z,170,60),fi(_,b=>{v.opacity=.84+Math.sin(b*.8)*.05,_.rotation.z=Math.sin(b*.2)*.02})}}const s=new K({color:15922422,roughness:.5,metalness:.2});for(let h=0;h<9;h++){const v=h/9*Math.PI*2+.6,_=1500+Math.random()*700,b=Math.cos(v)*_,E=Math.sin(v)*_-1150,T=60+Math.random()*40,P=new ot,A=new q(new ft(1.1,2.2,T,10),s);A.position.y=T/2,P.add(A);const y=new ot;y.position.set(0,T,3);const x=new q(new ze(3,3,7),s);y.add(x);const R=new ot;R.position.z=3.5;for(let O=0;O<3;O++){const V=new q(new ze(1.1,26,.5),s);V.position.y=13;const Y=new ot;Y.add(V),Y.rotation.z=O/3*Math.PI*2,R.add(Y)}y.add(R),P.add(y),P.position.set(b,-8,E),P.rotation.y=Math.random()*Math.PI,Ge.add(P);const I=.5+Math.random()*.5;fi(R,O=>{R.rotation.z=O*I})}const r=new K({color:7041398,roughness:.6,metalness:.4}),a=new uo({color:2764595,transparent:!0,opacity:.5});let o=null;for(let h=0;h<7;h++){const v=-1100+h*360,_=-1650-Math.sin(h*.7)*120,b=48,E=new ot,T=6;for(const A of[-1,1])for(const y of[-1,1]){const x=new q(new ft(.4,.7,b,5),r);x.position.set(A*T,b/2,y*T),x.rotation.z=-A*.08,x.rotation.x=y*.08,E.add(x)}for(const A of[b*.6,b*.82,b]){const y=new q(new ze(T*4,.8,.8),r);y.position.y=A,E.add(y)}E.position.set(v,dt(v,_)-2,_),Ge.add(E);const P=dt(v,_)-2+b;if(o)for(const A of[-T*2,0,T*2]){const y=o.x+A,x=o.z,R=v+A,I=_,O=[],V=12;for(let H=0;H<=V;H++){const Q=H/V,W=Math.sin(Q*Math.PI)*6;O.push(new D(y+(R-y)*Q,o.y-W+(P-o.y)*Q,x+(I-x)*Q))}const Y=new Nc(new It().setFromPoints(O),a);Ge.add(Y)}o={x:v,y:P,z:_}}const c=new K({color:11680302,roughness:.6,metalness:.3}),l=new K({color:15263976,roughness:.6,metalness:.3});for(let h=0;h<5;h++){const v=mn(()=>({x:-1e3+Math.random()*2e3,z:-1100-Math.random()*1e3}),8,120,40);if(!v)continue;const{x:_,z:b}=v,E=70+Math.random()*50,T=new ot,P=8;for(let R=0;R<P;R++){const I=new q(new ft(.5,.7,E/P,4),R%2?l:c);I.position.y=(R+.5)*(E/P),I.rotation.y=Math.PI/4,T.add(I)}const A=new K({color:16722458,emissive:16718346,emissiveIntensity:2}),y=new q(new tn(1.1,10,8),A);y.position.y=E+1,T.add(y),T.position.set(_,dt(_,b),b),Ge.add(T),xn("mast",_,b,8,120);const x=Math.random()*Math.PI*2;fi(y,R=>{A.emissiveIntensity=Math.sin(R*2.4+x)>.4?2.4:.15})}const d=[[16734797,16765503],[5093119,16777215],[10185727,16747222],[4641690,16773227]];for(let h=0;h<6;h++){const v=new ot,_=d[h%d.length],b=new K({map:Tg(_[0],_[1]),roughness:.5,metalness:.05,emissive:new He(_[0]).multiplyScalar(.18),emissiveIntensity:1}),E=new q(new tn(11,20,16),b);E.scale.y=1.25,v.add(E);const T=new q(new ze(3.4,3,3.4),new K({color:8014371,roughness:.9}));T.position.y=-17,v.add(T);const P=new uo({color:3811866});for(const I of[-1,1])for(const O of[-1,1]){const V=new Nc(new It().setFromPoints([new D(I*1.6,-15.5,O*1.6),new D(I*7,-3,O*7)]),P);v.add(V)}const A=-700+Math.random()*1400,y=-700-Math.random()*1200,x=280+Math.random()*100;v.position.set(A,x,y),Ge.add(v);const R=Math.random()*Math.PI*2;fi(v,I=>{v.position.y=x+Math.sin(I*.5+R)*6,v.position.x=A+Math.sin(I*.08+R)*90,v.rotation.z=Math.sin(I*.4+R)*.04})}const u=new wt({color:2829104,side:St,fog:!1});function f(){const h=new uh;return h.moveTo(0,0),h.lineTo(-2.6,1.1),h.lineTo(-2.2,.2),h.lineTo(0,.5),h.lineTo(2.2,.2),h.lineTo(2.6,1.1),h.lineTo(0,0),new q(new Go(h),u)}for(let h=0;h<5;h++){const v=new ot,_=5+Math.floor(Math.random()*5),b=[];for(let R=0;R<_;R++){const I=f(),O=R%2?1:-1,V=Math.ceil(R/2);I.position.set(O*V*5,-V*2.4,0),I.rotation.x=-Math.PI/2,v.add(I),b.push(I)}const E=150+Math.random()*120,T=-500-Math.random()*1400,P=18+Math.random()*14,A=1400,y=-700+Math.random()*1400;v.position.set(y,E,T),Ge.add(v);const x=Math.random()*Math.PI*2;fi(v,(R,I)=>{v.position.x+=P*I,v.position.x>A&&(v.position.x=-A);const O=Math.sin(R*6+x);for(const V of b)V.rotation.x=-Math.PI/2+O*.4})}{const h=new ot,v=new K({color:14673644,roughness:.4,metalness:.2}),_=new q(new tn(20,20,16),v);_.scale.set(2.6,1,1),h.add(_);const b=new K({color:13781835,roughness:.6});for(let y=0;y<3;y++){const x=new q(new ze(10,9,.6),b);x.position.x=-46,x.rotation.x=y/3*Math.PI*2,h.add(x)}const E=new q(new ze(10,4,4),new K({color:3356475,roughness:.7}));E.position.y=-19,h.add(E);const T=new q(new Dt(40,10),new wt({map:$o("STEEL RIBBON"),transparent:!0,side:St}));T.position.set(60,0,0),h.add(T);const P=900,A=240;h.position.set(0,A,-1200),Ge.add(h),fi(h,y=>{const x=y*.05;h.position.x=Math.cos(x)*P,h.position.z=-1200+Math.sin(x)*P*.5,h.position.y=A+Math.sin(y*.3)*8,h.rotation.y=-x+Math.PI/2})}const p=new wt({color:16777215,transparent:!0,opacity:.32,depthWrite:!1,fog:!1});for(let h=0;h<14;h++){const v=new q(new Dt(220+Math.random()*360,16+Math.random()*22),p.clone());v.material.opacity=.12+Math.random()*.18,v.position.set(-1100+Math.random()*2200,360+Math.random()*180,-700-Math.random()*1400),v.rotation.x=-Math.PI/2.1,v.rotation.z=Math.random()*Math.PI,v.scale.y=.3,Ge.add(v);const _=2+Math.random()*3;fi(v,(b,E)=>{v.position.x+=_*E,v.position.x>1400&&(v.position.x=-1400)})}const g=new K({color:13620954,roughness:.6,metalness:.2}),M=new wt({map:Eg(),side:St});for(let h=0;h<4;h++){const v=mn(()=>({x:-560+Math.random()*1120,z:-520-Math.random()*900}),40,30,40);if(!v)continue;const{x:_,z:b}=v,E=new ot,T=60+Math.random()*40,P=new q(new ze(T,1.4,26),g);P.position.set(0,26,-4),P.rotation.x=-.32,E.add(P);const A=new q(new Dt(T*.94,24),M);A.position.set(0,12,6),A.rotation.x=-.85,E.add(A);for(const y of[-T/2,T/2]){const x=new q(new ze(1.4,26,1.4),g);x.position.set(y,13,-8),E.add(x)}E.position.set(_,dt(_,b),b),E.rotation.y=Math.atan2(-_,-b)+(Math.random()-.5)*.5,Ge.add(E),xn("grandstand",_,b,40,30)}const m=[16731486,16765503,16777215,11824127];for(let h=0;h<90;h++){const v=mn(()=>({x:-900+Math.random()*1800,z:-300-Math.random()*1500}),3,20,16);if(!v)continue;const{x:_,z:b}=v,E=new ot,T=m[Math.floor(Math.random()*m.length)],P=new wt({color:T,side:St}),A=5+Math.floor(Math.random()*6);for(let y=0;y<A;y++){const x=new q(new yn(.5+Math.random()*.4,5),P);x.position.set((Math.random()-.5)*7,.6+Math.random()*.5,(Math.random()-.5)*7),x.rotation.x=-Math.PI/2+(Math.random()-.5)*.6,x.rotation.z=Math.random()*Math.PI,E.add(x)}E.position.set(_,dt(_,b),b),Ge.add(E),xn("flowers",_,b,3,20)}}const ei=[],Mi=[];function Sg(){const i=new ot,e=new Lt;new Xn().setFromAxisAngle(new D(1,0,0),-Math.PI/2);const t=mi.x0,n=mi.x1,s=mi.zNear,r=mi.zFar,a=mi.pitch,o=mi.streetW,c=a-o,l=[];for(let j=t;j<=n+1;j+=a)l.push({x0:j,z0:s,x1:j,z1:r});for(let j=s;j>=r-1;j-=a)l.push({x0:t,z0:j,x1:n,z1:j});function d(j,$,le){const se=[],_e=[];for(const ye of j){const L=ye.x1-ye.x0,w=ye.z1-ye.z0,F=Math.hypot(L,w),Z=Math.max(1,Math.round(F/14)),ne=L/F,Re=-(w/F),me=ne;let we=null,Te=null;for(let re=0;re<=Z;re++){const ce=re/Z,Ue=ce*F/68,De=ye.x0+L*ce,Me=ye.z0+w*ce,Fe=De+Re*$,N=Me+me*$,xe=De-Re*$,pe=Me-me*$,ue=[Fe,dt(Fe,N)+le,N,Ue],ae=[xe,dt(xe,pe)+le,pe,Ue];we&&(se.push(we[0],we[1],we[2],Te[0],Te[1],Te[2],ae[0],ae[1],ae[2]),se.push(we[0],we[1],we[2],ae[0],ae[1],ae[2],ue[0],ue[1],ue[2]),_e.push(0,we[3],1,Te[3],1,ae[3]),_e.push(0,we[3],1,ae[3],0,ue[3])),we=ue,Te=ae}}const oe=new It;return oe.setAttribute("position",new rt(se,3)),oe.setAttribute("uv",new rt(_e,2)),oe.computeVertexNormals(),oe}const u=new K({map:fg(),color:13097186,roughness:.34,metalness:.24,envMapIntensity:1.25,side:St}),f=new q(d(l,o/2,.55),u);f.receiveShadow=!0,i.add(f);const p=new K({color:16768876,roughness:.38,metalness:.08,emissive:6962688,emissiveIntensity:.38,side:St});i.add(new q(d(l,.4,.62),p));const g=new wt({color:8837631,transparent:!0,opacity:.13,depthWrite:!1,side:St,blending:Yi}),M=new wt({color:16762474,transparent:!0,opacity:.1,depthWrite:!1,side:St,blending:Yi});for(let j=0;j<120;j++){const $=l[Math.random()*l.length|0],le=Math.random(),se=$.x0+($.x1-$.x0)*le,_e=$.z0+($.z1-$.z0)*le;if(kn(se,_e,4).clearance<2)continue;const oe=new q(new yn(1,18),(j%4===0?M:g).clone());oe.rotation.x=-Math.PI/2,oe.rotation.z=Math.atan2($.x1-$.x0,$.z1-$.z0)+(Math.random()-.5)*.35,oe.scale.set(2+Math.random()*7,.16+Math.random()*.35,1),oe.position.set(se+(Math.random()-.5)*o*.7,dt(se,_e)+.66,_e+(Math.random()-.5)*o*.7),i.add(oe)}const m=[Xi(160,320,.5),Xi(160,320,.62),Xi(160,320,.42)],h=[new K({map:m[0],color:7042688,roughness:.42,metalness:.26,emissive:2315117,emissiveIntensity:.34}),new K({map:m[1],color:8550507,roughness:.46,metalness:.22,emissive:4860952,emissiveIntensity:.32}),new K({map:m[2],color:4414064,roughness:.4,metalness:.3,emissive:1523562,emissiveIntensity:.38})],v=new ze(1,1,1),_=[[],[],[]],b=[],E=[],T=[],P=[],A=[],y=[],x=[],R=[12097375,13217930,10251087,11055285,13681832,9412234,12544602,8227475];function I(j,$,le,se,_e){const oe=dt(j,$)-1;if(e.position.set(j,oe+_e/2,$),e.quaternion.identity(),e.scale.set(le,_e,se),e.updateMatrix(),_[Math.random()*3|0].push(e.matrix.clone()),e.position.set(j,oe+_e+.6,$),e.scale.set(le*1.04,1.2,se*1.04),e.updateMatrix(),b.push(e.matrix.clone()),_e>26){const ye=Math.random()<.72?3790847:16730294;for(const L of[-1,1])e.position.set(j,oe+_e+1.35,$+L*(se*.52+.12)),e.scale.set(le*1.12,.22,.18),e.updateMatrix(),E.push(e.matrix.clone()),T.push(ye);Math.random()<.34&&P.push({px:j,pz:$,w:le,d:se,h:_e,gy:oe,zSide:Math.random()<.5?-1:1})}ei.push({x:j,z:$,hw:le*.5,hd:se*.5})}function O(j,$,le,se,_e){const oe=dt(j,$)-.4;e.position.set(j,oe+_e/2,$),e.quaternion.identity(),e.scale.set(le,_e,se),e.updateMatrix(),A.push(e.matrix.clone()),ei.push({x:j,z:$,hw:le*.5,hd:se*.5}),y.push(R[Math.random()*R.length|0]);const ye=2+Math.random()*2.4;e.position.set(j,oe+_e+ye/2,$),e.scale.set(le*.82,ye,se*.82),e.updateMatrix(),x.push(e.matrix.clone())}for(let j=t+a/2;j<=n-a/2;j+=a)for(let $=s-a/2;$>=r+a/2;$-=a){const le=kn(j,$,c*.5).clearance;if(!(le<2))if(le<90){const _e=c/3;for(let oe=0;oe<3;oe++)for(let ye=0;ye<3;ye++){if(Math.random()<.14)continue;const L=j-c/2+_e*(oe+.5)+(Math.random()-.5)*_e*.3,w=$-c/2+_e*(ye+.5)+(Math.random()-.5)*_e*.3;if(kn(L,w,8).clearance<1)continue;const F=_e*(.5+Math.random()*.22),Z=_e*(.5+Math.random()*.22);Math.random()<.16?I(L,w,F*.9,Z*.9,12+Math.random()*12):O(L,w,F,Z,5+Math.random()*4.5)}}else{const se=le>230,_e=se?Je.clamp(50+le*1.1,60,175):Je.clamp(22+le*.3,22,62),oe=2+(Math.random()<.72?1:0)+(Math.random()<.42?1:0);for(let ye=0;ye<oe;ye++){const L=13+Math.random()*Math.min(26,c*.44),w=13+Math.random()*Math.min(26,c*.44),F=j+(Math.random()-.5)*(c-L),Z=$+(Math.random()-.5)*(c-w);if(kn(F,Z,Math.hypot(L,w)*.5).clearance<2)continue;const ne=(18+Math.random()*(_e-18))*(se&&Math.random()<.2?1.35:1);I(F,Z,L,w,ne)}}}for(let j=0;j<3;j++){if(!_[j].length)continue;const $=new cn(v,h[j],_[j].length);for(let le=0;le<_[j].length;le++)$.setMatrixAt(le,_[j][le]);$.instanceMatrix.needsUpdate=!0,$.castShadow=!0,$.receiveShadow=!0,i.add($)}if(b.length){const j=new K({color:2896696,roughness:.62,metalness:.34}),$=new cn(v,j,b.length);for(let le=0;le<b.length;le++)$.setMatrixAt(le,b[le]);$.instanceMatrix.needsUpdate=!0,i.add($)}if(E.length){const j=new K({color:16777215,roughness:.18,metalness:.12,emissive:16777215,emissiveIntensity:1.75}),$=new cn(v,j,E.length);for(let le=0;le<E.length;le++)$.setMatrixAt(le,E[le]),$.setColorAt(le,new He(T[le]));$.instanceMatrix.needsUpdate=!0,$.instanceColor&&($.instanceColor.needsUpdate=!0),i.add($)}if(A.length){const j=new K({roughness:.85,metalness:.04}),$=new cn(v,j,A.length);for(let oe=0;oe<A.length;oe++)$.setMatrixAt(oe,A[oe]),$.setColorAt(oe,new He(y[oe]));$.instanceMatrix.needsUpdate=!0,$.instanceColor&&($.instanceColor.needsUpdate=!0),$.castShadow=!0,$.receiveShadow=!0,i.add($);const le=new ii(.72,1,4);le.rotateY(Math.PI/4);const se=new K({color:7224112,roughness:.82}),_e=new cn(le,se,x.length);for(let oe=0;oe<x.length;oe++)_e.setMatrixAt(oe,x[oe]);_e.instanceMatrix.needsUpdate=!0,_e.castShadow=!0,i.add(_e)}const V=["HOTEL","OPEN","AUTO","RACE","CAFE"];for(let j=0;j<Math.min(P.length,18);j++){const $=P[j],le=V[j%V.length],se=j%3===0?"#ff4fb7":j%3===1?"#4ff3ff":"#ffd45b",_e=new wt({map:vl(le,se),transparent:!0,side:St,depthWrite:!1}),oe=new q(new Dt(8,24),_e);oe.position.set($.px,$.gy+Math.max(14,$.h*.58),$.pz+$.zSide*($.d*.5+.25)),oe.rotation.y=$.zSide<0?Math.PI:0,i.add(oe)}const Y=[11680564,3108784,14205514,15198700,3752265,4164178,10112944],H=new ze(2.2,1.4,4.6),Q=130,W=new cn(H,new K({roughness:.42,metalness:.36}),Q);let he=0,de=0;for(;he<Q&&de<Q*6;){de++;const j=Math.random()<.5,$=j?t+Math.round(Math.random()*((n-t)/a))*a+(Math.random()<.5?-1:1)*(o*.26):t+Math.random()*(n-t),le=j?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.26);if(kn($,le,4).clearance<2)continue;const se=dt($,le)+.7;e.position.set($,se,le),e.quaternion.setFromAxisAngle(kt,j?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),W.setMatrixAt(he,e.matrix),W.setColorAt(he,new He(Y[Math.random()*Y.length|0])),he++}W.count=he,W.instanceMatrix.needsUpdate=!0,W.instanceColor&&(W.instanceColor.needsUpdate=!0),i.add(W);const Pe=new ft(.12,.16,7.2,7),je=new tn(.46,10,8),it=new Dt(2.8,13),pt=new K({color:1581353,roughness:.42,metalness:.68}),mt=new K({color:16769696,roughness:.12,metalness:.04,emissive:16761178,emissiveIntensity:1.6}),J=new wt({color:16760163,transparent:!0,opacity:.16,depthWrite:!1,side:St,blending:Yi}),ie=132,be=new cn(Pe,pt,ie),Ve=new cn(je,mt,ie),Le=new cn(it,J,ie);let Xe=0;for(let j=0;j<ie*2&&Xe<ie;j++){const $=Math.random()<.5,le=$?t+Math.round(Math.random()*((n-t)/a))*a+(Math.random()<.5?-1:1)*(o*.58):t+Math.random()*(n-t),se=$?r+Math.random()*(s-r):s-Math.round(Math.random()*((s-r)/a))*a+(Math.random()<.5?-1:1)*(o*.58);if(kn(le,se,3).clearance<2)continue;const _e=dt(le,se);e.quaternion.identity(),e.position.set(le,_e+3.6,se),e.scale.set(1,1,1),e.updateMatrix(),be.setMatrixAt(Xe,e.matrix),e.position.set(le,_e+7.5,se),e.updateMatrix(),Ve.setMatrixAt(Xe,e.matrix),e.position.set(le,_e+.72,se),e.quaternion.setFromAxisAngle(new D(1,0,0),-Math.PI/2),e.rotateZ($?0:Math.PI/2),e.scale.set(1,1,1),e.updateMatrix(),Le.setMatrixAt(Xe,e.matrix),Xe++}be.count=Xe,Ve.count=Xe,Le.count=Xe,be.instanceMatrix.needsUpdate=!0,Ve.instanceMatrix.needsUpdate=!0,Le.instanceMatrix.needsUpdate=!0,i.add(be,Ve,Le);const Ut=new K({color:10397084,roughness:.58,metalness:.04}),Ke=new K({color:13944196,roughness:.44,metalness:.05,emissive:3942912,emissiveIntensity:.12});i.add(new q(d([{x0:64,z0:345,x1:64,z1:-720}],5.6,.74),Ut)),i.add(new q(d([{x0:96,z0:345,x1:96,z1:-720}],5.6,.74),Ut)),i.add(new q(d([{x0:70,z0:345,x1:70,z1:-720},{x0:90,z0:345,x1:90,z1:-720}],.26,.82),Ke));function ct(j,$,le,se,_e,oe,ye,L=null,w=0){const F=dt(j,$)-.45,Z=j<80?1:-1,ne=new K({map:Xi(192,512,ye),color:oe,roughness:.38,metalness:.26,emissive:1719900,emissiveIntensity:.44}),X=new q(new ze(le,_e,se),ne);X.position.set(j,F+_e/2,$),X.castShadow=!0,X.receiveShadow=!0,i.add(X);const Re=new K({map:Xi(220,620,Math.min(.86,ye+.18)),color:16777215,roughness:.2,metalness:.14,emissive:1386040,emissiveIntensity:.12,transparent:!0,opacity:.94,side:St}),me=new q(new Dt(se*.78,_e*.74),Re);me.position.set(j+Z*(le/2+.09),F+_e*.54,$),me.rotation.y=Z>0?Math.PI/2:-Math.PI/2,i.add(me);const we=new q(new ze(le*1.04,1.2,se*1.04),new K({color:1778733,roughness:.34,metalness:.38}));we.position.set(j,F+_e+.7,$),i.add(we);const Te=new K({color:6547967,roughness:.12,metalness:.12,emissive:2543615,emissiveIntensity:2.2});for(const re of[-1,1]){const ce=new q(new ze(le*1.1,.22,.18),Te);ce.position.set(j,F+_e+1.4,$+re*(se/2+.18)),i.add(ce)}if(L&&w){const re=new wt({map:vl(L,L==="HOTEL"?"#ff4fb7":"#ffd45b"),transparent:!0,side:St,depthWrite:!1}),ce=new q(new Dt(7.5,24),re);ce.position.set(j+w*(le/2+.3),F+Math.min(_e-8,_e*.58),$),ce.rotation.y=w>0?Math.PI/2:-Math.PI/2,i.add(ce)}ei.push({x:j,z:$,hw:le*.5,hd:se*.5})}function U(j,$,le,se,_e,oe){const ye=dt(j,$)-.3,L=new q(new ze(le,_e,se),new K({color:13682616,roughness:.62,metalness:.04}));L.position.set(j,ye+_e/2,$),L.castShadow=!0,L.receiveShadow=!0,i.add(L);const w=new q(new ii(.82,1,4),new K({color:oe,roughness:.48,metalness:.18,emissive:4000003,emissiveIntensity:.12}));w.geometry.rotateY(Math.PI/4),w.position.set(j,ye+_e+2.1,$),w.scale.set(le*.82,4.2,se*.82),w.castShadow=!0,i.add(w);const F=new q(new ze(5,7,.25),new K({color:16730669,roughness:.28,emissive:16719632,emissiveIntensity:.45}));F.position.set(j,ye+3.6,$-se/2-.16),i.add(F),ei.push({x:j,z:$,hw:le*.5,hd:se*.5})}return ct(-10,126,48,72,122,2569797,.7,null,0),ct(166,86,56,82,78,2306624,.66,"HOTEL",-1),ct(-34,-90,46,64,92,3424848,.58,"AUTO",1),ct(178,-164,62,72,104,3030868,.62,null,0),ct(-48,-360,54,86,148,2439765,.58,null,0),ct(172,-430,50,80,132,3817032,.66,"OPEN",-1),U(-36,270,64,52,18,12927269),U(168,238,42,44,14,12546102),Ge.add(i),i}function yg(i,e=1){const n=ut(16),s=new D(n.tangent.x,0,n.tangent.z).normalize(),r=new D().crossVectors(kt,s).normalize(),a=n.p.clone().addScaledVector(n.side,e*ee.width*.5),o=165,c=52,l=a.x-s.x*o+r.x*e*c,d=a.z-s.z*o+r.z*e*c,u=new D(l,dt(l,d)+.4,d),f=26,p=[];for(let x=0;x<=f;x++){const R=x/f,I=R*R*(3-2*R);p.push(new D(Je.lerp(u.x,a.x,R),Je.lerp(u.y,a.y,I),Je.lerp(u.z,a.z,R)))}const g=5.5,M=new D,m=new D,h=[],v=[];for(let x=0;x<=f;x++)m.subVectors(p[Math.min(f,x+1)],p[Math.max(0,x-1)]),m.y=0,m.normalize(),M.crossVectors(kt,m).normalize(),h.push(p[x].clone().addScaledVector(M,-g)),v.push(p[x].clone().addScaledVector(M,g));const _=[];for(let x=0;x<f;x++){const R=h[x],I=v[x],O=h[x+1],V=v[x+1];_.push(R.x,R.y,R.z,I.x,I.y,I.z,V.x,V.y,V.z),_.push(R.x,R.y,R.z,V.x,V.y,V.z,O.x,O.y,O.z)}const b=new It;b.setAttribute("position",new rt(_,3)),b.computeVertexNormals();const E=new K({color:2895665,roughness:.85,metalness:.05,side:St});i.add(new q(b,E));const T=new K({color:12107972,roughness:.5,metalness:.4});for(let x=0;x<f;x++)on(i,h[x].clone().setY(h[x].y+1),h[x+1].clone().setY(h[x+1].y+1),.16,T),on(i,v[x].clone().setY(v[x].y+1),v[x+1].clone().setY(v[x+1].y+1),.16,T);const P=new K({color:7173241,roughness:.82});for(let x=3;x<f;x+=3){const R=p[x],I=dt(R.x,R.z),O=R.y-I;if(O<3)continue;const V=new q(new ft(.9,1.15,O,8),P);V.position.set(R.x,I+O/2,R.z),i.add(V),Mi.push({x:R.x,z:R.z,hw:1.3,hd:1.3})}const A=new wt({map:$o("ON RAMP"),transparent:!0,side:St}),y=new q(new Dt(12,3),A);y.position.copy(u).add(new D(0,5.5,0)),y.rotation.y=Math.atan2(-s.x,-s.z),i.add(y);for(const x of[-1,1]){const R=new q(new ft(.2,.26,6,6),P);R.position.set(u.x+r.x*x*5.4,u.y+3,u.z+r.z*x*5.4),i.add(R)}}function bg(){const i=new ot,e=[],t=new He(14170671),n=new He(15922680),s=new K({color:3883336,roughness:.6,metalness:.3}),r=new wt({map:wg(),transparent:!0,side:St}),a=new K({color:4926748,roughness:.9}),o=[new K({color:2055221,roughness:.92}),new K({color:3109954,roughness:.95}),new K({color:2583370,roughness:.9})],c=new K({color:7040883,roughness:.95}),l=12,d=[],u=[];let f=0;for(let g=0;g<ee.length;g+=l){if(is(g+l*.5)){f++;continue}const M=ut(g),m=ut(g+l),h=M.p.clone().add(m.p).multiplyScalar(.5),{sideways:v,normal:_,q:b}=ti(M,m);for(const E of[-1,1]){const T=h.clone().addScaledVector(v,E*ee.width*.5).addScaledVector(_,.5);d.push(T),u.push(b),e.push(f%2===0?t:n)}if(f%16===8){const E=(f>>4)%2?1:-1,T=h.clone().addScaledVector(v,E*ee.width*.52).addScaledVector(_,.4),P=new ot,A=new q(new Dt(4.4,2.6),r);A.position.y=3.4,A.rotation.y=Math.PI,P.add(A);const y=new ft(.12,.16,3.4,5);for(const x of[-1.5,1.5]){const R=new q(y,s);R.position.set(x,1.7,0),P.add(R)}P.position.copy(T),P.quaternion.copy(b),i.add(P)}f++}for(let g=0;g<ee.length;g+=16){const M=ut(g),m=1+(Math.random()<.5?1:0);for(let h=0;h<m;h++){const v=Math.random()<.5?-1:1,_=ee.width/2+12+Math.random()*78,b=M.p.x+M.side.x*_*v+(Math.random()-.5)*16,E=M.p.z+M.side.z*_*v+(Math.random()-.5)*16;if(Yo(b,E,18))continue;const T=dt(b,E);if(Math.random()<.78){const P=.7+Math.random()*1.5,A=new ot,y=2.4+Math.random()*4.2,x=new q(new ft(.26,.42,y,6),a);x.position.y=y/2,A.add(x);const R=2+Math.floor(Math.random()*3);for(let I=0;I<R;I++){const O=new q(new ii(2.4+Math.random()*1.6-I*.2,4.6+Math.random()*2.4,7),o[(h+I+g)%o.length]);O.position.y=y+I*1.4+1.5,O.rotation.y=Math.random()*Math.PI,A.add(O)}A.position.set(b,T+.6,E),A.scale.setScalar(P),i.add(A)}else{const P=1.4+Math.random()*3.6,A=new q(new Bo(P,0),c);A.position.set(b,T+P*.35,E),A.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),A.scale.set(1,.7+Math.random()*.4,1),i.add(A)}}}const p=["START","SECTOR 2","SECTOR 3"];for(let g=0;g<3;g++){const M=ee.length*g/3+6;if(is(M))continue;const m=ut(M),h=ut(M+l),v=m.p.clone().add(h.p).multiplyScalar(.5),{q:_}=ti(m,h),b=ee.width*.5+1.2,E=9,T=new ot,P=new ft(.4,.55,E,7);for(const I of[-1,1]){const O=new q(P,s);O.position.set(I*b,E/2,0),T.add(O)}const A=b*2,y=new q(new ze(A,1.1,1.1),s);y.position.y=E,T.add(y);const x=new wt({map:$o(p[g]),transparent:!0,side:St}),R=new q(new Dt(A*.82,3),x);R.position.set(0,E-2,0),R.rotation.y=Math.PI,T.add(R),T.position.copy(v),T.quaternion.copy(_),i.add(T)}if(d.length){const g=new ft(.18,.24,3,6);g.translate(0,1.5,0);const M=new tn(.34,8,6);M.translate(0,3.2,0);const m=new K({color:10134440,roughness:.7,metalness:.2}),h=new K({roughness:.55}),v=new cn(g,m,d.length),_=new cn(M,h,d.length),b=new Lt;for(let E=0;E<d.length;E++)b.position.copy(d[E]),b.quaternion.copy(u[E]),b.updateMatrix(),v.setMatrixAt(E,b.matrix),_.setMatrixAt(E,b.matrix),_.setColorAt(E,e[E]);v.instanceMatrix.needsUpdate=!0,_.instanceMatrix.needsUpdate=!0,_.instanceColor&&(_.instanceColor.needsUpdate=!0),i.add(v),i.add(_)}return yg(i),Ge.add(i),i}function wg(){const i=document.createElement("canvas");i.width=256,i.height=160;const e=i.getContext("2d");e.fillStyle="#101418",e.fillRect(0,0,i.width,i.height),e.fillStyle="#ffd23f",e.lineWidth=0;for(let n=-1;n<4;n++){e.beginPath();const s=n*70;e.moveTo(s,16),e.lineTo(s+40,i.height/2),e.lineTo(s,i.height-16),e.lineTo(s+18,i.height-16),e.lineTo(s+58,i.height/2),e.lineTo(s+18,16),e.closePath(),e.fill()}const t=new bn(i);return t.colorSpace=bt,t}function $o(i){const e=document.createElement("canvas");e.width=512,e.height=128;const t=e.getContext("2d");t.fillStyle="#101418",t.fillRect(0,0,e.width,e.height),t.fillStyle="#ffd23f",t.fillRect(0,0,e.width,8),t.fillRect(0,e.height-8,e.width,8),t.fillStyle="#ffffff",t.font="bold 64px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(i,e.width/2,e.height/2);const n=new bn(e);return n.colorSpace=bt,n}function Tg(i,e){const t=document.createElement("canvas");t.width=128,t.height=64;const n=t.getContext("2d"),s="#"+i.toString(16).padStart(6,"0"),r="#"+e.toString(16).padStart(6,"0"),a=8;for(let c=0;c<a;c++)n.fillStyle=c%2?s:r,n.fillRect(c/a*t.width,0,t.width/a+1,t.height);const o=new bn(t);return o.colorSpace=bt,o}function Eg(){const i=document.createElement("canvas");i.width=256,i.height=128;const e=i.getContext("2d");e.fillStyle="#2a3138",e.fillRect(0,0,i.width,i.height);const t=["#e6534f","#4db6ff","#ffd23f","#ffffff","#9b6bff","#46d39a","#ff8ad6","#f0f0f0"];for(let s=0;s<1400;s++){e.fillStyle=t[Math.random()*t.length|0];const r=Math.random()*i.width,a=Math.random()*i.height;e.fillRect(r,a,2.4,2.4)}const n=new bn(i);return n.colorSpace=bt,n.wrapS=hn,n.repeat.set(3,1),n}function Mt(i,e,t,n,s){const r=new q(new ze(e.x,e.y,e.z),s);return r.position.copy(t),r.quaternion.copy(n),r.castShadow=!1,r.receiveShadow=!0,i.add(r),r}function ti(i,e){const t=e.p.clone().sub(i.p).normalize(),n=Ah.crossVectors(kt,t).normalize();let s=t.clone().cross(n).normalize();const r=(i.bank+e.bank)*.5;if(Math.abs(r)>.001){const c=new Xn().setFromAxisAngle(t,r);n.applyQuaternion(c),s.applyQuaternion(c)}const a=new lt().makeBasis(n,s,t),o=new Xn().setFromRotationMatrix(a);return{tangent:t,sideways:n,normal:s,q:o}}function Sl(i,e,t,n){const r=[],a=[],o=[],c=ee.width*.47;let l=0;for(let f=e;f<=t;f+=8){const p=ut(Math.min(f,t)),g=ti(p,ut(p.s+2)),M=Math.sin(f*.018)*.04,m=p.p.clone().addScaledVector(g.sideways,-c).addScaledVector(g.normal,.46+M),h=p.p.clone().addScaledVector(g.sideways,c).addScaledVector(g.normal,.46-M);r.push(m.x,m.y,m.z,h.x,h.y,h.z);const v=(f-e)/64;if(a.push(0,v,1,v),l>0){const _=(l-1)*2,b=l*2;o.push(_,_+1,b,_+1,b+1,b)}l++}const d=new It;d.setAttribute("position",new rt(r,3)),d.setAttribute("uv",new rt(a,2)),d.setIndex(o),d.computeVertexNormals();const u=new q(d,n);u.receiveShadow=!0,i.add(u)}function Ag(i,e){let t=0;for(const n of ee.gaps)Sl(i,t,Math.max(t,n.start-4),e),t=n.end+4;Sl(i,t,ee.length,e)}function Cg(i,e,t){const n=ut(e.s+2),{normal:s,q:r}=ti(e,n),a=new ot;a.position.copy(e.p).addScaledVector(s,.73),a.quaternion.copy(r);const o=new q(new ze(.55,.12,5.2),t);o.position.set(-1.25,0,0),o.rotation.y=-.62,a.add(o);const c=new q(new ze(.55,.12,5.2),t);c.position.set(1.25,0,0),c.rotation.y=.62,a.add(c);const l=new q(new ze(.42,.1,3.8),t);l.position.set(0,.01,-1.9),a.add(l),i.add(a)}function Rg(){const i=new ot;Ge.add(i);const e=new K({color:12171149,roughness:.72,metalness:.08}),t=new K({color:9869942,roughness:.78,metalness:.05}),n=new K({color:15255629,roughness:.28,metalness:.72}),s=new K({color:8204328,roughness:.3,metalness:.85}),r=new K({color:6120040,roughness:.5,metalness:.6}),a=new K({color:4080968,roughness:.58,metalness:.55}),o=new K({color:14270570,roughness:.35,metalness:.65}),c=new K({color:2435884,roughness:.48,metalness:.62}),l=new K({color:16730929,roughness:.5,metalness:.1,emissive:4852740,emissiveIntensity:.35}),d=new K({color:16773238,roughness:.32,metalness:.2,emissive:7097088,emissiveIntensity:.18}),u=new K({color:4935486,roughness:.92,metalness:.04}),f=new K({color:16774307,roughness:.18,metalness:.1,emissive:16766540,emissiveIntensity:.9}),p=new K({color:9564415,roughness:.18,metalness:.1,emissive:3131647,emissiveIntensity:1.1}),g=new K({color:3159607,roughness:.7,metalness:.45}),M=new K({color:1514007,roughness:.96,metalness:.02,transparent:!0,opacity:.62}),m=new K({color:15919561,roughness:.82,metalness:.02}),h=new K({color:16761415,roughness:.56,metalness:.08,emissive:4268032,emissiveIntensity:.12}),v=new K({map:dg(),roughness:.74,metalness:.08}),_=new wt({color:1058333,transparent:!0,opacity:.18,depthWrite:!1}),b=12;Ag(i,v);for(let E=0;E<ee.length;E+=b){if(is(E+b*.5))continue;const T=ut(E),P=ut(E+b),A=T.p.clone().add(P.p).multiplyScalar(.5),{sideways:y,normal:x,q:R}=ti(T,P),I=T.p.distanceTo(P.p)+.45,O=Math.floor(E/(b*2))%2?e:t;Mt(i,new D(ee.width,.62,I),A.clone().addScaledVector(x,-.05),R,O),Mt(i,new D(ee.width-2.8,.08,I*.86),A.clone().addScaledVector(x,.36),R,u),Mt(i,new D(.2,.1,I*.76),A.clone().addScaledVector(y,-ee.width*.19).addScaledVector(x,.43),R,u),Mt(i,new D(.2,.1,I*.76),A.clone().addScaledVector(y,ee.width*.19).addScaledVector(x,.43),R,u),E%48===0&&(Mt(i,new D(.14,.08,I*.62),A.clone().addScaledVector(y,-ee.width*.08).addScaledVector(x,.51),R,M),Mt(i,new D(.14,.08,I*.62),A.clone().addScaledVector(y,ee.width*.08).addScaledVector(x,.51),R,M)),E%120===0&&Mt(i,new D(ee.width*.42,.07,.72),A.clone().addScaledVector(x,.55),R,m),Mt(i,new D(ee.width+1.2,.35,I*.94),A.clone().addScaledVector(x,-.56),R,a),Mt(i,new D(.42,.42,I*.9),A.clone().addScaledVector(y,-ee.width*.36).addScaledVector(x,-.78),R,g),Mt(i,new D(.42,.42,I*.9),A.clone().addScaledVector(y,ee.width*.36).addScaledVector(x,-.78),R,g);const V=A.clone().addScaledVector(y,-ee.width*.51),Y=A.clone().addScaledVector(y,ee.width*.51);if(Mt(i,new D(.32,.46,I),V.clone().addScaledVector(x,.28),R,n),Mt(i,new D(.32,.46,I),Y.clone().addScaledVector(x,.28),R,n),Mt(i,new D(.26,.72,I*.94),V.clone().addScaledVector(x,-.22),R,a),Mt(i,new D(.26,.72,I*.94),Y.clone().addScaledVector(x,-.22),R,a),E%36===0)for(const H of[-ee.width*.39,-ee.width*.2,ee.width*.2,ee.width*.39]){const Q=new q(new ft(.16,.2,.12,10),o);Q.position.copy(A).addScaledVector(y,H).addScaledVector(x,.46),Q.quaternion.copy(R),Q.castShadow=!1,i.add(Q)}if(E%72===0&&(Mt(i,new D(.34,1.56,3.4),A.clone().addScaledVector(y,-ee.width*.66).addScaledVector(x,1.16),R,s),Mt(i,new D(.34,1.56,3.4),A.clone().addScaledVector(y,ee.width*.66).addScaledVector(x,1.16),R,s),Mt(i,new D(.18,.18,4.4),A.clone().addScaledVector(y,-ee.width*.62).addScaledVector(x,1.94),R,s),Mt(i,new D(.18,.18,4.4),A.clone().addScaledVector(y,ee.width*.62).addScaledVector(x,1.94),R,s),Mt(i,new D(.12,.12,4),A.clone().addScaledVector(y,-ee.width*.62).addScaledVector(x,1.38),R,n),Mt(i,new D(.12,.12,4),A.clone().addScaledVector(y,ee.width*.62).addScaledVector(x,1.38),R,n),on(i,A.clone().addScaledVector(y,-ee.width*.58).addScaledVector(x,-1.08),A.clone().addScaledVector(y,ee.width*.58).addScaledVector(x,-1.08),.11,c),on(i,A.clone().addScaledVector(y,-ee.width*.48).addScaledVector(x,-1),A.clone().addScaledVector(y,0).addScaledVector(x,-2.2),.09,c),on(i,A.clone().addScaledVector(y,ee.width*.48).addScaledVector(x,-1),A.clone().addScaledVector(y,0).addScaledVector(x,-2.2),.09,c)),E%96===0){const H=new q(new yn(1,28),_);H.rotation.x=-Math.PI/2,H.position.set(A.x,-4.72,A.z),H.scale.set(ee.width*.9,Math.max(10,I*2.2),1),H.rotation.z=Math.atan2(ti(T,P).tangent.x,ti(T,P).tangent.z),i.add(H)}if(E%144===0){const H=A.clone().addScaledVector(y,-ee.width*.74).addScaledVector(x,2),Q=A.clone().addScaledVector(y,ee.width*.74).addScaledVector(x,2);on(i,H.clone().addScaledVector(x,-1.2),H.clone().addScaledVector(x,1.1),.12,s),on(i,Q.clone().addScaledVector(x,-1.2),Q.clone().addScaledVector(x,1.1),.12,s),Mt(i,new D(.46,.72,.46),H.clone().addScaledVector(x,1.15),R,l),Mt(i,new D(.46,.72,.46),Q.clone().addScaledVector(x,1.15),R,l)}if(E%288===0){const H=A.clone().addScaledVector(y,(Math.floor(E/144)%2?1:-1)*ee.width*.92).addScaledVector(x,5.2);Mt(i,new D(.44,.44,.44),H.clone(),R,f),on(i,H.clone().addScaledVector(x,-.2),A.clone().addScaledVector(x,1),.05,c)}if(E%168===0){const H=Math.max(18,A.y+8),Q=new D(A.x,A.y-H/2-.8,A.z),W=new q(new ft(.8,1.3,H,8),r);W.position.copy(Q),W.castShadow=!0,W.receiveShadow=!0,i.add(W);const he=new q(new ft(2.2,2.7,.34,12),r);he.position.set(A.x,A.y-H-.95,A.z),he.receiveShadow=!0,i.add(he),Mi.push({x:A.x,z:A.z,hw:2.6,hd:2.6});for(const je of[-.35,-1.05]){const it=new q(new ft(.86,.92,.28,8),h);it.position.set(A.x,A.y-H*.18+je,A.z),it.receiveShadow=!0,i.add(it)}const de=A.clone().addScaledVector(x,-.7),Pe=new D(A.x,A.y-H*.54,A.z);on(i,Pe.clone(),de.clone().addScaledVector(y,-ee.width*.38),.13,c),on(i,Pe.clone(),de.clone().addScaledVector(y,ee.width*.38),.13,c),on(i,Pe.clone().addScaledVector(y,-1.1),de.clone().addScaledVector(y,.1).addScaledVector(x,-1.1),.08,c),on(i,Pe.clone().addScaledVector(y,1.1),de.clone().addScaledVector(y,-.1).addScaledVector(x,-1.1),.08,c)}E%168===0&&!is(E+16)&&Cg(i,ut(E+5),d)}for(const E of ee.gaps){const T=ut(E.start-3),P=ut(E.end+3);for(const A of[T,P]){const y=ut(A.s+2),{normal:x,q:R}=ti(A,y);Mt(i,new D(ee.width-1.2,.08,4.6),A.p.clone().addScaledVector(x,.54),R,l),Mt(i,new D(ee.width*.62,.09,1.3),A.p.clone().addScaledVector(x,.62).addScaledVector(A.tangent,A===T?-6.3:6.3),R,m);for(const I of[-ee.width*.42,0,ee.width*.42]){const O=A.p.clone().addScaledVector(A.side,I).addScaledVector(x,2.35);Mt(i,new D(.46,.46,.46),O,R,I===0?p:l)}}}return i}function Lh(i=13710372,e=7740696){const t=new ot,n=new K({color:i,roughness:.32,metalness:.28}),s=new K({color:e,roughness:.42,metalness:.22}),r=new K({color:328965,roughness:.65}),a=new K({color:13621729,roughness:.18,metalness:.75}),o=new K({color:8840447,roughness:.08,metalness:.05,transparent:!0,opacity:.55}),c=new K({color:16722974,roughness:.18,metalness:.05,emissive:16719122,emissiveIntensity:1.1}),l=new K({color:16773285,roughness:.22,metalness:.05,emissive:16765019,emissiveIntensity:.7}),d=new K({color:16773820,roughness:.28,metalness:.2}),u=new K({color:2697513,roughness:.34,metalness:.72}),f=new q(new yn(3.2,28),new wt({color:0,transparent:!0,opacity:.22,depthWrite:!1}));f.rotation.x=-Math.PI/2,f.position.y=.08,f.scale.z=1.8,t.add(f);const p=new q(new ze(4.4,1,7.4),n);p.position.y=1,t.add(p);const g=new q(new ze(.72,.06,7.62),d);g.position.set(0,1.54,.05),t.add(g);for(const T of[-2.32,2.32]){const P=new q(new ze(.52,.54,3.2),s);P.position.set(T,.92,.85),t.add(P)}const M=new q(new ze(4.9,.28,7.8),r);M.position.set(0,.54,.15),t.add(M);const m=new q(new ze(2.7,.8,3.1),n);m.position.set(0,.82,-4.2),t.add(m);const h=new q(new ze(4.8,.14,.8),r);h.position.set(0,.42,-5.55),t.add(h);const v=new q(new ze(2.1,.78,1.9),o);v.position.set(0,1.72,-.72),v.rotation.x=-.08,t.add(v);const _=new q(new ze(2.14,.08,.08),a);_.position.set(0,2.04,-1.48),_.rotation.x=-.08,t.add(_);const b=new q(new ze(5.8,.22,1.1),s);b.position.set(0,1.84,3.9),t.add(b);for(const T of[-2.25,2.25]){const P=new q(new ze(.28,1.1,1.3),s);P.position.set(T,1.3,3.75),P.rotation.z=T<0?-.12:.12,t.add(P)}const E=[];for(const T of[-2.4,2.4])for(const P of[-2.3,2.6]){const A=new ot;A.position.set(T,.52,P);const y=new q(new ft(.78,.78,.55,18),r);y.rotation.z=Math.PI/2,A.add(y);const x=new q(new ft(.34,.34,.6,12),a);x.rotation.z=Math.PI/2,A.add(x);const R=new q(new ft(.48,.48,.08,16),u);R.rotation.z=Math.PI/2,R.position.set(T>0?-.04:.04,0,0),A.add(R);const I=new q(new zs(.78,.055,8,20),r);I.rotation.y=Math.PI/2,A.add(I),t.add(A),P<0&&E.push(A)}t.userData.frontWheels=E;for(let T=0;T<4;T++){const P=new q(new ft(.12,.12,2.4,10),a);P.rotation.x=Math.PI/2,P.position.set(-.9+T*.6,1.62,-2.7),t.add(P)}for(const T of[-1.35,1.35]){const P=new q(new ze(.62,.26,.16),c);P.position.set(T,1.05,3.82),t.add(P);const A=new q(new ze(.5,.22,.12),l);A.position.set(T,.86,-5.72),t.add(A)}return t.traverse(T=>{T.castShadow=!0,T.receiveShadow=!0}),Ge.add(t),t}function Pg(){const i=new ot,e=new K({color:9383205,roughness:.35,metalness:.55}),t=new K({color:460551,roughness:.55}),n=new K({color:12375772,roughness:.18,metalness:.9}),s=new K({color:16767297,roughness:.38,metalness:.25}),r=new K({color:16769898,roughness:.26,metalness:.18,emissive:16757802,emissiveIntensity:.62}),a=new K({color:11988991,roughness:.12,metalness:0,transparent:!0,opacity:.16}),o=new K({color:1118995,roughness:.7,metalness:.05}),c=new q(new ze(2.2,.24,2.2),e);c.position.set(0,-.78,-2.2),i.add(c);const l=new q(new ze(.16,.028,1.92),n);l.position.set(0,-.64,-2.28),i.add(l);const d=new q(new ze(2.55,.18,.52),t);d.position.set(0,-.48,-1.25),d.rotation.x=-.08,i.add(d);const u=new q(new Dt(2.8,.82,1,1),a);u.position.set(0,-.17,-1.08),u.rotation.x=-.36,i.add(u);const f=new q(new zs(.36,.035,12,48),o);f.position.set(0,-.46,-1.02),f.rotation.x=Math.PI/2.75,i.add(f);for(let p=0;p<3;p++){const g=new q(new ze(.34,.025,.035),n);g.position.copy(f.position),g.rotation.copy(f.rotation),g.rotation.z+=p/3*Math.PI*2,i.add(g)}for(let p=0;p<6;p++){const g=new q(new ft(.16,.16,.56,18),n);g.rotation.z=Math.PI/2,g.position.set(-.78+p*.31,-.42+Math.sin(p)*.03,-2.12),i.add(g)}for(const p of[-1.08,1.08]){const g=new q(new ft(.34,.34,.25,18),t);g.rotation.z=Math.PI/2,g.position.set(p,-.68,-1.58),i.add(g);const M=new q(new zs(.22,.035,8,28),s);M.scale.set(.72,1.25,.72),M.position.set(p*.8,-.48,-1.74),M.rotation.x=Math.PI/2,i.add(M)}for(const p of[-1.14,-.84,.84,1.14]){const g=new q(new ft(.035,.04,.028,8),n);g.position.set(p,-.39,-1.28),g.rotation.x=Math.PI/2,i.add(g)}for(const p of[-.52,.52]){const g=new q(new tn(.045,12,8),r);g.position.set(p,-.34,-1.22),i.add(g)}i.position.set(0,0,0),tt.add(i),bi=i}function Lg(){const i=new K({color:16119285,roughness:.35,metalness:.25}),e=new K({color:1184274,roughness:.45}),t=new K({map:hg(),roughness:.42,metalness:.05}),n=new K({color:16770696,roughness:.2,emissive:16759603,emissiveIntensity:1.25}),s=ut(0),r=new lt().makeBasis(s.side,kt,s.tangent),a=new Xn().setFromRotationMatrix(r),o=new ot;for(const d of[-ee.width*.58,ee.width*.58]){const u=new q(new ze(.8,11,.8),i);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(kt,5.4),u.quaternion.copy(a),o.add(u)}const c=new q(new ze(ee.width+3,.8,1),t);c.position.copy(s.p).addScaledVector(kt,11.2),c.quaternion.copy(a),o.add(c);const l=new q(new ze(ee.width+1.2,1.4,.18),e);l.position.copy(s.p).addScaledVector(kt,12.5).addScaledVector(s.tangent,-.55),l.quaternion.copy(a),o.add(l);for(const d of[-ee.width*.38,0,ee.width*.38]){const u=new q(new tn(.32,16,10),n);u.position.copy(s.p).addScaledVector(s.side,d).addScaledVector(kt,10.25),o.add(u)}return Ge.add(o),o}const Tr=Lh(),Ln=Lh(3108784,1916782);Ln.visible=!1;_g();gg();vg();Mg();Sg();let yl=null,bl=null,wl=null,bi=null;Pg();function ya(i){i&&(i.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){const t=Array.isArray(e.material)?e.material:[e.material];for(const n of t)n.map&&n.map.dispose(),n.dispose()}}),Ge.remove(i))}function Zo(i){return br=Je.clamp(i,0,ns.length-1),ee=ns[br],Mi.length=0,ya(yl),ya(bl),ya(wl),yl=Rg(),bl=Lg(),wl=bg(),Be.trackName.textContent=ee.name,Be.courseName&&(Be.courseName.textContent=ee.name),Be.courseButtons.forEach(e=>{e.classList.toggle("active",Number(e.dataset.course)===br)}),ee.name}Zo(0);const cs=new Jx(sn);cs.addPass(new jx(Ge,tt));const Dh=new ts(new ge(window.innerWidth,window.innerHeight),.34,.78,1);cs.addPass(Dh);cs.addPass(new eg);const Dg={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uBoost:{value:0}},vertexShader:`
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
  `},ys=new Th(Dg);cs.addPass(ys);const Ig=new K({color:16757051,emissive:16734743,emissiveIntensity:1.9,roughness:.32,metalness:.15}),Er=Array.from({length:72},()=>{const i=new q(new tn(.1,8,5),Ig);return i.visible=!1,Ge.add(i),{mesh:i,life:0,velocity:new D}});let Wn=null;function Ih(){if(Wn)return;const i=new AudioContext,e=i.createOscillator(),t=i.createGain(),n=i.createBiquadFilter();e.type="sawtooth",n.type="lowpass",n.frequency.value=540,e.frequency.value=70,t.gain.value=1e-4,e.connect(n).connect(t).connect(i.destination),e.start(),Wn={ctx:i,engine:e,engineGain:t,filter:n,nextNote:0,beat:0}}function Dr(){Wn||Ih(),Wn?.ctx.state==="suspended"&&Wn.ctx.resume().catch(()=>{})}function Tl(i){if(!Wn)return;const{ctx:e}=Wn,t=e.createOscillator(),n=e.createGain();t.type="sine",t.frequency.value=55+i*2.6,n.gain.setValueAtTime(Math.min(.34,i/55),e.currentTime),n.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.23),t.connect(n).connect(e.destination),t.start(),t.stop(e.currentTime+.24)}function El(i,e=18){const t=Math.min(e,Er.length);for(let n=0;n<t;n++){const s=Er.find(r=>r.life<=0)||Er[n];s.mesh.visible=!0,s.mesh.position.copy(i),s.velocity.set((Math.random()-.5)*16,Math.random()*11+3,(Math.random()-.5)*16),s.life=.28+Math.random()*.42}}function Ug(i){for(const e of Er){if(e.life<=0)continue;e.life-=i,e.velocity.y-=26*i,e.mesh.position.addScaledVector(e.velocity,i);const t=Math.max(.01,e.life*2.4);e.mesh.scale.setScalar(t),e.life<=0&&(e.mesh.visible=!1)}}function Ng(i){if(!Wn)return;const{ctx:e,engine:t,engineGain:n,filter:s}=Wn;t.frequency.setTargetAtTime(62+S.speed*2.9+(et.has("ShiftLeft")||et.has("ShiftRight")?60:0),e.currentTime,.04),s.frequency.setTargetAtTime(480+S.speed*9,e.currentTime,.08);const r=S.mode==="race"||S.mode==="roam";n.gain.setTargetAtTime(r?.036+Math.abs(S.speed)/4200:1e-4,e.currentTime,.08)}function Br(i=!1,e=!1){Ih(),et.clear(),Ir();const t=i||e;Object.assign(S,{mode:"race",practice:t,freeRun:e,breakdownTimer:0,s:22,totalDistance:22,lastSafeS:22,lastSafeDistance:22,lateral:0,lateralVel:0,speed:12,grounded:!0,boost:1,damage:0,lap:1,time:0,score:0,airtime:0,rivalS:t?-900:-28,rivalDistance:t?-900:-28,rivalSpeed:58,cameraShake:0,lastGap:null,messageTimer:2.2,message:e?"Free run — course check":i?"Practice run":"Division four race",bestLap:1/0,lapStartTime:0,splitTimes:[],cleanLandings:0,hardLandings:0,recoveries:0,nearMisses:0,leadState:t?"SOLO":"P2"});const n=ut(S.s);S.y=n.p.y+2.1,S.yVel=0,Be.menu.classList.add("hidden"),Be.result.classList.add("hidden"),Be.resultStats.innerHTML="",Be.position.textContent=e?"FREE RUN":i?"PRACTICE":"DIV 4",Be.trackName.textContent=ee.name,Ln.visible=!1,bi&&(bi.visible=!0),window.__freeCam=!1}function Uh(){Dr(),S.mode="roam",S.practice=!0,S.freeRun=!1,et.clear(),Ir();let i=80,e=250;kn(i,e,6).clearance<6&&(i=210,e=250),S.roamPos.set(i,dt(i,e),e),S.roamYaw=0,S.camYaw=0,S.wheelSteer=0,S.speed=0,S.boost=1,S.damage=0,S.cameraShake=0,S.message="Free roam — drive the city",S.messageTimer=2.4,Tr.visible=!1,Ln.visible=!0,bi&&(bi.visible=!1),window.__freeCam=!1,Be.menu.classList.add("hidden"),Be.result.classList.add("hidden"),Be.position.textContent="FREE ROAM",Be.trackName.textContent="City Streets",Ko();const t=Math.sin(S.roamYaw),n=-Math.cos(S.roamYaw);tt.position.set(S.roamPos.x-t*18,S.roamPos.y+8.5,S.roamPos.z-n*18),tt.lookAt(S.roamPos.x+t*12,S.roamPos.y+2.6,S.roamPos.z+n*12),tt.fov=70,tt.updateProjectionMatrix()}function Ko(){Ln.position.set(S.roamPos.x,S.roamPos.y+.3,S.roamPos.z),Ln.quaternion.setFromAxisAngle(kt,-S.roamYaw)}function Nh(i){const e=Math.max(et.has("KeyW")||et.has("ArrowUp")?1:0,We.throttle),t=Math.max(et.has("KeyS")||et.has("ArrowDown")?1:0,We.brake),n=Je.clamp((et.has("KeyD")||et.has("ArrowRight")?1:0)-(et.has("KeyA")||et.has("ArrowLeft")?1:0)+We.steer,-1,1),s=(et.has("ShiftLeft")||et.has("ShiftRight"))&&S.boost>.02&&e>.03;if(e>.03){const p=S.speed<0?38:0;S.speed+=((s?52:30)+p)*e*i}t>.03&&(S.speed-=(S.speed>1.2?64:30)*t*i),S.speed-=.0026*S.speed*Math.abs(S.speed)*i,Math.abs(S.speed)>.08?S.speed-=Math.sign(S.speed)*4.2*i:e<=.03&&t<=.03&&(S.speed=0),S.speed=Je.clamp(S.speed,-22,120),S.boosting=s,s?S.boost=Math.max(0,S.boost-i*.22):S.boost=Math.min(1,S.boost+i*.05),S.wheelSteer+=(n-S.wheelSteer)*(1-Math.pow(1e-4,i));const r=-S.wheelSteer*.55,a=Ln.userData.frontWheels;a&&(a[0].rotation.y=r,a[1].rotation.y=r);const o=Math.abs(S.speed);if(o>_o){const p=Je.clamp((o-_o)/5,0,1),g=1-.45*Je.clamp((o-28)/70,0,1),M=sg*p*g;S.roamYaw+=S.wheelSteer*M*i*Math.sign(S.speed)}const c=Math.sin(S.roamYaw),l=-Math.cos(S.roamYaw),d=Math.abs(S.speed)*i,u=Math.max(1,Math.ceil(d/1.2));let f=!1;for(let p=0;p<u;p++)S.roamPos.x+=c*S.speed*i/u,S.roamPos.z+=l*S.speed*i/u,Fg(S.roamPos)&&(f=!0);S.roamPos.x=Je.clamp(S.roamPos.x,-820,820),S.roamPos.z=Je.clamp(S.roamPos.z,-1620,480),f&&(S.speed*=.35),S.roamPos.y=dt(S.roamPos.x,S.roamPos.z)+.55,Ko(),et.has("KeyR")&&(Uh(),et.delete("KeyR"))}const Al=2.6;function Cl(i,e){let t=!1;for(let n=0;n<e.length;n++){const s=e[n],r=s.hw+Al,a=s.hd+Al,o=i.x-s.x,c=i.z-s.z;if(Math.abs(o)>=r||Math.abs(c)>=a)continue;t=!0;const l=r-Math.abs(o),d=a-Math.abs(c);l<d?i.x=s.x+(o<0?-r:r):i.z=s.z+(c<0?-a:a)}return t}function Fg(i){let e=!1;for(let t=0;t<2;t++){const n=Cl(i,ei),s=Cl(i,Mi);if(!n&&!s)break;e=!0}return e}function Og(i){if(window.__freeCam)return;if(Math.abs(S.speed)>_o){let c=S.roamYaw-S.camYaw;c=Math.atan2(Math.sin(c),Math.cos(c)),S.camYaw+=c*(1-Math.pow(.08,i))}const e=Math.sin(S.camYaw),t=-Math.cos(S.camYaw),n=S.roamPos,s=18+Math.abs(S.speed)*.08,r=Ch.set(n.x-e*s,n.y+8.5,n.z-t*s);r.y=Math.max(r.y,dt(r.x,r.z)+3.5),tt.position.lerp(r,1-Math.pow(.0023,i));const a=qo.set(n.x+e*12,n.y+2.6,n.z+t*12);En.position.copy(tt.position),En.lookAt(a),En.rotateY(Math.PI),tt.quaternion.slerp(En.quaternion,1-Math.pow(.05,i));const o=70+Math.min(8,Math.abs(S.speed)*.05);Math.abs(tt.fov-o)>.02&&(tt.fov+=(o-tt.fov)*(1-Math.pow(.01,i)),tt.updateProjectionMatrix())}function Fh(i){if(S.mode==="result")return;S.mode="result";const e=Math.max(0,Math.round(S.score-S.damage*9+Math.max(0,220-S.time)*45));e>S.best&&(S.best=e,localStorage.setItem("steel-ribbon-best",String(e))),Be.best.textContent=`Best score ${S.best}`,Be.resultText.textContent=`${i} Score ${e}. Time ${vo(S.time)}. Damage ${Math.round(S.damage)}%.`;const t=Number.isFinite(S.bestLap)?vo(S.bestLap):"--:--.-";Be.resultStats.innerHTML=`
    <span>Run stats</span>
    <b>Best lap: ${t}</b>
    <b>Clean landings: ${S.cleanLandings}</b>
    <b>Hard landings: ${S.hardLandings}</b>
    <b>Recoveries: ${S.recoveries}</b>
    <b>Near edges: ${Math.round(S.nearMisses)}</b>
  `,Be.result.classList.remove("hidden")}function Rl(i="Craned back to the ribbon"){const e=ut(S.lastSafeS);S.s=S.lastSafeS,S.totalDistance=S.lastSafeDistance,S.lateral=0,S.lateralVel=0,S.y=e.p.y+2.1,S.yVel=0,S.speed=Math.max(16,S.speed*.32),S.grounded=!0,S.cameraShake=1.2,S.message=i,S.messageTimer=1.4,S.recoveries+=1}function Jo(i,e){return Je.clamp(e*i.tangent.y,-48,48)}function Bg(i=94){return ee.gaps.map(e=>{const t=ut(e.start),n=ut(e.end+3),s=(e.end-e.start)/Math.max(1,i),r=Jo(t,i),a=t.p.y+2.1+r*s-.5*31*s*s,o=n.p.y+2.1;return{name:e.name,start:e.start,end:e.end,length:e.end-e.start,lipGradeDeg:Math.round(Je.radToDeg(t.grade)*10)/10,launchYVel:Math.round(r*10)/10,projectedClearance:Math.round((a-o)*10)/10}})}function Pl(i,e){S.grounded=!1,S.yVel=Jo(i,S.speed),S.airtime=0,e&&(S.message=e)}window.__steelRibbonDebug={launchVelocityAt(i,e){return Jo(ut(i),e)},gapJumpReport(i){return Bg(i)},sceneryClearanceReport(){return xg()},setSpeed(i){return S.speed=Je.clamp(i,-14,156-S.damage*.42),Cs(),S.speed},setTrackPosition(i,e=S.speed){const t=ut(i);return S.totalDistance=i,S.s=t.s,S.lastSafeS=t.s,S.lastSafeDistance=i,S.lateral=0,S.lateralVel=0,S.y=t.p.y+2.1,S.yVel=0,S.grounded=!0,S.speed=Je.clamp(e,-14,156-S.damage*.42),Cs(),{s:S.s,totalDistance:S.totalDistance,speed:S.speed,y:S.y}},setDamage(i){return S.damage=Je.clamp(i,0,99),Cs(),S.damage},setCourse(i){return Zo(i)},flyCam(i,e,t,n,s,r){return window.__freeCam=!0,tt.position.set(i,e,t),tt.lookAt(n,s,r),tt.fov=62,tt.updateProjectionMatrix(),"freecam"},listCourses(){return ns.map((i,e)=>({index:e,name:i.name,length:i.length,width:i.width,laps:i.laps,gaps:i.gaps.length}))},courseInfo(){return{index:br,name:ee.name,length:ee.length,width:ee.width,laps:ee.laps}},probeDown(i,e){const n=new rf(new D(i,400,e),new D(0,-1,0),0,1e3).intersectObjects(Ge.children,!0).map(s=>({y:+s.point.y.toFixed(2),name:s.object.material?.color?"#"+s.object.material.color.getHexString():"?"}));return{x:i,z:e,ground:+dt(i,e).toFixed(2),hits:n.slice(0,5)}},colliderSample(i=8){return ei.slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},pylonColliderSample(i=8){return Mi.slice(0,i).map(e=>({x:+e.x.toFixed(1),z:+e.z.toFixed(1),hw:+e.hw.toFixed(1),hd:+e.hd.toFixed(1)}))},setRoamPose(i,e,t){S.roamPos.set(i,dt(i,e),e),S.roamYaw=t,S.camYaw=t,S.wheelSteer=0,S.speed=0,Ko();const n=Math.sin(S.roamYaw),s=-Math.cos(S.roamYaw);return tt.position.set(S.roamPos.x-n*18,S.roamPos.y+8.5,S.roamPos.z-s*18),tt.lookAt(S.roamPos.x+n*12,S.roamPos.y+2.6,S.roamPos.z+s*12),tt.fov=70,tt.updateProjectionMatrix(),this.roamReport()},simulateRoamDrive(i=1,e=0,t=0,n=0){if(S.mode!=="roam")return this.roamReport();const s={steer:We.steer,throttle:We.throttle,brake:We.brake};We.steer=Je.clamp(e,-1,1),We.throttle=Je.clamp(t,0,1),We.brake=Je.clamp(n,0,1);const r=1/60;let a=Math.max(0,Math.min(i,8));for(;a>0;){const o=Math.min(r,a);Nh(o),a-=o}return We.steer=s.steer,We.throttle=s.throttle,We.brake=s.brake,this.roamReport()},roamReport(){const i=S.roamPos,e=Ch.set(0,0,-1).applyQuaternion(Ln.quaternion).normalize(),t=qo.set(Math.sin(S.roamYaw),0,-Math.cos(S.roamYaw)).normalize();return{mode:S.mode,x:+i.x.toFixed(2),y:+i.y.toFixed(2),z:+i.z.toFixed(2),yaw:+S.roamYaw.toFixed(3),camYaw:+S.camYaw.toFixed(3),speed:+S.speed.toFixed(2),groundXZ:+dt(i.x,i.z).toFixed(2),camX:+tt.position.x.toFixed(2),camY:+tt.position.y.toFixed(2),camZ:+tt.position.z.toFixed(2),colliders:ei.length+Mi.length,insideBuilding:ei.concat(Mi).some(n=>Math.abs(i.x-n.x)<n.hw&&Math.abs(i.z-n.z)<n.hd),carForward:{x:+e.x.toFixed(3),z:+e.z.toFixed(3)},driveForward:{x:+t.x.toFixed(3),z:+t.z.toFixed(3)},wheelRotY:Ln.userData.frontWheels?+Ln.userData.frontWheels[0].rotation.y.toFixed(3):null}}};function zg(i){if(S.mode!=="race")return;S.time+=i,S.freeRun&&(S.damage=0);const e=S.breakdownTimer>0;e&&(S.breakdownTimer-=i,S.breakdownTimer<=0&&(S.damage=55,S.message="Patched up — back on it",S.messageTimer=1.2));const t=Math.max(et.has("KeyW")||et.has("ArrowUp")?1:0,We.throttle),n=Math.max(et.has("KeyS")||et.has("ArrowDown")?1:0,We.brake),s=Je.clamp((et.has("KeyD")||et.has("ArrowRight")?1:0)-(et.has("KeyA")||et.has("ArrowLeft")?1:0)+We.steer,-1,1),r=t>.03&&!e,a=(et.has("ShiftLeft")||et.has("ShiftRight"))&&S.boost>.02&&r&&S.grounded,o=ut(S.s),c=o.p.y+2.1,l=Math.abs(S.speed);if(r){const h=S.speed<0?40:0;S.speed+=((a?68:40)+h)*t*i}if(n>.03){const h=S.speed>1.2?70:26;S.speed-=h*n*i}const d=S.grounded?.0024:.0011;S.speed-=d*S.speed*l*i,l>.08?S.speed-=Math.sign(S.speed)*(S.grounded?2.2:.3)*i:t<=.03&&n<=.03&&(S.speed=0),S.speed=Je.clamp(S.speed,-16,156-S.damage*.8),e&&(S.speed=Math.min(S.speed,14)),S.boosting=a,a?(S.boost=Math.max(0,S.boost-i*.21),S.score+=28*i):S.boost=Math.min(1,S.boost+i*(S.grounded?.045:.018));const u=14+l*.12;S.lateralVel-=s*u*i,S.lateralVel-=S.lateralVel*(S.grounded?3.4:.7)*i,S.lateral+=S.lateralVel*i;const f=is(S.s),p=Math.abs(S.lateral)<ee.width*.52,g=!f&&p;if(S.grounded&&(!g||Math.abs(S.lateral)>ee.width*.5)&&Pl(o,p?"":"Edge slip"),S.grounded){const h=Math.sin(S.time*18)*Math.min(.22,Math.abs(S.speed)/700);S.y=Je.lerp(S.y,c+h,.5),S.yVel=0,S.lastSafeS=S.s,S.lastSafeDistance=S.totalDistance,S.score+=Math.max(0,S.speed)*i*.34,Math.abs(S.lateral)>ee.width*.42&&(S.damage+=i*(1.2+Math.abs(S.speed)*.035),S.cameraShake=Math.max(S.cameraShake,.24),S.nearMisses+=i*.8,Math.random()<i*5&&El(o.p.clone().addScaledVector(o.side,Math.sign(S.lateral)*ee.width*.55).addScaledVector(kt,1.2),4))}else{S.yVel-=31*i,S.y+=S.yVel*i,S.airtime+=i,S.score+=i*11;const h=ut(S.s),v=h.p.y+2.1;if(!is(S.s)&&Math.abs(S.lateral)<ee.width*.55&&S.y<=v&&S.yVel<0){const b=-S.yVel,E=Math.abs(S.lateral)<ee.width*.34&&b<30;S.y=v,S.grounded=!0,S.yVel=0,S.lastSafeS=S.s,S.lastSafeDistance=S.totalDistance,S.damage+=Math.max(0,b-17)*.82+Math.max(0,Math.abs(S.lateral)-ee.width*.36)*1.8,S.score+=E?260+S.airtime*85:Math.max(30,120-b),S.cameraShake=Math.max(S.cameraShake,b/34),S.message=E?"Clean landing":"Hard landing",S.messageTimer=.9,E?S.cleanLandings+=1:S.hardLandings+=1,Tl(b),El(h.p.clone().addScaledVector(h.side,S.lateral).addScaledVector(kt,.7),E?7:24),S.airtime=0}S.y<-55&&(S.damage+=28,Rl("Track crew recovery"))}const M=S.totalDistance;S.totalDistance+=S.speed*i,S.s=(S.totalDistance%ee.length+ee.length)%ee.length;const m=Math.floor(S.totalDistance/ee.length)+1;if(m>S.lap){const h=S.time-S.lapStartTime;S.splitTimes.push(h),S.bestLap=Math.min(S.bestLap,h),S.lapStartTime=S.time,S.lap=m,S.score+=1200,S.message=S.practice?`Lap ${S.lap}`:S.lap<=ee.laps?`Lap ${S.lap}`:"Season race complete",S.messageTimer=1.4,!S.practice&&S.lap>ee.laps&&Fh(S.totalDistance>=S.rivalDistance?"You took the chequered gantry.":"You finished behind Crowther.")}for(const h of ee.gaps)lg(M,S.totalDistance,h.start)&&(S.message=h.name,S.messageTimer=1.1,S.grounded&&Pl(ut(h.start),h.name));S.damage=Je.clamp(S.damage,0,100),!S.freeRun&&S.damage>=90&&S.breakdownTimer<=0&&(S.breakdownTimer=2.6,S.message="Chassis cracked — limping to repair",S.messageTimer=1.6,S.cameraShake=Math.max(S.cameraShake,.8),Tl(40),S.damage=90),et.has("KeyR")&&(S.damage=Math.min(99,S.damage+8),Rl("Manual reset"),et.delete("KeyR"))}function Vg(i){if(S.mode==="race"&&!S.practice){const r=S.totalDistance-S.rivalDistance,a=Je.clamp(r*.06,-12,16),o=Math.sin(S.time*.6)*5;S.rivalSpeed=Je.clamp(92+a+o,70,120),S.rivalDistance+=S.rivalSpeed*i,S.rivalDistance>=ee.length*ee.laps&&S.lap<=ee.laps&&Fh("Crowther reached the gantry first.")}S.rivalS=(S.rivalDistance%ee.length+ee.length)%ee.length;const e=ut(S.rivalS),t=e.p.clone().addScaledVector(kt,1.4).addScaledVector(e.side,Math.sin(S.rivalS*.02)*1.4);Tr.position.copy(t);const n=new lt().makeBasis(e.side,kt,e.tangent);Tr.quaternion.setFromRotationMatrix(n);const s=Math.abs(S.rivalDistance-S.totalDistance)<26;Tr.visible=(S.mode==="race"||S.mode==="paused")&&!S.practice&&!s}function Oh(i){if(window.__freeCam)return;const e=ut(S.s),t=e.side.clone().multiplyScalar(S.lateral),n=e.p.clone().add(t);n.y=S.y;const s=S.cameraShake;s>.01&&(n.x+=(Math.random()-.5)*s*.8,n.y+=(Math.random()-.5)*s*.45),tt.position.copy(n);const r=Math.abs(S.speed),a=68+Math.min(10,r*.055)+(et.has("ShiftLeft")||et.has("ShiftRight")?3:0);Math.abs(tt.fov-a)>.02&&(tt.fov+=(a-tt.fov)*(1-Math.pow(.004,i)),tt.updateProjectionMatrix());const o=ut(S.s+34+S.speed*.16),c=o.p.clone().addScaledVector(o.side,S.lateral*.45);c.y+=1.7+Math.sin(S.time*8)*Math.min(.2,r/680),En.position.copy(tt.position),En.lookAt(c),En.rotateY(Math.PI),En.rotateZ(-e.bank*.72-S.lateralVel*.006),En.rotateX(e.grade*.18+(S.grounded?0:Je.clamp(S.yVel,-30,30)*-.006)),tt.quaternion.slerp(En.quaternion,1-Math.pow(8e-4,i)),S.cameraShake=Math.max(0,S.cameraShake-i*1.9);const l=qo.set(0,0,-1).applyQuaternion(tt.quaternion).normalize();window.__steelRibbonTelemetry={mode:S.mode,s:S.s,totalDistance:S.totalDistance,rivalDistance:S.rivalDistance,speed:S.speed,lap:S.lap,score:S.score,damage:S.damage,y:S.y,yVel:S.yVel,grounded:S.grounded,input:{steer:We.steer,throttle:We.throttle,brake:We.brake},forwardWorld:{x:e.tangent.x,y:e.tangent.y,z:e.tangent.z},cameraWorld:{x:l.x,y:l.y,z:l.z}}}const vi={idle:900,shift:7400,redline:7500,max:9e3,postShift:2900},vs=[28,54,82,110,134,156];function kg(){const i=Math.abs(S.speed);let e=1;for(let o=0;o<vs.length;o++)i>vs[o]&&(e=o+2);e=Math.min(e,vs.length);const t=e===1?0:vs[e-2],n=vs[e-1],s=n>t?Je.clamp((i-t)/(n-t),0,1):0,r=e===1?vi.idle:vi.postShift;let a=r+s*(vi.shift-r);return i<.4&&(a=vi.idle),{gear:e,rpm:a}}let Ll=performance.now(),ba=0,wa=0;function Bh(i){const e=i.getContext("2d"),t=Math.min(2,window.devicePixelRatio||1),n=i.clientWidth||120,s=i.clientHeight||70;(i.width!==Math.round(n*t)||i.height!==Math.round(s*t))&&(i.width=Math.round(n*t),i.height=Math.round(s*t)),e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,n,s);const r=n/2,a=s-s*.14,o=Math.min(n*.46,s*.9);return{ctx:e,w:n,h:s,cx:r,cy:a,R:o,aFor:d=>Math.PI-d*Math.PI,at:(d,u)=>[r+Math.cos(d)*u,a-Math.sin(d)*u]}}function Gg(i,e){const t=Be.speedo;if(!t)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=Bh(t),l=360;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke(),n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let g=0;g<=l;g+=20){const M=g/l,m=o(M),h=g%80===0;n.strokeStyle="rgba(180, 230, 255, 0.85)",n.lineWidth=h?Math.max(1.4,a*.035):Math.max(1,a*.02);const v=c(m,a-a*.02),_=c(m,a-a*(h?.18:.1));if(n.beginPath(),n.moveTo(v[0],v[1]),n.lineTo(_[0],_[1]),n.stroke(),h){const b=c(m,a-a*.34);n.fillStyle="#cfeeff",n.fillText(String(g/10),b[0],b[1])}}const d=Je.clamp(i/l,0,1),u=o(d),f=c(u,a-a*.06),p=c(u+Math.PI,a*.14);n.strokeStyle="#7df1ff",n.shadowColor="rgba(80, 220, 255, 0.9)",n.shadowBlur=a*.18,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(p[0],p[1]),n.lineTo(f[0],f[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("MPH",s,r-a*.26),n.fillStyle=e?"#ff8077":"#f2f8ff",n.font=`800 ${Math.max(9,a*.2)}px "Courier New", monospace`,n.fillText(e?`-${Math.round(i)}`:String(Math.round(i)),s,r+a*.02)}function Hg(i,e){const t=Be.boostGauge;if(!t)return;const{ctx:n,cx:s,cy:r,R:a,aFor:o,at:c}=Bh(t),l=18;n.lineCap="round",n.lineWidth=Math.max(2,a*.07),n.strokeStyle="rgba(120, 205, 255, 0.3)",n.beginPath(),n.arc(s,r,a,o(1),o(0)),n.stroke();const d=Je.clamp(i,0,1),u=i<.25;n.strokeStyle=u?"#ff5436":e?"#ffb53a":"#46e0b0",n.shadowColor=e?"rgba(255, 170, 50, 0.9)":"rgba(70, 224, 176, 0.6)",n.shadowBlur=e?a*.25:a*.1,n.lineWidth=Math.max(2,a*.07),n.beginPath(),n.arc(s,r,a,o(d),o(0)),n.stroke(),n.shadowBlur=0,n.font=`700 ${Math.max(6,a*.15)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let M=0;M<=l;M+=3){const m=M/l,h=o(m),v=M%6===0;n.strokeStyle=M>=l*.85?"#ff6155":"rgba(180, 230, 255, 0.8)",n.lineWidth=v?Math.max(1.3,a*.03):Math.max(1,a*.018);const _=c(h,a-a*.02),b=c(h,a-a*(v?.17:.1));if(n.beginPath(),n.moveTo(_[0],_[1]),n.lineTo(b[0],b[1]),n.stroke(),v){const E=c(h,a-a*.33);n.fillStyle="#cfeeff",n.fillText(String(M),E[0],E[1])}}const f=o(d),p=c(f,a-a*.06),g=c(f+Math.PI,a*.14);n.strokeStyle=u?"#ff5436":"#ffd23f",n.shadowColor="rgba(255, 200, 60, 0.8)",n.shadowBlur=a*.16,n.lineWidth=Math.max(1.8,a*.05),n.beginPath(),n.moveTo(g[0],g[1]),n.lineTo(p[0],p[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,a*.03),n.beginPath(),n.arc(s,r,a*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,a*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("BOOST psi",s,r-a*.26),e&&(n.fillStyle="#ffce4a",n.shadowColor="rgba(255, 190, 60, 0.95)",n.shadowBlur=a*.3,n.beginPath(),n.arc(s,r+a*.02,a*.07,0,Math.PI*2),n.fill(),n.shadowBlur=0)}function Wg(i,e){const t=Be.tach;if(!t)return;const n=t.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),r=t.clientWidth||160,a=t.clientHeight||70;(t.width!==Math.round(r*s)||t.height!==Math.round(a*s))&&(t.width=Math.round(r*s),t.height=Math.round(a*s)),n.setTransform(s,0,0,s,0,0),n.clearRect(0,0,r,a);const o=r/2,c=a-a*.14,l=Math.min(r*.46,a*.9),d=vi.max,u=_=>Math.PI-_*Math.PI,f=(_,b)=>[o+Math.cos(_)*b,c-Math.sin(_)*b];n.lineCap="round",n.lineWidth=Math.max(2,l*.07),n.strokeStyle="rgba(120, 205, 255, 0.32)",n.beginPath(),n.arc(o,c,l,u(1),u(0)),n.stroke();const p=vi.redline/d;n.strokeStyle="#ff3b30",n.beginPath(),n.arc(o,c,l,u(1),u(p)),n.stroke(),n.font=`700 ${Math.max(7,l*.17)}px "Courier New", monospace`,n.textAlign="center",n.textBaseline="middle";for(let _=0;_<=9;_++){const b=_/9,E=u(b),T=_*1e3>=vi.redline;n.strokeStyle=T?"#ff6155":"rgba(180, 230, 255, 0.9)",n.lineWidth=Math.max(1.4,l*.035);const P=f(E,l-l*.02),A=f(E,l-l*.18);n.beginPath(),n.moveTo(P[0],P[1]),n.lineTo(A[0],A[1]),n.stroke();const y=f(E,l-l*.34);if(n.fillStyle=T?"#ff8077":"#cfeeff",n.fillText(String(_),y[0],y[1]),_<9){const x=u((_+.5)/9),R=f(x,l-l*.02),I=f(x,l-l*.1);n.strokeStyle="rgba(150, 210, 255, 0.5)",n.lineWidth=Math.max(1,l*.02),n.beginPath(),n.moveTo(R[0],R[1]),n.lineTo(I[0],I[1]),n.stroke()}}const g=Je.clamp(i/d,0,1),M=u(g),m=f(M,l-l*.06),h=f(M+Math.PI,l*.14);n.strokeStyle="#ffdd48",n.shadowColor="rgba(255, 200, 60, 0.9)",n.shadowBlur=l*.18,n.lineWidth=Math.max(1.8,l*.05),n.beginPath(),n.moveTo(h[0],h[1]),n.lineTo(m[0],m[1]),n.stroke(),n.shadowBlur=0,n.fillStyle="#13303d",n.strokeStyle="#6ec7ff",n.lineWidth=Math.max(1,l*.03),n.beginPath(),n.arc(o,c,l*.1,0,Math.PI*2),n.fill(),n.stroke(),n.fillStyle="rgba(135, 223, 255, 0.85)",n.font=`700 ${Math.max(6,l*.12)}px "Courier New", monospace`,n.textBaseline="alphabetic",n.fillText("x1000 r/min",o,c-l*.26);const v=S.speed<-.5?"R":String(e);n.fillStyle="#f2f8ff",n.font=`800 ${Math.max(9,l*.22)}px "Courier New", monospace`,n.fillText(v,o,c+l*.02)}function Cs(){ee.length*ee.laps;const i=_l(S.practice?S.totalDistance%ee.length:S.totalDistance),e=S.practice?0:_l(S.rivalDistance),t=S.practice?"SOLO":S.totalDistance>=S.rivalDistance?"P1":"P2";t!==S.leadState&&S.mode==="race"&&(S.leadState=t,S.practice||(S.message=t==="P1"?"You took the lead":"Crowther ahead",S.messageTimer=.95)),Be.damage.style.width=`${Math.round(S.damage)}%`,Be.lap.textContent=S.practice?`LAP ${S.lap}`:`${Math.min(S.lap,ee.laps)}/${ee.laps}`,Be.timer.textContent=vo(S.time),Be.score.textContent=`Score ${Math.round(S.score)}`;const n=S.mode==="roam",s=S.mode==="race"||S.mode==="paused"||n;Be.position.textContent=n?"FREE ROAM":S.freeRun?"FREE RUN":S.practice?"PRACTICE":`${t} DIV 4`,Be.hud.style.display=s?"flex":"none",Be.raceStrip.style.display=S.mode==="race"||S.mode==="paused"?"grid":"none",Be.touchControls.style.display=s?"":"none",Be.playerProgress.style.width=`${Math.round(i*100)}%`,Be.rivalProgress.style.width=`${Math.round(e*100)}%`;const r=kg();S.gear=r.gear;const a=performance.now(),o=Math.min(.05,(a-Ll)/1e3);Ll=a;const c=1-Math.exp(-o*(r.rpm>S.tachRpm?10:6));S.tachRpm+=(r.rpm-S.tachRpm)*c,Wg(S.tachRpm,r.gear);const l=Math.abs(S.speed)*2.25;ba+=(l-ba)*(1-Math.exp(-o*8)),wa+=(S.boost-wa)*(1-Math.exp(-o*9)),Gg(ba,S.speed<-.5),Hg(wa,S.boosting),Be.speedFx.style.opacity=Math.max(0,Math.min(.18,(Math.abs(S.speed)-44)/150)),Be.damageFx.style.opacity=S.damage<18?0:Math.min(.72,(S.damage-18)/82),S.mode==="paused"?(Be.centerMessage.textContent="Paused",Be.centerMessage.classList.remove("hidden")):S.messageTimer>0?(Be.centerMessage.textContent=S.message,Be.centerMessage.classList.remove("hidden")):Be.centerMessage.classList.add("hidden")}function vo(i){const e=Math.floor(i/60),t=i-e*60;return`${String(e).padStart(2,"0")}:${t.toFixed(1).padStart(4,"0")}`}function zh(){const i=ig.getDelta(),e=Math.min(.033,i);S.messageTimer>0&&(S.messageTimer-=e),S.mode==="roam"?(Nh(e),Og(e)):(zg(e),Vg(e),Oh(e)),Ug(e),pg(e),Cs(),Ng(),ys.uniforms.uTime.value+=e,ys.uniforms.uSpeed.value=Math.min(1,Math.abs(S.speed)/150);const t=(et.has("ShiftLeft")||et.has("ShiftRight"))&&S.boost>.02&&S.mode==="race";ys.uniforms.uBoost.value+=((t?1:0)-ys.uniforms.uBoost.value)*Math.min(1,e*6),cs.render(),requestAnimationFrame(zh)}window.addEventListener("keydown",i=>{et.add(i.code),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(i.code)&&i.preventDefault(),i.code==="KeyP"&&S.mode==="race"?(S.mode="paused",et.clear(),Ir()):i.code==="KeyP"&&S.mode==="paused"?S.mode="race":i.code==="Escape"&&(S.mode==="race"||S.mode==="paused"||S.mode==="roam")&&(S.mode="menu",Ir(),Ln.visible=!1,bi&&(bi.visible=!0),Be.menu.classList.remove("hidden"))});window.addEventListener("keyup",i=>et.delete(i.code));window.addEventListener("resize",()=>{tt.aspect=window.innerWidth/window.innerHeight,tt.updateProjectionMatrix(),sn.setSize(window.innerWidth,window.innerHeight),cs.setSize(window.innerWidth,window.innerHeight),Dh.setSize(window.innerWidth,window.innerHeight)});Be.startBtn.addEventListener("click",()=>Br(!1));Be.practiceBtn.addEventListener("click",()=>Br(!0));Be.freeRunBtn.addEventListener("click",()=>Br(!0,!0));Be.roamBtn.addEventListener("click",()=>Uh());Be.againBtn.addEventListener("click",()=>Br(!1));Be.courseButtons.forEach(i=>{i.addEventListener("click",()=>Zo(Number(i.dataset.course)))});function Vh(i){i&&(i.classList.remove("active"),i.style.setProperty("--stick-x","0px"),i.style.setProperty("--stick-y","0px"))}function Ir(){We.steer=0,We.throttle=0,We.brake=0,We.steerPointer=null,We.drivePointer=null;for(const i of Be.touchControls.querySelectorAll(".touch-stick"))Vh(i)}function xr(i,e){const t=i.getBoundingClientRect(),n=Math.min(t.width,t.height)*.36;if(!(n>0))return;const s=Je.clamp(e.clientX-(t.left+t.width/2),-n,n),r=Je.clamp(e.clientY-(t.top+t.height/2),-n,n),a=i.dataset.stick;if(i.classList.add("active"),a==="steer")We.steer=Je.clamp(s/n,-1,1),i.style.setProperty("--stick-x",`${Math.round(We.steer*n)}px`),i.style.setProperty("--stick-y","0px");else{const o=Je.clamp(s/n,-1,1),c=Je.clamp(-r/n,-1,1);We.steer=o,We.throttle=Math.max(0,c),We.brake=Math.max(0,-c),i.style.setProperty("--stick-x",`${Math.round(o*n)}px`),i.style.setProperty("--stick-y",`${Math.round(-c*n)}px`)}}function Dl(i,e){return Array.from(i.changedTouches).find(t=>t.identifier===e)}function Il(i,e){e==="steer"?(We.steer=0,We.steerPointer=null):(We.steer=0,We.throttle=0,We.brake=0,We.drivePointer=null),Vh(i)}for(const i of Be.touchControls.querySelectorAll(".touch-stick")){const e=i.dataset.stick;i.addEventListener("pointerdown",s=>{s.preventDefault(),Dr(),S.mode==="paused"&&(S.mode="race"),e==="steer"&&(We.steerPointer=s.pointerId),e==="drive"&&(We.drivePointer=s.pointerId),xr(i,s)},{passive:!1}),i.addEventListener("pointermove",s=>{(e==="steer"?We.steerPointer:We.drivePointer)===s.pointerId&&(s.preventDefault(),xr(i,s))},{passive:!1});const t=s=>{(e==="steer"?We.steerPointer:We.drivePointer)===s.pointerId&&Il(i,e)};i.addEventListener("pointerup",t),i.addEventListener("pointercancel",t),i.addEventListener("touchstart",s=>{s.preventDefault(),Dr(),S.mode==="paused"&&(S.mode="race");const r=s.changedTouches[0];r&&(e==="steer"&&(We.steerPointer=r.identifier),e==="drive"&&(We.drivePointer=r.identifier),xr(i,r))},{passive:!1}),i.addEventListener("touchmove",s=>{const r=e==="steer"?We.steerPointer:We.drivePointer,a=Dl(s,r);a&&(s.preventDefault(),xr(i,a))},{passive:!1});const n=s=>{const r=e==="steer"?We.steerPointer:We.drivePointer;Dl(s,r)&&(s.preventDefault(),Il(i,e))};i.addEventListener("touchend",n,{passive:!1}),i.addEventListener("touchcancel",n,{passive:!1})}for(const i of Be.touchControls.querySelectorAll("button")){const e=i.dataset.code;i.addEventListener("pointerdown",n=>{n.preventDefault(),Dr(),et.add(e),i.setPointerCapture(n.pointerId)});const t=()=>et.delete(e);i.addEventListener("pointerup",t),i.addEventListener("pointercancel",t),i.addEventListener("lostpointercapture",t)}const Xg=ut(S.s);S.y=Xg.p.y+2.1;S.lastSafeS=S.s;S.lastSafeDistance=S.totalDistance;Oh(.016);Cs();zh();
