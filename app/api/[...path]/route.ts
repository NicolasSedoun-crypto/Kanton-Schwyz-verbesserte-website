import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
export const dynamic='force-dynamic';
const encoder=new TextEncoder();
const hex=(v:ArrayBuffer|Uint8Array)=>Array.from(new Uint8Array(v)).map(x=>x.toString(16).padStart(2,'0')).join('');
const digest=async(v:string)=>hex(await crypto.subtle.digest('SHA-256',encoder.encode(v)));
async function passwordHash(password:string,salt:string){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:100000,hash:'SHA-256'},key,256));}
function equal(a:string,b:string){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0;}
function json(body:unknown,status=200,cookie?:string){const h=new Headers({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});if(cookie)h.set('Set-Cookie',cookie);return new Response(JSON.stringify(body),{status,headers:h});}
function cookie(req:Request,token:string,age=60*60*24*7){return `sz_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${new URL(req.url).protocol==='https:'?'; Secure':''}`;}
const profileKeys=['vorname','nachname','adresse','plz','ort','email','telefon','gemeinde'];
const answerKeys=[...profileKeys,'dokument','sprache','zweck','hund','chip','amicus','ereignis'];
function clean(input:unknown,keys:string[]){const result:Record<string,string>={};if(!input||typeof input!=='object'||Array.isArray(input))return result;for(const key of keys){const value=(input as Record<string,unknown>)[key];if(typeof value==='string'){if(value.length>500)throw Error('Feld zu lang.');result[key]=value.trim();}}return result;}
async function handler(req:Request){
 const identity=await getChatGPTUser();if(!identity)return json({error:'Bitte zuerst den privaten Zugang mit ChatGPT öffnen.'},401);
 const db=env.DB;if(!db)return json({error:'Die Datenspeicherung ist momentan nicht verfügbar.'},503);
 const path=new URL(req.url).pathname.replace(/^\/api\//,'');
 const write=!['GET','HEAD'].includes(req.method);
 if(write){const origin=req.headers.get('Origin');if(!origin||origin!==new URL(req.url).origin||req.headers.get('X-Requested-With')!=='SchwyzPortal')return json({error:'Ungültiger Zugriff. Bitte die Seite neu laden.'},403);}
 let data:any={};if(write&&req.method!=='DELETE'){const raw=await req.text();if(raw.length>16000)return json({error:'Die Eingabe ist zu gross.'},413);try{data=JSON.parse(raw)}catch{return json({error:'Ungültige Eingabe.'},400)}}
 const now=Date.now();const owner=identity.userId;
 if((path==='register'||path==='login')&&req.method==='POST'){
  await db.prepare('INSERT INTO auth_attempts(owner,count,window) VALUES(?,1,?) ON CONFLICT(owner) DO UPDATE SET count=CASE WHEN window<? THEN 1 ELSE count+1 END, window=CASE WHEN window<? THEN excluded.window ELSE window END').bind(owner,now,now-60000,now-60000).run();
  const rate:any=await db.prepare('SELECT count FROM auth_attempts WHERE owner=?').bind(owner).first();if(rate.count>12)return json({error:'Zu viele Versuche. Bitte warten Sie eine Minute.'},429);
  const email=typeof data.email==='string'?data.email.trim().toLowerCase():'';const password=typeof data.password==='string'?data.password:'';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||password.length<12||password.length>128)return json({error:'Geben Sie eine gültige E-Mail und ein Passwort mit 12–128 Zeichen ein.'},400);
  let account:any=await db.prepare('SELECT * FROM accounts WHERE owner=? AND email=?').bind(owner,email).first();
  if(path==='register'){
   if(account)return json({error:'Dieses Konto besteht bereits. Bitte anmelden.'},409);
   if(data.consent!==true)return json({error:'Bitte bestätigen Sie die Speicherung Ihres Profils und Ihrer Entwürfe.'},400);
   const salt=hex(crypto.getRandomValues(new Uint8Array(32)));const hash=await passwordHash(password,salt);const id=crypto.randomUUID();
   const profile=clean(data.profile,profileKeys);profile.email=email;
   await db.prepare('INSERT INTO accounts(id,owner,email,salt,password_hash,profile,created) VALUES(?,?,?,?,?,?,?)').bind(id,owner,email,salt,hash,JSON.stringify(profile),now).run();
   account={id,email,profile:JSON.stringify(profile)};
  }else{
   const candidate=await passwordHash(password,account?.salt||'dummy-salt-for-unknown-account');
   if(!account||!equal(candidate,account.password_hash))return json({error:'E-Mail oder Passwort stimmt nicht.'},401);
  }
  const token=hex(crypto.getRandomValues(new Uint8Array(32)));await db.batch([db.prepare('DELETE FROM sessions WHERE expires<?').bind(now),db.prepare('INSERT INTO sessions(token_hash,account_id,expires) VALUES(?,?,?)').bind(await digest(token),account.id,now+604800000)]);
  return json({user:{email:account.email,profile:JSON.parse(account.profile)}},200,cookie(req,token));
 }
 const token=req.headers.get('Cookie')?.match(/(?:^|;\s*)sz_session=([a-f0-9]{64})(?:;|$)/)?.[1];
 const tokenHash=token?await digest(token):'';
 const account:any=token?await db.prepare('SELECT a.id,a.email,a.profile FROM sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.expires>? AND a.owner=?').bind(tokenHash,now,owner).first():null;
 if(path==='me'&&req.method==='GET')return json({user:account?{email:account.email,profile:JSON.parse(account.profile)}:null});
 if(!account)return json({error:'Bitte melden Sie sich an, um Ihre Angaben zu speichern.'},401);
 if(path==='logout'&&req.method==='POST'){await db.prepare('DELETE FROM sessions WHERE token_hash=?').bind(tokenHash).run();return json({ok:true},200,cookie(req,'',0));}
 if(path==='profile'&&req.method==='PUT'){const profile=clean(data.profile,profileKeys);await db.prepare('UPDATE accounts SET profile=? WHERE id=? AND owner=?').bind(JSON.stringify(profile),account.id,owner).run();return json({profile});}
 if(path==='drafts'&&req.method==='GET'){const result=await db.prepare('SELECT id,service,step,answers,updated,status FROM drafts WHERE account_id=? ORDER BY updated DESC').bind(account.id).all();return json({drafts:result.results.map((r:any)=>({...r,answers:JSON.parse(r.answers)}))});}
 if(path==='drafts'&&req.method==='PUT'){
  if(![0,1,5,17].includes(data.service)||!Number.isInteger(data.step)||data.step<0||data.step>3)return json({error:'Ungültiger Entwurf.'},400);
  const answers=clean(data.answers,answerKeys);const id=crypto.randomUUID();const status=data.status==='complete'?'complete':'draft';
  await db.prepare('INSERT INTO drafts(id,account_id,service,step,answers,updated,status) VALUES(?,?,?,?,?,?,?) ON CONFLICT(account_id,service) DO UPDATE SET step=excluded.step,answers=excluded.answers,updated=excluded.updated,status=excluded.status').bind(id,account.id,data.service,data.step,JSON.stringify(answers),now,status).run();return json({saved:true,updated:now});
 }
 if(path.startsWith('drafts/')&&req.method==='DELETE'){const id=decodeURIComponent(path.slice(7));await db.prepare('DELETE FROM drafts WHERE id=? AND account_id=?').bind(id,account.id).run();return json({ok:true});}
 return json({error:'Nicht gefunden.'},404);
}
async function safe(req:Request){try{return await handler(req)}catch(err){console.error('Portal API failed',err instanceof Error?err.name:'Unknown');return json({error:'Die Aktion ist fehlgeschlagen. Bitte versuchen Sie es erneut.'},500)}}
export const GET=safe;export const POST=safe;export const PUT=safe;export const DELETE=safe;
