export function viewWidth(width,height){return Math.max(640,Math.min(1100,360*width/Math.max(1,height)));}
export function viewHeight(width,height){return viewWidth(width,height)*Math.max(1,height)/Math.max(1,width);}
export function viewOrigin(engineX,width,worldWidth){return Math.max(0,Math.min(Math.max(0,worldWidth-width),engineX-(width-640)/2));}
