# M90 Camo Generator

A GPU-accelerated camouflage pattern generator inspired by the Swedish M90 military pattern. Generate, customize, and download unique camo textures entirely in your browser.

**Live Demo:** https://taxpon.github.io/m90-camo-generator/

## Features

- GPU-accelerated rendering via WebGL2 fragment shader -- instant generation at any resolution
- Voronoi tessellation with cell merging for authentic M90-style irregular shapes
- 16 color presets (M90 Classic, Arctic, Ember, Ocean, Desert, Neon Nights, and more)
- Adjustable complexity controlling jitter, grid density, and group scale simultaneously
- Scale and seed controls for fine-tuning pattern appearance
- Instant PNG download at custom resolution
- Full-screen live preview with floating controls

## How It Works

The pattern is generated in three stages, all computed in a single WebGL2 fragment shader:

1. **Voronoi Tessellation** -- Random seed points create a grid of irregular polygons, where each pixel belongs to its nearest seed.
2. **Cell Merging** -- Adjacent Voronoi cells are grouped using a coarse spatial grid so they share colors, producing the large bold shapes characteristic of M90.
3. **Layered Painting** -- Five layers, each with its own rotated and scaled Voronoi grid, are composited using a painter's algorithm, mimicking how the real M90 fabric is printed in successive passes.

## Tech Stack

- React 19
- TypeScript
- WebGL2 / GLSL 300 es
- Vite

## Getting Started

```bash
git clone https://github.com/taxpon/m90-camo-generator.git
cd m90-camo-generator
npm install
npm run dev
```

The development server will start at `http://localhost:5173`.

## License

MIT
