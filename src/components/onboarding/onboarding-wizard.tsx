'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Globe, CheckCircle, ChevronRight, ChevronLeft, Building2, MapPin, Link2,
  Phone, Edit3, ArrowRight, Loader2, AlertCircle, RotateCcw,
  Plus, Trash2, User, Image as ImageIcon, Briefcase, ShieldAlert, Tag, X,
  Upload,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { analyzeWebsite, SPEC_LABELS, ALL_SPECS } from '@/lib/website-analysis'
import type { ProfileSuggestion, ContactPerson, GalleryImage } from '@/lib/website-analysis'
import { BrokerAvatar } from '@/components/ui/broker-avatar'
import { cn, tierLabel } from '@/lib/utils'

// ── Design tokens (matching MaklerOS platform) ────────────────────────────────

const INPUT = [
  'w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5',
  'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400',
  'transition-colors placeholder-slate-400 text-slate-900',
].join(' ')

const INPUT_ERR = [
  'w-full text-sm border border-red-300 bg-red-50 rounded-lg px-3 py-2.5',
  'focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400',
  'transition-colors placeholder-slate-400 text-slate-900',
].join(' ')

// ── Lead-Guard validation ──────────────────────────────────────────────────────

const EMAIL_RE    = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/
const PHONE_RE    = /(\+49|0049|0\d{2,4})[\s\-\/(]?\d[\d\s\-\/]{4,}/
const WHATSAPP_RE = /whatsapp|telegram|signal|viber/i
const CONTACT_RE  = /rufen Sie (uns|mich) an|schreiben Sie (uns|mir|an)|kontaktieren Sie (uns|mich)|erreichen Sie uns|per (E-Mail|Mail|Telefon|Tel\.?)[ ,]/i
const URL_RE      = /(?:https?:\/\/|www\.)[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}/i

function detectLeakage(text: string): string | null {
  if (!text) return null
  if (EMAIL_RE.test(text))    return 'E-Mail-Adresse erkannt'
  if (PHONE_RE.test(text))    return 'Telefonnummer erkannt'
  if (WHATSAPP_RE.test(text)) return 'Messenger-Hinweis erkannt'
  if (CONTACT_RE.test(text))  return 'Direkte Kontaktaufforderung erkannt'
  if (URL_RE.test(text))      return 'Website-Link erkannt'
  return null
}

interface ValidationError { field: string; label: string; reason: string }

function validateProfile(s: ProfileSuggestion): ValidationError[] {
  const errors: ValidationError[] = []
  const check = (v: string | null | undefined, field: string, label: string) => {
    const issue = detectLeakage(v ?? '')
    if (issue) errors.push({ field, label, reason: issue })
  }
  check(s.bio,             'bio',             'Bio')
  check(s.positioning,     'positioning',     'Positionierung')
  check(s.seo_title,       'seo_title',       'SEO-Titel')
  check(s.seo_description, 'seo_description', 'SEO-Beschreibung')
  ;(s.services ?? []).forEach((svc, i) => {
    const issue = detectLeakage(svc)
    if (issue) errors.push({ field: `service_${i}`, label: 'Leistungen', reason: `"${svc}": ${issue}` })
  })
  return errors
}

function fieldError(errors: ValidationError[], field: string): string | null {
  return errors.find((e) => e.field === field)?.reason ?? null
}

// ── Step indicator ─────────────────────────────────────────────────────────────

const STEPS = ['Website', 'Analyse', 'Vorschlag', 'Bearbeiten', 'Vorschau', 'Fertig']

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-10 select-none">
      {STEPS.map((label, i) => {
        const done   = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                done   && 'bg-blue-600 border-blue-600 text-white',
                active && 'bg-white border-blue-600 text-blue-600',
                !done && !active && 'bg-white border-slate-200 text-slate-400',
              )}>
                {done ? <CheckCircle className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
              </div>
              <span className={cn(
                'hidden sm:block text-[10px] font-medium whitespace-nowrap',
                active ? 'text-blue-600' : done ? 'text-slate-500' : 'text-slate-300',
              )}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'w-8 sm:w-14 h-px mx-2 mb-3 sm:mb-4 transition-colors',
                i < current ? 'bg-blue-600' : 'bg-slate-200',
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── URL validation ─────────────────────────────────────────────────────────────

const ALLOWED_TLDS = new Set(['de', 'com', 'at', 'ch', 'net', 'org', 'io', 'eu'])

function validateUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return 'Bitte gib eine Website-Adresse ein.'

  // Normalize: URL() needs a protocol to parse correctly
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  let hostname: string
  try {
    hostname = new URL(withProtocol).hostname.toLowerCase()
  } catch {
    return 'Die Website konnte nicht verarbeitet werden. Bitte prüfe die Adresse.'
  }

  const tld = hostname.split('.').pop() ?? ''
  if (!hostname.includes('.') || !ALLOWED_TLDS.has(tld)) {
    return 'Die Website konnte nicht verarbeitet werden. Bitte prüfe die Adresse.'
  }

  return null
}

function validateOptionalUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const { hostname } = new URL(withProtocol)
    if (!hostname.includes('.')) throw new Error()
    return null
  } catch {
    return 'Ungültige URL – bitte vollständige Adresse angeben.'
  }
}

