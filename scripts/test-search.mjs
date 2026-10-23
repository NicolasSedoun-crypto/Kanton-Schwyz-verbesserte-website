import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Test the real catalog and ranking without mocking the DOM interactions.
const source=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const catalog=source.slice(source.indexOf('const topics='),source.indexOf('const municipalities='));
const search=source.slice(source.indexOf('const norm='),source.indexOf('const searchPanel='));
const context=vm.createContext({});
vm.runInContext(`const original='';${catalog}\n${search}\nglobalThis.catalog=services;globalThis.find=findSearchResults;`,context);
for(const service of context.catalog)assert.equal(context.find(service.title).matches[0]?.id,service.id,service.title);
const examples=[['wohnsitz',0],['tier',1],['mehr zeit steuern',2],['zügeln',3],['Pass',4],['ersthund',5],['adresssuche',6],['förderung',7],['sozialhilfe',8],['phishing',9],['gestohlen',10],['bundessteuer raten',11],['bundessteuer später bezahlen',12],['halterauskunft',13],['mfk',14],['feuer',15],['wochenaufenthalt',16],['hund abmelden',17],['bücher',18],['wunschnummer',19],['kontrollschild verloren',20],['armee',21],['strafzettel',22],['polizeiwache',23],['vandalismus',24],['vereinsbus',25],['leumundszeugnis',26],['führerschein termin',27],['waffen kaufen',28],['wehrpflicht geld zurück',29],['wehrpflicht raten',30]];
for(const [query,id] of examples)assert.ok(context.find(query).matches.some(s=>s.id===id),query);
for(const [query,id] of [['Ich möchte meinen Hund anmelden',1],['Wo kann ich meinen Pass erneuern?',4],['Ich habe meinen Pass verloren',4],['Hnud anmelden',1],['Fahrzeugprüfun verschieben',14],['Wohnsitzbestätigun',0],['Biblothek',18]])assert.equal(context.find(query).matches[0]?.id,id,query);
assert.equal(context.find('Hnud').approximate,true);
assert.equal(context.find('Hund abmelden').approximate,false);
assert.equal(context.find('Pass').matches.length,1);
assert.equal(context.find('xyzzzzqqqq').matches.length,0);
assert.equal(context.find('ich möchte bitte').matches.length,0);
assert.equal(context.find('x'.repeat(160)).matches.length,0);
console.log('PASS: 31 service titles, 31 everyday queries, natural phrases, typos, exact-match priority and empty cases.');
