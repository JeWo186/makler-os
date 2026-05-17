import type { Metadata } from 'next'
import { ValuationWizard } from '@/components/bewertung/valuation-wizard'
import { CheckCircle } from 'lucide-react'

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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
            KI-Bewertungsrechner
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Was ist Ihre Immobilie wert?
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Unser Rechner analysiert Ihre Immobilie und liefert eine realistische
            Marktpreiseinschätzung auf Basis aktueller Vergleichsdaten.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-1.5 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {b}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard */}
        <ValuationWizard />
      </div>
    </div>
  )
}
