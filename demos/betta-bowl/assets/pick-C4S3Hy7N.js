import{t as e}from"./rolldown-runtime-DK3Fl9T5.js";import{a as t,s as n}from"./mesh-BUPESk9o.js";var r=1024,i=16,a=8192,o=4096,s=1e-5,c=[.18,.3,.06],l=2e-4,u=1e-6,d=4,f=1,p=2,m=3e38,h=4294967295,g=2e-6,_=new Float32Array(1),v=new Uint32Array(_.buffer);function y(e){let t=Math.fround(e);if(t<=e)return t;if(_[0]=t,t>0)v[0]--;else if(t===0)return-1401298464324817e-60;else v[0]++;return _[0]}function b(e){return-y(-e)}function x(e){let t=0;for(;e>d;)e=Math.ceil(e/2),t++;return t}function S(e,t,n,r,i,a){let o=new Uint32Array(n);for(let e=0;e<n;e++)o[e]=e;let s=Math.max(1,2*n),c=new Float64Array(s*3),l=new Float64Array(s*3),u=new Int32Array(s).fill(-1),f=new Int32Array(s).fill(-1),p=new Int32Array(s),m=new Int32Array(s),h=new Int32Array(s),g=1,_=0,v=0,y=0,b=Math.max(i,a),S=new Int32Array(3*b),C=new Float64Array(3*b*6),w=new Float64Array(b),T=new Int32Array(b),E=[[0,0,n,0]];for(;E.length;){let[n,s,b,D]=E.pop();h[n]=D,D>_&&(_=D);let O=1/0,k=1/0,A=1/0,j=-1/0,M=-1/0,N=-1/0,P=1/0,F=1/0,I=1/0,L=-1/0,R=-1/0,z=-1/0;for(let n=s;n<b;n++){let r=o[n],i=r*6,a=r*3;e[i]<O&&(O=e[i]),e[i+1]<k&&(k=e[i+1]),e[i+2]<A&&(A=e[i+2]),e[i+3]>j&&(j=e[i+3]),e[i+4]>M&&(M=e[i+4]),e[i+5]>N&&(N=e[i+5]);let s=t[a],c=t[a+1],l=t[a+2];s<P&&(P=s),s>L&&(L=s),c<F&&(F=c),c>R&&(R=c),l<I&&(I=l),l>z&&(z=l)}c[n*3]=O,c[n*3+1]=k,c[n*3+2]=A,l[n*3]=j,l[n*3+1]=M,l[n*3+2]=N;let B=b-s;if(B<=d){p[n]=s,m[n]=B,v++;continue}let V=B>4096?i:a,H=[L-P,R-F,z-I],U=[P,F,I],W=H.map(e=>e>1e-12?V/e:0);S.fill(0,0,3*V);for(let e=0;e<3*V;e++){let t=e*6;C[t]=C[t+1]=C[t+2]=1/0,C[t+3]=C[t+4]=C[t+5]=-1/0}let G=W[0],K=W[1],q=W[2];for(let n=s;n<b;n++){let r=o[n],i=r*6,a=r*3,s=e[i],c=e[i+1],l=e[i+2],u=e[i+3],d=e[i+4],f=e[i+5];for(let e=0;e<3;e++){let n=e===0?G:e===1?K:q;if(n===0)continue;let r=(t[a+e]-U[e])*n|0;r>=V&&(r=V-1),r+=e*V,S[r]++;let i=r*6;s<C[i]&&(C[i]=s),c<C[i+1]&&(C[i+1]=c),l<C[i+2]&&(C[i+2]=l),u>C[i+3]&&(C[i+3]=u),d>C[i+4]&&(C[i+4]=d),f>C[i+5]&&(C[i+5]=f)}}let J=-1,ee=-1,Y=1/0,X=0;for(let e=0;e<3;e++){if(W[e]===0)continue;let t=1/0,n=1/0,r=1/0,i=-1/0,a=-1/0,o=-1/0,s=0;for(let c=V-1;c>0;c--){let l=(e*V+c)*6;s+=S[e*V+c],C[l]<t&&(t=C[l]),C[l+1]<n&&(n=C[l+1]),C[l+2]<r&&(r=C[l+2]),C[l+3]>i&&(i=C[l+3]),C[l+4]>a&&(a=C[l+4]),C[l+5]>o&&(o=C[l+5]),T[c]=s;let u=i-t,d=a-n,f=o-r;w[c]=s?u*d+d*f+f*u:0}t=n=r=1/0,i=a=o=-1/0,s=0;for(let c=0;c<V-1;c++){let l=(e*V+c)*6;if(s+=S[e*V+c],C[l]<t&&(t=C[l]),C[l+1]<n&&(n=C[l+1]),C[l+2]<r&&(r=C[l+2]),C[l+3]>i&&(i=C[l+3]),C[l+4]>a&&(a=C[l+4]),C[l+5]>o&&(o=C[l+5]),s===0||T[c+1]===0)continue;let u=i-t,d=a-n,f=o-r,p=s*(u*d+d*f+f*u)+T[c+1]*w[c+1];p<Y&&(Y=p,J=e,ee=c,X=s)}}let Z;if(J>=0&&D+1+x(Math.max(X,B-X))<=r){let e=J,n=W[e],r=U[e],i=s,a=b-1;for(;i<=a;){let s=o[i],c=(t[s*3+e]-r)*n|0;c>=V&&(c=V-1),c<=ee?i++:(o[i]=o[a],o[a]=s,a--)}Z=i}else{J>=0&&y++;let e=H[0]>=H[1]&&H[0]>=H[2]?0:H[1]>=H[2]?1:2,n=Array.from(o.subarray(s,b));n.sort((n,r)=>t[n*3+e]-t[r*3+e]),o.set(n,s),Z=s+(B>>1)}let te=g++,Q=g++;u[n]=te,f[n]=Q,E.push([Q,Z,b,D+1],[te,s,Z,D+1])}return{idx:o,lo:c,hi:l,left:u,right:f,start:p,count:m,depthOf:h,nodes:g,depth:_,leaves:v,forced:y}}function C(e,t={}){let n=performance.now(),o=t.layout===`stackless`?f:p,s=t.maxDepth??32;if(!Number.isInteger(s)||s<0)throw Error(`packScape: maxDepth ${s} (a whole number, 0 or more)`);let c=Math.min(s,32),l=t.bins??32,u=Math.min(l,16),m=0,h=0;for(let t of e)m+=t.positions.length/3,h+=t.indices.length/3;if(m>=1<<20)throw Error(`packScape: ${m} vertices (at most ${(1<<20)-1})`);if(x(h)>c)throw Error(`packScape: ${h} triangles need a tree ${x(h)} deep at least (leaves of ${d}); maxDepth is ${c}`);let _=new Float32Array(m*3),v=new Float32Array(m*3),C=new Float32Array(m*4),w=new Uint32Array(h*3),T=new Uint8Array(h),E=0,D=0;for(let t of e){let e=t.positions.length/3,n=t.indices.length/3,r=t.name??`(mesh)`;if(!Number.isInteger(e)||!Number.isInteger(n))throw Error(`packScape: ${r}: ragged positions or indices`);if(t.normals.length!==e*3||t.attrs.length!==e*4||t.materials.length!==n)throw Error(`packScape: ${r}: normals/attrs/materials of the wrong length`);_.set(t.positions,E*3),v.set(t.normals,E*3),C.set(t.attrs,E*4);for(let i=0;i<n*3;i++){let n=t.indices[i];if(!(n>=0&&n<e))throw Error(`packScape: ${r}: index ${n} out of range`);w[D*3+i]=n+E}for(let e=0;e<n;e++){let n=t.materials[e];if(!(n>=0&&n<i))throw Error(`packScape: ${r}: material ${n} (0..15)`);T[D+e]=n}E+=e,D+=n}for(let e=0;e<_.length;e++)if(!Number.isFinite(_[e]))throw Error(`packScape: a position is not finite`);let O=new Float64Array(h*6),k=new Float64Array(h*3);for(let e=0;e<h;e++){let t=w[e*3]*3,n=w[e*3+1]*3,r=w[e*3+2]*3;for(let i=0;i<3;i++){let a=Math.min(_[t+i],_[n+i],_[r+i]),o=Math.max(_[t+i],_[n+i],_[r+i]);O[e*6+i]=a,O[e*6+3+i]=o,k[e*3+i]=.5*(a+o)}}let A=S(O,k,h,c,l,u),j=performance.now()-n,M=[],N=[0];for(;N.length;){let e=N.pop();(o===f||A.left[e]>=0)&&M.push(e),A.left[e]>=0&&N.push(A.right[e],A.left[e])}let P=new Int32Array(A.nodes).fill(-1);M.forEach((e,t)=>P[e]=t);let F=M.length,I=4+F*(o===p?4:2),L=I+h*3,R=t.rows??new Float32Array;if(R.length%4!=0)throw Error(`packScape: rows of ${R.length} floats (4 a texel)`);let z=L+m*2,B=z+R.length/4,V=r,H=Math.max(1,Math.ceil(B/V));if(H>8192)throw Error(`packScape: ${H} rows (at most ${a})`);let U=new Float32Array(V*H*4),W=e=>A.left[e]>=0?P[e]:-(A.start[e]*4+A.count[e]-1)-1,G=(e,t)=>{for(let n=0;n<3;n++)U[e*4+n]=y(A.lo[t*3+n]-g),U[(e+1)*4+n]=b(A.hi[t*3+n]+g)},K=[0,0,0],q=[0,0,0];if(h>0){G(1,0);for(let e=0;e<3;e++)K[e]=U[4+e],q[e]=U[8+e]}else for(let e=0;e<3;e++)K[e]=U[4+e]=1e6,q[e]=U[8+e]=1e6;if(U.set([F,I,h,o===p&&h>0?W(0):0],0),U[7]=L,U[11]=m,U.set([o,A.depth,A.leaves,R.length?z:0],12),o===p)for(let e of M){let t=4+P[e]*4,n=A.left[e],r=A.right[e];G(t,n),G(t+2,r),U[t*4+3]=W(n),U[(t+1)*4+3]=W(r)}else{let e=new Int32Array(A.nodes).fill(F);for(let t of M)A.left[t]>=0&&(e[A.left[t]]=P[A.right[t]],e[A.right[t]]=e[t]);for(let t of M){let n=4+P[t]*2;G(n,t),U[n*4+3]=e[t],U[(n+1)*4+3]=A.left[t]>=0?0:A.start[t]*4+A.count[t]-1+1}}for(let e=0;e<h;e++){let t=A.idx[e],n=(I+e*3)*4;for(let e=0;e<3;e++){let r=w[t*3+e];U[n+e*4]=_[r*3],U[n+e*4+1]=_[r*3+1],U[n+e*4+2]=_[r*3+2],U[n+e*4+3]=e===0?r*i+T[t]:r}}for(let e=0;e<m;e++){let t=(L+e*2)*4;U[t]=v[e*3],U[t+1]=v[e*3+1],U[t+2]=v[e*3+2],U[t+3]=C[e*4],U[t+4]=C[e*4+1],U[t+5]=C[e*4+2],U[t+6]=C[e*4+3]}return U.set(R,z*4),{data:U,width:V,height:H,triangles:h,vertices:m,nodes:A.nodes,internal:A.nodes-A.leaves,leaves:A.leaves,depth:A.depth,lo:K,hi:q,rowBase:R.length?z:0,order:A.idx,layout:o===p?`stack`:`stackless`,forcedSplits:A.forced,buildMs:j,packMs:performance.now()-n-j}}var w=Math.fround,T=w(u),E=w(s),D=11754943508222875e-54;function O(e,t,n){return e[t*4+n]}function k(e,t,n){for(let n=0;n<3;n++)if(!Number.isFinite(w(e[n]))||!Number.isFinite(w(t[n])))return!0;return Number.isNaN(w(n))?!0:Math.max(Math.abs(w(t[0])),Math.abs(w(t[1])),Math.abs(w(t[2])))<D}function A(e,t){let n=w(e[0]),r=w(e[1]),i=w(e[2]),a=w(t[0]),o=w(t[1]),s=w(t[2]),c=e=>Math.abs(e)<w(1e-8)?w(1e-8):e,l=w(1/c(a)),u=w(1/c(o)),d=w(1/c(s)),f=Math.abs(a),p=Math.abs(o),m=Math.abs(s),h=f>=p&&f>=m?0:p>=m?1:2,g=j(a,o,s,h),_=w(1/g[2]);return{ox:n,oy:r,oz:i,ix:l,iy:u,iz:d,kz:h,sx:w(g[0]*_),sy:w(g[1]*_),sz:_}}function j(e,t,n,r){return r===0?[t,n,e]:r===1?[n,e,t]:[e,t,n]}function M(e,t,n,r){let i=w(w(O(t,n,0)-e.ox)*e.ix),a=w(w(O(t,n+1,0)-e.ox)*e.ix),o=w(w(O(t,n,1)-e.oy)*e.iy),s=w(w(O(t,n+1,1)-e.oy)*e.iy),c=w(w(O(t,n,2)-e.oz)*e.iz),l=w(w(O(t,n+1,2)-e.oz)*e.iz),u=Math.max(Math.max(Math.min(i,a),Math.min(o,s)),Math.max(Math.min(c,l),0));return u<=Math.min(Math.min(Math.max(i,a),Math.max(o,s)),Math.min(Math.max(c,l),r))?u:m}var N=[0,0,0];function P(e,t,n){let r=w(t[0]-e[0]),i=w(t[1]-e[1]);return n!==(i>0||i===0&&r<0)}function F(e,t,n,r){let i=(n,r)=>{let i=j(w(O(t,n,0)-e.ox),w(O(t,n,1)-e.oy),w(O(t,n,2)-e.oz),e.kz);return[w(i[0]-w(e.sx*i[2])),w(i[1]-w(e.sy*i[2])),i[2]]},a=i(n),o=i(n+1),s=i(n+2),c=w(w(s[0]*o[1])-w(s[1]*o[0])),l=w(w(a[0]*s[1])-w(a[1]*s[0])),u=w(w(o[0]*a[1])-w(o[1]*a[0])),d=w(w(c+l)+u),f=r?0:w(T*Math.abs(d)),p=Math.min(c,Math.min(l,u)),m=Math.max(c,Math.max(l,u));if(d===0||p<-f&&m>f)return!1;if(r){let e=d<0;if(c===0&&!P(o,s,e)||l===0&&!P(s,a,e)||u===0&&!P(a,o,e))return!1}let h=w(1/d);return N[0]=w(w(w(w(w(w(c*a[2])+w(l*o[2]))+w(u*s[2]))*e.sz)*h)),N[1]=w(l*h),N[2]=w(u*h),!0}function I(e){return e<0?(2147483648|-e-1)>>>0:e}function L(e,t,n,r,i,a,s,c,l){let u=e.data;if(s&&s.rays++,k(t,n,r)){s&&s.bad++;return}if(w(r)<=E)return;let d=A(t,n);if(s&&(s.loads+=2),M(d,u,1,w(r))>=m)return;s&&s.loads++;let p=O(u,0,0)>>>0,h=O(u,0,1)>>>0,g=O(u,0,2)>>>0;if(g===0)return;let _=O(u,3,0),v=e=>{let t=e>>>2,n=(e&3)+1;for(let e=0;e<n;e++){let n=t+e;if(n>=g)break;let r=h+n*3;if(s&&(s.tris++,s.loads+=3),F(d,u,r,l)&&N[0]>E&&N[0]<a()&&i(n,N[0],N[1],N[2],O(u,r,3)>>>0&15)===!1)return!1}return!0};if(_===f){let e=0;for(let t=0;t<p&&!(e>=p);t++){let n=4+e*2;if(s&&(s.steps++,t+1>s.maxSteps&&(s.maxSteps=t+1),s.nodes++,s.boxes++,s.loads+=2),M(d,u,n,a())>=m){e=O(u,n,3);continue}let r=O(u,n+1,3);if(r<.5)e++;else{if(v(r-1)===!1)return;e=O(u,n,3)}}return}let y=[],b=[],x=I(O(u,0,3)),S=Math.min(Math.min(p,4194304)*2+2,o),C=()=>{for(;y.length;){let e=y.pop(),t=b.pop();if(c!==`stackT`||t<a())return e}return-1};for(let e=0;e<S;e++){if(s&&(s.steps++,e+1>s.maxSteps&&(s.maxSteps=e+1)),x>=2147483648){if(v(x&2147483647)===!1||(x=C(),x<0))return;continue}if(x>=p)return;let t=4+x*4;s&&(s.nodes++,s.boxes+=2,s.loads+=4);let n=a(),r=M(d,u,t,n),i=M(d,u,t+2,n),o=I(O(u,t,3)),l=I(O(u,t+1,3)),f=r<m,h=i<m;if(c===`leafFirst`){let e=f,t=h;if(f&&o>=2147483648){if(v(o&2147483647)===!1)return;e=!1}if(h&&l>=2147483648){if(v(l&2147483647)===!1)return;t=!1}if(e&&t){let e=i<r;y.push(e?o:l),b.push(e?r:i),x=e?l:o}else if(e)x=o;else if(t)x=l;else if(x=C(),x<0)return}else if(f&&h){let e=i<r;y.length<32&&(y.push(e?o:l),b.push(e?r:i)),x=e?l:o}else if(f)x=o;else if(h)x=l;else if(x=C(),x<0)return;s&&y.length>s.maxStack&&(s.maxStack=y.length)}s&&s.capped++}function R(e,t,n,r,i={}){let a={t:w(r),tri:h,bary:[0,0]};return L(e,t,n,r,(e,t,n,r)=>{a.t=t,a.tri=e,a.bary=[n,r]},()=>a.t,i.stats,i.variant??`stack`,!1),a}function z(e,t){let n=e.data,r=O(n,0,1),i=O(n,1,3),a=r+t.tri*3,o=O(n,a,3)>>>0,s=[o>>>4,O(n,a+1,3),O(n,a+2,3)],c=[1-t.bary[0]-t.bary[1],t.bary[0],t.bary[1]],l=[0,0,0],u=[0,0,0,0];s.forEach((e,t)=>{let r=(i+e*2)*4;for(let e=0;e<3;e++)l[e]+=n[r+e]*c[t];u[0]+=n[r+3]*c[t];for(let e=0;e<3;e++)u[e+1]+=n[r+4+e]*c[t]});let d=[0,1,2].map(e=>[0,1,2].map(t=>O(n,a+e,t))),f=d[1].map((e,t)=>e-d[0][t]),p=d[2].map((e,t)=>e-d[0][t]),m=[f[1]*p[2]-f[2]*p[1],f[2]*p[0]-f[0]*p[2],f[0]*p[1]-f[1]*p[0]],h=Math.hypot(...m),g=Math.hypot(...l),_=h>1e-20?m.map(e=>e/h):[0,1,0];return{n:g>1e-6?l.map(e=>e/g):_,ng:_,attrs:u,material:o&15,vertices:s}}var B=[[`BARK`,`bark`,`vec3f(0.16, 0.09, 0.045)`,`0.75`,`0.02`,`vec3f(0.0)`],[`WOOD_END`,`woodEnd`,`vec3f(0.30, 0.20, 0.11)`,`0.8`,`0.02`,`vec3f(0.0)`],[`ROCK`,`rock`,`vec3f(0.05, 0.05, 0.055)`,`0.5`,`0.04`,`vec3f(0.0)`],[`LEAF_BIG`,`leafBig`,`vec3f(0.02, 0.06, 0.015)`,`0.35`,`0.04`,`vec3f(0.05, 0.12, 0.02)`],[`LEAF_SMALL`,`leafSmall`,`vec3f(0.03, 0.09, 0.02)`,`0.4`,`0.04`,`vec3f(0.06, 0.14, 0.03)`],[`STEM`,`stem`,`vec3f(0.04, 0.09, 0.025)`,`0.5`,`0.03`,`vec3f(0.0)`],[`ROOT`,`root`,`vec3f(0.06, 0.045, 0.03)`,`0.7`,`0.02`,`vec3f(0.0)`],[`HEATER`,`heater`,`vec3f(0.02, 0.02, 0.022)`,`0.4`,`0.045`,`vec3f(0.0)`],[`HEATER_LAMP`,`heaterLamp`,`vec3f(0.6, 0.25, 0.03)`,`0.15`,`0.05`,`vec3f(0.0)`],[`SPONGE`,`sponge`,`vec3f(0.035, 0.035, 0.035)`,`0.9`,`0.02`,`vec3f(0.0)`],[`TUBE`,`tube`,`vec3f(0.025, 0.025, 0.027)`,`0.35`,`0.045`,`vec3f(0.0)`],[`SUCTION`,`suction`,`vec3f(0.5, 0.53, 0.52)`,`0.3`,`0.04`,`vec3f(0.06, 0.065, 0.065)`]],V=e=>{let t=String(e);return/[.eE]/.test(t)?t:`${t}.0`};function H(e){let t=``,n=0;for(let r=0;r<e.length;r++){let i=e[r],a=e[r+1];if(i===`/`&&a===`*`)n++,r++,t+=`  `;else if(n>0&&i===`*`&&a===`/`)n--,r++,t+=`  `;else if(n>0)t+=i===`
`?`
`:` `;else if(i===`/`&&a===`/`){for(;r<e.length&&e[r]!==`
`;)t+=` `,r++;r<e.length&&(t+=`
`)}else t+=i}return t}function U(e=[]){let r=e.filter(e=>typeof e==`string`&&e.length),i=H(r.join(`
`)),a=[];for(let[,e,t,n,r,o]of B){let s=i.match(RegExp(`\\bfn\\s+scape_mat_${e}\\s*\\(`,`g`));if(s&&s.length>1)throw Error(`scapeMeshWGSL: scape_mat_${e} is defined ${s.length} times`);s||a.push(`fn scape_mat_${e}(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  return ScapeMat(${t}, n, ${n}, ${r}, ${o}, clamp(attrs.w, 0.0, 1.0), vec3f(0.0));
}`)}let d=Object.entries(t).map(([e,t])=>`const SCAPE_MAT_${e}: u32 = ${t}u;`).join(`
`),f=B.map(([e,n])=>`    case ${t[e]}u: { m = scape_mat_${n}(s.attrs, p, s.n, foot, front); }`).join(`
`),p=(e,t,n)=>`
  let h0 = scape_meshTexel(tex, 0u);
  let triCount = u32(h0.z);
  if (triCount == 0u) { return OUT; }
  let nodeCount = min(u32(h0.x), 4194304u);
  let triBase = u32(h0.y);
  var stack: array<u32, 32>;
  var sp = 0u;
  var cur = scape_meshChild(h0.w);
  // (Each node and leaf is taken at most once, and a finite ray takes a few hundred steps at most:
  // the bound guards against a bad texture or a ray scape_meshBad let by.)
  let steps = min(nodeCount * 2u + 2u, SCAPE_MESH_STEPS);
  for (var it = 0u; it < steps; it++) {
    if (cur >= 0x80000000u) {
      let start = (cur & 0x7fffffffu) >> 2u;
      let count = (cur & 3u) + 1u;
      for (var j = 0u; j < count; j++) {
        let k = start + j;
        if (k >= triCount) { break; }
        let at = triBase + k * 3u;
        let a = scape_meshTexel(tex, at);
        let x = scape_meshTri(r, a.xyz, scape_meshTexel(tex, at + 1u).xyz, scape_meshTexel(tex, at + 2u).xyz, ${n});
        if (x.x > SCAPE_MESH_TMIN && x.x < ${t}) {
${e}
        }
      }
      if (sp == 0u) { break; }
      sp -= 1u;
      cur = stack[sp];
      continue;
    }
    if (cur >= nodeCount) { break; }
    let at = 4u + cur * 4u;
    let n0 = scape_meshTexel(tex, at);
    let n1 = scape_meshTexel(tex, at + 1u);
    let t0 = scape_meshBox(r, n0.xyz, n1.xyz, ${t});
    let t1 = scape_meshBox(r, scape_meshTexel(tex, at + 2u).xyz, scape_meshTexel(tex, at + 3u).xyz, ${t});
    let c0 = scape_meshChild(n0.w);
    let c1 = scape_meshChild(n1.w);
    if (t0 < SCAPE_MESH_FAR && t1 < SCAPE_MESH_FAR) {
      let swap = t1 < t0;
      if (sp < SCAPE_MESH_STACK) {
        stack[sp] = select(c1, c0, swap);
        sp += 1u;
      }
      cur = select(c0, c1, swap);
    } else if (t0 < SCAPE_MESH_FAR) {
      cur = c0;
    } else if (t1 < SCAPE_MESH_FAR) {
      cur = c1;
    } else {
      if (sp == 0u) { break; }
      sp -= 1u;
      cur = stack[sp];
    }
  }`,m=`
// ---- the furnishings' triangles (src/render/scape/scapeBVH.mjs) ------------------------------
${d}
const SCAPE_MESH_NONE: u32 = 0xffffffffu;
// (A triangle's first word: its first corner's vertex id above SCAPE_MESH_MAT_BITS bits of its
// material.)
const SCAPE_MESH_MAT_BITS: u32 = 4u;
const SCAPE_MESH_MAT_MASK: u32 = 15u;
const SCAPE_MESH_STACK: u32 = 32u;
const SCAPE_MESH_STEPS: u32 = ${o}u;
const SCAPE_MESH_TMIN: f32 = ${V(s)};
const SCAPE_MESH_EDGE: f32 = ${V(u)};
const SCAPE_MESH_FAR: f32 = 3.0e38;
const SCAPE_LEAF_PASS: vec3f = vec3f(${c.map(V).join(`, `)});
const SCAPE_SHADOW_CUTOFF: f32 = ${V(l)};

struct ScapeMeshHit {
  t: f32,
  tri: u32,
  bary: vec2f,
}

struct ScapeSurface {
  n: vec3f,
  ng: vec3f,
  attrs: vec4f,
  material: u32,
}

// A ray set up for the walk: its origin, 1/d for the slabs (tiny components kept off zero), and
// the watertight test's frame: kz, d's largest axis; s, the shear (d.kx / d.kz, d.ky / d.kz) and
// 1 / d.kz.
struct ScapeRay {
  o: vec3f,
  inv: vec3f,
  s: vec3f,
  kz: u32,
}

fn scape_meshTexel(tex: texture_2d<f32>, i: u32) -> vec4f {
  return textureLoad(tex, vec2i(i32(i & 1023u), i32(i >> 10u)), 0);
}

// (v.kx, v.ky, v.kz): kz 0 -> yzx, 1 -> zxy, 2 -> xyz.
fn scape_meshPerm(v: vec3f, kz: u32) -> vec3f {
  return select(select(v.zxy, v.yzx, kz == 0u), v, kz == 2u);
}

// A ray the walk must not take: o or d not finite (NaN or infinite), d zero (no part of it a
// normal f32), or tEnd NaN. Tested on the bits: a compiler may take floats as never NaN and drop
// x != x, and the GPU's min and max drop a NaN operand, so the slab test would let such a ray into
// every box.
fn scape_meshBad(o: vec3f, d: vec3f, tEnd: f32) -> bool {
  let m = vec3u(0x7fffffffu);
  let inf = vec3u(0x7f800000u);
  let ad = bitcast<vec3u>(d) & m;
  return any((bitcast<vec3u>(o) & m) >= inf) || any(ad >= inf) || all(ad < vec3u(0x00800000u))
      || (bitcast<u32>(tEnd) & 0x7fffffffu) > 0x7f800000u;
}

fn scape_meshRay(o: vec3f, d: vec3f) -> ScapeRay {
  let ad = abs(d);
  var kz = 2u;
  if (ad.x >= ad.y && ad.x >= ad.z) {
    kz = 0u;
  } else if (ad.y >= ad.z) {
    kz = 1u;
  }
  let pd = scape_meshPerm(d, kz);
  let rz = 1.0 / pd.z;
  let inv = 1.0 / select(d, vec3f(1e-8), ad < vec3f(1e-8));
  return ScapeRay(o, inv, vec3f(pd.x * rz, pd.y * rz, rz), kz);
}

// Where the ray enters the box before tMax, or SCAPE_MESH_FAR if it misses it.
fn scape_meshBox(r: ScapeRay, lo: vec3f, hi: vec3f, tMax: f32) -> f32 {
  let a = (lo - r.o) * r.inv;
  let b = (hi - r.o) * r.inv;
  let tn = max(max(min(a.x, b.x), min(a.y, b.y)), max(min(a.z, b.z), 0.0));
  let tf = min(min(max(a.x, b.x), max(a.y, b.y)), min(max(a.z, b.z), tMax));
  return select(SCAPE_MESH_FAR, tn, tn <= tf);
}

// Whether a triangle owns its edge p -> q (sheared corners, in the triangle's order; neg: its det
// < 0) when the ray runs exactly through it: when the triangle lies on the side of the edge its
// normal points to, the normal turned to x > 0 (or x = 0, y > 0). A neighbour gets the same normal
// from the same corners (q - p exactly negated if it runs the edge the other way) and lies on the
// other side, so just one of them owns it (and at a corner, just one of those round it: the rule
// is that of the point nudged along +x, then +y).
fn scape_meshOwns(p: vec2f, q: vec2f, neg: bool) -> bool {
  let e = q - p;
  return neg != (e.y > 0.0 || (e.y == 0.0 && e.x < 0.0));
}

// The ray against a triangle, either face (Woop, Benthin & Wald's watertight test: each corner is
// sheared into the ray's frame on its own, so triangles sharing an edge compute that edge's
// function from the same numbers and no ray slips between them). exact false (a trace): the edge
// functions get a slack of SCAPE_MESH_EDGE of the triangle's scale, so no crack opens even where
// the GPU fuses a multiply and an add. exact true (a shadow): no slack, and an edge or corner the
// ray runs exactly through (an edge function exactly 0) is taken by one of the triangles round it
// only (scape_meshOwns), so a leaf is never darkened twice there. (t, b, c): the distance and the
// second and third corners' weights; t = SCAPE_MESH_FAR when the line misses it.
fn scape_meshTri(r: ScapeRay, a: vec3f, b: vec3f, c: vec3f, exact: bool) -> vec3f {
  let A = scape_meshPerm(a - r.o, r.kz);
  let B = scape_meshPerm(b - r.o, r.kz);
  let C = scape_meshPerm(c - r.o, r.kz);
  let a2 = A.xy - r.s.xy * A.z;
  let b2 = B.xy - r.s.xy * B.z;
  let c2 = C.xy - r.s.xy * C.z;
  let u = c2.x * b2.y - c2.y * b2.x;
  let v = a2.x * c2.y - a2.y * c2.x;
  let w = b2.x * a2.y - b2.y * a2.x;
  let det = u + v + w;
  let tol = select(SCAPE_MESH_EDGE * abs(det), 0.0, exact);
  let lo = min(u, min(v, w));
  let hi = max(u, max(v, w));
  if (det == 0.0 || (lo < -tol && hi > tol)) {
    return vec3f(SCAPE_MESH_FAR, 0.0, 0.0);
  }
  if (exact) {
    let neg = det < 0.0;
    if ((u == 0.0 && !scape_meshOwns(b2, c2, neg)) || (v == 0.0 && !scape_meshOwns(c2, a2, neg)) || (w == 0.0 && !scape_meshOwns(a2, b2, neg))) {
      return vec3f(SCAPE_MESH_FAR, 0.0, 0.0);
    }
  }
  let rd = 1.0 / det;
  let t = (u * A.z + v * B.z + w * C.z) * r.s.z * rd;
  return vec3f(t, v * rd, w * rd);
}

// A child word from the texture: an internal node's index, or 0x80000000 | (start * 4 + count - 1)
// for a leaf.
fn scape_meshChild(w: f32) -> u32 {
  if (w < 0.0) {
    return 0x80000000u | u32(-w - 1.0);
  }
  return u32(w);
}

// The nearest triangle along the ray in (SCAPE_MESH_TMIN, tEnd); o, d in the bowl's frame, d of
// unit length. t = tEnd and tri = SCAPE_MESH_NONE when there is none (or the ray is bad: see
// scape_meshBad).
fn scape_meshHit(tex: texture_2d<f32>, o: vec3f, d: vec3f, tEnd: f32) -> ScapeMeshHit {
  var hit = ScapeMeshHit(tEnd, SCAPE_MESH_NONE, vec2f(0.0));
  if (scape_meshBad(o, d, tEnd) || tEnd <= SCAPE_MESH_TMIN) { return hit; }
  let r = scape_meshRay(o, d);
  // (Most segments miss the furnishings altogether: their box first.)
  if (scape_meshBox(r, scape_meshTexel(tex, 1u).xyz, scape_meshTexel(tex, 2u).xyz, tEnd) >= SCAPE_MESH_FAR) { return hit; }
${p(`          hit = ScapeMeshHit(x.x, k, x.yz);`,`hit.t`,`false`).replaceAll(`OUT`,`hit`)}
  return hit;
}

// The light let through along the segment (o, d up to tEnd): none at any opaque triangle, a green
// share at each leaf blade crossed (all of it for a bad ray: see scape_meshBad).
fn scape_meshShadow(tex: texture_2d<f32>, o: vec3f, d: vec3f, tEnd: f32) -> vec3f {
  var T = vec3f(1.0);
  if (scape_meshBad(o, d, tEnd) || tEnd <= SCAPE_MESH_TMIN) { return T; }
  let r = scape_meshRay(o, d);
  if (scape_meshBox(r, scape_meshTexel(tex, 1u).xyz, scape_meshTexel(tex, 2u).xyz, tEnd) >= SCAPE_MESH_FAR) { return T; }
${p(`          let m = u32(a.w) & SCAPE_MESH_MAT_MASK;
          if (m != SCAPE_MAT_LEAF_BIG && m != SCAPE_MAT_LEAF_SMALL) { return vec3f(0.0); }
          T *= SCAPE_LEAF_PASS;
          if (max(T.x, max(T.y, T.z)) < SCAPE_SHADOW_CUTOFF) { return vec3f(0.0); }`,`tEnd`,`true`).replaceAll(`OUT`,`T`)}
  return T;
}

// What the hit triangle is at the hit: its smooth normal (the corners' normals interpolated and
// renormalised; the geometric one where they cancel), its geometric normal (the side its corners
// run counter-clockwise round), the corners' attributes interpolated, its material.
fn scape_meshSurface(tex: texture_2d<f32>, h: ScapeMeshHit) -> ScapeSurface {
  let h0 = scape_meshTexel(tex, 0u);
  if (h.tri >= u32(h0.z)) {
    return ScapeSurface(vec3f(0.0, 1.0, 0.0), vec3f(0.0, 1.0, 0.0), vec4f(0.0, 0.0, 0.0, 1.0), 0u);
  }
  let vb = u32(scape_meshTexel(tex, 1u).w);
  let at = u32(h0.y) + h.tri * 3u;
  let a = scape_meshTexel(tex, at);
  let b = scape_meshTexel(tex, at + 1u);
  let c = scape_meshTexel(tex, at + 2u);
  let wa = u32(a.w);
  let ia = vb + (wa >> SCAPE_MESH_MAT_BITS) * 2u;
  let ib = vb + u32(b.w) * 2u;
  let ic = vb + u32(c.w) * 2u;
  let a0 = scape_meshTexel(tex, ia);
  let a1 = scape_meshTexel(tex, ia + 1u);
  let b0 = scape_meshTexel(tex, ib);
  let b1 = scape_meshTexel(tex, ib + 1u);
  let c0 = scape_meshTexel(tex, ic);
  let c1 = scape_meshTexel(tex, ic + 1u);
  let wb = h.bary.x;
  let wc = h.bary.y;
  let w0 = 1.0 - wb - wc;
  let g = cross(b.xyz - a.xyz, c.xyz - a.xyz);
  let gl = length(g);
  let ng = select(vec3f(0.0, 1.0, 0.0), g / max(gl, 1e-30), gl > 1e-20);
  let ni = a0.xyz * w0 + b0.xyz * wb + c0.xyz * wc;
  let nl = length(ni);
  let n = select(ng, ni / max(nl, 1e-30), nl > 1e-6);
  let attrs = vec4f(a0.w, a1.xyz) * w0 + vec4f(b0.w, b1.xyz) * wb + vec4f(c0.w, c1.xyz) * wc;
  return ScapeSurface(n, ng, attrs, wa & SCAPE_MESH_MAT_MASK);
}

// The surface's material at p (foot: a pixel's size there; front: the ray meets the side s.n
// points to).
fn scape_meshMaterial(s: ScapeSurface, p: vec3f, foot: f32, front: bool) -> ScapeMat {
  var m = ScapeMat(vec3f(0.18), s.n, 0.8, 0.02, vec3f(0.0), clamp(s.attrs.w, 0.0, 1.0), vec3f(0.0));
  switch (s.material) {
${f}
    default: {}
  }
  return m;
}
`;return[n,...r,a.length?`// (Stand-ins for the materials no piece defines yet.)\n${a.join(`

`)}`:``,m].filter(Boolean).join(`
`)}var W=e({FISH_REACH:()=>ee,IOR_GLASS:()=>G,IOR_WATER:()=>K,MATERIAL_TOPICS:()=>q,MESH_TOPICS:()=>J,enterSphere:()=>ae,leaveSphere:()=>oe,pickBowl:()=>pe,refract:()=>ie,topicOf:()=>te}),G=1.5,K=1.333,q={1:`driftwood`,2:`driftwood`,3:`rock`,4:`anubias`,5:`rosette`,8:`heater`,9:`heater`,10:`filter`,11:`filter`,12:`heater`},J={driftwood:`driftwood`,rocks:`rock`,plantTall:`anubias`,plantSmall:`rosette`},ee=.06,Y=.02,X=.04,Z=.25;function te(e,t){return q[e]??J[t]??null}var Q=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],ne=(e,t,n)=>[e[0]+t[0]*n,e[1]+t[1]*n,e[2]+t[2]*n],re=e=>{let t=Math.hypot(e[0],e[1],e[2]);return[e[0]/t,e[1]/t,e[2]/t]},$=(e,t)=>[e[0]*t[0]+e[1]*t[1]+e[2]*t[2],e[3]*t[0]+e[4]*t[1]+e[5]*t[2],e[6]*t[0]+e[7]*t[1]+e[8]*t[2]];function ie(e,t,n){let r=-Q(t,e),i=1-n*n*(1-r*r);if(i<0)return null;let a=n*r-Math.sqrt(i);return re([e[0]*n+t[0]*a,e[1]*n+t[1]*a,e[2]*n+t[2]*a])}function ae(e,t,n){let r=Q(e,t),i=r*r-(Q(e,e)-n*n);if(i<=0)return null;let a=-r-Math.sqrt(i);return a>0?a:null}function oe(e,t,n){let r=Q(e,t);return-r+Math.sqrt(Math.max(r*r-(Q(e,e)-n*n),0))}function se(e,t,n,r,i,a,o){let s=0,c=n,l=[e[0]-r[0],e[1]-r[1],e[2]-r[2]];for(let e=0;e<3;e++){let n=Q(l,i[e]),r=Q(t,i[e]);if(Math.abs(r)<1e-12){if(n<a[e]||n>o[e])return null;continue}let u=(a[e]-n)/r,d=(o[e]-n)/r;if(s=Math.max(s,Math.min(u,d)),c=Math.min(c,Math.max(u,d)),s>c)return null}return s}function ce(e,t,n,r){let i=null,a=[0,1,0],o=r.leaf;if(o){let r=[Math.cos(o.yaw),0,Math.sin(o.yaw)],s=[-r[2],0,r[0]],c=.5*o.length+Y,l=o.width+Y,u=se(e,t,n,o.at,[r,a,s],[-c,-.025,-l],[c,X,l]);u!==null&&(i={topic:`leaf`,t:u})}let s=r.nest;if(s){let r=[Math.cos(s.bearing),0,Math.sin(s.bearing)],o=[-r[2],0,r[0]],c=se(e,t,n,s.at,[o,a,r],[-.24,-.025,-.16],[.24,X,Y]);c!==null&&(!i||c<i.t)&&(i={topic:`nest`,t:c})}return i}function le(e,t,n,r){let i=r.scape;if(!i)return null;let a=r.rotation,o={data:i.data},s=R(o,$(a,e),$(a,t),n);if(s.tri===4294967295)return null;let c=z(o,s),l=c.vertices[0],u=null;for(let[e,t]of i.parts){if(l<t){u=e;break}l-=t}return{topic:te(c.material,u),t:s.t}}function ue(e,t,n,r){let i=r.fish;if(!i)return null;let a=null;for(let r=0;r+2<i.length;r+=4){let o=[i[r]-e[0],i[r+1]-e[1],i[r+2]-e[2]],s=Q(o,t);s<0||s>n||Q(o,o)-s*s<.0036&&(!a||s<a.t)&&(a={topic:`fish`,t:s})}return a}function de(e,t,n,r){let i=$(r.rotation,e)[1],a=$(r.rotation,t)[1];if(i<=r.bed)return 0;if(a>=0)return null;let o=(r.bed-i)/a;return o>=0&&o<n?o:null}function fe(e,t,n,r){let i=de(e,t,n,r),a=i===null?null:{topic:`sand`,t:i};for(let i of[ce(e,t,n,r),le(e,t,n,r),ue(e,t,n,r)])i&&(!a||i.t<a.t)&&(a=i);return a}function pe(e,t,n){if(n.lid?.(e,t))return{topic:`lid`,at:[...e]};let r=ae(e,t,n.outer);if(r===null)return null;let i=ne(e,t,r),a=t,o=!1;if($(n.rotation,i)[1]<=n.mouth){let e=ie(t,re(i),1/G),r=e?ae(i,e,n.inner):null;if(r===null||(i=ne(i,e,r),o=i[1]<n.level,a=ie(e,re(i),G/(o?K:1)),!a))return{topic:`glass`,at:i}}for(let e=0;e<2;e++){let e=oe(i,a,n.inner),t=(o?a[1]>0:a[1]<0)?(n.level-i[1])/a[1]:1/0,r=t<e;r&&(e=t);let s=fe(i,a,e,n);if(s)return{topic:s.topic,at:ne(i,a,s.t)};let c=ne(i,a,e);if(o)return{topic:`water`,at:c};if(!r)return $(n.rotation,c)[1]>n.mouth?null:{topic:`glass`,at:c};if(-a[1]<Z)return{topic:`water`,at:c};let l=ie(a,[0,1,0],1/K);i=c,a=l,o=!0}return null}export{ie as a,W as i,K as n,C as o,ae as r,U as s,G as t};