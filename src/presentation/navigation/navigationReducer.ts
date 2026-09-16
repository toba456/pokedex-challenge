import { PokedexNavigationAction, PokedexNavigationState } from './types';

export const initialNavigationState: PokedexNavigationState = {
  screen: 'list',
  selectedPokemonId: null,
};

export function navigationReducer(
  state: PokedexNavigationState,
  action: PokedexNavigationAction,
): PokedexNavigationState {
  switch (action.type) {
    case 'GO_TO_DETAIL':
      return { screen: 'detail', selectedPokemonId: action.payload.id };
    case 'GO_TO_LIST':
      return { screen: 'list', selectedPokemonId: null };
    default:
      return state;
  }
}
