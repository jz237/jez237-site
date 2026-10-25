import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ARENA_HORN} from '../src/audio';
test('the arena horn ends an offline derby heat, played so the result pause cannot cut it off',()=>{
 const audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok((ARENA_HORN.ids as readonly string[]).includes(ARENA_HORN.end),'the long horn take');
 assert.ok(audio.includes("if(!this.ready||this.muted||typeof Audio==='undefined'||!this.buffers.has(ARENA_HORN.end))return false;"),'silent when muted, before the sound is up, or without the clip');
 assert.ok(audio.includes("const horn=new Audio(`audio/${ARENA_HORN.end}.ogg`);horn.volume=Math.max(0,Math.min(1,ARENA_HORN.level*this.levels.ambience/.45));horn.play().catch(()=>{});"),'a plain audio element at the horn level on the ambience setting');
 const at=main.indexOf("  if(mode==='derby'&&!online?.active&&sound.endHorn())endHorns++;\n  sound.pause(true);");assert.ok(at>0&&main.lastIndexOf("state = 'result';",at)>at-200,'in finish(), just before the pause, offline derbies only');
});
