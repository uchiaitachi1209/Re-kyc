const STORE_KEY = 'sirsa-rekyc-draft-v2';
const OLD_STORE_KEY = 'sirsa-rekyc-tab-v1';
const fields = [
  {title:'Bank & account', items:[
    ['branch','Branch name / code'],['cif','Customer ID / CIF No.'],['account','Account No(s).'],['date','Date','date'],['existing','Existing individual customer','checkbox']
  ]},
  {title:'1. Customer details', items:[
    ['fullName','Full name (as per PAN/OVD)'],['dob','Date of birth','date'],['gender','Gender','select',['','Male','Female','Other']],['fatherSpouse','Father’s / spouse’s name'],['pan','PAN'],['form60','Form 60 submitted, where applicable','checkbox'],['ckyc','CKYC / KYC identifier No.'],['nationality','Nationality / citizenship'],['residenceCountry','Country of residence']
  ]},
  {title:'2. Contact details', items:[
    ['mobile','Mobile number (+91)','tel'],['sameMobile','Same as registered','checkbox'],['email','Email ID','email'],['house','House / flat'],['street','Street / locality'],['city','Village / city'],['district','District'],['state','State'],['pin','PIN code','text'],['addressType','Address type','select',['','Residential','Business','Correspondence','Permanent']],['permanentAddress','Permanent address (if different)','textarea']
  ]},
  {title:'3. Occupation & other information', items:[
    ['occupation','Occupation','select',['','Salaried','Business','Agriculture','Professional','Retired','Student','Other']],['occupationOther','Other occupation'],['employer','Name of employer / business'],['income','Annual income (approx.)','select',['','Below ₹1 lakh','₹1–5 lakh','₹5–10 lakh','Above ₹10 lakh','Not stated']],['pep','Politically exposed person (PEP) status','select',['','No','Yes','Family member / close associate of PEP']],['taxOutside','Tax residency outside India?','select',['','No','Yes']]
  ]},
  {title:'4. RE-KYC update request', items:[
    ['noChange','No change in existing KYC details','checkbox'],['changeAddress','Change / update address','checkbox'],['changeMobile','Mobile number','checkbox'],['changeEmail','Email ID','checkbox'],['changePan','PAN','checkbox'],['changeName','Name','checkbox'],['changeOccupation','Occupation / income','checkbox'],['changeOther','Other update','checkbox'],['changeOtherText','Other update details'],['updateRemarks','Details to be updated / remarks','textarea']
  ]},
  {title:'5. Documents submitted', items:[
    ['docOvd','Officially valid document (OVD) / permitted equivalent','checkbox'],['docPan','PAN card','checkbox'],['docForm60','Form 60','checkbox'],['docPhoto','Recent photograph, if required','checkbox'],['docAddress','Address proof','checkbox'],['docOther','Other document','checkbox'],['docOtherText','Other document details'],['docReference','Document type / last 4 characters or reference']
  ]},
  {title:'6. Customer declaration', items:[
    ['place','Place'],['declarationDate','Date','date'],['declarationName','Name (below signature)']
  ]},
  {title:'7. For bank use only', note:'Bank staff can fill this section if required.', items:[
    ['kycStatus','KYC status','select',['','No change confirmed','Details updated','Additional documents required']],['originals','Documents verified with originals','select',['','Yes','Not applicable / permitted alternate process']],['verification','Verification mode','select',['','In person','V-CIP','Aadhaar OTP e-KYC','Other permitted mode']],['verificationOther','Other verification mode'],['systemDate','System update date','date'],['userId','Updated by (User ID)'],['bankRemarks','Remarks / pending requirements','textarea'],['official','Official’s name & designation'],['employeeId','Employee ID'],['managerName','Branch manager’s name']
  ]}
];
function parseData(raw){try{return raw?JSON.parse(raw):null}catch{return null}}
function storedData(){
  try{
    return parseData(localStorage.getItem(STORE_KEY)) ||
      parseData(sessionStorage.getItem(STORE_KEY)) ||
      parseData(sessionStorage.getItem(OLD_STORE_KEY)) || {};
  }catch{
    try{return parseData(sessionStorage.getItem(STORE_KEY)) || parseData(sessionStorage.getItem(OLD_STORE_KEY)) || {}}catch{return {}}
  }
}
function saveData(data){
  const value=JSON.stringify(data);
  try{localStorage.setItem(STORE_KEY,value);return true}catch{
    try{sessionStorage.setItem(STORE_KEY,value);return true}catch{return false}
  }
}
function clearData(){
  try{localStorage.removeItem(STORE_KEY);localStorage.removeItem(OLD_STORE_KEY)}catch{}
  try{sessionStorage.removeItem(STORE_KEY);sessionStorage.removeItem(OLD_STORE_KEY)}catch{}
}
function renderEntry(){
  const holder=document.getElementById('form-fields'); if(!holder)return;
  const saved=storedData();
  for(const section of fields){
    const fieldset=document.createElement('fieldset'); fieldset.className='entry-section';
    const legend=document.createElement('legend'); legend.textContent=section.title;fieldset.append(legend);
    if(section.note){const note=document.createElement('p');note.className='section-note';note.textContent=section.note;fieldset.append(note)}
    const grid=document.createElement('div');grid.className='field-grid';
    for(const [key,label,type='text',options] of section.items){
      const wrap=document.createElement('div');wrap.className='field'+(type==='textarea'?' wide':'')+(type==='checkbox'?' check-field':'');
      let input;
      if(type==='select'){
        input=document.createElement('select'); for(const option of options){const el=document.createElement('option');el.value=option;el.textContent=option||'Select an option';input.append(el)}
      } else if(type==='textarea'){input=document.createElement('textarea');input.rows=2}
      else {input=document.createElement('input');input.type=type; if(key==='pin') input.inputMode='numeric'; if(key==='mobile')input.inputMode='tel'}
      input.id=key;input.name=key;input.autocomplete='off';
      if(type==='checkbox'){input.checked=Boolean(saved[key]);const text=document.createElement('label');text.htmlFor=key;text.textContent=label;wrap.append(input,text)}
      else {input.value=saved[key] ?? (key==='residenceCountry'?'India':'');const text=document.createElement('label');text.htmlFor=key;text.textContent=label;wrap.append(text,input)}
      grid.append(wrap);
    }
    fieldset.append(grid);holder.append(fieldset);
  }
  const form=document.getElementById('details-form');
  const status=document.getElementById('form-status');
  const autosave=()=>{const saved=saveData(readFields(form));status.textContent=saved?'Draft saved in this browser':'Storage unavailable; keep this tab open';return saved};
  form.addEventListener('input',autosave);
  form.addEventListener('change',autosave);
  form.addEventListener('submit',event=>{event.preventDefault();if(autosave())location.href='form.html'});
  document.getElementById('clear-button').addEventListener('click',()=>{
    form.reset();
    for(const section of fields)for(const [key,,type] of section.items){
      const input=form.elements.namedItem(key);
      if(type==='checkbox')input.checked=false;else input.value='';
    }
    clearData();status.textContent='All details cleared';
    form.querySelector('input:not([type="checkbox"])')?.focus();
  });
}
function readFields(form){const data={};for(const section of fields)for(const [key,,type] of section.items){const input=form.elements.namedItem(key);data[key]=type==='checkbox'?input.checked:input.value.trim()}return data}
function putText(key,value){document.querySelectorAll(`[data-field="${key}"]`).forEach(el=>{el.textContent=value||''})}
function putCheck(key,checked){document.querySelectorAll(`[data-check="${key}"]`).forEach(el=>{el.textContent=checked?'☑':'☐'})}
function readableDate(value){if(!value)return '';const [year,month,day]=value.split('-');return year&&month&&day?`${day} / ${month} / ${year}`:value}
function renderPrint(){
  if(!document.querySelector('.sheet'))return;
  const data=storedData();
  for(const section of fields)for(const [key,,type] of section.items){if(type==='checkbox')putCheck(key,data[key]);else putText(key,type==='date'?readableDate(data[key]):data[key])}
  for(const key of ['gender','addressType','occupation','income','pep','taxOutside','kycStatus','originals','verification']){
    document.querySelectorAll(`[data-choice="${key}"]`).forEach(el=>{el.textContent=data[key]===el.dataset.value?'☑':'☐'})
  }
  document.getElementById('print-button').addEventListener('click',()=>window.print());
}
renderEntry();renderPrint();
