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
['Wehrpflichtersatzabgabe: Ratenzahlung beantragen',2,'Die Ersatzabgabe in mehreren Raten bezahlen.','','rates']
];
const services=rows.map((r,i)=>({id:i,title:r[0],topic:r[1],description:r[2],url:r[3]?`https://onlineschalter.sz.ch/Pages/Services/Detail.aspx?id=${r[3]}`:original,type:r[4]||'original',meta:r[5]||topics[r[1]][0]}));
const municipalities=['Alpthal','Altendorf','Arth','Einsiedeln','Feusisberg','Freienbach','Galgenen','Gersau','Illgau','Ingenbohl','Innerthal','Küssnacht','Lachen','Lauerz','Morschach','Muotathal','Oberiberg','Reichenburg','Riemenstalden','Rothenthurm','Sattel','Schübelbach','Schwyz','Steinen','Steinerberg','Tuggen','Unteriberg','Vorderthal','Wangen','Wollerau'];
// The current list of participating municipalities differs per service.
// No unverified municipality is presented as supported by the live system.
$('#municipality').innerHTML+=municipalities.map(m=>`<option>${m}</option>`).join('');
let state={topic:null,filter:'all',limit:6};
$('#topics').innerHTML=topics.map((t,i)=>`<button class="topic" data-topic="${i}" aria-pressed="false"><span class="topic-icon" aria-hidden="true">${t[1]}</span><span>${t[0]}</span></button>`).join('');
const norm=s=>s.toLocaleLowerCase('de-CH').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const searchStopwords=new Set(['ich','mochte','moechte','will','brauche','benotige','benoetige','suche','wie','wo','was','kann','konnte','man','mein','meine','meinen','meiner','meinem','einen','eine','ein','einem','der','die','das','den','dem','des','fur','fuer','und','oder','bitte','habe','haben','hat','ist','sind','es','mich','mir','wir','uns','unser','unsere','du','sie','zu','zum','zur','im','in','mit','von','auf','auch','online','neu','lassen','machen']);
const searchTokens=query=>norm(query.trim()).replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(t=>t&&!searchStopwords.has(t));
const aliases={
  0:'wohnsitzbestatigung wohnsitzbescheinigung wohnbestatigung wohnbescheinigung adresse nachweis dokument sbb ski abo',
  1:'tier tiere haustier hund hunde hundeanmeldung hund registrieren amicus chip',
  2:'steuer steuern steuererklarung steuererklärung frist verlangern verlaengern verlangerung verlaengerung abgabe aufschub mehr zeit',
  3:'zugeln zuegeln umziehen ummeldung adressanderung adressaenderung neue adresse wohnortswechsel e umzug anmelden abmelden',
  4:'pass passport reisepass schweizer pass id identitatskarte identitaetskarte ausweis ausweispapiere erneuern beantragen verloren abgelaufen',
  5:'tier tiere haustier hund hunde ersthalter ersthundehalter ersthund hundehalter registrieren registrierung amicus personen id erster hund',
  6:'adresse adresssuche personensuche adressauskunft auskunft person suchen wohnadresse',
  7:'lotterie lotteriefonds forderung foerderung projekt beitrag finanzierung unterstutzung unterstuetzung gesuch verein',
  8:'sozialhilfe sozialamt sozialhilfebestatigung sozialhilfe nachweis bezug bescheinigung',
  9:'internetbetrug online betrug cybercrime phishing hacking gehackt internet kriminalitat kriminalitaet scam anzeige',
  10:'gestohlen bestohlen geklaut diebstahlanzeige diebstahl polizei anzeige',
  11:'bundessteuer raten ratenzahlung teilzahlung rechnung aufteilen zahlungsplan steuer raten bezahlen',
  12:'bundessteuer zahlungsaufschub zahlungsfrist verlangern verlaengern spater spaeter bezahlen rechnung frist',
  13:'auto fahrzeug halterauskunft halter abfrage nummernschild kennzeichen kontrollschild nummer wem gehort gehoert',
  14:'auto mfk motorfahrzeugkontrolle fahrzeugprufung fahrzeugpruefung termin verschieben andern aendern aufgebot',
  15:'feuer feuerbewilligung feuer machen feuerstelle verbrennen bewilligung',
  16:'heimatausweis wochenaufenthalt wochenaufenthalter aufenthaltsausweis dokument',
  17:'tier tiere haustier hund hunde hundeabmeldung wegzug verstorben tod hund abmelden',
  18:'bibliothek bucher buecher buch medien ausleihen leihen katalog suchen lesen bibliothekskatalog',
  19:'auto nummernschild kennzeichen wunschnummer auktion versteigerung bieten ersteigern kontrollschild',
  20:'auto nummernschild kennzeichen kontrollschild verloren verlust verlustmeldung ersatz',
  21:'militar militaer armee rs wk dienst dienstpflicht aufgebot militar dienst militaerdienst',
  22:'busse bussen bussgeld strafzettel parkbusse ordnungsbusse bezahlen zahlung qr rechnung',
  23:'polizei polizeiwache polizeistation posten standort kontakt finden suchen',
  24:'sachschaden vandalismus beschadigt beschaedigt kaputt sachbeschadigung sachbeschaedigung anzeige',
  25:'sport sportbus bus kleinbus verein vereinsbus reservieren beantragen mieten transport',
  26:'strafregister leumund leumundszeugnis strafregisterauszug privater auszug sonderprivatauszug dokument',
  27:'theorie theorieprufung theoriepruefung fahrprufung fahrpruefung fuhrerausweis fuehrerausweis fuhrerschein fuehrerschein auto prufung pruefung termin buchen',
  28:'waffe waffen kauf kaufen waffenkauf waffenerwerb ubertragung uebertragung melden',
  29:'wehrpflicht wehrpflichtersatz ersatzabgabe militar militaer geld zuruck zurueck ruckerstattung rueckerstattung erstattung',
  30:'wehrpflicht wehrpflichtersatz ersatzabgabe militar militaer raten teilzahlung zahlungsplan ratenzahlung bezahlen'
};
// Bounded Damerau-Levenshtein: one typo from four characters, two from eight.
// Only used when there is no exact match; short terms such as ID stay exact.
function searchDistance(a,b){
 const d=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
 for(let i=0;i<=a.length;i++)d[i][0]=i;
 for(let j=0;j<=b.length;j++)d[0][j]=j;
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){
  d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);
 }
 return d[a.length][b.length];
}
const searchIndex=services.map(service=>({service,fields:[norm(service.title),norm(aliases[service.id]||''),norm(topics[service.topic][0])].map(text=>({text,words:text.split(/[^a-z0-9]+/).filter(Boolean)}))}));
function findSearchResults(query){
 const tokens=searchTokens(query).slice(0,16);
 if(!tokens.length)return {matches:[],approximate:false};
 function rank(fuzzy){
  return searchIndex.map(({service,fields})=>{
   let score=0;
   for(const token of tokens){
    let best=0;
    fields.forEach(({text,words},i)=>{
     const weight=[12,7,2][i];
     if(text.includes(token))best=Math.max(best,weight+(words.includes(token)?5:0));
     else if(fuzzy&&token.length>=4&&token.length<=40){
      const max=token.length>=8?2:1;
      if(words.some(word=>Math.abs(word.length-token.length)<=max&&searchDistance(token,word)<=max))best=Math.max(best,weight/3);
     }
    });
    if(!best)return null;
    score+=best;
   }
   if(norm(service.title)===norm(query.trim()))score+=100;
   return {service,score};
  }).filter(Boolean).sort((a,b)=>b.score-a.score||a.service.id-b.service.id).map(hit=>hit.service);
 }
 const exact=rank(false);
 return exact.length?{matches:exact,approximate:false}:{matches:rank(true),approximate:true};
}
const searchMatches=query=>findSearchResults(query).matches;
const searchPanel=document.createElement('div');
searchPanel.id='search-results';searchPanel.className='search-results';searchPanel.hidden=true;searchPanel.setAttribute('role','region');searchPanel.setAttribute('aria-label','Passende Dienstleistungen');
$('#search-form').append(searchPanel);
$('#search').setAttribute('aria-controls','search-results');$('#search').setAttribute('aria-expanded','false');
$('#search').setAttribute('maxlength','160');
$('#search').setAttribute('enterkeyhint','search');
const clearSearch=document.createElement('button');
clearSearch.type='button';clearSearch.className='search-clear';clearSearch.setAttribute('aria-label','Suchfeld leeren');clearSearch.innerHTML='<span aria-hidden="true">×</span>';clearSearch.hidden=true;
$('#search').after(clearSearch);
const searchAnnouncement=document.createElement('span');searchAnnouncement.className='sr-only';searchAnnouncement.setAttribute('role','status');searchAnnouncement.setAttribute('aria-live','polite');$('#search-form').append(searchAnnouncement);
function highlightedTitle(title,query){
 const tokens=searchTokens(query);const text=norm(title);let result='',plain='';
 for(let i=0;i<title.length;){
  const token=tokens.filter(t=>text.startsWith(t,i)).sort((a,b)=>b.length-a.length)[0];
  if(token){result+=escapeHTML(plain)+'<mark>'+escapeHTML(title.slice(i,i+token.length))+'</mark>';plain='';i+=token.length}
  else plain+=title[i++];
 }
 return result+escapeHTML(plain);
}
function hideSearchResults(){searchPanel.hidden=true;$('#search').setAttribute('aria-expanded','false')}
function showSearchResults(){
 const query=$('#search').value.trim();clearSearch.hidden=!$('#search').value;
 const {matches,approximate}=query?findSearchResults(query):{matches:[services[0],services[1],services[2],services[4]],approximate:false};
 const heading=!query?'Schnellzugriff':matches.length?`${matches.length} ${approximate?'ähnliche':'passende'} ${matches.length===1?'Dienstleistung':'Dienstleistungen'}`:'Noch kein passendes Angebot';
 searchAnnouncement.textContent=heading;
 searchPanel.innerHTML=`<div class="search-results-heading"><span>${heading}</span><span class="search-key-hint">↑ ↓ auswählen · Enter öffnen</span></div>${approximate&&matches.length?'<p class="search-tip">Vielleicht meinen Sie eines dieser Angebote:</p>':''}${matches.length?matches.map(s=>`<button type="button" class="search-result" data-search-service="${s.id}"><span class="search-result-icon" aria-hidden="true">${topics[s.topic][1]}</span><span class="search-result-copy"><span class="search-result-topic">${escapeHTML(topics[s.topic][0])}</span><strong>${highlightedTitle(s.title,query)}</strong><small>${escapeHTML(s.description)}</small></span><span class="search-result-arrow" aria-hidden="true">→</span></button>`).join(''):`<div class="search-empty"><strong>Versuchen Sie einen kürzeren Begriff.</strong><p>Zum Beispiel «Pass» statt einer langen Beschreibung. Diese Themen helfen Ihnen weiter:</p><div class="search-alternatives">${['Wohnen','Hund','Steuern','Auto','Polizei','Bibliothek'].map(term=>`<button type="button" data-query="${term}">${term}</button>`).join('')}</div></div>`}<div class="search-results-footer">${matches.length?'Angebot auswählen und erfahren, was Sie dafür brauchen.':'Alle 31 Dienstleistungen können Sie auch nach Themen durchsehen.'}</div>`;
 searchPanel.scrollTop=0;
 searchPanel.hidden=false;$('#search').setAttribute('aria-expanded','true');
}
clearSearch.onclick=()=>{$('#search').value='';$('#search').focus({preventScroll:true});showSearchResults()};
searchPanel.onclick=e=>{
 const suggestion=e.target.closest('[data-query]');if(suggestion){$('#search').value=suggestion.dataset.query;$('#search').focus({preventScroll:true});showSearchResults();return}
 const button=e.target.closest('[data-search-service]');if(!button)return;$('#search').focus({preventScroll:true});hideSearchResults();openService(services[+button.dataset.searchService]);
};
$('#search-form').addEventListener('keydown',e=>{
 if(e.key==='Escape'){e.preventDefault();$('#search').focus({preventScroll:true});hideSearchResults();return}
 if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;
 if(searchPanel.hidden)showSearchResults();const buttons=[...searchPanel.querySelectorAll('[data-search-service]')];if(!buttons.length)return;
 e.preventDefault();const index=buttons.indexOf(document.activeElement);const next=e.key==='ArrowDown'?Math.min(index+1,buttons.length-1):index<=0?-1:index-1;
 const target=next<0?$('#search'):buttons[next];target.focus({preventScroll:true});
 if(next>=0){
  const panelRect=searchPanel.getBoundingClientRect(),rect=target.getBoundingClientRect();
  if(rect.bottom>panelRect.bottom)searchPanel.scrollTop+=rect.bottom-panelRect.bottom;
  else if(rect.top<panelRect.top)searchPanel.scrollTop-=panelRect.top-rect.top;
 }
});
document.addEventListener('click',e=>{if(!e.composedPath().includes($('#search-form')))hideSearchResults()});
$('#search-form').addEventListener('focusout',e=>{if(!$('#search-form').contains(e.relatedTarget))hideSearchResults()});
$('#search').addEventListener('focus',showSearchResults);
function render(){
 let list=services.filter(s=>(state.topic===null||s.topic===state.topic)&&(state.filter==='all'||(state.filter==='demo'?s.type!=='external':s.type==='external')));
 if($('#sort').value==='az')list.sort((a,b)=>a.title.localeCompare(b.title,'de-CH'));
 $('#results-title').textContent=state.topic===null?'Dienstleistungen im Überblick':topics[state.topic][0];
 $('#result-count').textContent=`${list.length} ${list.length===1?'Dienstleistung':'Dienstleistungen'}`;
 $('#services').innerHTML=list.slice(0,state.limit).map(s=>`<button class="service-card" data-service="${s.id}"><div class="card-top"><span class="card-icon" aria-hidden="true">${topics[s.topic][1]}</span><span class="tag ${s.type==='external'?'external':''}">${['residence','dog','firstdog'].includes(s.type)?'Ohne Konto':s.type==='external'?'Externe Seite ↗':s.type==='dogoff'?'Demo-Ablauf':'Offizielles Angebot ↗'}</span></div><h3>${s.title}</h3><p>${s.description}</p><div class="card-foot"><span>${s.meta}</span><b aria-hidden="true">${s.type==='external'?'↗':'→'}</b></div></button>`).join('');
 $('#empty').hidden=!!list.length;
 const showingAll=state.topic===null&&state.filter==='all';
 $('#show-more').hidden=showingAll&&list.length<=state.limit;
 $('#show-more').innerHTML=`Alle ${services.length} Dienstleistungen anzeigen <span aria-hidden="true">↓</span>`;
 document.querySelectorAll('[data-topic]').forEach(b=>{const active=+b.dataset.topic===state.topic;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active)});
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===state.filter;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active)});
}
$('#topics').onclick=e=>{
 const b=e.target.closest('[data-topic]');if(!b)return;
 state.topic=state.topic===+b.dataset.topic?null:+b.dataset.topic;
 state.filter='all';
 state.limit=state.topic===null?6:services.length;
 render();
 const heading=$('#results-title');heading.tabIndex=-1;heading.focus({preventScroll:true});
 $('#all-services').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
};
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;state.limit=state.filter==='all'&&state.topic===null?6:services.length;render()});
$('#search').oninput=showSearchResults;
$('#search-form').onsubmit=e=>{
 e.preventDefault();
 showSearchResults();
 const first=searchPanel.querySelector('[data-search-service]');
 if(first)first.focus({preventScroll:true});
 else{searchPanel.tabIndex=-1;searchPanel.focus({preventScroll:true})}
 searchPanel.scrollIntoView({block:'nearest',behavior:'smooth'});
};
document.querySelectorAll('[data-search]').forEach(b=>b.onclick=()=>{$('#search').value=b.dataset.search;$('#search').focus({preventScroll:true});showSearchResults()});
$('#sort').onchange=render;
function showAllServices(){state={topic:null,filter:'all',limit:services.length};render()}
$('#show-more').onclick=showAllServices;
document.querySelector('.section-top .text-link').onclick=()=>showAllServices();
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
function wizard(){if(current.type==='rates')return rateWizard();if(!['residence','dog','firstdog','dogoff'].includes(current.type))return localWizard();const residence=current.type==='residence';const labels=['Gemeinde',residence?'Dokument':'Angaben zum Hund','Personalien','Kontrolle'];let body='';
 if(step===0)body=`<p>Wählen Sie die Gemeinde, in der Sie wohnen${residence?' oder früher gewohnt haben':''}.</p>${selectField('gemeinde','Gemeinde',municipalities)}<div class="notice">${escapeHTML(availabilityText(current,answers.gemeinde))}. Diese Gemeindeauswahl dient dem Beispiel. Die aktuelle amtliche Auswahl ist massgebend. ${originalLink(current)}</div>`;
 if(step===1&&residence)body=selectField('dokument','Welche Bestätigung benötigen Sie?',['Wohnsitzbestätigung – Einzelperson','Wohnsitzbestätigung – Familie','Bestätigung für SBB- oder Ski-Abo'])+selectField('sprache','Sprache',['Deutsch','Französisch','Italienisch','Englisch'])+field('zweck','Zusätzliche Hinweise','text','Nur ausfüllen, wenn Sie uns etwas ergänzend mitteilen möchten.',false)+`<p>Einzelperson auf Deutsch: CHF 10. Andere Sprachen oder Familie: CHF 20. Für die Bestätigung für SBB- oder Ski-Abos muss die Gemeinde den Preis bestätigen. Allfällige Versand- oder Archivkosten kommen hinzu.</p>`;
 if(step===1&&!residence){if(current.type==='firstdog')body=`<p>Sie registrieren sich zuerst als Hundehalterin oder Hundehalter. Angaben zu Ihrem Hund können Sie freiwillig ergänzen.</p>`+field('hund','Name des Hundes','text','Falls Sie bereits einen Hund ausgewählt haben.',false);else body=field('hund','Name des Hundes')+field('chip','Mikrochip-Nummer','text','Die Nummer steht im Hundepass oder Impfausweis.')+field('amicus','Ihre Personen-ID in AMICUS','text','Ihre persönliche Nummer im nationalen Hunderegister.')+field('ereignis',current.type==='dogoff'?'Datum der Abmeldung':'Datum der Übernahme oder des Zuzugs','date');body+=`<div class="notice">Ein benötigter Dokumentenupload wird nur im offiziellen Formular angeboten. Bitte laden Sie hier keine persönlichen Unterlagen hoch.</div>`;}
 if(step===1&&current.type==='dogoff')body=field('hund','Name des Hundes')+field('chip','Mikrochip-Nummer','text','Beispielangabe: Das amtliche Formular kann andere Felder verlangen.')+field('amicus','Ihre Personen-ID in AMICUS','text','Ihre persönliche Nummer im nationalen Hunderegister.')+selectField('grund','Was hat sich geändert?',['Der Hund ist verstorben','Der Hund lebt bei einer anderen Person','Der Hund wird ins Ausland abgegeben','Ich ziehe mit dem Hund weg'])+field('ereignis','Datum der Änderung','date')+'<div id="dogoff-extra"></div><p class="muted">Bei einer Übergabe fragen wir zusätzlich nach der AMICUS-Nummer der neuen Halterperson. Laut amtlicher Seite sind sonst keine Unterlagen nötig.</p>';
 if(step===2)body=`<p>Mit * gekennzeichnete Felder sind Pflichtfelder. Verwenden Sie ausschliesslich erfundene Testdaten.</p><div class="two-fields">${field('vorname','Vorname')}${field('nachname','Nachname')}</div>${field('adresse','Strasse und Hausnummer')}<div class="two-fields">${field('plz','Postleitzahl')}${field('ort','Ort')}</div>${field('email','E-Mail','email','In dieser Demo wird keine E-Mail verschickt.')}${field('telefon','Telefon','tel','Nur für mögliche Rückfragen im Beispielablauf.',false)}`;
 if(step===3){const names={gemeinde:'Gemeinde',dokument:'Dokument',sprache:'Sprache',zweck:'Hinweise',hund:'Name des Hundes',chip:'Mikrochip-Nummer',amicus:'AMICUS Personen-ID',ereignis:'Datum',grund:'Grund der Abmeldung',neuehalter:'AMICUS-Nummer neue Haltung',neuadresse:'Neue Wohnadresse',vorname:'Vorname',nachname:'Nachname',adresse:'Adresse',plz:'Postleitzahl',ort:'Ort',email:'E-Mail',telefon:'Telefon'};body=`<p>Prüfen Sie Ihre Testangaben. Über «Zurück» können Sie diese ändern.</p><dl class="review">${Object.entries(answers).filter(([k,v])=>v&&names[k]).map(([k,v])=>`<dt>${names[k]}</dt><dd>${escapeHTML(v)}</dd>`).join('')}</dl><div class="notice">Dies ist eine Vorschau. Mit «Demo abschliessen» wird kein Antrag eingereicht und keine Zahlung ausgelöst.</div>`;}
 show(`<h2 id="dialog-title">${current.title}</h2><div class="progress" aria-label="Schritt ${step+1} von 4">${labels.map((_,i)=>`<span class="${i<=step?'done':''}"></span>`).join('')}</div><div class="step-text">SCHRITT ${step+1} VON 4 · ${labels[step].toUpperCase()}</div><form id="wizard"><h3>${step===3?'Alles richtig?':labels[step]}</h3>${body}<div class="actions"><button type="button" class="secondary" id="back">← Zurück</button><button class="primary" type="submit">${step===3?'Demo abschliessen':'Weiter →'}</button></div></form>`,'DEMO · KEIN ECHTER ANTRAG');
 if(step===1&&current.type==='dogoff'){const update=()=>{capture();const transfer=$('#grund').value==='Der Hund lebt bei einer anderen Person',move=$('#grund').value==='Ich ziehe mit dem Hund weg';if(!transfer)delete answers.neuehalter;if(!move)delete answers.neuadresse;$('#dogoff-extra').innerHTML=transfer?field('neuehalter','AMICUS-Nummer der neuen Halterin oder des neuen Halters','text','Fragen Sie die Person, die den Hund übernimmt.'):move?field('neuadresse','Neue Wohnadresse'):''};$('#grund').addEventListener('change',update);update()}
 if(step===0){$('#gemeinde').addEventListener('change',()=>{capture();$('#wizard .notice').innerHTML=escapeHTML(availabilityText(current,answers.gemeinde))+'. '+originalLink(current)})}
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
