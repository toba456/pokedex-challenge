import { PokemonListItem } from './PokemonListItem';

export interface PokemonListPage {
  items: PokemonListItem[];
  hasMore: boolean;
}
