'use client'

import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'

interface CanvasProps {
  activeTool: string
  strokeColor: string
  backgroundColor: string
  strokeWidth: number
  opacity: number
  zoom: number
}

export default function Canvas({
  activeTool,
  strokeColor,
  backgroundColor,
  strokeWidth,
  opacity,
  zoom,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth - 240, // Accounting for sidebar
        height: window.innerHeight - 120, // Accounting for toolbar and bottom bar
        backgroundColor: '#ffffff',
      })

      setCanvas(newCanvas)

      const handleResize = () => {
        newCanvas.setDimensions({
          width: window.innerWidth - 240,
          height: window.innerHeight - 120,
        })
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        newCanvas.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (!canvas) return

    canvas.isDrawingMode = activeTool === 'pencil'
    canvas.freeDrawingBrush.color = strokeColor
    canvas.freeDrawingBrush.width = strokeWidth
    canvas.freeDrawingBrush.opacity = opacity / 100
  }, [canvas, activeTool, strokeColor, strokeWidth, opacity])

  useEffect(() => {
    if (!canvas) return

    canvas.setZoom(zoom / 100)
  }, [canvas, zoom])

  return <canvas ref={canvasRef} />
}

