import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',')
}

export function tierLabel(tier: string): string {
  const labels: Record<string, string> = {
    free: 'Free',
    basic: 'Basic',
    pro: 'Pro',
    premium: 'Premium',
  }
  return labels[tier] ?? tier
}

export function propertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    wohnung: 'Wohnung',
    haus: 'Haus',
    mfh: 'Mehrfamilienhaus',
    gewerbe: 'Gewerbeimmobilie',
    grundstueck: 'Grundstück',
  }
  return labels[type] ?? type
}

// Avatar-Initialen: erster Buchstabe des Vornamens + erster Buchstabe des Nachnamens
// "Max Mustermann" → "MM", "Patrick Fischer" → "PF", "Angela" → "AN"
export function personInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  return name.trim().slice(0, 2).toUpperCase()
}

// Firmename als Haupttitel (company bevorzugt, sonst name)
export function displayTitle(company: string | null, name: string): string {
  return company ?? name
}

// Ansprechpartner anzeigen wenn von Firmename abweichend
export function displayContact(company: string | null, name: string): string | null {
  if (!company) return null
  if (name.trim() === company.trim()) return null
  return name
}

export const GALLERY_LIMITS: Record<string, number> = {
  free:    0,
  basic:   5,
  pro:     15,
  premium: 30,
}

export function conditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    renovierungsbeduerftig: 'Renovierungsbedürftig',
    normal: 'Normal',
    gut: 'Gut erhalten',
    neuwertig: 'Neuwertig',
  }
  return labels[condition] ?? condition
}
