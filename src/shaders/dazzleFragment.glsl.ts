export const dazzleFragmentShader = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_seed;
uniform float u_scale;
uniform float u_complexity;
uniform vec3 u_color0;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform float u_time;
uniform float u_speed;

out vec4 fragColor;

float hash21(vec2 p) {
    p = fract(p * vec2(443.8975, 397.2973));
    p += dot(p, p.yx + 19.19);
    return fract(p.x * p.y);
}

float hash21s(vec2 p, float s) {
    return hash21(p + fract(s * vec2(12.9898, 78.233)));
}

vec3 getColor(int idx) {
    if (idx == 0) return u_color0;
    if (idx == 1) return u_color1;
    if (idx == 2) return u_color2;
    return u_color3;
}

// Rotated grid cell ID — produces straight-line angular boundaries
vec2 rotatedGridCell(vec2 st, float angle, float gridSize) {
    float c = cos(angle);
    float s = sin(angle);
    mat2 rot = mat2(c, -s, s, c);
    vec2 rotated = rot * st;
    return floor(rotated / gridSize);
}

// Combine two grid cell IDs into a single region hash
float regionHash(vec2 cellA, vec2 cellB, float seed) {
    return hash21(cellA * 17.31 + cellB * 43.77 + fract(seed * vec2(7.13, 11.97)));
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.x *= u_resolution.x / u_resolution.y;

    float seed = fract(u_seed * 0.0013) * 100.0;
    vec2 st = uv * u_scale;

    float stripeFreq = mix(3.0, 7.0, u_complexity);
    float gridSize = mix(2.8, 1.2, u_complexity);

    // --- 3 rotated grids at seed-derived angles to create angular regions ---
    float a0 = hash21s(vec2(seed, 0.0), seed) * 0.8 + 0.1;
    float a1 = a0 + hash21s(vec2(seed, 1.0), seed) * 0.6 + 0.5;
    float a2 = a0 - hash21s(vec2(seed, 2.0), seed) * 0.6 - 0.4;

    vec2 g0 = rotatedGridCell(st, a0, gridSize);
    vec2 g1 = rotatedGridCell(st, a1, gridSize * 3.5);
    vec2 g2 = rotatedGridCell(st, a2, gridSize * 0.7);

    // Combine grids to form unique angular regions
    float r01 = regionHash(g0, g1, seed + 10.0);
    float r12 = regionHash(g1, g2, seed + 20.0);
    float r02 = regionHash(g0, g2, seed + 30.0);

    // Region ID determines stripe angle and colors
    float regionId = fract(r01 * 3.17 + r12 * 7.31 + r02 * 13.73);
    float stripeAngle = regionId * 3.14159;
    int colorA = int(fract(regionId * 4.0) * 4.0);
    int colorB = colorA ^ (fract(regionId * 7.0) > 0.5 ? 1 : 3);

    // Stripe within region
    float ca = cos(stripeAngle);
    float sa = sin(stripeAngle);
    float proj = st.x * ca + st.y * sa;
    float freqVar = mix(0.7, 1.4, fract(regionId * 11.3));
    float scrollSpeed = mix(0.3, 0.8, fract(regionId * 17.3));
    float scrollDir = fract(regionId * 23.7) > 0.5 ? 1.0 : -1.0;
    float stripe = step(0.5, fract(proj * stripeFreq * freqVar + regionId * 10.0 + u_time * scrollSpeed * scrollDir * u_speed));

    vec3 color = stripe > 0.5 ? getColor(colorA) : getColor(colorB);

    // --- Overlay: additional diagonal cuts for more fragmentation ---
    if (u_complexity > 0.25) {
        float a3 = hash21s(vec2(seed, 3.0), seed) * 1.0 + 0.3;
        vec2 g3 = rotatedGridCell(st, a3, gridSize * 2.0);
        float overlay = hash21s(g3, seed + 40.0);

        if (overlay > 0.5) {
            float regionId2 = fract(regionHash(g0, g3, seed + 50.0) * 5.71 + r12 * 3.13);
            float angle2 = regionId2 * 3.14159;
            float ca2 = cos(angle2);
            float sa2 = sin(angle2);
            float proj2 = st.x * ca2 + st.y * sa2;
            float freq2 = stripeFreq * mix(0.6, 1.3, fract(regionId2 * 9.7));
            float scrollSpeed2 = mix(0.3, 0.8, fract(regionId2 * 17.3));
            float scrollDir2 = fract(regionId2 * 23.7) > 0.5 ? 1.0 : -1.0;
            float stripe2 = step(0.5, fract(proj2 * freq2 + regionId2 * 10.0 + u_time * scrollSpeed2 * scrollDir2 * u_speed));

            int col2a = int(fract(regionId2 * 4.0) * 4.0);
            int col2b = col2a ^ (fract(regionId2 * 9.7) > 0.5 ? 1 : 3);
            color = stripe2 > 0.5 ? getColor(col2a) : getColor(col2b);
        }
    }

    // --- Striped accent overlay for additional fragmentation ---
    if (u_complexity > 0.35) {
        float a4 = hash21s(vec2(seed, 4.0), seed) * 0.7 + 0.8;
        vec2 g4 = rotatedGridCell(st, a4, gridSize * 0.4);
        float accent = hash21s(g4, seed + 60.0);

        if (accent > 0.8) {
            float regionId3 = fract(regionHash(g0, g4, seed + 70.0) * 5.31 + r02 * 2.17);
            float angle3 = regionId3 * 3.14159;
            float ca3 = cos(angle3);
            float sa3 = sin(angle3);
            float proj3 = st.x * ca3 + st.y * sa3;
            float freq3 = stripeFreq * mix(0.8, 1.5, fract(regionId3 * 6.3));
            float scrollSpeed3 = mix(0.3, 0.8, fract(regionId3 * 17.3));
            float scrollDir3 = fract(regionId3 * 23.7) > 0.5 ? 1.0 : -1.0;
            float stripe3 = step(0.5, fract(proj3 * freq3 + regionId3 * 10.0 + u_time * scrollSpeed3 * scrollDir3 * u_speed));

            int col3a = int(fract(regionId3 * 4.0) * 4.0);
            int col3b = col3a ^ (fract(regionId3 * 6.3) > 0.5 ? 1 : 3);
            color = stripe3 > 0.5 ? getColor(col3a) : getColor(col3b);
        }
    }

    fragColor = vec4(color, 1.0);
}
`;
