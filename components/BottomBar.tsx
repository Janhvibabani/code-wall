'use client'

import { Button } from '@/components/ui/button'
import { Minus, Plus, Undo, Redo } from 'lucide-react'

interface BottomBarProps {
  zoom: number
  setZoom: (zoom: number) => void
  onUndo: () => void
  onRedo: () => void
}

export default function BottomBar({ zoom, setZoom, onUndo, onRedo }: BottomBarProps) {
  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 200))
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 10))

  return (
    <div className="h-12 border-t flex items-center justify-between px-4 bg-white">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleZoomOut}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-16 text-center">{zoom}%</span>
        <Button variant="ghost" size="icon" onClick={handleZoomIn}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onUndo}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onRedo}>
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

