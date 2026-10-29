(function(){let e=(e,t,n)=>Math.max(t,Math.min(n,e)),t=(t,n,r)=>{let i=e((r-t)/(n-t),0,1);return i*i*(3-2*i)},n=Math.PI*2,r=2.736,i=e=>.0076+e*.57,a=e=>i(e)*t(.04,.14,e),o=(e,t)=>.8+1.2*e+1.4*Math.min(t,2.5),s=o(.45,.4)*i(.45),c=.45;function l(e,t,n=1){let r=e*(n+c)-c*t;return r>0&&r<n?Math.sin(Math.PI*r)*(r>1?.75:1):0}function u(e){let t=e.seed=e.seed+1831565813>>>0,n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}var d=class{constructor(){this.effort=this.phase=this.pectoralPhase=this.breathPhase=0,this.scull=this.tuck=this.tuckRate=this.back=0,this.pectoralEffort=this.pectoralScull=0,this.bodyHz=o(0,0),this.seed=7071610,this.pectoralHz=2.3,this.pectoralRun=3,this.pectoralPause=0,this.pectoralPower=1,this.breaths={seed:739982445},this.breathRate=1,this.breathDepth=1,this.billowPhase=0,this.wash=1,this.pace=0,this.pushes=this.kicks=0,this.push=this.kick=this.dart=this.brake=0,this.kickAt=1,this.kickSweeps=1,this.hold=0}advance(i,a,s,c=0,l={}){if(i<=0)return;(l.pushes??0)!==this.pushes&&(this.pushes=l.pushes,this.push=Math.max(this.push,l.pushSize??1),this.pectoralPause=0,this.pectoralRun=Math.max(this.pectoralRun,2)),(l.kicks??0)!==this.kicks&&(this.kicks=l.kicks,this.kick=l.kickSize??1,this.kickSweeps=l.kickSweeps??1,this.kickAt=0),this.kickAt=Math.min(1,this.kickAt+i/(.34*this.kickSweeps)),this.push*=Math.exp(-2.2*i),this.dart+=((l.dart??0)-this.dart)*(1-Math.exp(-((l.dart??0)>this.dart?25:5)*i)),this.brake+=((l.brake??0)-this.brake)*(1-Math.exp(-((l.brake??0)>this.brake?20:4)*i)),this.scull+=(Math.max(l.scull??0,this.brake)-this.scull)*(1-Math.exp(-5*i)),this.back+=((l.back??0)-this.back)*(1-Math.exp(-6*i)),this.back>.3&&(this.pectoralPause=0);{let t=Math.max(l.tuck??0,.8*this.dart),n=t?11:4.5,r=this.tuck-t,a=this.tuckRate+n*r,o=Math.exp(-n*i);this.tuck=e(t+(r+a*i)*o,0,1),this.tuckRate=(this.tuckRate-n*a*i)*o}this.pace=Math.max(0,s)/r;let d=l.hold??e(.4*this.scull*(1-t(.2,.6,this.pace))+.4*this.back+.3*this.push,0,1);this.hold+=(d-this.hold)*(1-Math.exp(-(d>this.hold?6:2)*i));let f=t(.065,.4,a),p=e(this.pace/1.2,0,1),m=Math.max(e(f*.8+p*.35+Math.abs(c)*.08,0,1),.9*this.dart);this.effort+=(m-this.effort)*(1-Math.exp(-(this.dart>.1?14:3)*i)),this.bodyHz=o(this.effort,this.pace),this.pectoralEffort+=(this.effort-this.pectoralEffort)*(1-Math.exp(-1.1*i)),this.pectoralScull+=(this.scull-this.pectoralScull)*(1-Math.exp(-2.2*i)),this.pectoralPause>0&&(this.pectoralPause-=i);let h=this.pectoralPause<=0,g=Math.max(this.push,this.brake);this.pectoralPower+=((h?1+.45*g:.14)-this.pectoralPower)*(1-Math.exp(-(h?7:4)*i));let _=this.pectoralPhase;this.pectoralPhase+=i*n*(h?this.pectoralHz*(1+.5*this.back+.3*g):.7),Math.floor(this.pectoralPhase/n)!==Math.floor(_/n)&&this.nextPectoralBeat(h),this.phase+=i*n*this.bodyHz,this.wash+=(this.pectoralPower-this.wash)*(1-Math.exp(-3*i)),this.billowPhase+=i*n*(.55+.4*this.pectoralHz*this.wash+.6*Math.min(this.pace,1.5));let v=this.breathPhase;this.breathPhase+=i*(7+this.effort*4)*this.breathRate,Math.floor(this.breathPhase/n)!==Math.floor(v/n)&&(this.breathRate=.8+.4*u(this.breaths),this.breathDepth=.65+.45*u(this.breaths))}nextPectoralBeat(e){let t=u(this),n=this.pectoralScull,r=this.pectoralEffort;if(this.pectoralHz=(1.5+1.5*t)*(1+.35*r),!e||--this.pectoralRun>0)return;let i=u(this);this.pectoralRun=2+Math.floor(u(this)*(4+3*n)),this.pectoralPause=(.2+1.1*i*i)*(1-.2*n)*(1-.6*r)}get stroke(){let t=1+2*this.dart;return e(Math.max(this.bodyHz*a(this.effort)/s,.15*this.scull,.9*Math.abs(this.kick*l(this.kickAt,1,this.kickSweeps))),0,t)}};let f=(e,t,n)=>Math.max(t,Math.min(n,e)),p=(e,t,n)=>{let r=f((n-e)/(t-e),0,1);return r*r*(3-2*r)},m={strength:0,direction:`changing`};function h(e,t,n,r,i,a,o){let s=0,c=0,l=0;switch(a){case`right`:s=1;break;case`left`:s=-1;break;case`front`:l=1;break;case`back`:l=-1;break;case`up`:c=1;break;case`down`:c=-1;break;default:s=Math.cos(e*.19),l=Math.sin(e*.19),c=.32*Math.sin(e*.31+.8)}let u=i*(.82+.18*Math.sin(e*.73));return o[0]=u*(s+.16*Math.sin(n*1.4+r*.7-e*1.1)),o[1]=u*(c+.12*Math.sin(r*1.2+t*.8+e*.83)),o[2]=u*(l+.17*Math.sin(t*1.6-n*.6-e*.91)),o}let g={step:1/120,passScale:1,maxFrame:.07},_=[.62,.68,.62],v=[.62,.5,.72],y=[.32,.36,.58],b=[.9,1.6,1.3],x=[.26,.08],S=[.8,1.2],C=[8,14],w=[.45,.2],T=[2.5,5],E=[.45,.4,.7,0,.12],D=[.35,.35,.35,.35,.12],O=[.11,.08,.1],k=[9,7,10],A=[.6,1.6],j=[1.2,3.2],M=[.3,1.6],N=[.03,.22],P=[.06,.04,.05],F=.02,I=[[.035,.05],[.04,.06],[.04,.06]],L=[.16,0,.08],R=.3,z=[0,.04,.11],B=[8,1.1];var ee=class{constructor({point:e,kind:t,side:n,columns:r=29,rows:i=17}){Object.assign(this,{kind:t,side:n,columns:r,rows:i}),this.count=r*i,this.rest=new Float32Array(this.count*3),this.roots=new Float32Array(r*3),this.position=new Float32Array(this.count*3),this.previous=new Float32Array(this.count*3),this.target=new Float32Array(this.count*3),this.lastTarget=new Float32Array(this.count*3),this.frameTarget=new Float32Array(this.count*3),this.displayTarget=new Float32Array(this.count*3),this.weights=new Float32Array(this.count),this.displacement=new Float32Array(this.count*4),this.accumulator=0,this.initialized=!1,this.steps=0,this.flow=[0,0,0],this.scratch=[0,0,0];for(let t=0;t<i;t++)for(let n=0;n<r;n++){let a=t*r+n,o=e(n/(r-1),t/(i-1));this.rest.set(o,a*3),t===0&&this.roots.set(o,n*3),this.weights[a]=t===0?0:.25+.75*t/(i-1)}let a=[],o=[],s=(e,t,n,r=!1)=>{let i=Math.hypot(...[0,1,2].map(n=>this.rest[e*3+n]-this.rest[t*3+n]));i>1e-5&&(a.push(e,t,i,n),o.push(+!!r))};for(let e=0;e<i;e++)for(let n=0;n<r;n++){let i=e*r+n;e&&s(i-r,i,.96),n&&s(i-1,i,t<3?.45:.65,!0),e&&n&&(s(i-r-1,i,t<3?.15:.22,!0),s(i-r,i-1,t<3?.15:.22,!0)),e>1&&s(i-r*2,i,t===0?.4:t<3?.2:.12)}this.links=new Float32Array(a),this.folding=new Uint8Array(o),this.linkLengths=new Float32Array(o.length);let c=o.length;this.linkEnds=new Int32Array(c*2),this.linkTerms=new Float64Array(c*4);let l=[];for(let e=0;e<c;e++){let n=a[e*4],r=a[e*4+1];this.linkEnds[e*2]=n*3,this.linkEnds[e*2+1]=r*3,this.linkTerms.set([this.links[e*4+3],this.weights[n]+this.weights[r],this.weights[n],this.weights[r]],e*4),t<3&&o[e]?l.push(e):this.linkLengths[e]=this.links[e*4+2]}this.refolding=Int32Array.from(l),this.rayRest=new Float64Array(this.count),this.restOffset=new Float64Array(this.count*3),this.restAngle=new Float64Array(this.count),this.restSpan=new Float64Array(this.count);for(let e=0;e<i;e++)for(let t=0;t<r;t++){let n=e*r+t,i=n*3,a=i-r*3,o=t*3;e&&(this.rayRest[n]=Math.hypot(this.rest[i]-this.rest[a],this.rest[i+1]-this.rest[a+1],this.rest[i+2]-this.rest[a+2]));let s=this.rest[i]-this.roots[o],c=this.rest[i+1]-this.roots[o+1],l=this.rest[i+2]-this.roots[o+2];this.restOffset[i]=s,this.restOffset[i+1]=c,this.restOffset[i+2]=l,this.restAngle[n]=Math.atan2(c,s),this.restSpan[n]=Math.hypot(s,c)}if(this.rowStiffness=new Float64Array(i),this.rowTerms=new Float64Array(i*4),this.rootFrames=new Float64Array(r*4),this.carried=new Float64Array(this.count*3),this.carriedBy=null,this.carriedAt=-1,this.lowerLobe=new Float64Array(this.count),t===0)for(let e=0;e<this.count;e++)this.lowerLobe[e]=Math.max(0,-Math.sin(this.restAngle[e]));this.open=v[t]??1,this.rays=new Float64Array(r).fill(this.open),this.raysWere=new Float64Array(r).fill(this.open),this.felt=this.feltWas=0,this.raysReady=!1,this.flutterPhase=0,this.seed=24301+t*977+(n+1)*131,this.clock=0,this.flick=this.flickRate=this.splay=0,this.flickAt=.4+2*u(this),this.wander=this.wanderTo=0,this.wanderAt=0,this.flickTip=this.splayTip=this.wanderTip=this.ripple=0,this.tipPhase=new Float64Array(r),this.tipRate=new Float64Array(r);for(let e=0;e<r;e++)this.tipPhase[e]=2*Math.PI*u(this),this.tipRate[e]=3+4*u(this);this.twist=this.twistTo=this.turnLag=0,this.twistAt=0,this.liftAt=2+4*u(this),this.liftUntil=0,this.billow=2*Math.PI*u(this),this.swell=2*Math.PI*u(this),this.pace=this.paceTo=1,this.gust=this.gustTo=.7,this.gustAt=0,this.stir=0,this.lastBillow=this.lastTurn=null,this.rouse=0,this.sag=this.sagTo=0,this.sagAt=0,this.sway=this.swayTo=1,this.stroke=0,this.push=this.brake=0,this.slip=this.slipTo=0,this.slipAt=0,this.own=this.ownTo=1,this.beat=0,this.alone=this.resting=0,this.lastPush=0,this.strokeAt=1,this.strokeSize=0,this.outer=.5,this.kickHold=0,this.wave=0,this.splayWander=this.splayTo=0,this.fan=0,this.lastGait=null,this.fanPower=1,this.still=0,this.work=0,this.undulate=0,this.idle=0,this.trail=0,this.bow=this.bowTo=.25,this.rowMid=new Float64Array(i*3);for(let e=0;e<i;e++)for(let t=0;t<r;t++)for(let n=0;n<3;n++)this.rowMid[e*3+n]+=this.rest[(e*r+t)*3+n]/r;if(this.curl=this.curlRate=0,this.jitPhase=new Float64Array(r),this.jitRate=new Float64Array(r),this.jitAmp=new Float64Array(r),this.jitTo=new Float64Array(r),this.jitAt=new Float64Array(r),t<3)for(let e=0;e<r;e++)this.jitPhase[e]=2*Math.PI*u(this),this.jitRate[e]=6+6*u(this);if(this.ragged={seed:8021741+t*389+(n+1)*71},this.rag=new Float64Array(r),this.ragTo=new Float64Array(r),this.ragAt=new Float64Array(r),this.lumps=[0,0,0].map(()=>2*Math.PI*u(this.ragged)),this.lumpy=new Float64Array(r).fill(1),t<3)for(let e=0;e<r;e++)this.ragTo[e]=this.rag[e]=P[t]*(2*u(this.ragged)-1),this.ragAt[e]=1+5*u(this.ragged);let d=0,f=[0,1,2].map(e=>this.roots.reduce((t,n,r)=>t+(r%3===e?n:0),0)/r);for(let e=0;e<this.count;e++)d=Math.max(d,Math.hypot(this.rest[e*3]-f[0],this.rest[e*3+1]-f[1],this.rest[e*3+2]-f[2]));this.reach=d*1.15+.1,this.touching=/* @__PURE__ */ new Float64Array(256),this.touchCount=0}advancePosture(e,t){let{kind:n}=this,r=t.speed??0,i=p(.08,.6,r),a=()=>u(this),o=t.accel?t.accel[0]:0,s=t.turn??0,c=t.flare??0;this.feltWas=this.felt,this.felt=this.raysReady?this.felt+f(c-this.felt,-T[1]*e,T[0]*e):c,this.push+=(Math.max(p(j[0],j[1],-o),t.dart??0)-this.push)*(1-Math.exp(-9*e)),this.brake+=(Math.max(p(M[0],M[1],o),t.brake??0)-this.brake)*(1-Math.exp(-6*e));let l=this.lastTurn===null?0:Math.abs(s-this.lastTurn)/e;this.lastTurn=s;let d=f(.35*l+.25*Math.hypot(...t.accel??[0,0,0]),0,1.2);this.stir+=(d-this.stir)*(1-Math.exp(-(d>this.stir?6:1.2)*e));let m=t.hold??f(.25+.6*(t.push??0)+.5*this.brake+.4*p(.02,.3,r)+.25*Math.min(1,Math.abs(s))+.15*this.stir,0,1);this.work+=(m-this.work)*(1-Math.exp(-4*e));let h=f(t.curl??Math.tanh(s/1.6),-1,1),g=this.curl;this.curl+=(h-this.curl)*(1-Math.exp(-12*e)),this.curlRate+=((this.curl-g)/e-this.curlRate)*(1-Math.exp(-10*e));let x=t.kick&&(t.kickAt??1)<1?Math.min(1,Math.abs(t.kick)):0,E=f(Math.max(this.stir,x,this.push,this.brake,.6*Math.min(1,Math.abs(this.curlRate)),p(.15,.8,r)),0,1);if(this.rouse+=(E-this.rouse)*(1-Math.exp(-(E>this.rouse?B[0]:B[1])*e)),n<3){let o=n===1?p(.4,1.6,Math.abs(s)):p(.25,1.3,Math.abs(s));this.clock+=e;let c=v[n]+(y[n]-v[n])*Math.max(i,.8*o,this.push)-L[n]*Math.abs(this.curl)+.12*this.brake,l,d=t.billowPhase??0,m=this.lastBillow===null?0:f(d-this.lastBillow,0,1);this.lastBillow=d,this.clock>=this.gustAt&&(this.gustTo=.2+1.3*a()*a(),this.paceTo=.55+.9*a(),this.gustAt=this.clock+.4+1.6*a()),this.gust+=(this.gustTo-this.gust)*(1-Math.exp(-2.2*e)),this.pace+=(this.paceTo-this.pace)*(1-Math.exp(-1.4*e));let h=Math.floor((t.phase??0)/(2*Math.PI));h!==this.stroke&&(this.stroke=h,this.swayTo=.5+.85*a()),this.sway+=(this.swayTo-this.sway)*(1-Math.exp(-5*e));let g=.3+.7*this.rouse;if(this.billow+=m*this.pace*g,this.swell+=m*(1.75-this.pace)*.6*g,n===1){this.clock>=this.liftAt&&(this.liftUntil=this.clock+A[0]+(A[1]-A[0])*a(),this.liftAt=this.liftUntil+4+10*a());let e=+(t.mode===`rest`),n=this.clock<this.liftUntil?1-i:0;c+=(.3-c)*e,c+=(.78-c)*Math.max(o,n)*(1-e),c-=.1*Math.max(this.push,f(this.stir,0,1))*(1-e),l=c>this.open?3.5:1.1}else n===0&&t.mode===`hover`&&(this.clock>=this.sagAt&&(this.sagTo=-.07*a()*a()*1.4+.021*a(),this.sagAt=this.clock+1.2+4*a()),this.sag+=(this.sagTo-this.sag)*(1-Math.exp(-.9*e)),c+=this.sag*(1-i)*(1-o)),l=c<this.open?2.8*(1+this.push):b[n]*(1+1.5*this.brake);let x=c>this.open?S[0]:S[1]*(1+this.push);this.open+=f((c-this.open)*(1-Math.exp(-l*e)),-x*e,x*e);let T=(this.open+(1-this.open)*this.felt)*(1-(_[n]??0)*(t.clamp??0));this.raysWere.set(this.rays);for(let t=0;t<this.columns;t++){let r=t/(this.columns-1),i=n===0?Math.abs(2*r-1):r,a=T>this.rays[t]?0:1,o=C[a]*(1-w[a]*i);this.rays[t]=this.raysReady?this.rays[t]+(T-this.rays[t])*(1-Math.exp(-o*e)):T}let E=(1+.6*Math.min(1,r))*(.15+.85*this.rouse);this.flutterPhase+=e*Math.PI*2*(1+3.5*this.rouse+2*Math.min(1,r));for(let t=0;t<this.columns;t++){if(this.tipPhase[t]+=e*Math.PI*2*this.tipRate[t]*E,this.jitPhase[t]+=e*Math.PI*2*this.jitRate[t]*E,this.clock>=this.jitAt[t]){let e=a();this.jitTo[t]=.15+1.6*e*e,this.jitAt[t]=this.clock+.2+.8*a()}this.clock>=this.ragAt[t]&&(this.ragTo[t]=P[n]*(2*u(this.ragged)-1),this.ragAt[t]=this.clock+2+5*u(this.ragged)),this.rag[t]+=(this.ragTo[t]-this.rag[t])*(1-Math.exp(-.7*e)),this.jitAmp[t]+=(this.jitTo[t]-this.jitAmp[t])*(1-Math.exp(-8*e))}this.undulate+=e*Math.PI*2*1.4*(.8+.4*this.work)*(.35+.65*this.rouse);let D=.15*m*this.pace*g;this.lumps[0]+=.43*D,this.lumps[1]-=.71*D,this.lumps[2]+=.29*D,n===0&&(this.clock>=this.twistAt&&(this.twistTo=a()*2-1,this.twistAt=this.clock+1+2.5*a()),this.twist+=(this.twistTo-this.twist)*(1-Math.exp(-1.2*e)),this.turnLag+=(f(s,-1.5,1.5)-this.turnLag)*(1-Math.exp(-2.5*e)),this.kickHold=t.kick&&(t.kickAt??1)<1?Math.min(1,Math.abs(t.kick))*Math.abs(Math.sin(Math.PI*t.kickAt*(t.kickSweeps??1))):0)}else if(n===3){this.clock+=e,this.clock>=this.slipAt&&(this.slipTo=this.side<0?1.8*(a()*2-1):0,this.slipAt=this.clock+.6+2.2*a()),this.slip+=(this.slipTo-this.slip)*(1-Math.exp(-1.6*e)),this.still+=(p(.5,.9,t.pectoralScull??t.scull??0)*(1-i)-this.still)*(1-Math.exp(-1.2*e));let n=this.still;this.idle+=((t.mode===`rest`?1-i:0)*(1-n)-this.idle)*(1-Math.exp(-1.2*e));let r=this.idle,o=t.pectoralPhase??0,c=this.lastGait===null?0:f(o-this.lastGait,0,3);this.lastGait===null&&(this.fan=o),this.lastGait=o;let l=e*2*Math.PI*2.2*(1+.35*this.work),u=e*2*Math.PI*1.35*(1+.3*this.work);this.fan+=c+n*Math.max(0,Math.max(c*1.15,l)-c)+r*(u-c);let d=this.fan-o,m=d-2*Math.PI*Math.round(d/(2*Math.PI));this.fan-=f(m*(1-Math.max(n,r))*(1-Math.exp(-1.5*e)),-.5*c,.5*c),this.fanPower+=(Math.max(t.pectoralPower??1,n,.8*r)-this.fanPower)*(1-Math.exp(-7*e));let h=Math.floor((this.fan+this.slip)/(2*Math.PI)+(this.side<0?.5:0));h!==this.beat&&(this.beat=h,this.ownTo=1+n*(.42*a()-.28),this.alone<=0&&t.pectoralPower!==void 0&&a()<.09*n&&(this.alone=(.35+.75*a())*(1-.7*n))),this.own+=(this.ownTo-this.own)*(1-Math.exp(-10*e));let g=t.push??0,_=t.body?.steer??s;g>this.lastPush+.05&&(this.strokeAt=0,this.strokeSize=Math.min(1,g)),this.lastPush=g,this.strokeAt=Math.min(1,this.strokeAt+e/.45),this.outer+=(.5-.5*Math.tanh(5*this.side*_)-this.outer)*(1-Math.exp(-14*e)),this.alone=Math.max(0,this.alone-e),this.resting+=(+(this.alone>0)-this.resting)*(1-Math.exp(-7*e))}else if(n===4){if(this.clock+=e,this.flickAt-=e*(2.5*this.stir+2*this.brake),this.clock>=this.flickAt){let e=(9+10*a())*(1-.6*i)*(1-.8*(t.clamp??0));this.flickRate+=e,this.wave+=.012*e,this.flickAt=this.clock+.8+4*a()*a()}let n=Math.exp(-1.7*13*e);if(this.flickRate=(this.flickRate-169*this.flick*e)*n,this.flick+=this.flickRate*e,this.clock>=this.wanderAt){let e=a()*2-1;this.wave+=.05*Math.abs(e-this.wanderTo),this.wanderTo=e,this.wanderAt=this.clock+.3+.9*a(),this.splayTo=a()*2-1,this.bowTo=N[0]+(N[1]-N[0])*a()}this.wander+=(this.wanderTo-this.wander)*(1-Math.exp(-2.5*e)),this.bow+=(this.bowTo-this.bow)*(1-Math.exp(-2.5*e)),this.splayWander+=(this.splayTo-this.splayWander)*(1-Math.exp(-5*e)),this.splay+=(Math.max(this.brake,.5*f(this.flick,0,1))-this.splay)*(1-Math.exp(-6*e));let r=1-Math.exp(-3.5*e);this.flickTip+=(this.flick-this.flickTip)*r,this.splayTip+=(this.splay-this.splayTip)*r,this.wanderTip+=(this.wander-this.wanderTip)*(1-Math.exp(-7*e)),this.wave=Math.min(this.wave,.3)*Math.exp(-2.6*e),this.ripple+=e*Math.PI*2*(.9+1.6*this.rouse+1*i),this.trail+=(i-this.trail)*(1-Math.exp(-1.2*e))}this.raysReady=!0}makeTargets(e,t=this.felt,n=this.rays){let{phase:r,drive:i,turn:a,body:o}=e,s=o.turnBend??Math.tanh(a*.95),{columns:c,rows:u,kind:d,side:m,roots:h,target:g,scratch:_,restOffset:v,rowTerms:y}=this,b=e.clamp??0,S=1-.6*b,C=d===0?(x[0]+(x[1]-x[0])*p(.08,.6,e.speed??0))*(1-t)+.12*b:0,w=.1*(1-t),T=Math.min(e.speed??0,1.2),E=(1-t*.7)*S*(.02+.012*(e.wash??0)+.05*T+.02*Math.min(1,Math.abs(a))+.03*this.rouse)*(this.gust+.6*this.stir),D=E*(1.2-this.gust)*.8,A=d<3?O[d]*S:0,j=f(this.curlRate,-3,3)*(1-.7*t),M=d<3?-.07*j:0,N=d===0?.12*(.6*this.twist-.5*this.turnLag-.2*f(j,-2,2))*(1-.7*t):0,P=d===0&&e.kick?.26*e.kick*l(e.kickAt??1,1,e.kickSweeps??1):0,F=(z[d]??0)*(.6+.6*this.work)*(.25+.75*this.rouse)*(1-.6*p(.08,.6,e.speed??0))*S*(1-.7*t);if(d===3){let t=this.fan+this.slip+(m<0?Math.PI:0),n=e.pectoralEffort??e.effort??i,r=this.strokeAt<1?Math.sin(Math.PI*this.strokeAt):0,o=Math.max(e.tuck??0,this.push),s=this.fanPower*(1-.86*this.resting),c=(.62+.36*n+.05*(e.pectoralScull??e.scull??0))*(1-.35*o)*s*this.own*(1-.3*m*f(a,-1,1)*(1-n))*(1+.25*this.brake)*(1-.6*r)*(1+.2*this.still*(.45+.55*this.work)+.22*this.idle),l=Math.max(0,Math.cos(t)),d=.4*Math.max(0,1-s)*(1-this.brake)-.45*this.brake,p=this.strokeAt<1?.6*this.strokeSize*(.35+.65*this.outer)*Math.sin(2*Math.PI*this.strokeAt):0;for(let e=0;e<u;e++){let n=e/(u-1),r=m*(c*(.48*Math.sin(t)+.18*Math.sin(t-n*1.5)*n)-.12-.13*o-d+p*(.55+.45*n)),i=m*(.41+s*(.9*l-.29))*n;y[e*4]=Math.cos(r),y[e*4+1]=Math.sin(r),y[e*4+2]=Math.cos(i),y[e*4+3]=Math.sin(i)}}else if(d===4){let n=this.trail,r=-t*.16+1.05*b-.26*(1-n),i=R*Math.max(0,-m*this.curl),a=.4*R*Math.abs(this.curl)+1.2*i,o=.45*(e.down?e.down[0]:0),s=1-.8*b;for(let e=0;e<u;e++){let t=e/(u-1),c=t*t,l=p(.4,1,t)**2,d=this.flick+(this.flickTip-this.flick)*c,f=this.splay+(this.splayTip-this.splay)*c,h=this.wander+(this.wanderTip-this.wander)*c,g=r+.34+(.12+.6*n)*(.7+.6*t)-.12-.6*d-.3*f-.35*this.brake+.42*h*s-a+this.bow*(t-.3)+o+.25*this.push*t+(.03+.07*this.rouse+this.wave)*l*Math.sin(this.ripple-t*4);y[e*4]=m*t*(.2*(1-.5*this.push)+.2*f+.22*this.splayWander*s+.5*a+.6*i)+.025*(.4+.6*this.rouse)*l*Math.sin(.7*this.ripple-t*3+m),y[e*4+1]=Math.cos(g),y[e*4+2]=Math.sin(g)}}let I=this.lumps;for(let e=0;e<c;e++){let t=e/(c-1),a=e*3,l=d<3?n[e]:1,m=A*(.15+.85*Math.sqrt(f(1-l*l,0,1)))*Math.sin(t*Math.PI*k[d]+d),x=d<3?1+.5*(.6*Math.sin(9.4*t+I[0])+.4*Math.sin(21*t+I[1])):1,S=d<3?1.1*Math.sin(5.1*t+I[2]):0;this.lumpy[e]=x,o.frame(h[a],_);let T=_[2],O=_[3];o.transform(h[a],h[a+1],h[a+2],_);let j=_[0],L=_[1],R=_[2];for(let n=0;n<u;n++){let o=n/(u-1),f=n*c+e,h=f*3,_=v[h],k=v[h+1],A=v[h+2];if(d<3){let e=this.restAngle[f]*l-C-w*this.lowerLobe[f],n=this.restSpan[f];_=n*Math.cos(e),k=n*Math.sin(e),A=0;let a=d===0?(.004+i*.4)*this.sway*Math.sin(r-2.5-o*.8):(d===1?.004+i*.05:.006+i*.13)*this.sway*Math.sin(r*.8-t*3.7-o*.7+d*1.8)+s*(.2+t*.2)*(.3+.7*o)*(d===1?.5:1)+.6*M*t*o+F*(d===1?.25+.75*t:1)*Math.sin(this.undulate-t*7-o*.6+d),c=x*(E*Math.sin(this.billow-t*5.5-S-o*2.2+d*1.8)+D*Math.sin(this.swell+t*3.1-o*1.6)),u=Math.sin(this.restAngle[f]),p=(a+c)*(.1+.9*o**1.5)+m+N*u,h=Math.hypot(_,k),g=Math.cos(p);if(_*=g,k*=g,A+=h*Math.sin(p),d===0){let e=s*o*(.1+.12*Math.abs(u))+P*(.6+.4*o)+M*o**1.5,t=Math.cos(e),n=Math.sin(e),r=_*t-A*n;A=_*n+A*t,_=r}}else if(d===3){let e=_*y[n*4]-A*y[n*4+1];A=_*y[n*4+1]+A*y[n*4],_=e;let t=k*y[n*4+2]-A*y[n*4+3];A=k*y[n*4+3]+A*y[n*4+2],k=t}else{let e=1-.44999999999999996*p(0,.35,o),t=this.rowMid,r=this.roots[a],i=this.roots[a+1],s=this.roots[a+2];_=t[n*3]+(r+_-t[n*3])*e-r,k=t[n*3+1]+(i+k-t[n*3+1])*e-i,A=t[n*3+2]+(s+A-t[n*3+2])*e-s;let c=y[n*4+1],l=y[n*4+2],u=_*c-k*l;k=_*l+k*c,_=u,A=(A+y[n*4])*(1-.6*b)}g[h]=j+_*T-A*O,g[h+1]=L+k,g[h+2]=R+_*O+A*T}}}advance(e,t){e>0&&this.advancePosture(e,t),this.lastTarget.set(this.target);let n=!1;if(e>0&&this.initialized&&this.kind<3){n=Math.abs(this.felt-this.feltWas)>1e-8;for(let e=0;e<this.columns&&!n;e++)n=Math.abs(this.rays[e]-this.raysWere[e])>1e-8}if(n&&(this.makeTargets(t,this.feltWas,this.raysWere),this.displayTarget.set(this.target)),this.makeTargets(t),n)for(let e=this.columns*3;e<this.position.length;e++){let t=this.target[e]-this.displayTarget[e];this.position[e]+=t,this.previous[e]+=t,this.lastTarget[e]+=t}this.initialized||=(this.position.set(this.target),this.previous.set(this.target),this.lastTarget.set(this.target),!0),this.frameTarget.set(this.target),this.findSolids(t.solids),this.accumulator+=Math.min(e,g.maxFrame);let r=g.step,i=Math.floor((this.accumulator+1e-10)/r),a=0,{target:o,lastTarget:s,frameTarget:c}=this;for(;a<i;){let e=++a/i;if(a===i)o.set(c);else for(let t=0;t<o.length;t++)o[t]=s[t]+(c[t]-s[t])*e;this.integrate(r,t),this.accumulator=Math.max(0,this.accumulator-r),this.steps++}if(o.set(c),!a&&this.steps)return;let{position:l,rest:u,scratch:d,displacement:f,carried:p}=this;for(let e=0;e<this.count;e++){t.body.transform(u[e*3],u[e*3+1],u[e*3+2],d);for(let t=0;t<3;t++)p[e*3+t]=d[t],f[e*4+t]=l[e*3+t]-d[t]}this.kind<3&&(this.straighten(t),this.flutter(t)),this.keepClear(t),this.carriedBy=t.body,this.carriedAt=t.body.revision}straighten(e){let{columns:t,rows:n,position:r,carried:i,displacement:a,touching:o}=this,[s,c]=I[this.kind],l=typeof e.surfaceY==`number`,u=e.down,d=u?-u[0]:0,m=u?-u[1]:1,h=u?-u[2]:0,g=e.surfaceY-F;for(let e=0;e<t;e++){let u=e*3,_=r[u],v=r[u+1],y=r[u+2],b=0,x=0,S=0,C=0,w=0;for(let i=1;i<n;i++){let a=(i*t+e)*3,o=i/(n-1);b+=(r[a]-_)*o,x+=(r[a+1]-v)*o,S+=(r[a+2]-y)*o}let T=Math.sqrt(b*b+x*x+S*S);if(!(T<1e-7)){b/=T,x/=T,S/=T;for(let u=1;u<n;u++){let T=(u*t+e)*3,E=T-t*3,D=u/(n-1);C+=Math.sqrt((r[T]-r[E])**2+(r[T+1]-r[E+1])**2+(r[T+2]-r[E+2])**2);let O=r[T]-_-b*C,k=r[T+1]-v-x*C,A=r[T+2]-y-S*C,j=Math.sqrt(O*O+k*k+A*A),M=C/D*(s*4*D*(1-D)+c*D*D*D)+1e-6;if(j<=M&&!w)continue;let N=Math.min(1,M/j),P=_+b*C+O*N,F=v+x*C+k*N,I=y+S*C+A*N,L=l?d*P+m*F+h*I-g:0;for(let e=0;e<this.touchCount;e++){let t=e*8,n=o[t],r=o[t+1],i=o[t+2],a=o[t+3],s=o[t+4],c=o[t+5],l=f(((P-n)*a+(F-r)*s+(I-i)*c)*o[t+6],0,1);L=Math.max(L,o[t+7]-Math.hypot(P-n-a*l,F-r-s*l,I-i-c*l))}let R=w=Math.max(w,p(-.12,.12,L)),z=(u*t+e)*4;a[z]=P+(r[T]-P)*R-i[T],a[z+1]=F+(r[T+1]-F)*R-i[T+1],a[z+2]=I+(r[T+2]-I)*R-i[T+2]}}}}flutter(e){let{columns:t,rows:n,position:r,displacement:i,tipPhase:a,rag:o,lumpy:s}=this,c=(1-.5*this.felt)*(1-.5*(e.clamp??0)),l=Math.min(1,e.speed??0),u=this.rouse,d=c*(.002+.022*u+.01*l),f=c*(.002+.014*u+.006*l),m=c*.075*(.06+.7*u+.2*l),{jitPhase:h,jitAmp:g}=this;for(let e=Math.ceil((n-1)*.6);e<n;e++){let l=e/(n-1),u=p(.6,1,l)**1.5;for(let n=0;n<t;n++){let _=e*t+n,v=_*3,y=n/(t-1),b=(e*t+Math.max(0,n-1))*3,x=(e*t+Math.min(t-1,n+1))*3,S=v-t*3,C=r[x]-r[b],w=r[x+1]-r[b+1],T=r[x+2]-r[b+2],E=r[v]-r[S],D=r[v+1]-r[S+1],O=r[v+2]-r[S+2],k=w*O-T*D,A=T*E-C*O,j=C*D-w*E,M=Math.abs(y-.5),N=.65*Math.sin(this.flutterPhase-M*18+l*4)+.35*Math.sin(.61*this.flutterPhase-y*17+a[n]*.3),P=p(.7,1,l)**2*m*g[n]*(.7*Math.sin(h[n])+.3*Math.sin(1.9*a[n]+n)),F=(u*d*N*s[n]+P)/(Math.sqrt(k*k+A*A+j*j)||1),I=(u*f*Math.sin(a[n]+l*2)+.45*P)/(Math.sqrt(C*C+w*w+T*T)||1),L=(.25*P+c*o[n]*p(.75,1,l)**2)/(Math.sqrt(E*E+D*D+O*O)||1);i[_*4]+=k*F+C*I+E*L,i[_*4+1]+=A*F+w*I+D*L,i[_*4+2]+=j*F+T*I+O*L}}}keepClear(e){let{carried:t,displacement:n,touching:r,columns:i}=this,a=typeof e.surfaceY==`number`,o=e.down;if(!a&&!this.touchCount)return;let s=o?-o[0]:0,c=o?-o[1]:1,l=o?-o[2]:0,u=e.surfaceY-F;for(let e=i;e<this.count;e++){let i=e*3,o=e*4,d=t[i]+n[o],p=t[i+1]+n[o+1],m=t[i+2]+n[o+2];for(let e=0;e<this.touchCount;e++){let t=e*8,n=r[t],i=r[t+1],a=r[t+2],o=r[t+3],s=r[t+4],c=r[t+5],l=r[t+7],u=f(((d-n)*o+(p-i)*s+(m-a)*c)*r[t+6],0,1),h=n+o*u,g=i+s*u,_=a+c*u,v=d-h,y=p-g,b=m-_,x=v*v+y*y+b*b;if(x>=l*l||x<1e-18)continue;let S=l/Math.sqrt(x);d=h+v*S,p=g+y*S,m=_+b*S}if(a){let e=s*d+c*p+l*m-u;e>0&&(d-=s*e,p-=c*e,m-=l*e)}n[o]=d-t[i],n[o+1]=p-t[i+1],n[o+2]=m-t[i+2]}}findSolids(e){if(this.touchCount=0,!e)return;let{target:t,columns:n,touching:r}=this,i=0,a=0,o=0;for(let e=0;e<n;e++)i+=t[e*3],a+=t[e*3+1],o+=t[e*3+2];i/=n,a/=n,o/=n;for(let t=0;t<e.count;t++){let n=e.data,s=t*7,c=n[s],l=n[s+1],u=n[s+2],d=n[s+3]-c,p=n[s+4]-l,m=n[s+5]-u,h=n[s+6],g=d*d+p*p+m*m,_=g>1e-12?1/g:0,v=f(((i-c)*d+(a-l)*p+(o-u)*m)*_,0,1);if(Math.hypot(i-c-d*v,a-l-p*v,o-u-m*v)>this.reach+h)continue;let y=this.touchCount++*8;r[y]=c,r[y+1]=l,r[y+2]=u,r[y+3]=d,r[y+4]=p,r[y+5]=m,r[y+6]=_,r[y+7]=h}}integrate(e,t){let{position:n,previous:r,target:i,columns:a,rows:o,flow:s,linkLengths:c,linkEnds:l,linkTerms:u}=this,{heading:d,velocity:p,angularVelocity:m,origin:_,strength:v,direction:y,time:b,localHydrodynamics:x}=t,S=Math.cos(d),C=Math.sin(d),w=e*e,T=this.rowStiffness,O=t.clamp??0;for(let e=1;e<o;e++){let t=e/(o-1);T[e]=this.kind<3?(this.kind?9:14)+300*(1-t)**2+this.felt*(5+22*(1-t)**2)+O*(6+20*(1-t)**2):this.kind===4?6+12*O+200*(1-t)**2:5+(this.kind===3?160:110)*(1-t)**3}let k=t.down,A=t.accel,j=E[this.kind],M=(k?k[0]:0)*j-(A?A[0]:0)*D[this.kind],N=(k?k[1]:-1)*j-(A?A[1]:0)*D[this.kind],P=(k?k[2]:0)*j-(A?A[2]:0)*D[this.kind],I=Math.exp(-(this.kind===4?4.5:this.kind===3?2.2:10)*e);for(let e=0;e<a*3;e++)n[e]=r[e]=i[e];for(let c=1;c<o;c++)for(let l=0;l<a;l++){let u=(c*a+l)*3,d=(c*a+Math.max(0,l-1))*3,g=(c*a+Math.min(a-1,l+1))*3,E=((c-1)*a+l)*3,D=(Math.min(o-1,c+1)*a+l)*3,O=n[g]-n[d],k=n[g+1]-n[d+1],A=n[g+2]-n[d+2],j=n[D]-n[E],F=n[D+1]-n[E+1],L=n[D+2]-n[E+2],R=k*L-A*F,z=A*j-O*L,B=O*F-k*j,ee=Math.sqrt(R*R+z*z+B*B)||1;R/=ee,z/=ee,B/=ee;let te,ne,re;if(x){let{flow:t,velocity:i,angular:a}=x;te=t[0]-i[0]-(a[1]*n[u+2]-a[2]*n[u+1])-(n[u]-r[u])/e,ne=t[1]-i[1]-(a[2]*n[u]-a[0]*n[u+2])-(n[u+1]-r[u+1])/e,re=t[2]-i[2]-(a[0]*n[u+1]-a[1]*n[u])-(n[u+2]-r[u+2])/e}else{let i=S*n[u]+C*n[u+2],a=-C*n[u]+S*n[u+2];if(t.externalFlow)for(let e=0;e<3;e++)s[e]=t.externalFlow[e];else h(b,i+_[0],n[u+1]+_[1],a+_[2],v,y,s);let o=s[0]-p[0],c=s[2]-p[2];te=S*o-C*c-m*n[u+2]-(n[u]-r[u])/e,ne=s[1]-p[1]-(n[u+1]-r[u+1])/e,re=C*o+S*c+m*n[u]-(n[u+2]-r[u+2])/e}let ie=f(te*R+ne*z+re*B,-2,2),ae=ie*(2.6+Math.abs(ie)*3.5),oe=T[c],se=R*ae+te*.3+M,ce=z*ae+ne*.3+N,le=B*ae+re*.3+P,ue=n[u],V=f((i[u]-ue)*oe+se,-80,80);n[u]+=(ue-r[u])*I+V*w,r[u]=ue,ue=n[u+1],V=f((i[u+1]-ue)*oe+ce,-80,80),n[u+1]+=(ue-r[u+1])*I+V*w,r[u+1]=ue,ue=n[u+2],V=f((i[u+2]-ue)*oe+le,-80,80),n[u+2]+=(ue-r[u+2])*I+V*w,r[u+2]=ue}for(let e=0;e<this.refolding.length;e++){let t=this.refolding[e],n=l[t*2],r=l[t*2+1];c[t]=Math.hypot(i[r]-i[n],i[r+1]-i[n+1],i[r+2]-i[n+2])}let L=Math.max(3,Math.round((this.kind===3?12:8)*g.passScale)),R=c.length;for(let e=0;e<L;e++){let t=this.kind===3?.5:this.kind===0?.25*this.kickHold:0;if(t&&e<4)for(let e=1;e<o;e++){let r=e/(o-1),s=this.kind===3?f((r-.22)/.55,0,1):f((r-.3)/.6,0,1),c=t*(1-s*s*(3-2*s));for(let t=0;t<a;t++)for(let r=0;r<3;r++){let o=(e*a+t)*3+r;n[o]+=(i[o]-n[o])*c}}let r=e%2==1;for(let e=0;e<R;e++){let t=r?R-1-e:e,i=l[t*2],a=l[t*2+1],o=n[a]-n[i],s=n[a+1]-n[i+1],d=n[a+2]-n[i+2],f=Math.sqrt(o*o+s*s+d*d),p=u[t*4+1];if(f<1e-7||!p)continue;let m=(f-c[t])/f*u[t*4]/p,h=m*u[t*4+2],g=m*u[t*4+3];n[i]+=o*h,n[i+1]+=s*h,n[i+2]+=d*h,n[a]-=o*g,n[a+1]-=s*g,n[a+2]-=d*g}}if(this.kind!==3)for(let e=1;e<o;e++)for(let t=0;t<a;t++){let r=e*a+t,i=r*3,o=i-a*3,s=n[i]-n[o],c=n[i+1]-n[o+1],l=n[i+2]-n[o+2],u=Math.hypot(s,c,l),d=this.rayRest[r];if(u>1e-7&&d>1e-7){let e=f(u,d*.94,d*1.06)/u;n[i]=n[o]+s*e,n[i+1]=n[o+1]+c*e,n[i+2]=n[o+2]+l*e}}if(t.bodyRadius&&this.side){let e=this.rootFrames,i=this.scratch;for(let n=0;n<a;n++)t.body.frame(this.roots[n*3],i),e[n*4]=i[0],e[n*4+1]=i[1],e[n*4+2]=i[2],e[n*4+3]=i[3];for(let o=a;o<this.count;o++){let s=o*3,c=o%a,l=this.roots[c*3],u=e[c*4],d=e[c*4+1],f=e[c*4+2],p=e[c*4+3],m=l+(n[s]-u)*f+(n[s+2]-d)*p,h=t.bodyRadius(m,n[s+1]);t.body.frame(m,i);let g=i[0],_=i[1],v=i[2],y=i[3],b=-(n[s]-g)*y+(n[s+2]-_)*v;if(h>0&&b*this.side<h+.009){let e=this.side*(h+.009)-b;n[s]-=y*e,n[s+2]+=v*e,r[s]=n[s],r[s+2]=n[s+2]}}}let z=this.touching;for(let e=0;e<this.touchCount;e++){let t=e*8,i=z[t],o=z[t+1],s=z[t+2],c=z[t+3],l=z[t+4],u=z[t+5],d=z[t+6],p=z[t+7];for(let e=a*3;e<n.length;e+=3){let t=f(((n[e]-i)*c+(n[e+1]-o)*l+(n[e+2]-s)*u)*d,0,1),a=i+c*t,m=o+l*t,h=s+u*t,g=n[e]-a,_=n[e+1]-m,v=n[e+2]-h,y=g*g+_*_+v*v;if(y>=p*p||y<1e-18)continue;let b=p/Math.sqrt(y);n[e]=r[e]=a+g*b,n[e+1]=r[e+1]=m+_*b,n[e+2]=r[e+2]=h+v*b}}if(typeof t.surfaceY==`number`){let e=k?-k[0]:0,i=k?-k[1]:1,o=k?-k[2]:0,s=t.surfaceY-F;for(let t=a*3;t<n.length;t+=3){let a=e*n[t]+i*n[t+1]+o*n[t+2]-s;if(a<=0)continue;n[t]-=e*a,n[t+1]-=i*a,n[t+2]-=o*a;let c=e*(n[t]-r[t])+i*(n[t+1]-r[t+1])+o*(n[t+2]-r[t+2]);c>0&&(r[t]+=e*c,r[t+1]+=i*c,r[t+2]+=o*c)}}}metrics(){let e=0,t=0,n=0;for(let t=0;t<this.count;t++)if(e=Math.max(e,Math.hypot(...this.displacement.subarray(t*4,t*4+3))),t<this.columns)for(let e=0;e<3;e++)n=Math.max(n,Math.abs(this.position[t*3+e]-this.target[t*3+e]));for(let e=this.columns;e<this.count;e++){let n=(e-this.columns)*3,r=e*3,i=Math.hypot(...[0,1,2].map(e=>this.rest[n+e]-this.rest[r+e]));i>.005&&(t=Math.max(t,Math.abs(Math.hypot(...[0,1,2].map(e=>this.position[n+e]-this.position[r+e]))/i-1)))}return{kind:this.kind,side:this.side,maxDisplacement:e,maxRayStrain:t,anchorError:n,steps:this.steps}}}
/**
* @license
* Copyright 2010-2026 Three.js Authors
* SPDX-License-Identifier: MIT
*/
;let te=1e3,ne=1001,re=1002,ie=1003,ae=1015,oe=1023,se=2300,ce=2301,le=2302,ue=2303,V=2400,de=2401,H=2402,fe=`srgb`,U=`srgb-linear`,pe=`linear`,me=7680,he=2e3;function ge(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function _e(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function ve(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}let ye={};function be(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function W(...e){e=be(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function G(...e){e=be(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function xe(...e){let t=e.join(` `);t in ye||(ye[t]=!0,W(...e))}var Se=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}};let Ce=/* @__PURE__ */ `00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),we=1234567,Te=Math.PI/180,Ee=180/Math.PI;function De(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Ce[e&255]+Ce[e>>8&255]+Ce[e>>16&255]+Ce[e>>24&255]+`-`+Ce[t&255]+Ce[t>>8&255]+`-`+Ce[t>>16&15|64]+Ce[t>>24&255]+`-`+Ce[n&63|128]+Ce[n>>8&255]+`-`+Ce[n>>16&255]+Ce[n>>24&255]+Ce[r&255]+Ce[r>>8&255]+Ce[r>>16&255]+Ce[r>>24&255]).toLowerCase()}function K(e,t,n){return Math.max(t,Math.min(n,e))}function Oe(e,t){return(e%t+t)%t}function ke(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function Ae(e,t,n){return e===t?0:(n-e)/(t-e)}function je(e,t,n){return(1-n)*e+n*t}function Me(e,t,n,r){return je(e,t,1-Math.exp(-n*r))}function Ne(e,t=1){return t-Math.abs(Oe(e,t*2)-t)}function Pe(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function Fe(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function Ie(e,t){return e+Math.floor(Math.random()*(t-e+1))}function Le(e,t){return e+Math.random()*(t-e)}function Re(e){return e*(.5-Math.random())}function ze(e){e!==void 0&&(we=e);let t=we+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Be(e){return e*Te}function Ve(e){return e*Ee}function He(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Ue(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function We(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Ge(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:W(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Ke(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function qe(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}let Je={DEG2RAD:Te,RAD2DEG:Ee,generateUUID:De,clamp:K,euclideanModulo:Oe,mapLinear:ke,inverseLerp:Ae,lerp:je,damp:Me,pingpong:Ne,smoothstep:Pe,smootherstep:Fe,randInt:Ie,randFloat:Le,randFloatSpread:Re,seededRandom:ze,degToRad:Be,radToDeg:Ve,isPowerOfTwo:He,ceilPowerOfTwo:Ue,floorPowerOfTwo:We,setQuaternionFromProperEuler:Ge,normalize:qe,denormalize:Ke};var Ye=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=K(this.x,e.x,t.x),this.y=K(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=K(this.x,e,t),this.y=K(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(K(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(K(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Xe=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:W(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(K(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},q=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Qe.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Qe.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=K(this.x,e.x,t.x),this.y=K(this.y,e.y,t.y),this.z=K(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=K(this.x,e,t),this.y=K(this.y,e,t),this.z=K(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(K(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ze.copy(this).projectOnVector(e),this.sub(Ze)}reflect(e){return this.sub(Ze.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(K(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};let Ze=/*@__PURE__*/ new q,Qe=/*@__PURE__*/ new Xe;var J=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return xe(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply($e.makeScale(e,t)),this}rotate(e){return xe(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply($e.makeRotation(-e)),this}translate(e,t){return xe(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply($e.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};let $e=/*@__PURE__*/ new J,et=/*@__PURE__*/ new J().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),tt=/*@__PURE__*/ new J().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function nt(){let e={enabled:!0,workingColorSpace:U,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=it(e.r),e.g=it(e.g),e.b=it(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=at(e.r),e.g=at(e.g),e.b=at(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?pe:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return xe(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return xe(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[U]:{primaries:t,whitePoint:r,transfer:pe,toXYZ:et,fromXYZ:tt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:fe},outputColorSpaceConfig:{drawingBufferColorSpace:fe}},[fe]:{primaries:t,whitePoint:r,transfer:`srgb`,toXYZ:et,fromXYZ:tt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:fe}}}),e}let rt=/*@__PURE__*/ nt();function it(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function at(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}let ot;var st=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ot===void 0&&(ot=ve(`canvas`)),ot.width=e.width,ot.height=e.height;let t=ot.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=ot}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=ve(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=it(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(it(t[e]/255)*255):t[e]=it(t[e]);return{data:t,width:e.width,height:e.height}}return W(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}};let ct=0;var lt=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:ct++}),this.uuid=De(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(ut(r[t].image)):e.push(ut(r[t]))}else e=ut(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function ut(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?st.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(W(`Texture: Unable to serialize Texture.`),{})}let dt=0,ft=/*@__PURE__*/ new q;var pt=class e extends Se{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=ne,i=ne,a=1006,o=1008,s=oe,c=1009,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:dt++}),this.uuid=De(),this.name=``,this.source=new lt(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new Ye(0,0),this.repeat=new Ye(1,1),this.center=new Ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new J,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ft).x}get height(){return this.source.getSize(ft).y}get depth(){return this.source.getSize(ft).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){W(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?W(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case te:e.x-=Math.floor(e.x);break;case ne:e.x=e.x<0?0:1;break;case re:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case te:e.y-=Math.floor(e.y);break;case ne:e.y=e.y<0?0:1;break;case re:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};pt.DEFAULT_IMAGE=null,pt.DEFAULT_MAPPING=300,pt.DEFAULT_ANISOTROPY=1;var mt=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=K(this.x,e.x,t.x),this.y=K(this.y,e.y,t.y),this.z=K(this.z,e.z,t.z),this.w=K(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=K(this.x,e,t),this.y=K(this.y,e,t),this.z=K(this.z,e,t),this.w=K(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(K(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ht=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/gt.setFromMatrixColumn(e,0).length(),i=1/gt.setFromMatrixColumn(e,1).length(),a=1/gt.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(vt,e,yt)}lookAt(e,t,n){let r=this.elements;return St.subVectors(e,t),St.lengthSq()===0&&(St.z=1),St.normalize(),bt.crossVectors(n,St),bt.lengthSq()===0&&(Math.abs(n.z)===1?St.x+=1e-4:St.z+=1e-4,St.normalize(),bt.crossVectors(n,St)),bt.normalize(),xt.crossVectors(St,bt),r[0]=bt.x,r[4]=xt.x,r[8]=St.x,r[1]=bt.y,r[5]=xt.y,r[9]=St.y,r[2]=bt.z,r[6]=xt.z,r[10]=St.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],F=r[11],I=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*F,i[12]=a*w+o*O+s*M+c*I,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*F,i[13]=l*w+u*O+d*M+f*I,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*F,i[14]=p*w+m*O+h*M+g*I,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*F,i[15]=_*w+v*O+y*M+b*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=gt.set(r[0],r[1],r[2]).length(),o=gt.set(r[4],r[5],r[6]).length(),s=gt.set(r[8],r[9],r[10]).length();i<0&&(a=-a),_t.copy(this);let c=1/a,l=1/o,u=1/s;return _t.elements[0]*=c,_t.elements[1]*=c,_t.elements[2]*=c,_t.elements[4]*=l,_t.elements[5]*=l,_t.elements[6]*=l,_t.elements[8]*=u,_t.elements[9]*=u,_t.elements[10]*=u,t.setFromRotationMatrix(_t),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=he,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=he,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};let gt=/*@__PURE__*/ new q,_t=/*@__PURE__*/ new ht,vt=/*@__PURE__*/ new q(0,0,0),yt=/*@__PURE__*/ new q(1,1,1),bt=/*@__PURE__*/ new q,xt=/*@__PURE__*/ new q,St=/*@__PURE__*/ new q,Ct=/*@__PURE__*/ new ht,wt=/*@__PURE__*/ new Xe;var Tt=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(K(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-K(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(K(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-K(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(K(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-K(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:W(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ct.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ct,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return wt.setFromEuler(this),this.setFromQuaternion(wt,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Tt.DEFAULT_ORDER=`XYZ`;var Et=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}};let Dt=0,Ot=/*@__PURE__*/ new q,kt=/*@__PURE__*/ new Xe,At=/*@__PURE__*/ new ht,jt=/*@__PURE__*/ new q,Mt=/*@__PURE__*/ new q,Nt=/*@__PURE__*/ new q,Pt=/*@__PURE__*/ new Xe,Ft=/*@__PURE__*/ new q(1,0,0),It=/*@__PURE__*/ new q(0,1,0),Lt=/*@__PURE__*/ new q(0,0,1),Rt={type:`added`},zt={type:`removed`},Bt={type:`childadded`,child:null},Vt={type:`childremoved`,child:null};var Ht=class e extends Se{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Dt++}),this.uuid=De(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new q,n=new Tt,r=new Xe,i=new q(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ht},normalMatrix:{value:new J}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Et,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return kt.setFromAxisAngle(e,t),this.quaternion.multiply(kt),this}rotateOnWorldAxis(e,t){return kt.setFromAxisAngle(e,t),this.quaternion.premultiply(kt),this}rotateX(e){return this.rotateOnAxis(Ft,e)}rotateY(e){return this.rotateOnAxis(It,e)}rotateZ(e){return this.rotateOnAxis(Lt,e)}translateOnAxis(e,t){return Ot.copy(e).applyQuaternion(this.quaternion),this.position.add(Ot.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ft,e)}translateY(e){return this.translateOnAxis(It,e)}translateZ(e){return this.translateOnAxis(Lt,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(At.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?jt.copy(e):jt.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Mt.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?At.lookAt(Mt,jt,this.up):At.lookAt(jt,Mt,this.up),this.quaternion.setFromRotationMatrix(At),r&&(At.extractRotation(r.matrixWorld),kt.setFromRotationMatrix(At),this.quaternion.premultiply(kt.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(G(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Rt),Bt.child=e,this.dispatchEvent(Bt),Bt.child=null):G(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(zt),Vt.child=e,this.dispatchEvent(Vt),Vt.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),At.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),At.multiply(e.parent.matrixWorld)),e.applyMatrix4(At),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Rt),Bt.child=e,this.dispatchEvent(Bt),Bt.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mt,e,Nt),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mt,Pt,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};Ht.DEFAULT_UP=/*@__PURE__*/ new q(0,1,0),Ht.DEFAULT_MATRIX_AUTO_UPDATE=!0,Ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ut=class extends Ht{constructor(){super(),this.isGroup=!0,this.type=`Group`}};let Wt={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gt={h:0,s:0,l:0},Kt={h:0,s:0,l:0};function qt(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var Jt=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=fe){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=rt.workingColorSpace){return this.r=e,this.g=t,this.b=n,rt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=rt.workingColorSpace){if(e=Oe(e,1),t=K(t,0,1),n=K(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=qt(i,r,e+1/3),this.g=qt(i,r,e),this.b=qt(i,r,e-1/3)}return rt.colorSpaceToWorking(this,r),this}setStyle(e,t=fe){function n(t){t!==void 0&&parseFloat(t)<1&&W(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:W(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);W(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=fe){let n=Wt[e.toLowerCase()];return n===void 0?W(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=it(e.r),this.g=it(e.g),this.b=it(e.b),this}copyLinearToSRGB(e){return this.r=at(e.r),this.g=at(e.g),this.b=at(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=fe){return rt.workingToColorSpace(Yt.copy(this),e),Math.round(K(Yt.r*255,0,255))*65536+Math.round(K(Yt.g*255,0,255))*256+Math.round(K(Yt.b*255,0,255))}getHexString(e=fe){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=rt.workingColorSpace){rt.workingToColorSpace(Yt.copy(this),t);let n=Yt.r,r=Yt.g,i=Yt.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=rt.workingColorSpace){return rt.workingToColorSpace(Yt.copy(this),t),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=fe){rt.workingToColorSpace(Yt.copy(this),e);let t=Yt.r,n=Yt.g,r=Yt.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Gt),this.setHSL(Gt.h+e,Gt.s+t,Gt.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Gt),e.getHSL(Kt);let n=je(Gt.h,Kt.h,t),r=je(Gt.s,Kt.s,t),i=je(Gt.l,Kt.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}};let Yt=/*@__PURE__*/ new Jt;Jt.NAMES=Wt;let Xt=/*@__PURE__*/ new q,Zt=/*@__PURE__*/ new q,Qt=/*@__PURE__*/ new q,$t=/*@__PURE__*/ new q,en=/*@__PURE__*/ new q,tn=/*@__PURE__*/ new q,nn=/*@__PURE__*/ new q,rn=/*@__PURE__*/ new q,an=/*@__PURE__*/ new q,on=/*@__PURE__*/ new q,sn=/*@__PURE__*/ new mt,cn=/*@__PURE__*/ new mt,ln=/*@__PURE__*/ new mt;var un=class e{constructor(e=new q,t=new q,n=new q){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Xt.subVectors(e,t),r.cross(Xt);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Xt.subVectors(r,t),Zt.subVectors(n,t),Qt.subVectors(e,t);let a=Xt.dot(Xt),o=Xt.dot(Zt),s=Xt.dot(Qt),c=Zt.dot(Zt),l=Zt.dot(Qt),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,$t)!==null&&$t.x>=0&&$t.y>=0&&$t.x+$t.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,$t)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,$t.x),s.addScaledVector(a,$t.y),s.addScaledVector(o,$t.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return sn.setScalar(0),cn.setScalar(0),ln.setScalar(0),sn.fromBufferAttribute(e,t),cn.fromBufferAttribute(e,n),ln.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(sn,i.x),a.addScaledVector(cn,i.y),a.addScaledVector(ln,i.z),a}static isFrontFacing(e,t,n,r){return Xt.subVectors(n,t),Zt.subVectors(e,t),Xt.cross(Zt).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xt.subVectors(this.c,this.b),Zt.subVectors(this.a,this.b),Xt.cross(Zt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;en.subVectors(r,n),tn.subVectors(i,n),rn.subVectors(e,n);let s=en.dot(rn),c=tn.dot(rn);if(s<=0&&c<=0)return t.copy(n);an.subVectors(e,r);let l=en.dot(an),u=tn.dot(an);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(en,a);on.subVectors(e,i);let f=en.dot(on),p=tn.dot(on);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(tn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return nn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(nn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(en,a).addScaledVector(tn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},dn=class{constructor(e=new q(1/0,1/0,1/0),t=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(pn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(pn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=pn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,pn):pn.fromBufferAttribute(r,t),pn.applyMatrix4(e.matrixWorld),this.expandByPoint(pn);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),mn.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),mn.copy(e.boundingBox)),mn.applyMatrix4(e.matrixWorld),this.union(mn)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,pn),pn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(xn),Sn.subVectors(this.max,xn),hn.subVectors(e.a,xn),gn.subVectors(e.b,xn),_n.subVectors(e.c,xn),vn.subVectors(gn,hn),yn.subVectors(_n,gn),bn.subVectors(hn,_n);let t=[0,-vn.z,vn.y,0,-yn.z,yn.y,0,-bn.z,bn.y,vn.z,0,-vn.x,yn.z,0,-yn.x,bn.z,0,-bn.x,-vn.y,vn.x,0,-yn.y,yn.x,0,-bn.y,bn.x,0];return!Tn(t,hn,gn,_n,Sn)||(t=[1,0,0,0,1,0,0,0,1],!Tn(t,hn,gn,_n,Sn))?!1:(Cn.crossVectors(vn,yn),t=[Cn.x,Cn.y,Cn.z],Tn(t,hn,gn,_n,Sn))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(pn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(fn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),fn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),fn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),fn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),fn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),fn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),fn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),fn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(fn)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}};let fn=[/*@__PURE__*/ new q,/*@__PURE__*/ new q,/*@__PURE__*/ new q,/*@__PURE__*/ new q,/*@__PURE__*/ new q,/*@__PURE__*/ new q,/*@__PURE__*/ new q,/*@__PURE__*/ new q],pn=/*@__PURE__*/ new q,mn=/*@__PURE__*/ new dn,hn=/*@__PURE__*/ new q,gn=/*@__PURE__*/ new q,_n=/*@__PURE__*/ new q,vn=/*@__PURE__*/ new q,yn=/*@__PURE__*/ new q,bn=/*@__PURE__*/ new q,xn=/*@__PURE__*/ new q,Sn=/*@__PURE__*/ new q,Cn=/*@__PURE__*/ new q,wn=/*@__PURE__*/ new q;function Tn(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){wn.fromArray(e,a);let o=i.x*Math.abs(wn.x)+i.y*Math.abs(wn.y)+i.z*Math.abs(wn.z),s=t.dot(wn),c=n.dot(wn),l=r.dot(wn);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}let En=/*@__PURE__*/ new q,Dn=/*@__PURE__*/ new Ye,On=0;var kn=class extends Se{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:On++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=ae,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Dn.fromBufferAttribute(this,t),Dn.applyMatrix3(e),this.setXY(t,Dn.x,Dn.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)En.fromBufferAttribute(this,t),En.applyMatrix3(e),this.setXYZ(t,En.x,En.y,En.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)En.fromBufferAttribute(this,t),En.applyMatrix4(e),this.setXYZ(t,En.x,En.y,En.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)En.fromBufferAttribute(this,t),En.applyNormalMatrix(e),this.setXYZ(t,En.x,En.y,En.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)En.fromBufferAttribute(this,t),En.transformDirection(e),this.setXYZ(t,En.x,En.y,En.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ke(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=qe(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ke(t,this.array)),t}setX(e,t){return this.normalized&&(t=qe(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ke(t,this.array)),t}setY(e,t){return this.normalized&&(t=qe(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ke(t,this.array)),t}setZ(e,t){return this.normalized&&(t=qe(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ke(t,this.array)),t}setW(e,t){return this.normalized&&(t=qe(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=qe(t,this.array),n=qe(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=qe(t,this.array),n=qe(n,this.array),r=qe(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=qe(t,this.array),n=qe(n,this.array),r=qe(r,this.array),i=qe(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},An=class extends kn{constructor(e,t,n){super(new Uint16Array(e),t,n)}},jn=class extends kn{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Mn=class extends kn{constructor(e,t,n){super(new Float32Array(e),t,n)}};let Nn=/*@__PURE__*/ new dn,Pn=/*@__PURE__*/ new q,Fn=/*@__PURE__*/ new q;var In=class{constructor(e=new q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Nn.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Pn.subVectors(e,this.center);let t=Pn.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Pn,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Fn.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Pn.copy(e.center).add(Fn)),this.expandByPoint(Pn.copy(e.center).sub(Fn))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}};let Ln=0,Rn=/*@__PURE__*/ new ht,zn=/*@__PURE__*/ new Ht,Bn=/*@__PURE__*/ new q,Vn=/*@__PURE__*/ new dn,Hn=/*@__PURE__*/ new dn,Un=/*@__PURE__*/ new q;var Wn=class e extends Se{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ln++}),this.uuid=De(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(ge(e)?jn:An)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new J().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Rn.makeRotationFromQuaternion(e),this.applyMatrix4(Rn),this}rotateX(e){return Rn.makeRotationX(e),this.applyMatrix4(Rn),this}rotateY(e){return Rn.makeRotationY(e),this.applyMatrix4(Rn),this}rotateZ(e){return Rn.makeRotationZ(e),this.applyMatrix4(Rn),this}translate(e,t,n){return Rn.makeTranslation(e,t,n),this.applyMatrix4(Rn),this}scale(e,t,n){return Rn.makeScale(e,t,n),this.applyMatrix4(Rn),this}lookAt(e){return zn.lookAt(e),zn.updateMatrix(),this.applyMatrix4(zn.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bn).negate(),this.translate(Bn.x,Bn.y,Bn.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Mn(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&W(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new dn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)G(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Vn.setFromBufferAttribute(n),this.morphTargetsRelative?(Un.addVectors(this.boundingBox.min,Vn.min),this.boundingBox.expandByPoint(Un),Un.addVectors(this.boundingBox.max,Vn.max),this.boundingBox.expandByPoint(Un)):(this.boundingBox.expandByPoint(Vn.min),this.boundingBox.expandByPoint(Vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&G(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new In);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)G(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new q,1/0);else if(e){let n=this.boundingSphere.center;if(Vn.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Hn.setFromBufferAttribute(n),this.morphTargetsRelative?(Un.addVectors(Vn.min,Hn.min),Vn.expandByPoint(Un),Un.addVectors(Vn.max,Hn.max),Vn.expandByPoint(Un)):(Vn.expandByPoint(Hn.min),Vn.expandByPoint(Hn.max))}Vn.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Un.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Un));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Un.fromBufferAttribute(a,t),o&&(Bn.fromBufferAttribute(e,t),Un.add(Bn)),r=Math.max(r,n.distanceToSquared(Un))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&G(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){G(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new kn(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new q,s[e]=new q;let c=new q,l=new q,u=new q,d=new Ye,f=new Ye,p=new Ye,m=new q,h=new q;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new q,y=new q,b=new q,x=new q;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new kn(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new q,i=new q,a=new q,o=new q,s=new q,c=new q,l=new q,u=new q;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Un.fromBufferAttribute(e,t),Un.normalize(),e.setXYZ(t,Un.x,Un.y,Un.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new kn(a,r,i)}if(this.index===null)return W(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}};let Gn=/*@__PURE__*/ new q,Kn=/*@__PURE__*/ new q,qn=/*@__PURE__*/ new J;var Jn=class{constructor(e=new q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Gn.subVectors(n,t).cross(Kn.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Gn),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||qn.getNormalMatrix(e),r=this.coplanarPoint(Gn).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}};let Yn=0;var Xn=class extends Se{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yn++}),this.uuid=De(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Jt(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=me,this.stencilZFail=me,this.stencilZPass=me,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){W(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?W(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Jt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Jn().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new Ye().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ye().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}};let Zn=/*@__PURE__*/ new q,Qn=/*@__PURE__*/ new q,$n=/*@__PURE__*/ new q,er=/*@__PURE__*/ new q;var tr=class{constructor(e=new q,t=new q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Zn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Zn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Zn.copy(this.origin).addScaledVector(this.direction,t),Zn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Qn.copy(e).add(t).multiplyScalar(.5),$n.copy(t).sub(e).normalize(),er.copy(this.origin).sub(Qn);let i=e.distanceTo(t)*.5,a=-this.direction.dot($n),o=er.dot(this.direction),s=-er.dot($n),c=er.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Qn).addScaledVector($n,d),f}intersectSphere(e,t){if(e.radius<0)return null;Zn.subVectors(e.center,this.origin);let n=Zn.dot(this.direction),r=Zn.dot(Zn)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Zn)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let P=S/w,F=C/w,I=1/w,L=T-P*D,R=E-F*D,z=O-P*A,B=k-F*A,ee=j-P*N,te=M-F*N,ne=ee*B-te*z,re=L*te-R*ee,ie=z*R-B*L;if(r){if(ne<0||re<0||ie<0)return null}else if((ne<0||re<0||ie<0)&&(ne>0||re>0||ie>0))return null;let ae=ne+re+ie;if(ae===0)return null;let oe=I*(ne*D+re*A+ie*N);return(ae>0?oe<0:oe>0)?null:this.at(oe/ae,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},nr=class extends Xn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new Jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tt,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};let rr=/*@__PURE__*/ new ht,ir=/*@__PURE__*/ new tr,ar=/*@__PURE__*/ new In,or=/*@__PURE__*/ new q,sr=/*@__PURE__*/ new q,cr=/*@__PURE__*/ new q,lr=/*@__PURE__*/ new q,ur=/*@__PURE__*/ new q,dr=/*@__PURE__*/ new q,fr=/*@__PURE__*/ new q,pr=/*@__PURE__*/ new q;var mr=class extends Ht{constructor(e=new Wn,t=new nr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){dr.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(ur.fromBufferAttribute(s,e),a?dr.addScaledVector(ur,r):dr.addScaledVector(ur.sub(t),r))}t.add(dr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ar.copy(n.boundingSphere),ar.applyMatrix4(i),ir.copy(e.ray).recast(e.near),!(ar.containsPoint(ir.origin)===!1&&(ir.intersectSphere(ar,or)===null||ir.origin.distanceToSquared(or)>(e.far-e.near)**2))&&(rr.copy(i).invert(),ir.copy(e.ray).applyMatrix4(rr),(n.boundingBox===null||ir.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,ir)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=gr(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=gr(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=gr(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=gr(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function hr(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;pr.copy(s),pr.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(pr);return l<n.near||l>n.far?null:{distance:l,point:pr.clone(),object:e}}function gr(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,sr),e.getVertexPosition(c,cr),e.getVertexPosition(l,lr);let u=hr(e,t,n,r,sr,cr,lr,fr);if(u){let e=new q;un.getBarycoord(fr,sr,cr,lr,e),i&&(u.uv=un.getInterpolatedAttribute(i,s,c,l,e,new Ye)),a&&(u.uv1=un.getInterpolatedAttribute(a,s,c,l,e,new Ye)),o&&(u.normal=un.getInterpolatedAttribute(o,s,c,l,e,new q),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new q,materialIndex:0};un.getNormal(sr,cr,lr,t.normal),u.face=t,u.barycoord=e}return u}var _r=class extends pt{constructor(e=null,t=1,n=1,r,i,a,o,s,c=ie,l=ie,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},vr=class e extends Wn{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new q,d=new q,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Mn(p,3)),this.setAttribute(`normal`,new Mn(m,3)),this.setAttribute(`uv`,new Mn(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function yr(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(xr(i))i.isRenderTargetTexture?(W(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(xr(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function br(e){let t={};for(let n=0;n<e.length;n++){let r=yr(e[n]);for(let e in r)t[e]=r[e]}return t}function xr(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}var Sr=class extends Xn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new Jt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Jt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Cr=class extends Sr{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ye(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return K(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Jt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Jt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Jt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};function wr(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Tr(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Er=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Dr=class extends Er{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:V,endingEnd:V}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case de:i=e,o=2*t-n;break;case H:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case de:a=e,s=2*n-t;break;case H:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Or=class extends Er{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},kr=class extends Er{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Ar=class extends Er{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Nr(n,t,g,y,r);i[p]=jr(x,o,_,b,m)}return i}};function jr(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Mr(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Nr(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=jr(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Mr(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Pr=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=wr(t,this.TimeBufferType),this.values=wr(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:wr(e.times,Array),values:wr(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Tr(e.settings)&&(n.settings={inTangents:wr(e.settings.inTangents,Array),outTangents:wr(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new kr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Or(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Dr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Ar(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case se:t=this.InterpolantFactoryMethodDiscrete;break;case ce:t=this.InterpolantFactoryMethodLinear;break;case le:t=this.InterpolantFactoryMethodSmooth;break;case ue:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return W(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return se;case this.InterpolantFactoryMethodLinear:return ce;case this.InterpolantFactoryMethodSmooth:return le;case this.InterpolantFactoryMethodBezier:return ue}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Tr(this.settings)&&(Fr(this.settings.inTangents,e),Fr(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(G(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(G(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){G(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){G(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&_e(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){G(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===le,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Tr(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Fr(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Pr.prototype.ValueTypeName=``,Pr.prototype.TimeBufferType=Float32Array,Pr.prototype.ValueBufferType=Float32Array,Pr.prototype.DefaultInterpolation=ce;var Ir=class extends Pr{constructor(e,t,n){super(e,t,n)}};Ir.prototype.ValueTypeName=`bool`,Ir.prototype.ValueBufferType=Array,Ir.prototype.DefaultInterpolation=se,Ir.prototype.InterpolantFactoryMethodLinear=void 0,Ir.prototype.InterpolantFactoryMethodSmooth=void 0;var Lr=class extends Pr{constructor(e,t,n,r){super(e,t,n,r)}};Lr.prototype.ValueTypeName=`color`;var Rr=class extends Pr{constructor(e,t,n,r){super(e,t,n,r)}};Rr.prototype.ValueTypeName=`number`;var zr=class extends Er{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Xe.slerpFlat(i,0,a,c-o,a,c,s);return i}},Br=class extends Pr{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new zr(this.times,this.values,this.getValueSize(),e)}};Br.prototype.ValueTypeName=`quaternion`,Br.prototype.InterpolantFactoryMethodSmooth=void 0;var Vr=class extends Pr{constructor(e,t,n){super(e,t,n)}};Vr.prototype.ValueTypeName=`string`,Vr.prototype.ValueBufferType=Array,Vr.prototype.DefaultInterpolation=se,Vr.prototype.InterpolantFactoryMethodLinear=void 0,Vr.prototype.InterpolantFactoryMethodSmooth=void 0;var Hr=class extends Pr{constructor(e,t,n,r){super(e,t,n,r)}};Hr.prototype.ValueTypeName=`vector`;let Ur={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(Wr(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!Wr(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function Wr(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}let Gr=/*@__PURE__*/ new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}};var Kr=class{constructor(e){this.manager=e===void 0?Gr:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Kr.DEFAULT_MATERIAL_NAME=`__DEFAULT`;let qr=/* @__PURE__ */ new WeakMap;var Jr=class extends Kr{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=Ur.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=qr.get(a);e===void 0&&(e=[],qr.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=ve(`img`);function s(){l(),t&&t(this);let n=qr.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}qr.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),Ur.remove(`image:${e}`);let n=qr.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}qr.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Ur.add(`image:${e}`,o),i.manager.itemStart(e),o.src=e,o}},Yr=class extends Kr{constructor(e){super(e)}load(e,t,n,r){let i=new pt,a=new Jr(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}};let Xr=/* @__PURE__ */ RegExp(`[\\[\\]\\.:\\/]`,`g`),Zr=/* @__PURE__ */ RegExp(`^((?:[^\\[\\]\\.:\\/]+[\\/:])*)([^\\[\\]:\\/]+)?(?:\\.([^\\[\\]\\.:\\/]+)(?:\\[(.+)\\])?)?\\.([^\\[\\]\\.:\\/]+)(?:\\[(.+)\\])?$`),Qr=[`material`,`materials`,`bones`,`map`];var $r=class{constructor(e,t,n){let r=n||ei.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ei=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Xr,``)}static parseTrackName(e){let t=Zr.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Qr.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){W(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){G(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){G(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){G(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){G(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){G(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){G(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){G(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;G(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){G(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){G(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ei.Composite=$r,ei.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},ei.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},ei.prototype.GetterByBindingType=[ei.prototype._getValue_direct,ei.prototype._getValue_array,ei.prototype._getValue_arrayElement,ei.prototype._getValue_toArray],ei.prototype.SetterByBindingTypeAndVersioning=[[ei.prototype._setValue_direct,ei.prototype._setValue_direct_setNeedsUpdate,ei.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ei.prototype._setValue_array,ei.prototype._setValue_array_setNeedsUpdate,ei.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ei.prototype._setValue_arrayElement,ei.prototype._setValue_arrayElement_setNeedsUpdate,ei.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ei.prototype._setValue_fromArray,ei.prototype._setValue_fromArray_setNeedsUpdate,ei.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?W(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);
/**
* @license
* Copyright 2010-2026 Three.js Authors
* SPDX-License-Identifier: MIT
*/
let Y={alphahash_fragment:`#ifdef USE_ALPHAHASH
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
}`},X={common:{diffuse:{value:/*@__PURE__*/ new Jt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:/*@__PURE__*/ new J},alphaMap:{value:null},alphaMapTransform:{value:/*@__PURE__*/ new J},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:/*@__PURE__*/ new J}},envmap:{envMap:{value:null},envMapRotation:{value:/*@__PURE__*/ new J},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:/*@__PURE__*/ new J}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:/*@__PURE__*/ new J}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:/*@__PURE__*/ new J},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:/*@__PURE__*/ new J},normalScale:{value:/*@__PURE__*/ new Ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:/*@__PURE__*/ new J},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:/*@__PURE__*/ new J}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:/*@__PURE__*/ new J}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:/*@__PURE__*/ new J}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:/*@__PURE__*/ new Jt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:/*@__PURE__*/ new q},probesMax:{value:/*@__PURE__*/ new q},probesResolution:{value:/*@__PURE__*/ new q}},points:{diffuse:{value:/*@__PURE__*/ new Jt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:/*@__PURE__*/ new J},alphaTest:{value:0},uvTransform:{value:/*@__PURE__*/ new J}},sprite:{diffuse:{value:/*@__PURE__*/ new Jt(16777215)},opacity:{value:1},center:{value:/*@__PURE__*/ new Ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:/*@__PURE__*/ new J},alphaMap:{value:null},alphaMapTransform:{value:/*@__PURE__*/ new J},alphaTest:{value:0}}},ti={basic:{uniforms:/*@__PURE__*/ br([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.fog]),vertexShader:Y.meshbasic_vert,fragmentShader:Y.meshbasic_frag},lambert:{uniforms:/*@__PURE__*/ br([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.fog,X.lights,{emissive:{value:/*@__PURE__*/ new Jt(0)},envMapIntensity:{value:1}}]),vertexShader:Y.meshlambert_vert,fragmentShader:Y.meshlambert_frag},phong:{uniforms:/*@__PURE__*/ br([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.fog,X.lights,{emissive:{value:/*@__PURE__*/ new Jt(0)},specular:{value:/*@__PURE__*/ new Jt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Y.meshphong_vert,fragmentShader:Y.meshphong_frag},standard:{uniforms:/*@__PURE__*/ br([X.common,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.roughnessmap,X.metalnessmap,X.fog,X.lights,{emissive:{value:/*@__PURE__*/ new Jt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Y.meshphysical_vert,fragmentShader:Y.meshphysical_frag},toon:{uniforms:/*@__PURE__*/ br([X.common,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.gradientmap,X.fog,X.lights,{emissive:{value:/*@__PURE__*/ new Jt(0)}}]),vertexShader:Y.meshtoon_vert,fragmentShader:Y.meshtoon_frag},matcap:{uniforms:/*@__PURE__*/ br([X.common,X.bumpmap,X.normalmap,X.displacementmap,X.fog,{matcap:{value:null}}]),vertexShader:Y.meshmatcap_vert,fragmentShader:Y.meshmatcap_frag},points:{uniforms:/*@__PURE__*/ br([X.points,X.fog]),vertexShader:Y.points_vert,fragmentShader:Y.points_frag},dashed:{uniforms:/*@__PURE__*/ br([X.common,X.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Y.linedashed_vert,fragmentShader:Y.linedashed_frag},depth:{uniforms:/*@__PURE__*/ br([X.common,X.displacementmap]),vertexShader:Y.depth_vert,fragmentShader:Y.depth_frag},normal:{uniforms:/*@__PURE__*/ br([X.common,X.bumpmap,X.normalmap,X.displacementmap,{opacity:{value:1}}]),vertexShader:Y.meshnormal_vert,fragmentShader:Y.meshnormal_frag},sprite:{uniforms:/*@__PURE__*/ br([X.sprite,X.fog]),vertexShader:Y.sprite_vert,fragmentShader:Y.sprite_frag},background:{uniforms:{uvTransform:{value:/*@__PURE__*/ new J},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Y.background_vert,fragmentShader:Y.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:/*@__PURE__*/ new J}},vertexShader:Y.backgroundCube_vert,fragmentShader:Y.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Y.cube_vert,fragmentShader:Y.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Y.equirect_vert,fragmentShader:Y.equirect_frag},distance:{uniforms:/*@__PURE__*/ br([X.common,X.displacementmap,{referencePosition:{value:/*@__PURE__*/ new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Y.distance_vert,fragmentShader:Y.distance_frag},shadow:{uniforms:/*@__PURE__*/ br([X.lights,X.fog,{color:{value:/*@__PURE__*/ new Jt(0)},opacity:{value:1}}]),vertexShader:Y.shadow_vert,fragmentShader:Y.shadow_frag}};ti.physical={uniforms:/*@__PURE__*/ br([ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:/*@__PURE__*/ new J},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:/*@__PURE__*/ new J},clearcoatNormalScale:{value:/*@__PURE__*/ new Ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:/*@__PURE__*/ new J},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:/*@__PURE__*/ new J},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:/*@__PURE__*/ new J},sheen:{value:0},sheenColor:{value:/*@__PURE__*/ new Jt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:/*@__PURE__*/ new J},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:/*@__PURE__*/ new J},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:/*@__PURE__*/ new J},transmissionSamplerSize:{value:/*@__PURE__*/ new Ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:/*@__PURE__*/ new J},attenuationDistance:{value:0},attenuationColor:{value:/*@__PURE__*/ new Jt(0)},specularColor:{value:/*@__PURE__*/ new Jt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:/*@__PURE__*/ new J},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:/*@__PURE__*/ new J},anisotropyVector:{value:/*@__PURE__*/ new Ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:/*@__PURE__*/ new J}}]),vertexShader:Y.meshphysical_vert,fragmentShader:Y.meshphysical_frag},(/* @__PURE__ */ new J()).set(-1,0,0,0,1,0,0,0,1),(/* @__PURE__ */ new J()).set(-1,0,0,0,1,0,0,0,1),new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);function ni(e,t,{fin:n=!1,caudal:r=!1,eye:i=!1}={}){let a=e.onBeforeCompile,o=e.customProgramCacheKey();return e.onBeforeCompile=e=>{a(e),Object.assign(e.uniforms,{macroHead:{value:t.head},macroScales:{value:t.scales},macroFin:{value:t.fin}}),e.fragmentShader=`uniform sampler2D macroHead, macroScales, macroFin;
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
`+(n?s:o)+Y.bumpmap_pars_fragment.replaceAll(`texture2D( bumpMap, vBumpMapUv ).x`,`microHeight(vBumpMapUv)`).replaceAll(`texture2D( bumpMap, vBumpMapUv + dSTdx ).x`,`microHeight(vBumpMapUv + dSTdx)`).replaceAll(`texture2D( bumpMap, vBumpMapUv + dSTdy ).x`,`microHeight(vBumpMapUv + dSTdy)`)),e.fragmentShader=e.fragmentShader.replace(`#include <map_fragment>`,`diffuseColor *= vec4(sectionPigment(vMapUv),1.);`),i||(e.fragmentShader=e.fragmentShader.replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
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
`+c))},e.customProgramCacheKey=()=>`betta-macro-1.8-${n}-${r}-${i}-${o}`,e}let ri=(e,t,n)=>Math.max(t,Math.min(n,e)),ii=(e,t,n)=>{let r=ri((n-e)/(t-e),0,1);return r*r*(3-2*r)},ai=-1.22,oi=e=>1+1.2*Math.exp(-(((e-.2)/.13)**2))+1.4*Math.exp(-(((e-.92)/.1)**2)),si=.38,ci=Float64Array.from({length:25},(e,t)=>oi((t-.5)/24));var li=class{constructor(){this.data=/* @__PURE__ */ new Float32Array(644),this.turnAngles=null,this.mouth=this.gill=0,this.pitchBend=/* @__PURE__ */ new Float64Array(25),this.curlBend=/* @__PURE__ */ new Float64Array(25),this.curlAngle=/* @__PURE__ */ new Float64Array(25),this.curl=0,this.arch=0,this.lift=/* @__PURE__ */ new Float32Array(161),this.steer=0,this.headYaw=0,this.neck=[ai,0,1,0],this.revision=0,this.update(0,0,0,0)}advanceTurn(e,t,n,r=0,i=null){if(this.turnAngles??=/* @__PURE__ */ new Float64Array(25),!(e>0))return;this.curl=i??Math.tanh(t/1.6);let a=this.curlBend,o=1+2*Math.max(0,Math.abs(t)-3);a[0]=this.curl;for(let t=1;t<25;t++)a[t]+=(this.curl-a[t])*(1-Math.exp(-e*o/(.3*t/24)));let s=this.pitchBend,c=.55*(1+.3*Math.min(1.5,Math.abs(n)));for(let t=1;t<25;t++){let n=c*t/24,i=si*Math.tanh(n*r/si);s[t]+=(i-s[t])*(1-Math.exp(-e/n))}this.arch=s[24];let l=this.turnAngles,u=2.276/(l.length-1),d=Math.min(e,.07);for(;d>1e-9;){let e=Math.min(d,1/120);this.steer+=(t-this.steer)*(1-Math.exp(-9*e));let r=1.6+Math.min(2.5,Math.abs(n))*1.5,i=1-Math.exp(-r*e/u),a=Math.exp(-e*(Math.abs(t)>.15?.12:3));for(let n=l.length-1;n>0;n--)l[n]=ri((l[n]+t*e)*a,-2.95,2.95),l[n]+=(l[n-1]-l[n])*i;for(let e=1;e<l.length;e++)l[e]=ri(l[e],l[e-1]-u*1.65,l[e-1]+u*1.65);d-=e}}update(e,t,n,r,o=0,s=0,c=1,u=0,d=1,f=1){this.revision++,this.effort=t;let p=this.curlAngle,m=this.curlBend,h=1/24;p[0]=0;let g=ii(.2,.6,Math.abs(m[0]));for(let e=1;e<25;e++)p[e]=p[e-1]+1.5*h*.5*(m[e-1]+m[e])*ii(0,.1,e*h)*(1+(ci[e]-1)*g);this.turnBend=this.turnAngles?ri(this.turnAngles.at(-1)+p[24],-2.95,2.95)/2.95:Math.tanh(n*.8);let _=(.8+t*.2)*c;this.mouth=Math.max(o,Math.max(0,Math.sin(r))**1.4*_*.5),this.gill=Math.max(s,Math.max(0,Math.sin(r-1.05))**1.3*_*1.35);let v=3.87/160,y=a(t);this.headYaw=ri(.05*-this.steer,-.15,.15)-.12*Math.max(0,y-i(0))*Math.sin(e-4.25)||0;let b=ai,x=0,S=1,C=0,w=this.data;for(let t=0;t<161;t++){let n=ri((ai+t*v+1.22)/2.276,0,1),r=ii(.3,1,n),i=ii(.03,1,n)*this.turnBend*2.95;if(this.turnAngles){let e=n*(this.turnAngles.length-1),t=Math.floor(e),r=Math.min(t+1,this.turnAngles.length-1);i=ri(this.turnAngles[t]+(this.turnAngles[r]-this.turnAngles[t])*(e-t)+p[t]+(p[r]-p[t])*(e-t),-2.95,2.95)}let a=1-Math.abs(i)/3.2,o=this.headYaw+i+r*y*a*Math.sin(e-n*5)+(u?r*.46*u*l(d,n,f)*a:0),s=Math.cos(o),c=Math.sin(o);t&&(b+=v*(S+s)*.5,x+=v*(C+c)*.5),w[t*4]=b,w[t*4+1]=x,w[t*4+2]=s,w[t*4+3]=c,S=s,C=c}let T=0,E=0;if(this.headYaw){let e=w[112]-ai,t=w[113],n=Math.cos(this.headYaw),r=Math.sin(this.headYaw);T=e*n+t*r-e,E=t*n-e*r-t;for(let e=0;e<161;e++)w[e*4]+=T,w[e*4+1]+=E}let D=this.neck;D[0]=ai+T,D[1]=E,D[2]=Math.cos(this.headYaw),D[3]=Math.sin(this.headYaw);let O=this.lift,k=this.pitchBend,A=0;O[0]=0;for(let e=1;e<161;e++){let t=ri((e-.5)*v/2.276,0,1)*24,n=Math.floor(t),r=Math.min(n+1,24);A+=v*Math.sin(k[n]+(k[r]-k[n])*(t-n)),O[e]=A}let j=O[28];for(let e=0;e<161;e++)O[e]-=j}frame(e,t){if(e<=-1.22){let n=this.neck,r=e-ai;return t[0]=n[0]+r*n[2],t[1]=n[1]+r*n[3],t[2]=n[2],t[3]=n[3],t}let n=this.data,r=ri((e-ai)/3.87,0,1)*160,i=Math.floor(r),a=Math.min(i+1,160),o=r-i;for(let e=0;e<4;e++)t[e]=n[i*4+e]*(1-o)+n[a*4+e]*o;return t}transform(e,t,n,r){this.frame(e,r);let i=r[0],a=r[1],o=r[2],s=r[3],c=Math.exp(-(((e+1.03)/.17)**2)-((t+.01)/.29)**2);n+=Math.sign(n)*c*(.004+.018*this.gill);let l=Math.exp(-(((e+1.3)/.16)**2))*(1-ii(-1.15,-1,e))*(1-ii(-.2,.05,t));t-=l*.04*this.mouth;let u=1-ii(-1.68,-1.48,e),d=1-ii(-1.67,-1.28,e);return t=.0832+(t-.0832)*(1-u*(.78-.78*this.mouth)),t-=d*(1-ii(.045,.105,t))*(.003+.047*this.mouth),r[0]=i-n*s,r[1]=t+this.archAt(e),r[2]=a+n*o,r}archAt(e){let t=ri((e-ai)/3.87,0,1)*160,n=Math.floor(t),r=Math.min(n+1,160),i=this.lift;return i[n]+(i[r]-i[n])*(t-n)}};let ui=`
uniform sampler2D uSpine,uLift;
uniform float uMouth,uGill;
vec4 spineFrame(float x) {
 if(x<=${ai}){vec4 f=texelFetch(uSpine,ivec2(0,0),0);return vec4(f.x+(x-(${ai}))*f.z,f.y+(x-(${ai}))*f.w,f.z,f.w);}
 float g=clamp((x-(${ai}))/3.87,0.,1.)*160.;
 int a=int(floor(g)), b=min(a+1,160);
 return mix(texelFetch(uSpine,ivec2(a,0),0),texelFetch(uSpine,ivec2(b,0),0),fract(g));
}
float spineLift(float x) {
 float g=clamp((x-(${ai}))/3.87,0.,1.)*160.;
 int a=int(floor(g)), b=min(a+1,160);
 return mix(texelFetch(uLift,ivec2(a,0),0).r,texelFetch(uLift,ivec2(b,0),0).r,fract(g));
}
vec3 swim(vec3 p) {
 vec4 f=spineFrame(p.x);
 float cheek=exp(-pow((p.x+1.03)/.17,2.)-pow((p.y+.01)/.29,2.));
 p.z+=sign(p.z)*cheek*(.004+.018*uGill);
 p.y-=exp(-pow((p.x+1.3)/.16,2.))*(1.-smoothstep(-1.15,-1.,p.x))*(1.-smoothstep(-.2,.05,p.y))*.04*uMouth;
 float lip=1.-smoothstep(-1.68,-1.48,p.x),jaw=1.-smoothstep(-1.67,-1.28,p.x);
 p.y=.0832+(p.y-.0832)*(1.-lip*(.78-.78*uMouth));
 p.y-=jaw*(1.-smoothstep(.045,.105,p.y))*(.003+.047*uMouth);
 return vec3(f.x-p.z*f.w,p.y+spineLift(p.x),f.y+p.z*f.z);
}
`;var di=class{constructor(){this.flare=0,this.requested=!1,this.target=!1,this.from=0,this.elapsed=1,this.clamp=0}advance(e){if(e<=0)return;this.requested!==this.target&&(this.target=this.requested,this.from=this.flare,this.elapsed=0),this.elapsed=Math.min(1,this.elapsed+e/(this.target?1:.35));let t=this.elapsed,n=t*t*(3-2*t);this.flare=this.from+(+!!this.target-this.from)*n}},fi=class{constructor(){this.time=0,this.yaw=0,this.pitch=0,this.seed=255973,this.from=[.06,.02],this.to=[.06,.02],this.glance=1.4,this.glanceLength=.17}advance(e,t=0,n=0){if(e<=0)return;this.time+=e;let r=this.time;if(r>=this.glance+this.glanceLength){let e=()=>u(this),t=e()<.55;this.from=this.to;let n=t?(e()*2-1)*.24:this.from[0]+(e()*2-1)*.08,i=t?(e()*2-1)*.13:this.from[1]+(e()*2-1)*.05;this.to=[Math.max(-.24,Math.min(.24,n)),Math.max(-.13,Math.min(.13,i))];let a=e();this.glance=r+.35+3.6*a*a,this.glanceLength=t?.15+.06*e():.1+.04*e()}let i=Math.max(0,Math.min(1,(r-this.glance)/this.glanceLength)),a=i*i*(3-2*i),o=this.from,s=this.to,c=(o[0]+(s[0]-o[0])*a)*(1-n*.65)-n*.13-Math.max(-.04,Math.min(.04,t*.04)),l=(o[1]+(s[1]-o[1])*a)*(1-n*.65),d=1-Math.exp(-35*e);this.yaw+=(c-this.yaw)*d,this.pitch+=(l-this.pitch)*d}};let pi=(e,t,n)=>Math.max(t,Math.min(n,e)),mi=(e,t,n)=>{let r=pi((n-e)/(t-e),0,1);return r*r*(3-2*r)},hi=[1.4,4.2],gi=[6.4,9.2],_i=e=>1.1*(mi(0,.28,e)-mi(.62,.95,e)),vi=e=>Math.sin(Math.PI*pi((e-.8)/.8,0,1))**1.2;function yi(e,t){if(!e)return{mouth:0,gill:0,phase:`none`,clock:-1};let n=mi(.9,1,t),r=e.phase===`gulp`&&t>=.95;return{mouth:e.mouth*n,gill:e.gill*n,phase:e.phase===`gulp`&&!r?`hold`:e.phase,clock:r?e.clock:-1}}function bi(e){let t=(e%96+96)%96-16;if(t<hi[0]||t>=gi[1])return{lift:0,clock:-1,mouth:0,gill:0,swim:0,phase:`none`};if(t<hi[1]){let e=(t-hi[0])/(hi[1]-hi[0]);return{lift:mi(0,1,e),clock:-1,mouth:0,gill:0,swim:Math.sin(Math.PI*e),phase:`rise`}}if(t<gi[0]){let e=t-4.5,n=e>=0&&e<1.6;return{lift:1,clock:n?e:-1,mouth:n?_i(e):0,gill:n?vi(e):0,swim:0,phase:n?`gulp`:`hold`}}let n=(t-gi[0])/(gi[1]-gi[0]);return{lift:1-mi(0,1,n),clock:-1,mouth:0,gill:0,swim:Math.sin(Math.PI*n),phase:`dive`}}let xi=Math.PI,Si=Je.lerp,Ci=Je.clamp,wi=.0032,Ti=.08,Ei=.085,Di=.065,Oi={hover:{scull:1},surface:{scull:1},gulp:{scull:1},rise:{scull:.7},dive:{scull:.5},glide:{scull:.3},startle:{tuck:1},mirror:{scull:1},lap:{scull:.15},rest:{scull:.25}},ki=([e,t])=>[(e-680)*wi,(420-t)*wi],Ai=([e,t])=>[e/1536,1-t/1024],ji={uTime:{value:0},uFlare:{value:0},uMotion:{value:1},uPhase:{value:0},uDrive:{value:.12},uTurn:{value:0},uFold:{value:0},uSpine:{value:null},uMouth:{value:0},uGill:{value:0},uLift:{value:null}},Mi=`uniform float uTime,uFlare,uMotion,uPhase,uDrive,uTurn,uFold;
`+ui;function Ni(e,t=null,n=!1){return e.userData.bettaDeform={dynamics:t,operculum:n},e.onBeforeCompile=e=>{Object.assign(e.uniforms,ji),t&&(e.uniforms.uFinDisplacement={value:t.texture},e.uniforms.uFinGrid={value:new Ye(t.columns,t.rows)}),e.vertexShader=Mi+(n?`attribute float coverLift;
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
`:``)+e.vertexShader,e.vertexShader=e.vertexShader.replace(`#include <project_vertex>`,`vec3 anatomical=transformed;${n?`anatomical.z+=coverLift*(uGill*${Ti}+uFlare*${Ei});anatomical.x-=abs(coverLift)*(uGill+uFlare)*${Di};`:``}
       vec4 mvPosition=vec4(swim(anatomical)${t?`+wetFin(finUV)`:``},1.);
       mvPosition=modelViewMatrix*mvPosition;gl_Position=projectionMatrix*mvPosition;`),e.fragmentShader=e.fragmentShader.replace(`#include <normal_fragment_begin>`,`#include <normal_fragment_begin>
normal=normalize(cross(dFdx(vViewPosition),dFdy(vViewPosition)))*faceDirection;`)},e.customProgramCacheKey=()=>`wet-betta-1.6-${!!t}-${n}`,e}let Pi=[[155,387,401,8],[175,378,429,19],[200,369,456,32],[240,351,482,47],[300,327,500,68],[360,307,517,84],[420,290,528,86],[500,280,528,80],[580,278,521,72],[660,283,513,64],[740,309,506,55],[820,342,501,45],[900,371,492,33],[960,392,482,26],[1010,409,471,20]];function Fi(e,t=[0,0,0,0]){let n=0;for(;n<Pi.length-2&&Pi[n+1][0]<e;)n++;let r=Pi[n],i=Pi[n+1],a=Ci((e-r[0])/(i[0]-r[0]),0,1),o=Pi[Math.max(0,n-1)],s=Pi[Math.min(Pi.length-1,n+2)];t[0]=e;for(let e=1;e<4;e++){let n=i[0]-r[0],c=(i[e]-o[e])/(i[0]-o[0])*n,l=(s[e]-r[e])/(s[0]-r[0])*n;t[e]=(2*a**3-3*a*a+1)*r[e]+(a**3-2*a*a+a)*c+(-2*a**3+3*a*a)*i[e]+(a**3-a*a)*l}return t}function Ii(e=!1){let t=[],n=[],r=[],i=e?64:220,a=e?24:96;for(let e=0;e<=i;e++){let r=Si(155,1010,e/i),[,o,s,c]=Fi(r),l=(o+s)/2;for(let e=0;e<=a;e++){let i=e/a*2*xi,u=l+(s-o)*.5*Math.cos(i),[d,f]=ki([r,u]);t.push(d,f,Math.sin(i)*c*wi);let p=l+(s-o)*Math.asin(Math.cos(i))/xi,m=Je.smoothstep(r,390,520)*.85;n.push(...Ai([r,Si(u,p,m)]))}}for(let e=0;e<i;e++)for(let t=0;t<a;t++){let n=e*(a+1)+t,i=n+a+1;r.push(n,i,n+1,i,i+1,n+1)}for(let e of[i]){let i=e?1010:155,[,o,s]=Fi(i),[c,l]=ki([i,(o+s)/2]),u=t.length/3;t.push(c,l,0),n.push(...Ai([i,(o+s)/2]));for(let t=0;t<a;t++){let n=e*(a+1)+t;e?r.push(u,n+1,n):r.push(u,n,n+1)}}let o=new Wn;return o.setAttribute(`position`,new Mn(t,3)),o.setAttribute(`uv`,new Mn(n,2)),o.setIndex(r),o.computeVertexNormals(),o}function Li(e,t){let n=(e,t,n,r=null)=>{let i=new Wn;return i.setAttribute(`position`,new Mn(e,3)),i.setAttribute(`uv`,new Mn(t,2)),r&&i.setAttribute(`coverLift`,new Mn(r,1)),i.setIndex(n),i.computeVertexNormals(),i},r=Ni(new Cr({color:1051148,roughness:.82,side:2})),i=e.userData.compact,a=[],o=[],s=[],c=i?4:12,l=i?24:64;for(let e=0;e<=c;e++)for(let t=0;t<=l;t++){let n=e/c,r=t/l*xi*2;if(a.push(-1.68+n*.15,.0832+Si(.0224,.012,n)*Math.cos(r),Si(.0256,.012,n)*Math.sin(r)),o.push(t/l,n),e<c&&t<l){let n=e*(l+1)+t;s.push(n,n+1,n+l+1,n+1,n+l+2,n+l+1)}}let u=a.length/3;a.push(-1.53,.0832,0),o.push(.5,.5);for(let e=0;e<l;e++)s.push(u,c*(l+1)+e,c*(l+1)+e+1);let d=new mr(n(a,o,s),r);d.name=`Recessed breathing mouth`,e.add(d);let f=[],p=[],m=[],h=i?4:10;for(let e=0;e<=l;e++)for(let t=0;t<=h;t++){let n=e/l*xi*2,r=t/h*xi*2,i=.0028,a=-1.68+i*Math.sin(r),o=.0832+(.0224+i*Math.cos(r))*Math.cos(n),s=(.0256+i*Math.cos(r))*Math.sin(n);if(f.push(a,o,s),p.push(...Ai([a/wi+680,420-o/wi])),e<l&&t<h){let n=e*(h+1)+t;m.push(n,n+h+1,n+1,n+1,n+h+1,n+h+2)}}let g=new mr(n(f,p,m),t);g.name=`Flexible upper and lower lips`,e.add(g);for(let a of[-1,1]){let o=[],s=[],c=[],l=[],u=[],d=[],f=[],p=i?20:60,m=i?8:24;for(let e=0;e<=p;e++){let t=e/p,n=Math.sin(xi*t),r=Si(332,502,t),i=330+12*n,h=330+76*n,g=(e,t)=>{let[,n,i,o]=Fi(e),s=(r-(n+i)/2)/((i-n)/2);return a*(o*wi*Math.sqrt(Math.max(0,1-s*s))+t)};for(let t=0;t<=m;t++){let u=t/m,d=Si(i,h,u),[f,_]=ki([d,r]);if(o.push(f,_,g(d,.0025)),s.push(...Ai([d,r])),l.push(a*u*u*n**.7),e<p&&t<m){let n=e*(m+1)+t;c.push(n,n+1,n+m+1,n+1,n+m+2,n+m+1)}}for(let e=0;e<2;e++){let i=h-(e?0:30*n),[a,o]=ki([i,r]);u.push(a,o,g(i,.001)),d.push(t,e)}if(e<p){let t=e*2;f.push(t,t+1,t+2,t+1,t+3,t+2)}}if(a>0)for(let e=0;e<c.length;e+=3)[c[e+1],c[e+2]]=[c[e+2],c[e+1]];let h=ni(Ni(t.clone(),null,!0),e.userData.macroTextures);h.side=2;let g=new mr(n(o,s,c,l),h);g.name=`Hinged operculum ${a>0?`left`:`right`}`,e.add(g);let _=new mr(n(u,d,f),r);_.name=`Gill outlet ${a}`,e.add(_)}}function Ri(e,t){let n=Ci(t,0,1)*(e.length-1),r=Math.min(e.length-2,Math.floor(n)),i=n-r,a=e[Math.max(0,r-1)],o=e[r],s=e[r+1],c=e[Math.min(e.length-1,r+2)];return o.map((e,t)=>.5*(2*e+(-a[t]+s[t])*i+(2*a[t]-5*e+4*s[t]-c[t])*i*i+(-a[t]+3*e-3*s[t]+c[t])*i*i*i))}let zi=[[361,523],[378,529],[400,534]],Bi=[[369,543],[385,610],[403,685],[444,775],[483,860],[535,917]],Vi=[[397,439],[399,454],[401,468]],Hi=[[410,406],[445,393],[482,400],[504,430],[505,467],[493,500],[461,525],[435,524]],Ui=.045;function Wi(e){let[,t,n,r]=Fi(e[0]),i=Math.sqrt(Math.max(0,1-(Ui/(r*wi))**2));return[e[0],(t+n)/2+(n-t)/2*i-.014/wi]}function Gi(e,t,n,r,i,a){let o=Ri(e,i),s=Ri(t,i),c=n===4?Wi(o):o,l=a*(1-.004*(.5+.5*Math.sin(i*xi*142))-.002*(.5+.5*Math.sin(i*xi*57))),[u,d]=ki([Si(c[0],s[0],l),Si(c[1],s[1],l)]),f=Math.sin(i*xi*56)*.006+Math.sin(i*xi*9+a*3)*.055,p=a**1.5*f;n===3?p=r*(.267+a*.19)+a*.006*Math.sin(i*70):n===4&&(p=r*Si(Ui,.19,a)+a*f*.4);let[m,h]=ki(c);return{x:u,y:d,z:p,rx:m,ry:h,rz:n===3?r*.267:n===4?r*Ui:0,px:Si(o[0],s[0],l),py:Si(o[1],s[1],l),vv:l}}function Ki(e,t,n,r,i=0,a=0,o=null){let s=[],c=[],l=[],u=[],d=[],f=e.userData.compact?28:180,p=e.userData.compact?16:52;for(let e=0;e<=f;e++){let t=e/f;for(let e=0;e<=p;e++){let d=e/p,{x:f,y:m,z:h,rx:g,ry:_,rz:v,px:y,py:b,vv:x}=Gi(n,r,i,a,t,d);if(s.push(f,m,h),u.push(g,_,v),o){let e=Ri(o.roots,t),n=Ri(o.edge,t);c.push(Si(e[0],n[0],x)/o.width,1-Si(e[1],n[1],x)/o.height)}else c.push(...Ai([y,b]));l.push(t,d)}}for(let e=0;e<f;e++)for(let t=0;t<p;t++){let n=e*(p+1)+t,r=n+p+1;d.push(n,r,n+1,r,r+1,n+1)}let m=new Wn;for(let[e,t,n]of[[`position`,s,3],[`uv`,c,2],[`finUV`,l,2],[`root`,u,3]])m.setAttribute(e,new Mn(t,n));m.setIndex(d),m.computeVertexNormals();let h=new ee({kind:i,side:a,point(e,t){let{x:o,y:s,z:c}=Gi(n,r,i,a,e,t);return[o,s,c]}});h.texture=new _r(h.displacement,h.columns,h.rows,oe,ae),h.texture.needsUpdate=!0,e.userData.finDynamics.push(h);let g=Ni(new Cr({map:t,color:16777215,side:2,roughness:.76,metalness:0,clearcoat:.08,clearcoatRoughness:.6,iridescence:.06,iridescenceThicknessRange:[180,260],transparent:!0,opacity:i===3?.7:.94,depthWrite:!0,bumpMap:t,bumpScale:.006}),h),_=new mr(m,i<3?ni(g,e.userData.macroTextures,{fin:!0,caudal:i===0}):g);return _.frustumCulled=!1,_.userData.kind=i,_.name=[`Caudal`,`Dorsal`,`Anal`,`Pectoral`,`Pelvic`][i]+(a?a>0?` left`:` right`:``),e.add(_),_}function qi({compact:e=!1,textures:t=!0}={}){let n=new Ut;n.userData.compact=e;let i=(e,n,r)=>t?new Yr().load(e,n,void 0,r):(n(),new pt),a=[],o=new li,s=new _r(o.data,161,1,oe,ae);s.needsUpdate=!0,ji.uSpine.value=s;let c=new _r(o.lift,161,1,1028,ae);c.needsUpdate=!0,ji.uLift.value=c,n.userData.finDynamics=a,n.name=`Betta splendens — volumetric reference-textured specimen`;let l,u,f=new Promise((e,t)=>{l=e,u=t}),p=i(`https://media.jez237.com/demos/betta-atelier/references/2026-10-22/01-profile.jpg?v=69e062016b32`,()=>l(),u);p.colorSpace=fe,p.anisotropy=8;let g,_,v=new Promise((e,t)=>{g=e,_=t}),y=i(`https://media.jez237.com/demos/betta-atelier/references/2026-10-22/03-fin-material.jpg?v=11641b5eba25`,()=>g(),_);y.colorSpace=fe,y.anisotropy=8;let b=[],x={"04-head-macro":`https://media.jez237.com/demos/betta-atelier/macro-v1.2/04-head-macro.jpg?v=73e1f70901a5`,"05-scale-macro":`https://media.jez237.com/demos/betta-atelier/macro-v1.2/05-scale-macro.jpg?v=63089308e453`,"06-membrane-macro":`https://media.jez237.com/demos/betta-atelier/macro-v1.2/06-membrane-macro.jpg?v=684f8aabab14`},S=e=>{let t,n;b.push(new Promise((e,r)=>{t=e,n=r}));let r=i(x[e],t,n);return r.colorSpace=fe,r.anisotropy=8,r},C={head:S(`04-head-macro`),scales:S(`05-scale-macro`),fin:S(`06-membrane-macro`)};n.userData.macroTextures=C;let w=ni(Ni(new Cr({map:p,color:16777215,metalness:.03,roughness:.72,clearcoat:.06,clearcoatRoughness:.35,iridescence:.08,iridescenceThicknessRange:[190,300],bumpMap:p,bumpScale:.011})),C),T=new mr(Ii(e),w);T.name=`Arc-length muscular trunk with open buccal cavity`,n.add(T),Li(n,w),Ki(n,y,[[1e3,402],[1006,420],[1008,444],[1005,463],[995,478]],[[1078,45],[1100,43],[1137,40],[1197,76],[1250,126],[1302,181],[1351,241],[1380,302],[1396,370],[1410,436],[1398,507],[1387,579],[1370,646],[1340,706],[1301,762],[1244,808],[1180,844],[1116,864],[1054,836]],0,0,{width:1225,height:1284,roots:[[500,472],[505,490],[508,510],[507,535],[500,553]],edge:[[651,55],[717,52],[789,69],[856,105],[914,159],[977,193],[1034,244],[1094,298],[1140,369],[1162,445],[1167,531],[1165,624],[1155,710],[1132,784],[1078,848],[1018,922],[955,1013],[857,1080],[755,1138]]}),Ki(n,p,[[620,282],[648,282],[675,288],[708,300],[735,315]],[[624,272],[657,196],[705,126],[772,89],[841,64],[918,66],[985,72],[1047,76],[1043,123],[1027,180],[1022,239],[1006,299],[981,347]],1),Ki(n,p,[[451,524],[510,525],[595,516],[680,509],[765,502],[850,498],[928,486],[991,476]],[[454,537],[504,571],[552,679],[602,768],[665,820],[736,863],[808,916],[878,946],[948,956],[1022,942],[1070,919],[1043,874],[1002,780],[984,641],[991,479]],2);let E=[],D=[],O=new di,k=new fi;for(let t of[-1,1]){Ki(n,p,zi,Bi,4,t),E.push(Ki(n,p,Vi,Hi,3,t));let r=new vr(.083,e?20:48,e?12:32),i=r.attributes.position,a=r.attributes.uv;for(let e=0;e<i.count;e++)a.setXY(e,(240+i.getX(e)/wi)/1536,1-(400-i.getY(e)/wi)/1024);let o=new mr(r,ni(new Cr({map:p,bumpMap:p,bumpScale:5e-4,roughness:.48,metalness:0,clearcoat:.06,clearcoatRoughness:.15,envMapIntensity:.025}),C,{eye:!0})),[s,c]=ki([240,400]),l=new Ut;l.name=`Eye socket pivot ${t}`,l.position.set(s,c,t*.12);let u=k;D.push({pivot:l,motion:u,side:t,socket:[s,c,t*.12]}),o.position.set(0,0,t*.02),o.scale.set(1,1,.5),l.add(o);let d=new mr(new vr(.045,e?16:40,e?10:28),new Cr({color:66308,roughness:.22,clearcoat:.06,envMapIntensity:.025}));d.scale.z=.1,d.position.set(0,.006,t*.063),l.add(d),n.add(l)}let A=new d,j=0,M=m.strength,N=.045,P=.12,F=.3,I=0,L=0,R=0,z=0,B=0,ee=new q,te=new q,ne=new Xe,re=new q,ie=new q,se=!1,ce=[0,0,0,0],le=new q,ue=[0,0,0,0],V=new ht,de=new q,H={data:/* @__PURE__ */ new Float64Array(224),count:0};return n.userData={ready:Promise.all([f,v,...b]),macroTextures:C,scaleCount:0,finCount:7,revision:`1.12`,gulp:{lift:0,phase:`none`,clock:-1,lip:[0,0,0],surfaceY:1.5},display:O,eyes:D,gait:A,bodyMotion:o,finDynamics:a,water:m,mode:`hover`,update(e,t=!1){let i=Ci(e-j,0,.07);j=e,O.advance(i),ji.uFlare.value=O.flare,k.advance(i,L,O.flare),ji.uTime.value=e;let l=e%32,u=.045,d=.12,f=0,p=0,g=`hover`,_=(e,t,n)=>Je.smoothstep(n,e,t);if(l<10)f=.3,p=.004*Math.sin(e*.8);else if(l<13){let e=_(10,13,l);u=.36*Math.sin(xi*e)+.07,f=Si(.3,-.38,e),p=Si(0,.09,e),d=.12-.13*Math.sin(xi*e),g=`glide`}else if(l<16){let e=_(13,16,l);f=-.38,p=.09,d=.12+xi*e,u=.07+.12*Math.sin(xi*e),g=`turn`}else if(l<26)f=-.38,p=.09,d=xi+.12,u=.045,g=`hover`;else if(l<29){let e=_(26,29,l);f=Si(-.38,.3,e),p=Si(.09,-.03,e),d=xi+.12-.12*Math.sin(xi*e),u=.32*Math.sin(xi*e)+.07,g=`glide`}else{let e=_(29,32,l);f=.3,p=Si(-.03,0,e),d=xi+.12+xi*e,u=.07+.12*Math.sin(xi*e),g=`turn`}t&&(f=0,p=0,d=.1,u=.045,g=`hover`);let v=n.userData.locomotion,y=v||t?null:bi(e);R=Je.damp(R,y?y.lift:0,6,i),R<1e-4&&!y?.lift&&(R=0);let b=yi(y,R);z=Je.damp(z,b.mouth,25,i),B=Je.damp(B,b.gill,25,i),y&&y.phase!==`none`&&(u+=.14*y.swim,g=`surface`),v&&(u=v.drive,g=v.mode),N=Je.damp(N,u,3,i);let x=P;P+=Math.atan2(Math.sin(d-P),Math.cos(d-P))*(1-Math.exp(-3*i)),v&&(P=v.heading);let S=v?v.angularVelocity:i?(P-x)/i:0;L=Je.damp(L,v?v.steerRate??S:S,4,i),F=Je.damp(F,f,2,i),I=Je.damp(I,p,2,i),M=Je.damp(M,m.strength,1.8,i);let C=n.position.clone(),w=v?n.quaternion.clone():null;if(n.position.set(F+.325*(1-Math.cos(P)),I+.003*Math.sin(e*1.31),.325*Math.sin(P)),n.rotation.set(.004*Math.sin(e*.57),P,.004*Math.sin(e*.71)-N*.025-R*.85),R>1e-4){n.updateMatrixWorld(!0),o.transform(-1.68,.0832,0,ce),n.localToWorld(le.set(ce[0],ce[1],ce[2]));let e=R*(1.47-le.y);n.position.y+=e,le.y+=e}v&&(n.position.fromArray(v.position),n.rotation.set(v.roll??0,P,-v.pitch,`YZX`));let T=v?v.velocity:i?n.position.clone().sub(C).multiplyScalar(1/i).toArray():[0,0,0],E=n.userData.externalFlow??h(e,n.position.x,n.position.y,n.position.z,M,m.direction,[]),ae;if(v){let e=n.quaternion.clone().invert(),t=e.clone().multiply(w).invert();t.w<0&&(t.x*=-1,t.y*=-1,t.z*=-1,t.w*=-1);let r=Math.hypot(t.x,t.y,t.z),a=i>0&&r>1e-8?2*Math.atan2(r,t.w)/(r*i):0;ae={flow:new q().fromArray(E).applyQuaternion(e).toArray(),velocity:new q().fromArray(T).applyQuaternion(e).toArray(),angular:[t.x*a,t.y*a,t.z*a]}}let oe=Math.hypot(...E.map((e,t)=>e-T[t])),fe=n.userData.solids;if(H.count=0,fe){n.updateMatrix(),V.copy(n.matrix).invert();for(let e=0;e<Math.min(fe.count,32);e++){let t=fe.data,n=e*7;for(let e=0;e<6;e+=3)de.set(t[n+e],t[n+e+1],t[n+e+2]).applyMatrix4(V),H.data[n+e]=de.x,H.data[n+e+1]=de.y,H.data[n+e+2]=de.z;H.data[n+6]=t[n+6]}H.count=Math.min(fe.count,32)}i>0&&(re.set((T[0]-ee.x)/i,(T[1]-ee.y)/i,(T[2]-ee.z)/i),se||re.set(0,0,0),re.clampLength(0,20),te.lerp(re,1-Math.exp(-12*i)),ee.fromArray(T),se=!0),ne.copy(n.quaternion).invert(),re.copy(te).applyQuaternion(ne);let U=n.userData.down;ie.set(U?U[0]:0,U?U[1]:-1,U?U[2]:0).applyQuaternion(ne);let pe=Oi[g]??{};A.advance(i,N,oe,L,v?{...pe,back:v.backing??0,pushes:v.pushes??0,pushSize:v.pushSize??0,kicks:v.kicks??0,kickSize:v.kickSize??0,kickSweeps:v.kickSweeps??1,dart:v.dart??0,brake:v.brake??0,hold:v.hold}:pe);let{phase:me,effort:he,breathPhase:ge,breathDepth:_e,pectoralPhase:ve,pectoralPower:ye,scull:be,tuck:W,pectoralEffort:G,pectoralScull:xe,billowPhase:Se,wash:Ce,push:we,dart:Te,brake:Ee}=A;o.advanceTurn(i,v?v.steerRate??S:L,v?v.speed??0:Math.hypot(...T),v?.pitchRate??0,v?.curl??null),o.update(me,he,L,ge,v?.gulp??z,v?.gulpGill??B,_e,A.kick,A.kickAt,A.kickSweeps);for(let{pivot:e,motion:t,side:n,socket:r}of D){let i=o.frame(r[0],ue);e.position.set(i[0]-r[2]*i[3],r[1]+o.archAt(r[0]),i[1]+r[2]*i[2]),e.rotation.set(-t.pitch*n,t.yaw*n-Math.atan2(i[3],i[2]),0)}if(R>0||n.userData.gulp.lift>0){let e=n.userData.gulp;e.lift=R,e.phase=b.phase,e.clock=b.clock,le.toArray(e.lip)}s.needsUpdate=c.needsUpdate=i>0,ji.uPhase.value=me,ji.uDrive.value=N,ji.uTurn.value=L,ji.uFold.value=N,ji.uMouth.value=o.mouth,ji.uGill.value=o.gill;let De={body:o,time:e,mode:g,phase:me,pectoralPhase:ve,pectoralPower:ye,scull:be,tuck:W,pectoralEffort:G,pectoralScull:xe,drive:he*.55,effort:he,turn:L,flare:ji.uFlare.value,clamp:O.clamp,push:we,dart:Te,brake:Ee,kick:A.kick,kickAt:A.kickAt,kickSweeps:A.kickSweeps,hold:A.hold,surfaceY:n.userData.surfaceY===void 0?void 0:n.userData.surfaceY+(U?U[0]*n.position.x+U[1]*n.position.y+U[2]*n.position.z:-n.position.y),billowPhase:Se,wash:Ce,speed:oe/r,accel:re.toArray(),down:ie.toArray(),heading:P,angularVelocity:S,velocity:T,origin:n.position.toArray(),localHydrodynamics:ae,solids:H.count?H:null,curl:o.curl,strength:M,direction:m.direction,externalFlow:n.userData.externalFlow,bodyRadius(e,t){let n=e/wi+680;if(n<155||n>1010)return 0;Fi(n,ue);let r=ue[1],i=ue[2],a=ue[3],o=(420-(r+i)/2)*wi,s=(i-r)*.5*wi,c=(t-o)/s;return Math.abs(c)>=1?0:Math.sqrt(1-c*c)*a*wi}};for(let e of a)e.advance(i,De),e.texture.needsUpdate=i>0;n.userData.flowStrength=M,n.userData.mode=g,n.userData.drive=N,n.userData.effort=he,n.userData.stroke=A.stroke,n.userData.breathPhase=ge,n.userData.turn=L}},n}let Z=(e,t,n)=>Math.max(t,Math.min(n,e)),Ji=(e,t,n,r)=>e+(t-e)*(1-Math.exp(-n*r)),Yi=e=>Math.atan2(Math.sin(e),Math.cos(e)),Q=(e,t,n)=>{let r=Z((n-e)/(t-e),0,1);return r*r*(3-2*r)};function Xi(e,t,n=0,r=e.length,i=3){let a=Math.hypot(t[0],t[1],t[2]);if(!(a>0))return;let o=t[0]/a,s=t[1]/a,c=t[2]/a,l=Math.cos(a),u=Math.sin(a);for(let t=n;t<r;t+=i){let n=e[t],r=e[t+1],i=e[t+2],a=(o*n+s*r+c*i)*(1-l);e[t]=n*l+(s*i-c*r)*u+o*a,e[t+1]=r*l+(c*n-o*i)*u+s*a,e[t+2]=i*l+(o*r-s*n)*u+c*a}}let Zi=(e,t,n)=>{let r=[n[0]-t[0],n[1]-t[1],n[2]-t[2]],i=Z(((e[0]-t[0])*r[0]+(e[1]-t[1])*r[1]+(e[2]-t[2])*r[2])/Math.max(r[0]**2+r[1]**2+r[2]**2,1e-12),0,1);return[t[0]+r[0]*i,t[1]+r[1]*i,t[2]+r[2]*i]},Qi=.105,$i=1.3,ea=.32,ta=.003,na=.048,ra=.0087,ia=Math.hypot(na,ra),aa=Math.atan2(ra,na),oa=(e,t)=>e+na*Math.sin(t)+ra*Math.cos(t),sa=(e,t,n)=>{let r=na*Math.cos(n)-ra*Math.sin(n);return[e[0]-Math.cos(t)*r,oa(e[1],n),e[2]+Math.sin(t)*r]},ca=(e,t)=>Math.asin(Z((t-e)/ia,-1,1))-aa,la=(e,t=ea)=>1.1*(Q(0,.4*t,e)-Q(.6*t,t,e)),ua=e=>Math.sin(Math.PI*Z(e/.5,0,1))**1.2,da=/* @__PURE__ */ new Set([`rise`,`gulp`,`dive`]),fa=/* @__PURE__ */ new Set([`mirror`,`lap`,`rest`]),pa=.049,ma=.16,ha=.85,ga=.12,_a=.16,va=.009,ya=1.5,ba=2.5,xa=.5,Sa=.18,Ca=.6,wa=.45,Ta=1.6,Ea=.4,Da=.035,Oa=[[.08,.15],[.15,.15],[.22,.17],[.29,.14],[.36,.05]],ka=[[-.05,0,.006],[0,.004,.026],[.1,.004,.04],[.2,.002,.026]],Aa=1.6*Math.PI,ja=.5,Ma=.5,Na=2.7;var Pa=class{constructor(e=237){this.seed=e,this.position=[.2,-.17,.12],this.velocity=[0,0,0],this.turnVelocity=[0,0,0],this.target=[-.34,-.23,-.18],this.heading=-.35,this.pitch=this.angularVelocity=this.speed=this.time=0,this.pitchTurn=0,this.finsClearing=!1,this.hold=0,this.curl=this.curlMost=0,this.curlFrom=0,this.settleClock=9,this.wasSettled=!1,this.restHeading=0,this.restYaw=this.restPitch=this.restPitchNow=0,this.restShiftClock=0,this.hoverClock=0,this.steerRate=this.roll=this.rollRate=this.pitchRate=0,this.sharpTurn=!1,this.yawAccum=0,this.spinBreaks=0,this.waterSpin=[0,0,0],this.drive=.045,this.mode=`cruise`,this.timer=7,this.cruiseSpeed=.12,this.turnRadius=.08,this.drift=[0,0,0],this.initialized=!1,this.phases=Array.from({length:8},(t,n)=>2*Math.PI*((Math.imul(e^668265261*(n+1),374761393)>>>0)/4294967296)),this.hoverYaw=this.heading,this.hoverPivot=.3,this.activity=0,this.gulpSeed=(e^2654435769)>>>0,this.behaviorSeed=(e^2246822507)>>>0,this.trimSeed=(e^3266489909)>>>0,this.trimClock=0,this.trimPitch=this.trimRoll=this.trimYaw=this.trimNudge=this.trimKick=0,this.backing=0,this.pushes=this.kicks=0,this.pushSize=this.kickSize=0,this.kickSweeps=1,this.cueClock=9,this.yawStroke=this.turnStroke=0,this.leadClock=9,this.leadTime=Sa,this.turnSide=0,this.intent=0,this.dart=this.brake=0,this.dartClock=this.brakeClock=9,this.dartReady=!1,this.dartSpeed=xa,this.hardStop=!1,this.lungeAt=1/0,this.lunge=!1,this.hoverLeft=0,this.nextGulp=22+this.gulpRandom()*14,this.tripPitch=$i,this.risePace=.2,this.gulpLength=ea,this.gillClock=99,this.diveClock=0,this.mirrorReady=30+this.behaviorRandom()*25,this.lapReady=70+this.behaviorRandom()*40,this.restReady=50+this.behaviorRandom()*35,this.behaviorClock=this.holdClock=0,this.flaring=!1,this.mirrorLook=0,this.flareFrom=this.flareBy=this.flareUntil=-1,this.flaringAfter=!1,this.mirrorPoint=[0,0,0],this.mirrorFace=0,this.mirrorSide=1,this.mirrorHold=5,this.mirrorArrived=!1,this.lapDir=1,this.lapY=0,this.lapAngle=this.lapTravelled=0,this.lapLength=2*Math.PI,this.lapBest=this.lapBestAt=0,this.restY=0,this.restHold=8,this.restSettled=!1,this.restBest=1/0,this.restBestAt=0,this.perch=null,this.gulpClock=0,this.gulp=this.gulpGill=0,this.surfaceY=NaN,this.flowRef=this.spinRef=null,this.jolt=0,this.joltVector=[0,0,0],this.startleReady=4,this.startleClock=0,this.startleHeading=0,this.startleDive=!1,this.food=null,this.gape=0,this.feedHold=0,this.feedRetry=0,this.feedAim=0,this.feedLook=ja,this.snapClock=-1,this.obstacles=[],this.gulpUrge=0,this.lethargy=0,this.gasp=0,this.gulpFrom=0,this.gulps=0,this.gulpsLeft=0,this.restSide=1}get slump(){return Math.min(1,2*this.lethargy)}gulpDue(){return this.gasp>0?this.gulpFrom+(this.nextGulp-this.gulpFrom)/(1+9*Z(this.gasp,0,1)):this.nextGulp}turnWith(e){for(let t of[this.position,this.velocity,this.target,this.mirrorPoint])Xi(t,e);this.perch&&(Xi(this.perch.at,e),Xi(this.perch.approach,e));let t=e[1];this.heading=Yi(this.heading+t),this.hoverYaw=Yi(this.hoverYaw+t),this.perch&&(this.perch.heading=Yi(this.perch.heading+t)),this.mirrorFace=Yi(this.mirrorFace+t),this.startleHeading=Yi(this.startleHeading+t),this.lapAngle=Yi(this.lapAngle-t)}obstacleGap(e){let t=1/0,n=[0,0,0];for(let r of this.obstacles){let i=Zi(e,r.a,r.b),a=[e[0]-i[0],e[1]-i[1],e[2]-i[2]],o=Math.hypot(...a);o-r.r<t&&(t=o-r.r,n=o>1e-9?a.map(e=>e/o):[0,1,0])}return{gap:t,away:n}}finGap(e,t,n){let r=1/0,i=[0,1,0],a=Math.cos(t),o=Math.sin(t),s=Math.cos(n),c=Math.sin(n);for(let[t,n]of Oa){let l=[e[0]+a*s*t-a*c*n,e[1]-c*t-s*n,e[2]-o*s*t+o*c*n];for(let e of this.obstacles){let t=e.fin??e.solid;if(!(t>0))continue;let n=Zi(l,e.a,e.b),a=[l[0]-n[0],l[1]-n[1],l[2]-n[2]],o=Math.hypot(...a);o-t<r&&(r=o-t,i=o>1e-9?a.map(e=>e/o):[0,1,0])}}for(let[t,n,l]of ka){let u=[e[0]+a*s*t-a*c*n,e[1]-c*t-s*n,e[2]-o*s*t+o*c*n];for(let e of this.obstacles){let t=e.fin>0?e.fin-.012:e.solid;if(!(t>0))continue;let n=Zi(u,e.a,e.b),a=[u[0]-n[0],u[1]-n[1],u[2]-n[2]],o=Math.hypot(...a);o-t-l<r&&(r=o-t-l,i=o>1e-9?a.map(e=>e/o):[0,1,0])}}return{gap:r,away:i}}clearWay(e,t){if(!this.obstacles.length)return!0;for(let n=1;n<=6;n++){let r=n/6;if(this.obstacleGap(this.position.map((t,n)=>t+(e[n]-t)*r)).gap<t)return!1}return!0}readJolt(e,t,n){let r=t?.flow,i=t?.angular;if(!r||!i||n<.9)return this.flowRef=this.spinRef=null,this.joltVector=[0,0,0],0;this.flowRef||(this.flowRef=[...r],this.spinRef=[...i]);let a=r.map((e,t)=>e-this.flowRef[t]),o=Math.hypot(...i.map((e,t)=>e-this.spinRef[t])),s=1-Math.exp(-1.5*e);for(let e=0;e<3;e++)this.flowRef[e]+=a[e]*s,this.spinRef[e]+=(i[e]-this.spinRef[e])*s;return this.joltVector=a,Math.max(Math.hypot(...a),.5*o)}startStartle(e){this.closeBehavior();let t=this.bounds(e),[n,r,i]=this.joltVector,a=Math.hypot(n,i)>.3*Math.hypot(n,r,i),o=Yi((a?Math.atan2(i,-n):this.heading+(this.random()<.5?-1.4:1.4))-this.heading);Math.abs(o)<.8&&(o=(o<0?-1:1)*.8),o=Z(o,-2.6,2.6);let s=e=>{let n=[this.position[0]-Math.cos(e)*.32,this.position[1],this.position[2]+Math.sin(e)*.32];return Math.hypot(...n)<=t.radius&&this.clearWay(n,0)};!a&&!s(this.heading+o)&&(o=-o);let c=null;for(let e of[0,.45,-.45,.9,-.9,1.35,-1.35]){if(Math.abs(o+e)<.7)continue;let t=this.heading+o+e;if(s(t)){c=t;break}}this.startleHeading=Yi(c??Math.atan2(-this.position[2],this.position[0])),this.startleDive=Number.isFinite(this.surfaceY)&&this.surfaceY-this.position[1]<.1,this.mode=`startle`,this.startleClock=0,this.timer=99,this.sharpTurn=!1,this.startleReady=this.time+10,this.nextGulp=Math.max(this.nextGulp,this.time+30+this.gulpRandom()*30)}wander(e,t=1){let n=this.phases[e],r=this.time*t;return(Math.sin(.83*r+n)+.6*Math.sin(1.91*r+2.3*n)+.35*Math.sin(3.37*r+4.1*n))/1.95}wanderRate(e,t=1){let n=this.phases[e],r=this.time*t;return t*(.83*Math.cos(.83*r+n)+1.146*Math.cos(1.91*r+2.3*n)+1.1795*Math.cos(3.37*r+4.1*n))/1.95}streamRandom(e){let t=this.seed;this.seed=this[e];let n=this.random();return this[e]=this.seed,this.seed=t,n}gulpRandom(){return this.streamRandom(`gulpSeed`)}behaviorRandom(){return this.streamRandom(`behaviorSeed`)}trimRandom(){return this.streamRandom(`trimSeed`)}advanceTrim(e,t){this.trimKick=Math.max(0,this.trimKick-e),t?(this.trimClock-=e,!(this.trimClock>0)&&(this.trimClock=.7+1.8*this.trimRandom(),this.trimPitch=.08*(2*this.trimRandom()-1),this.trimRoll=.06*(2*this.trimRandom()-1),this.trimYaw=_a*(2*this.trimRandom()-1),this.trimNudge=va*this.trimRandom(),this.trimKick=.45,this.yawStroke+=1.5*this.trimYaw,this.cue(.35+.5*Math.max(Math.abs(this.trimYaw)/_a,this.trimNudge/va),0,1))):(this.trimClock=0,this.trimPitch=this.trimRoll=this.trimKick=0)}cue(e,t,n,r=1,i=0,a=!1){e>0&&(this.pushes++,this.pushSize=Math.min(1,e)),t>0&&(this.kicks++,this.kickSize=Math.min(1,t)*(n<0?-1:1),this.kickSweeps=r),a||(this.cueClock=0),i&&(this.leadClock=0,this.leadTime=i)}behaviorOk(e,t,n){return!!e&&n&&t>.99&&(e.airAbove??0)<.1&&Number.isFinite(e.sand)}tryMirror(e,t){if(!t||this.lethargy>=.4||this.time<this.mirrorReady)return!1;let[n,r,i]=this.position,a=Math.hypot(n,i),o=Math.sqrt(Math.max(0,(e.radius+.025)**2-r*r));if(a<.5*o||o-a>.3||r>e.high+.05||r<e.low-.05)return!1;let s=n/a,c=i/a;return s*-Math.cos(this.heading)+c*Math.sin(this.heading)<0||!this.clearWay([s*o,r,c*o],.05)||this.behaviorRandom()>.6*(1-this.lethargy/.4)?!1:(this.mode=`mirror`,this.timer=99,this.sharpTurn=!1,this.behaviorClock=this.holdClock=0,this.mirrorArrived=!1,this.mirrorPoint=[s*o,r,c*o],this.mirrorFace=Math.atan2(c,-s),this.mirrorSide=this.behaviorRandom()<.5?-1:1,this.mirrorHold=3*(1+this.behaviorRandom()*.8),!0)}tryLap(e,t){if(!t||this.lethargy>=.4||this.time<this.lapReady)return!1;let[n,r,i]=this.position;return Math.hypot(n,i)<.2||this.behaviorRandom()>.5*(1-this.lethargy/.4)?!1:(this.mode=`lap`,this.timer=99,this.sharpTurn=!1,this.behaviorClock=0,this.cruiseSpeed=.058,this.lapDir=this.behaviorRandom()<.5?-1:1,this.lapLength=Math.PI*(1.5+this.behaviorRandom()),this.lapY=Z(r,e.low+.02,e.high-.04),this.lapAngle=Math.atan2(i,n),this.lapTravelled=0,this.lapBest=0,this.lapBestAt=this.time,!0)}tryRest(e,t,n){if(!n)return!1;if(this.slumpDown(e,t,n))return!0;let r=t.sand+pa;if(this.time<this.restReady)return!1;let i=this.behaviorRandom()<.5?this.findPerch(e,t):null;return i?this.lieDown(i.at[1],i):!this.restRoom(e,this.position[0],r,this.position[2])||this.behaviorRandom()>.5*(1+this.slump)||this.obstacleGap([this.position[0],r,this.position[2]]).gap<.1?!1:this.lieDown(r)}perchClear(e,t){return this.obstacles.every(n=>{let r=Zi(e,n.a,n.b),i=Math.hypot(e[0]-r[0],e[1]-r[1],e[2]-r[2]);return i>=.6*n.r+.01&&i>=(n.solid??0)+t-.004})}findPerch(e,t){let n=null,r=.5,[i,,a]=this.position;for(let o of this.obstacles){if(!((o.solid??0)>=.04))continue;let s=[o.b[0]-o.a[0],o.b[1]-o.a[1],o.b[2]-o.a[2]],c=Math.hypot(s[0],s[2]);if(c<1e-6||Math.abs(s[1])>.35*c)continue;let l=[o.a[0]+s[0]/2,o.a[1]+s[1]/2+o.solid+.041,o.a[2]+s[2]/2],u=Math.hypot(l[0]-i,l[2]-a);if(u>=r||u<.12||l[1]>e.high||l[1]<t.sand+.049||Math.hypot(...l)>e.radius)continue;let d=(l[0]-i)*s[0]+(l[2]-a)*s[2]<0?-1:1,f=d*s[0]/c,p=d*s[2]/c,m=[l[0]-f*ma,l[1]+.05,l[2]-p*ma];Math.hypot(...m)>e.radius||!this.perchClear(l,.041)||!this.perchClear(m,.041)||!this.clearWay(m,.04)||(n={at:l,approach:m,heading:Math.atan2(p,-f),pitch:Math.atan2(d*s[1],c),near:!1,nearAt:0},r=u)}return n}slumpDown(e,t,n){if(!n||!(this.lethargy>0)||this.behaviorRandom()>=this.slump)return!1;let r=t.sand+pa;return!!this.restLanding(e,this.position,this.heading,r)&&this.lieDown(r)}lieDown(e,t=null){return this.mode=`rest`,this.timer=99,this.sharpTurn=!1,this.behaviorClock=this.holdClock=0,this.restSettled=!1,this.perch=t,this.restY=e,this.restHold=(9+this.behaviorRandom()*12)*(1+5*this.lethargy),this.restBest=1/0,this.restBestAt=0,this.lethargy>0&&(this.restSide=this.behaviorRandom()<.5?-1:1),!0}restRoom(e,t,n,r){return Math.hypot(t,r,n)<=e.radius+.02+.06*this.lethargy}descentPitch(e){return Math.min(.75,.08+5*e)}restRun(e){let t=(e-.004)/6;return Array.from({length:6},(n,r)=>t>0?t/Math.tan(this.descentPitch(e-(r+.5)*t))*(1-ha*this.slump):0)}restLanding(e,t,n,r){let i=-Math.cos(n),a=Math.sin(n),o=[t[0],t[1],t[2]],s=this.restRun(t[1]-r),c=.12*this.lethargy;for(let e of s)if(o[0]+=i*e,o[1]-=(t[1]-r-.004)/6,o[2]+=a*e,this.obstacleGap(o).gap<.05-c)return null;return o[1]=r,this.restRoom(e,o[0],r,o[2])&&this.obstacleGap(o).gap>=.1-c?o:null}seekRest(e,t,n){if(!n||this.behaviorRandom()>=this.slump)return!1;let r=t.sand+pa,[i,a,o]=this.position,s=Z(a-.08,e.low,e.high),c=null,l=1/0;for(let t=0;t<12;t++){let t=.45*Math.sqrt(this.behaviorRandom()),n=2*Math.PI*this.behaviorRandom(),a=t*Math.cos(n),u=t*Math.sin(n),d=Math.hypot(a-i,u-o);if(d>=l||!this.restRoom(e,a,r,u)||this.obstacleGap([a,r,u]).gap<.1-.12*this.lethargy)continue;let f=Math.atan2(u-o,-(a-i)),p=this.restRun(s-r).reduce((e,t)=>e+t,0);if(d<p+.15)continue;let m=[a-(a-i)/d*p,s,u-(u-o)/d*p];Math.hypot(m[0],m[2])>Math.sqrt(Math.max(0,e.radius**2-s*s))||!this.clearWay(m,.06)||!this.restLanding(e,m,f,r)||(c=m,l=d)}return c?(this.mode=`cruise`,this.timer=15,this.sharpTurn=!1,this.target=c,this.cruiseSpeed=.06*(1-.55*this.lethargy),!0):!1}lapGoal(e){let t=this.lapY+.035*Math.sin(2*Math.PI*this.behaviorClock/11),n=.78*Math.sqrt(Math.max(0,e.radius**2-t*t)),r=Math.atan2(this.position[2],this.position[0])+this.lapDir*.55;return[n*Math.cos(r),t,n*Math.sin(r)]}stepBehavior(e,t,n,r,i){if(!this.behaviorOk(n,r,i)){this.endBehavior(t);return}this.behaviorClock+=e;let[a,o,s]=this.position;if(this.mode===`mirror`){let n=Math.hypot(...this.mirrorPoint.map((e,t)=>e-this.position[t]));!this.mirrorArrived&&n<.05&&(this.mirrorArrived=!0,this.holdClock=0),!this.flaring&&n<.08&&this.mirrorLook>=.45&&(this.flaring=!0,this.holdClock=0),this.flaring&&(this.holdClock+=e),(this.mirrorArrived&&this.holdClock>=this.mirrorHold||this.behaviorClock>16)&&this.endBehavior(t)}else if(this.mode===`lap`){let e=Math.atan2(s,a);this.lapTravelled+=this.lapDir*Yi(e-this.lapAngle),this.lapAngle=e,this.lapTravelled>this.lapBest+.15&&(this.lapBest=this.lapTravelled,this.lapBestAt=this.time),(this.lapTravelled>=this.lapLength||this.behaviorClock>90||this.time-this.lapBestAt>8)&&this.endBehavior(t)}else if(this.mode===`rest`){let r=this.perch;r||(this.restY=n.sand+pa);let i=r?Math.hypot(a-r.at[0],o-r.at[1],s-r.at[2]):0,c=r?r.near&&(i<.035||this.behaviorClock-r.nearAt>3&&i<.06&&Math.abs(o-r.at[1])<.025):o-this.restY<.004;!this.restSettled&&(c||!r&&this.behaviorClock>20&&(o-this.restY<.012||Math.abs(this.velocity[1])<.002))&&(this.restSettled=!0,this.holdClock=0);let l=r?r.near?i:Math.hypot(a-r.approach[0],o-r.approach[1],s-r.approach[2]):o-this.restY;if(l<this.restBest-.005&&(this.restBest=l,this.restBestAt=this.behaviorClock),!this.restSettled&&this.behaviorClock-this.restBestAt>5){if(!r&&l<.03)this.restSettled=!0,this.holdClock=0;else{let e=n.sand+pa,i=this.bounds(t);if(r&&this.restRoom(i,a,e,s)&&this.restLanding(i,this.position,this.heading,e))this.lieDown(e),this.restBest=1/0,this.restBestAt=0;else{this.endBehavior(t);return}}}if(!this.restSettled&&r&&this.behaviorClock>20){this.endBehavior(t);return}this.restSettled&&(this.holdClock+=e),(this.restSettled&&this.holdClock>=this.restHold||this.behaviorClock>40*(1+5*this.lethargy))&&this.endBehavior(t)}}closeBehavior(){if(!fa.has(this.mode))return;let e=this.behaviorRandom();this.mode===`mirror`?this.mirrorReady=this.time+60+e*60:this.mode===`lap`?this.lapReady=this.time+120+e*80:this.restReady=this.time+90+e*70-.6*this.lethargy*(90+e*70),this.mirrorReady=Math.max(this.mirrorReady,this.time+15),this.lapReady=Math.max(this.lapReady,this.time+20),this.restReady=Math.max(this.restReady,this.time+20),this.flaring=!1,this.mirrorArrived=!1,this.mirrorLook=0,this.perch=null}endBehavior(e){this.closeBehavior(),this.mode=`glide`,this.timer=1.1+this.random()*.8,this.sharpTurn=!1,this.chooseTarget(e)}random(){this.seed=this.seed+1831565813>>>0;let e=Math.imul(this.seed^this.seed>>>15,1|this.seed);return e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}bounds(e){let t=e.sandLevel+.22,n=e.level-.2;return{radius:Math.max(.1,e.radius-.34),low:Math.min(t,n),high:n}}chooseTarget(e){let t=this.bounds(e),n=this.random()<.18,r=this.lethargy,i=.45*(1-.45*r),a=-1/0,o=!1;for(let e=0;e<16;e++){let e=t.low+(t.high-t.low)*(.08+.84*this.random()),s=Math.sqrt(Math.max(0,t.radius**2-e*e))*Math.sqrt(this.random())*.86,c=this.random()*Math.PI*2,l=[s*Math.cos(c),e,s*Math.sin(c)],u=l.map((e,t)=>e-this.position[t]),d=Math.hypot(...u),f=(-u[0]*Math.cos(this.heading)+u[2]*Math.sin(this.heading))/Math.max(d,1e-6)*(n?-.7:.8)+this.random()*.45-Math.abs(d-i)-(d<.22?2:0);r>0&&(f-=r*(1.5*(e-t.low)/Math.max(t.high-t.low,1e-6)+3*Math.max(0,s-.22)));let p=Yi(Math.atan2(u[2],-u[0])-this.heading);p*this.yawAccum>0&&(f-=Math.abs(p)*Q(1.5,3,Math.abs(this.yawAccum)));let m=Math.hypot(u[0],u[2]);m<.22||Math.abs(u[1])>.32*m+.05||this.clearWay(l,.06)&&(this.finGap(l,Math.atan2(u[2],-u[0]),0).gap<.05||f>a&&(a=f,this.target=l,o=!0))}o||(this.target=this.targetAhead(t,.4)),this.cruiseSpeed=(.1+this.random()*.09)*(1-.55*r),this.turnRadius=.05+.06*this.random(),this.hardStop=this.random()<.45*(1-r)}feedPlan(e,t,n){let[r,i,a]=this.food,o=sa(this.position,this.heading,this.pitch),s=r-o[0],c=a-o[2],l=Math.hypot(s,c),u=Math.atan2(c,-s),d=Math.cos(this.pitch),f=[s,i-o[1],c],p=Math.hypot(...f),m=Math.atan2(f[1],l),h=-Math.cos(this.heading)*d*f[0]+Math.sin(this.pitch)*f[1]+Math.sin(this.heading)*d*f[2]>.75*p;if(!this.foodAtFilm())return{goal:[r-t*na,i-ra,a-n*na],yaw:u,plan:l,reach:p,elevation:m,before:h,stage:`swim`};let g=this.surfaceY-ta-o[1],_=Math.cos(u-this.heading),v=.45*Math.max(0,g-.01),y=this.feedAim>0;if(this.time>=this.feedRetry&&(l<.03||_>(y?.6:.85)&&l<v+(y?.08:.03)&&l>.6*v-.02))return{goal:[r-t*na,e,a-n*na],yaw:u,plan:l,reach:p,elevation:m,before:h,stage:this.feedAim<this.feedLook?`aim`:`rise`};let b=r-this.position[0],x=a-this.position[2],S=Math.max(Math.hypot(b,x),1e-6),C=.129,w=[r-b/S*C,Math.min(e,this.surfaceY-.18),a-x/S*C],T=w[0]-this.position[0],E=w[2]-this.position[2];return{goal:w,yaw:Math.hypot(T,E)<.05?u:Math.atan2(E,-T),plan:Math.max(l,Math.hypot(T,E)),reach:p,elevation:m,before:!1,stage:`approach`}}foodAtFilm(){return!!this.food&&Number.isFinite(this.surfaceY)&&this.food[1]>this.surfaceY-.03}targetAhead(e,t){let n=this.position[0]-Math.cos(this.heading)*t,r=this.position[2]+Math.sin(this.heading)*t,i=Z(this.position[1],e.low,e.high),a=Math.sqrt(Math.max(0,e.radius**2-i*i))*.86,o=Math.hypot(n,r);return o>a&&(n*=a/o,r*=a/o),[n,i,r]}advance(e,t,n,r=!0,i=null,a=null){if(!(e>0))return;let o=Math.min(e,.07);for(;o>1e-8;){let e=Math.min(1/60,o);this.step(e,t,n,r,i,a),o-=e}}step(e,t,n,r,i,a=null){let o=this.bounds(n);this.initialized||=(this.position[1]=Z(this.position[1],o.low,o.high),this.target[1]=Z(this.target[1],o.low,o.high),!0),this.time+=e,this.timer-=e,this.gillClock+=e,this.diveClock+=e,this.cueClock+=e,this.dartClock+=e,this.brakeClock+=e,this.leadClock+=e,this.settleClock+=e,this.activity=Ji(this.activity,this.drive>.12||this.flaring?1:0,e,1/40);let s=n.gravity??[0,-24,0],c=Math.hypot(...s),l=i?.surface,u=c>1&&-s[1]>.985*c,d=Number.isFinite(l)&&Math.abs(l-n.level)<.04&&u;d&&(this.surfaceY=Number.isFinite(this.surfaceY)?Ji(this.surfaceY,l,e,6):l);let f=i?.submerged??+!!r;this.jolt=this.readJolt(e,i,f),this.mode!==`startle`&&this.jolt>1.25*(1+1.5*this.lethargy)&&this.time>=this.startleReady&&(i.airAbove??0)<.6&&this.startStartle(n),this.mode===`startle`&&(this.startleClock+=e,this.startleClock>=.9&&(this.lethargy<.4&&this.behaviorRandom()<.3&&(this.flareFrom=this.time+.8*(.7+.6*this.behaviorRandom()),this.flareBy=this.time+8,this.flareUntil=2.2*(1+.5*this.behaviorRandom())),this.mode=`glide`,this.timer=1.2+this.random()*.8,this.sharpTurn=!1,this.chooseTarget(n)));let p=this.mode===`startle`;this.food&&!p&&this.mode!==`feed`&&f>.9?(this.closeBehavior(),this.mode=`feed`,this.timer=99,this.sharpTurn=!1,this.feedAim=0,this.feedLook=ja*(1+this.random()),this.snapClock=-1):this.mode===`feed`&&!this.food&&this.gape<.5&&(Number.isFinite(this.surfaceY)&&this.surfaceY-this.position[1]<.1?this.startDive():(this.mode=`glide`,this.timer=1+this.random()*.6,this.chooseTarget(n)));let m=this.mode===`feed`,h=da.has(this.mode),g=this.gulpDue();!h&&!m&&this.time>=g&&d&&this.surfaceY-this.position[1]>.07&&f>.99&&(i.airAbove??0)<.25&&this.mode!==`burst`&&!this.sharpTurn&&(this.closeBehavior(),this.mode=`rise`,this.gulpClock=0,this.timer=9,h=!0,this.tripPitch=$i+.2*(this.gulpRandom()-.5),this.risePace=Z((this.surfaceY-this.position[1])/(.62+.4*this.gulpRandom()),.14,.38),this.gulpLength=ea*(.65+.7*this.gulpRandom())),fa.has(this.mode)&&this.stepBehavior(e,n,i,f,u);let _=this.mode===`rest`&&this.restSettled;if(_&&!this.wasSettled&&(this.settleClock=0,this.brakeClock=0,this.cue(.6,0,1),this.restHeading=this.heading,this.restYaw=this.restPitch=0,this.restShiftClock=ba*(.8+this.trimRandom())),this.wasSettled=_,_){if(this.restShiftClock-=e,this.restShiftClock<=0&&this.settleClock>.7){this.restShiftClock=ba*(1+this.trimRandom()),this.restYaw=.09*(2*this.trimRandom()-1),this.restPitch=.025*(2*this.trimRandom()-1);let e=this.trimRandom()<.35;this.cue(.35+.35*this.trimRandom(),e?.3:0,this.restYaw<0?1:-1)}}else this.restYaw=this.restPitch=0;this.restPitchNow=Ji(this.restPitchNow,this.restPitch,e,3);let v=fa.has(this.mode),y=this.behaviorOk(i,f,u),b=d?g-this.time:1/0,x=this.lethargy,S=1-.8*x,C=this.surfaceY-ta-oa(0,Z(this.pitch,0,1.5)),w=C-this.position[1];h&&(this.gulpClock+=e,this.mode!==`dive`&&(!d||f<.5)?this.startDive():this.mode===`rise`&&(Math.abs(w)<.012&&this.pitch>this.tripPitch-.35||this.timer<=0)?Math.abs(w)<.04?(this.mode=`gulp`,this.gulpClock=0,this.gulps++,this.gulpsLeft=this.gasp>.4?Math.round(8*(this.gasp-.4)/.6*(.4+.6*this.gulpRandom())):0):this.startDive():this.mode===`gulp`&&this.gulpClock>=this.gulpLength?(this.gillClock=0,this.gulpsLeft>0?(this.gulpsLeft--,this.gulps++,this.gulpClock=-1.7*(1+this.gulpRandom())):this.startDive()):this.mode===`dive`&&this.timer<=0&&(this.mode=`cruise`,this.timer=(6+this.random()*5)*(1-.8*Z(this.lethargy,0,1)),this.nextGulp=this.time+150*(1+.5*this.gulpRandom())*(1-.45*this.activity)*(1-.75*Z(this.gulpUrge,0,1)),this.gulpFrom=this.time,this.chooseTarget(n),h=!1));let T=this.target.map((e,t)=>e-this.position[t]),E=Math.hypot(...T),D=Math.hypot(T[0],T[2]),O=Math.abs(Yi(Math.atan2(T[2],-T[0])-this.heading))>1.2,k=E<.075||D<.05||D<2*this.turnRadius&&O;!h&&!p&&!v&&!m&&(this.timer<=0||this.mode!==`hover`&&k)&&(this.mode===`hover`?!this.tryLap(o,y&&b>25)&&!this.tryMirror(o,y&&b>16)&&!this.tryRest(o,i,y&&b>30*S)&&(this.mode=this.random()<.18*(1-x)?`burst`:`cruise`,this.timer=this.mode===`burst`?.65+this.random()*.45:6+this.random()*5,this.chooseTarget(n),this.dartReady=(this.mode===`burst`||this.random()<.4)&&this.random()>=x,this.dartSpeed=xa*(.8+.2*this.random())):this.mode===`burst`?(this.mode=`glide`,this.timer=this.lunge?.35+.3*this.random():1.2+this.random(),this.lunge&&(this.hardStop=!0)):(this.lunge||!this.tryMirror(o,y&&b>16)&&!this.tryRest(o,i,y&&b>30*S)&&!(x>0&&this.seekRest(o,i,y&&b>30*S)))&&(this.mode===`cruise`&&this.timer>0&&!this.hardStop&&this.random()<.3/.55*(1-x)?(this.timer=4+this.random()*4,this.chooseTarget(n)):(this.mode=`hover`,this.timer=this.lunge?Math.max(1,this.hoverLeft):(3+this.random()*9)*(1+2*x),this.hoverYaw=Yi(this.heading+3*(this.random()-.5)),this.hoverPivot=.2+.25*this.random(),this.hardStop&&Math.abs(this.speed)>.05&&(this.brakeClock=0,this.cue(1,0,1)),this.lungeAt=!this.lunge&&this.random()<.25*(1-x)?this.time+1.5+this.random()*Math.max(0,this.timer-2.5):1/0,this.hardStop=this.lunge=!1)));let A=-Math.cos(this.heading),j=Math.sin(this.heading),M=this.position.map((e,t)=>e+(t===0?A:t===2?j:0)*(.1+Math.max(0,this.speed)*.8)),N=m&&!this.food,P=m&&this.food?this.feedPlan(C,A,j):null;P?.stage===`aim`&&(this.feedAim+=e),P?.stage===`rise`&&w<.006?this.feedHold+=e:this.feedHold=0,this.feedHold>.8&&(this.feedHold=0,this.feedRetry=this.time+1.6,this.feedAim=0,P=this.feedPlan(C,A,j));let F=P?.stage===`rise`,I=P?.stage===`aim`;this.snapClock>=0&&(this.snapClock=m&&this.snapClock<.49?this.snapClock+e:-1),P&&this.snapClock<0&&P.before&&P.reach<.1&&(P.stage===`swim`||F)&&(this.snapClock=0);let L=this.snapClock>=0&&this.snapClock<.09,R=this.mode===`rise`||this.mode===`gulp`||F||I,z=!R&&(!r||(i?.airAbove??0)>.25),B=this.mode===`rest`?this.perch:null;B&&!B.near&&Math.hypot(...B.approach.map((e,t)=>e-this.position[t]))<.06&&(B.near=!0,B.nearAt=this.behaviorClock,this.restBest=1/0,this.restBestAt=this.behaviorClock);let ee=this.mode===`rest`?this.position[1]-this.restY:0,te=this.mode===`rest`&&!z&&!this.restSettled,ne=te&&!B&&x>0,re=!h&&!v,ie=this.mode!==`mirror`&&!m&&(this.mode!==`rest`||te)&&Math.hypot(M[0],re?Math.min(M[1],o.high):M[1],M[2])>o.radius,ae=this.obstacles.length&&!z&&this.mode!==`rest`?this.obstacleGap(M):null,oe=!!ae&&ae.gap<.06&&!ie,se=this.mode===`hover`&&this.obstacles.length?this.obstacleGap(this.position):null,ce=!z&&!p&&!m&&!R&&!h&&this.mode!==`rest`&&this.mode!==`mirror`&&this.obstacles.length?this.finGap(this.position,this.heading,this.pitch):null,le=!!ce&&ce.gap<(this.finsClearing?.05:.025)&&!ie;this.finsClearing=le,le&&this.mode===`hover`&&this.timer>0&&(this.timer=0);let ue=!!se&&se.gap<0&&!ie,V=this.target;P?V=P.goal:N?V=[...this.position]:R?V=[this.position[0]+A*.3,C,this.position[2]+j*.3]:this.mode===`dive`?V=[this.position[0]+A*.2,Z(this.position[1]-.1,o.low,o.high),this.position[2]+j*.2]:this.mode===`mirror`?V=this.mirrorPoint:this.mode===`lap`?V=this.lapGoal(o):B?V=B.near?B.at:B.approach:this.mode===`rest`&&(V=[this.position[0]+A*.3,this.restY,this.position[2]+j*.3]),p?V=[this.position[0]-Math.cos(this.startleHeading)*.3,this.position[1],this.position[2]+Math.sin(this.startleHeading)*.3]:ie?V=[-this.position[0]*.45,Z(this.position[1],o.low,o.high),-this.position[2]*.45]:oe?V=[this.position[0]+ae.away[0]*.3+A*.1,this.position[1]+Math.max(ae.away[1],0)*.15,this.position[2]+ae.away[2]*.3+j*.1]:ue?V=[this.position[0]+se.away[0]*.2,Z(this.position[1]+se.away[1]*.2,o.low,o.high),this.position[2]+se.away[2]*.2]:le&&(V=[this.position[0]+ce.away[0]*.2+A*.15,Z(this.position[1]+Math.max(ce.away[1],.5)*.12,o.low,o.high),this.position[2]+ce.away[2]*.2+j*.15]),z&&(V=i?[i.centroid[0],i.centroid[1]-.06,i.centroid[2]]:[this.position[0]*.6,o.low+.025,this.position[2]*.6]);let de=V.map((e,t)=>e-this.position[t]);E=Math.hypot(...de);let H=Yi(Math.atan2(de[2],-de[0])-this.heading)*Q(.03,.12,Math.hypot(de[0],de[2]));if(P&&(H=Yi(P.yaw-this.heading)*Q(.004,.02,P.plan)),B&&B.near&&!this.restSettled&&V===B.at){let e=Math.hypot(de[0],de[2]),t=Q(.012,.035,e);H=t*Yi(Math.atan2(de[2],-de[0])-this.heading)+(1-t)*Yi(B.heading-this.heading)}let fe=this.mode===`mirror`&&this.mirrorArrived&&!z;if(fe&&(H=Yi(this.mirrorFace+(this.mirrorSide*.5+.2*Math.sin(2*Math.PI*.55*this.holdClock))*Q(.8,1.7,this.holdClock)-this.heading)),this.mode===`mirror`&&!this.flaring){let t=Math.hypot(...this.mirrorPoint.map((e,t)=>e-this.position[t]))<.08;this.mirrorLook=t&&Math.abs(Yi(this.mirrorFace-this.heading))<.35&&Math.abs(this.steerRate)<.3?this.mirrorLook+e:0}if(this.flareFrom>=0){let e=this.mode===`hover`&&!z&&!ue;!e&&(this.flaringAfter||this.time>this.flareBy||p||m||h||fa.has(this.mode))||this.flaringAfter&&this.time>=this.flareUntil?(this.flaringAfter=!1,this.flareFrom=-1):!this.flaringAfter&&e&&this.time>=this.flareFrom&&this.time<=this.flareBy&&Math.abs(this.steerRate)<.3&&Math.abs(this.speed)<.03&&(this.flaringAfter=!0,this.flareUntil+=this.time,this.timer=Math.max(this.timer,this.flareUntil-this.time+.8))}let U=this.mode===`hover`&&!z&&!ue;this.advanceTrim(e,U),this.hoverClock=U?this.hoverClock+e:0,U&&this.time>=this.lungeAt&&(this.lungeAt=1/0,!ie&&this.clearWay(this.targetAhead(o,.2),.06)&&(this.hoverLeft=this.timer,this.mode=`burst`,this.timer=.4,this.lunge=!0,this.target=this.targetAhead(o,.2),this.dartReady=!0,this.dartSpeed=.75*xa)),this.mode!==`cruise`&&this.mode!==`burst`&&(this.dartReady=!1),this.mode!==`burst`&&this.mode!==`glide`&&(this.lunge=!1);let pe=Q(0,.15,this.trimKick);U&&ie&&(this.hoverYaw=Math.atan2(-this.position[2],this.position[0]));let me=(U||(this.mode===`gulp`||N||I||this.mode===`rest`&&!te)&&!ie)&&!z,he=me||fe;p||me||Math.abs(H)<.3?this.sharpTurn=!1:Math.abs(H)>1.9&&(this.sharpTurn=!0),this.yawStroke=U?this.yawStroke*Math.exp(-1.6*e):this.steerRate;let ge=Math.max(Q(.6,.95,Math.abs(this.steerRate)/Math.max(Math.abs(this.turnStroke),1e-6)),Q(.32999999999999996,.5800000000000001,this.cueClock));this.turnStroke*=Math.exp(-2.4*ge*e);let _e=0,ve=5;if(p)_e=Z(H*30,-35,35),ve=3e3;else if(U){let e=Yi(this.hoverYaw-this.heading),t=ya*Math.min(1,this.hoverPivot/.2);if(this.cueClock>.35&&Math.abs(e)>.25&&Math.abs(this.yawStroke)<.3&&t>.3&&!this.flaringAfter){this.yawStroke=Z(e*1.6,-t,t);let n=Math.abs(this.yawStroke)/ya;this.cue(.4+.6*n,n>.5?Ca*n:0,this.yawStroke,1,Sa)}let n=.045*this.wanderRate(5,1.2)*Q(.5,2.5,this.hoverClock);_e=this.yawStroke*Q(0,Sa,this.leadClock)+n,ve=5}else if(I)_e=Z(H*2,-1,1);else if(this.mode===`rest`&&this.restSettled)_e=Z(3*Yi((B?B.heading:this.restHeading)+this.restYaw-this.heading),-.3,.3);else if(!me){let e=Math.max(1.2*(1-Q(.03,.08,Math.abs(this.speed))),Math.abs(this.speed)/(this.turnRadius*(ie||oe?.6:1))),t=Na*Math.tanh(e/Na);Math.abs(H)<1&&!(Math.abs(this.speed)<.04&&this.cueClock<1.5)?this.turnSide=0:!this.turnSide&&Math.abs(H)>1.6&&(this.turnSide=Math.sign(H));let n=this.turnSide&&Math.sign(H)!==this.turnSide?H+2*Math.PI*this.turnSide:H;Math.abs(n)>4.4&&(this.turnSide=Math.sign(H),n=H),_e=Z(n*2.2,-t,t);let r=Math.abs(this.speed)<.04&&!z&&!fe&&this.mode!==`rest`;if(r&&Math.abs(_e)>.5&&Math.abs(this.turnStroke)<.3&&this.cueClock>.35){let e=Math.min(2.2,Math.max(t,ya)*(1+Q(1.2,2.6,Math.abs(n))));this.turnStroke=Z(n*2.4,-e,e);let r=Math.min(1,Math.abs(this.turnStroke)/ya),i=Math.abs(this.steerRate)<.15&&!ue;this.cue(.4+.6*r,i&&r>.5?Ca*r:0,this.turnStroke,1,Sa)}r&&(Math.abs(_e)>.5||Math.abs(this.turnStroke)>.05)?(_e=this.turnStroke*Q(0,Sa,this.leadClock),ve=5*(1+.4*Q(1.5,2.2,Math.abs(this.turnStroke)))):this.mode===`rest`&&Math.abs(this.speed)<.04&&!z&&(_e*=Q(0,Sa,this.leadClock))}(me||p)&&(this.turnSide=0);for(let t=0;t<3;t++)this.waterSpin[t]=Ji(this.waterSpin[t],i?.angular[t]??0,e,5);this.steerRate+=Z(_e-this.steerRate,-ve*e,ve*e),this.angularVelocity=this.steerRate+this.waterSpin[1]*.8;let ye=this.heading;this.heading+=this.angularVelocity*e;let be=Math.abs(_e)>Math.abs(this.steerRate)?_e:this.steerRate,W=Math.tanh(be/1.6);this.curl=p?W:this.curl+(W-this.curl)*(1-Math.exp(-e/(Math.abs(W)>Math.abs(this.curl)?.12:.35))),Math.abs(this.curl)<.1?(this.curlMost=0,this.curlFrom=this.heading):this.curlMost=Math.max(this.curlMost,Math.abs(this.curl)),!p&&!h&&this.curlMost>.45&&Math.abs(this.curl)<.5*this.curlMost&&Math.abs(Yi(this.heading-this.curlFrom))>.7&&this.cueClock>.25&&(this.cue(.3,.7*this.curlMost,-Math.sign(this.curl),1,0,!0),this.curlMost=0),p||h||v?this.yawAccum=0:(this.yawAccum=this.yawAccum*Math.exp(-e/6)+this.steerRate*e,Math.abs(this.yawAccum)>Aa&&(this.spinBreaks++,this.yawAccum=0,this.sharpTurn=!1,this.target=this.targetAhead(o,.4)));let G=he?0:Z(Math.atan2(de[1],Math.hypot(de[0],de[2])),z||m?-.6:-.32,m?1.2:.32);if(!z&&!m){let e=Q(.03,.09,Math.max(Math.abs(this.speed),this.intent));G*=G>0?e:.5+.5*e}let xe=i?i.sand+pa-.004:o.low,Se=Q(.005,.04,this.position[1]-xe);U&&(G=(-.1+.03*this.wander(1,.5)+.025*this.wander(6,1.3)*Q(.5,2.5,this.hoverClock)+this.trimPitch)*Se);let Ce=0;if(te&&!B)G=-this.descentPitch(ee)*(1-.65*this.slump);else if(B){let e=Math.atan2(de[1],Math.hypot(de[0],de[2]));G=this.restSettled?B.pitch+this.restNod():Z(e,-.4,.32),this.restSettled||(Ce=Z(Math.sin(this.pitch)-Math.sin(e),0,.6))}else this.mode===`rest`&&(G=-.03+(this.restSettled?this.restNod():0));let we=(e,t)=>Z(ca(this.position[1],this.surfaceY-ta),e,t);this.mode===`rise`?G=w>.08?this.tripPitch:we(this.tripPitch-.12,this.tripPitch+.08):this.mode===`gulp`?G=we(this.tripPitch-.12,this.tripPitch+.08):this.mode===`dive`&&(G=-.1),(I||F)&&(G=Z(P.elevation,.8,1.35)),p&&this.startleDive&&(G=-.45);let Te=this.pitch,Ee=this.roll,De=-this.waterSpin[2]*Math.cos(this.heading)-this.waterSpin[0]*Math.sin(this.heading),K=p?8:this.mode===`rise`||I||F?3.5:this.mode===`dive`?2.6:U?2.2:2.4,Oe=h||R?1.5:.75;if(!p&&!L&&(this.mode===`rise`||this.mode===`dive`||I||F)){let t=this.mode===`dive`,n=G-this.pitch,r=t?1.8:1.6,i=t?4.5:3.2,a=Math.sign(n)*Math.min(Math.abs(n)*K,Math.sqrt(1.6*i*Math.abs(n)),r);this.pitchTurn+=Z(a-this.pitchTurn,-i*e,i*e),this.pitch=Z(this.pitch+this.pitchTurn*e+De*e*.8,-.75,Oe)}else if(p||h||R||m||this.dartClock<.3||this.mode===`rest`)this.pitch=Z(Ji(this.pitch,G,e,K)+De*e*.8,-.75,Oe),this.pitchTurn=(this.pitch-Te)/e;else{let t=G-this.pitch,n=Math.abs(this.speed)<.06&&this.mode!==`rest`;n&&Math.abs(t)>.14&&Math.abs(this.pitchTurn)<.1&&this.cueClock>.35&&!z&&this.cue(.4+.5*Math.min(1,Math.abs(t)/.5),0,1,1,Sa);let r=Math.sign(t)*Math.min(Math.abs(t)*K,Math.sqrt(1.4*Ta*Math.abs(t)),wa)*(n?Q(0,Sa,this.leadClock):1);this.pitchTurn+=Z(r-this.pitchTurn,-1.6*e,Ta*e),this.pitch=Z(this.pitch+this.pitchTurn*e+De*e*.8,-.75,Oe)}let ke=this.waterSpin[0]*Math.cos(this.heading)-this.waterSpin[2]*Math.sin(this.heading),Ae=x>0&&this.mode===`rest`&&this.restSettled?.32*x*this.restSide*Q(0,3,this.holdClock):0,je=Z((.35*Math.abs(this.speed)+.03)*this.steerRate,-.16,.16)+.22*this.curl,Me=U?.025*this.wander(3,.7)+.02*this.wander(7,1.5)*Q(.5,2.5,this.hoverClock)+this.trimRoll:this.mode===`rest`&&this.restSettled?.012*this.wander(3,.5):0;this.roll=Z(Ji(this.roll,Ae+je+Me,e,2.6)+ke*e*.8,-.65,.65),this.pitchRate=(this.pitch-Te)/e,this.rollRate=(this.roll-Ee)/e;let Ne=Math.min(.13,Z(.9*(ee-.002),.003,.08)/Math.max(.1,Math.sin(-G))),Pe=te&&!B?Ne*(1-ha*this.slump):B?B.near?Z(1.2*E,.02,.05):.09:this.mode===`burst`?.2*(1-.4*x):this.mode===`glide`?.04:m?.21*(1-.5*x):this.cruiseSpeed;this.mode===`cruise`&&(Pe*=.8+.3*this.wander(4,1.6));let Fe=.008*(.35+this.wander(2,.8))+this.trimNudge*pe,Ie=this.cueClock<Ea;if(he)Pe=U?ie?Math.min(0,Fe):Ie?Fe:0:0;else{let e=1-.7*Q(.9,2.2,Math.abs(H))*(1-Q(.03,.08,Math.abs(this.speed)));Pe*=(ie?.4+.6*Math.max(0,Math.cos(H)):.8+.2*Math.max(0,Math.cos(H)))*e*(this.hardStop&&!ie?1:Z(E/.14,.25,1)),this.mode===`mirror`&&(Pe*=Z(E/.2,.1,1)*(.2+.8*Math.max(0,Math.cos(H))))}this.backing=U?Z(-Pe/.006,0,1):0,this.mode===`rise`?Pe=w>0?Z(w*3,.006,this.risePace)*(.55+.44999999999999996*Q(.2,.7,this.pitch/this.tripPitch)):0:this.mode===`gulp`?Pe=w>.002?Z(w*3,0,.03):0:this.mode===`dive`?Pe=-.03*Q(.3,.7,this.pitch)+.12*Q(.1,-.08,this.pitch):F&&(Pe=w>0?Z(P.reach*2.5,.02,.16)*Q(.3,.1,Math.abs(this.pitch-Z(P.elevation,.8,1.35))):0),L&&(Pe=this.foodAtFilm()?Z(Math.max(0,w)*14,0,Ma):Ma),p&&(Pe=1.3*Math.max(0,Math.cos(H))**2*Math.exp(-Math.max(0,this.startleClock-.1)/.2)*(1-.5*x)),z&&(Pe=Math.max(Pe,.16)),this.dartReady&&!he&&!z&&Math.abs(H)<.45&&(this.dartReady=!1,this.dartClock=0,this.cue(.5,1,this.kickSize<0?1:-1,1,Sa));let Le=this.dartClock<.3&&(this.mode===`cruise`||this.mode===`burst`)&&!z;Le&&(Pe=Math.max(Pe,this.dartSpeed*(1-.4*x))),ue&&!z&&(Pe=Math.min(Pe,.9*Da));let Re=Pe,ze=(this.mode===`cruise`||this.mode===`lap`||ue)&&!he&&!Le&&!z&&Re<.035;ze&&Re>.004&&this.speed<.8*Re&&this.cueClock>.45&&this.leadClock>this.leadTime&&this.cue(.3+.4*Z(Re/Da,0,1),0,1);let Be=te&&!ne,Ve=(this.mode===`glide`||Be)&&!z&&!Le;Ve&&Re>.004&&this.speed<.8*Re&&this.cueClock>.45&&this.leadClock>this.leadTime&&this.cue(.3,.45,this.kickSize<0?1:-1);let He=(ze&&Re>this.speed||Ve)&&this.cueClock>=.4;He?Pe=0:(ze||Ve)&&this.cueClock<.4&&(Pe*=1.4),this.intent=Math.abs(Re);let Ue=Math.abs(Pe)<Math.abs(this.speed),We=this.brakeClock<.35&&Ue,Ge=he&&U&&!ie&&Math.abs(this.speed)<.025||He,Ke=p||L?30:N||m&&this.snapClock>=0?12:Le&&!Ue?14:We?10:Ue?R?8:Ge?1.2:3.5:2.8,qe=Ji(this.speed,Pe,e,Ke);!p&&!L&&a!==null&&Math.abs(qe)>Math.abs(this.speed)&&(qe=Math.sign(qe)*Math.min(Math.abs(qe),Math.abs(this.speed)+1.1*Z(a,0,3)*e)),!p&&!L&&!Le&&Pe>Math.abs(this.speed)+.025&&this.drive<.12&&this.cueClock>.7&&this.cue(.6,1,this.kickSize<0?1:-1,2,.26),!p&&!L&&this.leadClock<this.leadTime&&Math.abs(qe)>Math.abs(this.speed)&&(qe=this.speed),this.dart=+!!Le,this.brake=+(this.brakeClock<.35),this.speed=qe;let Je=i?.submerged??+!!r;if(Je>0)for(let n=0;n<3;n++)this.drift[n]=Ji(this.drift[n],t[n],e,1/.9);let Ye=Math.hypot(...this.drift),Xe=Math.max(0,Ye-.063);if(Je>.99&&Xe>0)for(let t=0;t<3;t++)this.drift[t]*=1-Math.min(1,1.6*e*Xe/Ye);let q=Q(.35,.9,1-Je);if(i&&q>0)for(let t=0;t<3;t++)this.drift[t]+=(n.gravity?.[t]??(t===1?-24:0))*q*e;let Ze=Math.hypot(...this.drift);if(Ze>1.2)for(let e=0;e<3;e++)this.drift[e]*=1.2/Ze;let Qe=[-Math.cos(this.heading)*Math.cos(this.pitch),Math.sin(this.pitch),Math.sin(this.heading)*Math.cos(this.pitch)],J=[...this.position],$e=!p&&!m&&!R&&this.mode!==`gulp`&&!(this.mode===`rest`&&this.restSettled)?.06*(1-Q(.02,.08,Math.abs(this.speed))):0,et=$e*(this.mode===`dive`?1:Se),tt=[-Math.cos(ye)*Math.cos(Te),Math.sin(Te),Math.sin(ye)*Math.cos(Te)],nt=[-Math.cos(this.heading)*Math.cos(Te),Math.sin(Te),Math.sin(this.heading)*Math.cos(Te)];for(let t=0;t<3;t++)this.turnVelocity[t]=($e*(nt[t]-tt[t])+et*(Qe[t]-nt[t]))/e,this.position[t]+=(Qe[t]*this.speed+this.drift[t]+this.turnVelocity[t])*e;let rt=[...this.position];if(ne&&(this.position[1]-=this.slump*Z(.6*ee,.01,.03)*e),Ce>0&&(this.position[1]-=Ce*this.speed*e),this.mode===`rest`&&this.restSettled)for(let t=0;t<3;t++)this.drift[t]*=Math.exp(-4*e);else if(Je>.99&&Math.hypot(...t)<ga)for(let t=0;t<3;t++)this.drift[t]*=Math.exp(-(U||fe?6:he?3:4)*e);let it=this.mode===`gulp`?la(this.gulpClock,this.gulpLength):m?this.gape:0,at=this.mode===`gulp`||this.mode===`dive`?ua(this.gillClock):0;this.gulp=Ji(this.gulp,it,e,25),this.gulpGill=Ji(this.gulpGill,at,e,25),this.position[1]=Z(this.position[1],xe,i?n.radius-.25:o.high),this.position[1]<=xe&&this.drift[1]<0&&(this.drift[1]=0),L&&this.foodAtFilm()&&(this.position[1]=Math.min(this.position[1],C));let ot=Math.hypot(this.position[0],this.position[2]),st=i?n.radius-(m?.2:.29):o.radius;this.position[1]=Z(this.position[1],-st,st);let ct=Math.sqrt(Math.max(0,st**2-this.position[1]**2));if(ot>ct){this.position[0]*=ct/ot,this.position[2]*=ct/ot;let e=Math.hypot(...this.position),t=this.drift.reduce((t,n,r)=>t+n*this.position[r]/e,0);if(t>0)for(let n=0;n<3;n++)this.drift[n]-=t*this.position[n]/e}for(let e of this.obstacles){let t=Zi(this.position,e.a,e.b),n=this.position.map((e,n)=>e-t[n]),r=Math.hypot(...n),i=e.r*.6;if(r>=i||r<1e-9)continue;let a=n.map(e=>e/r),o=this.drift.reduce((e,t,n)=>e+t*a[n],0);for(let e=0;e<3;e++)this.position[e]=t[e]+a[e]*i,o<0&&(this.drift[e]-=o*a[e])}let lt=Math.hypot(...this.turnVelocity);if(lt>1e-9){let t=this.position.reduce((e,t,n)=>e+(t-rt[n])*this.turnVelocity[n],0)/(lt*e);if(t<0)for(let e=0;e<3;e++)this.turnVelocity[e]*=Math.max(0,1+t/lt)}this.velocity=this.position.map((t,n)=>(t-J[n])/e);let ut=p?Math.max(this.speed,Re):Math.abs(Re),dt=Z(.07+ut*1.4+Math.abs(this.steerRate)*.06,.045,.4);this.drive=this.mode===`glide`||Be?.065:fe?.08:this.mode===`rest`&&!te?.03:me?.045+.1*this.backing:this.mode===`dive`&&$e>0?.1:this.mode===`rise`||te?Math.min(dt,.22):dt;let ft=this.cueClock<.4?1-this.cueClock/Ea:0,pt=Z(Math.hypot(...t)/ga,0,1),mt=.2*Math.min(1,Math.abs(this.steerRate)/ya)+.25*Math.min(1,Math.abs(this.pitchTurn)/wa);this.hold=p||Le?0:this.mode===`rest`&&!te?.2+.4*this.settle+.3*ft:he||this.mode===`gulp`?Z(.35+.25*ft+.4*this.backing+.3*pt+mt,0,1):Z(Math.max(.2*(1-Q(.1,.3,Math.abs(this.speed))),(1-Q(.05,.12,Math.abs(this.speed)))*(.3+.3*ft+.3*Z(this.intent/.035,0,1)+.2*pt+mt)),0,1)}get settle(){return this.settleClock<.7?Math.sin(Math.PI*this.settleClock/.7):0}restNod(){return-.07*this.settle+.012*this.wander(6,.6)+this.restPitchNow}startDive(){this.mode=`dive`,this.timer=1.2*(.8+.4*this.gulpRandom()),this.diveClock=0}};let Fa=[[-1.4,0,0],[-1,0,0],[-.5,0,0],[0,0,0],[.5,0,0],[1,0,0],[-.3,.5,0],[.5,.5,0],[2,-.15,0],[-1.9,0,0],[-2.3,0,0],[-1.7,.6,0],[-1.7,-.5,0],[-.4,0,.6],[-.4,0,-.6],[0,1.2,0]],Ia=(e,t=/* @__PURE__ */ new Float32Array(8))=>{for(let n=0;n<8;n++)t[n]=e+(n-7/2)*.016;return t},La=(e,t,n)=>Math.max(t,Math.min(n,e)),Ra=(e,t)=>{let n=Math.hypot(...e);return n>t?e.map(e=>e*t/n):e};function za(e,t,n){let r={flow:[0,0,0],angular:[0,0,0],submerged:1,airAbove:0,surface:null,sand:n.sandLevel,centroid:[0,(n.sandLevel+n.level)/2,0]};if(!e)return r;r.centroid=[...e.centroid],r.surface=Ba(e,n);let i=[],a=[0,0,0],o=[0,0,0],s=0,c=-1/0;for(let l=0;l<16;l++){let u=l*4,d=e.probes[u+3];if(l<6&&(d>=n.iso&&s++,Number.isFinite(e.sand[l])&&(c=Math.max(c,e.sand[l]))),(l===6||l===7||l===15)&&(r.airAbove=Math.max(r.airAbove,La(1-d/n.iso,0,1)*(l===15?.6:1))),!(d<n.iso||![0,1,2].every(t=>Number.isFinite(e.probes[u+t])))){i.push(l);for(let n=0;n<3;n++)a[n]+=t[u+n],o[n]+=e.probes[u+n]}}if(r.submerged=s/6,Number.isFinite(c)&&(r.sand=c),!i.length)return r;for(let e=0;e<3;e++)a[e]/=i.length,o[e]/=i.length;r.flow=Ra(o,3);let l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0;for(let n of i){let r=n*4,i=t[r]-a[0],s=t[r+1]-a[1],c=t[r+2]-a[2],v=e.probes[r]-o[0],y=e.probes[r+1]-o[1],b=e.probes[r+2]-o[2];l+=s*s+c*c,u-=i*s,d-=i*c,f+=i*i+c*c,p-=s*c,m+=i*i+s*s,h+=s*b-c*y,g+=c*v-i*b,_+=i*y-s*v}let v=l*(f*m-p*p)-u*(u*m-d*p)+d*(u*p-d*f);return Math.abs(v)>1e-12&&(r.angular=Ra([((f*m-p*p)*h+(d*p-u*m)*g+(u*p-d*f)*_)/v,((d*p-u*m)*h+(l*m-d*d)*g+(u*d-l*p)*_)/v,((u*p-d*f)*h+(u*d-l*p)*g+(l*f-u*u)*_)/v],5)),r}function Ba(e,t){let n=Ia(t.level),r=NaN;for(let i=0;i<8;i++){let a=e.probes[(16+i)*4+3];if(!Number.isFinite(a)||i===0&&a<t.iso)return null;if(i>0&&r>=t.iso&&a<t.iso){let e=(r-t.iso)/Math.max(1e-6,r-a);return n[i-1]+(n[i]-n[i-1])*e}r=a}return null}let Va=.003;var Ha=class{constructor({textures:e=!0}={}){this.fish=qi({compact:!0,textures:e}),this.rig=new Ut,this.meshes=[],this.probes=/* @__PURE__ */ new Float32Array(64),this.mouth=new q,this.swim=new Pa,this.waterState=null,this.level=.18,this.time=0,this.flow=new q,this.carry=[0,0,0,0],this.point=new q,this.flowTarget=new q,this.flowNow=[0,0,0],this.flowLocal=[0,0,0],this.rippleAt=new q,this.bubbleAt=new q,this.ripple=0,this.bubbleDebt=0,this.bubbleCount=0,this.clamp=0,this.down=[0,-1,0],this.finSolids={data:/* @__PURE__ */ new Float64Array(224),count:0},this.surface=.18,this.rig.add(this.fish),this.rig.scale.setScalar(Qi),this.fish.userData.locomotion=this.locomotion(),this.fish.userData.update(0),this.rig.updateMatrixWorld(!0);let t=0;this.fish.traverse(e=>{if(!e.isMesh)return;let n=e;this.meshes.push({mesh:n,offset:t}),t+=n.geometry.attributes.position.count}),this.vertices=new Float32Array(t*3),this.finVertex=new Uint8Array(t),this.parts=this.meshes.map(({mesh:e,offset:t})=>{let n=e.geometry,r=n.attributes.position.array,i=e.material.userData.bettaDeform,a=i?.dynamics??null,o={mesh:e,offset:t,rest:r,deform:!!i,cover:i?.operculum?n.attributes.coverLift.array:null,fin:a,cells:null,place:null,nodes:null};if(a){let e=n.attributes.position.count,i=n.attributes.finUV.array,s=a.columns,c=a.rows,l=new Int32Array(e*4),u=new Float64Array(e*2),d=new Int32Array(e);for(let t=0;t<e;t++){let e=i[t*2]*(s-1),n=i[t*2+1]*(c-1),o=Math.floor(e),f=Math.floor(n),p=Math.min(o+1,s-1),m=Math.min(f+1,c-1);l.set([(f*s+o)*4,(f*s+p)*4,(m*s+o)*4,(m*s+p)*4],t*4),u[t*2]=e-o,u[t*2+1]=n-f;let h=Math.round(n)*s+Math.round(e);d[t]=[0,1,2].every(e=>a.rest[h*3+e]===r[t*3+e])?h:-1}Object.assign(o,{cells:l,place:u,nodes:d}),this.finVertex.fill(1,t,t+e)}return o}),this.updateVertices(),this.lipVertex=new Uint8Array(t);let n=this.fish.matrixWorld.clone().invert(),r=new q;for(let e=0;e<t;e++)r.fromArray(this.vertices,e*3).applyMatrix4(n).x<-1.45&&(this.lipVertex[e]=1);this.updateProbes()}step(e,t,n,r,i=null){e=Math.max(0,Math.min(e,.07)),this.time+=e,this.level=n.level;let a=n.gravity,o=a?Math.hypot(a[0],a[1],a[2]):0;if(o>1e-6)for(let e=0;e<3;e++)this.down[e]=a[e]/o;this.fish.userData.down=this.down,i&&this.swim.turnWith(i),this.waterState=za(t,this.probes,n),this.flow.lerp(this.flowTarget.fromArray(this.waterState.flow),1-Math.exp(-5*e)),this.swim.food=r.food?r.food.pos:null,this.swim.obstacles=r.obstacles,this.swim.gape=r.gapeWant;let s=r.water;this.swim.lethargy=s?s.lethargy:0,this.swim.gasp=s?s.gasp:0,this.swim.advance(e,this.flow.toArray(this.flowNow),n,this.waterState.submerged>.99,this.waterState,this.fish.userData.stroke??null),this.fish.userData.locomotion=this.locomotion();let c=1/Qi;this.flowLocal[0]=this.flow.x*c,this.flowLocal[1]=this.flow.y*c,this.flowLocal[2]=this.flow.z*c,this.fish.userData.externalFlow=this.flowLocal;let l=this.fish.userData.display;l.requested=r.flared||this.swim.flaring||this.swim.flaringAfter;let u=s?s.clamp:0;this.clamp+=(u-this.clamp)*(1-Math.exp(-.6*e)),u===0&&this.clamp<.001&&(this.clamp=0),l.clamp=this.clamp,this.swim.gasp>0&&(this.fish.userData.gait.breathPhase+=8*this.swim.gasp*e),this.fish.userData.solids=this.finSolids.count?this.finSolids:null;let d=Number.isFinite(this.waterState.surface);this.surface=d?this.waterState.surface:n.level,this.fish.userData.surfaceY=this.waterState.submerged>(d?.2:.5)?this.surface/Qi:void 0,this.fish.userData.update(this.time),this.updateVertices();let f=this.solidsNear(r.obstacles),p=this.finVertex,m=this.finSolids,h=f.filter(e=>e.fin>0),g=Math.min(h.length,m.data.length/7);h.length>g&&h.sort((e,t)=>e.off-t.off);for(let e=0;e<g;e++){let t=h[e],n=m.data,r=e*7;n[r]=t.ax/Qi,n[r+1]=t.ay/Qi,n[r+2]=t.az/Qi,n[r+3]=(t.ax+t.abx)/Qi,n[r+4]=(t.ay+t.aby)/Qi,n[r+5]=(t.az+t.abz)/Qi,n[r+6]=(t.fin+Va)/Qi}m.count=g;let _=this.fish.userData.surfaceY!==void 0,v=this.lipVertex,y=-this.down[0],b=-this.down[1],x=-this.down[2],S=this.surface-.002,C=this.swim.mode===`rest`&&this.swim.restSettled?0:.01;for(let e=0;e<4;e++){let e=0,t=0,r=0,i=0,a=1/0;for(let o=0;o<this.vertices.length;o+=3){if(p[o/3])continue;let s=this.vertices[o],c=this.vertices[o+1],l=this.vertices[o+2];a=Math.min(a,c);let u=Math.sqrt(s*s+c*c+l*l),d=u-n.radius+.012;if(d>e&&(e=d,t=-s/u*d,r=-c/u*d,i=-l/u*d),_&&!v[o/3]){let n=s*y+c*b+l*x-S;n>e&&(e=n,t=-y*n,r=-b*n,i=-x*n)}let m=C>0&&o/3%4==0;for(let n of f){let a=n.solid>0?n.solid+C:m&&n.fin>0?n.fin-.013:0;if(!(a>0))continue;let o=Math.max(0,Math.min(1,((s-n.ax)*n.abx+(c-n.ay)*n.aby+(l-n.az)*n.abz)*n.inv)),u=s-n.ax-n.abx*o,d=c-n.ay-n.aby*o,f=l-n.az-n.abz*o,p=Math.sqrt(u*u+d*d+f*f),h=a-p;h>e&&p>1e-9&&(e=h,t=u/p*h,r=d/p*h,i=f/p*h)}}if(r+=Math.max(0,this.waterState.sand+.012-a-r),Math.hypot(t,r,i)<1e-6)break;let o=[t,r,i];for(let e=0;e<3;e++)this.swim.position[e]+=o[e],this.fish.position.setComponent(e,this.fish.position.getComponent(e)+o[e]/Qi),o[e]*this.swim.drift[e]<0&&(this.swim.drift[e]=0);let s=this.vertices;for(let e=0;e<s.length;e+=3)s[e]+=t,s[e+1]+=r,s[e+2]+=i}this.layFins(n,f),this.updateProbes(),this.disturb(e)}layFins(e,t){let n=this.vertices,r=this.finVertex,i=this.waterState.sand+Va,a=e.radius-Va,o=this.fish.userData.surfaceY!=null,s=-this.down[0],c=-this.down[1],l=-this.down[2],u=this.surface-Va;for(let e=0;e<n.length;e+=3){if(!r[e/3])continue;if(o){let t=n[e]*s+n[e+1]*c+n[e+2]*l-u;t>0&&(n[e]-=t*s,n[e+1]-=t*c,n[e+2]-=t*l)}n[e+1]<i&&(n[e+1]=i);let d=n[e],f=n[e+1],p=n[e+2],m=Math.sqrt(d*d+f*f+p*p);m>a&&(d*=a/m,f*=a/m,p*=a/m);for(let e of t){if(!(e.fin>0))continue;let t=Math.max(0,Math.min(1,((d-e.ax)*e.abx+(f-e.ay)*e.aby+(p-e.az)*e.abz)*e.inv)),n=e.ax+e.abx*t,r=e.ay+e.aby*t,i=e.az+e.abz*t,a=d-n,o=f-r,s=p-i,c=Math.sqrt(a*a+o*o+s*s),l=e.fin+Va;c<l&&c>1e-9&&(d=n+a/c*l,f=r+o/c*l,p=i+s/c*l)}n[e]=d,n[e+1]=f,n[e+2]=p}}takeDisturbance(){let e={push:this.ripple,pushAt:this.rippleAt,bubbles:this.bubbleCount,bubblesAt:this.bubbleAt};return this.ripple=0,this.bubbleCount=0,e}solidsNear(e){if(!e.length)return[];let t=this.vertices,n=[1/0,1/0,1/0],r=[-1/0,-1/0,-1/0];for(let e=0;e<t.length;e+=3)for(let i=0;i<3;i++)t[e+i]<n[i]&&(n[i]=t[e+i]),t[e+i]>r[i]&&(r[i]=t[e+i]);let i=[],a=[0,1,2].map(e=>(n[e]+r[e])/2);for(let t of e){let e=t.fin??t.solid;if(!(t.solid>0)&&!(e>0))continue;let o=Math.max(t.solid+.05,e+.1),s=!1;for(let e=0;e<3;e++)(Math.min(t.a[e],t.b[e])-o>r[e]||Math.max(t.a[e],t.b[e])+o<n[e])&&(s=!0);if(s)continue;let c=t.b[0]-t.a[0],l=t.b[1]-t.a[1],u=t.b[2]-t.a[2],d=c*c+l*l+u*u,f=d>1e-12?1/d:0,p=Math.max(0,Math.min(1,((a[0]-t.a[0])*c+(a[1]-t.a[1])*l+(a[2]-t.a[2])*u)*f)),m=Math.hypot(a[0]-t.a[0]-c*p,a[1]-t.a[1]-l*p,a[2]-t.a[2]-u*p)-e;i.push({ax:t.a[0],ay:t.a[1],az:t.a[2],abx:c,aby:l,abz:u,inv:f,solid:t.solid,fin:e,off:m})}return i}disturb(e){let t=this.swim,n=this.waterState?.surface??this.level,r=this.mouth;t.mode===`gulp`&&t.gulpClock>=0&&t.gulpClock<.2&&Math.abs(r.y-n)<.03&&(this.rippleAt.set(r.x,n,r.z),this.ripple+=10*e*Math.sin(Math.PI*Math.min(1,t.gulpClock/.2)));let i=t.mode===`dive`&&t.diveClock<.9?14:t.mode===`startle`&&t.startleDive&&t.startleClock<.4?36:0;if(i>0&&n-r.y<.09){this.bubbleDebt+=i*e;let t=Math.floor(this.bubbleDebt);t>0&&(this.bubbleDebt-=t,this.bubbleCount+=t,this.bubbleAt.set(r.x,r.y-.004,r.z))}else this.bubbleDebt=0}updateProbes(){this.rig.updateMatrixWorld(!0);let e=this.carry,t=this.point;for(let n=0;n<16;n++){let r=Fa[n];this.fish.userData.bodyMotion.transform(r[0],r[1],r[2],e),t.set(e[0],e[1],e[2]).applyMatrix4(this.fish.matrixWorld),this.probes[n*4]=t.x,this.probes[n*4+1]=t.y,this.probes[n*4+2]=t.z,this.probes[n*4+3]=0}this.fish.userData.bodyMotion.transform(-1.68,.0832,0,e),this.mouth.set(e[0],e[1],e[2]).applyMatrix4(this.fish.matrixWorld)}locomotion(){let e=this.swim,t=e.heading,n=e.pitch,r=1.22*Qi,i=[r*Math.cos(t)*Math.cos(n),-.1281*Math.sin(n),-.1281*Math.sin(t)*Math.cos(n)],a=[-.1281*(Math.sin(t)*Math.cos(n)*e.angularVelocity+Math.cos(t)*Math.sin(n)*e.pitchRate),-.1281*Math.cos(n)*e.pitchRate,r*(-Math.cos(t)*Math.cos(n)*e.angularVelocity+Math.sin(t)*Math.sin(n)*e.pitchRate)];return{...e,speed:e.speed/Qi,position:e.position.map((e,t)=>(e+i[t])/Qi),velocity:e.velocity.map((e,t)=>(e+a[t])/Qi)}}updateVertices(){this.rig.updateMatrixWorld(!0);let e=this.fish.userData.bodyMotion,t=this.vertices,n=this.carry,r=this.fish.userData.display.flare,i=e.gill*Ti+r*Ei,a=(e.gill+r)*Di;for(let{mesh:r,offset:o,rest:s,deform:c,cover:l,fin:u,cells:d,place:f,nodes:p}of this.parts){let m=r.matrixWorld.elements,h=s.length/3,g=u&&u.carriedBy===e&&u.carriedAt===e.revision?u.carried:null,_=u?u.displacement:null;for(let r=0;r<h;r++){let u=s[r*3],h=s[r*3+1],v=s[r*3+2];if(c){l&&(v+=l[r]*i,u-=Math.abs(l[r])*a);let t=g?p[r]:-1;if(t>=0?(u=g[t*3],h=g[t*3+1],v=g[t*3+2]):(e.transform(u,h,v,n),u=n[0],h=n[1],v=n[2]),_){let e=d[r*4],t=d[r*4+1],n=d[r*4+2],i=d[r*4+3],a=f[r*2],o=f[r*2+1];u=u+(_[e]*(1-a)+_[t]*a)*(1-o)+(_[n]*(1-a)+_[i]*a)*o,h=h+(_[e+1]*(1-a)+_[t+1]*a)*(1-o)+(_[n+1]*(1-a)+_[i+1]*a)*o,v=v+(_[e+2]*(1-a)+_[t+2]*a)*(1-o)+(_[n+2]*(1-a)+_[i+2]*a)*o}}let y=1/(m[3]*u+m[7]*h+m[11]*v+m[15]),b=(o+r)*3;t[b]=(m[0]*u+m[4]*h+m[8]*v+m[12])*y,t[b+1]=(m[1]*u+m[5]*h+m[9]*v+m[13])*y,t[b+2]=(m[2]*u+m[6]*h+m[10]*v+m[14])*y}}}};let $={dt:0,quality:1,radius:4,level:5,sandLevel:6,iso:7,gravity:8,food:11,foodAt:12,gape:15,flared:16,gulpUrge:17,water:18,sensed:21,centroid:22,obstacles:25,turn:26,probes:29,sand:125,capsules:131},Ua={heading:0,pitch:1,level:2,mouth:3,ripple:6,rippleAt:7,bubbles:10,bubbleAt:11},Wa=e=>128+(64+e)*4;function Ga(){return{sense:{probes:/* @__PURE__ */ new Float32Array(96),sand:/* @__PURE__ */ new Float32Array(6),centroid:[0,0,0]},env:{radius:0,level:0,sandLevel:0,iso:0,gravity:[0,0,0]},host:{obstacles:[],food:null,gapeWant:0,flared:!1,water:{lethargy:0,gasp:0,clamp:0}},food:{pos:[0,0,0]},turn:[0,0,0]}}function Ka(e,t,n){let{sense:r,env:i,host:a,food:o,turn:s}=n;g.step=e[$.quality],g.passScale=e[$.quality+1],g.maxFrame=e[$.quality+2],i.radius=e[$.radius],i.level=e[$.level],i.sandLevel=e[$.sandLevel],i.iso=e[$.iso];for(let t=0;t<3;t++)i.gravity[t]=e[$.gravity+t];for(let t=0;t<3;t++)o.pos[t]=e[$.foodAt+t];a.food=e[$.food]?o:null,a.gapeWant=e[$.gape],a.flared=e[$.flared]===1,t.swim.gulpUrge=e[$.gulpUrge],a.water.lethargy=e[$.water],a.water.gasp=e[$.water+1],a.water.clamp=e[$.water+2];for(let t=0;t<3;t++)r.centroid[t]=e[$.centroid+t];r.probes.set(e.subarray($.probes,$.probes+96)),r.sand.set(e.subarray($.sand,$.sand+6));let c=e[$.obstacles],l=a.obstacles;for(;l.length<c;)l.push({a:[0,0,0],b:[0,0,0],r:0,solid:0,fin:0});l.length=c,l.forEach((t,n)=>{let r=$.capsules+n*9;for(let n=0;n<3;n++)t.a[n]=e[r+n],t.b[n]=e[r+3+n];t.r=e[r+6],t.solid=e[r+7],t.fin=e[r+8]});for(let t=0;t<3;t++)s[t]=e[$.turn+t];let u=s[0]!==0||s[1]!==0||s[2]!==0;return{dt:e[$.dt],sense:e[$.sensed]?r:null,env:i,host:a,turn:u?s:null}}function qa(e,t){e??=new ArrayBuffer(Wa(t.vertices.length));let n=new Float64Array(e,0,16),r=new Float32Array(e,128),i=t.takeDisturbance();return n[Ua.heading]=t.swim.heading,n[Ua.pitch]=t.swim.pitch,n[Ua.level]=t.level,t.mouth.toArray(n,Ua.mouth),n[Ua.ripple]=i.push,i.pushAt.toArray(n,Ua.rippleAt),n[Ua.bubbles]=i.bubbles,i.bubblesAt.toArray(n,Ua.bubbleAt),r.set(t.probes),r.set(t.vertices,64),e}let Ja=null,Ya=Ga(),Xa=[];self.onmessage=({data:e})=>{if(e.start){if(Object.assign(g,e.start.quality),Ja=new Ha({textures:!1}),Ja.vertices.length!==e.start.vertices)throw Error(`the worker's betta has ${Ja.vertices.length/3} vertices, the page's ${e.start.vertices/3}`);self.postMessage({ready:!0});return}Xa.push(...e.spare);let{dt:t,sense:n,env:r,host:i,turn:a}=Ka(e.step,Ja,Ya);Ja.step(t,n,r,i,a);let o=qa(Xa.pop()??null,Ja);self.postMessage({pose:o,step:e.step,mode:Ja.swim.mode},[o,e.step.buffer])}})();