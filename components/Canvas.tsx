'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import Textbox from './Textbox';

interface CanvasProps {
  activeTool: string;
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  zoom: number;
}

export default function Canvas({
  activeTool,
  strokeColor,
  backgroundColor,
  strokeWidth,
  zoom,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width: window.innerWidth - 240,
        height: window.innerHeight - 120,
        backgroundColor: 'transparent',
        selection: true,
      });
      setCanvas(newCanvas);

      const handleResize = () => {
        newCanvas.setDimensions({
          width: window.innerWidth - 240,
          height: window.innerHeight - 120,
        });
        newCanvas.renderAll();
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

    canvas.isDrawingMode = activeTool === 'pencil';
    canvas.selection = activeTool === 'select';

    const handleMouseDown = (options: fabric.IEvent) => {
      if (options.target) return;

      const pointer = canvas.getPointer(options.e);
      setStartPoint({ x: pointer.x, y: pointer.y });

      if (activeTool === 'textbox') {
        const text = new fabric.IText('', {
          left: pointer.x,
          top: pointer.y,
          fontFamily: 'Arial',
          fontSize: 20,
          fill: 'black',
          selectable: true,
          editable: true,
          hasControls: true,
          hasBorders: true,
        });

        text.on('editing:entered', () => {
          if (text.text === '') {
            text.set({ text: 'Type here', fill: 'gray' });
            canvas.renderAll();
          } else {
            text.set({ fill: 'black' });
          }
        });

        text.on('editing:exited', () => {
          if (text.text === 'Type here') {
            text.set({ text: '', fill: 'black' });
            canvas.renderAll();
          } else {
            text.set({ fill: 'black' });
          }
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        canvas.renderAll();
      } else if (['rectangle', 'circle', 'line'].includes(activeTool)) {
        setIsDrawing(true);
      }
    };

    const handleMouseMove = (options: fabric.IEvent) => {
      if (!isDrawing || !startPoint) return;

      const pointer = canvas.getPointer(options.e);
      let shape: fabric.Object | null = null;

      switch (activeTool) {
        case 'rectangle':
          shape = new fabric.Rect({
            left: Math.min(startPoint.x, pointer.x),
            top: Math.min(startPoint.y, pointer.y),
            width: Math.abs(pointer.x - startPoint.x),
            height: Math.abs(pointer.y - startPoint.y),
            fill: 'transparent',
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            selectable: true,
          });
          break;
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(pointer.x - startPoint.x, 2) + Math.pow(pointer.y - startPoint.y, 2)
          ) / 2;
          shape = new fabric.Circle({
            left: Math.min(startPoint.x, pointer.x),
            top: Math.min(startPoint.y, pointer.y),
            radius: radius,
            fill: 'transparent',
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            selectable: true,
          });
          break;
        case 'line':
          shape = new fabric.Line([startPoint.x, startPoint.y, pointer.x, pointer.y], {
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            selectable: true,
          });
          break;
      }

      if (shape) {
        canvas.remove(...canvas.getObjects().filter(obj => obj.data === 'temp'));
        shape.data = 'temp';
        canvas.add(shape);
        canvas.renderAll();
      }
    };

    const handleMouseUp = () => {
      if (isDrawing) {
        const tempObject = canvas.getObjects().find(obj => obj.data === 'temp');
        if (tempObject) {
          tempObject.data = '';
        }
        setIsDrawing(false);
        setStartPoint(null);
        canvas.renderAll();
      }
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = strokeColor;
      canvas.freeDrawingBrush.width = strokeWidth;
    }

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, activeTool, strokeColor, strokeWidth, isDrawing, startPoint]);

  useEffect(() => {
    if (canvas) {
      canvas.setZoom(zoom / 100);
      canvas.renderAll();
    }
  }, [canvas, zoom]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div 
        className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
        style={{ backgroundColor }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
      {canvas && (
        <Textbox
          canvas={canvas}
          activeTool={activeTool}
          strokeColor={strokeColor}
          opacity={100}
        />
      )}
    </div>
  );
}