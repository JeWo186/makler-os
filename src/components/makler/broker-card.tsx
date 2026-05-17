import Link from 'next/link'
import { MapPin, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { BrokerAvatar } from '@/components/ui/broker-avatar'
import { cn, tierLabel, formatRating, displayTitle, displayContact } from '@/lib/utils'
import type { Broker } from '@/types'

interface BrokerCardProps {
  broker: Broker
  className?: string
}

const TIER_BADGE: Record<string, 'default' | 'blue' | 'green' | 'amber'> = {
  free:    'default',
  basic:   'blue',
  pro:     'green',
  premium: 'amber',
}

export function BrokerCard({ broker, className }: BrokerCardProps) {
  const rating      = broker.avg_rating ?? 0
  const reviewCount = broker.review_count ?? 0
  const title       = displayTitle(broker.company, broker.name)
  const contact     = displayContact(broker.company, broker.name)

  return (
    <Link
      href={`/profil/${broker.slug}`}
      className={cn(
        'group bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all flex gap-4',
        broker.tier === 'premium' && 'ring-1 ring-amber-300',
        className,
      )}
    >
      <BrokerAvatar
        name={broker.name}
        photoUrl={broker.photo_url}
        tier={broker.tier}
        size="card"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Zeile 1: Firmenname + Badge */}
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 truncate leading-snug">
              {title}
            </h3>
            {broker.verified && (
              <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" aria-label="Verifiziert" />
            )}
          </div>
          <Badge variant={TIER_BADGE[broker.tier] ?? 'default'} className="flex-shrink-0">
            {tierLabel(broker.tier)}
          </Badge>
        </div>

        {/* Zeile 2: Ansprechpartner (nur wenn abweichend von Firma) */}
        {contact && (
          <p className="text-xs text-slate-400 mb-1.5">
            Ansprechpartner: {contact}
          </p>
        )}

        {/* Zeile 3: Standort */}
        {broker.city_primary && (
          <p className="flex items-center gap-1 text-sm text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            {broker.city_primary}
          </p>
        )}

        {/* Spezialisierungen */}
        {broker.specializations && broker.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {broker.specializations.slice(0, 3).map((spec) => (
              <span
                key={spec.id}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
              >
                {spec.name}
              </span>
            ))}
            {broker.specializations.length > 3 && (
              <span className="text-xs text-slate-400">
                +{broker.specializations.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bewertung */}
        <div className="flex items-center gap-2">
          <StarRating rating={rating} />
          <span className="text-sm font-medium text-slate-700">{formatRating(rating)}</span>
          <span className="text-sm text-slate-400">({reviewCount} Bewertungen)</span>
        </div>
      </div>
    </Link>
  )
}