// ── Step 1: URL input ──────────────────────────────────────────────────────────

function StepUrl({ onSubmit }: { onSubmit: (url: string) => void }) {
  const [value, setValue]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const inputRef              = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    if (error) setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    const err = validateUrl(value)
    if (err) { setError(err); return }

    setLoading(true)
    setError(null)

    // Stub delay: gives the analysis step time to mount before handing off
    const delay = 1800 + Math.random() * 700
    setTimeout(() => {
      setLoading(false)
      onSubmit(value.trim())
    }, delay)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          Profil in 5 Minuten erstellen
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Gib deine Website-Adresse ein. MaklerOS analysiert sie automatisch
          und erstellt einen fertigen Profilvorschlag.
        </p>
      </div>

      {/* Input card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-5">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Deine Website
        </label>
        <form onSubmit={handleSubmit} noValidate>
          {/* Desktop: flex row — Input nimmt Platz, Button kompakt rechts */}
          {/* Mobile: flex-col */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="beispiel-makler.de"
                disabled={loading}
                aria-invalid={!!error}
                className={cn(
                  'w-full text-base py-3 pl-10 pr-4 rounded-lg border transition-colors',
                  'focus:outline-none focus:ring-2 placeholder-slate-400 text-slate-900',
                  error
                    ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-400'
                    : 'border-slate-200 bg-white focus:ring-blue-400 focus:border-blue-400',
                  loading && 'opacity-60 cursor-not-allowed',
                )}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 shrink-0 px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Wird erstellt…
                </>
              ) : (
                <>
                  Profilvorschlag erstellen
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Error — below the full row */}
          {error && (
            <p className="mt-2.5 text-xs text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </p>
          )}
        </form>

        {!error && (
          <p className="text-xs text-slate-400 mt-3">
            Unterstützt: .de · .com · .at · .ch — mit oder ohne https://
          </p>
        )}
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { title: 'Automatische Analyse',   desc: 'Firmenname, Adresse und Kontaktdaten werden direkt erkannt.' },
          { title: 'KI-Profiltext',           desc: 'Bio, SEO-Titel und Beschreibung werden automatisch generiert.' },
          { title: 'Vollständig editierbar',  desc: 'Alle Vorschläge können vor der Veröffentlichung geprüft werden.' },
        ].map((f) => (
          <div key={f.title} className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5">
            <p className="text-sm font-semibold text-slate-800 mb-1">{f.title}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step 2: Analysis ───────────────────────────────────────────────────────────

const ANALYSIS_STEPS = [
  'Website wird aufgerufen …',
  'Firmendaten werden gelesen …',
  'Kontaktinformationen werden erkannt …',
  'KI generiert Profiltext …',
  'SEO-Daten werden optimiert …',
  'Profil wird zusammengestellt …',
]

function StepAnalysis({ domain, onDone }: {
  domain: string
  onDone: (s: ProfileSuggestion, confidence: number) => void
}) {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [error, setError]               = useState<string | null>(null)
  const started                         = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const stepDelay = 3200 / ANALYSIS_STEPS.length
    ANALYSIS_STEPS.forEach((_, i) => {
      setTimeout(() => setVisibleSteps(i + 1), stepDelay * i + 200)
    })
    analyzeWebsite(domain)
      .then(({ suggestion, analysis }) => onDone(suggestion, analysis.confidence))
      .catch(() => setError('Die Website konnte nicht analysiert werden. Bitte versuche es erneut.'))
  }, [domain, onDone])

  if (error) {
    return (
      <div className="max-w-sm mx-auto text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <p className="font-semibold text-slate-900 mb-1">Analyse fehlgeschlagen</p>
        <p className="text-sm text-slate-500 mb-5">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Erneut versuchen
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="text-center mb-6">
        <div className="w-11 h-11 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        </div>
        <p className="font-semibold text-slate-900">Profil wird erstellt</p>
        <p className="text-sm text-slate-400 mt-0.5">{domain}</p>
      </div>

      <div className="space-y-2">
        {ANALYSIS_STEPS.map((step, i) => {
          const shown = i < visibleSteps
          const done  = i < visibleSteps - 1
          return (
            <div
              key={step}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-all duration-300',
                !shown && 'opacity-0',
                shown && done  && 'bg-green-50 border-green-200 text-green-700',
                shown && !done && 'bg-blue-50 border-blue-200 text-blue-700',
              )}
            >
              <div className="w-4 h-4 flex-shrink-0">
                {done  ? <CheckCircle className="w-4 h-4 text-green-500" /> :
                 shown ? <Loader2 className="w-4 h-4 text-blue-500 animate-spin" /> : null}
              </div>
              <span className="font-medium">{step}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Profile preview (matches real profile page design) ────────────────────────

const TIER_BADGE_VARIANT: Record<string, 'default' | 'blue' | 'green' | 'amber'> = {
  free:    'default',
  basic:   'blue',
  pro:     'green',
  premium: 'amber',
}

// Inline-style gradients — Tailwind v4 safe (no dynamic class composition)
const COVER_GRADIENT: Record<string, string> = {
  premium: 'linear-gradient(135deg, #78350f 0%, #92400e 50%, #713f12 100%)',
  pro:     'linear-gradient(135deg, #172554 0%, #1e3a8a 50%, #1e40af 100%)',
  basic:   'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  free:    'linear-gradient(135deg, #334155 0%, #475569 100%)',
}

function ProfilePreview({ s }: { s: ProfileSuggestion }) {
  const contacts     = s.contact_persons ?? []
  const specs        = s.specializations ?? []
  const services     = s.services        ?? []
  const filledGallery = (s.gallery ?? []).filter((img) => img.url)
  const coverGrad    = COVER_GRADIENT[s.tier ?? 'free'] ?? COVER_GRADIENT.free

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Cover — h-40 matches real profile page proportions, inline style avoids Tailwind v4 purge */}
      <div className="relative h-40" style={{ background: coverGrad }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="px-6 sm:px-8 pb-8">
        {/* Avatar — size="profile" (96px) overlaps cover with -mt-12 */}
        <div className="-mt-12 mb-4">
          <BrokerAvatar
            name={contacts[0]?.name ?? s.company ?? ''}
            photoUrl={s.logo_url}
            tier={s.tier ?? 'free'}
            size="profile"
            className="border-4 border-white shadow-lg"
          />
        </div>

        {/* Firma + Tier-Badge + Geprüft */}
        <div className="flex items-center flex-wrap gap-2 mb-1.5">
          <h3 className="text-2xl font-bold text-slate-900 leading-tight">{s.company}</h3>
          <Badge variant={TIER_BADGE_VARIANT[s.tier ?? 'free'] ?? 'default'}>
            {tierLabel(s.tier ?? 'free')}
          </Badge>
          {s.tier !== 'free' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Geprüftes Profil
            </span>
          )}
        </div>

        {/* Ansprechpartner */}
        {contacts.length > 0 && (
          <p className="text-sm text-slate-500 mb-2">
            Ansprechpartner:{' '}
            <span className="font-medium text-slate-700">
              {contacts.map((cp) => cp.role ? `${cp.name} (${cp.role})` : cp.name).join(', ')}
            </span>
          </p>
        )}

        {/* Standort */}
        {s.city && (
          <p className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            {s.city}{s.district ? ` · ${s.district}` : ''}{s.zip ? ` (${s.zip})` : ''}
          </p>
        )}

        {/* Spezialisierungen */}
        {specs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {specs.map((slug) => (
              <span key={slug} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                {SPEC_LABELS[slug] ?? slug}
              </span>
            ))}
          </div>
        )}

        {/* Bio */}
        {s.bio && (
          <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-5 mb-5">
            {s.bio}
          </p>
        )}

        {/* Leistungen */}
        {services.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Leistungen</p>
            <div className="flex flex-wrap gap-1.5">
              {services.map((svc) => <Badge key={svc} variant="blue">{svc}</Badge>)}
            </div>
          </div>
        )}

        {/* Galerie — nur wenn mindestens eine URL vorhanden */}
        {filledGallery.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Galerie · {filledGallery.length} {filledGallery.length === 1 ? 'Foto' : 'Fotos'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {filledGallery.slice(0, 6).map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={img.title ?? `Referenzbild ${i + 1}`}
                  className="w-full aspect-[4/3] object-cover rounded-xl bg-slate-100"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Google-Vorschau */}
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Google-Vorschau</p>
          <p className="text-xs text-slate-400 mb-1">
            makleros.de › makler › {(s.company ?? '').toLowerCase().replace(/\s+/g, '-')}
          </p>
          <p className="text-sm font-medium text-blue-700 leading-snug mb-1.5">{s.seo_title}</p>
          <p className="text-xs text-slate-500 leading-relaxed">{s.seo_description}</p>
        </div>

        {/* Rechtliches — nur ab Basic und wenn befüllt */}
        {s.tier !== 'free' && (s.impressum_url || s.datenschutz_url || s.ust_id) && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {s.impressum_url  && <span className="text-xs text-slate-400">Impressum</span>}
              {s.datenschutz_url && <span className="text-xs text-slate-400">Datenschutz</span>}
              {s.ust_id         && <span className="text-xs text-slate-400">USt-IdNr.: {s.ust_id}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Lead-Guard banner ──────────────────────────────────────────────────────────

function LeadGuardBanner({ errors }: { errors: ValidationError[] }) {
  if ((errors ?? []).length === 0) return null
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
      <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-red-800 mb-0.5">Direkte Kontaktdaten gefunden</p>
        <p className="text-xs text-red-600 mb-2">
          Alle Anfragen laufen über MaklerOS. Direkte Kontaktdaten in Profiltexten sind nicht erlaubt.
        </p>
        <ul className="space-y-1">
          {errors.map((e, i) => (
            <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
              <span className="mt-1 w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
              <span><span className="font-medium">{e.label}:</span> {e.reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ── Step 3: Vorschlag (recognized data, no publish yet) ───────────────────────

function StepVorschlag({ suggestion, onEdit }: {
  suggestion: ProfileSuggestion
  onEdit:    () => void
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Dein Profilvorschlag</h2>
        <p className="text-sm text-slate-500">
          MaklerOS hat diese Daten von deiner Website erkannt. Prüfe und bearbeite sie vor der Veröffentlichung.
        </p>
      </div>

      <ProfilePreview s={suggestion} />

      <div className="mt-5">
        <button
          onClick={onEdit}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-sm py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Profil bearbeiten
        </button>
      </div>
    </div>
  )
}

// ── Step 5: Final preview before publish ───────────────────────────────────────

function StepFinalPreview({ suggestion, onBack, onPublish }: {
  suggestion: ProfileSuggestion
  onBack:    () => void
  onPublish: () => void
}) {
  const errors  = validateProfile(suggestion)
  const blocked = errors.length > 0

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Vorschau</h2>
        <p className="text-sm text-slate-500">
          So sieht dein Profil auf MaklerOS aus. Jetzt kannst du es veröffentlichen.
        </p>
      </div>

      {blocked && <div className="mb-4"><LeadGuardBanner errors={errors} /></div>}

      <ProfilePreview s={suggestion} />

      <div className="flex gap-3 mt-5">
        <button
          onClick={onBack}
          className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 font-semibold text-sm py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Zurück bearbeiten
        </button>
        <button
          onClick={onPublish}
          disabled={blocked}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Profil veröffentlichen
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── Step 4: Edit ───────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
      {children}
    </label>
  )
}

function FieldError({ msg }: { msg: string | null }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
      <ShieldAlert className="w-3 h-3 flex-shrink-0" />{msg}
    </p>
  )
}

function Field({ label, error, children }: { label: string; error?: string | null; children: React.ReactNode }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {children}
      <FieldError msg={error ?? null} />
    </div>
  )
}

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 pt-1 pb-3 border-b border-slate-100">
      <Icon className="w-4 h-4 text-slate-400" />
      {children}
    </div>
  )
}

function LegalUrlField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [localErr, setLocalErr] = useState<string | null>(null)
  const handleBlur = () => setLocalErr(validateOptionalUrl(value))
  return (
    <Field label={label} error={localErr}>
      <input
        className={localErr ? INPUT_ERR : INPUT}
        value={value}
        onChange={(e) => { onChange(e.target.value); setLocalErr(null) }}
        onBlur={handleBlur}
        placeholder="https://beispiel.de/impressum"
      />
    </Field>
  )
}

// sub-editors

function ContactPersonsEditor({ persons, onChange }: {
  persons:  ContactPerson[]
  onChange: (p: ContactPerson[]) => void
}) {
  const safe = persons ?? []
  const update = (i: number, k: keyof ContactPerson, v: string) =>
    onChange(safe.map((p, idx) => idx === i ? { ...p, [k]: v } : p))
  return (
    <div className="space-y-2">
      {safe.map((cp, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1 grid sm:grid-cols-2 gap-2">
            <input className={INPUT} placeholder="Name"
              value={cp.name ?? ''} onChange={(e) => update(i, 'name', e.target.value)} />
            <input className={INPUT} placeholder="Position / Rolle"
              value={cp.role ?? ''} onChange={(e) => update(i, 'role', e.target.value)} />
          </div>
          <button type="button"
            onClick={() => onChange(safe.filter((_, idx) => idx !== i))}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button type="button"
        onClick={() => onChange([...safe, { name: '', role: '' }])}
        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        <Plus className="w-4 h-4" />Ansprechpartner hinzufügen
      </button>
    </div>
  )
}

function ServicesEditor({ services, errors, onChange }: {
  services: string[]
  errors:   ValidationError[]
  onChange: (s: string[]) => void
}) {
  const safe = services ?? []
  return (
    <div className="space-y-2">
      {safe.map((svc, i) => {
        const err = fieldError(errors, `service_${i}`)
        return (
          <div key={i}>
            <div className="flex gap-2 items-center">
              <input
                className={cn('flex-1', err ? INPUT_ERR : INPUT)}
                placeholder="Leistung eingeben …"
                value={svc ?? ''}
                onChange={(e) => onChange(safe.map((s, idx) => idx === i ? e.target.value : s))}
              />
              <button type="button"
                onClick={() => onChange(safe.filter((_, idx) => idx !== i))}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <FieldError msg={err} />
          </div>
        )
      })}
      <button type="button"
        onClick={() => onChange([...safe, ''])}
        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        <Plus className="w-4 h-4" />Leistung hinzufügen
      </button>
    </div>
  )
}

// ── Logo / Profilbild editor ───────────────────────────────────────────────────

const LOGO_UPLOAD_ID = 'logo-file-upload'

function LogoEditor({ logoUrl, name, tier, onChange }: {
  logoUrl:  string | null
  name:     string
  tier:     string
  onChange: (url: string | null) => void
}) {
  // Track blob URL we created so we can revoke it when replaced
  const prevBlobRef = useRef<string | null>(
    logoUrl?.startsWith('blob:') ? logoUrl : null,
  )

  // URL text field only shows http(s) URLs, never blob URLs
  const [inputUrl, setInputUrl] = useState(
    logoUrl && !logoUrl.startsWith('blob:') ? logoUrl : '',
  )

  const isBlob = logoUrl?.startsWith('blob:') ?? false

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Free previous blob if we created it
    if (prevBlobRef.current) URL.revokeObjectURL(prevBlobRef.current)
    const blob = URL.createObjectURL(file)
    prevBlobRef.current = blob
    setInputUrl('')        // upload takes priority — clear URL field
    onChange(blob)
    e.target.value = ''   // allow re-selecting same file
  }

  const handleUrlChange = (val: string) => {
    // Switching to URL: release any blob we own
    if (prevBlobRef.current) {
      URL.revokeObjectURL(prevBlobRef.current)
      prevBlobRef.current = null
    }
    setInputUrl(val)
    onChange(val.trim() || null)
  }

  const handleClear = () => {
    if (prevBlobRef.current) {
      URL.revokeObjectURL(prevBlobRef.current)
      prevBlobRef.current = null
    }
    setInputUrl('')
    onChange(null)
  }

  return (
    <div className="space-y-4">
      {/* Hidden file input — triggered by label below */}
      <input
        id={LOGO_UPLOAD_ID}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />

      {/* Upload zone — label triggers file picker, fully interactive */}
      <label
        htmlFor={LOGO_UPLOAD_ID}
        className="flex flex-col items-center w-full border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer select-none"
      >
        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center mb-3 shadow-sm">
          <Upload className="w-5 h-5 text-slate-400" />
        </div>
        <span className="text-sm font-medium text-slate-700 mb-1">
          {isBlob ? 'Andere Datei wählen' : 'Logo oder Profilbild hochladen'}
        </span>
        <span className="text-xs text-slate-400">
          {isBlob ? 'Klicken zum Ersetzen' : 'PNG · JPG · SVG · WebP — max. 2 MB'}
        </span>
      </label>

      {/* URL alternative */}
      <div>
        <p className="text-xs font-medium text-slate-500 mb-1.5">Oder Bild-URL einfügen</p>
        <div className="flex gap-2">
          <input
            type="text"
            className={cn(INPUT, 'flex-1')}
            placeholder="https://meine-domain.de/logo.png"
            value={inputUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
          {logoUrl && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              aria-label="Bild entfernen"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live preview — always visible */}
      <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <BrokerAvatar
          name={name || 'Unbekannt'}
          photoUrl={logoUrl}
          tier={tier || 'free'}
          size="card"
          className="flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-700">
            {isBlob ? 'Lokale Datei (Vorschau)' : logoUrl ? 'Vorschau Profilbild' : 'Initialen-Fallback'}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isBlob
              ? 'Lokal ausgewählt — nur in dieser Sitzung sichtbar.'
              : logoUrl
                ? 'So erscheint dein Bild im öffentlichen Profil.'
                : 'Wird angezeigt, bis ein Bild hinterlegt ist.'}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Gallery / Referenzbilder editor ───────────────────────────────────────────

function GalleryEditor({ gallery, onChangeGallery }: {
  gallery:         GalleryImage[]
  onChangeGallery: (g: GalleryImage[]) => void
}) {
  const safe = gallery ?? []
  const updateItem = (i: number, k: keyof GalleryImage, v: string) =>
    onChangeGallery(safe.map((img, idx) => idx === i ? { ...img, [k]: v } : img))

  return (
    <div className="space-y-2">
      {safe.map((img, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1 grid sm:grid-cols-2 gap-2">
            <input
              className={INPUT}
              placeholder="Bild-URL (https://…)"
              value={img.url ?? ''}
              onChange={(e) => updateItem(i, 'url', e.target.value)}
            />
            <input
              className={INPUT}
              placeholder="Titel (optional)"
              value={img.title ?? ''}
              onChange={(e) => updateItem(i, 'title', e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => onChangeGallery(safe.filter((_, idx) => idx !== i))}
            className="mt-0.5 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            aria-label="Bild entfernen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChangeGallery([...safe, { url: '' }])}
        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        <Plus className="w-4 h-4" />Bild hinzufügen
      </button>
    </div>
  )
}

function StepEdit({ suggestion, onDone, onBack }: {
  suggestion: ProfileSuggestion
  onDone:     (s: ProfileSuggestion) => void
  onBack:     () => void
}) {
  const [s, setS]     = useState<ProfileSuggestion>({
    ...suggestion,
    contact_persons: suggestion.contact_persons ?? [],
    services:        suggestion.services        ?? [],
    specializations: suggestion.specializations ?? [],
    gallery:         suggestion.gallery         ?? [],
    logo_url:        suggestion.logo_url        ?? null,
  })
  const [errors, setErrors] = useState<ValidationError[]>([])

  const set = <K extends keyof ProfileSuggestion>(k: K, v: ProfileSuggestion[K]) =>
    setS((prev) => ({ ...prev, [k]: v }))

  const toggleSpec = (slug: string) =>
    setS((prev) => {
      const specs = prev.specializations ?? []
      return {
        ...prev,
        specializations: specs.includes(slug) ? specs.filter((x) => x !== slug) : [...specs, slug],
      }
    })

  const handleSave = () => {
    const errs = validateProfile(s)
    if (errs.length > 0) {
      setErrors(errs)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors([])
    onDone(s)
  }

  const specs = s.specializations ?? []

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Zurück zum Vorschlag
        </button>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Profil bearbeiten</h2>
        <p className="text-sm text-slate-500">
          Alle Felder sind editierbar — prüfe und ergänze deine Angaben vor der Veröffentlichung.
        </p>
      </div>

      {errors.length > 0 && <div className="mb-5"><LeadGuardBanner errors={errors} /></div>}

      <div className="space-y-6">

        {/* Tarif */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <SectionTitle icon={Tag}>Tarif wählen</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['free', 'basic', 'pro', 'premium'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set('tier', t)}
                className={cn(
                  'py-2 px-3 rounded-lg border text-xs font-semibold transition-colors text-center',
                  s.tier === t
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600',
                )}
              >
                {tierLabel(t)}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Tarif jederzeit nach Veröffentlichung änderbar. <Link href="/preise" className="underline hover:text-slate-600" target="_blank">Preise ansehen</Link>
          </p>
        </div>

        {/* Firma */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <SectionTitle icon={Building2}>Firma</SectionTitle>
          <Field label="Firmenname">
            <input className={INPUT} value={s.company ?? ''} onChange={(e) => set('company', e.target.value)} />
          </Field>
          <Field label="Positionierung" error={fieldError(errors, 'positioning')}>
            <input
              className={fieldError(errors, 'positioning') ? INPUT_ERR : INPUT}
              value={s.positioning ?? ''}
              onChange={(e) => set('positioning', e.target.value)}
            />
          </Field>
        </div>

        {/* Ansprechpartner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <SectionTitle icon={User}>Ansprechpartner</SectionTitle>
          <ContactPersonsEditor
            persons={s.contact_persons ?? []}
            onChange={(p) => set('contact_persons', p)}
          />
        </div>

        {/* Standort */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <SectionTitle icon={MapPin}>Standort</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Stadt">
              <input className={INPUT} value={s.city ?? ''} onChange={(e) => set('city', e.target.value)} />
            </Field>
            <Field label="Stadtteil">
              <input className={INPUT} value={s.district ?? ''} onChange={(e) => set('district', e.target.value)} />
            </Field>
            <Field label="Adresse">
              <input className={INPUT} value={s.address ?? ''} onChange={(e) => set('address', e.target.value)} />
            </Field>
            <Field label="PLZ">
              <input className={INPUT} value={s.zip ?? ''} onChange={(e) => set('zip', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Website (intern) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <SectionTitle icon={Phone}>Website</SectionTitle>
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-xs text-amber-700">
            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>Intern gespeichert – nicht als direkter Kontaktkanal im Profil sichtbar. Alle Anfragen laufen über MaklerOS.</span>
          </div>
          <Field label="Eigene Website">
            <input className={INPUT} value={s.website ?? ''} onChange={(e) => set('website', e.target.value)} />
          </Field>
        </div>

        {/* Profilbild / Logo */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <SectionTitle icon={ImageIcon}>Profilbild / Logo</SectionTitle>
          <LogoEditor
            logoUrl={s.logo_url ?? null}
            name={(s.contact_persons ?? [])[0]?.name ?? s.company ?? ''}
            tier={s.tier ?? 'free'}
            onChange={(u) => set('logo_url', u)}
          />
        </div>

        {/* Referenzbilder / Galerie */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <SectionTitle icon={ImageIcon}>Referenzbilder / Galerie</SectionTitle>
          <p className="text-xs text-slate-400">
            Zeige echte Objektfotos auf deinem Profil. Nur sichtbar wenn Bilder hinterlegt sind.
          </p>
          <GalleryEditor
            gallery={s.gallery ?? []}
            onChangeGallery={(g) => set('gallery', g)}
          />
        </div>

        {/* Bio */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <SectionTitle icon={Edit3}>Profiltext</SectionTitle>
          <Field label="Bio" error={fieldError(errors, 'bio')}>
            <textarea
              className={cn(fieldError(errors, 'bio') ? INPUT_ERR : INPUT, 'resize-none h-28')}
              value={s.bio ?? ''}
              onChange={(e) => set('bio', e.target.value)}
            />
          </Field>
        </div>

        {/* Leistungen */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <SectionTitle icon={Briefcase}>Leistungen</SectionTitle>
          <ServicesEditor
            services={s.services ?? []}
            errors={errors}
            onChange={(sv) => set('services', sv)}
          />
        </div>

        {/* Spezialisierungen */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <SectionTitle icon={Tag}>Spezialisierungen</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {ALL_SPECS.map((slug) => {
              const active = specs.includes(slug)
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => toggleSpec(slug)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors',
                    active
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600',
                  )}
                >
                  {SPEC_LABELS[slug]}
                </button>
              )
            })}
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <SectionTitle icon={Globe}>SEO</SectionTitle>
          <Field label="SEO-Titel" error={fieldError(errors, 'seo_title')}>
            <input
              className={fieldError(errors, 'seo_title') ? INPUT_ERR : INPUT}
              value={s.seo_title ?? ''}
              onChange={(e) => set('seo_title', e.target.value)}
              maxLength={70}
            />
            <p className="mt-1 text-right text-xs text-slate-400">{(s.seo_title ?? '').length}/70</p>
          </Field>
          <Field label="SEO-Beschreibung" error={fieldError(errors, 'seo_description')}>
            <textarea
              className={cn(fieldError(errors, 'seo_description') ? INPUT_ERR : INPUT, 'resize-none h-20')}
              value={s.seo_description ?? ''}
              onChange={(e) => set('seo_description', e.target.value)}
              maxLength={160}
            />
            <p className="mt-1 text-right text-xs text-slate-400">{(s.seo_description ?? '').length}/160</p>
          </Field>
        </div>

        {/* Rechtliches — nur ab Basic */}
        {s.tier !== 'free' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <SectionTitle icon={ShieldAlert}>Rechtliches</SectionTitle>
            <p className="text-xs text-slate-400">
              Optional. Werden dezent im unteren Bereich deines öffentlichen Profils angezeigt.
            </p>
            <LegalUrlField
              label="Impressum URL"
              value={s.impressum_url ?? ''}
              onChange={(v) => set('impressum_url', v || null)}
            />
            <LegalUrlField
              label="Datenschutz URL"
              value={s.datenschutz_url ?? ''}
              onChange={(v) => set('datenschutz_url', v || null)}
            />
            <Field label="USt-IdNr. / UID (optional)">
              <input
                className={INPUT}
                value={s.ust_id ?? ''}
                onChange={(e) => set('ust_id', e.target.value || null)}
                placeholder="DE123456789"
                maxLength={30}
              />
            </Field>
          </div>
        )}
      </div>

      {/* Save */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-sm py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Vorschau anzeigen
          <ArrowRight className="w-4 h-4" />
        </button>
        {errors.length > 0 && (
          <p className="mt-2 text-center text-xs text-red-500 flex items-center justify-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Bitte entferne die markierten Angaben, um fortzufahren.
          </p>
        )}
      </div>
    </div>
  )
}

// ── Step 5: Success ────────────────────────────────────────────────────────────

function StepSuccess({ suggestion }: { suggestion: ProfileSuggestion }) {
  return (
    <div className="max-w-md mx-auto text-center">
      {/* Icon */}
      <div className="w-16 h-16 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Profil erfolgreich veröffentlicht</h2>
      <p className="text-slate-500 text-sm leading-relaxed mb-2">
        <span className="font-semibold text-slate-700">{suggestion.company}</span> ist jetzt bei MaklerOS registriert.
      </p>
      <p className="text-slate-400 text-sm mb-10">
        Unser Team prüft deinen Eintrag und schaltet ihn in Kürze frei.
        Nach der Freischaltung ist dein Profil in der Maklersuche sichtbar.
      </p>

      {/* Summary card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left mb-8 space-y-4">
        {[
          { icon: Building2, label: 'Firma',      value: suggestion.company ?? '–' },
          { icon: MapPin,    label: 'Standort',   value: [suggestion.city, suggestion.district].filter(Boolean).join(' · ') || '–' },
          { icon: Globe,     label: 'Tarif',      value: tierLabel(suggestion.tier ?? 'free') },
          { icon: Link2,     label: 'Profil-URL', value: `/profil/${suggestion.slug}` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4">
            <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-sm font-medium text-slate-800 truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <Link
        href={`/profil/${suggestion.slug}`}
        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-sm px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Profil ansehen
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

// ── Wizard root ────────────────────────────────────────────────────────────────

type WizardStep = 0 | 1 | 2 | 3 | 4 | 5

export function OnboardingWizard() {
  const [step, setStep]             = useState<WizardStep>(0)
  const [domain, setDomain]         = useState('')
  const [suggestion, setSuggestion] = useState<ProfileSuggestion | null>(null)
  const [confidence, setConfidence] = useState(0)

  const handleUrl = (url: string) => {
    setDomain(url.trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').toLowerCase())
    setStep(1)
  }

  const handleAnalysisDone = (s: ProfileSuggestion, conf: number) => {
    setSuggestion({
      ...s,
      contact_persons: s.contact_persons ?? [],
      services:        s.services        ?? [],
      specializations: s.specializations ?? [],
      gallery:         s.gallery         ?? [],
      logo_url:        s.logo_url        ?? null,
    })
    setConfidence(conf)
    setStep(2)
  }

  // confidence is kept for future use (e.g. completeness hints)
  void confidence

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <StepBar current={step} />

        {step === 0 && <StepUrl onSubmit={handleUrl} />}
        {step === 1 && <StepAnalysis domain={domain} onDone={handleAnalysisDone} />}
        {step === 2 && suggestion && (
          <StepVorschlag
            suggestion={suggestion}
            onEdit={() => setStep(3)}
          />
        )}
        {step === 3 && suggestion && (
          <StepEdit
            suggestion={suggestion}
            onDone={(s) => { setSuggestion(s); setStep(4) }}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && suggestion && (
          <StepFinalPreview
            suggestion={suggestion}
            onBack={() => setStep(3)}
            onPublish={() => setStep(5)}
          />
        )}
        {step === 5 && suggestion && <StepSuccess suggestion={suggestion} />}
      </div>
    </div>
  )
}
