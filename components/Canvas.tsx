'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import Textbox from './Textbox';

interface CanvasProps {
  activeTool: string;
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  zoom: number;
  activeBrush: string;
  opacity: number;
  onUndo: (callback: () => void) => void;
  onRedo: (callback: () => void) => void;
}

const convertToRGBA = (color: string, opacity: number): string => {
  const rgb = fabric.Color.fromHex(color).getSource();
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity / 100})`;
};

export default function Canvas({
  activeTool,
  strokeColor,
  backgroundColor,
  strokeWidth,
  zoom,
  activeBrush,
  opacity,
  onUndo: _onUndo,
  onRedo: _onRedo,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const undoRedoRef = useRef({
    undo: () => {},
    redo: () => {}
  });

  const isInitialMount = useRef(true);
  const historyUpdateTimeout = useRef<NodeJS.Timeout>();
  const canvasEventsSet = useRef(false);

  useEffect(() => {
    if (canvasRef.current && containerRef.current && !canvas) {
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

  const saveToHistory = useCallback((fabricCanvas: fabric.Canvas) => {
    if (historyUpdateTimeout.current) {
      clearTimeout(historyUpdateTimeout.current);
    }

    historyUpdateTimeout.current = setTimeout(() => {
      try {
        const json = JSON.stringify(fabricCanvas.toJSON(['data']));
        setHistory(prevHistory => {
          const newHistory = [...prevHistory.slice(0, historyIndex + 1), json];
          setHistoryIndex(newHistory.length - 1);
          return newHistory;
        });
      } catch (error) {
        console.warn('Failed to save canvas state:', error);
      }
    }, 100);
  }, [historyIndex]);

  useEffect(() => {
    if (!canvas) return;

    canvas.isDrawingMode = activeTool === 'pencil';
    canvas.selection = activeTool === 'select';

    const handleMouseDown = (options: fabric.IEvent) => {
      if (activeTool === 'delete') {
        if (options.target) {
          canvas.remove(options.target);
          canvas.discardActiveObject();
          canvas.renderAll();
          saveToHistory(canvas);
        }
        return;
      }

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
        saveToHistory(canvas);
      } else if (activeTool === 'pencil') {
        canvas.isDrawingMode = true;
        canvas.selection = false;

        switch (activeBrush) {
          case 'PencilBrush':
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            break;
          case 'CircleBrush':
            canvas.freeDrawingBrush = new fabric.CircleBrush();
            break;
          case 'SprayBrush':
            canvas.freeDrawingBrush = new fabric.SprayBrush();
            break;
          case 'PatternBrush':
            canvas.freeDrawingBrush = new fabric.PatternBrush(canvas);
            break;
          default:
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }

        const rgba = convertToRGBA(strokeColor, opacity);
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = rgba;
          canvas.freeDrawingBrush.width = strokeWidth;
        }
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
          saveToHistory(canvas);
        }
        setIsDrawing(false);
        setStartPoint(null);
        canvas.renderAll();
      }
    };

    if (!canvasEventsSet.current) {
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
      canvasEventsSet.current = true;

      return () => {
        canvas.off('mouse:down', handleMouseDown);
        canvas.off('mouse:move', handleMouseMove);
        canvas.off('mouse:up', handleMouseUp);
        canvasEventsSet.current = false;
      };
    }
  }, [canvas, activeTool, strokeColor, strokeWidth, isDrawing, startPoint, activeBrush, opacity, saveToHistory]);

  useEffect(() => {
    if (!canvas) return;

    if (activeTool === 'delete') {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();
        saveToHistory(canvas);
      }
    }
  }, [canvas, activeTool, saveToHistory]);

  useEffect(() => {
    if (canvas) {
      canvas.setZoom(zoom / 100);
      canvas.renderAll();
    }
  }, [canvas, zoom]);

  const memoizedHandleUndo = useCallback(() => {
    if (!canvas || historyIndex <= 0) return;
    try {
      setHistoryIndex(prevIndex => prevIndex - 1);
      const previousState = history[historyIndex - 1];
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
      });
    } catch (error) {
      console.warn('Failed to undo:', error);
    }
  }, [canvas, historyIndex, history]);

  const memoizedHandleRedo = useCallback(() => {
    if (!canvas || historyIndex >= history.length - 1) return;
    try {
      setHistoryIndex(prevIndex => prevIndex + 1);
      const nextState = history[historyIndex + 1];
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
      });
    } catch (error) {
      console.warn('Failed to redo:', error);
    }
  }, [canvas, historyIndex, history]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    undoRedoRef.current = {
      undo: memoizedHandleUndo,
      redo: memoizedHandleRedo
    };
  }, [memoizedHandleUndo, memoizedHandleRedo]);

  useEffect(() => {
    if (isInitialMount.current) return;
    
    _onUndo(undoRedoRef.current.undo);
    _onRedo(undoRedoRef.current.redo);
  }, [_onUndo, _onRedo]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div 
        className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:14px_24px]"
        style={{ backgroundColor }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
      {canvas && (
        <Textbox
          canvas={canvas}
          activeTool={activeTool}
          strokeColor={strokeColor}
          opacity={opacity}
        />
      )}
    </div>
  );
}