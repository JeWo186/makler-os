import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { container, heroPadding } from '@/lib/layout'

export interface PageHeroProps {
  /** h1 text – accepts JSX for coloured spans */
  title: ReactNode
  /** paragraph below the title */
  subtitle?: ReactNode
  /** small pill/badge/eyebrow above the title */
  overline?: ReactNode
  /** breadcrumb nav rendered above overline */
  breadcrumb?: ReactNode
  /** content rendered below the subtitle (CTAs, chip lists, etc.) */
  children?: ReactNode
  /** 'left' (default) or 'center' – controls inner content alignment */
  align?: 'left' | 'center'
}

/**
 * Standard page hero for all sub-pages.
 * Homepage keeps its own larger hero; /profil-erstellen stays compact.
 */
export function PageHero({
  title,
  subtitle,
  overline,
  breadcrumb,
  children,
  align = 'left',
}: PageHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(29,78,216,0.3),_transparent_60%)]" />
      <div className={cn('relative', container, heroPadding)}>
        <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
          {breadcrumb}
          {overline}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h1>
          {subtitle && (
            <p className={cn(
              'text-slate-300 text-lg leading-relaxed',
              align === 'center' ? 'max-w-xl mx-auto' : 'max-w-2xl',
            )}>
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
