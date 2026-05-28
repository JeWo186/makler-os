import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface PageSectionProps {
  children: ReactNode
  /** Background, border, or other section-level classes (e.g. "bg-slate-50 border-t border-slate-200") */
  className?: string
  /** HTML id for anchor links */
  id?: string
}

/**
 * Standard content section for all sub-pages.
 * Always: py-20 · max-w-7xl · px-6 lg:px-8.
 * Use className for background colour and borders.
 */
export function PageSection({ children, className, id }: PageSectionProps) {
  return (
    <section id={id} className={cn('py-20', className)}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
