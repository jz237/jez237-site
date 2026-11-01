import {
  BoxGeometry, CapsuleGeometry, ConeGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial, PlaneGeometry,
  RingGeometry, SphereGeometry, TorusGeometry,
} from 'three';
import { prefab, ref } from '@scenoco-three/core';
import { ParticleSystem } from '@scenoco-three/particles';
import { Aim } from '../Aim';
import { geo, mat } from '../assets';
import { City, Silo } from '../Defense';
import { Lifetime, Shockwave, Spin } from '../misc';
import { Blast, Bomber, Interceptor, Meteor, Orbital, Satellite, Warhead } from '../Ordnance';
import { vfx } from '../vfx';

// --- what is defended ---------------------------------------------------------------------------

/** A city: towers built by `City` itself, rubble and fire for when it falls, a shield for when it has one. */
export const CityPrefab = prefab(() => {
  const towers = ref<Group>();
  const rubble = ref<Group>();
  const shield = ref<Mesh>();
  const fire = ref<ParticleSystem>();
  return (
    <Group>
      <City towers={towers} rubble={rubble} shield={shield} fire={fire} />
      <Group ref={towers} />
      <Mesh position={[0, 0.02, 0]} rotation={[-1.5708, 0, 0]}>
        <RingGeometry args={[1.05, 1.18, 48, 1, 0, 3.1416]} />
        <MeshStandardMaterial color="#53ffa3" emissive="#53ffa3" emissiveIntensity={1.4} transparent opacity={0.7} depthWrite={false} side={2} />
      </Mesh>
      <Group ref={rubble} visible={false}>
        <Mesh geometry={geo.rubble} material={mat.rubble} position={[-0.6, 0.1, 0.1]} scale={[1.6, 0.8, 1.2]} />
        <Mesh geometry={geo.rubble} material={mat.rubble} position={[-0.2, 0.14, -0.1]} scale={[2, 1.1, 1.5]} />
        <Mesh geometry={geo.rubble} material={mat.rubble} position={[0.25, 0.1, 0.12]} scale={[1.5, 0.9, 1.3]} />
        <Mesh geometry={geo.rubble} material={mat.rubble} position={[0.65, 0.08, -0.05]} scale={[1.8, 0.7, 1.2]} />
        <Mesh position={[0, 0.18, -0.05]} rotation={[0, 0, 0.35]} scale={[0.12, 0.9, 0.3]} geometry={geo.box} material={mat.backTower} />
      </Group>
      <Group position={[0, 0.2, 0]} rotation={[-1.5708, 0, 0]}>
        <ParticleSystem ref={fire} effect={vfx.fire} playOnAwake={false} />
      </Group>
      <Mesh ref={shield} position={[0, 0, 0]} visible={false}>
        <SphereGeometry args={[1.35, 32, 16, 0, 6.2832, 0, 1.5708]} />
        <MeshStandardMaterial color="#9ff6ff" emissive="#38e1ff" emissiveIntensity={0.9} transparent opacity={0.22} depthWrite={false} wireframe />
      </Mesh>
    </Group>
  );
});

/** A missile battery: base, dome, and a barrel on a pivot that tracks the aim. */
export const SiloPrefab = prefab(() => {
  const base = ref<Mesh>();
  const pivot = ref<Group>();
  const barrel = ref<Mesh>();
  return (
    <Group>
      <Silo base={base} pivot={pivot} barrel={barrel} />
      <Mesh position={[0, -0.1, 0]} scale={[2.6, 0.5, 1.6]}>
        <SphereGeometry args={[0.6, 24, 10, 0, 6.2832, 0, 1.5708]} />
        <MeshStandardMaterial color="#0e1626" emissive="#1a3a6a" emissiveIntensity={0.4} roughness={0.7} metalness={0.3} />
      </Mesh>
      <Mesh ref={base} geometry={geo.silo} material={mat.silo} position={[0, 0.25, 0]} />
      <Mesh geometry={geo.dome} material={mat.dome} position={[0, 0.5, 0]} />
      <Mesh position={[0, 0.5, 0]} rotation={[1.5708, 0, 0]}>
        <TorusGeometry args={[0.66, 0.04, 8, 40]} />
        <MeshStandardMaterial color="#38e1ff" emissive="#38e1ff" emissiveIntensity={2.2} />
      </Mesh>
      <Group ref={pivot} position={[0, 0.5, 0]}>
        <Mesh ref={barrel} geometry={geo.barrel} material={mat.barrel} position={[0, 0.45, 0]} />
      </Group>
    </Group>
  );
});

// --- what falls ------------------------------------------------------------------------------------

const WarheadBody = ({ paint, trail, scale = 1, children }: { paint: MeshStandardMaterial; trail: (typeof vfx)['enemyTrail']; scale?: number; children?: unknown }) => {
  const look = ref<Group>();
  return (
    <Group>
      <Warhead look={look} />
      <Group ref={look} scale={[scale, scale, scale]}>
        <Mesh geometry={geo.warhead} material={paint} />
        <Mesh geometry={geo.glow} material={mat.warheadGlow} position={[0, -0.22, 0]} scale={[0.7, 0.7, 0.7]} />
        {children}
      </Group>
      <ParticleSystem effect={trail} />
    </Group>
  );
};

