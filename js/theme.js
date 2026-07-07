const themes = {
  classic: {
    '--accent': '#FFDE59', '--green': '#B6F84A', '--blue': '#7CD6FF',
    '--pink': '#FF8FA3', '--amber': '#FFC24B', '--text': '#000',
    '--text-inv': '#fff', '--bg': '#fff', '--bg-dark': '#111',
    '--border': '#000', '--shadow': '#000', '--dead': '#333',
    '--gray-mid': '#555', '--gray-low': '#888',
  },
  midnight: {
    '--accent': '#4A6B8A', '--green': '#00FF88', '--blue': '#00BFFF',
    '--pink': '#FF6B8A', '--amber': '#FFB347', '--text': '#E8E8E8',
    '--text-inv': '#FFFFFF', '--bg': '#1A1A1A', '--bg-dark': '#0D0D0D',
    '--border': '#555', '--shadow': '#000', '--dead': '#555',
    '--gray-mid': '#999', '--gray-low': '#666',
  },
  fallout: {
    '--accent': '#4C8C44', '--green': '#00FF41', '--blue': '#00CCAA',
    '--pink': '#FF4455', '--amber': '#FF9500', '--text': '#CCFFCC',
    '--text-inv': '#CCFFCC', '--bg': '#0A1A0A', '--bg-dark': '#0A1A0A',
    '--border': '#00FF41', '--shadow': '#003300', '--dead': '#1A3A1A',
    '--gray-mid': '#55CC55', '--gray-low': '#33AA33',
  },
  neon: {
    '--accent': '#BB33FF', '--green': '#00FFAA', '--blue': '#00D4FF',
    '--pink': '#FF0088', '--amber': '#FFD700', '--text': '#FFFFFF',
    '--text-inv': '#FFFFFF', '--bg': '#1A0033', '--bg-dark': '#0D001A',
    '--border': '#BB33FF', '--shadow': '#440077', '--dead': '#331155',
    '--gray-mid': '#BB88FF', '--gray-low': '#8844CC',
  },
  retro: {
    '--accent': '#D4A04A', '--green': '#8BC34A', '--blue': '#6BB5FF',
    '--pink': '#FF8A80', '--amber': '#FFB300', '--text': '#3E2723',
    '--text-inv': '#FFF8E1', '--bg': '#FFF8E1', '--bg-dark': '#3E2723',
    '--border': '#5D4037', '--shadow': '#5D4037', '--dead': '#A1887F',
    '--gray-mid': '#8D6E63', '--gray-low': '#A1887F',
  },
  ghost: {
    '--accent': '#E8E8E8', '--green': '#9CCC65', '--blue': '#81D4FA',
    '--pink': '#F48FB1', '--amber': '#FFD54F', '--text': '#333',
    '--text-inv': '#fff', '--bg': '#FAFAFA', '--bg-dark': '#263238',
    '--border': '#BDBDBD', '--shadow': '#E0E0E0', '--dead': '#BDBDBD',
    '--gray-mid': '#999', '--gray-low': '#BBB',
  },
};

/** Apply a theme by setting CSS custom properties on :root and persisting choice @param {string} name */
function applyTheme(name) {
  const theme = themes[name] || themes.classic;
  const root = document.documentElement;
  for (const [key, val] of Object.entries(theme)) {
    root.style.setProperty(key, val);
  }
  localStorage.setItem('halflifeTheme', name);
}

/** Restore saved theme on load and wire up the theme selector dropdown @returns {void} */
function initTheme() {
  const saved = localStorage.getItem('halflifeTheme') || 'classic';
  const sel = document.getElementById('themeSelect');
  if (sel) {
    sel.value = saved;
    sel.addEventListener('change', function () {
      applyTheme(this.value);
    });
  }
  applyTheme(saved);
}
