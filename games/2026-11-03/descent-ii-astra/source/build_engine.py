"""Build the independently fetched stock DXX-Redux D2 target for a browser."""
import os
import re
import subprocess
import sys
from pathlib import Path

here = Path(__file__).resolve().parent
tree = Path(sys.argv[1]).resolve()
game = tree / "redux/d2"
phys = tree / "physfs/src"
sdk = Path(os.environ["EMSDK"])
ems = sdk / "upstream/emscripten"
obj = tree / "objects"
obj.mkdir(exist_ok=True)
output = here.parent / "engine.js"
env = os.environ.copy()
env.update(EM_CONFIG=str(sdk / ".emscripten"), EMCC_CORES="4", EM_CACHE=str(tree / "cache"))
(tree / "temp").mkdir(exist_ok=True)
env.update(TMP=str(tree / "temp"), TEMP=str(tree / "temp"), TMPDIR=str(tree / "temp"))
env["PATH"] = str(sdk / "upstream/bin") + os.pathsep + str(ems) + os.pathsep + env["PATH"]

# Use the source lists from upstream's build files, without desktop backends.
sources = []
for folder in "2d 3d iff libmve main maths mem misc texmap arch/ogl arch/sdl xmodel".split():
    target = game / folder
    cmake = (target / "CMakeLists.txt").read_text()
    first = re.search(r"add_(?:library|executable)\s*\(([^)]+)\)", cmake, re.I)[1]
    sources.extend(target / name for name in re.findall(r"(?m)^\s*([\w.-]+\.(?:c|cpp))\s*$", first)
                   if name != "rbaudio.c")
sources += [game / "main/vers_id.c", game / "misc/pngfile.c", game / "main/net_udp.c", here / "disc.c"]
sources += [p for p in phys.glob("*.c") if "platform_" not in p.name or p.stem.endswith(("posix", "unix"))]
common = ["-O2", "-w", "-Wno-error=implicit-function-declaration", "-Wno-error=incompatible-function-pointer-types",
          "-DNETWORK", "-DUSE_UDP", "-DUSE_TRACKER", "-DOGL", "-DHAVE_LIBPNG", "-DRELEASE", "-DNO_ASM",
          "-DHAVE_STRUCT_TIMEVAL", "-DHAVE_STRUCT_TIMESPEC", "-DHAVE_SSIZE_T=1",
          "-DDXX_VERSION_MAJORi=1", "-DDXX_VERSION_MINORi=1", "-DDXX_VERSION_MICROi=0",
          "-DPHYSFS_SUPPORTS_7Z=0", "-DPHYSFS_SUPPORTS_ISO9660=0", "-DPHYSFS_NO_CDROM_SUPPORT",
          "-sUSE_SDL=1", "-sUSE_LIBPNG=1", "-sUSE_ZLIB=1", "-include", "emscripten.h",
          *["-I" + str(p) for p in (game / "include", game / "arch/include", game / "main", phys)]]
def ninja_path(p):
    return str(p).replace("$", "$$").replace(":", "$:").replace(" ", "$ ")
def command(args):
    return subprocess.list2cmdline(list(map(str, args)))
lines = []
for key, compiler, standard in [("cc", "emcc.py", "gnu99"), ("cpp", "em++.py", "c++17")]:
    lines += [f"rule {key}", "  command = " + command([sys.executable, ems / compiler, *common, "-std="+standard])
              + ' -MMD -MF $out.d -c $in -o $out', '  depfile = $out.d', '  deps = gcc']
objects = []
for n, src in enumerate(sources):
    target = f"{n:03}-{src.stem}.o"
    objects.append(target)
    lines.append(f"build {target}: {'cpp' if src.suffix=='.cpp' else 'cc'} {ninja_path(src)}")
link = ["-O2", "-sLEGACY_GL_EMULATION=1", "-sGL_MAX_TEMP_BUFFER_SIZE=16777216", "-sASYNCIFY=1",
        "-sASYNCIFY_STACK_SIZE=262144", "-sSTACK_SIZE=4194304", "-sALLOW_MEMORY_GROWTH=1",
        "-sINITIAL_MEMORY=201326592", "-sSINGLE_FILE=1", "-sENVIRONMENT=web", "-sEXIT_RUNTIME=1",
        "-sEXPORTED_RUNTIME_METHODS=FS,IDBFS,addRunDependency,removeRunDependency", "-lidbfs.js", "-sUSE_SDL=1", "-sUSE_LIBPNG=1", "-sUSE_ZLIB=1"]
lines += ["rule link", "  command = " + command([sys.executable, ems / "em++.py", *link]) + " @objects.rsp -o $out",
          "  rspfile = objects.rsp", "  rspfile_content = $in_newline",
          "build " + ninja_path(output) + ": link " + " ".join(objects)]
(obj / "build.ninja").write_text("\n".join(lines) + "\n")
sys.exit(subprocess.call(["ninja", "-j8", "-k10"], cwd=obj, env=env))



