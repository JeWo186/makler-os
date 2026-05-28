import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BrokerCard } from '@/components/makler/broker-card'
import { PageHero } from '@/components/layout/page-hero'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import { container, contentPadding } from '@/lib/layout'
import { cn } from '@/lib/utils'
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
    <>
      <PageHero
        breadcrumb={
          <Breadcrumb items={[
            { label: 'Startseite', href: '/' },
            { label: 'Makler', href: '/makler' },
            { label: cityName, href: `/makler/${city}` },
            { label: specName },
          ]} />
        }
        title={`${specName} Makler in ${cityName}`}
        subtitle={`${brokers.length} spezialisierte Makler für ${specName} in ${cityName} – mit verifizierten Bewertungen von echten Kunden.`}
      />

      <div className={cn(container, contentPadding)}>
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
    </>
  )
}
