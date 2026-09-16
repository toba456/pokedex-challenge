import { Animated, StyleSheet, View } from 'react-native';

import { usePulseAnimation } from '../hooks';
import { colors, RADIUS } from '@shared/constants';

interface PokemonListItemSkeletonProps {
  isTablet?: boolean;
}

export function PokemonListItemSkeleton({ isTablet = false }: PokemonListItemSkeletonProps) {
  const opacity = usePulseAnimation();

  return (
    <Animated.View
      style={[styles.container, isTablet && styles.containerTablet, { opacity }]}
      testID="pokemon-list-item-skeleton"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={[styles.imageContainer, isTablet && styles.imageContainerTablet]} />
      <View style={styles.info}>
        <View style={[styles.idBlock, isTablet && styles.idBlockTablet]} />
        <View style={[styles.nameBlock, isTablet && styles.nameBlockTablet]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  containerTablet: {
    paddingHorizontal: 16,
    paddingVertical: 22,
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: RADIUS,
    backgroundColor: colors.skeletonBlock,
    marginRight: 16,
  },
  imageContainerTablet: {
    width: 108,
    height: 108,
    marginRight: 20,
  },
  info: {
    flex: 1,
  },
  idBlock: {
    width: 40,
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
  },
  idBlockTablet: {
    width: 52,
    height: 15,
  },
  nameBlock: {
    width: 120,
    height: 18,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
    marginTop: 6,
  },
  nameBlockTablet: {
    width: 168,
    height: 26,
    marginTop: 8,
  },
});
