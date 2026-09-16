import { Animated, StyleSheet, View } from 'react-native';

import { usePulseAnimation } from '../hooks';
import { colors, RADIUS } from '../../shared/constants';

export function PokemonListItemSkeleton() {
  const opacity = usePulseAnimation();

  return (
    <Animated.View style={[styles.container, { opacity }]} testID="pokemon-list-item-skeleton">
      <View style={styles.imageContainer} />
      <View style={styles.info}>
        <View style={styles.idBlock} />
        <View style={styles.nameBlock} />
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
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: RADIUS,
    backgroundColor: colors.skeletonBlock,
    marginRight: 16,
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
  nameBlock: {
    width: 120,
    height: 18,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
    marginTop: 6,
  },
});
