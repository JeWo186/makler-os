import type { Broker, Specialization } from '@/types'
import { DEMO_BROKERS } from '@/data/makleros_demo_brokers_150'
import { ULM_REGION_BROKERS } from '@/data/ulm-region-brokers'
import { ULM_REGION_SMALL_TOWNS } from '@/data/ulm-region-small-towns'

// ── Spec slug → display name (all known slugs) ──────────────────────────────
const SPEC_NAME_MAP: Record<string, string> = {
  'luxusimmobilien':     'Luxus & Premium',
  'kapitalanlagen':      'Kapitalanlagen',
  'mehrfamilienhaeuser': 'Mehrfamilienhäuser',
  'gewerbeimmobilien':   'Gewerbeimmobilien',
  'erbimmobilien':       'Erbimmobilien',
  'off-market':          'Off-Market',
  'neubauprojekte':      'Neubauprojekte',
  'denkmalimmobilien':   'Denkmalimmobilien',
  'scheidungsimmobilien':'Scheidungsimmobilien',
  'property-management': 'Property Management',
  'grundstuecke':        'Grundstücke',
  'seniorenimmobilien':  'Seniorenimmobilien',
  'hausverkauf':         'Hausverkauf',
  'wohnungen':           'Wohnungen',
}

// ── City display name → city slug ───────────────────────────────────────────
const CITY_NAME_TO_SLUG: Record<string, string> = {
  'Berlin':       'berlin',
  'München':      'muenchen',
  'Hamburg':      'hamburg',
  'Köln':         'koeln',
  'Frankfurt':    'frankfurt',
  'Stuttgart':    'stuttgart',
  'Düsseldorf':   'duesseldorf',
  'Leipzig':      'leipzig',
  'Hannover':     'hannover',
  'Nürnberg':     'nuernberg',
  'Ulm':          'ulm',
  'Neu-Ulm':      'neu-ulm',
  'Elchingen':    'elchingen',
  'Senden':       'senden',
  'Blaustein':    'blaustein',
  'Langenau':     'langenau',
  'Günzburg':     'guenzburg',
}

// ── City slug → display name (used by getBrokersByCity) ─────────────────────
const CITY_SLUG_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(CITY_NAME_TO_SLUG).map(([name, slug]) => [slug, name]),
)

// ── Adapters ─────────────────────────────────────────────────────────────────

function adaptDemoBroker(raw: (typeof DEMO_BROKERS)[number]): Broker {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    company: raw.company ?? null,
    email: raw.email ?? null,
    phone: raw.phone ?? null,
    photo_url: raw.photo_url && !raw.photo_url.includes('dicebear.com')
      ? raw.photo_url
      : null,
    bio: raw.bio ?? null,
    tier: raw.tier as Broker['tier'],
    verified: raw.verified,
    city_primary: raw.city,
    zip: raw.zip ?? null,
    created_at: raw.created_at,
    updated_at: raw.created_at,
    avg_rating: raw.rating,
    review_count: raw.review_count,
    specializations: raw.specializations.map((s, i) => ({
      id: `${raw.id}-s${i}`,
      slug: s.slug,
      name: s.name,
      description: null,
    })),
    gallery_images: 'gallery_images' in raw
      ? [...(raw.gallery_images as readonly string[])]
      : undefined,
    reviews: [],
  }
}

