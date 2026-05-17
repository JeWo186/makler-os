import Link from 'next/link'
import { ArrowRight, Star, Shield, TrendingUp, MapPin, CheckCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { slugify } from '@/lib/utils'

const CITIES = [
  'Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt',
  'Stuttgart', 'Düsseldorf', 'Leipzig', 'Hannover', 'Nürnberg', 'Ulm',
]

const STATS = [
  { value: '5.000+', label: 'verifizierte Makler' },
  { value: '20.000+', label: 'echte Bewertungen' },
  { value: '98%', label: 'Empfehlungsrate' },
  { value: 'kostenlos', label: 'Eintragen & Finden' },
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Verifizierte Profile',
    desc: 'Alle Makler werden von uns geprüft. Kein Fake, kein Spam.',
  },
  {
    icon: Star,
    title: 'Echte Bewertungen',
    desc: 'Mehrdimensionale Bewertungen von verifizierten Eigentümern und Käufern.',
  },
  {
    icon: TrendingUp,
    title: 'KI-Bewertungsrechner',
    desc: 'Kostenlose Immobilienbewertung in 2 Minuten – mit regionalem Marktvergleich.',
  },
  {
    icon: MapPin,
    title: 'Hyperlokal & spezialisiert',
    desc: 'Finden Sie Makler nach Stadt, Stadtteil und Spezialisierung – nicht irgendwen.',
  },
]

const SPECS = [
  { slug: 'luxusimmobilien', label: 'Luxus & Premium' },
  { slug: 'kapitalanlagen', label: 'Kapitalanlagen' },
  { slug: 'mehrfamilienhaeuser', label: 'Mehrfamilienhäuser' },
  { slug: 'gewerbeimmobilien', label: 'Gewerbe' },
  { slug: 'erbimmobilien', label: 'Erbimmobilien' },
  { slug: 'off-market', label: 'Off-Market' },
]


export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(29,78,216,0.3),_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-blue-100 font-medium">Das führende KI-Branchenbuch im DACH-Raum</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              Den richtigen Makler{' '}
              <span className="text-blue-400">in Ihrer Region</span>{' '}
              finden.
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Verifizierte Profile, echte Kundenbewertungen, spezialisierte Expertise –
              für Deutschland, Österreich und die Schweiz.
            </p>

            {/* Search bar */}
            <form action="/makler" method="GET" className="flex gap-2 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Stadt oder PLZ eingeben…"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <Button size="lg" type="submit" className="rounded-xl whitespace-nowrap">
                Makler finden
              </Button>
            </form>

            <p className="mt-4 text-sm text-slate-400">
              Beliebte Städte:{' '}
              {CITIES.slice(0, 5).map((city, i) => (
                <span key={city}>
                  <Link
                    href={`/makler/${slugify(city)}`}
                    className="underline underline-offset-2 hover:text-white transition-colors"
                  >
                    {city}
                  </Link>
                  {i < 4 && ', '}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nach Spezialisierung */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Makler nach Spezialisierung finden
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Nicht jeder Makler ist für jede Immobilie geeignet. Finden Sie den Experten für Ihre Situation.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {SPECS.map((spec) => (
              <Link
                key={spec.slug}
                href={`/makler/berlin/${spec.slug}`}
                className="bg-white border border-slate-200 rounded-xl p-4 text-center text-sm font-medium text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:shadow-sm transition-all"
              >
                {spec.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nach Stadt */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Makler nach Stadt</h2>
              <p className="text-slate-500 mt-1">Alle Top-Städte in Deutschland</p>
            </div>
            <Link
              href="/makler"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Alle Städte <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CITIES.map((city) => (
              <Link
                key={city}
                href={`/makler/${slugify(city)}`}
                className="group flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{city}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Warum MaklerOS?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Kein generisches Branchenbuch. Spezialisiert auf Immobilienmakler –
              mit KI-Layer für Qualität und Relevanz.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bewertungsrechner CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-2xl">
              <Badge className="bg-white/20 text-white mb-4 border-transparent">Kostenlos & unverbindlich</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Was ist Ihre Immobilie wert?</h2>
              <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                Unser KI-Bewertungsrechner ermittelt den Marktwert Ihrer Immobilie
                in 2 Minuten – mit regionalem Vergleich und kostenlosem PDF-Report.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  'Kostenlos & ohne Anmeldung',
                  'Regionaler Marktvergleich',
                  'Sofortiges Ergebnis mit PDF-Report',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-blue-100">
                    <CheckCircle className="w-4 h-4 text-blue-200 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" href="/bewertung">
                Jetzt Immobilie bewerten <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Für Makler CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Sie sind Immobilienmakler?
            </h2>
            <p className="text-slate-500 mb-6 text-lg">
              Werden Sie sichtbar, wo Ihre Kunden suchen. Kostenloses Profil in 5 Minuten.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" href="/profil-erstellen">Kostenloses Profil erstellen</Button>
              <Button size="lg" variant="outline" href="/preise">Preise ansehen</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
