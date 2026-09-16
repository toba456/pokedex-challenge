import { Dimensions, Platform, StatusBar } from 'react-native';

import { getSafeAreaInsets } from './safeAreaInsets';

describe('getSafeAreaInsets', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('en Android usa StatusBar.currentHeight como top y 0 como bottom', () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'android' });
    Object.defineProperty(StatusBar, 'currentHeight', { get: () => 24, configurable: true });

    expect(getSafeAreaInsets()).toEqual({ top: 24, bottom: 0 });
  });

  it('en Android sin StatusBar.currentHeight devuelve 0', () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'android' });
    Object.defineProperty(StatusBar, 'currentHeight', { get: () => undefined, configurable: true });

    expect(getSafeAreaInsets()).toEqual({ top: 0, bottom: 0 });
  });

  it('en iOS con pantalla de notch (>=812pt) devuelve insets de notch', () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'ios' });
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 390, height: 844, scale: 3, fontScale: 1 });

    expect(getSafeAreaInsets()).toEqual({ top: 47, bottom: 34 });
  });

  it('en iOS con pantalla legacy (<812pt) devuelve insets legacy', () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'ios' });
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 375, height: 667, scale: 2, fontScale: 1 });

    expect(getSafeAreaInsets()).toEqual({ top: 20, bottom: 0 });
  });
});
