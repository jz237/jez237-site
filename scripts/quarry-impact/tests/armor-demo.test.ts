import test from 'node:test';
import assert from 'node:assert/strict';
import {readDemoOptions,DEFAULT_DEMO,demoCarKind,demoVehicleSetup} from '../src/demo-session';
import {readGarage,exportSetup,importSetup} from '../src/garage';
import {CAR_KINDS} from '../src/rules';

test('old and invalid demo saves keep stock builds and the steady director',()=>{
  for(const setups of [undefined,null,3,'invalid','__proto__']){
    const options=readDemoOptions(JSON.stringify({version:1,setups}));
    assert.equal(options.setups,'stock');assert.equal(options.camera,'director');
  }
  assert.equal(DEFAULT_DEMO.setups,'stock');
  const options=readDemoOptions(JSON.stringify({...DEFAULT_DEMO,setups:'garage'}));
  assert.equal(readDemoOptions(JSON.stringify(options)).setups,'garage');
});

test('mixed and selected demos resolve independent saved vehicle builds for the entire field',()=>{
  const garage=readGarage();
  CAR_KINDS.forEach((kind,i)=>{
    garage.cars[kind].setup.armor=i%4;
    garage.cars[kind].setup.engine=(i+1)%4;
    garage.cars[kind].setup.paint=0x102030+i;
    garage.cars[kind].setup.tune.suspension=i%2?.6:-.4;
    garage.cars[kind].setup=importSetup(exportSetup(kind,garage.cars[kind].setup),kind);
  });
  const saved=JSON.stringify(garage);
  for(const lineup of ['mixed','selected'] as const)for(let i=0;i<24;i++){
    const kind=demoCarKind(i,'buggy',lineup);
    const setup=demoVehicleSetup(kind,{setups:'garage'},garage)!;
    assert.deepEqual(setup,garage.cars[kind].setup);
    assert.notEqual(setup,garage.cars[kind].setup);
    setup.tune.suspension=0;setup.armor=0;setup.livery.push({} as never);
    assert.equal(demoVehicleSetup(kind,{setups:'stock'},garage),undefined);
  }
  assert.equal(JSON.stringify(garage),saved);
});

test('garage-built demos default newly added cars and reject malformed persisted armor',()=>{
  const garage=readGarage(JSON.stringify({version:1,cars:{buggy:{setup:{armor:Infinity}},marten:{setup:{armor:99}}}}));
  assert.equal(demoVehicleSetup('buggy',{setups:'garage'},garage)!.armor,0);
  assert.equal(demoVehicleSetup('marten',{setups:'garage'},garage)!.armor,3);
  assert.equal(demoVehicleSetup('tern',{setups:'garage'},garage)!.armor,0);
});
