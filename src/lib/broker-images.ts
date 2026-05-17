import type { BrokerTier } from '@/types'

export const GALLERY_LIMITS: Record<BrokerTier, number> = {
  free:    1,
  basic:   5,
  pro:     15,
  premium: 30,
}

export interface BrokerImageData {
  cover_image: string | null
  logo_url: string | null
  gallery_images: string[]
}

// Placeholder – kein Bild mehr für alle Tiers.
// Premium-Galerien werden manuell & gezielt befüllt.
export function getBrokerImages(
  _slug: string,
  _tier: BrokerTier,
  _specSlugs: string[],
): BrokerImageData {
  return {
    cover_image:    null,
    logo_url:       null,
    gallery_images: [],
  }
}
