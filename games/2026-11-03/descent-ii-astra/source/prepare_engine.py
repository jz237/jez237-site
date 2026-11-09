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
includes={
    "uniform_cache.inc": "arch/ogl/astra_uniform_cache.inc",
    'industrial.inc':'arch/ogl/astra_industrial.inc',
    'confinement.inc':'arch/ogl/astra_confinement.inc',"armor.inc":"3d/astra_armor.inc","finish.inc":"arch/ogl/astra_finish.inc",
          "lighting.inc":"main/astra_light.inc","shader.inc":"arch/ogl/astra_shader.inc",
          "pyro.inc":"arch/ogl/astra_pyro.inc","blast.inc":"arch/ogl/astra_blast.inc"}
includes.update({'fleet.inc': 'arch/ogl/astra_fleet.inc', 'fleet_types.inc': 'arch/ogl/astra_fleet_types.inc', 'shell.inc': '3d/astra_shell.inc', 'gantry.inc': 'arch/ogl/astra_gantry.inc', 'plume.inc': 'arch/ogl/astra_plume.inc', 'encounter.inc': 'main/astra_encounter.inc'})
includes["weapons_demo.inc"]="arch/ogl/astra_weapons_demo.inc"
includes["motion.inc"]="arch/ogl/astra_motion.inc"
includes["pickups.inc"]="arch/ogl/astra_pickups.inc"
includes["atlas.inc"]="main/astra_atlas.inc"
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
includes["fixture_lights.inc"]="arch/ogl/astra_fixture_lights.inc"
includes["fixtures.inc"]="arch/ogl/astra_fixtures.inc"
includes["door_mesh.inc"]="arch/ogl/astra_door_mesh.inc"
includes["liquids.inc"]="arch/ogl/astra_liquids.inc"
includes["doors.inc"]="arch/ogl/astra_doors.inc"
includes["generated.inc"]="arch/ogl/astra_generated.inc"
includes["districts.inc"]="arch/ogl/astra_districts.inc"
includes["faithful.inc"]="arch/ogl/astra_faithful.inc"
includes["foundry.inc"]="arch/ogl/astra_foundry.inc"
includes["antialias.inc"]="arch/ogl/astra_antialias.inc"
includes["detonations.h"]="main/astra_detonations.h"
includes["detonation_draw.inc"]="arch/ogl/astra_detonation_draw.inc"
includes["streaming.inc"]="arch/ogl/astra_streaming.inc"
includes["glstate.inc"]="arch/ogl/astra_glstate.inc"
includes["surface_lod.inc"]="arch/ogl/astra_surface_lod.inc"
includes["chain_explosions.inc"]="arch/ogl/astra_chain_explosions.inc"
includes["fragment_contacts.inc"]="arch/ogl/astra_fragment_contacts.inc"
includes["chain_showcase.inc"]="arch/ogl/astra_chain_showcase.inc"
includes["chain_audio.inc"]="main/astra_chain_audio.inc"
includes["death_chain.inc"]="main/astra_death_chain.inc"
includes["death_mix.inc"]="arch/sdl/astra_death_mix.inc"
includes["wall_styles.inc"]="arch/ogl/astra_wall_styles.inc"
for name in ["combat","combat_render","shadows","shadow_scene"]:
    includes[name+".inc"]="arch/ogl/astra_"+name+".inc"
includes["overload_lighting.inc"]="arch/ogl/overload_lighting.inc"
includes["overload_world.inc"]="arch/ogl/overload_world.inc"
includes["overload_actors.inc"]="arch/ogl/overload_actors.inc"
includes["overload_bridge.inc"]="main/overload_bridge.inc"
includes["overload_fields.inc"]="main/overload_fields.inc"
includes["overload_save.inc"]="main/overload_save.inc"
includes["progress.inc"]="main/astra_progress.inc"
includes["sfx.inc"]="arch/sdl/astra_sfx.inc"
includes["tactics.inc"]="main/astra_tactics.inc"
includes["room_reflections.inc"]="arch/ogl/astra_room_reflections.inc"
includes["detail_upgrade.inc"]="arch/ogl/astra_detail_upgrade.inc"
includes["controllers.inc"]="main/astra_controllers.inc"
includes["network.inc"]="main/astra_network.inc"
includes["squadron.inc"]="main/astra_squadron.inc"
includes['strata.inc'] = 'arch/ogl/astra_strata.inc'
includes['mine_life.inc'] = 'arch/ogl/astra_mine_life.inc'
includes['scenery.inc'] = 'arch/ogl/astra_scenery.inc'
includes['geology.inc'] = 'arch/ogl/astra_geology.inc'
includes['shore_geometry.inc'] = 'arch/ogl/astra_shore_geometry.inc'
for name,path in includes.items():
    if (repo/"d2"/path).exists():raise SystemExit("Use a fresh checkout. An Astra include already exists.")
git(repo,"apply",str(src/"engine.patch"))
for name,path in includes.items(): shutil.copyfile(src/name,repo/"d2"/path)

