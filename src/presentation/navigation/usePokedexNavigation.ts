import { useContext } from 'react';

import { PokedexNavigationContext } from './PokedexNavigationContext';

// Nombre distinto a `useNavigation` de React Navigation a propósito: acá no hay
// ninguna librería de terceros involucrada, solo Context + useReducer (sección 5).
export function usePokedexNavigation() {
  const context = useContext(PokedexNavigationContext);

  if (!context) {
    throw new Error('usePokedexNavigation debe usarse dentro de un PokedexNavigationProvider');
  }

  const { state, dispatch } = context;

  return {
    screen: state.screen,
    selectedPokemonId: state.selectedPokemonId,
    goToDetail: (id: number) => dispatch({ type: 'GO_TO_DETAIL', payload: { id } }),
    goToList: () => dispatch({ type: 'GO_TO_LIST' }),
  };
}
