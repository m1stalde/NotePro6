############################
  Note Editor der Gruppe 6
############################

Start der Anwendung:
- index.js mit NodeJS starten
- Browser mit der URL http://127.0.0.1:3000/ öffnen
- Alternativ unter Windows: run.cmd ausführen (Startet Node Server und öffnet URL im Browser)

Features:
- Layout mit "display: flex"
- Responsive Layout für kleine Displays < 768px und Displays >= 768px
- Style Switcher mit zwei Styles
- Font Awesome für frei skalierbare Icons
- Templating Notizliste mit Handlebars
- Datumsformatierung mit Moment
- Wichtigkeits-Rating mit Star-Rating
- Date Picker von JQuery UI
- Laden und Speichern als JSON dem Server
- Änderungen auf mehrere Browser notifizieren über WebSocket

Hinweise:
- Unterstützung nur für neuere Browser
  - display: flex (http://caniuse.com/#feat=flexbox)
  - transform (http://caniuse.com/#search=transform)
  - Verzicht auf Browser-Prefixes (-webkit, -ms, etc.)
  - IE 11, Firefox 31, Chrome 31, Safari 9, iOS Safari 9, Chrome for Android 42

Testing:
- HTML 5 Markup geprüft mit Markup Validation Service:
  https://validator.w3.org/

Coding Guidlines:
- CSS:
  - Layout, Styles und Themes in separaten CSS-Dateien
  - Gruppierung zusammengehörender Blöcke
