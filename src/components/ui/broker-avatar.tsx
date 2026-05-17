'use client'

import { useState } from 'react'
import { personInitials } from '@/lib/utils'

// Inline-Styles statt dynamischer Tailwind-Klassen (Tailwind v4 purge-sicher)
const TIER_GRADIENT: Record<string, string> = {
  premium: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  pro:     'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  basic:   'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
  free:    'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
}

interface BrokerAvatarProps {
  /** Ansprechpartner-Name für Initialen (z.B. broker.name) */
  name: string
  photoUrl?: string | null
  tier: string
  /** card = 64 × 64 px, rounded-xl | profile = 96 × 96 px, rounded-2xl */
  size?: 'card' | 'profile'
  className?: string
}

export function BrokerAvatar({
  name,
  photoUrl,
  tier,
  size = 'card',
  className = '',
}: BrokerAvatarProps) {
  const [imgError, setImgError] = useState(false)

  const initials = personInitials(name)
  const gradient = TIER_GRADIENT[tier] ?? TIER_GRADIENT.free

  const px     = size === 'profile' ? 96 : 64
  const radius = size === 'profile' ? 16 : 12   // rounded-2xl ≈ 1rem, rounded-xl ≈ 0.75rem
  const fs     = size === 'profile' ? '1.5rem' : '1.125rem'

  if (photoUrl && !imgError) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`object-cover flex-shrink-0 ${className}`}
        style={{ width: px, height: px, borderRadius: radius }}
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center font-bold text-white tracking-wide flex-shrink-0 select-none ${className}`}
      style={{ width: px, height: px, borderRadius: radius, background: gradient, fontSize: fs, lineHeight: 1 }}
    >
      {initials}
    </div>
  )
}
