import { NextRequest, NextResponse } from 'next/server'
import { saveValuation, getValuations } from '@/lib/demo-store'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      property_type, area_sqm, year_built, condition, city, zip,
      has_garden, has_parking, estimated_min, estimated_max,
      lead_email, lead_name,
    } = body

    if (!property_type || !area_sqm || !city) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 })
    }

    saveValuation({
      property_type, area_sqm, year_built, condition, city, zip,
      has_garden, has_parking, estimated_min, estimated_max,
      lead_email, lead_name,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const valuations = getValuations()
    return NextResponse.json({ valuations, count: valuations.length })
  } catch {
    return NextResponse.json({ error: 'Interner Fehler.' }, { status: 500 })
  }
}
