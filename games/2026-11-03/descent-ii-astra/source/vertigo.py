"""Package the original Vertigo data files and confirm all mission levels exist."""
from pathlib import Path
import struct,sys
from package import pack
root=Path(sys.argv[1]);desc=(root/"missions/d2x.mn2").read_bytes();hog=(root/"missions/d2x.hog").read_bytes()
assert hog[:3]==b"DHF"
files=set();pos=3
while pos<len(hog):
    name,n=struct.unpack_from("<13sI",hog,pos);pos+=17+n;files.add(name.split(b"\0")[0].decode().lower())
levels=[v.split(",")[0] for v in desc.decode().lower().splitlines() if ".rl2" in v]
assert len(levels)==23 and set(levels)<=files and "d2x.ham" in files
pack("vertigo",[(n,(root/n).read_bytes()) for n in ("missions/d2x.mn2","missions/d2x.hog","hoard.ham","d2x-h.mvl")])
print(len(levels),"original Vertigo levels verified")

