/** Handshake policy for the authoritative online implementation. */
export type DerbyCapabilities={eventRules?:1;noRespawnDerby?:1};
export type DerbyPeer=DerbyCapabilities&{connected:boolean};
export function canJoinDerby(format:string,peer:DerbyCapabilities):boolean{
 return format!=='score-no-respawn'||peer.eventRules===1&&peer.noRespawnDerby===1;
}
export function canStartDerby(format:string,serverSupports:boolean,peers:readonly DerbyPeer[]):boolean{
 if(format!=='score-no-respawn')return true;
 return serverSupports&&peers.filter(p=>p.connected).every(p=>canJoinDerby(format,p));
}
export function derbyCompatibilityMessage(format:string,serverSupports:boolean,peers:readonly DerbyPeer[]):string|null{
 if(format!=='score-no-respawn')return null;
 if(!serverSupports)return 'This server needs an update for score derby without respawns.';
 return canStartDerby(format,serverSupports,peers)?null:'All connected drivers must update before starting score derby without respawns.';
}
