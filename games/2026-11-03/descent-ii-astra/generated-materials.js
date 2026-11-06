/* GPT Image material families. Shared maps keep VRAM bounded across both campaigns.
 * Script parcels also work in the installed file:// edition. */
window.astraGeneratedLibrary = function(nativeDepot) {
  const waiting=new Map(),pending=new Map(),ready=new Set();
  const decode=text=>Uint8Array.from(atob(text),c=>c.charCodeAt(0));
  window.astraGeneratedParcel=(id,data)=>waiting.get(id)?.(data);
  const parse=name=>/^g(0[0-9]|1[0-5])(-n)?\.png$/.exec(name);
  async function family(id) {
    if(ready.has(id))return;
    if(pending.has(id))return pending.get(id);
    const job=(async()=>{
      const parcel=await new Promise((resolve,reject)=>{
        const el=document.createElement('script');waiting.set(id,resolve);
        el.src=`payload/material${id<8?36:id<12?38:44}/g${String(id).padStart(2,'0')}.js`;
        el.onerror=()=>{waiting.delete(id);el.remove();reject(Error('Could not load mine material '+id));};
        el.onload=()=>{waiting.delete(id);el.remove();};document.head.append(el);
      });
      const pixels=await createImageBitmap(new Blob([decode(parcel.color)],{type:'image/webp'}));
      const canvas=document.createElement('canvas');canvas.width=pixels.width;canvas.height=pixels.height;
      canvas.getContext('2d').drawImage(pixels,0,0);pixels.close();
      const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
      if(!png)throw Error('Could not decode mine material '+id);
      const key=`/mine/g${String(id).padStart(2,'0')}`;
      Module.FS.writeFile(key+'.png',new Uint8Array(await png.arrayBuffer()),{canOwn:true});
      Module.FS.writeFile(key+'-n.png',decode(parcel.detail),{canOwn:true});
      canvas.width=canvas.height=1;ready.add(id);
      Module.generatedMaterials={version:44,loaded:ready.size,families:16,colorResolution:1024,detailResolution:512};
    })().finally(()=>pending.delete(id));
    pending.set(id,job);return job;
  }
  return {
    hasNativeLibrary:!!nativeDepot,
    knows(name){return !!parse(name)||!!nativeDepot?.knows(name);},
    image(name){const match=parse(name);return match?family(Number(match[1])):nativeDepot?.image(name);},
    async level(names,robots){
      await nativeDepot?.level(names,robots);
      // Two decodes at once bound transient memory on phones and older PCs.
      for(let id=0;id<8;id+=2)await Promise.all([family(id),family(id+1)]);
    }
  };
};
