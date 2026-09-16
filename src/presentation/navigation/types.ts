export type PokedexScreen = 'list' | 'detail';

export interface PokedexNavigationState {
  screen: PokedexScreen;
  selectedPokemonId: number | null;
}

export type PokedexNavigationAction =
  | { type: 'GO_TO_DETAIL'; payload: { id: number } }
  | { type: 'GO_TO_LIST' };
