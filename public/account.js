'use strict';
let portalUser=null,portalDrafts=[],draftTimer=null,saveChain=Promise.resolve(),wizardOpen=false,accountReady=false;
const resumeTop=document.createElement('button');resumeTop.id='resume-top';resumeTop.type='button';resumeTop.className='resume-top';resumeTop.hidden=true;$('#account').after(resumeTop);
resumeTop.onclick=()=>{const drafts=portalDrafts.filter(d=>d.status==='draft');if(drafts.length===1)resumeDraft(drafts[0].service);else accountDashboard()};
const profileLabels={vorname:'Vorname',nachname:'Nachname',adresse:'Strasse und Hausnummer',plz:'Postleitzahl',ort:'Ort',email:'Kontakt-E-Mail',telefon:'Telefon',gemeinde:'Gemeinde'};
const savedAnswerLabels={...profileLabels,dokument:'Gewünschtes Dokument',sprache:'Sprache',zweck:'Zusätzliche Hinweise',hund:'Name des Hundes',chip:'Mikrochip-Nummer',amicus:'AMICUS Personen-ID',ereignis:'Datum',grund:'Grund der Abmeldung',neuehalter:'AMICUS-Nummer der neuen Halterperson',neuadresse:'Neue Wohnadresse',rechnung:'Rechnungsreferenz',betrag:'Offener Rechnungsbetrag in CHF',rate:'Vorgeschlagener Teilbetrag in CHF',beginn:'Gewünschter Beginn',begruendung:'Begründung'};
function savedAnswerRows(d){
 const labels={...savedAnswerLabels,...Object.fromEntries((localFlowFields[d.service]||[]).map(([id,label])=>[id,label]))};
 return Object.entries(d.answers||{}).filter(([key,value])=>key!=='testhinweis'&&value).map(([key,value])=>`<dt>${escapeHTML(labels[key]||key)}</dt><dd>${escapeHTML(value)}</dd>`).join('');
}
async function portalAPI(path,method='GET',body,keepalive=false){const res=await fetch('/api/'+path,{method,credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json','X-Requested-With':'SchwyzPortal'},...(body===undefined?{}:{body:JSON.stringify(body)}),keepalive});let data;try{data=await res.json()}catch{throw Error('Die Verbindung ist unterbrochen. Bitte später erneut versuchen.')}if(res.status===401&&portalUser){portalUser=null;portalDrafts=[];accountLabel();updateResumeBanner();if(wizardOpen)renderSaveStrip()}if(!res.ok)throw Error(data.error||'Speichern nicht möglich.');return data}
function accountLabel(){$('#account').innerHTML=portalUser?`<span aria-hidden="true">♙</span> ${escapeHTML(portalUser.profile.vorname||'Mein Konto')} <span class="signed-dot" aria-label="Angemeldet"></span>`:'<span aria-hidden="true">♙</span> Anmelden / Registrieren';}
function accountInput(id,label,type='text',value='',required=false){return `<div class="field"><label for="acc-${id}">${label}${required?' *':' (freiwillig)'}</label><input id="acc-${id}" name="${id}" type="${type}" ${required?'required':''} maxlength="${type==='password'?128:254}" ${type==='password'?'minlength="12" autocomplete="current-password"':`autocomplete="${({email:'email',vorname:'given-name',nachname:'family-name',adresse:'street-address',plz:'postal-code',ort:'address-level2',telefon:'tel'})[id]||'off'}"`} value="${escapeHTML(value)}"></div>`}
function authScreen(register=false,after){wizardOpen=false;show(`<div class="account-tabs"><button class="${register?'':'selected'}" id="tab-login">Anmelden</button><button class="${register?'selected':''}" id="tab-register">Registrieren</button></div><h2 id="dialog-title">${register?'Ihr persönlicher Onlineschalter':'Willkommen zurück.'}</h2><p>${register?'Einmal Angaben hinterlegen. Formulare schneller ausfüllen und angefangene Anliegen später fortsetzen.':'Melden Sie sich an, um Ihr Profil und Ihre gespeicherten Anliegen zu öffnen.'}</p><form id="auth-form">${register?'<div class=two-fields>'+accountInput('vorname','Vorname','text','',true)+accountInput('nachname','Nachname','text','',true)+'</div>':''}${accountInput('email','E-Mail','email','',true)}${accountInput('password','Passwort','password','',true)}<small class="muted">Mindestens 12 Zeichen. Die E-Mail dient als Kontoname; es wird keine Bestätigungs-E-Mail versandt.</small>${register?`<label class="consent"><input type="checkbox" name="consent" required> Ich möchte mein Profil und meine Entwürfe in diesem privaten Prototyp speichern. Ich verwende ausschliesslich Testdaten.</label>${accountInput('repeat','Passwort wiederholen','password','',true)}`:''}<p class="form-error" role="alert" id="auth-error"></p><button class="primary wide" type="submit">${register?'Konto erstellen':'Anmelden'} →</button></form>`,'MEIN KONTO');
 $('#tab-login').onclick=()=>authScreen(false,after);$('#tab-register').onclick=()=>authScreen(true,after);
 if(register){$('#acc-password').autocomplete='new-password';$('#acc-repeat').autocomplete='new-password'}
 $('#auth-form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget;const data=Object.fromEntries(new FormData(form));$('#auth-error').textContent='';if(register&&data.password!==data.repeat){$('#auth-error').textContent='Die Passwörter stimmen nicht überein.';return}const btn=form.querySelector('button[type=submit]');btn.disabled=true;try{const result=await portalAPI(register?'register':'login','POST',{email:data.email,password:data.password,consent:data.consent==='on',profile:{vorname:(data.vorname||'').trim(),nachname:(data.nachname||'').trim()}});portalUser=result.user;accountLabel();await refreshDrafts();if(after)after();else accountDashboard()}catch(err){$('#auth-error').textContent=err.message;btn.disabled=false}};
}
async function refreshDrafts(){if(portalUser)portalDrafts=(await portalAPI('drafts')).drafts;else portalDrafts=[];updateResumeBanner()}
function updateResumeBanner(){let el=$('#resume-banner');const drafts=portalUser?portalDrafts.filter(d=>d.status==='draft'):[];resumeTop.hidden=!drafts.length;$('.header').classList.toggle('has-resume',!!drafts.length);if(!drafts.length){if(el)el.remove();return}const n=drafts.length;resumeTop.textContent=n===1?'Fortsetzen →':`Fortsetzen (${n}) →`;resumeTop.setAttribute('aria-label',n===1?`Entwurf «${services[drafts[0].service]?.title||'Anliegen'}» fortsetzen`:`${n} gespeicherte Entwürfe öffnen`);if(!el){el=document.createElement('section');el.id='resume-banner';el.className='wrap resume-banner';$('.municipality-bar').after(el)}el.innerHTML=`<div><strong>Willkommen zurück${portalUser.profile.vorname?', '+escapeHTML(portalUser.profile.vorname):''}.</strong><p>${n} ${n===1?'Anliegen wartet':'Anliegen warten'} auf Sie. Machen Sie dort weiter, wo Sie aufgehört haben.</p></div><button class="primary" id="resume-dashboard">Meine Anliegen →</button>`;$('#resume-dashboard').onclick=accountDashboard;}
function savedAccountCard(d){
 const sent=d.status==='complete';
 const title=escapeHTML(services[d.service]?.title||'Anliegen');
 const timestamp=new Date(d.updated).toLocaleString('de-CH');
 return `<article class="saved-item"><div><span class="tag ${sent?'processing':''}">${sent?'In Bearbeitung (Demo)':`Entwurf · Schritt ${d.step+1} von 4`}</span><h3>${title}</h3><small>${sent?'Beispiel gesendet':'Gespeichert'} am ${timestamp}</small></div><div class="saved-actions"><button class="primary" data-resume="${d.service}">${sent?'Angaben ansehen':'Fortsetzen'} →</button><button class="delete-draft" data-delete="${escapeHTML(d.id)}">Löschen</button></div></article>`;
}
async function accountDashboard(){
 wizardOpen=false;
 try{await saveChain;await refreshDrafts()}
 catch(err){show(`<h2 id="dialog-title">Mein Konto</h2><p class="form-error">${escapeHTML(err.message)}</p><button class="primary" id="retry-account">Erneut versuchen</button>`);$('#retry-account').onclick=accountDashboard;return}
 const profile=portalUser.profile;
 const sent=portalDrafts.filter(d=>d.status==='complete');
 const open=portalDrafts.filter(d=>d.status!=='complete');
 const savedContent=portalDrafts.length
  ?`${sent.length?`<section class="account-section"><h3>Gesendete Beispiele</h3><p class="muted">Status «In Bearbeitung» ist Teil der Demo. Keine Behörde hat diese Angaben erhalten oder bearbeitet.</p>${sent.map(savedAccountCard).join('')}</section>`:''}${open.length?`<section class="account-section"><h3>Angefangene Anliegen</h3>${open.map(savedAccountCard).join('')}</section>`:''}`
  :`<div class="empty-account"><span aria-hidden="true">▤</span><h3>Noch keine Anliegen gespeichert.</h3><p>Starten Sie eine Dienstleistung auf dieser Website. Ihr Fortschritt erscheint anschliessend hier.</p><button class="primary" id="browse-services">Dienstleistungen entdecken →</button></div>`;
 show(`<div class="dashboard-heading"><div><span class="tag">Angemeldet</span><h2 id="dialog-title">Guten Tag${profile.vorname?', '+escapeHTML(profile.vorname):''}.</h2><p>${escapeHTML(portalUser.email)}</p></div><button class="secondary" id="logout">Abmelden</button></div><div class="account-tabs"><button class="selected" id="tab-drafts">Meine Anliegen</button><button id="tab-profile">Mein Profil</button></div><p>Entwürfe werden automatisch gespeichert. Abgeschlossene Beispiele und ihre Testangaben können Sie hier wieder ansehen.</p><div class="saved-list">${savedContent}</div><div class="profile-callout"><strong>Weniger tippen beim nächsten Mal.</strong><p>Hinterlegen Sie Ihre Kontaktangaben im Profil. Neue Formulare werden damit automatisch ausgefüllt.</p><button class="text-link" id="edit-profile">Profil bearbeiten →</button></div>`,'MEIN KONTO');
 $('#tab-profile').onclick=editProfile;$('#tab-drafts').onclick=accountDashboard;$('#edit-profile').onclick=editProfile;
 if($('#browse-services'))$('#browse-services').onclick=()=>{close();$('#dienstleistungen').scrollIntoView()};
 $('#logout').onclick=async()=>{try{await saveChain;await portalAPI('logout','POST',{});portalUser=null;portalDrafts=[];accountLabel();updateResumeBanner();authScreen()}catch(err){show(`<h2 id="dialog-title">Abmelden nicht möglich</h2><p>${escapeHTML(err.message)}</p>`)}};
 document.querySelectorAll('[data-resume]').forEach(b=>b.onclick=()=>resumeDraft(+b.dataset.resume));
 document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>confirmDelete(b.dataset.delete));
}
function confirmDelete(id){
 const d=portalDrafts.find(x=>x.id===id);
 if(!d)return accountDashboard();
 const sent=d.status==='complete';
 show(`<h2 id="dialog-title">${sent?'Gesendetes Beispiel':'Entwurf'} löschen?</h2><p>Die gespeicherten Testangaben für «${escapeHTML(services[d.service].title)}» werden aus Ihrem Konto entfernt. Ihr Profil bleibt erhalten.</p><div class="actions"><button class="secondary" id="cancel-delete">Zurück</button><button class="primary" id="confirm-delete">${sent?'Beispiel':'Entwurf'} löschen</button></div><p id="delete-error" class="form-error" role="alert"></p>`,'MEINE ANLIEGEN');
 $('#cancel-delete').onclick=accountDashboard;
 $('#confirm-delete').onclick=async()=>{try{await portalAPI('drafts/'+encodeURIComponent(id),'DELETE');accountDashboard()}catch(err){$('#delete-error').textContent=err.message}};
}
function editProfile(){wizardOpen=false;const p=portalUser.profile;show(`<h2 id="dialog-title">Mein Profil</h2><p>Diese Angaben füllen neue Formulare automatisch aus. Bereits angefangene Entwürfe behalten Ihre dort gemachten Angaben.</p><form id="profile-form"><div class="two-fields">${accountInput('vorname','Vorname','text',p.vorname||'')}${accountInput('nachname','Nachname','text',p.nachname||'')}</div>${accountInput('adresse','Strasse und Hausnummer','text',p.adresse||'')}<div class="two-fields">${accountInput('plz','Postleitzahl','text',p.plz||'')}${accountInput('ort','Ort','text',p.ort||'')}</div>${accountInput('email','Kontakt-E-Mail','email',p.email||portalUser.email)}${accountInput('telefon','Telefon','tel',p.telefon||'')}<div class="field"><label for="profile-gemeinde">Gemeinde (freiwillig)</label><select name="gemeinde" id="profile-gemeinde"><option value="">Bitte auswählen</option>${municipalities.map(m=>`<option ${p.gemeinde===m?'selected':''}>${m}</option>`).join('')}</select></div><p class="muted">Die Kontakt-E-Mail ändert Ihren Kontonamen nicht. Bitte nur erfundene Testdaten speichern.</p><p class="form-error" id="profile-error" role="alert"></p><div class="actions"><button class="secondary" type="button" id="profile-back">← Meine Anliegen</button><button class="primary" type="submit">Profil speichern</button></div></form>`,'MEIN PROFIL');$('#profile-back').onclick=accountDashboard;$('#profile-form').onsubmit=async e=>{e.preventDefault();const btn=e.currentTarget.querySelector('button[type=submit]');btn.disabled=true;try{const result=await portalAPI('profile','PUT',{profile:Object.fromEntries(new FormData(e.currentTarget))});portalUser.profile=result.profile;accountLabel();accountDashboard()}catch(err){$('#profile-error').textContent=err.message;btn.disabled=false}};}
function showSaveStatus(text,error=false){const el=$('#save-status');if(el){el.textContent=text;el.classList.toggle('error',error)}}
function queueSave(status='draft',keepalive=false){clearTimeout(draftTimer);if(!portalUser||!current||!wizardOpen)return Promise.resolve();capture();const payload={service:current.id,step,answers:{...answers},status};showSaveStatus('Wird gespeichert …');saveChain=saveChain.catch(()=>{}).then(async()=>{try{const r=await portalAPI('drafts','PUT',payload,keepalive);showSaveStatus('✓ Im Konto gespeichert · '+new Date(r.updated).toLocaleTimeString('de-CH',{hour:'2-digit',minute:'2-digit'}));const old=portalDrafts.find(d=>d.service===payload.service);if(old)Object.assign(old,payload,{updated:r.updated});else portalDrafts.push({...payload,updated:r.updated});updateResumeBanner()}catch(err){showSaveStatus('Nicht gespeichert: '+err.message,true);throw err}});saveChain.catch(()=>{});return saveChain}
const baseWizard=wizard;
function renderSaveStrip(note=$('.save-strip')){if(!note)return;note.innerHTML=portalUser?`<span aria-hidden="true">☁</span><span id="save-status" role="status">Ihre Änderungen werden automatisch gespeichert.</span><button type="button" id="save-exit">Speichern & später fortsetzen</button>`:`<span id="save-status" role="status">Sie sind nicht angemeldet. Dieser Entwurf wird noch nicht gespeichert.</span><button type="button" id="save-login">Anmelden / Registrieren</button>`;
 if($('#save-exit'))$('#save-exit').onclick=async()=>{capture();try{await queueSave();wizardOpen=false;accountDashboard()}catch{}};
 if($('#save-login'))$('#save-login').onclick=()=>{capture();const snapshot={service:current.id,step,answers:{...answers}};wizardOpen=false;authScreen(false,()=>{current=services[snapshot.service];step=snapshot.step;answers={...portalUser.profile,...snapshot.answers};wizard();queueSave()})};
}
wizard=function(){wizardOpen=true;baseWizard();const form=$('#wizard');const note=document.createElement('div');note.className='save-strip';form.before(note);renderSaveStrip(note);
 form.addEventListener('input',()=>{capture();showSaveStatus('Änderungen noch nicht gespeichert …');clearTimeout(draftTimer);draftTimer=setTimeout(()=>queueSave(),650)});form.addEventListener('change',()=>{capture();queueSave()});if(portalUser)queueSave();
};
async function resumeDraft(id){
 try{
  await saveChain;
  await refreshDrafts();
  const d=portalDrafts.find(x=>x.service===id);
  if(!d)return accountDashboard();
  current=services[id];answers={...d.answers};step=d.step;
  if(d.status==='complete'){
   wizardOpen=false;
   const rows=savedAnswerRows(d);
   show(`<span class="tag processing">In Bearbeitung (Demo)</span><h2 id="dialog-title">${escapeHTML(current.title)}</h2><p>Beispiel gesendet am ${new Date(d.updated).toLocaleString('de-CH')}.</p><p>Dieser Status zeigt nur den Ablauf im Prototyp. Ihre Testangaben wurden nicht an eine Behörde geschickt.</p><h3>Ihre gespeicherten Testangaben</h3>${rows?`<dl class="review">${rows}</dl>`:'<p>Für dieses Beispiel sind keine Angaben gespeichert.</p>'}<div class="actions"><button class="secondary" id="completed-back">← Meine Anliegen</button></div>`,'MEINE ANLIEGEN');
   $('#completed-back').onclick=accountDashboard;
   return;
  }
  wizard();
 }catch(err){show(`<h2 id="dialog-title">Entwurf nicht verfügbar</h2><p>${escapeHTML(err.message)}</p>`)}
}
async function beginFlow(){try{if(!accountReady)await loadAccount();if(portalUser){await refreshDrafts();const d=portalDrafts.find(x=>x.service===current.id);if(d){show(`<h2 id="dialog-title">Hier können Sie weitermachen.</h2><p>Zu «${escapeHTML(current.title)}» haben Sie bereits ${d.status==='complete'?'ein gesendetes Beispiel':'einen Entwurf'} gespeichert.</p><div class="actions"><button class="primary" id="continue-draft">Gespeicherten Stand öffnen →</button><button class="secondary" id="new-draft">Neu beginnen</button></div><p class="muted">«Neu beginnen» ersetzt den bisherigen Stand dieser Dienstleistung.</p>`,'GESPEICHERTES ANLIEGEN');$('#continue-draft').onclick=()=>resumeDraft(current.id);$('#new-draft').onclick=startFresh;return}}startFresh()}catch(err){show(`<h2 id="dialog-title">Konto momentan nicht erreichbar</h2><p>${escapeHTML(err.message)}</p><button class="secondary" id="guest-start">Ohne Speichern weiter</button>`);$('#guest-start').onclick=()=>{portalUser=null;startFresh()}}}
function startFresh(){answers={...(portalUser?.profile||{}),gemeinde:$('#municipality').value||portalUser?.profile.gemeinde||''};step=0;wizard()}
document.addEventListener('click',e=>{if(e.target.closest('#start-demo')){e.preventDefault();e.stopImmediatePropagation();beginFlow()}},true);
const baseClose=close;
close=function(){if(wizardOpen&&portalUser){queueSave().then(()=>{wizardOpen=false;baseClose()}).catch(()=>{})}else{wizardOpen=false;baseClose()}};
$('.close').onclick=()=>close();
window.addEventListener('pagehide',()=>{if(wizardOpen&&portalUser){capture();clearTimeout(draftTimer);fetch('/api/drafts',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json','X-Requested-With':'SchwyzPortal'},body:JSON.stringify({service:current.id,step,answers,status:'draft'}),keepalive:true}).catch(()=>{})}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&wizardOpen)queueSave('draft',true)});
function persistCompleted(snapshot){
 clearTimeout(draftTimer);
 saveChain=saveChain.catch(()=>{}).then(async()=>{
  const result=await portalAPI('drafts','PUT',{service:snapshot.service,step:3,answers:snapshot.answers,status:'complete'},true);
  await refreshDrafts();
  return result;
 });
 return saveChain;
}
const baseShow=show;
show=function(content,kicker){
 if(kicker==='DEMO ABGESCHLOSSEN'){
  clearTimeout(draftTimer);
  const snapshot={service:current.id,answers:{...answers}};
  wizardOpen=false;
  content=content.replace('Ihre Testangaben werden beim Schliessen verworfen.',portalUser?'Ihre Testangaben werden nur in Ihrem Demo-Konto gespeichert.':'Ohne Konto werden Ihre Testangaben beim Schliessen verworfen.');
  baseShow(content,kicker);
  const actions=$('#dialog-content .actions');
  const status=document.createElement('p');
  status.id='completion-save-status';
  status.className='muted';
  status.setAttribute('role','status');
  actions.after(status);
  const accountButton=document.createElement('button');
  accountButton.type='button';
  accountButton.className='primary';
  actions.prepend(accountButton);
  if(portalUser){
   accountButton.textContent='Im Konto ansehen →';
   accountButton.disabled=true;
   const save=()=>{
    status.textContent='Testangaben werden im Konto gespeichert …';
    persistCompleted(snapshot).then(()=>{
     status.textContent='Im Konto gespeichert · Status: In Bearbeitung (Demo).';
     accountButton.textContent='Im Konto ansehen →';
     accountButton.disabled=false;
     accountButton.onclick=accountDashboard;
    }).catch(err=>{
     status.textContent='Speichern fehlgeschlagen: '+err.message;
     accountButton.textContent='Erneut speichern';
     accountButton.disabled=false;
     accountButton.onclick=()=>{accountButton.disabled=true;save()};
    });
   };
   save();
  }else{
   accountButton.textContent='Anmelden und im Konto speichern →';
   status.textContent='Melden Sie sich an, damit dieses Beispiel später im Konto sichtbar bleibt.';
   accountButton.onclick=()=>authScreen(false,async()=>{
    const saveAfterLogin=async()=>{
     try{await persistCompleted(snapshot);accountDashboard()}
     catch(err){
      show(`<h2 id="dialog-title">Beispiel noch nicht gespeichert</h2><p class="form-error">${escapeHTML(err.message)}</p><button class="primary" id="retry-complete">Erneut speichern</button>`,'MEIN KONTO');
      $('#retry-complete').onclick=saveAfterLogin;
     }
    };
    await saveAfterLogin();
   });
  }
  return;
 }
 baseShow(content,kicker);
 if(kicker==='DIENSTLEISTUNG'||kicker===undefined){
  const start=$('#start-demo');
  if(start&&current){
   const intro=document.createElement('div');
   intro.innerHTML=requirementsFor(current);
   start.closest('.actions').before(intro);
  }
 }
};
function requirementsFor(s){const r=serviceGuides[s.id];if(!r)return '';return `<section class="requirements"><h3>Gut vorbereitet: ${s.type==='dog'?'Hund anmelden':s.title}</h3><div class="requirements-block"><h4>Das sollten Sie bereithalten</h4><ul>${r.need.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></div><div class="requirements-block"><h4>So geht es danach weiter</h4><p>${escapeHTML(r.next)}</p></div><small>${r.verified?'Grundlage: Angaben der amtlichen Detailseite. Die aktuelle Fassung ist massgebend.':'Vorbereitungscheckliste zur Orientierung. Die verbindlichen Pflichtunterlagen, Kosten und Fristen müssen Sie beim zuständigen Angebot prüfen.'}</small></section>`}
const baseDetail=detail;detail=function(s){wizardOpen=false;baseDetail(s);if(!['residence','dog','firstdog','dogoff'].includes(s.type)){const block=document.createElement('div');block.innerHTML=requirementsFor(s);const actions=$('#dialog-content .actions');if(actions)actions.before(block)}};
const serviceGuides={
 0:{verified:true,need:['Gemeinde Ihres aktuellen oder früheren Wohnsitzes.','Vollständiger Name, Adresse und Kontaktangaben.','Gewünschte Sprache und Einzel- oder Familienbestätigung.','Falls benötigt: Verwendungszweck für SBB- oder Ski-Abo.','Für die echte Bestellung: Zahlungsmittel gemäss offiziellem Formular.'],next:'Das Einwohneramt bearbeitet die Bestellung und stellt die Bestätigung über die gewählte Lieferart zu. Die offizielle Bearbeitungsdauer beträgt 2–3 Arbeitstage.'},
 1:{verified:true,need:['Persönliche AMICUS Personen-ID: Ihre Nummer im nationalen Hunderegister.','Kopie des Hundepasses oder Impfausweises mit aktueller Mikrochip-Nummer.','Ihre Wohn- und Kontaktangaben sowie Angaben zum Hund.','Falls zutreffend: Nachweis für Steuerbefreiung oder reduzierte Hundesteuer.','Bei Ersthaltung: zuerst bei der Gemeinde als Hundehalter/-in registrieren.'],next:'Nach der echten Anmeldung erhalten Sie eine Bestätigung. Ihre Gemeinde erfasst den Hund in der Hundekontrolle. Ein neuer Hund oder ein Hund aus dem Ausland muss zusätzlich von einer Tierärztin oder einem Tierarzt im nationalen Register erfasst werden.'},
 2:{need:['Steuerjahr und bisherige Einreichefrist.','Ihre Steuer- oder Personenreferenz aus dem Schreiben der Steuerverwaltung.','Gewünschtes neues Einreichdatum.'],next:'Prüfen Sie im zuständigen Steuerportal, ob und bis wann eine Fristverlängerung möglich ist. Bewahren Sie dessen Bestätigung auf.'},
 3:{need:['Bisherige und neue Wohnadresse sowie Umzugsdatum.','Angaben zu den mitziehenden Personen.','Allfällige Identitäts- und Aufenthaltsdokumente gemäss eUmzug.'],next:'Im externen Umzugsportal prüfen Sie die Teilnahme Ihrer Gemeinden und schliessen die Meldung ab. Weitere Nachweise richten sich nach Ihrer Situation.'},
 4:{need:['Bisherige Identitätskarte oder bisherigen Pass, sofern vorhanden.','Angaben zur antragstellenden Person.','Bei Verlust oder Minderjährigen: Vorgaben der Ausweisstelle vorher prüfen.'],next:'Das zuständige Angebot führt Sie zur Bestellung oder Terminvereinbarung. Foto, persönliche Vorsprache und Unterlagen richten sich nach der Art des Ausweises.'},
 5:{verified:true,need:['Wohnsitz in einer Schwyzer Gemeinde und Ihre Personalien.','Prüfen Sie, ob bereits eine persönliche AMICUS Personen-ID vorhanden ist.','Hundepass oder Impfausweis mit Mikrochip-Nummer kann optional mitgegeben werden.','Falls zutreffend: Nachweis für eine ermässigte oder entfallende Hundesteuer.'],next:'Die Gemeinde legt Ihre Registrierung in AMICUS an. Nach Abschluss werden die Zugangsdaten laut offizieller Beschreibung per E-Mail zugestellt. Personen unter 16 Jahren benötigen eine gesetzliche Vertretung.'},
 6:{need:['Name und möglichst genaue weitere Angaben zur gesuchten Person.','Ihre Kontaktangaben und nachvollziehbarer Grund der Auskunft.'],next:'Die zuständige Stelle prüft, ob die Auskunft erteilt werden darf. Zulässigkeit, Gebühren und erforderliche Angaben stehen im offiziellen Angebot.'},
 7:{need:['Beschreibung Ihres Projekts und seiner Ziele.','Budget, Finanzierungsplan und Angaben zur Trägerschaft.','Zeitplan und allfällige weitere Beilagen gemäss Förderkriterien.'],next:'Prüfen Sie vor dem Start Förderberechtigung, Einreichfrist und verlangte Beilagen. Die zuständige Stelle beurteilt das Gesuch.'},
 8:{need:['Personalien und Wohnadresse.','Zeitraum und Zweck der benötigten Bestätigung.','Kontaktangaben für Rückfragen.'],next:'Die zuständige Stelle prüft Ihren Wunsch und nennt die für Ihre Situation erforderlichen Nachweise.'},
 9:{need:['Beschreibung des Vorfalls mit Datum und betroffenen Diensten.','Vorhandene Belege, beispielsweise Nachrichten oder Transaktionsreferenzen.'],next:'Das externe Polizeiangebot erklärt, welche Vorfälle online gemeldet werden können und ob weitere Schritte nötig sind.'},
 10:{need:['Zeit und Ort des Vorfalls.','Beschreibung der gestohlenen Gegenstände und vorhandene Belege.'],next:'Das zuständige Polizeiangebot prüft die Online-Meldung und informiert über mögliche weitere Schritte.'},
 11:{need:['Steuerrechnung mit Referenznummer.','Offener Betrag und Vorschlag für die Raten.','Angaben zu Ihrer finanziellen Situation, falls verlangt.'],next:'Die zuständige Stelle prüft Ihren Zahlungsvorschlag. Ein Gesuch bedeutet noch keine Bewilligung.'},
 12:{need:['Steuerrechnung mit Referenznummer und Fälligkeit.','Gewünschtes Zahlungsdatum und Begründung.'],next:'Die zuständige Stelle entscheidet über das Gesuch. Prüfen Sie die ursprüngliche Zahlungsfrist und mögliche Zinsen im offiziellen Angebot.'},
 13:{need:['Kontrollschildnummer und zugehöriger Kanton.'],next:'Die externe Halterauskunft zeigt, welche Abfragen zulässig und verfügbar sind.'},
 14:{need:['Aufgebot zur Fahrzeugprüfung.','Fahrzeug- oder Terminreferenz aus dem Schreiben.'],next:'Das zuständige Strassenverkehrsangebot zeigt verfügbare Ersatztermine und Bedingungen für die Verschiebung.'},
 15:{verified:true,need:['Standort und Art der natürlichen Wald- oder Feldabfälle.','Warum Lagern oder Abtransport nicht möglich sind.','Angaben zu einer behördlich angeordneten Rodung.'],next:'Dieses Angebot betrifft nur Ausnahmefälle ausserhalb von Anlagen. Das Amt für Landwirtschaft oder das Amt für Wald und Natur prüft das Gesuch. Frühester Beginn ist 3 Arbeitstage nach Einreichung; eine Bewilligung gilt höchstens 30 Tage.'},
 16:{need:['Personalien sowie Wohn- und Aufenthaltsadresse.','Zweck und Zeitraum des Aufenthalts.'],next:'Die Gemeinde prüft die Bestellung und informiert über Bezug, Unterlagen und Gebühren.'},
 17:{verified:true,need:['Ihre AMICUS Personen-ID und Angaben zum Hund.','Grund und Datum der Abmeldung.','Nur bei Übergabe: Personen-ID der neuen Halterin oder des neuen Halters.'],next:'Die amtliche Seite verlangt die Meldung innert 10 Tagen. Für die Abmeldung ist kein Login nötig und es fallen keine Gebühren an. Die Änderung wird in der Hundekontrolle und in AMICUS nachgeführt.'},
 18:{need:['Suchbegriff, Titel oder Name der Autorin beziehungsweise des Autors.','Für Ausleihe oder Reservation allenfalls Ihr Bibliothekskonto.'],next:'Im Bibliothekskatalog sehen Sie Verfügbarkeit, Standorte und mögliche Reservationen.'},
 19:{need:['Angaben zum gewünschten Kontrollschild.','Registrierung und Zahlungsmittel entsprechend den Auktionsbedingungen.'],next:'Lesen Sie Bedingungen, Gebühren und Ablauf im externen Auktionsangebot vor der Teilnahme.'},
 20:{need:['Angaben zum Fahrzeug und zum verlorenen Kontrollschild.','Zeitpunkt und Umstände des Verlusts, soweit bekannt.'],next:'Das zuständige Angebot erklärt die Verlustmeldung und den Ersatz der Kontrollschilder.'},
 21:{need:['Persönliche Dienstunterlagen und Referenzen.','Angaben zum konkreten Anliegen und vorhandene Aufgebote.'],next:'Im zuständigen Dienstportal finden Sie die passenden Prozesse und erforderlichen Unterlagen.'},
 22:{need:['Bussenmitteilung mit Referenz oder QR-Code.','Ein vom offiziellen Angebot akzeptiertes Zahlungsmittel.'],next:'Vergleichen Sie Betrag und Referenz vor der Zahlung. Zahlungen sind nur im offiziellen Angebot möglich.'},
 23:{need:['Ort oder Postleitzahl Ihres gesuchten Polizeipostens.'],next:'Das externe Verzeichnis zeigt Standorte und Kontaktmöglichkeiten. Prüfen Sie dort die Öffnungszeiten.'},
 24:{need:['Beschreibung der Beschädigung sowie Zeit und Ort.','Fotos oder andere vorhandene Belege und Angaben zur geschädigten Person.'],next:'Das zuständige Polizeiangebot klärt, ob die Meldung online möglich ist und welche weiteren Angaben nötig sind.'},
 25:{need:['Datum, Fahrzweck und Angaben zum Verein oder zur Organisation.','Geplante Strecke sowie Kontaktangaben der verantwortlichen Person.'],next:'Prüfen Sie Verfügbarkeit, Nutzungsbedingungen und erforderliche Berechtigungen bei der zuständigen Stelle.'},
 26:{need:['Angaben zur eigenen Person.','Identitätsnachweis und Zahlungsmittel nach Vorgabe des offiziellen Bestelldienstes.'],next:'Wählen Sie im offiziellen Angebot die passende Auszugsart und prüfen Sie Identifikation, Zustellung und Gebühren.'},
 27:{need:['Angaben zur Person und zur beantragten Führerausweiskategorie.','Zulassungs- oder Prüfungsreferenz, sofern bereits vorhanden.'],next:'Das zuständige Prüfungsportal zeigt Zulassungsvoraussetzungen und verfügbare Termine.'},
 28:{need:['Angaben zu den beteiligten Personen und zur betroffenen Waffe.','Vorhandene Bewilligungen beziehungsweise Vertragsunterlagen.'],next:'Prüfen Sie im offiziellen Angebot, welcher Vorgang für Ihre Situation vorgesehen ist und welche Nachweise verlangt werden.'},
 29:{need:['Veranlagung oder Zahlungsbelege mit Referenz.','Begründung und vorhandene Nachweise zum Rückerstattungsantrag.'],next:'Die zuständige Stelle prüft Anspruch und Nachweise. Verbindliche Voraussetzungen finden Sie im offiziellen Angebot.'},
 30:{need:['Rechnung zur Wehrpflichtersatzabgabe mit Referenznummer.','Gewünschter Ratenplan und Begründung.'],next:'Die zuständige Stelle prüft das Gesuch. Beachten Sie die Zahlungsfrist, solange keine abweichende Bewilligung vorliegt.'}
};
accountInfo=()=>portalUser?accountDashboard():authScreen();$('#account').onclick=accountInfo;$('#account-info').onclick=accountInfo;
$('#privacy').onclick=()=>show(`<h2 id="dialog-title">Ihre gespeicherten Angaben</h2><p>Wenn Sie ein eigenes Konto erstellen, werden Ihr Profil und Ihre Formularentwürfe serverseitig in der privaten Website-Datenbank gespeichert. Beim erneuten Anmelden können Sie diese wieder öffnen, auch auf einem anderen Gerät mit Zugang zu dieser Website.</p><p>Passwörter werden als gesalzene Passwortableitung gespeichert. Die Anmeldung verwendet ein HttpOnly-Sitzungscookie mit einer Gültigkeit von sieben Tagen. Nach dem Abmelden ist die Sitzung ungültig.</p><p>Ihr Profil füllt neue Formulare aus. Einzelne Entwürfe können Sie unter «Meine Anliegen» löschen. Leeren Sie Profilfelder und speichern Sie das Profil, um diese Angaben zu entfernen.</p><p>Es werden keine Anträge an Behörden gesendet. Verwenden Sie im Prototyp ausschliesslich Testdaten. Externe Angebote und Google Fonts haben eigene Datenschutzbestimmungen.</p>`,'DATENSCHUTZ');
document.querySelector('.footer-bottom span:nth-child(2)').textContent='Private Konten & gespeicherte Entwürfe · Keine amtlichen Anträge';
async function loadAccount(){try{const data=await portalAPI('me');portalUser=data.user;accountLabel();if(portalUser)await refreshDrafts()}finally{accountReady=true}}
loadAccount().catch(()=>{accountLabel()});
