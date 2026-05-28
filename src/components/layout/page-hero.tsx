import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface PageHeroProps {
  /** h1 — accepts JSX for coloured spans */
  title: ReactNode
  /** Descriptive paragraph below the title */
  subtitle?: ReactNode
  /** Optional pill/badge rendered above the title */
  badge?: ReactNode
  /** Optional breadcrumb nav rendered above the badge */
  breadcrumb?: ReactNode
  /** Optional content below subtitle — CTAs, chip lists, etc. */
  children?: ReactNode
  /** Content alignment: 'left' (default) or 'center' */
  align?: 'left' | 'center'
}

/**
 * Global page hero for all sub-pages.
 * Always: dark gradient · min-h-[360px] · flex items-center · py-24 · max-w-7xl.
 * Homepage keeps its own larger hero. /profil-erstellen stays compact.
 */
export function PageHero({
  title,
  subtitle,
  badge,
  breadcrumb,
  children,
  align = 'left',
}: PageHeroProps) {
  const isCenter = align === 'center'

  return (
    <section className="relative min-h-[360px] flex items-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(29,78,216,0.3),_transparent_60%)]" />

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className={cn('max-w-3xl', isCenter && 'mx-auto text-center')}>
          {breadcrumb}

          {badge && <div className="mb-6">{badge}</div>}

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className={cn(
              'text-slate-300 text-lg leading-relaxed',
              isCenter ? 'max-w-xl mx-auto' : 'max-w-2xl',
            )}>
              {subtitle}
            </p>
          )}

          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  )
}
