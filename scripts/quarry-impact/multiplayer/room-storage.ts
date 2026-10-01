import type {SavedRoom} from './room';
const CHUNK_SIZE=65_536,MAX_CHUNKS=64;
const FORMAT='quarry-room-chunks-v1';
type Marker={format:typeof FORMAT;chunks:number;length:number};
/** A full 24-car dent history approaches the SQLite value limit. Write these
 * entries together with metadata in one storage.put object (one atomic batch). */
export function roomStorageEntries(saved:SavedRoom):Record<string,unknown>{
 const text=JSON.stringify(saved);
 if(new TextEncoder().encode(text).byteLength<=512*1024)return{room:saved};
 const count=Math.ceil(text.length/CHUNK_SIZE);if(count>MAX_CHUNKS)throw new Error('Saved room exceeds bounded history storage');
 const entries:Record<string,unknown>={room:{format:FORMAT,chunks:count,length:text.length} satisfies Marker};
 for(let i=0;i<count;i++)entries['room-history-'+i]=text.slice(i*CHUNK_SIZE,(i+1)*CHUNK_SIZE);
 return entries;
}
export async function readSavedRoom(storage:{get<T>(key:string):Promise<T|undefined>}):Promise<SavedRoom|undefined>{
 const saved=await storage.get<SavedRoom|Marker>('room');
 if(!saved)return;
 if(!('format' in saved))return saved;
 if(saved.format!==FORMAT||!Number.isInteger(saved.chunks)||saved.chunks<1||saved.chunks>MAX_CHUNKS||!Number.isSafeInteger(saved.length)||saved.length<1||saved.length>MAX_CHUNKS*CHUNK_SIZE)throw new Error('Invalid saved room manifest');
 const chunks=await Promise.all(Array.from({length:saved.chunks},(_,i)=>storage.get<string>('room-history-'+i)));
 if(chunks.some(c=>typeof c!=='string'||c.length>CHUNK_SIZE))throw new Error('Incomplete saved room history');
 const text=chunks.join('');if(text.length!==saved.length)throw new Error('Incomplete saved room history');
 return JSON.parse(text) as SavedRoom;
}
