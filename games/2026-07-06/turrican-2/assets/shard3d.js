(()=>{var Ad=0,Xh=1,Rd=2;var qh=1,Al=2,Pi=3,Vi=0,pn=1,Je=2,un=0,Gi=1,wn=2,Yh=3,Zh=4,Rl=5,ei=100,Cd=101,Pd=102,Id=103,Dd=104,zs=200,Ld=201,Nd=202,Ud=203,tl=204,el=205,jo=206,Fd=207,Qo=208,Od=209,kd=210,Bd=211,zd=212,Hd=213,Vd=214,Cl=0,Pl=1,Il=2,As=3,Dl=4,Ll=5,Nl=6,Ul=7,Jh=0,Gd=1,Wd=2,Zi=0,Fl=1,Ol=2,kl=3,Ur=4,Bl=5,zl=6,Hl=7,Lh="attached",Xd="detached",$h=300,Hs=301,Vs=302,Vl=303,Gl=304,ta=306,Cn=1e3,ns=1001,nl=1002,fn=1003,qd=1004;var ea=1005;var Fn=1006,Wl=1007;var ui=1008;var Bn=1009,Kh=1010,jh=1011,Fr=1012,Xl=1013,as=1014,di=1015,Tn=1016,ql=1017,Yl=1018,ls=1020,Qh=35902,tu=35899,eu=1021,nu=1022,mn=1023,_r=1026,cs=1027,Or=1028,Zl=1029,iu=1030,Jl=1031;var $l=1033,na=33776,ia=33777,sa=33778,ra=33779,Kl=35840,jl=35841,Ql=35842,tc=35843,ec=36196,nc=37492,ic=37496,sc=37808,rc=37809,oc=37810,ac=37811,lc=37812,cc=37813,hc=37814,uc=37815,dc=37816,fc=37817,pc=37818,mc=37819,gc=37820,xc=37821,vc=36492,yc=36494,_c=36495,Mc=36283,bc=36284,Sc=36285,wc=36286;var yo=2300,il=2301,Qa=2302,Nh=2400,Uh=2401,Fh=2402;var Yd=3200,Zd=3201;var Ec=0,Jd=1,fi="",dn="srgb",Rs="srgb-linear",_o="linear",Ne="srgb";var Ts=7680;var Oh=519,$d=512,Kd=513,jd=514,su=515,Qd=516,tf=517,ef=518,nf=519,kh=35044,kr=35048;var ru="300 es",yi=2e3,Mo=2001;var Wi=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let i=e[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},An=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Zu=1234567,mo=Math.PI/180,Mr=180/Math.PI;function hs(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(An[n&255]+An[n>>8&255]+An[n>>16&255]+An[n>>24&255]+"-"+An[t&255]+An[t>>8&255]+"-"+An[t>>16&15|64]+An[t>>24&255]+"-"+An[e&63|128]+An[e>>8&255]+"-"+An[e>>16&255]+An[e>>24&255]+An[i&255]+An[i>>8&255]+An[i>>16&255]+An[i>>24&255]).toLowerCase()}function Me(n,t,e){return Math.max(t,Math.min(e,n))}function ou(n,t){return(n%t+t)%t}function Bp(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function zp(n,t,e){return n!==t?(e-n)/(t-n):0}function go(n,t,e){return(1-e)*n+e*t}function Hp(n,t,e,i){return go(n,t,1-Math.exp(-e*i))}function Vp(n,t=1){return t-Math.abs(ou(n,t*2)-t)}function Gp(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Wp(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Xp(n,t){return n+Math.floor(Math.random()*(t-n+1))}function qp(n,t){return n+Math.random()*(t-n)}function Yp(n){return n*(.5-Math.random())}function Zp(n){n!==void 0&&(Zu=n);let t=Zu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Jp(n){return n*mo}function $p(n){return n*Mr}function Kp(n){return(n&n-1)===0&&n!==0}function jp(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Qp(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function t0(n,t,e,i,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+i)/2),h=o((t+i)/2),u=r((t-i)/2),f=o((t-i)/2),d=r((i-t)/2),g=o((i-t)/2);switch(s){case"XYX":n.set(a*h,l*u,l*f,a*c);break;case"YZY":n.set(l*f,a*h,l*u,a*c);break;case"ZXZ":n.set(l*u,l*f,a*h,a*c);break;case"XZX":n.set(a*h,l*g,l*d,a*c);break;case"YXY":n.set(l*d,a*h,l*g,a*c);break;case"ZYZ":n.set(l*g,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function vr(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Un(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var oa={DEG2RAD:mo,RAD2DEG:Mr,generateUUID:hs,clamp:Me,euclideanModulo:ou,mapLinear:Bp,inverseLerp:zp,lerp:go,damp:Hp,pingpong:Vp,smoothstep:Gp,smootherstep:Wp,randInt:Xp,randFloat:qp,randFloatSpread:Yp,seededRandom:Zp,degToRad:Jp,radToDeg:$p,isPowerOfTwo:Kp,ceilPowerOfTwo:jp,floorPowerOfTwo:Qp,setQuaternionFromProperEuler:t0,normalize:Un,denormalize:vr},mt=class n{constructor(t=0,e=0){n.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Me(this.x,t.x,e.x),this.y=Me(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Me(this.x,t,e),this.y=Me(this.y,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Me(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Me(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Xn=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],f=r[o+0],d=r[o+1],g=r[o+2],x=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=d,t[e+2]=g,t[e+3]=x;return}if(u!==x||l!==f||c!==d||h!==g){let m=1-a,p=l*f+c*d+h*g+u*x,M=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){let T=Math.sqrt(v),A=Math.atan2(T,p*M);m=Math.sin(m*A)/T,a=Math.sin(a*A)/T}let y=a*M;if(l=l*m+f*y,c=c*m+d*y,h=h*m+g*y,u=u*m+x*y,m===1-a){let T=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=T,c*=T,h*=T,u*=T}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,o){let a=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[o],f=r[o+1],d=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*d-c*f,t[e+1]=l*g+h*f+c*u-a*d,t[e+2]=c*g+h*d+a*f-l*u,t[e+3]=h*g-a*u-l*f-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(s/2),u=a(r/2),f=l(i/2),d=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=i+a+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(i>a&&i>u){let d=2*Math.sqrt(1+i-a-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>u){let d=2*Math.sqrt(1+a-i-u);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+u-i-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Me(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-i*c,this._z=r*h+o*c+i*l-s*a,this._w=o*h-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let i=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+i*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=i,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let d=1-e;return this._w=d*o+e*this._w,this._x=d*i+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=o*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},O=class n{constructor(t=0,e=0,i=0){n.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ju.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ju.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*i),h=2*(a*e-r*s),u=2*(r*i-o*e);return this.x=e+l*c+o*u-a*h,this.y=i+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Me(this.x,t.x,e.x),this.y=Me(this.y,t.y,e.y),this.z=Me(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Me(this.x,t,e),this.y=Me(this.y,t,e),this.z=Me(this.z,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Me(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return rh.copy(this).projectOnVector(t),this.sub(rh)}reflect(t){return this.sub(rh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(Me(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},rh=new O,Ju=new Xn,ve=class n{constructor(t,e,i,s,r,o,a,l,c){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c)}set(t,e,i,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],d=i[5],g=i[8],x=s[0],m=s[3],p=s[6],M=s[1],v=s[4],y=s[7],T=s[2],A=s[5],R=s[8];return r[0]=o*x+a*M+l*T,r[3]=o*m+a*v+l*A,r[6]=o*p+a*y+l*R,r[1]=c*x+h*M+u*T,r[4]=c*m+h*v+u*A,r[7]=c*p+h*y+u*R,r[2]=f*x+d*M+g*T,r[5]=f*m+d*v+g*A,r[8]=f*p+d*y+g*R,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-i*r*h+i*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,f=a*l-h*r,d=c*r-o*l,g=e*u+i*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return t[0]=u*x,t[1]=(s*c-h*i)*x,t[2]=(a*i-s*o)*x,t[3]=f*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-a*e)*x,t[6]=d*x,t[7]=(i*l-c*e)*x,t[8]=(o*e-i*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(oh.makeScale(t,e)),this}rotate(t){return this.premultiply(oh.makeRotation(-t)),this}translate(t,e){return this.premultiply(oh.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},oh=new ve;function au(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function bo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function sf(){let n=bo("canvas");return n.style.display="block",n}var $u={};function br(n){n in $u||($u[n]=!0,console.warn(n))}function rf(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}var Ku=new ve().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ju=new ve().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function e0(){let n={enabled:!0,workingColorSpace:Rs,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Ne&&(s.r=Hi(s.r),s.g=Hi(s.g),s.b=Hi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Ne&&(s.r=yr(s.r),s.g=yr(s.g),s.b=yr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===fi?_o:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return br("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return br("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Rs]:{primaries:t,whitePoint:i,transfer:_o,toXYZ:Ku,fromXYZ:ju,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:dn},outputColorSpaceConfig:{drawingBufferColorSpace:dn}},[dn]:{primaries:t,whitePoint:i,transfer:Ne,toXYZ:Ku,fromXYZ:ju,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:dn}}}),n}var Re=e0();function Hi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function yr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var rr,sl=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{rr===void 0&&(rr=bo("canvas")),rr.width=t.width,rr.height=t.height;let s=rr.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=rr}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=bo("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Hi(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Hi(e[i]/255)*255):e[i]=Hi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},n0=0,Sr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:n0++}),this.uuid=hs(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ah(s[o].image)):r.push(ah(s[o]))}else r=ah(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function ah(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?sl.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var i0=0,lh=new O,On=class n extends Wi{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=ns,s=ns,r=Fn,o=ui,a=mn,l=Bn,c=n.DEFAULT_ANISOTROPY,h=fi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:i0++}),this.uuid=hs(),this.name="",this.source=new Sr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new mt(0,0),this.repeat=new mt(1,1),this.center=new mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(lh).x}get height(){return this.source.getSize(lh).y}get depth(){return this.source.getSize(lh).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==$h)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Cn:t.x=t.x-Math.floor(t.x);break;case ns:t.x=t.x<0?0:1;break;case nl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Cn:t.y=t.y-Math.floor(t.y);break;case ns:t.y=t.y<0?0:1;break;case nl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};On.DEFAULT_IMAGE=null;On.DEFAULT_MAPPING=$h;On.DEFAULT_ANISOTROPY=1;var De=class n{constructor(t=0,e=0,i=0,s=1){n.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let v=(c+1)/2,y=(d+1)/2,T=(p+1)/2,A=(h+f)/4,R=(u+x)/4,C=(g+m)/4;return v>y&&v>T?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=A/i,r=R/i):y>T?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=A/s,r=C/s):T<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(T),i=R/r,s=C/r),this.set(i,s,r,e),this}let M=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-x)/M,this.z=(f-h)/M,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Me(this.x,t.x,e.x),this.y=Me(this.y,t.y,e.y),this.z=Me(this.z,t.z,e.z),this.w=Me(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Me(this.x,t,e),this.y=Me(this.y,t,e),this.z=Me(this.z,t,e),this.w=Me(this.w,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Me(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},rl=class extends Wi{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Fn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new De(0,0,t,e),this.scissorTest=!1,this.viewport=new De(0,0,t,e);let s={width:t,height:e,depth:i.depth},r=new On(s);this.textures=[];let o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){let e={minFilter:Fn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Sr(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ln=class extends rl{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},So=class extends On{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=ns,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var ol=class extends On{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=ns,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var _i=class{constructor(t=new O(1/0,1/0,1/0),e=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(gi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(gi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=gi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,gi):gi.fromBufferAttribute(r,o),gi.applyMatrix4(t.matrixWorld),this.expandByPoint(gi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Pa.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Pa.copy(i.boundingBox)),Pa.applyMatrix4(t.matrixWorld),this.union(Pa)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,gi),gi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(oo),Ia.subVectors(this.max,oo),or.subVectors(t.a,oo),ar.subVectors(t.b,oo),lr.subVectors(t.c,oo),Ji.subVectors(ar,or),$i.subVectors(lr,ar),bs.subVectors(or,lr);let e=[0,-Ji.z,Ji.y,0,-$i.z,$i.y,0,-bs.z,bs.y,Ji.z,0,-Ji.x,$i.z,0,-$i.x,bs.z,0,-bs.x,-Ji.y,Ji.x,0,-$i.y,$i.x,0,-bs.y,bs.x,0];return!ch(e,or,ar,lr,Ia)||(e=[1,0,0,0,1,0,0,0,1],!ch(e,or,ar,lr,Ia))?!1:(Da.crossVectors(Ji,$i),e=[Da.x,Da.y,Da.z],ch(e,or,ar,lr,Ia))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,gi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(gi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Fi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Fi=[new O,new O,new O,new O,new O,new O,new O,new O],gi=new O,Pa=new _i,or=new O,ar=new O,lr=new O,Ji=new O,$i=new O,bs=new O,oo=new O,Ia=new O,Da=new O,Ss=new O;function ch(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Ss.fromArray(n,r);let a=s.x*Math.abs(Ss.x)+s.y*Math.abs(Ss.y)+s.z*Math.abs(Ss.z),l=t.dot(Ss),c=e.dot(Ss),h=i.dot(Ss);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var s0=new _i,ao=new O,hh=new O,Ci=class{constructor(t=new O,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):s0.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ao.subVectors(t,this.center);let e=ao.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(ao,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(hh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ao.copy(t.center).add(hh)),this.expandByPoint(ao.copy(t.center).sub(hh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Oi=new O,uh=new O,La=new O,Ki=new O,dh=new O,Na=new O,fh=new O,wo=class{constructor(t=new O,e=new O(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Oi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Oi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Oi.copy(this.origin).addScaledVector(this.direction,e),Oi.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){uh.copy(t).add(e).multiplyScalar(.5),La.copy(e).sub(t).normalize(),Ki.copy(this.origin).sub(uh);let r=t.distanceTo(e)*.5,o=-this.direction.dot(La),a=Ki.dot(this.direction),l=-Ki.dot(La),c=Ki.lengthSq(),h=Math.abs(1-o*o),u,f,d,g;if(h>0)if(u=o*l-a,f=o*a-l,g=r*h,u>=0)if(f>=-g)if(f<=g){let x=1/h;u*=x,f*=x,d=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),d=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(uh).addScaledVector(La,f),d}intersectSphere(t,e){Oi.subVectors(t.center,this.origin);let i=Oi.dot(this.direction),s=Oi.dot(Oi)-i*i,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(i=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Oi)!==null}intersectTriangle(t,e,i,s,r){dh.subVectors(e,t),Na.subVectors(i,t),fh.crossVectors(dh,Na);let o=this.direction.dot(fh),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ki.subVectors(this.origin,t);let l=a*this.direction.dot(Na.crossVectors(Ki,Na));if(l<0)return null;let c=a*this.direction.dot(dh.cross(Ki));if(c<0||l+c>o)return null;let h=-a*Ki.dot(fh);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ne=class n{constructor(t,e,i,s,r,o,a,l,c,h,u,f,d,g,x,m){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c,h,u,f,d,g,x,m)}set(t,e,i,s,r,o,a,l,c,h,u,f,d,g,x,m){let p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,i=t.elements,s=1/cr.setFromMatrixColumn(t,0).length(),r=1/cr.setFromMatrixColumn(t,1).length(),o=1/cr.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let f=o*h,d=o*u,g=a*h,x=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=d+g*c,e[5]=f-x*c,e[9]=-a*l,e[2]=x-f*c,e[6]=g+d*c,e[10]=o*l}else if(t.order==="YXZ"){let f=l*h,d=l*u,g=c*h,x=c*u;e[0]=f+x*a,e[4]=g*a-d,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=d*a-g,e[6]=x+f*a,e[10]=o*l}else if(t.order==="ZXY"){let f=l*h,d=l*u,g=c*h,x=c*u;e[0]=f-x*a,e[4]=-o*u,e[8]=g+d*a,e[1]=d+g*a,e[5]=o*h,e[9]=x-f*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let f=o*h,d=o*u,g=a*h,x=a*u;e[0]=l*h,e[4]=g*c-d,e[8]=f*c+x,e[1]=l*u,e[5]=x*c+f,e[9]=d*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let f=o*l,d=o*c,g=a*l,x=a*c;e[0]=l*h,e[4]=x-f*u,e[8]=g*u+d,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*u+g,e[10]=f-x*u}else if(t.order==="XZY"){let f=o*l,d=o*c,g=a*l,x=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+x,e[5]=o*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=a*h,e[10]=x*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(r0,t,o0)}lookAt(t,e,i){let s=this.elements;return Qn.subVectors(t,e),Qn.lengthSq()===0&&(Qn.z=1),Qn.normalize(),ji.crossVectors(i,Qn),ji.lengthSq()===0&&(Math.abs(i.z)===1?Qn.x+=1e-4:Qn.z+=1e-4,Qn.normalize(),ji.crossVectors(i,Qn)),ji.normalize(),Ua.crossVectors(Qn,ji),s[0]=ji.x,s[4]=Ua.x,s[8]=Qn.x,s[1]=ji.y,s[5]=Ua.y,s[9]=Qn.y,s[2]=ji.z,s[6]=Ua.z,s[10]=Qn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],d=i[13],g=i[2],x=i[6],m=i[10],p=i[14],M=i[3],v=i[7],y=i[11],T=i[15],A=s[0],R=s[4],C=s[8],S=s[12],b=s[1],D=s[5],N=s[9],F=s[13],B=s[2],G=s[6],X=s[10],j=s[14],Z=s[3],J=s[7],ot=s[11],ft=s[15];return r[0]=o*A+a*b+l*B+c*Z,r[4]=o*R+a*D+l*G+c*J,r[8]=o*C+a*N+l*X+c*ot,r[12]=o*S+a*F+l*j+c*ft,r[1]=h*A+u*b+f*B+d*Z,r[5]=h*R+u*D+f*G+d*J,r[9]=h*C+u*N+f*X+d*ot,r[13]=h*S+u*F+f*j+d*ft,r[2]=g*A+x*b+m*B+p*Z,r[6]=g*R+x*D+m*G+p*J,r[10]=g*C+x*N+m*X+p*ot,r[14]=g*S+x*F+m*j+p*ft,r[3]=M*A+v*b+y*B+T*Z,r[7]=M*R+v*D+y*G+T*J,r[11]=M*C+v*N+y*X+T*ot,r[15]=M*S+v*F+y*j+T*ft,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],x=t[7],m=t[11],p=t[15];return g*(+r*l*u-s*c*u-r*a*f+i*c*f+s*a*d-i*l*d)+x*(+e*l*d-e*c*f+r*o*f-s*o*d+s*c*h-r*l*h)+m*(+e*c*u-e*a*d-r*o*u+i*o*d+r*a*h-i*c*h)+p*(-s*a*h-e*l*u+e*a*f+s*o*u-i*o*f+i*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],x=t[13],m=t[14],p=t[15],M=u*m*c-x*f*c+x*l*d-a*m*d-u*l*p+a*f*p,v=g*f*c-h*m*c-g*l*d+o*m*d+h*l*p-o*f*p,y=h*x*c-g*u*c+g*a*d-o*x*d-h*a*p+o*u*p,T=g*u*l-h*x*l-g*a*f+o*x*f+h*a*m-o*u*m,A=e*M+i*v+s*y+r*T;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/A;return t[0]=M*R,t[1]=(x*f*r-u*m*r-x*s*d+i*m*d+u*s*p-i*f*p)*R,t[2]=(a*m*r-x*l*r+x*s*c-i*m*c-a*s*p+i*l*p)*R,t[3]=(u*l*r-a*f*r-u*s*c+i*f*c+a*s*d-i*l*d)*R,t[4]=v*R,t[5]=(h*m*r-g*f*r+g*s*d-e*m*d-h*s*p+e*f*p)*R,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*p-e*l*p)*R,t[7]=(o*f*r-h*l*r+h*s*c-e*f*c-o*s*d+e*l*d)*R,t[8]=y*R,t[9]=(g*u*r-h*x*r-g*i*d+e*x*d+h*i*p-e*u*p)*R,t[10]=(o*x*r-g*a*r+g*i*c-e*x*c-o*i*p+e*a*p)*R,t[11]=(h*a*r-o*u*r-h*i*c+e*u*c+o*i*d-e*a*d)*R,t[12]=T*R,t[13]=(h*x*s-g*u*s+g*i*f-e*x*f-h*i*m+e*u*m)*R,t[14]=(g*a*s-o*x*s-g*i*l+e*x*l+o*i*m-e*a*m)*R,t[15]=(o*u*s-h*a*s+h*i*l-e*u*l-o*i*f+e*a*f)*R,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+i,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,f=r*c,d=r*h,g=r*u,x=o*h,m=o*u,p=a*u,M=l*c,v=l*h,y=l*u,T=i.x,A=i.y,R=i.z;return s[0]=(1-(x+p))*T,s[1]=(d+y)*T,s[2]=(g-v)*T,s[3]=0,s[4]=(d-y)*A,s[5]=(1-(f+p))*A,s[6]=(m+M)*A,s[7]=0,s[8]=(g+v)*R,s[9]=(m-M)*R,s[10]=(1-(f+x))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements,r=cr.set(s[0],s[1],s[2]).length(),o=cr.set(s[4],s[5],s[6]).length(),a=cr.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],xi.copy(this);let c=1/r,h=1/o,u=1/a;return xi.elements[0]*=c,xi.elements[1]*=c,xi.elements[2]*=c,xi.elements[4]*=h,xi.elements[5]*=h,xi.elements[6]*=h,xi.elements[8]*=u,xi.elements[9]*=u,xi.elements[10]*=u,e.setFromRotationMatrix(xi),i.x=r,i.y=o,i.z=a,this}makePerspective(t,e,i,s,r,o,a=yi,l=!1){let c=this.elements,h=2*r/(e-t),u=2*r/(i-s),f=(e+t)/(e-t),d=(i+s)/(i-s),g,x;if(l)g=r/(o-r),x=o*r/(o-r);else if(a===yi)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Mo)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=yi,l=!1){let c=this.elements,h=2/(e-t),u=2/(i-s),f=-(e+t)/(e-t),d=-(i+s)/(i-s),g,x;if(l)g=1/(o-r),x=o/(o-r);else if(a===yi)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===Mo)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}},cr=new O,xi=new ne,r0=new O(0,0,0),o0=new O(1,1,1),ji=new O,Ua=new O,Qn=new O,Qu=new ne,td=new Xn,ni=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Me(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Me(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Me(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Me(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Me(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Me(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Qu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Qu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return td.setFromEuler(this),this.setFromQuaternion(td,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ni.DEFAULT_ORDER="XYZ";var Eo=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},a0=0,ed=new O,hr=new Xn,ki=new ne,Fa=new O,lo=new O,l0=new O,c0=new Xn,nd=new O(1,0,0),id=new O(0,1,0),sd=new O(0,0,1),rd={type:"added"},h0={type:"removed"},ur={type:"childadded",child:null},ph={type:"childremoved",child:null},Ue=class n extends Wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:a0++}),this.uuid=hs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new O,e=new ni,i=new Xn,s=new O(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ne},normalMatrix:{value:new ve}}),this.matrix=new ne,this.matrixWorld=new ne,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Eo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return hr.setFromAxisAngle(t,e),this.quaternion.multiply(hr),this}rotateOnWorldAxis(t,e){return hr.setFromAxisAngle(t,e),this.quaternion.premultiply(hr),this}rotateX(t){return this.rotateOnAxis(nd,t)}rotateY(t){return this.rotateOnAxis(id,t)}rotateZ(t){return this.rotateOnAxis(sd,t)}translateOnAxis(t,e){return ed.copy(t).applyQuaternion(this.quaternion),this.position.add(ed.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(nd,t)}translateY(t){return this.translateOnAxis(id,t)}translateZ(t){return this.translateOnAxis(sd,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ki.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Fa.copy(t):Fa.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),lo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ki.lookAt(lo,Fa,this.up):ki.lookAt(Fa,lo,this.up),this.quaternion.setFromRotationMatrix(ki),s&&(ki.extractRotation(s.matrixWorld),hr.setFromRotationMatrix(ki),this.quaternion.premultiply(hr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(rd),ur.child=t,this.dispatchEvent(ur),ur.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(h0),ph.child=t,this.dispatchEvent(ph),ph.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ki.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ki.multiply(t.parent.matrixWorld)),t.applyMatrix4(ki),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(rd),ur.child=t,this.dispatchEvent(ur),ur.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lo,t,l0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lo,c0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),d=o(t.animations),g=o(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=s,i;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}};Ue.DEFAULT_UP=new O(0,1,0);Ue.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ue.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var vi=new O,Bi=new O,mh=new O,zi=new O,dr=new O,fr=new O,od=new O,gh=new O,xh=new O,vh=new O,yh=new De,_h=new De,Mh=new De,es=class n{constructor(t=new O,e=new O,i=new O){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),vi.subVectors(t,e),s.cross(vi);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){vi.subVectors(s,e),Bi.subVectors(i,e),mh.subVectors(t,e);let o=vi.dot(vi),a=vi.dot(Bi),l=vi.dot(mh),c=Bi.dot(Bi),h=Bi.dot(mh),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let f=1/u,d=(c*l-a*h)*f,g=(o*h-a*l)*f;return r.set(1-d-g,g,d)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,zi)===null?!1:zi.x>=0&&zi.y>=0&&zi.x+zi.y<=1}static getInterpolation(t,e,i,s,r,o,a,l){return this.getBarycoord(t,e,i,s,zi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,zi.x),l.addScaledVector(o,zi.y),l.addScaledVector(a,zi.z),l)}static getInterpolatedAttribute(t,e,i,s,r,o){return yh.setScalar(0),_h.setScalar(0),Mh.setScalar(0),yh.fromBufferAttribute(t,e),_h.fromBufferAttribute(t,i),Mh.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(yh,r.x),o.addScaledVector(_h,r.y),o.addScaledVector(Mh,r.z),o}static isFrontFacing(t,e,i,s){return vi.subVectors(i,e),Bi.subVectors(t,e),vi.cross(Bi).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return vi.subVectors(this.c,this.b),Bi.subVectors(this.a,this.b),vi.cross(Bi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,o,a;dr.subVectors(s,i),fr.subVectors(r,i),gh.subVectors(t,i);let l=dr.dot(gh),c=fr.dot(gh);if(l<=0&&c<=0)return e.copy(i);xh.subVectors(t,s);let h=dr.dot(xh),u=fr.dot(xh);if(h>=0&&u<=h)return e.copy(s);let f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(dr,o);vh.subVectors(t,r);let d=dr.dot(vh),g=fr.dot(vh);if(g>=0&&d<=g)return e.copy(r);let x=d*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(i).addScaledVector(fr,a);let m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return od.subVectors(r,s),a=(u-h)/(u-h+(d-g)),e.copy(s).addScaledVector(od,a);let p=1/(m+x+f);return o=x*p,a=f*p,e.copy(i).addScaledVector(dr,o).addScaledVector(fr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},of={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qi={h:0,s:0,l:0},Oa={h:0,s:0,l:0};function bh(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var It=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=dn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Re.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=Re.workingColorSpace){return this.r=t,this.g=e,this.b=i,Re.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=Re.workingColorSpace){if(t=ou(t,1),e=Me(e,0,1),i=Me(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=bh(o,r,t+1/3),this.g=bh(o,r,t),this.b=bh(o,r,t-1/3)}return Re.colorSpaceToWorking(this,s),this}setStyle(t,e=dn){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=dn){let i=of[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Hi(t.r),this.g=Hi(t.g),this.b=Hi(t.b),this}copyLinearToSRGB(t){return this.r=yr(t.r),this.g=yr(t.g),this.b=yr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=dn){return Re.workingToColorSpace(Rn.copy(this),t),Math.round(Me(Rn.r*255,0,255))*65536+Math.round(Me(Rn.g*255,0,255))*256+Math.round(Me(Rn.b*255,0,255))}getHexString(t=dn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Re.workingColorSpace){Re.workingToColorSpace(Rn.copy(this),e);let i=Rn.r,s=Rn.g,r=Rn.b,o=Math.max(i,s,r),a=Math.min(i,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Re.workingColorSpace){return Re.workingToColorSpace(Rn.copy(this),e),t.r=Rn.r,t.g=Rn.g,t.b=Rn.b,t}getStyle(t=dn){Re.workingToColorSpace(Rn.copy(this),t);let e=Rn.r,i=Rn.g,s=Rn.b;return t!==dn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Qi),this.setHSL(Qi.h+t,Qi.s+e,Qi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Qi),t.getHSL(Oa);let i=go(Qi.h,Oa.h,e),s=go(Qi.s,Oa.s,e),r=go(Qi.l,Oa.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Rn=new It;It.NAMES=of;var u0=0,Xi=class extends Wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:u0++}),this.uuid=hs(),this.name="",this.type="Material",this.blending=Gi,this.side=Vi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tl,this.blendDst=el,this.blendEquation=ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new It(0,0,0),this.blendAlpha=0,this.depthFunc=As,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Oh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ts,this.stencilZFail=Ts,this.stencilZPass=Ts,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Gi&&(i.blending=this.blending),this.side!==Vi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==tl&&(i.blendSrc=this.blendSrc),this.blendDst!==el&&(i.blendDst=this.blendDst),this.blendEquation!==ei&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==As&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Oh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ts&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ts&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ts&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},sn=class extends Xi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new It(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ni,this.combine=Jh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var hn=new O,ka=new mt,d0=0,Ce=class{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:d0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=kh,this.updateRanges=[],this.gpuType=di,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ka.fromBufferAttribute(this,e),ka.applyMatrix3(t),this.setXY(e,ka.x,ka.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)hn.fromBufferAttribute(this,e),hn.applyMatrix3(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)hn.fromBufferAttribute(this,e),hn.applyMatrix4(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)hn.fromBufferAttribute(this,e),hn.applyNormalMatrix(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)hn.fromBufferAttribute(this,e),hn.transformDirection(t),this.setXYZ(e,hn.x,hn.y,hn.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=vr(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Un(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=vr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Un(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=vr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Un(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=vr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Un(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=vr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Un(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Un(e,this.array),i=Un(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Un(e,this.array),i=Un(i,this.array),s=Un(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=Un(e,this.array),i=Un(i,this.array),s=Un(s,this.array),r=Un(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==kh&&(t.usage=this.usage),t}};var Cs=class extends Ce{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var To=class extends Ce{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var Kt=class extends Ce{constructor(t,e,i){super(new Float32Array(t),e,i)}},f0=0,hi=new ne,Sh=new Ue,pr=new O,ti=new _i,co=new _i,Sn=new O,Ee=class n extends Wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:f0++}),this.uuid=hs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(au(t)?To:Cs)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new ve().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return hi.makeRotationFromQuaternion(t),this.applyMatrix4(hi),this}rotateX(t){return hi.makeRotationX(t),this.applyMatrix4(hi),this}rotateY(t){return hi.makeRotationY(t),this.applyMatrix4(hi),this}rotateZ(t){return hi.makeRotationZ(t),this.applyMatrix4(hi),this}translate(t,e,i){return hi.makeTranslation(t,e,i),this.applyMatrix4(hi),this}scale(t,e,i){return hi.makeScale(t,e,i),this.applyMatrix4(hi),this}lookAt(t){return Sh.lookAt(t),Sh.updateMatrix(),this.applyMatrix4(Sh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(pr).negate(),this.translate(pr.x,pr.y,pr.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Kt(i,3))}else{let i=Math.min(t.length,e.count);for(let s=0;s<i;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _i);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];ti.setFromBufferAttribute(r),this.morphTargetsRelative?(Sn.addVectors(this.boundingBox.min,ti.min),this.boundingBox.expandByPoint(Sn),Sn.addVectors(this.boundingBox.max,ti.max),this.boundingBox.expandByPoint(Sn)):(this.boundingBox.expandByPoint(ti.min),this.boundingBox.expandByPoint(ti.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ci);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(t){let i=this.boundingSphere.center;if(ti.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];co.setFromBufferAttribute(a),this.morphTargetsRelative?(Sn.addVectors(ti.min,co.min),ti.expandByPoint(Sn),Sn.addVectors(ti.max,co.max),ti.expandByPoint(Sn)):(ti.expandByPoint(co.min),ti.expandByPoint(co.max))}ti.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)Sn.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Sn));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Sn.fromBufferAttribute(a,c),l&&(pr.fromBufferAttribute(t,c),Sn.add(pr)),s=Math.max(s,i.distanceToSquared(Sn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ce(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<i.count;C++)a[C]=new O,l[C]=new O;let c=new O,h=new O,u=new O,f=new mt,d=new mt,g=new mt,x=new O,m=new O;function p(C,S,b){c.fromBufferAttribute(i,C),h.fromBufferAttribute(i,S),u.fromBufferAttribute(i,b),f.fromBufferAttribute(r,C),d.fromBufferAttribute(r,S),g.fromBufferAttribute(r,b),h.sub(c),u.sub(c),d.sub(f),g.sub(f);let D=1/(d.x*g.y-g.x*d.y);isFinite(D)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(u,-d.y).multiplyScalar(D),m.copy(u).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(D),a[C].add(x),a[S].add(x),a[b].add(x),l[C].add(m),l[S].add(m),l[b].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let C=0,S=M.length;C<S;++C){let b=M[C],D=b.start,N=b.count;for(let F=D,B=D+N;F<B;F+=3)p(t.getX(F+0),t.getX(F+1),t.getX(F+2))}let v=new O,y=new O,T=new O,A=new O;function R(C){T.fromBufferAttribute(s,C),A.copy(T);let S=a[C];v.copy(S),v.sub(T.multiplyScalar(T.dot(S))).normalize(),y.crossVectors(A,S);let D=y.dot(l[C])<0?-1:1;o.setXYZW(C,v.x,v.y,v.z,D)}for(let C=0,S=M.length;C<S;++C){let b=M[C],D=b.start,N=b.count;for(let F=D,B=D+N;F<B;F+=3)R(t.getX(F+0)),R(t.getX(F+1)),R(t.getX(F+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ce(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);let s=new O,r=new O,o=new O,a=new O,l=new O,c=new O,h=new O,u=new O;if(t)for(let f=0,d=t.count;f<d;f+=3){let g=t.getX(f+0),x=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),a.add(h),l.add(h),c.add(h),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Sn.fromBufferAttribute(t,e),Sn.normalize(),t.setXYZ(e,Sn.x,Sn.y,Sn.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h),d=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?d=l[x]*a.data.stride+a.offset:d=l[x]*h;for(let p=0;p<h;p++)f[g++]=c[d++]}return new Ce(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,i);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let f=c[h],d=t(f,i);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){let d=c[u];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},ad=new ne,ws=new wo,Ba=new Ci,ld=new O,za=new O,Ha=new O,Va=new O,wh=new O,Ga=new O,cd=new O,Wa=new O,jt=class extends Ue{constructor(t=new Ee,e=new sn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Ga.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(wh.fromBufferAttribute(u,t),o?Ga.addScaledVector(wh,h):Ga.addScaledVector(wh.sub(e),h))}e.add(Ga)}return e}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ba.copy(i.boundingSphere),Ba.applyMatrix4(r),ws.copy(t.ray).recast(t.near),!(Ba.containsPoint(ws.origin)===!1&&(ws.intersectSphere(Ba,ld)===null||ws.origin.distanceToSquared(ld)>(t.far-t.near)**2))&&(ad.copy(r).invert(),ws.copy(t.ray).applyMatrix4(ad),!(i.boundingBox!==null&&ws.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,ws)))}_computeIntersections(t,e,i){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let m=f[g],p=o[m.materialIndex],M=Math.max(m.start,d.start),v=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let y=M,T=v;y<T;y+=3){let A=a.getX(y),R=a.getX(y+1),C=a.getX(y+2);s=Xa(this,p,t,i,c,h,u,A,R,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){let M=a.getX(m),v=a.getX(m+1),y=a.getX(m+2);s=Xa(this,o,t,i,c,h,u,M,v,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){let m=f[g],p=o[m.materialIndex],M=Math.max(m.start,d.start),v=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let y=M,T=v;y<T;y+=3){let A=y,R=y+1,C=y+2;s=Xa(this,p,t,i,c,h,u,A,R,C),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let m=g,p=x;m<p;m+=3){let M=m,v=m+1,y=m+2;s=Xa(this,o,t,i,c,h,u,M,v,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function p0(n,t,e,i,s,r,o,a){let l;if(t.side===pn?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,t.side===Vi,a),l===null)return null;Wa.copy(a),Wa.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(Wa);return c<e.near||c>e.far?null:{distance:c,point:Wa.clone(),object:n}}function Xa(n,t,e,i,s,r,o,a,l,c){n.getVertexPosition(a,za),n.getVertexPosition(l,Ha),n.getVertexPosition(c,Va);let h=p0(n,t,e,i,za,Ha,Va,cd);if(h){let u=new O;es.getBarycoord(cd,za,Ha,Va,u),s&&(h.uv=es.getInterpolatedAttribute(s,a,l,c,u,new mt)),r&&(h.uv1=es.getInterpolatedAttribute(r,a,l,c,u,new mt)),o&&(h.normal=es.getInterpolatedAttribute(o,a,l,c,u,new O),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new O,materialIndex:0};es.getNormal(za,Ha,Va,f.normal),h.face=f,h.barycoord=u}return h}var Fe=class n extends Ee{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],f=0,d=0;g("z","y","x",-1,-1,i,e,t,o,r,0),g("z","y","x",1,-1,i,e,-t,o,r,1),g("x","z","y",1,1,t,i,e,s,o,2),g("x","z","y",1,-1,t,i,-e,s,o,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Kt(c,3)),this.setAttribute("normal",new Kt(h,3)),this.setAttribute("uv",new Kt(u,2));function g(x,m,p,M,v,y,T,A,R,C,S){let b=y/R,D=T/C,N=y/2,F=T/2,B=A/2,G=R+1,X=C+1,j=0,Z=0,J=new O;for(let ot=0;ot<X;ot++){let ft=ot*D-F;for(let Lt=0;Lt<G;Lt++){let Ut=Lt*b-N;J[x]=Ut*M,J[m]=ft*v,J[p]=B,c.push(J.x,J.y,J.z),J[x]=0,J[m]=0,J[p]=A>0?1:-1,h.push(J.x,J.y,J.z),u.push(Lt/R),u.push(1-ot/C),j+=1}}for(let ot=0;ot<C;ot++)for(let ft=0;ft<R;ft++){let Lt=f+ft+G*ot,Ut=f+ft+G*(ot+1),zt=f+(ft+1)+G*(ot+1),Ft=f+(ft+1)+G*ot;l.push(Lt,Ut,Ft),l.push(Ut,zt,Ft),Z+=6}a.addGroup(d,Z,S),d+=Z,f+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Gs(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function In(n){let t={};for(let e=0;e<n.length;e++){let i=Gs(n[e]);for(let s in i)t[s]=i[s]}return t}function m0(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function lu(n){let t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Re.workingColorSpace}var zn={clone:Gs,merge:In},g0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,x0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,me=class extends Xi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=g0,this.fragmentShader=x0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Gs(t.uniforms),this.uniformsGroups=m0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}},Ao=class extends Ue{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ne,this.projectionMatrix=new ne,this.projectionMatrixInverse=new ne,this.coordinateSystem=yi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ts=new O,hd=new mt,ud=new mt,En=class extends Ao{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Mr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(mo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Mr*2*Math.atan(Math.tan(mo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ts.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ts.x,ts.y).multiplyScalar(-t/ts.z),ts.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ts.x,ts.y).multiplyScalar(-t/ts.z)}getViewSize(t,e){return this.getViewBounds(t,hd,ud),e.subVectors(ud,hd)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(mo*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},mr=-90,gr=1,al=class extends Ue{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new En(mr,gr,t,e);s.layers=this.layers,this.add(s);let r=new En(mr,gr,t,e);r.layers=this.layers,this.add(r);let o=new En(mr,gr,t,e);o.layers=this.layers,this.add(o);let a=new En(mr,gr,t,e);a.layers=this.layers,this.add(a);let l=new En(mr,gr,t,e);l.layers=this.layers,this.add(l);let c=new En(mr,gr,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===yi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Mo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,r),t.setRenderTarget(i,1,s),t.render(e,o),t.setRenderTarget(i,2,s),t.render(e,a),t.setRenderTarget(i,3,s),t.render(e,l),t.setRenderTarget(i,4,s),t.render(e,c),i.texture.generateMipmaps=x,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Ro=class extends On{constructor(t=[],e=Hs,i,s,r,o,a,l,c,h){super(t,e,i,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ll=class extends ln{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Ro(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Fe(5,5,5),r=new me({name:"CubemapFromEquirect",uniforms:Gs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:pn,blending:un});r.uniforms.tEquirect.value=e;let o=new jt(s,r),a=e.minFilter;return e.minFilter===ui&&(e.minFilter=Fn),new al(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}},Xe=class extends Ue{constructor(){super(),this.isGroup=!0,this.type="Group"}},v0={type:"move"},wr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let x of t.hand.values()){let m=e.getJointPose(x,i),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(v0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new Xe;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}};var Co=class n{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new It(t),this.near=e,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Er=class extends Ue{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ni,this.environmentIntensity=1,this.environmentRotation=new ni,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var dd=new O,fd=new De,pd=new De,y0=new O,md=new ne,qa=new O,Eh=new Ci,gd=new ne,Th=new wo,Po=class extends jt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Lh,this.bindMatrix=new ne,this.bindMatrixInverse=new ne,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let t=this.geometry;this.boundingBox===null&&(this.boundingBox=new _i),this.boundingBox.makeEmpty();let e=t.getAttribute("position");for(let i=0;i<e.count;i++)this.getVertexPosition(i,qa),this.boundingBox.expandByPoint(qa)}computeBoundingSphere(){let t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ci),this.boundingSphere.makeEmpty();let e=t.getAttribute("position");for(let i=0;i<e.count;i++)this.getVertexPosition(i,qa),this.boundingSphere.expandByPoint(qa)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){let i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Eh.copy(this.boundingSphere),Eh.applyMatrix4(s),t.ray.intersectsSphere(Eh)!==!1&&(gd.copy(s).invert(),Th.copy(t.ray).applyMatrix4(gd),!(this.boundingBox!==null&&Th.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Th)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let t=new De,e=this.geometry.attributes.skinWeight;for(let i=0,s=e.count;i<s;i++){t.fromBufferAttribute(e,i);let r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(i,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Lh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Xd?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){let i=this.skeleton,s=this.geometry;fd.fromBufferAttribute(s.attributes.skinIndex,t),pd.fromBufferAttribute(s.attributes.skinWeight,t),dd.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){let o=pd.getComponent(r);if(o!==0){let a=fd.getComponent(r);md.multiplyMatrices(i.bones[a].matrixWorld,i.boneInverses[a]),e.addScaledVector(y0.copy(dd).applyMatrix4(md),o)}}return e.applyMatrix4(this.bindMatrixInverse)}},Tr=class extends Ue{constructor(){super(),this.isBone=!0,this.type="Bone"}},kn=class extends On{constructor(t=null,e=1,i=1,s,r,o,a,l,c=fn,h=fn,u,f){super(null,o,a,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},xd=new ne,_0=new ne,Io=class n{constructor(t=[],e=[]){this.uuid=hs(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new ne)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){let i=new ne;this.bones[t]&&i.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){let i=this.bones[t];i&&i.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){let i=this.bones[t];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){let t=this.bones,e=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,o=t.length;r<o;r++){let a=t[r]?t[r].matrixWorld:_0;xd.multiplyMatrices(a,e[r]),xd.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new n(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4);e.set(this.boneMatrices);let i=new kn(e,t,t,mn,di);return i.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=i,this}getBoneByName(t){for(let e=0,i=this.bones.length;e<i;e++){let s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let i=0,s=t.bones.length;i<s;i++){let r=t.bones[i],o=e[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Tr),this.bones.push(o),this.boneInverses.push(new ne().fromArray(t.boneInverses[i]))}return this.init(),this}toJSON(){let t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let e=this.bones,i=this.boneInverses;for(let s=0,r=e.length;s<r;s++){let o=e[s];t.bones.push(o.uuid);let a=i[s];t.boneInverses.push(a.toArray())}return t}},is=class extends Ce{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},xr=new ne,vd=new ne,Ya=[],yd=new _i,M0=new ne,ho=new jt,uo=new Ci,rn=class extends jt{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new is(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,M0)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new _i),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,xr),yd.copy(t.boundingBox).applyMatrix4(xr),this.boundingBox.union(yd)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ci),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,xr),uo.copy(t.boundingSphere).applyMatrix4(xr),this.boundingSphere.union(uo)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let i=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=t*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(t,e){let i=this.matrixWorld,s=this.count;if(ho.geometry=this.geometry,ho.material=this.material,ho.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),uo.copy(this.boundingSphere),uo.applyMatrix4(i),t.ray.intersectsSphere(uo)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,xr),vd.multiplyMatrices(i,xr),ho.matrixWorld=vd,ho.raycast(t,Ya);for(let o=0,a=Ya.length;o<a;o++){let l=Ya[o];l.instanceId=r,l.object=this,e.push(l)}Ya.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new is(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let i=e.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new kn(new Float32Array(s*this.count),s,this.count,Or,di));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;r[l]=a,r.set(i,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ah=new O,b0=new O,S0=new ve,Ai=class{constructor(t=new O(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=Ah.subVectors(i,e).cross(b0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let i=t.delta(Ah),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(i,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||S0.getNormalMatrix(t),s=this.coplanarPoint(Ah).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Es=new Ci,w0=new mt(.5,.5),Za=new O,Ar=class{constructor(t=new Ai,e=new Ai,i=new Ai,s=new Ai,r=new Ai,o=new Ai){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=yi,i=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],d=r[7],g=r[8],x=r[9],m=r[10],p=r[11],M=r[12],v=r[13],y=r[14],T=r[15];if(s[0].setComponents(c-o,d-h,p-g,T-M).normalize(),s[1].setComponents(c+o,d+h,p+g,T+M).normalize(),s[2].setComponents(c+a,d+u,p+x,T+v).normalize(),s[3].setComponents(c-a,d-u,p-x,T-v).normalize(),i)s[4].setComponents(l,f,m,y).normalize(),s[5].setComponents(c-l,d-f,p-m,T-y).normalize();else if(s[4].setComponents(c-l,d-f,p-m,T-y).normalize(),e===yi)s[5].setComponents(c+l,d+f,p+m,T+y).normalize();else if(e===Mo)s[5].setComponents(l,f,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Es.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Es.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Es)}intersectsSprite(t){Es.center.set(0,0,0);let e=w0.distanceTo(t.center);return Es.radius=.7071067811865476+e,Es.applyMatrix4(t.matrixWorld),this.intersectsSphere(Es)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(Za.x=s.normal.x>0?t.max.x:t.min.x,Za.y=s.normal.y>0?t.max.y:t.min.y,Za.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Za)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Rr=class extends On{constructor(t,e,i,s,r,o,a,l,c){super(t,e,i,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ps=class extends On{constructor(t,e,i=as,s,r,o,a=fn,l=fn,c,h=_r,u=1){if(h!==_r&&h!==cs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:t,height:e,depth:u};super(f,s,r,o,a,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Sr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Do=class extends On{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Is=class n extends Ee{constructor(t=1,e=1,i=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:s,heightSegments:r},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=e/2,u=Math.PI/2*t,f=e,d=2*u+f,g=i*2+r,x=s+1,m=new O,p=new O;for(let M=0;M<=g;M++){let v=0,y=0,T=0,A=0;if(M<=i){let S=M/i,b=S*Math.PI/2;y=-h-t*Math.cos(b),T=t*Math.sin(b),A=-t*Math.cos(b),v=S*u}else if(M<=i+r){let S=(M-i)/r;y=-h+S*e,T=t,A=0,v=u+S*f}else{let S=(M-i-r)/i,b=S*Math.PI/2;y=h+t*Math.sin(b),T=t*Math.cos(b),A=t*Math.sin(b),v=u+f+S*u}let R=Math.max(0,Math.min(1,v/d)),C=0;M===0?C=.5/s:M===g&&(C=-.5/s);for(let S=0;S<=s;S++){let b=S/s,D=b*Math.PI*2,N=Math.sin(D),F=Math.cos(D);p.x=-T*F,p.y=y,p.z=T*N,a.push(p.x,p.y,p.z),m.set(-T*F,A,T*N),m.normalize(),l.push(m.x,m.y,m.z),c.push(b+C,R)}if(M>0){let S=(M-1)*x;for(let b=0;b<s;b++){let D=S+b,N=S+b+1,F=M*x+b,B=M*x+b+1;o.push(D,N,F),o.push(N,B,F)}}}this.setIndex(o),this.setAttribute("position",new Kt(a,3)),this.setAttribute("normal",new Kt(l,3)),this.setAttribute("uv",new Kt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}};var Pn=class n extends Ee{constructor(t=1,e=1,i=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],d=[],g=0,x=[],m=i/2,p=0;M(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Kt(u,3)),this.setAttribute("normal",new Kt(f,3)),this.setAttribute("uv",new Kt(d,2));function M(){let y=new O,T=new O,A=0,R=(e-t)/i;for(let C=0;C<=r;C++){let S=[],b=C/r,D=b*(e-t)+t;for(let N=0;N<=s;N++){let F=N/s,B=F*l+a,G=Math.sin(B),X=Math.cos(B);T.x=D*G,T.y=-b*i+m,T.z=D*X,u.push(T.x,T.y,T.z),y.set(G,R,X).normalize(),f.push(y.x,y.y,y.z),d.push(F,1-b),S.push(g++)}x.push(S)}for(let C=0;C<s;C++)for(let S=0;S<r;S++){let b=x[S][C],D=x[S+1][C],N=x[S+1][C+1],F=x[S][C+1];(t>0||S!==0)&&(h.push(b,D,F),A+=3),(e>0||S!==r-1)&&(h.push(D,N,F),A+=3)}c.addGroup(p,A,0),p+=A}function v(y){let T=g,A=new mt,R=new O,C=0,S=y===!0?t:e,b=y===!0?1:-1;for(let N=1;N<=s;N++)u.push(0,m*b,0),f.push(0,b,0),d.push(.5,.5),g++;let D=g;for(let N=0;N<=s;N++){let B=N/s*l+a,G=Math.cos(B),X=Math.sin(B);R.x=S*X,R.y=m*b,R.z=S*G,u.push(R.x,R.y,R.z),f.push(0,b,0),A.x=G*.5+.5,A.y=X*.5*b+.5,d.push(A.x,A.y),g++}for(let N=0;N<s;N++){let F=T+N,B=D+N;y===!0?h.push(B,B+1,F):h.push(B+1,B,F),C+=3}c.addGroup(p,C,y===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},qi=class n extends Pn{constructor(t=1,e=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,i,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new n(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Cr=class n extends Ee{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};let r=[],o=[];a(s),c(i),h(),this.setAttribute("position",new Kt(r,3)),this.setAttribute("normal",new Kt(r.slice(),3)),this.setAttribute("uv",new Kt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let v=new O,y=new O,T=new O;for(let A=0;A<e.length;A+=3)d(e[A+0],v),d(e[A+1],y),d(e[A+2],T),l(v,y,T,M)}function l(M,v,y,T){let A=T+1,R=[];for(let C=0;C<=A;C++){R[C]=[];let S=M.clone().lerp(y,C/A),b=v.clone().lerp(y,C/A),D=A-C;for(let N=0;N<=D;N++)N===0&&C===A?R[C][N]=S:R[C][N]=S.clone().lerp(b,N/D)}for(let C=0;C<A;C++)for(let S=0;S<2*(A-C)-1;S++){let b=Math.floor(S/2);S%2===0?(f(R[C][b+1]),f(R[C+1][b]),f(R[C][b])):(f(R[C][b+1]),f(R[C+1][b+1]),f(R[C+1][b]))}}function c(M){let v=new O;for(let y=0;y<r.length;y+=3)v.x=r[y+0],v.y=r[y+1],v.z=r[y+2],v.normalize().multiplyScalar(M),r[y+0]=v.x,r[y+1]=v.y,r[y+2]=v.z}function h(){let M=new O;for(let v=0;v<r.length;v+=3){M.x=r[v+0],M.y=r[v+1],M.z=r[v+2];let y=m(M)/2/Math.PI+.5,T=p(M)/Math.PI+.5;o.push(y,1-T)}g(),u()}function u(){for(let M=0;M<o.length;M+=6){let v=o[M+0],y=o[M+2],T=o[M+4],A=Math.max(v,y,T),R=Math.min(v,y,T);A>.9&&R<.1&&(v<.2&&(o[M+0]+=1),y<.2&&(o[M+2]+=1),T<.2&&(o[M+4]+=1))}}function f(M){r.push(M.x,M.y,M.z)}function d(M,v){let y=M*3;v.x=t[y+0],v.y=t[y+1],v.z=t[y+2]}function g(){let M=new O,v=new O,y=new O,T=new O,A=new mt,R=new mt,C=new mt;for(let S=0,b=0;S<r.length;S+=9,b+=6){M.set(r[S+0],r[S+1],r[S+2]),v.set(r[S+3],r[S+4],r[S+5]),y.set(r[S+6],r[S+7],r[S+8]),A.set(o[b+0],o[b+1]),R.set(o[b+2],o[b+3]),C.set(o[b+4],o[b+5]),T.copy(M).add(v).add(y).divideScalar(3);let D=m(T);x(A,b+0,M,D),x(R,b+2,v,D),x(C,b+4,y,D)}}function x(M,v,y,T){T<0&&M.x===1&&(o[v]=M.x-1),y.x===0&&y.z===0&&(o[v]=T/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.vertices,t.indices,t.radius,t.details)}},Lo=class n extends Cr{constructor(t=1,e=0){let i=(1+Math.sqrt(5))/2,s=1/i,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new n(t.radius,t.detail)}};var ii=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){let i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){let e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],i,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)i=this.getPoint(o/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let i=this.getLengths(),s=0,r=i.length,o;e?o=e:o=t*i[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=i[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===o)return s/(r-1);let h=i[s],f=i[s+1]-h,d=(o-h)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new mt:new O);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){let i=new O,s=[],r=[],o=[],a=new O,l=new ne;for(let d=0;d<=t;d++){let g=d/t;s[d]=this.getTangentAt(g,new O)}r[0]=new O,o[0]=new O;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),f<=c&&i.set(0,0,1),a.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(Me(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(a,g))}o[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Me(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],d*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Pr=class extends ii{constructor(t=0,e=0,i=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new mt){let i=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},cl=class extends Pr{constructor(t,e,i,s,r,o){super(t,e,i,i,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function cu(){let n=0,t=0,e=0,i=0;function s(r,o,a,l){n=r,t=a,e=-3*r+3*o-2*a-l,i=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let f=(o-r)/c-(a-r)/(c+h)+(a-o)/h,d=(a-o)/h-(l-o)/(h+u)+(l-a)/u;f*=h,d*=h,s(o,a,f,d)},calc:function(r){let o=r*r,a=o*r;return n+t*r+e*o+i*a}}}var Ja=new O,Rh=new cu,Ch=new cu,Ph=new cu,Ds=class extends ii{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new O){let i=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Ja.subVectors(s[0],s[1]).add(s[0]),c=Ja);let u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Ja.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ja),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(u),d),x=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),Rh.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,x,m),Ch.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,x,m),Ph.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(Rh.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Ch.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),Ph.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return i.set(Rh.calc(l),Ch.calc(l),Ph.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(new O().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function _d(n,t,e,i,s){let r=(i-t)*.5,o=(s-e)*.5,a=n*n,l=n*a;return(2*e-2*i+r+o)*l+(-3*e+3*i-2*r-o)*a+r*n+e}function E0(n,t){let e=1-n;return e*e*t}function T0(n,t){return 2*(1-n)*n*t}function A0(n,t){return n*n*t}function xo(n,t,e,i){return E0(n,t)+T0(n,e)+A0(n,i)}function R0(n,t){let e=1-n;return e*e*e*t}function C0(n,t){let e=1-n;return 3*e*e*n*t}function P0(n,t){return 3*(1-n)*n*n*t}function I0(n,t){return n*n*n*t}function vo(n,t,e,i,s){return R0(n,t)+C0(n,e)+P0(n,i)+I0(n,s)}var No=class extends ii{constructor(t=new mt,e=new mt,i=new mt,s=new mt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new mt){let i=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(vo(t,s.x,r.x,o.x,a.x),vo(t,s.y,r.y,o.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},hl=class extends ii{constructor(t=new O,e=new O,i=new O,s=new O){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new O){let i=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return i.set(vo(t,s.x,r.x,o.x,a.x),vo(t,s.y,r.y,o.y,a.y),vo(t,s.z,r.z,o.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Uo=class extends ii{constructor(t=new mt,e=new mt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new mt){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new mt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ul=class extends ii{constructor(t=new O,e=new O){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new O){let i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new O){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Fo=class extends ii{constructor(t=new mt,e=new mt,i=new mt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new mt){let i=e,s=this.v0,r=this.v1,o=this.v2;return i.set(xo(t,s.x,r.x,o.x),xo(t,s.y,r.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Oo=class extends ii{constructor(t=new O,e=new O,i=new O){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new O){let i=e,s=this.v0,r=this.v1,o=this.v2;return i.set(xo(t,s.x,r.x,o.x),xo(t,s.y,r.y,o.y),xo(t,s.z,r.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ko=class extends ii{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new mt){let i=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return i.set(_d(a,l.x,c.x,h.x,u.x),_d(a,l.y,c.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){let s=t.points[e];this.points.push(new mt().fromArray(s))}return this}},dl=Object.freeze({__proto__:null,ArcCurve:cl,CatmullRomCurve3:Ds,CubicBezierCurve:No,CubicBezierCurve3:hl,EllipseCurve:Pr,LineCurve:Uo,LineCurve3:ul,QuadraticBezierCurve:Fo,QuadraticBezierCurve3:Oo,SplineCurve:ko}),fl=class extends ii{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new dl[i](e,t))}return this}getPoint(t,e){let i=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=i){let o=s[r]-i,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],i;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){let s=t.curves[e];this.curves.push(new dl[s.type]().fromJSON(s))}return this}},Ls=class extends fl{constructor(t){super(),this.type="Path",this.currentPoint=new mt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let i=new Uo(this.currentPoint.clone(),new mt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){let r=new Fo(this.currentPoint.clone(),new mt(t,e),new mt(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,r,o){let a=new No(this.currentPoint.clone(),new mt(t,e),new mt(i,s),new mt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),i=new ko(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,i,s,r,o),this}absarc(t,e,i,s,r,o){return this.absellipse(t,e,i,i,s,r,o),this}ellipse(t,e,i,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,s,r,o,a,l),this}absellipse(t,e,i,s,r,o,a,l){let c=new Pr(t,e,i,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},ss=class extends Ls{constructor(t){super(t),this.uuid=hs(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){let s=t.holes[e];this.holes.push(new Ls().fromJSON(s))}return this}};function D0(n,t,e=2){let i=t&&t.length,s=i?t[0]*e:n.length,r=af(n,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(i&&(r=O0(n,t,r,e)),n.length>80*e){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let f=e;f<s;f+=e){let d=n[f],g=n[f+1];d<a&&(a=d),g<l&&(l=g),d>h&&(h=d),g>u&&(u=g)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return Bo(r,o,e,a,l,c,0),o}function af(n,t,e,i,s){let r;if(s===Z0(n,t,e,i)>0)for(let o=t;o<e;o+=i)r=Md(o/i|0,n[o],n[o+1],r);else for(let o=e-i;o>=t;o-=i)r=Md(o/i|0,n[o],n[o+1],r);return r&&Ir(r,r.next)&&(Ho(r),r=r.next),r}function Ns(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Ir(e,e.next)||en(e.prev,e,e.next)===0)){if(Ho(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Bo(n,t,e,i,s,r,o){if(!n)return;!o&&r&&V0(n,i,s,r);let a=n;for(;n.prev!==n.next;){let l=n.prev,c=n.next;if(r?N0(n,i,s,r):L0(n)){t.push(l.i,n.i,c.i),Ho(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=U0(Ns(n),t),Bo(n,t,e,i,s,r,2)):o===2&&F0(n,t,e,i,s,r):Bo(Ns(n),t,e,i,s,r,1);break}}}function L0(n){let t=n.prev,e=n,i=n.next;if(en(t,e,i)>=0)return!1;let s=t.x,r=e.x,o=i.x,a=t.y,l=e.y,c=i.y,h=Math.min(s,r,o),u=Math.min(a,l,c),f=Math.max(s,r,o),d=Math.max(a,l,c),g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&po(s,a,r,l,o,c,g.x,g.y)&&en(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function N0(n,t,e,i){let s=n.prev,r=n,o=n.next;if(en(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,f=o.y,d=Math.min(a,l,c),g=Math.min(h,u,f),x=Math.max(a,l,c),m=Math.max(h,u,f),p=Bh(d,g,t,e,i),M=Bh(x,m,t,e,i),v=n.prevZ,y=n.nextZ;for(;v&&v.z>=p&&y&&y.z<=M;){if(v.x>=d&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&po(a,h,l,u,c,f,v.x,v.y)&&en(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=d&&y.x<=x&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&po(a,h,l,u,c,f,y.x,y.y)&&en(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=p;){if(v.x>=d&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&po(a,h,l,u,c,f,v.x,v.y)&&en(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=M;){if(y.x>=d&&y.x<=x&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&po(a,h,l,u,c,f,y.x,y.y)&&en(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function U0(n,t){let e=n;do{let i=e.prev,s=e.next.next;!Ir(i,s)&&cf(i,e,e.next,s)&&zo(i,s)&&zo(s,i)&&(t.push(i.i,e.i,s.i),Ho(e),Ho(e.next),e=n=s),e=e.next}while(e!==n);return Ns(e)}function F0(n,t,e,i,s,r){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&X0(o,a)){let l=hf(o,a);o=Ns(o,o.next),l=Ns(l,l.next),Bo(o,t,e,i,s,r,0),Bo(l,t,e,i,s,r,0);return}a=a.next}o=o.next}while(o!==n)}function O0(n,t,e,i){let s=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*i,l=r<o-1?t[r+1]*i:n.length,c=af(n,a,l,i,!1);c===c.next&&(c.steiner=!0),s.push(W0(c))}s.sort(k0);for(let r=0;r<s.length;r++)e=B0(s[r],e);return e}function k0(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){let i=(n.next.y-n.y)/(n.next.x-n.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=i-s}return e}function B0(n,t){let e=z0(n,t);if(!e)return t;let i=hf(e,n);return Ns(i,i.next),Ns(e,e.next)}function z0(n,t){let e=t,i=n.x,s=n.y,r=-1/0,o;if(Ir(n,e))return e;do{if(Ir(n,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=i&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===i))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;e=o;do{if(i>=e.x&&e.x>=l&&i!==e.x&&lf(s<c?i:r,s,l,c,s<c?r:i,s,e.x,e.y)){let u=Math.abs(s-e.y)/(i-e.x);zo(e,n)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&H0(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function H0(n,t){return en(n.prev,n,t.prev)<0&&en(t.next,n,n.next)<0}function V0(n,t,e,i){let s=n;do s.z===0&&(s.z=Bh(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,G0(s)}function G0(n){let t,e=1;do{let i=n,s;n=null;let r=null;for(t=0;i;){t++;let o=i,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||i.z<=o.z)?(s=i,i=i.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=o}r.nextZ=null,e*=2}while(t>1);return n}function Bh(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function W0(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function lf(n,t,e,i,s,r,o,a){return(s-o)*(t-a)>=(n-o)*(r-a)&&(n-o)*(i-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(i-a)}function po(n,t,e,i,s,r,o,a){return!(n===o&&t===a)&&lf(n,t,e,i,s,r,o,a)}function X0(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!q0(n,t)&&(zo(n,t)&&zo(t,n)&&Y0(n,t)&&(en(n.prev,n,t.prev)||en(n,t.prev,t))||Ir(n,t)&&en(n.prev,n,n.next)>0&&en(t.prev,t,t.next)>0)}function en(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Ir(n,t){return n.x===t.x&&n.y===t.y}function cf(n,t,e,i){let s=Ka(en(n,t,e)),r=Ka(en(n,t,i)),o=Ka(en(e,i,n)),a=Ka(en(e,i,t));return!!(s!==r&&o!==a||s===0&&$a(n,e,t)||r===0&&$a(n,i,t)||o===0&&$a(e,n,i)||a===0&&$a(e,t,i))}function $a(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Ka(n){return n>0?1:n<0?-1:0}function q0(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&cf(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function zo(n,t){return en(n.prev,n,n.next)<0?en(n,t,n.next)>=0&&en(n,n.prev,t)>=0:en(n,t,n.prev)<0||en(n,n.next,t)<0}function Y0(n,t){let e=n,i=!1,s=(n.x+t.x)/2,r=(n.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function hf(n,t){let e=zh(n.i,n.x,n.y),i=zh(t.i,t.x,t.y),s=n.next,r=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,r.next=i,i.prev=r,i}function Md(n,t,e,i){let s=zh(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Ho(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function zh(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Z0(n,t,e,i){let s=0;for(let r=t,o=e-i;r<e;r+=i)s+=(n[o]-n[r])*(n[r+1]+n[o+1]),o=r;return s}var Hh=class{static triangulate(t,e,i=2){return D0(t,e,i)}},Ri=class n{static area(t){let e=t.length,i=0;for(let s=e-1,r=0;r<e;s=r++)i+=t[s].x*t[r].y-t[r].x*t[s].y;return i*.5}static isClockWise(t){return n.area(t)<0}static triangulateShape(t,e){let i=[],s=[],r=[];bd(t),Sd(i,t);let o=t.length;e.forEach(bd);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,Sd(i,e[l]);let a=Hh.triangulate(i,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function bd(n){let t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Sd(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}var Vo=class n extends Ee{constructor(t=new ss([new mt(.5,.5),new mt(-.5,.5),new mt(-.5,-.5),new mt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let i=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){let c=t[a];o(c)}this.setAttribute("position",new Kt(s,3)),this.setAttribute("uv",new Kt(r,2)),this.computeVertexNormals();function o(a){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:J0,v,y=!1,T,A,R,C;p&&(v=p.getSpacedPoints(h),y=!0,f=!1,T=p.computeFrenetFrames(h,!1),A=new O,R=new O,C=new O),f||(m=0,d=0,g=0,x=0);let S=a.extractPoints(c),b=S.shape,D=S.holes;if(!Ri.isClockWise(b)){b=b.reverse();for(let H=0,Y=D.length;H<Y;H++){let W=D[H];Ri.isClockWise(W)&&(D[H]=W.reverse())}}function F(H){let W=10000000000000001e-36,tt=H[0];for(let et=1;et<=H.length;et++){let it=et%H.length,at=H[it],nt=at.x-tt.x,rt=at.y-tt.y,P=nt*nt+rt*rt,w=Math.max(Math.abs(at.x),Math.abs(at.y),Math.abs(tt.x),Math.abs(tt.y)),U=W*w*w;if(P<=U){H.splice(it,1),et--;continue}tt=at}}F(b),D.forEach(F);let B=D.length,G=b;for(let H=0;H<B;H++){let Y=D[H];b=b.concat(Y)}function X(H,Y,W){return Y||console.error("THREE.ExtrudeGeometry: vec does not exist"),H.clone().addScaledVector(Y,W)}let j=b.length;function Z(H,Y,W){let tt,et,it,at=H.x-Y.x,nt=H.y-Y.y,rt=W.x-H.x,P=W.y-H.y,w=at*at+nt*nt,U=at*P-nt*rt;if(Math.abs(U)>Number.EPSILON){let q=Math.sqrt(w),k=Math.sqrt(rt*rt+P*P),z=Y.x-nt/q,xt=Y.y+at/q,vt=W.x-P/k,yt=W.y+rt/k,gt=((vt-z)*P-(yt-xt)*rt)/(at*P-nt*rt);tt=z+at*gt-H.x,et=xt+nt*gt-H.y;let Mt=tt*tt+et*et;if(Mt<=2)return new mt(tt,et);it=Math.sqrt(Mt/2)}else{let q=!1;at>Number.EPSILON?rt>Number.EPSILON&&(q=!0):at<-Number.EPSILON?rt<-Number.EPSILON&&(q=!0):Math.sign(nt)===Math.sign(P)&&(q=!0),q?(tt=-nt,et=at,it=Math.sqrt(w)):(tt=at,et=nt,it=Math.sqrt(w/2))}return new mt(tt/it,et/it)}let J=[];for(let H=0,Y=G.length,W=Y-1,tt=H+1;H<Y;H++,W++,tt++)W===Y&&(W=0),tt===Y&&(tt=0),J[H]=Z(G[H],G[W],G[tt]);let ot=[],ft,Lt=J.concat();for(let H=0,Y=B;H<Y;H++){let W=D[H];ft=[];for(let tt=0,et=W.length,it=et-1,at=tt+1;tt<et;tt++,it++,at++)it===et&&(it=0),at===et&&(at=0),ft[tt]=Z(W[tt],W[it],W[at]);ot.push(ft),Lt=Lt.concat(ft)}let Ut;if(m===0)Ut=Ri.triangulateShape(G,D);else{let H=[],Y=[];for(let W=0;W<m;W++){let tt=W/m,et=d*Math.cos(tt*Math.PI/2),it=g*Math.sin(tt*Math.PI/2)+x;for(let at=0,nt=G.length;at<nt;at++){let rt=X(G[at],J[at],it);_t(rt.x,rt.y,-et),tt===0&&H.push(rt)}for(let at=0,nt=B;at<nt;at++){let rt=D[at];ft=ot[at];let P=[];for(let w=0,U=rt.length;w<U;w++){let q=X(rt[w],ft[w],it);_t(q.x,q.y,-et),tt===0&&P.push(q)}tt===0&&Y.push(P)}}Ut=Ri.triangulateShape(H,Y)}let zt=Ut.length,Ft=g+x;for(let H=0;H<j;H++){let Y=f?X(b[H],Lt[H],Ft):b[H];y?(R.copy(T.normals[0]).multiplyScalar(Y.x),A.copy(T.binormals[0]).multiplyScalar(Y.y),C.copy(v[0]).add(R).add(A),_t(C.x,C.y,C.z)):_t(Y.x,Y.y,0)}for(let H=1;H<=h;H++)for(let Y=0;Y<j;Y++){let W=f?X(b[Y],Lt[Y],Ft):b[Y];y?(R.copy(T.normals[H]).multiplyScalar(W.x),A.copy(T.binormals[H]).multiplyScalar(W.y),C.copy(v[H]).add(R).add(A),_t(C.x,C.y,C.z)):_t(W.x,W.y,u/h*H)}for(let H=m-1;H>=0;H--){let Y=H/m,W=d*Math.cos(Y*Math.PI/2),tt=g*Math.sin(Y*Math.PI/2)+x;for(let et=0,it=G.length;et<it;et++){let at=X(G[et],J[et],tt);_t(at.x,at.y,u+W)}for(let et=0,it=D.length;et<it;et++){let at=D[et];ft=ot[et];for(let nt=0,rt=at.length;nt<rt;nt++){let P=X(at[nt],ft[nt],tt);y?_t(P.x,P.y+v[h-1].y,v[h-1].x+W):_t(P.x,P.y,u+W)}}}Q(),ht();function Q(){let H=s.length/3;if(f){let Y=0,W=j*Y;for(let tt=0;tt<zt;tt++){let et=Ut[tt];At(et[2]+W,et[1]+W,et[0]+W)}Y=h+m*2,W=j*Y;for(let tt=0;tt<zt;tt++){let et=Ut[tt];At(et[0]+W,et[1]+W,et[2]+W)}}else{for(let Y=0;Y<zt;Y++){let W=Ut[Y];At(W[2],W[1],W[0])}for(let Y=0;Y<zt;Y++){let W=Ut[Y];At(W[0]+j*h,W[1]+j*h,W[2]+j*h)}}i.addGroup(H,s.length/3-H,0)}function ht(){let H=s.length/3,Y=0;wt(G,Y),Y+=G.length;for(let W=0,tt=D.length;W<tt;W++){let et=D[W];wt(et,Y),Y+=et.length}i.addGroup(H,s.length/3-H,1)}function wt(H,Y){let W=H.length;for(;--W>=0;){let tt=W,et=W-1;et<0&&(et=H.length-1);for(let it=0,at=h+m*2;it<at;it++){let nt=j*it,rt=j*(it+1),P=Y+tt+nt,w=Y+et+nt,U=Y+et+rt,q=Y+tt+rt;se(P,w,U,q)}}}function _t(H,Y,W){l.push(H),l.push(Y),l.push(W)}function At(H,Y,W){_e(H),_e(Y),_e(W);let tt=s.length/3,et=M.generateTopUV(i,s,tt-3,tt-2,tt-1);I(et[0]),I(et[1]),I(et[2])}function se(H,Y,W,tt){_e(H),_e(Y),_e(tt),_e(Y),_e(W),_e(tt);let et=s.length/3,it=M.generateSideWallUV(i,s,et-6,et-3,et-2,et-1);I(it[0]),I(it[1]),I(it[3]),I(it[1]),I(it[2]),I(it[3])}function _e(H){s.push(l[H*3+0]),s.push(l[H*3+1]),s.push(l[H*3+2])}function I(H){r.push(H.x),r.push(H.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return $0(e,i,t)}static fromJSON(t,e){let i=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];i.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new dl[s.type]().fromJSON(s)),new n(i,t.options)}},J0={generateTopUV:function(n,t,e,i,s){let r=t[e*3],o=t[e*3+1],a=t[i*3],l=t[i*3+1],c=t[s*3],h=t[s*3+1];return[new mt(r,o),new mt(a,l),new mt(c,h)]},generateSideWallUV:function(n,t,e,i,s,r){let o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[i*3],h=t[i*3+1],u=t[i*3+2],f=t[s*3],d=t[s*3+1],g=t[s*3+2],x=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new mt(o,1-l),new mt(c,1-u),new mt(f,1-g),new mt(x,1-p)]:[new mt(a,1-l),new mt(h,1-u),new mt(d,1-g),new mt(m,1-p)]}};function $0(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){let r=n[i];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Mi=class n extends Cr{constructor(t=1,e=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new n(t.radius,t.detail)}},Go=class n extends Ee{constructor(t=[new mt(0,-.5),new mt(.5,0),new mt(0,.5)],e=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:s},e=Math.floor(e),s=Me(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/e,u=new O,f=new mt,d=new O,g=new O,x=new O,m=0,p=0;for(let M=0;M<=t.length-1;M++)switch(M){case 0:m=t[M+1].x-t[M].x,p=t[M+1].y-t[M].y,d.x=p*1,d.y=-m,d.z=p*0,x.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:l.push(x.x,x.y,x.z);break;default:m=t[M+1].x-t[M].x,p=t[M+1].y-t[M].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=x.x,d.y+=x.y,d.z+=x.z,d.normalize(),l.push(d.x,d.y,d.z),x.copy(g)}for(let M=0;M<=e;M++){let v=i+M*h*s,y=Math.sin(v),T=Math.cos(v);for(let A=0;A<=t.length-1;A++){u.x=t[A].x*y,u.y=t[A].y,u.z=t[A].x*T,o.push(u.x,u.y,u.z),f.x=M/e,f.y=A/(t.length-1),a.push(f.x,f.y);let R=l[3*A+0]*y,C=l[3*A+1],S=l[3*A+0]*T;c.push(R,C,S)}}for(let M=0;M<e;M++)for(let v=0;v<t.length-1;v++){let y=v+M*t.length,T=y,A=y+t.length,R=y+t.length+1,C=y+1;r.push(T,A,C),r.push(R,C,A)}this.setIndex(r),this.setAttribute("position",new Kt(o,3)),this.setAttribute("uv",new Kt(a,2)),this.setAttribute("normal",new Kt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.points,t.segments,t.phiStart,t.phiLength)}},Yi=class n extends Cr{constructor(t=1,e=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new n(t.radius,t.detail)}},cn=class n extends Ee{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(i),l=Math.floor(s),c=a+1,h=l+1,u=t/a,f=e/l,d=[],g=[],x=[],m=[];for(let p=0;p<h;p++){let M=p*f-o;for(let v=0;v<c;v++){let y=v*u-r;g.push(y,-M,0),x.push(0,0,1),m.push(v/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<a;M++){let v=M+c*p,y=M+c*(p+1),T=M+1+c*(p+1),A=M+1+c*p;d.push(v,y,A),d.push(y,T,A)}this.setIndex(d),this.setAttribute("position",new Kt(g,3)),this.setAttribute("normal",new Kt(x,3)),this.setAttribute("uv",new Kt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}},Us=class n extends Ee{constructor(t=.5,e=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);let a=[],l=[],c=[],h=[],u=t,f=(e-t)/s,d=new O,g=new mt;for(let x=0;x<=s;x++){for(let m=0;m<=i;m++){let p=r+m/i*o;d.x=u*Math.cos(p),d.y=u*Math.sin(p),l.push(d.x,d.y,d.z),c.push(0,0,1),g.x=(d.x/e+1)/2,g.y=(d.y/e+1)/2,h.push(g.x,g.y)}u+=f}for(let x=0;x<s;x++){let m=x*(i+1);for(let p=0;p<i;p++){let M=p+m,v=M,y=M+i+1,T=M+i+2,A=M+1;a.push(v,y,A),a.push(y,T,A)}}this.setIndex(a),this.setAttribute("position",new Kt(l,3)),this.setAttribute("normal",new Kt(c,3)),this.setAttribute("uv",new Kt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Wo=class n extends Ee{constructor(t=new ss([new mt(0,.5),new mt(-.5,-.5),new mt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let i=[],s=[],r=[],o=[],a=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(i),this.setAttribute("position",new Kt(s,3)),this.setAttribute("normal",new Kt(r,3)),this.setAttribute("uv",new Kt(o,2));function c(h){let u=s.length/3,f=h.extractPoints(e),d=f.shape,g=f.holes;Ri.isClockWise(d)===!1&&(d=d.reverse());for(let m=0,p=g.length;m<p;m++){let M=g[m];Ri.isClockWise(M)===!0&&(g[m]=M.reverse())}let x=Ri.triangulateShape(d,g);for(let m=0,p=g.length;m<p;m++){let M=g[m];d=d.concat(M)}for(let m=0,p=d.length;m<p;m++){let M=d[m];s.push(M.x,M.y,0),r.push(0,0,1),o.push(M.x,M.y)}for(let m=0,p=x.length;m<p;m++){let M=x[m],v=M[0]+u,y=M[1]+u,T=M[2]+u;i.push(v,y,T),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return K0(e,t)}static fromJSON(t,e){let i=[];for(let s=0,r=t.shapes.length;s<r;s++){let o=e[t.shapes[s]];i.push(o)}return new n(i,t.curveSegments)}};function K0(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){let s=n[e];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t}var qn=class n extends Ee{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new O,f=new O,d=[],g=[],x=[],m=[];for(let p=0;p<=i;p++){let M=[],v=p/i,y=0;p===0&&o===0?y=.5/e:p===i&&l===Math.PI&&(y=-.5/e);for(let T=0;T<=e;T++){let A=T/e;u.x=-t*Math.cos(s+A*r)*Math.sin(o+v*a),u.y=t*Math.cos(o+v*a),u.z=t*Math.sin(s+A*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),m.push(A+y,1-v),M.push(c++)}h.push(M)}for(let p=0;p<i;p++)for(let M=0;M<e;M++){let v=h[p][M+1],y=h[p][M],T=h[p+1][M],A=h[p+1][M+1];(p!==0||o>0)&&d.push(v,y,A),(p!==i-1||l<Math.PI)&&d.push(y,T,A)}this.setIndex(d),this.setAttribute("position",new Kt(g,3)),this.setAttribute("normal",new Kt(x,3)),this.setAttribute("uv",new Kt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Fs=class n extends Ee{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new O,u=new O,f=new O;for(let d=0;d<=i;d++)for(let g=0;g<=s;g++){let x=g/s*r,m=d/i*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(x),u.y=(t+e*Math.cos(m))*Math.sin(x),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/s),c.push(d/i)}for(let d=1;d<=i;d++)for(let g=1;g<=s;g++){let x=(s+1)*d+g-1,m=(s+1)*(d-1)+g-1,p=(s+1)*(d-1)+g,M=(s+1)*d+g;o.push(x,m,M),o.push(m,p,M)}this.setIndex(o),this.setAttribute("position",new Kt(a,3)),this.setAttribute("normal",new Kt(l,3)),this.setAttribute("uv",new Kt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Dr=class n extends Ee{constructor(t=new Oo(new O(-1,-1,0),new O(-1,1,0),new O(1,1,0)),e=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:i,radialSegments:s,closed:r};let o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new O,l=new O,c=new mt,h=new O,u=[],f=[],d=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new Kt(u,3)),this.setAttribute("normal",new Kt(f,3)),this.setAttribute("uv",new Kt(d,2));function x(){for(let v=0;v<e;v++)m(v);m(r===!1?e:0),M(),p()}function m(v){h=t.getPointAt(v/e,h);let y=o.normals[v],T=o.binormals[v];for(let A=0;A<=s;A++){let R=A/s*Math.PI*2,C=Math.sin(R),S=-Math.cos(R);l.x=S*y.x+C*T.x,l.y=S*y.y+C*T.y,l.z=S*y.z+C*T.z,l.normalize(),f.push(l.x,l.y,l.z),a.x=h.x+i*l.x,a.y=h.y+i*l.y,a.z=h.z+i*l.z,u.push(a.x,a.y,a.z)}}function p(){for(let v=1;v<=e;v++)for(let y=1;y<=s;y++){let T=(s+1)*(v-1)+(y-1),A=(s+1)*v+(y-1),R=(s+1)*v+y,C=(s+1)*(v-1)+y;g.push(T,A,C),g.push(A,R,C)}}function M(){for(let v=0;v<=e;v++)for(let y=0;y<=s;y++)c.x=v/e,c.y=y/s,d.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new n(new dl[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};var Xo=class extends me{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},qe=class extends Xi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new It(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new It(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ec,this.normalScale=new mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ni,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Os=class extends qe{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new mt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Me(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new It(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new It(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new It(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var qo=class extends Xi{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ec,this.normalScale=new mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}};var pl=class extends Xi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Yd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},ml=class extends Xi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function ja(n,t){return!n||n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function j0(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var ks=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=e[++i],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(i=2,r=a);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=e[--i-1],t>=r)break t}o=i,i=0;break e}break n}for(;i<o;){let a=i+o>>>1;t<e[a]?o=a:i=a+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=i[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},gl=class extends ks{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Nh,endingEnd:Nh}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Uh:r=t,a=2*e-i;break;case Fh:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Uh:o=t,l=2*i-e;break;case Fh:o=1,l=i+s[1]-s[0];break;default:o=t-1,l=e}let c=(i-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,g=(i-e)/(s-e),x=g*g,m=x*g,p=-f*m+2*f*x-f*g,M=(1+f)*m+(-1.5-2*f)*x+(-.5+f)*g+1,v=(-1-d)*m+(1.5+d)*x+.5*g,y=d*m-d*x;for(let T=0;T!==a;++T)r[T]=p*o[h+T]+M*o[c+T]+v*o[l+T]+y*o[u+T];return r}},xl=class extends ks{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(i-e)/(s-e),u=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*u+o[l+f]*h;return r}},vl=class extends ks{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},si=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ja(e,this.TimeBufferType),this.values=ja(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:ja(t.times,Array),values:ja(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s)}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new vl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new xl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new gl(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case yo:e=this.InterpolantFactoryMethodDiscrete;break;case il:e=this.InterpolantFactoryMethodLinear;break;case Qa:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return yo;case this.InterpolantFactoryMethodLinear:return il;case this.InterpolantFactoryMethodSmooth:return Qa}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t}return this}trim(t,e){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<t;)++r;for(;o!==-1&&i[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&j0(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===Qa,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let u=a*i,f=u-i,d=u+i;for(let g=0;g!==i;++g){let x=e[u+g];if(x!==e[f+g]||x!==e[d+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*i,f=o*i;for(let d=0;d!==i;++d)e[f+d]=e[u+d]}++o}}if(r>0){t[o]=t[r];for(let a=r*i,l=o*i,c=0;c!==i;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};si.prototype.ValueTypeName="";si.prototype.TimeBufferType=Float32Array;si.prototype.ValueBufferType=Float32Array;si.prototype.DefaultInterpolation=il;var rs=class extends si{constructor(t,e,i){super(t,e,i)}};rs.prototype.ValueTypeName="bool";rs.prototype.ValueBufferType=Array;rs.prototype.DefaultInterpolation=yo;rs.prototype.InterpolantFactoryMethodLinear=void 0;rs.prototype.InterpolantFactoryMethodSmooth=void 0;var yl=class extends si{constructor(t,e,i,s){super(t,e,i,s)}};yl.prototype.ValueTypeName="color";var _l=class extends si{constructor(t,e,i,s){super(t,e,i,s)}};_l.prototype.ValueTypeName="number";var Ml=class extends ks{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)Xn.slerpFlat(r,0,o,c-a,o,c,l);return r}},Yo=class extends si{constructor(t,e,i,s){super(t,e,i,s)}InterpolantFactoryMethodLinear(t){return new Ml(this.times,this.values,this.getValueSize(),t)}};Yo.prototype.ValueTypeName="quaternion";Yo.prototype.InterpolantFactoryMethodSmooth=void 0;var os=class extends si{constructor(t,e,i){super(t,e,i)}};os.prototype.ValueTypeName="string";os.prototype.ValueBufferType=Array;os.prototype.DefaultInterpolation=yo;os.prototype.InterpolantFactoryMethodLinear=void 0;os.prototype.InterpolantFactoryMethodSmooth=void 0;var bl=class extends si{constructor(t,e,i,s){super(t,e,i,s)}};bl.prototype.ValueTypeName="vector";var Sl=class{constructor(t,e,i){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=c.length;u<f;u+=2){let d=c[u],g=c[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},uf=new Sl,wl=class{constructor(t){this.manager=t!==void 0?t:uf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};wl.DEFAULT_MATERIAL_NAME="__DEFAULT";var Lr=class extends Ue{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new It(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},Zo=class extends Lr{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ue.DEFAULT_UP),this.updateMatrix(),this.groundColor=new It(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Ih=new ne,wd=new O,Ed=new O,El=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new mt(512,512),this.mapType=Bn,this.map=null,this.mapPass=null,this.matrix=new ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ar,this._frameExtents=new mt(1,1),this._viewportCount=1,this._viewports=[new De(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,i=this.matrix;wd.setFromMatrixPosition(t.matrixWorld),e.position.copy(wd),Ed.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ed),e.updateMatrixWorld(),Ih.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ih,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ih)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Td=new ne,fo=new O,Dh=new O,Vh=class extends El{constructor(){super(new En(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new mt(4,2),this._viewportCount=6,this._viewports=[new De(2,1,1,1),new De(0,1,1,1),new De(3,1,1,1),new De(1,1,1,1),new De(3,0,1,1),new De(1,0,1,1)],this._cubeDirections=[new O(1,0,0),new O(-1,0,0),new O(0,0,1),new O(0,0,-1),new O(0,1,0),new O(0,-1,0)],this._cubeUps=[new O(0,1,0),new O(0,1,0),new O(0,1,0),new O(0,1,0),new O(0,0,1),new O(0,0,-1)]}updateMatrices(t,e=0){let i=this.camera,s=this.matrix,r=t.distance||i.far;r!==i.far&&(i.far=r,i.updateProjectionMatrix()),fo.setFromMatrixPosition(t.matrixWorld),i.position.copy(fo),Dh.copy(i.position),Dh.add(this._cubeDirections[e]),i.up.copy(this._cubeUps[e]),i.lookAt(Dh),i.updateMatrixWorld(),s.makeTranslation(-fo.x,-fo.y,-fo.z),Td.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Td,i.coordinateSystem,i.reversedDepth)}},Jo=class extends Lr{constructor(t,e,i=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Vh}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},Bs=class extends Ao{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,o=i+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Gh=class extends El{constructor(){super(new Bs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Nr=class extends Lr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ue.DEFAULT_UP),this.updateMatrix(),this.target=new Ue,this.shadow=new Gh}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var $o=class extends Ee{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var Tl=class extends En{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},Ko=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};var hu="\\[\\]\\.:\\/",Q0=new RegExp("["+hu+"]","g"),uu="[^"+hu+"]",tm="[^"+hu.replace("\\.","")+"]",em=/((?:WC+[\/:])*)/.source.replace("WC",uu),nm=/(WCOD+)?/.source.replace("WCOD",tm),im=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",uu),sm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",uu),rm=new RegExp("^"+em+nm+im+sm+"$"),om=["material","materials","bones","map"],Wh=class{constructor(t,e,i){let s=i||Ze.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},Ze=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Q0,"")}static parseTrackName(t){let e=rm.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);om.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=i(a.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ze.Composite=Wh;Ze.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ze.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ze.prototype.GetterByBindingType=[Ze.prototype._getValue_direct,Ze.prototype._getValue_array,Ze.prototype._getValue_arrayElement,Ze.prototype._getValue_toArray];Ze.prototype.SetterByBindingTypeAndVersioning=[[Ze.prototype._setValue_direct,Ze.prototype._setValue_direct_setNeedsUpdate,Ze.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ze.prototype._setValue_array,Ze.prototype._setValue_array_setNeedsUpdate,Ze.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ze.prototype._setValue_arrayElement,Ze.prototype._setValue_arrayElement_setNeedsUpdate,Ze.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ze.prototype._setValue_fromArray,Ze.prototype._setValue_fromArray_setNeedsUpdate,Ze.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var q_=new Float32Array(1);function du(n,t,e,i){let s=am(i);switch(e){case eu:return n*t;case Or:return n*t/s.components*s.byteLength;case Zl:return n*t/s.components*s.byteLength;case iu:return n*t*2/s.components*s.byteLength;case Jl:return n*t*2/s.components*s.byteLength;case nu:return n*t*3/s.components*s.byteLength;case mn:return n*t*4/s.components*s.byteLength;case $l:return n*t*4/s.components*s.byteLength;case na:case ia:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case sa:case ra:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case jl:case tc:return Math.max(n,16)*Math.max(t,8)/4;case Kl:case Ql:return Math.max(n,8)*Math.max(t,8)/2;case ec:case nc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ic:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case sc:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case rc:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case oc:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case ac:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case lc:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case cc:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case hc:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case uc:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case dc:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case fc:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case pc:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case mc:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case gc:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case xc:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case vc:case yc:case _c:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Mc:case bc:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Sc:case wc:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function am(n){switch(n){case Bn:case Kh:return{byteLength:1,components:1};case Fr:case jh:case Tn:return{byteLength:2,components:1};case ql:case Yl:return{byteLength:2,components:4};case as:case Xl:case di:return{byteLength:4,components:1};case Qh:case tu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Uf(){let n=null,t=!1,e=null,i=null;function s(r,o){e(r,o),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function pm(n){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,u=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=n.SHORT;else if(c instanceof Uint32Array)d=n.UNSIGNED_INT;else if(c instanceof Int32Array)d=n.INT;else if(c instanceof Int8Array)d=n.BYTE;else if(c instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,l,c){let h=l.array,u=l.updateRanges;if(n.bindBuffer(c,a),u.length===0)n.bufferSubData(c,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){let g=u[f],x=u[d];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++f,u[f]=x)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){let x=u[d];n.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(n.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var mm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,gm=`#ifdef USE_ALPHAHASH
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
#endif`,xm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ym=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,_m=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mm=`#ifdef USE_AOMAP
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
#endif`,bm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Sm=`#ifdef USE_BATCHING
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
#endif`,wm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Em=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Tm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Am=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Rm=`#ifdef USE_IRIDESCENCE
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
#endif`,Cm=`#ifdef USE_BUMPMAP
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
#endif`,Pm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Im=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Dm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Lm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Nm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Um=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Fm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Om=`#if defined( USE_COLOR_ALPHA )
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
#endif`,km=`#define PI 3.141592653589793
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
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
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
} // validated`,Bm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,zm=`vec3 transformedNormal = objectNormal;
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
#endif`,Hm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Gm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Wm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xm="gl_FragColor = linearToOutputTexel( gl_FragColor );",qm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ym=`#ifdef USE_ENVMAP
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
#endif`,Zm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Jm=`#ifdef USE_ENVMAP
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
#endif`,$m=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Km=`#ifdef USE_ENVMAP
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
#endif`,jm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Qm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,tg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,eg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ng=`#ifdef USE_GRADIENTMAP
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
}`,ig=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,sg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,rg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,og=`uniform bool receiveShadow;
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
#endif`,ag=`#ifdef USE_ENVMAP
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
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
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
#endif`,lg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,hg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ug=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,dg=`PhysicalMaterial material;
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
#endif`,fg=`struct PhysicalMaterial {
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
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
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
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
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
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
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
}`,pg=`
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
#endif`,mg=`#if defined( RE_IndirectDiffuse )
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
#endif`,gg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,xg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,vg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_g=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Mg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,bg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Sg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,wg=`#if defined( USE_POINTS_UV )
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
#endif`,Eg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Tg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ag=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Rg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Cg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Pg=`#ifdef USE_MORPHTARGETS
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
#endif`,Ig=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Lg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ng=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ug=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Fg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Og=`#ifdef USE_NORMALMAP
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
#endif`,kg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Bg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,zg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Hg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Vg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Gg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Wg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Xg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,qg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Yg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Zg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,$g=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Kg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,jg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Qg=`float getShadowMask() {
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
}`,t1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,e1=`#ifdef USE_SKINNING
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
#endif`,n1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,i1=`#ifdef USE_SKINNING
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
#endif`,s1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,r1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,o1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,a1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,l1=`#ifdef USE_TRANSMISSION
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
#endif`,c1=`#ifdef USE_TRANSMISSION
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
#endif`,h1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,u1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,d1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,f1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,p1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,m1=`uniform sampler2D t2D;
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
}`,g1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,x1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,v1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,y1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_1=`#include <common>
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
}`,M1=`#if DEPTH_PACKING == 3200
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
}`,b1=`#define DISTANCE
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
}`,S1=`#define DISTANCE
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
}`,w1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,E1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,T1=`uniform float scale;
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
}`,A1=`uniform vec3 diffuse;
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
}`,R1=`#include <common>
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
}`,C1=`uniform vec3 diffuse;
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
}`,P1=`#define LAMBERT
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
}`,I1=`#define LAMBERT
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
}`,D1=`#define MATCAP
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
}`,L1=`#define MATCAP
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
}`,N1=`#define NORMAL
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
}`,U1=`#define NORMAL
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
}`,F1=`#define PHONG
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
}`,O1=`#define PHONG
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
}`,k1=`#define STANDARD
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
}`,B1=`#define STANDARD
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
}`,z1=`#define TOON
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
}`,H1=`#define TOON
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
}`,V1=`uniform float size;
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
}`,G1=`uniform vec3 diffuse;
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
}`,W1=`#include <common>
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
}`,X1=`uniform vec3 color;
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
}`,q1=`uniform float rotation;
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
}`,Y1=`uniform vec3 diffuse;
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
}`,be={alphahash_fragment:mm,alphahash_pars_fragment:gm,alphamap_fragment:xm,alphamap_pars_fragment:vm,alphatest_fragment:ym,alphatest_pars_fragment:_m,aomap_fragment:Mm,aomap_pars_fragment:bm,batching_pars_vertex:Sm,batching_vertex:wm,begin_vertex:Em,beginnormal_vertex:Tm,bsdfs:Am,iridescence_fragment:Rm,bumpmap_pars_fragment:Cm,clipping_planes_fragment:Pm,clipping_planes_pars_fragment:Im,clipping_planes_pars_vertex:Dm,clipping_planes_vertex:Lm,color_fragment:Nm,color_pars_fragment:Um,color_pars_vertex:Fm,color_vertex:Om,common:km,cube_uv_reflection_fragment:Bm,defaultnormal_vertex:zm,displacementmap_pars_vertex:Hm,displacementmap_vertex:Vm,emissivemap_fragment:Gm,emissivemap_pars_fragment:Wm,colorspace_fragment:Xm,colorspace_pars_fragment:qm,envmap_fragment:Ym,envmap_common_pars_fragment:Zm,envmap_pars_fragment:Jm,envmap_pars_vertex:$m,envmap_physical_pars_fragment:ag,envmap_vertex:Km,fog_vertex:jm,fog_pars_vertex:Qm,fog_fragment:tg,fog_pars_fragment:eg,gradientmap_pars_fragment:ng,lightmap_pars_fragment:ig,lights_lambert_fragment:sg,lights_lambert_pars_fragment:rg,lights_pars_begin:og,lights_toon_fragment:lg,lights_toon_pars_fragment:cg,lights_phong_fragment:hg,lights_phong_pars_fragment:ug,lights_physical_fragment:dg,lights_physical_pars_fragment:fg,lights_fragment_begin:pg,lights_fragment_maps:mg,lights_fragment_end:gg,logdepthbuf_fragment:xg,logdepthbuf_pars_fragment:vg,logdepthbuf_pars_vertex:yg,logdepthbuf_vertex:_g,map_fragment:Mg,map_pars_fragment:bg,map_particle_fragment:Sg,map_particle_pars_fragment:wg,metalnessmap_fragment:Eg,metalnessmap_pars_fragment:Tg,morphinstance_vertex:Ag,morphcolor_vertex:Rg,morphnormal_vertex:Cg,morphtarget_pars_vertex:Pg,morphtarget_vertex:Ig,normal_fragment_begin:Dg,normal_fragment_maps:Lg,normal_pars_fragment:Ng,normal_pars_vertex:Ug,normal_vertex:Fg,normalmap_pars_fragment:Og,clearcoat_normal_fragment_begin:kg,clearcoat_normal_fragment_maps:Bg,clearcoat_pars_fragment:zg,iridescence_pars_fragment:Hg,opaque_fragment:Vg,packing:Gg,premultiplied_alpha_fragment:Wg,project_vertex:Xg,dithering_fragment:qg,dithering_pars_fragment:Yg,roughnessmap_fragment:Zg,roughnessmap_pars_fragment:Jg,shadowmap_pars_fragment:$g,shadowmap_pars_vertex:Kg,shadowmap_vertex:jg,shadowmask_pars_fragment:Qg,skinbase_vertex:t1,skinning_pars_vertex:e1,skinning_vertex:n1,skinnormal_vertex:i1,specularmap_fragment:s1,specularmap_pars_fragment:r1,tonemapping_fragment:o1,tonemapping_pars_fragment:a1,transmission_fragment:l1,transmission_pars_fragment:c1,uv_pars_fragment:h1,uv_pars_vertex:u1,uv_vertex:d1,worldpos_vertex:f1,background_vert:p1,background_frag:m1,backgroundCube_vert:g1,backgroundCube_frag:x1,cube_vert:v1,cube_frag:y1,depth_vert:_1,depth_frag:M1,distanceRGBA_vert:b1,distanceRGBA_frag:S1,equirect_vert:w1,equirect_frag:E1,linedashed_vert:T1,linedashed_frag:A1,meshbasic_vert:R1,meshbasic_frag:C1,meshlambert_vert:P1,meshlambert_frag:I1,meshmatcap_vert:D1,meshmatcap_frag:L1,meshnormal_vert:N1,meshnormal_frag:U1,meshphong_vert:F1,meshphong_frag:O1,meshphysical_vert:k1,meshphysical_frag:B1,meshtoon_vert:z1,meshtoon_frag:H1,points_vert:V1,points_frag:G1,shadow_vert:W1,shadow_frag:X1,sprite_vert:q1,sprite_frag:Y1},Ht={common:{diffuse:{value:new It(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ve},alphaMap:{value:null},alphaMapTransform:{value:new ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ve}},envmap:{envMap:{value:null},envMapRotation:{value:new ve},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ve},normalScale:{value:new mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new It(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new It(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ve},alphaTest:{value:0},uvTransform:{value:new ve}},sprite:{diffuse:{value:new It(16777215)},opacity:{value:1},center:{value:new mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ve},alphaMap:{value:null},alphaMapTransform:{value:new ve},alphaTest:{value:0}}},Ii={basic:{uniforms:In([Ht.common,Ht.specularmap,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.fog]),vertexShader:be.meshbasic_vert,fragmentShader:be.meshbasic_frag},lambert:{uniforms:In([Ht.common,Ht.specularmap,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.fog,Ht.lights,{emissive:{value:new It(0)}}]),vertexShader:be.meshlambert_vert,fragmentShader:be.meshlambert_frag},phong:{uniforms:In([Ht.common,Ht.specularmap,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.fog,Ht.lights,{emissive:{value:new It(0)},specular:{value:new It(1118481)},shininess:{value:30}}]),vertexShader:be.meshphong_vert,fragmentShader:be.meshphong_frag},standard:{uniforms:In([Ht.common,Ht.envmap,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.roughnessmap,Ht.metalnessmap,Ht.fog,Ht.lights,{emissive:{value:new It(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:be.meshphysical_vert,fragmentShader:be.meshphysical_frag},toon:{uniforms:In([Ht.common,Ht.aomap,Ht.lightmap,Ht.emissivemap,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.gradientmap,Ht.fog,Ht.lights,{emissive:{value:new It(0)}}]),vertexShader:be.meshtoon_vert,fragmentShader:be.meshtoon_frag},matcap:{uniforms:In([Ht.common,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,Ht.fog,{matcap:{value:null}}]),vertexShader:be.meshmatcap_vert,fragmentShader:be.meshmatcap_frag},points:{uniforms:In([Ht.points,Ht.fog]),vertexShader:be.points_vert,fragmentShader:be.points_frag},dashed:{uniforms:In([Ht.common,Ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:be.linedashed_vert,fragmentShader:be.linedashed_frag},depth:{uniforms:In([Ht.common,Ht.displacementmap]),vertexShader:be.depth_vert,fragmentShader:be.depth_frag},normal:{uniforms:In([Ht.common,Ht.bumpmap,Ht.normalmap,Ht.displacementmap,{opacity:{value:1}}]),vertexShader:be.meshnormal_vert,fragmentShader:be.meshnormal_frag},sprite:{uniforms:In([Ht.sprite,Ht.fog]),vertexShader:be.sprite_vert,fragmentShader:be.sprite_frag},background:{uniforms:{uvTransform:{value:new ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:be.background_vert,fragmentShader:be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ve}},vertexShader:be.backgroundCube_vert,fragmentShader:be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:be.cube_vert,fragmentShader:be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:be.equirect_vert,fragmentShader:be.equirect_frag},distanceRGBA:{uniforms:In([Ht.common,Ht.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:be.distanceRGBA_vert,fragmentShader:be.distanceRGBA_frag},shadow:{uniforms:In([Ht.lights,Ht.fog,{color:{value:new It(0)},opacity:{value:1}}]),vertexShader:be.shadow_vert,fragmentShader:be.shadow_frag}};Ii.physical={uniforms:In([Ii.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ve},clearcoatNormalScale:{value:new mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ve},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ve},sheen:{value:0},sheenColor:{value:new It(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ve},transmissionSamplerSize:{value:new mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ve},attenuationDistance:{value:0},attenuationColor:{value:new It(0)},specularColor:{value:new It(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ve},anisotropyVector:{value:new mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ve}}]),vertexShader:be.meshphysical_vert,fragmentShader:be.meshphysical_frag};var Tc={r:0,b:0,g:0},Ws=new ni,Z1=new ne;function J1(n,t,e,i,s,r,o){let a=new It(0),l=r===!0?0:1,c,h,u=null,f=0,d=null;function g(v){let y=v.isScene===!0?v.background:null;return y&&y.isTexture&&(y=(v.backgroundBlurriness>0?e:t).get(y)),y}function x(v){let y=!1,T=g(v);T===null?p(a,l):T&&T.isColor&&(p(T,1),y=!0);let A=n.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(v,y){let T=g(y);T&&(T.isCubeTexture||T.mapping===ta)?(h===void 0&&(h=new jt(new Fe(1,1,1),new me({name:"BackgroundCubeMaterial",uniforms:Gs(Ii.backgroundCube.uniforms),vertexShader:Ii.backgroundCube.vertexShader,fragmentShader:Ii.backgroundCube.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,R,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Ws.copy(y.backgroundRotation),Ws.x*=-1,Ws.y*=-1,Ws.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Ws.y*=-1,Ws.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Z1.makeRotationFromEuler(Ws)),h.material.toneMapped=Re.getTransfer(T.colorSpace)!==Ne,(u!==T||f!==T.version||d!==n.toneMapping)&&(h.material.needsUpdate=!0,u=T,f=T.version,d=n.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(c===void 0&&(c=new jt(new cn(2,2),new me({name:"BackgroundMaterial",uniforms:Gs(Ii.background.uniforms),vertexShader:Ii.background.vertexShader,fragmentShader:Ii.background.fragmentShader,side:Vi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=T,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=Re.getTransfer(T.colorSpace)!==Ne,T.matrixAutoUpdate===!0&&T.updateMatrix(),c.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||f!==T.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,u=T,f=T.version,d=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function p(v,y){v.getRGB(Tc,lu(n)),i.buffers.color.setClear(Tc.r,Tc.g,Tc.b,y,o)}function M(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,y=1){a.set(v),l=y,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,p(a,l)},render:x,addToRenderList:m,dispose:M}}function $1(n,t){let e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null),r=s,o=!1;function a(b,D,N,F,B){let G=!1,X=u(F,N,D);r!==X&&(r=X,c(r.object)),G=d(b,F,N,B),G&&g(b,F,N,B),B!==null&&t.update(B,n.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,y(b,D,N,F),B!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function h(b){return n.deleteVertexArray(b)}function u(b,D,N){let F=N.wireframe===!0,B=i[b.id];B===void 0&&(B={},i[b.id]=B);let G=B[D.id];G===void 0&&(G={},B[D.id]=G);let X=G[F];return X===void 0&&(X=f(l()),G[F]=X),X}function f(b){let D=[],N=[],F=[];for(let B=0;B<e;B++)D[B]=0,N[B]=0,F[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:N,attributeDivisors:F,object:b,attributes:{},index:null}}function d(b,D,N,F){let B=r.attributes,G=D.attributes,X=0,j=N.getAttributes();for(let Z in j)if(j[Z].location>=0){let ot=B[Z],ft=G[Z];if(ft===void 0&&(Z==="instanceMatrix"&&b.instanceMatrix&&(ft=b.instanceMatrix),Z==="instanceColor"&&b.instanceColor&&(ft=b.instanceColor)),ot===void 0||ot.attribute!==ft||ft&&ot.data!==ft.data)return!0;X++}return r.attributesNum!==X||r.index!==F}function g(b,D,N,F){let B={},G=D.attributes,X=0,j=N.getAttributes();for(let Z in j)if(j[Z].location>=0){let ot=G[Z];ot===void 0&&(Z==="instanceMatrix"&&b.instanceMatrix&&(ot=b.instanceMatrix),Z==="instanceColor"&&b.instanceColor&&(ot=b.instanceColor));let ft={};ft.attribute=ot,ot&&ot.data&&(ft.data=ot.data),B[Z]=ft,X++}r.attributes=B,r.attributesNum=X,r.index=F}function x(){let b=r.newAttributes;for(let D=0,N=b.length;D<N;D++)b[D]=0}function m(b){p(b,0)}function p(b,D){let N=r.newAttributes,F=r.enabledAttributes,B=r.attributeDivisors;N[b]=1,F[b]===0&&(n.enableVertexAttribArray(b),F[b]=1),B[b]!==D&&(n.vertexAttribDivisor(b,D),B[b]=D)}function M(){let b=r.newAttributes,D=r.enabledAttributes;for(let N=0,F=D.length;N<F;N++)D[N]!==b[N]&&(n.disableVertexAttribArray(N),D[N]=0)}function v(b,D,N,F,B,G,X){X===!0?n.vertexAttribIPointer(b,D,N,B,G):n.vertexAttribPointer(b,D,N,F,B,G)}function y(b,D,N,F){x();let B=F.attributes,G=N.getAttributes(),X=D.defaultAttributeValues;for(let j in G){let Z=G[j];if(Z.location>=0){let J=B[j];if(J===void 0&&(j==="instanceMatrix"&&b.instanceMatrix&&(J=b.instanceMatrix),j==="instanceColor"&&b.instanceColor&&(J=b.instanceColor)),J!==void 0){let ot=J.normalized,ft=J.itemSize,Lt=t.get(J);if(Lt===void 0)continue;let Ut=Lt.buffer,zt=Lt.type,Ft=Lt.bytesPerElement,Q=zt===n.INT||zt===n.UNSIGNED_INT||J.gpuType===Xl;if(J.isInterleavedBufferAttribute){let ht=J.data,wt=ht.stride,_t=J.offset;if(ht.isInstancedInterleavedBuffer){for(let At=0;At<Z.locationSize;At++)p(Z.location+At,ht.meshPerAttribute);b.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ht.meshPerAttribute*ht.count)}else for(let At=0;At<Z.locationSize;At++)m(Z.location+At);n.bindBuffer(n.ARRAY_BUFFER,Ut);for(let At=0;At<Z.locationSize;At++)v(Z.location+At,ft/Z.locationSize,zt,ot,wt*Ft,(_t+ft/Z.locationSize*At)*Ft,Q)}else{if(J.isInstancedBufferAttribute){for(let ht=0;ht<Z.locationSize;ht++)p(Z.location+ht,J.meshPerAttribute);b.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let ht=0;ht<Z.locationSize;ht++)m(Z.location+ht);n.bindBuffer(n.ARRAY_BUFFER,Ut);for(let ht=0;ht<Z.locationSize;ht++)v(Z.location+ht,ft/Z.locationSize,zt,ot,ft*Ft,ft/Z.locationSize*ht*Ft,Q)}}else if(X!==void 0){let ot=X[j];if(ot!==void 0)switch(ot.length){case 2:n.vertexAttrib2fv(Z.location,ot);break;case 3:n.vertexAttrib3fv(Z.location,ot);break;case 4:n.vertexAttrib4fv(Z.location,ot);break;default:n.vertexAttrib1fv(Z.location,ot)}}}}M()}function T(){C();for(let b in i){let D=i[b];for(let N in D){let F=D[N];for(let B in F)h(F[B].object),delete F[B];delete D[N]}delete i[b]}}function A(b){if(i[b.id]===void 0)return;let D=i[b.id];for(let N in D){let F=D[N];for(let B in F)h(F[B].object),delete F[B];delete D[N]}delete i[b.id]}function R(b){for(let D in i){let N=i[D];if(N[b.id]===void 0)continue;let F=N[b.id];for(let B in F)h(F[B].object),delete F[B];delete N[b.id]}}function C(){S(),o=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:S,dispose:T,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:m,disableUnusedAttributes:M}}function K1(n,t,e){let i;function s(c){i=c}function r(c,h){n.drawArrays(i,c,h),e.update(h,i,1)}function o(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),e.update(h,i,u))}function a(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let d=0;for(let g=0;g<u;g++)d+=h[g];e.update(d,i,1)}function l(c,h,u,f){if(u===0)return;let d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<c.length;g++)o(c[g],h[g],f[g]);else{d.multiDrawArraysInstancedWEBGL(i,c,0,h,0,f,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x]*f[x];e.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function j1(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let R=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(R){return!(R!==mn&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let C=R===Tn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==Bn&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==di&&!C)}function l(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,A=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:v,maxFragmentUniforms:y,vertexTextures:T,maxSamples:A}}function Q1(n){let t=this,e=null,i=0,s=!1,r=!1,o=new Ai,a=new ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||i!==0||s;return s=f,i=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){let g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,p=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let M=r?0:i,v=M*4,y=p.clippingState||null;l.value=y,y=h(g,f,v,d);for(let T=0;T!==v;++T)y[T]=e[T];p.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,f,d,g){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=l.value,g!==!0||m===null){let p=d+x*4,M=f.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,y=d;v!==x;++v,y+=4)o.copy(u[v]).applyMatrix4(M,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function tx(n){let t=new WeakMap;function e(o,a){return a===Vl?o.mapping=Hs:a===Gl&&(o.mapping=Vs),o}function i(o){if(o&&o.isTexture){let a=o.mapping;if(a===Vl||a===Gl)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new ll(l.height);return c.fromEquirectangularTexture(n,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:i,dispose:r}}var zr=4,df=[.125,.215,.35,.446,.526,.582],Ys=20,fu=new Bs,ff=new It,pu=null,mu=0,gu=0,xu=!1,qs=(1+Math.sqrt(5))/2,Br=1/qs,pf=[new O(-qs,Br,0),new O(qs,Br,0),new O(-Br,0,qs),new O(Br,0,qs),new O(0,qs,-Br),new O(0,qs,Br),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)],ex=new O,Vr=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100,r={}){let{size:o=256,position:a=ex}=r;pu=this._renderer.getRenderTarget(),mu=this._renderer.getActiveCubeFace(),gu=this._renderer.getActiveMipmapLevel(),xu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=gf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(pu,mu,gu),this._renderer.xr.enabled=xu,t.scissorTest=!1,Ac(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Hs||t.mapping===Vs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),pu=this._renderer.getRenderTarget(),mu=this._renderer.getActiveCubeFace(),gu=this._renderer.getActiveMipmapLevel(),xu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Fn,minFilter:Fn,generateMipmaps:!1,type:Tn,format:mn,colorSpace:Rs,depthBuffer:!1},s=mf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=mf(t,e,i);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=nx(r)),this._blurMaterial=ix(r,t,e)}return s}_compileMaterial(t){let e=new jt(this._lodPlanes[0],t);this._renderer.compile(e,fu)}_sceneToCubeUV(t,e,i,s,r){let l=new En(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(ff),u.toneMapping=Zi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let x=new sn({name:"PMREM.Background",side:pn,depthWrite:!1,depthTest:!1}),m=new jt(new Fe,x),p=!1,M=t.background;M?M.isColor&&(x.color.copy(M),t.background=null,p=!0):(x.color.copy(ff),p=!0);for(let v=0;v<6;v++){let y=v%3;y===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[v],r.y,r.z)):y===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[v]));let T=this._cubeSize;Ac(s,y*T,v>2?T:0,T,T),u.setRenderTarget(s),p&&u.render(m,l),u.render(t,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=d,u.autoClear=f,t.background=M}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===Hs||t.mapping===Vs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=xf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=gf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new jt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Ac(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,fu)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=pf[(s-r-1)%pf.length];this._blur(t,r-1,r,o,a)}e.autoClear=i}_blur(t,e,i,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,i,s,"latitudinal",r),this._halfBlur(o,t,i,i,s,"longitudinal",r)}_halfBlur(t,e,i,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new jt(this._lodPlanes[s],c),f=c.uniforms,d=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*Ys-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):Ys;m>Ys&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ys}`);let p=[],M=0;for(let R=0;R<Ys;++R){let C=R/x,S=Math.exp(-C*C/2);p.push(S),R===0?M+=S:R<m&&(M+=2*S)}for(let R=0;R<p.length;R++)p[R]=p[R]/M;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-i;let y=this._sizeLods[s],T=3*y*(s>v-zr?s-v+zr:0),A=4*(this._cubeSize-y);Ac(e,T,A,3*y,2*y),l.setRenderTarget(e),l.render(u,fu)}};function nx(n){let t=[],e=[],i=[],s=n,r=n-zr+1+df.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>n-zr?l=df[o-n+zr-1]:o===0&&(l=0),i.push(l);let c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,g=6,x=3,m=2,p=1,M=new Float32Array(x*g*d),v=new Float32Array(m*g*d),y=new Float32Array(p*g*d);for(let A=0;A<d;A++){let R=A%3*2/3-1,C=A>2?0:-1,S=[R,C,0,R+2/3,C,0,R+2/3,C+1,0,R,C,0,R+2/3,C+1,0,R,C+1,0];M.set(S,x*g*A),v.set(f,m*g*A);let b=[A,A,A,A,A,A];y.set(b,p*g*A)}let T=new Ee;T.setAttribute("position",new Ce(M,x)),T.setAttribute("uv",new Ce(v,m)),T.setAttribute("faceIndex",new Ce(y,p)),t.push(T),s>zr&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function mf(n,t,e){let i=new ln(n,t,e);return i.texture.mapping=ta,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ac(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function ix(n,t,e){let i=new Float32Array(Ys),s=new O(0,1,0);return new me({name:"SphericalGaussianBlur",defines:{n:Ys,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Au(),fragmentShader:`

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
		`,blending:un,depthTest:!1,depthWrite:!1})}function gf(){return new me({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Au(),fragmentShader:`

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
		`,blending:un,depthTest:!1,depthWrite:!1})}function xf(){return new me({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Au(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:un,depthTest:!1,depthWrite:!1})}function Au(){return`

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
	`}function sx(n){let t=new WeakMap,e=null;function i(a){if(a&&a.isTexture){let l=a.mapping,c=l===Vl||l===Gl,h=l===Hs||l===Vs;if(c||h){let u=t.get(a),f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new Vr(n)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{let d=a.image;return c&&d&&d.height>0||h&&d&&s(d)?(e===null&&(e=new Vr(n)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:o}}function rx(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let s=e(i);return s===null&&br("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function ox(n,t,e,i){let s={},r=new WeakMap;function o(u){let f=u.target;f.index!==null&&t.remove(f.index);for(let g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];let d=r.get(f);d&&(t.remove(d),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function l(u){let f=u.attributes;for(let d in f)t.update(f[d],n.ARRAY_BUFFER)}function c(u){let f=[],d=u.index,g=u.attributes.position,x=0;if(d!==null){let M=d.array;x=d.version;for(let v=0,y=M.length;v<y;v+=3){let T=M[v+0],A=M[v+1],R=M[v+2];f.push(T,A,A,R,R,T)}}else if(g!==void 0){let M=g.array;x=g.version;for(let v=0,y=M.length/3-1;v<y;v+=3){let T=v+0,A=v+1,R=v+2;f.push(T,A,A,R,R,T)}}else return;let m=new(au(f)?To:Cs)(f,1);m.version=x;let p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){let f=r.get(u);if(f){let d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function ax(n,t,e){let i;function s(f){i=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,d){n.drawElements(i,d,r,f*o),e.update(d,i,1)}function c(f,d,g){g!==0&&(n.drawElementsInstanced(i,d,r,f*o,g),e.update(d,i,g))}function h(f,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];e.update(m,i,1)}function u(f,d,g,x){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)c(f[p]/o,d[p],x[p]);else{m.multiDrawElementsInstancedWEBGL(i,d,0,r,f,0,x,0,g);let p=0;for(let M=0;M<g;M++)p+=d[M]*x[M];e.update(p,i,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function lx(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function cx(n,t,e){let i=new WeakMap,s=new De;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,f=i.get(a);if(f===void 0||f.count!==u){let S=function(){R.dispose(),i.delete(a),a.removeEventListener("dispose",S)};f!==void 0&&f.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],v=0;d===!0&&(v=1),g===!0&&(v=2),x===!0&&(v=3);let y=a.attributes.position.count*v,T=1;y>t.maxTextureSize&&(T=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let A=new Float32Array(y*T*4*u),R=new So(A,y,T,u);R.type=di,R.needsUpdate=!0;let C=v*4;for(let b=0;b<u;b++){let D=m[b],N=p[b],F=M[b],B=y*T*4*b;for(let G=0;G<D.count;G++){let X=G*C;d===!0&&(s.fromBufferAttribute(D,G),A[B+X+0]=s.x,A[B+X+1]=s.y,A[B+X+2]=s.z,A[B+X+3]=0),g===!0&&(s.fromBufferAttribute(N,G),A[B+X+4]=s.x,A[B+X+5]=s.y,A[B+X+6]=s.z,A[B+X+7]=0),x===!0&&(s.fromBufferAttribute(F,G),A[B+X+8]=s.x,A[B+X+9]=s.y,A[B+X+10]=s.z,A[B+X+11]=F.itemSize===4?s.w:1)}}f={count:u,texture:R,size:new mt(y,T)},i.set(a,f),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let d=0;for(let x=0;x<c.length;x++)d+=c[x];let g=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function hx(n,t,e,i){let s=new WeakMap;function r(l){let c=i.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var Ff=new On,vf=new Ps(1,1),Of=new So,kf=new ol,Bf=new Ro,yf=[],_f=[],Mf=new Float32Array(16),bf=new Float32Array(9),Sf=new Float32Array(4);function Gr(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=yf[s];if(r===void 0&&(r=new Float32Array(s),yf[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function gn(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function xn(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Pc(n,t){let e=_f[t];e===void 0&&(e=new Int32Array(t),_f[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function ux(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function dx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(gn(e,t))return;n.uniform2fv(this.addr,t),xn(e,t)}}function fx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(gn(e,t))return;n.uniform3fv(this.addr,t),xn(e,t)}}function px(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(gn(e,t))return;n.uniform4fv(this.addr,t),xn(e,t)}}function mx(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(gn(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),xn(e,t)}else{if(gn(e,i))return;Sf.set(i),n.uniformMatrix2fv(this.addr,!1,Sf),xn(e,i)}}function gx(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(gn(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),xn(e,t)}else{if(gn(e,i))return;bf.set(i),n.uniformMatrix3fv(this.addr,!1,bf),xn(e,i)}}function xx(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(gn(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),xn(e,t)}else{if(gn(e,i))return;Mf.set(i),n.uniformMatrix4fv(this.addr,!1,Mf),xn(e,i)}}function vx(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function yx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(gn(e,t))return;n.uniform2iv(this.addr,t),xn(e,t)}}function _x(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(gn(e,t))return;n.uniform3iv(this.addr,t),xn(e,t)}}function Mx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(gn(e,t))return;n.uniform4iv(this.addr,t),xn(e,t)}}function bx(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Sx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(gn(e,t))return;n.uniform2uiv(this.addr,t),xn(e,t)}}function wx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(gn(e,t))return;n.uniform3uiv(this.addr,t),xn(e,t)}}function Ex(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(gn(e,t))return;n.uniform4uiv(this.addr,t),xn(e,t)}}function Tx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(vf.compareFunction=su,r=vf):r=Ff,e.setTexture2D(t||r,s)}function Ax(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||kf,s)}function Rx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Bf,s)}function Cx(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Of,s)}function Px(n){switch(n){case 5126:return ux;case 35664:return dx;case 35665:return fx;case 35666:return px;case 35674:return mx;case 35675:return gx;case 35676:return xx;case 5124:case 35670:return vx;case 35667:case 35671:return yx;case 35668:case 35672:return _x;case 35669:case 35673:return Mx;case 5125:return bx;case 36294:return Sx;case 36295:return wx;case 36296:return Ex;case 35678:case 36198:case 36298:case 36306:case 35682:return Tx;case 35679:case 36299:case 36307:return Ax;case 35680:case 36300:case 36308:case 36293:return Rx;case 36289:case 36303:case 36311:case 36292:return Cx}}function Ix(n,t){n.uniform1fv(this.addr,t)}function Dx(n,t){let e=Gr(t,this.size,2);n.uniform2fv(this.addr,e)}function Lx(n,t){let e=Gr(t,this.size,3);n.uniform3fv(this.addr,e)}function Nx(n,t){let e=Gr(t,this.size,4);n.uniform4fv(this.addr,e)}function Ux(n,t){let e=Gr(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Fx(n,t){let e=Gr(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Ox(n,t){let e=Gr(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function kx(n,t){n.uniform1iv(this.addr,t)}function Bx(n,t){n.uniform2iv(this.addr,t)}function zx(n,t){n.uniform3iv(this.addr,t)}function Hx(n,t){n.uniform4iv(this.addr,t)}function Vx(n,t){n.uniform1uiv(this.addr,t)}function Gx(n,t){n.uniform2uiv(this.addr,t)}function Wx(n,t){n.uniform3uiv(this.addr,t)}function Xx(n,t){n.uniform4uiv(this.addr,t)}function qx(n,t,e){let i=this.cache,s=t.length,r=Pc(e,s);gn(i,r)||(n.uniform1iv(this.addr,r),xn(i,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Ff,r[o])}function Yx(n,t,e){let i=this.cache,s=t.length,r=Pc(e,s);gn(i,r)||(n.uniform1iv(this.addr,r),xn(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||kf,r[o])}function Zx(n,t,e){let i=this.cache,s=t.length,r=Pc(e,s);gn(i,r)||(n.uniform1iv(this.addr,r),xn(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Bf,r[o])}function Jx(n,t,e){let i=this.cache,s=t.length,r=Pc(e,s);gn(i,r)||(n.uniform1iv(this.addr,r),xn(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Of,r[o])}function $x(n){switch(n){case 5126:return Ix;case 35664:return Dx;case 35665:return Lx;case 35666:return Nx;case 35674:return Ux;case 35675:return Fx;case 35676:return Ox;case 5124:case 35670:return kx;case 35667:case 35671:return Bx;case 35668:case 35672:return zx;case 35669:case 35673:return Hx;case 5125:return Vx;case 36294:return Gx;case 36295:return Wx;case 36296:return Xx;case 35678:case 36198:case 36298:case 36306:case 35682:return qx;case 35679:case 36299:case 36307:return Yx;case 35680:case 36300:case 36308:case 36293:return Zx;case 36289:case 36303:case 36311:case 36292:return Jx}}var yu=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Px(e.type)}},_u=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=$x(e.type)}},Mu=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],i)}}},vu=/(\w+)(\])?(\[|\.)?/g;function wf(n,t){n.seq.push(t),n.map[t.id]=t}function Kx(n,t,e){let i=n.name,s=i.length;for(vu.lastIndex=0;;){let r=vu.exec(i),o=vu.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){wf(e,c===void 0?new yu(a,n,t):new _u(a,n,t));break}else{let u=e.map[a];u===void 0&&(u=new Mu(a),wf(e,u)),e=u}}}var Hr=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Kx(r,o,this)}}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&i.push(o)}return i}};function Ef(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var jx=37297,Qx=0;function tv(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}var Tf=new ve;function ev(n){Re._getMatrix(Tf,Re.workingColorSpace,n);let t=`mat3( ${Tf.elements.map(e=>e.toFixed(4))} )`;switch(Re.getTransfer(n)){case _o:return[t,"LinearTransferOETF"];case Ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Af(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+tv(n.getShaderSource(t),a)}else return r}function nv(n,t){let e=ev(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function iv(n,t){let e;switch(t){case Fl:e="Linear";break;case Ol:e="Reinhard";break;case kl:e="Cineon";break;case Ur:e="ACESFilmic";break;case zl:e="AgX";break;case Hl:e="Neutral";break;case Bl:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Rc=new O;function sv(){Re.getLuminanceCoefficients(Rc);let n=Rc.x.toFixed(4),t=Rc.y.toFixed(4),e=Rc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rv(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(aa).join(`
`)}function ov(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function av(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function aa(n){return n!==""}function Rf(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Cf(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var lv=/^[ \t]*#include +<([\w\d./]+)>/gm;function bu(n){return n.replace(lv,hv)}var cv=new Map;function hv(n,t){let e=be[t];if(e===void 0){let i=cv.get(t);if(i!==void 0)e=be[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return bu(e)}var uv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pf(n){return n.replace(uv,dv)}function dv(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function If(n){let t=`precision ${n.precision} float;
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
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function fv(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===qh?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Al?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Pi&&(t="SHADOWMAP_TYPE_VSM"),t}function pv(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Hs:case Vs:t="ENVMAP_TYPE_CUBE";break;case ta:t="ENVMAP_TYPE_CUBE_UV";break}return t}function mv(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Vs:t="ENVMAP_MODE_REFRACTION";break}return t}function gv(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Jh:t="ENVMAP_BLENDING_MULTIPLY";break;case Gd:t="ENVMAP_BLENDING_MIX";break;case Wd:t="ENVMAP_BLENDING_ADD";break}return t}function xv(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function vv(n,t,e,i){let s=n.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=fv(e),c=pv(e),h=mv(e),u=gv(e),f=xv(e),d=rv(e),g=ov(r),x=s.createProgram(),m,p,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(aa).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(aa).join(`
`),p.length>0&&(p+=`
`)):(m=[If(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(aa).join(`
`),p=[If(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Zi?"#define TONE_MAPPING":"",e.toneMapping!==Zi?be.tonemapping_pars_fragment:"",e.toneMapping!==Zi?iv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",be.colorspace_pars_fragment,nv("linearToOutputTexel",e.outputColorSpace),sv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(aa).join(`
`)),o=bu(o),o=Rf(o,e),o=Cf(o,e),a=bu(a),a=Rf(a,e),a=Cf(a,e),o=Pf(o),a=Pf(a),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===ru?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ru?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let v=M+m+o,y=M+p+a,T=Ef(s,s.VERTEX_SHADER,v),A=Ef(s,s.FRAGMENT_SHADER,y);s.attachShader(x,T),s.attachShader(x,A),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function R(D){if(n.debug.checkShaderErrors){let N=s.getProgramInfoLog(x)||"",F=s.getShaderInfoLog(T)||"",B=s.getShaderInfoLog(A)||"",G=N.trim(),X=F.trim(),j=B.trim(),Z=!0,J=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(Z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,T,A);else{let ot=Af(s,T,"vertex"),ft=Af(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+G+`
`+ot+`
`+ft)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(X===""||j==="")&&(J=!1);J&&(D.diagnostics={runnable:Z,programLog:G,vertexShader:{log:X,prefix:m},fragmentShader:{log:j,prefix:p}})}s.deleteShader(T),s.deleteShader(A),C=new Hr(s,x),S=av(s,x)}let C;this.getUniforms=function(){return C===void 0&&R(this),C};let S;this.getAttributes=function(){return S===void 0&&R(this),S};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(x,jx)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Qx++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=T,this.fragmentShader=A,this}var yv=0,Su=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(i),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new wu(t),e.set(t,i)),i}},wu=class{constructor(t){this.id=yv++,this.code=t,this.usedTimes=0}};function _v(n,t,e,i,s,r,o){let a=new Eo,l=new Su,c=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,d=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,b,D,N,F){let B=N.fog,G=F.geometry,X=S.isMeshStandardMaterial?N.environment:null,j=(S.isMeshStandardMaterial?e:t).get(S.envMap||X),Z=j&&j.mapping===ta?j.image.height:null,J=g[S.type];S.precision!==null&&(d=s.getMaxPrecision(S.precision),d!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",d,"instead."));let ot=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ft=ot!==void 0?ot.length:0,Lt=0;G.morphAttributes.position!==void 0&&(Lt=1),G.morphAttributes.normal!==void 0&&(Lt=2),G.morphAttributes.color!==void 0&&(Lt=3);let Ut,zt,Ft,Q;if(J){let dt=Ii[J];Ut=dt.vertexShader,zt=dt.fragmentShader}else Ut=S.vertexShader,zt=S.fragmentShader,l.update(S),Ft=l.getVertexShaderID(S),Q=l.getFragmentShaderID(S);let ht=n.getRenderTarget(),wt=n.state.buffers.depth.getReversed(),_t=F.isInstancedMesh===!0,At=F.isBatchedMesh===!0,se=!!S.map,_e=!!S.matcap,I=!!j,H=!!S.aoMap,Y=!!S.lightMap,W=!!S.bumpMap,tt=!!S.normalMap,et=!!S.displacementMap,it=!!S.emissiveMap,at=!!S.metalnessMap,nt=!!S.roughnessMap,rt=S.anisotropy>0,P=S.clearcoat>0,w=S.dispersion>0,U=S.iridescence>0,q=S.sheen>0,k=S.transmission>0,z=rt&&!!S.anisotropyMap,xt=P&&!!S.clearcoatMap,vt=P&&!!S.clearcoatNormalMap,yt=P&&!!S.clearcoatRoughnessMap,gt=U&&!!S.iridescenceMap,Mt=U&&!!S.iridescenceThicknessMap,Nt=q&&!!S.sheenColorMap,oe=q&&!!S.sheenRoughnessMap,Jt=!!S.specularMap,Dt=!!S.specularColorMap,te=!!S.specularIntensityMap,V=k&&!!S.transmissionMap,bt=k&&!!S.thicknessMap,Pt=!!S.gradientMap,Wt=!!S.alphaMap,St=S.alphaTest>0,pt=!!S.alphaHash,Yt=!!S.extensions,ie=Zi;S.toneMapped&&(ht===null||ht.isXRRenderTarget===!0)&&(ie=n.toneMapping);let st={shaderID:J,shaderType:S.type,shaderName:S.name,vertexShader:Ut,fragmentShader:zt,defines:S.defines,customVertexShaderID:Ft,customFragmentShaderID:Q,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:d,batching:At,batchingColor:At&&F._colorsTexture!==null,instancing:_t,instancingColor:_t&&F.instanceColor!==null,instancingMorph:_t&&F.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ht===null?n.outputColorSpace:ht.isXRRenderTarget===!0?ht.texture.colorSpace:Rs,alphaToCoverage:!!S.alphaToCoverage,map:se,matcap:_e,envMap:I,envMapMode:I&&j.mapping,envMapCubeUVHeight:Z,aoMap:H,lightMap:Y,bumpMap:W,normalMap:tt,displacementMap:f&&et,emissiveMap:it,normalMapObjectSpace:tt&&S.normalMapType===Jd,normalMapTangentSpace:tt&&S.normalMapType===Ec,metalnessMap:at,roughnessMap:nt,anisotropy:rt,anisotropyMap:z,clearcoat:P,clearcoatMap:xt,clearcoatNormalMap:vt,clearcoatRoughnessMap:yt,dispersion:w,iridescence:U,iridescenceMap:gt,iridescenceThicknessMap:Mt,sheen:q,sheenColorMap:Nt,sheenRoughnessMap:oe,specularMap:Jt,specularColorMap:Dt,specularIntensityMap:te,transmission:k,transmissionMap:V,thicknessMap:bt,gradientMap:Pt,opaque:S.transparent===!1&&S.blending===Gi&&S.alphaToCoverage===!1,alphaMap:Wt,alphaTest:St,alphaHash:pt,combine:S.combine,mapUv:se&&x(S.map.channel),aoMapUv:H&&x(S.aoMap.channel),lightMapUv:Y&&x(S.lightMap.channel),bumpMapUv:W&&x(S.bumpMap.channel),normalMapUv:tt&&x(S.normalMap.channel),displacementMapUv:et&&x(S.displacementMap.channel),emissiveMapUv:it&&x(S.emissiveMap.channel),metalnessMapUv:at&&x(S.metalnessMap.channel),roughnessMapUv:nt&&x(S.roughnessMap.channel),anisotropyMapUv:z&&x(S.anisotropyMap.channel),clearcoatMapUv:xt&&x(S.clearcoatMap.channel),clearcoatNormalMapUv:vt&&x(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:yt&&x(S.clearcoatRoughnessMap.channel),iridescenceMapUv:gt&&x(S.iridescenceMap.channel),iridescenceThicknessMapUv:Mt&&x(S.iridescenceThicknessMap.channel),sheenColorMapUv:Nt&&x(S.sheenColorMap.channel),sheenRoughnessMapUv:oe&&x(S.sheenRoughnessMap.channel),specularMapUv:Jt&&x(S.specularMap.channel),specularColorMapUv:Dt&&x(S.specularColorMap.channel),specularIntensityMapUv:te&&x(S.specularIntensityMap.channel),transmissionMapUv:V&&x(S.transmissionMap.channel),thicknessMapUv:bt&&x(S.thicknessMap.channel),alphaMapUv:Wt&&x(S.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(tt||rt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!G.attributes.uv&&(se||Wt),fog:!!B,useFog:S.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:wt,skinning:F.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:ft,morphTextureStride:Lt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:ie,decodeVideoTexture:se&&S.map.isVideoTexture===!0&&Re.getTransfer(S.map.colorSpace)===Ne,decodeVideoTextureEmissive:it&&S.emissiveMap.isVideoTexture===!0&&Re.getTransfer(S.emissiveMap.colorSpace)===Ne,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Je,flipSided:S.side===pn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Yt&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Yt&&S.extensions.multiDraw===!0||At)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return st.vertexUv1s=c.has(1),st.vertexUv2s=c.has(2),st.vertexUv3s=c.has(3),c.clear(),st}function p(S){let b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(let D in S.defines)b.push(D),b.push(S.defines[D]);return S.isRawShaderMaterial===!1&&(M(b,S),v(b,S),b.push(n.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function M(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function v(S,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),b.gradientMap&&a.enable(22),S.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),S.push(a.mask)}function y(S){let b=g[S.type],D;if(b){let N=Ii[b];D=zn.clone(N.uniforms)}else D=S.uniforms;return D}function T(S,b){let D;for(let N=0,F=h.length;N<F;N++){let B=h[N];if(B.cacheKey===b){D=B,++D.usedTimes;break}}return D===void 0&&(D=new vv(n,b,S,r),h.push(D)),D}function A(S){if(--S.usedTimes===0){let b=h.indexOf(S);h[b]=h[h.length-1],h.pop(),S.destroy()}}function R(S){l.remove(S)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:T,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:C}}function Mv(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function bv(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Df(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Lf(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(u,f,d,g,x,m){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},n[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=x,p.group=m),t++,p}function a(u,f,d,g,x,m){let p=o(u,f,d,g,x,m);d.transmission>0?i.push(p):d.transparent===!0?s.push(p):e.push(p)}function l(u,f,d,g,x,m){let p=o(u,f,d,g,x,m);d.transmission>0?i.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,f){e.length>1&&e.sort(u||bv),i.length>1&&i.sort(f||Df),s.length>1&&s.sort(f||Df)}function h(){for(let u=t,f=n.length;u<f;u++){let d=n[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function Sv(){let n=new WeakMap;function t(i,s){let r=n.get(i),o;return r===void 0?(o=new Lf,n.set(i,[o])):s>=r.length?(o=new Lf,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function wv(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new O,color:new It};break;case"SpotLight":e={position:new O,direction:new O,color:new It,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new O,color:new It,distance:0,decay:0};break;case"HemisphereLight":e={direction:new O,skyColor:new It,groundColor:new It};break;case"RectAreaLight":e={color:new It,position:new O,halfWidth:new O,halfHeight:new O};break}return n[t.id]=e,e}}}function Ev(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var Tv=0;function Av(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Rv(n){let t=new wv,e=Ev(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new O);let s=new O,r=new ne,o=new ne;function a(c){let h=0,u=0,f=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let d=0,g=0,x=0,m=0,p=0,M=0,v=0,y=0,T=0,A=0,R=0;c.sort(Av);for(let S=0,b=c.length;S<b;S++){let D=c[S],N=D.color,F=D.intensity,B=D.distance,G=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=N.r*F,u+=N.g*F,f+=N.b*F;else if(D.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(D.sh.coefficients[X],F);R++}else if(D.isDirectionalLight){let X=t.get(D);if(X.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let j=D.shadow,Z=e.get(D);Z.shadowIntensity=j.intensity,Z.shadowBias=j.bias,Z.shadowNormalBias=j.normalBias,Z.shadowRadius=j.radius,Z.shadowMapSize=j.mapSize,i.directionalShadow[d]=Z,i.directionalShadowMap[d]=G,i.directionalShadowMatrix[d]=D.shadow.matrix,M++}i.directional[d]=X,d++}else if(D.isSpotLight){let X=t.get(D);X.position.setFromMatrixPosition(D.matrixWorld),X.color.copy(N).multiplyScalar(F),X.distance=B,X.coneCos=Math.cos(D.angle),X.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),X.decay=D.decay,i.spot[x]=X;let j=D.shadow;if(D.map&&(i.spotLightMap[T]=D.map,T++,j.updateMatrices(D),D.castShadow&&A++),i.spotLightMatrix[x]=j.matrix,D.castShadow){let Z=e.get(D);Z.shadowIntensity=j.intensity,Z.shadowBias=j.bias,Z.shadowNormalBias=j.normalBias,Z.shadowRadius=j.radius,Z.shadowMapSize=j.mapSize,i.spotShadow[x]=Z,i.spotShadowMap[x]=G,y++}x++}else if(D.isRectAreaLight){let X=t.get(D);X.color.copy(N).multiplyScalar(F),X.halfWidth.set(D.width*.5,0,0),X.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=X,m++}else if(D.isPointLight){let X=t.get(D);if(X.color.copy(D.color).multiplyScalar(D.intensity),X.distance=D.distance,X.decay=D.decay,D.castShadow){let j=D.shadow,Z=e.get(D);Z.shadowIntensity=j.intensity,Z.shadowBias=j.bias,Z.shadowNormalBias=j.normalBias,Z.shadowRadius=j.radius,Z.shadowMapSize=j.mapSize,Z.shadowCameraNear=j.camera.near,Z.shadowCameraFar=j.camera.far,i.pointShadow[g]=Z,i.pointShadowMap[g]=G,i.pointShadowMatrix[g]=D.shadow.matrix,v++}i.point[g]=X,g++}else if(D.isHemisphereLight){let X=t.get(D);X.skyColor.copy(D.color).multiplyScalar(F),X.groundColor.copy(D.groundColor).multiplyScalar(F),i.hemi[p]=X,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ht.LTC_FLOAT_1,i.rectAreaLTC2=Ht.LTC_FLOAT_2):(i.rectAreaLTC1=Ht.LTC_HALF_1,i.rectAreaLTC2=Ht.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;let C=i.hash;(C.directionalLength!==d||C.pointLength!==g||C.spotLength!==x||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==M||C.numPointShadows!==v||C.numSpotShadows!==y||C.numSpotMaps!==T||C.numLightProbes!==R)&&(i.directional.length=d,i.spot.length=x,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=y+T-A,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=R,C.directionalLength=d,C.pointLength=g,C.spotLength=x,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=M,C.numPointShadows=v,C.numSpotShadows=y,C.numSpotMaps=T,C.numLightProbes=R,i.version=Tv++)}function l(c,h){let u=0,f=0,d=0,g=0,x=0,m=h.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){let v=c[p];if(v.isDirectionalLight){let y=i.directional[u];y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(v.isSpotLight){let y=i.spot[d];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),d++}else if(v.isRectAreaLight){let y=i.rectArea[g];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){let y=i.point[f];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){let y=i.hemi[x];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:i}}function Nf(n){let t=new Rv(n),e=[],i=[];function s(h){c.camera=h,e.length=0,i.length=0}function r(h){e.push(h)}function o(h){i.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}let c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Cv(n){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new Nf(n),t.set(s,[a])):r>=o.length?(a=new Nf(n),o.push(a)):a=o[r],a}function i(){t=new WeakMap}return{get:e,dispose:i}}var Pv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Iv=`uniform sampler2D shadow_pass;
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
}`;function Dv(n,t,e){let i=new Ar,s=new mt,r=new mt,o=new De,a=new pl({depthPacking:Zd}),l=new ml,c={},h=e.maxTextureSize,u={[Vi]:pn,[pn]:Vi,[Je]:Je},f=new me({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new mt},radius:{value:4}},vertexShader:Pv,fragmentShader:Iv}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let g=new Ee;g.setAttribute("position",new Ce(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new jt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qh;let p=this.type;this.render=function(A,R,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let S=n.getRenderTarget(),b=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),N=n.state;N.setBlending(un),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let F=p!==Pi&&this.type===Pi,B=p===Pi&&this.type!==Pi;for(let G=0,X=A.length;G<X;G++){let j=A[G],Z=j.shadow;if(Z===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(Z.autoUpdate===!1&&Z.needsUpdate===!1)continue;s.copy(Z.mapSize);let J=Z.getFrameExtents();if(s.multiply(J),r.copy(Z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/J.x),s.x=r.x*J.x,Z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/J.y),s.y=r.y*J.y,Z.mapSize.y=r.y)),Z.map===null||F===!0||B===!0){let ft=this.type!==Pi?{minFilter:fn,magFilter:fn}:{};Z.map!==null&&Z.map.dispose(),Z.map=new ln(s.x,s.y,ft),Z.map.texture.name=j.name+".shadowMap",Z.camera.updateProjectionMatrix()}n.setRenderTarget(Z.map),n.clear();let ot=Z.getViewportCount();for(let ft=0;ft<ot;ft++){let Lt=Z.getViewport(ft);o.set(r.x*Lt.x,r.y*Lt.y,r.x*Lt.z,r.y*Lt.w),N.viewport(o),Z.updateMatrices(j,ft),i=Z.getFrustum(),y(R,C,Z.camera,j,this.type)}Z.isPointLightShadow!==!0&&this.type===Pi&&M(Z,C),Z.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(S,b,D)};function M(A,R){let C=t.update(x);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ln(s.x,s.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(R,null,C,f,x,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(R,null,C,d,x,null)}function v(A,R,C,S){let b=null,D=C.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(D!==void 0)b=D;else if(b=C.isPointLight===!0?l:a,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let N=b.uuid,F=R.uuid,B=c[N];B===void 0&&(B={},c[N]=B);let G=B[F];G===void 0&&(G=b.clone(),B[F]=G,R.addEventListener("dispose",T)),b=G}if(b.visible=R.visible,b.wireframe=R.wireframe,S===Pi?b.side=R.shadowSide!==null?R.shadowSide:R.side:b.side=R.shadowSide!==null?R.shadowSide:u[R.side],b.alphaMap=R.alphaMap,b.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,b.map=R.map,b.clipShadows=R.clipShadows,b.clippingPlanes=R.clippingPlanes,b.clipIntersection=R.clipIntersection,b.displacementMap=R.displacementMap,b.displacementScale=R.displacementScale,b.displacementBias=R.displacementBias,b.wireframeLinewidth=R.wireframeLinewidth,b.linewidth=R.linewidth,C.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let N=n.properties.get(b);N.light=C}return b}function y(A,R,C,S,b){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&b===Pi)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,A.matrixWorld);let F=t.update(A),B=A.material;if(Array.isArray(B)){let G=F.groups;for(let X=0,j=G.length;X<j;X++){let Z=G[X],J=B[Z.materialIndex];if(J&&J.visible){let ot=v(A,J,S,b);A.onBeforeShadow(n,A,R,C,F,ot,Z),n.renderBufferDirect(C,null,F,ot,A,Z),A.onAfterShadow(n,A,R,C,F,ot,Z)}}}else if(B.visible){let G=v(A,B,S,b);A.onBeforeShadow(n,A,R,C,F,G,null),n.renderBufferDirect(C,null,F,G,A,null),A.onAfterShadow(n,A,R,C,F,G,null)}}let N=A.children;for(let F=0,B=N.length;F<B;F++)y(N[F],R,C,S,b)}function T(A){A.target.removeEventListener("dispose",T);for(let C in c){let S=c[C],b=A.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}var Lv={[Cl]:Pl,[Il]:Nl,[Dl]:Ul,[As]:Ll,[Pl]:Cl,[Nl]:Il,[Ul]:Dl,[Ll]:As};function Nv(n,t){function e(){let V=!1,bt=new De,Pt=null,Wt=new De(0,0,0,0);return{setMask:function(St){Pt!==St&&!V&&(n.colorMask(St,St,St,St),Pt=St)},setLocked:function(St){V=St},setClear:function(St,pt,Yt,ie,st){st===!0&&(St*=ie,pt*=ie,Yt*=ie),bt.set(St,pt,Yt,ie),Wt.equals(bt)===!1&&(n.clearColor(St,pt,Yt,ie),Wt.copy(bt))},reset:function(){V=!1,Pt=null,Wt.set(-1,0,0,0)}}}function i(){let V=!1,bt=!1,Pt=null,Wt=null,St=null;return{setReversed:function(pt){if(bt!==pt){let Yt=t.get("EXT_clip_control");pt?Yt.clipControlEXT(Yt.LOWER_LEFT_EXT,Yt.ZERO_TO_ONE_EXT):Yt.clipControlEXT(Yt.LOWER_LEFT_EXT,Yt.NEGATIVE_ONE_TO_ONE_EXT),bt=pt;let ie=St;St=null,this.setClear(ie)}},getReversed:function(){return bt},setTest:function(pt){pt?ht(n.DEPTH_TEST):wt(n.DEPTH_TEST)},setMask:function(pt){Pt!==pt&&!V&&(n.depthMask(pt),Pt=pt)},setFunc:function(pt){if(bt&&(pt=Lv[pt]),Wt!==pt){switch(pt){case Cl:n.depthFunc(n.NEVER);break;case Pl:n.depthFunc(n.ALWAYS);break;case Il:n.depthFunc(n.LESS);break;case As:n.depthFunc(n.LEQUAL);break;case Dl:n.depthFunc(n.EQUAL);break;case Ll:n.depthFunc(n.GEQUAL);break;case Nl:n.depthFunc(n.GREATER);break;case Ul:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Wt=pt}},setLocked:function(pt){V=pt},setClear:function(pt){St!==pt&&(bt&&(pt=1-pt),n.clearDepth(pt),St=pt)},reset:function(){V=!1,Pt=null,Wt=null,St=null,bt=!1}}}function s(){let V=!1,bt=null,Pt=null,Wt=null,St=null,pt=null,Yt=null,ie=null,st=null;return{setTest:function(dt){V||(dt?ht(n.STENCIL_TEST):wt(n.STENCIL_TEST))},setMask:function(dt){bt!==dt&&!V&&(n.stencilMask(dt),bt=dt)},setFunc:function(dt,lt,Zt){(Pt!==dt||Wt!==lt||St!==Zt)&&(n.stencilFunc(dt,lt,Zt),Pt=dt,Wt=lt,St=Zt)},setOp:function(dt,lt,Zt){(pt!==dt||Yt!==lt||ie!==Zt)&&(n.stencilOp(dt,lt,Zt),pt=dt,Yt=lt,ie=Zt)},setLocked:function(dt){V=dt},setClear:function(dt){st!==dt&&(n.clearStencil(dt),st=dt)},reset:function(){V=!1,bt=null,Pt=null,Wt=null,St=null,pt=null,Yt=null,ie=null,st=null}}}let r=new e,o=new i,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},f=new WeakMap,d=[],g=null,x=!1,m=null,p=null,M=null,v=null,y=null,T=null,A=null,R=new It(0,0,0),C=0,S=!1,b=null,D=null,N=null,F=null,B=null,G=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),X=!1,j=0,Z=n.getParameter(n.VERSION);Z.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(Z)[1]),X=j>=1):Z.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),X=j>=2);let J=null,ot={},ft=n.getParameter(n.SCISSOR_BOX),Lt=n.getParameter(n.VIEWPORT),Ut=new De().fromArray(ft),zt=new De().fromArray(Lt);function Ft(V,bt,Pt,Wt){let St=new Uint8Array(4),pt=n.createTexture();n.bindTexture(V,pt),n.texParameteri(V,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(V,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Yt=0;Yt<Pt;Yt++)V===n.TEXTURE_3D||V===n.TEXTURE_2D_ARRAY?n.texImage3D(bt,0,n.RGBA,1,1,Wt,0,n.RGBA,n.UNSIGNED_BYTE,St):n.texImage2D(bt+Yt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,St);return pt}let Q={};Q[n.TEXTURE_2D]=Ft(n.TEXTURE_2D,n.TEXTURE_2D,1),Q[n.TEXTURE_CUBE_MAP]=Ft(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[n.TEXTURE_2D_ARRAY]=Ft(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Q[n.TEXTURE_3D]=Ft(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ht(n.DEPTH_TEST),o.setFunc(As),W(!1),tt(Xh),ht(n.CULL_FACE),H(un);function ht(V){h[V]!==!0&&(n.enable(V),h[V]=!0)}function wt(V){h[V]!==!1&&(n.disable(V),h[V]=!1)}function _t(V,bt){return u[V]!==bt?(n.bindFramebuffer(V,bt),u[V]=bt,V===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=bt),V===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=bt),!0):!1}function At(V,bt){let Pt=d,Wt=!1;if(V){Pt=f.get(bt),Pt===void 0&&(Pt=[],f.set(bt,Pt));let St=V.textures;if(Pt.length!==St.length||Pt[0]!==n.COLOR_ATTACHMENT0){for(let pt=0,Yt=St.length;pt<Yt;pt++)Pt[pt]=n.COLOR_ATTACHMENT0+pt;Pt.length=St.length,Wt=!0}}else Pt[0]!==n.BACK&&(Pt[0]=n.BACK,Wt=!0);Wt&&n.drawBuffers(Pt)}function se(V){return g!==V?(n.useProgram(V),g=V,!0):!1}let _e={[ei]:n.FUNC_ADD,[Cd]:n.FUNC_SUBTRACT,[Pd]:n.FUNC_REVERSE_SUBTRACT};_e[Id]=n.MIN,_e[Dd]=n.MAX;let I={[zs]:n.ZERO,[Ld]:n.ONE,[Nd]:n.SRC_COLOR,[tl]:n.SRC_ALPHA,[kd]:n.SRC_ALPHA_SATURATE,[Qo]:n.DST_COLOR,[jo]:n.DST_ALPHA,[Ud]:n.ONE_MINUS_SRC_COLOR,[el]:n.ONE_MINUS_SRC_ALPHA,[Od]:n.ONE_MINUS_DST_COLOR,[Fd]:n.ONE_MINUS_DST_ALPHA,[Bd]:n.CONSTANT_COLOR,[zd]:n.ONE_MINUS_CONSTANT_COLOR,[Hd]:n.CONSTANT_ALPHA,[Vd]:n.ONE_MINUS_CONSTANT_ALPHA};function H(V,bt,Pt,Wt,St,pt,Yt,ie,st,dt){if(V===un){x===!0&&(wt(n.BLEND),x=!1);return}if(x===!1&&(ht(n.BLEND),x=!0),V!==Rl){if(V!==m||dt!==S){if((p!==ei||y!==ei)&&(n.blendEquation(n.FUNC_ADD),p=ei,y=ei),dt)switch(V){case Gi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case wn:n.blendFunc(n.ONE,n.ONE);break;case Yh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Zh:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case Gi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case wn:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Yh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Zh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}M=null,v=null,T=null,A=null,R.set(0,0,0),C=0,m=V,S=dt}return}St=St||bt,pt=pt||Pt,Yt=Yt||Wt,(bt!==p||St!==y)&&(n.blendEquationSeparate(_e[bt],_e[St]),p=bt,y=St),(Pt!==M||Wt!==v||pt!==T||Yt!==A)&&(n.blendFuncSeparate(I[Pt],I[Wt],I[pt],I[Yt]),M=Pt,v=Wt,T=pt,A=Yt),(ie.equals(R)===!1||st!==C)&&(n.blendColor(ie.r,ie.g,ie.b,st),R.copy(ie),C=st),m=V,S=!1}function Y(V,bt){V.side===Je?wt(n.CULL_FACE):ht(n.CULL_FACE);let Pt=V.side===pn;bt&&(Pt=!Pt),W(Pt),V.blending===Gi&&V.transparent===!1?H(un):H(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),o.setFunc(V.depthFunc),o.setTest(V.depthTest),o.setMask(V.depthWrite),r.setMask(V.colorWrite);let Wt=V.stencilWrite;a.setTest(Wt),Wt&&(a.setMask(V.stencilWriteMask),a.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),a.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),it(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?ht(n.SAMPLE_ALPHA_TO_COVERAGE):wt(n.SAMPLE_ALPHA_TO_COVERAGE)}function W(V){b!==V&&(V?n.frontFace(n.CW):n.frontFace(n.CCW),b=V)}function tt(V){V!==Ad?(ht(n.CULL_FACE),V!==D&&(V===Xh?n.cullFace(n.BACK):V===Rd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):wt(n.CULL_FACE),D=V}function et(V){V!==N&&(X&&n.lineWidth(V),N=V)}function it(V,bt,Pt){V?(ht(n.POLYGON_OFFSET_FILL),(F!==bt||B!==Pt)&&(n.polygonOffset(bt,Pt),F=bt,B=Pt)):wt(n.POLYGON_OFFSET_FILL)}function at(V){V?ht(n.SCISSOR_TEST):wt(n.SCISSOR_TEST)}function nt(V){V===void 0&&(V=n.TEXTURE0+G-1),J!==V&&(n.activeTexture(V),J=V)}function rt(V,bt,Pt){Pt===void 0&&(J===null?Pt=n.TEXTURE0+G-1:Pt=J);let Wt=ot[Pt];Wt===void 0&&(Wt={type:void 0,texture:void 0},ot[Pt]=Wt),(Wt.type!==V||Wt.texture!==bt)&&(J!==Pt&&(n.activeTexture(Pt),J=Pt),n.bindTexture(V,bt||Q[V]),Wt.type=V,Wt.texture=bt)}function P(){let V=ot[J];V!==void 0&&V.type!==void 0&&(n.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function w(){try{n.compressedTexImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function U(){try{n.compressedTexImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function q(){try{n.texSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function k(){try{n.texSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function z(){try{n.compressedTexSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function xt(){try{n.compressedTexSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function vt(){try{n.texStorage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function yt(){try{n.texStorage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function gt(){try{n.texImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Mt(){try{n.texImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Nt(V){Ut.equals(V)===!1&&(n.scissor(V.x,V.y,V.z,V.w),Ut.copy(V))}function oe(V){zt.equals(V)===!1&&(n.viewport(V.x,V.y,V.z,V.w),zt.copy(V))}function Jt(V,bt){let Pt=c.get(bt);Pt===void 0&&(Pt=new WeakMap,c.set(bt,Pt));let Wt=Pt.get(V);Wt===void 0&&(Wt=n.getUniformBlockIndex(bt,V.name),Pt.set(V,Wt))}function Dt(V,bt){let Wt=c.get(bt).get(V);l.get(bt)!==Wt&&(n.uniformBlockBinding(bt,Wt,V.__bindingPointIndex),l.set(bt,Wt))}function te(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},J=null,ot={},u={},f=new WeakMap,d=[],g=null,x=!1,m=null,p=null,M=null,v=null,y=null,T=null,A=null,R=new It(0,0,0),C=0,S=!1,b=null,D=null,N=null,F=null,B=null,Ut.set(0,0,n.canvas.width,n.canvas.height),zt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ht,disable:wt,bindFramebuffer:_t,drawBuffers:At,useProgram:se,setBlending:H,setMaterial:Y,setFlipSided:W,setCullFace:tt,setLineWidth:et,setPolygonOffset:it,setScissorTest:at,activeTexture:nt,bindTexture:rt,unbindTexture:P,compressedTexImage2D:w,compressedTexImage3D:U,texImage2D:gt,texImage3D:Mt,updateUBOMapping:Jt,uniformBlockBinding:Dt,texStorage2D:vt,texStorage3D:yt,texSubImage2D:q,texSubImage3D:k,compressedTexSubImage2D:z,compressedTexSubImage3D:xt,scissor:Nt,viewport:oe,reset:te}}function Uv(n,t,e,i,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new mt,h=new WeakMap,u,f=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,w){return d?new OffscreenCanvas(P,w):bo("canvas")}function x(P,w,U){let q=1,k=rt(P);if((k.width>U||k.height>U)&&(q=U/Math.max(k.width,k.height)),q<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){let z=Math.floor(q*k.width),xt=Math.floor(q*k.height);u===void 0&&(u=g(z,xt));let vt=w?g(z,xt):u;return vt.width=z,vt.height=xt,vt.getContext("2d").drawImage(P,0,0,z,xt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+k.width+"x"+k.height+") to ("+z+"x"+xt+")."),vt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+k.width+"x"+k.height+")."),P;return P}function m(P){return P.generateMipmaps}function p(P){n.generateMipmap(P)}function M(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(P,w,U,q,k=!1){if(P!==null){if(n[P]!==void 0)return n[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let z=w;if(w===n.RED&&(U===n.FLOAT&&(z=n.R32F),U===n.HALF_FLOAT&&(z=n.R16F),U===n.UNSIGNED_BYTE&&(z=n.R8)),w===n.RED_INTEGER&&(U===n.UNSIGNED_BYTE&&(z=n.R8UI),U===n.UNSIGNED_SHORT&&(z=n.R16UI),U===n.UNSIGNED_INT&&(z=n.R32UI),U===n.BYTE&&(z=n.R8I),U===n.SHORT&&(z=n.R16I),U===n.INT&&(z=n.R32I)),w===n.RG&&(U===n.FLOAT&&(z=n.RG32F),U===n.HALF_FLOAT&&(z=n.RG16F),U===n.UNSIGNED_BYTE&&(z=n.RG8)),w===n.RG_INTEGER&&(U===n.UNSIGNED_BYTE&&(z=n.RG8UI),U===n.UNSIGNED_SHORT&&(z=n.RG16UI),U===n.UNSIGNED_INT&&(z=n.RG32UI),U===n.BYTE&&(z=n.RG8I),U===n.SHORT&&(z=n.RG16I),U===n.INT&&(z=n.RG32I)),w===n.RGB_INTEGER&&(U===n.UNSIGNED_BYTE&&(z=n.RGB8UI),U===n.UNSIGNED_SHORT&&(z=n.RGB16UI),U===n.UNSIGNED_INT&&(z=n.RGB32UI),U===n.BYTE&&(z=n.RGB8I),U===n.SHORT&&(z=n.RGB16I),U===n.INT&&(z=n.RGB32I)),w===n.RGBA_INTEGER&&(U===n.UNSIGNED_BYTE&&(z=n.RGBA8UI),U===n.UNSIGNED_SHORT&&(z=n.RGBA16UI),U===n.UNSIGNED_INT&&(z=n.RGBA32UI),U===n.BYTE&&(z=n.RGBA8I),U===n.SHORT&&(z=n.RGBA16I),U===n.INT&&(z=n.RGBA32I)),w===n.RGB&&(U===n.UNSIGNED_INT_5_9_9_9_REV&&(z=n.RGB9_E5),U===n.UNSIGNED_INT_10F_11F_11F_REV&&(z=n.R11F_G11F_B10F)),w===n.RGBA){let xt=k?_o:Re.getTransfer(q);U===n.FLOAT&&(z=n.RGBA32F),U===n.HALF_FLOAT&&(z=n.RGBA16F),U===n.UNSIGNED_BYTE&&(z=xt===Ne?n.SRGB8_ALPHA8:n.RGBA8),U===n.UNSIGNED_SHORT_4_4_4_4&&(z=n.RGBA4),U===n.UNSIGNED_SHORT_5_5_5_1&&(z=n.RGB5_A1)}return(z===n.R16F||z===n.R32F||z===n.RG16F||z===n.RG32F||z===n.RGBA16F||z===n.RGBA32F)&&t.get("EXT_color_buffer_float"),z}function y(P,w){let U;return P?w===null||w===as||w===ls?U=n.DEPTH24_STENCIL8:w===di?U=n.DEPTH32F_STENCIL8:w===Fr&&(U=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===as||w===ls?U=n.DEPTH_COMPONENT24:w===di?U=n.DEPTH_COMPONENT32F:w===Fr&&(U=n.DEPTH_COMPONENT16),U}function T(P,w){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==fn&&P.minFilter!==Fn?Math.log2(Math.max(w.width,w.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?w.mipmaps.length:1}function A(P){let w=P.target;w.removeEventListener("dispose",A),C(w),w.isVideoTexture&&h.delete(w)}function R(P){let w=P.target;w.removeEventListener("dispose",R),b(w)}function C(P){let w=i.get(P);if(w.__webglInit===void 0)return;let U=P.source,q=f.get(U);if(q){let k=q[w.__cacheKey];k.usedTimes--,k.usedTimes===0&&S(P),Object.keys(q).length===0&&f.delete(U)}i.remove(P)}function S(P){let w=i.get(P);n.deleteTexture(w.__webglTexture);let U=P.source,q=f.get(U);delete q[w.__cacheKey],o.memory.textures--}function b(P){let w=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(w.__webglFramebuffer[q]))for(let k=0;k<w.__webglFramebuffer[q].length;k++)n.deleteFramebuffer(w.__webglFramebuffer[q][k]);else n.deleteFramebuffer(w.__webglFramebuffer[q]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[q])}else{if(Array.isArray(w.__webglFramebuffer))for(let q=0;q<w.__webglFramebuffer.length;q++)n.deleteFramebuffer(w.__webglFramebuffer[q]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let q=0;q<w.__webglColorRenderbuffer.length;q++)w.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[q]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let U=P.textures;for(let q=0,k=U.length;q<k;q++){let z=i.get(U[q]);z.__webglTexture&&(n.deleteTexture(z.__webglTexture),o.memory.textures--),i.remove(U[q])}i.remove(P)}let D=0;function N(){D=0}function F(){let P=D;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),D+=1,P}function B(P){let w=[];return w.push(P.wrapS),w.push(P.wrapT),w.push(P.wrapR||0),w.push(P.magFilter),w.push(P.minFilter),w.push(P.anisotropy),w.push(P.internalFormat),w.push(P.format),w.push(P.type),w.push(P.generateMipmaps),w.push(P.premultiplyAlpha),w.push(P.flipY),w.push(P.unpackAlignment),w.push(P.colorSpace),w.join()}function G(P,w){let U=i.get(P);if(P.isVideoTexture&&at(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&U.__version!==P.version){let q=P.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(U,P,w);return}}else P.isExternalTexture&&(U.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,U.__webglTexture,n.TEXTURE0+w)}function X(P,w){let U=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&U.__version!==P.version){Q(U,P,w);return}e.bindTexture(n.TEXTURE_2D_ARRAY,U.__webglTexture,n.TEXTURE0+w)}function j(P,w){let U=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&U.__version!==P.version){Q(U,P,w);return}e.bindTexture(n.TEXTURE_3D,U.__webglTexture,n.TEXTURE0+w)}function Z(P,w){let U=i.get(P);if(P.version>0&&U.__version!==P.version){ht(U,P,w);return}e.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+w)}let J={[Cn]:n.REPEAT,[ns]:n.CLAMP_TO_EDGE,[nl]:n.MIRRORED_REPEAT},ot={[fn]:n.NEAREST,[qd]:n.NEAREST_MIPMAP_NEAREST,[ea]:n.NEAREST_MIPMAP_LINEAR,[Fn]:n.LINEAR,[Wl]:n.LINEAR_MIPMAP_NEAREST,[ui]:n.LINEAR_MIPMAP_LINEAR},ft={[$d]:n.NEVER,[nf]:n.ALWAYS,[Kd]:n.LESS,[su]:n.LEQUAL,[jd]:n.EQUAL,[ef]:n.GEQUAL,[Qd]:n.GREATER,[tf]:n.NOTEQUAL};function Lt(P,w){if(w.type===di&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===Fn||w.magFilter===Wl||w.magFilter===ea||w.magFilter===ui||w.minFilter===Fn||w.minFilter===Wl||w.minFilter===ea||w.minFilter===ui)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,J[w.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,J[w.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,J[w.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,ot[w.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,ot[w.minFilter]),w.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,ft[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===fn||w.minFilter!==ea&&w.minFilter!==ui||w.type===di&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){let U=t.get("EXT_texture_filter_anisotropic");n.texParameterf(P,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function Ut(P,w){let U=!1;P.__webglInit===void 0&&(P.__webglInit=!0,w.addEventListener("dispose",A));let q=w.source,k=f.get(q);k===void 0&&(k={},f.set(q,k));let z=B(w);if(z!==P.__cacheKey){k[z]===void 0&&(k[z]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,U=!0),k[z].usedTimes++;let xt=k[P.__cacheKey];xt!==void 0&&(k[P.__cacheKey].usedTimes--,xt.usedTimes===0&&S(w)),P.__cacheKey=z,P.__webglTexture=k[z].texture}return U}function zt(P,w,U){return Math.floor(Math.floor(P/U)/w)}function Ft(P,w,U,q){let z=P.updateRanges;if(z.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,w.width,w.height,U,q,w.data);else{z.sort((Mt,Nt)=>Mt.start-Nt.start);let xt=0;for(let Mt=1;Mt<z.length;Mt++){let Nt=z[xt],oe=z[Mt],Jt=Nt.start+Nt.count,Dt=zt(oe.start,w.width,4),te=zt(Nt.start,w.width,4);oe.start<=Jt+1&&Dt===te&&zt(oe.start+oe.count-1,w.width,4)===Dt?Nt.count=Math.max(Nt.count,oe.start+oe.count-Nt.start):(++xt,z[xt]=oe)}z.length=xt+1;let vt=n.getParameter(n.UNPACK_ROW_LENGTH),yt=n.getParameter(n.UNPACK_SKIP_PIXELS),gt=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,w.width);for(let Mt=0,Nt=z.length;Mt<Nt;Mt++){let oe=z[Mt],Jt=Math.floor(oe.start/4),Dt=Math.ceil(oe.count/4),te=Jt%w.width,V=Math.floor(Jt/w.width),bt=Dt,Pt=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,te),n.pixelStorei(n.UNPACK_SKIP_ROWS,V),e.texSubImage2D(n.TEXTURE_2D,0,te,V,bt,Pt,U,q,w.data)}P.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,vt),n.pixelStorei(n.UNPACK_SKIP_PIXELS,yt),n.pixelStorei(n.UNPACK_SKIP_ROWS,gt)}}function Q(P,w,U){let q=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(q=n.TEXTURE_3D);let k=Ut(P,w),z=w.source;e.bindTexture(q,P.__webglTexture,n.TEXTURE0+U);let xt=i.get(z);if(z.version!==xt.__version||k===!0){e.activeTexture(n.TEXTURE0+U);let vt=Re.getPrimaries(Re.workingColorSpace),yt=w.colorSpace===fi?null:Re.getPrimaries(w.colorSpace),gt=w.colorSpace===fi||vt===yt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);let Mt=x(w.image,!1,s.maxTextureSize);Mt=nt(w,Mt);let Nt=r.convert(w.format,w.colorSpace),oe=r.convert(w.type),Jt=v(w.internalFormat,Nt,oe,w.colorSpace,w.isVideoTexture);Lt(q,w);let Dt,te=w.mipmaps,V=w.isVideoTexture!==!0,bt=xt.__version===void 0||k===!0,Pt=z.dataReady,Wt=T(w,Mt);if(w.isDepthTexture)Jt=y(w.format===cs,w.type),bt&&(V?e.texStorage2D(n.TEXTURE_2D,1,Jt,Mt.width,Mt.height):e.texImage2D(n.TEXTURE_2D,0,Jt,Mt.width,Mt.height,0,Nt,oe,null));else if(w.isDataTexture)if(te.length>0){V&&bt&&e.texStorage2D(n.TEXTURE_2D,Wt,Jt,te[0].width,te[0].height);for(let St=0,pt=te.length;St<pt;St++)Dt=te[St],V?Pt&&e.texSubImage2D(n.TEXTURE_2D,St,0,0,Dt.width,Dt.height,Nt,oe,Dt.data):e.texImage2D(n.TEXTURE_2D,St,Jt,Dt.width,Dt.height,0,Nt,oe,Dt.data);w.generateMipmaps=!1}else V?(bt&&e.texStorage2D(n.TEXTURE_2D,Wt,Jt,Mt.width,Mt.height),Pt&&Ft(w,Mt,Nt,oe)):e.texImage2D(n.TEXTURE_2D,0,Jt,Mt.width,Mt.height,0,Nt,oe,Mt.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){V&&bt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Wt,Jt,te[0].width,te[0].height,Mt.depth);for(let St=0,pt=te.length;St<pt;St++)if(Dt=te[St],w.format!==mn)if(Nt!==null)if(V){if(Pt)if(w.layerUpdates.size>0){let Yt=du(Dt.width,Dt.height,w.format,w.type);for(let ie of w.layerUpdates){let st=Dt.data.subarray(ie*Yt/Dt.data.BYTES_PER_ELEMENT,(ie+1)*Yt/Dt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,St,0,0,ie,Dt.width,Dt.height,1,Nt,st)}w.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,St,0,0,0,Dt.width,Dt.height,Mt.depth,Nt,Dt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,St,Jt,Dt.width,Dt.height,Mt.depth,0,Dt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else V?Pt&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,St,0,0,0,Dt.width,Dt.height,Mt.depth,Nt,oe,Dt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,St,Jt,Dt.width,Dt.height,Mt.depth,0,Nt,oe,Dt.data)}else{V&&bt&&e.texStorage2D(n.TEXTURE_2D,Wt,Jt,te[0].width,te[0].height);for(let St=0,pt=te.length;St<pt;St++)Dt=te[St],w.format!==mn?Nt!==null?V?Pt&&e.compressedTexSubImage2D(n.TEXTURE_2D,St,0,0,Dt.width,Dt.height,Nt,Dt.data):e.compressedTexImage2D(n.TEXTURE_2D,St,Jt,Dt.width,Dt.height,0,Dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):V?Pt&&e.texSubImage2D(n.TEXTURE_2D,St,0,0,Dt.width,Dt.height,Nt,oe,Dt.data):e.texImage2D(n.TEXTURE_2D,St,Jt,Dt.width,Dt.height,0,Nt,oe,Dt.data)}else if(w.isDataArrayTexture)if(V){if(bt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Wt,Jt,Mt.width,Mt.height,Mt.depth),Pt)if(w.layerUpdates.size>0){let St=du(Mt.width,Mt.height,w.format,w.type);for(let pt of w.layerUpdates){let Yt=Mt.data.subarray(pt*St/Mt.data.BYTES_PER_ELEMENT,(pt+1)*St/Mt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,pt,Mt.width,Mt.height,1,Nt,oe,Yt)}w.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Mt.width,Mt.height,Mt.depth,Nt,oe,Mt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Jt,Mt.width,Mt.height,Mt.depth,0,Nt,oe,Mt.data);else if(w.isData3DTexture)V?(bt&&e.texStorage3D(n.TEXTURE_3D,Wt,Jt,Mt.width,Mt.height,Mt.depth),Pt&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Mt.width,Mt.height,Mt.depth,Nt,oe,Mt.data)):e.texImage3D(n.TEXTURE_3D,0,Jt,Mt.width,Mt.height,Mt.depth,0,Nt,oe,Mt.data);else if(w.isFramebufferTexture){if(bt)if(V)e.texStorage2D(n.TEXTURE_2D,Wt,Jt,Mt.width,Mt.height);else{let St=Mt.width,pt=Mt.height;for(let Yt=0;Yt<Wt;Yt++)e.texImage2D(n.TEXTURE_2D,Yt,Jt,St,pt,0,Nt,oe,null),St>>=1,pt>>=1}}else if(te.length>0){if(V&&bt){let St=rt(te[0]);e.texStorage2D(n.TEXTURE_2D,Wt,Jt,St.width,St.height)}for(let St=0,pt=te.length;St<pt;St++)Dt=te[St],V?Pt&&e.texSubImage2D(n.TEXTURE_2D,St,0,0,Nt,oe,Dt):e.texImage2D(n.TEXTURE_2D,St,Jt,Nt,oe,Dt);w.generateMipmaps=!1}else if(V){if(bt){let St=rt(Mt);e.texStorage2D(n.TEXTURE_2D,Wt,Jt,St.width,St.height)}Pt&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Nt,oe,Mt)}else e.texImage2D(n.TEXTURE_2D,0,Jt,Nt,oe,Mt);m(w)&&p(q),xt.__version=z.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function ht(P,w,U){if(w.image.length!==6)return;let q=Ut(P,w),k=w.source;e.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+U);let z=i.get(k);if(k.version!==z.__version||q===!0){e.activeTexture(n.TEXTURE0+U);let xt=Re.getPrimaries(Re.workingColorSpace),vt=w.colorSpace===fi?null:Re.getPrimaries(w.colorSpace),yt=w.colorSpace===fi||xt===vt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);let gt=w.isCompressedTexture||w.image[0].isCompressedTexture,Mt=w.image[0]&&w.image[0].isDataTexture,Nt=[];for(let pt=0;pt<6;pt++)!gt&&!Mt?Nt[pt]=x(w.image[pt],!0,s.maxCubemapSize):Nt[pt]=Mt?w.image[pt].image:w.image[pt],Nt[pt]=nt(w,Nt[pt]);let oe=Nt[0],Jt=r.convert(w.format,w.colorSpace),Dt=r.convert(w.type),te=v(w.internalFormat,Jt,Dt,w.colorSpace),V=w.isVideoTexture!==!0,bt=z.__version===void 0||q===!0,Pt=k.dataReady,Wt=T(w,oe);Lt(n.TEXTURE_CUBE_MAP,w);let St;if(gt){V&&bt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Wt,te,oe.width,oe.height);for(let pt=0;pt<6;pt++){St=Nt[pt].mipmaps;for(let Yt=0;Yt<St.length;Yt++){let ie=St[Yt];w.format!==mn?Jt!==null?V?Pt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Yt,0,0,ie.width,ie.height,Jt,ie.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Yt,te,ie.width,ie.height,0,ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?Pt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Yt,0,0,ie.width,ie.height,Jt,Dt,ie.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Yt,te,ie.width,ie.height,0,Jt,Dt,ie.data)}}}else{if(St=w.mipmaps,V&&bt){St.length>0&&Wt++;let pt=rt(Nt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Wt,te,pt.width,pt.height)}for(let pt=0;pt<6;pt++)if(Mt){V?Pt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,0,0,Nt[pt].width,Nt[pt].height,Jt,Dt,Nt[pt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,te,Nt[pt].width,Nt[pt].height,0,Jt,Dt,Nt[pt].data);for(let Yt=0;Yt<St.length;Yt++){let st=St[Yt].image[pt].image;V?Pt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Yt+1,0,0,st.width,st.height,Jt,Dt,st.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Yt+1,te,st.width,st.height,0,Jt,Dt,st.data)}}else{V?Pt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,0,0,Jt,Dt,Nt[pt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,te,Jt,Dt,Nt[pt]);for(let Yt=0;Yt<St.length;Yt++){let ie=St[Yt];V?Pt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Yt+1,0,0,Jt,Dt,ie.image[pt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Yt+1,te,Jt,Dt,ie.image[pt])}}}m(w)&&p(n.TEXTURE_CUBE_MAP),z.__version=k.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function wt(P,w,U,q,k,z){let xt=r.convert(U.format,U.colorSpace),vt=r.convert(U.type),yt=v(U.internalFormat,xt,vt,U.colorSpace),gt=i.get(w),Mt=i.get(U);if(Mt.__renderTarget=w,!gt.__hasExternalTextures){let Nt=Math.max(1,w.width>>z),oe=Math.max(1,w.height>>z);k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY?e.texImage3D(k,z,yt,Nt,oe,w.depth,0,xt,vt,null):e.texImage2D(k,z,yt,Nt,oe,0,xt,vt,null)}e.bindFramebuffer(n.FRAMEBUFFER,P),it(w)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,k,Mt.__webglTexture,0,et(w)):(k===n.TEXTURE_2D||k>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&k<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,k,Mt.__webglTexture,z),e.bindFramebuffer(n.FRAMEBUFFER,null)}function _t(P,w,U){if(n.bindRenderbuffer(n.RENDERBUFFER,P),w.depthBuffer){let q=w.depthTexture,k=q&&q.isDepthTexture?q.type:null,z=y(w.stencilBuffer,k),xt=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,vt=et(w);it(w)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,vt,z,w.width,w.height):U?n.renderbufferStorageMultisample(n.RENDERBUFFER,vt,z,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,z,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,xt,n.RENDERBUFFER,P)}else{let q=w.textures;for(let k=0;k<q.length;k++){let z=q[k],xt=r.convert(z.format,z.colorSpace),vt=r.convert(z.type),yt=v(z.internalFormat,xt,vt,z.colorSpace),gt=et(w);U&&it(w)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,gt,yt,w.width,w.height):it(w)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,gt,yt,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,yt,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function At(P,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,P),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let q=i.get(w.depthTexture);q.__renderTarget=w,(!q.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),G(w.depthTexture,0);let k=q.__webglTexture,z=et(w);if(w.depthTexture.format===_r)it(w)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,k,0,z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,k,0);else if(w.depthTexture.format===cs)it(w)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,k,0,z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,k,0);else throw new Error("Unknown depthTexture format")}function se(P){let w=i.get(P),U=P.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==P.depthTexture){let q=P.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),q){let k=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,q.removeEventListener("dispose",k)};q.addEventListener("dispose",k),w.__depthDisposeCallback=k}w.__boundDepthTexture=q}if(P.depthTexture&&!w.__autoAllocateDepthBuffer){if(U)throw new Error("target.depthTexture not supported in Cube render targets");let q=P.texture.mipmaps;q&&q.length>0?At(w.__webglFramebuffer[0],P):At(w.__webglFramebuffer,P)}else if(U){w.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(e.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[q]),w.__webglDepthbuffer[q]===void 0)w.__webglDepthbuffer[q]=n.createRenderbuffer(),_t(w.__webglDepthbuffer[q],P,!1);else{let k=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,z=w.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,z),n.framebufferRenderbuffer(n.FRAMEBUFFER,k,n.RENDERBUFFER,z)}}else{let q=P.texture.mipmaps;if(q&&q.length>0?e.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=n.createRenderbuffer(),_t(w.__webglDepthbuffer,P,!1);else{let k=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,z=w.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,z),n.framebufferRenderbuffer(n.FRAMEBUFFER,k,n.RENDERBUFFER,z)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function _e(P,w,U){let q=i.get(P);w!==void 0&&wt(q.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),U!==void 0&&se(P)}function I(P){let w=P.texture,U=i.get(P),q=i.get(w);P.addEventListener("dispose",R);let k=P.textures,z=P.isWebGLCubeRenderTarget===!0,xt=k.length>1;if(xt||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=w.version,o.memory.textures++),z){U.__webglFramebuffer=[];for(let vt=0;vt<6;vt++)if(w.mipmaps&&w.mipmaps.length>0){U.__webglFramebuffer[vt]=[];for(let yt=0;yt<w.mipmaps.length;yt++)U.__webglFramebuffer[vt][yt]=n.createFramebuffer()}else U.__webglFramebuffer[vt]=n.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){U.__webglFramebuffer=[];for(let vt=0;vt<w.mipmaps.length;vt++)U.__webglFramebuffer[vt]=n.createFramebuffer()}else U.__webglFramebuffer=n.createFramebuffer();if(xt)for(let vt=0,yt=k.length;vt<yt;vt++){let gt=i.get(k[vt]);gt.__webglTexture===void 0&&(gt.__webglTexture=n.createTexture(),o.memory.textures++)}if(P.samples>0&&it(P)===!1){U.__webglMultisampledFramebuffer=n.createFramebuffer(),U.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let vt=0;vt<k.length;vt++){let yt=k[vt];U.__webglColorRenderbuffer[vt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,U.__webglColorRenderbuffer[vt]);let gt=r.convert(yt.format,yt.colorSpace),Mt=r.convert(yt.type),Nt=v(yt.internalFormat,gt,Mt,yt.colorSpace,P.isXRRenderTarget===!0),oe=et(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,oe,Nt,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+vt,n.RENDERBUFFER,U.__webglColorRenderbuffer[vt])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(U.__webglDepthRenderbuffer=n.createRenderbuffer(),_t(U.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(z){e.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),Lt(n.TEXTURE_CUBE_MAP,w);for(let vt=0;vt<6;vt++)if(w.mipmaps&&w.mipmaps.length>0)for(let yt=0;yt<w.mipmaps.length;yt++)wt(U.__webglFramebuffer[vt][yt],P,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+vt,yt);else wt(U.__webglFramebuffer[vt],P,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0);m(w)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(xt){for(let vt=0,yt=k.length;vt<yt;vt++){let gt=k[vt],Mt=i.get(gt),Nt=n.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Nt=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Nt,Mt.__webglTexture),Lt(Nt,gt),wt(U.__webglFramebuffer,P,gt,n.COLOR_ATTACHMENT0+vt,Nt,0),m(gt)&&p(Nt)}e.unbindTexture()}else{let vt=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(vt=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(vt,q.__webglTexture),Lt(vt,w),w.mipmaps&&w.mipmaps.length>0)for(let yt=0;yt<w.mipmaps.length;yt++)wt(U.__webglFramebuffer[yt],P,w,n.COLOR_ATTACHMENT0,vt,yt);else wt(U.__webglFramebuffer,P,w,n.COLOR_ATTACHMENT0,vt,0);m(w)&&p(vt),e.unbindTexture()}P.depthBuffer&&se(P)}function H(P){let w=P.textures;for(let U=0,q=w.length;U<q;U++){let k=w[U];if(m(k)){let z=M(P),xt=i.get(k).__webglTexture;e.bindTexture(z,xt),p(z),e.unbindTexture()}}}let Y=[],W=[];function tt(P){if(P.samples>0){if(it(P)===!1){let w=P.textures,U=P.width,q=P.height,k=n.COLOR_BUFFER_BIT,z=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,xt=i.get(P),vt=w.length>1;if(vt)for(let gt=0;gt<w.length;gt++)e.bindFramebuffer(n.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,xt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,xt.__webglMultisampledFramebuffer);let yt=P.texture.mipmaps;yt&&yt.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,xt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,xt.__webglFramebuffer);for(let gt=0;gt<w.length;gt++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(k|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(k|=n.STENCIL_BUFFER_BIT)),vt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,xt.__webglColorRenderbuffer[gt]);let Mt=i.get(w[gt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Mt,0)}n.blitFramebuffer(0,0,U,q,0,0,U,q,k,n.NEAREST),l===!0&&(Y.length=0,W.length=0,Y.push(n.COLOR_ATTACHMENT0+gt),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Y.push(z),W.push(z),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,W)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Y))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),vt)for(let gt=0;gt<w.length;gt++){e.bindFramebuffer(n.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.RENDERBUFFER,xt.__webglColorRenderbuffer[gt]);let Mt=i.get(w[gt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,xt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+gt,n.TEXTURE_2D,Mt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,xt.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){let w=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function et(P){return Math.min(s.maxSamples,P.samples)}function it(P){let w=i.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function at(P){let w=o.render.frame;h.get(P)!==w&&(h.set(P,w),P.update())}function nt(P,w){let U=P.colorSpace,q=P.format,k=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||U!==Rs&&U!==fi&&(Re.getTransfer(U)===Ne?(q!==mn||k!==Bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",U)),w}function rt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=N,this.setTexture2D=G,this.setTexture2DArray=X,this.setTexture3D=j,this.setTextureCube=Z,this.rebindTextures=_e,this.setupRenderTarget=I,this.updateRenderTargetMipmap=H,this.updateMultisampleRenderTarget=tt,this.setupDepthRenderbuffer=se,this.setupFrameBufferTexture=wt,this.useMultisampledRTT=it}function Fv(n,t){function e(i,s=fi){let r,o=Re.getTransfer(s);if(i===Bn)return n.UNSIGNED_BYTE;if(i===ql)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Yl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Qh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===tu)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Kh)return n.BYTE;if(i===jh)return n.SHORT;if(i===Fr)return n.UNSIGNED_SHORT;if(i===Xl)return n.INT;if(i===as)return n.UNSIGNED_INT;if(i===di)return n.FLOAT;if(i===Tn)return n.HALF_FLOAT;if(i===eu)return n.ALPHA;if(i===nu)return n.RGB;if(i===mn)return n.RGBA;if(i===_r)return n.DEPTH_COMPONENT;if(i===cs)return n.DEPTH_STENCIL;if(i===Or)return n.RED;if(i===Zl)return n.RED_INTEGER;if(i===iu)return n.RG;if(i===Jl)return n.RG_INTEGER;if(i===$l)return n.RGBA_INTEGER;if(i===na||i===ia||i===sa||i===ra)if(o===Ne)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===na)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ia)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ra)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===na)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ia)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===sa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ra)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Kl||i===jl||i===Ql||i===tc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Kl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===jl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ql)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===tc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ec||i===nc||i===ic)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===ec||i===nc)return o===Ne?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===ic)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===sc||i===rc||i===oc||i===ac||i===lc||i===cc||i===hc||i===uc||i===dc||i===fc||i===pc||i===mc||i===gc||i===xc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===sc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===rc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===oc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ac)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===lc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===cc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===hc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===uc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===dc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===fc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===pc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===mc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===gc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===xc)return o===Ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===vc||i===yc||i===_c)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===vc)return o===Ne?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===yc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===_c)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Mc||i===bc||i===Sc||i===wc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Mc)return r.COMPRESSED_RED_RGTC1_EXT;if(i===bc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Sc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===wc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ls?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}var Ov=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,kv=`
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

}`,Eu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let i=new Do(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new me({vertexShader:Ov,fragmentShader:kv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new jt(new cn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Tu=class extends Wi{constructor(t,e){super();let i=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null,x=typeof XRWebGLBinding<"u",m=new Eu,p={},M=e.getContextAttributes(),v=null,y=null,T=[],A=[],R=new mt,C=null,S=new En;S.viewport=new De;let b=new En;b.viewport=new De;let D=[S,b],N=new Tl,F=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ht=T[Q];return ht===void 0&&(ht=new wr,T[Q]=ht),ht.getTargetRaySpace()},this.getControllerGrip=function(Q){let ht=T[Q];return ht===void 0&&(ht=new wr,T[Q]=ht),ht.getGripSpace()},this.getHand=function(Q){let ht=T[Q];return ht===void 0&&(ht=new wr,T[Q]=ht),ht.getHandSpace()};function G(Q){let ht=A.indexOf(Q.inputSource);if(ht===-1)return;let wt=T[ht];wt!==void 0&&(wt.update(Q.inputSource,Q.frame,c||o),wt.dispatchEvent({type:Q.type,data:Q.inputSource}))}function X(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",j);for(let Q=0;Q<T.length;Q++){let ht=A[Q];ht!==null&&(A[Q]=null,T[Q].disconnect(ht))}F=null,B=null,m.reset();for(let Q in p)delete p[Q];t.setRenderTarget(v),d=null,f=null,u=null,s=null,y=null,Ft.stop(),i.isPresenting=!1,t.setPixelRatio(C),t.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){a=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(v=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",X),s.addEventListener("inputsourceschange",j),M.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(R),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let wt=null,_t=null,At=null;M.depth&&(At=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,wt=M.stencil?cs:_r,_t=M.stencil?ls:as);let se={colorFormat:e.RGBA8,depthFormat:At,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(se),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),y=new ln(f.textureWidth,f.textureHeight,{format:mn,type:Bn,depthTexture:new Ps(f.textureWidth,f.textureHeight,_t,void 0,void 0,void 0,void 0,void 0,void 0,wt),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let wt={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,wt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new ln(d.framebufferWidth,d.framebufferHeight,{format:mn,type:Bn,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ft.setContext(s),Ft.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function j(Q){for(let ht=0;ht<Q.removed.length;ht++){let wt=Q.removed[ht],_t=A.indexOf(wt);_t>=0&&(A[_t]=null,T[_t].disconnect(wt))}for(let ht=0;ht<Q.added.length;ht++){let wt=Q.added[ht],_t=A.indexOf(wt);if(_t===-1){for(let se=0;se<T.length;se++)if(se>=A.length){A.push(wt),_t=se;break}else if(A[se]===null){A[se]=wt,_t=se;break}if(_t===-1)break}let At=T[_t];At&&At.connect(wt)}}let Z=new O,J=new O;function ot(Q,ht,wt){Z.setFromMatrixPosition(ht.matrixWorld),J.setFromMatrixPosition(wt.matrixWorld);let _t=Z.distanceTo(J),At=ht.projectionMatrix.elements,se=wt.projectionMatrix.elements,_e=At[14]/(At[10]-1),I=At[14]/(At[10]+1),H=(At[9]+1)/At[5],Y=(At[9]-1)/At[5],W=(At[8]-1)/At[0],tt=(se[8]+1)/se[0],et=_e*W,it=_e*tt,at=_t/(-W+tt),nt=at*-W;if(ht.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(nt),Q.translateZ(at),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),At[10]===-1)Q.projectionMatrix.copy(ht.projectionMatrix),Q.projectionMatrixInverse.copy(ht.projectionMatrixInverse);else{let rt=_e+at,P=I+at,w=et-nt,U=it+(_t-nt),q=H*I/P*rt,k=Y*I/P*rt;Q.projectionMatrix.makePerspective(w,U,q,k,rt,P),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ft(Q,ht){ht===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ht.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let ht=Q.near,wt=Q.far;m.texture!==null&&(m.depthNear>0&&(ht=m.depthNear),m.depthFar>0&&(wt=m.depthFar)),N.near=b.near=S.near=ht,N.far=b.far=S.far=wt,(F!==N.near||B!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),F=N.near,B=N.far),N.layers.mask=Q.layers.mask|6,S.layers.mask=N.layers.mask&3,b.layers.mask=N.layers.mask&5;let _t=Q.parent,At=N.cameras;ft(N,_t);for(let se=0;se<At.length;se++)ft(At[se],_t);At.length===2?ot(N,S,b):N.projectionMatrix.copy(S.projectionMatrix),Lt(Q,N,_t)};function Lt(Q,ht,wt){wt===null?Q.matrix.copy(ht.matrixWorld):(Q.matrix.copy(wt.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ht.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ht.projectionMatrix),Q.projectionMatrixInverse.copy(ht.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Mr*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(Q){l=Q,f!==null&&(f.fixedFoveation=Q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function(Q){return p[Q]};let Ut=null;function zt(Q,ht){if(h=ht.getViewerPose(c||o),g=ht,h!==null){let wt=h.views;d!==null&&(t.setRenderTargetFramebuffer(y,d.framebuffer),t.setRenderTarget(y));let _t=!1;wt.length!==N.cameras.length&&(N.cameras.length=0,_t=!0);for(let I=0;I<wt.length;I++){let H=wt[I],Y=null;if(d!==null)Y=d.getViewport(H);else{let tt=u.getViewSubImage(f,H);Y=tt.viewport,I===0&&(t.setRenderTargetTextures(y,tt.colorTexture,tt.depthStencilTexture),t.setRenderTarget(y))}let W=D[I];W===void 0&&(W=new En,W.layers.enable(I),W.viewport=new De,D[I]=W),W.matrix.fromArray(H.transform.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale),W.projectionMatrix.fromArray(H.projectionMatrix),W.projectionMatrixInverse.copy(W.projectionMatrix).invert(),W.viewport.set(Y.x,Y.y,Y.width,Y.height),I===0&&(N.matrix.copy(W.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),_t===!0&&N.cameras.push(W)}let At=s.enabledFeatures;if(At&&At.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=i.getBinding();let I=u.getDepthInformation(wt[0]);I&&I.isValid&&I.texture&&m.init(I,s.renderState)}if(At&&At.includes("camera-access")&&x){t.state.unbindTexture(),u=i.getBinding();for(let I=0;I<wt.length;I++){let H=wt[I].camera;if(H){let Y=p[H];Y||(Y=new Do,p[H]=Y);let W=u.getCameraImage(H);Y.sourceTexture=W}}}}for(let wt=0;wt<T.length;wt++){let _t=A[wt],At=T[wt];_t!==null&&At!==void 0&&At.update(_t,ht,c||o)}Ut&&Ut(Q,ht),ht.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ht}),g=null}let Ft=new Uf;Ft.setAnimationLoop(zt),this.setAnimationLoop=function(Q){Ut=Q},this.dispose=function(){}}},Xs=new ni,Bv=new ne;function zv(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,lu(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,M,v,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,M,v):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===pn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===pn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let M=t.get(p),v=M.envMap,y=M.envMapRotation;v&&(m.envMap.value=v,Xs.copy(y),Xs.x*=-1,Xs.y*=-1,Xs.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Xs.y*=-1,Xs.z*=-1),m.envMapRotation.value.setFromMatrix4(Bv.makeRotationFromEuler(Xs)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=v*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===pn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){let M=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Hv(n,t,e,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,v){let y=v.program;i.uniformBlockBinding(M,y)}function c(M,v){let y=s[M.id];y===void 0&&(g(M),y=h(M),s[M.id]=y,M.addEventListener("dispose",m));let T=v.program;i.updateUBOMapping(M,T);let A=t.render.frame;r[M.id]!==A&&(f(M),r[M.id]=A)}function h(M){let v=u();M.__bindingPointIndex=v;let y=n.createBuffer(),T=M.__size,A=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,T,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,y),y}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){let v=s[M.id],y=M.uniforms,T=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let A=0,R=y.length;A<R;A++){let C=Array.isArray(y[A])?y[A]:[y[A]];for(let S=0,b=C.length;S<b;S++){let D=C[S];if(d(D,A,S,T)===!0){let N=D.__offset,F=Array.isArray(D.value)?D.value:[D.value],B=0;for(let G=0;G<F.length;G++){let X=F[G],j=x(X);typeof X=="number"||typeof X=="boolean"?(D.__data[0]=X,n.bufferSubData(n.UNIFORM_BUFFER,N+B,D.__data)):X.isMatrix3?(D.__data[0]=X.elements[0],D.__data[1]=X.elements[1],D.__data[2]=X.elements[2],D.__data[3]=0,D.__data[4]=X.elements[3],D.__data[5]=X.elements[4],D.__data[6]=X.elements[5],D.__data[7]=0,D.__data[8]=X.elements[6],D.__data[9]=X.elements[7],D.__data[10]=X.elements[8],D.__data[11]=0):(X.toArray(D.__data,B),B+=j.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,N,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(M,v,y,T){let A=M.value,R=v+"_"+y;if(T[R]===void 0)return typeof A=="number"||typeof A=="boolean"?T[R]=A:T[R]=A.clone(),!0;{let C=T[R];if(typeof A=="number"||typeof A=="boolean"){if(C!==A)return T[R]=A,!0}else if(C.equals(A)===!1)return C.copy(A),!0}return!1}function g(M){let v=M.uniforms,y=0,T=16;for(let R=0,C=v.length;R<C;R++){let S=Array.isArray(v[R])?v[R]:[v[R]];for(let b=0,D=S.length;b<D;b++){let N=S[b],F=Array.isArray(N.value)?N.value:[N.value];for(let B=0,G=F.length;B<G;B++){let X=F[B],j=x(X),Z=y%T,J=Z%j.boundary,ot=Z+J;y+=J,ot!==0&&T-ot<j.storage&&(y+=T-ot),N.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=y,y+=j.storage}}}let A=y%T;return A>0&&(y+=T-A),M.__size=y,M.__cache={},this}function x(M){let v={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(v.boundary=4,v.storage=4):M.isVector2?(v.boundary=8,v.storage=8):M.isVector3||M.isColor?(v.boundary=16,v.storage=12):M.isVector4?(v.boundary=16,v.storage=16):M.isMatrix3?(v.boundary=48,v.storage=48):M.isMatrix4?(v.boundary=64,v.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),v}function m(M){let v=M.target;v.removeEventListener("dispose",m);let y=o.indexOf(v.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function p(){for(let M in s)n.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}var Cc=class{constructor(t={}){let{canvas:e=sf(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=o;let g=new Uint32Array(4),x=new Int32Array(4),m=null,p=null,M=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Zi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,T=!1;this._outputColorSpace=dn;let A=0,R=0,C=null,S=-1,b=null,D=new De,N=new De,F=null,B=new It(0),G=0,X=e.width,j=e.height,Z=1,J=null,ot=null,ft=new De(0,0,X,j),Lt=new De(0,0,X,j),Ut=!1,zt=new Ar,Ft=!1,Q=!1,ht=new ne,wt=new O,_t=new De,At={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},se=!1;function _e(){return C===null?Z:1}let I=i;function H(L,$){return e.getContext(L,$)}try{let L={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",Pt,!1),e.addEventListener("webglcontextrestored",Wt,!1),e.addEventListener("webglcontextcreationerror",St,!1),I===null){let $="webgl2";if(I=H($,L),I===null)throw H($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(L){throw console.error("THREE.WebGLRenderer: "+L.message),L}let Y,W,tt,et,it,at,nt,rt,P,w,U,q,k,z,xt,vt,yt,gt,Mt,Nt,oe,Jt,Dt,te;function V(){Y=new rx(I),Y.init(),Jt=new Fv(I,Y),W=new j1(I,Y,t,Jt),tt=new Nv(I,Y),W.reversedDepthBuffer&&f&&tt.buffers.depth.setReversed(!0),et=new lx(I),it=new Mv,at=new Uv(I,Y,tt,it,W,Jt,et),nt=new tx(y),rt=new sx(y),P=new pm(I),Dt=new $1(I,P),w=new ox(I,P,et,Dt),U=new hx(I,w,P,et),Mt=new cx(I,W,at),vt=new Q1(it),q=new _v(y,nt,rt,Y,W,Dt,vt),k=new zv(y,it),z=new Sv,xt=new Cv(Y),gt=new J1(y,nt,rt,tt,U,d,l),yt=new Dv(y,U,W),te=new Hv(I,et,W,tt),Nt=new K1(I,Y,et),oe=new ax(I,Y,et),et.programs=q.programs,y.capabilities=W,y.extensions=Y,y.properties=it,y.renderLists=z,y.shadowMap=yt,y.state=tt,y.info=et}V();let bt=new Tu(y,I);this.xr=bt,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let L=Y.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){let L=Y.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(L){L!==void 0&&(Z=L,this.setSize(X,j,!1))},this.getSize=function(L){return L.set(X,j)},this.setSize=function(L,$,ct=!0){if(bt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=L,j=$,e.width=Math.floor(L*Z),e.height=Math.floor($*Z),ct===!0&&(e.style.width=L+"px",e.style.height=$+"px"),this.setViewport(0,0,L,$)},this.getDrawingBufferSize=function(L){return L.set(X*Z,j*Z).floor()},this.setDrawingBufferSize=function(L,$,ct){X=L,j=$,Z=ct,e.width=Math.floor(L*ct),e.height=Math.floor($*ct),this.setViewport(0,0,L,$)},this.getCurrentViewport=function(L){return L.copy(D)},this.getViewport=function(L){return L.copy(ft)},this.setViewport=function(L,$,ct,ut){L.isVector4?ft.set(L.x,L.y,L.z,L.w):ft.set(L,$,ct,ut),tt.viewport(D.copy(ft).multiplyScalar(Z).round())},this.getScissor=function(L){return L.copy(Lt)},this.setScissor=function(L,$,ct,ut){L.isVector4?Lt.set(L.x,L.y,L.z,L.w):Lt.set(L,$,ct,ut),tt.scissor(N.copy(Lt).multiplyScalar(Z).round())},this.getScissorTest=function(){return Ut},this.setScissorTest=function(L){tt.setScissorTest(Ut=L)},this.setOpaqueSort=function(L){J=L},this.setTransparentSort=function(L){ot=L},this.getClearColor=function(L){return L.copy(gt.getClearColor())},this.setClearColor=function(){gt.setClearColor(...arguments)},this.getClearAlpha=function(){return gt.getClearAlpha()},this.setClearAlpha=function(){gt.setClearAlpha(...arguments)},this.clear=function(L=!0,$=!0,ct=!0){let ut=0;if(L){let K=!1;if(C!==null){let Ct=C.texture.format;K=Ct===$l||Ct===Jl||Ct===Zl}if(K){let Ct=C.texture.type,Bt=Ct===Bn||Ct===as||Ct===Fr||Ct===ls||Ct===ql||Ct===Yl,Xt=gt.getClearColor(),Gt=gt.getClearAlpha(),he=Xt.r,de=Xt.g,re=Xt.b;Bt?(g[0]=he,g[1]=de,g[2]=re,g[3]=Gt,I.clearBufferuiv(I.COLOR,0,g)):(x[0]=he,x[1]=de,x[2]=re,x[3]=Gt,I.clearBufferiv(I.COLOR,0,x))}else ut|=I.COLOR_BUFFER_BIT}$&&(ut|=I.DEPTH_BUFFER_BIT),ct&&(ut|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(ut)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Pt,!1),e.removeEventListener("webglcontextrestored",Wt,!1),e.removeEventListener("webglcontextcreationerror",St,!1),gt.dispose(),z.dispose(),xt.dispose(),it.dispose(),nt.dispose(),rt.dispose(),U.dispose(),Dt.dispose(),te.dispose(),q.dispose(),bt.dispose(),bt.removeEventListener("sessionstart",Zt),bt.removeEventListener("sessionend",ge),ee.stop()};function Pt(L){L.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function Wt(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let L=et.autoReset,$=yt.enabled,ct=yt.autoUpdate,ut=yt.needsUpdate,K=yt.type;V(),et.autoReset=L,yt.enabled=$,yt.autoUpdate=ct,yt.needsUpdate=ut,yt.type=K}function St(L){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function pt(L){let $=L.target;$.removeEventListener("dispose",pt),Yt($)}function Yt(L){ie(L),it.remove(L)}function ie(L){let $=it.get(L).programs;$!==void 0&&($.forEach(function(ct){q.releaseProgram(ct)}),L.isShaderMaterial&&q.releaseShaderCache(L))}this.renderBufferDirect=function(L,$,ct,ut,K,Ct){$===null&&($=At);let Bt=K.isMesh&&K.matrixWorld.determinant()<0,Xt=We(L,$,ct,ut,K);tt.setMaterial(ut,Bt);let Gt=ct.index,he=1;if(ut.wireframe===!0){if(Gt=w.getWireframeAttribute(ct),Gt===void 0)return;he=2}let de=ct.drawRange,re=ct.attributes.position,Ae=de.start*he,Be=(de.start+de.count)*he;Ct!==null&&(Ae=Math.max(Ae,Ct.start*he),Be=Math.min(Be,(Ct.start+Ct.count)*he)),Gt!==null?(Ae=Math.max(Ae,0),Be=Math.min(Be,Gt.count)):re!=null&&(Ae=Math.max(Ae,0),Be=Math.min(Be,re.count));let nn=Be-Ae;if(nn<0||nn===1/0)return;Dt.setup(K,ut,Xt,ct,Gt);let Ye,Ve=Nt;if(Gt!==null&&(Ye=P.get(Gt),Ve=oe,Ve.setIndex(Ye)),K.isMesh)ut.wireframe===!0?(tt.setLineWidth(ut.wireframeLinewidth*_e()),Ve.setMode(I.LINES)):Ve.setMode(I.TRIANGLES);else if(K.isLine){let ue=ut.linewidth;ue===void 0&&(ue=1),tt.setLineWidth(ue*_e()),K.isLineSegments?Ve.setMode(I.LINES):K.isLineLoop?Ve.setMode(I.LINE_LOOP):Ve.setMode(I.LINE_STRIP)}else K.isPoints?Ve.setMode(I.POINTS):K.isSprite&&Ve.setMode(I.TRIANGLES);if(K.isBatchedMesh)if(K._multiDrawInstances!==null)br("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ve.renderMultiDrawInstances(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount,K._multiDrawInstances);else if(Y.get("WEBGL_multi_draw"))Ve.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{let ue=K._multiDrawStarts,Qe=K._multiDrawCounts,Ie=K._multiDrawCount,Kn=Gt?P.get(Gt).bytesPerElement:1,sr=it.get(ut).currentProgram.getUniforms();for(let jn=0;jn<Ie;jn++)sr.setValue(I,"_gl_DrawID",jn),Ve.render(ue[jn]/Kn,Qe[jn])}else if(K.isInstancedMesh)Ve.renderInstances(Ae,nn,K.count);else if(ct.isInstancedBufferGeometry){let ue=ct._maxInstanceCount!==void 0?ct._maxInstanceCount:1/0,Qe=Math.min(ct.instanceCount,ue);Ve.renderInstances(Ae,nn,Qe)}else Ve.render(Ae,nn)};function st(L,$,ct){L.transparent===!0&&L.side===Je&&L.forceSinglePass===!1?(L.side=pn,L.needsUpdate=!0,ae(L,$,ct),L.side=Vi,L.needsUpdate=!0,ae(L,$,ct),L.side=Je):ae(L,$,ct)}this.compile=function(L,$,ct=null){ct===null&&(ct=L),p=xt.get(ct),p.init($),v.push(p),ct.traverseVisible(function(K){K.isLight&&K.layers.test($.layers)&&(p.pushLight(K),K.castShadow&&p.pushShadow(K))}),L!==ct&&L.traverseVisible(function(K){K.isLight&&K.layers.test($.layers)&&(p.pushLight(K),K.castShadow&&p.pushShadow(K))}),p.setupLights();let ut=new Set;return L.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;let Ct=K.material;if(Ct)if(Array.isArray(Ct))for(let Bt=0;Bt<Ct.length;Bt++){let Xt=Ct[Bt];st(Xt,ct,K),ut.add(Xt)}else st(Ct,ct,K),ut.add(Ct)}),p=v.pop(),ut},this.compileAsync=function(L,$,ct=null){let ut=this.compile(L,$,ct);return new Promise(K=>{function Ct(){if(ut.forEach(function(Bt){it.get(Bt).currentProgram.isReady()&&ut.delete(Bt)}),ut.size===0){K(L);return}setTimeout(Ct,10)}Y.get("KHR_parallel_shader_compile")!==null?Ct():setTimeout(Ct,10)})};let dt=null;function lt(L){dt&&dt(L)}function Zt(){ee.stop()}function ge(){ee.start()}let ee=new Uf;ee.setAnimationLoop(lt),typeof self<"u"&&ee.setContext(self),this.setAnimationLoop=function(L){dt=L,bt.setAnimationLoop(L),L===null?ee.stop():ee.start()},bt.addEventListener("sessionstart",Zt),bt.addEventListener("sessionend",ge),this.render=function(L,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),bt.enabled===!0&&bt.isPresenting===!0&&(bt.cameraAutoUpdate===!0&&bt.updateCamera($),$=bt.getCamera()),L.isScene===!0&&L.onBeforeRender(y,L,$,C),p=xt.get(L,v.length),p.init($),v.push(p),ht.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),zt.setFromProjectionMatrix(ht,yi,$.reversedDepth),Q=this.localClippingEnabled,Ft=vt.init(this.clippingPlanes,Q),m=z.get(L,M.length),m.init(),M.push(m),bt.enabled===!0&&bt.isPresenting===!0){let Ct=y.xr.getDepthSensingMesh();Ct!==null&&kt(Ct,$,-1/0,y.sortObjects)}kt(L,$,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(J,ot),se=bt.enabled===!1||bt.isPresenting===!1||bt.hasDepthSensing()===!1,se&&gt.addToRenderList(m,L),this.info.render.frame++,Ft===!0&&vt.beginShadows();let ct=p.state.shadowsArray;yt.render(ct,L,$),Ft===!0&&vt.endShadows(),this.info.autoReset===!0&&this.info.reset();let ut=m.opaque,K=m.transmissive;if(p.setupLights(),$.isArrayCamera){let Ct=$.cameras;if(K.length>0)for(let Bt=0,Xt=Ct.length;Bt<Xt;Bt++){let Gt=Ct[Bt];$t(ut,K,L,Gt)}se&&gt.render(L);for(let Bt=0,Xt=Ct.length;Bt<Xt;Bt++){let Gt=Ct[Bt];Te(m,L,Gt,Gt.viewport)}}else K.length>0&&$t(ut,K,L,$),se&&gt.render(L),Te(m,L,$);C!==null&&R===0&&(at.updateMultisampleRenderTarget(C),at.updateRenderTargetMipmap(C)),L.isScene===!0&&L.onAfterRender(y,L,$),Dt.resetDefaultState(),S=-1,b=null,v.pop(),v.length>0?(p=v[v.length-1],Ft===!0&&vt.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function kt(L,$,ct,ut){if(L.visible===!1)return;if(L.layers.test($.layers)){if(L.isGroup)ct=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update($);else if(L.isLight)p.pushLight(L),L.castShadow&&p.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||zt.intersectsSprite(L)){ut&&_t.setFromMatrixPosition(L.matrixWorld).applyMatrix4(ht);let Bt=U.update(L),Xt=L.material;Xt.visible&&m.push(L,Bt,Xt,ct,_t.z,null)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||zt.intersectsObject(L))){let Bt=U.update(L),Xt=L.material;if(ut&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),_t.copy(L.boundingSphere.center)):(Bt.boundingSphere===null&&Bt.computeBoundingSphere(),_t.copy(Bt.boundingSphere.center)),_t.applyMatrix4(L.matrixWorld).applyMatrix4(ht)),Array.isArray(Xt)){let Gt=Bt.groups;for(let he=0,de=Gt.length;he<de;he++){let re=Gt[he],Ae=Xt[re.materialIndex];Ae&&Ae.visible&&m.push(L,Bt,Ae,ct,_t.z,re)}}else Xt.visible&&m.push(L,Bt,Xt,ct,_t.z,null)}}let Ct=L.children;for(let Bt=0,Xt=Ct.length;Bt<Xt;Bt++)kt(Ct[Bt],$,ct,ut)}function Te(L,$,ct,ut){let K=L.opaque,Ct=L.transmissive,Bt=L.transparent;p.setupLightsView(ct),Ft===!0&&vt.setGlobalState(y.clippingPlanes,ct),ut&&tt.viewport(D.copy(ut)),K.length>0&&qt(K,$,ct),Ct.length>0&&qt(Ct,$,ct),Bt.length>0&&qt(Bt,$,ct),tt.buffers.depth.setTest(!0),tt.buffers.depth.setMask(!0),tt.buffers.color.setMask(!0),tt.setPolygonOffset(!1)}function $t(L,$,ct,ut){if((ct.isScene===!0?ct.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[ut.id]===void 0&&(p.state.transmissionRenderTarget[ut.id]=new ln(1,1,{generateMipmaps:!0,type:Y.has("EXT_color_buffer_half_float")||Y.has("EXT_color_buffer_float")?Tn:Bn,minFilter:ui,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Re.workingColorSpace}));let Ct=p.state.transmissionRenderTarget[ut.id],Bt=ut.viewport||D;Ct.setSize(Bt.z*y.transmissionResolutionScale,Bt.w*y.transmissionResolutionScale);let Xt=y.getRenderTarget(),Gt=y.getActiveCubeFace(),he=y.getActiveMipmapLevel();y.setRenderTarget(Ct),y.getClearColor(B),G=y.getClearAlpha(),G<1&&y.setClearColor(16777215,.5),y.clear(),se&&gt.render(ct);let de=y.toneMapping;y.toneMapping=Zi;let re=ut.viewport;if(ut.viewport!==void 0&&(ut.viewport=void 0),p.setupLightsView(ut),Ft===!0&&vt.setGlobalState(y.clippingPlanes,ut),qt(L,ct,ut),at.updateMultisampleRenderTarget(Ct),at.updateRenderTargetMipmap(Ct),Y.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let Be=0,nn=$.length;Be<nn;Be++){let Ye=$[Be],Ve=Ye.object,ue=Ye.geometry,Qe=Ye.material,Ie=Ye.group;if(Qe.side===Je&&Ve.layers.test(ut.layers)){let Kn=Qe.side;Qe.side=pn,Qe.needsUpdate=!0,Rt(Ve,ct,ut,ue,Qe,Ie),Qe.side=Kn,Qe.needsUpdate=!0,Ae=!0}}Ae===!0&&(at.updateMultisampleRenderTarget(Ct),at.updateRenderTargetMipmap(Ct))}y.setRenderTarget(Xt,Gt,he),y.setClearColor(B,G),re!==void 0&&(ut.viewport=re),y.toneMapping=de}function qt(L,$,ct){let ut=$.isScene===!0?$.overrideMaterial:null;for(let K=0,Ct=L.length;K<Ct;K++){let Bt=L[K],Xt=Bt.object,Gt=Bt.geometry,he=Bt.group,de=Bt.material;de.allowOverride===!0&&ut!==null&&(de=ut),Xt.layers.test(ct.layers)&&Rt(Xt,$,ct,Gt,de,he)}}function Rt(L,$,ct,ut,K,Ct){L.onBeforeRender(y,$,ct,ut,K,Ct),L.modelViewMatrix.multiplyMatrices(ct.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),K.onBeforeRender(y,$,ct,ut,L,Ct),K.transparent===!0&&K.side===Je&&K.forceSinglePass===!1?(K.side=pn,K.needsUpdate=!0,y.renderBufferDirect(ct,$,ut,K,L,Ct),K.side=Vi,K.needsUpdate=!0,y.renderBufferDirect(ct,$,ut,K,L,Ct),K.side=Je):y.renderBufferDirect(ct,$,ut,K,L,Ct),L.onAfterRender(y,$,ct,ut,K,Ct)}function ae(L,$,ct){$.isScene!==!0&&($=At);let ut=it.get(L),K=p.state.lights,Ct=p.state.shadowsArray,Bt=K.state.version,Xt=q.getParameters(L,K.state,Ct,$,ct),Gt=q.getProgramCacheKey(Xt),he=ut.programs;ut.environment=L.isMeshStandardMaterial?$.environment:null,ut.fog=$.fog,ut.envMap=(L.isMeshStandardMaterial?rt:nt).get(L.envMap||ut.environment),ut.envMapRotation=ut.environment!==null&&L.envMap===null?$.environmentRotation:L.envMapRotation,he===void 0&&(L.addEventListener("dispose",pt),he=new Map,ut.programs=he);let de=he.get(Gt);if(de!==void 0){if(ut.currentProgram===de&&ut.lightsStateVersion===Bt)return He(L,Xt),de}else Xt.uniforms=q.getUniforms(L),L.onBeforeCompile(Xt,y),de=q.acquireProgram(Xt,Gt),he.set(Gt,de),ut.uniforms=Xt.uniforms;let re=ut.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(re.clippingPlanes=vt.uniform),He(L,Xt),ut.needsLights=nr(L),ut.lightsStateVersion=Bt,ut.needsLights&&(re.ambientLightColor.value=K.state.ambient,re.lightProbe.value=K.state.probe,re.directionalLights.value=K.state.directional,re.directionalLightShadows.value=K.state.directionalShadow,re.spotLights.value=K.state.spot,re.spotLightShadows.value=K.state.spotShadow,re.rectAreaLights.value=K.state.rectArea,re.ltc_1.value=K.state.rectAreaLTC1,re.ltc_2.value=K.state.rectAreaLTC2,re.pointLights.value=K.state.point,re.pointLightShadows.value=K.state.pointShadow,re.hemisphereLights.value=K.state.hemi,re.directionalShadowMap.value=K.state.directionalShadowMap,re.directionalShadowMatrix.value=K.state.directionalShadowMatrix,re.spotShadowMap.value=K.state.spotShadowMap,re.spotLightMatrix.value=K.state.spotLightMatrix,re.spotLightMap.value=K.state.spotLightMap,re.pointShadowMap.value=K.state.pointShadowMap,re.pointShadowMatrix.value=K.state.pointShadowMatrix),ut.currentProgram=de,ut.uniformsList=null,de}function Ke(L){if(L.uniformsList===null){let $=L.currentProgram.getUniforms();L.uniformsList=Hr.seqWithValue($.seq,L.uniforms)}return L.uniformsList}function He(L,$){let ct=it.get(L);ct.outputColorSpace=$.outputColorSpace,ct.batching=$.batching,ct.batchingColor=$.batchingColor,ct.instancing=$.instancing,ct.instancingColor=$.instancingColor,ct.instancingMorph=$.instancingMorph,ct.skinning=$.skinning,ct.morphTargets=$.morphTargets,ct.morphNormals=$.morphNormals,ct.morphColors=$.morphColors,ct.morphTargetsCount=$.morphTargetsCount,ct.numClippingPlanes=$.numClippingPlanes,ct.numIntersection=$.numClipIntersection,ct.vertexAlphas=$.vertexAlphas,ct.vertexTangents=$.vertexTangents,ct.toneMapping=$.toneMapping}function We(L,$,ct,ut,K){$.isScene!==!0&&($=At),at.resetTextureUnits();let Ct=$.fog,Bt=ut.isMeshStandardMaterial?$.environment:null,Xt=C===null?y.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Rs,Gt=(ut.isMeshStandardMaterial?rt:nt).get(ut.envMap||Bt),he=ut.vertexColors===!0&&!!ct.attributes.color&&ct.attributes.color.itemSize===4,de=!!ct.attributes.tangent&&(!!ut.normalMap||ut.anisotropy>0),re=!!ct.morphAttributes.position,Ae=!!ct.morphAttributes.normal,Be=!!ct.morphAttributes.color,nn=Zi;ut.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(nn=y.toneMapping);let Ye=ct.morphAttributes.position||ct.morphAttributes.normal||ct.morphAttributes.color,Ve=Ye!==void 0?Ye.length:0,ue=it.get(ut),Qe=p.state.lights;if(Ft===!0&&(Q===!0||L!==b)){let Nn=L===b&&ut.id===S;vt.setState(ut,L,Nn)}let Ie=!1;ut.version===ue.__version?(ue.needsLights&&ue.lightsStateVersion!==Qe.state.version||ue.outputColorSpace!==Xt||K.isBatchedMesh&&ue.batching===!1||!K.isBatchedMesh&&ue.batching===!0||K.isBatchedMesh&&ue.batchingColor===!0&&K.colorTexture===null||K.isBatchedMesh&&ue.batchingColor===!1&&K.colorTexture!==null||K.isInstancedMesh&&ue.instancing===!1||!K.isInstancedMesh&&ue.instancing===!0||K.isSkinnedMesh&&ue.skinning===!1||!K.isSkinnedMesh&&ue.skinning===!0||K.isInstancedMesh&&ue.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&ue.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&ue.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&ue.instancingMorph===!1&&K.morphTexture!==null||ue.envMap!==Gt||ut.fog===!0&&ue.fog!==Ct||ue.numClippingPlanes!==void 0&&(ue.numClippingPlanes!==vt.numPlanes||ue.numIntersection!==vt.numIntersection)||ue.vertexAlphas!==he||ue.vertexTangents!==de||ue.morphTargets!==re||ue.morphNormals!==Ae||ue.morphColors!==Be||ue.toneMapping!==nn||ue.morphTargetsCount!==Ve)&&(Ie=!0):(Ie=!0,ue.__version=ut.version);let Kn=ue.currentProgram;Ie===!0&&(Kn=ae(ut,$,K));let sr=!1,jn=!1,ro=!1,tn=Kn.getUniforms(),li=ue.uniforms;if(tt.useProgram(Kn.program)&&(sr=!0,jn=!0,ro=!0),ut.id!==S&&(S=ut.id,jn=!0),sr||b!==L){tt.buffers.depth.getReversed()&&L.reversedDepth!==!0&&(L._reversedDepth=!0,L.updateProjectionMatrix()),tn.setValue(I,"projectionMatrix",L.projectionMatrix),tn.setValue(I,"viewMatrix",L.matrixWorldInverse);let Wn=tn.map.cameraPosition;Wn!==void 0&&Wn.setValue(I,wt.setFromMatrixPosition(L.matrixWorld)),W.logarithmicDepthBuffer&&tn.setValue(I,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(ut.isMeshPhongMaterial||ut.isMeshToonMaterial||ut.isMeshLambertMaterial||ut.isMeshBasicMaterial||ut.isMeshStandardMaterial||ut.isShaderMaterial)&&tn.setValue(I,"isOrthographic",L.isOrthographicCamera===!0),b!==L&&(b=L,jn=!0,ro=!0)}if(K.isSkinnedMesh){tn.setOptional(I,K,"bindMatrix"),tn.setOptional(I,K,"bindMatrixInverse");let Nn=K.skeleton;Nn&&(Nn.boneTexture===null&&Nn.computeBoneTexture(),tn.setValue(I,"boneTexture",Nn.boneTexture,at))}K.isBatchedMesh&&(tn.setOptional(I,K,"batchingTexture"),tn.setValue(I,"batchingTexture",K._matricesTexture,at),tn.setOptional(I,K,"batchingIdTexture"),tn.setValue(I,"batchingIdTexture",K._indirectTexture,at),tn.setOptional(I,K,"batchingColorTexture"),K._colorsTexture!==null&&tn.setValue(I,"batchingColorTexture",K._colorsTexture,at));let ci=ct.morphAttributes;if((ci.position!==void 0||ci.normal!==void 0||ci.color!==void 0)&&Mt.update(K,ct,Kn),(jn||ue.receiveShadow!==K.receiveShadow)&&(ue.receiveShadow=K.receiveShadow,tn.setValue(I,"receiveShadow",K.receiveShadow)),ut.isMeshGouraudMaterial&&ut.envMap!==null&&(li.envMap.value=Gt,li.flipEnvMap.value=Gt.isCubeTexture&&Gt.isRenderTargetTexture===!1?-1:1),ut.isMeshStandardMaterial&&ut.envMap===null&&$.environment!==null&&(li.envMapIntensity.value=$.environmentIntensity),jn&&(tn.setValue(I,"toneMappingExposure",y.toneMappingExposure),ue.needsLights&&$n(li,ro),Ct&&ut.fog===!0&&k.refreshFogUniforms(li,Ct),k.refreshMaterialUniforms(li,ut,Z,j,p.state.transmissionRenderTarget[L.id]),Hr.upload(I,Ke(ue),li,at)),ut.isShaderMaterial&&ut.uniformsNeedUpdate===!0&&(Hr.upload(I,Ke(ue),li,at),ut.uniformsNeedUpdate=!1),ut.isSpriteMaterial&&tn.setValue(I,"center",K.center),tn.setValue(I,"modelViewMatrix",K.modelViewMatrix),tn.setValue(I,"normalMatrix",K.normalMatrix),tn.setValue(I,"modelMatrix",K.matrixWorld),ut.isShaderMaterial||ut.isRawShaderMaterial){let Nn=ut.uniformsGroups;for(let Wn=0,sh=Nn.length;Wn<sh;Wn++){let Ms=Nn[Wn];te.update(Ms,Kn),te.bind(Ms,Kn)}}return Kn}function $n(L,$){L.ambientLightColor.needsUpdate=$,L.lightProbe.needsUpdate=$,L.directionalLights.needsUpdate=$,L.directionalLightShadows.needsUpdate=$,L.pointLights.needsUpdate=$,L.pointLightShadows.needsUpdate=$,L.spotLights.needsUpdate=$,L.spotLightShadows.needsUpdate=$,L.rectAreaLights.needsUpdate=$,L.hemisphereLights.needsUpdate=$}function nr(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(L,$,ct){let ut=it.get(L);ut.__autoAllocateDepthBuffer=L.resolveDepthBuffer===!1,ut.__autoAllocateDepthBuffer===!1&&(ut.__useRenderToTexture=!1),it.get(L.texture).__webglTexture=$,it.get(L.depthTexture).__webglTexture=ut.__autoAllocateDepthBuffer?void 0:ct,ut.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(L,$){let ct=it.get(L);ct.__webglFramebuffer=$,ct.__useDefaultFramebuffer=$===void 0};let ir=I.createFramebuffer();this.setRenderTarget=function(L,$=0,ct=0){C=L,A=$,R=ct;let ut=!0,K=null,Ct=!1,Bt=!1;if(L){let Gt=it.get(L);if(Gt.__useDefaultFramebuffer!==void 0)tt.bindFramebuffer(I.FRAMEBUFFER,null),ut=!1;else if(Gt.__webglFramebuffer===void 0)at.setupRenderTarget(L);else if(Gt.__hasExternalTextures)at.rebindTextures(L,it.get(L.texture).__webglTexture,it.get(L.depthTexture).__webglTexture);else if(L.depthBuffer){let re=L.depthTexture;if(Gt.__boundDepthTexture!==re){if(re!==null&&it.has(re)&&(L.width!==re.image.width||L.height!==re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");at.setupDepthRenderbuffer(L)}}let he=L.texture;(he.isData3DTexture||he.isDataArrayTexture||he.isCompressedArrayTexture)&&(Bt=!0);let de=it.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray(de[$])?K=de[$][ct]:K=de[$],Ct=!0):L.samples>0&&at.useMultisampledRTT(L)===!1?K=it.get(L).__webglMultisampledFramebuffer:Array.isArray(de)?K=de[ct]:K=de,D.copy(L.viewport),N.copy(L.scissor),F=L.scissorTest}else D.copy(ft).multiplyScalar(Z).floor(),N.copy(Lt).multiplyScalar(Z).floor(),F=Ut;if(ct!==0&&(K=ir),tt.bindFramebuffer(I.FRAMEBUFFER,K)&&ut&&tt.drawBuffers(L,K),tt.viewport(D),tt.scissor(N),tt.setScissorTest(F),Ct){let Gt=it.get(L.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+$,Gt.__webglTexture,ct)}else if(Bt){let Gt=$;for(let he=0;he<L.textures.length;he++){let de=it.get(L.textures[he]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+he,de.__webglTexture,ct,Gt)}}else if(L!==null&&ct!==0){let Gt=it.get(L.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Gt.__webglTexture,ct)}S=-1},this.readRenderTargetPixels=function(L,$,ct,ut,K,Ct,Bt,Xt=0){if(!(L&&L.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Gt=it.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&Bt!==void 0&&(Gt=Gt[Bt]),Gt){tt.bindFramebuffer(I.FRAMEBUFFER,Gt);try{let he=L.textures[Xt],de=he.format,re=he.type;if(!W.textureFormatReadable(de)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!W.textureTypeReadable(re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=L.width-ut&&ct>=0&&ct<=L.height-K&&(L.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Xt),I.readPixels($,ct,ut,K,Jt.convert(de),Jt.convert(re),Ct))}finally{let he=C!==null?it.get(C).__webglFramebuffer:null;tt.bindFramebuffer(I.FRAMEBUFFER,he)}}},this.readRenderTargetPixelsAsync=async function(L,$,ct,ut,K,Ct,Bt,Xt=0){if(!(L&&L.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Gt=it.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&Bt!==void 0&&(Gt=Gt[Bt]),Gt)if($>=0&&$<=L.width-ut&&ct>=0&&ct<=L.height-K){tt.bindFramebuffer(I.FRAMEBUFFER,Gt);let he=L.textures[Xt],de=he.format,re=he.type;if(!W.textureFormatReadable(de))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!W.textureTypeReadable(re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ae=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Ae),I.bufferData(I.PIXEL_PACK_BUFFER,Ct.byteLength,I.STREAM_READ),L.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Xt),I.readPixels($,ct,ut,K,Jt.convert(de),Jt.convert(re),0);let Be=C!==null?it.get(C).__webglFramebuffer:null;tt.bindFramebuffer(I.FRAMEBUFFER,Be);let nn=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await rf(I,nn,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Ae),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,Ct),I.deleteBuffer(Ae),I.deleteSync(nn),Ct}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(L,$=null,ct=0){let ut=Math.pow(2,-ct),K=Math.floor(L.image.width*ut),Ct=Math.floor(L.image.height*ut),Bt=$!==null?$.x:0,Xt=$!==null?$.y:0;at.setTexture2D(L,0),I.copyTexSubImage2D(I.TEXTURE_2D,ct,0,0,Bt,Xt,K,Ct),tt.unbindTexture()};let so=I.createFramebuffer(),Ca=I.createFramebuffer();this.copyTextureToTexture=function(L,$,ct=null,ut=null,K=0,Ct=null){Ct===null&&(K!==0?(br("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Ct=K,K=0):Ct=0);let Bt,Xt,Gt,he,de,re,Ae,Be,nn,Ye=L.isCompressedTexture?L.mipmaps[Ct]:L.image;if(ct!==null)Bt=ct.max.x-ct.min.x,Xt=ct.max.y-ct.min.y,Gt=ct.isBox3?ct.max.z-ct.min.z:1,he=ct.min.x,de=ct.min.y,re=ct.isBox3?ct.min.z:0;else{let ci=Math.pow(2,-K);Bt=Math.floor(Ye.width*ci),Xt=Math.floor(Ye.height*ci),L.isDataArrayTexture?Gt=Ye.depth:L.isData3DTexture?Gt=Math.floor(Ye.depth*ci):Gt=1,he=0,de=0,re=0}ut!==null?(Ae=ut.x,Be=ut.y,nn=ut.z):(Ae=0,Be=0,nn=0);let Ve=Jt.convert($.format),ue=Jt.convert($.type),Qe;$.isData3DTexture?(at.setTexture3D($,0),Qe=I.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(at.setTexture2DArray($,0),Qe=I.TEXTURE_2D_ARRAY):(at.setTexture2D($,0),Qe=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,$.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,$.unpackAlignment);let Ie=I.getParameter(I.UNPACK_ROW_LENGTH),Kn=I.getParameter(I.UNPACK_IMAGE_HEIGHT),sr=I.getParameter(I.UNPACK_SKIP_PIXELS),jn=I.getParameter(I.UNPACK_SKIP_ROWS),ro=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,Ye.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Ye.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,he),I.pixelStorei(I.UNPACK_SKIP_ROWS,de),I.pixelStorei(I.UNPACK_SKIP_IMAGES,re);let tn=L.isDataArrayTexture||L.isData3DTexture,li=$.isDataArrayTexture||$.isData3DTexture;if(L.isDepthTexture){let ci=it.get(L),Nn=it.get($),Wn=it.get(ci.__renderTarget),sh=it.get(Nn.__renderTarget);tt.bindFramebuffer(I.READ_FRAMEBUFFER,Wn.__webglFramebuffer),tt.bindFramebuffer(I.DRAW_FRAMEBUFFER,sh.__webglFramebuffer);for(let Ms=0;Ms<Gt;Ms++)tn&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,it.get(L).__webglTexture,K,re+Ms),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,it.get($).__webglTexture,Ct,nn+Ms)),I.blitFramebuffer(he,de,Bt,Xt,Ae,Be,Bt,Xt,I.DEPTH_BUFFER_BIT,I.NEAREST);tt.bindFramebuffer(I.READ_FRAMEBUFFER,null),tt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(K!==0||L.isRenderTargetTexture||it.has(L)){let ci=it.get(L),Nn=it.get($);tt.bindFramebuffer(I.READ_FRAMEBUFFER,so),tt.bindFramebuffer(I.DRAW_FRAMEBUFFER,Ca);for(let Wn=0;Wn<Gt;Wn++)tn?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ci.__webglTexture,K,re+Wn):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,ci.__webglTexture,K),li?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Nn.__webglTexture,Ct,nn+Wn):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Nn.__webglTexture,Ct),K!==0?I.blitFramebuffer(he,de,Bt,Xt,Ae,Be,Bt,Xt,I.COLOR_BUFFER_BIT,I.NEAREST):li?I.copyTexSubImage3D(Qe,Ct,Ae,Be,nn+Wn,he,de,Bt,Xt):I.copyTexSubImage2D(Qe,Ct,Ae,Be,he,de,Bt,Xt);tt.bindFramebuffer(I.READ_FRAMEBUFFER,null),tt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else li?L.isDataTexture||L.isData3DTexture?I.texSubImage3D(Qe,Ct,Ae,Be,nn,Bt,Xt,Gt,Ve,ue,Ye.data):$.isCompressedArrayTexture?I.compressedTexSubImage3D(Qe,Ct,Ae,Be,nn,Bt,Xt,Gt,Ve,Ye.data):I.texSubImage3D(Qe,Ct,Ae,Be,nn,Bt,Xt,Gt,Ve,ue,Ye):L.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,Ct,Ae,Be,Bt,Xt,Ve,ue,Ye.data):L.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,Ct,Ae,Be,Ye.width,Ye.height,Ve,Ye.data):I.texSubImage2D(I.TEXTURE_2D,Ct,Ae,Be,Bt,Xt,Ve,ue,Ye);I.pixelStorei(I.UNPACK_ROW_LENGTH,Ie),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Kn),I.pixelStorei(I.UNPACK_SKIP_PIXELS,sr),I.pixelStorei(I.UNPACK_SKIP_ROWS,jn),I.pixelStorei(I.UNPACK_SKIP_IMAGES,ro),Ct===0&&$.generateMipmaps&&I.generateMipmap(Qe),tt.unbindTexture()},this.initRenderTarget=function(L){it.get(L).__webglFramebuffer===void 0&&at.setupRenderTarget(L)},this.initTexture=function(L){L.isCubeTexture?at.setTextureCube(L,0):L.isData3DTexture?at.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?at.setTexture2DArray(L,0):at.setTexture2D(L,0),tt.unbindTexture()},this.resetState=function(){A=0,R=0,C=null,tt.reset(),Dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return yi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Re._getDrawingBufferColorSpace(t),e.unpackColorSpace=Re._getUnpackColorSpace()}};var Ic={1:{key:"mesa",name:"SHATTERED MESA",kind:"organic",enclosed:!1,sky:{zenith:"#141c48",mid:"#5a4c86",horizon:"#ffb07a",glow:"#ffd29a",stars:.25},sun:{color:"#ffcf9e",intensity:3.6,dir:[-.7,.55,.42]},hemi:{sky:"#a9b8ff",ground:"#5b2a1c",intensity:.85},fog:{color:"#d39a82",near:700,far:5600},exposure:1.05,rock:{base:"#a2573a",dark:"#4a1f14",light:"#e09a6a",strata:1,wet:0},top:{color:"#c99364",rough:.95},crystal:"#58d8ff",accent:"#63eeff",spike:"#7fe6ff",bloom:.55,backdrop:"mesa",ambient:"dust",grade:{lift:[.02,0,.01],gain:[1.05,.98,.92],sat:1.08},planet:{color:"#d9a88a",band:"#8f5b4a",ring:"#f0d4b8",pos:[-900,560,-5200],r:900}},2:{key:"vaults",name:"DROWNED VAULTS",kind:"organic",enclosed:!0,sky:{zenith:"#03121a",mid:"#06303a",horizon:"#0d5a62",glow:"#2fd0c0",stars:0},sun:{color:"#9fe8ff",intensity:1.7,dir:[.3,.42,.86]},hemi:{sky:"#3fb6c4",ground:"#071b1e",intensity:.75},fog:{color:"#0b3a40",near:250,far:1500},exposure:1.15,rock:{base:"#3e5a5e",dark:"#0e1d22",light:"#7fa6a0",strata:0,wet:1},top:{color:"#2c6a52",rough:.45},crystal:"#3cffd2",accent:"#88ffe5",spike:"#4dffe0",bloom:.75,backdrop:"cavern",ambient:"motes",grade:{lift:[0,.015,.02],gain:[.92,1.02,1.05],sat:1.05}},3:{key:"rift",name:"RIFT RUN",kind:"organic",enclosed:!1,sky:{zenith:"#05061a",mid:"#1c1a4a",horizon:"#6a5cc8",glow:"#b8a2ff",stars:1},sun:{color:"#ffd9c0",intensity:3.2,dir:[.45,.65,.5]},hemi:{sky:"#9c9cff",ground:"#1c1426",intensity:.95},fog:{color:"#3a2f6a",near:700,far:5200},exposure:1.25,rock:{base:"#6a6488",dark:"#1d1a30",light:"#b4aed0",strata:.8,wet:0},top:{color:"#7a7090",rough:.85},crystal:"#b296ff",accent:"#ba96ff",spike:"#c8b0ff",bloom:.7,backdrop:"rift",ambient:"speed",grade:{lift:[.01,.01,.03],gain:[.96,.97,1.06],sat:1.05},planet:{color:"#7b8ad8",band:"#3a3f80",ring:null,pos:[1800,1100,-6e3],r:1300}},4:{key:"foundry",name:"CINDER FOUNDRY",kind:"industrial",enclosed:!0,sky:{zenith:"#0a0808",mid:"#1e1612",horizon:"#3a2016",glow:"#ff7a32",stars:0},sun:{color:"#ffd2a8",intensity:3,dir:[-.35,.4,.85]},hemi:{sky:"#ffbe8a",ground:"#2a1c16",intensity:1.05},fog:{color:"#33201a",near:340,far:2e3},exposure:1.32,rock:{base:"#746e72",dark:"#1a1719",light:"#a49aa0",strata:0,wet:0},top:{color:"#6b6466",rough:.55},crystal:"#ffb35a",accent:"#ff8a3c",spike:"#ff6a2a",bloom:.8,backdrop:"foundry",ambient:"embers",grade:{lift:[.02,.01,0],gain:[1.06,.98,.9],sat:1.06}},5:{key:"spire",name:"THE HOLLOW SPIRE",kind:"organic",enclosed:!0,sky:{zenith:"#0c0414",mid:"#2a0c36",horizon:"#5a1c5c",glow:"#d06bff",stars:.4},sun:{color:"#e0b8ff",intensity:1.9,dir:[.32,.42,.85]},hemi:{sky:"#b070ff",ground:"#180a12",intensity:.7},fog:{color:"#2a0f34",near:260,far:1600},exposure:1.15,rock:{base:"#4a3550",dark:"#140a18",light:"#8a6a96",strata:0,wet:.6},top:{color:"#5a2a4a",rough:.5},crystal:"#c88cff",accent:"#b7ff68",spike:"#b7ff68",bloom:.85,backdrop:"spire",ambient:"spores",grade:{lift:[.02,0,.03],gain:[1.02,.95,1.06],sat:1.1}}};function zf(n){return Ic[n&&n.world]||Ic[1]}function Hn(n,t=!1){let e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},o={},a=n[0].morphTargetsRelative,l=new Ee,c=0;for(let h=0;h<n.length;++h){let u=n[h],f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in u.attributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(e){let h=0,u=[];for(let f=0;f<n.length;++f){let d=n[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=n[f].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Hf(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){let d=[];for(let x=0;x<o[h].length;++x)d.push(o[h][x][f]);let g=Hf(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Hf(n){let t,e,i,s=-1,r=0;for(let c=0;c<n.length;++c){let h=n[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new Ce(o,e,i),l=0;for(let c=0;c<n.length;++c){let h=n[c];if(h.isInterleavedBufferAttribute){let u=l/e;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<e;g++){let x=h.getComponent(f,g);a.setComponent(f+u,g,x)}}else o.set(h.array,l);l+=h.count*e}return s!==void 0&&(a.gpuType=s),a}function Dc(n,t=1e-4){t=Math.max(t,Number.EPSILON);let e={},i=n.getIndex(),s=n.getAttribute("position"),r=i?i.count:s.count,o=0,a=Object.keys(n.attributes),l={},c={},h=[],u=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let M=0,v=a.length;M<v;M++){let y=a[M],T=n.attributes[y];l[y]=new T.constructor(new T.array.constructor(T.count*T.itemSize),T.itemSize,T.normalized);let A=n.morphAttributes[y];A&&(c[y]||(c[y]=[]),A.forEach((R,C)=>{let S=new R.array.constructor(R.count*R.itemSize);c[y][C]=new R.constructor(S,R.itemSize,R.normalized)}))}let d=t*.5,g=Math.log10(1/t),x=Math.pow(10,g),m=d*x;for(let M=0;M<r;M++){let v=i?i.getX(M):M,y="";for(let T=0,A=a.length;T<A;T++){let R=a[T],C=n.getAttribute(R),S=C.itemSize;for(let b=0;b<S;b++)y+=`${~~(C[u[b]](v)*x+m)},`}if(y in e)h.push(e[y]);else{for(let T=0,A=a.length;T<A;T++){let R=a[T],C=n.getAttribute(R),S=n.morphAttributes[R],b=C.itemSize,D=l[R],N=c[R];for(let F=0;F<b;F++){let B=u[F],G=f[F];if(D[G](o,C[B](v)),S)for(let X=0,j=S.length;X<j;X++)N[X][G](o,S[X][B](v))}}e[y]=o,h.push(o),o++}}let p=n.clone();for(let M in n.attributes){let v=l[M];if(p.setAttribute(M,new v.constructor(v.array.slice(0,o*v.itemSize),v.itemSize,v.normalized)),M in c)for(let y=0;y<c[M].length;y++){let T=c[M][y];p.morphAttributes[M][y]=new T.constructor(T.array.slice(0,o*T.itemSize),T.itemSize,T.normalized)}}return p.setIndex(h),p}function Nc(n){let t=n>>>0||1;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function bi(n,t,e){let i=Math.imul(n,374761393)+Math.imul(t,668265263)+Math.imul(e,2147483647);return i=Math.imul(i^i>>>13,1274126177),((i^i>>>16)>>>0)/4294967296}var la=n=>n*n*(3-2*n);function ca(n,t,e){let i=Math.floor(n),s=Math.floor(t),r=Math.floor(e),o=la(n-i),a=la(t-s),l=la(e-r),c=(h,u,f)=>h+(u-h)*f;return c(c(c(bi(i,s,r),bi(i+1,s,r),o),c(bi(i,s+1,r),bi(i+1,s+1,r),o),a),c(c(bi(i,s,r+1),bi(i+1,s,r+1),o),c(bi(i,s+1,r+1),bi(i+1,s+1,r+1),o),a),l)*2-1}function vn(n,t,e,i=3){let s=0,r=.5,o=1;for(let a=0;a<i;a++)s+=r*ca(n*o,t*o,e*o),o*=2.03,r*=.5;return s}function Ru(n,t,e,i=3){let s=0,r=.5,o=1;for(let a=0;a<i;a++)s+=r*(1-Math.abs(ca(n*o,t*o,e*o))),o*=2.1,r*=.5;return s}function Lc(n,t,e,i){let s=Math.floor(n),r=Math.floor(t),o=la(n-s),a=la(t-r),l=(d,g)=>bi((d%e+e)%e,(g%e+e)%e,i),c=l(s,r),h=l(s+1,r),u=l(s,r+1),f=l(s+1,r+1);return c+(h-c)*o+(u-c)*a+(c-h-u+f)*o*a}function Vv(n,t,e,i){let s=Math.floor(n),r=Math.floor(t),o=9,a=9;for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++){let h=s+c,u=r+l,f=(h%e+e)%e,d=(u%e+e)%e,g=h+bi(f,d,i),x=u+bi(f,d,i+7),m=Math.hypot(g-n,x-t);m<o?(a=o,o=m):m<a&&(a=m)}return[o,a]}var Di=null;function Vf(){if(Di)return Di;let n=256,t=new Uint8Array(n*n*4);for(let e=0;e<n;e++)for(let i=0;i<n;i++){let s=i/n,r=e/n,o=0,a=.5,l=8;for(let x=0;x<5;x++)o+=a*Lc(s*l,r*l,l,11+x),a*=.5,l*=2;let[c,h]=Vv(s*10,r*10,10,3),u=Math.max(0,1-(h-c)*7),f=Lc(s*128,r*128,128,5)*.6+Lc(s*64,r*64,64,6)*.4,d=0;a=.5,l=2;for(let x=0;x<3;x++)d+=a*Lc(s*l,r*l,l,21+x),a*=.5,l*=2;let g=(e*n+i)*4;t[g]=o*255,t[g+1]=u*255,t[g+2]=f*255,t[g+3]=d/.875*255}return Di=new kn(t,n,n,mn),Di.wrapS=Di.wrapT=Cn,Di.magFilter=Fn,Di.minFilter=ui,Di.generateMipmaps=!0,Di.needsUpdate=!0,Di}var Si=`
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*vnoise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
`;var Wr=n=>new It(n);function Zs(n,t={}){let e=n.kind==="industrial"||t.industrial,i=new qe({color:16777215,roughness:.9,metalness:e?.55:0,vertexColors:!0,flatShading:!1}),s={uDetail:{value:Vf()},uTime:{value:0},uRockBase:{value:Wr(t.base||n.rock.base)},uRockDark:{value:Wr(n.rock.dark)},uRockLight:{value:Wr(n.rock.light)},uTop:{value:Wr(t.top||n.top.color)},uTopRough:{value:n.top.rough},uStrata:{value:t.strata??n.rock.strata},uWet:{value:n.rock.wet},uCrystal:{value:Wr(n.crystal)},uVein:{value:t.vein??(e?0:1)},uIndustrial:{value:e?1:0},uBump:{value:t.bump??(e?1.2:2.2)},uWaterMask:{value:t.waterMask||null},uHasWater:{value:t.waterMask?1:0},uLevelSize:{value:new mt(t.cols||1,t.rows||1)},uHeat:{value:t.heat??(n.key==="foundry"?1:0)},uPulse:{value:n.key==="spire"?1:0},uAccent:{value:Wr(n.accent)}};return i.userData.uniforms=s,i.onBeforeCompile=r=>{Object.assign(r.uniforms,s),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWPos;varying vec3 vWNormal;`).replace("#include <project_vertex>",`#include <project_vertex>
vWPos=(modelMatrix*vec4(transformed,1.)).xyz;vWNormal=normalize(mat3(modelMatrix)*objectNormal);`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWPos;varying vec3 vWNormal;
uniform sampler2D uDetail;uniform float uTime,uTopRough,uStrata,uWet,uVein,uIndustrial,uBump,uHasWater,uHeat,uPulse;
uniform vec3 uRockBase,uRockDark,uRockLight,uTop,uCrystal,uAccent;uniform sampler2D uWaterMask;uniform vec2 uLevelSize;
float gH,gGrain,gWet,gVein,gUnder,gCaus,gSeam,gLit;
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec4 tri4(vec3 p,vec3 w,float s){return texture2D(uDetail,p.zy*s)*w.x+texture2D(uDetail,p.xz*s)*w.y+texture2D(uDetail,p.xy*s)*w.z;}
float caustic(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.31+t*.83),cos(q.x*1.17-t*.71))*.55;c+=abs(sin(q.x*1.1+q.y*.9));}c/=3.;return pow(1.-c,4.)*2.2;}
vec3 perturbN(vec3 sp,vec3 sn,vec2 dH,float fd){vec3 sx=normalize(dFdx(sp)),sy=normalize(dFdy(sp));vec3 r1=cross(sy,sn),r2=cross(sn,sx);float det=dot(sx,r1)*fd;vec3 g=sign(det)*(dH.x*r1+dH.y*r2);return normalize(abs(det)*sn-g);}
`).replace("#include <map_fragment>",`
vec3 wn=normalize(vWNormal);vec3 tw=pow(abs(wn),vec3(4.));tw/=dot(tw,vec3(1.));
vec4 d=tri4(vWPos,tw,1./96.);vec4 d2=tri4(vWPos,tw,1./410.);vec4 d3=tri4(vWPos,tw,1./23.);
float n=d.r,crack=d.g,grain=d3.b,broad=d2.a;gGrain=grain;
vec3 rock=mix(uRockDark,uRockBase,smoothstep(.12,.78,n*.75+broad*.55));
rock=mix(rock,uRockLight,smoothstep(.62,.98,n*.8+d3.r*.35)*.45);
// sedimentary strata: warped bands with their own tint, thin dark partings between them
float sy=(vWPos.y+broad*46.+d.r*6.)/17.;float bid=floor(sy);float bf=fract(sy);float fw=min(.5,fwidth(sy)*1.5);
vec3 bandA=mix(uRockBase,uRockLight,h21(vec2(bid,3.7))*.75)*(.78+.34*h21(vec2(bid,8.1)));
vec3 bandB=mix(uRockBase,uRockLight,h21(vec2(bid+1.,3.7))*.75)*(.78+.34*h21(vec2(bid+1.,8.1)));
vec3 bandCol=mix(bandA,bandB,smoothstep(1.-fw-.12,1.,bf));
float parting=(1.-smoothstep(0.,.07+fw,min(bf,1.-bf)))*(1.-smoothstep(.3,.5,fw));
rock=mix(rock,bandCol*(.8+n*.4),uStrata*.7);rock*=1.-uStrata*parting*.28;
rock*=1.-smoothstep(.86,.98,crack)*.3*(1.-uIndustrial);
rock*=.86+.28*smoothstep(.2,.8,broad);
float up=smoothstep(.5,.86,wn.y+(n-.5)*.4+(grain-.5)*.15);
vec3 topc=uTop*(.72+grain*.5)*(.85+broad*.3);
vec3 col=mix(rock,topc,up*(1.-uIndustrial*.55));
gH=n*.7+d3.r*.35-smoothstep(.8,1.,crack)*.4*(1.-uIndustrial)+grain*.12-uStrata*parting*.5;
gSeam=0.;gLit=0.;
if(uIndustrial>.5){
  vec2 pp=abs(wn.x)>.6?vWPos.zy:(abs(wn.y)>.6?vWPos.xz:vWPos.xy);
  vec2 cs=vec2(40.,20.);vec2 f=fract(pp/cs);vec2 e=min(f,1.-f)*cs;float seam=1.-smoothstep(.4,1.6,min(e.x,e.y));
  vec2 rv=fract(pp/cs+.5);float rivet=1.-smoothstep(1.,1.8,length((rv-.5)*cs-vec2(cs.x*.42,cs.y*.36)));
  float panel=h21(floor(pp/cs));col*=.82+panel*.3;col*=1.-seam*.6;col+=rivet*.08;
  gH=gH*.25-seam*1.2+rivet*.6;gSeam=seam;
  if(vWPos.z<-240.){vec2 cid=floor(pp/cs);gLit=step(.975,h21(cid+7.3))*(1.-seam)*smoothstep(.0,.35,min(min(f.x,1.-f.x),min(f.y,1.-f.y)))*(.7+.3*sin(uTime*(2.+h21(cid)*5.)+cid.x));}
  float grime=smoothstep(.3,.9,broad+d.r*.4);col=mix(col,col*.55,grime*.5);
}
gVein=uVein*smoothstep(.9,.985,crack)*smoothstep(.68,.9,broad)*(1.-up);
gWet=uWet*(.35+.65*up);
gUnder=0.;gCaus=0.;
if(uHasWater>.5){vec3 sp=vWPos+wn*3.;vec2 tc=vec2(sp.x/20.,-sp.y/20.);float wm=texture2D(uWaterMask,(floor(tc)+.5)/uLevelSize).r;
  float wa=texture2D(uWaterMask,(floor(tc-vec2(0.,1.))+.5)/uLevelSize).r;gUnder=max(wm,wa*smoothstep(4.,0.,fract(tc.y)*20.));
  gCaus=caustic(vWPos.xz*.045+vWPos.y*.012,uTime*1.4)*gUnder;col*=mix(vec3(1.),vec3(.5,.82,.88),gUnder);gWet=max(gWet,gUnder);}
diffuseColor.rgb*=col;
`).replace("#include <roughnessmap_fragment>","float roughnessFactor=roughness*(.75+gGrain*.45);roughnessFactor=mix(roughnessFactor,uTopRough,0.);roughnessFactor=mix(roughnessFactor,.42,gWet);roughnessFactor=mix(roughnessFactor,.35,gSeam*uIndustrial);").replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
normal=perturbN(-vViewPosition,normal,vec2(dFdx(gH),dFdy(gH))*uBump*(1.-.75*smoothstep(350.,1100.,length(vViewPosition))),faceDirection);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
float pulse=.75+.25*sin(uTime*2.2+vWPos.x*.031+vWPos.y*.05);
totalEmissiveRadiance+=uCrystal*gVein*1.1*pulse;
totalEmissiveRadiance+=vec3(.25,.75,.85)*gCaus*.18;
totalEmissiveRadiance+=uAccent*gLit*.7;
if(uPulse>.5){float vv=smoothstep(.9,.985,d.g)*smoothstep(.6,.85,d2.a);totalEmissiveRadiance+=uAccent*vv*(.6+.6*sin(uTime*3.+vWPos.x*.02))*1.4;}
if(uHeat>.5){float glow=smoothstep(-150.,-430.,vWPos.y)*0.;totalEmissiveRadiance+=vec3(1.,.35,.08)*glow;}`)},i.customProgramCacheKey=()=>"terrain-"+(e?"i":"o")+(t.waterMask?"w":""),i}function wi(n,t=2.2,e={}){let i=new It(n),s=new Os({color:i.clone().multiplyScalar(.32),emissive:i,emissiveIntensity:t*.55,roughness:.1,metalness:.1,clearcoat:1,clearcoatRoughness:.06,transparent:!!e.transparent,opacity:e.opacity??1,flatShading:!0,envMapIntensity:1.1,iridescence:.5,iridescenceIOR:1.4});return s.onBeforeCompile=r=>{r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying float vLy;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLy=position.y;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
varying float vLy;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
      float fres=pow(1.-abs(dot(normalize(normal),normalize(vViewPosition))),2.2);float tip=smoothstep(.5,1.,vLy);
      totalEmissiveRadiance*=.14+fres*1.35+tip*.85;`)},s.customProgramCacheKey=()=>"crystal",s}var Ei=20,Zn=26,Yn=-72,Js={EMPTY:0,SOLID:1,SPIKE:2,PLATFORM:3,DECO:4,WATER:5,CRATE:6};function Gf(n,t,e){let i=Ei,s=n.cols,r=n.rows,o=n.tiles,a=(()=>{let I=0;for(let H=0;H<s;H++)o[H]===Js.SOLID&&I++;return I>s*.6})(),l=!!t.enclosed,c=t.kind==="industrial",h=e==="low"?2:4,u=e==="low"?4:8,f=(I,H)=>(I=Math.max(0,Math.min(s-1,I)),H>=r?Js.SOLID:(H<0&&(H=a?0:-1),H<0?Js.EMPTY:o[H*s+I])),d=(I,H)=>f(I,H)===Js.SOLID,g=new Xe;g.name="terrain";let x=Nc(n.world*1e3+n.stageIndex*17+7),m=null;if(n.hasWater){let I=new Uint8Array(s*r);for(let H=0;H<s*r;H++)I[H]=o[H]===Js.WATER?255:0;m=new kn(I,s,r,Or,Bn),m.flipY=!1,m.magFilter=m.minFilter=fn,m.needsUpdate=!0}let p=Zs(t,{waterMask:m,cols:s,rows:r}),M=[p],v=new Float32Array(s),y=new Float32Array(s);for(let I=0;I<s;I++){let H=r-1;if(!d(I,H))v[I]=-(r*i+90);else{for(;H>0&&d(I,H-1);)H--;v[I]=-H*i}let Y=0;if(a&&d(I,0)){for(;Y<r-1&&d(I,Y+1);)Y++;y[I]=-(Y+1)*i}else y[I]=200}let T=(I,H)=>{let Y=H/i-.5,W=Math.floor(Y),tt=Y-W,et=I[Math.max(0,Math.min(s-1,W))],it=I[Math.max(0,Math.min(s-1,W+1))];return et+(it-et)*tt},A=(I,H,Y)=>{let W=0,tt=0;for(let et=-Y;et<=Y;et+=i/2)W+=T(I,H+et),tt++;return W/tt},R=c?0:t.key==="spire"?7:t.key==="vaults"?6:5.5,C=new Map;function S(I,H,Y,W){if(!R){W[0]=I,W[1]=H,W[2]=Y,W[3]=0;return}let tt=(I*4|0)+","+(H*4|0)+","+(Y*4|0),et=C.get(tt);if(!et){let it=t.key==="spire"?.022:.034,at=I*it,nt=H*it,rt=Y*it,P=Y>-40&&Y<Zn-5?.12:1,w=vn(at,nt+57,rt,3)*R*1.7;t.rock.strata&&(w+=Math.sin(H*.42+vn(at*.5,nt*.5,0,2)*3)*2.6*t.rock.strata),et=[vn(at,nt,rt,3)*R,vn(at+31,nt,rt,3)*R*P,w],C.set(tt,et)}W[0]=I+et[0],W[1]=H+et[1],W[2]=Y+et[2],W[3]=et[2]/(R*2.2)}function b(I,H,Y){let W=T(v,I),tt=Math.max(0,(W-H)/i),et=1-Math.min(.5,tt*.07);return Y<Yn+12&&(et*=.86),et*(.9+.1*ca(I*.05,H*.05,Y*.05))}let D=16,N=26,F=[],B=[0,0,0,0];for(let I=-N;I<s+N;I+=D){let H=[],Y=[],W=(it,at,nt,rt,P)=>{for(let w=0;w<P;w++)for(let U=0;U<rt;U++){let q=(yt,gt)=>[it[0]+at[0]*yt+nt[0]*gt,it[1]+at[1]*yt+nt[1]*gt,it[2]+at[2]*yt+nt[2]*gt],k=q(U/rt,w/P),z=q((U+1)/rt,w/P),xt=q((U+1)/rt,(w+1)/P),vt=q(U/rt,(w+1)/P);for(let yt of[k,xt,z,k,vt,xt]){S(yt[0],yt[1],yt[2],B),H.push(B[0],B[1],B[2]);let gt=b(yt[0],yt[1],yt[2])*(.8+.2*Math.max(-1,Math.min(1,B[3]*2)));Y.push(gt,gt,gt)}}};for(let it=I;it<I+D;it++)for(let at=0;at<r+3;at++){if(!d(it,at))continue;let nt=it*i,rt=nt+i,P=-at*i,w=P-i;W([nt,P,Zn],[i,0,0],[0,-i,0],h,h),d(it,at-1)||W([nt,P,Yn],[i,0,0],[0,0,Zn-Yn],h,u),!d(it,at+1)&&at<r+2&&W([nt,w,Zn],[i,0,0],[0,0,Yn-Zn],h,u),d(it-1,at)||W([nt,P,Yn],[0,0,Zn-Yn],[0,-i,0],u,h),d(it+1,at)||W([rt,P,Zn],[0,0,Yn-Zn],[0,-i,0],u,h)}if(!H.length)continue;let tt=new Ee;tt.setAttribute("position",new Kt(H,3)),tt.setAttribute("color",new Kt(Y,3)),c||(tt=Dc(tt,.01)),tt.computeVertexNormals(),tt.computeBoundingSphere();let et=new jt(tt,p);et.castShadow=!0,et.receiveShadow=!0,g.add(et),F.push(et)}let G=l?[Yn+10,Yn-6,-95,-120,-150,-190,-240,-300]:[Yn+10,Yn-6,-95,-120,-150,-190,-240,-300,-380,-480,-600,-760,-950],X=e==="low"?20:10,j=-N*i,Z=(s+N)*i,J=(I,H,Y)=>{let W=Math.max(0,(Yn-H)/(Yn-G[G.length-1])),tt=T(Y?v:y,I),et=A(Y?v:y,I,90),it=tt+(et-tt)*Math.min(1,W*3.2),at=.006,nt=Ru(I*at,H*at,Y?3.1:7.7,4)*1.4-.5;t.key==="mesa"&&(nt=Math.floor(nt*4.5)/4.5*.8+nt*.25);let rt=(l?110:230)*Math.pow(Math.max(0,W),1.25)+(W>0?8:0);return c&&(rt=W>0?3:0,nt=Math.round(nt*2)/2),t.key==="rift"?it+=(Y?-1.7:2.4)*(Math.abs(nt)+.3)*rt+vn(I*.03,H*.03,1,2)*6*Math.min(1,W*4):it+=(Y?1:-1)*(nt*rt+vn(I*.03,H*.03,1,2)*(c?0:6)*Math.min(1,W*4)),Y&&tt<-r*i&&(it=Math.min(it,tt+rt*.4)),H>Yn-4&&(it+=Y?-4:4),it};function ot(I){let H=Math.ceil((Z-j)/X)+1,Y=G.length,W=new Float32Array(H*Y*3),tt=new Float32Array(H*Y*3),et=[];for(let at=0;at<Y;at++)for(let nt=0;nt<H;nt++){let rt=j+nt*X,P=G[at],w=J(rt,P,I),U=(at*H+nt)*3;W[U]=rt+vn(rt*.02,P*.02,5,2)*4,W[U+1]=w,W[U+2]=P;let q=at<2?.82:.9+.1*ca(rt*.01,P*.01,2);tt[U]=tt[U+1]=tt[U+2]=q}for(let at=0;at<Y-1;at++)for(let nt=0;nt<H-1;nt++){let rt=at*H+nt,P=rt+1,w=rt+H,U=w+1;I?et.push(rt,P,w,P,U,w):et.push(rt,w,P,P,w,U)}let it=new Ee;return it.setAttribute("position",new Ce(W,3)),it.setAttribute("color",new Ce(tt,3)),it.setIndex(et),it.computeVertexNormals(),it}function ft(I){let H=Gv(I,D*i*2);for(let Y of H){let W=new jt(Y,p);W.receiveShadow=!0,W.castShadow=!l,g.add(W)}}if(ft(ot(!0)),a&&ft(ot(!1)),l){let I=G[G.length-1],H=Math.ceil((Z-j)/X)+1,Y=24,W=new Float32Array(H*Y*3),tt=new Float32Array(H*Y*3),et=[];for(let at=0;at<Y;at++)for(let nt=0;nt<H;nt++){let rt=j+nt*X,P=J(rt,I,!0)-30,w=J(rt,I,!1)+30,U=at/(Y-1),q=P+(w-P)*U,k=(at*H+nt)*3,z=vn(rt*.012,q*.012,3,3)*70+Ru(rt*.03,q*.03,1,2)*25;W[k]=rt,W[k+1]=q,W[k+2]=I-20-z*(c?.2:1);let xt=.72+.28*Math.sin(U*Math.PI);tt[k]=tt[k+1]=tt[k+2]=xt}for(let at=0;at<Y-1;at++)for(let nt=0;nt<H-1;nt++){let rt=at*H+nt,P=rt+1,w=rt+H,U=w+1;et.push(rt,P,w,P,U,w)}let it=new Ee;it.setAttribute("position",new Ce(W,3)),it.setAttribute("color",new Ce(tt,3)),it.setIndex(et),it.computeVertexNormals(),ft(it)}let Lt=[];for(let I=0;I<r;I++)for(let H=0;H<s;H++)o[I*s+H]===Js.SPIKE&&Lt.push([H,I]);if(Lt.length){let I=$s(),H=5,Y=Lt.length*H,W=c?new qe({color:"#2a2426",metalness:.9,roughness:.35,emissive:new It(t.spike),emissiveIntensity:0}):wi(t.spike,1.6);c&&(W.onBeforeCompile=at=>{at.vertexShader=at.vertexShader.replace("#include <common>",`#include <common>
varying float vHy;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vHy=position.y;`),at.fragmentShader=at.fragmentShader.replace("#include <common>",`#include <common>
varying float vHy;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance=emissive*smoothstep(.45,1.,vHy)*3.5;`)});let tt=new rn(I,W,Y),et=new Ue,it=0;for(let[at,nt]of Lt)for(let rt=0;rt<H;rt++){let P=.75+x()*.5;et.position.set(at*i+3+x()*14,-(nt+1)*i+2,-34+rt*13+x()*6),et.rotation.set((x()-.5)*.35,x()*6.28,(x()-.5)*.35),et.scale.set(4*P,(13+x()*7)*P,4*P),et.updateMatrix(),tt.setMatrixAt(it++,et.matrix)}tt.castShadow=!0,g.add(tt),M.push(W)}let Ut=[];for(let I=0;I<r;I++)for(let H=0;H<s;H++)o[I*s+H]===Js.CRATE&&Ut.push(I*s+H);let zt=null,Ft=new Map;if(Ut.length){let I=Xv(n.type==="shmup"),H=new qe({color:n.type==="shmup"?"#3a3f52":"#6a5a44",metalness:.7,roughness:.42,emissive:new It(t.accent),emissiveIntensity:0,vertexColors:!0});H.onBeforeCompile=W=>{W.fragmentShader=W.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance=emissive*step(1.5,vColor.r+vColor.g+vColor.b)*2.5;`).replace("#include <color_fragment>",`#include <color_fragment>
if(vColor.r+vColor.g+vColor.b>1.5)diffuseColor.rgb=vec3(.1);`)},zt=new rn(I,H,Ut.length);let Y=new Ue;Ut.forEach((W,tt)=>{let et=W%s,it=W/s|0;Y.position.set(et*i+i/2,-it*i-i/2,0),Y.rotation.set(0,(x()-.5)*.06,0),Y.scale.set(1,1,1),Y.updateMatrix(),zt.setMatrixAt(tt,Y.matrix),Ft.set(W,tt)}),zt.castShadow=zt.receiveShadow=!0,g.add(zt),M.push(H)}let Q=[];if(n.platforms&&n.platforms.length)for(let I of n.platforms){let H=I.w*i,Y=qv(H,c,x),W=new jt(Y,c?Yv(t):p);if(W.position.set(I.x*i,-I.y*i,0),W.castShadow=W.receiveShadow=!0,g.add(W),Q.push({mesh:W,pl:I,w:H}),!c){let tt=new jt(new Yi(3.2,0),wi(t.crystal,3.2));tt.scale.set(1,2.2,1),tt.position.set(I.x*i+H/2,-I.y*i-16,0),g.add(tt),Q[Q.length-1].glow=tt}if(I.belt){let tt=Zv(H,I.belt);tt.position.set(I.x*i,-I.y*i,0),g.add(tt),Q[Q.length-1].belt=tt}}let ht=null;n.hasWater&&(ht=Jv(n,t,f,l?-330:-700)),ht&&g.add(ht.group);let wt=Kv(n,t,v,y,l,x,e);g.add(wt.group);let _t=[];for(let I of n.decors||[])if(I.type==="waterfall"){let H=$v(I,t);g.add(H.mesh),_t.push(H)}function At(I,H,Y){for(let W of M)W.userData.uniforms&&(W.userData.uniforms.uTime.value=I);ht&&ht.update(I);for(let W of _t)W.mat.uniforms.uTime.value=I;wt.update(I);for(let W of Q)W.glow&&(W.glow.rotation.y=I*1.5),W.belt&&(W.belt.material.map.offset.x=-I*W.pl.belt*.9)}function se(I){let H=Ft.get(I);if(H==null)return null;let Y=new ne;zt.getMatrixAt(H,Y);let W=new O().setFromMatrixPosition(Y);return Y.makeScale(0,0,0),zt.setMatrixAt(H,Y),zt.instanceMatrix.needsUpdate=!0,Ft.delete(I),W}function _e(){g.traverse(I=>{I.geometry&&I.geometry.dispose()});for(let I of M)I.dispose();m&&m.dispose(),ht&&ht.dispose(),wt.dispose()}return{group:g,update:At,removeCrate:se,crateIndex:Ft,dispose:_e,fg:wt.fg,falls:_t,ground:v,ceil:y,enclosed:l,hasCeiling:a,sample:I=>T(v,I),floorAt:(I,H)=>J(I,H,!0),material:p}}function Gv(n,t){let e=n.attributes.position,i=n.attributes.color,s=n.index.array,r=new Map;for(let a=0;a<s.length;a+=3){let l=(e.getX(s[a])+e.getX(s[a+1])+e.getX(s[a+2]))/3,c=Math.floor(l/t);r.has(c)||r.set(c,[]),r.get(c).push(s[a],s[a+1],s[a+2])}let o=[];for(let a of r.values()){let l=new Map,c=[],h=[],u=[],f=[],d=n.attributes.normal;for(let x of a){let m=l.get(x);m==null&&(m=c.length/3,l.set(x,m),c.push(e.getX(x),e.getY(x),e.getZ(x)),h.push(i.getX(x),i.getY(x),i.getZ(x)),u.push(d.getX(x),d.getY(x),d.getZ(x))),f.push(m)}let g=new Ee;g.setAttribute("position",new Kt(c,3)),g.setAttribute("color",new Kt(h,3)),g.setAttribute("normal",new Kt(u,3)),g.setIndex(f),g.computeBoundingSphere(),o.push(g)}return n.dispose(),o}function Wv(n){let t=[],e=n==="vaults"?3:5;for(let s=0;s<e;s++){let r=new cn(n==="vaults"?.5:.32,1,1,4),o=r.attributes.position;for(let a=0;a<o.count;a++){let l=o.getY(a)+.5;o.setXYZ(a,o.getX(a)*(1-l*.9),l,0)}r.rotateZ((s/(e-1)-.5)*(n==="vaults"?.4:.9)),r.rotateY(s*2.39),t.push(r)}let i=Hn(t);return t.forEach(s=>s.dispose()),i}function $s(){let n=new Pn(.55,1,.72,6,1,!1);n.translate(0,.36,0);let t=new qi(.55,.28,6,1);t.translate(0,.86,0);let e=Hn([n.toNonIndexed(),t.toNonIndexed()]);return e.computeVertexNormals(),e}function Xv(n){let t=[],e=new Fe(n?20:18.5,n?20:18.5,n?60:22,1,1,1);t.push(e);let i=[.05,.05,.05];if(n)for(let r of[-6,6]){let o=new Fe(20.4,1.2,60.4);o.translate(0,r,0),t.push(o)}else{for(let[o,a,l,c,h]of[[19.5,2,23,0,8.5],[19.5,2,23,0,-8.5],[2,19.5,23,8.5,0],[2,19.5,23,-8.5,0]]){let u=new Fe(o,a,l);u.translate(c,h,0),t.push(u)}let r=new Fe(14,1.1,23.4);t.push(r)}let s=t.map((r,o)=>{let a=r.toNonIndexed(),l=new Float32Array(a.attributes.position.count*3),c=n&&o>0||!n&&o===t.length-1,h=o===0?[.9,.86,.8]:[.5,.5,.52];l.fill(0);for(let u=0;u<l.length;u+=3){let f=c?[1,1,1]:h;l[u]=f[0],l[u+1]=f[1],l[u+2]=f[2]}return a.setAttribute("color",new Ce(l,3)),a});return Hn(s)}function qv(n,t,e){if(t){let o=new Fe(n,7,44,Math.max(1,Math.round(n/10)),1,2);return o.translate(n/2,-3.5,-6),o}let i=new Fe(n,14,46,Math.max(2,Math.round(n/6)),4,6),s=i.attributes.position;for(let o=0;o<s.count;o++){let a=s.getX(o),l=s.getY(o),c=s.getZ(o),h=(7-l)/14,u=1-h*.35;a*=u,c*=u,l-=h*h*vn(a*.08,c*.08,1,2)*10+h*4,l<6.5&&(a+=vn(a*.1,l*.1,c*.1,2)*2.5,c+=vn(a*.1+5,l*.1,c*.1,2)*2.5),s.setXYZ(o,a+n/2,l-7,c-6)}i.computeVertexNormals();let r=new Float32Array(s.count*3);for(let o=0;o<s.count;o++){let a=.65+.35*Math.min(1,Math.max(0,(s.getY(o)+14)/14));r[o*3]=r[o*3+1]=r[o*3+2]=a}return i.setAttribute("color",new Ce(r,3)),i}function Yv(n){return new qe({color:"#4a4648",metalness:.85,roughness:.38,emissive:new It(n.accent),emissiveIntensity:.05})}function Zv(n,t){let e=document.createElement("canvas");e.width=64,e.height=16;let i=e.getContext("2d");i.fillStyle="#1b1a1c",i.fillRect(0,0,64,16),i.fillStyle="#ff8a3c";for(let a=0;a<4;a++){let l=a*16+(t>0?2:12);i.beginPath(),i.moveTo(l,3),i.lineTo(l+(t>0?6:-6),8),i.lineTo(l,13),i.lineTo(l+(t>0?3:-3),8),i.fill()}let s=new Rr(e);s.wrapS=Cn,s.repeat.set(n/16,1),s.colorSpace=dn;let r=new jt(new cn(n,30),new qe({map:s,emissiveMap:s,emissive:new It("#ff7a2a"),emissiveIntensity:1.2,metalness:.3,roughness:.6}));r.rotation.x=-Math.PI/2,r.position.set(n/2,.3,-4);let o=new Xe;return o.add(r),o.material=r.material,o}function Jv(n,t,e,i){let s=Ei,r=n.cols,o=n.rows,a=new Xe,l=new It(t.key==="vaults"?"#021a20":"#0d2a40"),c=new It(t.key==="vaults"?"#1a8a84":"#3a8ab0"),h={uTime:{value:0},uDeep:{value:l},uShallow:{value:c},uSky:{value:new It(t.sky.glow)}},u=new me({uniforms:h,transparent:!0,depthWrite:!1,side:Je,vertexShader:"varying vec3 vW;uniform float uTime;void main(){vec3 p=position;vec4 w=modelMatrix*vec4(p,1.);w.y+=sin(w.x*.05+uTime*1.6)*.8+sin(w.z*.09-uTime*1.1)*.6;vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}",fragmentShader:`varying vec3 vW;uniform float uTime;uniform vec3 uDeep,uShallow,uSky;
      float h(vec2 p){return sin(p.x*.08+uTime*1.3)*sin(p.y*.11-uTime*.9)+sin((p.x+p.y)*.05+uTime*.7)*.6;}
      void main(){vec2 p=vW.xz;float e=.6;vec3 n=normalize(vec3(h(p+vec2(e,0))-h(p-vec2(e,0)),2.2,h(p+vec2(0,e))-h(p-vec2(0,e))));
      vec3 v=normalize(cameraPosition-vW);float fr=pow(1.-max(dot(n,v),0.),3.);vec3 l=normalize(vec3(-.4,.8,.5));float sp=pow(max(dot(reflect(-l,n),v),0.),60.)*.7;
      vec3 c=mix(uDeep*1.4+uShallow*.25,uSky*.55,fr*.7)+sp;float a=.5+fr*.35;gl_FragColor=vec4(c,a);}`}),f=new me({uniforms:h,transparent:!0,depthWrite:!1,vertexShader:"varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}",fragmentShader:`varying vec3 vW;uniform float uTime;uniform vec3 uDeep,uShallow;uniform float uTop;
      void main(){float rays=pow(max(0.,sin(vW.x*.03+sin(vW.y*.02+uTime*.4)*2.+uTime*.3)),6.)*.25;
      vec3 c=uDeep*1.1+uShallow*(.08+rays*.6);gl_FragColor=vec4(c,.58);}`}),d=[],g=[];for(let x=0;x<o;x++){let m=0;for(;m<r;)if(e(m,x)===5){let p=m;for(;p<r&&e(p,x)===5;)p++;let M=m*s,v=p*s,y=-x*s,T=y-s,A=new cn(v-M,s);A.translate((M+v)/2,(y+T)/2,Zn+1.5),g.push(A);let R=m;for(;R<p;)if(e(R,x-1)!==5){let C=R;for(;C<p&&e(C,x-1)!==5;)C++;let S=-x*s-3,b=new cn((C-R)*s,Zn+1.5-i,Math.max(1,(C-R)*2),12);b.rotateX(-Math.PI/2),b.translate((R+C)*s/2,S,(Zn+1.5+i)/2),d.push(b),R=C}else R++;m=p}else m++}if(!d.length&&!g.length)return null;if(g.length){let x=new jt(Hn(g),f);x.renderOrder=3,a.add(x)}if(d.length){let x=new jt(Hn(d),u);x.renderOrder=2,a.add(x)}return{group:a,update(x){h.uTime.value=x},dispose(){u.dispose(),f.dispose()}}}function $v(n,t){let e=Ei,i=n.tx*e+e/2,s=-n.topTy*e+6,r=-(n.botTy+1)*e-90,o=s-r,a={uTime:{value:0},uColor:{value:new It(t.key==="mesa"?"#bfe8ff":"#9ff")}},l=new me({uniforms:a,transparent:!0,depthWrite:!1,blending:wn,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime;uniform vec3 uColor;
      float n(vec2 p){return fract(sin(dot(floor(p),vec2(12.9,78.2)))*43758.5);}
      void main(){vec2 p=vec2(vUv.x*14.,vUv.y*6.+uTime*5.5);float a=n(p)*.6+n(p*vec2(1.,2.3)+3.)*.4;float edge=smoothstep(0.,.25,vUv.x)*smoothstep(1.,.75,vUv.x);
      float s=smoothstep(.3,1.,a)*edge;float foam=smoothstep(.12,0.,vUv.y);gl_FragColor=vec4(uColor*(.35+s*1.2+foam*1.5),1.)*(.5*edge+s*.6+foam*.5);}`}),c=new jt(new cn(28,o,1,1),l);return c.position.set(i,r+o/2,-40),{mesh:c,mat:l,x:i,top:s,bot:r}}function Kv(n,t,e,i,s,r,o){let a=Ei,l=n.cols,c=new Xe,h=[],u=$s();h.push(u);let f=wi(t.crystal,1.6);h.push(f);let d=Math.round(l*(o==="low"?.35:.7)),g=new rn(u,f,d*4),x=new Ue,m=0,p=t.kind==="industrial";for(let y=0;y<d&&!p;y++){let T=r()*l*a,A=Math.floor(T/a),R=e[Math.max(0,Math.min(l-1,A))];if(R<-n.rows*a)continue;let C=-95-r()*260,S=R+0,b=2+Math.floor(r()*3),D=.5+r()*1.2*(1+(-C-80)/220);for(let N=0;N<b&&m<d*4;N++){let F=D*(.5+r()*.7);x.position.set(T+(r()-.5)*10*D,S-3,C+(r()-.5)*10*D),x.rotation.set((r()-.5)*.9,r()*6.28,(r()-.5)*.9),x.scale.set(3*F,(10+r()*14)*F,3*F),x.updateMatrix(),g.setMatrixAt(m++,x.matrix)}if(s&&r()<.45){let N=i[Math.max(0,Math.min(l-1,A))];if(N<100){x.position.set(T+7,N+2,C+20),x.rotation.set(Math.PI+(r()-.5)*.6,r()*6.28,0);let F=.8+r()*1.4;x.scale.set(3*F,(12+r()*16)*F,3*F),x.updateMatrix(),m<d*4&&g.setMatrixAt(m++,x.matrix)}}}g.count=m,g.castShadow=!1,m&&c.add(g);let M=null;if(t.key==="mesa"||t.key==="vaults"||t.key==="spire"){let y=Wv(t.key);h.push(y);let T=t.key==="mesa"?"#b39a62":t.key==="vaults"?"#1f8a6a":"#6a2a5a",A=new qe({color:T,roughness:.8,side:Je,emissive:new It(t.key==="mesa"?"#000":t.crystal),emissiveIntensity:t.key==="mesa"?0:.35}),R={uTime:{value:0}};A.onBeforeCompile=D=>{D.uniforms.uTime=R.uTime,D.vertexShader=D.vertexShader.replace("#include <common>",`#include <common>
uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
      vec4 ip=instanceMatrix*vec4(0.,0.,0.,1.);float w=sin(uTime*2.+ip.x*.05)*.35+sin(uTime*3.7+ip.x*.11)*.12;transformed.x+=w*position.y*position.y;`)},h.push(A);let C=Math.round(l*(o==="low"?2:6)),S=new rn(y,A,C),b=0;for(let D=0;D<C;D++){let N=r()*l*a,F=Math.floor(N/a),B=e[Math.max(0,Math.min(l-1,F))];if(B<-n.rows*a)continue;let G=r()<.5?-40-r()*30:-75-r()*90;x.position.set(N,B+.5,G),x.rotation.set(0,r()*6.28,(r()-.5)*.4);let X=.7+r()*1.1;x.scale.set(X*3,(t.key==="vaults"?14:6)*X+r()*4,X*3),x.updateMatrix(),S.setMatrixAt(b++,x.matrix)}S.count=b,c.add(S),M=R}if(p){let y=new Pn(2.2,2.2,1,10);y.rotateZ(Math.PI/2),h.push(y);let T=new qe({color:"#7a6e66",metalness:.9,roughness:.3});h.push(T);let A=new Fe(1,1.1,1.4);h.push(A);let R=new qe({color:"#000",emissive:new It(t.accent),emissiveIntensity:1.5});h.push(R);let C=new rn(y,T,l),S=new rn(A,R,l*2),b=0,D=0;for(let N=0;N<l;){let F=N,B=e[N];for(;F<l&&e[F]===B;)F++;if(B>-n.rows*a){let G=(F-N)*a;x.position.set(N*a+G/2,B-14,Zn+2.5),x.rotation.set(0,0,0),x.scale.set(G,1,1),x.updateMatrix(),C.setMatrixAt(b++,x.matrix),x.position.set(N*a+G/2,B-1.5,Zn+.6),x.scale.set(G-4,1,1),x.updateMatrix(),S.setMatrixAt(D++,x.matrix)}N=F}C.count=b,S.count=D,C.castShadow=!0,c.add(C,S)}{let y=new Mi(1,1),T=y.attributes.position;for(let D=0;D<T.count;D++){let N=1+vn(T.getX(D)*2,T.getY(D)*2,T.getZ(D)*2,2)*.35;T.setXYZ(D,T.getX(D)*N,T.getY(D)*N*.6,T.getZ(D)*N)}y.computeVertexNormals();let A=new Float32Array(T.count*3).fill(.85);y.setAttribute("color",new Ce(A,3)),h.push(y);let R=p?new qe({color:"#3a3638",metalness:.8,roughness:.45}):Zs(t,{bump:1});h.push(R);let C=Math.round(l*(o==="low"?1.2:3.5)),S=new rn(y,R,C),b=0;for(let D=0;D<C;D++){let N=r()*l*a,F=Math.floor(N/a),B=e[Math.max(0,Math.min(l-1,F))];if(B<-n.rows*a)continue;let G=r()<.35?Zn-6-r()*14:-30-r()*120,X=(G>0?.8:1)*(.8+r()*r()*3.2)*(p?.8:1);x.position.set(N,B+X*.2,G),x.rotation.set(r()*.4,r()*6.28,r()*.4),x.scale.set(X*1.3,X,X),x.updateMatrix(),S.setMatrixAt(b++,x.matrix)}S.count=b,S.castShadow=!0,S.receiveShadow=!0,c.add(S)}let v=[];{let y=$s();h.push(y);let T=p?new qe({color:"#1c1a1c",metalness:.8,roughness:.5}):wi(t.crystal,1.1);h.push(T);let A=new Pn(1,1,1,12);h.push(A);for(let R=180;R<l*a;R+=260+r()*420){let C=Math.floor(R/a),S=e[Math.max(0,Math.min(l-1,C))];if(S<-n.rows*a)continue;let b=new Xe,D=70+r()*90;if(p)for(let N=0;N<2;N++){let F=new jt(A,T);F.scale.set(7+r()*5,200,7+r()*5),F.position.set(N*22,S-130-r()*30,0),b.add(F)}else for(let N=0;N<3;N++){let F=new jt(y,T),B=.6+r()*.8;F.scale.set(7*B,(34+r()*36)*B,7*B),F.position.set((r()-.5)*34,S-125+r()*30,(r()-.5)*20),F.rotation.set((r()-.5)*.7,r()*6,(r()-.5)*.7),b.add(F)}b.position.set(R,0,D),c.add(b),v.push(b)}}return{group:c,fg:v,update(y){M&&(M.uTime.value=y)},dispose(){h.forEach(y=>y.dispose())}}}var oi=n=>new It(n);function Wf(n,t,e,i){let r=n.cols*20,o=n.rows*20,a=new Xe,l=new Xe,c=[],h=[],u=Nc(n.world*77+n.stageIndex*5+3),f=new O(...t.sun.dir).normalize(),d={uZenith:{value:oi(t.sky.zenith)},uMid:{value:oi(t.sky.mid)},uHorizon:{value:oi(t.sky.horizon)},uGlow:{value:oi(t.sky.glow)},uSun:{value:f.clone().setZ(-Math.abs(f.z))},uStars:{value:t.sky.stars},uTime:{value:0},uNebula:{value:t.key==="rift"||t.key==="spire"?1:0}},g=new me({uniforms:d,side:pn,depthWrite:!1,fog:!1,vertexShader:"varying vec3 vD;void main(){vD=normalize(position);vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_Position.z=gl_Position.w;}",fragmentShader:`varying vec3 vD;uniform vec3 uZenith,uMid,uHorizon,uGlow,uSun;uniform float uStars,uTime,uNebula;${Si}
      float star(vec3 d){vec3 p=d*260.;vec3 i=floor(p);float h=fract(sin(dot(i,vec3(127.1,311.7,74.7)))*43758.5);vec3 f=fract(p)-.5;float s=step(.985,h)*smoothstep(.12,0.,length(f));return s*(.5+.5*sin(uTime*2.+h*90.));}
      void main(){vec3 d=normalize(vD);float y=d.y;
        vec3 c=mix(uHorizon,uMid,smoothstep(-.02,.14,y));c=mix(c,uZenith,smoothstep(.12,.6,y));
        c=mix(c,uHorizon*.55,smoothstep(.0,-.25,y));
        float sd=max(dot(d,normalize(uSun)),0.);c+=uGlow*pow(sd,6.)*.55+uGlow*pow(sd,60.)*1.2+vec3(1.,.95,.85)*smoothstep(.9993,.9997,sd)*6.;
        if(uNebula>.5){vec2 q=d.xy/(abs(d.z)+.6)*2.3;float n=fbm(q+vec2(0.,uTime*.003))*fbm(q*2.1+7.);c+=uGlow*pow(n,2.2)*.9*smoothstep(-.1,.5,y);}
        c+=vec3(.9,.95,1.)*star(d)*uStars*smoothstep(.05,.4,y)*2.;
        gl_FragColor=vec4(c,1.);}`}),x=new jt(new qn(9e3,48,24),g);if(x.renderOrder=-10,x.frustumCulled=!1,l.add(x),h.push(g,x.geometry),t.planet&&!t.enclosed){let v=t.planet,y={uColor:{value:oi(v.color)},uBand:{value:oi(v.band)},uSun:{value:f},uGlow:{value:oi(t.sky.glow)}},T=new me({uniforms:y,fog:!1,vertexShader:"varying vec3 vN;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec3 vN;varying vec3 vP;uniform vec3 uColor,uBand,uSun,uGlow;${Si}
        void main(){float lat=vP.y/length(vP);float b=fbm(vec2(lat*9.,lat*3.+fbm(vec2(vP.x*.002,lat*4.))*1.5));vec3 c=mix(uColor,uBand,smoothstep(.35,.7,b));
        vec3 L=normalize(vec3(-.6,.5,.6));float l=smoothstep(-.15,.6,dot(vN,L));float rim=pow(1.-max(vN.z,0.),3.);
        gl_FragColor=vec4(c*(l*1.05+.16)+uGlow*rim*.7*l+uGlow*rim*.22,1.);}`}),A=new jt(new qn(v.r,64,32),T);if(A.position.set(...v.pos),l.add(A),h.push(T,A.geometry),v.ring){let C=new Us(v.r*1.35,v.r*2.3,128,1),S={uColor:{value:oi(v.ring)},uIn:{value:v.r*1.35},uOut:{value:v.r*2.3}},b=new me({uniforms:S,transparent:!0,side:Je,depthWrite:!1,fog:!1,vertexShader:"varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec3 vP;uniform vec3 uColor;uniform float uIn,uOut;float h(float x){return fract(sin(x*91.7)*43758.5);}
          void main(){float t=(length(vP.xy)-uIn)/(uOut-uIn);float bands=.55+.45*sin(t*90.)*sin(t*23.+1.)+.25*(h(floor(t*140.))-.5);float a=smoothstep(0.,.05,t)*smoothstep(1.,.85,t)*clamp(bands,0.,1.);
          float shadow=vP.y<0.&&abs(vP.x)<uIn*.75?.25:1.;gl_FragColor=vec4(uColor*(.6+bands*.5)*shadow,a*.7);}`}),D=new jt(C,b);D.position.copy(A.position),D.rotation.set(-1.25,.3,.35),l.add(D),h.push(b,C)}let R=new jt(new qn(v.r*.12,32,16),new sn({color:oi(v.color).multiplyScalar(.7),fog:!1}));R.position.set(v.pos[0]+v.r*2.8,v.pos[1]-v.r*.4,v.pos[2]+400),l.add(R),h.push(R.geometry,R.material)}if(!t.enclosed){let v=Zs(t,{strata:t.key==="mesa"?1.4:.6,bump:1.2});h.push(v);let y=[],T=i==="low"?22:46;for(let F=0;F<T;F++){let B=-1100-u()*2800,G=-1500+u()*(r+3e3),X=(t.key==="mesa"?260:420)+u()*(t.key==="mesa"?700:900),j=120+u()*360,Z=new Pn(j*(.7+u()*.25),j,X,28,10,!1),J=Z.attributes.position,ot=u()*100;for(let Lt=0;Lt<J.count;Lt++){let Ut=J.getX(Lt),zt=J.getY(Lt),Ft=J.getZ(Lt),Q=Math.atan2(Ft,Ut),ht=(zt+X/2)/X,wt=Math.hypot(Ut,Ft);if(wt>1){let _t=t.key==="mesa"?Math.floor(ht*6+vn(Q,ot,0,2)*1.2)/6:ht;wt*=1+vn(Math.cos(Q)*2,Math.sin(Q)*2,ht*3+ot,3)*.35-_t*.18,Ut=Math.cos(Q)*wt,Ft=Math.sin(Q)*wt}ht>.99&&(zt+=vn(Ut*.01,Ft*.01,ot,2)*14),J.setXYZ(Lt,Ut+G,zt+X/2-o-60+u()*0,Ft+B)}Z.computeVertexNormals();let ft=new Float32Array(J.count*3).fill(1);Z.setAttribute("color",new Ce(ft,3)),Z.deleteAttribute("uv"),y.push(Z)}let A=new jt(Hn(y),v);a.add(A),h.push(A.geometry);let R=$s(),C=wi(t.crystal,1.4);h.push(R,C);let S=new rn(R,C,40),b=new Ue;for(let F=0;F<40;F++){b.position.set(-800+u()*(r+1600),-o-40+u()*120,-500-u()*2500),b.rotation.set((u()-.5)*.5,u()*6,(u()-.5)*.5);let B=.5+u()*1.1;b.scale.set(16*B,(90+u()*200)*B,16*B),b.updateMatrix(),S.setMatrixAt(F,b.matrix)}a.add(S);let D={uTime:{value:0},uColor:{value:oi(t.sky.horizon).lerp(oi("#ffffff"),.25)},uShade:{value:oi(t.sky.mid)}},N=new me({uniforms:D,transparent:!0,depthWrite:!1,fog:!1,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime;uniform vec3 uColor,uShade;${Si}
        void main(){vec2 p=vUv*vec2(6.,1.6)+vec2(uTime*.01,0.);float n=fbm(p)*1.1+fbm(p*2.7+3.)*.35;float a=smoothstep(.55,.95,n)*smoothstep(0.,.3,vUv.y)*smoothstep(1.,.6,vUv.y)*smoothstep(0.,.1,vUv.x)*smoothstep(1.,.9,vUv.x);
        gl_FragColor=vec4(mix(uShade,uColor,smoothstep(.5,1.1,n+vUv.y*.3)),a*.8);}`});h.push(N);for(let F=0;F<4;F++){let B=new jt(new cn(9e3,1400),N);B.position.set(r/2,-o+500+F*380,-3800-F*500),l.add(B),h.push(B.geometry)}c.push(F=>D.uTime.value=F)}let m={uTime:{value:0},uColor:{value:oi(t.key==="foundry"?"#ffb070":t.key==="spire"?"#d7a0ff":"#7ff0e0")}};if(t.enclosed){let v=new me({uniforms:m,transparent:!0,depthWrite:!1,blending:wn,side:Je,fog:!1,vertexShader:"varying vec2 vUv;varying float vF;void main(){vUv=uv;vec4 p=modelViewMatrix*vec4(position,1.);vF=clamp(-p.z/1600.,0.,1.);gl_Position=projectionMatrix*p;}",fragmentShader:`varying vec2 vUv;varying float vF;uniform float uTime;uniform vec3 uColor;${Si}
        void main(){float n=fbm(vec2(vUv.x*5.+uTime*.05,vUv.y*1.5-uTime*.12));float a=smoothstep(0.,.35,vUv.x)*smoothstep(1.,.65,vUv.x)*pow(vUv.y,1.4)*(.45+n*.8);
        gl_FragColor=vec4(uColor*a*.16*(1.-vF*.5),1.);}`});h.push(v);let y=i==="low"?10:24;for(let T=0;T<y;T++){let A=u()*r,R=Math.min(n.cols-1,Math.max(0,Math.floor(A/20))),C=e.ceil[R]<100?e.ceil[R]:0,S=e.ground[R]>-o?e.ground[R]:-o,b=Math.max(80,C-S+40),D=30+u()*70,N=new jt(new cn(D,b,1,1),v);N.position.set(A,S+b/2-10,-120-u()*160),N.rotation.set(0,(u()-.5)*.6,(u()-.5)*.35),a.add(N),h.push(N.geometry)}c.push(T=>m.uTime.value=T)}if(t.key==="vaults"||t.key==="spire"){let v=new qi(1,1,7,3);v.translate(0,-.5,0);let y=v.attributes.position;for(let F=0;F<y.count;F++)y.setX(F,y.getX(F)+vn(y.getY(F)*3,F*.1,0,2)*.12);v.computeVertexNormals();let T=Zs(t,{bump:1.5});h.push(v,T);let A=Math.round(n.cols*.8),R=new rn(v,T,A),C=new Ue,S=0;for(let F=0;F<A;F++){let B=u()*r,G=Math.floor(B/20),X=e.ceil[Math.max(0,Math.min(n.cols-1,G))];if(X>=100)continue;let j=-80-u()*240;C.position.set(B,X+6,j),C.rotation.set((u()-.5)*.2,u()*6,(u()-.5)*.2);let Z=.6+u()*1.4;C.scale.set(7*Z,(26+u()*50)*Z,7*Z),C.updateMatrix(),R.setMatrixAt(S++,C.matrix)}R.count=S,a.add(R);let b=$s(),D=wi(t.crystal,1.5);h.push(b,D);let N=new rn(b,D,60);S=0;for(let F=0;F<60;F++){let B=u()*r,G=Math.floor(B/20),X=e.ground[Math.max(0,Math.min(n.cols-1,G))];if(X<-o)continue;let j=-200-u()*120;C.position.set(B,X-8+u()*20,j),C.rotation.set((u()-.5)*.8,u()*6,(u()-.5)*.8);let Z=.8+u()*2;C.scale.set(12*Z,(40+u()*90)*Z,12*Z),C.updateMatrix(),N.setMatrixAt(S++,C.matrix)}N.count=S,a.add(N)}if(t.key==="foundry"){let v=new qe({color:"#4a4446",metalness:.85,roughness:.42}),y=new qe({color:"#221e20",metalness:.7,roughness:.55});h.push(v,y);let T=[],A=[],R=[];for(let J=-400;J<r+400;J+=140+u()*60){let ot=-150-u()*120,ft=-o+40,Lt=o+300,Ut=new Fe(26+u()*18,Lt,26+u()*18);if(Ut.translate(J,ft+Lt/2-60,ot),T.push(Ut),u()<.6){let zt=new Fe(150,10,8);zt.translate(J+70,-60-u()*200,ot+10),A.push(zt);let Ft=new Fe(150,3,10);Ft.rotateZ(.5),Ft.translate(J+70,-120-u()*120,ot+12),A.push(Ft)}if(u()<.3){let zt=e.floorAt(J+65,ot+16)+18,Ft=new cn(36,22);Ft.translate(J+65,zt+13,ot+17.5),R.push(Ft);let Q=new Fe(64,46,14);Q.translate(J+65,zt+20,ot+10),T.push(Q)}}if(a.add(new jt(Hn(T),v),new jt(Hn(A),y)),h.push(...T,...A),R.length){let J={uTime:{value:0}},ot=new me({uniforms:J,fog:!1,vertexShader:"varying vec3 vP;varying vec3 vN;void main(){vP=position;vN=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec3 vP;varying vec3 vN;uniform float uTime;${Si}void main(){float n=fbm(vec2(vP.x*.05,vP.y*.08-uTime*.8));float f=.75+.25*sin(uTime*7.+vP.x*.1);
          vec3 c=mix(vec3(.5,.06,0.),vec3(2.6,.9,.2),n*f);vec2 fp=fract(vP.xy/vec2(44.,30.));c*=mix(1.,.06,step(.78,fract(vP.x*.2)));c*=.35+.65*smoothstep(.9,.1,fp.y);gl_FragColor=vec4(c,1.);}`});h.push(ot),a.add(new jt(Hn(R),ot)),c.push(ft=>J.uTime.value=ft)}let C=new Pn(60,60,10,24,1);C.rotateX(Math.PI/2),h.push(C);for(let J=0;J<Math.ceil(r/700);J++){let ot=new Xe,ft=new jt(C,y);ot.add(ft);for(let Ut=0;Ut<12;Ut++){let zt=new jt(new Fe(14,18,10),y),Ft=Ut/12*Math.PI*2;zt.position.set(Math.cos(Ft)*64,Math.sin(Ft)*64,0),zt.rotation.z=Ft,ot.add(zt)}ot.position.set(300+J*700+u()*200,-80-u()*120,-260);let Lt=(u()<.5?-1:1)*(.2+u()*.3);a.add(ot),c.push(Ut=>ot.rotation.z=Ut*Lt)}let S={uTime:{value:0}},b=new me({uniforms:S,fog:!1,vertexShader:"varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}",fragmentShader:`varying vec3 vW;uniform float uTime;${Si}void main(){vec2 p=vW.xz*.012+vec2(uTime*.06,0.);float n=fbm(p+fbm(p*1.7+uTime*.03));
        vec3 c=mix(vec3(.25,.03,0.),vec3(4.,1.2,.25),smoothstep(.35,.85,n));c+=vec3(5.,2.,.6)*smoothstep(.82,.95,n);gl_FragColor=vec4(c,1.);}`});h.push(b);let D=[];for(let J=-400;J<=r+400;J+=20){let ot=e.floorAt(J,-225)+1.2;D.push(J,ot,-205,J,ot,-245)}let N=new Ee;N.setAttribute("position",new Kt(D,3));let F=[];for(let J=0;J<D.length/6-1;J++){let ot=J*2;F.push(ot,ot+1,ot+2,ot+1,ot+3,ot+2)}N.setIndex(F);let B=new jt(N,b);a.add(B),h.push(N),c.push(J=>S.uTime.value=J);let G=new Fe(1,5,4);h.push(G);let X=new rn(G,v,Math.ceil((r+800)/40)*2+4),j=new Ue,Z=0;for(let J=-400;J<=r+400;J+=40){let ot=e.floorAt(J,-225);for(let ft of[-203,-247])j.position.set(J,ot+1,ft),j.scale.set(40,1,1),j.updateMatrix(),X.setMatrixAt(Z++,j.matrix)}X.count=Z,a.add(X)}if(t.key==="spire"){let v=$s(),y=wi(t.crystal,1.2);h.push(v,y);let T=new rn(v,y,26),A=new Ue;for(let R=0;R<26;R++){A.position.set(u()*r,-o-60,-190-u()*130),A.rotation.set((u()-.5)*.25,u()*6,(u()-.5)*.25);let C=1+u()*1.2;A.scale.set(13*C,(o+160)*C*.7,13*C),A.updateMatrix(),T.setMatrixAt(R,A.matrix)}a.add(T),c.push(R=>{y.emissiveIntensity=1.6+Math.sin(R*1.3)*.5})}if(t.key==="rift"){let v=Dc(new Mi(1,3)),y=v.attributes.position;for(let b=0;b<y.count;b++){let D=new O().fromBufferAttribute(y,b);D.multiplyScalar(1+vn(D.x*2,D.y*2,D.z*2,3)*.45),D.y*=.6,y.setXYZ(b,D.x,D.y,D.z)}v.computeVertexNormals();let T=Zs(t,{bump:1.2}),A=new Float32Array(y.count*3).fill(1);v.setAttribute("color",new Ce(A,3)),h.push(v,T);let R=new rn(v,T,60),C=new Ue,S=[];for(let b=0;b<60;b++){let D=-320-u()*1600,N=(10+u()*28)*(1+(-D-320)/800);S.push({x:u()*r,y:-u()*o*1.2+60,z:D,s:N,sp:u()*6})}a.add(R),c.push(b=>{S.forEach((D,N)=>{C.position.set(D.x,D.y+Math.sin(b*.4+D.sp)*10,D.z),C.rotation.set(D.sp,b*.05+D.sp,0),C.scale.setScalar(D.s),C.updateMatrix(),R.setMatrixAt(N,C.matrix)}),R.instanceMatrix.needsUpdate=!0})}function p(v,y){l.position.copy(y.position),d.uTime.value=v;for(let T of c)T(v)}function M(){h.forEach(v=>v.dispose&&v.dispose())}return{group:a,sky:l,update:p,dispose:M}}var jv=new It,Uc=class{constructor(t,e){this.max=t,this.head=0,this.time=0,this.dirtyMin=1/0,this.dirtyMax=-1;let i=new $o;i.setAttribute("position",new Kt([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]);let s=o=>{let a=new is(new Float32Array(t*o),o);return a.setUsage(kr),a};this.aPos=s(3),this.aVel=s(3),this.aCol=s(4),this.aT=s(4),this.aPh=s(4),i.setAttribute("aPos",this.aPos),i.setAttribute("aVel",this.aVel),i.setAttribute("aCol",this.aCol),i.setAttribute("aT",this.aT),i.setAttribute("aPh",this.aPh),i.instanceCount=t;for(let o=0;o<t;o++)this.aT.array[o*4]=-1e6,this.aT.array[o*4+1]=.001;let r=e==="smoke";this.uniforms={uTime:{value:0},uLight:{value:new It(1,1,1)},uAmbient:{value:new It(.4,.4,.45)}},this.material=new me({uniforms:this.uniforms,transparent:!0,depthWrite:!1,blending:r?Gi:wn,vertexShader:`attribute vec3 aPos,aVel;attribute vec4 aCol,aT,aPh;uniform float uTime;varying vec4 vCol;varying vec2 vUv;varying float vAge;varying float vSeed;
        void main(){float age=uTime-aT.x;float life=aT.y;if(age<0.||age>life){gl_Position=vec4(2.,2.,2.,1.);return;}
          float k=max(aPh.y,.0001);float e=1.-exp(-k*age);vec3 p=aPos+aVel*e/k;p.y+=aPh.x*(age/k-e/(k*k));
          float t=age/life;float size=mix(aT.z,aT.w,t);
          vec4 mv=modelViewMatrix*vec4(p,1.);vec2 q=position.xy;
          if(aPh.z>0.){vec3 v=aVel*exp(-k*age);v.y+=aPh.x*e/k;vec3 vv=(modelViewMatrix*vec4(v,0.)).xyz;vec2 dir=length(vv.xy)>.001?normalize(vv.xy):vec2(1.,0.);
            float stretch=1.+length(vv.xy)*aPh.z;vec2 side=vec2(-dir.y,dir.x);mv.xy+=dir*q.x*size*stretch+side*q.y*size*.35;}
          else{float a=aPh.w*age+aT.x*7.;mat2 R=mat2(cos(a),-sin(a),sin(a),cos(a));mv.xy+=R*q*size;}
          gl_Position=projectionMatrix*mv;vUv=q;vAge=t;vSeed=fract(aT.x*13.7);
          float fade=${r?"smoothstep(0.,.15,t)*(1.-smoothstep(.45,1.,t))":"pow(1.-t,1.4)"};vCol=vec4(aCol.rgb,aCol.a*fade);}`,fragmentShader:`varying vec4 vCol;varying vec2 vUv;varying float vAge;varying float vSeed;uniform vec3 uLight,uAmbient;${Si}
        void main(){float d=length(vUv);if(d>1.)discard;
          ${r?"float n=fbm(vUv*1.7+vSeed*9.+vAge*.8);float a=smoothstep(1.,.25,d+n*.45-.2)*vCol.a;vec3 c=vCol.rgb*(uAmbient+uLight*clamp(.55-vUv.y*.5+n*.3,0.,1.));gl_FragColor=vec4(c,a);":"float a=pow(max(0.,1.-d),2.2);gl_FragColor=vec4(vCol.rgb*vCol.a*a,1.);"}}`}),this.mesh=new jt(i,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=r?4:5}emit(t,e,i,s,r,o,a,l,c,h,u,f,d,g=0,x=0,m=0,p=0,M=0){let v=this.head;this.head=(this.head+1)%this.max,this.aPos.array.set([t,e,i],v*3),this.aVel.array.set([s,r,o],v*3),this.aCol.array.set([a,l,c,h],v*4),this.aT.array.set([this.time+M,u,f,d],v*4),this.aPh.array.set([g,x,m,p],v*4),v<this.dirtyMin&&(this.dirtyMin=v),v>this.dirtyMax&&(this.dirtyMax=v)}update(t){if(this.time=t,this.uniforms.uTime.value=t,this.dirtyMax>=0){let e=this.dirtyMin,i=this.dirtyMax-e+1;for(let[s,r]of[[this.aPos,3],[this.aVel,3],[this.aCol,4],[this.aT,4],[this.aPh,4]])s.clearUpdateRanges(),s.addUpdateRange(e*r,i*r),s.needsUpdate=!0;this.dirtyMin=1/0,this.dirtyMax=-1}}clear(){for(let t=0;t<this.max;t++)this.aT.array[t*4]=-1e6;this.aT.needsUpdate=!0,this.aT.clearUpdateRanges()}};function Xf(n,t){let e=t==="low",i=new Uc(e?2500:7e3,"add"),s=new Uc(e?500:1400,"smoke");n.add(i.mesh,s.mesh);let r=Math.random,o=new Mi(1,0);{let nt=o.attributes.position;for(let rt=0;rt<nt.count;rt++)nt.setXYZ(rt,nt.getX(rt)*(.7+rt*37%11/22),nt.getY(rt)*.7,nt.getZ(rt));o.computeVertexNormals()}let a=new qe({roughness:.7,metalness:.25}),l=e?120:320,c=new rn(o,a,l);c.instanceMatrix.setUsage(kr),c.castShadow=!0,c.count=0,c.setColorAt(0,new It),n.add(c);let h=[],u=new Ue,f=new qe({color:"#000",emissive:new It("#ff7a2a"),emissiveIntensity:4}),d=new rn(o,f,e?40:120);d.count=0,d.instanceMatrix.setUsage(kr),n.add(d);let g=[],x=new Is(1,1,3,8),m=new sn({color:16777215,toneMapped:!1}),p=320,M=new rn(x,m,p);M.instanceMatrix.setUsage(kr),M.setColorAt(0,new It),M.count=0,M.frustumCulled=!1,n.add(M);let v=new me({uniforms:{uColor:{value:new It},uA:{value:1}},transparent:!0,depthWrite:!1,blending:wn,side:Je,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"varying vec2 vUv;uniform vec3 uColor;uniform float uA;void main(){float d=abs(vUv.y-.5)*2.;float a=pow(1.-d,3.)*uA;gl_FragColor=vec4(uColor*a*2.,1.);}"}),y=new Us(.82,1,64,1);{let nt=y.attributes.uv,rt=y.attributes.position;for(let P=0;P<rt.count;P++){let w=Math.hypot(rt.getX(P),rt.getY(P));nt.setXY(P,0,(w-.82)/.18)}}let T=[],A={uTime:{value:0},uColor:{value:new It("#6cf3ff")},uLen:{value:240}},R=new me({uniforms:A,transparent:!0,depthWrite:!1,blending:wn,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime,uLen;uniform vec3 uColor;${Si}
      void main(){float x=vUv.x*uLen;float w=abs(vUv.y-.5)*2.;float n=fbm(vec2(x*.05-uTime*14.,vUv.y*3.+uTime*3.));
        float edge=.35+.45*n;float core=smoothstep(.22,0.,w);float body=smoothstep(edge,edge*.3,w);float flick=.85+.15*sin(uTime*90.+x*.3);
        float tip=smoothstep(0.,.04,vUv.x)*(1.-smoothstep(.96,1.,vUv.x)*.5);
        vec3 c=(uColor*body*1.15+vec3(1.)*core*1.7)*flick*tip;gl_FragColor=vec4(c,1.);}`}),C=new jt(new cn(1,1,1,1),R);C.geometry.translate(.5,0,0),C.visible=!1,C.renderOrder=6,n.add(C);let S=4,b=22,D=new Ee;D.setAttribute("position",new Ce(new Float32Array(S*b*2*3*3),3));let N=new sn({color:new It("#9ff8ff").multiplyScalar(2.2),transparent:!0,blending:wn,depthWrite:!1,toneMapped:!1}),F=new jt(D,N);F.frustumCulled=!1,F.visible=!1,F.renderOrder=6,n.add(F);let B={uTime:{value:0}},G=new me({uniforms:B,transparent:!0,depthWrite:!1,blending:wn,side:Je,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime;${Si}void main(){float x=abs(vUv.x-.5)*2.;float n=fbm(vec2(vUv.x*4.,vUv.y*9.-uTime*6.));
      float a=smoothstep(.55+n*.4,0.,x);float core=smoothstep(.12,0.,abs(x-n*.15));vec3 c=vec3(.4,1.,.85)*a*1.4+vec3(1.)*core*2.;gl_FragColor=vec4(c,1.);}`}),X=[],j=e?4:t==="ultra"?12:8,Z=[];for(let nt=0;nt<j;nt++){let rt=new Jo(16777215,0,160,1.6);rt.castShadow=!1,n.add(rt),Z.push(rt)}let J=[],ot=[];function ft(nt,rt,P,w,U,q){J.push({x:nt,y:rt,z:P,color:w,intensity:U,distance:q})}function Lt(nt,rt,P,w,U,q){ot.push({x:nt,y:rt,color:new It(P),intensity:w,distance:U,life:q,age:0})}let Ut=0,zt=nt=>{Ut=Math.min(1.6,Ut+nt)};function Ft(nt){return jv.set(nt)}function Q(nt,rt,P,w=12,U=180,q={}){let k=Ft(P);for(let z=0;z<w;z++){let xt=r()*Math.PI*2,vt=U*(.3+r()*.9),yt=(r()-.5)*U*.8;i.emit(nt,-rt,q.z??4,Math.cos(xt)*vt,Math.sin(xt)*vt+(q.up||0),yt,k.r*1.6,k.g*1.6,k.b*1.6,1,.18+r()*.35*(q.life||1),1.1+r()*.8,.2,q.grav??-420,3,.018,0)}}function ht(nt,rt,P,w=6,U=12,q={}){let k=Ft(P);for(let z=0;z<w;z++){let xt=r()*Math.PI*2,vt=(q.speed||30)*(.3+r());s.emit(nt+(r()-.5)*6,-rt+(r()-.5)*6,(q.z??0)+(r()-.5)*14,Math.cos(xt)*vt,Math.sin(xt)*vt*.6+(q.rise??22),(r()-.5)*20,k.r,k.g,k.b,q.alpha??.55,(q.life||1.2)*(.7+r()*.6),U*(.6+r()*.4),U*(2+r()*1.4),q.grav??30,1.4,0,0)}}function wt(nt,rt,P,w,U,q=6,k=1.5){let z=Ft(P);i.emit(nt,-rt,q,0,0,0,z.r*k,z.g*k,z.b*k,1,U,w,w*1.6,0,1,0,0)}function _t(nt,rt,P,w,U,q={}){let k=new jt(y,v.clone());k.material.uniforms.uColor.value.set(P),k.position.set(nt,-rt,q.z??8),q.flat&&(k.rotation.x=-Math.PI/2),n.add(k),T.push({m:k,radius:w,life:U,age:0,start:q.start||2})}function At(nt,rt,P,w,U=160,q=2.2,k=0){let z=new It(P);for(let xt=0;xt<w;xt++){let vt=r()*Math.PI*2,yt=U*(.35+r()*.8),gt=r()<k,Mt={x:nt,y:-rt,z:(r()-.5)*20,vx:Math.cos(vt)*yt,vy:Math.abs(Math.sin(vt))*yt*1.1+60,vz:(r()-.5)*yt*.6,rx:r()*6,ry:r()*6,wr:(r()-.5)*14,s:q*(.5+r()),life:1.6+r()*1.4,age:0,c:z.clone().multiplyScalar(.6+r()*.5)};gt?g.length<d.instanceMatrix.count&&g.push(Mt):h.length<l&&h.push(Mt)}}function se(nt,rt,P=1,w){let U=P;wt(nt,rt,"#ffd9a0",26*U,.22,10,2.4),wt(nt,rt,"#ff8a3c",40*U,.4,8,1.4);for(let q=0;q<Math.round(14*U);q++){let k=r()*Math.PI*2,z=(60+r()*120)*U,xt=Ft(r()<.5?"#ffb050":"#ff5a1e");i.emit(nt,-rt,(r()-.5)*20,Math.cos(k)*z,Math.sin(k)*z,(r()-.5)*z,xt.r*2,xt.g*2,xt.b*2,1,.35+r()*.3,(7+r()*6)*U,(16+r()*10)*U,40,4,0,1.5)}Q(nt,rt,"#ffd08a",Math.round(26*U),260*U,{grav:-520}),ht(nt,rt,w&&w.key==="vaults"?"#3a5458":"#3a3230",Math.round(7*U),11*U,{life:1.6,speed:45*U,rise:30,alpha:.6}),At(nt,rt,w?w.rock.base:"#6a5a50",Math.round(7*U),190*U,2.2*Math.sqrt(U),.25),U>=1.4&&_t(nt,rt,"#ffb070",70*U,.45),Lt(nt,rt,"#ffa050",9*U,170*U,.32+.1*U),zt(.25*U)}function _e(nt,rt,P,w,U){i.update(rt),s.update(rt);let q=(k,z,xt)=>{let vt=0;for(let yt=k.length-1;yt>=0;yt--){let gt=k[yt];if(gt.age+=nt,gt.age>gt.life){k.splice(yt,1);continue}gt.vy-=640*nt;let Mt=gt.x+gt.vx*nt,Nt=gt.y+gt.vy*nt;U(Mt,-Nt)?U(gt.x,-Nt)?(gt.vy*=-.38,gt.vx*=.7,gt.wr*=.6):gt.vx*=-.5:(gt.x=Mt,gt.y=Nt),gt.z+=gt.vz*nt,gt.vz*=.98,gt.rx+=gt.wr*nt,gt.ry+=gt.wr*.7*nt}k.forEach((yt,gt)=>{let Mt=1-Math.max(0,(yt.age-yt.life+.4)/.4);u.position.set(yt.x,yt.y,yt.z),u.rotation.set(yt.rx,yt.ry,0),u.scale.setScalar(yt.s*Mt),u.updateMatrix(),z.setMatrixAt(gt,u.matrix),xt&&z.setColorAt(gt,yt.c)}),z.count=k.length,z.instanceMatrix.needsUpdate=!0,xt&&z.instanceColor&&(z.instanceColor.needsUpdate=!0)};q(h,c,!0),q(g,d,!1);for(let k=g.length-1;k>=0;k--)r()<nt*20&&i.emit(g[k].x,g[k].y,g[k].z,0,10,0,1.6,.6,.2,1,.25,1.6,.4,0,1,0,0);for(let k=T.length-1;k>=0;k--){let z=T[k];z.age+=nt;let xt=z.age/z.life;if(xt>=1){n.remove(z.m),z.m.material.dispose(),T.splice(k,1);continue}z.m.scale.setScalar(z.start+xt*z.radius),z.m.material.uniforms.uA.value=(1-xt)*(1-xt)}for(let k=X.length-1;k>=0;k--){let z=X[k];z.age+=nt,z.age>z.life&&(n.remove(z.m),z.m.geometry.dispose(),X.splice(k,1))}B.uTime.value=rt,A.uTime.value=rt;for(let k=ot.length-1;k>=0;k--){let z=ot[k];if(z.age+=nt,z.age>z.life){ot.splice(k,1);continue}let xt=1-z.age/z.life;J.push({x:z.x,y:-z.y,z:30,color:z.color,intensity:z.intensity*xt*xt,distance:z.distance})}J.sort((k,z)=>z.intensity/(1+Math.abs(z.x-w.x)*.004)-k.intensity/(1+Math.abs(k.x-w.x)*.004));for(let k=0;k<j;k++){let z=Z[k],xt=J[k];xt?(z.position.set(xt.x,xt.y,xt.z),z.color.set(xt.color),z.intensity=xt.intensity*1500,z.distance=xt.distance*2.2):z.intensity=0}J=[],Ut=Math.max(0,Ut-nt*2.2)}let I=new Ue,H=new O(0,1,0),Y=new O;function W(nt,rt,P){let w=0,U=new It,q=(k,z,xt,vt,yt,gt,Mt,Nt)=>{w>=p||(I.position.set(k,-z,4),Y.set(xt||1,-(vt||0),0).normalize(),I.quaternion.setFromUnitVectors(H,Y),I.scale.set(gt,yt,gt),I.updateMatrix(),M.setMatrixAt(w,I.matrix),U.set(Mt).multiplyScalar(Nt),M.setColorAt(w,U),w++)};for(let k of nt.pshots)if(!(k.life<=0||k.x<rt-40||k.x>rt+P+40))if(k.kind==="bounce")q(k.x,k.y,k.vx,k.vy,2.6,2.6,"#ff7ad9",3.2),r()<.7&&i.emit(k.x,-k.y,4,0,0,0,1.6,.5,1.3,1,.25,4,1,0,1,0,0),ft(k.x,-k.y,14,"#ff6ad0",.5,70);else{let z=Math.hypot(k.vx,k.vy);q(k.x,k.y,k.vx,k.vy,Math.max(4,z*.016),1.05,"#ffd23f",2.2),r()<.3&&i.emit(k.x,-k.y,4,0,0,0,1.1,.8,.25,1,.1,2.4,.6,0,1,0,0)}for(let k of nt.eshots)if(!(k.life<=0||k.x<rt-40||k.x>rt+P+40))if(k.kind==="wave")q(k.x+k.w/2,k.y+k.h/2,k.vx,0,6,5,"#ffb070",3),i.emit(k.x+k.w/2,-(k.y+k.h),2,0,40,0,1.8,.9,.4,1,.3,7,2,0,1,0,0),ft(k.x,-k.y,10,"#ff9040",.8,70);else if(k.kind==="lob")q(k.x,k.y,k.vx,k.vy,4,4,"#b7ff68",2.4),r()<.6&&i.emit(k.x,-k.y,4,0,0,0,.8,1.6,.4,1,.3,5,1,0,1,0,0);else{let z=k.flame||k.kind==="flame";q(k.x,k.y,k.vx,k.vy,z?5:3.4,z?3.4:2.6,z?"#ff8a3c":"#ff4a6a",3),r()<.5&&i.emit(k.x,-k.y,4,0,0,0,1.8,.4,.5,1,.18,4.5,1,0,1,0,0)}M.count=w,M.instanceMatrix.needsUpdate=!0,M.instanceColor&&(M.instanceColor.needsUpdate=!0)}function tt(nt,rt,P,w){let U=nt.beamActive&&nt.beam;if(C.visible=F.visible=!!U,!U)return;if(w&&Math.hypot(w.x-U.ox,w.y-U.oy)<24){let Dt=U.ox+U.dx*U.len,te=U.oy+U.dy*U.len,V=Math.hypot(Dt-w.x,te-w.y)||1;U={...U,ox:w.x,oy:w.y,dx:(Dt-w.x)/V,dy:(te-w.y)/V,len:V}}let q=Math.max(4,U.len),k=(U.width||10)*1.6,z=Math.atan2(-U.dy,U.dx);C.position.set(U.ox,-U.oy,5),C.rotation.set(0,0,z),C.scale.set(q,k*1.25,1),A.uLen.value=q;let xt=D.attributes.position.array,vt=0,yt=-Math.sin(z),gt=Math.cos(z),Mt=Math.cos(z),Nt=Math.sin(z);for(let Dt=0;Dt<S;Dt++){let te=U.ox,V=-U.oy,bt=0,Pt=Dt?5+Dt*2:2;for(let Wt=1;Wt<=b;Wt++){let St=Wt/b;bt=(r()-.5)*Pt*Math.sin(St*Math.PI)*2+bt*.35;let pt=U.ox+Mt*q*St+yt*bt,Yt=-U.oy+Nt*q*St+gt*bt,ie=Dt?.35:.7;for(let[st,dt]of[[te+yt*ie,V+gt*ie],[te-yt*ie,V-gt*ie],[pt-yt*ie,Yt-gt*ie],[te+yt*ie,V+gt*ie],[pt-yt*ie,Yt-gt*ie],[pt+yt*ie,Yt+gt*ie]])xt[vt++]=st,xt[vt++]=dt,xt[vt++]=6;te=pt,V=Yt}}D.attributes.position.needsUpdate=!0,D.computeBoundingSphere();let oe=U.ox+U.dx*q,Jt=U.oy+U.dy*q;r()<.8&&Q(oe,Jt,"#9ff8ff",2,160,{life:.6}),r()<.3&&wt(oe,Jt,"#6cf3ff",10,.1,6,1.6),ft(U.ox+U.dx*q*.3,-(U.oy+U.dy*q*.3),18,"#5af6ff",2.2,110),ft(oe,-Jt,18,"#9ff8ff",2,90)}function et(nt,rt,P){let w=new jt(new cn(26,P+120),G);w.position.set(nt,-(rt+P/2),10),n.add(w),X.push({m:w,age:0,life:.4});for(let U=0;U<30;U++)i.emit(nt+(r()-.5)*10,-(rt+r()*P),8,(r()-.5)*60,(r()-.5)*60,(r()-.5)*40,.6,1.6,1.3,1,.4,3,.5,0,2,.01,0);ft(nt,-(rt+P/2),20,"#67ffd4",4,260)}function it(nt){let rt=0;for(let P of nt)P.line&&X[rt]&&(X[rt].m.position.x=P.x,rt++)}function at(){i.clear(),s.clear(),h.length=0,g.length=0,c.count=0,d.count=0;for(let nt of T)n.remove(nt.m),nt.m.material.dispose();T.length=0;for(let nt of X)n.remove(nt.m);X.length=0,ot.length=0}return{glow:i,smoke:s,sparks:Q,puff:ht,glowBall:wt,ring:_t,chunks:At,explosion:se,update:_e,drawShots:W,drawBeam:tt,shockwall:et,moveWalls:it,light:ft,flashLight:Lt,shakeImpulse:zt,get shake(){return Ut},clear:at,stats:()=>({debris:h.length,rings:T.length,lights:j})}}var Li={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var Vn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Qv=new Bs(-1,1,1,-1,0,1),Cu=class extends Ee{constructor(){super(),this.setAttribute("position",new Kt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Kt([0,2,0,0,2,0],2))}},ty=new Cu,Ni=class{constructor(t){this._mesh=new jt(ty,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Qv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var Xr=class extends Vn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof me?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=zn.clone(t.uniforms),this.material=new me({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Ni(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var ha=class extends Vn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){let s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Fc=class extends Vn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var Oc=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let i=t.getSize(new mt);this._width=i.width,this._height=i.height,e=new ln(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Tn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Xr(Li),this.copyPass.material.blending=un,this.clock=new Ko}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());let e=this.renderer.getRenderTarget(),i=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),o.needsSwap){if(i){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}ha!==void 0&&(o instanceof ha?i=!0:o instanceof Fc&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new mt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var kc=class extends Vn{constructor(t,e,i=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new It}render(t,e,i){let s=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=s}};var qf={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new It(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var qr=class n extends Vn{constructor(t,e=1,i,s){super(),this.strength=e,this.radius=i,this.threshold=s,this.resolution=t!==void 0?new mt(t.x,t.y):new mt(256,256),this.clearColor=new It(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new ln(r,o,{type:Tn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let u=new ln(r,o,{type:Tn});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);let f=new ln(r,o,{type:Tn});f.texture.name="UnrealBloomPass.v"+h,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),o=Math.round(o/2)}let a=qf;this.highPassUniforms=zn.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new me({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new mt(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new O(1,1,1),new O(1,1,1),new O(1,1,1),new O(1,1,1),new O(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=zn.clone(Li.uniforms),this.blendMaterial=new me({uniforms:this.copyUniforms,vertexShader:Li.vertexShader,fragmentShader:Li.fragmentShader,blending:wn,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new It,this._oldClearAlpha=1,this._basic=new sn,this._fsQuad=new Ni(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new mt(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(t,e,i,s,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=n.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=n.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){let e=[];for(let i=0;i<t;i++)e.push(.39894*Math.exp(-.5*i*i/(t*t))/t);return new me({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new mt(.5,.5)},direction:{value:new mt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
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
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(t){return new me({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}};qr.BlurDirectionX=new mt(1,0);qr.BlurDirectionY=new mt(0,1);var ua={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var Bc=class extends Vn{constructor(){super(),this.uniforms=zn.clone(ua.uniforms),this.material=new Xo({name:ua.name,uniforms:this.uniforms,vertexShader:ua.vertexShader,fragmentShader:ua.fragmentShader}),this._fsQuad=new Ni(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},Re.getTransfer(this._outputColorSpace)===Ne&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Fl?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ol?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===kl?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ur?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===zl?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Hl?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Bl&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var da={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new mt},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new ne},cameraProjectionMatrixInverse:{value:new ne},cameraWorldMatrix:{value:new ne},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new O(-1,-1,-1)},sceneBoxMax:{value:new O(1,1,1)}},vertexShader:`

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

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
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
			if (depth >= 1.0) {
				discard;
				return;
			}
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
		}`},fa={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
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

		}`},zc={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
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
		}`};function Yf(n=5){let t=Math.floor(n)%2===0?Math.floor(n)+1:Math.floor(n),e=ey(t),i=e.length,s=new Uint8Array(i*4);for(let o=0;o<i;++o){let a=e[o],l=2*Math.PI*a/i,c=new O(Math.cos(l),Math.sin(l),0).normalize();s[o*4]=(c.x*.5+.5)*255,s[o*4+1]=(c.y*.5+.5)*255,s[o*4+2]=127,s[o*4+3]=255}let r=new kn(s,t,t);return r.wrapS=Cn,r.wrapT=Cn,r.needsUpdate=!0,r}function ey(n){let t=Math.floor(n)%2===0?Math.floor(n)+1:Math.floor(n),e=t*t,i=Array(e).fill(0),s=Math.floor(t/2),r=t-1;for(let o=1;o<=e;){if(s===-1&&r===t?(r=t-2,s=0):(r===t&&(r=0),s<0&&(s=t-1)),i[s*t+r]!==0){r-=2,s++;continue}else i[s*t+r]=o++;r++,s--}return i}var pa={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:Pu(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new mt},cameraProjectionMatrixInverse:{value:new ne},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

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

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
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
		}`};function Pu(n,t,e){let i=ny(n,t,e),s="vec3[SAMPLES](";for(let r=0;r<n;r++){let o=i[r];s+=`vec3(${o.x}, ${o.y}, ${o.z})${r<n-1?",":")"}`}return s}function ny(n,t,e){let i=[];for(let s=0;s<n;s++){let r=2*Math.PI*t*s/n,o=Math.pow(s/(n-1),e);i.push(new O(Math.cos(r),Math.sin(r),o))}return i}var Hc=class{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let i,s,r,o=.5*(Math.sqrt(3)-1),a=(t+e)*o,l=Math.floor(t+a),c=Math.floor(e+a),h=(3-Math.sqrt(3))/6,u=(l+c)*h,f=l-u,d=c-u,g=t-f,x=e-d,m,p;g>x?(m=1,p=0):(m=0,p=1);let M=g-m+h,v=x-p+h,y=g-1+2*h,T=x-1+2*h,A=l&255,R=c&255,C=this.perm[A+this.perm[R]]%12,S=this.perm[A+m+this.perm[R+p]]%12,b=this.perm[A+1+this.perm[R+1]]%12,D=.5-g*g-x*x;D<0?i=0:(D*=D,i=D*D*this._dot(this.grad3[C],g,x));let N=.5-M*M-v*v;N<0?s=0:(N*=N,s=N*N*this._dot(this.grad3[S],M,v));let F=.5-y*y-T*T;return F<0?r=0:(F*=F,r=F*F*this._dot(this.grad3[b],y,T)),70*(i+s+r)}noise3d(t,e,i){let s,r,o,a,c=(t+e+i)*.3333333333333333,h=Math.floor(t+c),u=Math.floor(e+c),f=Math.floor(i+c),d=1/6,g=(h+u+f)*d,x=h-g,m=u-g,p=f-g,M=t-x,v=e-m,y=i-p,T,A,R,C,S,b;M>=v?v>=y?(T=1,A=0,R=0,C=1,S=1,b=0):M>=y?(T=1,A=0,R=0,C=1,S=0,b=1):(T=0,A=0,R=1,C=1,S=0,b=1):v<y?(T=0,A=0,R=1,C=0,S=1,b=1):M<y?(T=0,A=1,R=0,C=0,S=1,b=1):(T=0,A=1,R=0,C=1,S=1,b=0);let D=M-T+d,N=v-A+d,F=y-R+d,B=M-C+2*d,G=v-S+2*d,X=y-b+2*d,j=M-1+3*d,Z=v-1+3*d,J=y-1+3*d,ot=h&255,ft=u&255,Lt=f&255,Ut=this.perm[ot+this.perm[ft+this.perm[Lt]]]%12,zt=this.perm[ot+T+this.perm[ft+A+this.perm[Lt+R]]]%12,Ft=this.perm[ot+C+this.perm[ft+S+this.perm[Lt+b]]]%12,Q=this.perm[ot+1+this.perm[ft+1+this.perm[Lt+1]]]%12,ht=.6-M*M-v*v-y*y;ht<0?s=0:(ht*=ht,s=ht*ht*this._dot3(this.grad3[Ut],M,v,y));let wt=.6-D*D-N*N-F*F;wt<0?r=0:(wt*=wt,r=wt*wt*this._dot3(this.grad3[zt],D,N,F));let _t=.6-B*B-G*G-X*X;_t<0?o=0:(_t*=_t,o=_t*_t*this._dot3(this.grad3[Ft],B,G,X));let At=.6-j*j-Z*Z-J*J;return At<0?a=0:(At*=At,a=At*At*this._dot3(this.grad3[Q],j,Z,J)),32*(s+r+o+a)}noise4d(t,e,i,s){let r=this.grad4,o=this.simplex,a=this.perm,l=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,h,u,f,d,g,x=(t+e+i+s)*l,m=Math.floor(t+x),p=Math.floor(e+x),M=Math.floor(i+x),v=Math.floor(s+x),y=(m+p+M+v)*c,T=m-y,A=p-y,R=M-y,C=v-y,S=t-T,b=e-A,D=i-R,N=s-C,F=S>b?32:0,B=S>D?16:0,G=b>D?8:0,X=S>N?4:0,j=b>N?2:0,Z=D>N?1:0,J=F+B+G+X+j+Z,ot=o[J][0]>=3?1:0,ft=o[J][1]>=3?1:0,Lt=o[J][2]>=3?1:0,Ut=o[J][3]>=3?1:0,zt=o[J][0]>=2?1:0,Ft=o[J][1]>=2?1:0,Q=o[J][2]>=2?1:0,ht=o[J][3]>=2?1:0,wt=o[J][0]>=1?1:0,_t=o[J][1]>=1?1:0,At=o[J][2]>=1?1:0,se=o[J][3]>=1?1:0,_e=S-ot+c,I=b-ft+c,H=D-Lt+c,Y=N-Ut+c,W=S-zt+2*c,tt=b-Ft+2*c,et=D-Q+2*c,it=N-ht+2*c,at=S-wt+3*c,nt=b-_t+3*c,rt=D-At+3*c,P=N-se+3*c,w=S-1+4*c,U=b-1+4*c,q=D-1+4*c,k=N-1+4*c,z=m&255,xt=p&255,vt=M&255,yt=v&255,gt=a[z+a[xt+a[vt+a[yt]]]]%32,Mt=a[z+ot+a[xt+ft+a[vt+Lt+a[yt+Ut]]]]%32,Nt=a[z+zt+a[xt+Ft+a[vt+Q+a[yt+ht]]]]%32,oe=a[z+wt+a[xt+_t+a[vt+At+a[yt+se]]]]%32,Jt=a[z+1+a[xt+1+a[vt+1+a[yt+1]]]]%32,Dt=.6-S*S-b*b-D*D-N*N;Dt<0?h=0:(Dt*=Dt,h=Dt*Dt*this._dot4(r[gt],S,b,D,N));let te=.6-_e*_e-I*I-H*H-Y*Y;te<0?u=0:(te*=te,u=te*te*this._dot4(r[Mt],_e,I,H,Y));let V=.6-W*W-tt*tt-et*et-it*it;V<0?f=0:(V*=V,f=V*V*this._dot4(r[Nt],W,tt,et,it));let bt=.6-at*at-nt*nt-rt*rt-P*P;bt<0?d=0:(bt*=bt,d=bt*bt*this._dot4(r[oe],at,nt,rt,P));let Pt=.6-w*w-U*U-q*q-k*k;return Pt<0?g=0:(Pt*=Pt,g=Pt*Pt*this._dot4(r[Jt],w,U,q,k)),27*(h+u+f+d+g)}_dot(t,e,i){return t[0]*e+t[1]*i}_dot3(t,e,i,s){return t[0]*e+t[1]*i+t[2]*s}_dot4(t,e,i,s,r){return t[0]*e+t[1]*i+t[2]*s+t[3]*r}};var Yr=class n extends Vn{constructor(t,e,i=512,s=512,r,o,a){super(),this.width=i,this.height=s,this.clear=!0,this.camera=e,this.scene=t,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=Yf(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new ln(this.width,this.height,{type:Tn}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new me({defines:Object.assign({},da.defines),uniforms:zn.clone(da.uniforms),vertexShader:da.vertexShader,fragmentShader:da.fragmentShader,blending:un,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new qo,this.normalMaterial.blending=un,this.pdMaterial=new me({defines:Object.assign({},pa.defines),uniforms:zn.clone(pa.uniforms),vertexShader:pa.vertexShader,fragmentShader:pa.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new me({defines:Object.assign({},fa.defines),uniforms:zn.clone(fa.uniforms),vertexShader:fa.vertexShader,fragmentShader:fa.fragmentShader,blending:un}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new me({uniforms:zn.clone(Li.uniforms),vertexShader:Li.vertexShader,fragmentShader:Li.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:Qo,blendDst:zs,blendEquation:ei,blendSrcAlpha:jo,blendDstAlpha:zs,blendEquationAlpha:ei}),this.blendMaterial=new me({uniforms:zn.clone(zc.uniforms),vertexShader:zc.vertexShader,fragmentShader:zc.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:Rl,blendSrc:Qo,blendDst:zs,blendEquation:ei,blendSrcAlpha:jo,blendDstAlpha:zs,blendEquationAlpha:ei}),this._fsQuad=new Ni(null),this._originalClearColor=new It,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),a!==void 0&&this.updatePdMaterial(a)}setSize(t,e){this.width=t,this.height=e,this.gtaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.pdRenderTarget.setSize(t,e),this.gtaoMaterial.uniforms.resolution.value.set(t,e),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(t,e),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(t,e){t!==void 0?(this.depthTexture=t,this.normalTexture=e,this._renderGBuffer=!1):(this.depthTexture=new Ps,this.depthTexture.format=cs,this.depthTexture.type=ls,this.normalRenderTarget=new ln(this.width,this.height,{minFilter:fn,magFilter:fn,type:Tn,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let i=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=i,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=i,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(t){t?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(t.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(t.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(t){t.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=t.radius),t.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=t.distanceExponent),t.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=t.thickness),t.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=t.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),t.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=t.scale),t.samples!==void 0&&t.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=t.samples,this.gtaoMaterial.needsUpdate=!0),t.screenSpaceRadius!==void 0&&(t.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=t.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(t){let e=!1;t.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=t.lumaPhi),t.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=t.depthPhi),t.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=t.normalPhi),t.radius!==void 0&&t.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=t.radius),t.radiusExponent!==void 0&&t.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=t.radiusExponent,e=!0),t.rings!==void 0&&t.rings!==this.pdRings&&(this.pdRings=t.rings,e=!0),t.samples!==void 0&&t.samples!==this.pdSamples&&(this.pdSamples=t.samples,e=!0),e&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Pu(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,e,i){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case n.OUTPUT.Off:break;case n.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=un,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case n.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=un,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case n.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=un,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case n.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:e);break;case n.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=un,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case n.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=i.texture,this.copyMaterial.blending=un,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:e);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(t,e,i,s,r){t.getClearColor(this._originalClearColor);let o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(i),t.autoClear=!1,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_renderOverride(t,e,i,s,r){t.getClearColor(this._originalClearColor);let o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(i),t.autoClear=!1,s=e.clearColor||s,r=e.clearAlpha||r,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_overrideVisibility(){let t=this.scene,e=this._visibilityCache;t.traverse(function(i){(i.isPoints||i.isLine||i.isLine2)&&i.visible&&(i.visible=!1,e.push(i))})}_restoreVisibility(){let t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}_generateNoise(t=64){let e=new Hc,i=t*t*4,s=new Uint8Array(i);for(let o=0;o<t;o++)for(let a=0;a<t;a++){let l=o,c=a;s[(o*t+a)*4]=(e.noise(l,c)*.5+.5)*255,s[(o*t+a)*4+1]=(e.noise(l+t,c)*.5+.5)*255,s[(o*t+a)*4+2]=(e.noise(l,c+t)*.5+.5)*255,s[(o*t+a)*4+3]=(e.noise(l+t,c+t)*.5+.5)*255}let r=new kn(s,t,t,mn,Bn);return r.wrapS=Cn,r.wrapT=Cn,r.needsUpdate=!0,r}};Yr.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var Iu=class extends Yr{_overrideVisibility(){super._overrideVisibility(),this._hidden=[],this.scene.traverse(t=>{t.visible&&t.isMesh&&t.material&&(t.material.transparent||t.material.isShaderMaterial)&&(t.visible=!1,this._hidden.push(t))})}_restoreVisibility(){for(let t of this._hidden)t.visible=!0;this._hidden=[],super._restoreVisibility()}},iy={uniforms:{tDiffuse:{value:null},uTime:{value:0},uVignette:{value:.32},uCA:{value:0},uGrain:{value:.035},uFrost:{value:0},uHurt:{value:0},uFlash:{value:0},uLift:{value:new O},uGain:{value:new O(1,1,1)},uSat:{value:1},uScan:{value:0},uRes:{value:new mt(1,1)},uFade:{value:0}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",fragmentShader:`uniform sampler2D tDiffuse;uniform float uTime,uVignette,uCA,uGrain,uFrost,uHurt,uFlash,uSat,uScan,uFade;uniform vec3 uLift,uGain;uniform vec2 uRes;varying vec2 vUv;
    float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
    float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
    void main(){vec2 uv=vUv;vec2 c=uv-.5;float r2=dot(c,c);
      vec3 col;if(uCA>.0005){vec2 o=c*uCA*r2*4.;col=vec3(texture2D(tDiffuse,uv+o).r,texture2D(tDiffuse,uv).g,texture2D(tDiffuse,uv-o).b);}else col=texture2D(tDiffuse,uv).rgb;
      col=col*uGain+uLift*(1.-col);float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,uSat);
      if(uFrost>0.){vec2 q=uv*vec2(uRes.x/uRes.y,1.);float n=vn(q*7.)*.55+vn(q*23.)*.3+vn(q*61.)*.15;
        float edge=smoothstep(.1,.3,r2+(n-.5)*.14);
        col=mix(col,vec3(.82,.95,1.)*(l*.45+.6),edge*uFrost*.62);
        col=mix(col,vec3(dot(col,vec3(.33)))*vec3(.84,.97,1.14),uFrost*.3);}
      if(uHurt>0.){col=mix(col,vec3(1.,.08,.12),smoothstep(.1,.5,r2)*uHurt*.6);}
      col*=1.-uVignette*smoothstep(.12,.62,r2);
      col+=uFlash*vec3(.85,.95,1.);
      col+=(h(uv*uRes+fract(uTime*7.1)*91.)-.5)*uGrain;
      if(uScan>0.)col*=1.-uScan*.18*(.5+.5*sin(uv.y*uRes.y*3.14159));
      col*=1.-uFade;
      gl_FragColor=vec4(col,1.);}`};function Zf(n,t,e,i){let s=n.getDrawingBufferSize(new mt),r=new ln(s.x,s.y,{type:Tn,samples:i==="low"?0:4}),o=new Oc(n,r),a=new kc(t,e);o.addPass(a);let l=null;i==="ultra"&&(l=new Iu(t,e,s.x,s.y),l.output=Yr.OUTPUT.Default,l.blendIntensity=.85,l.updateGtaoMaterial({radius:16,distanceExponent:1.6,thickness:6,distanceFallOff:1,scale:1.15,samples:12}),l.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:5,rings:2,samples:12}),o.addPass(l));let c=new qr(new mt(s.x,s.y),.6,.55,.92);o.addPass(c),o.addPass(new Bc);let h=new Xr(iy);o.addPass(h);let u=h.uniforms;return{composer:o,bloom:c,final:h,u,ao:l,setSize(f,d){o.setSize(f,d),u.uRes.value.set(f,d),c.resolution.set(f,d)},setGrade(f){u.uLift.value.set(...f.lift),u.uGain.value.set(...f.gain),u.uSat.value=f.sat},render(){o.render()}}}var sy={spread:"#ffd23f",beam:"#6cf3ff",bounce:"#ff7ad9"},ry={spread:"SCATTER",beam:"ARC LANCE",bounce:"RICOCHET"};function Jf(n){let t=null;function e(c,h){t={text:c,sub:h,t:0}}let i=540;function s(c,h){i=Math.max(400,Math.min(540,(h||540)*1.08));let u=i*c;return n.save(),n.scale(960/u,540/i),u}function r(c,h,u,f,d,g,x){n.fillStyle="rgba(8,16,26,.75)",n.fillRect(c-1,h-1,u+2,f+2);let m=x||1,p=m>1?2:0,M=(u-p*(m-1))/m;for(let v=0;v<m;v++){let y=Math.max(0,Math.min(1,d*m-v));y<=0||(n.fillStyle=g,n.fillRect(c+v*(M+p),h,M*y,f))}n.fillStyle="rgba(255,255,255,.18)",n.fillRect(c,h,u*Math.max(0,d),1)}function o(c,h,u,f){n.save(),n.translate(c,h),n.beginPath(),n.moveTo(0,-u),n.lineTo(u*.55,-u*.2),n.lineTo(u*.35,u),n.lineTo(-u*.35,u),n.lineTo(-u*.55,-u*.2),n.closePath(),n.shadowColor=f,n.shadowBlur=8,n.fillStyle=f,n.fill(),n.shadowBlur=0,n.fillStyle="rgba(255,255,255,.55)",n.beginPath(),n.moveTo(0,-u),n.lineTo(u*.2,-u*.1),n.lineTo(0,u*.6),n.closePath(),n.fill(),n.restore()}function a(c,h,u,f,d,g="left",x="600"){n.font=`${x} ${f}px "Rajdhani","Trebuchet MS",system-ui,sans-serif`,n.textAlign=g,n.textBaseline="alphabetic",n.fillStyle=d,n.fillText(c,h,u)}function l(c,h,u,f,d,g){let x=s(h,g),m=c.player,p=n.createLinearGradient(0,0,0,78);p.addColorStop(0,"rgba(2,8,16,.82)"),p.addColorStop(1,"rgba(2,8,16,0)"),n.fillStyle=p,n.fillRect(0,0,x,78);let M=Math.max(18,x*.025),v=x-M;a("ARMOR",M,22,11,"#8fb3c4");let T=m.energy<30?Math.sin(f*12)>0?"#ff5d6a":"#ff9aa2":"#73f0ea";r(M,28,170,7,m.energy/m.maxEnergy,T,10),a(String(Math.max(0,Math.ceil(m.energy))).padStart(3,"0"),M+180,36,16,"#eafcff","left","700");for(let N=0;N<Math.min(8,m.lives);N++)n.fillStyle="#bfe9f5",n.beginPath(),n.arc(M+5+N*13,50,4.2,Math.PI,0),n.lineTo(M+9.2+N*13,54),n.lineTo(M+.8+N*13,54),n.closePath(),n.fill(),n.fillStyle="#63eeff",n.fillRect(M+2.5+N*13,48.5,5,1.6);m.lives>8&&a("\xD7"+m.lives,M+108,55,11,"#bfe9f5");let A=x*.36,R=sy[m.weapon]||"#fff",C=m.weapons[m.weapon]||1;n.save(),n.shadowColor=R,n.shadowBlur=10,a(m.morph?"ROLL CORE":ry[m.weapon],A,26,15,R,"left","700"),n.restore();for(let N=0;N<3;N++)n.fillStyle=N<C?R:"rgba(255,255,255,.15)",n.beginPath(),n.moveTo(A+N*14,40),n.lineTo(A+N*14+10,40),n.lineTo(A+N*14+7,46),n.lineTo(A+N*14-3,46),n.closePath(),n.fill();a("CRYO",A+52,46,10,"#a9eeff");for(let N=0;N<m.bombs;N++)n.fillStyle="#a9eeff",n.fillRect(A+80+N*7,39,4,7);a("SHOCK",A+52+Math.max(48,m.bombs*7+34),46,10,"#67ffd4");for(let N=0;N<m.lines;N++)n.fillStyle="#67ffd4",n.fillRect(A+52+Math.max(48,m.bombs*7+34)+36+N*7,39,4,7);let S=Math.max(0,c.time),b=S<30?Math.sin(f*10)>0?"#ff6b78":"#ffb3ba":"#c9dbe5";a(`${Math.floor(S/60)}:${String(Math.floor(S%60)).padStart(2,"0")}`,x*.62,30,18,b,"center","700"),o(v-118,24,8,"#7fe6ff"),a(String(m.gems),v-104,31,20,"#dff9ff","left","700"),a(String(m.score).padStart(7,"0"),v,54,15,"#eaf4ff","right","700"),a("SCORE",v-74,54,9,"#7d97a6","right");let D=c.boss;if(D&&D.alive&&D.awake){let N=Math.min(420,x*.5),F=x/2-N/2,B=i-46;n.fillStyle="rgba(4,10,18,.7)",n.fillRect(F-12,B-24,N+24,40),n.save(),n.shadowColor="#ff3b5a",n.shadowBlur=8,a(D.name,x/2,B-8,13,"#ffc0c8","center","700"),n.restore(),r(F,B,N,6,Math.max(0,D.hp/D.maxHp),D.open?Math.sin(f*14)>0?"#fff27a":"#ffb347":"#ff4d6d",24),n.fillStyle="rgba(255,255,255,.5)";for(let G of[1/3,2/3])n.fillRect(F+N*G,B-2,1,10);D.open&&a("CORE EXPOSED",x/2,B+18,9,"#fff27a","center","700")}if(t){t.t+=d;let N=t.t;if(N>2.6)t=null;else{let F=Math.min(1,N*5)*Math.min(1,(2.6-N)*3);n.globalAlpha=F;let B=Math.min(x*.7,520),G=150,X=n.createLinearGradient(x/2-B/2,0,x/2+B/2,0);X.addColorStop(0,"rgba(255,40,70,0)"),X.addColorStop(.5,t.text==="WARNING"?"rgba(255,40,70,.35)":"rgba(80,220,255,.28)"),X.addColorStop(1,"rgba(255,40,70,0)"),n.fillStyle=X,n.fillRect(x/2-B/2,G-34,B,52),n.save(),n.shadowColor=t.text==="WARNING"?"#ff3b5a":"#6cf3ff",n.shadowBlur=14,a(t.text,x/2,G,30,t.text==="WARNING"?"#ffd6dc":"#e6fdff","center","800"),n.restore(),t.sub&&a(t.sub,x/2,G+16,12,"#b7cad6","center","600"),n.globalAlpha=1}}for(let N of c.floats){if(N.line||!N.text)continue;let F=u(N.x+6,N.y);if(!F)continue;let B=Math.min(1,N.life*2.5);n.globalAlpha=B,n.save(),n.shadowColor="#000",n.shadowBlur=4,a(N.text,F.x*x,F.y*i,N.text.length>5?12:11,N.text==="1UP"?"#ff9fb3":"#f2fbff","center","700"),n.restore(),n.globalAlpha=1}n.restore()}return{draw:l,setBanner:e}}var ma=new O;function pi(n,t,e,i,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;ma.copy(t),ma[i]=0,ma.normalize();let c=.5*o/(o+a),h=1-ma.angleTo(n)/l;return Math.sign(ma[e])===1?h*c:a/(o+a)+c+c*(1-h)}var Vc=class n extends Fe{constructor(t=1,e=1,i=1,s=2,r=.1){let o=s*2+1;if(r=Math.min(t/2,e/2,i/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:i,segments:s,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new O,c=new O,h=new O(t,e,i).divideScalar(2).subScalar(r),u=this.attributes.position.array,f=this.attributes.normal.array,d=this.attributes.uv.array,g=u.length/6,x=new O,m=.5/o;for(let p=0,M=0;p<u.length;p+=3,M+=2)switch(l.fromArray(u,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[p+0]=h.x*Math.sign(l.x)+c.x*r,u[p+1]=h.y*Math.sign(l.y)+c.y*r,u[p+2]=h.z*Math.sign(l.z)+c.z*r,f[p+0]=c.x,f[p+1]=c.y,f[p+2]=c.z,Math.floor(p/g)){case 0:x.set(1,0,0),d[M+0]=pi(x,c,"z","y",r,i),d[M+1]=1-pi(x,c,"y","z",r,e);break;case 1:x.set(-1,0,0),d[M+0]=1-pi(x,c,"z","y",r,i),d[M+1]=1-pi(x,c,"y","z",r,e);break;case 2:x.set(0,1,0),d[M+0]=1-pi(x,c,"x","z",r,t),d[M+1]=pi(x,c,"z","x",r,i);break;case 3:x.set(0,-1,0),d[M+0]=1-pi(x,c,"x","z",r,t),d[M+1]=1-pi(x,c,"z","x",r,i);break;case 4:x.set(0,0,1),d[M+0]=1-pi(x,c,"x","y",r,t),d[M+1]=1-pi(x,c,"y","x",r,e);break;case 5:x.set(0,0,-1),d[M+0]=pi(x,c,"x","y",r,t),d[M+1]=1-pi(x,c,"y","x",r,e);break}}static fromJSON(t){return new n(t.width,t.height,t.depth,t.segments,t.radius)}};var ye=O,Du=new ne,$f=new Xn,Kf=new ni,Ti=new ye,Gc=new ye,Se=(n,t,e)=>n<t?t:n>e?e:n,Dn=(n,t,e)=>n+(t-n)*e,Jn=n=>(n=Se(n,0,1),n*n*(3-2*n)),pe=(n,t,e,i)=>n+(t-n)*(1-Math.exp(-e*i)),Ot=Math.PI*2;function Jr(n){let t=n>>>0;return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var ga=new It;function Vt(n,t=1){return ga.set(n),[ga.r*t,ga.g*t,ga.b*t]}function _n(n){let t=n.userData||{};n.index&&(n=n.toNonIndexed(),n.userData=t);let e=n.userData||(n.userData={});if(e.uvm&&n.attributes.uv){let i=n.attributes.uv;for(let s=0;s<i.count;s++)i.setXY(s,i.getX(s)*e.uvm[0],i.getY(s)*e.uvm[1]);e.uvModel=!0,delete e.uvm}for(let i of Object.keys(n.attributes))i!=="position"&&i!=="normal"&&!(i==="uv"&&e.uvModel)&&n.deleteAttribute(i);return n.attributes.normal||n.computeVertexNormals(),n.morphAttributes={},n}var ai=(n,t,e)=>(n.userData.uvm=[t,e],n);function je(n,t,e,i){return Kf.set(e?e[0]:0,e?e[1]:0,e?e[2]:0),$f.setFromEuler(Kf),i==null?Gc.set(1,1,1):typeof i=="number"?Gc.set(i,i,i):Gc.set(i[0],i[1],i[2]),Ti.set(t?t[0]:0,t?t[1]:0,t?t[2]:0),Du.compose(Ti,$f,Gc),n.applyMatrix4(Du),Du.determinant()<0&&rp(n),n}function rp(n){if(n.index){let t=n.index.array;for(let e=0;e<t.length;e+=3){let i=t[e+1];t[e+1]=t[e+2],t[e+2]=i}return n.index.needsUpdate=!0,n}for(let t of Object.keys(n.attributes)){let e=n.attributes[t],i=e.itemSize,s=e.array;for(let r=0;r<e.count;r+=3)for(let o=0;o<i;o++){let a=(r+1)*i+o,l=(r+2)*i+o,c=s[a];s[a]=s[l],s[l]=c}e.needsUpdate=!0}return n}function va(n){return je(n.clone(),null,null,[1,1,-1])}function Mn(n,t,e=!0){let i=n.attributes.position;for(let s=0;s<i.count;s++)Ti.fromBufferAttribute(i,s),t(Ti,s),i.setXYZ(s,Ti.x,Ti.y,Ti.z);return i.needsUpdate=!0,e==="smooth"?oy(n):e&&n.computeVertexNormals(),n}function oy(n){let t=n.attributes.position,e=t.count,i=new Map,s=new Array(e),r=new ye,o=new ye,a=new ye,l=new ye,c=new ye,h=f=>Math.round(t.getX(f)*200)+","+Math.round(t.getY(f)*200)+","+Math.round(t.getZ(f)*200);for(let f=0;f<e;f+=3){r.fromBufferAttribute(t,f),o.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),l.subVectors(a,o).cross(c.subVectors(r,o));for(let d=0;d<3;d++){let g=s[f+d]=h(f+d),x=i.get(g);x?x.add(l):i.set(g,l.clone())}}let u=new Float32Array(e*3);for(let f=0;f<e;f++){let d=i.get(s[f]);c.copy(d).normalize(),u[f*3]=c.x,u[f*3+1]=c.y,u[f*3+2]=c.z}return n.setAttribute("normal",new Ce(u,3)),n}function ay(n){return n=n.index?n.toNonIndexed():n,n.computeVertexNormals(),n}var xa=1;function op(n){xa=n}var yn=(n,t=3)=>n<=8&&xa<1?n:Math.max(t,Math.round(n*xa)),_={box(n,t,e,i=0,s=1){return i<=0?_n(new Fe(n,t,e)):_n(new Vc(n,t,e,Math.max(1,Math.round(s*xa)),Math.min(i,Math.min(n,t,e)*.49)))},ext(n,t,e=.25,i={}){let s=new ss;s.moveTo(n[0][0],n[0][1]);for(let a=1;a<n.length;a++)s.lineTo(n[a][0],n[a][1]);if(s.closePath(),i.holes)for(let a of i.holes){let l=new Ls;l.moveTo(a[0][0],a[0][1]);for(let c=1;c<a.length;c++)l.lineTo(a[c][0],a[c][1]);l.closePath(),s.holes.push(l)}let r=Math.min(e,t*.45),o=new Vo(s,{depth:Math.max(.01,t-2*r),bevelEnabled:r>0,bevelThickness:r,bevelSize:r,bevelOffset:-r,bevelSegments:i.bevelSeg!=null?i.bevelSeg:xa<1?1:2,steps:i.steps||1,curveSegments:4});return o.translate(0,0,r-t/2),_n(ai(ay(o),1,1))},lathe(n,t=12,e=0,i=Ot){let s=0,r=0;for(let o=0;o<n.length;o++)r=Math.max(r,n[o][0]),o&&(s+=Math.hypot(n[o][0]-n[o-1][0],n[o][1]-n[o-1][1]));return _n(ai(new Go(n.map(o=>new mt(o[0],o[1])),yn(t),e,i),r*i,s))},cyl(n,t,e,i=10,s=!1,r=1){return _n(ai(new Pn(n,t,e,yn(i),r,s),Ot*Math.max(n,t),e))},cone(n,t,e=8){return _n(ai(new qi(n,t,yn(e)),Ot*n,t))},sph(n,t=12,e=8){return _n(ai(new qn(n,yn(t),yn(e,2)),Ot*n,Math.PI*n))},ell(n,t,e,i=12,s=8){return je(_n(ai(new qn(1,yn(i),yn(s,2)),Math.PI*(n+e),Math.PI*t)),null,null,[n,t,e])},ico(n,t=0){return _n(new Mi(n,t))},oct(n){return _n(new Yi(n,0))},dodec(n){return _n(new Lo(n,0))},torus(n,t,e=6,i=16,s=Ot){return _n(ai(new Fs(n,t,yn(e),yn(i),s),n*s,Ot*t))},capsule(n,t,e=3,i=8){return _n(ai(new Is(n,t,yn(e,2),yn(i)),Ot*n,t+Math.PI*n))},tube(n,t,e=12,i=5,s=!1){let r=new Ds(n.map(o=>new ye(o[0],o[1],o[2])),s);return _n(ai(new Dr(r,yn(e),t,yn(i),s),r.getLength(),Ot*t))},taperTube(n,t,e=12,i=6){let s=new Ds(n.map(h=>new ye(h[0],h[1],h[2]))),r=new Dr(s,yn(e),1,yn(i),!1),o=r.attributes.position,a=yn(e),l=yn(i),c=s.computeFrenetFrames(a,!1);for(let h=0;h<=a;h++){let u=s.getPointAt(h/a),f=t(h/a);for(let d=0;d<=l;d++){let g=h*(l+1)+d;Ti.fromBufferAttribute(o,g).sub(u).multiplyScalar(f).add(u),o.setXYZ(g,Ti.x,Ti.y,Ti.z)}}return r.computeVertexNormals(),_n(ai(r,s.getLength(),Ot*t(.3)))},crystal(n,t,e=6,i=.35,s=1,r=.18){let o=Jr(s),a=[],l=[],c=[],h=e,u=t*(1-i);for(let x=0;x<h;x++){let m=x/h*Ot+o()*.3,p=n*(1+(o()-.5)*r*2);l.push([Math.cos(m)*p*.82,-t*.04,Math.sin(m)*p*.82]),c.push([Math.cos(m)*p,u*(1+(o()-.5)*r),Math.sin(m)*p])}let f=[(o()-.5)*n*.3,t,(o()-.5)*n*.3],d=(x,m,p)=>a.push(...x,...m,...p);for(let x=0;x<h;x++){let m=(x+1)%h;d(l[x],c[m],c[x]),d(l[x],l[m],c[m]),d(c[x],c[m],f),d(l[m],l[x],[0,-t*.08,0])}let g=new Ee;return g.setAttribute("position",new Kt(a,3)),g.computeVertexNormals(),g},shard(n,t,e=6,i=3,s=.15){let r=Jr(i),o=[],a=[],l=[];for(let d=0;d<e;d++){let g=d/e*Ot+(r()-.5)*.25,x=n*(1+(r()-.5)*s*2);a.push([Math.cos(g)*x,-t*.18*(1+(r()-.5)*s),Math.sin(g)*x]),l.push([Math.cos(g)*x*.96,t*.16*(1+(r()-.5)*s),Math.sin(g)*x*.96])}let c=[(r()-.5)*n*.2,t*.5,(r()-.5)*n*.2],h=[(r()-.5)*n*.2,-t*.5,(r()-.5)*n*.2],u=(d,g,x)=>o.push(...d,...g,...x);for(let d=0;d<e;d++){let g=(d+1)%e;u(a[d],l[g],l[d]),u(a[d],a[g],l[g]),u(l[d],l[g],c),u(a[g],a[d],h)}let f=new Ee;return f.setAttribute("position",new Kt(o,3)),f.computeVertexNormals(),f},shell(n,t,e,i,s,r,o,a,l=10,c=6,h=null){l=yn(l),c=yn(c,2);let u=[],f=[],d=[],g=(n+e)/2,x=(j,Z,J)=>{let ot=h?h(j,Z):1,ft=Math.sin(Z)*Math.cos(j),Lt=Math.cos(Z),Ut=Math.sin(Z)*Math.sin(j);return[ft*(n*ot-J),Lt*(t*ot-J),Ut*(e*ot-J)]},m=(j,Z)=>{let J=u.length/3;for(let ot=0;ot<=c;ot++)for(let ft=0;ft<=l;ft++){let Lt=s+(r-s)*(ft/l),Ut=o+(a-o)*(ot/c);u.push(...x(Lt,Ut,j)),f.push(Lt*g,Ut*t)}for(let ot=0;ot<c;ot++)for(let ft=0;ft<l;ft++){let Lt=J+ot*(l+1)+ft,Ut=Lt+1,zt=Lt+l+1,Ft=zt+1;Z?d.push(Lt,Ut,zt,Ut,Ft,zt):d.push(Lt,zt,Ut,Ut,zt,Ft)}};m(0,!0),m(i,!1);let p=new Ee;p.setAttribute("position",new Kt(u,3)),p.setAttribute("uv",new Kt(f,2)),p.setIndex(d),p.computeVertexNormals();let M=[],v=[],y=new ye,T=new ye,A=new ye,R=new ye,C=new ye,S=new ye,b=new ye,D=(j,Z)=>{let J=0;for(let ot=0;ot<j.length-1;ot++){let[ft,Lt]=j[ot],[Ut,zt]=j[ot+1],Ft=x(ft,Lt,0),Q=x(Ut,zt,0),ht=x(ft,Lt,i),wt=x(Ut,zt,i);y.fromArray(Ft),T.fromArray(Q),A.fromArray(ht),S.subVectors(A,y),b.subVectors(T,y),R.crossVectors(S,b),Z((ft+Ut)/2,(Lt+zt)/2,C);let _t=Math.hypot(Q[0]-Ft[0],Q[1]-Ft[1],Q[2]-Ft[2]);R.dot(C)>=0?(M.push(...Ft,...ht,...Q,...Q,...ht,...wt),v.push(J,0,J,i,J+_t,0,J+_t,0,J,i,J+_t,i)):(M.push(...Ft,...Q,...ht,...Q,...wt,...ht),v.push(J,0,J+_t,0,J,i,J+_t,0,J+_t,i,J,i)),J+=_t}},N=(j,Z,J,ot)=>{J.set(-Math.sin(j)*n,0,Math.cos(j)*e).multiplyScalar(ot)},F=(j,Z,J,ot)=>{J.set(Math.cos(Z)*Math.cos(j)*n,-Math.sin(Z)*t,Math.cos(Z)*Math.sin(j)*e).multiplyScalar(ot)},B=[];if(o>.001){for(let j=0;j<=l;j++)B.push([s+(r-s)*j/l,o]);D(B,(j,Z,J)=>F(j,Z,J,-1)),B.length=0}if(a<Math.PI-.001){for(let j=0;j<=l;j++)B.push([s+(r-s)*j/l,a]);D(B,(j,Z,J)=>F(j,Z,J,1)),B.length=0}if(r-s<Ot-.001){for(let j=0;j<=c;j++)B.push([s,o+(a-o)*j/c]);D(B,(j,Z,J)=>N(j,Z,J,-1)),B.length=0;for(let j=0;j<=c;j++)B.push([r,o+(a-o)*j/c]);D(B,(j,Z,J)=>N(j,Z,J,1)),B.length=0}let G=[_n(ai(p,1,1))];if(M.length){let j=new Ee;j.setAttribute("position",new Kt(M,3)),j.setAttribute("uv",new Kt(v,2)),j.computeVertexNormals(),G.push(_n(ai(j,1,1)))}let X=G.length>1?Hn(G):G[0];return X.userData.uvModel=!0,X},ribs(n,t,e,i=.15,s=10){let r=[];for(let o=0;o<=e*2;o++)r.push([n*(o%2?1-i:1),o/(e*2)*t-t/2]);return r.unshift([.001,-t/2]),r.push([.001,t/2]),_.lathe(r,s)},membrane(n){let t=new ss;t.moveTo(n[0][0],n[0][1]);for(let o=1;o<n.length;o++)t.lineTo(n[o][0],n[o][1]);let e=_n(ai(new Wo(t),1,1)),i=rp(e.clone()),s=i.attributes.normal;for(let o=0;o<s.count;o++)s.setZ(o,-s.getZ(o));let r=Hn([e,i]);return r.userData.uvModel=!0,r}};function ly(n,t,e,i){let s=n.attributes.position,r=s.count,o=new Float32Array(r*2),a=new ye,l=new ye,c=new ye,h=new ye,u=new ye;for(let f=0;f<r;f+=3){a.fromBufferAttribute(s,f),l.fromBufferAttribute(s,f+1),c.fromBufferAttribute(s,f+2),h.subVectors(l,a),u.subVectors(c,a),h.cross(u);let d=Math.abs(h.x),g=Math.abs(h.y),x=Math.abs(h.z);for(let m=0;m<3;m++){let p=m===0?a:m===1?l:c,M,v;d>=g&&d>=x?(M=p.z,v=p.y):g>=x?(M=p.x,v=p.z):(M=p.x,v=p.y),o[(f+m)*2]=M*t+e,o[(f+m)*2+1]=v*t+i}}n.setAttribute("uv",new Ce(o,2))}function js(n,t,e=3.2,i=null){let s=Vt(n),r=Vt(t),o=i?Vt(i):null;return(a,l,c)=>{let h=Math.sin(l*Ot/e+Math.sin(a*.21+c*.17)*1.6)*.5+.5,u=Math.sin(l*2.3+a*1.7)*.5+.5,f=h*h*(3-2*h),d=[s[0]+(r[0]-s[0])*f,s[1]+(r[1]-s[1])*f,s[2]+(r[2]-s[2])*f];if(o&&u>.82){let g=(u-.82)/.18;for(let x=0;x<3;x++)d[x]+=(o[x]-d[x])*g*.7}return d}}var xe=class{constructor(t=1/22){this.bones=[],this.names={},this.parts={},this.uvScale=t,this.R=Jr(7),this.post=null,this.bone("root",null,0,0,0)}bone(t,e,i,s,r){return this.names[t]=this.bones.length,this.bones.push({name:t,parent:e==null?-1:this.names[e],pos:new ye(i,s,r)}),this}add(t,e,i,s="#808080",r=.04){if(Array.isArray(i)){for(let p of i)this.add(t,e,p,s,r);return this}let o=this.names[t];if(o==null)throw new Error("no bone "+t);let a=_n(i),l=a.attributes.position.count,c=typeof s=="function"?s:null,h=c?[1,1,1]:typeof s=="string"?Vt(s):s,u=1+(this.R()-.5)*r*2,f=new Float32Array(l*3),d=new Uint16Array(l*4),g=new Float32Array(l*4),x=a.attributes.position;for(let p=0;p<l;p++)c&&(h=c(x.getX(p),x.getY(p),x.getZ(p))),f[p*3]=h[0]*u,f[p*3+1]=h[1]*u,f[p*3+2]=h[2]*u,d[p*4]=o,g[p*4]=1;a.setAttribute("color",new Ce(f,3)),a.setAttribute("skinIndex",new Cs(d,4)),a.setAttribute("skinWeight",new Ce(g,4));let m=this.uvScale*(e==="suit"?2.2:e==="flesh"?1.3:1);if(a.userData.uvModel&&a.attributes.uv){let p=a.attributes.uv,M=this.R(),v=this.R();for(let y=0;y<p.count;y++)p.setXY(y,p.getX(y)*m+M,p.getY(y)*m+v)}else ly(a,m,this.R(),this.R());return(this.parts[e]||(this.parts[e]=[])).push(a),this}scaleAll(t,e=0,i=0,s=0){return this.post={s:t,c:new ye(e,i,s)},this}build(){let t=[],e=0;if(this.post){let{s:i,c:s}=this.post,r=new ne().makeTranslation(s.x,s.y,s.z).multiply(new ne().makeScale(i,i,i)).multiply(new ne().makeTranslation(-s.x,-s.y,-s.z));for(let o of Object.keys(this.parts))for(let a of this.parts[o])a.applyMatrix4(r);for(let o of this.bones)o.pos.sub(s).multiplyScalar(i).add(s)}for(let i of Object.keys(this.parts)){let s=Hn(this.parts[i]);s.computeBoundingSphere(),e+=s.attributes.position.count/3,t.push({mat:i,geometry:s})}return{bones:this.bones,meshes:t,tris:e}}},cy=new ne;function Qs(n,t,e={}){let i=new Xe,s=n.bones.map(u=>{let f=new Tr;return f.name=u.name,f});n.bones.forEach((u,f)=>{let d=s[f];u.parent<0?(i.add(d),d.position.copy(u.pos)):(s[u.parent].add(d),d.position.copy(u.pos).sub(n.bones[u.parent].pos)),d.userData.rest=d.position.clone()});let r=n.bones.map(u=>new ne().makeTranslation(-u.pos.x,-u.pos.y,-u.pos.z)),o=new Io(s,r),a={};s.forEach(u=>{a[u.name]=u});let l=[],c={},h=[];for(let u of n.meshes){let f=t.instance(u.mat),d=new Po(u.geometry,f);d.bind(o,cy),d.frustumCulled=!1;let g=f.isMeshBasicMaterial||f.transparent;d.castShadow=e.shadow!==!1&&!g,d.receiveShadow=!g,d.name=u.mat,i.add(d),h.push(d),l.push(f),c[u.mat]=f}return{group:i,bones:a,boneList:s,skeleton:o,meshes:h,materials:l,byMat:c,fx:new Ou(l)}}function ap(n){n.skeleton.dispose();for(let t of n.materials)t.dispose()}var hy=new It(.62,.8,1),uy=new It(.18,.36,.6),jf=new It(1,1,1);function Lu(n,t,e){return n.r+=t.r*e,n.g+=t.g*e,n.b+=t.b*e,n}var Ou=class{constructor(t){this.list=t,this.flash=-1,this.frost=-1,this.dirty=!0;for(let e of t)e.userData.baseColor=e.color.clone(),e.userData.baseEmi=e.emissive?e.emissive.clone().multiplyScalar(e.emissiveIntensity):null,e.userData.pulse==null&&(e.userData.pulse=1)}pulse(t,e){t&&t.userData.pulse!==e&&(t.userData.pulse=e,this.dirty=!0)}apply(t,e){if(t=Se(t,0,1),e=Se(e,0,1),!(!this.dirty&&Math.abs(t-this.flash)<.001&&Math.abs(e-this.frost)<.001)){this.flash=t,this.frost=e,this.dirty=!1;for(let i of this.list){let s=i.userData;i.isMeshBasicMaterial?(i.color.copy(s.baseColor).multiplyScalar(s.pulse),e>0&&i.color.lerp(ga.setRGB(.7*2.2,.9*2.2,1*2.2),e*.5),t>0&&Lu(i.color,jf,t*2.5)):(i.color.copy(s.baseColor),e>0&&i.color.lerp(hy,e*.55),i.emissive.copy(s.baseEmi).multiplyScalar(s.pulse),e>0&&Lu(i.emissive,uy,e*.6),t>0&&Lu(i.emissive,jf,t*1.6),i.emissiveIntensity=1)}}}},Qf=new ye(0,-1,0),Ks=new ye,tp=new ye,Nu=new ye,ep=new ye,Uu=new ye,np=new ye,ip=new Xn;function ku(n,t,e,i,s,r){let o=n.position;Ks.subVectors(e,o);let a=Ks.length();if(a<1e-4)return;Ks.divideScalar(a),a=Se(a,Math.abs(s-r)+.05,s+r-.02);let l=Se((s*s+a*a-r*r)/(2*s*a),-1,1),c=Math.sqrt(1-l*l);tp.copy(i).addScaledVector(Ks,-i.dot(Ks)).normalize(),Nu.copy(o).addScaledVector(Ks,s*l).addScaledVector(tp,s*c),ep.subVectors(Nu,o).normalize(),np.copy(o).addScaledVector(Ks,a),Uu.subVectors(np,Nu).normalize(),n.quaternion.setFromUnitVectors(Qf,ep),ip.copy(n.quaternion).invert(),Uu.applyQuaternion(ip),t.quaternion.setFromUnitVectors(Qf,Uu)}function Zr(n,t,e){let i=n*374761393+t*668265263+e*2147483647|0;return i=Math.imul(i^i>>>13,1274126177),((i^i>>>16)>>>0)/4294967296}function lp(n,t,e,i){let s=Math.floor(n),r=Math.floor(t),o=n-s,a=t-r,l=x=>(x%e+e)%e,c=o*o*(3-2*o),h=a*a*(3-2*a),u=Zr(l(s),l(r),i),f=Zr(l(s+1),l(r),i),d=Zr(l(s),l(r+1),i),g=Zr(l(s+1),l(r+1),i);return Dn(Dn(u,f,c),Dn(d,g,c),h)}function Fu(n,t,e,i,s){let r=0,o=.5,a=1,l=0;for(let c=0;c<i;c++)r+=lp(n*a,t*a,e*a,s+c)*o,l+=o,o*=.5,a*=2;return r/l}function sp(n,t,e,i){let s=Math.floor(n),r=Math.floor(t),o=9,a=9;for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++){let h=s+c,u=r+l,f=(h%e+e)%e,d=(u%e+e)%e,g=h+Zr(f,d,i),x=u+Zr(f,d,i+9),m=Math.hypot(g-n,x-t);m<o?(a=o,o=m):m<a&&(a=m)}return[o,a]}function Wc(n,t,e,i){let s=new kn(n,t,t,mn);return s.wrapS=s.wrapT=Cn,s.generateMipmaps=!0,s.minFilter=ui,s.magFilter=Fn,s.colorSpace=e?dn:fi,s.anisotropy=i,s.needsUpdate=!0,s}function dy(n,t){let e=n,i=new Uint8Array(e*e*4),s=new Uint8Array(e*e*4),r=Jr(1234),o=new Float32Array(e*e).fill(1),a=new Float32Array(e*e).fill(0),l=new Float32Array(e*e).fill(0),c=new Float32Array(e*e).fill(0),h=e/512,u=[];(function p(M,v,y,T,A){if(y<70*h&&T<70*h||A>5||A>1&&r()<.18){u.push([M,v,y,T]);return}if(y>T*(.7+r()*.6)){let R=Math.round(y*(.3+r()*.4));p(M,v,R,T,A+1),p(M+R,v,y-R,T,A+1)}else{let R=Math.round(T*(.3+r()*.4));p(M,v,y,R,A+1),p(M,v+R,y,T-R,A+1)}})(0,0,e,e,0);let f=(p,M)=>(M%e+e)%e*e+(p%e+e)%e,d=new Float32Array(e*e);for(let[p,M,v,y]of u){let T=(r()-.5)*.08;for(let C=0;C<y;C++)for(let S=0;S<v;S++)d[f(p+S,M+C)]=T;let A=Math.max(1,Math.round(1.6*h));for(let C=0;C<v;C++)for(let S=0;S<A;S++){let b=f(p+C,M+S);o[b]=.15,a[b]=.4}for(let C=0;C<y;C++)for(let S=0;S<A;S++){let b=f(p+S,M+C);o[b]=.15,a[b]=.4}for(let C=A;C<v;C++){let S=f(p+C,M+A);o[S]=Math.min(o[S],.75)}if(r()<.55&&v>30*h)for(let C=8*h;C<v-6*h;C+=9*h)for(let S of[M+5*h,M+y-5*h])for(let b=-2;b<=2;b++)for(let D=-2;D<=2;D++){let N=Math.hypot(D,b);if(N<2.2*h){let F=f(Math.round(p+C+D),Math.round(S+b));o[F]=1+(1-N/2.2)*.25,a[F]=N>1.4?.2:-.1}}let R=Math.floor(r()*5*h*h+1);for(let C=0;C<R;C++){let S=r()<.5,b=S?p+r()*v:p+(r()<.5?3:v-3),D=S?M+(r()<.5?3:y-3):M+r()*y,N=(1.5+r()*4)*h;for(let F=-6;F<=6;F++)for(let B=-6;B<=6;B++)if(Math.hypot(B,F*1.3)+lp(B*.6+C,F*.6,64,3)*2<N){let X=f(Math.round(b+B),Math.round(D+F));l[X]=1}}}for(let p=0;p<260*h*h;p++){let M=r()*e,v=r()*e,y=r()*Ot,T=(6+r()*34)*h,A=.4+r()*.6;for(let R=0;R<T;R++)c[f(Math.round(M),Math.round(v))]=Math.max(c[f(Math.round(M),Math.round(v))],A),M+=Math.cos(y),v+=Math.sin(y)}for(let p=0;p<e;p++)for(let M=0;M<e;M++){let v=p*e+M,y=v*4,T=Fu(M/(64*h),p/(64*h),8,4,11),A=Fu(M/(18*h),p/(18*h),Math.round(e/(18*h)),3,5),R=Jn((T-.42)*2.2),C=.9+d[v]-R*.22-a[v]*.55+(A-.5)*.06;C+=l[v]*.18+c[v]*.1,C=Se(C,0,1)*255,i[y]=C,i[y+1]=C,i[y+2]=C*.985,i[y+3]=255,s[y]=Se(o[v]*.9+(A-.5)*.08-l[v]*.12,0,1)*255,s[y+1]=Se(.5+R*.35+(A-.5)*.12-c[v]*.25-l[v]*.15,.08,1)*255,s[y+2]=Se(.1+l[v]*.85+c[v]*.5,0,1)*255,s[y+3]=255}let g=Math.max(128,e/2),x=new Uint8Array(g*g*4),m=new Uint8Array(g*g*4);for(let p=0;p<g;p++)for(let M=0;M<g;M++){let v=(p*g+M)*4,y=8/g*2,[T,A]=sp(M*y,p*y,16,21),R=Jn(1-(A-T)*5),[C,S]=sp(M*y*3,p*y*3,48,33),b=Jn(1-C*2.2),D=Fu(M/(g/8),p/(g/8),8,4,7),N=Se(.78-R*.38+(D-.5)*.25+b*.06,0,1)*255;x[v]=N,x[v+1]=N*.97,x[v+2]=N*.95,x[v+3]=255,m[v]=Se(.55+T*.5-R*.35+b*.12+(D-.5)*.2,0,1)*255,m[v+1]=Se(.32+(D-.5)*.4+R*.15,.05,1)*255,m[v+2]=0,m[v+3]=255}return{alb:Wc(i,e,!0,t),rmh:Wc(s,e,!1,t),oalb:Wc(x,g,!0,t),orh:Wc(m,g,!1,t),dispose(){this.alb.dispose(),this.rmh.dispose(),this.oalb.dispose(),this.orh.dispose()}}}function cp(n,t){let e=t&&t.capabilities?Math.min(8,t.capabilities.getMaxAnisotropy()):4,i=dy(n==="low"?256:512,e),s={},r=l=>new qe(Object.assign({vertexColors:!0},l)),o=l=>new Os(Object.assign({vertexColors:!0},l)),a=n==="low";s.paint=r({map:i.alb,roughnessMap:i.rmh,metalnessMap:i.rmh,bumpMap:a?null:i.rmh,bumpScale:1.4,roughness:1,metalness:1}),s.metal=r({map:i.alb,roughnessMap:i.rmh,bumpMap:a?null:i.rmh,bumpScale:.9,roughness:.78,metalness:.88}),s.suit=r({roughnessMap:i.orh,bumpMap:a?null:i.orh,bumpScale:.35,roughness:1.9,metalness:0}),s.flesh=a?r({map:i.oalb,roughnessMap:i.orh,roughness:1.2,metalness:0}):o({map:i.oalb,roughnessMap:i.orh,bumpMap:i.orh,bumpScale:2.2,roughness:1.3,metalness:0,clearcoat:.85,clearcoatRoughness:.22,sheen:.4,sheenRoughness:.5,sheenColor:new It(.6,.4,.5)}),s.crystal=a?r({roughness:.15,metalness:.1,emissive:new It(1,1,1),emissiveIntensity:.32,flatShading:!0}):o({roughness:.08,metalness:.05,clearcoat:1,clearcoatRoughness:.04,iridescence:.55,iridescenceIOR:1.6,emissive:new It(1,1,1),emissiveIntensity:.32,envMapIntensity:1.7,flatShading:!0,specularIntensity:1}),s.crystal.onBeforeCompile=l=>{l.fragmentShader=l.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
	totalEmissiveRadiance *= vColor.rgb;`)},s.crystal.customProgramCacheKey=()=>"shard-crystal",s.glow=new sn({vertexColors:!0}),s.core=new sn({vertexColors:!0}),s.accent=new sn({vertexColors:!0}),s.membrane=r({transparent:!0,opacity:.42,side:Je,depthWrite:!1,roughness:.25,metalness:.1,emissive:new It(0,0,0)}),s.bubble=o({transparent:!0,opacity:.2,roughness:.02,metalness:0,clearcoat:1,iridescence:a?0:1,iridescenceIOR:1.3,envMapIntensity:2.6,depthWrite:!1,side:Je,emissive:new It(0,0,0)}),s.glass=o({transparent:!0,opacity:.5,roughness:.04,metalness:0,clearcoat:1,iridescence:a?0:.4,envMapIntensity:2.2,depthWrite:!1,emissive:new It(0,0,0)});for(let l of Object.keys(s))s[l].name="actor-"+l;return{base:s,tex:i,instance(l){let c=s[l];if(!c)throw new Error("mat "+l);let h=c.clone();return h.onBeforeCompile=c.onBeforeCompile,h.customProgramCacheKey=c.customProgramCacheKey,h},dispose(){for(let l of Object.keys(s))s[l].dispose();i.dispose()}}}function Xc(n,t,e){if(!n||!n.tiles)return!1;let i=Math.floor(t/20),s=Math.floor(e/20);if(i<0||s<0||i>=n.cols||s>=n.rows)return!1;let r=n.tiles[s*n.cols+i];return r===1||r===6}function hp(n,t){let e=t&&t.level;if(!e)return"floor";let i=n.x+n.w/2,s=n.y+n.h/2;return Xc(e,i,n.y+n.h+3)?"floor":Xc(e,i,n.y-3)?"ceil":Xc(e,n.x-3,s)?"wallL":Xc(e,n.x+n.w+3,s)?"wallR":"floor"}var Tt={slate:"#56677a",slateD:"#3d4957",bone:"#a7a294",orange:"#c35f28",suit:"#2c2f34",suitD:"#1c1e22",pouch:"#434336",metal:"#767c86",gun:"#3a3e45",steel:"#9aa3ad"},Bu=Vt("#6cf3ff",3.6),qc=Vt("#6cf3ff",2.4),_a=Vt("#86dcff",3.2),pp=Vt("#ff4d3a",4),fy=Vt("#5dff8a",4),py=[5,5,5],up={spread:"#ffd23f",beam:"#6cf3ff",bounce:"#ff7ad9"},Et=(n,t,e,i,s,r)=>je(n,[t,e,i],s,r),$r=(n,t=0,e=-1e9)=>i=>{let s=i.z-t;i.y>e&&(i.x-=n*s*s)},Kr=new ye(2.3,21.3,1),my=new ye(11,.25,0),gy=new ye(1.25,-2,.8),xy=new ye(4.7,-1.5,-.3),Ma=4.9,Zc=4.7,ya=4.1;function mp(){let n=new xe(.05);n.bone("body","root",0,0,0).bone("pelvis","body",0,15.4,0).bone("spine","pelvis",0,17.2,0).bone("chest","spine",0,20.4,0).bone("head","chest",.5,25,0).bone("uaN","chest",-.4,23,ya).bone("faN","uaN",-.4,23-Ma,ya).bone("uaF","chest",-.4,23,-ya).bone("faF","uaF",-.4,23-Ma,-ya).bone("gun","chest",Kr.x,Kr.y,Kr.z).bone("pack","chest",-3.3,21.6,0).bone("thrN","pack",-5.5,17.4,1.9).bone("thrF","pack",-5.5,17.4,-1.9).bone("thN","pelvis",0,15,2.3).bone("shN","thN",0,8.2,2.3).bone("ftN","shN",0,1.6,2.35).bone("thF","pelvis",0,15,-2.3).bone("shF","thF",0,8.2,-2.3).bone("ftF","shF",0,1.6,-2.35).bone("ball","root",0,8,0);let t=l=>Et(l,.5,25,0),e=_.ext([[-2.2,-.3],[-2.75,1],[-2.55,3.1],[-1.5,4.45],[.5,4.85],[2.2,4.25],[3.3,3.05],[2.9,2.75],[3,1.85],[3.25,1],[2.95,-.1],[1.6,-.85],[-.2,-.95],[-1.6,-.75]],4.4,.45,{steps:3});Mn(e,l=>{l.x>0&&(l.x-=.05*l.z*l.z*(l.x/3)),l.y>3&&(l.y-=.06*l.z*l.z*(l.y-3)/2)}),n.add("head","paint",t(e),Tt.slate),n.add("head","paint",t(_.ext([[-2.3,3.35],[-1.4,4.6],[.5,5.2],[2.1,4.65],[3,3.6],[2,3.95],[.4,4.45],[-1.2,4]],1.6,.25)),Tt.bone),n.add("head","paint",t(_.ext([[-2.65,.7],[-1,.35],[-1.2,-1.15],[-2.45,-.75]],4,.25)),Tt.slateD),n.add("head","metal",t(_.ext([[2.75,1.7],[3.2,1.78],[3.12,2.88],[2.7,2.8]],3.6,.1)),Tt.suitD),n.add("head","glow",t(_.ext([[2.95,2.05],[3.28,2.1],[3.25,2.5],[2.92,2.46]],3.3,.06)),Bu);for(let l of[1,-1]){let c=l*2.2;n.add("head","metal",t(Et(_.ext([[.2,1.95],[3.15,1.72],[3.2,2.88],[.5,2.7]],.3,.08),0,0,c)),Tt.suitD),n.add("head","glow",t(Et(_.ext([[.55,2.12],[3.2,2],[3.22,2.55],[.8,2.48]],.22,.05),0,0,c+l*.1)),Bu),n.add("head","paint",t(Et(_.ext([[.5,-.75],[2.95,-.05],[3.15,1.55],[1.6,1.68],[.2,.6]],.45,.14),0,0,c+l*.05)),Tt.slateD),n.add("head","paint",t(Et(_.ext([[-2.4,3],[-.6,3.75],[1.8,3.55],[1.6,3.15],[-.5,3.3],[-2.2,2.6]],.3,.1),0,0,c+l*.06)),Tt.orange),n.add("head","metal",t(Et(_.box(1.5,1.7,.5,.18),-1.25,1.55,c+l*.12)),Tt.metal),n.add("head","metal",t(Et(_.box(.9,.25,.3,.06),-1.25,1,c+l*.4)),Tt.gun),n.add("head","metal",t(Et(_.box(.9,.25,.3,.06),-1.25,1.55,c+l*.4)),Tt.gun),n.add("head","metal",t(Et(_.cyl(.42,.48,.8,8),3,.35,l*.85,[0,0,-Math.PI/2+.25])),Tt.gun)}n.add("head","metal",t(Et(_.cyl(.1,.13,4,5),-1.8,4.5,2.35,[0,0,.3])),Tt.metal),n.add("head","glow",t(Et(_.sph(.2,6,4),-2.38,6.42,2.35)),pp),n.add("head","suit",t(Et(_.cyl(1.25,1.4,1.8,10),0,-1,0)),Tt.suit),n.add("chest","suit",Et(_.box(5.6,6.4,7.2,1.6,1),0,22,0),Tt.suit);let i=_.ext([[-2.4,19.6],[2.5,19.8],[3.4,21.4],[3.35,23.2],[2.2,24.4],[-1,24.6],[-2.7,23.6],[-3,21]],8.2,.6,{steps:5});Mn(i,$r(.06)),n.add("chest","paint",i,Tt.slate);let s=_.ext([[1,20.2],[3.25,20.9],[3.65,22.6],[3,23.7],[1.4,23.5]],3.2,.35,{steps:3});Mn(s,l=>{l.x-=.06*l.z*l.z-.12}),n.add("chest","paint",s,Tt.bone);for(let l of[1,-1])n.add("chest","paint",Et(_.ext([[-1.8,23.9],[1.7,23.55],[1.9,23.1],[-1.8,23.45]],.4,.1),0,0,l*3.85),Tt.orange),n.add("chest","metal",Et(_.box(.9,.9,.5,.2),2.3,21.2,l*3.7),Tt.metal);n.add("chest","metal",Et(_.torus(1.9,.45,6,16),.3,24.6,0,[Math.PI/2,0,0]),Tt.gun);for(let l=0;l<3;l++)n.add("chest","metal",Et(_.box(.25,2.8-l*.4,.25),3.25+.1*l,22.2,1.1-l*1.1),Tt.gun);n.add("spine","suit",Et(_.box(4.6,4.2,6,1.2,1),.1,18.2,0),Tt.suit);for(let l=0;l<3;l++){let c=16.55+l*1.25,h=_.ext([[-2.2,c],[2.4-l*.1,c+.05],[2.6-l*.1,c+.6],[2.35-l*.1,c+1.1],[-2.1,c+1.1]],6.6-l*.2,.3,{steps:3});Mn(h,$r(.06)),n.add("spine","paint",h,Tt.slateD)}n.add("pelvis","suit",Et(_.box(5,1.6,7,.5),.1,15.9,0),Tt.suitD),n.add("pelvis","metal",Et(_.box(.7,1.2,1.8,.2),2.6,15.9,0),Tt.steel),n.add("pelvis","paint",Et(_.ext([[1,15.2],[2.7,15.1],[2.4,13.4],[1.4,13]],2.6,.3),0,0,0),Tt.slateD);for(let l of[1,-1])n.add("pelvis","suit",Et(_.box(1.6,1.8,1.2,.35),-1.5,15.5,l*3.45),Tt.pouch),n.add("pelvis","suit",Et(_.box(1.4,1.6,1.1,.35),.8,15.6,l*3.5),Tt.pouch),n.add("pelvis","suit",Et(_.sph(1.5,8,6),0,15,l*2.3),Tt.suit);n.add("pelvis","suit",Et(_.box(1.2,2,4.4,.4),-2.6,15.4,0),Tt.pouch),n.add("pack","paint",Et(_.box(3.4,6.6,6.2,.8,1),-5,21.3,0),Tt.slateD),n.add("pack","paint",Et(_.ext([[-6.6,24.2],[-3.4,24.4],[-3.3,25],[-4.4,25.5],[-6.4,25.1]],5,.3),0,0,0),Tt.bone);for(let l=-1;l<=1;l++)n.add("pack","metal",Et(_.box(.35,5.2,.6,.12),-6.75,21.3,l*1.8),Tt.gun);for(let l of[1,-1]){n.add("pack","metal",Et(_.cyl(.85,.85,4.6,10),-5,21.4,l*3.45),Tt.metal),n.add("pack","metal",Et(_.torus(.86,.14,4,12),-5,22.8,l*3.45,[Math.PI/2,0,0]),Tt.gun),n.add("pack","metal",Et(_.torus(.86,.14,4,12),-5,20,l*3.45,[Math.PI/2,0,0]),Tt.gun),n.add("pack","glow",Et(_.box(.2,1.4,.2),-4.15,21.4,l*3.9),_a.map(u=>u*.6));let c=_.lathe([[.45,0],[.7,-.2],[.95,-1.1],[1.02,-1.6],[.86,-1.62],[.62,-.5],[.4,-.3]],12);n.add("pack","metal",Et(c,-5.5,19,l*1.9,[0,0,-.25]),Tt.gun),n.add("pack","glow",Et(_.cyl(.78,.78,.12,10),-5.85,17.5,l*1.9,[0,0,-.25]),_a);let h=_.lathe([[.7,0],[.55,-1.2],[.3,-2.6],[.02,-3.6]],8);n.add(l>0?"thrN":"thrF","glow",Et(h,-5.5,17.4,l*1.9,[0,0,-.25]),_a.map(u=>u*.8))}for(let l of[1,-1]){let c=l>0?"uaN":"uaF",h=l>0?"faN":"faF",u=l*ya,f=-.4,d=23;n.add(c,"suit",Et(_.sph(1.35,8,6),f,d,u),Tt.suit),n.add(c,"suit",Et(_.capsule(1.05,3,3,8),f,d-2.6,u),Tt.suit);let g=.68,x=v=>v.map(([y,T])=>[y*g,T*g+.35]),m=(v,y,T,A,R)=>n.add(c,"paint",Et(_.ext(x(v),y,.16,{steps:2}),f,d,u+l*T,[l*-R,0,0]),A);m([[-2.9,.2],[-2.1,2.2],[.6,2.75],[2.6,1.8],[2.9,-.2],[.2,-.75],[-2.6,-.5]],.5,1.45,Tt.slate,.22),m([[-2.8,-.4],[2.7,-.4],[2.5,-1.75],[-2.4,-1.85]],.45,1.25,Tt.slateD,.12),m([[-2.5,-1.55],[2.4,-1.5],[2.1,-2.75],[-2.1,-2.85]],.4,1.08,Tt.slate,.05),n.add(c,"paint",Et(_.ext(x([[-2.7,.9],[-1.8,2.45],[.8,2.85],[2.7,1.7],[1.8,1.2],[-1.5,1.4]]),3,.25),f,d,u*1.04+l*.15),Tt.bone),n.add(c,"paint",Et(_.ext(x([[-1.6,2.15],[.7,2.55],[2.2,1.85],[2,1.55],[.6,2.15],[-1.5,1.85]]),.26,.07),f,d,u+l*1.72,[l*-.22,0,0]),Tt.orange),n.add(c,"metal",Et(_.cyl(.26,.26,.26,8),f-1.15,d+.6,u+l*1.78,[Math.PI/2,0,0]),Tt.metal),n.add(c,"metal",Et(_.cyl(.26,.26,.26,8),f+1.25,d+.6,u+l*1.78,[Math.PI/2,0,0]),Tt.metal);let p=_.shell(1.35,1.8,1.35,.3,-.6,Math.PI+.6,.6,2.4,8,4);l<0&&(p=va(p)),n.add(c,"paint",Et(p,f,d-3.1,u),Tt.slateD);let M=d-Ma;n.add(h,"suit",Et(_.sph(1.05,8,6),f,M,u),Tt.suit),n.add(h,"paint",Et(_.sph(1,8,6),f-.35,M+.1,u,null,[.8,1,1]),Tt.slateD),n.add(h,"paint",Et(_.box(2.1,3,2.1,.55,1),f,M-2,u),Tt.slate),n.add(h,"metal",Et(_.box(.4,2,1,.1),f+1.05,M-2,u+l*.2),Tt.gun),n.add(h,"glow",Et(_.box(.15,.8,.5),f+1.12,M-1.6,u+l*.6),Bu.map(v=>v*.5)),n.add(h,"suit",Et(_.box(1.6,1.7,1.5,.45,1),f,M-Zc+.25,u),Tt.suitD),n.add(h,"metal",Et(_.box(.5,1.2,1.3,.15),f+.75,M-Zc+.3,u),Tt.gun)}for(let l of[1,-1]){let c=l>0?"thN":"thF",h=l>0?"shN":"shF",u=l>0?"ftN":"ftF",f=l*2.3;n.add(c,"suit",Et(_.capsule(1.5,4.6,3,8),0,11.6,f),Tt.suit);let d=_.ext([[-1.2,14],[1.85,13.9],[2.05,11.2],[1.55,9.5],[-.4,9.55],[-1.5,11.8]],1.6,.4,{steps:2});Mn(d,$r(.25,0)),n.add(c,"paint",Et(d,0,0,f+l*.75),Tt.slate),n.add(c,"paint",Et(_.ext([[1.75,13.6],[2.2,13.5],[2.3,10.5],[1.8,10]],2.4,.2),0,0,f),Tt.slateD),n.add(c,"paint",Et(_.ext([[-1.6,15.5],[1.9,15.35],[1.75,13],[-1.3,13.4]],.6,.18),0,0,f+l*1.6,[l*.12,0,0]),Tt.slateD),n.add(c,"paint",Et(_.box(1.2,.3,.3,.1),.3,14.6,f+l*1.95),Tt.orange),n.add(h,"suit",Et(_.capsule(1.15,4.4,3,8),0,4.9,f),Tt.suit);let g=Et(_.ext([[.2,9.4],[1.5,9.2],[2.05,8.2],[1.75,6.9],[.6,7.1]],2.2,.4,{steps:2}),0,0,f);Mn(g,$r(.3,f)),n.add(h,"paint",g,Tt.bone);let x=Et(_.ext([[.35,7.5],[1.55,7.3],[1.68,5],[1.38,2.8],[.35,2.6]],2.5,.3,{steps:3}),0,0,f);Mn(x,$r(.2,f)),n.add(h,"paint",x,Tt.slate),n.add(h,"paint",Et(_.box(1.2,3.4,2,.45),-.95,5.4,f),Tt.slateD),n.add(h,"metal",Et(_.box(.3,1.6,.4,.1),1.65,5.6,f),Tt.gun);let m=Et(_.ext([[-1.5,.45],[3,.45],[3.55,.8],[3.25,1.2],[1.8,1.7],[1.3,2.8],[-1.2,3],[-1.75,1.7]],2.6,.42,{steps:2}),0,0,f);Mn(m,$r(.12,f)),n.add(u,"paint",m,Tt.slateD),n.add(u,"suit",Et(_.ext([[-1.65,0],[3.3,0],[3.7,.55],[-1.8,.6]],2.75,.2),0,0,f),Tt.suitD),n.add(u,"metal",Et(_.box(1.1,.8,2.2,.3),2.8,1,f),Tt.metal)}let r=l=>Et(l,Kr.x,Kr.y,Kr.z);n.add("gun","paint",r(_.ext([[-1.6,-1.1],[4.6,-1.1],[4.95,-.4],[4.95,1],[4.2,1.45],[-.8,1.45],[-1.6,.9]],1.9,.3)),"#46505c"),n.add("gun","suit",r(_.ext([[-6,-1.7],[-4.9,-1.75],[-1.6,-.9],[-1.6,1],[-2.4,1.3],[-5.6,.95],[-6.2,.2]],1.5,.3)),Tt.suit),n.add("gun","suit",r(Et(_.box(.6,2.8,1.6,.2),-6.15,-.4,0)),Tt.suitD),n.add("gun","suit",r(_.ext([[.6,-1],[1.95,-1],[1.65,-3.4],[.6,-3.65],[.3,-3.2]],1.2,.25)),Tt.suitD),n.add("gun","metal",r(_.ext([[2.4,-1],[3.7,-1],[3.95,-3.5],[2.85,-3.8]],1.3,.2)),Tt.gun),n.add("gun","paint",r(Et(_.cyl(.8,.8,4.6,12),7.2,.25,0,[0,0,-Math.PI/2])),Tt.slate);for(let l of[5.9,6.9,7.9,8.9])n.add("gun","metal",r(Et(_.torus(.8,.13,4,12),l,.25,0,[0,Math.PI/2,0])),Tt.gun);n.add("gun","metal",r(Et(_.cyl(.38,.38,1.2,8),10,.25,0,[0,0,-Math.PI/2])),Tt.metal);let o=_.lathe([[.3,0],[.65,0],[.65,.3],[.5,.36],[.5,.6],[.65,.66],[.65,1.05],[.3,1.05]],10);n.add("gun","metal",r(Et(o,10,.25,0,[0,0,-Math.PI/2])),Tt.steel),n.add("gun","metal",r(Et(_.box(4.6,.3,.8,.1),1.6,1.6,0)),Tt.gun),n.add("gun","suit",r(Et(_.cyl(.55,.6,2.7,10),1.8,2.35,0,[0,0,-Math.PI/2])),Tt.suitD),n.add("gun","metal",r(Et(_.box(.8,.8,.9,.2),1.2,1.95,0)),Tt.gun),n.add("gun","accent",r(Et(_.cyl(.42,.42,.1,10),3.2,2.35,0,[0,0,-Math.PI/2])),[1,1,1]),n.add("gun","accent",r(Et(_.capsule(.42,2.4,2,8),6.6,-.95,0,[0,0,Math.PI/2])),[1,1,1]);for(let l of[5.4,7.8])n.add("gun","metal",r(Et(_.torus(.48,.12,4,10),l,-.95,0,[0,Math.PI/2,0])),Tt.gun);for(let l of[1,-1])n.add("gun","accent",r(Et(_.box(4.4,.22,.1),1.9,.5,l*.97)),[1,1,1]);n.add("gun","suit",r(_.ext([[5,-.8],[5.9,-.8],[5.75,-2.6],[5.15,-2.6]],1,.2)),Tt.suitD);let a=l=>Et(l,0,8,0);n.add("ball","suit",a(_.sph(6.9,12,8)),Tt.suitD),n.add("ball","glow",a(_.torus(7.1,.3,4,28)),qc),n.add("ball","glow",a(Et(_.torus(7.1,.3,4,28),0,0,0,[Math.PI/2,0,0])),qc),n.add("ball","glow",a(Et(_.torus(7.1,.3,4,28),0,0,0,[0,Math.PI/2,0])),qc);for(let l=0;l<4;l++)for(let c=0;c<2;c++){let h=l*Math.PI/2+.065,u=(l+1)*Math.PI/2-.065,f=c?Math.PI/2+.06:.07,d=c?Math.PI-.07:Math.PI/2-.06;n.add("ball","paint",a(_.shell(7.75,7.75,7.75,.7,h,u,f,d,5,4)),(l+c)%2?Tt.slate:Tt.bone)}for(let l of[1,-1])n.add("ball","metal",a(Et(_.cyl(2.3,2.6,1.2,14),0,0,l*7.35,[Math.PI/2,0,0])),Tt.metal),n.add("ball","glow",a(Et(_.torus(1.55,.2,4,18),0,0,l*7.98)),qc),n.add("ball","metal",a(Et(_.cyl(.7,.7,.5,6),0,0,l*8,[Math.PI/2,0,0])),Tt.gun);return n.build()}function dp(n,t){return 6.8*Math.cos(n)+6.6*Math.cos(n+t)+1.6}var Jc=["thN","shN","ftN","thF","shF","ftF","spine","chest","head","pelvisY","pelvisX","twist","spreadN","spreadF"];function zu(){let n={};for(let t of Jc)n[t]=0;return n}function us(n,t,e){if(!(e<=0))for(let i of Jc)n[i]+=(t[i]||0)*e}var Yc=new ye,WS=new ye,XS=new ne,fp=new ye,vy=new ye(-.4,-1,1.2),yy=new ye(-.2,-1,-1.1);function gp(n,t){let e=n.bones,i={yaw:0,morph:0,crouch:0,air:0,water:0,phase:0,run:0,land:0,prevVy:0,wasGround:!0,aim:0,recoil:0,lastCd:0,time:0,pose:zu(),roll:0,thrust:0,fireGlow:0,weapon:null,aimDown:0},s=n.byMat.accent,r=new ye;function o(l){if(i.weapon===l)return;i.weapon=l;let c=new It(up[l]||up.spread);s.userData.baseColor.setRGB(c.r*4,c.g*4,c.b*4),n.fx.dirty=!0}function a(l,c,h,u){h=Math.min(h,.05),i.time+=h,o(l.weapon),i.water=pe(i.water,l.inWater?1:0,5,h);let f=1-.45*i.water;i.yaw=pe(i.yaw,l.facing>=0?0:-Math.PI,24,h);let d=l.morph?1:0;i.morph=d>i.morph?Math.min(1,i.morph+h/.15):Math.max(0,i.morph-h/.15),i.crouch=pe(i.crouch,l.crouch?1:0,28,h);let g=!!l.onGround;i.air=pe(i.air,g?0:1,g?30:14,h),g&&!i.wasGround&&i.prevVy>260&&(i.land=Se(i.prevVy/650,.35,1)),i.land=Math.max(0,i.land-h*5.5),i.wasGround=g,i.prevVy=l.vy;let x=Math.abs(l.vx),m=Se(x/205,0,1);if(g){let it=Dn(22,62,m);i.phase+=x*h/it*Ot}i.run=pe(i.run,g&&!l.crouch&&x>8?Jn(x/70):0,12,h);let p=0,M=!1;l.beamActive&&l.beam?(p=Math.atan2(-l.beam.dy,Math.abs(l.beam.dx)||.001),M=!0):l.weapon==="spread"&&l.aimDir&&(p=l.aimDir<0?Math.PI/2:-Math.PI/2),l.crouch&&(p=Math.min(p,0)-.04),i.aim=pe(i.aim,p,M?40:22,h),i.aimDown=pe(i.aimDown,!g&&p<-1?1:0,16,h),l.cooldown>i.lastCd+1e-4&&!M&&(i.recoil=1,i.fireGlow=1),i.lastCd=l.cooldown||0,M&&(i.recoil=Math.max(i.recoil,.25+.15*Math.sin(i.time*90)),i.fireGlow=1),i.recoil=Math.max(0,i.recoil-h*9),i.fireGlow=Math.max(0,i.fireGlow-h*5);let v=i.time*f,y=i.phase,T=zu(),A={thN:.06,shN:-.14,ftN:.08,thF:-.1,shF:-.1,ftF:.2,spine:-.03,chest:.015*Math.sin(v*1.7),head:.02*Math.sin(v*.7)},R=Dn(.5,1,m),C=it=>({th:(.66*Math.sin(it)+.06)*R,sh:-(.18+1.3*Math.pow(Math.max(0,Math.cos(it+.5)),1.3))*R,ft:.35*Math.cos(it+.2)*R-.05}),S=C(y),b=C(y+Math.PI),D={thN:S.th,shN:S.sh,ftN:S.ft,thF:b.th,shF:b.sh,ftF:b.ft,spine:-.14*m,chest:-.03,head:.1*m,twist:.1*Math.sin(y)*m},N=Jn((l.vy+120)/520),F={thN:1,shN:-1.55,ftN:.25,thF:-.3,shF:-.8,ftF:-.35,spine:-.06,head:.08},B={thN:.35,shN:-.45,ftN:-.1,thF:-.12,shF:-.35,ftF:-.3,spine:.04,head:-.05,spreadN:.08,spreadF:.08},G={thN:1.35,shN:-2.1,ftN:.3,thF:1.15,shF:-1.95,ftF:.2,spine:-.15,head:-.1},X=Math.sin(v*2.4),j={thN:.25+.35*X,shN:-.55-.3*Math.sin(v*2.4+1),ftN:-.35,thF:.25-.35*X,shF:-.55-.3*Math.sin(v*2.4+1+Math.PI),ftF:-.35,spine:-.18,head:.15},Z={thN:.28,shN:-1.88,ftN:-1.25,thF:1.55,shF:-1.75,ftF:.18,spine:-.42,chest:-.08,head:.38,pelvisX:-.6},J={thN:1.6,shN:-2.3,thF:1.6,shF:-2.3,spine:-.9,chest:-.4,head:-.4},ot=i.air*(1-i.crouch),ft=1-ot,Lt=i.crouch*ft,Ut=i.run*(1-i.crouch)*ft,zt=Math.max(0,ft-Lt-Ut);if(us(T,A,zt),us(T,D,Ut),us(T,Z,Lt),ot>0){let it=i.water,at=zu();us(at,F,(1-N)*(1-i.aimDown)),us(at,B,N*(1-i.aimDown)),us(at,G,i.aimDown),us(T,at,ot*(1-it)),us(T,j,ot*it)}if(i.morph>0){let it=Jn(i.morph);for(let at of Jc)T[at]=Dn(T[at],J[at]||0,it)}let Ft=Dn(26,6,i.water);for(let it of Jc)i.pose[it]=pe(i.pose[it],T[it],Ft,h);let Q=i.pose;e.body.rotation.set(0,i.yaw,0);let ht=Math.max(1e-4,1-Jn(i.morph*1.7));e.body.scale.setScalar(ht),e.body.position.set(0,8*(1-ht),0);let wt=Math.max(1e-4,Jn((i.morph-.12)/.7));e.ball.scale.setScalar(wt),i.roll-=l.vx*h/7.8,e.ball.rotation.set(0,0,i.roll+(1-wt)*2.5),e.thN.rotation.set(Q.spreadN,0,Q.thN),e.shN.rotation.set(0,0,Q.shN),e.ftN.rotation.set(0,0,Q.ftN),e.thF.rotation.set(-Q.spreadF,0,Q.thF),e.shF.rotation.set(0,0,Q.shF),e.ftF.rotation.set(0,0,Q.ftF);let _t,At=dp(Q.thN,Q.shN),se=dp(Q.thF,Q.shF),_e=Math.max(At,se)-15,I=-1.2*(1-N)*(1-i.water);_t=Dn(_e,I,ot)-i.land*2.4+zt*.12*Math.sin(v*1.7),i.crouch>.01&&(_t=Dn(_t,-6.8,Lt)),e.pelvis.position.set(Q.pelvisX,15.4+_t,0),e.pelvis.rotation.set(0,Q.twist*.5,0),e.spine.rotation.set(0,-Q.twist*.4,Q.spine-i.land*.25+i.aim*.08),e.chest.rotation.set(0,-Q.twist*.5,Q.chest+i.aim*.1),e.chest.scale.set(1,1+.012*Math.sin(v*1.7)*zt,1),e.head.rotation.set(0,0,Q.head+i.aim*.35-(Q.spine+Q.chest)*.5),e.pack.rotation.set(0,0,-i.land*.12+(l.vy||0)*12e-5*ot);let H=Q.spine-i.land*.25+i.aim*.08+Q.chest+i.aim*.1,Y=i.aim-H;e.gun.rotation.set(0,0,Y);let W=i.recoil*1.1;e.gun.position.set(e.gun.userData.rest.x-Math.cos(Y)*W,e.gun.userData.rest.y-Math.sin(Y)*W,e.gun.userData.rest.z),i.crouch>.01&&(e.gun.position.y-=.8*Lt),e.gun.updateMatrix(),Yc.copy(gy).applyMatrix4(e.gun.matrix),ku(e.uaN,e.faN,Yc,vy,Ma,Zc),Yc.copy(xy).applyMatrix4(e.gun.matrix),ku(e.uaF,e.faF,Yc,yy,Ma,Zc);let tt=ot*(l.vy<0?1:.25)*(1-i.water*.7)*(1-i.morph);i.thrust=pe(i.thrust,tt,14,h);let et=i.thrust*(.85+.15*Math.sin(i.time*47));e.thrN.scale.set(.6+.4*et,Math.max(1e-4,et*1.1),.6+.4*et),e.thrF.scale.copy(e.thrN.scale),n.fx.pulse(s,1+i.fireGlow*.9+(M?.4:0)),n.fx.apply(0,0),fp.copy(my),e.gun.updateWorldMatrix(!0,!1),r.copy(fp).applyMatrix4(e.gun.matrixWorld)}return{update:a,st:i,muzzle:r}}function xp(){let n=new xe(.05);n.bone("body","root",0,0,0).bone("flA","body",-13.8,-.4,3).bone("flB","body",-13.8,-.4,-3).bone("strobe","body",-9.6,5.6,0).bone("tipN","body",-8.7,-.2,10.4).bone("tipF","body",-8.7,-.2,-10.4);let t=_.lathe([[.001,13.2],[.5,12.4],[1.2,10.4],[2,7],[2.55,3.5],[2.75,0],[2.6,-5],[2.3,-9],[1.9,-11.6],[1.4,-12.2],[.001,-12.3]],16);je(t,null,[0,0,-Math.PI/2]),Mn(t,e=>{e.y*=.72,e.y<0&&(e.y*=.8),e.z*=1.15},"smooth"),n.add("body","paint",t,Tt.bone),n.add("body","paint",_.ext([[-10.5,1],[2,1.3],[5.5,1.6],[3,2.4],[-6,2.6],[-10.8,2]],2.2,.35),Tt.slate);for(let e of[1,-1]){n.add("body","paint",Et(_.ext([[-3.5,-1.6],[4.5,-1.2],[5.6,-.2],[4.2,.9],[-3.5,1]],1.6,.35),0,0,e*2.2),Tt.slate),n.add("body","metal",Et(_.box(.4,2,1.2,.1),5.4,-.3,e*2.3),Tt.suitD),n.add("body","accent",Et(_.box(3.5,.18,.12),1,-.4,e*3.06),Vt("#6cf3ff",3));let i=_.ext([[4,-1.8],[-5.5,-10.6],[-9.2,-10.6],[-8.6,-2.2]],.55,.2);je(i,null,[Math.PI/2,0,0]),e<0&&(i=va(i)),n.add("body","paint",Et(i,0,-.6,0,[e*-.05,0,0]),Tt.slate);let s=_.ext([[-6,-3],[-8.9,-9.8],[-9.9,-9.8],[-9.6,-3]],.4,.12);je(s,null,[Math.PI/2,0,0]),e<0&&(s=va(s)),n.add("body","paint",Et(s,0,-.55,0),Tt.orange),n.add("body","metal",Et(_.cyl(1.55,1.7,8.4,14),-8.2,-.4,e*3,[0,0,Math.PI/2]),Tt.metal),n.add("body","paint",Et(_.cyl(1.7,1.75,3.4,14),-6.5,-.4,e*3,[0,0,Math.PI/2]),Tt.slateD);let r=_.lathe([[1.5,0],[1.75,-.4],[1.55,-1.6],[1.25,-1.62],[1.3,-.4]],14);n.add("body","metal",Et(r,-12.3,-.4,e*3,[0,0,-Math.PI/2]),Tt.gun),n.add("body","glow",Et(_.cyl(1.25,1.25,.1,12),-13.8,-.4,e*3,[0,0,Math.PI/2]),_a);let o=_.lathe([[1.15,0],[.9,-2],[.45,-4.2],[.02,-5.6]],10);n.add(e>0?"flA":"flB","glow",Et(o,-13.8,-.4,e*3,[0,0,-Math.PI/2]),_a.map(l=>l*.7)),n.add("body","paint",Et(_.ext([[-11.2,1.4],[-8,1.6],[-9,6],[-10.6,6.2]],.5,.15),0,0,e*2,[e*.32,0,0]),Tt.slate);let a=_.ext([[8.6,-2],[6.4,-4.2],[5.4,-4.2],[6.2,-2]],.35,.1);je(a,null,[Math.PI/2,0,0]),e<0&&(a=va(a)),n.add("body","paint",Et(a,0,.2,0),Tt.slateD),n.add("body","metal",Et(_.capsule(.55,4,2,8),-1,-1,e*6.4,[0,0,Math.PI/2]),Tt.gun),n.add("body","metal",Et(_.cyl(.22,.22,2.5,6),2.2,-1,e*6.4,[0,0,Math.PI/2]),Tt.metal),n.add(e>0?"tipN":"tipF","glow",Et(_.sph(.42,6,4),-8.7,-.2,e*10.4),e>0?fy:pp)}return n.add("body","crystal",Et(_.ell(3.6,1.35,1.35,14,8),3.6,1.65,0),"#1c4658"),n.add("body","metal",Et(_.torus(1.42,.16,4,14,Math.PI),3,1.6,0,[0,Math.PI/2,0]),Tt.gun),n.add("strobe","glow",Et(_.sph(.32,6,4),-9.6,5.9,0),py),n.build()}function vp(n){let t=n.bones,e={pitch:0,roll:0,thrust:.6,time:0};function i(s,r,o){o=Math.min(o,.05),e.time+=o;let a=s.vy||0,l=s.vx||0;e.pitch=pe(e.pitch,Se(-a/240,-1,1)*.2,10,o),e.roll=pe(e.roll,Se(a/240,-1,1)*.55,8,o),e.thrust=pe(e.thrust,Se(.55+l/240*.5,.2,1.1),10,o),t.body.rotation.set(e.roll+Math.sin(e.time*1.3)*.03,0,e.pitch+Math.sin(e.time*1.7)*.015),t.body.position.y=Math.sin(e.time*2.1)*.25;let c=e.thrust*(.88+.12*Math.sin(e.time*53));t.flA.scale.set(Math.max(1e-4,c),.7+.3*c,.7+.3*c),t.flB.scale.copy(t.flA.scale);let h=e.time%1.1<.07?1:1e-4;t.strobe.scale.setScalar(h);let u=.75+.25*Math.sin(e.time*6);t.tipN.scale.setScalar(u),t.tipF.scale.setScalar(u),n.fx.apply(0,0)}return{update:i,st:e}}var E=(n,t,e,i,s,r)=>je(n,[t,e,i],s,r),Qt=(n,t,e,i,s,r=6,o=6)=>_.taperTube([n,t,e],a=>Dn(i,s,a),r,o),_y=(n,t,e,i)=>{let s=Math.sin(Math.round(n*97)*12.9898+Math.round(t*97)*78.233+Math.round(e*97)*37.719+i*11.1)*43758.5453;return s-Math.floor(s)};function Pe(n,t=1,e=.22,i=1,s=1,r=1,o=1){let a=_.ico(1,i);return Mn(a,l=>{let c=_y(l.x,l.y,l.z,t);l.multiplyScalar(n*(1+(c-.5)*e*2)),l.x*=s,l.y*=r,l.z*=o},!1),a.computeVertexNormals(),a}var yp=(n,t,e,i)=>{let s=Math.floor(n),r=Math.floor(t),o=Math.floor(e),a=n-s,l=t-r,c=e-o,h=a*a*(3-2*a),u=l*l*(3-2*l),f=c*c*(3-2*c),d=(x,m,p)=>{let M=Math.sin(x*127.1+m*311.7+p*74.7+i*19.3)*43758.5453;return M-Math.floor(M)},g=(x,m,p)=>x+(m-x)*p;return g(g(g(d(s,r,o),d(s+1,r,o),h),g(d(s,r+1,o),d(s+1,r+1,o),h),u),g(g(d(s,r,o+1),d(s+1,r,o+1),h),g(d(s,r+1,o+1),d(s+1,r+1,o+1),h),u),f)};function on(n,t,e,i=1,s=.12,r=14,o=10){let a=_.ell(1,1,1,r,o);return Mn(a,l=>{let c=yp(l.x*1.6+5,l.y*1.6,l.z*1.6,i)*.65+yp(l.x*4+9,l.y*4,l.z*4,i+3)*.35;l.multiplyScalar(1+(c-.5)*s*2.4),l.x*=n,l.y*=t,l.z*=e},"smooth"),a}function Ge(n,t,e,i,s="crystal"){for(let[r,o,a,l,c,h,u,f]of e)n.add(t,s,E(_.crystal(l,c,6,.32,f||1),r,o,a,[h||0,(f||1)*.7,u||0]),i)}function jr(n,t,e,i,s,r,o,a,l,c="#24221f"){n.bone(t,e,i[0],i[1],i[2]).bone(t+"k",t,s[0],s[1],s[2]);let h=[(i[0]+s[0])/2,(i[1]+s[1])/2+o*.6,(i[2]+s[2])/2],u=[(s[0]+r[0])/2+o*.3,(s[1]+r[1])/2+o*.3,(s[2]+r[2])/2];n.add(t,a,Qt(i,h,s,o,o*.8),l),n.add(t,"suit",E(_.sph(o*.85,7,5),s[0],s[1],s[2]),c),n.add(t+"k",a,Qt(s,u,r,o*.78,o*.22),l)}function _p(n,t,e,i,s){let r=!!(i&&i.freeze>0),o=r?0:Math.min(s,.05);n.time+=o;let a=e&&e.hitFlash>0?Math.min(1,e.hitFlash*14):0,l=r?Math.min(1,i.freeze*2):0;return n.flash=a,n.frost=l,o}function Mp(n,t){t.fx.apply(n.flash,n.frost)}function Ln(n,t,e,i=10){return n.yaw=pe(n.yaw,t>=0?0:-Math.PI,i,e),n.yaw}function Gn(n,t){let e=t&&t.player;return e?Math.sign(e.x+e.w/2-(n.x+n.w/2))||n.facing||-1:n.facing||-1}function ds(n,t,e=.5){let i=t&&t.player;return i?Math.atan2(-(i.y+i.h/2-(n.y+n.h*e)),i.x+i.w/2-(n.x+n.w/2)):Math.PI}function tr(n,t,e,i=1.6){let s=t.fireT!=null?t.fireT:1;n.lastFire!=null&&s>n.lastFire+.05&&(n.kick=1),n.lastFire=s,n.kick=Math.max(0,(n.kick||0)-e*5),n.charge=s<.45&&s>0?1-s/.45:0}function ba(n,t){let e=!n.vy||Math.abs(n.vy)<.001,i=(n.t||0)%t,s=e?Jn((i-(t-.3))/.3):0,r=e?0:Se((n.vy||0)/400,-1,1);return{ground:e,crouch:s,air:r}}function $c(n,t,e,i,s){n.mount==null&&(n.mount=hp(e,i));let r=t.bones.root;return n.mount==="ceil"?(r.rotation.set(0,0,Math.PI),r.position.set(0,s,0)):n.mount==="wallL"?(r.rotation.set(0,0,-Math.PI/2),r.position.set(-s/2,s/2,0)):n.mount==="wallR"&&(r.rotation.set(0,0,Math.PI/2),r.position.set(s/2,s/2,0)),n.mount}function Kc(n,t){return n==="ceil"?t-Math.PI:n==="wallL"?t+Math.PI/2:n==="wallR"?t-Math.PI/2:t}function jc(n,t,e,i=-.35,s=1.45){let r=Math.cos(t)>=0;Ln(n,r?1:-1,e,8);let o=r?t:Math.PI-t;return o>Math.PI&&(o-=Ot),n.pitch=pe(n.pitch||0,Se(o,i,s),10,e),n.pitch}function Sa(n,t,e,i){n.rotation.set(-t*i,t*e,0)}var we={chitin:"#6e3320",chitinL:"#8e4628",chitinD:"#3e1d12",rock:js("#7c4a32","#5e3424",2.2,"#9a6a48"),rockL:js("#8e5a3c","#6e402a",2,"#b08060"),rockD:"#4a2a1c",crys:"#4f97ff",bronze:"#7a6040",bone:"#d2bc98"},Qc=Vt("#ffad3a",3.2),wp=Vt("#7fc4ff",3),ze={shell:"#3e555c",shellL:"#58747a",stone:"#4f5f66",stoneD:"#333f44",patina:"#4d6b5e",patinaD:"#344a42",flesh:"#6a4a5a",fleshL:"#86607a",crys:"#3fd6c8",eelD:"#24393f",eelL:"#5b7f86"},Qr=Vt("#3fe6d4",3.2),wa=Vt("#45f0dc",3.6);function My(){let n=new xe;n.bone("body","root",0,7,0).bone("head","body",7.2,7.6,0).bone("crys","body",-1,10.8,0),n.add("body","suit",E(_.ell(7,2.5,4.4,14,8),-.4,6.3,0),we.chitinD),n.add("body","paint",E(_.ell(4.4,3,4.2,12,8),-4.4,7.3,0),we.chitinD);for(let i of[1,-1]){n.add("body","paint",E(_.shell(8.2,5.4,5.7,.55,i>0?.06:Math.PI+.06,i>0?Math.PI-.06:Ot-.06,0,1.64,12,6),-1.6,7.5,0),we.chitin);for(let[s,r,o,a]of[[-3.2,12,3.1,2],[.8,12.3,2.7,3],[-6,10.4,3.7,4],[3.6,10.6,3.6,5]])n.add("body","suit",E(Pe(1,a*7+(i>0?1:2),.35,0,1.6,.55,1.15),s,r,i*o,[i*.5,0,0]),we.rockL);n.add("body","glow",E(_.box(2.6,.22,.2),-1.8,9.2,i*5.55,[0,0,.05]),wp.map(s=>s*.5))}n.add("body","paint",E(_.shell(3.8,3.3,4.5,.5,0,Ot,0,1.75,12,5),4.2,7.6,0),we.chitinL),n.add("head","paint",E(_.ell(2.3,2.1,2.8,10,8),8,7.5,0),we.chitinD);for(let i of[1,-1])n.add("head","glow",E(_.ell(.7,.8,.5,8,6),9.5,8.4,i*1.7),Qc),n.add("head","paint",Qt([9.8,6.8,i*1.3],[11.4,6.6,i*1.05],[11.7,5.5,i*.2],.55,.1),we.chitinD),n.add("head","suit",Qt([9.4,9.2,i*1],[11,11.4,i*1.8],[13.2,12.1,i*2.4],.17,.07,6,4),we.chitinD);Ge(n,"crys",[[-1.2,10.6,0,1.75,9.8,.05,.14,3],[-3.9,10.4,1.5,1.25,7,.32,.36,5],[1.6,11,-1.1,1.1,6.2,-.26,-.3,7],[-5.9,9.6,-1.7,.9,4.2,-.42,.6,9],[2.9,10.4,1.9,.8,3.6,.45,-.42,11],[-2.6,10.9,-2.4,.7,3,-.6,.2,13]],we.crys);let t=[4.2,.6,-3.2],e=[2.4,.3,-2.2];for(let i=0;i<6;i++){let s=i%2?-1:1,r=Math.floor(i/2),o=t[r],a=e[r];jr(n,"l"+i,"body",[o,6.6,s*3.6],[o+a*.5,9.8,s*7.6],[o+a,.3,s*9.3],.8,"paint",we.chitinD)}return n.build()}function by(n,t,e,i,s){n.root.rotation.y=Ln(t,e.facing||-1,s,8),t.phase+=Math.abs(e.vx||0)*s/15*Ot;for(let r=0;r<6;r++){let o=r%2?-1:1,a=r===0||r===3||r===4,l=t.phase+(a?0:Math.PI),c=.34*Math.max(0,Math.cos(l));Sa(n["l"+r],o,.36*Math.sin(l),c),n["l"+r+"k"].rotation.x=-o*c*.7}n.body.position.y=7+.35*Math.abs(Math.sin(t.phase*2))+.12*Math.sin(t.time*2),n.body.rotation.x=.04*Math.sin(t.phase),n.head.rotation.y=.18*Math.sin(t.time*1.3),n.crys.rotation.z=.025*Math.sin(t.time*2.2)}function Sy(){let n=new xe;n.bone("body","root",0,10,0).bone("head","body",6.6,9.6,0),n.add("body","suit",E(Pe(7,4,.22,1,1.18,.95,1),-.6,11.2,0),we.rock),n.add("body","suit",E(Pe(3.2,5,.3,0,1.6,.55,1.25),-2.2,17.4,.4,[0,0,.15]),we.rockL),n.add("body","suit",E(Pe(2.6,6,.3,0,1.5,.55,1.2),2.6,16.4,-1.6,[.2,0,-.25]),we.rockL),n.add("body","suit",E(Pe(2.4,7,.3,0,1.5,.6,1.1),-5.6,14.6,1.8,[-.2,0,.6]),we.rockL),n.add("body","suit",E(_.ell(5.6,2.4,4.6,12,6),0,6.6,0),we.rockD),Ge(n,"body",[[-3.2,15.2,3.6,.95,4.2,.55,.3,2],[1.4,16.8,-3,.85,3.6,-.6,-.2,4],[-6,12.8,-2.4,.7,3,-.45,.8,6],[4.6,14,2.6,.6,2.4,.5,-.6,8]],we.crys),n.add("head","paint",E(_.ell(2.7,2.2,3,10,8),7.4,9.1,0),we.rockD),n.add("head","suit",E(Pe(1.7,9,.3,0,1.3,.7,1.4),7.2,10.8,0),we.rock);for(let e of[1,-1])n.add("head","glow",E(_.sph(.55,6,4),9.6,9.8,e*1.3),Qc),n.add("head","glow",E(_.sph(.38,6,4),9.1,10.7,e*2),Qc),n.add("head","paint",Qt([9.4,8,e*1.4],[10.9,7.6,e*1.2],[11.2,6.7,e*.4],.5,.1),we.chitinD);let t=[3.6,3.6,-3.6,-3.6];for(let e=0;e<4;e++){let i=e%2?-1:1,s=t[e];jr(n,"l"+e,"body",[s,8.2,i*4.4],[s*1.35,11.6,i*8.4],[s*1.55,.3,i*9.6],1.15,"paint",we.chitinD)}return n.build()}function wy(n,t,e,i,s){let r=ba(e,1.2),o=Math.abs(e.vx||0)>1?Math.sign(e.vx):Gn(e,i);n.root.rotation.y=Ln(t,o,s,9),t.cr=pe(t.cr||0,r.crouch,20,s),t.air=pe(t.air||0,r.air,14,s);let a=Math.max(0,-t.air),l=Math.max(0,t.air);n.body.position.y=10-3.4*t.cr+.15*Math.sin(t.time*2.5),n.body.rotation.z=-.22*t.air+.12*t.cr;for(let c=0;c<4;c++){let h=c%2?-1:1,u=c<2?1:-1,f=.45*t.cr-.35*a+.15*l;Sa(n["l"+c],h,u*(.1+.25*a-.2*l),f),n["l"+c+"k"].rotation.x=h*(.5*t.cr-.25*a)}n.head.rotation.z=.12*t.cr+.06*Math.sin(t.time*3)}function Ey(){let n=new xe;n.bone("yaw","root",0,9,0).bone("aim","yaw",0,10.2,0).bone("gun","aim",0,10.2,0),n.add("root","suit",E(Pe(6,11,.3,1,1.4,.55,1.1),0,2,0),we.rock),n.add("root","suit",E(Pe(3,12,.35,0,1.2,.8,1.2),-7.2,1.6,2.6),we.rockD),n.add("root","suit",E(Pe(2.4,13,.35,0,1.3,.7,1.1),6.8,1.2,-2.2),we.rockL),Ge(n,"root",[[-4.5,3.8,4.2,.8,3.6,.6,.4,3],[5.2,3.4,3.8,.7,3,.7,-.5,5]],we.crys),n.add("root","metal",E(_.torus(5,.85,6,20),0,6.8,0,[Math.PI/2,0,0]),we.bronze);for(let t=0;t<6;t++){let e=t/6*Ot;n.add("root","metal",E(_.cyl(.4,.4,.8,6),Math.cos(e)*5,7.6,Math.sin(e)*5),"#4a4036")}n.add("yaw","metal",E(_.cyl(3.4,4.2,3,12),0,8.4,0),"#3e3a34"),n.add("aim","paint",E(_.sph(5.4,16,12),0,10.6,0),"#8a5636"),n.add("aim","paint",E(_.shell(5.9,5.9,5.9,.5,-1.2,1.2,.35,2.4,10,6),0,10.6,0),we.rockL);for(let t of[1,-1])n.add("aim","paint",E(_.ext([[-4,-1],[2,-.6],[3.5,1.6],[-3.2,2.2]],.6,.2),0,10.6,t*5.8),we.chitinD);n.add("aim","metal",E(_.torus(1.9,.45,6,16),5.1,11.2,0,[0,Math.PI/2,0]),"#2e2a26"),n.add("aim","core",E(_.sph(1.7,12,10),5.4,11.6,0,null,[.75,1,1]),Vt("#ff8a3a",2.6)),n.add("aim","metal",E(_.torus(1.75,.3,5,16),5.6,11.6,0,[0,Math.PI/2,0]),"#2e2a26");for(let t of[2.3,-2.3])n.add("gun","metal",E(_.cyl(.75,.85,7,10),7.6,8.9,t,[0,0,-Math.PI/2]),"#3a3632"),n.add("gun","metal",E(_.cyl(.95,.95,1.2,10),11,8.9,t,[0,0,-Math.PI/2]),"#6a5a44");return n.build()}function Ty(n,t,e,i,s,r){let o=$c(t,r,e,i,20),a=Kc(o,e.aim!=null?-e.aim:ds(e,i)),l=jc(t,a,s,-.5,1.5);n.yaw.rotation.y=t.yaw,n.aim.rotation.z=l,tr(t,e,s),n.gun.position.x=-t.kick*1.6,r.fx.pulse(r.byMat.core,.7+t.charge*1.6+.15*Math.sin(t.time*4))}function Ay(){let n=new xe;n.bone("body","root",0,8,0).bone("head","body",5.6,8.6,0).bone("ab0","body",-2.2,8,0).bone("ab1","ab0",-5.4,7.6,0).bone("ab2","ab1",-8.2,7,0).bone("wN","body",.6,10.2,1.5).bone("wF","body",.6,10.2,-1.5).bone("wN2","body",-1.2,10,1.3).bone("wF2","body",-1.2,10,-1.3),n.add("body","paint",E(_.ell(3.4,2.7,2.6,12,8),.6,8.4,0),we.chitin),n.add("body","paint",E(_.shell(3.6,3,2.8,.4,0,Ot,0,1.2,12,4),.6,8.6,0),"#b8742e"),n.add("head","paint",E(_.ell(2,2,2.1,10,8),6,8.6,0),we.chitinD);for(let e of[1,-1]){n.add("head","glow",E(_.ell(1,1.35,.8,8,6),6.8,9.2,e*1.35),Qc),n.add("head","paint",Qt([7.4,7.6,e*.8],[8.6,7,e*.7],[8.7,6.2,e*.15],.38,.08),we.chitinD),n.add("head","suit",Qt([6.8,10.2,e*.6],[8,12.4,e*1],[9.6,13,e*1.4],.14,.06,6,4),we.chitinD);for(let i=0;i<3;i++)n.add("body","suit",Qt([1.8-i*1.4,6.3,e*.9],[2.4-i*1.8,3.6,e*2.2],[1.6-i*2.4,1,e*2.6],.22,.07,6,4),we.chitinD)}n.add("ab0","paint",E(_.ell(2.4,2.3,2.3,10,8),-3,7.9,0),"#b8742e"),n.add("ab0","paint",E(_.torus(2.1,.32,4,14),-4.4,7.7,0,[0,Math.PI/2,.15]),we.chitinD),n.add("ab1","paint",E(_.ell(2.6,2.4,2.4,10,8),-6.2,7.3,0),we.chitinD),n.add("ab1","paint",E(_.torus(2.25,.34,4,14),-6.4,7.3,0,[0,Math.PI/2,.25]),"#b8742e"),n.add("ab2","paint",E(_.ell(2,1.8,1.8,10,8),-9,6.6,0),"#b8742e"),n.add("ab2","crystal",E(_.crystal(.7,4.2,6,.4,5),-10.4,6.2,0,[0,0,Math.PI/2+.35]),we.crys),n.add("ab2","glow",E(_.sph(.45,6,4),-10.6,6.2,0),wp);let t=(e,i)=>_.membrane([[0,0],[-1.2,i*.6],[-e*.55,i],[-e,i*.85],[-e*.7,i*.35],[-e*.25,.2]]);for(let[e,i,s,r]of[["wN",1.5,9,8.5],["wF",-1.5,9,8.5],["wN2",1.3,6.5,6],["wF2",-1.3,6.5,6]]){let o=e.endsWith("2")?-1.2:.6,a=e.endsWith("2")?10:10.2;n.add(e,"membrane",E(t(s,r),o,a,i),"#d8b07a"),n.add(e,"paint",Qt([o,a,i],[o-s*.3,a+r*.85,i],[o-s,a+r*.85,i],.18,.06,8,4),we.chitinD)}return n.build()}function Ry(n,t,e,i,s){let r=Gn(e,i);n.root.rotation.y=Ln(t,r,s,6);let o=t.py!=null&&s>0?(e.y-t.py)/s:0;t.py=e.y,t.bank=pe(t.bank||0,Se(-o/120,-1,1),6,s),n.body.rotation.z=t.bank*.25;let a=Math.sin(t.time*Ot*14),l=Math.sin(t.time*Ot*14+1.2);n.wN.rotation.x=-.25-.9*a,n.wF.rotation.x=.25+.9*a,n.wN2.rotation.x=-.35-.8*l,n.wF2.rotation.x=.35+.8*l,n.ab0.rotation.z=.1*Math.sin(t.time*3),n.ab1.rotation.z=.14*Math.sin(t.time*3-.7)-.1,n.ab2.rotation.z=.2*Math.sin(t.time*3-1.4)-.15,n.head.rotation.y=.15*Math.sin(t.time*1.7)}function Cy(){let n=new xe;n.bone("body","root",0,8,0).bone("spin","body",0,8,0),n.add("body","flesh",E(on(4.3,4.5,4.3,3,.1),0,8,0),"#8a5a3a"),n.add("body","core",E(_.torus(4.15,.34,6,24),0,8,0,[Math.PI/2,0,0]),Vt("#7fc4ff",2)),n.add("body","core",E(_.sph(1.1,8,6),0,12.4,0),Vt("#9fd4ff",1.6));let t=12;for(let e=0;e<t;e++){let i=1-(e+.5)/t*2,s=Math.sqrt(1-i*i),r=e*2.39996,o=[Math.cos(r)*s,i,Math.sin(r)*s];if(Math.abs(i)>.92)continue;let a=_.cone(.42,3.4,6);a.translate(0,1.7,0);let l=[o[0]*3.9,8+o[1]*4.1,o[2]*3.9];n.add("spin","paint",Ea(a,o,l),"#9a7a58"),n.add("spin","crystal",Ea(E(_.crystal(.32,1.4,5,.5,e+3),0,3.3,0),o,l),we.crys)}for(let e=0;e<3;e++){let i=e/3*Ot,s=_.membrane([[0,-1.2],[5.8,-.4],[7.2,1.8],[4.2,2.6],[0,1.4]]);n.add("spin","membrane",E(s,Math.cos(i)*3.6,8,Math.sin(i)*3.6,[0,-i,0]),"#b08a5a"),n.add("spin","paint",E(Qt([0,0,0],[3.6,2,0],[7.2,1.8,0],.16,.08,6,4),Math.cos(i)*3.6,8,Math.sin(i)*3.6,[0,-i,0]),we.bone)}return n.build()}function Py(n,t,e,i,s,r){n.spin.rotation.y+=s*1.7,n.body.rotation.set(.18*Math.sin(t.time*1.3),0,.22*Math.sin(t.time*1.7));let o=i.player,l=(o?Math.hypot(o.x-e.x,o.y-e.y):999)<90?9:3;r.fx.pulse(r.byMat.core,.5+.7*(.5+.5*Math.sin(t.time*l)))}function Iy(){let n=new xe;n.bone("body","root",0,8.6,0).bone("clN","body",5,9,3.4).bone("clF","body",-5,9,3.4),n.add("body","flesh",E(_.shell(8.8,5.2,6.6,.6,0,Ot,0,1.72,16,7),0,9.2,0),ze.shell),n.add("body","suit",E(_.ell(7,2.6,5.4,14,8),0,8.4,0),ze.stoneD);for(let e=0;e<7;e++){let i=(e/6-.5)*2.2;n.add("body","paint",E(_.cone(.55,1.6,5),Math.sin(i)*8.6,8.6,Math.cos(i)*6.4*.98,[Math.PI/2-.3,0,-i*.3]),ze.shellL)}Ge(n,"body",[[-2,12.8,-1.2,1.45,7.6,-.2,.15,3],[2.6,13,-2,1.1,6,-.3,-.3,5],[.2,13.4,-3.6,.9,4.6,-.5,0,7],[-4.6,11.8,-2.6,.8,3.6,-.4,.5,9],[4.8,11.6,.4,.6,2.6,.3,-.6,11]],ze.crys);for(let e=0;e<8;e++){let i=e/7*Math.PI;n.add("body","glow",E(_.sph(.35,6,4),Math.cos(i)*7.6,10.4+Math.sin(i)*1.2,Math.sin(i)*4.8+1.2),Qr)}for(let e of[1,-1]){n.add("body","paint",Qt([e*1.6,12.2,4],[e*1.9,13.4,4.4],[e*2.1,14.4,4.7],.32,.22,6,4),ze.shellL),n.add("body","glow",E(_.sph(.62,8,6),e*2.1,14.7,4.8),wa);let i=e>0?"clN":"clF";n.add(i,"flesh",Qt([e*5,9,3.4],[e*6.9,10.6,5.8],[e*6.1,12.4,7.4],1.15,.9),ze.shell),n.add(i,"flesh",E(_.ell(2.1,1.6,1.4,10,8),e*5.5,13.3,8.1,[0,0,e*.4]),ze.shellL),n.add(i,"paint",E(_.cone(.75,3.2,6),e*4.1,15,8.4,[0,0,e*.75]),ze.shellL),n.add(i,"paint",E(_.cone(.6,2.6,6),e*5,15.3,7.6,[0,0,e*.2]),ze.stone),n.add(i,"glow",E(_.sph(.3,6,4),e*5.8,13.6,9.4),Qr)}let t=[1.8,-.6,-3];for(let e=0;e<6;e++){let i=e%2?-1:1,s=t[Math.floor(e/2)];jr(n,"l"+e,"body",[i*5.4,8,s],[i*8.8,11.2,s*1.3],[i*9.9,.3,s*1.5],.72,"paint",ze.stone)}return n.build()}function Dy(n,t,e,i,s){t.phase+=Math.abs(e.vx||0)*s/13*Ot,n.root.rotation.y=pe(n.root.rotation.y,-(e.facing||-1)*.22,6,s);for(let o=0;o<6;o++){let a=o%2?-1:1,l=t.phase+Math.floor(o/2)*2.1+(a>0?0:Math.PI),c=.36*Math.max(0,Math.sin(l));n["l"+o].rotation.set(0,.16*Math.cos(l),a*(c+.08*Math.cos(l))),n["l"+o+"k"].rotation.z=-a*c*.5}n.body.position.set(.3*Math.sin(t.phase*2),8.6+.3*Math.abs(Math.sin(t.phase*2))+.1*Math.sin(t.time*1.6),0);let r=Math.max(0,Math.sin(t.time*1.4))**6;n.clN.rotation.set(-.15*r,0,.1*Math.sin(t.time*1.1)),n.clF.rotation.set(-.15*Math.max(0,Math.sin(t.time*1.4+2))**6,0,-.1*Math.sin(t.time*1.1+1))}function Ly(){let n=new xe,t=[9,5,1,-3,-7,-11];n.bone("s0","root",t[0],6,0);for(let i=1;i<6;i++)n.bone("s"+i,"s"+(i-1),t[i],6,0);n.bone("jaw","s0",9.6,5.3,0),n.add("s0","flesh",E(_.ell(4.3,2.6,2.4,14,10),11.4,6.3,0),ze.eelD),n.add("s0","flesh",E(_.ell(3,1.2,2,10,6),10.6,7.6,0),ze.eelL),n.add("jaw","flesh",E(_.ell(3.8,1,2,12,6),12,4.7,0),ze.eelL);for(let i=0;i<5;i++)for(let s of[1,-1])n.add("jaw","paint",E(_.cone(.22,.9,4),10.4+i*.85,5.6,s*(1.6-i*.22)),"#e8e0cc"),n.add("s0","paint",E(_.cone(.22,.9,4),10.6+i*.85,5.4,s*(1.7-i*.22),[Math.PI,0,0]),"#e8e0cc");for(let i of[1,-1]){n.add("s0","glow",E(_.sph(.6,8,6),13.2,7,i*1.55),wa);for(let s=0;s<3;s++)n.add("s0","glow",E(_.box(.18,1.5,.15),8.6-s*.7,6.1,i*2.25),Qr.map(r=>r*.7));n.add("s0","suit",Qt([14.6,5.2,i*.8],[15.6,3.8,i*1.4],[15,2.4,i*1.6],.14,.05,6,3),ze.eelL)}n.add("s0","flesh",E(_.ell(3.4,2.75,2.35,12,8),7.4,6,0),ze.eelD);let e=[2.7,2.6,2.35,2,1.55,1];for(let i=1;i<6;i++){let s=t[i]-2,r=e[i];n.add("s"+i,"flesh",E(_.ell(3.6,r,r*.86,12,8),s+.4,6,0),i%2?ze.eelD:"#2b434a"),n.add("s"+i,"membrane",E(_.membrane([[2.6,0],[-2.4,0],[-2.4,r*.7+.8],[2.6,e[i-1]*.7+.8]]),s+.2,6+r*.62,0),"#5fd8c8");for(let o of[1,-1])n.add("s"+i,"glow",E(_.sph(.28,6,4),s+.8,6.2,o*r*.84),Qr)}return n.add("s5","membrane",E(_.membrane([[-11,0],[-15.4,3.4],[-14.6,0],[-15.4,-3]]),0,6,0),"#5fd8c8"),n.build()}function Ny(n,t,e,i,s){n.root.rotation.y=Ln(t,e.facing||1,s,7);let r=[.05,.2,.24,.26,.28,.3];for(let o=0;o<6;o++)n["s"+o].rotation.set(.12*Math.sin(t.time*6-o*.9),0,r[o]*Math.sin(t.time*6-o*.9));n.jaw.rotation.z=-.32*(.5+.5*Math.sin(t.time*2.1))**2}function Uy(){let n=new xe;n.bone("stalk","root",0,4.2,0).bone("head","stalk",0,11.2,0),n.add("root","suit",E(Pe(6.2,21,.3,1,1.45,.55,1.1),0,2,0),ze.stone),Ge(n,"root",[[-6,2.6,2.6,.75,3.2,.5,.6,3],[5.6,2.2,3.4,.6,2.6,.7,-.5,5]],ze.crys);for(let t=0;t<6;t++){let e=t*1.3;n.add("root","paint",E(_.cone(.7,1.2,6),Math.cos(e)*6,3.2,Math.sin(e)*4.5),"#c7c0b0")}n.add("stalk","flesh",_.taperTube([[0,3.6,0],[.6,7.6,0],[0,11.4,0]],t=>Dn(2.7,2,t),8,10),ze.flesh);for(let t of[6.2,8.4,10.4])n.add("stalk","flesh",E(_.torus(2.35-(t-6)*.08,.32,5,14),.3,t,0,[Math.PI/2,0,0]),ze.fleshL);n.add("head","flesh",E(_.ell(4.2,3.3,4.2,14,10),0,12.8,0),ze.fleshL),n.add("head","core",E(_.cyl(1.9,2.5,.6,14),0,15.7,0),Vt("#45f0dc",3.2)),n.add("head","flesh",E(_.torus(2.6,.55,6,16),0,15.8,0,[Math.PI/2,0,0]),ze.flesh);for(let t=0;t<6;t++){let e=t/6*Ot,i=Math.cos(e)*3,s=Math.sin(e)*3;n.bone("t"+t,"head",i,15.6,s),n.add("t"+t,"flesh",Qt([i,15.6,s],[i*1.6,17.6,s*1.6],[i*2.1,18.4,s*2.1],.55,.14,8,5),"#9a7088"),n.add("t"+t,"glow",E(_.sph(.3,6,4),i*2.15,18.5,s*2.15),wa)}return n.build()}function Fy(n,t,e,i,s,r){tr(t,e,s,2.1);let o=Gn(e,i);t.lean=pe(t.lean||0,o*.12,3,s),n.stalk.rotation.set(.05*Math.sin(t.time*1.2),0,-t.lean+.04*Math.sin(t.time*1.6));let a=t.charge*.18-t.kick*.22;n.head.scale.set(1+a*.6,1-a,1+a*.6);for(let l=0;l<6;l++){let c=Math.sin(t.time*2.2+l*1.1),h=l/6*Ot,u=.3*t.kick-.35*t.charge;n["t"+l].rotation.set(Math.sin(h)*(.2*c+u),0,-Math.cos(h)*(.2*c+u))}r.fx.pulse(r.byMat.core,.7+t.charge*1.3+t.kick*1.5+.15*Math.sin(t.time*3))}function Oy(){let n=new xe;n.bone("body","root",0,8.4,0).bone("eye","body",1.6,8.4,0).bone("vN","body",-1,8.4,4.4).bone("vF","body",-1,8.4,-4.4),n.add("body","paint",E(_.torus(4.3,1.55,8,22),.6,8.4,0,[0,Math.PI/2,0]),ze.patina);for(let t=0;t<6;t++){let e=t/6*Ot;n.add("body","paint",E(_.box(1.2,1.6,2.2,.3),1.4,8.4+Math.cos(e)*4.3,Math.sin(e)*4.3,[e,0,0]),ze.patinaD)}for(let t=0;t<4;t++){let e=t/4*Ot+.4;n.add("body","glow",E(_.box(.2,1.4,.3),2.2,8.4+Math.cos(e)*4.4,Math.sin(e)*4.4,[e,0,0]),Qr)}n.add("body","paint",E(_.ell(3.6,4,4,12,10),-2.4,8.4,0),ze.patinaD),n.add("body","paint",E(_.cone(2,3,8),-6.2,8.4,0,[0,0,Math.PI/2]),ze.patina),n.add("eye","core",E(_.sph(2.6,14,10),1.8,8.4,0),Vt("#3fe6d4",2.6)),n.add("eye","metal",E(_.sph(1.05,10,8),4,8.4,0),"#0b1a1a"),n.add("eye","paint",E(_.torus(2.5,.35,5,18),2.6,8.4,0,[0,Math.PI/2,0]),"#2a3a34");for(let[t,e]of[["vN",1],["vF",-1]])n.add(t,"paint",E(_.ext([[0,-.4],[-4.8,2.4],[-8.2,2],[-6,.2],[-3.6,-1.2]],.5,.18),-1,8.4,e*4.6),ze.patina),n.add(t,"glow",E(_.box(3,.16,.14),-4.2,9.3,e*4.9,[0,0,-.3]),Qr);for(let t of[1.2,-1.2,0])n.add("body","suit",Qt([-2.6,5,t],[-4.2,3.2,t*1.4],[-6.2,2.2,t*1.6],.28,.08,8,4),ze.patinaD);return n.scaleAll(1.3,0,8,0),n.build()}function ky(n,t,e,i,s){let r=Gn(e,i);n.root.rotation.y=Ln(t,r,s,5);let o=ds(e,i),a=r>0?o:Math.PI-o,l=a>Math.PI?a-Ot:a;t.look=pe(t.look||0,Se(l,-.7,.7),6,s),n.eye.rotation.z=t.look,n.body.rotation.z=.06*Math.sin(t.time*1.4),n.body.position.y=8.4+.4*Math.sin(t.time*2.2),n.vN.rotation.x=-.15-.15*Math.sin(t.time*3),n.vF.rotation.x=.15+.15*Math.sin(t.time*3)}function By(){let n=new xe;n.bone("body","root",0,8,0).bone("core","body",0,8,0),n.add("body","bubble",E(_.sph(7.4,20,14),0,8,0),"#bff4ff"),n.add("core","metal",E(_.ico(3,1),0,8,0),"#4f6466"),n.add("core","core",E(_.torus(3.05,.3,5,20),0,8,0,[Math.PI/2,0,0]),wa),n.add("core","core",E(_.torus(3.05,.3,5,20),0,8,0,[0,0,0]),wa);let t=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],[.7,.7,0],[-.7,-.7,0]];for(let e of t)n.add("core","paint",Ea(E(_.cone(.6,2.2,6),0,1.1,0),e,[e[0]*2.8,8+e[1]*2.8,e[2]*2.8]),"#8a7a50");return n.build()}function zy(n,t,e,i,s,r){n.core.rotation.set(t.time*.6,t.time*.9,0);let o=Math.sin(t.time*2.4);n.body.scale.set(1+.035*o,1-.035*o,1+.02*o);let a=i.player,l=a?Math.hypot(a.x-e.x,a.y-e.y):999;r.fx.pulse(r.byMat.core,.7+.6*(.5+.5*Math.sin(t.time*(l<90?10:3.5))))}var bp=new Xn,Hu=new ne,Hy=new O(0,1,0),Sp=new O;function Ea(n,t,e){return Sp.set(t[0],t[1],t[2]).normalize(),bp.setFromUnitVectors(Hy,Sp),Hu.makeRotationFromQuaternion(bp),Hu.setPosition(e[0],e[1],e[2]),n.applyMatrix4(Hu),n}var Ep={scarab:{type:"walker",build:My,pose:by},rockmite:{type:"hopper",build:Sy,pose:wy},cliffpod:{type:"turret",build:Ey,pose:Ty},wasp:{type:"flyer",build:Ay,pose:Ry},windmine:{type:"drifter",build:Cy,pose:Py},crab:{type:"walker",build:Iy,pose:Dy},eel:{type:"eel",build:Ly,pose:Ny},polyp:{type:"turret",build:Uy,pose:Fy},sentry:{type:"flyer",build:Oy,pose:ky},bubblemine:{type:"drifter",build:By,pose:zy}};var $e={hull:"#30353c",hullL:"#4a5059",hullD:"#1f2328",red:"#8a1c1c",stripe:"#b8862e",metal:"#5c6168"},Vu=Vt("#ff3b2f",3.6),th=Vt("#ff7a2a",3.4),le={iron:"#302c2a",ironL:"#46403c",rust:"#7a3b1e",brass:"#a07a3a",hazard:"#d8a12a",steel:"#6a6e74",steelL:"#8a8e94"},er=Vt("#ff6a14",3.6),eh=Vt("#ffcf3a",3.4),Le={crys:"#8a4dff",crysL:"#b98cff",flesh:"#5a2a4a",fleshL:"#7a3c5e",fleshD:"#3a1a30",bone:"#cdbba2",chitin:"#2a1a2e"},fs=Vt("#8fff3f",3.2),Ta=Vt("#9cff4a",3.6);function Vy(){let n=new xe;n.bone("yaw","root",0,6,0).bone("aim","yaw",0,10.4,0).bone("gun","aim",0,10.4,0),n.add("root","paint",E(_.cyl(9.4,10,2.2,6),0,1.1,0,[0,Math.PI/6,0]),$e.hull),n.add("root","paint",E(_.torus(8.2,.3,4,6),0,2.3,0,[Math.PI/2,0,Math.PI/6]),$e.stripe);for(let t=0;t<6;t++){let e=t/6*Ot;n.add("root","metal",E(_.cyl(.55,.55,.6,6),Math.cos(e)*7.6,2.4,Math.sin(e)*7.6),$e.metal)}n.add("root","metal",E(_.cyl(5,6.2,4.4,12),0,4.2,0),$e.hullD);for(let t=0;t<8;t++){let e=t/8*Ot;n.add("root","metal",E(_.box(.5,3.4,1,.1),Math.cos(e)*5.7,4.2,Math.sin(e)*5.7,[0,-e,0]),$e.metal)}n.add("yaw","paint",E(_.shell(6.4,5.6,6.4,.6,0,Ot,0,Math.PI/2+.3,16,6),0,8.6,0),$e.hullL),n.add("yaw","paint",E(_.torus(6.3,.45,5,18),0,7.4,0,[Math.PI/2,0,0]),$e.red),n.add("aim","paint",E(_.box(5,4.4,6.6,.9,2),3.2,10.4,0),$e.hull),n.add("aim","core",E(_.box(.3,.8,2.6),5.75,11.9,0),Vu);for(let t of[1.7,-1.7])n.add("gun","metal",E(_.cyl(.72,.8,8.6,10),9.2,10,t,[0,0,-Math.PI/2]),$e.metal),n.add("gun","metal",E(_.cyl(1,1,1.4,8),13.2,10,t,[0,0,-Math.PI/2]),$e.hullD),n.add("gun","core",E(_.torus(.78,.18,4,10),14,10,t,[0,Math.PI/2,0]),th);return n.build()}function Gy(n,t,e,i,s,r){let o=$c(t,r,e,i,20),a=Kc(o,e.aim!=null?-e.aim:ds(e,i)),l=jc(t,a,s,-.25,1.5);n.yaw.rotation.y=t.yaw,n.aim.rotation.z=l,tr(t,e,s),n.gun.position.x=-t.kick*1.8,r.fx.pulse(r.byMat.core,.6+t.charge*1.8+t.kick*1.2)}function Wy(){let n=new xe;n.bone("body","root",0,8,0).bone("flame","body",-10,8,0);let t=_.lathe([[.001,11.4],[.6,10.4],[1.4,7.6],[2.1,3.6],[2.3,0],[2.2,-4],[1.9,-7.6],[1.5,-9.2],[.001,-9.3]],14);je(t,[0,8,0],[0,0,-Math.PI/2]),Mn(t,e=>{let i=e.y-8;e.y=8+i*(i>0?1.05:.9),e.z*=.9},"smooth"),n.add("body","paint",t,$e.hull),n.add("body","crystal",E(_.ell(3,1.1,1.1,12,8),4.4,9.3,0),"#8a3a10"),n.add("body","paint",E(_.ext([[-6,6.2],[3,6],[5,5],[-5,3.6]],2.4,.4),0,0,0),$e.hullD),n.add("body","glow",E(_.box(1.6,.6,2),4.2,5.4,0),th.map(e=>e*.6));for(let e of[1,-1]){let i=_.ext([[-3.8,-1.4],[2.6,-9.6],[.6,-10.2],[-7.6,-2.6]],.5,.18);je(i,null,[Math.PI/2,0,0]),e<0&&(i=je(i,null,null,[1,1,-1])),n.add("body","paint",E(i,0,7.4,0,[e*-.42,0,0]),$e.hullL),n.add("body","glow",E(_.box(.3,.25,7.2),-.8,7.4+2.4,e*5.5,[e*-.42,e*.62,0]),Vu),n.add("body","paint",E(_.ext([[-9,8.4],[-6,8.8],[-7.6,13.6],[-9.4,14]],.45,.14),0,0,e*1.6,[e*.35,0,0]),$e.hullL),n.add("body","paint",E(_.box(2.6,1,.5,.15),-8.4,13.2,e*2.9,[e*.35,0,0]),$e.red),n.add("body","metal",E(_.cyl(.25,.25,3.2,6),9,6.6,e*1.2,[0,0,-Math.PI/2]),$e.metal),n.add("body","metal",E(_.box(3.2,1.4,1.2,.3),3.2,7.2,e*2.1),$e.hullD)}return n.add("body","metal",E(_.cyl(1.7,1.4,1.6,12),-9.2,8,0,[0,0,Math.PI/2]),$e.hullD),n.add("body","glow",E(_.cyl(1.3,1.3,.1,12),-10.05,8,0,[0,0,Math.PI/2]),th),n.add("flame","glow",E(_.lathe([[1.2,0],[.9,-2.2],[.4,-4],[.02,-5.2]],10),-10,8,0,[0,0,-Math.PI/2]),Vt("#ff6a3a",2.6)),n.build()}function Xy(n,t,e,i,s){let r=Gn(e,i);n.root.rotation.y=Ln(t,r,s,4);let o=t.py!=null&&s>0?(e.y-t.py)/s:0;t.py=e.y,t.bank=pe(t.bank||0,Se(o/100,-1,1),5,s),n.body.rotation.set(t.bank*.6,0,-t.bank*.12);let a=.85+.15*Math.sin(t.time*47);n.flame.scale.set(a,1,1)}function qy(){let n=new xe;n.bone("aim","root",0,8,0).bone("roll","aim",0,8,0).bone("flame","roll",-6.1,8,0),n.add("roll","paint",E(_.sph(4.5,16,12),0,8,0),$e.hull),n.add("roll","paint",E(_.torus(4.55,.4,5,20),0,8,0,[0,Math.PI/2,0]),$e.red),n.add("roll","paint",E(_.torus(4.2,.3,5,20),-2.2,8,0,[0,Math.PI/2,0]),$e.stripe),n.add("roll","metal",E(_.cyl(1.7,2.6,1.8,12),4.6,8,0,[0,0,-Math.PI/2]),$e.hullD),n.add("roll","core",E(_.sph(1.2,10,8),5.6,8,0),Vu);for(let t=0;t<6;t++){let e=t/6*Ot;n.add("roll","metal",Ea(E(_.cone(.5,2,6),0,1,0),[.35,Math.cos(e),Math.sin(e)],[.8,8+Math.cos(e)*4,Math.sin(e)*4]),$e.metal)}for(let t=0;t<4;t++){let e=_.ext([[-3,0],[-7.4,3.6],[-7.8,3.6],[-6.4,0]],.4,.12);n.add("roll","paint",E(e,0,8,0,[t*Math.PI/2+Math.PI/4,0,0]),$e.hullL)}return n.add("roll","metal",E(_.cyl(1.3,1.6,1.6,10),-5.2,8,0,[0,0,Math.PI/2]),$e.metal),n.add("roll","glow",E(_.cyl(1.1,1.1,.1,10),-6.05,8,0,[0,0,Math.PI/2]),th),n.add("flame","glow",E(_.lathe([[1,0],[.7,-1.8],[.02,-3.6]],8),-6.1,8,0,[0,0,-Math.PI/2]),Vt("#ff7a3a",2.4)),n.scaleAll(1.12,0,8,0),n.build()}function Yy(n,t,e,i,s,r){let o=ds(e,i),a=Math.cos(o)>=0;n.root.rotation.y=Ln(t,a?1:-1,s,6);let l=a?o:Math.PI-o;l>Math.PI&&(l-=Ot),t.pitch=pe(t.pitch||0,l,7,s),n.aim.rotation.z=t.pitch,n.roll.rotation.x=t.time*3.2,n.flame.scale.set(.8+.2*Math.sin(t.time*41),1,1),r.fx.pulse(r.byMat.core,.6+.8*(t.time*4%1<.5?1:.2))}function Zy(){let n=new xe;n.bone("body","root",0,3,0).bone("jaw","body",5.2,13.6,0),n.add("root","paint",E(_.box(18,3,12,.6,2),0,1.5,0),le.ironL),n.add("root","paint",E(_.box(18.4,.6,12.4,.2),0,2.9,0),le.brass);let t=_.ext([[-5.2,3],[4.2,3],[5.4,8],[4.8,12.2],[2.2,15.4],[-2.6,16],[-5.4,12]],9.6,.8,{steps:3});Mn(t,e=>{e.x-=.03*e.z*e.z},!0),n.add("body","paint",t,le.iron),n.add("body","paint",E(_.ext([[-1.2,12.8],[5.6,13],[6.6,16.4],[4.2,19.6],[-.4,19.9],[-2.6,17.2]],7.2,.6,{steps:2}),0,0,0),le.ironL),n.add("body","paint",E(_.ext([[-3,17.6],[0,20.4],[3.4,20],[4.6,18.8],[.4,19]],4,.4),0,0,0),le.rust),n.add("body","metal",E(_.box(.9,1.6,4.6,.2),6.3,15.4,0),"#1a1716");for(let e=0;e<3;e++)n.add("body","core",E(_.box(.3,.28,3.8),6.75,14.9+e*.5,0),er);for(let e of[1,-1])n.add("body","core",E(_.box(.3,.4,.9),6.2,17.4,e*1.5,[0,0,-.2]),eh),n.add("body","paint",E(_.ext([[-4.6,9.5],[1.6,10.2],[3.6,13.6],[.6,16],[-4.2,14.6]],2.2,.5),0,0,e*5.4),le.ironL),n.add("body","paint",E(_.ext([[-3.6,13.6],[.4,14.8],[-.2,15.4],[-3.8,14.6]],2.3,.2),0,0,e*5.4),le.brass),n.add("body","paint",Qt([1,10.6,e*5.6],[4.8,7.8,e*5.8],[6.8,4.6,e*5],1.5,1.2),le.iron),n.add("body","paint",E(_.box(3,2.2,2.6,.5),7.2,4.2,e*4.6),le.ironL),n.add("body","core",E(_.box(1.8,.25,.2),-1,6+1.4,e*4.85),er.map(i=>i*.6)),n.add("body","core",E(_.box(1.8,.25,.2),-1,6,e*4.85),er.map(i=>i*.6));return n.add("body","paint",E(_.torus(3.6,.5,6,18),1.6,13.6,0,[Math.PI/2,0,.35]),le.brass),n.add("jaw","paint",E(_.ext([[4,13.8],[6.8,14.1],[6.6,12.4],[4.6,12]],4.6,.3),0,0,0),le.ironL),n.build()}function Jy(n,t,e,i,s,r){n.root.rotation.y=Ln(t,Gn(e,i),s,3),tr(t,e,s);let o=i.player,l=(o?Math.abs(o.x-e.x):999)<190?1:0;t.heat=pe(t.heat||0,l?Math.max(t.charge,.35):.1,4,s),n.jaw.rotation.z=-.5*Math.max(t.kick,t.heat>.6?t.heat-.6:0),n.body.rotation.z=-.04*t.kick;let c=.85+.15*Math.sin(t.time*23)*Math.sin(t.time*7.1);r.fx.pulse(r.byMat.core,(.55+t.heat*1.6+t.kick*1.5)*c)}function $y(){let n=new xe;n.bone("body","root",0,13,0);for(let[t,e]of[["N",2.7],["F",-2.7]])n.bone("l"+t,"body",0,11.2,e).bone("l"+t+"k","l"+t,3,6.6,e).bone("l"+t+"f","l"+t+"k",-1.2,1.6,e);n.add("body","paint",E(_.box(12,7,8,1.2,2),.4,15,0),le.steel);for(let t=0;t<5;t++)n.add("body","paint",E(_.box(1.1,2,.2),-4.2+t*2.2,13.2,4.05,[0,0,.55]),t%2?"#1a1716":le.hazard);for(let t of[1,-1])n.add("body","paint",E(_.box(11.4,.5,.2),.4,14.5,t*4.08),le.hazard);n.add("body","metal",E(_.cyl(.9,1,3.6,10),-3.4,19.6,-1.6),le.ironL),n.add("body","core",E(_.cyl(.65,.65,.2,10),-3.4,21.45,-1.6),er.map(t=>t*.7));for(let t of[12.6,14.6])n.add("body","metal",E(_.cyl(.8,.8,7.6,10),6.6,t,0,[Math.PI/2,0,0]),le.steelL);n.add("body","paint",E(_.box(4.2,3.2,5,.6),6.4,17.2,0),le.iron),n.add("body","metal",E(_.torus(1.2,.3,5,14),8.55,17.4,0,[0,Math.PI/2,0]),le.brass),n.add("body","core",E(_.cyl(.95,.95,.3,12),8.6,17.4,0,[0,0,-Math.PI/2]),eh),n.add("body","suit",Qt([-5.6,16.6,2],[-7.6,15,3],[-6.2,12,3.6],.35,.3,8,4),"#1a1716"),n.add("body","metal",E(_.box(1.2,3.6,1.2,.2),3.4,10.6,0),le.ironL),n.add("body","metal",Qt([3.4,9,0],[5.4,8,0],[6.4,9,0],.32,.2,6,4),le.steelL);for(let[t,e]of[["N",2.7],["F",-2.7]])n.add("l"+t,"paint",E(_.sph(1.6,10,8),0,11.2,e),le.ironL),n.add("l"+t,"paint",Qt([0,11.2,e],[1.8,9.2,e],[3,6.6,e],1.15,.9),le.steel),n.add("l"+t,"metal",Qt([.6,11.6,e+Math.sign(e)*1],[2,9.4,e+Math.sign(e)*1],[3.3,7.2,e+Math.sign(e)*1],.28,.28,6,4),le.steelL),n.add("l"+t+"k","paint",E(_.sph(1,8,6),3,6.6,e),le.iron),n.add("l"+t+"k","paint",Qt([3,6.6,e],[1,4.2,e],[-1.2,1.6,e],.85,.6),le.ironL),n.add("l"+t+"f","paint",E(_.ext([[-2.4,0],[3.2,0],[3.6,.7],[.4,1.7],[-1.8,1.6]],2.2,.3),0,0,e),le.iron),n.add("l"+t+"f","paint",E(_.box(1,.5,2.3,.15),3,.45,e),le.hazard);return n.build()}function Ky(n,t,e,i,s){n.root.rotation.y=Ln(t,e.facing||-1,s,8),t.phase+=Math.abs(e.vx||0)*s/22*Ot;let r=t.phase;for(let[o,a]of[["N",0],["F",Math.PI]]){let l=r+a;n["l"+o].rotation.z=.42*Math.sin(l),n["l"+o+"k"].rotation.z=-.35*Math.max(0,Math.cos(l))-.05,n["l"+o+"f"].rotation.z=-.42*Math.sin(l)+.35*Math.max(0,Math.cos(l))}n.body.position.y=13+.5*Math.abs(Math.cos(r))-.4+.08*Math.sin(t.time*9),n.body.rotation.z=.04*Math.sin(r*2)}function jy(){let n=new xe;n.bone("spin","root",0,9,0),n.add("spin","paint",E(_.cyl(6.6,6.6,4.6,6),0,9,0,[Math.PI/2,0,0]),le.ironL),n.add("spin","metal",E(_.cyl(6,6.6,.6,6),0,9,2.6,[Math.PI/2,0,0]),le.steel),n.add("spin","metal",E(_.cyl(6.6,6,.6,6),0,9,-2.6,[Math.PI/2,0,0]),le.steel);for(let t=0;t<10;t++){let e=t/10*Ot,i=_.ext([[0,-1.3],[2.6,-.2],[2.2,.9],[0,1.1]],2.2,.2);n.add("spin","metal",E(i,Math.cos(e)*6.3,9+Math.sin(e)*6.3,0,[0,0,e]),le.steelL)}return n.add("spin","metal",E(_.cyl(2.4,2.4,9.6,12),0,9,0,[Math.PI/2,0,0]),le.steelL),n.add("spin","metal",E(_.cyl(3.6,3.6,1.4,6),0,9,4.6,[Math.PI/2,0,0]),le.steel),n.add("spin","core",E(_.torus(4.4,.42,5,6),0,9,2.95,[0,0,Math.PI/6]),er),n.add("spin","core",E(_.torus(4.4,.42,5,6),0,9,-2.95,[0,0,Math.PI/6]),er),n.build()}function Qy(n,t,e,i,s,r){n.spin.rotation.set(.1*Math.sin(t.time*2),.12*Math.sin(t.time*1.3),-t.time*9),r.fx.pulse(r.byMat.core,.8+.25*Math.sin(t.time*13))}function t_(){let n=new xe;n.bone("body","root",0,9,0).bone("rN","body",-1,11.6,5.6).bone("rF","body",-1,11.6,-5.6).bone("arc0","body",4,5.4,1.5).bone("arc1","body",4,5.4,-1.5),n.add("body","paint",E(_.capsule(2.8,6.6,4,12),0,9.4,0,[0,0,Math.PI/2]),le.steel),n.add("body","paint",E(_.cyl(2.9,2.9,1.2,12),-1,9.4,0,[0,0,Math.PI/2]),le.hazard);for(let t=0;t<4;t++)n.add("body","paint",E(_.box(.4,1.3,6),-1.6+t*.4,9.4,0,[0,0,0]),t%2?"#1a1716":le.hazard);n.add("body","core",E(_.sph(1.1,10,8),5.9,9.8,0),eh),n.add("body","metal",E(_.torus(1.2,.25,5,12),5.6,9.8,0,[0,Math.PI/2,0]),le.iron);for(let[t,e]of[["rN",1],["rF",-1]])n.add("body","paint",Qt([-.5,10.6,e*2.4],[-.8,11.4,e*4],[-1,11.6,e*5],.5,.4,6,5),le.ironL),n.add("body","paint",E(_.torus(3,.55,6,20),-1,11.6,e*5.6,[Math.PI/2,0,0]),le.iron),n.add(t,"metal",E(_.box(5.6,.14,.7),-1,11.6,e*5.6),le.steelL),n.add(t,"metal",E(_.box(.7,.14,5.6),-1,11.6,e*5.6),le.steelL),n.add(t,"metal",E(_.cyl(.5,.5,.6,8),-1,11.6,e*5.6),le.brass);for(let[t,e]of[["arc0",1.5],["arc1",-1.5]]){n.add("body","metal",Qt([3,7.6,e],[4.2,6,e],[5.6,4.6,e],.4,.28,6,4),le.steelL);for(let s=0;s<3;s++)n.add("body","metal",E(_.torus(.5,.18,4,10),3.6+s*.6,6.8-s*.6,e,[0,0,.8]),"#b06a2a");let i=[[5.6,4.6,e],[6.6,3.6,e*.6],[5.9,2.6,e*.2],[6.9,1.6,-e*.2]];n.add(t,"glow",_.tube(i,.16,8,4),Vt("#bfe8ff",4.5))}return n.add("body","suit",Qt([-3,6.8,0],[-4.4,4.6,.6],[-3.6,3.2,1],.3,.2,8,4),"#1a1716"),n.scaleAll(1.25,0,8,0),n.build()}function e_(n,t,e,i,s){n.root.rotation.y=Ln(t,Gn(e,i),s,5),n.rN.rotation.y=t.time*40,n.rF.rotation.y=-t.time*40,n.body.rotation.set(.08*Math.sin(t.time*1.7),0,.08*Math.sin(t.time*2.3));let r=l=>{let c=Math.sin(Math.floor(t.time*24)*12.9898+l*78.2)*43758.5;return c-Math.floor(c)},o=r(1)>.35?1:1e-4,a=r(2)>.35?1:1e-4;n.arc0.scale.set(1,o*(.7+.3*r(3)),o),n.arc1.scale.set(1,a*(.7+.3*r(4)),a)}function n_(){let n=new xe;n.bone("drum","root",0,4,0).bone("hL","drum",-6,18.6,0).bone("hR","drum",6,18.6,0);let t=[[.6,1],[Math.PI-.6,1],[-Math.PI/2,1]];t.forEach(([e],i)=>{let s=Math.cos(e)*8.6,r=Math.sin(e)*8.6;n.bone("a"+i,"drum",s,14,r).bone("a"+i+"k","a"+i,s*1.45,20,r*1.45)}),n.add("root","paint",E(_.cyl(12.6,13.6,4,12),0,2,0),le.ironL);for(let e=0;e<12;e++){let i=e/12*Ot;n.add("root","paint",E(_.box(2.2,3.4,.3),Math.cos(i)*13.3,2,Math.sin(i)*13.3,[0,-i+Math.PI/2,.5]),e%2?"#1a1716":le.hazard)}n.add("drum","paint",E(_.cyl(8.4,9.4,14,16),0,11,0),le.steel);for(let e of[5.2,11,16.6])n.add("drum","metal",E(_.torus(9-(e-5)*.06,.4,5,24),0,e,0,[Math.PI/2,0,0]),le.iron);for(let e=0;e<6;e++){let i=e/6*Ot+.3;n.add("drum","core",E(_.box(.3,3.2,1.2),Math.cos(i)*9,8.2,Math.sin(i)*9,[0,-i,0]),er)}n.add("drum","metal",E(_.cyl(7.6,8.4,1.4,16),0,18.6,0),le.ironL),n.add("drum","core",E(_.cyl(5.6,5.6,.4,16),0,18.9,0),eh);for(let[e,i]of[["hL",-1],["hR",1]])n.add(e,"paint",E(_.box(6,1,11.6,.3),i*3,19.8,0),le.ironL),n.add(e,"paint",E(_.box(5.4,.3,1),i*3,20.4,0),le.hazard);return t.forEach(([e],i)=>{let s=Math.cos(e)*8.6,r=Math.sin(e)*8.6,o=s*1.45,a=r*1.45;n.add("a"+i,"paint",E(_.sph(1.6,10,8),s,14,r),le.ironL),n.add("a"+i,"paint",Qt([s,14,r],[s*1.3,17.6,r*1.3],[o,20,a],1,.8),le.hazard),n.add("a"+i+"k","paint",E(_.sph(1,8,6),o,20,a),le.iron),n.add("a"+i+"k","metal",Qt([o,20,a],[o*.9,23.2,a*.9],[o*.7,25.4,a*.7],.7,.5),le.steelL);for(let l of[-.8,.8])n.add("a"+i+"k","metal",Qt([o*.7,25.4,a*.7],[o*.65+l,26.8,a*.65],[o*.55+l*.4,27.6,a*.55],.32,.12,6,4),le.iron)}),n.build()}function Tp(n,t,e){let i=t.spawnT!=null?t.spawnT:e;n.lastSp!=null&&i>n.lastSp+.2&&(n.burst=1),n.lastSp=i,n.burst=Math.max(0,(n.burst||0)-1/60*1.6),n.antic=i<.6?1-i/.6:0}function i_(n,t,e,i,s,r){Tp(t,e,2.4);let o=Math.max(t.antic,t.burst);t.open=pe(t.open||0,o,10,s),n.hL.rotation.z=t.open*1.2,n.hR.rotation.z=-t.open*1.2;for(let a=0;a<3;a++){let l=Math.sin(t.time*1.6+a*2.1);n["a"+a].rotation.set(.25*l*(a===2?1:0),.3*l,a===2?0:(a?-1:1)*(.15*l-.35*t.open)),n["a"+a+"k"].rotation.z=.4*Math.sin(t.time*2.2+a)*(a===2?0:1),n["a"+a+"k"].rotation.x=a===2?.4*Math.sin(t.time*2.2)-.4*t.open:0}n.drum.scale.set(1+t.burst*.04,1-t.burst*.03,1+t.burst*.04),r.fx.pulse(r.byMat.core,.6+t.open*1.6+.1*Math.sin(t.time*5))}function s_(){let n=new xe;n.bone("body","root",0,4.4,0),n.add("body","flesh",E(on(5,2,3.8,7,.12),0,3.9,0),Le.flesh),n.add("body","crystal",E(_.shell(5.5,3.2,4.4,.4,0,Ot,0,1.55,12,5),-.4,4.4,0),Le.crys),Ge(n,"body",[[-.4,6.8,0,.9,3.6,0,.35,3],[-2.8,6.4,.8,.7,2.8,.3,.6,5],[1.8,6.6,-.6,.6,2.4,-.3,-.2,7],[-4.4,5.6,-1,.5,2,-.3,.9,9]],Le.crysL);for(let e of[1,-1])n.add("body","glow",E(_.box(3.4,.25,.2),-.6,2.9,e*3.55),fs),n.add("body","glow",E(_.sph(.42,6,4),5.2,4.6,e*1),Ta),n.add("body","glow",E(_.sph(.3,6,4),4.8,5.3,e*1.7),Ta),n.add("body","paint",Qt([5,3.6,e*1],[6.6,3.4,e*1.1],[7,2.6,e*.3],.34,.08,6,4),Le.bone);let t=[2.6,0,-2.6];for(let e=0;e<6;e++){let i=e%2?-1:1,s=t[Math.floor(e/2)];jr(n,"l"+e,"body",[s,3.8,i*2.8],[s+.6,6,i*5.6],[s+1.4,.2,i*6.6],.5,"paint",Le.chitin)}return n.build()}function r_(n,t,e,i,s){let r=ba(e,.65),o=Math.abs(e.vx||0)>1?Math.sign(e.vx):Gn(e,i);n.root.rotation.y=Ln(t,o,s,14);let a=Math.abs(e.vx||0);t.phase+=(a*.12+(r.ground?0:6)+2)*s*2.5;for(let l=0;l<6;l++){let c=l%2?-1:1,h=l===0||l===3||l===4,u=t.phase+(h?0:Math.PI),f=r.ground?0:.35;Sa(n["l"+l],c,.4*Math.sin(u),.3*Math.max(0,Math.cos(u))+f-.3*r.crouch),n["l"+l+"k"].rotation.x=c*.4*r.crouch}n.body.position.y=4.4-1.6*r.crouch+.2*Math.abs(Math.sin(t.phase*2)),n.body.rotation.z=-.25*r.air}function o_(){let n=new xe;n.bone("body","root",0,10,0).bone("head","body",5.6,12,0);for(let[t,e]of[["N",1],["F",-1]])n.bone("h"+t,"body",-2.6,10.2,e*3).bone("h"+t+"k","h"+t,-6.4,15.4,e*4.4).bone("h"+t+"f","h"+t+"k",-4,2,e*5),n.bone("f"+t,"body",3.4,8.6,e*2.4).bone("f"+t+"k","f"+t,5,6,e*3.6);n.add("body","flesh",E(on(6.2,3.6,3.7,11,.12),-.4,10.6,0,[0,0,.18]),Le.flesh),n.add("body","flesh",E(_.ell(4.6,2.2,2.8,12,8),.6,8.6,0),Le.fleshL),Ge(n,"body",[[-3.6,12.6,0,1,5,0,.7,3],[-.8,13.8,.4,.95,5.4,.1,.4,5],[2,14.2,-.3,.75,4,-.1,.15,7],[-5.8,11.4,-.6,.6,3,-.2,1,9]],Le.crys),n.add("body","glow",E(_.box(5,.22,.2),-.2,8.1,2.8,[0,0,.18]),fs.map(t=>t*.55)),n.add("body","glow",E(_.box(5,.22,.2),-.2,8.1,-2.8,[0,0,.18]),fs.map(t=>t*.55)),n.add("head","flesh",E(_.ell(2.9,2.4,2.4,12,8),6.6,12.4,0),"#6a3256"),n.add("head","crystal",E(_.crystal(.6,3.6,5,.45,13),6.4,14,0,[0,0,-.9]),Le.crysL);for(let t of[1,-1])n.add("head","glow",E(_.ell(.7,.55,.45,8,6),8.4,13.2,t*1.4),Ta),n.add("head","paint",Qt([8.6,11.4,t*1],[10,10.6,t*.9],[10.2,9.6,t*.2],.42,.08,6,4),Le.bone);for(let[t,e]of[["N",1],["F",-1]])n.add("h"+t,"flesh",Qt([-2.6,10.2,e*3],[-3.6,13.6,e*3.9],[-6.4,15.4,e*4.4],1.9,1.1),Le.fleshL),n.add("h"+t+"k","suit",E(_.sph(1,8,6),-6.4,15.4,e*4.4),Le.chitin),n.add("h"+t+"k","paint",Qt([-6.4,15.4,e*4.4],[-5.8,8.6,e*4.8],[-4,2,e*5],.85,.45),Le.chitin),n.add("h"+t+"k","crystal",E(_.crystal(.35,2,5,.5,21),-6.6,15.8,e*4.4,[0,0,.6]),Le.crysL),n.add("h"+t+"f","paint",Qt([-4,2,e*5],[-2,.6,e*5],[.4,.3,e*5],.5,.15,6,4),Le.bone),n.add("f"+t,"paint",Qt([3.4,8.6,e*2.4],[4.6,7.6,e*3.2],[5,6,e*3.6],.5,.4,6,4),Le.chitin),n.add("f"+t+"k","paint",Qt([5,6,e*3.6],[5.6,3,e*3.8],[6,.3,e*3.9],.4,.12,6,4),Le.bone);return n.build()}function a_(n,t,e,i,s){let r=ba(e,1.2),o=Math.abs(e.vx||0)>1?Math.sign(e.vx):Gn(e,i);n.root.rotation.y=Ln(t,o,s,9),t.cr=pe(t.cr||0,r.crouch,18,s),t.air=pe(t.air||0,r.air,12,s);let a=Math.max(0,-t.air),l=Math.max(0,t.air);n.body.position.y=10-3*t.cr+.15*Math.sin(t.time*3),n.body.rotation.z=.15*t.cr-.3*t.air;for(let c of["N","F"])n["h"+c].rotation.z=-.35*t.cr+.55*a-.2*l,n["h"+c+"k"].rotation.z=.5*t.cr-1.1*a+.3*l,n["h"+c+"f"].rotation.z=-.3*t.cr+.6*a,n["f"+c].rotation.z=.5*a-.3*l+.2*t.cr,n["f"+c+"k"].rotation.z=-.3*a;n.head.rotation.z=.1*Math.sin(t.time*2)-.15*t.cr}function l_(){let n=new xe;n.bone("sac","root",0,1,0).bone("core","sac",0,15,0);for(let e=0;e<5;e++){let i=e/5*Ot+.3;n.bone("p"+e,"sac",Math.cos(i)*5.4,9.5,Math.sin(i)*5.4)}for(let e=0;e<6;e++){let i=e/6*Ot;n.add("root","flesh",Qt([Math.cos(i)*3,2,Math.sin(i)*3],[Math.cos(i)*6,.8,Math.sin(i)*6],[Math.cos(i)*8.6,.3,Math.sin(i)*8],1,.25,6,5),Le.fleshD)}Ge(n,"root",[[-6.4,.4,3,.8,3.4,.4,.7,3],[6,.4,-2.6,.7,3,-.4,-.6,5],[3.6,.3,4.4,.5,2,.6,-.3,7]],Le.crys);let t=on(6.4,7.6,6.4,17,.08);Mn(t,e=>{if(e.y>0){let i=1-.28*(e.y/7.6);e.x*=i,e.z*=i}},"smooth"),n.add("sac","flesh",E(t,0,8.4,0),"#6a3a5a");for(let e=0;e<5;e++){let i=e/5*Ot+.9,s=[];for(let r=0;r<=4;r++){let o=r/4,a=1.6+o*12.6,l=(Math.sin(o*Math.PI)*.35+.72)*6.4*(a>8.4?1-.28*((a-8.4)/7.6):1)+.15;s.push([Math.cos(i+o*.5)*l,a,Math.sin(i+o*.5)*l])}n.add("sac","core",_.tube(s,.16,10,4),fs.map(r=>r*.4))}n.add("core","core",E(_.sph(2.6,12,10),0,15.2,0),fs.map(e=>e*.9));for(let e=0;e<5;e++){let i=e/5*Ot+.3,s=Math.cos(i)*5.4,r=Math.sin(i)*5.4,o=_.shard(2.7,13,5,30+e,.1);je(o,null,[0,-i+Math.PI/2,0],[1,1,.5]),o.applyMatrix4(c_(s,r,i)),n.add("p"+e,"crystal",o,Le.crys)}return n.build()}function c_(n,t,e){let i=new ne,s=new ne().makeRotationAxis(new O(-Math.sin(e),0,Math.cos(e)),.5),r=new ne().makeTranslation(0,6,0),o=new ne().makeTranslation(n,9.5,t);return i.multiply(o).multiply(s).multiply(r),i}function h_(n,t,e,i,s,r){let o=i.player,a=e.cfg&&e.cfg.hatchDist||90,l=o?Math.abs(o.x+o.w/2-(e.x+e.w/2)):999,h=(o?Math.abs(o.y-e.y):999)<80?Jn((a*2.3-l)/(a*1.3)):0;t.open=pe(t.open||0,h,5,s);let u=Math.pow(.5+.5*Math.sin(t.time*(2.6+t.open*6)),3);n.sac.scale.set(1+u*.04,1+u*.03,1+u*.04);for(let f=0;f<5;f++){let d=f/5*Ot+.3,g=t.open*.05*Math.sin(t.time*30+f*2),x=-(t.open*.85+g);n["p"+f].quaternion.setFromAxisAngle(new O(-Math.sin(d),0,Math.cos(d)),x)}n.core.scale.setScalar(.85+.25*t.open+.1*u),r.fx.pulse(r.byMat.core,.45+.35*u+1.3*t.open)}function u_(){let n=new xe;n.bone("stalk","root",0,3.4,0).bone("maw","stalk",0,12,0);for(let t=0;t<3;t++){let e=t/3*Ot+.5;n.bone("j"+t,"maw",Math.cos(e)*3.2,15.4,Math.sin(e)*3.2)}n.add("root","flesh",E(on(7.2,3,6.2,23,.15),0,1.4,0),Le.fleshD),Ge(n,"root",[[-5.6,1.2,2.4,1.1,5,.35,.6,3],[5.2,1,-2.8,.9,4.2,-.4,-.6,5],[4,.8,3.6,.7,3,.6,-.4,7],[-3.4,.8,-4,.6,2.6,-.6,.4,9]],Le.crys),n.add("stalk","flesh",_.taperTube([[0,2.6,0],[.9,7.6,0],[0,12.2,0]],t=>Dn(3,2.2,t),8,10),"#6a3256");for(let t of[5.2,7.6,10])n.add("stalk","paint",E(_.torus(2.75-(t-5)*.08,.36,5,14),.5,t,0,[Math.PI/2,0,0]),Le.bone);n.add("stalk","core",_.tube([[1.8,3,2],[2.6,7,1.4],[1.6,11.6,1.6]],.2,8,4),fs.map(t=>t*.7)),n.add("maw","flesh",E(_.ell(4.2,3,4.2,14,10),0,13.6,0),Le.fleshL),n.add("maw","core",E(_.cyl(2.2,2.6,.4,14),0,16.3,0),Ta);for(let t=0;t<8;t++){let e=t/8*Ot;n.add("maw","crystal",E(_.crystal(.38,2,5,.5,40+t),Math.cos(e)*2.5,15.8,Math.sin(e)*2.5,[Math.sin(e)*-.5,0,Math.cos(e)*.5]),"#d8c0ff")}for(let t=0;t<3;t++){let e=t/3*Ot+.5,i=_.shell(4.6,3.2,4.6,.6,e-.95,e+.95,.15,1.1,8,4);n.add("j"+t,"flesh",E(i,0,14.4,0),Le.flesh)}return n.build()}function d_(n,t,e,i,s,r){tr(t,e,s,2.1);let o=Gn(e,i);t.lean=pe(t.lean||0,o*.14,3,s),n.stalk.rotation.set(.04*Math.sin(t.time*1.3),0,-t.lean+.05*Math.sin(t.time*1.7)-t.kick*.1*o);let a=t.charge*.16-t.kick*.2;n.maw.scale.set(1+a*.5,1-a,1+a*.5);for(let l=0;l<3;l++){let c=l/3*Ot+.5,h=.15+.6*t.kick-.25*t.charge+.06*Math.sin(t.time*2+l);n["j"+l].quaternion.setFromAxisAngle(new O(-Math.sin(c),0,Math.cos(c)),-h)}r.fx.pulse(r.byMat.core,.6+t.charge*1.2+t.kick*1.8+.12*Math.sin(t.time*4))}function f_(){let n=new xe;n.bone("mass","root",0,0,0);for(let t=0;t<3;t++)n.bone("o"+t,"mass",[-5,4.5,.5][t],[9,7,15][t],[6.4,6.6,7.4][t]);n.add("mass","flesh",E(on(12.4,9.4,9.6,31,.16,18,12),0,8.4,0),"#4a2240"),n.add("mass","flesh",E(on(6,4.6,5,32,.2),-8.4,4.4,3.6),Le.flesh),n.add("mass","flesh",E(on(5.4,4,4.6,33,.2),8.6,4,-2.4),Le.flesh),Ge(n,"mass",[[-2,14,-2.6,2,12.6,-.15,.12,3],[4.6,13,-3.6,1.5,9,-.25,-.3,5],[-7,11.6,-1.6,1.2,6.4,-.1,.55,7],[8.6,9.6,1.6,1,5,.3,-.7,9],[1.6,15.4,2.6,.9,4.2,.4,-.2,11],[-10.6,6,-3,.8,3.6,-.4,.9,13]],Le.crys);for(let t=0;t<3;t++){let e=[-5,4.5,.5][t],i=[9,7,15][t],s=[6.4,6.6,7.4][t],r=[.35,.4,-.1][t];n.add("o"+t,"flesh",E(_.torus(1.9,.75,6,14),e,i,s,[r,0,e*.03]),Le.fleshL),n.add("o"+t,"core",E(_.cyl(1.5,1.5,.3,12),e,i,s-.3,[Math.PI/2+r,0,e*.03]),Ta)}for(let t=0;t<4;t++){let e=-4+t*2.6;n.add("mass","paint",Qt([-11.4,2,e],[-6+t,18.6-Math.abs(t-1.5),e*1.1],[10.8,3,e*.9],.55,.45,12,5),Le.bone)}for(let t=0;t<5;t++){let e=t*1.25;n.add("mass","core",_.tube([[Math.cos(e)*11,3,Math.sin(e)*8.5],[Math.cos(e+.3)*9.6,9.6,Math.sin(e+.3)*8.6],[Math.cos(e+.5)*5.6,15.6,Math.sin(e+.5)*5.4]],.24,10,4),fs.map(i=>i*.6))}return n.build()}function p_(n,t,e,i,s,r){Tp(t,e,2.4);let o=Math.sin(t.time*1.8),a=t.burst,l=t.antic;n.mass.scale.set(1+.025*o+.06*a+.03*l,1-.02*o+.05*a,1+.025*o+.06*a);for(let c=0;c<3;c++){let h=1+.25*l*Math.sin(t.time*20+c)+.35*a;n["o"+c].scale.set(h,h,1)}r.fx.pulse(r.byMat.core,.55+.25*(.5+.5*o)+1.2*l+1.8*a)}function m_(){let n=new xe;n.bone("body","root",0,8,0).bone("ring","body",0,8,0);let t=_.oct(3.4);je(t,[0,8,0],null,[1,1.45,1]),n.add("body","crystal",t,Le.crysL),n.add("body","core",E(_.oct(1.5),0,8,0,null,[1,1.4,1]),Vt("#c8a0ff",3.4)),n.add("ring","paint",E(_.torus(5.6,.7,6,24),0,8,0),"#2a2430"),n.add("ring","glow",E(_.torus(5.6,.22,4,24),0,8,.66),fs.map(e=>e*.8));for(let e=0;e<3;e++){let i=e/3*Ot;n.add("ring","crystal",E(_.shard(1,5.2,5,50+e),Math.cos(i)*7.8,8+Math.sin(i)*7.8,0,[0,0,i-Math.PI/2]),Le.crys)}return n.build()}function g_(n,t,e,i,s,r){n.root.rotation.y=Ln(t,Gn(e,i),s,4),n.ring.rotation.z=t.time*2.4,n.body.rotation.y=Math.sin(t.time*1.3)*.4,r.fx.pulse(r.byMat.core,.8+.3*Math.sin(t.time*6))}var Ap={walltur:{type:"turret",build:Vy,pose:Gy},interceptor:{type:"flyer",build:Wy,pose:Xy},seeker:{type:"drifter",build:qy,pose:Yy},statue:{type:"turret",build:Zy,pose:Jy},beltdrone:{type:"walker",build:$y,pose:Ky},boltspin:{type:"spinner",build:jy,pose:Qy},arcdrone:{type:"flyer",build:t_,pose:e_},armhub:{type:"spawner",build:n_,pose:i_},hugger:{type:"hugger",build:s_,pose:r_},leaper:{type:"hopper",build:o_,pose:a_},eggpod:{type:"egg",build:l_,pose:h_},acidmaw:{type:"turret",build:u_,pose:d_},hivenode:{type:"spawner",build:f_,pose:p_},shardling:{type:"flyer",build:m_,pose:g_}};var x_=Object.assign({},Ep,Ap),v_={turret:"walltur",walker:"beltdrone",flyer:"shardling",hopper:"rockmite",spawner:"armhub",drifter:"seeker",eel:"eel",spinner:"boltspin",egg:"eggpod",hugger:"hugger"};function y_(n){return(t,e)=>{let i={time:Math.random()*4,yaw:e&&e.facing>0?0:-Math.PI,phase:Math.random()*Ot,pitch:0,flash:0,frost:0};return{st:i,update(s,r,o){s=s||{},r=r||{};let a=_p(i,t,s,r,o||0);n.pose(t.bones,i,s,r,a,t),Mp(i,t)}}}}var to={};for(let[n,t]of Object.entries(x_))to[n]={type:t.type,build:t.build,animator:y_(t)};function Rp(n){return n&&n.skin&&to[n.skin]?n.skin:v_[n&&n.type||"walker"]||"beltdrone"}var __={shockwave:.5,lob:.6,volley:.6,dash:1.1,spawn:.7,barrage:1.4,beam:1.3};function M_(n){let t=n.cfg;return t?t.phases?t.phases[Math.min(n.phase||0,t.phases.length-1)].attacks:t.attacks:null}function Cp(n,t,e,i,s,r=3){i=Math.min(i||0,.05);let o=!!(e&&e.freeze>0),a=o?0:i;n.time+=a;let l=(t.state||"idle")+":"+(t.attack?t.attack.kind:"")+":"+(t.ai||0);l!==n.key&&(n.key=l,n.sT=0,t.state==="attack"&&(n.kick=1)),n.sT+=a;let c=M_(t);n.next=c&&c.length?c[(t.ai||0)%c.length].kind:n.defaultNext||"volley";let h=t.cfg&&t.cfg.tele||.7;n.tele=t.state==="tele"?Se(t.stateT!=null&&t.cfg?1-t.stateT/h:n.sT/h,0,1):0,n.teleS=pe(n.teleS||0,n.tele,14,i),n.kind=t.state==="attack"&&t.attack?t.attack.kind:null;let u=n.kind?t.attack.dur||__[n.kind]||.5:1;n.ap=n.kind?Se(n.sT/u,0,1):0,n.kick=Math.max(0,(n.kick||0)-a*4),n.atk=pe(n.atk||0,n.kind?1:0,16,i),n.open=pe(n.open||0,t.open&&!t.dying?1:0,7,i),n.phaseS=pe(n.phaseS||0,t.phase||0,2.5,i),n.die=t.dying?Se(1-(t.deathT!=null?t.deathT:0)/2.2,0,1):0,n.flash=t.hitFlash>0?Math.min(1,t.hitFlash*12)*.5:0,n.frost=o?Math.min(1,e.freeze*2):0;let f=n.px!=null&&i>0?(t.x-n.px)/i:0;n.px=t.x,n.vx=pe(n.vx||0,f,8,i),t.dying||(n.dir=Gn(t,e)),n.yaw=pe(n.yaw,(n.dir||-1)>=0?0:-Math.PI,r,a);let d=ds(t,e,.42),g=(n.dir||-1)>0?d:Math.PI-d;return g>Math.PI&&(g-=Ot),n.aim=pe(n.aim||0,Se(g,-1.2,1.2),6,a),a}function ps(n,t,e){let i=e.phase||0;if(n.cracks1&&n.cracks1.scale.setScalar(i>=1||e.dying?1:1e-4),n.cracks2&&n.cracks2.scale.setScalar(i>=2||e.dying?1:1e-4),n.spark){let s=Math.sin(Math.floor(t.time*18)*91.7)*43758.5,r=s-Math.floor(s);n.spark.scale.setScalar(i>=1&&r>.45?.6+r:1e-4),n.spark.rotation.set(r*6,r*3,r*9)}}function ms(n,t,e,i,s){(e.phase||0)>=2||e.dying?t.shedT=(t.shedT||0)+s:t.shedT=0;let r=t.shedT||0;i.forEach((o,a)=>{let l=n[o];if(!l)return;let c=l.userData.rest;if(r<=0){l.position.copy(c),l.rotation.set(0,0,0),l.scale.setScalar(1);return}let h=r*(1+a*.15);l.position.set(c.x-h*6*(a%2?1:-1),c.y-70*h*h,c.z+(c.z>=0?1:-1)*18*h),l.rotation.set(h*2.2*(a%2?1:-1),0,h*3.1),l.scale.setScalar(h>.75?1e-4:1)})}function gs(n,t,e,i=1,s=46){let r=t.die;if(r<=0)return;if(!t.brk){let l=Jr(i);t.brk=e.map(()=>[l()*2-1,l()*.9+.2,l()*2-1,l()*6-3,l()*6-3,l()*6-3])}let o=Math.max(0,r-.25)/.75,a=o*o;e.forEach((l,c)=>{let h=n[l];if(!h)return;let u=t.brk[c],f=h.userData.rest;h.position.set(f.x+u[0]*s*a,f.y+u[1]*s*.8*a-60*a*a,f.z+u[2]*s*a*.6),h.rotation.set(u[3]*a,u[4]*a,u[5]*a)})}function xs(n,t){let e=n.time;return[Math.sin(e*61)*t,Math.sin(e*53+1)*t*.7,Math.sin(e*47+2)*t*.5]}var vs=(n,t,e,i,s,r,o,a)=>{let l=[];for(let c=0;c<=r;c++){let h=c/r,u=Math.sin(a*13.7+c*7.3)*o;l.push([n+(e-n)*h+u*.4,t+(i-t)*h+u,s])}return l},eo=Vt("#ff8a2a",3),ce={rock:js("#6e4030","#3a2218",2.4,"#8a6048"),rockD:js("#4e2c20","#2e1a12",2,"#6a4430"),rockL:js("#7e5038","#4a2c1e",2.6,"#9a7058"),frame:"#34302c",frameL:"#56504a",head:"#46403c",crys:"#4f97ff"};function b_(){let n=new xe(.038461538461538464);n.bone("pelvis","root",0,30,0).bone("torso","pelvis",0,36,0).bone("head","torso",12,58,0).bone("core","torso",9,46,0).bone("sN","torso",9,46,13.6).bone("sF","torso",9,46,-13.6).bone("pods","torso",-11,60,0).bone("armN","torso",2,55,16).bone("forN","armN",8,40,19).bone("armF","torso",2,55,-16).bone("forF","armF",8,40,-19).bone("plate0","torso",-6,53,11.8).bone("plate1","torso",-6,53,-11.8).bone("plate2","torso",0,64,0).bone("cracks1","torso",0,46,0).bone("cracks2","torso",0,46,0).bone("spark","torso",6,50,0);for(let[t,e]of[["N",1],["F",-1]])n.bone("th"+t,"pelvis",-1,30,e*9).bone("sh"+t,"th"+t,5,16,e*10).bone("ft"+t,"sh"+t,0,4,e*10);n.add("pelvis","metal",E(_.box(18,9,17,1.5,2),-1,30,0),ce.frame),n.add("pelvis","suit",E(Pe(5,3,.25,1,1.2,.8,1.1),7,28,0),ce.rockD);for(let t of[1,-1])n.add("pelvis","metal",E(_.cyl(4.2,4.2,4,14),-1,30,t*9.5,[Math.PI/2,0,0]),ce.frameL);n.add("torso","metal",_.ext([[-15,34],[13,36],[18,45],[16,57],[7,64],[-9,63],[-16,52]],22,2,{steps:2}),ce.frame),n.add("torso","suit",E(Pe(9,5,.16,2,1,1.15,1.2),13,45,0),ce.rock),n.add("torso","suit",E(Pe(7,6,.16,2,1.1,.7,1.25),9,37,0),ce.rockD),n.add("torso","suit",E(Pe(11,7,.16,2,1.1,.85,1),-8,54,0),ce.rock),n.add("torso","suit",E(Pe(6,8,.2,1,1.4,.7,1.6),-14,44,0),ce.rockD);for(let t of[1,-1])n.add("torso","suit",E(Pe(7,70+t,.18,1,1.9,.75,.32),-3,40.5,t*11.4),ce.rockD),n.add("torso","metal",E(_.torus(6.2,1.1,6,18),9,46,t*11.4),ce.frameL),n.add("core","core",E(_.cyl(5.2,5.2,.3,16),9,46,t*11.2,[Math.PI/2,0,0]),Vt("#5fb8ff",2.4)),n.add("torso","glow",_.tube([[-14,46,t*10.7],[-6,50,t*10.9],[2,47,t*10.9],[6,52,t*10.7]],.7,12,5),Vt("#6fc0ff",2.4)),n.add("torso","metal",E(_.cyl(1.1,1.1,9,8),-8,54,t*10.6,[0,0,.6]),ce.frameL),n.add("torso","metal",E(_.cyl(1.6,1.6,4,8),-11,50.5,t*10.6,[0,0,.6]),ce.frame),n.add("torso","suit",Qt([-6,58,t*8],[-2,61,t*13],[2,56,t*16],1,.9,10,6),"#1e1c1a");Ge(n,"torso",[[-10,61,4,2.6,12,.3,.4,3],[-4,62.5,-3,2.2,10,-.3,-.1,5],[-14,57,-5,1.8,8,-.5,.6,7],[-6,60,7,1.6,7,.6,.2,9],[16,52,6,1.2,5,.6,-.6,11]],ce.crys),n.add("torso","metal",E(_.box(6,5,9,1),9,57,0),ce.frameL),n.add("core","crystal",E(_.shard(5.4,31,6,11),9,46,0,[Math.PI/2,0,0]),ce.crys),n.add("core","core",E(_.shard(2.8,33,6,12),9,46,0,[Math.PI/2,0,0]),Vt("#8fd8ff",3.2)),n.add("sN","suit",E(Pe(6.8,21,.2,1,1.15,1.05,.42),9,46,14),ce.rockL),n.add("sF","suit",E(Pe(6.8,22,.2,1,1.15,1.05,.42),9,46,-14),ce.rockL);for(let[t,e]of[["plate0",1],["plate1",-1]])n.add(t,"suit",E(Pe(9,72+e,.16,2,1.25,1,.36),-6,54,e*12.4),ce.rockL),Ge(n,t,[[-8,60,e*14.5,1.1,5,e*.8,.3,25+e]],ce.crys);n.add("plate2","suit",E(Pe(8,31,.16,2,1.3,.5,1.1),0,64,0),ce.rockL),Ge(n,"plate2",[[2,66,2,1.4,6,.2,-.3,13]],ce.crys),n.add("head","metal",E(_.ext([[-6,-4.5],[6,-4.5],[9.5,-1],[8.5,3],[3,6],[-5,5.5],[-7.5,1]],10,1.2,{steps:2}),12,58,0),ce.head),n.add("head","suit",E(Pe(4.6,30,.25,0,1.3,.5,1.15),15,62.5,0),ce.rockD);for(let t of[1,-1])n.add("head","metal",E(_.ext([[14,57.8],[21.4,57.4],[21.6,60.2],[14.4,60.4]],.35,.1),0,0,t*5),"#151312"),n.add("head","glow",E(_.ext([[15,58.4],[21.3,58.1],[21.4,59.6],[15.4,59.8]],.3,.08),0,0,t*5.2),Vt("#ffad3a",3.4));n.add("head","glow",E(_.box(.4,1.4,8),21.3,58.9,0),Vt("#ffad3a",3.4)),n.add("head","metal",E(_.box(3,2.6,7,.4),19.5,55,0),ce.frameL),Ge(n,"head",[[10,63,0,1,4.5,0,.5,15]],ce.crys);for(let t of[1,-1]){n.add("pods","suit",E(Pe(4.4,40+t,.25,1,1.4,.9,1),-12,60,t*6.5),ce.rockD);for(let e=0;e<3;e++){let i=t*(4.2+e*2.4);n.add("pods","metal",E(_.cyl(1.4,1.6,9,10),-13+e*.4,65,i,[0,0,.55]),ce.frame),n.add("pods","accent",E(_.torus(1.25,.3,4,10),-15.4+e*.4,68.8,i,[Math.PI/2,0,.55]),Vt("#ffad3a",3))}}n.add("armN","metal",E(_.sph(5,12,10),2,55,16),ce.frameL),n.add("armN","metal",Qt([2,55,16],[4,48,18],[8,40,19],3.6,3,10,8),ce.frame),n.add("armN","suit",E(Pe(8.5,41,.17,2,1.15,.75,.95),1,60.5,18.5),ce.rock),Ge(n,"armN",[[0,64,19,1.4,6,.3,.3,17]],ce.crys),n.add("forN","metal",E(_.sph(3.4,10,8),8,40,19),ce.frameL),n.add("forN","metal",E(_.box(15,6.5,7.5,1.5,2),15.5,38,19),ce.frame),n.add("forN","suit",E(Pe(4.6,42,.25,0,1.6,.6,1),14,42,19),ce.rockD);for(let t of[-1.8,1.8])n.add("forN","metal",E(_.cyl(1.5,1.7,10,12),26,37.6,19+t,[0,0,-Math.PI/2]),ce.frameL),n.add("forN","accent",E(_.torus(1.55,.35,5,12),31,37.6,19+t,[0,Math.PI/2,0]),Vt("#7fd0ff",3.2));n.add("armF","metal",E(_.sph(5,12,10),2,55,-16),ce.frameL),n.add("armF","metal",Qt([2,55,-16],[4,48,-18],[8,40,-19],3.6,3,10,8),ce.frame),n.add("armF","suit",E(Pe(8.5,43,.17,2,1.15,.75,.95),1,60.5,-18.5),ce.rock),Ge(n,"armF",[[0,64,-19,1.4,6,-.3,.3,27]],ce.crys),n.add("forF","metal",E(_.sph(3.4,10,8),8,40,-19),ce.frameL),n.add("forF","metal",Qt([8,40,-19],[12,32,-20],[14,26,-20],3.8,3.4,10,8),ce.frame),n.add("forF","suit",E(Pe(5,44,.25,1,1,1.3,.8),12,32,-22),ce.rockD),n.add("forF","metal",E(_.box(11,11,10,2.2,2),16,20,-20),ce.frameL),n.add("forF","suit",E(Pe(5.6,45,.16,2,.9,1.1,1.1),21,21,-20),ce.rock),Ge(n,"forF",[[24,25,-17,1,5,.2,-1.2,19],[24,20,-21,1,5,0,-1.4,21],[24,24,-23,.8,4,-.2,-1.1,23]],ce.crys);for(let[t,e]of[["N",1],["F",-1]])n.add("th"+t,"metal",Qt([-1,30,e*9],[3,24,e*10],[5,16,e*10],4.6,3.6,10,8),ce.frame),n.add("th"+t,"suit",E(Pe(6.2,60+e,.22,1,.9,1.4,.6),3,24,e*13),ce.rock),n.add("sh"+t,"metal",E(_.sph(3.6,10,8),5,16,e*10),ce.frameL),n.add("sh"+t,"suit",E(Pe(3.8,62+e,.25,0,1,1,1.2),8.5,17,e*10),ce.rockL),n.add("sh"+t,"metal",Qt([5,16,e*10],[3,10,e*10],[0,4,e*10],3.6,3,10,8),ce.frame),n.add("sh"+t,"suit",E(Pe(4.8,64+e,.22,1,.9,1.4,.6),5,10,e*12.2),ce.rockD),n.add("ft"+t,"metal",E(_.ext([[-9,0],[11,0],[13,3],[7,6.5],[-6,6.5],[-10,3]],9,1.2),0,0,e*10),ce.frame),n.add("ft"+t,"suit",E(Pe(4.5,66+e,.22,1,1.2,.8,1.1),10,3.5,e*10),ce.rock);for(let t of[1,-1]){n.add("cracks1","glow",_.tube(vs(12,38,19,52,t*10.9,5,1.2,1),.38,14,4),eo),n.add("cracks1","glow",_.tube(vs(-14,56,-2,50,t*10.6,5,1.4,2),.38,14,4),eo),n.add("cracks2","glow",_.tube(vs(-6,62,6,66,t*7,4,1,3),.4,10,4),eo),n.add("cracks2","glow",_.tube(vs(4,34,14,40,t*11.6,4,1,4),.4,10,4),eo);for(let e=0;e<3;e++)n.add("spark","glow",E(_.box(.6,.6,.6),6+e*3,50+e*2,t*12),Vt("#ffd27a",5))}return n.build()}function S_(n,t,e,i,s,r){let o=xs(t,t.die*2.4+(t.kind==="shockwave"?t.kick*1.4:0));n.root.rotation.y=t.yaw,n.root.position.set(o[0],-t.die*t.die*16+o[1],o[2]),t.phase=(t.phase||0)+Math.abs(t.vx)*s/44*Ot;let a=Se(Math.abs(t.vx)/40,0,1),l=Math.sin(t.time*1.6),c=t.teleS,h=t.next,u=0,f=0,d=0,g=0,x=0;if(e.state==="tele"&&(h==="shockwave"?(d=c,u=.5*c,f=-.12*c):h==="lob"?(x=c,f=.08*c,u=.3*c):g=c),t.kind==="shockwave"){let v=t.ap;d=v<.16?1-v/.16*1.25:-.25+(v-.16)*.4,u=.9-v*.7,f=.24*(1-v)}else t.kind==="lob"?(x=1-t.ap*.6,f=.12*(1-t.ap)):t.kind==="volley"&&(g=1);let m=t.open;f+=.1*m,u+=.3*m,n.pelvis.position.set(0,30-u*4.5+.35*l*(1-a)+a*.9*Math.abs(Math.sin(t.phase)),0),n.torso.rotation.set(0,.05*Math.sin(t.time*.7),-f+.012*l);for(let[v,y]of[["N",0],["F",Math.PI]]){let T=t.phase+y;n["th"+v].rotation.z=a*.32*Math.sin(T)+u*.42,n["sh"+v].rotation.z=-a*.42*Math.max(0,Math.cos(T))-u*.75,n["ft"+v].rotation.z=u*.33-a*.12*Math.sin(T)}n.armF.rotation.set(.45*m,0,1.9*d+.04*l-.75*m),n.forF.rotation.set(0,0,.7*Math.max(0,d)),n.armN.rotation.set(-.45*m,0,.3*g+.04*l-.75*m),n.forN.rotation.set(0,0,g*(t.aim-.3));let p=n.forN.userData.rest;n.forN.position.set(p.x-(t.kind==="volley"?2.4*t.kick:0),p.y,p.z),n.pods.rotation.z=.28*x;let M=n.pods.userData.rest;n.pods.position.set(M.x-(t.kind==="lob"?2.2*t.kick:0),M.y,M.z),n.head.rotation.set(0,.22*Math.sin(t.time*.5)*(1-c),-.12*m+.2*g*t.aim);for(let[v,y]of[["sN",1],["sF",-1]]){let T=n[v].userData.rest;n[v].position.set(T.x-1.5*m,T.y+12*m,T.z+y*3.5*m),n[v].rotation.set(-y*.55*m,0,.2*m)}r.fx.pulse(r.byMat.core,.45+.25*Math.sin(t.time*3)+m*(2+.4*Math.sin(t.time*14))+t.die*2*Math.abs(Math.sin(t.time*31))),r.fx.pulse(r.byMat.accent,.3+1.7*c+1.5*t.atk+t.kick),ps(n,t,e),ms(n,t,e,["plate0","plate1","plate2"],s),gs(n,t,["head","armN","armF","pods","sN","sF","core"],7,52)}var Oe={skin:"#2c4a50",skinD:"#1d3237",belly:"#6f8f86",plate:"#45606a",plateL:"#5f7e84",crys:"#3fd6c8",tooth:"#dfe8dc",fin:"#2a8f86"},Gu=Vt("#3fe6d4",3.2);function w_(){let n=new xe(.041666666666666664);n.bone("body","root",0,29,0).bone("head","body",6,30,0).bone("jaw","head",9,24,0).bone("core","head",17,27,0).bone("lure","head",14,46,0).bone("lure2","lure",24,54,0).bone("finN","body",-3,24,12).bone("finF","body",-3,24,-12).bone("t0","body",-12,30,0).bone("t1","t0",-22,30,0).bone("t2","t1",-30,30,0).bone("plate0","head",14,41,9).bone("plate1","head",14,41,-9).bone("plate2","head",22,40,0).bone("cracks1","head",14,34,0).bone("cracks2","body",0,30,0).bone("spark","head",16,36,0),n.add("head","flesh",E(on(17,12.5,12.5,41,.08,22,14),15,32,0),Oe.skin),n.add("head","flesh",E(on(12,6,10,42,.08),18,25,0),Oe.belly),n.add("head","flesh",E(_.ell(9,4,8,14,8),21,25.5,0),"#3a1c22");for(let t=0;t<9;t++){let e=16+t*2,i=9.2-Math.abs(t-4)*.25;for(let s of[1,-1])n.add("head","crystal",E(_.crystal(.75,3.6-Math.abs(t-5)*.2,5,.5,60+t),e,27.2,s*(i-2.8+t*.05),[Math.PI,0,0]),Oe.tooth)}for(let t of[1,-1]){for(let e=0;e<3;e++)n.add("head","glow",E(_.sph(.9-e*.15,8,6),25+e*2.2,36.5+e*.7,t*(10.2-e*.6)),Gu);for(let e=0;e<4;e++)n.add("head","accent",E(_.box(.5,6-e*.6,.4),4+e*2.2,31,t*12.1,[0,0,.12]),Gu);for(let e=0;e<5;e++)n.add("head","paint",E(_.shell(4.2,3.2,2.6,.5,-.9,.9,.4,2,6,4),4+e*4.6,39-Math.abs(e-2)*.8,t*(11-Math.abs(e-2)*.5),[0,t*-Math.PI/2,0]),e%2?Oe.plate:Oe.plateL)}Ge(n,"head",[[10,43,2,2.2,9,.2,.5,3],[5,42,-3,1.8,7,-.3,.7,5],[16,44,-1,1.6,6,-.1,-.2,7],[0,40,4,1.4,5,.4,1,9]],Oe.crys),n.add("jaw","flesh",E(on(14,4.6,10.5,43,.08),19,20.5,0),Oe.belly),n.add("jaw","paint",E(_.ext([[8,18],[30,18.5],[33,21],[30,22],[10,21]],18,1),0,0,0),Oe.plate);for(let t=0;t<8;t++)for(let e of[1,-1])n.add("jaw","crystal",E(_.crystal(.7,3.2-Math.abs(t-4)*.2,5,.5,80+t),17+t*2,22.2,e*(8.4-t*.2)),Oe.tooth);n.add("core","core",E(_.sph(4.8,14,10),17,27,0),Vt("#9ffff0",3.4)),n.add("core","flesh",E(_.torus(5.2,1.2,6,16),17,27,0,[0,Math.PI/2,0]),"#5a2430"),n.add("lure","flesh",Qt([14,46,0],[18,54,0],[24,54,0],1,.6,12,6),Oe.skinD),n.add("lure2","flesh",Qt([24,54,0],[29,54,0],[31,50,0],.6,.35,10,5),Oe.skinD),n.add("lure2","core",E(_.sph(2,12,8),31,48.6,0),Vt("#b6fff4",3)),n.add("body","flesh",E(on(14,11.5,11.5,44,.08),-5,30,0),Oe.skinD),n.add("body","flesh",E(_.ell(11,5,9,14,8),-4,22,0),Oe.belly);for(let t=0;t<7;t++)n.add("body","paint",E(_.cone(1,4.2-Math.abs(t-3)*.4,6),6-t*3.2,41-Math.abs(t-2)*.5,0,[0,0,.35]),Oe.plate);for(let t=0;t<6;t++)for(let e of[1,-1])n.add("body","paint",E(_.shell(3.4,2.8,2.2,.45,-.9,.9,.4,2,6,4),-14+t*3.6,35+Math.sin(t*1.3)*.6,e*10.2,[0,e*-Math.PI/2,0]),t%2?Oe.plate:Oe.plateL);for(let t=0;t<6;t++)for(let e of[1,-1])n.add("body","glow",E(_.sph(.55,6,4),-14+t*3.2,28+Math.sin(t)*1.5,e*11),Gu);Ge(n,"body",[[-6,40,3,1.4,5,.3,.4,11],[-12,38,-4,1.1,4,-.4,.6,13]],Oe.crys),n.add("t0","flesh",E(on(9.5,8,8,45,.08),-17,30,0),Oe.skin);for(let t=0;t<3;t++)n.add("t0","paint",E(_.cone(.8,3,6),-12-t*3.2,37.5,0,[0,0,.4]),Oe.plate);n.add("t1","flesh",E(on(7,5.5,5.5,46,.08),-26,30,0),Oe.skinD),n.add("t2","flesh",E(on(4.5,3.6,3.6,47,.08),-32,30,0),Oe.skin),n.add("t2","membrane",E(_.membrane([[-31,0],[-36,12],[-38.5,11],[-35.5,0],[-38.5,-11],[-36,-12]]),0,30,0),Oe.fin);for(let t of[-.9,-.45,0,.45,.9])n.add("t2","paint",_.tube([[-31.5,30,0],[-34.5-Math.abs(t),30+t*6,0],[-37.6,30+t*12.4,0]],.22,6,4),Oe.skinD);for(let[t,e]of[["finN",1],["finF",-1]]){n.add(t,"membrane",E(_.membrane([[0,0],[-6,-8],[-14,-14],[-16,-10],[-10,-2]]),-3,24,e*12),Oe.fin);for(let i of[[-6,-8],[-11,-12],[-15,-12]])n.add(t,"paint",_.tube([[-3,24,e*12],[-3+i[0]*.55,24+i[1]*.5,e*12.1],[-3+i[0],24+i[1],e*12.1]],.2,6,4),Oe.skinD);n.add(t,"flesh",Qt([-3,24,e*12],[-9,17,e*12.5],[-17,12,e*12.2],.6,.25,10,4),Oe.skinD)}for(let[t,e]of[["plate0",1],["plate1",-1]])n.add(t,"paint",E(_.shell(11,8,7,1.2,e>0?.1:-1.5,e>0?1.5:-.1,.15,1.1,10,5),14,35,e*3.5),Oe.plate),Ge(n,t,[[12,43,e*8,1.2,5,e*.6,.3,21+e]],Oe.crys);n.add("plate2","paint",E(_.shell(9,7,9,1,-.8,.8,.3,1.3,8,5),18,34,0),Oe.plateL);for(let t of[1,-1]){n.add("cracks1","glow",_.tube(vs(6,36,22,40,t*11.6,5,1,5),.32,14,4),Vt("#9ffff0",3)),n.add("cracks2","glow",_.tube(vs(-14,26,2,34,t*11.2,5,1.2,6),.32,14,4),Vt("#9ffff0",3));for(let e=0;e<3;e++)n.add("spark","glow",E(_.box(.5,.5,.5),12+e*3,38-e,t*11),Vt("#d8fff8",5))}return n.build()}function E_(n,t,e,i,s,r){let o=xs(t,t.die*2);n.root.rotation.y=t.yaw,n.root.position.set(o[0],o[1]-t.die*t.die*18,o[2]);let a=t.teleS,l=t.next,c=t.open,h=t.time,u=.08+.05*Math.sin(h*1.3),f=0,d=0,g=0,x=1;e.state==="tele"&&(l==="dash"?(f=-.1*a,g=a,u=.02):l==="volley"?u=.25*a:(f=.25*a,u=.1+.1*a)),t.kind==="dash"?(d=1,u=.55,x=2.6,g=-.4):t.kind==="volley"?(u=.7*(1-t.ap*.6),f=.1):t.kind==="lob"&&(f=.35*(1-t.ap),u=.4),u=Math.max(u,.75*c),f+=.18*c,t.die>0&&(u=.6+.2*Math.sin(h*9),f=-.3*t.die,x=.3),t.jaw=pe(t.jaw||0,u,14,s),n.body.rotation.set(.04*Math.sin(h*1.1),0,-.05*d+.03*Math.sin(h*1.5)+t.die*-.25),n.body.position.set(d*3,29+Math.sin(h*2.2)*.8,0),n.head.rotation.set(0,0,f+.03*Math.sin(h*1.5+1)),n.jaw.rotation.z=-t.jaw;let m=h*3.2*x;n.t0.rotation.set(0,.12*Math.sin(m-.6),.12*Math.sin(m-.6)+.25*g),n.t1.rotation.set(0,.18*Math.sin(m-1.3),.18*Math.sin(m-1.3)+.35*g),n.t2.rotation.set(0,.25*Math.sin(m-2),.25*Math.sin(m-2)+.45*g),n.finN.rotation.x=-.25-.25*Math.sin(h*2.2*x),n.finF.rotation.x=.25+.25*Math.sin(h*2.2*x),n.lure.rotation.z=.12*Math.sin(h*1.4)-.1*f,n.lure2.rotation.z=.2*Math.sin(h*1.4-.8),n.core.scale.setScalar(.8+.3*c),r.fx.pulse(r.byMat.core,.4+.2*Math.sin(h*2.5)+c*2+t.die*Math.abs(Math.sin(h*27))*2),r.fx.pulse(r.byMat.accent,.4+1.6*a+1.2*t.atk),ps(n,t,e),ms(n,t,e,["plate0","plate1","plate2"],s),gs(n,t,["jaw","lure","finN","finF","t1","t2"],11,40)}var ke={hull:"#30353c",hullL:"#4a5059",hullD:"#1e2227",red:"#8a1c1c",stripe:"#b8862e",metal:"#5c6168"},nh=Vt("#ff3b2f",3.4),ih=Vt("#ff7a2a",3.4);function T_(){let n=new xe(.038461538461538464);n.bone("hull","root",0,33,0).bone("chin","hull",26,22,0).bone("gat","chin",30,22,0).bone("tur","hull",8,47,0).bone("tgun","tur",10,50,0).bone("vls","hull",-16,46,0).bone("engN","hull",-14,30,22).bone("engF","hull",-14,30,-22).bone("flN","engN",-32.4,30,22).bone("flF","engF",-32.4,30,-22).bone("hTN","hull",2,34,14.2).bone("hBN","hull",2,34,14.2).bone("hTF","hull",2,34,-14.2).bone("hBF","hull",2,34,-14.2).bone("core","hull",2,34,0).bone("plate0","hull",-10,40,13.4).bone("plate1","hull",-10,40,-13.4).bone("cracks1","hull",0,34,0).bone("cracks2","hull",0,34,0).bone("spark","hull",10,38,0).bone("nav","hull",0,33,0);let t=_.ext([[-36,22],[20,20],[36,26],[41,32],[30,42],[6,48],[-26,46],[-38,36]],26,2.5,{steps:4});Mn(t,e=>{e.y-=.012*e.z*e.z*(e.y>34?1:-.6)},!0),n.add("hull","paint",t,ke.hull),n.add("hull","paint",E(_.ext([[-30,41],[18,40],[26,44],[4,50],[-24,48]],18,1.5),0,0,0),ke.hullL);for(let e of[1,-1]){n.add("hull","paint",E(_.ext([[-34,26],[16,24],[30,29],[24,31],[-32,32]],1,.3),0,0,e*13.2),ke.hullL),n.add("hull","paint",E(_.ext([[-30,31.5],[22,30.8],[24,32],[-30,33]],1.1,.2),0,0,e*13.3),ke.red),n.add("hull","metal",E(_.torus(8.2,1.4,6,24),2,34,e*13.4),ke.metal);for(let i=0;i<5;i++)n.add("hull","metal",E(_.box(2.4,.6,.6),-26+i*4.2,38.8,e*13.3),ke.hullD);n.add("hull","glow",E(_.box(10,.5,.3),24,27,e*12.4,[0,0,.25]),nh),n.add("hull","paint",E(_.box(12,2.2,12,.6),-14,30,e*16),ke.hullD),n.add("hull","paint",E(_.ext([[-24,40],[-12,40],[-16,54],[-24,56]],.9,.3),0,0,e*9,[e*.25,0,0]),ke.hullL),n.add("hull","paint",E(_.box(5,1.6,.95),-21,53,e*9.6,[e*.25,0,0]),ke.red)}n.add("core","core",E(_.cyl(7.2,7.2,27.4,20),2,34,0,[Math.PI/2,0,0]),Vt("#ffb066",3.2));for(let[e,i,s]of[["hTN","hBN",1],["hTF","hBF",-1]])n.add(e,"paint",E(_.ext([[-7.6,0],[7.6,0],[6.6,3.8],[3.8,6.6],[0,7.6],[-3.8,6.6],[-6.6,3.8]],1.4,.4),2,34,s*14),ke.hullL),n.add(i,"paint",E(_.ext([[-7.6,0],[-6.6,-3.8],[-3.8,-6.6],[0,-7.6],[3.8,-6.6],[6.6,-3.8],[7.6,0]],1.4,.4),2,34,s*14),ke.hull),n.add(e,"paint",E(_.box(12,.5,.3),2,34.6,s*14.8),ke.stripe);n.add("chin","metal",E(_.sph(5,12,10),26,22,0),ke.hullD),n.add("chin","paint",E(_.shell(5.4,5.4,5.4,.6,-1,1,.3,2.2,8,6),26,22,0),ke.hullL);for(let e=0;e<6;e++){let i=e/6*Ot;n.add("gat","metal",E(_.cyl(.6,.6,12,8),35,22+Math.cos(i)*1.6,Math.sin(i)*1.6,[0,0,-Math.PI/2]),ke.metal)}n.add("gat","metal",E(_.cyl(2.4,2.4,1.2,12),32,22,0,[0,0,-Math.PI/2]),ke.hullD),n.add("gat","metal",E(_.cyl(2.4,2.4,1,12),39,22,0,[0,0,-Math.PI/2]),ke.hullD),n.add("gat","accent",E(_.torus(2,.3,4,12),41.2,22,0,[0,Math.PI/2,0]),ih),n.add("tur","paint",E(_.shell(7,5,7,.6,0,Ot,0,Math.PI/2+.2,16,5),8,47,0),ke.hullL),n.add("tur","paint",E(_.torus(6.9,.4,4,18),8,47.4,0,[Math.PI/2,0,0]),ke.red),n.add("tgun","paint",E(_.box(6,4,6,1,2),11,50,0),ke.hull);for(let e of[1.6,-1.6])n.add("tgun","metal",E(_.cyl(.85,.95,16,10),21,50.4,e,[0,0,-Math.PI/2]),ke.metal),n.add("tgun","accent",E(_.torus(.95,.25,4,10),29.2,50.4,e,[0,Math.PI/2,0]),ih);n.add("tgun","core",E(_.box(.3,.8,2.6),14.1,51.2,0),nh),n.add("vls","paint",E(_.box(14,5,14,1,2),-16,48,0),ke.hullD);for(let e=0;e<3;e++)for(let i=0;i<2;i++)n.add("vls","metal",E(_.box(3.4,.6,4.4,.2),-20.5+e*4.5,50.7,-3+i*6),ke.metal),n.add("vls","accent",E(_.cone(1.2,2.4,8),-20.5+e*4.5,51.8,-3+i*6),nh);for(let[e,i,s]of[["engN","flN",1],["engF","flF",-1]])n.add(e,"paint",E(_.cyl(5.4,6,24,16),-16,30,s*22,[0,0,Math.PI/2]),ke.hull),n.add(e,"metal",E(_.torus(5.7,.8,5,18),-4.5,30,s*22,[0,Math.PI/2,0]),ke.metal),n.add(e,"metal",E(_.lathe([[5.6,0],[6.4,-.6],[5.6,-4],[4.6,-4.2],[4.8,-.6]],16),-28,30,s*22,[0,0,Math.PI/2]),ke.hullD),n.add(e,"glow",E(_.cyl(4.6,4.6,.2,16),-32.2,30,s*22,[0,0,Math.PI/2]),ih),n.add(e,"paint",E(_.box(16,1.2,.6),-14,30,s*27.6),ke.stripe),n.add(e,"paint",E(_.ext([[-26,35],[-10,35],[-14,42],[-24,43]],.8,.25),0,0,s*22),ke.hullL),n.add(i,"glow",E(_.lathe([[4.4,0],[3.2,-4],[1.6,-8],[.05,-11]],12),-32.4,30,s*22,[0,0,Math.PI/2]),Vt("#ff8a4a",2.4));n.add("nav","glow",E(_.sph(.8,6,4),-36,37,0),nh),n.add("nav","glow",E(_.sph(.8,6,4),30,42,0),Vt("#ffffff",4));for(let[e,i]of[["plate0",1],["plate1",-1]])n.add(e,"paint",E(_.ext([[-28,35],[-6,35],[-4,44],[-26,45]],1.4,.5),0,0,i*13.6),ke.hullL);for(let e of[1,-1]){n.add("hull","glow",_.tube([[-26,38,e*12.9],[-18,42,e*12.9],[-10,37,e*12.9],[-4,41,e*12.9]],.6,12,5),ih.map(i=>i*.7)),n.add("cracks1","glow",_.tube(vs(14,28,30,36,e*13.6,5,1,7),.32,14,4),eo),n.add("cracks2","glow",_.tube(vs(-34,30,-16,26,e*13.6,5,1,8),.32,14,4),eo);for(let i=0;i<3;i++)n.add("spark","glow",E(_.box(.6,.6,.6),8+i*4,40-i,e*14),Vt("#ffd27a",5))}return n.build()}function A_(n,t,e,i,s,r){let o=xs(t,t.die*2.2+(t.kind==="barrage"?.35:0));n.root.rotation.y=t.yaw,n.root.position.set(o[0],o[1]-t.die*t.die*26,o[2]);let a=t.teleS,l=t.next,c=t.open,h=t.time;n.hull.rotation.set(.04*Math.sin(h*.9)+t.die*.3,0,.03*Math.sin(h*1.3)-t.die*.35);let u=e.state==="tele"&&l==="volley"||t.kind==="volley"?1:0;t.tv=pe(t.tv||0,u,6,s),n.tur.rotation.y=0,n.tgun.rotation.z=t.tv*Se(t.aim,-.5,.6);let f=n.tgun.userData.rest;n.tgun.position.set(f.x-(t.kind==="volley"?2.5*t.kick:0),f.y,f.z),t.gspin=(t.gspin||0)+s*(t.kind==="barrage"?30:e.state==="tele"&&l==="barrage"?12*a:.5),n.gat.rotation.x=t.gspin,n.chin.rotation.z=t.kind==="barrage"||e.state==="tele"&&l==="barrage"?Se(t.aim,-.6,.3):0;let d=(t.kind==="lob"?1-t.ap:0)+(e.state==="tele"&&l==="lob"?a*.5:0);n.vls.position.y=n.vls.userData.rest.y+1.5*d;for(let[x,m]of[["hTN","hBN"],["hTF","hBF"]])n[x].position.y=n[x].userData.rest.y+8*c,n[m].position.y=n[m].userData.rest.y-8*c;let g=.85+.15*Math.sin(h*43)+.25*(t.kind?1:0);n.flN.scale.set(g,1,1),n.flF.scale.set(g*(.97+.03*Math.sin(h*37)),1,1),n.nav.scale.setScalar(h%1.2<.1?1:1e-4),r.fx.pulse(r.byMat.core,.35+.15*Math.sin(h*3)+c*2.4+t.die*2*Math.abs(Math.sin(h*29))),r.fx.pulse(r.byMat.accent,.3+1.8*a+1.6*t.atk),ps(n,t,e),ms(n,t,e,["plate0","plate1"],s),gs(n,t,["engN","engF","tur","vls","chin","hTN","hBF"],13,56)}var Pp={warden:{build:b_,pose:S_},maw:{build:w_,pose:E_},gunship:{build:T_,pose:A_}};var Ra=(n,t,e,i,s,r,o,a)=>{let l=[];for(let c=0;c<=r;c++){let h=c/r,u=Math.sin(a*13.7+c*7.3)*o;l.push([n+(e-n)*h+u*.4,t+(i-t)*h+u,s])}return l},Aa=Vt("#ff6a14",3.4),Ip=Vt("#ffcf3a",3.2),Wu=Vt("#ff8a2a",3),fe={iron:"#302c2a",ironL:"#48423e",steel:"#5c6066",steelL:"#7c8086",brass:"#a07a3a",hazard:"#d8a12a",dark:"#1a1716",rust:"#6e3a20"};function R_(){let n=new xe(.038461538461538464);n.bone("pelvis","root",0,34,0).bone("torso","pelvis",0,40,0).bone("head","torso",9,70,0).bone("core","torso",6,49,0).bone("doorN","torso",14.5,49,13.4).bone("doorF","torso",14.5,49,-13.4).bone("stacks","torso",-10,70,0).bone("armN","torso",0,64,18).bone("forN","armN",4,47,21).bone("armF","torso",0,64,-18).bone("forF","armF",4,47,-21).bone("plate0","torso",-6,57,13).bone("plate1","torso",-6,57,-13).bone("plate2","torso",0,71,0).bone("cracks1","torso",0,50,0).bone("cracks2","torso",0,50,0).bone("spark","torso",0,56,0);for(let[t,e]of[["N",1],["F",-1]])n.bone("th"+t,"pelvis",-2,34,e*10).bone("sh"+t,"th"+t,4,19,e*11).bone("ft"+t,"sh"+t,-1,5,e*11);n.add("pelvis","paint",E(_.box(22,10,20,1.6,2),-1,34,0),fe.iron);for(let t=0;t<6;t++)n.add("pelvis","paint",E(_.box(2.4,3.2,20.4),-9+t*3.6,31.6,0,[0,0,.6]),t%2?fe.dark:fe.hazard);for(let t of[1,-1])n.add("pelvis","metal",E(_.cyl(5,5,4.4,16),-2,34,t*10.4,[Math.PI/2,0,0]),fe.steelL);n.add("torso","metal",_.ext([[-16,38],[14,38],[19,48],[18,62],[10,70],[-10,70],[-18,60]],24,2.4,{steps:2}),fe.steel);for(let t of[1,-1]){n.add("torso","paint",E(_.ext([[-16,39],[2,39],[2,47],[-17,47]],1.4,.5),0,0,t*12.4),fe.ironL),n.add("torso","metal",E(_.torus(8.6,1.3,6,22),6,49,t*12.4),fe.brass);for(let e=0;e<4;e++)n.add("torso","metal",E(_.box(16,.9,.6),6,44+e*3.2,t*12.6),fe.dark);for(let e=0;e<3;e++)n.add("torso","accent",E(_.box(6,.6,.4),12,62+e*1.6,t*12.2,[0,0,-.35]),Aa);n.add("torso","glow",_.tube([[-15,50,t*11.8],[-8,54,t*12],[-12,60,t*12],[-4,64,t*11.8]],.7,12,5),Aa.map(e=>e*.6)),n.add("torso","metal",E(_.torus(3.4,.9,6,14),-10,58,t*11.8),fe.steelL),n.add("torso","suit",Qt([-12,64,t*8],[-6,69,t*14],[0,64,t*18],1.1,1,10,6),fe.dark)}n.add("torso","paint",E(_.ext([[10,60],[19,52],[20,58],[14,67]],18,1.2),0,0,0),fe.ironL),n.add("core","core",E(_.cyl(8,8,25.2,20),6,49,0,[Math.PI/2,0,0]),Vt("#ff9a40",3.3));for(let t of[1,-1])for(let e=-2;e<=2;e++)n.add("torso","metal",E(_.box(.7,15,.7),6+e*3,49,t*12.8),fe.dark);for(let[t,e]of[["doorN",1],["doorF",-1]]){n.add(t,"paint",E(_.ext([[-2,-7.4],[14.5,-7.4],[15.8,-5],[15.8,5],[14.5,7.4],[-2,7.4],[-3.2,5],[-3.2,-5]],1.6,.5),-1.2,49,e*13.6),fe.ironL),n.add(t,"metal",E(_.box(14,1,.5),6,49,e*14.5),fe.brass);for(let i of[44,54])n.add(t,"metal",E(_.cyl(.8,.8,2.4,8),14.5,i,e*13.4),fe.steelL)}n.add("head","paint",E(_.ext([[-5,-4.5],[6,-4.5],[8.5,0],[6.5,5],[-4,5.2],[-6,1]],9.4,1),9,70,0),fe.ironL);for(let t of[1,-1])n.add("head","metal",E(_.ext([[11,70],[17.4,69.6],[17.4,71.6],[11.6,71.8]],.3,.08),0,0,t*4.75),fe.dark),n.add("head","glow",E(_.ext([[11.6,70.4],[17.2,70.1],[17.2,71.2],[12,71.4]],.3,.06),0,0,t*4.95),Ip);n.add("head","glow",E(_.box(.4,1,7),17.5,70.7,0),Ip),n.add("head","metal",E(_.cyl(.25,.25,6,5),4,77,3,[0,0,.3]),fe.steelL);for(let t of[1,-1]){n.add("stacks","paint",E(_.cyl(2.6,3,14,14),-12,76,t*6),fe.iron);for(let e of[72,79])n.add("stacks","metal",E(_.torus(2.9,.45,5,14),-12,e,t*6,[Math.PI/2,0,0]),fe.brass);n.add("stacks","accent",E(_.cyl(2.2,2.2,.3,12),-12,83.1,t*6),Aa)}n.add("armN","metal",E(_.cyl(5.4,5.4,6,16),0,64,18,[Math.PI/2,0,0]),fe.steelL),n.add("armN","paint",E(_.ext([[-8,64],[-4,71],[6,71],[9,64],[4,60],[-5,60]],4,1),0,0,20),fe.ironL);for(let t=0;t<4;t++)n.add("armN","paint",E(_.box(1.6,2.6,.4),-4+t*3,66,22.1,[0,0,.6]),t%2?fe.dark:fe.hazard);n.add("armN","metal",Qt([0,64,18.5],[2,56,20],[4,47,21],3.4,3,10,8),fe.steel),n.add("armN","metal",E(_.cyl(1,1,12,8),4,56,23.2,[0,0,.2]),fe.steelL),n.add("forN","metal",E(_.sph(3.6,12,8),4,47,21),fe.brass),n.add("forN","paint",Qt([4,47,21],[7,40,21],[9,34,21],3.6,3.2,10,8),fe.ironL),n.add("forN","paint",E(_.box(11,15,12,1.6,2),10,26,21),fe.iron);for(let t of[21,31])n.add("forN","metal",E(_.box(11.6,1.4,12.6,.3),10,t,21),fe.brass);n.add("forN","accent",E(_.box(.6,12,10),15.8,26,21),Aa),n.add("armF","metal",E(_.cyl(5.4,5.4,6,16),0,64,-18,[Math.PI/2,0,0]),fe.steelL),n.add("armF","paint",E(_.ext([[-8,64],[-4,71],[6,71],[9,64],[4,60],[-5,60]],4,1),0,0,-20),fe.ironL),n.add("armF","metal",Qt([0,64,-18.5],[2,56,-20],[4,47,-21],3.4,3,10,8),fe.steel),n.add("forF","metal",E(_.sph(3.6,12,8),4,47,-21),fe.brass),n.add("forF","paint",E(_.box(16,7.5,8,1.4,2),12,45,-21),fe.ironL),n.add("forF","metal",E(_.cyl(2.8,3.2,12,14),24,45,-21,[0,0,-Math.PI/2]),fe.steel);for(let t of[20,26])n.add("forF","metal",E(_.torus(3.2,.5,5,14),t,45,-21,[0,Math.PI/2,0]),fe.brass);n.add("forF","accent",E(_.cyl(2.2,2.2,.3,12),30.2,45,-21,[0,0,-Math.PI/2]),Aa);for(let[t,e]of[["N",1],["F",-1]]){n.add("th"+t,"metal",Qt([-2,34,e*10],[2,26,e*11],[4,19,e*11],4.6,3.8,10,8),fe.steel),n.add("th"+t,"paint",E(_.ext([[-4,31],[6,30],[7,21],[-1,22]],2,.6),0,0,e*15),fe.ironL),n.add("th"+t,"metal",E(_.cyl(.9,.9,12,8),-3,26,e*15.6,[0,0,-.25]),fe.steelL),n.add("sh"+t,"metal",E(_.cyl(4,4,7,14),4,19,e*11,[Math.PI/2,0,0]),fe.brass),n.add("sh"+t,"paint",E(_.box(7.5,14,8.5,1.4,2),1.6,12,e*11,[0,0,.2]),fe.iron);for(let i=0;i<3;i++)n.add("sh"+t,"paint",E(_.box(1.4,2.2,.4),0+i*2.4,14,e*15.4,[0,0,.6]),i%2?fe.dark:fe.hazard);n.add("ft"+t,"paint",E(_.ext([[-9,0],[12,0],[13.5,2.6],[8,6],[-6,6],[-10,3]],11,1.2),0,0,e*11),fe.ironL);for(let i of[-3.4,0,3.4])n.add("ft"+t,"metal",E(_.box(3.2,2.6,2.6,.6),13,1.6,e*11+i),fe.steelL)}for(let[t,e]of[["plate0",1],["plate1",-1]]){n.add(t,"paint",E(_.ext([[-17,50],[0,50],[2,63],[-8,67],[-17,62]],2.2,.7,{steps:2}),0,0,e*13.2),fe.ironL);for(let i=0;i<4;i++)n.add(t,"paint",E(_.box(1.8,3,.4),-14+i*3.4,53,e*14.4,[0,0,.6]),i%2?fe.dark:fe.hazard)}n.add("plate2","paint",E(_.ext([[-12,68],[10,68],[12,73],[-12,74]],30,1.2),0,0,0),fe.ironL);for(let t of[1,-1]){n.add("cracks1","glow",_.tube(Ra(-14,40,0,46,t*13.3,5,1,1),.36,14,4),Wu),n.add("cracks1","glow",_.tube(Ra(12,58,18,66,t*9.2,4,.8,2),.36,10,4),Wu),n.add("cracks2","glow",_.tube(Ra(-16,60,-4,68,t*12.6,5,1,3),.38,14,4),Wu);for(let e=0;e<3;e++)n.add("spark","glow",E(_.box(.7,.7,.7),-6+e*4,56+e*2,t*13.4),Vt("#ffd27a",5))}return n.build()}function C_(n,t,e,i,s,r){let o=xs(t,t.die*2.6+(t.kind==="shockwave"?t.kick*1.6:0));n.root.rotation.y=t.yaw,n.root.position.set(o[0],o[1]-t.die*t.die*18,o[2]);let a=t.teleS,l=t.next,c=t.open,h=t.time,u=t.kind==="dash";t.phase=(t.phase||0)+Math.abs(t.vx)*s/(u?60:46)*Ot;let f=Se(Math.abs(t.vx)/40,0,1),d=Math.sin(h*1.5),g=0,x=0,m=0,p=0;if(e.state==="tele"&&(l==="dash"?(g=.7*a,x=-.1*a):l==="shockwave"?(m=a,x=-.1*a):p=a),u)x=.28,g=.3;else if(t.kind==="shockwave"){let y=t.ap;m=y<.16?1-y/.16*1.3:-.3+(y-.16)*.4,g=.8-y*.6,x=.2*(1-y)}else t.kind==="volley"&&(p=1);x+=.08*c,g+=.25*c,n.pelvis.position.set(0,34-g*4.5+.3*d*(1-f)+f*1.1*Math.abs(Math.sin(t.phase)),0),n.torso.rotation.set(0,.04*Math.sin(h*.6),-x+.012*d);for(let[y,T]of[["N",0],["F",Math.PI]]){let A=t.phase+T,R=u?.55:.34;n["th"+y].rotation.z=f*R*Math.sin(A)+g*.42,n["sh"+y].rotation.z=-f*R*1.2*Math.max(0,Math.cos(A))-g*.75,n["ft"+y].rotation.z=g*.33-f*.12*Math.sin(A)}n.armN.rotation.set(0,0,2*m+.04*d+(u?-.4:0)),n.forN.rotation.set(0,0,.8*Math.max(0,m)),n.armF.rotation.set(0,0,.2*p+.04*d+(u?-.4:0)),n.forF.rotation.set(0,0,p*(t.aim-.2));let M=n.forF.userData.rest;n.forF.position.set(M.x-(t.kind==="volley"?2.4*t.kick:0),M.y,M.z),n.head.rotation.set(0,.25*Math.sin(h*.4)*(1-a),-.1*c+.15*p*t.aim),n.stacks.rotation.z=.03*Math.sin(h*2.3),n.doorN.rotation.y=-1.7*c,n.doorF.rotation.y=1.7*c;let v=.85+.15*Math.sin(h*19)*Math.sin(h*6.3);r.fx.pulse(r.byMat.core,(.5+c*2)*v+t.die*Math.abs(Math.sin(h*31))*2),r.fx.pulse(r.byMat.accent,(.45+1.6*a+1.4*t.atk)*v),ps(n,t,e),ms(n,t,e,["plate0","plate1","plate2"],s),gs(n,t,["head","armN","armF","stacks","doorN","doorF"],17,54)}var an={crys:"#7a3ff0",crysD:"#5a2ab8",crysL:"#a57aff",flesh:"#4a2240",fleshL:"#6a3256",sac:"#6e3c5e",bone:"#cdbba2",chitin:"#24162a",wing:"#b48cff"},no=Vt("#8fff3f",3.2);function P_(){let n=new xe(.041666666666666664);n.bone("thorax","root",0,40,0).bone("head","thorax",15,46,0).bone("jaw","head",22,43,0).bone("abd","thorax",-10,37,0).bone("abd2","abd",-24,30,0).bone("wN","thorax",-2,51,6).bone("wF","thorax",-2,51,-6).bone("wN2","thorax",-5,50,5).bone("wF2","thorax",-5,50,-5).bone("cpN","thorax",3,41,8.5).bone("cpF","thorax",3,41,-8.5).bone("core","thorax",3,40,0).bone("plate0","thorax",-2,48,6).bone("plate1","thorax",-2,48,-6).bone("cracks1","thorax",0,40,0).bone("cracks2","thorax",0,40,0).bone("spark","thorax",4,44,0);for(let[i,s]of[["N",1],["F",-1]])n.bone("sc"+i,"thorax",10,36,s*8).bone("sc"+i+"k","sc"+i,18,24,s*11);let t=[6,2,-2,-6];t.forEach((i,s)=>{let r=s%2?-1:1;n.bone("l"+s,"thorax",i,32,r*5.5).bone("l"+s+"k","l"+s,i+2,22,r*9)}),n.add("thorax","flesh",E(on(12.5,9.5,8.6,51,.08),2,40,0),an.flesh),n.add("thorax","flesh",E(_.ell(8,4,6.4,12,8),4,33.6,0),an.fleshL),n.add("thorax","core",E(_.sph(5.2,14,10),3,40,0),Vt("#a6ff5a",3.2)),Ge(n,"thorax",[[-4,48,0,1.8,9,0,.6,3],[2,49,0,1.6,8,0,.3,5],[8,48,0,1.3,6,0,-.1,7],[-9,45,0,1.2,5,0,1,9]],an.crys),n.add("thorax","crystal",E(_.shell(12.6,9.6,8.8,.6,0,Ot,0,.9,16,4),2,40.4,0),an.crys);for(let[i,s]of[["cpN",1],["cpF",-1]])n.add(i,"crystal",E(_.shell(10.5,8.5,9.2,.7,s>0?.35:-2.8,s>0?2.8:-.35,.8,2.1,10,5),3,40,0),an.crysD);for(let[i,s]of[["plate0",1],["plate1",-1]])n.add(i,"crystal",E(_.shell(12.8,9.8,9,.7,s>0?1.7:-3,s>0?3:-1.7,.3,1.4,8,4),2,40.2,0),an.crys);n.add("head","flesh",E(on(9,6.4,6,52,.08),21,47,0,[0,0,-.2]),an.fleshL),n.add("head","crystal",E(_.shell(9.4,6.8,6.4,.5,-.6,3.74,0,1.2,12,4),20,47.4,0,[0,0,-.2]),an.crysD),Ge(n,"head",[[15,52,0,1.6,10,0,1,11],[16,53,2.6,1.2,8,.4,1.1,13],[16,53,-2.6,1.2,8,-.4,1.1,15],[21,53,0,1,5,0,.4,17]],an.crys);for(let i of[1,-1])for(let s=0;s<3;s++)n.add("head","glow",E(_.sph(1-s*.15,8,6),25.5+s*1.8,48.8-s*.7,i*(4.6-s*.6)),no);for(let i of[1,-1])n.add("jaw","paint",Qt([22,43,i*1.8],[26,41,i*2.2],[27.5,38,i*.8],.8,.15,8,5),an.bone),n.add("jaw","paint",Qt([23,44,i*2.4],[26.5,43.6,i*2.8],[28.4,41.6,i*1.6],.6,.12,8,5),an.bone);n.add("jaw","glow",E(_.sph(1.2,8,6),25.5,42.4,0),no),n.add("abd","flesh",E(on(14,11.5,10.5,53,.07),-17,31,0,[0,0,.25]),an.sac);for(let i=0;i<4;i++)n.add("abd","paint",E(_.torus(9.6-Math.abs(i-1.2)*1.4,.6,6,22),-9-i*5,34-i*1.6,0,[0,Math.PI/2,.25]),an.bone);for(let i=0;i<5;i++){let s=i*1.25;n.add("abd","accent",_.tube([[-6,34+Math.cos(s)*6,Math.sin(s)*6],[-16,31+Math.cos(s+.4)*10.5,Math.sin(s+.4)*9.6],[-26,28+Math.cos(s+.8)*6,Math.sin(s+.8)*5.6]],.3,12,4),no.map(r=>r*.6))}n.add("abd2","flesh",E(_.ell(4.5,3.6,3.6,10,8),-30,27,0,[0,0,.5]),an.fleshL),n.add("abd2","accent",E(_.sph(1.8,10,8),-33.4,24.6,0),no);let e=(i,s)=>_.membrane([[0,0],[-i*.2,s*.7],[-i*.6,s],[-i,s*.8],[-i*.75,s*.25],[-i*.3,-.5]]);for(let[i,s,r,o]of[["wN",6,26,18],["wF",-6,26,18],["wN2",5,20,13],["wF2",-5,20,13]]){let a=i.endsWith("2")?-5:-2,l=i.endsWith("2")?50:51;n.add(i,"membrane",E(e(r,o),a,l,s),an.wing),n.add(i,"crystal",_.tube([[a,l,s],[a-r*.3,l+o*.85,s],[a-r,l+o*.8,s]],.35,10,4),an.crysL),n.add(i,"crystal",_.tube([[a-r*.2,l+o*.4,s],[a-r*.55,l+o*.55,s],[a-r*.8,l+o*.4,s]],.22,8,4),an.crysL)}for(let[i,s]of[["N",1],["F",-1]]){n.add("sc"+i,"paint",Qt([10,36,s*8],[15,31,s*10],[18,24,s*11],1.6,1.2,10,6),an.chitin),n.add("sc"+i+"k","paint",E(_.sph(1.4,8,6),18,24,s*11),an.bone);let r=_.shard(1.6,22,5,70+s,.1);je(r,null,null,[1,1,.45]),n.add("sc"+i+"k","crystal",E(r,22,31,s*11,[0,0,-.55]),an.crysL)}t.forEach((i,s)=>{let r=s%2?-1:1;n.add("l"+s,"paint",Qt([i,32,r*5.5],[i+1.5,27,r*7.8],[i+2,22,r*9],.9,.6,8,5),an.chitin),n.add("l"+s+"k","paint",Qt([i+2,22,r*9],[i+.6,15,r*9.5],[i-1.4,8,r*9],.6,.12,8,5),an.bone)});for(let i of[1,-1]){n.add("cracks1","glow",_.tube(Ra(-8,44,10,48,i*9.4,5,.8,1),.3,14,4),no),n.add("cracks2","glow",_.tube(Ra(-6,34,10,36,i*8.6,5,.8,2),.3,14,4),no);for(let s=0;s<3;s++)n.add("spark","glow",E(_.box(.5,.5,.5),2+s*3,44+s,i*9.6),Vt("#e6ffb0",5))}return n.build()}var I_=new O;function D_(n,t,e,i,s,r){let o=xs(t,t.die*2);n.root.rotation.y=t.yaw,n.root.position.set(o[0],o[1]-t.die*t.die*20,o[2]);let a=t.teleS,l=t.next,c=t.open,h=t.time,u=0,f=0,d=0,g=0,x=1;e.state==="tele"&&(l==="spawn"?u=a:l==="dash"?(f=a,x=1.6):d=a),t.kind==="spawn"?u=1-t.ap*.8:t.kind==="dash"?(f=-.8,g=1,x=2.2):t.kind==="lob"&&(d=1-t.ap*1.6),n.thorax.rotation.set(.04*Math.sin(h*1.2),0,-.18*g+.04*Math.sin(h*1.6)+.1*d*.5-t.die*.4),n.thorax.position.set(3*g,40+Math.sin(h*2.2)*.8,0),n.head.rotation.set(0,.12*Math.sin(h*.8),.3*d-.1*g),n.jaw.rotation.z=-.25*Math.max(d,c*.5)-.06*Math.sin(h*3);let m=Math.sin(h*2+u*6);n.abd.rotation.z=.06*Math.sin(h*1.1)-.15*u,n.abd.scale.set(1-.1*u+.03*m,1-.12*u+.03*m,1-.08*u+.03*m),n.abd2.rotation.z=.12*Math.sin(h*1.4-.7)-.3*u;let p=Math.sin(h*Ot*9*x);n.wN.rotation.x=-.3-.55*p,n.wF.rotation.x=.3+.55*p,n.wN2.rotation.x=-.4-.5*Math.sin(h*Ot*9*x+1),n.wF2.rotation.x=.4+.5*Math.sin(h*Ot*9*x+1);for(let M of["N","F"])n["sc"+M].rotation.z=.15*Math.sin(h*1.3)+.9*f,n["sc"+M+"k"].rotation.z=.2*Math.sin(h*1.3+.6)+.6*Math.max(0,f)-.5*Math.max(0,-f);for(let M=0;M<4;M++)n["l"+M].rotation.z=.15*Math.sin(h*1.7+M)-.3*g,n["l"+M+"k"].rotation.z=.2*Math.sin(h*1.7+M+.8)-.2;for(let[M,v]of[["cpN",1],["cpF",-1]]){let y=n[M].userData.rest;n[M].position.set(y.x,y.y+3*c,y.z+v*4*c),n[M].quaternion.setFromAxisAngle(I_.set(1,0,0),-v*.9*c)}r.fx.pulse(r.byMat.core,.4+.25*Math.sin(h*3)+c*2+t.die*Math.abs(Math.sin(h*29))*2),r.fx.pulse(r.byMat.accent,.45+1.6*Math.max(a,u)+1.2*t.atk),ps(n,t,e),ms(n,t,e,["plate0","plate1"],s),gs(n,t,["head","wN","wF","wN2","wF2","scN","scF","abd","cpN","cpF"],19,44)}var bn={metal:"#2a2430",metalL:"#433a4c",crys:"#8a4dff",crysL:"#c09aff",flesh:"#3a1a30",bone:"#cdbba2"},Xu=Vt("#c58aff",3.2),ys=Vt("#8fff3f",3.2);function L_(){let n=new xe(.03571428571428571),t=[0,52,0];n.bone("body","root",0,52,0).bone("core","body",0,52,0).bone("pupil","core",0,52,8).bone("crown","body",0,74,0).bone("r0","body",0,52,0).bone("r1","body",0,52,0).bone("r2","body",0,52,0).bone("orbit","body",0,52,0).bone("plate0","body",30,52,0).bone("plate1","body",-30,52,0).bone("cracks1","core",0,52,0).bone("cracks2","core",0,52,0).bone("spark","body",0,52,0);for(let e=0;e<6;e++){let i=e/6*Ot+Math.PI/2;n.bone("p"+e,"body",Math.cos(i)*11,52+Math.sin(i)*11,13.5)}for(let e=0;e<4;e++){let i=-12+e*8;n.bone("td"+e,"body",i,30,(e%2?-1:1)*3).bone("td"+e+"b","td"+e,i*1.1,16,(e%2?-1:1)*3)}n.add("core","crystal",E(_.shard(12,40,8,91,.1),...t),bn.crys),n.add("core","core",E(_.shard(5.6,34,8,92,.1),...t),Vt("#d6a8ff",3)),n.add("core","core",E(_.torus(5.2,.9,6,24),0,52,8.4),ys),n.add("pupil","metal",E(_.cyl(2.6,2.6,.8,16),0,52,9.6,[Math.PI/2,0,0]),"#0c0a10"),n.add("pupil","glow",E(_.torus(2.7,.3,4,16),0,52,10),ys),n.add("body","metal",E(_.lathe([[.001,0],[14,2],[17,8],[15,14],[10,18],[.001,19]],14),0,26,-6,[0,0,0]),bn.metal),n.add("body","paint",E(_.torus(16,2.2,8,28),0,52,-7),bn.metalL),n.add("body","paint",E(_.cyl(15,15,4,24),0,52,-10,[Math.PI/2,0,0]),bn.metal);for(let e=0;e<12;e++){let i=e/12*Ot;n.add("body","glow",E(_.box(.5,3.2,.5),Math.cos(i)*16.4,52+Math.sin(i)*16.4,-4.6,[0,0,i+Math.PI/2]),Xu.map(s=>s*.7))}for(let e=0;e<6;e++){let i=e/6*Ot+Math.PI/2,s=Math.cos(i)*11,r=52+Math.sin(i)*11,o=_.ext([[0,-4.2],[22,-2.2],[30,0],[22,2.2],[0,4.2],[-1.6,0]],2.2,.6,{steps:2}),a=_.ext([[2,-4.6],[22,-2.6],[31,0],[22,-1.6],[2,-3.6]],2.4,.2);n.add("p"+e,"paint",E(o,s,r,13.5+e*.05,[0,0,i]),bn.metalL),n.add("p"+e,"glow",E(a,s,r,13.6+e*.05,[0,0,i]),Xu),n.add("p"+e,"metal",E(_.cyl(1.6,1.6,3.2,10),s,r,13.5,[Math.PI/2,0,0]),bn.metal),n.add("p"+e,"crystal",E(_.crystal(1.1,4.4,5,.5,100+e),s+Math.cos(i)*16,r+Math.sin(i)*16,15,[Math.PI/2,0,0]),bn.crysL)}n.add("r0","paint",E(_.torus(36,1.8,6,56),0,52,0),bn.metal),n.add("r0","glow",E(_.torus(36,.5,4,56),0,52,1.6),Xu.map(e=>e*.8)),n.add("r1","paint",E(_.torus(29,1.4,6,48),0,52,0,[1.1,0,0]),bn.metalL),n.add("r1","glow",E(_.torus(29,.4,4,48),0,52,0,[1.1,0,0]),ys.map(e=>e*.6)),n.add("r2","paint",E(_.torus(23,1.2,6,40),0,52,0,[0,1.2,0]),bn.metalL);for(let e=0;e<8;e++){let i=e/8*Ot;n.add("r0","metal",E(_.box(3.2,3.2,4.4,.6),Math.cos(i)*36,52+Math.sin(i)*36,0,[0,0,i]),bn.metalL)}n.add("plate0","paint",E(_.torus(40,1.6,6,14,1.2),0,52,-2,[0,0,-.6]),bn.metalL),n.add("plate1","paint",E(_.torus(40,1.6,6,14,1.2),0,52,-2,[0,0,Math.PI-.6]),bn.metalL);for(let e=0;e<5;e++){let i=e/5*Ot;n.add("orbit","crystal",E(_.shard(1.9,9,6,110+e),Math.cos(i)*41,52+Math.sin(i)*41,Math.sin(i*2)*4,[.3,0,i]),bn.crysL)}Ge(n,"crown",[[0,68,-3,3,26,0,0,3],[-8,66,-4,2.2,18,-.1,.35,5],[8,66,-4,2.2,18,-.1,-.35,7],[-15,63,-5,1.6,11,0,.7,9],[15,63,-5,1.6,11,0,-.7,11]],bn.crys),n.add("crown","metal",E(_.box(30,4,8,1.2),0,68,-4),bn.metal);for(let e=0;e<4;e++){let i=-12+e*8,s=(e%2?-1:1)*3;n.add("td"+e,"flesh",Qt([i,31,s],[i*1.05,24,s],[i*1.1,16,s],1.5,1.1,10,6),bn.flesh);for(let r of[27,21])n.add("td"+e,"metal",E(_.torus(1.55,.4,4,10),i*(1+(31-r)/300),r,s,[Math.PI/2,0,0]),bn.metalL);n.add("td"+e+"b","flesh",Qt([i*1.1,16,s],[i*1.15,9,s],[i*1.25,3,s],1.1,.35,10,6),bn.flesh),n.add("td"+e+"b","glow",E(_.sph(.9,8,6),i*1.25,2.4,s),ys)}n.add("cracks1","glow",_.tube([[-6,66,7],[-2,58,9],[-5,50,10],[1,42,9]],.35,12,4),ys),n.add("cracks1","glow",_.tube([[6,64,7],[3,56,9.5],[7,48,8]],.35,10,4),ys),n.add("cracks2","glow",_.tube([[-8,54,8],[-1,52,10.5],[9,54,8]],.4,10,4),ys),n.add("cracks2","glow",_.tube([[2,70,4],[-3,62,8],[3,60,9]],.4,10,4),ys);for(let e=0;e<4;e++)n.add("spark","glow",E(_.box(.7,.7,.7),-12+e*8,40+e%2*20,9),Vt("#f0d8ff",5));return n.build()}var Sw=new O;function N_(n,t,e,i,s,r){let o=xs(t,t.die*2.4+(t.kind==="barrage"?.4:0));n.root.rotation.y=0;let a=t.teleS,l=t.next,c=t.open,h=t.time,u=t.kind,f=0,d=0,g=1,x=0,m=0,p=1;e.state==="tele"&&(l==="volley"||l==="spawn"?f=.4*a:l==="shockwave"?d=-.5*a:l==="beam"?m=a:l==="barrage"?g=1+5*a:l==="dash"?x=-.3*a:l==="lob"&&(p=1+3*a)),u==="volley"?f=.6*(1-t.ap):u==="shockwave"?d=t.ap<.2?-.5+t.ap*7:.9*(1-t.ap):u==="beam"?m=1:u==="spawn"?f=.5:u==="barrage"?g=7:u==="dash"?x=1:u==="lob"&&(p=4*(1-t.ap)+1),n.root.position.set(o[0]+x*10*(t.dir||-1),o[1]-t.die*t.die*24,o[2]),n.body.position.set(0,52+1.2*Math.sin(h*1.1)-6*Math.max(0,d)*.3,0),n.body.rotation.set(.04*Math.sin(h*.7),.08*Math.sin(h*.5),.03*Math.sin(h*.9)+t.die*.3*Math.sin(h*7));let M=Se(1-c-f-t.die,0,1);t.close=pe(t.close==null?1:t.close,M,8,s);for(let C=0;C<6;C++)n["p"+C].rotation.set(0,0,2.2*t.close+.03*Math.sin(h*2+C));t.r0=(t.r0||0)+s*.25*g,t.r1=(t.r1||0)+s*.6*g,t.r2=(t.r2||0)+s*-.9*g,t.orb=(t.orb||0)+s*.4*p,n.r0.rotation.set(0,0,t.r0),n.r0.position.y=d*10,n.r0.scale.setScalar(1+Math.max(0,d)*.12),n.r1.rotation.set(0,t.r1,0),n.r1.position.y=d*7,n.r2.rotation.set(t.r2,0,0),n.orbit.rotation.set(0,0,t.orb),n.crown.rotation.z=.02*Math.sin(h*1.3);let v=Math.cos(t.aim)*(t.dir||-1),y=Math.sin(t.aim),T=m>0&&u==="beam"?-.9+t.ap*1.5:null,A=T!=null?Math.cos(T)*(t.dir||-1):v,R=T!=null?-Math.sin(T):y;t.px2=pe(t.px2||0,A*2.4,8,s),t.py2=pe(t.py2||0,R*2.4,8,s),n.pupil.position.set(t.px2,t.py2,8),n.pupil.scale.setScalar(1-.35*m+.2*c);for(let C=0;C<4;C++)n["td"+C].rotation.set(.1*Math.sin(h*1.3+C),0,.12*Math.sin(h*1.1+C*1.7)-x*.3*(t.dir||-1)),n["td"+C+"b"].rotation.z=.2*Math.sin(h*1.1+C*1.7-.8);n.core.scale.setScalar(1+.03*Math.sin(h*2.4)+t.die*.15*Math.sin(h*23)),r.fx.pulse(r.byMat.core,.5+.25*Math.sin(h*2.2)+c*1.8+m*1.2+t.die*Math.abs(Math.sin(h*33))*2),ps(n,t,e),ms(n,t,e,["plate0","plate1"],s),(e.phase||0)>=1&&!e.dying&&(n.r0.rotation.x=.15*Math.sin(h*3.1)),gs(n,t,["p0","p1","p2","p3","p4","p5","r0","r1","r2","crown","orbit"],23,60)}var Dp={colossus:{build:R_,pose:C_},queen:{build:P_,pose:D_},machine:{build:L_,pose:N_}};var U_=Object.assign({},Pp,Dp);function F_(n){return(t,e)=>{let i={time:0,yaw:-Math.PI,dir:-1,sT:0};return{st:i,update(s,r,o){s=s||{},r=r||{};let a=Cp(i,s,r,o||0,t);n.pose(t.bones,i,s,r,a,t),t.fx.apply(i.flash,i.frost)}}}}var io={};for(let[n,t]of Object.entries(U_))io[n]={build:t.build,animator:F_(t)};var qu=["gem","pu_weapon","pu_energy","pu_life","pu_line","pu_bomb"],O_={pu_weapon:"#ffd23f",pu_energy:"#54e36b",pu_life:"#ff5d7a",pu_line:"#67ffd4",pu_bomb:"#a9eeff"},Ui=(n,t,e,i,s,r)=>je(n,[t,e,i],s,r);function k_(n){let t=[],e=(i,s=1.1)=>_.ext(i,s,.18,{bevelSeg:1});if(n==="pu_energy")t.push(e([[.8,3.6],[-2,-.2],[-.2,-.2],[-1,-3.6],[2.1,.7],[.3,.7],[1.5,3.6]]));else if(n==="pu_life"){let i=[];for(let s=0;s<18;s++){let r=s/18*Ot;i.push([.19*16*Math.pow(Math.sin(r),3),.19*(13*Math.cos(r)-5*Math.cos(2*r)-2*Math.cos(3*r)-Math.cos(4*r))+.4])}t.push(e(i))}else if(n==="pu_weapon")for(let i of[-2.2,.4])t.push(e([[-2.6,i],[0,i+2.4],[2.6,i],[2.6,i+1.2],[0,i+3.6],[-2.6,i+1.2]]));else if(n==="pu_line")t.push(_.box(1,5.2,1)),t.push(e([[-1.8,2.2],[1.8,2.2],[0,4.1]]),e([[-1.8,-2.2],[0,-4.1],[1.8,-2.2]]));else if(n==="pu_bomb")for(let i=0;i<3;i++){t.push(Ui(_.box(.8,7.2,.8),0,0,0,[0,0,i*Math.PI/3]));for(let s of[1,-1])for(let r of[2.1]){let o=i*Math.PI/3+Math.PI/2,a=Math.cos(o)*r*s,l=Math.sin(o)*r*s;t.push(Ui(_.box(.5,1.9,.6),a,l,0,[0,0,o+Math.PI/2+.7])),t.push(Ui(_.box(.5,1.9,.6),a,l,0,[0,0,o+Math.PI/2-.7]))}}return t}function Lp(n){let t=new xe(.07142857142857142);if(n==="gem"){t.bone("spin","root",0,0,0).bone("core","spin",0,0,0).bone("orbit","root",0,0,0),t.add("core","core",_.shard(2,10.5,7,11,.1),Vt("#2a7dff",3)),t.add("core","core",_.shard(1,12.5,5,12,.1),Vt("#8fd0ff",2.6)),t.add("spin","glass",_.shard(4.6,16,7,5,.12),"#2f6fe0"),t.add("spin","crystal",Ui(_.shard(1.6,4.2,5,9),0,6.6,0),"#4a8cf0"),t.add("spin","crystal",Ui(_.shard(1.4,3.6,5,13),0,-6.6,0),"#2a5ec8");for(let s=0;s<3;s++){let r=s/3*Ot;t.add("orbit","crystal",Ui(_.shard(.7,2.6,5,20+s),Math.cos(r)*6.6,(s-1)*2.4,Math.sin(r)*6.6,[.3,r,.4]),"#8fd8ff")}return t.build()}let e=O_[n];t.bone("spin","root",0,0,0).bone("icon","spin",0,0,0);let i=[[.001,0],[4.9,0],[5.3,.4],[5.3,1.3],[4.7,1.8],[3.6,2],[1.4,2.5],[.001,2.6]];for(let s of[1,-1]){let r=_.lathe(i,12);t.add("spin","metal",Ui(r,0,s*5.2,0,s<0?[Math.PI,0,0]:null),"#8a919b"),t.add("spin","metal",Ui(_.torus(5.05,.42,4,16),0,s*5.55,0,[Math.PI/2,0,0]),e),t.add("spin","metal",Ui(_.cyl(1.1,1.3,.8,6),0,s*7.8,0),"#3a3e45")}for(let s=0;s<4;s++){let r=s*Math.PI/2+Math.PI/4;t.add("spin","metal",Ui(_.box(.7,10.6,.7),Math.cos(r)*4.75,0,Math.sin(r)*4.75),"#5a606a")}t.add("spin","glass",_.cyl(4.4,4.4,10.4,14,!0),e);for(let s of k_(n))t.add("icon","core",s,Vt(e,4.2));return t.build()}function Np(n,t){let e=n.bones,i={a:Math.random()*Ot,time:Math.random()*3},s=n.byMat.core;function r(o,a,l){l=Math.min(l,.05),i.time+=l,t==="gem"?(i.a+=l*1.9,e.spin.rotation.set(.18*Math.sin(i.time*1.3),i.a,.12),e.orbit.rotation.set(0,-i.a*1.6,.25),e.core.scale.setScalar(1+.08*Math.sin(i.time*5)),n.fx.pulse(s,.85+.3*(.5+.5*Math.sin(i.time*5)))):(i.a+=l*1.4,e.spin.rotation.set(.1*Math.sin(i.time*1.1),i.a,.08*Math.sin(i.time*.9)),e.icon.rotation.set(0,-i.a,0),n.fx.pulse(s,.8+.35*(.5+.5*Math.sin(i.time*4)))),n.fx.apply(0,0)}return{update:r}}function Up(){let n=new xe(.1);n.bone("disc","root",0,3.5,0).bone("led","disc",0,6.6,0),n.add("disc","metal",_.lathe([[.001,3.5],[3.3,3.5],[3.7,4],[3.6,4.7],[3,5],[.001,5]],16),"#3a3e45"),n.add("disc","paint",_.lathe([[.001,4.95],[2.9,4.95],[2.6,5.6],[1.6,6.1],[.001,6.2]],16),"#56677a"),n.add("disc","paint",je(_.torus(3.45,.25,4,20),[0,4.4,0],[Math.PI/2,0,0]),"#c35f28");for(let t=0;t<4;t++){let e=t*Math.PI/2+.4;n.add("disc","metal",je(_.box(1.1,.5,.6,.12),[Math.cos(e)*3.6,3.8,Math.sin(e)*3.6],[0,-e,0]),"#9aa3ad")}return n.add("disc","metal",je(_.cyl(.65,.75,.5,8),[0,6.25,0]),"#1c1e22"),n.add("led","core",je(_.sph(.55,8,6),[0,6.65,0]),Vt("#ff3b30",5)),n.build()}function Fp(n){let t=n.bones,e={time:0,spin:Math.random()*Ot},i=n.byMat.core;function s(r,o,a){a=Math.min(a,.05),e.time+=a,r&&r.vy&&(e.spin+=a*4),t.disc.rotation.set(0,e.spin,0);let c=r&&r.life!=null&&r.life<1.2?9:3,h=e.time*c%1<.35;n.fx.pulse(i,h?1.3:.08),t.led.scale.setScalar(h?1.15:.9),n.fx.apply(0,0)}return{update:s}}var B_=Object.keys(to),z_=Object.keys(io);function Op(n={}){let t=n.quality||"high",e=t==="low"?.6:t==="ultra"?1.25:1,i=cp(t,n.renderer||null),s=new Map,r=(l,c)=>{let h=s.get(l);return h||(op(e),h=c(),s.set(l,h)),h},o=(l,c,h={})=>{let u=new Xe;u.add(l.group);let f=!0;return Object.assign({root:u,update:c.update,dispose(){f&&(f=!1,u.remove(l.group),ap(l))},_inst:l,_anim:c},h)},a={quality:t,hero(){let l=Qs(r("hero",mp),i),c=gp(l,i),h=o(l,c);return h.muzzle=c.muzzle,h.getMuzzle=(u=new O)=>(h.root.updateWorldMatrix(!0,!1),u.copy(c.muzzle).applyMatrix4(h.root.matrixWorld)),h},fighter(){let l=Qs(r("fighter",xp),i);return o(l,vp(l))},enemy(l){let c=Rp(l),h=to[c],u=Qs(r("enemy:"+c,h.build),i),f=h.animator(u,l);return o(u,f,{skin:c})},boss(l){let c=io[l.key]||io.warden,h=Qs(r("boss:"+(io[l.key]?l.key:"warden"),c.build),i);return o(h,c.animator(h,l))},pickup(l){let c=qu.includes(l)?l:"gem",h=Qs(r("pickup:"+c,()=>Lp(c)),i,{shadow:!0});return o(h,Np(h,c))},mine(){let l=Qs(r("mine",Up),i);return o(l,Fp(l))},warm(l,c,h){let u=new Xe;u.name="actor-warm";let f=[a.hero(),a.fighter(),a.mine()];for(let d of B_)f.push(a.enemy({skin:d,type:to[d].type}));for(let d of z_)f.push(a.boss({key:d}));for(let d of qu)f.push(a.pickup(d));if(f.forEach((d,g)=>{d.root.position.set(g%8*40,-Math.floor(g/8)*40,0),u.add(d.root)}),c&&l&&h){c.add(u);try{l.compile(c,h)}finally{c.remove(u)}}for(let d of f)d.dispose();return f.length},stats(){let l=0;for(let[c,h]of s)l+=h.tris;return{templates:s.size,tris:l}},dispose(){for(let l of s.values())for(let c of l.meshes)c.geometry.dispose();s.clear(),i.dispose()},_mats:i,_cache:s};return a}var H_=window.TData,V_=window.TRender,kp=new URLSearchParams(location.search),mi=n=>new It(n),_s=oa.damp,Yu=oa.clamp;function G_(n){let t=kp.get("q");if(["ultra","high","low"].includes(t))return t;try{let i=localStorage.getItem("shard.quality");if(["ultra","high","low"].includes(i))return i}catch{}if(matchMedia("(pointer: coarse)").matches||/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent))return"low";try{let i=n.getContext(),s=i.getExtension("WEBGL_debug_renderer_info"),r=s?i.getParameter(s.UNMASKED_RENDERER_WEBGL):"";if(/RTX|RX ?[67]\d{3}|RX ?9\d{3}|Radeon Pro W|Arc\(TM\) A7|Apple M\d (Pro|Max|Ultra)/i.test(r))return"ultra"}catch{}return"high"}function W_(n){let t=Math.max(640,Math.min(1100,360*n));return[t,t/n]}function X_(n){let t=n.parentElement,e=document.createElement("canvas");e.id="gl",e.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block",t.insertBefore(e,n);let i;try{if(i=new Cc({canvas:e,antialias:!1,alpha:!1,powerPreference:"high-performance",stencil:!1}),!i.capabilities.isWebGL2)throw Error("WebGL2 required")}catch(st){return console.warn("WebGL2 unavailable, using the 2D renderer",st),e.remove(),V_.createRenderer(n)}let s=G_(i);i.setPixelRatio(1),i.outputColorSpace=dn,i.toneMapping=Ur,i.toneMappingExposure=1.05,i.shadowMap.enabled=!0,i.shadowMap.type=Al,i.info.autoReset=!1;let r=n.getContext("2d"),o=new Er,a=new En(30,16/9,8,14e3),l=new Zo(16777215,2105376,.8);o.add(l);let c=new Nr(16777215,3);c.castShadow=!0,o.add(c,c.target);let h=new Nr(8965375,1.1);o.add(h,h.target);let u=new Vr(i),f=null,d=Xf(o,s),g=Zf(i,o,a,s),x=Jf(r),m=Op({quality:s,renderer:i}),p={backend:"Shard Assault 3D",quality:s,frames:0,drawCalls:0,triangles:0,frameMs:0,lights:0,resolution:1},M=null,v=Ic[1],y=null,T=null,A=null,R=null,C=null,S=null,b=new Map,D=new Map,N=new Map,F=null,B=null,G=0,X=0,j=-1,Z=0,J=0,ot=0,ft=0,Lt=0,Ut=0,zt=!1,Ft=0,Q=new WeakMap,ht=new O,wt=16/9,_t=640,At=360,se=0,_e=0,I=0,H=0,Y=1,W=!0,tt=!1,et={x:0,y:0,yaw:0,pitch:.07,fov:30,lead:0,init:!1},it=!1,at=0,nt=null,rt=0;window.__modernGraphics={stats:p,get scene(){return o},get camera(){return a},get renderer(){return i},get hero(){return R},kit:m,fx:d};function P(){let st=window.devicePixelRatio||1;return s==="ultra"?Math.min(st,2):s==="high"?Math.min(st,1.5):Math.min(st,2)}function w(){let st=e.getBoundingClientRect(),dt=Math.max(2,st.width),lt=Math.max(2,st.height);wt=dt/lt;let Zt=P()*Y,ge=Math.round(dt*Zt),ee=Math.round(lt*Zt);(ge!==I||ee!==H)&&(I=ge,H=ee,i.setSize(I,H,!1),g.setSize(I,H)),[_t,At]=W_(wt),a.aspect=wt,p.resolution=+Zt.toFixed(2)}function U(st){let dt=new Er,lt=new qn(50,32,16),Zt=[],ge=lt.attributes.position,ee=mi(st.sky.zenith),kt=mi(st.sky.mid),Te=mi(st.sky.horizon),$t=mi(st.hemi.ground);for(let Ke=0;Ke<ge.count;Ke++){let He=ge.getY(Ke)/50,We=He>0?Te.clone().lerp(kt,Math.min(1,He*3)).lerp(ee,Math.max(0,He*1.5-.5)):Te.clone().lerp($t,Math.min(1,-He*4));Zt.push(We.r,We.g,We.b)}lt.setAttribute("color",new Kt(Zt,3)),dt.add(new jt(lt,new sn({vertexColors:!0,side:pn})));let qt=new O(...st.sun.dir).normalize().multiplyScalar(40),Rt=new jt(new qn(6,12,8),new sn({color:mi(st.sun.color).multiplyScalar(18)}));Rt.position.copy(qt),dt.add(Rt);let ae=new jt(new cn(60,20),new sn({color:mi(st.accent).multiplyScalar(1.4),side:Je}));ae.position.set(0,-10,-45),dt.add(ae),f&&f.dispose(),f=u.fromScene(dt,.03),o.environment=f.texture,o.environmentIntensity=st.enclosed?.45:.6,dt.traverse(Ke=>{Ke.geometry&&Ke.geometry.dispose(),Ke.material&&Ke.material.dispose()})}function q(){for(let st of b.values())o.remove(st.root),st.dispose&&st.dispose();b.clear();for(let st of D.values())o.remove(st.root),st.dispose&&st.dispose();D.clear();for(let st of N.values())o.remove(st.root),st.dispose&&st.dispose();N.clear(),F&&(o.remove(F.root),F.dispose&&F.dispose(),F=null,B=null)}function k(st){let dt=performance.now();y&&(o.remove(y.group),y.dispose()),T&&(o.remove(T.group,T.sky),T.dispose()),A&&(o.remove(A.group),A.dispose()),q(),d.clear(),M=st,v=zf(st),y=Gf(st,v,s),o.add(y.group),T=Wf(st,v,y,s),o.add(T.group,T.sky),A=z(st,v,y),o.add(A.group),R||(R=m.hero(),o.add(R.root),C=m.fighter(),o.add(C.root),S=xt(),o.add(S),R.root.traverse(Zt=>{Zt.isMesh&&(Zt.castShadow=!0)}),C.root.traverse(Zt=>{Zt.isMesh&&(Zt.castShadow=!0)})),l.color.set(v.hemi.sky),l.groundColor.set(v.hemi.ground),l.intensity=v.hemi.intensity,c.color.set(v.sun.color),c.intensity=v.sun.intensity,h.color.set(v.accent),h.intensity=v.enclosed?1.3:.9;let lt=s==="ultra"?4096:s==="high"?2048:1024;c.shadow.mapSize.set(lt,lt),c.shadow.map&&(c.shadow.map.dispose(),c.shadow.map=null),c.shadow.bias=-4e-4,c.shadow.normalBias=.6,c.shadow.radius=3,o.fog=new Co(mi(v.fog.color),v.fog.near,v.fog.far),o.background=mi(v.fog.color),i.toneMappingExposure=v.exposure,g.setGrade(v.grade),g.bloom.strength=v.bloom,g.bloom.threshold=.92,g.bloom.radius=.55,U(v),et.init=!1,X=0,j=-1,p.levelBuildMs=Math.round(performance.now()-dt),p.world=st.world;try{m.warm&&m.warm(i,o,a),i.compile(o,a)}catch{}}function z(st,dt,lt){let Zt=new Xe,ge=[],ee=new qe({color:"#6d7378",metalness:.85,roughness:.32});ge.push(ee);let kt=null,Te=null;if(st.checkpoint){let $t=st.checkpoint,qt=lt.sample($t.x+10),Rt=new Xe;Rt.position.set($t.x+10,qt,-18);let ae=new jt(new Pn(1.4,2.2,46,10),ee);ae.position.y=23,Rt.add(ae);let Ke=new jt(new Pn(7,9,5,12),ee);Ke.position.y=2.5,Rt.add(Ke);let He=new jt(new Yi(4.5,0),wi("#ff5a6a",3));He.position.y=50,Rt.add(He);let We=new jt(new Fs(8,.6,6,32),new sn({color:mi("#ff5a6a").multiplyScalar(3),toneMapped:!1}));We.position.y=50,We.rotation.x=Math.PI/2,Rt.add(We),Rt.traverse($n=>{$n.isMesh&&($n.castShadow=!0)}),Zt.add(Rt),kt={g:Rt,lamp:He,ring:We,on:!1}}if(st.exit){let $t=st.exit,qt=new Xe;qt.position.set($t.x+$t.w/2,-($t.y+$t.h),-6);for(let He of[-1,1]){let We=new jt(new Fe(6,$t.h+12,16),ee);We.position.set(He*($t.w/2+4),($t.h+12)/2,0),qt.add(We);let $n=new jt(new Fe(1.2,$t.h,1),new sn({color:mi(dt.accent).multiplyScalar(3),toneMapped:!1}));$n.position.set(He*($t.w/2+1),$t.h/2+4,8.5),qt.add($n)}let Rt=new jt(new Fe($t.w+20,6,18),ee);Rt.position.y=$t.h+12,qt.add(Rt);let ae={uTime:{value:0},uOpen:{value:0},uColor:{value:mi(dt.accent)}},Ke=new jt(new cn($t.w+2,$t.h+8),new me({uniforms:ae,transparent:!0,depthWrite:!1,blending:wn,side:Je,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uTime,uOpen;uniform vec3 uColor;void main(){vec2 c=vUv-.5;float r=length(c*vec2(1.,.7));float a=atan(c.y,c.x);
          float sw=sin(a*5.+r*30.-uTime*6.)*.5+.5;float lock=step(.5,fract(vUv.y*14.+uTime*.6))*.25;vec3 open=uColor*(sw*.9+.3)*smoothstep(.55,.1,r)*1.8;vec3 shut=vec3(1.,.15,.2)*(lock+.08)*(1.-smoothstep(.45,.5,abs(c.x)));
          gl_FragColor=vec4(mix(shut,open,uOpen),1.);}`}));Ke.position.set(0,$t.h/2+4,2),qt.add(Ke),qt.traverse(He=>{He.isMesh&&He.material===ee&&(He.castShadow=!0)}),Zt.add(qt),Te={g:qt,fu:ae}}return{group:Zt,beacon:kt,gate:Te,update($t,qt){if(kt){if(!!$t.checkpoint&&!kt.on){kt.on=!0;let ae=mi(dt.accent);kt.lamp.material.emissive.copy(ae),kt.ring.material.color.copy(ae).multiplyScalar(3),d.ring(st.checkpoint.x+10,-(kt.g.position.y+50),dt.accent,60,.6)}kt.lamp.rotation.y=qt*2,kt.ring.scale.setScalar(1+Math.sin(qt*4)*.12),d.light(kt.g.position.x,kt.g.position.y+50,-10,kt.on?dt.accent:"#ff5a6a",.9,90)}Te&&(Te.fu.uTime.value=qt,Te.fu.uOpen.value=_s(Te.fu.uOpen.value,$t.bossDead?1:0,3,1/60),$t.bossDead&&d.light(Te.g.position.x,Te.g.position.y+30,10,dt.accent,1.6,140))},dispose(){Zt.traverse($t=>{$t.geometry&&$t.geometry.dispose(),$t.material&&$t.material!==ee&&$t.material.dispose()}),ee.dispose()}}}function xt(){let st=new jt(new qn(1,32,16),new me({uniforms:{uTime:{value:0},uA:{value:0}},transparent:!0,depthWrite:!1,blending:wn,vertexShader:"varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);vP=position;gl_Position=projectionMatrix*mv;}",fragmentShader:`varying vec3 vN;varying vec3 vV;varying vec3 vP;uniform float uTime,uA;void main(){float f=pow(1.-abs(dot(vN,vV)),2.5);float hex=step(.82,fract((vP.x+vP.y*.58)*6.)+fract(vP.y*6.-uTime));
        gl_FragColor=vec4(vec3(.35,.85,1.)*(f*1.6+hex*.25)*uA,1.);}`}));return st.visible=!1,st}function vt(st,dt){for(let lt of st)switch(lt.type){case"explosion":{let Zt=1,ge=dt.boss;if(ge&&(ge.dying||!ge.alive)&&lt.x>=ge.x-20&&lt.x<=ge.x+ge.w+20)Zt=ge.alive?1.5:2.6;else{let ee=dt.enemies.find(kt=>!kt.alive&&Math.abs(kt.x+kt.w/2-lt.x)<4&&Math.abs(kt.y+kt.h/2-lt.y)<4);ee&&(ee.type==="drifter"||ee.type==="hugger"||ee.type==="egg")&&(Zt=.75)}d.explosion(lt.x,lt.y,Zt,v);break}case"spark":d.sparks(lt.x,lt.y,"#ffe0a0",6,140,{life:.6}),d.glowBall(lt.x,lt.y,"#ffc070",6,.08);break;case"muzzle":{let Zt=lt.color||"#ffd23f";M.type!=="shmup"&&R&&R.getMuzzle&&R.root.visible&&(R.getMuzzle(ht),lt={...lt,x:ht.x,y:-ht.y}),d.glowBall(lt.x,lt.y,Zt,9,.06,6,2.2),d.sparks(lt.x,lt.y,Zt,3,120,{life:.4}),d.flashLight(lt.x,lt.y,Zt,2.4,110,.07),Math.random()<.35&&d.puff(lt.x,lt.y,"#8a8a90",1,4,{life:.5,speed:20,alpha:.25});break}case"pickup":d.sparks(lt.x+8,lt.y+8,lt.color||"#9be6ff",18,150,{grav:-60,life:1.4}),d.ring(lt.x+8,lt.y+8,lt.color||"#9be6ff",22,.35),d.flashLight(lt.x+8,lt.y+8,lt.color||"#9be6ff",2.5,90,.25);break;case"splash":for(let Zt=0;Zt<22;Zt++)d.glow.emit(lt.x+(Math.random()-.5)*10,-lt.y,(Math.random()-.5)*30,(Math.random()-.5)*120,90+Math.random()*170,(Math.random()-.5)*60,.55,.85,1,.9,.6,1.6,.6,-700,.8,.012,0);d.ring(lt.x,lt.y,"#9fe8ff",26,.5,{flat:!0,z:0});break;case"land":d.puff(lt.x,lt.y,v.top.color,5,6,{life:.7,speed:55,rise:8,alpha:.45,grav:-10});break;case"bubble":d.glow.emit(lt.x,-lt.y,2,(Math.random()-.5)*10,30,0,.4,.8,.9,.7,1.6,1.4,1.8,40,.5,0,0);break;case"updraft":d.glow.emit(lt.x+(Math.random()-.5)*20,-lt.y,(Math.random()-.5)*30,0,160,0,.5,.8,1,.6,.6,1.2,.4,0,.5,.02,0);break;case"hurt":Z=1,ft=Math.max(ft,.012),d.shakeImpulse(.35),d.sparks(dt.player.x+7,dt.player.y+15,"#ff8a8a",10,140);break;case"flash":J=1,d.ring(dt.player.x+7,dt.player.y+15,"#a9eeff",260,.9,{start:4}),d.ring(dt.player.x+7,dt.player.y+15,"#ffffff",140,.5,{start:2});for(let Zt=0;Zt<70;Zt++){let ge=Math.random()*6.28,ee=80+Math.random()*260;d.glow.emit(dt.player.x+7,-(dt.player.y+15),(Math.random()-.5)*40,Math.cos(ge)*ee,Math.sin(ge)*ee,(Math.random()-.5)*90,.6,.9,1.2,1,1.2,2.2,.5,-80,1.8,.01,3)}break;case"line":d.shockwall(lt.x,_e,At);break;case"banner":x.setBanner(lt.text,lt.sub),lt.text==="WARNING"&&(rt=1.8);break}}function yt(st,dt){let lt=st.player,Zt=M.cols*Ei,ge=M.rows*Ei,ee=Math.max(0,Math.min(Math.max(0,Zt-_t),st.cam.x-(_t-640)/2)),kt=Math.max(0,Math.min(Math.max(0,ge-At),st.cam.y-(At-360)/2)),Te=ee+_t/2,$t=kt+At/2,qt=M.type==="shmup",Rt=st.boss&&st.boss.alive&&st.boss.awake,ae=qt?0:Yu(lt.vx*.12,-26,26)*(lt.dead?0:1);et.lead=_s(et.lead,ae,1.6,dt),Te=Yu(Te+et.lead,_t/2,Math.max(_t/2,Zt-_t/2));let Ke=qt?-.06:Yu(-lt.vx/205*.045,-.05,.05)+0,He=qt||Rt?.05:.075;et.init||(et.x=Te,et.y=$t,et.yaw=-.5,et.pitch=.22,et.fov=22,et.init=!0);let We=Math.max(0,1-X/2.4),$n=We*We*(3-2*We);et.x=_s(et.x,Te,8,dt),et.y=_s(et.y,$t,8,dt),et.yaw=_s(et.yaw,Ke,We>0?2.2:1.8,dt),et.pitch=_s(et.pitch,He,2.2,dt),et.fov=_s(et.fov,Rt?31.5:30,2,dt);let nr=et.yaw,ir=et.pitch,so=1+$n*-.35;if(rt>0&&st.boss){rt-=dt;let re=Math.sin(Math.min(1,rt/1.8)*Math.PI)*.5;Te+=(st.boss.x+st.boss.w/2-Te)*0,nr+=-.08*re*Math.sign(st.boss.x+st.boss.w/2-et.x),ir-=.03*re,so*=1-.08*re}(st.won||st.gameOver)&&(nr+=Math.sin(X*.25)*.12,so*=.92);let Ca=et.fov;a.fov=Ca,a.updateProjectionMatrix();let L=At/2/Math.tan(oa.degToRad(Ca/2))*so,$=d.shake+Math.min(1.5,st.shake*.12),ct=(Math.sin(G*71)+Math.sin(G*113)*.5)*$*2.2,ut=(Math.cos(G*83)+Math.cos(G*127)*.5)*$*2.2,K=new O(et.x+ct,-et.y+ut,0);We>0&&(K.x=et.x*(1-$n)+(lt.x+7)*$n,K.y=-(et.y*(1-$n)+(lt.y+15)*$n)),a.position.set(K.x+Math.sin(nr)*Math.cos(ir)*L,K.y+Math.sin(ir)*L,Math.cos(nr)*Math.cos(ir)*L),a.lookAt(K),a.rotateZ($*.004*Math.sin(G*57)),se=et.x-_t/2,_e=et.y-At/2;let Ct=new O(...v.sun.dir).normalize(),Bt=Math.max(_t,At)*.75+120,Xt=c.shadow.camera;Xt.left=-Bt,Xt.right=Bt,Xt.top=Bt*.8,Xt.bottom=-Bt*.8,Xt.near=10,Xt.far=2400,Xt.updateProjectionMatrix();let Gt=Bt*2/c.shadow.mapSize.x,he=Math.round(et.x/Gt)*Gt,de=Math.round(-et.y/Gt)*Gt;c.target.position.set(he,de,-60),c.position.set(he+Ct.x*1e3,de+Ct.y*1e3,-60+Ct.z*1e3),h.target.position.set(et.x,-et.y,0),h.position.set(et.x+200,-et.y+260,-400)}function gt(st,dt){return st>se-dt&&st<se+_t+dt}function Mt(st,dt){let lt=st.player,Zt=M.type==="shmup",ge=lt.invuln>0&&!lt.dead?Math.floor(G*18)%3!==0:!0;R.root.visible=!Zt&&!lt.dead&&ge,C.root.visible=Zt&&!lt.dead&&ge,Zt?(C.root.position.set(lt.x+lt.w/2,-(lt.y+lt.h/2),0),C.update(lt,st,dt,G)):(R.root.position.set(lt.x+lt.w/2,-(lt.y+lt.h),0),R.update(lt,st,dt,G)),S.visible=!lt.dead&&lt.invuln>0,S.visible&&(S.position.set(lt.x+lt.w/2,-(lt.y+lt.h/2),0),S.scale.setScalar(Zt?20:lt.morph?13:21),S.material.uniforms.uTime.value=G,S.material.uniforms.uA.value=Math.min(1,lt.invuln*2)*(.6+.4*Math.sin(G*20))),lt.dead&&!zt&&(d.explosion(lt.x+lt.w/2,lt.y+lt.h/2,1.6,v),d.ring(lt.x+lt.w/2,lt.y+lt.h/2,v.accent,90,.6),d.chunks(lt.x+lt.w/2,lt.y+lt.h/2,"#9aa6b0",12,220,1.8,.3),d.shakeImpulse(.6),ft=.02),zt=lt.dead,lt.dead||(d.light(lt.x+lt.w/2,-(lt.y+10),26,Zt?"#9fd8ff":v.accent,.35,90),!Zt&&lt.onGround&&Math.abs(lt.vx)>120&&Math.random()<dt*7&&d.puff(lt.x+lt.w/2-Math.sign(lt.vx)*4,lt.y+lt.h,v.top.color,1,4,{life:.6,speed:20,rise:10,alpha:.35}),lt.morph&&lt.onGround&&Math.abs(lt.vx)>60&&Math.random()<dt*25&&d.sparks(lt.x+lt.w/2-Math.sign(lt.vx)*7,lt.y+lt.h-1,"#ffcb78",2,60,{life:.6}),Zt&&Math.random()<dt*60&&d.glow.emit(lt.x-2,-(lt.y+lt.h/2),0,-160-Math.random()*80,(Math.random()-.5)*20,0,.6,1,1.8,1,.18,3.2,.6,0,1,0,0)),lt.inWater&&Math.random()<dt*3&&d.glow.emit(lt.x+lt.w/2,-(lt.y+6),3,(Math.random()-.5)*8,25,0,.4,.8,.9,.6,1.4,1.2,1.6,35,.5,0,0);let ee=new Set;for(let Rt of st.enemies){if(!Rt.alive||!gt(Rt.x,120))continue;ee.add(Rt);let ae=b.get(Rt);ae||(ae=m.enemy(Rt),ae.root.traverse(We=>{We.isMesh&&(We.castShadow=!0)}),o.add(ae.root),b.set(Rt,ae)),ae.root.position.set(Rt.x+Rt.w/2,-(Rt.y+Rt.h),0),ae.update(Rt,st,dt,G);let Ke=Rt.hitFlash||0,He=Q.get(Rt)||0;Ke>He+.01&&dt>0&&(d.sparks(Rt.x+Rt.w/2,Rt.y+Rt.h/2,"#ffd8a0",5,150,{life:.5}),d.glowBall(Rt.x+Rt.w/2,Rt.y+Rt.h/2,"#ffe2b0",7,.06,8,1.6)),Q.set(Rt,Ke),st.freeze>0&&Math.random()<dt*3&&d.glow.emit(Rt.x+Math.random()*Rt.w,-(Rt.y+Math.random()*Rt.h),6,0,8,0,.5,.8,1,.8,.8,1.6,.4,0,.5,0,0)}for(let[Rt,ae]of b)ee.has(Rt)||(o.remove(ae.root),ae.dispose&&ae.dispose(),b.delete(Rt));let kt=new Set,Te=0;for(let Rt of st.pickups){if(Rt.taken||!gt(Rt.x,60))continue;kt.add(Rt);let ae=D.get(Rt);ae||(ae=m.pickup(Rt.type),o.add(ae.root),D.set(Rt,ae)),ae.root.position.set(Rt.x+Rt.w/2,-(Rt.y+Rt.h/2),0),ae.update(Rt,st,dt,G),Te<(s==="low"?1:3)&&Math.abs(Rt.x-lt.x)<200&&(d.light(Rt.x+8,-(Rt.y+8),14,Rt.type==="gem"?"#4ce4ff":"#ffd23f",.45,60),Te++)}for(let[Rt,ae]of D)kt.has(Rt)||(o.remove(ae.root),ae.dispose&&ae.dispose(),D.delete(Rt));let $t=new Set(st.mines);for(let Rt of st.mines){let ae=N.get(Rt);ae||(ae=m.mine(),o.add(ae.root),N.set(Rt,ae)),ae.root.position.set(Rt.x,-Rt.y,0),ae.update(Rt,st,dt,G),Math.floor(G*6)%2===0&&d.light(Rt.x,-Rt.y+3,8,"#ff3030",.25,30)}for(let[Rt,ae]of N)$t.has(Rt)||(o.remove(ae.root),ae.dispose&&ae.dispose(),N.delete(Rt));let qt=st.boss;if(qt&&qt.alive){if((!F||B!==qt)&&(F&&(o.remove(F.root),F.dispose&&F.dispose()),F=m.boss(qt),B=qt,F.root.traverse(Rt=>{Rt.isMesh&&(Rt.castShadow=!0)}),o.add(F.root)),F.root.visible=!0,F.root.position.set(qt.x+qt.w/2,-(qt.y+qt.h),0),F.update(qt,st,dt,G),qt.open&&d.light(qt.x+qt.w/2,-(qt.y+qt.h/2),40,"#ffd27a",2.2,180),(qt.hitFlash||0)>Ft+.01&&dt>0){let Rt=qt.x+qt.w*(qt.open?.5:.15+Math.random()*.7),ae=qt.y+qt.h*(qt.open?.5:.2+Math.random()*.6);d.sparks(Rt,ae,qt.open?"#fff0a0":"#c8d8ff",qt.open?8:5,qt.open?220:170,{life:.5})}Ft=qt.hitFlash||0,qt.dying&&Math.random()<dt*14&&d.sparks(qt.x+Math.random()*qt.w,qt.y+Math.random()*qt.h,"#ffc070",6,200)}else F&&(o.remove(F.root),F.dispose&&F.dispose(),F=null,B=null)}function Nt(st,dt){let lt=v.ambient,Zt=_t*At/230400,ge=se-60,ee=_e,kt=Math.random,Te=(M.windX||0)*(st.windPhase||0);if(lt==="dust"){for(let $t=0;$t<Zt*dt*30;$t++)d.smoke.emit(ge+kt()*(_t+120),-(ee+kt()*At),-60+kt()*90,60+Te*.8+kt()*40,(kt()-.5)*14,0,.85,.68,.5,.18,3,1.4,2.4,0,.2,0,0);Math.abs(Te)>60&&kt()<dt*4&&d.smoke.emit(ge+kt()*_t,-(ee+At*.6+kt()*At*.4),-40+kt()*60,Te*1.6,10,0,.8,.6,.45,.12,2.2,18,46,0,.4,0,0)}else if(lt==="motes")for(let $t=0;$t<Zt*dt*22;$t++)d.glow.emit(ge+kt()*(_t+120),-(ee+kt()*At),-120+kt()*150,(kt()-.5)*8,6+kt()*8,0,.25,.9,.75,.8,4,1.2,.4,0,.1,0,0);else if(lt==="speed")for(let $t=0;$t<Zt*dt*40;$t++)d.glow.emit(se+_t+20,-(ee+kt()*At),-200+kt()*200,-900-kt()*500,0,0,.35,.35,.6,.6,1.4,1.5,1.5,0,.05,.03,0);else if(lt==="embers"){for(let $t=0;$t<Zt*dt*26;$t++)d.glow.emit(ge+kt()*(_t+120),-(ee+At+10),-150+kt()*170,(kt()-.5)*30,40+kt()*60,0,1.8,.6,.15,1,3.5,1.1,.3,8,.3,.01,0);kt()<dt*8&&d.smoke.emit(ge+kt()*_t,-(ee+At),-200+kt()*80,10,30,0,.25,.22,.2,.4,6,40,120,4,.2,0,0)}else if(lt==="spores")for(let $t=0;$t<Zt*dt*16;$t++){let qt=kt()<.4;d.glow.emit(ge+kt()*(_t+120),-(ee+kt()*At),-150+kt()*180,(kt()-.5)*14,(kt()-.5)*14,0,qt?.7:.9,qt?1.6:.5,qt?.4:1.5,.9,5,1.6,.3,0,.1,0,0)}}function oe(){if(y.crateIndex.size){for(let st of[...y.crateIndex.keys()])if(M.tiles[st]!==6){let dt=y.removeCrate(st);dt&&(d.chunks(dt.x,-dt.y,M.type==="shmup"?"#3a3f52":"#8a6a44",14,200,2.6,.2),d.sparks(dt.x,-dt.y,v.accent,14,200))}}}function Jt(st,dt){let lt=performance.now();it=!1,w(),(!M||st.level!==M)&&k(st.level),dt=Math.min(.05,Math.max(0,dt)),G+=dt,X+=dt,st.frame!==j&&(vt(st.events,st),j=st.frame,st.events.length=0),oe(),yt(st,dt),Mt(st,dt);let Zt=null;if(M.type!=="shmup"&&st.player.beamActive&&R.getMuzzle&&(R.getMuzzle(ht),Zt={x:ht.x,y:-ht.y}),d.drawShots(st,se,_t),d.drawBeam(st.player,G,v,Zt),d.moveWalls(st.floats),dt>0){Nt(st,dt);for(let ee of y.falls)ee.x>se-60&&ee.x<se+_t+60&&(Math.random()<dt*14&&d.puff(ee.x+(Math.random()-.5)*20,-(ee.bot+40),"#e8f6ff",1,10,{life:1.6,speed:30,rise:26,alpha:.3,z:-40}),Math.random()<dt*30&&d.glow.emit(ee.x+(Math.random()-.5)*20,ee.bot+40,-40,(Math.random()-.5)*60,40+Math.random()*60,(Math.random()-.5)*30,.5,.7,.8,.7,.7,1.2,.5,-300,.6,.01,0))}A.update(st,G),y.update(G,dt,st),T.update(G,a);for(let ee of y.fg){let kt=Math.abs(ee.position.x-(st.player.x+7));ee.visible=kt>60||ee.position.x<se-200||ee.position.x>se+_t+200}d.update(dt,G,M,{x:et.x},(ee,kt)=>{let Te=Math.floor(ee/Ei),$t=Math.floor(kt/Ei);return Te<0||Te>=M.cols?!1:$t>=M.rows?!0:$t<0?!1:M.tiles[$t*M.cols+Te]===1}),Z=Math.max(0,Z-dt*2.2),J=Math.max(0,J-dt*2.5),ft=Math.max(0,ft-dt*.04),ot=_s(ot,st.freeze>0?1:0,4,dt||.016);let ge=g.u;ge.uTime.value=G,ge.uHurt.value=Z*.8,ge.uFlash.value=J*.55,ge.uFrost.value=ot,ge.uCA.value=ft+d.shake*.004,ge.uScan.value=tt?1:0,ge.uFade.value=0,Dt(),r.clearRect(0,0,960,540),x.draw(st,wt,V,G,dt,e.clientHeight),p.frames++,p.frameMs=p.frameMs*.94+(performance.now()-lt)*.06,Wt(dt)}function Dt(){i.info.reset(),W?g.render():i.render(o,a),p.drawCalls=i.info.render.calls,p.triangles=i.info.render.triangles,p.lights=d.stats().lights}let te=new O;function V(st,dt){return te.set(st,-dt,0).project(a),te.z>1?null:{x:(te.x+1)/2,y:(1-te.y)/2}}let bt=0,Pt=0;function Wt(st){if(kp.has("fixed")||st<=0)return;let dt=st*1e3;dt>19.5?(bt+=st,Pt=0):dt<15.5&&(Pt+=st,bt=Math.max(0,bt-st*.5)),bt>.8&&Y>.55?(Y=Math.max(.55,Y-.1),bt=0):Pt>4&&Y<1&&(Y=Math.min(1,Y+.05),Pt=0)}let St=null;function pt(st){if(w(),st=Math.min(.05,Math.max(0,st)),G+=st,at+=st,!it||!St||M!==St){St||(St=H_.buildLevel(0,0)),M!==St&&k(St);let Rt=null;for(let He=12;He<Math.min(St.cols-10,90);He++){let We=y.ground[He];We>-St.rows*Ei&&(!Rt||We>Rt.gy+15)&&(Rt={tx:He,gy:We})}let ae=(Rt?Rt.tx:20)*Ei+10,Ke=Rt?Rt.gy:y.ground[20];nt={x:ae-7,y:-Ke-30,w:14,h:30,vx:0,vy:0,facing:-1,onGround:!0,crouch:!1,morph:!1,weapon:"beam",weapons:{spread:3,beam:3,bounce:3},beamActive:!1,beamAngle:0,cooldown:0,invuln:0,dead:!1,energy:100,maxEnergy:100,lives:3,inWater:!1},it=!0,at=0}let dt=nt,lt={player:dt,level:St,freeze:0,enemies:[],pickups:[],pshots:[],eshots:[],mines:[],floats:[],cam:{x:dt.x-320,y:0},time:999,shake:0,boss:null,windPhase:Math.sin(at*.3),frame:-1};R.root.visible=!0,C.root.visible=!1,S.visible=!1,R.root.position.set(dt.x+7,-(dt.y+30),0),R.update(dt,lt,st,G);let Zt=.34+Math.sin(at*.11)*.1,ge=-.05+Math.sin(at*.07)*.02,ee=190+Math.sin(at*.09)*14,kt=new O(dt.x+7-62,-(dt.y-6),0);a.fov=34,a.aspect=wt,a.updateProjectionMatrix(),a.position.set(kt.x+Math.sin(Zt)*ee,kt.y+Math.sin(ge)*ee+6,Math.cos(Zt)*ee),a.lookAt(kt),se=kt.x-_t/2,_e=-kt.y-At/2,et.x=kt.x,et.y=-kt.y;let Te=new O(...v.sun.dir).normalize(),$t=c.shadow.camera;$t.left=-300,$t.right=300,$t.top=220,$t.bottom=-220,$t.near=10,$t.far=2400,$t.updateProjectionMatrix(),c.target.position.set(kt.x,kt.y,-60),c.position.set(kt.x+Te.x*1e3,kt.y+Te.y*1e3,-60+Te.z*1e3),st>0&&Nt(lt,st),d.light(dt.x+7,-(dt.y+10),20,v.accent,.5,80),y.update(G,st,lt),T.update(G,a),d.update(st,G,M,{x:kt.x},()=>!1);let qt=g.u;qt.uTime.value=G,qt.uHurt.value=0,qt.uFlash.value=0,qt.uFrost.value=0,qt.uCA.value=0,qt.uFade.value=Math.max(0,1-at*1.2),Dt(),r.clearRect(0,0,960,540)}function Yt(st){s=st>=6?"ultra":st>=3?"high":"low",p.quality=s,Y=1,I=0,w();let dt=s==="ultra"?4096:s==="high"?2048:1024;c.shadow.mapSize.x!==dt&&(c.shadow.mapSize.set(dt,dt),c.shadow.map&&(c.shadow.map.dispose(),c.shadow.map=null))}function ie(st){W=st,st||(Y=.7,I=0)}return{setLevel:k,render:Jt,renderTitle:pt,setCRT(st){tt=st},setFX:ie,setResolution:Yt,get buffer(){return e},get quality(){return s},particles:[]}}window.TRender={createRenderer:X_};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
