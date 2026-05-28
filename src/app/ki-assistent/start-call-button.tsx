'use client'

import type { ReactNode } from 'react'

export function StartCallButton({ className, children }: { className: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const widget = document.querySelector('elevenlabs-convai') as any
        if (typeof widget?.startConversation === 'function') {
          widget.startConversation()
        } else {
          const shadowBtn = widget?.shadowRoot?.querySelector('button') as HTMLElement | null
          shadowBtn ? shadowBtn.click() : widget?.click()
        }
      }}
    >
      {children}
    </button>
  )
}
