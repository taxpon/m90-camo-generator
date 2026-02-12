export const m90FragmentShader = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_seed;
uniform float u_scale;
uniform float u_complexity; // 0.0 = simple (few corners), 1.0 = complex (many corners)
uniform vec3 u_color0; // base color A (like bright green)
uniform vec3 u_color1; // base color B (like dark green)
uniform vec3 u_color2; // accent color A (like tan)
uniform vec3 u_color3; // accent color B (like navy)

out vec4 fragColor;

// --- Hash functions ---
float hash21(vec2 p) {
    p = fract(p * vec2(443.8975, 397.2973));
    p += dot(p, p.yx + 19.19);
    return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
    vec3 a = fract(vec3(p.xyx) * vec3(443.897, 397.297, 491.105));
    a += dot(a, a.yzx + 19.19);
    return fract(vec2(a.x * a.z, a.y * a.z));
}

float hash21s(vec2 p, float s) {
    return hash21(p + fract(s * vec2(12.9898, 78.233)));
}

vec2 hash22s(vec2 p, float s) {
    return hash22(p + fract(s * vec2(12.9898, 78.233)));
}

// Colors are now passed as uniforms for preset support

// Find nearest Voronoi cell and return its cell ID
// jitter controls how much points deviate from cell center (0=grid, 1=full random)
// Lower jitter = more regular polygons with fewer corners
vec2 voronoiNearest(vec2 uv, float seed, float jitter) {
    vec2 id = floor(uv);
    vec2 fd = fract(uv);
    float minDist = 10.0;
    vec2 nearest = vec2(0.0);
    for (int y = -2; y <= 2; y++) {
        for (int x = -2; x <= 2; x++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 cell = id + offset;
            vec2 point = hash22s(cell, seed) * jitter + (1.0 - jitter) * 0.5;
            vec2 diff = offset + point - fd;
            float d = dot(diff, diff);
            if (d < minDist) {
                minDist = d;
                nearest = cell;
            }
        }
    }
    return nearest;
}

// Merged Voronoi region test with limited merging.
// groupScale controls how many cells can merge (smaller = fewer cells merge = fewer corners).
// threshold controls what fraction of the area is painted.
// jitter controls polygon regularity (lower = more regular, fewer corners).
bool isMergedRegion(vec2 st, float seed, float groupScale, float threshold, float jitter) {
    vec2 cell = voronoiNearest(st, seed, jitter);

    // Get per-cell random
    float cellRand = hash21s(cell, seed + 3.7);

    // Get coarse spatial group - cells in same coarse block tend to merge
    vec2 coarseId = floor(cell / groupScale);
    float coarseRand = hash21s(coarseId, seed + 19.5);

    // mix() for predictable blending; 30% per-cell variation
    float blended = mix(coarseRand, cellRand, 0.30);

    return blended < threshold;
}

// Each layer uses its own coarse Voronoi grid (different scale, rotation, seed)
// with limited cell merging to keep polygon corners under ~8.
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.x *= u_resolution.x / u_resolution.y;

    float seed = fract(u_seed * 0.0013) * 100.0;
    vec2 st = uv * u_scale;

    // Derive parameters from u_complexity (0=simple, 1=complex)
    // Jitter: 0.4 (simple/regular) to 0.85 (complex/irregular)
    float jit = mix(0.4, 0.85, u_complexity);
    // Grid density: 0.55 (coarse/few corners) to 1.05 (fine/many corners)
    float gd = mix(0.55, 1.05, u_complexity);
    // Group scale: 1.1 (minimal merging) to 1.7 (aggressive merging)
    float gs = mix(1.1, 1.7, u_complexity);
    // Per-cell variation in mix: higher for coarser grids to maintain color balance
    float pcv = mix(0.40, 0.25, u_complexity);

    // Layer 0: Base - dark green / bright green mix
    vec2 cell0 = voronoiNearest(st * (gd * 0.82), seed, jit);
    float h0 = hash21s(cell0, seed + 1.0);
    vec2 coarse0 = floor(cell0 / gs);
    float c0 = hash21s(coarse0, seed + 2.0);
    float blend0 = mix(c0, h0, pcv + 0.10);
    vec3 color = blend0 < 0.50 ? u_color1 : u_color0;

    // Layer 1: Bright green extra patches
    float a1 = 0.55;
    mat2 r1 = mat2(cos(a1), -sin(a1), sin(a1), cos(a1));
    vec2 st1 = r1 * st * (gd * 0.88) + vec2(seed * 0.31 + 3.1, seed * 0.17 + 7.3);
    if (isMergedRegion(st1, seed + 10.0, gs, 0.25, jit)) {
        color = u_color0;
    }

    // Layer 2: Dark green patches
    float a1b = -0.35;
    mat2 r1b = mat2(cos(a1b), -sin(a1b), sin(a1b), cos(a1b));
    vec2 st1b = r1b * st * (gd * 0.94) + vec2(seed * 0.47 + 8.3, seed * 0.23 + 13.1);
    if (isMergedRegion(st1b, seed + 30.0, gs, 0.35, jit)) {
        color = u_color1;
    }

    // Layer 3: Tan
    float a2 = -0.65;
    mat2 r2 = mat2(cos(a2), -sin(a2), sin(a2), cos(a2));
    vec2 st2 = r2 * st * (gd * 0.94) + vec2(seed * 0.53 + 11.7, seed * 0.41 + 5.9);
    if (isMergedRegion(st2, seed + 50.0, gs, 0.30, jit)) {
        color = u_color2;
    }

    // Layer 4: Navy
    float a3 = 0.95;
    mat2 r3 = mat2(cos(a3), -sin(a3), sin(a3), cos(a3));
    vec2 st3 = r3 * st * gd + vec2(seed * 0.29 + 19.3, seed * 0.63 + 2.1);
    if (isMergedRegion(st3, seed + 90.0, gs, 0.27, jit)) {
        color = u_color3;
    }

    fragColor = vec4(color, 1.0);
}
`;
