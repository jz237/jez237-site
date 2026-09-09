'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Box,
  Layers3,
  ScanLine,
  ChevronRight,
  MoveUpRight,
  Info,
  Gauge,
  Eye,
  ArrowUpRight,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ORDER, cylinderState, STROKES, COLORS, mod } from '@/lib/mechanics';
import { LESSONS, TOUR, lessonAngle } from '@/lib/learning';
import type { createEngineScene, Layers, Part, View } from './engine-scene';
import type { FlowMode } from './engine-overlays';
import { MotionChart } from './motion-chart';
const initialLayers: Layers = {
  block: true,
  heads: true,
  pistons: true,
  crankshaft: true,
  valvetrain: true,
};
const initialPart: Part = {
  name: 'Cross-plane V8',
  description:
    'Select a component in the model to explore its role, or select a cylinder below to follow its cycle.',
};
export default function EngineLab() {
  const host = useRef<HTMLDivElement>(null),
    scene = useRef<ReturnType<typeof createEngineScene> | null>(null);
  const [playing, setPlaying] = useState(true),
    [angle, setAngle] = useState(35),
    [speed, setSpeed] = useState(1),
    [view, setView] = useState<View>('cutaway');
  const [layers, setLayers] = useState<Layers>(initialLayers),
    [colors, setColors] = useState(false),
    [transparent, setTransparent] = useState(false);
  const [selected, setSelected] = useState(1),
    [part, setPart] = useState<Part>(initialPart),
    [ready, setReady] = useState(false),
    [error, setError] = useState(''),
    [info, setInfo] = useState(false),
    [camera, setCamera] = useState('perspective');
  const [section, setSection] = useState(-0.12),
    [teaching, setTeaching] = useState(false),
    [isolate, setIsolate] = useState(false),
    [tour, setTour] = useState(-1);
  const [depthOfField, setDepthOfField] = useState(false);
  const [lighting, setLighting] = useState<'studio' | 'technical' | 'dramatic'>(
    'studio',
  );
  const [connected, setConnected] = useState(false),
    [flows, setFlows] = useState<FlowMode>('off'),
    [presentation, setPresentation] = useState(false),
    [charts, setCharts] = useState(false),
    [walkthrough, setWalkthrough] = useState(false),
    [quality, setQuality] = useState<'performance' | 'balanced' | 'ultra'>(
      'balanced',
    ),
    [exportStatus, setExportStatus] = useState('');
  const state = useRef({
    playing,
    angle,
    speed,
    view,
    layers,
    colors,
    transparent,
    section,
    teaching,
    isolate,
    selectedCylinder: selected,
    depthOfField,
    connected,
    flows,
    presentation,
    quality,
    lighting,
  });
  useEffect(() => {
    Object.assign(state.current, {
      playing,
      speed,
      view,
      layers,
      colors,
      transparent,
      section,
      teaching,
      isolate,
      selectedCylinder: selected,
      depthOfField,
      connected,
      flows,
      presentation,
      quality,
      lighting,
    });
  }, [
    playing,
    speed,
    view,
    layers,
    colors,
    transparent,
    section,
    teaching,
    isolate,
    selected,
    depthOfField,
    connected,
    flows,
    presentation,
    quality,
    lighting,
  ]);
  useEffect(() => {
    let cancelled = false,
      frame = 0,
      cleanup: (() => void) | undefined;
    import('./engine-scene')
      .then(({ createEngineScene }) => {
        if (cancelled || !host.current) return;
        const engine = createEngineScene(
          host.current,
          (p) => {
            setPart(p);
            if (p.cylinder) setSelected(p.cylinder);
          },
          (x) => {
            state.current.section = x;
            setSection(x);
          },
        );
        scene.current = engine;
        cleanup = () => engine.dispose();
        setReady(true);
        let last = performance.now(),
          lastUI = 0;
        const animate = (time: number) => {
          const dt = Math.min((time - last) / 1000, 0.05);
          last = time;
          const s = state.current;
          if (s.playing) s.angle = mod(s.angle + dt * 60 * s.speed);
          engine.render(s, dt);
          if (time - lastUI > 80) {
            setAngle(s.angle);
            lastUI = time;
          }
          frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
      })
      .catch((e) => {
        console.error(e);
        setError(
          'The 3D exhibit could not start. Check that hardware acceleration and WebGL 2 are available, then reload.',
        );
      });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      cleanup?.();
      scene.current = null;
    };
  }, []);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (
        e.code === 'Space' &&
        (e.target === document.body || host.current?.contains(e.target as Node))
      ) {
        e.preventDefault();
        setPlaying((p) => !p);
      }
      if (e.key === 'Escape') {
        setInfo(false);
        setPresentation(false);
      }
    }
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  const scrub = (value: number | readonly number[]) => {
    const a = Array.isArray(value) ? value[0] : (value as number);
    state.current.angle = a;
    setAngle(a);
    setPlaying(false);
  };
  const current = cylinderState(selected, angle);
  const chooseCylinder = (id: number) => {
    setIsolate(false);
    setConnected(walkthrough);
    scene.current?.select(`Piston ${id}`, teaching);
    setSelected(id);
    setPart({
      name: `Cylinder ${id}`,
      description: `${id % 2 ? 'Left' : 'Right'} bank · ${Math.floor((id - 1) / 2) + 1} from the front. Fires at ${ORDER.indexOf(id) * 90}° in the shared 720° cycle.`,
      cylinder: id,
      material: 'Aluminum piston · steel rod and valves',
    });
  };
  const preset = (name: string) => {
    setCamera(name);
    scene.current?.preset(name);
  };
  const followCycle = (enabled: boolean) => {
    setTeaching(enabled);
    setIsolate(false);
    setWalkthrough(false);
    setConnected(false);
    if (enabled) {
      setView('cutaway');
      setTransparent(true);
      setLayers(initialLayers);
      scene.current?.select(`Piston ${selected}`);
    }
  };
  const tourStep = (index: number) => {
    setTour(index);
    setIsolate(false);
    setWalkthrough(false);
    setConnected(false);
    if (index < 0) return;
    const step = TOUR[index];
    setLayers(initialLayers);
    setView(step.view);
    setTransparent(index > 0 && index < 6);
    setTeaching(index === 1 || index === 5);
    setSelected(1);
    setPlaying(true);
    setSpeed(0.5);
    scene.current?.select(step.part, index > 0 && index < 6);
    if (index === 0 || index === 6) preset('perspective');
  };
  const startWalkthrough = () => {
    setWalkthrough(true);
    setTour(-1);
    setTeaching(true);
    setConnected(true);
    setIsolate(false);
    setView('cutaway');
    setTransparent(true);
    setLayers(initialLayers);
    setCharts(true);
    setFlows('off');
    scrub(lessonAngle(selected, 2));
    scene.current?.select(`Piston ${selected}`);
  };
  const stepStroke = (direction: number) => {
    const sequence = [2, 3, 0, 1],
      index = sequence.indexOf(current.stroke);
    scrub(lessonAngle(selected, sequence[(index + direction + 4) % 4]));
  };
  const changeFlow = (value: FlowMode) => {
    setFlows(value);
    if (value !== 'off') {
      setView('cutaway');
      setTransparent(true);
      setIsolate(false);
      setConnected(false);
      setTeaching(false);
      setWalkthrough(false);
      preset('perspective');
    }
  };
  const exportImage = async () => {
    if (!scene.current || exportStatus === 'Rendering image…') return;
    setExportStatus('Rendering image…');
    try {
      const blob = await scene.current.capture(),
        url = URL.createObjectURL(blob),
        a = document.createElement('a');
      a.href = url;
      a.download = `v8-${view}-${Math.round(state.current.angle)}deg.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setExportStatus('PNG downloaded · 3840 px longest edge');
    } catch {
      setExportStatus('Export failed. Try Balanced quality and export again.');
    }
  };
  return (
    <main className={`lab dark${presentation ? ' presentation' : ''}`}>
      {presentation && (
        <div className="presentation-toolbar">
          <span>V8 · ENGINE LABORATORY</span>
          <button
            onClick={exportImage}
            disabled={exportStatus === 'Rendering image…'}
          >
            Save 4K image
          </button>
          <button onClick={() => setPresentation(false)}>
            Exit presentation · Esc
          </button>
          <output>{exportStatus}</output>
        </div>
      )}
      <header className="topbar">
        <a href="../" className="brand" aria-label="Back to website demos">
          <span className="brand-mark">
            V<span>8</span>
          </span>
          <span>ENGINE LABORATORY</span>
        </a>
        <span className="exhibit-number">INTERACTIVE EXHIBIT / 001</span><a className="demo-return" href="../">← All demos</a>
        <button className="about-button" onClick={() => setInfo(true)}>
          <Info size={16} /> Engine notes
        </button>
      </header>
      <div className="workspace">
        <section className="stage" aria-label="Engine exhibit">
          <div className="stage-heading">
            <div className="eyebrow">
              <span className="status-dot" /> THE ANATOMY OF POWER
            </div>
            <h1>
              Cross-plane <span>V8.</span>
            </h1>
            <p>Eight cylinders. One synchronized machine.</p>
            <div className="specs">
              <span>
                90° <small>BANK ANGLE</small>
              </span>
              <span>
                4-STROKE <small>OTTO CYCLE</small>
              </span>
              <span>
                16 <small>VALVES</small>
              </span>
            </div>
          </div>
          <div className="scene" ref={host} />
          <div className="picked-part" aria-live="polite" aria-atomic="true">
            <span className="eyebrow">
              {part === initialPart
                ? 'EXPLORE THE MECHANISM'
                : 'SELECTED COMPONENT'}
            </span>
            <strong>
              {part === initialPart ? 'Click any engine part' : part.name}
            </strong>
            <p>
              {part === initialPart
                ? 'Hover to see its name. Click to learn what it does. Use cutaway or exploded view to reach internal parts.'
                : part.description}
            </p>
            {part !== initialPart && (
              <div className="inspection-actions on-model-actions">
                <button onClick={() => scene.current?.focus()}>
                  Zoom here
                </button>
                <button
                  aria-pressed={isolate}
                  onClick={() => {
                    setIsolate(!isolate);
                    setConnected(false);
                  }}
                >
                  {isolate ? 'Show surroundings' : 'Isolate part'}
                </button>
              </div>
            )}
          </div>
          {!ready && !error && (
            <div className="scene-message">Assembling the engine…</div>
          )}
          {error && (
            <div className="scene-message error" role="alert">
              {error}
              <button onClick={() => location.reload()}>Reload exhibit</button>
            </div>
          )}
          <div className="view-switch">
            <Tabs
              value={view}
              onValueChange={(v) => {
                setView(v as View);
                setIsolate(false);
                setConnected(false);
                setWalkthrough(false);
                if (v !== 'cutaway') setTeaching(false);
              }}
            >
              <TabsList aria-label="Engine view">
                <TabsTrigger value="assembled">
                  <Box />
                  Assembled
                </TabsTrigger>
                <TabsTrigger value="cutaway">
                  <ScanLine />
                  Cutaway
                </TabsTrigger>
                <TabsTrigger value="exploded">
                  <Layers3 />
                  Exploded
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="camera-controls" aria-label="Camera presets">
            {[
              ['perspective', '3D'],
              ['front', 'Front'],
              ['side', 'Side'],
              ['top', 'Top'],
            ].map(([v, label]) => (
              <button
                key={v}
                className={camera === v ? 'active' : ''}
                onClick={() => preset(v)}
              >
                {label}
              </button>
            ))}
            <button
              title="Reset camera"
              aria-label="Reset camera"
              onClick={() => preset('perspective')}
            >
              <RotateCcw size={15} />
            </button>
          </div>
          {view === 'cutaway' && !transparent && (
            <div className="section-control">
              <div className="range-label">
                <span id="section-label">Section plane</span>
                <button onClick={() => setSection(-0.12)}>Center</button>
              </div>
              <Slider
                aria-labelledby="section-label"
                value={[section]}
                min={-3.8}
                max={3.8}
                step={0.05}
                onValueChange={(v) =>
                  setSection(Array.isArray(v) ? v[0] : (v as number))
                }
              />
              <div className="range-ends">
                <span>Remove more</span>
                <span>Reveal casting</span>
              </div>
              <div className="section-presets" aria-label="Section presets">
                {[
                  ['Crankshaft', -0.28],
                  ['Pistons', 0.05],
                  ['Valves', 0.24],
                ].map(([name, x]) => (
                  <button
                    key={name}
                    onClick={() => {
                      setSection(Number(x));
                      setTransparent(false);
                      setTeaching(false);
                      setWalkthrough(false);
                      setIsolate(false);
                      setConnected(false);
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <p className="subtle">
                Drag the amber handle on the model, or use this slider.
              </p>
            </div>
          )}
          <div className="stage-footer">
            <span>
              <MoveUpRight size={14} /> Drag to orbit <i /> Scroll to zoom <i />{' '}
              Right-drag to pan
            </span>
            <span className="mode-label">
              {view === 'cutaway'
                ? 'SECTION / A–A'
                : view === 'exploded'
                  ? 'ASSEMBLY / SEPARATED'
                  : 'ASSEMBLY / COMPLETE'}
            </span>
          </div>
        </section>
        <aside className="inspector">
          <div className="panel-heading">
            <span>EXHIBIT CONTROLS</span>
            <Gauge size={17} />
          </div>
          <section className="control-section learning-controls">
            <div className="section-label">
              <h2>Learn the engine</h2>
              <span className="live-tag">EXPLORE</span>
            </div>
            <button
              className="learning-button"
              disabled={!ready}
              onClick={() => tourStep(tour < 0 ? 0 : -1)}
            >
              {tour < 0 ? 'Start guided tour' : 'End guided tour'}
            </button>
            <button
              className="learning-button"
              disabled={!ready}
              onClick={() =>
                walkthrough
                  ? (setWalkthrough(false),
                    setConnected(false),
                    setTeaching(false))
                  : startWalkthrough()
              }
            >
              {walkthrough
                ? 'End cylinder walkthrough'
                : 'One-cylinder walkthrough'}
            </button>
            {walkthrough && (
              <div className="walkthrough-navigation">
                <span>
                  STEP {[2, 3, 0, 1].indexOf(current.stroke) + 1} / 4 · CYLINDER{' '}
                  {selected}
                </span>
                <div className="inspection-actions">
                  <button onClick={() => stepStroke(-1)}>
                    Previous stroke
                  </button>
                  <button onClick={() => stepStroke(1)}>Next stroke</button>
                </div>
                <p className="subtle">
                  The selected cylinder and its drive components stay visible.
                  Arrows show gas direction; traces below follow the same crank
                  angle.
                </p>
              </div>
            )}
            {tour >= 0 && (
              <div className="tour-card" aria-live="polite">
                <span className="eyebrow">
                  STOP {tour + 1} / {TOUR.length}
                </span>
                <h3>{TOUR[tour].title}</h3>
                <p>{TOUR[tour].text}</p>
                <div className="inspection-actions">
                  <button
                    disabled={tour === 0}
                    onClick={() => tourStep(tour - 1)}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      tourStep(tour === TOUR.length - 1 ? -1 : tour + 1)
                    }
                  >
                    {tour === TOUR.length - 1 ? 'Finish tour' : 'Next stop'}
                  </button>
                </div>
              </div>
            )}
            <label className="learning-toggle" htmlFor="follow-cycle">
              <span>Follow cylinder {selected}</span>
              <Switch
                id="follow-cycle"
                checked={teaching}
                onCheckedChange={followCycle}
              />
            </label>
            {teaching && (
              <div className="cycle-lesson">
                <div className="lesson-strokes">
                  {[2, 3, 0, 1].map((i) => (
                    <button
                      key={i}
                      aria-pressed={current.stroke === i}
                      style={
                        { '--stroke-color': COLORS[i] } as React.CSSProperties
                      }
                      onClick={() => scrub(lessonAngle(selected, i))}
                    >
                      {LESSONS[i].title}
                    </button>
                  ))}
                </div>
                <h3 style={{ color: COLORS[current.stroke] }}>
                  {LESSONS[current.stroke].title}
                </h3>
                <p>{LESSONS[current.stroke].text}</p>
                <small>{LESSONS[current.stroke].cue}</small>
                <p className="subtle">
                  Colored dots show charge movement schematically. Use Play to
                  follow continuously, or choose a stroke to pause.
                </p>
              </div>
            )}
          </section>
          <section className="control-section">
            <div className="section-label">
              <h2>Motion</h2>
              <span className={playing ? 'live-tag' : 'paused-tag'}>
                {playing ? 'RUNNING' : 'PAUSED'}
              </span>
            </div>
            <div className="motion-main">
              <button
                className="play-button"
                aria-label={playing ? 'Pause engine' : 'Play engine'}
                onClick={() => setPlaying(!playing)}
              >
                {playing ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" />
                )}
              </button>
              <div>
                <strong>
                  600 <span>RPM</span>
                </strong>
                <p>Reference engine speed</p>
              </div>
            </div>
            <div className="range-label">
              <span id="speed-label">Playback speed</span>
              <output>{speed.toFixed(2)}×</output>
            </div>
            <Slider
              aria-labelledby="speed-label"
              value={[speed]}
              min={0.25}
              max={3}
              step={0.25}
              onValueChange={(v) =>
                setSpeed(Array.isArray(v) ? v[0] : (v as number))
              }
            />
            <div className="range-ends">
              <span>0.25×</span>
              <span>3×</span>
            </div>
            <p className="subtle">
              Shown at {((speed / 60) * 100).toFixed(1)}% of real time ·{' '}
              {(10 * speed).toFixed(1)} displayed RPM
            </p>
          </section>
          <section className="control-section">
            <div className="section-label">
              <h2>Visible components</h2>
              <Eye size={16} />
            </div>
            <div className="layer-list">
              {(Object.keys(layers) as (keyof Layers)[]).map((k) => (
                <label key={k} htmlFor={`layer-${k}`}>
                  <span>
                    {
                      {
                        block: 'Cylinder block',
                        heads: 'Cylinder heads',
                        pistons: 'Pistons & rods',
                        crankshaft: 'Crankshaft',
                        valvetrain: 'Valvetrain & timing',
                      }[k]
                    }
                  </span>
                  <Switch
                    id={`layer-${k}`}
                    aria-label={`Show ${k}`}
                    checked={layers[k]}
                    onCheckedChange={(checked) =>
                      setLayers((prev) => ({ ...prev, [k]: checked }))
                    }
                  />
                </label>
              ))}
            </div>
            <div className="extra-toggles">
              <label htmlFor="depth-of-field">
                <span>Portrait focus</span>
                <Switch
                  id="depth-of-field"
                  checked={depthOfField}
                  onCheckedChange={(enabled) => {
                    setDepthOfField(enabled);
                    if (enabled) {
                      setPlaying(false);
                      setView('assembled');
                      setTransparent(false);
                      setIsolate(false);
                      setConnected(false);
                      setWalkthrough(false);
                      setTeaching(false);
                    }
                  }}
                />
              </label>
              <p className="subtle">
                Switches to a paused, assembled view with soft background focus.
                Play restores sharp motion.
              </p>
              <label htmlFor="transparent-toggle">
                <span>Transparent castings</span>
                <Switch
                  id="transparent-toggle"
                  aria-label="Transparent castings"
                  checked={transparent}
                  onCheckedChange={setTransparent}
                />
              </label>
              <label htmlFor="colors-toggle">
                <span>Stroke colors</span>
                <Switch
                  id="colors-toggle"
                  aria-label="Stroke colors"
                  checked={colors}
                  onCheckedChange={setColors}
                />
              </label>
            </div>
          </section>
          <section className="control-section part-section">
            <div className="section-label">
              <h2>Component inspector</h2>
              <ArrowUpRight size={16} />
            </div>
            <h3>{part.name}</h3>
            <p>{part.description}</p>
            {part.material && (
              <p className="material-readout">
                <span>Material / finish</span>
                {part.material}
              </p>
            )}
            <div className="inspection-actions">
              <button
                disabled={part === initialPart || !ready}
                onClick={() => scene.current?.focus()}
              >
                Zoom here
              </button>
              <button
                disabled={part === initialPart || !ready}
                aria-pressed={isolate}
                onClick={() => {
                  setIsolate(!isolate);
                  setConnected(false);
                }}
              >
                {isolate ? 'Show surrounding parts' : 'Isolate part'}
              </button>
            </div>
            <button
              className="learning-button"
              disabled={part === initialPart || !ready}
              aria-pressed={connected}
              onClick={() => {
                setConnected(!connected);
                setIsolate(false);
              }}
            >
              {connected ? 'Show all parts' : 'Show connected parts'}
            </button>
            {connected && (
              <p className="subtle">
                {part.cylinder
                  ? `Cylinder ${part.cylinder} linkage and shared crank / cam drive. Surroundings are ghosted.`
                  : 'Selected component and its neighboring assembly. Surroundings are ghosted.'}
              </p>
            )}
          </section>
          <section className="control-section">
            <h2>Explore systems</h2>
            <label className="learning-toggle" htmlFor="motion-traces">
              <span>Motion charts</span>
              <Switch
                id="motion-traces"
                checked={charts}
                onCheckedChange={setCharts}
              />
            </label>
            <Tabs
              value={flows}
              onValueChange={(v) => changeFlow(v as FlowMode)}
            >
              <TabsList aria-label="Flow overlay">
                <TabsTrigger value="off">Off</TabsTrigger>
                <TabsTrigger value="oil">Oil</TabsTrigger>
                <TabsTrigger value="coolant">Coolant</TabsTrigger>
              </TabsList>
            </Tabs>
            {flows !== 'off' && (
              <div className={`flow-description ${flows}`}>
                <strong>
                  {flows === 'oil' ? 'Lubrication route' : 'Cooling route'}
                </strong>
                <p>
                  {flows === 'oil'
                    ? 'Sump → pump → main gallery / bearings → valvetrain → gravity return.'
                    : 'Pump → block jackets → cylinder heads → outlet → external cooling loop.'}
                </p>
                <small>
                  Schematic paths, not modeled drilled passages. Arrows follow
                  crank angle; Play animates and Pause freezes.{' '}
                  {view === 'exploded'
                    ? 'Hidden in exploded view.'
                    : 'The external cooler / radiator is not modeled.'}
                </small>
              </div>
            )}
          </section>
          <section className="control-section">
            <h2>Display & capture</h2>
            <Tabs
              value={lighting}
              onValueChange={(v) => setLighting(v as typeof lighting)}
            >
              <TabsList aria-label="Lighting preset">
                <TabsTrigger value="studio">Studio</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="dramatic">Dramatic</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="subtle">
              {lighting === 'technical'
                ? 'Even illumination for studying connections.'
                : lighting === 'dramatic'
                  ? 'Deep shadows with a stronger rim light.'
                  : 'Soft studio reflections with controlled highlights.'}
            </p>
            <Tabs
              value={quality}
              onValueChange={(v) => setQuality(v as typeof quality)}
            >
              <TabsList aria-label="Graphics quality">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="balanced">Balanced</TabsTrigger>
                <TabsTrigger value="ultra">Ultra</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="subtle">
              {quality === 'performance'
                ? 'Standard resolution, lighter shadows, no bloom or portrait blur.'
                : quality === 'ultra'
                  ? 'Sharper resolution and 4096 px shadows. Best for a powerful GPU or still inspection.'
                  : 'Adaptive resolution with studio effects and 2048 px shadows.'}
            </p>
            <button
              className="learning-button"
              disabled={!ready}
              onClick={() => {
                setPresentation(true);
                setView('assembled');
                setTransparent(false);
                setTeaching(false);
                setIsolate(false);
                setConnected(false);
                setWalkthrough(false);
                setFlows('off');
                preset('perspective');
              }}
            >
              Presentation mode
            </button>
            <button
              className="learning-button"
              disabled={!ready || exportStatus === 'Rendering image…'}
              onClick={exportImage}
            >
              Save 4K engine image
            </button>
            <output className="subtle">
              {exportStatus ||
                'Exports the engine view as a PNG with a 3840 px longest edge, without controls.'}
            </output>
          </section>
        </aside>
      </div>
      <section className="cycle-console" aria-label="Four-stroke cycle">
        <div className="timeline">
          <div className="timeline-title">
            <div>
              <span id="crank-angle-label" className="eyebrow">
                CRANKSHAFT POSITION
              </span>
              <div className="angle-value">
                {Math.floor(angle).toString().padStart(3, '0')}
                <span>°</span>
                <small>/ 720°</small>
              </div>
            </div>
            <button
              className="zero-button"
              onClick={() => scrub(0)}
              title="Return to 0 degrees"
            >
              <RotateCcw size={14} /> Zero
            </button>
          </div>
          <Slider
            aria-labelledby="crank-angle-label"
            value={[angle]}
            min={0}
            max={720}
            step={1}
            onValueChange={scrub}
          />
          <div className="timeline-ticks">
            <span>0°</span>
            <span>180°</span>
            <span>360°</span>
            <span>540°</span>
            <span>720°</span>
          </div>
          <p className="subtle">
            Drag to pause and inspect a full engine cycle.
          </p>
        </div>
        <div className="firing-panel">
          <div className="section-label">
            <h2>Firing order</h2>
            <span className="subtle">ONE FIRING EVERY 90°</span>
          </div>
          <div className="firing-order">
            {ORDER.map((id) => {
              const s = cylinderState(id, angle);
              return (
                <button
                  key={id}
                  aria-label={`Inspect cylinder ${id}`}
                  aria-pressed={selected === id}
                  className={`${selected === id ? 'selected ' : ''}${s.cycle < 90 ? 'firing' : ''}`}
                  style={
                    {
                      '--stroke-color': COLORS[s.stroke],
                    } as React.CSSProperties
                  }
                  onClick={() => chooseCylinder(id)}
                >
                  <span>{id}</span>
                  <i />
                </button>
              );
            })}
          </div>
          <div className="stroke-legend">
            {[2, 3, 0, 1].map((i) => (
              <span key={i}>
                <i style={{ background: COLORS[i] }} />
                {STROKES[i]}
              </span>
            ))}
          </div>
        </div>
        <div className="cylinder-readout">
          <div className="section-label">
            <h2>Cylinder {selected}</h2>
            <span style={{ color: COLORS[current.stroke] }}>
              {STROKES[current.stroke]}
            </span>
          </div>
          <div className="stroke-track">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={i === current.stroke ? 'current' : ''}
                style={{ '--stroke-color': COLORS[i] } as React.CSSProperties}
              />
            ))}
            <i style={{ left: `${(current.cycle / 720) * 100}%` }} />
          </div>
          <div className="valve-readout">
            <span>
              Intake{' '}
              <b className={current.intake > 0.001 ? 'open' : ''}>
                {current.intake > 0.001 ? 'OPEN' : 'CLOSED'}
              </b>
            </span>
            <span>
              Exhaust{' '}
              <b className={current.exhaust > 0.001 ? 'open' : ''}>
                {current.exhaust > 0.001 ? 'OPEN' : 'CLOSED'}
              </b>
            </span>
          </div>
          <p className="subtle">
            {current.cycle.toFixed(0)}° since firing · Piston travel{' '}
            {((2.08 - current.distance) * 100).toFixed(1)} mm
          </p>
        </div>
      </section>
      {charts && (
        <MotionChart cylinder={selected} angle={angle} onScrub={scrub} />
      )}
      <footer className="bottom-bar">
        <span>PROCEDURAL ENGINE STUDY</span>
        <span>
          Idealized valve timing <i /> Geometry-driven motion{' '}
          <button onClick={() => setInfo(true)}>
            Read model notes <ChevronRight size={12} />
          </button>
        </span>
      </footer>
      <Dialog open={info} onOpenChange={setInfo}>
        <DialogContent className="notes">
          <span className="eyebrow">MODEL CONFIGURATION</span>
          <DialogTitle>Inside this V8</DialogTitle>
          <DialogDescription>
            A geometric teaching model inspired by the traditional Chevrolet
            small-block firing arrangement. This is a working kinematic exhibit,
            not a manufacturing or thermodynamic simulation.
          </DialogDescription>
          <dl>
            <dt>Layout</dt>
            <dd>90° V8 · cross-plane crank · shared pins · 16 valves</dd>
            <dt>Numbering</dt>
            <dd>
              Left bank: 1–3–5–7. Right bank: 2–4–6–8, front to rear. Left/right
              as viewed from the flywheel toward the front pulley.
            </dd>
            <dt>Firing order</dt>
            <dd>
              1–8–4–3–6–5–7–2 at 90° intervals, starting with cylinder 1 at 0°.
            </dd>
            <dt>Geometry</dt>
            <dd>
              98 mm bore · 92 mm stroke · 162 mm rod · 5.55 L nominal
              displacement. Dimensions are illustrative, not a production engine
              specification.
            </dd>
            <dt>Crankpins</dt>
            <dd>
              Front to rear: 45°, 135°, 315°, 225° at cycle zero, measured
              clockwise from vertical looking from the front.
            </dd>
            <dt>Valve timing</dt>
            <dd>
              Relative to each cylinder’s firing: exhaust 180–360°, intake
              360–540°. Smooth 16 mm peak lift, no overlap or timing advance.
              Camshaft rotates at half crank speed.
            </dd>
            <dt>Simplifications</dt>
            <dd>
              Radial point followers and sliding rocker tips are idealized; cam
              profiles and rigid pushrods follow the same valve-lift geometry.
              Colored charge particles, the ignition flash, wiring, and blue
              coolant channels are explanatory overlays and simplified geometry,
              not fluid, electrical, or thermal simulations. The throttle is
              fixed; the water-pump accessory drive and radiator are omitted.
              Exploded offsets are for inspection; the core crank linkage
              remains assembled.
            </dd>
          </dl>
          <a
            href="https://www.chevrolet.com/content/dam/chevrolet/na/us/english/index/performance/resources/installation-guides/crate-engines/01-images/zz4-engine-long-block-installation-guide-24502609.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Firing-order reference: Chevrolet ZZ4 guide ↗
          </a>
        </DialogContent>
      </Dialog>
    </main>
  );
}
