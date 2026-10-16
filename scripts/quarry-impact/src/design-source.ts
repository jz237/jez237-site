/** Local attribution and editor permissions, not authentication or DRM. */
export type DesignSource={id:string;revision:number;name:string;creator:string;allowRemix:boolean};
export function normalizeDesignSource(value:unknown):DesignSource|undefined{
 if(!value||typeof value!=='object'||Array.isArray(value))return;
 const v=value as Record<string,unknown>,label=(s:unknown,max:number):s is string=>typeof s==='string'&&s.trim().length>0&&s.length<=max&&!/[\u0000-\u001f\u007f]/.test(s);
 if(typeof v.id!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(v.id)||!Number.isSafeInteger(v.revision)||(v.revision as number)<1||!label(v.name,48)||!label(v.creator,32)||typeof v.allowRemix!=='boolean')return;
 return {id:v.id,revision:v.revision as number,name:v.name,creator:v.creator,allowRemix:v.allowRemix};
}