export const WarheadPrefab = prefab(() => <WarheadBody paint={mat.warhead} trail={vfx.enemyTrail} />);
export const MirvPrefab = prefab(() => <WarheadBody paint={mat.mirv} trail={vfx.mirvTrail} scale={1.35} />);
export const SmartPrefab = prefab(() => <WarheadBody paint={mat.smart} trail={vfx.smartTrail} scale={1.15} />);
/** A nuclear warhead: twice the size, a hazard ring spinning round it. */
export const NukePrefab = prefab(() => (
  <WarheadBody paint={mat.nuke} trail={vfx.nukeTrail} scale={2.6}>
    <Mesh>
      <RingGeometry args={[0.27, 0.31, 36, 1]} />
      <MeshStandardMaterial color="#ffd23f" emissive="#ff3b1a" emissiveIntensity={2.2} transparent opacity={0.85} depthWrite={false} side={2} />
      <Spin speed={[0, 0, 140]} />
    </Mesh>
  </WarheadBody>
));
export const BombPrefab = prefab(() => <WarheadBody paint={mat.warhead} trail={vfx.enemyTrail} scale={0.85} />);
export const StealthPrefab = prefab(() => <WarheadBody paint={mat.stealth} trail={vfx.stealthTrail} />);

export const InterceptorPrefab = prefab(() => (
  <Group>
    <Interceptor />
    <Mesh geometry={geo.interceptor} material={mat.interceptor} />
    <Mesh geometry={geo.glow} material={mat.interceptorGlow} position={[0, 0.2, 0]} scale={[0.55, 0.55, 0.55]} />
    <ParticleSystem effect={vfx.interceptorTrail} />
  </Group>
));

/** A friendly airburst: a white-gold ball of fire; additive, so overlapping blasts burn brighter. */
export const BlastPrefab = prefab(() => (
  <Mesh geometry={geo.blast}>
    <Blast />
  </Mesh>
));
/** A warhead's ground burst: red fire. */
export const HostileBlastPrefab = prefab(() => (
  <Mesh geometry={geo.blast}>
    <Blast friendly={false} />
  </Mesh>
));

// --- the bosses ------------------------------------------------------------------------------------

export const SatellitePrefab = prefab(() => {
  const look = ref<Group>();
  return (
    <Group>
      <Satellite look={look} />
      <Group ref={look}>
        <Mesh scale={[0.6, 0.45, 0.45]} geometry={geo.box} material={mat.silo} />
        <Mesh position={[-0.85, 0, 0]}>
          <BoxGeometry args={[1, 0.36, 0.04]} />
          <MeshStandardMaterial color="#10224a" emissive="#3a6bff" emissiveIntensity={1.6} metalness={0.8} roughness={0.2} />
        </Mesh>
        <Mesh position={[0.85, 0, 0]}>
          <BoxGeometry args={[1, 0.36, 0.04]} />
          <MeshStandardMaterial color="#10224a" emissive="#3a6bff" emissiveIntensity={1.6} metalness={0.8} roughness={0.2} />
        </Mesh>
        <Mesh position={[0, -0.32, 0]}>
          <ConeGeometry args={[0.18, 0.22, 16, 1, true]} />
          <MeshStandardMaterial color="#ffd0d6" emissive="#ff3b4b" emissiveIntensity={3} side={2} />
        </Mesh>
      </Group>
    </Group>
  );
});

/** The bomber: a long dark fuselage, swept wings, engine fire trailing. Mirrored by `scale.x` for its heading. */
export const BomberPrefab = prefab(() => {
  const look = ref<Group>();
  return (
    <Group>
      <Bomber look={look} />
      <Group ref={look}>
        <Mesh rotation={[0, 0, 1.5708]}>
          <CapsuleGeometry args={[0.26, 2.2, 6, 16]} />
          <MeshStandardMaterial color="#1a2030" emissive="#ff6a3a" emissiveIntensity={0.35} metalness={0.8} roughness={0.3} />
        </Mesh>
        <Mesh position={[-0.1, 0, 0.05]} rotation={[0, 0, -0.25]}>
          <BoxGeometry args={[0.9, 0.06, 2.6]} />
          <MeshStandardMaterial color="#222a3a" emissive="#ff6a3a" emissiveIntensity={0.25} metalness={0.8} roughness={0.35} />
        </Mesh>
        <Mesh position={[-1.15, 0.35, 0]} rotation={[0, 0, -0.4]}>
          <BoxGeometry args={[0.5, 0.5, 0.06]} />
          <MeshStandardMaterial color="#222a3a" emissive="#ff6a3a" emissiveIntensity={0.25} metalness={0.8} roughness={0.35} />
        </Mesh>
        <Mesh position={[1.25, 0.05, 0]}>
          <SphereGeometry args={[0.16, 16, 10]} />
          <MeshStandardMaterial color="#ffd0a0" emissive="#ff8a4a" emissiveIntensity={4} />
        </Mesh>
        <Group position={[-1.4, -0.05, 0.6]}>
          <ParticleSystem effect={vfx.exhaust} />
        </Group>
        <Group position={[-1.4, -0.05, -0.6]}>
          <ParticleSystem effect={vfx.exhaust} />
        </Group>
      </Group>
    </Group>
  );
});

