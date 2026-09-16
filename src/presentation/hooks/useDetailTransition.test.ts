import { act, renderHook } from '@testing-library/react-native';

import { useDetailTransition } from './useDetailTransition';

describe('useDetailTransition', () => {
  // Un solo renderHook por archivo: en este entorno de test, Animated con
  // useNativeDriver deja un act() pendiente ligado a su driver nativo
  // mockeado que no llega a resolverse entre tests, y una segunda instancia
  // del hook en el mismo archivo queda con result.current en null. Por eso
  // toda la cobertura (cierre normal + guard de doble tap) vive en un único
  // test, ejercitando el mismo flujo que ejercita App.integration.test.tsx.
  it('cierra una sola vez con onClosed aunque close() se llame varias veces seguidas (doble tap)', async () => {
    jest.useFakeTimers();
    const onClosed = jest.fn();

    const { result } = await renderHook(() => useDetailTransition(onClosed));

    act(() => {
      result.current.close();
      result.current.close();
      result.current.close();
      jest.runAllTimers();
    });

    expect(onClosed).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
