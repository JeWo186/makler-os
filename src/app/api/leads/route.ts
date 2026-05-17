import { NextRequest, NextResponse } from 'next/server'
import { saveLead, getLeads } from '@/lib/demo-store'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message, broker_id, intent, city, property_type } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name und E-Mail sind erforderlich.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 })
    }

    saveLead({ name, email, phone, message, broker_id, intent, city, property_type })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const leads = getLeads()
    return NextResponse.json({ leads, count: leads.length })
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}
