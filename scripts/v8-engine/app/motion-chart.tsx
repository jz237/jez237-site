'use client';
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- The SVG trace is itself the visual slider; it supports keyboard, pointer, and ARIA range semantics. */
import { useMemo } from 'react';
import { cylinderState, R, L, ORDER } from '@/lib/mechanics';

export function MotionChart({
  cylinder,
  angle,
  onScrub,
}: {
  cylinder: number;
  angle: number;
  onScrub: (angle: number) => void;
}) {
  const curves = useMemo(() => {
    const samples = Array.from({ length: 361 }, (_, i) =>
      cylinderState(cylinder, i * 2),
    );
    return [
      {
        name: 'Piston travel',
        color: '#d9ede2',
        unit: 'mm',
        max: 92,
        values: samples.map((s) => (R + L - s.distance) * 100),
      },
      {
        name: 'Intake lift',
        color: '#58c6f3',
        unit: 'mm',
        max: 16,
        values: samples.map((s) => s.intake * 100),
      },
      {
        name: 'Exhaust lift',
        color: '#b59afb',
        unit: 'mm',
        max: 16,
        values: samples.map((s) => s.exhaust * 100),
      },
    ];
  }, [cylinder]);
  const s = cylinderState(cylinder, angle);
  const readings = [
    (R + L - s.distance) * 100,
    s.intake * 100,
    s.exhaust * 100,
  ];
  return (
    <section
      className="motion-charts"
      aria-label={`Cylinder ${cylinder} motion charts`}
    >
      <div className="section-label">
        <h2>Cylinder {cylinder} · motion traces</h2>
        <span className="subtle">Fires at {ORDER.indexOf(cylinder) * 90}°</span>
      </div>
      <p className="subtle">
        Shared crank angle · click or drag a trace to pause and scrub. Piston
        travel is measured down from top dead center.
      </p>
      <div className="chart-grid">
        {curves.map((c, i) => (
          <div key={c.name} className="motion-trace">
            <div className="range-label">
              <span style={{ color: c.color }}>{c.name}</span>
              <output>
                {readings[i].toFixed(1)} {c.unit}
              </output>
            </div>
            <svg
              viewBox="0 0 400 112"
              role="slider"
              tabIndex={0}
              aria-label={`${c.name} crank angle`}
              aria-valuemin={0}
              aria-valuemax={720}
              aria-valuenow={Math.round(angle)}
              aria-valuetext={`${Math.round(angle)} degrees; ${readings[i].toFixed(1)} millimeters`}
              onKeyDown={(e) => {
                if (
                  ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                ) {
                  e.preventDefault();
                  onScrub(
                    e.key === 'Home'
                      ? 0
                      : e.key === 'End'
                        ? 720
                        : Math.max(
                            0,
                            Math.min(
                              720,
                              angle +
                                (e.key === 'ArrowRight' ? 1 : -1) *
                                  (e.shiftKey ? 10 : 1),
                            ),
                          ),
                  );
                }
              }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                const r = e.currentTarget.getBoundingClientRect();
                onScrub(
                  Math.max(
                    0,
                    Math.min(
                      720,
                      ((((e.clientX - r.left) / r.width) * 400 - 28) / 360) *
                        720,
                    ),
                  ),
                );
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                  const r = e.currentTarget.getBoundingClientRect();
                  onScrub(
                    Math.max(
                      0,
                      Math.min(
                        720,
                        ((((e.clientX - r.left) / r.width) * 400 - 28) / 360) *
                          720,
                      ),
                    ),
                  );
                }
              }}
            >
              {[0, 180, 360, 540, 720].map((a) => (
                <g key={a}>
                  <path d={`M${28 + a / 2} 8V88`} stroke="#ffffff12" />
                  <text x={28 + a / 2} y="106" textAnchor="middle">
                    {a}°
                  </text>
                </g>
              ))}
              <text x="1" y="15">
                {c.max}
              </text>
              <text x="9" y="88">
                0
              </text>
              <path
                d={c.values
                  .map(
                    (v, k) =>
                      `${k ? 'L' : 'M'}${28 + k},${88 - (v / c.max) * 76}`,
                  )
                  .join(' ')}
                fill="none"
                stroke={c.color}
                strokeWidth="2"
              />
              <path
                d={`M${28 + angle / 2} 6V89`}
                stroke="#fff"
                strokeWidth="1"
              />
              <circle
                cx={28 + angle / 2}
                cy={88 - (readings[i] / c.max) * 76}
                r="3.5"
                fill={c.color}
              />
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}
