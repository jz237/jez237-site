/**
 * Landmark models and information cards: the data is complete and sourced,
 * models validate and build into finite geometry on the ground, and every
 * card's facts cite a source.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { buildLandmarkModels, validateModels, PRIMITIVE_TYPES } from '../src/landmark-models.js';
import { detailedLandmarks } from '../src/landmark-detail.js';

const dataDir = new URL('../data/', import.meta.url);
const landmarks = JSON.parse(await readFile(new URL('landmarks.json', dataDir), 'utf8'));
const cards = JSON.parse(await readFile(new URL('landmark-cards.json', dataDir), 'utf8'));
const models = JSON.parse(await readFile(new URL('landmark-models.json', dataDir), 'utf8'));
const names = new Set(landmarks.landmarks.map((l) => l.n));

test('landmark cards', async (t) => {
  await t.test('every card belongs to a landmark and every fact and text is sourced', () => {
    const entries = Object.entries(cards.cards);
    assert.ok(entries.length >= 12, 'a useful set of cards');
    for (const [name, card] of entries) {
      assert.ok(names.has(name) || name === 'Battleship New Jersey', `card for unknown landmark ${name}`);
      assert.ok(card.category && card.text && card.text.length > 40, `${name} needs text`);
      assert.ok(Array.isArray(card.facts) && card.facts.length >= 2, `${name} needs facts`);
      for (const f of card.facts) assert.ok(f.length === 2 && f[0] && f[1], `${name} fact shape`);
      assert.ok(Array.isArray(card.sources) && card.sources.length >= 1, `${name} needs a source`);
      for (const [label, url] of card.sources) {
        assert.ok(label && /^https:\/\/(en\.wikipedia\.org|www\.openstreetmap\.org|www\.thehiddenreef\.com|www\.aecdaily\.com|api\.phila\.gov|www\.skyscrapercenter\.com)\//.test(url),
          `${name} source ${url}`);
      }
      if (card.model) {
        assert.ok(models.models.some((m) => m.id === card.model), `${name} model ${card.model}`);
      }
    }
  });

  await t.test('cards never claim survey precision for a schematic model', () => {
    for (const [name, card] of Object.entries(cards.cards)) {
      if (card.model) assert.match(card.text, /schematic|approximate|rounded/i, `${name} must say its model is schematic`);
    }
  });
});

test('landmark models', async (t) => {
  await t.test('the models document validates', () => {
    assert.deepEqual(validateModels(models, names), []);
    assert.ok(models.models.length >= 5);
    assert.ok(PRIMITIVE_TYPES.includes('ring'));
  });

  await t.test('validation catches bad models', () => {
    const bad = { models: [
      { id: 'x', landmark: 'Nowhere', parts: [{ type: 'blob', w: 1, d: 1, h: 1 }] },
      { id: 'x', landmark: 'Independence Hall', source: 's', parts: [{ type: 'box', w: 10, d: 10, h: 900 }] },
    ] };
    const problems = validateModels(bad, names);
    assert.ok(problems.some((p) => /unknown landmark/.test(p)));
    assert.ok(problems.some((p) => /type blob/.test(p)));
    assert.ok(problems.some((p) => /height 900/.test(p)));
    assert.ok(problems.some((p) => /duplicate/.test(p)));
  });

  await t.test('models build into finite geometry standing on the ground', () => {
    const anchors = new Map(landmarks.landmarks.map((l) => [l.n, { lon: l.lon, lat: l.lat }]));
    const packed = buildLandmarkModels(models, {
      anchors,
      toWorld: (lon, lat) => [(lon + 75.25) * 85253.6, (40.125 - lat) * 111033.4],
      groundAt: () => 7,
    });
    assert.equal(packed.models.length, models.models.length, 'every model resolved an anchor');
    assert.ok(packed.vertexCount > 200 && packed.indexCount > 300);
    for (let i = 0; i < packed.indexCount; i += 1) assert.ok(packed.index[i] < packed.vertexCount);
    for (const v of packed.position) assert.ok(Number.isFinite(v));
    assert.equal(packed.clock.length, packed.vertexCount * 4);
    for (const value of packed.clock) assert.ok(Number.isFinite(value));
    for (let v = 0; v < packed.vertexCount; v += 1) {
      assert.equal(packed.ground[v], 7, 'ground is sampled at the anchor');
      assert.ok(packed.position[v * 3 + 1] >= 0, 'nothing below its own base');
      assert.ok(packed.info[v * 2] > 0, 'every part has a height');
    }
    for (const m of packed.models) {
      assert.ok(m.top > 5 && m.top < 350, `${m.id} top ${m.top}`);
      assert.ok(m.radius >= 10 && m.radius < 400, `${m.id} radius ${m.radius}`);
      assert.ok(m.vertexEnd > m.vertexStart);
      // The per-vertex model index is consistent across the model's range.
      for (let v = m.vertexStart; v < m.vertexEnd; v += 1) assert.equal(packed.model[v], m.index);
    }
    // The stadium bowls are rings: hollow, so more vertices than a box.
    const bowl = packed.models.find((m) => m.id === 'lincoln-financial-field');
    assert.ok(bowl.vertexEnd - bowl.vertexStart >= 4 * 28, 'ring has inner and outer walls');
  });

  await t.test('a model with its own lon/lat uses it, and a missing anchor is skipped', () => {
    const doc = { models: [
      { id: 'a', landmark: 'Nowhere', source: 's', parts: [{ type: 'box', w: 10, d: 10, h: 10 }] },
      { id: 'b', landmark: 'Nowhere', lon: -75.2, lat: 40.0, source: 's',
        parts: [{ type: 'cylinder', r: 5, h: 10, segs: 8 }] },
    ] };
    const packed = buildLandmarkModels(doc, {
      anchors: new Map(), toWorld: (lon, lat) => [lon, lat], groundAt: () => 0,
    });
    assert.equal(packed.models.length, 1);
    assert.equal(packed.models[0].id, 'b');
    assert.equal(packed.models[0].x, -75.2);
  });
});


test('Center City landmarks retain their referenced heights and facade styles', () => {
  const hall = models.models.find((m) => m.id === 'city-hall');
  const tower = models.models.find((m) => m.id === 'comcast-technology');
  assert.equal(hall.facade, 'stone');
  assert.equal(tower.facade, 'glass');
  assert.equal(Math.max(...tower.parts.map((p) => (p.base || 0) + p.h)), 341);
  assert.equal(Math.max(...hall.parts.map((p) => (p.base || 0) + p.h)), 167);
});

test('City Hall detailing retains its summit and gives the bronze figure solid, finite geometry',()=>{
  const original=JSON.stringify(models),detailed=detailedLandmarks(models,'city-hall');
  assert.equal(JSON.stringify(models),original,'architectural studies do not mutate the source model');
  assert.deepEqual(validateModels(detailed,names),[]);
  const hall=detailed.models.find(m=>m.id==='city-hall');
  assert.equal(Math.max(...hall.parts.map(p=>(p.base||0)+p.h+(p.ridge||0))),167);
  const figure=hall.parts.filter(p=>p.base>=155.7);
  assert.ok(figure.length>=8,'coat, legs, arms, head and hat form a recognizable silhouette');
  assert.ok(figure.every(p=>p.finish[3]===2),'bronze sculpture must never acquire façade windows');
  const packed=buildLandmarkModels({models:[hall]},
    {anchors:new Map([['Philadelphia City Hall',{lon:0,lat:0}]]),toWorld:()=>[0,0],groundAt:()=>8});
  assert.ok(packed.position.every(Number.isFinite));
  assert.ok(packed.vertexCount<5000,'landmark detail stays within a compact geometry budget');
  assert.ok(hall.parts.filter(p=>p.type==='gable').every(p=>p.finish[3]===2));
});

test('historic gables retain masonry walls below their separate opaque roof finish',()=>{
  for(const id of ['independence-hall','museum-of-art']){
    const model=detailedLandmarks(models,id).models.find(m=>m.id===id);
    for(const part of model.parts.filter(p=>p.type==='gable')){
      assert.equal(part.finish[3],1,'main walls retain historic window openings');
      assert.equal(part.roofFinish[3],2,'roof material stays opaque');
      assert.notDeepEqual(part.finish.slice(0,3),part.roofFinish.slice(0,3));
      const packed=buildLandmarkModels({models:[{...model,lon:0,lat:0,parts:[part]}]},
        {anchors:new Map(),toWorld:()=>[0,0],groundAt:()=>0});
      const eave=(part.base||0)+part.h;
      for(let v=0;v<packed.vertexCount;v++)if(packed.position[v*3+1]<eave){
        assert.equal(packed.finish[v*4+3],1,'roof color never spreads down to the masonry');
      }
    }
  }
});

test('gable slopes have the same correct surface area along either footprint axis',()=>{
  const areas=[];
  for(const [w,d] of [[30,10],[10,30]]){
    const roof=buildLandmarkModels({models:[{id:'gable',lon:0,lat:0,parts:[{
      type:'gable',w,d,h:20,ridge:5,finish:[.7,.5,.3,1],roofFinish:[.2,.3,.4,2]}]}]},
      {anchors:new Map(),toWorld:()=>[0,0],groundAt:()=>0});
    let area=0;
    for(let i=0;i<roof.index.length;i+=3){
      const ids=[...roof.index.slice(i,i+3)];
      if(ids.some(v=>roof.finish[v*4+3]!==2))continue;
      const [a,b,c]=ids.map(v=>Array.from(roof.position.slice(v*3,v*3+3)));
      const u=b.map((n,j)=>n-a[j]),v=c.map((n,j)=>n-a[j]);
      const triangle=Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])/2;
      assert.ok(triangle>0,'roof triangles cannot collapse');area+=triangle;
    }
    areas.push(area);assert.ok(Math.abs(area-(60*Math.hypot(5,5)+50))<.001);
  }
  assert.ok(Math.abs(areas[0]-areas[1])<.001);
});


test('The Hidden Reef has a searchable, sourced location inside the map bounds', () => {
  const store = landmarks.landmarks.find((l) => l.n === 'The Hidden Reef');
  assert.equal(store.lon, -74.8827262);
  assert.equal(store.lat, 40.1368222);
  assert.equal(store.viewPreset, 'hidden-reef');
  assert.match(cards.cards[store.n].facts[0][1], /4501 New Falls Road/);
  assert.ok(cards.cards[store.n].sources.some(([, url]) => url === 'https://www.thehiddenreef.com/'));
});
