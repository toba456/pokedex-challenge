import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PokemonListItem as PokemonListItemEntity } from '../../domain/entities';
import { colors, HEADING_FONT_FAMILY, MONOSPACE_FONT_FAMILY } from '../../shared/constants';

interface PokemonListItemProps {
  pokemon: PokemonListItemEntity;
  onPress: (id: number) => void;
}

export function PokemonListItem({ pokemon, onPress }: PokemonListItemProps) {
  return (
    <Pressable style={styles.container} onPress={() => onPress(pokemon.id)} testID={`pokemon-item-${pokemon.id}`}>
      <View style={styles.accentBar} />
      <Image source={{ uri: pokemon.imageUrl }} style={styles.image} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
        <Text style={styles.name}>{pokemon.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.nearBlack,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 4,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: colors.pokedexRed,
  },
  image: {
    width: 56,
    height: 56,
    marginHorizontal: 12,
  },
  info: {
    flex: 1,
    paddingVertical: 12,
  },
  id: {
    color: colors.offWhiteMuted,
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: 12,
  },
  name: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 18,
    marginTop: 2,
    textTransform: 'capitalize',
  },
});
