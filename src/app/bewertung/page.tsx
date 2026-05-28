import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import { ValuationWizard } from '@/components/bewertung/valuation-wizard'
import { PageHero } from '@/components/layout/page-hero'
import { sectionPadding } from '@/lib/layout'
import { cn } from '@/lib/utils'

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
        overline={
          <span className="inline-block bg-white/10 border border-white/20 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            KI-Bewertungsrechner
          </span>
        }
        title="Was ist Ihre Immobilie wert?"
        subtitle="Unser Rechner analysiert Ihre Immobilie und liefert eine realistische Marktpreiseinschätzung auf Basis aktueller Vergleichsdaten."
      >
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
          {BENEFITS.map((b) => (
            <div key={b} className="flex items-center gap-1.5 text-sm text-blue-100">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {b}
            </div>
          ))}
        </div>
      </PageHero>

      <div className={cn('bg-slate-50', sectionPadding)}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ValuationWizard />
        </div>
      </div>
    </>
  )
}
