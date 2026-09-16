import { ActivityIndicator, FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';

import { PokemonListItem } from '../../components';
import { usePokemonList } from '../../hooks';
import { usePokedexNavigation } from '../../navigation';
import { colors, HEADING_FONT_FAMILY } from '../../../shared/constants';

export function PokemonListScreen() {
  const state = usePokemonList();
  const { goToDetail } = usePokedexNavigation();

  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <SafeAreaView style={styles.centered} testID="pokemon-list-loading">
        <ActivityIndicator color={colors.pokedexRed} size="large" />
      </SafeAreaView>
    );
  }

  if (state.status === 'error') {
    return (
      <SafeAreaView style={styles.centered} testID="pokemon-list-error">
        <Text style={styles.message}>{state.error ?? 'Ocurrió un error inesperado.'}</Text>
      </SafeAreaView>
    );
  }

  const pokemonList = state.data ?? [];

  if (pokemonList.length === 0) {
    return (
      <SafeAreaView style={styles.centered} testID="pokemon-list-empty">
        <Text style={styles.message}>No hay pokémon para mostrar.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.list}>
      <FlatList
        testID="pokemon-list"
        style={styles.list}
        data={pokemonList}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <PokemonListItem pokemon={item} onPress={goToDetail} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.nearBlack,
    padding: 24,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 24,
  },
  list: {
    flex: 1,
    backgroundColor: colors.nearBlack,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  message: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 16,
    textAlign: 'center',
  },
});
