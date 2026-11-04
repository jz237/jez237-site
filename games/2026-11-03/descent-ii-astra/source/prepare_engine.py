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
includes.update({'fleet.inc': 'arch/ogl/astra_fleet.inc', 'fleet_types.inc': 'arch/ogl/astra_fleet_types.inc', 'shell.inc': '3d/astra_shell.inc', 'gantry.inc': 'arch/ogl/astra_gantry.inc', 'plume.inc': 'arch/ogl/astra_plume.inc', 'encounter.inc': 'main/astra_encounter.inc'})
includes["weapons_demo.inc"]="arch/ogl/astra_weapons_demo.inc"
includes["motion.inc"]="arch/ogl/astra_motion.inc"
includes["pickups.inc"]="arch/ogl/astra_pickups.inc"
includes["autopilot.inc"]="main/astra_autopilot.inc"
includes["menus.inc"]="main/astra_menus.inc"
includes["lists.inc"]="main/astra_lists.inc"
includes["pause.inc"]="main/astra_pause.inc"
includes["preview.inc"]="main/astra_preview.inc"
includes["lens.inc"]="arch/ogl/astra_lens.inc"
includes["recharge.inc"]="arch/ogl/astra_recharge.inc"
includes["debris.inc"]="arch/ogl/astra_debris.inc"
includes["environment.inc"]="arch/ogl/astra_environment.inc"
includes["mine_preview.inc"]="main/astra_mine_preview.inc"
includes["foundry.inc"]="arch/ogl/astra_foundry.inc"
includes["antialias.inc"]="arch/ogl/astra_antialias.inc"
for name,path in includes.items():
    if (repo/"d2"/path).exists():raise SystemExit("Use a fresh checkout. An Astra include already exists.")
git(repo,"apply",str(src/"engine.patch"))
for name,path in includes.items(): shutil.copyfile(src/name,repo/"d2"/path)

