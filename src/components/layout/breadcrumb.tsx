import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  /** Omit for the current (last) item */
  href?: string
}

/** Breadcrumb nav styled for dark (hero) backgrounds */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      className="flex items-center gap-1.5 text-sm text-slate-400 mb-6 flex-wrap"
      aria-label="Breadcrumb"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-200">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
