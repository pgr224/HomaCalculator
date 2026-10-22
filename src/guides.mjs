export const guides = [
 {
  slug:'homa-ir-normal-range',title:'HOMA-IR normal range: why cutoffs differ',description:'Understand why HOMA-IR has no universal normal range, what changes the score, and what to check before comparing calculator results.',intro:'A reference range only helps when it matches the model, assay and population used for your result.',tools:['homa','insulin','quicki'],faqs:['normal-homa','homa2-difference','homa-repeat'],
  sections:[
   {heading:'Why there is no single normal HOMA-IR number',text:'Oxford cautions that HOMA values depend on the assays used. A threshold quoted without its method and study context cannot reliably classify everyone.',source:'oxford'},
   {heading:'A worked example is not a diagnosis',text:'Fasting glucose 90 mg/dL and insulin 10 µIU/mL produce HOMA1-IR 2.22. This arithmetic does not establish a diagnosis or individual treatment target.',source:'matthews'},
   {heading:'Record the method before comparing results',text:'Check whether the report uses HOMA1 or HOMA2, how insulin was measured, the selected units and the insulin conversion factor. Keep these details with the result.',source:'wallace'},
   {heading:'What to ask about an unexpected result',text:'Ask which reference applies to the laboratory assay, whether the sampling conditions were suitable, and which diagnostic tests are relevant to your situation.',source:'tests'}
  ]
 },
 {
  slug:'fasting-insulin-vs-hba1c',title:'Fasting insulin vs HbA1c: what each test tells you',description:'Compare fasting insulin, fasting glucose and HbA1c: sample timing, what each measures and why HOMA and A1c estimates answer different questions.',intro:'These markers describe different aspects of glucose regulation. One cannot be converted into the other.',tools:['homa','eag','a1c'],faqs:['insulin-test-a1c','a1c-time-window','a1c-fasting-reading'],
  comparison:{headings:['Marker','What is measured','Role on this site'],rows:[['Fasting glucose','Glucose concentration at sampling','An input to fasting indices'],['Fasting insulin','Insulin concentration at sampling','Paired with glucose for HOMA1 or QUICKI'],['HbA1c','Glycated hemoglobin','Used to estimate average glucose with ADAG']]},
  sections:[
   {heading:'Fasting insulin captures a sampling moment',text:'An insulin assay measures circulating insulin under the conditions in which the blood was collected. Preparation and medication history matter when interpreting it.',source:'insulinTest'},
   {heading:'HbA1c gives a longer view',text:'HbA1c reflects glucose exposure over roughly three months. It does not describe every high or low reading, and conditions affecting red blood cells can alter it.',source:'a1c'},
   {heading:'Why the calculators give different kinds of answers',text:'HOMA1 uses paired fasting glucose and insulin. The eAG calculator uses HbA1c. Feeding a single fasting glucose value into the reverse eAG equation does not turn it into a measured HbA1c.',source:'adag'},
   {heading:'Which test should you request?',text:'The choice depends on the assessment. Review it with your clinician; this site does not recommend an insulin test as a replacement for established diabetes diagnostic tests.',source:'tests'}
  ]
 },
 {
  slug:'fasting-blood-test-preparation',title:'Fasting glucose and insulin test preparation',description:'Prepare for paired fasting glucose and insulin tests: follow laboratory instructions, ask about medicines and report any changes in fasting conditions.',intro:'Start with the instructions for the tests actually ordered. A calculator cannot repair an unsuitable sample.',tools:['homa','quicki','tyg'],faqs:['fasting-hours','fasting-water','fasting-coffee','fasting-accident','insulin-medicines'],
  sections:[
   {heading:'Confirm the fasting instructions',text:'Check the requested duration with your laboratory. Insulin testing often involves an overnight fast of 8–12 hours; the instructions for your own tests take priority.',source:'insulinTest'},
   {heading:'Use paired values for fasting indices',text:'Keep the glucose and insulin results from the same fasting sample together. Avoid combining a glucose reading from one day with an insulin result from another.',source:'wallace'},
   {heading:'Ask about medicines and supplements',text:'Tell the ordering clinician what you take, including supplements. Ask whether any preparation changes are needed, and do not stop prescribed medicines independently.',source:'insulinTest'},
   {heading:'If the fast was interrupted',text:'Tell the laboratory if you ate or drank something other than plain water. They can advise whether the sample should be collected or rescheduled.',source:'fasting'},
   {heading:'Bring the full laboratory report',text:'Keep values, units, collection conditions and any laboratory notes together. The calculator asks you to confirm fasting conditions and makes its unit conversions explicit.',source:null}
  ]
 }
];
