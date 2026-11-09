"""Generate SKYHOLD 2026 music intensity layers with ElevenLabs Music: for every stage track and the boss track, a
drums-only layer at the track's exact tempo. process_layers.py then locks each one to its track's beat grid, cuts it to
the track's loop length and builds the second layer, the lead pulse (synthesised there on the track's root and fifth),
so the game can bring them in over the music as the fight heats up (see AUDIO.md, "Music layers").

A generated lead-only take (lead_s1) was tried first: it came back in A minor over an A major track and without a beat
steady enough to lock (35 ms jitter), and any separately generated melody would fight the track's own chord changes.

Usage: python gen_layers.py [--only drums_s1,drums_s2] [--force]
The key is read from the Windows user environment by gen_audio.key() and never printed or written anywhere.
Raw takes go to <SK_RAW>/layers/<name>.mp3.
"""
import os, sys
from concurrent.futures import ThreadPoolExecutor
import gen_audio as GA

# tempo (measured: every track holds its asked-for BPM to within 2 ms over the loop) and key (whole-track chroma)
TRACKS = {
    's1': (112, 'A major', 'crisp punchy arcade electronic drums, bright claps'),
    's2': (118, 'C major', 'hand drums, congas and deep toms over a tight electronic kit'),
    's3': (124, 'A minor', 'tight crisp electronic drums, glassy rimshots and fast shakers'),
    's4': (130, 'F major', 'pounding heavy drums and deep tribal toms'),
    's5': (136, 'D minor', 'huge cinematic drums with booming low hits'),
    'boss': (142, 'D minor', 'relentless taiko-like war drums and metallic impacts'),
}
SEC = 150


def jobs():
    out = []
    for t, (bpm, key, kit) in TRACKS.items():
        out.append((f'drums_{t}', f'Instrumental drum and percussion stem only, exactly {bpm} BPM, one steady groove from the very first '
                    f'second to the end with no intro, no breakdown, no silence and no tempo change: {kit}, a punchy kick on every beat, '
                    f'snare on two and four, driving sixteenth-note hi-hats, a tom fill every eight bars, cinematic electronic space '
                    f'action. Drums only: no bass, no synths, no melody, no chords, no pads, no vocals'))
    return out


def main():
    only = None
    if '--only' in sys.argv:
        only = set(sys.argv[sys.argv.index('--only') + 1].split(','))
    force = '--force' in sys.argv
    todo = [(n, p) for n, p in jobs() if (not only or n in only)]
    used0, lim, _ = GA.credits()

    def one(job):
        n, p = job
        dst = os.path.join(GA.RAW, 'layers', n + '.mp3')
        if os.path.exists(dst) and not force:
            return f'{n}: kept'
        size = GA.post('/v1/music?output_format=mp3_44100_128', {'prompt': p, 'music_length_ms': SEC * 1000, 'force_instrumental': True}, dst)
        return f'{n}: {size // 1024} KB'

    with ThreadPoolExecutor(2) as ex:   # never more than 2 requests in flight
        for r in ex.map(one, todo):
            print(r, flush=True)
    used1, lim, _ = GA.credits()
    print(f'credits used by this run: {used1 - used0} ({lim - used1} left)')


if __name__ == '__main__':
    main()
