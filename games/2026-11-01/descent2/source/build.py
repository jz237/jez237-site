"""Builds D2X-Redux (Descent II) for the browser with Emscripten.

Generates build/build.ninja and runs ninja. Output: web/d2x.js + web/d2x.wasm
Usage: python build.py [--debug] [--clean]
"""
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
EMSDK = os.environ.get("EMSDK", r"D:\Projects\_web_amiga_research\emsdk")
EMSCRIPTEN = os.path.join(EMSDK, "upstream", "emscripten")
D2 = os.path.join(ROOT, "src", "redux", "d2")
PHYS = os.path.join(ROOT, "src", "physfs", "src")
BUILD = os.path.join(ROOT, "build")
OUT = os.path.join(ROOT, "web")

DEBUG = "--debug" in sys.argv
OPT = "-O1 -g2" if DEBUG else "-O2"

DEFS = [
    "-DOGL", "-DNETWORK", "-DUSE_UDP", "-DUSE_TRACKER", "-DRELEASE", "-DHAVE_STRUCT_TIMEVAL", "-DHAVE_STRUCT_TIMESPEC",
    "-DHAVE_SSIZE_T=1", "-DHAVE_LIBPNG",
    "-DDXX_VERSION_MAJORi=1", "-DDXX_VERSION_MINORi=1", "-DDXX_VERSION_MICROi=0",
    "-DPHYSFS_NO_CDROM_SUPPORT=1", "-DPHYSFS_SUPPORTS_7Z=0", "-DPHYSFS_SUPPORTS_ISO9660=0",
]
INCS = [f"-include {D2}/arch/web/web_config.h", f"-I{D2}/include", f"-I{D2}/arch/include", f"-I{D2}/main", f"-I{PHYS}", f"-I{D2}/arch/web"]
CWARN = [
    "-Wno-address-of-packed-member", "-Wno-deprecated-declarations", "-Wno-pointer-sign",
    "-Wno-format", "-Wno-dangling-else", "-Wno-parentheses", "-Wno-unused-value",
    "-Wno-tautological-compare", "-Wno-absolute-value", "-Wno-shift-negative-value",
    "-Wno-non-literal-null-conversion", "-Wno-unknown-warning-option", "-Wno-string-plus-int",
    "-Wno-tautological-constant-out-of-range-compare", "-Wno-self-assign",
    "-Wno-constant-conversion", "-Wno-unused-command-line-argument",
]
PORTS = ["-sUSE_SDL=1", "-sUSE_LIBPNG=1", "-sUSE_ZLIB=1"]


def files(d, *names):
    return [os.path.join(d, n) for n in names]


SRCS = []
SRCS += files(f"{D2}/2d", "2dsline.c", "bitblt.c", "bitmap.c", "box.c", "canvas.c", "circle.c",
              "disc.c", "font.c", "gpixel.c", "line.c", "palette.c", "pcx.c", "pixel.c", "rect.c",
              "rle.c", "scalec.c")
SRCS += files(f"{D2}/3d", "clipper.c", "draw.c", "globvars.c", "instance.c", "interp.c",
              "matrix.c", "points.c", "rod.c", "setup.c")
SRCS += files(f"{D2}/arch/sdl", "event.c", "init.c", "joy.c", "key.c", "mouse.c", "timer.c",
              "window.c", "digi.c", "digi_audio.c")
SRCS += files(f"{D2}/arch/web", "rbaudio_web.c", "web.c")
SRCS += files(f"{D2}/arch/ogl", "gr.c", "ogl.c")
SRCS += files(f"{D2}/iff", "iff.c")
SRCS += files(f"{D2}/libmve", "decoder8.c", "decoder16.c", "mve_audio.c", "mvelib.c", "mveplay.c")
SRCS += files(f"{D2}/main", "ai.c", "ai2.c", "aipath.c", "automap.c", "bm.c", "cntrlcen.c",
              "collide.c", "config.c", "console.c", "controls.c", "credits.c", "digiobj.c",
              "dumpmine.c", "effects.c", "endlevel.c", "escort.c", "fireball.c", "fuelcen.c",
              "fvi.c", "game.c", "gamecntl.c", "gamefont.c", "gamemine.c", "gamepal.c",
              "gamerend.c", "gamesave.c", "gameseg.c", "gameseq.c", "gauges.c", "hostage.c",
              "hud.c", "inferno.c", "kconfig.c", "kmatrix.c", "laser.c", "lighting.c", "menu.c",
              "mglobal.c", "mission.c", "morph.c", "movie.c", "multi.c", "multibot.c",
              "newdemo.c", "newmenu.c", "object.c", "paging.c", "physics.c", "piggy.c",
              "player.c", "playsave.c", "polyobj.c", "powerup.c", "render.c", "robot.c",
              "scores.c", "segment.c", "slew.c", "songs.c", "state.c", "switch.c", "terrain.c",
              "texmerge.c", "text.c", "titles.c", "vclip.c", "wall.c", "weapon.c", "vers_id.c",
              "net_udp.c")
