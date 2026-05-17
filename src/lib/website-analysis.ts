import { slugify } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────
// Designed so a real crawler/AI-API can later replace the mock functions.

export interface WebsiteAnalysis {
  domain: string
  status: 'success' | 'partial' | 'failed'
  source: 'mock' | 'crawl' | 'ai'
  confidence: number // 0–1
  raw: {
    page_title:   string
    description:  string
    h1s:          string[]
    phone:        string | null
    email:        string | null
    address:      string | null
  }
}

export interface ContactPerson {
  name: string
  role: string
}

export interface GalleryImage {
  url:    string
  title?: string
}

export interface ProfileSuggestion {
  // Routing
  slug:            string
  // Firma
  company:         string
  contact_persons: ContactPerson[]
  positioning:     string
  // Standort
  city:     string
  district: string
  address:  string
  zip:      string
  // Kontakt (intern – läuft über MaklerOS-Lead, nicht öffentlich)
  website:  string
  phone:    string | null
  email:    string | null
  // Inhalt
  bio:             string
  services:        string[]
  specializations: string[]  // slugs
  tier:            'free' | 'basic' | 'pro' | 'premium'
  // Media
  logo_url: string | null
  gallery:  GalleryImage[]
  // SEO
  seo_title:       string
  seo_description: string
  // Rechtliches (optional, nur ab Basic sichtbar)
  impressum_url?:   string | null
  datenschutz_url?: string | null
  ust_id?:          string | null
}

// ── Demo data (narander-jung.de) ───────────────────────────────────────────────

const DEMO_ANALYSES: Record<string, Omit<ProfileSuggestion, 'slug'>> = {
  'narander-jung.de': {
    company:         'Narander Jung Immobilien',
    contact_persons: [
      { name: 'Akash Narander',      role: 'Geschäftsführer'   },
      { name: 'Angela Jung',         role: 'Geschäftsführerin' },
      { name: 'Marlene Schifferings', role: 'Senior Maklerin'  },
    ],
    positioning:     'Premium Immobilienmakler am Rheinauhafen Köln',
    city:            'Köln',
    district:        'Rheinauhafen',
    address:         'Rheinauhafen, 50678 Köln',
    zip:             '50678',
    website:         'https://narander-jung.de',
    phone:           null,  // Kontakt läuft über MaklerOS
    email:           null,
    bio:
      'Narander Jung Immobilien ist eine der führenden Premium-Immobilienadressen ' +
      'in Köln. Vom exklusiven Rheinauhafen bis zu den begehrtesten Stadtvierteln der ' +
      'Domstadt vermittelt das erfahrene Team um Akash Narander und Angela Jung ' +
      'hochwertige Eigentumswohnungen, Penthäuser und Kapitalanlagen. ' +
      'Mit einem tiefen Verständnis des Kölner Marktes, einem weitreichenden Netzwerk ' +
      'und einem dezidiert persönlichen Beratungsansatz begleitet Narander Jung ' +
      'Immobilien anspruchsvolle Kunden diskret und erfolgreich – vom ersten Gespräch ' +
      'bis zur Schlüsselübergabe.',
    services: [
      'Immobilienvermittlung',
      'Marktpreisbewertung',
      'Property Management',
      'Asset Management',
      'Vermietung',
      'Investment Beratung',
    ],
    specializations: [
      'luxusimmobilien',
      'neubauprojekte',
      'kapitalanlagen',
      'property-management',
    ],
    tier:            'premium',
    logo_url:        null,
    gallery:         [],
    seo_title:
      'Narander Jung Immobilien – Premium Makler Köln Rheinauhafen',
    seo_description:
      'Ihr Partner für exklusive Immobilien in Köln. Luxusobjekte, Neubauprojekte ' +
      'und Kapitalanlagen – persönlich, diskret, erfolgreich.',
    impressum_url:   'https://narander-jung.de/impressum',
    datenschutz_url: 'https://narander-jung.de/datenschutz',
    ust_id:          null,
  },
}

// ── Generic fallback ──────────────────────────────────────────────────────────

function genericSuggestion(domain: string): Omit<ProfileSuggestion, 'slug'> {
  const company = domain
    .replace(/^www\./, '')
    .replace(/\.(de|com|at|ch|net)$/, '')
    .split(/[-.]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') + ' Immobilien'

  return {
    company,
    contact_persons: [],
    positioning:     'Ihr lokaler Immobilienmakler',
    city:            '',
    district:        '',
    address:         '',
    zip:             '',
    website:         `https://${domain}`,
    phone:           null,
    email:           null,
    bio:             `${company} begleitet Eigentümer und Käufer kompetent und zuverlässig durch den gesamten Immobilienprozess.`,
    services:        ['Immobilienvermittlung', 'Bewertung'],
    specializations: ['hausverkauf'],
    tier:            'basic',
    logo_url:        null,
    gallery:         [],
    seo_title:       `${company} | Immobilienmakler`,
    seo_description: `${company} – Ihr lokaler Ansprechpartner für Immobilien.`,
    impressum_url:   null,
    datenschutz_url: null,
    ust_id:          null,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
// Replace the body of this function with a real crawler/AI call later.

export async function analyzeWebsite(rawInput: string): Promise<{
  analysis: WebsiteAnalysis
  suggestion: ProfileSuggestion
}> {
  const domain = rawInput
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
    .toLowerCase()

  // Simulated network delay (replace with real fetch + parse)
  await new Promise((r) => setTimeout(r, 3200))

  const known = DEMO_ANALYSES[domain]

  const analysis: WebsiteAnalysis = {
    domain,
    status:     known ? 'success' : 'partial',
    source:     'mock',
    confidence: known ? 0.95 : 0.4,
    raw: {
      page_title:  known ? known.seo_title  : domain,
      description: known ? known.seo_description : '',
      h1s:         known ? [known.company]  : [],
      phone:       null,
      email:       null,
      address:     known ? known.address    : null,
    },
  }

  const base = known ?? genericSuggestion(domain)
  const suggestion: ProfileSuggestion = {
    ...base,
    slug: slugify([base.company, base.city].filter(Boolean).join(' ')),
  }

  return { analysis, suggestion }
}

// ── Spec name lookup ─────────────────────────────────────────────────────────

export const SPEC_LABELS: Record<string, string> = {
  luxusimmobilien:      'Luxus & Premium',
  kapitalanlagen:       'Kapitalanlagen',
  mehrfamilienhaeuser:  'Mehrfamilienhäuser',
  gewerbeimmobilien:    'Gewerbeimmobilien',
  erbimmobilien:        'Erbimmobilien',
  'off-market':         'Off-Market',
  neubauprojekte:       'Neubauprojekte',
  denkmalimmobilien:    'Denkmalimmobilien',
  scheidungsimmobilien: 'Scheidungsimmobilien',
  'property-management':'Property Management',
  grundstuecke:         'Grundstücke',
  seniorenimmobilien:   'Seniorenimmobilien',
  hausverkauf:          'Hausverkauf',
  wohnungen:            'Wohnungen',
}

export const ALL_SPECS = Object.keys(SPEC_LABELS)
