export type BrokerTier = 'free' | 'basic' | 'pro' | 'premium'
export type PropertyType = 'wohnung' | 'haus' | 'mfh' | 'gewerbe' | 'grundstueck'
export type PropertyCondition = 'renovierungsbeduerftig' | 'normal' | 'gut' | 'neuwertig'
export type LeadIntent = 'kaufen' | 'verkaufen' | 'bewerten' | 'mieten'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost'

export interface Broker {
  id: string
  slug: string
  name: string
  company: string | null
  email: string | null
  phone: string | null
  photo_url: string | null
  bio: string | null
  tier: BrokerTier
  verified: boolean
  city_primary: string | null
  zip: string | null
  created_at: string
  updated_at: string
  // Media (tier-gated)
  logo_url?: string | null
  cover_image?: string | null
  gallery_images?: string[]
  // Rechtliches (ab Basic)
  impressum_url?:  string | null
  datenschutz_url?: string | null
  ust_id?:         string | null
  // Joined
  cities?: City[]
  specializations?: Specialization[]
  reviews?: Review[]
  avg_rating?: number
  review_count?: number
}

export interface City {
  id: string
  slug: string
  name: string
  state: string
  population: number | null
  lat: number | null
  lng: number | null
}

export interface Specialization {
  id: string
  slug: string
  name: string
  description: string | null
}

export interface Review {
  id: string
  broker_id: string
  reviewer_name: string
  reviewer_email: string | null
  rating_overall: number
  rating_availability: number
  rating_market_knowledge: number
  rating_communication: number
  text: string | null
  verified: boolean
  created_at: string
}

export interface Lead {
  id: string
  broker_id: string | null
  name: string
  email: string
  phone: string | null
  message: string | null
  property_type: PropertyType | null
  intent: LeadIntent | null
  city: string | null
  status: LeadStatus
  created_at: string
}

export interface Valuation {
  id: string
  address: string | null
  city: string | null
  zip: string | null
  property_type: PropertyType
  area_sqm: number
  year_built: number | null
  condition: PropertyCondition | null
  floor: number | null
  has_garden: boolean
  has_parking: boolean
  estimated_min: number | null
  estimated_max: number | null
  lead_email: string | null
  lead_name: string | null
  created_at: string
}

// Form types
export interface ValuationInput {
  property_type: PropertyType
  area_sqm: number
  year_built: number
  condition: PropertyCondition
  city: string
  zip: string
  floor?: number
  has_garden: boolean
  has_parking: boolean
}

export interface ValuationResult {
  estimated_min: number
  estimated_max: number
  estimated_avg: number
  price_per_sqm_min: number
  price_per_sqm_max: number
}

export interface SearchFilters {
  city?: string
  specialization?: string
  tier?: BrokerTier
  min_rating?: number
  query?: string
}

// Seed/static data types
export interface CityPage {
  city: City
  brokers: Broker[]
  specializations: Specialization[]
  broker_count: number
}
