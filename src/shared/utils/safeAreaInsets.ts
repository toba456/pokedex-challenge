import { Dimensions, Platform, StatusBar } from 'react-native';

export type SafeAreaInsets = {
  top: number;
  bottom: number;
};

// Alto mínimo (en puntos) del lado más largo de la pantalla en un iPhone con notch/Dynamic
// Island (iPhone X en adelante). No hay forma de leer el inset real sin
// react-native-safe-area-context, descartada en CLAUDE.md sección 5 por el bloat que arrastra
// para una app de 2 pantallas; esta heurística por tamaño de pantalla es el trade-off manual.
const IOS_NOTCH_MIN_HEIGHT = 812;
const IOS_NOTCH_INSETS: SafeAreaInsets = { top: 47, bottom: 34 };
const IOS_LEGACY_INSETS: SafeAreaInsets = { top: 20, bottom: 0 };

export function getSafeAreaInsets(): SafeAreaInsets {
  if (Platform.OS === 'android') {
    return { top: StatusBar.currentHeight ?? 0, bottom: 0 };
  }

  if (Platform.OS === 'ios') {
    const { height, width } = Dimensions.get('window');
    const hasNotch = Math.max(height, width) >= IOS_NOTCH_MIN_HEIGHT;
    return hasNotch ? IOS_NOTCH_INSETS : IOS_LEGACY_INSETS;
  }

  return { top: 0, bottom: 0 };
}
