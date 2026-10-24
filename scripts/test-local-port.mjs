import assert from 'node:assert/strict';

const origin='http://127.0.0.1:4184';
let cookie='';
async function call(path,method='GET',body){
 const response=await fetch(`${origin}/api/${path}`,{method,headers:{Origin:origin,Cookie:cookie,'X-Requested-With':'SchwyzPortal','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 const setCookie=response.headers.get('set-cookie');if(setCookie)cookie=setCookie.split(';')[0];
 return {status:response.status,data:await response.json()};
}

assert.equal((await fetch(origin)).status,200);
const email=`preview-${crypto.randomUUID()}@example.com`;
const password='local-preview-test-password-123';
assert.equal((await call('register','POST',{email,password,consent:true,profile:{vorname:'Test',nachname:'Person'}})).status,200);
assert.equal((await call('me')).data.user.profile.vorname,'Test');
assert.equal((await call('drafts','PUT',{service:1,step:1,answers:{hund:'Musterhund'},status:'draft'})).status,200);
assert.equal((await call('logout','POST',{})).status,200);
assert.equal((await call('me')).data.user,null);
assert.equal((await call('login','POST',{email,password})).status,200);
assert.equal((await call('drafts')).data.drafts.find(d=>d.service===1).answers.hund,'Musterhund');
console.log('PASS: local port 4184 serves the site, registration, logout, login and saved drafts.');
