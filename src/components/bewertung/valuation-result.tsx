'use client'

import { useState } from 'react'
import { ArrowLeft, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatCurrency, propertyTypeLabel, conditionLabel } from '@/lib/utils'
import type { ValuationInput, ValuationResult as ResultType } from '@/types'

interface ValuationResultProps {
  result: ResultType
  input: ValuationInput
  onBack: () => void
}

export function ValuationResult({ result, input, onBack }: ValuationResultProps) {
  const [leadSent, setLeadSent] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  async function sendLead(e: React.FormEvent) {
    e.preventDefault()
    try {
      await fetch('/api/bewertung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          estimated_min: result.estimated_min,
          estimated_max: result.estimated_max,
          lead_email: email,
          lead_name: name,
        }),
      })
      setLeadSent(true)
    } catch {}
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Result header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sm:p-8">
        <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
          <TrendingUp className="w-4 h-4" />
          Marktpreisschätzung für {input.city}
        </div>
        <div className="text-center">
          <p className="text-blue-200 text-sm mb-2">Geschätzter Marktwert</p>
          <div className="text-4xl sm:text-5xl font-bold mb-2">
            {formatCurrency(result.estimated_avg)}
          </div>
          <p className="text-blue-200 text-sm">
            Spanne: {formatCurrency(result.estimated_min)} – {formatCurrency(result.estimated_max)}
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Preis/m² (min)', value: formatCurrency(result.price_per_sqm_min) },
            { label: 'Preis/m² (max)', value: formatCurrency(result.price_per_sqm_max) },
            { label: 'Wohnfläche', value: `${input.area_sqm} m²` },
          ].map((item) => (
            <div key={item.label} className="text-center bg-slate-50 rounded-xl p-3">
              <div className="font-bold text-slate-900 text-sm">{item.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-semibold text-slate-900 mb-3 text-sm">Ihre Immobilie im Überblick</h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {[
              { label: 'Typ', value: propertyTypeLabel(input.property_type) },
              { label: 'Zustand', value: conditionLabel(input.condition) },
              { label: 'Baujahr', value: String(input.year_built) },
              { label: 'Lage', value: input.city },
            ].map((item) => (
              <div key={item.label} className="flex gap-2">
                <dt className="text-slate-500">{item.label}:</dt>
                <dd className="font-medium text-slate-800">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Lead capture */}
        {!leadSent ? (
          <div className="border border-blue-200 bg-blue-50 rounded-2xl p-5">
            <h3 className="font-semibold text-slate-900 mb-1">Kostenlosen PDF-Report erhalten</h3>
            <p className="text-sm text-slate-600 mb-4">
              Wir senden Ihnen eine detaillierte Auswertung mit Marktvergleich per E-Mail.
            </p>
            <form onSubmit={sendLead} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Ihr Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
                <input
                  type="email"
                  placeholder="E-Mail-Adresse *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
              </div>
              <Button type="submit" className="w-full">
                PDF-Report kostenlos anfordern
              </Button>
              <p className="text-xs text-slate-400 text-center">
                Kein Spam. Keine Weitergabe. Jederzeit abbestellbar.
              </p>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4">
            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Report angefordert!</p>
              <p className="text-sm text-slate-600">Wir schicken Ihren PDF-Report in Kürze an {email}.</p>
            </div>
          </div>
        )}

        {/* CTA: find broker */}
        <div className="bg-slate-900 text-white rounded-2xl p-5">
          <h3 className="font-semibold mb-2">Möchten Sie Ihre Immobilie verkaufen?</h3>
          <p className="text-sm text-slate-400 mb-4">
            Finden Sie jetzt den passenden Makler in {input.city} und erzielen Sie den bestmöglichen Preis.
          </p>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            href={`/makler/${input.city.toLowerCase().replace(/ü/g, 'ue').replace(/ö/g, 'oe').replace(/ä/g, 'ae')}`}
          >
            Makler in {input.city} finden <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Neue Bewertung starten
        </button>
      </div>
    </div>
  )
}
