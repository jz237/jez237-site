"""Package the owned Descent II files for direct file:// HTML playback."""
from pathlib import Path
import base64, gzip, json, re, shutil, struct, subprocess, sys
from tempfile import TemporaryDirectory

out = Path(__file__).resolve().parents[1]
def pack(group, entries):
    folder = out / "payload"
    folder.mkdir(exist_ok=True)
    chunks, index = [], []
    raw = bytearray()
    def flush():
        if not raw: return
        name = f"{group}-{len(chunks):03d}.js"
        data = base64.b64encode(gzip.compress(raw, 3, mtime=0))
        (folder/name).write_bytes(b'astraParcel("' + data + b'");\n')
        chunks.append(name)
        raw.clear()
    for name, content in entries:
        index.append([name,len(content)])
        view = memoryview(content)
        while view:
            n = min(6*1024*1024-len(raw),len(view))
            raw.extend(view[:n])
            view = view[n:]
            if len(raw)==6*1024*1024: flush()
    flush()
    (folder/(group+".js")).write_text("astraIndex."+group+"="+json.dumps([chunks,index],separators=(",",":"))+";\n")
    print(group, len(index), "files in",len(chunks),"parcels")

def game(src):
    content = sorted(p for p in src.iterdir() if p.suffix.lower() in {".hog",".ham",".pig",".s11",".s22"})
    pack("game", [(p.name.lower(),p.read_bytes()) for p in content] + [("demos/descent2.dem",(src/"demos/descent2.dem").read_bytes())])
    movies = sorted(p for p in src.iterdir() if p.name.lower() in {"intro-h.mvl","other-h.mvl","robots-h.mvl"})
    pack("movies", ((p.name.lower(),p.read_bytes()) for p in movies))
    cue = (src/"descent_ii.inst").read_text()
    disc = src/re.search(r'FILE "(.*?)"',cue)[1]
    tracks = re.findall(r'TRACK (\d+) (\S+)\s+INDEX 01 (\d+):(\d+):(\d+)',cue)
    starts = [((int(m)*60+int(s))*75+int(f))*2352 for _,_,m,s,f in tracks]+[disc.stat().st_size]
    music = out/"music"
    music.mkdir(exist_ok=True)
    with disc.open("rb") as f:
        for i,(number,kind,*_) in enumerate(tracks):
            if kind != "AUDIO": continue
            f.seek(starts[i])
            pcm=f.read(starts[i+1]-starts[i])
            subprocess.run(["ffmpeg","-nostdin","-v","error","-y","-f","s16le","-ar","44100","-ac","2",
                            "-i","pipe:0","-c:a","flac",str(music/(number+".flac"))],input=pcm,check=True)
if __name__=="__main__": game(Path(sys.argv[1]))


