import{i as e,o as t}from"./betta-CPqXEO4n.js";var n=1024,r=16,i=8192,a=4096,o=1e-5,s=[.18,.3,.06],c=2e-4,l=1e-6,u=4,d=1,f=2,p=3e38,m=4294967295,h=2e-6,g=new Float32Array(1),_=new Uint32Array(g.buffer);function v(e){let t=Math.fround(e);if(t<=e)return t;if(g[0]=t,t>0)_[0]--;else if(t===0)return-1401298464324817e-60;else _[0]++;return g[0]}function y(e){return-v(-e)}function b(e){let t=0;for(;e>u;)e=Math.ceil(e/2),t++;return t}function x(e,t,n,r,i,a){let o=new Uint32Array(n);for(let e=0;e<n;e++)o[e]=e;let s=Math.max(1,2*n),c=new Float64Array(s*3),l=new Float64Array(s*3),d=new Int32Array(s).fill(-1),f=new Int32Array(s).fill(-1),p=new Int32Array(s),m=new Int32Array(s),h=new Int32Array(s),g=1,_=0,v=0,y=0,x=Math.max(i,a),S=new Int32Array(3*x),C=new Float64Array(3*x*6),w=new Float64Array(x),T=new Int32Array(x),E=[[0,0,n,0]];for(;E.length;){let[n,s,x,D]=E.pop();h[n]=D,D>_&&(_=D);let O=1/0,k=1/0,A=1/0,j=-1/0,M=-1/0,N=-1/0,P=1/0,F=1/0,I=1/0,L=-1/0,R=-1/0,z=-1/0;for(let n=s;n<x;n++){let r=o[n],i=r*6,a=r*3;e[i]<O&&(O=e[i]),e[i+1]<k&&(k=e[i+1]),e[i+2]<A&&(A=e[i+2]),e[i+3]>j&&(j=e[i+3]),e[i+4]>M&&(M=e[i+4]),e[i+5]>N&&(N=e[i+5]);let s=t[a],c=t[a+1],l=t[a+2];s<P&&(P=s),s>L&&(L=s),c<F&&(F=c),c>R&&(R=c),l<I&&(I=l),l>z&&(z=l)}c[n*3]=O,c[n*3+1]=k,c[n*3+2]=A,l[n*3]=j,l[n*3+1]=M,l[n*3+2]=N;let B=x-s;if(B<=u){p[n]=s,m[n]=B,v++;continue}let V=B>4096?i:a,H=[L-P,R-F,z-I],U=[P,F,I],W=H.map(e=>e>1e-12?V/e:0);S.fill(0,0,3*V);for(let e=0;e<3*V;e++){let t=e*6;C[t]=C[t+1]=C[t+2]=1/0,C[t+3]=C[t+4]=C[t+5]=-1/0}let G=W[0],K=W[1],q=W[2];for(let n=s;n<x;n++){let r=o[n],i=r*6,a=r*3,s=e[i],c=e[i+1],l=e[i+2],u=e[i+3],d=e[i+4],f=e[i+5];for(let e=0;e<3;e++){let n=e===0?G:e===1?K:q;if(n===0)continue;let r=(t[a+e]-U[e])*n|0;r>=V&&(r=V-1),r+=e*V,S[r]++;let i=r*6;s<C[i]&&(C[i]=s),c<C[i+1]&&(C[i+1]=c),l<C[i+2]&&(C[i+2]=l),u>C[i+3]&&(C[i+3]=u),d>C[i+4]&&(C[i+4]=d),f>C[i+5]&&(C[i+5]=f)}}let J=-1,Y=-1,X=1/0,Z=0;for(let e=0;e<3;e++){if(W[e]===0)continue;let t=1/0,n=1/0,r=1/0,i=-1/0,a=-1/0,o=-1/0,s=0;for(let c=V-1;c>0;c--){let l=(e*V+c)*6;s+=S[e*V+c],C[l]<t&&(t=C[l]),C[l+1]<n&&(n=C[l+1]),C[l+2]<r&&(r=C[l+2]),C[l+3]>i&&(i=C[l+3]),C[l+4]>a&&(a=C[l+4]),C[l+5]>o&&(o=C[l+5]),T[c]=s;let u=i-t,d=a-n,f=o-r;w[c]=s?u*d+d*f+f*u:0}t=n=r=1/0,i=a=o=-1/0,s=0;for(let c=0;c<V-1;c++){let l=(e*V+c)*6;if(s+=S[e*V+c],C[l]<t&&(t=C[l]),C[l+1]<n&&(n=C[l+1]),C[l+2]<r&&(r=C[l+2]),C[l+3]>i&&(i=C[l+3]),C[l+4]>a&&(a=C[l+4]),C[l+5]>o&&(o=C[l+5]),s===0||T[c+1]===0)continue;let u=i-t,d=a-n,f=o-r,p=s*(u*d+d*f+f*u)+T[c+1]*w[c+1];p<X&&(X=p,J=e,Y=c,Z=s)}}let Q;if(J>=0&&D+1+b(Math.max(Z,B-Z))<=r){let e=J,n=W[e],r=U[e],i=s,a=x-1;for(;i<=a;){let s=o[i],c=(t[s*3+e]-r)*n|0;c>=V&&(c=V-1),c<=Y?i++:(o[i]=o[a],o[a]=s,a--)}Q=i}else{J>=0&&y++;let e=H[0]>=H[1]&&H[0]>=H[2]?0:H[1]>=H[2]?1:2,n=Array.from(o.subarray(s,x));n.sort((n,r)=>t[n*3+e]-t[r*3+e]),o.set(n,s),Q=s+(B>>1)}let $=g++,ee=g++;d[n]=$,f[n]=ee,E.push([ee,Q,x,D+1],[$,s,Q,D+1])}return{idx:o,lo:c,hi:l,left:d,right:f,start:p,count:m,depthOf:h,nodes:g,depth:_,leaves:v,forced:y}}function S(e,t={}){let a=performance.now(),o=t.layout===`stackless`?d:f,s=t.maxDepth??32;if(!Number.isInteger(s)||s<0)throw Error(`packScape: maxDepth ${s} (a whole number, 0 or more)`);let c=Math.min(s,32),l=t.bins??32,p=Math.min(l,16),m=0,g=0;for(let t of e)m+=t.positions.length/3,g+=t.indices.length/3;if(m>=1<<20)throw Error(`packScape: ${m} vertices (at most ${(1<<20)-1})`);if(b(g)>c)throw Error(`packScape: ${g} triangles need a tree ${b(g)} deep at least (leaves of ${u}); maxDepth is ${c}`);let _=new Float32Array(m*3),S=new Float32Array(m*3),C=new Float32Array(m*4),w=new Uint32Array(g*3),T=new Uint8Array(g),E=0,D=0;for(let t of e){let e=t.positions.length/3,n=t.indices.length/3,i=t.name??`(mesh)`;if(!Number.isInteger(e)||!Number.isInteger(n))throw Error(`packScape: ${i}: ragged positions or indices`);if(t.normals.length!==e*3||t.attrs.length!==e*4||t.materials.length!==n)throw Error(`packScape: ${i}: normals/attrs/materials of the wrong length`);_.set(t.positions,E*3),S.set(t.normals,E*3),C.set(t.attrs,E*4);for(let r=0;r<n*3;r++){let n=t.indices[r];if(!(n>=0&&n<e))throw Error(`packScape: ${i}: index ${n} out of range`);w[D*3+r]=n+E}for(let e=0;e<n;e++){let n=t.materials[e];if(!(n>=0&&n<r))throw Error(`packScape: ${i}: material ${n} (0..15)`);T[D+e]=n}E+=e,D+=n}for(let e=0;e<_.length;e++)if(!Number.isFinite(_[e]))throw Error(`packScape: a position is not finite`);let O=new Float64Array(g*6),k=new Float64Array(g*3);for(let e=0;e<g;e++){let t=w[e*3]*3,n=w[e*3+1]*3,r=w[e*3+2]*3;for(let i=0;i<3;i++){let a=Math.min(_[t+i],_[n+i],_[r+i]),o=Math.max(_[t+i],_[n+i],_[r+i]);O[e*6+i]=a,O[e*6+3+i]=o,k[e*3+i]=.5*(a+o)}}let A=x(O,k,g,c,l,p),j=performance.now()-a,M=[],N=[0];for(;N.length;){let e=N.pop();(o===d||A.left[e]>=0)&&M.push(e),A.left[e]>=0&&N.push(A.right[e],A.left[e])}let P=new Int32Array(A.nodes).fill(-1);M.forEach((e,t)=>P[e]=t);let F=M.length,I=4+F*(o===f?4:2),L=I+g*3,R=t.rows??new Float32Array;if(R.length%4!=0)throw Error(`packScape: rows of ${R.length} floats (4 a texel)`);let z=L+m*2,B=z+R.length/4,V=n,H=Math.max(1,Math.ceil(B/V));if(H>8192)throw Error(`packScape: ${H} rows (at most ${i})`);let U=new Float32Array(V*H*4),W=e=>A.left[e]>=0?P[e]:-(A.start[e]*4+A.count[e]-1)-1,G=(e,t)=>{for(let n=0;n<3;n++)U[e*4+n]=v(A.lo[t*3+n]-h),U[(e+1)*4+n]=y(A.hi[t*3+n]+h)},K=[0,0,0],q=[0,0,0];if(g>0){G(1,0);for(let e=0;e<3;e++)K[e]=U[4+e],q[e]=U[8+e]}else for(let e=0;e<3;e++)K[e]=U[4+e]=1e6,q[e]=U[8+e]=1e6;if(U.set([F,I,g,o===f&&g>0?W(0):0],0),U[7]=L,U[11]=m,U.set([o,A.depth,A.leaves,R.length?z:0],12),o===f)for(let e of M){let t=4+P[e]*4,n=A.left[e],r=A.right[e];G(t,n),G(t+2,r),U[t*4+3]=W(n),U[(t+1)*4+3]=W(r)}else{let e=new Int32Array(A.nodes).fill(F);for(let t of M)A.left[t]>=0&&(e[A.left[t]]=P[A.right[t]],e[A.right[t]]=e[t]);for(let t of M){let n=4+P[t]*2;G(n,t),U[n*4+3]=e[t],U[(n+1)*4+3]=A.left[t]>=0?0:A.start[t]*4+A.count[t]-1+1}}for(let e=0;e<g;e++){let t=A.idx[e],n=(I+e*3)*4;for(let e=0;e<3;e++){let i=w[t*3+e];U[n+e*4]=_[i*3],U[n+e*4+1]=_[i*3+1],U[n+e*4+2]=_[i*3+2],U[n+e*4+3]=e===0?i*r+T[t]:i}}for(let e=0;e<m;e++){let t=(L+e*2)*4;U[t]=S[e*3],U[t+1]=S[e*3+1],U[t+2]=S[e*3+2],U[t+3]=C[e*4],U[t+4]=C[e*4+1],U[t+5]=C[e*4+2],U[t+6]=C[e*4+3]}return U.set(R,z*4),{data:U,width:V,height:H,triangles:g,vertices:m,nodes:A.nodes,internal:A.nodes-A.leaves,leaves:A.leaves,depth:A.depth,lo:K,hi:q,rowBase:R.length?z:0,order:A.idx,layout:o===f?`stack`:`stackless`,forcedSplits:A.forced,buildMs:j,packMs:performance.now()-a-j}}var C=Math.fround,w=C(l),T=C(o),E=11754943508222875e-54;function D(e,t,n){return e[t*4+n]}function O(e,t,n){for(let n=0;n<3;n++)if(!Number.isFinite(C(e[n]))||!Number.isFinite(C(t[n])))return!0;return Number.isNaN(C(n))?!0:Math.max(Math.abs(C(t[0])),Math.abs(C(t[1])),Math.abs(C(t[2])))<E}function k(e,t){let n=C(e[0]),r=C(e[1]),i=C(e[2]),a=C(t[0]),o=C(t[1]),s=C(t[2]),c=e=>Math.abs(e)<C(1e-8)?C(1e-8):e,l=C(1/c(a)),u=C(1/c(o)),d=C(1/c(s)),f=Math.abs(a),p=Math.abs(o),m=Math.abs(s),h=f>=p&&f>=m?0:p>=m?1:2,g=A(a,o,s,h),_=C(1/g[2]);return{ox:n,oy:r,oz:i,ix:l,iy:u,iz:d,kz:h,sx:C(g[0]*_),sy:C(g[1]*_),sz:_}}function A(e,t,n,r){return r===0?[t,n,e]:r===1?[n,e,t]:[e,t,n]}function j(e,t,n,r){let i=C(C(D(t,n,0)-e.ox)*e.ix),a=C(C(D(t,n+1,0)-e.ox)*e.ix),o=C(C(D(t,n,1)-e.oy)*e.iy),s=C(C(D(t,n+1,1)-e.oy)*e.iy),c=C(C(D(t,n,2)-e.oz)*e.iz),l=C(C(D(t,n+1,2)-e.oz)*e.iz),u=Math.max(Math.max(Math.min(i,a),Math.min(o,s)),Math.max(Math.min(c,l),0));return u<=Math.min(Math.min(Math.max(i,a),Math.max(o,s)),Math.min(Math.max(c,l),r))?u:p}var M=[0,0,0];function N(e,t,n){let r=C(t[0]-e[0]),i=C(t[1]-e[1]);return n!==(i>0||i===0&&r<0)}function P(e,t,n,r){let i=(n,r)=>{let i=A(C(D(t,n,0)-e.ox),C(D(t,n,1)-e.oy),C(D(t,n,2)-e.oz),e.kz);return[C(i[0]-C(e.sx*i[2])),C(i[1]-C(e.sy*i[2])),i[2]]},a=i(n),o=i(n+1),s=i(n+2),c=C(C(s[0]*o[1])-C(s[1]*o[0])),l=C(C(a[0]*s[1])-C(a[1]*s[0])),u=C(C(o[0]*a[1])-C(o[1]*a[0])),d=C(C(c+l)+u),f=r?0:C(w*Math.abs(d)),p=Math.min(c,Math.min(l,u)),m=Math.max(c,Math.max(l,u));if(d===0||p<-f&&m>f)return!1;if(r){let e=d<0;if(c===0&&!N(o,s,e)||l===0&&!N(s,a,e)||u===0&&!N(a,o,e))return!1}let h=C(1/d);return M[0]=C(C(C(C(C(C(c*a[2])+C(l*o[2]))+C(u*s[2]))*e.sz)*h)),M[1]=C(l*h),M[2]=C(u*h),!0}function F(e){return e<0?(2147483648|-e-1)>>>0:e}function I(e,t,n,r,i,o,s,c,l){let u=e.data;if(s&&s.rays++,O(t,n,r)){s&&s.bad++;return}if(C(r)<=T)return;let f=k(t,n);if(s&&(s.loads+=2),j(f,u,1,C(r))>=p)return;s&&s.loads++;let m=D(u,0,0)>>>0,h=D(u,0,1)>>>0,g=D(u,0,2)>>>0;if(g===0)return;let _=D(u,3,0),v=e=>{let t=e>>>2,n=(e&3)+1;for(let e=0;e<n;e++){let n=t+e;if(n>=g)break;let r=h+n*3;if(s&&(s.tris++,s.loads+=3),P(f,u,r,l)&&M[0]>T&&M[0]<o()&&i(n,M[0],M[1],M[2],D(u,r,3)>>>0&15)===!1)return!1}return!0};if(_===d){let e=0;for(let t=0;t<m&&!(e>=m);t++){let n=4+e*2;if(s&&(s.steps++,t+1>s.maxSteps&&(s.maxSteps=t+1),s.nodes++,s.boxes++,s.loads+=2),j(f,u,n,o())>=p){e=D(u,n,3);continue}let r=D(u,n+1,3);if(r<.5)e++;else{if(v(r-1)===!1)return;e=D(u,n,3)}}return}let y=[],b=[],x=F(D(u,0,3)),S=Math.min(Math.min(m,4194304)*2+2,a),w=()=>{for(;y.length;){let e=y.pop(),t=b.pop();if(c!==`stackT`||t<o())return e}return-1};for(let e=0;e<S;e++){if(s&&(s.steps++,e+1>s.maxSteps&&(s.maxSteps=e+1)),x>=2147483648){if(v(x&2147483647)===!1||(x=w(),x<0))return;continue}if(x>=m)return;let t=4+x*4;s&&(s.nodes++,s.boxes+=2,s.loads+=4);let n=o(),r=j(f,u,t,n),i=j(f,u,t+2,n),a=F(D(u,t,3)),l=F(D(u,t+1,3)),d=r<p,h=i<p;if(c===`leafFirst`){let e=d,t=h;if(d&&a>=2147483648){if(v(a&2147483647)===!1)return;e=!1}if(h&&l>=2147483648){if(v(l&2147483647)===!1)return;t=!1}if(e&&t){let e=i<r;y.push(e?a:l),b.push(e?r:i),x=e?l:a}else if(e)x=a;else if(t)x=l;else if(x=w(),x<0)return}else if(d&&h){let e=i<r;y.length<32&&(y.push(e?a:l),b.push(e?r:i)),x=e?l:a}else if(d)x=a;else if(h)x=l;else if(x=w(),x<0)return;s&&y.length>s.maxStack&&(s.maxStack=y.length)}s&&s.capped++}function L(e,t,n,r,i={}){let a={t:C(r),tri:m,bary:[0,0]};return I(e,t,n,r,(e,t,n,r)=>{a.t=t,a.tri=e,a.bary=[n,r]},()=>a.t,i.stats,i.variant??`stack`,!1),a}function R(e,t){let n=e.data,r=D(n,0,1),i=D(n,1,3),a=r+t.tri*3,o=D(n,a,3)>>>0,s=[o>>>4,D(n,a+1,3),D(n,a+2,3)],c=[1-t.bary[0]-t.bary[1],t.bary[0],t.bary[1]],l=[0,0,0],u=[0,0,0,0];s.forEach((e,t)=>{let r=(i+e*2)*4;for(let e=0;e<3;e++)l[e]+=n[r+e]*c[t];u[0]+=n[r+3]*c[t];for(let e=0;e<3;e++)u[e+1]+=n[r+4+e]*c[t]});let d=[0,1,2].map(e=>[0,1,2].map(t=>D(n,a+e,t))),f=d[1].map((e,t)=>e-d[0][t]),p=d[2].map((e,t)=>e-d[0][t]),m=[f[1]*p[2]-f[2]*p[1],f[2]*p[0]-f[0]*p[2],f[0]*p[1]-f[1]*p[0]],h=Math.hypot(...m),g=Math.hypot(...l),_=h>1e-20?m.map(e=>e/h):[0,1,0];return{n:g>1e-6?l.map(e=>e/g):_,ng:_,attrs:u,material:o&15,vertices:s}}var z=[[`BARK`,`bark`,`vec3f(0.16, 0.09, 0.045)`,`0.75`,`0.02`,`vec3f(0.0)`],[`WOOD_END`,`woodEnd`,`vec3f(0.30, 0.20, 0.11)`,`0.8`,`0.02`,`vec3f(0.0)`],[`ROCK`,`rock`,`vec3f(0.05, 0.05, 0.055)`,`0.5`,`0.04`,`vec3f(0.0)`],[`LEAF_BIG`,`leafBig`,`vec3f(0.02, 0.06, 0.015)`,`0.35`,`0.04`,`vec3f(0.05, 0.12, 0.02)`],[`LEAF_SMALL`,`leafSmall`,`vec3f(0.03, 0.09, 0.02)`,`0.4`,`0.04`,`vec3f(0.06, 0.14, 0.03)`],[`STEM`,`stem`,`vec3f(0.04, 0.09, 0.025)`,`0.5`,`0.03`,`vec3f(0.0)`],[`ROOT`,`root`,`vec3f(0.06, 0.045, 0.03)`,`0.7`,`0.02`,`vec3f(0.0)`],[`HEATER`,`heater`,`vec3f(0.02, 0.02, 0.022)`,`0.4`,`0.045`,`vec3f(0.0)`],[`HEATER_LAMP`,`heaterLamp`,`vec3f(0.6, 0.25, 0.03)`,`0.15`,`0.05`,`vec3f(0.0)`],[`SPONGE`,`sponge`,`vec3f(0.035, 0.035, 0.035)`,`0.9`,`0.02`,`vec3f(0.0)`],[`TUBE`,`tube`,`vec3f(0.025, 0.025, 0.027)`,`0.35`,`0.045`,`vec3f(0.0)`],[`SUCTION`,`suction`,`vec3f(0.5, 0.53, 0.52)`,`0.3`,`0.04`,`vec3f(0.06, 0.065, 0.065)`]],B=e=>{let t=String(e);return/[.eE]/.test(t)?t:`${t}.0`};function V(e){let t=``,n=0;for(let r=0;r<e.length;r++){let i=e[r],a=e[r+1];if(i===`/`&&a===`*`)n++,r++,t+=`  `;else if(n>0&&i===`*`&&a===`/`)n--,r++,t+=`  `;else if(n>0)t+=i===`
`?`
`:` `;else if(i===`/`&&a===`/`){for(;r<e.length&&e[r]!==`
`;)t+=` `,r++;r<e.length&&(t+=`
`)}else t+=i}return t}function H(n=[]){let r=n.filter(e=>typeof e==`string`&&e.length),i=V(r.join(`
`)),u=[];for(let[,e,t,n,r,a]of z){let o=i.match(RegExp(`\\bfn\\s+scape_mat_${e}\\s*\\(`,`g`));if(o&&o.length>1)throw Error(`scapeMeshWGSL: scape_mat_${e} is defined ${o.length} times`);o||u.push(`fn scape_mat_${e}(attrs: vec4f, p: vec3f, n: vec3f, foot: f32, front: bool) -> ScapeMat {
  return ScapeMat(${t}, n, ${n}, ${r}, ${a}, clamp(attrs.w, 0.0, 1.0), vec3f(0.0));
}`)}let d=Object.entries(e).map(([e,t])=>`const SCAPE_MAT_${e}: u32 = ${t}u;`).join(`
`),f=z.map(([t,n])=>`    case ${e[t]}u: { m = scape_mat_${n}(s.attrs, p, s.n, foot, front); }`).join(`
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
const SCAPE_MESH_STEPS: u32 = ${a}u;
const SCAPE_MESH_TMIN: f32 = ${B(o)};
const SCAPE_MESH_EDGE: f32 = ${B(l)};
const SCAPE_MESH_FAR: f32 = 3.0e38;
const SCAPE_LEAF_PASS: vec3f = vec3f(${s.map(B).join(`, `)});
const SCAPE_SHADOW_CUTOFF: f32 = ${B(c)};

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
`;return[t,...r,u.length?`// (Stand-ins for the materials no piece defines yet.)\n${u.join(`

`)}`:``,m].filter(Boolean).join(`
`)}export{L as i,H as n,R as r,S as t};