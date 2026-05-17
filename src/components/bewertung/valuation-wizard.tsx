'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, MapPin, Ruler, Calendar, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ValuationResult } from '@/components/bewertung/valuation-result'
import { cn } from '@/lib/utils'
import type { ValuationInput, ValuationResult as ValuationResultType } from '@/types'

const PROPERTY_TYPES = [
  { value: 'wohnung', label: 'Eigentumswohnung', icon: '🏢' },
  { value: 'haus', label: 'Einfamilienhaus', icon: '🏠' },
  { value: 'mfh', label: 'Mehrfamilienhaus', icon: '🏘️' },
  { value: 'gewerbe', label: 'Gewerbeimmobilie', icon: '🏢' },
]

const CONDITIONS = [
  { value: 'renovierungsbeduerftig', label: 'Renovierungsbedürftig', desc: 'Erheblicher Sanierungsbedarf' },
  { value: 'normal', label: 'Normal', desc: 'Durchschnittlicher Zustand' },
  { value: 'gut', label: 'Gut erhalten', desc: 'Gepflegt, wenig Mängel' },
  { value: 'neuwertig', label: 'Neuwertig', desc: 'Wie neu oder kernsaniert' },
]

const STEPS = ['Objekttyp', 'Lage & Größe', 'Details', 'Auswertung']

type Step = 0 | 1 | 2 | 3

const INITIAL: Partial<ValuationInput> = {
  has_garden: false,
  has_parking: false,
}

// Regional price factors relative to national baseline
const CITY_FACTORS: Record<string, number> = {
  berlin: 1.45,
  münchen: 2.05, muenchen: 2.05,
  hamburg: 1.70,
  köln: 1.25, koeln: 1.25,
  frankfurt: 1.60,
  stuttgart: 1.55,
  düsseldorf: 1.35, duesseldorf: 1.35,
  leipzig: 0.92,
  hannover: 1.12,
  nürnberg: 1.18, nuernberg: 1.18,
  ulm: 1.08,
}

function getCityFactor(city: string): number {
  const key = city.trim().toLowerCase()
  return CITY_FACTORS[key] ?? 1.0
}

// Simplified valuation model – replace with real API/Sprengnetter in production
function calculateValue(input: ValuationInput): ValuationResultType {
  const BASE_PRICES: Record<string, number> = {
    wohnung: 4200, haus: 3800, mfh: 2900, gewerbe: 2200,
  }

  const CONDITION_FACTOR: Record<string, number> = {
    renovierungsbeduerftig: 0.75, normal: 1.0, gut: 1.15, neuwertig: 1.30,
  }

  const currentYear = new Date().getFullYear()
  const age = currentYear - (input.year_built ?? 1990)
  const ageFactor = Math.max(0.7, 1 - age * 0.005)
  const cityFactor = getCityFactor(input.city)

  let pricePerSqm = (BASE_PRICES[input.property_type] ?? 3000)
    * (CONDITION_FACTOR[input.condition ?? 'normal'] ?? 1)
    * ageFactor
    * cityFactor

  if (input.has_garden) pricePerSqm *= 1.05
  if (input.has_parking) pricePerSqm *= 1.03

  const avg = pricePerSqm * input.area_sqm
  const variance = 0.1

  return {
    estimated_avg: Math.round(avg),
    estimated_min: Math.round(avg * (1 - variance)),
    estimated_max: Math.round(avg * (1 + variance)),
    price_per_sqm_min: Math.round(pricePerSqm * (1 - variance)),
    price_per_sqm_max: Math.round(pricePerSqm * (1 + variance)),
  }
}

export function ValuationWizard() {
  const [step, setStep] = useState<Step>(0)
  const [data, setData] = useState<Partial<ValuationInput>>(INITIAL)
  const [result, setResult] = useState<ValuationResultType | null>(null)

  function update(partial: Partial<ValuationInput>) {
    setData((prev) => ({ ...prev, ...partial }))
  }

  function next() {
    if (step === 2) {
      const result = calculateValue(data as ValuationInput)
      setResult(result)
    }
    setStep((s) => (s + 1) as Step)
  }

  function back() {
    setStep((s) => (s - 1) as Step)
  }

  function canProceed(): boolean {
    if (step === 0) return !!data.property_type
    if (step === 1) return !!data.city && !!data.area_sqm && data.area_sqm > 0
    if (step === 2) return !!data.year_built && !!data.condition
    return true
  }

  if (step === 3 && result) {
    return <ValuationResult result={result} input={data as ValuationInput} onBack={() => setStep(2)} />
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Progress */}
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                  i < step ? 'bg-blue-600 text-white' :
                  i === step ? 'bg-blue-600 text-white' :
                  'bg-slate-100 text-slate-400'
                )}
              >
                {i + 1}
              </div>
              <span className={cn('text-sm hidden sm:block', i === step ? 'font-semibold text-slate-800' : 'text-slate-400')}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div className="w-8 sm:w-16 h-px bg-slate-200 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Step 0: Property type */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Welche Immobilie möchten Sie bewerten?</h2>
            <p className="text-slate-500 mb-6">Wählen Sie den Immobilientyp aus.</p>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => update({ property_type: type.value as ValuationInput['property_type'] })}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all',
                    data.property_type === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="font-medium text-slate-800">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Location & size */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Wo liegt die Immobilie und wie groß ist sie?</h2>
            <p className="text-slate-500 mb-6">Diese Angaben sind entscheidend für die Bewertung.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Stadt oder PLZ *
                </label>
                <input
                  type="text"
                  placeholder="z. B. Berlin oder 10115"
                  value={data.city ?? ''}
                  onChange={(e) => update({ city: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <Ruler className="inline w-4 h-4 mr-1" />
                    Wohnfläche (m²) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    placeholder="z. B. 85"
                    value={data.area_sqm ?? ''}
                    onChange={(e) => update({ area_sqm: parseFloat(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">PLZ</label>
                  <input
                    type="text"
                    placeholder="z. B. 10115"
                    value={data.zip ?? ''}
                    onChange={(e) => update({ zip: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Details zur Immobilie</h2>
            <p className="text-slate-500 mb-6">Je genauer die Angaben, desto präziser die Bewertung.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Baujahr *
                </label>
                <input
                  type="number"
                  min="1850"
                  max={new Date().getFullYear()}
                  placeholder="z. B. 1998"
                  value={data.year_built ?? ''}
                  onChange={(e) => update({ year_built: parseInt(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Zustand *</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {CONDITIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => update({ condition: c.value as ValuationInput['condition'] })}
                      className={cn(
                        'text-left p-3 rounded-xl border-2 transition-all',
                        data.condition === c.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      )}
                    >
                      <div className="font-medium text-slate-800 text-sm">{c.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.has_garden}
                    onChange={(e) => update({ has_garden: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="text-sm text-slate-700">Garten vorhanden</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.has_parking}
                    onChange={(e) => update({ has_parking: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="text-sm text-slate-700">Stellplatz / Garage</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          {step > 0 ? (
            <Button variant="outline" onClick={back}>
              <ArrowLeft className="w-4 h-4" /> Zurück
            </Button>
          ) : (
            <div />
          )}
          <Button onClick={next} disabled={!canProceed()}>
            {step === 2 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Bewertung starten
              </>
            ) : (
              <>
                Weiter <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
