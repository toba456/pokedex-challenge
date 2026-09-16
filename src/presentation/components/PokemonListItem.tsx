import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PokemonListItem as PokemonListItemEntity } from '@domain/entities';
import { colors, HEADING_FONT_FAMILY, MONOSPACE_FONT_FAMILY, RADIUS } from '@shared/constants';
import { capitalize, formatPokemonId } from '@shared/utils';

interface PokemonListItemProps {
  pokemon: PokemonListItemEntity;
  onPress: (id: number) => void;
  isTablet?: boolean;
}

function PokemonListItemComponent({ pokemon, onPress, isTablet = false }: PokemonListItemProps) {
  const displayName = capitalize(pokemon.name);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isTablet && styles.containerTablet,
        pressed && styles.containerPressed,
      ]}
      onPress={() => onPress(pokemon.id)}
      testID={`pokemon-item-${pokemon.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${displayName}, número ${pokemon.id}, ver detalle`}
    >
      <View style={[styles.imageContainer, isTablet && styles.imageContainerTablet]}>
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={displayName}
        />
      </View>
      <View style={styles.info}>
        <Text style={[styles.id, isTablet && styles.idTablet]}>{formatPokemonId(pokemon.id)}</Text>
        <Text style={[styles.name, isTablet && styles.nameTablet]}>{pokemon.name}</Text>
      </View>
      <Text style={[styles.chevron, isTablet && styles.chevronTablet]}>›</Text>
    </Pressable>
  );
}

export const PokemonListItem = memo(PokemonListItemComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  containerPressed: {
    backgroundColor: colors.rowPressed,
  },
  containerTablet: {
    paddingHorizontal: 16,
    paddingVertical: 22,
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: RADIUS,
    backgroundColor: colors.imageBackdrop,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 16,
  },
  imageContainerTablet: {
    width: 108,
    height: 108,
    marginRight: 20,
  },
  image: {
    width: '78%',
    height: '78%',
  },
  info: {
    flex: 1,
  },
  id: {
    color: colors.offWhiteMuted,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 12,
  },
  idTablet: {
    fontSize: 15,
  },
  name: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 18,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  nameTablet: {
    fontSize: 26,
    marginTop: 4,
  },
  chevron: {
    color: colors.offWhiteMuted,
    fontSize: 24,
    marginLeft: 8,
  },
  chevronTablet: {
    fontSize: 30,
  },
});
