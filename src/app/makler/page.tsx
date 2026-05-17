import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MapPin } from 'lucide-react'
import { BrokerCard } from '@/components/makler/broker-card'
import { SearchFilter } from '@/components/search/search-filter'
import { MOCK_BROKERS, MOCK_SPECIALIZATIONS, filterBrokers } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Immobilienmakler in Deutschland finden',
  description:
    'Verzeichnis aller verifizierten Immobilienmakler in Deutschland. Suchen & filtern nach Stadt, Spezialisierung und Bewertung.',
}

type Props = { searchParams: Promise<Record<string, string>> }

export default async function MaklerPage({ searchParams }: Props) {
  const params = await searchParams
  const brokers = filterBrokers(MOCK_BROKERS, params)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
          <MapPin className="w-4 h-4" />
          <span>Deutschland</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Immobilienmakler in Deutschland
        </h1>
        <p className="text-slate-500">
          {brokers.length} Makler gefunden – verifiziert und bewertet.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <Suspense>
            <SearchFilter specializations={MOCK_SPECIALIZATIONS} />
          </Suspense>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {brokers.length > 0 ? (
            <div className="grid gap-4">
              {brokers.map((broker) => (
                <BrokerCard key={broker.id} broker={broker} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg font-medium mb-2">Keine Makler gefunden</p>
              <p className="text-sm">Bitte passen Sie Ihre Filterkriterien an.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
