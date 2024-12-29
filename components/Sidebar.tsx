'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronLeft } from 'lucide-react'
import { ChromePicker } from 'react-color'

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
          <div className="flex flex-wrap gap-2">
            {strokeColors.map((color) => (
              <Popover key={color}>
                <PopoverTrigger>
                  <div
                    className={`w-8 h-8 rounded-lg border-2 cursor-pointer ${
                      strokeColor === color ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <ChromePicker
                    color={color}
                    onChangeComplete={(newColor) => setStrokeColor(newColor.hex)}
                  />
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Background</h3>
          <div className="flex flex-wrap gap-2">
            {backgroundColors.map((color) => (
              <Popover key={color}>
                <PopoverTrigger>
                  <div
                    className={`w-8 h-8 rounded-lg border-2 cursor-pointer ${
                      backgroundColor === color ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <ChromePicker
                    color={color}
                    onChangeComplete={(newColor) => setBackgroundColor(newColor.hex)}
                  />
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Stroke width</h3>
          <Slider
            value={[strokeWidth]}
            onValueChange={(value) => setStrokeWidth(value[0])}
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Opacity</h3>
          <Slider
            value={[opacity]}
            onValueChange={(value) => setOpacity(value[0])}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

