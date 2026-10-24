import assert from 'node:assert/strict';

const origin='http://127.0.0.1:4185';
let cookie='';
async function call(path,method='GET',body){
 const response=await fetch(origin+'/api/'+path,{method,headers:{'oai-authenticated-user-id':'local-service-test','oai-authenticated-user-email':'local@example.com',Cookie:cookie,Origin:origin,'X-Requested-With':'SchwyzPortal','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 const setCookie=response.headers.get('set-cookie');if(setCookie)cookie=setCookie.split(';')[0];
 return {status:response.status,data:await response.json()};
}
const email=`services-${crypto.randomUUID()}@example.com`;
assert.equal((await call('register','POST',{email,password:'long-local-test-password',consent:true,profile:{vorname:'Test',nachname:'Person'}})).status,200);
const ids=[0,1,2,5,6,7,8,11,12,15,16,17,25,29,30];
for(const service of ids){
 const answers={vorname:'Test',nachname:'Person',projekttitel:'Musterprojekt',steuerjahr:'2026',dienstnachweis:'Beispieldienst'};
 assert.equal((await call('drafts','PUT',{service,step:2,answers,status:'draft'})).status,200,`save service ${service}`);
}
const drafts=(await call('drafts')).data.drafts;
assert.deepEqual(drafts.map(d=>d.service).sort((a,b)=>a-b),ids);
assert.equal(drafts.find(d=>d.service===7).answers.projekttitel,'Musterprojekt');
assert.equal(drafts.find(d=>d.service===29).answers.dienstnachweis,'Beispieldienst');
for(const service of [3,4,9,10,13,14,18,19,20,21,22,23,24,26,27,28])assert.equal((await call('drafts','PUT',{service,step:1,answers:{},status:'draft'})).status,400,`external service ${service}`);
console.log('PASS: drafts persist for all 15 local services and reject all 16 external services.');
