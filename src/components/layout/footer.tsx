import Link from 'next/link'
import { Home } from 'lucide-react'

const cities = ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf']
const specs = [
  { label: 'Luxusimmobilien',   slug: 'luxusimmobilien'     },
  { label: 'Kapitalanlagen',    slug: 'kapitalanlagen'      },
  { label: 'Mehrfamilienhäuser', slug: 'mehrfamilienhaeuser' },
  { label: 'Gewerbeimmobilien', slug: 'gewerbeimmobilien'   },
  { label: 'Erbimmobilien',     slug: 'erbimmobilien'       },
]

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white mb-3">
              <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              MaklerOS
            </Link>
            <p className="text-sm leading-relaxed">
              Das führende Branchenbuch für Immobilienmakler in Deutschland.
            </p>
          </div>

          {/* Makler nach Stadt */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Makler nach Stadt</h3>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city}>
                  <Link
                    href={`/makler/${city.toLowerCase().replace('ü', 'ue').replace('ö', 'oe')}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    Makler {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Spezialisierungen */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Spezialisierungen</h3>
            <ul className="space-y-2">
              {specs.map((spec) => (
                <li key={spec.slug}>
                  <Link
                    href={`/makler/berlin/${spec.slug}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {spec.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">MaklerOS</h3>
            <ul className="space-y-2">
              {[
                { href: '/profil-erstellen', label: 'Makler eintragen' },
                { href: '/preise',           label: 'Preise & Tarife' },
                { href: '/bewertung',        label: 'Immobilie bewerten' },
                { href: '/impressum',        label: 'Impressum' },
                { href: '/datenschutz',      label: 'Datenschutz' },
                { href: '/agb',              label: 'AGB' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs">© {new Date().getFullYear()} MaklerOS. Alle Rechte vorbehalten.</p>
          <p className="text-xs">
            Powered by KI — für Makler in Deutschland, Österreich & der Schweiz.
          </p>
        </div>
      </div>
    </footer>
  )
}
