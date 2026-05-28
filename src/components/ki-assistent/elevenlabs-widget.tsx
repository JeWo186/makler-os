'use client'

import Script from 'next/script'
import React from 'react'

export function ElevenLabsWidget() {
  return (
    <div className="flex justify-center mt-6">
      {React.createElement('elevenlabs-convai', {
        'agent-id': 'agent_5101ksfakf3bfnqbeej2h61a9abp',
      })}
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="lazyOnload"
        type="text/javascript"
      />
    </div>
  )
}
