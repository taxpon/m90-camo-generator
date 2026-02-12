interface HowItWorksProps {
  onClose: () => void;
}

// Simple Voronoi SVG diagram
function VoronoiDiagram() {
  // Pre-computed Voronoi-like cells
  const cells = [
    { points: "20,5 75,0 80,45 50,60 15,50", fill: "#6b8f5e" },
    { points: "75,0 140,0 140,40 120,55 80,45", fill: "#8ab07a" },
    { points: "140,0 200,0 200,50 170,45 140,40", fill: "#5a7040" },
    { points: "15,50 50,60 40,100 5,100 5,50", fill: "#7a9c68" },
    { points: "50,60 80,45 120,55 110,90 70,100 40,100", fill: "#4a6838" },
    { points: "120,55 140,40 170,45 180,85 150,100 110,90", fill: "#6b8f5e" },
    { points: "170,45 200,50 200,100 180,100 180,85", fill: "#8ab07a" },
  ];
  const points = [
    [45, 28], [105, 25], [170, 22],
    [25, 72], [82, 72], [148, 72], [188, 68],
  ];
  return (
    <svg viewBox="0 0 200 100" className="hiw-svg">
      {cells.map((c, i) => (
        <polygon key={i} points={c.points} fill={c.fill} stroke="#2a3a20" strokeWidth="1.5" />
      ))}
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#fff" stroke="#2a3a20" strokeWidth="1" />
      ))}
    </svg>
  );
}

// Cell merging diagram
function MergingDiagram() {
  return (
    <svg viewBox="0 0 200 100" className="hiw-svg">
      {/* Coarse grid */}
      <rect x="0" y="0" width="100" height="100" fill="none" stroke="#ffffff30" strokeWidth="1" strokeDasharray="4 2" />
      <rect x="100" y="0" width="100" height="100" fill="none" stroke="#ffffff30" strokeWidth="1" strokeDasharray="4 2" />
      {/* Merged cells - group A */}
      <polygon points="10,8 55,5 60,40 45,55 30,50 8,35" fill="#6b8f5e" stroke="#2a3a20" strokeWidth="1.5" />
      <polygon points="55,5 95,3 92,38 60,40" fill="#6b8f5e" stroke="#2a3a20" strokeWidth="1.5" />
      {/* Unmerged cells */}
      <polygon points="8,35 30,50 25,80 5,75" fill="#3a5030" stroke="#2a3a20" strokeWidth="1.5" />
      <polygon points="45,55 92,38 85,80 55,85 25,80 30,50" fill="#3a5030" stroke="#2a3a20" strokeWidth="1.5" />
      {/* Merged cells - group B */}
      <polygon points="105,10 145,5 155,45 130,50 108,40" fill="#D4A76A" stroke="#2a3a20" strokeWidth="1.5" />
      <polygon points="145,5 195,8 192,42 155,45" fill="#D4A76A" stroke="#2a3a20" strokeWidth="1.5" />
      <polygon points="108,40 130,50 125,85 105,90 100,55" fill="#D4A76A" stroke="#2a3a20" strokeWidth="1.5" />
      {/* Unmerged in group B */}
      <polygon points="155,45 192,42 195,90 160,88 125,85 130,50" fill="#8B6030" stroke="#2a3a20" strokeWidth="1.5" />
      {/* Labels */}
      <text x="50" y="96" textAnchor="middle" fill="#ffffff80" fontSize="8" fontFamily="sans-serif">Group A</text>
      <text x="150" y="96" textAnchor="middle" fill="#ffffff80" fontSize="8" fontFamily="sans-serif">Group B</text>
    </svg>
  );
}

