import type { Metadata } from 'next'
import { CheckCircle, Phone, Clock, Users, Zap, ArrowRight } from 'lucide-react'
import { ElevenLabsWidget } from '@/components/ki-assistent/elevenlabs-widget'
import { PageHero } from '@/components/layout/page-hero'
import { PageSection } from '@/components/layout/page-section'

export const metadata: Metadata = {
  title: 'KI-Telefonassistent für Immobilienmakler | MaklerOS',
  description:
    'Automatisieren Sie Anfragen, qualifizieren Sie Interessenten rund um die Uhr und entlasten Sie Ihr Maklerbüro mit einem intelligenten KI-Assistenten.',
}

const BENEFITS = [
  {
    icon: Clock,
    title: '24/7 erreichbar',
    desc: 'Ihr KI-Assistent nimmt Anrufe jederzeit entgegen – auch nachts, am Wochenende und an Feiertagen. Kein Anruf geht mehr verloren.',
  },
  {
    icon: Users,
    title: 'Automatische Lead-Qualifizierung',
    desc: 'Der Assistent stellt gezielte Fragen, bewertet das Interesse der Anrufer und übergibt Ihnen nur vorqualifizierte Kontakte.',
  },
  {
    icon: Phone,
    title: 'Professionelle Gesprächsführung',
    desc: 'Natürliche Konversation auf höchstem Niveau – der KI-Assistent klingt professionell, freundlich und kompetent.',
  },
  {
    icon: Zap,
    title: 'Schnelle Bearbeitung von Interessenten',
    desc: 'Anfragen werden sofort erfasst, kategorisiert und an Sie weitergeleitet – ohne Wartezeiten und ohne manuellen Aufwand.',
  },
]

const PLANS = [
  {
    id: 'basis',
    name: 'Basis',
    price: '149',
    period: 'pro Monat',
    desc: 'Ideal für Einzelmakler, die erste Schritte mit KI-Automatisierung gehen möchten.',
    recommended: false,
    cta: 'Jetzt starten',
    features: [
      'Bis zu 100 Anrufe / Monat',
      '24/7 Erreichbarkeit',
      'Lead-Erfassung & E-Mail-Weiterleitung',
      'Standard-Gesprächsskript',
      'Dashboard-Zugang',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '349',
    period: 'pro Monat',
    desc: 'Für wachsende Maklerbüros mit höherem Anrufvolumen und individuellen Anforderungen.',
    recommended: true,
    cta: 'Jetzt starten',
    features: [
      'Alle Funktionen aus BASIS enthalten',
      'Bis zu 500 Anrufe / Monat',
      '24/7 Erreichbarkeit',
      'Automatische Lead-Qualifizierung',
      'Individuelles Gesprächsskript',
      'CRM-Integration',
      'Wöchentliches Reporting',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Auf Anfrage',
    period: '',
    desc: 'Maßgeschneiderte Lösung für größere Büros und Franchise-Systeme mit unbegrenztem Volumen.',
    recommended: false,
    cta: 'Kontakt aufnehmen',
    features: [
      'Alle Funktionen aus PROFESSIONAL enthalten',
      'Unbegrenzte Anrufe',
      'Mehrere Rufnummern / Standorte',
      'Vollständige CRM-Integration',
      'Dedizierter Account-Manager',
      'SLA-Garantie',
      'White-Label-Option',
    ],
  },
]

export default function KiAssistentPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        badge={
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-blue-100 font-medium">
              Powered by KI-Sprachmodelle der neuesten Generation
            </span>
          </div>
        }
        title={
          <>
            KI-Telefonassistent für{' '}
            <span className="text-blue-400">Immobilienmakler</span>
          </>
        }
        subtitle="Automatisieren Sie Anfragen, qualifizieren Sie Interessenten rund um die Uhr und entlasten Sie Ihr Maklerbüro mit einem intelligenten KI-Assistenten."
      >
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="#live-demo"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            <Phone className="w-5 h-5" />
            Testgespräch starten
          </a>
          <a
            href="#preise"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Preise ansehen
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </PageHero>

      {/* Benefits */}
      <PageSection className="bg-white">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Warum ein KI-Telefonassistent?
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Ihr Büro läuft weiter – auch wenn Sie gerade beim Kundentermin sind.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md hover:border-blue-100 transition-all"
            >
              <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <b.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-base">{b.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Pricing */}
      <PageSection id="preise" className="bg-slate-50 border-y border-slate-200">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Transparente Preise
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Wählen Sie den passenden Plan für Ihr Maklerbüro. Monatlich kündbar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={[
                'relative bg-white rounded-2xl p-7 flex flex-col',
                plan.recommended
                  ? 'border border-slate-200 shadow-lg shadow-blue-100'
                  : 'border border-slate-200',
              ].join(' ')}
            >
              {plan.recommended && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                    Meist gewählt
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-3">
                  {plan.period ? (
                    <>
                      <span className="text-4xl font-bold text-slate-900">{plan.price} €</span>
                      <span className="text-sm text-slate-400 mb-1">/ {plan.period}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{plan.desc}</p>
              </div>

              <ul className="space-y-3 flex-1 mb-7 border-t border-slate-100 pt-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#live-demo"
                className={[
                  'block text-center py-3 px-5 rounded-xl font-semibold text-sm transition-colors',
                  plan.recommended
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : plan.id === 'enterprise'
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-slate-900 text-white hover:bg-slate-800',
                ].join(' ')}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Alle Preise zzgl. gesetzlicher MwSt. · Monatlich kündbar · Keine Einrichtungsgebühr
        </p>
      </PageSection>

      {/* Live Demo CTA */}
      <PageSection id="live-demo" className="bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live-Demo verfügbar
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5">
            Testen Sie jetzt den KI-Assistenten live
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto leading-relaxed">
            Starten Sie ein kostenloses Testgespräch und erleben Sie, wie der Assistent
            Immobilienanfragen professionell bearbeitet.
          </p>
          <a
            href="#live-demo"
            className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-xl transition-colors shadow-lg shadow-blue-200"
          >
            <Phone className="w-5 h-5" />
            Testgespräch starten
          </a>
          <ElevenLabsWidget />
          <p className="text-xs text-slate-400 mt-6">
            Das Testgespräch ist kostenlos und unverbindlich. Keine Anmeldung erforderlich.
          </p>
        </div>
      </PageSection>
    </>
  )
}
