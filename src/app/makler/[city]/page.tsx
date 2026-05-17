import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, ChevronRight } from 'lucide-react'
import { BrokerCard } from '@/components/makler/broker-card'
import { getBrokersByCity } from '@/lib/mock-data'

const CITY_MAP: Record<string, { name: string; state: string }> = {
  berlin:      { name: 'Berlin',      state: 'Berlin' },
  muenchen:    { name: 'München',     state: 'Bayern' },
  hamburg:     { name: 'Hamburg',     state: 'Hamburg' },
  koeln:       { name: 'Köln',        state: 'Nordrhein-Westfalen' },
  frankfurt:   { name: 'Frankfurt',   state: 'Hessen' },
  stuttgart:   { name: 'Stuttgart',   state: 'Baden-Württemberg' },
  duesseldorf: { name: 'Düsseldorf',  state: 'Nordrhein-Westfalen' },
  leipzig:     { name: 'Leipzig',     state: 'Sachsen' },
  hannover:    { name: 'Hannover',    state: 'Niedersachsen' },
  nuernberg:   { name: 'Nürnberg',    state: 'Bayern' },
  ulm:         { name: 'Ulm',         state: 'Baden-Württemberg' },
  'neu-ulm':   { name: 'Neu-Ulm',     state: 'Bayern' },
  elchingen:   { name: 'Elchingen',   state: 'Bayern' },
  senden:      { name: 'Senden',      state: 'Bayern' },
  blaustein:   { name: 'Blaustein',   state: 'Baden-Württemberg' },
  langenau:    { name: 'Langenau',    state: 'Baden-Württemberg' },
  guenzburg:   { name: 'Günzburg',    state: 'Bayern' },
}

const SPECS = [
  { slug: 'luxusimmobilien', label: 'Luxus & Premium' },
  { slug: 'kapitalanlagen', label: 'Kapitalanlagen' },
  { slug: 'mehrfamilienhaeuser', label: 'Mehrfamilienhäuser' },
  { slug: 'gewerbeimmobilien', label: 'Gewerbeimmobilien' },
  { slug: 'erbimmobilien', label: 'Erbimmobilien' },
  { slug: 'off-market', label: 'Off-Market' },
]

type Params = { city: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city } = await params
  const cityData = CITY_MAP[city]
  if (!cityData) return {}

  return {
    title: `Immobilienmakler ${cityData.name} – verifizierte Profile & Bewertungen`,
    description: `Finden Sie den besten Immobilienmakler in ${cityData.name}. Echte Bewertungen, geprüfte Profile, verschiedene Spezialisierungen.`,
  }
}

export function generateStaticParams() {
  return Object.keys(CITY_MAP).map((city) => ({ city }))
}

export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { city } = await params
  const cityData = CITY_MAP[city]
  if (!cityData) notFound()

  const brokers = getBrokersByCity(city)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-slate-800">Startseite</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/makler" className="hover:text-slate-800">Makler</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800">{cityData.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{cityData.state}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Immobilienmakler {cityData.name}
        </h1>
        <p className="text-slate-500 max-w-2xl">
          {brokers.length} geprüfte Makler in {cityData.name} – mit echten Bewertungen
          von Eigentümern und Käufern. Finden Sie den Experten für Ihre Immobilie.
        </p>
      </div>

      {/* Spezialisierungen als Filter-Chips */}
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-600 mb-3">Nach Spezialisierung filtern:</p>
        <div className="flex flex-wrap gap-2">
          {SPECS.map((spec) => (
            <Link
              key={spec.slug}
              href={`/makler/${city}/${spec.slug}`}
              className="text-sm bg-white border border-slate-200 rounded-full px-4 py-1.5 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all"
            >
              {spec.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Broker grid */}
      <div className="grid gap-4">
        {brokers.map((broker) => (
          <BrokerCard key={broker.id} broker={broker} />
        ))}
      </div>

      {/* SEO-Text */}
      <div className="mt-16 prose prose-slate max-w-none">
        <h2>Immobilienmakler in {cityData.name} finden</h2>
        <p>
          {cityData.name} gehört zu den gefragtesten Immobilienmärkten in Deutschland.
          Ob Kauf, Verkauf oder Bewertung – ein spezialisierter Makler kennt den lokalen Markt
          und hilft Ihnen, den besten Preis zu erzielen. MaklerOS zeigt Ihnen verifizierte
          Makler in {cityData.name} mit echten Kundenbewertungen und nachgewiesener Expertise.
        </p>
        <h3>Warum einen lokalen Makler in {cityData.name} beauftragen?</h3>
        <p>
          Ein Makler, der den {cityData.name}er Markt kennt, weiß genau, welche Stadtteile
          besonders gefragt sind, wie lange Immobilien durchschnittlich auf dem Markt bleiben
          und zu welchem Preis vergleichbare Objekte zuletzt verkauft wurden.
        </p>
      </div>
    </div>
  )
}
