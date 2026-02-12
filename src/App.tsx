import { useState, useMemo, useRef, useCallback } from 'react';
import { CamoCanvas } from './components/CamoCanvas';
import type { CamoCanvasHandle } from './components/CamoCanvas';
import { M90Renderer } from './renderer/WebGLRenderer';
import { COLOR_PRESETS, hexToGL } from './presets';
import Controls from './components/Controls';
import HowItWorks from './components/HowItWorks';
import './App.css';

function App() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000));
  const [scale, setScale] = useState(6);
  const [complexity, setComplexity] = useState(0.5);
  const [presetId, setPresetId] = useState('m90');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const canvasRef = useRef<CamoCanvasHandle>(null);

  const glColors = useMemo(() => {
    const preset = COLOR_PRESETS.find((p) => p.id === presetId) ?? COLOR_PRESETS[0];
    return preset.colors.map(hexToGL);
  }, [presetId]);

  const handleDownload = useCallback(() => {
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;

    try {
      const renderer = new M90Renderer(offscreen);
      renderer.render(seed, scale, complexity, glColors);

      offscreen.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `m90-camo-${seed}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');

      renderer.dispose();
    } catch (e) {
      console.error('Download failed:', e);
    }
  }, [seed, scale, complexity, glColors, width, height]);

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
        />
      </div>
      <div className="panel-overlay">
        <Controls
          seed={seed}
          scale={scale}
          complexity={complexity}
          presetId={presetId}
          width={width}
          height={height}
          onSeedChange={setSeed}
          onScaleChange={setScale}
          onComplexityChange={setComplexity}
          onPresetChange={setPresetId}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
          onDownload={handleDownload}
          onShowHowItWorks={() => setShowHowItWorks(true)}
        />
      </div>
      {showHowItWorks && <HowItWorks onClose={() => setShowHowItWorks(false)} />}
    </div>
  );
}

export default App;
