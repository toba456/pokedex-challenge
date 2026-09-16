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
  heroImage: {
    width: 220,
    height: 220,
  },
  sheet: {
    marginTop: -SHEET_RADIUS,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    backgroundColor: colors.nearBlack,
    overflow: 'hidden',
  },
  content: {
    alignSelf: 'center',
    padding: 20,
    paddingTop: 28,
    paddingBottom: 20 + insets.bottom,
    gap: 4,
  },
  id: {
    color: colors.offWhiteMuted,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 14,
  },
  name: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 28,
    textTransform: 'capitalize',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 13,
    textTransform: 'capitalize',
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 24,
  },
  metric: {
    gap: 2,
  },
  metricLabel: {
    color: colors.offWhiteMuted,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 12,
  },
  metricValue: {
    color: colors.offWhite,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 16,
  },
  sectionTitle: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 16,
    marginTop: 28,
    marginBottom: 8,
  },
  abilities: {
    color: colors.offWhite,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  statsBlock: {
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statLabel: {
    color: colors.offWhiteMuted,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 12,
    width: 84,
  },
  statTrack: {
    flex: 1,
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.statTrack,
    overflow: 'hidden',
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
});
