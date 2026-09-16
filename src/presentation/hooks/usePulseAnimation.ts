import { useEffect, useState } from 'react';
import { Animated } from 'react-native';

export function usePulseAnimation(): Animated.Value {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacity]);

  return opacity;
}
