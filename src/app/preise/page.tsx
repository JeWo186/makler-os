import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, X, ArrowRight, Shield, BarChart2 } from 'lucide-react'
import { PageHero } from '@/components/layout/page-hero'
import { PageSection } from '@/components/layout/page-section'

export const metadata: Metadata = {
  title: 'Preise & Tarife | MaklerOS',
  description: 'Der passende Plan für Ihre Maklerpraxis – von kostenlos bis Premium. Monatlich kündbar.',
}

const TIERS = [
  {
    id:          'free',
    name:        'Free',
    price:       '0',
    period:      'für immer',
    desc:        'Einstieg ohne Kosten. Profil anlegen und in der Maklersuche erscheinen.',
    recommended: false,
    cta:         'Kostenlos starten',
    features: [
      { label: 'Profil in der Maklersuche',          included: true  },
      { label: '1 Profilfoto',                        included: true  },
      { label: 'Kontaktanfragen über MaklerOS',       included: true  },
      { label: 'Spezialisierungen hinterlegen',       included: false },
      { label: 'Galerie (bis zu 5 Fotos)',             included: false },
      { label: 'Verifiziert-Badge',                   included: false },
      { label: 'Impressum- & Datenschutz-Link',       included: false },
      { label: 'Erhöhte Sichtbarkeit in der Suche',   included: false },
      { label: 'Monatliche Profiloptimierung',        included: false },
      { label: 'Website-Link im Profil',              included: false },
      { label: 'Persönlicher Account-Manager',        included: false },
    ],
  },
  {
    id:          'basic',
    name:        'Basic',
    price:       '29',
    period:      'pro Monat',
    desc:        'Vollständiges Profil mit professioneller Darstellung und Verifizierung.',
    recommended: false,
    cta:         'Jetzt starten',
    features: [
      { label: 'Profil in der Maklersuche',          included: true  },
      { label: 'Galerie (bis zu 5 Fotos)',             included: true  },
      { label: 'Kontaktanfragen über MaklerOS',       included: true  },
      { label: 'Spezialisierungen hinterlegen',       included: true  },
      { label: 'Verifiziert-Badge',                   included: true  },
      { label: 'Impressum- & Datenschutz-Link',       included: true  },
      { label: 'Erhöhte Sichtbarkeit in der Suche',   included: false },
      { label: 'Monatliche Profiloptimierung',        included: false },
      { label: 'Website-Link im Profil',              included: false },
      { label: 'Persönlicher Account-Manager',        included: false },
    ],
  },
  {
    id:          'pro',
    name:        'Pro',
    price:       '79',
    period:      'pro Monat',
    desc:        'Stärkere Außenwirkung durch erhöhte Sichtbarkeit und regelmäßige Profiloptimierung.',
    recommended: true,
    cta:         'Jetzt starten',
    features: [
      { label: 'Profil in der Maklersuche',          included: true  },
      { label: 'Galerie (bis zu 15 Fotos)',            included: true  },
      { label: 'Kontaktanfragen über MaklerOS',       included: true  },
      { label: 'Spezialisierungen hinterlegen',       included: true  },
      { label: 'Verifiziert-Badge',                   included: true  },
      { label: 'Impressum- & Datenschutz-Link',       included: true  },
      { label: 'Erhöhte Sichtbarkeit in der Suche',   included: true  },
      { label: 'Monatliche Profiloptimierung (1×)',   included: true  },
      { label: 'Website-Link im Profil',              included: false },
      { label: 'Persönlicher Account-Manager',        included: false },
    ],
  },
  {
    id:          'premium',
    name:        'Premium',
    price:       '199',
    period:      'pro Monat',
    desc:        'Maximale Präsenz mit bevorzugter Platzierung, datenbasierten Empfehlungen und persönlichem Support.',
    recommended: false,
    cta:         'Premium anfragen',
    features: [
      { label: 'Profil in der Maklersuche',          included: true  },
      { label: 'Galerie (bis zu 30 Fotos + Cover)',   included: true  },
      { label: 'Kontaktanfragen über MaklerOS',       included: true  },
      { label: 'Spezialisierungen hinterlegen',       included: true  },
      { label: 'Verifiziert-Badge',                   included: true  },
      { label: 'Impressum- & Datenschutz-Link',       included: true  },
      { label: 'Top-Platzierung in der Suche',        included: true  },
      { label: 'Monatliche Profiloptimierung (4×)',   included: true  },
      { label: 'Website-Link im Profil',              included: true  },
      { label: 'Persönlicher Account-Manager',        included: true  },
    ],
  },
]

