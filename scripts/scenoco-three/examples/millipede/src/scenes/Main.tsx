import {
  AmbientLight, BoxGeometry, Color, DirectionalLight, Fog, Group, HemisphereLight, InstancedMesh, Mesh, MeshStandardMaterial,
  PerspectiveCamera, PlaneGeometry, Scene,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { ref } from '@scenoco-three/core';
import { geo, mat } from '../assets';
import { CameraRig } from '../CameraRig';
import { Field } from '../Field';
import { Game } from '../Game';
import { NeonFlicker } from '../misc';
import { Sound } from '../Sound';
import { Swarm } from '../Swarm';
import { NeonGridTexture } from '../textures';
import {
  ArmorBurst, BeePrefab, BoltPrefab, BugBurst, ChildBurst, DroneBoltPrefab, DronePrefab, FleaPrefab, FrostPickup,
  GoldwavePrefab, HeavyBoltPrefab, InchwormBurst, InchwormPrefab, LaserPickup, PickupBurst, PlayerBurst, PlayerPrefab,
  PoisonBurst, QueenBurst, ScorePickup, ScorpionBurst, ScorpionPrefab, SegmentBurst, SegmentPrefab, ShieldPickup,
  ShockwavePrefab, ShroomBurst, Spark, SpiderBurst, SpiderPrefab, SporePrefab, SpreadPickup,
} from './prefabs';

/**
 * The garden: a glowing grid floor the size of the field, one grid square to a cell; brushed-metal
 * walls with flickering neon tubes along their inner edges; a faint line where the player's zone
 * begins; and a wide dark floor beyond, so the field sits in a space rather than on black.
 */
const Arena = ({ backdrop, tubes }: { backdrop: { current: Mesh | null }; tubes: { current: Group | null } }) => (
  <Group>
    <Mesh name="beyond" position={[0, 13, -0.12]}>
      <PlaneGeometry args={[160, 160]} />
      <MeshStandardMaterial color="#03060f" emissive="#16244a" emissiveIntensity={0.18} roughness={0.6} metalness={0.5}>
        <NeonGridTexture attach="emissiveMap" repeat={[40, 40]} />
      </MeshStandardMaterial>
    </Mesh>
    <Mesh ref={backdrop} name="floor" position={[0, 13, -0.05]}>
      <PlaneGeometry args={[21, 26]} />
      <MeshStandardMaterial color="#0a1124" emissive="#2f6bff" emissiveIntensity={0.55} roughness={0.42} metalness={0.55}>
        <NeonGridTexture attach="emissiveMap" repeat={[21, 26]} />
      </MeshStandardMaterial>
    </Mesh>
    <Mesh name="zone" position={[0, 2.95, -0.03]}>
      <PlaneGeometry args={[21, 6.1]} />
      <MeshStandardMaterial color="#ff3dd8" emissive="#ff3dd8" emissiveIntensity={0.06} transparent opacity={0.05} depthWrite={false} />
    </Mesh>

    <Mesh name="wall left" position={[-10.9, 13, 0.2]}>
      <RoundedBoxGeometry args={[0.8, 28.6, 0.9, 3, 0.2]} />
      <MeshStandardMaterial color="#1b2540" roughness={0.35} metalness={0.75} />
    </Mesh>
    <Mesh name="wall right" position={[10.9, 13, 0.2]}>
      <RoundedBoxGeometry args={[0.8, 28.6, 0.9, 3, 0.2]} />
      <MeshStandardMaterial color="#1b2540" roughness={0.35} metalness={0.75} />
    </Mesh>
    <Mesh name="wall bottom" position={[0, -0.9, 0.2]}>
      <RoundedBoxGeometry args={[22.6, 0.8, 0.9, 3, 0.2]} />
      <MeshStandardMaterial color="#1b2540" roughness={0.35} metalness={0.75} />
    </Mesh>
    <Mesh name="wall top" position={[0, 26.9, 0.2]}>
      <RoundedBoxGeometry args={[22.6, 0.8, 0.9, 3, 0.2]} />
      <MeshStandardMaterial color="#1b2540" roughness={0.35} metalness={0.75} />
    </Mesh>

    <Group ref={tubes} name="tubes">
      <Mesh position={[-10.56, 13, 0.74]}>
        <BoxGeometry args={[0.13, 27.2, 0.13]} />
        <MeshStandardMaterial color="#38e1ff" emissive="#38e1ff" emissiveIntensity={1.35} roughness={0.3} />
        <NeonFlicker minDelay={3} maxDelay={6} />
      </Mesh>
      <Mesh position={[10.56, 13, 0.74]}>
        <BoxGeometry args={[0.13, 27.2, 0.13]} />
        <MeshStandardMaterial color="#38e1ff" emissive="#38e1ff" emissiveIntensity={1.35} roughness={0.3} />
        <NeonFlicker minDelay={3} maxDelay={6} />
      </Mesh>
      <Mesh position={[0, -0.56, 0.74]}>
        <BoxGeometry args={[21.25, 0.13, 0.13]} />
        <MeshStandardMaterial color="#38e1ff" emissive="#38e1ff" emissiveIntensity={1.35} roughness={0.3} />
        <NeonFlicker minDelay={3} maxDelay={6} />
      </Mesh>
      <Mesh position={[0, 26.56, 0.74]}>
        <BoxGeometry args={[21.25, 0.13, 0.13]} />
        <MeshStandardMaterial color="#38e1ff" emissive="#38e1ff" emissiveIntensity={1.35} roughness={0.3} />
        <NeonFlicker minDelay={3} maxDelay={6} />
      </Mesh>
    </Group>
  </Group>
);

/**
 * The one scene: the garden, its mushrooms, the swarm, the gunner, and the rules over them. The run,
 * the title screen's demo and the waves all happen in it; nothing loads but this.
 */
export const Main = () => {
  const backdrop = ref<Mesh>();
  const tubes = ref<Group>();
  const domes = ref<InstancedMesh>();
  const rims = ref<InstancedMesh>();
  const poisonDomes = ref<InstancedMesh>();
  const poisonRims = ref<InstancedMesh>();
  return (
    <Scene>
      <Color attach="background" args={['#02040a']} />
      <Fog attach="fog" args={['#02040a', 55, 130]} />

      {/* Little fill, so the neon carries the picture: a cool sky, a warm key over the camera, a
          magenta rim from the far side that edges every cap and shell. */}
      <AmbientLight color="#6d8cff" intensity={0.25} />
      <HemisphereLight args={['#5b7cff', '#120a1f', 0.6]} />
      <DirectionalLight color="#ffe8d1" intensity={1.5} position={[4, -8, 16]} />
      <DirectionalLight color="#ff4fd8" intensity={1.3} position={[-6, 30, 4]} />

      {/* Behind the gunner, looking up the field. */}
      <PerspectiveCamera near={0.1} far={400} position={[0, -8, 33]}>
        <CameraRig target={[0, 11.2, 0]} />
      </PerspectiveCamera>

      <Arena backdrop={backdrop} tubes={tubes} />

      <Group name="mushrooms">
        <Field domes={domes} rims={rims} poisonDomes={poisonDomes} poisonRims={poisonRims} />
        <InstancedMesh ref={domes} args={[geo.dome, mat.dome, 560]} frustumCulled={false} />
        <InstancedMesh ref={rims} args={[geo.rim, mat.rim, 560]} frustumCulled={false} />
        <InstancedMesh ref={poisonDomes} args={[geo.dome, mat.poisonDome, 560]} frustumCulled={false} />
        <InstancedMesh ref={poisonRims} args={[geo.rim, mat.poisonRim, 560]} frustumCulled={false} />
      </Group>

      <Group name="swarm">
        <Swarm segment={SegmentPrefab} />
      </Group>

      <PlayerPrefab name="gunner" position={[0, 1.4, 0.35]} />

      <Group name="rules">
        <Sound />
        <Game
          backdrop={backdrop}
          tubes={tubes}
          bolt={BoltPrefab}
          heavyBolt={HeavyBoltPrefab}
          droneBolt={DroneBoltPrefab}
          spider={SpiderPrefab}
          flea={FleaPrefab}
          bee={BeePrefab}
          scorpion={ScorpionPrefab}
          inchworm={InchwormPrefab}
          spore={SporePrefab}
          drone={DronePrefab}
          shockwave={ShockwavePrefab}
          goldwave={GoldwavePrefab}
          pickupSpread={SpreadPickup}
          pickupLaser={LaserPickup}
          pickupShield={ShieldPickup}
          pickupFrost={FrostPickup}
          pickupScore={ScorePickup}
          burstSegment={SegmentBurst}
          burstQueen={QueenBurst}
          burstChild={ChildBurst}
          burstArmor={ArmorBurst}
          burstShroom={ShroomBurst}
          burstPoison={PoisonBurst}
          burstSpider={SpiderBurst}
          burstBug={BugBurst}
          burstScorpion={ScorpionBurst}
          burstInchworm={InchwormBurst}
          burstPickup={PickupBurst}
          burstPlayer={PlayerBurst}
          spark={Spark}
        />
      </Group>
    </Scene>
  );
};
