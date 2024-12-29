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

  // Helper function to convert hex to rgba
  const convertToRGBA = (hex: string, opacity: number): string => {
    // Remove the hash if present
    hex = hex.replace('#', '')
    
    // Convert hex to rgb
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    // Return rgba string
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
  }

  useEffect(() => {
    if (canvasRef.current) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth - 240,
        height: window.innerHeight - 120,
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

    // Set drawing mode based on active tool
    canvas.isDrawingMode = activeTool === 'pencil'

    // Ensure the brush exists before attempting to modify it
    if (canvas.freeDrawingBrush) {
      // Set stroke width if valid
      if (typeof strokeWidth === 'number') {
        canvas.freeDrawingBrush.width = strokeWidth
      } else {
        console.error('strokeWidth is not a number:', strokeWidth)
      }

      // Convert hex color to rgba with opacity
      if (typeof strokeColor === 'string' && typeof opacity === 'number') {
        try {
          const rgbaColor = convertToRGBA(strokeColor, opacity)
          canvas.freeDrawingBrush.color = rgbaColor
        } catch (error) {
          console.error('Error setting brush color:', error)
        }
      }
    }
  }, [canvas, activeTool, strokeColor, strokeWidth, opacity])

  useEffect(() => {
    if (!canvas) return

    canvas.setZoom(zoom / 100)
  }, [canvas, zoom])

  useEffect(() => {
    if (!canvas) return

    canvas.setBackgroundColor(backgroundColor, canvas.renderAll.bind(canvas))
  }, [canvas, backgroundColor])

  return <canvas ref={canvasRef} />
}