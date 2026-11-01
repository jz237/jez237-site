import type { Group, Mesh, Object3D } from 'three';
import { Behaviour, Random } from '@scenoco-three/core';
import { mat, type SegKind } from './assets';

const sizeOf = (kind: SegKind) => (kind === 'queen' || kind === 'armored' ? 1.24 : kind === 'child' ? 0.82 : 1.16);

/**
 * One segment of a millipede, as seen: a glowing banded shell on scurrying legs, and — on a head — eyes
 * and mandibles. Where it is comes from `Swarm`, which walks the chain; this only looks the part: it
 * faces where it goes, its legs run in step with its speed, and a hit kicks it.
 */
export class Segment extends Behaviour<Group> {
  body: Mesh | null = null;
  legs: Mesh | null = null;
  face: Object3D | null = null;
  crown: Object3D | null = null;

  private kick = 0;
  private clinked = 0;
  private stride = Random.range(0, Math.PI * 2);
  private kind: SegKind = 'normal';
  private head = false;

  /** Its paint by kind, and a head's face. */
  dress(kind: SegKind, head: boolean): void {
    this.kind = kind;
    this.head = head;
    if (this.body) this.body.material = head ? mat.head[kind] : mat.body[kind];
    if (this.face) this.face.visible = head;
    if (this.crown) this.crown.visible = head && (kind === 'queen' || kind === 'armored');
    this.node.scale.setScalar(sizeOf(kind) * (head ? 1.12 : 1));
  }

  /** A hit that did not kill it. */
  wound(): void {
    this.kick = 1;
  }

  /** A bolt glancing off armour. */
  clink(): void {
    this.clinked = 1;
  }

  /** Where the chain put it this frame, which way it is heading, and how far it moved. */
  place(x: number, y: number, angle: number, moved: number): void {
    this.stride += moved * 7.5;
    this.node.position.set(x, y, 0.42);
    // Turn the short way round, eased: a corner reads as a turn, not a snap.
    let d = angle - this.node.rotation.z;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    this.node.rotation.z += d * 0.45;
    if (this.legs) this.legs.rotation.z = Math.sin(this.stride) * 0.5;
    if (this.body) {
      this.body.position.z = Math.abs(Math.sin(this.stride)) * 0.05;
      this.body.rotation.x = Math.sin(this.stride) * 0.12;
    }
  }

  override update(dt: number): void {
    if (this.kick <= 0 && this.clinked <= 0) return;
    this.kick = Math.max(0, this.kick - dt * 5);
    this.clinked = Math.max(0, this.clinked - dt * 6);
    const size = sizeOf(this.kind) * (this.head ? 1.12 : 1) * (1 + this.kick * 0.28 - this.clinked * 0.08);
    this.node.scale.setScalar(size);
  }
}
