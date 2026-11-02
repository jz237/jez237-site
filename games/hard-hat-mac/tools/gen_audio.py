"""Generate Hard Hat Mac: Skyline audio with ElevenLabs (SFX, voice lines, music).

usage: python gen_audio.py <raw_dir> <out_dir> [name ...]

Reads ELEVENLABS_API_KEY from the environment (never stored in the repo).
Raw API responses are cached in <raw_dir>; finished, loudness-normalised mp3s
land in <out_dir>. Pass names to (re)generate only those entries.
"""
import json, os, re, subprocess, sys, threading, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
API = "https://api.elevenlabs.io/v1"
KEY = os.environ.get("ELEVENLABS_API_KEY", "")
LOCK = threading.Lock()


def log(*a):
    with LOCK:
        print(*a, flush=True)


def post(path, body, timeout=300):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode(),
                                 headers={"xi-api-key": KEY, "Content-Type": "application/json",
                                          "Accept": "audio/mpeg"})
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            msg = e.read()[:300].decode("utf8", "replace")
            if e.code in (429, 500, 502, 503) and attempt < 5:
                time.sleep(4 + attempt * 6)
                continue
            raise RuntimeError(f"{e.code} {msg}")
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < 5:
                time.sleep(5)
                continue
            raise


def ffmpeg(*args):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-y", *args], capture_output=True, text=True)
    if p.returncode:
        raise RuntimeError(p.stderr[-600:])
    return p.stderr


def loudnorm(src, dst, target, channels, bitrate, pre="", post=""):
    """Two-pass linear loudnorm so loops keep their dynamics (and loop points)."""
    chain = (pre + "," if pre else "")
    err = ffmpeg("-i", src, "-af", chain + f"loudnorm=I={target}:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-")
    m = json.loads(err[err.rindex("{"):err.rindex("}") + 1])
    ln = (f"loudnorm=I={target}:TP=-1.5:LRA=11:linear=true:measured_I={m['input_i']}:"
          f"measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:"
          f"offset={m['target_offset']}")
    af = chain + ln + ("," + post if post else "")
    ffmpeg("-i", src, "-af", af, "-ar", "44100", "-ac", str(channels), "-b:a", bitrate, dst)


def gainnorm(src, dst, target, channels, bitrate, pre="", post=""):
    """Static gain for short clips (loudnorm cannot gate under ~3 s): measure on a padded copy,
    apply one gain, then a brickwall limiter so peaks stay under -1 dBFS."""
    chain = (pre + "," if pre else "")
    err = ffmpeg("-i", src, "-af", chain + "apad=whole_dur=5,loudnorm=I=-16:print_format=json", "-f", "null", "-")
    m = json.loads(err[err.rindex("{"):err.rindex("}") + 1])
    try:
        gain = max(-20.0, min(24.0, target - float(m["input_i"])))
    except ValueError:
        gain = 0.0
    af = chain + f"volume={gain:.2f}dB,alimiter=limit=0.89:level=false:attack=1:release=40" + ("," + post if post else "")
    ffmpeg("-i", src, "-af", af, "-ar", "44100", "-ac", str(channels), "-b:a", bitrate, dst)


def job(kind, item, voices, raw_dir, out_dir):
    name = item["name"]
    raw = os.path.join(raw_dir, name + ".mp3")
    out = os.path.join(out_dir, name + ".mp3")
    if not os.path.exists(raw):
        t0 = time.time()
        if kind == "sfx":
            body = {"text": item["text"], "duration_seconds": max(0.5, item["dur"]), "prompt_influence": 0.55,
                    "model_id": "eleven_text_to_sound_v2"}
            if item.get("loop"):
                body["loop"] = True
            data = post("/sound-generation?output_format=mp3_44100_128", body)
        elif kind == "tts":
            body = {"text": item["text"], "model_id": "eleven_multilingual_v2",
                    "voice_settings": {"stability": 0.35, "similarity_boost": 0.8, "style": 0.55,
                                       "use_speaker_boost": True}}
            data = post(f"/text-to-speech/{voices[item['voice']]}?output_format=mp3_44100_128", body)
        else:
            body = {"prompt": item["prompt"], "music_length_ms": item["ms"], "model_id": "music_v1"}
            data = post("/music?output_format=mp3_44100_128", body, timeout=600)
        with open(raw, "wb") as f:
            f.write(data)
        log(f"  got {name} ({len(data) // 1024} KB, {time.time() - t0:.1f}s)")
    trim_head = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.01"
    trim_tail = "areverse," + trim_head + ",areverse"
    if kind == "sfx":
        if item.get("loop"):
            loudnorm(raw, out, -20 if name.startswith("amb") else -18, 1 if not name.startswith("amb") else 2, "112k")
        else:
            gainnorm(raw, out, -16, 1, "96k", pre=trim_head + "," + trim_tail + ",afade=t=out:st=%.2f:d=0.05" % max(0.05, max(0.5, item["dur"]) - 0.08))
    elif kind == "tts":
        gainnorm(raw, out, -15, 1, "96k", pre=trim_head + "," + trim_tail)
    else:
        if item.get("trim"):
            t = item["trim"]
            loudnorm(raw, out, -15, 2, "128k", pre=f"atrim=0:{t}", post=f"afade=t=out:st={t - 1.2}:d=1.2")
        else:
            loudnorm(raw, out, -16, 2, "128k")
    log(f"ok {name}")


def main():
    if not KEY.startswith("sk_"):
        sys.exit("ELEVENLABS_API_KEY missing or not an sk_ secret")
    raw_dir, out_dir = sys.argv[1], sys.argv[2]
    only = set(sys.argv[3:])
    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(out_dir, exist_ok=True)
    spec = json.load(open(os.path.join(HERE, "audio_spec.json"), encoding="utf8"))
    jobs = [(k, it) for k in ("music", "tts", "sfx") for it in spec[k] if not only or it["name"] in only]
    failed = []
    with ThreadPoolExecutor(4) as ex:
        futs = {ex.submit(job, k, it, spec["voices"], raw_dir, out_dir): it["name"] for k, it in jobs}
        for f, n in futs.items():
            try:
                f.result()
            except Exception as e:
                failed.append(n)
                log(f"FAIL {n}: {e}")
    print("failed:", failed if failed else "none")


if __name__ == "__main__":
    main()