SRCS += files(f"{D2}/maths", "fixc.c", "rand.c", "tables.c", "vecmat.c")
SRCS += files(f"{D2}/mem", "mem.c")
SRCS += files(f"{D2}/misc", "args.c", "error.c", "hash.c", "hmp.c", "ignorecase.c",
              "physfsrwops.c", "physfsx.c", "strio.c", "strutil.c", "pngfile.c")
SRCS += files(f"{D2}/texmap", "ntmap.c", "scanline.c")
SRCS += files(f"{D2}/xmodel", "aseread.cpp", "submodel.cpp", "tga.cpp", "xmodel.cpp")
SRCS += files(PHYS, "physfs.c", "physfs_byteorder.c", "physfs_unicode.c",
              "physfs_platform_posix.c", "physfs_platform_unix.c", "physfs_archiver_dir.c",
              "physfs_archiver_unpacked.c", "physfs_archiver_hog.c", "physfs_archiver_mvl.c",
              "physfs_archiver_zip.c", "physfs_archiver_grp.c", "physfs_archiver_qpak.c",
              "physfs_archiver_wad.c", "physfs_archiver_slb.c", "physfs_archiver_vdf.c")

LINK = [
    "-sLEGACY_GL_EMULATION=1",
    "-sASYNCIFY=1", "-sASYNCIFY_STACK_SIZE=524288",
    "-sALLOW_MEMORY_GROWTH=1", "-sINITIAL_MEMORY=268435456", "-sMAXIMUM_MEMORY=4294967296",
    "-sSTACK_SIZE=8388608",
    "-sFORCE_FILESYSTEM=1", "-lidbfs.js",
    "-sINVOKE_RUN=0", "-sEXIT_RUNTIME=0",
    "-sEXPORTED_RUNTIME_METHODS=FS,IDBFS,callMain,ccall,cwrap",
    "-sENVIRONMENT=web",
    f"--js-library={D2}/arch/web/library_d2web.js",
]


def ninja_escape(p):
    return p.replace("$", "$$").replace(" ", "$ ").replace(":", "$:")


def main():
    if "--clean" in sys.argv and os.path.isdir(BUILD):
        shutil.rmtree(BUILD)
    os.makedirs(os.path.join(BUILD, "obj"), exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    emcc = os.path.join(EMSCRIPTEN, "emcc.bat")
    empp = os.path.join(EMSCRIPTEN, "em++.bat")
    common = " ".join([OPT] + DEFS + INCS + CWARN + PORTS)
    lines = [
        f"cflags = {common} -std=gnu99",
        f"cxxflags = {common} -std=c++17 -Wno-register -Wno-c++11-narrowing",
        f"rule cc\n  command = {emcc} $cflags -MD -MF $out.d -c $in -o $out\n  deps = gcc\n  depfile = $out.d\n  description = CC $in",
        f"rule cxx\n  command = {empp} $cxxflags -MD -MF $out.d -c $in -o $out\n  deps = gcc\n  depfile = $out.d\n  description = CXX $in",
        # Windows caps command lines at 8191 chars, so objects go through a response file
        f"rule link\n  command = {empp} {OPT} {' '.join(PORTS)} @$out.rsp {' '.join(LINK)} -o $out\n"
        f"  rspfile = $out.rsp\n  rspfile_content = $in_newline\n  description = LINK $out",
    ]
    objs = []
    for s in SRCS:
        rel = os.path.relpath(s, os.path.join(ROOT, "src")).replace(os.sep, "_").replace("/", "_")
        o = os.path.join(BUILD, "obj", rel + ".o").replace(os.sep, "/")  # rsp files treat \ as escapes
        objs.append(o)
        rule = "cxx" if s.endswith(".cpp") else "cc"
        lines.append(f"build {ninja_escape(o)}: {rule} {ninja_escape(s)}")
    js = os.path.join(OUT, "d2x.js")
    implicit = [os.path.join(D2, "arch", "web", "library_d2web.js"), os.path.abspath(__file__)]
    lines.append(f"build {ninja_escape(js)}: link {' '.join(ninja_escape(o) for o in objs)} | "
                 + " ".join(ninja_escape(i) for i in implicit))
    with open(os.path.join(BUILD, "build.ninja"), "w") as f:
        f.write("\n".join(lines) + "\n")
    env = dict(os.environ)
    env["EM_CONFIG"] = os.path.join(EMSDK, ".emscripten")
    env["EMSDK"] = EMSDK
    env["PATH"] = os.pathsep.join([os.path.join(EMSDK, "upstream", "bin"), EMSCRIPTEN,
                                   os.path.join(EMSDK, "node", "22.16.0_64bit", "bin"),
                                   os.path.join(EMSDK, "python", "3.13.3_64bit"), env["PATH"]])
    r = subprocess.run(["ninja", "-C", BUILD, "-k", "0"], env=env)
    sys.exit(r.returncode)


if __name__ == "__main__":
    main()
