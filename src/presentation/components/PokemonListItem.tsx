import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PokemonListItem as PokemonListItemEntity } from '../../domain/entities';
import { colors, HEADING_FONT_FAMILY, MONOSPACE_FONT_FAMILY, RADIUS } from '../../shared/constants';

interface PokemonListItemProps {
  pokemon: PokemonListItemEntity;
  onPress: (id: number) => void;
}

export function PokemonListItem({ pokemon, onPress }: PokemonListItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      onPress={() => onPress(pokemon.id)}
      testID={`pokemon-item-${pokemon.id}`}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: pokemon.imageUrl }} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.info}>
        <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
        <Text style={styles.name}>{pokemon.name}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

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
  name: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 18,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  chevron: {
    color: colors.offWhiteMuted,
    fontSize: 24,
    marginLeft: 8,
  },
});
