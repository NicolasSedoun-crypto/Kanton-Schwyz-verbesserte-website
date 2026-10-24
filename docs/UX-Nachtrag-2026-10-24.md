# UX-Challenge Onlineschalter Schwyz: Nachtrag

Stand: 24. Oktober 2026. Grundlage sind die 21 Einträge des bereitgestellten Pain-Point-Rasters, die amtlichen Detailseiten und der bestehende Demo-Prototyp. Die vier neuen Beobachtungen stehen als PP-022 bis PP-025 im ergänzten Raster. Sichtbare Texte und Bedingungen sind belegt; die vermutete Auswirkung auf Nutzende bleibt bis zu einem Test eine Hypothese. Es wurden keine echten Anträge oder Zahlungen ausgeführt.

## Kurzanalyse der vier ergänzten Prozesse

| ID | Amtlich beobachtet | Lösung im Prototyp | Beleg |
| --- | --- | --- | --- |
| PP-022 · Hund abmelden | Die Detailseite nennt Tod, Übergabe, Export und Wegzug. Nur bei Übergabe ist die Personen-ID der neuen Halterperson nötig. Kein Login, keine Gebühr, Meldung innert zehn Tagen. | Der Wegweiser nennt alle vier Situationen. Im Beispiel erscheint die zusätzliche AMICUS-Nummer nur bei Übergabe. Frist und Kosten stehen vor dem Start. | [Amtliche Detailseite](https://onlineschalter.sz.ch/Pages/Services/Detail.aspx?id=44), `Screenshot/ist-hundabmeldung.png` |
| PP-023 · Wehrpflichtersatz: Ratenzahlung | Login, Verzugszinsen, Grenze nach Betreibungsbeginn und Postentscheid stehen in mehreren Abschnitten. Die Bearbeitung dauert höchstens fünf Arbeitstage. | Die Vorbereitung fasst Folgen und Voraussetzungen vor der Eingabe zusammen. Der Beispielablauf zeigt Vorschlag, Kontakt und Prüfung. | [Amtliche Detailseite](https://onlineschalter.sz.ch/Pages/Services/Detail.aspx?id=21), `Screenshot/ist-ratenzahlung.png` |
| PP-024 · Fristverlängerung Steuererklärung | PID und bei Paaren das Geburtsdatum der als P1 bezeichneten Person werden benötigt. Der Antrag muss vor Ablauf der geltenden Frist gestellt werden; kein Login und keine Unterlagen nötig. | Fundstelle der PID, P1 und Fristbedingung erscheinen direkt vor der Demo-Eingabe. Der Hinweis zur möglichen Ablehnung bleibt sichtbar. | [Amtliche Detailseite](https://onlineschalter.sz.ch/Pages/Services/Detail.aspx?id=17), `Screenshot/ist-steuerfrist.png` |
| PP-025 · Feuerbewilligung | Der Katalogtitel ist allgemein. Die Detailseite betrifft aber nur Ausnahmebewilligungen für das Verbrennen natürlicher Wald- und Feldabfälle ausserhalb von Anlagen. Im Siedlungsgebiet ist das Verbrennen von Grüngut verboten. Ein frühester Beginn ist drei Arbeitstage nach Einreichung möglich; die Bewilligung gilt höchstens 30 Tage. | Die Dienstleistung erklärt ihren engen Geltungsbereich schon in der Übersicht und vor dem Beispielformular. Das Beispiel fragt nach Standort, Abfallart, fehlender Entsorgungsmöglichkeit und angeordneter Rodung. | [Amtliche Detailseite](https://onlineschalter.sz.ch/Pages/Services/Detail.aspx?id=49), `Screenshot/ist-feuerbewilligung.png` |

## Priorisierte Massnahmen

**Sofortänderungen (Priorität A):** PP-022 bis PP-025 sind Text-, Reihenfolge- oder bedingte Demo-Feldänderungen mit geringem geschätztem Aufwand. Der Prototyp zeigt diese Änderungen. Die amtlichen Texte und Formulare wurden dadurch nicht geändert.

**Grössere Änderungsaufträge:** PP-005 und PP-015 verlangen eine verlässliche, pro Dienstleistung aktuelle Gemeindeverfügbarkeit. PP-010, PP-011 und PP-014 betreffen Fachformulare oder Einbettung. Ein amtliches Konto mit übergreifendem Speichern und automatischem Ausfüllen braucht die Fachstellen, den Portalanbieter sowie eine Datenschutz- und Sicherheitsprüfung. Das Prototyp-Konto demonstriert nur die Nutzerführung.

## User Journey: Hund abmelden

| Schritt | Ist im amtlichen Angebot | Soll im Prototyp |
| --- | --- | --- |
| Anlass wählen | Mehrere Gründe stehen zusammen im Infotext. | Tod, Übergabe, Abgabe ins Ausland und Wegzug werden als konkrete Situationen benannt. |
| Angaben vorbereiten | Die neue Halter-ID wird im Text nur für die Übergabe verlangt. | Das Zusatzfeld erscheint nur bei Übergabe. |
| Zeitpunkt prüfen | Die Zehn-Tage-Frist steht unter «Fristen». | Der Hinweis ist vor dem Start sichtbar. |
| Abschluss | Das amtliche Formular führt die Meldung aus und bestätigt sie. | Die Demo zeigt ausdrücklich, dass kein amtlicher Antrag eingereicht wurde. |

## Fünf-Minuten-Pitch: Ergänzung

Die bestehende Präsentation kann in Minute 2 bis 3 die vier zusätzlichen Prozesse in einer kurzen Bildschirmfolge zeigen: «Hund abmelden» mit bedingter Halter-ID, die WPE-Vorbereitung mit Login und Zinsen, die PID-/P1-Hilfe und die präzisierte Feuerbewilligung. Die Kernbotschaft lautet: Bedingungen müssen vor dem Start verständlich sein. Der Live-Prototyp belegt die Gestaltung; ob Menschen damit tatsächlich weniger Fehler machen, muss ein Nutzertest zeigen.

## Was noch zu tun ist

1. Die vier neuen Hypothesen mit Personen mit wenig Digitalerfahrung, Deutsch als Zweitsprache und Tastatur-/Screenreader-Bedienung testen. Ergebnisse je PP-ID protokollieren.
2. Die Pflichtfelder der geschützten oder eingebetteten Originalformulare mit berechtigten Fachpersonen vergleichen. Insbesondere die WPE-Eingabe wurde nicht nach Login geprüft.
3. Mobile Breite, 200- und 400-Prozent-Zoom, Fokusführung, Kontrast und Screenreader mit einem nachvollziehbaren Prüfprotokoll prüfen.
4. Amtliche Redaktion und zuständige Ämter um Prüfung der Formulierungen, Feuerbedingungen, Gemeindeabdeckung und Fristen bitten. Bis dahin bleibt der Prototyp eine unverbindliche Demo.

Für die Vorführung ausschliesslich erfundene Testdaten verwenden. Die lokalen Screenshots liegen neben dem ergänzten Raster im Ordner `Screenshot/`.

## Ergänzung: Suche und Kontoansicht (PP-026 bis PP-028)

| ID | Beobachtung im Prototyp | Änderung |
| --- | --- | --- |
| PP-026 · Suche mit Enter | Nach Eingabe von «Tier» markierte das erste Enter nur den ersten Treffer. Ein zweites Enter war zum Öffnen nötig, obwohl der Hinweis «Enter öffnen» versprach. | Das erste Enter öffnet bei einer nichtleeren Suche den ersten passenden Treffer. Ohne Treffer bleiben die Suchhinweise sichtbar. |
| PP-027 · Alle Dienstleistungen | Nach «Alle 31 Dienstleistungen anzeigen» blieb ein alter Suchbegriff im Suchfeld, obwohl der Katalog wieder alle Angebote zeigte. | Der Button setzt Suchfeld und Suchergebnisanzeige zurück. |
| PP-028 · Gesendete Beispiele | Nach Abschluss zeigte das Konto nur den Titel und «Demo abgeschlossen»; die eingegebenen Testangaben waren nicht mehr einsehbar. | Abgeschlossene Beispiele stehen im Konto unter «Gesendete Beispiele» mit ihren gespeicherten Angaben und dem simulierten Status «In Bearbeitung (Demo)». Der Abschluss bietet einen direkten Weg dorthin. |

Der Status bei PP-028 ist ausschliesslich eine Darstellung für den UX-Prototyp. Es erfolgt keine amtliche Einreichung oder Bearbeitung. Pro Dienstleistung speichert dieses Beispielkonto weiterhin nur den jüngsten Stand; «Neu beginnen» ersetzt ihn nach einem sichtbaren Hinweis.

## Ergänzung: Schnellübersicht im Kopfbereich (PP-029)

| ID | Beobachtung im Prototyp | Änderung |
| --- | --- | --- |
| PP-029 · Fortsetzen und Status finden | «Fortsetzen» öffnete bei einem einzigen Entwurf sofort das Formular. Abgeschlossene Beispiele waren nur über die vollständige Kontoansicht sichtbar. | Der Button öffnet eine kleine Übersicht mit allen angefangenen Anliegen samt Schritt und allen abgeschlossenen Beispielen samt Demo-Status. Ein Klick öffnet den passenden Entwurf oder dessen gespeicherte Testangaben. Bei ausschliesslich abgeschlossenen Beispielen heisst der Button «Meine Anliegen». |

Die Übersicht ist für Tastaturbedienung mit sichtbarem Fokus, Escape-Taste und einem Schliessen-Button ausgelegt. «In Bearbeitung (Demo)» bedeutet weiterhin keine amtliche Verarbeitung.
