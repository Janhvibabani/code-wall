declare module 'fabric-brush' {
    import { BaseBrush } from 'fabric';
  
    export class CrayonBrush extends BaseBrush {
      constructor(canvas: fabric.Canvas);
      color: string;
      width: number;
      shadow?: fabric.Shadow | null;
      opacity?: number;
      // Add missing properties
      decimate?: number;
      strokeLineCap?: string;
      strokeLineJoin?: string;
      strokeDashArray?: number[];
    }
  
    export class SprayBrush extends BaseBrush {
      constructor(canvas: fabric.Canvas);
      color: string;
      width: number;
      shadow?: fabric.Shadow | null;
      opacity?: number;
      // Add missing properties
      decimate?: number;
      strokeLineCap?: string;
      strokeLineJoin?: string;
      strokeDashArray?: number[];
    }
  
    export class MarkerBrush extends BaseBrush {
      constructor(canvas: fabric.Canvas);
      color: string;
      width: number;
      shadow?: fabric.Shadow | null;
      opacity?: number;
      // Add missing properties
      decimate?: number;
      strokeLineCap?: string;
      strokeLineJoin?: string;
      strokeDashArray?: number[];
    }
  }
  