import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useIsLandscape, usePulseAnimation } from '../hooks';
import {
  colors,
  DETAIL_HERO_LANDSCAPE_RATIO,
  RADIUS,
  SHEET_RADIUS,
  TABLET_BREAKPOINT,
} from '@shared/constants';
import { getSafeAreaInsets } from '@shared/utils';

const STAT_ROW_KEYS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

function SkeletonFields({ isTablet }: { isTablet: boolean }) {
  return (
    <>
      <View style={[styles.idBlock, isTablet && styles.idBlockTablet]} />
      <View style={[styles.nameBlock, isTablet && styles.nameBlockTablet]} />

      <View style={[styles.chipRow, isTablet && styles.chipRowTablet]}>
        <View style={[styles.chipBlock, isTablet && styles.chipBlockTablet]} />
        <View style={[styles.chipBlock, isTablet && styles.chipBlockTablet]} />
      </View>

      <View style={[styles.metricsRow, isTablet && styles.metricsRowTablet]}>
        {['height', 'weight', 'base-experience'].map((key) => (
          <View key={key} style={styles.metric}>
            <View style={[styles.metricLabelBlock, isTablet && styles.metricLabelBlockTablet]} />
            <View style={[styles.metricValueBlock, isTablet && styles.metricValueBlockTablet]} />
          </View>
        ))}
      </View>

      <View style={[styles.sectionTitleBlock, isTablet && styles.sectionTitleBlockTablet]} />
      <View style={[styles.abilitiesBlock, isTablet && styles.abilitiesBlockTablet]} />

      <View style={[styles.sectionTitleBlock, isTablet && styles.sectionTitleBlockTablet]} />
      <View style={[styles.statsBlock, isTablet && styles.statsBlockTablet]}>
        {STAT_ROW_KEYS.map((key) => (
          <View key={key} style={[styles.statRow, isTablet && styles.statRowTablet]}>
            <View style={[styles.statLabelBlock, isTablet && styles.statLabelBlockTablet]} />
            <View style={[styles.statTrack, isTablet && styles.statTrackTablet]} />
            <View style={[styles.statValueBlock, isTablet && styles.statValueBlockTablet]} />
          </View>
        ))}
      </View>
    </>
  );
}

export function PokemonDetailSkeleton() {
  const opacity = usePulseAnimation();
  const { width, height } = useWindowDimensions();
  const isLandscape = useIsLandscape();
  const isTablet = Math.min(width, height) >= TABLET_BREAKPOINT;

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
            <View style={[styles.content, isTablet && styles.contentTablet]}>
              <SkeletonFields isTablet={isTablet} />
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
      <View style={[styles.hero, isTablet && styles.heroTablet]} />

      <View style={styles.sheet}>
        <View style={[styles.content, isTablet && styles.contentTablet]}>
          <SkeletonFields isTablet={isTablet} />
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
  heroTablet: {
    height: 420,
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
  contentTablet: {
    padding: 28,
    paddingTop: 36,
    paddingBottom: 28 + insets.bottom,
    gap: 6,
  },
  idBlock: {
    width: 48,
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
  },
  idBlockTablet: {
    width: 58,
    height: 17,
  },
  nameBlock: {
    width: 160,
    height: 28,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
    marginTop: 4,
  },
  nameBlockTablet: {
    width: 220,
    height: 40,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  chipRowTablet: {
    marginTop: 16,
  },
  chipBlock: {
    width: 72,
    height: 26,
    borderRadius: RADIUS,
    backgroundColor: colors.skeletonBlock,
  },
  chipBlockTablet: {
    width: 92,
    height: 36,
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 24,
  },
  metricsRowTablet: {
    marginTop: 32,
    gap: 36,
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
  metricLabelBlockTablet: {
    width: 52,
    height: 14,
  },
  metricValueBlock: {
    width: 56,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
    marginTop: 2,
  },
  metricValueBlockTablet: {
    width: 72,
    height: 22,
  },
  sectionTitleBlock: {
    width: 100,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
    marginTop: 28,
    marginBottom: 8,
  },
  sectionTitleBlockTablet: {
    width: 124,
    height: 20,
    marginTop: 36,
    marginBottom: 12,
  },
  abilitiesBlock: {
    width: '70%',
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
  },
  abilitiesBlockTablet: {
    height: 17,
  },
  statsBlock: {
    gap: 10,
  },
  statsBlockTablet: {
    gap: 14,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statRowTablet: {
    gap: 14,
  },
  statLabelBlock: {
    width: 84,
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
  },
  statLabelBlockTablet: {
    width: 104,
    height: 14,
  },
  statTrack: {
    flex: 1,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.statTrack,
  },
  statTrackTablet: {
    height: 12,
  },
  statValueBlock: {
    width: 30,
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.skeletonBlock,
  },
  statValueBlockTablet: {
    width: 40,
    height: 15,
  },
});
