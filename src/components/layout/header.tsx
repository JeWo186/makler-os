'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

const nav = [
  { href: '/makler',        label: 'Makler finden' },
  { href: '/bewertung',     label: 'Immobilie bewerten' },
  { href: '/ki-assistent',  label: 'KI-Assistent' },
  { href: '/preise',        label: 'Preise' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span>MaklerOS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button size="sm" href="/profil-erstellen">
              Profil eintragen
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setOpen(!open)}
            aria-label="Menü öffnen"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-slate-700 hover:text-blue-600 py-2"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-200">
            <Button className="w-full" href="/profil-erstellen" onClick={() => setOpen(false)}>
              Profil eintragen – kostenlos
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
