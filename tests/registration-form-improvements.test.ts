import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fillVolunteerText} from '../src/features/volunteer-registration/fill-text.ts';
test('volunteer statements fill applicant identity without changing missing values or source text',()=>{
 const original='אני הח"מ __________________ ת.ז.__________________';
 const person={firstName:'שם',lastName:'בדיקה',nationalId:'123456782'};
 assert.equal(fillVolunteerText(original,person),'אני הח"מ שם בדיקה ת.ז.123456782');
 assert.equal(fillVolunteerText('אנו הוריו של _____________ מאשרים',person),'אנו הוריו של שם בדיקה מאשרים');
 assert.equal(fillVolunteerText(original),original);
});
