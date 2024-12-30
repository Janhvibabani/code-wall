'use client'

import { Button } from '@/components/ui/button'
import { MousePointer2, Square, Circle, Minus, Pencil, Type } from 'lucide-react'

interface ToolbarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

export default function Toolbar({ activeTool, setActiveTool }: ToolbarProps) {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'pencil', icon: Pencil, label: 'Pencil' },
    { id: 'textbox', icon: Type, label: 'Textbox' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
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

