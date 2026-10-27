import {positive,glucoseMg,insulinU,homa,quicki,tyg,a1cToEag,eagToA1c,a1cToIfcc,ifccToA1c,lengthCm,weightKg,bmi,waistHeightRatio} from './calculations.mjs';
const $=s=>document.querySelector(s);
const fmt=(v,d=2)=>{if(!Number.isFinite(v))throw new Error('This value is outside the supported numerical range. Check your input.');return Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});};
const menu=$('.menu-button');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));$('#site-nav').classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.click();menu.focus();}});
async function copy(text,status){try{await navigator.clipboard.writeText(text);status.textContent='Copied to your clipboard.';}catch{status.textContent='Clipboard access is unavailable. Select and copy the text manually.';}}
const form=$('[data-calculator]');
if(form){
 const id=form.dataset.calculator;
 form.querySelector('button[type="submit"]').disabled=false;
 let report='';
 const results=$('#results'),error=$('#form-error');
 const unit=name=>$(`#${name}-unit`)?.value;
 const value=name=>$(`#${name}`)?.value;
 function clear(message='Enter your values to calculate.'){
  results.replaceChildren();const score=document.createElement('p');score.className='result-placeholder';score.textContent='—';const p=document.createElement('p');p.textContent=message;results.append(score,p);
  report='';$('#copy-result').disabled=true;$('#print-result').disabled=true;$('#copy-status').textContent='';
 }
 function calculate(event){
  event?.preventDefault();error.hidden=true;error.textContent='';form.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'));
  try{
   for(const el of form.querySelectorAll('input[type="number"][required]')){if(!el.checkValidity()){el.setAttribute('aria-invalid','true');el.focus();throw new Error(`${form.querySelector(`label[for="${el.id}"]`).textContent}: enter a number greater than zero.`);}}
   const fasting=$('#fasting');
   if(fasting&&!fasting.checked)throw new Error('Confirm that both measurements are from the same fasting sample.');
   if($('#acute')?.checked)throw new Error('These fasting indices are not appropriate for an acute illness or unstable sampling condition.');
   if($('#exogenous')?.checked)throw new Error('Injected insulin makes these insulin-based estimates unsuitable here. Discuss assessment with your clinician.');
   if($('#adult')&&!$('#adult').checked)throw new Error('Confirm that this measurement is for an adult age 20 or older.');
   const factor=Number(value('factor')||(id==='homa'?6.95:6));
   const g=$('#glucose')?glucoseMg(value('glucose'),unit('glucose')):null;
   const i=$('#insulin')?insulinU(value('insulin'),unit('insulin'),factor):null;
   let rows=[],note='',inputText='';
   if(['quicki','tyg'].includes(id)&&g>600)throw new Error('Check the glucose value and selected unit. This fasting tool accepts glucose up to 600 mg/dL.');
   if(id==='quicki'&&i>1000)throw new Error('Check the insulin value and selected unit. This tool accepts insulin up to 1,000 µIU/mL.');
   if(id==='homa'){
    const r=homa(g,i);rows=[['HOMA2-IR',fmt(r.ir)],['HOMA2-%B',fmt(r.beta,1)+'%'],['HOMA2-%S',fmt(r.sensitivity,1)+'%']];
    note='HOMA2 model estimates. No diagnostic classification is assigned.';
   }
   if(id==='quicki'){rows=[['QUICKI',fmt(quicki(g,i),4)]];note='Uses base-10 logarithms. Higher values generally indicate greater sensitivity; no diagnostic classification is assigned.';}
   if(['homa','quicki'].includes(id))inputText=`Fasting glucose: ${fmt(g,3)} mg/dL; fasting insulin: ${fmt(i,3)} µIU/mL. Insulin factor: ${factor} pmol/L per µIU/mL.`;
   if(id==='tyg'){
    const tg=positive(value('triglycerides'),'Triglycerides')*(unit('triglycerides')==='mmol'?88.57:1);
    rows=[['TyG index',fmt(tyg(g,tg),4)]];note='Convention: ln[(TG × glucose)/2], both in mg/dL. Check the formula before comparing with a study.';inputText=`Fasting glucose: ${fmt(g,3)} mg/dL; triglycerides: ${fmt(tg,3)} mg/dL.`;
   }
   if(id==='eag'){
    const reverse=value('direction')==='eag';const a=reverse?eagToA1c(glucoseMg(value('average'),unit('average'))):positive(value('a1c'),'HbA1c');const eg=a1cToEag(a);
    rows=reverse?[['Estimated HbA1c',fmt(a,2)+'%']]:[['Estimated average glucose',fmt(eg,1)+' mg/dL'],['Estimated average glucose (SI)',fmt(eg/18,2)+' mmol/L']];
    inputText=reverse?`Average glucose: ${fmt(eg,3)} mg/dL.`:`Laboratory HbA1c: ${fmt(a,2)}%.`;note='ADAG population estimate. Estimated HbA1c is not a lab result or CGM-derived GMI.';
   }
   if(id==='glucose'){rows=unit('glucose')==='mg'?[['Blood glucose',fmt(g/18,3)+' mmol/L']]:[['Blood glucose',fmt(g,2)+' mg/dL']];inputText=`Input: ${value('glucose')} ${unit('glucose')==='mg'?'mg/dL':'mmol/L'}.`;note='Conversion factor: 18. No diagnostic interpretation.';}
   if(id==='insulin'){rows=unit('insulin')==='u'?[['Insulin',fmt(i*factor,3)+' pmol/L']]:[['Insulin',fmt(i,3)+' µIU/mL']];inputText=`Input: ${value('insulin')} ${unit('insulin')==='u'?'µIU/mL':'pmol/L'}.`;note=`Factor: ${factor} pmol/L per µIU/mL. Confirm with the laboratory.`;}
   if(id==='cpeptide'){
    const raw=positive(value('cpeptide'),'C-peptide');const ng=raw/(unit('cpeptide')==='nmol'?0.331:unit('cpeptide')==='pmol'?331:1);
    rows=[['C-peptide',fmt(ng,3)+' ng/mL'],['C-peptide (SI)',fmt(ng*0.331,3)+' nmol/L'],['C-peptide (pmol)',fmt(ng*331,1)+' pmol/L']];inputText=`Input: ${raw} ${unit('cpeptide')==='ng'?'ng/mL':unit('cpeptide')==='nmol'?'nmol/L':'pmol/L'}.`;note='C-peptide unit conversion only. No insulin concentration is estimated.';
   }
   if(id==='a1c'){
    const raw=positive(value('a1c'),'HbA1c');const a=unit('a1c')==='ifcc'?ifccToA1c(raw):raw;
    rows=unit('a1c')==='ifcc'?[['HbA1c (NGSP)',fmt(a,2)+'%']]:[['HbA1c (IFCC)',fmt(a1cToIfcc(a),1)+' mmol/mol']];inputText=`Input: ${raw} ${unit('a1c')==='ifcc'?'mmol/mol':'%'}.`;note='NGSP–IFCC master equation. This converts HbA1c reporting units, not blood glucose.';
   }
   if(id==='bmi'||id==='waist'){
    const height=lengthCm(value('height'),unit('height'));
    if(height<50||height>300)throw new Error('Check the height and unit. This adult tool accepts heights from 50 to 300 cm.');
    if(id==='bmi'){
     const weight=weightKg(value('weight'),unit('weight'));
     if(weight<10||weight>700)throw new Error('Check the weight and unit. This adult tool accepts weights from 10 to 700 kg.');
     rows=[['Adult BMI',fmt(bmi(weight,height),2)+' kg/m²']];inputText=`Weight: ${fmt(weight,3)} kg; height: ${fmt(height,3)} cm.`;note='BMI is a screening measure, not body-fat percentage or an insulin resistance diagnosis.';
    }else{
     const waist=lengthCm(value('waist'),unit('waist'));
     if(waist<20||waist>400)throw new Error('Check the waist measurement and unit. This tool accepts 20 to 400 cm.');
     rows=[['Waist-to-height ratio',fmt(waistHeightRatio(waist,height),3)]];inputText=`Waist: ${fmt(waist,3)} cm; height: ${fmt(height,3)} cm.`;note='A ratio of 0.500 means waist circumference is half the height. This is not a body-fat percentage or a diagnosis.';
    }
   }
   results.replaceChildren();
   for(const [index,[label,val]] of rows.entries()){const div=document.createElement('div');div.className=index===0?'result-main':'result-row';const name=document.createElement('span');name.textContent=label;const number=document.createElement('strong');number.textContent=val;div.append(name,number);results.append(div);}
   const p=document.createElement('p');p.className='small result-explanation';p.textContent=note;results.append(p);
   const input=document.createElement('p');input.className='small result-inputs';input.textContent=inputText;results.append(input);
   const title=document.querySelector('h1').textContent.trim();const canonical=document.querySelector('link[rel="canonical"]').href;
   $('#report-heading').textContent=`${id==='homa'?'HOMA2 calculation':title} · ${new Intl.DateTimeFormat('en-GB').format(new Date())}`;
   report=`HomaCalc — ${id==='homa'?'HOMA2 calculation':title}\n${inputText}\n${rows.map(([l,v])=>`${l}: ${v}`).join('\n')}\n${note}\nEducational estimate; review with a qualified clinician.\nMethod: ${id==='homa'?new URL('/calculators/homa-ir-calculator/',canonical).href:canonical}`;
   $('#copy-result').disabled=false;$('#print-result').disabled=false;
  }catch(e){clear('Calculation unavailable. Review the input message.');error.textContent=e.message;error.hidden=false;}
 }
 form.addEventListener('submit',calculate);
 form.addEventListener('input',()=>{clear('Values changed. Calculate again to update the result.');error.hidden=true;});
 form.addEventListener('change',()=>{clear('Values changed. Calculate again to update the result.');error.hidden=true;});
 form.addEventListener('reset',()=>{clear();error.hidden=true;form.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'));setTimeout(()=>{form.querySelectorAll('select[data-value]').forEach(s=>s.dataset.previous=s.value);toggleAverage();},0);});
 // Preserve concentration when changing units; do not silently reinterpret an existing value.
 form.querySelectorAll('select[data-value]').forEach(select=>{
  select.dataset.previous=select.value;
  select.addEventListener('change',()=>{
   const key=select.dataset.value,el=$(`#${key}`),old=select.dataset.previous,next=select.value;select.dataset.previous=next;
   if(el.value===''||!Number.isFinite(Number(el.value)))return;
   const factors=key==='insulin'?{u:1,pmol:1/Number(value('factor')||(id==='homa'?6.95:6))}:key==='cpeptide'?{ng:1,nmol:1/0.331,pmol:1/331}:key==='triglycerides'?{mg:1,mmol:88.57}:key==='height'||key==='waist'?{cm:1,inch:2.54}:key==='weight'?{kg:1,lb:0.45359237}:{mg:1,mmol:18};
   let converted;
   if(key==='a1c')converted=old==='percent'?(Number(el.value)-2.152)/0.09148:Number(el.value)*0.09148+2.152;
   else if(id==='homa'&&key==='glucose')converted=next==='mmol'?Math.round(Number(el.value)/1.8)/10:Math.round(Number(el.value)*18);
   else if(id==='homa'&&key==='insulin')converted=next==='u'?Number((Number(el.value)/6.95).toPrecision(12)):Number((Number(el.value)*6.95).toPrecision(12));
   else converted=Number(el.value)*factors[old]/factors[next];
   el.value=id==='homa'?converted:Number(converted.toPrecision(12));
  });
 });
 function toggleAverage(){if(id!=='eag')return;const reverse=value('direction')==='eag';$('#average-fields').hidden=!reverse;$('#average').required=reverse;$('#a1c').closest('.field').hidden=reverse;$('#a1c').required=!reverse;}
 $('#direction')?.addEventListener('change',toggleAverage);toggleAverage();
 $('#load-example').addEventListener('click',()=>{
  form.reset();
  const samples={homa:{glucose:90,insulin:10},quicki:{glucose:90,insulin:10},tyg:{glucose:90,triglycerides:150},eag:{a1c:7},glucose:{glucose:90},insulin:{insulin:10},cpeptide:{cpeptide:1.8},a1c:{a1c:7},bmi:{height:175,weight:70},waist:{height:170,waist:85}};
  for(const [key,v]of Object.entries(samples[id]))$(`#${key}`).value=v;
  if($('#fasting'))$('#fasting').checked=true;
  if($('#adult'))$('#adult').checked=true;
  form.querySelectorAll('select[data-value]').forEach(s=>s.dataset.previous=s.value);toggleAverage();calculate();
 });
 $('#copy-result').addEventListener('click',()=>copy(report,$('#copy-status')));
 $('#print-result').addEventListener('click',()=>window.print());
}
const search=$('#faq-search');
let resetFaqFilters=()=>{};
if(search){let category='All',expanded=false;const items=[...document.querySelectorAll('#faq-list .faq-item')];
 const filter=()=>{const query=search.value.trim().toLocaleLowerCase();let count=0;for(const item of items){item.hidden=!((category==='All'||item.dataset.category===category)&&item.textContent.toLocaleLowerCase().includes(query));if(!item.hidden)count++;}$('#faq-count').textContent=`${count} ${count===1?'question':'questions'}`;$('#faq-empty').hidden=count!==0;};
 search.addEventListener('input',filter);
 document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});filter();}));
 $('#expand-faqs').addEventListener('click',e=>{expanded=!expanded;items.filter(i=>!i.hidden).forEach(i=>i.open=expanded);e.currentTarget.textContent=expanded?'Collapse answers':'Expand answers';});
 resetFaqFilters=()=>{search.value='';category='All';document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b.dataset.filter==='All';b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});filter();};
}
function revealHash(){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target?.matches('details')){if(target.hidden)resetFaqFilters();target.open=true;target.scrollIntoView({block:'start'});}}
try{revealHash();}catch{}window.addEventListener('hashchange',()=>{try{revealHash();}catch{}});
const citationTool=$('#citation-tool');
if(citationTool){const origin=new URL(document.querySelector('link[rel="canonical"]').href).origin;const text=$('#citation-text');
 const update=()=>{text.textContent=`HomaCalc. ${citationTool.selectedOptions[0].textContent}. ${origin}${citationTool.value} Accessed ${new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}.`;};
 citationTool.addEventListener('change',update);update();
 $('#copy-citation').addEventListener('click',()=>copy(text.textContent,$('#citation-status')));
 $('#copy-link').addEventListener('click',()=>copy(origin+citationTool.value,$('#citation-status')));
}
document.querySelectorAll('[data-dialog-open]').forEach(btn=>{
 btn.addEventListener('click',()=>{
  const id=btn.getAttribute('data-dialog-open');
  const d=document.getElementById(id);
  if(d&&typeof d.showModal==='function')d.showModal();
 });
});
document.querySelectorAll('.dialog-close-btn').forEach(btn=>{
 btn.addEventListener('click',()=>btn.closest('dialog')?.close());
});
document.querySelectorAll('dialog').forEach(d=>{
 d.addEventListener('click',e=>{if(e.target===d)d.close();});
});
