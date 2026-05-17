import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, CheckCircle, ChevronRight, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { LeadForm } from '@/components/makler/lead-form'
import { tierLabel, formatRating, displayTitle, displayContact, GALLERY_LIMITS } from '@/lib/utils'
import { GalleryGrid } from '@/components/makler/gallery-grid'
import { BrokerAvatar } from '@/components/ui/broker-avatar'
import { getBrokerBySlug } from '@/lib/mock-data'
import type { Review } from '@/types'


type Params = { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const broker = getBrokerBySlug(slug)
  if (!broker) return {}
  const metaTitle = broker.company ?? broker.name
  return {
    title: `${metaTitle} | Immobilienmakler`,
    description: broker.bio?.slice(0, 160) ?? `Immobilienmakler ${metaTitle} in ${broker.city_primary}`,
  }
}

// Cover gradient per tier – kein externes Bild, kein Chaos
const TIER_COVER: Record<string, string> = {
  premium: 'from-amber-900 via-amber-800 to-yellow-900',
  pro:     'from-blue-950 via-blue-900 to-blue-800',
  basic:   'from-slate-800 via-slate-700 to-slate-700',
  free:    'from-slate-700 via-slate-600 to-slate-600',
}


function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-slate-50 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium text-slate-900 text-sm">{review.reviewer_name}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(review.created_at).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <StarRating rating={review.rating_overall} size="sm" />
      </div>
      {review.text && (
        <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
      )}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200">
        {[
          { label: 'Erreichbarkeit',  rating: review.rating_availability },
          { label: 'Marktkenntnis',   rating: review.rating_market_knowledge },
          { label: 'Kommunikation',   rating: review.rating_communication },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-sm font-semibold text-slate-800">{item.rating}.0</div>
            <div className="text-xs text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function BrokerProfilePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const broker = getBrokerBySlug(slug)
  if (!broker) notFound()

  const avgRating = broker.avg_rating ?? 0
  const coverGrad = TIER_COVER[broker.tier] ?? TIER_COVER.free
  const isPremium = broker.tier === 'premium'
  const title     = displayTitle(broker.company, broker.name)
  const contact   = displayContact(broker.company, broker.name)

  return (
    <>
      {/* ── Cover (CSS-Gradient, kein externes Bild) ─────────────────────────── */}
      <div className={`relative w-full h-44 sm:h-56 bg-gradient-to-br ${coverGrad} overflow-hidden`}>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        {isPremium && (
          <div className="absolute bottom-4 right-4">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/80 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Premium-Profil
            </span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-1.5 text-sm text-slate-500 pt-4 mb-6">
          <Link href="/" className="hover:text-slate-800">Startseite</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/makler" className="hover:text-slate-800">Makler</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800">{broker.name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Main content ───────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Profile header */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-start gap-5">
                {/* Avatar – überlappt Cover */}
                <div className="-mt-16 flex-shrink-0">
                  <BrokerAvatar
                    name={broker.name}
                    photoUrl={broker.photo_url}
                    tier={broker.tier}
                    size="profile"
                    className="border-4 border-white shadow-lg"
                  />
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  {/* Zeile 1: Firmenname + Badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">{title}</h1>
                    <Badge variant={isPremium ? 'amber' : broker.tier === 'pro' ? 'green' : 'blue'}>
                      {tierLabel(broker.tier)}
                    </Badge>
                    {broker.verified && broker.tier !== 'free' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Geprüftes Profil
                      </span>
                    )}
                  </div>

                  {/* Zeile 2: Ansprechpartner (nur wenn abweichend) */}
                  {contact && (
                    <p className="text-sm text-slate-500 mb-2">
                      Ansprechpartner: <span className="font-medium text-slate-700">{contact}</span>
                    </p>
                  )}

                  {/* Zeile 3: Standort */}
                  {broker.city_primary && (
                    <p className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                      <MapPin className="w-4 h-4" />
                      {broker.city_primary}{broker.zip && ` (${broker.zip})`}
                    </p>
                  )}

                  {/* Zeile 4: Bewertung */}
                  <div className="flex items-center gap-2">
                    <StarRating rating={avgRating} size="md" />
                    <span className="font-semibold text-slate-800">{formatRating(avgRating)}</span>
                    <span className="text-slate-400 text-sm">({broker.review_count} Bewertungen)</span>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              {broker.specializations && broker.specializations.length > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
                    Spezialisierungen
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {broker.specializations.map((spec) => (
                      <Badge key={spec.id} variant="blue">{spec.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bio */}
            {broker.bio && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Über mich</h2>
                <p className="text-slate-600 leading-relaxed">{broker.bio}</p>
              </div>
            )}

            {/* Gallery – tier-gated, only when images are available */}
            {broker.tier !== 'free' && broker.gallery_images && broker.gallery_images.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <GalleryGrid
                  images={broker.gallery_images.slice(0, GALLERY_LIMITS[broker.tier] ?? 0)}
                  brokerName={broker.name}
                />
              </div>
            )}

            {/* Reviews */}
            {broker.reviews && broker.reviews.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Bewertungen ({broker.review_count})
                </h2>
                <div className="space-y-4">
                  {broker.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ────────────────────────────────────────────────────────── */}
          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-24">
              <h2 className="font-semibold text-slate-900 mb-4">Kontakt aufnehmen</h2>

              {/* Kontaktformular — einziger Kontaktweg */}
              <LeadForm brokerId={broker.id} brokerName={broker.name} />

              {/* Plattform-Hinweis */}
              <div className="flex items-start gap-2 mt-4 pt-4 border-t border-slate-100">
                <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ihre Anfrage wird sicher über MaklerOS weitergeleitet.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── Rechtliches (ab Basic, wenn befüllt) ─────────────────────────── */}
        {broker.tier !== 'free' && (broker.impressum_url || broker.datenschutz_url || broker.ust_id) && (
          <div className="mt-10 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
              {broker.impressum_url && (
                <a
                  href={broker.impressum_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Impressum
                </a>
              )}
              {broker.datenschutz_url && (
                <a
                  href={broker.datenschutz_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Datenschutz
                </a>
              )}
              {broker.ust_id && (
                <span className="text-xs text-slate-400">USt-IdNr.: {broker.ust_id}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
