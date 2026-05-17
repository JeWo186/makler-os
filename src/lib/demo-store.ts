import fs from 'fs'
import path from 'path'

const LEADS_FILE = path.join(process.cwd(), 'demo-leads.json')
const VALUATIONS_FILE = path.join(process.cwd(), 'demo-valuations.json')

function readJsonFile(filePath: string): unknown[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

function appendToFile(filePath: string, entry: object): void {
  const entries = readJsonFile(filePath)
  entries.push({ ...entry, saved_at: new Date().toISOString() })
  fs.writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf-8')
}

export function saveLead(data: object): void {
  appendToFile(LEADS_FILE, data)
}

export function saveValuation(data: object): void {
  appendToFile(VALUATIONS_FILE, data)
}

export function getLeads(): unknown[] {
  return readJsonFile(LEADS_FILE)
}

export function getValuations(): unknown[] {
  return readJsonFile(VALUATIONS_FILE)
}
