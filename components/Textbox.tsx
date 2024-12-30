import React, { useEffect } from 'react';
import { fabric } from 'fabric';

interface TextboxProps {
  canvas: fabric.Canvas | null;
  activeTool: string;
  strokeColor: string;
  opacity: number;
}

const Textbox: React.FC<TextboxProps> = ({ canvas, activeTool, strokeColor, opacity }) => {
  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (options: fabric.IEvent) => {
      if (activeTool === 'textbox' && !options.target) {
        const pointer = canvas.getPointer(options.e);

        const text = new fabric.IText('', {
          left: pointer.x,
          top: pointer.y,
          fontFamily: 'Arial',
          fontSize: 20,
          fill: strokeColor,
          opacity: opacity / 100,
          editable: true,
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });

        // Add a listener for when the user starts typing
        text.on('text:changed', () => {
          if (text.text === '') {
            text.set({ text: 'Type here', fill: 'gray', opacity: 0.5 });
          } else {
            
            text.set({ fill: 'black', opacity: opacity / 100 });
          }
          canvas.renderAll();
        });

        text.on('editing:entered', () => {
          text.set({ fill: 'black' });
          canvas.renderAll();
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        canvas.renderAll();
      }
    };

    const handleDoubleClick = (options: fabric.IEvent) => {
      const target = options.target;
      if (target && target.type === 'i-text') {
        canvas.setActiveObject(target);
        (target as fabric.IText).enterEditing();
        canvas.renderAll();
      }
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:dblclick', handleDoubleClick);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:dblclick', handleDoubleClick);
    };
  }, [canvas, activeTool, strokeColor, opacity]);

  return null;
};

export default Textbox;
