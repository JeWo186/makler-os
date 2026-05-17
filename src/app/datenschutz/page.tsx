import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutz | MaklerOS',
}

export default function DatenschutzPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Datenschutzerklärung</h1>
      <p className="text-sm text-slate-400 mb-8">Stand: Mai 2026</p>

      <div className="space-y-8 text-sm text-slate-600 leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">1. Verantwortlicher</h2>
          <p>
            Verantwortlicher im Sinne der DSGVO ist:<br />
            MaklerOS GmbH, Musterstraße 1, 12345 Musterstadt<br />
            E-Mail: datenschutz@makleros.de
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">2. Erhobene Daten</h2>
          <p className="mb-2">
            Wir erheben und verarbeiten folgende Daten:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Technische Zugriffsdaten (IP-Adresse, Browser, Zugriffszeitpunkt) – für Sicherheit und Betrieb</li>
            <li>Kontaktanfragen über das Lead-Formular (Name, Nachricht, Immobilienart) – zur Weiterleitung an Makler</li>
            <li>Makler-Profildaten (Firmenname, Adresse, Website) – zur Darstellung auf der Plattform</li>
            <li>Bewertungen von Nutzern – nach freiwilliger Abgabe</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">3. Zweck der Verarbeitung</h2>
          <p>
            Die Verarbeitung personenbezogener Daten erfolgt zur Erbringung des Plattformbetriebs
            (Art. 6 Abs. 1 lit. b DSGVO), zur Erfüllung rechtlicher Pflichten (lit. c) sowie auf
            Grundlage berechtigter Interessen (lit. f), insbesondere zur Sicherung und Weiterentwicklung
            der Plattform.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">4. Speicherdauer</h2>
          <p>
            Daten werden gelöscht, sobald der Zweck der Verarbeitung entfällt und keine gesetzlichen
            Aufbewahrungsfristen entgegenstehen. Technische Zugriffsdaten werden nach spätestens
            30 Tagen gelöscht. Profildaten von Maklern bleiben bis zur Kündigung des Accounts gespeichert.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">5. Weitergabe an Dritte</h2>
          <p>
            Eine Weitergabe personenbezogener Daten an Dritte erfolgt nur, soweit dies zur
            Vertragserfüllung notwendig ist, Sie ausdrücklich eingewilligt haben oder wir gesetzlich
            dazu verpflichtet sind. Lead-Anfragen von Nutzern werden an den jeweiligen Makler
            weitergeleitet.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">6. Ihre Rechte</h2>
          <p className="mb-2">Sie haben das Recht auf:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          </ul>
          <p className="mt-2">
            Zur Ausübung Ihrer Rechte wenden Sie sich an: datenschutz@makleros.de
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">7. Cookies</h2>
          <p>
            MaklerOS verwendet technisch notwendige Cookies für den Betrieb der Plattform.
            Es werden keine Tracking-Cookies oder Werbe-Cookies gesetzt, ohne Ihre Einwilligung.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">8. Beschwerderecht</h2>
          <p>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
            Die zuständige Behörde richtet sich nach Ihrem Wohnort oder unserem Firmensitz.
          </p>
        </section>

      </div>
    </div>
  )
}