/** The orbital cannon: a charging violet core inside a spinning ring; its beam hidden until it fires. */
export const OrbitalPrefab = prefab(() => {
  const look = ref<Group>();
  const ring = ref<Mesh>();
  const core = ref<Mesh>();
  const beam = ref<Mesh>();
  return (
    <Group>
      <Orbital look={look} ring={ring} core={core} beam={beam} />
      <Group ref={look}>
        <Mesh ref={core}>
          <SphereGeometry args={[0.5, 28, 18]} />
          <MeshStandardMaterial color="#d8c8ff" emissive="#a06bff" emissiveIntensity={2} roughness={0.2} />
        </Mesh>
        <Mesh ref={ring}>
          <TorusGeometry args={[1.1, 0.09, 8, 6]} />
          <MeshStandardMaterial color="#2a2040" emissive="#8a5aff" emissiveIntensity={1.6} metalness={0.8} roughness={0.25} />
        </Mesh>
        <Mesh rotation={[1.2, 0, 0]}>
          <TorusGeometry args={[1.5, 0.04, 8, 48]} />
          <MeshStandardMaterial color="#ffffff" emissive="#c8a8ff" emissiveIntensity={2.4} />
          <Spin speed={[0, 0, 80]} />
        </Mesh>
      </Group>
      <Mesh ref={beam} visible={false}>
        <BoxGeometry args={[0.35, 1, 0.35]} />
        <MeshStandardMaterial color="#ffffff" emissive="#c08aff" emissiveIntensity={8} transparent opacity={0.85} depthWrite={false} blending={2} />
      </Mesh>
    </Group>
  );
});

export const MeteorPrefab = prefab(() => (
  <Group>
    <Meteor />
    <Mesh geometry={geo.meteor} material={mat.meteor} />
    <ParticleSystem effect={vfx.meteorTrail} />
  </Group>
));

// --- the aim ----------------------------------------------------------------------------------------

export const ReticlePrefab = prefab(() => (
  <Mesh>
    <RingGeometry args={[0.36, 0.44, 40]} />
    <MeshStandardMaterial color="#9ff6ff" emissive="#53ffa3" emissiveIntensity={2.4} transparent opacity={0.9} depthWrite={false} />
    <Aim />
    <Mesh>
      <PlaneGeometry args={[0.06, 0.5]} />
      <MeshStandardMaterial color="#9ff6ff" emissive="#53ffa3" emissiveIntensity={2.4} transparent opacity={0.8} depthWrite={false} />
    </Mesh>
    <Mesh rotation={[0, 0, 1.5708]}>
      <PlaneGeometry args={[0.06, 0.5]} />
      <MeshStandardMaterial color="#9ff6ff" emissive="#53ffa3" emissiveIntensity={2.4} transparent opacity={0.8} depthWrite={false} />
    </Mesh>
  </Mesh>
));

// --- effects -----------------------------------------------------------------------------------------

export const RingPrefab = prefab(() => (
  <Mesh>
    <RingGeometry args={[0.95, 1, 96]} />
    <MeshStandardMaterial color="#ffe6b0" emissive="#ffb347" emissiveIntensity={2.4} transparent opacity={0.8} depthWrite={false} />
    <Shockwave />
  </Mesh>
));
export const RadarPrefab = prefab(() => (
  <Mesh>
    <RingGeometry args={[0.93, 1, 160]} />
    <MeshStandardMaterial color="#c8ffe6" emissive="#3bff9a" emissiveIntensity={3.6} transparent opacity={0.9} depthWrite={false} />
    <Shockwave />
  </Mesh>
));

const Burst = ({ effect, seconds = 1.6 }: { effect: (typeof vfx)['airburst']; seconds?: number }) => (
  <Group>
    <ParticleSystem effect={effect} />
    <Lifetime seconds={seconds} />
  </Group>
);

export const AirBurst = prefab(() => <Burst effect={vfx.airburst} />);
export const ImpactBurst = prefab(() => <Burst effect={vfx.impact} />);
export const RubbleBurst = prefab(() => <Burst effect={vfx.rubble} seconds={2} />);
export const KillBurst = prefab(() => <Burst effect={vfx.kill} seconds={1} />);
export const MetalBurst = prefab(() => <Burst effect={vfx.metal} />);
export const MeteorBurst = prefab(() => <Burst effect={vfx.meteor} />);
export const NukeBurst = prefab(() => <Burst effect={vfx.nuke} seconds={2.4} />);
export const FireworkPink = prefab(() => <Burst effect={vfx.firework} />);
export const FireworkGreen = prefab(() => <Burst effect={vfx.fireworkGreen} />);
export const FireworkBlue = prefab(() => <Burst effect={vfx.fireworkBlue} />);
