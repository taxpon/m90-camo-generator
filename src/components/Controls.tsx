import { COLOR_PRESETS, type ColorPreset } from '../presets';
import type { PatternType } from '../renderer/WebGLRenderer';

interface ControlsProps {
  seed: number;
  scale: number;
  complexity: number;
  presetId: string;
  width: number;
  height: number;
  patternType: PatternType;
  twoColorMode: boolean;
  isAnimating: boolean;
  animationSpeed: number;
  gifDuration: number;
  isExporting: boolean;
  exportProgress: number;
  onAnimateChange: (animating: boolean) => void;
  onAnimationSpeedChange: (speed: number) => void;
  onGifDurationChange: (duration: number) => void;
  onSeedChange: (seed: number) => void;
  onScaleChange: (scale: number) => void;
  onComplexityChange: (complexity: number) => void;
  onPresetChange: (presetId: string) => void;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  onPatternChange: (patternType: PatternType) => void;
  onTwoColorChange: (twoColor: boolean) => void;
  onDownload: () => void;
  onDownloadGif: () => void;
  onShowHowItWorks: () => void;
}

function Controls({
  seed,
  scale,
  complexity,
  presetId,
  width,
  height,
  patternType,
  twoColorMode,
  isAnimating,
  animationSpeed,
  gifDuration,
  isExporting,
  exportProgress,
  onAnimateChange,
  onAnimationSpeedChange,
  onGifDurationChange,
  onSeedChange,
  onScaleChange,
  onComplexityChange,
  onPresetChange,
  onWidthChange,
  onHeightChange,
  onPatternChange,
  onTwoColorChange,
  onDownload,
  onDownloadGif,
  onShowHowItWorks,
}: ControlsProps) {
  const randomizeSeed = () => {
    onSeedChange(Math.floor(Math.random() * 100000));
  };

  return (
    <div className="sidebar">
      <h1>
        <span>{patternType === 'm90' ? 'M90' : 'Dazzle'}</span> Camo Generator
      </h1>

      <div className="pattern-toggle">
        <button
          className={`pattern-btn${patternType === 'm90' ? ' pattern-active' : ''}`}
          onClick={() => onPatternChange('m90')}
        >
          M90
        </button>
        <button
          className={`pattern-btn${patternType === 'dazzle' ? ' pattern-active' : ''}`}
          onClick={() => onPatternChange('dazzle')}
        >
          Dazzle
        </button>
      </div>

      {patternType === 'dazzle' && (
        <div className="pattern-toggle">
          <button
            className={`pattern-btn${!twoColorMode ? ' pattern-active' : ''}`}
            onClick={() => onTwoColorChange(false)}
          >
            4 Colors
          </button>
          <button
            className={`pattern-btn${twoColorMode ? ' pattern-active' : ''}`}
            onClick={() => onTwoColorChange(true)}
          >
            2 Colors
          </button>
        </div>
      )}

      {patternType === 'dazzle' && (
        <div className="pattern-toggle">
          <button
            className={`pattern-btn${!isAnimating ? ' pattern-active' : ''}`}
            onClick={() => onAnimateChange(false)}
          >
            Static
          </button>
          <button
            className={`pattern-btn${isAnimating ? ' pattern-active' : ''}`}
            onClick={() => onAnimateChange(true)}
          >
            Animate
          </button>
        </div>
      )}

      {patternType === 'dazzle' && isAnimating && (
        <>
          <div className="control-group">
            <label>Speed</label>
            <div className="slider-row">
              <input
                type="range"
                min={0.1}
                max={3}
                step={0.1}
                value={animationSpeed}
                onChange={(e) => onAnimationSpeedChange(Number(e.target.value))}
              />
              <span className="slider-value">{animationSpeed.toFixed(1)}</span>
            </div>
          </div>
          <div className="control-group">
            <label>Duration</label>
            <div className="slider-row">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={gifDuration}
                onChange={(e) => onGifDurationChange(Number(e.target.value))}
              />
              <span className="slider-value">{gifDuration}s</span>
            </div>
          </div>
        </>
      )}

      <div className="control-group">
        <label>Color Preset</label>
        <div className="preset-scroll">
        <div className="preset-grid">
          {COLOR_PRESETS.map((preset: ColorPreset) => (
            <button
              key={preset.id}
              className={`preset-btn ${preset.id === presetId ? 'preset-active' : ''}`}
              onClick={() => onPresetChange(preset.id)}
              title={preset.name}
            >
              <div className="preset-swatch">
                {preset.colors.map((color, i) => (
                  <div
                    key={i}
                    className="preset-color"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="preset-label">{preset.name}</span>
            </button>
          ))}
        </div>
        </div>
      </div>

      <div className="control-group">
        <label>Scale</label>
        <div className="slider-row">
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={scale}
            onChange={(e) => onScaleChange(Number(e.target.value))}
          />
          <span className="slider-value">{scale}</span>
        </div>
      </div>

      <div className="control-group">
        <label>Complexity</label>
        <div className="slider-row">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(complexity * 100)}
            onChange={(e) => onComplexityChange(Number(e.target.value) / 100)}
          />
          <span className="slider-value">{Math.round(complexity * 100)}</span>
        </div>
      </div>

      <div className="control-group">
        <label>Seed</label>
        <div className="seed-row">
          <input
            type="number"
            value={seed}
            onChange={(e) => onSeedChange(Number(e.target.value))}
          />
          <button className="btn" onClick={randomizeSeed}>
            Randomize
          </button>
        </div>
      </div>

      <div className="control-group">
        <label>Canvas Size</label>
        <div className="size-row">
          <input
            type="number"
            min={64}
            max={4096}
            value={width}
            onChange={(e) => onWidthChange(Number(e.target.value))}
          />
          <span className="size-separator">&times;</span>
          <input
            type="number"
            min={64}
            max={4096}
            value={height}
            onChange={(e) => onHeightChange(Number(e.target.value))}
          />
        </div>
      </div>

      <button className="btn btn-primary btn-download" onClick={onDownload}>
        Download PNG
      </button>

      {patternType === 'dazzle' && isAnimating && (
        <button
          className="btn btn-primary btn-download"
          onClick={onDownloadGif}
          disabled={isExporting}
        >
          {isExporting ? `Exporting... (${Math.round(exportProgress)}%)` : 'Download GIF'}
        </button>
      )}

      <button className="btn-how" onClick={onShowHowItWorks}>
        How it works
      </button>
    </div>
  );
}

export default Controls;
