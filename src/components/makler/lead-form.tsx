'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

interface LeadFormProps {
  brokerId: string
  brokerName: string
}

export function LeadForm({ brokerId, brokerName }: LeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, broker_id: brokerId }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle className="w-10 h-10 text-green-500" />
        <p className="font-semibold text-slate-900">Anfrage gesendet!</p>
        <p className="text-sm text-slate-500">
          {brokerName} meldet sich in Kürze bei Ihnen.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Ihr Name *"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="email"
        placeholder="E-Mail-Adresse *"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="tel"
        placeholder="Telefonnummer"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        placeholder="Ihre Nachricht…"
        rows={3}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />
      {status === 'error' && (
        <p className="text-xs text-red-600">Fehler beim Senden. Bitte versuchen Sie es erneut.</p>
      )}
      <Button type="submit" className="w-full" disabled={status === 'sending'}>
        {status === 'sending' ? 'Wird gesendet…' : 'Anfrage senden'}
      </Button>
      <p className="text-xs text-slate-400 text-center">
        Kostenlos & unverbindlich. Keine Weitergabe Ihrer Daten.
      </p>
    </form>
  )
}
