# Onlineschalter Schwyz – UX-Prototyp

Verbesserter, responsiver Onlineschalter auf Grundlage der öffentlichen Originalseite und des bereitgestellten Pain-Point-Rasters. Ergänzungen zu Hund, Suche und Kontoansicht sind als PP-022 bis PP-028 im [UX-Nachtrag](docs/UX-Nachtrag-2026-10-24.md) dokumentiert.

## Start

**Ohne Download ausprobieren:** [Online-Demo öffnen](https://schwyz-onlineschalter-neu.toastyhill32.chatgpt.site/).

**Windows:** ZIP entpacken und im Ordner mit `package.json` `start.bat` doppelklicken. Node.js 22.13 oder neuer muss installiert sein. Beim ersten Start werden die nötigen Pakete und die lokale Datenbank automatisch eingerichtet; danach öffnet sich die Website im Browser. Das Fenster während der Nutzung offen lassen.

Für die manuelle Entwicklung startet `npm run dev -- --port 4185` die Website. Für lokale Tests zuerst `/signin-with-chatgpt?return_to=/` öffnen; die mitgelieferte lokale Identität gilt nur in der Entwicklungsumgebung.

`node scripts/prepare-portal.mjs` übernimmt Änderungen an `public/index.html` in die Startseitenroute. `node scripts/test-portal.mjs` prüft die laufende lokale API mit erfundenen Testkonten. Der Test ist fest auf den lokalen Port 4185 beschränkt.

## Umfang

- 31 Dienstleistungen aus der offiziellen Übersicht, Suche, Themen und Filter.
- Demonstrationsabläufe für Wohnsitzbestätigung, Ersthundehalterregistrierung sowie Hundean- und -abmeldung.
- Eigene Registrierung und Anmeldung innerhalb des privaten Sites-Zugangs. Die Daten sind zusätzlich an die stabile Sites-Besucheridentität gebunden.
- Serverseitig gespeicherte Profile und Entwürfe in D1, automatisch ausgefüllte neue Formulare und Wiederaufnahme angefangener Anliegen.
- Passwörter mit zufälligem Salt und PBKDF2-SHA-256 (100000 Iterationen). Zufällige Sitzungstokens werden nur gehasht gespeichert; HttpOnly/SameSite-Sitzungscookies, HTTPS-Secure-Cookies, Herkunftsprüfung und begrenzte Anmeldeversuche.
- Keine E-Mail-Verifikation, Passwort-zurücksetzen-E-Mails oder echte Behördenanbindung. Das Konto dient dem privaten Prototyp; ausschliesslich Testdaten verwenden.
- Keine Zahlungen oder amtlichen Einreichungen.
- Vorbereitungshilfen zu allen 31 Dienstleistungen. Verifizierte Detailangaben sind von unverbindlichen Checklisten unterschieden.
- Die Gemeindeauswahl bestätigt keine tatsächliche Teilnahme. Verfügbarkeit muss anhand des offiziellen Angebots geprüft werden.
- Unbestätigte Kosten und Zuständigkeiten werden nicht erfunden. Links ohne verifizierte direkte Zieladresse führen ausdrücklich zur amtlichen Dienstleistungsübersicht.
- Google Fonts für DM Sans und Manrope; Systemschriften als Fallback. Illustration als eigenständige SVG-Grafik.

Quellen: https://onlineschalter.sz.ch/Pages/Default.aspx sowie die Detailseiten mit id=47 (Wohnsitzbestätigung), id=45 (Hund anmelden), id=40 (Erstregistrierung). Stand der inhaltlichen Prüfung: 23.10.2026.
