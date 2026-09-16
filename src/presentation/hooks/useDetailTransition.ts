import { useEffect, useRef, useState } from 'react';
import { Animated, useWindowDimensions } from 'react-native';

const TRANSITION_DURATION_MS = 220;

export function useDetailTransition(onClosed: () => void) {
  const { width } = useWindowDimensions();
  const [progress] = useState(() => new Animated.Value(0));
  const isClosingRef = useRef(false);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: TRANSITION_DURATION_MS,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const close = () => {
    if (isClosingRef.current) {
      return;
    }
    isClosingRef.current = true;

    Animated.timing(progress, {
      toValue: 0,
      duration: TRANSITION_DURATION_MS,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onClosed();
      }
    });
  };

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [width, 0] });

  return {
    animatedStyle: { transform: [{ translateX }], opacity: progress },
    close,
  };
}
