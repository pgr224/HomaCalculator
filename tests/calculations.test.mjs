import test from 'node:test';
import assert from 'node:assert/strict';
import {positive,glucoseMg,insulinU,homa,homa1,quicki,tyg,a1cToEag,eagToA1c,a1cToIfcc,ifccToA1c,lengthCm,weightKg,bmi,waistHeightRatio} from '../src/calculations.mjs';
const near=(a,b,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<tolerance,`${a} ≠ ${b}`);
test('HOMA1 matches original formula examples and equivalent laboratory units',()=>{
 for(const [glucose,insulin,expected]of [[81,5,1],[90,10,20/9],[126,20,56/9]])near(homa1(glucose,insulin),expected);
 near(homa1(glucoseMg(5,'mmol'),insulinU(60,'pmol',6)),20/9);
 assert.notEqual(homa1(90,10),homa(90,10).ir);
});
test('HOMA1 rejects missing, nonpositive and numerically overflowing inputs',()=>{
 for(const input of ['',0,-1,NaN,Infinity])assert.throws(()=>homa1(input,10));
 assert.throws(()=>homa1(90,0));assert.throws(()=>homa1(1e308,1e308));assert.throws(()=>homa1(1e-300,1e-300));
});
test('HOMA2 reproduces the recovered insulin model example',()=>{const r=homa(90,10);near(r.ir,100/77.3);near(r.beta,113.6);near(r.sensitivity,77.3);});
test('HOMA2 converts glucose 92 mg/dL to 5.1 mmol/L and insulin 10 uIU/mL to 69.5 pmol/L',()=>{const r=homa(92,10);near(r.ir,100/76.9);near(r.beta,109.2);near(r.sensitivity,76.9);});
test('glucose and insulin SI inputs retain the same HOMA2 result',()=>{near(homa(glucoseMg(5.1,'mmol'),insulinU(69.5,'pmol',6.95)).ir,homa(92,10).ir);near(homa(glucoseMg(5,'mmol'),insulinU(69.5,'pmol',6.95)).ir,homa(90,10).ir);near(insulinU(60,'pmol',6),10);near(insulinU(60,'pmol'),10);});
test('HOMA2 beta is defined at 63 mg/dL and rejects glucose outside its domain',()=>{assert.ok(homa(63,10).beta>0);assert.throws(()=>homa(50,10),/3–25 mmol/);assert.ok(homa(64,10).beta>0);});
test('QUICKI uses base-10 logs',()=>near(quicki(90,10),0.33849624626442276,1e-8));
test('QUICKI rejects zero or negative log denominator',()=>{assert.throws(()=>quicki(.1,.1));assert.throws(()=>quicki(1,1));});
test('TyG keeps division inside the natural logarithm',()=>{near(tyg(90,150),Math.log(6750));assert.ok(Math.abs(tyg(90,150)-Math.log(13500)/2)>4);});
test('ADAG conversion is reversible and matches the 7% example',()=>{near(a1cToEag(7),154.2);near(eagToA1c(154.2),7);});
test('ADAG educational range is enforced in both directions',()=>{assert.throws(()=>a1cToEag(3));assert.throws(()=>a1cToEag(16));assert.throws(()=>eagToA1c(1));});
test('NGSP master equation round trip',()=>{near(a1cToIfcc(7),52.9951902055094,1e-8);near(ifccToA1c(a1cToIfcc(7)),7);});
test('empty, invalid, zero, negative and infinite inputs fail',()=>{for(const value of ['',null,undefined,0,-1,'abc',NaN,Infinity])assert.throws(()=>positive(value));});

test('BMI uses meters and exact imperial conversion constants',()=>{near(bmi(70,175),22.857142857142858);near(bmi(weightKg(70/0.45359237,'lb'),lengthCm(175/2.54,'inch')),bmi(70,175));});
test('waist-to-height ratio is dimensionless and handles imperial lengths',()=>{near(waistHeightRatio(85,170),.5);near(waistHeightRatio(lengthCm(34,'inch'),lengthCm(68,'inch')),.5);});
test('unsupported units and non-numeric types cannot be silently reinterpreted',()=>{for(const fn of [()=>glucoseMg(90,'mmol/mol'),()=>insulinU(10,'ng'),()=>lengthCm(175,'feet'),()=>weightKg(70,'stone'),()=>positive(true),()=>positive([])])assert.throws(fn);});
test('overflow and underflow do not produce numeric-looking scores',()=>{assert.throws(()=>homa(1e308,1e308));assert.throws(()=>homa(1e-300,1e-300));assert.throws(()=>bmi(70,1e-300));assert.throws(()=>glucoseMg(1e308,'mmol'));});
