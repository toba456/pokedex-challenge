import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { PokemonListItem } from '../../components';
import { usePokemonList } from '../../hooks';
import { usePokedexNavigation } from '../../navigation';
import { PokemonListItem as PokemonListItemEntity } from '../../../domain/entities';
import { colors, HEADING_FONT_FAMILY } from '../../../shared/constants';
import type { RequestState } from '../../../shared/types';
import { getSafeAreaInsets } from '../../../shared/utils';

function ItemSeparator() {
  return <View style={styles.separator} />;
}

function ListContent({
  state,
  onPress,
}: {
  state: RequestState<PokemonListItemEntity[]>;
  onPress: (id: number) => void;
}) {
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
      renderItem={({ item }) => <PokemonListItem pokemon={item} onPress={onPress} />}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
}

export function PokemonListScreen() {
  const state = usePokemonList();
  const { goToDetail } = usePokedexNavigation();

  return (
    <View style={styles.safeArea}>
      <Text style={styles.title}>Pokédex</Text>
      <ListContent state={state} onPress={goToDetail} />
    </View>
  );
}

const insets = getSafeAreaInsets();

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.nearBlack,
    paddingTop: insets.top,
  },
  title: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 30,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  list: {
    flex: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
  },
  message: {
    color: colors.offWhite,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 16,
    textAlign: 'center',
  },
});
