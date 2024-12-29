'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

interface CanvasProps {
  activeTool: string;
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  opacity: number;
  zoom: number;
}

export default function Canvas({
  activeTool,
  strokeColor,
  backgroundColor,
  strokeWidth,
  opacity,
  zoom,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentShape, setCurrentShape] = useState<fabric.Object | null>(null);

  const convertToRGBA = (hex: string, opacity: number): string => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  useEffect(() => {
    if (canvasRef.current) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth - 240,
        height: window.innerHeight - 120,
        backgroundColor: '#ffffff',
      });

      setCanvas(newCanvas);

      const handleResize = () => {
        newCanvas.setDimensions({
          width: window.innerWidth - 240,
          height: window.innerHeight - 120,
        });
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        newCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (!canvas) return;

    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');

    // Pencil tool setup
    if (activeTool === 'pencil') {
      canvas.isDrawingMode = true;
      const brush = canvas.freeDrawingBrush as fabric.PencilBrush;
      const rgba = convertToRGBA(strokeColor, opacity);
      brush.color = rgba;
      brush.width = strokeWidth;

      // Ensure the stroke is finalized once the drawing is done
      canvas.on('mouse:up', () => {
        // Make sure the pencil path is non-editable and non-selectable
        const objects = canvas.getObjects();
        objects.forEach((obj) => {
          obj.set({
            selectable: false,
            evented: false,
          });
        });
        canvas.renderAll();
      });

      return;
    }

    const handleMouseDown = (options: fabric.IEvent) => {
      if (!['rectangle', 'circle', 'line', 'arrow'].includes(activeTool)) return;

      const pointer = canvas.getPointer(options.e);
      setIsDrawing(true);
      setStartPoint({ x: pointer.x, y: pointer.y });

      let shape: fabric.Object | null = null;

      if (activeTool === 'rectangle') {
        canvas.isDrawingMode = false;
        shape = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          fill: 'transparent',
          opacity: opacity / 100,
          selectable: false,
          evented: false,
        });
      } else if (activeTool === 'circle') {
        canvas.isDrawingMode = false;
        shape = new fabric.Ellipse({
          left: pointer.x,
          top: pointer.y,
          rx: 0,
          ry: 0,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          fill: 'transparent',
          opacity: opacity / 100,
          selectable: false,
          evented: false,
        });
      } else if (activeTool === 'line' || activeTool === 'arrow') {
        canvas.isDrawingMode = false;
        shape = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          opacity: opacity / 100,
          selectable: false,
          evented: false,
        });
      }

      if (shape) {
        canvas.add(shape);
        setCurrentShape(shape);
      }
    };

    const handleMouseMove = (options: fabric.IEvent) => {
      if (!isDrawing || !startPoint || !currentShape) return;

      const pointer = canvas.getPointer(options.e);
      const width = pointer.x - startPoint.x;
      const height = pointer.y - startPoint.y;

      if (activeTool === 'rectangle') {
        (currentShape as fabric.Rect).set({
          left: Math.min(startPoint.x, pointer.x),
          top: Math.min(startPoint.y, pointer.y),
          width: Math.abs(width),
          height: Math.abs(height),
        });
      } else if (activeTool === 'circle') {
        (currentShape as fabric.Ellipse).set({
          left: Math.min(startPoint.x, pointer.x),
          top: Math.min(startPoint.y, pointer.y),
          rx: Math.abs(width) / 2,
          ry: Math.abs(height) / 2,
        });
      } else if (activeTool === 'line') {
        (currentShape as fabric.Line).set({
          x2: pointer.x,
          y2: pointer.y,
        });
      }
      canvas.renderAll();
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
      setStartPoint(null);

      if (currentShape) {
        currentShape.set({
          selectable: false,
          evented: false,
        });
        canvas.renderAll();
      }

      setCurrentShape(null);
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, activeTool, strokeColor, strokeWidth, opacity, isDrawing, currentShape]);

  useEffect(() => {
    if (!canvas) return;
    canvas.setZoom(zoom / 100);
  }, [canvas, zoom]);

  useEffect(() => {
    if (!canvas) return;
    canvas.setBackgroundColor(backgroundColor, canvas.renderAll.bind(canvas));
  }, [canvas, backgroundColor]);

  return <canvas ref={canvasRef} />;
}