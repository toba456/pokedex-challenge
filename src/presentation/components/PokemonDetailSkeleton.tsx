import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';

import { usePulseAnimation } from '../hooks';
import { colors, DETAIL_HERO_LANDSCAPE_RATIO, RADIUS, SHEET_RADIUS } from '@shared/constants';
import { getSafeAreaInsets } from '@shared/utils';

const STAT_ROW_KEYS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

function SkeletonFields() {
  return (
    <>
      <View style={styles.idBlock} />
      <View style={styles.nameBlock} />

      <View style={styles.chipRow}>
        <View style={styles.chipBlock} />
        <View style={styles.chipBlock} />
      </View>

      <View style={styles.metricsRow}>
        {['height', 'weight', 'base-experience'].map((key) => (
          <View key={key} style={styles.metric}>
            <View style={styles.metricLabelBlock} />
            <View style={styles.metricValueBlock} />
          </View>
        ))}
      </View>

      <View style={styles.sectionTitleBlock} />
      <View style={styles.abilitiesBlock} />

      <View style={styles.sectionTitleBlock} />
      <View style={styles.statsBlock}>
        {STAT_ROW_KEYS.map((key) => (
          <View key={key} style={styles.statRow}>
            <View style={styles.statLabelBlock} />
            <View style={styles.statTrack} />
            <View style={styles.statValueBlock} />
          </View>
        ))}
      </View>
    </>
  );
}

export function PokemonDetailSkeleton() {
  const opacity = usePulseAnimation();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  if (isLandscape) {
    const heroWidth = Math.round(width * DETAIL_HERO_LANDSCAPE_RATIO);

    return (
      <Animated.View
        style={[styles.screen, { opacity }]}
        testID="pokemon-detail-skeleton"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View style={styles.landscapeRow}>
          <View style={[styles.heroLandscape, { width: heroWidth }]} />
          <View style={styles.sheetLandscape}>
            <View style={styles.content}>
              <SkeletonFields />
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[styles.screen, { opacity }]}
      testID="pokemon-detail-skeleton"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.hero} />

      <View style={styles.sheet}>
        <View style={styles.content}>
          <SkeletonFields />
        </View>
      </View>
    </Animated.View>
  );
}

const insets = getSafeAreaInsets();

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.nearBlack,
  },
  hero: {
    height: 300,
    backgroundColor: colors.skeletonBlock,
  },
  sheet: {
    marginTop: -SHEET_RADIUS,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    backgroundColor: colors.nearBlack,
    overflow: 'hidden',
  },
  landscapeRow: {
    flex: 1,
    flexDirection: 'row',
  },
  heroLandscape: {
    backgroundColor: colors.skeletonBlock,
  },
  sheetLandscape: {
    flex: 1,
    marginLeft: -SHEET_RADIUS,
    borderTopLeftRadius: SHEET_RADIUS,
    borderBottomLeftRadius: SHEET_RADIUS,
    backgroundColor: colors.nearBlack,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    paddingTop: 28,
    paddingBottom: 20 + insets.bottom,
    gap: 4,
  },
  idBlock: {
    width: 48,
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
  },
  nameBlock: {
    width: 160,
    height: 28,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  chipBlock: {
    width: 72,
    height: 26,
    borderRadius: RADIUS,
    backgroundColor: colors.skeletonBlock,
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 24,
  },
  metric: {
    gap: 2,
  },
  metricLabelBlock: {
    width: 44,
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
  },
  metricValueBlock: {
    width: 56,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
    marginTop: 2,
  },
  sectionTitleBlock: {
    width: 100,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
    marginTop: 28,
    marginBottom: 8,
  },
  abilitiesBlock: {
    width: '70%',
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
  },
  statsBlock: {
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statLabelBlock: {
    width: 84,
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
  },
  statTrack: {
    flex: 1,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.statTrack,
  },
  statValueBlock: {
    width: 30,
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
  },
});
