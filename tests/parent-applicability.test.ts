import {test} from 'node:test';
import assert from 'node:assert/strict';
import {setField,validateForm} from '../src/features/parent-registration/model.ts';
test('parent toggles preserve entered values, invalidate old signatures and restore required validation',()=>{
 const data:any={parent1:{name:'אב',phone:'0500000001'},parent2:{name:'אם',phone:''},signatures:{parent1:{documentId:'old'}}};
 const disabled=setField(data,'parent2.notApplicable',true);
 assert.equal(disabled.parent2?.name,'אם');assert.equal(disabled.parent1?.notApplicable,false);assert.equal(disabled.signatures,undefined);
 const issues=validateForm(disabled,'v1',{physician:true,parent1:true,parent2:false});assert.ok(!issues.some(x=>x.path.startsWith('parent2.')));
 const enabled=setField(disabled,'parent2.notApplicable',false);assert.equal(enabled.parent2?.name,'אם');assert.ok(validateForm(enabled,'v1',{physician:true,parent1:true,parent2:false}).some(x=>x.path==='parent2.phone'));
 const both=setField(disabled,'parent1.notApplicable',true);assert.ok(validateForm(both,'v1',{physician:true,parent1:false,parent2:false}).some(x=>x.path==='parent1.notApplicable'));
});
