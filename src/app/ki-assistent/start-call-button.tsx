'use client'

import type { ReactNode } from 'react'

export function StartCallButton({ className, children }: { className: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const widget = document.querySelector('elevenlabs-convai') as any
        widget?.startConversation()
      }}
    >
      {children}
    </button>
  )
}
