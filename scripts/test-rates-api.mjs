import assert from 'node:assert/strict';
// Direct local Worker test. Platform identity is simulated only in this test request.
const origin='http://127.0.0.1:4185';let cookie='';
async function call(path,method='GET',body){const r=await fetch(origin+'/api/'+path,{method,headers:{'oai-authenticated-user-id':'local-ux-test','oai-authenticated-user-email':'local@example.com',Cookie:cookie,Origin:origin,'X-Requested-With':'SchwyzPortal','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const set=r.headers.get('set-cookie');if(set)cookie=set.split(';')[0];return {status:r.status,data:await r.json()}}
const email=`ux-${crypto.randomUUID()}@example.com`,password=crypto.randomUUID()+'test';
assert.equal((await call('register','POST',{email,password,consent:true,profile:{vorname:'Test',nachname:'Muster'}})).status,200);
assert.equal((await call('drafts','PUT',{service:30,step:1,answers:{rechnung:'TEST-001',betrag:'600',rate:'100',beginn:'2026-11-01',unknown:'discard'},status:'draft'})).status,200);
await call('logout','POST',{});assert.equal((await call('drafts')).status,401);
await call('login','POST',{email,password});let d=(await call('drafts')).data.drafts[0];assert.equal(d.service,30);assert.equal(d.answers.rate,'100');assert.equal(d.answers.unknown,undefined);
assert.equal((await call('drafts','PUT',{service:30,step:4,answers:{}})).status,400);
await call('drafts','PUT',{service:17,step:1,answers:{grund:'Der Hund lebt bei einer anderen Person',neuehalter:'TEST-ID'},status:'draft'});
assert.equal((await call('drafts')).data.drafts.find(x=>x.service===17).answers.neuehalter,'TEST-ID');
await call('drafts','PUT',{service:30,step:3,answers:d.answers,status:'complete'});assert.equal((await call('drafts')).data.drafts.find(x=>x.service===30).status,'complete');
console.log('PASS: local registration, rate draft persistence after login, field allowlist, invalid step rejection, conditional dog fields, completion.');