// Layer stacking diagram
function LayerDiagram() {
  const layers = [
    { label: "Base", desc: "Green mix", colors: ["#808030", "#505032"] },
    { label: "+Bright", desc: "Green patches", colors: ["#808030"] },
    { label: "+Dark", desc: "Green patches", colors: ["#505032"] },
    { label: "+Tan", desc: "Accent", colors: ["#9F9578"] },
    { label: "+Navy", desc: "Shadows", colors: ["#3A3440"] },
  ];
  return (
    <div className="hiw-layers">
      {layers.map((layer, i) => (
        <div key={i} className="hiw-layer-row">
          <div className="hiw-layer-stack" style={{ transform: `translateX(${i * 4}px) translateY(${i * 2}px)` }}>
            <div className="hiw-layer-card" style={{ background: layer.colors[0] }}>
              {layer.colors[1] && (
                <div className="hiw-layer-split" style={{ background: layer.colors[1] }} />
              )}
            </div>
          </div>
          <div className="hiw-layer-info">
            <span className="hiw-layer-label">{layer.label}</span>
            <span className="hiw-layer-desc">{layer.desc}</span>
          </div>
          {i < layers.length - 1 && <div className="hiw-layer-arrow">+</div>}
        </div>
      ))}
    </div>
  );
}

// Complexity comparison
function ComplexityDiagram() {
  return (
    <div className="hiw-compare">
      <div className="hiw-compare-item">
        <svg viewBox="0 0 100 80" className="hiw-svg-sm">
          <polygon points="10,5 55,3 50,42 8,40" fill="#6b8f5e" stroke="#2a3a20" strokeWidth="1.5" />
          <polygon points="55,3 95,8 92,45 50,42" fill="#9F9578" stroke="#2a3a20" strokeWidth="1.5" />
          <polygon points="8,40 50,42 45,78 5,75" fill="#3A3440" stroke="#2a3a20" strokeWidth="1.5" />
          <polygon points="50,42 92,45 95,78 45,78" fill="#808030" stroke="#2a3a20" strokeWidth="1.5" />
        </svg>
        <span>Low: Simple shapes, ~5 corners</span>
      </div>
      <div className="hiw-compare-item">
        <svg viewBox="0 0 100 80" className="hiw-svg-sm">
          <polygon points="8,3 32,2 40,18 28,30 5,25" fill="#6b8f5e" stroke="#2a3a20" strokeWidth="1" />
          <polygon points="32,2 58,5 55,22 40,18" fill="#808030" stroke="#2a3a20" strokeWidth="1" />
          <polygon points="58,5 85,2 92,20 78,28 55,22" fill="#9F9578" stroke="#2a3a20" strokeWidth="1" />
          <polygon points="85,2 98,8 95,30 92,20" fill="#505032" stroke="#2a3a20" strokeWidth="1" />
          <polygon points="5,25 28,30 22,52 8,55" fill="#3A3440" stroke="#2a3a20" strokeWidth="1" />
          <polygon points="28,30 40,18 55,22 60,40 48,52 22,52" fill="#505032" stroke="#2a3a20" strokeWidth="1" />
          <polygon points="55,22 78,28 82,48 60,40" fill="#3A3440" stroke="#2a3a20" strokeWidth="1" />
          <polygon points="78,28 95,30 98,55 82,48" fill="#808030" stroke="#2a3a20" strokeWidth="1" />
          <polygon points="8,55 22,52 18,78 5,78" fill="#808030" stroke="#2a3a20" strokeWidth="1" />
          <polygon points="22,52 48,52 52,78 18,78" fill="#9F9578" stroke="#2a3a20" strokeWidth="1" />
          <polygon points="48,52 60,40 82,48 85,75 52,78" fill="#6b8f5e" stroke="#2a3a20" strokeWidth="1" />
          <polygon points="82,48 98,55 95,78 85,75" fill="#3A3440" stroke="#2a3a20" strokeWidth="1" />
        </svg>
        <span>High: Complex shapes, ~8+ corners</span>
      </div>
    </div>
  );
}

