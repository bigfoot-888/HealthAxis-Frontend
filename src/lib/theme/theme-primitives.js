import { createTheme, alpha } from '@mui/material/styles';

const defaultTheme = createTheme();

// Custom shadows
const customShadows = [...defaultTheme.shadows];

// Full color palettes (main + 0–100 scales)
export const colorPalettes = {
  primary: { 0: '#000000', 10: '#001B3E', 20: '#0A305F', 30: '#274777', 40: '#415F91', 50: '#5A77AB', 60: '#7491C7', 70: '#8EACE3', 80: '#AAC7FF', 90: '#D6E3FF', 100: '#FFFFFF' },
  secondary: { 0: '#000000', 10: '#2A1700', 20: '#462A00', 30: '#653E00', 40: '#825512', 50: '#9E6D2A', 60: '#BB8641', 70: '#D9A058', 80: '#F8BB70', 90: '#FFDDB7', 100: '#FFFFFF' },
  tertiary: { 0: '#000000', 10: '#3B0715', 20: '#561C29', 30: '#72333E', 40: '#8E4955', 50: '#AC616D', 60: '#C97A86', 70: '#E894A0', 80: '#FFB2BD', 90: '#FFD9DD', 100: '#FFFFFF' },
  neutral: { 0: '#000000', 10: '#1C1B1C', 20: '#313030', 30: '#484647', 40: '#5F5E5E', 50: '#787677', 60: '#929090', 70: '#ADAAAB', 80: '#C9C6C6', 90: '#E5E2E2', 100: '#FFFFFF' },
  neutralVariant: { 0: '#000000', 10: '#1C1B1C', 20: '#313031', 30: '#474647', 40: '#5F5E5F', 50: '#787777', 60: '#929091', 70: '#ADAAAB', 80: '#C9C6C6', 90: '#E5E2E2', 100: '#FFFFFF' },
};

// Full Figma color schemes with semantic tokens and surface containers
export const colorSchemes = {
  light: {
    palette: {
      primary: { main: '#415F91', contrastText: '#FFFFFF', container: '#D6E3FF', onContainer: '#274777' },
      secondary: { main: '#825512', contrastText: '#FFFFFF', container: '#FFDDB7', onContainer: '#653E00' },
      tertiary: { main: '#8E4955', contrastText: '#FFFFFF', container: '#FFD9DD', onContainer: '#72333E' },
      error: { main: '#BA1A1A', contrastText: '#FFFFFF', container: '#FFDAD5', onContainer: '#73342D' },
      background: { default: '#F9F9FF', paper: '#FAF9FF' },
      surface: '#FAF9FF',
      surfaceVariant: '#E1E2EC',
      surfaceContainerLowest: '#FFFFFF',
      surfaceContainerLow: '#F3F3FA',
      surfaceContainer: '#EEEDF4',
      surfaceContainerHigh: '#E8E7EF',
      surfaceContainerHighest: '#E2E2E9',
      onPrimary: '#FFFFFF',
      onSecondary: '#FFFFFF',
      onTertiary: '#FFFFFF',
      onError: '#FFFFFF',
      onBackground: '#191C20',
      onSurface: '#1A1B20',
      onSurfaceVariant: '#44464F',
      outline: '#757780',
      outlineVariant: '#C5C6D0',
      shadow: '#000000',
      scrim: '#000000',
      inverseSurface: '#2F3036',
      inverseOnSurface: '#F1F0F7',
      inversePrimary: '#AAC7FF',
      primaryFixed: '#D6E3FF',
      onPrimaryFixed: '#001B3E',
      primaryFixedDim: '#AAC7FF',
      onPrimaryFixedVariant: '#274777',
      secondaryFixed: '#FFDDB7',
      onSecondaryFixed: '#2A1700',
      secondaryFixedDim: '#F7BB70',
      onSecondaryFixedVariant: '#653E00',
      tertiaryFixed: '#FFD9DD',
      onTertiaryFixed: '#3B0715',
      tertiaryFixedDim: '#FFB2BD',
      onTertiaryFixedVariant: '#72333E',
      baseShadow: 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
    },
  },
  dark: {
    palette: {
      primary: { main: '#AAC7FF', contrastText: '#0A305F', container: '#274777', onContainer: '#D6E3FF' },
      secondary: { main: '#F7BB70', contrastText: '#462A00', container: '#653E00', onContainer: '#FFDDB7' },
      tertiary: { main: '#FFB2BD', contrastText: '#561D29', container: '#72333E', onContainer: '#FFD9DD' },
      error: { main: '#FFB4AB', contrastText: '#561E19', container: '#73342D', onContainer: '#FFDAD5' },
      background: { default: '#111318', paper: '#121318' },
      surface: '#121318',
      surfaceVariant: '#44464F',
      surfaceContainerLowest: '#0C0E13',
      surfaceContainerLow: '#1A1B20',
      surfaceContainer: '#1E1F25',
      surfaceContainerHigh: '#282A2F',
      surfaceContainerHighest: '#33353A',
      onPrimary: '#0A305F',
      onSecondary: '#462A00',
      onTertiary: '#561D29',
      onError: '#561E19',
      onBackground: '#E2E2E9',
      onSurface: '#E2E2E9',
      onSurfaceVariant: '#C5C6D0',
      outline: '#8F9099',
      outlineVariant: '#44464F',
      shadow: '#000000',
      scrim: '#000000',
      inverseSurface: '#E2E2E9',
      inverseOnSurface: '#2F3036',
      inversePrimary: '#415F91',
      primaryFixed: '#D6E3FF',
      onPrimaryFixed: '#001B3E',
      primaryFixedDim: '#AAC7FF',
      onPrimaryFixedVariant: '#274777',
      secondaryFixed: '#FFDDB7',
      onSecondaryFixed: '#2A1700',
      secondaryFixedDim: '#F7BB70',
      onSecondaryFixedVariant: '#653E00',
      tertiaryFixed: '#FFD9DD',
      onTertiaryFixed: '#3B0715',
      tertiaryFixedDim: '#FFB2BD',
      onTertiaryFixedVariant: '#72333E',
      baseShadow: 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',
    },
  },
};

// Typography
export const typography = {
  fontFamily: 'Inter, sans-serif',
  h1: { fontSize: defaultTheme.typography.pxToRem(48), fontWeight: 600, lineHeight: 1.2, letterSpacing: -0.5 },
  h2: { fontSize: defaultTheme.typography.pxToRem(36), fontWeight: 600, lineHeight: 1.2 },
  h3: { fontSize: defaultTheme.typography.pxToRem(30), lineHeight: 1.2 },
  h4: { fontSize: defaultTheme.typography.pxToRem(24), fontWeight: 600, lineHeight: 1.5 },
  h5: { fontSize: defaultTheme.typography.pxToRem(20), fontWeight: 600 },
  h6: { fontSize: defaultTheme.typography.pxToRem(18), fontWeight: 600 },
  subtitle1: { fontSize: defaultTheme.typography.pxToRem(18) },
  subtitle2: { fontSize: defaultTheme.typography.pxToRem(14), fontWeight: 500 },
  body1: { fontSize: defaultTheme.typography.pxToRem(14) },
  body2: { fontSize: defaultTheme.typography.pxToRem(14), fontWeight: 400 },
  caption: { fontSize: defaultTheme.typography.pxToRem(12), fontWeight: 400 },
};

// Shape
export const shape = { borderRadius: 8 };

// Shadows
export const shadows = customShadows;
