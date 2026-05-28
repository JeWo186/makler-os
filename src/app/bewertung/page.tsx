import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import { ValuationWizard } from '@/components/bewertung/valuation-wizard'
import { PageHero } from '@/components/layout/page-hero'
import { PageSection } from '@/components/layout/page-section'

export const metadata: Metadata = {
  title: 'Immobilie kostenlos bewerten – KI-Bewertungsrechner',
  description:
    'Ermitteln Sie den Marktwert Ihrer Immobilie in 2 Minuten. Kostenlos, unverbindlich, mit regionalem Marktvergleich und PDF-Report.',
}

const BENEFITS = [
  'Kostenlos & ohne Anmeldung',
  'Ergebnis in unter 2 Minuten',
  'Regionaler Marktvergleich',
  'Kostenloses PDF-Wertgutachten',
]

export default function BewertungPage() {
  return (
    <>
      <PageHero
        align="center"
        badge={
          <span className="inline-block bg-white/10 border border-white/20 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full">
            KI-Bewertungsrechner
          </span>
        }
        title="Was ist Ihre Immobilie wert?"
        subtitle="Unser Rechner analysiert Ihre Immobilie und liefert eine realistische Marktpreiseinschätzung auf Basis aktueller Vergleichsdaten."
      >
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {BENEFITS.map((b) => (
            <div key={b} className="flex items-center gap-1.5 text-sm text-blue-100">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {b}
            </div>
          ))}
        </div>
      </PageHero>

      <PageSection className="bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <ValuationWizard />
        </div>
      </PageSection>
    </>
  )
}
