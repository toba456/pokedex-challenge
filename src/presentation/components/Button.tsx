import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, HEADING_FONT_FAMILY, RADIUS } from '@shared/constants';

type ButtonVariant = 'primary' | 'text' | 'icon';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant: ButtonVariant;
  testID?: string;
  accessibilityLabel?: string;
}

const TEXT_VARIANT_STYLES = {
  primary: { button: 'primaryButton', text: 'primaryButtonText' },
  text: { button: 'textButton', text: 'textButtonText' },
} as const;

export function Button({ label, onPress, variant, testID, accessibilityLabel }: ButtonProps) {
  const isIcon = variant === 'icon';

  return (
    <Pressable
      style={isIcon ? styles.iconButton : styles[TEXT_VARIANT_STYLES[variant].button]}
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      hitSlop={8}
    >
      {isIcon ? (
        <View style={styles.chevronLeft} />
      ) : (
        <Text style={styles[TEXT_VARIANT_STYLES[variant].text]}>{label}</Text>
      )}
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
  textButton: {
    borderWidth: 1,
    borderColor: colors.pokedexRed,
    borderRadius: RADIUS,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  textButtonText: {
    color: colors.pokedexRed,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 13,
    fontWeight: '600',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronLeft: {
    width: 12,
    height: 12,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: colors.white,
    transform: [{ rotate: '135deg' }],
    marginLeft: 4.5,
  },
});
