'use client'

import { useState } from 'react'
import Canvas from '@/components/Canvas'
import Toolbar from '@/components/Toolbar'
import Sidebar from '@/components/Sidebar'
import WelcomeScreen from '@/components/WelcomeScreen'
import BottomBar from '@/components/BottomBar'

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [activeTool, setActiveTool] = useState('select')
  const [strokeColor, setStrokeColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [opacity, setOpacity] = useState(100)
  const [zoom, setZoom] = useState(100)

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />
  }

  return (
    <div className="h-screen flex">
      <Sidebar
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        opacity={opacity}
        setOpacity={setOpacity}
      />
      <div className="flex-1 flex flex-col">
        <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} />
        <div className="flex-1 relative">
          <Canvas
            activeTool={activeTool}
            strokeColor={strokeColor}
            backgroundColor={backgroundColor}
            strokeWidth={strokeWidth}
            zoom={zoom}
          />
        </div>
        <BottomBar zoom={zoom} setZoom={setZoom} />
      </div>
    </div>
  )
}

