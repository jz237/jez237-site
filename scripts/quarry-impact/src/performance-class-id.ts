/** Serializable class limits shared by frontend settings and server event codecs. */
export type PerformanceClass='D'|'C'|'B'|'A';
export type ClassLimit=Exclude<PerformanceClass,'A'>;
export const CLASS_LIMITS={D:99,C:164,B:234} as const;
export const CLASS_CHOICES={open:'Open · all classes',D:'D · up to 99 PP',C:'C · up to 164 PP',B:'B · up to 234 PP'} as const;
export const isClassLimit=(value:unknown):value is ClassLimit=>typeof value==='string'&&Object.hasOwn(CLASS_LIMITS,value);
