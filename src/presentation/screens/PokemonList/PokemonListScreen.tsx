import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { PokemonListItem } from '../../components';
import { usePokemonList } from '../../hooks';
import { usePokedexNavigation } from '../../navigation';
import { colors, HEADING_FONT_FAMILY } from '../../../shared/constants';

export function PokemonListScreen() {
  const state = usePokemonList();
  const { goToDetail } = usePokedexNavigation();

  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <View style={styles.centered} testID="pokemon-list-loading">
        <ActivityIndicator color={colors.pokedexRed} size="large" />
      </View>
    );
  }

  if (state.status === 'error') {
    return (
      <View style={styles.centered} testID="pokemon-list-error">
        <Text style={styles.message}>{state.error ?? 'Ocurrió un error inesperado.'}</Text>
      </View>
    );
  }

  const pokemonList = state.data ?? [];

  if (pokemonList.length === 0) {
    return (
      <View style={styles.centered} testID="pokemon-list-empty">
        <Text style={styles.message}>No hay pokémon para mostrar.</Text>
      </View>
    );
  }

  return (
    <FlatList
      testID="pokemon-list"
      style={styles.list}
      data={pokemonList}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <PokemonListItem pokemon={item} onPress={goToDetail} />}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.nearBlack,
    padding: 24,
  },
  list: {
    flex: 1,
    backgroundColor: colors.nearBlack,
  },
  message: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 16,
    textAlign: 'center',
  },
});
