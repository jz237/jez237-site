import * as T from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const V = (x: number, y: number, z: number) => new T.Vector3(x, y, z);
export type FlowMode = 'off' | 'oil' | 'coolant';
export function createOverlays(
  scene: T.Scene,
  camera: T.PerspectiveCamera,
  host: HTMLElement,
  controls: OrbitControls,
  onSection: (x: number) => void,
) {
  const guide = new T.Group();
  const frame = new T.LineSegments(
    new T.EdgesGeometry(new T.PlaneGeometry(6.3, 5.4)),
    new T.LineBasicMaterial({
      color: 0xe6a86e,
      transparent: true,
      opacity: 0.65,
      depthTest: false,
    }),
  );
  frame.rotation.y = Math.PI / 2;
  frame.position.y = 1.1;
  guide.rotation.z = -Math.PI / 4;
  guide.add(frame);
  scene.add(guide);
  const handle = document.createElement('button');
  handle.className = 'section-handle';
  handle.textContent = '↔ Section';
  handle.setAttribute('aria-label', 'Drag section plane');
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-valuemin', '-3.8');
  handle.setAttribute('aria-valuemax', '3.8');
  host.appendChild(handle);
  let value = 0,
    drag:
      | { x: number; y: number; value: number; dx: number; dy: number }
      | undefined;
  handle.onpointerdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handle.setPointerCapture(e.pointerId);
    controls.enabled = false;
    const r = host.getBoundingClientRect(),
      a = V(value, 1.1, 3.15).applyAxisAngle(V(0,0,1), -Math.PI/4).project(camera),
      b = V(value + 1, 1.1, 3.15).applyAxisAngle(V(0,0,1), -Math.PI/4).project(camera);
    let dx = ((b.x - a.x) * r.width) / 2,
      dy = (-(b.y - a.y) * r.height) / 2;
    if (Math.hypot(dx, dy) < 12) {
      dx = 55;
      dy = 0;
    }
    drag = { x: e.clientX, y: e.clientY, value, dx, dy };
  };
  handle.onpointermove = (e) => {
    if (!drag) return;
    const d = drag;
    onSection(
      T.MathUtils.clamp(
        d.value +
          ((e.clientX - d.x) * d.dx + (e.clientY - d.y) * d.dy) /
            (d.dx * d.dx + d.dy * d.dy),
        -3.8,
        3.8,
      ),
    );
  };
  const end = () => {
    drag = undefined;
    controls.enabled = true;
  };
  handle.onpointerup = end;
  handle.onpointercancel = end;
  handle.onlostpointercapture = end;
  handle.onkeydown = (e) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      onSection(
        e.key === 'Home'
          ? -3.8
          : e.key === 'End'
            ? 3.8
            : T.MathUtils.clamp(
                value + (e.key === 'ArrowRight' ? 0.1 : -0.1),
                -3.8,
                3.8,
              ),
      );
    }
  };
  const flowRoot = new T.Group();
  scene.add(flowRoot);
  const paths: {
    mode: FlowMode;
    curve: T.CatmullRomCurve3;
    group: T.Group;
    arrows: T.Mesh[];
  }[] = [];
  for (const mode of ['oil', 'coolant'] as const)
    for (const bank of [-1, 1]) {
      const points =
        mode === 'oil'
          ? [
              V(0, -0.9, 2.1),
              V(0.25 * bank, -0.6, 2.5),
              V(0.35 * bank, 0.1, 2.1),
              V(0.35 * bank, 0.2, -1.9),
              V(1.4 * bank, 1.7, -1.8),
              V(1.7 * bank, 2.2, 1.8),
              V(1.1 * bank, 0.7, 2),
              V(0.5 * bank, -0.8, 1.8),
            ]
          : [
              V(0.3 * bank, 0.4, 3),
              V(1.2 * bank, 1.1, 2.1),
              V(1.4 * bank, 1.3, -2),
              V(2 * bank, 2, -2),
              V(2 * bank, 2, 1.9),
              V(0.25 * bank, 2.5, 2.8),
              V(0.5 * bank, 1.8, 3.6),
              V(0.3 * bank, 0.4, 3),
            ];
      const curve = new T.CatmullRomCurve3(points, true, 'catmullrom', 0.35),
        group = new T.Group();
      flowRoot.add(group);
      const color = mode === 'oil' ? 0xffc459 : 0x42cfff;
      group.add(
        new T.Mesh(
          new T.TubeGeometry(curve, 90, 0.022, 5, true),
          new T.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.42,
            depthTest: false,
            depthWrite: false,
          }),
        ),
      );
      const arrows = Array.from({ length: 10 }, () => {
        const arrow = new T.Mesh(
          new T.ConeGeometry(0.065, 0.19, 7),
          new T.MeshBasicMaterial({
            color,
            depthTest: false,
            depthWrite: false,
          }),
        );
        arrow.renderOrder = 100;
        group.add(arrow);
        return arrow;
      });
      paths.push({ mode, curve, group, arrows });
    }
  return {
    update(
      section: number,
      showSection: boolean,
      mode: FlowMode,
      angle: number,
    ) {
      value = section;
      guide.visible = showSection && !!drag;
      guide.position.set(section * Math.SQRT1_2, -section * Math.SQRT1_2, 0);
      handle.hidden = !showSection;
      if (showSection) {
        const r = host.getBoundingClientRect(),
          p = V(section, 1.1, 3.15).applyAxisAngle(V(0,0,1), -Math.PI/4).project(camera);
        handle.hidden = p.z > 1 || p.z < -1;
        handle.style.left = `${T.MathUtils.clamp(((p.x + 1) * r.width) / 2, 55, r.width - 55)}px`;
        handle.style.top = `${T.MathUtils.clamp(((-p.y + 1) * r.height) / 2, 40, r.height - 40)}px`;
        handle.setAttribute('aria-valuenow', section.toFixed(2));
        handle.setAttribute(
          'aria-valuetext',
          `${(section * 100).toFixed(0)} millimeters from center`,
        );
      }
      paths.forEach((p) => {
        p.group.visible = p.mode === mode;
        if (!p.group.visible) return;
        p.arrows.forEach((a, i) => {
          const t = (((angle / 720 + i / 10) % 1) + 1) % 1;
          a.position.copy(p.curve.getPointAt(t));
          a.quaternion.setFromUnitVectors(
            V(0, 1, 0),
            p.curve.getTangentAt(t).normalize(),
          );
        });
      });
    },
    dispose() {
      end();
      handle.remove();
      [guide, flowRoot].forEach((root) => {
        root.traverse((o) => {
          if (o instanceof T.Mesh || o instanceof T.LineSegments) {
            o.geometry.dispose();
            const ms = Array.isArray(o.material) ? o.material : [o.material];
            ms.forEach((m) => m.dispose());
          }
        });
        scene.remove(root);
      });
    },
  };
}