const EXPLANATIONS = [
  {
    title: 'Alle Leads laufen über MaklerOS',
    desc:  'Kontaktanfragen werden auf allen Tarifen ausschließlich über MaklerOS weitergeleitet. Direkte Kontaktdaten erscheinen nicht im öffentlichen Profil.',
    icon:  Shield,
  },
  {
    title: 'Profiloptimierung ab Pro',
    desc:  'Ab Pro erhalten Sie monatliche Empfehlungen zur Verbesserung Ihres Profils – basierend auf Plattformdaten, Profilqualität und Suchverhalten der Nutzer.',
    icon:  BarChart2,
  },
  {
    title: 'Website-Link ab Premium',
    desc:  'Der direkte Link zur eigenen Website ist ausschließlich im Premium-Tarif enthalten. Dies sichert den Lead-Fluss über die Plattform und bietet gleichzeitig maximale Kontrolle.',
    icon:  ArrowRight,
  },
]

export default function PreisePage() {
  return (
    <>
      <PageHero
        align="center"
        title={<>Der passende <span className="text-blue-400">Plan</span> für Ihr Maklerbüro</>}
        subtitle="Sichtbar werden, wo Kunden suchen. Monatlich kündbar, jederzeit upgraden."
      />

      {/* Tier-Karten */}
      <PageSection className="bg-white">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={[
                'relative bg-white rounded-2xl p-6 flex flex-col',
                tier.recommended
                  ? 'border border-slate-300 shadow-sm'
                  : 'border border-slate-200',
              ].join(' ')}
            >
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {tier.name}
                  </p>
                  {tier.recommended && (
                    <span className="text-[10px] font-semibold text-blue-600 bg-white border border-blue-500 px-2.5 py-0.5 rounded-full">
                      Empfohlen
                    </span>
                  )}
                </div>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-3xl font-bold text-slate-900">{tier.price} €</span>
                  <span className="text-sm text-slate-400 mb-0.5 pb-0.5">/ {tier.period}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{tier.desc}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6 border-t border-slate-100 pt-5">
                {tier.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2.5">
                    {f.included ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-slate-200 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm leading-snug ${f.included ? 'text-slate-700' : 'text-slate-400'}`}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/profil-erstellen"
                className={[
                  'block text-center py-2.5 px-4 rounded-xl font-semibold text-sm transition-colors',
                  tier.id === 'free'
                    ? 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    : tier.recommended
                      ? 'bg-blue-700 text-white hover:bg-blue-800'
                      : 'bg-slate-900 text-white hover:bg-slate-800',
                ].join(' ')}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Alle Preise zzgl. gesetzlicher MwSt. · Monatlich kündbar · Keine Einrichtungsgebühr
        </p>
      </PageSection>

      {/* Erklärungen */}
      <PageSection className="bg-slate-50 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-8 text-center">
          Was bedeuten die Unterschiede?
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {EXPLANATIONS.map(({ title, desc, icon: Icon }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 text-sm">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </PageSection>

      {/* FAQ */}
      <PageSection className="bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-8 text-center">Häufige Fragen</h2>
          <div className="space-y-5">
            {[
              {
                q: 'Kann ich jederzeit kündigen?',
                a: 'Ja. Alle kostenpflichtigen Tarife sind monatlich kündbar. Nach der Kündigung läuft der Tarif bis zum Ende des laufenden Abrechnungszeitraums.',
              },
              {
                q: 'Was bedeutet „Monatliche Profiloptimierung"?',
                a: 'Ab Pro analysiert MaklerOS Ihr Profil monatlich und liefert konkrete Empfehlungen – zum Beispiel zu Profiltext, Galerie oder Spezialisierungen. Premium-Kunden erhalten viermal monatlich Rückmeldung.',
              },
              {
                q: 'Warum ist der Website-Link nur ab Premium verfügbar?',
                a: 'MaklerOS sichert den Lead-Fluss über die Plattform. Der direkte Website-Link steht ausschließlich im Premium-Tarif zur Verfügung.',
              },
              {
                q: 'Wie wird die Reihenfolge in der Suche bestimmt?',
                a: 'Profilqualität, Bewertungen und Tarifstufe beeinflussen die Platzierung. Pro- und Premium-Profile erscheinen weiter oben in den Suchergebnissen.',
              },
              {
                q: 'Was passiert mit meinen Leads nach einem Downgrade?',
                a: 'Alle bisherigen Anfragen bleiben erhalten. Zukünftige Anfragen laufen weiter über MaklerOS – lediglich der Funktionsumfang des neuen Tarifs gilt.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-slate-100 pb-5">
                <p className="font-semibold text-slate-900 text-sm mb-1.5">{q}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      {/* CTA */}
      <PageSection className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Profil anlegen</h2>
          <p className="text-slate-500 mb-6">Kostenlos starten – Tarif jederzeit anpassen.</p>
          <Link
            href="/profil-erstellen"
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Jetzt Profil erstellen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </PageSection>
    </>
  )
}
