import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { CamoCanvas } from './components/CamoCanvas';
import type { CamoCanvasHandle } from './components/CamoCanvas';
import { M90Renderer } from './renderer/WebGLRenderer';
import type { PatternType } from './renderer/WebGLRenderer';
import { COLOR_PRESETS, hexToGL } from './presets';
import Controls from './components/Controls';
import HowItWorks from './components/HowItWorks';
import './App.css';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

function App() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000));
  const [scale, setScale] = useState(6);
  const [complexity, setComplexity] = useState(0.5);
  const [presetId, setPresetId] = useState('m90');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [patternType, setPatternType] = useState<PatternType>('m90');
  const [twoColorMode, setTwoColorMode] = useState(false);
  const canvasRef = useRef<CamoCanvasHandle>(null);

  const isMobile = useIsMobile();
  const [panelOpen, setPanelOpen] = useState(!isMobile);

  // Sync panelOpen when switching between mobile/desktop
  useEffect(() => {
    setPanelOpen(!isMobile);
  }, [isMobile]);

  const glColors = useMemo(() => {
    const preset = COLOR_PRESETS.find((p) => p.id === presetId) ?? COLOR_PRESETS[0];
    const all = preset.colors.map(hexToGL);
    if (twoColorMode && patternType === 'dazzle') {
      return [all[0], all[1], all[0], all[1]];
    }
    return all;
  }, [presetId, twoColorMode, patternType]);

  const handleDownload = useCallback(() => {
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;

    try {
      const renderer = new M90Renderer(offscreen);
      renderer.render(seed, scale, complexity, glColors, patternType);

      offscreen.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${patternType}-camo-${seed}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');

      renderer.dispose();
    } catch (e) {
      console.error('Download failed:', e);
    }
  }, [seed, scale, complexity, glColors, width, height, patternType]);

  return (
    <div className="app">
      <div className="canvas-fullscreen">
        <CamoCanvas
          ref={canvasRef}
          seed={seed}
          scale={scale}
          complexity={complexity}
          colors={glColors}
          width={width}
          height={height}
          patternType={patternType}
        />
      </div>

      {isMobile && panelOpen && (
        <div className="panel-backdrop" onClick={() => setPanelOpen(false)} />
      )}

      <div className={`panel-overlay${isMobile && !panelOpen ? ' panel-hidden' : ''}`}>
        <Controls
          seed={seed}
          scale={scale}
          complexity={complexity}
          presetId={presetId}
          width={width}
          height={height}
          patternType={patternType}
          twoColorMode={twoColorMode}
          onSeedChange={setSeed}
          onScaleChange={setScale}
          onComplexityChange={setComplexity}
          onPresetChange={setPresetId}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
          onPatternChange={setPatternType}
          onTwoColorChange={setTwoColorMode}
          onDownload={handleDownload}
          onShowHowItWorks={() => setShowHowItWorks(true)}
        />
      </div>

      {isMobile && (
        <button
          className={`panel-toggle${panelOpen ? ' panel-toggle-hidden' : ''}`}
          onClick={() => setPanelOpen(true)}
          aria-label="Open controls"
        >
          ⚙
        </button>
      )}

      {showHowItWorks && <HowItWorks onClose={() => setShowHowItWorks(false)} />}
    </div>
  );
}

export default App;
