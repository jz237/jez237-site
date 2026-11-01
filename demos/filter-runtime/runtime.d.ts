export function createFilterAnimation(options:{id:string;viewport:HTMLElement;getState:()=>any}):{
 makeRenderer<T>(Three:{WebGLRenderer:new (...args:any[])=>T},options:any):T;
 start(renderer:any,scene:any,frame:(now:number)=>void):void;
 capture(fn:()=>void):void;
 fallback():void;
 snapshot():any;
};
