import type { Metadata } from 'next'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'

export const metadata: Metadata = {
  title: 'Profil erstellen | MaklerOS',
  description: 'Gib deine Website ein – MaklerOS erstellt dein fertiges Premiumprofil in Sekunden. KI-gestützte Analyse, sofort einsatzbereit.',
}

export default function ProfilErstellenPage() {
  return <OnboardingWizard />
}
