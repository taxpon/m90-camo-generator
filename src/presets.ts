export interface ColorPreset {
  id: string;
  name: string;
  colors: [string, string, string, string]; // [color0, color1, color2, color3]
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'm90',
    name: 'M90 Classic',
    colors: ['#808030', '#505032', '#9F9578', '#3A3440'],
  },
  {
    id: 'arctic',
    name: 'Arctic',
    colors: ['#C8D5E0', '#8A9BAE', '#E8EDF2', '#4A5568'],
  },
  {
    id: 'ember',
    name: 'Ember',
    colors: ['#C4572A', '#8B3A1F', '#E8A84C', '#2D1B14'],
  },
  {
    id: 'ocean',
    name: 'Ocean Depth',
    colors: ['#2B7A99', '#1B4965', '#5FA8C4', '#0D2137'],
  },
  {
    id: 'dusk',
    name: 'Dusk',
    colors: ['#9B7EC8', '#5C4B8A', '#D4A9A8', '#2A2240'],
  },
  {
    id: 'moss',
    name: 'Moss & Stone',
    colors: ['#7A8C5E', '#4A5A3A', '#B8AD98', '#2E3028'],
  },
  {
    id: 'noir',
    name: 'Noir',
    colors: ['#4A4A4A', '#1A1A1A', '#787878', '#0A0A0A'],
  },
  {
    id: 'sakura',
    name: 'Sakura',
    colors: ['#E8A0BF', '#C06090', '#F5D5E0', '#6B3050'],
  },
  {
    id: 'desert',
    name: 'Desert Sand',
    colors: ['#D4A76A', '#A07840', '#E8D4B0', '#5C3D1E'],
  },
  {
    id: 'neon',
    name: 'Neon Nights',
    colors: ['#00E5A0', '#0080FF', '#FF3090', '#0A0A2A'],
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    colors: ['#C07050', '#8B4535', '#D8B49A', '#3D2520'],
  },
  {
    id: 'mint',
    name: 'Mint Choco',
    colors: ['#7EC8B0', '#4A8C78', '#C8E8D8', '#2A1E18'],
  },
  {
    id: 'storm',
    name: 'Storm',
    colors: ['#607090', '#3A4A60', '#8898A8', '#1E2830'],
  },
  {
    id: 'autumn',
    name: 'Autumn',
    colors: ['#C8783C', '#8B4513', '#D4A850', '#2D1F0E'],
  },
  {
    id: 'lavender',
    name: 'Lavender Field',
    colors: ['#A89CC8', '#7060A0', '#D8D0E8', '#E8D888'],
  },
  {
    id: 'coral',
    name: 'Coral Reef',
    colors: ['#FF7F6B', '#1B8C8C', '#FFB89A', '#104050'],
  },
];

// Convert hex color string to [r, g, b] in 0-1 range
export function hexToGL(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
  ];
}
