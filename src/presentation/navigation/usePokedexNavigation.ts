import { useCallback, useContext } from 'react';

import { PokedexNavigationContext } from './PokedexNavigationContext';

export function usePokedexNavigation() {
  const context = useContext(PokedexNavigationContext);

  if (!context) {
    throw new Error('usePokedexNavigation debe usarse dentro de un PokedexNavigationProvider');
  }

  const { state, dispatch } = context;

  // dispatch es estable entre renders (garantía de useReducer), así que estos
  // callbacks también lo son: goToDetail llega sin cambiar de referencia a
  // PokemonListItem, condición necesaria para que su React.memo tenga efecto.
  const goToDetail = useCallback((id: number) => dispatch({ type: 'GO_TO_DETAIL', payload: { id } }), [dispatch]);
  const goToList = useCallback(() => dispatch({ type: 'GO_TO_LIST' }), [dispatch]);

  return {
    screen: state.screen,
    selectedPokemonId: state.selectedPokemonId,
    goToDetail,
    goToList,
  };
}
