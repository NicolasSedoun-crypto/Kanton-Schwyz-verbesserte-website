'use strict';
const original='https://onlineschalter.sz.ch/Pages/Default.aspx';
const $=s=>document.querySelector(s);
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const topics=[['Wohnen & Umzug','⌂'],['Hund & Tierhaltung','♧'],['Steuern & Finanzen','▤'],['Mobilität','⇄'],['Sicherheit & Justiz','♜'],['Weitere Angebote','▦']];
const rows=[
['Wohnsitzbestätigung bestellen',0,'Bestätigung Ihres aktuellen oder früheren Wohnsitzes.','47','residence','Ab CHF 10 · 2–3 Arbeitstage'],
['Hund anmelden',1,'Einen neuen Hund oder einen Zuzug mit Hund melden.','45','dog','Anmeldung kostenlos'],
['Fristverlängerung für Steuererklärung beantragen',2,'Mehr Zeit für Ihre Steuererklärung beantragen.','','','Fristen & Steuern'],
['Umzug melden',0,'Ihren Wohnortswechsel online melden.','','external','eUmzug · Externes Angebot'],
['Identitätskarte / Schweizerpass bestellen',0,'Ein neues Schweizer Ausweisdokument beantragen.','','external','Ausweise & Dokumente'],
['Als Ersthundehalter/-in registrieren',1,'Vor dem ersten Hund: Registrierung im Hunderegister.','40','firstdog','Registrierung kostenlos'],
['Adressauskunft bestellen',0,'Eine Adressauskunft bei der zuständigen Stelle anfragen.'],
['Beitrag aus dem Lotteriefonds beantragen',5,'Unterstützung für Ihr Projekt beantragen.'],
['Bestätigung zum Sozialhilfebezug bestellen',0,'Eine Bestätigung zum Bezug von Sozialhilfe anfordern.'],
['Cyberkriminalität anzeigen',4,'Einen Vorfall im Internet der Polizei melden.','','external'],
['Diebstahl anzeigen',4,'Einen Diebstahl online melden.','','external'],
['Direkte Bundessteuer: Ratenzahlung beantragen',2,'Die Zahlung der direkten Bundessteuer aufteilen.'],
['Direkte Bundessteuer: Verlängerung der Zahlungsfrist beantragen',2,'Eine spätere Zahlung der direkten Bundessteuer beantragen.'],
['Fahrzeughalter abfragen',3,'Informationen zur Halterin oder zum Halter abfragen.','','external'],
['Fahrzeugprüfung verschieben',3,'Einen anderen Termin für Ihre Fahrzeugprüfung finden.','','external'],
['Feuerbewilligung beantragen',4,'Eine Bewilligung für ein Feuer beantragen.'],
['Heimatausweis bestellen',0,'Einen Heimatausweis für Ihren Aufenthalt bestellen.'],
['Hund abmelden',1,'Den Wegzug oder die Abmeldung eines Hundes melden.','','dogoff'],
['Katalog der Kantonsbibliothek durchsuchen',5,'Bücher und Medien der Kantonsbibliothek finden.','','external'],
['Kontrollschilder ersteigern',3,'An der Versteigerung von Kontrollschildern teilnehmen.','','external'],
['Kontrollschildverlust anzeigen',3,'Den Verlust eines Kontrollschilds melden.','','external'],
['Militärdienst verwalten',5,'Informationen und Angebote zu Ihrem Militärdienst.','','external'],
['Ordnungsbusse online bezahlen',4,'Ihre Ordnungsbusse online begleichen.','','external'],
['Polizeiposten suchen',4,'Den passenden Polizeiposten finden.','','external'],
['Sachbeschädigung anzeigen',4,'Eine Sachbeschädigung bei der Polizei melden.','','external'],
['Sportbus beantragen',5,'Einen Sportbus für Ihren Anlass beantragen.'],
['Strafregisterauszug bestellen',4,'Einen Auszug aus dem Schweizer Strafregister bestellen.','','external'],
['Theorieprüfungstermin für den Führerausweis festlegen',3,'Einen Termin für Ihre Theorieprüfung vereinbaren.','','external'],
['Waffenerwerb / -übertragung melden',4,'Einen Waffenerwerb oder eine Übertragung melden.','','external'],
['Wehrpflichtersatzabgabe: Rückerstattung beantragen',2,'Eine Rückerstattung der Ersatzabgabe beantragen.'],
['Wehrpflichtersatzabgabe: Ratenzahlung beantragen',2,'Die Ersatzabgabe in mehreren Raten bezahlen.']
];
const services=rows.map((r,i)=>({id:i,title:r[0],topic:r[1],description:r[2],url:r[3]?`https://onlineschalter.sz.ch/Pages/Services/Detail.aspx?id=${r[3]}`:original,type:r[4]||'original',meta:r[5]||topics[r[1]][0]}));
const municipalities=['Alpthal','Altendorf','Arth','Einsiedeln','Feusisberg','Freienbach','Galgenen','Gersau','Illgau','Ingenbohl','Innerthal','Küssnacht','Lachen','Lauerz','Morschach','Muotathal','Oberiberg','Reichenburg','Riemenstalden','Rothenthurm','Sattel','Schübelbach','Schwyz','Steinen','Steinerberg','Tuggen','Unteriberg','Vorderthal','Wangen','Wollerau'];
// The current list of participating municipalities differs per service.
// No unverified municipality is presented as supported by the live system.
$('#municipality').innerHTML+=municipalities.map(m=>`<option>${m}</option>`).join('');
let state={topic:null,filter:'all',limit:6};
$('#topics').innerHTML=topics.map((t,i)=>`<button class="topic" data-topic="${i}" aria-pressed="false"><span class="topic-icon" aria-hidden="true">${t[1]}</span><span>${t[0]}</span></button>`).join('');
const norm=s=>s.toLocaleLowerCase('de-CH').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function render(){
 const query=norm($('#search').value.trim());
 let list=services.filter(s=>(state.topic===null||s.topic===state.topic)&&(state.filter==='all'||(state.filter==='demo'?['residence','dog','firstdog','dogoff'].includes(s.type):s.type==='external'))&&(!query||norm(s.title+' '+s.description+' '+topics[s.topic][0]).includes(query)));
 if($('#sort').value==='az')list.sort((a,b)=>a.title.localeCompare(b.title,'de-CH'));
 $('#results-title').textContent=state.topic===null?'Dienstleistungen im Überblick':topics[state.topic][0];
 $('#result-count').textContent=`${list.length} ${list.length===1?'Dienstleistung':'Dienstleistungen'}`;
 $('#services').innerHTML=list.slice(0,state.limit).map(s=>`<button class="service-card" data-service="${s.id}"><div class="card-top"><span class="card-icon" aria-hidden="true">${topics[s.topic][1]}</span><span class="tag ${s.type==='external'?'external':''}">${['residence','dog','firstdog'].includes(s.type)?'Ohne Konto':s.type==='external'?'Externe Seite ↗':s.type==='dogoff'?'Demo-Ablauf':'Offizielles Angebot ↗'}</span></div><h3>${s.title}</h3><p>${s.description}</p><div class="card-foot"><span>${s.meta}</span><b aria-hidden="true">${s.type==='external'?'↗':'→'}</b></div></button>`).join('');
 $('#empty').hidden=!!list.length;$('#show-more').hidden=list.length<=state.limit;
 document.querySelectorAll('[data-topic]').forEach(b=>{const active=+b.dataset.topic===state.topic;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active)});
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===state.filter;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active)});
}
$('#topics').onclick=e=>{const b=e.target.closest('[data-topic]');if(!b)return;state.topic=state.topic===+b.dataset.topic?null:+b.dataset.topic;state.limit=6;render()};
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;state.limit=6;render()});
$('#search').oninput=()=>{state.limit=6;render()};
$('#search-form').onsubmit=e=>{e.preventDefault();$('#dienstleistungen').scrollIntoView();render()};
document.querySelectorAll('[data-search]').forEach(b=>b.onclick=()=>{$('#search').value=b.dataset.search;state.topic=null;state.filter='all';render();$('#dienstleistungen').scrollIntoView()});
$('#sort').onchange=render;
$('#show-more').onclick=()=>{state.limit=services.length;render()};
$('#reset').onclick=()=>{$('#search').value='';state={topic:null,filter:'all',limit:6};render()};
$('#municipality').onchange=()=>{$('#municipality-note').textContent=$('#municipality').value?`${$('#municipality').value} gewählt. Die Teilnahme ist pro Angebot im offiziellen Formular zu prüfen.`:'Die Verfügbarkeit unterscheidet sich je nach Dienstleistung.'};
const dialog=$('#dialog');let trigger=null;let current=null;let step=0;let answers={};
function show(content,kicker='DIENSTLEISTUNG'){if(!dialog.open)trigger=document.activeElement;$('#dialog-kicker').textContent=kicker;$('#dialog-content').innerHTML=content;if(!dialog.open)dialog.showModal();dialog.scrollTop=0;}
function close(){dialog.close();answers={};if(trigger&&trigger.isConnected)trigger.focus()}
$('.close').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close()});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}});
const originalLink=s=>`<a href="${s.url}" target="_blank" rel="noopener">Offizielles Angebot öffnen ↗</a>`;
function openService(s){current=s;answers={gemeinde:$('#municipality').value};
 if(s.type==='dog'){show(`<h2 id="dialog-title">Ihr Weg zur Hundeanmeldung</h2><p>Die richtige Reihenfolge spart Ihnen einen zusätzlichen Behördengang.</p><h3>Sind Sie bereits in AMICUS registriert?</h3><p>AMICUS ist das nationale Hunderegister. Wenn Sie registriert sind, haben Sie eine persönliche Nummer (Personen-ID).</p><button class="choice" id="dog-yes">Ja, ich habe eine Personen-ID <span>Weiter zur Anmeldung Ihres Hundes →</span></button><button class="choice" id="dog-no">Nein, ich halte zum ersten Mal einen Hund <span>Zuerst als Hundehalterin oder Hundehalter registrieren →</span></button><p>Unsicher? Prüfen Sie Ihre Registrierung auf <a href="https://www.amicus.ch" target="_blank" rel="noopener">amicus.ch ↗</a> oder fragen Sie Ihre Gemeinde.</p>`,'HUND & TIERHALTUNG');$('#dog-yes').onclick=()=>detail(s);$('#dog-no').onclick=()=>detail(services.find(x=>x.type==='firstdog'));return;}
 detail(s);
}
function detail(s){current=s;
 const residence=s.type==='residence',dog=['dog','firstdog','dogoff'].includes(s.type),demo=residence||dog;
 let content=`<h2 id="dialog-title">${s.title}</h2><p>${s.description}</p>`;
 if(residence)content+=`<div class="facts"><div><small>Konto</small><strong>Nicht erforderlich</strong></div><div><small>Kosten</small><strong>Ab CHF 10</strong></div><div><small>Bearbeitung</small><strong>2–3 Arbeitstage</strong></div></div><h3>Was Sie vorher wissen sollten</h3><ul><li>Für Ihren aktuellen oder einen früheren Wohnsitz im Kanton Schwyz.</li><li>Deutsch, Einzelperson: CHF 10; Französisch, Italienisch oder Englisch: CHF 20.</li><li>Familienbestätigung: CHF 20. Versandkosten können hinzukommen.</li></ul><div class="notice">Bei einer notwendigen Archivrecherche können zusätzliche Kosten entstehen. Die offizielle Seite nennt dafür keine feste Preisspanne. Klären Sie den Betrag vorab mit Ihrer Gemeinde.</div>`;
 else if(dog){content+=`<div class="facts"><div><small>Konto</small><strong>${s.type==='dogoff'?'Im Original prüfen':'Nicht erforderlich'}</strong></div><div><small>Kosten</small><strong>${s.type==='dogoff'?'Im Original prüfen':'Registrierung kostenlos'}</strong></div><div><small>Gemeinde</small><strong>Teilnahme prüfen</strong></div></div>`;if(s.type==='dog')content+=`<h3>Das brauchen Sie</h3><ul><li>Ihre Personen-ID im nationalen Hunderegister AMICUS.</li><li>Hundepass oder Impfausweis mit Mikrochip-Nummer.</li><li>Falls zutreffend: Nachweis für eine reduzierte Hundesteuer oder Befreiung.</li></ul><p>Die Anmeldung muss laut offizieller Seite innert 10 Tagen erfolgen. Dort steht als Bearbeitungsdauer «2–3 Tage». Ob Arbeitstage gemeint sind, muss die Gemeinde bestätigen.</p><div class="notice">Die Anmeldung ist kostenlos. Eine jährliche Hundesteuer kann zusätzlich anfallen. Betrag und zuständige Stelle erfahren Sie bei Ihrer Gemeinde.</div>`;else if(s.type==='firstdog')content+=`<h3>Zuerst Ihre persönliche Registrierung</h3><p>Ihre Gemeinde registriert Sie bei AMICUS und stellt Ihre persönliche Nummer aus. Erst danach melden Sie Ihren Hund an.</p><p>Die Erfassung eines neuen Hundes oder eines Hundes aus dem Ausland im nationalen Register erfolgt durch Ihre Tierärztin oder Ihren Tierarzt.</p>`;else content+=`<p>Dieser Beispielablauf zeigt die vereinfachte Abmeldung. Voraussetzungen und zuständige Gemeinde müssen Sie im offiziellen Angebot prüfen.</p>`;}
 else content+=`<h3>Zum zuständigen Angebot</h3><p>Diese Dienstleistung ist im offiziellen Onlineschalter aufgeführt. Dort finden Sie die aktuellen Voraussetzungen, Kosten und Angaben zum Konto.</p><div class="notice">Der Link führt zur offiziellen Dienstleistungsübersicht. Wählen Sie dort «${s.title}».</div>`;
 if(demo)content+=`<h3>Ihre Gemeinde zuerst</h3><p>${answers.gemeinde?`Ausgewählt: <strong>${escapeHTML(answers.gemeinde)}</strong>. `:''}Die teilnehmenden Gemeinden unterscheiden sich je nach Leistung. Die Auswahl im Prototyp bestätigt keine Verfügbarkeit.</p><div class="actions"><button class="primary" id="start-demo">Demo-Ablauf starten →</button>${originalLink(s)}</div><div class="notice">Interaktiver Prototyp: Bitte nur erfundene Testdaten verwenden. Es wird nichts eingereicht oder bezahlt.</div>`;else content+=`<div class="actions">${originalLink(s)}</div>`;
 show(content);if(demo)$('#start-demo').onclick=()=>{step=0;wizard()};
}
function field(id,label,type='text',hint='',required=true,value=''){return `<div class="field"><label for="${id}">${label}${required?' *':' (freiwillig)'}</label>${hint?`<small id="${id}-hint">${hint}</small>`:''}<input id="${id}" name="${id}" type="${type}" ${required?'required':''} ${hint?`aria-describedby="${id}-hint"`:''} value="${escapeHTML(answers[id]??value)}" ${type==='text'?'maxlength="120"':''}></div>`}
function selectField(id,label,options,hint=''){return `<div class="field"><label for="${id}">${label} *</label>${hint?`<small id="${id}-hint">${hint}</small>`:''}<select id="${id}" name="${id}" required ${hint?`aria-describedby="${id}-hint"`:''}><option value="">Bitte auswählen</option>${options.map(v=>`<option ${answers[id]===v?'selected':''}>${escapeHTML(v)}</option>`).join('')}</select></div>`}
function wizard(){const residence=current.type==='residence';const labels=['Gemeinde',residence?'Dokument':'Angaben zum Hund','Personalien','Kontrolle'];let body='';
 if(step===0)body=`<p>Wählen Sie die Gemeinde, in der Sie wohnen${residence?' oder früher gewohnt haben':''}.</p>${selectField('gemeinde','Gemeinde',municipalities)}<div class="notice">Diese Demo bietet alle aufgeführten Gemeinden zur Auswahl. Ob die Leistung dort tatsächlich verfügbar ist, prüfen Sie bitte im offiziellen Angebot. ${originalLink(current)}</div>`;
 if(step===1&&residence)body=selectField('dokument','Welche Bestätigung benötigen Sie?',['Wohnsitzbestätigung – Einzelperson','Wohnsitzbestätigung – Familie','Bestätigung für SBB- oder Ski-Abo'])+selectField('sprache','Sprache',['Deutsch','Französisch','Italienisch','Englisch'])+field('zweck','Zusätzliche Hinweise','text','Nur ausfüllen, wenn Sie uns etwas ergänzend mitteilen möchten.',false)+`<p>Einzelperson auf Deutsch: CHF 10. Andere Sprachen oder Familie: CHF 20. Für die Bestätigung für SBB- oder Ski-Abos muss die Gemeinde den Preis bestätigen. Allfällige Versand- oder Archivkosten kommen hinzu.</p>`;
 if(step===1&&!residence){if(current.type==='firstdog')body=`<p>Sie registrieren sich zuerst als Hundehalterin oder Hundehalter. Angaben zu Ihrem Hund können Sie freiwillig ergänzen.</p>`+field('hund','Name des Hundes','text','Falls Sie bereits einen Hund ausgewählt haben.',false);else body=field('hund','Name des Hundes')+field('chip','Mikrochip-Nummer','text','Die Nummer steht im Hundepass oder Impfausweis.')+field('amicus','Ihre Personen-ID in AMICUS','text','Ihre persönliche Nummer im nationalen Hunderegister.')+field('ereignis',current.type==='dogoff'?'Datum der Abmeldung':'Datum der Übernahme oder des Zuzugs','date');body+=`<div class="notice">Ein benötigter Dokumentenupload wird nur im offiziellen Formular angeboten. Bitte laden Sie hier keine persönlichen Unterlagen hoch.</div>`;}
 if(step===2)body=`<p>Mit * gekennzeichnete Felder sind Pflichtfelder. Verwenden Sie ausschliesslich erfundene Testdaten.</p><div class="two-fields">${field('vorname','Vorname')}${field('nachname','Nachname')}</div>${field('adresse','Strasse und Hausnummer')}<div class="two-fields">${field('plz','Postleitzahl')}${field('ort','Ort')}</div>${field('email','E-Mail','email','In dieser Demo wird keine E-Mail verschickt.')}${field('telefon','Telefon','tel','Nur für mögliche Rückfragen im Beispielablauf.',false)}`;
 if(step===3){const names={gemeinde:'Gemeinde',dokument:'Dokument',sprache:'Sprache',zweck:'Hinweise',hund:'Name des Hundes',chip:'Mikrochip-Nummer',amicus:'AMICUS Personen-ID',ereignis:'Datum',vorname:'Vorname',nachname:'Nachname',adresse:'Adresse',plz:'Postleitzahl',ort:'Ort',email:'E-Mail',telefon:'Telefon'};body=`<p>Prüfen Sie Ihre Testangaben. Über «Zurück» können Sie diese ändern.</p><dl class="review">${Object.entries(answers).filter(([k,v])=>v&&names[k]).map(([k,v])=>`<dt>${names[k]}</dt><dd>${escapeHTML(v)}</dd>`).join('')}</dl><div class="notice">Dies ist eine Vorschau. Mit «Demo abschliessen» wird kein Antrag eingereicht und keine Zahlung ausgelöst.</div>`;}
 show(`<h2 id="dialog-title">${current.title}</h2><div class="progress" aria-label="Schritt ${step+1} von 4">${labels.map((_,i)=>`<span class="${i<=step?'done':''}"></span>`).join('')}</div><div class="step-text">SCHRITT ${step+1} VON 4 · ${labels[step].toUpperCase()}</div><form id="wizard"><h3>${step===3?'Alles richtig?':labels[step]}</h3>${body}<div class="actions"><button type="button" class="secondary" id="back">← Zurück</button><button class="primary" type="submit">${step===3?'Demo abschliessen':'Weiter →'}</button></div></form>`,'DEMO · KEIN ECHTER ANTRAG');
 $('#back').onclick=()=>{capture();if(step>0){step--;wizard()}else detail(current)};
 $('#wizard').onsubmit=e=>{e.preventDefault();capture();if(step<3){step++;wizard()}else{show(`<span class="success-mark" aria-hidden="true">✓</span><h2 id="dialog-title">Demo erfolgreich durchgespielt.</h2><p>So könnte Ihr Behördengang künftig aussehen: verständlich, übersichtlich und Schritt für Schritt.</p><div class="notice">Es wurde kein Antrag eingereicht, keine E-Mail versandt und keine Zahlung ausgeführt. Ihre Testangaben werden beim Schliessen verworfen.</div><div class="actions"><button class="primary" id="finish">Zur Übersicht</button>${originalLink(current)}</div>`,'DEMO ABGESCHLOSSEN');$('#finish').onclick=close;}};
}
function capture(){const f=$('#wizard');if(f)new FormData(f).forEach((v,k)=>answers[k]=v)}
$('#services').onclick=e=>{const card=e.target.closest('[data-service]');if(card)openService(services[+card.dataset.service])};
function accountInfo(){show(`<h2 id="dialog-title">Ihr Konto im Onlineschalter</h2><p>Ein Konto kann persönliche Angaben in Formularen vorausfüllen. Für die Wohnsitzbestätigung und die beschriebenen Hunderegistrierungen ist laut offizieller Seite keine Kontoanmeldung erforderlich.</p><h3>Bereit für das offizielle Angebot?</h3><p>Die Anmeldung erfolgt ausschliesslich auf der amtlichen Website. Im Prototyp gibt es keine Kontoanmeldung.</p><a class="primary" href="${original}" target="_blank" rel="noopener">Offiziellen Onlineschalter öffnen ↗</a>`,'MEIN KONTO')}
$('#account').onclick=accountInfo;$('#account-info').onclick=accountInfo;
$('#privacy').onclick=()=>show(`<h2 id="dialog-title">Datenschutz im Prototyp</h2><p>Die eingegebenen Formularwerte bleiben vorübergehend im Arbeitsspeicher dieser Browserseite. Es gibt keine Speicherung, keinen Dokumentenupload und keine Übermittlung von Antragsdaten an eine Behörde.</p><p>Beim Schliessen des Formularfensters werden die Testangaben verworfen. Bitte verwenden Sie nur erfundene Daten.</p><p>Schriftarten werden von Google Fonts geladen. Links zu externen Angeboten öffnen eine neue Registerkarte; dort gelten die jeweiligen Datenschutzbestimmungen.</p>`,'INFORMATION');
$('#faq').onclick=()=>show(`<h2 id="dialog-title">Häufige Fragen</h2><details open><summary>Brauche ich ein Konto?</summary><p>Für viele Angebote ist kein Konto nötig. Geprüfte Hinweise finden Sie bei der jeweiligen Dienstleistung.</p></details><details><summary>Warum soll ich eine Gemeinde wählen?</summary><p>Die Gemeinden bieten unterschiedliche Leistungen an. Im Prototyp ist die Gemeindeauswahl eine Demonstration; die tatsächliche Teilnahme muss im offiziellen Formular geprüft werden.</p></details><details><summary>Kann ich hier einen echten Antrag einreichen?</summary><p>Diese Website ist ein UX-Prototyp. Für echte Anträge wechseln Sie über den gekennzeichneten Link zum offiziellen Angebot.</p></details><details><summary>Ich halte zum ersten Mal einen Hund. Was kommt zuerst?</summary><p>Zuerst lassen Sie sich von der Gemeinde in AMICUS registrieren. Anschliessend folgt die Anmeldung des Hundes bei der Gemeinde. Die Tierärztin oder der Tierarzt erfasst neue Hunde und Hunde aus dem Ausland im nationalen Register.</p></details>`,'HILFE & KONTAKT');
render();
