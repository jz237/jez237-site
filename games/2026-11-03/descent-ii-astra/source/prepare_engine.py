"""Prepare a dedicated, clean checkout of the pinned public sources for build_engine.py."""
import shutil,subprocess,sys
from pathlib import Path
src=Path(__file__).resolve().parent
tree=Path(sys.argv[1]).resolve()
repo=tree/"redux"
def git(path,*args,**kwargs):
    return subprocess.run(["git","-C",str(path),*args],check=True,**kwargs)
for checkout,commit in [(repo,"9fd90f03513663ce1372c8cfa723b7a73c4219fa"),
                        (tree/"physfs","eb3383b532c5f74bfeb42ec306ba2cf80eed988c")]:
    if git(checkout,"rev-parse","HEAD",capture_output=True,text=True).stdout.strip()!=commit:
        raise SystemExit("Unexpected upstream revision in "+str(checkout))
git(repo,"apply","--check",str(src/"engine.patch"))
includes={"armor.inc":"3d/astra_armor.inc","finish.inc":"arch/ogl/astra_finish.inc",
          "lighting.inc":"main/astra_light.inc","shader.inc":"arch/ogl/astra_shader.inc",
          "pyro.inc":"arch/ogl/astra_pyro.inc","blast.inc":"arch/ogl/astra_blast.inc"}
for name,path in includes.items():
    if (repo/"d2"/path).exists():raise SystemExit("Use a fresh checkout. An Astra include already exists.")
git(repo,"apply",str(src/"engine.patch"))
for name,path in includes.items(): shutil.copyfile(src/name,repo/"d2"/path)

