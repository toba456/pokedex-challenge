import { StyleSheet } from 'react-native';

import {
  colors,
  HEADING_FONT_FAMILY,
  MONOSPACE_FONT_FAMILY,
  RADIUS,
  SHEET_RADIUS,
} from '@shared/constants';
import { getSafeAreaInsets } from '@shared/utils';

const insets = getSafeAreaInsets();

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  floatingBackButton: {
    position: 'absolute',
    top: insets.top + 12,
    left: 16,
    zIndex: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.nearBlack,
  },
  centeredSafe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.nearBlack,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    padding: 24,
    gap: 24,
  },
  message: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 16,
    textAlign: 'center',
  },
  hero: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTablet: {
    height: 420,
  },
  heroImage: {
    width: 220,
    height: 220,
  },
  heroImageTablet: {
    width: 300,
    height: 300,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetLandscape: {
    flex: 1,
    marginLeft: -SHEET_RADIUS,
    borderTopLeftRadius: SHEET_RADIUS,
    borderBottomLeftRadius: SHEET_RADIUS,
    backgroundColor: colors.nearBlack,
    overflow: 'hidden',
  },
  landscapeContentScroll: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
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
  id: {
    color: colors.offWhiteMuted,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 14,
  },
  idTablet: {
    fontSize: 17,
  },
  name: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 28,
    textTransform: 'capitalize',
  },
  nameTablet: {
    fontSize: 40,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  chipRowTablet: {
    marginTop: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS,
    borderWidth: 1,
  },
  chipTablet: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipText: {
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 13,
    textTransform: 'capitalize',
  },
  chipTextTablet: {
    fontSize: 16,
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
  metricLabel: {
    color: colors.offWhiteMuted,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 12,
  },
  metricLabelTablet: {
    fontSize: 14,
  },
  metricValue: {
    color: colors.offWhite,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 16,
  },
  metricValueTablet: {
    fontSize: 22,
  },
  sectionTitle: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 16,
    marginTop: 28,
    marginBottom: 8,
  },
  sectionTitleTablet: {
    fontSize: 20,
    marginTop: 36,
    marginBottom: 12,
  },
  abilities: {
    color: colors.offWhite,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  abilitiesTablet: {
    fontSize: 17,
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
  statLabel: {
    color: colors.offWhiteMuted,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 12,
    width: 84,
  },
  statLabelTablet: {
    fontSize: 14,
    width: 104,
  },
  statTrack: {
    flex: 1,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.statTrack,
    overflow: 'hidden',
  },
  statTrackTablet: {
    height: 12,
  },
  statFill: {
    height: '100%',
    borderRadius: 2,
  },
  statValue: {
    color: colors.offWhite,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 12,
    width: 30,
    textAlign: 'right',
  },
  statValueTablet: {
    fontSize: 15,
    width: 40,
  },
});
