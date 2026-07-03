import type { Theme } from './types.ts';

/**
 * Built-in theme palettes. Each satisfies the Theme contract and is validated
 * at load time by the registry. Add new themes here — one object per palette.
 */

export const spotify: Theme = {
  name: 'spotify',
  border: 'round',
  colors: {
    background: '#121212',
    foreground: '#ffffff',
    primary: '#1DB954',
    secondary: '#b3b3b3',
    accent: '#1ed760',
    muted: '#535353',
    error: '#f15e6c',
    warning: '#f1c40f',
    success: '#1DB954',
  },
};

export const catppuccin: Theme = {
  name: 'catppuccin',
  border: 'round',
  colors: {
    background: '#1e1e2e',
    foreground: '#cdd6f4',
    primary: '#89b4fa',
    secondary: '#a6adc8',
    accent: '#f5c2e7',
    muted: '#6c7086',
    error: '#f38ba8',
    warning: '#f9e2af',
    success: '#a6e3a1',
  },
};

export const tokyoNight: Theme = {
  name: 'tokyo-night',
  border: 'round',
  colors: {
    background: '#1a1b26',
    foreground: '#c0caf5',
    primary: '#7aa2f7',
    secondary: '#9aa5ce',
    accent: '#bb9af7',
    muted: '#565f89',
    error: '#f7768e',
    warning: '#e0af68',
    success: '#9ece6a',
  },
};

export const dracula: Theme = {
  name: 'dracula',
  border: 'round',
  colors: {
    background: '#282a36',
    foreground: '#f8f8f2',
    primary: '#bd93f9',
    secondary: '#6272a4',
    accent: '#ff79c6',
    muted: '#44475a',
    error: '#ff5555',
    warning: '#f1fa8c',
    success: '#50fa7b',
  },
};

export const nord: Theme = {
  name: 'nord',
  border: 'round',
  colors: {
    background: '#2e3440',
    foreground: '#eceff4',
    primary: '#88c0d0',
    secondary: '#81a1c1',
    accent: '#b48ead',
    muted: '#4c566a',
    error: '#bf616a',
    warning: '#ebcb8b',
    success: '#a3be8c',
  },
};

export const gruvbox: Theme = {
  name: 'gruvbox',
  border: 'round',
  colors: {
    background: '#282828',
    foreground: '#ebdbb2',
    primary: '#83a598',
    secondary: '#a89984',
    accent: '#d3869b',
    muted: '#665c54',
    error: '#fb4934',
    warning: '#fabd2f',
    success: '#b8bb26',
  },
};

export const rosePine: Theme = {
  name: 'rose-pine',
  border: 'round',
  colors: {
    background: '#191724',
    foreground: '#e0def4',
    primary: '#c4a7e7',
    secondary: '#908caa',
    accent: '#ebbcba',
    muted: '#6e6a86',
    error: '#eb6f92',
    warning: '#f6c177',
    success: '#31748f',
  },
};

export const matrix: Theme = {
  name: 'matrix',
  border: 'single',
  colors: {
    background: '#000000',
    foreground: '#00ff41',
    primary: '#00ff41',
    secondary: '#008f11',
    accent: '#39ff14',
    muted: '#003b00',
    error: '#ff0000',
    warning: '#ffff00',
    success: '#00ff41',
  },
};
