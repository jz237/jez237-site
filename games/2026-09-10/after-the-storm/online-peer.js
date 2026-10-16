import {encodeOnlinePacket,decodeOnlinePacket,onlinePacketChunks,createOnlineReassembler} from './online-race-codec.js';
import {ONLINE_VERSION,ONLINE_BUILD,ONLINE_STUN,onlineToken,onlineEnvelope,validOnlineEnvelope,encodeOnlineSignal,decodeOnlineSignal} from './online-race-protocol.js';

const labels={control:'ats-control-v1',frames:'ats-frames-v1',input:'ats-input-v1'},BUFFER_LIMIT=512*1024;
// The host alone sends authoritative state. The guest can send its own input,
// rider choice and pause requests. Signalling never uses a paid game service.
export function createOnlinePeer({role,PeerConnection=globalThis.RTCPeerConnection,onConnection=()=>{},onControl=()=>{},onFrame=()=>{},onInput=()=>{},onStatus=()=>{},onError=()=>{},now=()=>performance.now(),iceServers=[{urls:ONLINE_STUN}]}={}){
 if(!['host','guest'].includes(role))throw new TypeError('Invalid online role');
 if(typeof PeerConnection!=='function'||!globalThis.CompressionStream||!globalThis.DecompressionStream)throw new Error('This browser does not support online play. Try a current Chrome, Edge, Firefox or Safari.');
 const pc=new PeerConnection({iceServers}),channels={},assemblers={control:createOnlineReassembler({now}),frames:createOnlineReassembler({now})},sequences={control:0,frames:0};
 let session=role==='host'?onlineToken():null,created=Date.now(),closed=false,connected=false,busyFrame=false,controlJobs=0,frameJobs=0,lastFramePacket=0,bytesSent=0,bytesReceived=0,droppedFrames=0,rtt=null,offerAccepted=false;
 function fail(error){if(!closed)onError(error instanceof Error?error:new Error(String(error)));}
 function status(){onStatus({state:pc.connectionState??'new',connected,rtt,bytesSent,bytesReceived,droppedFrames});}
 function checkConnection(){
  const next=!closed&&pc.connectionState==='connected'&&Object.values(labels).every(label=>channels[label]?.readyState==='open');
  if(next!==connected){connected=next;onConnection(next);}status();
 }
 const channel=kind=>channels[labels[kind]];
 function sendText(kind,type,data={}){
  const dc=channel(kind);if(!session||closed||dc?.readyState!=='open'||dc.bufferedAmount>65536)return false;
  const text=JSON.stringify(onlineEnvelope(session,type,data));if(text.length>8192)throw new RangeError('Online command is too large');
  try{dc.send(text);bytesSent+=new TextEncoder().encode(text).length;return true;}catch(error){fail(error);return false;}
 }
 async function sendPacket(kind,type,data){
  const dc=channel(kind);if(!connected||dc?.readyState!=='open'||dc.bufferedAmount>BUFFER_LIMIT)return false;
  const packet=await encodeOnlinePacket(onlineEnvelope(session,type,data));
  if(closed||dc.readyState!=='open'||dc.bufferedAmount+packet.length>BUFFER_LIMIT)return false;
  const sequence=++sequences[kind];
  for(const chunk of onlinePacketChunks(packet,sequence)){dc.send(chunk);bytesSent+=chunk.length;}return true;
 }
 function deliverControl(m){
  if(!validOnlineEnvelope(m,session))throw new TypeError('Incompatible online message');
  if(m.type==='ping'){if(Number.isFinite(m.sent))sendText('control','pong',{sent:m.sent});return;}
  if(m.type==='pong'){if(Number.isFinite(m.sent)&&m.sent<=now()&&now()-m.sent<30000){rtt=Math.round(now()-m.sent);status();}return;}
  const permitted=role==='host'?['ready','setup','pause','camera','heartbeat','leave']:['init','standby','preferences','leave'];
  if(!permitted.includes(m.type))throw new TypeError('Online peer cannot send that command');
  Promise.resolve(onControl(m)).catch(fail);
 }
 function receiveText(kind,text){
  if(text.length>8192)throw new RangeError('Online command is too large');const m=JSON.parse(text);
  if(!validOnlineEnvelope(m,session))throw new TypeError('Incompatible online message');
  if(kind==='input'){
   if(role!=='host'||m.type!=='input')throw new TypeError('Only Player 2 may send input');onInput(m);return;
  }
  if(kind!=='control')throw new TypeError('Snapshot channel requires binary data');deliverControl(m);
 }
 function attach(dc){
  if(!Object.values(labels).includes(dc.label)||channels[dc.label]){dc.close();return;}
  channels[dc.label]=dc;dc.binaryType='arraybuffer';const kind=Object.keys(labels).find(k=>labels[k]===dc.label);
  dc.onopen=checkConnection;dc.onclose=checkConnection;dc.onerror=()=>{checkConnection();};
  dc.onmessage=e=>{
   try{
    if(typeof e.data==='string'){bytesReceived+=e.data.length;receiveText(kind,e.data);return;}
    if(kind==='input')throw new TypeError('Input channel requires bounded commands');
    bytesReceived+=e.data.byteLength??0;const complete=assemblers[kind].push(e.data);if(!complete)return;
    if(kind==='frames'&&role!=='guest'||kind==='control'&&role!=='guest')throw new TypeError('Only the host supplies race snapshots');
    if(kind==='frames'&&frameJobs>=2){droppedFrames++;return;}
    if(kind==='control'&&controlJobs>=2)throw new RangeError('Too many online initializers');
    if(kind==='frames')frameJobs++;else controlJobs++;
    decodeOnlinePacket(complete.packet).then(m=>{
     if(closed)return;if(!validOnlineEnvelope(m,session))throw new TypeError('Incompatible online snapshot');
     if(kind==='frames'){
      if(m.type!=='frame')throw new TypeError('Invalid snapshot type');if(complete.sequence<=lastFramePacket)return;
      lastFramePacket=complete.sequence;return onFrame(m);
     }
     if(m.type!=='init')throw new TypeError('Invalid race initialization');return onControl(m);
    }).catch(fail).finally(()=>{if(kind==='frames')frameJobs--;else controlJobs--;});
   }catch(error){fail(error);}
  };
 }
 pc.ondatachannel=e=>attach(e.channel);pc.onconnectionstatechange=checkConnection;
 if(role==='host'){attach(pc.createDataChannel(labels.control,{ordered:true}));attach(pc.createDataChannel(labels.frames,{ordered:false,maxRetransmits:0}));attach(pc.createDataChannel(labels.input,{ordered:false,maxRetransmits:0}));}
 async function gather(){
  if(pc.iceGatheringState==='complete')return;
  await new Promise((resolve,reject)=>{
   let timer;const done=()=>{clearTimeout(timer);pc.removeEventListener('icegatheringstatechange',changed);closed?reject(new Error('Connection was closed')):resolve();};
   const changed=()=>{if(pc.iceGatheringState==='complete')done();};pc.addEventListener('icegatheringstatechange',changed);timer=setTimeout(done,12000);
  });
 }
 const timer=setInterval(()=>{if(connected)sendText('control','ping',{sent:now()});},1000);
 return {
  async invite(){if(role!=='host'||closed||pc.signalingState!=='stable')throw new Error('Create a fresh host connection.');await pc.setLocalDescription(await pc.createOffer());await gather();return encodeOnlineSignal({v:ONLINE_VERSION,build:ONLINE_BUILD,session,created,type:'offer',sdp:pc.localDescription.sdp});},
  async answer(text){
   if(role!=='guest'||closed||offerAccepted)throw new Error('Create a fresh guest connection.');const offer=await decodeOnlineSignal(text);if(offer.type!=='offer')throw new Error('The guest needs the host invite.');
   session=offer.session;created=offer.created;offerAccepted=true;await pc.setRemoteDescription({type:'offer',sdp:offer.sdp});await pc.setLocalDescription(await pc.createAnswer());await gather();
   return encodeOnlineSignal({v:ONLINE_VERSION,build:ONLINE_BUILD,session,created,type:'answer',sdp:pc.localDescription.sdp});
  },
  async acceptAnswer(text){if(role!=='host'||closed||pc.signalingState!=='have-local-offer')throw new Error('Create an invite before pasting the return code.');const answer=await decodeOnlineSignal(text);if(answer.type!=='answer'||answer.session!==session||answer.created!==created)throw new Error('That return code belongs to a different invite.');await pc.setRemoteDescription({type:'answer',sdp:answer.sdp});},
  sendControl: (type,data)=>sendText('control',type,data),
  sendInput(data){return role==='guest'&&sendText('input','input',data);},
  async sendInit(generation,descriptor){if(role!=='host')return false;return sendPacket('control','init',{generation,descriptor});},
  async sendFrame(generation,frame){if(role!=='host'||busyFrame){droppedFrames++;return false;}busyFrame=true;try{return await sendPacket('frames','frame',{generation,frame});}finally{busyFrame=false;}},
  close(){if(closed)return;sendText('control','leave');closed=true;clearInterval(timer);for(const dc of Object.values(channels)){dc.onclose=null;dc.close();}pc.close();checkConnection();},
  get connected(){return connected;},get session(){return session;},get writable(){return connected&&!busyFrame&&(channel('frames')?.bufferedAmount??Infinity)<BUFFER_LIMIT/2;},
  snapshot:()=>({role,connected,state:pc.connectionState,channels:Object.fromEntries(Object.entries(channels).map(([label,c])=>[label,{state:c.readyState,buffered:c.bufferedAmount}])),rtt,bytesSent,bytesReceived,droppedFrames})
 };
}
