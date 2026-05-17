'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Specialization } from '@/types'

interface SearchFilterProps {
  specializations: Specialization[]
}

const CITIES = [
  'Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt',
  'Stuttgart', 'Düsseldorf', 'Leipzig', 'Hannover', 'Nürnberg',
  'Ulm', 'Neu-Ulm', 'Elchingen', 'Senden', 'Blaustein', 'Langenau', 'Günzburg',
]
const MIN_RATINGS = [
  { value: '', label: 'Alle Bewertungen' },
  { value: '4', label: 'Ab 4 Sterne' },
  { value: '4.5', label: 'Ab 4,5 Sterne' },
]
const TIERS = [
  { value: '', label: 'Alle' },
  { value: 'premium', label: 'Premium' },
  { value: 'pro', label: 'Pro' },
  { value: 'basic', label: 'Basic' },
]

export function SearchFilter({ specializations }: SearchFilterProps) {
  const router = useRouter()
  const params = useSearchParams()

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.push(`?${next.toString()}`)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
      <div className="flex items-center gap-2 font-semibold text-slate-800">
        <SlidersHorizontal className="w-4 h-4" />
        Filter
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">Suche</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            defaultValue={params.get('q') ?? ''}
            onChange={(e) => update('q', e.target.value)}
            placeholder="Name oder Firma…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Stadt */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">Stadt</label>
        <select
          value={params.get('city') ?? ''}
          onChange={(e) => update('city', e.target.value)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Alle Städte</option>
          {CITIES.map((city) => (
            <option key={city} value={city.toLowerCase()}>{city}</option>
          ))}
        </select>
      </div>

      {/* Spezialisierung */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">Spezialisierung</label>
        <select
          value={params.get('spec') ?? ''}
          onChange={(e) => update('spec', e.target.value)}
          className="w-full text-sm border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Alle Spezialisierungen</option>
          {specializations.map((spec) => (
            <option key={spec.id} value={spec.slug}>{spec.name}</option>
          ))}
        </select>
      </div>

      {/* Mindestbewertung */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">Mindestbewertung</label>
        <div className="space-y-1">
          {MIN_RATINGS.map((r) => (
            <label key={r.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={r.value}
                checked={params.get('rating') === r.value || (!params.get('rating') && r.value === '')}
                onChange={() => update('rating', r.value)}
                className="text-blue-600"
              />
              <span className="text-sm text-slate-700">{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Paket */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">Profilstufe</label>
        <div className="space-y-1">
          {TIERS.map((t) => (
            <label key={t.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tier"
                value={t.value}
                checked={params.get('tier') === t.value || (!params.get('tier') && t.value === '')}
                onChange={() => update('tier', t.value)}
                className="text-blue-600"
              />
              <span className="text-sm text-slate-700">{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-slate-500"
        onClick={() => router.push(window.location.pathname)}
      >
        Filter zurücksetzen
      </Button>
    </div>
  )
}
