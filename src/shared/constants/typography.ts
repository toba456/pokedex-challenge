import { Platform } from 'react-native';

// Fuente rounded del sistema para titulares (sección 9): SF Rounded en iOS,
// Roboto (peso medium, la variante "amigable" disponible sin fuentes custom)
// en Android.
export const HEADING_FONT_FAMILY = Platform.select({
  ios: 'SF Rounded',
  android: 'sans-serif-medium',
  default: 'System',
});

// Monospace para datos tabulares reales (ids, stats, peso, altura): acá sí se
// justifica, a diferencia de usarla como recurso decorativo.
export const MONOSPACE_FONT_FAMILY = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});
