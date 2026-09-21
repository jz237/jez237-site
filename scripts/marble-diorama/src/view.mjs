import { foundationGeometry } from "./foundations.mjs";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { surfaceGeometry } from "./render-surface.mjs";
import { SURFACES } from "./course.mjs";
import { reliefField } from "./relief-field.mjs";
import { stoneTexture, finishStone, displayBase } from "./diorama-finish.mjs";
import { RADIUS } from "./physics.mjs";
import { MUNCHER_HALF_HEIGHT, birdGeometry } from "./enemies.mjs";
const vec = (p) => new THREE.Vector3(p.x, p.y, p.z),
  quat = (p) => new THREE.Quaternion(p.x, p.y, p.z, p.w);

// Grid and relief paint are evaluated on the actual mesh, without displacement.
function graphSurface(material, field, neutralSurface, moving) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      reliefMap: { value: field.texture },
      reliefBounds: { value: field.bounds },
      reliefHeight: { value: field.height },
      valleyColor: { value: new THREE.Color("#247fb5") },
      levelColor: { value: new THREE.Color("#adbfc9") },
      ridgeColor: { value: new THREE.Color("#edb349") },
    });
    shader.vertexShader =
      "varying vec3 vTerrainWorld; varying vec3 vTerrainLocal;\n" +
      shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nvTerrainWorld=(modelMatrix*vec4(position,1.0)).xyz; vTerrainLocal=position;",
    );
    shader.fragmentShader =
      `varying vec3 vTerrainWorld; varying vec3 vTerrainLocal;
      uniform sampler2D reliefMap;
      uniform vec4 reliefBounds;
      uniform vec2 reliefHeight;
      uniform vec3 valleyColor,levelColor,ridgeColor;\n` +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      vec4 terrain=texture2D(reliefMap,(vTerrainWorld.xz-reliefBounds.xy)/reliefBounds.zw);
      float surfaceHeight=reliefHeight.x+terrain.b*reliefHeight.y;
      float valid=terrain.a*(1.0-smoothstep(0.4,0.9,abs(vTerrainWorld.y-surfaceHeight)))*${moving ? "0.0" : "1.0"};
      float relief=(terrain.r-0.5)*2.0*valid;
      vec3 terrainColor=mix(levelColor,valleyColor,smoothstep(0.015,0.42,-relief));
      float ridge=max(smoothstep(0.015,0.46,relief),terrain.g*valid*0.94);
      terrainColor=mix(terrainColor,ridgeColor,ridge);
      diffuseColor.rgb=${neutralSurface ? "terrainColor" : "mix(diffuseColor.rgb,terrainColor,0.14)"};
      // Course-aligned graph lines are draped on the real 3D surface.
      vec3 gridPosition=${moving ? "vTerrainLocal" : "vTerrainWorld"};
      vec2 graph=vec2(gridPosition.x-gridPosition.z,gridPosition.x+gridPosition.z)*0.70710678/0.65;
      vec2 distanceToLine=abs(fract(graph+0.5)-0.5);
      vec2 coverage=1.0-smoothstep(vec2(0.014),vec2(0.014)+fwidth(graph)*0.85,distanceToLine);
      float grid=max(coverage.x,coverage.y);
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.93,0.97,1.0),grid*0.6);`,
    );
  };
  material.customProgramCacheKey = () =>
    `relief-graph-v1-${neutralSurface}-${moving}`;
  return material;
}
export class DioramaView {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#181e22");
    this.scene.fog = new THREE.Fog("#181e22", 100, 210);
    this.camera = new THREE.OrthographicCamera(-20, 20, 20, -20, 0.1, 250);
    this.camera.position.set(28, 36, 36);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.enableRotate = false;
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.maxPolarAngle = Math.PI / 2.2;
    this.controls.minZoom = 0.1;
    this.controls.maxZoom = 3;
    this.pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.env = this.pmrem.fromScene(room, 0.05);
    this.scene.environment = this.env.texture;
    this.scene.environmentIntensity = 0.25;
    room.dispose();
    this.scene.add(new THREE.HemisphereLight("#dceaff", "#4e4540", 0.65));
    this.key = new THREE.DirectionalLight("#fff0d8", 2.4);
    this.key.position.set(-15, 40, 15);
    this.key.castShadow = true;
    this.key.shadow.mapSize.set(2048, 2048);
    Object.assign(this.key.shadow.camera, {
      left: -36,
      right: 36,
      top: 38,
      bottom: -38,
      near: 1,
      far: 110,
    });
    this.key.shadow.normalBias = 0.012;
    this.scene.add(this.key, this.key.target);
    const fill = new THREE.DirectionalLight("#7ea6c4", 0.35);
    fill.position.set(20, 12, -15);
    this.scene.add(fill);
    this.ground = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial({ color: "#11191e", roughness: 0.95 }),
    );
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -14;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
    this.wallGrain = stoneTexture();
    this.display = new THREE.Group();
    this.scene.add(this.display);
    this.root = new THREE.Group();
    this.scene.add(this.root);
    this.marbleRoot = new THREE.Group();
    this.scene.add(this.marbleRoot);
    this.scenery = new THREE.Group();
    this.scene.add(this.scenery);
    this.effectRoot = new THREE.Group();
    this.scene.add(this.effectRoot);
    this.particles = [];
    this.effectTick = 0;
    this.target = new THREE.Vector3();
    this.zoom = 1;
    this.quality = "auto";
    this.frames = [];
    this.elapsed = 0;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }
  resize() {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height, false);
    this.updateFrustum();
  }
  // Buttons and OrbitControls share the orthographic camera's zoom, so wheel
  // and pinch gestures cannot leave a second zoom multiplier behind on restart.
  get zoom() {
    return this.camera.zoom;
  }
  set zoom(value) {
    this.camera.zoom = value;
  }
  updateFrustum() {
    const h = 19,
      w = (h * this.width) / this.height;
    Object.assign(this.camera, { left: -w, right: w, top: h, bottom: -h });
    this.camera.updateProjectionMatrix();
  }
  material(name, side = false, color = "#b85442", moving = false) {
    const s = SURFACES[name],
      m = new THREE.MeshStandardMaterial({
        color: side ? color : s.color,
        // Some authored shells have inward wall winding. Render both faces
        // so their closed walls and undersides stay opaque during inspection.
        side: side ? THREE.DoubleSide : THREE.FrontSide,
        roughness: s.roughness,
        metalness: name === "brass" ? 0.58 : name === "metal" ? 0.72 : 0.05,
      });
    if (["blue", "red", "orange", "yellow", "metal"].includes(name)) return m;
    if (!side)
      return graphSurface(
        m,
        this.relief,
        ["stone", "ceramic", "miniature"].includes(name),
        moving,
      );
    m.onBeforeCompile = (shader) => {
      const palette = this.sim?.course.sidePalette;
      if (side && palette)
        shader.uniforms.sideColors = {
          value: palette.map((c) => new THREE.Color(c)),
        };
      shader.vertexShader =
        "varying vec3 vTrackPosition;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvTrackPosition=position;",
      );
      shader.fragmentShader =
        "varying vec3 vTrackPosition;\n" +
        (side && palette
          ? `uniform vec3 sideColors[${palette.length}];\n`
          : "") +
        shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
      ${side ? (palette ? `int band=int(mod(floor((vTrackPosition.x-vTrackPosition.z)*0.9),${palette.length}.0)); diffuseColor.rgb=sideColors[band];` : `float stripe=step(0.55,fract((vTrackPosition.x+vTrackPosition.z)*0.8)); diffuseColor.rgb*=mix(0.55,1.12,stripe);`) : `vec2 tile=vTrackPosition.xz; vec2 edge=abs(fract(tile)-0.5); vec2 aa=fwidth(tile)*1.5; float grout=max(smoothstep(0.484-aa.x,0.497,edge.x),smoothstep(0.484-aa.y,0.497,edge.y)); float check=mod(floor(tile.x)+floor(tile.y),2.0); diffuseColor.rgb*=mix(0.94,1.0,check); diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*0.48,grout*0.52);`}`,
      );
      if (name === "miniature")
        shader.fragmentShader = shader.fragmentShader.replace(
          "vec2 tile=vTrackPosition.xz;",
          "vec2 tile=vTrackPosition.xz*3.0;",
        );
      if (side && this.sim?.course.sidePattern === "spots")
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <alphamap_fragment>",
          `vec3 spotCell=fract(vTrackPosition*0.12)-0.5; float spot=1.0-smoothstep(0.18,0.23,length(spotCell)); float colorPick=step(0.5,fract(sin(dot(floor(vTrackPosition*0.12),vec3(12.9898,78.233,31.416)))*43758.5453)); diffuseColor.rgb=mix(diffuseColor.rgb,mix(vec3(0.77,0.29,0.08),vec3(0.65,0.22,0.58),colorPick),spot);\n#include <alphamap_fragment>`,
        );
      if (side && this.sim?.course.id === "aerial")
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <alphamap_fragment>",
          "if(vTrackPosition.x+vTrackPosition.z>100.0) diffuseColor.rgb=mix(vec3(0.44,0.34,0.08),vec3(0.86,0.77,0.13),step(0.35,fract((vTrackPosition.x-vTrackPosition.z)*0.9)));\n#include <alphamap_fragment>",
        );
    };
    m.customProgramCacheKey = () =>
      `${side ? "side" : "top"}-${name}-${this.sim?.course.id}-${this.sim?.course.sidePattern ?? ""}`;
    return finishStone(m, this.wallGrain);
  }
  meshFor(g, material, color) {
    const mesh = new THREE.Mesh(surfaceGeometry(g), [
      this.material(material, false, color, !!g.part?.motion),
      this.material(material, true, color),
    ]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
  clear(group) {
    group.traverse((o) => {
      o.geometry?.dispose();
      if (o.material)
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
          m.map?.dispose();
          m.dispose();
        });
    });
    group.clear();
  }
  load(sim) {
    this.replayFollow = false;
    this.clear(this.root);
    this.clear(this.display);
    this.clear(this.marbleRoot);
    this.clear(this.scenery);
    this.clear(this.effectRoot);
    this.particles = [];
    this.effectTick = sim.tick;
    const effectGeometry = new THREE.BufferGeometry();
    effectGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(160 * 3), 3),
    );
    effectGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(160 * 3), 3),
    );
    effectGeometry.setDrawRange(0, 0);
    this.dust = new THREE.Points(
      effectGeometry,
      new THREE.PointsMaterial({
        vertexColors: true,
        size: 3,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      }),
    );
    this.effectRoot.add(this.dust);
    this.gears = [];
    this.sim = sim;
    this.relief?.texture.dispose();
    const field = reliefField(sim.compiled.statics),
      texture = new THREE.DataTexture(
        field.data,
        field.width,
        field.height,
        THREE.RGBAFormat,
      );
    texture.minFilter = texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    this.relief = {
      texture,
      bounds: new THREE.Vector4(
        field.minX - field.step / 2,
        field.minZ - field.step / 2,
        field.width * field.step,
        field.height * field.step,
      ),
      height: new THREE.Vector2(field.minY, field.yRange),
    };
    this.ground.visible = sim.course.sky !== "stars";
    this.scene.background.set(
      sim.course.sky === "stars" ? "#10151c" : "#181e22",
    );
    this.scene.fog.color.copy(this.scene.background);
    if (sim.course.sky === "stars") {
      const positions = [];
      for (let i = 0; i < 180; i++) {
        const l = (i % 2 ? 1 : -1) * (25 + ((i * 31) % 43)),
          d = -15 + ((i * 67) % 180),
          y = 2 + ((i * 17) % 24);
        positions.push((l + d) * Math.SQRT1_2, y, (d - l) * Math.SQRT1_2);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      this.scenery.add(
        new THREE.Points(
          g,
          new THREE.PointsMaterial({
            color: "#d2dbe7",
            size: 1.3,
            sizeAttenuation: false,
          }),
        ),
      );
    }
    this.moving = [];
    this.marbles = [];
    this.enemies = [];
    this.acid = [];
    this.ghost = null;
    for (const g of sim.compiled.statics)
      this.root.add(this.meshFor(g, g.material, sim.course.color));
    for (const g of sim.compiled.moving) {
      const mesh = this.meshFor(
        g,
        g.part.material ?? "stone",
        sim.course.color,
      );
      this.root.add(mesh);
      this.moving.push(mesh);
    }
    for (const prop of sim.course.props ?? [])
      if (prop.kind === "gear") {
        const group = new THREE.Group(),
          material = new THREE.MeshStandardMaterial({
            color: "#b58c50",
            metalness: 0.7,
            roughness: 0.35,
          });
        const rim = new THREE.Mesh(
          new THREE.TorusGeometry(
            prop.radius * 0.76,
            prop.radius * 0.15,
            10,
            48,
          ),
          material,
        );
        group.add(rim);
        for (let i = 0; i < 16; i++) {
          const tooth = new THREE.Mesh(
            new THREE.BoxGeometry(prop.radius * 0.2, prop.radius * 0.3, 0.45),
            material,
          );
          const a = (i * Math.PI) / 8;
          tooth.position.set(
            Math.cos(a) * prop.radius * 0.9,
            Math.sin(a) * prop.radius * 0.9,
            0,
          );
          tooth.rotation.z = a - Math.PI / 2;
          group.add(tooth);
        }
        group.position.set(prop.x, prop.y, prop.z);
        this.scenery.add(group);
        this.gears.push(group);
      }
    for (let i = 0; i < sim.players.length; i++) {
      const mesh = this.marble(i);
      this.marbleRoot.add(mesh);
      this.marbles.push(mesh);
    }
    for (const e of sim.enemies) {
      const steelie = e.def.kind === "steelie";
      let bird;
      if (e.def.kind === "bird") {
        const data = birdGeometry(e.def.radius);
        bird = new THREE.BufferGeometry();
        bird.setAttribute(
          "position",
          new THREE.BufferAttribute(data.vertices, 3),
        );
        bird.setIndex(new THREE.BufferAttribute(data.indices, 1));
        bird.computeVertexNormals();
      }
      const mesh = new THREE.Mesh(
        bird ??
          (e.def.kind !== "muncher"
            ? new THREE.SphereGeometry(e.def.radius, 32, 24)
            : new THREE.CapsuleGeometry(
                e.def.radius,
                2 * MUNCHER_HALF_HEIGHT,
                8,
                24,
              )),
        new THREE.MeshStandardMaterial({
          color: e.def.color ?? (steelie ? "#292e30" : "#6bd329"),
          metalness: steelie ? 0.85 : 0.05,
          roughness: steelie ? 0.22 : 0.38,
        }),
      );
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (e.def.kind === "muncher") {
        // Mouth is a surface marking. It does not change the capsule outline.
        mesh.material.onBeforeCompile = (shader) => {
          shader.vertexShader = "varying vec3 vEnemy;\n" + shader.vertexShader;
          shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            "#include <begin_vertex>\nvEnemy=position;",
          );
          shader.fragmentShader =
            "varying vec3 vEnemy;\n" + shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <color_fragment>",
            "#include <color_fragment>\nif(abs(vEnemy.y-0.15)<0.08 && vEnemy.z>0.25) diffuseColor.rgb*=0.12;",
          );
        };
      }
      this.marbleRoot.add(mesh);
      this.enemies.push(mesh);
    }
    const goal = sim.course.goal;
    const goalRoot = new THREE.Group();
    goalRoot.position.set(goal.x, goal.y, goal.z);
    goalRoot.rotation.y = -(goal.angle ?? 0);
    this.root.add(goalRoot);
    const flagmat = new THREE.MeshStandardMaterial({
      color: "#ede4cf",
      roughness: 0.6,
    });
    for (const x of [-(goal.width ?? 4.6) / 2, (goal.width ?? 4.6) / 2]) {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 2.4, 12),
        flagmat,
      );
      pole.position.set(x, 1.2, 0);
      pole.castShadow = true;
      goalRoot.add(pole);
      for (let row = 0; row < 3; row++)
        for (let col = 0; col < 4; col++) {
          const square = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 0.22, 0.035),
            new THREE.MeshStandardMaterial({
              color: (row + col) % 2 ? "#262b2a" : "#e6c273",
            }),
          );
          square.position.set(x + 0.11 + col * 0.22, 2.3 - row * 0.22, 0);
          goalRoot.add(square);
        }
    }
    for (const mark of [
      ...(sim.course.markings ?? []),
      ...sim.course.parts
        .filter((p) => p.kind === "spring")
        .map((p) => ({
          kind: "arrow",
          x: p.x,
          y: p.y,
          z: p.z,
          angle: p.angle ?? 0,
        })),
    ]) {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#232727";
      if (mark.kind === "arrow") {
        ctx.beginPath();
        ctx.moveTo(128, 225);
        ctx.lineTo(35, 130);
        ctx.lineTo(92, 130);
        ctx.lineTo(92, 32);
        ctx.lineTo(164, 32);
        ctx.lineTo(164, 130);
        ctx.lineTo(221, 130);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = "#b84939";
        ctx.fillRect(18, 18, 220, 220);
        ctx.strokeStyle = "#e7d0a0";
        ctx.lineWidth = 8;
        ctx.strokeRect(18, 18, 220, 220);
        ctx.fillStyle = "#f0e8ce";
        ctx.font = "bold 115px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(mark.value), 128, 140);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(
          mark.kind === "arrow" ? 2 : 3,
          mark.kind === "arrow" ? 2 : 3,
        ),
        new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          roughness: 0.8,
          polygonOffset: true,
          polygonOffsetFactor: -1,
        }),
      );
      plane.rotation.set(-Math.PI / 2, 0, -(mark.angle ?? 0));
      plane.position.set(mark.x, mark.y, mark.z);
      plane.receiveShadow = true;
      this.root.add(plane);
    }
    for (const z of sim.course.zones ?? []) {
      if (z.kind === "vacuum") continue;
      if (z.kind === "acid") {
        const pool = new THREE.Mesh(
          new THREE.CylinderGeometry(z.radius, z.radius, 0.08, 40),
          new THREE.MeshStandardMaterial({
            color: "#5ac61c",
            emissive: "#235807",
            emissiveIntensity: 0.3,
            roughness: 0.22,
          }),
        );
        pool.position.set(z.x, z.y + 0.04, z.z);
        this.root.add(pool);
        this.acid.push({
          mesh: pool,
          handle: sim.acid.find((a) => a.zone === z).handle,
        });
        continue;
      }
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(z.radius, 0.035, 8, 64),
        new THREE.MeshBasicMaterial({
          color: z.kind === "magnet" ? "#80cfd3" : "#ff6652",
          transparent: true,
          opacity: 0.8,
        }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(z.x, z.y + 0.02, z.z);
      this.root.add(ring);
    }
    const base = displayBase(sim.course, this.wallGrain);
    this.display.add(base.group);
    for (const part of sim.compiled.parts) {
      const foundation = foundationGeometry(part, base.top);
      if (foundation)
        this.display.add(
          this.meshFor(foundation, part.material ?? "stone", sim.course.color),
        );
    }
    this.ground.position.y = base.ground;
    this.target.copy(vec(sim.course.starts[0]));
    this.overview = true;
    this.frameOverview();
  }
  marble(i, ghost = false) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext("2d");
    ctx.fillStyle = i === 0 ? "#cf563f" : "#448fbb";
    ctx.fillRect(0, 0, 512, 256);
    for (let x = -80; x < 600; x += 85) {
      ctx.beginPath();
      for (let y = 0; y <= 256; y += 2) {
        const xx = x + 18 * Math.sin((y / 256) * Math.PI * 2);
        if (y === 0) ctx.moveTo(xx, y);
        else ctx.lineTo(xx, y);
      }
      for (let y = 256; y >= 0; y -= 2)
        ctx.lineTo(x + 34 + 18 * Math.sin((y / 256) * Math.PI * 2), y);
      ctx.closePath();
      ctx.fillStyle = "#f4de97";
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 64, 40),
      new THREE.MeshPhysicalMaterial({
        map: tex,
        roughness: 0.16,
        metalness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        transparent: ghost,
        opacity: ghost ? 0.28 : 1,
        depthWrite: !ghost,
      }),
    );
    mesh.castShadow = !ghost;
    return mesh;
  }
  frameOverview() {
    // Finish any damped gesture before setting the overview, including a reset
    // pressed immediately after a drag.
    const damping = this.controls.enableDamping;
    this.controls.enableDamping = false;
    this.controls.update();
    this.controls.enableDamping = damping;
    const b = new THREE.Box3()
        .setFromObject(this.root)
        .expandByObject(this.display),
      center = b.getCenter(new THREE.Vector3());
    this.target.copy(center);
    this.target.y += 2;
    this.camera.position.copy(center).add(new THREE.Vector3(35, 46, 46));
    this.controls.target.copy(this.target);
    this.camera.lookAt(this.target);
    this.zoom = Math.min(
      1.0,
      32 / Math.max(b.max.z - b.min.z, b.max.x - b.min.x),
    );
    this.updateFrustum();
  }
  follow() {
    this.overview = false;
    this.zoom = 1.4;
    this.updateFrustum();
  }
  focusPlayers() {
    const active = this.sim.players.filter((p) => p.status !== "timeout"),
      players = active.length ? active : this.sim.players;
    const center = players
      .reduce((v, p) => v.add(vec(p.current.position)), new THREE.Vector3())
      .divideScalar(players.length);
    const offset = this.camera.position.clone().sub(this.controls.target);
    this.target.copy(center);
    this.controls.target.copy(center);
    this.camera.position.copy(center).add(offset);
    this.camera.lookAt(center);
  }
  setOrbit(enabled) {
    this.controls.enableRotate = enabled;
    this.controls.enableZoom = enabled;
    this.orbit = enabled;
    this.canvas.classList.toggle("orbit-enabled", enabled);
    if (enabled && document.pointerLockElement === this.canvas)
      document.exitPointerLock();
  }
  setQuality(q) {
    this.quality = q;
    this.renderer.shadowMap.enabled = q !== "low";
    this.renderer.setPixelRatio(
      q === "low" ? 1 : Math.min(devicePixelRatio, q === "high" ? 2 : 1.7),
    );
    this.resize();
  }
  effect(event) {
    const p =
      event.type === "fall"
        ? this.sim.players[event.player]
        : this.sim.players.find(
            (p) =>
              p.collider === event.collider1 || p.collider === event.collider2,
          );
    if (!p) return;
    const shatter = event.type === "fall";
    if (!shatter && event.force < 70) return;
    const position = p.current.position,
      normal = p.groundNormal ?? { x: 0, y: 1, z: 0 };
    const count = shatter ? 20 : Math.min(9, Math.floor(event.force / 45));
    for (let i = 0; i < count; i++) {
      const a = (this.sim.tick + i * 17) * 2.399963;
      this.particles.push({
        x: position.x - (shatter ? 0 : normal.x * RADIUS),
        y: position.y - (shatter ? 0 : normal.y * RADIUS),
        z: position.z - (shatter ? 0 : normal.z * RADIUS),
        vx: Math.cos(a) * (shatter ? 2 : 1),
        vy: shatter ? 2 + (i % 4) * 0.4 : 0.7 + (i % 3) * 0.2,
        vz: Math.sin(a) * (shatter ? 2 : 1),
        life: shatter ? 1.3 : 0.55,
        color: new THREE.Color(
          shatter
            ? i % 2
              ? "#e6cd85"
              : event.player
                ? "#448fbb"
                : "#cf563f"
            : "#d6cbb6",
        ),
      });
    }
    this.particles = this.particles.slice(-160);
  }
  render(alpha, dt, ghostPose) {
    if (!this.sim) return;
    const effectDt = Math.max(0, (this.sim.tick - this.effectTick) / 120);
    this.effectTick = this.sim.tick;
    this.particles = this.particles.filter((p) => {
      p.life -= effectDt;
      p.vy -= 9.81 * effectDt;
      p.x += p.vx * effectDt;
      p.y += p.vy * effectDt;
      p.z += p.vz * effectDt;
      return p.life > 0;
    });
    const pg = this.dust.geometry,
      pa = pg.attributes.position,
      ca = pg.attributes.color;
    this.particles.forEach((p, i) => {
      pa.setXYZ(i, p.x, p.y, p.z);
      ca.setXYZ(i, p.color.r, p.color.g, p.color.b);
    });
    pa.needsUpdate = true;
    ca.needsUpdate = true;
    pg.setDrawRange(0, this.particles.length);
    for (let i = 0; i < this.gears.length; i++)
      this.gears[i].rotation.z = (this.sim.tick / 120) * (i % 2 ? -0.2 : 0.2);
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.sim.enemies[i],
        mesh = this.enemies[i];
      mesh.position.lerpVectors(
        vec(e.previous.position),
        vec(e.current.position),
        alpha,
      );
      mesh.quaternion.slerpQuaternions(
        quat(e.previous.rotation),
        quat(e.current.rotation),
        alpha,
      );
      mesh.visible = !e.collected && !e.hidden;
    }
    for (const a of this.acid)
      a.mesh.position.copy(
        vec(this.sim.world.getCollider(a.handle).translation()),
      );
    for (let i = 0; i < this.marbles.length; i++) {
      const p = this.sim.players[i],
        m = this.marbles[i];
      m.position.lerpVectors(
        vec(p.previous.position),
        vec(p.current.position),
        alpha,
      );
      m.quaternion.slerpQuaternions(
        quat(p.previous.rotation),
        quat(p.current.rotation),
        alpha,
      );
      m.visible = p.status === "racing";
    }
    for (let i = 0; i < this.moving.length; i++) {
      this.moving[i].visible = this.sim.world
        .getRigidBody(this.sim.movers[i].handle)
        .isEnabled();
      const m = this.sim.movers[i];
      if (m.current.vertices) {
        const data = this.sim.compiled.moving[i],
          geometry = this.moving[i].geometry,
          position = geometry.attributes.position;
        for (let j = 0; j < data.indices.length; j++)
          for (let k = 0; k < 3; k++) {
            const index = data.indices[j] * 3 + k;
            position.array[j * 3 + k] =
              m.previous.vertices[index] +
              (m.current.vertices[index] - m.previous.vertices[index]) * alpha;
          }
        position.needsUpdate = true;
        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();
      }
      this.moving[i].position.lerpVectors(
        vec(m.previous.position),
        vec(m.current.position),
        alpha,
      );
      this.moving[i].quaternion.slerpQuaternions(
        quat(m.previous.rotation),
        quat(m.current.rotation),
        alpha,
      );
    }
    if (ghostPose) {
      if (!this.ghost) {
        this.ghost = this.marble(0, true);
        this.marbleRoot.add(this.ghost);
      }
      this.ghost.position.copy(vec(ghostPose.position));
      this.ghost.quaternion.copy(quat(ghostPose.rotation));
      this.ghost.visible = true;
    } else if (this.ghost) this.ghost.visible = false;
    if (!this.overview && (!this.orbit || this.replayFollow)) {
      const ps = this.marbles.filter(
          (m, i) =>
            !["timeout", "finished"].includes(this.sim.players[i].status),
        ),
        center = ps.length
          ? ps
              .reduce((a, m) => a.add(m.position), new THREE.Vector3())
              .divideScalar(ps.length)
          : this.target.clone();
      center.y = Math.max(center.y, 0);
      const v = this.sim.body(this.sim.players[0]).linvel();
      if (ps.length) center.add(new THREE.Vector3(v.x * 0.22, 0, v.z * 0.22));
      const offset = this.orbit
        ? this.camera.position.clone().sub(this.controls.target)
        : new THREE.Vector3(28, 36, 28);
      this.target.lerp(center, 1 - Math.exp(-dt * 4));
      this.camera.position.copy(this.target).add(offset);
      this.controls.target.copy(this.target);
      this.camera.lookAt(this.target);
      if (ps.length > 1) {
        const span = ps[0].position.distanceTo(ps[1].position);
        this.zoom = THREE.MathUtils.lerp(
          this.zoom,
          Math.min(1.4, 25 / (span + 10)),
          1 - Math.exp(-dt * 2),
        );
        this.updateFrustum();
      }
    }
    if (this.orbit) this.controls.update();
    this.key.target.position.copy(this.target);
    this.key.position.copy(this.target).add(new THREE.Vector3(-20, 40, 20));
    this.renderer.render(this.scene, this.camera);
    this.elapsed += dt;
    this.frames.push(dt);
    if (this.frames.length > 120) this.frames.shift();
    if (
      this.quality === "auto" &&
      this.elapsed > 5 &&
      this.frames.length === 120 &&
      this.frames.reduce((a, b) => a + b, 0) / 120 > 0.024
    ) {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
      this.elapsed = 0;
    }
  }
  pick(clientX, clientY, y = 0) {
    const r = this.canvas.getBoundingClientRect(),
      ray = new THREE.Raycaster();
    ray.setFromCamera(
      new THREE.Vector2(
        ((clientX - r.left) / r.width) * 2 - 1,
        (-(clientY - r.top) / r.height) * 2 + 1,
      ),
      this.camera,
    );
    return ray.ray.intersectPlane(
      new THREE.Plane(new THREE.Vector3(0, 1, 0), -y),
      new THREE.Vector3(),
    );
  }
}
