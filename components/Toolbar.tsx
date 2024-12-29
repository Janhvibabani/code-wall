'use client'

import { Button } from '@/components/ui/button'
import { Lock, MousePointer, Square, Circle, ArrowRight, Minus, Pencil, Type, ImageIcon, Library } from 'lucide-react'

interface ToolbarProps {
  activeTool: string
  setActiveTool: (tool: string) => void
}

export default function Toolbar({ activeTool, setActiveTool }: ToolbarProps) {
  const tools = [
    { id: 'lock', icon: Lock, label: 'Lock' },
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'pencil', icon: Pencil, label: 'Pencil' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'image', icon: ImageIcon, label: 'Image' },
    { id: 'library', icon: Library, label: 'Library' },
  ]

  return (
    <div className="h-16 border-b flex items-center justify-center space-x-2 bg-white">
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={activeTool === tool.id ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => setActiveTool(tool.id)}
          className="w-10 h-10"
        >
          <tool.icon className="h-5 w-5" />
          <span className="sr-only">{tool.label}</span>
        </Button>
      ))}
    </div>
  )
}

