import test from 'node:test';import assert from 'node:assert/strict';
import {onlineSessionKey,rememberedOnlineEndpoint,ONLINE_ENDPOINT_KEY} from '../src/online-session';
test('same room on different servers cannot overwrite or disclose reconnect tokens',()=>{
 const a=onlineSessionKey('ws://127.0.0.1:8826','ABCDEF'),b=onlineSessionKey('wss://example.com','ABCDEF');assert.notEqual(a,b);
 const data=new Map([[a,'local-token'],[b,'public-token'],['quarry-room-ABCDEF','ambiguous-legacy-token']]);assert.equal(data.get(a),'local-token');assert.equal(data.get(b),'public-token');
 assert.equal(onlineSessionKey('wss://EXAMPLE.com:443/','abcdef'),b);
 assert.notEqual(onlineSessionKey('wss://example.com/other','ABCDEF'),b);assert.notEqual(onlineSessionKey('wss://example.com?tenant=2','ABCDEF'),b);
});
test('reload remembers the explicit server and rejects invalid stored endpoints',()=>{
 const fallback='wss://example.com';
 assert.equal(rememberedOnlineEndpoint({getItem:key=>key===ONLINE_ENDPOINT_KEY?'ws://127.0.0.1:8826':null},fallback),'ws://127.0.0.1:8826');
 for(const value of [null,'garbage','https://example.com','ws://example.com'])assert.equal(rememberedOnlineEndpoint({getItem:()=>value},fallback),fallback);
 assert.equal(rememberedOnlineEndpoint({getItem(){throw Error('storage unavailable')}},fallback),fallback);
});