function adaptUlmRegionBroker(raw: (typeof ULM_REGION_BROKERS)[number], index: number): Broker {
  const specNames = raw.specializations
    .map((slug) => SPEC_NAME_MAP[slug] ?? slug)
    .join(', ')

  const bio =
    `${raw.company} ist Ihr Ansprechpartner in ${raw.city} – spezialisiert auf ${specNames}. ` +
    `Mit lokaler Marktkenntnis und persönlicher Beratung begleitet das Team Eigentümer und Käufer durch den gesamten Immobilienprozess.`

  return {
    id: `ulm-region-${String(index).padStart(3, '0')}`,
    slug: raw.slug,
    name: raw.company,
    company: raw.company,
    email: `kontakt@${raw.slug.replace(/-/g, '')}.de`,
    phone: null,
    photo_url: null,
    bio,
    tier: raw.tier as Broker['tier'],
    verified: raw.tier === 'premium' || raw.tier === 'pro',
    city_primary: raw.city,
    zip: null,
    created_at: '2026-05-14T10:00:00.000Z',
    updated_at: '2026-05-14T10:00:00.000Z',
    avg_rating: raw.rating,
    review_count: raw.review_count,
    specializations: raw.specializations.map((slug, i) => ({
      id: `ulm-region-${index}-s${i}`,
      slug,
      name: SPEC_NAME_MAP[slug] ?? slug,
      description: null,
    })),
    reviews: [],
  }
}

function adaptSmallTownBroker(raw: (typeof ULM_REGION_SMALL_TOWNS)[number], index: number): Broker {
  return {
    id: `small-town-${String(index).padStart(3, '0')}`,
    slug: raw.slug,
    name: raw.name,
    company: raw.company,
    email: raw.email ?? null,
    phone: raw.phone ?? null,
    photo_url: null,
    bio: raw.bio ?? null,
    tier: raw.tier as Broker['tier'],
    verified: raw.tier === 'premium' || raw.tier === 'pro',
    city_primary: raw.city,
    zip: null,
    created_at: '2026-05-14T10:00:00.000Z',
    updated_at: '2026-05-14T10:00:00.000Z',
    avg_rating: raw.rating,
    review_count: raw.review_count,
    specializations: raw.specializations.map((slug, i) => ({
      id: `small-town-${index}-s${i}`,
      slug,
      name: SPEC_NAME_MAP[slug] ?? slug,
      description: null,
    })),
    reviews: [],
  }
}

// ── Merged broker list ────────────────────────────────────────────────────────
export const MOCK_BROKERS: Broker[] = [
  ...DEMO_BROKERS.map(adaptDemoBroker),
  ...ULM_REGION_BROKERS.map(adaptUlmRegionBroker),
  ...ULM_REGION_SMALL_TOWNS.map(adaptSmallTownBroker),
]

// ── Specializations for filter UI ─────────────────────────────────────────────
export const MOCK_SPECIALIZATIONS: Specialization[] = Object.entries(SPEC_NAME_MAP).map(
  ([slug, name], i) => ({
    id: `s${i + 1}`,
    slug,
    name,
    description: null,
  }),
)

// ── Helper functions ──────────────────────────────────────────────────────────

export function getBrokerBySlug(slug: string): Broker | null {
  return MOCK_BROKERS.find((b) => b.slug === slug) ?? null
}

export function getBrokersByCity(citySlug: string): Broker[] {
  const cityName = CITY_SLUG_TO_NAME[citySlug]
  if (!cityName) return []
  return MOCK_BROKERS.filter((b) => b.city_primary === cityName)
}

export function filterBrokers(
  brokers: Broker[],
  params: Record<string, string>,
): Broker[] {
  let result = brokers

  if (params.q) {
    const q = params.q.toLowerCase()
    result = result.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.company ?? '').toLowerCase().includes(q) ||
        (b.bio ?? '').toLowerCase().includes(q),
    )
  }

  if (params.city) {
    const city = params.city.toLowerCase()
    result = result.filter((b) =>
      (b.city_primary ?? '').toLowerCase() === city,
    )
  }

  if (params.spec) {
    result = result.filter((b) =>
      b.specializations?.some((s) => s.slug === params.spec),
    )
  }

  if (params.rating) {
    const minRating = parseFloat(params.rating)
    if (!isNaN(minRating)) {
      result = result.filter((b) => (b.avg_rating ?? 0) >= minRating)
    }
  }

  if (params.tier) {
    result = result.filter((b) => b.tier === params.tier)
  }

  return result
}
