import {
  BoxGeometry, CapsuleGeometry, ConeGeometry, CylinderGeometry, Group, IcosahedronGeometry, Mesh, MeshStandardMaterial,
  OctahedronGeometry, PlaneGeometry, PointLight, RingGeometry, SphereGeometry, TorusGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { prefab, ref } from '@scenoco-three/core';
import { ParticleSystem } from '@scenoco-three/particles';
import { geo, mat } from '../assets';
import { Bee, Flea, Inchworm, Scorpion, Spider, Spore } from '../Enemy';
import { Bolt, Drone, Lifetime, Pickup, Shockwave, Spin } from '../misc';
import { Player } from '../Player';
import { Segment } from '../Segment';
import { NeonFrameTexture, NeonLabelTexture } from '../textures';
import { vfx } from '../vfx';

// --- the millipede --------------------------------------------------------------------------

/**
 * One segment, head or body: `Segment.dress` picks its paint and shows the face on a head. Shapes and
 * paints are shared (`assets.ts`), so a long millipede is many draws of a few materials.
 */
export const SegmentPrefab = prefab(() => {
  const body = ref<Mesh>();
  const legs = ref<Mesh>();
  const face = ref<Group>();
  const crown = ref<Mesh>();
  return (
    <Group>
      <Segment body={body} legs={legs} face={face} crown={crown} />
      <Mesh ref={legs} geometry={geo.legs} material={mat.legs} position={[0, 0, -0.12]} />
      <Mesh ref={body} geometry={geo.shell} material={mat.body.normal} />
      <Group ref={face}>
        <Mesh geometry={geo.eye} material={mat.eye} position={[0.36, 0.17, 0.26]} />
        <Mesh geometry={geo.eye} material={mat.eye} position={[0.36, -0.17, 0.26]} />
        <Mesh geometry={geo.antenna} material={mat.antenna} position={[0.3, 0.14, 0.3]} rotation={[0, -0.5, 0.55]} />
        <Mesh geometry={geo.antenna} material={mat.antenna} position={[0.3, -0.14, 0.3]} rotation={[0, -0.5, -0.55]} />
        <Mesh geometry={geo.mandible} material={mat.mandible} position={[0.48, 0.13, 0]} rotation={[0, 0, -0.35]} />
        <Mesh geometry={geo.mandible} material={mat.mandible} position={[0.48, -0.13, 0]} rotation={[0, 0, 0.35]} />
        <Mesh ref={crown} geometry={geo.crown} material={mat.crown} position={[-0.04, 0, 0.42]} scale={[1.4, 1.4, 1.4]} visible={false}>
          <Spin speed={[0, 0, 70]} />
        </Mesh>
      </Group>
    </Group>
  );
});

// --- the gunner -----------------------------------------------------------------------------

/**
 * The player's beetle-ship: a lit glass hull with Breakout's neon frame, a cockpit dome, two engine
 * pods washing blue thrust down the field, the barrel, a light that sweeps the floor with it — and,
 * hidden until earned, the shield bubble and the laser beam.
 */
export const PlayerPrefab = prefab(() => {
  const body = ref<Group>();
  const barrel = ref<Mesh>();
  const shield = ref<Mesh>();
  const beam = ref<Mesh>();
  const light = ref<PointLight>();
  return (
    <Group>
      <Player body={body} barrel={barrel} shield={shield} beam={beam} light={light} />
      <Group ref={body}>
        <Mesh position={[0, -0.05, 0]}>
          <RoundedBoxGeometry args={[1.0, 0.82, 0.42, 4, 0.18]} />
          <MeshStandardMaterial color="#173a7a" emissive="#3b8bff" emissiveIntensity={0.95} roughness={0.2} metalness={0.6}>
            <NeonFrameTexture attach="emissiveMap" />
          </MeshStandardMaterial>
        </Mesh>
        <Mesh position={[0, 0.05, 0.2]} rotation={[1.5708, 0, 0]}>
          <SphereGeometry args={[0.28, 24, 16, 0, 6.2832, 0, 1.5708]} />
          <MeshStandardMaterial color="#7fe8ff" emissive="#3fc8ff" emissiveIntensity={0.75} roughness={0.08} metalness={0.2} />
        </Mesh>
        <Mesh position={[-0.55, -0.2, 0]}>
          <CapsuleGeometry args={[0.15, 0.42, 4, 10]} />
          <MeshStandardMaterial color="#20304f" emissive="#ff3dd8" emissiveIntensity={1.2} roughness={0.3} metalness={0.7} />
        </Mesh>
        <Mesh position={[0.55, -0.2, 0]}>
          <CapsuleGeometry args={[0.15, 0.42, 4, 10]} />
          <MeshStandardMaterial color="#20304f" emissive="#ff3dd8" emissiveIntensity={1.2} roughness={0.3} metalness={0.7} />
        </Mesh>
        <Mesh ref={barrel} position={[0, 0.55, 0.05]}>
          <CylinderGeometry args={[0.07, 0.11, 0.6, 12]} />
          <MeshStandardMaterial color="#ffe0ea" emissive="#ff5a7d" emissiveIntensity={3} roughness={0.25} metalness={0.4} />
        </Mesh>
        <Group position={[-0.55, -0.5, 0]} rotation={[1.5708, 0, 0]}>
          <ParticleSystem effect={vfx.thrust} />
        </Group>
        <Group position={[0.55, -0.5, 0]} rotation={[1.5708, 0, 0]}>
          <ParticleSystem effect={vfx.thrust} />
        </Group>
      </Group>
      <PointLight ref={light} color="#7fb4ff" intensity={3.5} distance={6} decay={2} position={[0, 0.4, 1.2]} />
      <Mesh position={[0, 0, -0.3]}>
        <RingGeometry args={[0.62, 0.72, 48]} />
        <MeshStandardMaterial color="#2ff5d2" emissive="#2ff5d2" emissiveIntensity={1.4} transparent opacity={0.75} depthWrite={false} />
        <Spin speed={[0, 0, 60]} />
      </Mesh>
      <Mesh ref={shield} visible={false}>
        <SphereGeometry args={[0.95, 32, 20]} />
        <MeshStandardMaterial color="#bff6ff" emissive="#7fe8ff" emissiveIntensity={0.35} transparent opacity={0.12} roughness={0.05} depthWrite={false} />
        <Mesh>
          <TorusGeometry args={[0.95, 0.04, 8, 64]} />
          <MeshStandardMaterial color="#fff2b0" emissive="#ffd23f" emissiveIntensity={2.4} />
          <Spin speed={[0, 0, 90]} />
        </Mesh>
      </Mesh>
      <Mesh ref={beam} visible={false} position={[0, 4, 0.05]}>
        <BoxGeometry args={[0.13, 1, 0.13]} />
        <MeshStandardMaterial color="#ff9fd8" emissive="#ff4fc4" emissiveIntensity={3.2} transparent opacity={0.7} depthWrite={false} />
      </Mesh>
    </Group>
  );
});

// --- bolts ----------------------------------------------------------------------------------

export const BoltPrefab = prefab(() => (
  <Mesh geometry={geo.bolt} material={mat.bolt}>
    <Bolt />
  </Mesh>
));
export const HeavyBoltPrefab = prefab(() => (
  <Mesh geometry={geo.bolt} material={mat.heavyBolt} scale={[1.5, 1.2, 1.5]}>
    <Bolt />
  </Mesh>
));
export const DroneBoltPrefab = prefab(() => (
  <Mesh geometry={geo.bolt} material={mat.droneBolt} scale={[0.8, 0.8, 0.8]}>
    <Bolt />
  </Mesh>
));

export const DronePrefab = prefab(() => (
  <Mesh>
    <OctahedronGeometry args={[0.34]} />
    <MeshStandardMaterial color="#ffe066" emissive="#ffb000" emissiveIntensity={1.6} roughness={0.2} metalness={0.5} flatShading />
    <Drone />
    <ParticleSystem effect={vfx.droneTrail} />
  </Mesh>
));

// --- the enemies ----------------------------------------------------------------------------

/** Eight running legs round a red glass body. */
export const SpiderPrefab = prefab(() => {
  const look = ref<Group>();
  const legs = ref<Group>();
  return (
    <Group>
      <Spider look={look} legs={legs} />
      <Group ref={look}>
        <Mesh position={[0, 0, 0.1]} scale={[1, 0.85, 0.7]}>
          <SphereGeometry args={[0.42, 24, 16]} />
          <MeshStandardMaterial color="#4a0a10" emissive="#ff3b4b" emissiveIntensity={2} roughness={0.25} metalness={0.4} />
        </Mesh>
        <Mesh position={[0, 0.42, 0.12]}>
          <SphereGeometry args={[0.2, 16, 12]} />
          <MeshStandardMaterial color="#ffd0d6" emissive="#ff7a8a" emissiveIntensity={2.4} roughness={0.3} />
        </Mesh>
        <Group ref={legs}>
          <Mesh position={[-0.55, 0.25, 0]} rotation={[0, 0, 0.5]}>
            <CapsuleGeometry args={[0.045, 0.6, 3, 6]} />
            <MeshStandardMaterial color="#ff8a95" emissive="#ff3b4b" emissiveIntensity={1.6} />
          </Mesh>
          <Mesh position={[-0.6, 0, 0]} rotation={[0, 0, 1.4]}>
            <CapsuleGeometry args={[0.045, 0.6, 3, 6]} />
            <MeshStandardMaterial color="#ff8a95" emissive="#ff3b4b" emissiveIntensity={1.6} />
          </Mesh>
          <Mesh position={[-0.55, -0.25, 0]} rotation={[0, 0, 2.4]}>
            <CapsuleGeometry args={[0.045, 0.6, 3, 6]} />
            <MeshStandardMaterial color="#ff8a95" emissive="#ff3b4b" emissiveIntensity={1.6} />
          </Mesh>
          <Mesh position={[0.55, 0.25, 0]} rotation={[0, 0, -0.5]}>
            <CapsuleGeometry args={[0.045, 0.6, 3, 6]} />
            <MeshStandardMaterial color="#ff8a95" emissive="#ff3b4b" emissiveIntensity={1.6} />
          </Mesh>
          <Mesh position={[0.6, 0, 0]} rotation={[0, 0, -1.4]}>
            <CapsuleGeometry args={[0.045, 0.6, 3, 6]} />
            <MeshStandardMaterial color="#ff8a95" emissive="#ff3b4b" emissiveIntensity={1.6} />
          </Mesh>
          <Mesh position={[0.55, -0.25, 0]} rotation={[0, 0, -2.4]}>
            <CapsuleGeometry args={[0.045, 0.6, 3, 6]} />
            <MeshStandardMaterial color="#ff8a95" emissive="#ff3b4b" emissiveIntensity={1.6} />
          </Mesh>
        </Group>
      </Group>
    </Group>
  );
});

export const FleaPrefab = prefab(() => {
  const look = ref<Group>();
  return (
    <Group>
      <Flea look={look} />
      <Group ref={look}>
        <Mesh scale={[0.8, 1, 0.8]}>
          <IcosahedronGeometry args={[0.36, 1]} />
          <MeshStandardMaterial color="#3a5a6a" emissive="#bfeaff" emissiveIntensity={1.8} roughness={0.3} flatShading />
        </Mesh>
        <Mesh position={[0, -0.36, 0]}>
          <ConeGeometry args={[0.16, 0.36, 10]} />
          <MeshStandardMaterial color="#ffffff" emissive="#7fd8ff" emissiveIntensity={2.2} />
        </Mesh>
      </Group>
    </Group>
  );
});

export const BeePrefab = prefab(() => {
  const look = ref<Group>();
  const wings = ref<Group>();
  return (
    <Group>
      <Bee look={look} wings={wings} />
      <Group ref={look}>
        <Mesh scale={[0.8, 1.2, 0.8]}>
          <SphereGeometry args={[0.34, 20, 14]} />
          <MeshStandardMaterial color="#3a2a04" emissive="#ffd23f" emissiveIntensity={2.2} roughness={0.3} metalness={0.3}>
            <NeonLabelTexture attach="emissiveMap" args={['≡']} />
          </MeshStandardMaterial>
        </Mesh>
        <Group ref={wings} position={[0, 0.1, 0.25]}>
          <Mesh position={[-0.38, 0, 0]} rotation={[0, 0.3, 0]}>
            <PlaneGeometry args={[0.6, 0.34]} />
            <MeshStandardMaterial color="#e8faff" emissive="#9fdcff" emissiveIntensity={1.6} transparent opacity={0.7} side={2} depthWrite={false} />
          </Mesh>
          <Mesh position={[0.38, 0, 0]} rotation={[0, -0.3, 0]}>
            <PlaneGeometry args={[0.6, 0.34]} />
            <MeshStandardMaterial color="#e8faff" emissive="#9fdcff" emissiveIntensity={1.6} transparent opacity={0.7} side={2} depthWrite={false} />
          </Mesh>
        </Group>
      </Group>
    </Group>
  );
});

/** Claws forward, a jointed tail curled over its back, a glowing sting. Mirrored by `scale.x` for its heading. */
export const ScorpionPrefab = prefab(() => {
  const look = ref<Group>();
  const tail = ref<Group>();
  return (
    <Group>
      <Scorpion look={look} tail={tail} />
      <Group ref={look}>
        <Mesh scale={[1.2, 0.7, 0.6]}>
          <SphereGeometry args={[0.42, 20, 14]} />
          <MeshStandardMaterial color="#4a1a06" emissive="#ff7a2f" emissiveIntensity={2} roughness={0.25} metalness={0.5} />
        </Mesh>
        <Mesh position={[0.62, 0.22, 0]} rotation={[0, 0, 0.5]}>
          <CapsuleGeometry args={[0.1, 0.34, 4, 8]} />
          <MeshStandardMaterial color="#ffb38a" emissive="#ff7a2f" emissiveIntensity={2.2} />
        </Mesh>
        <Mesh position={[0.62, -0.22, 0]} rotation={[0, 0, -0.5]}>
          <CapsuleGeometry args={[0.1, 0.34, 4, 8]} />
          <MeshStandardMaterial color="#ffb38a" emissive="#ff7a2f" emissiveIntensity={2.2} />
        </Mesh>
        <Group ref={tail} position={[-0.45, 0, 0.1]}>
          <Mesh position={[-0.2, 0, 0.15]}>
            <SphereGeometry args={[0.16, 12, 10]} />
            <MeshStandardMaterial color="#4a1a06" emissive="#ff7a2f" emissiveIntensity={2} />
          </Mesh>
          <Mesh position={[-0.32, 0, 0.42]}>
            <SphereGeometry args={[0.14, 12, 10]} />
            <MeshStandardMaterial color="#4a1a06" emissive="#ff7a2f" emissiveIntensity={2} />
          </Mesh>
          <Mesh position={[-0.22, 0, 0.66]}>
            <SphereGeometry args={[0.12, 12, 10]} />
            <MeshStandardMaterial color="#4a1a06" emissive="#ff7a2f" emissiveIntensity={2} />
          </Mesh>
          <Mesh position={[0, 0, 0.74]} rotation={[0, 1.2, 0]}>
            <ConeGeometry args={[0.08, 0.28, 8]} />
            <MeshStandardMaterial color="#ffffff" emissive="#c04bff" emissiveIntensity={4} />
          </Mesh>
        </Group>
      </Group>
    </Group>
  );
});

/** Five lime beads in a row, arching as it inches. */
export const InchwormPrefab = prefab(() => {
  const look = ref<Group>();
  return (
    <Group>
      <Inchworm look={look} />
      <Group ref={look}>
        <Mesh position={[0.6, 0, 0]} scale={[1.15, 1.15, 1.15]} geometry={geo.dot}>
          <MeshStandardMaterial color="#0e3a6a" emissive="#5ab8ff" emissiveIntensity={2.8} roughness={0.3} />
        </Mesh>
        <Mesh position={[0.3, 0, 0.12]} geometry={geo.dot}>
          <MeshStandardMaterial color="#0e3a6a" emissive="#5ab8ff" emissiveIntensity={2.2} roughness={0.3} />
        </Mesh>
        <Mesh position={[0, 0, 0.18]} geometry={geo.dot}>
          <MeshStandardMaterial color="#0e3a6a" emissive="#5ab8ff" emissiveIntensity={2.2} roughness={0.3} />
        </Mesh>
        <Mesh position={[-0.3, 0, 0.12]} geometry={geo.dot}>
          <MeshStandardMaterial color="#0e3a6a" emissive="#5ab8ff" emissiveIntensity={2.2} roughness={0.3} />
        </Mesh>
        <Mesh position={[-0.6, 0, 0]} geometry={geo.dot}>
          <MeshStandardMaterial color="#0e3a6a" emissive="#5ab8ff" emissiveIntensity={2.2} roughness={0.3} />
        </Mesh>
      </Group>
    </Group>
  );
});

export const SporePrefab = prefab(() => {
  const look = ref<Mesh>();
  return (
    <Group>
      <Spore look={look} />
      <Mesh ref={look} geometry={geo.dot} material={mat.spore} scale={[1.3, 1.3, 1.3]} />
      <ParticleSystem effect={vfx.sporeTrail} />
    </Group>
  );
});

// --- power-ups ------------------------------------------------------------------------------

/** A falling pill with its power's word glowing on it — Breakout's pickups. */
const PickupBody = ({ power, color, label }: { power: Pickup['power']; color: string; label: string }) => (
  <Group>
    <Pickup power={power} />
    <Mesh>
      <RoundedBoxGeometry args={[2.1, 0.72, 0.5, 4, 0.3]} />
      <MeshStandardMaterial color="#0b0f1a" emissive={color} emissiveIntensity={3.2} roughness={0.25} metalness={0.6}>
        <NeonLabelTexture attach="emissiveMap" args={[label]} />
      </MeshStandardMaterial>
    </Mesh>
  </Group>
);

export const SpreadPickup = prefab(() => <PickupBody power="spread" color="#56fff0" label="SPREAD" />);
export const LaserPickup = prefab(() => <PickupBody power="laser" color="#ff4fc4" label="LASER" />);
export const ShieldPickup = prefab(() => <PickupBody power="shield" color="#ffe66b" label="SHIELD" />);
export const FrostPickup = prefab(() => <PickupBody power="frost" color="#9fdcff" label="FROST" />);
export const ScorePickup = prefab(() => <PickupBody power="score" color="#a7ff55" label="2×" />);

// --- effects --------------------------------------------------------------------------------

/** A shock ring across the field: the smart bomb, a queen's fall, a death. */
export const ShockwavePrefab = prefab(() => (
  <Mesh>
    <RingGeometry args={[0.95, 1, 96]} />
    <MeshStandardMaterial color="#ff6e8a" emissive="#ff6e8a" emissiveIntensity={2.2} transparent opacity={0.7} depthWrite={false} />
    <Shockwave />
  </Mesh>
));
export const GoldwavePrefab = prefab(() => (
  <Mesh>
    <TorusGeometry args={[1, 0.035, 8, 96]} />
    <MeshStandardMaterial color="#ffe66b" emissive="#ffd23f" emissiveIntensity={2.6} transparent opacity={0.8} depthWrite={false} />
    <Shockwave />
  </Mesh>
));

const Burst = ({ effect, seconds = 1.2 }: { effect: (typeof vfx)[keyof typeof vfx]; seconds?: number }) => (
  <Group>
    <ParticleSystem effect={effect} />
    <Lifetime seconds={seconds} />
  </Group>
);

export const SegmentBurst = prefab(() => <Burst effect={vfx.segment} />);
export const QueenBurst = prefab(() => <Burst effect={vfx.queen} />);
export const ChildBurst = prefab(() => <Burst effect={vfx.child} />);
export const ArmorBurst = prefab(() => <Burst effect={vfx.armor} seconds={0.5} />);
export const ShroomBurst = prefab(() => <Burst effect={vfx.shroom} />);
export const PoisonBurst = prefab(() => <Burst effect={vfx.poison} />);
export const SpiderBurst = prefab(() => <Burst effect={vfx.spider} />);
export const BugBurst = prefab(() => <Burst effect={vfx.bug} />);
export const ScorpionBurst = prefab(() => <Burst effect={vfx.scorpion} />);
export const InchwormBurst = prefab(() => <Burst effect={vfx.inchworm} />);
export const PickupBurst = prefab(() => <Burst effect={vfx.pickup} />);
export const PlayerBurst = prefab(() => <Burst effect={vfx.player} seconds={1.6} />);
export const Spark = prefab(() => <Burst effect={vfx.spark} seconds={0.4} />);
