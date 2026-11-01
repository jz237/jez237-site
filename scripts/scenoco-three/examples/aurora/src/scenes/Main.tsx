import {
  AmbientLight, Color, ConeGeometry, DirectionalLight, Fog, Group, HemisphereLight, Mesh, MeshStandardMaterial,
  PerspectiveCamera, PlaneGeometry, Scene,
} from 'three';
import { geo, mat } from '../assets';
import { CameraRig } from '../CameraRig';
import { Game } from '../Game';
import { Sky } from '../Sky';
import { Sound } from '../Sound';
import { NeonGridTexture } from '../textures';
import {
  AirBurst, BlastPrefab, BombPrefab, BomberPrefab, CityPrefab, FireworkBlue, FireworkGreen, FireworkPink, HostileBlastPrefab,
  ImpactBurst, InterceptorPrefab, KillBurst, MetalBurst, MeteorBurst, MeteorPrefab, MirvPrefab, NukeBurst, NukePrefab,
  OrbitalPrefab, RadarPrefab, ReticlePrefab, RingPrefab, RubbleBurst, SatellitePrefab, SiloPrefab, SmartPrefab, StealthPrefab,
  WarheadPrefab,
} from './prefabs';

/**
 * The far country: a glowing grid plain running back to dark mountains, a second skyline of unlit
 * towers behind the front line, and the neon rail the defended cities stand on.
 */
const Country = () => (
  <Group>
    <Mesh name="plain" position={[0, 0, -60]} rotation={[-1.5708, 0, 0]}>
      <PlaneGeometry args={[420, 200]} />
      <MeshStandardMaterial color="#03070e" emissive="#2fbf8f" emissiveIntensity={0.85} roughness={0.85} metalness={0.2}>
        <NeonGridTexture attach="emissiveMap" repeat={[105, 50]} />
      </MeshStandardMaterial>
    </Mesh>
    <Mesh position={[-70, 1, -95]}>
      <ConeGeometry args={[34, 24, 5]} />
      <MeshStandardMaterial color="#070b18" emissive="#1d5a5a" emissiveIntensity={0.35} flatShading roughness={0.9} />
    </Mesh>
    <Mesh position={[-22, 3, -110]}>
      <ConeGeometry args={[40, 30, 5]} />
      <MeshStandardMaterial color="#080c1a" emissive="#2a3a7a" emissiveIntensity={0.3} flatShading roughness={0.9} />
    </Mesh>
    <Mesh position={[36, 0, -92]}>
      <ConeGeometry args={[30, 22, 6]} />
      <MeshStandardMaterial color="#070b18" emissive="#1d5a5a" emissiveIntensity={0.35} flatShading roughness={0.9} />
    </Mesh>
    <Mesh position={[85, 2, -105]}>
      <ConeGeometry args={[38, 28, 5]} />
      <MeshStandardMaterial color="#080c1a" emissive="#2a3a7a" emissiveIntensity={0.3} flatShading roughness={0.9} />
    </Mesh>
  </Group>
);

/** The one scene: the night sky, the country, six cities, three batteries, the aim, and the rules. */
export const Main = () => (
  <Scene>
    <Color attach="background" args={['#02040a']} />
    <Fog attach="fog" args={['#04101f', 60, 190]} />

    <AmbientLight color="#6d8cff" intensity={0.3} />
    <HemisphereLight args={['#5b7cff', '#0a1a14', 0.6]} />
    <DirectionalLight color="#cfe0ff" intensity={1.3} position={[-8, 20, 14]} />
    <DirectionalLight color="#53ffa3" intensity={0.35} position={[0, 16, -30]} />

    <PerspectiveCamera near={0.1} far={600} position={[0, 5.5, 36]}>
      <CameraRig target={[0, 10.2, 0]} />
    </PerspectiveCamera>

    <Mesh name="sky" position={[0, 55, -150]}>
      <PlaneGeometry args={[900, 320]} />
      <Sky />
    </Mesh>

    <Country />

    <Group name="cities">
      <CityPrefab position={[-10, 0, 0]} />
      <CityPrefab position={[-6.6, 0, 0]} />
      <CityPrefab position={[-3.3, 0, 0]} />
      <CityPrefab position={[3.3, 0, 0]} />
      <CityPrefab position={[6.6, 0, 0]} />
      <CityPrefab position={[10, 0, 0]} />
    </Group>
    <Group name="batteries">
      <SiloPrefab position={[-13, 0.15, 0]} />
      <SiloPrefab position={[0, 0.15, 0]} />
      <SiloPrefab position={[13, 0.15, 0]} />
    </Group>

    <ReticlePrefab name="aim" position={[0, 11, 0.3]} />

    <Group name="rules">
      <Sound />
      <Game
        warhead={WarheadPrefab}
        mirv={MirvPrefab}
        smart={SmartPrefab}
        nuke={NukePrefab}
        bomb={BombPrefab}
        stealthy={StealthPrefab}
        interceptor={InterceptorPrefab}
        blast={BlastPrefab}
        hostileBlast={HostileBlastPrefab}
        satellite={SatellitePrefab}
        bomber={BomberPrefab}
        orbital={OrbitalPrefab}
        meteor={MeteorPrefab}
        ringFx={RingPrefab}
        radar={RadarPrefab}
        burstAir={AirBurst}
        burstImpact={ImpactBurst}
        burstRubble={RubbleBurst}
        burstKill={KillBurst}
        burstMetal={MetalBurst}
        burstMeteor={MeteorBurst}
        burstNuke={NukeBurst}
        fireworks={[FireworkPink, FireworkGreen, FireworkBlue]}
      />
    </Group>
  </Scene>
);
