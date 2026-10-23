import test from 'node:test';
import assert from 'node:assert/strict';
import { mathActivities, mathWorksheet } from '../src/math.js';
test('100 arithmetic activities have reproducible, distinct, correctly solved exercises',()=>{
 assert.equal(mathActivities.length,100);assert.equal(new Set(mathActivities.map(p=>p.id)).size,100);
 for(const p of mathActivities){
  for(let i=0;i<4;i++) assert.ok(p.title[i]&&p.how[i]);
  for(const seed of [1,42,999999]){
   const rows=mathWorksheet(p.id,seed);assert.equal(rows.length,24);
   assert.equal(new Set(rows.map(q=>q.prompt)).size,24);
   assert.deepEqual(rows,mathWorksheet(p.id,seed));
   for(const {left:a,right:b,answer:x} of rows){
    switch(p.family){
     case 'add':assert.equal(x,a+b);break;
     case 'subtract':assert.equal(x,a-b);assert.ok(x>=0);break;
     case 'multiply':assert.equal(x,a*b);break;
     case 'divide':case 'fraction':assert.equal(x*b,a);assert.ok(Number.isInteger(x));break;
     case 'missing-add':assert.equal(x+a,b);break;
     case 'missing-subtract':assert.equal(x-a,b);break;
     case 'missing-factor':assert.equal(a*x,b);break;
     case 'sequence':assert.equal(x-a,3*b);break;
     case 'compare':assert.equal(x,a<b?'<':a>b?'>':'=');assert.ok(a<=p.n*10&&b<=p.n*10);break;
     default:assert.fail(p.family);
    }
   }
  }
  assert.notDeepEqual(mathWorksheet(p.id,1),mathWorksheet(p.id,2));
 }
 assert.throws(()=>mathWorksheet('missing'));
});