export default function HowItWorks({ onClose }: HowItWorksProps) {
  return (
    <div className="hiw-overlay" onClick={onClose}>
      <div className="hiw-modal" onClick={(e) => e.stopPropagation()}>
        <button className="hiw-close" onClick={onClose} aria-label="Close">&times;</button>

        <h2>How it works</h2>
        <p className="hiw-intro">
          This generator creates M90-style camouflage patterns entirely on the GPU
          using a WebGL2 fragment shader. Every pixel is computed in parallel, making
          generation instant for any resolution.
        </p>

        <section className="hiw-section">
          <div className="hiw-step-num">1</div>
          <h3>Voronoi Tessellation</h3>
          <p>
            The pattern starts with a <strong>Voronoi diagram</strong> &mdash; a grid of
            random seed points where each pixel is assigned to its nearest point. This
            naturally creates irregular polygon shapes.
          </p>
          <VoronoiDiagram />
          <p className="hiw-caption">
            White dots are seed points. Each colored region contains all pixels closest to its seed.
          </p>
        </section>

        <section className="hiw-section">
          <div className="hiw-step-num">2</div>
          <h3>Cell Merging</h3>
          <p>
            Individual Voronoi cells are small. To create the large, bold shapes characteristic
            of M90, adjacent cells are <strong>merged into groups</strong> using a coarse
            spatial grid. Cells in the same coarse block share a random value, so they tend
            to be assigned the same color.
          </p>
          <MergingDiagram />
          <p className="hiw-caption">
            Cells within each dashed group share similar random values, causing them to merge
            into larger regions. The <code>mix()</code> function blends per-cell and per-group
            randomness for controlled variation.
          </p>
        </section>

        <section className="hiw-section">
          <div className="hiw-step-num">3</div>
          <h3>Layered Painting</h3>
          <p>
            Following the real M90 SVG structure, the pattern uses a <strong>painter&apos;s
            algorithm</strong> with 5 layers. Each layer has its own Voronoi grid at a
            different rotation and scale, preventing alignment artifacts.
          </p>
          <LayerDiagram />
          <p className="hiw-caption">
            Later layers paint over earlier ones, just like the real M90 fabric is printed
            in successive passes.
          </p>
        </section>

        <section className="hiw-section">
          <div className="hiw-step-num">4</div>
          <h3>Complexity Control</h3>
          <p>
            The <strong>Complexity</strong> slider controls three shader parameters simultaneously:
          </p>
          <ul className="hiw-list">
            <li><strong>Jitter</strong> &mdash; How much seed points deviate from a regular grid. Low jitter creates regular, convex polygons; high jitter creates irregular, organic shapes.</li>
            <li><strong>Grid density</strong> &mdash; Fewer cells mean simpler shapes with fewer corners; more cells mean finer detail.</li>
            <li><strong>Group scale</strong> &mdash; Controls how many cells merge together, affecting overall shape size.</li>
          </ul>
          <ComplexityDiagram />
        </section>

        <section className="hiw-section">
          <div className="hiw-step-num">5</div>
          <h3>Color Presets</h3>
          <p>
            The 4 colors are passed as <strong>uniform variables</strong> to the shader,
            allowing instant palette swaps without recompiling. Each preset defines the
            4 colors used across the 5 paint layers.
          </p>
          <div className="hiw-palette-demo">
            {[
              { name: "M90", colors: ["#808030", "#505032", "#9F9578", "#3A3440"] },
              { name: "Ocean", colors: ["#2B7A99", "#1B4965", "#5FA8C4", "#0D2137"] },
              { name: "Neon", colors: ["#00E5A0", "#0080FF", "#FF3090", "#0A0A2A"] },
            ].map((p) => (
              <div key={p.name} className="hiw-palette-row">
                <div className="hiw-palette-colors">
                  {p.colors.map((c, i) => (
                    <div key={i} className="hiw-palette-chip" style={{ background: c }} />
                  ))}
                </div>
                <span className="hiw-palette-name">{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="hiw-section hiw-section-last">
          <div className="hiw-step-num">&#9881;</div>
          <h3>Tech Stack</h3>
          <ul className="hiw-list">
            <li><strong>WebGL2</strong> &mdash; GPU-accelerated rendering via fragment shader</li>
            <li><strong>GLSL 300 es</strong> &mdash; Shader language for all pattern logic</li>
            <li><strong>React + TypeScript</strong> &mdash; UI framework</li>
            <li><strong>Vite</strong> &mdash; Build tooling</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
