'use strict';
// Official service entry links read from the cantonal directory on 24 October 2026.
// External destinations remain behind these official links so the canton can update them.
const officialServiceIds=[47,45,17,24,38,40,39,48,41,30,27,14,15,37,32,49,43,44,36,34,29,22,35,25,28,18,23,33,31,20,21];
const easyServices=[
 ['Bestätigung bestellen','Sie brauchen ein Dokument, das zeigt, wo Sie wohnen oder früher gewohnt haben.', ['Ihre Gemeinde und Ihre Adresse','Vorname, Nachname und Kontaktangaben','Die gewünschte Sprache und ob die Bestätigung für Sie allein oder Ihre Familie ist'], 'Die Gemeinde bearbeitet Ihre Bestellung und sendet Ihnen die Bestätigung.'],
 ['Hund anmelden','Sie haben einen neuen Hund oder ziehen mit Ihrem Hund in eine andere Gemeinde.', ['Ihre persönliche Nummer im Hunderegister AMICUS','Hundepass oder Impfausweis mit der Chip-Nummer Ihres Hundes','Ihre Adresse und das Datum, seit dem der Hund bei Ihnen lebt','Falls Sie weniger Hundesteuer bezahlen dürfen: den passenden Nachweis'], 'Die Gemeinde bestätigt die Anmeldung. Ein neuer Hund oder ein Hund aus dem Ausland muss zusätzlich bei einer Tierarztpraxis im Hunderegister erfasst werden.'],
 ['Mehr Zeit beantragen','Sie brauchen mehr Zeit, um Ihre Steuererklärung abzugeben.', ['Das Jahr Ihrer Steuererklärung','Ihre PID-Nummer: Sie steht oben rechts auf der Steuererklärung','Ihr Geburtsdatum; bei Paaren das Geburtsdatum der als P1 bezeichneten Person','Das Datum, bis zu dem Sie die Steuererklärung abgeben möchten'], 'Stellen Sie den Antrag, bevor Ihre bisherige Frist abläuft. Prüfen und behalten Sie die Antwort des Steuerportals.'],
 ['Umzug melden','Sie ziehen um und möchten Ihre neue Adresse der Gemeinde melden.', ['Ihre bisherige und Ihre neue Adresse','Ihr Umzugsdatum','Angaben zu allen Personen, die mit Ihnen umziehen'], 'Im Umzugsportal sehen Sie, ob Ihre Gemeinden teilnehmen und welche Dokumente Sie für Ihre Situation brauchen.'],
 ['Ausweis bestellen','Sie brauchen eine neue Identitätskarte oder einen neuen Schweizerpass.', ['Ihre persönlichen Angaben','Ihren bisherigen Ausweis, falls Sie ihn noch haben','Bei Verlust oder für ein Kind: Hinweise der Ausweisstelle lesen'], 'Wählen Sie den gewünschten Ausweis. Das Angebot erklärt Ihnen, wie Sie bestellen oder einen Termin vereinbaren.'],
 ['Als Hundehalter registrieren','Sie bekommen Ihren ersten Hund und haben noch keine persönliche Nummer im Hunderegister AMICUS.', ['Ihre Wohnadresse und Gemeinde','Vorname, Nachname und Kontaktangaben','Falls bereits vorhanden: Hundepass oder Impfausweis'], 'Die Gemeinde registriert Sie in AMICUS. Sie erhalten Ihre Zugangsdaten per E-Mail. Danach können Sie Ihren Hund anmelden.'],
 ['Adressauskunft bestellen','Sie suchen die Adresse einer Person, die in einer Schwyzer Gemeinde wohnt oder gewohnt hat.', ['Name und weitere bekannte Angaben zur gesuchten Person','Ihre eigenen Kontaktangaben','Ein Nachweis für Ihren Grund, zum Beispiel eine Rechnung oder ein Vertrag'], 'Die Gemeinde prüft, welche Angaben sie herausgeben darf. Anschliessend erhalten Sie die Auskunft.'],
 ['Projektbeitrag beantragen','Sie suchen finanzielle Unterstützung für ein gemeinnütziges Projekt mit Bezug zum Kanton Schwyz.', ['Eine kurze Beschreibung Ihres Projekts','Eine Übersicht der Kosten','Einen Plan, wer welche Kosten bezahlt'], 'Die zuständige Stelle prüft Ihr Projekt. Danach erhalten Sie einen schriftlichen Entscheid.'],
 ['Bestätigung bestellen','Sie brauchen einen Nachweis darüber, ob und wann Sie Sozialhilfe erhalten haben.', ['Die Gemeinde, für die Sie die Bestätigung brauchen','Ihre persönlichen Angaben und Adresse','Den gewünschten Zeitraum und den Grund für die Bestätigung'], 'Die Gemeinde stellt die Bestätigung zu. Wenn Sie Bestätigungen aus mehreren Gemeinden brauchen, bestellen Sie diese einzeln.'],
 ['Vorfall melden','Sie möchten einen Betrug oder einen anderen Vorfall im Internet bei der Polizei melden.', ['Was passiert ist und wann es passiert ist','Vorhandene Nachrichten, Bilder oder andere Belege','Angaben zu betroffenen Konten oder Zahlungen, soweit vorhanden'], 'Das Polizeiangebot erklärt, ob Sie Ihren Vorfall online melden können und was als Nächstes passiert.'],
 ['Diebstahl melden','Ihnen wurde etwas gestohlen und Sie möchten es der Polizei melden.', ['Wo und wann der Diebstahl passiert ist','Eine Beschreibung der gestohlenen Gegenstände','Vorhandene Belege, zum Beispiel Fotos oder Kaufbelege'], 'Das Polizeiangebot führt Sie durch die Meldung und erklärt mögliche weitere Schritte.'],
 ['Ratenzahlung beantragen','Sie möchten Ihre direkte Bundessteuer in mehreren Teilbeträgen bezahlen.', ['Ihre Steuerrechnung zum Nachschauen','Einen Vorschlag, wie viel Sie pro Rate bezahlen können'], 'Das Amt prüft Ihren Vorschlag. Sie erhalten eine Antwort per E-Mail. Es fallen Verzugszinsen an.'],
 ['Spätere Zahlung beantragen','Sie möchten Ihre direkte Bundessteuer erst später bezahlen.', ['Ihre Steuerrechnung zum Nachschauen','Das gewünschte neue Zahlungsdatum','Eine kurze Erklärung, weshalb Sie mehr Zeit brauchen'], 'Das Amt entscheidet über Ihren Antrag und antwortet per E-Mail. Es fallen Verzugszinsen an.'],
 ['Fahrzeughalter abfragen','Sie möchten wissen, auf wen ein Fahrzeug eingelöst ist.', ['Die Nummer des Kontrollschilds','Den Kanton auf dem Kontrollschild'], 'Die Halterauskunft zeigt, ob eine Auskunft zu dieser Nummer möglich ist.'],
 ['Prüfungstermin verschieben','Der Termin für Ihre Fahrzeugprüfung passt nicht. Sie suchen einen anderen Termin.', ['Das Schreiben mit Ihrem Prüfungstermin','Die Fahrzeug- oder Terminnummer aus diesem Schreiben'], 'Im Terminangebot wählen Sie einen verfügbaren Ersatztermin und prüfen die Bedingungen.'],
 ['Feuerbewilligung beantragen','Sie planen ein Feuer und möchten prüfen lassen, ob Sie es durchführen dürfen.', ['Ort, Datum und Dauer des Feuers','Was Sie verbrennen möchten','Kontaktangaben der verantwortlichen Person'], 'Die zuständige Stelle erklärt die Bedingungen. Prüfen Sie auch aktuelle Feuerverbote. Starten Sie erst, wenn die nötige Bewilligung vorliegt.'],
 ['Heimatausweis bestellen','Sie wohnen zeitweise in einer anderen Gemeinde, zum Beispiel unter der Woche für ein Studium. Ihr Hauptwohnsitz bleibt bestehen.', ['Ihre Hauptwohnadresse und die Adresse am Aufenthaltsort','Den Grund und die Dauer Ihres Aufenthalts','Ihre persönlichen Angaben'], 'Die Gemeinde bearbeitet Ihre Bestellung und stellt Ihnen den Heimatausweis zu.'],
 ['Hund abmelden','Ihr Hund ist verstorben, lebt bei jemand anderem oder zieht mit Ihnen weg.', ['Ihre persönliche Nummer im Hunderegister AMICUS','Angaben zu Ihrem Hund sowie Grund und Datum der Abmeldung','Bei Übergabe: die AMICUS-Nummer der neuen Halterin oder des neuen Halters'], 'Nach der Meldung erhalten Sie eine Bestätigung. Die Angaben bei der Gemeinde und im Hunderegister werden aktualisiert.'],
 ['Bücher suchen','Sie suchen ein Buch oder andere Medien in der Kantonsbibliothek.', ['Einen Titel, ein Thema oder den Namen der Autorin oder des Autors','Für eine Reservation eventuell Ihre Bibliotheks-Zugangsdaten'], 'Im Katalog sehen Sie, wo das Medium steht und ob es verfügbar ist.'],
 ['Versteigerung öffnen','Sie möchten bei einer Versteigerung ein bestimmtes Kontrollschild kaufen.', ['Eine Idee, welche Nummer Sie suchen','Vor der Teilnahme: die Regeln und Kosten der Versteigerung lesen'], 'Das Auktionsangebot erklärt die Registrierung und das Bieten. Prüfen Sie die Bedingungen, bevor Sie ein Gebot abgeben.'],
 ['Verlust melden','Sie haben ein Kontrollschild verloren und brauchen Hilfe für den Ersatz.', ['Die Nummer des verlorenen Kontrollschilds','Angaben zu Ihrem Fahrzeug','Wann und wo Sie den Verlust bemerkt haben'], 'Das zuständige Angebot erklärt die Meldung und wie Sie Ersatz erhalten.'],
 ['Dienstangebot öffnen','Sie möchten ein Anliegen zu Ihrem Militärdienst erledigen.', ['Ihr Aufgebot oder andere Unterlagen zu Ihrem Dienst','Eine kurze Beschreibung Ihres Anliegens'], 'Wählen Sie im Dienstangebot Ihr Anliegen. Dort sehen Sie die nötigen Angaben und nächsten Schritte.'],
 ['Busse bezahlen','Sie haben eine Ordnungsbusse erhalten und möchten sie online bezahlen.', ['Die Bussenmitteilung mit Nummer oder QR-Code','Ein Zahlungsmittel, das im Zahlungsangebot akzeptiert wird'], 'Prüfen Sie Nummer und Betrag. Bezahlen Sie im offiziellen Angebot und bewahren Sie die Bestätigung auf.'],
 ['Polizeiposten finden','Sie suchen die Adresse oder Telefonnummer eines Polizeipostens.', ['Den Ort oder die Postleitzahl, in deren Nähe Sie suchen'], 'Das Verzeichnis zeigt Ihnen die passenden Posten. Prüfen Sie dort auch die Öffnungszeiten.'],
 ['Beschädigung melden','Jemand hat Ihr Eigentum beschädigt und Sie möchten dies der Polizei melden.', ['Was beschädigt wurde','Ort und Zeitpunkt des Vorfalls','Vorhandene Fotos oder andere Belege'], 'Das Polizeiangebot erklärt, ob die Meldung online möglich ist und welche weiteren Angaben es braucht.'],
 ['Sportbus anfragen','Ihr Verein, Ihre Schule oder Ihre Organisation braucht einen Bus für einen sportlichen Anlass.', ['Datum, Ziel und Zweck der Fahrt','Name Ihrer Gruppe oder Organisation','Kontaktangaben der verantwortlichen Person'], 'Die zuständige Stelle prüft, ob der Bus frei ist und Sie ihn nutzen dürfen. Warten Sie auf die Bestätigung.'],
 ['Auszug bestellen','Sie brauchen ein Dokument aus dem Schweizer Strafregister, zum Beispiel für eine Bewerbung.', ['Ihre persönlichen Angaben','Einen Identitätsnachweis','Ein Zahlungsmittel für die Bestellung'], 'Der Bestelldienst erklärt, welcher Auszug passt, wie Sie sich ausweisen und wie Sie das Dokument erhalten.'],
 ['Theorietermin wählen','Sie möchten einen Termin für die Theorieprüfung zum Führerausweis buchen.', ['Ihre persönlichen Angaben','Die Führerausweis-Kategorie','Ihre Prüfungs- oder Zulassungsnummer, falls vorhanden'], 'Das Prüfungsangebot zeigt, ob Sie zugelassen sind und welche Termine verfügbar sind.'],
 ['Meldung öffnen','Sie möchten den Erwerb oder die Weitergabe einer Waffe melden.', ['Angaben zu den beteiligten Personen','Angaben zur betroffenen Waffe','Vorhandene Bewilligungen oder Vertragsunterlagen'], 'Prüfen Sie im offiziellen Angebot, welche Meldung und welche Bewilligung für Ihre Situation nötig sind.'],
 ['Rückerstattung beantragen','Sie haben Ihre Dienstpflicht erfüllt und möchten prüfen lassen, ob Sie bezahlte Wehrpflichtersatzabgaben zurückerhalten.', ['Angaben zu Ihren bezahlten Ersatzabgaben','Angaben zur erfüllten Dienstpflicht','Ihre Bankverbindung für eine mögliche Rückzahlung'], 'Die zuständige Stelle prüft Ihren Anspruch. Wenn der Antrag bewilligt wird, erhalten Sie das Geld auf Ihr angegebenes Konto.'],
 ['Ratenzahlung beantragen','Sie möchten die Wehrpflichtersatzabgabe in mehreren Teilbeträgen bezahlen.', ['Ihre Rechnung zur Wehrpflichtersatzabgabe','Einen Vorschlag für die Teilzahlungen','Eine kurze Erklärung zu Ihrem Antrag'], 'Sie erhalten einen Entscheid per Post. Bei einer Bewilligung folgen die Zahlungsangaben. Es fallen Verzugszinsen an.']
];
const serviceFacts={
 0:['Kein Login nötig','Ab CHF 10','2–3 Arbeitstage'],1:['Kein Login nötig','Anmeldung kostenlos','2–3 Tage'],
 2:['Kein Login nötig','Kostenlos','Vor Ablauf Ihrer Frist'],5:['Kein Login nötig','Kostenlos','2–3 Tage'],
 6:['Kein Login nötig','CHF 10 pro Person + evtl. Versand','2–3 Arbeitstage'],7:['Kein Login nötig','Kostenlos','Meist 2–4 Wochen'],
 8:['Kein Login nötig','CHF 20 + evtl. Versand','2–3 Arbeitstage'],11:['Kein Login nötig','Antrag kostenlos; Zinsen fallen an','Maximal 5 Tage'],
 12:['Kein Login nötig','Antrag kostenlos; Zinsen fallen an','Maximal 5 Tage'],16:['Kein Login nötig','CHF 20 oder 30 + evtl. Versand','2–3 Arbeitstage'],
 17:['Kein Login nötig','Kostenlos','2–3 Tage'],25:['Kein Login nötig','1 Tag CHF 75; 2–7 Tage CHF 150','Meist wenige Arbeitstage'],
 29:['Login im offiziellen Angebot','Antrag kostenlos','Im Angebot nachsehen'],30:['Login im offiziellen Angebot','Verzugszinsen','Maximal 5 Arbeitstage']
};
services.forEach((service,i)=>{service.url=`https://onlineschalter.sz.ch/Pages/Services/Detail.aspx?id=${officialServiceIds[i]}`;service.description=easyServices[i][1]});
const isExample=s=>['residence','dog','firstdog','dogoff','rates'].includes(s.type);
const extraHints={
 0:'Einzelperson auf Deutsch: CHF 10. Andere Sprachen oder Familie: CHF 20. Versand und eine nötige Archivrecherche können zusätzlich kosten.',
 1:'Melden Sie Ihren Hund innerhalb von 10 Tagen an. Die jährliche Hundesteuer kommt zur kostenlosen Anmeldung hinzu.',
 2:'Die PID-Nummer ist Ihre persönliche Nummer bei der Steuerverwaltung. Für den Antrag müssen Sie keine Dokumente hochladen.',
 5:'AMICUS ist das nationale Hunderegister. Die Personen-ID ist Ihre persönliche Nummer als Hundehalterin oder Hundehalter.',
 7:'Das Projekt muss gemeinnützig sein und einen Bezug zum Kanton Schwyz haben. Eine eigene Beteiligung an den Kosten wird vorausgesetzt.',
 11:'Laut offizieller Seite müssen Sie keine Unterlagen hochladen. Die Rechnung hilft Ihnen beim Ausfüllen.',
 12:'Laut offizieller Seite müssen Sie keine Unterlagen hochladen. Eine Verlängerung ist bei Bewilligung höchstens um 3 Monate möglich.',
 16:'CHF 20 für ein Jahr; CHF 30 für höchstens zwei Jahre. Mögliche Versandkosten kommen hinzu.',
 17:'Melden Sie die Änderung innerhalb von 10 Tagen. Bei einer Übergabe brauchen Sie die Personen-ID der neuen Halterin oder des neuen Halters.',
 25:'Der Bus hat 9 Plätze einschliesslich Fahrerin oder Fahrer. Er kann höchstens 7 Tage genutzt werden.'
};
detail=function(s){
 wizardOpen=false;current=s;
 const [action,summary,needs,next]=easyServices[s.id],facts=serviceFacts[s.id];
 const login=facts?facts[0]:'Das Angebot erklärt, ob ein Login nötig ist.';
 show(`<div class="service-intro"><span class="tag">${escapeHTML(topics[s.topic][0])}</span><h2 id="dialog-title">${escapeHTML(s.title)}</h2><p>${escapeHTML(summary)}</p></div>
 <div class="service-start"><a class="primary" href="${s.url}" target="_blank" rel="noopener">${escapeHTML(action)} <span aria-hidden="true">↗</span></a><small>Öffnet die passende offizielle Dienstleistung in einem neuen Tab.</small></div>
 <div class="easy-facts"><div><span>Benutzerkonto nötig?</span><strong>${escapeHTML(login)}</strong></div><div><span>Kosten</span><strong>${escapeHTML(facts?.[1]||'Im offiziellen Angebot nachsehen')}</strong></div><div><span>${s.id===2?'Einreichungsfrist':'Bearbeitungszeit'}</span><strong>${escapeHTML(facts?.[2]||'Im offiziellen Angebot nachsehen')}</strong></div></div>
 ${serviceHelp(s)}
 ${s.type==='dog'?'<aside class="first-dog"><strong>Ist das Ihr erster Hund?</strong><p>Ohne persönliche AMICUS-Nummer registrieren Sie sich zuerst als Hundehalterin oder Hundehalter.</p><button class="text-link" id="first-dog-help">Zuerst als Hundehalter registrieren →</button></aside>':''}
 <section class="easy-section"><h3><span aria-hidden="true">1</span> Das legen Sie bereit</h3><p>Damit geht das Ausfüllen einfacher:</p><ul class="easy-checklist">${needs.map(n=>`<li><span aria-hidden="true">✓</span>${escapeHTML(n)}</li>`).join('')}</ul><p class="easy-source">Diese Liste hilft bei der Vorbereitung. Welche Angaben und Unterlagen Pflicht sind, steht im offiziellen Formular.</p></section>
 ${extraHints[s.id]?`<details class="easy-detail"><summary>Gut zu wissen</summary><p>${escapeHTML(extraHints[s.id])}</p></details>`:''}
 <section class="easy-section"><h3><span aria-hidden="true">2</span> So starten Sie</h3><p>Klicken Sie auf «${escapeHTML(action)}». Folgen Sie dort den Schritten.${facts?.[0]==='Login im offiziellen Angebot'?' Melden Sie sich zuerst im offiziellen Angebot an.':s.type==='external'?' Sie werden zum zuständigen Angebot weitergeleitet.':' Auf der Detailseite geht es über «Zum Formular» oder «Zum nächsten Schritt» weiter.'}</p></section>
 <section class="easy-section"><h3><span aria-hidden="true">3</span> So geht es weiter</h3><p>${escapeHTML(next)}</p></section>
 ${isExample(s)?`<aside class="try-service"><strong>Erst einmal ausprobieren?</strong><p>Das Beispiel-Formular führt Sie Schritt für Schritt durch das Anliegen. Mit Ihrem Konto können Sie den Stand speichern.</p><button class="secondary" id="start-demo">${escapeHTML(action)} – ausprobieren →</button><small>Nur Testdaten verwenden. Hier wird kein echter Antrag eingereicht.</small></aside>`:''}
 <div class="service-end"><button class="text-link" id="service-back">Zurück zur Übersicht</button></div>
 <p class="easy-source"><a href="${s.url}" target="_blank" rel="noopener">Offizielle Informationen zu dieser Dienstleistung ↗</a></p>`,'SCHRITT FÜR SCHRITT');
 $('#service-back').onclick=()=>close();
 if($('#first-dog-help'))$('#first-dog-help').onclick=()=>detail(services[5]);
 // The account module handles #start-demo through its delegated event listener.
};
openService=function(s){answers={gemeinde:$('#municipality').value};detail(s)};
const renderServiceCards=render;
render=function(){renderServiceCards();document.querySelectorAll('[data-service]').forEach(card=>{
 const s=services[+card.dataset.service];
 card.querySelector('.tag').textContent=isExample(s)?'Mit Beispiel-Formular':'Schritt für Schritt';
 card.querySelector('.card-foot').innerHTML=`<span>${escapeHTML(easyServices[s.id][0])}</span><b aria-hidden="true">→</b>`;
});};
$('#sort').onchange=()=>render();
render();
