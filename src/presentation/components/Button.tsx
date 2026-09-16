import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, HEADING_FONT_FAMILY, RADIUS } from '../../shared/constants';

type ButtonVariant = 'primary' | 'text';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant: ButtonVariant;
  testID?: string;
  accessibilityLabel?: string;
}

export function Button({ label, onPress, variant, testID, accessibilityLabel }: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={isPrimary ? styles.primaryButton : styles.textButton}
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      hitSlop={8}
    >
      <Text style={isPrimary ? styles.primaryButtonText : styles.textButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.pokedexRed,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: RADIUS,
    alignSelf: 'flex-start',
    marginTop: 28,
  },
  primaryButtonText: {
    color: colors.white,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 16,
  },
  textButton: {},
  textButtonText: {
    color: colors.white,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 13,
    fontWeight: '600',
  },
});
