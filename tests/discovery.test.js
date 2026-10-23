import test from 'node:test';
import assert from 'node:assert/strict';
import { related, discovery } from '../scripts/discovery.mjs';
test('related activities prefer actual shared topic and omit the current page',()=>{
 const items=[{slug:'weather-wheel'},{slug:'fruit-wheel'},{slug:'fruit-story-prompts'},{slug:'breakfast-wheel'}];
 assert.equal(related(items,items[1],2)[0].slug,'fruit-story-prompts');
 assert.ok(!related(items,items[1]).includes(items[1]));
 assert.equal(related(items,items[1],2).length,2);
});
test('discovery renders visible multilingual methods and escaped link labels',()=>{
 for(const lang of ['en','ko','ja','es']){
  const html=discovery('spin',lang,[{slug:'name-picker',title:['<script>','<script>','<script>','<script>']}],()=>'/safe/');
  assert.ok(html.includes('&lt;script>')); assert.ok(!html.includes('<script>'));
  assert.equal((html.match(/<details>/g)||[]).length,2);
 }
});
