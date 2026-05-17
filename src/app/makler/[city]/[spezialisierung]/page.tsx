import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { BrokerCard } from '@/components/makler/broker-card'
import type { Broker } from '@/types'

const CITY_MAP: Record<string, string> = {
  berlin: 'Berlin', muenchen: 'München', hamburg: 'Hamburg',
  koeln: 'Köln', frankfurt: 'Frankfurt', stuttgart: 'Stuttgart',
  duesseldorf: 'Düsseldorf', leipzig: 'Leipzig', hannover: 'Hannover', nuernberg: 'Nürnberg',
}

const SPEC_MAP: Record<string, string> = {
  luxusimmobilien: 'Luxus & Premiumimmobilien',
  kapitalanlagen: 'Kapitalanlagen & Renditeobjekte',
  mehrfamilienhaeuser: 'Mehrfamilienhäuser',
  gewerbeimmobilien: 'Gewerbeimmobilien',
  erbimmobilien: 'Erbimmobilien & Nachlassverkauf',
  scheidungsimmobilien: 'Scheidungsimmobilien',
  neubauprojekte: 'Neubauprojekte & Bauträger',
  'off-market': 'Off-Market-Verkäufe',
  denkmalimmobilien: 'Denkmalimmobilien',
  kaeufervertretung: 'Käufervertretung (Buyer Agent)',
}

type Params = { city: string; spezialisierung: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city, spezialisierung } = await params
  const cityName = CITY_MAP[city]
  const specName = SPEC_MAP[spezialisierung]
  if (!cityName || !specName) return {}

  return {
    title: `${specName} Makler ${cityName} – Spezialisten finden`,
    description: `Finden Sie spezialisierte Immobilienmakler für ${specName} in ${cityName}. Verifizierte Profile, echte Bewertungen.`,
  }
}

function getMockBrokers(cityName: string, specName: string): Broker[] {
  return [
    {
      id: '1', slug: 'demo-makler-1', name: 'Sandra Hoffmann',
      company: `${cityName} ${specName} Experten`, email: null, phone: null,
      photo_url: null, bio: `Über 12 Jahre Erfahrung in ${specName} in ${cityName}.`,
      tier: 'pro', verified: true, city_primary: cityName, zip: null,
      created_at: '', updated_at: '',
      avg_rating: 4.8, review_count: 22,
      specializations: [{ id: '1', slug: 'demo', name: specName, description: null }],
    },
  ]
}

export default async function CitySpecPage({ params }: { params: Promise<Params> }) {
  const { city, spezialisierung } = await params
  const cityName = CITY_MAP[city]
  const specName = SPEC_MAP[spezialisierung]
  if (!cityName || !specName) notFound()

  const brokers = getMockBrokers(cityName, specName)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-slate-800">Startseite</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/makler" className="hover:text-slate-800">Makler</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/makler/${city}`} className="hover:text-slate-800">{cityName}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800">{specName}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          {specName} Makler in {cityName}
        </h1>
        <p className="text-slate-500 max-w-2xl">
          {brokers.length} spezialisierte Makler für {specName} in {cityName} –
          mit verifizierten Bewertungen von echten Kunden.
        </p>
      </div>

      <div className="grid gap-4">
        {brokers.map((broker) => (
          <BrokerCard key={broker.id} broker={broker} />
        ))}
      </div>

      {/* SEO Block */}
      <div className="mt-16 bg-slate-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Was ist ein {specName}-Makler?
        </h2>
        <p className="text-slate-600 leading-relaxed">
          {specName}-Makler in {cityName} sind auf diese spezifische Immobilienart spezialisiert
          und verfügen über tiefes Marktkenntnis, ein starkes Netzwerk aus Kaufinteressenten
          und Erfahrung mit den typischen rechtlichen und steuerlichen Besonderheiten dieser
          Immobilienkategorie.
        </p>
      </div>
    </div>
  )
}
