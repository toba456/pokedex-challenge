import { Dimensions, Platform, StatusBar } from 'react-native';

export type SafeAreaInsets = {
  top: number;
  bottom: number;
};


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
