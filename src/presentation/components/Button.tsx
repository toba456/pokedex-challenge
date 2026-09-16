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
    // offWhiteMuted en vez de pokedexRed: el borde no necesita el peso del acento de
    // marca para leerse como tappable, y así se distingue con claridad de la
    // prominencia de primaryButton (relleno pokedexRed).
    borderWidth: 1,
    borderColor: colors.offWhiteMuted,
    borderRadius: RADIUS,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  textButtonText: {
    // Blanco puro en vez de pokedexRed: a 13px ni con fontWeight 600 llega al
    // umbral de "texto grande" (mínimo 14px con negrita), y pokedexRed sobre
    // nearBlack da 3.54:1, por debajo del 4.5:1 requerido. Se evita oscurecer
    // pokedexRed porque es el color de marca, usado en más lugares.
    color: colors.white,
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
