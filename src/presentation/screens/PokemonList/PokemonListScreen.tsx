import { memo, useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Button, PokemonListItem, PokemonListItemSkeleton } from '../../components';
import { usePokemonList } from '../../hooks';
import { useNavigationActions } from '../../navigation';
import { PokemonListItem as PokemonListItemEntity } from '@domain/entities';
import {
  colors,
  HEADING_FONT_FAMILY,
  LIST_CONTENT_WIDTH_LANDSCAPE_RATIO,
  LIST_MAX_CONTENT_WIDTH_LANDSCAPE,
  MAX_CONTENT_WIDTH,
} from '@shared/constants';
import type { RequestState } from '@shared/types';
import { getSafeAreaInsets } from '@shared/utils';

const SKELETON_ITEM_COUNT = 7;
const SKELETON_ITEM_KEYS = Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => index);
const ROW_HEIGHT = 104;
const SEPARATOR_HEIGHT = StyleSheet.hairlineWidth;
const ROW_STRIDE = ROW_HEIGHT + SEPARATOR_HEIGHT;
const INITIAL_NUM_TO_RENDER = 10;
const MAX_TO_RENDER_PER_BATCH = 10;

function keyExtractor(item: PokemonListItemEntity) {
  return String(item.id);
}

function getItemLayout(_data: ArrayLike<PokemonListItemEntity> | null | undefined, index: number) {
  return { length: ROW_HEIGHT, offset: ROW_STRIDE * index, index };
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

function ListSkeleton() {
  return (
    <View testID="pokemon-list-skeleton">
      {SKELETON_ITEM_KEYS.map((key) => (
        <View key={key}>
          <PokemonListItemSkeleton />
          <ItemSeparator />
        </View>
      ))}
    </View>
  );
}

function ListFooter({ isLoadingMore }: { isLoadingMore: boolean }) {
  if (!isLoadingMore) {
    return null;
  }

  return (
    <View style={styles.footer} testID="pokemon-list-loading-more">
      <ActivityIndicator color={colors.pokedexRed} size="small" />
    </View>
  );
}

function ListContent({
  state,
  onPress,
  onEndReached,
  isLoadingMore,
}: {
  state: RequestState<PokemonListItemEntity[]>;
  onPress: (id: number) => void;
  onEndReached: () => void;
  isLoadingMore: boolean;
}) {
  const renderItem = useCallback(
    ({ item }: { item: PokemonListItemEntity }) => <PokemonListItem pokemon={item} onPress={onPress} />,
    [onPress],
  );

  if (state.status === 'idle' || state.status === 'loading') {
    return <ListSkeleton />;
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
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      removeClippedSubviews
      initialNumToRender={INITIAL_NUM_TO_RENDER}
      maxToRenderPerBatch={MAX_TO_RENDER_PER_BATCH}
      ItemSeparatorComponent={ItemSeparator}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={<ListFooter isLoadingMore={isLoadingMore} />}
    />
  );
}

function LoadMoreError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.loadMoreErrorContainer} testID="pokemon-list-load-more-error">
      <Text style={styles.loadMoreErrorText}>{message}</Text>
      <Button
        variant="text"
        label="Reintentar"
        onPress={onRetry}
        testID="pokemon-list-load-more-retry"
        accessibilityLabel="Reintentar carga de más pokémon"
      />
    </View>
  );
}

function PokemonListScreenComponent() {
  const { state, loadMore, isLoadingMore, loadMoreError } = usePokemonList();
  const { goToDetail } = useNavigationActions();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const contentWidth = isLandscape
    ? Math.min(width * LIST_CONTENT_WIDTH_LANDSCAPE_RATIO, LIST_MAX_CONTENT_WIDTH_LANDSCAPE)
    : Math.min(width, MAX_CONTENT_WIDTH);

  return (
    <View style={styles.safeArea}>
      <View style={[styles.content, { width: contentWidth, alignSelf: isLandscape ? 'flex-start' : 'center' }]}>
        <Text style={styles.title}>Pokédex</Text>
        <ListContent state={state} onPress={goToDetail} onEndReached={loadMore} isLoadingMore={isLoadingMore} />
        {loadMoreError !== null && <LoadMoreError message={loadMoreError} onRetry={loadMore} />}
      </View>
    </View>
  );
}

export const PokemonListScreen = memo(PokemonListScreenComponent);

const insets = getSafeAreaInsets();

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.nearBlack,
    paddingTop: insets.top,
  },
  content: {
    flex: 1,
    alignSelf: 'center',
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
  footer: {
    paddingVertical: 20,
  },
  loadMoreErrorContainer: {
    alignItems: 'center',
    gap: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  loadMoreErrorText: {
    color: colors.offWhiteMuted,
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: 13,
    textAlign: 'center',
  },
});
