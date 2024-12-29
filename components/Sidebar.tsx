'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { ChevronLeft } from 'lucide-react'

interface SidebarProps {
  strokeColor: string
  setStrokeColor: (color: string) => void
  backgroundColor: string
  setBackgroundColor: (color: string) => void
  strokeWidth: number
  setStrokeWidth: (width: number) => void
  opacity: number
  setOpacity: (opacity: number) => void
}

export default function Sidebar({
  strokeColor,
  setStrokeColor,
  backgroundColor,
  setBackgroundColor,
  strokeWidth,
  setStrokeWidth,
  opacity,
  setOpacity,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const strokeColors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffa500']
  const backgroundColors = ['#ffffff', '#ffcdd2', '#c8e6c9', '#bbdefb', '#fff9c4']

  return (
    <div className={`${isCollapsed ? 'w-12' : 'w-60'} transition-all duration-300 border-r bg-white relative`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 bg-white border rounded-full p-1 hover:bg-gray-50"
      >
        <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      <div className={`p-4 space-y-6 ${isCollapsed ? 'hidden' : 'block'}`}>
        <div>
          <h3 className="text-sm font-medium mb-2">Stroke</h3>
          <div className="space-y-2">
            <div className="relative">
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="absolute opacity-0 w-8 h-8 cursor-pointer"
              />
              <div
                className="w-8 h-8 rounded-lg border-2 border-gray-200"
                style={{ backgroundColor: strokeColor }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {strokeColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setStrokeColor(color)}
                  className={`w-8 h-8 rounded-lg border-2 cursor-pointer ${
                    strokeColor === color ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Background</h3>
          <div className="space-y-2">
            <div className="relative">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="absolute opacity-0 w-8 h-8 cursor-pointer"
              />
              <div
                className="w-8 h-8 rounded-lg border-2 border-gray-200"
                style={{ backgroundColor: backgroundColor }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {backgroundColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setBackgroundColor(color)}
                  className={`w-8 h-8 rounded-lg border-2 cursor-pointer ${
                    backgroundColor === color ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Stroke width</h3>
          <div className="flex items-center gap-2">
            <Slider
              value={[strokeWidth]}
              onValueChange={(value) => setStrokeWidth(value[0])}
              min={1}
              max={20}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 min-w-[2rem]">{strokeWidth}px</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Opacity</h3>
          <div className="flex items-center gap-2">
            <Slider
              value={[opacity]}
              onValueChange={(value) => setOpacity(value[0])}
              min={0}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 min-w-[2rem]">{opacity}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}