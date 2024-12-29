'use client'

import { Button } from '@/components/ui/button'

interface WelcomeScreenProps {
  onStart: () => void
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold text-purple-600">Excalidraw Clone</h1>
        <p className="text-gray-500">All your data is saved locally in your browser.</p>
        <div className="space-y-2">
          <Button onClick={onStart} className="w-full">
            Start Drawing
          </Button>
          <Button variant="outline" className="w-full">
            Open
          </Button>
          <Button variant="ghost" className="w-full">
            Help
          </Button>
          <Button variant="ghost" className="w-full">
            Live collaboration...
          </Button>
        </div>
      </div>
    </div>
  )
}

