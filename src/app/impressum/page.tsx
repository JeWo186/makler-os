import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum | MaklerOS',
}

export default function ImpressumPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Impressum</h1>

      <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6">

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">Angaben gemäß § 5 TMG</h2>
          <p className="text-slate-600">
            MaklerOS GmbH<br />
            Musterstraße 1<br />
            12345 Musterstadt<br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">Vertreten durch</h2>
          <p className="text-slate-600">Geschäftsführung: [Name]</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">Kontakt</h2>
          <p className="text-slate-600">
            E-Mail: kontakt@makleros.de<br />
            (Für rechtliche Anfragen ausschließlich schriftlich per Post oder E-Mail)
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">Registereintrag</h2>
          <p className="text-slate-600">
            Eintragung im Handelsregister.<br />
            Registergericht: Amtsgericht Musterstadt<br />
            Registernummer: HRB 12345
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">Umsatzsteuer-ID</h2>
          <p className="text-slate-600">
            Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />
            DE123456789
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)</h2>
          <p className="text-slate-600">
            [Name]<br />
            Musterstraße 1<br />
            12345 Musterstadt
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">Haftung für Inhalte</h2>
          <p className="text-slate-600">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">Haftung für Links</h2>
          <p className="text-slate-600">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">Urheberrecht</h2>
          <p className="text-slate-600">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
            Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
            Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors
            bzw. Erstellers.
          </p>
        </section>

      </div>
    </div>
  )
}
