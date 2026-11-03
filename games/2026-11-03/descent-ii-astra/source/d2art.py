"""Read indexed artwork from the user's original PPIG and DHF containers."""
from pathlib import Path
import struct
import numpy as np
from PIL import Image

def read_hog(path):
    data=path.read_bytes()
    assert data[:3]==b'DHF'
    pos=3
    while pos<len(data):
        name,length=struct.unpack_from('<13sI',data,pos);pos+=17
        yield name.split(b'\0')[0].decode().lower(),data[pos:pos+length]
        pos+=length

def bitmap_reader(folder):
    pal=dict(read_hog(folder/'descent2.hog'))['groupa.256'][:768]
    palette=np.frombuffer(pal,dtype=np.uint8).reshape(256,3)*4
    pig=(folder/'groupa.pig').read_bytes()
    count=struct.unpack_from('<I',pig,8)[0];start=12+18*count
    images={}
    for i in range(count):
        name,frame,x,y,extra,flags,avg,offset=struct.unpack_from('<8s6BI',pig,12+18*i)
        name=name.split(b'\0')[0].decode().lower()
        if frame&64:name+=f'#{frame&63}'
        images[name]=(x+((extra&15)<<8),y+((extra&240)<<4),flags,start+offset)
    def read(name):
        w,h,flags,offset=images[name];idx=np.empty((h,w),np.uint8)
        if flags&8:
            wide=bool(flags&32);sizes=np.frombuffer(pig,offset=offset+4,count=h,dtype='<u2' if wide else 'u1')
            at=offset+4+sizes.nbytes
            for y,n in enumerate(sizes):
                row=pig[at:at+int(n)];at+=int(n);span=bytearray();k=0
                while k<len(row) and len(span)<w:
                    b=row[k];k+=1
                    if b>=224:
                        run=b&31
                        if run==0:break
                        span.extend([row[k]]*run);k+=1
                    else:span.append(b)
                assert len(span)==w
                idx[y]=np.frombuffer(span,dtype=np.uint8)
        else:idx=np.frombuffer(pig,dtype=np.uint8,count=w*h,offset=offset).reshape(h,w)
        rgb=palette[idx];alpha=np.full((h,w),255,np.uint8)
        if flags&1:alpha[idx==255]=0
        if flags&2:alpha[idx==254]=0
        return Image.fromarray(np.dstack((rgb,alpha)))
    return read

