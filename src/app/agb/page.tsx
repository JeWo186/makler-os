import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AGB | MaklerOS',
}

export default function AgbPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Allgemeine Geschäftsbedingungen</h1>
      <p className="text-sm text-slate-400 mb-8">Stand: Mai 2026</p>

      <div className="space-y-8 text-sm text-slate-600 leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">§ 1 Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Plattform
            MaklerOS (makleros.de), betrieben von der MaklerOS GmbH, Musterstraße 1, 12345 Musterstadt.
            Mit der Registrierung oder Nutzung der Plattform erklären Sie sich mit diesen AGB einverstanden.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">§ 2 Leistungsgegenstand</h2>
          <p className="mb-2">
            MaklerOS betreibt ein digitales Branchenbuch für Immobilienmakler im DACH-Raum.
            Die Plattform ermöglicht:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Makler-Profilen die Darstellung ihrer Leistungen und Spezialisierungen</li>
            <li>Suchenden Kunden die gezielte Suche nach qualifizierten Maklern</li>
            <li>Die Übermittlung von Kontaktanfragen (Leads) über das MaklerOS-System</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">§ 3 Registrierung und Profilerstellung</h2>
          <p>
            Makler können ein Profil auf MaklerOS erstellen. Mit der Einreichung bestätigen Sie,
            dass alle angegebenen Informationen korrekt und aktuell sind. Die Freischaltung des
            Profils erfolgt nach Prüfung durch das MaklerOS-Team. Ein Rechtsanspruch auf Aufnahme
            besteht nicht.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">§ 4 Lead-Weiterleitung</h2>
          <p>
            Alle Kontaktanfragen von Suchenden an Makler laufen ausschließlich über das
            MaklerOS-System. Die direkte Veröffentlichung von Telefonnummern, E-Mail-Adressen
            oder sonstigen direkten Kontaktwegen in öffentlichen Profiltexten ist untersagt.
            Dies gilt für alle Tarife. Der Website-Link ist ausschließlich im Premium-Tarif verfügbar.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">§ 5 Tarife und Vergütung</h2>
          <p>
            MaklerOS bietet kostenpflichtige Tarife (Basic, Pro, Premium) sowie einen kostenlosen
            Grundtarif (Free) an. Die jeweils gültigen Preise sind auf der Seite /preise einsehbar.
            Kostenpflichtige Tarife werden monatlich im Voraus in Rechnung gestellt und sind
            monatlich kündbar. Rückerstattungen erfolgen nicht für bereits abgerechnete Zeiträume.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">§ 6 Pflichten der Nutzer</h2>
          <p className="mb-2">Nutzer verpflichten sich:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Keine falschen oder irreführenden Angaben zu machen</li>
            <li>Keine direkten Kontaktdaten in Profiltexten zu veröffentlichen</li>
            <li>Keine urheberrechtlich geschützten Inhalte ohne Genehmigung hochzuladen</li>
            <li>Die Plattform nicht für Spam oder unerwünschte Werbung zu nutzen</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">§ 7 Sperrung und Kündigung</h2>
          <p>
            MaklerOS behält sich vor, Profile zu sperren oder zu löschen, die gegen diese AGB
            verstoßen. Im Fall schwerwiegender Verstöße kann die Sperrung ohne Vorwarnung erfolgen.
            Makler können ihr Profil jederzeit durch schriftliche Mitteilung löschen lassen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">§ 8 Haftung</h2>
          <p>
            MaklerOS haftet nicht für die Richtigkeit der durch Makler angegebenen Profildaten.
            Für Schäden, die durch die Nutzung der Plattform entstehen, haftet MaklerOS nur bei
            Vorsatz oder grober Fahrlässigkeit. Die Haftung für entgangenen Gewinn ist ausgeschlossen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">§ 9 Änderungen der AGB</h2>
          <p>
            MaklerOS behält sich vor, diese AGB mit angemessener Vorankündigung (mindestens
            4 Wochen) zu ändern. Die Änderungen werden per E-Mail oder über die Plattform
            kommuniziert. Widerspricht der Nutzer nicht innerhalb der Frist, gelten die neuen
            AGB als akzeptiert.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">§ 10 Anwendbares Recht und Gerichtsstand</h2>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            Gerichtsstand für Streitigkeiten mit Unternehmern ist der Sitz der MaklerOS GmbH.
          </p>
        </section>

      </div>
    </div>
  )
}
