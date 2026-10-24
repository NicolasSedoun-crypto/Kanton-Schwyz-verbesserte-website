# Onlineschalter Schwyz – UX-Prototyp

Verbesserter, responsiver Onlineschalter auf Grundlage der öffentlichen Originalseite und des bereitgestellten Pain-Point-Rasters. Ergänzungen zu Hund, Suche und Kontoansicht sind als PP-022 bis PP-028 im [UX-Nachtrag](docs/UX-Nachtrag-2026-10-24.md) dokumentiert.

## Lokal starten (nach einem GitHub-Download)

Voraussetzung: Node.js 22.13 oder neuer. ZIP-Datei entpacken und im **Ordner mit `package.json`** ein Terminal öffnen. In Windows PowerShell nacheinander ausführen:

```powershell
npm.cmd ci
npm.cmd run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_elite_jackpot.sql
npm.cmd run dev -- --port 4185
```

Danach <http://127.0.0.1:4185/signin-with-chatgpt?return_to=/> öffnen. Das Terminal muss während der Nutzung geöffnet bleiben; `Ctrl+C` beendet den Server. Falls Port 4185 belegt ist, beim letzten Befehl eine andere Portnummer wie `4191` verwenden und dieselbe Nummer in der Adresse einsetzen.

Die ersten drei Befehle sind bei einem neuen Download nur einmal nötig. Später genügt `npm.cmd run dev -- --port 4185`. Auf macOS und Linux statt `npm.cmd` einfach `npm` verwenden. Die lokale Datenbank bleibt in `.wrangler/state` auf dem jeweiligen Computer; die Sites-Veröffentlichung hat eine getrennte Datenbank.

Die lokale ChatGPT-Identität ist nur für Entwicklungstests. Es werden keine amtlichen Anträge versendet; nur erfundene Testdaten verwenden. GitHub speichert den Code, betreibt aber diesen Server und die Datenbank nicht automatisch.

Für Entwickler: `node scripts/prepare-portal.mjs` übernimmt Änderungen an `public/index.html` in die Startseitenroute. `node scripts/test-portal.mjs` prüft die laufende lokale API mit erfundenen Testkonten und ist fest auf Port 4185 beschränkt.

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
